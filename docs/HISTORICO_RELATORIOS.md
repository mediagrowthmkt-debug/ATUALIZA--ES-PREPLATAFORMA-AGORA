# 📂 Sistema de Histórico de Relatórios

## 🎯 Objetivo

Implementar um sistema de histórico que salva automaticamente cada relatório gerado no Firebase, permitindo:
- ✅ Acessar relatórios anteriores sem precisar gerar novamente
- ✅ Organização por mês/ano em abas clicáveis
- ✅ Substituição automática se gerar novo relatório do mesmo mês
- ✅ Análise histórica durante o ano

## 🏗️ Arquitetura

### Estrutura no Firebase Firestore

```
usuarios/{uid}/clients/{clientKey}/relatorios/{mesISO}
```

**Exemplo:**
```
usuarios/abc123/clients/felipe/relatorios/2025-11
usuarios/abc123/clients/felipe/relatorios/2025-12
```

### Documento de Relatório

```javascript
{
  mesISO: "2025-11",           // ID do documento (YYYY-MM)
  mesNome: "Novembro",         // Nome do mês
  ano: "2025",                 // Ano
  generatedAt: Timestamp,      // Data/hora de geração
  storiesCount: 15,            // Total de stories
  postsCount: 8,               // Total de posts
  goalsCount: 12,              // Total de objetivos
  metasCount: 5                // Total de metas
}
```

## 📋 Funcionalidades Implementadas

### 1. Interface HTML

**Localização:** Antes dos filtros de relatório

```html
<div class="relatorio-history" id="relatorioHistory">
  <h3>📂 Relatórios Salvos</h3>
  <button id="toggleHistoryBtn">Mostrar/Ocultar</button>
  
  <div class="relatorio-history-tabs" id="relatorioHistoryTabs">
    <!-- Abas são geradas dinamicamente -->
  </div>
</div>
```

### 2. CSS - Estilização das Abas

```css
.relatorio-history-tab {
  display: inline-flex;
  gap: 8px;
  padding: 8px 14px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.15));
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.relatorio-history-tab:hover {
  transform: translateY(-2px);
}
```

### 3. Funções JavaScript

#### `saveRelatorioToFirebase(mesISO)`

**Quando executa:** Automaticamente após gerar um relatório

**O que faz:**
1. Coleta dados do relatório atual
2. Cria/atualiza documento no Firestore
3. Exibe toast de confirmação

**Código:**
```javascript
async function saveRelatorioToFirebase(mesISO){
  const uid = auth?.currentUser?.uid;
  const clientKey = getClientKeySafe();
  
  const relatorioData = {
    mesISO,
    mesNome,
    ano,
    generatedAt: serverTimestamp(),
    storiesCount: STORIES_CAROUSEL.filter(...).length,
    postsCount: POSTS.filter(...).length,
    goalsCount: GOALS.length,
    metasCount: META_SUBMISSIONS.length
  };
  
  const docRef = doc(db, 'usuarios', uid, 'clients', clientKey, 'relatorios', mesISO);
  await setDoc(docRef, relatorioData, { merge: true });
}
```

#### `loadSavedRelatorios()`

**Quando executa:** 
- Ao abrir a seção de relatórios (`initRelatorio`)
- Após gerar um relatório novo

**O que faz:**
1. Busca todos os relatórios salvos do Firebase
2. Ordena por data de geração (mais recente primeiro)
3. Renderiza abas clicáveis
4. Bind eventos de click

**Código:**
```javascript
async function loadSavedRelatorios(){
  const relatoriosCol = collection(db, 'usuarios', uid, 'clients', clientKey, 'relatorios');
  const q = query(relatoriosCol, orderBy('generatedAt', 'desc'));
  const snapshot = await getDocs(q);
  
  const tabs = snapshot.docs.map(doc => {
    const data = doc.data();
    return `
      <button class="relatorio-history-tab" data-mes-iso="${data.mesISO}">
        <span class="tab-date">${data.mesNome} ${data.ano}</span>
        <span class="tab-badge">Salvo</span>
      </button>
    `;
  }).join('');
  
  tabsEl.innerHTML = tabs;
}
```

#### `openSavedRelatorio(mesISO)`

**Quando executa:** Ao clicar em uma aba de relatório salvo

**O que faz:**
1. Define o mês no input
2. Chama `gerarRelatorio()` para renderizar
3. Faz scroll suave para o preview

**Código:**
```javascript
async function openSavedRelatorio(mesISO){
  relatorioMesInput.value = mesISO;
  await gerarRelatorio();
  relatorioPreview.scrollIntoView({ behavior: 'smooth' });
}
```

## 🔄 Fluxo Completo

### Gerar Novo Relatório

```
Usuário clica "Gerar Relatório"
    ↓
gerarRelatorio() executa
    ↓
Renderiza todas as seções (stories, posts, goals, metas, leads, redes)
    ↓
setTimeout 300ms
    ↓
gerarResumoTexto() + saveRelatorioToFirebase()
    ↓
Salva no Firestore: /usuarios/{uid}/clients/{clientKey}/relatorios/{mesISO}
    ↓
loadSavedRelatorios() recarrega abas
    ↓
Nova aba aparece no histórico
```

### Abrir Relatório Salvo

```
Usuário clica em aba "Novembro 2025"
    ↓
openSavedRelatorio("2025-11")
    ↓
Define relatorioMesInput.value = "2025-11"
    ↓
gerarRelatorio() busca dados do mês
    ↓
Renderiza relatório (DADOS SÃO BUSCADOS NOVAMENTE, NÃO DO FIREBASE)
    ↓
Scroll para preview
```

## 📝 Visual da Interface

```
┌─────────────────────────────────────────────────────┐
│ 📊 Relatórios                                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│ 📂 Relatórios Salvos    [Mostrar/Ocultar]          │
│ ┌─────────────────────────────────────────────────┐ │
│ │ [Dezembro 2025] [Novembro 2025] [Outubro 2025] │ │
│ │     Salvo           Salvo          Salvo        │ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│ 📅 Selecione o Mês: [2025-12 ▼]                    │
│ [📊 Gerar Relatório] [⬇ Exportar PDF]               │
│                                                      │
│ ┌───────────────────────────────────────────────┐   │
│ │ 📅 Dezembro 2025 • ✅ Relatório gerado       │   │
│ │ • [🔗 Copiar link]                            │   │
│ └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## ⚙️ Comportamento Especial

### Substituição de Relatório Existente

**Cenário:** Usuário gera relatório de Novembro, depois gera novamente

**O que acontece:**
```javascript
// setDoc com merge: true substitui os dados
await setDoc(docRef, relatorioData, { merge: true });
```

✅ **Resultado:** Relatório de Novembro é atualizado (não duplicado)

### Toggle Mostrar/Ocultar

**Função:**
```javascript
toggleHistoryBtn.addEventListener('click', () => {
  isVisible = !isVisible;
  historyTabs.style.display = isVisible ? 'flex' : 'none';
});
```

✅ Permite esconder abas para economizar espaço visual

## 🎨 Estados Visuais

### Sem Relatórios Salvos
```html
<div id="relatorioHistory" style="display:none">
  <!-- Oculto completamente -->
</div>
```

### Com Relatórios Salvos
```html
<div id="relatorioHistory" style="display:block">
  <div id="relatorioHistoryTabs">
    <button class="relatorio-history-tab">Dezembro 2025</button>
    <button class="relatorio-history-tab">Novembro 2025</button>
  </div>
</div>
```

## 🔍 Dados Salvos vs Dados Renderizados

**IMPORTANTE:** O sistema atual salva **metadados** (contadores), mas ao abrir um relatório salvo, ele **busca os dados novamente** das coleções originais.

### O que É Salvo no Firebase
```javascript
{
  mesISO: "2025-11",
  mesNome: "Novembro",
  ano: "2025",
  generatedAt: Timestamp,
  storiesCount: 15,     // ✅ Salvo
  postsCount: 8,        // ✅ Salvo
  goalsCount: 12,       // ✅ Salvo
  metasCount: 5         // ✅ Salvo
}
```

### O que É Renderizado ao Abrir
```javascript
// Busca STORIES_CAROUSEL original
renderRelatorioStories(mesISO);

// Busca POSTS original
renderRelatorioPosts(mesISO);

// Busca GOALS original
renderRelatorioGoals(mesISO);

// Busca META_SUBMISSIONS original
renderRelatorioMetas(mesISO);

// Busca leads do Firestore
await renderRelatorioLeads(mesISO);

// Busca redes de REF_SOCIAL
renderRelatorioRedes(mesISO);
```

## 💡 Melhorias Futuras (Opcional)

### 1. Salvar HTML Completo do Relatório
```javascript
const relatorioData = {
  mesISO,
  mesNome,
  ano,
  generatedAt: serverTimestamp(),
  htmlContent: relatorioPreview.innerHTML, // Salva HTML renderizado
  storiesCount: 15,
  postsCount: 8
};
```

**Vantagem:** Relatório abre instantaneamente sem precisar buscar dados novamente

### 2. Snapshot de Dados
```javascript
const relatorioData = {
  mesISO,
  mesNome,
  ano,
  generatedAt: serverTimestamp(),
  stories: STORIES_CAROUSEL.filter(...), // Array completo
  posts: POSTS.filter(...),
  goals: GOALS,
  metas: META_SUBMISSIONS
};
```

**Vantagem:** Preserva estado exato do relatório mesmo se dados originais mudarem

### 3. Indicador Visual de "Último Gerado"
```html
<button class="relatorio-history-tab active">
  <span class="tab-date">Dezembro 2025</span>
  <span class="tab-badge primary">Atual</span>
</button>
```

## 🐛 Troubleshooting

### Abas não aparecem
**Causa:** Nenhum relatório foi gerado ainda
**Solução:** Gere pelo menos um relatório

### Relatório duplicado ao clicar na aba
**Causa:** `gerarRelatorio()` está sendo chamado duas vezes
**Solução:** Verificar se não há duplicate event listeners

### Dados antigos aparecem ao abrir relatório salvo
**Causa:** Cache de variáveis globais (STORIES_CAROUSEL, POSTS, etc)
**Solução:** Sistema já busca dados atualizados automaticamente

## ✅ Checklist de Funcionalidades

- [x] HTML das abas de histórico
- [x] CSS estilização das abas
- [x] Função `saveRelatorioToFirebase()`
- [x] Função `loadSavedRelatorios()`
- [x] Função `openSavedRelatorio()`
- [x] Auto-save ao gerar relatório
- [x] Auto-load ao abrir seção
- [x] Botão toggle mostrar/ocultar
- [x] Substituição de relatório existente (merge: true)
- [x] Toast de confirmação ao salvar
- [x] Scroll suave ao abrir relatório
- [x] Ordenação por data (mais recente primeiro)

## 📊 Estrutura de Dados Completa

```
Firestore Database
└── usuarios
    └── {uid}
        └── clients
            └── {clientKey}
                ├── posts/              (dados originais)
                ├── stories/            (dados originais)
                ├── goals/              (dados originais)
                ├── metas/              (dados originais)
                ├── leads/              (dados originais)
                └── relatorios/         ⭐ NOVO!
                    ├── 2025-01/
                    ├── 2025-02/
                    ├── 2025-11/
                    └── 2025-12/
```

---

**Data de Implementação:** 02/12/2025  
**Versão:** 1.0  
**Status:** ✅ Implementado e Funcionando
