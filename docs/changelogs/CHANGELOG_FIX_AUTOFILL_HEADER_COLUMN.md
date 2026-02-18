# Update: Auto-Fill usando Header + Column Index

## ✅ Nova Lógica Implementada

O auto-fill agora funciona em **2 passos**:

### **PASSO 1: Identificar a Coluna no Cabeçalho**
1. Lê a primeira linha (cabeçalho) da tabela
2. Procura qual coluna bate com a meta desejada
3. Exemplo: para "Número de leads gerados" → encontra coluna "Leads" no índice 3

### **PASSO 2: Extrair Valores das Linhas de Meses**
1. Percorre as linhas restantes
2. **Ignora** linhas de TOTAL/SOMA/MÉDIA  
3. **Procura apenas** linhas que começam com mês (Jan, Fev, Mar...)
4. Extrai o valor da coluna identificada no Passo 1

## 🔧 Melhorias Aplicadas

### 1. **Filtro de Linhas TOTAL**
```javascript
if(firstCellNormalized.includes('total') || 
   firstCellNormalized.includes('soma') || 
   firstCellNormalized.includes('media')){
  console.log(`⏭️ Ignorando linha de totais: "${firstCellText}"`);
  continue;
}
```

### 2. **Validação de Linhas de Mês**
```javascript
let monthKey = null;
for(const month of META_MONTHS){
  const monthNormalized = normalizeName(month);
  if(firstCellNormalized === monthNormalized){
    monthKey = month;
    break;
  }
}

if(!monthKey){
  console.log(`⏭️ Não é linha de mês: "${firstCellText}"`);
  continue;
}
```

### 3. **Extração por Índice de Coluna**
```javascript
// Antes: Pegava valores sequenciais (células 1, 2, 3...)
// Agora: Pega valor específico da coluna identificada

const valueCell = cells[targetColumnIndex]; // Coluna correta!
const valueCellText = valueCell.textContent.trim();
const cleanValue = valueCellText.replace(/[^\d]/g, '');

if(cleanValue && cleanValue !== '0'){
  monthsValues[monthKey] = parseInt(cleanValue, 10);
  console.log(`✅ ${monthKey}: ${cleanValue}`);
}
```

### 4. **Validação de Exclusões no Header**
```javascript
// Verificar exclusões no cabeçalho também
for(const exclude of matchedAlias.data.excludeIfContains){
  if(headerNormalized.includes(normalizeName(exclude))){
    console.log(`⚠️ Ignorando coluna - contém exclusão: "${exclude}"`);
    hasExclusion = true;
    break;
  }
}
```

## 📊 Exemplo de Funcionamento

### Tabela na Análise:
```
| Mês | Inv. Tráfego | Faturamento | Leads | MQL |
|-----|--------------|-------------|-------|-----|
| Jan | $3,300       | $375,000    | 50    | 12  |
| Fev | $3,300       | $375,000    | 50    | 12  |
| ... |
| TOTAL | $39,600    | $4,500,000  | 752   | 158 |
```

### Processamento:

**Meta: "Número de leads gerados"**

1. **PASSO 1:**
   ```
   📑 Coluna 0: "Mês"
   📑 Coluna 1: "Inv. Tráfego" 
   📑 Coluna 2: "Faturamento"
   📑 Coluna 3: "Leads"          ← ✅ MATCH!
   📑 Coluna 4: "MQL"
   
   ✅ COLUNA ENCONTRADA! Índice: 3
   ```

2. **PASSO 2:**
   ```
   🎯 Extraindo valores da coluna 3...
   
   ⏭️ Pulando cabeçalho
   ✅ jan: 50 (coluna 3: "50")
   ✅ fev: 50 (coluna 3: "50")
   ...
   ⏭️ Ignorando linha de totais: "TOTAL"
   ```

## 🐛 Problema Resolvido

### Antes ❌
```
✅ LINHA ENCONTRADA! Score: 90
   Primeira célula: TOTAL
   📅 jan: 39600      ← ERRADO! (Inv. Tráfego total)
   📅 fev: 4500000    ← ERRADO! (Faturamento total)
   📅 mar: 752        ← ERRADO! (Leads total)
```

### Depois ✅
```
✅ COLUNA ENCONTRADA! Índice: 3 - "Leads"

✅ jan: 50 (coluna 3)
✅ fev: 50 (coluna 3)
✅ mar: 50 (coluna 3)
✅ abr: 55 (coluna 3)
...
⏭️ Ignorando linha de totais: "TOTAL"
```

## 🧪 Logs Detalhados

```
🤖 [autoFillMetaFromAnalysis] Iniciando para: Número de leads gerados
🎯 Alias encontrado: leads
   Keywords: ['leads totais', 'numero de leads', 'leads gerados', ...]
   Column names: ['leads', 'leads totais', 'total leads']

📋 Analisando tabela com 14 linhas

📑 Coluna 0: "Mês"
📑 Coluna 1: "Inv. Tráfego"
📑 Coluna 2: "Faturamento"
📑 Coluna 3: "Leads"
  ✅ COLUNA ENCONTRADA! Índice: 3 - Match: "leads" ≈ "Leads"

🎯 Extraindo valores da coluna 3...
  ⏭️ Pulando cabeçalho
  ✅ jan: 50 (coluna 3: "50")
  ✅ fev: 50 (coluna 3: "50")
  ...
  ⏭️ Ignorando linha de totais: "TOTAL"

📊 Valores extraídos: { jan: 50, fev: 50, mar: 50, ... }
📊 Total de meses preenchidos: 12
```

## 📝 Notas Técnicas

- **Arquivos modificados**: `index.html` linhas ~55300-55450
- **Backward compatible**: Mantém fallback para regex se tabela não funcionar
- **Performance**: Para após encontrar primeira tabela válida
- **Segurança**: Múltiplos filtros evitam dados incorretos
