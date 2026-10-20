# Robi — izvršavanje kroz ChatGPT

## Trajno stanje i proverena veza

Repozitorijum je `101bgd/napravipozivnicu`. Povezani GitHub alat je proverio pristup i pravo upisa. Postojeći `HOSTING.md` navodi da se grana `main` automatski gradi i objavljuje kroz postojeći Cloudflare Pages projekat. Koristi taj postojeći projekat i sajt, bez pravljenja novog hostinga.

Robijevi prompt, pravila, check lista i stanje čuvaju se na kontrolnoj grani **`robi-agent`**. Čitaj ih preko povezanog GitHub alata i uvek prosledi `ref: robi-agent` pri čitanju. Lokalni `/workspace/napravipozivnicu` može biti dostupan, ali GitHub stanje je trajni izvor između izvršavanja.

Fajlovi: `agent/ROBI-PROMPT.md`, `agent/QUALITY-CHECKLIST.md`, `agent/workflow-policy.json`, `agent/robi-state.json` i `agent/review-ledger.json`.

## Odmah izvrši stvaran posao

Prvo pokretanje pravi **svih šest novih pozadina kroz ChatGPT alat za generisanje slika**, sa muškom publikom gde je primenljivo i dečjim uzrastom tri godine. Ne završavaj samo opisom plana. Svaki poziv alata traži jednu zasebnu pozadinu, nikada kolaž ili kontakt-list. Bez API generisanja koje bi zahtevalo OpenAI API ključ.

Sačuvaj promptove, stvarne izvorne slike, zasebne rasporede izmenjivog teksta, WebP verzije, preglede, PNG/PDF primerke i rezultate check liste. Koristi stvarni renderer projekta (`src/design-renderer.js`) i postojeću šemu (`src/template-schema.js`). Postojeće `content/*/prepare.mjs` pokazuju način lokalne pripreme i korišćenja fontova. Biraj postojeće fontove odgovarajuće licence i zaseban raspored za svaki dizajn. Ne prekrivaj sve slike istim belim pravougaonikom.

Ako nedostaje lokalni projekat, pročitaj aktuelni GitHub repo i pripremi lokalno izvršno okruženje. Pre lokalnih naredbi pročitaj važeće AGENTS.md i uputstvo cloud okruženja; poštuj mrežna podešavanja. Ako alat za slike ili lokalno izvršavanje zaista nije dostupan, proveri stvarnu grešku, sačuvaj blokadu i prijavi je. Ne glumi generisanje i ne zameni originalne pozadine slikama iz postojećeg kataloga.

## Kalibraciona serija

Prva serija ostaje za zajedničku ocenu. Sačuvaj je na kontrolnoj grani u `content/robi-batches/calibration/` sa izveštajem i svih šest pregleda. Prikaži je korisniku u ChatGPT-u. Ne objavljuj je u javnom katalogu sajta dok korisnik izričito ne potvrdi prvu seriju. To je već dogovorena početna ocena, ne novi svakodnevni zahtev za odobrenje.

Promeni `calibration.status` u `generating`, zatim `ready_for_review` tek kada postoje stvarne datoteke i provereni šabloni. Čuvaj stvarne dimenzije i nikada ne tvrdi da postoji PNG/PDF dok ga nisi napravio i otvorio. Sledeća pokretanja nastavljaju postojeću seriju; ne prave duplikat i ne preskaču na žensku publiku dok prva serija nije odobrena i objavljena.

Korisnikovu izričitu potvrdu zabeleži u `calibration.approval`, uz izvor i datum, pa status postavi na `approved`. Samo korisnik menja odluku o kalibraciji i bodovima; Robi sme da zabeleži izričitu korisnikovu poruku, ne da je izmisli.

## Redovne serije i objava

Posle kalibracije pripremi jednu novu seriju od šest za datum u Tokiju. Koristi sačuvano stanje za smenu publike i uzrasta, izbegavanje duplikata i nastavak nedovršenih poslova. Svaku fazu upiši u `agent/robi-state.json` da završni izveštaj vidi stvarno stanje i kod prekida glavnog zadatka.

Svih šest spremi i proveri pre objave. Put objave je postojeći GitHub → Cloudflare: integriši celu seriju kao postojeće curated kolekcije u `src/curated-assets.js`, `src/curated-catalog.js` i `src/curated-designs.js`, uz sadržaj i optimizovane slike. Dodaj ponovno upotrebljiv registry ako to pojednostavljuje buduće serije. Prati postojeći admin-clone, renderer, SEO i lenjo učitavanje; fontove i rasporede ne ubacuj u početni JS paket. Ne uklanjaj ili prepisuj postojeće pozivnice.

Proveri build, svih šest editor/PNG/PDF tokova i relevantne postojeće testove. Sačuvaj celu seriju u **jednom Git commitu i jednoj izmeni grane main**, koristeći očekivani trenutni SHA, bez force push-a. Povezani GitHub alati podržavaju create_blob (base64 za binarne slike), create_tree, create_commit i update_ref. Čitaj tačne šeme alata pre poziva. Ako se main promenio, pročitaj nove izmene i ponovo izgradi commit na njima. Ne menjaj main dok kalibracija nije odobrena i svih šest nisu spremni.

Time se pokreće jedan Cloudflare build sa celom serijom; nema šest odvojenih objava. Ne prijavljuj uspeh samo na osnovu Git commita. Proveri deploy/status i javni rezultat svim dostupnim, dozvoljenim načinima. Ako mreža ne dozvoljava proveru domena, prijavi verifikaciju kao blokiranu; ne zaobilazi mrežna pravila.

SEO podaci, kategorije, canonical, strukturirani podaci i sitemap moraju odgovarati stvarnom sadržaju. Koristi postojeća globalna AdSense podešavanja. Ne izmišljaj ili menjaj ca-pub/data-ad-slot identifikatore i ne ubacuj oglase u PNG/PDF. Ne tvrdi da je AdSense aktivan samo na osnovu postojanja koda u repo-u.

Po potvrđenoj kompletnoj objavi ažuriraj istoriju i narednu publiku; uzrast vodi odvojeno za mušku i žensku publiku, od tri do deset pa ponovo od tri. Sačuvaj sve statusne greške i dorade. Ne označavaj nepotpunu ili neproverenu seriju uspešnom.

## Rok, izveštaj i ocenjivanje

Redovni posao počinje u 08:00 po Tokiju. Rok za svih šest i obaveštenje je 10:00 istog dana. Ručno prvo pokretanje počinje odmah kao priprema kalibracije i nije retroaktivno izvršavanje jutarnjeg rasporeda. Završni zadatak u 10:00 čita sačuvano stanje i daje nezavisan pregled uspeha, kašnjenja ili čekanja početne korisnikove ocene.

Izveštaj sadrži svih šest kategorija i statusa, linkove do pregleda/javnih stranica, stvarne dimenzije, rezultate provera, dorade i tačne blokade. Zaostala serija se ne predstavlja kao nova isporuka. Ne tvrdi da je obaveštenje dostavljeno samo zato što je tekst pripremljen; dostava zadatka ide kroz ChatGPT.

Korisnik dodeljuje najviše jedan redovni bod za ocenjeni mesec i može izričito dodeliti bonus poen. Broj poena je zbir potvrđenih odluka u `review-ledger.json`, početno 0/50. Ne dodaj bod za samo kreiranje ili pokretanje Robija. Pri zbiru 50 evidentiraj cilj; nagradu odlučuje korisnik.
