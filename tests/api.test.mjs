import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {ApiSync} from '../sync-client.js';
import {createHandler} from '../server/handler.js';
import {createFirestoreStore} from '../server/firestore-store.js';
import {FakeFirestore} from '../testing/fake-firestore.js';
const key=JSON.stringify(['quantity','02','Doces|||Arroz doce']);
const operation=(value,base=0)=>({key,value,base,operation:randomUUID()});
function setup(initialized=true){
  const db=new FakeFirestore();if(initialized)db.documents.set('noel/preview',{schema:1,apiVersion:0});
  const store=createFirestoreStore(db,{workspace:'preview',rateSecret:'fixture-secret',now:()=>1234567890000});
  const handler=createHandler({store,allowInitialize:true,logger:{error(){}}});
  const call=(path='/api/sync',options={})=>handler(new Request('https://noel.example'+path,{...options,headers:{'x-vercel-forwarded-for':'127.0.0.1',...options.headers}}));
  const post=body=>call('/api/sync',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  return {db,store,call,post};
}
function client(call){
  const memory=new Map();let online=true;
  const storage={getItem:key=>memory.get(key)??null,setItem:(key,value)=>memory.set(key,value)};
  const engine=new ApiSync({storage,fetcher:call,online:()=>online});
  return {engine,storage,memory,offline:()=>{online=false;},online:()=>{online=true;}};
}
test('dois clientes independentes recebem alterações por HTTP incremental',async()=>{
  const t=setup(),a=client(t.call),b=client(t.call);await a.engine.poll();await b.engine.poll();
  a.engine.capture({[key]:'10'});a.engine.due=0;await a.engine.flush();await b.engine.poll();assert.equal(b.engine.remote[key],'10');
  const next=await t.call('/api/sync?since=0');const payload=await next.json();assert.equal(payload.full,false);assert.equal(payload.entries.length,1);
  const reads=t.db.queryReads;const response=await t.call('/api/sync?since='+payload.version,{headers:{'If-None-Match':payload.etag}});assert.equal(response.status,304);assert.equal(t.db.queryReads,reads);
});
test('edição antiga não sobrescreve revisão mais recente',async()=>{
  const t=setup(),a=client(t.call),b=client(t.call);await a.engine.poll();await b.engine.poll();
  a.engine.capture({[key]:'10'});b.engine.capture({[key]:'20'});a.engine.due=0;b.engine.due=0;await a.engine.flush();await b.engine.flush();
  assert.equal(b.engine.queue[key].conflict,true);assert.equal((await t.store.snapshot()).entries[0].value,'10');
});
test('fila sobrevive a falha de API e a reinício do cliente',async()=>{
  const t=setup(),a=client(t.call);await a.engine.poll();a.offline();a.engine.capture({[key]:'7'});await a.engine.flush();assert.equal(a.engine.queue[key].value,'7');
  const restored=new ApiSync({storage:a.storage,fetcher:t.call,online:()=>true});restored.due=0;await restored.flush();assert.equal(restored.remote[key],'7');assert.equal(Object.keys(restored.queue).length,0);
  const again=new ApiSync({storage:a.storage,fetcher:t.call,online:()=>false});assert.equal(again.remote[key],'7');
});
test('repetição da operação é idempotente e preserva recuperação',async()=>{
  const t=setup(),op=operation('10');assert.equal((await t.post({operations:[op]})).status,200);await t.post({operations:[op]});
  assert.equal((await t.store.snapshot()).entries[0].revision,1);
  await t.post({operations:[operation('20',1)]});assert.ok([...t.db.documents.keys()].some(x=>x.includes('/recovery/')));
});
test('valida lojas, quantidades, chaves e lotes sem escrever',async()=>{
  for(const op of [operation('-1'),{...operation('2'),key:JSON.stringify(['quantity','99','Doces|||Arroz doce'])},{...operation('2'),key:'__proto__'}]){
    const t=setup();assert.equal((await t.post({operations:[op]})).status,400);assert.equal((await t.store.snapshot()).entries.length,0);
  }
  const t=setup();assert.equal((await t.post({operations:Array.from({length:33},()=>operation('2'))})).status,400);
});
test('origem externa, tipo de conteúdo e payload excessivo são rejeitados',async()=>{
  const t=setup();assert.equal((await t.call('/api/sync',{method:'POST',headers:{Origin:'https://other.example'}})).status,403);
  assert.equal((await t.call('/api/sync',{method:'POST',body:'{}'})).status,415);
  assert.equal((await t.call('/api/sync',{method:'POST',headers:{'Content-Type':'application/json'},body:'x'.repeat(512001)})).status,413);
});
test('limites são persistentes entre duas instâncias da API',async()=>{
  const t=setup();const other=createHandler({store:createFirestoreStore(t.db,{workspace:'preview',rateSecret:'fixture-secret',now:()=>1234567890000})});
  for(let i=0;i<90;i++)assert.equal((await t.call('/api/sync?since=0')).status,200);
  const response=await other(new Request('https://noel.example/api/sync?since=0',{headers:{'x-vercel-forwarded-for':'127.0.0.1'}}));assert.equal(response.status,429);assert.equal(response.headers.get('retry-after'),'60');
});
test('migração atômica não substitui nuvem já inicializada',async()=>{
  const t=setup(false);assert.equal((await t.post({initialize:true,operations:[operation('10')]})).status,200);
  assert.equal((await t.post({initialize:true,operations:[operation('20')]})).status,409);
  assert.equal((await t.store.snapshot()).entries[0].value,'10');
});
test('migração pública fica desativada por padrão e falhas não expõem segredos',async()=>{
  const t=setup(false),handler=createHandler({store:t.store});
  const request=new Request('https://noel.example/api/sync',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({initialize:true,operations:[]})});assert.equal((await handler(request)).status,403);
  t.db.fail=true;const response=await t.call();assert.equal(response.status,503);assert.doesNotMatch(await response.text(),/Injected/);
});
test('resposta perdida após commit é recuperada pelo polling, sem duplicação',async()=>{
  const t=setup();let lose=true;const a=client(async(path,options)=>{const response=await t.call(path,options);if(options.method==='POST'&&lose){lose=false;throw Error('response lost after commit');}return response;});
  await a.engine.poll();a.engine.capture({[key]:'8'});a.engine.due=0;await a.engine.flush();assert.ok(a.engine.queue[key]);
  await a.engine.poll();assert.equal(Object.keys(a.engine.queue).length,0);assert.equal(a.engine.remote[key],'8');assert.equal((await t.store.snapshot()).entries[0].revision,1);
});
test('histórico não pode ser apagado ou alterado por revisão do cliente',async()=>{
  const t=setup();const history={id:'test-history',store:'02',date:'16/10/2026',createdAt:1,count:1,units:7,items:[{category:'Doces',name:'Arroz doce',qty:'7'}]};
  const op={key:JSON.stringify(['history','02',history.id]),value:history,base:0,operation:randomUUID()};assert.equal((await t.post({operations:[op]})).status,200);
  assert.equal((await t.post({operations:[{...op,base:1,operation:randomUUID()}]})).status,400);
  assert.equal((await t.post({operations:[{...op,value:null,operation:randomUUID()}]})).status,400);
});
test('leituras completas excessivas e orçamento diário são limitados',async()=>{
  const t=setup();for(let i=0;i<5;i++)assert.equal((await t.call()).status,200);assert.equal((await t.call()).status,429);
  t.db.documents.set('noelApiBudgets/preview',{day:Math.floor(1234567890000/86400000),used:3000});assert.equal((await t.post({operations:[operation('1')]})).status,429);
});
test('históricos pendentes grandes são divididos por bytes sem perder registros',async()=>{
  const t=setup(),a=client(t.call);await a.engine.poll();const values={};
  for(let i=0;i<10;i++){
    const id='large-history-'+i;values[JSON.stringify(['history','02',id])]={id,store:'02',date:'16/10/2026',createdAt:i,count:500,units:500,items:Array.from({length:500},()=>({category:'Doces',name:'Produto '+('a'.repeat(108)),qty:'1'}))};
  }
  a.engine.capture(values);a.engine.due=0;await a.engine.flush();assert.ok(Object.keys(a.engine.queue).length>0);assert.equal(a.engine.error,null);
  while(Object.keys(a.engine.queue).length)await a.engine.flush();assert.equal((await t.store.snapshot()).entries.length,10);
});
