import {HttpError,validateBatch} from './validation.js';
export function createHandler({store,allowInitialize=false,logger=console}){
  return async request=>{
    const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
    try{
      if(!['GET','POST'].includes(request.method))return Response.json({error:'Método não permitido'},{status:405,headers:{...headers,Allow:'GET, POST'}});
      const url=new URL(request.url);
      let since;
      if(url.searchParams.has('since')){const value=url.searchParams.get('since');if(!/^\d+$/.test(value)||!Number.isSafeInteger(Number(value)))throw new HttpError(400,'Versão inválida');since=Number(value);}
      const origin=request.headers.get('origin');
      // Proteção contra uso por outros sites. Não é autenticação e não bloqueia clientes diretos.
      if(origin&&origin!==url.origin)throw new HttpError(403,'Origem não permitida');
      if(request.headers.get('sec-fetch-site')==='cross-site')throw new HttpError(403,'Requisição entre sites não permitida');
      const backend=typeof store==='function'?await store():store;
      // Em Vercel, x-vercel-forwarded-for é definido pela plataforma, não pelo visitante.
      const ip=request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()||'unknown';
      let body,operations,initialize=false;
      if(request.method==='POST'){
        if(request.headers.get('content-type')?.split(';')[0]!=='application/json')throw new HttpError(415,'Envie JSON');
        if(Number(request.headers.get('content-length'))>512000)throw new HttpError(413,'Arquivo muito grande');
        const reader=request.body?.getReader();let length=0,chunks=[];
        if(reader){while(true){const part=await reader.read();if(part.done)break;length+=part.value.byteLength;if(length>512000){await reader.cancel();throw new HttpError(413,'Arquivo muito grande');}chunks.push(part.value);}}
        try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new HttpError(400,'JSON inválido');}
        initialize=body?.initialize===true;
        if(initialize&&!allowInitialize)throw new HttpError(403,'Importação inicial desativada no servidor');
        operations=validateBatch(body,initialize);
      }
      await backend.limit(ip,request.method==='POST',request.method==='GET'&&since===undefined);
      if(request.method==='GET'){
        const snapshot=await backend.snapshot(request.headers.get('if-none-match'),since);
        if(snapshot.unchanged)return new Response(null,{status:304,headers:{...headers,ETag:snapshot.etag}});
        const serialized=JSON.stringify({...snapshot,canInitialize:allowInitialize});
        if(Buffer.byteLength(serialized)>3000000)throw new HttpError(413,'Volume exige paginação assistida; dados preservados');
        return new Response(serialized,{headers:{...headers,'Content-Type':'application/json',ETag:snapshot.etag}});
      }
      return Response.json(await backend.write(operations,{initialize}),{headers});
    }catch(error){
      const status=error instanceof HttpError?error.status:503;
      if(status===503)logger.error('noel-api-unavailable',{code:error.code||'configuration-or-service'});
      return Response.json({error:status===503?'Serviço indisponível. Os dados locais foram preservados.':error.message},{status,headers:{...headers,...(status===429?{'Retry-After':'60'}:{})}});
    }
  };
}
