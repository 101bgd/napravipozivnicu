import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { chromium } from 'playwright';
import { createLocalRuntime, root } from '../scripts/local-runtime.mjs';
import { CATEGORY_CONTENT, categoryPath } from '../src/seo-content.js';
import { publicTemplates } from '../src/curated-catalog.js';

const origin = 'https://napravipozivnicu.com';
const local = await createLocalRuntime();
let browser;
const errors = [], assets = new Set(), measurements = [];
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  async function context(options = {}) {
    const ctx = await browser.newContext(options);
    await ctx.route('**/*', async route => {
      const request = route.request();
      assert.equal(new URL(request.url()).origin, origin, 'Landing pages must not load external dependencies');
      const response = await local.runtime.dispatchFetch(request.url(), { method: request.method(), headers: request.headers() });
      assert.ok(response.ok, `Unexpected response ${response.status}: ${request.url()}`);
      await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: Buffer.from(await response.arrayBuffer()) });
    });
    return ctx;
  }
  const noJs = await context({ javaScriptEnabled: false, reducedMotion: 'reduce' });
  const staticPage = await noJs.newPage();
  const sitemap = await (await local.runtime.dispatchFetch(`${origin}/sitemap.xml`)).text();
  const titles = new Set(), descriptions = new Set();
  for (const [id, content] of Object.entries(CATEGORY_CONTENT)) {
    const path = categoryPath(id), visible = publicTemplates.filter(t => t.category === id);
    await staticPage.goto(`${origin}${path}`);
    assert.equal(await staticPage.locator('h1').count(), 1);
    assert.equal(await staticPage.locator('h1').innerText(), content.title);
    assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'), `${origin}${path}`);
    const title = await staticPage.title(), description = await staticPage.locator('meta[name="description"]').getAttribute('content');
    assert.ok(title && description && !titles.has(title) && !descriptions.has(description));
    titles.add(title); descriptions.add(description);
    assert.ok(sitemap.includes(`<loc>${origin}${path}</loc>`));
    assert.equal(await staticPage.locator('.template-card').count(), visible.length);
    assert.equal(await staticPage.locator('.collection-faq details').count(), 5);
    assert.equal(await staticPage.locator('.invitation-example blockquote').count(), 2);
    assert.equal(await staticPage.locator('.ad-placement').count(), 1);
    assert.equal(await staticPage.locator('.header-cta').getAttribute('href'), '#designs');
    assert.equal(await staticPage.locator('.collection-category-links a').count(), 6);
    const graph = JSON.parse(await staticPage.locator('script[type="application/ld+json"]').textContent())['@graph'];
    assert.ok(graph.some(node => node['@type'] === 'CollectionPage' && node.url === `${origin}${path}`));
    const list = graph.find(node => node['@type'] === 'ItemList');
    assert.equal(list.numberOfItems, visible.length);
    assert.deepEqual(list.itemListElement.map(t => t.url), visible.map(t => `${origin}/pozivnice/${t.slug || t.id}/`));
    assert.ok(graph.some(node => node['@type'] === 'BreadcrumbList'));
    const preload = await staticPage.locator('link[rel="preload"][as="image"]').getAttribute('href');
    assert.equal(preload, await staticPage.locator('.collection-card-0 img').getAttribute('src'));
    assert.equal(await staticPage.locator('meta[property="og:image"]').getAttribute('content'), `${origin}${preload}`);
    assert.equal(await staticPage.locator('img').evaluateAll(images => images.every(i => i.alt && i.width && i.height)), true);
    const payload = JSON.parse(await staticPage.locator('#catalog-data').textContent());
    assert.equal(payload.templates.length, visible.length, 'Only this category is serialized for the editor');
    assert.ok(payload.templates.every(t => t.category === id));
    const staticHtml = await fs.readFile(`${root}dist${path}index.html`, 'utf8');
    assert.ok(staticHtml.includes('class="category-landing') && staticHtml.includes('CollectionPage') && staticHtml.includes('collection-faq'), 'SSG and Worker both serve full category pages');
    await staticPage.locator('.hero-cta').click();
    assert.equal(new URL(staticPage.url()).hash, '#designs', 'Native CTA works with JS disabled');
  }
  await staticPage.goto(`${origin}/pozivnice/`);
  await staticPage.locator('.occasion-wedding').click();
  assert.equal(new URL(staticPage.url()).pathname, categoryPath('wedding'), 'The main menu works without JS');
  await noJs.close();
  console.log('PASS: six distinct SSG/Worker landing pages without JS, canonical URLs, crawlable navigation/templates, CollectionPage/ItemList/Breadcrumb metadata, matching image preload/social preview, examples/FAQs, ads and category-only payloads.');

  const ctx = await context({ reducedMotion: 'reduce', permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (request.resourceType() === 'script') assets.add(new URL(request.url()).pathname); });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width === 320 ? 740 : 1000 });
    for (const id of Object.keys(CATEGORY_CONTENT)) {
      assets.clear();
      await page.goto(`${origin}${categoryPath(id)}`);
      await page.evaluate(() => document.fonts.ready);
      await page.locator('.collection-card img').evaluateAll(images => Promise.all(images.map(i => i.decode())));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${id} overflows at ${width}px`);
      assert.ok(await page.locator('.hero-cta').evaluate(a => { const r = a.getBoundingClientRect(); return r.top >= 70 && r.bottom <= innerHeight; }), `${id}: CTA must be visible at ${width}px`);
      assert.equal(await page.locator('.collection-card img').evaluateAll(images => images.every(i => i.naturalWidth > 0)), true);
      assert.ok(![...assets].some(path => /editor-|jspdf/.test(path)));
      let scriptBytes = 0;
      for (const path of assets) scriptBytes += gzipSync(await fs.readFile(`${root}dist${path}`)).length;
      assert.ok(scriptBytes < 10_000, `Category startup JS exceeded 10 KB: ${scriptBytes}`);
      const gridTop = await page.locator('#template-grid').evaluate(el => el.getBoundingClientRect().top);
      if (width === 390) assert.ok(gridTop < 1150, `${id}: templates too far below the hero (${gridTop}px)`);
      measurements.push({ category: id, width, initialJsGzip: scriptBytes, gridTop: Math.round(gridTop) });
      await page.locator('.hero-cta').click();
      assert.ok(await page.locator('#designs').evaluate(el => el === document.activeElement));
      assert.equal(new URL(page.url()).hash, '#designs');
      assert.ok(await page.locator('#designs-title').evaluate(el => el.getBoundingClientRect().top >= 70), 'Sticky header must not cover the grid heading');
      await page.waitForFunction(() => document.querySelector('.category-create-bar').inert);
      await page.locator('#search').fill('zzzz-nepostoji');
      assert.equal(await page.locator('.empty-state').count(), 1);
      await page.locator('#clear-search').click();
      assert.equal(await page.locator('.template-card').count(), publicTemplates.filter(t => t.category === id).length);
      assert.ok(await page.locator('#search').evaluate(el => el === document.activeElement));
    }
  }
  // Real browser navigation and returning from a detail page preserve the category URL.
  await page.goto(`${origin}/pozivnice/`);
  await page.locator('.occasion-birthday').click();
  await page.waitForURL(`${origin}${categoryPath('birthday')}`);
  await page.locator('.template-card h3 a').first().click();
  await page.goBack();
  await page.waitForURL(`${origin}${categoryPath('birthday')}`);
  await page.locator('.collection-faq details').first().locator('summary').click();
  assert.equal(await page.locator('.collection-faq details').first().getAttribute('open'), '');
  await page.locator('[data-copy-text]').first().click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), await page.locator('#example-0').textContent());
  await page.locator('[data-template="dino-avantura"]').first().click();
  await page.waitForFunction(() => document.querySelector('#editor')?.open);
  await page.locator('input[name="names"]').fill('Milica');
  assert.equal(await page.locator('input[name="names"]').inputValue(), 'Milica');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#editor').evaluate(el => el.open), false);
  console.log('PASS: 24 category/viewport combinations (320/390/768/1440), visible CTA, no overflow, <10 KB startup JS, editor deferred, CTA keyboard focus, search reset retains category, native Back, FAQ and actual clipboard copying.');

  // Motion controls must work with animation enabled, not just in screenshot mode.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${origin}${categoryPath('wedding')}`);
  await page.waitForFunction(() => document.querySelector('.collection-card').getAnimations().some(a => a.playState === 'running'));
  await page.locator('[data-motion-toggle]').click();
  assert.equal(await page.locator('[data-motion-toggle]').getAttribute('aria-pressed'), 'true');
  await page.waitForFunction(() => !document.querySelector('.collection-card').getAnimations().some(a => a.playState === 'running'));
  await page.locator('[data-motion-toggle]').click();
  await page.waitForFunction(() => document.querySelector('.collection-card').getAnimations().some(a => a.playState === 'running'));
  await page.locator('.collection-faq').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.collection-hero').classList.contains('is-scene-paused'));
  assert.equal(await page.locator('.collection-card').first().evaluate(el => el.getAnimations().some(a => a.playState === 'running')), false);
  await page.waitForFunction(() => !document.querySelector('.category-create-bar').inert);
  await page.locator('.category-create-bar a').click();
  await page.waitForFunction(() => document.querySelector('.category-create-bar').inert);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${origin}${categoryPath('wedding')}`);
  assert.equal(await page.locator('.category-landing').evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.playState === 'running').length), 0);
  assert.ok(await page.locator('h1').isVisible());
  console.log('PASS: visible motion, pause/resume, offscreen suspension, contextual mobile CTA, reduced-motion content and animation suppression.');

  // An admin hiding the featured design must update hero, preload, schema and grid together.
  await local.db.prepare("INSERT INTO settings (key,value) VALUES (?,?)").bind('example_hidden:ponocna-elegancija', 'true').run();
  await page.goto(`${origin}${categoryPath('wedding')}`);
  assert.equal(await page.locator('[data-template="ponocna-elegancija"]').count(), 0);
  assert.equal(await page.locator('.collection-card[href*="ponocna-elegancija"]').count(), 0);
  const hero = await page.locator('.collection-card-0 img').getAttribute('src');
  assert.ok(!hero.includes('ponocna-elegancija'));
  assert.equal(await page.locator('link[rel="preload"][as="image"]').getAttribute('href'), hero);
  await local.db.prepare('DELETE FROM settings WHERE key=?').bind('example_hidden:ponocna-elegancija').run();
  assert.deepEqual(errors, []);
  console.log('PASS: current published catalog controls featured images, preload and grid; no browser errors.');
  console.log(JSON.stringify(measurements));
} finally {
  await browser?.close();
  await local.runtime.dispose();
}
