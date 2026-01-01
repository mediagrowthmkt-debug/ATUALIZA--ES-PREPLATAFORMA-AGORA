# 📧 Templates do EmailJS - Notificações Automáticas

## ✅ O que foi implementado:

Sistema automático que:
- ✅ Verifica a cada 15 minutos se há notificações para enviar
- ✅ Coleta métricas do dashboard (leads, investimento, CAC, CPL, redes sociais)
- ✅ Busca análises da IA
- ✅ Envia emails personalizados com dados reais

## 🎨 Templates para Criar no EmailJS

Você precisa criar 3 templates novos no EmailJS Dashboard:

---

### 1️⃣ Template Diário (Daily)

**Acesse:** https://dashboard.emailjs.com/admin/templates
**Clique em:** "Create New Template"

**Template ID:** `template_daily`
**Template Name:** "Relatório Diário"

**To Email:** 
```
{{to_email}}
```

**Subject:**
```
📊 Relatório Diário - {{client_name}} - {{date}}
```

**Content (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 650px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { background: #ffffff; padding: 30px; }
    .notifications-section { margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background: #f9f9f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">📊 Relatório Diário</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">{{client_name}}</p>
      <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.8;">{{date}} às {{time}}</p>
    </div>
    
    <div class="content">
      <h2 style="margin-top: 0; color: #667eea;">� Notificações do Sistema</h2>
      <p style="color: #666; font-size: 14px;">Total de notificações: <strong>{{notifications_count}}</strong></p>
      
      <div class="notifications-section">
        {{{notifications_html}}}
      </div>
    </div>
    
    <div class="footer">
      <p>📧 Notificação automática do MediaGrowth Dashboard</p>
      <p>Para alterar a frequência ou cancelar, acesse: Configurações > Notificações</p>
    </div>
  </div>
</body>
</html>
```

⚠️ **IMPORTANTE:** Use `{{{notifications_html}}}` com **3 chaves** para que o EmailJS não escape o HTML!

---

### 2️⃣ Template Semanal (Weekly)

**Template ID:** `template_weekly`
**Template Name:** "Relatório Semanal"

**To Email:** 
```
{{to_email}}
```

**Subject:**
```
📈 Relatório Semanal - {{client_name}} - {{date}}
```

**Content (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 650px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
    .content { background: #ffffff; padding: 30px; }
    .notifications-section { margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background: #f9f9f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">📈 Relatório Semanal</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">{{client_name}}</p>
      <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.8;">{{date}} às {{time}}</p>
    </div>
    
    <div class="content">
      <h2 style="margin-top: 0; color: #10b981;">🔔 Notificações do Sistema</h2>
      <p style="color: #666; font-size: 14px;">Total de notificações: <strong>{{notifications_count}}</strong></p>
      
      <div class="notifications-section">
        {{{notifications_html}}}
      </div>
    </div>
    
    <div class="footer">
      <p>📧 Notificação automática do MediaGrowth Dashboard</p>
      <p>Para alterar a frequência ou cancelar, acesse: Configurações > Notificações</p>
    </div>
  </div>
</body>
</html>
```

---

### 3️⃣ Template Mensal (Monthly)

**Template ID:** `template_monthly`
**Template Name:** "Relatório Mensal"

**To Email:** 
```
{{to_email}}
```

**Subject:**
```
🎯 Relatório Mensal - {{client_name}} - {{date}}
```

**Content (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 650px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; }
    .content { background: #ffffff; padding: 30px; }
    .notifications-section { margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background: #f9f9f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">🎯 Relatório Mensal</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">{{client_name}}</p>
      <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.8;">{{date}} às {{time}}</p>
    </div>
    
    <div class="content">
      <h2 style="margin-top: 0; color: #f59e0b;">🔔 Notificações do Sistema</h2>
      <p style="color: #666; font-size: 14px;">Total de notificações: <strong>{{notifications_count}}</strong></p>
      
      <div class="notifications-section">
        {{{notifications_html}}}
      </div>
    </div>
    
    <div class="footer">
      <p>📧 Notificação automática do MediaGrowth Dashboard</p>
      <p>Para alterar a frequência ou cancelar, acesse: Configurações > Notificações</p>
    </div>
  </div>
</body>
</html>
```

---

## 📝 Variáveis Disponíveis em Todos os Templates

O sistema envia automaticamente estas variáveis:

### Informações Básicas
- `{{to_email}}` - Email do destinatário
- `{{client_name}}` - Nome do cliente
- `{{subject}}` - Assunto do email
- `{{frequency}}` - Frequência (daily/weekly/monthly)
- `{{date}}` - Data atual (formato BR)
- `{{time}}` - Hora atual (formato BR)

### Notificações (PRINCIPAL)
- `{{{notifications_html}}}` - **HTML completo com todas as notificações** (use 3 chaves!)
- `{{notifications_count}}` - Número total de notificações

### O que está incluído nas notificações:
- ⏰ Demandas atrasadas ou próximas do prazo
- 🎯 Metas em risco no mês atual
- 🗓️ Status dos posts do mês
- 📝 Meta de posts pendente
- 🔗 Novos links cadastrados
- 🌐 Novas redes sociais conectadas
- 📚 Novas referências adicionadas
- 🏁 Novos concorrentes registrados
- 🔐 Novos acessos cadastrados
- 🗂️ Novos arquivos enviados
- 🎯 Novos leads do dia

---

## ⏰ Como Funciona o Envio Automático

1. **Verificação Automática**: Sistema verifica a cada 15 minutos
2. **Coleta de Dados**: Busca métricas do Firebase em tempo real
3. **Análise de Horário**: Compara hora atual com horário configurado
4. **Envio**: Se for o horário, envia para todos os emails cadastrados

### Exemplo:
Se você configurou:
- Frequência: **Diário**
- Horário: **09:00**
- Emails: **cliente@email.com, gestor@email.com**

O sistema vai:
- Às 09:00 todo dia
- Coletar métricas atualizadas
- Enviar email com template_daily para ambos os emails

---

## 🧪 Como Testar

### Teste Manual (Já Funciona)
1. Configure um email no dashboard
2. Clique em "Enviar Email de Teste"
3. Verifica se chegou ✅

### Teste Automático (Após criar templates)
1. Configure frequência "Diária"
2. Configure horário: próxima hora cheia (ex: 15:00)
3. Aguarde o horário
4. Verifique console do navegador (F12) para ver logs
5. Verifique caixa de entrada

---

## 🔧 Próximos Passos

1. **Criar os 3 templates no EmailJS** (Daily, Weekly, Monthly)
2. **Deixar o dashboard aberto** quando for testar (precisa estar logado)
3. **Verificar console** para ver logs de envio
4. **Ajustar horários** para testes rápidos

---

## ⚠️ Limitações Atuais

- ✅ **Funciona**: Quando o dashboard está aberto
- ❌ **Não funciona**: Quando o dashboard está fechado

### Por quê?
O código roda no **frontend** (navegador). Para funcionar 24/7, precisa:
- Cloud Functions (backend)
- Firebase Cloud Scheduler
- Ou usar Zapier/Make.com como webhook

### Solução Futura (Se Necessário)
Posso implementar:
1. Cloud Functions que roda no servidor
2. Firebase Scheduler que dispara todos os dias
3. Funciona mesmo com dashboard fechado

---

**Dúvidas?** Crie os templates e teste! Qualquer erro, me avise! 🚀
