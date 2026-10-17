import {test} from 'node:test';
import assert from 'node:assert/strict';
import {flatten,diff,materialize} from '../sync-core.js';
const key='Doces|||Arroz doce';
function sample(){return {stores:Object.fromEntries(['01','02','03','04'].map(s=>[s,{selected:{},quantities:{}}])),catalog:{added:[],removed:[]},history:[]};}
test('quantidades independem da seleção e da loja',()=>{
  const data=sample();data.stores['02'].quantities[key]='10';
  const result=materialize(flatten(data),{});
  assert.equal(result.stores['02'].quantities[key],'10');
  assert.equal(result.stores['01'].quantities[key],undefined);
  assert.deepEqual(result.stores['02'].selected,{});
});
test('desmarcar altera apenas seleção, preservando quantidade',()=>{
  const a=sample();a.stores['02'].quantities[key]='10';a.stores['02'].selected[key]={name:'Arroz doce',category:'Doces',qty:'10'};
  const b=structuredClone(a);b.stores['02'].selected={};
  assert.deepEqual(diff(flatten(a),flatten(b)),[{key:JSON.stringify(['selected','02',key]),value:null}]);
});
test('zerar quantidades preserva marcações',()=>{
  const data=sample();data.stores['02'].selected[key]={};
  assert.equal(materialize(flatten(data),{}).stores['02'].selected[key].qty,'');
});
test('alterações em campos diferentes não substituem a loja inteira',()=>{
  const data=sample();const base=flatten(data);data.stores['01'].quantities[key]='3';
  const changes=diff(base,flatten(data));assert.equal(changes.length,1);
  const remote={[JSON.stringify(['quantity','04',key])]:'5'};
  for(const op of changes)remote[op.key]=op.value;
  const result=materialize(remote,{});assert.equal(result.stores['01'].quantities[key],'3');assert.equal(result.stores['04'].quantities[key],'5');
});
test('catálogo compartilhado e exclusão removem quantidades nas quatro lojas',()=>{
  const data=sample();data.catalog.removed=[{category:'Doces',name:'Arroz doce'}];
  for(const values of Object.values(data.stores)){values.quantities[key]='10';values.selected[key]={};}
  const result=materialize(flatten(data),{Doces:['Arroz doce']});
  for(const values of Object.values(result.stores)){assert.deepEqual(values.selected,{});assert.deepEqual(values.quantities,{});}
});
test('histórico por ID não duplica ao aplicar snapshots repetidos',()=>{
  const data=sample();data.history=[{id:'a',store:'02',createdAt:1,items:[]},{id:'b',store:'01',createdAt:2,items:[]}];
  const first=materialize(flatten(data),{});const second=materialize(flatten(first),{});
  assert.equal(second.history.length,2);assert.equal(second.history[0].id,'b');
});
test('nenhuma escrita para snapshots sem mudança',()=>{const data=flatten(sample());assert.deepEqual(diff(data,data),[]);});
