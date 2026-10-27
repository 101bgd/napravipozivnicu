import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {robiTemplates} from '../../../src/robi-catalog.js';
import {robiAssets} from '../../../src/robi-assets.js';
import {curatedDesign} from '../../../src/curated-designs.js';
import {isRetiredTemplate} from '../../../src/retired-templates.js';
import {categoryPath} from '../../../src/seo-content.js';
import {createLocalRuntime} from '../../../scripts/local-runtime.mjs';
const removed=JSON.parse(await fs.readFile(new URL('./designs.json',import.meta.url)));
const paths=JSON.parse(await fs.readFile(new URL('./removed-paths.json',import.meta.url)));
assert.equal(robiTemplates.length,36);
for(const d of removed){assert.ok(!robiTemplates.some(t=>t.id===d.id));assert.equal(curatedDesign(d.id),null);assert.equal(isRetiredTemplate({id:d.id}),true);assert.equal(isRetiredTemplate({id:crypto.randomUUID(),builtinSource:d.id}),true);}
assert.equal(isRetiredTemplate({id:crypto.randomUUID(),name:removed[0].name,updatedAt:'2026-10-27T08:00:00Z'}),false,'future unrelated name reuse is preserved');
assert.ok(![...robiAssets.values()].some(p=>p.includes('/robi/2026-10-27/')));
for(const file of paths)await assert.rejects(fs.access(file));
const local=await createLocalRuntime();const results=[];
const request=path=>local.runtime.dispatchFetch('https://napravipozivnicu.com'+path);
try{
 const clones=[];let index=0;
 for(const d of removed){const id=crypto.randomUUID(),slug='retired-copy-'+index++,design={...d,id,builtinSource:d.id,layers:[]};await local.db.prepare('INSERT INTO templates (id,slug,name,category,draft_json,published_json,created_at,updated_at,published_at,version) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(id,slug,d.name,d.category,JSON.stringify(design),JSON.stringify(design),'2026-10-27T07:00:00Z','2026-10-27T07:00:00Z','2026-10-27T07:00:00Z',1).run();clones.push({id,slug});}
 const kept=robiTemplates[0],keptId=crypto.randomUUID(),keptDesign={...curatedDesign(kept.id),id:keptId,builtinSource:kept.id};
 await local.db.prepare('INSERT INTO templates (id,slug,name,category,draft_json,published_json,created_at,updated_at,published_at,version) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(keptId,'preserved-copy',kept.name,kept.category,JSON.stringify(keptDesign),JSON.stringify(keptDesign),'2026-10-27T07:00:00Z','2026-10-27T07:00:00Z','2026-10-27T07:00:00Z',1).run();
 const catalog=await(await request('/api/catalog')).json(),map=await(await request('/sitemap.xml')).text();
 for(const d of removed){
  assert.ok(!catalog.templates.some(t=>t.id===d.id||t.slug===d.slug));assert.ok(!map.includes(d.slug));
  assert.equal((await request('/api/templates/'+d.id)).status,404);assert.equal((await request('/pozivnice/'+d.slug+'/')).status,404);
  const html=await(await request(categoryPath(d.category))).text();assert.ok(!html.includes(d.slug));
  const asset=paths.find(p=>p.startsWith('public/')&&p.includes(d.id));assert.equal((await request('/'+asset.slice('public/'.length))).status,404);
  results.push({id:d.id,catalog:'PROŠLO',category:'PROŠLO',sitemap:'PROŠLO',page404:'PROŠLO',api404:'PROŠLO',asset404:'PROŠLO'});
 }
 for(const c of clones){assert.ok(!catalog.templates.some(t=>t.id===c.id));assert.equal((await request('/api/templates/'+c.id)).status,404);assert.equal((await request('/pozivnice/'+c.slug+'/')).status,404);assert.ok(!map.includes(c.slug));}
 assert.ok(catalog.templates.some(t=>t.id===keptId));assert.equal((await request('/pozivnice/preserved-copy/')).status,200);
 // Public reads must hide retired copies without mutating their database rows.
 assert.equal((await local.db.prepare('SELECT COUNT(*) AS n FROM templates').first()).n,7);
 await local.db.prepare('INSERT INTO settings (key,value) VALUES (?,?)').bind('retired-templates:2026-10-16','complete').run();
 const token=await local.token();const cleanup=await local.runtime.dispatchFetch('https://napravipozivnicu.com/api/admin/maintenance/retired-templates',{method:'POST',headers:{'Cf-Access-Jwt-Assertion':token,Origin:'https://napravipozivnicu.com','X-Requested-With':'template-studio'}});
 assert.equal(cleanup.status,200);assert.equal((await cleanup.json()).removed,6);assert.equal((await local.db.prepare('SELECT COUNT(*) AS n FROM templates').first()).n,1);
 await fs.writeFile(new URL('./checks.json',import.meta.url),JSON.stringify({status:'PROŠLO',designs:results,publishedAdminCopiesHidden:6,unrelatedCopyPreserved:true,publicReadsDoNotMutateDatabase:true,authenticatedCleanupDeletesOnlyTargets:true,cleanupTestWasLocal:true,productionD1MutationPerformed:false},null,2)+'\n');
 console.log('PASS: all6 absent from catalog/categories/sitemap/assets; pages/API return404,6admin copies hidden; authenticated local cleanup removes6 and preserves unrelated copy.');
}finally{await local.runtime.dispose();}
