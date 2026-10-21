import { isAssetId, newTextLayer, normalizeDesign } from '../../src/template-schema.js';

export const birthdayCollectionDrafts = [
  {
    id: 'dino-ekspedicija', source: 1, backgroundSource: 'dino-avantura', name: 'Dino ekspedicija',
    slug: 'pozivnica-za-deciji-rodjendan-dino-ekspedicija',
    seoTitle: 'Dino ekspedicija — pozivnica za dečiji rođendan',
    description: 'Pozivnica za dečiji rođendan sa dinosaurusima, velikim brojem godina i zelenim oblim slovima. Uredi ime i tekst, pa besplatno preuzmi PNG ili PDF.',
    imageAlt: 'Pozivnica za rođendan sa dinosaurusima i tropskim lišćem, zelenim imenom ukoso, velikim narandžastim brojem i podacima desno',
    details: 'Nova tipografska varijanta dino motiva: krupno, blago nagnuto ime prati veliki narandžasti broj godina sa leve strane poruke. Datum, vreme i adresa ostaju u desnom bloku, iznad dinosaurusa. Tamnozelena slova na krem nebu i svetla kontura broja čuvaju čitljivost. Prilagodi uzrast, poruku i podatke o igraonici; fotografija se ne dodaje.',
    bg: '#fff0c8',
  },
  {
    id: 'galakticka-posada', source: 2, backgroundSource: 'svemirska-misija', name: 'Galaktička posada',
    slug: 'pozivnica-za-deciji-rodjendan-galakticka-posada',
    seoTitle: 'Galaktička posada — svemirska pozivnica za rođendan',
    description: 'Svemirska pozivnica za dečiji rođendan sa raketom, svetlim slovima i brojem godina uz poruku posadi. Uredi podatke i preuzmi besplatan PNG ili PDF.',
    imageAlt: 'Pozivnica za rođendan sa raketom desno, belim imenom, zlatnim brojem godina i tirkiznim naslovima na tamnoplavom nebu',
    details: 'Poziv za malu svemirsku posadu ima snažno belo ime, zlatni broj godina i tirkizne detalje nalik kartici misije. Broj i kratka poruka stoje uporedo, a vreme poletanja je izdvojeno iznad adrese. Tekst prati levu stranu neba i ostavlja raketu i njen trag slobodnim. Sva polja za proslavu su izmenjiva; šablon nema mesto za fotografiju.',
    bg: '#06387b',
  },
  {
    id: 'biserna-bajka', source: 3, backgroundSource: 'mala-sirena', name: 'Biserna bajka',
    slug: 'pozivnica-za-deciji-rodjendan-biserna-bajka-sirena',
    seoTitle: 'Biserna bajka — pozivnica za rođendan sa sirenom',
    description: 'Pozivnica za dečiji rođendan sa sirenom, rukopisnim imenom i ljubičastim brojem godina. Prilagodi tekst i besplatno preuzmi sliku ili PDF za štampu.',
    imageAlt: 'Pozivnica za rođendan sa sirenom levo, ljubičastim rukopisnim imenom desno i velikim brojem godina na tirkiznoj pozadini',
    details: 'Rukopisno ime i obli naslov morskog bala raspoređeni su desno od sirene. Veliki ljubičasti broj prati uspravan natpis „Rođendan“, a pozivna poruka i podaci ostaju u otvorenom delu mora. Tamna plava i ljubičasta slova sa diskretnom svetlom konturom izdvajaju se od mehurića i svetlucanja. Izmeni ime, uzrast i poruku bez dodavanja fotografije.',
    bg: '#72d9e7',
  },
  {
    id: 'krug-srece', source: 4, backgroundSource: 'carobni-ringispil', name: 'Krug sreće',
    slug: 'pozivnica-za-deciji-rodjendan-krug-srece-ringispil',
    seoTitle: 'Krug sreće — pozivnica za dečiji rođendan sa ringišpilom',
    description: 'Rođendanska pozivnica sa konjićima, ringišpilom i velikim imenom u boji višnje. Uredi godine i detalje proslave, pa besplatno preuzmi PNG ili PDF.',
    imageAlt: 'Pozivnica za rođendan sa roze ringišpilom i konjićima gore, velikim imenom u boji višnje i brojem godina uz poruku',
    details: 'Ilustracija ringišpila ostaje u vrhu, dok široko ime u zaobljenom fontu otvara donji deo pozivnice. Godine su krupno izdvojene levo, a razigrana poruka stoji pored njih. Datum i vreme čine dva jasna bloka, uz adresu i potvrdu dolaska ispod. Boja višnje i tamna šljiva daju kontrast svetložutoj pozadini. Svi podaci se menjaju u editoru, bez lične fotografije.',
    bg: '#fff1b4',
  },
];

export function birthdayCollectionDesign(id, { backgroundId, fontIds } = {}) {
  const metadata = birthdayCollectionDrafts.find(draft => draft.id === id);
  if (!metadata) throw new Error('Nepoznat dečiji rođendanski dizajn.');
  if (!isAssetId(backgroundId) || !['baloo2', 'dynapuff', 'hand'].every(key => isAssetId(fontIds?.[key]))) throw new Error('Nedostaju pozadina ili fontovi.');
  const baloo = `custom-${fontIds.baloo2}`, puff = `custom-${fontIds.dynapuff}`, hand = `custom-${fontIds.hand}`;
  const text = (field, label, value, x, y, size, options = {}) => ({ ...newTextLayer(field), id: `${id}-${field}`, text: value, label, x, y, size, width: 58, family: 'DM Sans', color: '#264b32', lineHeight: 1.35, ...options });
  const date = (x, y, size, options = {}) => text('date', 'Datum rođendana', '2027-05-15', x, y, size, options);
  const time = (value, x, y, size, options = {}) => text('time', 'Vreme početka', value, x, y, size, options);
  let layers;
  if (id === 'dino-ekspedicija') layers = [
    text('title', 'Uvodni tekst', 'POZIV ZA MALE ISTRAŽIVAČE', 59, 10, 8.5, { width: 75, letterSpacing: 1.1, color: '#47562c' }),
    text('names', 'Ime deteta', 'Pavle', 59, 21, 52, { family: puff, width: 71, rotation: -5, color: '#28562d', effect: 'outline', effectColor: '#fff3cf', effectSize: 1.1 }),
    text('age', 'Broj godina', '7', 39, 34, 73, { family: puff, width: 26, rotation: -7, color: '#a9481f', effect: 'outline', effectColor: '#fff3cf', effectSize: 1.8 }),
    text('occasion', 'Naslov proslave', 'GODINA I JEDNA\nVELIKA AVANTURA!', 70, 32, 12.2, { family: baloo, width: 44, color: '#31532b', rotation: 2 }),
    text('note', 'Poruka drugarima', 'Pridruži se mojoj družini!\nČekaju nas igra i dino torta.', 69, 40.2, 12.2, { width: 47, color: '#314b2d' }),
    date(70, 48, 16.5, { family: baloo, width: 47, color: '#34502b' }),
    time('16:30', 70, 52.5, 12.5, { width: 32, color: '#314b2d', bold: true }),
    text('location', 'Mesto i adresa', 'Igraonica Družina\nUlica lipa 8, Beograd', 70, 58.8, 12.5, { width: 46, color: '#294526' }),
    text('rsvp', 'Potvrda dolaska', 'Javi da dolaziš do 8. maja!', 70, 65, 11.2, { family: baloo, width: 45, color: '#294526' }),
  ];
  if (id === 'galakticka-posada') layers = [
    text('title', 'Uvodni tekst', 'KARTA ZA NOVU MISIJU', 34, 9, 8.5, { width: 55, color: '#a0f0f5', letterSpacing: 1.5 }),
    text('names', 'Ime deteta', 'Nikola', 35, 20, 44, { width: 61, uppercase: true, bold: true, italic: true, color: '#fff5dc', rotation: -3, effect: 'shadow', effectColor: '#032452', effectSize: 1 }),
    text('age', 'Broj godina', '8', 22, 35, 77, { family: puff, width: 28, color: '#ffe09a', effect: 'outline', effectColor: '#072c63', effectSize: 1.2 }),
    text('occasion', 'Tekst uz godine', 'GODINA\nMEĐU\nZVEZDAMA', 48, 35.5, 12.4, { width: 27, color: '#b4f1fa', bold: true, align: 'left', lineHeight: 1.45 }),
    text('note', 'Poruka posadi', 'Tražim najbolju posadu\nza rođendansko putovanje.\nTvoje mesto je rezervisano!', 34, 49.5, 13, { width: 52, color: '#ffffff', lineHeight: 1.55 }),
    date(34, 61, 19, { family: baloo, width: 53, color: '#fff0c7' }),
    text('departure', 'Natpis uz vreme', 'POLETANJE', 21, 67.7, 8, { width: 27, color: '#a0f0f5', letterSpacing: 1 }),
    time('18:00', 48, 67.7, 18, { width: 27, color: '#ffffff', bold: true }),
    text('location', 'Mesto i adresa', 'Igraonica Kosmos\nZvezdana 12, Beograd', 34, 75, 12.5, { width: 51, color: '#ffffff', effect: 'outline', effectColor: '#063375', effectSize: .8 }),
    text('rsvp', 'Potvrda dolaska', 'Prijavi se posadi do 8. maja.', 33, 82, 10.8, { width: 50, color: '#ffffff', bold: true, effect: 'outline', effectColor: '#052953', effectSize: 1.1 }),
  ];
  if (id === 'biserna-bajka') layers = [
    text('title', 'Uvodni tekst', 'POZIV IZ SVETA BISERA', 61, 12.5, 8.2, { width: 68, letterSpacing: 1.15, color: '#134962' }),
    text('names', 'Ime deteta', 'Iskra', 71, 24.5, 60, { family: hand, width: 49, rotation: -6, color: '#59316f', effect: 'outline', effectColor: '#dbfbff', effectSize: .9 }),
    text('occasion', 'Naslov proslave', 'MORSKI BAL', 72, 34.5, 16.5, { family: puff, width: 49, color: '#224d76' }),
    text('age', 'Broj godina', '6', 77, 45, 74, { family: baloo, width: 32, color: '#60387c', effect: 'outline', effectColor: '#d9fbff', effectSize: 1.7 }),
    text('age_caption', 'Tekst uz godine', 'ROĐENDAN', 55, 45, 9.3, { width: 30, rotation: -90, color: '#204961', letterSpacing: .7 }),
    text('note', 'Poruka gostima', 'Mehurići, biseri i smeh —\nmoja bajka čeka i tebe!', 73, 55.7, 12.5, { width: 45, color: '#173d5c', lineHeight: 1.6 }),
    date(73, 64, 14, { family: baloo, width: 46, color: '#173d5c' }),
    time('16:00', 73, 69, 14.5, { width: 32, color: '#173d5c', bold: true }),
    text('location', 'Mesto i adresa', 'Igraonica Školjkica\nBiserna 5, Beograd', 73, 76, 12, { width: 45, color: '#102741', bold: true, effect: 'outline', effectColor: '#d9fbff', effectSize: .7 }),
    text('rsvp', 'Potvrda dolaska', 'Javi mi do 8. maja\nda plivamo zajedno!', 72, 85, 11.5, { width: 45, bold: true, color: '#241547', effect: 'outline', effectColor: '#d9fbff', effectSize: .6 }),
  ];
  if (id === 'krug-srece') layers = [
    text('title', 'Uvodni tekst', 'JEDAN KRUG DO OSMEHA', 50, 42, 9, { width: 78, color: '#813653', letterSpacing: 1.5 }),
    text('names', 'Ime deteta', 'Teodora', 50, 51.2, 55, { family: baloo, width: 84, color: '#993155', effect: 'outline', effectColor: '#fff5ce', effectSize: 1.2 }),
    text('age', 'Broj godina', '5', 29, 63.1, 64, { family: puff, width: 29, rotation: -5, color: '#a23259' }),
    text('note', 'Rođendanska poruka', 'GODINA RADOSTI!\nZavrti se sa mnom u dan\npun igre i slatkih želja.', 66, 62.7, 13, { width: 47, color: '#703047', lineHeight: 1.6 }),
    date(32, 74.1, 16, { family: baloo, width: 47, color: '#703047' }),
    time('17:00', 77, 74.1, 17, { family: baloo, width: 29, color: '#703047' }),
    text('location', 'Mesto i adresa', 'Igraonica Vrteška\nCvetna 10, Beograd', 50, 81, 13, { width: 76, color: '#703047' }),
    text('rsvp', 'Potvrda dolaska', 'Sačuvaj svoje mesto — javi nam do 8. maja.', 50, 88, 10.5, { width: 79, color: '#703047' }),
    text('footer', 'Završna poruka', 'Najlepši krug je krug prijatelja!', 50, 93.3, 15, { family: hand, width: 82, color: '#703047', rotation: -2 }),
  ];
  const used = new Set(layers.map(layer => layer.family));
  const fonts = [
    { assetId: fontIds.baloo2, family: baloo, name: 'Baloo 2 — razigrani' },
    { assetId: fontIds.dynapuff, family: puff, name: 'DynaPuff — oblačići' },
    { assetId: fontIds.hand, family: hand, name: 'Napravi Rukopis — maštoviti' },
  ].filter(font => used.has(font.family));
  return normalizeDesign({ schemaVersion: 1, category: 'birthday', name: metadata.name, description: metadata.description, imageAlt: metadata.imageAlt, seoTitle: metadata.seoTitle, details: metadata.details, locale: 'sr-Latn-RS', bg: metadata.bg, backgroundId, thumbnailId: null, fonts, layers });
}
