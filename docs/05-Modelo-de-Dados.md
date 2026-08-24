# 05 — Modelo de Dados

## 1. Status

**Modelo conceitual do MVP aprovado para implementação.**

Este documento é a referência do schema persistido e das relações do banco.

Regras de negócio: `03-Regras-de-Negocio.md`.  
RLS e Storage: `11-Seguranca.md`.  
Objetos entregues ao frontend: `14-Contrato-Front-Supabase.md`.

## 2. Princípios

- PostgreSQL como banco principal;
- UUIDs para entidades dinâmicas;
- chave numérica para gêneros;
- FKs para relações;
- constraints para integridade;
- tabelas associativas para N:N;
- timestamps para auditoria básica;
- rascunhos podem ser incompletos, mas não estruturalmente inválidos.

## 3. Modelo conceitual

```text
auth.users
   │ 1:1
   ▼
profiles
   │ 1:N
   ▼
books
   │ 1:N
   ▼
chapters

books N:N genres
     via book_genres

profiles N:N books
         via favorites
```

Após preservação de obras na exclusão da conta, `books.author_id` pode ficar nulo.

## 4. Tabelas do MVP

### 4.1 `profiles`

| Campo | Tipo | Regra |
|---|---|---|
| `id` | `uuid` | PK e FK → `auth.users.id` |
| `username` | `text` | `NOT NULL`, `UNIQUE` |
| `display_name` | `text` | `NOT NULL` |
| `bio` | `text` | opcional |
| `avatar_path` | `text` | opcional |
| `created_at` | `timestamptz` | `NOT NULL`, default atual |
| `updated_at` | `timestamptz` | `NOT NULL`, atualizado em alterações |

`profiles` contém apenas dados aplicacionais públicos no MVP. Dados privados de autenticação não pertencem a essa tabela.

### 4.2 `books`

| Campo | Tipo | Regra |
|---|---|---|
| `id` | `uuid` | PK |
| `author_id` | `uuid` | FK → `profiles.id`; admite `NULL` após preservação |
| `title` | `text` | `NOT NULL` |
| `description` | `text` | opcional no rascunho |
| `cover_path` | `text` | opcional |
| `status` | `text` | `NOT NULL`, default `draft`, `CHECK` |
| `publication_status` | `text` | `NOT NULL`, default `ongoing`, `CHECK` |
| `language` | `text` | `NOT NULL`, default `pt-BR` |
| `created_at` | `timestamptz` | `NOT NULL`, default atual |
| `updated_at` | `timestamptz` | `NOT NULL`, atualizado |
| `published_at` | `timestamptz` | nulo até publicação |

`status`:

```sql
CHECK (status IN ('draft', 'published'))
```

`publication_status`:

```sql
CHECK (
  publication_status IN (
    'ongoing',
    'completed',
    'discontinued'
  )
)
```

`language`:

```text
text NOT NULL DEFAULT 'pt-BR'
```

Sem `CHECK` fechado para idiomas no MVP.

Requisitos mínimos de criação e publicação: `03-Regras-de-Negocio.md`, seção **Livros**.

### 4.3 `chapters`

| Campo | Tipo | Regra |
|---|---|---|
| `id` | `uuid` | PK |
| `book_id` | `uuid` | FK → `books.id`, `NOT NULL` |
| `title` | `text` | pode estar incompleto em rascunho |
| `content` | `text` | pode estar incompleto em rascunho |
| `position` | `integer` | `NOT NULL`, atribuída pelo banco |
| `status` | `text` | `NOT NULL`, default `draft`, `CHECK` |
| `created_at` | `timestamptz` | `NOT NULL`, default atual |
| `updated_at` | `timestamptz` | `NOT NULL`, atualizado |
| `published_at` | `timestamptz` | nulo até publicação |

Constraints essenciais:

```text
CHECK(position > 0)
UNIQUE(book_id, position)
CHECK(status IN ('draft', 'published'))
```

A posição é atribuída pelo banco:

```text
primeiro capítulo → 1
demais → MAX(position) + 1
```

Regras de sequência, exclusão e publicação: `03-Regras-de-Negocio.md`, seção **Capítulos**.

### 4.4 `genres`

| Campo | Tipo | Regra |
|---|---|---|
| `id` | `integer` | PK |
| `name` | `text` | `NOT NULL`, `UNIQUE` |
| `slug` | `text` | `NOT NULL`, `UNIQUE` |

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

| Campo | Tipo | Regra |
|---|---|---|
| `book_id` | `uuid` | FK → `books.id` |
| `genre_id` | `integer` | FK → `genres.id` |

```text
PRIMARY KEY (book_id, genre_id)
```

Cada livro deve manter entre 1 e 3 gêneros.

Uma constraint por linha não garante a quantidade total; a migration deve utilizar mecanismo adequado para preservar essa integridade.

### 4.6 `favorites`

| Campo | Tipo | Regra |
|---|---|---|
| `user_id` | `uuid` | FK → `profiles.id` |
| `book_id` | `uuid` | FK → `books.id` |
| `created_at` | `timestamptz` | `NOT NULL`, default atual |

```text
PRIMARY KEY (user_id, book_id)
```

Isso impede duplicação do mesmo favorito.

Privacidade e autorização: `11-Seguranca.md`, seção **Matriz de Autorização RLS**.

## 5. Relações

| Origem | Relação | Destino |
|---|---|---|
| `auth.users` | 1:1 | `profiles` |
| `profiles` | 1:N | `books` enquanto houver autoria ativa |
| `books` | 1:N | `chapters` |
| `books` | N:N | `genres` via `book_genres` |
| `profiles` | N:N | `books` via `favorites` |

## 6. Exclusões e chaves estrangeiras

### `profiles → books`

```text
books.author_id → profiles.id
ON DELETE SET NULL
```

Não usar `CASCADE`, pois obras podem ser preservadas.

### Relações pessoais

```text
favorites.user_id → profiles.id
ON DELETE CASCADE
```

### Dependências de livro

```text
chapters.book_id → books.id
ON DELETE CASCADE

book_genres.book_id → books.id
ON DELETE CASCADE

favorites.book_id → books.id
ON DELETE CASCADE
```

A remoção de arquivos do Storage não é resolvida por FK e deve ser tratada pelo fluxo correspondente.

Regras funcionais de exclusão: `03-Regras-de-Negocio.md`, seções **Capítulos** e **Exclusão de conta e conteúdo**.

## 7. Integridade de publicação

Critérios de publicação pertencem às regras de negócio e estão em `03-Regras-de-Negocio.md`.

O banco deve impedir transições inválidas conforme a estratégia de segurança definida em `11-Seguranca.md`.

## 8. Índices preliminares

Candidatos:

- `books(author_id)`;
- `books(status, published_at)`;
- `books(publication_status)`;
- `chapters(book_id, position)`;
- `favorites(user_id)`;
- `book_genres(genre_id, book_id)`.

Criar somente índices justificados por consultas reais.

## 9. Busca

A busca inicial pode considerar:

- título;
- autor, quando houver;
- gênero.

Full Text Search e ranking por relevância serão avaliados quando a busca real exigir.

## 10. Integridade resumida

```text
genres.id → integer PK
genres.name → UNIQUE
genres.slug → UNIQUE

books.title → NOT NULL
books.status → CHECK
books.publication_status → CHECK
books.language → DEFAULT 'pt-BR'

chapters.position > 0
UNIQUE(book_id, position)

book_genres → PK composta
favorites → PK composta

books.author_id → FK anulável após preservação
chapters.book_id → FK obrigatória
```

## 11. Contrato com o frontend

Este documento descreve o schema persistido.

A representação utilizada pela aplicação, incluindo `camelCase`, objetos aninhados, `BookSummary`, `BookDetail`, `Profile`, `Chapter`, `Genre`, `Favorite` e assinaturas de services, está em `14-Contrato-Front-Supabase.md`.

## 12. RLS e Storage

Não duplicar policies neste documento.

A fonte oficial é `11-Seguranca.md`, especialmente:

- **Matriz de Autorização RLS**;
- **Políticas por tabela**;
- **Storage**;
- **Uploads**.

## 13. Modelo visual

O DER do MVP deve representar:

- `auth.users`;
- `profiles`;
- `books`;
- `chapters`;
- `genres`;
- `book_genres`;
- `favorites`;
- PKs/FKs;
- cardinalidades;
- nulabilidade de `books.author_id`;
- ações relevantes de exclusão;
- constraints principais.

O DER deve permanecer sincronizado com o banco real.

## 14. Evolução

Tabelas para histórico, comentários, avaliações, seguidores e outros recursos só devem ser modeladas quando entrarem efetivamente no escopo.

Roadmap: `08-Backlog-e-Roadmap.md`.
