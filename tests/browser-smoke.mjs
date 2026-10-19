import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { publicTemplates } from '../src/curated-catalog.js';
import { INFO_PAGES } from '../src/info-content.js';
import { categoryPath } from '../src/seo-content.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'http://127.0.0.1:5175';
const server = spawn(process.execPath, [
  fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url)),
  '--host', '127.0.0.1', '--port', '5175', '--strictPort',
], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
let serverOutput = '', browser;
server.stdout.on('data', data => serverOutput += data);
server.stderr.on('data', data => serverOutput += data);
const categoryButton = (page, category) => page.locator(`.category-tabs [data-category="${category}"]`);

try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw new Error(serverOutput);
    try { if ((await fetch(origin)).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, 'Development server did not start');
  for (const infoPage of INFO_PAGES) {
    const response = await fetch(`${origin}${infoPage.path}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes(`<h1>${infoPage.title}</h1>`), 'Development routes render information pages instead of the homepage');
    assert.ok(html.includes(`href="https://napravipozivnicu.com${infoPage.path}"`));
  }
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    headless: true, args: ['--no-sandbox'],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator('h1').count(), 1);
  assert.match(await page.locator('h1').innerText(), /Mali poziv[\s\S]*Veliki trenutak/i);
  assert.equal(await page.locator('.hero-cta').getAttribute('href'), '/pozivnice/');
  await page.screenshot({ path: '/tmp/napravi-desktop.png', fullPage: true });
  await page.locator('.hero-cta').click();
  await page.waitForURL(`${origin}/pozivnice/`);
  assert.equal(await page.locator('.template-card').count(), publicTemplates.length);
  await page.goBack();
  await page.waitForURL(`${origin}/`);
  assert.ok(await page.locator('.hero-cta').isVisible(), 'Browser Back should return to the landing page');
  await page.locator('.hero-cta').click();
  await page.waitForURL(`${origin}/pozivnice/`);

  for (const category of ['first', 'eighteen', 'birthday', 'wedding', 'baptism', 'baby']) {
    await categoryButton(page, category).click();
    assert.equal(await page.locator('.template-card').count(), publicTemplates.filter(t => t.category === category).length);
    await page.waitForURL(`${origin}${categoryPath(category)}`);
    assert.equal(await categoryButton(page, category).getAttribute('aria-current'), 'page');
  }
  await categoryButton(page, 'all').click();
  await page.locator('#search').fill('Nezno cvece');
  assert.equal(await page.locator('.template-card').count(), 1);
  await page.locator('#search').fill('nepostoji');
  assert.equal(await page.locator('.empty-state').count(), 1);
  await page.locator('#clear-search').click();
  assert.equal(await page.locator('.template-card').count(), publicTemplates.length);
  assert.ok(await page.locator('#search').evaluate(input => input === document.activeElement), 'Clearing an empty result must keep keyboard focus on the search field');
  await page.locator('[data-template="bloom"]').first().click();
  await page.waitForFunction(() => document.querySelector('#editor')?.open);
  await page.locator('input[name="names"]').fill('Milena & Stefan');
  await page.locator('input[name="title"]').fill('Slavimo ljubav');
  await page.locator('textarea[name="note"]').fill('Radujemo se proslavi sa vama!');
  await page.locator('[data-panel="style"]').click();
  await page.locator('[data-color="#29392f"]').click();
  await page.locator('select[name="font"]').selectOption('italic');
  await page.locator('[data-panel="photo"]').click();
  const photo = await page.evaluate(() => {
    const canvas = document.createElement('canvas'); canvas.width = 600; canvas.height = 400;
    const context = canvas.getContext('2d'); context.fillStyle = '#c69681'; context.fillRect(0, 0, 300, 400);
    context.fillStyle = '#324b3a'; context.fillRect(300, 0, 300, 400);
    return canvas.toDataURL('image/png').split(',')[1];
  });
  await page.locator('#photo-upload').setInputFiles({ name: 'fotografija.png', mimeType: 'image/png', buffer: Buffer.from(photo, 'base64') });
  await page.waitForSelector('#photo-options:not([hidden])');
  await page.locator('input[name="photoZoom"]').evaluate(input => {
    input.value = 160; input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  const rect = await page.locator('#editor-canvas').boundingBox();
  await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height * 285 / 700);
  await page.mouse.down();
  await page.mouse.move(rect.x + rect.width / 2 + 25, rect.y + rect.height * 285 / 700);
  await page.mouse.up();
  assert.notEqual(await page.locator('input[name="photoX"]').inputValue(), '50');
  await page.screenshot({ path: '/tmp/napravi-editor.png', fullPage: true });
  await page.locator('.save-draft').click();
  const pngPromise = page.waitForEvent('download');
  await page.locator('.export-png').click();
  const png = await pngPromise; await png.saveAs('/tmp/napravi-export.png');
  const pngBytes = await fs.readFile('/tmp/napravi-export.png');
  assert.equal(pngBytes.readUInt32BE(16), 1500); assert.equal(pngBytes.readUInt32BE(20), 2100);
  const pdfPromise = page.waitForEvent('download');
  await page.locator('.export-pdf').click();
  const pdf = await pdfPromise; await pdf.saveAs('/tmp/napravi-export.pdf');
  const pdfBytes = await fs.readFile('/tmp/napravi-export.pdf');
  assert.ok(pdfBytes.toString('latin1').startsWith('%PDF'));
  const box = pdfBytes.toString('latin1').match(/\/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/);
  assert.ok(box); assert.ok(Math.abs(Number(box[1]) - 360) < .001); assert.ok(Math.abs(Number(box[2]) - 504) < .001);
  await page.locator('.close-editor').click();
  await page.locator('[data-template="bloom"]').first().click();
  await page.waitForFunction(() => document.querySelector('#editor')?.open);
  assert.equal(await page.locator('input[name="names"]').inputValue(), 'Milena & Stefan');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#editor').evaluate(dialog => dialog.open), false);

  for (const viewport of [{ width: 320, height: 740 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(viewport);
    await page.goto(origin);
    await page.evaluate(() => document.fonts.ready);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Landing overflows at ${viewport.width}px`);
    const cta = await page.locator('.hero-cta').boundingBox();
    assert.ok(cta && cta.y >= 0 && cta.y + cta.height <= viewport.height, `Primary CTA should be visible without scrolling at ${viewport.width}px`);
    if (viewport.width === 390) {
      await page.screenshot({ path: '/tmp/napravi-mobile.png', fullPage: true });
      await page.screenshot({ path: '/tmp/napravi-mobile-top.png' });
      await page.locator('.menu-toggle').click();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      assert.ok(await page.locator('.menu-toggle').evaluate(button => button === document.activeElement));
      await page.locator('.menu-toggle').click();
      await page.locator('.navigation a[href="/#how"]').click();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      await page.goto(origin);
    }
    await page.locator('.hero-cta').click();
    await page.waitForURL(`${origin}/pozivnice/`);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Catalog overflows at ${viewport.width}px`);
    assert.equal(await page.locator('.template-card').count(), publicTemplates.length);
    await categoryButton(page, 'birthday').click();
    assert.equal(await page.locator('.template-card').count(), 4);
    if (viewport.width === 390) await page.screenshot({ path: '/tmp/napravi-mobile-catalog.png', fullPage: true });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${origin}/pozivnice/`);
  await page.locator('[data-template="dino-avantura"]').first().click();
  await page.waitForFunction(() => document.querySelector('#editor')?.open);
  await page.locator('input[name="names"]').fill('Lena');
  assert.ok(await page.locator('#editor').evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth));
  await page.screenshot({ path: '/tmp/napravi-mobile-editor.png', fullPage: true });
  await page.keyboard.press('Escape');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(origin);
  await page.evaluate(() => document.fonts.ready);
  const reducedMotionState = await page.evaluate(() => {
    const hero = document.querySelector('.hero') || document.querySelector('main');
    return {
      longRunning: hero.getAnimations({ subtree: true }).filter(animation => {
        const timing = animation.effect.getComputedTiming();
        return animation.playState === 'running' && (timing.iterations === Infinity || timing.duration > 500);
      }).length,
      headingOpacity: Number(getComputedStyle(document.querySelector('h1')).opacity),
      ctaOpacity: Number(getComputedStyle(document.querySelector('.hero-cta')).opacity),
    };
  });
  assert.equal(reducedMotionState.longRunning, 0, 'Reduced motion must stop long-running hero animations');
  assert.ok(reducedMotionState.headingOpacity > 0 && reducedMotionState.ctaOpacity > 0, 'Reduced motion must leave key content visible');
  assert.deepEqual(errors, []);
  console.log(`PASS: landing CTA and browser Back, ${publicTemplates.length} templates, 6 category landing pages and native navigation, search/empty state, text/style edits, photo upload/drag/zoom, local draft restore, 1500×2100 PNG, 127×177.8 mm PDF, 320/390/768/1440px layouts, mobile menu/editor, reduced motion, no browser errors.`);
} finally {
  await browser?.close(); server.kill('SIGTERM');
}
