// Local asset preparation only: does not contact or publish to the live site.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { jsPDF } from 'jspdf';
import { midnightElegance, midnightEleganceDesign } from './ponocna-elegancija.mjs';

const directory = fileURLToPath(new URL('./', import.meta.url));
const root = path.resolve(directory, '../..');
const output = path.resolve(root, '../artifacts');
const server = await createServer({ root, server: { host: '127.0.0.1', port: 5195, strictPort: true } });
let browser;
try {
  await server.listen();
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:5195/pozivnice/');
  const design = midnightEleganceDesign({ backgroundId: randomUUID(), scriptFontId: randomUUID() });
  const result = await page.evaluate(async ({ design, fontFile }) => {
    // Load the same fonts and renderer used by the real editor.
    await import('/src/editor.js');
    const { renderDesign, designData, layerBounds } = await import('/src/design-renderer.js');
    const prefix = '/content/wedding-batch/';
    const face = new FontFace(design.fonts[0].family, `url("${prefix}${fontFile}")`);
    await face.load(); document.fonts.add(face);
    await Promise.all(design.layers.map(layer => document.fonts.load(
      `${layer.italic ? 'italic ' : ''}400 ${layer.size}px "${layer.family}"`, layer.text,
    )));
    const original = new Image();
    original.src = `${prefix}sources/ponocna-elegancija-original.png`;
    await original.decode();
    const background = document.createElement('canvas');
    background.width = original.naturalWidth; background.height = original.naturalHeight;
    const context = background.getContext('2d', { willReadFrequently: true });
    context.drawImage(original, 0, 0);
    const originalPixels = context.getImageData(0, 0, background.width, background.height).data;
    const encoded = background.toDataURL('image/webp', .93);
    if (!encoded.startsWith('data:image/webp;')) throw Error('WebP encoding failed.');
    const optimized = new Image(); optimized.src = encoded; await optimized.decode();
    context.drawImage(optimized, 0, 0);
    const compressedPixels = context.getImageData(0, 0, background.width, background.height).data;
    let squaredError = 0;
    for (let i = 0; i < originalPixels.length; i++) if (i % 4 !== 3) squaredError += (originalPixels[i] - compressedPixels[i]) ** 2;
    const mse = squaredError / (background.width * background.height * 3);
    const psnr = 10 * Math.log10(255 ** 2 / mse);
    const data = designData(design), assets = { background: optimized };
    const canvas = renderDesign(document.createElement('canvas'), design, data, null, 1500, assets);
    const preview = canvas.toDataURL('image/png');
    const bounds = design.layers.map(layer => ({ field: layer.field, x: layer.x, y: layer.y, ...layerBounds(layer, data, canvas) }));
    const thumbnail = renderDesign(document.createElement('canvas'), design, data, null, 500, assets).toDataURL('image/webp', .88);
    const alternate = renderDesign(document.createElement('canvas'), design, { ...data, bride: 'Anđela', groom: 'Đorđe', location: 'Sala Ruža, Čačak' }, null, 1060, assets).toDataURL('image/png');
    return { encoded, preview, thumbnail, alternate, width: original.naturalWidth, height: original.naturalHeight, psnr, bounds };
  }, { design, fontFile: midnightElegance.fontFile });
  if (errors.length) throw Error(errors.join('\n'));
  if (result.width !== 1060 || result.height !== 1484) throw Error('Unexpected source dimensions.');
  const decode = value => Buffer.from(value.split(',')[1], 'base64');
  await fs.mkdir(output, { recursive: true });
  const background = decode(result.encoded), thumbnail = decode(result.thumbnail), preview = decode(result.preview);
  await fs.writeFile(path.join(directory, midnightElegance.backgroundFile), background);
  await fs.writeFile(path.join(directory, 'ponocna-elegancija-pregled.webp'), thumbnail);
  await fs.writeFile(path.join(output, 'ponocna-elegancija.png'), preview);
  await fs.writeFile(path.join(output, 'ponocna-elegancija-dijakritici.png'), decode(result.alternate));
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [127, 177.8], compress: true });
  pdf.addImage(result.preview, 'PNG', 0, 0, 127, 177.8);
  await fs.writeFile(path.join(output, 'ponocna-elegancija.pdf'), Buffer.from(pdf.output('arraybuffer')));
  const sourceBytes = (await fs.stat(path.join(directory, 'sources/ponocna-elegancija-original.png'))).size;
  const report = {
    name: midnightElegance.name, status: 'local-draft-not-published',
    background: { width: result.width, height: result.height, originalBytes: sourceBytes, webpBytes: background.length, savingPercent: Number(((1 - background.length / sourceBytes) * 100).toFixed(1)), psnrDb: Number(result.psnr.toFixed(2)) },
    thumbnail: { width: 500, height: 700, bytes: thumbnail.length },
    preview: { width: 1500, height: 2100, bytes: preview.length },
    photoLayers: design.layers.filter(layer => layer.type === 'photo').length,
    editableFields: design.layers.filter(layer => layer.editable).length,
    seoDescription: midnightElegance.description,
  };
  await fs.writeFile(path.join(directory, 'ponocna-elegancija-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ ...report, layerBounds: result.bounds }, null, 2));
} finally {
  await browser?.close();
  await server.close();
}
