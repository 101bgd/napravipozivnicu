const publishedAt = '2026-10-21T00:00:00Z';
export const GUIDE_HUB = {
  id: 'guides', path: '/vodici/', title: 'Vodiči za pozivnice',
  seoTitle: 'Vodiči za pozivnice: tekstovi, slanje i štampa',
  description: 'Primeri tekstova za rođendan i krštenje, slanje pozivnice preko Vibera i WhatsApp-a i štampa u pravoj veličini. Praktični vodiči na srpskom.',
  lead: 'Prave reči. Lako slanje. Lepa štampa. Sve što ti treba između izbora dizajna i prvog gosta.',
  publishedAt, updatedAt: publishedAt,
};
export const GUIDES = [
  {
    id: 'birthday-text', path: '/vodici/tekstovi-za-pozivnice-za-deciji-rodjendan/',
    title: 'Tekstovi za pozivnice za dečiji rođendan',
    seoTitle: 'Tekstovi za pozivnice za dečiji rođendan — 7 primera',
    description: 'Sedam primera teksta za pozivnicu za dečiji rođendan: kratki, razigrani, dino, svemirski i za prvi rođendan. Kopiraj primer i dodaj svoje podatke.',
    lead: 'Dobar rođendanski poziv staje u nekoliko toplih rečenica. Ovde su primeri koje možeš da kopiraš i prilagodiš detetu, temi i mestu proslave.',
    summary: 'Sedam gotovih primera, od kratkog poziva do male dino ili svemirske avanture.',
    label: 'REČI ZA VELIKI MALI DAN', icon: 'gift', theme: 'sage', categories: ['birthday', 'first'],
    createHref: '/pozivnice-za-rodjendan/', createLabel: 'Izaberi rođendansku pozivnicu',
    publishedAt, updatedAt: publishedAt,
  },
  {
    id: 'baptism-text', path: '/vodici/sta-napisati-na-pozivnici-za-krstenje/',
    title: 'Šta napisati na pozivnici za krštenje',
    seoTitle: 'Šta napisati na pozivnici za krštenje — tekstovi i saveti',
    description: 'Svečani i kratki tekstovi za pozivnicu za krštenje, sa primerima za crkvu i porodičnu proslavu. Šta navesti, kako izabrati pismo i rasporediti podatke.',
    lead: 'Nežne reči i jasno napisani podaci dovoljan su početak. Pripremi poziv za krštenje koji prati vašu porodicu i gostima olakšava dolazak.',
    summary: 'Primeri svečanog i jednostavnog poziva, sa odvojenim podacima obreda i proslave.',
    label: 'REČI ZA PORODIČNU RADOST', icon: 'leaf', theme: 'rose', categories: ['baptism'],
    createHref: '/pozivnice-za-krstenje/', createLabel: 'Izaberi pozivnicu za krštenje',
    publishedAt, updatedAt: publishedAt,
  },
  {
    id: 'messaging', path: '/vodici/kako-poslati-digitalnu-pozivnicu-viber-whatsapp/',
    title: 'Kako poslati digitalnu pozivnicu preko Vibera i WhatsApp-a',
    seoTitle: 'Kako poslati pozivnicu preko Vibera i WhatsApp-a',
    description: 'Preuzmi digitalnu pozivnicu kao PNG, pronađi je na telefonu i pošalji preko Vibera ili WhatsApp-a. Uputstva za fotografiju, dokument i jasnu prateću poruku.',
    lead: 'Gotova pozivnica ide sa tvog uređaja pravo u razgovor. Prati korake za preuzimanje, pronalaženje fajla i slanje gostima.',
    summary: 'Od preuzete PNG slike do poruke koja jasno pokazuje kada i gde se slavi.',
    label: 'OD EKRANA DO TVOJIH LJUDI', icon: 'image', theme: 'blue', categories: [],
    createHref: '/pozivnice/', createLabel: 'Napravi digitalnu pozivnicu',
    publishedAt, updatedAt: publishedAt,
  },
  {
    id: 'printing', path: '/vodici/kako-odstampati-pozivnicu-u-pravoj-velicini/',
    title: 'Kako odštampati pozivnicu u pravoj veličini',
    seoTitle: 'Kako odštampati pozivnicu — PDF, veličina i A4 papir',
    description: 'Odštampaj PDF pozivnicu u formatu 12,7 × 17,78 cm: podešavanje na 100%, raspored na A4, izbor papira i provera prepusta pre odlaska u štampariju.',
    lead: 'Najvažnija postavka je jednostavna: stvarna veličina, odnosno 100%. Evo kako da od fajla dobiješ pozivnicu sa tačnim merama.',
    summary: 'PDF na 100%, dve pozivnice na A4 i praktična provera pre štampe celog tiraža.',
    label: 'OD FAJLA DO PAPIRA', icon: 'file', theme: 'lavender', categories: [],
    createHref: '/pozivnice/', createLabel: 'Izaberi pozivnicu za štampu',
    publishedAt, updatedAt: publishedAt,
  },
];
export const guidePageFromPath = path => [GUIDE_HUB, ...GUIDES].find(page => page.path === `${path.replace(/\/$/, '')}/`);
export const guidesForCategory = category => GUIDES.filter(guide => !guide.categories.length || guide.categories.includes(category));
