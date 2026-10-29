import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';
import { createLocalRuntime, root } from '../scripts/local-runtime.mjs';
import { publicTemplates } from '../src/curated-catalog.js';
import { CATEGORY_CONTENT, categoryPath } from '../src/seo-content.js';
import { templateTitle } from '../src/template-titles.js';

const targets = { birthday: 'pozivnice za rodjendan', eighteen: 'pozivnice za 18. rodjendan', first: 'pozivnice za 1. rodjendan', wedding: 'pozivnice za vencanje', baptism: 'pozivnice za krstenje', baby: 'pozivnice za rodjenje' };
const fold = text => text.toLocaleLowerCase('sr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll('đ', 'dj');
const origin = 'https://napravipozivnicu.com';
const local = await createLocalRuntime();
const request = path => local.runtime.dispatchFetch(origin + path);
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  await ctx.route('**/*', async route => {
    const req = route.request();
    assert.equal(new URL(req.url()).origin, origin);
    const response = await local.runtime.dispatchFetch(req.url(), { method: req.method(), headers: req.headers() });
    assert.ok(response.ok, `${response.status}: ${req.url()}`);
    await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: Buffer.from(await response.arrayBuffer()) });
  });
  const page = await ctx.newPage();
  const sitemap = await (await request('/sitemap.xml')).text();
  await page.goto(origin);
  const xmlEntries = await page.evaluate(text => {
    const doc = new DOMParser().parseFromString(text, 'application/xml');
    if (doc.querySelector('parsererror')) throw new Error('Invalid XML sitemap');
    return [...doc.getElementsByTagNameNS('http://www.sitemaps.org/schemas/sitemap/0.9', 'url')].map(entry => ({
      loc: entry.getElementsByTagNameNS('http://www.sitemaps.org/schemas/sitemap/0.9', 'loc')[0].textContent,
      date: entry.getElementsByTagNameNS('http://www.sitemaps.org/schemas/sitemap/0.9', 'lastmod')[0]?.textContent,
      images: [...entry.getElementsByTagNameNS('http://www.google.com/schemas/sitemap-image/1.1', 'loc')].map(image => image.textContent),
    }));
  }, sitemap);
  const titles = new Set(), descriptions = new Set(), altTexts = new Set();
  let imageCount = 0;
  for (const [category, target] of Object.entries(targets)) {
    const info = CATEGORY_CONTENT[category], templates = publicTemplates.filter(t => t.category === category);
    await page.goto(origin + categoryPath(category));
    assert.equal(await page.locator('h1').count(), 1);
    assert.ok(fold(await page.locator('h1').innerText()).startsWith(target));
    const title = await page.title(), description = await page.locator('meta[name="description"]').getAttribute('content');
    assert.ok(fold(title).startsWith(target));
    assert.ok(fold(description).includes(target));
    assert.ok(fold(await page.locator('.collection-copy > p').innerText()).includes(target));
    assert.equal(await page.locator('.collection-guide-copy > p').first().innerText(), info.intro);
    titles.add(title); descriptions.add(description);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), origin + categoryPath(category));
    assert.equal(await page.locator('.template-card img').count(), templates.length);
    assert.equal(await page.locator('.template-card canvas').count(), 0);
    assert.equal(await page.locator(`footer a[href="${categoryPath(category)}"]`).innerText(), info.title);
    const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())['@graph'];
    const collection = graph.find(node => node['@type'] === 'CollectionPage');
    assert.equal(collection.about.name, info.keyword);
    const images = graph.filter(node => node['@type'] === 'ImageObject');
    assert.equal(images.length, templates.length);
    const categoryEntry = xmlEntries.find(entry => entry.loc === origin + categoryPath(category));
    assert.ok(categoryEntry.date >= '2026-10-21');
    assert.deepEqual(new Set(categoryEntry.images), new Set(templates.map(t => origin + t.thumbnail)));
    const built = await fs.readFile(`${root}dist${categoryPath(category)}index.html`, 'utf8');
    assert.ok(built.includes(info.intro) && built.includes(`<title>${info.seoTitle}</title>`));
    for (const template of templates) {
      const img = page.locator(`[data-template="${template.id}"] img`);
      const alt = await img.getAttribute('alt');
      // Authored alt can begin with a color or visual motif. The surrounding
      // category and ImageObject name identify the occasion without keyword stuffing.
      assert.equal(alt, template.imageAlt.trim(), `${template.id}: keep the authored image description`);
      assert.ok(alt.length > 20 && !altTexts.has(alt), 'Alt text must describe the actual unique motif');
      altTexts.add(alt);
      assert.equal(await img.getAttribute('width'), '500'); assert.equal(await img.getAttribute('height'), '700');
      assert.equal(await img.getAttribute('loading'), 'lazy');
      const imageObject = images.find(image => image.contentUrl === origin + template.thumbnail);
      assert.equal(imageObject.name, templateTitle(template));
      assert.equal(imageObject.caption, alt);
      assert.equal(imageObject['@id'], `${origin}/pozivnice/${template.slug || template.id}/#image`);
      const detailEntry = xmlEntries.find(entry => entry.loc === `${origin}/pozivnice/${template.slug || template.id}/`);
      assert.deepEqual(detailEntry.images, [origin + template.thumbnail]);
      const asset = await request(template.thumbnail);
      assert.equal(asset.status, 200); assert.match(asset.headers.get('Content-Type'), /image\/webp/);
      await asset.arrayBuffer();
      imageCount++;
    }
  }
  assert.equal(titles.size, 6); assert.equal(descriptions.size, 6); assert.equal(imageCount, publicTemplates.length);
  // A hidden design must leave both the page's image graph and image sitemap.
  const hidden = publicTemplates.find(t => t.id === 'jeziceva-radost');
  await local.db.prepare('INSERT INTO settings (key,value) VALUES (?,?)').bind(`example_hidden:${hidden.id}`, 'true').run();
  await page.goto(origin + categoryPath(hidden.category));
  assert.equal(await page.locator(`[data-template="${hidden.id}"]`).count(), 0);
  assert.ok(!(await (await request('/sitemap.xml')).text()).includes(origin + hidden.thumbnail));
  // A new private draft must never disclose its thumbnail through the sitemap.
  await local.db.prepare('INSERT INTO templates (id,slug,name,category,draft_json,created_at,updated_at) VALUES (?,?,?,?,?,?,?)').bind(crypto.randomUUID(), 'privatni-seo-nacrt', 'Privatni nacrt', 'birthday', '{"thumbnailId":"private-image"}', '2026-10-21', '2026-10-21').run();
  const publicMap = await (await request('/sitemap.xml')).text();
  assert.ok(!publicMap.includes('privatni-seo-nacrt') && !publicMap.includes('private-image'));
  console.log(`PASS: six keyword-focused category pages keep existing canonical URLs; all ${imageCount} invitation previews have unique contextual alt, static WebP images, matching ImageObject metadata and valid image sitemap entries; hidden/private designs stay out of search.`);
} finally { await browser?.close(); await local.runtime.dispose(); }
