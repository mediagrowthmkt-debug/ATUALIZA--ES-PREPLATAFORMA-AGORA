#!/bin/bash

echo "🚀 Iniciando servidor local do Dashboard MediaGrowth..."
echo ""

PORT=8000

if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Porta $PORT já está em uso. Tentando porta 8001..."
    PORT=8001
fi

URL="http://localhost:$PORT"

if command -v npx &> /dev/null; then
    echo "✅ Usando http-server (Node.js) - Cache desabilitado"
    echo "✅ Servidor na porta $PORT"
    echo "🌐 Acesse: $URL"
    echo ""
    echo "💡 Para parar: CTRL+C"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    (sleep 2 && open "$URL") &
    npx http-server -p $PORT -c-1 --cors
elif command -v python3 &> /dev/null; then
    echo "✅ Usando Python HTTP Server"
    echo "💡 Use CMD+SHIFT+R para recarregar sem cache"
    echo "✅ Servidor na porta $PORT"
    echo "🌐 Acesse: $URL"
    echo ""
    echo "💡 Para parar: CTRL+C"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    (sleep 2 && open "$URL") &
    python3 -m http.server $PORT
else
    echo "❌ Python ou Node.js não encontrado"
    exit 1
fi
