# 06 — Fluxos de Usuário

## 1. Objetivo

Mapear os caminhos principais da aplicação para orientar páginas, navegação, estados de interface e testes.

---

## 2. Visitante

### 2.1 Descobrir e ler obra pública

```text
Home
  ↓
Selecionar livro
  ↓
Página do livro
  ↓
Selecionar capítulo publicado
  ↓
Leitor
  ↓
Anterior / Próximo
```

A decisão sobre exigir login para leitura pública deve permanecer consistente em toda a aplicação. A recomendação inicial é permitir leitura pública de conteúdo publicado e exigir autenticação para ações pessoais.

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
  ↓
Home ou onboarding mínimo
```

### 2.3 Login

```text
Página de login
  ↓
Credenciais
  ↓
Supabase Auth
  ├── inválidas → mensagem de erro
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
Registro em favorites
  ↓
Interface confirma estado
```

### 3.2 Remover da biblioteca

```text
Biblioteca/Página do livro
  ↓
Remover
  ↓
Registro em favorites excluído
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
Listagem de livros publicados compatíveis
```

---

## 4. Escritor

Como não existe conta separada de escritor, esses fluxos ficam disponíveis ao mesmo usuário autenticado.

### 4.1 Criar livro

```text
Perfil / Meus livros
  ↓
Novo livro
  ↓
Título + gênero (descrição + capa opcionais na criação, obrigatórios na publicação)
  ↓
Salvar
  ↓
Livro em rascunho
```

### 4.2 Editar livro

```text
Meus livros
  ↓
Selecionar obra própria
  ↓
Editar
  ↓
Salvar alterações
```

### 4.3 Criar capítulo

```text
Meus livros
  ↓
Livro próprio
  ↓
Novo capítulo
  ↓
Título + conteúdo
  ↓
Salvar rascunho
```

### 4.4 Publicar capítulo

```text
Editor do capítulo
  ↓
Validar campos
  ↓
Publicar
  ↓
status = published
  ↓
Capítulo passa a ser elegível para leitura pública
```

### 4.5 Publicar livro

```text
Livro em rascunho
  ↓
Validar requisitos mínimos
  ↓
Publicar
  ↓
status = published
  ↓
Obra aparece em descoberta pública
```

A lista exata de pré-condições de publicação deve ser definida antes da implementação final.

---

## 5. Autorização negada

### Exemplo: usuário tenta alterar obra de outra pessoa

```text
Requisição de UPDATE
  ↓
RLS
  ↓
author_id != auth.uid()
  ↓
Operação negada
  ↓
Frontend exibe erro apropriado
```

O fluxo não deve depender de o botão de edição estar oculto.

---

## 6. Estados importantes de UI

Cada fluxo deve considerar:

- carregando;
- dados carregados;
- lista vazia;
- erro recuperável;
- erro de autorização;
- sessão expirada;
- ação concluída;
- confirmação antes de ação destrutiva.

---

## 7. Fluxos evolutivos

### Continuar lendo

```text
Leitor abre capítulo
  ↓
Progresso salvo
  ↓
Home/Biblioteca
  ↓
Continuar lendo
  ↓
Último ponto/capítulo
```

### Leitura offline

```text
Livro/capítulo
  ↓
Disponibilizar offline
  ↓
Conteúdo/cache armazenado localmente
  ↓
Sem internet
  ↓
Conteúdo previamente salvo continua disponível
```

Esse fluxo requer desenho técnico específico antes da implementação.
