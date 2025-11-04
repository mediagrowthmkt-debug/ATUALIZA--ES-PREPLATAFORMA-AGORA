# 🔍 DEBUG - Campo Plataforma Não Aparece

## Problema Reportado
O campo "plataforma" está sendo enviado corretamente do Make.com mas não está aparecendo na coluna PLATAFORMA da aba Leads.

## ✅ Checklist de Verificação

### 1. Verifique o Console do Navegador (F12)

Adicionei logs de debug no código. Abra o console do navegador (F12) e procure por:

```
[LEADS DEBUG] Total de leads: X
[LEADS DEBUG] Primeiro lead completo: {objeto com todos os campos}
[LEADS DEBUG] Campo plataforma do primeiro lead: "Google" ou "Meta" ou undefined
[LEADS DEBUG] Lead com plataforma: Nome - Plataforma: Google
```

**O que verificar:**
- ✅ Se o log mostra `plataforma: "Google"` ou `plataforma: "Meta"` → O campo está sendo salvo corretamente
- ❌ Se o log mostra `plataforma: undefined` ou `plataforma: ""` → O campo não está chegando no Firestore

### 2. Verifique Diretamente no Firestore

Acesse o Firebase Console:
1. Vá em **Firestore Database**
2. Navegue até: `usuarios/{seuUID}/clients/{clientID}/leads/{leadID}`
3. Verifique se o documento tem o campo **`plataforma`**

**Possíveis resultados:**
- ✅ Campo existe com valor "Google" ou "Meta" → Problema está no frontend
- ❌ Campo não existe → Problema está no backend (Make.com ou Cloud Function)

### 3. Verifique o JSON Enviado pelo Make.com

No Make.com, adicione um módulo "Tools > Set Variable" ANTES do HTTP Request para ver o JSON que está sendo enviado:

```json
{
  "name": "{{1.name}}",
  "email": "{{1.email}}",
  "phone": "{{1.phone}}",
  "question": "{{1.question}}",
  "plataforma": "{{1.plataforma}}",
  "source": "{{1.source}}"
}
```

**Verifique:**
- ✅ O campo `plataforma` aparece no JSON?
- ✅ O valor está correto ("Google" ou "Meta")?
- ❌ O campo está vazio ou undefined?

### 4. Teste Manual com cURL

Para garantir que o backend está funcionando, teste diretamente:

```bash
curl -X POST "https://[region]-[project].cloudfunctions.net/receiveLead?uid=[UID]&client=[CLIENT]&token=[TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Manual",
    "email": "teste@teste.com",
    "phone": "+5511999999999",
    "question": "Teste de plataforma",
    "plataforma": "Google",
    "source": "Teste Manual"
  }'
```

Depois vá na aba Leads e veja se apareceu com a plataforma "GOOGLE" preenchida.

### 5. Verifique o Nome do Campo

A Cloud Function aceita **DOIS** nomes:
- `plataforma` (português)
- `platform` (inglês)

**Tente enviar com os dois nomes:**

```json
{
  "name": "Teste",
  "email": "teste@teste.com",
  "phone": "+5511999999999",
  "question": "Teste",
  "plataforma": "Google",
  "platform": "Google",
  "source": "Teste"
}
```

## 🐛 Problemas Comuns e Soluções

### Problema 1: Case Sensitivity
**Sintoma:** Envia "google" mas não aparece  
**Solução:** Use primeira letra maiúscula: "Google" ou "Meta"

### Problema 2: Espaços ou Caracteres Especiais
**Sintoma:** Envia " Google " (com espaços) mas não aparece  
**Solução:** Remova espaços. Use exatamente: "Google" ou "Meta"

### Problema 3: Campo Aninhado
**Sintoma:** O JSON está assim:
```json
{
  "data": {
    "plataforma": "Google"
  }
}
```
**Solução:** O campo deve estar no nível raiz:
```json
{
  "plataforma": "Google"
}
```

### Problema 4: Cache do Navegador
**Sintoma:** Alterações não aparecem  
**Solução:** 
1. Pressione `Ctrl+Shift+R` (Windows) ou `Cmd+Shift+R` (Mac)
2. Ou limpe o cache do navegador
3. Ou teste em aba anônima

### Problema 5: Versão Antiga das Functions
**Sintoma:** O código foi atualizado mas não funciona  
**Solução:** Fazer deploy das Cloud Functions:
```bash
cd functions
npm run deploy
```

## 🔧 Código de Teste para Make.com

Cole este JSON no módulo HTTP do Make.com para teste:

```json
{
  "name": "TESTE PLATAFORMA",
  "email": "teste.plataforma@teste.com",
  "phone": "+5511999999999",
  "question": "Testando campo plataforma - deve aparecer GOOGLE",
  "plataforma": "Google",
  "source": "Teste Manual Make.com",
  "tags": ["TESTE", "DEBUG"]
}
```

Depois de enviar, vá na aba Leads e procure por "TESTE PLATAFORMA". A coluna PLATAFORMA deve mostrar "GOOGLE".

## 📊 Interpretando os Resultados

### Se o console mostra o campo mas não aparece na tela:
→ Problema de CSS ou renderização  
→ Solução: Verifique se o CSS está carregado corretamente (F12 > Sources)

### Se o console NÃO mostra o campo:
→ Problema no Firestore (dados não foram salvos)  
→ Solução: Verifique o Make.com e a Cloud Function

### Se o Firestore TEM o campo mas o console não mostra:
→ Problema na query/subscribe  
→ Solução: Verifique se você está logado no cliente correto

## 🚨 Verificação Rápida - 1 Minuto

Execute estes comandos no console do navegador (F12):

```javascript
// 1. Verificar se tem leads carregados
console.log('Leads carregados:', LEADS.length);

// 2. Verificar primeiro lead
console.log('Primeiro lead:', LEADS[0]);

// 3. Verificar campo plataforma especificamente
console.log('Plataforma do primeiro lead:', LEADS[0]?.plataforma);

// 4. Verificar todos os campos plataforma
LEADS.forEach((lead, i) => {
  console.log(`Lead ${i}: ${lead.name} - Plataforma: "${lead.plataforma}"`);
});
```

## 📞 Próximos Passos

1. **Execute o checklist acima**
2. **Anote os resultados** de cada verificação
3. **Compartilhe os logs do console** para análise mais profunda

---

**Atualização:** 04/11/2025  
**Status:** Código correto - Investigando motivo de não aparecer
