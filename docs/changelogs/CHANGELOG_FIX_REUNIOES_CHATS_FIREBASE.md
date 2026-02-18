# Correção: Histórico de Conversas de Reuniões por Cliente no Firebase

## Data: 29/01/2026

## Problema Identificado
O histórico de conversas do chat de reuniões estava sendo compartilhado entre todos os clientes porque:
1. Usava `localStorage` com chave genérica `reunioesChats`
2. Não separava os dados por `clientKey`
3. Ao trocar de cliente, as conversas antigas apareciam para o novo cliente

## Solução Implementada

### 1. Migração de localStorage para Firebase
- **Antes**: `localStorage.getItem('reunioesChats')`
- **Depois**: Firebase em `usuarios/{uid}/clients/{clientKey}/reunioesChats/data`

### 2. Isolamento por Cliente
O caminho no Firebase agora inclui:
- `uid` - ID do usuário (agência)
- `clientKey` - ID do cliente selecionado

```javascript
// Path no Firebase
doc(db, 'usuarios', uid, 'clients', clientKey, 'reunioesChats', 'data')
```

### 3. Reset ao Trocar de Cliente
Quando `updateReunioesChatStats()` é chamado (ao carregar reuniões):
1. Reseta `reunioesCurrentChatId = null`
2. Limpa `reunioesChatHistory = []`
3. Reseta a UI do chat para estado inicial
4. Recarrega conversas do Firebase para o cliente atual

### 4. Funções Modificadas

#### `loadReunioesChatsFromStorage()`
```javascript
function loadReunioesChatsFromStorage() {
  const uid = getReunioesTargetUid();
  const clientKey = typeof getClientKey === 'function' ? getClientKey() : null;
  
  if (!uid || !clientKey || clientKey === 'no-client') {
    reunioesAllChats = [];
    renderReunioesChatHistoryList();
    return;
  }
  
  const chatsRef = doc(db, 'usuarios', uid, 'clients', clientKey, 'reunioesChats', 'data');
  // ... carrega do Firebase
}
```

#### `saveReunioesChatsToStorage()`
```javascript
function saveReunioesChatsToStorage() {
  const uid = getReunioesTargetUid();
  const clientKey = typeof getClientKey === 'function' ? getClientKey() : null;
  
  if (!uid || !clientKey || clientKey === 'no-client') return;
  
  const chatsRef = doc(db, 'usuarios', uid, 'clients', clientKey, 'reunioesChats', 'data');
  setDoc(chatsRef, { chats: reunioesAllChats, updatedAt: Date.now() }, { merge: true });
}
```

#### `updateReunioesChatStats()`
Adicionado reset da conversa atual e UI ao recarregar reuniões:
- Reseta variáveis de estado do chat
- Renderiza tela de boas-vindas
- Carrega histórico do cliente correto

## Regras do Firebase
As regras já existentes em `firestore.rules` cobrem este novo caminho:
```plaintext
match /clients/{clientId} {
  // ...
  match /{path=**} {
    allow read, write: if isOwner(userId) || ...
  }
}
```

## Benefícios
1. ✅ Cada cliente tem seu próprio histórico de conversas
2. ✅ Dados persistidos no Firebase (não perde ao limpar cache)
3. ✅ Sincronizado entre dispositivos
4. ✅ Isolamento total entre clientes diferentes
5. ✅ Reset automático ao trocar de cliente

## Estrutura de Dados no Firebase
```
usuarios/
  {uid}/
    clients/
      {clientKey}/
        reunioesChats/
          data: {
            chats: [
              {
                id: "chat_timestamp",
                title: "Título gerado por IA",
                messages: [...],
                createdAt: timestamp,
                updatedAt: timestamp
              }
            ],
            updatedAt: timestamp
          }
```
