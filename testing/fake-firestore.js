// Test double only. Never imported by the Vercel API; does not connect to Firebase.
export class FakeFirestore {
  constructor(){this.documents=new Map();this.tail=Promise.resolve();this.queryReads=0;this.fail=false;}
  doc(path){return new Ref(this,path);}
  async runTransaction(fn){
    const previous=this.tail;let release;this.tail=new Promise(resolve=>{release=resolve;});await previous;
    try{
      if(this.fail)throw Object.assign(Error('Injected service outage'),{code:'test-outage'});
      const draft=new Map([...this.documents].map(([key,value])=>[key,structuredClone(value)]));
      const get=ref=>{
        if(ref instanceof Query){this.queryReads++;const docs=[...draft].filter(([path,value])=>path.startsWith(ref.path+'/')&&path.split('/').length===ref.path.split('/').length+1&&(!ref.filter||value[ref.filter.field]>ref.filter.value)).slice(0,ref.maximum).map(([path,value])=>({id:path.split('/').at(-1),exists:true,data:()=>structuredClone(value)}));return {docs,size:docs.length,empty:!docs.length};}
        const value=draft.get(ref.path);return {exists:value!==undefined,data:()=>value===undefined?undefined:structuredClone(value)};
      };
      const tx={get:async ref=>get(ref),getAll:async(...refs)=>refs.map(get),set:(ref,data,options)=>draft.set(ref.path,structuredClone(options?.merge?{...draft.get(ref.path),...data}:data)),create:(ref,data)=>{if(draft.has(ref.path))throw Error('ALREADY_EXISTS');draft.set(ref.path,structuredClone(data));}};
      const result=await fn(tx);this.documents=draft;return result;
    }finally{release();}
  }
}
class Ref {
  constructor(db,path){this.db=db;this.path=path;this.id=path.split('/').at(-1);}
  collection(name){return new Query(this.db,this.path+'/'+name);}
}
class Query {
  constructor(db,path,filter=null,maximum=Infinity){Object.assign(this,{db,path,filter,maximum});}
  doc(id){return new Ref(this.db,this.path+'/'+id);}
  limit(maximum){return new Query(this.db,this.path,this.filter,maximum);}
  where(field,operator,value){if(operator!=='>')throw Error('Unsupported test query');return new Query(this.db,this.path,{field,value},this.maximum);}
}
