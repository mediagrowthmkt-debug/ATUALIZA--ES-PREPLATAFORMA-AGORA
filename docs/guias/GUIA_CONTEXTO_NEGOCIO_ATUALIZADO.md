# 🎯 GUIA RÁPIDO: Como Atualizar o Contexto do Negócio

**Atualizado:** 27 de dezembro de 2025

---

## 📋 O QUE É O CONTEXTO DO NEGÓCIO?

É onde você define informações essenciais do seu negócio que a IA usa para gerar análises personalizadas:

- 💰 **Ticket Médio** - Valor médio por venda
- 💵 **Orçamento** - Investimento em marketing/mês
- 🏢 **Taxa Agência** - Valor pago para agência/mês
- 🌍 **País** - Define moeda e idioma
- 📊 **Nicho** - Seu segmento de mercado
- ⏱️ **Tempo de Mercado** - Há quanto tempo atua

---

## ✅ COMO ATUALIZAR

### Passo 1: Abrir Contexto do Negócio
1. Vá em **"Estruturação"** (menu lateral)
2. Role até **"📋 Contexto do Negócio"**

### Passo 2: Editar Informações
1. Clique no campo que deseja alterar (ex: Ticket Médio)
2. Digite o novo valor
3. **Salva automaticamente** quando você sai do campo

### Passo 3: Verificar Salvamento
- ✅ Aparece "💾" e depois "✓" ao lado do botão Salvar
- Isso confirma que foi salvo no Firebase

---

## ⚠️ ATENÇÃO: Análises Antigas

### O que acontece quando você atualiza?

Quando você muda um valor (ex: ticket médio de R$ 500 para R$ 800), as **análises já geradas** continuam com o valor antigo.

### Como o sistema avisa?

Ao abrir uma análise antiga, aparece um **banner amarelo** no topo:

```
⚠️ Contexto do Negócio Atualizado

Os seguintes dados foram alterados desde a última análise:
• Ticket Médio: "R$ 500,00" → "R$ 800,00"

Recomendação: Clique em "🔄 Regenerar Análise" para atualizar.

[🔄 Regenerar Agora]
```

### O que fazer?

**Opção 1:** Clique em **"🔄 Regenerar Agora"** (botão no banner)
- Gera nova análise com valores atualizados
- Leva ~10-30 segundos

**Opção 2:** Clique em **"🔄 Regenerar Análise"** (barra superior)
- Mesmo resultado
- Regenera análise completa

**Opção 3:** Não fazer nada
- Análise continua com valores antigos
- Banner permanece visível como lembrete

---

## 🎯 EXEMPLO PRÁTICO

### Situação:
Você aumentou seu ticket médio de R$ 500 para R$ 800 e quer que a IA considere isso.

### Passo a Passo:

1. **Atualizar Contexto:**
   ```
   Estruturação > 📋 Contexto do Negócio
   Ticket Médio: R$ 800,00
   (salva automaticamente)
   ```

2. **Abrir Análise do PAI:**
   ```
   Entregáveis > PAI > 📊 Ver Análise
   ⚠️ Banner amarelo aparece
   ```

3. **Regenerar:**
   ```
   Clique "🔄 Regenerar Agora"
   Aguarde 15 segundos
   ✅ Nova análise com R$ 800
   ```

4. **Resultado:**
   - Todas as referências agora usam R$ 800
   - Cálculos de CAC atualizados
   - Projeções recalculadas
   - Banner desaparece

---

## 🔄 QUANDO REGENERAR?

### 🟢 REGENERE SEMPRE que alterar:
- ✅ Ticket Médio
- ✅ Orçamento mensal
- ✅ Taxa da Agência
- ✅ País (muda moeda)
- ✅ Nicho (muda contexto)

### 🟡 CONSIDERE REGENERAR se alterar:
- Tempo de Mercado
- Localização
- Observações importantes

### 🔴 NÃO precisa regenerar:
- Nome da empresa (só visual)
- Pequenos ajustes em observações

---

## 💡 DICAS IMPORTANTES

### 1. Formato de Valores Monetários
✅ **CORRETO:**
- R$ 500,00
- R$ 1.500,00
- $ 100.00
- $ 1,500.00

❌ **EVITE:**
- 500 (sem moeda)
- R$500 (sem espaço)
- 500,00 (sem R$)

### 2. País e Moeda
- **Brasil** → usa R$ em todas as análises
- **Estados Unidos (EUA)** → usa $ em todas as análises
- ⚠️ Se mudar país, SEMPRE regenere análises

### 3. Auto-Save
- ✅ Sistema salva automaticamente ao sair do campo
- ✅ Não precisa clicar em "Salvar" manualmente
- ✅ Veja "✓" para confirmar

### 4. Múltiplas Análises
Se você tem 5 entregáveis analisados:
1. Atualize o Contexto do Negócio
2. Abra cada análise
3. Clique "Regenerar" em cada uma
4. Todas ficam atualizadas

---

## 📊 CAMPOS IMPORTANTES PARA IA

### 🔥 CRÍTICOS (IA usa diretamente):
1. **Ticket Médio** → Cálculos de faturamento
2. **Orçamento** → CAC e ROI
3. **País** → Moeda e idioma
4. **Nicho** → Contexto estratégico

### ⚡ IMPORTANTES:
- Taxa Agência → CAC total
- Tempo de Mercado → Maturidade
- Localização → Referências regionais

### 📝 COMPLEMENTARES:
- Observações → Contexto adicional

---

## ❓ PERGUNTAS FREQUENTES

### **P: Preciso regenerar todas as análises?**
R: Depende. Se você mudou **valores monetários** ou **país**, sim. Se mudou apenas observações, não é necessário.

### **P: Posso ignorar o banner amarelo?**
R: Sim, mas a análise continuará com dados antigos.

### **P: E se eu esquecer de regenerar?**
R: O banner sempre lembrará você. Mas para decisões estratégicas, use dados atualizados.

### **P: O que acontece com a análise antiga?**
R: É substituída pela nova. O sistema não mantém histórico (por enquanto).

### **P: Quanto tempo leva para regenerar?**
R: 10-30 segundos por análise, dependendo do entregável.

### **P: Posso regenerar várias vezes?**
R: Sim! Sem limite. Cada regeneração usa os dados mais atuais.

---

## 🚀 RESUMO RÁPIDO

```
1. Atualizar Contexto → Auto-salva ✅
2. Abrir Análise → Banner aparece ⚠️
3. Clicar Regenerar → Aguardar ⏱️
4. Análise Atualizada → Usar ✅
```

**Simples assim!** 🎉

---

## 📞 SUPORTE

Se o banner não aparecer mesmo após alterar valores:
1. Recarregue a página (F5)
2. Verifique se salvou corretamente (ícone "✓")
3. Teste em modo anônimo (Ctrl+Shift+N)

---

**Última atualização:** 27/12/2025
**Versão do sistema:** 2.0 com detecção automática de mudanças
