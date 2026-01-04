# 🔔 Sistema de Notificações - Guia Visual

## 📊 Fluxo Completo

```
┌─────────────────────────────────────────────────────────────┐
│                    FONTE DE DADOS                           │
├─────────────────────────────────────────────────────────────┤
│  DEMANDAS  │  LEADS  │  POSTS  │  METAS  │  NOVOS ITENS   │
└──────┬──────────┬───────┬────────┬──────────┬──────────────┘
       │          │       │        │          │
       ▼          ▼       ▼        ▼          ▼
┌─────────────────────────────────────────────────────────────┐
│          buildNotificationItems()                           │
│  • Analisa prazos e status                                  │
│  • Calcula diferenças de datas                              │
│  • Determina severidade (alert/warn/info)                   │
│  • Captura data real de criação                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│       attachNotificationTimestamps()                        │
│  • Verifica se notificação já existe                        │
│  • Usa data real (demandaCreated, leadCreated, etc.)        │
│  • Fallback para Date.now() se necessário                   │
│  • Salva no localStorage                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              notificationItems[]                            │
│  Array com todas as notificações + timestamps              │
└──────────────┬───────────────────┬──────────────────────────┘
               │                   │
               ▼                   ▼
      ┌────────────────┐  ┌───────────────────┐
      │  WIDGET (UI)   │  │  SERVICE WORKER   │
      │  - Renderiza   │  │  - Salva IndexedDB│
      │  - Badge       │  │  - Envia Email    │
      │  - Click       │  │  - Background     │
      └────────────────┘  └──────┬────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │ CLOUD FUNCTION  │
                        │ - SendGrid      │
                        │ - HTML Email    │
                        └─────────────────┘
```

---

## 🎨 Widget de Notificações

### Estrutura Visual

```
╔════════════════════════════════════╗
║  🔔 NOTIFICAÇÕES (3)              ║
╠════════════════════════════════════╣
║                                    ║
║  ┌──────────────────────────────┐ ║
║  │ 🚨 ALERT (Vermelho)          │ ║
║  │ ⏰ Demanda atrasada           │ ║
║  │ Projeto X está atrasado há... │ ║
║  │ 📅 Registrado em 02/01/26     │ ║
║  │ [Ver demanda]                 │ ║
║  └──────────────────────────────┘ ║
║                                    ║
║  ┌──────────────────────────────┐ ║
║  │ ⚠️  WARN (Amarelo)            │ ║
║  │ ⏰ Prazo de demanda            │ ║
║  │ Reunião vence em 2 dias       │ ║
║  │ 📅 Registrado em 03/01/26     │ ║
║  │ [Ver demanda]                 │ ║
║  └──────────────────────────────┘ ║
║                                    ║
║  ┌──────────────────────────────┐ ║
║  │ ℹ️  INFO (Azul)               │ ║
║  │ 🎯 5 novos leads hoje         │ ║
║  │ João Silva, Maria...          │ ║
║  │ 📅 Registrado em 04/01/26     │ ║
║  │ [Ver leads]                   │ ║
║  └──────────────────────────────┘ ║
║                                    ║
╚════════════════════════════════════╝
```

### Badge de Contador

```
┌────────────┐
│  🔔  (3)   │  ← Vermelho = notificações não vistas
└────────────┘

Após clicar:
┌────────────┐
│  🔔        │  ← Sem badge = tudo visto
└────────────┘
```

---

## 📝 Tipos de Notificações

### 1. ⏰ Demandas

#### Atrasada (Alert - Vermelho)
```json
{
  "id": "demanda-abc123-overdue",
  "category": "demand",
  "severity": "alert",
  "icon": "⏰",
  "title": "Demanda atrasada",
  "message": "Projeto X está atrasada há 5 dias.",
  "meta": "Prazo: 30/12 • Responsável: João",
  "demandaCreated": 1704067200000,
  "action": { "section": "demandas" }
}
```

#### Próxima do Prazo (Warn - Amarelo)
```json
{
  "id": "demanda-abc123-2",
  "category": "demand",
  "severity": "warn",
  "title": "Prazo de demanda",
  "message": "Reunião vence em 2 dias.",
  "demandaCreated": 1704153600000
}
```

---

### 2. 📝 Posts

#### Pendentes de Aprovação (Alert - Vermelho) ✨ NOVO
```json
{
  "id": "posts-pending-approval-2026-01",
  "category": "posts",
  "severity": "alert",
  "icon": "📝",
  "title": "3 posts pendentes de aprovação",
  "message": "3 post(s) aguardando revisão no mês atual.",
  "meta": "Aguardando aprovação para publicação",
  "postCreated": 1704067200000,
  "action": { "section": "calendar" }
}
```

#### Status do Mês (Info)
```json
{
  "id": "posts-status-2026-01",
  "category": "posts",
  "severity": "info",
  "title": "Status dos posts do mês",
  "message": "5 aprovado(s) • 3 aguardando revisão",
  "meta": "Janeiro/2026"
}
```

---

### 3. 🎯 Leads

#### Hoje (Info) ✨ EXPANDIDO
```json
{
  "id": "new-leads-today-2026-01-04",
  "category": "leads",
  "severity": "info",
  "icon": "🎯",
  "title": "5 novos leads hoje",
  "message": "João Silva, Maria Costa, Pedro... + 2 mais",
  "meta": "• Fontes: Google, Instagram",
  "leadCreated": 1704345600000,
  "action": { "section": "leads" }
}
```

#### Mês Atual (Info) ✨ NOVO
```json
{
  "id": "new-leads-month-2026-01",
  "category": "leads",
  "severity": "info",
  "icon": "📊",
  "title": "127 lead(s) no mês atual",
  "message": "Total de leads recebidos em 2026-01.",
  "meta": "Acompanhe o desempenho do mês",
  "leadCreated": 1704067200000
}
```

#### Mês Passado (Info) ✨ NOVO
```json
{
  "id": "new-leads-last-month-2025-12",
  "category": "leads",
  "severity": "info",
  "icon": "📅",
  "title": "98 lead(s) no mês passado",
  "message": "Total de leads recebidos em 2025-12.",
  "meta": "Para comparação com o mês atual",
  "leadCreated": 1701388800000
}
```

---

### 4. 🎯 Metas

```json
{
  "id": "meta-risk-2026-01",
  "category": "meta",
  "severity": "warn",
  "icon": "🎯",
  "title": "2 metas em risco",
  "message": "Vendas: R$ 50k/R$ 100k • Leads: 60/150",
  "meta": "Revise as metas cadastradas para este mês."
}
```

---

### 5. 🆕 Novos Itens

```json
{
  "id": "new-links-15",
  "category": "item",
  "severity": "info",
  "icon": "🔗",
  "title": "Novos links",
  "message": "3 link(s) cadastrados recentemente.",
  "meta": "Total: 15"
}
```

---

## 📧 Email de Notificações

### Template HTML (Gerado Automaticamente)

```html
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif;">
  
  <!-- HEADER -->
  <div style="background: #f97316; color: white; padding: 20px;">
    <h1>🔔 Relatório de Notificações</h1>
    <p>04/01/2026 • Diário</p>
  </div>
  
  <!-- NOTIFICAÇÃO: Demanda Atrasada -->
  <div style="background: #fee2e2; padding: 16px; margin: 12px 0; 
              border-left: 4px solid #dc2626; border-radius: 8px;">
    <strong>⏰ Demanda atrasada</strong>
    <p>Projeto X está atrasada há 5 dias.</p>
    <small>Prazo: 30/12 • Responsável: João</small><br>
    <small>📅 Registrado em 02/01/2026 - 10:30</small>
  </div>
  
  <!-- NOTIFICAÇÃO: Posts Pendentes -->
  <div style="background: #fee2e2; padding: 16px; margin: 12px 0;
              border-left: 4px solid #dc2626; border-radius: 8px;">
    <strong>📝 3 posts pendentes de aprovação</strong>
    <p>3 post(s) aguardando revisão no mês atual.</p>
    <small>Aguardando aprovação para publicação</small><br>
    <small>📅 Registrado em 03/01/2026 - 14:15</small>
  </div>
  
  <!-- NOTIFICAÇÃO: Leads Hoje -->
  <div style="background: #f0f9ff; padding: 16px; margin: 12px 0;
              border-left: 4px solid #3b82f6; border-radius: 8px;">
    <strong>🎯 5 novos leads hoje</strong>
    <p>João Silva, Maria Costa, Pedro... + 2 mais</p>
    <small>• Fontes: Google, Instagram</small><br>
    <small>📅 Registrado em 04/01/2026 - 09:00</small>
  </div>
  
  <!-- NOTIFICAÇÃO: Leads do Mês -->
  <div style="background: #f0f9ff; padding: 16px; margin: 12px 0;
              border-left: 4px solid #3b82f6; border-radius: 8px;">
    <strong>📊 127 lead(s) no mês atual</strong>
    <p>Total de leads recebidos em 2026-01.</p>
    <small>Acompanhe o desempenho do mês</small>
  </div>
  
  <!-- FOOTER -->
  <div style="background: #f3f4f6; padding: 20px; margin-top: 20px;">
    <p>Este é um email automático. Para gerenciar suas notificações,
       acesse ⚙️ Configurações → Notificações</p>
  </div>
  
</body>
</html>
```

---

## 🔄 Sincronização Automática

### Fluxo de Dados

```
FRONTEND (index.html)
  ↓
  buildNotificationItems()
  ↓
  attachNotificationTimestamps()
  ↓
  notificationItems[] + createdAt
  ↓
  ├─→ renderNotifications() → WIDGET
  │
  └─→ syncNotificationsWithServiceWorker()
       ↓
       postMessage({ type: 'SAVE_NOTIFICATIONS' })
       ↓
    ┌──────────────────────┐
    │   SERVICE WORKER     │
    │  (service-worker.js) │
    └──────────────────────┘
       ↓
       IndexedDB.put({ clientKey, items: [...] })
       ↓
    ┌──────────────────────┐
    │   CLOUD FUNCTION     │
    │ sendDailyNotifications│
    └──────────────────────┘
       ↓
       IndexedDB.get(clientKey)
       ↓
       buildDashboardEmail(notifications)
       ↓
    ┌──────────────────────┐
    │      SENDGRID        │
    │   (Email Delivery)   │
    └──────────────────────┘
       ↓
    📧 Email recebido pelo usuário
```

---

## 🎯 Matriz de Severidade

| Tipo | Severidade | Cor | Ícone | Urgência |
|------|-----------|-----|-------|----------|
| Demanda atrasada | `alert` | 🔴 Vermelho | ⏰ | **ALTA** |
| Posts pendentes | `alert` | 🔴 Vermelho | 📝 | **ALTA** |
| Demanda próxima | `warn` | 🟡 Amarelo | ⏰ | Média |
| Metas em risco | `warn` | 🟡 Amarelo | 🎯 | Média |
| Meta de posts | `warn` | 🟡 Amarelo | 📝 | Média |
| Status posts | `info` | 🔵 Azul | 🗓️ | Baixa |
| Leads hoje | `info` | 🔵 Azul | 🎯 | Baixa |
| Leads mês | `info` | 🔵 Azul | 📊 | Baixa |
| Novos itens | `info` | 🔵 Azul | 🆕 | Baixa |

---

## 📅 Gestão de Timestamps

### Antes (Bugado ❌)
```javascript
// SEMPRE usava Date.now()
notificationCreatedMap[id] = Date.now(); 
item.createdAt = notificationCreatedMap[id];

// Resultado: TODAS notificações "Registrado hoje"
```

### Depois (Corrigido ✅)
```javascript
// Usa data REAL do item
let timestamp = now;

if(item.category === 'demand' && item.demandaCreated){
  timestamp = item.demandaCreated; // Data real da demanda
}
else if(item.category === 'leads' && item.leadCreated){
  timestamp = item.leadCreated; // Data real do lead
}

notificationCreatedMap[id] = timestamp;
item.createdAt = timestamp;

// Resultado: Data CORRETA de cada item!
```

---

## 🧪 Testes Visuais

### Teste 1: Widget com Múltiplas Notificações

```
┌─────────────────────────────────────┐
│ 🔔 (5)                             │ ← Badge vermelho
└─────────────────────────────────────┘
             ↓ CLICAR
┌─────────────────────────────────────┐
│ 🔔 NOTIFICAÇÕES                    │
├─────────────────────────────────────┤
│ 🚨 Demanda atrasada                │ ← Vermelho
│ 🚨 3 posts pendentes               │ ← Vermelho
│ ⚠️  Reunião vence em 2 dias        │ ← Amarelo
│ 🎯 5 novos leads hoje              │ ← Azul
│ 📊 127 leads no mês                │ ← Azul
└─────────────────────────────────────┘
```

### Teste 2: Email Recebido

```
┌────────────────────────────────────────┐
│ DE: MediaGrowth Dashboard              │
│ PARA: usuario@empresa.com              │
│ ASSUNTO: 🔔 Relatório Diário          │
├────────────────────────────────────────┤
│                                        │
│ 🔴 ALERTAS CRÍTICOS (2)               │
│ ⏰ Demanda atrasada                    │
│ 📝 3 posts pendentes de aprovação      │
│                                        │
│ 🟡 AVISOS (1)                          │
│ ⏰ Reunião vence em 2 dias             │
│                                        │
│ 🔵 INFORMAÇÕES (2)                     │
│ 🎯 5 novos leads hoje                  │
│ 📊 127 leads no mês atual              │
│                                        │
│ [Ver Dashboard] [Configurar]           │
└────────────────────────────────────────┘
```

---

## 🎨 CSS do Widget

```css
/* Cores de Severidade */
.notification-item.alert {
  background: #fee2e2;
  border-left: 4px solid #dc2626;
}

.notification-item.warn {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
}

.notification-item.info {
  background: #f0f9ff;
  border-left: 4px solid #3b82f6;
}

/* Badge */
#notificationBadge {
  background: #dc2626;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
}

/* Item não visto */
.notification-item.unseen {
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

---

## 📱 Responsividade

### Desktop (> 768px)
```
Widget: Canto inferior direito
Tamanho: 400px largura
Posição: fixed; bottom: 16px; right: 16px;
```

### Mobile (< 768px)
```
Widget: Fullscreen
Tamanho: 100vw
Posição: fixed; inset: 0;
```

---

## 🔐 Privacidade & Persistência

### LocalStorage (Frontend)
```javascript
// Chaves por cliente (multi-tenant)
mg_notifications_seen_v2_fernyboutique
mg_notification_counters_v1_fernyboutique
mg_notification_created_v1_fernyboutique
```

### IndexedDB (Service Worker)
```javascript
// Banco: MediaGrowth_SW
// Store: notifications
{
  clientKey: "fernyboutique",
  items: [ {...}, {...}, ... ],
  timestamp: 1704345600000
}
```

---

**🎯 Sistema completo e funcionando!**  
**📅 Data: 04/01/2026**  
**✅ Status: Produção**
