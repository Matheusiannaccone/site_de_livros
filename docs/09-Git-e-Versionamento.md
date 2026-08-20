# 09 — Git e Versionamento

## 1. Objetivo

Definir um fluxo simples, seguro e adequado para uma equipe de cinco integrantes.

## 2. Branch principal

```text
main
```

A `main` representa o estado integrado e potencialmente apresentável.

Evitar desenvolvimento cotidiano diretamente nela.

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
```

Branches devem ser curtas e focadas.

## 4. Fluxo

```text
main
  ↓
criar branch de trabalho
  ↓
commits na branch de trabalho
  ↓
push
  ↓
Pull Request
  ↓
revisão
  ↓
merge em main
```

## 5. Commits

Convenção recomendada baseada em Conventional Commits:

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
- descrever o que mudou;
- evitar mensagens como `update`, `mudanças`, `teste2`;
- não versionar credenciais;
- revisar `git status` antes de commit;
- evitar misturar funcionalidades independentes no mesmo commit.

## 7. Pull Requests

Um PR deve informar:

- o que foi implementado;
- por que a mudança foi necessária;
- como testar;
- screenshots quando a mudança for visual;
- riscos ou pendências conhecidas.

Sempre que possível, outro integrante deve revisar antes do merge.

## 8. Conflitos

Ao encontrar conflito:

1. identificar quais alterações estão sendo combinadas;
2. não escolher automaticamente uma versão sem entender;
3. conversar com o autor da outra mudança quando necessário;
4. testar após resolver;
5. só então concluir merge/rebase.

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
- exigir revisão conforme disponibilidade da equipe.

Não criar burocracia maior do que o grupo consegue manter.

## 13. Responsabilidade

Uma pessoa pode coordenar integrações, mas todos devem compreender:

- criar branch;
- commit;
- push;
- atualizar branch;
- abrir PR;
- resolver conflitos simples;
- verificar versão atual.
