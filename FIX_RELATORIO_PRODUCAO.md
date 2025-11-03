# Fix: Stories e Posts não aparecem em Produção

## 🔍 Problema Identificado

O `relatorio.html` carregava stories e posts corretamente no Live Preview do VS Code, mas não em produção (domínio). 

### Causas Raiz:

1. **CORS (Cross-Origin Resource Sharing)**: Imagens/vídeos do Firebase Storage sem headers CORS adequados
2. **Mixed Content**: Algumas URLs usando HTTP em vez de HTTPS
3. **crossOrigin='anonymous'**: Código tentava carregar recursos com crossOrigin sem servidor permitir
4. **Falta de tratamento de erros**: Quando imagens falhavam, não havia fallback visual

## ✅ Soluções Implementadas

### 1. Remoção de `crossOrigin` problemático
```javascript
// ANTES (causava erro CORS)
video.crossOrigin = 'anonymous';
img.crossOrigin = 'anonymous';

// DEPOIS (tenta carregar sem CORS primeiro)
// Remove crossOrigin nas thumbnails geradas
```

### 2. Garantia de HTTPS nas URLs
```javascript
const ensureHttps = (url) => {
  if (!url) return '';
  const urlStr = String(url);
  if ((urlStr.includes('firebasestorage.googleapis.com') || 
       urlStr.includes('firebasestorage.app')) && 
      urlStr.startsWith('http://')) {
    return urlStr.replace('http://', 'https://');
  }
  return urlStr;
};
```

### 3. Tratamento de Erros de Imagens
- Event listener global para capturar erros de imagem
- Fallback visual com ícone 📷 quando imagem não carrega
- Logging detalhado no console para debug
- Ícone de vídeo ▶ quando thumbnail falha

### 4. Lazy Loading
```html
<img src="..." loading="lazy">
```
Adiciona lazy loading nativo para melhor performance.

### 5. Timeout Aumentado
```javascript
// ANTES: 10 segundos
const timeout = setTimeout(() => {...}, 10000);

// DEPOIS: 15 segundos (mais tolerante em conexões lentas)
const timeout = setTimeout(() => {...}, 15000);
```

### 6. Configuração Netlify (netlify.toml)
```toml
# Headers CORS para imagens/vídeos
[[headers]]
  for = "*.jpg"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Cache-Control = "public, max-age=31536000, immutable"

# Force HTTPS
[[redirects]]
  from = "http://*"
  to = "https://:splat"
  status = 301
  force = true
```

## 🧪 Como Testar

### 1. Teste Local (VS Code Live Preview)
```bash
# Abra relatorio.html no Live Preview
# Verifique se stories e posts aparecem
```

### 2. Deploy para Produção
```bash
git add relatorio.html netlify.toml FIX_RELATORIO_PRODUCAO.md
git commit -m "fix: stories e posts não apareciam em produção - corrige CORS e mixed content"
git push origin main
```

### 3. Verificar no Domínio
1. Acesse seu domínio: `https://seu-dominio.com/relatorio.html?mes=2025-11&tenant=SEU_TENANT`
2. Abra o DevTools (F12) → Console
3. Procure por logs:
   ```
   [Relatorio] Script carregado. Modo: Autenticado
   [Relatorio] Aplicando thumbnails aos stories
   [Relatorio] Aplicando thumbnails aos posts
   ```
4. Verifique a aba **Network** para ver se imagens/vídeos estão carregando
5. Se houver erros, veja a mensagem no console:
   ```
   [Relatorio] Falha ao carregar imagem: <URL>
   [Relatorio] Protocolo: HTTPS ✓ (ou HTTP ✗)
   ```

## 🔧 Debug em Produção

### Se Stories/Posts ainda não aparecerem:

1. **Verifique os Logs no Console**
   ```javascript
   // Procure por:
   [Relatorio] Gerando thumbnail para: <URL>
   [Relatorio] Erro ao carregar vídeo: ...
   [Relatorio] Falha ao carregar imagem: ...
   ```

2. **Verifique URLs das Imagens**
   - Todas devem começar com `https://`
   - Devem estar acessíveis publicamente

3. **Teste URL diretamente**
   - Copie uma URL do console
   - Cole em nova aba do navegador
   - Se não abrir, o problema é no Firebase Storage

4. **Regras do Firebase Storage**
   - Acesse Firebase Console → Storage → Rules
   - Garanta que permite leitura pública:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

5. **CORS do Firebase Storage**
   - Arquivo `cors.json` já existe
   - Aplique via gsutil:
   ```bash
   gsutil cors set cors.json gs://mediagrowth-a5349.firebasestorage.app
   ```

## 📊 Melhorias Adicionais

### Performance
- ✅ Lazy loading nas imagens
- ✅ Cache de 1 ano para assets estáticos
- ✅ Intersection Observer para thumbnails (só gera quando visível)
- ✅ Fila de processamento (máx 2 workers simultâneos)

### UX
- ✅ Fallback visual quando mídia não carrega
- ✅ Indicadores de status (aprovado, revisar, pendente)
- ✅ Data de publicação em cada card

### Debug
- ✅ Logging detalhado no console
- ✅ Captura de erros de imagem
- ✅ Informações de protocolo (HTTP vs HTTPS)

## 📝 Próximos Passos

Se o problema persistir após estas mudanças:

1. Compartilhe os logs do console
2. Verifique a aba Network do DevTools
3. Confirme se o Firebase Storage Rules permite leitura pública
4. Teste se as URLs das imagens abrem diretamente no navegador

## 🎯 Resultado Esperado

Após o deploy:
- ✅ Stories produzidos aparecem no relatório
- ✅ Posts produzidos aparecem no relatório
- ✅ Thumbnails de vídeos são geradas automaticamente
- ✅ Imagens carregam corretamente via HTTPS
- ✅ Fallback visual quando mídia não carrega
- ✅ Logs detalhados para debug

---

**Data**: 03/11/2025  
**Arquivos Modificados**:
- `relatorio.html` (correções CORS, HTTPS, error handling)
- `netlify.toml` (novo - configuração de headers e redirects)
- `FIX_RELATORIO_PRODUCAO.md` (este arquivo)
