import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { chromium } from 'playwright';
import { createLocalRuntime, root } from '../scripts/local-runtime.mjs';
import { GUIDE_HUB, GUIDES, guidesForCategory } from '../src/guide-catalog.js';
import { GUIDE_CONTENT } from '../src/guide-content.js';
import { categoryPath } from '../src/seo-content.js';

const origin = 'https://napravipozivnicu.com';
const local = await createLocalRuntime();
const worker = (path, init) => local.runtime.dispatchFetch(`${origin}${path}`, init);
const errors = [], scripts = new Set();
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  async function context(options = {}) {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', ...options });
    await ctx.route('**/*', async route => {
      const req = route.request();
      assert.equal(new URL(req.url()).origin, origin, 'Guides must not load third-party scripts or embeds');
      const response = await local.runtime.dispatchFetch(req.url(), { method: req.method(), headers: req.headers(), body: req.postDataBuffer() || undefined });
      assert.ok(response.ok, `${response.status}: ${req.url()}`);
      await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: Buffer.from(await response.arrayBuffer()) });
    });
    ctx.on('page', page => page.on('pageerror', error => errors.push(error.message)));
    return ctx;
  }
  const noJs = await context({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  const sitemap = await (await worker('/sitemap.xml')).text();
  const linkedPaths = new Set(), titles = new Set(), descriptions = new Set();
  for (const guide of [GUIDE_HUB, ...GUIDES]) {
    const response = await worker(guide.path);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('X-Robots-Tag'), null);
    await staticPage.goto(origin + guide.path);
    assert.equal(await staticPage.locator('h1').count(), 1);
    assert.equal(await staticPage.locator('h1').textContent(), guide.title + (guide.id === 'guides' ? '.' : ''));
    assert.equal(await staticPage.title(), guide.seoTitle);
    assert.equal(await staticPage.locator('meta[name="description"]').getAttribute('content'), guide.description);
    assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'), origin + guide.path);
    assert.equal(await staticPage.locator('.navigation a[aria-current="page"]').textContent(), 'Vodiči');
    assert.equal(await staticPage.locator('.ad-placement[hidden]').count(), 1);
    assert.equal(await staticPage.locator('[data-copy-text]:visible').count(), 0);
    titles.add(await staticPage.title()); descriptions.add(guide.description);
    const graph = JSON.parse(await staticPage.locator('script[type="application/ld+json"]').textContent())['@graph'];
    assert.ok(graph.some(node => node['@type'] === 'BreadcrumbList'));
    assert.ok(sitemap.includes(`<loc>${origin}${guide.path}</loc><lastmod>2026-10-21</lastmod>`));
    const builtHtml = await fs.readFile(`${root}dist${guide.path}index.html`, 'utf8');
    assert.ok(builtHtml.includes(guide.title) && builtHtml.includes(`href="${origin}${guide.path}"`));
    if (guide.id === 'guides') {
      assert.equal(await staticPage.locator('.guide-index-grid .guide-card').count(), 4);
      assert.equal(graph.find(node => node['@type'] === 'ItemList').numberOfItems, 4);
    } else {
      const article = graph.find(node => node['@type'] === 'Article');
      assert.equal(article.headline, guide.title);
      assert.equal(article.datePublished, guide.publishedAt);
      assert.equal(article.dateModified, guide.updatedAt);
      assert.equal(graph.find(node => node['@id'] === article.author['@id']).name, 'Napravi pozivnicu');
      assert.equal(await staticPage.locator('meta[property="og:type"]').getAttribute('content'), 'article');
      assert.equal(await staticPage.locator('.guide-body-section').count(), GUIDE_CONTENT[guide.id].length);
      assert.equal(await staticPage.locator('.guide-toc a').count(), GUIDE_CONTENT[guide.id].length);
      for (const section of GUIDE_CONTENT[guide.id]) {
        assert.equal(await staticPage.locator(`#${section.id} > h2`).textContent(), section.title);
        assert.ok(builtHtml.includes(section.id));
      }
      const toc = staticPage.locator('.guide-toc a').first();
      await toc.click();
      assert.equal(new URL(staticPage.url()).hash, `#${GUIDE_CONTENT[guide.id][0].id}`);
      assert.ok(await staticPage.locator('.guide-body-section').first().evaluate(el => el.getBoundingClientRect().top >= 80));
    }
    for (const path of await staticPage.locator('main a[href^="/"]').evaluateAll(links => links.map(a => a.getAttribute('href')))) linkedPaths.add(path.split('#')[0]);
    const head = await worker(guide.path, { method: 'HEAD' });
    assert.equal(head.status, 200); assert.equal(await head.text(), '');
    const redirect = await worker(guide.path.slice(0, -1) + '?izvor=test', { redirect: 'manual' });
    assert.equal(redirect.status, 301); assert.equal(redirect.headers.get('Location'), origin + guide.path + '?izvor=test');
    const preview = await local.runtime.dispatchFetch(`https://preview.pages.dev${guide.path}`);
    assert.equal(preview.headers.get('X-Robots-Tag'), 'noindex');
  }
  assert.equal(titles.size, 5); assert.equal(descriptions.size, 5);
  for (const path of linkedPaths) assert.equal((await worker(path || '/')).status, 200, `Broken internal link: ${path}`);
  assert.equal((await worker('/vodici/nepostojeci-vodic/')).status, 404);
  await staticPage.goto(origin);
  assert.equal(await staticPage.locator('#vodici .guide-card').count(), 4);
  for (const category of ['first', 'eighteen', 'birthday', 'wedding', 'baptism', 'baby']) {
    await staticPage.goto(origin + categoryPath(category));
    assert.deepEqual(await staticPage.locator('.guide-teasers .guide-card > a').evaluateAll(links => links.map(a => a.getAttribute('href'))), guidesForCategory(category).map(guide => guide.path));
  }
  console.log('PASS: four full SSG/Worker articles and guide index work without JS, with unique metadata, canonical/slash routes, Article/Breadcrumb/ItemList schema, sitemap dates, working internal links, contextual recommendations, preview noindex and one ad slot.');

  const ctx = await context({ permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  page.on('request', req => { if (req.resourceType() === 'script') scripts.add(new URL(req.url()).pathname); });
  await fs.mkdir('/workspace/artifacts/guides', { recursive: true });
  for (const width of [320, 390, 768, 900, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const guide of [GUIDE_HUB, ...GUIDES]) {
      await page.goto(origin + guide.path);
      await page.evaluate(() => document.fonts.ready);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${guide.id} overflows at ${width}px`);
      if (guide.id !== 'guides') {
        await page.locator('.guide-body-section').last().scrollIntoViewIfNeeded();
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      }
    }
  }
  assert.ok(![...scripts].some(path => /editor|jspdf|design-renderer/.test(path)));
  let gzipBytes = 0;
  for (const path of scripts) gzipBytes += gzipSync(await fs.readFile(`${root}dist${path}`)).length;
  assert.ok(gzipBytes < 10_000, `Initial JS exceeds 10 KB: ${gzipBytes}`);
  for (const guide of GUIDES.filter(g => g.id !== 'printing')) {
    await page.goto(origin + guide.path);
    const button = page.locator('[data-copy-text]').first();
    await button.click();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), await page.locator(`#${await button.getAttribute('data-copy-text')}`).textContent());
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + GUIDES[0].path);
  await page.locator('.guide-hero').screenshot({ path: '/workspace/artifacts/guides/birthday-mobile.jpg', type: 'jpeg', quality: 90, style: '.site-header,.skip-link{visibility:hidden!important}' });
  await page.locator('.guide-example').first().screenshot({ path: '/workspace/artifacts/guides/example-mobile.jpg', type: 'jpeg', quality: 90, style: '.site-header,.skip-link{visibility:hidden!important}' });
  await page.locator('.menu-toggle').click();
  await page.locator('.navigation a[href="/vodici/"]').click();
  await page.waitForURL(origin + GUIDE_HUB.path);
  await page.locator('.guide-index-grid .guide-card a').first().click();
  await page.waitForURL(origin + GUIDES[0].path);
  const templateHref = await page.locator('.guide-design-grid a').first().getAttribute('href');
  await page.locator('.guide-design-grid a').first().click();
  await page.waitForURL(origin + templateHref);
  assert.ok(await page.locator('.guide-teasers .guide-card').count() >= 2);
  await page.locator('[data-open-template]').click();
  await page.waitForFunction(() => document.querySelector('#editor')?.open);
  await page.keyboard.press('Escape');
  await page.goBack();
  await page.waitForURL(origin + GUIDES[0].path);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(origin + GUIDE_HUB.path);
  await page.screenshot({ path: '/workspace/artifacts/guides/index-desktop.jpg', type: 'jpeg', quality: 90 });
  await page.goto(origin + GUIDES.find(g => g.id === 'printing').path);
  await page.locator('.print-diagram').screenshot({ path: '/workspace/artifacts/guides/print-diagram.jpg', type: 'jpeg', quality: 90, style: '.site-header,.skip-link{visibility:hidden!important}' });
  assert.deepEqual(errors, []);
  console.log(`PASS: 25 page/viewport combinations, copied examples from the real clipboard, mobile navigation and guide → template → editor → Back journey; ${gzipBytes} bytes initial JS gzip; no browser errors.`);
} finally {
  await browser?.close();
  await local.runtime.dispose();
}
