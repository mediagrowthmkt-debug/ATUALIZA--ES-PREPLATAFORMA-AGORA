# 🚀 GUIA RÁPIDO: SendGrid Backend em 5 Minutos

## ✅ Checklist Completo

### 1️⃣ Criar Conta SendGrid (2 minutos)
- [ ] Acessar: https://signup.sendgrid.com/
- [ ] Usar email: **mediagrowthmkt@gmail.com**
- [ ] Confirmar email
- [ ] **Settings > Sender Authentication > Single Sender Verification**
- [ ] Verificar: **noreply@mediagrowthmkt.com**

### 2️⃣ Pegar API Key (1 minuto)
- [ ] **Settings > API Keys > Create API Key**
- [ ] Nome: `MediaGrowth Cloud Functions`
- [ ] Permissão: **Full Access** (ou Mail Send)
- [ ] **Copiar chave** (começa com `SG.`)

### 3️⃣ Upgrade Firebase (1 minuto)
- [ ] Acessar: https://console.firebase.google.com/project/mediagrowth-a5349/usage
- [ ] Clicar em **Upgrade**
- [ ] Escolher **Blaze Plan**
- [ ] Adicionar cartão (não será cobrado no início)

### 4️⃣ Configurar e Deploy (3 minutos)

Abra o terminal na pasta do projeto e execute:

```bash
# Executar script interativo
./setup-sendgrid.sh
```

**Opções do script:**
1. **Opção 1:** Configurar API Key
2. **Opção 2:** Compilar e Deploy
3. **Opção 5:** Configurar agendamento

---

## 📝 Comandos Manuais (Se Preferir)

### Configurar API Key
```bash
firebase functions:config:set sendgrid.apikey="SG.sua_chave_aqui"
```

### Compilar e Deploy
```bash
cd functions
npm run build
cd ..
firebase deploy --only functions
```

### Configurar Agendamento
```bash
# Diário às 9h
gcloud scheduler jobs create http daily-email-job \
  --schedule="0 12 * * *" \
  --uri="https://us-central1-mediagrowth-a5349.cloudfunctions.net/sendDailyNotifications" \
  --http-method=GET \
  --time-zone="America/Sao_Paulo" \
  --project=mediagrowth-a5349

# Semanal (segunda às 9h)
gcloud scheduler jobs create http weekly-email-job \
  --schedule="0 12 * * 1" \
  --uri="https://us-central1-mediagrowth-a5349.cloudfunctions.net/sendWeeklyNotifications" \
  --http-method=GET \
  --time-zone="America/Sao_Paulo" \
  --project=mediagrowth-a5349

# Mensal (dia 1 às 9h)
gcloud scheduler jobs create http monthly-email-job \
  --schedule="0 12 1 * *" \
  --uri="https://us-central1-mediagrowth-a5349.cloudfunctions.net/sendMonthlyNotifications" \
  --http-method=GET \
  --time-zone="America/Sao_Paulo" \
  --project=mediagrowth-a5349
```

---

## 🧪 Testar

### Teste Manual (via navegador)
Abra no navegador:
```
https://us-central1-mediagrowth-a5349.cloudfunctions.net/sendDailyNotifications
```

Deve retornar JSON:
```json
{
  "success": true,
  "sent": 0,
  "errors": 0
}
```

### Teste via Terminal
```bash
curl https://us-central1-mediagrowth-a5349.cloudfunctions.net/sendDailyNotifications
```

### Ver Logs
```bash
firebase functions:log --only sendDailyNotifications
```

---

## 📊 Dashboard: Salvar Configuração de Email

No seu código HTML, quando o usuário configurar:

```javascript
// Salvar configuração no Firestore
await firebase.firestore()
  .collection('usuarios').doc(currentUserUid)
  .collection('clients').doc(clientKey)
  .update({
    emailNotifications: {
      enabled: true,
      frequency: 'daily',  // 'daily' | 'weekly' | 'monthly'
      emails: [
        'cliente@email.com',
        'gestor@email.com'
      ]
    }
  });
```

**Estrutura no Firestore:**
```
usuarios/
  └─ {uid}/
      └─ clients/
          └─ {clientKey}/
              ├─ nomeCliente: "Cliente Teste"
              └─ emailNotifications:
                  ├─ enabled: true
                  ├─ frequency: "daily"
                  └─ emails: ["email1", "email2"]
```

---

## ⚙️ Horários (Cron)

- **Diário:** `0 12 * * *` = Todo dia às 12:00 UTC (9h BRT)
- **Semanal:** `0 12 * * 1` = Segunda-feira às 12:00 UTC (9h BRT)
- **Mensal:** `0 12 1 * *` = Dia 1 de cada mês às 12:00 UTC (9h BRT)

**Alterar horário:**
- Editar no Google Cloud Console
- https://console.cloud.google.com/cloudscheduler?project=mediagrowth-a5349

---

## 🐛 Problemas Comuns

### Deploy dando timeout
**Solução 1:** Lazy loading já implementado
**Solução 2:** Deploy individual
```bash
firebase deploy --only functions:sendDailyNotifications
firebase deploy --only functions:sendWeeklyNotifications
firebase deploy --only functions:sendMonthlyNotifications
```

### Emails não enviando
**Checklist:**
- [ ] SendGrid API Key configurada
- [ ] Sender verificado no SendGrid
- [ ] Firebase Blaze Plan ativo
- [ ] Cloud Scheduler habilitado
- [ ] `emailNotifications.enabled = true` no Firestore

### Ver erro detalhado
```bash
firebase functions:log --only sendDailyNotifications --limit 50
```

---

## 💰 Custos

### SendGrid
- **Gratuito:** 100 emails/dia ✅
- **Pago:** $14.95/mês (50k emails)

### Firebase Blaze Plan
- **Gratuito:** Primeiras 2M invocações ✅
- **Este projeto:** ~3k invocações/mês = **$0.00**

---

## 📞 Links Úteis

- **SendGrid Dashboard:** https://app.sendgrid.com/
- **Firebase Console:** https://console.firebase.google.com/project/mediagrowth-a5349
- **Cloud Scheduler:** https://console.cloud.google.com/cloudscheduler?project=mediagrowth-a5349
- **Logs:** https://console.firebase.google.com/project/mediagrowth-a5349/functions/logs

---

## 🎯 Resultado Final

Após configuração completa:

✅ Emails automáticos 24/7
✅ Funciona com dashboard fechado
✅ Cada usuário recebe no seu horário
✅ Logs centralizados
✅ Estatísticas no SendGrid
✅ **100% backend**

---

**Dúvidas? Execute: `./setup-sendgrid.sh` e siga o wizard! 🚀**
