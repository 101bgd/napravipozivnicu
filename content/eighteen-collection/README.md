# Devet različitih pozivnica za punoletstvo

Vlasnik je poslao arhivu `punoletstvo 1.zip` sa devet PNG pozadina od 1060 × 1484 px. Arhiva nema prateće tekstualne instrukcije. Originali ostaju neizmenjeni u `sources/`; `sources.json` beleži originalne nazive, veličine, dimenzije i SHA-256 vrednosti.

| Original | Dizajn | Stil i raspored |
| --- | --- | --- |
| 1 | Terakota ritam | Uspravni uvod uz šahovnicu; koso ime i zaobljeni terakota broj u desnoj koloni |
| 2 | Ledeni hologram | Veliki plavo-ljubičasti broj levo, kratka poruka desno i široko ime ispod metalnih traka |
| 3 | Zlatni disko ritam | Retro zaobljeno ime i klasičan broj; tamnosmeđi tekst desno od disko kugle |
| 4 | Mašna u ponoć | Kaligrafsko ime, klasičan broj i zasebna rukopisna poruka u crnoj i tamnoj bordo boji |
| 5 | Bordo nokturno | Svetlo svečano ime gore, broj i poruka jedan pored drugog; adresa levo, potvrda dolaska na donjoj tamnoj svili |
| 6 | Leptirov novi let | Rukopisno ime gore, nagnuta poruka levo od broja, tamnoljubičasti podaci desno od leptira |
| 7 | Smaragdna premijera | Šampanj broj i ime u svečanoj tipografiji; raspored desno od zlatnih art deko zraka |
| 8 | Pun gas do osamnaeste | Sportski kosi naslov, crveni broj levo, ime desno, dva bloka podataka iznad trkačke pruge |
| 9 | Kobaltna noć | Ime i veliki svetli broj levo, uspravni naziv proslave, podaci na tamnom donjem delu |

Svi novi šabloni pripadaju kategoriji `eighteen` i nemaju foto sloj. Devet dizajna ima različita imena, poruke, rasporede i tipografiju; datum i ostali prikazani podaci su primeri za uređivanje. Podrazumevani datum proslave je 19. jun 2027, a rok potvrde 12. jun. Naslov, ime, broj godina, poruka, datum, vreme, višeredna adresa i potvrda dolaska mogu da se menjaju. Tri ranija dizajna za punoletstvo, njihove adrese i dva starija primerka ostaju dostupni.

## Optimizacija i fontovi

`prepare.mjs` pravi WebP pozadine kvaliteta 0,92, u originalnim dimenzijama, i završene preglede 500 × 700 px kvaliteta 0,86 kroz pravi renderer aplikacije. Pozadine imaju približno 97–367 KB, odnosno 86,2–94,4% manje od originalnih PNG datoteka; pregledi su približno 27–52 KB. Precizne veličine i hashirane putanje su u `report.json`. Originali nisu deo javnog produkcionog direktorijuma.

Ponovo se koriste lokalni Cormorant Garamond i Napravi Rukopis (preimenovani podskup Marck Script) iz `baptism-batch`, Great Vibes iz `wedding-batch`, DynaPuff iz `birthday-batch`, uz postojeće DM Sans i Libre Caslon Display. OFL licence ostaju uz izvore tih fontova. Svaki dizajn navodi i učitava samo sopstvene fontove koje zaista koristi; trkački dizajn koristi samo postojeći DM Sans. Fontovi podržavaju srpske latinične dijakritike. Nema novih zavisnosti ili zahteva ka spoljnim servisima fontova.

```sh
node content/eighteen-collection/prepare.mjs
npm run build
node tests/browser-smoke.mjs
node tests/production-smoke.mjs
node tests/admin-integration.mjs
node tests/adsense-integration.mjs
```

Priprema zahteva lokalni Vite i Chromium. `asset-ids.json` čuva stabilne identifikatore, `designs.mjs` rasporede, a `src/eighteen-collection-assets.js` i `src/eighteen-collection-catalog.js` generisane registre. Primerci PNG/PDF i zbirni pregled izlaze van repozitorijuma u `/workspace/artifacts/eighteen-collection/`. Nakon izmene dizajna ponoviti pripremu i ukloniti samo nereferencirane stare preglede ove kolekcije.

PNG je 1500 × 2100 px, a PDF sadrži taj raster u formatu 127 × 177,8 mm. Izvoz ne dodaje detalje originalnoj ilustraciji. PDF nema automatski prepust ili oznake za rezanje; za takvu štampu treba proveriti zahteve štamparije. Oglasi nisu deo izvezene pozivnice.

## SEO, administracija i oglasi

Postojeća kategorija `/pozivnice-za-18-rodjendan/` obuhvata i izraz „pozivnice za punoletstvo“, sa ažuriranim uvodom i opisom. Nema dupliranja kategorija za sinonime. Devet dizajna ima jedinstvene opisne adrese, SEO naslove, meta opise, alt tekstove i vidljive opise. Gotov HTML, canonical, sitemap, Open Graph/Twitter, ImageObject i breadcrumbs dolaze iz postojećeg generatora i Workera. [seo-research.md](seo-research.md) dokumentuje pokušaje istraživanja i ograničenja mrežnog pristupa; ne iznose se neprovereni obimi ili obećanja rangiranja.

U **Admin → Gotovi dizajni → Uredi dizajn** mogu da se promene fontovi, raspored, tekst i SEO podaci. Uređivanje pravi nacrt sa privatnim kopijama pozadine i fontova. Objavljivanje zamenjuje ugrađeni dizajn na istoj adresi, uz očuvane SEO podatke.

Svaka nova stranica nasleđuje jedan postojeći globalni AdSense blok i podešavanja iz **Admin → AdSense reklame**. Kod ne treba ponovo unositi. Isključeni ili nepopunjeni oglasi ne ostavljaju prazan prostor, a administracija i preview domeni ne učitavaju oglase. Integracioni test koristi simulirani SDK, bez stvarnih Google oglasnih zahteva.
