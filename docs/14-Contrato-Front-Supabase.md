# 14 — Contrato Front ↔ Supabase

## 1. Objetivo

Definir a fronteira estável entre interface e camada de dados para permitir desenvolvimento paralelo com mocks e Supabase.

```text
Contrato Front ↔ Supabase: 1.0
```

Arquitetura de camadas: `04-Arquitetura.md`.

---

## 2. Princípio

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

```js
const result = await bookService.listPublishedBooks();
```

A chamada permanece igual com mock ou Supabase.

Adapters ficam em:

```text
js/services/adapters/
├── mock/
└── supabase/
```

Páginas e componentes não importam adapters diretamente.

---

## 3. Convenções

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

Adapters/services fazem a transformação.

---

## 4. Resposta padrão

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

O frontend não consome estrutura bruta de erro do Supabase/PostgreSQL.

## 4.1 Códigos de erro

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

# 5. Contratos de dados

## 5.1 `Profile`

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

Quando não houver autor ativo:

```js
author: null
```

A UI exibe **Autor desconhecido**.

## 5.2 `Genre`

```js
{
  id: 5,
  name: "Fantasia",
  slug: "fantasia"
}
```

## 5.3 `BookSummary`

Usado em cards/listas.

```js
{
  id: "uuid",
  title: "Título",

  author: {
    id: "uuid",
    username: "autor",
    displayName: "Nome",
    avatarUrl: null
  },

  coverUrl: null,
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

## 5.4 `BookDetail`

```js
{
  id: "uuid",
  authorId: "uuid",
  title: "Título",
  description: "Descrição",

  author: {
    id: "uuid",
    username: "autor",
    displayName: "Nome",
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

  createdAt: "...",
  updatedAt: "...",
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

## 5.5 `Chapter`

```js
{
  id: "uuid",
  bookId: "uuid",
  title: "Capítulo 1",
  content: "Texto...",
  position: 1,
  status: "draft",
  createdAt: "...",
  updatedAt: "...",
  publishedAt: null
}
```

A UI não define `position`.

## 5.6 `Favorite`

```js
{
  userId: "uuid",
  bookId: "uuid",
  createdAt: "...",
  book: {
    // BookSummary
  }
}
```

## 5.7 `AuthSession`

Quando aplicável, operações de autenticação podem retornar dados normalizados de sessão/usuário necessários à aplicação.

A UI não deve depender do formato bruto retornado pelo SDK do Supabase.

---

# 6. Contratos de entrada

## 6.1 Cadastro

```js
{
  email,
  password,
  username,
  displayName
}
```

`username` e `displayName` são enviados junto ao cadastro e disponibilizados ao trigger responsável por criar `profiles`.

A página não executa `INSERT` separado em `profiles`.

## 6.2 Login

```js
{
  email,
  password
}
```

## 6.3 Criar livro

```js
{
  title: "Título",
  genreIds: [5, 8]
}
```

Descrição pode ser enviada opcionalmente.

A UI não envia:

```text
authorId
status
publicationStatus
```

## 6.4 Atualizar livro

```js
{
  title?,
  description?,
  publicationStatus?,
  language?,
  genreIds?
}
```

Transferência de autoria não pertence a esse contrato.

## 6.5 Criar capítulo

```js
{
  title?,
  content?
}
```

`bookId` é argumento separado do service.

A UI não envia `position` nem `authorId`.

## 6.6 Atualizar capítulo

```js
{
  title?,
  content?
}
```

---

# 7. Interfaces de `js/services/`

## `authService`

```js
signUp({
  email,
  password,
  username,
  displayName
})

signIn({
  email,
  password
})

signOut()

getSession()

getCurrentUser()

onAuthStateChange(callback)
```

Responsabilidades:

- manter interface estável para as páginas;
- utilizar o adapter selecionado;
- normalizar respostas e erros;
- não expor erro bruto do Supabase;
- não duplicar criação manual de `profiles`.

O adapter Supabase é responsável pelas chamadas concretas a `supabase.auth`.

O adapter mock deve reproduzir o mesmo contrato externo.

## `profileService`

```js
getProfileByUsername(username)
getMyProfile()
updateMyProfile({ username, displayName, bio })
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

Paths físicos e regras de upload pertencem a `11-Seguranca.md`.

---

# 8. Seleção de adapter

Durante a fase atual, a seleção do datasource ocorre automaticamente por hostname:

```text
localhost / 127.0.0.1 → mock
outros hostnames       → supabase
```

Essa seleção deve ficar centralizada.

Services e páginas não devem exigir alteração para alternar entre mock e Supabase.

Se houver necessidade futura de usar Supabase real em localhost, a estratégia poderá ser substituída por configuração explícita sem alterar o contrato público dos services.

---

# 9. Mocks

Mocks simulam o **contrato do service**, não o schema bruto do banco.

Mock e adapter Supabase devem manter:

- mesmas propriedades;
- mesmos tipos;
- mesma nulabilidade;
- mesmos objetos aninhados;
- mesmos envelopes de resposta;
- mesmos códigos de erro.

Cenários mínimos de mock:

- sucesso;
- vazio;
- erro;
- não autenticado, quando aplicável;
- não autorizado, quando aplicável;
- não encontrado, quando aplicável.

Para autenticação, o mock deve reproduzir ao menos:

- cadastro válido;
- cadastro inválido;
- login válido;
- credenciais inválidas;
- sessão existente;
- ausência de sessão;
- logout.

---

# 10. Estados de interface

`loading` é controlado pela `page`.

Os demais estados derivam diretamente do contrato:

| Estado | Representação |
|---|---|
| sucesso | `data != null`, `error = null` |
| vazio | `data = []`, `error = null` |
| não autenticado | `UNAUTHENTICATED` |
| não autorizado | `FORBIDDEN` |
| não encontrado | `NOT_FOUND` |
| erro de rede | `NETWORK_ERROR` |

Fluxos visuais: `06-Fluxos-de-Usuario.md`.  
Padrões visuais: `07-Design-System.md`.

---

# 11. Normalização de erros de autenticação

O frontend não deve receber mensagens internas do Supabase diretamente.

Casos como:

- credenciais inválidas;
- e-mail já utilizado;
- username conflitante;
- dados obrigatórios ausentes;
- falha de rede;
- sessão inexistente;
- erro inesperado;

devem ser convertidos para os códigos definidos no contrato, principalmente:

```text
VALIDATION_ERROR
CONFLICT
UNAUTHENTICATED
NETWORK_ERROR
UNKNOWN_ERROR
```

A mensagem apresentada ao usuário deve ser adequada ao contexto da aplicação.

---

# 12. Exemplo

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

O mesmo código deve funcionar com mock e Supabase.

---

# 13. Organização física

A estrutura de `pages/`, `components/`, `services/` e adapters é definida em `04-Arquitetura.md`.

Este documento define **interfaces públicas**, não a disposição definitiva de cada arquivo além da fronteira arquitetural acordada.

---

# 14. Mudança de contrato

Exige revisão do contrato quando mudar:

- nome de propriedade consumida pela UI;
- tipo;
- nulabilidade relevante;
- assinatura de service;
- envelope de resposta;
- código de erro;
- semântica da operação.

Mudanças internas de query, join, índice ou adapter não alteram o contrato se a interface externa permanecer igual.

---

# 15. Regra de compatibilidade

Antes de substituir um mock por Supabase, confirmar:

- assinatura igual;
- mesmos campos;
- `camelCase` preservado;
- `null` preservado;
- vazio retorna `[]`;
- erros são normalizados;
- páginas não conhecem Supabase;
- componentes não conhecem persistência;
- RLS e banco continuam sendo autoridade real.
