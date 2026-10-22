import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createServer} from 'vite';
import {chromium} from 'playwright';
import {getBatchDesigns,backgroundId} from './designs.mjs';
const root=process.cwd(),dir=path.join(root,'content/robi-batches/2026-10-22');
const server=await createServer({root,configFile:false,server:{host:'127.0.0.1',port:0,fs:{allow:[root,await fs.realpath(path.join(root,'node_modules'))]}},logLevel:'error'});
let browser;
try{
 await server.listen();
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844},acceptDownloads:true}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/__robi-editor',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="toast"></div><script id="catalog-data" type="application/json">{"templates":[]}</script></body></html>'}));
 await page.route('**/media/'+backgroundId,r=>r.fulfill({contentType:'image/webp',path:path.join(dir,'backgrounds/paunova-elegancija.webp')}));
 await page.route('**/api/usage',r=>r.fulfill({status:204}));
 await page.goto('http://127.0.0.1:'+server.httpServer.address().port+'/__robi-editor');
 await page.evaluate(async design=>{
  const {templates}=await import('/src/catalog-state.js');templates.push(design);
  const {openEditor}=await import('/src/editor.js');await openEditor(design.id,null);
 },getBatchDesigns()[0]);
 await page.waitForSelector('#editor[open]');
 await page.waitForFunction(()=>document.querySelector('#editor-canvas').width>0);
 await page.screenshot({path:path.join(dir,'previews/paunova-elegancija-mobile.png'),fullPage:true});
 await page.locator('[name="bride"]').fill('Aleksandra');
 await page.locator('[name="groom"]').fill('Konstantin');
 await page.locator('[name="location"]').fill('Restoran Svečana sala\nKneza Miloša 12, Beograd');
 await page.locator('[name="ceremony_location"]').fill('Crkva Svetog Save\nKrušedolska 2, Beograd');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 const pngEvent=page.waitForEvent('download');await page.locator('.export-png').click();
 const pngPath=path.join(dir,'examples/paunova-elegancija-editor.png');await(await pngEvent).saveAs(pngPath);
 const png=await fs.readFile(pngPath);assert.equal(png.readUInt32BE(16),1500);assert.equal(png.readUInt32BE(20),2100);
 const pdfEvent=page.waitForEvent('download');await page.locator('.export-pdf').click();
 const pdfPath=path.join(dir,'examples/paunova-elegancija-editor.pdf');await(await pdfEvent).saveAs(pdfPath);
 const pdf=await fs.readFile(pdfPath),box=pdf.toString('latin1').match(/\/MediaBox\s*\[0 0 ([\d.]+) ([\d.]+)\]/);
 assert.ok(box);assert.ok(Math.abs(Number(box[1])-360)<.001);assert.ok(Math.abs(Number(box[2])-504)<.001);
 assert.deepEqual(errors,[]);
 await page.screenshot({path:path.join(dir,'previews/paunova-elegancija-mobile-long-text.png'),fullPage:true});
 const result={id:'paunova-elegancija',scope:'local_editor_using_existing_project_components',mobile:'PROŠLO',editableFields:'PROŠLO',longText:'PROŠLO',png:{width:1500,height:2100,bytes:png.length},pdf:{widthPoints:360,heightPoints:504,bytes:pdf.length},browserErrors:errors,productionModified:false,completedAt:new Date().toISOString()};
 await fs.writeFile(path.join(dir,'wedding-browser-checks.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{await browser?.close();await server.close();}

