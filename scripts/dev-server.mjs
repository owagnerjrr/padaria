import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createHandler} from '../server/handler.js';
import {createFirestoreStore,productionStore} from '../server/firestore-store.js';
import {FakeFirestore} from '../testing/fake-firestore.js';
export async function startServer({fixture=false,port=5186}={}){
  const database=fixture?new FakeFirestore():null;
  if(database)database.documents.set('noel/preview',{schema:1,apiVersion:0,purpose:'ISOLATED TEST DOUBLE — NOT FIREBASE'});
  const store=database?createFirestoreStore(database,{workspace:'preview',rateSecret:'test-only-secret-never-used-in-production'}):productionStore;
  const handler=createHandler({store,allowInitialize:fixture,logger:fixture?{error(){}}:console});
  const allowed=new Set(['index.html','styles.css','app.js','sync.js','sync-core.js','sync-client.js','assets/noel-logo.svg']);
  const server=http.createServer(async(req,res)=>{
    try{
      if(req.url.split('?')[0]==='/api/sync'){
        const headers=new Headers();for(const [key,value] of Object.entries(req.headers))if(value!==undefined)headers.set(key,String(value));
        headers.set('x-vercel-forwarded-for',req.socket.remoteAddress||'local');
        const request=new Request('http://'+req.headers.host+req.url,{method:req.method,headers,...(!['GET','HEAD'].includes(req.method)?{body:req,duplex:'half'}:{})});
        const response=await handler(request);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));return;
      }
      const path=decodeURIComponent(req.url.split('?')[0]).replace(/^\//,'')||'index.html';
      if(!allowed.has(path)){res.writeHead(404).end();return;}
      const data=await readFile(new URL('../dist/'+path,import.meta.url));
      const extension=path.split('.').at(-1);res.setHeader('Content-Type',({html:'text/html;charset=utf-8',js:'text/javascript;charset=utf-8',css:'text/css',svg:'image/svg+xml'})[extension]);res.end(data);
    }catch(error){console.error('local-server',{code:error.code||'failed'});res.writeHead(503).end('Unavailable');}
  });
  await new Promise(resolve=>server.listen(port,'127.0.0.1',resolve));
  return {server,database,port:server.address().port};
}
if(typeof process!=='undefined'&&process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
  const fixture=process.argv.includes('--test-fixture');await startServer({fixture});console.log(fixture?'TEST DOUBLE ONLY — http://127.0.0.1:5186':'http://127.0.0.1:5186');
}
