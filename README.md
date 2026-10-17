# Controle de Produção Noel

Conferência das quatro lojas, catálogo compartilhado, quantidades independentes
da seleção, histórico, importação/exportação Excel e WhatsApp.

A versão em validação funciona diretamente pelo link, **sem conta ou login**.
O navegador chama `/api/sync`; somente a API Vercel acessa o Firestore pelo Admin SDK.
Não há SDK Firebase nem credenciais administrativas no frontend.

- [Arquitetura, testes e limitações](REALTIME.md)
- [Passo a passo: conta de serviço e segredos na Vercel](CONFIGURACAO_FIREBASE.md)

## Desenvolvimento

Node.js 24. Instalar com `npm ci`, testar com `npm test`, gerar estáticos com
`npm run build`. Vercel usa `dist` e a Function `api/sync.js`, na região `gru1`.

Para testar a interface sem credenciais nem dados reais:

```sh
npm run build
node scripts/dev-server.mjs --test-fixture
```

Esse modo usa um banco de teste em memória; **não é Firebase** e não é incluído na
API de produção. Sem essa opção, `npm run dev` exige os segredos de backend configurados.

Produção atual: https://padaria-kappa-six.vercel.app/
Repositório: https://github.com/owagnerjrr/padaria

Não integrar esta branch antes de validar a API com a conta de serviço real,
homologar a migração e receber aprovação para produção.
