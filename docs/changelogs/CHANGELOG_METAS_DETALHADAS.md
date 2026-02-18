# Atualizações dos Prompts de Estruturação

**Data:** 24/12/2024

---

## 🆕 Atualização 2: Regra de Moeda em Todos os Prompts

### O que foi alterado
Adicionada regra obrigatória em **todos os 18 prompts** de entregáveis da aba Estruturação para verificar a moeda correta (Real ou Dólar) antes de gerar valores monetários.

### Regra Adicionada
```
**⚠️ REGRA OBRIGATÓRIA DE MOEDA:**
Antes de gerar qualquer valor monetário, VERIFIQUE no bloco "📋 Contexto do Negócio" das anotações qual moeda o cliente utiliza (R$ Real ou $ Dólar/USD). 
- Se encontrar "dólar", "USD", "dollar" ou "$" no contexto → Use $ (dólar americano)
- Se encontrar "real", "reais", "BRL" ou "R$" no contexto → Use R$ (real brasileiro)  
- Se não estiver especificado → Pergunte ou use R$ como padrão
TODOS os valores monetários do relatório devem seguir a moeda identificada.
```

### Entregáveis Atualizados (18 total)
1. ✅ Diagnóstico Estratégico
2. ✅ Direcionamento Estratégico e Metas
3. ✅ Concorrência e Mercado
4. ✅ Matriz CDT
5. ✅ PUV (Proposta Única de Valor)
6. ✅ PAI (Perfil do Avatar Ideal)
7. ✅ Anúncios Pagos
8. ✅ Site & SEO
9. ✅ Redes Sociais
10. ✅ Copywriting
11. ✅ Conteúdo
12. ✅ Anúncios Criativos
13. ✅ CRM e Automação
14. ✅ Vendas e Processos
15. ✅ Landing Pages
16. ✅ Websites Corporativos
17. ✅ Guia de Padronização
18. ✅ Plano Mestre Anual

### Como Funciona
Quando o usuário preencher o bloco "📋 Contexto do Negócio" nas anotações e mencionar a moeda (ex: "trabalhamos em dólar", "valores em USD", "faturamento em reais"), a IA automaticamente usará a moeda correta em todos os relatórios gerados.

---

## 🆕 Atualização 1: Metas Detalhadas Mês a Mês

O prompt de análise do entregável "Direcionamento Estratégico e Metas" na aba de Estruturação foi completamente reformulado para incluir **todas as 11 métricas** com detalhamento **mês a mês** para alcançar a meta anual.

## As 11 Métricas Agora Detalhadas

1. **Investimento em Tráfego (Publicidade)**
   - Tabela mensal com investimento, acumulado, % do ano e observações
   - Estratégia de investimento por fases (Jan-Mar, Abr-Jun, Jul-Set, Out-Dez)

2. **Faturamento com Origem no Tráfego**
   - Meta de faturamento por mês
   - Acumulado e % da meta anual
   - ROAS necessário para cada mês

3. **Taxa de Leads Qualificados (MQL)**
   - Leads totais e MQLs por mês
   - Taxa de qualificação e evolução
   - Ações para melhorar qualificação

4. **CPL (Custo por Lead)**
   - Investimento, leads e CPL por mês
   - Meta de CPL e status (teste/ajuste/validação/otimizado)
   - Redução esperada ao longo do ano

5. **CAC (Custo de Aquisição de Cliente)**
   - Investimento total e clientes por mês
   - CAC, ticket médio e relação CAC/Ticket
   - Ações para reduzir CAC

6. **Nº de Leads Aquecidos (Nutrição)** ✨ NOVA
   - Leads novos, em nutrição e convertidos por mês
   - Taxa de conversão mensal
   - Estratégia de nutrição (Email, WhatsApp, Remarketing)

7. **ROAS (Retorno sobre Investimento em Publicidade)**
   - Investimento, receita e ROAS por mês
   - Meta e status visual
   - Evolução esperada do ROAS por fase

8. **Nº de Seguidores (Canais de Tração)** ✨ NOVA
   - Crescimento por canal: Instagram, Facebook, LinkedIn, YouTube, TikTok
   - Total de novos seguidores por mês
   - Estratégias de crescimento por canal

9. **Comentários Positivos no GBP (Google Business Profile)**
   - Meta de avaliações e acumulado por mês
   - Nota média esperada
   - Processo para coleta de avaliações

10. **Número de Vendas Totais** ✨ NOVA
    - Meta de vendas e acumulado por mês
    - % do ano, ticket médio e faturamento

11. **Número de Vendas com Origem no Marketing** ✨ NOVA
    - Vendas de marketing vs outras origens
    - % de vendas originadas do marketing
    - Distribuição por canal de marketing

## Estrutura Adicional

### Resumo Executivo
Tabela consolidada com todas as 11 métricas, meta anual e média mensal.

### Curva de Crescimento (4 Fases)
1. **Fase 1 - Validação (Mês 1-3)**: Teste e aprendizado
2. **Fase 2 - Escala (Mês 4-6)**: Expansão de canais validados
3. **Fase 3 - Otimização (Mês 7-9)**: Maximização de retorno
4. **Fase 4 - Consolidação (Mês 10-12)**: Aproveitamento sazonal

### Premissas e Riscos
- Premissas usadas nos cálculos
- Riscos identificados com mitigações
- Fatores de sucesso

### Plano de Ação
- Ações imediatas (Semana 1-2)
- Metas do Mês 1
- Objetivos do Trimestre 1
- Metas do Semestre 1
- Objetivo Anual

### Checkpoints de Revisão
| Data | Revisão | O que analisar |
|------|---------|---------------|
| Fim Mês 1 | Validação inicial | CPL, primeiros leads |
| Fim Mês 3 | Trimestral | Todas as métricas |
| Fim Mês 6 | Semestral | ROI geral |
| Fim Mês 9 | Pré-fechamento | Preparação Q4 |
| Fim Mês 12 | Anual | Balanço completo |

## Como Usar

Quando a IA gerar o relatório de "Direcionamento Estratégico e Metas", ela agora seguirá este template completo e preencherá:

1. A tabela master com todas as métricas por mês
2. Detalhamento individual de cada uma das 11 métricas
3. Valores calculados com base nas anotações do cliente
4. Estratégias e ações para atingir cada meta
5. Cronograma de revisões e checkpoints

## Arquivo Modificado

- `/index.html` - Linha ~27232 a ~27580 (objeto `direcionamento_metas.promptAnalise`)
