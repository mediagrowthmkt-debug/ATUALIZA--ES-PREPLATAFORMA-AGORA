# 📧 Tutorial Completo: SendGrid no Backend (Cloud Functions)

## 🎯 O que vamos fazer

Configurar o SendGrid para enviar emails automaticamente **direto do servidor**, sem depender do navegador estar aberto.

---

## 📋 Pré-requisitos

- ✅ Projeto Firebase configurado (mediagrowth-a5349)
- ✅ Cloud Functions já criadas (código pronto)
- ⚠️ **Firebase Blaze Plan** (necessário para Cloud Functions)
- ⚠️ **Conta SendGrid** (gratuita)

---

## 🚀 PASSO 1: Criar Conta SendGrid (GRATUITA)

### 1.1 Registrar-se
1. Acesse: https://signup.sendgrid.com/
2. Preencha o formulário:
   - **Email:** mediagrowthmkt@gmail.com
   - **First Name:** MediaGrowth
   - **Last Name:** Platform
   - **Company:** MediaGrowth
   - **Website:** mediagrowthmkt.web.app
   - **País:** Brazil

3. Confirme o email que receberá

### 1.2 Verificar Email de Remetente
Após criar a conta, você precisa verificar o email que vai aparecer como remetente:

1. No SendGrid Dashboard, vá em: **Settings > Sender Authentication**
2. Clique em **Single Sender Verification**
3. Adicione o email: **noreply@mediagrowthmkt.com** (ou outro que preferir)
4. Você receberá um email de confirmação - clique no link
5. ✅ Email verificado!

> **Nota:** SendGrid gratuito permite enviar **100 emails/dia** - suficiente para notificações!

---

## 🔑 PASSO 2: Criar API Key no SendGrid

### 2.1 Gerar API Key
1. No SendGrid Dashboard: **Settings > API Keys**
2. Clique em **Create API Key**
3. Configure:
   - **API Key Name:** `MediaGrowth Cloud Functions`
   - **API Key Permissions:** Selecione **Full Access** (ou apenas Mail Send)
4. Clique em **Create & View**
5. **COPIE A CHAVE AGORA!** (ela aparece uma vez só)

A chave será algo como:
```
SG.xxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

### 2.2 Guardar a Chave com Segurança
⚠️ **NUNCA** coloque a API Key diretamente no código!
⚠️ **NUNCA** faça commit da API Key no Git!

Vamos usar variáveis de ambiente do Firebase.

---

## ⚙️ PASSO 3: Configurar Firebase Cloud Functions

### 3.1 Upgrade para Blaze Plan (Necessário)

As Cloud Functions **só funcionam no plano Blaze** (pago). Mas é barato:

1. Acesse: https://console.firebase.google.com/project/mediagrowth-a5349/usage
2. Clique em **Upgrade**
3. Selecione **Blaze Plan (Pay as you go)**
4. Adicione um cartão de crédito

**Custos Estimados:**
- Primeiras 2 milhões de invocações: **GRÁTIS**
- Enviar 100 emails/dia ≈ 3000 invocações/mês
- **Custo real: $0.00** (dentro do free tier)
- Você só paga se ultrapassar os limites gratuitos

### 3.2 Configurar API Key no Firebase

Abra o terminal e execute:

```bash
# Navegar para a pasta do projeto
cd "/Users/bruno/Documents/DJSXVC/DASHBOARD MEDIAGROWHT/ATUALIZAÇÕES PREPLATAFORMA AGORA"

# Configurar a API Key do SendGrid
firebase functions:config:set sendgrid.apikey="SG.sua_chave_aqui"
```

**Exemplo real:**
```bash
firebase functions:config:set sendgrid.apikey="SG.xxxxxxxxxxx.yyyyyyyyyyyy"
```

### 3.3 Verificar Configuração

```bash
# Ver todas as configurações
firebase functions:config:get
```

Deve retornar algo como:
```json
{
  "sendgrid": {
    "apikey": "SG.xxxxxxxxxxx.yyyyyyyyyyyy"
  }
}
```

✅ Configuração salva no servidor Firebase!

---

## 📦 PASSO 4: Deploy das Cloud Functions

### 4.1 Compilar TypeScript

```bash
cd functions
npm run build
```

Deve compilar sem erros.

### 4.2 Fazer Deploy

```bash
cd ..
firebase deploy --only functions
```

**Aguarde 2-5 minutos.** O Firebase vai:
- Subir o código para o servidor
- Instalar dependências (@sendgrid/mail)
- Criar 6 Cloud Functions:
  - ✅ `becomeAgency`
  - ✅ `receiveLead`
  - ✅ `sendDailyNotifications` ⬅️ NOVA
  - ✅ `sendWeeklyNotifications` ⬅️ NOVA
  - ✅ `sendMonthlyNotifications` ⬅️ NOVA
  - ✅ `sendTestEmail` ⬅️ NOVA

### 4.3 Ver URLs das Funções

Após deploy, você verá as URLs:
```
Function URL (sendDailyNotifications): https://us-central1-mediagrowth-a5349.cloudfunctions.net/sendDailyNotifications
Function URL (sendWeeklyNotifications): https://us-central1-mediagrowth-a5349.cloudfunctions.net/sendWeeklyNotifications
Function URL (sendMonthlyNotifications): https://us-central1-mediagrowth-a5349.cloudfunctions.net/sendMonthlyNotifications
```

**Copie essas URLs!** Vamos usá-las para agendar os emails.

---

## 🧪 PASSO 5: Testar Manualmente

### 5.1 Teste 1: Chamar Função Manualmente

Abra o navegador e acesse a URL da função diária:
```
https://us-central1-mediagrowth-a5349.cloudfunctions.net/sendDailyNotifications
```

Deve retornar:
```json
{
  "success": true,
  "sent": 0,
  "errors": 0
}
```

> **sent: 0** é normal se você ainda não configurou emails no dashboard!

### 5.2 Teste 2: Via Terminal (cURL)

```bash
curl https://us-central1-mediagrowth-a5349.cloudfunctions.net/sendDailyNotifications
```

### 5.3 Ver Logs

```bash
firebase functions:log --only sendDailyNotifications
```

Deve mostrar:
```
🔔 Iniciando envio de notificações diárias...
Processando usuário: XYZ
Verificando cliente: ABC
```

---

## ⏰ PASSO 6: Automatizar com Cloud Scheduler

Agora vamos agendar para enviar automaticamente todo dia!

### 6.1 Habilitar Cloud Scheduler API

1. Acesse: https://console.cloud.google.com/cloudscheduler?project=mediagrowth-a5349
2. Clique em **Enable API**

### 6.2 Criar Job Diário

```bash
# Job diário às 9h (horário de Brasília = UTC-3, então 12:00 UTC)
gcloud scheduler jobs create http daily-email-job \
  --schedule="0 12 * * *" \
  --uri="https://us-central1-mediagrowth-a5349.cloudfunctions.net/sendDailyNotifications" \
  --http-method=GET \
  --time-zone="America/Sao_Paulo" \
  --project=mediagrowth-a5349
```

### 6.3 Criar Job Semanal (Segunda-feira às 9h)

```bash
gcloud scheduler jobs create http weekly-email-job \
  --schedule="0 12 * * 1" \
  --uri="https://us-central1-mediagrowth-a5349.cloudfunctions.net/sendWeeklyNotifications" \
  --http-method=GET \
  --time-zone="America/Sao_Paulo" \
  --project=mediagrowth-a5349
```

### 6.4 Criar Job Mensal (Dia 1 às 9h)

```bash
gcloud scheduler jobs create http monthly-email-job \
  --schedule="0 12 1 * *" \
  --uri="https://us-central1-mediagrowth-a5349.cloudfunctions.net/sendMonthlyNotifications" \
  --http-method=GET \
  --time-zone="America/Sao_Paulo" \
  --project=mediagrowth-a5349
```

### 6.5 Ver Jobs Criados

1. Acesse: https://console.cloud.google.com/cloudscheduler?project=mediagrowth-a5349
2. Você verá os 3 jobs agendados
3. Pode testar clicando em **Run Now**

---

## 🎨 PASSO 7: Configurar Dashboard para Usar Backend

### 7.1 Estrutura de Dados no Firestore

Para que o backend envie emails, cada cliente precisa ter esta configuração:

```
usuarios/{uid}/clients/{clientKey}/
  ├─ nomeCliente: "Cliente Teste"
  └─ emailNotifications: {
       enabled: true,
       frequency: "daily",      // "daily" | "weekly" | "monthly"
       emails: [
         "cliente@email.com",
         "gestor@email.com"
       ]
     }
```

### 7.2 Salvar Configuração no Dashboard

No seu código HTML, quando o usuário configurar emails, salve assim:

```javascript
async function saveEmailSettings() {
  const clientKey = getClientKey();
  const frequency = document.getElementById('emailFrequency').value;
  const emailsText = document.getElementById('emailsList').value;
  const emails = emailsText.split('\n').map(e => e.trim()).filter(e => e);
  
  await firebase.firestore()
    .collection('usuarios').doc(firebase.auth().currentUser.uid)
    .collection('clients').doc(clientKey)
    .update({
      emailNotifications: {
        enabled: true,
        frequency: frequency,  // "daily", "weekly", "monthly"
        emails: emails
      }
    });
  
  alert('Configurações de email salvas! Você receberá notificações automaticamente.');
}
```

---

## 📊 PASSO 8: Monitoramento

### 8.1 Ver Logs em Tempo Real

```bash
firebase functions:log --only sendDailyNotifications
```

### 8.2 Ver Status no SendGrid

1. Acesse: https://app.sendgrid.com/
2. Vá em **Activity**
3. Você verá todos os emails enviados, abertos, clicados

### 8.3 Alertas

Configure alertas no Firebase Console:
1. Acesse: https://console.firebase.google.com/project/mediagrowth-a5349/functions
2. Clique na função > **Metrics**
3. Configure alertas para erros

---

## ❌ Troubleshooting (Resolvendo Problemas)

### Problema 1: "SendGrid API key not configured"

**Solução:**
```bash
# Reconfigurar API key
firebase functions:config:set sendgrid.apikey="SG.sua_chave"

# Fazer redeploy
firebase deploy --only functions
```

### Problema 2: "Sender identity not verified"

**Solução:**
1. No SendGrid: **Settings > Sender Authentication**
2. Verifique o email remetente
3. Confirme o email de verificação

### Problema 3: Emails não estão enviando

**Debug:**
```bash
# Ver logs
firebase functions:log --only sendDailyNotifications --limit 50

# Testar manualmente
curl https://us-central1-mediagrowth-a5349.cloudfunctions.net/sendDailyNotifications
```

**Checklist:**
- [ ] API Key configurada corretamente
- [ ] Sender verificado no SendGrid
- [ ] emailNotifications.enabled = true no Firestore
- [ ] Horário correto (usar UTC)
- [ ] Firebase Blaze Plan ativo

### Problema 4: Deploy timeout

**Solução:**
Já implementamos lazy loading. Se continuar:

```bash
# Limpar build
rm -rf functions/lib
cd functions
npm run build

# Deploy individual
firebase deploy --only functions:sendDailyNotifications
```

---

## 💰 Custos Reais

### SendGrid (GRÁTIS)
- ✅ 100 emails/dia = **$0.00**
- Se precisar mais: $14.95/mês para 50k emails

### Firebase Blaze Plan
- ✅ Primeiras 2M invocações: **$0.00**
- ✅ 10GB transferência: **$0.00**
- ✅ 400k GB-segundos CPU: **$0.00**

**Custo Mensal Estimado:**
- 3 emails/dia × 30 dias = 90 emails/mês
- ≈ 2.700 invocações/mês
- **Total: $0.00** (dentro do free tier)

Só pagaria se tiver milhares de clientes!

---

## 🎯 Resultado Final

Depois de tudo configurado:

✅ Emails enviados **automaticamente** do servidor
✅ Funciona mesmo com dashboard **fechado**
✅ Cada usuário recebe em seu próprio horário
✅ Logs centralizados no Firebase Console
✅ Estatísticas no SendGrid Dashboard
✅ **100% automático** e **24/7**

---

## 📞 Próximos Passos

1. **Agora:** Criar conta SendGrid e pegar API Key
2. **Depois:** Fazer upgrade para Blaze Plan
3. **Então:** Configurar API Key no Firebase
4. **Deploy:** `firebase deploy --only functions`
5. **Agendar:** Criar jobs no Cloud Scheduler
6. **Testar:** Configurar um email no dashboard e aguardar

---

## 🆘 Precisa de Ajuda?

Se algo der errado, me envie:
1. Log do deploy: `firebase deploy --only functions > deploy.log 2>&1`
2. Log da função: `firebase functions:log --only sendDailyNotifications > function.log`
3. Screenshot da configuração no Firestore

**Vamos resolver juntos! 🚀**
