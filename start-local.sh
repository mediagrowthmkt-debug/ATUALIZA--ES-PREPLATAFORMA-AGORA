#!/bin/bash

# Script para iniciar o servidor local do projeto
# Uso: ./start-local.sh ou bash start-local.sh

echo "🚀 Iniciando servidor local do Dashboard MediaGrowth..."
echo ""

# Porta padrão
PORT=8000

# Verifica se a porta está em uso
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Porta $PORT já está em uso. Tentando porta 8001..."
    PORT=8001
fi

# URL do projeto
URL="http://localhost:$PORT"

# Verifica se npx/Node.js está disponível (melhor opção - sem cache)
if command -v npx &> /dev/null; then
    echo "✅ Usando http-server (Node.js) - Melhor para desenvolvimento"
    echo "✅ Servidor iniciando na porta $PORT..."
    echo "📂 Diretório: $(pwd)"
    echo ""
    echo "🌐 Acesse: $URL"
    echo "🌐 Ou: $URL/index.html"
    echo ""
    echo "💡 Para parar o servidor, pressione CTRL+C"
    echo "💡 Cache desabilitado - alterações aparecem imediatamente"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Aguarda 2 segundos e abre o navegador
    (sleep 2 && open "$URL") &
    
    # Inicia http-server sem cache
    npx http-server -p $PORT -c-1 --cors
    
# Se não tiver npx, usa Python
elif command -v python3 &> /dev/null; then
    echo "✅ Usando Python HTTP Server"
    echo "⚠️  Para melhor experiência, instale Node.js: https://nodejs.org"
    echo "✅ Servidor iniciando na porta $PORT..."
    echo "📂 Diretório: $(pwd)"
    echo ""
    echo "🌐 Acesse: $URL"
    echo "🌐 Ou: $URL/index.html"
    echo ""
    echo "💡 Para parar o servidor, pressione CTRL+C"
    echo "💡 Use CTRL+SHIFT+R (ou CMD+SHIFT+R) para forçar reload sem cache"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Aguarda 2 segundos e abre o navegador
    (sleep 2 && open "$URL") &
    
    # Inicia servidor Python
    python3 -m http.server $PORT
    
elif command -v python &> /dev/null; then
    echo "✅ Usando Python HTTP Server (Python 2)"
    echo "⚠️  Para melhor experiência, instale Node.js: https://nodejs.org"
    echo "✅ Servidor iniciando na porta $PORT..."
    echo "📂 Diretório: $(pwd)"
    echo ""
    echo "🌐 Acesse: $URL"
    echo "🌐 Ou: $URL/index.html"
    echo ""
    echo "💡 Para parar o servidor, pressione CTRL+C"
    echo "💡 Use CTRL+SHIFT+R (ou CMD+SHIFT+R) para forçar reload sem cache"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Aguarda 2 segundos e abre o navegador
    (sleep 2 && open "$URL") &
    
    # Inicia servidor Python 2
    python -m SimpleHTTPServer $PORT
    
else
    echo "❌ Nenhum servidor encontrado!"
    echo "Instale Python 3: https://www.python.org/downloads/"
    echo "Ou Node.js: https://nodejs.org"
    exit 1
fi
