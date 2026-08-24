# 13 — Decisões Técnicas (ADR)

## 1. Objetivo

Registrar **por que** decisões arquiteturais relevantes foram tomadas.

A especificação operacional atual deve permanecer nos documentos especializados. ADRs registram contexto, decisão e consequências sem duplicar toda a especificação.

---

# ADR-001 — Frontend sem framework

**Status:** Aceito

**Contexto:** a disciplina exige HTML, CSS e JavaScript puro.

**Decisão:** utilizar HTML5, CSS3 e JavaScript moderno sem framework.

**Consequências:** atende ao requisito acadêmico e reduz tooling, mas exige organização manual de componentes e estado.

---

# ADR-002 — PostgreSQL em vez de Firestore

**Status:** Aceito

**Contexto:** o domínio possui relações 1:N e N:N frequentes.

**Alternativas:** Firestore; PostgreSQL via Supabase; PostgreSQL com backend próprio.

**Decisão:** utilizar PostgreSQL via Supabase.

**Consequências:** modelo relacional natural, FKs e joins; exige domínio básico de SQL e planejamento de schema.

---

# ADR-003 — Supabase como Backend as a Service

**Status:** Aceito

**Contexto:** backend próprio ampliaria infraestrutura fora do foco principal da disciplina.

**Decisão:** utilizar Supabase para Auth, PostgreSQL, RLS e Storage.

**Consequências:** reduz infraestrutura; cria dependência da plataforma e exige configuração correta de RLS.

---

# ADR-004 — Autorização por RLS

**Status:** Aceito

**Contexto:** JavaScript do cliente pode ser modificado.

**Decisão:** RLS será a camada obrigatória de autorização dos dados expostos.

**Referência atual:** `11-Seguranca.md`, seção **Matriz de Autorização RLS**.

**Consequências:** UI não é barreira de segurança; policies precisam ser testadas com usuários distintos.

---

# ADR-005 — Vercel para hospedagem

**Status:** Aceito / obrigatório

**Decisão:** utilizar Vercel para produção e previews quando aplicável.

**Consequências:** integração simples com GitHub e possibilidade de funções server-side futuras.

---

# ADR-006 — Mobile first

**Status:** Aceito

**Decisão:** CSS base parte de mobile e amplia com `min-width`.

**Consequências:** componentes devem ser projetados primeiro para telas pequenas e toque.

---

# ADR-007 — Uma conta para leitor e escritor

**Status:** Aceito

**Contexto:** separar tipos de conta criaria barreira sem benefício para o MVP.

**Decisão:** toda conta autenticada pode ler recursos pessoais e publicar conteúdo; leitura pública de conteúdo publicado não exige login.

**Consequências:** autorização se baseia em propriedade, não em `tipo_usuario`.

---

# ADR-008 — Editor simples no MVP

**Status:** Aceito

**Decisão:** capítulos utilizam texto simples no MVP.

**Consequências:** implementação e sanitização mais simples; rich text fica para evolução.

---

# ADR-009 — Biblioteca por relação N:N

**Status:** Aceito

**Decisão:** usar tabela `favorites` com relação usuário ↔ livro.

A biblioteca é privada e apenas livros publicados podem ser adicionados.

**Referências:** `05-Modelo-de-Dados.md` e `11-Seguranca.md`.

---

# ADR-010 — Offline como evolução

**Status:** Aceito

**Decisão:** leitura offline/PWA não bloqueia o MVP.

**Consequências:** priorização do fluxo principal; solução futura pode considerar Service Worker/cache.

---

# ADR-011 — Semantic Versioning

**Status:** Aceito / obrigatório

**Decisão:** usar `MAJOR.MINOR.PATCH`; desenvolvimento em `0.x.y`; primeiro MVP estável em `1.0.0`.

**Referência:** `09-Git-e-Versionamento.md`.

---

# ADR-012 — Funções server-side somente quando justificadas

**Status:** Aceito

**Decisão:** cliente acessa Supabase dentro das permissões RLS. Funções server-side entram apenas para segredo, privilégio ou processamento protegido.

**Consequências:** menor infraestrutura inicial; exclusão definitiva da identidade é exemplo de operação protegida válida.

---

# ADR-013 — Leitura pública de conteúdo publicado

**Status:** Aceito

**Alternativas:** leitura autenticada; leitura pública de conteúdo publicado.

**Decisão:** catálogo, detalhes e capítulos publicados são públicos.

**Consequências:** menor barreira para leitura; RLS deve separar conteúdo público de rascunhos e ações pessoais.

---

# ADR-014 — Critérios mínimos de publicação

**Status:** Aceito

**Decisão:** livros e capítulos possuem critérios mínimos antes da publicação, mas rascunhos podem permanecer incompletos.

**Especificação vigente:** `03-Regras-de-Negocio.md`, RN-019C e RN-026.

**Consequências:** critérios de publicação não devem ser transformados indiscriminadamente em `NOT NULL` permanentes.

---

# ADR-015 — Lista de gêneros e limite por livro

**Status:** Aceito

**Decisão:** lista controlada de gêneros e limite de 1 a 3 por obra.

**Especificação vigente:** `05-Modelo-de-Dados.md`, seção **genres**.

**Consequências:** filtros consistentes; escrita de `genres` não fica disponível a usuários comuns.

---

# ADR-016 — Exclusão de conta com escolha sobre obras

**Status:** Aceito

**Alternativas:** sempre excluir; sempre preservar; permitir escolha.

**Decisão:** usuário escolhe excluir ou preservar.

Obras preservadas perdem o vínculo com o perfil, exibem **Autor desconhecido** e, se não concluídas, tornam-se `discontinued`.

**Referências:** `03-Regras-de-Negocio.md` e `05-Modelo-de-Dados.md`.

**Consequências:** `books.author_id` admite `NULL`; relação com profile usa estratégia compatível com preservação.

---

# ADR-017 — Validade mínima do livro desde a criação

**Status:** Aceito

**Refina:** ADR-014 e ADR-015.

**Decisão:** livro nasce com autor, título e 1–3 gêneros. Descrição, capa e capítulos podem ser adicionados depois.

**Consequências:** rascunhos podem estar incompletos, mas nunca estruturalmente inválidos.

---

# ADR-018 — Estados com `text + CHECK`

**Status:** Aceito

**Alternativas:** enum PostgreSQL; `text` com `CHECK`.

**Decisão:** usar `text` + `CHECK` para estados controlados.

**Consequências:** integridade com migrations mais simples de evoluir.

---

# ADR-019 — Idioma padrão `pt-BR` sem domínio fechado

**Status:** Aceito

**Decisão:**

```text
language text NOT NULL DEFAULT 'pt-BR'
```

Sem `CHECK` fechado para idiomas.

**Consequências:** suporte futuro a outros códigos sem alterar o tipo da coluna.

---

# ADR-020 — Validação no frontend e na camada persistente

**Status:** Aceito

**Refina:** ADR-004 e ADR-014.

**Decisão:** frontend valida para UX; banco/Storage validam para integridade e segurança.

**Referência:** `11-Seguranca.md`, seção **Validação e proteção no banco**.

**Consequências:** chamadas diretas à API não podem contornar regras críticas.

---

# ADR-021 — Sequência imutável de capítulos no MVP

**Status:** Aceito

**Alternativas:** reordenação completa; posições espaçadas; sequência contínua.

**Decisão:** posições contínuas, novos capítulos ao final, sem reordenação. Exclusão intermediária remove posteriores.

**Especificação:** `03-Regras-de-Negocio.md`, seção **Capítulos**.

**Consequências:** implementação simples; reorganização avançada fica pós-MVP.

---

# ADR-022 — ID numérico e slug para gêneros

**Status:** Aceito

**Alternativas:** UUID; slug como PK; inteiro + slug.

**Decisão:** `genres.id` inteiro como PK e `slug` `UNIQUE` para uso legível.

**Consequências:** identidade interna estável e URLs/filtros legíveis.

---

# ADR-023 — Matriz RLS 1.0

**Status:** Aceito

**Contexto:** era necessário consolidar permissões por tabela antes das migrations.

**Decisão:** adotar a Matriz RLS 1.0.

**Especificação oficial:** `11-Seguranca.md`, seção **Matriz de Autorização RLS**.

**Consequências:** autorização passa a ter baseline versionada e testes associados.

---

# ADR-024 — Buckets públicos com escrita protegida

**Status:** Aceito

**Alternativas:** privados; públicos sem controle adequado; públicos com mutation protegida.

**Decisão:** `avatars` e `covers` são públicos para leitura; escrita depende de propriedade.

**Especificação:** `11-Seguranca.md`, seção **Storage**.

**Consequências:** assets públicos simples de servir; capa de rascunho não possui confidencialidade absoluta.

---

# ADR-025 — Conversão client-side para WebP

**Status:** Aceito

**Alternativas:** transformação dinâmica; processamento server-side; conversão no cliente.

**Decisão:** aceitar JPEG/PNG/WebP, converter no cliente e persistir WebP.

**Especificação:** `11-Seguranca.md`, seção **Uploads**.

**Consequências:** padronização e menor tráfego sem função server-side; Storage ainda precisa validar propriedade e limites.

---

# ADR-026 — Contrato Front ↔ Supabase 1.0

**Status:** Aceito

**Contexto:** frontend e integração precisam avançar em paralelo.

**Alternativas:** páginas acessarem Supabase; mocks por página; services estáveis com adapters.

**Decisão:** usar service → adapter mock/Supabase.

**Especificação:** `14-Contrato-Front-Supabase.md`.

**Consequências:** mock pode ser substituído sem reestruturar páginas.

---

# ADR-027 — Services como fronteira de acesso a dados

**Status:** Aceito

**Refina:** ADR-026.

**Decisão:** `pages/` e `components/` não chamam diretamente `supabase.from`, Auth ou Storage.

**Referência:** `04-Arquitetura.md` e `14-Contrato-Front-Supabase.md`.

**Consequências:** UI fica desacoplada da implementação de persistência.

---

# ADR-028 — Mocks orientados pelo contrato

**Status:** Aceito

**Refina:** ADR-026.

**Decisão:** mocks reproduzem o contrato dos services, não o schema bruto do PostgreSQL.

**Referência:** `14-Contrato-Front-Supabase.md`, seção **Mocks**.

**Consequências:** UI pode testar sucesso, vazio e erros antes da integração real.

---

# 2. Decisões pendentes

Criar novos ADRs quando forem fechadas decisões sobre:

- nome e identidade visual;
- avaliação/curtida;
- comentários/moderação;
- Full Text Search;
- PWA/offline;
- experiência multilíngue;
- reorganização avançada de capítulos;
- RPC explícita de publicação;
- novos tipos de Storage privado;
- variantes de imagem.

## 3. Regra de manutenção

ADR aceito não deve ser apagado quando uma decisão mudar.

Criar novo ADR indicando qual decisão substitui ou refina, preservando histórico.
