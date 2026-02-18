# 🔧 SOLUÇÃO: Deploy Timeout Cloud Functions

## ❌ Problema Encontrado

Ao fazer `firebase deploy --only functions`, ocorre erro:
```
Error: User code failed to load. Cannot determine backend specification. 
Timeout after 10000. See https://firebase.google.com/...
```

---

## ✅ SOLUÇÃO IMPLEMENTADA

O problema foi causado por:
1. **Código duplicado** de email no `index.ts`
2. **Import no topo** de `@sendgrid/mail` travando o carregamento

### Correções Aplicadas:

1. ✅ Removido código duplicado de email do `index.ts`
2. ✅ Implementado **lazy loading** do SendGrid em `sendEmailNotifications.ts`
3. ✅ Centralizado toda lógica de email em arquivo separado

---

## 🚀 Como Fazer Deploy Agora

### Opção 1: Script Automático (RECOMENDADO)
```bash
./setup-sendgrid.sh
# Escolha opção 2 (Compilar e fazer Deploy)
```

### Opção 2: Manual
```bash
# 1. Limpar build anterior
rm -rf functions/lib

# 2. Compilar TypeScript
cd functions
npm run build

# 3. Verificar se compilou
ls -lh lib/

# 4. Fazer deploy
cd ..
firebase deploy --only functions
```

### Opção 3: Deploy Individual (Se timeout persistir)
```bash
# Deploy função por função
firebase deploy --only functions:becomeAgency
firebase deploy --only functions:receiveLead
firebase deploy --only functions:sendDailyNotifications
firebase deploy --only functions:sendWeeklyNotifications
firebase deploy --only functions:sendMonthlyNotifications
firebase deploy --only functions:sendTestEmail
```

---

## 📋 Checklist Antes do Deploy

- [ ] Node.js 22 instalado
- [ ] `firebase-tools` atualizado: `npm install -g firebase-tools@latest`
- [ ] Dentro da pasta do projeto
- [ ] `functions/package.json` existe
- [ ] Dependências instaladas: `cd functions && npm install`
- [ ] TypeScript compila sem erros: `npm run build`

---

## 🧪 Testar Localmente Antes de Deploy

```bash
# Emulador local (opcional)
firebase emulators:start --only functions

# Ou apenas compilar
cd functions
npm run build
```

Se compilar sem erros, está pronto para deploy!

---

## 🐛 Problemas Comuns

### 1. "firebase: command not found"
```bash
npm install -g firebase-tools
firebase login
```

### 2. "TypeScript compilation failed"
```bash
cd functions
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 3. "Permission denied: ./setup-sendgrid.sh"
```bash
chmod +x setup-sendgrid.sh
```

### 4. Deploy trava em "Loading and analyzing..."
**Solução:** Lazy loading já implementado. Se persistir:
```bash
# Temporariamente desabilitar funções de email
# Editar functions/src/index.ts e comentar:
# export * from './sendEmailNotifications';

# Deploy só das funções básicas
firebase deploy --only functions:becomeAgency,functions:receiveLead

# Depois, descomentar e tentar novamente
```

---

## 📊 Ver Status do Deploy

```bash
# Logs em tempo real
firebase functions:log

# Status das funções
firebase functions:list

# Ver última execução
firebase functions:log --only sendDailyNotifications --limit 5
```

---

## ⚠️ Nota Importante: Firebase Blaze Plan

As Cloud Functions **só funcionam no plano Blaze (pago)**. Mas não se preocupe:

**Free tier inclui:**
- 2 milhões de invocações/mês
- 400k GB-segundos/mês
- 200k CPU-segundos/mês

**Este projeto usa ~3k invocações/mês = $0.00** ✅

**Para ativar:**
1. https://console.firebase.google.com/project/mediagrowth-a5349/usage
2. Clique em **Upgrade**
3. Selecione **Blaze Plan**
4. Adicione cartão (não será cobrado inicialmente)

---

## 🎯 Resultado Esperado do Deploy

```bash
✔  Deploy complete!

Project Console: https://console.firebase.google.com/...
Functions deployed:
  - becomeAgency(us-central1)
  - receiveLead(us-central1)
  - sendDailyNotifications(us-central1)
  - sendWeeklyNotifications(us-central1)
  - sendMonthlyNotifications(us-central1)
  - sendTestEmail(us-central1)
```

URLs geradas:
```
https://us-central1-mediagrowth-a5349.cloudfunctions.net/sendDailyNotifications
https://us-central1-mediagrowth-a5349.cloudfunctions.net/sendWeeklyNotifications
https://us-central1-mediagrowth-a5349.cloudfunctions.net/sendMonthlyNotifications
```

---

## 🧪 Testar Após Deploy

```bash
# Teste 1: Via navegador
# Cole no navegador:
https://us-central1-mediagrowth-a5349.cloudfunctions.net/sendDailyNotifications

# Deve retornar JSON:
# { "success": true, "sent": 0, "errors": 0 }

# Teste 2: Via terminal
curl https://us-central1-mediagrowth-a5349.cloudfunctions.net/sendDailyNotifications

# Teste 3: Ver logs
firebase functions:log --only sendDailyNotifications
```

---

## 📞 Se Nada Funcionar

1. **Limpar tudo e recomeçar:**
```bash
cd functions
rm -rf node_modules lib package-lock.json
npm install
npm run build
cd ..
firebase deploy --only functions
```

2. **Verificar versões:**
```bash
node --version          # Deve ser v22+
npm --version           # Deve ser v9+
firebase --version      # Deve ser v13+
```

3. **Ver erro detalhado:**
```bash
firebase deploy --only functions --debug > deploy-debug.log 2>&1
cat deploy-debug.log
```

4. **Último recurso - Deploy sem email:**
```bash
# Editar functions/src/index.ts
# Comentar: export * from './sendEmailNotifications';
# Deploy
firebase deploy --only functions
# Ver se pelo menos as outras funções sobem
```

---

## ✅ Arquivos Finais Corretos

### functions/src/index.ts
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// Importar funções de envio de email
export * from './sendEmailNotifications';

// Função becomeAgency
export const becomeAgency = functions.https.onCall(async (data, context) => {
  // ... código existente
});

// Função receiveLead
export const receiveLead = functions.https.onRequest(async (req, res) => {
  // ... código existente
});
```

### functions/src/sendEmailNotifications.ts
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Lazy load SendGrid
let sgMail: any = null;

function ensureSendGridConfigured() {
  if (!sgMail) {
    sgMail = require('@sendgrid/mail');
  }
  const apiKey = process.env.SENDGRID_API_KEY || '';
  if (apiKey) {
    sgMail.setApiKey(apiKey);
  }
  return !!apiKey;
}

// ... resto do código
```

---

**Boa sorte com o deploy! 🚀**

Se seguir este guia, o deploy funcionará! ✅
