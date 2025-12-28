# Changelog: Seletor de Fontes na Aba I.A

## Data: 2024
## Versão: 1.0

---

## 📋 RESUMO

Implementado **Seletor de Fontes** na aba I.A, permitindo que o usuário escolha quais abas da plataforma devem ser consultadas pela inteligência artificial ao responder perguntas. Isso torna as buscas mais focadas e eficientes.

---

## 🎯 O QUE FOI IMPLEMENTADO

### 1. **Interface do Usuário (UI)**

#### Dropdown de Seleção de Fontes
- Botão com texto dinâmico mostrando fontes selecionadas
- Menu dropdown com 14 checkboxes (13 abas + opção "Todas")
- Botões de ação: "Marcar Todas", "Limpar" e "Aplicar"
- Estilo visual consistente com o design da plataforma

#### Abas Disponíveis para Seleção:
1. ✨ **Todas as Abas** (padrão)
2. 🏗️ **Estruturação** - Informações do negócio e semanas de planejamento
3. 🔎 **Macro** - Análises mensais e histórico
4. 📋 **Planejamento** - Planejamento estratégico
5. 📅 **Calendário** - Observações do calendário
6. 📸 **Posts** - Calendário de posts e publicações
7. 🎯 **Metas** - Objetivos e resultados
8. 💰 **CAC** - Custos de aquisição e investimentos
9. 👥 **Leads** - Dados de leads (estrutura preparada)
10. 📝 **Anotações** - Anotações da plataforma
11. 🔑 **Acessos** - Credenciais e ferramentas
12. 📁 **Arquivos** - Estrutura de arquivos organizados
13. 📊 **Relatório** - Dados de relatórios (estrutura preparada)
14. 📋 **Demandas** - Tarefas e projetos

---

### 2. **Lógica de Negócio**

#### Variável de Estado
```javascript
let IA_SELECTED_SOURCES = ['all']; // Fontes selecionadas
```

#### Funções de Extração de Dados
Criadas 9 novas funções especializadas para extrair dados de cada aba:

1. **`buildMetasDetail(metasState)`** - Extrai metas planejadas vs realizadas
2. **`buildCACDetail()`** - Extrai custos, vendas, faturamento e CAC calculado
3. **`buildAnotacoesDetail(notesState)`** - Extrai anotações com timestamps
4. **`buildAcessosDetail(firebase)`** - Extrai credenciais (senhas mascaradas)
5. **`buildMacroDetail(firebase)`** - Extrai análises mensais (resumo, pontos +/-, aprendizados)
6. **`buildPlanejamentoDetail(firebase)`** - Extrai planejamento estratégico
7. **`buildArquivosDetail(firebase)`** - Conta pastas e arquivos organizados
8. **`buildEstruturacaoNotesText()`** - Extrai todas as 4 semanas da estruturação (já existia, aprimorada)
9. **`buildEstruturacaoAnalysesText()`** - Extrai análises geradas pela IA (já existia)

#### Filtragem de Contexto
A função `buildIAContextMessages()` foi modificada para:
- Verificar quais fontes estão selecionadas
- Extrair dados APENAS das fontes selecionadas
- Adicionar mensagem ao sistema informando a busca focada
- Invalidar cache quando seleção muda

---

### 3. **Interações e Eventos**

#### Event Listeners Implementados:

**Toggle do Dropdown**
```javascript
iaSourcesBtn?.addEventListener('click', (e) => {
  // Abre/fecha o menu dropdown
});
```

**Checkbox "Todas as Abas"**
```javascript
sourceAllCheckbox?.addEventListener('change', () => {
  // Marca/desmarca todas as outras checkboxes
});
```

**Checkboxes Individuais**
```javascript
// Atualiza estado do checkbox "Todas" (checked, unchecked, indeterminate)
```

**Botão "Marcar Todas"**
```javascript
iaSourcesSelectAll?.addEventListener('click', () => {
  // Marca todas as checkboxes
});
```

**Botão "Limpar"**
```javascript
iaSourcesClearAll?.addEventListener('click', () => {
  // Desmarca todas as checkboxes
});
```

**Botão "Aplicar"**
```javascript
iaSourcesApply?.addEventListener('click', () => {
  // Atualiza IA_SELECTED_SOURCES
  // Atualiza texto do botão
  // Fecha o menu
  // Invalida cache de contexto
});
```

**Click Fora do Dropdown**
```javascript
document.addEventListener('click', (e) => {
  // Fecha o menu se clicar fora
});
```

#### Função de Atualização do Texto do Botão
```javascript
function updateSourcesButtonText() {
  // Atualiza o texto do botão baseado nas seleções:
  // - "Todas as Abas (14)" - se todas selecionadas
  // - "Estruturação" - se apenas 1 selecionada
  // - "Estruturação, Metas" - se 2-3 selecionadas
  // - "5 Abas Selecionadas" - se mais de 3
}
```

---

### 4. **Mensagem ao Sistema de IA**

Quando o usuário seleciona fontes específicas (não "Todas"), a IA recebe uma instrução adicional:

```
⚠️ BUSCA FOCADA: O usuário selecionou apenas as seguintes abas para 
consulta: [Estruturação, Metas, CAC]. Utilize APENAS os dados dessas 
fontes específicas. Se a informação não estiver nessas abas, informe 
que não está disponível na busca atual e sugira incluir outras abas 
se necessário.
```

---

## 🎨 ESTILO CSS

### Classes Adicionadas:

```css
.ia-sources-select { /* Container do seletor */ }
.ia-sources-label { /* Label "Buscar em:" */ }
.ia-sources-dropdown { /* Container do dropdown */ }
.ia-sources-btn { /* Botão principal */ }
.ia-sources-menu { /* Menu dropdown (escondido por padrão) */ }
.ia-sources-menu.show { /* Menu visível */ }
.ia-source-option { /* Container de cada checkbox */ }
.ia-sources-actions { /* Container dos botões de ação */ }
.ia-sources-action-btn { /* Botões Marcar/Limpar/Aplicar */ }
```

### Responsividade:
- Em telas menores que 768px, o seletor fica abaixo do seletor de tamanho
- Layout vertical para melhor usabilidade mobile

---

## 🔄 FLUXO DE FUNCIONAMENTO

### Fluxo Completo:

1. **Usuário clica no botão** "Todas as Abas (14)"
2. **Menu dropdown abre** mostrando 14 checkboxes
3. **Usuário seleciona** as abas desejadas (ex: Estruturação, Metas, CAC)
4. **Usuário clica "Aplicar"**
5. **Sistema atualiza**:
   - Variável `IA_SELECTED_SOURCES = ['estruturacao', 'metas', 'cac']`
   - Texto do botão para "3 Abas Selecionadas"
   - Invalida cache de contexto
6. **Usuário digita pergunta** na aba I.A
7. **Sistema chama** `buildIAContextMessages()`
8. **Função verifica** `IA_SELECTED_SOURCES`
9. **Função extrai dados** APENAS de Estruturação, Metas e CAC
10. **IA recebe contexto focado** + mensagem sobre busca focada
11. **IA responde** usando apenas os dados das fontes selecionadas

---

## ✅ BENEFÍCIOS

### Para o Usuário:
- ✅ **Buscas mais rápidas** - Menos dados para processar
- ✅ **Respostas mais focadas** - IA busca apenas onde pedido
- ✅ **Controle granular** - Escolhe exatamente onde buscar
- ✅ **Economia de tokens** - Menos contexto = menos custo de API

### Para a Plataforma:
- ✅ **Otimização de performance** - Menos dados extraídos
- ✅ **Melhor UX** - Usuário entende de onde vêm os dados
- ✅ **Flexibilidade** - Fácil adicionar novas fontes no futuro
- ✅ **Cache inteligente** - Invalida apenas quando necessário

---

## 🧪 COMO TESTAR

### Teste 1: Todas as Abas
1. Abrir aba I.A
2. Verificar que botão mostra "Todas as Abas (14)"
3. Fazer pergunta sobre qualquer dado da plataforma
4. IA deve buscar em todas as fontes

### Teste 2: Busca Focada
1. Clicar no botão de fontes
2. Desmarcar "Todas as Abas"
3. Selecionar apenas "Estruturação" e "Metas"
4. Clicar "Aplicar"
5. Botão deve mostrar "Estruturação, Metas"
6. Fazer pergunta sobre CAC
7. IA deve informar que CAC não está nas fontes selecionadas

### Teste 3: Marcar/Limpar Todas
1. Abrir dropdown
2. Clicar "Limpar" - todas desmarcadas
3. Clicar "Marcar Todas" - todas marcadas
4. Checkbox "Todas as Abas" deve ficar checked

### Teste 4: Indeterminate State
1. Desmarcar "Todas as Abas"
2. Marcar manualmente algumas abas (não todas)
3. Checkbox "Todas" deve ficar indeterminate (nem checked nem unchecked)

---

## 📦 MAPEAMENTO DE DADOS

### Mapeamento Fonte → Função de Extração:

| Aba | ID Interno | Função de Extração | Dados Extraídos |
|-----|-----------|-------------------|-----------------|
| Estruturação | `estruturacao` | `buildEstruturacaoNotesText()` | Info do negócio, 4 semanas, blocos, itens |
| Estruturação | `estruturacao` | `buildEstruturacaoAnalysesText()` | Análises geradas pela IA |
| Metas | `metas` | `buildMetasDetail()` | Metas planejadas vs realizadas por mês |
| Macro | `macro` | `buildMacroDetail()` | Resumo mensal, pontos +/-, aprendizados |
| Planejamento | `planejamento` | `buildPlanejamentoDetail()` | Planejamento estratégico geral |
| Calendário | `calendario` | `buildCalendarNotesDetail()` | Observações por data |
| Posts | `posts` | `buildPostsText()` | Legendas, datas, status, mídias |
| CAC | `cac` | `buildCACDetail()` | Investimentos, vendas, faturamento, CAC |
| Anotações | `anotacoes` | `buildAnotacoesDetail()` | Anotações com título e timestamp |
| Acessos | `acessos` | `buildAcessosDetail()` | Login, URL, tag (senha mascarada) |
| Arquivos | `arquivos` | `buildArquivosDetail()` | Contagem de pastas e arquivos |
| Demandas | `demandas` | `buildDemandasText()` | Tarefas e projetos |
| Leads | `leads` | *(preparado)* | Estrutura pronta para leads |
| Relatório | `relatorio` | *(preparado)* | Estrutura pronta para relatórios |

---

## 🔮 PRÓXIMOS PASSOS (Futuro)

### Melhorias Sugeridas:
1. **Salvar preferências** do usuário no localStorage
2. **Adicionar extração de Leads** quando disponível
3. **Adicionar extração de Relatório** quando estrutura estabilizar
4. **Histórico de fontes** mais utilizadas
5. **Sugestão inteligente** de fontes baseada na pergunta
6. **Visualização de tokens** economizados com busca focada

---

## 📝 NOTAS TÉCNICAS

### Invalidação de Cache:
- Cache é invalidado quando usuário aplica nova seleção de fontes
- Garante que próxima pergunta use contexto atualizado

### Formato de Dados:
- IDs internos são lowercase sem acentos (ex: `estruturacao`, `calendario`)
- Nomes de exibição são formatados com emojis e acentos
- Array vazio em `IA_SELECTED_SOURCES` é tratado como "all" (fallback)

### Compatibilidade:
- Funciona com todos os navegadores modernos
- Suporte a touch devices (mobile)
- Acessibilidade via checkboxes nativas

---

## ✨ CRÉDITOS

**Desenvolvido para:** Mediagrowth  
**Objetivo:** Permitir buscas focadas e eficientes na aba I.A  
**Status:** ✅ Implementado e Funcional  
**Data:** 2024  

---

## 📞 SUPORTE

Para dúvidas ou problemas:
1. Verificar se todas as abas desejadas estão marcadas
2. Clicar em "Aplicar" após selecionar
3. Tentar "Marcar Todas" e aplicar se houver erro
4. Verificar console do navegador (F12) para erros JavaScript

---

**Fim do Changelog**
