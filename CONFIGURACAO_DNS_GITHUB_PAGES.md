# Configuração DNS para GitHub Pages

## ✅ Arquivo CNAME Criado
O arquivo `CNAME` foi adicionado ao repositório com o conteúdo: `dashboard.mediagrowth.com.br`

## 📋 Próximos Passos

### 1. Configurar DNS no Provedor de Domínio

Você precisa atualizar os registros DNS no painel do seu provedor de domínio (onde você comprou o mediagrowth.com.br).

**REMOVA os registros antigos do Netlify:**
- Remova qualquer registro CNAME ou A que aponte para netlify.app

**ADICIONE os seguintes registros:**

#### Opção A: Usando CNAME (Recomendado para subdomínio)
```
Tipo: CNAME
Host: dashboard
Valor: mediagrowthmkt-debug.github.io
TTL: 3600 (ou automático)
```

#### Opção B: Usando registros A (Se o CNAME não funcionar)
```
Tipo: A
Host: dashboard
Valor: 185.199.108.153
TTL: 3600

Tipo: A
Host: dashboard
Valor: 185.199.109.153
TTL: 3600

Tipo: A
Host: dashboard
Valor: 185.199.110.153
TTL: 3600

Tipo: A
Host: dashboard
Valor: 185.199.111.153
TTL: 3600
```

### 2. Configurar GitHub Pages

1. Acesse: https://github.com/mediagrowthmkt-debug/ATUALIZA--ES-PREPLATAFORMA-AGORA/settings/pages

2. Em **"Custom domain"**, digite: `dashboard.mediagrowth.com.br`

3. Clique em **"Save"**

4. Aguarde alguns minutos e marque a opção **"Enforce HTTPS"** quando disponível

### 3. Verificar DNS

Após configurar, aguarde 5-30 minutos para propagação do DNS e execute:

```bash
nslookup dashboard.mediagrowth.com.br
```

Você deverá ver algo como:
```
dashboard.mediagrowth.com.br    canonical name = mediagrowthmkt-debug.github.io
```

### 4. Testar o Site

Acesse: https://dashboard.mediagrowth.com.br

## ⏱️ Tempo de Propagação

- **Mínimo:** 5-15 minutos
- **Máximo:** 24-48 horas (casos raros)
- **Típico:** 30 minutos a 2 horas

## 🔧 Comandos de Diagnóstico

```bash
# Verificar DNS atual
nslookup dashboard.mediagrowth.com.br

# Verificar com servidor DNS do Google
nslookup dashboard.mediagrowth.com.br 8.8.8.8

# Limpar cache DNS local (macOS)
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

## 📝 Status Atual

- ✅ Arquivo CNAME criado no repositório
- ⏳ Aguardando configuração DNS no provedor
- ⏳ Aguardando configuração no GitHub Pages
- ⏳ Aguardando propagação DNS

## 🆘 Problemas Comuns

### Site ainda mostra Netlify
- Limpe o cache do navegador (Cmd+Shift+R)
- Limpe o cache DNS (comando acima)
- Aguarde mais tempo para propagação

### Erro "Domain is already taken"
- Remova o domínio das configurações do Netlify primeiro
- Aguarde alguns minutos e tente novamente no GitHub

### HTTPS não funciona
- Aguarde a propagação completa do DNS
- A opção "Enforce HTTPS" só aparece após validação do domínio
- Pode levar até 24h para o certificado SSL ser emitido

## 📞 Links Úteis

- [GitHub Pages Documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Troubleshooting Custom Domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages)
