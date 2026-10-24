import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createLocalRuntime } from '../../../../scripts/local-runtime.mjs';
import { batchCatalog } from './designs.mjs';
const local = await createLocalRuntime();
const results = [];
try {
  const map = await (await local.runtime.dispatchFetch('https://napravipozivnicu.com/sitemap.xml')).text();
  for (const meta of batchCatalog) {
    const response = await local.runtime.dispatchFetch(`https://napravipozivnicu.com/api/templates/${meta.id}`);
    assert.equal(response.status, 200);
    const design = await response.json();
    assert.equal(design.id, meta.id);
    assert.equal(design.layers.some(layer => layer.type === 'photo'), false);
    assert.ok(design.layers.filter(layer => ['names','bride','groom'].includes(layer.field)).every(layer => layer.fitToWidth === true));
    for (const field of ['date', 'time', 'location']) assert.ok(design.layers.some(layer => layer.field === field && layer.editable));
    if (['first', 'eighteen', 'birthday'].includes(meta.category)) assert.ok(design.layers.some(layer => layer.field === 'age' && layer.editable));
    const page = await local.runtime.dispatchFetch(`https://napravipozivnicu.com/pozivnice/${meta.slug}/`);
    assert.equal(page.status, 200);
    const html = await page.text();
    assert.ok(html.includes(meta.seoTitle));
    assert.ok(map.includes(meta.slug));
    results.push({ id: meta.id, workerStartup: 'passed', templateApi: 'passed', page: 'passed', sitemap: 'passed', editableFields: 'passed' });
  }
  await fs.writeFile(new URL('./worker-checks.json', import.meta.url), JSON.stringify(results, null, 2) + '\n');
  console.log('PASS: real Cloudflare Worker starts and serves all six editable templates, SEO pages and sitemap entries.');
} finally { await local.runtime.dispose(); }

