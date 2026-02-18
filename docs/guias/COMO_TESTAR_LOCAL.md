# 🚀 Como Executar o Projeto Localmente

## ⭐ Opção 1: Script Automático (RECOMENDADO - SEM PROBLEMAS DE CACHE)

Execute o script no terminal:

```bash
./start-local.sh
```

Ou se preferir:

```bash
bash start-local.sh
```

O script usa automaticamente o **servidor customizado Python** que:
- ✅ **ZERO problemas de cache** - Alterações aparecem instantaneamente!
- ✅ Abre o navegador automaticamente
- ✅ Recarregue normalmente com F5 ou CMD+R
- ✅ Não precisa de CTRL+SHIFT+R
- ✅ Funciona perfeitamente para desenvolvimento

## Opção 2: Servidor Customizado Direto

```bash
python3 server-dev.py
```

Este é o servidor customizado que resolve TODOS os problemas de cache!

## Opção 3: Comando Direto Python (pode ter cache)

Se preferir executar manualmente:

```bash
python3 -m http.server 8000
```

Ou com Python 2:

```bash
python -m SimpleHTTPServer 8000
```

## Opção 4: Node.js (http-server)

Se você tem Node.js instalado:

```bash
npx http-server -p 8000 -c-1
```

## Opção 5: PHP

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

- 🔥 **USE `./start-local.sh` - Sem problemas de cache!**
- 🔥 O servidor customizado (`server-dev.py`) resolve TODOS os problemas
- 🔄 Recarregue normalmente com F5 ou CMD+R - funciona perfeitamente!
- 🐛 Use o Console do navegador (F12) para debug
- 📱 Teste em diferentes tamanhos de tela

## ✅ Solução DEFINITIVA (Já implementada!)

O problema de cache está **100% resolvido** ao usar:

```bash
./start-local.sh
```

Ou diretamente:

```bash
python3 server-dev.py
```

**Por quê funciona?**
- O servidor customizado envia headers HTTP que desabilitam completamente o cache
- Você pode recarregar normalmente (F5 ou CMD+R)
- Não precisa mais usar CTRL+SHIFT+R
- Alterações aparecem instantaneamente

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
