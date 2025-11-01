
Como publicar no Netlify (deploy rápido):
1) Vá em Site → Deploys → "Upload deploy".
2) Faça upload do arquivo ZIP desta pasta.
3) Pronto. Se acessar uma rota diferente (ex.: /algo), o Netlify redireciona para index.html.

Dicas:
- Se já usa Git, coloque 'index.html' na raiz do repositório e crie um arquivo chamado _redirects com o conteúdo:
  /* /index.html 200
- Depois, faça um novo deploy.

Passo a passo para habilitar a coleta automática da aba I.A no Firebase:
1) No Firebase Console acesse **Firestore Database** e confirme que cada usuário possui o documento `usuarios/{uid}` (é o mesmo `uid` retornado pelo login do Firebase Auth).
2) Dentro de cada `usuarios/{uid}` crie – caso ainda não existam – as coleções utilizadas pela plataforma:
   • `posts` — documentos com os campos do calendário (ex.: `dateISO`, `desc`, `mediaUrls`, `status`).
   • `clients/{clientId}` — onde `{clientId}` deve ser o identificador do cliente utilizado no login (antes do `@`).
3) Dentro de `clients/{clientId}` a aplicação irá ler automaticamente **todo o conteúdo salvo pela plataforma**:
   • Documento principal do cliente (campos livres como `refSocial`, metas, links etc.).
   • Subcoleção `calendarNotes` (cada documento com `note` e metadados do calendário).
   • Subcoleção `fileFolders` com os documentos das pastas (`name`). Cada pasta possui automaticamente a subcoleção `files` com `name`, `url` e demais campos de cada arquivo.
   • Subcoleção `iframes` (documento por campo vinculado a um iframe) contendo ao menos `src` e `updatedAt`.
4) Não é necessário inserir dados manualmente na aba I.A: basta continuar utilizando o painel normalmente. Sempre que um usuário fizer login, o painel busca automaticamente os dados da plataforma, do documento do usuário e das coleções do Firebase e envia tudo para o contexto da IA.
5) Por fim, garanta que no navegador exista `window.OPENROUTER_API_KEY` com a chave do OpenRouter para que a IA possa responder usando todo o contexto carregado.
