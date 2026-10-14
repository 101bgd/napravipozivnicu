import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

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
  assert.equal(await staticPage.locator('.template-card h3').count(), 12);
  assert.equal(await staticPage.locator('h1').count(), 1);
  assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'), 'https://napravipozivnicu.com/pozivnice/');
  await staticPage.goto(`${origin}/pozivnice-za-prvi-rodjendan/`);
  assert.match(await staticPage.locator('h1').innerText(), /prvi rođendan/i);
  assert.equal(await staticPage.locator('.template-card h3').count(), 2);
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
  const originalThumbnail = await page.locator('[data-canvas="olive"]').evaluate(canvas => canvas.toDataURL());
  await page.locator('.category-tabs [data-category="wedding"]').click();
  await page.locator('.category-tabs [data-category="all"]').click();
  assert.equal(await page.locator('[data-canvas="olive"]').evaluate(canvas => canvas.toDataURL()), originalThumbnail,
    'Filtering must preserve a previously rendered preview');

  await page.locator('[data-template="olive"]').first().click();
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
  assert.deepEqual(errors, []);

  console.log(`PASS: landing/catalog/category HTML without JS, ${landingGzip}/${catalogGzip} bytes landing/catalog initial JS gzip (<10 KB each), lazy editor/PDF, all scrolled previews, filter cache, repeatable editor drawing.`);
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
