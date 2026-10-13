import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const server=spawn(process.execPath,[fileURLToPath(new URL('../node_modules/vite/bin/vite.js',import.meta.url)),'--host','127.0.0.1','--port','5175','--strictPort'],{cwd:root,stdio:['ignore','pipe','pipe']});
let serverOutput='';server.stdout.on('data',d=>serverOutput+=d);server.stderr.on('data',d=>serverOutput+=d);
let browser;
try {
  let ready=false;
  for(let i=0;i<100;i++){if(server.exitCode!==null)throw new Error(serverOutput);try{const r=await fetch('http://127.0.0.1:5175');if(r.ok){ready=true;break;}}catch{}await new Promise(resolve=>setTimeout(resolve,100));}
  assert.ok(ready,'Development server did not start');
browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5175');await page.evaluate(()=>document.fonts.ready);
await page.screenshot({path:'/tmp/napravi-desktop.png',fullPage:true});
assert.equal(await page.locator('.template-card').count(),12);
for(const category of ['first','eighteen','birthday','wedding','baptism','baby']) {await page.locator(`[data-category="${category}"]`).click();assert.equal(await page.locator('.template-card').count(),2);}
await page.locator('[data-category="all"]').click();await page.locator('#search').fill('Maslinova');assert.equal(await page.locator('.template-card').count(),1);
await page.locator('#search').fill('nepostoji');assert.equal(await page.locator('.empty-state').count(),1);await page.locator('#clear-search').click();assert.equal(await page.locator('.template-card').count(),12);
await page.locator('[data-template="olive"]').first().click();assert.equal(await page.locator('#editor').evaluate(el=>el.open),true);
await page.locator('input[name="names"]').fill('Milena & Stefan');await page.locator('input[name="title"]').fill('Slavimo ljubav');await page.locator('textarea[name="note"]').fill('Radujemo se proslavi sa vama!');
await page.locator('[data-panel="style"]').click();await page.locator('[data-color="#29392f"]').click();await page.locator('select[name="font"]').selectOption('italic');
await page.locator('[data-panel="photo"]').click();
const photo=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=600;c.height=400;const x=c.getContext('2d');x.fillStyle='#c69681';x.fillRect(0,0,300,400);x.fillStyle='#324b3a';x.fillRect(300,0,300,400);return c.toDataURL('image/png').split(',')[1];});
await page.locator('#photo-upload').setInputFiles({name:'fotografija.png',mimeType:'image/png',buffer:Buffer.from(photo,'base64')});await page.waitForSelector('#photo-options:not([hidden])');
await page.locator('input[name="photoZoom"]').evaluate(el=>{el.value=160;el.dispatchEvent(new Event('input',{bubbles:true}));});
const rect=await page.locator('#editor-canvas').boundingBox();await page.mouse.move(rect.x+rect.width/2,rect.y+rect.height*285/700);await page.mouse.down();await page.mouse.move(rect.x+rect.width/2+25,rect.y+rect.height*285/700);await page.mouse.up();assert.notEqual(await page.locator('input[name="photoX"]').inputValue(),'50');
await page.screenshot({path:'/tmp/napravi-editor.png',fullPage:true});
await page.locator('.save-draft').click();
const pngPromise=page.waitForEvent('download');await page.locator('.export-png').click();const png=await pngPromise;await png.saveAs('/tmp/napravi-export.png');const pngBytes=await fs.readFile('/tmp/napravi-export.png');assert.equal(pngBytes.readUInt32BE(16),1500);assert.equal(pngBytes.readUInt32BE(20),2100);
const pdfPromise=page.waitForEvent('download');await page.locator('.export-pdf').click();const pdf=await pdfPromise;await pdf.saveAs('/tmp/napravi-export.pdf');const pdfBytes=await fs.readFile('/tmp/napravi-export.pdf');assert.ok(pdfBytes.toString('latin1').startsWith('%PDF'));const box=pdfBytes.toString('latin1').match(/\/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/);assert.ok(box);assert.ok(Math.abs(Number(box[1])-360)<.001);assert.ok(Math.abs(Number(box[2])-504)<.001);
await page.locator('.close-editor').click();await page.locator('[data-template="olive"]').first().click();assert.equal(await page.locator('input[name="names"]').inputValue(),'Milena & Stefan');await page.keyboard.press('Escape');assert.equal(await page.locator('#editor').evaluate(el=>el.open),false);
await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:5175');await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:'/tmp/napravi-mobile.png',fullPage:true});await page.screenshot({path:'/tmp/napravi-mobile-top.png'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await page.locator('.navigation a[href="#templates"]').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
await page.locator('[data-template="little-sun"]').first().click();await page.locator('input[name="names"]').fill('Lena');assert.ok(await page.locator('#editor').evaluate(el=>el.scrollWidth<=el.clientWidth));await page.screenshot({path:'/tmp/napravi-mobile-editor.png',fullPage:true});await page.keyboard.press('Escape');
assert.deepEqual(errors,[]);console.log('PASS: 12 templates, 6 category filters, search/empty state, text/style edits, photo upload/drag/zoom, local draft restore, 1500×2100 PNG, 127×177.8 mm PDF, mobile layout/menu/editor, Escape, no browser errors.');
} finally {await browser?.close();server.kill('SIGTERM');}
