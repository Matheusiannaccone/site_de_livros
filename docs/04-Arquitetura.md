# 04 — Arquitetura

## 1. Objetivo

Descrever a arquitetura técnica de alto nível, os limites entre camadas e a organização geral do código.

Especificações detalhadas permanecem nos documentos especializados.

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
│             │          │         │
│            RLS      Policies     │
└──────────────────────────────────┘
```

A aplicação será predominantemente client-side no MVP.

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
├── css/
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

### 3.3 Responsabilidades

| Camada | Responsabilidade |
|---|---|
| `js/pages/` | inicialização, eventos, navegação e estados específicos da página |
| `js/components/` | UI reutilizável |
| `js/services/` | contratos e operações de acesso a dados/Auth/Storage |
| adapters | implementação concreta mock ou Supabase |
| `css/global.css` | tokens, reset, tipografia e estilos globais |
| `css/components.css` | componentes visuais reutilizáveis |

### 3.4 Fronteira Front ↔ Supabase

```text
PAGE
  ↓
SERVICE
  ↓
ADAPTER
  ├── mock
  └── supabase
```

`pages/` e `components/` não devem chamar Supabase diretamente.

Formatos de dados, assinaturas de services, respostas e mocks: `14-Contrato-Front-Supabase.md`.

## 4. Backend as a Service

O Supabase fornece:

- Auth;
- PostgreSQL;
- Row Level Security;
- Storage.

Realtime só será adicionado se houver necessidade funcional concreta.

## 5. Banco de dados

PostgreSQL é a fonte principal dos dados estruturados.

Relações principais:

```text
Usuário 1:N Livro
Livro 1:N Capítulo
Livro N:N Gênero
Usuário N:N Livro (favoritos)
```

Schema completo: `05-Modelo-de-Dados.md`.

## 6. Autenticação e autorização

Supabase Auth é responsável pela identidade.

RLS no PostgreSQL e policies do Storage são responsáveis pela autorização.

A Matriz RLS vigente e as regras de Storage ficam exclusivamente em `11-Seguranca.md`.

A interface pode ocultar ações indisponíveis para melhorar UX, mas isso não substitui autorização.

## 7. Storage

Capas e avatares são armazenados no Supabase Storage; o banco mantém apenas a referência necessária.

Buckets, paths, formato WebP, limites e regras de propriedade: `11-Seguranca.md`, seções **Storage** e **Uploads**.

## 8. Vercel

A Vercel hospeda a aplicação.

Fluxo:

```text
GitHub
  ↓
Pull Request
  ↓
main
  ↓
Vercel
  ↓
produção
```

Detalhes de ambiente e rollback: `12-Deploy-e-Ambientes.md`.

## 9. Funções server-side

Funções server-side serão usadas apenas quando uma operação exigir:

- segredo;
- privilégio administrativo;
- processamento protegido;
- lógica inadequada ao cliente.

Não devem ser adicionadas apenas por preferência arquitetural.

## 10. Princípios arquiteturais

1. MVP antes de incrementos.
2. Segurança no banco/Storage, não apenas na interface.
3. Módulos pequenos e com responsabilidade clara.
4. Evitar duplicação de lógica.
5. Separar UI, acesso a dados e regras de autorização.
6. Mobile first.
7. Decisões relevantes registradas em ADR.
8. Não adicionar complexidade sem benefício concreto.

## 11. Exemplo de operação

```text
Formulário
  ↓
page
  ↓
service
  ↓
adapter
  ↓
Supabase
  ↓
RLS/constraints/policies
  ↓
resultado normalizado
  ↓
page
```

A página recebe o mesmo contrato utilizando mock ou Supabase.

## 12. Evolução

Mudanças estruturais devem ser justificadas por necessidade real de produto, segurança, escala ou manutenção.

Decisões e justificativas: `13-Decisoes-Tecnicas.md`.
