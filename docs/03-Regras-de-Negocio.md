# 03 — Regras de Negócio

## 1. Objetivo

Este documento define regras que controlam o comportamento do produto independentemente da interface utilizada.

---

## 2. Usuários

**RN-001 — Conta única para leitura e escrita**  
Todo usuário cadastrado poderá atuar tanto como leitor quanto como escritor. Não haverá tipos de conta separados no MVP.

**RN-002 — Identidade de autoria**  
Toda obra deve possuir um usuário autor identificado.

**RN-003 — Propriedade de conteúdo**  
Somente o autor poderá alterar ou excluir seus livros.

**RN-004 — Propriedade de capítulos**  
A permissão de alteração de um capítulo deriva da propriedade do livro ao qual o capítulo pertence.

**RN-005 — Perfil público e privado**  
Somente dados explicitamente classificados como públicos poderão ser exibidos a outros usuários.

---

## 3. Livros

**RN-010 — Estado da obra**  
Um livro deve possuir estado que diferencie, no mínimo, conteúdo em rascunho de conteúdo publicado.

**RN-011 — Visibilidade de rascunho**  
Obras em rascunho não devem aparecer no catálogo público.

**RN-012 — Publicação**  
Somente o autor pode publicar ou retirar de publicação sua obra.

**RN-013 — Integridade de autoria**  
Um livro não pode existir sem autor válido.

**RN-014 — Autor único no MVP**  
Cada livro possuirá um único autor no MVP. Colaboração entre autores fica fora do escopo inicial.

**RN-015 — Gêneros**  
Os gêneros devem ser obtidos de uma coleção/tabela controlada. O usuário não deve criar novos gêneros livremente no fluxo comum do MVP.

**RN-016 — Capa**  
A capa é um arquivo associado ao livro. O banco deve armazenar metadados ou referência ao arquivo, não o binário da imagem na tabela principal.

---

## 4. Capítulos

**RN-020 — Pertencimento**  
Todo capítulo deve pertencer a exatamente um livro.

**RN-021 — Ordenação**  
Cada capítulo deve possuir uma posição dentro do livro, permitindo ordenação determinística.

**RN-022 — Rascunho de capítulo**  
Um capítulo em rascunho deve ser visível para o autor, mas não para leitores externos.

**RN-023 — Capítulo publicado**  
Somente capítulos publicados podem ser exibidos no fluxo público de leitura.

**RN-024 — Exclusão de livro**  
A estratégia de exclusão deve garantir que capítulos não permaneçam órfãos.

**RN-025 — Navegação sequencial**  
Anterior e próximo devem respeitar a ordem dos capítulos publicados, ignorando rascunhos de outros capítulos.

---

## 5. Biblioteca e favoritos

**RN-030 — Favorito único**  
Um mesmo usuário não pode adicionar o mesmo livro à biblioteca/favoritos mais de uma vez.

**RN-031 — Remoção**  
O usuário pode remover um livro de sua biblioteca sem alterar a obra original.

**RN-032 — Independência da autoria**  
Favoritar uma obra não transfere qualquer permissão de edição ao leitor.

---

## 6. Descoberta

**RN-040 — Catálogo público**  
Somente livros elegíveis para publicação devem aparecer em listagens públicas.

**RN-041 — Página inicial inicial**  
Enquanto o catálogo for pequeno, a página inicial poderá exibir todos os livros publicados, respeitando paginação ou limites técnicos quando necessário.

**RN-042 — Evolução de relevância**  
A ordenação inicial poderá ser simples. Algoritmos de relevância personalizados são evoluções posteriores e devem ser documentados antes da implementação.

**RN-043 — Filtro por gênero**  
A associação entre livro e gênero deve permitir um livro em mais de um gênero caso o grupo mantenha essa decisão na implementação.

---

## 7. Conteúdo e segurança

**RN-050 — Fonte da autorização**  
Ocultar botões no frontend não constitui autorização. As operações devem ser validadas pelo backend/banco.

**RN-051 — Conteúdo de usuário**  
Texto fornecido por usuários deve ser tratado como conteúdo não confiável.

**RN-052 — Renderização de capítulos**  
Enquanto o editor do MVP utilizar texto simples, o conteúdo não deve ser interpretado como HTML arbitrário.

**RN-053 — Chaves privilegiadas**  
Credenciais de administração ou service role não podem ser expostas no código público.

---

## 8. Recursos evolutivos

As regras abaixo só entram em vigor caso as respectivas funcionalidades sejam aprovadas para versões futuras.

**RN-060 — Histórico de leitura**  
O histórico pertence ao usuário e não altera o conteúdo original da obra.

**RN-061 — Offline**  
Conteúdo disponibilizado offline deve respeitar a versão publicada e as políticas de acesso vigentes.

**RN-062 — Comentários**  
A implementação de comentários deverá definir edição, exclusão, moderação e vínculo com usuário antes de ser considerada completa.

**RN-063 — Recomendações**  
Qualquer mecanismo de recomendação deverá documentar quais sinais utiliza e possuir comportamento aceitável para usuários sem histórico.

---

## 9. Regra de mudança

Nova regra de negócio deve:

1. receber identificador;
2. descrever comportamento de forma verificável;
3. apontar requisito relacionado quando possível;
4. ser refletida em testes;
5. ser considerada nas políticas de segurança e no modelo de dados.
