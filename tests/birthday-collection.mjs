import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';
import { createLocalRuntime } from '../scripts/local-runtime.mjs';
import { birthdayCollectionTemplates as templates } from '../src/birthday-collection-catalog.js';

const origin = 'https://napravipozivnicu.com';
const local = await createLocalRuntime();
let browser;
const errors = [];
const request = (path, headers = {}) => local.runtime.dispatchFetch(`${origin}${path}`, { headers });
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  async function context(options = {}) {
    const ctx = await browser.newContext(options);
    await ctx.route('**/*', async route => {
      const req = route.request();
      assert.equal(new URL(req.url()).origin, origin);
      const response = await local.runtime.dispatchFetch(req.url(), {
        method: req.method(), headers: req.headers(), body: req.postDataBuffer() || undefined,
      });
      await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: Buffer.from(await response.arrayBuffer()) });
    });
    ctx.on('page', page => page.on('pageerror', error => errors.push(error.message)));
    return ctx;
  }
  const noJs = await context({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  const sitemap = await (await request('/sitemap.xml')).text();
  for (const template of templates) {
    await staticPage.goto(`${origin}/pozivnice/${template.slug}/`);
    assert.equal(await staticPage.title(), template.seoTitle);
    assert.equal(await staticPage.locator('meta[name="description"]').getAttribute('content'), template.description);
    assert.equal(await staticPage.locator('.detail-preview img').getAttribute('alt'), template.imageAlt);
    assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'), `${origin}/pozivnice/${template.slug}/`);
    assert.equal(await staticPage.locator('.ad-placement[hidden]').count(), 1);
    const graph = JSON.parse(await staticPage.locator('script[type="application/ld+json"]').textContent())['@graph'];
    assert.ok(graph.some(item => item['@type'] === 'ImageObject' && item.caption === template.imageAlt));
    assert.ok(graph.some(item => item['@type'] === 'BreadcrumbList'));
    assert.ok(sitemap.includes(`/pozivnice/${template.slug}/`));
  }
  await noJs.close();
  const ctx = await context({ viewport: { width: 320, height: 740 } });
  const page = await ctx.newPage();
  const finishDrawing = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  for (const template of templates) {
    await page.goto(`${origin}/pozivnice/${template.slug}/`);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    const layout = await (await request(`/api/templates/${template.id}`)).json();
    assert.equal(layout.layers.some(layer => layer.type === 'photo'), false);
    await page.locator('[data-open-template]').click();
    await page.waitForFunction(() => document.querySelector('#editor')?.open);
    await finishDrawing();
    assert.equal(await page.locator('#tab-photo').isVisible(), false);
    for (const font of layout.fonts) assert.ok(await page.evaluate(family => [...document.fonts].some(face => face.family === family && face.status === 'loaded'), font.family));
    const before = await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL());
    await page.locator('input[name="names"]').fill('Đorđe');
    await page.locator('input[name="age"]').fill('9');
    await page.locator('textarea[name="location"]').fill('Igraonica Čarolija\nCvetna 8, Niš');
    await page.locator('textarea[name="note"]').fill('Torta, igra i smeh!\nDođi da slavimo zajedno!');
    await finishDrawing();
    assert.notEqual(await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL()), before);
    await page.locator('.save-draft').click();
    await page.keyboard.press('Escape');
    await page.locator('[data-open-template]').click();
    await page.waitForFunction(() => document.querySelector('#editor')?.open);
    assert.equal(await page.locator('input[name="names"]').inputValue(), 'Đorđe');
    assert.equal(await page.locator('input[name="age"]').inputValue(), '9');
    assert.equal(await page.locator('textarea[name="location"]').inputValue(), 'Igraonica Čarolija\nCvetna 8, Niš');
    const pngDownload = page.waitForEvent('download');
    await page.locator('.export-png').click();
    await (await pngDownload).saveAs(`/tmp/birthday-collection-${template.id}.png`);
    const png = await fs.readFile(`/tmp/birthday-collection-${template.id}.png`);
    assert.equal(png.readUInt32BE(16), 1500); assert.equal(png.readUInt32BE(20), 2100);
    const pdfDownload = page.waitForEvent('download');
    await page.locator('.export-pdf').click();
    await (await pdfDownload).saveAs(`/tmp/birthday-collection-${template.id}.pdf`);
    const pdf = (await fs.readFile(`/tmp/birthday-collection-${template.id}.pdf`)).toString('latin1');
    assert.ok(pdf.startsWith('%PDF'));
    const box = pdf.match(/\/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/);
    assert.ok(box && Math.abs(Number(box[1]) - 360) < .001 && Math.abs(Number(box[2]) - 504) < .001);
    assert.ok(await page.locator('#editor').evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth));
    await page.keyboard.press('Escape');
  }
  const auth = { 'Cf-Access-Jwt-Assertion': await local.token() };
  const adminCtx = await context({ extraHTTPHeaders: auth });
  const admin = await adminCtx.newPage();
  await admin.goto(`${origin}/admin/sabloni/`);
  await admin.locator('[data-action="edit-curated"][data-id="biserna-bajka"]').click();
  await admin.waitForFunction(() => document.querySelector('[data-meta="name"]')?.value === 'Biserna bajka' && !document.querySelector('[data-action="save"]').disabled);
  await admin.locator('[data-prop="text"]').fill('Anđela');
  await admin.locator('[data-action="save"]').click();
  await admin.waitForFunction(() => document.querySelector('#save-state')?.textContent === 'Nacrt' && !document.querySelector('[data-action="save"]').disabled);
  const draft = (await (await request('/api/admin/templates', auth)).json()).templates.find(t => t.draft.builtinSource === 'biserna-bajka');
  assert.ok(draft && !draft.published);
  assert.equal((await request(`/media/${draft.draft.backgroundId}`)).status, 404);
  await admin.locator('[data-action="publish"]').click();
  await admin.waitForFunction(() => document.querySelector('[data-action="unpublish"]') && !document.querySelector('[data-action="save"]').disabled);
  const catalog = (await (await request('/api/catalog')).json()).templates.filter(t => t.slug === draft.slug);
  assert.equal(catalog.length, 1);
  assert.equal(catalog[0].id, draft.id);
  const published = await (await request(`/api/templates/${draft.id}`)).json();
  assert.equal(published.layers.find(layer => layer.field === 'names').text, 'Anđela');
  assert.equal(published.layers.some(layer => layer.type === 'photo'), false);
  assert.deepEqual(errors, []);
  console.log('PASS: four birthday variants have crawlable SEO/image metadata, sitemap entries, ad slots, loaded fonts, editable mobile layouts, saved drafts and actual PNG/PDF downloads. Admin cloning preserves shared assets and publishes at the same URL.');
} finally {
  await browser?.close();
  await local.runtime.dispose();
}
