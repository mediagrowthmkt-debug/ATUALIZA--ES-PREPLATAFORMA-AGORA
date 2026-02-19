#!/bin/bash

echo "🧹 Limpando cache DNS no macOS..."
echo ""
echo "Este script irá:"
echo "1. Limpar o cache DNS local"
echo "2. Reiniciar o serviço mDNSResponder"
echo "3. Testar o DNS atualizado"
echo ""
echo "⚠️  Você precisará digitar sua senha de administrador"
echo ""

# Limpar cache DNS
sudo dscacheutil -flushcache

# Reiniciar mDNSResponder
sudo killall -HUP mDNSResponder

echo ""
echo "✅ Cache DNS limpo com sucesso!"
echo ""
echo "🔍 Testando DNS atualizado..."
echo ""

# Aguardar um segundo
sleep 1

# Testar DNS
echo "Resultado do nslookup:"
nslookup dashboard.mediagrowth.com.br

echo ""
echo "✅ Pronto!"
echo ""
echo "🌐 Agora acesse: https://dashboard.mediagrowth.com.br"
