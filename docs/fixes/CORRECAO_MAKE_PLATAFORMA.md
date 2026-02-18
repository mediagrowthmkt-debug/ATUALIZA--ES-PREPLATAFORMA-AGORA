# 🔧 CORREÇÃO - Campo Plataforma no Make.com

## ❌ Problema Identificado

Você está enviando as **variáveis do Make.com** no campo `plataforma` em vez do **valor fixo**.

### Como está (ERRADO):
```json
{
  "name": "{{1. name}}",
  "email": "{{1. email}}",
  "phone": "{{1. phone}}",
  "plataforma": "1.traffic_source 1. meta: campaignName",  ← ERRADO!
  "question": "{{1.budget}} {{1. project_type}}",
  "source": "{{1. meta: campaignUrl}} {{1.fonte}} {{1.campaign_name}}",
  "tags": ["METAFACEBOOK"]
}
```

**Resultado:** A coluna PLATAFORMA mostra "1.TRAFFIC_SOURCE 1. META: CAMPAIGNNAME" ou fica vazia.

---

## ✅ Solução

O campo `plataforma` deve ter apenas **um valor fixo**: **"Meta"** ou **"Google"**.

### Como deve ser (CORRETO):

#### Para Meta Ads (Facebook/Instagram):
```json
{
  "name": "{{1. name}}",
  "email": "{{1. email}}",
  "phone": "{{1. phone}}",
  "plataforma": "Meta",                                    ← CORRETO!
  "question": "{{1.budget}} {{1. project_type}} - orçamento/tipo de projeto? *",
  "source": "{{1. meta: campaignUrl}} {{1.fonte}} {{1.campaign_name}}",
  "tags": ["METAFACEBOOK"]
}
```

#### Para Google Ads:
```json
{
  "name": "{{1. name}}",
  "email": "{{1. email}}",
  "phone": "{{1. phone}}",
  "plataforma": "Google",                                  ← CORRETO!
  "question": "{{1.budget}} {{1. project_type}} - orçamento/tipo de projeto? *",
  "source": "{{1. google: campaignUrl}} {{1.fonte}} {{1.campaign_name}}",
  "tags": ["GOOGLEADS"]
}
```

---

## 🎯 Diferença dos Campos

| Campo | Tipo | Exemplo Correto | Explicação |
|-------|------|----------------|------------|
| `plataforma` | **FIXO** | `"Meta"` ou `"Google"` | Identifica a origem do lead |
| `source` | **DINÂMICO** | `"{{1.campaign_name}}"` | Detalhes da campanha |
| `tags` | **ARRAY FIXO** | `["METAFACEBOOK"]` | Tags para categorização |

---

## 📋 Passo a Passo no Make.com

### Passo 1: Localize o Módulo HTTP Request

No seu cenário do Make.com, encontre o módulo que envia os dados para a plataforma (deve ser um **HTTP > Make a request** ou similar).

### Passo 2: Edite o Body (JSON)

Na seção **Body**, você vai ver algo assim:

```json
{
  "name": "{{1. name}}",
  "email": "{{1. email}}",
  "phone": "{{1. phone}}",
  "plataforma": "1.traffic_source 1. meta: campaignName",
  ...
}
```

### Passo 3: Altere o Campo Plataforma

**APAGUE** este trecho:
```
"plataforma": "1.traffic_source 1. meta: campaignName",
```

**SUBSTITUA** por:
```
"plataforma": "Meta",
```

### Passo 4: Resultado Final

O JSON completo deve ficar assim:

```json
{
  "name": "{{1. name}}",
  "email": "{{1. email}}",
  "phone": "{{1. phone}}",
  "plataforma": "Meta",
  "question": "{{1.budget}} {{1. project_type}} - orçamento/tipo de projeto? *",
  "source": "{{1. meta: campaignUrl}} {{1.fonte}} {{1.campaign_name}}",
  "tags": ["METAFACEBOOK"]
}
```

### Passo 5: Salve e Teste

1. Clique em **OK** para salvar
2. Execute o cenário com um lead de teste
3. Verifique na plataforma se a coluna **PLATAFORMA** mostra **"META"**

---

## 🔄 Se Você Tem Múltiplas Plataformas

### Opção 1: Cenários Separados (Mais Simples) ✅ RECOMENDADO

Crie **2 cenários diferentes**:

**Cenário A - Meta Ads:**
```json
{
  "plataforma": "Meta",
  "tags": ["METAFACEBOOK"]
}
```

**Cenário B - Google Ads:**
```json
{
  "plataforma": "Google",
  "tags": ["GOOGLEADS"]
}
```

### Opção 2: Detecção Automática (Avançado)

Se quiser um único cenário que detecta automaticamente, use um módulo **"Set Variable"** ANTES do HTTP:

**Módulo Set Variable:**
- Nome da variável: `plataforma`
- Valor: 
```javascript
{{if(contains({{1.utm_source}}; "facebook"); "Meta"; if(contains({{1.utm_source}}; "instagram"); "Meta"; if(contains({{1.utm_source}}; "google"); "Google"; "")))}}
```

**Depois no HTTP, use:**
```json
{
  "plataforma": "{{2.plataforma}}"
}
```

---

## ✅ Checklist de Verificação

Antes de salvar, verifique:

- [ ] Campo `plataforma` tem valor **"Meta"** ou **"Google"** (sem variáveis do Make)
- [ ] Não há `{{` ou `}}` no valor de `plataforma`
- [ ] Não há texto como "1.traffic_source" ou "1. meta: campaignName"
- [ ] O valor está entre **aspas duplas**: `"Meta"`
- [ ] Testou enviando um lead

---

## 🎨 Resultado Esperado

Após a correção, na aba **Gestão de Leads**, você verá:

```
┌──────────┬──────────┬──────────┬────────────┬──────────────┬─────────┬────────┐
│   Nome   │  E-mail  │ Telefone │  Pergunta  │  PLATAFORMA  │  Fonte  │ Quando │
├──────────┼──────────┼──────────┼────────────┼──────────────┼─────────┼────────┤
│ João     │ joao@... │ +55...   │ R$ 5.000   │  ┌────────┐  │ Insta   │ 04/11  │
│          │          │          │            │  │  META  │  │ Camp X  │        │
│          │          │          │            │  └────────┘  │         │        │
└──────────┴──────────┴──────────┴────────────┴──────────────┴─────────┴────────┘
```

---

## 🧪 JSON para Teste Rápido

Cole este JSON no Make.com para testar:

```json
{
  "name": "TESTE CORRECAO PLATAFORMA",
  "email": "teste.meta@example.com",
  "phone": "+5511999999999",
  "question": "R$ 3000 - Social Media - teste",
  "plataforma": "Meta",
  "source": "Instagram - Teste Manual",
  "tags": ["METAFACEBOOK", "TESTE"]
}
```

**Resultado esperado:** Lead aparece com **"META"** destacado em amarelo na coluna PLATAFORMA.

---

## 📞 Suporte

Se após a correção ainda não aparecer:

1. Verifique os logs do console (F12)
2. Procure por `[LEADS DEBUG]`
3. Compartilhe o que aparece

---

**Atualização:** 04/11/2025  
**Status:** 🔧 Correção identificada - Alterar campo para valor fixo
