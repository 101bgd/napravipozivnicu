// PNG pHYs stores pixels per metre; changing it leaves image pixels untouched.
const signature = [137, 80, 78, 71, 13, 10, 26, 10];
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let crc = n;
  for (let k = 0; k < 8; k++) crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  crcTable[n] = crc >>> 0;
}
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
export function pngWithPrintDensity(bytes, dpi = 300) {
  if (!Number.isFinite(dpi) || dpi <= 0 || dpi > 10000) throw new Error('Invalid PNG print density');
  if (!signature.every((byte, index) => bytes[index] === byte)) throw new Error('Invalid PNG signature');
  const density = new Uint8Array(21), view = new DataView(density.buffer);
  view.setUint32(0, 9);
  density.set([112, 72, 89, 115], 4);
  const pixelsPerMetre = Math.round(dpi / 0.0254);
  view.setUint32(8, pixelsPerMetre); view.setUint32(12, pixelsPerMetre);
  density[16] = 1;
  view.setUint32(17, crc32(density.subarray(4, 17)));
  const parts = [bytes.subarray(0, 8)];
  let offset = 8, inserted = false, ended = false;
  while (offset + 12 <= bytes.length) {
    const length = new DataView(bytes.buffer, bytes.byteOffset + offset, 4).getUint32(0);
    const end = offset + length + 12;
    if (end > bytes.length) throw new Error('Truncated PNG chunk');
    const type = String.fromCharCode(...bytes.subarray(offset + 4, offset + 8));
    if (type !== 'pHYs') parts.push(bytes.subarray(offset, end));
    if (type === 'IHDR' && !inserted) { parts.push(density); inserted = true; }
    offset = end;
    if (type === 'IEND') { ended = true; break; }
  }
  if (!inserted || !ended) throw new Error('Incomplete PNG');
  const output = new Uint8Array(parts.reduce((size, part) => size + part.length, 0));
  let cursor = 0;
  for (const part of parts) { output.set(part, cursor); cursor += part.length; }
  return output;
}
