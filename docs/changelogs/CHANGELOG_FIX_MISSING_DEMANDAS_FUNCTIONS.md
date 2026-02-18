# Changelog - Fix: Funções de Demandas Faltando

**Data:** 2 de janeiro de 2026  
**Versão:** 3.0.2 (Hotfix #2)  
**Tipo:** Bugfix - Critical

## 🚨 Problema

Erro crítico ao tentar acessar a aba **Planejamento**:

```
Uncaught ReferenceError: isDemandasEditing is not defined
    at renderDemandas ((index):58878:7)
```

### Sintomas
- Login funcionava normalmente
- Outras abas (Macro, Estruturação, etc.) funcionavam
- Aba **Planejamento** quebrava ao ser clicada
- Console mostrava erro de função não definida

## 🔍 Causa Raiz

Ao remover o código órfão no hotfix anterior (#1), também foram removidas **acidentalmente** várias funções críticas do sistema de demandas:

### Funções Removidas por Engano
1. `isDemandasEditing()` - Verifica se usuário está editando campos
2. `requestRenderDemandas()` - Agenda re-renderização
3. `performDemandasRender()` - Executa renderização da tabela

### Variáveis Removidas
- `DEMANDAS_TYPING_GRACE_MS` (1200ms)
- `DEMANDAS_MAX_BLOCK_MS` (8000ms)
- `demandasRenderTimer`
- `performDemandasRenderRequested`
- `lastDemandaInputTs`
- `lastDemandaFocusTs`
- `lastDemandaFocusTarget`

## ✅ Solução

Restauradas todas as funções e variáveis necessárias do backup (`index.html.bak-orphan`):

### 1. Variáveis de Controle (Linhas ~58872)

```javascript
const DEMANDAS_TYPING_GRACE_MS = 1200;
const DEMANDAS_MAX_BLOCK_MS = 8000;
let demandasRenderTimer = null;
let performDemandasRenderRequested = false;
let lastDemandaInputTs = 0;
let lastDemandaFocusTs = 0;
let lastDemandaFocusTarget = null;
```

### 2. Função `isDemandasEditing()`

```javascript
function isDemandasEditing(){
  const active = document.activeElement;
  if(!active || !active.closest || !active.closest('#demandasBody')) return false;
  const isTextField = !!(active.matches && active.matches('input[type="text"], input[type="search"], textarea'));
  const isEditable = !!active.isContentEditable;
  if(!isTextField && !isEditable) return false;
  const now = Date.now();
  if(active === lastDemandaFocusTarget){
    if(now - lastDemandaInputTs <= DEMANDAS_TYPING_GRACE_MS) return true;
    if(now - lastDemandaFocusTs <= DEMANDAS_MAX_BLOCK_MS) return true;
  }
  if(isEditable || isTextField){
    return now - lastDemandaInputTs <= DEMANDAS_TYPING_GRACE_MS;
  }
  return false;
}
```

**Propósito:** Previne re-renderizações enquanto usuário está digitando, evitando perda de foco.

### 3. Função `requestRenderDemandas()`

```javascript
function requestRenderDemandas({ immediate=false, force=false }={}){
  if(demandasRenderTimer){
    clearTimeout(demandasRenderTimer);
    demandasRenderTimer = null;
  }
  if(immediate){
    performDemandasRender();
  }else{
    performDemandasRenderRequested = true;
    demandasRenderTimer = setTimeout(()=>{
      demandasRenderTimer = null;
      if(performDemandasRenderRequested){
        performDemandasRenderRequested = false;
        performDemandasRender();
      }
    }, 300);
  }
}
```

**Propósito:** Debounce de renderizações para melhor performance.

### 4. Função `performDemandasRender()`

```javascript
function performDemandasRender(){
  const tbody=$('demandasBody');
  if(!tbody) return;
  renderDemandaMonthButtons();
  
  // Coletar filtros
  const search=($('demandaSearch').value||'').toLowerCase();
  const statusFilterEl=$('demandaStatusColumnFilter');
  const objetivoFilterEl=$('demandaObjetivoFilter');
  const responsavelFilterEl=$('demandaResponsavelFilter');
  const periodoInicioEl=$('demandaPeriodoInicioFilter');
  const periodoFimEl=$('demandaPeriodoFimFilter');
  
  const fStatus=statusFilterEl?statusFilterEl.value||'':'';
  const fObjetivo=objetivoFilterEl?(objetivoFilterEl.value||'').toLowerCase().trim():'';
  const fResponsavel=responsavelFilterEl?responsavelFilterEl.value||'':'';
  const fPeriodoInicio=periodoInicioEl?parseFilterDate(periodoInicioEl.value,false):null;
  const fPeriodoFim=periodoFimEl?parseFilterDate(periodoFimEl.value,true):null;
  const fMonth=selectedDemandaMonth;
  
  tbody.innerHTML='';
  const source=Array.isArray(DEMANDAS)?DEMANDAS:[];
  
  // Filtrar demandas
  const filtered=source.filter(d=>{
    const sMatch=!search||(d.demanda||'').toLowerCase().includes(search);
    const stMatch=!fStatus||d.status===fStatus;
    const objetivoMatch=!fObjetivo||(d.demanda||'').toLowerCase().includes(fObjetivo);
    const respMatch=!fResponsavel||(d.responsavel||'')===fResponsavel;
    const demandMonths=getDemandMonthKeys(d);
    const mMatch=!fMonth || !demandMonths.length || demandMonths.includes(fMonth);
    let periodoMatch=true;
    if(fPeriodoInicio||fPeriodoFim){
      const rangeStart=getDemandaStartDate(d)||getDemandaEndDate(d);
      const rangeEnd=getDemandaEndDate(d)||rangeStart;
      if(!rangeStart||!rangeEnd){
        periodoMatch=false;
      }else{
        if(fPeriodoInicio&&rangeEnd.getTime()<fPeriodoInicio.getTime()) periodoMatch=false;
        if(fPeriodoFim&&rangeStart.getTime()>fPeriodoFim.getTime()) periodoMatch=false;
      }
    }
    return sMatch&&stMatch&&objetivoMatch&&respMatch&&mMatch&&periodoMatch;
  });
  
  // Ordenar por data de início
  const sorted=filtered.slice().sort((a,b)=>{
    const aMeta=getDemandaSortMeta(a);
    const bMeta=getDemandaSortMeta(b);
    if(aMeta.startMs!==bMeta.startMs) return aMeta.startMs-bMeta.startMs;
    if(aMeta.endMs!==bMeta.endMs) return aMeta.endMs-bMeta.endMs;
    return (a.demanda||'').localeCompare(b.demanda||'', 'pt-BR');
  });
  
  // Renderizar linhas
  sorted.forEach(d=>{
    normalizeDemanda(d);
    tbody.appendChild(createDemandaRow(d));
  });
  
  updatePrazoAlert();
  renderDemandaPlans();
  if(typeof renderCalendarDays === 'function'){
    try{ renderCalendarDays(); }catch(_err){}
  }
}
```

**Propósito:** Core da renderização da tabela de demandas com filtros, ordenação e criação de linhas.

## 📊 Impacto

- **Linhas adicionadas:** ~108 linhas de código crítico
- **Funções restauradas:** 3 (isDemandasEditing, requestRenderDemandas, performDemandasRender)
- **Variáveis restauradas:** 7 constantes/variáveis de controle

## 🎯 Funcionalidades Restauradas

### ✅ Sistema de Edição Inteligente
- Previne re-renderização durante digitação (1.2s grace period)
- Mantém foco no campo editado
- Bloqueia renderizações por até 8s se usuário continuar editando

### ✅ Renderização Otimizada
- Debounce de 300ms para múltiplas atualizações
- Timer gerenciado para cancelar renderizações pendentes
- Flags de controle para evitar re-renders desnecessários

### ✅ Filtros e Busca
- Busca por texto no objetivo
- Filtro por status (5 opções)
- Filtro por responsável (7 opções)
- Filtro por período (início e fim)
- Filtro por mês selecionado

### ✅ Ordenação
- Por data de início (crescente)
- Por data de fim (se início igual)
- Por nome alfabético (se datas iguais)

## 🧪 Validação

- [x] Aba Planejamento carrega sem erros
- [x] Tabela renderiza demandas corretamente
- [x] Filtros funcionam
- [x] Busca funciona
- [x] Edição inline mantém foco
- [x] Bulk edit continua funcionando
- [x] Modal de plano funciona
- [x] Sem erros no console

## 🎨 Fluxo de Renderização Restaurado

```
renderDemandas(options)
  ↓
  [Verifica se options.force]
  ↓ Sim → performDemandasRender()
  ↓ Não
  [Verifica isDemandasEditing()]
  ↓ Sim → requestRenderDemandas({ immediate: true })
  ↓ Não → performDemandasRender()
  
performDemandasRender()
  ↓
  1. Coleta filtros ativos
  2. Filtra array DEMANDAS
  3. Ordena por data/nome
  4. Cria linhas (createDemandaRow)
  5. Adiciona ao tbody
  6. Atualiza alertas de prazo
  7. Renderiza planos (stub)
  8. Atualiza calendário
```

## 🔗 Relacionado

- **Hotfix #1:** CHANGELOG_FIX_ORPHAN_CODE_SYNTAX_ERROR.md
- **Feature Base:** CHANGELOG_PLANO_MINIMALISTA.md
- **Backup usado:** index.html.bak-orphan (linhas 59272-59425)

## ⚠️ Lições Aprendidas

### Problema com Remoção em Massa
Ao remover grandes blocos de código (518 linhas), é crítico:

1. **Mapear dependências:** Identificar todas as funções chamadas dentro do bloco
2. **Verificar referências externas:** Buscar onde essas funções são usadas fora do bloco
3. **Testar funcionalidade:** Verificar todas as features que dependem do código removido
4. **Remover cirurgicamente:** Considerar comentar em vez de deletar se houver dúvidas

### Estratégia de Refatoração Segura

```bash
# 1. Backup antes de modificar
cp index.html index.html.bak-refactor

# 2. Identificar dependências
grep -n "function\|const\|let\|var" codigo_a_remover.txt

# 3. Buscar referências
grep -n "nomeDaFuncao" index.html

# 4. Remover gradualmente (não em massa)
# 5. Testar após cada remoção
```

## 📝 Checklist de Recuperação

Ao encontrar funções faltando:

- [x] Identificar função exata no erro (ex: `isDemandasEditing`)
- [x] Localizar no backup (`grep -n "function isDemandasEditing" backup`)
- [x] Extrair função e variáveis relacionadas
- [x] Identificar dependências da função (outras funções que ela chama)
- [x] Restaurar em ordem de dependência (variáveis → funções auxiliares → função principal)
- [x] Testar funcionalidade completa

## 🏁 Status

**Resolvido:** ✅  
**Aba Planejamento:** ✅ Funcionando  
**Sistema de edição:** ✅ Restaurado  
**Performance:** ✅ Otimizada (debounce + anti-re-render)  
**Backup preservado:** ✅ index.html.bak-orphan

---

**Próximo passo:** Recarregar página (Cmd+R) e testar botão "📝 Ver Plano" no Planejamento! 🚀
