# 01 — Visão Geral do Projeto

## 1. Identificação

- **Nome provisório:** e-writter
- **Tipo:** aplicação web de escrita e leitura
- **Contexto:** projeto acadêmico em grupo
- **Equipe:** 5 integrantes
- **Abordagem de interface:** mobile first
- **Plataforma de hospedagem:** Vercel

## 2. Problema
Plataformas de publicação digital permitem que autores independentes divulguem histórias e que leitores descubram novos conteúdos.

O projeto propõe uma experiência simplificada desse modelo, adequada ao escopo acadêmico e preparada para evolução incremental.

## 3. Proposta de solução

Criar uma plataforma web em que uma única conta possa atuar como leitor e escritor.

Livros e capítulos publicados poderão ser descobertos e lidos publicamente. Recursos vinculados à identidade do usuário, como publicação, edição, exclusão de conteúdo e biblioteca/favoritos, exigirão autenticação.

## 4. Inspirações

O conceito utiliza como referência plataformas de publicação e leitura social, como Wattpad, Spirit Fanfics e MangaToon.

As referências servem para entendimento de padrões de uso. O objetivo não é reproduzir integralmente nenhuma plataforma existente.

## 5. Público-alvo

### Público primário

- leitores de histórias publicadas por outros usuários;
- autores iniciantes ou independentes;
- usuários que desejem alternar entre leitura e escrita.

### Público secundário

- leitores que organizem obras favoritas;
- autores que acompanhem a própria produção;
- usuários interessados em descoberta por gênero ou autor.

## 6. Objetivo geral

Desenvolver uma aplicação web funcional de publicação e leitura de livros organizados em capítulos, usando HTML, CSS e JavaScript puro no frontend, Git/GitHub para versionamento, Supabase como backend e Vercel para hospedagem.

## 7. Objetivos específicos

- implementar autenticação e perfil;
- permitir criação, edição e publicação de livros e capítulos;
- permitir leitura pública de conteúdo publicado;
- apresentar catálogo, detalhes da obra e leitor de capítulos;
- permitir busca básica e navegação por gênero;
- permitir biblioteca/favoritos para usuários autenticados;
- proteger conteúdos e operações por autorização adequada;
- manter experiência mobile first;
- documentar decisões técnicas e evolução do projeto;
- aplicar Semantic Versioning.

## 8. Princípios do produto

### 8.1 Uma conta, dois papéis

Não haverá separação entre conta de leitor e escritor.

### 8.2 Mobile first

A experiência será projetada primeiro para telas pequenas.

### 8.3 Conteúdo e autoria

Enquanto houver autoria ativa, somente o autor poderá alterar ou excluir suas próprias obras e capítulos.

### 8.4 Publicação, gêneros e continuidade

As regras formais de criação, publicação, categorização, rascunhos e preservação de obras após exclusão da conta estão em `03-Regras-de-Negocio.md`, especialmente nas seções **Livros**, **Capítulos**, **Biblioteca e favoritos** e **Exclusão de conta e conteúdo**.

### 8.5 Evolução incremental

O MVP deve ser concluído antes de funcionalidades evolutivas como recomendações avançadas, PWA, offline e recursos sociais adicionais.

## 9. Escopo do MVP

O MVP contempla:

- cadastro, login, logout e sessão;
- perfil básico;
- leitura pública sem login;
- catálogo e página de detalhes;
- criação e edição de livros;
- capa opcional;
- criação, edição e publicação de capítulos;
- rascunhos;
- gêneros controlados;
- busca básica;
- biblioteca/favoritos;
- exclusão de conta com tratamento das obras;
- responsividade mobile first;
- autorização por autoria.

Requisitos completos: `02-Requisitos.md`.

## 10. Fora do escopo inicial

- recomendação personalizada;
- mensagens privadas;
- monetização;
- exportação completa para EPUB/PDF;
- leitura offline;
- PWA;
- notificações push;
- moderação automatizada;
- múltiplos autores por obra;
- editor rich text avançado.

O roadmap de evolução está em `08-Backlog-e-Roadmap.md`.

## 11. Critério de sucesso do MVP

O fluxo principal deve funcionar de ponta a ponta:

```text
Usuário cria conta
→ cria obra
→ adiciona capítulos
→ publica conteúdo válido
→ visitante encontra a obra
→ lê capítulos publicados
→ navega entre capítulos
```

Também deve funcionar o fluxo de exclusão de conta com exclusão ou preservação das obras, conforme `03-Regras-de-Negocio.md`.

O MVP será considerado funcional quando esses fluxos estiverem estáveis, seguros e utilizáveis em dispositivos móveis.
