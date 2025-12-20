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

# Inicia o servidor
echo "✅ Servidor iniciando na porta $PORT..."
echo "📂 Diretório: $(pwd)"
echo ""
echo "🌐 Acesse: http://localhost:$PORT"
echo "🌐 Ou: http://localhost:$PORT/index.html"
echo ""
echo "💡 Para parar o servidor, pressione CTRL+C"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Inicia o servidor HTTP simples do Python
$PYTHON_CMD -m http.server $PORT
