# 12 — Deploy e Ambientes

## 1. Ambientes

### Desenvolvimento local

Usado para implementação.

Durante a fase atual, `localhost` e `127.0.0.1` utilizam automaticamente os adapters mock.

### Preview

Quando disponível pela Vercel, usado para revisão de branches/PRs.

Previews utilizam Supabase real conforme a regra de seleção por hostname.

### Produção

Versão integrada da `main`.

Produção utiliza Supabase real.

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
2. executar o projeto;
3. configurar valores públicos necessários;
4. utilizar o ambiente Supabase acordado;
5. criar branch própria.

O projeto não pode depender de arquivos existentes apenas em uma máquina.

## 4. Configuração

Valores públicos de inicialização devem possuir nomes padronizados.

Nunca adicionar credenciais privilegiadas ao frontend.

Se houver funções server-side, seus segredos ficam no ambiente protegido da Vercel.

Segurança de chaves: `11-Seguranca.md`.

### 4.1 Seleção temporária de datasource

Durante a fase atual:

```text
localhost / 127.0.0.1 → mock
outros hostnames       → supabase
```

A regra deve ser centralizada para que páginas e services não precisem ser modificados ao alternar entre fontes de dados.

Se futuramente houver necessidade de testar Supabase real em localhost, essa estratégia deverá ser revisada.

## 5. Deploy

```text
branch
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

A `main` é a branch de produção salvo decisão documentada em contrário.

Workflow Git: `09-Git-e-Versionamento.md`.

## 6. Banco de dados

Mudanças estruturais devem ser reproduzíveis.

Preferir:

- migrations;
- SQL versionado;
- documentação do schema;
- revisão antes de mudanças destrutivas.

Rollback de frontend não desfaz automaticamente alterações no banco.

### 6.1 Seeds

O arquivo `supabase/seed.sql` deve existir como ponto versionado para dados iniciais reproduzíveis.

Ele pode permanecer sem `INSERT`s enquanto não houver tabelas com dados estáticos a popular.

Quando tabelas controladas, como `genres`, entrarem no schema, seus dados iniciais poderão ser adicionados ao seed conforme necessidade.

## 7. Dados de demonstração

Próximo da entrega, preparar dados suficientes para demonstrar:

- mais de um usuário;
- livros e gêneros diferentes;
- múltiplos capítulos;
- rascunho;
- favorito/biblioteca.

## 8. Rollback

### Frontend

- identificar último commit estável;
- reverter mudança;
- gerar novo deploy.

### Banco

- avaliar migration;
- proteger dados;
- não assumir rollback automático.

## 9. Checklist de produção

Antes de produção/release:

- [ ] `main` correta;
- [ ] versão definida;
- [ ] regressão concluída conforme `10-Testes.md`, seção **Checklist de regressão**;
- [ ] checklist de segurança concluído conforme `11-Seguranca.md`;
- [ ] nenhuma chave privilegiada no bundle;
- [ ] links/404 validados;
- [ ] banco compatível;
- [ ] Storage funcionando;
- [ ] documentação compatível;
- [ ] tag/release criada quando aplicável.

## 10. Responsabilidade de equipe

Pelo menos duas pessoas devem saber:

- acessar Supabase;
- compreender deploy Vercel;
- recuperar versão anterior;
- interpretar erros básicos de produção.

Infraestrutura não deve depender de conhecimento exclusivo de uma pessoa.
