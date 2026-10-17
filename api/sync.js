import {productionStore} from '../server/firestore-store.js';
import {createHandler} from '../server/handler.js';
const handler=createHandler({store:productionStore,allowInitialize:process.env.NOEL_ALLOW_INITIAL_IMPORT==='true'});
export function GET(request){return handler(request);}
export function POST(request){return handler(request);}
