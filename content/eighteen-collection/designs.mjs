import { isAssetId, newTextLayer, normalizeDesign } from '../../src/template-schema.js';

export const eighteenCollectionDrafts = [
  {
    id: 'terakota-ritam', source: 1, name: 'Terakota ritam',
    slug: 'pozivnica-za-18-rodjendan-retro-sahovnica',
    seoTitle: 'Retro pozivnica za 18. rođendan — Terakota ritam',
    description: 'Retro pozivnica za 18. rođendan sa šahovnicom i terakota suncem. Promeni ime i detalje punoletstva i besplatno preuzmi PNG ili PDF, bez fotografije.',
    imageAlt: 'Pozivnica za 18. rođendan sa crno-belom talasastom šahovnicom, terakota suncem i krupnim brojem 18 na krem pozadini',
    details: 'Talasasta šahovnica i terakota sunce uokviruju razigran retro poziv. Uvod prati uspravnu liniju pored šahovnice, dok su ime, zaobljeni broj 18 i podaci o proslavi desno. Tamna slova ostaju jasna na krem papiru. Šablon nema mesto za fotografiju.',
    bg: '#f4e8ce',
  },
  {
    id: 'ledeni-hologram', source: 2, name: 'Ledeni hologram',
    slug: 'moderna-pozivnica-za-punoletstvo-holografska',
    seoTitle: 'Moderna pozivnica za punoletstvo — Ledeni hologram',
    description: 'Holografska pozivnica za punoletstvo u ledenoplavim tonovima. Uredi ime, poruku i podatke 18. rođendana i besplatno preuzmi sliku ili PDF za štampu.',
    imageAlt: 'Pozivnica za 18. rođendan sa hromiranim holografskim trakama, plavo-ljubičastim brojem 18 i tamnim tekstom ispod',
    details: 'Holografske trake ostaju u gornjem delu, a slobodan plavi prostor nosi moderan raspored: veliki broj levo, kratku poruku desno i ime preko širine pozivnice. Tamnoplava i ljubičasta tipografija čuvaju kontrast na svetlim odsjajima. Lična fotografija se ne dodaje.',
    bg: '#dfeefa',
  },
  {
    id: 'zlatni-disko-ritam', source: 3, name: 'Zlatni disko ritam',
    slug: 'pozivnica-za-18-rodjendan-retro-disko',
    seoTitle: 'Disko pozivnica za 18. rođendan — retro zlatni ritam',
    description: 'Narandžasta disko pozivnica za 18. rođendan sa zlatnom kuglom i retro slovima. Prilagodi ime i proslavu, pa preuzmi besplatan PNG ili PDF za štampu.',
    imageAlt: 'Pozivnica za 18. rođendan sa zlatnom disko kuglom levo, žutim retro talasima i tamnosmeđim imenom desno',
    details: 'Zlatna disko kugla i narandžasti talasi donose ritam sedamdesetih. Zaobljeno ime i klasičan veliki broj imaju različite uloge, a podaci o proslavi prate desnu stranu pored kugle. Tamnosmeđa slova ističu se na narandžastoj podlozi. Dizajn je bez okvira za fotografiju.',
    bg: '#ee831b',
  },
  {
    id: 'masna-u-ponoc', source: 4, name: 'Mašna u ponoć',
    slug: 'elegantna-pozivnica-za-punoletstvo-crna-masna',
    seoTitle: 'Elegantna pozivnica za punoletstvo sa crnom mašnom',
    description: 'Roze pozivnica za punoletstvo sa crnom satenskom mašnom i kaligrafskim imenom. Upiši detalje 18. rođendana i besplatno preuzmi PNG ili PDF za štampu.',
    imageAlt: 'Pozivnica za 18. rođendan sa crnom satenskom mašnom, kaligrafskim imenom i klasičnim brojem 18 na roze pozadini',
    details: 'Crna satenska mašna i biseri ostaju vidljivi na levoj strani. Desno se smenjuju kaligrafsko ime, klasičan broj 18 i kratka rukopisna poruka, uz odvojene podatke za goste. Gotovo crna slova daju izražen kontrast roze svili. Nema mesta za ličnu fotografiju.',
    bg: '#f4d8d0',
  },
  {
    id: 'bordo-nokturno', source: 5, name: 'Bordo nokturno',
    slug: 'pozivnica-za-18-rodjendan-bordo-ruza',
    seoTitle: 'Bordo pozivnica za 18. rođendan sa ružom — besplatno',
    description: 'Svečana pozivnica za 18. rođendan sa bordo ružom i svilenim naborima. Izmeni ime, tekst i mesto punoletstva i besplatno preuzmi sliku ili PDF.',
    imageAlt: 'Pozivnica za 18. rođendan sa crvenom ružom, bordo svilenim naborima, svetlim svečanim imenom i podacima levo',
    details: 'Bordo ruža i svila ostaju u donjem desnom uglu. Svetlo ime je visoko iznad njih, broj 18 i poruka dele sredinu, a datum i adresa nalaze se u uskoj levoj koloni. Krem i šampanj tonovi izdvajaju tekst iz tamne pozadine. Pozivnica nema foto okvir.',
    bg: '#39070d',
  },
  {
    id: 'leptirov-novi-let', source: 6, name: 'Leptirov novi let',
    slug: 'pozivnica-za-punoletstvo-lavanda-leptiri',
    seoTitle: 'Pozivnica za punoletstvo sa leptirima — lavanda',
    description: 'Pozivnica za punoletstvo sa staklenim leptirima i lavandinom organzom. Uredi ime i tekst 18. rođendana i preuzmi besplatan PNG ili PDF, bez fotografije.',
    imageAlt: 'Pozivnica za 18. rođendan sa providnim staklenim leptirima, ljubičastim rukopisnim imenom i brojem 18 na lavandinoj pozadini',
    details: 'Stakleni leptiri i providna organza uokviruju miran gornji i desni deo. Rukopisno ime, izdvojena poruka o novom letu i broj 18 nisu u istoj koloni. Tamnoljubičasti podaci ostaju čitljivi na svetloj lavandi. Personalizacija je tekstualna, bez dodavanja fotografije.',
    bg: '#ede8f6',
  },
  {
    id: 'smaragdna-premijera', source: 7, name: 'Smaragdna premijera',
    slug: 'luksuzna-pozivnica-za-18-rodjendan-art-deko',
    seoTitle: 'Art deko pozivnica za 18. rođendan — smaragd i zlato',
    description: 'Smaragdna pozivnica za 18. rođendan sa zlatnim art deko zracima i svečanim slovima. Uredi ime i detalje punoletstva i besplatno preuzmi PNG ili PDF.',
    imageAlt: 'Pozivnica za 18. rođendan sa zlatnim art deko zracima, velikim brojem 18 i svečanim imenom na smaragdnozelenoj pozadini',
    details: 'Zlatni art deko zraci izlaze iz levog ugla preko smaragdnog kamena. Kompozicija je pomerena desno i naniže: veliki svečani broj, razmaknuta slova imena i datum i vreme u odvojenim kolonama. Svetla krem slova imaju jak kontrast. Šablon je bez fotografije.',
    bg: '#073126',
  },
  {
    id: 'pun-gas-do-osamnaeste', source: 8, name: 'Pun gas do osamnaeste',
    slug: 'pozivnica-za-punoletstvo-trkacka-sahovnica',
    seoTitle: 'Trkačka pozivnica za punoletstvo — Pun gas do 18.',
    description: 'Trkačka pozivnica za punoletstvo sa crvenom prugom i šahovnicom. Personalizuj ime i podatke 18. rođendana i besplatno preuzmi PNG ili PDF za štampu.',
    imageAlt: 'Pozivnica za 18. rođendan sa crvenom trkačkom prugom, šahovnicom, velikim crvenim brojem 18 i sportskim slovima',
    details: 'Crvena pruga i šahovnica ostaju pri dnu, dok je sav važan tekst u slobodnom gornjem delu. Kosa sportska slova, veliki crveni broj 18, ime desno i dva kratka bloka podataka daju izgled trkačkog postera. Crna i tamnocrvena čuvaju čitljivost. Nema mesta za fotografiju.',
    bg: '#efe7d4',
  },
  {
    id: 'kobaltna-noc', source: 9, name: 'Kobaltna noć',
    slug: 'plava-pozivnica-za-18-rodjendan-platinasti-sjaj',
    seoTitle: 'Plava pozivnica za 18. rođendan — Kobaltna noć',
    description: 'Plava pozivnica za 18. rođendan sa platinastim kristalima i svetlosnim zracima. Upiši ime i detalje punoletstva i preuzmi besplatan PNG ili PDF.',
    imageAlt: 'Pozivnica za 18. rođendan sa platinastim kristalima i zracima desno, svetlim brojem 18 i imenom na kobaltnoplavoj pozadini',
    details: 'Platinasti kristali, kobaltno svetlo i odsjaj na podu prave scenu za noćnu proslavu. Ime i veliki svetli broj nalaze se levo, naziv punoletstva prati uspravnu liniju, a podaci su u donjem tamnom delu. Tipografija je jasna i bez preteranog sjaja. Fotografija se ne dodaje.',
    bg: '#052352',
  },
];

export function eighteenCollectionDesign(id, { backgroundId, fontIds } = {}) {
  const metadata = eighteenCollectionDrafts.find(item => item.id === id);
  if (!metadata) throw new Error('Nepoznat dizajn iz kolekcije za punoletstvo.');
  if (!isAssetId(backgroundId) || !['serif', 'script', 'hand', 'puff'].every(key => isAssetId(fontIds?.[key]))) throw new Error('Nedostaju pozadina ili fontovi dizajna.');
  const serif = `custom-${fontIds.serif}`, script = `custom-${fontIds.script}`, hand = `custom-${fontIds.hand}`, puff = `custom-${fontIds.puff}`;
  const text = (field, label, value, x, y, size, options = {}) => ({ ...newTextLayer(field), id: `${id}-${field}`, label, text: value, x, y, size, family: 'DM Sans', width: 76, color: '#292523', lineHeight: 1.4, ...options });
  const title = (value, x, y, color, options = {}) => text('title', 'Uvodni naslov', value, x, y, 9, { color, letterSpacing: 1.5, ...options });
  const name = (value, x, y, size, color, options = {}) => text('names', 'Ime slavljenika', value, x, y, size, { color, ...options });
  const age = (x, y, size, color, options = {}) => text('age', 'Broj godina', '18', x, y, size, { color, width: 60, lineHeight: 1, ...options });
  const note = (value, x, y, color, options = {}) => text('note', 'Poruka gostima', value, x, y, 11.5, { color, ...options });
  const date = (x, y, size, color, options = {}) => text('date', 'Datum proslave', '2027-06-19', x, y, size, { family: serif, color, ...options });
  const time = (value, x, y, size, color, options = {}) => text('time', 'Vreme proslave', value, x, y, size, { family: serif, color, width: 25, ...options });
  const place = (value, x, y, color, options = {}) => text('location', 'Mesto i adresa proslave', value, x, y, 11, { color, ...options });
  const rsvp = (value, x, y, color, options = {}) => text('rsvp', 'Potvrda dolaska', value, x, y, 8.7, { color, ...options });
  let layers;
  if (id === 'terakota-ritam') layers = [
    title('OSAMNAEST U MOM RITMU', 45, 49, '#2b2722', { width: 66, size: 9.5, letterSpacing: 2, rotation: -90 }),
    name('Mina', 73, 29, 44, '#292522', { bold: true, italic: true, uppercase: true, width: 48, rotation: -4 }),
    age(73, 45, 112, '#a53f24', { family: puff, width: 50 }),
    note('Slavim osamnaest.\nTi donosiš dobar ritam.', 73, 60, '#342a23', { width: 47, size: 12 }),
    date(73, 70, 19, '#342a23', { width: 48 }), time('20:00', 73, 75, 18, '#342a23'),
    place('Studio Ritam\nMuzička 18, Beograd', 73, 83, '#342a23', { width: 47, size: 11.5 }),
    rsvp('Javi mi do 12. juna da slavimo zajedno.', 73, 92, '#342a23', { width: 47 }),
  ];
  if (id === 'ledeni-hologram') layers = [
    title('ULAZIM U NOVU ERU', 29, 34, '#294462', { width: 48, size: 9.2, letterSpacing: 1.7 }),
    age(29, 48, 120, '#254269', { bold: true, width: 54, effect: 'gradient', effectColor: '#675383' }),
    text('occasion', 'Izdvojena poruka', 'MOJ\nTRENUTAK', 75, 49, 19, { width: 39, bold: true, color: '#294462', lineHeight: 1.2, letterSpacing: .5 }),
    name('Elena', 51, 64, 39, '#3c3c6c', { width: 86, uppercase: true, bold: true, italic: true, letterSpacing: 3 }),
    note('Svetla, muzika i ljudi koje volim.\nVidimo se na mom punoletstvu.', 50, 73, '#253b57', { width: 84, size: 12 }),
    date(33, 81, 21, '#253b57', { width: 53 }), time('21:00', 77, 81, 21, '#253b57'),
    place('Restoran Aurora\nBulevar umetnosti 12, Beograd', 50, 88, '#253b57', { width: 84, size: 11.5 }),
    rsvp('Potvrdi svoje mesto do 12. juna.', 50, 95, '#253b57', { width: 84, size: 9 }),
  ];
  if (id === 'zlatni-disko-ritam') layers = [
    title('PLEŠI DO JUTRA', 67, 11, '#4b230e', { family: puff, width: 59, size: 17, letterSpacing: 0 }),
    name('Vuk', 66, 23, 49, '#4b230e', { family: puff, width: 61, rotation: -3 }),
    age(69, 41, 120, '#4b230e', { family: 'Libre Caslon Display', width: 57 }),
    note('Osamnaest godina dobrog ritma.\nDođi da zajedno zasijamo.', 69, 55.5, '#47220e', { width: 52, size: 11.5 }),
    date(69, 65, 21, '#47220e', { width: 53 }), time('20:30', 69, 70, 18, '#47220e'),
    place('Klub Zlatni ritam\nMuzička 18, Beograd', 70, 77, '#47220e', { width: 51, size: 11 }),
    rsvp('Rezerviši ples sa mnom do 12. juna.', 70, 85, '#47220e', { width: 51 }),
  ];
  if (id === 'masna-u-ponoc') layers = [
    title('VEČE SA MOJIM POTPISOM', 70, 15, '#292024', { width: 53, size: 8.6, letterSpacing: 1 }),
    name('Anastasija', 69, 28, 48, '#272025', { family: script, width: 56 }),
    age(70, 44, 110, '#272025', { family: 'Libre Caslon Display', width: 55 }),
    note('Malo elegancije.\nMnogo dobrih uspomena.', 69, 59, '#51303b', { family: hand, width: 54, size: 20, lineHeight: 1.25 }),
    date(70, 72, 21, '#292024', { width: 53 }), time('19:30', 70, 77, 19, '#292024'),
    place('Restoran Satenska noć\nCvetna 12, Beograd', 70, 85, '#292024', { width: 53, size: 11 }),
    rsvp('Radujem ti se — javi mi do 12. juna.', 70, 93, '#292024', { width: 53 }),
  ];
  if (id === 'bordo-nokturno') layers = [
    title('VEČE U ZNAKU MENE', 46, 11, '#fff0dd', { width: 83, size: 9.5, letterSpacing: 2.2 }),
    name('Teodora', 46, 23, 50, '#fff0dd', { family: serif, width: 83, uppercase: true, letterSpacing: 1.5 }),
    age(27, 41, 110, '#f7d8b1', { family: 'Libre Caslon Display', width: 46 }),
    note('Osamnaest želja.\nJedna posebna noć.', 65, 40.5, '#fff0dd', { family: serif, width: 43, size: 18, italic: true }),
    date(28, 54.5, 22, '#fff0dd', { width: 45 }), time('20:00', 28, 60.5, 21, '#fff0dd'),
    place('Restoran Ruža\nCvetna 12, Beograd', 28, 68, '#fff0dd', { width: 44, size: 12 }),
    rsvp('Javi mi do 12. juna.\nČekam te sa osmehom.', 27, 89, '#fff0dd', { width: 43, size: 9.5 }),
  ];
  if (id === 'leptirov-novi-let') layers = [
    title('ŠIRIM KRILA', 61, 12, '#49345e', { width: 67, size: 10, letterSpacing: 3 }),
    name('Una', 53, 24, 49, '#5c3d74', { family: hand, width: 71 }),
    text('intro', 'Poruka pored broja', 'novi let', 39, 39, 28, { family: hand, width: 42, color: '#5c3d74', rotation: -6 }),
    age(77, 38, 105, '#49345e', { family: 'Libre Caslon Display', width: 42 }),
    note('Dođi da zajedno otvorimo\npoglavlje puno novih snova.', 64, 52, '#49374f', { width: 64, size: 11.5 }),
    date(69, 62, 21, '#49374f', { width: 54 }), time('19:00', 69, 68, 19, '#49374f'),
    place('Restoran Lavanda\nCvetna 12, Beograd', 69, 78, '#49374f', { width: 54, size: 11.5 }),
    rsvp('Poleti sa mnom. Javi mi do 12. juna.', 69, 88, '#49374f', { width: 54, size: 9 }),
  ];
  if (id === 'smaragdna-premijera') layers = [
    title('POZIV NA PUNOLETSTVO', 65, 29, '#f7e6ba', { width: 60, size: 9.4, letterSpacing: 1.5 }),
    age(65, 44, 120, '#fff1cb', { family: serif, width: 62, effect: 'gradient', effectColor: '#e9c983' }),
    name('Nikola', 65, 59, 35, '#fff1cb', { family: serif, width: 61, uppercase: true, letterSpacing: 3 }),
    note('Osamnaest godina, jedno veliko veče.\nBudi deo moje premijere.', 65, 69, '#fff1d2', { width: 60, size: 11.5 }),
    date(49, 78, 21, '#fff1d2', { width: 51 }), time('20:30', 82, 78, 19, '#fff1d2', { width: 27 }),
    place('Restoran Smaragd\nBulevar umetnosti 12, Beograd', 65, 85, '#fff1d2', { width: 60, size: 11 }),
    rsvp('Potvrdi dolazak na premijeru do 12. juna.', 65, 93, '#fff1d2', { width: 60, size: 8.7 }),
  ];
  if (id === 'pun-gas-do-osamnaeste') layers = [
    title('STARTUJEM\nNOVO POGLAVLJE', 50, 13, '#242625', { width: 84, size: 24, bold: true, italic: true, align: 'left', letterSpacing: .3, lineHeight: 1.05 }),
    age(29, 33, 120, '#ab2922', { width: 52, bold: true, italic: true }),
    name('Aleksa', 74, 32, 30, '#242625', { width: 43, bold: true, italic: true, uppercase: true, letterSpacing: .8 }),
    note('Osamnaest na semaforu.\nVidimo se na startu proslave!', 72, 44, '#292725', { width: 46, size: 11.5 }),
    date(31, 54, 18, '#292725', { family: 'DM Sans', width: 49, bold: true }), time('20:00', 31, 60, 18, '#ab2922', { family: 'DM Sans', bold: true }),
    place('Restoran Start\nSportska 8, Beograd', 73, 54, '#292725', { width: 44, size: 12 }),
    rsvp('Prijavi se do 12. juna.', 31, 67, '#292725', { width: 49, size: 10 }),
  ];
  if (id === 'kobaltna-noc') layers = [
    title('VEČE REZERVISANO ZA NAS', 38, 31, '#f3f7ff', { width: 67, size: 9.5, letterSpacing: 1.7, align: 'left' }),
    name('Luka', 37, 23, 44, '#f3f7ff', { width: 65, bold: true, uppercase: true, letterSpacing: 2, align: 'left' }),
    age(36, 43, 120, '#edf5ff', { width: 62, bold: true, effect: 'gradient', effectColor: '#a5caff' }),
    text('occasion', 'Uspravni natpis', 'PUNOLETSTVO', 70, 48, 10, { width: 62, rotation: 90, letterSpacing: 3, color: '#edf5ff' }),
    note('Pojačaj muziku. Ponesi osmeh.\nNoćas slavimo mojih osamnaest.', 38, 61, '#f0f5ff', { width: 67, size: 11.5 }),
    date(32, 72, 23, '#f0f5ff', { width: 51 }), time('21:00', 77, 72, 22, '#f0f5ff'),
    place('Klub Kobalt\nBulevar umetnosti 12, Beograd', 50, 81, '#f0f5ff', { width: 84, size: 12 }),
    rsvp('Veče je naše. Potvrdi dolazak do 12. juna.', 50, 90, '#f0f5ff', { width: 84, size: 9.2 }),
  ];
  const usedFamilies = new Set(layers.map(layer => layer.family));
  const fonts = [
    { assetId: fontIds.serif, family: serif, name: 'Cormorant Garamond — svečani' },
    { assetId: fontIds.script, family: script, name: 'Great Vibes — kaligrafski' },
    { assetId: fontIds.hand, family: hand, name: 'Napravi Rukopis — slobodni' },
    { assetId: fontIds.puff, family: puff, name: 'DynaPuff — retro' },
  ].filter(font => usedFamilies.has(font.family));
  return normalizeDesign({ schemaVersion: 1, name: metadata.name, category: 'eighteen', locale: 'sr-Latn-RS', description: metadata.description, imageAlt: metadata.imageAlt, seoTitle: metadata.seoTitle, details: metadata.details, bg: metadata.bg, backgroundId, thumbnailId: null, fonts, layers });
}
