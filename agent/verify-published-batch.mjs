import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const [manifestPath, outputPath] = process.argv.slice(2);
if (!manifestPath || !outputPath) throw new Error('Usage: node agent/verify-published-batch.mjs manifest.json output-directory');
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const required = ['first','eighteen','birthday','wedding','baptism','baby'];
assert.equal(manifest.designs.length, 6);
assert.deepEqual(manifest.designs.map(d => d.category).sort(), [...required].sort());
for (const d of manifest.designs) assert.equal(new URL(d.url).origin, 'https://napravipozivnicu.com');
const output = path.resolve(outputPath);
await fs.mkdir(output, {recursive:true});
const report = {
  batch:manifest.batch, startedAt:new Date().toISOString(), finishedAt:null,
  status:'checking', allSixVerified:false, productionModified:false,
  adFill:'NEPROVERENO', results:[]
};
const save = () => fs.writeFile(path.join(output,'public-verification.json'), JSON.stringify(report,null,2)+'\n');
await save();

let browser;
try {
  // Preserve enforced proxy policy; never try a direct route after a policy denial.
  const policy = JSON.parse(await fs.readFile('/etc/codex/network-policy.json','utf8'));
  assert.equal(policy.version,1,'Unsupported network policy snapshot');
  const http = policy.http_network_policy;
  const allowed = http?.type === 'unrestricted' ||
    (http?.type === 'restricted' && http.egress_rules?.some(r => r.host === 'napravipozivnicu.com'));
  if (!allowed) {
    report.status='blocked';
    report.blocker='Enforced network policy does not allow napravipozivnicu.com; configure allowed HTTPS destination before running live verification.';
    report.results=manifest.designs.map(d=>({...d,status:'NEPROVERENO',lastConfirmedStep:'manifest_loaded',reason:report.blocker}));
    process.exitCode=2;
  } else {
    const proxyValue=process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
    if(!proxyValue) throw new Error('Configured proxy is missing; no direct network fallback is permitted.');
    const proxyUrl=new URL(proxyValue);
    const proxy={server:proxyUrl.origin};
    if(proxyUrl.username) proxy.username=decodeURIComponent(proxyUrl.username);
    if(proxyUrl.password) proxy.password=decodeURIComponent(proxyUrl.password);
    browser=await chromium.launch({
      executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',
      headless:true,args:['--no-sandbox'],proxy
    });
    for(const d of manifest.designs) {
      const result={...d,status:'NEPROVERENO',lastConfirmedStep:'manifest_loaded',checks:{},browserErrors:[]};
      report.results.push(result); await save();
      const context=await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true});
      const page=await context.newPage();
      page.setDefaultTimeout(20000);
      page.on('pageerror',error=>result.browserErrors.push(error.message));
      try {
        const response=await page.goto(d.url,{waitUntil:'domcontentloaded',timeout:30000});
        result.httpStatus=response?.status();
        assert.equal(result.httpStatus,200);
        result.lastConfirmedStep='public_page_loaded';
        assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),d.url);
        result.title=await page.title(); assert.ok(result.title.trim());
        assert.equal(await page.locator('h1').count(),1);
        assert.ok((await page.locator('meta[name="description"]').getAttribute('content'))?.trim());
        const graphs=await page.locator('script[type="application/ld+json"]').allTextContents();
        assert.match(graphs.join('\n'),/BreadcrumbList/); assert.match(graphs.join('\n'),/ImageObject/);
        result.checks.pageAndSeo='PROŠLO';
        await page.locator('.detail-preview img').evaluate(img=>img.decode());
        const preview=await page.locator('.detail-preview img').evaluate(img=>({width:img.naturalWidth,height:img.naturalHeight}));
        assert.equal(preview.width*7,preview.height*5);
        result.previewDimensions=preview;
        result.checks.preview='PROŠLO';
        await page.locator('[data-open-template]').click();
        await page.waitForSelector('#editor[open]');
        if(d.category==='wedding'){
          await page.locator('input[name="bride"]').fill('Aleksandra');
          await page.locator('input[name="groom"]').fill('Konstantin');
        } else await page.locator('input[name="names"]').fill('Đorđe Čačić');
        if(d.category==='birthday') await page.locator('input[name="age"]').fill('10');
        await page.locator('[name="location"]').fill('Restoran Svečana sala\nBeograd — Čukarica');
        await page.evaluate(()=>document.fonts.ready);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        await page.screenshot({path:path.join(output,d.id+'-mobile.png'),fullPage:true});
        result.checks.mobileEditor='PROŠLO'; result.lastConfirmedStep='public_editor_edited';
        const pngEvent=page.waitForEvent('download'); await page.locator('.export-png').click();
        const pngPath=path.join(output,d.id+'.png'); await(await pngEvent).saveAs(pngPath);
        const png=await fs.readFile(pngPath);
        result.png={width:png.readUInt32BE(16),height:png.readUInt32BE(20),bytes:png.length};
        assert.equal(result.png.width,1500); assert.equal(result.png.height,2100);
        result.checks.png='PROŠLO';
        const pdfEvent=page.waitForEvent('download'); await page.locator('.export-pdf').click();
        const pdfPath=path.join(output,d.id+'.pdf'); await(await pdfEvent).saveAs(pdfPath);
        const pdf=await fs.readFile(pdfPath);
        const box=pdf.toString('latin1').match(/\/MediaBox\s*\[0 0 ([\d.]+) ([\d.]+)\]/);
        assert.ok(box); assert.ok(Math.abs(Number(box[1])-360)<.001); assert.ok(Math.abs(Number(box[2])-504)<.001);
        result.pdf={widthPoints:Number(box[1]),heightPoints:Number(box[2]),bytes:pdf.length};
        result.checks.pdf='PROŠLO'; result.lastConfirmedStep='public_png_pdf_downloaded';
        assert.deepEqual(result.browserErrors,[]);
        result.status='PROŠLO';
      } catch(error) {
        result.status='NEPROVERENO'; result.reason=error.message;
      } finally { await context.close(); await save(); }
    }
    const sitemap=await browser.newContext();
    try{
      const page=await sitemap.newPage();
      const response=await page.goto('https://napravipozivnicu.com/sitemap.xml',{timeout:30000});
      assert.equal(response?.status(),200);
      const xml=await response.text();
      for(const result of report.results){
        assert.ok(xml.includes(result.url),result.id+': sitemap URL missing');
        result.checks.sitemap='PROŠLO';
      }
      report.sitemap='PROŠLO';
    } finally {await sitemap.close();}
    report.allSixVerified=report.results.length===6 && report.results.every(r=>r.status==='PROŠLO') && report.sitemap==='PROŠLO';
    report.status=report.allSixVerified?'passed':'blocked';
    if(!report.allSixVerified) process.exitCode=2;
  }
} catch(error){
  report.status='blocked'; report.blocker=error.message; process.exitCode=2;
  for(const d of manifest.designs) if(!report.results.some(r=>r.id===d.id)) report.results.push({...d,status:'NEPROVERENO',lastConfirmedStep:'manifest_loaded',reason:report.blocker});
} finally {
  await browser?.close();
  report.finishedAt=new Date().toISOString(); await save();
  console.log(JSON.stringify({status:report.status,allSixVerified:report.allSixVerified,report:path.join(output,'public-verification.json')}));
}
