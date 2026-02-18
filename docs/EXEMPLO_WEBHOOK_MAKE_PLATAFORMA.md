# 📝 Exemplo de Webhook para Make.com - COM PLATAFORMA

## ✅ FORMATO ATUAL (COM DETECÇÃO DE PLATAFORMA)

### Webhook URL
```
https://us-central1-mediagrowth-a5349.cloudfunctions.net/receiveLead?uid=XXXXX&client=YYYYY&token=ZZZZZ
```

### Body JSON - Exemplo Completo

```json
{
  "name": "{{1.name}}",
  "email": "{{1.email}}",
  "phone": "{{1.phone}}",
  "question": "{{1.budget}} - orçamento/tipo de projeto? *",
  "plataforma": "{{if(contains({{1.page_url}}; 'google'); 'Google'; if(contains({{1.page_url}}; 'meta'); 'Meta'; ''))}}",
  "source": "{{1.fonte}}{{1.campaign_name}}",
  "tags": ["{{if(contains({{1.page_url}}; 'google'); 'GOOGLEADS'; 'METAFACEBOOK')}}"]
}
```

## 🎯 Detecção Automática Simplificada

### Opção 1: Por Slug/URL da Página

Se suas páginas têm URLs como:
- `https://seusite.com/google-ads/formulario`
- `https://seusite.com/meta-ads/formulario`

```json
{
  "plataforma": "{{if(contains({{1.page_url}}; '/google'); 'Google'; 'Meta')}}"
}
```

### Opção 2: Por Campo Oculto (MAIS SIMPLES)

**Recomendado!** Adicione no formulário HTML:

```html
<!-- Formulário da página Google -->
<input type="hidden" name="plataforma" value="Google">

<!-- Formulário da página Meta -->
<input type="hidden" name="plataforma" value="Meta">
```

No Make.com:
```json
{
  "plataforma": "{{1.plataforma}}"
}
```

### Opção 3: Por Parâmetro UTM

```json
{
  "plataforma": "{{if({{1.utm_source}} = 'google'; 'Google'; if({{1.utm_source}} = 'facebook'; 'Meta'; ''))}}"
}
```

## 📋 Webhook Completo - Exemplo Real Google Ads

```json
{
  "name": "João da Silva",
  "email": "joao.silva@gmail.com",
  "phone": "+5511987654321",
  "question": "R$ 5.000 - Criação de site institucional",
  "plataforma": "Google",
  "source": "Google Ads - Campanha Sites 2025",
  "tags": ["GOOGLEADS", "SITE", "INSTITUCIONAL"]
}
```

## 📋 Webhook Completo - Exemplo Real Meta Ads

```json
{
  "name": "Maria Santos",
  "email": "maria.santos@outlook.com",
  "phone": "+5511976543210",
  "question": "R$ 3.000 - Gestão de Redes Sociais",
  "plataforma": "Meta",
  "source": "Instagram - Campanha Social Media 2025",
  "tags": ["METAFACEBOOK", "SOCIAL", "GESTAO"]
}
```

## 🔧 Configuração no Make.com

### Passo 1: HTTP Module
1. Escolha "Make a request"
2. **URL**: Cole a URL do webhook gerada no dashboard
3. **Method**: POST
4. **Headers**: 
   ```
   Content-Type: application/json
   ```

### Passo 2: Body (JSON)

Cole exatamente assim:

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

**OU** com detecção automática:

```json
{
  "name": "{{1.name}}",
  "email": "{{1.email}}",
  "phone": "{{1.phone}}",
  "question": "{{1.budget}} - orçamento/tipo de projeto? *",
  "plataforma": "{{1.plataforma}}",
  "source": "{{1.fonte}}{{1.campaign_name}}",
  "tags": ["{{if({{1.plataforma}} = 'Google'; 'GOOGLEADS'; 'METAFACEBOOK')}}"]
}
```

## 🎨 Como Aparece no Dashboard

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Nome          │ E-mail         │ Telefone      │ Pergunta                │
├──────────────────────────────────────────────────────────────────────────┤
│ João Silva    │ joao@gmail.com │ +5511987...   │ R$ 5.000 - Site         │
│                                                                           │
│ PLATAFORMA    │ Fonte                           │ Quando                  │
├──────────────────────────────────────────────────────────────────────────┤
│ GOOGLE 🟡     │ Google Ads - Campanha Sites    │ 04/11/2025 14:30       │
└──────────────────────────────────────────────────────────────────────────┘
```

## 🚨 Importante

- ✅ O campo `plataforma` é **opcional** mas recomendado
- ✅ Valores aceitos: "Google", "Meta", ou vazio
- ✅ Case-insensitive (google, GOOGLE, Google - todos funcionam)
- ✅ Se não enviar, aparece "-" no dashboard

## 📞 Teste

Para testar o webhook, use este exemplo com curl:

```bash
curl -X POST "SUA_URL_WEBHOOK_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Lead",
    "email": "teste@example.com",
    "phone": "+5511999999999",
    "question": "R$ 1.000 - Teste",
    "plataforma": "Google",
    "source": "Teste Manual",
    "tags": ["TESTE"]
  }'
```

Resposta esperada:
```json
{
  "ok": true,
  "id": "ABC123XYZ"
}
```
