# ⚡ Quick Setup - Plataforma Dinâmica no Make.com

## 🎯 Configuração em 3 Passos

### PASSO 1: Adicionar Set Variable no Make.com

Entre o **Webhook** e o **HTTP Request**, adicione:

**Módulo:** Tools > Set Variable

**Variável:** `plataforma_detectada`

**Valor (Cole esta fórmula):**
```
{{if(contains(lower({{1.utm_source}}); "google"); "Google"; if(contains(lower({{1.utm_source}}); "facebook"); "Meta"; if(contains(lower({{1.utm_source}}); "instagram"); "Meta"; if(contains(lower({{1.utm_source}}); "meta"); "Meta"; "Meta"))))}}
```

---

### PASSO 2: Atualizar HTTP Request Body

**Altere de:**
```json
"plataforma": "1.traffic_source 1. meta: campaignName"
```

**Para:**
```json
"plataforma": "{{2.plataforma_detectada}}"
```

---

### PASSO 3: JSON Completo

```json
{
  "name": "{{1. name}}",
  "email": "{{1. email}}",
  "phone": "{{1. phone}}",
  "plataforma": "{{2.plataforma_detectada}}",
  "question": "{{1.budget}} {{1. project_type}} - orçamento/tipo de projeto? *",
  "source": "{{1.fonte}} {{1.campaign_name}}",
  "tags": ["{{if({{2.plataforma_detectada}} = 'Meta'; 'METAFACEBOOK'; 'GOOGLEADS')}}"]
}
```

---

## ✅ Pronto!

Agora o campo `plataforma` será preenchido automaticamente:
- **"Google"** se vier do Google Ads
- **"Meta"** se vier do Facebook/Instagram

---

## 🔍 Alternativas Simples

### Opção 1: Baseado em GCLID/FBCLID (Mais Confiável)
```
{{if(exists({{1.gclid}}); "Google"; if(exists({{1.fbclid}}); "Meta"; "Meta"))}}
```

### Opção 2: Baseado em Nome da Campanha
```
{{if(contains(lower({{1.campaign_name}}); "google"); "Google"; "Meta")}}
```

### Opção 3: Campo Fixo Manual
Se preferir separar os cenários:
- **Cenário Google:** `"plataforma": "Google"`
- **Cenário Meta:** `"plataforma": "Meta"`

---

**Dica:** Use sempre **"Meta"** como fallback para capturar Facebook e Instagram! 🎯
