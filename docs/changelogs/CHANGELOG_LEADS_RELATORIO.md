# Changelog - Leads no Relatório

## Data: 01/12/2025

### ✨ Nova Funcionalidade: Contador de Leads no Relatório

#### ATUALIZAÇÃO - Correção do Link Público

**Problema identificado:** A contagem de leads não aparecia quando o relatório era acessado via link público (com token de compartilhamento).

**Causa:** A função `buildMonthlyReportData()` no `index.html` não estava incluindo os leads no payload que é salvo no Firestore para compartilhamento público.

**Solução implementada:**

1. **Modificado `index.html` - função `buildMonthlyReportData()`**:
   - Adicionado código para contar leads do mês selecionado
   - Filtragem baseada no campo `createdAt` dos leads
   - Adicionado `leadsCount` no objeto de retorno

2. **Modificado `index.html` - função `createOrUpdateReportShare()`**:
   - Atualizado log de debug para incluir `leadsCount`
   - Garantir que o payload salvo inclui a contagem de leads

3. **Modificado `relatorio.html`**:
   - Atualizado logs de debug para mostrar `leadsCount` recebido
   - Confirmação de que o payload público inclui leads

---

#### O que foi implementado:

1. **Nova Seção "Leads Gerados"** no relatório mensal (`relatorio.html`)
   - Exibe a quantidade total de leads captados durante o mês selecionado
   - Aparece entre a seção de "Metas" e "Redes trabalhadas"
   - Design consistente com o restante do relatório

2. **Filtro por Data de Criação**
   - Os leads são filtrados automaticamente com base no campo `createdAt`
   - Apenas leads criados no mês selecionado no relatório são contabilizados
   - Suporte para timestamps do Firestore e valores numéricos

3. **Integração com Sistema Existente**
   - Utiliza o cliente (TENANT) selecionado no relatório
   - Busca dados da collection: `/usuarios/{uid}/clients/{TENANT}/leads/`
   - Totalmente compatível com o sistema de autenticação existente
   - **✅ FUNCIONA com links públicos compartilhados**

#### Como Funciona:

- **Automático**: Ao visualizar o relatório de um mês específico, o sistema automaticamente:
  1. Carrega todos os leads do cliente
  2. Filtra apenas os leads criados no mês selecionado
  3. Exibe o contador de forma destacada

- **Visual**: 
  - Ícone: 🎯
  - Contador em destaque com fonte grande
  - Descrição contextualizada com o mês

#### Exemplo de Uso:

```
Relatório: Novembro 2025
Leads Gerados: 📊 15 leads
Descrição: 🎯 Total de 15 leads gerados durante Novembro 2025.
```

#### Arquivos Modificados:

1. **`relatorio.html`**:
   - Adicionada seção HTML `#relatorioLeadsSection`
   - Modificada função `loadAndRender()` para carregar leads (modo autenticado)
   - Modificada função `renderReportSections()` para exibir contador
   - Adicionados logs de debug

2. **`index.html`** (NOVO):
   - Modificada função `buildMonthlyReportData()` para incluir leads
   - Filtro de leads por mês usando `createdAt`
   - Atualizado `createOrUpdateReportShare()` para logar leadsCount

#### Detalhes Técnicos:

**Filtro de Leads em `index.html`:**
```javascript
// Contar leads do mês
let leadsCount = 0;
try{
  const leadsList = Array.isArray(LEADS) ? LEADS : [];
  leadsCount = leadsList.filter(lead => {
    if(!lead.createdAt) return false;
    
    // Converter createdAt para data
    let leadDate;
    if(typeof lead.createdAt.toMillis === 'function'){
      leadDate = new Date(lead.createdAt.toMillis());
    } else if(typeof lead.createdAt === 'number'){
      leadDate = new Date(lead.createdAt);
    } else if(typeof lead.createdAt.toDate === 'function'){
      leadDate = lead.createdAt.toDate();
    } else {
      return false;
    }
    
    // Formatar data no formato YYYY-MM
    const year = leadDate.getFullYear();
    const month = String(leadDate.getMonth() + 1).padStart(2, '0');
    const leadMonthISO = `${year}-${month}`;
    
    return leadMonthISO === mesISO;
  }).length;
  console.log('[buildMonthlyReportData] Leads filtrados para', mesISO, ':', leadsCount);
}catch(err){
  console.warn('[buildMonthlyReportData] Erro ao contar leads:', err);
}

return { monthKey: mesISO, labelMonth, tenant, metas, posts, notes, socialLinks, social, goals, leadsCount };
```

**Consulta Firestore em `relatorio.html` (modo autenticado):**
```javascript
const leadsSnap = await getDocs(collection(db,'usuarios', uid, 'clients', TENANT, 'leads'));
```

#### Comportamento:

- ✅ **Exibe seção** quando há leads no mês OU quando há um TENANT selecionado (para mostrar "0 leads" se aplicável)
- ✅ **Oculta seção** quando não há TENANT (relatório genérico sem cliente específico)
- ✅ **Tratamento de erros**: Se houver erro ao carregar leads, não quebra o relatório
- ✅ **Logs detalhados**: Console mostra quantidade de leads carregados e filtrados

#### Compatibilidade:

- ✅ Funciona com modo autenticado (usuário logado)
- ✅ **Funciona com modo público (link compartilhado com token)** ← CORRIGIDO
- ✅ Retrocompatível com relatórios existentes
- ✅ Não afeta outras funcionalidades

#### Como Testar:

1. **Modo Autenticado:**
   - Fazer login no sistema
   - Selecionar um cliente
   - Escolher um mês
   - Visualizar relatório
   - Verificar contador de leads

2. **Modo Público (Link Compartilhado):**
   - Gerar link público usando botão "Copiar link"
   - Abrir link em aba anônima/outro navegador
   - Verificar que contador de leads aparece
   - **IMPORTANTE:** Precisa gerar um NOVO link após esta atualização para incluir leads

#### ⚠️ Observação Importante:

Links de compartilhamento gerados ANTES desta atualização NÃO terão a contagem de leads. É necessário:
1. Acessar o painel administrativo
2. Selecionar o mês desejado
3. Clicar em "Copiar link" novamente para gerar um novo link com leads incluídos

---

## Testado em:

- [x] Navegador: Chrome/Safari
- [x] Ambiente: Desenvolvimento local
- [x] Firebase: Firestore collection `leads`
- [x] Data: 01/12/2025
- [x] Modo autenticado: OK
- [x] Modo público (link compartilhado): OK (após correção)

## Observações:

A implementação é simples e eficiente, focada em mostrar ao cliente de forma clara quantos leads foram gerados no período selecionado. A seção aparece automaticamente quando há dados disponíveis, tanto no modo autenticado quanto no modo público via link compartilhado.
