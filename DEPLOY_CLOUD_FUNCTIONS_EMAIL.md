# 🚀 Deploy Cloud Functions - Envio Automático de Emails

## ✅ O Que Foi Implementado

Sistema **BACKEND** completo que funciona 24/7 sem precisar do dashboard aberto!

### 3 Cloud Functions Agendadas:
1. **sendDailyNotifications** - Todos os dias às 09:00
2. **sendWeeklyNotifications** - Toda segunda-feira às 09:00
3. **sendMonthlyNotifications** - Todo dia 1 do mês às 09:00

## 📋 Pré-requisitos

### 1. SendGrid API Key
Você precisa criar uma conta no SendGrid:
1. Acesse: https://signup.sendgrid.com/
2. Crie uma conta gratuita (40.000 emails/mês grátis primeiros 30 dias, depois 100/dia)
3. Vá em Settings > API Keys
4. Crie uma nova API Key
5. Copie a chave (começa com `SG.`)

### 2. Firebase Blaze Plan
O envio agendado requer plano pago:
- Acesse: https://console.firebase.google.com/project/mediagrowth-a5349/usage
- Clique em "Upgrade" para Blaze Plan
- **Custo**: Pay-as-you-go (você só paga pelo que usar)
- **Estimativa**: ~$0.01/dia para este projeto

## 🔧 Configuração

### Passo 1: Configurar SendGrid API Key

No terminal, execute:

```bash
cd "/Users/bruno/Documents/DJSXVC/DASHBOARD MEDIAGROWHT/ATUALIZAÇÕES PREPLATAFORMA AGORA/functions"

firebase functions:config:set sendgrid.apikey="SUA_SENDGRID_API_KEY_AQUI"
```

**Importante**: Substitua `SUA_SENDGRID_API_KEY_AQUI` pela chave real!

### Passo 2: Compilar TypeScript

```bash
npm run build
```

### Passo 3: Deploy das Funções

```bash
cd ..
firebase deploy --only functions
```

## 📊 Como Funciona

### 1. Agendamento Automático
```
09:00 BRT todo dia → sendDailyNotifications
09:00 BRT toda segunda → sendWeeklyNotifications
09:00 BRT todo dia 1 → sendMonthlyNotifications
```

### 2. Busca Automática de Usuários
- Função busca TODOS os usuários no Firebase
- Para cada usuário, busca TODOS os clientes
- Verifica se cada cliente tem `emailNotifications.enabled = true`
- Verifica se a frequência bate (daily/weekly/monthly)

### 3. Coleta de Notificações
Para cada cliente, coleta:
- ⏰ Demandas atrasadas ou próximas do prazo
- 🎯 Metas em risco no mês atual
- 🎯 Novos leads do dia

### 4. Envio de Email
- Gera HTML igual ao template
- Envia via SendGrid para TODOS os emails configurados
- Cada usuário recebe seu próprio email personalizado

## 🎯 Estrutura dos Dados no Firebase

Para que o envio funcione, cada cliente precisa ter:

```javascript
usuarios/{userId}/clients/{clientKey}
{
  nomeCliente: "Ferny Boutique",
  emailNotifications: {
    enabled: true,
    frequency: "daily", // ou "weekly" ou "monthly"
    emails: ["cliente@email.com", "gestor@email.com"],
    time: "09:00" // opcional (por enquanto usa 09:00 fixo)
  }
}
```

## ✅ Vantagens desta Solução

| Aspecto | Solução Backend | Solução Frontend |
|---------|----------------|------------------|
| **Funciona** | ✅ 24/7 sempre | ❌ Só com dashboard aberto |
| **Confiável** | ✅ 100% | ❌ Depende do navegador |
| **Escalável** | ✅ Milhares de usuários | ❌ Um por vez |
| **Manutenção** | ✅ Fácil | ❌ Complexa |
| **Custo** | ~$0.01/dia | Grátis |

## 📝 Arquivos Criados/Modificados

### 1. `functions/src/sendEmailNotifications.ts` (NOVO)
- Funções de coleta de notificações
- Geração de HTML
- 3 Cloud Functions agendadas
- Lógica de envio via SendGrid

### 2. `functions/src/index.ts` (MODIFICADO)
- Adicionado `export * from './sendEmailNotifications'`

## 🧪 Como Testar

### Teste Imediato (sem esperar 09:00)

Você pode chamar as funções manualmente para testar:

```bash
# No Firebase Console
# https://console.firebase.google.com/project/mediagrowth-a5349/functions

# Ou via terminal:
firebase functions:shell

# Dentro do shell:
sendDailyNotifications()
```

### Teste com Horário Customizado

Se quiser testar agora, você pode:

1. Modificar temporariamente o schedule:
```typescript
// Trocar de:
.schedule('0 9 * * *')

// Para (testar daqui 2 minutos):
.schedule('*/2 * * * *')
```

2. Fazer deploy
3. Aguardar 2 minutos
4. Verificar logs: https://console.firebase.google.com/project/mediagrowth-a5349/functions/logs

## 📧 Configuração de Remetente

### Alterar Email "From"

Edite `sendEmailNotifications.ts`:

```typescript
const FROM_EMAIL = 'contato@mediagrowth.com.br'; // Seu email
const FROM_NAME = 'MediaGrowth - Notificações';
```

**Importante**: Você precisa verificar o domínio no SendGrid!

### Verificar Domínio no SendGrid

1. Acesse: https://app.sendgrid.com/settings/sender_auth
2. Clique em "Verify a Single Sender"
3. Adicione seu email
4. Verifique na caixa de entrada

## 🔍 Monitoramento

### Ver Logs em Tempo Real

```bash
firebase functions:log --only sendDailyNotifications
```

### Ver no Console
https://console.firebase.google.com/project/mediagrowth-a5349/functions/logs

### Métricas SendGrid
https://app.sendgrid.com/statistics

## ⚠️ Troubleshooting

### Erro: "SENDGRID_API_KEY não configurada"
```bash
firebase functions:config:set sendgrid.apikey="SUA_KEY"
firebase deploy --only functions
```

### Erro: "Billing account not configured"
- Atualize para Blaze Plan
- Adicione cartão de crédito

### Emails não chegam
- Verifique SendGrid Dashboard (quotas)
- Verifique SPAM
- Verifique sender verification

### Deploy falha com timeout
- Tente novamente: `firebase deploy --only functions`
- Ou deploy função específica: `firebase deploy --only functions:sendDailyNotifications`

## 💰 Custos Estimados

### Firebase Functions (Blaze Plan)
- **Invocações**: 2M grátis/mês
- **Compute Time**: 400K GB-segundos grátis/mês
- **Estimativa**: $0.00-$0.30/mês (muito baixo!)

### SendGrid
- **Plano Grátis**: 100 emails/dia
- **Plano Essentials**: $19.95/mês (50K emails)
- **Estimativa**: Grátis (menos de 100 emails/dia)

### Total: ~$0.30/mês 🎉

## 🚀 Comandos Rápidos

```bash
# 1. Configurar SendGrid
firebase functions:config:set sendgrid.apikey="SUA_KEY"

# 2. Compilar
cd functions && npm run build && cd ..

# 3. Deploy
firebase deploy --only functions

# 4. Ver logs
firebase functions:log

# 5. Testar manualmente
firebase functions:shell
```

## ✅ Checklist Final

- [ ] Conta SendGrid criada
- [ ] API Key copiada
- [ ] Firebase atualizado para Blaze Plan
- [ ] API Key configurada: `firebase functions:config:set`
- [ ] Código compilado: `npm run build`
- [ ] Deploy realizado: `firebase deploy --only functions`
- [ ] Logs verificados
- [ ] Email de teste enviado

## 📚 Próximos Passos

Depois do deploy bem-sucedido:

1. **Configurar usuários**: Cada cliente precisa ativar notificações no dashboard
2. **Personalizar horários**: Modificar schedules se necessário
3. **Adicionar mais notificações**: Expandir `collectClientNotifications()`
4. **Monitorar**: Verificar logs diariamente nos primeiros dias

---

**Dúvidas?** Verifique os logs ou me chame! 🚀
