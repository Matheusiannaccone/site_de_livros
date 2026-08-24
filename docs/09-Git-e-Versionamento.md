# 09 — Git e Versionamento

## 1. Objetivo

Definir um fluxo simples e seguro de Git/GitHub para a equipe.

## 2. Branch principal

```text
main
```

A `main` representa o estado integrado e potencialmente apresentável.

Nenhum integrante deve desenvolver diretamente nela.

## 3. Branches de trabalho

Padrões:

```text
feature/<descricao>
fix/<descricao>
docs/<descricao>
refactor/<descricao>
```

Branches devem ser curtas e focadas em uma tarefa ou mudança.

## 4. Fluxo de trabalho

```text
atualizar main
  ↓
criar branch
  ↓
desenvolver
  ↓
commits
  ↓
push
  ↓
Pull Request
  ↓
revisão por outro integrante
  ↓
ajustes/conflitos
  ↓
aprovação
  ↓
merge em main
  ↓
excluir branch quando apropriado
```

## 5. Commits

Convenção baseada em Conventional Commits:

```text
feat: nova funcionalidade
fix: correção
docs: documentação
style: alteração visual/formatação sem mudança lógica relevante
refactor: reorganização interna
test: testes
chore: manutenção/configuração
```

Boas práticas:

- mensagens claras;
- commits focados;
- não versionar credenciais;
- revisar `git status`;
- não misturar mudanças independentes.

## 6. Pull Requests

Todo merge em `main` deve passar por PR.

O PR deve informar:

- o que mudou;
- por que;
- como testar;
- screenshots quando visual;
- riscos ou pendências.

### 6.1 Revisão obrigatória

Todo PR deve receber pelo menos **1 revisão de integrante diferente do autor**.

Mudanças sensíveis, como banco, Auth, RLS, segurança, arquitetura ou exclusão de conta, podem receber segunda revisão.

### 6.2 Responsabilidade do revisor

Verificar:

- aderência ao escopo;
- lógica principal;
- risco de regressão;
- convenções;
- documentação afetada;
- testes adequados.

O revisor pode aprovar, solicitar alterações ou comentar.

## 7. Conflitos

O autor do PR é o responsável principal por resolver conflitos da própria branch.

Ao resolver:

1. entender as duas alterações;
2. atualizar a branch quando necessário;
3. conversar com o outro autor se houver dúvida;
4. preservar o comportamento correto;
5. testar novamente;
6. solicitar nova revisão se a resolução for relevante.

Conflitos não devem ser resolvidos diretamente na `main`.

## 8. Semantic Versioning

Formato:

```text
MAJOR.MINOR.PATCH
```

- **MAJOR:** mudança incompatível relevante;
- **MINOR:** nova funcionalidade compatível;
- **PATCH:** correção compatível.

Durante desenvolvimento:

```text
0.x.y
```

Primeira versão estável do MVP:

```text
1.0.0
```

## 9. Tags e releases

Para versões apresentáveis:

```bash
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0
```

Criar GitHub Release quando apropriado.

## 10. Proteções recomendadas

Quando disponíveis:

- bloquear push direto na `main`;
- exigir PR;
- exigir aprovação;
- impedir autoaprovação;
- exigir branch atualizada quando fizer sentido.

Evitar burocracia que a equipe não consiga manter.

## 11. Responsabilidade da equipe

Todos devem compreender:

- branch;
- commit;
- push;
- atualização da branch;
- PR;
- revisão;
- conflitos simples;
- versão atual.

Mudanças sensíveis devem ser revisadas, quando possível, por alguém familiarizado com a área.
