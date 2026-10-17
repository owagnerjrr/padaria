export function flatten(data) {
  const result={};
  for(const [store,values] of Object.entries(data.stores)) {
    for(const [key,value] of Object.entries(values.quantities)) result[JSON.stringify(['quantity',store,key])]=String(value);
    for(const key of Object.keys(values.selected)) result[JSON.stringify(['selected',store,key])]=true;
  }
  for(const item of data.catalog.added)result[JSON.stringify(['catalog','all',item.category+'|||'+item.name])]=true;
  for(const item of data.catalog.removed)result[JSON.stringify(['catalog','all',item.category+'|||'+item.name])]=false;
  for(const item of data.history)result[JSON.stringify(['history',item.store,item.id])]=item;
  return result;
}
export function diff(before,after) {
  return [...new Set([...Object.keys(before),...Object.keys(after)])]
    .filter(key=>JSON.stringify(before[key]??null)!==JSON.stringify(after[key]??null))
    .map(key=>({key,value:after[key]??null}));
}
export function materialize(entries,baseCatalog) {
  const data={stores:Object.fromEntries(['01','02','03','04'].map(s=>[s,{selected:{},quantities:{}}])),catalog:{added:[],removed:[]},history:[]};
  for(const [key,value] of Object.entries(entries)) {
    const [kind,store,itemKey]=JSON.parse(key);
    if(value===null)continue;
    if(kind==='quantity')data.stores[store].quantities[itemKey]=value;
    if(kind==='selected'&&value){const [category,name]=itemKey.split('|||');data.stores[store].selected[itemKey]={category,name,qty:''};}
    if(kind==='catalog'){
      const [category,name]=itemKey.split('|||');
      if(value===false)data.catalog.removed.push({category,name});
      else if(!baseCatalog[category]?.includes(name))data.catalog.added.push({category,name});
    }
    if(kind==='history')data.history.push(value);
  }
  for(const values of Object.values(data.stores)) {
    for(const item of data.catalog.removed){const key=item.category+'|||'+item.name;delete values.selected[key];delete values.quantities[key];}
    for(const [key,item] of Object.entries(values.selected))item.qty=values.quantities[key]??'';
  }
  data.history.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
  return data;
}
