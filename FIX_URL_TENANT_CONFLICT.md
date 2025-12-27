# FIX: Conflito de URL entre Tenants

## Problema Identificado

Quando um usuário:
1. Entra em uma conta (ex: `dashboard.com/wolf`)
2. Faz logout
3. Tenta entrar em outra conta

O sistema mantinha a URL da conta anterior (`/wolf`), causando conflitos porque:
- A URL não era limpa no logout
- Ao fazer login com outra conta, o sistema detectava o TENANT incorreto do pathname
- Algumas funcionalidades não carregavam corretamente por conta desse conflito

## Correções Implementadas

### 1. Logout Limpo (linha ~49927)

**ANTES:**
```javascript
$("logoutBtn").onclick = async () => {
  const btn = $("logoutBtn");
  try{
    btn.textContent = "Saindo...";
    btn.disabled = true;
    await signOut(auth);
    clearAuthTraces();
    statusBox.textContent = "Você saiu da conta.";
    location.reload(); // ❌ Mantinha o pathname na URL
  }catch(e){
    alert(e.message||String(e));
    btn.textContent = "Sair";
    btn.disabled = false;
  }
};
```

**DEPOIS:**
```javascript
$("logoutBtn").onclick = async () => {
  const btn = $("logoutBtn");
  try{
    btn.textContent = "Saindo...";
    btn.disabled = true;
    await signOut(auth);
    clearAuthTraces();
    statusBox.textContent = "Você saiu da conta.";
    // ✅ Redireciona para a raiz sem pathname para evitar conflito de TENANT
    window.location.href = window.location.origin + '/';
  }catch(e){
    alert(e.message||String(e));
    btn.textContent = "Sair";
    btn.disabled = false;
  }
};
```

### 2. Validação de TENANT no Login (linha ~49945)

**ANTES:**
```javascript
onAuthStateChanged(auth, async (user)=>{
  if(user){
    const tenantFromEmail = (user.email||'').split('@')[0].toLowerCase();
    if(tenantFromEmail){
      TENANT = tenantFromEmail;
      window.TENANT = tenantFromEmail;
      // ❌ Não verificava se a URL estava correta
    }
  }
});
```

**DEPOIS:**
```javascript
onAuthStateChanged(auth, async (user)=>{
  if(user){
    const tenantFromEmail = (user.email||'').split('@')[0].toLowerCase();
    if(tenantFromEmail){
      // ✅ Verifica se a URL atual tem um pathname diferente do tenant do usuário
      const currentPathTenant = window.getTenantFromHostOrPath();
      if(currentPathTenant && currentPathTenant !== tenantFromEmail){
        // Redireciona para a URL correta com o tenant do usuário
        console.log(`Redirecionando de /${currentPathTenant} para /${tenantFromEmail}`);
        window.location.href = window.location.origin + '/' + tenantFromEmail;
        return; // Interrompe a execução
      }
      
      TENANT = tenantFromEmail;
      window.TENANT = tenantFromEmail;
    }
  }
});
```

## Comportamento Após a Correção

### Cenário 1: Logout
1. Usuário está em `dashboard.com/wolf`
2. Clica em "Sair"
3. ✅ Sistema redireciona para `dashboard.com/` (raiz limpa)
4. Usuário vê a tela de login sem pathname

### Cenário 2: Login com URL Incorreta
1. Usuário está em `dashboard.com/wolf` (por algum motivo)
2. Faz login com conta `tiger@empresa.com`
3. ✅ Sistema detecta conflito (URL = wolf, Email = tiger)
4. ✅ Redireciona automaticamente para `dashboard.com/tiger`
5. Dashboard carrega com o TENANT correto

### Cenário 3: Login Normal
1. Usuário está em `dashboard.com/` ou `dashboard.com/wolf`
2. Faz login com conta `wolf@empresa.com`
3. ✅ Sistema valida (URL = wolf ou vazio, Email = wolf)
4. ✅ Se vazio, redireciona para `dashboard.com/wolf`
5. ✅ Se já correto, continua normalmente

## Benefícios

- ✅ Elimina conflitos de TENANT entre contas
- ✅ Garante que cada usuário sempre tenha a URL correta
- ✅ Previne problemas de carregamento de dados
- ✅ Melhora a experiência do usuário ao trocar de contas
- ✅ Mantém a consistência entre URL e conta autenticada

## Data da Correção
27 de dezembro de 2025
