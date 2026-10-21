import { isAssetId, newTextLayer, normalizeDesign } from '../../src/template-schema.js';

export const birthdayDrafts = [
  {
    id: 'dino-avantura', source: 1, name: 'Dino avantura',
    slug: 'pozivnica-za-rodjendan-dinosaurusi',
    seoTitle: 'Pozivnica za dečiji rođendan sa dinosaurusima — Dino avantura',
    description: 'Besplatna pozivnica za dečiji rođendan sa dinosaurusima. Upiši ime, broj godina i detalje dino žurke, pa preuzmi PNG za slanje ili PDF za štampu.',
    imageAlt: 'Pozivnica za rođendan sa zelenim i narandžastim dinosaurusima, tropskim lišćem i razigranim slovima na žutoj pozadini',
    details: 'Zeleni dinosaurusi i topli tonovi namenjeni su malim istraživačima i proslavama sa dino temom. Ime i broj godina su odvojena polja, pa isti dizajn možeš da prilagodiš različitim uzrastima.',
    bg: '#fff0c8',
  },
  {
    id: 'svemirska-misija', source: 2, name: 'Svemirska misija',
    slug: 'pozivnica-za-rodjendan-svemir',
    seoTitle: 'Pozivnica za dečiji rođendan: svemir i raketa — besplatno',
    description: 'Napravi svemirsku pozivnicu za dečiji rođendan sa raketom, planetama i zvezdama. Izmeni ime, godine, datum i mesto, pa preuzmi besplatan PNG ili PDF.',
    imageAlt: 'Pozivnica za rođendan sa narandžastom raketom, planetom sa prstenovima, Mesecom i velikim zlatnim brojem godina',
    details: 'Za male astronaute i rođendan sa svemirskom temom. Podaci su raspoređeni levo, uz raketu i planete; svetla slova ostaju jasna na tamnoplavom nebu. Dodaj adresu igraonice i vreme polaska na rođendansku misiju.',
    bg: '#06387b',
  },
  {
    id: 'mala-sirena', source: 3, name: 'Mala sirena',
    slug: 'pozivnica-za-rodjendan-mala-sirena',
    seoTitle: 'Pozivnica za dečiji rođendan Mala sirena — besplatno online',
    description: 'Pozivnica Mala sirena za dečiji rođendan u tirkiznim i ljubičastim bojama. Uredi ime, godine i poruku i preuzmi besplatnu sliku ili PDF za štampu.',
    imageAlt: 'Pozivnica za rođendan sa malom sirenom, ljubičastim repom, školjkom sa biserom i mehurićima na tirkiznoj pozadini',
    details: 'Podvodna pozivnica za rođendan sa sirenama, biserima i mehurićima. Tekst se nalazi u otvorenom delu mora, tako da ilustracija sirene ostaje vidljiva. Svaku poruku i broj godina možeš da promeniš bez dodavanja fotografije.',
    bg: '#72d9e7',
  },
  {
    id: 'carobni-ringispil', source: 4, name: 'Čarobni ringišpil',
    slug: 'pozivnica-za-rodjendan-konjici-ringispil',
    seoTitle: 'Pozivnica za dečiji rođendan sa konjićima — Čarobni ringišpil',
    description: 'Besplatna pozivnica za dečiji rođendan sa konjićima i roze ringišpilom. Dodaj ime, godine, datum i mesto proslave i preuzmi sliku ili PDF za štampu.',
    imageAlt: 'Pozivnica za rođendan sa dva konjića na roze i zlatnom ringišpilu, mašnama i veselim slovima na svetložutoj pozadini',
    details: 'Vesela pozivnica sa konjićima, mašnama i ringišpilom za rođendan u bajkovitom stilu. Ime je istaknuto ispod ilustracije, a datum i vreme su u dva odvojena bloka. Svetla pozadina čuva čitljivost i na telefonu i na papiru.',
    bg: '#fff1b4',
  },
];

export function birthdayDesign(id, { backgroundId, fontIds } = {}) {
  const metadata = birthdayDrafts.find(item => item.id === id);
  if (!metadata) throw new Error('Nepoznat rođendanski dizajn.');
  if (!isAssetId(backgroundId) || !isAssetId(fontIds?.baloo2) || !isAssetId(fontIds?.dynapuff)) throw new Error('Nedostaju pozadina ili fontovi dizajna.');
  const baloo = `custom-${fontIds.baloo2}`, puff = `custom-${fontIds.dynapuff}`;
  const text = (field, label, value, x, y, size, options = {}) => ({
    ...newTextLayer(field), id: `${id}-${field}`, label, text: value, x, y, size,
    family: 'DM Sans', width: 60, color: '#294d42', lineHeight: 1.5, ...options,
  });
  let layers;
  if (id === 'dino-avantura') layers = [
    text('title', 'Uvodni tekst', 'POZIV ZA VELIKU', 62, 9.5, 11, { family: baloo, letterSpacing: 1.2, color: '#496235' }),
    text('occasion', 'Naslov proslave', 'DINO ŽURKU!', 62, 15, 29, { family: puff, width: 69, color: '#35602e', effect: 'outline', effectColor: '#fff4cf', effectSize: 1.6 }),
    text('names', 'Ime deteta', 'Luka', 64, 23.7, 48, { family: baloo, width: 58, rotation: -3, color: '#315a35' }),
    text('age', 'Broj godina', '5', 52, 33.8, 66, { family: puff, width: 26, color: '#b65a27', effect: 'outline', effectColor: '#fff5d3', effectSize: 2 }),
    text('age_caption', 'Tekst uz godine', 'GODINA', 75, 34.6, 14, { family: baloo, width: 26, rotation: 3, color: '#3c6030' }),
    text('note', 'Poruka gostima', 'Dođi da zajedno istražimo\nsvet dinosaurusa i pojedemo tortu!', 65, 42.3, 11, { width: 57, color: '#354d2b', lineHeight: 1.7 }),
    text('date', 'Datum proslave', '2026-11-14', 67, 49, 16, { family: baloo, width: 57, color: '#34572c' }),
    text('time', 'Vreme proslave', '17:00', 68, 53.6, 13, { width: 34, color: '#34572c' }),
    text('location', 'Mesto proslave', 'Igraonica Avantura, Beograd', 73, 59, 12.5, { family: baloo, width: 43, color: '#304f2c' }),
    text('footer', 'Završna poruka', 'Čeka te prava avantura!', 73, 63.6, 9.8, { width: 43, color: '#304d29' }),
  ];
  if (id === 'svemirska-misija') layers = [
    text('title', 'Uvodni tekst', 'KONTROLA LETA JAVLJA', 35, 13, 8.7, { width: 57, color: '#c5eaff', letterSpacing: 1.7 }),
    text('names', 'Ime deteta', 'Vuk', 35, 22.8, 46, { family: puff, width: 59, uppercase: true, rotation: -3, color: '#fff2c9', effect: 'shadow', effectColor: '#063375', effectSize: 1.4 }),
    text('occasion', 'Naslov proslave', 'SLAVI ROĐENDAN', 36, 31, 16, { family: baloo, width: 58, color: '#c8eeff', letterSpacing: .7 }),
    text('age', 'Broj godina', '6', 34, 41, 78, { family: puff, width: 40, color: '#ffe29b', effect: 'gradient', effectColor: '#ffad55' }),
    text('age_caption', 'Tekst uz godine', 'KRUGOVA OKO SUNCA', 36, 49.3, 9.2, { width: 56, color: '#d2efff', letterSpacing: .95 }),
    text('note', 'Poruka gostima', 'Ukrcaj se na raketu!\nČeka nas svemirska žurka.', 35, 56.4, 11.5, { width: 48, color: '#ffffff', lineHeight: 1.7 }),
    text('date', 'Datum proslave', '2026-11-14', 34, 64.3, 17, { family: baloo, width: 53, color: '#fff3d2' }),
    text('time', 'Vreme proslave', '17:00', 34, 69.2, 13, { width: 40, color: '#fff4d7' }),
    text('location', 'Mesto proslave', 'Igraonica Planeta, Beograd', 34, 75.7, 11.7, { width: 47, color: '#ffffff', effect: 'shadow', effectColor: '#073875', effectSize: 1.5 }),
    text('footer', 'Završna poruka', 'Poletanje počinje sa tobom!', 33, 81.2, 9.5, { width: 47, color: '#ffffff', effect: 'shadow', effectColor: '#063375', effectSize: 1.4 }),
  ];
  if (id === 'mala-sirena') layers = [
    text('title', 'Uvodni tekst', 'POZIV IZ PODVODNOG CARSTVA', 57, 14.5, 8.5, { width: 72, color: '#144964', letterSpacing: 1.15 }),
    text('names', 'Ime deteta', 'Mila', 61, 25, 53, { family: baloo, width: 56, rotation: -4, color: '#593877', effect: 'outline', effectColor: '#d9fbff', effectSize: 1.2 }),
    text('occasion', 'Naslov proslave', 'SLAVI ROĐENDAN', 68, 34.3, 15, { family: puff, width: 48, color: '#174b67' }),
    text('age', 'Broj godina', '5', 69, 44.2, 76, { family: baloo, width: 35, color: '#633e85', effect: 'outline', effectColor: '#d9fbff', effectSize: 2 }),
    text('age_caption', 'Tekst uz godine', 'ČAROBNIH GODINA', 70, 51.3, 9.8, { width: 43, color: '#164760', letterSpacing: 1 }),
    text('note', 'Poruka gostima', 'Zaplivaj sa nama u dan\npun igre, osmeha i čarolije!', 72, 58.8, 11.7, { width: 45, color: '#113f5d', lineHeight: 1.7 }),
    text('date', 'Datum proslave', '2026-11-14', 73, 66, 16, { family: baloo, width: 44, color: '#164762' }),
    text('time', 'Vreme proslave', '17:00', 73, 71, 12.5, { width: 32, color: '#143f58' }),
    text('location', 'Mesto proslave', 'Igraonica Biser, Beograd', 73, 77, 11.8, { width: 43, color: '#153e58', effect: 'shadow', effectColor: '#b6f1f4', effectSize: .8 }),
    text('footer', 'Završna poruka', 'Biseri sreće čekaju te!', 71, 84, 11.4, { family: baloo, width: 44, color: '#4c3c78' }),
  ];
  if (id === 'carobni-ringispil') layers = [
    text('title', 'Uvodni tekst', 'DOBRO DOŠLI U', 50, 44.5, 9.6, { width: 72, color: '#963d60', letterSpacing: 1.7 }),
    text('occasion', 'Naslov proslave', 'CARSTVO RADOSTI', 50, 49.5, 22, { family: baloo, width: 80, color: '#963459', letterSpacing: .5 }),
    text('names', 'Ime deteta', 'Sofija', 48, 56.9, 43, { family: puff, width: 77, rotation: -3, color: '#b23b6b', effect: 'outline', effectColor: '#fff5ce', effectSize: 1.8 }),
    text('age', 'Broj godina', '4.', 35, 65, 52, { family: baloo, width: 28, color: '#a23863' }),
    text('age_caption', 'Tekst uz godine', 'ROĐENDAN', 63, 65.3, 14.8, { family: baloo, width: 43, color: '#96365e' }),
    text('note', 'Poruka gostima', 'Zavrti se sa nama u dan\npun igre, smeha i slatkih iznenađenja!', 50, 71.9, 10.7, { width: 79, color: '#813952', lineHeight: 1.7 }),
    text('date', 'Datum proslave', '2026-11-14', 33, 78.1, 14.2, { family: baloo, width: 49, color: '#873454' }),
    text('divider', 'Razdelnik', '·', 57, 78, 22, { family: baloo, width: 5, color: '#cd7c92', editable: false }),
    text('time', 'Vreme proslave', '17:00', 73, 78.1, 16, { family: baloo, width: 30, color: '#873454' }),
    text('location', 'Mesto proslave', 'Igraonica Čarolija, Beograd', 50, 83.1, 11.8, { width: 75, color: '#803850' }),
    text('footer', 'Završna poruka', 'Tvoje mesto na ringišpilu te čeka!', 50, 87.5, 11.4, { family: baloo, width: 76, color: '#803453' }),
  ];
  return normalizeDesign({
    schemaVersion: 1, name: metadata.name, category: 'birthday', description: metadata.description,
    imageAlt: metadata.imageAlt, seoTitle: metadata.seoTitle, details: metadata.details,
    bg: metadata.bg, backgroundId, thumbnailId: null,
    fonts: [{ assetId: fontIds.baloo2, family: baloo, name: 'Baloo 2 — razigrani' }, { assetId: fontIds.dynapuff, family: puff, name: 'DynaPuff — oblačići' }],
    layers,
  });
}
