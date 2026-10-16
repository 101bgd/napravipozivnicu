import { isAssetId, newTextLayer, normalizeDesign } from '../../src/template-schema.js';

export const firstBirthdayDrafts = [
  {
    id: 'savanska-druzina', source: 1, name: 'Savanska družina',
    slug: 'pozivnica-za-prvi-rodjendan-safari-zirafa-slon',
    seoTitle: 'Safari pozivnica za prvi rođendan — Savanska družina',
    description: 'Besplatna safari pozivnica za prvi rođendan sa žirafom i slončetom. Uredi ime, datum i mesto proslave i preuzmi PNG ili PDF za štampu, bez fotografije.',
    imageAlt: 'Safari pozivnica za prvi rođendan sa nasmejanom žirafom i slončetom u savani, žutim suncem i razigranim zelenim i narandžastim slovima',
    details: 'Žirafa i slonče stoje ispod otvorenog krem neba. Ime i velika prva svećica nalaze se iznad njih, dok podaci o proslavi prate slobodan prostor pored žirafe. Šablon za safari proslavu je bez mesta za fotografiju.',
    bg: '#fcf4df',
  },
  {
    id: 'vozic-prve-radosti', source: 2, name: 'Vozić prve radosti',
    slug: 'pozivnica-za-1-rodjendan-vozic-meda',
    seoTitle: 'Pozivnica za 1. rođendan sa vozićem — besplatno',
    description: 'Pozivnica za 1. rođendan sa drvenim vozićem i medom. Promeni ime deteta, vreme i adresu proslave i besplatno preuzmi sliku ili PDF za štampu.',
    imageAlt: 'Pozivnica za 1. rođendan sa drvenim plavim vozićem, medom u vagonu, livadom i oblačićima, uz plava slova i veliki narandžasti broj jedan',
    details: 'Drveni vozić prolazi kroz livadu, sa medom i šarenim lopticama u vagonima. Plava imena i topla narandžasta jedinica prate boje lokomotive. Tekst ostaje u svetlom nebu, bez zaklanjanja vozića i bez okvira za fotografiju.',
    bg: '#faeedc',
  },
  {
    id: 'labudova-neznost', source: 3, name: 'Labudova nežnost',
    slug: 'pozivnica-za-prvi-rodjendan-labudovi',
    seoTitle: 'Pozivnica za prvi rođendan sa labudovima — besplatno',
    description: 'Nežna pozivnica za prvi rođendan sa labudovima na roze jezeru. Dodaj ime i detalje proslave i preuzmi besplatan PNG ili PDF, bez ubacivanja fotografije.',
    imageAlt: 'Roze pozivnica za prvi rođendan sa belim labudom i mladunčetom na jezeru, lokvanjima i rukopisnim imenom u boji maline',
    details: 'Labud i mladunče na mirnom jezeru uokvireni su roze oblacima i lokvanjima. Rukopisno ime je u nebu, a vreme i lokacija izdvojeni su levo od labudova. Malinasta slova čuvaju čitljivost na nežnoj pozadini. Fotografija se ne dodaje.',
    bg: '#f8e7df',
  },
  {
    id: 'vilina-prva-carolija', source: 4, name: 'Vilina prva čarolija',
    slug: 'pozivnica-za-1-rodjendan-vila-leptiri',
    seoTitle: 'Pozivnica za 1. rođendan sa vilom — Vilina prva čarolija',
    description: 'Bajkovita pozivnica za 1. rođendan sa vilom, leptirima i cvećem. Personalizuj ime i podatke proslave i besplatno preuzmi PNG ili PDF za štampu.',
    imageAlt: 'Bajkovita pozivnica za 1. rođendan sa malom vilom na pečurki, ljubičastim cvećem i leptirima, sa čitljivim ljubičastim tekstom desno',
    details: 'Mala vila, leptiri i cvetna staza najavljuju proslavu u bajkovitom stilu. Rukopisno ime i velika jedinica smešteni su desno, tako da vilina krila i lice ostanu vidljivi. Svi podaci su izmenjivi, a mesto za fotografiju nije predviđeno.',
    bg: '#f7eae5',
  },
  {
    id: 'kitov-prvi-talas', source: 5, name: 'Kitov prvi talas',
    slug: 'pozivnica-za-prvi-rodjendan-kit-more',
    seoTitle: 'Morska pozivnica za prvi rođendan — Kitov prvi talas',
    description: 'Besplatna pozivnica za prvi rođendan sa plavim kitom i talasima. Unesi ime, datum i adresu i preuzmi PNG ili PDF za štampu, bez fotografije.',
    imageAlt: 'Morska pozivnica za prvi rođendan sa plavim kitom, vodenim kapljicama i talasima, uz vedra plava slova i veliki broj jedan na krem pozadini',
    details: 'Plavi kit izranja iz akvarelnih talasa, ispod malog oblačka. Krupno ime, jedinica i podaci nalaze se u slobodnom krem delu iznad mora. Za prvi rođendan sa morskom temom, bez fotografije i bez zaklanjanja kita.',
    bg: '#fcf7eb',
  },
  {
    id: 'mali-pilot', source: 6, name: 'Mali pilot',
    slug: 'pozivnica-za-1-rodjendan-avion-psic',
    seoTitle: 'Pozivnica za 1. rođendan sa avionom — Mali pilot',
    description: 'Pozivnica za 1. rođendan sa psićem u plavom avionu. Uredi ime malog pilota i detalje proslave i preuzmi besplatnu sliku ili PDF za štampu.',
    imageAlt: 'Plava pozivnica za 1. rođendan sa psićem pilotom u avionu, crvenim šalom i belim oblačićima, sa razigranim imenom ispod aviona',
    details: 'Psić sa pilotskim naočarima leti iznad oblaka u plavom avionu. Tekst počinje ispod ilustracije, uz blago nagnuto ime i veliku prvu rođendansku jedinicu. Uredi poziv na poletanje, datum i mesto proslave. Dizajn nema okvir za fotografiju.',
    bg: '#aed8ef',
  },
  {
    id: 'medin-mesecev-san', source: 7, name: 'Medin mesečev san',
    slug: 'pozivnica-za-prvi-rodjendan-meda-mesec',
    seoTitle: 'Pozivnica za prvi rođendan sa medom — Medin mesečev san',
    description: 'Topla pozivnica za prvi rođendan sa medom na Mesecu i zvezdicama. Izmeni ime, poruku i mesto slavlja i preuzmi besplatan PNG ili PDF za štampu.',
    imageAlt: 'Krem pozivnica za prvi rođendan sa uspavanim medom na zlatnom polumesecu, zvezdicama i oblačićima, uz zaobljeno smeđe ime i veliku jedinicu',
    details: 'Meda drema na zlatnom polumesecu iznad oblaka. Topla smeđa slova, zaobljeno ime i rukopisna završna poruka prate mirnu ilustraciju. Podaci su u slobodnom donjem delu pozadine. Ovaj šablon za prvu svećicu je bez fotografije.',
    bg: '#fff1d7',
  },
  {
    id: 'zeka-medju-oblacima', source: 8, name: 'Zeka među oblacima',
    slug: 'pozivnica-za-1-rodjendan-zeka-balon-oblaci',
    seoTitle: 'Pozivnica za 1. rođendan sa zekom i balonom — besplatno',
    description: 'Pozivnica za 1. rođendan sa zekom u šarenom balonu. Upiši ime, datum i mesto okupljanja i besplatno preuzmi PNG ili PDF, bez mesta za fotografiju.',
    imageAlt: 'Pozivnica za 1. rođendan sa belim zekom u pastelnom balonu na levoj strani, plavim nebom i ružičastim oblacima, uz vedar tekst desno',
    details: 'Zeka u pastelnom balonu lebdi levo, dok ime i poziv na slavlje prate otvoreno nebo desno. Svetla jedinica sa plavom konturom ističe prvi rođendan. Boje teksta prate plave i krem tonove balona; fotografija nije deo šablona.',
    bg: '#91c2ef',
  },
  {
    id: 'zekin-prvi-let', source: 9, name: 'Zekin prvi let',
    slug: 'pozivnica-za-prvi-rodjendan-zeka-veliki-balon',
    seoTitle: 'Pozivnica za prvi rođendan sa balonom — Zekin prvi let',
    description: 'Pozivnica za prvi rođendan sa velikim balonom i veselim zekom. Personalizuj ime i detalje proslave i preuzmi besplatnu sliku ili PDF za štampu.',
    imageAlt: 'Pozivnica za prvi rođendan sa velikim pastelnim balonom, veselim zekom u korpi i zlatnim zalaskom, uz ime desno i podatke ispod balona',
    details: 'Krupniji balon i nasmejani zeka daju ovoj varijanti drugačiji raspored. Velika jedinica i ime stoje desno, a podaci o okupljanju u širokom bloku ispod korpe. Uredi poruku za svoju prvu rođendansku avanturu, bez dodavanja fotografije.',
    bg: '#9ac8f3',
  },
  {
    id: 'prva-tresnjica', source: 10, name: 'Prva trešnjica',
    slug: 'pozivnica-za-1-rodjendan-tresnjice-masna',
    seoTitle: 'Pozivnica za 1. rođendan sa trešnjicama — Prva trešnjica',
    description: 'Vesela pozivnica za 1. rođendan sa trešnjicama i roze mašnom. Izmeni ime, datum i lokaciju i preuzmi besplatan PNG ili PDF za štampu, bez fotografije.',
    imageAlt: 'Pozivnica za 1. rođendan sa dve crvene trešnjice, roze kariranom mašnom i talasastom roze ivicom, sa razigranim crvenim slovima na žutoj pozadini',
    details: 'Trešnjice i karirana mašna uokvirene su roze i žutim tonovima. Ime i velika crvena jedinica nalaze se ispod ilustracije, u vedrom rasporedu nalik dečjoj slikovnici. Prilagodi podatke o proslavi i potvrdu dolaska. Nema mesta za fotografiju.',
    bg: '#fff1bf',
  },
];

export function firstBirthdayDesign(id, { backgroundId, fontIds } = {}) {
  const metadata = firstBirthdayDrafts.find(item => item.id === id);
  if (!metadata) throw new Error('Nepoznat dizajn za prvi rođendan.');
  if (!isAssetId(backgroundId) || !['baloo2', 'dynapuff', 'script'].every(key => isAssetId(fontIds?.[key]))) throw new Error('Nedostaju pozadina ili fontovi dizajna.');
  const baloo = `custom-${fontIds.baloo2}`, puff = `custom-${fontIds.dynapuff}`, script = `custom-${fontIds.script}`;
  const text = (field, label, value, x, y, size, options = {}) => ({ ...newTextLayer(field), id: `${id}-${field}`, label, text: value, x, y, size, family: 'DM Sans', color: '#34534a', width: 72, lineHeight: 1.4, ...options });
  const title = (value, x, y, color, options = {}) => text('title', 'Uvodni tekst', value, x, y, 9, { color, letterSpacing: 1.1, ...options });
  const name = (value, x, y, size, color, options = {}) => text('names', 'Ime deteta', value, x, y, size, { family: baloo, color, ...options });
  const age = (x, y, size, color, options = {}) => text('age', 'Broj na pozivnici', '1.', x, y, size, { family: puff, color, width: 28, ...options });
  const occasion = (x, y, size, color, options = {}) => text('occasion', 'Naslov proslave', 'ROĐENDAN', x, y, size, { family: baloo, color, width: 42, ...options });
  const note = (value, x, y, color, options = {}) => text('note', 'Poruka gostima', value, x, y, 11.5, { color, ...options });
  const date = (x, y, size, color, options = {}) => text('date', 'Datum proslave', '2027-04-17', x, y, size, { family: baloo, color, ...options });
  const time = (x, y, size, color, options = {}) => text('time', 'Vreme proslave', '17:00', x, y, size, { family: baloo, color, width: 28, ...options });
  const place = (value, x, y, color, options = {}) => text('location', 'Mesto proslave', value, x, y, 11, { color, ...options });
  const rsvp = (x, y, color, options = {}) => text('rsvp', 'Potvrda dolaska', 'Potvrdite dolazak do 10. aprila.', x, y, 8.5, { color, ...options });
  let layers;
  if (id === 'savanska-druzina') layers = [
    title('GODINA PUNA MALIH AVANTURA', 61, 7.5, '#4d6237', { width: 62, size: 8.5 }),
    name('Luka', 60, 16.5, 44, '#3f6037', { width: 70, rotation: -2 }),
    age(43, 26, 59, '#a7582e'), occasion(67, 26, 17, '#3f6037', { width: 37 }),
    note('Dođi da zajedno proslavimo\nmoju prvu svećicu!', 56, 34, '#3c5130', { width: 76, size: 10.8 }),
    date(38, 39.7, 16, '#3f6037', { width: 50 }), time(77, 39.7, 16, '#3f6037'),
    place('Igraonica Safari, Beograd', 57, 44, '#3c5130', { width: 75, size: 10.5 }),
    rsvp(73, 49.4, '#3c5130', { width: 44, size: 7.8 }),
  ];
  if (id === 'vozic-prve-radosti') layers = [
    title('UKRCAJ SE NA MOJU PRVU PROSLAVU', 51, 10, '#405f6f', { width: 81, size: 8.6 }),
    name('Vuk', 50, 20.7, 49, '#345f78', { family: puff, width: 75 }),
    age(34, 32.5, 70, '#b26034', { family: baloo }), occasion(65, 32.5, 19, '#345f78', { width: 44 }),
    note('Jedna svećica, puno osmeha\ni vozić pun drugara. Čekam te!', 50, 42, '#344e5c', { width: 78 }),
    date(34, 49.5, 16, '#345f78', { width: 51 }), time(75, 49.5, 16, '#345f78'),
    place('Igraonica Vozić, Beograd', 50, 55, '#344e5c', { width: 79 }),
    rsvp(50, 59.1, '#344e5c', { width: 76, size: 8 }),
  ];
  if (id === 'labudova-neznost') layers = [
    title('JEDNA GODINA. TOLIKO LJUBAVI.', 51, 11, '#925161', { width: 80, size: 8.7 }),
    name('Mila', 48, 23, 54, '#8f405c', { family: script, width: 77 }),
    age(28, 38.2, 77, '#93445a', { family: baloo }), occasion(61, 39, 20, '#8f405c', { width: 50 }),
    note('Dođi da zajedno proslavimo\nmoj prvi rođendan!', 41, 48, '#784353', { width: 66, size: 12 }),
    date(29, 59.4, 18, '#824154', { width: 47 }), time(29, 65, 15, '#824154', { width: 42 }),
    place('Restoran Labud, Beograd', 28, 72, '#713a4b', { width: 43, size: 11.5 }),
    rsvp(28, 79, '#713a4b', { width: 44, size: 8.5 }),
  ];
  if (id === 'vilina-prva-carolija') layers = [
    title('MOJA PRVA ČAROLIJA', 69, 17.8, '#6a4d7d', { width: 50, size: 8.7 }),
    name('Sofija', 67, 28, 44, '#704b87', { family: script, width: 57 }),
    age(70, 41, 72, '#795393', { family: baloo, width: 38 }), occasion(71, 49.9, 18, '#614478', { width: 47 }),
    note('Dođi na dan pun\nosmeha i čarolije!', 71, 57.5, '#5b416b', { width: 46, size: 11.5 }),
    date(73, 65, 17, '#614478', { width: 45 }), time(73, 70, 14, '#614478'),
    place('Igraonica Vila, Beograd', 73, 76, '#51375f', { width: 41, size: 11.5 }),
    rsvp(73, 82, '#51375f', { width: 41, size: 8.5 }),
  ];
  if (id === 'kitov-prvi-talas') layers = [
    title('JEDNA VELIKA MALA RADOST', 43, 8.5, '#3d6a7c', { width: 70, size: 8.6 }),
    name('Uroš', 48, 19.2, 48, '#2d6680', { width: 77, rotation: -2 }),
    age(33, 30, 70, '#356c86'), occasion(66, 30.4, 20, '#2d6680', { width: 46 }),
    note('Zaplivaj sa nama u dan\npun igre, torte i zagrljaja!', 51, 39, '#305b70', { width: 80, size: 11 }),
    date(34, 45.5, 16.5, '#2d6680', { width: 53 }), time(76, 45.5, 16.5, '#2d6680'),
    place('Igraonica Talas, Beograd', 61, 51, '#305b70', { width: 69, size: 10.8 }),
    rsvp(69, 56, '#305b70', { width: 50, size: 8.1 }),
  ];
  if (id === 'mali-pilot') layers = [
    title('PRVA VELIKA AVANTURA', 51, 44.5, '#315878', { width: 78, size: 9.5 }),
    name('Nikola', 50, 54.8, 50, '#2d5478', { family: puff, width: 82, rotation: -2, effect: 'outline', effectColor: '#e6f4fa', effectSize: .8 }),
    age(33, 67.3, 70, '#a24e34', { family: baloo }), occasion(66, 67.5, 20, '#2d5478', { width: 46 }),
    note('Pripremi osmeh za poletanje.\nSlavim svoj prvi rođendan!', 50, 76, '#294c69', { width: 80, size: 11.5 }),
    date(33, 83.5, 16.5, '#2d5478', { width: 52 }), time(75, 83.5, 16.5, '#2d5478'),
    place('Igraonica Oblak, Beograd', 50, 89, '#294c69', { width: 78, size: 11.2 }),
    rsvp(50, 93, '#294c69', { width: 76 }),
  ];
  if (id === 'medin-mesecev-san') layers = [
    title('GODINA NAJLEPŠIH ZAGRLJAJA', 47, 36, '#7c5635', { width: 76, size: 8.7 }),
    name('Teodor', 47, 46, 48, '#7e5132', { width: 81, rotation: -1.5 }),
    age(32, 59.5, 76, '#a77032', { family: baloo }), occasion(66, 59.5, 20, '#765033', { width: 47 }),
    note('Dođi da duvamo prvu svećicu\ni napravimo još jednu lepu uspomenu.', 50, 69.4, '#68472f', { width: 83, size: 11.5 }),
    date(33, 77.1, 16.5, '#765033', { width: 52 }), time(75, 77.1, 16.5, '#765033'),
    place('Restoran Meda, Beograd', 50, 83, '#68472f', { width: 80, size: 11.2 }),
    rsvp(50, 88, '#68472f', { width: 76 }),
    text('footer', 'Završna poruka', 'Čekam te sa osmehom.', 50, 93, 19, { family: script, width: 80, color: '#7e5132' }),
  ];
  if (id === 'zeka-medju-oblacima') layers = [
    title('POZIV NA PRVU AVANTURU', 72, 17, '#294e75', { width: 49, size: 8.3, letterSpacing: .7 }),
    name('Maša', 72, 28.5, 42, '#31527b', { family: puff, width: 47, effect: 'outline', effectColor: '#e5f4ff', effectSize: .6 }),
    age(72, 41, 76, '#fff0cd', { family: baloo, width: 37, effect: 'outline', effectColor: '#456788', effectSize: 1.4 }),
    occasion(72, 50.2, 18, '#294e75', { width: 48 }),
    note('Poleti sa mnom u dan\npun igre i osmeha!', 73, 58, '#274b6b', { width: 46, size: 11 }),
    date(72, 66, 16, '#294e75', { width: 48 }), time(72, 71, 14.5, '#294e75'),
    place('Igraonica Balon, Beograd', 68, 78, '#294661', { width: 55, size: 11 }),
    rsvp(66, 84, '#294661', { width: 58, size: 8.5 }),
  ];
  if (id === 'zekin-prvi-let') layers = [
    title('JEDNA SVEĆICA', 76, 17, '#2b4b70', { width: 42, size: 9.5 }),
    age(76, 30.5, 80, '#fff0c9', { family: baloo, width: 38, effect: 'outline', effectColor: '#456889', effectSize: 1.5 }),
    name('Relja', 75, 45.5, 39, '#2e5078', { family: puff, width: 45, effect: 'outline', effectColor: '#e3f2ff', effectSize: .6 }),
    occasion(74, 54, 17.5, '#2b4b70', { width: 45 }),
    note('Moje prvo veliko slavlje.\nDođi da poletimo zajedno!', 67, 67.2, '#2a4662', { width: 59, size: 11.5 }),
    date(34, 80.6, 17, '#2a4662', { width: 54 }), time(76, 80.6, 17, '#2a4662'),
    place('Igraonica Zeka, Beograd', 50, 87, '#2a4662', { width: 82, size: 11.5 }),
    rsvp(50, 92, '#2a4662', { width: 79, size: 8.8 }),
  ];
  if (id === 'prva-tresnjica') layers = [
    title('NAŠA MALA TREŠNJICA', 51, 47.5, '#9c3e47', { width: 78, size: 9.5 }),
    name('Višnja', 50, 57.2, 50, '#ac344a', { family: puff, width: 82, rotation: -2 }),
    age(33, 69, 73, '#bd394d', { family: baloo }), occasion(66, 69, 20, '#9c3446', { width: 47 }),
    note('Jedna svećica i dan sladak kao trešnja.\nDođi na moj prvi rođendan!', 50, 77.5, '#7e3c3e', { width: 83, size: 11.2 }),
    date(33, 84.1, 16, '#933343', { width: 52 }), time(75, 84.1, 16, '#933343'),
    place('Igraonica Trešnjica, Beograd', 50, 89.2, '#7e3c3e', { width: 82, size: 11.2 }),
    rsvp(48, 94, '#7e3c3e', { width: 69, size: 8.3 }),
  ];
  const usedFamilies = new Set(layers.map(layer => layer.family));
  const fonts = [{ assetId: fontIds.baloo2, family: baloo, name: 'Baloo 2 — razigrani' }, { assetId: fontIds.dynapuff, family: puff, name: 'DynaPuff — oblačići' }, { assetId: fontIds.script, family: script, name: 'Napravi Rukopis — nežni' }].filter(font => usedFamilies.has(font.family));
  return normalizeDesign({ schemaVersion: 1, name: metadata.name, category: 'first', locale: 'sr-Latn-RS', description: metadata.description, imageAlt: metadata.imageAlt, seoTitle: metadata.seoTitle, details: metadata.details, bg: metadata.bg, backgroundId, thumbnailId: null, fonts, layers });
}
