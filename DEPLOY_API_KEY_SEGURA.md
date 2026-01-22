# 🔒 Deploy da API Key Segura (OpenRouter)

## ⚠️ URGENTE - Sua API Key estava exposta!

A API Key `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` foi **REMOVIDA** do frontend e movida para o backend.

### O que foi feito:

1. ✅ **Criado proxy no backend** (`functions/src/aiProxy.ts`)
   - A chave API agora fica SOMENTE no servidor Firebase
   - Rate limiting de 30 requests/minuto por usuário
   - Whitelist de modelos permitidos
   - CORS configurado

2. ✅ **Frontend atualizado** (`index.html`)
   - Todas as chamadas diretas à API foram substituídas por `window.callAIProxy()`
   - Nenhuma chave API é exposta no código cliente

3. ✅ **Verificações atualizadas**
   - Todas as verificações de `window.OPENROUTER_API_KEY` foram substituídas por verificações do proxy

---

## 📋 PASSOS PARA DEPLOY

### 1. Configurar a API Key no Firebase Secrets

```bash
cd "/Users/bruno/Documents/DJSXVC/DASHBOARD MEDIAGROWHT/ATUALIZAÇÕES PREPLATAFORMA AGORA/functions"

# IMPORTANTE: Gere uma NOVA chave no OpenRouter (a antiga pode estar comprometida)
# Acesse: https://openrouter.ai/keys

# Configure a nova chave como secret:
firebase functions:secrets:set OPENROUTER_API_KEY
# Cole a nova chave quando solicitado
```

### 2. Compilar e fazer deploy das Functions

```bash
# Instalar dependências (se necessário)
npm install

# Compilar TypeScript
npm run build

# Deploy das functions
firebase deploy --only functions
```

### 3. Fazer deploy do frontend

```bash
cd ..
firebase deploy --only hosting
```

---

## 🚨 AÇÕES RECOMENDADAS

### Revogar a chave antiga IMEDIATAMENTE

1. Acesse https://openrouter.ai/keys
2. **DELETE** a chave `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`
3. Crie uma **NOVA** chave
4. Configure a nova chave no Firebase Secrets (passo 1 acima)

### Verificar uso indevido

- Verifique os logs de uso no OpenRouter para identificar uso suspeito
- Monitore os custos nos próximos dias

---

## 🔧 Estrutura do Proxy

### Endpoint
```
POST https://us-central1-mediagrowth-a5349.cloudfunctions.net/aiProxy
```

### Request Body
```json
{
  "model": "google/gemini-2.5-flash",
  "messages": [...],
  "userId": "optional-user-id",
  "max_tokens": 4000,
  "temperature": 0.7
}
```

### Modelos Permitidos (whitelist)
- `google/gemini-2.5-flash`
- `google/gemini-2.5-pro`
- `anthropic/claude-sonnet-4`
- `openai/gpt-4o-mini`
- `openai/gpt-4o`
- `gpt-4o-mini`

---

## ✅ Verificação pós-deploy

Após o deploy, teste:

1. Abra a plataforma
2. Faça login
3. Tente usar qualquer função de IA (chat, geração de análise, etc.)
4. Verifique os logs no Firebase Console: `Functions > Logs`

Se houver erros:
- `API key not configured on server` → Execute o passo 1 novamente
- `Rate limit exceeded` → Aguarde 1 minuto e tente novamente
- `Model not allowed` → O modelo solicitado não está na whitelist

---

## 📁 Arquivos Modificados

- `functions/src/aiProxy.ts` - **NOVO** - Proxy da IA
- `functions/src/index.ts` - Exporta o novo proxy
- `index.html` - Removidas todas as referências à API key

---

**Data:** 22 de janeiro de 2026  
**Motivo:** API Key exposta no frontend estava sendo usada por terceiros
