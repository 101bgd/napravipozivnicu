# Šest pozivnica za rođenje deteta

Vlasnik je dostavio šest PNG pozadina u arhivi `Rodjenje deteta.zip`. Arhiva sadrži samo slike, bez pratećih tekstualnih instrukcija. Originali od 1060 × 1484 px ostaju neizmenjeni u `sources/`; `sources.json` beleži originalne nazive, dimenzije, veličine i SHA-256 vrednosti.

| Original | Dizajn | Tipografija i raspored |
| --- | --- | --- |
| 1 | Zvezda našeg neba | Svetli rukopis na tamnoplavom nebu; diskretna tamna kontura čuva čitljivost podataka preko oblaka |
| 2 | Rodin mali dar | Kaligrafsko ime i maslinastozeleni podaci ispod rode |
| 3 | Mali konjić, velika radost | Zaobljeno plavo ime; tekst u desnom krem prostoru pored bodića i konjića |
| 4 | Cvet naše porodice | Tamnoružičasto kaligrafsko ime i levi blok podataka pored božura |
| 5 | Prvi mali koraci | Krupno klasično ime, smeđi tonovi i rukopisna završna poruka levo od patofnica |
| 6 | Kolevka puna ljubavi | Rukopisno ime iznad kolevke; datum, vreme i adresa u zasebnom desnom bloku |

Svi dizajni pripadaju kategoriji `baby` i nemaju sloj za ličnu fotografiju. Bebe na pozadinama 1 i 4 deo su dostavljene ilustracije. Uređuju se ime deteta, uvod, poruka, datum, vreme, adresa proslave i potvrda dolaska, a dizajni 5 i 6 imaju i završnu poruku. Podrazumevani podaci su primeri: 24. april 2027. u 16 časova, sa rokom potvrde 17. aprila. Datum označava proslavu i može da se promeni.

## Slike i fontovi

`prepare.mjs` kodira WebP pozadine u originalnim dimenzijama, kvalitetom 0,92, i preglede 500 × 700 px kvalitetom 0,86. Stvarni renderer aplikacije pravi preglede i primerke za preuzimanje. Pozadine imaju 108–218 KB i manje su 90,2–94,3% od originala; pregledi imaju 21–38 KB. Precizne veličine i putanje su u `report.json`.

Ponovo se koriste postojeći lokalni Baloo 2, Napravi Rukopis (podskup Marck Script sa preimenovanom porodicom) i Great Vibes, kao i ugrađeni DM Sans i Libre Caslon Display. Izvori i OFL licence ostaju u postojećim kolekcijama `birthday-batch`, `baptism-batch` i `wedding-batch`. Svaki dizajn navodi samo sopstveni font koji zaista koristi; fontovi i velika pozadina učitavaju se tek pri otvaranju editora. Nema novih zavisnosti ili spoljnih font zahteva.

PNG izvoz je 1500 × 2100 px; PDF sadrži taj raster u formatu 127 × 177,8 mm. Izvoz ne dodaje detalje originalnoj ilustraciji i nema automatski prepust za štampariju. Oglasi nisu deo preuzete pozivnice.

```sh
node content/baby-batch/prepare.mjs
npm run build
node tests/browser-smoke.mjs
node tests/production-smoke.mjs
node tests/admin-integration.mjs
node tests/adsense-integration.mjs
```

Priprema koristi lokalni Vite i Chromium. `asset-ids.json` čuva stabilne identifikatore; javne slike imaju hash sadržaja u nazivu. Generisani registri su `src/baby-assets.js` i `src/baby-catalog.js`, a rasporedi u `designs.mjs`. Primeri PNG/PDF izlaze van repozitorijuma, u `/workspace/artifacts/baby-batch/`. Posle izmene rasporeda ponoviti pripremu i ukloniti samo nereferencirane preglede ove kolekcije.

## Administracija, SEO i oglasi

U **Admin → Gotovi dizajni → Uredi dizajn** može da se promeni pozadina, font, raspored, tekst i SEO metapodaci. Uređivanje pravi privatnu kopiju sredstava i nacrt; objava zamenjuje dizajn na istoj adresi.

Svaki dizajn ima svoju opisnu adresu, jedinstven SEO naslov i opis, vidljiv opis ilustracije i alt tekst. Postojeći generator i Worker uključuju stranice u kategoriju, interne linkove, sitemap, canonical, Open Graph/Twitter i JSON-LD sa ImageObject i breadcrumbs. Adresa kategorije `/pozivnice-za-rodjenje-deteta/` ostaje ista, uz ažuriran naslov, uvod, primer poruke i savet za proslavu i babine. [seo-research.md](seo-research.md) navodi proverene granice istraživanja ključnih reči.

Sve nove stranice nasleđuju jedan globalni AdSense blok i postojeća podešavanja u **Admin → AdSense reklame**. Nije potrebno ponovo unositi kod. Bez aktivnih podešavanja blok je sakriven. AdSense test proverava sve javne stranice sa uključenim i isključenim oglasima koristeći simulirani SDK, bez stvarnih zahteva Google oglasima.
