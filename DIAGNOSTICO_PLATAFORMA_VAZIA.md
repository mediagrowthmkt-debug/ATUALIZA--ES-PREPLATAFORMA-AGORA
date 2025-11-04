# 🔍 Diagnóstico - Campo Plataforma Aparece Vazio

## 📊 Situação Atual

**Sintoma:** Você envia `"plataforma": "Meta"` do Make.com mas a coluna PLATAFORMA aparece com "-" (vazia).

**Verificado:**
- ✅ Make.com envia corretamente: `"plataforma": "Meta"`
- ✅ Backend (Cloud Function) tem código correto para receber o campo
- ✅ Frontend tem coluna PLATAFORMA na tabela
- ❌ Campo não aparece na interface

---

## 🎯 Ações Realizadas

### 1. Deploy das Cloud Functions
Foi executado deploy das Functions para garantir que o código atualizado esteja rodando:
```bash
firebase deploy --only functions:receiveLead
```

### 2. Debug Adicionado no Frontend
Logs foram adicionados no código JavaScript para rastrear os dados:
- Log quando carrega do Firestore
- Log quando renderiza na tela
- Log específico para leads de teste

---

## 🧪 Como Testar Agora

### Passo 1: Envie um Novo Lead de Teste

No Make.com, envie este JSON:

```json
{
  "name": "TESTE PLATAFORMA META",
  "email": "teste.plataforma@gmail.com",
  "phone": "3048204820",
  "plataforma": "Meta",
  "question": "Teste de plataforma META",
  "source": "Make.com - Teste Manual",
  "tags": ["TESTE", "DEBUG"]
}
```

### Passo 2: Abra o Console do Navegador

1. Pressione **F12** (ou Cmd+Option+I no Mac)
2. Vá na aba **Console**
3. Acesse a aba **Gestão de Leads** na plataforma

### Passo 3: Verifique os Logs

Procure por estas mensagens no console:

#### Se aparecer:
```
[FIRESTORE DEBUG] Lead de teste encontrado: abc123
[FIRESTORE DEBUG] Dados brutos: {name: "TESTE...", plataforma: "Meta", ...}
[FIRESTORE DEBUG] Campo plataforma: Meta
```
✅ **ÓTIMO!** O campo está sendo salvo no Firestore corretamente.

#### Se aparecer:
```
[FIRESTORE DEBUG] Lead de teste encontrado: abc123
[FIRESTORE DEBUG] Dados brutos: {name: "TESTE...", ...}
[FIRESTORE DEBUG] Campo plataforma: undefined
```
❌ **PROBLEMA!** O campo não está sendo salvo no Firestore.

---

## 🔧 Solução Baseada no Resultado

### Cenário A: Campo está no Firestore mas não aparece na tela
**Causa:** Problema de renderização no frontend  
**Solução:** Verificar CSS e HTML da coluna

### Cenário B: Campo NÃO está no Firestore
**Causa:** Cloud Function não está salvando o campo  
**Solução:** 
1. Aguardar o deploy completar (pode levar 2-5 minutos)
2. Tentar novamente após deploy

---

## 🎨 Verificação Visual Rápida

Execute estes comandos no Console do navegador (F12):

```javascript
// 1. Ver todos os leads
console.table(LEADS);

// 2. Ver apenas o campo plataforma de cada lead
LEADS.forEach((lead, i) => {
  console.log(`Lead ${i+1}: ${lead.name} → Plataforma: "${lead.plataforma || 'VAZIO'}"`);
});

// 3. Verificar estrutura do primeiro lead
console.log('Primeiro lead completo:', LEADS[0]);
console.log('Chaves do primeiro lead:', Object.keys(LEADS[0]));
```

---

## 📋 Checklist de Diagnóstico

- [ ] Deploy das Functions completou com sucesso
- [ ] Novo lead de teste foi enviado pelo Make.com
- [ ] Console do navegador está aberto (F12)
- [ ] Logs `[FIRESTORE DEBUG]` aparecem no console
- [ ] Campo `plataforma` aparece nos logs com valor "Meta"
- [ ] Coluna PLATAFORMA mostra o valor na tabela

---

## 🚨 Se Ainda Não Funcionar

### Verificação Direta no Firestore

1. Acesse: https://console.firebase.google.com/
2. Vá em **Firestore Database**
3. Navegue até: `usuarios/{seu-uid}/clients/{client-id}/leads`
4. Abra o último lead criado
5. Verifique se existe o campo **`plataforma`** com valor **"Meta"**

**Se o campo existe no Firestore:**
→ Problema está no frontend (renderização)

**Se o campo NÃO existe no Firestore:**
→ Aguarde o deploy completar e tente novamente

---

## ⏱️ Tempo de Deploy

O deploy das Cloud Functions pode levar:
- **Mínimo:** 2-3 minutos
- **Normal:** 5-7 minutos  
- **Máximo:** 10-15 minutos (primeira vez ou muitas mudanças)

**Aguarde o deploy completar antes de testar novamente!**

---

## 📞 Próximos Passos

1. **Aguarde 5 minutos** para o deploy completar
2. **Envie um novo lead de teste** com o JSON acima
3. **Abra o console (F12)** e verifique os logs
4. **Compartilhe os logs** que aparecem para diagnóstico final

---

**Atualização:** 04/11/2025 - 16:00  
**Status:** 🔧 Deploy em andamento + Debug adicionado  
**Próximo:** Aguardar deploy e testar
