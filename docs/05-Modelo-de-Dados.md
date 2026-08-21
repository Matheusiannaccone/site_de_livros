# 05 — Modelo de Dados

## 1. Status

**Modelo preliminar do MVP.**  
Deve ser revisado antes da criação definitiva das migrations/tabelas.

## 2. Princípios

- PostgreSQL como banco principal;
- UUIDs onde forem adequados ao Supabase;
- chaves estrangeiras para relações;
- timestamps para auditoria básica;
- constraints para impedir estados inválidos;
- tabelas associativas para relações N:N;
- RLS nas tabelas expostas;
- normalização suficiente para evitar duplicação desnecessária;
- leitura pública limitada a conteúdo publicado;
- preservação opcional de obras após exclusão da conta do autor.

## 3. Modelo conceitual

```text
auth.users
   │
   │ 1:1
   ▼
profiles
   │
   │ 1:N enquanto houver autor ativo
   ▼
books
   │   │ \ N:N
   │  └──────── genres
   │
   │ 1:N
   ▼
chapters

profiles N:N books
       via favorites
```

> Após exclusão de uma conta com opção de preservar as obras, `books.author_id` poderá ficar nulo. A ausência do vínculo indica que o autor original não possui mais perfil ativo no sistema.

## 4. Tabelas do MVP

### 4.1 `profiles`

Perfil público/aplicacional associado ao usuário autenticado.

| Campo | Tipo sugerido | Regra |
|---|---|---|
| `id` | `uuid` | PK e referência ao usuário autenticado |
| `username` | `text` | UNIQUE, obrigatório |
| `display_name` | `text` | obrigatório |
| `bio` | `text` | opcional |
| `avatar_path` | `text` | opcional |
| `created_at` | `timestamptz` | default atual |
| `updated_at` | `timestamptz` | atualizado em alterações |

### 4.2 `books`

| Campo | Tipo sugerido | Regra |
|---|---|---|
| `id` | `uuid` | PK |
| `author_id` | `uuid` | FK → `profiles.id`, obrigatório durante autoria ativa; pode ser nulo após exclusão da conta com preservação |
| `title` | `text` | necessário para publicação |
| `description` | `text` | necessário para publicação |
| `cover_path` | `text` | opcional |
| `status` | `text` ou enum | `draft`, `published` |
| `publication_status` | `text` ou enum | `ongoing`, `completed`, `discontinued` |
| `language` | `text` | padrão inicial a definir |
| `created_at` | `timestamptz` | default atual |
| `updated_at` | `timestamptz` | atualizado em alterações |
| `published_at` | `timestamptz` | nulo até publicação |

`status` representa visibilidade editorial.

`publication_status` representa a situação da história e não deve substituir `status`.

Exemplos válidos:

```text
draft + ongoing
published + ongoing
published + completed
published + discontinued
```

Quando `author_id IS NULL`, a interface deve exibir **Autor desconhecido**.

Se uma obra preservada após exclusão do autor não estiver `completed`, sua situação deverá ser `discontinued`.

### 4.3 `chapters`

| Campo | Tipo sugerido | Regra |
|---|---|---|
| `id` | `uuid` | PK |
| `book_id` | `uuid` | FK → `books.id`, obrigatório |
| `title` | `text` | necessário para publicação |
| `content` | `text` | necessário para publicação |
| `position` | `integer` | obrigatório, > 0 |
| `status` | `text` ou enum | `draft`, `published` |
| `created_at` | `timestamptz` | default atual |
| `updated_at` | `timestamptz` | atualizado |
| `published_at` | `timestamptz` | nulo até publicação |

Constraint recomendada:

```text
UNIQUE(book_id, position)
CHECK(position > 0)
```

Isso impede dois capítulos na mesma posição e posições inválidas.

A regra de produto para publicação exige:

```text
char_length(content) BETWEEN 500 AND 15000
```

Esse limite deve ser validado no fluxo de publicação. Rascunhos podem possuir conteúdo menor que 500 caracteres.

### 4.4 `genres`

| Campo | Tipo sugerido | Regra |
|---|---|---|
| `id` | inteiro ou uuid | PK |
| `name` | `text` | UNIQUE |
| `slug` | `text` | UNIQUE |

A lista deve ser controlada pela aplicação/administração do projeto.

Lista inicial:

| Nome | Slug |
|---|---|
| Ação | `acao` |
| Aventura | `aventura` |
| Comédia | `comedia` |
| Drama | `drama` |
| Fantasia | `fantasia` |
| Ficção Científica | `ficcao-cientifica` |
| Mistério | `misterio` |
| Romance | `romance` |
| Suspense | `suspense` |
| Terror | `terror` |
| Ficção Histórica | `ficcao-historica` |
| Fanfic | `fanfic` |

### 4.5 `book_genres`

Tabela associativa.

| Campo | Tipo | Regra |
|---|---|---|
| `book_id` | `uuid` | FK → books |
| `genre_id` | conforme genres | FK → genres |

PK composta recomendada:

```text
PRIMARY KEY (book_id, genre_id)
```

A regra de negócio determina de 1 a 3 gêneros para publicação. Como uma constraint simples por linha não controla a quantidade total de associações, esse limite deverá ser garantido no fluxo de escrita/publicação e, se necessário, por mecanismo adicional no banco.

### 4.6 `favorites`

| Campo | Tipo | Regra |
|---|---|---|
| `user_id` | `uuid` | FK → profiles |
| `book_id` | `uuid` | FK → books |
| `created_at` | `timestamptz` | default atual |

PK composta:

```text
PRIMARY KEY (user_id, book_id)
```

A preservação de um livro após exclusão da conta do autor não remove favoritos de outros usuários.

## 5. Tabelas evolutivas

Não criar antes de a funcionalidade correspondente entrar no escopo.

### `reading_progress`

Possível estrutura:

```text
user_id
book_id
chapter_id
updated_at
```

### `comments`

Possível estrutura:

```text
id
user_id
chapter_id
content
created_at
updated_at
```

### `likes` ou `ratings`

Modelo depende da decisão futura entre curtida simples e avaliação numérica.

### `follows`

Possível relação usuário → usuário.

```text
follower_id
followed_id
created_at
```

## 6. Relações

| Origem | Relação | Destino |
|---|---|---|
| Profile | 1:N | Books enquanto houver autoria ativa |
| Book | 1:N | Chapters |
| Book | N:N | Genres |
| Profile | N:N | Books via Favorites |
| Profile | N:N | Chapters/Books via histórico futuro |
| Profile | N:N | Profiles via follows futuro |

Uma obra preservada após exclusão da conta pode existir com `author_id = NULL`, deixando de participar da relação ativa `Profile → Books`.

## 7. Exclusões

### 7.1 Exclusão de livro

Quando um livro for excluído, devem ser tratados também:

- capítulos relacionados;
- associações em `book_genres`;
- favoritos relacionados ao livro;
- arquivo de capa, quando houver.

Esses registros não devem permanecer órfãos.

### 7.2 Exclusão de conta com exclusão das obras

Quando o usuário escolher excluir também suas obras:

1. excluir as obras pertencentes ao autor e suas dependências;
2. excluir relações pessoais do usuário, como favoritos;
3. excluir o perfil;
4. excluir a identidade do provedor de autenticação por mecanismo protegido.

### 7.3 Exclusão de conta com preservação das obras

Quando o usuário escolher preservar suas obras:

1. remover o vínculo entre as obras mantidas e o perfil;
2. definir `author_id = NULL`;
3. manter os livros e capítulos publicados disponíveis conforme as regras de leitura pública;
4. exibir **Autor desconhecido** na interface;
5. alterar para `discontinued` toda obra preservada que não estiver `completed`;
6. remover relações pessoais do usuário que dependam da conta;
7. excluir o perfil;
8. excluir a identidade do provedor de autenticação por mecanismo protegido.

### 7.4 Estratégia de chaves estrangeiras

Não utilizar `ON DELETE CASCADE` de `profiles` para `books`.

Estratégia recomendada:

```text
books.author_id → profiles.id
ON DELETE SET NULL
```

Para relações estritamente dependentes do livro, `ON DELETE CASCADE` poderá ser utilizado quando revisado e testado, por exemplo em:

```text
chapters.book_id
book_genres.book_id
favorites.book_id
```

Para dados pessoais do usuário, relações como `favorites.user_id` também podem utilizar exclusão em cascata quando isso representar corretamente a regra do produto.

## 8. Critérios de publicação

### Livro

Para transição de `draft` para `published`, validar:

```text
title preenchido
description preenchida
1 <= quantidade_de_generos <= 3
pelo menos 1 capítulo com status = published
```

A capa não é obrigatória.

### Capítulo

Para transição de `draft` para `published`, validar:

```text
title preenchido
position (auto increment)
500 <= char_length(content) <= 15000
```

A contagem considera espaços e não inclui o título.

## 9. Índices preliminares

Criar apenas os necessários ao uso real.

Candidatos:

- `books(author_id)`;
- `books(status, published_at)`;
- `books(publication_status)`;
- `chapters(book_id, position)`;
- `favorites(user_id)`;
- `book_genres(genre_id, book_id)`.

Para busca textual, avaliar índice de Full Text Search quando o recurso for implementado.

## 10. Busca

A busca inicial poderá considerar:

- título;
- nome do autor, quando houver autor vinculado;
- gênero.

Para obras com `author_id = NULL`, a interface deve apresentar **Autor desconhecido**.

Evolução:

- descrição;
- tags;
- ranking por relevância;
- Full Text Search.

## 11. Integridade

Exemplos de regras que devem preferencialmente existir no banco:

```text
position > 0
UNIQUE(book_id, position)
UNIQUE(user_id, book_id) em favorites
FK author_id → profiles.id com possibilidade de NULL após preservação
FK book_id → books.id
status em conjunto controlado
publication_status em conjunto controlado
```

Nem todos os critérios de publicação precisam ser expressos como `NOT NULL` permanentes, pois rascunhos incompletos devem continuar possíveis.

## 12. RLS

Todas as tabelas expostas devem ter política definida.

Exemplo conceitual para `books`:

```text
SELECT:
- obra publicada: permitido para visitante anônimo ou autenticado;
- rascunho: apenas autor.

INSERT:
- usuário autenticado;
- author_id deve ser o próprio usuário.

UPDATE/DELETE:
- apenas quando author_id = auth.uid().
```

Exemplo conceitual para `chapters`:

```text
SELECT:
- capítulo publicado de obra publicada: permitido para visitante anônimo ou autenticado;
- rascunho: apenas autor da obra.

INSERT/UPDATE/DELETE:
- apenas autor da obra.
```

Obras preservadas com `author_id = NULL` continuam legíveis quando publicadas, mas não podem ser alteradas por usuários comuns.

Detalhes ficam em `11-Seguranca.md`.

## 13. Diagrama a produzir

Antes da apresentação final, converter este modelo em um DER visual que mostre:

- PKs;
- FKs;
- cardinalidades;
- tabelas associativas;
- nulabilidade de `books.author_id`;
- comportamento relevante de exclusão.

O DER deverá refletir o banco real da versão apresentada, não apenas este rascunho.
