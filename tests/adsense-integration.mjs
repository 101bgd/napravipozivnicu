import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';
import { createLocalRuntime, root } from '../scripts/local-runtime.mjs';
import { publicTemplates } from '../src/curated-catalog.js';
import { CATEGORY_CONTENT, categoryPath } from '../src/seo-content.js';
import { INFO_PAGES } from '../src/info-content.js';
import { GUIDE_HUB, GUIDES } from '../src/guide-catalog.js';
import { adSenseCode } from '../src/adsense-config.js';

const origin = 'https://napravipozivnicu.com';
const publisherId = 'ca-pub-1234567890123456', slotId = '1234567890';
const code = adSenseCode({ publisherId, slotId });
const local = await createLocalRuntime();
let browser;
try {
  const token = await local.token();
  const headers = { 'Cf-Access-Jwt-Assertion': token, Origin: origin, 'X-Requested-With': 'template-studio', 'Content-Type': 'application/json' };
  const worker = (path, init = {}) => local.runtime.dispatchFetch(`${origin}${path}`, init);
  const save = input => worker('/api/admin/adsense', { method: 'PUT', headers, body: JSON.stringify(input) });
  const saved = async () => (await worker('/api/admin/adsense', { headers })).json();
  const paths = ['/', '/pozivnice/', ...Object.keys(CATEGORY_CONTENT).map(categoryPath), ...INFO_PAGES.map(page => page.path), ...[GUIDE_HUB, ...GUIDES].map(page => page.path), ...publicTemplates.map(template => `/pozivnice/${template.slug || template.id}/`)];
  assert.equal((await worker('/api/admin/adsense')).status, 401);
  assert.equal((await worker('/api/admin/adsense', { method: 'PUT', body: '{}' })).status, 401);
  assert.equal((await worker('/api/admin/adsense', { method: 'PUT', headers: { ...headers, Origin: 'https://stranger.invalid' }, body: '{}' })).status, 403);
  assert.equal((await worker('/api/admin/adsense', { method: 'PUT', headers: { ...headers, 'X-Requested-With': '' }, body: '{}' })).status, 403);
  assert.deepEqual(await saved(), { enabled: false, publisherId: '', slotId: '', code: '' });
  for (const path of paths) {
    const response = await worker(path); assert.equal(response.status, 200);
    const html = await response.text(); assert.equal((html.match(/class="ad-placement container"/g) || []).length, 1, path);
    assert.match(html, /class="ad-placement container" aria-label="Oglas" hidden/);
    assert.equal(html.includes('id="adsense-config"'), false);
  }
  const emptyTxt = await worker('/ads.txt'); assert.equal(emptyTxt.status, 404); assert.match(emptyTxt.headers.get('Content-Type'), /text\/plain/);
  for (const input of [
    { enabled: true, code: '' }, { enabled: true, code: `<script src="https://evil.invalid/payload.js"></script>` },
    { enabled: true, code: 'ca-pub-12345678901234567' }, { enabled: true, code: `${publisherId} data-ad-slot="123"` },
    { enabled: true, code: `${code} ca-pub-9999999999999999` }, { enabled: true, code: `${code} data-ad-slot="9876543210"` },
    { enabled: false, code: 'x'.repeat(20001) }, { enabled: 'true', code },
  ]) assert.equal((await save(input)).status, 400);
  assert.equal((await saved()).enabled, false);
  assert.equal((await save({ enabled: false, code: publisherId })).status, 200);
  let html = await (await worker('/')).text();
  assert.match(html, /name="google-adsense-account" content="ca-pub-1234567890123456"/);
  assert.equal(html.includes('id="adsense-config"'), false);
  assert.equal((await save({ enabled: true, code: publisherId })).status, 400);
  // Extra pasted scripts/HTML never become executable public markup or stored code.
  assert.equal((await save({ enabled: true, code: `${code}<script>window.pwned=true</script><img src=x onerror="window.pwned=true">` })).status, 200);
  assert.equal((await saved()).code, code);
  const stored = JSON.parse((await local.db.prepare("SELECT value FROM settings WHERE key = 'adsense'").first()).value);
  assert.deepEqual(stored, { enabled: true, publisherId, slotId });
  for (const path of paths) {
    const response = await worker(path); assert.equal(response.status, 200);
    html = await response.text(); assert.equal((html.match(/class="adsbygoogle ad-unit"/g) || []).length, 1, path);
    assert.equal((html.match(/id="adsense-config"/g) || []).length, 1);
    assert.equal((html.match(/name="google-adsense-account"/g) || []).length, 1);
    assert.equal(html.includes('window.pwned'), false); assert.equal(html.includes('evil.invalid'), false);
    assert.match(html, /data-ad-client="ca-pub-1234567890123456" data-ad-slot="1234567890"/);
  }
  const adsTxt = await worker('/ads.txt'); assert.equal(adsTxt.status, 200);
  assert.equal(await adsTxt.text(), 'google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n');
  const head = await worker('/ads.txt', { method: 'HEAD' }); assert.equal(head.status, 200); assert.equal(await head.text(), '');
  for (const host of ['preview.pages.dev', 'localhost', 'unrelated.invalid']) {
    html = await (await local.runtime.dispatchFetch(`https://${host}/`)).text();
    assert.equal(html.includes('id="adsense-config"'), false); assert.equal(html.includes('google-adsense-account'), false);
  }
  html = await (await local.runtime.dispatchFetch('https://www.napravipozivnicu.com/')).text(); assert.ok(html.includes('id="adsense-config"'));
  html = await (await worker('/admin/sabloni/', { headers })).text(); assert.equal(html.includes('id="adsense-config"'), false);
  assert.equal((await worker('/api/catalog')).headers.get('Content-Type').includes('application/json'), true);
  console.log(`PASS: ${paths.length} public pages have one disabled/enabled placement; authenticated CSRF-protected settings reject invalid codes, discard arbitrary scripts, preserve verification-only mode and generate ads.txt; admin/previews have no ads.`);

  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  let mode = 'filled'; const sdkRequests = [], errors = [];
  async function context(extraHTTPHeaders = {}) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, extraHTTPHeaders });
    await ctx.route('**/*', async route => {
      const request = route.request(), url = new URL(request.url());
      if (url.origin === origin) {
        const response = await local.runtime.dispatchFetch(request.url(), { method: request.method(), headers: request.headers(), body: request.postDataBuffer() || undefined });
        await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: Buffer.from(await response.arrayBuffer()) });
      } else if (url.hostname === 'pagead2.googlesyndication.com') {
        sdkRequests.push(url.href);
        if (mode === 'blocked') return route.abort('blockedbyclient');
        await route.fulfill({ contentType: 'text/javascript', body: `window.__sdkLoads=(window.__sdkLoads||0)+1;window.adsbygoogle={push(){window.__adPushes=(window.__adPushes||0)+1;const unit=document.querySelector('ins.adsbygoogle');unit.textContent='Test oglas';unit.dataset.adStatus='${mode}';}};` });
      } else await route.abort();
    });
    return ctx;
  }
  const visitor = await context(), page = await visitor.newPage(); page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin); await page.evaluate(() => document.fonts.ready);
  assert.equal(sdkRequests.length, 0, 'No AdSense SDK request before the lower placement approaches the viewport');
  assert.equal(await page.evaluate(() => window.pwned), undefined);
  await page.locator('.ad-placement').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('ins.adsbygoogle')?.dataset.adStatus === 'filled');
  assert.equal(sdkRequests.length, 1); assert.equal(await page.evaluate(() => window.__adPushes), 1);
  const moduleFile = (await fs.readdir(`${root}dist/assets`)).find(name => /^adsense-.*\.js$/.test(name));
  await page.evaluate(async path => { (await import(path)).initializeAds(); }, `/assets/${moduleFile}`);
  assert.equal(sdkRequests.length, 1); assert.equal(await page.evaluate(() => window.__adPushes), 1);
  for (const width of [320, 390, 768, 1440]) { await page.setViewportSize({ width, height: 900 }); assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Ad overflow at ${width}`); }
  mode = 'unfilled'; await page.goto(`${origin}/kontakt/`); await page.locator('footer').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.ad-placement')?.hidden);
  mode = 'blocked'; await page.goto(`${origin}/o-sajtu/`); await page.locator('footer').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.ad-placement')?.hidden);
  console.log('PASS: real browser lazily loads the mocked SDK once, initializes the unit once, supports 320–1440px layouts, and hides unfilled or blocked ads without executing pasted scripts.');

  const owner = await context({ 'Cf-Access-Jwt-Assertion': token }), admin = await owner.newPage();
  admin.on('pageerror', error => errors.push(error.message)); admin.on('dialog', dialog => dialog.accept());
  const beforeAdmin = sdkRequests.length;
  await admin.goto(`${origin}/admin/sabloni/#adsense`);
  await admin.locator('#adsense-code').waitFor({ state: 'visible' });
  assert.equal(await admin.locator('#adsense-code').inputValue(), code);
  assert.equal(await admin.locator('#adsense-form [name="enabled"]').isChecked(), true);
  await admin.locator('#adsense-code').fill('neispravan kod');
  await admin.locator('#adsense-form [type="submit"]').click();
  await admin.waitForFunction(() => document.querySelector('#adsense-result').textContent.includes('Nalepi kod jednog'));
  assert.equal((await saved()).enabled, true);
  await admin.locator('#adsense-code').fill(code); await admin.locator('#adsense-form [name="enabled"]').uncheck();
  await admin.locator('#adsense-form [type="submit"]').click();
  await admin.waitForFunction(() => document.querySelector('#adsense-result').textContent.includes('Sačuvano. Oglasi su isključeni.'));
  assert.equal((await saved()).enabled, false);
  const disabledStart = sdkRequests.length; await page.goto(origin); await page.locator('footer').scrollIntoViewIfNeeded();
  assert.equal(await page.locator('.ad-placement').isVisible(), false); assert.equal(sdkRequests.length, disabledStart);
  await admin.reload(); await admin.locator('#adsense-code').waitFor({ state: 'visible' });
  assert.equal(await admin.locator('#adsense-code').inputValue(), code); assert.equal(await admin.locator('#adsense-form [name="enabled"]').isChecked(), false);
  for (const width of [320, 390, 768, 1440]) { await admin.setViewportSize({ width, height: 900 }); assert.ok(await admin.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Ad settings overflow at ${width}`); }
  await admin.setViewportSize({ width: 390, height: 844 }); await admin.screenshot({ path: '/tmp/napravi-adsense-admin-mobile.png', fullPage: false });
  assert.equal(sdkRequests.length, beforeAdmin, 'Admin and disabled public pages must not contact AdSense');
  await admin.locator('#adsense-code').fill(adSenseCode({ publisherId: 'ca-pub-9999999999999999', slotId: '9876543210' }));
  await admin.locator('#adsense-form [name="enabled"]').check(); await admin.locator('#adsense-form [type="submit"]').click();
  await admin.waitForFunction(() => document.querySelector('#adsense-result').textContent.includes('Sačuvano. Oglasi su uključeni na javnom domenu.'));
  assert.match(await (await worker('/ads.txt')).text(), /pub-9999999999999999/);
  assert.match(await (await worker('/')).text(), /data-ad-slot="9876543210"/);
  assert.deepEqual(errors, []);
  console.log('PASS: admin code field persists settings, reports validation errors, disables public requests immediately, restores saved code after reload and changes account/unit without rebuilding. No real Google ad requests were made.');
} finally { await browser?.close(); await local.runtime.dispose(); }
