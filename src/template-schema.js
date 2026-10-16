import { templates as builtinTemplates } from './templates.js';
import { curatedTemplates } from './curated-catalog.js';
export const DESIGN_WIDTH = 500;
export const DESIGN_HEIGHT = 700;
export const BUILTIN_FONTS = [
  { family: 'Georgia', name: 'Georgia — klasičan' },
  { family: 'Arial', name: 'Arial — moderan' },
  { family: 'DM Sans', name: 'DM Sans' },
  { family: 'Libre Caslon Display', name: 'Libre Caslon Display' },
];
export const TEXT_EFFECTS = ['none', 'shadow', 'outline', 'glow', 'lift', 'gradient'];
export const FIELD_LABELS = { title: 'Uvodni tekst', names: 'Ime ili naslov', note: 'Poruka', date: 'Datum', time: 'Vreme', location: 'Mesto proslave' };
const assetPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
export const isAssetId = value => typeof value === 'string' && assetPattern.test(value);
export const assetUrl = id => `/media/${id}`;
const text = (value, max, fallback = '') => typeof value === 'string' ? value.slice(0, max) : fallback;
const number = (value, min, max, fallback) => Number.isFinite(Number(value)) ? Math.max(min, Math.min(max, Number(value))) : fallback;
const color = (value, fallback) => /^#[a-f0-9]{6}$/i.test(value || '') ? value : fallback;
export function newTextLayer(field = 'names') {
  return { id: crypto.randomUUID(), type: 'text', label: FIELD_LABELS[field] || 'Novi tekst', field, text: field === 'names' ? 'Ana & Marko' : 'Tvoj tekst', editable: true, x: 50, y: 44, width: 82, rotation: 0, size: field === 'names' ? 42 : 20, family: 'Georgia', color: '#344437', align: 'center', bold: false, italic: false, underline: false, uppercase: false, lineHeight: 1.35, letterSpacing: 0, opacity: 1, effect: 'none', effectColor: '#9ca582', effectSize: 2 };
}
export function newDesign() {
  const title = { ...newTextLayer('title'), text: 'Pozivamo vas na proslavu', y: 26, size: 18 };
  const names = newTextLayer('names');
  const date = { ...newTextLayer('date'), text: '2026-11-14', y: 66, size: 17 };
  const location = { ...newTextLayer('location'), text: 'Restoran, Beograd', y: 73, size: 16 };
  const note = { ...newTextLayer('note'), text: 'Radujemo se vašem dolasku!', y: 82, size: 15 };
  return { schemaVersion: 1, name: 'Nova pozivnica', category: 'first', description: '', bg: '#f6f3e9', backgroundId: null, thumbnailId: null, fonts: [], layers: [title, names, date, location, note] };
}
export function normalizeDesign(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Šablon mora biti objekat.');
  if (!['first', 'eighteen', 'birthday', 'wedding', 'baptism', 'baby'].includes(input.category)) throw new Error('Izaberi kategoriju.');
  const name = text(input.name, 100).trim();
  if (!name) throw new Error('Upiši naziv šablona.');
  if (!Array.isArray(input.layers) || !input.layers.length || input.layers.length > 32) throw new Error('Šablon treba da ima između 1 i 32 elementa.');
  const fonts = (Array.isArray(input.fonts) ? input.fonts : []).slice(0, 32).filter(f => isAssetId(f.assetId)).map(f => ({ assetId: f.assetId, family: `custom-${f.assetId}`, name: text(f.name, 80, 'Moj font'), url: assetUrl(f.assetId) }));
  const families = new Set([...BUILTIN_FONTS.map(f => f.family), ...fonts.map(f => f.family)]);
  const ids = new Set();
  const layers = input.layers.map((layer, index) => {
    if (!layer || !['text', 'photo'].includes(layer.type)) throw new Error('Nepoznat element šablona.');
    const id = text(layer.id, 64, `layer-${index}`);
    if (ids.has(id)) throw new Error('Elementi moraju imati različite oznake.');
    ids.add(id);
    const base = { id, type: layer.type, label: text(layer.label, 80, layer.type === 'text' ? 'Tekst' : 'Fotografija'), x: number(layer.x, 0, 100, 50), y: number(layer.y, 0, 100, 50), width: number(layer.width, 5, 100, 80), rotation: number(layer.rotation, -180, 180, 0), opacity: number(layer.opacity, 0, 1, 1) };
    if (layer.type === 'photo') return { ...base, height: number(layer.height, 5, 100, 25), shape: ['circle', 'rounded', 'rect'].includes(layer.shape) ? layer.shape : 'circle', borderColor: color(layer.borderColor, '#9ca582'), borderWidth: number(layer.borderWidth, 0, 12, 1) };
    return { ...base, field: /^[a-z][a-z0-9_]{0,40}$/.test(layer.field || '') ? layer.field : `text_${index}`, text: text(layer.text, 1500), editable: layer.editable !== false, size: number(layer.size, 8, 120, 24), family: families.has(layer.family) ? layer.family : 'Georgia', color: color(layer.color, '#344437'), align: ['left', 'center', 'right'].includes(layer.align) ? layer.align : 'center', bold: Boolean(layer.bold), italic: Boolean(layer.italic), underline: Boolean(layer.underline), uppercase: Boolean(layer.uppercase), lineHeight: number(layer.lineHeight, .8, 2.5, 1.35), letterSpacing: number(layer.letterSpacing, -2, 12, 0), effect: TEXT_EFFECTS.includes(layer.effect) ? layer.effect : 'none', effectColor: color(layer.effectColor, '#9ca582'), effectSize: number(layer.effectSize, 0, 20, 2) };
  });
  if (layers.filter(l => l.type === 'photo').length > 1) throw new Error('Trenutno je podržan jedan okvir za fotografiju po šablonu.');
  return { schemaVersion: 1, builtinSource: [...builtinTemplates, ...curatedTemplates].some(t => t.id === input.builtinSource) ? input.builtinSource : null, name, category: input.category, description: text(input.description, 1000), imageAlt: text(input.imageAlt, 300), seoTitle: text(input.seoTitle, 150), details: text(input.details, 1500), bg: color(input.bg, '#f6f3e9'), backgroundId: isAssetId(input.backgroundId) ? input.backgroundId : null, thumbnailId: isAssetId(input.thumbnailId) ? input.thumbnailId : null, fonts, layers };
}
export function referencedAssets(design) {
  const usedFonts = new Set(design.layers.filter(l => l.type === 'text').map(l => l.family));
  return [...new Set([design.backgroundId, design.thumbnailId, ...design.fonts.filter(f => usedFonts.has(f.family)).map(f => f.assetId)].filter(Boolean))];
}
export function publicTemplate(record) {
  const design = JSON.parse(record.published_json);
  const usedFonts = new Set(design.layers.filter(l => l.type === 'text').map(l => l.family));
  design.fonts = design.fonts.filter(f => usedFonts.has(f.family));
  return { ...design, id: record.id, slug: record.slug, style: 'custom', ink: '#344437', accent: '#9ca582', thumbnail: assetUrl(design.thumbnailId), updatedAt: record.published_at };
}
