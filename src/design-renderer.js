import { DESIGN_WIDTH as W, DESIGN_HEIGHT as H, DATE_LOCALES } from './template-schema.js';
import { curatedAssetUrl } from './curated-assets.js';
const images = new Map(), fonts = new Map();
const dateFormatters = new Map(DATE_LOCALES.map(({ id }) => [id, new Intl.DateTimeFormat(id, { day: 'numeric', month: 'long', year: 'numeric' })]));
export const designAssetUrl = (id, admin = false) => curatedAssetUrl(id) || (admin ? `/api/admin/assets/${id}/file` : `/media/${id}`);
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
  // Canvas does not redraw when a CSS font finishes loading. Wait before the
  // first preview and export so the prepared typography stays consistent.
  await Promise.all(design.layers.filter(layer => layer.type === 'text').map(layer =>
    document.fonts.load(`${layer.italic ? 'italic ' : ''}${layer.bold ? '700 ' : '400 '}${layer.size}px "${layer.family}"`, layer.text || 'ČćŠšŽžĐđ')
  ));
  return { background };
}
export function designData(design) {
  const data = { photoX: 50, photoY: 50, photoZoom: 100, bg: design.bg, locale: design.locale || 'sr-Latn-RS' };
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
    const date = new Date(`${value}T12:00:00`); if (!isNaN(date)) value = (dateFormatters.get(data?.locale) || dateFormatters.get('sr-Latn-RS')).format(date);
  }
  return layer.uppercase ? value.toLocaleUpperCase('sr') : value;
}
function textWidth(c, value, spacing) { return c.measureText(value).width + Math.max(0, [...value].length - 1) * spacing; }
function linesFor(c, value, width, spacing, limit = 24) {
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
  return lines.slice(0, limit);
}
// Optional for templates with a limited clear area: keep each name on its
// intended line and reduce its font only when the edited value is too wide.
function textLayout(c, layer, data, limit = 24) {
  const width = layer.width / 100 * W, value = textValue(layer, data);
  let size = layer.size;
  const setFont = () => { c.font = `${layer.italic ? 'italic ' : ''}${layer.bold ? '700 ' : '400 '}${size}px "${layer.family}"`; };
  setFont();
  if (layer.fitToWidth) {
    const lines = value.split('\n').slice(0, limit), target = width * .94;
    for (let attempt = 0; attempt < 4; attempt++) {
      const measured = Math.max(0, ...lines.map(line => textWidth(c, line, layer.letterSpacing)));
      if (measured <= target || size <= 8) break;
      size = Math.max(8, size * target / measured); setFont();
    }
    return { width, lines, size, lineHeight: size * layer.lineHeight };
  }
  return { width, lines: linesFor(c, value, width, layer.letterSpacing, limit), size, lineHeight: size * layer.lineHeight };
}
// Diagnose edited fields against their original layout without altering exports.
export function designTextWarnings(design, data, original, canvas) {
  const c = canvas.getContext('2d'), warnings = [];
  c.save();
  for (const layer of design.layers.filter(l => l.type === 'text' && l.editable)) {
    const baseline = original.layers.find(l => l.id === layer.id);
    if (!baseline || (textValue(layer, data) === textValue(baseline, {}) && !data.layerStyles?.[layer.id])) continue;
    const { width, lines, size, lineHeight } = textLayout(c, layer, data, Infinity);
    const measured = Math.max(...lines.map(line => textWidth(c, line, layer.letterSpacing)));
    const height = Math.max(size * 1.2, lines.length * lineHeight);
    const angle = layer.rotation * Math.PI / 180;
    const rotatedHeight = Math.abs(Math.cos(angle)) * height + Math.abs(Math.sin(angle)) * measured;
    const rotatedWidth = Math.abs(Math.cos(angle)) * measured + Math.abs(Math.sin(angle)) * height;
    const x = layer.x / 100 * W + (layer.align === 'left' ? (measured - width) / 2 : layer.align === 'right' ? (width - measured) / 2 : 0), y = layer.y / 100 * H;
    const originalHeight = layerBounds(baseline, {}, canvas).height;
    if (measured > width + 2 || lines.length > 24 || x - rotatedWidth / 2 < 0 || x + rotatedWidth / 2 > W || y - rotatedHeight / 2 < 0 || y + rotatedHeight / 2 > H || height > originalHeight + baseline.size * baseline.lineHeight + 1) warnings.push(layer.field);
  }
  c.restore(); return [...new Set(warnings)];
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
  const { lines, size, lineHeight } = textLayout(c, layer, data); c.restore();
  return { width, height: Math.max(lineHeight * lines.length, size * 1.2) };
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
      const { width: maxWidth, lines, size, lineHeight } = textLayout(c, layer, data);
      c.textAlign = 'left'; c.textBaseline = 'middle';
      const top = -(lines.length - 1) * lineHeight / 2;
      c.fillStyle = layer.color;
      if (['shadow', 'glow', 'lift'].includes(layer.effect)) {
        c.shadowColor = layer.effect === 'lift' ? '#00000066' : layer.effectColor;
        c.shadowBlur = (layer.effect === 'glow' ? layer.effectSize * 2 : layer.effectSize) * width / W;
        c.shadowOffsetX = layer.effect === 'shadow' ? layer.effectSize * width / W : 0;
        c.shadowOffsetY = layer.effect === 'glow' ? 0 : layer.effectSize * width / W;
      }
      if (layer.effect === 'gradient') {
        const gradient = c.createLinearGradient(0, top - size / 2, 0, top + lines.length * lineHeight);
        gradient.addColorStop(0, layer.color); gradient.addColorStop(1, layer.effectColor); c.fillStyle = gradient;
      }
      lines.forEach((line, index) => {
        const measured = textWidth(c, line, layer.letterSpacing), x = layer.align === 'left' ? -maxWidth / 2 : layer.align === 'right' ? maxWidth / 2 - measured : -measured / 2, y = top + index * lineHeight;
        if (layer.effect === 'outline') { c.strokeStyle = layer.effectColor; c.lineWidth = layer.effectSize; c.lineJoin = 'round'; paintLine(c, line, x, y, layer.letterSpacing, true); }
        paintLine(c, line, x, y, layer.letterSpacing);
        if (layer.underline) { c.strokeStyle = layer.color; c.lineWidth = Math.max(1, size / 18); c.beginPath(); c.moveTo(x, y + size * .45); c.lineTo(x + measured, y + size * .45); c.stroke(); }
      });
    }
    c.restore();
  }
  c.restore(); return canvas;
}
