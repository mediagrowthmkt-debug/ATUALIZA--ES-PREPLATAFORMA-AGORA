# CHANGELOG - Fix Análises Subcoleção

## Data: 25/12/2024

## Problema
As análises geradas nos entregáveis não estavam sendo salvas no Firebase. O console mostrava erro:
```
FirebaseError: Document 'projects/mediagrowth-a5349/databases/(default)/documents/usuarios/xxx' 
cannot be written because its size (1,082,065 bytes) exceeds the maximum allowed size of 1,048,576 bytes.
```

**Causa**: O documento do usuário estava excedendo o limite de **1MB (1,048,576 bytes)** do Firestore porque:
- Todas as análises (HTML longo) eram salvas dentro do documento principal do usuário
- Com múltiplas análises detalhadas, o documento rapidamente ultrapassava 1MB

## Solução
Implementada a mesma solução utilizada para a estruturação: **mover análises para uma subcoleção**.

### Estrutura Anterior (ANTES)
```
/usuarios/{uid}
  ├── email
  ├── displayName
  ├── analises: {                    ❌ DENTRO DO DOCUMENTO
  │     diagnostico_estrategico: {...},
  │     site_seo: {...},
  │     redes_sociais: {...},
  │     ... (muitos dados HTML)
  │   }
  └── ... outros campos
```

### Nova Estrutura (DEPOIS)
```
/usuarios/{uid}
  ├── email
  ├── displayName
  ├── analisesUsesSubcollection: true  ✅ Flag indicando uso de subcoleção
  └── analises/                         ✅ SUBCOLEÇÃO SEPARADA
        ├── diagnostico_estrategico     (documento individual)
        ├── site_seo                    (documento individual)
        ├── redes_sociais               (documento individual)
        └── ... cada análise é um documento separado
```

## Alterações no Código

### 1. Nova variável de controle
```javascript
let analisesUsesSubcollection = false;
```

### 2. Função `salvarAnaliseFirebase()` modificada
- Agora salva em subcoleção: `usuarios/{uid}/analises/{entregavelId}`
- Marca flag `analisesUsesSubcollection: true` no documento principal
- Cada análise é um documento separado (~25KB em vez de 1MB total)

### 3. Função `carregarAnaliseFirebase()` modificada
- Agora é `async` (era síncrona)
- Primeiro verifica cache local (USER_DATA.analises)
- Se não encontrar e usuário usa subcoleção, busca da subcoleção
- Atualiza cache local após carregar

### 4. Nova função `carregarTodasAnalisesFirebase()`
- Carrega todas as análises da subcoleção de uma vez
- Chamada no login para pré-carregar dados
- Atualiza USER_DATA.analises com todas as análises

### 5. Carregamento no login
- Login normal: carrega análises se `USER_DATA.analisesUsesSubcollection`
- Acesso admin: carrega análises do cliente se flag estiver ativa

## Vantagens da Nova Estrutura

| Aspecto | Antes | Depois |
|---------|-------|--------|
| Limite | 1MB total para o usuário | Cada análise pode ter até 1MB |
| Escalabilidade | ~10-15 análises | Ilimitado |
| Performance | Carrega todas análises de uma vez | Carrega sob demanda |
| Manutenção | Difícil de deletar individual | Fácil deletar/atualizar |

## Compatibilidade
- ✅ Retrocompatível: se `analisesUsesSubcollection` não existir, funciona como antes
- ✅ Migração automática: ao salvar nova análise, migra para subcoleção
- ✅ Análises antigas no documento principal ainda são lidas

## Teste
1. Acesse um cliente que estava com erro
2. Gere uma nova análise em qualquer entregável
3. Observe no console: `✅ Análise "xxx" salva na subcoleção Firebase`
4. Recarregue a página (F5)
5. Abra o mesmo entregável
6. Observe: `✅ Análise "xxx" carregada da subcoleção Firebase`

## Arquivos Modificados
- `index.html` - Linhas ~36678-36870 (funções de análise)
- `index.html` - Linhas ~45607 e ~45807 (carregamento no login)
