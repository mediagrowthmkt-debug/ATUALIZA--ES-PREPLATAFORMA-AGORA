# 🎯 README - Campo PLATAFORMA em Leads

## ⚡ Quick Start

### O que foi adicionado?
Uma nova coluna **PLATAFORMA** na aba de Leads para identificar se o lead veio do **Google Ads** ou **Meta Ads**.

---

## 🚀 Implementação em 3 Passos

### 1️⃣ Deploy do Backend
```bash
cd functions
npm run build
firebase deploy --only functions:receiveLead
```

### 2️⃣ Atualizar Make.com
Adicione o campo `plataforma` no seu webhook:

```json
{
  "name": "{{1.name}}",
  "email": "{{1.email}}",
  "phone": "{{1.phone}}",
  "question": "{{1.budget}} - orçamento/tipo de projeto? *",
  "plataforma": "Google",
  "source": "{{1.fonte}}{{1.campaign_name}}",
  "tags": ["GOOGLEADS"]
}
```

### 3️⃣ Testar
Envie um lead de teste e verifique se a coluna PLATAFORMA aparece no dashboard.

---

## 📝 3 Formas de Implementar

### Opção A: Campo Oculto (RECOMENDADO) ⭐

**Formulário Google:**
```html
<input type="hidden" name="plataforma" value="Google">
```

**Formulário Meta:**
```html
<input type="hidden" name="plataforma" value="Meta">
```

**Make.com:**
```json
{
  "plataforma": "{{1.plataforma}}"
}
```

### Opção B: Valor Fixo por Fluxo

**Fluxo Make.com para Google:**
```json
{
  "plataforma": "Google"
}
```

**Fluxo Make.com para Meta:**
```json
{
  "plataforma": "Meta"
}
```

### Opção C: Detecção Automática por URL

```json
{
  "plataforma": "{{if(contains({{1.page_url}}; 'google'); 'Google'; 'Meta')}}"
}
```

---

## 📋 Webhook Completo - Exemplo

### Para Google Ads:
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "+5511987654321",
  "question": "R$ 5.000 - Criação de site",
  "plataforma": "Google",
  "source": "Google Ads - Campanha Sites 2025",
  "tags": ["GOOGLEADS", "SITE"]
}
```

### Para Meta Ads:
```json
{
  "name": "Maria Santos",
  "email": "maria@email.com",
  "phone": "+5511976543210",
  "question": "R$ 3.000 - Social Media",
  "plataforma": "Meta",
  "source": "Instagram - Campanha Social 2025",
  "tags": ["METAFACEBOOK", "SOCIAL"]
}
```

---

## 🎨 Como Aparece no Dashboard

```
┌───────────────────────────────────────────────────────────────────┐
│ Nome      │ E-mail       │ Telefone   │ Pergunta                  │
│ João      │ joao@...     │ +5511...   │ R$ 5.000 - Site           │
│                                                                    │
│ 🟡 PLATAFORMA │ Fonte                  │ Quando                   │
│ GOOGLE        │ Google Ads - Camp...   │ 04/11/2025 14:30        │
└───────────────────────────────────────────────────────────────────┘
```

A coluna aparece em **amarelo** e **MAIÚSCULAS**.

---

## ✅ Checklist Rápido

- [ ] Cloud Functions deployadas
- [ ] Make.com atualizado com campo `plataforma`
- [ ] Formulário tem campo oculto (se usar Opção A)
- [ ] Teste enviado com sucesso
- [ ] Coluna PLATAFORMA aparece no dashboard
- [ ] Valor correto ("GOOGLE" ou "META")

---

## 🧪 Teste Rápido

### Via cURL:
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

**Resposta esperada:**
```json
{"ok": true, "id": "abc123"}
```

---

## 📚 Documentação Completa

- **RESUMO_ALTERACOES_PLATAFORMA.md** - Resumo executivo
- **WEBHOOK_LEADS_PLATAFORMA.md** - Documentação técnica completa
- **EXEMPLO_WEBHOOK_MAKE_PLATAFORMA.md** - Exemplos práticos
- **EXEMPLO_VISUAL_WEBHOOK.md** - Guia visual passo a passo
- **CHANGELOG_PLATAFORMA.md** - Histórico de mudanças

---

## 🔄 Compatibilidade

✅ **100% retrocompatível**
- Webhooks antigos continuam funcionando
- Leads sem plataforma mostram "-"
- Campo é opcional

✅ **Aceita variações:**
- `plataforma` ou `platform`
- "Google", "google", "GOOGLE"
- "Meta", "meta", "META"

---

## ❓ FAQ

### P: O campo é obrigatório?
**R:** Não. É opcional. Leads sem plataforma mostram "-".

### P: Posso usar outros valores além de Google/Meta?
**R:** Sim, mas recomendamos apenas "Google" e "Meta" para consistência.

### P: Leads antigos vão aparecer?
**R:** Sim, com "-" na coluna PLATAFORMA.

### P: Funciona em mobile?
**R:** Sim, totalmente responsivo.

### P: Como filtrar por plataforma?
**R:** Por enquanto, visual apenas. Filtro será adicionado em versão futura.

---

## 🐛 Troubleshooting

### Coluna não aparece
1. Limpe o cache do navegador (Ctrl+F5)
2. Verifique se o arquivo `index.html` foi atualizado
3. Confira o console do navegador (F12)

### Webhook retorna erro
1. Verifique o token na URL
2. Confirme que `uid`, `client` e `token` estão corretos
3. Teste com curl para isolar o problema

### Valor não aparece
1. Verifique se o campo está no body JSON
2. Confira o nome: `plataforma` ou `platform`
3. Veja os logs do Firebase Functions

---

## 🎉 Pronto!

Sua integração está completa. Agora você pode:
- ✅ Ver de qual plataforma vem cada lead
- ✅ Comparar performance Google vs Meta
- ✅ Tomar decisões baseadas em dados

---

**Dúvidas?** Consulte a documentação completa nos arquivos `.md` criados.

**Boa gestão de leads! 🚀**
