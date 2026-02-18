# 🔐 SEGURANÇA: API Key da IA Movida para Backend

## Problema Resolvido
A API key do OpenRouter (`sk-or-v1-...`) estava **exposta no frontend**, permitindo que qualquer pessoa que inspecionasse o código pudesse usá-la.

## Solução Implementada

### 1. Firebase Function como Proxy
Criamos uma Firebase Function (`aiProxy`) que:
- Recebe as requisições do frontend
- Adiciona a API key (armazenada de forma segura no Firebase Secrets)
- Faz a chamada para o OpenRouter
- Retorna a resposta

### 2. Arquivos Modificados
- `functions/src/aiProxy.ts` - Nova função de proxy
- `functions/src/index.ts` - Exporta a nova função
- `index.html` - Remove a API key exposta, usa `callAIProxy()`

---

## ⚠️ AÇÃO NECESSÁRIA: Configurar a API Key no Firebase

### Passo 1: Configurar o Secret
```bash
cd functions
firebase functions:secrets:set OPENROUTER_API_KEY
```
Quando solicitado, cole sua API key: `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`

### Passo 2: Deploy das Functions
```bash
npm run build
firebase deploy --only functions
```

### Passo 3: Rotacionar a API Key (IMPORTANTE!)
Como a chave antiga foi exposta, **você deve gerar uma nova chave** no OpenRouter:

1. Acesse: https://openrouter.ai/keys
2. Revogue a chave antiga (`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`)
3. Crie uma nova chave
4. Configure a nova chave no Firebase:
   ```bash
   firebase functions:secrets:set OPENROUTER_API_KEY
   ```

---

## Como Funciona Agora

### Antes (INSEGURO ❌)
```
Frontend → API OpenRouter (com chave exposta no código)
```

### Agora (SEGURO ✅)
```
Frontend → Firebase Function → API OpenRouter (chave no servidor)
```

### Código no Frontend
```javascript
// Chamada segura via proxy
const data = await window.callAIProxy(model, messages, userId);
```

---

## Benefícios
1. ✅ **API key nunca exposta** no código do cliente
2. ✅ **Rate limiting** implementado (30 requests/minuto por usuário)
3. ✅ **Whitelist de modelos** - só modelos permitidos funcionam
4. ✅ **Logs de uso** para monitoramento no Firebase Console
5. ✅ **Autenticação opcional** via Firebase Auth (função `aiChat`)

---

## Monitoramento
Visualize os logs das chamadas no Firebase Console:
```bash
firebase functions:log --only aiProxy
```

---

## Estrutura Final
```
functions/
├── src/
│   ├── index.ts          # Exporta todas as functions
│   ├── aiProxy.ts        # 🆕 Proxy para API OpenRouter
│   └── sendEmailNotifications.ts
├── .env.example          # Exemplo de variáveis
└── package.json
```

---

## Checklist de Deploy

- [ ] Configurar OPENROUTER_API_KEY no Firebase Secrets
- [ ] Fazer build das functions (`npm run build`)
- [ ] Deploy das functions (`firebase deploy --only functions`)
- [ ] Deploy do frontend (`firebase deploy --only hosting`)
- [ ] Testar a IA na plataforma
- [ ] Rotacionar a API key no OpenRouter (criar nova, revogar antiga)
- [ ] Atualizar o secret com a nova chave

---

**Data:** 22/01/2026
**Autor:** Sistema de Segurança MediaGrowth
