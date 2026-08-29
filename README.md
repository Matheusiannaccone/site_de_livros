# Site de Livros

> **Nome provisório do projeto.** O nome comercial poderá ser alterado sem impacto na arquitetura documentada.

Plataforma web mobile first de escrita e leitura de livros, desenvolvida como projeto acadêmico em grupo. Qualquer usuário cadastrado poderá atuar como leitor e escritor, publicando obras organizadas em capítulos e consumindo conteúdos publicados por outros usuários.

## Objetivo

Entregar uma aplicação web funcional em que usuários possam:

- criar conta e autenticar-se;
- criar, editar e publicar livros;
- criar, editar e publicar capítulos;
- descobrir livros publicados;
- visualizar informações de uma obra;
- ler capítulos diretamente pelo navegador;
- gerenciar o próprio perfil e suas obras;
- favoritar livros;
- utilizar a aplicação adequadamente em dispositivos móveis e desktop.

Funcionalidades adicionais poderão ser evoluídas após o MVP conforme disponibilidade de tempo e prioridades definidas no roadmap.

## Stack

- **Frontend:** HTML5, CSS3 e JavaScript ES Modules, sem frameworks;
- **Backend as a Service:** Supabase;
- **Banco de dados:** PostgreSQL;
- **Autenticação:** Supabase Auth;
- **Autorização:** PostgreSQL Row Level Security (RLS);
- **Armazenamento de imagens:** Supabase Storage;
- **Ambiente local de backend:** Supabase CLI + Docker;
- **Hospedagem:** Vercel;
- **Versionamento de código:** Git + GitHub;
- **Versionamento do software:** Semantic Versioning (`MAJOR.MINOR.PATCH`).

## Arquitetura do frontend

As páginas e componentes não acessam diretamente o Supabase.

O fluxo previsto é:

```text
Página / Componente
        ↓
      Service
        ↓
      Adapter
      ↙     ↘
    Mock   Supabase
```

- **Pages e components** cuidam da interface e interação com o usuário;
- **Services** expõem contratos estáveis para o frontend;
- **Adapters Mock** permitem desenvolvimento e testes de interface sem dependência do backend;
- **Adapters Supabase** realizam chamadas reais à API, Auth, Storage e banco de dados.

A especificação detalhada está em [Arquitetura](docs/04-Arquitetura.md) e [Contrato Front ↔ Supabase](docs/14-Contrato-Front-Supabase.md).

## Estrutura atual do repositório

```text
/
├── assets/
│   ├── icons/
│   └── images/
├── css/
├── docs/
├── js/
│   ├── components/
│   ├── pages/
│   └── services/
│       └── adapters/
│           ├── mock/
│           └── supabase/
├── supabase/
│   ├── migrations/
│   ├── config.toml
│   └── seed.sql
├── index.html
├── package.json
└── README.md
```

Novas páginas, componentes, services, adapters e migrations serão adicionados conforme as funcionalidades forem implementadas.

## Banco de dados e Supabase

A estrutura do banco é versionada através de migrations em:

```text
supabase/migrations/
```

O ambiente local pode ser executado com:

```bash
npx supabase start
```

Para recriar o banco local a partir das migrations e do `seed.sql`:

```bash
npx supabase db reset
```

Alterações estruturais no banco devem ser testadas localmente antes de serem aplicadas ao projeto remoto sempre que possível.

### Perfis de usuário

A estrutura inicial de `profiles` já foi definida com:

- relação 1:1 com `auth.users`;
- criação automática do profile por trigger após cadastro;
- `username` único e obrigatório;
- username entre 3 e 30 caracteres;
- username apenas em letras minúsculas, números, `_` e `.`;
- `display_name` entre 1 e 60 caracteres;
- `bio` opcional com até 500 caracteres;
- atualização automática de `updated_at`;
- RLS com leitura pública e atualização restrita ao próprio usuário.

## Segurança

O frontend pode utilizar apenas informações públicas necessárias para conexão com o Supabase, como:

```text
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
```

Nunca devem ser expostos no frontend ou no repositório:

- `service_role`;
- secret keys;
- senha do banco;
- connection strings privilegiadas;
- qualquer outra credencial administrativa.

As políticas detalhadas estão documentadas em [Segurança](docs/11-Seguranca.md).

## Fluxo Git

O projeto utiliza branches curtas e focadas por tarefa.

Prefixos definidos:

```text
feature/
fix/
docs/
refactor/
```

Fluxo esperado:

```text
main atualizada
    ↓
nova branch
    ↓
implementação
    ↓
commit
    ↓
push
    ↓
Pull Request
    ↓
revisão
    ↓
merge em main
```

Não deve haver desenvolvimento direto na `main`.

Os commits seguem Conventional Commits e incluem a versão do projeto no padrão `MAJOR.MINOR.PATCH`, conforme definido em [Git e Versionamento](docs/09-Git-e-Versionamento.md).

## Ambientes

O projeto utiliza três contextos principais:

### Desenvolvimento com Mock

Usado principalmente para construção de interface e simulação de estados sem acesso ao backend.

### Supabase local

Executado com Supabase CLI e Docker para validar:

- migrations;
- Auth;
- constraints;
- triggers;
- RLS;
- integrações reais sem alterar o banco remoto.

### Ambiente remoto

O Supabase remoto é compartilhado pela equipe e deve receber alterações já validadas.

A aplicação publicada utiliza Vercel, com a `main` como referência de produção e previews para Pull Requests quando aplicável.

## Documentação

A documentação técnica está em [`docs/`](docs/):

1. [Visão Geral](docs/01-Visao-Geral.md)
2. [Requisitos](docs/02-Requisitos.md)
3. [Regras de Negócio](docs/03-Regras-de-Negocio.md)
4. [Arquitetura](docs/04-Arquitetura.md)
5. [Modelo de Dados](docs/05-Modelo-de-Dados.md)
6. [Fluxos de Usuário](docs/06-Fluxos-de-Usuario.md)
7. [Design System](docs/07-Design-System.md)
8. [Backlog e Roadmap](docs/08-Backlog-e-Roadmap.md)
9. [Git e Versionamento](docs/09-Git-e-Versionamento.md)
10. [Testes](docs/10-Testes.md)
11. [Segurança](docs/11-Seguranca.md)
12. [Deploy e Ambientes](docs/12-Deploy-e-Ambientes.md)
13. [Decisões Técnicas](docs/13-Decisoes-Tecnicas.md)
14. [Contrato Front ↔ Supabase](docs/14-Contrato-Front-Supabase.md)
15. [Links dos Tutoriais](docs/15-Link-dos-Tutoriais.md)

## Tutoriais internos

A equipe possui tutoriais em vídeo para padronizar a configuração e o uso do ambiente de desenvolvimento.

Os links são mantidos em:

[Links dos Tutoriais](docs/15-Link-dos-Tutoriais.md)

Os materiais são organizados de acordo com o tipo de atividade, como configuração inicial, Supabase local, banco de dados, frontend e integração.

## Estado atual do projeto

O projeto já saiu da fase exclusivamente de planejamento e arquitetura e entrou na implementação do MVP.

Atualmente já existem:

- documentação técnica e regras de negócio definidas;
- ambientes Supabase e Vercel configurados;
- fluxo Git e processo de Pull Request definidos;
- contratos Front ↔ Supabase documentados;
- Supabase CLI configurado para trabalho colaborativo;
- ambiente local com Docker disponível para testes;
- primeira estrutura de banco para `profiles`;
- triggers de criação e atualização de profile;
- policies RLS iniciais para `profiles`.

As próximas implementações devem seguir o roadmap e os cartões operacionais da equipe.

Ainda não existe uma versão estável `1.0.0`. Durante o desenvolvimento, o projeto permanece em versões `0.x.y`.

## Equipe

Projeto desenvolvido por um grupo de **5 integrantes**.

As responsabilidades de implementação são distribuídas entre frontend, backend/Supabase, integração, documentação e revisão de código conforme o planejamento da equipe.

## Documentos acadêmicos

O relatório final e a apresentação em formato de pitch serão produzidos a partir dos modelos fornecidos pelo professor.

Os documentos deste repositório funcionam como fonte técnica, histórica e de decisões do projeto para apoiar essas entregas.
