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
- utilizar a aplicação adequadamente em dispositivos móveis e desktop.

Funcionalidades sociais e offline serão evoluções posteriores ao MVP, conforme disponibilidade de tempo.

## Stack definida

- **Frontend:** HTML5, CSS3 e JavaScript ES Modules, sem frameworks;
- **Backend as a Service:** Supabase;
- **Banco de dados:** PostgreSQL;
- **Autenticação:** Supabase Auth;
- **Autorização:** PostgreSQL Row Level Security (RLS);
- **Armazenamento de capas e imagens:** Supabase Storage;
- **Hospedagem:** Vercel;
- **Versionamento de código:** Git + GitHub;
- **Versionamento do software:** Semantic Versioning (`MAJOR.MINOR.PATCH`).

## Estrutura documental

A documentação de projeto está em [`docs/`](docs/):

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

## Estrutura prevista do repositório

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
├── index.html
└── README.md
```

Novas páginas HTML e módulos JavaScript serão adicionados conforme os fluxos do MVP forem implementados.

## Estado do projeto

**Fase atual:** planejamento e definição arquitetural.

Ainda não existe uma versão `1.0.0`. Durante o desenvolvimento, o projeto deve permanecer em versões `0.x.y`. A primeira entrega considerada funcional e estável poderá ser marcada como `1.0.0`.

## Equipe

Projeto desenvolvido por um grupo de **5 integrantes**.

Os nomes, papéis formais e responsabilidades individuais devem ser preenchidos após definição interna da equipe.

## Documentos acadêmicos

O relatório final e a apresentação em formato de pitch não fazem parte desta pasta porque serão produzidos a partir dos modelos fornecidos pelo professor. Os documentos deste repositório devem servir como fonte técnica e histórica para ambos.
