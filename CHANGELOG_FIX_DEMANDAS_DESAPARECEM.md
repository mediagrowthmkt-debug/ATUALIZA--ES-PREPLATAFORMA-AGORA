# 🔧 FIX CRÍTICO: Demandas Desaparecendo (Limite Firebase + Permissões)

## 🐛 Problema Identificado

**Sintomas:**
- ✅ Usuário cria/edita demanda
- ❌ Demanda some imediatamente após salvar
- ❌ Todas as demandas ficam vazias após atualização

**Erros no Console:**
```
❌ [PERSIST] Erro na migração: FirebaseError: Document cannot be written because its size (1,048,605 bytes) exceeds the maximum allowed size of 1,048,576 bytes.

❌ [LOAD] Erro ao carregar subcoleção: FirebaseError: Missing or insufficient permissions.
```

### Causa Raiz:
Dois problemas combinados:

1. **Documento ainda maior que 1MB**: Durante a migração, estava tentando salvar `demandas` + `demandaMonthPlans` no documento principal, ultrapassando o limite
2. **Falta de permissões**: As regras do Firestore não incluíam acesso à subcoleção `demandas_chunks`

## 🛠️ Solução Implementada

### 1. Regras do Firestore Atualizadas

**Arquivo:** `firestore.rules`

Adicionado acesso à subcoleção `demandas_chunks`:

```javascript
/* ✅ DEMANDAS CHUNKS: Subcoleção para salvar demandas em chunks (evita limite de 1MB) */
/* Cada chunk é salvo como documento separado: /usuarios/{userId}/demandas_chunks/{chunkId} */
match /demandas_chunks/{chunkId} {
  // O dono pode ler e escrever seus próprios chunks de demandas
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

### 2. Migração Otimizada

**Arquivo:** `index.html` (linha ~61180)

**Antes:**
```javascript
// ❌ Tentava salvar tudo de uma vez, ultrapassando limite
await setDoc(doc(db,'usuarios',uid), { 
  usesSubcollection: true,
  demandasCount: DEMANDAS.length,
  demandaMonthPlans: monthPlansPayload, // Pode ser grande!
  lastUpdated: Date.now()
}, { merge:true });
```

**Depois:**
```javascript
// ✅ Usa updateDoc + deleteField para remover dados grandes
await updateDoc(doc(db,'usuarios',uid), { 
  demandas: deleteField(), // Remove array de demandas
  usesSubcollection: true,
  demandasCount: DEMANDAS.length,
  demandaMonthPlans: monthPlansPayload, // Mantém planos (pequeno)
  lastUpdated: Date.now()
});
```

### 3. Detecção de Erro Melhorada

Adicionada detecção mais precisa do erro de tamanho:

```javascript
if(err.code === 'invalid-argument' 
   || err.message?.includes('maximum size') 
   || err.message?.includes('too large')
   || err.message?.includes('exceeds the maximum')){ // ✅ NOVO
  // Migração automática
}
```

### 4. Logs Detalhados

Adicionados logs para monitoramento:

```javascript
console.log(`🔄 [PERSIST] Migrando ${DEMANDAS.length} demandas em ${chunks.length} chunks`);
console.log('✅ [PERSIST] Documento principal limpo');
console.log('✅ [PERSIST] Migração para subcoleção concluída com sucesso!');
```

## 📋 Estrutura do Firebase Após Migração

### Documento Principal (`/usuarios/{uid}`)
```javascript
{
  usesSubcollection: true,       // ✅ Flag ativa
  demandasCount: 250,            // Total de demandas
  demandaMonthPlans: {...},      // Planos mensais (pequeno)
  lastUpdated: 1736688234567,
  // demandas: REMOVIDO!          // ❌ Array grande removido
}
```

### Subcoleção (`/usuarios/{uid}/demandas_chunks/chunk_0`)
```javascript
{
  demandas: [...],               // Até 50 demandas
  chunkIndex: 0,
  timestamp: 1736688234567
}
```

## 🚀 Deploy Necessário

### 1. Fazer Deploy das Regras do Firestore

```bash
# Dar permissão de execução ao script
chmod +x deploy-firestore-rules.sh

# Executar deploy
./deploy-firestore-rules.sh
```

Ou manualmente:
```bash
firebase deploy --only firestore:rules
```

### 2. Verificar Deploy

1. Acesse o [Console do Firebase](https://console.firebase.google.com)
2. Vá em **Firestore Database** → **Rules**
3. Verifique se a regra `demandas_chunks` está presente

## ✅ Teste

### Passos para Testar:

1. **Limpar cache**: Cmd/Ctrl + Shift + R
2. **Fazer login** na plataforma
3. **Criar uma demanda** na aba Planejamento
4. **Verificar logs** no console:
   ```
   📊 [PERSIST] Tamanho estimado dos dados: XX KB
   🔄 [PERSIST] Migrando X demandas em Y chunks
   ✅ [PERSIST] Documento principal limpo
   ✅ [PERSIST] Migração concluída com sucesso!
   ```
5. **Recarregar página** e verificar que demanda permanece

### Se ainda houver erro:

```bash
# Verificar se as regras foram aplicadas
firebase firestore:rules:get

# Forçar novo deploy
firebase deploy --only firestore:rules --force
```

## 📊 Status

**Data:** 12 de janeiro de 2026  
**Status:** 🔄 Aguardando deploy das regras  
**Impacto:** Crítico - impede uso da aba Planejamento  
**Cliente Afetado:** `contact@innovbuildersusa.com` (e potencialmente outros com muitas demandas)

## 📝 Checklist

- [x] Código corrigido
- [x] Regras do Firestore atualizadas
- [ ] **Deploy das regras realizado** ⚠️ PENDENTE
- [ ] Teste com cliente confirmado

---

**⚠️ ATENÇÃO:** É necessário fazer o deploy das regras do Firestore para que a correção funcione completamente!

```bash
./deploy-firestore-rules.sh
```
