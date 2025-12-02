# 📋 Como Importar Leads - Guia Rápido

## ✅ O que mudou agora

O sistema está **ULTRA FLEXÍVEL** e aceita QUALQUER formato de planilha!

### 🎯 Formatos Aceitos

✅ **Excel copiado e colado** (separado por TAB)
✅ **CSV com vírgulas** (padrão)
✅ **CSV com ponto-e-vírgula** (Excel Brasil)
✅ **Campos vazios permitidos** - nenhum campo é obrigatório
✅ **Linhas diferentes** - cada linha pode ter dados diferentes

## 🚀 Como Usar

### Opção 1: Copiar do Excel/Planilha

1. Abra sua planilha no Excel ou Google Sheets
2. Selecione TUDO (incluindo o cabeçalho)
3. Copie (Ctrl+C ou Cmd+C)
4. Cole em um editor de texto (Bloco de Notas, TextEdit, VSCode)
5. Salve como `.csv`
6. Faça upload no sistema

**Exemplo do que você copiou:**
```
name	email	phone	question	plataforma	source
Ciasat		5516982050444	acima_de_r$50.000	ig	Formulário meta
Bancobrii Assessoria	Banco de	5516996331355	entre_r$5.001_e_r$50.000	fb	Formulário meta
```

### Opção 2: Baixar Template e Preencher

1. Clique em "📥 Baixar Template CSV"
2. Abra o arquivo no Excel
3. Preencha apenas os campos que você tem
4. Salve e faça upload

## 📝 Nomes das Colunas (Cabeçalho)

Use estes nomes exatos na primeira linha:

```csv
name,email,phone,question,plataforma,source
```

### 🔤 O que cada coluna significa:

- **name** = Nome do lead
- **email** = E-mail (pode ficar vazio)
- **phone** = Telefone
- **question** = Pergunta/Resposta do formulário
- **plataforma** = De onde veio (ig, fb, etc)
- **source** = Fonte (ex: "Formulário meta")

## ✅ Exemplos que FUNCIONAM

### Exemplo 1: Dados completos
```csv
name,email,phone,question,plataforma,source
João Silva,joao@email.com,11999999999,Orçamento,ig,Facebook Ads
```

### Exemplo 2: Campos vazios (OK!)
```csv
name,email,phone,question,plataforma,source
Maria,,11988888888,Informações,fb,
Pedro,pedro@email.com,,,ig,Instagram
```

### Exemplo 3: Só nome e telefone (OK!)
```csv
name,email,phone,question,plataforma,source
Empresa ABC,,11977777777,,,
```

### Exemplo 4: Do Excel (TAB separado) ✨
```
name	email	phone	question	plataforma	source
Ciasat		5516982050444	acima_de_r$50.000	ig	Formulário meta
```

## ⚠️ Importante

1. **Primeira linha SEMPRE deve ter os nomes das colunas**
2. **Pode deixar campos vazios** - não tem problema!
3. **O sistema detecta automaticamente** se é TAB, vírgula ou ponto-e-vírgula
4. **Linhas completamente vazias** serão ignoradas

## 🎨 Como Salvar do Excel

### No Windows:
1. Arquivo → Salvar Como
2. Escolha "CSV (separado por vírgulas) (*.csv)"
3. Salve

### No Mac:
1. Arquivo → Exportar → CSV
2. Salve

### No Google Sheets:
1. Arquivo → Fazer download → CSV
2. Salve

## 🐛 Problemas Comuns

### "Arquivo vazio ou sem dados"
- Certifique-se que tem pelo menos 2 linhas (cabeçalho + 1 dado)

### "Não foi possível identificar as colunas"
- Verifique se a primeira linha tem os nomes: name,email,phone,question,plataforma,source

### Números de telefone ficam estranhos
- No Excel, formate a coluna como TEXTO antes de colar os números
- Ou adicione um apóstrofo antes: '5511999999999

## 💡 Dicas

✅ **Não precisa preencher tudo** - deixe vazio o que não tiver
✅ **Telefones com DDD** - pode colocar com ou sem espaços
✅ **Nomes compostos** - funcionam normalmente
✅ **Acentos** - sem problema, o sistema aceita

## 🎯 Resultado

Depois de importar:
- ✅ Leads aparecem na lista automaticamente
- ✅ Campos vazios ficam como "-" na tabela
- ✅ Você vê quantos foram importados
- ✅ Linhas vazias são ignoradas (você verá a contagem)
