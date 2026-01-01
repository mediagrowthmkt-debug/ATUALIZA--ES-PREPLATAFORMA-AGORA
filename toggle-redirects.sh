#!/bin/bash

# Script para alternar entre modo desenvolvimento e produção
# Uso: ./toggle-redirects.sh [enable|disable]

REDIRECTS_FILE="_redirects"
DISABLED_FILE="_redirects.disabled"

if [ "$1" = "enable" ]; then
    if [ -f "$DISABLED_FILE" ]; then
        mv "$DISABLED_FILE" "$REDIRECTS_FILE"
        echo "✅ Redirects HABILITADOS (modo produção)"
        echo "   Use este modo ao fazer deploy"
    else
        echo "⚠️  Arquivo $DISABLED_FILE não encontrado"
        echo "   Redirects já podem estar habilitados"
    fi
elif [ "$1" = "disable" ]; then
    if [ -f "$REDIRECTS_FILE" ]; then
        mv "$REDIRECTS_FILE" "$DISABLED_FILE"
        echo "✅ Redirects DESABILITADOS (modo desenvolvimento)"
        echo "   Agora você pode usar extensões como Visual CSS Editor"
    else
        echo "⚠️  Arquivo $REDIRECTS_FILE não encontrado"
        echo "   Redirects já podem estar desabilitados"
    fi
else
    echo "📝 Uso: ./toggle-redirects.sh [enable|disable]"
    echo ""
    echo "Comandos:"
    echo "  enable  - Habilita redirects (modo produção/deploy)"
    echo "  disable - Desabilita redirects (modo desenvolvimento)"
    echo ""
    
    # Mostrar status atual
    if [ -f "$REDIRECTS_FILE" ]; then
        echo "Status atual: Redirects HABILITADOS ✅"
    elif [ -f "$DISABLED_FILE" ]; then
        echo "Status atual: Redirects DESABILITADOS ⚠️"
    else
        echo "Status atual: Nenhum arquivo de redirect encontrado"
    fi
fi
