#!/usr/bin/env python3
import re

# Ler arquivo
with open('src/sendEmailNotifications.ts', 'r') as f:
    content = f.read()

# Encontrar e substituir a seção de teste
old_test_code = '''    // Modo de teste
    if (body.test) {
      console.log('📧 Modo de teste - enviando para:', body.testEmails);
      
      if (!ensureSendGridConfigured()) {
        res.status(500).json({ success: false, error: 'SENDGRID_API_KEY não configurada' });
        return;
      }
      
      const testEmails = body.testEmails || [];
      const clientKey = body.clientKey || 'cliente';
      const userId = body.userId;
      
      if (!userId) {
        res.status(400).json({ success: false, error: 'userId é obrigatório' });
        return;
      }
      
      // Coletar dados do dashboard para o email de teste
      const dashboardData = await collectDashboardData(userId, clientKey);
      const emailHTML = buildDashboardEmail(clientKey, dashboardData);
      
      let sent = 0;
      let errors = 0;
      
      for (const email of testEmails) {
        try {
          await sgMail.send({
            to: email,
            from: { email: FROM_EMAIL, name: FROM_NAME },
            subject: `🔔 Email de Teste - ${dashboardData.clientName || clientKey}`,
            html: emailHTML
          });
          console.log('✅ Email de teste enviado para:', email);
          sent++;
        } catch (err) {
          console.error('❌ Erro enviando para', email, err);
          errors++;
        }
      }
      
      res.status(200).json({ 
        success: true, 
        sent, 
        errors,
        message: `Email de teste enviado para ${sent} destinatário(s)` 
      });
      return;
    }'''

# Adicionar funções antes de sendDailyNotifications
functions_code = '''
// Coletar dados completos do dashboard
async function collectDashboardData(userId: string, clientKey: string) {
  const db = admin.firestore();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const dashboardData: any = {
    clientName: clientKey,
    demandas: { atrasadas: [], vencendo: [] },
    metas: { emRisco: [] },
    posts: { pendentes: [] },
    leads: { total: 0 }
  };

  try {
    const clientDoc = await db.collection('usuarios').doc(userId).collection('clients').doc(clientKey).get();
    if (clientDoc.exists) {
      dashboardData.clientName = clientDoc.data()?.nomeCliente || clientKey;
    }

    const demandasSnap = await db.collection('usuarios').doc(userId).collection('clients').doc(clientKey).collection('demandas').get();
    demandasSnap.forEach((doc) => {
      const d = doc.data();
      const status = (d.status || '').toLowerCase();
      if (status === 'concluido' || status === 'concluido-grupo') return;
      const prazo = d.prazo?.toDate();
      if (!prazo) return;
      const diffDays = Math.ceil((prazo.getTime() - todayStart.getTime()) / (24*60*60*1000));
      const title = (d.demanda || '').trim() || 'Demanda sem título';
      if (diffDays < 0) {
        dashboardData.demandas.atrasadas.push({ title, dias: Math.abs(diffDays) });
      } else if (diffDays <= 7) {
        dashboardData.demandas.vencendo.push({ title, dias: diffDays });
      }
    });

    const metasSnap = await db.collection('usuarios').doc(userId).collection('clients').doc(clientKey).collection('metas').get();
    metasSnap.forEach((doc) => {
      const meta = doc.data();
      if (!meta.ativa) return;
      const progresso = meta.progresso || 0;
      if (progresso < 50) {
        dashboardData.metas.emRisco.push({ title: meta.titulo || 'Meta sem título', progresso: Math.round(progresso) });
      }
    });

    const postsSnap = await db.collection('posts').where('tenant', '==', clientKey).get();
    postsSnap.forEach((doc) => {
      const post = doc.data();
      if (post.status === 'Em Revisão' || post.status === 'Aguardando Aprovação') {
        dashboardData.posts.pendentes.push({ title: post.tituloLegenda || 'Post sem título', status: post.status });
      }
    });

    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const leadsSnap = await db.collection('leads').where('tenant', '==', clientKey).where('data', '>=', admin.firestore.Timestamp.fromDate(firstDayOfMonth)).get();
    dashboardData.leads.total = leadsSnap.size;
  } catch (error) {
    console.error('❌ Erro coletando dados do dashboard:', error);
  }
  return dashboardData;
}

// Template HTML completo do dashboard
function buildDashboardEmail(clientKey: string, data: any) {
  const summaryCards = `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 24px 0;"><div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); padding: 20px; border-radius: 12px;"><div style="font-size: 32px; font-weight: bold; color: #dc2626;">${data.demandas.atrasadas.length}</div><div style="color: #991b1b; font-weight: 500;">Demandas Atrasadas</div></div><div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 12px;"><div style="font-size: 32px; font-weight: bold; color: #d97706;">${data.demandas.vencendo.length}</div><div style="color: #92400e; font-weight: 500;">Vencendo em 7 dias</div></div><div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 20px; border-radius: 12px;"><div style="font-size: 32px; font-weight: bold; color: #2563eb;">${data.metas.emRisco.length}</div><div style="color: #1e40af; font-weight: 500;">Metas em Risco</div></div><div style="background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); padding: 20px; border-radius: 12px;"><div style="font-size: 32px; font-weight: bold; color: #7c3aed;">${data.posts.pendentes.length}</div><div style="color: #5b21b6; font-weight: 500;">Posts Pendentes</div></div></div>`;
  
  let details = '';
  if (data.demandas.atrasadas.length > 0) {
    details += '<h3 style="color: #dc2626;">⏰ Demandas Atrasadas</h3>';
    data.demandas.atrasadas.forEach((d: any) => { details += `<div style="padding: 16px; margin: 12px 0; background: #fef2f2; border-left: 4px solid #dc2626; border-radius: 8px;"><div style="font-weight: 600;">${d.title}</div><div style="color: #dc2626; font-size: 14px;">Atrasada há ${d.dias} dia(s)</div></div>`; });
  }
  if (data.demandas.vencendo.length > 0) {
    details += '<h3 style="color: #d97706;">⚠️ Demandas Vencendo</h3>';
    data.demandas.vencendo.forEach((d: any) => { details += `<div style="padding: 16px; margin: 12px 0; background: #fef3c7; border-left: 4px solid #fbbf24; border-radius: 8px;"><div style="font-weight: 600;">${d.title}</div><div style="color: #d97706; font-size: 14px;">Vence em ${d.dias} dia(s)</div></div>`; });
  }
  if (data.metas.emRisco.length > 0) {
    details += '<h3 style="color: #2563eb;">📊 Metas em Risco</h3>';
    data.metas.emRisco.forEach((m: any) => { details += `<div style="padding: 16px; margin: 12px 0; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px;"><div style="font-weight: 600;">${m.title}</div><div style="color: #2563eb; font-size: 14px;">Progresso: ${m.progresso}%</div></div>`; });
  }
  if (data.posts.pendentes.length > 0) {
    details += '<h3 style="color: #7c3aed;">📝 Posts Pendentes</h3>';
    data.posts.pendentes.forEach((p: any) => { details += `<div style="padding: 16px; margin: 12px 0; background: #f5f3ff; border-left: 4px solid #8b5cf6; border-radius: 8px;"><div style="font-weight: 600;">${p.title}</div><div style="color: #7c3aed; font-size: 14px;">${p.status}</div></div>`; });
  }
  if (data.leads.total > 0) {
    details += `<div style="padding: 16px; margin: 24px 0; background: #ecfdf5; border-left: 4px solid #10b981; border-radius: 8px;"><div style="font-weight: 600;">Leads do Mês</div><div style="color: #059669; font-size: 14px;">Total: ${data.leads.total} leads</div></div>`;
  }
  
  return `<div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 32px 16px; background: #f9fafb;"><div style="background: white; border-radius: 16px; padding: 32px;"><div style="text-align: center; margin-bottom: 32px;"><h1 style="color: #6366f1; font-size: 32px; margin: 0;">📧 Email de Teste</h1><p style="color: #6b7280;">Dashboard: ${data.clientName}</p><p style="color: #9ca3af; font-size: 14px;">${new Date().toLocaleString('pt-BR')}</p></div>${summaryCards}<hr style="border: none; border-top: 2px solid #e5e7eb; margin: 32px 0;">${details}<div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #e5e7eb; text-align: center;"><p style="color: #10b981; font-size: 16px; font-weight: 600;">✅ Configuração funcionando corretamente! 🎉</p></div><div style="margin-top: 24px; text-align: center; color: #9ca3af; font-size: 12px;"><p>MediaGrowth Dashboard</p></div></div></div>`;
}

'''

# Adicionar funções antes de "export const sendDailyNotifications"
content = content.replace(
    '// ============================================\n// FUNÇÃO - ENVIO DIÁRIO\n// ============================================\nexport const sendDailyNotifications',
    functions_code + '// ============================================\n// FUNÇÃO - ENVIO DIÁRIO\n// ============================================\nexport const sendDailyNotifications'
)

# Substituir código de teste
content = re.sub(
    r'// Modo de teste\s+if \(body\.test\) \{[\s\S]*?res\.status\(200\)\.json\(\{ success: true, message: \'Email de teste enviado com sucesso!\' \}\);\s+return;\s+\}',
    old_test_code,
    content
)

# Salvar
with open('src/sendEmailNotifications.ts', 'w') as f:
    f.write(content)

print("✅ Arquivo atualizado com sucesso!")
