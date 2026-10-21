import { newTextLayer, normalizeDesign } from '../../../src/template-schema.js';
import ids from './asset-ids.json' with { type: 'json' };

const metadata = [
  { id: 'jeziceva-radost', name: 'Ježićeva radost', category: 'first', slug: 'pozivnica-prvi-rodjendan-jezic-kruska', seoTitle: 'Pozivnica za prvi rođendan sa ježićem — Ježićeva radost', description: 'Pozivnica za prvi rođendan sa ježićem, kruškom i jesenjim lišćem. Uredi ime i detalje proslave, pa besplatno preuzmi PNG ili PDF za štampu.', imageAlt: 'Pozivnica za prvi rođendan sa akvarelnim ježićem koji drži krušku, žirom i zlatnim lišćem na svetloj krem pozadini', details: 'Nežni ježić i kruška ostaju u donjem desnom uglu, dok ime i velika izmenjiva jedinica imaju svetao prostor iznad ilustracije. Topla smeđa i zelena slova prate jesenju paletu. Izmeni ime, poruku, datum, vreme i tačnu adresu proslave.', bg: '#f7f5e9' },
  { id: 'noc-na-vinilu', name: 'Noć na vinilu', category: 'eighteen', slug: 'pozivnica-18-rodjendan-vinil-ploca', seoTitle: 'Pozivnica za 18. rođendan sa vinilom — Noć na vinilu', description: 'Tamnoplava pozivnica za 18. rođendan sa vinilnom pločom i zlatnim talasima. Izmeni ime i podatke punoletstva i preuzmi besplatan PNG ili PDF.', imageAlt: 'Tamnoplava pozivnica za punoletstvo sa vinilnom pločom gore desno, zlatnim zvučnim talasima i svetlim tekstom', details: 'Vinilna ploča daje najavu večeri uz muziku, a svetla slova i veliki broj 18 izdvajaju slavljenika na tamnoplavoj podlozi. Broj i tekst su zasebni slojevi. Upiši datum, početak, lokaciju i potvrdu dolaska; ovaj šablon nema mesto za fotografiju.', bg: '#101e31' },
  { id: 'zabac-zove-drugare', name: 'Žabac zove drugare', category: 'birthday', slug: 'pozivnica-deciji-rodjendan-zabac-lokvanji', seoTitle: 'Pozivnica za dečji rođendan sa žapcem i lokvanjima', description: 'Vesela dečja pozivnica sa žapcem, lokvanjima i vilinim konjicem. Promeni ime, uzrast od 3 do 10 i detalje rođendana i preuzmi besplatan PNG ili PDF.', imageAlt: 'Dečja pozivnica sa zelenim žapcem na lokvanju, tirkiznim jezercetom, vilinim konjicem i zaobljenim zelenim slovima', details: 'Žabac čeka drugare kraj jezerca, a vilin konjic ostavlja razigran trag iznad njega. Ime i izmenjiv broj godina stoje u svetlom delu; podaci o proslavi su desno od ilustracije. Prvi primer je za treći rođendan, a broj možeš prilagoditi dečjem uzrastu od tri do deset.', bg: '#fff5dc' },
  { id: 'narova-prica', name: 'Narova priča', category: 'wedding', slug: 'pozivnica-za-vencanje-nar-botanicka', seoTitle: 'Botanička pozivnica za venčanje sa narom — Narova priča', description: 'Elegantna pozivnica za venčanje sa narom i botaničkim grančicama. Uredi oba imena, ceremoniju i svadbenu proslavu i preuzmi besplatan PNG ili PDF.', imageAlt: 'Botanička pozivnica za venčanje sa bordo narom, zelenim lišćem i zasebnim imenima mladenaca na toploj krem podlozi', details: 'Bordo nar i fino oslikane grančice stvaraju topao botanički okvir. Imena se uređuju odvojeno u slobodnom gornjem desnom delu, a obred i svadbena proslava imaju zasebna polja ispod. Dodaj datum, obe adrese i potvrdu dolaska, bez ubacivanja fotografije.', bg: '#fbf5ed' },
  { id: 'tihi-izvor', name: 'Tihi izvor', category: 'baptism', slug: 'pozivnica-za-krstenje-krst-krstionica', seoTitle: 'Pozivnica za krštenje sa krstionicom — Tihi izvor', description: 'Svetloplava pozivnica za krštenje sa srebrnom krstionicom i zlatnim krstom. Uredi ime, crkvu i porodičnu proslavu i preuzmi besplatan PNG ili PDF.', imageAlt: 'Pozivnica za krštenje sa srebrnom krstionicom, svetloplavom vodom, zlatnim pravoslavnim krstom i tamnoplavim slovima', details: 'Srebrna krstionica, voda i mali pravoslavni krst prate svečan porodični povod. Raspored čuva ilustraciju u donjem levom delu, dok ime, obred i proslava imaju čitljiva zasebna polja desno. Promeni poruku, datum, naziv crkve, vremena i lokaciju okupljanja.', bg: '#f1f7fa' },
  { id: 'lastino-malo-cudo', name: 'Lastino malo čudo', category: 'baby', slug: 'pozivnica-proslava-rodjenja-decaka-laste', seoTitle: 'Pozivnica za proslavu rođenja dečaka — Lastino malo čudo', description: 'Nežna pozivnica za proslavu rođenja dečaka sa lastama i gnezdom. Upiši ime bebe, datum i mesto okupljanja i preuzmi besplatan PNG ili PDF za štampu.', imageAlt: 'Pozivnica za proslavu rođenja dečaka sa dve plavosive laste i ptićem u gnezdu, krem podlogom i nežnim plavim tekstom', details: 'Dve laste i mali ptić u gnezdu najavljuju porodičnu radost. Ime bebe je ispod ilustracije, a kratak poziv i detalji proslave ostaju jasno odvojeni. Šablon je poziv na proslavu rođenja: izmeni ime, poruku, datum, početak i adresu okupljanja.', bg: '#f7f4eb' },
];
export const batchCatalog = metadata.map(item => ({ ...item, style: 'custom', hasPhoto: false, updatedAt: '2026-10-21T00:00:00Z' }));
export const batchAssetIds = ids;
export function batchDesign(id, { backgroundId = ids.designs[id]?.background, fontIds = ids.fonts } = {}) {
  const meta = metadata.find(item => item.id === id);
  if (!meta) throw new Error('Nepoznat Robijev dizajn: ' + id);
  const baloo = `custom-${fontIds.baloo2}`, script = `custom-${fontIds.marckscript}`, serif = `custom-${fontIds.cormorant}`;
  const text = (field, label, value, x, y, size, extra = {}) => ({ ...newTextLayer(field), id: `${id}-${field}`, label, text: value, x, y, size, width: 76, color: '#344b42', family: 'DM Sans', lineHeight: 1.32, ...extra });
  const date = (x, y, size, extra = {}) => text('date', 'Datum proslave', '2027-06-12', x, y, size, extra);
  const time = (x, y, extra = {}) => text('time', 'Početak proslave', '17:00', x, y, 14, { width: 24, ...extra });
  const rsvp = (x, y, extra = {}) => text('rsvp', 'Potvrda dolaska', 'Potvrdite dolazak\ndo 5. juna.', x, y, 8.5, extra);
  let layers;
  if (id === 'jeziceva-radost') layers = [
    text('title', 'Uvodni tekst', 'GODINA PUNA MALIH RADOSTI', 62, 23, 8.5, { width: 59, letterSpacing: .4, color: '#5e5036' }),
    text('names', 'Ime deteta', 'Vuk', 55, 34, 47, { family: baloo, width: 77, color: '#435e41' }),
    text('age', 'Broj godina', '1.', 31, 48, 72, { family: baloo, width: 30, color: '#916131' }),
    text('occasion', 'Povod', 'ROĐENDAN', 66, 48, 20, { family: baloo, width: 46, color: '#435e41' }),
    text('note', 'Poruka gostima', 'Jedna svećica, mnogo osmeha.\nDođi da slavimo zajedno!', 50, 59, 11, { color: '#4b4535' }),
    date(31, 67, 16, { width: 47, color: '#435e41' }), time(31, 73, { color: '#435e41' }),
    text('location', 'Mesto i adresa proslave', 'Igraonica Ježić\nBeograd', 31, 81, 11, { width: 46, color: '#4b4535' }),
    rsvp(31, 91, { width: 46, color: '#4b4535' }),
  ];
  if (id === 'noc-na-vinilu') layers = [
    text('title', 'Uvodni tekst', 'DOBAR RITAM.\nMOJE PUNOLETSTVO.', 27, 14, 9, { width: 40, align: 'left', letterSpacing: .4, color: '#fff2d4' }),
    text('names', 'Ime slavljenika', 'Luka', 28, 26, 36, { family: serif, width: 43, align: 'left', color: '#fff2d4' }),
    text('age', 'Broj godina', '18', 26, 41, 83, { family: serif, width: 41, align: 'left', color: '#f8cc77' }),
    text('occasion', 'Povod', 'ROĐENDAN', 28, 51, 16, { width: 43, align: 'left', letterSpacing: .8, color: '#fff2d4' }),
    text('note', 'Poruka gostima', 'Jedna noć, omiljena muzika\ni ljudi sa kojima vredi slaviti.', 51, 59, 11.5, { width: 78, color: '#fff2d4' }),
    date(35, 67, 17, { width: 51, color: '#f8cc77' }), time(77, 67, { color: '#f8cc77' }),
    text('location', 'Mesto i adresa proslave', 'Restoran Vinil\nBeograd', 75, 78, 10.5, { width: 35, color: '#fff2d4' }),
    rsvp(75, 90, { width: 35, size: 8, color: '#fff2d4' }),
  ];
  if (id === 'zabac-zove-drugare') layers = [
    text('title', 'Uvodni tekst', 'HOP, HOP — STIŽE ROĐENDAN!', 43, 16, 9, { width: 66, color: '#30614e' }),
    text('names', 'Ime deteta', 'Uroš', 47, 28, 45, { family: baloo, width: 78, color: '#286047' }),
    text('age', 'Broj godina', '3.', 34, 42, 68, { family: baloo, width: 31, color: '#48782b' }),
    text('occasion', 'Povod', 'ROĐENDAN', 66, 43, 19, { family: baloo, width: 43, color: '#286047' }),
    text('note', 'Poruka gostima', 'Žabac zove drugare na igru,\ntortu i rođendanske skokove!', 49, 53, 11, { width: 79, color: '#315346' }),
    date(74, 64, 15.5, { width: 39, color: '#286047' }), time(75, 70, { color: '#286047' }),
    text('location', 'Mesto i adresa proslave', 'Igraonica Lokvanj\nBeograd', 75, 79, 10.5, { width: 35, color: '#315346' }),
    rsvp(75, 91, { width: 35, size: 8, color: '#315346' }),
  ];
  if (id === 'narova-prica') layers = [
    text('title', 'Uvodni tekst', 'NAŠA PRIČA POSTAJE ZAJEDNIČKA', 65, 13, 8, { width: 55, color: '#673c45', letterSpacing: .3 }),
    text('bride', 'Ime mlade', 'Milica', 65, 23, 40, { family: script, width: 55, color: '#783b49' }),
    text('join', 'Veznik', '&', 65, 31, 25, { family: serif, width: 30, color: '#6a7050' }),
    text('groom', 'Ime mladoženje', 'Stefan', 65, 39, 40, { family: script, width: 55, color: '#783b49' }),
    text('note', 'Poruka gostima', 'Sa radošću vas pozivamo\nda zajedno proslavimo naše venčanje.', 49, 49, 11, { width: 80, color: '#55453f' }),
    date(49, 57, 18, { width: 76, family: serif, color: '#783b49' }),
    text('ceremony_time', 'Vreme obreda', 'VENČANJE · 14:00', 35, 64, 10.5, { width: 53, align: 'left', color: '#673c45' }),
    text('ceremony_location', 'Mesto i adresa obreda', 'Hram Svetog Save\nBeograd', 35, 70, 10.5, { width: 53, align: 'left', color: '#55453f' }),
    text('time', 'Početak svadbene proslave', 'SVADBENA PROSLAVA · 17:00', 35, 77, 10.5, { width: 53, align: 'left', color: '#673c45' }),
    text('location', 'Mesto i adresa proslave', 'Restoran Nar\nBeograd', 35, 84, 10.5, { width: 53, align: 'left', color: '#55453f' }),
    rsvp(35, 93, { width: 53, size: 8, align: 'left', color: '#55453f' }),
  ];
  if (id === 'tihi-izvor') layers = [
    text('title', 'Uvodni tekst', 'SA LJUBAVLJU VAS POZIVAMO', 59, 16, 9, { width: 70, color: '#35516d', letterSpacing: .3 }),
    text('names', 'Ime deteta', 'Đorđe', 60, 28, 50, { family: script, width: 73, color: '#294e70' }),
    text('occasion', 'Povod', 'KRŠTENJE', 61, 39, 24, { family: serif, width: 67, color: '#294e70', letterSpacing: .6 }),
    text('note', 'Poruka gostima', 'Budite uz nas na danu\npunom vere, ljubavi i radosti.', 60, 47, 11.5, { width: 68, color: '#354f65' }),
    date(69, 57, 17, { width: 47, family: serif, color: '#294e70' }),
    text('ceremony_time', 'Početak obreda', 'OBRED · 12:00', 69, 63, 10.5, { width: 47, color: '#294e70' }),
    text('ceremony_location', 'Naziv i adresa crkve', 'Crkva Svetog Marka\nBeograd', 69, 70, 10.5, { width: 47, color: '#354f65' }),
    text('time', 'Početak proslave', 'PROSLAVA · 14:00', 69, 77, 10.5, { width: 47, color: '#294e70' }),
    text('location', 'Mesto i adresa proslave', 'Restoran Izvor\nBeograd', 69, 84, 10.5, { width: 47, color: '#354f65' }),
    rsvp(68, 93, { width: 50, size: 8, color: '#354f65' }),
  ];
  if (id === 'lastino-malo-cudo') layers = [
    text('title', 'Uvodni tekst', 'NAŠ MALI\nSVET JE LEPŠI', 25, 19, 12, { width: 36, align: 'left', color: '#425a6c', letterSpacing: .3 }),
    text('welcome', 'Kratka poruka', 'DOBRO NAM\nDOŠAO', 25, 31, 10, { width: 36, align: 'left', color: '#425a6c', letterSpacing: .5 }),
    text('names', 'Ime bebe', 'Vukan', 51, 52, 52, { family: script, width: 81, color: '#425a6c' }),
    text('occasion', 'Povod', 'PROSLAVA ROĐENJA', 53, 61, 18, { family: serif, width: 78, color: '#425a6c' }),
    text('note', 'Poruka gostima', 'Naša porodica je bogatija za jednu ljubav.\nDođite da tu radost podelimo sa vama!', 52, 69, 11, { width: 80, color: '#4b5260' }),
    date(35, 76, 16, { width: 50, color: '#425a6c' }), time(78, 76, { color: '#425a6c' }),
    text('location', 'Mesto i adresa proslave', 'Restoran Gnezdo\nBeograd', 62, 84, 11, { width: 63, color: '#4b5260' }),
    rsvp(62, 93, { width: 63, size: 8, color: '#4b5260' }),
  ];
  const used = new Set(layers.map(layer => layer.family));
  const fontNames = { baloo2: 'Baloo 2', dynapuff: 'DynaPuff', cormorant: 'Cormorant Garamond', marckscript: 'Marck Script' };
  const fonts = Object.entries(fontIds).filter(([, assetId]) => used.has(`custom-${assetId}`)).map(([key, assetId]) => ({ assetId, family: `custom-${assetId}`, name: fontNames[key] }));
  return { ...normalizeDesign({ ...meta, backgroundId, thumbnailId: ids.designs[id].thumbnail, fonts, layers }), ...meta, id, builtinSource: id, style: 'custom', hasPhoto: false };
}
export const getBatchDesigns = () => metadata.map(item => batchDesign(item.id));
