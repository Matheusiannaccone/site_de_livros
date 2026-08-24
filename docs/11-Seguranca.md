# 11 — Segurança

## 1. Objetivo

Definir a política de autorização, proteção de dados e Storage do MVP.

Este documento é a fonte oficial da **Matriz RLS vigente** e das regras de segurança de uploads.

Regras de produto: `03-Regras-de-Negocio.md`.  
Schema e constraints: `05-Modelo-de-Dados.md`.  
Casos de teste: `10-Testes.md`.

---

## 2. Modelo de ameaça

Considerar que um usuário pode:

- modificar JavaScript;
- chamar a API diretamente;
- alterar IDs e payloads;
- tentar ler rascunhos;
- tentar editar conteúdo alheio;
- tentar manipular estados;
- enviar arquivos inesperados;
- tentar gravar em paths de terceiros.

Consequência:

> segurança e integridade não podem depender da interface.

---

## 3. Autenticação e chaves

Supabase Auth gerencia identidade.

### Permitido no cliente

```text
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
```

### Proibido no frontend/repositório

- `service_role`;
- secret keys;
- senha do PostgreSQL;
- connection strings privilegiadas;
- tokens administrativos;
- segredos de serviços externos.

Segredos server-side ficam em ambiente protegido.

---

# 4. Matriz de Autorização RLS

## 4.1 Versão

```text
Matriz RLS: 1.0
```

Mudanças futuras:

```text
1.1
1.2
1.3
...
```

A versão atual é a referência principal.

O histórico textual completo permanece no Git. Neste documento, manter apenas um changelog resumido:

| Versão | Mudança | Referência |
|---|---|---|
| 1.0 | baseline inicial | ADR-023 |

## 4.2 Princípios

1. leitura pública somente quando explícita;
2. rascunhos privados ao autor;
3. UUID/URL não concedem autorização;
4. capítulos herdam autorização do livro;
5. `book_genres` herda autorização do livro;
6. favoritos pertencem ao próprio usuário;
7. `genres` é tabela controlada;
8. obra com `author_id = NULL` não pode ser assumida;
9. RLS define quem acessa linhas; constraints/triggers definem integridade;
10. frontend não é autoridade.

## 4.3 Matriz principal

| Tabela | `SELECT` | `INSERT` | `UPDATE` | `DELETE` |
|---|---|---|---|---|
| `profiles` | Público | próprio usuário | próprio usuário | negado diretamente |
| `books` | publicados ou próprias obras | autor autenticado | autor | autor |
| `chapters` | público somente se capítulo e livro publicados; autor vê próprios | autor do livro | autor do livro | autor do livro |
| `genres` | Público | negado | negado | negado |
| `book_genres` | publicado ou autor da obra | autor do livro | negado | autor do livro |
| `favorites` | próprio usuário | próprio usuário, livro publicado | negado | próprio usuário |

---

# 5. Políticas por tabela

## 5.1 `profiles`

### Leitura

```text
público
```

Os campos do MVP são públicos:

- `username`;
- `display_name`;
- `bio`;
- `avatar_path`;
- timestamps.

Dados privados de autenticação não pertencem a `profiles`.

### Criação

```text
auth.uid() IS NOT NULL
AND id = auth.uid()
```

### Atualização

```text
id = auth.uid()
```

A policy deve manter o vínculo com o próprio usuário.

### Exclusão

Não expor `DELETE` direto ao cliente.

A exclusão ocorre pelo fluxo protegido de conta definido em `03-Regras-de-Negocio.md`, seção **Exclusão de conta e conteúdo**.

## 5.2 `books`

### Leitura

```text
status = 'published'
OR
author_id = auth.uid()
```

Consequências:

| Situação | Público | Autor |
|---|---:|---:|
| publicado | sim | sim |
| draft | não | sim |
| publicado com `author_id = NULL` | sim | leitura pública |
| draft com `author_id = NULL` | não | não |

### Criação

```text
auth.uid() IS NOT NULL
AND author_id = auth.uid()
```

### Atualização

```text
USING author_id = auth.uid()
WITH CHECK author_id = auth.uid()
```

Isso impede transferência de autoria ou uso comum de `UPDATE` para definir `author_id = NULL`.

### Exclusão

```text
author_id = auth.uid()
```

Obras órfãs de autor são imutáveis para usuários comuns.

## 5.3 `chapters`

A propriedade deriva do livro:

```text
chapter.book_id
→ books.id
→ books.author_id
→ auth.uid()
```

### Leitura pública

```text
chapters.status = 'published'
AND
books.status = 'published'
```

O autor pode ler todos os capítulos das próprias obras.

### Escrita

`INSERT`, `UPDATE` e `DELETE` exigem autoria do livro pai.

RLS não deve ser usada para substituir regras estruturais de posição e exclusão sequencial. Essas regras ficam em `03-Regras-de-Negocio.md` e `05-Modelo-de-Dados.md`.

## 5.4 `genres`

```text
SELECT → público
INSERT → negado
UPDATE → negado
DELETE → negado
```

Seeds e alterações são administrativos/migration.

## 5.5 `book_genres`

Autorização deriva de `books.author_id`.

```text
SELECT
→ livro publicado OU autor da obra

INSERT
→ autor da obra

UPDATE
→ negado no MVP

DELETE
→ autor da obra
```

Troca de gênero ocorre por remover + inserir associação.

A quantidade de 1 a 3 gêneros é integridade de domínio/banco, não responsabilidade exclusiva da RLS.

## 5.6 `favorites`

Biblioteca privada no MVP.

```text
SELECT → user_id = auth.uid()

INSERT →
user_id = auth.uid()
E livro relacionado com status = 'published'

UPDATE → negado

DELETE → user_id = auth.uid()
```

A PK composta impede duplicação.

---

# 6. Invariantes da RLS 1.0

1. visitante não lê livro em draft;
2. visitante não lê capítulo sem capítulo e livro publicados;
3. usuário não altera livro de terceiro;
4. usuário não altera capítulo de terceiro;
5. usuário não altera gêneros de obra de terceiro;
6. usuário não lê/altera favoritos de terceiro;
7. usuário comum não modifica `genres`;
8. obra com `author_id = NULL` não é assumida;
9. conhecer UUID ou URL não concede autorização;
10. modificar frontend não contorna as regras anteriores.

---

# 7. Storage

## 7.1 Buckets

```text
avatars
covers
```

Ambos são públicos para leitura no MVP.

A URL de um asset não é segredo.

## 7.2 Matriz de Storage

| Bucket | Leitura | Upload/replace/delete |
|---|---|---|
| `avatars` | pública | proprietário |
| `covers` | pública | autor do livro |

## 7.3 Paths

```text
avatars/{user_id}/avatar.webp
covers/{book_id}/cover.webp
```

### Avatar

Mutação permitida apenas quando o `user_id` do path corresponde a `auth.uid()`.

### Capa

Mutação permitida apenas quando:

```text
book_id do path
→ books.id
→ books.author_id
→ auth.uid()
```

Com `author_id = NULL`, nenhum usuário comum pode alterar a capa.

## 7.4 Capas de rascunho

Como `covers` é público, quem conhecer a URL direta pode visualizar a imagem, inclusive se estiver associada a rascunho.

Isso não concede:

- acesso ao registro privado;
- acesso a capítulos privados;
- permissão de edição;
- bypass de RLS.

UUIDs reduzem descoberta acidental, mas não são controle de autorização.

---

# 8. Uploads

## 8.1 Entrada e persistência

Entrada aceita:

```text
JPEG
PNG
WebP
```

Persistência:

```text
WebP
```

Não aceitar SVG/GIF no MVP.

## 8.2 Pipeline

```text
arquivo
→ validar
→ redimensionar
→ converter para WebP no cliente
→ validar resultado
→ upload
```

A conversão client-side é otimização/UX, não mecanismo de segurança.

## 8.3 Limites

```text
avatar: até 2 MB
capa: até 5 MB
```

Os limites valem para o arquivo selecionado e para o resultado persistido.

Quando tecnicamente possível, configurar também limites e MIME no Storage.

## 8.4 Responsabilidades

Frontend:

- formato aceito;
- tamanho;
- redimensionamento;
- conversão;
- feedback.

Supabase:

- autenticação;
- autorização;
- bucket;
- path;
- propriedade;
- MIME persistido;
- tamanho.

---

# 9. Conteúdo e XSS

Capítulos, descrições e outros textos de usuário são não confiáveis.

No MVP:

- preferir texto simples;
- utilizar APIs seguras como `textContent`;
- não inserir texto de usuário em `innerHTML` sem sanitização;
- não permitir HTML arbitrário no editor.

Rich text futuro exige estratégia explícita de sanitização.

---

# 10. Validação e proteção no banco

A validação frontend melhora UX, mas não garante integridade.

Regras que precisam sobreviver a chamadas diretas devem ser protegidas por constraints, triggers, policies ou função adequada.

Em especial:

- publicação inválida deve ser rejeitada;
- criação de livro não pode terminar estruturalmente inválida;
- posição de capítulos deve permanecer válida;
- exclusões devem respeitar autoria e dependências.

Os critérios funcionais não são duplicados aqui:

- livros/capítulos: `03-Regras-de-Negocio.md`;
- constraints/FKs: `05-Modelo-de-Dados.md`.

---

# 11. Autorização por identificador

Nunca assumir que um ID recebido pertence ao usuário.

Exemplo:

```text
chapter_id
→ chapter.book_id
→ book.author_id
→ auth.uid()
```

A relação deve ser comprovada pela policy/consulta apropriada.

---

# 12. Privacidade

Separar:

- autenticação;
- perfil público;
- dados privados futuros.

Se `profiles` ganhar campos privados, a modelagem deve ser revista. RLS controla linhas, não resolve automaticamente exposição de colunas públicas e privadas na mesma estrutura.

---

# 13. Logs e erros

Erros exibidos ao usuário não devem revelar:

- query SQL;
- stack trace sensível;
- segredos;
- informações internas desnecessárias.

O contrato de erros do frontend está em `14-Contrato-Front-Supabase.md`.

---

# 14. Checklist de segurança

Antes de release relevante:

- [ ] RLS ativa nas tabelas expostas;
- [ ] Matriz vigente implementada;
- [ ] usuário A não altera dados de B;
- [ ] rascunhos não vazam;
- [ ] capítulo só é público com livro público;
- [ ] `service_role` e secrets ausentes do frontend/repositório;
- [ ] `genres` protegidos;
- [ ] favoritos privados;
- [ ] obra com `author_id = NULL` não pode ser assumida;
- [ ] paths de avatar/capa protegidos;
- [ ] apenas WebP persistido nos buckets do MVP;
- [ ] limites de upload protegidos além do frontend;
- [ ] conteúdo não é injetado como HTML inseguro.

Regressão completa: `10-Testes.md`.

---

# 15. Regra para nova funcionalidade

Toda funcionalidade que cria, altera ou expõe dados deve responder:

1. quem lê?
2. quem cria?
3. quem edita?
4. quem exclui?
5. qual RLS/policy garante?
6. quais constraints/triggers garantem integridade?
7. qual validação frontend existe?
8. qual teste comprova?
9. exige nova versão da Matriz RLS?

---

# 16. Evolução

Avaliar futuramente:

- função/RPC explícita de publicação;
- buckets privados quando houver confidencialidade real;
- variantes e transformações de imagens;
- novos formatos;
- separação adicional de dados públicos/privados;
- novas versões `1.X` da Matriz.
