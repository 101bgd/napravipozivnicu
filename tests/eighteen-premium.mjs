import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { createLocalRuntime } from '../scripts/local-runtime.mjs';
import { eighteenPremiumTemplates as templates } from '../src/eighteen-premium-catalog.js';
import { publicTemplates } from '../src/curated-catalog.js';
import { buildTemplateTitle } from '../src/template-titles.js';
import { categoryPath } from '../src/seo-content.js';
import { latestTemplates } from '../src/latest-templates.js';
import { DEFAULT_ADSENSE, adSenseCode } from '../src/adsense-config.js';
import { GOOGLE_TAG_ID, GOOGLE_TAG_URL } from '../server/google-tag.js';

// Run after npm run build. All page/API/assets requests use the compiled Worker;
// Google scripts are mocked or blocked, and no browser request reaches Google.
const origin = 'https://napravipozivnicu.com';
const artifacts = '/workspace/artifacts/eighteen-oct28/qa';
const count = (text, needle) => text.split(needle).length - 1;
const templatePath = template => `/pozivnice/${template.slug}/`;
const longName = 'Aleksandra Teodora Konstantinović-Đorđević';
const values = { names: longName, date: '2027-06-19', time: '20:30', location: 'Sala Čarolija, Žička 18, Niš', rsvp: 'Potvrdi dolazak do 12. juna: 060 123 4567' };
const errors = [], thirdPartyRequests = [], failedLocalRequests = [];
let local, browser, googleMode = 'mock';

function assertTags(html, label, { publisherId = DEFAULT_ADSENSE.publisherId, manual = false } = {}) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1];
  assert.ok(head, `${label}: head`);
  assert.equal(count(html, `src="${GOOGLE_TAG_URL}"`), 1, `${label}: one GA loader`);
  assert.equal(count(html, `gtag('config', '${GOOGLE_TAG_ID}')`), 1, `${label}: one GA config`);
  assert.equal(count(html, 'src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='), 1, `${label}: one AdSense loader`);
  assert.equal(count(html, 'name="google-adsense-account"'), 1, `${label}: one publisher meta`);
  assert.ok(head.includes(adSenseCode({ publisherId, slotId: '' })), `${label}: AdSense code in head`);
  assert.equal(count(html, 'class="ad-placement container"'), 1, `${label}: one global placement`);
  assert.equal(count(html, 'class="adsbygoogle ad-unit"'), Number(manual), `${label}: manual unit`);
  assert.equal(count(html, 'id="adsense-config"'), Number(manual), `${label}: manual configuration`);
}

function assertNamePaint(paints, name, layer, label) {
  // Observe the real canvas calls rather than reimplementing the fit algorithm.
  // Most fonts paint a whole line; letter-spaced layers paint individual glyphs.
  let group;
  for (let start = paints.length - 1; start >= 0; start--) {
    let text = '', candidate = [];
    for (let index = start; index < paints.length && text.length < name.length; index++) {
      const paint = paints[index];
      if (candidate.length && (paint.font !== candidate[0].font || JSON.stringify(paint.transform) !== JSON.stringify(candidate[0].transform))) break;
      candidate.push(paint); text += paint.text;
      if (text === name) { group = candidate; break; }
      if (!name.startsWith(text)) break;
    }
    if (group) break;
  }
  assert.ok(group, `${label}: every character of the long name was painted on one line`);
  assert.ok(group.every(paint => paint.y === group[0].y), `${label}: name stays on its intended line`);
  const size = Number(group[0].font.match(/([\d.]+)px/)?.[1]);
  assert.ok(size > 8 && size < layer.size, `${label}: long name reduces the original font (${size} < ${layer.size})`);
  const left = Math.min(...group.map(paint => paint.x - paint.left));
  const right = Math.max(...group.map(paint => paint.x + paint.right));
  assert.ok(right - left <= layer.width / 100 * 500 + 4, `${label}: glyphs fit the name's allocated width`);
  for (const paint of group) {
    const [a, b, c, d, e, f] = paint.transform;
    for (const x of [paint.x - paint.left, paint.x + paint.right]) {
      for (const y of [paint.y - paint.ascent, paint.y + paint.descent]) {
        const px = a * x + c * y + e, py = b * x + d * y + f;
        assert.ok(px >= -1 && px <= paint.width + 1 && py >= -1 && py <= paint.height + 1, `${label}: painted glyph remains inside the canvas (${px}, ${py})`);
      }
    }
  }
}

try {
  assert.deepEqual(templates.map(template => template.id).sort(), ['bordo-gala', 'oniks-potpis']);
  for (const field of ['name', 'slug', 'seoTitle', 'description', 'imageAlt']) assert.equal(new Set(templates.map(template => template[field])).size, 2, `Distinct ${field}`);
  for (const template of templates) {
    assert.equal(template.category, 'eighteen');
    assert.equal(template.seoTitle, buildTemplateTitle(template));
    assert.ok(template.motif && template.imageAlt.length > 60);
  }
  await fs.mkdir(artifacts, { recursive: true });
  local = await createLocalRuntime();
  const worker = (urlPath, init = {}) => local.runtime.dispatchFetch(`${origin}${urlPath}`, init);
  const catalog = (await (await worker('/api/catalog')).json()).templates;
  const sitemap = await (await worker('/sitemap.xml')).text();
  const layouts = new Map();
  for (const template of templates) {
    assert.equal(catalog.filter(item => item.id === template.id && item.category === 'eighteen').length, 1);
    assert.equal(count(sitemap, `<loc>${origin}${templatePath(template)}</loc>`), 1, `${template.id}: sitemap`);
    const response = await worker(`/api/templates/${template.id}`);
    assert.equal(response.status, 200);
    const design = await response.json(); layouts.set(template.id, design);
    assert.equal(design.category, 'eighteen');
    assert.equal(design.seoTitle, template.seoTitle);
    assert.equal(design.imageAlt, template.imageAlt);
    assert.equal(design.layers.some(layer => layer.type === 'photo'), false);
    for (const field of Object.keys(values)) assert.ok(design.layers.some(layer => layer.type === 'text' && layer.field === field && layer.editable), `${template.id}: editable ${field}`);
    assert.equal(design.layers.find(layer => layer.field === 'names').fitToWidth, true);
    assert.ok(design.fonts.length >= 2, `${template.id}: custom display and script fonts`);
    const html = await (await worker(templatePath(template))).text();
    assertTags(html, template.id);
  }
  assert.equal(new Set([...layouts.values()].map(design => design.backgroundId)).size, 2, 'Each design has its own background');

  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  async function context(options = {}) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true, reducedMotion: 'reduce', ...options });
    await ctx.route('**/*', async route => {
      const req = route.request(), url = new URL(req.url());
      if (url.origin === origin) {
        const response = await local.runtime.dispatchFetch(req.url(), { method: req.method(), headers: req.headers(), body: req.postDataBuffer() || undefined, redirect: 'manual' });
        if (!response.ok) failedLocalRequests.push(`${response.status} ${url.pathname}`);
        await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: Buffer.from(await response.arrayBuffer()) });
      } else if (url.href === GOOGLE_TAG_URL || url.hostname === 'pagead2.googlesyndication.com') {
        thirdPartyRequests.push(url.href);
        if (googleMode === 'blocked') return route.abort('blockedbyclient');
        await route.fulfill({ contentType: 'text/javascript', body: url.href === GOOGLE_TAG_URL
          ? 'window.__qaGaLoads=(window.__qaGaLoads||0)+1;'
          : `window.__qaAdLoads=(window.__qaAdLoads||0)+1;window.adsbygoogle={push(){window.__qaAdPushes=(window.__qaAdPushes||0)+1;const unit=document.querySelector('ins.adsbygoogle');if(unit){unit.textContent='Test oglas';unit.dataset.adStatus='filled';}}};` });
      } else {
        thirdPartyRequests.push(url.href);
        await route.abort('blockedbyclient');
      }
    });
    await ctx.addInitScript(() => {
      const original = CanvasRenderingContext2D.prototype.fillText;
      CanvasRenderingContext2D.prototype.fillText = function(text, x, y, ...rest) {
        if (this.canvas.id === 'editor-canvas') {
          const metrics = this.measureText(text), m = this.getTransform();
          (window.__qaTextPaints ||= []).push({ text: String(text), x, y, font: this.font, left: metrics.actualBoundingBoxLeft, right: metrics.actualBoundingBoxRight, ascent: metrics.actualBoundingBoxAscent, descent: metrics.actualBoundingBoxDescent, transform: [m.a, m.b, m.c, m.d, m.e, m.f], width: this.canvas.width, height: this.canvas.height });
        }
        return original.call(this, text, x, y, ...rest);
      };
    });
    ctx.on('page', page => page.on('pageerror', error => errors.push(error.message)));
    return ctx;
  }
  const noJs = await context({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  for (const template of templates) {
    await staticPage.goto(`${origin}${templatePath(template)}`);
    assert.equal(await staticPage.locator('h1').count(), 1);
    assert.equal(await staticPage.locator('h1').innerText(), template.seoTitle);
    assert.equal(await staticPage.title(), template.seoTitle);
    assert.equal(await staticPage.locator('meta[name="description"]').getAttribute('content'), template.description);
    assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href'), `${origin}${templatePath(template)}`);
    assert.equal(await staticPage.locator('.detail-preview img').getAttribute('alt'), template.imageAlt);
    const graph = JSON.parse(await staticPage.locator('script[type="application/ld+json"]').textContent())['@graph'];
    assert.ok(graph.some(item => item['@type'] === 'ImageObject' && item.caption === template.imageAlt));
    assert.equal(await staticPage.locator('.ad-placement[hidden]').count(), 1);
    await staticPage.screenshot({ path: path.join(artifacts, `${template.id}-page-mobile.png`), fullPage: true });
  }
  await staticPage.goto(`${origin}${categoryPath('eighteen')}`);
  for (const template of templates) assert.ok(await staticPage.locator(`a[href="${templatePath(template)}"]`).count() > 0, `${template.id}: category link exists without JS`);
  await staticPage.goto(origin);
  const latest = latestTemplates(publicTemplates).find(template => template.category === 'eighteen');
  assert.ok(templates.some(template => template.id === latest?.id), 'One of the new designs represents eighteen on the homepage');
  assert.equal(await staticPage.locator(`.latest-card .latest-link[href="${templatePath(latest)}"]`).count(), 1);
  await noJs.close();

  const visitor = await context();
  const page = await visitor.newPage();
  const finishDrawing = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  async function open(template) {
    await page.locator('[data-open-template]').click();
    await page.waitForFunction(() => document.querySelector('#editor')?.open);
    await finishDrawing();
    assert.equal(await page.locator('#selected-design').innerText(), template.name);
  }
  async function assertNoOverflow(label) {
    const dimensions = await page.evaluate(() => {
      const dialog = document.querySelector('#editor'), canvas = document.querySelector('#editor-canvas');
      const box = canvas.getBoundingClientRect();
      return { page: document.documentElement.scrollWidth, viewport: innerWidth, dialog: dialog.scrollWidth, dialogWidth: dialog.clientWidth, canvasLeft: box.left, canvasRight: box.right };
    });
    assert.ok(dimensions.page <= dimensions.viewport, `${label}: page has no horizontal overflow`);
    assert.ok(dimensions.dialog <= dimensions.dialogWidth, `${label}: editor has no horizontal overflow`);
    assert.ok(dimensions.canvasLeft >= -1 && dimensions.canvasRight <= dimensions.viewport + 1, `${label}: preview fits viewport`);
  }
  for (const template of templates) {
    const design = layouts.get(template.id), nameLayer = design.layers.find(layer => layer.field === 'names');
    await page.goto(`${origin}${templatePath(template)}`);
    assert.equal(await page.evaluate(() => window.__qaGaLoads), 1);
    assert.equal(await page.evaluate(() => window.__qaAdLoads), 1);
    assert.equal(await page.locator('head script[src*="adsbygoogle.js"]').count(), 1);
    await open(template);
    assert.equal(await page.locator('#tab-photo').isVisible(), false);
    for (const font of design.fonts.filter(font => design.layers.some(layer => layer.family === font.family))) {
      assert.ok(await page.evaluate(family => [...document.fonts].some(face => face.family === family && face.status === 'loaded'), font.family), `${template.id}: ${font.name} loaded`);
    }
    const original = await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL('image/png'));
    await fs.writeFile(path.join(artifacts, `${template.id}-original.png`), Buffer.from(original.split(',')[1], 'base64'));
    await page.evaluate(() => { window.__qaTextPaints = []; });
    await page.locator('[name="names"]').fill(longName);
    await finishDrawing();
    const paintedName = nameLayer.uppercase ? longName.toLocaleUpperCase('sr') : longName;
    assertNamePaint(await page.evaluate(() => window.__qaTextPaints), paintedName, nameLayer, template.id);
    for (const [field, value] of Object.entries(values).filter(([field]) => field !== 'names')) await page.locator(`#panel-text [name="${field}"]`).fill(value);
    await finishDrawing();
    assert.notEqual(await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL('image/png')), original, `${template.id}: personal data changes the actual preview`);
    await page.locator('[data-panel="style"]').click();
    await page.locator('#style-layer').selectOption(nameLayer.id);
    const size = String(Math.max(9, Math.floor(nameLayer.size - 3))), color = nameLayer.color.toLowerCase() === '#94734e' ? '#856846' : '#94734e';
    const beforeStyle = await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL());
    await page.locator('[data-style="size"]').fill(size);
    await page.locator('[data-style="color"]').evaluate((input, value) => { input.value = value; input.dispatchEvent(new Event('input', { bubbles: true })); }, color);
    await finishDrawing();
    assert.notEqual(await page.locator('#editor-canvas').evaluate(canvas => canvas.toDataURL()), beforeStyle, `${template.id}: basic styles change canvas`);
    await page.locator('.save-draft').click();
    const draft = await page.evaluate(id => JSON.parse(localStorage.getItem(`invitation-${id}`)), template.id);
    for (const [field, value] of Object.entries(values)) assert.equal(draft[field], value);
    assert.equal(draft.layerStyles[nameLayer.id].size, Number(size));
    assert.equal(draft.layerStyles[nameLayer.id].color, color);

    // A new document must restore text and style at every supported layout size.
    for (const width of [320, 390, 1440]) {
      await page.keyboard.press('Escape');
      await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
      await page.reload();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${template.id}: public page at ${width}`);
      await open(template);
      for (const [field, value] of Object.entries(values)) assert.equal(await page.locator(`#panel-text [name="${field}"]`).inputValue(), value, `${template.id}: restored ${field} at ${width}`);
      await page.locator('[data-panel="style"]').click();
      await page.locator('#style-layer').selectOption(nameLayer.id);
      assert.equal(await page.locator('[data-style="size"]').inputValue(), size);
      assert.equal(await page.locator('[data-style="color"]').inputValue(), color);
      await assertNoOverflow(`${template.id} at ${width}`);
      await page.locator('[data-panel="text"]').click();
      await page.locator('#panel-text [name="names"]').blur();
      await page.screenshot({ path: path.join(artifacts, `${template.id}-editor-${width}.png`) });
    }
    for (const kind of ['png', 'pdf']) {
      const downloaded = page.waitForEvent('download');
      await page.locator(`.export-${kind}`).click();
      const download = await downloaded, filename = path.join(artifacts, `${template.id}-personalized.${kind}`);
      assert.equal(await download.failure(), null);
      await download.saveAs(filename);
      const bytes = await fs.readFile(filename);
      if (kind === 'png') {
        assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
        assert.equal(bytes.readUInt32BE(16), 1500); assert.equal(bytes.readUInt32BE(20), 2100);
      } else {
        assert.equal(bytes.subarray(0, 4).toString(), '%PDF');
        const box = bytes.toString('latin1').match(/\/MediaBox\s*\[0 0 ([\d.]+) ([\d.]+)\]/);
        assert.ok(box && Math.abs(Number(box[1]) - 360) < .001 && Math.abs(Number(box[2]) - 504) < .001, 'PDF page is 127 × 177.8 mm');
      }
    }
    const commands = await page.evaluate(() => window.dataLayer.map(item => Array.from(item)));
    assert.equal(commands.filter(command => command[0] === 'config' && command[1] === GOOGLE_TAG_ID).length, 1);
    assert.equal(JSON.stringify(commands).includes(longName), false, 'Editor data never enters Google dataLayer');
    await page.keyboard.press('Escape');
  }

  const token = await local.token(), auth = { 'Cf-Access-Jwt-Assertion': token };
  const owner = await context({ extraHTTPHeaders: auth }), admin = await owner.newPage();
  const beforeAdmin = thirdPartyRequests.length;
  await admin.goto(`${origin}/admin/sabloni/`);
  await admin.locator(`[data-action="edit-curated"][data-id="${templates[0].id}"]`).waitFor({ state: 'visible' });
  for (const template of templates) assert.equal(await admin.locator(`[data-action="edit-curated"][data-id="${template.id}"]`).count(), 1, `${template.id}: present in authenticated admin`);
  assert.equal(thirdPartyRequests.length, beforeAdmin, 'Admin does not load Google scripts');
  await admin.screenshot({ path: path.join(artifacts, 'admin-mobile.png') });

  const publisherId = 'ca-pub-1234567890123456', slotId = '1234567890';
  const saved = await worker('/api/admin/adsense', { method: 'PUT', headers: { ...auth, Origin: origin, 'X-Requested-With': 'template-studio', 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled: true, code: adSenseCode({ publisherId, slotId }) }) });
  assert.equal(saved.status, 200, 'Authenticated admin API enables a concrete manual unit');
  await saved.arrayBuffer();
  for (const template of templates) {
    assertTags(await (await worker(templatePath(template))).text(), `${template.id} with manual ad`, { publisherId, manual: true });
    await page.goto(`${origin}${templatePath(template)}`);
    assert.equal(await page.locator('.ad-placement').count(), 1);
    assert.equal(await page.locator('ins.adsbygoogle').getAttribute('data-ad-client'), publisherId);
    assert.equal(await page.locator('ins.adsbygoogle').getAttribute('data-ad-slot'), slotId);
    await page.locator('.ad-placement').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('ins.adsbygoogle')?.dataset.adStatus === 'filled');
    assert.equal(await page.evaluate(() => window.__qaAdLoads), 1);
    assert.equal(await page.evaluate(() => window.__qaAdPushes), 1);
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${template.id}: enabled ad fits ${width}`);
    }
  }
  googleMode = 'blocked';
  for (const template of templates) {
    await page.goto(`${origin}${templatePath(template)}`);
    await open(template);
    await page.locator('[name="names"]').fill('Đorđe Živković');
    await finishDrawing();
    assert.equal(await page.locator('[name="names"]').inputValue(), 'Đorđe Živković');
    await page.keyboard.press('Escape');
  }
  assert.deepEqual(failedLocalRequests, []);
  assert.deepEqual(errors, []);
  assert.ok(thirdPartyRequests.length > 0);
  assert.ok(thirdPartyRequests.every(url => url === GOOGLE_TAG_URL || new URL(url).hostname === 'pagead2.googlesyndication.com'), 'Only the expected Google scripts were intercepted');
  console.log('PASS: two eighteenth-birthday designs have distinct crawlable SEO, category/sitemap/latest/admin presence, loaded custom fonts, editable text/style, fitted long names, restored 320/390/1440px drafts, actual 1500×2100 PNG and 127×177.8mm PDF exports, and one global AdSense placement with single GA/AdSense codes. Manual units work after authenticated admin settings; editors work with blocked Google scripts. No real Google requests.');
  console.log(`Visual evidence: ${artifacts}`);
} finally {
  await browser?.close();
  await local?.runtime.dispose();
}
