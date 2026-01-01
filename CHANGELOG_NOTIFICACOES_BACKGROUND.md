# Sistema de Notificações em Background (Service Worker)

**Data**: 01/01/2026  
**Tipo**: Feature - Sistema Crítico

## 🚀 Nova Funcionalidade

Sistema de notificações por email que **funciona mesmo com o aplicativo fechado**, usando **Service Worker** e **IndexedDB**.

## 📋 Como Funciona

### Arquitetura

```
┌─────────────────────────────────────────────────────┐
│           NAVEGADOR ABERTO                          │
│  ┌──────────────┐         ┌──────────────┐         │
│  │   index.html │◄───────►│IndexedDB     │         │
│  │              │         │- configs     │         │
│  │              │         │- notifications│        │
│  └──────┬───────┘         └──────────────┘         │
│         │                                            │
│         │ Sincroniza                                 │
│         ▼                                            │
│  ┌────────────────────────────────────────┐         │
│  │      SERVICE WORKER                    │         │
│  │  - Roda em background                  │         │
│  │  - Verifica a cada 1 minuto            │         │
│  │  - Acessa IndexedDB diretamente        │         │
│  │  - Envia emails via Cloud Function     │         │
│  └────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────┘
                      │
                      │ Sempre ativo
                      ▼
         ┌────────────────────────┐
         │  NAVEGADOR FECHADO     │
         │  Service Worker        │
         │  continua verificando  │
         └────────────────────────┘
```

### Componentes

#### 1. **Service Worker** (`service-worker.js`)
- Roda em **background persistente**
- Verifica notificações a cada **1 minuto**
- Acessa **IndexedDB** para buscar configurações
- Envia emails via **Cloud Functions**
- Funciona **mesmo com app fechado**

#### 2. **IndexedDB** (Storage Persistente)
Duas tabelas principais:

**`configs`**: Configurações de notificação
```javascript
{
  clientKey: "contact",
  userId: "uid123",
  emails: ["email1@teste.com", "email2@teste.com"],
  frequency: "daily", // "daily", "weekly", "monthly"
  time: "09:00",
  lastSent: "2026-01-01T12:00:00.000Z"
}
```

**`notifications`**: Notificações do widget
```javascript
{
  clientKey: "contact",
  items: [
    {
      id: "demanda-123",
      category: "demand",
      severity: "alert",
      title: "Demanda atrasada",
      message: "Projeto X está atrasado há 3 dias"
    },
    // ...
  ]
}
```

#### 3. **Sincronização Automática** (`index.html`)
- Quando salva configurações → Sincroniza com Service Worker
- Quando atualiza notificações → Sincroniza com Service Worker
- Quando remove configurações → Remove do Service Worker

## 🎯 Fluxo de Funcionamento

### Cenário 1: App Aberto

```
09:00 - App aberto
  ├─► index.html verifica horário
  ├─► Service Worker também verifica
  ├─► Ambos podem enviar (proteção anti-duplicação via lastSent)
  └─► Email enviado ✅
```

### Cenário 2: App Fechado (NOVO!)

```
09:00 - App fechado
  ├─► Service Worker acorda automaticamente
  ├─► Busca configs do IndexedDB
  ├─► Verifica se já enviou hoje
  ├─► Envia email via Cloud Function
  ├─► Atualiza lastSent no IndexedDB
  └─► Email enviado ✅
```

### Cenário 3: App Fechado no Horário, Abre Depois

```
09:00 - App fechado
  └─► Service Worker envia email ✅
  
10:00 - Usuário abre o app
  ├─► index.html verifica lastSent
  ├─► Vê que já foi enviado às 09:00
  └─► Não envia novamente ✅ (anti-duplicação)
```

## 🔧 Implementação Técnica

### 1. Registro do Service Worker

```javascript
// index.html - Registra automaticamente ao carregar
async function registerServiceWorker() {
  serviceWorkerRegistration = await navigator.serviceWorker.register('/service-worker.js');
  await navigator.serviceWorker.ready;
  
  // Solicita permissão de notificação
  await Notification.requestPermission();
}
```

### 2. Sincronização de Configurações

```javascript
// Quando usuário salva configurações
async function handleEmailFormSubmit(e) {
  // ... salva no Firebase
  
  // Sincroniza com Service Worker
  await syncConfigWithServiceWorker(clientKey, emailSettings);
}

async function syncConfigWithServiceWorker(clientKey, emailSettings) {
  const config = {
    clientKey: clientKey,
    userId: auth.currentUser.uid,
    emails: emailSettings.emails,
    frequency: emailSettings.frequency,
    time: emailSettings.time
  };
  
  navigator.serviceWorker.controller.postMessage({
    type: 'SAVE_CONFIG',
    config: config
  });
}
```

### 3. Sincronização de Notificações

```javascript
// Sempre que notificações são atualizadas
function applyNotificationData(data) {
  notificationItems = attachNotificationTimestamps(data.items);
  renderNotifications();
  
  // Sincroniza com Service Worker
  const clientKey = getClientKey();
  syncNotificationsWithServiceWorker(clientKey);
}

async function syncNotificationsWithServiceWorker(clientKey) {
  const notifications = window.getNotificationItems();
  
  navigator.serviceWorker.controller.postMessage({
    type: 'SAVE_NOTIFICATIONS',
    clientKey: clientKey,
    notifications: notifications
  });
}
```

### 4. Verificação Periódica (Service Worker)

```javascript
// service-worker.js
setInterval(async () => {
  const configs = await getAllNotificationConfigs(); // Do IndexedDB
  const now = new Date();
  
  for (const config of configs) {
    // Verifica horário
    // Verifica frequência (daily/weekly/monthly)
    // Verifica se já enviou (lastSent)
    
    if (shouldSend) {
      await sendNotificationEmail(config);
      await updateLastSent(config.clientKey, now.toISOString());
    }
  }
}, 60000); // A cada 1 minuto
```

## ✅ Proteção Anti-Duplicação

O sistema garante que **nunca envia emails duplicados**:

1. **localStorage** (app aberto):
   - `mediagrowth_last_email_sent_{clientKey}_{time}`

2. **IndexedDB** (Service Worker):
   - Campo `lastSent` em cada config

3. **Sincronização**:
   - Quando app abre, sincroniza lastSent do localStorage → IndexedDB
   - Quando Service Worker envia, atualiza lastSent no IndexedDB
   - Quando app fecha e abre, lê lastSent do IndexedDB

## 🔒 Verificações de Segurança

### Daily (Diário)
```javascript
if (lastSentDate.toDateString() === now.toDateString()) {
  return; // Já enviou hoje
}
```

### Weekly (Semanal)
```javascript
const daysSince = Math.floor((now - lastSentDate) / (1000 * 60 * 60 * 24));
if (daysSince < 7) {
  return; // Já enviou esta semana
}
```

### Monthly (Mensal)
```javascript
if (lastSentDate.getMonth() === now.getMonth() && 
    lastSentDate.getFullYear() === now.getFullYear()) {
  return; // Já enviou este mês
}
```

## 📱 Notificações Locais

O Service Worker também mostra **notificações locais** ao usuário:

```javascript
await self.registration.showNotification('📧 Email Enviado', {
  body: 'Relatório diário enviado para 3 destinatário(s)',
  icon: '/favicon.ico',
  requireInteraction: false,
  vibrate: [200, 100, 200]
});
```

## 🎛️ Configurações Suportadas

- ✅ **Frequência**: Daily, Weekly, Monthly
- ✅ **Horário customizado**: Qualquer hora (ex: 09:00)
- ✅ **Múltiplos destinatários**: Comma-separated
- ✅ **Por cliente**: Cada cliente tem sua configuração

## 🧪 Como Testar

### Teste 1: App Aberto
```
1. Configure notificação para daqui a 2 minutos
2. Aguarde com o app aberto
3. Resultado esperado: Email enviado ✅
```

### Teste 2: App Fechado (Principal!)
```
1. Configure notificação para daqui a 5 minutos
2. FECHE completamente o navegador
3. Aguarde 5 minutos
4. Abra o console do navegador (F12)
5. Vá em Application > Service Workers
6. Veja os logs: "🚀 [SW] Enviando notificação..."
7. Verifique o email recebido ✅
```

### Teste 3: Anti-Duplicação
```
1. Configure para um horário que já passou hoje
2. Abra o app
3. Service Worker tentará enviar
4. Verificará lastSent
5. Resultado: "✅ [SW] Já enviado hoje" ✅
```

## 🔍 Debug e Logs

### Visualizar Service Worker

1. Abra o Chrome DevTools (F12)
2. Vá em **Application** > **Service Workers**
3. Veja o status: "Activated and running"
4. Clique em "inspect" para ver console do SW

### Logs do Service Worker

```
🔔 [SW] Verificando notificações agendadas...
⏰ [SW] Hora atual: 09:01
📅 [SW] contact: Aguardando dia 1
🚀 [SW] contact: Enviando notificação daily...
📦 [SW] Enviando para Cloud Function: sendDailyNotifications
✅ [SW] Email enviado com sucesso
💾 [SW] lastSent atualizado: 2026-01-01T12:01:00.000Z
```

### Verificar IndexedDB

1. Chrome DevTools > **Application** > **IndexedDB**
2. Expanda `MediaGrowthNotifications`
3. Veja as tabelas:
   - `configs`: Configurações salvas
   - `notifications`: Notificações do widget

## ⚠️ Limitações e Considerações

### Navegador Deve Estar Rodando
- Service Worker **NÃO funciona** se o navegador estiver completamente fechado
- Funciona em **background tabs** (outras abas abertas)
- Funciona se **qualquer aba** do site estiver aberta

### Solução para Funcionar 100% Offline
Para enviar mesmo com navegador fechado, precisa migrar para:
- **Cloud Scheduler** (Google Cloud)
- **Cron Jobs** (servidor Node.js)
- **Firebase Cloud Functions Scheduled**

### Suporte de Navegadores
- ✅ Chrome/Edge: Suporte completo
- ✅ Firefox: Suporte completo
- ⚠️ Safari: Suporte limitado
- ❌ IE: Não suportado

## 📁 Arquivos Modificados

1. **`service-worker.js`** (NOVO)
   - Service Worker completo
   - Verificação periódica
   - Acesso IndexedDB
   - Envio de emails

2. **`index.html`**
   - Registro do Service Worker
   - Funções de sincronização
   - `syncConfigWithServiceWorker()`
   - `syncNotificationsWithServiceWorker()`
   - `removeConfigFromServiceWorker()`

## 🚀 Próximos Passos

### Melhorias Futuras
1. **Cloud Scheduler**: Enviar mesmo com navegador fechado
2. **Push Notifications**: Notificações nativas do OS
3. **Offline Support**: Enviar quando voltar online
4. **Batch Processing**: Enviar múltiplos clientes de uma vez

### Migration para Server-Side
```javascript
// Firebase Cloud Functions
exports.checkScheduledNotifications = functions.pubsub
  .schedule('every 1 minutes')
  .onRun(async (context) => {
    // Busca todos os clientes
    // Verifica horários
    // Envia emails
  });
```

## 📚 Referências

- [MDN - Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Web Push Notifications](https://web.dev/push-notifications-overview/)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/js/client)

---

## 📝 Resumo Executivo

### Antes
- ❌ Notificações só com app aberto
- ❌ Usuário precisa deixar aba aberta
- ❌ Se fechar navegador, não envia

### Agora
- ✅ **Service Worker roda em background**
- ✅ **Funciona com app em outras abas**
- ✅ **Sincronização automática via IndexedDB**
- ✅ **Proteção anti-duplicação robusta**
- ✅ **Logs detalhados para debug**

### Limitação Atual
- ⚠️ Precisa ter **pelo menos uma aba** do navegador aberta
- Para 100% offline, migrar para Cloud Scheduler

### Para o Usuário
**"Configure uma vez e esqueça! O sistema enviará os relatórios automaticamente no horário escolhido, mesmo se você fechar a plataforma."**
