# Edição em Lote de Leads - Documentação

## 🎯 Funcionalidade Implementada

Sistema completo de seleção múltipla e edição em lote para a aba de Leads, permitindo editar vários leads simultaneamente de forma eficiente.

## ✨ Recursos

### 1. Seleção Múltipla
- ✅ Checkbox em cada linha para seleção individual
- ✅ Checkbox "Selecionar Todos" no cabeçalho da tabela
- ✅ Indicação visual de linhas selecionadas (highlight azul)
- ✅ Contador de leads selecionados

### 2. Barra de Ferramentas em Lote
Aparece automaticamente quando um ou mais leads são selecionados, contendo:
- **Contador**: Mostra quantos leads estão selecionados
- **Editar Selecionados**: Abre modal de edição em lote
- **Remover Selecionados**: Deleta múltiplos leads com confirmação
- **Limpar Seleção**: Desmarca todos os checkboxes

### 3. Modal de Edição em Lote
Interface intuitiva para editar múltiplos leads simultaneamente:
- **Nome**: Campo de texto
- **E-mail**: Campo de e-mail
- **Telefone**: Campo de texto
- **Pergunta**: Área de texto (textarea)
- **Plataforma**: Campo de texto (Google, Meta, etc.)
- **Fonte**: Campo de texto

**Comportamento**:
- Campos vazios não alteram os dados existentes
- Apenas campos preenchidos são aplicados a todos os leads selecionados
- Salvamento assíncrono com feedback visual
- Toast de confirmação após atualização

## 🎨 Interface

### Desktop
```
┌─────────────────────────────────────────────────────────┐
│ [X] selecionado(s)                                      │
│ [✎ Editar] [× Remover] [Limpar Seleção]               │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ [✓] Nome  Email  Telefone  Pergunta  Plataforma...     │
├─────────────────────────────────────────────────────────┤
│ [✓] João  joao@   9999...   Produto  Google    ...     │
│ [ ] Maria maria@ 8888...   Serviço  Meta       ...     │
└─────────────────────────────────────────────────────────┘
```

### Mobile
Layout responsivo com checkbox à esquerda e ações à direita:
```
┌──────────────────────────────────┐
│ 3 selecionado(s)                 │
│ [✎ Editar Selecionados]         │
│ [× Remover Selecionados]        │
│ [Limpar Seleção]                 │
└──────────────────────────────────┘
┌──────────────────────────────────┐
│ [✓] João Silva            [✎][×] │
│     joao@email.com               │
│     (99) 99999-9999              │
│     Google | Site                │
└──────────────────────────────────┘
```

## 🔧 Implementação Técnica

### Estrutura CSS
- `.lead-checkbox`: Estilo dos checkboxes
- `.leads-bulk-toolbar`: Barra de ferramentas (oculta por padrão)
- `.leads-bulk-toolbar.active`: Visível quando há seleção
- `.lead-row.selected`: Highlight visual de linhas selecionadas

### Funções JavaScript

#### `getSelectedLeadIds()`
Retorna array com IDs dos leads selecionados.

#### `updateBulkToolbar()`
Atualiza a interface da barra de ferramentas:
- Contador de selecionados
- Estado do checkbox "selecionar todos"
- Classes visuais nas linhas

#### `clearBulkSelection()`
Limpa todas as seleções e oculta a toolbar.

#### `bulkDeleteLeads()`
Remove múltiplos leads com confirmação.

#### `openBulkEditModal()`
Abre modal de edição em lote com:
- Validação de seleção
- Campos para todos os atributos editáveis
- Salvamento assíncrono
- Feedback de sucesso/erro

#### `updateLead(leadId, patch)`
Atualiza campos específicos de um lead no Firestore (merge).

## 📱 Responsividade

### Desktop (> 900px)
- Grid com 9 colunas: checkbox + 7 campos + ações
- Barra de ferramentas horizontal
- Todos os campos visíveis em uma linha

### Mobile (≤ 900px)
- Grid simplificado: checkbox + conteúdo + ações
- Barra de ferramentas vertical
- Campos empilhados
- Botões em largura total

## 🚀 Como Usar

### Editar Múltiplos Leads
1. Marque os checkboxes dos leads desejados
2. Clique em "✎ Editar Selecionados"
3. Preencha os campos que deseja atualizar
4. Clique em "Salvar Alterações"

### Remover Múltiplos Leads
1. Marque os checkboxes dos leads desejados
2. Clique em "× Remover Selecionados"
3. Confirme a ação

### Selecionar Todos
1. Clique no checkbox do cabeçalho
2. Todos os leads visíveis serão marcados

## 🔒 Segurança

- Validação de sessão (uid + clientKey)
- Confirmação antes de operações destrutivas
- Atualização incremental (merge) para preservar dados
- Timestamps automáticos (updatedAt)
- Tratamento de erros com feedback ao usuário

## 📊 Estado da Aplicação

O sistema mantém sincronização em tempo real com Firestore:
- Checkboxes são persistidos no DOM
- Alterações disparam re-render automático
- Seleções são mantidas até limpeza manual

## 🎯 Casos de Uso

1. **Atualização em massa de plataforma**
   - Selecionar todos os leads de uma campanha
   - Definir plataforma como "Google Ads"

2. **Limpeza de dados**
   - Selecionar leads com informações incompletas
   - Remover em lote

3. **Padronização de fonte**
   - Selecionar leads de um período
   - Atualizar campo "fonte" uniformemente

4. **Correção rápida**
   - Selecionar leads com erro de digitação
   - Corrigir campo específico em todos

## 🐛 Troubleshooting

**Barra de ferramentas não aparece:**
- Verifique se pelo menos um checkbox está marcado
- Confira se `leadsBulkToolbar` existe no DOM

**Modal não abre:**
- Certifique-se de que há leads selecionados
- Verifique o console para erros de JavaScript

**Salvamento não funciona:**
- Verifique autenticação (auth.currentUser)
- Confirme que clientKey está definido
- Preencha pelo menos um campo no modal

## 📝 Notas de Desenvolvimento

- Código segue padrão do projeto existente
- Usa Firebase SDK (Firestore)
- Compatible com sistema de permissões atual
- Mantém histórico de alterações (updatedAt)
- Toast notifications via `mgToast()`

## 🔄 Próximas Melhorias Sugeridas

- [ ] Filtrar antes de selecionar (ex: selecionar todos do Google)
- [ ] Exportar seleção para CSV
- [ ] Histórico de edições em lote
- [ ] Desfazer edição em lote
- [ ] Preview antes de salvar
- [ ] Edição inline com seleção múltipla
- [ ] Drag & drop para reordenar
- [ ] Tags/labels para organização

---

**Versão:** 1.0  
**Data:** 01/12/2025  
**Autor:** Bruno (via GitHub Copilot)
