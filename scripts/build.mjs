import {mkdir,copyFile,cp,writeFile} from 'node:fs/promises';
const names=['apiKey','authDomain','projectId','appId'];
const config=Object.fromEntries(names.map(name=>[name,process.env['FIREBASE_'+name.replace(/[A-Z]/g,x=>'_'+x).toUpperCase()]||'']));
config.workspace=process.env.VERCEL_ENV==='preview'?'preview':'production';
if(names.some(name=>config[name])&&!names.every(name=>config[name]))throw Error('Configuração Firebase incompleta');
await mkdir('dist',{recursive:true});
for(const name of ['index.html','styles.css','app.js','sync.js','sync-core.js'])await copyFile(name,'dist/'+name);
await cp('assets','dist/assets',{recursive:true});
await writeFile('dist/firebase-config.js','export default '+JSON.stringify(config)+';\n');
