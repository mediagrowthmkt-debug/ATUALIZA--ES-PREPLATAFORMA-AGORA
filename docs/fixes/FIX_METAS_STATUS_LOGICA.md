# Correção da Lógica de Status das Metas

## Data da Implementação
3 de novembro de 2025

## Problema Identificado

A lógica de avaliação do status das metas não estava seguindo corretamente as regras de negócio solicitadas, especialmente no que diz respeito à direção da meta (aumentar/diminuir) e aos casos onde não há dados no mês.

## Nova Lógica Implementada

### Regras de Avaliação:

#### 1. **Meta com direção "AUMENTAR" (padrão)**
   - ✅ **ATINGIDA**: Quando o valor realizado >= valor planejado
   - 🔄 **EM ANDAMENTO**: Quando o valor realizado < valor planejado
   - 📋 **PRECISA COLOCAR**: Quando não há meta planejada OU não há dados no mês

#### 2. **Meta com direção "DIMINUIR"**
   - ✅ **ATINGIDA**: Quando o valor realizado <= valor planejado (passou da meta = conseguiu diminuir)
   - 🔄 **EM ANDAMENTO**: Quando o valor realizado > valor planejado (não conseguiu diminuir o suficiente)
   - 📋 **PRECISA COLOCAR**: Quando não há meta planejada OU não há dados no mês

#### 3. **Meta com direção "MANTER"**
   - ✅ **ATINGIDA**: Quando o valor realizado está dentro de uma tolerância de ±5% do planejado
   - 🔄 **EM ANDAMENTO**: Quando o valor realizado está fora da tolerância
   - 📋 **PRECISA COLOCAR**: Quando não há meta planejada OU não há dados no mês

## Código Atualizado

### Função `evaluateMetaGoal` (index.html e relatorio.html)

```javascript
function evaluateMetaGoal(planned, realized, direction){
  const p = Math.max(0, normalizeMetaNumber(planned));
  const r = normalizeMetaNumber(realized);
  
  // Se não tem meta planejada ou realizado está vazio/zero, retorna 'missing' (precisa colocar)
  if(p <= 0 || (r === 0 && planned === 0) || (r === 0 && !realized && realized !== 0)) return 'missing';
  
  const dir = (direction || 'aumentar').toLowerCase();
  
  if(dir === 'diminuir'){
    // Para diminuir: se realizado <= planejado = atingida, senão = em andamento
    return r <= p ? 'achieved' : 'in-progress';
  }
  if(dir === 'manter'){
    if(p === 0) return 'in-progress';
    const tolerance = Math.max(Math.abs(p) * 0.05, 0.01);
    return Math.abs(r - p) <= tolerance ? 'achieved' : 'in-progress';
  }
  // Para aumentar: se realizado >= planejado = atingida, senão = em andamento
  return r >= p ? 'achieved' : 'in-progress';
}
```

## Exemplos de Uso

### Exemplo 1: Meta "Aumentar vendas"
- **Direção**: Aumentar
- **Planejado**: 100 vendas
- **Realizado**: 120 vendas
- **Status**: ✅ ATINGIDA (120 >= 100)

### Exemplo 2: Meta "Aumentar vendas" não atingida
- **Direção**: Aumentar
- **Planejado**: 100 vendas
- **Realizado**: 80 vendas
- **Status**: 🔄 EM ANDAMENTO (80 < 100)

### Exemplo 3: Meta "Diminuir custos"
- **Direção**: Diminuir
- **Planejado**: 1000 (meta = reduzir para 1000)
- **Realizado**: 900
- **Status**: ✅ ATINGIDA (900 <= 1000, conseguiu diminuir!)

### Exemplo 4: Meta "Diminuir custos" não atingida
- **Direção**: Diminuir
- **Planejado**: 1000 (meta = reduzir para 1000)
- **Realizado**: 1200
- **Status**: 🔄 EM ANDAMENTO (1200 > 1000, não diminuiu o suficiente)

### Exemplo 5: Meta sem dados
- **Direção**: Aumentar
- **Planejado**: 100
- **Realizado**: 0 (ou vazio)
- **Status**: 📋 PRECISA COLOCAR (não há dados no mês)

### Exemplo 6: Meta sem planejamento
- **Direção**: Aumentar
- **Planejado**: 0 (ou vazio)
- **Realizado**: 50
- **Status**: 📋 PRECISA COLOCAR (não definiu a meta)

## Arquivos Alterados

1. **index.html**
   - Linha ~8882: Função `evaluateMetaGoal()`
   - Seção de Relatórios: renderização das metas com nova lógica

2. **relatorio.html**
   - Linha ~226: Função `evaluateMetaGoal()`
   - Renderização das metas compartilhadas

## Impacto

### ✅ Benefícios:

1. **Precisão**: Status das metas reflete corretamente o desempenho real
2. **Clareza**: Distingue claramente entre "não atingiu" e "não preencheu dados"
3. **Direção**: Respeita se a meta é para aumentar ou diminuir
4. **Relatórios**: Links compartilhados mostram status correto
5. **UX**: Usuário sabe exatamente o que precisa fazer:
   - Verde (atingida) = celebrar 🎉
   - Amarelo (em andamento) = continuar trabalhando 💪
   - Azul (precisa colocar) = preencher dados 📝

### 📊 Onde Aparece:

- Seção "Metas" no painel principal
- Seção "Relatórios" no painel principal
- Página `relatorio.html` (links compartilhados)
- Resumo de macro insights

## Mapeamento de Status

| Código Interno | Label de Exibição | Cor    | Significado                           |
|----------------|-------------------|--------|---------------------------------------|
| `achieved`     | Atingidas         | Verde  | Meta foi alcançada ou superada        |
| `in-progress`  | Em andamento      | Amarelo| Meta definida mas não alcançada ainda |
| `missing`      | Precisa colocar   | Azul   | Sem meta ou sem dados no mês          |

## Testes Recomendados

1. ✅ Criar meta de "aumentar" e testar valores acima/abaixo
2. ✅ Criar meta de "diminuir" e testar valores acima/abaixo
3. ✅ Criar meta de "manter" e testar valores próximos/distantes
4. ✅ Deixar mês sem dados e verificar status "precisa colocar"
5. ✅ Deixar meta sem planejamento e verificar status "precisa colocar"
6. ✅ Gerar link de relatório e verificar se mantém lógica correta

## Observações

- A tolerância para metas de "manter" é de **±5%** do valor planejado
- Valores são normalizados para números (remove símbolos de moeda, etc.)
- A lógica é consistente entre o painel principal e relatórios compartilhados
- Status é recalculado automaticamente ao atualizar valores das metas
