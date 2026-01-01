# 🚀 Deploy das Cloud Functions - Email Notifications

## 📋 Pré-requisitos

1. **Firebase CLI instalado**
   ```bash
   npm install -g firebase-tools
   ```

2. **Conta SendGrid** (gratuita até 100 emails/dia)
   - Criar conta em: https://signup.sendgrid.com/
   - Obter API Key em: Settings > API Keys > Create API Key

## 🔧 Passo 1: Instalar Dependências

```bash
cd functions
npm install
```

Isso instalará:
- `@sendgrid/mail` - Cliente SendGrid para envio de emails
- `firebase-admin` e `firebase-functions` (já instalados)

## 🔑 Passo 2: Configurar SendGrid

### Opção A: Via Firebase Config (Recomendado para Produção)

```bash
firebase functions:config:set sendgrid.apikey="SG.XXXXXXXXXXXXXXXXX"
firebase functions:config:set sendgrid.from="noreply@seudominio.com"
firebase functions:config:set sendgrid.fromname="MediaGrowth Platform"
```

### Opção B: Via Variáveis de Ambiente (Para testes locais)

Crie o arquivo `.env` na pasta `functions`:

```
SENDGRID_API_KEY=SG.XXXXXXXXXXXXXXXXX
```

## 🏗️ Passo 3: Compilar TypeScript

```bash
cd functions
npm run build
```

Isso compila `src/index.ts` → `lib/index.js`

## 🚀 Passo 4: Deploy das Functions

```bash
firebase deploy --only functions
```

Ou deploy de funções específicas:

```bash
firebase deploy --only functions:sendTestEmail
firebase deploy --only functions:sendDailyNotifications
firebase deploy --only functions:sendWeeklyNotifications
firebase deploy --only functions:sendMonthlyNotifications
```

## ⏰ Passo 5: Configurar Cloud Scheduler (Agendamento)

### Ativar Cloud Scheduler

1. Acesse: https://console.cloud.google.com/cloudscheduler
2. Selecione seu projeto Firebase
3. Ative a API do Cloud Scheduler

### Criar Jobs de Agendamento

**Job Diário (roda a cada hora):**
```bash
gcloud scheduler jobs create http daily-email-notifications \
  --schedule="0 * * * *" \
  --uri="https://REGIAO-SEU-PROJETO.cloudfunctions.net/sendDailyNotifications" \
  --http-method=POST \
  --time-zone="America/Sao_Paulo"
```

**Job Semanal (roda todo dia à meia-noite):**
```bash
gcloud scheduler jobs create http weekly-email-notifications \
  --schedule="0 0 * * *" \
  --uri="https://REGIAO-SEU-PROJETO.cloudfunctions.net/sendWeeklyNotifications" \
  --http-method=POST \
  --time-zone="America/Sao_Paulo"
```

**Job Mensal (roda todo dia à meia-noite):**
```bash
gcloud scheduler jobs create http monthly-email-notifications \
  --schedule="0 0 * * *" \
  --uri="https://REGIAO-SEU-PROJETO.cloudfunctions.net/sendMonthlyNotifications" \
  --http-method=POST \
  --time-zone="America/Sao_Paulo"
```

### Obter URL das Functions

Após o deploy, as URLs aparecerão no console. Exemplo:
```
https://us-central1-mediagrowth-abc123.cloudfunctions.net/sendDailyNotifications
```

## 🧪 Passo 6: Testar Localmente (Opcional)

### Testar com Emulador

```bash
cd functions
npm run serve
```

Isso inicia o emulador em: http://localhost:5001

### Testar sendTestEmail

No console do navegador (plataforma aberta):

```javascript
const functions = getFunctions();
const sendTestEmail = httpsCallable(functions, 'sendTestEmail');

sendTestEmail({
  clientKey: 'fernyboutique',
  testEmail: 'seu@email.com'
}).then(result => {
  console.log('Resultado:', result.data);
}).catch(err => {
  console.error('Erro:', err);
});
```

## 📊 Monitoramento

### Ver Logs das Functions

```bash
firebase functions:log
```

Ou logs específicos:

```bash
firebase functions:log --only sendTestEmail
firebase functions:log --only sendDailyNotifications
```

### Console do Firebase

1. Acesse: https://console.firebase.google.com
2. Vá em **Functions** no menu lateral
3. Veja execuções, erros e logs

### SendGrid Dashboard

- Acesse: https://app.sendgrid.com/email_activity
- Veja emails enviados, abertos, clicados

## ✅ Verificar Instalação

Após deploy, verifique:

1. **Functions deployadas:**
   ```
   ✔ sendTestEmail
   ✔ sendDailyNotifications
   ✔ sendWeeklyNotifications
   ✔ sendMonthlyNotifications
   ```

2. **Jobs do Scheduler criados:**
   ```bash
   gcloud scheduler jobs list
   ```

3. **SendGrid configurado:**
   ```bash
   firebase functions:config:get
   ```

## 🔧 Troubleshooting

### Erro: "SendGrid not configured"

- Verifique se a API key foi configurada:
  ```bash
  firebase functions:config:get sendgrid
  ```

### Erro: "Missing or insufficient permissions"

- Verifique as regras do Firestore
- Certifique-se que as collections existem

### Email não chega

1. Verifique spam/lixo eletrônico
2. Verifique SendGrid Activity
3. Verifique logs da function:
   ```bash
   firebase functions:log --only sendTestEmail
   ```

### Jobs não executam

1. Verifique se o Cloud Scheduler está ativado
2. Teste manualmente:
   ```bash
   gcloud scheduler jobs run daily-email-notifications
   ```

## 💰 Custos

- **Cloud Functions:** Grátis até 2M invocações/mês
- **Cloud Scheduler:** $0.10/job/mês (3 jobs = $0.30/mês)
- **SendGrid:** Grátis até 100 emails/dia, depois $19.95/mês

## 🎯 Próximos Passos

1. ✅ Instalar dependências (`npm install`)
2. ✅ Configurar SendGrid API key
3. ✅ Build (`npm run build`)
4. ✅ Deploy (`firebase deploy --only functions`)
5. ✅ Configurar Cloud Scheduler
6. ✅ Testar email de teste na plataforma

---

**Tempo estimado:** 15-20 minutos  
**Dificuldade:** Intermediária

Se precisar de ajuda, consulte:
- Documentação Firebase: https://firebase.google.com/docs/functions
- Documentação SendGrid: https://docs.sendgrid.com/
