# 🔧 Implementação Backend: Email de Notificações

## 📋 Visão Geral

Este documento descreve a implementação do sistema backend para envio automático de emails com resumo das notificações da plataforma.

## 🏗️ Arquitetura

```
┌─────────────────────┐
│   Scheduler (Cron)  │
│  Cloud Scheduler    │
└──────────┬──────────┘
           │ Trigger (HTTP)
           ▼
┌─────────────────────┐      ┌──────────────────┐
│  Cloud Function     │─────▶│  Firestore DB    │
│  sendEmailNotif     │      │  (Leitura)       │
└──────────┬──────────┘      └──────────────────┘
           │
           │ Send Email
           ▼
┌─────────────────────┐
│  SendGrid / SMTP    │
│  Email Service      │
└─────────────────────┘
```

## 📦 Dependências

### Node.js Packages

```json
{
  "dependencies": {
    "firebase-admin": "^11.0.0",
    "firebase-functions": "^4.0.0",
    "@sendgrid/mail": "^7.7.0"
  }
}
```

## 🔑 Configuração

### 1. SendGrid API Key

Adicionar ao Firebase Config:

```bash
firebase functions:config:set sendgrid.apikey="SG.xxxxxxxxxxxxx"
```

### 2. Email Remetente

```bash
firebase functions:config:set sendgrid.from="noreply@mediagrowth.com.br"
firebase functions:config:set sendgrid.fromname="MediaGrowth Platform"
```

### 3. Cloud Scheduler

Criar 3 jobs diferentes para cada frequência:

**Job Diário:**
```bash
gcloud scheduler jobs create http daily-email-notifications \
  --schedule="0 * * * *" \
  --uri="https://us-central1-YOUR-PROJECT.cloudfunctions.net/sendDailyNotifications" \
  --http-method=POST \
  --time-zone="America/Sao_Paulo"
```

**Job Semanal:**
```bash
gcloud scheduler jobs create http weekly-email-notifications \
  --schedule="0 0 * * *" \
  --uri="https://us-central1-YOUR-PROJECT.cloudfunctions.net/sendWeeklyNotifications" \
  --http-method=POST \
  --time-zone="America/Sao_Paulo"
```

**Job Mensal:**
```bash
gcloud scheduler jobs create http monthly-email-notifications \
  --schedule="0 0 * * *" \
  --uri="https://us-central1-YOUR-PROJECT.cloudfunctions.net/sendMonthlyNotifications" \
  --http-method=POST \
  --time-zone="America/Sao_Paulo"
```

## 💻 Código da Cloud Function

### `functions/index.js`

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();
const db = admin.firestore();

// Configurar SendGrid
sgMail.setApiKey(functions.config().sendgrid.apikey);

/**
 * Busca dados de notificações para um cliente
 */
async function getNotificationData(userId, clientKey) {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  // Buscar demandas
  const demandasSnap = await db
    .collection('usuarios').doc(userId)
    .collection('clients').doc(clientKey)
    .collection('demandas')
    .get();
  
  const demandasPendentes = demandasSnap.docs
    .map(doc => ({id: doc.id, ...doc.data()}))
    .filter(d => {
      if(d.status === 'feito') return false;
      const prazo = d.prazo?.toDate?.();
      if(!prazo) return false;
      const diasAtraso = Math.floor((now - prazo) / (1000 * 60 * 60 * 24));
      return diasAtraso > 5;
    });

  // Buscar metas
  const metasSnap = await db
    .collection('usuarios').doc(userId)
    .collection('clients').doc(clientKey)
    .collection('metas')
    .where('mes', '==', monthKey)
    .get();
  
  const metasEmRisco = metasSnap.docs
    .map(doc => ({id: doc.id, ...doc.data()}))
    .filter(m => {
      const prog = parseFloat(m.progresso) || 0;
      const diasRestantes = Math.ceil((new Date(now.getFullYear(), now.getMonth() + 1, 0) - now) / (1000 * 60 * 60 * 24));
      return prog < 30 && diasRestantes < 7;
    });

  // Buscar posts
  const postsSnap = await db
    .collection('usuarios').doc(userId)
    .collection('clients').doc(clientKey)
    .collection('posts')
    .where('mes', '==', monthKey)
    .get();
  
  const posts = postsSnap.docs.map(doc => ({id: doc.id, ...doc.data()}));
  const postsAguardando = posts.filter(p => p.aprovacao === 'aguardando').length;
  const postsAprovados = posts.filter(p => p.aprovacao === 'aprovado').length;

  // Buscar leads do dia
  const todayISO = now.toISOString().split('T')[0];
  const leadsSnap = await db
    .collection('usuarios').doc(userId)
    .collection('clients').doc(clientKey)
    .collection('leads')
    .where('data', '==', todayISO)
    .get();
  
  const leadsHoje = leadsSnap.docs.map(doc => ({id: doc.id, ...doc.data()}));

  return {
    demandasPendentes,
    metasEmRisco,
    posts: { aguardando: postsAguardando, aprovados: postsAprovados, total: posts.length },
    leadsHoje
  };
}

/**
 * Gera HTML do email
 */
function generateEmailHTML(notificationData, clientName) {
  const { demandasPendentes, metasEmRisco, posts, leadsHoje } = notificationData;
  
  const sections = [];

  // Demandas Pendentes
  if(demandasPendentes.length > 0) {
    sections.push(`
      <div style="margin: 20px 0; padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
        <h3 style="margin: 0 0 10px 0; color: #92400e;">⏰ Demandas Pendentes (${demandasPendentes.length})</h3>
        <ul style="margin: 0; padding-left: 20px; color: #78350f;">
          ${demandasPendentes.slice(0, 5).map(d => `<li>${d.titulo}</li>`).join('')}
          ${demandasPendentes.length > 5 ? `<li><em>...e mais ${demandasPendentes.length - 5} demandas</em></li>` : ''}
        </ul>
      </div>
    `);
  }

  // Metas em Risco
  if(metasEmRisco.length > 0) {
    sections.push(`
      <div style="margin: 20px 0; padding: 15px; background: #fee2e2; border-left: 4px solid #ef4444; border-radius: 4px;">
        <h3 style="margin: 0 0 10px 0; color: #991b1b;">🎯 Metas em Risco (${metasEmRisco.length})</h3>
        <ul style="margin: 0; padding-left: 20px; color: #7f1d1d;">
          ${metasEmRisco.map(m => `<li>${m.descricao} - ${m.progresso}% concluído</li>`).join('')}
        </ul>
      </div>
    `);
  }

  // Posts Programados
  if(posts.total > 0) {
    sections.push(`
      <div style="margin: 20px 0; padding: 15px; background: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 4px;">
        <h3 style="margin: 0 0 10px 0; color: #1e40af;">🗓️ Posts Programados</h3>
        <p style="margin: 5px 0; color: #1e3a8a;">
          <strong>Aguardando aprovação:</strong> ${posts.aguardando}<br>
          <strong>Aprovados:</strong> ${posts.aprovados}<br>
          <strong>Total no mês:</strong> ${posts.total}
        </p>
      </div>
    `);
  }

  // Novos Leads
  if(leadsHoje.length > 0) {
    sections.push(`
      <div style="margin: 20px 0; padding: 15px; background: #d1fae5; border-left: 4px solid #10b981; border-radius: 4px;">
        <h3 style="margin: 0 0 10px 0; color: #065f46;">🎯 Novos Leads Hoje (${leadsHoje.length})</h3>
        <ul style="margin: 0; padding-left: 20px; color: #064e3b;">
          ${leadsHoje.slice(0, 3).map(l => `<li>${l.nome || 'Lead sem nome'} - ${l.fonte || 'Fonte desconhecida'}</li>`).join('')}
          ${leadsHoje.length > 3 ? `<li><em>...e mais ${leadsHoje.length - 3} leads</em></li>` : ''}
        </ul>
      </div>
    `);
  }

  if(sections.length === 0) {
    sections.push(`
      <div style="margin: 20px 0; padding: 15px; background: #f0f9ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
        <p style="margin: 0; color: #1e40af;">✅ Tudo certo! Não há notificações pendentes no momento.</p>
      </div>
    `);
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h1 style="color: #1f2937; margin: 0 0 10px 0;">📊 Resumo de Notificações</h1>
        <h2 style="color: #6b7280; font-weight: normal; margin: 0 0 20px 0; font-size: 16px;">${clientName}</h2>
        
        ${sections.join('')}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
          <a href="https://mediagrowthmkt.web.app" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">
            🚀 Acessar Plataforma
          </a>
        </div>
        
        <p style="margin-top: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
          MediaGrowth Platform © ${new Date().getFullYear()}
        </p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Verifica se deve enviar email com base na configuração
 */
function shouldSendEmail(settings, frequency) {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentDay = now.getDay();
  const currentDate = now.getDate();
  
  if(!settings || !settings.enabled) return false;
  if(settings.frequency !== frequency) return false;
  
  // Parse time
  const [targetHour, targetMinute] = settings.time.split(':').map(Number);
  
  // Verificar horário (com margem de 5 minutos)
  if(Math.abs(currentHour - targetHour) > 0) return false;
  if(Math.abs(currentMinute - targetMinute) > 5) return false;
  
  // Verificações específicas por frequência
  if(frequency === 'weekly') {
    if(currentDay !== settings.dayOfWeek) return false;
  } else if(frequency === 'monthly') {
    if(currentDate !== settings.dayOfMonth) return false;
  }
  
  return true;
}

/**
 * Função principal de envio de emails
 */
async function sendNotificationEmails(frequency) {
  console.log(`Processing ${frequency} email notifications...`);
  
  try {
    // Buscar todos os usuários
    const usersSnap = await db.collection('usuarios').get();
    
    let emailsSent = 0;
    let errors = 0;
    
    for(const userDoc of usersSnap.docs) {
      const userId = userDoc.id;
      
      // Buscar todos os clientes do usuário
      const clientsSnap = await db
        .collection('usuarios').doc(userId)
        .collection('clients')
        .get();
      
      for(const clientDoc of clientsSnap.docs) {
        const clientKey = clientDoc.id;
        const clientData = clientDoc.data();
        
        // Verificar configuração de email
        const emailSettings = clientData.emailNotifications;
        
        if(!shouldSendEmail(emailSettings, frequency)) {
          continue;
        }
        
        try {
          // Buscar dados de notificações
          const notificationData = await getNotificationData(userId, clientKey);
          
          // Gerar HTML
          const html = generateEmailHTML(notificationData, clientData.nomeCliente || 'Cliente');
          
          // Enviar email para todos os destinatários
          const msg = {
            to: emailSettings.emails,
            from: {
              email: functions.config().sendgrid.from,
              name: functions.config().sendgrid.fromname
            },
            subject: `📊 Resumo de Notificações - ${clientData.nomeCliente || 'MediaGrowth'}`,
            html: html
          };
          
          await sgMail.send(msg);
          emailsSent++;
          
          console.log(`Email sent to ${emailSettings.emails.join(', ')} for client ${clientKey}`);
          
        } catch(err) {
          console.error(`Error processing client ${clientKey}:`, err);
          errors++;
        }
      }
    }
    
    console.log(`Completed: ${emailsSent} emails sent, ${errors} errors`);
    return { success: true, sent: emailsSent, errors };
    
  } catch(err) {
    console.error('Error in sendNotificationEmails:', err);
    throw err;
  }
}

// Exports das Cloud Functions
exports.sendDailyNotifications = functions.https.onRequest(async (req, res) => {
  try {
    const result = await sendNotificationEmails('daily');
    res.json(result);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

exports.sendWeeklyNotifications = functions.https.onRequest(async (req, res) => {
  try {
    const result = await sendNotificationEmails('weekly');
    res.json(result);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

exports.sendMonthlyNotifications = functions.https.onRequest(async (req, res) => {
  try {
    const result = await sendNotificationEmails('monthly');
    res.json(result);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// Função para teste manual
exports.sendTestEmail = functions.https.onCall(async (data, context) => {
  // Verificar autenticação
  if(!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
  }
  
  const { clientKey, testEmail } = data;
  const userId = context.auth.uid;
  
  try {
    // Buscar dados do cliente
    const clientDoc = await db
      .collection('usuarios').doc(userId)
      .collection('clients').doc(clientKey)
      .get();
    
    if(!clientDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Cliente não encontrado');
    }
    
    const clientData = clientDoc.data();
    
    // Buscar dados de notificações
    const notificationData = await getNotificationData(userId, clientKey);
    
    // Gerar HTML
    const html = generateEmailHTML(notificationData, clientData.nomeCliente || 'Cliente');
    
    // Enviar email de teste
    const msg = {
      to: testEmail,
      from: {
        email: functions.config().sendgrid.from,
        name: functions.config().sendgrid.fromname
      },
      subject: `[TESTE] 📊 Resumo de Notificações - ${clientData.nomeCliente || 'MediaGrowth'}`,
      html: html
    };
    
    await sgMail.send(msg);
    
    return { success: true, message: 'Email de teste enviado com sucesso!' };
    
  } catch(err) {
    console.error('Error sending test email:', err);
    throw new functions.https.HttpsError('internal', err.message);
  }
});
```

## 🚀 Deploy

### 1. Instalar dependências

```bash
cd functions
npm install
```

### 2. Deploy das funções

```bash
firebase deploy --only functions
```

### 3. Ativar Cloud Scheduler

```bash
gcloud scheduler jobs list
gcloud scheduler jobs run daily-email-notifications
```

## 🧪 Testes

### Teste Manual via Firebase Console

```javascript
// No console do Firebase Functions
const data = {
  clientKey: "YOUR_CLIENT_KEY",
  testEmail: "test@example.com"
};

// Chamar sendTestEmail
```

### Teste via Client-Side

```javascript
// Adicionar no botão de teste do index.html
const testEmailBtn = document.getElementById('testEmailNotificationBtn');
if(testEmailBtn) {
  testEmailBtn.addEventListener('click', async () => {
    try {
      const sendTestEmail = httpsCallable(functions, 'sendTestEmail');
      const result = await sendTestEmail({
        clientKey: clientKey,
        testEmail: 'test@example.com'
      });
      
      showNotificationStatus(result.data.message, 'success');
    } catch(err) {
      showNotificationStatus('Erro ao enviar: ' + err.message, 'error');
    }
  });
}
```

## 📊 Monitoramento

### Logs

```bash
firebase functions:log --only sendDailyNotifications
firebase functions:log --only sendWeeklyNotifications
firebase functions:log --only sendMonthlyNotifications
```

### Métricas no Console

- Cloud Functions → Logs → Filter by function name
- Cloud Scheduler → Ver histórico de execuções
- SendGrid Dashboard → Email Activity

## 🔒 Segurança

### Regras do Firestore

```javascript
// firestore.rules
match /usuarios/{userId}/clients/{clientKey} {
  // Apenas o owner pode ler/escrever emailNotifications
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

### Rate Limiting

Adicionar controle para evitar spam:

```javascript
// Limitar a 1 email por hora por destinatário
const rateLimitKey = `${userId}_${clientKey}_${frequency}`;
const lastSent = await db.collection('emailRateLimits').doc(rateLimitKey).get();

if(lastSent.exists) {
  const lastTimestamp = lastSent.data().lastSent.toDate();
  const hoursSince = (now - lastTimestamp) / (1000 * 60 * 60);
  if(hoursSince < 1) {
    console.log('Rate limit exceeded, skipping');
    continue;
  }
}

// Após enviar com sucesso
await db.collection('emailRateLimits').doc(rateLimitKey).set({
  lastSent: admin.firestore.FieldValue.serverTimestamp()
});
```

## 💰 Custos Estimados

- **Cloud Functions:** ~$0.40/milhão de invocações
- **Cloud Scheduler:** $0.10/job/mês (3 jobs = $0.30)
- **SendGrid:** Grátis até 100 emails/dia, depois $19.95/mês para 50k emails
- **Firestore:** Reads incluídas no free tier para volumes pequenos

## 📚 Próximos Passos

1. ✅ Implementar Cloud Functions
2. ✅ Configurar SendGrid
3. ✅ Criar jobs no Cloud Scheduler
4. ✅ Testar envio manual
5. ✅ Monitorar logs
6. ✅ Adicionar rate limiting
7. ✅ Implementar analytics de abertura (via SendGrid tracking)
8. ✅ Adicionar unsubscribe link

---

**Tempo estimado de implementação:** 4-6 horas  
**Nível de complexidade:** Intermediário  
**Conhecimentos necessários:** Firebase, Node.js, SendGrid API
