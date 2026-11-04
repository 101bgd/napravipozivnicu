export const CONTACT_EMAIL = 'kontakt@napravipozivnicu.com';

export const INFO_PAGES = [
  {
    "id": "privacy",
    "path": "/politika-privatnosti/",
    "title": "Politika privatnosti",
    "schemaType": "WebPage",
    "updatedAt": "2026-11-04",
    "description": "Kako se obrađuju podaci dok koristite sajt: tekst i fotografije, lokalni nacrti, kontakt poruke, statistika, Google Analytics i oglasi.",
    "lead": "Kako obrađujemo podatke dok uređujete pozivnicu, čuvate nacrt ili nam šaljete poruku."
  },
  {
    "id": "about",
    "path": "/o-sajtu/",
    "title": "O sajtu",
    "schemaType": "AboutPage",
    "updatedAt": "2026-11-04",
    "description": "Napravi pozivnicu je alat na srpskom za samostalnu izradu pozivnica. Pročitajte kako radi, šta možete da prilagodite i gde da potražite pomoć.",
    "lead": "Alat za samostalnu izradu pozivnica, od izbora dizajna do preuzimanja gotove slike ili PDF-a."
  },
  {
    "id": "contact",
    "path": "/kontakt/",
    "title": "Kontakt",
    "schemaType": "ContactPage",
    "updatedAt": "2026-11-04",
    "description": "Pišite nam ako imate pitanje, predlog ili problem sa izradom pozivnice. Ovde su adresa za kontakt i podaci koji nam pomažu da odgovorimo.",
    "lead": "Za pitanje o izradi pozivnice, predlog ili prijavu problema pošaljite nam mejl."
  }
];

export const infoPageFromPath = path => INFO_PAGES.find(page => page.path === `${path.replace(/\/$/, '')}/`);
