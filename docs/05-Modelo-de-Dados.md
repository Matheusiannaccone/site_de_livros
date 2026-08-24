# 05 — Modelo de Dados

## 1. Status

**Modelo conceitual do MVP aprovado para implementação.**

Este documento passa a ser a referência para criação das migrations iniciais.

Mudanças posteriores no schema devem atualizar este documento e, quando relevantes, ser registradas em `13-Decisoes-Tecnicas.md`.

## 2. Princípios

- PostgreSQL como banco principal;
- UUIDs para entidades dinâmicas quando adequados ao Supabase;
- chave numérica para tabela controlada de gêneros;
- chaves estrangeiras para relações;
- timestamps para auditoria básica;
- constraints para impedir estados inválidos;
- tabelas associativas para relações N:N;
- RLS nas tabelas expostas;
- Matriz RLS 1.0 como baseline de autorização do MVP;
- validação de regras relevantes no frontend e novamente no banco/Storage;
- normalização suficiente para evitar duplicação desnecessária;
- leitura pública limitada a conteúdo publicado;
- preservação opcional de obras após exclusão da conta do autor;
- rascunhos podem ser incompletos, mas não estruturalmente inválidos.

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
   │   │
   │   │ N:N
   │   └──────── genres
   │          via book_genres
   │
   │ 1:N
   ▼
chapters

profiles N:N books
       via favorites
```

Após exclusão de uma conta com opção de preservar as obras, `books.author_id` poderá ficar nulo.

A ausência do vínculo indica que o autor original não possui mais perfil ativo no sistema.

## 4. Tabelas do MVP

### 4.1 `profiles`

Perfil público/aplicacional associado ao usuário autenticado.

| Campo | Tipo | Regra |
|---|---|---|
| `id` | `uuid` | PK e FK → `auth.users.id` |
| `username` | `text` | `NOT NULL`, `UNIQUE` |
| `display_name` | `text` | `NOT NULL` |
| `bio` | `text` | opcional |
| `avatar_path` | `text` | opcional; referência esperada para `avatars/{user_id}/avatar.webp` |
| `created_at` | `timestamptz` | `NOT NULL`, default atual |
| `updated_at` | `timestamptz` | `NOT NULL`, atualizado em alterações |

No MVP, os campos de `profiles` são considerados públicos para leitura.

Dados privados de autenticação não devem ser adicionados a essa tabela apenas por conveniência. Caso surjam campos privados futuros, sua exposição e modelagem deverão ser reavaliadas.

### 4.2 `books`

| Campo | Tipo | Regra |
|---|---|---|
| `id` | `uuid` | PK |
| `author_id` | `uuid` | FK → `profiles.id`; obrigatório durante autoria ativa, mas a coluna admite `NULL` após preservação |
| `title` | `text` | `NOT NULL` desde a criação |
| `description` | `text` | opcional no rascunho; obrigatória para publicação |
| `cover_path` | `text` | opcional; referência esperada para `covers/{book_id}/cover.webp` |
| `status` | `text` | `NOT NULL`, default `draft`, `CHECK` controlado |
| `publication_status` | `text` | `NOT NULL`, default `ongoing`, `CHECK` controlado |
| `language` | `text` | `NOT NULL`, default `pt-BR` |
| `created_at` | `timestamptz` | `NOT NULL`, default atual |
| `updated_at` | `timestamptz` | `NOT NULL`, atualizado em alterações |
| `published_at` | `timestamptz` | nulo até publicação |

Valores permitidos para `status`:

```text
draft
published
```

Implementação conceitual:

```sql
CHECK (status IN ('draft', 'published'))
```

Valores permitidos para `publication_status`:

```text
ongoing
completed
discontinued
```

Implementação conceitual:

```sql
CHECK (
  publication_status IN (
    'ongoing',
    'completed',
    'discontinued'
  )
)
```

Não será criado enum PostgreSQL para esses campos no MVP.

`language` será `text` com:

```text
DEFAULT 'pt-BR'
```

Não haverá `CHECK` restringindo idiomas no MVP, permitindo futura expansão sem alteração estrutural da coluna.

`status` representa visibilidade editorial.

`publication_status` representa a situação narrativa da história e não substitui `status`.

Exemplos válidos:

```text
draft + ongoing
published + ongoing
published + completed
published + discontinued
```

Quando `author_id IS NULL`, a interface deve exibir **Autor desconhecido**.

Se uma obra preservada após exclusão do autor não estiver `completed`, sua situação deverá ser `discontinued`.

#### Requisitos mínimos para criação

Um novo livro deve possuir:

```text
author_id válido
title preenchido
1 <= quantidade_de_generos <= 3
status = draft
publication_status = ongoing
language = pt-BR por padrão
```

Descrição, capa e capítulos ainda podem estar ausentes.

A criação do registro em `books` e das associações obrigatórias em `book_genres` deve ser tratada como uma operação lógica atômica.

O sistema não deve deixar persistido um livro sem gênero.

### 4.3 `chapters`

| Campo | Tipo | Regra |
|---|---|---|
| `id` | `uuid` | PK |
| `book_id` | `uuid` | FK → `books.id`, `NOT NULL` |
| `title` | `text` | pode estar incompleto em rascunho; obrigatório para publicação |
| `content` | `text` | pode estar incompleto em rascunho; obrigatório para publicação |
| `position` | `integer` | `NOT NULL`, > 0, atribuída pelo banco |
| `status` | `text` | `NOT NULL`, default `draft`, `CHECK` controlado |
| `created_at` | `timestamptz` | `NOT NULL`, default atual |
| `updated_at` | `timestamptz` | `NOT NULL`, atualizado |
| `published_at` | `timestamptz` | nulo até publicação |

Constraints essenciais:

```text
CHECK(position > 0)
UNIQUE(book_id, position)
```

Valores permitidos para `status`:

```text
draft
published
```

A posição de um capítulo novo será atribuída pelo banco segundo:

```text
nova_position = maior position atual do livro + 1
```

Para o primeiro capítulo:

```text
position = 1
```

No MVP:

- todo capítulo nasce no final;
- posições são contínuas;
- o usuário não define posição manualmente;
- não existe reordenação;
- não existe inserção entre capítulos existentes.

A regra de produto para publicação exige:

```text
title preenchido
char_length(content) BETWEEN 500 AND 15000
```

A contagem considera espaços e não inclui o título.

Rascunhos podem possuir conteúdo menor que 500 caracteres ou ainda não possuir título definitivo.

Para leitura pública, não basta `chapters.status = 'published'`: o livro pai também deve possuir `books.status = 'published'`.

### 4.4 `genres`

| Campo | Tipo | Regra |
|---|---|---|
| `id` | `integer` | PK |
| `name` | `text` | `NOT NULL`, `UNIQUE` |
| `slug` | `text` | `NOT NULL`, `UNIQUE` |

O `id` numérico será a identidade relacional interna.

O `slug` será o identificador legível utilizado pela aplicação, filtros e eventualmente URLs.

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

Usuários terão somente leitura dessa tabela no MVP.

### 4.5 `book_genres`

Tabela associativa entre livros e gêneros.

| Campo | Tipo | Regra |
|---|---|---|
| `book_id` | `uuid` | FK → `books.id` |
| `genre_id` | `integer` | FK → `genres.id` |

PK composta:

```text
PRIMARY KEY (book_id, genre_id)
```

Isso impede que o mesmo gênero seja associado duas vezes ao mesmo livro.

Cada livro deve manter:

```text
1 <= quantidade_de_generos <= 3
```

desde sua criação.

A regra deve ser validada:

```text
Frontend
+
Banco de dados
```

Uma constraint simples por linha não consegue garantir sozinha a quantidade total de associações.

A migration deverá implementar mecanismo de banco adequado para impedir mais de 3 associações e garantir que a operação de criação não deixe um livro persistido com zero gêneros.

A autorização de escrita em `book_genres` deriva da autoria do livro. `UPDATE` direto da associação não será utilizado no MVP; mudanças serão feitas por remoção e nova associação autorizadas.

### 4.6 `favorites`

| Campo | Tipo | Regra |
|---|---|---|
| `user_id` | `uuid` | FK → `profiles.id` |
| `book_id` | `uuid` | FK → `books.id` |
| `created_at` | `timestamptz` | `NOT NULL`, default atual |

PK composta:

```text
PRIMARY KEY (user_id, book_id)
```

Isso impede que o mesmo usuário favorite o mesmo livro duas vezes.

A preservação de um livro após exclusão da conta do autor não remove favoritos de outros usuários.

No MVP:

- a biblioteca/favoritos é privada;
- somente `user_id = auth.uid()` pode consultar, inserir ou excluir o próprio registro;
- `UPDATE` não é necessário;
- somente livros com `status = 'published'` podem ser adicionados aos favoritos.

## 5. Tabelas evolutivas

Não criar antes de a funcionalidade correspondente entrar no escopo.

### `reading_progress`

Possível estrutura futura:

```text
user_id
book_id
chapter_id
updated_at
```

### `comments`

Possível estrutura futura:

```text
id
user_id
chapter_id
content
created_at
updated_at
```

### `likes` ou `ratings`

O modelo depende da decisão futura entre curtida simples e avaliação numérica.

### `follows`

Possível relação usuário → usuário:

```text
follower_id
followed_id
created_at
```

Nenhuma dessas tabelas pertence ao schema inicial do MVP.

## 6. Relações

| Origem | Relação | Destino |
|---|---|---|
| `auth.users` | 1:1 | `profiles` |
| `profiles` | 1:N | `books` enquanto houver autoria ativa |
| `books` | 1:N | `chapters` |
| `books` | N:N | `genres` via `book_genres` |
| `profiles` | N:N | `books` via `favorites` |

Uma obra preservada após exclusão da conta pode existir com `author_id = NULL`, deixando de participar da relação ativa `profiles → books`.

## 7. Exclusões

### 7.1 Exclusão de livro

Quando um livro for excluído, devem ser tratados também:

- capítulos relacionados;
- associações em `book_genres`;
- favoritos relacionados ao livro;
- arquivo de capa, quando houver.

Registros dependentes não devem permanecer órfãos.

Estratégia:

```text
books → chapters
ON DELETE CASCADE

books → book_genres
ON DELETE CASCADE

books → favorites
ON DELETE CASCADE
```

A remoção do arquivo de capa no Storage deve ser tratada pelo fluxo de aplicação correspondente e só pode ocorrer quando a autorização de autoria for válida.

### 7.2 Exclusão de capítulo

No MVP, a exclusão de um capítulo na posição `N` deve excluir:

```text
position >= N
```

para o mesmo `book_id`.

Exemplo:

```text
1 2 3 4 5 6 7 8 9 10
```

Excluir posição `7`:

```text
1 2 3 4 5 6
```

Essa estratégia elimina a necessidade de renumeração no MVP.

A operação deve ocorrer somente para o autor autorizado da obra.

### 7.3 Exclusão de conta com exclusão das obras

Quando o usuário escolher excluir também suas obras:

1. excluir as obras pertencentes ao autor e suas dependências;
2. excluir relações pessoais do usuário, como favoritos;
3. excluir o perfil;
4. excluir a identidade do provedor de autenticação por mecanismo protegido.

### 7.4 Exclusão de conta com preservação das obras

Quando o usuário escolher preservar suas obras:

1. remover o vínculo entre as obras mantidas e o perfil;
2. definir `author_id = NULL`;
3. manter livros e capítulos publicados disponíveis conforme as regras de leitura pública;
4. exibir **Autor desconhecido** na interface;
5. alterar para `discontinued` toda obra preservada que não estiver `completed`;
6. remover relações pessoais do usuário que dependam da conta;
7. excluir o perfil;
8. excluir a identidade do provedor de autenticação por mecanismo protegido.

### 7.5 Estratégia de chaves estrangeiras

Não utilizar `ON DELETE CASCADE` de `profiles` para `books`.

Estratégia:

```text
books.author_id → profiles.id
ON DELETE SET NULL
```

Para relações pessoais:

```text
favorites.user_id → profiles.id
ON DELETE CASCADE
```

Para dependências de livro:

```text
chapters.book_id → books.id
ON DELETE CASCADE

book_genres.book_id → books.id
ON DELETE CASCADE

favorites.book_id → books.id
ON DELETE CASCADE
```

## 8. Critérios de publicação

### 8.1 Livro

Para transição de:

```text
draft → published
```

validar:

```text
title preenchido
description preenchida
1 <= quantidade_de_generos <= 3
pelo menos 1 capítulo com status = published
```

Título e gêneros já devem existir desde a criação.

A capa não é obrigatória.

### Validação

A validação será realizada em duas camadas:

```text
Frontend
→ feedback e UX

PostgreSQL
→ proteção obrigatória
```

No MVP, uma trigger do PostgreSQL deverá impedir a transição para `published` caso qualquer critério obrigatório não seja atendido.

A trigger deve atuar mesmo quando a tentativa de alteração vier diretamente pela API.

### 8.2 Capítulo

Para transição de `draft` para `published`, validar:

```text
title preenchido
position válida
500 <= char_length(content) <= 15000
```

A contagem considera espaços e não inclui o título.

As validações também devem ocorrer no frontend e no banco.

## 9. Índices preliminares

Criar apenas os necessários ao uso real.

Candidatos:

- `books(author_id)`;
- `books(status, published_at)`;
- `books(publication_status)`;
- `chapters(book_id, position)`;
- `favorites(user_id)`;
- `book_genres(genre_id, book_id)`.

`UNIQUE(book_id, position)` já cria suporte relevante para consultas por livro e posição.

Para busca textual, avaliar índice de Full Text Search somente quando o recurso correspondente for implementado.

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

Regras essenciais do banco:

```text
genres.id → integer PK

genres.slug → UNIQUE

books.title → obrigatório desde a criação

books.status →
CHECK ('draft', 'published')

books.publication_status →
CHECK ('ongoing', 'completed', 'discontinued')

books.language →
DEFAULT 'pt-BR'

1 <= gêneros por livro <= 3

chapters.position > 0

UNIQUE(book_id, position)

PRIMARY KEY (user_id, book_id)
em favorites

FK author_id → profiles.id
com possibilidade de NULL após preservação

FK book_id → books.id
```

Nem todos os critérios de publicação devem ser expressos como `NOT NULL` permanentes, pois descrição e conteúdo de capítulos podem permanecer incompletos durante o rascunho.

A distinção passa a ser:

```text
rascunho incompleto
→ permitido

registro estruturalmente inválido
→ não permitido
```

## 12. Contrato de dados para o frontend

O schema físico permanece em `snake_case`, mas o frontend não deve depender diretamente desse formato.

Os services/adapters transformarão registros do Supabase nos objetos estáveis definidos em `14-Contrato-Front-Supabase.md`.

Exemplos:

```text
profiles.display_name
→ profile.displayName

books.author_id
→ book.authorId

books.publication_status
→ book.publicationStatus

books.cover_path
→ book.coverUrl

profiles.avatar_path
→ profile.avatarUrl
```

Relacionamentos usados pela interface, como autor e gêneros de uma obra, podem ser entregues como objetos aninhados pelo service para evitar que páginas conheçam joins ou consultas adicionais.

### 12.1 Objetos principais

O contrato 1.0 define:

- `Profile`;
- `ProfileSummary`;
- `Genre`;
- `BookSummary`;
- `BookDetail`;
- `Chapter`;
- `Favorite`.

Esses objetos são contratos da aplicação e não novas tabelas.

### 12.2 Entradas de criação e edição

A interface não deve enviar campos cuja autoridade pertence à sessão ou ao banco.

```text
createBook
→ não recebe authorId
→ não recebe status

createChapter
→ não recebe authorId
→ não recebe position
```

A autoria deriva de `auth.uid()` e a posição do capítulo é atribuída pelo banco.

### 12.3 Listas vazias

Uma consulta válida sem registros deve retornar:

```js
{
  data: [],
  error: null
}
```

A ausência de resultados não deve ser representada como erro.

---

## 13. RLS

A baseline de autorização do MVP é a **Matriz RLS 1.0**, detalhada em `11-Seguranca.md`.

### `profiles`

```text
SELECT:
- público.

INSERT:
- somente usuário autenticado;
- id = auth.uid().

UPDATE:
- somente o próprio usuário.

DELETE:
- negado diretamente ao cliente;
- exclusão pelo fluxo protegido de conta.
```

### `books`

```text
SELECT:
- obra publicada: visitante anônimo ou autenticado;
- rascunho: apenas autor.

INSERT:
- usuário autenticado;
- author_id = auth.uid().

UPDATE/DELETE:
- somente autor enquanto author_id = auth.uid().
```

Alterações comuns não podem transferir autoria nem definir `author_id = NULL`.

### `chapters`

```text
SELECT:
- capítulo publicado de obra publicada: público;
- demais capítulos: apenas autor da obra.

INSERT/UPDATE/DELETE:
- apenas autor da obra.
```

A regra especial de exclusão sequencial deve ser aplicada no fluxo protegido de remoção.

### `genres`

```text
SELECT:
- público.

INSERT/UPDATE/DELETE:
- negado para usuários comuns.
```

### `book_genres`

```text
SELECT:
- público quando a obra está publicada;
- autor pode consultar associações das próprias obras.

INSERT/DELETE:
- somente autor da obra.

UPDATE:
- não utilizado/negado no MVP.
```

### `favorites`

```text
SELECT:
- somente user_id = auth.uid().

INSERT:
- somente user_id = auth.uid();
- livro deve estar published.

UPDATE:
- não utilizado no MVP.

DELETE:
- somente user_id = auth.uid().
```

Obras preservadas com `author_id = NULL` continuam legíveis quando publicadas, mas não podem ser alteradas por usuários comuns.

## 14. Referências de Storage no modelo

Os arquivos não fazem parte das tabelas principais; somente seus caminhos são persistidos.

Estrutura aprovada:

```text
profiles.avatar_path
→ avatars/{user_id}/avatar.webp

books.cover_path
→ covers/{book_id}/cover.webp
```

Os buckets serão públicos para leitura, mas mutações serão protegidas pelas policies do Supabase Storage.

O fato de uma capa possuir URL pública não altera a visibilidade do registro `books`.

## 15. Modelo visual

O DER do MVP deve representar:

- `auth.users`;
- `profiles`;
- `books`;
- `chapters`;
- `genres`;
- `book_genres`;
- `favorites`;
- PKs;
- FKs;
- cardinalidades;
- tabelas associativas;
- nulabilidade de `books.author_id`;
- ações relevantes de exclusão;
- constraints principais.

O DER deve permanecer sincronizado com o banco real implementado.

## 16. Melhorias pós-MVP relacionadas ao modelo

Ficam explicitamente fora do MVP:

- reordenação de capítulos;
- inserção de capítulo entre posições existentes;
- exclusão intermediária preservando capítulos posteriores;
- mecanismo de renumeração/reorganização;
- fluxo explícito de publicação por função/RPC `publish_book()`;
- interface completa de múltiplos idiomas;
- tabelas evolutivas descritas na seção 5;
- eventual revisão da Matriz RLS para versões `1.X`;
- buckets privados caso surja requisito real de confidencialidade de assets.
