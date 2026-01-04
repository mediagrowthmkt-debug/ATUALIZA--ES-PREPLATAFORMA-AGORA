# Fix: Notificações Críticas - Widget e Email

**Data**: 04/01/2026 21:47  
**Tipo**: Bugfix + Enhancement  
**Prioridade**: Alta

---

## 🎯 Problema Resolvido

### 1. Widget do Dashboard (✅ RESOLVIDO)
- **Antes**: Card "Críticas" mostrava "0" mesmo com demandas atrasadas
- **Agora**: Card "Críticas" conta corretamente notificações com `severity: 'critical'`

### 2. Email de Notificações (⚠️ PARCIALMENTE RESOLVIDO)
- **Antes**: Demanda atrasada aparecia como "Demanda atrasada" sem destaque
- **Agora**: Aparece como **"🚨 URGENTE: Demanda Atrasada 🚨"** com ícone 🚨 e texto "AÇÃO NECESSÁRIA!"
- **Ainda falta**: Cor vermelha no fundo (precisa ajustar Cloud Function)

---

## 🔧 Mudanças Implementadas

### 1. **Cartões de Resumo no Widget** (index.html ~linha 65148)

**Adicionado HTML**:
```html
<div class="notification-summary">
  <div id="notifCountCritical">
    <div>0</div>
    <div>Críticas</div>
  </div>
  <div id="notifCountWarn">
    <div>0</div>
    <div>Avisos</div>
  </div>
  <div id="notifCountInfo">
    <div>0</div>
    <div>Informações</div>
  </div>
</div>
```

**Cores dos Cards**:
- **Críticas**: Gradiente vermelho (#fee2e2 → #fecaca)
- **Avisos**: Gradiente amarelo (#fef3c7 → #fde68a)
- **Informações**: Gradiente azul (#dbeafe → #bfdbfe)

### 2. **Função de Atualização dos Contadores** (index.html ~linha 58125)

```javascript
function updateNotificationSummaryCounts(critical, warn, info){
  const criticalCard = document.getElementById('notifCountCritical');
  const warnCard = document.getElementById('notifCountWarn');
  const infoCard = document.getElementById('notifCountInfo');
  
  if(criticalCard){
    const num = criticalCard.querySelector('div:first-child');
    if(num) num.textContent = String(critical);
  }
  if(warnCard){
    const num = warnCard.querySelector('div:first-child');
    if(num) num.textContent = String(warn);
  }
  if(infoCard){
    const num = infoCard.querySelector('div:first-child');
    if(num) num.textContent = String(info);
  }
}
```

### 3. **Contagem de Severidades** (index.html ~linha 58065)

**Modificado `renderNotifications()` para contar**:
```javascript
const criticalCount = notificationItems.filter(i => i.severity === 'critical').length;
const warnCount = notificationItems.filter(i => i.severity === 'warn' || i.severity === 'alert').length;
const infoCount = notificationItems.filter(i => i.severity === 'info').length;
updateNotificationSummaryCounts(criticalCount, warnCount, infoCount);
```

### 4. **Título e Mensagem Mais Visíveis para Críticas** (index.html ~linha 57715)

**Antes**:
```javascript
icon: NOTIFICATION_CATEGORY_ICONS.demand,  // ⏰
title: 'Demanda atrasada',
message: `${title} está atrasada há ${overdueLabel}.`,
```

**Agora**:
```javascript
icon: '🚨',
title: '🚨 URGENTE: Demanda Atrasada 🚨',
message: `⚠️ ${title} está atrasada há ${overdueLabel}. AÇÃO NECESSÁRIA!`,
```

---

## 🎨 Resultado Visual

### Widget do Dashboard
```
┌────────────────────────────────────────────────────┐
│  🔔 Notificações                                    │
├────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │    1     │  │    7     │  │    1     │        │
│  │ Críticas │  │  Avisos  │  │Informações│        │
│  └──────────┘  └──────────┘  └──────────┘        │
│     (vermelho)    (amarelo)      (azul)           │
├────────────────────────────────────────────────────┤
│  🚨 URGENTE: Demanda Atrasada 🚨                   │
│  ⚠️ revisar campanhas institucional google        │
│  está atrasada há 1 dia. AÇÃO NECESSÁRIA!         │
│  Prazo: 04/01                                      │
└────────────────────────────────────────────────────┘
```

### Email Recebido
```
┌────────────────────────────────────────────────────┐
│  🚨 URGENTE: Demanda Atrasada 🚨                   │
│  ⚠️ revisar campanhas institucional google        │
│  está atrasada há 1 dia. AÇÃO NECESSÁRIA!         │
│  Prazo: 04/01                                      │
└────────────────────────────────────────────────────┘
```

**OBS**: No email, ainda falta o **fundo vermelho** porque a Cloud Function precisa ser atualizada para reconhecer `severity: 'critical'` e aplicar CSS especial.

---

## ✅ Checklist de Validação

- [x] Widget mostra "1" no card "Críticas" quando há demanda atrasada
- [x] Widget mostra "0" no card "Críticas" quando não há demandas atrasadas
- [x] Contadores de "Avisos" e "Informações" funcionam corretamente
- [x] Notificação crítica tem ícone 🚨
- [x] Notificação crítica tem título "🚨 URGENTE: Demanda Atrasada 🚨"
- [x] Notificação crítica tem mensagem com "⚠️" e "AÇÃO NECESSÁRIA!"
- [x] Email recebe a notificação com o novo título e mensagem
- [ ] Email mostra notificação crítica com fundo vermelho (precisa Cloud Function)

---

## 🚀 Próximos Passos

### Para Completar o Fix:

**Atualizar Cloud Function** (sendDailyNotifications):

```javascript
// Em functions/src/sendEmailNotifications.ts (linha ~35)

// ADICIONAR:
const severityStyles = {
  critical: {
    bg: '#fee2e2',
    border: '#dc2626',
    textColor: '#991b1b'
  },
  alert: {
    bg: '#fef3c7',
    border: '#d97706',
    textColor: '#92400e'
  },
  warn: {
    bg: '#fef3c7',
    border: '#d97706',
    textColor: '#92400e'
  },
  info: {
    bg: '#dbeafe',
    border: '#2563eb',
    textColor: '#1e40af'
  }
};

// MODIFICAR HTML de cada notificação:
notifications.forEach(item => {
  const style = severityStyles[item.severity] || severityStyles.info;
  const isCritical = item.severity === 'critical';
  
  html += `
    <div style="
      background: ${style.bg};
      border-left: 4px solid ${style.border};
      padding: 16px;
      margin: 12px 0;
      border-radius: 8px;
      ${isCritical ? 'box-shadow: 0 0 8px rgba(220,38,38,0.4);' : ''}
    ">
      <div style="font-size: 24px; margin-bottom: 8px;">
        ${item.icon || '🔔'}
      </div>
      <div style="font-weight: bold; color: ${style.textColor}; font-size: 16px; margin-bottom: 4px;">
        ${item.title}
      </div>
      <div style="color: ${style.textColor}; font-size: 14px;">
        ${item.message}
      </div>
      ${item.meta ? `<div style="color: ${style.textColor}; font-size: 12px; margin-top: 6px;">${item.meta}</div>` : ''}
    </div>
  `;
});
```

---

## 📊 Impacto

### Antes:
- ❌ Widget: "0 Críticas" (mesmo com demanda atrasada)
- ❌ Email: "Demanda atrasada" (sem destaque)
- ❌ Difícil identificar urgência

### Agora:
- ✅ Widget: "1 Críticas" (conta corretamente)
- ✅ Email: "🚨 URGENTE: Demanda Atrasada 🚨 ⚠️ AÇÃO NECESSÁRIA!"
- ✅ Impossível não notar demandas críticas
- ⚠️ Fundo vermelho no email ainda precisa Cloud Function

---

## 🔍 Como Testar

1. **Marcar demanda como atrasada**:
   - Ir em "Demandas"
   - Criar demanda com prazo no passado
   - NÃO marcar como concluída

2. **Verificar Widget**:
   - Abrir painel de notificações (🔔)
   - Card "Críticas" deve mostrar "1"
   - Notificação deve aparecer com:
     * Fundo vermelho claro com animação pulse
     * Ícone 🚨
     * Título "🚨 URGENTE: Demanda Atrasada 🚨"
     * Mensagem "⚠️ [nome] está atrasada há X dia(s). AÇÃO NECESSÁRIA!"

3. **Verificar Email de Teste**:
   - Ir em Configurações → Notificações por Email
   - Clicar em "📨 Enviar email de teste"
   - Verificar inbox:
     * Título deve ser "🚨 URGENTE: Demanda Atrasada 🚨"
     * Mensagem deve ter "⚠️" e "AÇÃO NECESSÁRIA!"
     * (Fundo vermelho só após atualizar Cloud Function)

4. **Marcar como concluída**:
   - Concluir a demanda
   - Widget deve voltar para "0 Críticas"
   - Notificação crítica deve sumir

---

## 📁 Arquivos Modificados

1. **index.html**:
   - Linha ~57715: Mudança de título/ícone/mensagem de notificações críticas
   - Linha ~58065: Adicionada contagem de severidades em `renderNotifications()`
   - Linha ~58125: Nova função `updateNotificationSummaryCounts()`
   - Linha ~65148: Adicionados cartões de resumo HTML no widget

---

## 📝 Observações

### Solução Temporária
A mudança de título e ícone é uma **solução temporária** enquanto você não tem acesso para atualizar a Cloud Function. Funciona perfeitamente para chamar atenção, mas o ideal é também ter o fundo vermelho no email.

### Quando Atualizar Cloud Function
Quando tiver acesso, siga o código de exemplo na seção "Próximos Passos" acima. O código já está pronto, basta copiar e colar no arquivo correto.

### Contadores Dinâmicos
Os cartões de "Críticas", "Avisos" e "Informações" atualizam automaticamente sempre que:
- Nova notificação é adicionada
- Notificação é removida
- Demanda muda de status
- Usuário abre o painel de notificações

---

## 🎉 Resumo Executivo

**Widget**: ✅ Funcionando 100%  
**Email - Texto**: ✅ Funcionando 100% (muito visível agora!)  
**Email - Fundo vermelho**: ⏳ Aguardando atualização da Cloud Function

**Usuário consegue identificar demandas críticas?** ✅ **SIM, perfeitamente!**
