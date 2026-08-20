# 07 — Design System

## 1. Status

Documento base.  
A identidade visual final ainda deve ser definida pelo grupo.

Este arquivo estabelece padrões funcionais e estruturais para impedir que cada integrante desenvolva interfaces incompatíveis.

## 2. Princípios

1. Mobile first.
2. Legibilidade acima de decoração.
3. Consistência entre páginas.
4. Controles com áreas de toque adequadas.
5. Contraste suficiente.
6. Estados claros de interação.
7. Componentes reutilizáveis.
8. Leitor com baixa distração visual.

## 3. Breakpoints

Valores iniciais:

```css
/* Base: mobile */

/* Tablet */
@media (min-width: 768px) {}

/* Desktop */
@media (min-width: 1024px) {}
```

Breakpoints podem ser ajustados quando o layout real exigir. Não devem ser criados apenas para dispositivos específicos.

## 4. Tokens CSS

Definir tokens no início da implementação:

```css
:root {
  --color-bg: ...;
  --color-surface: ...;
  --color-text: ...;
  --color-text-muted: ...;
  --color-primary: ...;
  --color-danger: ...;
  --color-border: ...;

  --font-body: ...;
  --font-reading: ...;

  --space-1: ...;
  --space-2: ...;
  --space-3: ...;
  --space-4: ...;
  --space-5: ...;

  --radius-sm: ...;
  --radius-md: ...;
  --radius-lg: ...;
}
```

Os valores visuais devem ser aprovados pelo grupo antes de serem tratados como identidade definitiva.

## 5. Tipografia

Devem existir papéis claros:

- título de página;
- título de seção;
- título de livro;
- metadado;
- corpo de interface;
- corpo de leitura;
- legenda;
- mensagem de estado.

O texto de capítulos pode utilizar uma família ou configuração distinta da interface, desde que legível.

## 6. Grid de livros

### Mobile

Preferência inicial:

```text
2 cards por linha quando houver largura suficiente.
```

Em telas muito estreitas, o comportamento deve permanecer legível sem overflow.

### Tablet/Desktop

Aumentar a quantidade de colunas conforme largura disponível, preservando tamanho mínimo dos cards.

## 7. Componentes obrigatórios

### Botões

Variantes previstas:

- primário;
- secundário;
- textual;
- destrutivo;
- estado desabilitado;
- estado carregando.

### Inputs

- label sempre identificável;
- mensagem de erro próxima ao campo;
- foco visível;
- placeholder não substitui label.

### Card de livro

Deve suportar, no mínimo:

- capa;
- título;
- autor;
- gênero ou metadado resumido.

### Navegação

Deve possuir solução específica para mobile, sem depender de hover.

### Feedback

Padrões para:

- sucesso;
- erro;
- aviso;
- carregamento;
- conteúdo vazio.

## 8. Leitor

A página de leitura deve priorizar:

- largura de linha confortável;
- bom espaçamento entre linhas;
- contraste adequado;
- tamanho de fonte legível;
- navegação anterior/próximo;
- ausência de elementos desnecessários durante a leitura.

Recursos futuros:

- tamanho de fonte;
- tema claro/escuro/sépia;
- família tipográfica;
- largura da coluna.

## 9. Acessibilidade mínima

- usar HTML semântico;
- associar labels a inputs;
- fornecer `alt` apropriado em imagens informativas;
- não transmitir informação somente por cor;
- manter foco de teclado visível;
- evitar contraste insuficiente;
- botões devem ser elementos interativos corretos;
- garantir tamanho de toque adequado em mobile;
- respeitar hierarquia de headings.

## 10. Imagens

Capas devem:

- manter proporção consistente nos cards;
- usar `object-fit` apropriado;
- possuir fallback visual se não houver capa;
- evitar carregar arquivos desnecessariamente grandes.

## 11. Responsividade

A ordem de trabalho é:

```text
1. implementar mobile
2. validar mobile
3. expandir para tablet
4. expandir para desktop
```

Não implementar desktop primeiro e tentar corrigir mobile apenas com media query ao final.

## 12. Critério para novos componentes

Antes de criar um componente visual novo:

1. verificar se já existe equivalente;
2. reutilizar tokens;
3. manter estados de foco/erro/desabilitado;
4. documentar padrão se ele for reutilizado em mais de uma área.
