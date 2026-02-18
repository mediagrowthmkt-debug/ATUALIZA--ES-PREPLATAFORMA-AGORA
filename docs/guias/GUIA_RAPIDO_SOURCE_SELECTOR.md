# Guia Rápido: Seletor de Fontes - Aba I.A

## 🎯 O QUE É?

Ferramenta que permite escolher **ONDE** a IA deve buscar informações ao responder suas perguntas na plataforma.

---

## 🚀 COMO USAR

### Passo 1: Localizar o Seletor
Na aba I.A, no composer (área de digitar mensagem), você verá:

```
Tamanho: [📝 Pequena] [📄 Média] [📚 Longa]
Buscar em: [Todas as Abas (14) ▾]
```

### Passo 2: Abrir o Menu
Clique no botão **"Todas as Abas (14) ▾"**

### Passo 3: Selecionar Fontes
Escolha as abas que a IA deve consultar:
- ✅ Marque as abas desejadas
- ⬜ Desmarque as que NÃO quer incluir

### Passo 4: Aplicar
Clique no botão **"Aplicar"** (azul)

### Passo 5: Fazer Pergunta
Digite sua pergunta normalmente. A IA buscará APENAS nas abas selecionadas!

---

## 📋 ABAS DISPONÍVEIS

| Ícone | Aba | O que contém |
|-------|-----|--------------|
| 🏗️ | **Estruturação** | Info do negócio, 4 semanas de planejamento, blocos estratégicos |
| 🎯 | **Metas** | Objetivos mensais, planejado vs realizado |
| 💰 | **CAC** | Investimentos, vendas, faturamento, custo de aquisição |
| 🔎 | **Macro** | Análises mensais, resumos, pontos positivos/negativos |
| 📋 | **Planejamento** | Planejamento estratégico geral |
| 📅 | **Calendário** | Observações por data |
| 📸 | **Posts** | Calendário de publicações, legendas, status |
| 📋 | **Demandas** | Tarefas e projetos |
| 📝 | **Anotações** | Anotações gerais da plataforma |
| 🔑 | **Acessos** | Credenciais e ferramentas |
| 📁 | **Arquivos** | Estrutura de arquivos organizados |
| 👥 | **Leads** | Dados de leads *(em desenvolvimento)* |
| 📊 | **Relatório** | Relatórios gerados *(em desenvolvimento)* |

---

## 💡 EXEMPLOS PRÁTICOS

### Exemplo 1: Buscar Apenas Estratégia
**Objetivo:** Revisar estruturação sem ver dados financeiros

**Passos:**
1. Abrir seletor
2. Desmarcar "Todas as Abas"
3. Marcar apenas: 🏗️ Estruturação, 📋 Planejamento
4. Aplicar
5. Perguntar: *"Me dê um resumo da nossa estratégia de marketing"*

**Resultado:** IA responde usando apenas Estruturação e Planejamento

---

### Exemplo 2: Foco em Números e Resultados
**Objetivo:** Analisar performance sem ver conteúdo

**Passos:**
1. Abrir seletor
2. Desmarcar "Todas as Abas"
3. Marcar apenas: 🎯 Metas, 💰 CAC, 🔎 Macro
4. Aplicar
5. Perguntar: *"Como está nosso desempenho este mês?"*

**Resultado:** IA analisa apenas dados numéricos e financeiros

---

### Exemplo 3: Revisar Conteúdo Criado
**Objetivo:** Ver apenas posts e publicações

**Passos:**
1. Abrir seletor
2. Desmarcar "Todas as Abas"
3. Marcar apenas: 📸 Posts, 📅 Calendário
4. Aplicar
5. Perguntar: *"Quantos posts publicamos essa semana?"*

**Resultado:** IA busca apenas no calendário e posts

---

## ⚡ ATALHOS

### Marcar Todas
Clique no botão **"Marcar Todas"** para selecionar todas as 14 abas de uma vez.

### Limpar
Clique no botão **"Limpar"** para desmarcar todas as abas.

### Checkbox "Todas as Abas"
- ✅ **Marcado:** Seleciona todas automaticamente
- ⬜ **Desmarcado:** Permite seleção individual
- ◼️ **Indeterminado:** Algumas (mas não todas) estão marcadas

---

## 🎨 ENTENDENDO O BOTÃO

O texto do botão muda conforme sua seleção:

| Seleção | Botão mostra |
|---------|--------------|
| Todas marcadas | "Todas as Abas (14)" |
| 1 aba marcada | Nome da aba (ex: "🏗️ Estruturação") |
| 2-3 abas marcadas | Nomes separados (ex: "Estruturação, Metas") |
| 4+ abas marcadas | Contagem (ex: "5 Abas Selecionadas") |
| Nenhuma marcada | Volta para "Todas as Abas (14)" |

---

## ⚠️ COMPORTAMENTOS IMPORTANTES

### 1. Busca Focada
Quando você seleciona fontes específicas, a IA recebe uma instrução:
> "O usuário selecionou apenas [fontes]. Use APENAS esses dados."

### 2. Dados Não Encontrados
Se você pergunta sobre algo que NÃO está nas fontes selecionadas, a IA informa:
> "Não encontrei essa informação nas fontes selecionadas (Estruturação, Metas). 
> Sugiro incluir a aba CAC para ver investimentos."

### 3. Cache Inteligente
Ao mudar a seleção e clicar "Aplicar", o sistema:
- Invalida o cache antigo
- Prepara novo contexto focado
- Garante que próxima resposta use fontes corretas

---

## 🔄 FLUXO RECOMENDADO

### Para Perguntas Gerais:
```
Mantenha: "Todas as Abas (14)"
```
A IA buscará em todos os lugares e trará o contexto completo.

### Para Análises Específicas:
```
1. Identifique o tema (ex: estratégia, números, conteúdo)
2. Selecione apenas abas relacionadas
3. Faça perguntas focadas nesse tema
4. Volte para "Todas" quando terminar
```

---

## 💰 ECONOMIA DE TOKENS

### Busca em "Todas as Abas"
- Contexto grande (~50-80KB)
- Mais tokens consumidos
- Mais custo de API

### Busca Focada (3-4 abas)
- Contexto pequeno (~15-30KB)
- Menos tokens consumidos
- Economia de ~40-60%

**Dica:** Para economizar, use busca focada sempre que possível!

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### Problema 1: IA não encontra dados que existem
**Solução:** Verificar se a aba correta está marcada. Ex: dados de CAC precisam da aba 💰 CAC marcada.

### Problema 2: Botão não atualiza após clicar "Aplicar"
**Solução:** Certifique-se de ter marcado pelo menos 1 aba. Se nenhuma estiver marcada, o sistema volta para "Todas".

### Problema 3: Menu dropdown não fecha
**Solução:** Clique em "Aplicar" ou clique fora do menu.

### Problema 4: IA responde "não encontrei"
**Solução:** 
1. Abrir seletor
2. Marcar aba onde o dado deveria estar
3. Aplicar
4. Tentar novamente

---

## 📊 QUANDO USAR CADA ABA

### 🏗️ Estruturação
**Use quando perguntar sobre:**
- Estratégia de marketing
- Público-alvo e persona
- Análise de mercado
- Posicionamento
- Jornada do cliente
- Matriz CDT

### 🎯 Metas
**Use quando perguntar sobre:**
- Objetivos mensais
- Resultados realizados
- Comparação meta vs realizado
- Performance de metas

### 💰 CAC
**Use quando perguntar sobre:**
- Investimentos em marketing
- Custos de aquisição
- Vendas e faturamento
- ROI e ROAS
- Despesas mensais

### 🔎 Macro
**Use quando perguntar sobre:**
- Análise mensal
- Histórico de desempenho
- Pontos positivos/negativos
- Aprendizados do mês

### 📸 Posts
**Use quando perguntar sobre:**
- Calendário de publicações
- Legendas de posts
- Status de posts (publicado, agendado)
- Quantidade de mídias

### 📝 Anotações
**Use quando perguntar sobre:**
- Ideias salvas
- Observações gerais
- Lembretes

---

## 🎓 DICAS PRO

### Dica 1: Combine Abas Estrategicamente
```
Estruturação + Metas + CAC = Visão completa do negócio
Posts + Calendário = Análise de conteúdo
Macro + Metas = Performance mensal
```

### Dica 2: Refine Progressivamente
```
1ª Pergunta: Use "Todas as Abas"
   → Entenda onde estão os dados
2ª Pergunta: Use abas específicas
   → Aprofunde no tema identificado
```

### Dica 3: Documente Suas Seleções
```
Anote quais combinações funcionam bem para seus casos de uso.
Exemplo: "Para análise de ROI, uso: CAC + Metas + Macro"
```

---

## 🔐 SEGURANÇA E PRIVACIDADE

- Senhas em "Acessos" são **mascaradas** (`***`)
- IA vê apenas metadados (login, URL, tag)
- Senha real nunca é enviada para a API

---

## ✅ CHECKLIST DE USO

Antes de fazer uma pergunta importante:

- [ ] Pensei em ONDE os dados que preciso estão?
- [ ] Selecionei as abas corretas?
- [ ] Cliquei em "Aplicar"?
- [ ] Texto do botão está atualizado?
- [ ] Minha pergunta é clara e específica?

---

## 📞 PERGUNTAS FREQUENTES

**P: Posso selecionar apenas 1 aba?**  
R: Sim! Você pode selecionar quantas quiser, inclusive apenas 1.

**P: Se eu não clicar "Aplicar", a seleção é salva?**  
R: Não. É necessário clicar em "Aplicar" para confirmar a seleção.

**P: A seleção fica salva entre sessões?**  
R: Atualmente não. Toda vez que abrir a plataforma, volta para "Todas as Abas".

**P: Posso usar busca focada para economizar tokens?**  
R: Sim! Busca focada reduz significativamente o contexto enviado à API.

**P: O que acontece se eu não marcar nenhuma aba?**  
R: O sistema automaticamente volta para "Todas as Abas" como fallback.

---

## 🎉 CONCLUSÃO

O Seletor de Fontes é uma ferramenta poderosa para:
- ✅ Tornar buscas mais rápidas e focadas
- ✅ Economizar tokens e custos de API
- ✅ Ter controle sobre o contexto da IA
- ✅ Evitar informações irrelevantes

**Use com sabedoria e otimize suas consultas!** 🚀

---

**Dúvidas?** Experimente diferentes combinações e descubra o que funciona melhor para você!
