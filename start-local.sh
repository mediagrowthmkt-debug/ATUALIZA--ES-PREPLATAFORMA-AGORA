#!/bin/bash

# Script para iniciar o servidor local do projeto
# Uso: ./start-local.sh ou bash start-local.sh

echo "🚀 Iniciando servidor local do Dashboard MediaGrowth..."
echo ""

# Verifica se o Python 3 está instalado
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Python não encontrado. Por favor, instale o Python 3."
    exit 1
fi

# Porta padrão
PORT=8000

# Verifica se a porta está em uso
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Porta $PORT já está em uso. Tentando porta 8001..."
    PORT=8001
fi

# URL do projeto
URL="http://localhost:$PORT"

# Inicia o servidor
echo "✅ Servidor iniciando na porta $PORT..."
echo "📂 Diretório: $(pwd)"
echo ""
echo "🌐 Acesse: $URL"
echo "🌐 Ou: $URL/index.html"
echo ""
echo "💡 Para parar o servidor, pressione CTRL+C"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Função para abrir o navegador
open_browser() {
    sleep 2  # Aguarda 2 segundos para o servidor iniciar
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open "$URL"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v xdg-open &> /dev/null; then
            xdg-open "$URL"
        elif command -v gnome-open &> /dev/null; then
            gnome-open "$URL"
        fi
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        # Windows
        start "$URL"
    fi
}

# Abre o navegador em background
open_browser &

# Inicia o servidor HTTP simples do Python
$PYTHON_CMD -m http.server $PORT
