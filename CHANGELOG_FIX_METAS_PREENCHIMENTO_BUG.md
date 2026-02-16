# 🐛 FIX: Bug Crítico de Preenchimento e Salvamento nas Metas

## Data: 15/02/2026 - CORREÇÃO COMPLETA V2

## 🔴 Problema Identificado

Bug crítico onde ao preencher valores em metas específicas, os valores eram:
1. ❌ Duplicados para TODAS as metas após atualizar a página
2. ❌ Valores de Janeiro sumiam ao preencher Fevereiro
3. ❌ Não eram salvos corretamente na ordem inserida

### Comportamento Incorreto Observado:
1. Usuário preenche "100" em Janeiro da Meta #1
2. Usuário preenche "200" em Fevereiro da Meta #1
3. Ao atualizar a página (F5):
   - ❌ Janeiro desaparece
   - ❌ Fevereiro aparece em Janeiro de TODAS as metas
   - ❌ Dados não são preservados

## 🔍 Causas Raízes Identificadas

### 1. ❌ Problema de Referência no `loadMetasFromUserData()`

**Código Bugado (linha 62478):**
```javascript
const saved = savedMetas.find(s => s.nome === defaultMeta.nome && s.categoria === defaultMeta.categoria);
```

**Problema:** A propriedade `nome` não existe! O objeto usa `descricao`.

**Resultado:** Nunca encontrava metas salvas, sempre recriava do zero.

### 2. ❌ Problema de Referência Compartilhada nos Objetos `meses`

**Código Bugado:**
```javascript
return {
  ...defaultMeta,
  meses: saved.meses || defaultMeta.meses  // ❌ REFERÊNCIA COMPARTILHADA!
};
```

**Problema:** Spread operator (`...`) cria cópia rasa. O objeto `meses` era compartilhado entre múltiplas metas.

**Resultado:** Alterar `meta1.meses.jan` alterava `meta2.meses.jan` também!

### 3. ❌ Mutação Direta dos Objetos na Normalização

**Código Bugado:**
```javascript
METAS = METAS.map(m => {
  if(!m.meses || typeof m.meses !== 'object'){
    m.meses = createEmptyMonths();  // ❌ MUTAÇÃO DIRETA!
  }
  return m;  // ❌ Retorna objeto original mutado
});
```

**Problema:** Modificava o objeto original em vez de criar novo.

## ✅ Soluções Implementadas

### 1. ✅ Correção da Busca de Metas Salvas

```javascript
// ✅ BUSCAR POR DESCRICAO (não nome)
const saved = savedMetas.find(s => 
  s.descricao === defaultMeta.descricao && 
  s.categoria === defaultMeta.categoria
);

if(saved){
  // ✅ CÓPIA PROFUNDA DOS MESES (não referência)
  const mesesCopy = {};
  META_MONTHS.forEach(month => {
    mesesCopy[month] = saved.meses && saved.meses[month] ? saved.meses[month] : '';
  });
  
  return {
    ...defaultMeta,
    id: saved.id || defaultMeta.id,
    pos: saved.pos || defaultMeta.pos,
    meses: mesesCopy  // ✅ OBJETO NOVO, NÃO REFERÊNCIA
  };
}
```

### 2. ✅ Criação de Novos Objetos na Normalização

```javascript
// ✅ CRIAR NOVO OBJETO COMPLETO (não mutar)
METAS = METAS.map(m => {
  const newMeses = {};
  
  if(!m.meses || typeof m.meses !== 'object'){
    META_MONTHS.forEach(month => {
      newMeses[month] = '';
    });
  } else {
    META_MONTHS.forEach(month => {
      if(typeof m.meses[month] === 'object'){
        newMeses[month] = m.meses[month].r || '';
      } else if(m.meses[month] !== undefined && m.meses[month] !== null){
        newMeses[month] = String(m.meses[month]);
      } else {
        newMeses[month] = '';
      }
    });
  }
  
  // ✅ RETORNAR NOVO OBJETO COMPLETO
  return {
    id: m.id,
    pos: m.pos,
    categoria: m.categoria,
    descricao: m.descricao,
    unidade: m.unidade,
    meses: newMeses  // ✅ OBJETO NOVO
  };
});
```

### 3. ✅ Logs Detalhados para Debug

```javascript
// No handleSave:
console.log(`📝 [ANTES] Meta: ${targetMeta.descricao}, Mês: ${month}, Valor Atual: "${targetMeta.meses[month]}"`);
targetMeta.meses[month] = newValue;
console.log(`💾 [DEPOIS] Meta: ${targetMeta.descricao}, Mês: ${month}, Novo Valor: "${newValue}"`);
console.log(`🔍 [VERIFICAÇÃO] Objeto meses completo:`, JSON.stringify(targetMeta.meses));

// No load:
console.log('🔍 [LOAD] Amostra das primeiras 3 metas:');
METAS.slice(0, 3).forEach((m, i) => {
  console.log(`  ${i+1}. ${m.descricao} - jan: "${m.meses.jan}", fev: "${m.meses.fev}"`);
});

// No save:
console.log('🔍 [SAVE] Amostra das primeiras 3 metas salvas:');
metasCopy.slice(0, 3).forEach((m, i) => {
  console.log(`  ${i+1}. ${m.descricao} - jan: "${m.meses.jan}", fev: "${m.meses.fev}"`);
});
```

## 🎯 Garantias Implementadas

### ✅ Isolamento Completo de Dados
- Cada meta tem seu próprio objeto `meses` único
- Não há compartilhamento de referências entre metas
- Cada mês é uma propriedade string independente

### ✅ Salvamento Correto
- Busca por `descricao` + `categoria` (chave correta)
- Preservação de IDs e posições ao carregar
- Cópia profunda ao salvar e carregar

### ✅ Rastreabilidade
- Logs antes e depois de cada alteração
- Verificação de objeto completo
- Amostra de dados ao carregar e salvar

## 🧪 Como Testar - PASSO A PASSO

### Teste 1: Salvamento Individual
1. ✅ Abrir Console do navegador (F12)
2. ✅ Preencher Janeiro da Meta #1 com "100"
3. ✅ Verificar logs: `[ANTES]`, `[DEPOIS]`, `[VERIFICAÇÃO]`, `[SAVE]`
4. ✅ Atualizar página (F5)
5. ✅ Verificar log `[LOAD]`
6. ✅ Confirmar que apenas Janeiro da Meta #1 tem "100"

### Teste 2: Múltiplos Meses
1. ✅ Preencher Janeiro da Meta #1 com "100"
2. ✅ Preencher Fevereiro da Meta #1 com "200"
3. ✅ Atualizar página (F5)
4. ✅ Confirmar que Janeiro tem "100" E Fevereiro tem "200"

### Teste 3: Múltiplas Metas
1. ✅ Preencher Janeiro da Meta #1 com "100"
2. ✅ Preencher Janeiro da Meta #2 com "999"
3. ✅ Atualizar página (F5)
4. ✅ Confirmar que Meta #1 Jan = "100"
5. ✅ Confirmar que Meta #2 Jan = "999"
6. ✅ Confirmar que outras metas estão vazias

### Teste 4: Ordem de Inserção
1. ✅ Preencher valores em ordem aleatória
2. ✅ Meta #5 Março = "AAA"
3. ✅ Meta #2 Julho = "BBB"
4. ✅ Meta #8 Janeiro = "CCC"
5. ✅ Atualizar página (F5)
6. ✅ Confirmar que TODOS os valores estão nos lugares corretos

## 📊 Impacto

- ✅ **Bug Crítico Completamente Corrigido**
- ✅ **Dados Preservados Corretamente**
- ✅ **Isolamento de Referências Garantido**
- ✅ **Debug Facilitado com Logs Detalhados**
- ✅ **Zero Perda de Dados ao Atualizar**

## 🔧 Arquivos Alterados

### `index.html`

#### 1. Função `loadMetasFromUserData()` (linhas ~62472-62510)
- ✅ Correção: `s.nome` → `s.descricao`
- ✅ Adição: Cópia profunda de `meses`
- ✅ Adição: Preservação de `id` e `pos`
- ✅ Adição: Logs de carregamento

#### 2. Normalização de Estrutura (linhas ~62512-62540)
- ✅ Mudança: Criar novos objetos em vez de mutar
- ✅ Garantia: Cada meta tem novo objeto `meses`
- ✅ Conversão: Formato antigo → formato novo

#### 3. Função `handleSave()` em `createMetaRows()` (linhas ~63507-63520)
- ✅ Adição: Logs antes/depois/verificação
- ✅ Mantido: Closure com valores fixos
- ✅ Garantia: Salvamento apenas do mês específico

#### 4. Função `debouncedPersistMetas()` (linhas ~62548-62565)
- ✅ Adição: Logs de salvamento com amostra
- ✅ Mantido: Cópia profunda via JSON
- ✅ Garantia: localStorage sempre atualizado

## 📝 Notas Técnicas

### Referência Compartilhada vs Cópia Profunda

**❌ Problema:**
```javascript
const obj1 = { meses: { jan: '' } };
const obj2 = { ...obj1 };  // Spread copia raso
obj2.meses.jan = '100';
console.log(obj1.meses.jan);  // '100' - COMPARTILHADO!
```

**✅ Solução:**
```javascript
const obj1 = { meses: { jan: '' } };
const newMeses = {};
Object.keys(obj1.meses).forEach(k => {
  newMeses[k] = obj1.meses[k];  // Cópia profunda manual
});
const obj2 = { ...obj1, meses: newMeses };
obj2.meses.jan = '100';
console.log(obj1.meses.jan);  // '' - INDEPENDENTE!
```

### Estrutura de Dados Final

```javascript
{
  id: "abc123-uuid",
  pos: 1,
  categoria: "trafego_pago",
  descricao: "Investimento",
  unidade: "BRL",
  meses: {
    jan: "1000",
    fev: "2000",
    mar: "",
    abr: "",
    mai: "",
    jun: "",
    jul: "",
    ago: "",
    set: "",
    out: "",
    nov: "",
    dez: ""
  }
}
```

## ✅ Status: CORRIGIDO E TESTADO - V3 FINAL

**ATUALIZAÇÃO CRÍTICA:** Correção do salvamento no Firebase do cliente

### 🐛 Bug Adicional Encontrado (15/02/2026 - 21:40)

**Problema:** As metas estavam sendo salvas no localStorage mas NÃO no Firebase do cliente.

**Causa:** A função `persistMetas()` estava salvando no documento do **usuário admin** em vez do documento do **cliente**.

**Correção:**
```javascript
// ✅ DETERMINAR UID CORRETO (usuário ou cliente)
let targetUid = null;

if (Array.isArray(clientDocPathParts) && clientDocPathParts.length >= 2) {
  // Admin visualizando cliente: salvar no documento do CLIENTE
  targetUid = clientDocPathParts[1];
  console.log(`👤 [persistMetas] Salvando no cliente: ${targetUid}`);
} else {
  // Usuário normal: salvar no próprio documento
  targetUid = auth.currentUser?.uid;
  console.log(`👤 [persistMetas] Salvando no usuário: ${targetUid}`);
}

// ✅ SALVAR NO DOCUMENTO CORRETO
const userDocRef = doc(db, 'usuarios', targetUid);
await setDoc(userDocRef, dataToSave, { merge: true });
```

**Resultado:**
- ✅ localStorage: Funcionando
- ✅ Firebase do usuário: Funcionando
- ✅ Firebase do cliente: CORRIGIDO! Agora funciona

Data de Correção: 15/02/2026
Versão: 3.0 - Salvamento Completo (localStorage + Firebase Cliente)
