# 🚀 Quick Start - Sistema Admin

## ⚡ Começando em 3 Passos

### 1️⃣ Criar sua Conta Admin

Acesse: **`admin-setup.html`**

- Faça login com Google
- Clique em "Criar Conta Admin"
- Pronto! Você agora é admin

### 2️⃣ Adicionar Empresas

Acesse: **`admin-selector.html`**

- Digite o email de uma conta existente
- Clique em "Adicionar"
- A empresa será vinculada à sua conta

### 3️⃣ Acessar Dashboard

No painel admin:
- Clique em "Acessar Dashboard" na empresa desejada
- Você será levado para o dashboard daquela empresa
- Todos os dados (posts, metas, etc.) serão da empresa selecionada

---

## 📁 Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `admin-setup.html` | Assistente para criar conta admin |
| `admin-selector.html` | Painel para selecionar empresas |
| `ADMIN_SETUP.md` | Documentação completa |
| `firestore.rules` | Regras atualizadas (já modificado) |

---

## 🎯 Fluxo de Uso

```
1. admin-setup.html     → Cria conta admin (uma vez)
2. admin-selector.html  → Adiciona empresas
3. admin-selector.html  → Seleciona empresa
4. index.html           → Dashboard da empresa
```

---

## 🔥 Pronto para Deploy

### Netlify / Vercel / Firebase Hosting

Faça deploy normalmente. Os arquivos estão prontos!

### Teste Local

```bash
# Abra com Live Server ou Python Server
python3 -m http.server 8000
```

Então acesse:
- http://localhost:8000/admin-setup.html
- http://localhost:8000/admin-selector.html

---

## ✅ Checklist

- [ ] Abrir `admin-setup.html`
- [ ] Fazer login
- [ ] Criar conta admin
- [ ] Abrir `admin-selector.html`
- [ ] Adicionar primeira empresa
- [ ] Clicar em "Acessar Dashboard"
- [ ] Testar funcionalidades

---

## 💡 Dica Pro

Salve `admin-selector.html` nos favoritos do navegador para acesso rápido!

---

**Problemas?** Veja `ADMIN_SETUP.md` para documentação completa.
