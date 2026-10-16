# Controle de Produção Noel

> Branch de sincronização em validação: consulte [REALTIME.md](REALTIME.md) para
> configuração Firebase, backup, migração, conflitos e testes pendentes.
> A publicação desta branch usa `npm run build` e diretório `dist` via `vercel.json`.
> Não integrar em produção antes da homologação e aprovação.

Sistema web simples e responsivo para conferência diária dos produtos disponíveis nas lojas.

## Funcionalidades

- Seleção entre Loja 01, 02, 03 e 04.
- Catálogo organizado por categorias.
- Pesquisa rápida por produto.
- Checklist de produtos disponíveis.
- Campo opcional de quantidade por item.
- Resumo automático da conferência.
- Relatório pronto para copiar ou compartilhar pelo WhatsApp.
- Salvamento local da conferência atual.
- Histórico local das últimas conferências salvas.
- Interface adaptada para celular.

## Estrutura

O projeto é estático e pode ser publicado diretamente no Vercel sem etapa de build.

Arquivos principais:

- `index.html`
- `styles.css`
- `app.js`

## Publicação no Vercel

1. Importe este repositório no Vercel.
2. Framework Preset: `Other`.
3. Build Command: deixe vazio.
4. Output Directory: deixe vazio.
5. Faça o deploy.

## Observação importante

Nesta primeira versão, os dados e o histórico são salvos no `localStorage` do navegador. Isso é adequado para o piloto em um único celular/aparelho. Se depois for necessário sincronizar entre aparelhos, manter backup em nuvem ou administrar os produtos remotamente, pode-se adicionar um banco de dados como Firebase/Firestore ou Supabase.
