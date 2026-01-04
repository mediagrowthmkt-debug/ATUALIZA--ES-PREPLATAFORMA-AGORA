# Changelog - Fix: Notificações do Widget e Email

## Data: 4 de janeiro de 2026

## 🚨 Problemas Identificados

### 1. Demandas Atrasadas Não Apareciam
- **Sintoma:** Demandas que passaram do prazo não geravam notificação urgente
- **Impacto:** Usuário não era alertado sobre tarefas críticas atrasadas
- **Causa:** A lógica já existia mas não estava clara se funcionava corretamente

### 2. Leads Limitados a "Hoje"
- **Sintoma:** Apenas leads do dia atual apareciam nas notificações
- **Requisito:** Mostrar também leads do mês atual e mês passado
- **Impacto:** Perda de visibilidade sobre o volume de leads recentes

### 3. Posts Pendentes Sem Notificação Específica
- **Sintoma:** Posts aguardando aprovação não tinham notificação dedicada
- **Requisito:** Destacar posts com status "revisar" como prioridade
- **Impacto:** Atrasos na aprovação e publicação de conteúdo

### 4. Bug na Data de Cadastro das Notificações
- **Sintoma:** Todas as notificações apareciam como "cadastradas hoje"
- **Causa:** `attachNotificationTimestamps()` sempre usava `Date.now()` para novas notificações
- **Impacto:** Impossível saber quando demandas/leads/posts foram realmente criados

---

## ✅ Soluções Implementadas

### 1. Demandas Atrasadas (Verificação e Confirmação)

**Status:** ✅ Já funcionava corretamente

A lógica já estava implementada em `buildNotificationItems()`:
```javascript
if(diffDays < 0 && !done){
  const overdueDays = Math.abs(diffDays);
  items.push({
    id: `demanda-${d.id || title}-overdue`,
    category: 'demand',
    severity: 'alert', // ← Criticidade ALTA
    title: 'Demanda atrasada',
    message: `${title} está atrasada há ${overdueLabel}.`
  });
}
```

**Adição:** Agora inclui campo `demandaCreated` com a data real de criação.

---

### 2. Leads do Mês Atual e Anterior

**Implementação:** Expansão da seção de leads

#### Código Adicionado:

```javascript
// ====== LEADS: hoje, mês atual e mês passado ======
const todayLeads = [];
const thisMonthLeads = [];
const lastMonthLeads = [];

leadsList.forEach(lead => {
  // ... parse de datas ...
  
  // Leads de hoje
  if(diffDays === 0) todayLeads.push(lead);
  
  // Leads do mês atual
  if(leadDate >= monthStart && leadDate < nextMonthStart) {
    thisMonthLeads.push(lead);
  }
  
  // Leads do mês passado
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = monthStart;
  if(leadDate >= lastMonthStart && leadDate < lastMonthEnd) {
    lastMonthLeads.push(lead);
  }
});
```

#### Notificações Geradas:

1. **Leads de Hoje** (prioridade alta)
   - Ícone: 🎯
   - Severidade: `info`
   - Mostra até 3 nomes + contador

2. **Leads do Mês Atual**
   - Ícone: 📊
   - Total de leads no mês
   - Meta: "Acompanhe o desempenho do mês"

3. **Leads do Mês Passado**
   - Ícone: 📅
   - Total do mês anterior
   - Meta: "Para comparação com o mês atual"

---

### 3. Posts Pendentes de Aprovação

**Nova notificação criada especificamente para posts com status "revisar"**

```javascript
// ====== POSTS: Notificação de posts pendentes de aprovação ======
const postsAguardandoAprovacao = monthPosts.filter(
  post => (post.status || '').toLowerCase() === 'revisar'
);

if(postsAguardandoAprovacao.length > 0){
  items.push({
    id: `posts-pending-approval-${monthKey}`,
    category: 'posts',
    severity: 'alert', // ← CRITICIDADE ALTA (vermelho)
    icon: '📝',
    title: 'Posts pendentes de aprovação',
    message: `${count} post(s) aguardando revisão no mês atual.`,
    meta: 'Aguardando aprovação para publicação'
  });
}
```

**Características:**
- Severidade `alert` (vermelho) para chamar atenção
- Conta apenas posts com status "revisar"
- Mostra no mês atual
- Usa data do post mais antigo como referência

---

### 4. Fix: Data Real de Cadastro

**Problema:** `attachNotificationTimestamps()` sempre usava `Date.now()`

#### Solução Implementada:

```javascript
function attachNotificationTimestamps(items){
  items.forEach(item => {
    // Se já existe, mantém
    if(notificationCreatedMap[id]){
      item.createdAt = notificationCreatedMap[id];
    } else {
      // Nova notificação: usa data real do item
      let timestamp = now;
      
      // Para demandas, usa campo 'created'
      if(item.category === 'demand' && item.demandaCreated){
        timestamp = item.demandaCreated;
      }
      // Para leads, usa campo 'leadCreated'
      else if(item.category === 'leads' && item.leadCreated){
        timestamp = item.leadCreated;
      }
      // Para posts, usa campo 'postCreated'
      else if(item.category === 'posts' && item.postCreated){
        timestamp = item.postCreated;
      }
      
      notificationCreatedMap[id] = timestamp;
      item.createdAt = timestamp;
    }
  });
}
```

#### Campos Adicionados nas Notificações:

**Demandas:**
```javascript
demandaCreated: d.created || Date.now()
```

**Leads:**
```javascript
leadCreated: lead.createdAt ? parseLeadDate(lead.createdAt) : Date.now()
```

**Posts:**
```javascript
postCreated: getPostDateForNotifications(post) || Date.now()
```

---

## 📊 Resumo das Notificações Atualizadas

### Widget de Notificações (ordem de prioridade):

1. ⏰ **Demandas Atrasadas** (alert - vermelho)
2. ⏰ **Demandas Próximas do Prazo** (warn - amarelo)
3. 🎯 **Metas em Risco** (warn)
4. 📝 **Posts Pendentes Aprovação** (alert - vermelho) ← **NOVO**
5. 🗓️ **Status dos Posts do Mês** (info/warn)
6. 📝 **Meta de Posts Pendente** (warn)
7. 🎯 **Novos Leads Hoje** (info) ← **EXPANDIDO**
8. 📊 **Leads do Mês Atual** (info) ← **NOVO**
9. 📅 **Leads do Mês Passado** (info) ← **NOVO**
10. 🆕 **Novos Itens** (links, redes, etc.)

---

## 🔧 Arquivos Modificados

### `index.html`

#### Função `buildNotificationItems()`
- ✅ Adicionada seção de posts pendentes de aprovação
- ✅ Expandida seção de leads (hoje, mês atual, mês passado)
- ✅ Adicionados campos `demandaCreated`, `leadCreated`, `postCreated`

#### Função `attachNotificationTimestamps()`
- ✅ Lógica para usar data real ao invés de `Date.now()`
- ✅ Suporte para `demandaCreated`, `leadCreated`, `postCreated`
- ✅ Fallback para `Date.now()` se data não disponível

#### Função `applyNotificationData()`
- ✅ Já sincroniza com Service Worker automaticamente
- ✅ Usa `syncNotificationsWithServiceWorker(clientKey)`

### `service-worker.js`
- ✅ Sem alterações necessárias
- ✅ Já busca notificações do IndexedDB
- ✅ Envia para Cloud Function automaticamente

### Cloud Functions
- ✅ Sem alterações necessárias
- ✅ Recebem notificações do Service Worker
- ✅ Geram HTML e enviam via SendGrid

---

## 🧪 Como Testar

### 1. Widget de Notificações

```
1. Criar demanda com prazo vencido
   → Deve aparecer como "Demanda atrasada" (vermelho)
   → Data de cadastro = data real da demanda

2. Adicionar leads hoje
   → Notificação "X novos leads hoje"
   → Verificar leads do mês atual e anterior também aparecem

3. Criar posts com status "revisar"
   → Notificação "Posts pendentes de aprovação" (vermelho)
   → Contador deve bater com posts em revisão

4. Verificar data de cadastro
   → Clicar em uma notificação
   → Campo "Registrado em DD/MM/YYYY - HH:mm"
   → Deve mostrar data REAL, não hoje
```

### 2. Email de Notificações

```
1. Configurar email no painel (⚙️ → Notificações)
2. Definir horário próximo
3. Aguardar envio automático
4. Verificar email recebido:
   ✓ Demandas atrasadas destacadas
   ✓ Posts pendentes de aprovação
   ✓ Leads de hoje, mês atual e anterior
   ✓ Datas corretas em cada item
```

---

## 📝 Notas Importantes

### Compatibilidade
- ✅ Notificações antigas mantêm timestamp original
- ✅ Novas notificações usam data real
- ✅ Service Worker sincroniza automaticamente
- ✅ Email reflete todas as mudanças

### Performance
- ✅ Nenhum impacto significativo
- ✅ Parse de datas já otimizado
- ✅ Sincronização assíncrona

### Persistência
- ✅ Timestamps salvos no `localStorage`
- ✅ Notificações salvas no IndexedDB (Service Worker)
- ✅ Sincronização automática a cada atualização

---

## 🎯 Resultado Final

### Antes:
- ❌ Demandas atrasadas não eram destacadas claramente
- ❌ Apenas leads de hoje
- ❌ Posts pendentes sem notificação dedicada
- ❌ Todas notificações apareciam como "cadastradas hoje"

### Depois:
- ✅ Demandas atrasadas com severidade ALERT (vermelho)
- ✅ Leads de hoje + mês atual + mês passado
- ✅ Posts pendentes com notificação ALERT dedicada
- ✅ Data real de cadastro para todas as notificações
- ✅ Widget e email sincronizados automaticamente

---

## 🚀 Próximos Passos (Opcional)

1. Adicionar filtros no widget (mostrar/ocultar categorias)
2. Ordenação customizável (por data, severidade, categoria)
3. Ações rápidas (marcar demanda como concluída direto do widget)
4. Notificações push do navegador para itens críticos
5. Histórico de notificações resolvidas

---

**Status:** ✅ Implementado e Testado  
**Versão:** 1.0.0  
**Data:** 04/01/2026
