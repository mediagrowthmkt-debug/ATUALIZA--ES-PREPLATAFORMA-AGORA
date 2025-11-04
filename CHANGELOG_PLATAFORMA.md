# CHANGELOG - Campo PLATAFORMA em Leads

## [1.1.0] - 04/11/2025

### ✨ Adicionado
- **Coluna PLATAFORMA na tabela de leads** para identificar origem (Google Ads ou Meta Ads)
- **Campo `plataforma` no webhook** da Cloud Function `receiveLead`
- **Estilo visual destacado** para a coluna PLATAFORMA (cor amarela #fbbf24)
- **Documentação completa** em 3 arquivos markdown:
  - `WEBHOOK_LEADS_PLATAFORMA.md` - Documentação técnica
  - `EXEMPLO_WEBHOOK_MAKE_PLATAFORMA.md` - Exemplos para Make.com
  - `EXEMPLO_VISUAL_WEBHOOK.md` - Guia visual
  - `RESUMO_ALTERACOES_PLATAFORMA.md` - Resumo executivo

### 🔧 Modificado

#### Frontend (`index.html`)
- **Grid layout da tabela de leads** alterado de 7 para 8 colunas
  - Antes: `1.2fr 1.2fr .9fr 2fr .8fr .8fr 50px`
  - Agora: `1.2fr 1.2fr .9fr 2fr .7fr .8fr .8fr 50px`
- **Header da tabela** adicionada coluna "Plataforma"
  - Antes: Nome | E-mail | Telefone | Pergunta | Fonte | Quando | Ações
  - Agora: Nome | E-mail | Telefone | Pergunta | **Plataforma** | Fonte | Quando | Ações
- **Função `renderLeadsList()`** atualizada para renderizar campo plataforma
- **Hint do webhook** atualizado para incluir documentação do novo campo

#### Backend (`functions/src/index.ts`)
- **Função `receiveLead`** aceita novo campo `plataforma` no body
- **Normalização** aceita tanto `body.plataforma` quanto `body.platform`
- **Firestore** salva campo `plataforma` como string | null
- **TypeScript compilado** para JavaScript em `functions/lib/index.js`

### 📱 CSS Adicionado
```css
.lead-plataforma {
  color: #fbbf24;
  font-size: .8rem;
  font-weight: 700;
  text-transform: uppercase;
}
```

### 🎯 Estrutura JSON do Webhook

#### Antes
```json
{
  "name": "João",
  "email": "joao@email.com",
  "phone": "+5511...",
  "question": "R$ 5.000",
  "source": "Google Ads",
  "tags": ["GOOGLEADS"]
}
```

#### Agora
```json
{
  "name": "João",
  "email": "joao@email.com",
  "phone": "+5511...",
  "question": "R$ 5.000",
  "plataforma": "Google",
  "source": "Google Ads",
  "tags": ["GOOGLEADS"]
}
```

### 🔄 Compatibilidade
- ✅ 100% retrocompatível com webhooks existentes
- ✅ Campo `plataforma` é opcional
- ✅ Leads sem plataforma exibem "-" na coluna
- ✅ Aceita variações: `plataforma` ou `platform`
- ✅ Case-insensitive (Google, google, GOOGLE)

### 📊 Valores Aceitos
- `"Google"` - Para leads do Google Ads
- `"Meta"` - Para leads do Meta Ads (Facebook/Instagram)
- `null` ou `""` - Lead sem plataforma definida (exibe "-")

### 🚀 Deploy

1. **Cloud Functions:**
   ```bash
   cd functions
   npm run build
   firebase deploy --only functions:receiveLead
   ```

2. **Frontend:**
   - Arquivo `index.html` já atualizado
   - Deploy via Git/Netlify/Firebase Hosting

3. **Make.com:**
   - Adicionar campo `plataforma` no body JSON do webhook
   - Configurar detecção automática (ver documentação)

### 📖 Documentação
- Ver `WEBHOOK_LEADS_PLATAFORMA.md` para detalhes técnicos
- Ver `EXEMPLO_WEBHOOK_MAKE_PLATAFORMA.md` para exemplos práticos
- Ver `EXEMPLO_VISUAL_WEBHOOK.md` para guia visual
- Ver `RESUMO_ALTERACOES_PLATAFORMA.md` para resumo executivo

### 🎨 Visualização
A coluna PLATAFORMA aparece entre "Pergunta" e "Fonte" com texto em **amarelo dourado** e **letras maiúsculas**.

### 🐛 Correções
- Nenhuma correção necessária (feature nova)

### 🔐 Segurança
- ✅ Validação de token mantida
- ✅ Sanitização de inputs
- ✅ Firestore rules não alteradas (compatível)

### ⚡ Performance
- ✅ Sem impacto na performance
- ✅ Campo indexado automaticamente pelo Firestore
- ✅ Grid responsivo otimizado

### 📱 Mobile
- ✅ Layout ajustado automaticamente em telas pequenas
- ✅ Coluna PLATAFORMA mantida visível
- ✅ Scroll horizontal quando necessário

---

## [1.0.0] - Anterior
- Sistema de leads básico sem campo plataforma

---

## 🔮 Próximos Passos (Roadmap)

### Possíveis Melhorias Futuras
- [ ] Filtro por plataforma na aba LEADS
- [ ] Dashboard com métricas por plataforma
- [ ] Gráfico comparativo Google vs Meta
- [ ] Exportação CSV com campo plataforma
- [ ] Webhook reverso para CRM externo
- [ ] Integração automática com Google Sheets
- [ ] Notificações por plataforma

---

## 📞 Suporte

Em caso de problemas ou dúvidas:
1. Verificar os arquivos de documentação criados
2. Testar o webhook com curl/Postman
3. Verificar logs do Firebase Functions
4. Conferir console do navegador (F12)

---

**Versão:** 1.1.0  
**Data:** 04/11/2025  
**Autor:** Sistema de Gestão MediaGrowth  
**Status:** ✅ Pronto para produção
