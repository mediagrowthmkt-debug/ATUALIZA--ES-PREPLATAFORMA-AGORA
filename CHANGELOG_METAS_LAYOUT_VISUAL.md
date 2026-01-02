# Changelog - Ajuste Visual Layout Metas

**Data:** 02/01/2026  
**Tipo:** Melhoria de Interface

## 📋 Resumo
Ajuste visual no layout das células de metas na aba "Metas" para melhorar a visualização dos valores e a usabilidade do botão de aplicação em lote.

## 🎨 Alterações Visuais

### Antes:
- Botão `.meta-bulk-btn` posicionado ao lado direito do input (absolute position)
- Campo de input com padding extra à direita para não sobrepor o botão
- Layout horizontal (flex-row)

### Depois:
- Botão `.meta-bulk-btn` posicionado acima do input
- Campo de input expandido para mostrar números completos
- Layout vertical (flex-column) com espaçamento adequado
- Maior área de visualização dos valores

## 🔧 Detalhes Técnicos

### CSS Modificado:

```css
/* Meta Cell - Container */
.meta-cell {
  position: relative;
  display: flex;
  flex-direction: column;  /* Mudou de row para column */
  align-items: center;
  justify-content: center;
  gap: 4px;                /* Espaçamento entre botão e input */
  padding: 8px 4px;        /* Padding vertical aumentado */
}

/* Meta Cell Input */
.meta-cell input {
  width: 100%;
  min-width: 80px;         /* Largura mínima garantida */
  text-align: center;
  padding: 6px 8px;        /* Padding balanceado */
  font-size: .9rem;        /* Fonte ligeiramente maior */
}

/* Meta Bulk Button */
.meta-bulk-btn {
  background: rgba(255,255,255,.05);
  border: 1px solid var(--shell-border);
  border-radius: 4px;
  color: #f9fafb;
  cursor: pointer;
  font-size: .65rem;
  padding: 2px 6px;
  line-height: 1;
  opacity: .65;
  transition: opacity .2s ease;
  position: relative;      /* Mudou de absolute para relative */
  width: auto;
  align-self: center;      /* Centralizado horizontalmente */
}
```

## ✅ Benefícios

1. **Melhor Visualização**: Campo de input maior permite ver números completos
2. **Organização**: Layout vertical mais organizado e intuitivo
3. **Usabilidade**: Botão de ação em lote mais visível e acessível
4. **Consistência**: Todas as metas (Planejado e Realizado) seguem o mesmo padrão

## 📱 Responsividade

- O layout vertical funciona bem em todas as resoluções
- Em mobile (< 820px), o botão mantém opacity: 1 para melhor visibilidade
- Min-width do input garante legibilidade em telas pequenas

## 🎯 Aplicação

As mudanças aplicam-se a:
- ✅ Todas as linhas "Projetado" de todas as metas
- ✅ Todas as linhas "Realizado" de todas as metas
- ✅ Todos os meses (Jan-Dez)
- ✅ Metas ativas e inativas

## 📂 Arquivos Modificados

- `index.html` (linhas ~7639-7642)
  - Estilos CSS: `.meta-cell`, `.meta-cell input`, `.meta-bulk-btn`
