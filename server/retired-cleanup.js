import { isRetiredRecord } from '../src/retired-templates.js';

// Run only through the authenticated, CSRF-checked admin POST. Public requests
// hide retired records immediately without performing database mutations.
export async function removeRetiredTemplates(db) {
  const marker = 'retired-templates:2026-10-27';
  if (await db.prepare('SELECT value FROM settings WHERE key = ?').bind(marker).first()) return { removed: 0 };
  const { results } = await db.prepare('SELECT * FROM templates').all();
  const retired = results.filter(isRetiredRecord);
  let removed = 0;
  if (retired.length) {
    const changes = await db.batch(retired.map(row => db.prepare('DELETE FROM templates WHERE id = ? AND version = ?').bind(row.id, row.version)));
    removed = changes.reduce((total, result) => total + (result.meta?.changes || 0), 0);
  }
  if (removed === retired.length) await db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').bind(marker, 'complete').run();
  return { removed };
}
