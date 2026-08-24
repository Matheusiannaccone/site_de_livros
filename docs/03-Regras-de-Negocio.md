# 03 — Regras de Negócio

## 1. Objetivo

Definir regras de comportamento do produto independentemente da interface ou tecnologia utilizada.

Detalhes de schema ficam em `05-Modelo-de-Dados.md`. Autorização, RLS e Storage ficam em `11-Seguranca.md`.

---

## 2. Usuários

**RN-001 — Conta única para leitura e escrita**  
Todo usuário cadastrado poderá atuar como leitor e escritor.

**RN-002 — Identidade de autoria**  
Enquanto a conta estiver ativa, toda obra sob edição deve possuir autor identificado.

**RN-003 — Propriedade de conteúdo**  
Somente o autor poderá alterar ou excluir seus livros enquanto houver vínculo de autoria.

**RN-004 — Propriedade de capítulos**  
A permissão sobre um capítulo deriva da autoria do livro ao qual ele pertence.

**RN-005 — Perfil público e privado**  
Somente dados explicitamente classificados como públicos poderão ser exibidos a terceiros. Dados de autenticação não devem ser tratados como dados públicos de perfil.

**RN-006 — Exclusão de conta**  
Ao excluir a própria conta, o usuário deve escolher entre excluir ou preservar suas obras.

**RN-007 — Preservação sem identidade**  
Obras preservadas após exclusão da conta deixam de possuir vínculo com o perfil removido e devem exibir **Autor desconhecido**.

**RN-008 — Imutabilidade após remoção do autor**  
Uma obra preservada sem autor ativo não poderá ser assumida ou editada por outro usuário.

**RN-009 — Exclusão protegida do perfil**  
A exclusão de perfil deve ocorrer dentro do fluxo protegido de exclusão de conta, após tratamento das relações dependentes.

---

## 3. Livros

**RN-010 — Estado editorial**  
O MVP utiliza `draft` e `published`.

**RN-011 — Visibilidade de rascunho**  
Rascunhos não aparecem no catálogo público.

**RN-012 — Publicação**  
Somente o autor autenticado pode publicar ou retirar de publicação uma obra vinculada à própria conta.

**RN-013 — Integridade de autoria**  
Uma obra deve possuir autor enquanto estiver sob edição. A exceção é a preservação após exclusão da conta.

**RN-014 — Autor único no MVP**  
Cada livro possui um único autor ativo no MVP.

**RN-015 — Gêneros controlados**  
Gêneros pertencem a uma lista administrada pelo projeto. Usuários não criam novos gêneros.

A lista inicial é mantida em `05-Modelo-de-Dados.md`, seção **genres**.

**RN-016 — Capa opcional**  
A capa é opcional e deve ser tratada como arquivo associado à obra.

Formato, limites, paths e autorização de upload: `11-Seguranca.md`, seções **Storage** e **Uploads**.

**RN-017 — Validade mínima de criação**  
Um livro só deve ser considerado criado quando possuir:

- autor válido;
- título;
- entre 1 e 3 gêneros.

Podem estar ausentes no rascunho:

- descrição;
- capa;
- capítulos;
- data de publicação.

**RN-017A — Criação lógica atômica**  
A criação do livro e de suas associações obrigatórias de gênero não deve deixar uma obra estruturalmente inválida persistida.

**RN-018 — Gêneros por obra**  
Todo livro deve possuir entre 1 e 3 gêneros desde a criação.

**RN-019 — Situação narrativa**  
A situação da história é independente do estado editorial.

Valores do MVP:

- `ongoing`;
- `completed`;
- `discontinued`.

**RN-019A — Descontinuação após exclusão do autor**  
Obra preservada que não esteja concluída deve passar para `discontinued`.

**RN-019B — Idioma padrão**  
O idioma padrão de novas obras é `pt-BR`, sem impedir suporte futuro a outros idiomas.

**RN-019C — Critérios mínimos de publicação do livro**  
Para passar de `draft` para `published`, exigir:

- título;
- descrição;
- entre 1 e 3 gêneros;
- pelo menos 1 capítulo publicado.

A capa permanece opcional.

---

## 4. Capítulos

**RN-020 — Pertencimento**  
Todo capítulo pertence a exatamente um livro.

**RN-021 — Ordenação**  
Cada capítulo possui posição inteira positiva e determinística dentro do livro.

**RN-021A — Sequência contínua**  
As posições formam uma sequência contínua:

```text
1, 2, 3, 4, ...
```

**RN-021B — Novo capítulo ao final**  
Todo novo capítulo nasce no final da sequência. A posição é atribuída pelo banco.

**RN-021C — Sem reordenação no MVP**  
O MVP não permite:

- reordenar capítulos;
- inserir capítulo entre posições existentes;
- escolher posição manualmente.

**RN-022 — Rascunho de capítulo**  
Rascunhos podem ser salvos incompletos e permanecem privados ao autor.

**RN-023 — Capítulo publicado**  
Um capítulo só participa da leitura pública quando ele e o livro pai estiverem publicados.

**RN-024 — Exclusão de livro**  
A exclusão de um livro não pode deixar capítulos órfãos.

**RN-024A — Exclusão sequencial de capítulo**  
Excluir um capítulo intermediário remove também todos os capítulos posteriores da mesma obra.

Exemplo:

```text
1 2 3 4 5 6 7 8 9 10
excluir 7
→
1 2 3 4 5 6
```

**RN-025 — Navegação sequencial**  
Anterior e próximo consideram apenas capítulos publicados e sua ordem.

**RN-026 — Critérios mínimos de publicação do capítulo**  
Para publicar um capítulo, exigir:

- título;
- conteúdo entre 500 e 15.000 caracteres, considerando espaços.

O título não entra na contagem.

---

## 5. Biblioteca e favoritos

**RN-030 — Favorito único**  
O mesmo usuário não pode favoritar o mesmo livro mais de uma vez.

**RN-031 — Remoção**  
Remover favorito não altera a obra original.

**RN-032 — Independência da autoria**  
Favoritar não concede permissão de edição.

**RN-033 — Favoritos de obra preservada**  
Preservar uma obra após exclusão do autor não remove automaticamente favoritos existentes.

**RN-034 — Privacidade da biblioteca no MVP**  
A biblioteca/favoritos será privada ao próprio usuário.

**RN-035 — Obra elegível para favorito**  
Somente livros publicados podem ser adicionados aos favoritos.

Autorização detalhada: `11-Seguranca.md`, seção **Matriz de Autorização RLS**.

---

## 6. Descoberta e leitura

**RN-040 — Catálogo público**  
Somente livros publicados aparecem em listagens públicas.

**RN-041 — Página inicial**  
Enquanto o catálogo for pequeno, a página inicial pode listar todos os livros publicados, respeitando limites técnicos quando necessário.

**RN-042 — Relevância**  
A ordenação inicial pode ser simples. Algoritmos personalizados ficam pós-MVP.

**RN-043 — Filtro por gênero**  
A modelagem deve permitir múltiplos gêneros por obra dentro do limite definido.

**RN-044 — Leitura pública**  
Visitantes podem consultar livros publicados e capítulos publicados pertencentes a livros publicados.

**RN-045 — Recursos autenticados**  
Criação, edição, publicação, exclusão e biblioteca/favoritos exigem autenticação.

---

## 7. Exclusão de conta e conteúdo

**RN-070 — Escolha do autor**  
Ao excluir a conta, o autor escolhe excluir ou preservar suas obras.

**RN-071 — Exclusão das obras**  
Se optar por excluir, livros e dependências devem ser removidos sem deixar registros órfãos.

**RN-072 — Preservação das obras**  
Se optar por preservar, o vínculo com o perfil deve ser removido e a disponibilidade pública passa a depender do estado editorial da obra.

**RN-073 — Autoria removida**  
Obras preservadas exibem **Autor desconhecido**.

**RN-074 — Obra não concluída**  
Obras preservadas e não concluídas passam para `discontinued`.

**RN-075 — Operação protegida**  
A exclusão definitiva da identidade de autenticação exige mecanismo privilegiado protegido.

Estratégia de FKs e cascatas: `05-Modelo-de-Dados.md`, seção **Exclusões**.

---

## 8. Conteúdo e validação

**RN-050 — Fonte da autorização**  
Ocultar controles no frontend não constitui autorização.

**RN-051 — Conteúdo não confiável**  
Texto fornecido por usuários deve ser tratado como conteúdo não confiável.

**RN-052 — Renderização de capítulos**  
No MVP, conteúdo textual não deve ser interpretado como HTML arbitrário.

**RN-053 — Credenciais privilegiadas**  
Credenciais administrativas não podem ser expostas no frontend.

**RN-054 — Validação em duas camadas**  
Validações relevantes devem existir no frontend para UX e novamente na camada persistente apropriada para integridade.

**RN-055 — Proteção de publicação**  
O banco deve rejeitar tentativas de publicação que não cumpram RN-019C e RN-026.

A implementação técnica está em `11-Seguranca.md`, seção **Validação e proteção no banco**.

---

## 9. Recursos evolutivos

Ficam fora do MVP:

- histórico e continuação de leitura;
- offline/PWA;
- comentários;
- recomendações;
- reorganização avançada de capítulos;
- experiência multilíngue completa.

Roadmap: `08-Backlog-e-Roadmap.md`.

---

## 10. Regra de mudança

Nova regra de negócio deve:

1. receber identificador;
2. descrever comportamento verificável;
3. apontar requisito relacionado quando possível;
4. ser refletida em testes;
5. atualizar documentos técnicos afetados.
