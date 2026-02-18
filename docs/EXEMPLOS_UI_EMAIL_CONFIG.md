# 🎨 Exemplos de Interface: Configuração de Emails no Dashboard

## 📋 Estrutura Recomendada para o Dashboard

### 1️⃣ Seção de Configurações de Email

Adicione uma nova seção no seu painel de configurações:

```html
<!-- Seção de Notificações por Email -->
<div class="email-notifications-section">
  <h3>📧 Notificações por Email</h3>
  <p class="subtitle">Configure o envio automático de relatórios por email</p>
  
  <!-- Toggle Ativar/Desativar -->
  <div class="form-group">
    <label class="switch">
      <input type="checkbox" id="emailNotificationsEnabled">
      <span class="slider"></span>
    </label>
    <label for="emailNotificationsEnabled">
      Ativar notificações por email
    </label>
  </div>
  
  <!-- Frequência -->
  <div class="form-group">
    <label for="emailFrequency">Frequência de Envio</label>
    <select id="emailFrequency" class="form-control">
      <option value="">Selecione...</option>
      <option value="daily">📊 Diário - Todo dia às 9h</option>
      <option value="weekly">📈 Semanal - Toda segunda-feira às 9h</option>
      <option value="monthly">🎯 Mensal - Dia 1 de cada mês às 9h</option>
    </select>
  </div>
  
  <!-- Lista de Emails -->
  <div class="form-group">
    <label for="emailsList">Emails para Receber Notificações</label>
    <textarea 
      id="emailsList" 
      class="form-control" 
      rows="4" 
      placeholder="Digite um email por linha&#10;exemplo@email.com&#10;outro@email.com"
    ></textarea>
    <small class="form-text">Um email por linha. Máximo: 10 emails.</small>
  </div>
  
  <!-- Botões -->
  <div class="form-actions">
    <button onclick="saveEmailSettings()" class="btn btn-primary">
      💾 Salvar Configurações
    </button>
    <button onclick="sendTestEmailBackend()" class="btn btn-secondary">
      📧 Enviar Email de Teste
    </button>
  </div>
  
  <!-- Status/Feedback -->
  <div id="emailSettingsStatus" class="status-message"></div>
</div>

<!-- CSS -->
<style>
.email-notifications-section {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin: 20px 0;
}

.subtitle {
  color: #666;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-text {
  display: block;
  margin-top: 5px;
  color: #666;
  font-size: 12px;
}

/* Switch Toggle */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  margin-right: 10px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4CAF50;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.form-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}

.status-message {
  margin-top: 15px;
  padding: 12px;
  border-radius: 4px;
  display: none;
}

.status-message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  display: block;
}

.status-message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  display: block;
}

.status-message.info {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
  display: block;
}
</style>
```

---

## 📝 JavaScript para Salvar Configurações

```javascript
// Salvar configurações de email
async function saveEmailSettings() {
  try {
    const clientKey = getClientKey();
    const currentUser = firebase.auth().currentUser;
    
    if (!currentUser || !clientKey) {
      showStatus('error', '❌ Erro: Usuário não autenticado ou cliente não selecionado');
      return;
    }
    
    // Pegar valores
    const enabled = document.getElementById('emailNotificationsEnabled').checked;
    const frequency = document.getElementById('emailFrequency').value;
    const emailsText = document.getElementById('emailsList').value;
    
    // Validações
    if (enabled && !frequency) {
      showStatus('error', '❌ Selecione a frequência de envio');
      return;
    }
    
    if (enabled && !emailsText.trim()) {
      showStatus('error', '❌ Digite pelo menos um email');
      return;
    }
    
    // Processar lista de emails
    const emails = emailsText
      .split('\n')
      .map(e => e.trim())
      .filter(e => e)
      .filter(e => validateEmail(e));
    
    if (enabled && emails.length === 0) {
      showStatus('error', '❌ Nenhum email válido encontrado');
      return;
    }
    
    if (emails.length > 10) {
      showStatus('error', '❌ Máximo de 10 emails permitido');
      return;
    }
    
    // Salvar no Firestore
    showStatus('info', '⏳ Salvando configurações...');
    
    await firebase.firestore()
      .collection('usuarios').doc(currentUser.uid)
      .collection('clients').doc(clientKey)
      .update({
        emailNotifications: {
          enabled: enabled,
          frequency: frequency,
          emails: emails,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }
      });
    
    showStatus('success', `✅ Configurações salvas! ${enabled ? `Você receberá emails ${getFrequencyText(frequency)}.` : 'Notificações desativadas.'}`);
    
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    showStatus('error', `❌ Erro: ${error.message}`);
  }
}

// Carregar configurações existentes
async function loadEmailSettings() {
  try {
    const clientKey = getClientKey();
    const currentUser = firebase.auth().currentUser;
    
    if (!currentUser || !clientKey) return;
    
    const doc = await firebase.firestore()
      .collection('usuarios').doc(currentUser.uid)
      .collection('clients').doc(clientKey)
      .get();
    
    if (doc.exists) {
      const data = doc.data();
      const settings = data.emailNotifications || {};
      
      // Preencher formulário
      document.getElementById('emailNotificationsEnabled').checked = settings.enabled || false;
      document.getElementById('emailFrequency').value = settings.frequency || '';
      document.getElementById('emailsList').value = (settings.emails || []).join('\n');
    }
    
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
  }
}

// Validar email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Mostrar mensagem de status
function showStatus(type, message) {
  const statusDiv = document.getElementById('emailSettingsStatus');
  statusDiv.className = `status-message ${type}`;
  statusDiv.textContent = message;
  statusDiv.style.display = 'block';
  
  // Auto-ocultar após 5 segundos
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 5000);
}

// Texto amigável da frequência
function getFrequencyText(frequency) {
  const texts = {
    'daily': 'todos os dias às 9h',
    'weekly': 'toda segunda-feira às 9h',
    'monthly': 'todo dia 1 do mês às 9h'
  };
  return texts[frequency] || '';
}

// Enviar email de teste via backend
async function sendTestEmailBackend() {
  try {
    const currentUser = firebase.auth().currentUser;
    const clientKey = getClientKey();
    
    if (!currentUser || !clientKey) {
      showStatus('error', '❌ Erro: Usuário não autenticado ou cliente não selecionado');
      return;
    }
    
    // Pegar email de teste
    const emailsText = document.getElementById('emailsList').value;
    const emails = emailsText.split('\n').map(e => e.trim()).filter(e => e);
    
    if (emails.length === 0) {
      showStatus('error', '❌ Digite pelo menos um email para testar');
      return;
    }
    
    const testEmail = emails[0]; // Usar primeiro email da lista
    
    showStatus('info', '⏳ Enviando email de teste...');
    
    // Chamar Cloud Function
    const sendTestEmail = firebase.functions().httpsCallable('sendTestEmail');
    const result = await sendTestEmail({
      clientKey: clientKey,
      testEmail: testEmail
    });
    
    if (result.data.success) {
      showStatus('success', `✅ Email de teste enviado para ${testEmail}! Verifique sua caixa de entrada.`);
    } else {
      showStatus('error', `❌ Erro ao enviar: ${result.data.message}`);
    }
    
  } catch (error) {
    console.error('Erro ao enviar email de teste:', error);
    showStatus('error', `❌ Erro: ${error.message}`);
  }
}

// Chamar ao carregar a página/seção
window.addEventListener('DOMContentLoaded', () => {
  loadEmailSettings();
});
```

---

## 🎨 Variação: Card Compacto

Se preferir um design mais compacto:

```html
<div class="email-card">
  <div class="email-card-header">
    <div>
      <h4>📧 Notificações Automáticas</h4>
      <p>Receba relatórios por email</p>
    </div>
    <label class="switch">
      <input type="checkbox" id="emailEnabled">
      <span class="slider"></span>
    </label>
  </div>
  
  <div class="email-card-body" id="emailCardBody" style="display: none;">
    <div class="quick-settings">
      <select id="quickFrequency" class="quick-select">
        <option value="daily">📊 Diário</option>
        <option value="weekly">📈 Semanal</option>
        <option value="monthly">🎯 Mensal</option>
      </select>
      
      <input 
        type="email" 
        id="quickEmail" 
        placeholder="seu@email.com" 
        class="quick-input"
      >
      
      <button onclick="quickSave()" class="quick-btn">💾</button>
    </div>
  </div>
</div>

<style>
.email-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.email-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.email-card-header h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.email-card-header p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.email-card-body {
  padding: 20px;
}

.quick-settings {
  display: flex;
  gap: 10px;
}

.quick-select,
.quick-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.quick-btn {
  padding: 10px 15px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>

<script>
document.getElementById('emailEnabled').addEventListener('change', (e) => {
  document.getElementById('emailCardBody').style.display = e.target.checked ? 'block' : 'none';
});

async function quickSave() {
  const enabled = document.getElementById('emailEnabled').checked;
  const frequency = document.getElementById('quickFrequency').value;
  const email = document.getElementById('quickEmail').value;
  
  if (!enabled || !email) {
    alert('Ative e digite um email');
    return;
  }
  
  const currentUser = firebase.auth().currentUser;
  const clientKey = getClientKey();
  
  await firebase.firestore()
    .collection('usuarios').doc(currentUser.uid)
    .collection('clients').doc(clientKey)
    .update({
      emailNotifications: {
        enabled: true,
        frequency: frequency,
        emails: [email]
      }
    });
  
  alert('✅ Configurado! Você receberá emails automaticamente.');
}
</script>
```

---

## 📱 Versão Mobile-Friendly

```html
<div class="mobile-email-settings">
  <div class="setting-row">
    <span>📧 Emails automáticos</span>
    <label class="switch-mini">
      <input type="checkbox" id="mobileEmailToggle">
      <span class="slider-mini"></span>
    </label>
  </div>
  
  <div id="mobileEmailConfig" style="display: none;">
    <select id="mobileFreq" class="mobile-select">
      <option value="daily">Diário (9h)</option>
      <option value="weekly">Semanal (seg 9h)</option>
      <option value="monthly">Mensal (dia 1)</option>
    </select>
    
    <input 
      type="email" 
      id="mobileEmail" 
      placeholder="Email" 
      class="mobile-input"
    >
    
    <button onclick="mobileSave()" class="mobile-save">Salvar</button>
  </div>
</div>

<style>
.mobile-email-settings {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin: 10px 0;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.mobile-select,
.mobile-input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px; /* Evita zoom no iOS */
}

.mobile-save {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
}

/* Switch mini */
.switch-mini {
  position: relative;
  width: 44px;
  height: 24px;
  display: inline-block;
}

.switch-mini input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider-mini {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .3s;
  border-radius: 24px;
}

.slider-mini:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}

input:checked + .slider-mini {
  background-color: #4CAF50;
}

input:checked + .slider-mini:before {
  transform: translateX(20px);
}
</style>
```

---

## 🎯 Dicas de UX

### 1. Feedback Visual
- ✅ Sempre mostre mensagem de sucesso após salvar
- ⚠️ Valide emails em tempo real
- 🔄 Mostre loading durante operações assíncronas

### 2. Textos Amigáveis
Em vez de `daily`, mostre `"Todo dia às 9h da manhã"`
Em vez de `error`, mostre `"Ops! Algo deu errado"`

### 3. Testes Fáceis
- Botão de "Enviar Teste" sempre visível
- Confirmar email recebido antes de salvar

### 4. Hints
```html
<div class="hint-box">
  💡 <strong>Dica:</strong> Adicione múltiplos emails (um por linha) para que toda sua equipe receba os relatórios!
</div>
```

---

**Próximo passo:** Implementar um desses designs no seu dashboard! 🚀
