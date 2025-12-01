# 🔐 Sistema de Acesso Admin Multi-Empresas

## 📋 Visão Geral

Este sistema permite que você acesse múltiplas contas de clientes através de uma única conta administrador, sem precisar fazer login separadamente em cada uma.

## 🚀 Como Funcionar

### 1. Criar Conta Admin no Firestore

Primeiro, você precisa adicionar sua conta como admin no Firestore:

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Vá em **Firestore Database**
3. Crie uma nova **Collection** chamada `admins`
4. Adicione um **Document** com o ID sendo o **UID** do seu usuário
5. Adicione os seguintes campos:
   ```
   email: "seu-email@exemplo.com"
   createdAt: [Timestamp atual]
   displayName: "Seu Nome"
   role: "admin"
   ```

### 2. Descobrir seu UID

Para descobrir seu UID (User ID):

**Opção 1 - Pelo Firebase Console:**
1. Vá em **Authentication** > **Users**
2. Encontre seu email
3. Copie o **User UID**

**Opção 2 - Pelo JavaScript:**
1. Faça login no sistema normal (`index.html`)
2. Abra o Console do navegador (F12)
3. Digite: `firebase.auth().currentUser.uid`

### 3. Acessar o Painel Admin

1. Acesse `admin-selector.html` no navegador
2. Faça login com sua conta (Google ou Email/Senha)
3. Se você é admin, verá o painel de empresas

### 4. Adicionar Empresas

1. No campo "Adicionar Empresa", digite o **email** de uma conta já cadastrada
2. Clique em **Adicionar**
3. O sistema irá buscar a conta no Firebase e vincular à sua conta admin

### 5. Acessar Dashboard de uma Empresa

1. Clique no botão **"Acessar Dashboard"** da empresa desejada
2. Você será redirecionado para o dashboard dessa empresa
3. Todos os dados (posts, metas, relatórios) serão da empresa selecionada

## 📁 Estrutura no Firestore

```
/admins/{adminUID}
  ├── email: "admin@exemplo.com"
  ├── displayName: "Admin Name"
  ├── role: "admin"
  └── /companies/{companyUID}
      ├── email: "cliente@empresa.com"
      ├── displayName: "Nome da Empresa"
      ├── photoURL: "url-da-logo"
      ├── addedAt: Timestamp
      └── lastAccessed: Timestamp
```

## 🔒 Regras de Segurança

As regras do Firestore já estão configuradas para:
- ✅ Apenas usuários listados em `/admins` podem ser admin
- ✅ Admins podem ler dados de todas as empresas vinculadas
- ✅ Cada empresa continua isolada das outras
- ✅ Logs de último acesso são mantidos

## 💡 Funcionalidades

### Painel Admin (`admin-selector.html`)
- ✅ Lista todas as empresas vinculadas
- ✅ Adicionar novas empresas por email
- ✅ Remover empresas da lista
- ✅ Ver último acesso a cada empresa
- ✅ Design responsivo (mobile-friendly)

### Dashboard (`index.html`)
- ✅ Detecção automática de parâmetro `?admin=true`
- ✅ Acesso aos dados da empresa selecionada
- ✅ Todos os recursos funcionam normalmente

## 🛠️ Scripts Úteis

### Criar Admin via Console do Firebase

Abra o Console do Firestore e execute:

```javascript
// Substitua com seu UID e email
const adminUID = "SEU_UID_AQUI";
const adminEmail = "seu-email@exemplo.com";

firebase.firestore().collection('admins').doc(adminUID).set({
  email: adminEmail,
  displayName: "Seu Nome",
  role: "admin",
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
});
```

### Adicionar Empresa Programaticamente

```javascript
const adminUID = "SEU_UID_ADMIN";
const companyUID = "UID_DA_EMPRESA";
const companyEmail = "cliente@empresa.com";

firebase.firestore()
  .collection('admins').doc(adminUID)
  .collection('companies').doc(companyUID)
  .set({
    email: companyEmail,
    displayName: "Nome da Empresa",
    photoURL: null,
    addedAt: firebase.firestore.FieldValue.serverTimestamp(),
    lastAccessed: null
  });
```

## 📊 Monitoramento

Você pode monitorar:
- Quantas empresas cada admin gerencia
- Último acesso a cada empresa
- Histórico de adições/remoções

## ⚠️ Notas Importantes

1. **Segurança**: Apenas adicione como admin pessoas de confiança
2. **Privacidade**: Admins têm acesso total aos dados das empresas
3. **Backup**: Mantenha backup da lista de admins
4. **Logs**: Considere implementar logs de auditoria

## 🔄 Fluxo de Uso

```
1. Admin faz login → admin-selector.html
2. Admin vê lista de empresas
3. Admin clica em "Acessar Dashboard"
4. Sistema redireciona para index.html?client=...&admin=true
5. Dashboard carrega dados da empresa selecionada
6. Admin trabalha normalmente no dashboard
7. Para trocar de empresa, volta para admin-selector.html
```

## 🎨 Personalizações

### Adicionar Logo no Seletor

Para adicionar o logo da empresa no card:

1. Certifique-se que a empresa tem `photoURL` no Firestore
2. O sistema mostrará automaticamente a imagem
3. Se não tiver, mostra a inicial do nome

### Customizar Aparência

Edite as variáveis CSS em `admin-selector.html`:

```css
:root {
  --accent: #ff6600;  /* Cor principal */
  --bg: #000;         /* Fundo */
  --panel: #111;      /* Painéis */
}
```

## 🐛 Troubleshooting

### "Você não tem permissão de admin"
- Verifique se seu UID está na collection `/admins`
- Confirme que você está logado com a conta correta

### "Email não encontrado no sistema"
- Verifique se o email está correto
- Confirme que a conta existe em `/usuarios`
- O email deve estar em lowercase

### Não redireciona para o dashboard
- Verifique o console do navegador (F12)
- Confirme que o arquivo `index.html` existe
- Verifique se os parâmetros da URL estão corretos

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique o console do navegador (F12)
2. Confira os logs do Firestore
3. Revise as regras de segurança

## 🔐 Segurança Adicional (Opcional)

Para aumentar a segurança, você pode:

1. **Adicionar autenticação 2FA** no Firebase
2. **Limitar IPs** que podem acessar o painel admin
3. **Implementar logs de auditoria** detalhados
4. **Definir permissões granulares** por admin

---

✅ Sistema pronto para uso! Acesse `admin-selector.html` e comece a gerenciar suas empresas.
