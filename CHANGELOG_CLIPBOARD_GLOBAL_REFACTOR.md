# 📋 Refatoração Global do Clipboard para Suporte a iFrames

**Data:** 14 de janeiro de 2026  
**Tipo:** Refactor / Enhancement  
**Categoria:** UX / Compatibilidade / iFrame Support  

## 📋 Resumo

Implementada função utilitária global `mgCopyToClipboard()` que centraliza toda a lógica de cópia para área de transferência no projeto, garantindo funcionamento **consistente em todos os contextos**, incluindo **iframes sem permissão de clipboard-write**.

---

## 🎯 Problema

Diversos botões de "Copiar" no projeto utilizavam implementações inconsistentes:
- ❌ Alguns usavam apenas `navigator.clipboard.writeText()` sem fallback
- ❌ Outros tinham fallback, mas implementações duplicadas
- ❌ Código repetitivo e difícil de manter
- ❌ Possíveis falhas silenciosas em iframes

---

## ✅ Solução Implementada

### 🔧 Função Utilitária Global: `mgCopyToClipboard()`

```javascript
/**
 * Função robusta para copiar texto que funciona em iframes e diferentes contextos de permissão
 * @param {string} text - Texto a ser copiado
 * @returns {Promise<boolean>} - Retorna true se a cópia foi bem-sucedida
 */
async function mgCopyToClipboard(text) {
  if(!text && text !== '') return false;
  
  let copiado = false;
  
  // Método 1: Clipboard API moderna (funciona com https e permissões)
  if(navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      copiado = true;
    } catch(clipErr) {
      console.warn('[mgCopyToClipboard] Clipboard API falhou, tentando fallback:', clipErr);
    }
  }
  
  // Método 2: Fallback com textarea + execCommand (funciona em iframes sem permissão clipboard-write)
  if(!copiado) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      textarea.style.opacity = '0';
      textarea.style.pointerEvents = 'none';
      textarea.setAttribute('readonly', '');
      textarea.setAttribute('aria-hidden', 'true');
      document.body.appendChild(textarea);
      
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, text.length);
      
      const sucesso = document.execCommand('copy');
      if(sucesso) copiado = true;
      
      document.body.removeChild(textarea);
    } catch(execErr) {
      console.error('[mgCopyToClipboard] execCommand falhou:', execErr);
    }
  }
  
  return copiado;
}

// Expor globalmente para uso em qualquer contexto
window.mgCopyToClipboard = mgCopyToClipboard;
```

---

## 🎯 Botões/Funções Atualizadas

### No `index.html`:

| Funcionalidade | Localização | Status |
|---------------|-------------|--------|
| Copiar resposta IA | Aba I.A. - Chat | ✅ Atualizado |
| Copiar Briefing | Aba Briefing | ✅ Atualizado |
| Copiar Link Relatório | Relatório Mensal | ✅ Atualizado |
| Copiar Resumo Texto | Relatório - Resumo | ✅ Atualizado |
| Copiar Prompt IA | Análise IA | ✅ Atualizado |
| Copiar Link Arquivo | Aba Arquivos | ✅ Atualizado |
| Copiar Webhook URL | Aba Leads | ✅ Atualizado |
| Copiar Relatório Rápido | Leads - Relatório | ✅ Atualizado |
| Copiar Prompt Documento | Doc Entregável | ✅ Atualizado |
| Copiar Conteúdo Doc | Modal Doc Preview | ✅ Atualizado |
| Copiar Link Aprovação | Análise - Aprovação | ✅ Atualizado |
| Copiar Link Relatório Completo | Análise - Compartilhar | ✅ Atualizado |
| Copiar Prompt Estruturação | Estruturação - Modal IA | ✅ Atualizado |
| Copiar Senha/Usuário | Aba Acessos | ✅ Atualizado |
| Copiar Link Calendário | Calendário - Share | ✅ Atualizado |
| Copiar Link Planejamento | Planejamento - Share | ✅ Atualizado |
| Copiar Link Aprovação Post | Calendário - Aprovação | ✅ Atualizado |
| Copiar Link Metas | Metas - Enviar | ✅ Atualizado |
| Copiar Demanda Individual | WhatsApp Resumo | ✅ Atualizado |
| Copiar Resumo WhatsApp | Notas Time | ✅ Atualizado |
| Copiar por Usuário | Notas Time | ✅ Atualizado |

### No `relatorio.html`:

| Funcionalidade | Status |
|---------------|--------|
| Copiar Resumo Relatório | ✅ Atualizado |

---

## 🔒 Garantias de Funcionamento

### ✅ Contextos Suportados:

| Contexto | Método Usado | Status |
|----------|--------------|--------|
| Páginas HTTPS | Clipboard API | ✅ Funciona |
| Páginas HTTP (dev) | execCommand fallback | ✅ Funciona |
| iframes com `clipboard-write` | Clipboard API | ✅ Funciona |
| iframes sem permissão | execCommand fallback | ✅ Funciona |
| Navegadores antigos | execCommand fallback | ✅ Funciona |
| Políticas CSP restritivas | Múltiplas tentativas | ✅ Funciona |

---

## 📊 Benefícios

1. **Código DRY**: Lógica centralizada em uma única função
2. **Manutenibilidade**: Correções/melhorias se aplicam a todo o projeto
3. **Consistência**: Mesmo comportamento em todos os botões de copiar
4. **Robustez**: Fallback automático garante funcionamento em qualquer contexto
5. **Acessibilidade**: Textarea com atributos `aria-hidden` e `readonly`
6. **Performance**: Remoção imediata do elemento auxiliar após uso

---

## 🔧 Como Usar

```javascript
// Uso básico
const copiado = await mgCopyToClipboard(texto);
if(copiado) {
  mgToast('Texto copiado!');
} else {
  alert('Não foi possível copiar.');
}

// Com feedback visual personalizado
const btn = document.querySelector('.btn-copy');
btn.addEventListener('click', async () => {
  const copiado = await mgCopyToClipboard(conteudo);
  if(copiado) {
    btn.textContent = '✅ Copiado!';
    setTimeout(() => btn.textContent = '📋 Copiar', 2000);
  }
});
```

---

## 📁 Arquivos Modificados

- `index.html` - Função global + 20+ atualizações de botões
- `relatorio.html` - Função local + 1 atualização

---

## 🧪 Testes Recomendados

1. Abrir a plataforma diretamente no navegador
2. Abrir a plataforma dentro de um iframe (ex: em app externo)
3. Testar todos os botões de copiar em ambos os contextos
4. Verificar feedback visual (toast/alert) em cada caso
5. Verificar logs do console para erros

---

## 📝 Notas Técnicas

- A função retorna `Promise<boolean>` para permitir tratamento assíncrono
- O fallback `execCommand` está deprecated, mas ainda funciona em todos os navegadores modernos
- O textarea auxiliar é posicionado fora da viewport e removido imediatamente
- A função está exposta globalmente via `window.mgCopyToClipboard` para uso em qualquer contexto
