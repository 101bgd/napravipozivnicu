# Kontrola kvaliteta — prvi paket, 21. oktobar 2026.

Obuhvat: poziv na uređivanje uz pregled, mobilni editor, lokalni nacrti i istorija izmena, upozorenja za duži tekst, izvoz i zbirna statistika u zaštićenom admin panelu.

Provere su izvršene lokalno u Chromium-u i preko kompajliranog Cloudflare Worker-a u Miniflare-u, sa privremenom D1/R2 bazom. Testni zahtevi nisu poslati na produkciju.

| Provera | Rezultat |
| --- | --- |
| Produkcioni Vite/Worker build | Prošao |
| `tests/first-package.mjs` | Prošao: CTA, pregled, nacrti, istorija, upozorenja, izvoz, greške i statistika |
| `tests/browser-smoke.mjs` | Prošao: navigacija, pretraga, fotografija, položaj/uvećanje, stil, PNG/PDF, smanjeno kretanje |
| `tests/production-smoke.mjs` | Prošao: javne kolekcije, fontovi, stvarne datoteke, sadržaj bez JavaScript-a i odloženo učitavanje |
| `tests/admin-integration.mjs` | Prošao: Access/JWT/CSRF, privatne datoteke, nacrt/objava/povlačenje, javni editor i oglasi |
| `tests/template-titles.mjs` | Prošao: svih 61 opisnih naslova, kanonske adrese i metapodaci |
| Vizuelni pregled | Pregledani mobilni prikazi i desktop editor, kao i statistika u adminu |

Dodatno provereno:

- Širine 320, 390, 768 i 1440 px, kao i nizak ekran 390 × 430 px. Simulirano je smanjenje visual viewport-a pri otvaranju tastature; nije izvršen test na fizičkom iPhone/Android telefonu.
- PNG zaista ima 1500 × 2100 piksela. PDF sadrži stranicu 127 × 177,8 mm. Izvoz ne uključuje oglase ni kontrole editora.
- Automatski nacrt, trenutno zatvaranje i ponovno otvaranje, poništi/ponovi, razdvojeni nacrti, brisanje i isključivanje čuvanja, neispravan JSON i blokirano lokalno skladište.
- Simuliran neuspešan PNG izvoz i ponovni uspešan pokušaj. Blokiranje statistike ne prekida uređivanje ili preuzimanje. Greška izvoza ne povećava brojač uspešno pripremljenih datoteka.
- Statistika šalje samo `templateId` i `event`, bez unetog teksta, fotografije, kolačića i Referer zaglavlja. DNT i GPC sprečavaju slanje. API odbija nepoznate događaje/šablone, dodatna polja, velike i zahteve sa drugog origin-a. Paralelni zahtevi pravilno sabiraju radnje.
- Pristup zbirnim podacima zahteva prijavu. Provereni prazni podaci, periodi, uklanjanje starih zbirnih vrednosti i oporavak admin prikaza posle nedostupnog API-ja.
- Početni JavaScript na početnoj i katalogu: oko 7,13 KB gzip, ispod postojećeg budžeta od 10 KB. Editor, fontovi dizajna i PDF biblioteka ostaju odloženo učitani.

Statistika počinje od ovog izdanja; nema retroaktivnih podataka. „Preuzimanja pokrenuta“ znači da je datoteka napravljena i predata pregledaču, ne potvrdu da ju je korisnik sačuvao. Brojevi predstavljaju radnje, ne jedinstvene ljude. Upozorenje za duži tekst pomaže pri pregledu, ali ne otkriva svako moguće vizuelno preklapanje.

Produkcioni Cloudflare deployment i rad na javnom domenu nisu potvrđeni iz ovog okruženja.
