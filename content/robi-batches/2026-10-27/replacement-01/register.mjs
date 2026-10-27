import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {robiTemplates as oldTemplates} from '../../../../src/robi-catalog.js';
import {robiAssets as oldAssets} from '../../../../src/robi-assets.js';
const directory=fileURLToPath(new URL('./',import.meta.url)),root=path.resolve(directory,'../../../..');
const ids=JSON.parse(await fs.readFile(path.join(directory,'asset-ids.json'),'utf8'));
if(!ids.publicationPreparedAt){ids.publicationPreparedAt=new Date().toISOString();await fs.writeFile(path.join(directory,'asset-ids.json'),JSON.stringify(ids,null,2)+'\n');}
const {batchCatalog}=await import('./designs.mjs');
const target=path.join(root,'public/assets/pozivnice/robi/2026-10-27/replacement-01');
await fs.mkdir(target,{recursive:true});
const assets=new Map(oldAssets),catalog=oldTemplates.filter(t=>!ids.designs[t.id]),files=[];
const fontFiles=JSON.parse(await fs.readFile(path.join(directory,'font-assets.json'),'utf8'));
for(const f of fontFiles){assets.set(f.assetId,'/'+f.path.replace(/^public\//,''));files.push({path:f.path,id:f.assetId,bytes:f.bytes,sha256:f.sha256,role:'font'});}
for(const meta of batchCatalog){
 let thumbnail;
 for(const [kind,source,key]of [['background','backgrounds','background'],['thumbnail','previews','thumbnail']]){
  const bytes=await fs.readFile(path.join(directory,source,meta.id+'.webp'));
  const sha=createHash('sha256').update(bytes).digest('hex'),name=meta.id+'-'+kind+'-'+sha.slice(0,12)+'.webp';
  const dest=path.join(target,name);await fs.writeFile(dest,bytes);
  const url='/assets/pozivnice/robi/2026-10-27/replacement-01/'+name;assets.set(ids.designs[meta.id][key],url);
  if(kind==='thumbnail')thumbnail=url;
  files.push({path:path.relative(root,dest),id:ids.designs[meta.id][key],bytes:bytes.length,sha256:sha});
 }
 const prior=oldTemplates.find(t=>t.id===meta.id);
 catalog.push({...meta,updatedAt:ids.typographyUpdatedAt||prior?.updatedAt||ids.publicationPreparedAt,thumbnail});
}
await fs.writeFile(path.join(root,'src/robi-assets.js'),'// Stable public assets; existing entries preserved.\nexport const robiAssets = new Map('+JSON.stringify([...assets],null,2)+');\n');
await fs.writeFile(path.join(root,'src/robi-catalog.js'),'// Metadata only; editor, layouts and fonts remain lazy.\nexport const robiTemplates = '+JSON.stringify(catalog,null,2)+';\n');
const motifPath=path.join(root,'content/title-seo/motifs.json');
const motifRegistry=JSON.parse(await fs.readFile(motifPath,'utf8'));
for(const meta of batchCatalog)motifRegistry.motifs[meta.id]=meta.motif;
motifRegistry.updatedAt=ids.publicationPreparedAt;
await fs.writeFile(motifPath,JSON.stringify(motifRegistry,null,2)+'\n');
const designPath=path.join(root,'src/robi-designs.js');
let designSource=await fs.readFile(designPath,'utf8');
const importPath='../content/robi-batches/2026-10-27/replacement-01/designs.mjs';
if(!designSource.includes(importPath)){
 designSource=designSource.replace('export const robiBatches = [',"import {batchDesign as build27premium,batchAssetIds as assets27premium} from '"+importPath+"';\nexport const robiBatches = [{assets:assets27premium,build:build27premium},");
 await fs.writeFile(designPath,designSource);
}
await fs.writeFile(path.join(directory,'public-files.json'),JSON.stringify(files,null,2)+'\n');
console.log(JSON.stringify({templates:batchCatalog.length,newAssets:files.length,preservedOldTemplates:oldTemplates.length,publicationPreparedAt:ids.publicationPreparedAt}));

