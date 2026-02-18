# CHANGELOG: Fix Email Template - Severidade Critical

**Data:** 04/01/2026  
**Autor:** GitHub Copilot  
**Problema:** Email mostrando notificações críticas com cor azul (info) em vez de vermelho

---

## 🐛 Problema Identificado

O template de email na Cloud Function (`sendEmailNotifications.ts`) não reconhecia `severity: 'critical'` como uma severidade crítica. Apenas `'alert'` e `'danger'` eram tratados como críticos.

### Sintoma Visual
- **Widget local:** ✅ Mostrava notificação vermelha corretamente
- **Email recebido:** ❌ Mostrava notificação azul (cor de "info")
- **Contagem no resumo:** ❌ "0 Críticas" mesmo tendo 1 notificação crítica

### Logs do Frontend (corretos)
```
🔍 Notificações críticas: 1
📧 Detalhes das notificações críticas: [{
  titulo: "🚨 URGENTE: Demanda Atrasada 🚨",
  severidade: "critical"
}]
```

---

## ✅ Solução Implementada

### 1. Cloud Function (functions/src/sendEmailNotifications.ts)

**ANTES (linha ~32-33):**
```typescript
const alertCount = notifications.filter(n => n.severity === 'alert' || n.severity === 'danger').length;
// ...
const isAlert = sev === 'alert' || sev === 'danger';
```

**DEPOIS:**
```typescript
// CORRIGIDO: Adicionar 'critical' como severidade crítica (vermelho)
const criticalCount = notifications.filter(n => n.severity === 'critical' || n.severity === 'alert' || n.severity === 'danger').length;
// ...
const isCritical = sev === 'critical' || sev === 'alert' || sev === 'danger';
```

### 2. Frontend (index.html) - Melhorias Adicionais

Adicionado estilos explícitos no payload para futura compatibilidade:

```javascript
// Mapa de estilos para cada severidade
const severityStyles = {
  critical: { bg: '#FEE2E2', border: '#DC2626', text: '#991B1B', label: 'Crítica' },
  alert:    { bg: '#FFF3E0', border: '#F97316', text: '#C2410C', label: 'Alerta' },
  warn:     { bg: '#FFFBEB', border: '#F59E0B', text: '#92400E', label: 'Aviso' },
  info:     { bg: '#DBEAFE', border: '#3B82F6', text: '#1E40AF', label: 'Info' }
};

// Payload inclui:
notifications: notificationsWithStyles,
severityCounts: severityCounts,
severityStyles: severityStyles
```

---

## 🎨 Cores Aplicadas

| Severidade | Fundo | Borda | Texto |
|------------|-------|-------|-------|
| **critical** | `#FEE2E2` (vermelho claro) | `#DC2626` (vermelho) | `#991B1B` |
| **alert** | `#FEE2E2` (vermelho claro) | `#DC2626` (vermelho) | `#991B1B` |
| **warn** | `#FEF3C7` (amarelo claro) | `#FBBF24` (amarelo) | `#92400E` |
| **info** | `#F0F9FF` (azul claro) | `#60A5FA` (azul) | `#1E40AF` |

---

## 🚀 Deploy Realizado

```bash
cd functions
npm run build
firebase deploy --only functions:sendDailyNotifications,functions:sendWeeklyNotifications,functions:sendMonthlyNotifications
```

**Resultado:**
```
✔  functions[sendDailyNotifications(us-central1)] Successful update operation.
✔  functions[sendWeeklyNotifications(us-central1)] Successful update operation.
✔  functions[sendMonthlyNotifications(us-central1)] Successful update operation.
```

---

## 📧 Resultado Esperado no Email

### Card de Resumo
- **Críticas:** 1 (fundo vermelho gradiente)
- **Avisos:** 7 (fundo amarelo gradiente)
- **Informações:** 1 (fundo azul gradiente)

### Notificação Crítica
```html
<div style="background: #fee2e2; border-left: 4px solid #dc2626;">
  🚨 URGENTE: Demanda Atrasada 🚨
  ⚠️ revisar campanhas institucional google está atrasada há 1 dia. AÇÃO NECESSÁRIA!
</div>
```

---

## 🧪 Como Testar

1. Recarregue a página do dashboard
2. Vá em **Configurações > Notificações por Email**
3. Clique em **Enviar email de teste**
4. Verifique o email recebido:
   - Card "Críticas" deve mostrar **1**
   - A notificação de demanda atrasada deve ter **fundo vermelho claro** e **borda vermelha**

---

## 📁 Arquivos Modificados

| Arquivo | Tipo de Alteração |
|---------|-------------------|
| `functions/src/sendEmailNotifications.ts` | ✏️ Corrigido reconhecimento de `severity: 'critical'` |
| `index.html` (linha ~14100) | ➕ Adicionado `severityStyles` e `severityCounts` no payload |
| `index.html` (linha ~14420) | ➕ Adicionado `severityStyles` e `severityCounts` no payload (email automático) |

---

## 🔗 Referências

- Widget local já funcionava: `buildNotificationItems()` define `severity: 'critical'` para demandas atrasadas
- Problema era apenas no template de email da Cloud Function
- Correção alinha comportamento do email com o widget local
