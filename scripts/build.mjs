import {mkdir,copyFile,cp,rm} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const name of ['index.html','styles.css','app.js','sync.js','sync-core.js','sync-client.js'])await copyFile(name,'dist/'+name);
await cp('assets','dist/assets',{recursive:true});
await rm('dist/firebase-config.js',{force:true});
