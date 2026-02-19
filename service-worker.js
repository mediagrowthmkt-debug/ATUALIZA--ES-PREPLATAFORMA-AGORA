// ============================================
// SERVICE WORKER - NOTIFICAÇÕES EM BACKGROUND
// ============================================
// Permite enviar notificações mesmo com app fechado

const CACHE_NAME = 'mediagrowth-v5.5.2';
const NOTIFICATION_CHECK_INTERVAL = 60000; // 1 minuto

// ============================================
// INSTALAÇÃO DO SERVICE WORKER
// ============================================
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Instalando...');
  self.skipWaiting(); // Ativa imediatamente
});

// ============================================
// ATIVAÇÃO DO SERVICE WORKER
// ============================================
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Ativado!');
  event.waitUntil(
    clients.claim() // Assume controle imediatamente
  );
  
  // Inicia verificação periódica
  startPeriodicCheck();
});

// ============================================
// VERIFICAÇÃO PERIÓDICA DE NOTIFICAÇÕES
// ============================================
let checkInterval = null;

function startPeriodicCheck() {
  if (checkInterval) return;
  
  console.log('🔄 Service Worker: Iniciando verificação periódica...');
  
  // Verifica imediatamente
  checkScheduledNotifications();
  
  // Depois verifica a cada minuto
  checkInterval = setInterval(() => {
    checkScheduledNotifications();
  }, NOTIFICATION_CHECK_INTERVAL);
}

// ============================================
// FUNÇÃO PRINCIPAL: VERIFICAR NOTIFICAÇÕES
// ============================================
async function checkScheduledNotifications() {
  console.log('🔔 [SW] Verificando notificações agendadas...');
  
  try {
    // Buscar todas as configurações salvas no IndexedDB
    const configs = await getAllNotificationConfigs();
    
    if (!configs || configs.length === 0) {
      console.log('⚠️ [SW] Nenhuma configuração encontrada');
      return;
    }
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    const currentDateStr = now.toDateString();
    
    console.log('⏰ [SW] Hora atual:', `${currentHour}:${currentMinute}`);
    
    // Verificar cada configuração
    for (const config of configs) {
      await processNotificationConfig(config, now, currentTimeInMinutes, currentDateStr);
    }
    
  } catch (error) {
    console.error('❌ [SW] Erro ao verificar notificações:', error);
  }
}

// ============================================
// PROCESSAR CONFIGURAÇÃO INDIVIDUAL
// ============================================
async function processNotificationConfig(config, now, currentTimeInMinutes, currentDateStr) {
  try {
    const { clientKey, userId, emails, frequency, time, lastSent } = config;
    
    if (!emails || emails.length === 0) {
      return;
    }
    
    // Parse do horário configurado
    const [configHour, configMinute] = time.split(':').map(Number);
    const configTimeInMinutes = configHour * 60 + configMinute;
    
    // Verificar se já passou do horário
    if (currentTimeInMinutes < configTimeInMinutes) {
      console.log(`⏳ [SW] ${clientKey}: Aguardando ${time}...`);
      return;
    }
    
    // Verificar frequência (dia da semana/mês)
    const dayOfWeek = now.getDay();
    const dayOfMonth = now.getDate();
    
    if (frequency === 'weekly' && dayOfWeek !== 1) {
      console.log(`📅 [SW] ${clientKey}: Aguardando segunda-feira`);
      return;
    }
    
    if (frequency === 'monthly' && dayOfMonth !== 1) {
      console.log(`📅 [SW] ${clientKey}: Aguardando dia 1`);
      return;
    }
    
    // Verificar se já enviou hoje/esta semana/este mês
    if (lastSent) {
      const lastSentDate = new Date(lastSent);
      
      if (frequency === 'daily' && lastSentDate.toDateString() === currentDateStr) {
        console.log(`✅ [SW] ${clientKey}: Já enviado hoje`);
        return;
      }
      
      if (frequency === 'weekly') {
        const daysSince = Math.floor((now - lastSentDate) / (1000 * 60 * 60 * 24));
        if (daysSince < 7) {
          console.log(`✅ [SW] ${clientKey}: Já enviado esta semana`);
          return;
        }
      }
      
      if (frequency === 'monthly') {
        if (lastSentDate.getMonth() === now.getMonth() && 
            lastSentDate.getFullYear() === now.getFullYear()) {
          console.log(`✅ [SW] ${clientKey}: Já enviado este mês`);
          return;
        }
      }
    }
    
    // ENVIAR NOTIFICAÇÃO!
    console.log(`🚀 [SW] ${clientKey}: Enviando notificação ${frequency}...`);
    await sendNotificationEmail(config);
    
    // Atualizar lastSent no IndexedDB
    await updateLastSent(clientKey, now.toISOString());
    
  } catch (error) {
    console.error('❌ [SW] Erro ao processar config:', error);
  }
}

// ============================================
// ENVIAR EMAIL VIA CLOUD FUNCTION
// ============================================
async function sendNotificationEmail(config) {
  const { clientKey, userId, emails, frequency } = config;
  
  try {
    let functionName = 'sendDailyNotifications';
    if (frequency === 'weekly') functionName = 'sendWeeklyNotifications';
    if (frequency === 'monthly') functionName = 'sendMonthlyNotifications';
    
    const functionUrl = `https://us-central1-mediagrowth-a5349.cloudfunctions.net/${functionName}`;
    
    // Buscar notificações do widget (do IndexedDB)
    const notifications = await getStoredNotifications(clientKey);
    
    const payload = {
      test: false,
      testEmails: emails,
      clientKey: clientKey,
      userId: userId,
      notifications: notifications || []
    };
    
    console.log('📦 [SW] Enviando para Cloud Function:', functionUrl);
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ [SW] Email enviado com sucesso:', result);
      
      // Mostrar notificação local ao usuário
      await self.registration.showNotification('📧 Email Enviado', {
        body: `Relatório ${frequency === 'daily' ? 'diário' : frequency === 'weekly' ? 'semanal' : 'mensal'} enviado para ${emails.length} destinatário(s)`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `email-sent-${clientKey}`,
        requireInteraction: false,
        vibrate: [200, 100, 200]
      });
      
    } else {
      const errorText = await response.text();
      console.error('❌ [SW] Erro ao enviar email:', errorText);
    }
    
  } catch (error) {
    console.error('❌ [SW] Erro de rede:', error);
  }
}

// ============================================
// INDEXEDDB - SALVAR/BUSCAR CONFIGURAÇÕES
// ============================================
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MediaGrowthNotifications', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Store para configurações de notificações
      if (!db.objectStoreNames.contains('configs')) {
        db.createObjectStore('configs', { keyPath: 'clientKey' });
      }
      
      // Store para notificações do widget
      if (!db.objectStoreNames.contains('notifications')) {
        db.createObjectStore('notifications', { keyPath: 'clientKey' });
      }
    };
  });
}

async function getAllNotificationConfigs() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['configs'], 'readonly');
      const store = transaction.objectStore('configs');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('❌ [SW] Erro ao buscar configs:', error);
    return [];
  }
}

async function updateLastSent(clientKey, timestamp) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['configs'], 'readwrite');
      const store = transaction.objectStore('configs');
      const request = store.get(clientKey);
      
      request.onsuccess = () => {
        const config = request.result;
        if (config) {
          config.lastSent = timestamp;
          store.put(config);
        }
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('❌ [SW] Erro ao atualizar lastSent:', error);
  }
}

async function getStoredNotifications(clientKey) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['notifications'], 'readonly');
      const store = transaction.objectStore('notifications');
      const request = store.get(clientKey);
      
      request.onsuccess = () => {
        const data = request.result;
        resolve(data ? data.items : []);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('❌ [SW] Erro ao buscar notificações:', error);
    return [];
  }
}

// ============================================
// EVENTOS DE NOTIFICAÇÃO
// ============================================
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Abrir a plataforma
  event.waitUntil(
    clients.openWindow('/')
  );
});

// ============================================
// MENSAGENS DO APP PRINCIPAL
// ============================================
self.addEventListener('message', async (event) => {
  console.log('📨 [SW] Mensagem recebida:', event.data);
  
  if (event.data.type === 'SAVE_CONFIG') {
    // Salvar configuração no IndexedDB
    try {
      const db = await openDB();
      const transaction = db.transaction(['configs'], 'readwrite');
      const store = transaction.objectStore('configs');
      await store.put(event.data.config);
      console.log('💾 [SW] Configuração salva:', event.data.config.clientKey);
    } catch (error) {
      console.error('❌ [SW] Erro ao salvar config:', error);
    }
  }
  
  if (event.data.type === 'SAVE_NOTIFICATIONS') {
    // Salvar notificações do widget
    try {
      const db = await openDB();
      const transaction = db.transaction(['notifications'], 'readwrite');
      const store = transaction.objectStore('notifications');
      await store.put({
        clientKey: event.data.clientKey,
        items: event.data.notifications
      });
      console.log('💾 [SW] Notificações salvas:', event.data.clientKey);
    } catch (error) {
      console.error('❌ [SW] Erro ao salvar notificações:', error);
    }
  }
  
  if (event.data.type === 'DELETE_CONFIG') {
    // Remover configuração
    try {
      const db = await openDB();
      const transaction = db.transaction(['configs'], 'readwrite');
      const store = transaction.objectStore('configs');
      await store.delete(event.data.clientKey);
      console.log('🗑️ [SW] Configuração removida:', event.data.clientKey);
    } catch (error) {
      console.error('❌ [SW] Erro ao remover config:', error);
    }
  }
});

console.log('🚀 Service Worker carregado!');
