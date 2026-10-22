import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';
import { createLocalRuntime } from '../scripts/local-runtime.mjs';
import { publicTemplates } from '../src/curated-catalog.js';
import { CATEGORY_CONTENT, categoryPath } from '../src/seo-content.js';
import { INFO_PAGES } from '../src/info-content.js';
import { GUIDE_HUB, GUIDES } from '../src/guide-catalog.js';
import { newDesign } from '../src/template-schema.js';
import { GOOGLE_TAG, GOOGLE_TAG_ID, GOOGLE_TAG_URL, applyGoogleTag } from '../server/google-tag.js';

const origin='https://napravipozivnicu.com',publisher='ca-pub-6151181163851577';
const paths=['/','/pozivnice/',...Object.keys(CATEGORY_CONTENT).map(categoryPath),...INFO_PAGES.map(p=>p.path),...[GUIDE_HUB,...GUIDES].map(p=>p.path),...publicTemplates.map(t=>`/pozivnice/${t.slug||t.id}/`)];
const local=await createLocalRuntime();let browser;
const worker=(path,init={})=>local.runtime.dispatchFetch(`${origin}${path}`,init);
const count=(text,needle)=>text.split(needle).length-1;
function checkTags(html,path){
  assert.ok(html.includes(`<head>\n${GOOGLE_TAG}\n`),`${path}: tag must immediately follow head`);
  const head=html.match(/<head>([\s\S]*?)<\/head>/)[1];
  assert.equal(count(html,`src="${GOOGLE_TAG_URL}"`),1,path);
  assert.equal(count(html,`gtag('config', '${GOOGLE_TAG_ID}')`),1,path);
  assert.equal(count(html,`src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisher}"`),1,path);
  assert.ok(head.includes(`crossorigin="anonymous"`));
  assert.ok(head.includes(`name="google-adsense-account" content="${publisher}"`));
  assert.equal(applyGoogleTag(html,true),html,'Repeated rendering must not duplicate the tag');
  assert.ok(Buffer.byteLength(html.slice(0,html.indexOf('<meta charset')))<1024,'Character encoding stays in the first 1024 bytes');
}
try{
  const htmlPages=new Map(),links=new Set(),images=new Set();
  for(const path of paths){
    const alias=await worker(`${path}index.html?izvor=provera`,{redirect:'manual'});assert.equal(alias.status,301);assert.equal(alias.headers.get('Location'),`${origin}${path}?izvor=provera`);await alias.arrayBuffer();
    const response=await worker(path);assert.equal(response.status,200,path);assert.match(response.headers.get('Content-Type'),/text\/html/);assert.equal(response.headers.get('X-Robots-Tag'),null);
    const html=await response.text();htmlPages.set(path,html);checkTags(html,path);
    assert.equal((html.match(/<h1\b/g)||[]).length,1,path);assert.equal(count(html,'rel="canonical"'),1,path);
    assert.ok(html.includes(`rel="canonical" href="${origin}${path}"`),path);
    assert.doesNotMatch(html,/<meta[^>]+name="robots"[^>]+noindex/i,path);
    for(const info of INFO_PAGES)assert.ok(html.includes(`href="${info.path}"`),`${path}: footer includes ${info.path}`);
    for(const match of html.matchAll(/<a\b[^>]*href="(\/[^" ]*)"/g))links.add(new URL(match[1].replaceAll('&amp;','&'),origin).pathname);
    for(const match of html.matchAll(/<img\b[^>]*src="(\/[^" ]*)"/g))images.add(match[1]);
    const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]||'';
    assert.ok(main.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,'').trim().length>300,`${path}: content available without JS`);
  }
  for(const path of links){assert.ok(htmlPages.has(path),`Unlisted internal page ${path}`);}
  for(const path of images){const r=await worker(path,{method:'HEAD'});assert.equal(r.status,200,path);assert.match(r.headers.get('Content-Type'),/^image\//);await r.arrayBuffer();}
  const sitemap=await (await worker('/sitemap.xml')).text();const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);assert.equal(urls.length,paths.length);for(const path of paths)assert.ok(urls.includes(`${origin}${path}`));
  const robots=await (await worker('/robots.txt')).text();assert.match(robots,/Allow: \/\n/);assert.doesNotMatch(robots,/Disallow: \/\n/);assert.match(robots,/Disallow: \/admin\//);assert.match(robots,/Sitemap: https:\/\/napravipozivnicu.com\/sitemap.xml/);
  assert.equal(await (await worker('/ads.txt')).text(),'google.com, pub-6151181163851577, DIRECT, f08c47fec0942fa0\n');
  assert.ok(htmlPages.get('/kontakt/').includes('mailto:kontakt@napravipozivnicu.com'));
  assert.match(htmlPages.get('/politika-privatnosti/'),/Google Analytics 4/);assert.doesNotMatch(htmlPages.get('/politika-privatnosti/'),/Sajt ne koristi Google Analytics/);
  console.log(`PASS audit: ${paths.length} crawlable public pages and index.html redirects, one GA4 and one AdSense loader per head, canonical URLs, sitemap, robots, footer information pages, contact address and ${images.size} working preview images.`);

  const design=newDesign(),id=crypto.randomUUID(),slug='qa-novi-dinamicki-sablon',now=new Date().toISOString();
  await local.db.prepare('INSERT INTO templates (id,slug,name,category,draft_json,published_json,created_at,updated_at,published_at) VALUES (?,?,?,?,?,?,?,?,?)').bind(id,slug,design.name,design.category,JSON.stringify(design),JSON.stringify(design),now,now,now).run();
  checkTags(await (await worker(`/pozivnice/${slug}/`)).text(),'new admin publication');
  await local.db.prepare('DELETE FROM templates WHERE id=?').bind(id).run();
  const www=await local.runtime.dispatchFetch('https://www.napravipozivnicu.com/');checkTags(await www.text(),'www');
  for(const host of ['preview.pages.dev','localhost','unrelated.invalid']){const r=await local.runtime.dispatchFetch(`https://${host}/`);const html=await r.text();assert.equal(html.includes(GOOGLE_TAG_URL),false);assert.equal(html.includes('pagead2.googlesyndication.com'),false);}
  const auth={'Cf-Access-Jwt-Assertion':await local.token()};
  for(const path of ['/admin/sabloni/','/api/catalog','/pozivnice/nema-ove-pozivnice/']){const r=await worker(path,{headers:auth});if(path.includes('nema-'))assert.equal(r.status,404);const body=await r.text();assert.equal(body.includes(GOOGLE_TAG_URL),false);assert.equal(body.includes('pagead2.googlesyndication.com'),false);}
  assert.equal((await worker('/admin/sabloni/')).status,401);
  const head=await worker('/',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
  console.log('PASS routing: future admin publications and www receive both tags; admin/API/404 and preview hosts do not.');

  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
  const context=await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true}),requests=[],errors=[];let blocked=false;
  await context.route('**/*',async route=>{
    const req=route.request(),url=new URL(req.url());
    if(url.origin===origin){const r=await local.runtime.dispatchFetch(req.url(),{method:req.method(),headers:req.headers(),body:req.postDataBuffer()||undefined});await route.fulfill({status:r.status,headers:Object.fromEntries(r.headers),body:Buffer.from(await r.arrayBuffer())});}
    else if(url.href===GOOGLE_TAG_URL||url.hostname==='pagead2.googlesyndication.com'){
      requests.push(url.href);if(blocked)return route.abort('blockedbyclient');
      return route.fulfill({contentType:'text/javascript',body:url.href===GOOGLE_TAG_URL?'window.__gaLoads=(window.__gaLoads||0)+1;':'window.__adLoads=(window.__adLoads||0)+1;'});
    }else await route.abort();
  });
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin);assert.equal(await page.evaluate(()=>window.__gaLoads),1);assert.equal(await page.evaluate(()=>window.__adLoads),1);
  assert.equal(await page.evaluate(()=>document.head.firstElementChild.src),GOOGLE_TAG_URL);
  let commands=await page.evaluate(()=>window.dataLayer.map(item=>Array.from(item)));
  assert.equal(commands.length,2);assert.equal(commands[0][0],'js');assert.deepEqual(commands[1],['config',GOOGLE_TAG_ID]);
  const template=publicTemplates.find(t=>t.style!=='custom');assert.ok(template);
  await page.goto(`${origin}/pozivnice/${template.slug||template.id}/`);await page.locator('[data-open-template]').click();await page.waitForFunction(()=>document.querySelector('#editor')?.open);
  const sentinel='Privatni tekst provere';await page.locator('[name="names"]').fill(sentinel);
  for(const kind of ['png','pdf']){const ready=page.waitForEvent('download');await page.locator(`.export-${kind}`).click();const download=await ready,bytes=await fs.readFile(await download.path());if(kind==='png'){assert.equal(bytes.readUInt32BE(16),1500);assert.equal(bytes.readUInt32BE(20),2100);}else assert.equal(bytes.subarray(0,4).toString(),'%PDF');}
  commands=await page.evaluate(()=>window.dataLayer.map(item=>Array.from(item)));assert.equal(commands.length,2);assert.equal(JSON.stringify(commands).includes(sentinel),false);
  assert.equal(await page.locator('script[src*="/gtag/js"]').count(),1);assert.equal(await page.locator('script[src*="adsbygoogle.js"]').count(),1);
  await page.keyboard.press('Escape');await page.reload();assert.equal(await page.evaluate(()=>window.__gaLoads),1);assert.equal(await page.evaluate(()=>window.dataLayer.filter(item=>item[0]==='config').length),1);
  blocked=true;await page.reload();await page.locator('[data-open-template]').click();await page.waitForFunction(()=>document.querySelector('#editor')?.open);await page.locator('[name="names"]').fill('Radi i bez Google skripti');assert.equal(await page.locator('[name="names"]').inputValue(),'Radi i bez Google skripti');
  await page.keyboard.press('Escape');await page.goto(`${origin}/kontakt/`);assert.equal(await page.locator('h1').innerText(),'Kontakt');assert.deepEqual(errors,[]);
  console.log('PASS browser: one GA4 config per document/reload, independent async Google loaders, no editor data added to dataLayer, functional PNG/PDF and usable site when Google scripts are blocked. No real Google requests.');
}finally{await browser?.close();await local.runtime.dispose();}
