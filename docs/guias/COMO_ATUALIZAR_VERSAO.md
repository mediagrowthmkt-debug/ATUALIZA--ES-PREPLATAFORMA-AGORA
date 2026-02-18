# 🔖 Como Atualizar a Versão do App

## 📍 Localização

A versão do aplicativo é exibida **apenas na tela de login** no canto superior direito.

**Arquivo:** `index.html`  
**Linha:** ~10020  
**Elemento:** `<div class="app-version" id="appVersion">v5.2.0</div>`

---

## ✏️ Como Editar

### 1️⃣ Abra o arquivo `index.html`

### 2️⃣ Procure por:
```html
<!-- ============================================ -->
<!-- VERSÃO DO APP - EDITE AQUI A VERSÃO -->
<!-- Localização: Linha ~10020 -->
<!-- ============================================ -->
<div class="app-version" id="appVersion">v5.2.0</div>
<!-- ============================================ -->
```

### 3️⃣ Edite a versão:
Altere o texto entre as tags `<div>` e `</div>`:

```html
<div class="app-version" id="appVersion">v5.3.0</div>
```

ou

```html
<div class="app-version" id="appVersion">v6.0.0 Beta</div>
```

---

## 🎨 Formato Recomendado

### Versões Estáveis:
- `v5.2.0`
- `v5.2.1`
- `v6.0.0`

### Versões em Desenvolvimento:
- `v5.3.0 Beta`
- `v6.0.0 RC1`
- `v5.2.1-dev`

### Com Data:
- `v5.2.0 (17/02/2026)`
- `v5.2.0 • 17/02/26`

---

## 🔍 Busca Rápida

### No VS Code:
1. Pressione `Ctrl+F` (Windows/Linux) ou `Cmd+F` (Mac)
2. Busque por: `VERSÃO DO APP - EDITE AQUI`
3. Edite a versão
4. Salve o arquivo (`Ctrl+S` ou `Cmd+S`)

### Via Terminal:
```bash
# Buscar a linha
grep -n "app-version" index.html

# Ou buscar pelo comentário
grep -n "VERSÃO DO APP" index.html
```

---

## 📋 Checklist de Atualização

- [ ] Abrir `index.html`
- [ ] Localizar linha ~10020 (buscar por "VERSÃO DO APP")
- [ ] Atualizar o número da versão
- [ ] Salvar o arquivo
- [ ] Fazer commit no Git
- [ ] Fazer deploy

---

## 🎯 Comportamento

### ✅ Quando o indicador é visível:
- **Tela de login** (usuário não autenticado)
- Aparece no canto superior direito
- Com efeito de hover

### ❌ Quando o indicador fica oculto:
- **Após o login** (usuário autenticado)
- Automaticamente escondido
- Volta a aparecer após logout

---

## 💡 Dicas

### Versionamento Semântico:
```
v[MAJOR].[MINOR].[PATCH]

Exemplo: v5.2.1
         │ │ │
         │ │ └─ PATCH: Correções de bugs
         │ └─── MINOR: Novas funcionalidades
         └───── MAJOR: Mudanças grandes
```

### Manter Histórico:
Recomenda-se criar um changelog toda vez que atualizar a versão:

```bash
# Criar changelog
echo "v5.3.0" > CHANGELOG_V5_3_0.md

# Fazer commit
git add index.html CHANGELOG_V5_3_0.md
git commit -m "Atualização para v5.3.0"
```

---

## 🔧 Personalização Avançada

### Alterar Posição:
Editar CSS na linha ~395 do `index.html`:

```css
.app-version {
  position: fixed;
  top: 20px;      /* ← Distância do topo */
  right: 20px;    /* ← Distância da direita */
  /* ... */
}
```

### Alterar Estilo:
```css
.app-version {
  /* Cor de fundo */
  background: rgba(0, 0, 0, 0.7);
  
  /* Cor do texto */
  color: rgba(255, 255, 255, 0.75);
  
  /* Tamanho da fonte */
  font-size: 0.75rem;
  
  /* Bordas arredondadas */
  border-radius: 8px;
}
```

---

## 📞 Exemplo de Workflow

### Ao fazer uma atualização:

1. **Editar a versão:**
   ```html
   <div class="app-version" id="appVersion">v5.3.0</div>
   ```

2. **Criar changelog:**
   ```bash
   # docs/changelogs/CHANGELOG_V5_3_0.md
   ```

3. **Commit:**
   ```bash
   git add index.html docs/changelogs/CHANGELOG_V5_3_0.md
   git commit -m "🔖 Atualização para v5.3.0 - Novas funcionalidades de IA"
   git push
   ```

4. **Deploy:**
   ```bash
   # Seu processo de deploy aqui
   ```

---

## ✅ Verificação

Após editar, verifique:

1. ✅ A versão foi alterada corretamente no HTML
2. ✅ Não há erros de sintaxe
3. ✅ O commit foi criado
4. ✅ A versão aparece na tela de login
5. ✅ A versão desaparece após login

---

## 📚 Arquivos Relacionados

- `index.html` - Arquivo principal (versão na linha ~10020)
- `docs/changelogs/` - Histórico de versões
- `ORGANIZACAO_COMPLETA.md` - Documentação da estrutura

---

**Última atualização:** 17 de fevereiro de 2026  
**Versão atual:** v5.2.0  
**Próxima versão sugerida:** v5.3.0
