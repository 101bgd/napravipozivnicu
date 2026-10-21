import { isAssetId, newTextLayer, normalizeDesign } from '../../src/template-schema.js';

// Editable layout shared by the published design and local asset preparation.
// Asset IDs bind to either the explicit shipped-asset map or authenticated uploads.
export const midnightElegance = {
  name: 'Ponoćna elegancija', motif: 'sa plavim cvećem i zlatom', seoTitle: 'Pozivnica za venčanje sa plavim cvećem i zlatom — Ponoćna elegancija',
  category: 'wedding',
  description: 'Elegantna pozivnica za svadbu sa tamnoplavim cvećem, zlatnim detaljima i kaligrafskim imenima. Uredi tekst bez fotografije i preuzmi besplatan PNG ili PDF.',
  backgroundFile: 'ponocna-elegancija-pozadina.webp',
  fontFile: 'fonts/great-vibes-sr-latin.woff2',
  imageAlt: 'Pozivnica za venčanje sa plavim i belim cvećem, zlatnim grančicama i dijagonalno raspoređenim imenima mladenaca',
};

export function midnightEleganceDesign({ backgroundId, scriptFontId } = {}) {
  if (!isAssetId(backgroundId) || !isAssetId(scriptFontId)) {
    throw new Error('Prvo dodaj originalnu pozadinu i font Great Vibes. Šablon još nije spreman za objavu.');
  }
  const script = `custom-${scriptFontId}`;
  const ink = '#263e50', gold = '#a47c39';
  const layer = (field, label, text, x, y, size, options = {}) => ({
    ...newTextLayer(field), id: `midnight-${field}`, label, text, x, y, size,
    width: 54, color: ink, family: 'DM Sans', lineHeight: 1.35, ...options,
  });
  const caption = { size: 8.5, letterSpacing: 1.55, uppercase: true, color: '#52606a' };
  return normalizeDesign({
    schemaVersion: 1,
    name: midnightElegance.name,
    category: midnightElegance.category,
    motif: midnightElegance.motif,
    seoTitle: midnightElegance.seoTitle,
    description: midnightElegance.description,
    bg: '#f5f0e6', backgroundId, thumbnailId: null,
    fonts: [{ assetId: scriptFontId, family: script, name: 'Great Vibes' }],
    layers: [
      layer('ampersand', 'Zlatno &', '&', 51, 42.7, 77, {
        family: 'Libre Caslon Display', width: 24, color: gold, editable: false,
        opacity: .72, effect: 'gradient', effectColor: '#d8bf8e', lineHeight: 1,
      }),
      layer('title', 'Uvodni tekst', 'POČETAK NAŠEG ZAUVEK', 34, 25.2, 9.5, {
        width: 44, letterSpacing: 1.7, color: '#52606a', align: 'left',
      }),
      layer('bride', 'Ime mlade', 'Jelena', 37, 34.5, 66, {
        family: script, width: 54, lineHeight: 1.1,
      }),
      layer('groom', 'Ime mladoženje', 'Nikola', 61, 47.2, 64, {
        family: script, width: 56, lineHeight: 1.1,
      }),
      layer('note', 'Poziv gostima', 'SA RADOŠĆU VAS POZIVAMO\nNA NAŠE VENČANJE', 51, 55.8, 10, {
        width: 62, letterSpacing: 1.15, lineHeight: 1.7,
      }),
      layer('date_caption', 'Natpis iznad datuma', 'DAN ZA LJUBAV', 40, 62, 8.5, {
        ...caption, width: 38,
      }),
      layer('time_caption', 'Natpis iznad vremena', 'OKUPLJANJE', 73, 62, 8.5, {
        ...caption, width: 24,
      }),
      layer('date', 'Datum venčanja', '2027-06-19', 40, 66, 18.5, {
        family: 'Libre Caslon Display', width: 39,
      }),
      layer('divider', 'Zlatna linija', '│', 61, 64.6, 28, {
        width: 5, color: gold, opacity: .7, editable: false,
      }),
      layer('time', 'Vreme okupljanja', '17:00', 73, 66, 23, {
        family: 'Libre Caslon Display', width: 24,
      }),
      layer('location_caption', 'Natpis iznad mesta', 'MESTO NAŠE PRIČE', 74, 71, 8.5, {
        ...caption, width: 34,
      }),
      layer('location', 'Mesto proslave', 'Restoran Garden, Beograd', 74, 76, 17, {
        family: 'Libre Caslon Display', width: 32, lineHeight: 1.4,
      }),
      layer('footer', 'Završna poruka', 'Zajedno je najlepše.', 78, 83.5, 11.8, {
        family: 'Georgia', italic: true, color: '#654c42', width: 32,
      }),
    ],
  });
}
