import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {flatten,diff,materialize} from '../sync-core.js';
const key=JSON.stringify(['quantity','02','Doces|||Arroz doce']);
async function setup(){
  let data={stores:Object.fromEntries(['01','02','03','04'].map(s=>[s,{selected:{},quantities:{}}])),catalog:{added:[],removed:[]},history:[]};
  const storage=new Map([['noel-cloud-backup-test','1']]);
  const documents=new Map();let writes=0,fail=false;
  const nodes=new Map();const node=id=>{if(!nodes.has(id))nodes.set(id,{hidden:false,textContent:'',click(){}});return nodes.get(id);};
  const sdk={doc:(parent,id)=>id==='noel/main'?'meta':id,collection:()=> 'entries',serverTimestamp:()=>123,
    getDocFromServer:async()=>({exists:()=>true}),getDocsFromServer:async()=>({docs:[],empty:true}),
    onSnapshot:()=>()=>{},initializeFirestore:()=>({}),persistentLocalCache:()=>({}),persistentMultipleTabManager:()=>({}),
    runTransaction:async(db,fn)=>{
      if(fail)throw Error('rede indisponível');
      return fn({get:async ref=>({data:()=>documents.get(ref)}),set:(ref,value)=>{writes++;documents.set(ref,value);}});
    }};
  const api={baseCatalog:{Doces:['Arroz doce']},read:()=>structuredClone(data),apply:value=>{data=structuredClone(value);}};
  const nav={onLine:true,locks:{request:async(name,options,fn)=>fn({})}};
  const context={config:{projectId:'test'},flatten,diff,materialize,crypto:globalThis.crypto,btoa,unescape,encodeURIComponent,
    Blob,URL:{createObjectURL:()=>'',revokeObjectURL(){}},setTimeout:()=>1,clearTimeout(){},console,
    document:{getElementById:node,querySelector:()=>node('main'),createElement:()=>node('link')},
    window:{noelSync:api,addEventListener(){}},navigator:nav,localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),get length(){return storage.size;},key:i=>[...storage.keys()][i]},
    location:{reload(){}},confirm:()=>true,__app:{initializeApp:()=>({})},__auth:{getAuth:()=>({}),setPersistence:async()=>{},onAuthStateChanged(){}},__firestore:sdk};
  let source=await readFile(new URL('../sync.js',import.meta.url),'utf8');
  source=source.replace(/^import .*;\r?\n/gm,'').replace("import('https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js')",'Promise.resolve(__app)').replace("import('https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js')",'Promise.resolve(__auth)').replace("import('https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js')",'Promise.resolve(__firestore)');
  const engine=await new vm.Script('(async()=>{'+source+';return {begin,flush,queue:()=>queue,remote:()=>remote};})()').runInNewContext(context);
  await engine.begin({uid:'stefany'});
  return {engine,storage,documents,nav,api,node,setFail:v=>{fail=v;},writes:()=>writes,edit:value=>{data.stores['02'].quantities['Doces|||Arroz doce']=value;api.onChange();}};
}
test('fila preserva edição offline, envia na reconexão e não repete gravação',async()=>{
  const t=await setup();t.nav.onLine=false;t.edit('10');await t.engine.flush();assert.equal(t.writes(),0);assert.match([...t.storage.values()].join(''),/10/);
  t.nav.onLine=true;await t.engine.flush();assert.equal(t.writes(),1);assert.equal(Object.keys(t.engine.queue()).length,0);
  await t.engine.flush();assert.equal(t.writes(),1);
});
test('revisão mais recente na nuvem bloqueia edição antiga sem perder a fila',async()=>{
  const t=await setup();t.edit('10');
  const op=t.engine.queue()[key];
  const id=btoa(unescape(encodeURIComponent(key))).replaceAll('/','_').replaceAll('+','-').replaceAll('=','');
  t.documents.set(id,{key,value:'20',revision:1,operation:'outro-aparelho'});
  await t.engine.flush();assert.equal(t.writes(),0);assert.equal(t.engine.queue()[key].conflict,true);assert.equal(t.engine.queue()[key].value,'10');assert.equal(t.documents.get(id).value,'20');
});
test('falha de rede mantém edição recuperável e status de erro',async()=>{
  const t=await setup();t.edit('3');t.setFail(true);await t.engine.flush();assert.equal(t.engine.queue()[key].value,'3');assert.match(t.node('syncStatus').textContent,/Erro/);
  t.setFail(false);await t.engine.flush();assert.equal(t.writes(),1);
});
test('debounce agrupa digitação antes de enviar a quantidade final',async()=>{
  const t=await setup();t.edit('1');t.edit('10');t.edit('100');assert.equal(t.writes(),0);await t.engine.flush();assert.equal(t.writes(),1);assert.equal([...t.documents.values()][0].value,'100');
});
