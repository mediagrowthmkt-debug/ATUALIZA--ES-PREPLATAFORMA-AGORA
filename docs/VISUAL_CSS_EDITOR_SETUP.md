# 🎨 Usando o Visual CSS Editor

## ✅ Problema Resolvido

O erro "This page cannot be edited as it is redirected" foi corrigido!

## 🔧 Como Usar Agora

### Opção 1: Editar Diretamente no VS Code (Recomendado)

1. Abra o arquivo `index.html` no VS Code
2. Clique com botão direito no editor
3. Selecione **"Open with Visual CSS Editor"**
4. Ou use Cmd+Shift+P e digite "Visual CSS Editor"

### Opção 2: Usar com Servidor Local

Os redirects foram **DESABILITADOS temporariamente** para permitir o uso da extensão.

- **Modo Atual:** Desenvolvimento (redirects desabilitados) ⚠️
- **Arquivo:** `_redirects` → renomeado para `_redirects.disabled`

## 🔄 Alternar Entre Modos

Use o script `toggle-redirects.sh` para alternar facilmente:

```bash
# Desabilitar redirects (modo desenvolvimento - para usar extensões)
./toggle-redirects.sh disable

# Habilitar redirects (modo produção - antes de fazer deploy)
./toggle-redirects.sh enable

# Ver status atual
./toggle-redirects.sh
```

## ⚠️ IMPORTANTE: Antes de Fazer Deploy

**SEMPRE habilite os redirects antes de fazer deploy:**

```bash
./toggle-redirects.sh enable
```

Ou renomeie manualmente:
```bash
mv _redirects.disabled _redirects
```

O arquivo `_redirects` é necessário para:
- ✅ Funcionamento correto do SPA (Single Page Application)
- ✅ Todas as rotas redirecionarem para `index.html`
- ✅ Navegação funcionar corretamente no Netlify/Firebase Hosting

## 📝 Configurações Adicionadas

Arquivo `.vscode/settings.json` foi criado com:
- `visual-css-editor.enable: true`
- `visual-css-editor.autoSave: true`
- `visual-css-editor.useLocalFiles: true`

Isso otimiza o uso da extensão neste projeto.

## 🎯 Workflow Recomendado

1. **Durante Desenvolvimento:**
   ```bash
   ./toggle-redirects.sh disable
   # Use Visual CSS Editor e outras extensões livremente
   ```

2. **Antes de Testar/Deploy:**
   ```bash
   ./toggle-redirects.sh enable
   # Teste a aplicação com redirects habilitados
   ```

3. **Após Deploy:**
   ```bash
   ./toggle-redirects.sh disable
   # Volte ao modo desenvolvimento
   ```

---

✨ **Agora você pode usar o Visual CSS Editor sem problemas!**
