# 14 — Contrato Front ↔ Supabase

## 1. Objetivo

Definir a fronteira estável entre a interface e a camada de dados do MVP.

O objetivo é permitir que frontend e integração com Supabase avancem em paralelo sem que páginas e componentes dependam da implementação real de banco, Auth ou Storage.

```text
Contrato Front ↔ Supabase: 1.0
```

---

## 2. Princípio arquitetural

```text
PAGE
  ↓
SERVICE
  ↓
ADAPTER
  ├── MOCK
  └── SUPABASE
```

A página conhece apenas o service.

Exemplo:

```js
const result = await bookService.listPublishedBooks();
```

A chamada deve permanecer igual com mock e com Supabase.

---

## 3. Responsabilidades

| Camada | Responsabilidade | Não deve fazer |
|---|---|---|
| `pages/` | coordenar carregamento, eventos, navegação e estados | chamar Supabase diretamente |
| `components/` | renderizar UI reutilizável | conhecer banco, Auth ou Storage |
| `services/` | expor operações estáveis | manipular DOM |
| adapter `mock` | reproduzir contratos e cenários | criar formatos próprios |
| adapter `supabase` | executar integração e normalizar dados | expor resposta bruta do SDK |
| PostgreSQL/RLS/Storage | integridade e autorização | cuidar de apresentação |

> Nenhum arquivo de `pages/` ou `components/` deve depender diretamente do SDK do Supabase.

---

## 4. Convenções

Banco/Supabase:

```text
snake_case
```

Aplicação:

```text
camelCase
```

Exemplos:

```text
display_name → displayName
author_id → authorId
cover_path → coverUrl
publication_status → publicationStatus
created_at → createdAt
```

A transformação é responsabilidade do service/adapter.

---

## 5. Resposta padrão

### Sucesso

```js
{
  data: ...,
  error: null
}
```

### Lista vazia

```js
{
  data: [],
  error: null
}
```

### Erro

```js
{
  data: null,
  error: {
    code: "ERROR_CODE",
    message: "Mensagem adequada à aplicação."
  }
}
```

O frontend não deve depender de mensagens ou estruturas brutas do Supabase/PostgreSQL.

---

## 6. Códigos de erro 1.0

```text
UNAUTHENTICATED
FORBIDDEN
NOT_FOUND
VALIDATION_ERROR
CONFLICT
NETWORK_ERROR
UNKNOWN_ERROR
```

---

# 7. Contratos de dados

## 7.1 `Profile`

```js
{
  id: "uuid",
  username: "usuario",
  displayName: "Nome público",
  bio: "Texto opcional",
  avatarUrl: "https://.../avatar.webp",
  createdAt: "2026-08-24T...",
  updatedAt: "2026-08-24T..."
}
```

Podem ser nulos:

```text
bio
avatarUrl
```

### `ProfileSummary`

```js
{
  id: "uuid",
  username: "usuario",
  displayName: "Nome público",
  avatarUrl: null
}
```

Em obra sem autor ativo:

```js
author: null
```

A interface exibe **Autor desconhecido**.

---

## 7.2 `Genre`

```js
{
  id: 5,
  name: "Fantasia",
  slug: "fantasia"
}
```

---

## 7.3 `BookSummary`

```js
{
  id: "uuid",
  title: "Título da obra",

  author: {
    id: "uuid",
    username: "autor",
    displayName: "Nome do Autor",
    avatarUrl: null
  },

  coverUrl: "https://.../cover.webp",
  status: "published",
  publicationStatus: "ongoing",
  language: "pt-BR",

  genres: [
    {
      id: 5,
      name: "Fantasia",
      slug: "fantasia"
    }
  ],

  publishedAt: "2026-08-24T..."
}
```

Podem ser nulos:

```text
author
coverUrl
publishedAt
```

---

## 7.4 `BookDetail`

```js
{
  id: "uuid",
  authorId: "uuid",
  title: "Título da obra",
  description: "Descrição",

  author: {
    id: "uuid",
    username: "autor",
    displayName: "Nome do Autor",
    avatarUrl: null
  },

  coverUrl: null,
  status: "draft",
  publicationStatus: "ongoing",
  language: "pt-BR",

  genres: [
    {
      id: 5,
      name: "Fantasia",
      slug: "fantasia"
    }
  ],

  createdAt: "2026-08-24T...",
  updatedAt: "2026-08-24T...",
  publishedAt: null
}
```

Podem ser nulos:

```text
authorId
description
author
coverUrl
publishedAt
```

---

## 7.5 `Chapter`

```js
{
  id: "uuid",
  bookId: "uuid",
  title: "Capítulo 1",
  content: "Texto...",
  position: 1,
  status: "draft",
  createdAt: "2026-08-24T...",
  updatedAt: "2026-08-24T...",
  publishedAt: null
}
```

A interface nunca define `position`.

---

## 7.6 `Favorite`

```js
{
  userId: "uuid",
  bookId: "uuid",
  createdAt: "2026-08-24T...",
  book: {
    // BookSummary
  }
}
```

---

# 8. Contratos de entrada

## 8.1 Criar livro

```js
{
  title: "Título",
  genreIds: [5, 8]
}
```

Opcionalmente:

```js
{
  title: "Título",
  description: "Descrição opcional",
  genreIds: [5, 8]
}
```

A UI não envia:

```text
authorId
status
publicationStatus
```

## 8.2 Atualizar livro

```js
{
  title,
  description,
  publicationStatus,
  language,
  genreIds
}
```

Campos podem ser opcionais conforme a operação.

## 8.3 Criar capítulo

```js
{
  title: "Título opcional",
  content: "Conteúdo opcional/incompleto"
}
```

A UI não envia:

```text
position
authorId
```

## 8.4 Atualizar capítulo

```js
{
  title,
  content
}
```

---

# 9. Interfaces de `js/services/`

## `profileService`

```js
getProfileByUsername(username)

getMyProfile()

updateMyProfile({
  username,
  displayName,
  bio
})
```

## `bookService`

```js
listPublishedBooks(filters?)

getPublishedBook(bookId)

listMyBooks()

getMyBook(bookId)

createBook({
  title,
  description?,
  genreIds
})

updateBook(bookId, {
  title?,
  description?,
  publicationStatus?,
  language?,
  genreIds?
})

publishBook(bookId)

unpublishBook(bookId)

deleteBook(bookId)
```

## `chapterService`

```js
listPublishedChapters(bookId)

getPublishedChapter(chapterId)

listMyChapters(bookId)

getMyChapter(chapterId)

createChapter(bookId, {
  title?,
  content?
})

updateChapter(chapterId, {
  title?,
  content?
})

publishChapter(chapterId)

unpublishChapter(chapterId)

deleteChapter(chapterId)
```

## `genreService`

```js
listGenres()
```

## `favoriteService`

```js
listFavorites()

isFavorite(bookId)

addFavorite(bookId)

removeFavorite(bookId)
```

## `imageService`

```js
uploadAvatar(file)

removeAvatar()

uploadBookCover(bookId, file)

removeBookCover(bookId)
```

A página não precisa conhecer os paths físicos do Storage.

---

# 10. Estratégia de mocks

Mocks simulam o **contrato do service**, não o schema bruto do banco.

Mock e adapter Supabase devem devolver os mesmos:

- nomes de propriedades;
- tipos;
- nulabilidade;
- objetos aninhados;
- listas;
- formatos de erro.

Pode existir configuração equivalente a:

```js
export const DATA_SOURCE = "mock";
```

e futuramente:

```js
export const DATA_SOURCE = "supabase";
```

A implementação exata pode mudar desde que a página não precise ser alterada.

Cenários mínimos:

```text
sucesso
vazio
erro
```

Quando aplicável:

```text
não autenticado
não autorizado
não encontrado
```

---

# 11. Estados de UI

## Loading

Responsabilidade da page enquanto aguarda o service.

## Sucesso

```js
{
  data: [...],
  error: null
}
```

## Vazio

```js
{
  data: [],
  error: null
}
```

Exemplos:

- Meus Livros vazio;
- Biblioteca vazia;
- busca sem resultados;
- nenhum capítulo publicado.

## Não encontrado

```js
{
  data: null,
  error: {
    code: "NOT_FOUND",
    message: "Livro não encontrado."
  }
}
```

## Não autenticado

```text
UNAUTHENTICATED
```

## Não autorizado

```text
FORBIDDEN
```

## Erro recuperável

```text
NETWORK_ERROR
```

---

# 12. Exemplo de uso

```js
const result = await bookService.listPublishedBooks();

if (result.error) {
  renderError(result.error);
  return;
}

if (result.data.length === 0) {
  renderEmpty();
  return;
}

renderBooks(result.data);
```

O mesmo código funciona com mock e Supabase.

---

# 13. Estrutura de arquivos prevista

```text
js/
├── components/
├── pages/
├── services/
│   ├── profile-service.js
│   ├── book-service.js
│   ├── chapter-service.js
│   ├── genre-service.js
│   ├── favorite-service.js
│   ├── image-service.js
│   ├── service-config.js
│   └── adapters/
│       ├── mock/
│       │   ├── profile-adapter.js
│       │   ├── book-adapter.js
│       │   ├── chapter-adapter.js
│       │   ├── genre-adapter.js
│       │   ├── favorite-adapter.js
│       │   └── image-adapter.js
│       └── supabase/
│           ├── profile-adapter.js
│           ├── book-adapter.js
│           ├── chapter-adapter.js
│           ├── genre-adapter.js
│           ├── favorite-adapter.js
│           └── image-adapter.js
└── mocks/
    └── data.js
```

A organização pode ser refinada sem alterar os contratos públicos dos services.

---

# 14. Critérios para alterar o contrato

Uma mudança de contrato ocorre quando houver alteração de:

- nome de propriedade consumida pela interface;
- tipo de dado;
- nulabilidade relevante;
- assinatura de service;
- estrutura de retorno;
- códigos de erro;
- semântica de uma operação.

Mudanças internas de query, índices, joins ou implementação do adapter não exigem alteração do contrato se a interface externa permanecer igual.

---

# 15. Checklist de integração

Antes de substituir mock por Supabase:

- [ ] assinatura do service permanece igual;
- [ ] objetos retornados mantêm os mesmos campos;
- [ ] nomes continuam em `camelCase`;
- [ ] `null` continua representado da mesma forma;
- [ ] lista vazia retorna `[]`;
- [ ] erros são convertidos para códigos do contrato;
- [ ] page não conhece Supabase;
- [ ] components continuam independentes de persistência;
- [ ] RLS e regras de negócio continuam sendo autoridade real.

---

# 16. Critério de aceite do contrato 1.0

O contrato será considerado aplicado quando:

1. a equipe de interface conseguir implementar páginas usando mocks estáveis;
2. a troca de mock por Supabase não exigir reestruturação das páginas;
3. responsabilidades entre `pages`, `services` e `components` estiverem claras;
4. formatos de `profile`, `book`, `chapter`, `genre` e `favorite` estiverem documentados;
5. assinaturas previstas dos services estiverem documentadas;
6. estados de sucesso, vazio e erro estiverem definidos.
