import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { chromium } from 'playwright';
import { createLocalRuntime, root } from '../scripts/local-runtime.mjs';
import { publicTemplates } from '../src/curated-catalog.js';
import { curatedDesign } from '../src/curated-designs.js';
import { latestTemplates } from '../src/latest-templates.js';

// Out-of-order dates, simultaneous batches and absent categories must not
// turn this into six cards from whichever category was updated last.
const fixtures = [
  { id: 'old', category: 'birthday', updatedAt: '2026-01-01' },
  { id: 'new', category: 'birthday', updatedAt: '2026-02-01' },
  { id: 'same-batch', category: 'birthday', updatedAt: '2026-02-01' },
  { id: 'invalid', category: 'birthday', updatedAt: 'invalid' },
  { id: 'wedding', category: 'wedding', updatedAt: '2026-03-01' },
  { id: 'unclassified', category: 'unknown', updatedAt: '2026-04-01' },
];
assert.deepEqual(latestTemplates(fixtures).map(t => t.id), ['wedding', 'new']);
assert.equal(fixtures[0].id, 'old');

const origin = 'https://napravipozivnicu.com';
const local = await createLocalRuntime();
const request = path => local.runtime.dispatchFetch(`${origin}${path}`);
const errors = [], scripts = new Set();
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  async function context(options = {}) {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', ...options });
    await ctx.route('**/*', async route => {
      const req = route.request();
      assert.equal(new URL(req.url()).origin, origin, 'The section needs no third-party services');
      const response = await local.runtime.dispatchFetch(req.url(), { method: req.method(), headers: req.headers(), body: req.postDataBuffer() || undefined });
      assert.ok(response.ok, `${response.status}: ${req.url()}`);
      await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: Buffer.from(await response.arrayBuffer()) });
    });
    ctx.on('page', page => page.on('pageerror', error => errors.push(error.message)));
    return ctx;
  }
  const noJs = await context({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  async function assertSection(page, expected = 6) {
    const cards = page.locator('.latest-card');
    assert.equal(await cards.count(), expected);
    const names = await cards.locator('h3').allTextContents();
    const hrefs = await cards.locator('.latest-link').evaluateAll(links => links.map(a => a.getAttribute('href')));
    const categoryNames = await cards.locator('.latest-category').allTextContents();
    assert.equal(new Set(categoryNames).size, expected);
    const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())['@graph'];
    const list = graph.find(node => node['@type'] === 'ItemList');
    assert.equal(list['@id'], `${origin}/#najnovije-pozivnice`);
    assert.equal(list.numberOfItems, expected);
    assert.deepEqual(list.itemListElement.map(item => item.name), names);
    assert.deepEqual(list.itemListElement.map(item => item.url), hrefs.map(href => origin + href));
    assert.deepEqual(list.itemListElement.map(item => item.position), Array.from({ length: expected }, (_, i) => i + 1));
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `${origin}/`);
    assert.equal(await page.locator('h1').count(), 1);
    const payload = JSON.parse(await page.locator('#catalog-data').textContent());
    assert.deepEqual(payload.templates, [], 'Homepage links do not serialize the full editor catalog');
    assert.ok(await cards.locator('img').evaluateAll(images => images.every(img => img.alt && img.getAttribute('width') === '500' && img.getAttribute('height') === '700' && img.loading === 'lazy')));
    assert.equal(await page.locator('.ad-placement').count(), 1);
    return { names, hrefs, categoryNames };
  }
  await staticPage.goto(origin);
  const initial = await assertSection(staticPage);
  const expected = latestTemplates(publicTemplates);
  assert.deepEqual(initial.names, expected.map(t => t.name));
  const staticHtml = await fs.readFile(`${root}dist/index.html`, 'utf8');
  for (const href of initial.hrefs) assert.ok(staticHtml.includes(`class="latest-link" href="${href}"`), 'Static build and Worker expose the same links');
  const sitemap = await (await request('/sitemap.xml')).text();
  for (const href of initial.hrefs) {
    assert.ok(sitemap.includes(`<loc>${origin}${href}</loc>`));
    assert.equal((await request(href)).status, 200);
  }
  await staticPage.locator('.latest-link').first().click();
  assert.equal(new URL(staticPage.url()).pathname, initial.hrefs[0]);
  await staticPage.goBack();
  assert.equal(new URL(staticPage.url()).pathname, '/');
  console.log('PASS: six server-rendered homepage cards, one per category, work without JS; static and Worker links, alt text, dimensions, canonical, sitemap and ItemList match.');

  // Exercise publication changes against actual D1 and the compiled Worker,
  // without rebuilding the static site or changing the private draft content.
  const newestBirthday = expected.find(t => t.category === 'birthday');
  await local.db.prepare('INSERT INTO settings (key,value) VALUES (?,?)').bind(`example_hidden:${newestBirthday.id}`, 'true').run();
  await staticPage.goto(origin);
  let current = await assertSection(staticPage);
  assert.ok(!current.names.includes(newestBirthday.name));
  await local.db.prepare('DELETE FROM settings WHERE key=?').bind(`example_hidden:${newestBirthday.id}`).run();
  const id = crypto.randomUUID(), stamp = '2026-10-22T10:00:00Z';
  const design = { ...curatedDesign(newestBirthday.id), id, name: 'Nova objavljena avantura', slug: 'nova-objavljena-avantura' };
  const thumbnail = await fs.readFile(`${root}public${newestBirthday.thumbnail}`);
  const media = await local.runtime.getR2Bucket('MEDIA');
  await media.put(design.thumbnailId, thumbnail, { httpMetadata: { contentType: 'image/webp' } });
  await local.db.prepare('INSERT INTO assets (id,role,name,content_type,size,public,created_at) VALUES (?,?,?,?,?,1,?)').bind(design.thumbnailId, 'thumbnail', 'Test pregled', 'image/webp', thumbnail.length, stamp).run();
  await local.db.prepare('INSERT INTO templates (id,slug,name,category,draft_json,created_at,updated_at) VALUES (?,?,?,?,?,?,?)').bind(id, design.slug, design.name, design.category, JSON.stringify(design), stamp, stamp).run();
  await staticPage.goto(origin);
  assert.deepEqual((await assertSection(staticPage)).names, initial.names, 'A newer private draft stays off the homepage');
  assert.match(await (await request('/sitemap.xml')).text(), /<loc>https:\/\/napravipozivnicu.com\/<\/loc><lastmod>2026-10-21<\/lastmod>/);
  await local.db.prepare('UPDATE templates SET published_json=draft_json,published_at=? WHERE id=?').bind(stamp, id).run();
  await staticPage.goto(origin);
  current = await assertSection(staticPage);
  assert.equal(current.names[0], design.name);
  assert.equal(current.hrefs[0], `/pozivnice/${design.slug}/`);
  assert.match(await (await request('/sitemap.xml')).text(), /<loc>https:\/\/napravipozivnicu.com\/<\/loc><lastmod>2026-10-22<\/lastmod>/);
  assert.ok(!current.names.includes(newestBirthday.name));
  for (const template of expected.filter(t => t.category !== 'birthday')) assert.ok(current.names.includes(template.name));
  await local.db.prepare('UPDATE templates SET draft_json=?,updated_at=? WHERE id=?').bind(JSON.stringify({ ...design, name: 'Privatna promena naziva' }), '2026-10-23T10:00:00Z', id).run();
  await staticPage.goto(origin);
  assert.equal((await assertSection(staticPage)).names[0], design.name, 'Unsaved public changes must not leak from the draft');
  assert.match(await (await request('/sitemap.xml')).text(), /<loc>https:\/\/napravipozivnicu.com\/<\/loc><lastmod>2026-10-22<\/lastmod>/);
  await local.db.prepare('UPDATE templates SET published_json=NULL WHERE id=?').bind(id).run();
  await staticPage.goto(origin);
  assert.deepEqual((await assertSection(staticPage)).names, initial.names, 'Unpublishing restores the previous public design');
  for (const template of publicTemplates.filter(t => t.category === 'baby')) await local.db.prepare('INSERT INTO settings (key,value) VALUES (?,?)').bind(`example_hidden:${template.id}`, 'true').run();
  await staticPage.goto(origin);
  await assertSection(staticPage, 5);
  await local.db.prepare("DELETE FROM settings WHERE key LIKE 'example_hidden:%'").run();
  console.log('PASS: new publication replaces only its category, drafts stay private, hidden/withdrawn designs disappear and empty categories never create duplicates; no rebuild required.');

  const ctx = await context();
  const page = await ctx.newPage();
  page.on('request', req => { if (req.resourceType() === 'script') scripts.add(new URL(req.url()).pathname); });
  await fs.mkdir('/workspace/artifacts/latest-home', { recursive: true });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width < 620 ? 844 : 1000 });
    await page.goto(origin);
    await page.evaluate(() => document.fonts.ready);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No horizontal overflow at ${width}px`);
    assert.equal(await page.locator('.latest-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length), width < 620 ? 2 : 3);
    for (const card of await page.locator('.latest-card').all()) {
      await card.scrollIntoViewIfNeeded();
      await card.locator('img').evaluate(img => img.decode());
      assert.ok(await card.evaluate(el => { const rect = el.getBoundingClientRect(); return rect.left >= 0 && rect.right <= innerWidth; }));
      assert.ok(await card.evaluate(el => {
        const label = el.querySelector('.latest-open');
        return label.getBoundingClientRect().bottom <= el.getBoundingClientRect().bottom && getComputedStyle(label).visibility === 'visible';
      }), 'The link label must stay visible inside its card');
      assert.equal(await card.evaluate(el => getComputedStyle(el).opacity), '1');
    }
    if (width === 390 || width === 1440) await page.locator('.latest-section').screenshot({ path: `/workspace/artifacts/latest-home/${width === 390 ? 'mobile' : 'desktop'}.jpg`, type: 'jpeg', quality: 90, style: '.site-header,.mobile-create-bar,.skip-link{visibility:hidden!important}' });
  }
  assert.ok(![...scripts].some(path => /editor|jspdf|design-renderer/.test(path)), 'The section must not load the editor, fonts or PDF engine');
  let jsGzip = 0;
  for (const path of scripts) jsGzip += gzipSync(await fs.readFile(`${root}dist${path}`)).length;
  assert.ok(jsGzip < 10_000, `Initial JS remains under 10 KB: ${jsGzip}`);
  await page.locator('.latest-link').first().focus();
  assert.ok(await page.locator('.latest-link').first().evaluate(link => getComputedStyle(link).outlineStyle !== 'none'));
  await page.keyboard.press('Enter');
  await page.waitForURL(`${origin}${initial.hrefs[0]}`);
  await page.locator('[data-open-template]').click();
  await page.waitForFunction(() => document.querySelector('#editor')?.open);
  assert.equal(await page.locator('#tab-photo').isVisible(), false);
  await page.locator('input[name="names"]').fill('Đorđe');
  assert.equal(await page.locator('input[name="names"]').inputValue(), 'Đorđe');
  assert.deepEqual(errors, []);
  console.log(`PASS: 320/390/768/1440px grids, lazy decoded images, reduced motion, keyboard navigation and detail/editor journey; ${jsGzip} bytes initial JS gzip; no browser errors.`);
} finally {
  await browser?.close();
  await local.runtime.dispose();
}
