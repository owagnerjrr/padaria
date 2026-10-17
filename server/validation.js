export class HttpError extends Error {
  constructor(status,message){super(message);this.status=status;}
}
const categories=new Set(['Doces','Salgados','Sabores','Caseiros','Hortifrúti','Açougue','Pizzas']);
const stores=new Set(['01','02','03','04']);
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const text=(value,max)=>typeof value==='string'&&value.length>0&&value.length<=max&&!/[\u0000-\u001f<>]/.test(value);
function product(key){
  if(typeof key!=='string')throw new HttpError(400,'Produto inválido');
  const parts=key.split('|||');
  if(parts.length!==2||!categories.has(parts[0])||!text(parts[1],120))throw new HttpError(400,'Produto inválido');
  return parts;
}
export function validateOperation(op){
  if(!object(op)||Object.keys(op).some(k=>!['key','value','base','operation'].includes(k)))throw new HttpError(400,'Operação inválida');
  if(!Number.isSafeInteger(op.base)||op.base<0||typeof op.operation!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(op.operation)||typeof op.key!=='string'||op.key.length>800)throw new HttpError(400,'Revisão ou identificador inválido');
  let parts;try{parts=JSON.parse(op.key);}catch{throw new HttpError(400,'Chave inválida');}
  if(!Array.isArray(parts)||parts.length!==3||JSON.stringify(parts)!==op.key)throw new HttpError(400,'Chave inválida');
  const [kind,store,item]=parts;
  if(!['quantity','selected','catalog','code','history'].includes(kind)||!((kind==='catalog'||kind==='code')?store==='all':stores.has(store)))throw new HttpError(400,'Loja ou campo inválido');
  if(kind!=='history')product(item);
  if(kind==='quantity'&&op.value!==null&&!(typeof op.value==='string'&&op.value.length<=24&&(op.value===''||/^\d+(?:[.,]\d+)?$/.test(op.value))&&Number(op.value.replace(',','.'))<=1000000))throw new HttpError(400,'Quantidade inválida');
  if(kind==='code'&&op.value!==null&&!(typeof op.value==='string'&&op.value.length>0&&op.value.length<=32&&/^[A-Za-z0-9._\/-]+$/.test(op.value)))throw new HttpError(400,'Código inválido');
  if(kind==='selected'&&![true,null].includes(op.value))throw new HttpError(400,'Seleção inválida');
  if(kind==='catalog'&&![true,false,null].includes(op.value))throw new HttpError(400,'Catálogo inválido');
  if(kind==='history'){
    const v=op.value;
    if(!text(item,500)||!object(v)||v.id!==item||v.store!==store||!text(v.date,100)||!Number.isFinite(v.createdAt??0)||!Number.isSafeInteger(v.count)||v.count<1||v.count>500||!Number.isFinite(v.units)||v.units<0||!Array.isArray(v.items)||v.items.length!==v.count)throw new HttpError(400,'Conferência inválida');
    if(Object.keys(v).some(k=>!['id','store','date','createdAt','count','units','items'].includes(k)))throw new HttpError(400,'Campo de conferência inválido');
    for(const item of v.items){
      if(!object(item)||Object.keys(item).some(k=>!['category','name','qty'].includes(k)))throw new HttpError(400,'Item de conferência inválido');
      product(item.category+'|||'+item.name);
      const qty=String(item.qty??'');if(qty.length>24||(qty!==''&&(!/^\d+(?:[.,]\d+)?$/.test(qty)||Number(qty.replace(',','.'))>1000000)))throw new HttpError(400,'Quantidade do histórico inválida');
    }
    if(op.base!==0)throw new HttpError(400,'O histórico é imutável');
  }
  if(JSON.stringify(op.value).length>120000)throw new HttpError(413,'Registro muito grande');
  return op;
}
export function validateBatch(body,initial=false){
  if(!object(body)||Object.keys(body).some(k=>!['operations','initialize'].includes(k))||!Array.isArray(body.operations)||body.operations.length>(initial?450:32)||(!initial&&!body.operations.length))throw new HttpError(400,'Lote inválido');
  if('initialize' in body&&typeof body.initialize!=='boolean')throw new HttpError(400,'Confirmação inválida');
  const keys=new Set();
  for(const op of body.operations){validateOperation(op);if(keys.has(op.key))throw new HttpError(400,'Chave repetida no lote');keys.add(op.key);if(initial&&op.base!==0)throw new HttpError(400,'Importação inválida');}
  return body.operations;
}
