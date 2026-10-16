import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { publicTemplates } from '../src/curated-catalog.js';
import { birthdayTemplates } from '../src/birthday-catalog.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'http://127.0.0.1:5178';
const server = spawn(process.execPath, [
  fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url)),
  'preview', '--host', '127.0.0.1', '--port', '5178', '--strictPort',
], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
let output = '', browser;
server.stdout.on('data', data => output += data);
server.stderr.on('data', data => output += data);

try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw new Error(output);
    try { if ((await fetch(origin)).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, 'Production preview did not start');
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    args: ['--no-sandbox'],
  });

  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  await staticPage.goto(origin);
  assert.match(await staticPage.locator('h1').innerText(), /Mali poziv[\s\S]*Veliki trenutak/i);
  assert.equal(await staticPage.locator('.hero-cta').getAttribute('href'), '/pozivnice/');
  assert.equal(await staticPage.locator('.faq details').count(), 5);
  assert.equal(await staticPage.locator('#template-grid').count(), 0, 'The landing page should lead to a dedicated catalog');
  await staticPage.locator('.hero-cta').click();
  await staticPage.waitForURL(`${origin}/pozivnice/`);
  assert.equal(await staticPage.locator('.template-card h3').count(), publicTemplates.length);
  assert.equal(await staticPage.locator('h1').count(), 1);
  assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'), 'https://napravipozivnicu.com/pozivnice/');
  await staticPage.goto(`${origin}/pozivnice-za-rodjendan/`);
  assert.match(await staticPage.locator('h1').innerText(), /dečiji rođendan/i);
  assert.equal(await staticPage.locator('.template-card h3').count(), 4);
  await noJs.close();

  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [], scripts = new Set();
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    const path = new URL(request.url()).pathname;
    if (path.endsWith('.js')) scripts.add(path);
  });
  const initialScriptSize = async label => {
    assert.equal([...scripts].some(path => /editor-|jspdf/.test(path)), false,
      `Editor and PDF code must not load with the ${label}`);
    let bytes = 0;
    for (const path of scripts) bytes += gzipSync(await fs.readFile(`${root}dist${path}`)).length;
    assert.ok(bytes < 10_000, `${label} initial JS gzip budget exceeded: ${bytes} bytes`);
    return bytes;
  };
  await page.goto(origin);
  await page.evaluate(() => document.fonts.ready);
  const landingGzip = await initialScriptSize('landing');
  scripts.clear();
  await page.locator('.hero-cta').click();
  await page.waitForURL(`${origin}/pozivnice/`);
  await page.evaluate(() => document.fonts.ready);
  const catalogGzip = await initialScriptSize('catalog');
  assert.ok(await page.locator('[data-canvas][data-rendered]').count() < 12,
    'Do not draw the whole catalog on a phone before scrolling');

  for (const canvas of await page.locator('[data-canvas]').all()) {
    await canvas.scrollIntoViewIfNeeded();
    await page.waitForFunction(id => {
      const canvas = document.querySelector(`[data-canvas="${id}"]`);
      return canvas.dataset.rendered === 'true' &&
        canvas.getContext('2d').getImageData(250, 350, 1, 1).data[3] === 255;
    }, await canvas.getAttribute('data-canvas'));
  }
  const originalThumbnail = await page.locator('[data-canvas="bloom"]').evaluate(canvas => canvas.toDataURL());
  await page.locator('.category-tabs [data-category="baptism"]').click();
  await page.locator('.category-tabs [data-category="all"]').click();
  assert.equal(await page.locator('[data-canvas="bloom"]').evaluate(canvas => canvas.toDataURL()), originalThumbnail,
    'Filtering must preserve a previously rendered preview');

  await page.locator('[data-template="bloom"]').first().click();
  await page.waitForFunction(() => document.querySelector('#editor')?.open);
  assert.ok([...scripts].some(path => /editor-/.test(path)));
  assert.equal([...scripts].some(path => /jspdf/.test(path)), false);
  const finishDrawing = () => page.evaluate(() => new Promise(resolve =>
    requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await finishDrawing();
  const initialPreview = await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL());
  const names = page.locator('input[name="names"]');
  const initialNames = await names.inputValue();
  await names.fill('Probni tekst');
  await finishDrawing();
  assert.notEqual(await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL()), initialPreview);
  await names.fill(initialNames);
  await finishDrawing();
  assert.equal(await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL()), initialPreview,
    'Repeated draws must not accumulate transforms or leave old text behind');
  await page.keyboard.press('Escape');

  // The shipped wedding design must work without a database or an admin upload.
  await page.goto(`${origin}/pozivnice/ponocna-elegancija/`);
  assert.equal(await page.locator('h1').innerText(), 'Ponoćna elegancija');
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://napravipozivnicu.com/pozivnice/ponocna-elegancija/');
  const metadata = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  assert.ok(metadata['@graph'].some(item => item['@type'] === 'ImageObject'));
  const design = await (await fetch(`${origin}/api/templates/ponocna-elegancija`)).json();
  assert.equal(design.layers.filter(layer => layer.type === 'photo').length, 0);
  await page.locator('[data-open-template]').click();
  await page.waitForFunction(() => document.querySelector('#editor')?.open);
  assert.equal(await page.locator('#tab-photo').isVisible(), false);
  assert.equal(await page.locator('#panel-text [name]').count(), 11);
  assert.ok(await page.evaluate(family => [...document.fonts].some(font => font.family === family && font.status === 'loaded'), design.fonts[0].family));
  await page.locator('input[name="bride"]').fill('Anđela');
  await page.locator('input[name="groom"]').fill('Đorđe');
  const weddingDownload = page.waitForEvent('download');
  await page.locator('.export-png').click();
  await (await weddingDownload).saveAs('/tmp/napravi-wedding-published.png');
  const weddingPng = await fs.readFile('/tmp/napravi-wedding-published.png');
  assert.equal(weddingPng.readUInt32BE(16), 1500); assert.equal(weddingPng.readUInt32BE(20), 2100);
  await page.keyboard.press('Escape');
  console.log('PASS: shipped wedding design, stable SEO URL, custom font, no photo field, editable names with Serbian diacritics and actual PNG export.');
  for (const birthday of birthdayTemplates) {
    await page.goto(`${origin}/pozivnice/${birthday.slug}/`);
    assert.equal(await page.locator('h1').innerText(), birthday.name);
    assert.equal(await page.title(), birthday.seoTitle);
    assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), birthday.description);
    assert.equal(await page.locator('.detail-preview img').getAttribute('alt'), birthday.imageAlt);
    const layout = await (await fetch(`${origin}/api/templates/${birthday.id}`)).json();
    assert.equal(layout.layers.some(layer => layer.type === 'photo'), false);
    await page.locator('[data-open-template]').click();
    await page.waitForFunction(() => document.querySelector('#editor')?.open);
    assert.equal(await page.locator('#tab-photo').isVisible(), false);
    await page.locator('input[name="names"]').fill('Đorđe');
    await page.locator('input[name="age"]').fill('7');
    await page.locator('input[name="location"]').fill('Igraonica Čarolija, Niš');
    for (const font of layout.fonts) assert.ok(await page.evaluate(family => [...document.fonts].some(face => face.family === family && face.status === 'loaded'), font.family));
    const pngDownload = page.waitForEvent('download'); await page.locator('.export-png').click();
    await (await pngDownload).saveAs(`/tmp/${birthday.id}-export.png`);
    const pngBytes = await fs.readFile(`/tmp/${birthday.id}-export.png`);
    assert.equal(pngBytes.readUInt32BE(16), 1500); assert.equal(pngBytes.readUInt32BE(20), 2100);
    const pdfDownload = page.waitForEvent('download'); await page.locator('.export-pdf').click();
    await (await pdfDownload).saveAs(`/tmp/${birthday.id}-export.pdf`);
    const pdfBytes = await fs.readFile(`/tmp/${birthday.id}-export.pdf`);
    assert.ok(pdfBytes.toString('latin1').startsWith('%PDF'));
    const box = pdfBytes.toString('latin1').match(/\/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/);
    assert.ok(box && Math.abs(Number(box[1])-360)<.001 && Math.abs(Number(box[2])-504)<.001);
    assert.ok(await page.locator('#editor').evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth));
    await page.keyboard.press('Escape');
  }
  const map = await fs.readFile(`${root}dist/sitemap.xml`, 'utf8');
  for (const birthday of birthdayTemplates) assert.ok(map.includes(`/pozivnice/${birthday.slug}/`));
  for (const id of ['olive', 'vows', 'confetti', 'garden', 'little-sun', 'moon']) assert.equal(map.includes(`/pozivnice/${id}/`), false);
  console.log('PASS: four birthday designs have unique SEO text, descriptive image alt, editable age/name, loaded fonts, no photo slot, mobile layouts and valid PNG/PDF downloads; removed examples are absent from the sitemap.');
  assert.deepEqual(errors, []);

  console.log(`PASS: landing/catalog/category HTML without JS, ${landingGzip}/${catalogGzip} bytes landing/catalog initial JS gzip (<10 KB each), lazy editor/PDF, all scrolled previews, filter cache, repeatable editor drawing.`);
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
