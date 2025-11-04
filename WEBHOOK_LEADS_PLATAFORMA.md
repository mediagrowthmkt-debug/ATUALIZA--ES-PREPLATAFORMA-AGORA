# Webhook de Leads - Campo PLATAFORMA

## 📋 Resumo da Atualização

Foi adicionado o campo **PLATAFORMA** ao sistema de leads para identificar automaticamente se o lead veio do Google Ads ou Meta Ads (Facebook/Instagram).

## 🔧 Alterações Realizadas

### 1. Banco de Dados (Firebase Functions)
- ✅ Adicionado campo `plataforma` na função Cloud Function `receiveLead`
- ✅ O campo aceita os valores: "Google", "Meta", ou vazio

### 2. Interface do Dashboard
- ✅ Nova coluna "PLATAFORMA" na tabela de leads
- ✅ Estilo visual destacado (cor amarela) para fácil identificação
- ✅ Responsivo em dispositivos móveis

### 3. Grid Layout
- ✅ Ajustado grid de `1.2fr 1.2fr .9fr 2fr .8fr .8fr 50px` 
- ✅ Para `1.2fr 1.2fr .9fr 2fr .7fr .8fr .8fr 50px` (adicionando coluna PLATAFORMA)

## 📤 Novo Formato do Webhook

### Estrutura JSON Atualizada

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

### Exemplo para Google Ads

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "+5511999999999",
  "question": "R$ 5.000 - Criação de site",
  "plataforma": "Google",
  "source": "Google Ads - Campanha Site 2025",
  "tags": ["GOOGLEADS", "SITE"]
}
```

### Exemplo para Meta Ads

```json
{
  "name": "Maria Santos",
  "email": "maria@example.com",
  "phone": "+5511988888888",
  "question": "R$ 3.000 - Social Media",
  "plataforma": "Meta",
  "source": "Instagram - Campanha Social 2025",
  "tags": ["METAFACEBOOK", "SOCIAL"]
}
```

## 🎯 Como Detectar a Plataforma Automaticamente no Make.com

### Opção 1: Baseado na URL da Página

Se o formulário está em páginas diferentes:

```javascript
// No Make.com, use um módulo "Set Variable"
// Detecta pela URL referenciada

if ({{1.page_url}}.includes('google') || {{1.page_url}}.includes('gclid')) {
  plataforma = "Google";
} else if ({{1.page_url}}.includes('meta') || {{1.page_url}}.includes('fbclid')) {
  plataforma = "Meta";
} else {
  plataforma = "";
}
```

### Opção 2: Baseado em Parâmetros UTM

Se você usa UTM tags:

```javascript
// No Make.com
if ({{1.utm_source}} == "google" || {{1.utm_medium}} == "cpc") {
  plataforma = "Google";
} else if ({{1.utm_source}} == "facebook" || {{1.utm_source}} == "instagram") {
  plataforma = "Meta";
} else {
  plataforma = "";
}
```

### Opção 3: Campo Oculto no Formulário

Adicione um campo oculto no formulário HTML:

```html
<!-- Para página Google -->
<input type="hidden" name="plataforma" value="Google">

<!-- Para página Meta -->
<input type="hidden" name="plataforma" value="Meta">
```

E no Make.com, simplesmente use:

```json
{
  "plataforma": "{{1.plataforma}}"
}
```

### Opção 4: Slug da Página

Se usar slugs diferentes para cada plataforma (ex: `/google-ads` e `/meta-ads`):

```javascript
// No Make.com
const url = {{1.page_url}};
if (url.includes('/google')) {
  plataforma = "Google";
} else if (url.includes('/meta') || url.includes('/facebook')) {
  plataforma = "Meta";
} else {
  plataforma = "";
}
```

## 🎨 Visualização na Tabela

A coluna PLATAFORMA aparece entre "Pergunta" e "Fonte":

| Nome | E-mail | Telefone | Pergunta | **PLATAFORMA** | Fonte | Quando | Ações |
|------|--------|----------|----------|----------------|-------|--------|-------|
| João | joao@... | +55... | R$ 5.000 | **GOOGLE** | Google Ads | 04/11 | × |
| Maria | maria@... | +55... | R$ 3.000 | **META** | Instagram | 04/11 | × |

## 🔄 Compatibilidade

- ✅ O campo é **opcional** - leads antigos ou sem plataforma mostrarão "-"
- ✅ Aceita variações: `plataforma` ou `platform` no JSON
- ✅ Case-insensitive (Google, google, GOOGLE funcionam)
- ✅ Retrocompatível com webhooks existentes

## 📱 Mobile Responsivo

Em dispositivos móveis, o layout se ajusta automaticamente, mantendo a coluna PLATAFORMA visível.

## 🚀 Deploy

Para aplicar as alterações:

1. **Atualizar Cloud Functions:**
   ```bash
   cd functions
   npm run deploy
   ```

2. **Atualizar Dashboard:**
   - O arquivo `index.html` já foi atualizado
   - Faça commit e deploy das alterações

3. **Atualizar Make.com:**
   - Adicione o campo `plataforma` no módulo HTTP/Webhook
   - Configure a lógica de detecção (uma das opções acima)

## ❓ Suporte

Em caso de dúvidas sobre a implementação, consulte:
- Documentação do Firebase Functions
- Documentação do Make.com
- Código-fonte em `functions/src/index.ts` (linha do campo plataforma)
