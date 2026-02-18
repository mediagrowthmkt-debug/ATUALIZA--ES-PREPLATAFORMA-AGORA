# 🔧 CORREÇÃO: CAC de Tráfego Pago (Não Global)

**Data:** 29 de dezembro de 2025  
**Status:** ✅ CORRIGIDO

---

## 🔴 PROBLEMA IDENTIFICADO

O prompt da análise **"📊 Direcionamento Estratégico e Metas"** estava calculando o **CAC de forma global**, dividindo o investimento em tráfego pago por **TODAS as vendas** (incluindo orgânicas, indicações, SEO, GMB, etc.).

### ❌ Cálculo ERRADO (antes):
```
Investimento: R$ 2.600 (ads + agência)
Vendas Totais: 22 (4 do tráfego pago + 18 orgânicas)
CAC = R$ 2.600 ÷ 22 = R$ 118,18

❌ ERRO: Incluiu 18 vendas que NÃO custaram dinheiro!
❌ CAC ficava artificialmente BAIXO e IRREALISTA
```

### ✅ Cálculo CORRETO (agora):
```
Investimento: R$ 2.600 (ads + agência)
Vendas do Tráfego Pago: 4 (APENAS vendas que vieram dos anúncios)
CAC = R$ 2.600 ÷ 4 = R$ 650,00

✅ CORRETO: Isola vendas que vieram DOS ANÚNCIOS
✅ CAC realista mostra o custo REAL do canal pago
```

---

## 🎯 O QUE FOI CORRIGIDO

### 1. **Fórmula do CAC Tráfego Pago**

**Antes (ERRADO):**
```
CAC = Investimento ÷ Vendas TOTAIS
```

**Agora (CORRETO):**
```
CAC Tráfego Pago = (Investimento em Ads + Custo da Agência) ÷ Vendas do Tráfego Pago
```

### 2. **Composição do Investimento**

✅ **SEMPRE incluir:**
- Investimento em mídia (Google Ads, Meta Ads, TikTok Ads, etc.)
- Custo da agência responsável pelo tráfego pago

❌ **NUNCA incluir:**
- Vendas orgânicas (SEO, GMB, redes sociais)
- Vendas de indicações
- Vendas de Booking/diretas
- Vendas recorrentes
- Qualquer venda que NÃO veio dos anúncios pagos

### 3. **Separação de Métricas**

O prompt agora calcula **DUAS métricas distintas**:

| Métrica | O que mede | Como calcular |
|---------|-----------|---------------|
| **Vendas Tráf. Pago** | Vendas APENAS dos anúncios | Leads Pagos × Taxa Conv Pagos |
| **Vendas Totais** | Vendas de TODAS as origens | (Leads Pagos × Conv Pagos) + (Leads Org × Conv Org) |

---

## 📊 EXEMPLO COMPARATIVO

### Cenário: Ticket R$ 180, Investimento R$ 2.600/mês

**Estrutura:**
- Leads Orgânicos: 150 (SEO, GMB, indicações)
- Leads Pagos: 50 (Google Ads, Meta Ads)
- Conv. Pagos: 8% → 4 vendas
- Conv. Orgânicos: 12% → 18 vendas
- **Vendas Totais: 22**

### ❌ ANTES (Cálculo Global - ERRADO):
```
CAC = R$ 2.600 ÷ 22 vendas = R$ 118,18
```

**Por que estava errado?**
- Incluiu 18 vendas orgânicas que NÃO custaram R$ 2.600
- CAC parecia saudável (65% do ticket)
- Mascarava o prejuízo real no tráfego pago

### ✅ AGORA (Cálculo Isolado - CORRETO):
```
CAC Tráfego Pago = R$ 2.600 ÷ 4 vendas = R$ 650,00
```

**Por que está correto?**
- Isola APENAS as 4 vendas que vieram dos anúncios
- CAC realista mostra o custo REAL (361% do ticket)
- Evidencia que o tráfego pago está em prejuízo (precisa otimizar)

---

## 💡 ANÁLISE FINANCEIRA REALISTA

Com o cálculo correto, podemos ver:

### 📉 Resultado do Tráfego Pago:
```
Investimento: R$ 2.600
Faturamento (4 vendas × R$ 180): R$ 720
ROAS: 0,28x
Prejuízo: R$ 1.880/mês
```
❌ Tráfego pago NÃO se paga sozinho (ainda)

### 📈 Resultado do Orgânico:
```
Investimento: R$ 0
Faturamento (18 vendas × R$ 180): R$ 3.240
Lucro puro: R$ 3.240/mês
```
✅ Leads orgânicos compensam o prejuízo do pago

### 💰 Resultado Líquido:
```
Faturamento Total: R$ 3.960 (22 vendas × R$ 180)
Investimento Total: R$ 2.600
Lucro Líquido: R$ 1.360/mês
```
✅ Operação é lucrativa GRAÇAS ao orgânico

---

## 🎯 EXPECTATIVAS REALISTAS DE CAC

O prompt agora orienta a IA com CAC realista por fase:

### Ticket R$ 50-200 (Baixo):
- **Mês 1-3**: CAC R$ 100-150 (200-300% do ticket)
- **Mês 4-6**: CAC R$ 70-100 (140-200% do ticket)
- **Mês 7-9**: CAC R$ 40-70 (80-140% do ticket)
- **Mês 10-12**: CAC R$ 30-50 (60-100% do ticket)

### Ticket R$ 200-1000 (Médio):
- **Mês 1-3**: CAC R$ 300-500 (150-250% do ticket)
- **Mês 4-6**: CAC R$ 200-350 (100-175% do ticket)
- **Mês 7-9**: CAC R$ 150-250 (75-125% do ticket)
- **Mês 10-12**: CAC R$ 100-180 (50-90% do ticket)

### Ticket R$ 1000-5000 (Alto):
- **Mês 1-3**: CAC R$ 1500-2500 (150-250% do ticket)
- **Mês 4-6**: CAC R$ 1000-1800 (100-180% do ticket)
- **Mês 7-9**: CAC R$ 700-1200 (70-120% do ticket)
- **Mês 10-12**: CAC R$ 500-900 (50-90% do ticket)

---

## 🚀 PRÓXIMOS PASSOS

1. **Recarregar o dashboard** (Cmd+Shift+R)
2. **Gerar nova análise** de Direcionamento Estratégico e Metas
3. **Validar os números:**
   - CAC deve ser calculado APENAS com vendas do tráfego pago
   - CAC inicial pode ser alto (200-400% do ticket)
   - ROAS inicial pode ser baixo (0,3-0,8x)
   - Mostrar EVOLUÇÃO ao longo de 12 meses

---

## 📝 REGRAS ATUALIZADAS NO PROMPT

### ✅ O que a IA deve fazer:
1. Separar vendas do tráfego pago de vendas orgânicas
2. Calcular CAC APENAS com vendas que custaram dinheiro
3. Incluir investimento em ads + custo da agência
4. Mostrar progressão realista de CAC ao longo de 12 meses
5. Evidenciar se o tráfego está em prejuízo (normal no início)
6. Mostrar como leads orgânicos podem compensar

### ❌ O que a IA NÃO deve fazer:
1. Dividir investimento por vendas totais (inclui orgânicas)
2. Forçar CAC artificialmente baixo
3. Inventar números irrealistas (CAC R$ 50 com ticket R$ 5000)
4. Esconder prejuízo do tráfego pago
5. Prometer ROAS de 10x no primeiro mês

---

## ✅ VALIDAÇÃO

Para confirmar que está correto, verifique na tabela gerada:

```
| Mês | Inv. | Fat. Tráf. | Fat. Total | Leads Org | Leads Pago | ... | CAC | Vendas |
```

**Teste:**
```
CAC × Vendas do Tráfego Pago = Investimento Total?

Exemplo:
R$ 650 (CAC) × 4 (vendas pago) = R$ 2.600 ✓
```

Se essa conta bater, o CAC está sendo calculado corretamente!

---

**Documentado por:** GitHub Copilot  
**Arquivo modificado:** `index.html` (linhas ~32950-33150)  
**Commit sugerido:** "fix: corrige cálculo de CAC para focar apenas em tráfego pago"
