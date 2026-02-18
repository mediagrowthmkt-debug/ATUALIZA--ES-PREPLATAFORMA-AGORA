# 🔍 Guia de Debug - Fotos de Perfil no Admin

## ❌ Problema
As fotos de perfil não aparecem no painel admin (admin-selector.html)

## 🔧 Ferramentas de Debug

### 1. **Test Photo Location** (RECOMENDADO)
Arquivo: `test-photo-location.html`

**Como usar:**
1. Abra `test-photo-location.html` no navegador
2. Faça login com Google (será automático)
3. Digite o **UID** do usuário (não o email!)
4. Digite o **Email** do usuário
5. Clique em "Buscar Foto"

**O que vai mostrar:**
- ✅ Estrutura completa do documento `/usuarios/{uid}`
- ✅ Estrutura de `/usuarios/{uid}/clients/{clientKey}`
- ✅ Lista TODAS as subcoleções em `clients/*`
- ✅ Preview da foto se encontrada
- ✅ Indica exatamente qual campo tem a foto

### 2. **Console Logs no Admin Selector**
Arquivo: `admin-selector.html` (já adicionado)

**Como ver:**
1. Abra `admin-selector.html`
2. Abra o Console (F12 → Console)
3. Observe os logs:
   - `🏢 Empresa adicionada:` - Dados iniciais da empresa
   - `📸 Dados do usuário:` - Dados do documento `/usuarios/{uid}`
   - `✅ Foto encontrada em profileLogoUrl:` - Sucesso!
   - `📸 Dados do cliente em subcoleção:` - Dados em `/usuarios/{uid}/clients/{clientKey}`
   - `❌ Nenhuma foto encontrada para:` - Não tem foto
   - `🎨 Renderizando empresa:` - Mostra o que será renderizado no HTML

## 📋 Checklist de Verificação

### Passo 1: Descubra o UID Real
```
O UID NÃO É O EMAIL!
É um código como: "abc123xyz456..."
```

**Como descobrir:**
1. Vá para o Firebase Console
2. Authentication → Users
3. Copie o **User UID** da conta brunogestormktp@gmail.com

### Passo 2: Verifique no Firestore
```
Firebase Console → Firestore Database
```

**Estruturas possíveis:**

**Opção A:** `/usuarios/{uid}` (documento raiz)
```javascript
{
  email: "brunogestormktp@gmail.com",
  displayName: "Nome da Empresa",
  profileLogoUrl: "https://storage.googleapis.com/...",  // ✅ Este é o campo!
  photoURL: "https://..."  // ❌ Alternativo (não recomendado)
}
```

**Opção B:** `/usuarios/{uid}/clients/{clientKey}`
```javascript
{
  profileLogoUrl: "https://storage.googleapis.com/...",  // ✅ Este é o campo!
  profileLogoStoragePath: "...",
  profileLogoUpdatedAt: Timestamp
}
```

### Passo 3: Use a Ferramenta de Debug
1. Abra `test-photo-location.html`
2. Cole o **UID real** (não o email!)
3. Digite o email: brunogestormktp@gmail.com
4. Veja exatamente onde está (ou não está) a foto

## 🎯 Possíveis Causas

### 1. UID Incorreto
❌ **Problema:** Empresa adicionada com UID errado no admin
✅ **Solução:** 
- Use `fix-admin-companies.html` para remover
- Re-adicione pelo email no admin-selector

### 2. Campo Errado no Firestore
❌ **Problema:** Foto salva em campo diferente de `profileLogoUrl`
✅ **Solução:**
- Verifique com `test-photo-location.html`
- Atualize a foto no dashboard principal
- O dashboard salva automaticamente em `profileLogoUrl`

### 3. Foto Não Existe
❌ **Problema:** Conta não tem foto de perfil
✅ **Solução:**
1. Faça login no dashboard principal como brunogestormktp@gmail.com
2. Clique no avatar no canto superior direito
3. Faça upload de uma foto
4. Volte ao admin-selector e recarregue

### 4. Permissões do Firestore
❌ **Problema:** Admin não tem permissão para ler `/usuarios/{uid}`
✅ **Solução:**
```bash
# Já deve estar deployado, mas se não:
firebase deploy --only firestore:rules
```

## 🔍 Exemplo de Debug no Console

**Logs esperados (SUCESSO):**
```
🏢 Empresa adicionada: {id: "abc123", email: "brunogestormktp@gmail.com"}
📸 Dados do usuário: abc123 {email: "...", profileLogoUrl: "https://..."}
✅ Foto encontrada em profileLogoUrl: https://storage.googleapis.com/...
🎨 Renderizando empresa: brunogestormktp@gmail.com photoURL: https://... logoHtml: <img src="https://..." alt="Logo">
```

**Logs esperados (SEM FOTO):**
```
🏢 Empresa adicionada: {id: "abc123", email: "brunogestormktp@gmail.com"}
📸 Dados do usuário: abc123 {email: "...", displayName: "..."}
ℹ️ Não há dados na subcoleção clients
❌ Nenhuma foto encontrada para: brunogestormktp@gmail.com
🎨 Renderizando empresa: brunogestormktp@gmail.com photoURL: undefined logoHtml: B
```

## 🚀 Próximos Passos

1. **Abra test-photo-location.html**
2. **Descubra o UID real** no Firebase Console
3. **Busque a foto** e veja exatamente onde está
4. **Reporte aqui** o que encontrou

## 📝 Template de Resposta

Copie e cole isto com os resultados:

```
UID testado: _______
Email testado: brunogestormktp@gmail.com

Documento /usuarios/{uid} existe? SIM / NÃO
Campo profileLogoUrl existe? SIM / NÃO
Valor do profileLogoUrl: _______

Subcoleção /usuarios/{uid}/clients/{clientKey} existe? SIM / NÃO
Campo profileLogoUrl na subcoleção existe? SIM / NÃO

Foto aparece no preview? SIM / NÃO
URL da foto: _______

Console logs no admin-selector:
[Cole os logs aqui]
```

---

**Última atualização:** 29/11/2025
**Arquivos envolvidos:**
- `test-photo-location.html` ← Use este primeiro!
- `admin-selector.html`
- `firestore.rules`
