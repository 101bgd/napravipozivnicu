# Google tag i AdSense — tehnička provera, 22. oktobar 2026.

Google tag `G-802HKT7NMR` dodat je odmah posle otvarajućeg `<head>` elementa. Postojeći AdSense kod koristi `ca-pub-6151181163851577`. Provera pokriva kod i kompajliranu produkcionu verziju u lokalnom Cloudflare Worker okruženju sa privremenom D1/R2 bazom.

## Provereno

| Stavka | Nalaz |
| --- | --- |
| Sve javne stranice | 83 stranice: početna, katalog, šest kategorija, 67 šablona, tri informativne stranice i pet stranica vodiča |
| Google tag | Jedan asinhroni loader i jedna `gtag('config', 'G-802HKT7NMR')` inicijalizacija po dokumentu; tačno na početku zaglavlja |
| AdSense | Jedan asinhroni loader u istom zaglavlju; ispravan publisher ID i `crossorigin="anonymous"` |
| Buduće objave | Nova objavljena pozivnica iz D1 automatski dobija oba taga bez novog builda |
| Alternativne adrese | `www` dobija oba taga; javni `index.html` URL-ovi preusmeravaju sa 301 na iste kanonske stranice uz očuvan query string |
| Privatne i probne stranice | Admin, API, 404, lokalni i `pages.dev` prikazi ne dobijaju tagove |
| `ads.txt` | `google.com, pub-6151181163851577, DIRECT, f08c47fec0942fa0` |
| Dostupnost i navigacija | Javne stranice vraćaju 200, postoje interni linkovi i 67 dostupnih slika pregleda; nepostojeća pozivnica vraća 404 |
| Indeksiranje | Jedan H1 i canonical po stranici, sadržaj dostupan bez JavaScript-a, sitemap sadrži javne URL-ove, robots dozvoljava javne stranice |
| Informacije o sajtu | Politika privatnosti, O sajtu i Kontakt povezani su iz podnožja; prisutna adresa `kontakt@napravipozivnicu.com` |
| Politika privatnosti | Dodato objašnjenje GA4, kolačića, obrade i mogućnosti kontrole; uklonjena netačna tvrdnja da Analytics nije uključen |
| Editor i izvoz | Mobilni editor, PNG 1500 × 2100 i stvarni PDF rade uz tagove; aplikacija ne dodaje sadržaj editorovih polja u `dataLayer` |
| Blokatori | Blokirani Google zahtevi ne onemogućavaju editor i kontakt stranicu |
| AdSense kontrole | Postojeći test pokriva nezavisne prekidače, zaštitu admina, blokirane/nepopunjene ručne oglase i sprečavanje dupliranja SDK-a |

Pokrenuti su produkcioni build, `tests/google-tag-integration.mjs` i `tests/adsense-integration.mjs`. Google skripte su u browser testovima presretnute lokalno. Nisu slati stvarni GA4 događaji, zahtevi za oglase ni klikovi Google-u. Ovi testovi potvrđuju aplikacioni kod i HTML; ne potvrđuju da Google prima podatke niti da će odobriti nalog.

## Otvorene provere pre prijave / u nalogu

1. **Saglasnost za oglase i Analytics.** Standardni tag sam ne pruža CMP, dijalog za saglasnost ili povezivanje Consent Mode signala. U repozitorijumu nema te integracije. Google poruka može biti podešena van repozitorijuma, pa njen stvarni status nije utvrđen. Za EEA, UK i Švajcarsku proveriti objavljenu Google-sertifikovanu CMP poruku u AdSense → Privatnost i poruke. Proveriti i da analitički kolačići poštuju izbor korisnika; AdSense poruka i Analytics postavke ne treba da se smatraju automatski povezanim. Politika privatnosti nije zamena za tu funkcionalnost.
2. **AdSense nalog i domen.** U Sites proveriti tačan domen, povezivanje naloga i eventualne zahteve/razloge odbijanja. Status naloga, identitet/starost vlasnika, podržana zemlja i interna Google procena nisu dostupni kroz ovaj repozitorijum.
3. **Produkcioni deployment.** Posle objave proveriti izvor početne i jedne kategorije/pozivnice, javni `/ads.txt`, HTTPS i pristup Google crawlerima. Posebno proveriti Cloudflare pravila/WAF/challenge ako Google prijavi da ne može da pristupi sajtu. Lokalni robots test ne dokazuje da je produkcioni WAF propustio Google bota.
4. **Analytics prijem.** Potvrditi Web data stream za `G-802HKT7NMR`, domen i prikaz kroz Tag Assistant/Realtime uz odgovarajući izbor saglasnosti i isključene blokatore. Obuhvat automatskog merenja, Google Signals i retention podešavaju se u Google nalogu; ovde nisu potvrđeni.
5. **Sadržaj i prava.** Funkcionalan alat, različiti šabloni i četiri praktična vodiča postoje. Google sam procenjuje korisnost i originalnost; broj stranica i tagovi nisu dokaz da je taj kriterijum zadovoljen. Licence lokalnih fontova sačuvane su u izvorima kolekcija, ali prava na sve korisnički dostavljene pozadine treba da potvrdi vlasnik. Proveriti i da kontakt sanduče zaista prima poštu; ovde nije poslata test poruka.

Google Analytics nije uslov za prijem u AdSense. `ads.txt` i ispravno postavljeni kodovi pomažu tehničkom povezivanju, ali ne garantuju odobrenje, određeni rok odobrenja ili određeni broj prikazanih oglasa.

## Granice provere i korisni linkovi

Pristup javnom sajtu i Google dokumentaciji iz ovog cloud okruženja odbijen je na mrežnom proxy-ju sa CONNECT 403. To nije odgovor origin servera sajta. Aktivni Cloudflare deployment, podešavanja Google naloga, CMP ponašanje uživo i sadržaj najnovijih pravila nisu mogli biti potvrđeni ovom proverom.

- [AdSense programska pravila](https://support.google.com/adsense/answer/48182)
- [Uslovi za korišćenje AdSense-a](https://support.google.com/adsense/answer/9724)
- [Google zahtevi za sertifikovane CMP platforme](https://support.google.com/adsense/answer/13554116)
- [Google Consent Mode dokumentacija](https://developers.google.com/tag-platform/security/guides/consent)
- [Tag Assistant](https://tagassistant.google.com/)
