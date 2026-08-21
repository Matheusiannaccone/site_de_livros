# 01 — Visão Geral do Projeto

## 1. Identificação

- **Nome provisório:** Site de Livros
- **Tipo:** aplicação web de escrita e leitura
- **Contexto:** projeto acadêmico em grupo
- **Equipe:** 5 integrantes
- **Abordagem de interface:** mobile first
- **Plataforma de hospedagem:** Vercel

## 2. Problema

Plataformas de publicação digital permitem que autores independentes divulguem histórias e que leitores descubram novos conteúdos. O projeto propõe desenvolver uma experiência simplificada desse modelo, adequada ao escopo acadêmico, mas com uma arquitetura capaz de receber novas funcionalidades sem exigir reconstrução completa.

## 3. Proposta de solução

Criar uma plataforma web em que uma única conta possa exercer simultaneamente os papéis de leitor e escritor.

Usuários autenticados poderão publicar livros organizados em capítulos. Livros e capítulos publicados poderão ser encontrados e lidos publicamente, sem necessidade de autenticação. A aplicação deverá priorizar navegação simples, boa experiência de leitura e funcionamento adequado em telas pequenas.

Recursos vinculados à identidade do usuário, como publicação, edição, exclusão de conteúdo e biblioteca/favoritos, exigirão autenticação.

## 4. Inspirações

O conceito de produto utiliza como referência plataformas de publicação e leitura social, como Wattpad, Spirit Fanfics e MangaToon.

As referências servem para entendimento de padrões de uso e necessidades do público. O objetivo não é reproduzir integralmente nenhuma plataforma existente.

## 5. Público-alvo

### Público primário

- pessoas interessadas em ler histórias publicadas por outros usuários;
- autores iniciantes ou independentes interessados em publicar textos;
- usuários que desejem alternar livremente entre leitura e escrita.

### Público secundário

- leitores que desejem organizar obras favoritas;
- autores que desejem acompanhar a própria produção;
- usuários interessados em descoberta de novos gêneros e autores.

## 6. Objetivo geral

Desenvolver uma aplicação web funcional que permita cadastro, publicação e leitura pública de livros organizados em capítulos, usando HTML, CSS e JavaScript puro no frontend, versionamento Git/GitHub e hospedagem na Vercel.

## 7. Objetivos específicos

- implementar autenticação de usuários;
- permitir criação e manutenção de perfil;
- permitir leitura pública de livros e capítulos publicados;
- permitir criação de livros;
- permitir criação e edição de capítulos;
- controlar rascunhos e publicações;
- apresentar catálogo de livros publicados;
- permitir consulta de detalhes de uma obra;
- criar uma experiência de leitura responsiva;
- implementar categorização por gênero;
- estruturar a aplicação para recursos sociais e de descoberta;
- manter controle de acesso sobre conteúdos pertencentes ao usuário;
- permitir política controlada de preservação ou exclusão das obras quando uma conta for excluída;
- documentar decisões técnicas e evolução do projeto;
- aplicar Semantic Versioning.

## 8. Princípios do produto

### 8.1 Uma conta, dois papéis

Não haverá separação entre conta de leitor e conta de escritor. Todo usuário autenticado poderá publicar conteúdo e utilizar recursos pessoais de leitura. A leitura de livros e capítulos publicados será permitida também para visitantes não autenticados.

### 8.2 Mobile first

A experiência será projetada primeiro para telas pequenas. Layouts maiores serão extensões progressivas da interface mobile.

### 8.3 Conteúdo pertence ao autor

Enquanto a conta do autor estiver ativa, somente ele poderá alterar ou excluir suas próprias obras e capítulos.

Ao solicitar a exclusão da conta, o autor poderá escolher entre excluir suas obras ou permitir que obras preservadas permaneçam disponíveis sem vínculo com sua identidade.

### 8.4 Publicação controlada

Livros e capítulos poderão existir como rascunho antes de se tornarem visíveis ao público.

Para publicar um livro, a obra deverá possuir título, descrição, entre 1 e 3 gêneros e pelo menos um capítulo publicado. A capa será opcional.

Para publicar um capítulo, ele deverá possuir título e conteúdo entre 500 e 15.000 caracteres. O limite de tamanho não impede o salvamento de capítulos incompletos como rascunho.

### 8.5 Gêneros controlados

O MVP utilizará uma lista controlada de gêneros. Cada livro deverá possuir pelo menos um e no máximo três gêneros.

### 8.6 Continuidade de obras após exclusão de conta

Ao excluir sua conta, o autor poderá escolher se suas obras também serão excluídas.

Caso opte por preservá-las, as obras mantidas deixarão de estar vinculadas ao perfil removido e deverão exibir a autoria como **Autor desconhecido**.

Se uma obra preservada ainda não estiver marcada como concluída, seu estado de publicação deverá indicar que ela foi **descontinuada**.

### 8.7 Evolução incremental

O MVP deverá estar completo antes de funcionalidades de maior complexidade, como recomendações avançadas, PWA e leitura offline.

## 9. Escopo do MVP

O MVP deverá contemplar:

- cadastro;
- login e logout;
- perfil básico;
- leitura pública sem login;
- catálogo de livros publicados;
- página de detalhes do livro;
- criação e edição de livro;
- upload opcional de capa;
- criação e edição de capítulos;
- rascunho e publicação;
- critérios mínimos de publicação;
- leitor de capítulos;
- navegação entre capítulos;
- lista controlada de gêneros;
- associação de 1 a 3 gêneros por livro;
- busca básica;
- biblioteca/favoritos para usuários autenticados;
- política de exclusão de conta com escolha sobre preservação das obras;
- identificação de obra preservada sem autor e de obra descontinuada;
- responsividade mobile first;
- autorização para edição apenas pelo autor.

## 10. Fora do escopo inicial

Os seguintes recursos não são necessários para considerar o MVP concluído:

- algoritmo personalizado de recomendação;
- mensagens privadas;
- monetização;
- exportação completa para EPUB/PDF;
- leitura offline;
- PWA;
- notificações push;
- moderação automatizada;
- múltiplos autores na mesma obra;
- editor rich text avançado.

Esses itens poderão ser avaliados após a estabilização do MVP.

## 11. Critério de sucesso do MVP

Os fluxos abaixo devem funcionar de ponta a ponta:

```text
Usuário A cria conta
→ cria um livro
→ adiciona capítulos
→ atende aos critérios de publicação
→ publica a obra
→ Visitante encontra o livro sem realizar login
→ abre a página da obra
→ inicia a leitura
→ navega entre os capítulos
```

E, para exclusão de conta:

```text
Autor solicita exclusão da conta
→ escolhe excluir ou preservar suas obras
→ sistema aplica a opção escolhida
→ obras preservadas deixam de identificar o perfil removido
→ obras não concluídas preservadas são marcadas como descontinuadas
```

O produto será considerado funcional quando os fluxos principais estiverem estáveis, seguros e utilizáveis em dispositivos móveis.
