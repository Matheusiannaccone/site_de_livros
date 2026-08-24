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
│             │          │         │
│            RLS      Policies     │
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
Acesso a autenticação, banco, Storage e operações reutilizáveis.

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

A baseline aprovada para o MVP é a **Matriz RLS 1.0**, documentada em `11-Seguranca.md`.

Princípios principais:

```text
profiles
→ leitura pública
→ alteração somente pelo próprio usuário

books
→ público lê published
→ autor lê próprios rascunhos
→ escrita somente pelo autor

chapters
→ público lê somente chapter published de book published
→ escrita somente pelo autor do livro

genres
→ leitura pública
→ escrita bloqueada para usuário comum

book_genres
→ autorização derivada do livro

favorites
→ privados ao próprio usuário
```

Exemplo conceitual de autoria:

```text
Usuário autenticado
    │
    ├── pode ler livro publicado
    │
    └── pode alterar livro
            somente se author_id = auth.uid()
```

Para capítulos:

```text
chapter.book_id
        ↓
books.id
        ↓
books.author_id
        ↓
auth.uid()
```

A aplicação não deve confiar apenas no frontend para proteger operações.

RLS determina quem pode acessar linhas. Constraints, triggers e funções continuam responsáveis por regras estruturais que não são expressas apenas por autorização.

## 7. Storage

Capas e avatares serão armazenados no Supabase Storage.

O banco armazenará apenas a referência necessária ao arquivo.

### 7.1 Buckets

Buckets aprovados para o MVP:

```text
storage
├── covers/
└── avatars/
```

Ambos serão públicos para leitura.

A URL pública do arquivo não será tratada como segredo. As operações de escrita permanecem protegidas por policies do Supabase Storage.

### 7.2 Estrutura dos caminhos

```text
avatars/{user_id}/avatar.webp

covers/{book_id}/cover.webp
```

### 7.3 Propriedade

Para avatares:

```text
auth.uid()
    ↓
user_id do path
```

Somente o próprio usuário poderá enviar, substituir ou excluir seu avatar.

Para capas:

```text
book_id do path
    ↓
books.id
    ↓
books.author_id
    ↓
auth.uid()
```

Somente o autor atual do livro poderá enviar, substituir ou excluir a capa.

Uma obra preservada com `author_id = NULL` não terá sua capa modificável por usuários comuns.

### 7.4 Imagens de rascunhos

Uma capa de livro em rascunho poderá ser visualizada diretamente caso alguém obtenha sua URL pública.

Essa exposição fica limitada ao arquivo da imagem e não concede:

- acesso ao registro privado de `books`;
- acesso a capítulos privados;
- permissão de edição;
- bypass de RLS.

O UUID utilizado no caminho reduz descoberta acidental, mas não é mecanismo de segurança.

### 7.5 Pipeline de imagens

Entrada aceita:

```text
JPEG
PNG
WebP
```

Persistência:

```text
WebP
```

Fluxo:

```text
arquivo selecionado
       ↓
validação no frontend
       ↓
redimensionamento
       ↓
conversão client-side para WebP
       ↓
validação do resultado
       ↓
Supabase Storage
```

O MVP não utilizará transformação dinâmica de imagens no momento da leitura.

A estratégia prioriza:

- redução do tamanho armazenado;
- menor tráfego;
- formato uniforme;
- menor dependência de processamento dinâmico;
- simplicidade operacional.

Limites iniciais:

```text
avatar original/persistido: máximo 2 MB
capa original/persistida: máximo 5 MB
```

As policies/configurações do Storage devem reforçar tipo, tamanho, caminho e propriedade. A validação frontend não é autoridade de segurança.

Detalhes completos ficam em `11-Seguranca.md`.

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

O processamento simples de capas e avatares não exige função server-side no MVP, pois redimensionamento e conversão para WebP serão executados no cliente antes do upload.

## 10. Princípios arquiteturais

1. **MVP antes de incrementos.**
2. **Segurança no banco e Storage, não apenas na interface.**
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

### Enviar capa

```text
Arquivo JPEG/PNG/WebP
    ↓
Validação no navegador
    ↓
Redimensionamento
    ↓
Conversão WebP
    ↓
service de Storage
    ↓
Supabase Storage
    ↓
Policy valida autoria do book_id
    ↓
UPLOAD permitido ou negado
```

## 12. Evolução

A arquitetura deve permitir crescimento gradual sem exigir migração prematura para framework ou backend próprio.

Mudanças estruturais futuras devem ser avaliadas por necessidade real, volume de uso, requisitos de segurança ou complexidade funcional.

Possíveis evoluções de imagens:

- variantes pré-geradas;
- transformações dinâmicas;
- buckets privados para conteúdo que exija confidencialidade;
- formatos adicionais quando houver necessidade comprovada.
