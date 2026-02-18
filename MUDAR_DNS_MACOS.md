# Como Mudar DNS para Google no macOS (SOLUÇÃO RÁPIDA)

## 🎯 Problema
Seu DNS local ainda aponta para Netlify, mas o DNS do Google já está atualizado para GitHub Pages.

## ✅ Solução: Mudar para DNS do Google

### Passo a Passo:

1. **Abra Preferências do Sistema**
   - Clique no  (menu Apple) → **Configurações do Sistema**

2. **Vá para Rede**
   - Clique em **Rede** (ou **Network**)

3. **Selecione sua Conexão**
   - Clique na conexão ativa (Wi-Fi ou Ethernet)
   - Clique em **Detalhes...** ou **Avançado...**

4. **Configure DNS**
   - Clique na aba **DNS**
   - Clique no **+** (mais) para adicionar servidores DNS
   - Adicione os seguintes IPs (nesta ordem):
     ```
     8.8.8.8
     8.8.4.4
     2001:4860:4860::8888
     2001:4860:4860::8844
     ```

5. **Salve as Alterações**
   - Clique em **OK** e depois em **Aplicar**

6. **Limpe o Cache DNS**
   Execute no terminal:
   ```bash
   sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder
   ```

7. **Teste**
   ```bash
   nslookup dashboard.mediagrowth.com.br
   ```

## 🎉 Resultado Esperado

Você deverá ver:
```
dashboard.mediagrowth.com.br    canonical name = mediagrowthmkt-debug.github.io
```

---

## 🔄 Alternativa: Esperar a Propagação

Se não quiser mudar o DNS, basta aguardar. Seu DNS local será atualizado automaticamente em algumas horas (geralmente 2-24h dependendo do TTL).

## 🌐 Testar no Navegador

Enquanto isso, você pode testar se o site está funcionando:

1. **Use modo anônimo** (Cmd + Shift + N no Chrome)
2. **Acesse:** https://dashboard.mediagrowth.com.br
3. Ou acesse diretamente: https://mediagrowthmkt-debug.github.io

---

## 🆘 Se Ainda Não Funcionar

Limpe o cache do navegador:
- **Chrome/Edge:** Cmd + Shift + Delete → Limpar imagens e arquivos em cache
- **Safari:** Cmd + Option + E (limpar cache)
- **Firefox:** Cmd + Shift + Delete → Cache
