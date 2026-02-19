# 🔥 DEPLOY MANUAL DAS REGRAS DO FIRESTORE

## ❌ Problema Atual
Cliente NÃO consegue salvar as respostas do checklist compartilhado porque as **Firestore Rules** não permitem update no campo `items`.

**Erro no console:**
```
❌ [SAVE] Erro ao salvar: FirebaseError: Missing or insufficient permissions.
```

## ✅ Solução: Atualizar Regras no Firebase Console

### 📋 Passo a Passo:

1. **Acesse o Firebase Console:**
   - URL: https://console.firebase.google.com/project/mediagrowth-a5349/firestore/rules

2. **Cole as novas regras para `public_checklists`:**

Procure pela seção:
```javascript
match /public_checklists/{token} {
```

E **SUBSTITUA COMPLETAMENTE** por:

```javascript
match /public_checklists/{token} {
  // Qualquer pessoa com o link pode ler (acesso público para cliente)
  allow read: if true;
  
  // Somente usuário autenticado pode criar novos checklists
  allow create: if isSignedIn()
                && request.resource.data.token == token
                && request.resource.data.uid == request.auth.uid
                && request.resource.data.weekId is string
                && request.resource.data.semana is string
                && request.resource.data.blocoIndex is int
                && request.resource.data.titulo is string;
  
  // ✅ ATUALIZAÇÃO: Qualquer pessoa pode atualizar (cliente preenchendo checklist)
  // Mas apenas campos específicos podem ser modificados por não-autenticados
  allow update: if
    // Usuário autenticado (dono) pode atualizar tudo
    (isSignedIn() && request.auth.uid == resource.data.uid)
    ||
    // ✅ Anônimo (cliente) pode atualizar items (novo formato), checkboxes, observações e status
    (
      request.auth == null
      && request.resource.data.token == resource.data.token
      && request.resource.data.uid == resource.data.uid
      && request.resource.data.weekId == resource.data.weekId
      && resource.data.diff(request.resource.data).changedKeys().hasOnly([
        'items','checkboxes','observacoes','observacoesGerais','completedCount',
        'lastUpdated','lastUpdatedBy','updatedAt','status','completedAt'
      ])
    );
  
  // Apenas o dono autenticado pode deletar
  allow delete: if isSignedIn() && request.auth.uid == resource.data.uid;
}
```

3. **Clique em "Publicar" (botão azul no topo direito)**

4. **Aguarde a mensagem de confirmação:**
   - ✅ "Regras publicadas com sucesso"

## 🧪 Testar Após Deploy:

1. Copie um link de checklist compartilhado
2. Abra em aba anônima (Cmd+Shift+N)
3. Preencha alguns checkboxes e observações
4. Clique em "💾 Salvar Progresso"
5. **Esperado:** ✅ "Progresso salvo!" (sem erro de permissão)

## 📝 Mudanças Feitas:

### ❌ Antes (campos antigos):
```javascript
'checkboxes','observacoes','observacoesGerais','completedCount',
'lastUpdated','lastUpdatedBy','updatedAt','status'
```

### ✅ Depois (com novo campo `items` e `completedAt`):
```javascript
'items','checkboxes','observacoes','observacoesGerais','completedCount',
'lastUpdated','lastUpdatedBy','updatedAt','status','completedAt'
```

## 🔧 Alternativa: Deploy via Terminal

Se preferir usar o terminal (pode demorar 2-3 minutos):

```bash
cd '/Users/bruno/Documents/DJSXVC/DASHBOARD MEDIAGROWHT/ATUALIZAÇÕES PREPLATAFORMA AGORA'
firebase deploy --only firestore:rules
```

Aguarde até ver:
```
✔  Deploy complete!
```

---

## 🎯 Status Atual:
- ✅ Código corrigido (v5.5.6)
- ✅ Regras atualizadas no arquivo `firestore.rules`
- ✅ Commit feito e push para GitHub
- ⏳ **PENDENTE:** Deploy manual das regras no Firebase Console

**Assim que fizer o deploy, o sistema funcionará 100%!** 🚀
