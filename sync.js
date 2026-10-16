import config from './firebase-config.js';
import {flatten,diff,materialize} from './sync-core.js';

const badge=document.getElementById('syncStatus');
const panel=document.getElementById('syncPanel');
const message=document.getElementById('syncMessage');
const preview=document.getElementById('migrationPreview');
const migrate=document.getElementById('migrateButton');
const conflictButton=document.getElementById('conflictButton');
const show=(text)=>{badge.textContent=text;};
const api=window.noelSync;
const original=api.read();
let ready=false, initialized=false, remote={}, revisions={}, queue={}, processing=false, timer, failed=false, uid;
let db, auth, sdk, root, collectionRef;
let unsubscribers=[];
const queueKey=()=>`noel-outbox-v1-${config.projectId}-${uid}`;
function persistQueue(){localStorage.setItem(queueKey(),JSON.stringify(queue));}
function status(){
  const conflicts=Object.values(queue).some(x=>x.conflict);
  conflictButton.hidden=!conflicts;
  show(failed?'⚠️ Erro de sincronização':!navigator.onLine?'🔴 Sem conexão'+(Object.keys(queue).length?' · alterações pendentes':''):conflicts?'⚠️ Conflito · revisar':Object.keys(queue).length?'🟡 Salvando alterações':ready&&initialized?'🟢 Sincronizado':'🟡 Aguardando nuvem');
}
function lock(value){document.querySelector('main').inert=value;}
function fail(error){failed=true;message.textContent='Não foi possível sincronizar: '+error.message+'. Os dados locais e a fila foram preservados.';status();}
function id(key){return btoa(unescape(encodeURIComponent(key))).replaceAll('/','_').replaceAll('+','-').replaceAll('=','');}
function merged(){const values={...remote};for(const op of Object.values(queue))values[op.key]=op.value;return values;}
function repaint(){api.apply(materialize(merged(),api.baseCatalog));status();}
function backup(){
  const data={version:1,createdAt:new Date().toISOString(),data:api.read(),pending:queue,localStorage:{}};
  for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key.startsWith('noel-')&&!key.startsWith('noel-backup-'))data.localStorage[key]=localStorage.getItem(key);}
  const serialized=JSON.stringify(data,null,2);
  // Se não for possível persistir o backup, interromper a migração.
  localStorage.setItem('noel-backup-'+Date.now(),serialized);
  const url=URL.createObjectURL(new Blob([serialized],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download='noel-backup-'+Date.now()+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
  return data;
}
document.getElementById('backupButton').onclick=()=>{try{backup();message.textContent='Backup salvo neste navegador e baixado.';}catch(e){fail(e);}};
function capture(){
  if(!ready||!initialized)return;
  try{
    for(const change of diff(merged(),flatten(api.read()))){
      const previous=queue[change.key];
      queue[change.key]={...change,base:previous?.base??revisions[change.key]??0,operation:crypto.randomUUID(),conflict:previous?.conflict||false};
    }
    persistQueue();status();clearTimeout(timer);timer=setTimeout(flush,650);
  }catch(e){lock(true);fail(e);}
}
api.onChange=capture;
async function flush(){
  if(processing||!ready||!initialized||!navigator.onLine)return;
  processing=true;
  try{
    for(const op of Object.values(queue)){
      if(op.conflict)continue;
      const ref=sdk.doc(collectionRef,id(op.key));
      const result=await sdk.runTransaction(db,async tx=>{
        const snap=await tx.get(ref), current=snap.data();
        if(current?.operation===op.operation)return {revision:current.revision};
        if((current?.revision??0)!==op.base)return {conflict:true,current};
        tx.set(ref,{key:op.key,value:op.value,revision:op.base+1,updatedAt:sdk.serverTimestamp(),operation:op.operation});
        return {revision:op.base+1};
      });
      if(result.conflict){
        if(queue[op.key])queue[op.key].conflict=true;
        message.textContent='Outro aparelho alterou o mesmo campo. Sua edição está preservada na fila. Baixe um backup e revise os conflitos.';
        conflictButton.hidden=false;
      }else{
        remote[op.key]=op.value;revisions[op.key]=Math.max(revisions[op.key]||0,result.revision);
        if(queue[op.key]?.operation===op.operation)delete queue[op.key];
        else if(queue[op.key])queue[op.key].base=result.revision;
      }
      persistQueue();
    }
    failed=false;
  }catch(e){fail(e);}finally{processing=false;status();}
}
conflictButton.onclick=()=>{
  try{
    backup();
    for(const op of Object.values(queue).filter(x=>x.conflict)){
      const [kind,store,key]=JSON.parse(op.key);
      const useLocal=confirm(`Conflito: ${kind} · Loja ${store} · ${key}\nNuvem: ${JSON.stringify(remote[op.key])}\nSua edição: ${JSON.stringify(op.value)}\n\nOK: reenviar sua edição sobre a versão atual. Cancelar: usar a nuvem (sua edição permanece no backup).`);
      if(useLocal){op.base=revisions[op.key]??0;op.operation=crypto.randomUUID();op.conflict=false;}
      else delete queue[op.key];
    }
    persistQueue();conflictButton.hidden=true;repaint();flush();
  }catch(e){fail(e);}
};
window.addEventListener('offline',status);
window.addEventListener('online',()=>{status();flush();});
window.addEventListener('beforeunload',event=>{if(Object.keys(queue).length){event.preventDefault();event.returnValue='Há alterações pendentes';}});
document.getElementById('retrySync').onclick=()=>location.reload();

async function begin(user){
  unsubscribers.forEach(fn=>fn());unsubscribers=[];ready=false;initialized=false;remote={};revisions={};queue={};lock(true);
  document.getElementById('loginForm').hidden=!!user;
  if(!user){show('🟡 Entre para sincronizar');message.textContent='Entre com a conta autorizada da Stefany. Os dados locais estão preservados.';return;}
  uid=user.uid;
  try{
    // Backup obrigatório antes de substituir a visualização local pela nuvem.
    if(!localStorage.getItem('noel-cloud-backup-'+config.projectId)){
      backup();localStorage.setItem('noel-cloud-backup-'+config.projectId,'1');
    }
    queue=JSON.parse(localStorage.getItem(queueKey())||'{}');
    const meta=await sdk.getDocFromServer(root);
    initialized=meta.exists();
    const first=await sdk.getDocsFromServer(collectionRef);
    if(!initialized&&!first.empty)throw Error('Nuvem inconsistente: existem registros sem controle de migração');
    for(const doc of first.docs){const value=doc.data();remote[value.key]=value.value;revisions[value.key]=value.revision;}
    ready=true;
    if(initialized){repaint();lock(false);message.textContent='Nuvem carregada. O backup local anterior foi preservado.';}
    else{
      const local=flatten(original);
      preview.textContent=JSON.stringify({lojas:Object.fromEntries(Object.entries(original.stores).map(([s,v])=>[s,{quantidades:Object.keys(v.quantities).length,marcados:Object.keys(v.selected).length}])),catalogo:original.catalog,conferencias:original.history.length,registros:Object.keys(local).length},null,2);
      preview.hidden=false;migrate.hidden=false;message.textContent='Nuvem vazia. Confira a prévia e importe os dados deste aparelho, ou inicialize vazia em um aparelho sem dados. Não importe de outro aparelho antes de escolher a origem correta.';
    }
    unsubscribers.push(sdk.onSnapshot(collectionRef,{includeMetadataChanges:true},snap=>{
      if(snap.metadata.fromCache)return;
      remote={};revisions={};for(const d of snap.docs){const v=d.data();remote[v.key]=v.value;revisions[v.key]=v.revision;}
      // Uma transação pode ter sido confirmada antes de fechar o navegador.
      for(const d of snap.docs){const v=d.data();if(queue[v.key]?.operation===v.operation)delete queue[v.key];}
      persistQueue();if(initialized)repaint();flush();
    },fail));
    unsubscribers.push(sdk.onSnapshot(root,snap=>{
      if(snap.exists()&&!initialized){message.textContent='A nuvem foi inicializada. Recarregue para carregar os dados.';migrate.hidden=true;}
    },fail));
    status();flush();
  }catch(e){fail(e);}
}
migrate.onclick=async()=>{
  if(!ready||initialized||!navigator.onLine)return;
  if(!confirm('Importar os dados da prévia para a nuvem vazia? Um backup será baixado antes. Nenhum dado remoto existente será substituído.'))return;
  migrate.disabled=true;
  try{
    backup();const entries=Object.entries(flatten(original));
    if(entries.length>450)throw Error('Mais de 450 registros: migração assistida necessária para manter a importação atômica');
    await sdk.runTransaction(db,async tx=>{
      if((await tx.get(root)).exists())throw Error('Outro aparelho já inicializou a nuvem. Recarregue; nada foi substituído');
      tx.set(root,{schema:1,createdAt:sdk.serverTimestamp()});
      for(const [key,value] of entries)tx.set(sdk.doc(collectionRef,id(key)),{key,value,revision:1,updatedAt:sdk.serverTimestamp(),operation:crypto.randomUUID()});
    });
    location.reload();
  }catch(e){fail(e);migrate.disabled=false;}
};

if(!config.projectId){show('🟡 Modo local · nuvem não configurada');message.textContent='Firebase ainda não configurado. As funcionalidades locais continuam disponíveis.';document.getElementById('loginForm').hidden=true;}
else{
  lock(true);
  try{
    const [{initializeApp},authSdk,firestoreSdk]=await Promise.all([
      import('https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js')]);
    sdk=firestoreSdk;const app=initializeApp(config);auth=authSdk.getAuth(app);
    await authSdk.setPersistence(auth,authSdk.browserLocalPersistence);
    db=sdk.initializeFirestore(app,{localCache:sdk.persistentLocalCache({tabManager:sdk.persistentMultipleTabManager()})});
    root=sdk.doc(db,'noel/main');collectionRef=sdk.collection(root,'entries');
    // Uma aba editora por navegador impede disputa pela mesma fila local.
    if(!navigator.locks)throw Error('Navegador sem suporte à proteção de múltiplas abas; use Chrome, Edge ou Safari atualizado');
    navigator.locks.request('noel-sync-'+config.projectId,{ifAvailable:true},async lockHandle=>{
      if(!lockHandle){show('⚠️ Sistema aberto em outra aba');message.textContent='Use a outra aba ou feche-a e recarregue esta.';return;}
      authSdk.onAuthStateChanged(auth,begin);
      document.getElementById('loginForm').onsubmit=async event=>{
        event.preventDefault();try{await authSdk.signInWithEmailAndPassword(auth,event.target.email.value,event.target.password.value);event.target.password.value='';}catch(e){fail(e);}
      };
      await new Promise(()=>{});
    }).catch(fail);
  }catch(e){fail(e);}
}
