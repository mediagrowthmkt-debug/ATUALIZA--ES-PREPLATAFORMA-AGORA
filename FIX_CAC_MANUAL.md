# Correção da Seção CAC - Modo Manual

## Problema Identificado

A seção CAC estava com bugs devido às automações que sincronizavam dados da aba "Metas". Os campos "Qtde de Vendas" e "Total Receita" estavam marcados como `readonly` e eram preenchidos automaticamente pela função `updateFromMetas()`, impedindo a edição manual dos valores.

## Alterações Realizadas

### 1. **Remoção dos Atributos `readonly`**
   - Removido `readonly` dos campos:
     - `#cacSales` (Qtde de Vendas)
     - `#cacRevenue` (Total Receita)
   - Agora os campos são totalmente editáveis

### 2. **Remoção da Função `updateFromMetas()`**
   - Removida toda a lógica de automação que buscava dados das metas
   - A função tentava encontrar metas com descrições específicas e preencher automaticamente os campos
   - Isso causava conflitos e impedia o uso manual

### 3. **Atualização da Função `loadMonth()`**
   - Adicionado carregamento dos valores salvos de `sales` e `revenue`:
     ```javascript
     sales.value = CAC_DATA.sales?.[m] ?? '';
     revenue.value = CAC_DATA.revenue?.[m] ?? '';
     ```
   - Removida a chamada para `updateFromMetas()`

### 4. **Atualização da Função `saveMonth()`**
   - Adicionado salvamento dos valores de `sales` e `revenue`:
     ```javascript
     CAC_DATA.sales = CAC_DATA.sales || {};
     CAC_DATA.revenue = CAC_DATA.revenue || {};
     CAC_DATA.sales[m] = parseFloat(sales.value) || 0;
     CAC_DATA.revenue[m] = parseFloat(revenue.value) || 0;
     ```

### 5. **Event Listeners Adicionados**
   - Campos `sales` e `revenue` agora têm listeners para:
     - `input`: Recalcula em tempo real
     - `change`: Salva os dados no Firestore
   ```javascript
   [currency, salesAds, revenueAds, sales, revenue].forEach(el=>{
     el.addEventListener('input', recalc);
     el.addEventListener('change', ()=>{ recalc(); saveMonth(); });
   });
   ```

### 6. **Valores Padrão Atualizados**
   - Alterado os valores padrão de `-` para `R$ 0,00` nos campos:
     - Ticket Médio
     - Ticket Médio (Tráfego)
     - CAC REAL
     - CAC publicitários

## Como Usar Agora

### Cálculo Manual do CAC

1. **Selecione o Mês e Moeda**
   - Escolha o mês desejado no dropdown
   - Selecione a moeda (Real ou Dólar)

2. **Preencha as Despesas**
   - Equipe Marketing
   - Equipe Vendas
   - Softwares
   - Verba de Tráfego
   - Outros
   - Use o botão "Adicionar linha" para despesas extras

3. **Preencha os Dados de Vendas (coluna do meio)**
   - **Qtde de Vendas**: Digite manualmente a quantidade total de vendas
   - **Total Receita**: Digite manualmente o valor total de receita
   - O **Ticket Médio** é calculado automaticamente (Receita / Qtde Vendas)

4. **Preencha os Dados de Tráfego (coluna direita)**
   - **Qtde de Vendas (Tráfego)**: Vendas vindas de anúncios
   - **Total Receita (Tráfego)**: Receita vinda de anúncios
   - O **Ticket Médio (Tráfego)** é calculado automaticamente

5. **Resultados Automáticos**
   - **CAC REAL**: Total de despesas / Qtde de Vendas
   - **CAC publicitários**: Verba de Tráfego / Qtde de Vendas (Tráfego)

## Fórmulas de Cálculo

```
Ticket Médio = Total Receita / Qtde de Vendas
Ticket Médio (Tráfego) = Total Receita (Tráfego) / Qtde de Vendas (Tráfego)

CAC REAL = Soma de todas as despesas / Qtde de Vendas
CAC publicitários = Verba de Tráfego / Qtde de Vendas (Tráfego)
```

## Persistência de Dados

- Todos os valores são salvos automaticamente no Firestore ao alterar qualquer campo
- Os dados são organizados por mês
- Ao trocar de mês, os valores salvos anteriormente são carregados automaticamente

## Benefícios

✅ **Flexibilidade Total**: Digite os valores manualmente sem interferência de automações  
✅ **Cálculos em Tempo Real**: Os resultados são atualizados instantaneamente  
✅ **Dados Persistentes**: Valores salvos por mês no banco de dados  
✅ **Interface Limpa**: Sem conflitos com a aba de metas  
✅ **Fácil de Usar**: Processo intuitivo e direto  

## Data da Correção

3 de novembro de 2025
