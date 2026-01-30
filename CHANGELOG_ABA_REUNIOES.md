# Changelog - Aba Reuniões

## Data: 29 de Janeiro de 2026

### Nova Funcionalidade: Aba "Reuniões"

Foi criada uma nova aba chamada **"Reuniões"** no painel, localizada entre "Notas Time" e "Acessos".

---

## Funcionalidades Implementadas

### 1. **Adicionar Reuniões**
- Botão "Nova Reunião" para adicionar uma nova reunião
- Modal com campos:
  - **Data da reunião** (seletor de data)
  - **Objetivo da reunião** (campo de texto)
  - **Transcrição da reunião** (área de texto grande para colar a conversa completa)

### 2. **Geração Automática de Resumo com IA**
- Ao salvar uma reunião, a IA automaticamente gera um resumo estruturado
- O resumo inclui:
  - 📌 Principais pontos discutidos
  - ✅ Decisões tomadas
  - 📋 Ações e responsáveis
  - ⏰ Prazos
  - 💡 Insights importantes
  - ⚠️ Pendências

### 3. **Visualização em Cards**
- Reuniões são exibidas em blocos/cards lado a lado
- Cada card mostra:
  - Data formatada
  - Objetivo da reunião
  - Preview do resumo (primeiros 150 caracteres)
  - Botão "Ver Resumo" com ícone de lupa (🔍)

### 4. **Organização por Data**
- Cards são ordenados automaticamente por data (mais recente primeiro)
- Visual limpo e organizado para fácil consulta

### 5. **Modal de Visualização Completa**
- Ao clicar em "Ver Resumo", abre modal mostrando:
  - Data completa da reunião
  - Objetivo
  - Resumo completo formatado
  - Transcrição completa (em acordeão expansível)
- Botões:
  - **Copiar Resumo**: copia o resumo para área de transferência
  - **Regenerar Resumo**: gera novo resumo com IA
  - **Fechar**

### 6. **Edição e Exclusão**
- Botão de edição (✏️) em cada card
- Botão de exclusão (🗑️) com confirmação

---

## Estrutura Técnica

### CSS Adicionado
- Classes `.reunioes-wrap`, `.reunioes-header`, `.reunioes-grid`
- Classes `.reuniao-card`, `.reuniao-card-header`, `.reuniao-card-objetivo`, etc.
- Classes `.reuniao-modal`, `.reuniao-modal-content`, etc.
- Responsividade para mobile

### JavaScript Adicionado
- `REUNIOES` - Array para armazenar reuniões
- `loadReunioesFromData()` - Carrega reuniões do Firebase
- `persistReunioes()` - Salva reuniões no Firebase (subcoleção `reunioes/data`)
- `renderReunioes()` - Renderiza os cards
- `openReuniaoModal()` / `closeReuniaoModal()` - Controle do modal de criação/edição
- `saveReuniao()` - Salva e gera resumo
- `generateReuniaoResumoIA()` - Chama a IA para gerar resumo
- `viewReuniao()` - Abre modal de visualização
- `closeReuniaoViewModal()` - Fecha modal de visualização
- `regenerateReuniaoResumo()` - Regenera resumo com IA
- `copyReuniaoResumo()` - Copia resumo para clipboard
- `editReuniao()` / `deleteReuniao()` - Edição e exclusão

### HTML Adicionado
- Seção `#reunioesWrap` com grid de cards
- Modal `#reuniaoModal` para criar/editar
- Modal `#reuniaoViewModal` para visualizar resumo

### Integração
- Adicionado na lista `SECTIONS` como `{ id:"reunioes", name:"Reuniões" }`
- Adicionado em `setSectionVisibility()` 
- Adicionado em `rerenderBySection()`
- Dados salvos em subcoleção do Firebase: `usuarios/{uid}/reunioes/data`

---

## Como Usar

1. Acesse a aba **"Reuniões"** no menu
2. Clique em **"+ Nova Reunião"**
3. Preencha:
   - Data da reunião
   - Objetivo (ex: "Alinhamento de metas do mês")
   - Cole a transcrição completa da conversa
4. Clique em **"💾 Salvar e Gerar Resumo"**
5. Aguarde a IA gerar o resumo automaticamente
6. A reunião aparecerá como um card na grade
7. Clique em **"🔍 Ver Resumo"** para ver detalhes completos

---

## Modelo de IA Utilizado
- `gpt-4o-mini` via OpenRouter
- Max tokens: 2000
- Temperature: 0.3 (para respostas mais focadas)
