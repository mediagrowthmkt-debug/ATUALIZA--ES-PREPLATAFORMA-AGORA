# 🔍 Troubleshooting - Importação CSV de Leads

## ❌ Problemas Comuns e Soluções

### 1. "Arquivo não está sendo aceito"

**Sintomas:**
- O arquivo não é carregado quando você clica ou arrasta
- Nenhuma mensagem aparece

**Causas Possíveis:**
- ❌ Arquivo não é .CSV
- ❌ Extensão está oculta (arquivo.csv.xlsx)
- ❌ Arquivo salvo com separador incorreto (ponto e vírgula em vez de vírgula)

**Soluções:**
```
✅ Verifique a extensão:
   - Windows: Ative "Exibir extensões de arquivo"
   - Mac: Cmd+I no arquivo e veja "Tipo"

✅ Salve corretamente:
   - Excel: "Salvar Como" → CSV UTF-8 (separado por vírgulas)
   - Google Sheets: Arquivo → Fazer download → .CSV
   - LibreOffice: Salvar Como → Texto CSV → UTF-8
```

---

### 2. "Colunas ausentes ou não reconhecidas"

**Sintomas:**
- Erro: "Faltam as colunas obrigatórias: name, email..."
- Preview não aparece

**Causas Possíveis:**
- ❌ Nomes das colunas estão errados
- ❌ Cabeçalho tem espaços extras
- ❌ Arquivo não tem cabeçalho

**Solução:**
```
✅ O cabeçalho DEVE ser EXATAMENTE:
   name,email,phone,question,plataforma,source

✅ NÃO pode ter:
   - Acentos: Nome, E-mail, etc.
   - Espaços: name , email
   - Maiúsculas: Name, EMAIL
   - Caracteres especiais: "name", 'email'

✅ Baixe o template e use como base!
```

---

### 3. "Dados não aparecem no preview"

**Sintomas:**
- Arquivo aceito mas preview vazio
- Contador mostra "0 leads"

**Causas Possíveis:**
- ❌ Arquivo só tem cabeçalho, sem dados
- ❌ Linhas vazias entre os dados
- ❌ Encoding errado (caracteres estranhos)

**Soluções:**
```
✅ Estrutura mínima:
   name,email,phone,question,plataforma,source
   João Silva,joao@email.com,11999999999,Interesse em produto,Google,Formulário

✅ Verifique encoding:
   - Deve ser UTF-8
   - No Excel: "CSV UTF-8"
   - No Notepad++: Encoding → UTF-8
```

---

### 4. "Alguns leads não são importados"

**Sintomas:**
- Preview mostra X leads
- Apenas Y leads são importados
- Alguns leads ficam com dados estranhos

**Causas Possíveis:**
- ❌ E-mail inválido
- ❌ Vírgulas dentro dos campos sem aspas
- ❌ Quebra de linha dentro de campo

**Soluções:**
```
✅ E-mails devem ser válidos:
   ✅ joao@email.com
   ❌ joao.com
   ❌ @email.com

✅ Campos com vírgula DEVEM usar aspas:
   ✅ "Silva, João","joao@email.com"
   ❌ Silva, João,joao@email.com

✅ Quebras de linha devem ser removidas:
   ❌ "Texto com
      quebra de linha"
   ✅ "Texto em uma linha"
```

---

## 🔧 Depuração Avançada

### Verificar Logs do Console

1. **Abra o Console do Navegador:**
   - Chrome/Edge: F12 → Aba "Console"
   - Firefox: F12 → Aba "Console"
   - Safari: Cmd+Alt+I → "Console"

2. **Procure por mensagens `[Import]` ou `[CSV Import]`:**
```
[Import] 📁 Arquivo selecionado: { nome: "leads.csv", ... }
[Import] ✅ Formato válido (CSV), iniciando processamento...
[CSV Import] Arquivo lido, tamanho: 1234 caracteres
[CSV Import] Total de linhas: 15
[CSV Import] Header: name,email,phone,question,plataforma,source
[CSV Import] Colunas encontradas: ['name', 'email', 'phone', ...]
[CSV Import] ✅ Leads válidos: 14
```

3. **Erros Comuns:**
```
❌ [Import] ❌ Formato inválido: arquivo.xlsx
   → Solução: Salve como .CSV

❌ [CSV Import] ❌ Colunas faltando: name, email
   → Solução: Corrija o cabeçalho

❌ [CSV Import] ⚠️ Lead inválido (falta email): Linha 5
   → Solução: Preencha o e-mail na linha 5
```

---

## 📋 Checklist Antes de Importar

Use esta checklist para evitar problemas:

```
□ Arquivo é .CSV (não .XLSX, .XLS, .TXT)
□ Salvou com UTF-8 encoding
□ Separador é vírgula (,) não ponto e vírgula (;)
□ Cabeçalho é: name,email,phone,question,plataforma,source
□ Todos os e-mails são válidos (têm @ e domínio)
□ Campos com vírgula estão entre "aspas"
□ Não há linhas vazias no meio dos dados
□ Arquivo tem pelo menos 1 linha de dados (além do cabeçalho)
```

---

## 🎯 Exemplo Perfeito

**Estrutura ideal de arquivo CSV:**

```csv
name,email,phone,question,plataforma,source
João Silva,joao@email.com,11999999999,Interesse em produto A,Google Ads,Formulário Site
Maria Santos,maria@empresa.com,21988888888,Cotação de serviço,Meta Ads,Lead Form Facebook
"Silva, Pedro",pedro@corp.com,11977777777,Dúvida sobre preço,LinkedIn,InMail
Ana Costa,ana@startup.com,85966666666,"Precisa de orçamento urgente, prazo curto",Google Organic,Chat Website
```

**Explicação:**
- ✅ Linha 1: Cabeçalho exato
- ✅ Linhas 2-5: Dados válidos
- ✅ Linha 3: Nome com vírgula entre aspas
- ✅ Linha 5: Texto longo com vírgula entre aspas
- ✅ Todos os e-mails válidos
- ✅ Sem linhas vazias

---

## 🆘 Ainda com Problemas?

### Teste com Arquivo Mínimo

Crie este arquivo no Bloco de Notas/TextEdit:

```
name,email,phone,question,plataforma,source
Teste Lead,teste@email.com,11999999999,Teste importação,Google,Manual
```

Salve como `teste.csv` com encoding UTF-8 e tente importar.

**Se funcionar:** O problema está no seu arquivo original
**Se não funcionar:** Há um problema técnico - verifique o console

---

## 📞 Contato

Se após seguir todos os passos o problema persistir:

1. ✅ Abra o console do navegador (F12)
2. ✅ Tente importar novamente
3. ✅ Copie TODAS as mensagens de erro
4. ✅ Tire print da tela
5. ✅ Envie junto com o arquivo CSV problemático

---

**Última atualização:** Janeiro 2025
