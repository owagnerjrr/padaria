# Noel — API Vercel com Firestore, sem login

## Estado da entrega

A implementação foi alterada para cumprir a decisão de acesso público pelo link.
Não há tela de login, Firebase Authentication, autorização de aparelho nem SDK Firebase
no navegador. O frontend chama uma API de mesma origem; o servidor usa Firebase Admin SDK.

Esta versão **não foi publicada em produção**. Não foi gerada nem recebida chave de
serviço. Nenhum dado real foi apagado, importado ou alterado nesta etapa. As regras
novas de negar todo acesso de cliente estão no código, mas ainda não foram publicadas
no Firebase nesta etapa; a configuração remota anterior permanece até a troca controlada.

Configuração necessária: [passo a passo de conta de serviço e Vercel](CONFIGURACAO_FIREBASE.md).

## Funcionamento

- `/api/sync`: única Function Node.js 24, região `gru1`.
- `GET`: estado inicial completo; depois consulta somente registros com
  `changeVersion` maior que a última versão recebida.
- `ETag`/`If-None-Match`: HTTP 304 quando nada mudou, sem consultar a coleção inteira.
- Consulta a cada 5 segundos com a página visível; 30 segundos quando oculta.
- Digitação: debounce de 650 ms. Envio limitado por número de operações e por bytes.
- Fila persistente e cache no navegador; alterações ficam pendentes em falhas/offline.
- Edição offline após um carregamento bem-sucedido e após reabrir com cache existente.
  Abertura do site do zero sem internet não é garantida: não foi adicionado service worker.
- Revisão por campo e transação: uma edição antiga não substitui outra mais recente.
  O conflito permanece na fila e pode ser resolvido na interface.
- ID de operação evita duplicação quando uma resposta é perdida após o commit.
- Uma aba editora por navegador protege a fila local. Navegadores e aparelhos distintos
  têm sessões de dados locais independentes e usam a mesma API, sem autenticação.

## Dados preservados

- `noel/production`: área operacional do servidor em Production.
- `noel/preview`: área de homologação em Preview e desenvolvimento.
- `noel/main`: dados técnicos anteriores, mantidos sem alterações nesta etapa.
- `entries/{id}`: mesmo ID base64url e mesma chave lógica da implementação anterior.
  Adiciona apenas `changeVersion`; preserva quantidades, seleção, catálogo e histórico.
- `recovery/{id-revisão}`: valor anterior de cada campo modificado, salvo pelo servidor
  na mesma transação. Não é exposto pela API pública.
- `noelApiLimits/{ambiente-hash}` e `noelApiBudgets/{ambiente}`: contadores de proteção.

Lojas 01 a 04 continuam independentes; catálogo é global. Histórico é imutável pela API:
não há endpoint de apagamento nem permissão de atualizar conferência existente.
Exclusão do catálogo utiliza marcador, preservando o histórico e a possibilidade de recuperação.

O armazenamento local é copiado antes de aplicar a primeira resposta da API. Os dados
operacionais locais passam a refletir a nuvem, mas backups e chaves antigas permanecem.
Filas da implementação anterior são preservadas no armazenamento e no backup; não são
reenviadas automaticamente por uma arquitetura diferente. Revisar eventual pendência na migração.

## Segurança e limites implementados

- Conta de serviço somente no backend; segredo nunca entra no build estático.
- Projeto permitido fixo: `padariastefany-7ab8a`.
- Ambiente escolhido pelo servidor, nunca pelo corpo enviado pelo visitante.
- Regras Firestore preparadas para negar todo acesso direto de clientes.
- API aceita apenas GET e POST com JSON para alterações.
- Bloqueio de origens externas e `Sec-Fetch-Site: cross-site`; sem CORS aberto.
  Isso reduz abuso por outros sites, mas não autentica clientes HTTP diretos.
- Schema estrito: quatro lojas, sete categorias, nomes até 120 caracteres, seleção
  booleana, quantidade não negativa até 1.000.000, IDs e revisões válidos.
- JSON de até 512.000 bytes, lote normal de até 32 operações; o cliente divide lotes
  também por tamanho. Histórico até 500 itens e 120.000 caracteres por registro.
- Por IP: 90 requisições/minuto, 45 envios/minuto, 5 leituras completas/minuto,
  15.000 requisições/dia. Contadores persistentes e transacionais no Firestore;
  não dependem da memória de uma instância serverless. IP é armazenado como HMAC.
- Limite global de 3.000 alterações de campos/dia por ambiente.
- HTTP 429 com `Retry-After`, respeitado pelo cliente; dados pendentes não são descartados.
- Migração inicial desativada no servidor por padrão e recusada se já existe nuvem.
- Respostas sem detalhes de chave, token, stack trace ou credencial.

O acesso público implica que quem conhece o link pode consultar e alterar os dados,
conforme aceito pelo responsável. Os limites reduzem abuso; não impedem ataques
distribuídos nem garantem disponibilidade/custo zero. Antes da liberação, revisar
as proteções DDoS e uma regra de limite para `/api/sync` no Firewall da Vercel, sem
desabilitar as proteções existentes. Nenhuma regra de Firewall foi alterada nesta etapa.

## Testes executados

### Automatizados

`npm test`: **20 testes passaram**. Incluem sincronização de dois clientes, deltas,
HTTP 304 sem releitura da coleção, conflitos, fila offline, reinício do cliente,
resposta perdida após commit, idempotência, recuperação, lotes grandes por bytes,
validação, histórico imutável, limites entre instâncias e migração sem sobrescrita.

Também executados: build estático, análise de sintaxe, `git diff --check`, inspeção dos
arquivos estáticos para ausência de SDK de autenticação/segredos e `npm audit --omit=dev`
(zero vulnerabilidades reportadas no momento da verificação).

Os testes usam um adaptador de Firestore controlado e explicitamente identificado
em `testing/fake-firestore.js`. Ele testa a lógica real da API e das transações, mas
**não se conecta ao Firestore**. Esse adaptador não é importado pela Function da Vercel.

### Dois navegadores reais

Brave e navegador integrado do Codex, com armazenamentos independentes, acessaram
o mesmo servidor HTTP local de testes, sem login ou código de aparelho.

Confirmados pela interface:

- Quantidade `10` digitada no Brave apareceu no outro navegador sem recarregar.
- Seleção e desmarcação circularam nos dois sentidos, preservando a quantidade.
- Zeragem chegou ao segundo navegador.
- Loja 03 ficou vazia enquanto Loja 02 manteve seus valores.
- Conferência salva no segundo navegador apareceu no histórico do primeiro.
- Inclusão de produto apareceu nos dois; exclusão foi recebida nos dois.
  O teste também provocou exclusão concorrente via API e interface, gerando conflito
  preservado e resolvido pelo botão “Usar valor da nuvem”.
- Importação CSV reconheceu três produtos e propagou `Arroz doce = 7`.
- Exportação XLSX foi baixada e reimportada pela interface; reconheceu os três produtos.
  Após trocar para `12`, a importação restaurou `7` e sincronizou pela API.
- Após reabrir ambos os navegadores com o build final, os dois exibiram `7`.

Esses testes de navegador usaram dados sintéticos e backend de teste em memória.
Não comprovam a conexão da nova API com o serviço Firestore real.

## Pendências antes de publicar

1. Responsável criar conta de serviço e cadastrar os dois segredos em Preview.
2. Validar Function implantada, IAM e transações com Firestore real.
3. Publicar regras de negar todo acesso direto e confirmar bloqueio inclusive com
   as antigas credenciais de cliente.
4. Repetir a matriz entre dois navegadores usando Firestore real; testar falha/reconexão.
5. Validar migração de uma cópia dos dados operacionais e a recuperação do backup.
6. Revisar cotas e proteção da API; apresentar o resultado e pedir aprovação de produção.

## Migração e recuperação

Identificar primeiro o navegador/domínio com os dados corretos. Um preview tem outra
origem e não lê o localStorage da produção. Guardar backup antes de atualizar.
Habilitar a importação inicial apenas durante a janela planejada, conferir a prévia
e marcar a confirmação. A transação importa de forma atômica e não substitui área existente.
Limite inicial: 450 registros e 512.000 bytes; acima disso a API recusa a importação,
sem truncar ou apagar informações, e exige migração assistida.

Não limpar dados do site, backups ou documentos antigos. Em falha, baixar backup
e corrigir a causa. Para recuperar valores do servidor, usar os registros de `recovery`
por um procedimento administrativo que grave nova revisão e `changeVersion` e atualize
o `apiVersion` na mesma transação. Não editar valores diretamente pelo console sem
atualizar as versões, pois o polling depende dessas versões.

## Custos e manutenção

O Firestore continua no Spark. As cotas padrão incluem 50.000 leituras/dia,
20.000 gravações/dia, 1 GiB de dados e 10 GiB de saída/mês. Não há garantia de custo
zero: API, limites persistentes e cópias de recuperação consomem operações e espaço.
Dois navegadores visíveis por 8 horas fazem aproximadamente 11.520 consultas/dia;
cada consulta consome operações do contador de limites e da leitura de versão.
Abas ocultas consultam menos. Deltas evitam reler todo o catálogo a cada alteração.

Histórico e recuperação crescem sem exclusão automática. Até 6.000 registros de entrada
podem ser retornados em uma sincronização; acima disso, o servidor sinaliza necessidade
de paginação, preservando os dados. Antes desse volume, planejar paginação e retenção
de cópias com aprovação. Os limites diários reiniciam em UTC.

Fontes oficiais:

- [Functions Node.js](https://vercel.com/docs/functions/runtimes/node-js)
- [Headers e IP na Vercel](https://vercel.com/docs/headers/request-headers)
- [Firestore pelo servidor e IAM](https://docs.cloud.google.com/firestore/native/docs/security/iam)
- [Cotas e faturamento](https://firebase.google.com/docs/firestore/pricing)

Repositório: https://github.com/owagnerjrr/padaria
Produção atual: https://padaria-kappa-six.vercel.app/
