import { newTextLayer, normalizeDesign } from '../../src/template-schema.js';
import { buildTemplateTitle } from '../../src/template-titles.js';
import metadata from './metadata.json' with { type: 'json' };
import ids from './asset-ids.json' with { type: 'json' };

export function eighteenPremiumDesign(id, { backgroundId = ids.designs[id]?.background, fontIds = ids.fonts } = {}) {
  const original = metadata.find(item => item.id === id);
  if (!original) throw Error('Nepoznat premium dizajn za 18. rođendan.');
  const { source, ...item } = original;
  const serif = `custom-${fontIds.serif}`, script = `custom-${fontIds.script}`;
  const text = (field, label, value, x, y, size, options = {}) => ({
    ...newTextLayer(field), id: `${id}-${field}`, label, text: value, x, y, size,
    family: serif, width: 70, color: '#fff5e2', lineHeight: 1.28, ...options,
  });
  const label = (field, value, x, y, options = {}) => text(field, value, value, x, y, 10.5, { editable: false, family: 'DM Sans', letterSpacing: 1.7, ...options });
  const layers = id === 'bordo-gala' ? [
    text('age', 'Broj godina', '18', 55, 17.5, 120, { width: 65, color: '#e8c68a', opacity: .42, fitToWidth: true, lineHeight: 1 }),
    text('signature', 'Uspravni ukrasni natpis', 'Punoletstvo', 15.5, 43, 35, { family: script, width: 52, color: '#f0d6a4', rotation: -90, fitToWidth: true }),
    text('title', 'Uvodni tekst', 'POZIVAM TE NA SVOJ', 58, 32, 12, { family: 'DM Sans', letterSpacing: 2, width: 66, fitToWidth: true }),
    text('names', 'Ime slavljenika', 'TEODORA', 58, 40, 43, { width: 67, letterSpacing: 1.4, fitToWidth: true }),
    text('occasion', 'Povod', '18. ROĐENDAN', 58, 47, 16.5, { family: 'DM Sans', letterSpacing: 2, width: 67, fitToWidth: true }),
    text('note', 'Poruka gostima', 'Sve što mi treba za posebno veče\nje tvoje društvo.', 58, 55, 17, { width: 66, lineHeight: 1.35 }),
    label('date_label', 'DATUM', 55, 62.5, { width: 34 }),
    label('time_label', 'POČETAK', 81, 62.5, { width: 25 }),
    text('date', 'Datum proslave', '2027-06-19', 55, 66.5, 20, { width: 34, fitToWidth: true }),
    text('time', 'Početak proslave', '19:00', 81, 66.5, 26, { width: 25, color: '#f0d6a4', fitToWidth: true }),
    text('separator', 'Ukrasna linija', '— · —', 68, 70.5, 16, { editable: false, color: '#e8c68a', width: 40 }),
    text('location', 'Mesto i adresa proslave', 'Restoran Gala\nBeograd', 68, 75, 19, { width: 52, lineHeight: 1.35 }),
    text('rsvp', 'Potvrda dolaska', 'Molim te, potvrdi dolazak\ndo 12. juna.', 73, 85, 14.5, { width: 48, color: '#f5dfb9', lineHeight: 1.3 }),
  ] : [
    text('title', 'Uvodni tekst', 'POZIVAM TE DA PROSLAVIMO', 43, 24, 11.5, { family: 'DM Sans', letterSpacing: 1.4, width: 69, color: '#302720', fitToWidth: true }),
    text('names', 'Ime slavljenika', 'Isidora', 43, 35, 66, { family: script, width: 73, color: '#221b16', fitToWidth: true }),
    text('name_rule', 'Ukrasna linija', '— · —', 43, 43, 17, { editable: false, width: 46, color: '#8c6630' }),
    text('age', 'Broj godina', '18', 43, 50, 120, { width: 57, color: '#211a16', fitToWidth: true, lineHeight: 1 }),
    text('occasion', 'Povod', 'ROĐENDAN', 43, 60.4, 21, { width: 64, color: '#302720', letterSpacing: 3, fitToWidth: true }),
    text('note', 'Poruka gostima', 'Uz osmeh, muziku i najdraže ljude.', 43, 65.7, 15.5, { width: 69, color: '#403024', fitToWidth: true }),
    label('date_label', 'DATUM', 34, 70, { width: 43, color: '#725025' }),
    label('time_label', 'POČETAK', 68, 70, { width: 25, color: '#725025' }),
    text('date', 'Datum proslave', '2027-06-19', 34, 74, 20, { width: 43, color: '#241c17', fitToWidth: true }),
    text('time', 'Početak proslave', '19:00', 68, 74, 25, { width: 26, color: '#241c17', fitToWidth: true }),
    text('location', 'Mesto i adresa proslave', 'Restoran Oniks\nNovi Sad', 53, 79.7, 16.5, { width: 66, color: '#241c17', lineHeight: 1.35 }),
    text('rsvp', 'Potvrda dolaska', 'Molim te, potvrdi dolazak do 12. juna.', 53, 85, 12.5, { width: 68, color: '#4b3623', fitToWidth: true }),
  ];
  const used = new Set(layers.map(layer => layer.family));
  const fonts = Object.entries(fontIds).filter(([, assetId]) => used.has(`custom-${assetId}`)).map(([key, assetId]) => ({ assetId, family: `custom-${assetId}`, name: key === 'script' ? 'Great Vibes — svečani rukopis' : 'Cormorant Garamond — elegantni serif' }));
  return { ...normalizeDesign({ ...item, seoTitle: buildTemplateTitle(item), backgroundId, fonts, layers }), id, builtinSource: id, style: 'custom', hasPhoto: false };
}
