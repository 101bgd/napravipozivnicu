import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';
import { createLocalRuntime } from '../scripts/local-runtime.mjs';
import { curatedTemplates } from '../src/curated-catalog.js';
import { recordUsage } from '../server/usage.js';
import { createEditorState } from '../src/editor-state.js';

const local=await createLocalRuntime(), origin='https://napravipozivnicu.com', template=curatedTemplates[0];
let browser;
const send=(data,headers={},url=origin)=>local.runtime.dispatchFetch(`${url}/api/usage`,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...headers},body:JSON.stringify(data)});
const action={templateId:template.id,event:'editor_open'};
try {
  const token=await local.token(),auth={'Cf-Access-Jwt-Assertion':token};
  assert.equal((await local.runtime.dispatchFetch(`${origin}/api/admin/statistics`)).status,401);
  assert.equal((await local.runtime.dispatchFetch(`${origin}/api/usage`)).status,405);
  for(const [body,headers,status] of [[{...action,names:'PRIVATE'}, {},400],[{...action,templateId:'unknown'}, {},400],[{...action,event:'arbitrary'}, {},400],[action,{Origin:'https://evil.invalid'},403],[action,{'Content-Type':'text/plain'},415],[{...action,private:'x'.repeat(600)}, {},413]])assert.equal((await send(body,headers)).status,status);
  assert.equal((await send(action,{},'https://preview.pages.dev')).status,403);
  for(const headers of [{DNT:'1'},{'Sec-GPC':'1'}])assert.equal((await send(action,headers)).status,204);
  const stats=async(days=30)=>{const r=await local.runtime.dispatchFetch(`${origin}/api/admin/statistics?days=${days}`,{headers:auth});assert.equal(r.headers.get('Cache-Control'),'no-store');return r;};
  assert.equal((await (await stats()).json()).rows.length,0);
  const responses=await Promise.all(Array.from({length:12},()=>send(action)));responses.forEach(r=>assert.equal(r.status,204));
  assert.equal((await (await stats()).json()).rows[0].total,12);
  assert.equal((await stats(8)).status,400);
  assert.deepEqual((await local.db.prepare('PRAGMA table_info(usage_daily)').all()).results.map(r=>r.name),['day','template_id','event','total']);
  await assert.rejects(()=>recordUsage(new Request(`${origin}/api/usage`,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(action)}),{},async()=>[]),e=>e.status===503);
  console.log('PASS API: authenticated statistics, same-origin allowlist, strict body, size limits, privacy signals, atomic concurrent counts, no personal-data columns, missing DB.');
  // Old aggregates are removed even if the first operation is a statistics read.
  const table=(await import('../server/usage.js')).usageStatistics;
  await local.db.prepare("INSERT INTO usage_daily VALUES ('2000-01-01', ?, 'editor_open', 123)").bind(template.id).run();
  await table(new Request(`${origin}/api/admin/statistics`),{DB:local.db});
  assert.equal(await local.db.prepare("SELECT * FROM usage_daily WHERE day='2000-01-01'").first(),null);
  const memory=new Map();let status='';const state=createEditorState({read:k=>memory.get(k),write:(k,v)=>memory.set(k,v),remove:k=>memory.delete(k),status:s=>status=s,historyChanged:()=>{}});
  state.start('one',{names:'A'});state.change({names:'B'},'names');state.change({names:'BC'},'names');assert.deepEqual(state.restore(),{names:'A'});assert.deepEqual(state.restore(true),{names:'BC'});state.save();state.start('two',{names:'X'});state.change({names:'Y'});state.save();assert.equal(JSON.parse(memory.get('invitation-one')).names,'BC');assert.equal(JSON.parse(memory.get('invitation-two')).names,'Y');assert.equal(state.clear(),true);state.save();assert.equal(memory.has('invitation-two'),false);
  console.log('PASS state: grouped undo/redo, local draft isolation and clear without immediate recreation.');

  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,acceptDownloads:true});
  const requests=[],errors=[];
  await context.route(`${origin}/**`,async route=>{
    const req=route.request();if(new URL(req.url()).pathname==='/api/usage')requests.push({body:req.postDataJSON(),headers:req.headers()});
    const response=await local.runtime.dispatchFetch(req.url(),{method:req.method(),headers:req.headers(),body:req.postDataBuffer()||undefined});
    await route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:Buffer.from(await response.arrayBuffer())});
  });
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  const open=async()=>{await page.locator('[data-open-template]').click();await page.waitForFunction(()=>document.querySelector('#editor')?.open);};
  await page.goto(`${origin}/pozivnice/${template.slug}/`);
  const actionBox=await page.locator('.detail-edit-action').boundingBox(),cardBox=await page.locator('.detail-preview .template-card').boundingBox();assert.ok(actionBox.y>=cardBox.y+cardBox.height);
  await page.evaluate(()=>document.querySelector('.detail-layout section h2').scrollIntoView());
  await page.waitForFunction(()=>document.querySelector('.detail-mobile-action').classList.contains('is-visible'));
  await page.locator('[data-detail-edit]').click();await page.waitForFunction(()=>document.querySelector('#editor')?.open);
  assert.equal(await page.locator('.detail-mobile-action').isVisible(),false);
  const canvasSmall=await page.locator('#editor-canvas').boundingBox();await page.locator('.preview-toggle').click();const canvasLarge=await page.locator('#editor-canvas').boundingBox();assert.ok(canvasLarge.height>canvasSmall.height+100);await page.locator('.preview-toggle').click();
  const first=page.locator('#panel-text input').first(),field=await first.getAttribute('name'),initial=await first.inputValue();
  const secret='QA privatno ČćŠšŽžĐđ';await first.fill(secret);await page.locator('.undo-edit').click();assert.equal(await first.inputValue(),initial);await page.locator('.redo-edit').click();assert.equal(await first.inputValue(),secret);
  await page.waitForFunction(id=>localStorage.getItem(`invitation-${id}`)?.includes('QA privatno'),template.id);
  await page.keyboard.press('Escape');await open();assert.equal(await first.inputValue(),secret);
  await first.fill('A'.repeat(400));await page.waitForFunction(()=>!document.querySelector('#text-warning').hidden);assert.equal(await first.getAttribute('aria-describedby'),'text-warning');
  await first.fill(secret);await page.waitForFunction(()=>document.querySelector('#text-warning').hidden);
  await first.focus();await page.evaluate(()=>{Object.defineProperty(visualViewport,'height',{value:420,configurable:true});visualViewport.dispatchEvent(new Event('resize'));});await page.waitForFunction(()=>document.querySelector('#editor').classList.contains('editor-keyboard'));assert.ok((await page.locator('#editor').boundingBox()).height<=420);assert.equal(await page.locator('.editor-mobile-action').isVisible(),false);await page.evaluate(()=>{delete visualViewport.height;visualViewport.dispatchEvent(new Event('resize'));});
  await page.locator('.jump-export').click();assert.equal(await page.locator('.export-png').evaluate(el=>el===document.activeElement),true);
  for(const kind of ['png','pdf']){
    const downloadEvent=page.waitForEvent('download');await page.locator(`.export-${kind}`).click();const download=await downloadEvent,path=await download.path(),bytes=await fs.readFile(path);
    assert.ok(bytes.length>10000);if(kind==='png'){assert.equal(bytes.readUInt32BE(16),1500);assert.equal(bytes.readUInt32BE(20),2100);}else{assert.equal(bytes.subarray(0,4).toString(),'%PDF');assert.match(bytes.toString('latin1'),/MediaBox\s*\[0 0 360\.?\d* 504\.?\d*\]/);}
  }
  await page.evaluate(()=>{window.originalToBlob=HTMLCanvasElement.prototype.toBlob;HTMLCanvasElement.prototype.toBlob=function(callback){callback(null);};});
  await page.locator('.export-png').click();await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('Preuzimanje nije uspelo'));assert.equal(await page.locator('.export-png').isEnabled(),true);
  await page.evaluate(()=>HTMLCanvasElement.prototype.toBlob=window.originalToBlob);
  await page.waitForFunction(()=>document.querySelector('.export-pdf').disabled===false);
  assert.equal(requests.filter(r=>r.body.event==='download_png').length,1);assert.equal(requests.filter(r=>r.body.event==='download_pdf').length,1);assert.equal(requests.filter(r=>r.body.event==='export_error').length,1);
  for(const r of requests){assert.deepEqual(Object.keys(r.body).sort(),['event','templateId']);assert.equal(r.body.templateId,template.id);assert.equal(JSON.stringify(r).includes(secret),false);assert.equal(r.headers.cookie,undefined);assert.equal(r.headers.referer,undefined);}
  await page.locator('.clear-draft').click();assert.equal(await page.locator('#autosave-draft').isChecked(),false);await page.keyboard.press('Escape');assert.equal(await page.evaluate(id=>localStorage.getItem(`invitation-${id}`),template.id),null);await open();assert.equal(await first.inputValue(),initial);
  await page.locator('#autosave-draft').check();await first.fill('Odmah zatvori');await page.keyboard.press('Escape');await open();assert.equal(await first.inputValue(),'Odmah zatvori');
  await page.evaluate(()=>{window.originalSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('Storage disabled','QuotaExceededError');};});
  await first.fill('Bez skladišta');await page.waitForFunction(()=>document.querySelector('#draft-status').textContent.includes('Čuvanje nije dostupno'));
  await page.route('**/api/usage',route=>route.abort());const retry=page.waitForEvent('download');await page.locator('.export-png').click();await retry;assert.equal(await page.locator('.export-png').isEnabled(),true);
  await page.evaluate(()=>Storage.prototype.setItem=window.originalSetItem);
  await page.keyboard.press('Escape');
  await page.evaluate(id=>localStorage.setItem(`invitation-${id}`,'{corrupt'),template.id);await open();assert.equal(await first.inputValue(),initial);
  await fs.mkdir('/workspace/artifacts/first-package',{recursive:true});
  for(const [width,height] of [[320,740],[390,844],[768,1024],[1440,1000],[390,430]]){
    await page.setViewportSize({width,height});await page.evaluate(()=>document.querySelector('.editor-body').scrollTop=0);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.equal(await page.locator('#editor').evaluate(el=>el.scrollWidth<=el.clientWidth),true);
    await page.screenshot({path:`/workspace/artifacts/first-package/editor-${width}-${height}.png`});
    await first.fill('Provera prikaza');const bounds=await first.boundingBox();assert.ok(bounds.y>=0&&bounds.y+bounds.height<=height);await page.locator('.close-editor').click();assert.equal(await page.locator('#editor').isVisible(),false);await open();
  }
  await page.keyboard.press('Escape');assert.deepEqual(errors,[]);
  console.log('PASS browser: mobile CTA, preview expansion, keyboard close, automatic restore/clear, undo/redo, long-text warning, PNG/PDF content, failed export retry, private payloads, blocked storage/network and 5 viewport sizes.');

  for(const signal of ['doNotTrack','globalPrivacyControl']){
  const privacy=await browser.newContext();await privacy.addInitScript(signal=>{Object.defineProperty(navigator,signal,{value:signal==='doNotTrack'?'1':true});},signal);let blocked=0;
  await privacy.route(`${origin}/**`,async route=>{if(route.request().url().endsWith('/api/usage'))blocked++;const r=await local.runtime.dispatchFetch(route.request().url());await route.fulfill({status:r.status,headers:Object.fromEntries(r.headers),body:Buffer.from(await r.arrayBuffer())});});
  const privatePage=await privacy.newPage();await privatePage.goto(`${origin}/pozivnice/${template.slug}/`);await privatePage.locator('[data-open-template]').click();await privatePage.waitForFunction(()=>document.querySelector('#editor')?.open);assert.equal(blocked,0);await privacy.close();}

  const admin=await browser.newContext({viewport:{width:390,height:844}});await admin.route(`${origin}/**`,async route=>{const req=route.request();const r=await local.runtime.dispatchFetch(req.url(),{method:req.method(),headers:{...req.headers(),...auth},body:req.postDataBuffer()||undefined});await route.fulfill({status:r.status,headers:Object.fromEntries(r.headers),body:Buffer.from(await r.arrayBuffer())});});
  const adminPage=await admin.newPage();await adminPage.goto(`${origin}/admin/sabloni/#statistika`);await adminPage.waitForSelector('.statistics-table table');assert.ok((await adminPage.locator('.statistics-totals').innerText()).includes('Preuzimanja pokrenuta'));assert.ok((await adminPage.locator('.statistics-table').innerText()).includes(template.name));assert.equal(await adminPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await adminPage.locator('#statistics-days').selectOption('7');await adminPage.waitForSelector('.statistics-table table');await adminPage.screenshot({path:'/workspace/artifacts/first-package/admin-statistics.png',fullPage:false});
  await adminPage.route('**/api/admin/statistics?*',route=>route.fulfill({status:503,contentType:'application/json',body:'{"error":"unavailable"}'}));await adminPage.locator('#statistics-refresh').click();await adminPage.waitForFunction(()=>document.querySelector('#statistics-result').textContent.includes('trenutno nije dostupna'));assert.equal(await adminPage.locator('#statistics-refresh').isEnabled(),true);
  console.log('PASS admin: protected live totals, per-template table, 7/30 day filtering, mobile layout and recoverable API failure. DNT and GPC stop client telemetry.');
} finally {await browser?.close();await local.runtime.dispose();}
