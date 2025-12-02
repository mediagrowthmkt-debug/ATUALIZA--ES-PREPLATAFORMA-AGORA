# Sistema de Importação em Massa de Leads - Documentação

## 🎯 Visão Geral

Sistema completo para importar leads de outras plataformas através de arquivos CSV, permitindo adicionar múltiplos leads de uma só vez com validação e preview dos dados.

## ✨ Funcionalidades

### 1. Download de Template
- ✅ Botão para baixar template CSV pré-formatado
- ✅ Exemplo de dados preenchidos
- ✅ Colunas com nomes corretos
- ✅ Encoding UTF-8 com BOM para compatibilidade

### 2. Upload de Arquivo
- ✅ Drag & Drop de arquivos
- ✅ Clique para selecionar arquivo
- ✅ Suporte para CSV
- ✅ Validação de formato
- ✅ Parser CSV robusto (suporta vírgulas em valores)

### 3. Validação de Dados
- ✅ Verifica colunas obrigatórias
- ✅ Valida presença de nome e email
- ✅ Ignora linhas vazias ou mal formatadas
- ✅ Feedback detalhado de erros

### 4. Preview Interativo
- ✅ Tabela com preview dos primeiros 10 leads
- ✅ Contador total de leads válidos
- ✅ Visualização antes de importar
- ✅ Scroll para muitos dados

### 5. Importação em Lote
- ✅ Adiciona leads no Firestore
- ✅ Timestamps automáticos
- ✅ Feedback de progresso
- ✅ Relatório de sucesso/erros
- ✅ Toast de confirmação

## 📋 Estrutura do Template CSV

### Colunas Obrigatórias

```csv
name,email,phone,question,plataforma,source
João Silva,joao@email.com,(11) 99999-9999,Gostaria de saber mais sobre o produto,Google,Formulário Site
Maria Santos,maria@email.com,(21) 98888-8888,Quero agendar uma reunião,Meta,Instagram Ads
```

**Descrição das Colunas:**

| Coluna | Tipo | Obrigatório | Descrição | Exemplo |
|--------|------|-------------|-----------|---------|
| `name` | Texto | ✅ Sim | Nome completo do lead | João Silva |
| `email` | Email | ✅ Sim | E-mail válido | joao@email.com |
| `phone` | Texto | Não | Telefone com DDD | (11) 99999-9999 |
| `question` | Texto | Não | Pergunta ou interesse | Gostaria de saber mais |
| `plataforma` | Texto | Não | Origem da plataforma | Google, Meta, LinkedIn |
| `source` | Texto | Não | Fonte específica | Formulário, Anúncio, Evento |

## 🎨 Interface do Modal

```
┌────────────────────────────────────────────────────┐
│ 📤 Importar Leads em Massa              [Fechar]  │
├────────────────────────────────────────────────────┤
│ 📋 Instruções:                                     │
│ 1. Baixe o template CSV                           │
│ 2. Preencha com os dados dos seus leads          │
│ 3. Salve em formato CSV                           │
│ 4. Faça upload do arquivo                         │
│ 5. Revise os dados                                │
│ 6. Clique em Importar                             │
│                                                    │
│ ⚠️ Colunas Obrigatórias:                          │
│ • name - Nome completo                            │
│ • email - E-mail válido                           │
│ • phone - Telefone                                │
│ • question - Pergunta/interesse                   │
│ • plataforma - Google, Meta, etc.                 │
│ • source - Origem do lead                         │
│                                                    │
│ [📥 Baixar Template CSV]                          │
│                                                    │
│ ┌──────────────────────────────────────────────┐ │
│ │           📁                                  │ │
│ │  Arraste o arquivo CSV aqui                  │ │
│ │  ou clique para selecionar                   │ │
│ │  Formatos: CSV, Excel (.xlsx)                │ │
│ └──────────────────────────────────────────────┘ │
│                                                    │
│ ✅ Arquivo processado! 15 leads encontrados       │
│                                                    │
│ 📊 Preview dos Dados                              │
│ ┌──────────────────────────────────────────────┐ │
│ │ Nome  │ Email │ Telefone │ Plataforma │...   │ │
│ │ João  │ joao@ │ (11)9... │ Google     │...   │ │
│ │ Maria │ maria@│ (21)9... │ Meta       │...   │ │
│ └──────────────────────────────────────────────┘ │
│ 15 lead(s) prontos para importar                  │
├────────────────────────────────────────────────────┤
│                     [✅ Importar Leads] [Cancelar] │
└────────────────────────────────────────────────────┘
```

## 🔧 Implementação Técnica

### Arquivos Modificados

**CSS:**
- `.leads-import-actions` - Botões de importação
- `.leads-import-dropzone` - Área de drag & drop
- `.leads-import-status` - Mensagens de status
- `.leads-preview-table` - Tabela de preview
- Estados: `.success`, `.error`, `.warning`, `.dragover`

**HTML:**
- Botões "Importar Planilha" e "Baixar Template"
- Event listeners para upload

**JavaScript:**

#### `downloadLeadsTemplate()`
Gera e baixa arquivo CSV template com:
- Headers corretos
- Linha de exemplo preenchida
- Linhas vazias para preencher
- UTF-8 BOM para Excel

#### `openImportModal()`
Cria modal completo com:
- Instruções passo a passo
- Lista de colunas obrigatórias
- Drag & drop zone
- Preview interativo
- Validação em tempo real

#### `parseCSV(file)`
Parser robusto que:
- Separa por linha (suporta \r\n e \n)
- Divide por vírgulas (respeita aspas)
- Valida headers obrigatórios
- Filtra linhas vazias
- Remove duplicatas

#### `parseCSVLine(line)`
Parser de linha CSV que:
- Respeita aspas duplas
- Trata vírgulas dentro de valores
- Remove aspas externas
- Retorna array de valores

#### `displayPreview(data)`
Renderiza preview:
- Primeiros 10 registros
- Todas as colunas
- Indicador de mais dados
- Contador total

#### `executeImport(data)`
Processa importação:
- Valida autenticação
- Loop assíncrono
- Adiciona no Firestore
- Conta sucessos/erros
- Feedback final

## 📊 Fluxo de Dados

```
┌─────────────────┐
│ Usuário clica   │
│ "Importar"      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Modal abre com  │
│ instruções      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Baixa template  │
│ (opcional)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Preenche CSV    │
│ com dados       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Upload via      │
│ drag/drop/click │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ parseCSV()      │
│ - Valida colunas│
│ - Limpa dados   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Preview exibido │
│ para confirmação│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Usuário confirma│
│ "Importar"      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ executeImport() │
│ - Loop async    │
│ - addDoc()      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Feedback e      │
│ fechamento      │
└─────────────────┘
```

## 🚀 Como Usar

### Passo a Passo

1. **Acessar a Aba Leads**
   - Navegue até a aba "Leads" no dashboard

2. **Baixar Template**
   - Clique em "📥 Baixar Template"
   - Arquivo `template_leads.csv` será baixado

3. **Preencher Planilha**
   - Abra o CSV no Excel, Google Sheets ou editor de texto
   - Preencha os dados dos leads
   - **Importante:** Mantenha os nomes das colunas
   - Salve como CSV (separado por vírgulas)

4. **Importar Arquivo**
   - Clique em "📤 Importar Planilha"
   - Arraste o CSV ou clique para selecionar
   - Aguarde o processamento

5. **Revisar Preview**
   - Verifique os dados na tabela
   - Confirme quantidade de leads
   - Verifique se há erros

6. **Confirmar Importação**
   - Clique em "✅ Importar Leads"
   - Aguarde a conclusão
   - Veja mensagem de sucesso

## 📝 Exemplos de CSV

### Exemplo Mínimo (Válido)
```csv
name,email,phone,question,plataforma,source
João Silva,joao@email.com,,,Google,
```

### Exemplo Completo
```csv
name,email,phone,question,plataforma,source
João Silva,joao@email.com,(11) 99999-9999,Gostaria de saber mais sobre o produto,Google,Formulário Site
Maria Santos,maria@email.com,(21) 98888-8888,Quero agendar uma reunião,Meta,Instagram Ads
Pedro Oliveira,pedro@email.com,(31) 97777-7777,Preciso de orçamento,LinkedIn,InMail
Ana Costa,ana@email.com,(41) 96666-6666,Quando começa?,Google,Google Ads
```

### Exemplo com Vírgulas em Valores
```csv
name,email,phone,question,plataforma,source
"Silva, João",joao@email.com,(11) 99999-9999,"Olá, gostaria de informações",Google,Site
```

## 🔒 Segurança e Validação

### Validações Aplicadas

1. **Autenticação**
   - Verifica `auth.currentUser.uid`
   - Valida `clientKey` ativo

2. **Formato de Arquivo**
   - Aceita apenas `.csv`
   - Rejeita outros formatos

3. **Estrutura de Dados**
   - Valida headers obrigatórios
   - Verifica presença de name e email
   - Ignora linhas inválidas

4. **Dados do Lead**
   - Trim em todos os campos
   - Conversão para string
   - Timestamps automáticos

### Tratamento de Erros

```javascript
try {
  // Importar lead
  await addDoc(colRef, leadData);
  successCount++;
} catch(err) {
  // Log do erro, continua próximo
  console.error('Erro ao importar lead:', row, err);
  errorCount++;
}
```

## 📊 Relatórios de Status

### Mensagens de Sucesso
- ✅ "Arquivo processado com sucesso! X leads encontrados"
- ✅ "Importação concluída! X leads adicionados"

### Mensagens de Aviso
- ⚠️ "Importação concluída com avisos: X sucesso, Y erros"

### Mensagens de Erro
- ❌ "Arquivo vazio ou sem dados"
- ❌ "Colunas faltando: name, email..."
- ❌ "Nenhum lead válido encontrado"
- ❌ "Formato não suportado. Use CSV"
- ❌ "Erro ao processar arquivo: [detalhe]"

## 🎯 Casos de Uso

### 1. Importar Leads do Google Ads
```csv
name,email,phone,question,plataforma,source
João Silva,joao@email.com,(11) 99999-9999,Quero saber preços,Google,Google Ads - Campanha Verão
```

### 2. Importar Leads do Facebook/Instagram
```csv
name,email,phone,question,plataforma,source
Maria Santos,maria@email.com,(21) 98888-8888,Quando posso agendar?,Meta,Instagram Stories
```

### 3. Importar de Eventos/Feiras
```csv
name,email,phone,question,plataforma,source
Pedro Costa,pedro@email.com,(31) 97777-7777,Conheci no evento,Offline,Feira Tech 2025
```

### 4. Importar de Planilha Excel Existente
1. Abra planilha no Excel
2. Adicione/renomeie colunas para match
3. Salvar Como → CSV (separado por vírgulas)
4. Importar no sistema

## 🐛 Troubleshooting

### Problema: "Colunas faltando"
**Solução:** Baixe o template e copie os headers exatos

### Problema: "Nenhum lead válido"
**Solução:** Certifique-se que name e email estão preenchidos

### Problema: Excel não abre corretamente
**Solução:** UTF-8 BOM já aplicado. Se persistir, use Google Sheets

### Problema: Vírgulas quebrando dados
**Solução:** Use aspas duplas: `"Silva, João"`

### Problema: Acentos aparecem errados
**Solução:** Salve como CSV UTF-8 no Excel ou use Google Sheets

## 📱 Responsividade

### Desktop
- Modal centralizado 800px
- Preview com scroll
- Drag & drop funcional

### Mobile
- Modal full-width
- Botões empilhados
- Preview responsivo
- Scroll otimizado

## 🔄 Integração com Sistema Existente

### Firestore Structure
```
usuarios/{uid}/clients/{clientKey}/leads/{leadId}
  - name: string
  - email: string
  - phone: string
  - question: string
  - plataforma: string
  - source: string
  - createdAt: Timestamp
  - updatedAt: Timestamp
```

### Real-time Updates
- Importação dispara listeners
- Tabela atualiza automaticamente
- Sem reload necessário

## 🚀 Melhorias Futuras Sugeridas

- [ ] Suporte nativo para Excel (.xlsx)
- [ ] Import de múltiplos arquivos
- [ ] Agendamento de importação
- [ ] Mapeamento customizado de colunas
- [ ] Deduplicação automática por email
- [ ] Histórico de importações
- [ ] Rollback de importação
- [ ] Validação de email (formato)
- [ ] Validação de telefone (formato)
- [ ] Preview paginado (não apenas 10)
- [ ] Export de leads existentes
- [ ] Template em múltiplos idiomas

---

**Versão:** 1.0  
**Data:** 02/12/2025  
**Autor:** Bruno (via GitHub Copilot)  
**Compatibilidade:** Chrome, Firefox, Safari, Edge
