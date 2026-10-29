# Dve besplatne pozivnice za 1. rođendan — 29. oktobar 2026.

U poruci je prvo navedena kategorija 18. rođendan, a korisnik je zatim izričito potvrdio **1. rođendan**. Oba dizajna pripadaju `first`; ne dodaju se u `eighteen`.

Izvor je korisnikov ZIP `Pozivnica za 1. rodjendan 11.zip`. Sadrži dve PNG pozadine 1060 × 1484 px. `sources/original-1.png` i `sources/original-2.png` su sačuvane identično fajlovima iz arhiva; SHA-256, dimenzije i mere optimizacije su u `report.json`.

| Dizajn | Tipografija i raspored | Javna adresa |
| --- | --- | --- |
| Prva morska plovidba | Vedro plavo more, jedrilica i nasmejani kit. Zaobljeno plavo ime je blago nagnuto, velika jedinica topla zlatnosmeđa. Poruka, odvojeni datum/vreme i mesto ostaju iznad glavnih morskih ilustracija. | `/pozivnice/besplatna-pozivnica-za-1-rodjendan-jedrilica-kit/` |
| Labudićev prvi ples | Beli labudić, cveće, leptiri i roze mašna. Rukopisno ime i velika obla jedinica koriste boju maline; podaci o proslavi stoje u desnoj koloni, a RSVP je na slobodnijem delu jezera. | `/pozivnice/besplatna-pozivnica-za-prvi-rodjendan-labudic-masna/` |

Nema okvira ni sloja za fotografiju. Ime, broj godina, naslov, poruka, datum, vreme, lokacija i potvrda dolaska se uređuju. `fitToWidth` zadržava i duže ime u predviđenom redu; tekst ne ulazi u samu originalnu pozadinu, već ga crta postojeći editor. Rukopisni, obli i serifni fontovi imaju različite uloge, a boje su dovoljno tamne za svetle ilustracije.

## Priprema i optimizacija

`metadata.json` je zajednički izvor naziva, motiva, SEO naslova, opisa i alt tekstova. Naslovi su **povod + stvarni motiv — unikatni naziv**, formirani preko `buildTemplateTitle`, prema `AGENTS.md`. `designs.mjs` sadrži rasporede. `asset-ids.json` čuva stabilne identifikatore i datum pripreme objave; `prepare.mjs` generiše verzionisane WebP slike, `src/first-birthday-extra-assets.js` i dokaze izvoza.

Pozadine nisu izrezane ili retuširane i zadržavaju 1060 × 1484 px:

- Jedrilica i kit: 2.171.901 → 282.766 bajtova, **87,0% manje**. Pregled sa tekstom oko 62 KB.
- Labudić: 2.155.165 → 259.836 bajtova, **87,9% manje**. Pregled sa tekstom oko 52 KB.

U katalogu se koriste pregledi 500 × 700 px, sa `loading="lazy"`. Pune pozadine i custom fontovi učitavaju se tek pri otvaranju editora. Ponovo se koriste postojeći lokalni Baloo 2, DynaPuff, Marck Script i Cormorant Garamond, uz licence u `content/birthday-batch/fonts/` i `content/baptism-batch/fonts/`. Nema novog spoljnog font servisa ili zavisnosti.

```sh
node content/first-birthday-extra-20261029/prepare.mjs
npm run build
node tests/first-birthday-extra.mjs
```

Priprema pokreće lokalni Vite na portu 5196 i Chromium. PNG i PDF dokazi su u `/workspace/artifacts/birthday-oct29/`, van repozitorijuma. PNG izvoz je 1500 × 2100 px; PDF 127 × 177,8 mm. Uvećavanje izvorne pozadine ne dodaje detalje; PDF je raster bez automatskog prepusta/CMYK pripreme.

## SEO i oglasi

Primarna namera je **besplatne pozivnice za 1. rođendan**. Prirodno se koriste i varijante **besplatne pozivnice za prvi rođendan**, **digitalna pozivnica za 1. rođendan**, uz konkretne motive jedrilice/kita i labudića/mašne. Ne prave se dodatne duple stranice za sinonime ili varijante bez dijakritika. Ovde nisu korišćeni ili izmišljeni podaci o obimu pretrage; namera odgovara korisnikovom zahtevu i funkciji besplatnog editora.

Svaki šablon ima jedinstven H1/title, meta opis, alt, canonical, ImageObject i breadcrumb podatke. Novi URL-ovi automatski ulaze u katalog, kategoriju, povezane pozivnice i sitemap sa slikama. Početna i dalje prikazuje po jedan najnoviji dizajn iz svake kategorije, pa ovu objavu tamo predstavlja Prva morska plovidba. Uvod, meta opis i savet kategorije sada prirodno navode nove motive i besplatno preuzimanje; menjana je samo kategorija 1. rođendan.

Svaka nova stranica dobija jedan globalni AdSense blok i postojeće Google tag/AdSense kodove. Prikaz ručnog oglasa zavisi od sačuvanih podešavanja i stvarnog slot ID-a iz admina; ova objava ih ne menja. Oglasi nisu deo PNG/PDF pozivnice.

## Kontrola kvaliteta

- Build i `tests/first-birthday-extra.mjs`: proveravaju javni Worker/API, kategoriju, sitemap, početnu i admin, fontove, odsustvo fotografije, izmenjiv tekst/stil, duga imena, čuvanje nacrta i 320/390/1440 px.
- Stvarni canvas pozivi potvrđuju da su sva slova dugog imena nacrtana unutar raspoloživog prostora. Preuzeti PNG je 1500 × 2100, a PDF ima stranicu 127 × 177,8 mm.
- Proverava se po jedna Google/AdSense skripta i jedno mesto za oglas, uključujući lokalno uključivanje stvarno oblikovanog ručnog slota kroz zaštićeni API. Svi Google zahtevi su mockovani ili blokirani; nema stvarnih oglasa ili poseta.
- `tests/curated-batch-integration.mjs` sadrži zajedničku funkcionalnu proveru; i raniji `tests/eighteen-premium.mjs` koristi isti ugovor, uz svoje podatke, i ostaje zasebno pokretljiv.
- Regresione provere: `tests/google-tag-integration.mjs`, `tests/template-titles.mjs`, `tests/category-seo.mjs`. Provera alt teksta prati stvarni autorski opis i kontekst ImageObject-a; ne zahteva da svaki opis počinje istom frazom. Opisi mogu prirodno početi bojom ili motivom.
- Izvozi i screenshotovi mobilnog/desktop editora su vizuelno pregledani; uočeni sudar vremena sa jedrom i RSVP-a sa lokvanjem otklonjeni su rasporedom teksta.

Lokalni tehnički prolaz ne potvrđuje Cloudflare deployment niti garantuje Google indeksiranje ili rangiranje. Glavne adrese su bez `www`, a postojeća 301 preusmeravanja važe i za nove stranice.
