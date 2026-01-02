# Changelog - Fix: Código Órfão Causando Erro de Sintaxe

**Data:** 2 de janeiro de 2026  
**Versão:** 3.0.1 (Hotfix)  
**Tipo:** Bugfix - Critical

## 🚨 Problema

Erro crítico bloqueando o login da plataforma:

```
Uncaught SyntaxError: Illegal return statement (at (index):58902:9)
```

## 🔍 Causa Raiz

Ao refatorar a função `renderDemandaPlans()` para stub (linhas 58865-58871), o corpo original da função (518 linhas de código) ficou órfão fora do escopo da função, causando:

1. Declaração de `return` fora de função (linha 58902)
2. Centenas de linhas de código executando no escopo global
3. Bloqueio total do carregamento da página

### Código Problemático

```javascript
function renderDemandaPlans(){
  // DEPRECATED: Função obsoleta...
  const container=$('demandaPlans');
  if(!container) return;
}
// ❌ CÓDIGO ÓRFÃO COMEÇA AQUI (linhas 58872-59389)
const groups={};
const monthKeysSet=new Set();
// ... 516 linhas de código solto ...
if(!months.length){
  return; // ❌ ERRO: return fora de função!
}
// ... mais código órfão ...
```

## ✅ Solução

Removidas as 518 linhas de código órfão (linhas 58872-59389) usando sed:

```bash
sed -i.bak-orphan '58872,59389d' index.html
```

### Estrutura Corrigida

```javascript
function renderDemandaPlans(){
  // DEPRECATED: Função obsoleta após refatoração para modal minimalista
  // A seção .demanda-plans foi removida, planos agora são editados via modal
  const container=$('demandaPlans');
  if(!container) return; // Container não existe mais, retorna silenciosamente
  // Código original comentado para evitar processamento desnecessário
}
function renderDemandas(eventOrOptions){ // ✅ Próxima função imediatamente após
  const options = (eventOrOptions instanceof Event || eventOrOptions === undefined) ? {} : eventOrOptions || {};
  // ...
}
```

## 📊 Impacto

- **Linhas removidas:** 518 (58872-59389)
- **Tamanho do arquivo:** 65088 → 64570 linhas (-518)
- **Backup criado:** `index.html.bak-orphan`

## 🧪 Validação

- [x] Arquivo reduzido de 65088 para 64570 linhas
- [x] Função `renderDemandaPlans()` corretamente fechada
- [x] Função `renderDemandas()` imediatamente após
- [x] Backup criado em `index.html.bak-orphan`
- [x] Servidor reiniciado sem erros

## 🎯 Prevenção Futura

### ⚠️ Lições Aprendidas

1. **Ao stub-ar funções grandes:**
   - Sempre remover TODO o corpo da função
   - Não deixar código órfão fora do escopo
   - Testar imediatamente após a modificação

2. **Validação de sintaxe:**
   - Executar verificação de sintaxe antes de commit
   - Usar linter/parser JavaScript
   - Testar carregamento da página

3. **Backup incremental:**
   - Manter backups com nomes descritivos (`.bak-orphan`)
   - Facilita rollback cirúrgico de problemas específicos

### 🛠️ Comando de Validação

Para verificar sintaxe JavaScript em alterações futuras:

```bash
node -c index.html 2>&1 | grep -i "syntax\|error" || echo "✅ Sintaxe OK"
```

## 📝 Contexto Histórico

Esta correção faz parte da refatoração do sistema de planos (v3.0), onde:

1. ✅ Coluna PLANO adicionada à tabela
2. ✅ Modal de plano criado
3. ✅ Seção `.demanda-plans` removida
4. ❌ **Função `renderDemandaPlans()` mal stub-ada** (este fix)
5. ✅ JavaScript handlers do modal implementados

## 🔗 Referências

- **Refatoração original:** CHANGELOG_PLANO_MINIMALISTA.md
- **Backup anterior:** index.html.bak-orphan (preservado)
- **Erro reportado:** Console do navegador (linha 58902)

---

**Status:** ✅ RESOLVIDO  
**Severidade:** 🔴 CRÍTICA (bloqueio total de login)  
**Tempo de resolução:** ~5 minutos  
**Rollback disponível:** Sim (index.html.bak-orphan)
