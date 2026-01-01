// ====================================================
// INTEGRAÇÃO SENDGRID BACKEND - MediaGrowth Dashboard  
// ====================================================

console.log('📧 SendGrid Integration Module carregando...');

/**
 * Obtém o usuário atual (real ou fake admin)
 */
function getCurrentUserForSendGrid() {
  // Método 1: Usar função getCurrentUser se disponível
  if(window.getCurrentUser) {
    const user = window.getCurrentUser();
    if(user) {
      console.log('✅ Usuário via getCurrentUser():', user.email);
      return user;
    }
  }
  
  // Método 2: Usar _adminFakeUser se disponível
  if(window._adminFakeUser) {
    console.log('✅ Usuário via _adminFakeUser:', window._adminFakeUser.email);
    return window._adminFakeUser;
  }
  
  // Método 3: Usar auth.currentUser
  if(window.auth && window.auth.currentUser) {
    console.log('✅ Usuário via auth.currentUser:', window.auth.currentUser.email);
    return window.auth.currentUser;
  }
  
  return null;
}

/**
 * Envia um email de teste via SendGrid Backend
 */
async function sendTestEmailViaBackend() {
  console.log('🔵 Iniciando envio de teste via SendGrid Backend');
  
  // Obter usuário atual
  const currentUser = getCurrentUserForSendGrid();
  
  console.log('🔍 Verificando getCurrentUser:', !!window.getCurrentUser);
  console.log('🔍 Verificando _adminFakeUser:', !!window._adminFakeUser);
  console.log('🔍 Verificando auth.currentUser:', !!window.auth?.currentUser);
  console.log('🔍 Usuário obtido:', currentUser ? currentUser.email : 'null');
  
  if(!currentUser) {
    if(window.showNotificationStatus) {
      window.showNotificationStatus('❌ Erro: Você precisa fazer login primeiro!', 'error');
    }
    console.error('❌ Nenhum usuário encontrado');
    console.log('💡 Faça login na plataforma primeiro');
    return false;
  }
  
  console.log('✅ Usuário encontrado:', currentUser.email);
  console.log('✅ UID:', currentUser.uid);
  
  // Obter clientKey
  let clientKey = null;
  
  // Método 1: Função global getClientKey
  if(window.getClientKey) {
    clientKey = window.getClientKey();
    console.log('🔍 getClientKey() retornou:', clientKey);
  }
  
  // Método 2: URL pathname
  if(!clientKey || clientKey === 'no-client') {
    const pathParts = window.location.pathname.split('/');
    if(pathParts.length > 1 && pathParts[1]) {
      clientKey = pathParts[1];
      console.log('🔍 ClientKey via pathname:', clientKey);
    }
  }
  
  // Método 3: Fallback para UID
  if(!clientKey || clientKey === 'no-client') {
    clientKey = currentUser.uid;
    console.log('🔍 ClientKey via UID (fallback):', clientKey);
  }
  
  console.log('🔵 ClientKey final:', clientKey);

  // Pegar a frequência selecionada
  const frequencySelect = document.getElementById('notificationFrequency');
  if(!frequencySelect || !frequencySelect.value) {
    if(window.showNotificationStatus) {
      window.showNotificationStatus('❌ Por favor, selecione a frequência de envio antes de testar', 'error');
    }
    return false;
  }

  const frequency = frequencySelect.value;
  const emailsInput = document.getElementById('notificationEmails');
  if(!emailsInput || !emailsInput.value.trim()) {
    if(window.showNotificationStatus) {
      window.showNotificationStatus('❌ Por favor, adicione pelo menos um email antes de testar', 'error');
    }
    return false;
  }

  const emails = emailsInput.value.split(',').map(e => e.trim()).filter(e => e.length > 0);
  
  // Validar emails
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const invalidEmails = emails.filter(e => !emailRegex.test(e));
  if(invalidEmails.length > 0) {
    if(window.showNotificationStatus) {
      window.showNotificationStatus(`❌ Emails inválidos: ${invalidEmails.join(', ')}`, 'error');
    }
    return false;
  }
  
  if(window.showNotificationStatus) {
    window.showNotificationStatus('📨 Enviando email de teste via SendGrid para ' + emails.join(', ') + '...', 'info');
  }
  
  console.log('📨 Iniciando envio de email de teste via SendGrid Backend');
  console.log('📧 Emails destino:', emails);
  console.log('📅 Frequência:', frequency);
  console.log('👤 Cliente:', clientKey);
  console.log('🆔 UID:', currentUser.uid);
  
  try {
    // Chamar a Cloud Function correspondente baseada na frequência
    let functionUrl = '';
    let functionName = '';
    
    switch(frequency) {
      case 'daily':
        functionUrl = 'https://us-central1-mediagrowth-a5349.cloudfunctions.net/sendDailyNotifications';
        functionName = 'Diária';
        break;
      case 'weekly':
        functionUrl = 'https://us-central1-mediagrowth-a5349.cloudfunctions.net/sendWeeklyNotifications';
        functionName = 'Semanal';
        break;
      case 'monthly':
        functionUrl = 'https://us-central1-mediagrowth-a5349.cloudfunctions.net/sendMonthlyNotifications';
        functionName = 'Mensal';
        break;
      default:
        throw new Error('Frequência inválida selecionada');
    }


    console.log('🚀 Chamando Cloud Function:', functionUrl);
    
    // Coletar notificações do widget (exatamente o que o usuário vê)
    let widgetNotifications = [];
    try {
      // Método 1: Usar função global getNotificationItems (exposta pelo index.html)
      if(window.getNotificationItems) {
        widgetNotifications = window.getNotificationItems() || [];
        console.log('📋 Notificações coletadas via getNotificationItems:', widgetNotifications.length);
      }
      // Método 2: Coletar diretamente do DOM do widget
      if(widgetNotifications.length === 0) {
        const widgetContainer = document.getElementById('notification-list') || document.querySelector('.notification-list');
        if(widgetContainer) {
          const items = widgetContainer.querySelectorAll('.notification-item, [data-notification]');
          items.forEach(item => {
            const title = item.querySelector('.notification-title, .title, h4, strong')?.textContent || '';
            const message = item.querySelector('.notification-message, .message, p')?.textContent || '';
            const icon = item.querySelector('.notification-icon, .icon')?.textContent || '🔔';
            const severity = item.classList.contains('alert') || item.classList.contains('danger') ? 'alert' : 
                            item.classList.contains('warn') || item.classList.contains('warning') ? 'warn' : 'info';
            if(title || message) {
              widgetNotifications.push({ title, message, icon, severity });
            }
          });
          console.log('📋 Notificações coletadas do DOM:', widgetNotifications.length);
        }
      }
    } catch(e) {
      console.warn('⚠️ Erro ao coletar notificações do widget:', e);
    }
    
    console.log('�� Total de notificações a enviar:', widgetNotifications.length);
    
    const payload = { 
      test: true,
      testEmails: emails,
      clientKey: clientKey,
      userId: currentUser.uid,
      notifications: widgetNotifications
    };
    
    console.log('📦 Payload:', payload);
    console.log('📦 Notificações no payload:', widgetNotifications.length);

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log('📡 Status da resposta:', response.status);

    if(!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro HTTP:', errorText);
      throw new Error(`Erro HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Resposta do backend:', result);
    
    if(result.success) {
      const message = result.message || 'Email de teste enviado com sucesso!';
      const count = result.sent || 0;
      const errors = result.errors || 0;
      
      let statusMsg = `✅ ${message}`;
      if(count > 0) {
        statusMsg += ` (${count} enviado${count > 1 ? 's' : ''})`;
      }
      if(errors > 0) {
        statusMsg += ` ⚠️ ${errors} erro${errors > 1 ? 's' : ''}`;
      }
      
      if(window.showNotificationStatus) {
        window.showNotificationStatus(statusMsg, 'success');
      }
      
      // Mostrar detalhes no console
      console.log('📊 Detalhes do envio:');
      console.log('  ✅ Sucesso:', result.success);
      console.log('  📧 Enviados:', count);
      console.log('  ❌ Erros:', errors);
      console.log('  📅 Frequência:', functionName);
      
      return true;
    } else {
      throw new Error(result.message || 'Erro desconhecido ao enviar email');
    }
    
  } catch(err) {
    console.error('❌ Erro ao enviar email via SendGrid:', err);
    
    let errorMessage = 'Erro ao enviar email de teste: ';
    if(err.message) {
      errorMessage += err.message;
    } else {
      errorMessage += 'Erro desconhecido ao conectar com o backend SendGrid.';
    }
    
    if(window.showNotificationStatus) {
      window.showNotificationStatus(errorMessage, 'error');
    }
    return false;
  }
}

// Exportar funções para uso global
window.sendTestEmailViaBackend = sendTestEmailViaBackend;

console.log('✅ SendGrid Integration Module carregado - Função disponível globalmente');
