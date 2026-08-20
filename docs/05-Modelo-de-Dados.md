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
- normalização suficiente para evitar duplicação desnecessária.

## 3. Modelo conceitual

```text
auth.users
   │
   │ 1:1
   ▼
profiles
   │
   │ 1:N
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
| `author_id` | `uuid` | FK → `profiles.id`, obrigatório |
| `title` | `text` | obrigatório |
| `description` | `text` | obrigatório no momento definido pelo produto |
| `cover_path` | `text` | opcional |
| `status` | `text` ou enum | `draft`, `published` |
| `publication_status` | `text` ou enum | opcional se necessário para `ongoing/completed` |
| `language` | `text` | padrão inicial a definir |
| `created_at` | `timestamptz` | default atual |
| `updated_at` | `timestamptz` | atualizado em alterações |
| `published_at` | `timestamptz` | nulo até publicação |

> `status` representa visibilidade editorial. Caso o grupo queira diferenciar “em andamento” de “concluído”, usar um segundo campo evita misturar conceitos.

### 4.3 `chapters`

| Campo | Tipo sugerido | Regra |
|---|---|---|
| `id` | `uuid` | PK |
| `book_id` | `uuid` | FK → `books.id`, obrigatório |
| `title` | `text` | obrigatório |
| `content` | `text` | obrigatório para publicação |
| `position` | `integer` | obrigatório, > 0 |
| `status` | `text` ou enum | `draft`, `published` |
| `created_at` | `timestamptz` | default atual |
| `updated_at` | `timestamptz` | atualizado |
| `published_at` | `timestamptz` | nulo até publicação |

Constraint recomendada:

```text
UNIQUE(book_id, position)
```

Isso impede dois capítulos na mesma posição.

### 4.4 `genres`

| Campo | Tipo sugerido | Regra |
|---|---|---|
| `id` | inteiro ou uuid | PK |
| `name` | `text` | UNIQUE |
| `slug` | `text` | UNIQUE |

A lista deve ser controlada pela aplicação/administração do projeto.

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
| Profile | 1:N | Books |
| Book | 1:N | Chapters |
| Book | N:N | Genres |
| Profile | N:N | Books via Favorites |
| Profile | N:N | Chapters/Books via histórico futuro |
| Profile | N:N | Profiles via follows futuro |

## 7. Exclusões

Estratégia preliminar:

- exclusão de `book` deve tratar capítulos relacionados;
- relações associativas como `book_genres` e `favorites` não devem permanecer órfãs;
- exclusão de perfil exige cuidado porque envolve conteúdo autoral.

Não aplicar cascade indiscriminadamente em perfil de usuário sem analisar impacto.

## 8. Índices preliminares

Criar apenas os necessários ao uso real.

Candidatos:

- `books(author_id)`;
- `books(status, published_at)`;
- `chapters(book_id, position)`;
- `favorites(user_id)`;
- `book_genres(genre_id, book_id)`.

Para busca textual, avaliar índice de Full Text Search quando o recurso for implementado.

## 9. Busca

A busca inicial poderá considerar:

- título;
- nome do autor;
- gênero.

Evolução:

- descrição;
- tags;
- ranking por relevância;
- Full Text Search.

## 10. Integridade

Exemplos de regras que devem preferencialmente existir no banco:

```text
title NOT NULL
position > 0
UNIQUE(book_id, position)
UNIQUE(user_id, book_id) em favorites
FK author_id → profiles.id
FK book_id → books.id
```

## 11. RLS

Todas as tabelas expostas devem ter política definida.

Exemplo conceitual para `books`:

```text
SELECT:
- obra publicada: permitido conforme política pública;
- rascunho: apenas autor.

INSERT:
- usuário autenticado;
- author_id deve ser o próprio usuário.

UPDATE/DELETE:
- apenas quando author_id = auth.uid().
```

Detalhes ficam em `11-Seguranca.md`.

## 12. Diagrama a produzir

Antes da apresentação final, converter este modelo em um DER visual que mostre:

- PKs;
- FKs;
- cardinalidades;
- tabelas associativas.

O DER deverá refletir o banco real da versão apresentada, não apenas este rascunho.
