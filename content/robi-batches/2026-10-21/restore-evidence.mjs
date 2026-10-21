// Restore the exact original image/export files from the lossless archive.
// Uses Node 24; never changes production code or regenerates artwork.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { zstdDecompressSync } from 'node:zlib';
const directory = fileURLToPath(new URL('./', import.meta.url));
const index = JSON.parse(await fs.readFile(path.join(directory, 'archive-index.json'), 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const chunks = [];
for (const item of index.parts) {
  const bytes = await fs.readFile(path.join(directory, item.path));
  if (hash(bytes) !== item.sha256) throw Error('Archive part checksum failed: ' + item.path);
  chunks.push(bytes);
}
const packed = Buffer.concat(chunks);
if (hash(packed) !== index.archiveSha256) throw Error('Archive checksum failed.');
const tar = zstdDecompressSync(packed);
for (let offset = 0; offset + 512 <= tar.length;) {
  const header = tar.subarray(offset, offset + 512);
  if (header.every(value => value === 0)) break;
  const name = header.subarray(0, 100).toString().replace(/\0.*$/, '');
  const prefix = header.subarray(345, 500).toString().replace(/\0.*$/, '');
  const file = prefix ? `${prefix}/${name}` : name;
  const bytes = Number.parseInt(header.subarray(124, 136).toString().replace(/\0.*$/, '').trim(), 8);
  const type = header[156];
  const target = path.resolve(directory, file);
  if (!target.startsWith(path.resolve(directory) + path.sep) || ![0, 48].includes(type)) throw Error('Unexpected archive entry: ' + file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, tar.subarray(offset + 512, offset + 512 + bytes));
  offset += 512 + Math.ceil(bytes / 512) * 512;
}
for (const item of index.files) {
  if (hash(await fs.readFile(path.join(directory, item.path))) !== item.sha256) throw Error('Restored file checksum failed: ' + item.path);
}
console.log(`Restored and verified ${index.files.length} exact original files.`);
