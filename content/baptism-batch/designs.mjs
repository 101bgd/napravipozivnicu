import { isAssetId, newTextLayer, normalizeDesign } from '../../src/template-schema.js';

export const baptismDrafts = [
  {
    id: 'andjeoski-blagoslov', source: 1, name: 'Anđeoski blagoslov',
    slug: 'pozivnica-za-krstenje-andjeo', locale: 'sr-Cyrl-RS',
    motif: 'sa anđelom i krstom',
    seoTitle: 'Pozivnica za krštenje sa anđelom i krstom — Anđeoski blagoslov',
    description: 'Besplatna pozivnica za krštenje deteta sa anđelom i roze oblacima. Uredi ćirilični tekst, ime, crkvu i mesto proslave, pa preuzmi PNG ili PDF za štampu.',
    imageAlt: 'Pozivnica za krštenje sa anđelom koji drži zlatni krst, belom golubicom, roze oblacima i ćiriličnim rukopisnim imenom',
    details: 'Anđeo, golubica i topli oblaci uokviruju svečan tekst na ćirilici. Ime deteta je ispisano mekom kaligrafijom, dok su datum, vreme obreda, crkva i mesto ručka jasno odvojeni. Šablon je bez fotografije; možeš uneti i tekst na latinici.',
    bg: '#faeee3',
  },
  {
    id: 'golubica-mira', source: 2, name: 'Golubica mira',
    slug: 'pozivnica-za-krstenje-golubica-maslina', locale: 'sr-Latn-RS',
    motif: 'sa golubicom i maslinom',
    seoTitle: 'Pozivnica za krštenje sa golubicom i maslinom — Golubica mira',
    description: 'Elegantna pozivnica za pravoslavno krštenje sa golubicom, maslinom i zlatnim krstom. Izmeni ime, datum i lokacije i besplatno preuzmi sliku ili PDF.',
    imageAlt: 'Pozivnica za krštenje sa belom golubicom, maslinovim grančicama, zlatnim krstom i svečanim tekstom na desnoj strani',
    details: 'Bela golubica i maslinove grančice ostaju u prvom planu, a klasična serifna slova prate slobodan prostor desno. Maslinastozeleni i bronzani tonovi daju svečan izgled. Odvojeno uredi crkvu i mesto porodične proslave, bez dodavanja fotografije.',
    bg: '#f8f4e5',
  },
  {
    id: 'put-svetlosti', source: 3, name: 'Put svetlosti',
    slug: 'pozivnica-za-pravoslavno-krstenje-crkva', locale: 'sr-Cyrl-RS',
    motif: 'sa pravoslavnom crkvom',
    seoTitle: 'Pozivnica za krštenje sa pravoslavnom crkvom — Put svetlosti',
    description: 'Napravi pozivnicu za pravoslavno krštenje deteta sa crkvom i zlatnim nebom. Uredi ime na ćirilici, obred i proslavu i preuzmi besplatan PNG ili PDF.',
    imageAlt: 'Pozivnica za krštenje sa pravoslavnom crkvom, kupolom i krstom, golubicama, zlatnim zracima i ćiriličnim tekstom',
    details: 'Pravoslavna crkva i staza pod svetlim nebom prate priču o početku duhovnog puta. Veliko ime na ćirilici nalazi se iznad hrama, a detalji obreda i proslave u dva bloka desno. Topla smeđa slova čuvaju čitljivost na zlatnom nebu; šablon nema okvir za fotografiju.',
    bg: '#f9e7bd',
  },
  {
    id: 'svetlost-krstenja', source: 4, name: 'Svetlost krštenja',
    slug: 'pozivnica-za-krstenje-krst-sveca', locale: 'sr-Latn-RS',
    motif: 'sa krstom i svećom',
    seoTitle: 'Pozivnica za krštenje sa krstom i svećom — Svetlost krštenja',
    description: 'Besplatna pozivnica za krštenje sa pravoslavnim krstom, svećom i plavom trakom. Personalizuj ime, poruku i lokacije i preuzmi PNG ili PDF za štampu.',
    imageAlt: 'Pozivnica za krštenje sa pravoslavnim krstom, upaljenom svećom, maslinom, plavom svilenom trakom i tamnoplavim slovima',
    details: 'Zlatni krst i upaljena sveća ukrašavaju gornji deo pozivnice, dok je donji deo rezervisan za ime i sve podatke. Tamnoplava klasična tipografija dopunjena je kaligrafskom porukom. Vreme i mesto obreda i ručka menjaju se nezavisno; fotografija nije potrebna.',
    bg: '#f4f1e8',
  },
];

export function baptismDesign(id, { backgroundId, fontIds } = {}) {
  const metadata = baptismDrafts.find(item => item.id === id);
  if (!metadata) throw new Error('Nepoznat dizajn za krštenje.');
  if (!isAssetId(backgroundId) || !isAssetId(fontIds?.cormorant) || !isAssetId(fontIds?.marckscript)) throw new Error('Nedostaju pozadina ili fontovi dizajna.');
  const serif = `custom-${fontIds.cormorant}`, script = `custom-${fontIds.marckscript}`;
  const text = (field, label, value, x, y, size, options = {}) => ({
    ...newTextLayer(field), id: `${id}-${field}`, label, text: value, x, y, size,
    family: serif, width: 78, color: '#614330', lineHeight: 1.35, ...options,
  });
  let layers;
  if (id === 'andjeoski-blagoslov') layers = [
    text('title', 'Naslov', 'СВЕТО КРШТЕЊЕ', 50, 13, 19, { letterSpacing: 2.6, color: '#754a42' }),
    text('intro', 'Uvodni tekst', 'Са љубављу вас позивамо\nна крштење наше ћерке', 50, 20, 14.5, { color: '#67443b', lineHeight: 1.45 }),
    text('names', 'Ime deteta', 'Софија', 50, 29.4, 56, { family: script, width: 85, color: '#8c4c53' }),
    text('note', 'Poruka gostima', 'Поделите са нама радост\nњеног првог духовног корака.', 50, 37, 14, { width: 73, color: '#67443b', lineHeight: 1.4 }),
    text('date', 'Datum krštenja', '2026-11-14', 29, 57.5, 16.5, { width: 48, color: '#633e35' }),
    text('time', 'Vreme obreda', '12:00', 29, 62.1, 17, { width: 40, letterSpacing: 1, color: '#633e35' }),
    text('location', 'Crkva i adresa', 'Храм Светог Саве\nБеоград', 29, 68.6, 14, { width: 44, color: '#633e35' }),
    text('celebration_label', 'Najava proslave', 'СВЕЧАНИ РУЧАК', 28, 76, 10.5, { width: 43, letterSpacing: 1.2, color: '#71473e' }),
    text('celebration', 'Mesto proslave', 'Ресторан Магнолија', 28, 80, 14, { width: 43, color: '#633e35' }),
    text('celebration_time', 'Vreme proslave', 'од 14:00 часова', 28, 84, 12.5, { width: 43, color: '#633e35' }),
    text('footer', 'Završna poruka', 'С љубављу, породица Петровић', 49, 92.5, 19, { family: script, width: 82, color: '#753f46' }),
  ];
  if (id === 'golubica-mira') layers = [
    text('title', 'Naslov', 'SVETO KRŠTENJE', 68, 40, 13, { width: 54, color: '#58613b', letterSpacing: 2 }),
    text('intro', 'Uvodni tekst', 'Sa radošću vas pozivamo\nna krštenje našeg sina', 68, 46.8, 13.5, { width: 51, color: '#414d32', lineHeight: 1.4 }),
    text('names', 'Ime deteta', 'Lazar', 67, 55.1, 50, { width: 57, uppercase: true, color: '#3e4e35', letterSpacing: 1.4 }),
    text('note', 'Poruka gostima', 'Jedan blagoslov.\nUspomena za ceo život.', 68, 62.5, 17, { width: 51, family: script, color: '#665332' }),
    text('date', 'Datum krštenja', '2026-11-14', 68, 70.2, 16.5, { width: 53, color: '#3f4c32' }),
    text('time', 'Vreme obreda', '12:00', 68, 74.4, 15.5, { width: 45, color: '#3f4c32', letterSpacing: 1 }),
    text('location', 'Crkva i adresa', 'Hram Svetog Save, Beograd', 68, 79, 13, { width: 52, color: '#3f4c32' }),
    text('celebration_label', 'Najava proslave', 'SVEČANI RUČAK', 69, 84.7, 10, { width: 48, letterSpacing: 1.6, color: '#655332' }),
    text('celebration', 'Mesto proslave', 'Restoran Magnolia', 69, 88.6, 14.5, { width: 49, color: '#3f4c32' }),
    text('celebration_time', 'Vreme proslave', 'od 14:00 časova', 69, 92.1, 12.5, { width: 48, color: '#3f4c32' }),
    text('footer', 'Završna poruka', 'Dobro nam došli!', 68, 96.7, 17, { family: script, width: 51, color: '#545d37' }),
  ];
  if (id === 'put-svetlosti') layers = [
    text('title', 'Naslov', 'СВЕТО КРШТЕЊЕ', 41, 11.4, 17, { width: 66, letterSpacing: 2.7, color: '#60452c' }),
    text('intro', 'Uvodni tekst', 'Са радошћу вас позивамо\nна крштење нашег сина', 41, 18, 14, { width: 66, color: '#533e2c', lineHeight: 1.4 }),
    text('names', 'Ime deteta', 'Михаило', 45, 27, 47, { width: 81, uppercase: true, letterSpacing: 1.3, color: '#5d4029' }),
    text('note', 'Poruka gostima', 'Нека овај дан буде почетак\nпута испуњеног љубављу и вером.', 47, 35, 13.5, { width: 76, color: '#533e2c', lineHeight: 1.4 }),
    text('date', 'Datum krštenja', '2026-11-14', 46, 42, 17, { width: 76, color: '#573c27' }),
    text('ceremony_label', 'Najava obreda', 'СВЕТА ТАЈНА КРШТЕЊА', 73, 49.4, 9.7, { width: 48, letterSpacing: 1.25, color: '#5b422b' }),
    text('time', 'Vreme obreda', '12:00', 73, 53.1, 19, { width: 43, color: '#533b28' }),
    text('location', 'Crkva i adresa', 'Храм Светог Саве\nБеоград', 73, 58, 14, { width: 47, color: '#533b28' }),
    text('celebration_label', 'Najava proslave', 'СВЕЧАНИ РУЧАК', 73, 65.4, 10, { width: 48, letterSpacing: 1.25, color: '#573e28' }),
    text('celebration', 'Mesto proslave', 'Ресторан Магнолија', 73, 69.3, 13, { width: 48, color: '#493827' }),
    text('celebration_time', 'Vreme proslave', 'од 14:00 часова', 73, 73, 12.5, { width: 48, color: '#493827' }),
  ];
  if (id === 'svetlost-krstenja') layers = [
    text('title', 'Naslov', 'SVETO KRŠTENJE', 50, 52.2, 15, { width: 79, letterSpacing: 2.8, color: '#36516a' }),
    text('intro', 'Uvodni tekst', 'Sa ljubavlju vas pozivamo na krštenje', 50, 57, 13.5, { width: 84, color: '#30485e' }),
    text('names', 'Ime deteta', 'Petar', 50, 64, 48, { width: 85, color: '#29475e', uppercase: true, letterSpacing: 3 }),
    text('note', 'Poruka gostima', 'Budite deo našeg blagoslovenog dana.', 50, 70.2, 18, { family: script, width: 88, color: '#4c5361' }),
    text('date', 'Datum krštenja', '2026-11-14', 35, 77, 16, { width: 53, color: '#2e465d' }),
    text('divider', 'Razdelnik', '·', 61, 77, 21, { editable: false, width: 5, color: '#88692f' }),
    text('time', 'Vreme obreda', '12:00', 76, 77, 17, { width: 26, color: '#2e465d', letterSpacing: .8 }),
    text('location', 'Crkva i adresa', 'Hram Svetog Save, Beograd', 50, 82.5, 14, { width: 84, color: '#2e465d' }),
    text('celebration', 'Mesto proslave', 'Svečani ručak · Restoran Magnolia', 50, 88, 13.5, { width: 84, color: '#2e465d' }),
    text('celebration_time', 'Vreme proslave', 'od 14:00 časova', 50, 91.8, 12.5, { width: 80, color: '#2e465d' }),
    text('footer', 'Završna poruka', 'S ljubavlju, porodica Petrović', 50, 96.3, 17, { family: script, width: 83, color: '#3c5266' }),
  ];
  return normalizeDesign({
    schemaVersion: 1, name: metadata.name, category: 'baptism', locale: metadata.locale,
    description: metadata.description, imageAlt: metadata.imageAlt, motif: metadata.motif, seoTitle: metadata.seoTitle, details: metadata.details,
    bg: metadata.bg, backgroundId, thumbnailId: null,
    fonts: [{ assetId: fontIds.cormorant, family: serif, name: 'Cormorant Garamond — svečani' }, { assetId: fontIds.marckscript, family: script, name: 'Napravi rukopis — kaligrafski' }],
    layers,
  });
}
