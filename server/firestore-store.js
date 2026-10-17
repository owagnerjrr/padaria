import {createHmac} from 'node:crypto';
import {HttpError} from './validation.js';

export function createFirestoreStore(db,{workspace,rateSecret,now=Date.now,timestamp=()=>new Date()}){
  const root=db.doc('noel/'+workspace), entries=root.collection('entries');
  const id=key=>Buffer.from(key).toString('base64url');
  return {
    async limit(ip,write,fullRead=false){
      // Um documento por IP: limite persistente e consistente entre instâncias.
      const hash=createHmac('sha256',rateSecret).update(ip).digest('hex');
      const ref=db.doc('noelApiLimits/'+workspace+'-'+hash);
      const minute=Math.floor(now()/60000),day=Math.floor(now()/86400000);
      await db.runTransaction(async tx=>{
        const old=(await tx.get(ref)).data()||{};
        const requests=old.minute===minute?(old.requests||0):0;
        const writes=old.minute===minute?(old.writes||0):0;
        const daily=old.day===day?(old.daily||0):0;
        const full=old.minute===minute?(old.full||0):0;
        if(requests>=90||(write&&writes>=45)||(fullRead&&full>=5)||daily>=15000)throw new HttpError(429,'Limite temporário de requisições atingido');
        tx.set(ref,{minute,day,requests:requests+1,writes:writes+(write?1:0),full:full+(fullRead?1:0),daily:daily+1});
      });
    },
    async snapshot(etag,since){
      return db.runTransaction(async tx=>{
        const meta=(await tx.get(root)).data();
        const version=meta?.apiVersion||0;
        if(since!==undefined&&since>version)throw new HttpError(400,'Versão de sincronização inválida');
        const tag='"noel-'+workspace+'-'+version+'"';
        if(meta&&etag===tag)return {unchanged:true,etag:tag};
        // Meta e coleção lidos na mesma transação, sem cursor que possa perder alterações.
        const docs=await tx.get((since===undefined?entries:entries.where('changeVersion','>',since)).limit(6001));
        if(docs.size>6000)throw new HttpError(413,'Volume exige paginação assistida; nenhum dado foi apagado');
        return {initialized:!!meta,version,etag:tag,full:since===undefined,entries:docs.docs.map(doc=>{
          const {key,value,revision,operation}=doc.data();return {key,value,revision,operation};
        })};
      });
    },
    async write(operations,{initialize=false}={}){
      return db.runTransaction(async tx=>{
        const metaSnap=await tx.get(root),meta=metaSnap.data();
        if(initialize&&metaSnap.exists)throw new HttpError(409,'Nuvem já inicializada; nada foi substituído');
        if(!initialize&&!metaSnap.exists)throw new HttpError(409,'Importação inicial ainda não autorizada');
        if(initialize&&!(await tx.get(entries.limit(1))).empty)throw new HttpError(409,'Existem dados remotos; migração assistida necessária');
        const budgetRef=db.doc('noelApiBudgets/'+workspace);
        const budget=(await tx.get(budgetRef)).data()||{};
        const day=Math.floor(now()/86400000),used=budget.day===day?(budget.used||0):0;
        const refs=operations.map(op=>entries.doc(id(op.key)));
        const current=refs.length?await tx.getAll(...refs):[];
        const results=[],changed=[];
        for(let i=0;i<operations.length;i++){
          const op=operations[i],previous=current[i].data();
          if(previous?.operation===op.operation){results.push({...op,revision:previous.revision,accepted:true});continue;}
          if((previous?.revision||0)!==op.base){results.push({key:op.key,operation:op.operation,conflict:true,current:previous?{value:previous.value,revision:previous.revision,operation:previous.operation}:null});continue;}
          const next={key:op.key,value:op.value,revision:op.base+1,operation:op.operation,changeVersion:(meta?.apiVersion||0)+1,updatedAt:timestamp()};
          changed.push([refs[i],next]);results.push({key:op.key,value:op.value,revision:next.revision,operation:op.operation,accepted:true});
        }
        if(initialize&&results.some(r=>r.conflict))throw new HttpError(409,'Importação conflita com dados existentes');
        if(used+changed.length>3000)throw new HttpError(429,'Limite diário de alterações atingido');
        if(initialize||changed.length){
          // Backups server-side preservam os valores anteriores de cada campo alterado.
          for(let i=0;i<operations.length;i++)if(current[i].exists&&results[i].accepted&&current[i].data().operation!==operations[i].operation){
            tx.create(root.collection('recovery').doc(refs[i].id+'-'+current[i].data().revision),{previous:current[i].data(),replacedAt:timestamp()});
          }
          for(const [ref,value] of changed)tx.set(ref,value);
          tx.set(root,{...(initialize?{schema:1,createdAt:timestamp()}:{}),apiVersion:(meta?.apiVersion||0)+1},{merge:true});
          tx.set(budgetRef,{day,used:used+changed.length});
        }
        return {results};
      });
    }
  };
}
let cached;
export async function productionStore(){
  if(cached)return cached;
  const raw=process.env.FIREBASE_SERVICE_ACCOUNT_JSON,rateSecret=process.env.NOEL_RATE_LIMIT_SECRET;
  if(!raw||!rateSecret||rateSecret.length<32)throw new HttpError(503,'API aguardando configuração segura na Vercel');
  let credential;try{credential=JSON.parse(raw);}catch{throw new HttpError(503,'Credencial de servidor inválida');}
  if(credential.project_id!=='padariastefany-7ab8a')throw new HttpError(503,'Projeto Firebase não autorizado');
  const [{initializeApp,getApps,cert},{getFirestore,FieldValue}]=await Promise.all([import('firebase-admin/app'),import('firebase-admin/firestore')]);
  const app=getApps()[0]||initializeApp({credential:cert(credential)});
  const workspace=process.env.VERCEL_ENV==='production'?'production':'preview';
  cached=createFirestoreStore(getFirestore(app),{workspace,rateSecret,timestamp:()=>FieldValue.serverTimestamp()});return cached;
}
