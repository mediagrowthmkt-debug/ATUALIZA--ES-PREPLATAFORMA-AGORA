# 📧 Como Configurar o EmailJS - Guia Completo

## ✅ Conta Criada
- **Username**: mediagrowth
- **Email**: mediagrowthmkt@gmail.com
- **Public Key**: WCx9UE2gI8EHSfAYE
- **Private Key**: gSzR8BVcYWgH66Wivu-JW

## 🚀 Próximos Passos (FAÇA AGORA)

### 1️⃣ Fazer Login no EmailJS
1. Acesse: https://dashboard.emailjs.com/sign-in
2. Faça login com: **mediagrowthmkt@gmail.com**

### 2️⃣ Criar um Email Service
1. No dashboard, clique em **"Email Services"** no menu lateral
2. Clique em **"Add New Service"**
3. Escolha **Gmail** (já que você está usando mediagrowthmkt@gmail.com)
4. Configure:
   - **Service ID**: Digite `service_mediagrowth` (exatamente assim)
   - **Service Name**: "MediaGrowth Notifications"
5. Clique em **"Connect Account"** e faça login com mediagrowthmkt@gmail.com
6. Clique em **"Create Service"**

### 3️⃣ Criar um Email Template
1. No dashboard, clique em **"Email Templates"** no menu lateral
2. Clique em **"Create New Template"**
3. Configure:
   - **Template ID**: Digite `template_test` (exatamente assim)
   - **Template Name**: "Test Email Template"
4. Edite o template com este conteúdo:

**Subject:**
```
✅ Email de Teste - MediaGrowth Dashboard
```

**Content (HTML):**
```html
<h2>🎉 Email de Teste</h2>

<p>Olá!</p>

<p>Este é um email de teste do sistema de notificações do <strong>MediaGrowth Dashboard</strong>.</p>

<div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
  <p><strong>Cliente:</strong> {{client_name}}</p>
  <p><strong>Data:</strong> {{test_date}}</p>
  <p><strong>Hora:</strong> {{test_time}}</p>
</div>

<p>{{test_message}}</p>

<hr style="margin: 30px 0;">

<p style="font-size: 12px; color: #666;">
  Se você recebeu este email, o sistema de notificações está funcionando corretamente! ✅
</p>
```

5. Clique em **"Save"**

### 4️⃣ Testar o Sistema
1. Abra o Dashboard MediaGrowth
2. Vá em **Configurações > Notificações por Email**
3. Adicione seu email de teste
4. Clique em **"Enviar Email de Teste"**
5. Verifique sua caixa de entrada! 📬

## 📝 Variáveis do Template

O código já está configurado para enviar estas variáveis:
- `{{to_email}}` - Email do destinatário
- `{{client_name}}` - Nome do cliente
- `{{test_message}}` - Mensagem de teste
- `{{test_date}}` - Data do teste
- `{{test_time}}` - Hora do teste

## 🔄 Para Criar Templates de Notificações Reais

Depois que o teste funcionar, você pode criar templates para:

### Template 1: Notificações Diárias
- **Template ID**: `template_daily`
- Subject: "📊 Relatório Diário - {{client_name}}"
- Variables: metricas do dia, comparações, insights

### Template 2: Notificações Semanais
- **Template ID**: `template_weekly`
- Subject: "📈 Relatório Semanal - {{client_name}}"
- Variables: resumo da semana, tendências, destaques

### Template 3: Notificações Mensais
- **Template ID**: `template_monthly`
- Subject: "🎯 Relatório Mensal - {{client_name}}"
- Variables: análise completa do mês, comparativo mensal

## 🎁 Limites do Plano Grátis

- **200 emails/mês** - grátis
- Sem necessidade de cartão de crédito
- Perfeito para começar!

## 🆘 Problemas Comuns

### Erro: "Service ID not found"
- Certifique-se que o Service ID é exatamente `service_mediagrowth`

### Erro: "Template ID not found"
- Certifique-se que o Template ID é exatamente `template_test`

### Email não chega
- Verifique a pasta de SPAM
- Confirme que conectou o Gmail corretamente no EmailJS
- Verifique o limite de 200 emails/mês

## ✅ Código Já Implementado

O código no `index.html` já está pronto e configurado com:
- ✅ SDK do EmailJS carregado
- ✅ Public Key configurada
- ✅ Função de envio implementada
- ✅ Tratamento de erros
- ✅ Logs detalhados no console

## 🚀 Próxima Etapa

Depois que o teste funcionar, vou implementar as funções de envio automático (diário, semanal, mensal) usando o mesmo sistema!

---

**Dúvidas?** Qualquer erro que aparecer, me mostre e eu te ajudo a resolver! 🚀
