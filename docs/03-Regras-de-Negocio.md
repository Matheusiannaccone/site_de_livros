# 03 — Regras de Negócio

## 1. Objetivo

Este documento define regras que controlam o comportamento do produto independentemente da interface utilizada.

---

## 2. Usuários

**RN-001 — Conta única para leitura e escrita**  
Todo usuário cadastrado poderá atuar tanto como leitor quanto como escritor. Não haverá tipos de conta separados no MVP.

**RN-002 — Identidade de autoria**  
Enquanto a conta do autor estiver ativa, toda obra criada deve possuir um usuário autor identificado.

**RN-003 — Propriedade de conteúdo**  
Enquanto a autoria estiver vinculada a uma conta ativa, somente o autor poderá alterar ou excluir seus livros.

**RN-004 — Propriedade de capítulos**  
A permissão de alteração de um capítulo deriva da propriedade do livro ao qual o capítulo pertence.

**RN-005 — Perfil público e privado**  
Somente dados explicitamente classificados como públicos poderão ser exibidos a outros usuários.

**RN-006 — Exclusão de conta**  
Ao solicitar exclusão da própria conta, o usuário deve escolher se deseja excluir também suas obras ou permitir que elas permaneçam disponíveis no sistema.

**RN-007 — Preservação sem identidade**  
Quando o autor optar por preservar suas obras após excluir a conta, as obras mantidas devem deixar de possuir vínculo com o perfil removido e sua autoria deve ser exibida como **Autor desconhecido**.

**RN-008 — Imutabilidade após remoção do autor**  
Uma obra preservada após exclusão da conta do autor não poderá mais ser editada por esse usuário, pois sua identidade e autorização deixam de existir no sistema.

---

## 3. Livros

**RN-010 — Estado da obra**  
Um livro deve possuir estado editorial que diferencie, no mínimo, conteúdo em rascunho de conteúdo publicado.

Os valores controlados do MVP serão:

- `draft`;
- `published`.

**RN-011 — Visibilidade de rascunho**  
Obras em rascunho não devem aparecer no catálogo público.

**RN-012 — Publicação**  
Somente o autor autenticado pode publicar ou retirar de publicação sua obra enquanto ela estiver vinculada à sua conta.

**RN-013 — Integridade de autoria**  
Uma obra deve possuir autor válido enquanto estiver sob edição. Excepcionalmente, uma obra preservada após exclusão da conta do autor poderá permanecer sem vínculo com um perfil, conforme RN-007.

**RN-014 — Autor único no MVP**  
Cada livro possuirá um único autor no MVP enquanto houver vínculo de autoria. Colaboração entre autores fica fora do escopo inicial.

**RN-015 — Gêneros**  
Os gêneros devem ser obtidos de uma coleção/tabela controlada. O usuário não deve criar novos gêneros livremente no fluxo comum do MVP.

**RN-016 — Capa**  
A capa é opcional. Quando utilizada, deve ser tratada como arquivo associado ao livro. O banco deve armazenar metadados ou referência ao arquivo, não o binário da imagem na tabela principal.

**RN-017 — Validade mínima de criação do livro**  
Um livro só deve ser considerado criado quando possuir, no mínimo:

- autor válido;
- título;
- pelo menos 1 gênero;
- no máximo 3 gêneros.

Um rascunho pode estar incompleto, mas não deve ser estruturalmente inválido.

Após sua criação, ainda podem estar ausentes:

- descrição;
- capa;
- capítulos;
- data de publicação.

**RN-017A — Criação atômica**  
A criação do livro e de suas associações obrigatórias de gênero deve ser tratada como uma única operação lógica.

O sistema não deve deixar persistido um livro sem os requisitos mínimos definidos em RN-017.

**RN-018 — Gêneros por obra**  
Todo livro deve possuir entre 1 e 3 gêneros da lista controlada desde sua criação, inclusive enquanto estiver em rascunho.

**RN-019 — Situação da história**  
A situação narrativa da obra deve ser independente de seu estado editorial.

O MVP deve distinguir:

- `ongoing` — em andamento;
- `completed` — concluída;
- `discontinued` — descontinuada.

Uma obra pode, por exemplo, estar `published` e `discontinued` ao mesmo tempo.

**RN-019A — Descontinuação após exclusão do autor**  
Quando uma obra preservada após exclusão da conta não estiver marcada como concluída, sua situação deve passar para `discontinued`.

**RN-019B — Idioma padrão**  
O idioma padrão de uma nova obra no MVP será `pt-BR`.

O modelo não deve impedir tecnicamente a utilização futura de outros códigos de idioma.

**RN-019C — Critérios mínimos de publicação do livro**  
Para transição de `draft` para `published`, o sistema deve garantir:

- título válido;
- descrição preenchida;
- entre 1 e 3 gêneros;
- pelo menos 1 capítulo publicado.

Título e gêneros já devem existir desde a criação da obra.

A capa continua opcional.

---

## 4. Capítulos

**RN-020 — Pertencimento**  
Todo capítulo deve pertencer a exatamente um livro.

**RN-021 — Ordenação**  
Cada capítulo deve possuir uma posição inteira positiva dentro do livro, permitindo ordenação determinística.

**RN-021A — Sequência contínua**  
No MVP, as posições dos capítulos devem formar uma sequência contínua:

```text
1, 2, 3, 4, ...
```

**RN-021B — Novo capítulo ao final**  
Todo capítulo novo deve nascer no final da sequência existente.

Sua posição deve corresponder à posição do último capítulo acrescida de 1.

A atribuição da posição será responsabilidade do banco.

**RN-021C — Sem reordenação no MVP**  
No MVP:

- o autor não poderá reorganizar capítulos;
- não poderá inserir um novo capítulo entre capítulos existentes;
- a posição não será escolhida manualmente pelo usuário.

**RN-022 — Rascunho de capítulo**  
Um capítulo em rascunho deve ser visível para o autor, mas não para leitores externos.

Rascunhos podem ser salvos mesmo sem atingir os limites mínimos de publicação.

**RN-023 — Capítulo publicado**  
Somente capítulos publicados podem ser exibidos no fluxo público de leitura.

**RN-024 — Exclusão de livro**  
A estratégia de exclusão deve garantir que capítulos não permaneçam órfãos.

**RN-024A — Exclusão sequencial de capítulo no MVP**  
No MVP, a exclusão de um capítulo intermediário implica também a exclusão de todos os capítulos posteriores da mesma obra.

Exemplo:

```text
Capítulos existentes:
1 2 3 4 5 6 7 8 9 10

Excluir capítulo 7:

Capítulos restantes:
1 2 3 4 5 6
```

Essa regra preserva a sequência contínua sem necessidade de renumeração no MVP.

**RN-025 — Navegação sequencial**  
Anterior e próximo devem respeitar a posição dos capítulos publicados, ignorando rascunhos no fluxo público.

**RN-026 — Critérios mínimos de publicação do capítulo**  
Para ser publicado, um capítulo deve possuir:

- título;
- conteúdo entre 500 e 15.000 caracteres, considerando espaços.

O título não compõe a contagem de caracteres do conteúdo.

---

## 5. Biblioteca e favoritos

**RN-030 — Favorito único**  
Um mesmo usuário não pode adicionar o mesmo livro à biblioteca/favoritos mais de uma vez.

**RN-031 — Remoção**  
O usuário pode remover um livro de sua biblioteca sem alterar a obra original.

**RN-032 — Independência da autoria**  
Favoritar uma obra não transfere qualquer permissão de edição ao leitor.

**RN-033 — Favoritos de obra preservada**  
A preservação de uma obra após exclusão da conta do autor não deve, por si só, remover a obra das bibliotecas dos leitores.

---

## 6. Descoberta

**RN-040 — Catálogo público**  
Somente livros publicados devem aparecer em listagens públicas.

**RN-041 — Página inicial inicial**  
Enquanto o catálogo for pequeno, a página inicial poderá exibir todos os livros publicados, respeitando paginação ou limites técnicos quando necessário.

**RN-042 — Evolução de relevância**  
A ordenação inicial poderá ser simples.

Algoritmos de relevância personalizados são evoluções posteriores e devem ser documentados antes da implementação.

**RN-043 — Filtro por gênero**  
Um livro possuirá de 1 a 3 gêneros.

A associação deve ser modelada de forma a permitir essa relação múltipla.

**RN-044 — Leitura pública**  
Livros e capítulos publicados devem poder ser consultados e lidos por visitantes sem autenticação.

**RN-045 — Recursos autenticados**  
Operações pessoais ou autorais, incluindo criação, edição, publicação, exclusão e biblioteca/favoritos, devem exigir autenticação.

---

## 7. Lista inicial de gêneros

A lista controlada inicial do MVP será:

1. Ação (`acao`);
2. Aventura (`aventura`);
3. Comédia (`comedia`);
4. Drama (`drama`);
5. Fantasia (`fantasia`);
6. Ficção Científica (`ficcao-cientifica`);
7. Mistério (`misterio`);
8. Romance (`romance`);
9. Suspense (`suspense`);
10. Terror (`terror`);
11. Ficção Histórica (`ficcao-historica`);
12. Fanfic (`fanfic`).

Alterações na lista devem ser feitas de forma controlada pela aplicação/administração do projeto.

O `slug` funciona como identificador legível da aplicação, enquanto a identidade relacional interna será mantida por chave primária numérica.

---

## 8. Exclusão de conta e conteúdo

**RN-070 — Escolha do autor**  
A exclusão de uma conta não deve determinar automaticamente a exclusão das obras.

O autor deve escolher entre:

1. excluir suas obras junto com a conta; ou
2. preservar suas obras no site.

**RN-071 — Exclusão das obras**  
Quando o autor optar por excluir suas obras, livros, capítulos e relações dependentes dessas obras devem ser removidos de maneira consistente, sem deixar registros órfãos.

**RN-072 — Preservação das obras**  
Quando o autor optar pela preservação, as obras mantidas devem continuar disponíveis de acordo com seu estado de publicação, sem referência ao perfil removido.

**RN-073 — Identificação de autoria removida**  
Obras preservadas devem exibir **Autor desconhecido** no lugar do nome do antigo autor.

**RN-074 — Obra não concluída**  
Se uma obra preservada não estiver marcada como concluída, sua situação deve ser alterada para `discontinued`.

**RN-075 — Operação protegida**  
A exclusão definitiva da identidade de autenticação deve ser executada por mecanismo protegido com os privilégios necessários, sem expor credenciais administrativas no frontend.

---

## 9. Conteúdo, validação e segurança

**RN-050 — Fonte da autorização**  
Ocultar botões no frontend não constitui autorização. As operações devem ser validadas pelo backend/banco.

**RN-051 — Conteúdo de usuário**  
Texto fornecido por usuários deve ser tratado como conteúdo não confiável.

**RN-052 — Renderização de capítulos**  
Enquanto o editor do MVP utilizar texto simples, o conteúdo não deve ser interpretado como HTML arbitrário.

**RN-053 — Chaves privilegiadas**  
Credenciais de administração ou `service_role` não podem ser expostas no código público.

**RN-054 — Validação em duas camadas**  
Toda validação relevante de negócio deve existir:

1. no frontend, para feedback e experiência do usuário;
2. novamente no banco, para integridade e proteção contra bypass.

A validação do frontend não substitui constraints, RLS, triggers ou outras proteções do banco.

**RN-055 — Proteção da publicação**  
No MVP, toda tentativa de alterar um livro para `published` deve passar por validação obrigatória no PostgreSQL por trigger.

A trigger deve rejeitar a transição quando os critérios mínimos de publicação não forem atendidos.

---

## 10. Recursos evolutivos

As regras abaixo só entram em vigor caso as respectivas funcionalidades sejam aprovadas para versões futuras.

**RN-060 — Histórico de leitura**  
O histórico pertence ao usuário e não altera o conteúdo original da obra.

**RN-061 — Offline**  
Conteúdo disponibilizado offline deve respeitar a versão publicada e as políticas de acesso vigentes.

**RN-062 — Comentários**  
A implementação de comentários deverá definir edição, exclusão, moderação e vínculo com usuário antes de ser considerada completa.

**RN-063 — Recomendações**  
Qualquer mecanismo de recomendação deverá documentar quais sinais utiliza e possuir comportamento aceitável para usuários sem histórico.

**RN-064 — Organização avançada de capítulos**  
Ficam para evolução pós-MVP:

- reordenar capítulos;
- inserir capítulos entre capítulos existentes;
- excluir um capítulo intermediário preservando capítulos posteriores;
- renumerar ou reorganizar posições.

**RN-065 — Suporte multilíngue completo**  
Interface para escolha de idiomas, filtros por idioma e demais recursos de internacionalização ficam fora do MVP.

O banco já deve permitir evolução para outros códigos de idioma.

---

## 11. Regra de mudança

Nova regra de negócio deve:

1. receber identificador;
2. descrever comportamento de forma verificável;
3. apontar requisito relacionado quando possível;
4. ser refletida em testes;
5. ser considerada nas políticas de segurança e no modelo de dados.
