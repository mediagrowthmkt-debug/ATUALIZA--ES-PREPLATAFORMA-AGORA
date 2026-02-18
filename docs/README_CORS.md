# Configuração CORS para Firebase Storage

## O que foi feito:

### 1. Atualização do código HTML (✅ CONCLUÍDO)

Adicionei o atributo `crossorigin="anonymous"` em todas as tags `<img>` e `<video>` que carregam mídia do Firebase Storage:

- ✅ Imagens no calendário (thumbnails dos posts)
- ✅ Imagens no feed e stories 
- ✅ Imagens e vídeos no modal de preview
- ✅ Imagens e vídeos no sistema de notas/briefing
- ✅ Elementos de mídia redimensionáveis

**Total de alterações:** 16 ocorrências com `crossorigin="anonymous"`

### 2. Configuração do Firebase Storage (🔧 PENDENTE)

Para que o CORS funcione completamente, você precisa configurar o Firebase Storage para aceitar requisições cross-origin.

#### Opção A: Via Firebase Console (Recomendado)

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá em **Storage** no menu lateral
4. Clique no menu de três pontos (⋮) do seu bucket
5. Selecione **Edit bucket CORS configuration**
6. Cole a configuração do arquivo `cors.json` deste diretório

#### Opção B: Via Google Cloud Console

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione seu projeto Firebase
3. Vá em **Cloud Storage** > **Buckets**
4. Selecione o bucket do Firebase Storage
5. Clique em **PERMISSIONS** > **CORS**
6. Adicione a configuração do arquivo `cors.json`

#### Opção C: Via gsutil (Linha de comando)

```bash
# Instale o Google Cloud SDK se ainda não tiver
# https://cloud.google.com/sdk/docs/install

# Autentique-se
gcloud auth login

# Configure o CORS (substitua YOUR-BUCKET pelo nome do seu bucket)
gsutil cors set cors.json gs://YOUR-BUCKET.appspot.com
```

### 3. Verificação

Após configurar o CORS no Firebase Storage, teste:

1. Abra o DevTools do navegador (F12)
2. Vá para a aba **Console**
3. Abra o calendário e clique em um vídeo
4. Verifique se não há erros relacionados a CORS
5. Teste capturar um frame do vídeo (se implementado)

### Benefícios da configuração CORS

Com o CORS configurado, você poderá:

✅ Capturar frames de vídeos usando Canvas
✅ Processar imagens com JavaScript
✅ Criar thumbnails personalizadas
✅ Aplicar filtros e efeitos em imagens/vídeos
✅ Fazer download programático de mídia
✅ Análise de conteúdo de imagens

### Arquivo cors.json

O arquivo `cors.json` neste diretório contém a configuração CORS que permite:

- **origin**: `["*"]` - Aceita requisições de qualquer origem (você pode restringir para seu domínio específico)
- **method**: `["GET", "HEAD"]` - Permite apenas leitura de recursos
- **maxAgeSeconds**: `3600` - Cache da resposta CORS por 1 hora
- **responseHeader**: Headers permitidos na resposta

### Segurança

Para produção, considere restringir o `origin` para apenas seu domínio:

```json
{
  "origin": ["https://seu-dominio.com", "https://www.seu-dominio.com"],
  "method": ["GET", "HEAD"],
  "maxAgeSeconds": 3600,
  "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"]
}
```

### Solução de problemas

Se ainda tiver erros de CORS após a configuração:

1. **Limpe o cache do navegador** - As configurações CORS podem estar em cache
2. **Verifique o bucket correto** - Certifique-se de configurar o bucket usado pelo projeto
3. **Aguarde propagação** - Mudanças de CORS podem levar alguns minutos para propagar
4. **Teste em modo anônimo** - Elimina interferência de extensões do navegador

### Links úteis

- [Documentação oficial CORS do Firebase Storage](https://firebase.google.com/docs/storage/web/download-files#cors_configuration)
- [Configurando CORS no Cloud Storage](https://cloud.google.com/storage/docs/configuring-cors)
- [HTML crossorigin attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)

---

**Data da implementação:** 01/11/2025
**Versão:** 1.0
