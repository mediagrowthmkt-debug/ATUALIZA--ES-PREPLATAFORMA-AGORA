# 📋 Como Enviar o Campo "Plataforma" do Make.com

## Instruções Simples

Quando você enviar dados do **Make.com** para a plataforma através do webhook de leads, adicione o campo **`plataforma`** no JSON.

## ✅ Formato Correto

No Make.com, configure o módulo HTTP/Webhook para enviar o JSON assim:

```json
{
  "name": "{{1.name}}",
  "email": "{{1.email}}",
  "phone": "{{1.phone}}",
  "question": "{{1.question}}",
  "plataforma": "Google",
  "source": "{{1.source}}",
  "tags": ["GOOGLEADS"]
}
```

ou 

```json
{
  "name": "{{1.name}}",
  "email": "{{1.email}}",
  "phone": "{{1.phone}}",
  "question": "{{1.question}}",
  "plataforma": "Meta",
  "source": "{{1.source}}",
  "tags": ["METAFACEBOOK"]
}
```

## 🎯 Valores Aceitos para o Campo `plataforma`

- **"Google"** - Para leads do Google Ads
- **"Meta"** - Para leads do Meta Ads (Facebook/Instagram)
- **Vazio ou não enviar** - A plataforma mostrará "-"

## 📊 Como Vai Aparecer na Plataforma

Na seção **Gestão de Leads**, a coluna **PLATAFORMA** mostrará:

| Nome | E-mail | Telefone | Pergunta | **PLATAFORMA** | Fonte | Quando | Ações |
|------|--------|----------|----------|----------------|-------|--------|-------|
| João Silva | joao@... | +55... | R$ 5.000 | **GOOGLE** | Google Ads | 04/11 | × |
| Maria Santos | maria@... | +55... | R$ 3.000 | **META** | Instagram | 04/11 | × |

## 🔄 Como Detectar Automaticamente no Make.com

### Opção 1: Campo Fixo (Mais Simples)

Se você tem cenários separados no Make (um para Google, outro para Meta), apenas defina o valor fixo:

**Para Google Ads:**
```json
{
  "plataforma": "Google"
}
```

**Para Meta Ads:**
```json
{
  "plataforma": "Meta"
}
```

### Opção 2: Baseado em UTM (Dinâmico)

Se você quer detectar automaticamente, use um módulo "Set Variable" ou "Tools > Set Variable" no Make.com:

```javascript
// No campo da variável "plataforma":
{{if(contains({{1.utm_source}}; "google"); "Google"; if(contains({{1.utm_source}}; "facebook"); "Meta"; if(contains({{1.utm_source}}; "instagram"); "Meta"; "")))}}
```

### Opção 3: Campo Oculto no Formulário (Mais Confiável)

Adicione um campo oculto no seu formulário HTML:

**Página Google Ads:**
```html
<input type="hidden" name="plataforma" value="Google">
```

**Página Meta Ads:**
```html
<input type="hidden" name="plataforma" value="Meta">
```

E no Make.com, simplesmente use:
```json
{
  "plataforma": "{{1.plataforma}}"
}
```

## ⚠️ Importante

- O campo **`plataforma`** é **opcional**
- Se não enviar, vai aparecer "-" na coluna
- **Case-insensitive**: "Google", "google" ou "GOOGLE" funcionam
- Também aceita `platform` como alternativa para `plataforma`

## 🚀 Endpoint do Webhook

O endpoint do webhook é gerado automaticamente na plataforma:

```
https://[region]-[project].cloudfunctions.net/receiveLead?uid=[userId]&client=[clientId]&token=[securityToken]
```

**Onde encontrar:** Na própria plataforma, seção "Gestão de Leads", clique em "Copiar URL".

## ✨ Pronto!

Agora quando o Make.com enviar leads com o campo `plataforma`, ele aparecerá automaticamente na coluna **PLATAFORMA** da tabela de leads.

---

**Data da atualização:** 04/11/2025  
**Versão:** 1.0
