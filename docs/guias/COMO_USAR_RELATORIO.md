# IMPORTANTE: Como Gerar e Acessar o Link do Relatório

## 🔴 PROBLEMA COMUM

Você está tentando acessar `relatorio.html` diretamente pela URL sem o token de compartilhamento:
```
❌ https://seu-dominio.com/relatorio.html?mes=2025-10&tenant=CLIENTE
```

Isso **NÃO FUNCIONA** em produção porque:
1. Não tem token `?share=...`
2. Requer autenticação Google
3. O Firebase Auth pode ter problemas com domínios personalizados

## ✅ SOLUÇÃO CORRETA

### Passo 1: No Painel Principal (index.html)

1. Acesse seu painel: `https://seu-dominio.com/?client=SEU_CLIENTE`
2. Vá até a seção "📊 Relatório do mês"
3. Selecione o mês desejado no calendário
4. Clique no botão **"🔗 Copiar link"**

Isso gera um link como:
```
✅ https://seu-dominio.com/relatorio.html?share=abc123xyz&tenant=CLIENTE&mes=2025-10
```

### Passo 2: Use o Link Gerado

O link gerado tem um **token de compartilhamento** (`?share=abc123xyz`) que:
- ✅ Funciona SEM login
- ✅ Funciona em QUALQUER navegador
- ✅ Pode ser compartilhado com clientes
- ✅ Carrega os dados do Firestore via `reportShares`

## 🔍 Como Verificar se Está Funcionando

Abra o DevTools (F12) → Console e procure por:

### ✅ Link CORRETO (com token):
```
[Relatorio] Modo público - carregando via shareToken: abc123xyz
[Relatorio] Token encontrado, carregando payload...
[Relatorio] Payload carregado: {hasStories: 5, hasPosts: 12, totalPosts: 17}
[Relatorio] renderStoriesAndPosts chamado - total posts: 17
[Relatorio] Stories encontrados: 5
[Relatorio] Posts de feed encontrados: 12
```

### ❌ Link INCORRETO (sem token):
```
[Relatorio] Modo autenticado - aguardando login...
[Relatorio] Usuário não autenticado, mostrando tela de login
[Relatorio] IMPORTANTE: Para acesso público use o botão "Copiar link"...
```

## 📋 Comparação

| Método | URL | Requer Login? | Funciona em Produção? |
|--------|-----|---------------|----------------------|
| ❌ Acesso Direto | `relatorio.html?mes=2025-10&tenant=X` | ✅ Sim | ❌ Não (problemas de auth) |
| ✅ Link Gerado | `relatorio.html?share=TOKEN&mes=2025-10` | ❌ Não | ✅ Sim (dados via token) |

## 🐛 Troubleshooting

### Problema: "Link inválido ou expirado"

**Causa**: O token não existe no Firestore `reportShares`

**Solução**:
1. Gere um novo link pelo botão "Copiar link"
2. Verifique se você está logado quando gerou o link
3. Confira se o Firebase está configurado corretamente

### Problema: Stories e Posts não aparecem

**Causa possível 1**: Você está usando link sem token

**Solução**: Gere o link correto pelo botão "Copiar link"

**Causa possível 2**: O tenant/mês está errado

**Solução**: 
1. Abra o console (F12)
2. Procure por: `[Relatorio] Posts após filtro: 0`
3. Veja os logs de posts filtrados para identificar o problema
4. Verifique se os posts têm o campo `tenant` correto

### Problema: Erro CORS nas imagens

**Solução**: Já corrigido nas últimas atualizações
- URLs são automaticamente convertidas para HTTPS
- `crossOrigin` removido
- Headers CORS configurados no `netlify.toml`

## 🎯 Fluxo Completo Recomendado

1. **Admin acessa**: `https://seu-dominio.com/?client=CLIENTE_X`
2. **Admin faz login** com Google
3. **Admin navega** até "Relatório do mês"
4. **Admin seleciona** o mês (ex: Outubro 2025)
5. **Admin clica** no botão "🔗 Copiar link"
6. **Link é copiado** para clipboard: `relatorio.html?share=abc123&tenant=CLIENTE_X&mes=2025-10`
7. **Admin compartilha** link com cliente
8. **Cliente acessa** SEM precisar de login
9. **Relatório carrega** com stories e posts do mês

## 📝 Notas Técnicas

### Como Funciona o Token

Quando você clica em "Copiar link", o código:

1. Chama `createOrUpdateReportShare(mesISO)`
2. Coleta todos os dados do mês (posts, metas, objetivos, notas)
3. Gera um token aleatório
4. Salva no Firestore: `reportShares/{token}`
5. Retorna URL com token

Quando alguém acessa o link com token:

1. `relatorio.html` detecta `?share=TOKEN`
2. Busca no Firestore: `reportShares/TOKEN`
3. Carrega o `payload` salvo
4. Renderiza stories, posts, metas, etc.

### Por Que Não Funciona Sem Token

Sem token, o código tenta:
1. Autenticar com Firebase Auth
2. Carregar posts direto de `usuarios/{uid}/posts`
3. Filtrar por `tenant` e `mes`

Isso falha em produção porque:
- Firebase Auth pode ter problemas com domínios personalizados
- Usuário não está logado
- Regras de segurança do Firestore bloqueiam acesso anônimo

---

**Resumo**: SEMPRE use o botão "Copiar link" para gerar o link do relatório!
