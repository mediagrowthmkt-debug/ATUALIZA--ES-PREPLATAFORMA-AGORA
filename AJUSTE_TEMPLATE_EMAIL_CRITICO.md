# Ajuste Necessário: Template de Email para Notificações Críticas

**Data**: 04/01/2026  
**Status**: ✅ Frontend OK | ⚠️ Backend Precisa Ajuste | 🔧 Solução Temporária Aplicada  
**Arquivo**: Cloud Function `sendDailyNotifications`

---

## 🔧 Solução Temporária Aplicada (04/01/2026 18:45)

Como você **não tem acesso** ao código da Cloud Function agora, apliquei uma **solução alternativa**:

### Mudanças no Frontend (index.html):
```javascript
// ANTES:
icon: NOTIFICATION_CATEGORY_ICONS.demand,  // ⏰
title: 'Demanda atrasada',
message: `${title} está atrasada há ${overdueLabel}.`,

// AGORA:
icon: '🚨',
title: '🚨 URGENTE: Demanda Atrasada 🚨',
message: `⚠️ ${title} está atrasada há ${overdueLabel}. AÇÃO NECESSÁRIA!`,
```

### Resultado no Email:
```
┌────────────────────────────────────────────┐
│  🚨 URGENTE: Demanda Atrasada 🚨            │
│  ⚠️ revisar campanhas institucional google │
│  está atrasada há 1 dia. AÇÃO NECESSÁRIA!  │
│  Prazo: 04/01                              │
└────────────────────────────────────────────┘
```

**MESMO SEM COR VERMELHA**, agora é **impossível não notar** a demanda atrasada! 🎯

---

## 🎯 Problema Identificado

O **frontend está funcionando perfeitamente**:
- ✅ Widget detecta demanda atrasada (diffDays = -1)
- ✅ Widget marca como `severity: "critical"`
- ✅ Widget mostra em vermelho com pulse animation
- ✅ Frontend envia para Cloud Function com `severity: "critical"`

**Evidência do Console**:
```javascript
{
  "id": "demanda-85d9eb80-b7de-4740-b9aa-2eff01b11242-overdue",
  "category": "demand",
  "severity": "critical",  // ✅ CORRETO!
  "icon": "⏰",
  "title": "Demanda atrasada",
  "message": "revisar campanhas institucional google está atrasada há 1 dia.",
  "meta": "Prazo: 04/01"
}
```

**Mas o email recebido NÃO está em vermelho!** ❌

---

## 🔍 Diagnóstico

O problema está no **template do SendGrid** na Cloud Function. O template provavelmente só está tratando severidades `alert`, `warn` e `info`, mas não `critical`.

---

## 🛠️ Solução Necessária

### Localização
Arquivo: `functions/sendDailyNotifications/index.js` (ou similar)  
Função: `sendDailyNotifications`, `sendWeeklyNotifications`, `sendMonthlyNotifications`

### O que ajustar:

#### 1. **Adicionar cor para severity "critical" no template**

Procure por algo assim no código da Cloud Function:

```javascript
// ANTES (exemplo)
const severityColors = {
  alert: '#FFA500',  // Laranja
  warn: '#FFD700',   // Amarelo
  info: '#4169E1'    // Azul
};
```

**Adicione**:
```javascript
const severityColors = {
  critical: '#DC2626', // ✅ Vermelho para crítico
  alert: '#FFA500',    // Laranja
  warn: '#FFD700',     // Amarelo
  info: '#4169E1'      // Azul
};
```

#### 2. **Ajustar o HTML do email para critical**

Procure onde o template HTML é montado. Algo como:

```javascript
notifications.forEach(notif => {
  const color = severityColors[notif.severity] || '#666';
  const bgColor = notif.severity === 'alert' ? '#FFF3E0' : '#F5F5F5';
  
  html += `
    <div style="border-left: 4px solid ${color}; background: ${bgColor}; padding: 15px; margin: 10px 0;">
      <strong>${notif.title}</strong><br>
      ${notif.message}
    </div>
  `;
});
```

**Ajuste para**:
```javascript
notifications.forEach(notif => {
  const color = severityColors[notif.severity] || '#666';
  
  // ✅ Fundo vermelho escuro para critical
  let bgColor = '#F5F5F5'; // Padrão
  if(notif.severity === 'critical') bgColor = '#FEE2E2'; // Vermelho claro
  else if(notif.severity === 'alert') bgColor = '#FFF3E0'; // Laranja claro
  else if(notif.severity === 'warn') bgColor = '#FFFBEB';  // Amarelo claro
  
  // ✅ Adicionar ícone de alerta para critical
  const icon = notif.severity === 'critical' ? '🚨 ' : '';
  
  html += `
    <div style="
      border-left: 4px solid ${color}; 
      background: ${bgColor}; 
      padding: 15px; 
      margin: 10px 0;
      ${notif.severity === 'critical' ? 'box-shadow: 0 0 8px rgba(220,38,38,0.3);' : ''}
    ">
      <strong style="color: ${notif.severity === 'critical' ? '#991B1B' : '#333'};">
        ${icon}${notif.title}
      </strong><br>
      <span style="color: ${notif.severity === 'critical' ? '#991B1B' : '#666'};">
        ${notif.message}
      </span>
    </div>
  `;
});
```

#### 3. **Adicionar prioridade para critical**

Critical deve aparecer **PRIMEIRO** no email:

```javascript
// ✅ Ordenar por severidade antes de renderizar
const priorityOrder = { critical: 0, alert: 1, warn: 2, info: 3 };
notifications.sort((a, b) => {
  return (priorityOrder[a.severity] || 99) - (priorityOrder[b.severity] || 99);
});
```

---

## 📝 Exemplo Completo de Código Ajustado

```javascript
exports.sendDailyNotifications = functions.https.onRequest(async (req, res) => {
  try {
    const { test, testEmails, clientKey, userId, notifications } = req.body;
    
    console.log('📧 Recebendo', notifications.length, 'notificações');
    console.log('🔍 Críticas:', notifications.filter(n => n.severity === 'critical').length);
    
    // ✅ 1. DEFINIR CORES PARA CADA SEVERIDADE
    const severityColors = {
      critical: '#DC2626', // Vermelho
      alert: '#F59E0B',    // Laranja
      warn: '#EAB308',     // Amarelo
      info: '#3B82F6'      // Azul
    };
    
    const severityBgColors = {
      critical: '#FEE2E2', // Vermelho claro
      alert: '#FEF3C7',    // Laranja claro
      warn: '#FEF9C3',     // Amarelo claro
      info: '#DBEAFE'      // Azul claro
    };
    
    // ✅ 2. ORDENAR POR PRIORIDADE (CRITICAL PRIMEIRO)
    const priorityOrder = { critical: 0, alert: 1, warn: 2, info: 3 };
    notifications.sort((a, b) => {
      return (priorityOrder[a.severity] || 99) - (priorityOrder[b.severity] || 99);
    });
    
    // ✅ 3. GERAR HTML COM ESTILOS CORRETOS
    let notificationsHtml = '';
    notifications.forEach(notif => {
      const color = severityColors[notif.severity] || '#666';
      const bgColor = severityBgColors[notif.severity] || '#F5F5F5';
      const isCritical = notif.severity === 'critical';
      const icon = isCritical ? '🚨 ' : (notif.icon || '📌');
      
      notificationsHtml += `
        <div style="
          border-left: 4px solid ${color}; 
          background: ${bgColor}; 
          padding: 15px; 
          margin: 10px 0;
          border-radius: 4px;
          ${isCritical ? 'box-shadow: 0 0 8px rgba(220,38,38,0.3);' : ''}
        ">
          <strong style="
            color: ${isCritical ? '#991B1B' : '#333'};
            font-size: 16px;
            display: block;
            margin-bottom: 5px;
          ">
            ${icon} ${notif.title}
          </strong>
          <span style="
            color: ${isCritical ? '#7F1D1D' : '#666'};
            font-size: 14px;
            display: block;
            margin-bottom: 8px;
          ">
            ${notif.message}
          </span>
          ${notif.meta ? `
            <span style="
              color: ${isCritical ? '#991B1B' : '#999'};
              font-size: 12px;
              display: block;
            ">
              ${notif.meta}
            </span>
          ` : ''}
        </div>
      `;
    });
    
    // ✅ 4. ENVIAR EMAIL COM SENDGRID
    const msg = {
      to: testEmails,
      from: 'notificacoes@mediagrowth.com.br',
      subject: test ? '🧪 Teste: Notificações MediaGrowth' : '📊 Resumo Diário - MediaGrowth',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
          </style>
        </head>
        <body>
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">
              ${test ? '🧪 Email de Teste' : '📊 Resumo Diário'}
            </h2>
            <p style="color: #666;">
              Cliente: <strong>${clientKey}</strong><br>
              Data: ${new Date().toLocaleDateString('pt-BR')}
            </p>
            
            ${notificationsHtml}
            
            <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              MediaGrowth Dashboard • Gerado automaticamente
            </p>
          </div>
        </body>
        </html>
      `
    };
    
    await sgMail.send(msg);
    
    res.status(200).json({
      success: true,
      sent: true,
      emailsSent: testEmails,
      notificationsCount: notifications.length,
      criticalCount: notifications.filter(n => n.severity === 'critical').length
    });
    
  } catch (error) {
    console.error('❌ Erro:', error);
    res.status(500).json({ error: error.message });
  }
});
```

---

## 🎨 Cores Sugeridas

| Severidade | Borda | Fundo | Texto |
|-----------|-------|-------|-------|
| **critical** | `#DC2626` (vermelho) | `#FEE2E2` (vermelho claro) | `#991B1B` (vermelho escuro) |
| **alert** | `#F59E0B` (laranja) | `#FEF3C7` (laranja claro) | `#92400E` (laranja escuro) |
| **warn** | `#EAB308` (amarelo) | `#FEF9C3` (amarelo claro) | `#854D0E` (amarelo escuro) |
| **info** | `#3B82F6` (azul) | `#DBEAFE` (azul claro) | `#1E40AF` (azul escuro) |

---

## ✅ Checklist de Ajustes

- [ ] Adicionar cor `critical: '#DC2626'` ao objeto de cores
- [ ] Adicionar fundo `critical: '#FEE2E2'` ao objeto de fundos
- [ ] Adicionar ordenação por prioridade (critical primeiro)
- [ ] Adicionar box-shadow para notificações critical
- [ ] Adicionar ícone 🚨 para notificações critical
- [ ] Testar email com notificação critical
- [ ] Verificar se aparece em vermelho no Gmail/Outlook
- [ ] Verificar se aparece primeiro na lista

---

## 🧪 Como Testar Após Ajuste

1. **Deploy da Cloud Function** com as alterações
2. Na plataforma, ir em **Configurações → Notificações por Email**
3. Clicar em **"📨 Enviar email de teste"**
4. Verificar o email recebido:
   - [ ] Demanda "revisar campanhas institucional google" aparece **PRIMEIRO**
   - [ ] Está com **fundo vermelho claro**
   - [ ] Tem **borda vermelha** à esquerda
   - [ ] Texto está em **vermelho escuro**
   - [ ] Tem ícone **🚨**
   - [ ] Tem box-shadow vermelho

---

## 📊 Resultado Esperado no Email

```
┌────────────────────────────────────────────┐
│  🚨 Demanda atrasada                       │ ← Vermelho escuro
│  revisar campanhas institucional google    │ ← Vermelho escuro
│  está atrasada há 1 dia.                   │
│  Prazo: 04/01                             │ ← Vermelho médio
└────────────────────────────────────────────┘
  ↑ Fundo vermelho claro (#FEE2E2)
  ↑ Borda vermelha à esquerda (#DC2626)
  ↑ Box-shadow vermelho
```

---

## 🔧 Onde Fazer o Ajuste

**Local**: Firebase Console → Functions → `sendDailyNotifications`

**Ou via CLI**:
```bash
cd functions
# Editar index.js ou src/sendDailyNotifications.js
# Fazer os ajustes acima
firebase deploy --only functions:sendDailyNotifications
```

---

**Resumo**: Frontend 100% OK ✅ | Backend precisa ajustar template HTML para mostrar critical em vermelho! 🎨
