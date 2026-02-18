# Changelog - Nova Aba "Notas Time"

## Data: 06/01/2026

## Resumo
Criada uma nova aba chamada **"Notas Time"** com layout estilo Trello/Kanban para anotações diárias do time de marketing.

## Funcionalidades Implementadas

### 📝 Board Kanban com Colunas
- **4 colunas principais** com rolagem horizontal:
  - 🎯 **Tráfego** - Anotações sobre campanhas e tráfego pago
  - 📢 **Canais de Tração** - Anotações sobre canais de aquisição
  - 👔 **Liderança** - Anotações sobre gestão e liderança
  - 📌 **Outros** - Outras anotações gerais

### 🎨 Design Minimalista
- Cards com design clean e moderno
- Botão "+" para adicionar notas rapidamente
- Contador de notas em cada coluna
- Scroll horizontal suave no board
- Scroll vertical dentro de cada coluna

### ✨ Funcionalidades de Cada Card
- **Texto com formatação** - Suporta quebras de linha
- **Links clicáveis** - URLs são automaticamente convertidas em links
- **Anexar imagens** - Upload de imagens via botão ou arrastar/colar
- **Identificação do autor** - Nome e foto de quem criou a nota
- **Data de criação** - Timestamp automático
- **Editar/Excluir** - Botões aparecem ao passar o mouse

### 💾 Persistência
- Dados salvos automaticamente no Firebase
- Sincronização entre todos os membros do time
- Cada nota guarda: autor, data, coluna, conteúdo e anexos
- **Suporte a sessão admin** - Funciona corretamente quando admin acessa cliente via URL

## Correções (v1.1)

### 🔧 Fix: "Faça login para salvar" em sessão admin
- **Problema**: Ao acessar como admin via URL (`?client=...`), o sistema não encontrava o UID correto
- **Solução**: Adicionada função `getTeamNotesTargetUid()` que verifica:
  1. `clientDocPathParts` (quando admin está visualizando cliente)
  2. `window.getCurrentUser()` (que inclui `_adminFakeUser`)
  3. `auth.currentUser?.uid` (fallback)
- **Funções atualizadas**: `persistTeamNotes()`, `handleTeamNoteFileSelect()`, `saveTeamNote()`

## Arquivos Modificados

### `index.html`
1. **CSS adicionado** (~300 linhas)
   - Estilos para `.team-notes-wrap`, `.team-notes-board`, `.team-notes-column`
   - Cards, botões, modal de edição
   - Responsividade para mobile

2. **HTML adicionado** (~90 linhas)
   - Seção `#teamNotesWrap` com as 4 colunas
   - Modal `#teamNotesModal` para criar/editar notas

3. **JavaScript adicionado** (~250 linhas)
   - Array `TEAM_NOTES` para armazenar as notas
   - Funções: `renderTeamNotes()`, `openTeamNoteModal()`, `saveTeamNote()`, `editTeamNote()`, `deleteTeamNote()`
   - Upload de imagens para Firebase Storage
   - Suporte para colar imagens (Ctrl+V)

4. **Integrações**
   - Adicionado `{ id:"teamNotes", name:"Notas Time" }` ao array `SECTIONS`
   - Atualizado `setSectionVisibility()` para incluir `teamNotes`
   - Atualizado `rerenderBySection()` para chamar `renderTeamNotes()`
   - Adicionada variável `teamNotesWrap`

## Estrutura de Dados no Firebase

```javascript
// Em usuarios/{uid}/teamNotes
{
  id: "uuid",
  column: "trafego" | "canais" | "lideranca" | "outros",
  content: "Texto da nota...",
  attachments: ["https://url-da-imagem-1.jpg", "https://url-da-imagem-2.jpg"],
  authorId: "uid-do-autor",
  authorName: "Nome do Autor",
  authorPhoto: "https://url-da-foto.jpg",
  createdAt: "2026-01-06T10:30:00.000Z",
  updatedAt: "2026-01-06T10:30:00.000Z"
}
```

## Como Usar

1. Clique na aba **"Notas Time"** no menu de abas
2. Escolha uma coluna (Tráfego, Canais de Tração, Liderança, Outros)
3. Clique no botão **"+ Adicionar nota"**
4. Digite sua anotação no modal
5. (Opcional) Anexe imagens clicando no "+" ou colando com Ctrl+V
6. Clique em **"💾 Salvar"**

## Possíveis Melhorias Futuras

- [ ] Drag & drop para mover cards entre colunas
- [ ] Filtrar notas por data ou autor
- [ ] Mencionar outros membros do time (@nome)
- [ ] Notificações quando alguém adiciona uma nota
- [ ] Editar nomes das colunas
- [ ] Arquivar notas antigas
