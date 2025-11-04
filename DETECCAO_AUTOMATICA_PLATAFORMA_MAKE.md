# 🤖 Detecção Automática de Plataforma no Make.com

## 🎯 Objetivo
Configurar o Make.com para detectar **automaticamente** se o lead veio do Google Ads ou Meta Ads (Facebook/Instagram) e preencher o campo `plataforma` dinamicamente.

---

## 📋 Método Recomendado: Set Variable + Lógica Condicional

### Passo 1: Adicionar Módulo "Set Variable"

No Make.com, **ANTES** do módulo HTTP Request, adicione:

1. Clique no **+** entre o trigger e o HTTP Request
2. Busque por **"Tools"** → **"Set Variable"**
3. Adicione o módulo

### Passo 2: Configurar a Variável

**Nome da variável:** `plataforma_detectada`

**Valor da variável:** Escolha uma das fórmulas abaixo:

#### Opção A: Baseado em UTM Source (Mais Confiável)
```javascript
{{if(contains(lower({{1.utm_source}}); "google"); "Google"; if(contains(lower({{1.utm_source}}); "facebook"); "Meta"; if(contains(lower({{1.utm_source}}); "instagram"); "Meta"; if(contains(lower({{1.utm_source}}); "meta"); "Meta"; if(contains(lower({{1.utm_medium}}); "cpc"); "Google"; "")))))}}
```

**Como funciona:**
- Se `utm_source` contém "google" → Retorna "Google"
- Se `utm_source` contém "facebook" → Retorna "Meta"
- Se `utm_source` contém "instagram" → Retorna "Meta"
- Se `utm_source` contém "meta" → Retorna "Meta"
- Se `utm_medium` é "cpc" → Retorna "Google" (fallback)
- Senão → Retorna vazio

#### Opção B: Baseado em URL da Página
```javascript
{{if(contains(lower({{1.page_url}}); "google"); "Google"; if(contains(lower({{1.page_url}}); "facebook"); "Meta"; if(contains(lower({{1.page_url}}); "instagram"); "Meta"; if(contains(lower({{1.page_url}}); "meta"); "Meta"; ""))))}}
```

#### Opção C: Baseado em Nome da Campanha
```javascript
{{if(contains(lower({{1.campaign_name}}); "google"); "Google"; if(contains(lower({{1.campaign_name}}); "meta"); "Meta"; if(contains(lower({{1.campaign_name}}); "facebook"); "Meta"; if(contains(lower({{1.campaign_name}}); "instagram"); "Meta"; if(contains(lower({{1.campaign_name}}); "fb"); "Meta"; "")))))}}
```

#### Opção D: Baseado em Parâmetro GCLID/FBCLID
```javascript
{{if(exists({{1.gclid}}); "Google"; if(exists({{1.fbclid}}); "Meta"; ""))}}
```

**Explicação:**
- `gclid` = Google Click ID (presente em links do Google Ads)
- `fbclid` = Facebook Click ID (presente em links do Facebook/Instagram)

### Passo 3: Usar a Variável no HTTP Request

No módulo **HTTP Request**, no campo **Body**:

```json
{
  "name": "{{1. name}}",
  "email": "{{1. email}}",
  "phone": "{{1. phone}}",
  "plataforma": "{{2.plataforma_detectada}}",
  "question": "{{1.budget}} {{1. project_type}} - orçamento/tipo de projeto? *",
  "source": "{{1. meta: campaignUrl}} {{1.fonte}} {{1.campaign_name}}",
  "tags": ["{{if({{2.plataforma_detectada}} = 'Meta'; 'METAFACEBOOK'; if({{2.plataforma_detectada}} = 'Google'; 'GOOGLEADS'; 'OUTROS'))}}"]
}
```

**Nota:** `{{2.plataforma_detectada}}` é o módulo 2 (Set Variable). Ajuste o número conforme a ordem dos seus módulos.

---

## 🎨 Estrutura Visual do Cenário

```
┌──────────────────┐
│   Webhook Form   │
│    (Módulo 1)    │
│   Trigger/Input  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Set Variable    │
│    (Módulo 2)    │
│  plataforma_     │
│   detectada      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  HTTP Request    │
│    (Módulo 3)    │
│  POST to         │
│  receiveLead     │
└──────────────────┘
```

---

## 🧪 Exemplos de Detecção

### Exemplo 1: Lead do Google Ads

**Entrada (Módulo 1):**
```
utm_source: google
utm_medium: cpc
utm_campaign: campanha_site_2025
```

**Set Variable (Módulo 2):**
```
plataforma_detectada: "Google"
```

**HTTP Body (Módulo 3):**
```json
{
  "plataforma": "Google",
  "tags": ["GOOGLEADS"]
}
```

**Resultado na Plataforma:**
```
Coluna PLATAFORMA: GOOGLE (destacado em amarelo)
```

---

### Exemplo 2: Lead do Instagram

**Entrada (Módulo 1):**
```
utm_source: instagram
utm_medium: social
utm_campaign: campanha_instagram_2025
```

**Set Variable (Módulo 2):**
```
plataforma_detectada: "Meta"
```

**HTTP Body (Módulo 3):**
```json
{
  "plataforma": "Meta",
  "tags": ["METAFACEBOOK"]
}
```

**Resultado na Plataforma:**
```
Coluna PLATAFORMA: META (destacado em amarelo)
```

---

### Exemplo 3: Lead do Facebook

**Entrada (Módulo 1):**
```
utm_source: facebook
fbclid: IwAR123456789...
```

**Set Variable (Módulo 2):**
```
plataforma_detectada: "Meta"
```

**HTTP Body (Módulo 3):**
```json
{
  "plataforma": "Meta",
  "tags": ["METAFACEBOOK"]
}
```

**Resultado na Plataforma:**
```
Coluna PLATAFORMA: META (destacado em amarelo)
```

---

## 🔄 Fórmula Completa (Todas as Verificações)

Se você quer uma fórmula que verifica **tudo**, use esta no Set Variable:

```javascript
{{if(exists({{1.gclid}}); "Google"; if(exists({{1.fbclid}}); "Meta"; if(contains(lower({{1.utm_source}}); "google"); "Google"; if(contains(lower({{1.utm_source}}); "facebook"); "Meta"; if(contains(lower({{1.utm_source}}); "instagram"); "Meta"; if(contains(lower({{1.utm_source}}); "meta"); "Meta"; if(contains(lower({{1.utm_medium}}); "cpc"); "Google"; if(contains(lower({{1.page_url}}); "google"); "Google"; if(contains(lower({{1.page_url}}); "facebook"); "Meta"; if(contains(lower({{1.page_url}}); "instagram"); "Meta"; ""))))))))))}}
```

**Ordem de verificação:**
1. Se existe `gclid` → Google
2. Se existe `fbclid` → Meta
3. Se `utm_source` contém "google" → Google
4. Se `utm_source` contém "facebook" → Meta
5. Se `utm_source` contém "instagram" → Meta
6. Se `utm_source` contém "meta" → Meta
7. Se `utm_medium` é "cpc" → Google
8. Se `page_url` contém "google" → Google
9. Se `page_url` contém "facebook" → Meta
10. Se `page_url` contém "instagram" → Meta
11. Senão → Vazio

---

## 📋 Checklist de Implementação

- [ ] Módulo "Set Variable" adicionado ANTES do HTTP Request
- [ ] Variável nomeada (ex: `plataforma_detectada`)
- [ ] Fórmula de detecção configurada
- [ ] HTTP Request usa `{{2.plataforma_detectada}}` no campo `plataforma`
- [ ] Testado com lead do Google
- [ ] Testado com lead do Meta/Facebook/Instagram
- [ ] Verificado na plataforma que aparece corretamente

---

## 🐛 Troubleshooting

### Problema: Retorna vazio
**Causa:** Nenhuma condição foi atendida  
**Solução:** Adicione um valor padrão:
```javascript
{{if(...; ...; "Meta")}}  // "Meta" como fallback no final
```

### Problema: Sempre retorna o mesmo valor
**Causa:** A primeira condição sempre é verdadeira  
**Solução:** Verifique a ordem das condições e use `lower()` para case-insensitive

### Problema: Não reconhece variável do módulo 1
**Causa:** Nome da variável incorreto  
**Solução:** Clique na variável no painel lateral do Make.com para inserir automaticamente

### Problema: Erro de sintaxe
**Causa:** Parênteses ou aspas mal fechadas  
**Solução:** Use a fórmula pronta acima e ajuste apenas os nomes das variáveis

---

## 🎯 Recomendação Final

**Para máxima confiabilidade, use esta configuração:**

1. **Set Variable** com a fórmula baseada em `gclid`/`fbclid` + `utm_source`
2. **HTTP Request** usando `{{2.plataforma_detectada}}`
3. **Tags dinâmicas** baseadas no valor detectado

**JSON Final:**
```json
{
  "name": "{{1. name}}",
  "email": "{{1. email}}",
  "phone": "{{1. phone}}",
  "plataforma": "{{2.plataforma_detectada}}",
  "question": "{{1.budget}} {{1. project_type}} - orçamento/tipo de projeto? *",
  "source": "{{1.campaign_name}} - {{1.utm_source}}/{{1.utm_medium}}",
  "tags": ["{{if({{2.plataforma_detectada}} = 'Meta'; 'METAFACEBOOK'; 'GOOGLEADS')}}"]
}
```

---

**Data:** 04/11/2025  
**Status:** ✅ Configuração de detecção automática  
**Próximo passo:** Implementar Set Variable no Make.com
