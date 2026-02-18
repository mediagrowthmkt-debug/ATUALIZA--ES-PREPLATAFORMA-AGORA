# Changelog: Fix Notificações Críticas em Emails

**Data**: 04/01/2026  
**Tipo**: Bug Fix + Enhancement  
**Componente**: Sistema de Notificações por Email

## 📋 Resumo

Correção completa do sistema de detecção de demandas atrasadas (críticas) e implementação de logs detalhados para diagnóstico de envio de emails.

## 🐛 Problema Identificado

1. **Widget detectava corretamente** demandas atrasadas considerando horas
2. **Emails NÃO incluíam** essas demandas críticas
3. **Faltava diagnóstico** sobre o que estava sendo enviado aos emails

## ✅ Correções Implementadas

### 1. Detecção de Atraso Considerando Horário (Widget)
**Arquivo**: `index.html` (~linha 57561)

**Antes**:
```javascript
const diffDays = Math.ceil((due.getTime() - todayStart.getTime()) / msPerDay);
```

**Depois**:
```javascript
// ⏰ CORREÇÃO: Usar 'now' (momento atual) em vez de 'todayStart' (meia-noite)
// E usar Math.floor() em vez de Math.ceil() para que -0.4 dias = -1 (atrasado)
// Math.ceil(-0.4) = 0 ❌ | Math.floor(-0.4) = -1 ✅
const diffDays = Math.floor((due.getTime() - now.getTime()) / msPerDay);
```

**Resultado**: Demandas com prazo hoje às 11:58, vistas hoje às 18:22, agora são corretamente identificadas como atrasadas (diffDays = -1).

---

### 2. Logs Detalhados - Email de Teste
**Arquivo**: `index.html` (~linha 14116)

**Adicionado**:
```javascript
console.log('📦 [EMAIL TESTE] Payload completo:', JSON.stringify(payload, null, 2));
console.log('📦 [EMAIL TESTE] Total de notificações no payload:', payload.notifications.length);
console.log('📦 [EMAIL TESTE] Notificações por severidade:', {
  critical: payload.notifications.filter(n => n.severity === 'critical').length,
  alert: payload.notifications.filter(n => n.severity === 'alert').length,
  warn: payload.notifications.filter(n => n.severity === 'warn').length,
  info: payload.notifications.filter(n => n.severity === 'info').length
});
console.log('📡 [EMAIL TESTE] Status da resposta:', response.status, response.statusText);
console.log('✅ [EMAIL TESTE] Resposta completa da Cloud Function:', result);
```

**Benefício**: Ver exatamente quantas notificações críticas estão sendo enviadas no teste.

---

### 3. Logs Detalhados - Email Automático
**Arquivo**: `index.html` (~linha 14388)

**Adicionado**:
```javascript
console.log('📦 [EMAIL AUTOMÁTICO] Payload completo:', JSON.stringify(payload, null, 2));
console.log('📦 [EMAIL AUTOMÁTICO] Total de notificações no payload:', payload.notifications.length);
console.log('📦 [EMAIL AUTOMÁTICO] Notificações críticas no payload:', 
  payload.notifications.filter(n => n.severity === 'critical').length
);
console.log('📦 [EMAIL AUTOMÁTICO] Lista de severidades:', 
  payload.notifications.map(n => n.severity)
);
console.log('✅ [EMAIL AUTOMÁTICO] Resposta da Cloud Function:', result);
console.log('❌ [EMAIL AUTOMÁTICO] Status HTTP:', response.status);
console.log('❌ [EMAIL AUTOMÁTICO] Resposta de erro:', errorText);
```

**Benefício**: Rastrear exatamente o que está sendo enviado para a Cloud Function.

---

### 4. Logs de Verificação de Configuração
**Arquivo**: `index.html` (~linha 14306)

**Adicionado**:
```javascript
console.log('📄 Documento de configuração existe?', settingsDoc.exists());
console.log('⚙️ Configuração de email encontrada:', {
  emails: emails,
  frequency: frequency,
  time: time,
  configCompleta: emailConfig
});
```

**Benefício**: Verificar se as configurações de email estão corretas no Firebase.

---

### 5. Logs com Timestamp
**Arquivo**: `index.html` (~linha 14294)

**Adicionado**:
```javascript
const timestamp = new Date().toLocaleString('pt-BR');
console.log('🔔 [' + timestamp + '] Verificando notificações agendadas...');
```

**Benefício**: Saber exatamente quando a função de verificação está rodando.

---

### 6. Criação da Função `sendTestEmailViaBackend()`
**Arquivo**: `index.html` (~linha 14082)

**Criada nova função** que estava sendo chamada mas não existia:
```javascript
async function sendTestEmailViaBackend() {
  console.log('🧪 Iniciando envio de email de teste via Cloud Function');
  
  const widgetNotifications = window.getNotificationItems ? 
    window.getNotificationItems() : notificationItems || [];
  
  console.log('🔍 Notificações críticas:', 
    widgetNotifications.filter(n => n.severity === 'critical').length);
  
  // ... envia para Cloud Function com logs detalhados
}
```

**Benefício**: Email de teste agora funciona e mostra logs completos.

---

## 🔍 Como Diagnosticar Problemas

### 1. Verificar Widget
Abra o console e procure por:
```
🔔 [DEMANDA X] Título: "revisar campanhas institucional google"
📅 [DEMANDA X] Diferença de dias: -1
```
- Se `diffDays < 0` → Está atrasada ✅
- Se `diffDays >= 0` → Não está atrasada ❌

### 2. Verificar Email de Teste
Clique em "📨 Enviar email de teste" e procure no console:
```
📦 [EMAIL TESTE] Notificações por severidade: {
  critical: 1,  ← Deve ter pelo menos 1 se existe demanda atrasada
  alert: X,
  warn: X,
  info: X
}
```

### 3. Verificar Email Automático
A cada minuto, procure no console:
```
🔔 [04/01/2026, 18:30:00] Verificando notificações agendadas...
⚙️ Configuração de email encontrada: {
  emails: ["seu@email.com"],
  frequency: "daily",
  time: "09:00"
}
📦 [EMAIL AUTOMÁTICO] Notificações críticas no payload: 1
```

### 4. Verificar Resposta da Cloud Function
Procure por:
```
✅ [EMAIL AUTOMÁTICO] Resposta da Cloud Function: {
  sent: true,
  notificationsCount: 10,
  ...
}
```

Ou em caso de erro:
```
❌ [EMAIL AUTOMÁTICO] Status HTTP: 500
❌ [EMAIL AUTOMÁTICO] Resposta de erro: "Mensagem de erro"
```

---

## 📊 Fluxo Completo

```
1. buildNotificationItems()
   └─ Detecta demanda atrasada (diffDays < 0)
   └─ Define severity = 'critical'
   └─ Adiciona ao array de items
   
2. applyNotificationData(items)
   └─ Armazena em notificationItems
   
3. window.getNotificationItems()
   └─ Retorna notificationItems
   
4. sendScheduledNotifications() OU sendTestEmailViaBackend()
   └─ Chama window.getNotificationItems()
   └─ Filtra notificações críticas
   └─ Envia para Cloud Function
   └─ Logs detalhados em cada etapa
```

---

## 🧪 Como Testar

### Teste 1: Widget
1. Recarregue a página
2. Procure no console: `📅 [DEMANDA 23] Diferença de dias: -1`
3. Veja no widget: Notificação vermelha pulsando

### Teste 2: Email de Teste
1. Vá em Configurações → Notificações por Email
2. Configure um email
3. Clique em "📨 Enviar email de teste"
4. Verifique o console:
   - `📦 [EMAIL TESTE] Notificações críticas: 1`
5. Verifique o email recebido

### Teste 3: Email Automático
1. Configure horário para daqui a 2 minutos
2. Aguarde
3. Procure no console:
   - `🚀 Horário atingido!`
   - `📦 [EMAIL AUTOMÁTICO] Notificações críticas no payload: 1`
4. Verifique o email recebido

---

## 🎯 Resultado Esperado

- ✅ **Widget**: Mostra demandas atrasadas (mesmo por horas) como críticas (vermelhas/pulsando)
- ✅ **Email de Teste**: Inclui todas as notificações críticas do widget
- ✅ **Email Automático**: Inclui todas as notificações críticas do widget
- ✅ **Console**: Logs detalhados em cada etapa para diagnóstico

---

## 📝 Notas Técnicas

1. **`Math.floor()` vs `Math.ceil()`**:
   - `Math.ceil(-0.4)` = 0 (arredonda para cima, parece não atrasado)
   - `Math.floor(-0.4)` = -1 (arredonda para baixo, corretamente atrasado)

2. **`now` vs `todayStart`**:
   - `todayStart`: 04/01/2026 00:00:00 (meia-noite)
   - `now`: 04/01/2026 18:30:00 (momento atual)
   - Diferença: Permite detectar atraso dentro do mesmo dia

3. **Sincronização**:
   - Widget, email de teste e email automático usam a MESMA função: `window.getNotificationItems()`
   - Garantia de consistência total

---

## 🔧 Arquivos Modificados

- `index.html`: 
  - Linha ~57561: Correção do cálculo de diffDays
  - Linha ~14082: Criação de sendTestEmailViaBackend()
  - Linha ~14116: Logs detalhados email de teste
  - Linha ~14294: Logs com timestamp
  - Linha ~14306: Logs de configuração
  - Linha ~14388: Logs detalhados email automático

---

## ⚠️ Troubleshooting

### Problema: Widget mostra crítico mas email não
**Diagnóstico**:
```javascript
// No console, execute:
console.log('Notificações do widget:', window.getNotificationItems());
console.log('Críticas:', window.getNotificationItems().filter(n => n.severity === 'critical'));
```

### Problema: Email não está sendo enviado
**Diagnóstico**:
1. Procure no console: `⚠️ Nenhuma configuração de email encontrada`
2. Verifique se configurou email em: Configurações → Notificações por Email
3. Procure por: `❌ [EMAIL AUTOMÁTICO] Status HTTP: XXX`

### Problema: Cloud Function retorna erro
**Diagnóstico**:
1. Procure no console: `❌ [EMAIL TESTE] Resposta de erro: "..."`
2. Verifique se a Cloud Function está deployada
3. Verifique se o payload está correto: `📦 [EMAIL TESTE] Payload completo: {...}`

---

**Autor**: GitHub Copilot  
**Revisado por**: Bruno  
**Status**: ✅ Implementado e Testado
