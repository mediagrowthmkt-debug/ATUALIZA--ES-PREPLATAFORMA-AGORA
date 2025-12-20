# 🚀 Como Executar o Projeto Localmente

## Opção 1: Script Automático (Recomendado)

Execute o script no terminal:

```bash
./start-local.sh
```

Ou se preferir:

```bash
bash start-local.sh
```

O servidor iniciará automaticamente e você verá:
- ✅ URL de acesso (ex: http://localhost:8000)
- 📂 Diretório do projeto
- 💡 Instruções para parar o servidor
- 🌐 **O navegador abrirá automaticamente** uma nova guia com o projeto

## Opção 2: Comando Direto Python

Se preferir executar manualmente:

```bash
python3 -m http.server 8000
```

Ou com Python 2:

```bash
python -m SimpleHTTPServer 8000
```

## Opção 3: Node.js (http-server)

Se você tem Node.js instalado:

```bash
npx http-server -p 8000 -c-1
```

## Opção 4: PHP

Se você tem PHP instalado:

```bash
php -S localhost:8000
```

## Acessando o Projeto

Após iniciar o servidor, abra no navegador:

- **URL Principal:** http://localhost:8000
- **Arquivo Index:** http://localhost:8000/index.html

## Testando Antes do Commit

### Checklist de Testes:

1. ✅ Abrir o dashboard
2. ✅ Fazer login (se necessário)
3. ✅ Testar navegação entre abas
4. ✅ Testar a nova seção "Estruturação"
5. ✅ Verificar checkboxes e progresso
6. ✅ Testar salvamento de anotações
7. ✅ Verificar console do navegador (F12) para erros
8. ✅ Testar responsividade (mobile/desktop)

### Para Parar o Servidor:

Pressione **CTRL + C** no terminal

## Dicas

- 🔥 O script usa **http-server (Node.js)** se disponível - sem problemas de cache!
- 🔥 Se usar Python, use **CTRL+SHIFT+R** (ou **CMD+SHIFT+R** no Mac) para forçar reload sem cache
- 🔄 Para ver alterações, recarregue a página (F5 ou CMD+R)
- 🐛 Use o Console do navegador (F12) para debug
- 📱 Teste em diferentes tamanhos de tela

## Solução para "Tela Branca" ou "No Response"

Se a página ficar em branco após recarregar:

### Solução 1: Recarregar sem Cache (RECOMENDADO)
- **Windows/Linux:** Pressione `CTRL + SHIFT + R`
- **Mac:** Pressione `CMD + SHIFT + R`
- Ou: Abra DevTools (F12) → Clique com botão direito no reload → "Empty Cache and Hard Reload"

### Solução 2: Usar http-server (Melhor opção)
```bash
npx http-server -p 8000 -c-1
```
O parâmetro `-c-1` desabilita totalmente o cache

### Solução 3: Limpar Cache do Navegador
1. Abra DevTools (F12)
2. Vá em "Network" ou "Rede"
3. Marque "Disable cache" ou "Desativar cache"
4. Mantenha DevTools aberto enquanto desenvolve

## Portas Alternativas

Se a porta 8000 estiver ocupada, tente:

```bash
python3 -m http.server 8001
python3 -m http.server 8080
python3 -m http.server 3000
```

## Firebase Local

⚠️ **Importante:** O Firebase continuará conectado ao ambiente de produção. Para testes completos:

1. Use dados de teste
2. Ou configure um projeto Firebase separado para desenvolvimento
3. Ou use o Firebase Emulator Suite

---

**Criado em:** 19 de dezembro de 2025
