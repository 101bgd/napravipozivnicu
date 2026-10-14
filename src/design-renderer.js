import { DESIGN_WIDTH as W, DESIGN_HEIGHT as H } from './template-schema.js';
const images = new Map(), fonts = new Map();
const formatDate = new Intl.DateTimeFormat('sr-Latn-RS', { day: 'numeric', month: 'long', year: 'numeric' });
export const designAssetUrl = (id, admin = false) => admin ? `/api/admin/assets/${id}/file` : `/media/${id}`;
export async function loadDesignFont(font, admin = false) {
  const key = `${font.assetId}:${admin}`;
  if (!fonts.has(key)) {
    const promise = (async () => {
      const face = new FontFace(font.family, `url("${designAssetUrl(font.assetId, admin)}")`);
      await face.load(); document.fonts.add(face); return face;
    })().catch(error => { fonts.delete(key); throw error; });
    fonts.set(key, promise);
  }
  return fonts.get(key);
}
export async function prepareDesign(design, admin = false) {
  let background = null;
  if (design.backgroundId) {
    const key = `${design.backgroundId}:${admin}`;
    if (!images.has(key)) {
      const promise = (async () => { const image = new Image(); image.src = designAssetUrl(design.backgroundId, admin); await image.decode(); return image; })().catch(error => { images.delete(key); throw error; });
      images.set(key, promise);
      if (images.size > 24) images.delete(images.keys().next().value);
    }
    background = await images.get(key);
  }
  const used = new Set(design.layers.filter(layer => layer.type === 'text').map(layer => layer.family));
  await Promise.all((design.fonts || []).filter(font => used.has(font.family)).map(font => loadDesignFont(font, admin)));
  return { background };
}
export function designData(design) {
  const data = { photoX: 50, photoY: 50, photoZoom: 100, bg: design.bg };
  for (const layer of design.layers) if (layer.type === 'text') data[layer.field] = layer.text;
  return data;
}
export function photoFrame(design) {
  const layer = design.layers.find(layer => layer.type === 'photo');
  if (!layer) return null;
  let width = layer.width / 100 * W, height = layer.height / 100 * H;
  if (layer.shape === 'circle') width = height = Math.min(width, height);
  return { layer, x: layer.x / 100 * W, y: layer.y / 100 * H, width, height };
}
function photoPath(c, layer, width, height) {
  c.beginPath();
  if (layer.shape === 'circle') c.arc(0, 0, width / 2, 0, Math.PI * 2);
  else if (layer.shape === 'rounded') c.roundRect(-width / 2, -height / 2, width, height, Math.min(width, height) * .12);
  else c.rect(-width / 2, -height / 2, width, height);
}
function textValue(layer, data) {
  let value = String(layer.editable && data?.[layer.field] !== undefined ? data[layer.field] : layer.text);
  if (layer.field === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = new Date(`${value}T12:00:00`); if (!isNaN(date)) value = formatDate.format(date);
  }
  return layer.uppercase ? value.toLocaleUpperCase('sr') : value;
}
function textWidth(c, value, spacing) { return c.measureText(value).width + Math.max(0, [...value].length - 1) * spacing; }
function linesFor(c, value, width, spacing) {
  const lines = [];
  for (const paragraph of value.split('\n')) {
    let line = '';
    for (const word of paragraph.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (line && textWidth(c, next, spacing) > width) { lines.push(line); line = word; }
      else line = next;
    }
    lines.push(line);
  }
  return lines.slice(0, 24);
}
function paintLine(c, text, x, y, spacing, stroke = false) {
  if (!spacing) { c[stroke ? 'strokeText' : 'fillText'](text, x, y); return; }
  for (const letter of text) { c[stroke ? 'strokeText' : 'fillText'](letter, x, y); x += c.measureText(letter).width + spacing; }
}
export function layerBounds(layer, data, canvas) {
  const width = layer.width / 100 * W;
  if (layer.type === 'photo') {
    const height = layer.height / 100 * H;
    return { width: layer.shape === 'circle' ? Math.min(width, height) : width, height: layer.shape === 'circle' ? Math.min(width, height) : height };
  }
  const c = canvas.getContext('2d'); c.save();
  c.font = `${layer.italic ? 'italic ' : ''}${layer.bold ? '700 ' : '400 '}${layer.size}px "${layer.family}"`;
  const lines = linesFor(c, textValue(layer, data), width, layer.letterSpacing); c.restore();
  return { width, height: Math.max(layer.size * layer.lineHeight * lines.length, layer.size * 1.2) };
}
export function renderDesign(canvas, design, data = designData(design), photo = null, width = 1200, assets = {}, options = {}) {
  const height = Math.round(width * H / W);
  if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
  const c = canvas.getContext('2d', { alpha: false }); c.save(); c.setTransform(width / W, 0, 0, width / W, 0, 0);
  c.fillStyle = data.bg || design.bg; c.fillRect(0, 0, W, H);
  if (assets.background) c.drawImage(assets.background, 0, 0, W, H);
  for (const layer of design.layers) {
    c.save(); c.translate(layer.x / 100 * W, layer.y / 100 * H); c.rotate(layer.rotation * Math.PI / 180); c.globalAlpha = layer.opacity;
    if (layer.type === 'photo') {
      const frame = photoFrame({ layers: [layer] });
      c.save(); photoPath(c, layer, frame.width, frame.height); c.clip();
      if (photo) {
        const scale = Math.max(frame.width / photo.width, frame.height / photo.height) * Number(data.photoZoom) / 100;
        const iw = photo.width * scale, ih = photo.height * scale;
        c.drawImage(photo, -frame.width / 2 - (iw - frame.width) * Number(data.photoX) / 100, -frame.height / 2 - (ih - frame.height) * Number(data.photoY) / 100, iw, ih);
      } else if (options.placeholders !== false) {
        c.fillStyle = '#e9ece4'; c.fillRect(-frame.width / 2, -frame.height / 2, frame.width, frame.height);
        c.fillStyle = '#526447'; c.font = '14px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('Fotografija', 0, 0);
      }
      c.restore();
      if (layer.borderWidth) { photoPath(c, layer, frame.width, frame.height); c.strokeStyle = layer.borderColor; c.lineWidth = layer.borderWidth; c.stroke(); }
    } else {
      c.font = `${layer.italic ? 'italic ' : ''}${layer.bold ? '700 ' : '400 '}${layer.size}px "${layer.family}"`;
      c.textAlign = 'left'; c.textBaseline = 'middle';
      const maxWidth = layer.width / 100 * W, lines = linesFor(c, textValue(layer, data), maxWidth, layer.letterSpacing), lineHeight = layer.size * layer.lineHeight;
      const top = -(lines.length - 1) * lineHeight / 2;
      c.fillStyle = layer.color;
      if (['shadow', 'glow', 'lift'].includes(layer.effect)) {
        c.shadowColor = layer.effect === 'lift' ? '#00000066' : layer.effectColor;
        c.shadowBlur = (layer.effect === 'glow' ? layer.effectSize * 2 : layer.effectSize) * width / W;
        c.shadowOffsetX = layer.effect === 'shadow' ? layer.effectSize * width / W : 0;
        c.shadowOffsetY = layer.effect === 'glow' ? 0 : layer.effectSize * width / W;
      }
      if (layer.effect === 'gradient') {
        const gradient = c.createLinearGradient(0, top - layer.size / 2, 0, top + lines.length * lineHeight);
        gradient.addColorStop(0, layer.color); gradient.addColorStop(1, layer.effectColor); c.fillStyle = gradient;
      }
      lines.forEach((line, index) => {
        const measured = textWidth(c, line, layer.letterSpacing), x = layer.align === 'left' ? -maxWidth / 2 : layer.align === 'right' ? maxWidth / 2 - measured : -measured / 2, y = top + index * lineHeight;
        if (layer.effect === 'outline') { c.strokeStyle = layer.effectColor; c.lineWidth = layer.effectSize; c.lineJoin = 'round'; paintLine(c, line, x, y, layer.letterSpacing, true); }
        paintLine(c, line, x, y, layer.letterSpacing);
        if (layer.underline) { c.strokeStyle = layer.color; c.lineWidth = Math.max(1, layer.size / 18); c.beginPath(); c.moveTo(x, y + layer.size * .45); c.lineTo(x + measured, y + layer.size * .45); c.stroke(); }
      });
    }
    c.restore();
  }
  c.restore(); return canvas;
}
