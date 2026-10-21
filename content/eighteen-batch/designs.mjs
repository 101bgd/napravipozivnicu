import { isAssetId, newTextLayer, normalizeDesign } from '../../src/template-schema.js';

export const eighteenDrafts = [
  {
    id: 'disko-sjaj', source: 1, name: 'Disko sjaj',
    slug: 'pozivnica-za-18-rodjendan-disko',
    motif: 'sa ljubičastom disko kuglom',
    seoTitle: 'Pozivnica za 18. rođendan sa ljubičastom disko kuglom — Disko sjaj',
    description: 'Napravi pozivnicu za 18. rođendan sa disko kuglom i ljubičastim sjajem. Uredi ime, tekst i mesto punoletstva i besplatno preuzmi PNG ili PDF za štampu.',
    imageAlt: 'Pozivnica za 18. rođendan sa disko kuglom, roze svetlosnim zracima, velikim brojem 18 i rukopisnim imenom na ljubičastoj pozadini',
    details: 'Disko kugla i metalik talas uokviruju pozivnicu za punoletstvo u ljubičastim i ružičastim tonovima. Krupan geometrijski broj i svetao tekst ostaju čitljivi na tamnoj pozadini, a ime u kaligrafiji daje svečan detalj. Izmeni podatke proslave i rok za potvrdu dolaska; fotografija nije potrebna.',
    bg: '#230d29',
  },
  {
    id: 'saten-i-biseri', source: 2, name: 'Saten i biseri',
    slug: 'pozivnica-za-punoletstvo-saten-biseri',
    motif: 'sa roze satenom i biserima',
    seoTitle: 'Pozivnica za 18. rođendan sa roze satenom i biserima — Saten i biseri',
    description: 'Elegantna pozivnica za punoletstvo sa roze satenom, biserima i leptirom. Upiši ime i detalje 18. rođendana i preuzmi besplatnu sliku ili PDF za štampu.',
    imageAlt: 'Pozivnica za 18. rođendan sa satenskom trakom, biserima, zlatnim leptirom, božurom i kaligrafskim imenom na roze pozadini',
    details: 'Roze saten, biseri, božur i zlatni leptir daju romantičan izgled pozivnici za 18. rođendan. Tekst je pomeren u slobodan deo desno: ime u kaligrafiji, klasičan broj 18 i odvojeni podaci o proslavi. Topli tamni tonovi slova čuvaju kontrast. Šablon je osmišljen bez fotografije.',
    bg: '#f3d3c9',
  },
  {
    id: 'zlatni-trenutak', source: 3, name: 'Zlatni trenutak',
    slug: 'elegantna-pozivnica-za-18-rodjendan-zlatna',
    motif: 'sa zlatnim satenom',
    seoTitle: 'Pozivnica za 18. rođendan sa zlatnim satenom — Zlatni trenutak',
    description: 'Zlatna pozivnica za 18. rođendan i punoletstvo, sa satenom i svečanim slovima. Personalizuj tekst, datum i lokaciju i besplatno preuzmi PNG ili PDF.',
    imageAlt: 'Pozivnica za 18. rođendan sa zlatnim satenskim talasom, biserima, bronzanim brojem 18 i asimetričnim tekstom',
    details: 'Krem pozadina i zlatni saten prate svečan početak novog poglavlja. Asimetričan raspored spaja veliko ime i broj 18 sa diskretnom kaligrafijom, dok su datum, vreme i adresa u zasebnom bloku. Ova pozivnica za punoletstvo nema okvir za fotografiju i može da se preuzme za slanje ili štampu.',
    bg: '#f6eddd',
  },
];

export function eighteenDesign(id, { backgroundId, fontIds } = {}) {
  const metadata = eighteenDrafts.find(item => item.id === id);
  if (!metadata) throw new Error('Nepoznat dizajn za punoletstvo.');
  if (!isAssetId(backgroundId) || !isAssetId(fontIds?.serif) || !isAssetId(fontIds?.script)) throw new Error('Nedostaju pozadina ili fontovi dizajna.');
  const serif = `custom-${fontIds.serif}`, script = `custom-${fontIds.script}`;
  const text = (field, label, value, x, y, size, options = {}) => ({
    ...newTextLayer(field), id: `${id}-${field}`, label, text: value, x, y, size,
    family: serif, width: 80, color: '#654531', lineHeight: 1.4, ...options,
  });
  let layers;
  if (id === 'disko-sjaj') layers = [
    text('title', 'Naslov', 'NOĆ KOJA SE PAMTI', 31, 18, 10.5, { family: 'DM Sans', width: 54, letterSpacing: 2, color: '#f8d9ef' }),
    text('intro', 'Uvodni tekst', 'Pozivam te na moj', 33, 25, 22, { width: 56, color: '#f9dff1' }),
    text('age', 'Broj godina', '18', 43, 43, 120, { family: 'DM Sans', width: 76, bold: true, color: '#fff6fd', effect: 'gradient', effectColor: '#e5a4db', lineHeight: 1 }),
    text('occasion', 'Naziv proslave', 'OSAMNAESTI ROĐENDAN', 43, 53.3, 9.5, { family: 'DM Sans', width: 76, letterSpacing: 2.2, color: '#f9deef' }),
    text('names', 'Ime slavljenika', 'Lana', 61, 62, 57, { family: script, width: 69, color: '#ffd2ec' }),
    text('note', 'Poruka gostima', 'Zajedno otvaramo novo poglavlje.\nDođi da ovu noć pretvorimo u uspomenu.', 49, 69.7, 11.2, { family: 'DM Sans', width: 85, color: '#fae9f6', lineHeight: 1.6 }),
    text('date', 'Datum proslave', '2026-11-14', 34, 76.5, 18, { width: 50, color: '#fff0fc' }),
    text('divider', 'Razdelnik', '·', 59, 76.5, 22, { width: 5, color: '#e6b3dc', editable: false }),
    text('time', 'Vreme proslave', '20:00', 76, 76.5, 21, { width: 29, color: '#fff0fc' }),
    text('location', 'Mesto i adresa', 'Restoran Panorama, Beograd', 50, 82, 14.5, { width: 84, color: '#fff0fc' }),
    text('rsvp', 'Potvrda dolaska', 'Potvrdi dolazak do 7. novembra.', 50, 86.2, 9.5, { family: 'DM Sans', width: 70, color: '#f7dfef' }),
  ];
  if (id === 'saten-i-biseri') layers = [
    text('title', 'Naslov', 'SA RADOŠĆU TE POZIVAM', 68, 14, 8.8, { family: 'DM Sans', width: 57, letterSpacing: 1.45, color: '#70434a' }),
    text('names', 'Ime slavljenika', 'Anđela', 68, 24, 53, { family: script, width: 59, color: '#80434e' }),
    text('intro', 'Uvodni tekst', 'DA ZAJEDNO PROSLAVIMO', 69, 33, 8.7, { family: 'DM Sans', width: 57, letterSpacing: 1.35, color: '#70434a' }),
    text('age', 'Broj godina', '18', 68, 45, 116, { width: 56, color: '#7c424e', effect: 'gradient', effectColor: '#985a4f', lineHeight: 1 }),
    text('occasion', 'Naziv proslave', 'MOJE PUNOLETSTVO', 68, 57, 9.2, { family: 'DM Sans', width: 58, letterSpacing: 1.9, color: '#70434a' }),
    text('note', 'Poruka gostima', 'Jedno novo poglavlje.\nJedna posebna noć sa vama.', 68, 65, 16, { width: 58, color: '#673c43', lineHeight: 1.45 }),
    text('date', 'Datum proslave', '2026-11-14', 68, 73, 20, { width: 58, color: '#673c43' }),
    text('time', 'Vreme proslave', '19:00', 68, 78, 18, { width: 52, color: '#673c43', letterSpacing: 1 }),
    text('location', 'Mesto i adresa', 'Restoran Magnolia, Beograd', 68, 84.5, 15, { width: 57, color: '#673c43' }),
    text('rsvp', 'Potvrda dolaska', 'Potvrda dolaska do 7. novembra.', 68, 91, 9.3, { family: 'DM Sans', width: 57, color: '#6b4149' }),
    text('footer', 'Završna poruka', 'Jedva čekam da slavimo zajedno.', 68, 96, 16.5, { family: script, width: 59, color: '#78414b' }),
  ];
  if (id === 'zlatni-trenutak') layers = [
    text('title', 'Naslov', 'POZIVNICA ZA POSEBNO VEČE', 50, 9, 9, { family: 'DM Sans', width: 85, letterSpacing: 2, color: '#6e542f' }),
    text('names', 'Ime slavljenika', 'Aleksa', 46, 20.5, 46, { width: 84, uppercase: true, letterSpacing: 2, color: '#614b2f' }),
    text('intro', 'Uvodni tekst', 'slavim', 27, 33, 29, { family: script, width: 32, color: '#8a642f' }),
    text('age', 'Broj godina', '18', 65, 36.5, 120, { width: 60, color: '#68502e', effect: 'gradient', effectColor: '#977137', lineHeight: 1 }),
    text('occasion', 'Naziv proslave', 'PUNOLETSTVO', 27, 42, 8.8, { family: 'DM Sans', width: 38, letterSpacing: 1.25, color: '#6a512e' }),
    text('note', 'Poruka gostima', 'Osamnaest želja.\nJedna noć za pamćenje.', 50, 51, 16, { width: 83, color: '#61492e', lineHeight: 1.4 }),
    text('date', 'Datum proslave', '2026-11-14', 70, 60.8, 19, { width: 56, color: '#5b4329' }),
    text('time', 'Vreme proslave', '19:00', 70, 65.8, 19, { width: 48, color: '#5b4329', letterSpacing: 1 }),
    text('location', 'Mesto i adresa', 'Restoran Belvedere\nBeograd', 70, 72.5, 15, { width: 52, color: '#563f28' }),
    text('rsvp', 'Potvrda dolaska', 'Potvrdi dolazak do 7. novembra.', 70, 78.5, 9.4, { family: 'DM Sans', width: 54, color: '#563f28' }),
  ];
  return normalizeDesign({
    schemaVersion: 1, name: metadata.name, category: 'eighteen', locale: 'sr-Latn-RS',
    description: metadata.description, imageAlt: metadata.imageAlt, motif: metadata.motif, seoTitle: metadata.seoTitle, details: metadata.details,
    bg: metadata.bg, backgroundId, thumbnailId: null,
    fonts: [{ assetId: fontIds.serif, family: serif, name: 'Cormorant Garamond — svečani' }, { assetId: fontIds.script, family: script, name: 'Great Vibes — kaligrafski' }],
    layers,
  });
}
