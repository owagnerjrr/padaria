import {diff} from './sync-core.js';
export class ApiSync {
  constructor({storage,fetcher=(...args)=>fetch(...args),onUpdate=()=>{},onStatus=()=>{},online=()=>navigator.onLine}){
    Object.assign(this,{storage,fetcher,onUpdate,onStatus,online});
    this.queue=JSON.parse(storage.getItem('noel-api-outbox-v1')||'{}');
    const cache=JSON.parse(storage.getItem('noel-api-cache-v1')||'null');
    this.remote=cache?.remote||{};this.revisions=cache?.revisions||{};this.initialized=cache?.initialized||false;
    this.etag=cache?.etag;this.version=cache?.version;this.ready=!!cache;this.busy=false;this.polling=false;this.error=null;this.retryAt=0;this.due=0;
  }
  persist(){this.storage.setItem('noel-api-outbox-v1',JSON.stringify(this.queue));}
  cache(){this.storage.setItem('noel-api-cache-v1',JSON.stringify({remote:this.remote,revisions:this.revisions,initialized:this.initialized,etag:this.etag,version:this.version}));}
  merged(){const data={...this.remote};for(const op of Object.values(this.queue))data[op.key]=op.value;return data;}
  status(){this.onStatus({error:this.error,offline:!this.online(),pending:Object.keys(this.queue).length,conflicts:Object.values(this.queue).filter(x=>x.conflict),initialized:this.initialized,ready:this.ready});}
  render(){this.onUpdate(this.merged(),this.initialized);this.status();}
  capture(values){
    if(!this.ready||!this.initialized)return;
    for(const change of diff(this.merged(),values)){
      const old=this.queue[change.key];
      this.queue[change.key]={...change,base:old?.base??this.revisions[change.key]??0,operation:crypto.randomUUID(),conflict:old?.conflict||false};
    }
    this.persist();this.due=Date.now()+650;this.status();
  }
  async request(options={}){
    const path=options.method==='POST'||this.version===undefined?'/api/sync':'/api/sync?since='+this.version;
    const response=await this.fetcher(path,{...options,cache:'no-store',signal:AbortSignal.timeout(20000)});
    if(response.status===304)return {unchanged:true};
    let data;try{data=await response.json();}catch{throw Error('Resposta inválida da API');}
    if(!response.ok){
      if(response.status===429)this.retryAt=Date.now()+Math.max(60,Number(response.headers.get('retry-after'))||60)*1000;
      throw Error(data.error||'Não foi possível sincronizar');
    }
    return data;
  }
  async poll(){
    if(this.polling||this.busy||!this.online()||Date.now()<this.retryAt){this.status();return;}
    this.polling=true;
    try{
      const snapshot=await this.request({headers:this.etag?{'If-None-Match':this.etag}:{}});
      if(!snapshot.unchanged){
        const remote=snapshot.full?{}:{...this.remote},revisions=snapshot.full?{}:{...this.revisions};
        for(const entry of snapshot.entries){remote[entry.key]=entry.value;revisions[entry.key]=entry.revision;if(this.queue[entry.key]?.operation===entry.operation)delete this.queue[entry.key];}
        this.remote=remote;this.revisions=revisions;this.initialized=snapshot.initialized;
        this.canInitialize=snapshot.canInitialize;this.etag=snapshot.etag;this.version=snapshot.version;this.ready=true;
        this.persist();this.cache();
        this.render();
      }
      this.error=null;
    }catch(e){this.error=e.message;}finally{this.polling=false;this.status();}
  }
  async flush(){
    if(this.busy||this.polling||!this.ready||!this.initialized||!this.online()||Date.now()<this.retryAt||Date.now()<this.due){this.status();return;}
    const sent=[];
    for(const op of Object.values(this.queue).filter(op=>!op.conflict)){
      const candidate=[...sent,op].map(({conflict,...value})=>value);
      if(new TextEncoder().encode(JSON.stringify({operations:candidate})).byteLength>480000){if(!sent.length){this.error='Registro maior que o limite de envio; baixe um backup para recuperação assistida';this.status();}break;}
      sent.push(op);if(sent.length===32)break;
    }
    if(!sent.length)return;
    this.busy=true;
    try{
      const {results}=await this.request({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({operations:sent.map(({conflict,...op})=>op)})});
      for(const result of results){
        const op=this.queue[result.key];
        if(result.conflict){if(result.current){this.remote[result.key]=result.current.value;this.revisions[result.key]=result.current.revision;}if(op)op.conflict=true;}
        else if(result.accepted){
          this.remote[result.key]=result.value??sent.find(x=>x.key===result.key).value;this.revisions[result.key]=result.revision;
          if(op?.operation===result.operation)delete this.queue[result.key];else if(op)op.base=result.revision;
        }
      }
      this.persist();this.cache();this.error=null;this.render();
    }catch(e){this.error=e.message;}finally{this.busy=false;this.status();}
  }
  resolve(key,useLocal){const op=this.queue[key];if(!op)return;if(useLocal){op.base=this.revisions[key]||0;op.operation=crypto.randomUUID();op.conflict=false;}else delete this.queue[key];this.persist();this.render();}
  async initialize(values){
    const operations=Object.entries(values).map(([key,value])=>({key,value,base:0,operation:crypto.randomUUID()}));
    await this.request({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({initialize:true,operations})});
    this.etag=undefined;await this.poll();
  }
}
