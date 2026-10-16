# Deset pozivnica za prvi rođendan

Pozadine je vlasnik poslao u `Pozivnica za 1. rodjendan 1.zip`. Arhiva sadrži samo deset PNG slika od 1060 × 1484 px. Originali su neizmenjeni u `sources/`, a nazivi, dimenzije, veličine i SHA-256 vrednosti u `sources.json`. Nema pratećih tekstualnih instrukcija.

| Original | Dizajn | Tipografija i raspored |
| --- | --- | --- |
| 1 | Savanska družina | Zelena zaobljena slova i narandžasta jedinica iznad žirafe i slončeta |
| 2 | Vozić prve radosti | Plavo ime, topla jedinica i podaci u nebu iznad vozića |
| 3 | Labudova nežnost | Malinasto rukopisno ime; detalji levo od labudova |
| 4 | Vilina prva čarolija | Ljubičasto rukopisno ime i podaci desno od vile |
| 5 | Kitov prvi talas | Morskoplava slova; raspored iznad kita, pored kapljica |
| 6 | Mali pilot | Razigrano plavo ime, topla jedinica i podaci ispod aviona |
| 7 | Medin mesečev san | Topla smeđa slova, zlatna jedinica i rukopisna završna poruka |
| 8 | Zeka među oblacima | Vedro ime i svetla jedinica sa konturom u desnom delu neba |
| 9 | Zekin prvi let | Krupna jedinica i ime desno; širok donji blok ispod korpe |
| 10 | Prva trešnjica | Crvena slova i jedinica ispod ilustracije trešnjica i mašne |

Svi šabloni su u kategoriji `first` i nemaju sloj za fotografiju. Ime, broj, naslov, poruka, datum, vreme, mesto i potvrda dolaska su izmenjivi. Meda ima i zasebnu završnu poruku. Podrazumevani podaci su primeri, sa datumom 17. april 2027. i rokom potvrde 10. april.

## Optimizacija i fontovi

`prepare.mjs` pravi WebP pozadine kvaliteta 0,92 u originalnim dimenzijama, preglede 500 × 700 px kvaliteta 0,86 i PNG/PDF primerke kroz stvarni renderer aplikacije. `report.json` beleži 87,6–94,7% manje pozadine, od 90 do 294 KB. Pregledi su od 22 do 56 KB. Izvoz 1500 × 2100 px ne dodaje detalje originalnoj ilustraciji.

Ponovo se koriste lokalni Baloo 2 i DynaPuff iz `content/birthday-batch/` i Napravi Rukopis (Marck Script sa preimenovanim podskupom) iz `content/baptism-batch/`. Licence OFL i poreklo fontova ostaju uz te kolekcije. Svaki dizajn navodi i učitava samo dva korišćena sopstvena fonta. Sitni podaci koriste postojeći DM Sans. Podržani su srpski latinični dijakritici.

```sh
node content/first-birthday-batch/prepare.mjs
npm run build
node tests/browser-smoke.mjs
node tests/production-smoke.mjs
node tests/admin-integration.mjs
node tests/adsense-integration.mjs
```

Priprema koristi lokalni Vite i Chromium. `asset-ids.json` čuva stabilne identifikatore; generisani metapodaci i mape su u `src/first-birthday-catalog.js` i `src/first-birthday-assets.js`. PNG/PDF primeri su van repozitorijuma, u `/workspace/artifacts/first-birthday-batch/`. Nakon izmene rasporeda ponoviti pripremu i ukloniti nereferencirane stare preglede iz javnog direktorijuma ove kolekcije.

## Uređivanje, oglasi i pretraga

U **Admin → Gotovi dizajni → Uredi dizajn** mogu da se menjaju raspored, fontovi, tekst i SEO podaci. Pozadina i dva korišćena fonta kopiraju se u privatne datoteke. Nacrt zadržava original javnim, a objava ga zamenjuje na istoj adresi.

Svaki dizajn ima zasebnu opisnu adresu, SEO naslov, opis, alt tekst i vidljiv opis. Stranice i kategorija imaju gotov HTML, canonical, strukturirane podatke i sitemap. [seo-research.md](seo-research.md) beleži blokirane zahteve prema Google Trends-u/pretrazi i prirodno pokrivanje obe varijante upita bez izmišljenih obima pretrage.

Sve nove stranice nasleđuju globalni AdSense blok i **Admin → AdSense reklame** podešavanja. Bez aktivnog koda blok je sakriven; oglasi se ne uključuju u PNG/PDF. AdSense integracioni test prolazi kroz sve stranice sa uključenim i isključenim blokom, uz presretnut SDK, bez stvarnih Google zahteva.
