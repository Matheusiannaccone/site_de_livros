# 13 — Decisões Técnicas (ADR)

## 1. Objetivo

Registrar decisões arquiteturais relevantes e suas justificativas.

Formato:

```text
ADR-XXX
Status
Contexto
Alternativas
Decisão
Consequências
```

---

# ADR-001 — Frontend sem framework

**Status:** Aceito

## Contexto

A disciplina exige HTML, CSS e JavaScript puro.

## Alternativas consideradas

- HTML/CSS/JS puro;
- frameworks frontend.

## Decisão

Utilizar HTML5, CSS3 e JavaScript moderno sem framework.

## Consequências

**Positivas**

- atende diretamente ao requisito acadêmico;
- demonstra domínio dos fundamentos web;
- reduz tooling obrigatório.

**Negativas**

- componentes e estado exigem organização manual;
- risco maior de duplicação se a arquitetura de módulos não for respeitada.

---

# ADR-002 — PostgreSQL em vez de Firestore

**Status:** Aceito

## Contexto

A aplicação possui dados com relações frequentes:

- usuários → livros;
- livros → capítulos;
- livros ↔ gêneros;
- usuários ↔ favoritos;
- futuras relações de comentários, histórico e seguidores.

## Alternativas consideradas

1. Firebase + Firestore;
2. Supabase + PostgreSQL;
3. PostgreSQL + backend próprio.

## Decisão

Utilizar Supabase + PostgreSQL.

## Justificativa

O domínio possui forte componente relacional, incluindo relações 1:N e N:N. PostgreSQL oferece integridade referencial, joins, constraints, índices e boa flexibilidade para filtros e buscas futuras.

## Consequências

**Positivas**

- modelo mais natural para o domínio;
- facilidade para consultas compostas;
- integridade por FKs/constraints;
- base adequada para Full Text Search futuro.

**Negativas**

- exige que a equipe compreenda SQL e relações;
- schema precisa de planejamento prévio maior que um CRUD documental simples.

---

# ADR-003 — Supabase como Backend as a Service

**Status:** Aceito

## Contexto

Usar PostgreSQL próprio com API completa aumentaria a complexidade de backend em uma disciplina cujo requisito obrigatório de implementação está concentrado no frontend.

## Alternativas

- Firebase;
- Supabase;
- PostgreSQL gerenciado + API própria;
- servidor próprio.

## Decisão

Utilizar Supabase.

## Justificativa

Fornece PostgreSQL, Auth, Storage e controle via RLS, reduzindo infraestrutura sem remover os benefícios de um banco relacional.

## Consequências

**Positivas**

- menor tempo de infraestrutura;
- autenticação pronta;
- storage integrado;
- PostgreSQL real;
- autorização próxima aos dados.

**Negativas**

- dependência da plataforma;
- necessidade de configurar RLS corretamente;
- equipe precisa distinguir chave pública de chave privilegiada.

---

# ADR-004 — Autorização por Row Level Security

**Status:** Aceito

## Contexto

Qualquer usuário pode manipular o JavaScript executado no próprio navegador.

## Decisão

Usar RLS como camada obrigatória de autorização para operações em dados expostos.

## Consequências

- botões escondidos deixam de ser considerados proteção;
- políticas precisam ser testadas com usuários diferentes;
- novas tabelas não podem entrar em produção sem revisão de acesso.

---

# ADR-005 — Vercel para hospedagem

**Status:** Aceito / obrigatório

## Contexto

A disciplina exige hospedagem na Vercel.

## Decisão

Utilizar Vercel para produção e previews quando aplicável.

## Consequências

- integração natural com GitHub;
- frontend estático simples de publicar;
- Vercel Functions permanecem disponíveis para necessidades server-side futuras.

---

# ADR-006 — Mobile first

**Status:** Aceito

## Contexto

O produto será utilizado para leitura e descoberta em telas pequenas e o grupo definiu mobile first como requisito do projeto.

## Decisão

CSS base será desenvolvido para mobile; media queries com `min-width` ampliarão a experiência.

## Consequências

- componentes precisam ser pensados primeiro para toque;
- desktop não deve ser a referência inicial de layout;
- revisão de PR visual deve incluir viewport mobile.

---

# ADR-007 — Uma conta para leitor e escritor

**Status:** Aceito

## Contexto

Separar usuários por tipo criaria barreira e complexidade sem benefício para o conceito do produto.

## Decisão

Todo usuário autenticado pode ler e publicar.

## Consequências

- não existe `tipo_usuario` apenas para distinguir leitor/escritor;
- a existência de livros publicados representa atividade de autoria;
- permissões são baseadas em propriedade do conteúdo.

---

# ADR-008 — Editor simples no MVP

**Status:** Aceito

## Contexto

Editor rich text aumenta complexidade de sanitização, armazenamento e consistência.

## Decisão

O MVP prioriza entrada de texto simples para capítulos.

## Consequências

- implementação mais segura e previsível;
- formatação avançada fica para evolução;
- conteúdo deve ser exibido como texto, preservando estrutura necessária sem interpretar HTML arbitrário.

---

# ADR-009 — Biblioteca por relação N:N

**Status:** Aceito

## Contexto

Usuários podem favoritar múltiplos livros e um livro pode ser favoritado por múltiplos usuários.

## Decisão

Modelar favoritos por tabela associativa `favorites`.

## Consequências

- integridade relacional;
- prevenção de duplicata por chave composta/constraint;
- consulta simples da biblioteca de um usuário.

---

# ADR-010 — Leitura offline como evolução, não requisito inicial

**Status:** Aceito

## Contexto

A ideia de leitura offline é relevante, mas depende de decisões adicionais sobre cache, atualização e escopo.

## Decisão

Não bloquear o MVP por implementação offline.

## Direção futura

Avaliar PWA/Service Worker e armazenamento local de capítulos selecionados antes de exportação de PDF/EPUB.

## Consequências

- equipe prioriza fluxo principal;
- arquitetura de leitura deve evitar decisões que inviabilizem cache futuro.

---

# ADR-011 — Semantic Versioning

**Status:** Aceito / obrigatório

## Decisão

Usar:

```text
MAJOR.MINOR.PATCH
```

Durante desenvolvimento:

```text
0.x.y
```

Primeira versão completa da entrega:

```text
1.0.0
```

Detalhes em `09-Git-e-Versionamento.md`.

---

# ADR-012 — Funções server-side somente quando justificadas

**Status:** Aceito

## Contexto

A Vercel permite funções server-side, mas adicioná-las sem necessidade aumenta complexidade.

## Decisão

O MVP acessará Supabase através do SDK no navegador dentro das permissões RLS. Vercel Functions serão adicionadas apenas para operações que exijam segredo, processamento protegido ou lógica inadequada ao cliente.

## Consequências

- menor infraestrutura inicial;
- possibilidade de evolução sem mudança obrigatória de hospedagem.

---

# 2. Decisões pendentes

Registrar novos ADRs quando forem definidas:

- nome final e identidade visual;
- lista oficial de gêneros;
- regra exata para publicação de livro;
- leitura pública sem login ou somente autenticada, caso o grupo altere a recomendação inicial;
- política de exclusão de conta com conteúdo publicado;
- mecanismo de avaliação/curtida;
- comentários e moderação;
- estratégia de Full Text Search;
- PWA/offline.

## 3. Regra de manutenção

ADR aceito não deve ser apagado quando uma decisão mudar.

Criar novo ADR indicando que substitui o anterior, preservando histórico técnico.
