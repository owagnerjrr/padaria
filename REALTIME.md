# Sincronização Noel — implementação em validação

## Situação desta entrega

Branch `feat/firestore-realtime`. Sem merge e sem publicação em produção.
Projeto autorizado: `padariastefany-7ab8a`. Firestore Standard `(default)` criado em
`southamerica-east1`, plano Spark, inicialmente com todas as operações de cliente
negadas. Nenhum dado operacional foi importado. App web `Controle de Produção Noel`
registrado; quatro variáveis públicas do SDK salvas exclusivamente em Preview na Vercel.
Produção mantém o commit `caf6054`.

O código e os testes locais não substituem testes reais do Firebase. Atendendo ao
pedido de não usar conta com e-mail/senha, o app usa Firebase Authentication anônimo
com autorização individual de aparelhos pelo administrador. Identificar o aparelho
não concede acesso aos dados: seu UID precisa constar em `authorizedUsers`.
Não habilitar acesso irrestrito. A autorização dos aparelhos reais está pendente.

## Estrutura

- `authorizedUsers/{uid}`: autorização criada exclusivamente pelo administrador no console.
- `noel/main`: marcador imutável de migração, schema e data do servidor.
- `noel/main/entries/{id}`: registro de um campo, com chave lógica, valor, revisão,
  operação única e data do servidor. ID codificado sem barras.
- Chaves lógicas: `[quantity, loja, categoria|||produto]`,
  `[selected, loja, categoria|||produto]`, `[catalog, all, categoria|||produto]`,
  `[history, loja, id]`.

Quantidades e seleção têm registros separados. As quatro lojas são independentes.
O catálogo é global. Exclusão usa marcador; o histórico tem ID estável e não é
apagado ao salvar uma nova conferência. Não há exclusão física de registros pelo app.

## Configurar acesso sem e-mail nem senha

1. Firebase → Authentication → Métodos de login → ativar **Anônimo**.
   Não é necessário cadastrar e-mail, senha ou formulário de login.
2. Abrir o sistema no aparelho que deseja autorizar. Expandir o painel de
   sincronização e copiar o código (UID) exibido. Criar `authorizedUsers/{UID}` no Firestore pelo console,
   com um campo administrativo como `enabled: true`. A existência do documento
   autoriza somente aquele aparelho; para revogar, remover o documento pelo console.
   Repetir no celular, computador e tablet. Não autorizar códigos de desconhecidos.
   Ao limpar os dados do navegador ou trocar de perfil, será necessária nova autorização.
3. Registrar um app Web neste projeto e obter a configuração pública do SDK.
4. Authentication → Configurações → Domínios autorizados: adicionar
   `padaria-kappa-six.vercel.app` e o domínio exato do preview usado nos testes.
5. Validar `firestore.rules` no emulador e depois publicar para este projeto.
   Com CLI autenticada: `firebase deploy --only firestore:rules --project padariastefany-7ab8a`.
6. Na Vercel, projeto `padaria`, configurar separadamente em Preview e Production:
   `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`,
   `FIREBASE_APP_ID`. São identificadores públicos do SDK web, não chaves administrativas.
   Nunca adicionar service account ou chave privada.
7. Build: `npm run build`; saída: `dist`. `vercel.json` especifica ambos.
   O build sem configuração mantém o modo local e mostra que a nuvem não está configurada.
   Não aprovar produção se o indicador estiver em modo local.
8. Revisar o preview e executar a matriz abaixo. Produção exige aprovação do usuário.

## Migração e recuperação

Escolher primeiro o navegador do domínio de produção que contém os dados corretos.
Um preview tem origem diferente e não consegue ler o localStorage da produção.
**Não inicializar a nuvem pelo preview vazio antes de obter o backup do navegador
com os dados reais.**

O app salva `noel-original-backup-v1` antes da adaptação do formato legado. Antes de
aplicar a nuvem cria outro backup persistente e oferece download JSON. As chaves
operacionais passam a representar a nuvem, mas os backups preservam o conteúdo
anterior. Não limpar dados do site ou reinstalar o navegador durante a migração.

A importação inicial mostra contagens por loja, catálogo e histórico e pede
confirmação. Só é aceita para nuvem ainda não inicializada. Uma transação cria o
marcador e os dados juntos, impedindo uma segunda importação de substituir os dados.
Limite conservador: 450 registros na migração inicial atômica. Acima disso, o app
interrompe e exige migração assistida; não trunca dados. Conferências não são cortadas.

Em falha: não apagar localStorage. Baixar backup e corrigir configuração/acesso.
Para recuperação assistida, usar o JSON: seu campo `localStorage` contém cada chave
e seu valor original. Restaurar em um perfil separado para revisar antes de usar
como origem de uma nova migração. Não restaurar chaves antigas sobre uma nuvem já
ativa: dados locais nunca são automaticamente mesclados à nuvem existente.

O primeiro carregamento autenticado exige conexão com o servidor. Após carregar,
edições offline ficam em fila local persistente por projeto e UID; a reconexão
as envia. O cache Firestore usa IndexedDB. Esta versão não inclui service worker:
não promete abrir o site do zero sem internet. O indicador informa offline e
pendências; fechar com pendências solicita aviso do navegador.

## Concorrência e falhas

A digitação é agrupada por 650 ms. Só campos alterados entram na fila. Uma aba
editora por navegador, protegida por Web Locks; outra aba fica bloqueada.
Cada gravação usa transação e compara a revisão observada. Se outro aparelho
alterou o mesmo campo, a edição antiga fica na fila, sem substituir o servidor.
O painel oferece revisar o valor remoto e o local. Antes da decisão baixa backup;
o usuário pode aceitar a nuvem ou reenviar explicitamente sobre a revisão atual.
Uma nova concorrência exige nova revisão. Repetições usam o ID da operação para
reconhecer uma gravação já confirmada, inclusive após fechar o navegador.

Limitações para homologação: operações em massa são vários campos independentes,
não uma transação única; podem aparecer gradualmente. O listener carrega a coleção
compartilhada (todas as lojas e histórico); o histórico aumenta o custo de leitura
com o tempo. Monitorar volume e implementar paginação se necessário. Dados locais
e backups permanecem no aparelho autorizado; usar bloqueio de tela.

## Validação

Executado: `node --test tests/*.test.mjs` (11 testes passaram),
`node scripts/build.mjs`, `node --check app.js`, `node --check sync.js`,
`git diff --check`.
Os testes da fila usam um adaptador Firestore controlado, não um serviço real.
Não executado: regras no emulador (instalação de dependências bloqueada por DNS),
identificação anônima real, autorização dos aparelhos, testes entre dispositivos e migração real.

Preview automático do commit inicial `acfa7b3` ficou Ready na Vercel:
https://padaria-r11a5ihqt-wagners-projects-6386cb6e.vercel.app/
Testado no navegador (modo local, antes de injetar a configuração Firebase): pesquisa,
quantidade sem seleção, marcar/desmarcar preservando 10, lojas 01/02 independentes,
zeragem preservando seleção, salvar relatório/histórico, e largura móvel de 390 px.
Esses resultados não comprovam sincronização remota. A integração Vercel via MCP
retornou 403 para o escopo; a configuração foi feita pelo dashboard autenticado.

Antes do merge, testar em contextos independentes de celular e computador:

- Identificação automática e acesso somente ao UID autorizado; cliente sem autenticação
  e aparelho com autenticação anônima mas sem autorização devem ter leitura/gravação negadas.
- Quantidade sem marcação, desmarcação preservando quantidade, seleção e limpeza.
- Lojas 01 a 04 independentes, catálogo compartilhado, adição e exclusão.
- Excel com números e texto, prévia, cancelamento, confirmação e sincronização.
- Histórico compartilhado, sem duplicações, filtrado pela loja.
- Duas edições no mesmo campo: conflito preservado e resolução explícita.
- Edições em campos diferentes: ambas preservadas.
- Offline após carregamento, reconexão, fechar e reabrir com fila pendente.
- Migração com dados reais e backup, falha/repetição, nuvem já preenchida e limite de tamanho.
- Revisão visual e funcional em tela de celular, relatórios, Excel e WhatsApp.

## Custos e fontes

Spark: custo previsto de US$ 0 dentro das cotas. Firestore Standard oferece
1 GiB de armazenamento, 50.000 leituras/dia, 20.000 gravações/dia e
20.000 exclusões/dia, além de 10 GiB/mês de transferência de saída gratuita.
Listeners, reconexões, leitura de autorização nas regras e transações também
consomem operações. Não habilitar Blaze ou backups pagos sem aprovação.
No Spark, atingir limites pode interromper o serviço; não há promessa de capacidade ilimitada.

Fontes oficiais (verificar antes de publicar):
https://firebase.google.com/docs/firestore/pricing
https://firebase.google.com/docs/firestore/quotas
https://firebase.google.com/docs/firestore/manage-data/transactions
https://firebase.google.com/docs/firestore/manage-data/enable-offline

Repositório: https://github.com/owagnerjrr/padaria
Produção atual: https://padaria-kappa-six.vercel.app/
Console: https://console.firebase.google.com/project/padariastefany-7ab8a/overview
