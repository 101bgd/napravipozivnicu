import fs from 'node:fs/promises';
import path from 'node:path';
import { publicTemplates } from '../src/curated-catalog.js';
const root = new URL('../', import.meta.url);
const { alts } = JSON.parse(await fs.readFile(new URL('content/image-seo/alts.json', root), 'utf8'));
const changes = publicTemplates.filter(t => t.imageAlt && alts[t.id] && t.imageAlt !== alts[t.id]).map(t => [t.imageAlt, alts[t.id]]);
const candidates = [];
for (const directory of ['src', 'content']) {
  for (const relative of await fs.readdir(new URL(`${directory}/`, root), { recursive: true })) {
    if (relative.startsWith('image-seo/')) continue;
    if (directory === 'src' ? relative.endsWith('-catalog.js') : /\.(mjs|json)$/.test(relative)) candidates.push(path.join(directory, relative));
  }
}
let count = 0;
for (const relative of candidates) {
  const file = new URL(relative, root), before = await fs.readFile(file, 'utf8');
  let after = before;
  for (const [oldAlt, newAlt] of changes) after = after.replaceAll(oldAlt, newAlt);
  if (before !== after) { await fs.writeFile(file, after); count++; }
}
console.log(`Updated ${count} source/catalog files from ${changes.length} image descriptions.`);
