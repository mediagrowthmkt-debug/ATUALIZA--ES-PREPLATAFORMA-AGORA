# 🔍 GUIA DE DEBUG: Scroll Mobile Travado

## 🚨 COMO USAR O SISTEMA DE DEBUG

### Passo 1: Recarregue a Página
1. Pressione `Ctrl+Shift+R` (Windows) ou `Cmd+Shift+R` (Mac)
2. Ou clique com direito em "Recarregar" → "Limpar cache e recarregar com força"

### Passo 2: Abra o Console
1. Pressione `F12` para abrir DevTools
2. Clique na aba **"Console"**
3. Limpe o console (ícone 🚫 ou `Ctrl+L`)

### Passo 3: Ative Modo Mobile
1. Pressione `Ctrl+Shift+M` (Windows) ou `Cmd+Shift+M` (Mac)
2. Ou clique no ícone 📱 no DevTools

---

## 📊 LOGS QUE VOCÊ VERÁ

### 1️⃣ Banner Inicial (Verde)
```
╔════════════════════════════════════════════════════════════╗
║  🔧 INICIANDO DIAGNÓSTICO DE SCROLL MOBILE               ║
╚════════════════════════════════════════════════════════════╝
```

### 2️⃣ Estado Inicial (Expandido)
```
🔍 ESTADO INICIAL
  📐 Viewport: { width: 375, height: 667, devicePixelRatio: 2 }
  📄 HTML: {
    overflow: "visible",
    overflowY: "visible",
    overflowX: "visible",
    position: "static",
    height: "auto",
    touchAction: "auto"
  }
  🧑 BODY: {
    overflow: "visible",
    overflowY: "visible",
    ...
  }
  📏 Dimensões BODY: {
    clientHeight: 667,
    scrollHeight: 3000,    ← Altura total do conteúdo
    offsetHeight: 667,
    scrollTop: 0,
    podeRolar: true       ← 🔍 IMPORTANTE: Deve ser TRUE
  }
  📱 Detecção Mobile: {
    isMobileUA: false,
    isMobileWidth: true,   ← 🔍 TRUE = detectado como mobile
    isMobileMedia: false,
    isMobile: true         ← 🔍 IMPORTANTE: Deve ser TRUE
  }
```

### 3️⃣ Aplicação do Fix
```
🔧 [APLICANDO FIX] Forçando configurações de scroll...
✅ HTML configurado
✅ BODY configurado
```

### 4️⃣ Estado Após Fix (Expandido)
```
🔍 APÓS APLICAR FIX
  📄 HTML: {
    overflow: "hidden auto",
    overflowY: "auto",      ← 🔍 Deve ser "auto"
    touchAction: "pan-y"    ← 🔍 Deve ser "pan-y"
  }
  🧑 BODY: {
    overflowY: "auto",      ← 🔍 Deve ser "auto"
    touchAction: "pan-y"    ← 🔍 Deve ser "pan-y"
  }
```

### 5️⃣ Verificações Periódicas
```
⏱️ [CHECK 1/5] Verificando scroll...
⏱️ [CHECK 2/5] Verificando scroll...
...
✅ VERIFICAÇÕES CONCLUÍDAS
```

### 6️⃣ Touch Events (quando tocar na tela)
```
👆 TOUCH START: Y=150
👆 TOUCH MOVE: Y=120, diff=30
👆 TOUCH END
```

### 7️⃣ Scroll Events (se funcionar)
```
📜 SCROLL DETECTADO: 0px
📜 SCROLL DETECTADO: 50px
📜 SCROLL DETECTADO: 100px
```

---

## 🎯 O QUE PROCURAR

### ✅ Sinais de que ESTÁ FUNCIONANDO

1. **`podeRolar: true`** nas dimensões do BODY
2. **`scrollHeight > clientHeight`** (tem conteúdo para rolar)
3. **`overflowY: "auto"`** tanto no HTML quanto no BODY
4. **`touchAction: "pan-y"`** configurado
5. **Logs de TOUCH MOVE** quando você arrasta
6. **Logs de SCROLL DETECTADO** quando você rola

### ❌ Sinais de PROBLEMA

1. **`podeRolar: false`** → Não há conteúdo suficiente para rolar
2. **`overflowY: "hidden"`** → Scroll bloqueado
3. **`touchAction: "none"`** → Touch events desabilitados
4. **Sem logs de TOUCH MOVE** → Touch não está sendo detectado
5. **Sem logs de SCROLL DETECTADO** → Scroll não está funcionando

---

## 🔧 BOTÃO DE DEBUG VISUAL

### Na tela (canto inferior direito)
Você verá um botão **roxo com 🔍**

**Clique nele para:**
1. Limpar o console
2. Executar diagnóstico completo
3. Tentar forçar o fix novamente

O botão fica **verde ✅** por 1 segundo após clicar.

---

## 💡 COMANDOS MANUAIS

### No Console, digite:

#### 1. Debug Completo
```javascript
debugScroll()
```

#### 2. Forçar Fix Novamente
```javascript
debugScroll().tentarForcar()
```

#### 3. Ver Overflow Atual
```javascript
console.log('HTML overflow:', window.getComputedStyle(document.documentElement).overflowY);
console.log('BODY overflow:', window.getComputedStyle(document.body).overflowY);
```

#### 4. Ver Touch Action
```javascript
console.log('HTML touchAction:', window.getComputedStyle(document.documentElement).touchAction);
console.log('BODY touchAction:', window.getComputedStyle(document.body).touchAction);
```

#### 5. Forçar Scroll Manualmente (Teste de Último Recurso)
```javascript
document.documentElement.style.setProperty('overflow-y', 'auto', 'important');
document.body.style.setProperty('overflow-y', 'auto', 'important');
document.documentElement.style.setProperty('touch-action', 'pan-y', 'important');
document.body.style.setProperty('touch-action', 'pan-y', 'important');
console.log('✅ Scroll forçado com !important');
```

---

## 📋 CHECKLIST DE DIAGNÓSTICO

Copie e cole este checklist no console após os logs aparecerem:

```javascript
// CHECKLIST DE DIAGNÓSTICO
console.group('📋 CHECKLIST');

const html = document.documentElement;
const body = document.body;
const htmlStyle = window.getComputedStyle(html);
const bodyStyle = window.getComputedStyle(body);

console.log('✓ isMobile detectado:', window.innerWidth <= 900);
console.log('✓ HTML overflowY:', htmlStyle.overflowY);
console.log('✓ BODY overflowY:', bodyStyle.overflowY);
console.log('✓ HTML touchAction:', htmlStyle.touchAction);
console.log('✓ BODY touchAction:', bodyStyle.touchAction);
console.log('✓ BODY pode rolar:', body.scrollHeight > body.clientHeight);
console.log('✓ BODY scrollHeight:', body.scrollHeight);
console.log('✓ BODY clientHeight:', body.clientHeight);

console.groupEnd();
```

---

## 🎨 INTERPRETANDO OS LOGS

### Cores dos Logs

| Cor | Significado |
|-----|-------------|
| 🟢 Verde | Box de título/sucesso |
| 🔵 Azul | Modo desktop detectado |
| 🟢 Verde | Modo mobile detectado |
| ⚪ Branco | Informações gerais |
| 🟡 Amarelo | Avisos |
| 🔴 Vermelho | Erros |

### Emojis Importantes

| Emoji | O que indica |
|-------|--------------|
| 📐 | Dimensões do viewport |
| 📄 | Propriedades do HTML |
| 🧑 | Propriedades do BODY |
| 📏 | Dimensões e scroll |
| 📱 | Detecção mobile |
| 👆 | Touch events |
| 📜 | Scroll events |
| ✅ | Operação bem-sucedida |
| ❌ | Erro ou problema |

---

## 🚨 CENÁRIOS COMUNS

### Cenário 1: "podeRolar: false"
**Problema:** Não há conteúdo suficiente para rolar  
**Solução:** Normal se a página é curta. Role até o final para adicionar mais conteúdo.

### Cenário 2: "overflowY: hidden"
**Problema:** Algum código está bloqueando o scroll  
**Solução:** 
```javascript
debugScroll().tentarForcar()
```

### Cenário 3: "touchAction: none" ou "auto"
**Problema:** Touch events não configurados corretamente  
**Solução:** Fix deveria corrigir automaticamente. Se não:
```javascript
document.body.style.setProperty('touch-action', 'pan-y', 'important');
```

### Cenário 4: Touch funciona mas scroll não
**Problema:** `overscroll-behavior` ou outro CSS bloqueando  
**Solução:**
```javascript
document.body.style.setProperty('overscroll-behavior', 'auto', 'important');
```

---

## 📤 COMPARTILHAR LOGS

### Para enviar os logs:

1. Clique com direito no console
2. Selecione "Save as..."
3. Ou tire screenshot das seções:
   - ESTADO INICIAL
   - APÓS APLICAR FIX
   - ESTADO FINAL
   - Qualquer erro em vermelho

---

## 🔄 PRÓXIMOS PASSOS

1. ✅ Recarregue a página com cache limpo
2. ✅ Veja os logs no console
3. ✅ Compartilhe as seguintes informações:
   - Screenshot do "ESTADO INICIAL"
   - Screenshot do "APÓS APLICAR FIX"
   - Screenshot do "ESTADO FINAL"
   - Resultado do CHECKLIST
   - Se há logs de "TOUCH MOVE" ou "SCROLL DETECTADO"

---

**Este sistema vai nos dizer EXATAMENTE o que está bloqueando o scroll! 🎯**
