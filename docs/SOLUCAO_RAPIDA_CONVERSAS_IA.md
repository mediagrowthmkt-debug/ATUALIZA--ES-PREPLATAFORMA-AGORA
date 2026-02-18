# 🚨 SOLUÇÃO RÁPIDA: Conversas I.A. Não Salvam

## 🔴 Problema Identificado

```
❌ writeUserDoc FirebaseError: Document cannot be written because its size (1,049,672 bytes) exceeds the maximum allowed size of 1,048,576 bytes.
```

**SEU DOCUMENTO FIREBASE ULTRAPASSOU 1MB!**

## ✅ Solução IMEDIATA

### **Execute AGORA no console do navegador (F12):**

```javascript
await reduzirDocumentoUsuario()
```

Depois:

```javascript
location.reload()
```

## 📊 O que está acontecendo:

- ✅ Conversas I.A.: apenas **29.69 KB**
- ❌ Resto do documento (análises, metas, etc): **> 1MB**
- 🚨 Firebase rejeita qualquer save quando documento > 1MB

## 🔍 Para diagnosticar:

```javascript
diagnosticarConversasIA()
```

Vai mostrar:
- Tamanho de cada conversa
- Tamanho total
- Se há problema

## 📝 O que a função `reduzirDocumentoUsuario()` faz:

1. ✅ Limpa conversas I.A. antigas (mantém 5 mais recentes)
2. ✅ Remove mensagens em loading travadas
3. ✅ Arquiva conversas antigas na subcoleção
4. ✅ Libera espaço no documento principal
5. ✅ Recarrega interface automaticamente

## ⏱️ Tempo estimado: 5 segundos

## ⚠️ Importante:

**NÃO feche a página até ver:**

```
✅ Documento reduzido com sucesso!
```

---

## 🎯 Prevenção:

Execute periodicamente:

```javascript
diagnosticarConversasIA()
```

Se ver tamanho > 800KB, execute `reduzirDocumentoUsuario()` preventivamente.
