# 🔧 Correção: Salvamento de Checklists e Notas no Firebase - Aba Estruturação

**Data:** Dezembro 2025  
**Tipo:** Bug Fix Crítico  
**Arquivo:** `index.html`

---

## 🐛 Problemas Reportados

### Problema 1: Dados não persistem após refresh
> "Por alguma razão alguns checklists e informações no bloco de notas da lista de checklists da semana não está salvando no Firebase. Atualizo a página e some tudo."

### Problema 2: Documento excede limite do Firebase (NOVO)
```
FirebaseError: Document cannot be written because its size (1,049,133 bytes) 
exceeds the maximum allowed size of 1,048,576 bytes.
```

---

## 🔍 Análise dos Problemas

### Causa 1: Template HTML Incompleto
O template HTML das semanas (`weekEl.innerHTML`) estava **incompleto** - não incluía os elementos de interface para notas, arquivos e checklist.

### Causa 2: Limite de 1MB do Firestore
O Firebase Firestore tem limite de **1 MB por documento**. Com muitas notas e dados da estruturação, o documento do usuário ultrapassou esse limite.

---

## ✅ Correções Aplicadas

### 1. Template HTML Completo (Linha ~35897)
Adicionada toda a estrutura de extras ao template da semana:
- Botões de ação (📝 Bloco de Notas, 🗂️ Arquivos, ✅ Checklist)
- Seção de notas com editor Markdown e toolbar
- Seção de arquivos com upload/paste zone
- Seção de checklist com botão de adicionar

### 2. Sistema de Subcoleções para Documentos Grandes (NOVO)

Quando os dados excedem ~900KB, o sistema automaticamente:
1. Detecta o tamanho antes de salvar
2. Divide os dados por semana
3. Salva cada semana em documento separado na subcoleção `usuarios/{uid}/estruturacao/{weekId}`
4. Marca flag `estruturacaoUsesSubcollection: true` no documento principal

```javascript
// Verificar tamanho do documento antes de salvar
const dataSize = new Blob([JSON.stringify(dataToSave)]).size;

if(dataSize > 900000){
  console.log('[Estruturação] Dados grandes, salvando em subcoleções...');
  await persistEstruturacaoSplit(uid, dataToSave);
} else {
  await setDoc(doc(db, "usuarios", uid), { estruturacao: dataToSave }, { merge: true });
}
```

### 3. Carregamento Inteligente
O sistema verifica a flag e carrega dos locais corretos:

```javascript
if(USER_DATA.estruturacaoUsesSubcollection){
  await loadEstruturacaoFromSubcollections();
} else {
  ESTRUTURACAO_STATE = USER_DATA.estruturacao || {};
}
```

### 4. Debounce e Indicador Visual
- Debounce de 800ms para evitar múltiplas chamadas
- Indicador visual "💾 Salvando..." / "✅ Salvo!" / "❌ Erro"
- Proteção ao sair da página com dados não salvos

### 5. Import do writeBatch
Adicionado `writeBatch` ao import do Firebase Firestore para operações em lote.

---

## 📁 Estrutura de Dados no Firebase

### Antes (documento único):
```
usuarios/{uid}
  └── estruturacao: { semana1: {...}, semana2: {...}, ... }  // PODE EXCEDER 1MB!
```

### Depois (subcoleções quando necessário):
```
usuarios/{uid}
  ├── estruturacaoUsesSubcollection: true
  ├── estruturacaoLastUpdate: "2025-12-24T..."
  └── estruturacao (subcoleção)
        ├── semana1: { blocks: {...}, weekData: {...} }
        ├── semana2: { blocks: {...}, weekData: {...} }
        ├── semana3: { blocks: {...}, weekData: {...} }
        └── ...
```

---

## 🧪 Como Testar

1. **Recarregue a página**
2. **Abra o console do navegador** (F12 → Console)
3. **Navegue para a aba Estruturação**
4. **Adicione conteúdo** (notas, checklists)
5. **Observe os logs:**
   - `[Estruturação] Tamanho dos dados: XXXXX bytes`
   - `[Estruturação] ✅ Salvo com sucesso!` ou
   - `[Estruturação] Dados grandes, salvando em subcoleções...`
   - `[Estruturação] Salvo em N subcoleções`
6. **Recarregue a página**
7. **Verifique se os dados foram preservados!**

---

## 📁 Funções Adicionadas/Modificadas

| Função | Descrição |
|--------|-----------|
| `persistEstruturacaoSplit()` | Nova - Salva dados divididos em subcoleções |
| `loadEstruturacaoFromSubcollections()` | Nova - Carrega dados de subcoleções |
| `persistEstruturacao()` | Modificada - Verifica tamanho e decide método |
| `persistEstruturacaoImmediate()` | Modificada - Suporte a subcoleções |
| `loadEstruturacaoFromUserData()` | Modificada - Detecta uso de subcoleções |

---

## 🔧 Variáveis Adicionadas

```javascript
let estruturacaoUsesSubcollection = false;  // Flag para uso de subcoleções
```

---

## ⚠️ Observações

- A migração para subcoleções é **automática** quando necessário
- Dados antigos no documento principal ainda são lidos (fallback)
- Uma vez migrado para subcoleções, continua usando subcoleções
- O limite de 900KB é conservador para deixar margem de segurança

---

## 🔒 Regras do Firestore Atualizadas

Foi necessário adicionar regras de segurança para a nova subcoleção `estruturacao`.

### Arquivo: `firestore.rules`

Adicionada a seguinte regra dentro do bloco `/usuarios/{userId}`:

```javascript
/* ✅ ESTRUTURAÇÃO: Subcoleção para salvar dados da aba Estruturação (evita limite de 1MB) */
/* Cada semana é salva como documento separado: /usuarios/{userId}/estruturacao/{weekId} */
match /estruturacao/{weekId} {
  // O dono pode ler e escrever seus próprios dados de estruturação
  allow read, write: if isOwner(userId);
  
  // Admin também tem acesso total
  allow read, write: if isAdmin();
  
  // Agências podem acessar se tiverem o mesmo agencyId
  allow read, write: if isAgency() && (
    (exists(resource) && 'agencyId' in resource.data && sameAgencyData(resource.data)) ||
    ('agencyId' in request.resource.data && sameAgencyReq(request.resource.data))
  );
}
```

---

## 🚀 IMPORTANTE: Deploy das Regras

**As regras do Firestore precisam ser deployadas para que as subcoleções funcionem!**

Execute no terminal:

```bash
cd "/Users/bruno/Documents/DJSXVC/DASHBOARD MEDIAGROWHT/ATUALIZAÇÕES PREPLATAFORMA AGORA"
firebase deploy --only firestore:rules
```

Ou faça o deploy pelo Firebase Console:
1. Acesse https://console.firebase.google.com
2. Selecione seu projeto
3. Vá em Firestore Database → Rules
4. Cole o conteúdo atualizado de `firestore.rules`
5. Clique em "Publish"
