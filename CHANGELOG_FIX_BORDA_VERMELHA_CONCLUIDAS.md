# CHANGELOG: Fix Borda Vermelha em Demandas Concluídas

**Data:** 04/01/2026  
**Autor:** GitHub Copilot  
**Problema:** Demandas marcadas como "Concluído" ainda apareciam com borda vermelha de "atrasada"

---

## 🐛 Problema Identificado

A função `checkIfOverdue()` verificava apenas algumas variações do status de conclusão:
- `'concluida'`
- `'finalizada'`
- `'completa'`

Mas o sistema usa `'Concluído'` com C maiúsculo e acento, que não era reconhecido.

### Sintoma Visual
- Demandas com status "Concluído" apareciam com **borda vermelha brilhante**
- O alerta de "Demandas atrasadas" no topo listava demandas concluídas

---

## ✅ Solução Implementada

### 1. Função `checkIfOverdue()` (linha ~58416)

**ANTES:**
```javascript
if (demanda.status === 'concluida' || demanda.status === 'finalizada' || demanda.status === 'completa') {
  return false;
}
```

**DEPOIS:**
```javascript
// Verificar múltiplas variações do status "concluído"
const status = (demanda.status || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const concluidos = ['concluida', 'finalizada', 'completa', 'concluido', 'done', 'completed', 'finished'];
if (concluidos.some(c => status.includes(c))) {
  return false;
}
```

### 2. Função `updatePrazoAlert()` (linha ~58820)

**ANTES:**
```javascript
const done = d.status === 'concluido' || d.status === 'concluido-grupo';
```

**DEPOIS:**
```javascript
// Verificar múltiplas variações do status "concluído"
const status = (d.status || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const concluidos = ['concluida', 'finalizada', 'completa', 'concluido', 'done', 'completed', 'finished', 'concluido-grupo'];
const done = concluidos.some(c => status.includes(c));
```

---

## 🔍 Lógica da Normalização

```javascript
// 1. Converte para minúsculo
'Concluído' → 'concluído'

// 2. Remove acentos (normalize NFD + regex)
'concluído' → 'concluido'

// 3. Verifica se contém algum termo de conclusão
'concluido'.includes('concluido') → true → NÃO é atrasada
```

---

## ✅ Resultado

| Situação | Antes | Depois |
|----------|-------|--------|
| Demanda "Concluído" + prazo vencido | ❌ Borda vermelha | ✅ Sem borda |
| Demanda "Não iniciado" + prazo vencido | ✅ Borda vermelha | ✅ Borda vermelha |
| Demanda "Em andamento" + prazo vencido | ✅ Borda vermelha | ✅ Borda vermelha |
| Demanda "Finalizada" + prazo vencido | ❌ Borda vermelha | ✅ Sem borda |

---

## 📁 Arquivos Modificados

| Arquivo | Linha | Alteração |
|---------|-------|-----------|
| `index.html` | ~58416 | Melhorada verificação de status em `checkIfOverdue()` |
| `index.html` | ~58820 | Melhorada verificação de status em `updatePrazoAlert()` |

---

## 🧪 Como Testar

1. Abra a aba **Planejamento**
2. Verifique demandas com status **"Concluído"** que têm prazo vencido
3. Essas demandas **NÃO** devem ter borda vermelha
4. Apenas demandas **"Não iniciado"** ou **"Em andamento"** com prazo vencido devem ter borda vermelha
5. O alerta "Demandas atrasadas:" no topo **NÃO** deve listar demandas concluídas
