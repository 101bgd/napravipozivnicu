import { HttpError, json, checkMutation, noStoreHeaders } from './auth.js';
import { normalizeDesign, referencedAssets, isAssetId, upgradeTemplateTitle } from '../src/template-schema.js';
import { curatedTemplates } from '../src/curated-catalog.js';
import { isRetiredRecord } from '../src/retired-templates.js';
import { removeRetiredTemplates } from './retired-cleanup.js';
import { readAdSense } from './adsense.js';
import { usageStatistics } from './usage.js';
import { normalizeAdSense, adSenseCode } from '../src/adsense-config.js';
const now = () => new Date().toISOString();
const rowInfo = row => ({ id: row.id, slug: row.slug, name: row.name, category: row.category, version: row.version, published: Boolean(row.published_json), changed: Boolean(row.published_json && row.draft_json !== row.published_json), updatedAt: row.updated_at, publishedAt: row.published_at, draft: upgradeTemplateTitle(JSON.parse(row.draft_json)) });
async function bodyBytes(request, limit) {
  if (Number(request.headers.get('Content-Length')) > limit) throw new HttpError(413, 'Datoteka ili šablon su preveliki.');
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks = []; let total = 0;
  while (true) { const { done, value } = await reader.read(); if (done) break; total += value.length; if (total > limit) { await reader.cancel(); throw new HttpError(413, 'Datoteka ili šablon su preveliki.'); } chunks.push(value); }
  const bytes = new Uint8Array(total); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return bytes;
}
async function readJson(request) {
  try { return JSON.parse(new TextDecoder().decode(await bodyBytes(request, 120_000))); }
  catch (error) { if (error instanceof HttpError) throw error; throw new HttpError(400, 'Neispravan zahtev.'); }
}
function normalize(input) { try { return normalizeDesign(input); } catch (error) { throw new HttpError(400, error.message); } }
async function getRow(db, id) { const row = await db.prepare('SELECT * FROM templates WHERE id = ?').bind(id).first(); if (!row || isRetiredRecord(row)) throw new HttpError(404, 'Šablon ne postoji.'); return row; }
async function requireAssets(db, design, publishing = false) {
  if (publishing && !design.thumbnailId) throw new HttpError(400, 'Sačuvaj pregled šablona pre objavljivanja.');
  const fontIds = new Set(design.fonts.map(font => font.assetId));
  for (const id of referencedAssets(design)) {
    const asset = await db.prepare('SELECT * FROM assets WHERE id = ?').bind(id).first();
    if (!asset) throw new HttpError(400, 'Jedna od datoteka nedostaje. Dodaj je ponovo.');
    const expected = id === design.backgroundId ? 'background' : id === design.thumbnailId ? 'thumbnail' : fontIds.has(id) ? 'font' : null;
    if (asset.role !== expected) throw new HttpError(400, 'Datoteka ne odgovara izabranom elementu.');
  }
}
function signatureType(bytes) {
  const ascii = new TextDecoder('latin1').decode(bytes.subarray(0, 16));
  if (bytes[0] === 137 && ascii.slice(1, 4) === 'PNG' && bytes[4] === 13 && bytes[5] === 10) return 'image/png';
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'image/jpeg';
  if (ascii.slice(0, 4) === 'RIFF' && ascii.slice(8, 12) === 'WEBP') return 'image/webp';
  if (ascii.startsWith('wOF2')) return 'font/woff2';
  if (ascii.startsWith('wOFF')) return 'font/woff';
  if (ascii.startsWith('OTTO')) return 'font/otf';
  if (bytes[0] === 0 && bytes[1] === 1 && bytes[2] === 0 && bytes[3] === 0) return 'font/ttf';
  return null;
}
async function uploadAsset(request, env) {
  const bytes = await bodyBytes(request, 11 * 1024 * 1024);
  let form; try { form = await new Request(request.url, { method: 'POST', headers: { 'Content-Type': request.headers.get('Content-Type') || '' }, body: bytes }).formData(); } catch { throw new HttpError(400, 'Datoteka nije poslata ispravno.'); }
  const file = form.get('file'), role = form.get('role');
  if (!file || typeof file.arrayBuffer !== 'function' || !['background', 'thumbnail', 'font'].includes(role)) throw new HttpError(400, 'Izaberi datoteku i njenu namenu.');
  const limits = { background: 10 * 1024 * 1024, thumbnail: 600 * 1024, font: 2 * 1024 * 1024 };
  if (!file.size || file.size > limits[role]) throw new HttpError(413, 'Pozadina može biti do 10 MB, pregled do 600 KB, a font do 2 MB.');
  const data = new Uint8Array(await file.arrayBuffer()), type = signatureType(data);
  if (!type || (role === 'font' ? !type.startsWith('font/') : !type.startsWith('image/'))) throw new HttpError(400, 'Koristi PNG/JPG/WebP za slike ili WOFF2/WOFF/TTF/OTF za fontove.');
  const id = crypto.randomUUID(), name = String(form.get('name') || file.name).slice(0, 80), created = now();
  await env.MEDIA.put(id, data, { httpMetadata: { contentType: type } });
  try { await env.DB.prepare('INSERT INTO assets (id, role, name, content_type, size, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(id, role, name, type, file.size, created).run(); }
  catch (error) { await env.MEDIA.delete(id); throw error; }
  return json({ id, assetId: id, name, family: role === 'font' ? `custom-${id}` : null, url: `/media/${id}`, size: file.size }, 201);
}
export async function serveAsset(request, env, id, admin = false) {
  if (!isAssetId(id) || !env.DB || !env.MEDIA) throw new HttpError(404, 'Datoteka ne postoji.');
  const cache = !admin && request.method === 'GET' && typeof caches !== 'undefined' ? caches.default : null;
  if (cache) { const cached = await cache.match(request.url); if (cached) { if (request.headers.get('If-None-Match') === cached.headers.get('ETag')) return new Response(null, { status: 304, headers: cached.headers }); return cached; } }
  const asset = await env.DB.prepare('SELECT * FROM assets WHERE id = ?').bind(id).first();
  if (!asset || (!admin && !asset.public)) throw new HttpError(404, 'Datoteka ne postoji.');
  const object = await env.MEDIA.get(id);
  if (!object) throw new HttpError(404, 'Datoteka ne postoji.');
  const etag = object.httpEtag || `"${id}"`;
  const headers = { 'Content-Type': asset.content_type, 'Content-Length': String(asset.size), 'ETag': etag, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': admin ? 'no-store' : 'public, max-age=31536000, immutable', ...(admin ? noStoreHeaders : {}) };
  if (request.headers.get('If-None-Match') === etag) return new Response(null, { status: 304, headers });
  const response = new Response(request.method === 'HEAD' ? null : object.body, { headers });
  if (cache) await cache.put(request.url, response.clone());
  return response;
}
export async function handleAdminApi(request, env, identity) {
  checkMutation(request);
  if (!env.DB || !env.MEDIA) throw new HttpError(503, 'Poveži Cloudflare D1 bazu DB i R2 prostor MEDIA prema ADMIN-SETUP.md.');
  const path = new URL(request.url).pathname.replace(/\/$/, ''), method = request.method;
  if (path === '/api/admin/statistics' && method === 'GET') return usageStatistics(request, env);
  if (path === '/api/admin/maintenance/retired-templates' && method === 'POST') return json(await removeRetiredTemplates(env.DB));
  if (path === '/api/admin/session' && method === 'GET') return json({ email: identity.email });
  if (path === '/api/admin/adsense' && method === 'GET') {
    const settings = await readAdSense(env, true);
    return json({ ...settings, code: adSenseCode(settings) });
  }
  if (path === '/api/admin/adsense' && method === 'PUT') {
    let settings;
    try { settings = normalizeAdSense(await readJson(request)); }
    catch (error) { if (error instanceof HttpError) throw error; throw new HttpError(400, error.message); }
    await env.DB.prepare("INSERT INTO settings (key, value) VALUES ('adsense', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind(JSON.stringify(settings)).run();
    return json({ ...settings, code: adSenseCode(settings) });
  }
  if (path === '/api/admin/assets' && method === 'POST') return uploadAsset(request, env);
  if (path === '/api/admin/fonts' && method === 'GET') {
    const { results } = await env.DB.prepare("SELECT id, name, size FROM assets WHERE role = 'font' ORDER BY created_at DESC LIMIT 200").all();
    return json({ fonts: results.map(row => ({ ...row, assetId: row.id, family: `custom-${row.id}`, url: `/media/${row.id}` })) });
  }
  const assetMatch = path.match(/^\/api\/admin\/assets\/([a-f0-9-]+)\/file$/);
  if (assetMatch && ['GET', 'HEAD'].includes(method)) return serveAsset(request, env, assetMatch[1], true);
  if (path === '/api/admin/settings' && method === 'GET') {
    const setting = await env.DB.prepare("SELECT value FROM settings WHERE key = 'show_examples'").first();
    return json({ showExamples: setting?.value !== 'false' });
  }
  if (path === '/api/admin/settings' && method === 'PUT') {
    const input = await readJson(request);
    if (typeof input.showExamples !== 'boolean') throw new HttpError(400, 'Neispravno podešavanje.');
    await env.DB.prepare("INSERT INTO settings (key, value) VALUES ('show_examples', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind(String(input.showExamples)).run();
    return json({ showExamples: input.showExamples });
  }
  if (path === '/api/admin/templates') {
    if (method === 'GET') {
      const { results } = await env.DB.prepare('SELECT * FROM templates ORDER BY updated_at DESC LIMIT 500').all();
      return json({ templates: results.filter(row => !isRetiredRecord(row)).map(rowInfo) });
    }
    if (method === 'POST') {
      const design = normalize((await readJson(request)).draft); await requireAssets(env.DB, design);
      const id = crypto.randomUUID(), stamp = now();
      const curated = curatedTemplates.find(t => t.id === design.builtinSource);
      const slug = curated?.slug || `${design.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'dj').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'pozivnica'}-${id.slice(0, 6)}`;
      if (curated && await env.DB.prepare('SELECT id FROM templates WHERE slug = ?').bind(slug).first()) throw new HttpError(409, 'Ovaj dizajn već ima sačuvan nacrt. Osveži listu i otvori postojeću verziju.');
      await env.DB.prepare('INSERT INTO templates (id, slug, name, category, draft_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id, slug, design.name, design.category, JSON.stringify(design), stamp, stamp).run();
      return json(rowInfo(await getRow(env.DB, id)), 201);
    }
  }
  const match = path.match(/^\/api\/admin\/templates\/([a-f0-9-]+)(?:\/(publish|unpublish|duplicate))?$/);
  if (!match || !isAssetId(match[1])) throw new HttpError(404, 'Nepoznat zahtev.');
  const [, id, action] = match, row = await getRow(env.DB, id);
  if (!action && method === 'GET') return json(rowInfo(row));
  const input = method === 'DELETE' ? await readJson(request) : ['PUT', 'POST'].includes(method) ? await readJson(request) : {};
  if (input.version !== row.version) throw new HttpError(409, 'Šablon je promenjen u drugom prozoru. Osveži listu i otvori ga ponovo.');
  if (action === 'duplicate' && method === 'POST') {
    const design = normalize({ ...JSON.parse(row.draft_json), name: `${row.name.slice(0, 90)} — kopija` });
    const newId = crypto.randomUUID(), stamp = now();
    await env.DB.prepare('INSERT INTO templates (id, slug, name, category, draft_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(newId, `${row.slug.slice(0, 70)}-${newId.slice(0, 6)}`, design.name, design.category, JSON.stringify(design), stamp, stamp).run();
    return json(rowInfo(await getRow(env.DB, newId)), 201);
  }
  let result;
  if (!action && method === 'PUT') {
    const design = normalize(input.draft); await requireAssets(env.DB, design);
    result = await env.DB.prepare('UPDATE templates SET name = ?, category = ?, draft_json = ?, updated_at = ?, version = version + 1 WHERE id = ? AND version = ?').bind(design.name, design.category, JSON.stringify(design), now(), id, row.version).run();
  } else if (action === 'publish' && method === 'POST') {
    const design = normalize(JSON.parse(row.draft_json)); await requireAssets(env.DB, design, true);
    const statements = [env.DB.prepare('UPDATE templates SET published_json = draft_json, published_at = ?, updated_at = ?, version = version + 1 WHERE id = ? AND version = ?').bind(now(), now(), id, row.version), ...referencedAssets(design).map(assetId => env.DB.prepare('UPDATE assets SET public = 1 WHERE id = ? AND EXISTS (SELECT 1 FROM templates WHERE id = ? AND version = ? AND published_json = ?)').bind(assetId, id, row.version + 1, row.draft_json))];
    if (design.builtinSource) statements.push(env.DB.prepare('INSERT INTO settings (key, value) SELECT ?, ? WHERE EXISTS (SELECT 1 FROM templates WHERE id = ? AND version = ? AND published_json = ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').bind(`example_hidden:${design.builtinSource}`, 'true', id, row.version + 1, row.draft_json));
    [result] = await env.DB.batch(statements);
  } else if (action === 'unpublish' && method === 'POST') {
    result = await env.DB.prepare('UPDATE templates SET published_json = NULL, published_at = NULL, updated_at = ?, version = version + 1 WHERE id = ? AND version = ?').bind(now(), id, row.version).run();
  } else if (!action && method === 'DELETE') {
    result = await env.DB.prepare('DELETE FROM templates WHERE id = ? AND version = ?').bind(id, row.version).run();
    if (!result.meta.changes) throw new HttpError(409, 'Šablon je upravo promenjen. Osveži listu.');
    return json({ deleted: true });
  } else throw new HttpError(405, 'Metoda nije podržana.');
  if (!result.meta.changes) throw new HttpError(409, 'Šablon je upravo promenjen. Osveži listu.');
  return json(rowInfo(await getRow(env.DB, id)));
}
