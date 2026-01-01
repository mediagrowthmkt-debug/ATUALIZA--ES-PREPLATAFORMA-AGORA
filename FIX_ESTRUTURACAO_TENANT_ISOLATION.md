# 🔧 FIX: Isolamento de Dados na Aba Estruturação

## 🐛 Problema Identificado

**Data:** 28 de dezembro de 2025

### Descrição do Bug
Dados da aba "Estruturação" estavam sendo compartilhados entre contas diferentes:
- **team@tigersaut.com** preencheu todos os campos da estruturação
- **lprotecgranite@gmail.com** viu os mesmos dados duplicados ao fazer login
- Outras contas não apresentaram o problema

### Causa Raiz
As funções de carregamento e salvamento da aba Estruturação estavam usando `auth.currentUser?.uid` diretamente, sem considerar o sistema de **acesso admin fake**.

Quando um admin acessa a conta de um cliente:
1. O sistema cria um `window._adminFakeUser` com o UID do cliente
2. Mas as funções de estruturação continuavam usando `auth.currentUser?.uid` (UID do admin)
3. Isso causava que os dados fossem salvos/carregados do UID errado

## ✅ Solução Implementada

### Funções Corrigidas

Substituímos todas as referências diretas a `auth.currentUser?.uid` por `window.getCurrentUser()?.uid` nas seguintes funções:

#### 1. `loadEstruturacaoFromSubcollections()`
```javascript
// ❌ ANTES (ERRADO)
const uid = auth.currentUser?.uid;
if(!uid) return;

// ✅ DEPOIS (CORRETO)
const currentUser = window.getCurrentUser();
const uid = currentUser?.uid;
if(!uid) return;
```

#### 2. `loadEstruturacaoFromFirebase()`
```javascript
// ❌ ANTES (ERRADO)
const uid = auth.currentUser?.uid;
if(!uid) return;

// ✅ DEPOIS (CORRETO)
const currentUser = window.getCurrentUser();
const uid = currentUser?.uid;
if(!uid) return;
```

#### 3. `persistEstruturacao()`
```javascript
// ❌ ANTES (ERRADO)
const uid = auth.currentUser?.uid;
if(!uid){
  console.warn('[Estruturação] Usuário não autenticado - salvamento cancelado');
  return;
}

// ✅ DEPOIS (CORRETO)
const currentUser = window.getCurrentUser();
const uid = currentUser?.uid;
if(!uid){
  console.warn('[Estruturação] Usuário não autenticado - salvamento cancelado');
  return;
}
```

#### 4. `persistEstruturacaoImmediate()`
```javascript
// ❌ ANTES (ERRADO)
const uid = auth.currentUser?.uid;
if(!uid) return;

// ✅ DEPOIS (CORRETO)
const currentUser = window.getCurrentUser();
const uid = currentUser?.uid;
if(!uid) return;
```

### Sistema de Usuário Efetivo

A função `window.getCurrentUser()` (definida na linha ~11107) funciona assim:

```javascript
window.getCurrentUser = function() {
  return window._adminFakeUser || auth.currentUser;
};
```

**Comportamento:**
- Se existe `window._adminFakeUser` (acesso admin), retorna o fake user com UID do cliente
- Caso contrário, retorna o `auth.currentUser` normal
- Isso garante que SEMPRE pegamos o UID correto, seja acesso direto ou admin

## 🔒 Impacto no Isolamento

### Estrutura no Firestore

```
/usuarios/{uid}/estruturacao/{weekId}
  ├── weekData: {...}
  ├── businessInfo: {...}
  └── updatedAt: timestamp
```

**Agora garantido:**
- ✅ Cada conta salva seus dados na sua própria estrutura `{uid}`
- ✅ Admin acessando conta X salva/lê de `/usuarios/X/estruturacao/...`
- ✅ Não há mais vazamento de dados entre contas

## 📊 Dados Afetados

### Seções da Aba Estruturação:
1. **Contexto do Negócio** (`businessInfo`)
   - Nome do Negócio
   - Nicho/Segmento
   - Localização
   - País de Atuação
   - Tempo de Mercado
   - Orçamento de Marketing
   - Valor Pago para Agência
   - Ticket Médio
   - Observações

2. **Cronograma Semanal** (`weekData` por semana)
   - Checklist de tarefas
   - Notas/anotações
   - Arquivos anexados

## 🧪 Como Testar

### Teste 1: Isolamento entre Contas Normais
1. Faça login com `conta1@exemplo.com`
2. Preencha campos na aba Estruturação
3. Saia e faça login com `conta2@exemplo.com`
4. ✅ Estruturação deve estar vazia (sem dados da conta1)

### Teste 2: Acesso Admin
1. Faça login como admin em `admin-selector.html`
2. Acesse a conta `cliente@exemplo.com`
3. Preencha campos na aba Estruturação
4. Saia e acesse outra conta `cliente2@exemplo.com`
5. ✅ Estruturação de cliente2 deve estar independente

### Teste 3: Persistência
1. Preencha dados na Estruturação
2. Feche o navegador
3. Abra novamente e faça login
4. ✅ Seus dados devem estar salvos

## 🔍 Verificação no Console

Para debugar, abra F12 e observe os logs:

```javascript
// Carregamento
[Estruturação] Carregado de subcoleções: N semanas

// Salvamento
[Estruturação] Salvando imediatamente em subcoleções...
[Estruturação] ✅ Salvo imediatamente!

// UID sendo usado
console.log('UID atual:', window.getCurrentUser()?.uid);
console.log('É admin?', !!window._adminFakeUser);
```

## 📝 Checklist de Correção

- [x] Identificar funções afetadas
- [x] Substituir `auth.currentUser?.uid` por `window.getCurrentUser()?.uid`
- [x] Testar carregamento de dados
- [x] Testar salvamento de dados
- [x] Testar isolamento entre contas
- [x] Testar acesso admin
- [x] Documentar correção

## 🚨 Prevenção Futura

### Padrão Recomendado

Sempre que precisar do UID do usuário no código:

```javascript
// ✅ CORRETO
const currentUser = window.getCurrentUser();
const uid = currentUser?.uid;
if(!uid) return;

// ❌ EVITAR (exceto em contextos específicos onde você sabe que não haverá acesso admin)
const uid = auth.currentUser?.uid;
```

### Funções que Usam o Padrão Correto

Verifique também outras funções críticas que podem precisar do mesmo padrão:
- `buscarMetadadosMidiaZoom()`
- `salvarMetadadosMidiaZoom()`
- Qualquer função que salve/carregue dados do usuário no Firestore

## 📊 Status Atual

✅ **CORRIGIDO** - Todas as funções de estruturação agora usam `window.getCurrentUser()`

---

## 🔗 Arquivos Modificados

- `index.html` (linhas ~29700-30080)
  - `loadEstruturacaoFromSubcollections()`
  - `loadEstruturacaoFromFirebase()`
  - `persistEstruturacao()`
  - `persistEstruturacaoImmediate()`

---

**Documentado por:** GitHub Copilot  
**Data:** 28/12/2025
