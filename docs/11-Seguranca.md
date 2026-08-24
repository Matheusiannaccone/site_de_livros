# 11 — Segurança

## 1. Objetivo

Definir controles mínimos de segurança para uma aplicação em que usuários autenticados criam e publicam conteúdo.

Este documento não substitui revisão das políticas e triggers reais antes de deploy.

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
- tentar fazer upload de arquivo indevido.

Consequentemente, a segurança e a integridade não podem depender da interface.

## 3. Autenticação

Responsabilidade do Supabase Auth.

O frontend pode usar os valores públicos necessários para inicializar o SDK, mas não deve conter credenciais administrativas.

## 4. Chaves e configuração

### Permitido no cliente

Valores projetados para serem públicos, com RLS corretamente configurado:

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

## 5. Row Level Security

Regra geral:

> Nenhuma tabela exposta deve ser considerada pronta sem RLS revisada.

### `profiles`

Política preliminar:

- leitura somente dos campos definidos como públicos;
- alteração somente do próprio perfil.

### `books`

- público lê `published`;
- autor pode ler seus próprios rascunhos;
- insert exige usuário autenticado e autoria própria;
- update/delete somente autor;
- obra com `author_id = NULL` não pode ser assumida por outro usuário;
- critérios de criação e publicação não dependem apenas da RLS.

### `chapters`

- público lê capítulo publicado pertencente a obra publicada;
- autor do livro pode ler e alterar seus capítulos;
- terceiro não altera;
- exclusão deve respeitar a regra sequencial do MVP.

### `favorites`

- usuário gerencia apenas seus próprios registros;
- duplicação deve ser impedida pela PK composta;
- visibilidade pública da biblioteca deve ser decisão explícita, não padrão acidental.

### `book_genres`

- alteração somente dentro de operações autorizadas sobre o livro;
- usuário não pode associar gêneros a livro de terceiro;
- quantidade total deve permanecer entre 1 e 3 por livro.

## 6. Storage

Buckets previstos:

```text
covers
avatars
```

Definir:

- formatos permitidos;
- tamanho máximo;
- quem pode enviar;
- quem pode substituir;
- quem pode excluir.

Evitar confiar apenas na extensão do arquivo.

## 7. XSS e conteúdo

Capítulos e descrições são conteúdo de usuário.

No MVP:

- preferir texto simples;
- renderizar usando APIs seguras, como `textContent`, quando aplicável;
- não inserir conteúdo do usuário em `innerHTML` sem sanitização apropriada;
- evitar permitir HTML arbitrário no editor.

Se rich text for adicionado, será necessária estratégia explícita de sanitização.

## 8. Validação em duas camadas

Toda validação relevante deve ser aplicada em duas camadas.

```text
Frontend
  ↓
feedback rápido
mensagens amigáveis
melhor UX

Banco
  ↓
constraints
RLS
triggers
integridade real
```

Regra:

> Uma validação existente apenas no frontend deve ser considerada incompleta.

O usuário pode ignorar ou modificar JavaScript e chamar a API diretamente.

## 9. Proteção da publicação

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

## 10. Integridade na criação de livros

Um livro não deve permanecer persistido sem:

- autor válido durante autoria ativa;
- título;
- pelo menos 1 gênero;
- no máximo 3 gêneros.

Como gêneros são armazenados em tabela associativa, a criação deve ser tratada como operação lógica atômica.

Falha na associação obrigatória não deve resultar em livro incompleto persistido.

## 11. Ordenação e exclusão de capítulos

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

## 12. Autorização por ID

Nunca assumir que um `book_id`, `chapter_id` ou outro identificador recebido pertence ao usuário.

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

## 13. Exclusão

Ações destrutivas devem:

- exigir usuário autorizado;
- pedir confirmação na interface quando apropriado;
- respeitar FKs e dependências;
- evitar estados órfãos;
- respeitar regras de exclusão sequencial;
- ser testadas com usuário diferente do proprietário.

## 14. Privacidade

Evitar armazenar dados pessoais que não sejam necessários ao produto.

Separar conceitualmente:

- dados de autenticação;
- dados públicos de perfil;
- dados privados futuros.

## 15. Logs e erros

Mensagens de erro para o usuário não devem expor:

- query SQL;
- segredo;
- stack trace sensível;
- dados internos desnecessários;
- detalhes de políticas internas que facilitem abuso.

Durante desenvolvimento, logs podem ser mais detalhados, mas devem ser revisados antes da versão final.

## 16. Dependências

Mesmo usando JS puro, dependências externas devem ser:

- necessárias;
- provenientes de fonte confiável;
- atualizadas conscientemente;
- documentadas.

## 17. Checklist antes de release

- [ ] RLS ativa nas tabelas expostas;
- [ ] usuário B não altera conteúdo de A;
- [ ] rascunhos não vazam;
- [ ] `service_role` ausente do frontend;
- [ ] nenhuma secret key está no repositório;
- [ ] senha do banco não está no repositório;
- [ ] apenas URL e chave pública apropriada são usadas no cliente;
- [ ] uploads validados;
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

## 18. Regra para nova funcionalidade

Toda funcionalidade que cria, altera ou expõe dados deve responder:

1. quem pode ler?
2. quem pode criar?
3. quem pode editar?
4. quem pode excluir?
5. qual política RLS garante isso?
6. quais constraints ou triggers garantem integridade?
7. qual validação correspondente existe no frontend?
8. qual teste comprova o comportamento?

## 19. Evolução pós-MVP

Avaliar futuramente função/RPC específica:

```text
publish_book(book_id)
```

para tornar o fluxo de publicação uma operação explícita de domínio.

Essa evolução não elimina automaticamente a necessidade de proteção defensiva no banco.
