import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';
import { publicTemplates } from '../src/curated-catalog.js';
import { curatedDesign } from '../src/curated-designs.js';
import { buildTemplateTitle, templateTitle, INVITATION_LABELS } from '../src/template-titles.js';
import { legacyTemplateTitles } from '../src/legacy-template-titles.js';
import { newDesign, normalizeDesign, publicTemplate, upgradeTemplateTitle } from '../src/template-schema.js';
import { createLocalRuntime, root } from '../scripts/local-runtime.mjs';

const { motifs } = JSON.parse(await fs.readFile(new URL('../content/title-seo/motifs.json', import.meta.url), 'utf8'));
const origin = 'https://napravipozivnicu.com';
const automatic = normalizeDesign({ ...newDesign(), name: 'Zvezdana družina', category: 'birthday', motif: 'sa zvezdama i raketom', seoTitle: '' });
assert.equal(automatic.motif, 'sa zvezdama i raketom');
assert.equal(automatic.seoTitle, '', 'An automatic draft must not freeze the generated title');
const stamp = '2026-10-15T12:00:00Z';
const publicAutomatic = publicTemplate({ id: crypto.randomUUID(), slug: 'zvezdana-druzina-stalna-adresa', published_json: JSON.stringify(automatic), published_at: stamp });
assert.equal(publicAutomatic.seoTitle, 'Pozivnica za dečiji rođendan sa zvezdama i raketom — Zvezdana družina');
assert.equal(publicAutomatic.updatedAt, stamp);
assert.equal(templateTitle({ ...automatic, seoTitle: '   ' }), publicAutomatic.seoTitle);
assert.equal(templateTitle({ ...automatic, seoTitle: 'Posebna svemirska pozivnica' }), 'Posebna svemirska pozivnica');
assert.ok(buildTemplateTitle({ ...automatic, name: 'A'.repeat(100), motif: 'dugačak motiv '.repeat(20) }).length <= 150);

const source = publicTemplates.find(t => t.id === 'svemirska-misija');
const legacy = { ...curatedDesign(source.id), seoTitle: legacyTemplateTitles[source.id] };
delete legacy.motif;
const upgraded = upgradeTemplateTitle(legacy);
assert.equal(upgraded.motif, source.motif);
assert.equal(upgraded.seoTitle, source.seoTitle);
assert.equal(upgradeTemplateTitle({ ...legacy, seoTitle: 'Moj poseban naslov za svemir' }).seoTitle, 'Moj poseban naslov za svemir');
assert.equal(upgradeTemplateTitle({ ...legacy, motif: '' }).motif, '', 'An explicit cleared motif must remain cleared');

const local = await createLocalRuntime();
let browser;
try {
  const request = path => local.runtime.dispatchFetch(origin + path);
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await ctx.route('**/*', async route => {
    const req = route.request();
    assert.equal(new URL(req.url()).origin, origin);
    const response = await local.runtime.dispatchFetch(req.url(), { method: req.method(), headers: req.headers() });
    await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: Buffer.from(await response.arrayBuffer()) });
  });
  const page = await ctx.newPage(), titles = new Set();
  for (const template of publicTemplates) {
    assert.equal(template.motif, motifs[template.id]);
    const path = '/pozivnice/' + (template.slug || template.id) + '/';
    await page.goto(origin + path);
    assert.equal(await page.locator('h1').count(), 1);
    const title = await page.title();
    assert.ok(title.startsWith(INVITATION_LABELS[template.category] + ' '));
    assert.ok(title.includes(template.motif) && title.endsWith(' — ' + template.name));
    assert.ok(!titles.has(title), 'Each design needs a distinct descriptive title');
    titles.add(title);
    assert.equal(await page.locator('h1').innerText(), title);
    assert.equal(await page.locator('meta[property="og:title"]').getAttribute('content'), title);
    assert.equal(await page.locator('meta[name="twitter:title"]').getAttribute('content'), title);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), origin + path);
    const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())['@graph'];
    assert.equal(graph.find(node => node['@type'] === 'WebPage').name, title);
    assert.equal(graph.find(node => node['@type'] === 'ImageObject').name, title);
    const built = await fs.readFile(root + 'dist' + path + 'index.html', 'utf8');
    assert.ok(built.includes('<title>' + title + '</title>') && built.includes('<h1>' + title + '</h1>'));
    assert.ok(await page.locator('[data-open-template]').isVisible());
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), template.id + ': mobile overflow');
  }
  // Already-published snapshots get the new shipped title without changing their
  // stored JSON, date or URL. Unpublished draft edits must stay private.
  const recordId = crypto.randomUUID(), snapshot = JSON.stringify(legacy);
  await local.db.prepare('INSERT INTO templates (id,slug,name,category,draft_json,published_json,published_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)').bind(recordId,source.slug,source.name,source.category,JSON.stringify({...legacy,motif:'privatni motiv nacrta',seoTitle:'Privatni naslov'}),snapshot,stamp,stamp,stamp).run();
  await page.goto(origin + '/pozivnice/' + source.slug + '/');
  assert.equal(await page.title(), source.seoTitle);
  const published = await (await request('/api/templates/' + recordId)).json();
  assert.equal(published.seoTitle, source.seoTitle);
  assert.equal(published.updatedAt, stamp);
  const untouched = await local.db.prepare('SELECT published_json,published_at,slug FROM templates WHERE id=?').bind(recordId).first();
  assert.equal(untouched.published_json, snapshot);
  assert.equal(untouched.published_at, stamp);
  assert.equal(untouched.slug, source.slug);
  // New future templates with no hand-written SEO title use the same policy.
  const futureId = crypto.randomUUID(), futureSlug = 'zvezdana-druzina-stalna-adresa';
  await local.db.prepare('INSERT INTO templates (id,slug,name,category,draft_json,published_json,published_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)').bind(futureId,futureSlug,automatic.name,automatic.category,JSON.stringify(automatic),JSON.stringify(automatic),stamp,stamp,stamp).run();
  await page.goto(origin + '/pozivnice/' + futureSlug + '/');
  assert.equal(await page.title(), publicAutomatic.seoTitle);
  assert.equal(await page.locator('h1').innerText(), publicAutomatic.seoTitle);
  await local.db.prepare('UPDATE templates SET published_json=? WHERE id=?').bind(JSON.stringify({...automatic,seoTitle:'Posebna svemirska pozivnica — Zvezdana družina'}),futureId).run();
  await page.reload();
  assert.equal(await page.title(), 'Posebna svemirska pozivnica — Zvezdana družina');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({width,height:900});
    const longest = [...publicTemplates].sort((a,b)=>b.seoTitle.length-a.seoTitle.length)[0];
    await page.goto(origin + '/pozivnice/' + (longest.slug || longest.id) + '/');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Long heading overflow at ' + width);
    if (width === 390) await page.screenshot({path:'/tmp/napravi-title-mobile.png',fullPage:true});
  }
  console.log('PASS: all ' + titles.size + ' invitation pages expose distinct descriptive H1/title/social/image names without JavaScript; canonical URLs and card names stay intact; future automatic/custom titles, published snapshots and responsive headings work.');
} finally { await browser?.close(); await local.runtime.dispose(); }
