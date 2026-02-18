# 🔍 DEBUG AVANÇADO - Verificação de Métricas no Prompt

## 🎯 Problema Identificado

Você mencionou que:
1. ⚠️ Os dados do modal estão sendo preenchidos rapidamente
2. ⚠️ O relatório está sendo gerado muito rápido
3. ⚠️ Os valores fornecidos não estão refletindo no relatório final

**Possível causa:** O prompt está sendo montado ANTES das métricas serem salvas em `window.metricasPrimeiroMes`.

---

## ✅ Solução Implementada

### 1. **Logs Detalhados dos Dados Salvos**

Adicionado log mostrando o **TEXTO EXATO** que será enviado à IA:

```javascript
console.log(`🔍 TEXTO EXATO QUE SERÁ ENVIADO À IA:`);
console.log(`════════════════════════════════════════`);
console.log(`🗓️ Mês de Referência: ${window.metricasPrimeiroMes.mesReferencia}`);
console.log(`💰 Investimento: ${window.metricasPrimeiroMes.investimento}`);
console.log(`📊 Leads Orgânicos: ${window.metricasPrimeiroMes.leadsOrganicos}`);
console.log(`💸 Leads Pagos: ${window.metricasPrimeiroMes.leadsTrafegoPago}`);
console.log(`📈 Conv. Pago: ${window.metricasPrimeiroMes.convPago}%`);
console.log(`📈 Conv. Org: ${window.metricasPrimeiroMes.convOrg}%`);
console.log(`🎯 Vendas: ${window.metricasPrimeiroMes.vendasEsperadas}`);
console.log(`💵 Faturamento: ${window.metricasPrimeiroMes.faturamentoEsperado}`);
console.log(`════════════════════════════════════════`);
```

**Localização:** linha ~43054

---

### 2. **Verificação do Prompt Final**

Adicionado log que mostra os **primeiros 3000 caracteres** do prompt que será enviado:

```javascript
console.log(`🔍 VERIFICAÇÃO DO PROMPT (primeiros 3000 chars):`);
console.log(`────────────────────────────────────────`);
console.log(promptComInstrucoes.substring(0, 3000));
console.log(`────────────────────────────────────────`);
```

**Localização:** linha ~43191

---

### 3. **Confirmação de Inclusão das Métricas**

Adicionado verificação que confirma se a seção de métricas está presente no prompt:

```javascript
if (promptComInstrucoes.includes('MÉTRICAS DO PRIMEIRO MÊS')) {
  console.log(`✅ CONFIRMADO: Seção "MÉTRICAS DO PRIMEIRO MÊS" está no prompt!`);
  
  // Extrair e mostrar APENAS a seção de métricas
  const inicioMetricas = promptComInstrucoes.indexOf('📊 MÉTRICAS DO PRIMEIRO MÊS');
  const trechoMetricas = promptComInstrucoes.substring(inicioMetricas, inicioMetricas + 800);
  
  console.log(`📊 TRECHO DA SEÇÃO DE MÉTRICAS NO PROMPT:`);
  console.log(trechoMetricas);
} else {
  console.log(`❌ ERRO CRÍTICO: Seção "MÉTRICAS DO PRIMEIRO MÊS" NÃO está no prompt!`);
  console.log(`⚠️ A IA NÃO receberá os valores do primeiro mês!`);
}
```

**Localização:** linha ~43197

---

## 🧪 Como Testar com os Novos Logs

### 1. Abra o Console (F12)

### 2. Clique em "🔄 Ajustar Métricas e Regenerar Análise"

### 3. Preencha os Dados no Modal

Exemplo:
```
💰 Investimento: R$ 700
📊 Leads Orgânicos: 20
💸 Leads Pagos: 80
📈 Conv. Pago: 10%
📈 Conv. Org: 20%
```

### 4. Clique em "Gerar Análise"

### 5. Observe o Console - Você Verá:

```
================================================================================
📊 INICIANDO GERAÇÃO DE ANÁLISE: direcionamento_metas
================================================================================

────────────────────────────────────────────────────────────────────────────────
📊 ANÁLISE: DIRECIONAMENTO ESTRATÉGICO E METAS
────────────────────────────────────────────────────────────────────────────────

✅ CONTEXTOS QUE SERÃO ENVIADOS PARA A IA:

4️⃣ MÉTRICAS DO PRIMEIRO MÊS (do Modal):
   ✅ PRESENTE - Dados coletados:
      📅 Mês: Janeiro/2025
      💰 Investimento: R$ 700
      📊 Leads Orgânicos: 20
      💸 Leads Tráfego Pago: 80
      📈 Conv. Pago: 10%
      📈 Conv. Org: 20%
      🎯 Vendas: 12
      💵 Faturamento: R$ 15.000,00
      🎫 Ticket Médio: R$ 1250

      🔍 TEXTO EXATO QUE SERÁ ENVIADO À IA:  ← NOVO!
      ════════════════════════════════════════
      🗓️ Mês de Referência: Janeiro/2025
      💰 Investimento em Mídia Paga: R$ 700
      📊 Leads Orgânicos Esperados: 20
      💸 Leads Tráfego Pago Esperados: 80
      📈 Taxa de Conversão (Pago): 10%
      📈 Taxa de Conversão (Orgânico): 20%
      🎯 Vendas Esperadas: 12 (8 pago + 4 orgânico)
      💵 Faturamento Esperado: R$ 15.000,00
      ════════════════════════════════════════

────────────────────────────────────────────────────────────────────────────────

================================================================================
🤖 CONFIGURAÇÃO DA IA
================================================================================
📋 Entregável: direcionamento_metas
🎯 Modelo IA: google/gemini-2.5-pro
📊 Max tokens: 12000
🌡️ Temperature: 0.7
✨ Usando Google Gemini 2.5 Pro

🔍 VERIFICAÇÃO DO PROMPT (primeiros 3000 chars):  ← NOVO!
────────────────────────────────────────────────────────────────────────────────
# 🎯 PROMPT ÚNICO — RELATÓRIO DE METAS E PROJEÇÕES (12 MESES | SIMPLES, SEGURO E REALISTA)

Você é um consultor de estratégia, marketing e finanças...

📋 CONTEXTO DO NEGÓCIO:
Nome: Academia XYZ
Nicho: Fitness local
Ticket: R$ 1.250
...

📊 MÉTRICAS DO PRIMEIRO MÊS (FORNECIDAS PELO USUÁRIO - USE ESTAS COMO BASE EXATA):

🗓️ **Mês de Referência:** Janeiro/2025

💰 **Investimento em Mídia Paga:** R$ 700
📊 **Leads Orgânicos Esperados:** 20
💸 **Leads Tráfego Pago Esperados:** 80
📈 **Taxa de Conversão (Pago):** 10%
📈 **Taxa de Conversão (Orgânico):** 20%
🎯 **Vendas Esperadas:** 12 (8 do pago + 4 do orgânico)
💵 **Faturamento Esperado:** R$ 15.000,00
...
────────────────────────────────────────────────────────────────────────────────

✅ CONFIRMADO: Seção "MÉTRICAS DO PRIMEIRO MÊS" está no prompt!  ← NOVO!

📊 TRECHO DA SEÇÃO DE MÉTRICAS NO PROMPT:  ← NOVO!
────────────────────────────────────────────────────────────────────────────────
📊 MÉTRICAS DO PRIMEIRO MÊS (FORNECIDAS PELO USUÁRIO - USE ESTAS COMO BASE EXATA):

🗓️ **Mês de Referência:** Janeiro/2025

💰 **Investimento em Mídia Paga:** R$ 700
📊 **Leads Orgânicos Esperados:** 20
💸 **Leads Tráfego Pago Esperados:** 80
📈 **Taxa de Conversão (Pago):** 10%
📈 **Taxa de Conversão (Orgânico):** 20%
🎯 **Vendas Esperadas:** 12 (8 do pago + 4 do orgânico)
💵 **Faturamento Esperado:** R$ 15.000,00

**🚨 INSTRUÇÃO CRÍTICA PARA O PRIMEIRO MÊS:**

1. Use EXATAMENTE estas métricas para o **Janeiro/2025** (primeiro mês da tabela)
2. NÃO modifique os valores acima - eles foram fornecidos pelo cliente
3. Calcule o CPL baseado em: Investimento ÷ Leads Tráfego Pago = CPL
4. Calcule o CAC baseado em: Investimento ÷ Vendas = CAC
5. Calcule o ROAS baseado em: Faturamento ÷ Investimento = ROAS
────────────────────────────────────────────────────────────────────────────────

================================================================================
```

---

## 🎯 O Que Verificar

### ✅ Cenário CORRETO (métricas estão sendo enviadas):

```
✅ PRESENTE - Dados coletados
🔍 TEXTO EXATO QUE SERÁ ENVIADO À IA: [valores aparecem]
✅ CONFIRMADO: Seção "MÉTRICAS DO PRIMEIRO MÊS" está no prompt!
📊 TRECHO DA SEÇÃO DE MÉTRICAS: [mostra os valores R$ 700, 20, 80, etc.]
```

**Resultado:** ✅ A IA receberá e USARÁ os valores do primeiro mês

---

### ❌ Cenário ERRADO (métricas NÃO estão sendo enviadas):

```
⚠️ NÃO PRESENTE (modal não foi preenchido)
❌ ERRO CRÍTICO: window.metricasPrimeiroMes está undefined!
⚠️ A IA NÃO receberá as métricas do primeiro mês!

OU

❌ ERRO CRÍTICO: Seção "MÉTRICAS DO PRIMEIRO MÊS" NÃO está no prompt!
⚠️ A IA NÃO receberá os valores do primeiro mês!
```

**Resultado:** ❌ A IA não receberá os valores e usará estimativas genéricas

---

## 🔧 O Que Fazer Se Aparecer ERRO

### Cenário 1: `window.metricasPrimeiroMes está undefined`

**Causa:** Modal fechou antes de salvar os dados

**Solução:**
1. Reabra o modal
2. Preencha os dados novamente
3. Clique em "Gerar Análise" e aguarde
4. NÃO feche o navegador durante a geração

---

### Cenário 2: Seção de métricas NÃO está no prompt

**Causa:** Timing issue - prompt foi montado antes dos dados serem salvos

**Solução:**
1. Entre em contato para investigar o código
2. Pode ser necessário adicionar `await` antes de montar o prompt

---

## 📋 Resumo das Mudanças

| Item | Antes | Agora |
|------|-------|-------|
| **Log dos dados salvos** | ✅ Básico | ✅ Detalhado com valores exatos |
| **Verificação do prompt** | ❌ Nenhuma | ✅ Mostra primeiros 3000 chars |
| **Confirmação de inclusão** | ❌ Nenhuma | ✅ Verifica se métricas estão no prompt |
| **Extração da seção** | ❌ Nenhuma | ✅ Mostra trecho específico das métricas |
| **Alertas de erro** | ❌ Nenhum | ✅ Avisa se métricas não forem encontradas |

---

## 🚀 Próximos Passos

1. **Teste agora** com os novos logs
2. **Copie e cole** o console inteiro aqui
3. **Vamos analisar** se as métricas estão sendo enviadas
4. **Se não estiverem**, vamos adicionar `await` para garantir o timing correto

---

**Data:** 30/12/2024  
**Status:** ✅ Logs de Debug Implementados  
**Objetivo:** Descobrir se as métricas estão ou não no prompt enviado à IA
