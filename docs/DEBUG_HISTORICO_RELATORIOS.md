# 🐛 Debug - Histórico de Relatórios Não Aparecendo

## 🔍 Como Verificar o Problema

Abra o **Console do Navegador** (F12 → Console) e procure por estas mensagens:

### 1. Ao Abrir a Seção de Relatórios

Deve aparecer:
```
[Load Saved Relatorios] Iniciando...
[Load Saved Relatorios] UID: abc123 ClientKey: felipe
[Load Saved Relatorios] Elementos: {historyEl: div#relatorioHistory, tabsEl: div#relatorioHistoryTabs}
[Load Saved Relatorios] Buscando relatórios...
[Load Saved Relatorios] Total encontrado: 2
[Load Saved Relatorios] Relatório: {mesISO: "2025-11", mesNome: "Novembro", ano: "2025", ...}
[Load Saved Relatorios] ✅ Abas renderizadas: 2
```

### 2. Ao Gerar um Relatório

Deve aparecer:
```
[Save Relatorio] Iniciando salvamento para: 2025-11
[Save Relatorio] UID: abc123 ClientKey: felipe
[Save Relatorio] Mês: Novembro Ano: 2025
[Save Relatorio] Dados a salvar: {mesISO: "2025-11", mesNome: "Novembro", ...}
[Save Relatorio] ✅ Relatório Novembro 2025 salvo com sucesso!
```

## ❌ Problemas Comuns e Soluções

### Problema 1: UID ou ClientKey são `undefined`

**Mensagem no console:**
```
[Load Saved Relatorios] UID: undefined ClientKey: undefined
[Load Saved Relatorios] Usuário não autenticado ou cliente não selecionado
```

**Causa:** Firebase Auth não está inicializado ou usuário não está logado

**Solução:**
1. Faça logout e login novamente
2. Verifique se está na URL correta do cliente: `dashboard.mediagrowth.com.br/felipe`

---

### Problema 2: Elementos HTML não encontrados

**Mensagem no console:**
```
[Load Saved Relatorios] Elementos: {historyEl: null, tabsEl: null}
[Load Saved Relatorios] Elementos HTML não encontrados!
```

**Causa:** IDs dos elementos HTML não estão corretos ou não existem

**Solução:**
1. Abra o **Inspetor** (F12 → Elements)
2. Procure por `id="relatorioHistory"`
3. Procure por `id="relatorioHistoryTabs"`
4. Se não encontrar, recarregue a página (Ctrl+F5)

---

### Problema 3: Nenhum relatório salvo

**Mensagem no console:**
```
[Load Saved Relatorios] Total encontrado: 0
[Load Saved Relatorios] Nenhum relatório salvo encontrado
```

**Causa:** Você ainda não gerou nenhum relatório OU os relatórios foram gerados antes da implementação do histórico

**Solução:**
1. Gere um relatório novo:
   - Selecione o mês (ex: Novembro 2025)
   - Clique em "📊 Gerar Relatório"
   - Aguarde o toast de confirmação
2. Abas devem aparecer automaticamente

---

### Problema 4: Erro de permissão do Firestore

**Mensagem no console:**
```
[Load Saved Relatorios] Erro: FirebaseError: Missing or insufficient permissions
```

**Causa:** Regras do Firestore não permitem leitura/escrita na coleção `relatorios`

**Solução - Atualizar Firestore Rules:**

Adicione estas regras no Firebase Console:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{uid}/clients/{clientKey}/relatorios/{reportId} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

---

### Problema 5: setTimeout não executou

**Mensagem no console:**
```
// Nada aparece - silêncio total
```

**Causa:** Função `loadSavedRelatorios()` não foi definida ou erro de sintaxe

**Solução:**
1. Recarregue a página (Ctrl+F5)
2. Verifique se há erros de JavaScript no console
3. Procure por mensagens de erro vermelhas

---

## ✅ Checklist de Verificação

Execute estes passos na ordem:

### Passo 1: Verificar Autenticação
```javascript
// Cole no console:
console.log('Auth:', auth?.currentUser?.uid);
console.log('ClientKey:', getClientKeySafe());
```

**Esperado:** Ambos devem mostrar valores, não `undefined`

---

### Passo 2: Verificar Elementos HTML
```javascript
// Cole no console:
console.log('History:', document.getElementById('relatorioHistory'));
console.log('Tabs:', document.getElementById('relatorioHistoryTabs'));
```

**Esperado:** Ambos devem mostrar elementos `<div>`, não `null`

---

### Passo 3: Forçar Carregamento
```javascript
// Cole no console:
loadSavedRelatorios();
```

**Esperado:** Deve mostrar os logs de debug e renderizar as abas

---

### Passo 4: Verificar Firestore
```javascript
// Cole no console:
const uid = auth.currentUser.uid;
const clientKey = getClientKeySafe();
const col = collection(db, 'usuarios', uid, 'clients', clientKey, 'relatorios');
getDocs(col).then(snap => {
  console.log('Total relatórios:', snap.size);
  snap.forEach(doc => console.log(doc.id, doc.data()));
});
```

**Esperado:** Deve listar todos os relatórios salvos

---

### Passo 5: Gerar Relatório de Teste
1. Selecione mês: **Novembro 2025**
2. Clique em **📊 Gerar Relatório**
3. Aguarde carregar
4. Procure no console:
   ```
   [Save Relatorio] ✅ Relatório Novembro 2025 salvo com sucesso!
   ```
5. Procure o toast:
   ```
   📊 Relatório de Novembro 2025 salvo!
   ```

---

## 🎯 Teste Rápido - Um Comando

Cole isto no console para fazer um teste completo:

```javascript
(async () => {
  console.log('=== TESTE HISTÓRICO DE RELATÓRIOS ===');
  
  console.log('1. Auth:', auth?.currentUser?.uid || 'ERRO: Não autenticado');
  console.log('2. ClientKey:', getClientKeySafe() || 'ERRO: Cliente não selecionado');
  console.log('3. History Element:', document.getElementById('relatorioHistory') ? 'OK' : 'ERRO: Não encontrado');
  console.log('4. Tabs Element:', document.getElementById('relatorioHistoryTabs') ? 'OK' : 'ERRO: Não encontrado');
  
  if(auth?.currentUser?.uid && getClientKeySafe()){
    const uid = auth.currentUser.uid;
    const clientKey = getClientKeySafe();
    const col = collection(db, 'usuarios', uid, 'clients', clientKey, 'relatorios');
    const snap = await getDocs(col);
    console.log('5. Relatórios salvos:', snap.size);
    
    if(snap.size > 0){
      console.log('6. Forçando reload...');
      await loadSavedRelatorios();
      console.log('7. ✅ Teste completo!');
    } else {
      console.log('6. ⚠️ Nenhum relatório salvo. Gere um relatório primeiro!');
    }
  }
})();
```

---

## 📋 Resultado Esperado

Após gerar um relatório, você deve ver:

```
┌─────────────────────────────────────────┐
│ 📂 Relatórios Salvos  [Mostrar/Ocultar]│
├─────────────────────────────────────────┤
│ [Novembro 2025]  [Dezembro 2025]       │
│     Salvo             Salvo             │
└─────────────────────────────────────────┘
```

Se clicar em uma aba:
- Input de mês muda para "2025-11"
- Relatório é gerado automaticamente
- Página faz scroll para o preview

---

## 🆘 Se Nada Funcionar

1. **Limpe o cache do navegador:**
   - Chrome: Ctrl+Shift+Del → "Cached images and files"
   - Recarregue: Ctrl+F5

2. **Teste em aba anônima:**
   - Ctrl+Shift+N (Chrome)
   - Faça login novamente

3. **Verifique se o código foi salvo:**
   - Procure no código-fonte por: `loadSavedRelatorios`
   - Deve aparecer a função completa

4. **Verifique logs do Firebase:**
   - Firebase Console → Firestore → Dados
   - Navegue até: `usuarios/{seu-uid}/clients/{cliente}/relatorios`
   - Deve ter documentos lá

---

**Data:** 02/12/2025  
**Versão do Debug:** 1.0  
**Status:** Logs adicionados ✅
