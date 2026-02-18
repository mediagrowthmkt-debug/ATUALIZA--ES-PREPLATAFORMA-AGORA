# 🎯 EXEMPLO VISUAL - WEBHOOK ATUALIZADO

## Antes vs Agora

### ❌ FORMATO ANTIGO (sem plataforma)
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

### ✅ FORMATO NOVO (com plataforma - RECOMENDADO)
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

---

## 📊 Como Aparece no Dashboard

### ANTES
```
┌─────────────────────────────────────────────────────────────────────┐
│ Nome       │ E-mail         │ Telefone     │ Pergunta               │
│ João Silva │ joao@email.com │ +5511987...  │ R$ 5.000 - Site        │
│            │                │              │                        │
│ Fonte                       │ Quando                                │
│ Google Ads - Campanha Sites │ 04/11/2025 14:30                     │
└─────────────────────────────────────────────────────────────────────┘
```

### AGORA
```
┌──────────────────────────────────────────────────────────────────────────┐
│ Nome       │ E-mail         │ Telefone     │ Pergunta                    │
│ João Silva │ joao@email.com │ +5511987...  │ R$ 5.000 - Site             │
│            │                │              │                             │
│ 🟡 PLATAFORMA │ Fonte                     │ Quando                      │
│ GOOGLE        │ Google Ads - Campanha... │ 04/11/2025 14:30           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Cores e Estilos

```css
/* Coluna PLATAFORMA destacada */
.lead-plataforma {
  color: #fbbf24;        /* Amarelo dourado */
  font-size: .8rem;
  font-weight: 700;      /* Negrito */
  text-transform: uppercase;
}
```

### Resultado Visual:
- **GOOGLE** → Amarelo dourado, maiúsculas
- **META** → Amarelo dourado, maiúsculas
- **-** → Cinza (quando vazio)

---

## 🔄 Fluxo Completo no Make.com

### 1️⃣ Webhook Trigger (Formulário)
```
Novo lead preenche formulário
↓
Make.com recebe dados:
- name: "João Silva"
- email: "joao@email.com"
- phone: "+5511987654321"
- budget: "R$ 5.000"
- fonte: "Google Ads"
- campaign_name: " - Campanha Sites"
- plataforma: "Google"  ← NOVO CAMPO
```

### 2️⃣ HTTP Module (Enviar para Dashboard)
```json
POST https://us-central1-mediagrowth-a5349.cloudfunctions.net/receiveLead
?uid=ABC123
&client=XYZ789
&token=SECRET123

Body:
{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "+5511987654321",
  "question": "R$ 5.000 - orçamento/tipo de projeto? *",
  "plataforma": "Google",  ← NOVO CAMPO
  "source": "Google Ads - Campanha Sites",
  "tags": ["GOOGLEADS"]
}
```

### 3️⃣ Firestore (Dados Salvos)
```javascript
/usuarios/{uid}/clients/{clientId}/leads/{autoId}
{
  name: "João Silva",
  email: "joao@email.com",
  phone: "+5511987654321",
  question: "R$ 5.000 - orçamento/tipo de projeto? *",
  plataforma: "Google",  ← NOVO CAMPO
  source: "Google Ads - Campanha Sites",
  tags: ["GOOGLEADS"],
  status: "novo",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  agencyId: "ABC123",
  clientId: "XYZ789"
}
```

### 4️⃣ Dashboard (Exibição)
```
✅ Lead aparece na tabela com coluna PLATAFORMA = "GOOGLE"
```

---

## 💡 3 Formas de Definir a Plataforma

### Forma 1: Campo Oculto (MAIS SIMPLES)
```html
<!-- Formulário Google -->
<form>
  <input type="text" name="name" placeholder="Nome">
  <input type="email" name="email" placeholder="E-mail">
  <input type="tel" name="phone" placeholder="Telefone">
  <input type="hidden" name="plataforma" value="Google">
  <button>Enviar</button>
</form>

<!-- Formulário Meta -->
<form>
  <input type="text" name="name" placeholder="Nome">
  <input type="email" name="email" placeholder="E-mail">
  <input type="tel" name="phone" placeholder="Telefone">
  <input type="hidden" name="plataforma" value="Meta">
  <button>Enviar</button>
</form>
```

**No Make.com:**
```json
{
  "plataforma": "{{1.plataforma}}"
}
```

---

### Forma 2: Detecção por URL
```javascript
// Se a URL contém "google" → Google
// Se a URL contém "meta" ou "facebook" → Meta

// No Make.com (Router ou Set Variable):
if (página atual inclui "google") {
  plataforma = "Google"
} else if (página atual inclui "meta") {
  plataforma = "Meta"
} else {
  plataforma = ""
}
```

**No webhook JSON:**
```json
{
  "plataforma": "{{if(contains({{1.page_url}}; 'google'); 'Google'; 'Meta')}}"
}
```

---

### Forma 3: Fluxos Separados
```
Make.com Scenario 1 (Google)
↓
{
  "plataforma": "Google"
}

Make.com Scenario 2 (Meta)
↓
{
  "plataforma": "Meta"
}
```

---

## 🧪 Teste Rápido

### Via cURL:
```bash
curl -X POST "https://us-central1-mediagrowth-a5349.cloudfunctions.net/receiveLead?uid=SEU_UID&client=SEU_CLIENT&token=SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Plataforma",
    "email": "teste@example.com",
    "phone": "+5511999999999",
    "question": "R$ 1.000 - Teste",
    "plataforma": "Google",
    "source": "Teste Manual"
  }'
```

### Resposta esperada:
```json
{
  "ok": true,
  "id": "abc123xyz"
}
```

### Verificar no Dashboard:
1. Acesse aba LEADS
2. Veja o lead "Teste Plataforma"
3. Confira coluna PLATAFORMA = "GOOGLE" (em amarelo)

---

## ✅ Checklist Pós-Deploy

- [ ] Cloud Functions atualizadas e deployed
- [ ] Dashboard atualizado (index.html)
- [ ] Webhook Make.com configurado com campo `plataforma`
- [ ] Teste enviado e verificado no dashboard
- [ ] Coluna PLATAFORMA aparece corretamente
- [ ] Leads antigos mostram "-" na coluna
- [ ] Novo lead com "Google" mostra "GOOGLE"
- [ ] Novo lead com "Meta" mostra "META"

---

## 🎉 Resultado Final

Agora você pode:
- ✅ Identificar visualmente de qual plataforma veio cada lead
- ✅ Filtrar/analisar leads por plataforma
- ✅ Comparar performance Google vs Meta
- ✅ Gerar relatórios segmentados por origem

**Boa gestão de leads! 🚀**
