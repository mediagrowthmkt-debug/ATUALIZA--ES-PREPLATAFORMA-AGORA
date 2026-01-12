#!/bin/bash

# Script para fazer deploy das regras do Firestore
# Este script deve ser executado após as alterações nas regras

echo "🚀 Fazendo deploy das regras do Firestore..."

# Verificar se firebase-tools está instalado
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI não está instalado!"
    echo "📦 Instalando firebase-tools..."
    npm install -g firebase-tools
fi

# Fazer login (se necessário)
echo "🔐 Verificando autenticação..."
firebase login

# Fazer deploy das regras
echo "📤 Fazendo deploy das regras..."
firebase deploy --only firestore:rules

echo "✅ Deploy concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Verifique se o deploy foi bem-sucedido no console do Firebase"
echo "2. Teste o salvamento de demandas na plataforma"
echo "3. Verifique os logs no console do navegador"
