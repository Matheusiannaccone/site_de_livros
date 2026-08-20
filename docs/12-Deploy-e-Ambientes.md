# 12 — Deploy e Ambientes

## 1. Ambientes previstos

### Desenvolvimento local

Usado para implementação.

### Preview

Quando disponível pelo fluxo da Vercel, utilizado para revisar branches/PRs sem substituir produção.

### Produção

Versão integrada e estável acessível pelo domínio Vercel/configurado.

## 2. Serviços externos

```text
GitHub
  └── repositório e histórico

Vercel
  └── hospedagem/deploy

Supabase
  ├── Auth
  ├── PostgreSQL
  └── Storage
```

## 3. Preparação local

Cada integrante deve conseguir:

1. clonar o repositório;
2. abrir o projeto em servidor local adequado;
3. configurar variáveis necessárias;
4. autenticar na aplicação;
5. acessar o mesmo ambiente de desenvolvimento acordado;
6. criar branch própria.

O projeto não deve depender de arquivos existentes apenas no computador de um integrante.

## 4. Variáveis e configuração

Definir nomes padronizados para configurações públicas necessárias ao cliente.

Se o projeto utilizar um arquivo de configuração JavaScript público para inicialização do Supabase, documentar claramente quais valores são intencionalmente públicos.

Nunca adicionar chaves privilegiadas.

Caso funções server-side sejam adicionadas, segredos deverão ser configurados no ambiente da Vercel, não no frontend.

## 5. Deploy

Fluxo principal:

```text
feature branch
  ↓
Pull Request
  ↓
revisão
  ↓
merge main
  ↓
Vercel
  ↓
produção
```

Configurar a `main` como branch de produção salvo motivo documentado para outra estratégia.

## 6. Banco de dados

Alterações estruturais não devem depender apenas de edição manual sem registro.

Preferência:

- registrar SQL/migrations;
- versionar scripts seguros quando o fluxo do projeto for estabelecido;
- documentar alteração relevante do schema.

O banco de produção deve refletir a versão da aplicação correspondente.

## 7. Dados de demonstração

Próximo da entrega, criar conteúdo de demonstração que permita mostrar:

- mais de um usuário;
- múltiplos livros;
- gêneros diferentes;
- livro com vários capítulos;
- rascunho;
- favorito/biblioteca.

Não depender de improvisar conteúdo durante o pitch.

## 8. Rollback

Para frontend:

- identificar último commit estável;
- reverter mudança problemática;
- gerar novo deploy.

Para banco:

- mudanças destrutivas exigem cautela;
- migrations devem ser avaliadas antes da execução;
- não presumir que rollback de código desfaz automaticamente alteração de dados.

## 9. Checklist de produção

- [ ] `main` atualizada;
- [ ] versão definida;
- [ ] testes de regressão concluídos;
- [ ] RLS revisada;
- [ ] nenhuma chave privilegiada no bundle;
- [ ] links corretos;
- [ ] 404 funcionando;
- [ ] mobile validado;
- [ ] banco compatível;
- [ ] storage funcionando;
- [ ] documentação atualizada;
- [ ] tag/release criada quando aplicável.

## 10. Responsabilidade de equipe

Pelo menos duas pessoas devem saber:

- acessar configurações do Supabase;
- entender o deploy Vercel;
- recuperar uma versão anterior do Git;
- interpretar erros básicos de produção.

Evitar que infraestrutura se torne conhecimento exclusivo de um único integrante.
