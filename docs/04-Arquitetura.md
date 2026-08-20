# 04 — Arquitetura

## 1. Objetivo

Descrever a arquitetura técnica escolhida para o projeto, os limites entre as camadas e a organização esperada do código.

## 2. Visão geral

```text
┌──────────────────────────────────┐
│             VERCEL               │
│                                  │
│   HTML + CSS + JavaScript puro   │
└────────────────┬─────────────────┘
                 │
            supabase-js
                 │
┌────────────────▼─────────────────┐
│             SUPABASE             │
│                                  │
│  Auth   PostgreSQL   Storage     │
│             │                    │
│            RLS                   │
└──────────────────────────────────┘
```

A aplicação será predominantemente client-side no MVP. Funções server-side poderão ser adicionadas somente quando houver necessidade que não deva ser atendida diretamente pelo navegador.

## 3. Frontend

### 3.1 Tecnologias

- HTML5;
- CSS3;
- JavaScript moderno;
- ES Modules;
- Supabase JavaScript SDK.

Não serão utilizados frameworks frontend no escopo acadêmico atual.

### 3.2 Organização

Estrutura-alvo:

```text
/
├── assets/
│   ├── icons/
│   └── images/
├── css/
│   ├── global.css
│   ├── components.css
│   └── [pagina].css
├── docs/
├── js/
│   ├── components/
│   ├── pages/
│   └── services/
├── index.html
├── login.html
├── cadastro.html
├── livro.html
├── leitura.html
├── perfil.html
├── biblioteca.html
├── meus-livros.html
├── editar-livro.html
├── editar-capitulo.html
└── 404.html
```

Os nomes de páginas poderão mudar durante a implementação sem alterar os princípios arquiteturais.

### 3.3 Responsabilidades

**`js/pages/`**  
Código específico da inicialização e interação de cada página.

**`js/services/`**  
Acesso a autenticação, banco, storage e operações reutilizáveis.

**`js/components/`**  
Comportamentos e componentes de interface reutilizáveis.

**`css/global.css`**  
Tokens, reset, tipografia e estilos globais.

**`css/components.css`**  
Botões, cards, formulários, navegação e outros padrões reutilizáveis.

## 4. Backend as a Service

O Supabase será utilizado para reduzir infraestrutura própria mantendo PostgreSQL como banco principal.

### Serviços previstos

- Supabase Auth;
- PostgreSQL;
- Row Level Security;
- Supabase Storage.

Realtime só será utilizado se uma funcionalidade realmente justificar sua necessidade.

## 5. Banco de dados

O PostgreSQL será a fonte principal de dados estruturados.

A escolha se justifica pela presença de múltiplas relações:

```text
Usuário 1:N Livro
Livro 1:N Capítulo
Livro N:N Gênero
Usuário N:N Livro (favoritos)
```

O modelo completo está descrito em `05-Modelo-de-Dados.md`.

## 6. Autenticação e autorização

### Autenticação

O Supabase Auth será responsável pela identidade autenticada.

### Autorização

A autorização será feita por políticas RLS no PostgreSQL.

Exemplo conceitual:

```text
Usuário autenticado
    │
    ├── pode ler livro publicado
    │
    └── pode alterar livro
            somente se autor_id = auth.uid()
```

A aplicação não deve confiar apenas no frontend para proteger operações.

## 7. Storage

Imagens, como capas e avatares, serão armazenadas no Supabase Storage.

O banco armazenará a referência necessária ao arquivo.

Estrutura preliminar:

```text
storage
├── covers/
└── avatars/
```

A política exata de acesso será definida em `11-Seguranca.md`.

## 8. Vercel

A Vercel hospedará os arquivos públicos da aplicação.

O fluxo esperado é:

```text
GitHub
  ↓
branch integrada
  ↓
Vercel
  ↓
deploy
```

Preview Deployments poderão ser utilizados para revisão, caso a configuração do projeto permita.

## 9. Funções server-side futuras

Vercel Functions poderão ser consideradas para operações como:

- geração de arquivo para download;
- integração com serviço externo que exija segredo;
- processamento protegido;
- tarefas que não devem confiar em código executado no cliente.

Não deverão ser adicionadas apenas por preferência arquitetural. Toda função server-side deve resolver uma necessidade concreta.

## 10. Princípios arquiteturais

1. **MVP antes de incrementos.**
2. **Segurança no banco, não apenas na interface.**
3. **Módulos pequenos e com responsabilidade clara.**
4. **Evitar duplicação de lógica de acesso a dados.**
5. **Separar dados, interface e regras de acesso.**
6. **Mobile first como princípio de interface.**
7. **Decisões relevantes registradas em ADR.**
8. **Não adicionar complexidade sem benefício mensurável.**

## 11. Fluxo de uma operação típica

### Criar livro

```text
Formulário HTML
    ↓
Validação de interface
    ↓
service de livros
    ↓
Supabase SDK
    ↓
PostgreSQL
    ↓
RLS valida usuário
    ↓
INSERT permitido ou negado
```

## 12. Evolução

A arquitetura deve permitir crescimento gradual sem exigir migração prematura para framework ou backend próprio.

Mudanças estruturais futuras devem ser avaliadas por necessidade real, volume de uso, requisitos de segurança ou complexidade funcional.
