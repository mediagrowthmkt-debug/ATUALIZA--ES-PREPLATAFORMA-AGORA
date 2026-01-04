import * as functions from 'firebase-functions';

let sgMail: any = null;

const FROM_EMAIL = 'contato@mediagrowth.com.br';
const FROM_NAME = 'MediaGrowth Dashboard';

function ensureSendGridConfigured() {
  if (!sgMail) {
    sgMail = require('@sendgrid/mail');
  }
  const apiKey = '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';
  if (apiKey) {
    sgMail.setApiKey(apiKey);
  }
  return !!apiKey;
}

function setCorsHeaders(res: any) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Max-Age', '3600');
}

function buildDashboardEmail(clientName: string, notifications: any[]) {
  if (notifications.length === 0) {
    return '<div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 32px 16px; background: #f9fafb;"><div style="background: white; border-radius: 16px; padding: 32px;"><div style="text-align: center; margin-bottom: 32px;"><h1 style="color: #6366f1; font-size: 32px; margin: 0;">🔔 Notificacoes do Dashboard</h1><p style="color: #6b7280;">Dashboard: ' + clientName + '</p><p style="color: #9ca3af; font-size: 14px;">' + new Date().toLocaleString('pt-BR') + '</p></div><p style="text-align: center; padding: 40px; color: #999;">Nenhuma notificacao no momento. Tudo esta em ordem! ✅</p></div></div>';
  }

  // CORRIGIDO: Adicionar 'critical' como severidade crítica (vermelho)
  const criticalCount = notifications.filter(n => n.severity === 'critical' || n.severity === 'alert' || n.severity === 'danger').length;
  const warnCount = notifications.filter(n => n.severity === 'warn' || n.severity === 'warning').length;
  const infoCount = notifications.filter(n => n.severity === 'info' || n.severity === 'success').length;

  const summaryCards = '<div style="display: flex; gap: 16px; margin: 24px 0; flex-wrap: wrap;"><div style="flex: 1; min-width: 150px; background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); padding: 20px; border-radius: 12px; text-align: center;"><div style="font-size: 32px; font-weight: bold; color: #dc2626;">' + criticalCount + '</div><div style="color: #991b1b; font-weight: 500; font-size: 14px;">Criticas</div></div><div style="flex: 1; min-width: 150px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 12px; text-align: center;"><div style="font-size: 32px; font-weight: bold; color: #d97706;">' + warnCount + '</div><div style="color: #92400e; font-weight: 500; font-size: 14px;">Avisos</div></div><div style="flex: 1; min-width: 150px; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 20px; border-radius: 12px; text-align: center;"><div style="font-size: 32px; font-weight: bold; color: #2563eb;">' + infoCount + '</div><div style="color: #1e40af; font-weight: 500; font-size: 14px;">Informacoes</div></div></div>';

  let notificationsHTML = '';
  notifications.forEach(item => {
    const sev = (item.severity || 'info').toLowerCase();
    // CORRIGIDO: Adicionar 'critical' como severidade crítica (vermelho)
    const isCritical = sev === 'critical' || sev === 'alert' || sev === 'danger';
    const isWarn = sev === 'warn' || sev === 'warning';
    const severityColor = isCritical ? '#fee2e2' : isWarn ? '#fef3c7' : '#f0f9ff';
    const severityBorder = isCritical ? '#dc2626' : isWarn ? '#fbbf24' : '#60a5fa';
    
    notificationsHTML += '<div style="display: flex; gap: 12px; padding: 16px; margin: 12px 0; background: ' + severityColor + '; border-left: 4px solid ' + severityBorder + '; border-radius: 8px;"><div style="font-size: 24px; flex-shrink: 0;">' + (item.icon || '🔔') + '</div><div style="flex: 1;"><div style="font-weight: bold; font-size: 15px; margin-bottom: 4px; color: #1e293b;">' + (item.title || 'Notificacao') + '</div><div style="font-size: 14px; color: #475569; margin-bottom: 4px;">' + (item.message || '') + '</div>' + (item.meta ? '<div style="font-size: 12px; color: #64748b; margin-top: 6px;">' + item.meta + '</div>' : '') + '</div></div>';
  });

  return '<div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 32px 16px; background: #f9fafb;"><div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);"><div style="text-align: center; margin-bottom: 32px;"><h1 style="color: #6366f1; font-size: 32px; margin: 0 0 8px;">🔔 Notificacoes do Dashboard</h1><p style="color: #6b7280; margin: 0; font-size: 18px; font-weight: 600;">' + clientName + '</p><p style="color: #9ca3af; font-size: 14px; margin: 8px 0 0;">' + new Date().toLocaleString('pt-BR') + '</p></div>' + summaryCards + '<hr style="border: none; border-top: 2px solid #e5e7eb; margin: 32px 0;"><div style="margin-top: 24px;"><h2 style="color: #1e293b; font-size: 20px; margin: 0 0 16px;">📋 Todas as Notificacoes (' + notifications.length + ')</h2>' + notificationsHTML + '</div><div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #e5e7eb; text-align: center;"><p style="color: #10b981; font-size: 16px; font-weight: 600; margin: 0;">✅ Email enviado automaticamente pelo sistema MediaGrowth Dashboard</p></div></div></div>';
}

async function sendNotificationsByFrequency(req: any, res: any, frequency: string) {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  console.log('=== INICIANDO ENVIO ' + frequency.toUpperCase() + ' ===');

  if (!ensureSendGridConfigured()) {
    console.error('SendGrid nao configurado');
    res.status(500).json({ success: false, message: 'SendGrid nao configurado' });
    return;
  }

  try {
    const body = req.body || {};
    const isTest = body.test === true;
    
    // IMPORTANTE: Pegar emails de AMBOS os campos (testEmails ou emails)
    const emails = body.testEmails || body.emails || [];
    const clientKey = body.clientKey || 'Dashboard';
    const userId = body.userId || '';
    const frontendNotifications = body.notifications || [];
    
    console.log('=== PAYLOAD RECEBIDO ===');
    console.log('test:', isTest);
    console.log('body.testEmails:', JSON.stringify(body.testEmails));
    console.log('body.emails:', JSON.stringify(body.emails));
    console.log('emails final:', JSON.stringify(emails));
    console.log('emails.length:', emails.length);
    console.log('clientKey:', clientKey);
    console.log('userId:', userId);
    console.log('notificacoes:', frontendNotifications.length);
    
    // CORRECAO PRINCIPAL: Usar emails diretamente (funciona para TESTE e AGENDADO)
    const targetEmails = emails;
    
    if (targetEmails.length === 0) {
      console.log('ERRO: Array de emails vazio!');
      res.status(200).json({ success: true, message: 'Nenhum email configurado para envio', sent: 0 });
      return;
    }
    
    console.log('=== ENVIANDO EMAILS ===');
    console.log('Destinatarios:', targetEmails);

    const notifications = frontendNotifications;
    const htmlContent = buildDashboardEmail(clientKey, notifications);

    let sent = 0;
    let errors = 0;

    for (const email of targetEmails) {
      try {
        const msg = {
          to: email,
          from: { email: FROM_EMAIL, name: FROM_NAME },
          subject: '🔔 Notificacoes - ' + clientKey,
          html: htmlContent
        };

        await sgMail.send(msg);
        console.log('✅ Email enviado para:', email);
        sent++;
      } catch (err: any) {
        console.error('❌ Erro ao enviar para ' + email + ':', err.message || err);
        errors++;
      }
    }

    console.log('=== RESULTADO ===');
    console.log('Enviados:', sent, 'Erros:', errors);

    res.status(200).json({
      success: true,
      message: sent > 0 ? 'Emails enviados com sucesso' : 'Nenhum email enviado',
      sent,
      errors,
      frequency,
      notificationsCount: notifications.length
    });

  } catch (error: any) {
    console.error('Erro geral:', error);
    res.status(500).json({ success: false, message: error.message || 'Erro interno' });
  }
}

export const sendDailyNotifications = functions.https.onRequest((req, res) => {
  return sendNotificationsByFrequency(req, res, 'daily');
});

export const sendWeeklyNotifications = functions.https.onRequest((req, res) => {
  return sendNotificationsByFrequency(req, res, 'weekly');
});

export const sendMonthlyNotifications = functions.https.onRequest((req, res) => {
  return sendNotificationsByFrequency(req, res, 'monthly');
});
