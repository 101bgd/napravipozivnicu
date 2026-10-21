import { newTextLayer, normalizeDesign } from './template-schema.js';

// Text remains editable; the owner's original artwork is uploaded through the
// existing authenticated asset API when this layout is selected in the admin.
export function roseBowDesign(backgroundId) {
  const layer = (field, label, text, y, size, options = {}) => ({
    ...newTextLayer(field), label, text, y, size, width: 62,
    family: 'DM Sans', color: '#73434f', lineHeight: 1.5, ...options,
  });
  return normalizeDesign({
    schemaVersion: 1,
    name: 'Roze mašna',
    category: 'first',
    motif: 'sa roze mašnom, medom i zekom',
    description: 'Pozivnica za prvi rođendan u nežnim roze tonovima, sa velikom mašnom, balonima, cvećem, medom i zekom. Personalizujte ime deteta, poruku, datum, vreme i mesto proslave.',
    bg: '#fff7f0', backgroundId, thumbnailId: null, fonts: [],
    layers: [
      layer('title', 'Uvodni tekst', 'Jedna mala želja,\njedan veliki dan…', 27, 16, { family: 'Georgia', italic: true }),
      layer('names', 'Ime deteta', 'Mila', 37, 58, { family: 'Libre Caslon Display', color: '#934659', width: 66, lineHeight: 1.15 }),
      layer('occasion', 'Povod proslave', 'slavi svoj 1. rođendan', 45, 22, { family: 'Georgia', italic: true, color: '#934659' }),
      layer('note', 'Poruka gostima', 'Dođite da zajedno ugasimo\nprvu svećicu i stvorimo uspomene!', 54, 13, { width: 64, lineHeight: 1.65 }),
      layer('date', 'Datum proslave', '2026-11-14', 63, 17, { bold: true }),
      layer('time', 'Vreme proslave', '16:00', 68, 16),
      layer('location', 'Mesto proslave', 'Igraonica Čarolija, Beograd', 73, 13, { width: 58 }),
      layer('footer', 'Završna poruka', 'Čekamo vas raširenih ručica!', 81, 14, { family: 'Georgia', italic: true, width: 50, color: '#934659' }),
    ],
  });
}
