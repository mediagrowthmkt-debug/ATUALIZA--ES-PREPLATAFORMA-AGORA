# 🎨 Exemplo Visual - Configuração Make.com

## 📋 Cenário Make.com - Passo a Passo

### Módulo 1: Webhook (Gatilho)
```
Trigger: Quando formulário for preenchido
```

### Módulo 2: HTTP Request (Enviar para Plataforma)
```
URL: https://[region]-[project].cloudfunctions.net/receiveLead?uid=XXX&client=YYY&token=ZZZ
Method: POST
Content Type: application/json
```

### Body (JSON) - Exemplo Google Ads:
```json
{
  "name": "{{1.nome}}",
  "email": "{{1.email}}",
  "phone": "{{1.telefone}}",
  "question": "{{1.mensagem}}",
  "plataforma": "Google",
  "source": "Google Ads - {{1.campanha}}",
  "tags": ["GOOGLEADS", "{{1.tag_personalizada}}"]
}
```

### Body (JSON) - Exemplo Meta Ads:
```json
{
  "name": "{{1.nome}}",
  "email": "{{1.email}}",
  "phone": "{{1.telefone}}",
  "question": "{{1.mensagem}}",
  "plataforma": "Meta",
  "source": "Instagram - {{1.campanha}}",
  "tags": ["METAFACEBOOK", "{{1.tag_personalizada}}"]
}
```

## 🔄 Detecção Automática (Avançado)

Se você quer um único cenário que detecta automaticamente:

### Módulo 2.5: Set Variable (entre webhook e HTTP)
```
Nome da Variável: plataforma
Valor: 
{{if(contains({{1.utm_source}}; "google"); "Google"; 
   if(contains({{1.utm_source}}; "facebook"); "Meta"; 
   if(contains({{1.utm_source}}; "instagram"); "Meta"; "")))}}
```

### Então no Body do HTTP:
```json
{
  "name": "{{1.nome}}",
  "email": "{{1.email}}",
  "phone": "{{1.telefone}}",
  "question": "{{1.mensagem}}",
  "plataforma": "{{2.plataforma}}",
  "source": "{{1.utm_source}} - {{1.utm_campaign}}",
  "tags": ["{{1.utm_medium}}"]
}
```

## 📸 Estrutura Visual do Cenário

```
┌─────────────────┐
│  Webhook Form   │
│   (Trigger)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Set Variable   │ (opcional - auto-detect)
│  plataforma     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  HTTP Request   │
│  POST to        │
│  receiveLead    │
└─────────────────┘
```

## ✅ Checklist de Configuração

- [ ] URL do webhook copiada da plataforma
- [ ] Method = POST
- [ ] Content-Type = application/json  
- [ ] Body configurado com os campos obrigatórios (name, email, phone, question)
- [ ] Campo `plataforma` adicionado com valor "Google" ou "Meta"
- [ ] Testado com um lead de exemplo
- [ ] Verificado na aba "Gestão de Leads" da plataforma

## 🎯 Campos Obrigatórios vs Opcionais

### ✅ Obrigatórios (mínimo)
- `name` - Nome do lead
- `email` - E-mail do lead

### 📋 Recomendados
- `phone` - Telefone
- `question` - Pergunta/orçamento
- `plataforma` - **"Google"** ou **"Meta"**
- `source` - Fonte/campanha

### 🏷️ Opcionais
- `tags` - Array de tags para categorização

## 🔐 Onde Encontrar a URL

1. Acesse a plataforma
2. Vá em **Gestão de Leads**
3. Clique em **Copiar URL**
4. Cole no Make.com no campo URL do módulo HTTP

---

**Dica:** Crie cenários separados (um para Google, outro para Meta) para simplificar! 💡
