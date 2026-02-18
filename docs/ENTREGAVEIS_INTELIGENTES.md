# 🧠 Sistema de Entregáveis Inteligentes - MediaGrowth

## Visão Geral

Este documento descreve as melhorias implementadas no sistema de geração de entregáveis da aba **Estruturação**. O objetivo é transformar a geração de documentos de uma simples "cópia dos checklists" para uma **análise estratégica inteligente**.

---

## 🏢 Campos de Informações do Negócio (NOVO!)

Logo abaixo do título "🎯 Estruturação de Marketing e Comercial" foram adicionados 3 campos para refinar a análise da IA:

### Campos Disponíveis:

1. **🏢 Nome do Negócio**
   - Nome da empresa/cliente
   - Exemplo: "Clínica Dental Premium", "Loja XYZ"

2. **⏱️ Tempo de Negócio**
   - Há quanto tempo a empresa existe
   - Exemplo: "3 anos", "6 meses", "recém-aberto"

3. **📝 Observações Importantes**
   - Informações relevantes para contexto
   - Nicho de mercado, modelo de negócio, diferenciais, desafios atuais

### Como Funciona:

1. Preencha os campos na aba Estruturação
2. Clique em "💾 Salvar Informações"
3. Os dados são salvos no Firebase (persistentes)
4. Ao gerar qualquer entregável, essas informações são incluídas automaticamente no prompt

### Integração com IA:

As informações são adicionadas ao início de cada prompt gerado:

```markdown
## 🏢 INFORMAÇÕES DO NEGÓCIO

**Nome do Negócio:** Clínica Dental Premium
**Tempo de Mercado:** 5 anos
**Observações Importantes:**
Clínica odontológica focada em implantes e estética dental.
Atende classe A/B na zona sul de São Paulo.
Principal desafio: aumentar ticket médio e fidelização.

---
```

---

## O Problema Original

Antes da melhoria, ao gerar um entregável:
- A IA apenas replicava as informações preenchidas nos checklists
- Não havia análise crítica dos dados
- Gaps de informação eram marcados como "[Aguardando informação]" sem sugestões
- Faltava contexto de negócio da MediaGrowth
- Não havia benchmarks de mercado para comparação

## A Solução Implementada

### 1. Contexto de Expertise MediaGrowth (`MEDIAGROWTH_EXPERTISE_CONTEXT`)

Uma constante que define o papel do consultor IA com:

- **Modelo de Negócio**: Explicação do funil e modelo da MediaGrowth
- **Benchmarks de Referência**: Métricas de mercado para comparação
  - CPL médio Meta/Google Ads
  - Taxas de conversão de LP
  - Taxa de show em agendamentos
  - CAC/LTV saudáveis
  - ROAS/ROI mínimos
- **Instruções Críticas**: O que a IA DEVE fazer
  - Não apenas replicar dados
  - Identificar gaps
  - Conectar pontos
  - Questionar inconsistências
  - Sugerir além do óbvio

### 2. Insights Específicos por Entregável (`getEntregavelExpertiseInsights`)

Cada tipo de entregável agora recebe expertise específica:

| Entregável | Expertise Adicional |
|------------|---------------------|
| Diagnóstico Estratégico | Ciclo de caixa, gargalos escondidos, unit economics |
| Direcionamento e Metas | Validação SMART, math reversa, capacidade de execução |
| Análise de Concorrência | Espionagem de anúncios, quadrante estratégico |
| Matriz CDT | Hierarquia de dores, framework de copy |
| PUV | Fórmula de PUV, critérios de validação |
| PAI | Jobs to be done, anti-persona |
| Anúncios Pagos | Pirâmide de tráfego, estrutura mínima viável |
| Site & SEO | Above the fold, SEO prático |
| Redes Sociais | Funil social, pirâmide de conteúdo |
| Copywriting | AIDA, PAS, gatilhos mentais |
| Produção de Conteúdo | Batching, repurposing, fórmula de roteiro |
| Criativos | Thumb-stopping, testes prioritários |
| CRM | Velocidade, cadência, qualificação BANT |
| Processo Comercial | Estrutura de call, objeções |
| Landing Pages | Elementos obrigatórios, testes A/B |
| Website | Páginas essenciais, hierarquia visual |
| Padronização Visual | Elementos de brand, consistência |
| Plataforma | Visão integrada, ordem de prioridade |

### 3. Função `generateDocPrompt` Aprimorada

A função agora:

1. **Calcula estatísticas** dos dados preenchidos
   - Taxa de completude
   - Quantidade de notas
   - Qualidade do contexto

2. **Agrupa itens por bloco** para melhor organização

3. **Identifica gaps** (itens não completados) e alerta a IA

4. **Inclui instruções finais** sobre:
   - Análise crítica
   - Aplicação de benchmarks
   - Sugestões proativas
   - Alertas de risco

5. **Seção obrigatória** "ANÁLISE DE GAPS E RECOMENDAÇÕES"

## Exemplo de Prompt Gerado

```markdown
# 🎯 GERAÇÃO INTELIGENTE DE DOCUMENTO: Diagnóstico Estratégico Completo

## 🧠 CONTEXTO ESTRATÉGICO MEDIAGROWTH
[Expertise e benchmarks]

### 🧠 EXPERTISE ADICIONAL PARA DIAGNÓSTICO
[Insights específicos do tipo de entregável]

---

## 📊 DADOS COLETADOS DA ESTRUTURAÇÃO

**Empresa:** Cliente XYZ
**Responsável:** Bruno
**Data de Geração:** 08/01/2025

### 📈 Análise de Completude dos Dados
- **Itens preenchidos:** 15 de 20 (75%)
- **Itens com anotações detalhadas:** 8
- **Qualidade do contexto:** Há contexto rico nas anotações

### 📝 Anotações Registradas
[Notas organizadas com destaque]

### ✅ Itens Trabalhados/Concluídos
[Agrupados por bloco]

### ⚠️ Itens NÃO Trabalhados (GAPS A CONSIDERAR)
[Lista de gaps]

---

## ⚡ INSTRUÇÕES FINAIS DE GERAÇÃO
[Diretrizes para análise inteligente]
```

## Benefícios

1. **Documentos mais estratégicos** - Não apenas dados, mas análises
2. **Gaps identificados automaticamente** - O que está faltando
3. **Benchmarks aplicados** - Comparação com mercado
4. **Sugestões proativas** - IA sugere além do solicitado
5. **Alertas de risco** - Problemas potenciais identificados
6. **Contexto de negócio** - IA entende o modelo MediaGrowth

## Arquivos Modificados

- `index.html`:
  - Adicionada constante `MEDIAGROWTH_EXPERTISE_CONTEXT`
  - Adicionada função `getEntregavelExpertiseInsights(entregavelId)`
  - Aprimorada função `generateDocPrompt(entregavelId, data)`

## Como Usar

1. Preencha os checklists e anotações normalmente na aba Estruturação
2. Clique em "Gerar Doc" em qualquer entregável
3. O prompt gerado agora inclui:
   - Contexto estratégico da MediaGrowth
   - Benchmarks de mercado
   - Expertise específica do tipo de documento
   - Análise de completude dos dados
   - Instruções para análise inteligente
4. Copie o prompt e use no ChatGPT, Claude ou outra IA
5. Receba um documento estratégico, não apenas uma cópia dos dados

## Manutenção

Para adicionar novos tipos de entregáveis:

1. Adicione o mapeamento em `ENTREGAVEL_MAPPING`
2. Adicione os insights específicos em `getEntregavelExpertiseInsights()`
3. Inclua um `promptAnalise` detalhado com a estrutura esperada

Para atualizar benchmarks:

Edite a constante `MEDIAGROWTH_EXPERTISE_CONTEXT` com os novos valores de mercado.

---

*Implementado em: Janeiro 2025*
*Versão: 1.0*
