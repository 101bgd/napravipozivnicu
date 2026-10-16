// Encode the owner's backgrounds and render editable designs locally.
// Publishing is handled by the normal GitHub/Cloudflare deployment.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomUUID } from 'node:crypto';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { jsPDF } from 'jspdf';
import { birthdayDrafts, birthdayDesign } from './designs.mjs';

const directory = fileURLToPath(new URL('./', import.meta.url)), root = path.resolve(directory, '../..');
const artifacts = path.resolve(root, '../artifacts/birthdays');
const assetDirectory = 'assets/pozivnice/deciji-rodjendani';
await fs.mkdir(path.join(root, 'public', assetDirectory), { recursive: true });
await fs.mkdir(artifacts, { recursive: true });
let ids;
try { ids = JSON.parse(await fs.readFile(path.join(directory, 'asset-ids.json'), 'utf8')); } catch {
  ids = { fonts: { baloo2: randomUUID(), dynapuff: randomUUID() }, designs: Object.fromEntries(birthdayDrafts.map(draft => [draft.id, { background: randomUUID(), thumbnail: randomUUID() }])) };
}
const assets = [];
async function asset(id, label, bytes, extension) {
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
  const url = `/${assetDirectory}/${label}-${hash}.${extension}`;
  await fs.writeFile(path.join(root, 'public', url), bytes); assets.push([id, url]); return url;
}
for (const font of ['baloo2', 'dynapuff']) {
  await asset(ids.fonts[font], `${font}-600-sr`, await fs.readFile(path.join(directory, `fonts/${font}-600-sr-latin.woff2`)), 'woff2');
  await fs.copyFile(path.join(directory, `fonts/OFL-${font}.txt`), path.join(root, 'public', assetDirectory, `OFL-${font}.txt`));
}
const server = await createServer({ root, server: { host: '127.0.0.1', port: 5195, strictPort: true } });
let browser;
const catalog = [], reports = [];
try {
  await server.listen();
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:5195/pozivnice/');
  for (const draft of birthdayDrafts) {
    const design = birthdayDesign(draft.id, { backgroundId: ids.designs[draft.id].background, fontIds: ids.fonts });
    const result = await page.evaluate(async ({ design, source, fontIds }) => {
      await import('/src/editor.js');
      const { renderDesign, designData } = await import('/src/design-renderer.js');
      for (const key of ['baloo2', 'dynapuff']) {
        const family = `custom-${fontIds[key]}`;
        if (![...document.fonts].some(face => face.family === family)) {
          const face = new FontFace(family, `url("/content/birthday-batch/fonts/${key}-600-sr-latin.woff2")`);
          await face.load(); document.fonts.add(face);
        }
      }
      await Promise.all(design.layers.map(layer => document.fonts.load(`${layer.size}px "${layer.family}"`, layer.text)));
      const original = new Image(); original.src = `/content/birthday-batch/sources/original-${source}.png`; await original.decode();
      const canvas = document.createElement('canvas'); canvas.width = original.naturalWidth; canvas.height = original.naturalHeight;
      canvas.getContext('2d').drawImage(original, 0, 0);
      const background = canvas.toDataURL('image/webp', .92);
      const image = new Image(); image.src = background; await image.decode();
      const data = designData(design), assets = { background: image };
      const full = renderDesign(document.createElement('canvas'), design, data, null, 1500, assets).toDataURL('image/png');
      const thumbnail = renderDesign(document.createElement('canvas'), design, data, null, 500, assets).toDataURL('image/webp', .86);
      return { background, full, thumbnail, width: original.naturalWidth, height: original.naturalHeight };
    }, { design, source: draft.source, fontIds: ids.fonts });
    const decode = data => Buffer.from(data.split(',')[1], 'base64');
    const background = decode(result.background), thumbnail = decode(result.thumbnail);
    const backgroundUrl = await asset(ids.designs[draft.id].background, `${draft.id}-pozadina`, background, 'webp');
    const thumbnailUrl = await asset(ids.designs[draft.id].thumbnail, `${draft.id}-pregled`, thumbnail, 'webp');
    const { source, bg, ...metadata } = draft;
    catalog.push({ ...metadata, category: 'birthday', style: 'custom', thumbnail: thumbnailUrl, hasPhoto: false, updatedAt: '2026-10-16T02:20:38Z' });
    await fs.writeFile(path.join(artifacts, `${draft.id}.png`), decode(result.full));
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [127, 177.8], compress: true });
    pdf.addImage(result.full, 'PNG', 0, 0, 127, 177.8);
    await fs.writeFile(path.join(artifacts, `${draft.id}.pdf`), Buffer.from(pdf.output('arraybuffer')));
    const originalBytes = (await fs.stat(path.join(directory, `sources/original-${draft.source}.png`))).size;
    reports.push({ id: draft.id, width: result.width, height: result.height, originalBytes, backgroundBytes: background.length, thumbnailBytes: thumbnail.length, reductionPercent: Number(((1 - background.length / originalBytes) * 100).toFixed(1)), backgroundUrl, thumbnailUrl });
  }
} finally { await browser?.close(); await server.close(); }
await fs.writeFile(path.join(directory, 'asset-ids.json'), JSON.stringify(ids, null, 2) + '\n');
await fs.writeFile(path.join(directory, 'report.json'), JSON.stringify(reports, null, 2) + '\n');
await fs.writeFile(path.join(root, 'src/birthday-assets.js'), `// Generated by content/birthday-batch/prepare.mjs.\nexport const birthdayAssetIds = ${JSON.stringify(ids, null, 2)};\nexport const birthdayAssets = new Map(${JSON.stringify(assets, null, 2)});\n`);
await fs.writeFile(path.join(root, 'src/birthday-catalog.js'), `// Metadata only; layouts and fonts load when the editor opens.\nexport const birthdayTemplates = ${JSON.stringify(catalog, null, 2)};\n`);
console.log(JSON.stringify(reports, null, 2));
