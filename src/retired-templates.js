// Removal requested by the owner on 2026-10-16. Name matching applies only to
// records that already existed then; future drafts can reuse a generic name.
export const retirementCutoff = '2026-10-16T02:20:38Z';
const ids = new Set(['olive', 'vows', 'confetti', 'garden', 'little-sun', 'moon']);
const key = name => String(name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('sr').replaceAll('đ', 'dj').trim();
const names = new Set(['Nova pozivnica', 'Razlog za slavlje', 'U zelenom vrtu', 'Maslinova priča', 'Zauvek zajedno', 'Malo sunce', 'Pod malim zvezdama'].map(key));
export function isRetiredTemplate(template) {
  if (ids.has(template.id) || ids.has(template.builtinSource)) return true;
  const stamp = template.updatedAt || template.createdAt;
  return (!stamp || stamp <= retirementCutoff) && names.has(key(template.name));
}
export function isRetiredRecord(row) {
  for (const json of [row.draft_json, row.published_json]) {
    if (!json) continue;
    let design;
    try { design = JSON.parse(json); } catch { continue; }
    if (isRetiredTemplate({ ...design, createdAt: row.created_at, updatedAt: row.updated_at })) return true;
  }
  return isRetiredTemplate({ id: row.id, name: row.name, createdAt: row.created_at, updatedAt: row.updated_at });
}
