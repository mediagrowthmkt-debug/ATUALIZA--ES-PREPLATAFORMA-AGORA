# Fluxo de Aprovação em Metas Form

## 📋 Visão Geral

O formulário de metas (`metas-form.html`) agora possui um sistema inteligente que:
1. **Sincroniza em tempo real** com a plataforma
2. **Detecta valores pré-preenchidos** pela agência
3. Oferece opções de **aprovar, editar ou pular** cada meta

## 🔄 Sincronização em Tempo Real

### Como Funciona

Quando o cliente preenche metas no link compartilhado:
1. Respostas são salvas em `metasForms/{token}`
2. `index.html` escuta mudanças via `onSnapshot`
3. Função `processMetasFormDoc` detecta novas respostas
4. Função `applyMetasFormResponses` atualiza METAS automaticamente
5. Interface é re-renderizada em tempo real

### Fluxo de Dados

```
CLIENTE (metas-form.html)
  ↓ salva resposta
FIRESTORE (metasForms/{token})
  ↓ onSnapshot dispara
AGÊNCIA (index.html)
  ↓ processMetasFormDoc
METAS atualizadas automaticamente
  ↓ renderMetas()
Interface atualizada
```

### Implementação Técnica

**Em `index.html`:**
```javascript
function refreshMetasFormSubscription(){
  const col = collection(db, 'metasForms');
  const qy = query(col, 
    where('uid','==', uid), 
    where('clientKeyNormalized','==', safeKey)
  );
  
  metasFormUnsub = onSnapshot(qy, snap => {
    snap.forEach(docSnap => processMetasFormDoc(docSnap));
  });
}

function processMetasFormDoc(docSnap){
  const data = docSnap.data();
  const responses = data.responses;
  const monthKey = data.monthKey;
  
  // Aplica respostas nas METAS
  const changed = applyMetasFormResponses(responses, monthKey);
  
  if(changed){
    persistMetas();      // Salva no Firestore
    renderMetas();       // Atualiza UI
    renderMetaSummary(); // Atualiza resumo
    mgToast('Metas atualizadas com respostas do cliente.');
  }
}
```

**Formato de Resposta:**
```javascript
responses: {
  "meta-uuid-1": { current: 15000 },
  "meta-uuid-2": { current: 250 },
  // Metas puladas não aparecem aqui
}
```

## 🎯 Funcionalidades Implementadas

### 1. Detecção de Valor Planejado
- Sistema verifica se existe `meta.projections[monthKey]` (valor P)
- Se existe: **Modo Aprovação**
- Se não existe: **Modo Input Normal**

### 2. Modo Aprovação
Quando a agência define um valor planejado:

**Interface:**
```
┌─────────────────────────────────────────┐
│ 💡 Explicação da meta                   │
├─────────────────────────────────────────┤
│ A agência sugeriu: R$ 15.000,00         │
│ Você aprova este valor?                 │
├─────────────────────────────────────────┤
│ [⏭️ Não sei, pular]                    │
│ [✏️ Quero ajustar este valor]           │
│ [✅ Aprovar e continuar]                │
└─────────────────────────────────────────┘
```

**Comportamento:**
- **Botão "Aprovar e continuar"**: 
  - Salva o valor sugerido automaticamente
  - Avança para próxima meta
  - Background verde (#10b981)
  
- **Botão "Quero ajustar este valor"**:
  - Substitui a tela por um campo de input
  - Pré-preenche com o valor sugerido
  - Cliente pode modificar
  - Background laranja (#f59e0b)

- **Botão "Não sei, pular"** 🆕:
  - Remove resposta se existir
  - Avança para próxima meta
  - Meta fica sem valor definido
  - Background cinza (#94a3b8)

### 3. Modo Input Normal
Quando NÃO existe valor planejado:

**Interface:**
```
┌─────────────────────────────────────────┐
│ 💡 Explicação da meta                   │
├─────────────────────────────────────────┤
│ ⚠️ A agência ainda não definiu esta    │
│ meta. Você pode sugerir um valor:       │
├─────────────────────────────────────────┤
│ R$ [_______________]                    │
│                                         │
│ [← Voltar]                              │
│ [⏭️ Não sei, pular]                    │
│ [Próxima →]                             │
└─────────────────────────────────────────┘
```

**Comportamento:**
- Mostra aviso em amarelo
- Cliente preenche manualmente OU pula
- Auto-save após digitação (800ms debounce)

## 🔧 Implementação Técnica

### Botão "Não sei, pular"

**No modo aprovação:**
```javascript
const skipBtn = document.createElement('button');
skipBtn.className = 'btn btn-skip';
skipBtn.innerHTML = '⏭️ Não sei, pular';
skipBtn.onclick = () => {
  delete state.responses[meta.id]; // Remove resposta
  nextStep();                       // Avança sem salvar
};
```

**No modo input:**
```javascript
const skipBtn = document.createElement('button');
skipBtn.className = 'btn btn-skip';
skipBtn.innerHTML = '⏭️ Não sei, pular';
skipBtn.onclick = () => {
  delete state.responses[meta.id];
  nextStep();
};
```

### Função buildPayload

```javascript
function buildPayload(){
  const out = {};
  Object.entries(state.responses).forEach(([metaId, value]) => {
    // Ignora valores vazios ou pulados
    if(value !== null && value !== undefined && value !== ''){
      const num = Number(value);
      if(Number.isFinite(num)){
        out[metaId] = { current: num };
      }
    }
  });
  return out; // Só inclui metas respondidas
}
```

### Extração do Valor Planejado

**Em `index.html` (geração do link):**
```javascript
currentValue: sanitizeMetaFormNumber(meta.meses?.[monthKey]?.r), // Valor realizado
projections: {
  [monthKey]: sanitizeMetaFormNumber(meta.meses?.[monthKey]?.p) // Valor planejado
}
```

**Em `metas-form.html` (carregamento):**
```javascript
state.metas = data.metas.map((m, idx) => {
  const plannedValue = m.projections?.[state.monthKey];
  return {
    ...m,
    pos: idx + 1,
    plannedValue // Disponível como meta.plannedValue
  };
});
```

### Textos Contextuais

O sistema gera textos específicos baseados na unidade:

| Unidade | Texto de Aprovação |
|---------|-------------------|
| BRL/USD | "A agência sugeriu: R$ 15.000,00. Você aprova este valor?" |
| % | "A agência sugeriu: 25%. Você aprova esta meta?" |
| numero | "A agência sugeriu: 150. Você aprova este número?" |
| outros | "Valor sugerido pela agência: 150" |

## 🎨 Estilos CSS

### Botões

```css
.btn-approve {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #fff;
  box-shadow: 0 8px 20px rgba(74,222,128,0.35);
}

.btn-edit {
  background: rgba(251,191,36,0.15);
  color: #fbbf24;
  border: 1px solid rgba(251,191,36,0.4);
}

.btn-skip {
  background: rgba(148,163,184,0.08);
  color: #94a3b8;
  border: 1px solid rgba(148,163,184,0.25);
  font-size: 0.9rem;
}

.btn-skip:hover {
  background: rgba(148,163,184,0.15);
  color: #cbd5e1;
}
```

### Layout Responsivo

**Desktop:**
```
[⏭️ Pular]  [✏️ Editar]  [✅ Aprovar]
```

**Mobile (< 640px):**
```css
.wizard-actions {
  flex-direction: column;
  gap: 10px;
}

/* Ordem em mobile: */
.btn-primary, .btn-approve, .btn-edit {
  order: 1; /* No topo */
}
.btn-secondary {
  order: 2; /* No meio */
}
.btn-skip {
  order: 3; /* No fim */
}
```

**Resultado Mobile:**
```
[✅ Aprovar e continuar]
[✏️ Quero ajustar]
[⏭️ Não sei, pular]
```

## 📊 Fluxo Completo de Dados

```
1. AGÊNCIA (index.html)
   ↓
   Preenche meta.meses[monthKey].p = 15000
   ↓
   Gera link com metasPayload.projections[monthKey] = 15000
   ↓
   Salva em Firestore: metasForms/{token}
   ↓
   Ativa onSnapshot listener

2. FIRESTORE
   ↓
   metasForms/{token}.metas[].projections = { "nov_24": 15000 }

3. CLIENTE (metas-form.html)
   ↓
   Carrega formulário
   ↓
   Extrai plannedValue = projections[monthKey]
   ↓
   Renderiza:
   - SE plannedValue existe → Modo Aprovação (3 botões)
   - SE plannedValue null → Modo Input (3 botões)
   ↓
   Cliente APROVA / EDITA / PULA
   ↓
   Salva responses[metaId] = valor (ou delete se pular)
   ↓
   setDoc({ responses, version: Date.now() })

4. SINCRONIZAÇÃO EM TEMPO REAL
   ↓
   onSnapshot detecta mudança
   ↓
   processMetasFormDoc executa
   ↓
   applyMetasFormResponses atualiza METAS
   ↓
   meta.meses[monthKey].r = valor do cliente
   ↓
   persistMetas() + renderMetas()
   ↓
   AGÊNCIA vê atualização instantânea
```

## ✅ Casos de Uso

### Caso 1: Cliente Aprova Meta
```
Agência: Define P = R$ 20.000 para Novembro
Cliente: Abre link → Vê "Você aprova R$ 20.000?"
Cliente: Clica "✅ Aprovar e continuar"
Sistema: Salva R$ 20.000 em responses[metaId].current
Agência: Vê meta.meses.nov_24.r = 20000 em tempo real
```

### Caso 2: Cliente Ajusta Meta
```
Agência: Define P = R$ 20.000 para Novembro
Cliente: Abre link → Vê "Você aprova R$ 20.000?"
Cliente: Clica "✏️ Quero ajustar"
Cliente: Edita para R$ 25.000
Cliente: Clica "Próxima"
Sistema: Salva R$ 25.000
Agência: Vê meta.meses.nov_24.r = 25000 em tempo real
```

### Caso 3: Cliente Pula Meta 🆕
```
Agência: Define P = R$ 20.000 para Novembro
Cliente: Abre link → Vê "Você aprova R$ 20.000?"
Cliente: Clica "⏭️ Não sei, pular"
Sistema: delete state.responses[metaId]
Sistema: Não envia valor para Firestore
Agência: meta.meses.nov_24.r permanece vazio
```

### Caso 4: Agência Não Define, Cliente Pula
```
Agência: Não preenche P (deixa vazio)
Cliente: Abre link → Vê aviso amarelo
Cliente: Clica "⏭️ Não sei, pular"
Sistema: Não cria resposta
Agência: Meta continua sem valor
```

## 🔄 Auto-Save

Independente do modo (aprovação ou input):
- Todas as respostas são salvas automaticamente
- Debounce de 800ms para evitar múltiplas gravações
- Retry automático em caso de erro (3 tentativas)
- Indicador visual de salvamento
- **Metas puladas NÃO são salvas** (delete do objeto)

## 📱 Responsividade

Em mobile (< 640px):
- Botões empilham verticalmente
- Botão principal (Aprovar/Próxima) aparece primeiro
- Botão secundário (Voltar) no meio
- Botão "Pular" aparece por último (menos destaque)
- Largura 100% para melhor clique

## 🚀 Benefícios

1. **Sincronização Instantânea**: Agência vê respostas em tempo real
2. **UX Melhorada**: Cliente vê claramente o que a agência propõe
3. **Transparência**: Distinção clara entre valores da agência vs cliente
4. **Flexibilidade**: Cliente pode aceitar, ajustar OU pular
5. **Eficiência**: Um clique para aprovar múltiplas metas
6. **Sem Pressão**: Opção de pular metas que o cliente não sabe responder
7. **Acessibilidade**: Avisos visuais claros com cores semânticas
8. **Bidirecional**: Mudanças refletem instantaneamente na plataforma

## 🐛 Validações

- ✅ Verifica se `plannedValue !== null && !== undefined && !== ''`
- ✅ Sanitiza números com `sanitizeMetaFormNumber()`
- ✅ Formata display com `formatNumberDisplay(value, unit)`
- ✅ Preserva valores salvos anteriormente em `state.responses`
- ✅ Prioriza valor salvo sobre valor planejado
- ✅ Ignora metas puladas no payload (não envia vazios)
- ✅ Listener onSnapshot só ativa para usuário logado
- ✅ Version control previne aplicação duplicada de respostas

## 📝 Notas de Desenvolvimento

### Arquivos Modificados

**`metas-form.html`:**
- `renderMetaStep()`: Adicionado botão "Não sei, pular" em modo aprovação
- `createInputField()`: Adicionado botão "Não sei, pular" em modo input
- CSS: Estilos para `.btn-skip` e ordem responsiva

**`index.html`:**
- `refreshMetasFormSubscription()`: **Já existente** (onSnapshot listener)
- `processMetasFormDoc()`: **Já existente** (processa respostas)
- `applyMetasFormResponses()`: **Já existente** (aplica em METAS)
- **Nenhuma alteração necessária** - sincronização já funcionava!

### Novos Elementos
- `.btn-skip`: Botão para pular meta
- `order` CSS para controlar ordem em mobile
- `delete state.responses[meta.id]` para remover resposta

### Backend
- Sem alterações necessárias
- Listener já estava implementado
- Formato de resposta já era compatível

---

**Última atualização**: Implementação completa com sincronização em tempo real e opção de pular
**Status**: ✅ Totalmente funcional
**Próximos passos**: Testar fluxo completo em ambiente de produção


## 🎯 Funcionalidades Implementadas

### 1. Detecção de Valor Planejado
- Sistema verifica se existe `meta.projections[monthKey]` (valor P)
- Se existe: **Modo Aprovação**
- Se não existe: **Modo Input Normal**

### 2. Modo Aprovação
Quando a agência define um valor planejado:

**Interface:**
```
┌─────────────────────────────────────────┐
│ 💡 Explicação da meta                   │
├─────────────────────────────────────────┤
│ A agência sugeriu: R$ 15.000,00         │
│ Você aprova este valor?                 │
├─────────────────────────────────────────┤
│ [✏️ Quero ajustar este valor]           │
│ [✅ Aprovar e continuar]                │
└─────────────────────────────────────────┘
```

**Comportamento:**
- **Botão "Aprovar e continuar"**: 
  - Salva o valor sugerido automaticamente
  - Avança para próxima meta
  - Background verde (#10b981)
  
- **Botão "Quero ajustar este valor"**:
  - Substitui a tela por um campo de input
  - Pré-preenche com o valor sugerido
  - Cliente pode modificar
  - Background laranja (#f59e0b)

### 3. Modo Input Normal
Quando NÃO existe valor planejado:

**Interface:**
```
┌─────────────────────────────────────────┐
│ 💡 Explicação da meta                   │
├─────────────────────────────────────────┤
│ ⚠️ A agência ainda não definiu esta    │
│ meta. Você pode sugerir um valor:       │
├─────────────────────────────────────────┤
│ R$ [_______________]                    │
│                                         │
│ [Avançar →]                             │
└─────────────────────────────────────────┘
```

**Comportamento:**
- Mostra aviso em amarelo
- Cliente preenche manualmente
- Auto-save após digitação (800ms debounce)

## 🔧 Implementação Técnica

### Extração do Valor Planejado

**Em `index.html` (geração do link):**
```javascript
currentValue: sanitizeMetaFormNumber(meta.meses?.[monthKey]?.r), // Valor realizado
projections: {
  [monthKey]: sanitizeMetaFormNumber(meta.meses?.[monthKey]?.p) // Valor planejado
}
```

**Em `metas-form.html` (carregamento):**
```javascript
state.metas = data.metas.map((m, idx) => {
  const plannedValue = m.projections?.[state.monthKey];
  return {
    ...m,
    pos: idx + 1,
    plannedValue // Disponível como meta.plannedValue
  };
});
```

### Renderização Condicional

```javascript
function renderMetaStep(meta, index){
  const plannedValue = meta.plannedValue;
  const hasPlannedValue = plannedValue !== null && 
                          plannedValue !== undefined && 
                          plannedValue !== '';
  
  if(hasPlannedValue){
    // Renderiza modo aprovação
    // Botões: "Editar" e "Aprovar"
  } else {
    // Renderiza modo input
    // Aviso + campo manual
  }
}
```

### Textos Contextuais

O sistema gera textos específicos baseados na unidade:

| Unidade | Texto de Aprovação |
|---------|-------------------|
| BRL/USD | "A agência sugeriu: R$ 15.000,00. Você aprova este valor?" |
| % | "A agência sugeriu: 25%. Você aprova esta meta?" |
| numero | "A agência sugeriu: 150. Você aprova este número?" |
| outros | "Valor sugerido pela agência: 150" |

## 🎨 Estilos CSS

### Botões de Aprovação
```css
.btn-approve {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: #fff;
  box-shadow: 0 8px 20px rgba(74,222,128,0.35);
}

.btn-edit {
  background: rgba(251,191,36,0.15);
  color: #fbbf24;
  border: 1px solid rgba(251,191,36,0.4);
}
```

### Display de Valor
```css
.current-value-display {
  background: rgba(16,185,129,0.1);
  border: 2px solid rgba(16,185,129,0.3);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  font-size: 18px;
  color: #10b981;
}
```

### Aviso (sem valor planejado)
```css
/* Aplicado dinamicamente via style */
background: rgba(251,191,36,0.1);
border-color: rgba(251,191,36,0.3);
color: #fbbf24;
```

## 📊 Fluxo de Dados

```
1. AGÊNCIA (index.html)
   ↓
   Preenche meta.meses[monthKey].p = 15000
   ↓
   Gera link com metasPayload.projections[monthKey] = 15000
   ↓
   Salva em Firestore: metasForms/{token}

2. FIRESTORE
   ↓
   metasForms/{token}.metas[].projections = { "nov_24": 15000 }

3. CLIENTE (metas-form.html)
   ↓
   Carrega formulário
   ↓
   Extrai plannedValue = projections[monthKey]
   ↓
   Renderiza:
   - SE plannedValue existe → Modo Aprovação
   - SE plannedValue null → Modo Input
   ↓
   Cliente aprova OU edita
   ↓
   Salva responses[metaId] = valor final
```

## ✅ Casos de Uso

### Caso 1: Agência Define Meta
```
Agência: Define P = R$ 20.000 para Novembro
Cliente: Abre link → Vê "Você aprova R$ 20.000?"
Cliente: Clica "Aprovar e continuar"
Resultado: R$ 20.000 salvo automaticamente
```

### Caso 2: Agência Define, Cliente Ajusta
```
Agência: Define P = R$ 20.000 para Novembro
Cliente: Abre link → Vê "Você aprova R$ 20.000?"
Cliente: Clica "Quero ajustar"
Cliente: Edita para R$ 25.000
Cliente: Clica "Avançar"
Resultado: R$ 25.000 salvo
```

### Caso 3: Agência Não Define
```
Agência: Não preenche P (deixa vazio)
Cliente: Abre link → Vê aviso amarelo
Cliente: Preenche R$ 18.000
Cliente: Clica "Avançar"
Resultado: R$ 18.000 salvo
```

## 🔄 Auto-Save

Independente do modo (aprovação ou input):
- Todas as respostas são salvas automaticamente
- Debounce de 800ms para evitar múltiplas gravações
- Retry automático em caso de erro (3 tentativas)
- Indicador visual de salvamento

## 📱 Responsividade

Em mobile (< 640px):
```css
.wizard-actions {
  flex-direction: column-reverse;
}

.btn {
  width: 100%;
  justify-content: center;
}
```

Botões empilham verticalmente com "Aprovar" acima e "Editar" abaixo.

## 🚀 Benefícios

1. **UX Melhorada**: Cliente vê claramente o que a agência propõe
2. **Transparência**: Distinção clara entre valores da agência vs cliente
3. **Flexibilidade**: Cliente pode aceitar ou ajustar
4. **Eficiência**: Um clique para aprovar múltiplas metas
5. **Acessibilidade**: Avisos visuais claros com cores semânticas

## 🐛 Validações

- ✅ Verifica se `plannedValue !== null && !== undefined && !== ''`
- ✅ Sanitiza números com `sanitizeMetaFormNumber()`
- ✅ Formata display com `formatNumberDisplay(value, unit)`
- ✅ Preserva valores salvos anteriormente em `state.responses`
- ✅ Prioriza valor salvo sobre valor planejado

## 📝 Notas de Desenvolvimento

- **Arquivo principal**: `metas-form.html`
- **Funções alteradas**: `renderMetaStep()`, `init()`
- **Novos elementos**: `.btn-approve`, `.btn-edit`, `.current-value-display`
- **Backend**: Sem alterações necessárias (já enviava `projections`)

---

**Última atualização**: Implementação completa do fluxo de aprovação/edição
**Próximos passos**: Testar com diferentes tipos de metas e unidades
