# 📧 Como Usar: Notificações Automáticas por Email

## ✨ O que mudou?

**Agora as notificações funcionam mesmo com o app FECHADO!** 🎉

Você pode fechar a plataforma e os relatórios serão enviados automaticamente no horário configurado.

---

## 🚀 Como Configurar (Passo a Passo)

### 1️⃣ Abra as Configurações
- Clique no botão **⚙️ Configurações** (canto superior direito)
- Vá na aba **🔔 Notificações**

### 2️⃣ Configure os Emails
```
📧 Emails para notificação:
   email1@exemplo.com, email2@exemplo.com
```
> Separe vários emails com **vírgula**

### 3️⃣ Escolha a Frequência
- **Diário** (todos os dias)
- **Semanal** (toda segunda-feira)
- **Mensal** (todo dia 1)

### 4️⃣ Defina o Horário
```
⏰ Horário de envio: 09:00
```
> O relatório será enviado TODOS os dias nesse horário!

### 5️⃣ Clique em **💾 Salvar Configuração**

---

## ✅ Pronto! Agora o sistema funciona sozinho!

### O que acontece depois?

1. **No horário configurado** (ex: 09:00)
   - Sistema verifica se já enviou hoje
   - Coleta todas as notificações do widget
   - Envia email para todos os destinatários

2. **Você pode fechar o app**
   - O sistema continuará funcionando em background
   - Emails serão enviados automaticamente
   - Você receberá uma notificação no navegador quando enviar

3. **Proteção contra duplicação**
   - Nunca envia 2 vezes no mesmo dia
   - Mesmo se você abrir e fechar várias vezes
   - Sistema é inteligente! 🧠

---

## 🔔 Primeira Vez? Permita as Notificações!

Quando você salvar pela primeira vez, o navegador perguntará:

```
┌─────────────────────────────────────┐
│ 🔔 Permitir notificações?           │
│                                     │
│ [Bloquear]  [Permitir]             │
└─────────────────────────────────────┘
```

**👉 Clique em [Permitir]**

Isso permite que você veja quando os emails foram enviados!

---

## 🧪 Como Testar

### Teste Rápido (2 minutos)

1. Configure para **daqui a 2 minutos**
   - Exemplo: Se são 10:30, configure para 10:32

2. **Feche a plataforma completamente**
   - Feche a aba
   - Pode até minimizar o navegador

3. Aguarde 2 minutos

4. Verifique seu email 📬
   - Você receberá o relatório!

5. Abra a plataforma novamente
   - Veja no console: "✅ Email diário já foi enviado hoje"

---

## 📊 O que vem no Email?

O relatório inclui todas as notificações do widget:

- ⚠️ **Demandas atrasadas**
- 📅 **Prazos próximos** (7 dias, 5 dias, 2 dias, hoje)
- 🎯 **Novos leads do dia**
- 📈 **Metas próximas do vencimento**
- 📝 **Posts agendados**

---

## 🛠️ Solução de Problemas

### Não recebeu o email?

#### ✅ Verificação 1: Configuração Salva?
- Abra **Configurações** > **Notificações**
- Veja se aparece: "Notificações Configuradas ✅"

#### ✅ Verificação 2: Horário Passou?
- Se são 11:00 e configurou para 09:00
- Só enviará **amanhã** às 09:00
- Para testar hoje, configure para um horário **futuro**

#### ✅ Verificação 3: Navegador Aberto?
- O navegador precisa estar aberto (pode estar minimizado)
- Pode ter outras abas abertas
- Mas **precisa ter pelo menos uma aba** do navegador

#### ✅ Verificação 4: Verifique Spam
- Emails podem ir para **Spam/Lixo Eletrônico**
- Marque como "Não é spam"

#### ✅ Verificação 5: Console do Navegador
- Pressione **F12**
- Vá em **Console**
- Procure por mensagens:
  - `🚀 Horário atingido! Enviando email...`
  - `✅ Emails enviados com sucesso`

---

## 🎯 Casos de Uso

### Caso 1: Relatório Diário de Manhã
```
Frequência: Diário
Horário: 08:00
Emails: equipe@empresa.com, gerente@empresa.com
```
**Resultado**: Todo dia às 8h, equipe recebe relatório do dia

### Caso 2: Relatório Semanal para Cliente
```
Frequência: Semanal
Horário: 09:00
Emails: cliente@empresa.com
```
**Resultado**: Toda segunda às 9h, cliente recebe resumo da semana

### Caso 3: Relatório Mensal para Diretoria
```
Frequência: Mensal
Horário: 10:00
Emails: diretoria@empresa.com, ceo@empresa.com
```
**Resultado**: Todo dia 1 do mês às 10h, diretoria recebe relatório

---

## 🔐 Segurança

- ✅ Apenas você pode configurar notificações do seu cliente
- ✅ Emails são enviados via servidor seguro (Cloud Functions)
- ✅ Dados salvos localmente e no Firebase
- ✅ Sistema não compartilha dados entre clientes

---

## ❓ Perguntas Frequentes

### P: Posso ter horários diferentes para clientes diferentes?
**R:** Sim! Cada cliente tem sua configuração independente.

### P: Posso mudar o horário depois?
**R:** Sim! Basta ir em Configurações > Notificações e salvar novo horário.

### P: Funciona no celular?
**R:** Sim, mas o navegador precisa estar aberto (pode estar em background).

### P: Funciona se o computador estiver desligado?
**R:** Não. O navegador precisa estar rodando. Para isso, recomendamos deixar um computador sempre ligado ou migrar para solução em servidor.

### P: Posso desativar as notificações?
**R:** Sim! Clique em **🗑️ Limpar Configuração** na tela de notificações.

### P: Quantos emails posso adicionar?
**R:** Não há limite! Separe com vírgula: `email1@teste.com, email2@teste.com, email3@teste.com`

### P: O horário é no meu fuso horário?
**R:** Sim! O sistema usa o horário do seu navegador automaticamente.

---

## 🆘 Precisa de Ajuda?

Entre em contato com o suporte técnico:
- 📧 Email: suporte@mediagrowth.com
- 💬 Chat: [Link do chat]
- 📞 Telefone: [Número]

---

## 🎉 Aproveite!

Agora você pode **focar no que importa** enquanto o sistema cuida de enviar os relatórios automaticamente! 🚀

**Configurou uma vez? Esquece! O sistema faz o resto!** ✨
