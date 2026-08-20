# 08 — Backlog e Roadmap

## 1. Objetivo

Organizar prioridades do produto sem prender o projeto a datas ainda não definidas.

O acompanhamento diário pode ser feito em GitHub Projects. Este documento representa a visão de alto nível.

---

# 2. Fase 0 — Fundação

## Entregáveis

- [ ] confirmar nome do projeto;
- [OK] criar repositório GitHub;
- [ ] definir integrantes e responsabilidades;
- [ ] configurar Vercel;
- [OK] criar Trello;
- [ ] criar projeto Supabase;
- [OK] criar estrutura inicial de diretórios;
- [ ] definir design visual inicial;
- [ ] criar primeira migration/modelo;
- [ ] configurar autenticação básica;
- [OK] criar documentação inicial;
- [ ] definir convenções Git.

**Saída esperada:** ambiente comum em que todos os integrantes consigam desenvolver.

---

# 3. Fase 1 — Conta e perfil

- [ ] cadastro;
- [ ] login;
- [ ] logout;
- [ ] sessão autenticada;
- [ ] criação de profile;
- [ ] visualização de perfil;
- [ ] edição dos campos permitidos;
- [ ] tratamento de erros;
- [ ] políticas RLS relacionadas.

**Marco sugerido de versão:** `0.2.0` quando o conjunto estiver integrado.

---

# 4. Fase 2 — Publicação

- [ ] tabela/CRUD de livros;
- [ ] criar livro;
- [ ] editar livro;
- [ ] excluir livro;
- [ ] rascunho;
- [ ] publicar;
- [ ] upload de capa;
- [ ] gêneros;
- [ ] criar capítulo;
- [ ] editar capítulo;
- [ ] excluir capítulo;
- [ ] ordenar capítulos;
- [ ] publicar capítulo;
- [ ] RLS de autoria.

**Marco sugerido:** `0.3.0`.

---

# 5. Fase 3 — Descoberta e leitura

- [ ] home com livros publicados;
- [ ] card de livro;
- [ ] página de detalhes;
- [ ] lista de capítulos;
- [ ] leitor;
- [ ] anterior/próximo;
- [ ] busca;
- [ ] filtro/navegação por gênero;
- [ ] estados vazios e erros;
- [ ] revisão mobile first.

**Marco sugerido:** `0.4.0`.

---

# 6. Fase 4 — Biblioteca

- [ ] adicionar favorito;
- [ ] remover favorito;
- [ ] página biblioteca;
- [ ] estado visual de favorito;
- [ ] RLS da relação;
- [ ] testes integrados.

**Marco sugerido:** `0.5.0`.

---

# 7. Fase 5 — Estabilização do MVP

- [ ] revisar requisitos;
- [ ] corrigir fluxos quebrados;
- [ ] revisar segurança;
- [ ] revisar RLS;
- [ ] revisar uploads;
- [ ] revisar responsividade;
- [ ] validar navegadores;
- [ ] testar conta A vs conta B;
- [ ] revisar acessibilidade mínima;
- [ ] limpar código;
- [ ] atualizar documentação;
- [ ] preparar dados de demonstração;
- [ ] gerar release candidata.

Quando todos os critérios da entrega estiverem atendidos:

```text
1.0.0
```

---

# 8. Pós-MVP — Prioridade média

Itens candidatos:

- [ ] página pública completa de autor;
- [ ] histórico de leitura;
- [ ] continuar lendo;
- [ ] curtidas ou avaliações;
- [ ] comentários;
- [ ] ranking/popularidade;
- [ ] melhorias de busca;
- [ ] configurações de leitura.

Cada funcionalidade deve entrar como MINOR quando adicionada de forma compatível.

---

# 9. Pós-MVP — Exploração

- [ ] PWA;
- [ ] capítulos offline;
- [ ] recomendações;
- [ ] seguidores;
- [ ] notificações;
- [ ] exportação de conteúdo;
- [ ] analytics do autor;
- [ ] moderação;
- [ ] colaboração entre autores.

Esses itens não devem atrasar a versão `1.0.0`.

---

# 10. Definição de pronto

Uma tarefa só deve ser marcada como concluída quando:

1. código integrado;
2. comportamento validado;
3. sem erro conhecido que impeça o fluxo;
4. responsividade verificada quando aplicável;
5. segurança/RLS revisada quando tocar dados;
6. documentação atualizada quando houver mudança arquitetural;
7. PR revisado quando o fluxo de equipe exigir.

---

# 11. Priorização

Ordem padrão:

```text
1. segurança e integridade
2. fluxo principal
3. requisito obrigatório
4. usabilidade
5. melhoria
6. recurso experimental
```

O grupo deve preferir um MVP completo a uma coleção de funcionalidades parcialmente implementadas.
