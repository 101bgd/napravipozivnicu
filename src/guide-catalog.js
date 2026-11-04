export const GUIDE_HUB = {
  "id": "guides",
  "path": "/vodici/",
  "title": "Vodiči za pozivnice",
  "seoTitle": "Vodiči za pozivnice: tekstovi, slanje i štampa",
  "description": "Treba ti tekst za pozivnicu ili pomoć oko slanja i štampe? Izaberi vodič sa primerima, kratkim uputstvima i proverama pre nego što pozoveš goste.",
  "lead": "Za početak izaberi primer teksta. Ako je pozivnica već gotova, pogledaj kako da je pošalješ gostima ili odštampaš u pravoj veličini.",
  "publishedAt": "2026-10-21T00:00:00Z",
  "updatedAt": "2026-11-04T00:00:00Z"
};
export const GUIDES = [
  {
    "id": "birthday-text",
    "path": "/vodici/tekstovi-za-pozivnice-za-deciji-rodjendan/",
    "title": "Tekstovi za pozivnice za dečiji rođendan",
    "seoTitle": "Tekstovi za pozivnice za dečiji rođendan — 7 primera",
    "description": "Sedam tekstova za pozivnice za dečji rođendan, uz savete šta da napišeš i šta da skratiš. Kopiraj primer i zameni podatke svojim.",
    "lead": "Izaberi kratak poziv, šaljiv tekst ili poruku u ime roditelja. U svakom primeru zameni podatke u zagradama, a ispod su saveti za adresu, potvrdu dolaska i dužinu teksta.",
    "summary": "Sedam gotovih primera, od kratkog poziva do male dino ili svemirske avanture.",
    "label": "PRIMERI ROĐENDANSKOG TEKSTA",
    "icon": "gift",
    "theme": "sage",
    "categories": [
      "birthday",
      "first"
    ],
    "createHref": "/pozivnice-za-rodjendan/",
    "createLabel": "Izaberi rođendansku pozivnicu",
    "publishedAt": "2026-10-21T00:00:00Z",
    "updatedAt": "2026-11-04T00:00:00Z",
    "editorialSummary": "Sedam primera za kopiranje i saveti kako da tekst stane na pozivnicu."
  },
  {
    "id": "baptism-text",
    "path": "/vodici/sta-napisati-na-pozivnici-za-krstenje/",
    "title": "Šta napisati na pozivnici za krštenje",
    "seoTitle": "Šta napisati na pozivnici za krštenje — tekstovi i saveti",
    "description": "Šta napisati na pozivnici za krštenje? Pogledajte primere na latinici i ćirilici i savete za jasno navođenje obreda i porodične proslave.",
    "lead": "Pripremite ime deteta, datum i raspored, pa izaberite jedan od primera ispod. Vodič objašnjava kako da odvojite obred i proslavu i proverite tekst pre slanja.",
    "summary": "Primeri svečanog i jednostavnog poziva, sa odvojenim podacima obreda i proslave.",
    "label": "TEKST ZA KRŠTENJE",
    "icon": "leaf",
    "theme": "rose",
    "categories": [
      "baptism"
    ],
    "createHref": "/pozivnice-za-krstenje/",
    "createLabel": "Izaberite pozivnicu za krštenje",
    "publishedAt": "2026-10-21T00:00:00Z",
    "updatedAt": "2026-11-04T00:00:00Z",
    "editorialSummary": "Svečani i porodični pozivi, na latinici i ćirilici, sa podacima za oba mesta."
  },
  {
    "id": "messaging",
    "path": "/vodici/kako-poslati-digitalnu-pozivnicu-viber-whatsapp/",
    "title": "Kako poslati digitalnu pozivnicu preko Vibera i WhatsApp-a",
    "seoTitle": "Kako poslati pozivnicu preko Vibera i WhatsApp-a",
    "description": "Kako da pošalješ pozivnicu preko Vibera ili WhatsApp-a: pronađi preuzetu sliku, izaberi način slanja i dodaj kratku poruku gostima.",
    "lead": "Preuzetu pozivnicu šalješ sam, kroz aplikaciju koju koristiš. Ovde možeš da proveriš gde je slika sačuvana, kako da je priložiš i šta da napišeš uz nju.",
    "summary": "Od preuzete PNG slike do poruke koja jasno pokazuje kada i gde se slavi.",
    "label": "SLANJE GOTOVE POZIVNICE",
    "icon": "image",
    "theme": "blue",
    "categories": [],
    "createHref": "/pozivnice/",
    "createLabel": "Napravi digitalnu pozivnicu",
    "publishedAt": "2026-10-21T00:00:00Z",
    "updatedAt": "2026-11-04T00:00:00Z",
    "editorialSummary": "Pronađi preuzetu sliku na telefonu i pošalji je gostima uz kratku poruku."
  },
  {
    "id": "printing",
    "path": "/vodici/kako-odstampati-pozivnicu-u-pravoj-velicini/",
    "title": "Kako odštampati pozivnicu u pravoj veličini",
    "seoTitle": "Kako odštampati pozivnicu — PDF, veličina i A4 papir",
    "description": "Odštampaj pozivnicu u pravoj veličini: podesi PDF na 100%, proveri raspored na A4 i napravi probni otisak pre štampanja ostalih primeraka.",
    "lead": "PDF sa sajta ima dimenzije 12,7 × 17,78 cm. Da bi pozivnica i na papiru bila te veličine, proveri razmeru štampe i prvo odštampaj jedan primerak.",
    "summary": "PDF na 100%, dve pozivnice na A4 i praktična provera pre štampe celog tiraža.",
    "label": "ŠTAMPA POZIVNICE",
    "icon": "file",
    "theme": "lavender",
    "categories": [],
    "createHref": "/pozivnice/",
    "createLabel": "Izaberi pozivnicu za štampu",
    "publishedAt": "2026-10-21T00:00:00Z",
    "updatedAt": "2026-11-04T00:00:00Z",
    "editorialSummary": "Prava veličina na papiru, dve pozivnice na A4 i provera pre štampanja."
  }
];
export const guidePageFromPath = path => [GUIDE_HUB, ...GUIDES].find(page => page.path === `${path.replace(/\/$/, '')}/`);
export const guidesForCategory = category => GUIDES.filter(guide => !guide.categories.length || guide.categories.includes(category));
