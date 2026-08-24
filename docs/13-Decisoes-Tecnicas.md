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

Todo usuário autenticado pode publicar e utilizar recursos pessoais de leitura. A leitura pública de conteúdo publicado não exige autenticação, conforme ADR-013.

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
- possibilidade de evolução sem mudança obrigatória de hospedagem;
- exclusão definitiva da identidade de autenticação é um caso válido para operação server-side protegida.

---

# ADR-013 — Leitura pública de conteúdo publicado

**Status:** Aceito

## Contexto

Exigir autenticação para leitura aumentaria a barreira de entrada sem benefício necessário para o fluxo principal do MVP.

## Alternativas consideradas

- leitura somente autenticada;
- leitura pública de conteúdo publicado.

## Decisão

Permitir que visitantes não autenticados:

- acessem o catálogo;
- pesquisem e filtrem obras;
- abram páginas de livros publicados;
- leiam capítulos publicados.

Autenticação permanece obrigatória para operações pessoais e autorais, como publicar, editar, excluir e favoritar.

## Consequências

**Positivas**

- menor barreira para descoberta e leitura;
- demonstração mais simples do fluxo principal;
- separação clara entre conteúdo público e operações vinculadas à identidade.

**Técnicas**

- políticas RLS devem permitir `SELECT` anônimo somente para conteúdo publicado;
- rascunhos permanecem restritos ao autor;
- favoritos continuam restritos a usuários autenticados.

---

# ADR-014 — Critérios mínimos de publicação

**Status:** Aceito

## Contexto

Permitir a publicação de obras ou capítulos incompletos geraria itens públicos sem conteúdo suficiente para leitura.

Ao mesmo tempo, critérios obrigatórios não devem impedir o salvamento de rascunhos em andamento.

## Decisão

### Livro

Para publicar um livro, exigir:

- título;
- descrição;
- entre 1 e 3 gêneros;
- pelo menos 1 capítulo publicado.

A capa será opcional.

### Capítulo

Para publicar um capítulo, exigir:

- título;
- conteúdo entre 500 e 15.000 caracteres, considerando espaços.

O título não entra na contagem de caracteres.

Rascunhos poderão ser salvos sem cumprir todos esses critérios.

## Consequências

**Positivas**

- catálogo evita obras publicadas sem conteúdo legível;
- autores continuam podendo salvar trabalho incompleto;
- critérios são verificáveis por testes.

**Técnicas**

- validações devem ocorrer no fluxo de publicação;
- não convém representar todos os critérios como `NOT NULL` permanentes, pois rascunhos incompletos são permitidos;
- o banco e/ou a camada de aplicação devem impedir transições inválidas para `published`.

---

# ADR-015 — Lista de gêneros e limite por livro

**Status:** Aceito

## Contexto

Permitir gêneros criados livremente pelos usuários aumentaria inconsistência de nomes e dificultaria filtros no MVP.

O modelo relacional já prevê associação N:N entre livros e gêneros.

## Decisão

Utilizar lista controlada inicial com 12 gêneros:

1. Ação;
2. Aventura;
3. Comédia;
4. Drama;
5. Fantasia;
6. Ficção Científica;
7. Mistério;
8. Romance;
9. Suspense;
10. Terror;
11. Ficção Histórica;
12. Fanfic.

Cada livro deverá possuir no mínimo 1 e no máximo 3 gêneros para publicação.

## Consequências

- filtros possuem valores consistentes;
- `genres` permanece uma tabela controlada;
- `book_genres` mantém a relação N:N;
- é necessário validar o limite máximo de três associações por livro.

---

# ADR-016 — Exclusão de conta com escolha sobre preservação das obras

**Status:** Aceito

## Contexto

Excluir automaticamente todas as obras junto com a conta poderia remover histórias que leitores ainda desejam acessar.

Por outro lado, preservar obras vinculadas a um perfil excluído manteria uma relação inválida entre conteúdo e identidade inexistente.

O grupo decidiu permitir que o próprio autor escolha o destino de suas obras ao excluir a conta.

## Alternativas consideradas

1. sempre excluir as obras;
2. sempre preservar as obras;
3. permitir escolha entre exclusão e preservação.

## Decisão

Ao excluir a conta, o autor deverá escolher entre:

### Excluir as obras

As obras e seus conteúdos dependentes serão removidos de forma consistente.

### Preservar as obras

As obras mantidas:

- continuarão disponíveis de acordo com seu estado de publicação;
- deixarão de estar vinculadas ao perfil excluído;
- serão exibidas com autoria **Autor desconhecido**;
- não poderão mais ser editadas pelo antigo autor;
- quando não estiverem concluídas, serão marcadas como **descontinuadas**.

## Consequências

**Modelo de dados**

- `books.author_id` precisa admitir ausência de autor após preservação;
- a FK entre `books.author_id` e `profiles.id` não deve utilizar cascade que apague automaticamente as obras;
- `ON DELETE SET NULL` é a direção recomendada para essa relação;
- `publication_status` deve distinguir `ongoing`, `completed` e `discontinued`.

**Segurança**

- uma obra sem autor vinculado continua legível quando publicada, mas não pode ser alterada por usuários comuns;
- a exclusão da identidade de autenticação deve ocorrer por operação protegida, sem service role no frontend.

**Experiência**

- a interface deve informar claramente **Autor desconhecido**;
- obras não concluídas preservadas devem exibir estado **Descontinuada**.

---

# ADR-017 — Validade mínima do livro desde a criação

**Status:** Aceito

**Substitui parcialmente:** ADR-014 e ADR-015 quanto ao momento em que título e gêneros passam a ser obrigatórios.

## Contexto

O modelo anterior permitia interpretar que título e gêneros poderiam estar ausentes enquanto o livro permanecesse em rascunho.

Durante a revisão do modelo conceitual, foi identificado que um livro precisa existir como entidade antes que seus capítulos possam ser criados.

Permitir registros sem identidade mínima produziria rascunhos estruturalmente inválidos e dificultaria a organização das obras pelo próprio autor.

## Alternativas consideradas

1. permitir livro quase vazio e exigir campos somente na publicação;
2. exigir todos os campos já na criação;
3. exigir identidade mínima na criação e permitir complementação durante o rascunho.

## Decisão

Adotar a terceira alternativa.

Um livro só será criado quando possuir:

- autor válido;
- título;
- entre 1 e 3 gêneros.

O sistema deverá aplicar defaults:

```text
status = draft
publication_status = ongoing
language = pt-BR
```

Poderão permanecer ausentes no rascunho:

- descrição;
- capa;
- capítulos;
- `published_at`.

A criação do livro e das associações obrigatórias de gênero deverá ser tratada como uma operação lógica atômica.

## Consequências

**Positivas**

- não existem livros sem identidade mínima;
- lista de rascunhos permanece compreensível;
- simplifica parte das verificações posteriores;
- gênero passa a ser característica estrutural da obra.

**Técnicas**

- `books.title` deverá ser obrigatório;
- não pode permanecer livro persistido sem registro correspondente em `book_genres`;
- mínimo e máximo de gêneros devem ser garantidos no frontend e no banco.

---

# ADR-018 — Estados controlados com text + CHECK

**Status:** Aceito

## Contexto

Os campos:

```text
books.status
chapters.status
books.publication_status
```

possuem conjuntos pequenos e controlados de valores.

Foram consideradas duas formas principais de representação no PostgreSQL:

1. enums;
2. `text` com `CHECK`.

## Alternativas consideradas

### Enum PostgreSQL

Vantagens:

- domínio fortemente tipado;
- valores permitidos definidos no próprio tipo.

Desvantagens:

- evolução do conjunto exige alteração do tipo;
- adiciona tipos extras às migrations;
- maior complexidade para o estágio atual do projeto.

### `text` + `CHECK`

Vantagens:

- impede valores inválidos;
- migrations mais simples;
- conjunto de valores pode evoluir com menor complexidade.

## Decisão

Utilizar `text` com constraints `CHECK`.

Para estado editorial:

```text
draft
published
```

Para situação narrativa:

```text
ongoing
completed
discontinued
```

## Consequências

- valores inválidos continuam bloqueados pelo banco;
- não serão criados enums PostgreSQL no MVP;
- alterações futuras serão feitas por migration da constraint correspondente.

---

# ADR-019 — Idioma padrão pt-BR sem domínio fechado

**Status:** Aceito

## Contexto

O modelo possui `books.language`, mas o MVP não terá interface completa de internacionalização.

Era necessário definir um valor padrão sem impedir evolução futura para outros idiomas.

## Alternativas consideradas

1. remover o campo no MVP;
2. limitar o campo exclusivamente a `pt-BR`;
3. usar `text` com default `pt-BR` sem `CHECK` fechado.

## Decisão

Utilizar:

```text
language text NOT NULL DEFAULT 'pt-BR'
```

Não limitar os idiomas permitidos por `CHECK` no MVP.

## Consequências

**Positivas**

- obras atuais recebem idioma automaticamente;
- suporte futuro a `en-US`, `de-DE`, `es-ES` e outros códigos não exige alteração estrutural da coluna.

**Escopo**

Interface de escolha de idioma, filtros e internacionalização completa permanecem pós-MVP.

---

# ADR-020 — Validação obrigatória no frontend e no banco

**Status:** Aceito

**Refina:** ADR-004 e ADR-014.

## Contexto

Uma aplicação client-side não pode considerar o JavaScript executado no navegador como barreira de segurança.

Ao mesmo tempo, validações apenas no banco produzem experiência de usuário inferior.

## Alternativas consideradas

1. validar somente no frontend;
2. validar somente no banco;
3. validar em ambas as camadas.

## Decisão

Toda validação relevante de negócio deverá existir:

```text
Frontend
+
Banco de dados
```

O frontend será responsável por:

- feedback imediato;
- mensagens claras;
- evitar requisições sabidamente inválidas.

O banco será responsável por:

- integridade;
- proteção contra chamadas diretas à API;
- impedir estados inválidos mesmo quando o frontend for ignorado.

## Publicação no MVP

A transição:

```text
draft → published
```

de um livro será protegida por trigger PostgreSQL.

A trigger deverá validar os critérios mínimos antes de aceitar a alteração.

## Consequências

- chamadas diretas à API não contornam critérios de publicação;
- testes precisam cobrir frontend e banco;
- regras críticas não podem existir apenas como validação de formulário.

## Evolução futura

Avaliar função/RPC:

```text
publish_book(book_id)
```

como operação explícita de publicação.

No MVP, a função não será necessária.

---

# ADR-021 — Sequência imutável de capítulos no MVP

**Status:** Aceito

## Contexto

Reordenação de capítulos, inserção intermediária e renumeração adicionariam complexidade desnecessária ao fluxo inicial de escrita.

O MVP necessita apenas de leitura sequencial e criação progressiva dos capítulos.

## Alternativas consideradas

1. permitir reordenação completa;
2. utilizar posições espaçadas para facilitar inserções futuras;
3. utilizar sequência inteira contínua e imutável no MVP.

## Decisão

Utilizar:

```text
1, 2, 3, 4, ...
```

Todo capítulo novo será criado no final.

Sua posição será atribuída pelo banco:

```text
MAX(position) + 1
```

Para o primeiro capítulo:

```text
position = 1
```

Constraints:

```text
CHECK(position > 0)
UNIQUE(book_id, position)
```

No MVP não será permitido:

- reordenar capítulos;
- inserir capítulo entre existentes;
- escolher posição manualmente.

## Exclusão

Se um capítulo intermediário for excluído, todos os capítulos posteriores também serão removidos.

Exemplo:

```text
1 2 3 4 5 6 7 8 9 10
```

Excluir `7`:

```text
1 2 3 4 5 6
```

## Consequências

**Positivas**

- sequência permanece contínua;
- não é necessária renumeração;
- navegação anterior/próximo é simples;
- menor complexidade no MVP.

**Negativas**

- autor não pode reorganizar obra já escrita;
- exclusão intermediária é destrutiva para capítulos posteriores.

## Evolução futura

Avaliar:

- reordenação;
- inserção entre capítulos;
- exclusão intermediária preservando posteriores;
- estratégia de renumeração.

---

# ADR-022 — Identidade numérica para gêneros e slug legível

**Status:** Aceito

**Refina:** ADR-015.

## Contexto

A tabela `genres` representa uma lista pequena, controlada e administrada pelo projeto.

Foi necessário decidir entre:

- UUID;
- ID inteiro;
- `slug` como chave primária.

## Alternativas consideradas

### UUID

Uniformizaria IDs com outras entidades, mas adicionaria complexidade sem ganho relevante para uma tabela pequena e controlada.

### Slug como PK

Seria legível, porém faria alterações futuras de nomenclatura afetarem a identidade referencial do gênero.

### ID inteiro + slug UNIQUE

Separa identidade interna do banco da identidade legível utilizada pela aplicação.

## Decisão

Utilizar:

```text
genres.id
→ integer
→ PRIMARY KEY

genres.name
→ text
→ UNIQUE

genres.slug
→ text
→ UNIQUE
```

`book_genres.genre_id` deverá referenciar `genres.id`.

O frontend poderá utilizar `slug` para:

- filtros;
- identificação legível;
- URLs futuras.

## Consequências

**Positivas**

- FKs pequenas e simples;
- alterações de slug não exigem alteração da PK;
- frontend mantém identificador humano;
- banco mantém identidade interna estável.

---

# 2. Decisões pendentes

Registrar novos ADRs quando forem definidas:

- nome final e identidade visual;
- mecanismo de avaliação/curtida;
- comentários e moderação;
- estratégia de Full Text Search;
- PWA/offline;
- experiência completa de múltiplos idiomas;
- estratégia avançada de reorganização de capítulos;
- eventual adoção de função/RPC explícita de publicação.

## 3. Regra de manutenção

ADR aceito não deve ser apagado quando uma decisão mudar.

Criar novo ADR indicando que substitui ou refina o anterior, preservando histórico técnico.
