# 📋 Copiar Demanda Individual - Resumo WhatsApp

**Data:** 12 de janeiro de 2026  
**Tipo:** Feature  
**Categoria:** Notas Time / UX  

## 📋 Resumo

Adicionada funcionalidade de **cópia individual de demandas** no resumo de WhatsApp da aba "Notas Time". Agora há uma lista de botões ao lado do resumo completo, permitindo copiar cada demanda individualmente sem perder a visualização geral.

---

## 🎯 Problema

Os usuários precisavam:
- Copiar **apenas uma demanda específica** sem todo o resumo
- Compartilhar **tarefas individuais** com membros específicos da equipe
- Evitar copiar manualmente cada demanda do resumo completo
- Ter agilidade ao comunicar uma tarefa pontual no WhatsApp
- **Manter a visualização completa** para contexto geral

---

## ✅ Solução Implementada

### 🆕 Layout em Duas Colunas

**Coluna Esquerda (Principal):**
- Resumo completo com todas as demandas
- Formatação WhatsApp preservada
- Botão "Copiar Tudo" funcional

**Coluna Direita (Nova):**
- Lista de botões de cópia individual
- Um botão por demanda com preview do título
- Emoji de status para identificação rápida
- Scroll independente

### 📱 Formato da Cópia Individual

Quando você copia uma demanda individual, o texto inclui:

```
*NOME DA EMPRESA*
*📋 PLANEJAMENTO*

🔵 *Título da demanda* ⚠️🔴 *ATRASADA*
👤 Responsável | 📅 10/01/2026
📝 link-do-plano
```

**Elementos incluídos:**
- Nome da empresa (contexto)
- Emoji de status (visual)
- Título da demanda (negrito)
- Indicação de bloqueio (se aplicável)
- Alerta de atraso (se aplicável)
- Responsável pela tarefa
- Prazo (data ou intervalo)
- Link do plano (se houver)

---

## 🎨 Interface

### Antes:
```
┌─────────────────────────────────────┐
│ 📱 Resumo para WhatsApp             │
├─────────────────────────────────────┤
│ Texto completo com todas demandas   │
│ formatado para WhatsApp             │
│                                     │
│ [📋 Copiar Tudo]                    │
└─────────────────────────────────────┘
```

### Depois:
```
┌─────────────────────────────────────────────────────────────┐
│ 📱 Resumo para WhatsApp                                     │
├──────────────────────────────────┬──────────────────────────┤
│ RESUMO COMPLETO                  │ 📋 Copiar individual:    │
│                                  │                          │
│ *EMPRESA*                        │ [🔵 Demanda 1...     📋] │
│ *📋 PLANEJAMENTO*                │ [🔴 Demanda 2...     📋] │
│                                  │ [🔥 Demanda 3...     📋] │
│ *👤 Bruno*                       │ [⚪ Demanda 4...     📋] │
│ _2 demanda(s)_                   │ [🔵 Demanda 5...     📋] │
│                                  │ [🔴 Demanda 6...     📋] │
│ 1. 🔵 *Demanda 1*                │                          │
│    👤 Bruno | 📅 10/01/2026      │ (scroll independente)    │
│                                  │                          │
│ 2. ⚪ *Demanda 2*                │                          │
│    👤 Nicolas | 📅 15/01/2026    │                          │
│                                  │                          │
│ [🔄 Atualizar] [📋 Copiar Tudo]  │                          │
└──────────────────────────────────┴──────────────────────────┘
```

---

## 🔧 Implementação Técnica

### 1. **Layout em Duas Colunas**

```javascript
async function updateDemandasPreview(text, demandasData = null){
  let html = '<div class="demandas-preview-with-buttons">';
  
  // Coluna esquerda: texto completo
  html += '<div class="demandas-preview-text">' + 
          formatWhatsAppPreview(text) + 
          '</div>';
  
  // Coluna direita: botões individuais
  if(demandasData && demandasData.length > 0){
    html += '<div class="demandas-copy-buttons">';
    html += '<div class="demandas-copy-buttons-header">📋 Copiar demanda individual:</div>';
    html += '<div class="demandas-copy-buttons-list">';
    
    for(let i = 0; i < demandasData.length; i++){
      const d = demandasData[i];
      const objetivo = (d.demanda || 'Sem título').substring(0, 40);
      
      html += `<button class="btn-copy-individual-inline" data-demanda-index="${i}">
        <span class="btn-copy-status">${statusEmoji}</span>
        <span class="btn-copy-text">${objetivo}</span>
        <span class="btn-copy-icon">📋</span>
      </button>`;
    }
    
    html += '</div></div>';
  }
  
  html += '</div>';
}
```

### 2. **CSS Responsivo**

```css
.demandas-preview-with-buttons {
  display: flex;
  gap: 16px;
}

.demandas-preview-text {
  flex: 1; /* Coluna principal ocupa espaço disponível */
}

.demandas-copy-buttons {
  width: 280px; /* Largura fixa para coluna de botões */
  border-left: 1px solid rgba(255,255,255,.1);
  padding-left: 16px;
}

.demandas-copy-buttons-list {
  max-height: 550px;
  overflow-y: auto; /* Scroll independente */
}

.btn-copy-individual-inline {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  cursor: pointer;
}

.btn-copy-individual-inline:hover {
  background: rgba(37,211,102,.1);
  border-color: #25d366;
  transform: translateX(2px);
}

/* Mobile: empilhar verticalmente */
@media(max-width:768px){
  .demandas-preview-with-buttons {
    flex-direction: column;
  }
  .demandas-copy-buttons {
    width: 100%;
    border-left: none;
    border-top: 1px solid rgba(255,255,255,.1);
  }
}
```

---

## 📊 Benefícios

✅ **Visualização Completa** - Resumo geral sempre visível  
✅ **Cópia Seletiva** - Um clique para copiar demanda específica  
✅ **Contexto Duplo** - Veja tudo + copie individual  
✅ **Identificação Rápida** - Emojis de status nos botões  
✅ **Feedback Visual** - Botão muda para "✅" ao copiar  
✅ **Scroll Independente** - Lista de botões com scroll próprio  
✅ **Responsivo** - Adapta para mobile empilhando colunas  

---

## 🔍 Casos de Uso

### 1. **Delegar Tarefa Específica**
```
1. Visualize o resumo completo na esquerda
2. Identifique a demanda desejada pelos emojis
3. Clique no botão correspondente na direita
4. Cole no WhatsApp do responsável
```

### 2. **Compartilhar Bloqueio**
```
1. Localize demandas com 🔴 (bloqueado)
2. Clique no botão da demanda bloqueada
3. Envie para quem pode desbloquear
```

### 3. **Update Completo + Detalhe Individual**
```
1. Copie resumo completo para o grupo
2. Depois copie demanda específica
3. Envie no privado de um membro
```

---

## 📊 Exemplos de Uso

### Caso 1: Compartilhar Tarefa Específica

**Ação:** Clicar no botão "📋 Copiar" da demanda específica

**Resultado copiado:**
```
*ANDERSON KITCHEN & BATHROOM*
*📋 PLANEJAMENTO*

🔵 *Planejamento de campanhas*
👤 Bruno | 📅 09/01/2026
📝 https://short.link/abc123
```

### Caso 2: Delegar Tarefa Bloqueada

**Ação:** Copiar demanda bloqueada e enviar no WhatsApp

**Resultado:**
```
*ANDERSON KITCHEN & BATHROOM*
*📋 PLANEJAMENTO*

🔴 *Reativar Google Ads e Meta Ads* _(bloqueada)_
👤 Nicolas | 📅 06/01/2026
```

### Caso 3: Avisar sobre Tarefa Atrasada

**Ação:** Copiar demanda atrasada

**Resultado:**
```
*CLIENTE X*
*📋 PLANEJAMENTO*

🔵 *Criar relatório Q1* ⚠️🔴 *ATRASADA*
👤 Camilla | 📅 05/01/2026
```

---

## 🎯 Benefícios

✅ **Comunicação Pontual** - Compartilhe apenas o necessário  
✅ **Economia de Tempo** - Um clique para copiar  
✅ **Contexto Completo** - Inclui empresa, responsável e prazo  
✅ **Feedback Visual** - Botão muda para "✅ Copiado!"  
✅ **Interface Intuitiva** - Cards organizados e claros  
✅ **Delegação Eficiente** - Envie tarefas específicas para membros  
✅ **Alertas Visíveis** - Atrasos e bloqueios destacados  

---

## 🔍 Casos de Uso

### 1. **Delegar Tarefa Específica**
```
Gestor copia demanda individual
→ Cola no WhatsApp privado do responsável
→ "Olá João, segue sua próxima tarefa:"
→ [demanda formatada com todos os detalhes]
```

### 2. **Lembrar Tarefa Atrasada**
```
Filtrar demandas atrasadas
→ Copiar demanda individual com alerta
→ Enviar no grupo: "Pessoal, esta tarefa está atrasada:"
→ [demanda com marcação ⚠️🔴 ATRASADA]
```

### 3. **Compartilhar Bloqueio**
```
Identificar demanda bloqueada
→ Copiar demanda individual
→ Enviar para quem pode desbloquear
→ "Esta tarefa está travada, pode ajudar?"
```

### 4. **Update Rápido**
```
Cliente pede status de uma tarefa
→ Localizar demanda na lista
→ Copiar individual
→ Enviar direto no WhatsApp do cliente
```

---

## 🧪 Como Testar

### Teste 1: Cópia Individual
1. Acesse aba **"Notas Time"**
2. Adicione algumas demandas com diferentes status
3. Role até **"📱 Resumo para WhatsApp"**
4. Verifique que cada demanda tem seu **próprio card**
5. Clique em **"📋 Copiar"** de uma demanda específica
6. Verifique:
   - Toast de confirmação aparece
   - Botão muda para "✅ Copiado!" por 2 segundos
   - Texto copiado contém **apenas aquela demanda**
   - Formato inclui **nome da empresa** no topo

### Teste 2: Formato Correto
1. Copie uma demanda individual
2. Cole em um bloco de notas
3. Verifique estrutura:
   ```
   *EMPRESA*
   *📋 PLANEJAMENTO*
   
   emoji *título* (bloqueio/atraso)
   👤 responsável | 📅 prazo
   📝 link (se houver)
   ```

### Teste 3: Diferentes Status
Copie demandas com cada status e verifique emojis:
- ⚪ Não iniciado
- 🔵 Em andamento
- 🔴 Bloqueado (deve incluir "_bloqueada_")
- 🔥 Prioridade
- ⚠️🔴 Atrasada (deve incluir alerta)

### Teste 4: Feedback Visual
1. Clique em "📋 Copiar"
2. Observe:
   - Botão muda para "✅ Copiado!"
   - Background fica verde (#25d366)
   - Após 2 segundos volta ao normal
   - Toast aparece no canto

### Teste 5: Múltiplas Cópias
1. Copie demanda 1
2. Cole no WhatsApp
3. Copie demanda 2
4. Cole no WhatsApp
5. Verifique que ambas tem **contexto completo** (nome da empresa)

---

## 📝 Notas Técnicas

### Geração Assíncrona
- Links de plano são gerados de forma assíncrona
- Preview atualiza gradualmente conforme links são carregados
- Não bloqueia interface durante geração

### Contexto da Empresa
- Cada demanda individual **sempre** inclui nome da empresa
- Garante que o destinatário saiba o contexto
- Facilita compartilhamento entre múltiplos projetos

### Performance
- Cards são gerados sob demanda
- Eventos de cópia são adicionados dinamicamente
- Não impacta renderização inicial da página

### Compatibilidade
- Funciona com todos os filtros existentes
- Respeita exclusão de demandas concluídas
- Mantém ordenação da tabela

---

## 🚀 Próximos Passos (Sugestões)

- [ ] Adicionar opção "Copiar sem empresa" (só a demanda)
- [ ] Template customizável para cópia individual
- [ ] Copiar múltiplas demandas selecionadas
- [ ] Exportar demanda como imagem
- [ ] Histórico de demandas copiadas
- [ ] Atalho de teclado para copiar (Ctrl+C no hover)
- [ ] Compartilhar direto pelo Web Share API
- [ ] Preview ao passar mouse sobre botão

---

## 📚 Arquivos Alterados

- ✅ `index.html` - Nova função `generateIndividualDemanda()`
- ✅ `index.html` - Função `updateDemandasPreview()` atualizada
- ✅ `index.html` - Função `updateDemandasSummary()` modificada
- ✅ `index.html` - CSS dos cards individuais adicionado

---

## ✨ Resultado Final

Agora o resumo de WhatsApp exibe cada demanda em um **card individual com botão de cópia próprio**, permitindo:

1. ✅ **Copiar apenas a demanda desejada**
2. ✅ **Compartilhar com contexto completo** (empresa + detalhes)
3. ✅ **Feedback visual imediato**
4. ✅ **Interface organizada e intuitiva**
5. ✅ **Agilidade na comunicação**

**Exemplo de card:**
```
┌─────────────────────────────────────┐
│ *ANDERSON KITCHEN & BATHROOM*       │
│ *📋 PLANEJAMENTO*                   │
│                                     │
│ 🔵 *Planejamento de campanhas*     │
│ 👤 Bruno | 📅 09/01/2026           │
│ 📝 https://short.link/abc123       │
│                                     │
│                    [📋 Copiar]      │
└─────────────────────────────────────┘
```

---

**Desenvolvido para MediaGrowth**  
*Comunicação ágil, tarefa por tarefa* 🎯📋
