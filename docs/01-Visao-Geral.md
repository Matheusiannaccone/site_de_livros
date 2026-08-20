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

O usuário autenticado poderá publicar livros organizados em capítulos. Os livros publicados poderão ser encontrados e lidos por outros usuários. A aplicação deverá priorizar navegação simples, boa experiência de leitura e funcionamento adequado em telas pequenas.

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

Desenvolver uma aplicação web funcional que permita cadastro, publicação e leitura de livros organizados em capítulos, usando HTML, CSS e JavaScript puro no frontend, versionamento Git/GitHub e hospedagem na Vercel.

## 7. Objetivos específicos

- implementar autenticação de usuários;
- permitir criação e manutenção de perfil;
- permitir criação de livros;
- permitir criação e edição de capítulos;
- controlar rascunhos e publicações;
- apresentar catálogo de livros publicados;
- permitir consulta de detalhes de uma obra;
- criar uma experiência de leitura responsiva;
- implementar categorização por gênero;
- estruturar a aplicação para recursos sociais e de descoberta;
- manter controle de acesso sobre conteúdos pertencentes ao usuário;
- documentar decisões técnicas e evolução do projeto;
- aplicar Semantic Versioning.

## 8. Princípios do produto

### 8.1 Uma conta, dois papéis

Não haverá separação entre conta de leitor e conta de escritor. Todo usuário autenticado poderá publicar conteúdo e ler conteúdos de outros usuários.

### 8.2 Mobile first

A experiência será projetada primeiro para telas pequenas. Layouts maiores serão extensões progressivas da interface mobile.

### 8.3 Conteúdo pertence ao autor

Somente o autor poderá alterar ou excluir suas próprias obras e capítulos.

### 8.4 Publicação controlada

Livros e capítulos poderão existir como rascunho antes de se tornarem visíveis ao público.

### 8.5 Evolução incremental

O MVP deverá estar completo antes de funcionalidades de maior complexidade, como recomendações avançadas, PWA e leitura offline.

## 9. Escopo do MVP

O MVP deverá contemplar:

- cadastro;
- login e logout;
- perfil básico;
- catálogo de livros publicados;
- página de detalhes do livro;
- criação e edição de livro;
- upload de capa;
- criação e edição de capítulos;
- rascunho e publicação;
- leitor de capítulos;
- navegação entre capítulos;
- gêneros;
- busca básica;
- biblioteca/favoritos;
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

O fluxo abaixo deve funcionar de ponta a ponta:

```text
Usuário A cria conta
→ cria um livro
→ adiciona capítulos
→ publica a obra
→ Usuário B encontra o livro
→ abre a página da obra
→ inicia a leitura
→ navega entre os capítulos
```

O produto será considerado funcional quando esse fluxo principal estiver estável, seguro e utilizável em dispositivos móveis.
