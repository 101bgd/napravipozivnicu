import { HttpError, json, noStoreHeaders } from './auth.js';

const events = new Set(['template_select', 'editor_open', 'download_png', 'download_pdf', 'export_error']);
const initialized = new WeakMap(), catalogs = new WeakMap();
const date = offset => new Date(Date.now() - offset * 86400000).toISOString().slice(0, 10);

async function ensureTable(db) {
  if (!db) throw new HttpError(503, 'Statistika trenutno nije dostupna.');
  const today = date(0), cached = initialized.get(db);
  if (cached?.day === today) return cached.promise;
  const promise = (async () => {
    await db.prepare('CREATE TABLE IF NOT EXISTS usage_daily (day TEXT NOT NULL, template_id TEXT NOT NULL, event TEXT NOT NULL, total INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (day, template_id, event))').run();
    await db.prepare('DELETE FROM usage_daily WHERE day < ?').bind(date(89)).run();
  })().catch(error => { initialized.delete(db); throw error; });
  initialized.set(db, { day: today, promise });
  return promise;
}

async function payload(request) {
  if (Number(request.headers.get('Content-Length')) > 512) throw new HttpError(413, 'Zahtev je prevelik.');
  const reader = request.body?.getReader(); if (!reader) throw new HttpError(400, 'Neispravan zahtev.');
  let size = 0, chunks = [];
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    size += value.byteLength;
    if (size > 512) { await reader.cancel(); throw new HttpError(413, 'Zahtev je prevelik.'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  try { return JSON.parse(new TextDecoder().decode(bytes)); }
  catch { throw new HttpError(400, 'Neispravan zahtev.'); }
}

export async function recordUsage(request, env, loadCatalog) {
  const url = new URL(request.url);
  if (request.method !== 'POST') throw new HttpError(405, 'Metoda nije podržana.');
  if (!['napravipozivnicu.com', 'www.napravipozivnicu.com'].includes(url.hostname)) throw new HttpError(403, 'Statistika je isključena na ovom domenu.');
  if (request.headers.get('Origin') !== url.origin || (request.headers.has('Sec-Fetch-Site') && request.headers.get('Sec-Fetch-Site') !== 'same-origin')) throw new HttpError(403, 'Nedozvoljen zahtev.');
  if (request.headers.get('DNT') === '1' || request.headers.get('Sec-GPC') === '1') return new Response(null, { status: 204, headers: noStoreHeaders });
  if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') throw new HttpError(415, 'Očekuje se JSON.');
  const input = await payload(request);
  if (!input || Array.isArray(input) || Object.keys(input).length !== 2 || !events.has(input.event) || typeof input.templateId !== 'string' || !/^[a-z0-9-]{1,80}$/.test(input.templateId)) throw new HttpError(400, 'Neispravan događaj.');
  if (!env.DB) throw new HttpError(503, 'Statistika trenutno nije dostupna.');
  let catalog = catalogs.get(env.DB);
  if (!catalog || catalog.expires < Date.now()) {
    catalog = { ids: new Set((await loadCatalog(env)).map(template => template.id)), expires: Date.now() + 60000 };
    catalogs.set(env.DB, catalog);
  }
  if (!catalog.ids.has(input.templateId)) throw new HttpError(400, 'Šablon nije dostupan.');
  await ensureTable(env.DB);
  await env.DB.prepare('INSERT INTO usage_daily (day, template_id, event, total) VALUES (?, ?, ?, 1) ON CONFLICT(day, template_id, event) DO UPDATE SET total = total + 1').bind(date(0), input.templateId, input.event).run();
  return new Response(null, { status: 204, headers: noStoreHeaders });
}

export async function usageStatistics(request, env) {
  const days = Number(new URL(request.url).searchParams.get('days') || 30);
  if (![7, 30, 90].includes(days)) throw new HttpError(400, 'Izaberi 7, 30 ili 90 dana.');
  await ensureTable(env.DB);
  const { results } = await env.DB.prepare('SELECT template_id AS templateId, event, SUM(total) AS total FROM usage_daily WHERE day >= ? AND day <= ? GROUP BY template_id, event').bind(date(days - 1), date(0)).all();
  return json({ days, from: date(days - 1), to: date(0), rows: results });
}
