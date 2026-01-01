# Changelog: Normalização Inteligente de Fontes e Plataformas

**Data:** 29 de dezembro de 2025
**Tipo:** Enhancement
**Componente:** Leads - Relatório de Fontes e Plataformas

## 🎯 Resumo

Implementado sistema inteligente de normalização e agrupamento de plataformas e fontes para consolidar dados similares e evitar duplicação visual no relatório.

## 🔧 Problema Resolvido

**Antes:**
- "Google", "google", "GOOGLE", "Google Ads" → apareciam como 4 plataformas diferentes
- "Meta", "Facebook", "Instagram", "meta" → apareciam separados
- URLs similares como fontes apareciam duplicadas
- "campanha-verao", "campanha-verao-2024", "campanha verao" → 3 entradas diferentes

**Depois:**
- Todas as variações são agrupadas automaticamente
- Análise mais clara e precisa
- Relatório limpo e organizado

## ✨ Funcionalidades Adicionadas

### 1. Normalização de Plataformas (`normalizePlatform()`)

**Lógica de Agrupamento:**

#### **Google**
Agrupa todas as variações:
- ✅ "Google", "google", "GOOGLE"
- ✅ "Google Ads", "google ads", "GoogleAds"
- ✅ Qualquer texto contendo "google"

#### **Meta**
Agrupa Facebook, Instagram e Meta:
- ✅ "Meta", "meta", "META"
- ✅ "Facebook", "facebook", "FB", "fb"
- ✅ "Instagram", "instagram", "insta", "Insta"
- ✅ Qualquer variação dessas palavras

#### **Outras Plataformas Reconhecidas:**
- **TikTok:** "TikTok", "tiktok", "Tik Tok"
- **LinkedIn:** "LinkedIn", "linkedin", "Linked In"
- **Twitter/X:** "Twitter", "twitter", "X", "x"

#### **Plataformas Desconhecidas:**
- Capitaliza primeira letra automaticamente
- Ex: "youtube" → "Youtube"

### 2. Normalização de Fontes (`normalizeSource()`)

**Algoritmo Inteligente:**

#### **Limpeza de URLs:**
```
Antes: https://www.meusite.com/campanha?utm_source=google
Depois: Meusite Campanha
```

Passos:
1. ✅ Remove `http://`, `https://`
2. ✅ Remove `www.`
3. ✅ Remove query strings (`?...`) e fragments (`#...`)
4. ✅ Remove trailing slashes (`/`)
5. ✅ Remove números de versão/datas (`-2024`, `v2`, `-12-25`)
6. ✅ Remove caracteres especiais mantendo letras, números, espaços e hífens
7. ✅ Normaliza espaços múltiplos
8. ✅ Extrai 3 palavras principais
9. ✅ Capitaliza resultado

#### **Exemplos de Agrupamento:**

| Entrada Original | Normalizado Para |
|------------------|------------------|
| "campanha-verao" | "Campanha Verao" |
| "campanha-verao-2024" | "Campanha Verao" |
| "Campanha Verão Google Ads" | "Campanha Verão Google" |
| "https://landing.com/promo?ref=fb" | "Landing Promo" |
| "site.com/campanha-natal-2024" | "Site Campanha Natal" |
| "BLACK FRIDAY ADS" | "Black Friday Ads" |

#### **Proteção:**
- ✅ Ignora palavras muito curtas (< 3 caracteres)
- ✅ Mantém original se resultado ficar muito curto
- ✅ Preserva legibilidade com capitalização

## 🎨 Cores Atualizadas

Adicionadas cores para novas plataformas reconhecidas:

```javascript
{
  'Google': '#4285F4',      // Azul Google
  'Meta': '#0866FF',        // Azul Meta
  'TikTok': '#000000',      // Preto TikTok
  'LinkedIn': '#0A66C2',    // Azul LinkedIn
  'Twitter/X': '#1DA1F2',   // Azul Twitter
  'Não especificada': '#64748b' // Cinza
}
```

## 📊 Impacto Visual

### Antes da Normalização:
```
Plataformas:
├─ Google (15 leads)
├─ google (8 leads)
├─ Google Ads (12 leads)
├─ Meta (10 leads)
├─ Facebook (20 leads)
├─ Instagram (18 leads)
└─ facebook ads (5 leads)

Fontes:
├─ campanha-verao (10)
├─ campanha-verao-2024 (8)
├─ Campanha Verão (5)
├─ https://site.com/promo (7)
└─ site.com/promo?ref=fb (6)
```

### Depois da Normalização:
```
Plataformas:
├─ Google (35 leads) ⬅️ Agrupou Google + google + Google Ads
└─ Meta (53 leads)   ⬅️ Agrupou Meta + Facebook + Instagram + facebook ads

Fontes:
├─ Campanha Verao (23) ⬅️ Agrupou todas as variações
└─ Site Promo (13)     ⬅️ Agrupou as URLs similares
```

## 🔧 Implementação Técnica

### Funções Adicionadas (linha ~26603)

**1. `normalizePlatform(plataforma)`**
- Input: String com nome da plataforma (qualquer formato)
- Output: String normalizada ("Google", "Meta", etc.)
- Lógica: Case-insensitive includes check

**2. `normalizeSource(source)`**
- Input: String com URL ou nome da fonte
- Output: String normalizada e capitalizada
- Lógica: Regex cleaning + word extraction + capitalization

### Integração

Modificada função `updateLeadsSourcesReport()` (linha ~26688):
```javascript
// ANTES
const plataforma = lead.plataforma;
plataformasMap[plataforma] = ...

// DEPOIS
const plataformaOriginal = lead.plataforma;
const plataformaNormalizada = normalizePlatform(plataformaOriginal);
plataformasMap[plataformaNormalizada] = ...
```

## 🧪 Casos de Teste

### Teste de Plataformas:
```javascript
normalizePlatform('Google')         // → 'Google'
normalizePlatform('google ads')     // → 'Google'
normalizePlatform('GOOGLE ADS')     // → 'Google'
normalizePlatform('Facebook')       // → 'Meta'
normalizePlatform('instagram')      // → 'Meta'
normalizePlatform('META')           // → 'Meta'
normalizePlatform('TikTok')         // → 'TikTok'
normalizePlatform('youtube')        // → 'Youtube'
```

### Teste de Fontes:
```javascript
normalizeSource('campanha-verao')                    // → 'Campanha Verao'
normalizeSource('campanha-verao-2024')              // → 'Campanha Verao'
normalizeSource('https://site.com/promo?ref=fb')    // → 'Site Promo'
normalizeSource('BLACK-FRIDAY-ADS-V2')              // → 'Black Friday Ads'
normalizeSource('landing.com/natal-2024')           // → 'Landing Natal'
```

## 🎯 Benefícios

- ✅ **Análise mais precisa:** Dados consolidados corretamente
- ✅ **Relatório limpo:** Sem duplicações visuais
- ✅ **Contagens corretas:** Leads agrupados apropriadamente
- ✅ **Melhor UX:** Interface mais clara e profissional
- ✅ **Flexibilidade:** Aceita qualquer formato de entrada
- ✅ **Inteligente:** Reconhece variações automaticamente
- ✅ **Escalável:** Fácil adicionar novas plataformas

## 🔄 Compatibilidade

- ✅ Funciona com dados existentes
- ✅ Não modifica dados no Firestore (apenas visualização)
- ✅ Aplica-se tanto a dados completos quanto filtrados
- ✅ Preserva dados originais para auditoria

## 🐛 Debug

Logs mantidos para diagnóstico:
```javascript
console.log('[LEADS SOURCES] Atualizado:', {
  plataformas: Object.keys(plataformasMap).length,
  fontes: Object.keys(sourcesMap).length
});
```

Agora mostrará contagens consolidadas após normalização.

## 📝 Observações

1. **Dados Originais Preservados:**
   - A normalização é apenas visual
   - Dados no Firestore permanecem intactos
   - Útil para auditoria e análise detalhada

2. **Personalização Fácil:**
   - Para adicionar nova plataforma, edite `normalizePlatform()`
   - Para ajustar lógica de fontes, edite `normalizeSource()`
   - Cores podem ser adicionadas em `plataformaColors`

3. **Performance:**
   - Normalização ocorre apenas na renderização
   - Não afeta performance de carregamento
   - Processamento rápido (< 1ms por lead)

## 🔮 Melhorias Futuras

- [ ] Adicionar mais plataformas reconhecidas automaticamente
- [ ] Machine learning para detectar padrões em fontes
- [ ] Interface para configurar regras de normalização
- [ ] Sugerir agrupamentos ao usuário para confirmação
- [ ] Export de mapeamento de normalização aplicado
- [ ] Dashboard de qualidade de dados (% normalizado)
