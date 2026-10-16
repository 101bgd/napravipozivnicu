import { isAssetId, newTextLayer, normalizeDesign } from '../../src/template-schema.js';

export const weddingDrafts = [
  {
    id: 'zavet-u-prirodi', source: 0, name: 'Zavet u prirodi',
    slug: 'pozivnica-za-vencanje-mladenci-priroda',
    seoTitle: 'Pozivnica za venčanje sa mladencima — Zavet u prirodi',
    description: 'Besplatna pozivnica za venčanje sa ilustracijom mladenaca u vrtu. Uredi imena, datum, obred i svadbenu proslavu, pa preuzmi PNG ili PDF za štampu.',
    imageAlt: 'Pozivnica za venčanje sa ilustracijom mladenaca okrenutih ka jezeru, belim cvećem, zelenim granama i pticama, uz svečana zelena kaligrafska imena',
    details: 'Ilustrovani mladenci, vrt i miran pejzaž prate svadbu u prirodi. Tekst se nalazi u svetlom delu iznad para, sa blago pomerenim kaligrafskim imenima i dva odvojena bloka za ceremoniju i proslavu. Fotografija se ne dodaje; ilustracija ostaje deo dizajna.',
    bg: '#f5f0da',
  },
  {
    id: 'maslinov-zavet', source: 1, name: 'Maslinov zavet',
    slug: 'pozivnica-za-svadbu-pergament-maslina',
    seoTitle: 'Pozivnica za svadbu sa maslinom — Maslinov zavet',
    description: 'Elegantna pozivnica za svadbu na pergamentu, sa maslinom i voštanim pečatom. Personalizuj imena i detalje venčanja i preuzmi besplatnu sliku ili PDF.',
    imageAlt: 'Elegantna pozivnica za svadbu sa krem pergamentom, zlatnim lukom, voštanim pečatom i maslinovom grančicom, uz obalski grad na levoj ivici',
    details: 'Pergament, maslinova grančica i voštani pečat daju mediteranski, klasičan izgled. Uspravna serifna imena i diskretna kaligrafija nalaze se unutar zlatnog luka. Datum i obe lokacije venčanja menjaju se nezavisno. Dizajn je bez okvira za fotografiju.',
    bg: '#f2e9da',
  },
  {
    id: 'zlatna-obala', source: 5, name: 'Zlatna obala',
    slug: 'pozivnica-za-vencanje-more-zalazak',
    seoTitle: 'Pozivnica za venčanje uz more — Zlatna obala',
    description: 'Romantična pozivnica za venčanje sa terasom uz more i belim ružama. Izmeni imena i raspored svadbe i besplatno preuzmi PNG ili PDF za štampu.',
    imageAlt: 'Romantična pozivnica za venčanje sa pogledom na more pri zalasku sunca, belim ružama, zlatnim zavesama i kaligrafskim imenima u svetlom nebu',
    details: 'Bela terasa, ruže i zlatni zalazak najavljuju venčanje u mediteranskom stilu. Imena i podaci su u otvorenom delu neba, tako da more i cvetni luk ostaju vidljivi. Uredi mesto ceremonije, vreme okupljanja i restoran bez ubacivanja fotografije.',
    bg: '#f8e8ce',
  },
  {
    id: 'beli-cvet-i-zlato', source: 6, name: 'Beli cvet i zlato',
    slug: 'elegantna-pozivnica-za-svadbu-belo-cvece-zlato',
    seoTitle: 'Elegantna pozivnica za svadbu — Beli cvet i zlato',
    description: 'Bela pozivnica za svadbu sa cvećem i zlatnim mermernim detaljima. Uredi imena, datum i lokacije venčanja i preuzmi besplatan PNG ili PDF za štampu.',
    imageAlt: 'Bela pozivnica za svadbu sa belim cvetovima, zelenim lišćem i zlatnim mermernim linijama, sa krupnim tamnozelenim imenima raspoređenim dijagonalno',
    details: 'Beli cvetovi i tanke zlatne linije uokviruju mermernu teksturu. Dijagonalna kaligrafska imena i tamnozelena slova daju jasan kontrast. Podaci o obredu i slavlju prate slobodan prostor levo od donjeg buketa. Ova pozivnica je osmišljena bez fotografije.',
    bg: '#f8f4eb',
  },
  {
    id: 'vece-pod-fenjerima', source: 7, name: 'Veče pod fenjerima',
    slug: 'pozivnica-za-vencanje-fenjeri-svece',
    seoTitle: 'Pozivnica za venčanje sa fenjerima — Veče pod fenjerima',
    description: 'Pozivnica za venčanje sa fenjerima, svećama i toplim sumrakom. Personalizuj imena, ceremoniju i svadbenu proslavu i preuzmi besplatnu sliku ili PDF.',
    imageAlt: 'Pozivnica za venčanje sa visećim fenjerima i svećama, cvetnim lukom i obalom u sumrak, uz topla kaligrafska imena i svetle detalje proslave',
    details: 'Svetlost fenjera i sveća daje intimnu atmosferu večernjem venčanju. Tamna imena izdvojena su na nebu, a svetliji podaci o ceremoniji i proslavi prate tamniji pejzaž ispod. Izmeni sve poruke i lokacije; nema mesta za fotografiju.',
    bg: '#96745d',
  },
  {
    id: 'smaragdni-zavet', source: 8, name: 'Smaragdni zavet',
    slug: 'pozivnica-za-svadbu-smaragdno-zelena-zlatna',
    seoTitle: 'Zeleno-zlatna pozivnica za svadbu — Smaragdni zavet',
    description: 'Svečana smaragdnozelena pozivnica za svadbu sa zlatnim lukom i belim cvećem. Unesi imena i detalje venčanja i preuzmi besplatan PNG ili PDF.',
    imageAlt: 'Smaragdnozelena pozivnica za svadbu sa zlatnim lukom, belim cvećem, satenskom trakom i voštanim pečatom, sa svetlim klasičnim imenima',
    details: 'Duboka smaragdna pozadina, zlatni luk i beli cvetovi daju izrazito svečan izgled. Imena su ispisana klasičnim velikim slovima, uz kaligrafski znak između njih. Svetli tekst ostaje istaknut na tamnoj podlozi. Šablon za venčanje je bez fotografije.',
    bg: '#092d22',
  },
  {
    id: 'sapat-bozura', source: 9, name: 'Šapat božura',
    slug: 'pozivnica-za-vencanje-roze-bozuri',
    seoTitle: 'Cvetna pozivnica za venčanje — Šapat božura',
    description: 'Nežna pozivnica za venčanje sa roze božurima i svilenom trakom. Uredi imena, datum i mesta svadbe i preuzmi besplatnu sliku ili PDF za štampu.',
    imageAlt: 'Cvetna pozivnica za venčanje sa roze i belim božurima, svilenom trakom i zlatnim grančicama, uz tamnoružičasta kaligrafska imena na krem pozadini',
    details: 'Roze božuri, svilena traka i zlatne grančice prate romantičnu svadbu. Kaligrafska imena nalaze se u otvorenom delu između cvetova, a podaci o ceremoniji i restoranu u jasnim redovima ispod. Prilagodi tekst i rok potvrde dolaska, bez dodavanja fotografije.',
    bg: '#faf0e6',
  },
  {
    id: 'pismo-ljubavi', source: 10, name: 'Pismo ljubavi',
    slug: 'vintage-pozivnica-za-svadbu-cipka-pecat',
    seoTitle: 'Vintage pozivnica za svadbu — Pismo ljubavi',
    description: 'Vintage pozivnica za svadbu sa čipkom, voštanim pečatom i ružama. Promeni imena i detalje venčanja i preuzmi besplatan PNG ili PDF za štampu.',
    imageAlt: 'Vintage pozivnica za svadbu sa čipkom, roze trakom, voštanim pečatom, ružama i ilustracijom crkve na desnoj ivici, sa svečanom kaligrafijom',
    details: 'Čipka, pocepani papir, voštani pečat i ruže podsećaju na sačuvano ljubavno pismo. Imena i poruka nalaze se u svetloj sredini, uz odvojene podatke o obredu i proslavi. Ilustracija crkve ostaje vidljiva na desnoj ivici. Fotografija nije deo ovog dizajna.',
    bg: '#f4e7d8',
  },
];

export function weddingDesign(id, { backgroundId, fontIds } = {}) {
  const metadata = weddingDrafts.find(item => item.id === id);
  if (!metadata) throw new Error('Nepoznat dizajn za venčanje.');
  if (!isAssetId(backgroundId) || !isAssetId(fontIds?.serif) || !isAssetId(fontIds?.script)) throw new Error('Nedostaju pozadina ili fontovi dizajna.');
  const serif = `custom-${fontIds.serif}`, script = `custom-${fontIds.script}`;
  const text = (field, label, value, x, y, size, options = {}) => ({
    ...newTextLayer(field), id: `${id}-${field}`, label, text: value, x, y, size,
    family: serif, width: 78, color: '#394c3c', lineHeight: 1.4, ...options,
  });
  const caption = { family: 'DM Sans', size: 8.5, letterSpacing: 1.2 };
  const amp = (x, y, size, color, options = {}) => text('ampersand', 'Veznik između imena', '&', x, y, size, { width: 18, color, editable: false, ...options });
  const date = (x, y, size, options = {}) => text('date', 'Datum venčanja', '2027-06-19', x, y, size, options);
  const event = (kind, x, y, width, size, color, options = {}) => text(kind === 'ceremony' ? 'ceremony_location' : 'location', kind === 'ceremony' ? 'Mesto ceremonije' : 'Mesto proslave', kind === 'ceremony' ? 'Crkva Svetog Marka' : 'Restoran Garden', x, y, size, { width, color, ...options });
  const time = (kind, x, y, size, options = {}) => text(kind === 'ceremony' ? 'ceremony_time' : 'time', kind === 'ceremony' ? 'Vreme ceremonije' : 'Vreme proslave', kind === 'ceremony' ? '16:00' : '18:00', x, y, size, options);
  const label = (kind, x, y, color, options = {}) => text(`${kind}_label`, kind === 'ceremony' ? 'Najava ceremonije' : 'Najava proslave', kind === 'ceremony' ? 'CEREMONIJA' : 'PROSLAVA', x, y, caption.size, { ...caption, color, ...options });
  const rsvp = (x, y, size, options = {}) => text('rsvp', 'Potvrda dolaska', 'Potvrdite dolazak do 1. juna.', x, y, size, options);
  let layers;
  if (id === 'zavet-u-prirodi') layers = [
    text('title', 'Uvodni tekst', 'DAN KADA BIRAMO ZAUVEK', 50, 14.2, 8.7, { ...caption, letterSpacing: 1.45, color: '#46563d' }),
    text('bride', 'Ime mlade', 'Sara', 40, 21, 46, { family: script, width: 61, color: '#3f583f' }),
    amp(50, 26.2, 27, '#9a7844'),
    text('groom', 'Ime mladoženje', 'Luka', 61, 31.7, 46, { family: script, width: 61, color: '#3f583f' }),
    text('note', 'Poruka gostima', 'Sa radošću vas pozivamo\nna naše venčanje.', 50, 37.7, 13, { width: 72, color: '#344b38' }),
    date(50, 43.4, 19, { width: 80, color: '#344b38' }),
    rsvp(50, 47.5, 9.1, { family: 'DM Sans', width: 78, color: '#41523b' }),
    label('ceremony', 36, 51.8, '#46563d', { width: 43 }),
    label('reception', 71, 51.8, '#46563d', { width: 43 }),
    time('ceremony', 36, 55.2, 16, { width: 40 }),
    time('reception', 71, 55.2, 16, { width: 40 }),
    event('ceremony', 36, 58.7, 44, 11.5, '#344b38'),
    event('reception', 71, 58.7, 43, 11.5, '#344b38'),
  ];
  if (id === 'maslinov-zavet') layers = [
    text('title', 'Uvodni tekst', 'POZIVAMO VAS NA VENČANJE', 56, 20, 8.4, { ...caption, width: 58, color: '#6d593d' }),
    text('bride', 'Ime mlade', 'Jelena', 56, 29, 35, { uppercase: true, width: 57, letterSpacing: 1.9, color: '#57462e' }),
    amp(57, 35.8, 31, '#97753b', { family: script }),
    text('groom', 'Ime mladoženje', 'Marko', 57, 42, 35, { uppercase: true, width: 57, letterSpacing: 1.9, color: '#57462e' }),
    text('note', 'Poruka gostima', 'Sa ljubavlju vas pozivamo\nda budete deo našeg dana.', 56, 50.2, 13.5, { width: 54, color: '#51442f' }),
    date(56, 58.5, 19, { width: 54, color: '#51442f' }),
    label('ceremony', 56, 64.3, '#79613f', { width: 48 }),
    time('ceremony', 38, 68.5, 17, { width: 21, color: '#51442f' }),
    event('ceremony', 65, 68.5, 35, 13, '#51442f'),
    label('reception', 56, 74.3, '#79613f', { width: 48 }),
    time('reception', 38, 78.5, 17, { width: 21, color: '#51442f' }),
    event('reception', 65, 78.5, 35, 13, '#51442f'),
    rsvp(55, 86, 11.5, { width: 52, color: '#51442f' }),
    text('footer', 'Završna poruka', 'Naša priča tek počinje.', 55, 91, 19, { family: script, width: 52, color: '#775b35' }),
  ];
  if (id === 'zlatna-obala') layers = [
    text('title', 'Uvodni tekst', 'NAŠE ZAUVEK POČINJE OVDE', 55, 16, 8.5, { ...caption, width: 67, color: '#674b2f' }),
    text('bride', 'Ime mlade', 'Mila', 47, 24.2, 49, { family: script, width: 62, color: '#644930' }),
    amp(49, 28.7, 28, '#967137'),
    text('groom', 'Ime mladoženje', 'Stefan', 62, 33.3, 49, { family: script, width: 62, color: '#644930' }),
    text('note', 'Poruka gostima', 'Sa radošću vas pozivamo na naše venčanje.', 55, 39.4, 12, { width: 76, color: '#573e29' }),
    date(55, 44.2, 20, { width: 72, color: '#573e29' }),
    rsvp(55, 48.5, 9, { family: 'DM Sans', width: 71, color: '#60462e' }),
    label('ceremony', 38, 52.4, '#674b2f', { width: 36, letterSpacing: 1 }),
    label('reception', 75, 52.4, '#674b2f', { width: 36, letterSpacing: 1 }),
    time('ceremony', 38, 55.8, 16, { width: 35, color: '#573e29' }),
    time('reception', 75, 55.8, 16, { width: 35, color: '#573e29' }),
    event('ceremony', 38, 59.5, 38, 12, '#573e29'),
    event('reception', 75, 59.5, 38, 12, '#573e29'),
  ];
  if (id === 'beli-cvet-i-zlato') layers = [
    text('title', 'Uvodni tekst', 'NAŠ DAN ZA LJUBAV', 62, 20.5, 8.7, { ...caption, width: 57, color: '#53614b' }),
    text('bride', 'Ime mlade', 'Ana', 55, 32, 60, { family: script, width: 71, color: '#3d5144' }),
    amp(49, 40.5, 38, '#9c7139'),
    text('groom', 'Ime mladoženje', 'Petar', 48, 49, 60, { family: script, width: 72, color: '#3d5144' }),
    text('note', 'Poruka gostima', 'Sa ljubavlju vas pozivamo\nda zajedno proslavimo naše venčanje.', 47, 57.2, 14.5, { width: 75, color: '#35493c' }),
    date(40, 63.7, 20, { width: 65, color: '#35493c' }),
    label('ceremony', 36, 71.8, '#6f663e', { width: 55 }),
    time('ceremony', 20, 76.1, 17, { width: 24, color: '#35493c' }),
    event('ceremony', 46, 76.1, 36, 13, '#35493c'),
    label('reception', 35, 79.1, '#6f663e', { width: 55 }),
    time('reception', 20, 82.5, 17, { width: 24, color: '#35493c' }),
    event('reception', 46, 82.5, 36, 13, '#35493c'),
    rsvp(40, 67.7, 9.1, { family: 'DM Sans', width: 63, color: '#42513d' }),
  ];
  if (id === 'vece-pod-fenjerima') {
    const light = { color: '#fff3d9', effect: 'shadow', effectColor: '#302a25', effectSize: 1 };
    layers = [
      text('title', 'Uvodni tekst', 'JEDNO VEČE. NAŠE ZAUVEK.', 40, 22, 8.8, { ...caption, width: 63, color: '#573d30' }),
      text('bride', 'Ime mlade', 'Dunja', 37, 29.6, 49, { family: script, width: 59, color: '#59392b' }),
      amp(42, 35.3, 29, '#8c6133'),
      text('groom', 'Ime mladoženje', 'Nikola', 45, 41, 49, { family: script, width: 62, color: '#59392b' }),
      text('note', 'Poruka gostima', 'Sa radošću vas pozivamo\nna naše venčanje.', 43, 48, 14, { width: 61, color: '#49372e' }),
      date(44, 55.4, 21, { width: 65, color: '#49372e' }),
      label('ceremony', 53, 61.2, '#fff3d9', { ...light, width: 62 }),
      time('ceremony', 35, 65.6, 19, { ...light, width: 25 }),
      event('ceremony', 61, 65.6, 43, 14, '#fff3d9', light),
      label('reception', 53, 71.1, '#fff3d9', { ...light, width: 62 }),
      time('reception', 35, 75.5, 19, { ...light, width: 25 }),
      event('reception', 61, 75.5, 43, 14, '#fff3d9', light),
      rsvp(53, 81, 9.5, { ...light, family: 'DM Sans', width: 65 }),
    ];
  }
  if (id === 'smaragdni-zavet') layers = [
    text('title', 'Uvodni tekst', 'SA RADOŠĆU VAS POZIVAMO', 52, 22, 8.7, { ...caption, width: 64, letterSpacing: 1.45, color: '#e4c98e' }),
    text('bride', 'Ime mlade', 'Teodora', 51, 31.2, 37, { uppercase: true, width: 67, letterSpacing: 1.5, color: '#fff2d9' }),
    amp(52, 38.5, 35, '#e4c98e', { family: script }),
    text('groom', 'Ime mladoženje', 'Viktor', 52, 45.5, 37, { uppercase: true, width: 67, letterSpacing: 1.5, color: '#fff2d9' }),
    text('note', 'Poruka gostima', 'Da budete deo našeg venčanja\ni početka jednog zauvek.', 53, 53.7, 14, { width: 65, color: '#fff2d9' }),
    date(55, 62.1, 21, { width: 63, color: '#fff2d9' }),
    label('ceremony', 60, 66.4, '#e4c98e', { width: 45 }),
    time('ceremony', 48, 70.6, 17, { width: 21, color: '#fff2d9' }),
    event('ceremony', 68, 70.6, 31, 12.5, '#fff2d9'),
    label('reception', 62, 76, '#e4c98e', { width: 42 }),
    time('reception', 57, 80, 17, { width: 21, color: '#fff2d9' }),
    event('reception', 74, 80, 20, 12.5, '#fff2d9'),
    rsvp(55, 57.9, 8.8, { family: 'DM Sans', width: 63, color: '#fff2d9' }),
  ];
  if (id === 'sapat-bozura') layers = [
    text('title', 'Uvodni tekst', 'POČETAK NAŠEG ZAUVEK', 61, 35.7, 8.8, { ...caption, width: 58, color: '#87564e' }),
    text('bride', 'Ime mlade', 'Milica', 50, 44.3, 52, { family: script, width: 70, color: '#8a4d56' }),
    amp(57, 50, 27, '#a67d4a'),
    text('groom', 'Ime mladoženje', 'Nemanja', 57, 55.8, 52, { family: script, width: 74, color: '#8a4d56' }),
    text('note', 'Poruka gostima', 'Sa radošću vas pozivamo\nda budete deo našeg venčanja.', 52, 62.8, 14, { width: 70, color: '#6e4546' }),
    date(48, 69.8, 20, { width: 71, color: '#6e4546' }),
    label('ceremony', 45, 75.2, '#91624b', { width: 61 }),
    time('ceremony', 28, 77.8, 16.5, { width: 24, color: '#6e4546' }),
    event('ceremony', 52, 77.8, 36, 13, '#6e4546'),
    label('reception', 43, 82.2, '#91624b', { width: 60 }),
    time('reception', 27, 85.8, 16.5, { width: 24, color: '#6e4546' }),
    event('reception', 51, 85.8, 35, 13, '#6e4546'),
    rsvp(54, 66.2, 9.2, { family: 'DM Sans', width: 65, color: '#6e4546' }),
  ];
  if (id === 'pismo-ljubavi') layers = [
    text('title', 'Uvodni tekst', 'SAČUVAJTE DATUM ZA LJUBAV', 51, 17.5, 8.4, { ...caption, width: 61, letterSpacing: 1.2, color: '#805c48' }),
    text('bride', 'Ime mlade', 'Jovana', 46, 27.4, 53, { family: script, width: 63, color: '#80534d' }),
    amp(52, 33.8, 30, '#a67b48'),
    text('groom', 'Ime mladoženje', 'Mihailo', 55, 40, 53, { family: script, width: 65, color: '#80534d' }),
    text('note', 'Poruka gostima', 'Sa ljubavlju vas pozivamo\nda prisustvujete našem venčanju.', 50, 47.9, 14, { width: 62, color: '#68473d' }),
    date(49, 55.9, 20, { width: 63, color: '#68473d' }),
    label('ceremony', 47, 61.5, '#8c664d', { width: 56 }),
    time('ceremony', 30, 65.9, 17, { width: 22, color: '#68473d' }),
    event('ceremony', 55, 65.9, 35, 13, '#68473d'),
    label('reception', 47, 72.1, '#8c664d', { width: 55 }),
    time('reception', 30, 76.4, 17, { width: 22, color: '#68473d' }),
    event('reception', 55, 76.4, 35, 13, '#68473d'),
    rsvp(49, 58.8, 9.1, { family: 'DM Sans', width: 61, color: '#68473d' }),
  ];
  return normalizeDesign({
    schemaVersion: 1, name: metadata.name, category: 'wedding', locale: 'sr-Latn-RS',
    description: metadata.description, imageAlt: metadata.imageAlt, seoTitle: metadata.seoTitle, details: metadata.details,
    bg: metadata.bg, backgroundId, thumbnailId: null,
    fonts: [{ assetId: fontIds.serif, family: serif, name: 'Cormorant Garamond — svečani' }, { assetId: fontIds.script, family: script, name: 'Great Vibes — kaligrafski' }],
    layers,
  });
}
