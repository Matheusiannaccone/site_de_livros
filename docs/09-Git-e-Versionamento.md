# 09 — Git e Versionamento

## 1. Objetivo

Definir um fluxo simples, seguro e adequado para uma equipe de cinco integrantes.

## 2. Branch principal

```text
main
```

A `main` representa o estado integrado e potencialmente apresentável.

Nenhum integrante deve desenvolver diretamente nela.

Toda alteração destinada à `main` deve passar pelo fluxo de branch de trabalho + Pull Request.

## 3. Branches de trabalho

Padrões:

```text
feature/<descricao>
fix/<descricao>
docs/<descricao>
refactor/<descricao>
```

Exemplos:

```text
feature/login
feature/criar-livro
fix/navegacao-capitulos
docs/modelo-dados
refactor/servico-livros
```

Branches devem ser curtas, focadas e representar uma tarefa ou mudança específica.

Evitar misturar funcionalidades ou correções independentes na mesma branch.

## 4. Fluxo de trabalho

```text
main atualizada
  ↓
criar branch de trabalho
  ↓
desenvolver na branch
  ↓
criar commits
  ↓
push da branch
  ↓
abrir Pull Request
  ↓
revisão por outro integrante
  ↓
ajustes, se necessários
  ↓
aprovação
  ↓
merge em main
  ↓
excluir branch de trabalho quando não for mais necessária
```

A `main` não deve ser usada para desenvolvimento cotidiano.

## 5. Commits

A equipe deve utilizar uma convenção baseada em Conventional Commits:

```text
feat: nova funcionalidade
fix: correção
docs: documentação
style: alteração visual/formatação sem mudança lógica relevante
refactor: reorganização interna
test: testes
chore: manutenção/configuração
```

Exemplos:

```text
feat: adicionar cadastro de usuarios
fix: impedir acesso a rascunhos de outros autores
docs: atualizar modelo de dados
refactor: separar servico de livros
```

## 6. Regras para commits

- manter commits pequenos quando possível;
- descrever claramente o que mudou;
- evitar mensagens como `update`, `mudanças`, `teste2`;
- não versionar credenciais;
- revisar `git status` antes de commit;
- evitar misturar funcionalidades independentes no mesmo commit;
- manter o tipo do Conventional Commit coerente com a alteração realizada.

## 7. Pull Requests

Toda alteração destinada à `main` deve ser integrada por Pull Request.

Um PR deve informar:

- o que foi implementado;
- por que a mudança foi necessária;
- como testar;
- screenshots quando a mudança for visual;
- riscos ou pendências conhecidas.

### 7.1 Revisão obrigatória

Todo PR deve ser revisado por pelo menos **1 integrante diferente do autor** antes do merge.

O autor do PR não deve aprovar a própria alteração como revisão final.

Para mudanças consideradas sensíveis, como:

- banco de dados;
- autenticação;
- políticas RLS;
- segurança;
- arquitetura;
- fluxo de exclusão de conta;
- alterações estruturais com alto impacto;

o grupo pode solicitar uma segunda revisão antes do merge.

### 7.2 Responsabilidade do revisor

O revisor deve verificar, dentro do escopo da alteração:

- se a implementação corresponde à tarefa;
- se não há mudança desnecessária fora do escopo;
- se a lógica principal faz sentido;
- se há risco evidente de quebrar funcionalidades existentes;
- se o código segue as convenções do projeto;
- se a documentação relacionada foi atualizada quando necessário;
- se os testes informados pelo autor são suficientes para o tipo de mudança.

O revisor pode:

- aprovar;
- solicitar alterações;
- comentar dúvidas ou sugestões.

O merge só deve ocorrer após a aprovação necessária.

## 8. Conflitos

Quem abriu o Pull Request é o responsável principal por resolver conflitos da própria branch antes do merge.

Ao encontrar conflito:

1. identificar quais alterações estão sendo combinadas;
2. não escolher automaticamente uma versão sem entender o motivo das diferenças;
3. atualizar a branch de trabalho com a versão mais recente da `main` quando necessário;
4. conversar com o autor da outra mudança quando o conflito envolver código ou decisão que não esteja clara;
5. resolver o conflito preservando o comportamento correto das duas alterações sempre que possível;
6. testar novamente a funcionalidade após a resolução;
7. enviar a branch atualizada;
8. solicitar nova revisão quando a resolução alterar parte relevante do PR;
9. só então concluir o merge.

Se o conflito envolver alterações de outro integrante e houver dúvida sobre qual versão deve prevalecer, a resolução deve ser feita em conjunto pelos envolvidos.

Conflitos não devem ser resolvidos diretamente na `main`.

## 9. Semantic Versioning

Formato obrigatório:

```text
MAJOR.MINOR.PATCH
```

### MAJOR

Mudança incompatível relevante.

Exemplo:

```text
1.4.2 → 2.0.0
```

### MINOR

Nova funcionalidade compatível.

```text
1.3.0 → 1.4.0
```

### PATCH

Correção sem nova funcionalidade principal.

```text
1.4.0 → 1.4.1
```

## 10. Desenvolvimento antes da primeira versão estável

O projeto pode usar:

```text
0.1.0
0.2.0
0.3.0
...
```

A versão `1.0.0` representa a primeira versão considerada completa para a entrega definida pelo grupo.

Exemplo de evolução:

```text
0.1.0 — estrutura inicial
0.2.0 — autenticação e perfil
0.3.0 — criação de livros e capítulos
0.4.0 — leitura e descoberta
0.5.0 — biblioteca/favoritos
0.5.1 — correção crítica
1.0.0 — MVP estável para entrega
```

Esses números são orientação, não cronograma obrigatório.

## 11. Tags e releases

Para versões apresentáveis:

```bash
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0
```

Quando apropriado, criar GitHub Release com resumo das alterações.

## 12. Proteções recomendadas

Se o grupo configurar proteção de branch:

- impedir push direto na `main`;
- exigir PR;
- exigir branch atualizada quando fizer sentido;
- exigir pelo menos uma aprovação antes do merge;
- bloquear aprovação do próprio autor quando a configuração disponível permitir.

Não criar burocracia maior do que o grupo consegue manter.

## 13. Responsabilidade

Uma pessoa pode coordenar integrações, mas todos devem compreender:

- criar branch;
- commit;
- push;
- atualizar branch;
- abrir PR;
- revisar PR;
- resolver conflitos simples;
- verificar versão atual.

A responsabilidade de revisão não fica presa a um integrante específico. Qualquer membro que não seja o autor pode revisar, desde que tenha condições de compreender a alteração.

Mudanças sensíveis devem, sempre que possível, ser revisadas por alguém mais familiarizado com a área afetada.

## 14. Resumo operacional

Para qualquer tarefa:

```text
1. atualizar main local
2. criar branch feature/fix/docs/refactor
3. desenvolver somente na branch
4. criar commits seguindo Conventional Commits
5. enviar a branch para o GitHub
6. abrir Pull Request
7. obter pelo menos 1 aprovação de outro integrante
8. resolver conflitos e testar novamente, se houver
9. fazer merge em main
10. atualizar a versão quando a mudança exigir
```

Nenhum integrante pode desenvolver diretamente na `main`.
