# Configurar Firebase e Vercel — sem login da Stefany

Esta configuração é feita uma vez pelo responsável. A Stefany continuará usando
somente o link do sistema. Não precisa de conta, senha, e-mail, código de aparelho
ou Firebase Authentication.

## 1. Criar uma conta de serviço exclusiva

1. Abra [Contas de serviço no Google Cloud](https://console.cloud.google.com/iam-admin/serviceaccounts?project=padariastefany-7ab8a).
2. Confirme no seletor que o projeto é **padariastefany-7ab8a**.
3. Clique em **Criar conta de serviço**.
4. Nome sugerido: `noel-vercel-api`.
5. Na etapa de acesso ao projeto, conceda **Cloud Datastore User**
   (`roles/datastore.user`), que permite operações de dados do Firestore pelo servidor.
   Não é necessário conceder Owner, Editor, Firebase Admin ou gerenciar usuários.
6. Conclua a criação. A etapa opcional de dar acesso a outras pessoas pode ficar vazia.

Referências oficiais: [criar conta de serviço](https://docs.cloud.google.com/iam/docs/service-accounts-create)
e [IAM do Firestore](https://docs.cloud.google.com/firestore/native/docs/security/iam).

## 2. Gerar a chave JSON

1. Abra a conta criada → **Chaves**.
2. **Adicionar chave → Criar nova chave → JSON → Criar**.
3. O Google fará o download do JSON. Guarde-o fora da pasta do projeto.
4. Não envie esse arquivo no chat, não o anexe ao GitHub e não copie a chave para código.
   O conteúdo completo será usado somente como segredo da Vercel.

Caso a organização bloqueie criação de chaves, peça ao administrador liberação ou
configure identidade de workload em uma etapa separada; não desative políticas da
organização por conta própria.

Referência: [criar chaves de conta de serviço](https://docs.cloud.google.com/iam/docs/keys-create-delete).

## 3. Cadastrar os segredos em Preview

1. Abra [Vercel → padaria → Environment Variables](https://vercel.com/wagners-projects-6386cb6e/padaria/settings/environment-variables).
2. Clique em **Add Environment Variable**.
3. Tipo: **Secret**. Nome: `FIREBASE_SERVICE_ACCOUNT_JSON`.
4. No valor, cole o **JSON inteiro** baixado, incluindo as chaves `{ ... }`.
   Preserve o formato do arquivo; não converta a chave privada em texto de frontend.
5. Selecione somente **Preview** nesta primeira etapa e salve.
6. Adicione outro **Secret**, `NOEL_RATE_LIMIT_SECRET`, com pelo menos 32 caracteres
   aleatórios. Pode gerar 64 caracteres aleatórios em um gerenciador de senhas.
   Use somente no backend e não envie esse valor no chat.
7. Deixe `NOEL_ALLOW_INITIAL_IMPORT` ausente ou igual a `false`.

| Variável | Tipo | Primeira configuração |
|---|---|---|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Secret | JSON inteiro da conta de serviço |
| `NOEL_RATE_LIMIT_SECRET` | Secret | Valor aleatório de pelo menos 32 caracteres |
| `NOEL_ALLOW_INITIAL_IMPORT` | Config | Ausente ou `false` |

Não usar prefixos `VITE_`, `NEXT_PUBLIC_` ou equivalentes nesses segredos.
As quatro variáveis públicas Firebase da implementação anterior não são utilizadas
nesta versão e não substituem a conta de serviço.

A Vercel precisa gerar um novo **deploy de Preview** para aplicar as variáveis.
Confirme a branch `feat/firestore-realtime` antes de solicitar o redeploy; o diálogo
da Vercel pode sugerir Production por padrão. Não faça redeploy de produção nesta etapa.

Referências: [variáveis Vercel](https://vercel.com/docs/environment-variables)
e [tipos Secret e Config](https://vercel.com/changelog/environment-variables-now-use-config-and-secret-types).

## 4. Fechar o acesso direto ao Firestore

Depois de validar que a API consegue usar a conta de serviço, publique o arquivo
`firestore.rules` desta branch no projeto correto. Ele nega leitura e escrita de
todos os clientes. O Admin SDK do servidor usa IAM e continua funcionando.

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} { allow read, write: if false; }
  }
}
```

É possível usar o console Firebase → Firestore → Regras, ou a CLI autenticada:

```sh
firebase deploy --only firestore:rules --project padariastefany-7ab8a
```

Não é necessário apagar usuários, documentos de autorização ou dados antigos para
trocar a arquitetura. O frontend novo não usa Firebase Authentication. O provedor
anônimo antigo pode ser desativado após retirar de uso os previews antigos.

Referência: [servidores usam IAM e ignoram regras de cliente](https://cloud.google.com/firestore/native/docs/security/rules-structure).

## 5. Testes reais antes da produção

Após salvar os dois segredos em Preview, avise apenas que foram cadastrados.
Não envie seus valores. A próxima validação deverá confirmar:

- API real acessando o projeto `padariastefany-7ab8a`.
- Dois navegadores abertos no mesmo preview recebendo alterações.
- Firestore direto retornando `PERMISSION_DENIED` mesmo com os antigos tokens de cliente.
- Histórico, catálogo, Excel, conflitos e recuperação de falhas com o serviço real.
- Ausência de credenciais na resposta da API e nos arquivos estáticos.
- Build e Function da Vercel usando Node.js 24, região `gru1`.

Preview usa `noel/preview`; produção usará `noel/production`. Dados antigos em
`noel/main` e documentos existentes permanecem preservados. Não inicializar a área
de produção por um preview vazio.

## 6. Migração e liberação

1. Identificar o navegador da produção que contém os dados corretos.
2. Exportar e guardar o backup antes da atualização. O localStorage pertence ao
   domínio: um preview não consegue acessar os dados do domínio de produção.
3. Validar a migração com uma cópia dos dados em Preview antes de liberar produção.
4. Somente quando a origem correta estiver pronta, habilitar temporariamente
   `NOEL_ALLOW_INITIAL_IMPORT=true` no ambiente correspondente e gerar novo deploy.
5. Conferir a prévia, marcar a confirmação e aplicar. A API recusa sobrescrever
   uma área já inicializada e importa tudo na mesma transação.
6. Desativar a opção após a importação. Limites: 450 registros e 512.000 bytes por
   requisição inicial; acima disso, fazer migração assistida sem truncar dados.
7. Depois da homologação e aprovação, configurar os segredos também em **Production**,
   fazer merge e confirmar o commit publicado no domínio atual.

Não apagar localStorage, backups ou dados anteriores durante esse processo.
Dados já existentes na nuvem não são substituídos automaticamente por dados locais.
