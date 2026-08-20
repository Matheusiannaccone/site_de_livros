# 10 — Testes

## 1. Objetivo

Definir uma estratégia prática de validação para reduzir regressões durante o desenvolvimento.

O projeto pode iniciar com testes manuais estruturados e evoluir para automação quando houver benefício claro.

## 2. Tipos de teste

### 2.1 Funcional

Verifica se o requisito funciona.

### 2.2 Autorização

Verifica se usuários não conseguem alterar dados de terceiros.

### 2.3 Responsividade

Verifica comportamento em diferentes larguras.

### 2.4 Integração

Verifica fluxos que atravessam Auth, banco, Storage e frontend.

### 2.5 Regressão

Repete fluxos essenciais antes de releases.

---

# 3. Casos mínimos

## Autenticação

### T-001 — Cadastro válido

**Pré-condição:** e-mail não cadastrado.  
**Ação:** preencher dados válidos e cadastrar.  
**Esperado:** identidade e perfil criados; usuário autenticado ou direcionado conforme fluxo definido.

### T-002 — Cadastro inválido

**Ação:** enviar dados obrigatórios inválidos/vazios.  
**Esperado:** operação não deve produzir perfil inconsistente.

### T-003 — Login válido

**Esperado:** sessão criada e interface autenticada.

### T-004 — Login inválido

**Esperado:** mensagem apropriada sem expor informação sensível desnecessária.

### T-005 — Logout

**Esperado:** sessão encerrada e recursos privados indisponíveis.

---

## Livros

### T-010 — Criar livro

**Usuário:** autenticado.  
**Esperado:** livro criado como propriedade do usuário.

### T-011 — Editar livro próprio

**Esperado:** alteração permitida.

### T-012 — Editar livro alheio

**Cenário:** usuário B tenta atualizar livro do usuário A.  
**Esperado:** banco/RLS nega a operação.

### T-013 — Rascunho não público

**Esperado:** livro em rascunho não aparece para usuário externo.

### T-014 — Publicar livro

**Esperado:** após requisitos mínimos, obra passa a aparecer nas consultas públicas.

### T-015 — Excluir livro próprio

**Esperado:** exclusão respeita comportamento definido para dependências.

---

## Capítulos

### T-020 — Criar capítulo

**Esperado:** capítulo vinculado ao livro correto.

### T-021 — Ordem

**Esperado:** capítulos aparecem pela posição definida.

### T-022 — Rascunho de capítulo

**Esperado:** outro usuário não consegue acessá-lo pelo fluxo público.

### T-023 — Publicação de capítulo

**Esperado:** capítulo publicado passa a ser legível.

### T-024 — Navegação anterior/próximo

**Esperado:** respeita capítulos publicados e ordem correta.

---

## Biblioteca

### T-030 — Favoritar

**Esperado:** relação criada uma vez.

### T-031 — Favoritar repetido

**Esperado:** não cria duplicata.

### T-032 — Remover favorito

**Esperado:** relação removida sem alterar o livro.

---

## Busca e gêneros

### T-040 — Filtrar por gênero

**Esperado:** retorna apenas livros elegíveis associados ao gênero.

### T-041 — Busca sem resultado

**Esperado:** estado vazio claro, sem erro de interface.

---

# 4. Matriz de segurança com dois usuários

Criar pelo menos:

```text
Usuário A
Usuário B
```

Validar:

| Ação | A | B |
|---|---|---|
| Ler livro publicado de A | permitido | permitido |
| Ler rascunho de A | permitido | negado |
| Editar livro de A | permitido | negado |
| Excluir livro de A | permitido | negado |
| Editar capítulo de A | permitido | negado |

Essa matriz deve ser repetida quando políticas RLS mudarem.

---

# 5. Responsividade

Validar ao menos:

- largura mobile pequena;
- mobile comum;
- tablet;
- desktop.

Verificar:

- ausência de scroll horizontal indevido;
- navegação;
- formulários;
- cards;
- modal;
- leitor;
- botões;
- textos longos;
- capas com diferentes proporções.

## 6. Navegadores

Quando próximo da entrega, validar pelo menos:

- Chrome/Chromium;
- Firefox;
- Safari quando houver dispositivo/ambiente disponível.

Registrar limitações reais caso algum navegador não possa ser testado.

## 7. Checklist de regressão para release

Antes de uma versão candidata:

- [ ] cadastro;
- [ ] login;
- [ ] logout;
- [ ] sessão;
- [ ] perfil;
- [ ] criar livro;
- [ ] editar livro;
- [ ] excluir livro;
- [ ] publicar livro;
- [ ] upload de capa;
- [ ] criar capítulo;
- [ ] editar capítulo;
- [ ] publicar capítulo;
- [ ] leitura;
- [ ] anterior/próximo;
- [ ] busca;
- [ ] gênero;
- [ ] biblioteca;
- [ ] usuário A não edita dados de B;
- [ ] mobile;
- [ ] desktop;
- [ ] 404;
- [ ] console sem erros críticos conhecidos;
- [ ] documentação compatível com a release.

## 8. Registro de bugs

Um bug deve conter:

```text
Título
Versão
Ambiente
Pré-condição
Passos para reproduzir
Resultado atual
Resultado esperado
Evidência
Severidade
```

Preferencialmente registrar no GitHub Issues.

## 9. Severidade sugerida

- **Crítica:** perda de dados, falha de segurança, aplicação inutilizável;
- **Alta:** fluxo principal quebrado;
- **Média:** funcionalidade secundária incorreta;
- **Baixa:** problema visual ou inconveniente sem bloquear uso.
