import { isAssetId, newTextLayer, normalizeDesign } from '../../src/template-schema.js';

export const babyDrafts = [
  {
    id: 'zvezda-naseg-neba', source: 1, name: 'Zvezda našeg neba',
    slug: 'pozivnica-za-rodjenje-deteta-beba-zvezdano-nebo',
    motif: 'sa bebom na zvezdanom oblaku',
    seoTitle: 'Pozivnica za rođenje deteta sa bebom na zvezdanom oblaku — Zvezda našeg neba',
    description: 'Pozivnica za rođenje bebe sa zvezdanim nebom i uspavanom bebom na oblaku. Uredi ime i detalje proslave, pa besplatno preuzmi PNG ili PDF za štampu.',
    imageAlt: 'Pozivnica za rođenje deteta sa uspavanom bebom na oblaku, plavim povojem, zvezdanim nebom i svetlim rukopisnim imenom',
    details: 'Uspavana beba na mekom oblaku i sitne zlatne zvezde uokviruju poziv na proslavu rođenja. Svetlo rukopisno ime ističe se na tamnoplavom nebu, a datum i vreme stoje jedan pored drugog. Ilustracija je deo pozadine; lična fotografija se ne dodaje.',
    bg: '#132c50',
  },
  {
    id: 'rodin-mali-dar', source: 2, name: 'Rodin mali dar',
    slug: 'pozivnica-za-proslavu-rodjenja-bebe-roda',
    motif: 'sa rodom i zavežljajem',
    seoTitle: 'Pozivnica za rođenje deteta sa rodom i zavežljajem — Rodin mali dar',
    description: 'Besplatna pozivnica za proslavu rođenja bebe sa rodom u krem i zelenim tonovima. Promeni ime, poruku i mesto okupljanja i preuzmi sliku ili PDF.',
    imageAlt: 'Pozivnica za rođenje deteta sa belom rodom koja nosi zavežljaj, zelenim oblacima i kaligrafskim imenom na krem pozadini',
    details: 'Bela roda nosi mali zavežljaj iznad toplog krem neba. Kaligrafsko ime i maslinastozeleni tekst smešteni su ispod njenih krila, tako da ilustracija ostane potpuno vidljiva. Promeni poruku za porodičnu proslavu ili babine. Šablon nema mesto za fotografiju.',
    bg: '#fbefd5',
  },
  {
    id: 'mali-konjic-velika-radost', source: 3, name: 'Mali konjić, velika radost',
    slug: 'pozivnica-za-rodjenje-decaka-bodic-konjic',
    motif: 'sa plavim bodićem i konjićem',
    seoTitle: 'Pozivnica za rođenje deteta sa plavim bodićem i konjićem — Mali konjić, velika radost',
    description: 'Plava pozivnica za rođenje dečaka sa bodićem i drvenim konjićem. Upiši ime bebe i podatke proslave, pa preuzmi besplatan PNG ili PDF za štampu.',
    imageAlt: 'Pozivnica za rođenje deteta sa plavim bodićem, drvenim konjićem za ljuljanje i dugmićima levo, uz ime i podatke desno',
    details: 'Plavi bodić, konjić za ljuljanje i mala dugmad prate levu ivicu pozivnice. Desno ostaje miran krem prostor za zaobljeno ime deteta, kratku poruku i pregledne podatke o proslavi. Tekst se uređuje odvojeno, bez dodavanja lične fotografije.',
    bg: '#f7eddb',
  },
  {
    id: 'cvet-nase-porodice', source: 4, name: 'Cvet naše porodice',
    slug: 'pozivnica-za-rodjenje-devojcice-roze-bozur',
    motif: 'sa bebom u cvetu božura',
    seoTitle: 'Pozivnica za rođenje deteta sa bebom u cvetu božura — Cvet naše porodice',
    description: 'Roze pozivnica za rođenje devojčice sa bebom u božuru i svečanim rukopisnim imenom. Uredi tekst i besplatno preuzmi sliku ili PDF, bez fotografije.',
    imageAlt: 'Pozivnica za rođenje deteta sa uspavanom bebom u cvetu božura, roze pozadinom i tamnoružičastim rukopisnim imenom',
    details: 'Veliki roze božur čuva uspavanu bebu, dok se levo nižu kaligrafsko ime i kratki podaci o okupljanju. Tamnoružičasta slova daju kontrast mekoj cvetnoj pozadini. Beba u cvetu je deo originalne ilustracije; ovaj dizajn nema okvir za ličnu fotografiju.',
    bg: '#f5dfd6',
  },
  {
    id: 'prvi-mali-koraci', source: 5, name: 'Prvi mali koraci',
    slug: 'pozivnica-za-rodjenje-bebe-pletene-patofnice',
    motif: 'sa pletenim patofnicama',
    seoTitle: 'Pozivnica za rođenje deteta sa pletenim patofnicama — Prvi mali koraci',
    description: 'Minimalistička pozivnica za rođenje bebe sa pletenim patofnicama i toplim peščanim tonovima. Prilagodi ime i proslavu i preuzmi besplatan PNG ili PDF.',
    imageAlt: 'Pozivnica za rođenje deteta sa krem pletenim patofnicama, pamukom, zelenim suncem i velikim smeđim imenom',
    details: 'Krem papir, peščani oblici, diskretno zeleno sunce i par pletenih patofnica stvaraju topao, jednostavan okvir. Krupno ime u klasičnom fontu ostaje u središtu, a kratka rukopisna poruka je izdvojena dole levo. Poziv za devojčicu ili dečaka, bez mesta za fotografiju.',
    bg: '#fbedda',
  },
  {
    id: 'kolevka-puna-ljubavi', source: 6, name: 'Kolevka puna ljubavi',
    slug: 'pozivnica-za-rodjenje-deteta-roze-kolevka',
    motif: 'sa kolevkom i roze baldahinom',
    seoTitle: 'Pozivnica za rođenje deteta sa kolevkom i roze baldahinom — Kolevka puna ljubavi',
    description: 'Pozivnica za rođenje deteta sa pletenom kolevkom i roze baldahinom. Izmeni ime, datum i mesto proslave i besplatno preuzmi PNG ili PDF za štampu.',
    imageAlt: 'Pozivnica za rođenje deteta sa pletenom kolevkom, roze baldahinom, medom i rukopisnim imenom iznad ilustracije',
    details: 'Pletena kolevka, roze baldahin i mali meda ostaju u donjem levom delu. Rukopisno ime i poruka nalaze se iznad kolevke, dok su datum, vreme i adresa poravnati u zaseban desni blok. Prilagodi poziv za proslavu rođenja ili babine, bez ubacivanja fotografije.',
    bg: '#fbe5d5',
  },
];

export function babyDesign(id, { backgroundId, fontIds } = {}) {
  const metadata = babyDrafts.find(item => item.id === id);
  if (!metadata) throw new Error('Nepoznat dizajn za rođenje deteta.');
  if (!isAssetId(backgroundId) || !['baloo2', 'script', 'calligraphy'].every(key => isAssetId(fontIds?.[key]))) throw new Error('Nedostaju pozadina ili fontovi dizajna.');
  const baloo = `custom-${fontIds.baloo2}`, script = `custom-${fontIds.script}`, calligraphy = `custom-${fontIds.calligraphy}`;
  const text = (field, label, value, x, y, size, options = {}) => ({ ...newTextLayer(field), id: `${id}-${field}`, label, text: value, x, y, size, family: 'DM Sans', color: '#564b3c', width: 76, lineHeight: 1.4, ...options });
  const title = (value, x, y, color, options = {}) => text('title', 'Uvodni tekst', value, x, y, 9, { color, letterSpacing: 1.2, ...options });
  const name = (value, x, y, size, color, options = {}) => text('names', 'Ime deteta', value, x, y, size, { family: script, color, ...options });
  const note = (value, x, y, color, options = {}) => text('note', 'Poruka gostima', value, x, y, 11.5, { color, ...options });
  const date = (x, y, size, color, options = {}) => text('date', 'Datum proslave', '2027-04-24', x, y, size, { family: 'Libre Caslon Display', color, ...options });
  const time = (x, y, size, color, options = {}) => text('time', 'Vreme proslave', '16:00', x, y, size, { family: 'Libre Caslon Display', color, width: 24, ...options });
  const place = (value, x, y, color, options = {}) => text('location', 'Mesto i adresa proslave', value, x, y, 11, { color, ...options });
  const rsvp = (x, y, color, options = {}) => text('rsvp', 'Potvrda dolaska', 'Javite nam da dolazite do 17. aprila.', x, y, 8.5, { color, ...options });
  let layers;
  if (id === 'zvezda-naseg-neba') layers = [
    title('MALA ZVEZDA. VELIKA LJUBAV.', 49, 41.5, '#fce5ac', { width: 81, size: 9.1, effect: 'outline', effectColor: '#173451', effectSize: .4 }),
    name('Mihajlo', 49, 48, 48, '#fff1cf', { width: 82, effect: 'shadow', effectColor: '#12263f', effectSize: 1.5 }),
    note('Naš svet je postao čarobniji.\nPridružite nam se na proslavi rođenja.', 50, 58, '#fff3dc', { width: 83, size: 12 }),
    date(34, 66.5, 21, '#ffe4aa', { width: 52, effect: 'outline', effectColor: '#173451', effectSize: 1.2 }), time(77, 66.5, 21, '#ffe4aa', { effect: 'outline', effectColor: '#173451', effectSize: 1.2 }),
    place('Restoran Zvezda\nBulevar umetnosti 12, Beograd', 51, 73, '#fff1d6', { width: 80, size: 11.5, effect: 'outline', effectColor: '#173451', effectSize: 1.2 }),
    rsvp(52, 80, '#fff1d6', { width: 82, size: 9.5, effect: 'outline', effectColor: '#173451', effectSize: 1.2 }),
  ];
  if (id === 'rodin-mali-dar') layers = [
    title('IZ NAŠEG GNEZDA, S LJUBAVLJU', 51, 43, '#526145', { width: 82, size: 8.8 }),
    name('Lenka', 50, 53, 55, '#536447', { family: calligraphy, width: 82 }),
    note('Stigla je naša mala sreća.\nDođite da proslavimo njen dolazak!', 50, 64, '#43513a', { width: 81, size: 12 }),
    date(34, 73, 21, '#4c5d40', { width: 53 }), time(77, 73, 21, '#4c5d40'),
    place('Restoran Gnezdo\nUlica lipa 8, Beograd', 50, 81, '#43513a', { width: 79, size: 11.5 }),
    rsvp(50, 89, '#43513a', { width: 80, size: 9 }),
  ];
  if (id === 'mali-konjic-velika-radost') layers = [
    title('STIGLA JE\nNAŠA MALA SREĆA', 70, 17.5, '#36566c', { width: 51, size: 10.5, letterSpacing: .9 }),
    name('Filip', 70, 30, 43, '#385f79', { family: baloo, width: 52 }),
    note('Jedan mali dečak,\nbezbroj velikih osmeha.\nProslavimo zajedno!', 70, 43, '#374f5e', { width: 49, size: 12 }),
    date(70, 57, 18, '#36566c', { width: 51 }), time(70, 63, 18, '#36566c'),
    place('Restoran Konjić\nUlica lipa 8\nBeograd', 70, 73, '#374f5e', { width: 48, size: 11.5 }),
    rsvp(70, 85, '#374f5e', { width: 47, size: 9 }),
  ];
  if (id === 'cvet-nase-porodice') layers = [
    title('PROCVALA JE\nNAŠA NAJLEPŠA PRIČA', 31, 15, '#7d4656', { width: 48, size: 9.5, letterSpacing: .8 }),
    name('Lena', 30, 28, 54, '#8c3f58', { family: calligraphy, width: 49 }),
    note('Sa radošću vas pozivamo\nda zajedno proslavimo\ndolazak naše devojčice.', 30, 42, '#6c3e4b', { width: 47, size: 11.5 }),
    date(30, 56, 19, '#7c4053', { width: 48 }), time(30, 62, 19, '#7c4053'),
    place('Restoran Božur\nCvetna ulica 12\nBeograd', 30, 73, '#6c3e4b', { width: 46, size: 11.5 }),
    rsvp(30, 86, '#6c3e4b', { width: 46, size: 9 }),
  ];
  if (id === 'prvi-mali-koraci') layers = [
    title('DOBRO DOŠAO U NAŠ SVET', 51, 26, '#665a41', { width: 83, size: 9, letterSpacing: 1.8 }),
    name('Pavle', 49, 39, 64, '#725039', { family: 'Libre Caslon Display', width: 84, letterSpacing: 1.5 }),
    note('Naša porodica je bogatija za jednu ljubav.\nPridružite nam se na proslavi rođenja.', 49, 53, '#5d4b38', { width: 83, size: 12 }),
    date(32, 64, 22, '#725039', { width: 52 }), time(75, 64, 22, '#725039'),
    place('Restoran Mali svet\nUlica lipa 8\nBeograd', 29, 74.5, '#5d4b38', { width: 45, size: 11.5 }),
    rsvp(28, 84.5, '#5c4431', { width: 43, size: 9 }),
    text('footer', 'Završna poruka', 'Mali koraci.\nNajveća ljubav.', 29, 93, 21, { family: script, color: '#795038', width: 47, lineHeight: 1.05 }),
  ];
  if (id === 'kolevka-puna-ljubavi') layers = [
    title('JEDAN NOVI POČETAK', 57, 13, '#865341', { width: 76, size: 9.5, letterSpacing: 1.5 }),
    name('Iskra', 57, 23, 53, '#945044', { width: 79 }),
    note('Slavimo dolazak naše devojčice.\nDobro došli u našu malu radost!', 59, 35, '#744b3d', { width: 74, size: 12 }),
    date(76, 52, 18, '#814d3d', { width: 44 }), time(76, 59, 18, '#814d3d'),
    place('Restoran Iskra\nCvetna ulica 12\nBeograd', 76, 71, '#6d4438', { width: 40, size: 11.5 }),
    rsvp(76, 84, '#6d4438', { width: 39, size: 9 }),
    text('footer', 'Potpis porodice', 'Sa ljubavlju, porodica Petrović', 54, 94, 17, { family: 'Libre Caslon Display', color: '#744b3d', width: 80 }),
  ];
  const usedFamilies = new Set(layers.map(layer => layer.family));
  const fonts = [
    { assetId: fontIds.baloo2, family: baloo, name: 'Baloo 2 — razigrani' },
    { assetId: fontIds.script, family: script, name: 'Napravi Rukopis — nežni' },
    { assetId: fontIds.calligraphy, family: calligraphy, name: 'Great Vibes — svečani' },
  ].filter(font => usedFamilies.has(font.family));
  return normalizeDesign({ schemaVersion: 1, name: metadata.name, category: 'baby', locale: 'sr-Latn-RS', description: metadata.description, imageAlt: metadata.imageAlt, motif: metadata.motif, seoTitle: metadata.seoTitle, details: metadata.details, bg: metadata.bg, backgroundId, thumbnailId: null, fonts, layers });
}
