export const CONTACT_EMAIL = 'kontakt@napravipozivnicu.com';

export const INFO_PAGES = [
  {
    id: 'privacy', path: '/politika-privatnosti/', title: 'Politika privatnosti', schemaType: 'WebPage', updatedAt: '2026-10-22',
    description: 'Kako Napravi pozivnicu obrađuje tekst, fotografije, lokalne nacrte i kontakt poruke. Privatnost, Google Analytics, AdSense i mogućnosti kontrole podataka.',
    lead: 'Ovde objašnjavamo kako se koriste podaci dok pravite pozivnicu, čuvate nacrt ili nam pišete.',
  },
  {
    id: 'about', path: '/o-sajtu/', title: 'O sajtu', schemaType: 'AboutPage', updatedAt: '2026-10-21',
    description: 'Napravi pozivnicu je besplatan online alat na srpskom za rođendane, venčanja, krštenja i druge proslave. Uredi dizajn i preuzmi PNG ili PDF bez registracije.',
    lead: 'Za trenutke koje jedva čekate i ljude sa kojima želite da ih podelite.',
  },
  {
    id: 'contact', path: '/kontakt/', title: 'Kontakt', schemaType: 'ContactPage', updatedAt: '2026-10-16',
    description: 'Kontaktirajte Napravi pozivnicu na kontakt@napravipozivnicu.com za pitanja, predloge, prijavu problema ili zahteve u vezi sa privatnošću i sadržajem.',
    lead: 'Imate pitanje, predlog ili vam nešto ne radi kako treba? Pišite nam.',
  },
];

export const infoPageFromPath = path => INFO_PAGES.find(page => page.path === `${path.replace(/\/$/, '')}/`);
