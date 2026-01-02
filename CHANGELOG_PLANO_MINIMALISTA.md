# Changelog - Plano Minimalista por Demanda

**Data:** 2 de janeiro de 2026  
**Versão:** 3.0  
**Tipo:** Feature - UX Improvement

## 📋 Resumo

Refatoração completa do sistema de planos de demandas para uma abordagem minimalista. Removida a seção volumosa `.demanda-plans` que mostrava todos os planos abaixo da tabela, substituída por botões inline "📝 Ver Plano" que abrem modais sob demanda.

## 🎯 Motivação

A seção de planos anterior ocupava muito espaço vertical e mostrava todos os planos simultaneamente, mesmo quando o usuário não precisava visualizá-los. A nova abordagem:

- ✅ **Economia de espaço:** Apenas o necessário é mostrado
- ✅ **Performance:** Não renderiza HTML complexo para todos os planos
- ✅ **Foco:** Modal isolado reduz distrações
- ✅ **Consistência:** Segue o padrão dos modais de edição em massa

## ✨ Implementação

### 1. Nova Coluna na Tabela

Adicionada coluna **PLANO** entre **PERÍODO** e botão de exclusão:

```html
<th class="col-plano">PLANO</th>
```

### 2. Botão por Demanda

Cada linha da tabela agora possui um botão:

```html
<td class="col-plano">
  <button class="plan-btn${d.plano?' has-plan':''}" data-id="${d.id}">
    📝 Ver Plano
  </button>
</td>
```

**Estados visuais:**
- `.plan-btn` (padrão): Background cinza escuro (#1e293b)
- `.plan-btn.has-plan`: Background azul (#1e3a5f) com borda azul clara (#3b82f6)

### 3. Modal de Plano

Estrutura consistente com modais de edição em massa:

```html
<div id="demandaPlanModal">
  <div class="demanda-plan-modal-content">
    <div class="demanda-plan-modal-header">
      <h3>📝 Plano da Demanda</h3>
      <button id="btnCloseDemandaPlan">✕</button>
    </div>
    <div class="demanda-plan-modal-body">
      <input id="demandaPlanTitle" readonly> <!-- Objetivo (readonly) -->
      <textarea id="demandaPlanText" rows="12"></textarea> <!-- Plano editável -->
    </div>
    <div class="demanda-plan-modal-footer">
      <button id="btnCancelDemandaPlan">Cancelar</button>
      <button id="btnSaveDemandaPlan">Salvar Plano</button>
    </div>
  </div>
</div>
```

**Características:**
- **Header:** Título + botão fechar (×)
- **Body:** Input readonly (objetivo) + textarea 12 linhas (plano)
- **Footer:** Botões Cancelar e Salvar
- **Width:** 700px (maior que modais de edição em massa: 500px)
- **Textarea:** Min-height 200px, resize vertical

### 4. JavaScript

#### Handlers do Modal

```javascript
function openDemandaPlanModal(demanda){
  currentPlanDemanda = demanda;
  demandaPlanTitleEl.value = demanda.demanda || '';
  demandaPlanTextEl.value = demanda.plano || '';
  demandaPlanModalEl.classList.add('active');
  demandaPlanTextEl.focus();
}

function closeDemandaPlanModal(){
  demandaPlanModalEl.classList.remove('active');
  currentPlanDemanda = null;
}
```

#### Evento no Botão da Linha

```javascript
planBtn.onclick = () => { openDemandaPlanModal(d); };
```

#### Salvar Plano

```javascript
btnSaveDemandaPlanEl.addEventListener('click', () => {
  const planoTexto = demandaPlanTextEl.value.trim();
  currentPlanDemanda.plano = planoTexto;
  scheduleDemandasPersist({ immediate: true });
  renderDemandas({ force: true });
  
  const msg = planoTexto ? 'Plano salvo com sucesso!' : 'Plano removido com sucesso!';
  showToast(msg, 'success');
  closeDemandaPlanModal();
});
```

### 5. Modelo de Dados

Adicionado campo `plano` ao objeto demanda:

```javascript
function createDemanda(){
  return normalizeDemanda({
    id: uuid(),
    status: '',
    tag: '',
    demanda: '',
    responsavel: '',
    prazo: '',
    plano: '', // ← NOVO CAMPO
    edited: now,
    created: now
  });
}

function normalizeDemanda(d){
  // ...
  if(typeof d.plano !== 'string'){
    d.plano = '';
  }
  return d;
}
```

### 6. CSS

```css
.col-plano {
  width: 80px;
  text-align: center;
}

.col-plano button {
  background: #1e293b;
  border: 1px solid #334155;
  color: #f8fafc;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.col-plano button:hover {
  background: #334155;
  border-color: #475569;
}

.col-plano button.has-plan {
  background: #1e3a5f;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3);
}

.col-plano button.has-plan:hover {
  background: #2563eb;
  border-color: #60a5fa;
}

#demandaPlanModal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 10000;
  align-items: center;
  justify-content: center;
}

#demandaPlanModal.active {
  display: flex;
}

.demanda-plan-modal-content {
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 12px;
  max-width: 700px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}
```

## 🗑️ Código Removido

### HTML

```html
<!-- REMOVIDO: Seção volumosa de planos -->
<div class="demanda-plans" id="demandaPlans"></div>
```

Esta seção renderizava todos os planos em cards abaixo da tabela, ocupando muito espaço e tornando a interface pesada.

## 📊 Benefícios

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Espaço vertical** | ~200-500px por plano visível | 0px (modal sob demanda) |
| **Tempo de renderização** | Todos os planos renderizados | Apenas quando solicitado |
| **Clareza visual** | Cards volumosos sempre visíveis | Tabela limpa, modal focado |
| **Consistência UX** | Padrão diferente dos outros modais | Padrão unificado com bulk edit |
| **Performance** | DOM pesado com muitos elementos | DOM leve, renderização lazy |

## 🎨 Estados Visuais

### Botão sem Plano
- Background: `#1e293b` (cinza escuro)
- Borda: `#334155`
- Hover: `#334155` / borda `#475569`

### Botão com Plano (`.has-plan`)
- Background: `#1e3a5f` (azul escuro)
- Borda: `#3b82f6` (azul claro)
- Box-shadow: `0 0 0 1px rgba(59, 130, 246, 0.3)` (brilho azul)
- Hover: `#2563eb` / borda `#60a5fa`

### Modal
- Backdrop: `rgba(0, 0, 0, 0.8)`
- Content: `#0f172a` (fundo escuro)
- Borda: `#334155`
- Border-radius: `12px`
- Shadow: `0 20px 60px rgba(0, 0, 0, 0.5)`

## 🔄 Fluxo de Uso

1. **Visualizar plano existente:**
   - Identificar botão azul (`.has-plan`)
   - Clicar "📝 Ver Plano"
   - Modal abre com objetivo (readonly) e plano editável
   - Editar texto se necessário
   - Clicar "Salvar Plano"
   - Toast de sucesso: "Plano salvo com sucesso!"

2. **Criar novo plano:**
   - Clicar "📝 Ver Plano" (botão cinza)
   - Modal abre com textarea vazio
   - Digitar plano
   - Clicar "Salvar Plano"
   - Botão muda para azul (`.has-plan`)
   - Toast: "Plano salvo com sucesso!"

3. **Remover plano:**
   - Abrir modal
   - Limpar todo o texto do textarea
   - Clicar "Salvar Plano"
   - Botão volta para cinza
   - Toast: "Plano removido com sucesso!"

4. **Cancelar edição:**
   - Abrir modal
   - Fazer alterações
   - Clicar "Cancelar", "×" ou fora do modal
   - Alterações descartadas
   - Modal fecha sem salvar

## 🧪 Compatibilidade

- ✅ **Firebase:** Campo `plano` persiste junto com demais campos
- ✅ **Bulk Edit:** Sistema de seleção não afetado (coluna separada)
- ✅ **Filters:** Filtros não aplicam à coluna plano (intencional)
- ✅ **Responsivo:** Modal adapta-se a telas pequenas (90% width)
- ✅ **Normalization:** `normalizeDemanda()` garante campo `plano` sempre string

## 📝 Notas Técnicas

### Estrutura da Tabela (7 colunas)

1. **Checkbox** (`.col-checkbox`) - 40px - Seleção para bulk edit
2. **Status** (`.col-status`) - Select dropdown
3. **Objetivo** (`.col-demanda`) - Input text
4. **Responsável** (`.col-resp`) - Select dropdown
5. **Período** (`.col-prazo`) - Datetime inputs com toggle de intervalo
6. **Plano** (`.col-plano`) - 80px - **NOVO** botão modal
7. **Delete** (`.del-cell`) - 40px - Botão remover

### Variável de Estado

```javascript
let currentPlanDemanda = null; // Guarda demanda sendo editada no modal
```

Resetada para `null` ao fechar o modal.

### Event Listeners

- **planBtn.onclick:** Dispara `openDemandaPlanModal(d)`
- **btnCloseDemandaPlan:** Fecha modal
- **btnCancelDemandaPlan:** Fecha modal sem salvar
- **btnSaveDemandaPlan:** Salva `plano`, persiste Firebase, re-renderiza, fecha
- **modal backdrop click:** Fecha modal

### Focus Management

Ao abrir modal, foco automático no textarea:
```javascript
if(demandaPlanTextEl) demandaPlanTextEl.focus();
```

## 🎯 Próximos Passos (Opcional)

- [ ] Adicionar preview markdown no modal (se planos usarem markdown)
- [ ] Atalho de teclado Ctrl+Enter para salvar
- [ ] Contador de caracteres no textarea
- [ ] Histórico de versões do plano (undo/redo)
- [ ] Exportar planos para PDF/Word

## 🏁 Conclusão

Sistema de planos refatorado com sucesso para abordagem minimalista. Interface mais limpa, performance melhorada, UX consistente com demais modais da plataforma. Economia de espaço vertical significativa permite visualizar mais demandas simultaneamente na tabela.

**Impacto:** 🟢 Positivo - UI/UX melhorada, menos clutter visual, padrão unificado.
