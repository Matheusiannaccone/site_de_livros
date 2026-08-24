# 11 — Segurança

## 1. Objetivo

Definir controles mínimos de segurança para uma aplicação em que usuários autenticados criam e publicam conteúdo.

Este documento não substitui revisão das políticas, constraints, triggers e regras de Storage reais antes de deploy.

---

## 2. Modelo de ameaça simplificado

Considerar que um usuário pode:

- alterar JavaScript no navegador;
- chamar diretamente a API;
- modificar IDs enviados;
- tentar alterar diretamente campos como `status`;
- tentar ler rascunhos de terceiros;
- tentar alterar livros de terceiros;
- tentar criar associações inválidas;
- enviar conteúdo inesperado;
- tentar executar ações destrutivas fora do fluxo previsto;
- tentar fazer upload de arquivo indevido;
- tentar gravar arquivos em caminhos pertencentes a outros usuários ou livros.

Consequentemente, a segurança e a integridade não podem depender da interface.

---

## 3. Autenticação

Responsabilidade do Supabase Auth.

O frontend pode usar os valores públicos necessários para inicializar o SDK, mas não deve conter credenciais administrativas.

---

## 4. Chaves e configuração

### Permitido no cliente

Valores projetados para serem públicos, com RLS e políticas de Storage corretamente configuradas:

```text
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
```

A chave pública destinada ao cliente não substitui autorização.

### Proibido no frontend e no repositório

- `service_role`;
- secret keys;
- credenciais de banco;
- senha do PostgreSQL;
- connection strings privilegiadas;
- segredos de serviços externos;
- tokens administrativos.

Segredos server-side devem permanecer em variáveis de ambiente protegidas.

---

# 5. Matriz de Autorização RLS

## 5.1 Versão

```text
Matriz RLS: 1.0
```

A versão `1.0` representa a baseline de autorização aprovada para o MVP.

Alterações futuras deverão seguir a sequência:

```text
1.1
1.2
1.3
...
```

Cada alteração deverá registrar:

- o que mudou;
- por que mudou;
- quais tabelas/policies foram afetadas;
- quais testes precisam ser revisados.

A versão mais recente deve ser a principal referência. A versão anterior da secção alterada deve ser mantida como `revised` após as matriz principal seguindo o padrão:

```text
v1.X - trecho modificado
motivo da alteração
```

## 5.2 Princípios

A Matriz RLS 1.0 segue estes princípios:

1. leitura pública somente quando explicitamente permitida;
2. rascunhos permanecem privados ao autor;
3. conhecer UUID, URL ou identificador não concede autorização;
4. capítulos herdam autorização do livro ao qual pertencem;
5. associações de gênero herdam autorização do livro;
6. favoritos pertencem exclusivamente ao usuário que os criou;
7. tabelas controladas não podem ser alteradas por usuários comuns;
8. obras preservadas com `author_id = NULL` não podem ser assumidas por outro usuário;
9. RLS responde quem pode acessar uma linha, enquanto constraints, triggers e funções respondem regras estruturais adicionais;
10. nenhuma regra crítica depende apenas do frontend.

## 5.3 Matriz principal

| Tabela | `SELECT` | `INSERT` | `UPDATE` | `DELETE` |
|---|---|---|---|---|
| `profiles` | Público | Usuário autenticado, somente `id = auth.uid()` | Somente o próprio usuário | Negado diretamente ao usuário; exclusão ocorre pelo fluxo protegido de conta |
| `books` | Público se `status = 'published'`; autor lê todas as próprias obras | Autenticado, somente com `author_id = auth.uid()` | Somente autor atual da obra | Somente autor atual da obra |
| `chapters` | Público somente se capítulo e livro estiverem `published`; autor lê todos os capítulos das próprias obras | Somente autor do livro | Somente autor do livro | Somente autor do livro, respeitando exclusão sequencial |
| `genres` | Público | Negado ao usuário comum | Negado ao usuário comum | Negado ao usuário comum |
| `book_genres` | Público quando livro estiver publicado; autor lê associações das próprias obras | Somente autor do livro | Negado no MVP | Somente autor do livro |
| `favorites` | Somente o próprio usuário | Somente o próprio usuário | Não utilizado no MVP | Somente o próprio usuário |

---

## 6. Política RLS por tabela

### 6.1 `profiles`

Os campos existentes no MVP são considerados públicos:

- `username`;
- `display_name`;
- `bio`;
- `avatar_path`;
- `created_at`;
- `updated_at`.

Nenhum e-mail, credencial ou dado privado de autenticação deve ser armazenado em `profiles`.

#### `SELECT`

```text
público
```

A leitura pública é necessária para exibir dados básicos de autoria.

#### `INSERT`

Permitido somente quando:

```text
auth.uid() IS NOT NULL
AND
profiles.id = auth.uid()
```

Um usuário não pode criar perfil para outro UUID.

#### `UPDATE`

Permitido somente quando:

```text
profiles.id = auth.uid()
```

#### `DELETE`

```text
DELETE direto pelo cliente → NEGADO
```

A exclusão de `profiles` deve ocorrer apenas dentro do fluxo protegido de exclusão de conta, que precisa tratar previamente:

- destino das obras;
- favoritos;
- autoria preservada ou removida;
- exclusão do perfil;
- exclusão da identidade no provedor de autenticação.

---

### 6.2 `books`

#### `SELECT`

Permitido quando:

```text
status = 'published'
```

ou quando:

```text
author_id = auth.uid()
```

Comportamento esperado:

| Situação | Visitante | Outro usuário | Autor |
|---|---:|---:|---:|
| Livro publicado | Sim | Sim | Sim |
| Livro em rascunho | Não | Não | Sim |
| Livro preservado publicado (`author_id = NULL`) | Sim | Sim | Leitura pública |
| Livro preservado em rascunho | Não | Não | Não |

#### `INSERT`

Permitido somente quando:

```text
auth.uid() IS NOT NULL
AND
author_id = auth.uid()
```

O cliente não pode criar obra em nome de outro usuário.

#### `UPDATE`

Permitido somente quando:

```text
author_id = auth.uid()
```

A política deve impedir que o autor use um `UPDATE` comum para:

- transferir autoria para outro usuário;
- definir `author_id = NULL`;
- assumir uma obra preservada.

A alteração para `author_id = NULL` fica reservada ao fluxo protegido de exclusão de conta.

#### `DELETE`

Permitido somente quando:

```text
author_id = auth.uid()
```

Livros com:

```text
author_id IS NULL
```

não podem ser alterados ou excluídos por usuários comuns.

Critérios de criação e publicação não dependem apenas da RLS.

---

### 6.3 `chapters`

A autorização de capítulos deriva do livro.

Fluxo conceitual:

```text
chapter.book_id
        ↓
books.id
        ↓
books.author_id
        ↓
auth.uid()
```

O capítulo não precisa duplicar `author_id`.

#### `SELECT` público

Somente quando:

```text
chapters.status = 'published'
AND
books.status = 'published'
```

O estado abaixo não torna o capítulo público:

```text
Livro: draft
Capítulo: published
```

O autor pode ler todos os capítulos das próprias obras quando:

```text
books.author_id = auth.uid()
```

#### `INSERT`

Somente quando:

```text
books.id = chapters.book_id
AND
books.author_id = auth.uid()
```

#### `UPDATE`

Somente o autor do livro pode alterar.

No MVP, o usuário não pode utilizar `UPDATE` para:

- alterar `book_id` arbitrariamente;
- escolher `position`;
- reordenar capítulos;
- inserir capítulo entre posições existentes.

Essas regras devem ser garantidas também por mecanismos de banco apropriados.

#### `DELETE`

Somente o autor do livro pode iniciar a exclusão.

A exclusão sequencial do MVP deve remover:

```text
position >= N
```

para o mesmo `book_id`.

A RLS define quem pode excluir; o mecanismo de banco define quais capítulos devem ser removidos.

---

### 6.4 `genres`

Tabela controlada pelo projeto.

#### `SELECT`

```text
público
```

Necessário para:

- criação e edição de obras;
- catálogo;
- filtros;
- página de detalhes.

#### Escrita

Para usuários comuns:

```text
INSERT → NEGADO
UPDATE → NEGADO
DELETE → NEGADO
```

A lista inicial de gêneros deve ser criada e alterada por migration ou operação administrativa controlada.

---

### 6.5 `book_genres`

A autorização deriva do livro.

Fluxo conceitual:

```text
book_genres.book_id
        ↓
books.author_id
        ↓
auth.uid()
```

#### `SELECT`

Permitido quando:

```text
books.status = 'published'
```

ou:

```text
books.author_id = auth.uid()
```

Isso impede que a tabela associativa revele metadados de rascunhos alheios.

#### `INSERT`

Permitido somente quando o usuário for autor do livro.

O `genre_id` deve referenciar um gênero válido da tabela controlada.

#### `UPDATE`

```text
NEGADO no MVP
```

A associação utiliza PK composta:

```text
(book_id, genre_id)
```

Uma troca de gênero deve ocorrer por:

```text
DELETE associação antiga
+
INSERT associação nova
```

#### `DELETE`

Permitido somente ao autor do livro.

A regra:

```text
1 <= quantidade_de_generos <= 3
```

não é responsabilidade exclusiva da RLS e deve ser protegida também por mecanismo de integridade no banco.

---

### 6.6 `favorites`

A biblioteca/favoritos será privada no MVP.

#### `SELECT`

Permitido somente quando:

```text
user_id = auth.uid()
```

Visitantes não veem favoritos.

Usuário A não vê favoritos de B.

#### `INSERT`

Permitido somente quando:

```text
user_id = auth.uid()
```

A obra favoritada deve estar publicada:

```text
books.status = 'published'
```

A PK composta:

```text
PRIMARY KEY (user_id, book_id)
```

impede duplicação.

#### `UPDATE`

```text
não utilizado no MVP
```

Favorito possui comportamento binário:

```text
não existe
↓
INSERT
↓
favoritado
↓
DELETE
↓
não favoritado
```

#### `DELETE`

Permitido somente quando:

```text
user_id = auth.uid()
```

---

# 7. Invariantes da RLS 1.0

Independentemente da implementação SQL futura:

1. visitante nunca lê rascunho de livro;
2. visitante nunca lê capítulo se o capítulo não estiver publicado;
3. visitante nunca lê capítulo se o livro pai não estiver publicado;
4. usuário nunca altera livro de terceiro;
5. usuário nunca altera capítulo de livro de terceiro;
6. usuário nunca altera associação de gênero de livro de terceiro;
7. usuário nunca consulta ou altera favoritos de terceiro;
8. usuário comum nunca modifica `genres`;
9. obra com `author_id = NULL` nunca pode ser assumida por outro usuário;
10. conhecer UUID não concede autorização;
11. modificar JavaScript não contorna nenhuma regra anterior;
12. regras estruturais adicionais continuam protegidas por constraints, triggers ou funções adequadas.

---

# 8. Storage

## 8.1 Buckets previstos

```text
covers
avatars
```

Ambos serão públicos para leitura no MVP.

A URL de uma imagem não será tratada como segredo.

A leitura pública do arquivo não concede acesso adicional a registros protegidos por RLS.

## 8.2 Matriz de Storage 1.0

| Bucket | Leitura | Upload | Substituição | Exclusão |
|---|---|---|---|---|
| `avatars` | Pública | Somente proprietário | Somente proprietário | Somente proprietário |
| `covers` | Pública | Somente autor do livro | Somente autor do livro | Somente autor do livro |

---

## 8.3 Avatares

Estrutura prevista:

```text
avatars/{user_id}/avatar.webp
```

Exemplo:

```text
avatars/
└── {uuid-do-usuario}/
    └── avatar.webp
```

Mutação permitida apenas quando:

```text
auth.uid() = user_id representado pelo caminho
```

Consequentemente:

```text
Usuário A → avatars/A/avatar.webp → permitido
Usuário A → avatars/B/avatar.webp → negado
```

A leitura será pública porque o avatar integra o perfil público.

---

## 8.4 Capas

Estrutura prevista:

```text
covers/{book_id}/cover.webp
```

Para upload, substituição ou exclusão:

```text
book_id do caminho
        ↓
books.id
        ↓
books.author_id
        ↓
auth.uid()
```

A operação só será permitida quando o usuário autenticado for o autor atual da obra.

Quando:

```text
author_id = NULL
```

nenhum usuário comum poderá modificar a capa.

---

## 8.5 Capas de rascunho em bucket público

O bucket `covers` será público no MVP.

Consequentemente, caso alguém conheça a URL direta de uma capa associada a um livro em rascunho, poderá visualizar apenas o arquivo da imagem.

Essa escolha é aceita porque:

```text
URL da capa
≠
acesso ao registro books
≠
acesso aos chapters
≠
permissão de edição
≠
bypass de RLS
```

A confidencialidade do arquivo da capa não é tratada como requisito de segurança equivalente à confidencialidade do conteúdo do livro.

UUIDs e caminhos não triviais reduzem descoberta acidental, mas não constituem mecanismo de autorização e não devem ser tratados como segredo.

---

# 9. Pipeline de imagens

## 9.1 Formatos aceitos na entrada

O frontend aceitará inicialmente:

```text
JPEG
PNG
WebP
```

Não serão aceitos no MVP:

```text
SVG
GIF
```

## 9.2 Formato persistido

O Storage armazenará somente:

```text
WebP
```

Estrutura final esperada:

```text
avatars/{user_id}/avatar.webp
covers/{book_id}/cover.webp
```

## 9.3 Conversão

A conversão ocorrerá no frontend antes do upload.

Fluxo:

```text
arquivo escolhido
       ↓
validação inicial
       ↓
redimensionamento
       ↓
conversão client-side
       ↓
WebP
       ↓
validação do resultado
       ↓
Supabase Storage
```

O objetivo é:

- reduzir tamanho armazenado;
- reduzir tráfego;
- padronizar formato;
- evitar dependência de transformação dinâmica do Supabase no MVP;
- manter a arquitetura simples e compatível com o plano atual.

Transformações dinâmicas poderão ser reavaliadas futuramente caso o produto necessite múltiplas variantes da mesma imagem.

---

# 10. Limites iniciais de upload

## Avatar

```text
arquivo original selecionado: máximo 2 MB
arquivo persistido: máximo 2 MB
```

## Capa

```text
arquivo original selecionado: máximo 5 MB
arquivo persistido: máximo 5 MB
```

O processamento frontend deverá normalmente reduzir significativamente o tamanho final.

Os limites devem ser aplicados também na configuração/política de Storage quando tecnicamente possível.

---

# 11. Segurança dos uploads

A validação client-side é apenas uma camada de UX e otimização.

Um usuário pode ignorar completamente o código JavaScript e chamar a API de Storage diretamente.

Portanto:

```text
FRONTEND
├── verifica formato aceito
├── verifica tamanho
├── redimensiona
├── converte para WebP
└── fornece feedback

SUPABASE
├── verifica autenticação
├── verifica autorização
├── verifica bucket
├── verifica caminho
├── verifica proprietário
├── restringe tipo persistido
└── restringe tamanho
```

Evitar confiar apenas em extensão de arquivo.

Sempre que possível, validar o MIME/content type apropriado do objeto persistido.

---

# 12. XSS e conteúdo

Capítulos e descrições são conteúdo de usuário.

No MVP:

- preferir texto simples;
- renderizar usando APIs seguras, como `textContent`, quando aplicável;
- não inserir conteúdo do usuário em `innerHTML` sem sanitização apropriada;
- evitar permitir HTML arbitrário no editor.

Se rich text for adicionado, será necessária estratégia explícita de sanitização.

---

# 13. Validação em duas camadas

Toda validação relevante deve ser aplicada em duas camadas.

```text
Frontend
  ↓
feedback rápido
mensagens amigáveis
melhor UX

Banco / Storage
  ↓
constraints
RLS
policies
triggers
integridade real
```

Regra:

> Uma validação existente apenas no frontend deve ser considerada incompleta.

O usuário pode ignorar ou modificar JavaScript e chamar a API diretamente.

---

# 14. Proteção da publicação

No MVP, a publicação de um livro será protegida por trigger no PostgreSQL.

Toda tentativa de:

```text
draft → published
```

deve validar novamente no banco:

- descrição preenchida;
- entre 1 e 3 gêneros;
- pelo menos 1 capítulo publicado;
- demais requisitos estruturais aplicáveis.

Mesmo uma chamada direta à API tentando executar:

```text
status = published
```

não pode contornar essa validação.

Se os critérios não forem atendidos:

```text
UPDATE rejeitado
```

A aplicação também deve executar as mesmas verificações previamente para oferecer feedback adequado ao usuário.

---

# 15. Integridade na criação de livros

Um livro não deve permanecer persistido sem:

- autor válido durante autoria ativa;
- título;
- pelo menos 1 gênero;
- no máximo 3 gêneros.

Como gêneros são armazenados em tabela associativa, a criação deve ser tratada como operação lógica atômica.

Falha na associação obrigatória não deve resultar em livro incompleto persistido.

---

# 16. Ordenação e exclusão de capítulos

A posição dos capítulos deve ser protegida por:

```text
CHECK(position > 0)
UNIQUE(book_id, position)
```

No MVP:

- posição é atribuída pelo banco;
- capítulo novo sempre nasce no final;
- não há reordenação;
- não há inserção intermediária.

A exclusão de capítulo intermediário deve remover também os posteriores.

A operação deve:

- confirmar autoria;
- limitar a exclusão ao livro correspondente;
- evitar exclusão de conteúdo de terceiros;
- manter a sequência restante válida.

---

# 17. Autorização por ID

Nunca assumir que um `book_id`, `chapter_id`, `user_id` ou outro identificador recebido pertence ao usuário.

Toda operação deve validar a relação de propriedade por política ou consulta segura.

Exemplo:

```text
chapter_id
↓
chapter.book_id
↓
book.author_id
↓
auth.uid()
```

Conhecer ou modificar um identificador no frontend não concede autorização.

---

# 18. Exclusão

Ações destrutivas devem:

- exigir usuário autorizado;
- pedir confirmação na interface quando apropriado;
- respeitar FKs e dependências;
- evitar estados órfãos;
- respeitar regras de exclusão sequencial;
- ser testadas com usuário diferente do proprietário.

A exclusão definitiva da identidade de autenticação deve continuar sendo uma operação protegida e não pode expor `service_role` no frontend.

---

# 19. Privacidade

Evitar armazenar dados pessoais que não sejam necessários ao produto.

Separar conceitualmente:

- dados de autenticação;
- dados públicos de perfil;
- dados privados futuros.

Se futuramente `profiles` passar a armazenar campos privados, eles não devem ser expostos apenas porque a linha do perfil possui leitura pública.

---

# 20. Logs e erros

Mensagens de erro para o usuário não devem expor:

- query SQL;
- segredo;
- stack trace sensível;
- dados internos desnecessários;
- detalhes de políticas internas que facilitem abuso.

Durante desenvolvimento, logs podem ser mais detalhados, mas devem ser revisados antes da versão final.

---

# 21. Dependências

Mesmo usando JavaScript puro, dependências externas devem ser:

- necessárias;
- provenientes de fonte confiável;
- atualizadas conscientemente;
- documentadas.

O processamento de imagens no MVP deve priorizar APIs nativas do navegador quando suficientes, evitando dependência adicional sem necessidade.

---

# 22. Checklist antes de release

- [ ] RLS ativa nas tabelas expostas;
- [ ] Matriz RLS implementada conforme versão vigente;
- [ ] usuário B não altera conteúdo de A;
- [ ] rascunhos não vazam;
- [ ] capítulo publicado de livro em rascunho não fica público;
- [ ] `service_role` ausente do frontend;
- [ ] nenhuma secret key está no repositório;
- [ ] senha do banco não está no repositório;
- [ ] apenas URL e chave pública apropriada são usadas no cliente;
- [ ] `profiles` não contém dados privados indevidos;
- [ ] `genres` não podem ser alterados por usuários comuns;
- [ ] favoritos de terceiros não podem ser lidos ou alterados;
- [ ] obra com `author_id = NULL` não pode ser assumida;
- [ ] uploads validados;
- [ ] usuário não grava avatar em pasta de terceiro;
- [ ] usuário não grava, substitui ou exclui capa de livro alheio;
- [ ] apenas WebP é persistido nos buckets de imagem do MVP;
- [ ] limites de tamanho estão protegidos além do frontend;
- [ ] conteúdo de usuário não é injetado como HTML inseguro;
- [ ] secrets fora do repositório;
- [ ] `.gitignore` revisado;
- [ ] operações destrutivas protegidas;
- [ ] erros não expõem informações indevidas;
- [ ] publicação inválida é rejeitada pelo banco;
- [ ] trigger de publicação testada por chamada direta à API;
- [ ] livro não permanece com zero gêneros;
- [ ] livro não recebe mais de três gêneros;
- [ ] posições de capítulos não se repetem;
- [ ] exclusão intermediária de capítulo respeita a regra do MVP.

---

# 23. Regra para nova funcionalidade

Toda funcionalidade que cria, altera ou expõe dados deve responder:

1. quem pode ler?
2. quem pode criar?
3. quem pode editar?
4. quem pode excluir?
5. qual política RLS ou Storage garante isso?
6. quais constraints, triggers ou funções garantem integridade?
7. qual validação correspondente existe no frontend?
8. qual teste comprova o comportamento?
9. a mudança exige incremento da Matriz RLS `1.X`?

---

# 24. Evolução pós-MVP

Avaliar futuramente:

```text
publish_book(book_id)
```

como função/RPC específica para tornar o fluxo de publicação uma operação explícita de domínio.

Essa evolução não elimina automaticamente a necessidade de proteção defensiva no banco.

Também poderão ser avaliadas:

- buckets privados para conteúdos que exijam confidencialidade real;
- variantes pré-geradas de imagens;
- transformações dinâmicas;
- formatos de imagem adicionais;
- políticas de acesso diferentes para biblioteca/favoritos;
- separação de campos públicos e privados de perfil;
- novas versões da Matriz RLS `1.X`.
