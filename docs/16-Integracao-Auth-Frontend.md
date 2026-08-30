# 16 — Integração de Autenticação no Frontend

## 1. Objetivo

Orientar a implementação das páginas de **cadastro** e **login**.

O frontend não deve acessar o Supabase diretamente.

Fluxo esperado:

```text
Página
  ↓
authService
  ↓
Mock ou Supabase
```

---

## 2. Importação

Use as funções disponíveis em:

```text
js/services/authService.js
```

Exemplo:

```js
import {
  signUp,
  signIn,
  signOut,
  getSession,
  getCurrentUser
} from "./js/services/authService.js";
```

Ajuste apenas o caminho relativo conforme o arquivo que estiver fazendo o import.

---

## 3. Cadastro

Campos obrigatórios:

```text
email
password
username
displayName
```

Uso:

```js
const result = await signUp({
  email,
  password,
  username,
  displayName
});

if (result.error) {
  console.error(result.error.message);
  return;
}

// Cadastro realizado com sucesso.
```

### Regras principais

**Senha**

* mínimo de 6 caracteres.

**Username**

* entre 3 e 30 caracteres;
* somente letras minúsculas;
* pode usar `a-z`, `0-9`, `.` e `_`;
* sem espaços no início ou no final.

**Nome de exibição**

* máximo de 60 caracteres;
* sem espaços no início ou no final.

---

## 4. Login

Campos:

```text
email
password
```

Uso:

```js
const result = await signIn({
  email,
  password
});

if (result.error) {
  console.error(result.error.message);
  return;
}

// Login realizado com sucesso.
```

---

## 5. Tratamento de erros

As funções retornam:

```js
{
  data: ...,
  error: null
}
```

ou:

```js
{
  data: null,
  error: {
    code: "CODIGO",
    message: "Mensagem para o usuário."
  }
}
```

Principais códigos:

| Código             | Significado                          |
| ------------------ | ------------------------------------ |
| `VALIDATION_ERROR` | Dados inválidos                      |
| `CONFLICT`         | E-mail ou username já utilizado      |
| `UNAUTHENTICATED`  | Login inválido ou ausência de sessão |
| `NETWORK_ERROR`    | Falha de conexão                     |
| `UNKNOWN_ERROR`    | Erro inesperado                      |

A interface pode exibir diretamente `error.message`.

---

## 6. Ambientes de teste

### Mock

Abrir normalmente:

```text
http://localhost:3000/
```

O sistema utiliza o mock de autenticação.

### Supabase local

Abrir:

```text
http://localhost:3000/?datasource=supabase
```

O sistema utiliza o Supabase local.

---

## 7. O que NÃO fazer

As páginas não devem usar diretamente:

```js
supabase.auth.signUp()
supabase.auth.signInWithPassword()
supabase.auth.getSession()
supabase.from("profiles")
```

Use sempre o `authService`.

Isso permite trocar entre mock, Supabase local e produção sem alterar o código das páginas.
