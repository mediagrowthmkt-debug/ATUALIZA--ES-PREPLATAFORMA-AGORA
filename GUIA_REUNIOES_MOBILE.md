# 📱 Guia Rápido - Reuniões Mobile

## Como Usar a Aba Reuniões no Mobile

### 🔹 Acessar o Chat com IA

1. **Abrir o Menu Lateral**
   - Toque no botão **☰** (canto superior esquerdo)
   - A sidebar desliza da esquerda
   - Veja todo o histórico de conversas

2. **Nova Conversa**
   - Toque em **+ Nova conversa**
   - Digite sua pergunta
   - Toque em **➤** para enviar

3. **Fechar Menu**
   - Toque na área escura (overlay)
   - OU toque novamente no botão **☰**

### 🔹 Ver Resumos de Reuniões

1. **Lista de Reuniões**
   - Role pela lista de cards
   - Cada card mostra data, título e resumo curto

2. **Abrir Resumo Completo**
   - Toque em qualquer card
   - Veja o resumo gerado pela IA
   - Expanda "Ver Transcrição Completa" se necessário

3. **Copiar Resumo**
   - **📋 Copiar p/ WhatsApp** - copia formatado
   - **📄 Copiar Texto** - copia texto puro

### 🔹 Adicionar Nova Reunião

1. Toque em **+ Nova Reunião**
2. Preencha:
   - **Data** da reunião
   - **Título** (gerado automaticamente)
   - **Transcrição** (cole o texto completo)
3. Toque em **💾 Salvar e Gerar Resumo**
4. Aguarde a IA processar

### 🔹 Filtrar Chat por Reunião

1. Na área de chat, use o **🔍 Filtrar por reunião**
2. Selecione uma reunião específica
3. Suas perguntas vão focar naquela reunião
4. OU selecione "📂 Todas as reuniões" para contexto geral

---

## 💡 Dicas de Uso

### Perguntas Sugeridas

Toque nos botões de sugestão:
- 📋 Principais decisões
- ⏳ Tarefas pendentes
- 📌 Tópicos discutidos
- ⚠️ Problemas
- 👤 Responsáveis
- 📅 Prazos
- 🎯 Metas e Resultados
- ➡️ Próximos passos
- 📊 Resumo geral

### Touch Targets

Todos os botões têm tamanho mínimo de **36px × 36px** para facilitar o toque.

### Scroll

- **Histórico:** Scroll vertical suave
- **Mensagens:** Scroll automático para nova mensagem
- **Transcrição:** Scroll limitado (300px) para não sobrecarregar

---

## 📐 Otimizações Técnicas

### Larguras Suportadas

| Dispositivo | Largura | Chat Height |
|-------------|---------|-------------|
| iPhone SE | 375px | calc(100vh - 160px) |
| iPhone 12+ | 390px | calc(100vh - 160px) |
| Android Médio | 412px | calc(100vh - 160px) |
| iPad Mini | 768px | calc(100vh - 180px) |
| iPad | 810px | calc(100vh - 180px) |

### Sidebar

- **Desktop (>900px):** Sempre visível (280px)
- **Mobile (≤900px):** Drawer lateral (85% tela)

### Fontes

- **Desktop:** 0.95rem
- **Tablet:** 0.9rem
- **Mobile:** 0.85rem
- **Pequeno:** 0.8rem

---

## ⚡ Performance

- **Animações:** GPU-accelerated (transform)
- **Scroll:** Smooth scrolling nativo
- **Touch:** Debounced para evitar múltiplos cliques

---

## 🎨 Estilo Visual

### Cores

- **Sidebar Background:** `#1e1e2e`
- **Main Background:** `#0f172a`
- **Overlay:** `rgba(0,0,0,0.6)`
- **Accent:** `#6366f1` (indigo)

### Bordas

- **Desktop:** 16px border-radius
- **Mobile:** 12px border-radius
- **Botões:** 8px border-radius

### Sombras

- **Sidebar:** `2px 0 10px rgba(0,0,0,0.3)`
- **Cards hover:** `0 8px 24px rgba(0,0,0,0.3)`

---

## ✅ Checklist de Funcionalidades

### Chat IA
- [x] Abrir/fechar sidebar com botão menu
- [x] Histórico de conversas salvo
- [x] Nova conversa
- [x] Perguntas sugeridas
- [x] Filtro por reunião
- [x] Copiar respostas
- [x] Scroll automático

### Reuniões
- [x] Listar todas as reuniões
- [x] Ver resumo completo
- [x] Ver transcrição
- [x] Adicionar nova reunião
- [x] Editar reunião existente
- [x] Excluir reunião
- [x] Gerar resumo com IA
- [x] Regenerar resumo

### Mobile UX
- [x] Touch targets ≥36px
- [x] Sidebar drawer
- [x] Overlay para fechar
- [x] Transições suaves
- [x] Scroll otimizado
- [x] Fontes legíveis
- [x] Modais responsivos

---

## 🔍 Troubleshooting

### Sidebar não abre
- Verifique se está em tela ≤900px
- Certifique-se que JavaScript está habilitado
- Recarregue a página

### Texto muito pequeno
- Zoom do navegador em 100%
- Dispositivo em modo portrait
- Verifique configurações de acessibilidade do SO

### Chat lento
- Verifique conexão com internet
- Cache do navegador pode estar cheio
- Tente limpar cache e recarregar

---

**Última atualização:** 5 de fevereiro de 2026
