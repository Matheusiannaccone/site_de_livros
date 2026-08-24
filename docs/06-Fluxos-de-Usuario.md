# 06 — Fluxos de Usuário

## 1. Objetivo

Mapear os caminhos principais da aplicação para orientar páginas, navegação, estados de interface e testes.

Regras detalhadas permanecem em `03-Regras-de-Negocio.md`.

---

## 2. Visitante

### 2.1 Descobrir e ler obra pública

```text
Home
  ↓
Selecionar livro publicado
  ↓
Página do livro
  ↓
Selecionar capítulo publicado
  ↓
Leitor
  ↓
Anterior / Próximo
```

A leitura pública não exige autenticação.

### 2.2 Cadastro

```text
Home/Login
  ↓
Cadastro
  ↓
Preencher dados
  ↓
Criar identidade no Auth
  ↓
Criar perfil
  ↓
Sessão autenticada
```

### 2.3 Login

```text
Login
  ↓
Credenciais
  ↓
Supabase Auth
  ├── inválidas → erro
  └── válidas → sessão + redirecionamento
```

---

## 3. Leitor autenticado

### 3.1 Adicionar à biblioteca

```text
Página do livro
  ↓
Adicionar à biblioteca
  ↓
favorite criado
  ↓
Interface atualizada
```

### 3.2 Remover da biblioteca

```text
Biblioteca/Página do livro
  ↓
Remover
  ↓
favorite excluído
  ↓
Interface atualizada
```

### 3.3 Buscar por gênero

```text
Home/Busca
  ↓
Selecionar gênero
  ↓
Consulta
  ↓
Livros publicados compatíveis
```

---

## 4. Escritor

Não existe conta separada de escritor.

### 4.1 Criar livro

```text
Meus livros
  ↓
Novo livro
  ↓
Título + 1 a 3 gêneros
  ↓
Salvar
  ↓
Livro em draft
```

Descrição e capa podem ser adicionadas depois.

### 4.2 Editar livro

```text
Meus livros
  ↓
Selecionar obra própria
  ↓
Editar
  ↓
Salvar
```

### 4.3 Criar capítulo

```text
Livro próprio
  ↓
Novo capítulo
  ↓
Título/conteúdo
  ↓
Salvar rascunho
```

A posição é atribuída pelo banco.

### 4.4 Publicar capítulo

```text
Editor
  ↓
Validar critérios
  ↓
Publicar
  ↓
status = published
```

Critérios: `03-Regras-de-Negocio.md`, RN-026.

### 4.5 Publicar livro

```text
Livro em draft
  ↓
Validar critérios
  ↓
Publicar
  ↓
status = published
  ↓
Obra disponível publicamente
```

Critérios: `03-Regras-de-Negocio.md`, RN-019C.

---

## 5. Autorização negada

```text
Ação restrita
  ↓
Supabase
  ↓
RLS/Policy
  ↓
operação negada
  ↓
service normaliza erro
  ↓
frontend exibe feedback
```

A interface não é a autoridade de segurança.

---

## 6. Estados importantes de UI

Os fluxos devem prever:

- carregando;
- sucesso;
- lista vazia;
- erro recuperável;
- não autenticado;
- não autorizado;
- não encontrado;
- confirmação antes de ação destrutiva.

Formato dos retornos dos services: `14-Contrato-Front-Supabase.md`.

---

## 7. Fluxos evolutivos

### Continuar lendo

```text
Leitor abre capítulo
  ↓
progresso salvo
  ↓
retorno futuro ao último ponto
```

### Leitura offline

```text
Conteúdo disponibilizado offline
  ↓
cache local
  ↓
leitura sem conexão
```

Esses fluxos não fazem parte do MVP e exigem desenho técnico próprio antes da implementação.
