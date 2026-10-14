# Napravi pozivnicu

Sajt za domen `napravipozivnicu.com`, na srpskom (latinica), sa svetlim izgledom i rasporedom prvenstveno prilagođenim telefonu. Početna strana vodi preko glavnog dugmeta „Napravi pozivnicu“ u zaseban meni kategorija na `/pozivnice/`. Javni editor obrađuje tekst i fotografije u pregledaču. Admin šabloni koriste Cloudflare Pages Functions, D1 i R2; prijava administratora ide kroz Cloudflare Access. Posetioci nemaju naloge, plaćanje ili oglase.

## Pokretanje

Potreban je Node.js 24 (provereno sa 24.19.0) i npm.

```sh
cd /workspace/napravipozivnicu
npm ci --cache /workspace/.npm-cache
npm run dev -- --port 5173
```

Produkcijska verzija:

```sh
npm run build
npm run preview -- --port 4173
```

Cloudflare Pages objavljuje sadržaj direktorijuma `dist/` iz grane `main`; podešavanja su u `HOSTING.md`. Fontovi i biblioteke se isporučuju sa sajtom. Node.js služi za izgradnju; javni HTML i zaštićen admin API izvršavaju se kao Cloudflare funkcije. Aktivacija baze, prostora za datoteke i prijave opisana je u [ADMIN-SETUP.md](ADMIN-SETUP.md).

## Brzina učitavanja

- `vite.config.js` pri izgradnji pretvara početnu stranu, `/pozivnice/`, kategorije i detalje dizajna u gotov HTML. Naslovi, katalog i odgovori na pitanja dostupni su pre izvršavanja JavaScript-a. Početna strana ne čita D1 katalog.
- `src/main.js` učitava editor iz `src/editor.js`, njegov CSS i fontove pozivnica tek nakon izbora dizajna. PDF biblioteka se učitava samo pri izvozu PDF-a. Interfejs koristi lokalni Manrope sa latinicom i srpskim dijakriticima.
- Pregledi novih dizajna su mali WebP fajlovi sa odloženim učitavanjem; raspored i sopstveni fontovi preuzimaju se tek pri otvaranju editora. Ugrađeni pregledi crtaju se kada priđu vidljivom delu stranice; do 24 nacrtana pregleda čuvaju se za ponovno filtriranje.
- Editor ponovo koristi površinu za crtanje i spaja izmene unutar jednog kadra. Dimenzije izvoza ostaju 1500 × 2100 px.
- `public/_headers` omogućava dugotrajno keširanje datoteka sa verzionisanim nazivima u `/assets/`; HTML se ponovo proverava pri poseti. Cloudflare Pages primenjuje ova pravila pri objavi.

Produkcijski test ograničava početni JavaScript na manje od 10 KB gzip i proverava odloženo učitavanje. Ovo nije ograničenje ukupne veličine stranice: CSS, fontovi i kasnije učitan editor mere se odvojeno.

## Funkcije

- Šest kategorija: 1. rođendan, 18. rođendan, ostali rođendani, venčanje, krštenje, rođenje deteta.
- Dvanaest probnih šablona, filtriranje i pretraga.
- Editor naslova, imena, poruke, datuma, vremena i mesta proslave sa pregledom uživo.
- JPG/PNG/WebP fotografija do 15 MB, kružni okvir, pomeranje prevlačenjem ili klizačima i uvećanje.
- Izbor fonta i pozadine; boja teksta se prilagođava kontrastu.
- Besplatan PNG 1500 × 2100 px i PDF 127 × 177,8 mm sa slikom u 300 dpi, bez vodenog žiga.
- Nacrt teksta u lokalnom skladištu pregledača. Fotografija ostaje u memoriji i ne čuva se u nacrtu.
- Podrška za tastaturu, modalni editor i smanjeno kretanje prema podešavanju uređaja.
- Animirani glavni poziv na akciju, lebdeći pregledi, postepeno pojavljivanje sekcija i prelazi između stranica u pregledačima koji ih podržavaju. Na telefonu dugme za početak ostaje dostupno i pri skrolovanju početne strane.

PDF je za štampu u stvarnoj veličini (100%), bez prepusta i oznaka za sečenje. Za štampariju koja zahteva prepust potrebno je naknadno dodati taj format.

## Admin šabloni

Panel `/admin/sabloni/` ima listu, pretragu, nacrte, objavljene verzije, dupliranje, brisanje, pregled i probni izvoz. Pozadine su PNG/JPG/WebP; fontovi WOFF2/WOFF/TTF/OTF. Tekst i okvir fotografije pomeraju se na platnu ili preko koordinata. Dostupni su font, veličina, boja, poravnanje, razmak slova/redova, bold, italic, underline, uppercase, rotacija, vidljivost, senka, kontura, sjaj, izdignut tekst i gradijent. Slojevi imaju promenu redosleda, kopiranje i undo/redo. Podržan je jedan okvir za fotografiju i do 32 elementa po šablonu.

`Sačuvaj nacrt` ne menja javnu verziju. `Objavi` čuva snimak dizajna, označava njegove datoteke kao javne i uključuje ga u katalog/SEO. Verzije sprečavaju prepisivanje promena iz drugog prozora. `Povuci sa sajta` zadržava nacrt. Objavljene datoteke mogu ostati u kešu i nakon povlačenja.

Probni dizajni mogu da se sakriju ili pretvore u svoje šablone kroz `Uredi primer`. Objavljena prerada zamenjuje odgovarajući primer.

Za lokalni razvoj celog panela:

```sh
npm run dev:admin
```

Otvori `http://127.0.0.1:5180/admin/sabloni/`. Koristi stvarni kompajlirani Worker, lokalne D1/R2 i test potpisanu Access prijavu. Server sluša isključivo localhost; test identitet ne postoji u produkcijskom kodu. Lokalni podaci su u ignorisanom `.dev-data/`. `npm run preview` prikazuje statičke javne stranice i ne izvršava zaštitu niti API; za proveru produkcijskog ponašanja koristi `dev:admin`.

## SEO

Svih šest kategorija i svaki dizajn imaju zasebnu HTML stranicu. Naslovi, opisi, canonical, Open Graph, JSON-LD i sitemap prate objavljene šablone. Admin, API i `pages.dev` pregledi nisu namenjeni indeksiranju. `src/seo-content.js` sadrži tekstove kategorija, a `src/seo.js` generiše metapodatke. Server vraća isti katalog koji posetilac vidi; samo objavljene verzije dostupne su javno.

Build čuva statičke primerke osnovnih stranica, a Worker dodaje objavljene šablone pri zahtevu. Za nove šablone ne treba ponavljati build. Prijava i baze moraju se aktivirati prema `ADMIN-SETUP.md`.

## Provere

```sh
npm run build
npm test
npm run test:production
npm run test:admin
```

Test koristi instalirani Chromium iz `/usr/bin/chromium` (drugu lokaciju postavi kroz `CHROMIUM_PATH`). Sam pokreće Vite na portu 5175 i gasi svoj server po završetku. Proverava prelaz sa početne strane u katalog i povratak, svih šest kategorija, pretragu, editor, fotografiju, prevlačenje i zumiranje, vraćanje nacrta, stvarne PNG/PDF datoteke i njihove dimenzije, prikaze na 320/390/768/1440 px, mobilni meni, zatvaranje tastaturom, smanjeno kretanje i greške pregledača. Testne slike i PDF su u `/tmp/`.

Produkcijski test pokreće zaseban preview na portu 5178. Proverava gotov HTML bez JavaScript-a, budžet početnog koda, odloženo učitavanje editora/PDF-a, pojavljivanje pregleda pri skrolovanju, filtriranje i ispravnost ponovljenog crtanja editora.

Admin test koristi kompajlirani Worker u Miniflare okruženju, stvarnu lokalnu D1/R2 i potpisane test JWT tokene. Proverava zaštitu, CSRF, privatne datoteke, fontove, nacrt/objavu, konflikte verzija, javni editor/izvoz, povlačenje, probne dizajne i mobilni prikaz. Sam pokreće lokalni server na portu 5181 i gasi ga nakon provere.

## Pre javnog lansiranja

Ubaciti konačne šablone. AdSense integracija je ostavljena za kasnije; trenutno nema reklamnih skripti, analitike ni kolačića za praćenje. Ako se uvedu oglasi, dodati odgovarajuće informacije o privatnosti i saglasnost za oglase prema njihovim zahtevima.
