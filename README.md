# Napravi pozivnicu

Sajt za domen `napravipozivnicu.com`, na srpskom (latinica), sa svetlim izgledom i rasporedom prvenstveno prilagođenim telefonu. Početna strana vodi preko glavnog dugmeta „Napravi pozivnicu“ u zaseban meni kategorija na `/pozivnice/`. Javni editor obrađuje tekst i fotografije u pregledaču. Admin šabloni koriste Cloudflare Pages Functions, D1 i R2; prijava administratora ide kroz Cloudflare Access. Posetioci nemaju naloge ni plaćanje. AdSense blokovi su pripremljeni na svim javnim stranicama, a oglasi su isključeni dok se ne podese u adminu.

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
- Deset pozivnica za prvi rođendan: safari, vozić, labudovi, vila, kit, psić pilot, meda na Mesecu, dve varijante zeke u balonu i trešnjice. Bez fotografije, sa čitljivim razigranim/rukopisnim fontovima i izmenjivim imenom, brojem, datumom, vremenom, lokacijom i potvrdom dolaska. Pozadine su 88–95% manje uz iste dimenzije; [priprema i SEO istraživanje](content/first-birthday-batch/README.md). Nove stranice koriste ista globalna AdSense podešavanja iz admina.
- Šest preostalih probnih šablona; pretraga po nazivu, kategoriji i opisu. Meni kategorija koristi obične linkove do zasebnih landing stranica, dostupne i bez JavaScript-a.
- Četiri dečje pozivnice u kategoriji Rođendani: Dino avantura, Svemirska misija, Mala sirena i Čarobni ringišpil. Imaju izmenjivo ime i godine, razigrane fontove Baloo 2/DynaPuff i nemaju okvir za fotografiju. Pozadine su 86–92% manje od originala, uz iste dimenzije.
- Četiri svečane pozivnice za krštenje: Anđeoski blagoslov, Golubica mira, Put svetlosti i Svetlost krštenja. Bez fotografije, sa odvojenim detaljima obreda i proslave, serifnim i kaligrafskim fontovima za srpsku ćirilicu i latinicu. Pozadine su 86–91% manje; priprema i licence opisane su u [content/baptism-batch/README.md](content/baptism-batch/README.md).
- Tri pozivnice za 18. rođendan i punoletstvo: Disko sjaj, Saten i biseri i Zlatni trenutak. Bez fotografije, sa velikim brojem 18, izmenjivim imenom i potvrdom dolaska. Koriste postojeće lokalne fontove; pozadine su 90–95% manje. Detalji i ograničenje istraživanja ključnih reči su u [content/eighteen-batch/README.md](content/eighteen-batch/README.md).
- Gotova pozivnica za venčanje „Ponoćna elegancija“, bez fotografije, sa zasebno izmenjivim imenima, kaligrafskim fontom i optimizovanom WebP pozadinom. Dostupna je i kada su probni šabloni sakriveni.
- Još osam pozivnica za venčanje: Zavet u prirodi, Maslinov zavet, Zlatna obala, Beli cvet i zlato, Veče pod fenjerima, Smaragdni zavet, Šapat božura i Pismo ljubavi. Bez fotografije, sa zasebnim imenima i podacima ceremonije i restorana. Koriste postojeće lokalne fontove; pozadine su 84–88% manje uz sačuvane dimenzije. Priprema, poreklo i ograničenje SEO istraživanja su u [content/wedding-collection/README.md](content/wedding-collection/README.md).
- Editor naslova, imena, poruke, datuma, vremena i mesta proslave sa pregledom uživo.
- JPG/PNG/WebP fotografija do 15 MB, kružni okvir, pomeranje prevlačenjem ili klizačima i uvećanje.
- Izbor fonta i pozadine; boja teksta se prilagođava kontrastu.
- Izbor ćirilice ili latinice za naziv meseca u datumu sopstvenih šablona, u javnom editoru i adminu; izbor ostaje sačuvan u nacrtu i pri objavljivanju.
- Besplatan PNG 1500 × 2100 px i PDF 127 × 177,8 mm sa slikom u 300 dpi, bez vodenog žiga.
- Nacrt teksta u lokalnom skladištu pregledača. Fotografija ostaje u memoriji i ne čuva se u nacrtu.
- Podrška za tastaturu, modalni editor i smanjeno kretanje prema podešavanju uređaja.
- Animirani glavni poziv na akciju, lebdeći pregledi, postepeno pojavljivanje sekcija i prelazi između stranica u pregledačima koji ih podržavaju. Na telefonu dugme za početak ostaje dostupno i pri skrolovanju početne strane.

PDF je za štampu u stvarnoj veličini (100%), bez prepusta i oznaka za sečenje. Za štampariju koja zahteva prepust potrebno je naknadno dodati taj format.

## Admin šabloni

Panel `/admin/sabloni/` ima listu, pretragu, nacrte, objavljene verzije, dupliranje, brisanje, pregled i probni izvoz. Pozadine su PNG/JPG/WebP; fontovi WOFF2/WOFF/TTF/OTF. Tekst i okvir fotografije pomeraju se na platnu ili preko koordinata. Dostupni su font, veličina, boja, poravnanje, razmak slova/redova, bold, italic, underline, uppercase, rotacija, vidljivost, senka, kontura, sjaj, izdignut tekst i gradijent. Slojevi imaju promenu redosleda, kopiranje i undo/redo. Podržan je jedan okvir za fotografiju i do 32 elementa po šablonu.

`Sačuvaj nacrt` ne menja javnu verziju. `Objavi` čuva snimak dizajna, označava njegove datoteke kao javne i uključuje ga u katalog/SEO. Verzije sprečavaju prepisivanje promena iz drugog prozora. `Povuci sa sajta` zadržava nacrt. Objavljene datoteke mogu ostati u kešu i nakon povlačenja.

Probni dizajni mogu da se sakriju ili pretvore u svoje šablone kroz `Uredi primer`. Objavljena prerada zamenjuje odgovarajući primer.

Sekcija **Gotovi dizajni → Uredi dizajn** otvara pripremljene javne dizajne, poput „Ponoćne elegancije“. Pozadina i font se kopiraju u zaštićene admin datoteke. Čuvanje nacrta ne menja javnu verziju; „Objavi“ je zamenjuje i zadržava adresu `/pozivnice/ponocna-elegancija/`. Metapodaci su u `src/curated-catalog.js`, raspored se učitava odvojeno, a javne datoteke sa verzionisanim nazivima isporučuje Cloudflare Pages bez R2 zahteva za ovu početnu verziju.

Dečji dizajni koriste isti postupak; SEO naslov i alt tekst mogu da se menjaju u panelu i ostaju sačuvani pri objavi. Uklanjanje sedam ranije navedenih pozivnica opisano je u [content/birthday-batch/README.md](content/birthday-batch/README.md): javni prikaz ih odmah izostavlja, a zaštićeni admin pri sledećem otvaranju završava jednokratno brisanje starih zapisa iz D1.

Za lokalni razvoj celog panela:

```sh
npm run dev:admin
```

Otvori `http://127.0.0.1:5180/admin/sabloni/`. Koristi stvarni kompajlirani Worker, lokalne D1/R2 i test potpisanu Access prijavu. Server sluša isključivo localhost; test identitet ne postoji u produkcijskom kodu. Lokalni podaci su u ignorisanom `.dev-data/`. `npm run preview` prikazuje statičke javne stranice i ne izvršava zaštitu niti API; za proveru produkcijskog ponašanja koristi `dev:admin`.

## SEO

Svih šest kategorija ima poseban landing page na postojećoj adresi: uvod i paletu za svoju priliku, animirane preglede trenutno objavljenih dizajna, dugme do izbora šablona na istoj stranici, primere teksta sa kopiranjem, praktične savete i pitanja. Svaki dizajn i dalje ima zasebnu HTML stranicu. Naslovi, opisi, canonical, Open Graph, JSON-LD i sitemap prate objavljene šablone. Admin, API i `pages.dev` pregledi nisu namenjeni indeksiranju. `src/seo-content.js` sadrži SEO metapodatke, `src/category-content.js` tekstove i izbor pregleda, `src/category-page.js` prikaz kategorija, a `src/seo.js` generiše metapodatke i strukturirane podatke. `CollectionPage`, `ItemList`, `BreadcrumbList` i `ImageObject` opisuju stvarno vidljiv sadržaj. Glavna slika kategorije ima prioritetno učitavanje i odgovara slici za deljenje. Katalog prosleđen editoru ograničen je na aktivnu kategoriju; editor, fontovi pozivnice i PDF kod ostaju odloženi. Server vraća isti katalog koji posetilac vidi; samo objavljene verzije dostupne su javno.

Animacije kategorija koriste CSS transformacije i providnost, bez dodatne biblioteke ili video fajlova. Pauziraju se izvan ekrana, na skrivenoj kartici i dok je editor otvoren. Posetilac može da ih pauzira, a sistemsko smanjeno kretanje ih isključuje. Obični linkovi rade i u pregledačima bez podrške za prelaze između dokumenata.

Build čuva statičke primerke osnovnih stranica, a Worker dodaje objavljene šablone pri zahtevu. Za nove šablone ne treba ponavljati build. Prijava i baze moraju se aktivirati prema `ADMIN-SETUP.md`.

## Informacije o sajtu

`/politika-privatnosti/`, `/o-sajtu/` i `/kontakt/` imaju zaseban gotov HTML, naslov, opis, canonical, strukturirane podatke i unose u sitemap. Povezane su iz podnožja na svim javnim stranicama i dostupne bez JavaScript-a ili prijave. Worker ih prikazuje bez čitanja kataloga iz D1.

Metapodaci i javna adresa `kontakt@napravipozivnicu.com` su u `src/info-content.js`, a tekst u `src/info-page.js`. Stranice se predstavljaju u ime brenda Napravi pozivnicu, bez imena i prezimena vlasnika. Kontakt koristi običan `mailto:` link; aplikacija ne šalje mejl niti prikuplja podatke preko kontakt forme. Dostava mejla zavisi od podešavanja mejl usluge za domen.

Politika privatnosti opisuje obradu u javnom editoru, lokalni nacrt, Cloudflare, kontakt poruke i opcione AdSense oglase, uz veze ka Google pravilima i podešavanjima privatnosti. Datum teksta je 16. oktobar 2026. Google Analytics nije uključen.

## AdSense reklame

U `/admin/sabloni/` kliknuti **AdSense reklame** (direktno `/admin/sabloni/#adsense`), nalepiti kod prilagodljive prikazne reklamne jedinice iz Google AdSense naloga, uključiti prikaz i sačuvati. Podešavanja se čuvaju u postojećoj tabeli D1 `settings`, pod ključem `adsense`; nova migracija i ponovno objavljivanje nisu potrebni. Isti blok nalazi se pre podnožja na početnoj strani, katalogu, šest kategorija, svim stranicama pozivnica i stranicama o sajtu/privatnosti/kontaktu. Ne pojavljuje se u adminu, editoru, izvozu, na `pages.dev` ili drugim preglednim domenima.

Sistem iz koda prepoznaje jedan `ca-pub-` identifikator (16 cifara) i jednu `data-ad-slot` jedinicu (10 cifara). Čuvaju se samo ti identifikatori i prekidač. Proizvoljni HTML i JavaScript iz nalepljenog teksta se ne izvršavaju. Sačuvan kod ostaje dostupan u adminu u standardnom Google formatu. Za proveru vlasništva može se sačuvati samo kod naloga, sa isključenim prikazom; na javnom domenu se tada dodaje `google-adsense-account` meta oznaka. `/ads.txt` se automatski generiše iz sačuvanog naloga.

Oglasi su podrazumevano isključeni i ne zauzimaju prostor. Kada su uključeni, prostor je rezervisan na serveru, a Google SDK se učitava tek kada blok priđe vidljivom delu stranice. Nepopunjeni ili blokirani oglasi se sakrivaju. Glavna dugmad i sadržaj pozivnica ostaju odvojeni od oglasa. Neuspešno čitanje podešavanja izostavlja oglase umesto da prekine javnu stranicu.

Google odlučuje o odobrenju naloga i isporuci oglasa. Poruke za saglasnost za regione gde su potrebne podešavaju se u **AdSense → Privatnost i poruke**, korišćenjem Googleove sertifikovane poruke/CMP-a. Ova aplikacija ne zamenjuje sertifikovani CMP sopstvenim banerom.

## Provere

```sh
npm run build
npm test
npm run test:production
npm run test:admin
npm run test:adsense
node tests/category-landings.mjs # nakon build-a
```

Test koristi instalirani Chromium iz `/usr/bin/chromium` (drugu lokaciju postavi kroz `CHROMIUM_PATH`). Sam pokreće Vite na portu 5175 i gasi svoj server po završetku. Proverava prelaz sa početne strane u katalog i povratak, navigaciju do svih šest kategorija, pretragu, editor, fotografiju, prevlačenje i zumiranje, vraćanje nacrta, stvarne PNG/PDF datoteke i njihove dimenzije, prikaze na 320/390/768/1440 px, mobilni meni, zatvaranje tastaturom, smanjeno kretanje i greške pregledača. Testne slike i PDF su u `/tmp/`.

Produkcijski test pokreće zaseban preview na portu 5178. Proverava gotov HTML bez JavaScript-a, budžet početnog koda, odloženo učitavanje editora/PDF-a, pojavljivanje pregleda pri skrolovanju, filtriranje i ispravnost ponovljenog crtanja editora.

Admin test koristi kompajlirani Worker u Miniflare okruženju, stvarnu lokalnu D1/R2 i potpisane test JWT tokene. Proverava zaštitu, CSRF, privatne datoteke, fontove, nacrt/objavu, konflikte verzija, javni editor/izvoz, povlačenje, probne dizajne i mobilni prikaz. Sam pokreće lokalni server na portu 5181 i gasi ga nakon provere.

AdSense test koristi stvarni lokalni Worker/D1 i Chromium, uz presretnut Google SDK. Proverava sve javne stranice, proveru naloga bez prikaza oglasa, validaciju i zaštitu podešavanja, bezbedno prepoznavanje identifikatora, `ads.txt`, odloženo i jednokratno učitavanje, skrivanje blokiranih/nepopunjenih oglasa i admin formu na 320–1440 px. Ne šalje stvarne zahteve za oglase Google-u.

## Pre javnog lansiranja

Ubaciti konačne šablone. Za oglase dodati stvarni AdSense kod u zaštićeni panel i podesiti potrebne Google poruke o saglasnosti. Analitika nije uključena; pri dodavanju novih usluga uskladiti Politiku privatnosti sa stvarnom obradom.

Test `tests/category-landings.mjs` koristi kompajlirani Worker i proverava šest kategorija bez JavaScript-a, metapodatke i sitemap, trenutno objavljene hero preglede, 24 kombinacije kategorije i širine ekrana, početni JS ispod 10 KB gzip, odloženo učitavanje editora, pretragu unutar kategorije, tastaturu, povratak u pregledaču, stvarno kopiranje primera teksta, pauzu animacija i smanjeno kretanje. SEO provere potvrđuju tehničku dostupnost sadržaja; ne garantuju indeksiranje ili pozicije na Google-u.
