# 11 — Segurança

## 1. Objetivo

Definir controles mínimos de segurança para uma aplicação em que usuários autenticados criam e publicam conteúdo.

Este documento não substitui revisão das políticas reais antes de deploy.

## 2. Modelo de ameaça simplificado

Considerar que um usuário pode:

- alterar JavaScript no navegador;
- chamar diretamente a API;
- modificar IDs enviados;
- tentar ler rascunhos de terceiros;
- tentar alterar livros de terceiros;
- enviar conteúdo inesperado;
- tentar fazer upload de arquivo indevido.

Consequentemente, a segurança não pode depender da interface.

## 3. Autenticação

Responsabilidade do Supabase Auth.

O frontend pode usar dados públicos necessários para inicializar o SDK, mas não deve conter credenciais administrativas.

## 4. Chaves

### Permitido no cliente

Somente chaves projetadas para uso público com RLS corretamente configurado.

### Proibido

- `service_role`;
- credenciais de banco;
- segredos de serviços externos;
- tokens administrativos.

Segredos server-side devem permanecer em variáveis de ambiente protegidas.

## 5. Row Level Security

Regra geral:

> Nenhuma tabela exposta deve ser considerada pronta sem RLS revisada.

### `profiles`

Política preliminar:

- leitura de campos públicos conforme necessidade;
- alteração somente do próprio perfil.

### `books`

- público lê `published`;
- autor pode ler seus próprios rascunhos;
- insert exige usuário autenticado e autoria própria;
- update/delete somente autor.

### `chapters`

- público lê capítulo publicado pertencente a obra elegível;
- autor do livro pode ler/alterar seus capítulos;
- terceiro não altera.

### `favorites`

- usuário gerencia apenas seus próprios registros;
- visibilidade pública da biblioteca deve ser decisão explícita, não padrão acidental.

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

## 8. Validação

A validação deve existir em mais de uma camada quando necessária:

```text
Frontend
  ↓ melhora UX

Banco/constraints/RLS
  ↓ garante segurança e integridade
```

Não tratar validação apenas de formulário como proteção suficiente.

## 9. Autorização por ID

Nunca assumir que um `book_id` recebido pertence ao usuário.

Toda operação deve validar relação de autoria por política/consulta segura.

## 10. Exclusão

Ações destrutivas devem:

- exigir usuário autorizado;
- pedir confirmação na interface quando apropriado;
- respeitar FKs e dependências;
- evitar estados órfãos.

## 11. Privacidade

Evitar armazenar dados pessoais que não sejam necessários ao produto.

Separar conceitualmente:

- dados de autenticação;
- dados públicos de perfil;
- dados privados futuros.

## 12. Logs e erros

Mensagens de erro para o usuário não devem expor:

- query SQL;
- segredo;
- stack trace sensível;
- dados internos desnecessários.

Durante desenvolvimento, logs podem ser mais detalhados, mas devem ser revisados antes da versão final.

## 13. Dependências

Mesmo usando JS puro, dependências externas devem ser:

- necessárias;
- provenientes de fonte confiável;
- atualizadas conscientemente;
- documentadas.

## 14. Checklist antes de release

- [ ] RLS ativa nas tabelas expostas;
- [ ] usuário B não altera conteúdo de A;
- [ ] rascunhos não vazam;
- [ ] service role ausente do frontend;
- [ ] uploads validados;
- [ ] conteúdo de usuário não é injetado como HTML inseguro;
- [ ] secrets fora do repositório;
- [ ] `.gitignore` revisado;
- [ ] operações destrutivas protegidas;
- [ ] erros não expõem informações indevidas.

## 15. Regra para nova funcionalidade

Toda funcionalidade que cria, altera ou expõe dados deve responder:

1. quem pode ler?
2. quem pode criar?
3. quem pode editar?
4. quem pode excluir?
5. qual política RLS garante isso?
6. qual teste comprova isso?
