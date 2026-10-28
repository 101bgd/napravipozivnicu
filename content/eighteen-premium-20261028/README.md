# Dve premium pozivnice za 18. rođendan — 28. oktobar 2026.

Korisnikov arhiv `Pozivnica za 18. rodjendan 1.zip` sadrži dve PNG pozadine, obe 1060 × 1484 px. `sources/original-1.png` i `sources/original-2.png` zadržavaju identičan sadržaj iz arhiva; SHA-256 vrednosti i mere optimizacije nalaze se u `report.json`. Slike iz poruke služe kao inspiracija za tipografiju i kompoziciju, nisu ugrađene kao dodatne pozadine.

| Dizajn | Raspored i stil | Javna stranica |
| --- | --- | --- |
| Bordo gala | Bordo svileni talasi i zlatne čestice; veliki poluprovidni 18, uspravni kaligrafski natpis, svetlo ime i razdvojeni datum/vreme. Završni podaci su pomereni desno od najsvetlijeg zlata. | `/pozivnice/pozivnica-za-18-rodjendan-bordo-zlatni-talasi/` |
| Oniks potpis | Krem papir, crna mašna i broš; kaligrafsko ime, tamni veliki 18 i svečani serif. Podaci su iznad donjeg ornamenta. | `/pozivnice/pozivnica-za-punoletstvo-crna-masna-zlatni-ornamenti/` |

Oba dizajna su u kategoriji `eighteen`, bez sloja ili okvira za fotografiju. Ime, poruka, povod/broj, datum, vreme, lokacija i potvrda dolaska se uređuju. Imena koriste postojeći `fitToWidth` kako bi duži unos ostao u namenjenom prostoru. Diskretne ukrasne linije i oznake DATUM/POČETAK nisu izložene kao polja za unos. Posebno su provereni dugi srpski nazivi i dijakritici.

## Datoteke i priprema

- `metadata.json` je zajednički izvor naziva, slugova, motiva, opisa i alt tekstova. Naslovi se formiraju kroz `buildTemplateTitle`, kako nalaže root `AGENTS.md`.
- `designs.mjs` sadrži sve tekstualne slojeve. `src/eighteen-premium-catalog.js` izdvaja samo javne metapodatke; raspored, velike pozadine i fontovi učitavaju se tek pri otvaranju editora.
- `asset-ids.json` čuva stabilne UUID oznake i datum pripreme publikacije. `prepare.mjs` generiše verzionisane WebP datoteke, javni `src/eighteen-premium-assets.js`, mere i PNG/PDF dokaze. Obrada ne retušira i ne izrezuje ilustracije.
- Ponovo se koriste lokalni Cormorant Garamond 500 iz `content/baptism-batch/fonts/` i Great Vibes iz `content/wedding-batch/fonts/`, uz njihove postojeće SIL OFL licence. Za male oznake koristi se postojeći DM Sans. Nema nove font zavisnosti ni zahteva ka spoljnom font servisu.
- WebP pozadine imaju iste dimenzije kao originali. Bordo pozadina: 2.202.950 → 295.152 bajta (86,6% manje); krem: 2.607.117 → 414.990 bajta (84,1% manje). Pregledi sa konačnim tekstom imaju oko 61/52 KB i 500 × 700 px, sa odloženim učitavanjem.

```sh
node content/eighteen-premium-20261028/prepare.mjs
npm run build
node tests/eighteen-premium.mjs
```

Priprema koristi lokalni Vite na portu 5196 i instalirani Chromium. Dokazi izlaze u `/workspace/artifacts/eighteen-oct28/`, van repozitorijuma. PNG izvoz je 1500 × 2100 px; PDF je 127 × 177,8 mm. Izvorne pozadine imaju 1060 × 1484 px, pa uvećanje ne dodaje izvorne detalje; PDF je rasterski i nema automatski prepust/CMYK konverziju.

## SEO i oglasi

Svaki šablon ima zasebnu opisnu adresu, H1/title, meta opis, alt tekst, ImageObject i breadcrumb podatke. Globalni sistem ga uključuje u kategoriju, katalog, povezane pozivnice i sitemap. Početna zadržava postojeće pravilo: prikazuje jedan najnoviji dizajn po kategoriji, pa ova objava tamo predstavlja Bordo gala; oba su dostupna u kategoriji i pretrazi. Datumi i postojeći URL-ovi drugih šablona ostaju nepromenjeni.

Svaka nova stranica nasleđuje jedan globalni AdSense blok i postojeća admin podešavanja, AdSense kod i Google tag. Ručni oglas je i dalje zavisan od sačuvanog `enabled`/`slotId`; kod ove objave ne izmišlja reklamnu jedinicu i ne uključuje je mimo podešavanja. Oglasi i kontrole editora nisu deo izvoza.

`seo-research.md` beleži pokušaje upoređivanja izraza „pozivnice za 18. rođendan“ i „pozivnice za punoletstvo“. Mrežni proxy nije omogućio pristup Google/Bing/Trends podacima; obim i prednost jednog izraza nisu potvrđeni. Oba sinonima su prirodno zastupljena, bez dupliranja stranica i bez obećanja o rangiranju ili indeksiranju.

## Kontrola kvaliteta

- Produkcioni build: prošao.
- `tests/eighteen-premium.mjs`: prošao; lokalni Worker/D1, obe kategorijske/SEO stranice i API, zaštićeni admin, upotrebljeni fontovi, izmena teksta/stila, nacrti i 320/390/1440 px bez horizontalnog prelivanja.
- Canvas pozivi potvrđuju da celo dugo ime ostaje unutar predviđenog prostora, uz smanjivanje fonta samo kada je potrebno. Stvarni PNG i PDF su provereni po formatu/dimenzijama, a ne samo po poruci o preuzimanju.
- AdSense/GA test potvrđuje po jednu skriptu i jedno mesto za oglas; test privremeno uključuje lokalnu reklamnu jedinicu kroz zaštićeni API i proverava obe nove stranice. Spoljni Google zahtevi su mockovani ili blokirani, pa nema stvarnih oglasa/poseta.
- Dva završna izvoza i mobilni/desktop prikazi vizuelno su pregledani. Datum, lokacija i RSVP su nakon korekcije rasporeda čitljivi i ne seku glavne ornamente.
- `tests/google-tag-integration.mjs` i `tests/template-titles.mjs`: regresione provere javnih stranica, preusmeravanja, sitemap-a, naslova, Google kodova i izvoza.

Testovi su lokalni; produkcioni Cloudflare deployment i Google indeksiranje nisu potvrđeni ovim proverama.
