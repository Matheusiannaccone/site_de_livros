# 02 — Requisitos

## 1. Convenções

- **RF:** Requisito Funcional
- **RNF:** Requisito Não Funcional
- **Prioridade:** Essencial, Importante ou Evolutivo
- Requisitos marcados como **Essencial** compõem o MVP, salvo decisão registrada posteriormente.

---

# 2. Requisitos Funcionais

## 2.1 Conta e autenticação

| ID | Requisito | Prioridade |
|---|---|---|
| RF-001 | O sistema deve permitir o cadastro de usuários. | Essencial |
| RF-002 | O sistema deve permitir autenticação por credenciais válidas. | Essencial |
| RF-003 | O sistema deve permitir logout. | Essencial |
| RF-004 | O sistema deve permitir recuperação de acesso por mecanismo suportado pelo provedor de autenticação. | Importante |
| RF-005 | O usuário autenticado deve poder visualizar e editar dados permitidos do próprio perfil. | Essencial |
| RF-006 | O usuário deve poder solicitar a exclusão da própria conta. | Essencial |
| RF-007 | Ao excluir a conta, o usuário deve poder escolher entre excluir suas obras ou permitir que elas permaneçam disponíveis no sistema. | Essencial |

## 2.2 Livros

| ID | Requisito | Prioridade |
|---|---|---|
| RF-010 | O usuário autenticado deve poder criar um livro. | Essencial |
| RF-011 | O autor deve poder editar seu próprio livro. | Essencial |
| RF-012 | O autor deve poder excluir seu próprio livro. | Essencial |
| RF-013 | O autor deve poder salvar um livro como rascunho. | Essencial |
| RF-014 | O autor deve poder publicar um livro quando os critérios mínimos de publicação forem atendidos. | Essencial |
| RF-015 | O autor deve poder definir título e descrição da obra. | Essencial |
| RF-016 | O autor deve poder associar uma capa opcional ao livro. | Essencial |
| RF-017 | O autor deve poder associar de 1 a 3 gêneros permitidos ao livro. | Essencial |
| RF-018 | O sistema deve exibir somente obras publicadas nas áreas públicas de descoberta. | Essencial |
| RF-019 | O sistema deve permitir que o autor visualize suas obras em rascunho. | Essencial |
| RF-019A | Para ser publicado, um livro deve possuir título, descrição, de 1 a 3 gêneros e pelo menos um capítulo publicado. | Essencial |
| RF-019B | O sistema deve permitir classificar uma obra como em andamento, concluída ou descontinuada, sem confundir essa classificação com seu estado de rascunho/publicação. | Essencial |
| RF-019C | Quando uma obra for preservada após a exclusão da conta de seu autor, o sistema deve exibir sua autoria como "Autor desconhecido". | Essencial |
| RF-019D | Quando uma obra não concluída for preservada após a exclusão da conta de seu autor, o sistema deve marcá-la como descontinuada. | Essencial |

## 2.3 Capítulos

| ID | Requisito | Prioridade |
|---|---|---|
| RF-020 | O autor deve poder criar capítulos em seus próprios livros. | Essencial |
| RF-021 | O autor deve poder editar capítulos próprios. | Essencial |
| RF-022 | O autor deve poder excluir capítulos próprios. | Essencial |
| RF-023 | O autor deve poder salvar capítulos como rascunho mesmo que ainda não atendam aos critérios mínimos de publicação. | Essencial |
| RF-024 | O autor deve poder publicar capítulos que atendam aos critérios mínimos de publicação. | Essencial |
| RF-025 | O sistema deve ordenar capítulos de uma obra de forma definida. | Essencial |
| RF-026 | Capítulos não publicados não devem ser exibidos a outros usuários. | Essencial |
| RF-027 | Para ser publicado, um capítulo deve possuir título e conteúdo entre 500 e 15.000 caracteres, considerando espaços. | Essencial |

## 2.4 Descoberta e leitura

| ID | Requisito | Prioridade |
|---|---|---|
| RF-030 | A página inicial deve apresentar livros publicados. | Essencial |
| RF-031 | Visitantes autenticados ou não autenticados devem poder abrir a página de detalhes de um livro publicado. | Essencial |
| RF-032 | A página pública do livro deve listar seus capítulos publicados. | Essencial |
| RF-033 | Visitantes autenticados ou não autenticados devem poder abrir um capítulo publicado para leitura. | Essencial |
| RF-034 | O leitor deve poder navegar para o capítulo anterior e para o próximo quando existirem. | Essencial |
| RF-035 | O sistema deve permitir busca básica por livro. | Essencial |
| RF-036 | O sistema deve permitir filtrar ou navegar por gênero. | Essencial |
| RF-037 | O usuário autenticado deve poder adicionar e remover livros da biblioteca/favoritos. | Essencial |

## 2.5 Recursos sociais e continuidade

| ID | Requisito | Prioridade |
|---|---|---|
| RF-040 | O sistema poderá registrar histórico de leitura. | Evolutivo |
| RF-041 | O sistema poderá permitir continuar uma leitura a partir do último capítulo acessado. | Evolutivo |
| RF-042 | O sistema poderá permitir curtidas ou avaliações. | Evolutivo |
| RF-043 | O sistema poderá permitir comentários. | Evolutivo |
| RF-044 | O sistema poderá exibir página pública de autor. | Importante |
| RF-045 | O sistema poderá registrar seguidores. | Evolutivo |
| RF-046 | O sistema poderá apresentar ranking de popularidade. | Evolutivo |
| RF-047 | O sistema poderá recomendar obras com base em sinais de interesse. | Evolutivo |

## 2.6 Offline e PWA

| ID | Requisito | Prioridade |
|---|---|---|
| RF-050 | O sistema poderá permitir disponibilizar capítulos selecionados para leitura offline. | Evolutivo |
| RF-051 | A aplicação poderá ser instalável como PWA. | Evolutivo |
| RF-052 | O sistema poderá permitir exportação de conteúdo em formato adequado, respeitando autorização e regras futuras do produto. | Evolutivo |

---

# 3. Requisitos Não Funcionais

## 3.1 Tecnologia e restrições acadêmicas

| ID | Requisito | Prioridade |
|---|---|---|
| RNF-001 | O frontend deve ser desenvolvido com HTML, CSS e JavaScript puro. | Obrigatório |
| RNF-002 | O código deve ser versionado com Git. | Obrigatório |
| RNF-003 | O repositório deve ser hospedado no GitHub. | Obrigatório |
| RNF-004 | A aplicação deve ser hospedada na Vercel. | Obrigatório |
| RNF-005 | As versões devem seguir `MAJOR.MINOR.PATCH`. | Obrigatório |

## 3.2 Interface e experiência

| ID | Requisito | Prioridade |
|---|---|---|
| RNF-010 | A interface deve seguir abordagem mobile first. | Essencial |
| RNF-011 | A navegação principal deve ser utilizável em telas pequenas. | Essencial |
| RNF-012 | O leitor deve priorizar legibilidade e conforto visual. | Essencial |
| RNF-013 | Componentes equivalentes devem manter padrões visuais consistentes. | Essencial |
| RNF-014 | A aplicação deve possuir estados visuais para carregamento, erro, sucesso e ausência de conteúdo quando aplicável. | Importante |
| RNF-015 | A interface deve informar de forma clara quando a autoria de uma obra preservada não estiver mais vinculada a uma conta e quando a obra estiver descontinuada. | Essencial |

## 3.3 Segurança

| ID | Requisito | Prioridade |
|---|---|---|
| RNF-020 | Operações restritas devem exigir usuário autenticado. A leitura de conteúdo publicado não deve exigir autenticação. | Essencial |
| RNF-021 | A autorização não pode depender apenas de controles do frontend. | Essencial |
| RNF-022 | Tabelas expostas devem possuir políticas RLS adequadas para leitura pública e operações autenticadas. | Essencial |
| RNF-023 | Credenciais privilegiadas não devem ser incorporadas ao código público do frontend. | Essencial |
| RNF-024 | Entradas de usuário devem ser tratadas de forma a reduzir risco de injeção de conteúdo e XSS. | Essencial |
| RNF-025 | O upload de arquivos deve restringir formatos e limites definidos pelo projeto. | Importante |
| RNF-026 | A exclusão definitiva da conta de autenticação e operações que exijam privilégio administrativo devem ocorrer por mecanismo server-side protegido. | Essencial |

## 3.4 Dados

| ID | Requisito | Prioridade |
|---|---|---|
| RNF-030 | O sistema deve usar PostgreSQL como banco relacional. | Arquitetural |
| RNF-031 | Relações essenciais devem usar chaves estrangeiras quando aplicável. | Essencial |
| RNF-032 | Regras de integridade devem ser aplicadas no banco sempre que viável. | Essencial |
| RNF-033 | Consultas frequentes devem poder receber índices conforme necessidade real. | Importante |
| RNF-034 | O modelo de dados deve permitir preservar uma obra publicada após a remoção do perfil de seu autor sem manter vínculo obrigatório com a conta excluída. | Essencial |

## 3.5 Manutenção

| ID | Requisito | Prioridade |
|---|---|---|
| RNF-040 | O JavaScript deve ser organizado em módulos por responsabilidade. | Essencial |
| RNF-041 | Código reutilizável não deve ser duplicado desnecessariamente entre páginas. | Importante |
| RNF-042 | Decisões arquiteturais relevantes devem ser registradas. | Importante |
| RNF-043 | Alterações de escopo devem atualizar a documentação relacionada. | Importante |

## 3.6 Compatibilidade

| ID | Requisito | Prioridade |
|---|---|---|
| RNF-050 | A aplicação deve funcionar em navegadores modernos baseados em Chromium, Firefox e Safari, dentro do escopo de testes do grupo. | Importante |
| RNF-051 | A aplicação deve possuir layout funcional em mobile, tablet e desktop. | Essencial |
| RNF-052 | Funcionalidades principais não devem depender exclusivamente de interação por hover. | Essencial |

---

# 4. Critérios para alteração de requisitos

Um requisito poderá ser alterado quando:

1. houver decisão do grupo;
2. a alteração não violar exigência do professor;
3. o impacto em código, banco, segurança e UX for analisado;
4. a documentação relacionada for atualizada;
5. mudanças relevantes forem registradas em `13-Decisoes-Tecnicas.md`.

Requisitos obrigatórios da disciplina não podem ser removidos pelo grupo.
