# Formulário de Metas - Modo Wizard (Didático)

## Data da Implementação
3 de novembro de 2025

## Objetivo

Transformar o formulário de metas (`metas-form.html`) em uma experiência mais didática e amigável para clientes, mostrando **uma meta por vez** em formato de perguntas objetivas.

## Mudanças Implementadas

### 🎯 **Conceito Principal: Wizard Flow**

Ao invés de mostrar todas as metas de uma vez em um formulário longo, o novo formato apresenta:
- ✅ Uma pergunta por vez
- ✅ Barra de progresso visual
- ✅ Perguntas contextualizadas
- ✅ Modo de aprovação quando já existe valor
- ✅ Salvamento automático
- ✅ Navegação fluida (próximo/voltar)

---

## Funcionalidades

### 1. **Perguntas Personalizadas**

O sistema gera perguntas específicas baseadas no tipo de meta:

| Tipo de Meta | Pergunta Gerada |
|--------------|----------------|
| Investimento em tráfego | "Quanto você gostaria de investir em tráfego pago este mês?" |
| Faturamento/Receita | "Qual foi o faturamento total deste mês?" |
| Vendas/Negócios | "Quantas vendas foram fechadas este mês?" |
| Leads/Contatos | "Quantos leads foram gerados este mês?" |
| Ticket Médio | "Qual foi o ticket médio deste mês?" |
| Taxa de Conversão | "Qual foi a taxa de conversão deste mês?" |
| ROI | "Qual foi o ROI (retorno sobre investimento) deste mês?" |
| Custos/Despesas | "Qual foi o custo total deste mês?" |

### 2. **Modo Aprovação vs Edição**

#### **Quando JÁ existe valor salvo:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Meta 1 • Investimento em tráfego

Quanto você gostaria de investir em 
tráfego pago este mês?

┌─────────────────────────────────────┐
│ Você aprova este valor: R$ 5.000,00? │
└─────────────────────────────────────┘

[✏️ Editar valor]  [✅ Aprovar e continuar]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### **Quando NÃO existe valor (novo):**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Meta 1 • Investimento em tráfego

Quanto você gostaria de investir em 
tráfego pago este mês?

R$ [    5000    ]

[← Voltar]  [Próxima →]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3. **Barra de Progresso**

```
Meta 2 de 5  ● ● ◉ ○ ○
            ↑─completado
              ↑─atual
                ↑─pendente
```

### 4. **Formatação por Tipo**

| Unidade | Símbolo | Exemplo | Formatação |
|---------|---------|---------|------------|
| BRL | R$ | R$ 5.000,00 | Moeda brasileira |
| USD | US$ | US$ 1,234.56 | Moeda americana |
| % | % | 15,5% | Porcentagem |
| numero | - | 150 | Número inteiro |

### 5. **Salvamento Automático**

- ✅ Salva **800ms** após parar de digitar
- ✅ Feedback visual: "💾 Salvando..." → "✅ Resposta salva"
- ✅ Retry automático em caso de falha
- ✅ Dados persistem no Firestore

### 6. **Navegação Inteligente**

- **Enter**: Avança para próxima meta
- **Botão "Próxima →"**: Avança manualmente
- **Botão "← Voltar"**: Retorna à meta anterior
- **Permite pular**: Se não quiser responder, pode avançar

### 7. **Tela de Conclusão**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           🎉

    Pronto! Metas atualizadas

Todas as suas respostas foram salvas 
com sucesso.

Você pode fechar esta página agora.

      [🔄 Revisar respostas]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Estrutura Técnica

### Estado da Aplicação

```javascript
const state = {
  initialized: false,     // App inicializado?
  currentStep: 0,         // Índice da meta atual
  responses: {},          // { metaId: value }
  docData: null,          // Dados do Firestore
  metas: [],              // Array de metas
  monthKey: '',           // 'jan', 'fev', etc
  monthLabel: '',         // 'Janeiro', 'Fevereiro', etc
  saveTimer: null,        // Timer para debounce
  saving: false           // Flag de salvamento
};
```

### Fluxo de Dados

```
1. Cliente abre link com ?token=ABC123
2. Carrega dados do Firestore (metasForms/ABC123)
3. Filtra metas ativas
4. Renderiza meta atual (step 0)
5. Cliente responde
6. Auto-save (800ms debounce)
7. Avança para próxima (step++)
8. Repete até completar todas
9. Mostra tela de conclusão
```

### Funções Principais

| Função | Responsabilidade |
|--------|-----------------|
| `renderCurrentStep()` | Renderiza a meta atual ou tela final |
| `renderMetaStep()` | Cria UI da meta com pergunta |
| `renderProgressBar()` | Barra de progresso visual |
| `generateQuestion()` | Gera pergunta contextualizada |
| `createInputField()` | Cria campo de input com prefixo/sufixo |
| `nextStep()` | Avança para próxima meta |
| `previousStep()` | Volta para meta anterior |
| `scheduleSave()` | Agenda salvamento com debounce |
| `runSave()` | Executa save no Firestore |

---

## Exemplo de Uso

### Para o Cliente:

1. **Recebe link**: `https://seu-site.com/metas-form.html?token=xyz789`
2. **Abre no navegador**: Vê primeira meta
3. **Responde**: "R$ 5.000,00"
4. **Clica "Próxima"**: Vai para segunda meta
5. **Continua**: Responde todas as metas
6. **Finaliza**: Vê tela de conclusão 🎉
7. **Fecha página**: Dados já estão salvos

### Para a Agência:

1. Gera link do formulário (botão no painel)
2. Envia para cliente via WhatsApp/Email
3. Cliente preenche no próprio ritmo
4. Respostas aparecem automaticamente no painel
5. Pode usar dados para relatórios e acompanhamento

---

## Melhorias de UX

### Antes (Formulário Tradicional):
- ❌ Todas as metas de uma vez
- ❌ Scroll infinito
- ❌ Campos genéricos
- ❌ Difícil de entender
- ❌ Intimidador para cliente

### Depois (Wizard):
- ✅ Uma pergunta por vez
- ✅ Foco total na resposta
- ✅ Perguntas claras e objetivas
- ✅ Progresso visual
- ✅ Experiência amigável
- ✅ Mobile-friendly

---

## Responsividade

### Desktop:
```css
.container { width: min(720px, 94vw); }
.meta-question { font-size: 1.5rem; }
.wizard-input { font-size: 1.3rem; }
```

### Mobile:
```css
.meta-question { font-size: 1.3rem; }
.wizard-input { font-size: 1.2rem; }
.wizard-actions { flex-direction: column-reverse; }
.btn { width: 100%; }
```

---

## Animações

### Entrada de Meta:
```css
@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Conclusão:
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
```

---

## Compatibilidade

- ✅ Chrome/Edge (v90+)
- ✅ Safari (v14+)
- ✅ Firefox (v88+)
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 10+)

---

## Segurança

- 🔒 Token único por cliente
- 🔒 Validação no Firestore
- 🔒 Dados criptografados em trânsito
- 🔒 Sem autenticação necessária (link é a chave)
- 🔒 Token pode ser revogado

---

## Métricas de Sucesso

### Objetivos:
- 📊 Aumentar taxa de preenchimento: **>90%**
- ⏱️ Reduzir tempo médio: **<3 min**
- 😊 Melhorar satisfação do cliente
- 🔄 Reduzir abandonos: **<10%**

---

## Próximos Passos (Futuro)

- [ ] Validação de campos (mínimo/máximo)
- [ ] Sugestões baseadas em histórico
- [ ] Comparação com mês anterior
- [ ] Gráficos de evolução
- [ ] Notificações de lembrete
- [ ] Integração com WhatsApp

---

## Suporte

Para dúvidas ou problemas:
1. Verificar console do navegador
2. Testar com outro cliente (token diferente)
3. Revisar logs do Firestore
4. Regenerar link se necessário

---

**Desenvolvido com ❤️ pela MediaGrowth**
