# 🚀 Perguntas Rápidas na Aba I.A.

## Data: 31/01/2026

## Resumo
Adicionados 12 botões de perguntas pré-prontas na tela inicial da aba I.A. para obter respostas rápidas sobre o status do marketing, metas, leads, planejamento e mais.

## Objetivo
Facilitar o acesso rápido às informações mais importantes do cliente, mantendo o marketing organizado, atualizado e gerando mais resultados.

## Perguntas Rápidas Disponíveis

| Botão | Pergunta | Fontes de Dados |
|-------|----------|-----------------|
| 📊 **Status do Marketing** | "Qual o status atual do marketing? Resuma as campanhas ativas, resultados recentes e pontos de atenção." | Notas Time, Macro, Demandas |
| 🎯 **Metas e Progresso** | "Quais são as metas atuais e como está o progresso de cada uma? Liste metas anuais e mensais com percentuais." | Metas, CAC |
| 🏢 **Sobre a Empresa** | "Faça um resumo sobre a empresa/cliente: nicho, público-alvo, diferenciais, ticket médio e principais desafios." | Estruturação, PAI, PUV |
| 👥 **Análise de Leads** | "Como estão os leads? Mostre quantidade, qualidade, origem e taxa de conversão dos últimos períodos." | Leads, CAC, Metas |
| 📋 **Planejamento Atual** | "Qual o planejamento atual? Liste as demandas em andamento, prazos e responsáveis." | Planejamento, Demandas |
| 📅 **Calendário da Semana** | "O que está programado no calendário? Mostre posts, campanhas e entregas dos próximos dias." | Calendário, Posts |
| ⚠️ **Riscos e Alertas** | "Quais são os principais riscos e pontos de atenção? Identifique gargalos, atrasos e problemas potenciais." | Demandas, Notas Time, Macro |
| ⚖️ **Pontos Fortes/Fracos** | "Quais os pontos positivos e negativos do último período? Faça uma análise SWOT rápida baseada nos dados." | Macro, Reuniões, Notas Time |
| 🤝 **Resumo de Reuniões** | "O que foi discutido nas últimas reuniões com o cliente? Resuma decisões, acordos e pendências." | Reuniões |
| 💡 **Próximos Passos** | "Sugira 3 ações prioritárias para melhorar os resultados este mês, baseado em todos os dados disponíveis." | Todas as fontes |
| 📈 **ROI e Investimento** | "Qual o ROI atual das campanhas? Analise investimento vs retorno, custo por lead, custo por aquisição e sugira otimizações de verba." | CAC, Metas, Tráfego |
| 🔥 **Oportunidades** | "Identifique 3 oportunidades de crescimento não exploradas baseado nos dados. Considere novos canais, públicos, formatos de conteúdo ou estratégias." | Todas as fontes |

## Como Funciona

1. Ao abrir a aba I.A. ou iniciar uma nova conversa, os 10 botões aparecem na tela
2. Clique em qualquer botão para enviar a pergunta automaticamente
3. A IA responderá usando TODAS as fontes de dados disponíveis
4. A conversa fica salva no histórico para consulta futura

## Benefícios

- ⚡ **Velocidade**: Respostas em 1 clique, sem digitar
- 📊 **Consistência**: Perguntas otimizadas para extrair o máximo das fontes
- 🎯 **Foco**: Informações mais relevantes para gestão do marketing
- 🔄 **Atualização**: Sempre com dados frescos do sistema
- 📈 **Resultados**: Identificação rápida de oportunidades e problemas

## Implementação Técnica

### HTML Adicionado
```html
<div class="ia-quick-prompts">
  <button type="button" class="ia-quick-btn" data-prompt="...">
    📊 Status do Marketing
  </button>
  <!-- ... outros botões -->
</div>
```

### CSS Adicionado
```css
.ia-quick-prompts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}
.ia-quick-btn {
  padding: 12px 16px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.12);
  /* ... hover effects com cor accent */
}
```

### JavaScript Adicionado
```javascript
document.addEventListener('click', (e) => {
  const quickBtn = e.target.closest('.ia-quick-btn');
  if(quickBtn){
    const prompt = quickBtn.dataset.prompt;
    if(prompt && iaQuestion){
      if(!CURRENT_CHAT) newIAChat();
      iaQuestion.value = prompt;
      sendIAQuestion();
    }
  }
});
```

## Arquivos Modificados
- `index.html`:
  - Seção HTML da aba I.A. (tela vazia)
  - Estilos CSS para os botões
  - Event listener para cliques nos botões

## Testes Recomendados
1. Abrir aba I.A. sem conversa ativa → botões devem aparecer
2. Clicar em cada botão → deve enviar pergunta e obter resposta
3. Verificar se a conversa fica salva no histórico
4. Testar responsividade em tela pequena
5. Iniciar nova conversa → botões devem reaparecer

---

**Status:** ✅ IMPLEMENTADO  
**Próxima Ação:** Testar em produção
