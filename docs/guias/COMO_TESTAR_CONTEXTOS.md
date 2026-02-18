# 🎯 TESTE RÁPIDO - Verificar Contextos da IA

## Como Testar Agora

### 1️⃣ Abra o Console do Navegador
```
Pressione F12 (Windows/Linux) ou Cmd+Option+I (Mac)
Vá para a aba "Console"
```

### 2️⃣ Clique em "📊 Análise" 
No card **"Direcionamento Estratégico e Metas"**

### 3️⃣ O Que Você Verá no Console

```
================================================================================
📊 INICIANDO GERAÇÃO DE ANÁLISE: direcionamento_metas
================================================================================

📏 Tamanho do promptEspecifico: XXXX caracteres

────────────────────────────────────────────────────────────────────────────────
📊 ANÁLISE: DIRECIONAMENTO ESTRATÉGICO E METAS
────────────────────────────────────────────────────────────────────────────────

✅ CONTEXTOS QUE SERÃO ENVIADOS PARA A IA:

1️⃣ PROMPT ESPECÍFICO (Estrutura com 7 seções):
   📏 Tamanho: XXXX caracteres
   📝 Primeiros 200 chars: # 🎯 PROMPT ÚNICO — RELATÓRIO...

2️⃣ CONTEXTO DO NEGÓCIO:
   ✅ Presente (XXX caracteres)
   📝 Resumo: Nome: XXX, Nicho: XXX...
   
   OU
   
   ❌ NÃO PRESENTE

3️⃣ ANOTAÇÕES DAS SEMANAS DE ESTRUTURAÇÃO:
   ✅ Presente (XXX caracteres)
   📝 Total de notas: XX

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
      📝 Observações: "..."
   
   OU
   
   ⚠️ NÃO PRESENTE (modal não foi preenchido)

5️⃣ MÍDIAS TAGUEADAS:
   ✅ X mídias tagueadas
   
   OU
   
   ℹ️ Nenhuma mídia tagueada

6️⃣ INSTRUÇÕES EXTRAS DO USUÁRIO:
   ✅ Presente: "..."
   
   OU
   
   ℹ️ Nenhuma instrução extra

────────────────────────────────────────────────────────────────────────────────
📦 TAMANHO TOTAL DO PROMPT: XXXX caracteres (~XXXX tokens)
────────────────────────────────────────────────────────────────────────────────

================================================================================
🤖 CONFIGURAÇÃO DA IA
================================================================================
📋 Entregável: direcionamento_metas
🎯 Modelo IA: anthropic/claude-opus-4.5
📊 Max tokens: 12000
🌡️ Temperature: 0.7
✨ Usando Claude Opus 4.5 (modelo mais avançado para análise de Metas)

📤 RESUMO DO QUE SERÁ ENVIADO PARA A IA:
   - Prompt estruturado em 7 seções com fórmulas obrigatórias
   - Contexto completo do negócio (nicho, ticket, orçamento)
   - Todas as anotações das semanas de estruturação
   - Métricas do primeiro mês (do modal)
   - Observações adicionais do usuário
   - Instruções de completude e realismo

🎯 A IA receberá TODOS os dados necessários para gerar o relatório de 12 meses!

================================================================================
```

### 4️⃣ Preencha o Modal

O modal abrirá automaticamente. Você verá:

**📋 Contexto do Negócio** (já preenchido automaticamente):
- Nicho: [seu nicho]
- Ticket Médio: [seu ticket]
- Orçamento Mensal: [seu orçamento]

**📊 Métricas do Primeiro Mês** (você preenche):
- Investimento em Mídia Paga
- Leads Orgânicos Esperados
- Leads Tráfego Pago Esperados
- Taxa de Conversão (Pago)
- Taxa de Conversão (Orgânico)

**📈 Prévia dos Próximos 6 Meses** (calculado automaticamente)

**📝 Observações Adicionais** (opcional)

### 5️⃣ Clique em "Gerar Análise"

A IA começará a trabalhar com TODOS os contextos que você viu no console!

---

## ✅ O Que Verificar

### Se todos mostrarem ✅ = PERFEITO!

Isso significa que a IA receberá:
- ✅ Prompt estruturado profissional
- ✅ Todo o contexto do seu negócio
- ✅ Todas as suas anotações
- ✅ Os dados exatos do primeiro mês
- ✅ Suas observações adicionais

### Se algum mostrar ❌ ou ⚠️:

Significa que esse contexto NÃO será enviado. Exemplos:
- "Contexto do Negócio: ❌ NÃO PRESENTE" = você não preencheu o cadastro inicial
- "Métricas: ⚠️ NÃO PRESENTE" = o modal não salvou os dados (bug)

---

## 🎯 Resultado Esperado

Após preencher o modal e gerar, você receberá:

📊 **RELATÓRIO COMPLETO DE 12 MESES** contendo:

1. **Visão Estratégica** adaptada ao seu negócio
2. **Metas Anuais Principais** baseadas nos seus dados
3. **TABELA COMPLETA DE 12 MESES** com:
   - Investimento mensal
   - Leads (orgânicos e pagos)
   - MQLs
   - Conversões
   - Vendas
   - Faturamento
   - CPL, CAC, ROAS
4. **Metas de Redes Sociais**
5. **Plano para Bater as Metas**
6. **Resumo Executivo**

**Tudo 100% adaptado ao seu nicho, ticket e dados fornecidos!**

---

## 📌 Atalho Rápido

```javascript
// Cole isso no console para verificar os dados salvos:
console.log('Métricas salvas:', window.metricasPrimeiroMes);
console.log('Negócio:', ESTRUCTURACAO_STATE.businessInfo);
```

---

**Pronto para testar!** 🚀
