# ✅ RESUMO DAS ALTERAÇÕES - CAMPO PLATAFORMA

## 📌 O que foi feito?

Foi adicionado o campo **PLATAFORMA** ao sistema de leads para identificar se o lead veio do **Google Ads** ou **Meta Ads** (Facebook/Instagram).

---

## 🔧 Arquivos Modificados

### 1. `/index.html` 
**Alterações:**
- ✅ Adicionada coluna "PLATAFORMA" na tabela de leads (entre "Pergunta" e "Fonte")
- ✅ Atualizado grid layout de 7 para 8 colunas
- ✅ Adicionado estilo CSS `.lead-plataforma` com cor amarela (#fbbf24)
- ✅ Atualizada função `renderLeadsList()` para exibir o campo plataforma
- ✅ Atualizada documentação do webhook no hint

### 2. `/functions/src/index.ts`
**Alterações:**
- ✅ Adicionado campo `plataforma` na função `receiveLead`
- ✅ Aceita tanto `body.plataforma` quanto `body.platform`
- ✅ Campo salvo no Firestore como `plataforma: string | null`

### 3. `/functions/lib/index.js` (compilado automaticamente)
- ✅ Código TypeScript compilado para JavaScript

---

## 📄 Arquivos de Documentação Criados

### 1. `WEBHOOK_LEADS_PLATAFORMA.md`
- Documentação técnica completa
- Exemplos de detecção automática
- Guia de deploy
- Estrutura JSON atualizada

### 2. `EXEMPLO_WEBHOOK_MAKE_PLATAFORMA.md`
- Exemplos práticos para Make.com
- Templates JSON prontos para usar
- Testes com curl
- Configuração passo a passo

---

## 🎯 Novo Formato do Webhook

### **ANTES** (sem plataforma):
```json
{
  "name": "{{1.name}}",
  "email": "{{1.email}}",
  "phone": "{{1.phone}}",
  "question": "{{1.budget}} - orçamento/tipo de projeto? *",
  "source": "{{1.fonte}}{{1.campaign_name}}",
  "tags": ["METAFACEBOOK"]
}
```

### **AGORA** (com plataforma):
```json
{
  "name": "{{1.name}}",
  "email": "{{1.email}}",
  "phone": "{{1.phone}}",
  "question": "{{1.budget}} - orçamento/tipo de projeto? *",
  "plataforma": "Meta",
  "source": "{{1.fonte}}{{1.campaign_name}}",
  "tags": ["METAFACEBOOK"]
}
```

**OU** com detecção automática por campo oculto:
```json
{
  "name": "{{1.name}}",
  "email": "{{1.email}}",
  "phone": "{{1.phone}}",
  "question": "{{1.budget}} - orçamento/tipo de projeto? *",
  "plataforma": "{{1.plataforma}}",
  "source": "{{1.fonte}}{{1.campaign_name}}",
  "tags": ["METAFACEBOOK"]
}
```

---

## 🎨 Visualização no Dashboard

### Antes:
```
| Nome | E-mail | Telefone | Pergunta | Fonte | Quando | × |
```

### Agora:
```
| Nome | E-mail | Telefone | Pergunta | PLATAFORMA | Fonte | Quando | × |
|------|--------|----------|----------|------------|-------|--------|---|
| João | joao@  | +55...   | R$ 5k    | GOOGLE     | Ads   | 04/11  | × |
| Maria| maria@ | +55...   | R$ 3k    | META       | IG    | 04/11  | × |
```

A coluna PLATAFORMA aparece em **amarelo destacado** para fácil identificação.

---

## 🚀 Como Implementar no Make.com

### **Opção 1: Campo Oculto no Formulário (RECOMENDADO)**

No seu formulário HTML da página Google:
```html
<input type="hidden" name="plataforma" value="Google">
```

No seu formulário HTML da página Meta:
```html
<input type="hidden" name="plataforma" value="Meta">
```

No Make.com, simplesmente use:
```json
{
  "plataforma": "{{1.plataforma}}"
}
```

### **Opção 2: Detecção por URL**

Se as páginas têm URLs diferentes (ex: `/google-ads` e `/meta-ads`):
```json
{
  "plataforma": "{{if(contains({{1.page_url}}; 'google'); 'Google'; 'Meta')}}"
}
```

### **Opção 3: Valor Fixo por Fluxo**

Se você tem fluxos separados no Make para cada plataforma:

Fluxo Google:
```json
{
  "plataforma": "Google"
}
```

Fluxo Meta:
```json
{
  "plataforma": "Meta"
}
```

---

## 📱 Responsividade

- ✅ Em desktop: todas as 8 colunas visíveis
- ✅ Em mobile: layout ajustado automaticamente
- ✅ Coluna PLATAFORMA sempre visível

---

## 🔄 Compatibilidade

- ✅ **100% retrocompatível** - leads antigos sem plataforma mostram "-"
- ✅ Campo é **opcional** - webhooks antigos continuam funcionando
- ✅ Aceita variações: `plataforma` ou `platform`
- ✅ Case-insensitive: Google, google, GOOGLE todos funcionam

---

## ✅ Checklist de Deploy

### 1. Backend (Firebase Functions)
```bash
cd functions
npm run deploy
```

### 2. Frontend (Dashboard)
- ✅ Arquivo `index.html` já atualizado
- Faça commit e push das alterações
- Deploy no Netlify/Firebase Hosting

### 3. Make.com
- [ ] Adicionar campo `plataforma` no webhook JSON
- [ ] Configurar detecção automática (escolher uma das opções)
- [ ] Testar com lead de teste
- [ ] Verificar no dashboard se aparece corretamente

---

## 🧪 Como Testar

### 1. Teste Manual via Dashboard
1. Acesse a aba LEADS
2. Copie a URL do webhook
3. Use curl ou Postman:
```bash
curl -X POST "URL_DO_WEBHOOK" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@example.com",
    "phone": "+5511999999999",
    "question": "R$ 1.000 - Teste",
    "plataforma": "Google",
    "source": "Teste"
  }'
```

### 2. Verificar no Dashboard
1. Recarregue a aba LEADS
2. Verifique se o lead aparece
3. Confira se a coluna PLATAFORMA mostra "GOOGLE"

---

## 📞 Suporte

Dúvidas? Consulte:
- `WEBHOOK_LEADS_PLATAFORMA.md` - Documentação técnica completa
- `EXEMPLO_WEBHOOK_MAKE_PLATAFORMA.md` - Exemplos práticos
- Código fonte em `functions/src/index.ts`

---

## 🎉 Pronto!

O sistema agora está preparado para:
- ✅ Receber leads com identificação de plataforma
- ✅ Exibir a origem (Google/Meta) de forma destacada
- ✅ Facilitar análise e relatórios por plataforma
- ✅ Manter compatibilidade com webhooks existentes
