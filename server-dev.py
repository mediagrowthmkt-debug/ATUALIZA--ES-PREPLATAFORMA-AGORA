#!/usr/bin/env python3
"""
Servidor HTTP local sem cache para desenvolvimento
Uso: python3 server-dev.py
"""

import http.server
import socketserver
import os
import sys
from datetime import datetime

PORT = 8000

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Handler HTTP que desabilita completamente o cache"""
    
    def end_headers(self):
        """Adiciona headers para desabilitar cache"""
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()
    
    def log_message(self, format, *args):
        """Log personalizado com timestamp"""
        timestamp = datetime.now().strftime('%H:%M:%S')
        print(f"[{timestamp}] {args[0]}")

def find_free_port(start_port):
    """Encontra uma porta livre começando da porta especificada"""
    port = start_port
    while port < start_port + 100:
        try:
            with socketserver.TCPServer(("", port), None) as s:
                return port
        except OSError:
            port += 1
    return None

def open_browser(url):
    """Abre o navegador automaticamente"""
    import webbrowser
    import threading
    import time
    
    def delayed_open():
        time.sleep(2)
        webbrowser.open(url)
    
    threading.Thread(target=delayed_open, daemon=True).start()

def main():
    global PORT
    
    # Encontra uma porta livre
    PORT = find_free_port(PORT)
    if PORT is None:
        print("❌ Não foi possível encontrar uma porta disponível")
        sys.exit(1)
    
    # Configuração do servidor
    Handler = NoCacheHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        
        print("=" * 60)
        print("🚀 Servidor de Desenvolvimento MediaGrowth")
        print("=" * 60)
        print(f"✅ Servidor rodando na porta {PORT}")
        print(f"📂 Diretório: {os.getcwd()}")
        print(f"🌐 Acesse: {url}")
        print(f"🌐 Ou: {url}/index.html")
        print("")
        print("💡 CACHE DESABILITADO - Alterações aparecem imediatamente!")
        print("💡 Use F5 ou CMD+R para recarregar normalmente")
        print("💡 Para parar o servidor: CTRL+C")
        print("=" * 60)
        print("")
        
        # Abre o navegador
        open_browser(url)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n")
            print("⏹️  Servidor parado")
            print("👋 Até logo!")
            sys.exit(0)

if __name__ == "__main__":
    main()
