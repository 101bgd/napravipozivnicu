import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import {preview} from 'vite';
async function createReviewServer(){const runtime=await preview({root:path.resolve(directory,'../../..'),preview:{host:'127.0.0.1',port:0},logLevel:'error'});return {server:{close:()=>new Promise(resolve=>runtime.httpServer.close(resolve))},origin:`http://127.0.0.1:${runtime.httpServer.address().port}`};}
import {getBatchDesigns,batchCatalog} from './designs.mjs';
const batchDesigns=getBatchDesigns();

const directory=fileURLToPath(new URL('./',import.meta.url));
const reports=JSON.parse(await fs.readFile(path.join(directory,'report.json'),'utf8'));
assert.equal(reports.length,6);assert.equal(new Set(reports.map(r=>r.category)).size,6);
for(const r of reports){assert.equal(r.defaultCheck.passed,true,`${r.id}: podrazumevani tekst`);assert.equal(r.longTextCheck.passed,true,`${r.id}: duži tekst`);assert.ok(r.fontsLoaded.every(f=>f.loaded));}
const {server,origin}=await createReviewServer();let browser;
const checks=[];
try{
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  for(const template of batchCatalog){
    const html=await(await fetch(`${origin}/pozivnice/${template.slug}/`)).text();
    assert.ok(html.includes(template.seoTitle));assert.ok(html.includes(template.imageAlt));
    assert.ok(html.includes(`https://napravipozivnicu.com/pozivnice/${template.slug}/`));
    assert.match(html,/BreadcrumbList/);assert.match(html,/ImageObject/);
    await page.goto(`${origin}/pozivnice/${template.slug}/`);
    await page.locator('[data-open-template]').click();await page.waitForSelector('#editor[open]');
    assert.equal(await page.locator('#tab-photo').isVisible(),false);
    const before=await page.locator('#editor-canvas').evaluate(canvas=>canvas.toDataURL());
    if(template.category==='wedding'){
      await page.locator('input[name="bride"]').fill('Aleksandra');await page.locator('input[name="groom"]').fill('Konstantin');
    }else await page.locator('input[name="names"]').fill('Đurđina');
    if(template.category==='birthday'){await page.locator('input[name="age"]').fill('10');}
    const place=page.locator('[name="location"]');await place.fill('Restoran Svečana sala\nBeograd');
    await page.waitForFunction(previous=>document.querySelector('#editor-canvas').toDataURL()!==previous,before);
    const pngDownload=page.waitForEvent('download');await page.locator('.export-png').click();
    const pngPath=path.join(directory,`examples/${template.id}-editor.png`);await(await pngDownload).saveAs(pngPath);
    const png=await fs.readFile(pngPath);assert.equal(png.readUInt32BE(16),1500);assert.equal(png.readUInt32BE(20),2100);
    const densityOffset=png.indexOf(Buffer.from('pHYs'));assert.ok(densityOffset>0);assert.equal(png.readUInt32BE(densityOffset+4),11811);assert.equal(png.readUInt32BE(densityOffset+8),11811);assert.equal(png[densityOffset+12],1);
    const pdfDownload=page.waitForEvent('download');await page.locator('.export-pdf').click();
    const pdfPath=path.join(directory,`examples/${template.id}-editor.pdf`);await(await pdfDownload).saveAs(pdfPath);
    const pdf=await fs.readFile(pdfPath),box=pdf.toString('latin1').match(/\/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/);
    assert.ok(box);assert.ok(Math.abs(Number(box[1])-360)<.001);assert.ok(Math.abs(Number(box[2])-504)<.001);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.screenshot({path:path.join(directory,`previews/${template.id}-mobile.png`),fullPage:true});
    await page.keyboard.press('Escape');
    checks.push({id:template.id,seo:'passed',mobileEditor:'passed',nameEditing:'passed',age10Editing:template.category==='birthday'?'passed':'not_applicable',png:{width:1500,height:2100,bytes:png.length},pdf:{widthPoints:360,heightPoints:504,bytes:pdf.length},browserErrors:errors.slice()});
    console.log(`PASS: ${template.name} — SEO, mobilni editor, izmena teksta, PNG i PDF.`);
  }
  assert.deepEqual(errors,[]);
  const siteMap=await(await fetch(`${origin}/sitemap.xml`)).text();for(const t of batchCatalog)assert.ok(siteMap.includes(t.slug));
  await fs.writeFile(path.join(directory,'browser-checks.json'),JSON.stringify(checks,null,2)+'\n');
  const forbidden=batchDesigns.filter(d=>d.category==='baby').some(d=>/babine|бабине/i.test(JSON.stringify(d)));assert.equal(forbidden,false);
  console.log('PASS: svih šest kategorija, proverene margine/kontrast/duži tekst, sitemap i formulacija proslave rođenja.');
}finally{await browser?.close();await server.close();}

