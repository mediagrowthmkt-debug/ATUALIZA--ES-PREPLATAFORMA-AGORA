#!/bin/bash
# Script de Deploy e Configuração SendGrid
# MediaGrowth Platform - Cloud Functions

echo "🚀 MediaGrowth - Setup SendGrid Backend"
echo "========================================"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está na pasta correta
if [ ! -f "firebase.json" ]; then
  echo -e "${RED}❌ Erro: Execute este script na raiz do projeto (onde está o firebase.json)${NC}"
  exit 1
fi

echo "✅ Pasta correta detectada"
echo ""

# Função para verificar comando
check_command() {
  if command -v $1 &> /dev/null; then
    echo -e "${GREEN}✅ $1 instalado${NC}"
    return 0
  else
    echo -e "${RED}❌ $1 não encontrado${NC}"
    return 1
  fi
}

# Verificar dependências
echo "📋 Verificando dependências..."
check_command firebase || { echo "Instale: npm install -g firebase-tools"; exit 1; }
check_command node || { echo "Instale Node.js: https://nodejs.org"; exit 1; }
echo ""

# Menu principal
echo "Escolha uma opção:"
echo "1. Configurar API Key do SendGrid"
echo "2. Compilar e fazer Deploy"
echo "3. Ver logs das funções"
echo "4. Testar envio manual"
echo "5. Configurar agendamento (Cloud Scheduler)"
echo "6. Status das funções"
echo "0. Sair"
echo ""
read -p "Opção: " option

case $option in
  1)
    echo ""
    echo "🔑 Configuração da API Key SendGrid"
    echo "===================================="
    echo ""
    echo "1. Acesse: https://app.sendgrid.com/settings/api_keys"
    echo "2. Clique em 'Create API Key'"
    echo "3. Nome: MediaGrowth Cloud Functions"
    echo "4. Permissions: Full Access (ou Mail Send)"
    echo "5. Copie a chave (começa com SG.)"
    echo ""
    read -p "Cole sua API Key do SendGrid: " apikey
    
    if [[ $apikey == SG.* ]]; then
      echo ""
      echo "Configurando..."
      firebase functions:config:set sendgrid.apikey="$apikey"
      
      if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ API Key configurada com sucesso!${NC}"
        echo ""
        echo "Para aplicar, faça o deploy:"
        echo "  ./setup-sendgrid.sh"
        echo "  Opção 2 (Compilar e fazer Deploy)"
      else
        echo -e "${RED}❌ Erro ao configurar API Key${NC}"
      fi
    else
      echo -e "${RED}❌ API Key inválida (deve começar com 'SG.')${NC}"
    fi
    ;;
    
  2)
    echo ""
    echo "📦 Compilando e Fazendo Deploy"
    echo "==============================="
    echo ""
    
    # Compilar TypeScript
    echo "🔨 Compilando TypeScript..."
    cd functions
    npm run build
    
    if [ $? -ne 0 ]; then
      echo -e "${RED}❌ Erro na compilação${NC}"
      exit 1
    fi
    
    cd ..
    echo -e "${GREEN}✅ Compilação concluída${NC}"
    echo ""
    
    # Deploy
    echo "🚀 Fazendo deploy das Cloud Functions..."
    echo "(Isso pode levar 2-5 minutos)"
    echo ""
    firebase deploy --only functions
    
    if [ $? -eq 0 ]; then
      echo ""
      echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
      echo ""
      echo "📝 Funções deployadas:"
      echo "  - sendDailyNotifications"
      echo "  - sendWeeklyNotifications"
      echo "  - sendMonthlyNotifications"
      echo "  - sendTestEmail"
      echo ""
      echo "Próximo passo: Configurar agendamento (Opção 5)"
    else
      echo -e "${RED}❌ Erro no deploy${NC}"
      echo "Ver logs: firebase functions:log"
    fi
    ;;
    
  3)
    echo ""
    echo "📊 Logs das Cloud Functions"
    echo "==========================="
    echo ""
    echo "Qual função deseja ver?"
    echo "1. sendDailyNotifications"
    echo "2. sendWeeklyNotifications"
    echo "3. sendMonthlyNotifications"
    echo "4. Todas"
    echo ""
    read -p "Opção: " log_option
    
    case $log_option in
      1) firebase functions:log --only sendDailyNotifications --limit 30 ;;
      2) firebase functions:log --only sendWeeklyNotifications --limit 30 ;;
      3) firebase functions:log --only sendMonthlyNotifications --limit 30 ;;
      4) firebase functions:log --limit 50 ;;
      *) echo "Opção inválida" ;;
    esac
    ;;
    
  4)
    echo ""
    echo "🧪 Teste Manual de Envio"
    echo "========================"
    echo ""
    
    PROJECT_ID=$(grep -o '"projectId": "[^"]*' firebase.json | cut -d'"' -f4)
    if [ -z "$PROJECT_ID" ]; then
      PROJECT_ID="mediagrowth-a5349"
    fi
    
    echo "Qual frequência testar?"
    echo "1. Diário (daily)"
    echo "2. Semanal (weekly)"
    echo "3. Mensal (monthly)"
    echo ""
    read -p "Opção: " test_option
    
    case $test_option in
      1) FUNC="sendDailyNotifications" ;;
      2) FUNC="sendWeeklyNotifications" ;;
      3) FUNC="sendMonthlyNotifications" ;;
      *) echo "Opção inválida"; exit 1 ;;
    esac
    
    URL="https://us-central1-${PROJECT_ID}.cloudfunctions.net/${FUNC}"
    echo ""
    echo "Chamando: $URL"
    echo ""
    
    curl -w "\n" $URL
    
    echo ""
    echo "Ver logs detalhados: firebase functions:log --only $FUNC"
    ;;
    
  5)
    echo ""
    echo "⏰ Configurar Agendamento (Cloud Scheduler)"
    echo "==========================================="
    echo ""
    
    PROJECT_ID=$(grep -o '"projectId": "[^"]*' firebase.json | cut -d'"' -f4)
    if [ -z "$PROJECT_ID" ]; then
      PROJECT_ID="mediagrowth-a5349"
    fi
    
    echo "⚠️  Requisitos:"
    echo "  - Firebase Blaze Plan ativo"
    echo "  - Cloud Scheduler API habilitada"
    echo ""
    echo "Habilitar API: https://console.cloud.google.com/cloudscheduler?project=${PROJECT_ID}"
    echo ""
    read -p "API habilitada? (s/n): " api_enabled
    
    if [[ $api_enabled != "s" && $api_enabled != "S" ]]; then
      echo "Habilite a API primeiro e execute novamente"
      exit 0
    fi
    
    echo ""
    echo "Criando jobs..."
    echo ""
    
    # Job Diário (9h BRT = 12h UTC)
    echo "📅 Job Diário (todo dia às 9h)..."
    gcloud scheduler jobs create http daily-email-job \
      --schedule="0 12 * * *" \
      --uri="https://us-central1-${PROJECT_ID}.cloudfunctions.net/sendDailyNotifications" \
      --http-method=GET \
      --time-zone="America/Sao_Paulo" \
      --project=${PROJECT_ID} 2>&1
    
    # Job Semanal (Segunda 9h)
    echo "📅 Job Semanal (segunda-feira às 9h)..."
    gcloud scheduler jobs create http weekly-email-job \
      --schedule="0 12 * * 1" \
      --uri="https://us-central1-${PROJECT_ID}.cloudfunctions.net/sendWeeklyNotifications" \
      --http-method=GET \
      --time-zone="America/Sao_Paulo" \
      --project=${PROJECT_ID} 2>&1
    
    # Job Mensal (Dia 1 às 9h)
    echo "📅 Job Mensal (dia 1 às 9h)..."
    gcloud scheduler jobs create http monthly-email-job \
      --schedule="0 12 1 * *" \
      --uri="https://us-central1-${PROJECT_ID}.cloudfunctions.net/sendMonthlyNotifications" \
      --http-method=GET \
      --time-zone="America/Sao_Paulo" \
      --project=${PROJECT_ID} 2>&1
    
    echo ""
    echo -e "${GREEN}✅ Jobs criados!${NC}"
    echo ""
    echo "Ver jobs: https://console.cloud.google.com/cloudscheduler?project=${PROJECT_ID}"
    echo "Testar agora: Clique em 'Run Now' no console"
    ;;
    
  6)
    echo ""
    echo "📊 Status das Cloud Functions"
    echo "============================="
    echo ""
    
    firebase functions:list
    
    echo ""
    echo "Ver configurações:"
    firebase functions:config:get
    ;;
    
  0)
    echo "Saindo..."
    exit 0
    ;;
    
  *)
    echo -e "${RED}❌ Opção inválida${NC}"
    exit 1
    ;;
esac

echo ""
echo "✅ Operação concluída!"
echo ""
