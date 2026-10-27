import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {preview} from 'vite';
import {chromium} from 'playwright';
import {getBatchDesigns} from './designs.mjs';

const directory=fileURLToPath(new URL('./',import.meta.url));
const root=path.resolve(directory,'../../..');
const runtime=await preview({root,preview:{host:'127.0.0.1',port:0},logLevel:'error'});
const origin=`http://127.0.0.1:${runtime.httpServer.address().port}`;
const evidence=[];let browser;
try{
 browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const design of getBatchDesigns()){
  await page.goto(`${origin}/pozivnice/${design.slug}/`);
  await page.locator('[data-open-template]').click();
  await page.waitForSelector('#editor[open]');
  const fonts=await page.evaluate(async design=>{
   await document.fonts.ready;
   return design.fonts.map(f=>({name:f.name,family:f.family,loaded:document.fonts.check(`16px "${f.family}"`),faceStatus:[...document.fonts].find(face=>face.family===f.family)?.status}));
  },design);
  assert.ok(fonts.every(f=>f.loaded&&f.faceStatus==='loaded'),design.id+' actual font load');
  await page.locator('.preview-toggle').click();
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const screenshot=`${design.id}-mobile-expanded.png`;
  await page.screenshot({path:path.join(directory,'previews',screenshot)});
  const box=await page.locator('#editor-canvas').boundingBox();
  assert.ok(box.width>=260&&box.width<=390,design.id+' expanded preview width');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  evidence.push({id:design.id,viewport:[390,844],fonts,expandedPreviewBox:box,screenshot,status:'PROŠLO'});
  await page.keyboard.press('Escape');
 }
 assert.deepEqual(errors,[]);
 await fs.writeFile(path.join(directory,'font-browser-checks.json'),JSON.stringify({checkedAt:new Date().toISOString(),designs:evidence,browserErrors:errors},null,2)+'\n');
 console.log('PASS: all six new font pairs loaded in the real editor; six 390px expanded mobile previews captured.');
}finally{await browser?.close();await new Promise(resolve=>runtime.httpServer.close(resolve));}
