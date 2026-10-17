import {ApiSync} from './sync-client.js';
import {flatten,materialize} from './sync-core.js';
const ui=window.noelSync, original=ui.read();
const get=id=>document.getElementById(id),main=document.querySelector('main');
let editor=true,first=true,timer;
let lastRenderedSnapshot='';
let pendingRender=null;
function backup(download=true){
  const saved={};for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key.startsWith('noel-')&&!key.startsWith('noel-backup-'))saved[key]=localStorage.getItem(key);}
  const data=JSON.stringify({version:2,createdAt:new Date().toISOString(),data:ui.read(),localStorage:saved},null,2);
  localStorage.setItem('noel-backup-'+Date.now(),data);
  if(download){const url=URL.createObjectURL(new Blob([data],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='noel-backup-'+Date.now()+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}
}
const engine=new ApiSync({storage:localStorage,
  onUpdate(values,initialized){
    if(!initialized)return;
    const snapshot=JSON.stringify(values);
    if(snapshot===lastRenderedSnapshot)return;
    const focused=document.activeElement;
    // Não recriar os campos enquanto alguém está digitando: isso faz perder o foco e o valor.
    if(focused?.matches?.('input,textarea,select')&&focused.closest?.('.product-list,.manage-panel')){
      pendingRender=true;
      return;
    }
    if(first){backup(false);first=false;}
    lastRenderedSnapshot=snapshot;
    ui.apply(materialize(values,ui.baseCatalog));
  },
  onStatus(state){
    main.inert=false;get('conflictButton').hidden=!state.conflicts.length;
    get('syncStatus').textContent=state.offline?'🔴 Sem conexão'+(state.pending?' · alterações pendentes':''):state.error?'⚠️ Erro de sincronização':state.conflicts.length?'⚠️ Conflito · revisar':state.pending?'🟡 Salvando alterações':state.initialized?'🟢 Sincronizado':'🟡 Aguardando nuvem';
    if(state.error)get('syncMessage').textContent=state.error+' Seus dados e alterações pendentes foram preservados.';
    else if(state.initialized)get('syncMessage').textContent=state.pending?'Alterações aguardando envio para a nuvem. Confira antes de fechar a página.':'Atualização automática a cada 5 segundos. Acesso direto pelo link, sem login.';
    else if(state.ready){
      get('migrationPreview').hidden=false;
      get('migrationPreview').textContent=JSON.stringify({lojas:Object.fromEntries(Object.entries(original.stores).map(([s,v])=>[s,{quantidades:Object.keys(v.quantities).length,marcados:Object.keys(v.selected).length}])),catalogo:original.catalog,conferencias:original.history.length},null,2);
      get('migrateButton').hidden=!engine.canInitialize;get('migrationConsent').hidden=!engine.canInitialize;
      get('syncMessage').textContent=engine.canInitialize?'Nuvem vazia. Confira a prévia e confirme a importação somente no aparelho com os dados corretos.':'Nuvem aguardando importação inicial controlada. É necessário habilitá-la temporariamente no servidor.';
    }
  }
});
ui.onChange=()=>{try{if(editor){engine.capture(flatten(ui.read()));clearTimeout(timer);timer=setTimeout(()=>engine.flush(),650);}}catch(e){main.inert=false;get('syncStatus').textContent='⚠️ Erro de armazenamento';get('syncMessage').textContent=e.message;}};
document.addEventListener('focusout',()=>{if(pendingRender){setTimeout(()=>{if(!document.activeElement?.matches?.('.qty-input,.code-input')){pendingRender=null;engine.render();}},150);}});
get('backupButton').onclick=()=>{try{backup();get('syncMessage').textContent='Backup preservado no navegador e enviado para download.';}catch(e){get('syncMessage').textContent=e.message;}};
get('retrySync').onclick=async()=>{engine.retryAt=0;await engine.poll();await engine.flush();};
get('migrateButton').onclick=async()=>{
  if(!get('migrationConfirmed').checked){get('syncMessage').textContent='Marque a confirmação após conferir a prévia.';return;}
  try{backup();await engine.initialize(flatten(original));get('migrationPreview').hidden=true;get('migrationConsent').hidden=true;get('migrateButton').hidden=true;}catch(e){get('syncMessage').textContent=e.message;}
};
get('conflictButton').onclick=()=>{
  const box=get('conflictReview');box.replaceChildren();box.hidden=false;
  try{backup(false);}catch(e){get('syncMessage').textContent=e.message;return;}
  for(const op of Object.values(engine.queue).filter(x=>x.conflict)){
    const row=document.createElement('div'),label=document.createElement('p');label.textContent=op.key+' · Nuvem: '+JSON.stringify(engine.remote[op.key])+' · Sua edição: '+JSON.stringify(op.value);row.append(label);
    for(const [text,useLocal] of [['Usar valor da nuvem',false],['Reenviar minha edição',true]]){const button=document.createElement('button');button.type='button';button.textContent=text;button.onclick=()=>{engine.resolve(op.key,useLocal);row.remove();engine.flush();};row.append(button);}box.append(row);
  }
};
window.addEventListener('offline',()=>engine.status());
window.addEventListener('online',async()=>{await engine.poll();await engine.flush();});
window.addEventListener('beforeunload',event=>{if(Object.keys(engine.queue).length){event.preventDefault();event.returnValue='Há alterações pendentes';}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)engine.poll();});
async function tick(){await engine.flush();await engine.poll();setTimeout(tick,document.hidden?30000:5000);}
async function start(){
  engine.render();
  await engine.poll();
  // A instalação inicial é vazia: dados antigos eram somente testes.
  // Nunca sobrescrever uma nuvem já inicializada.
  if(engine.ready&&!engine.initialized&&engine.canInitialize){
    try{await engine.initialize({});}
    catch(error){get('syncMessage').textContent='Não foi possível iniciar a nuvem: '+error.message;}
  }
  await tick();
}
// Cada aba executa sua própria sincronização. O servidor resolve conflitos por revisão.
// Não manter a segunda aba permanentemente sem atualização.
start().catch(error=>{get('syncStatus').textContent='⚠️ Erro de sincronização';get('syncMessage').textContent=error.message;});
