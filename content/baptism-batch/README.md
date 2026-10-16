# Četiri pozivnice za krštenje

Originalne pozadine potiču iz korisnikovog arhiva `Pozivnice za krstenje.zip`, poslatog 16. oktobra 2026. Sve imaju 1060 × 1484 px (5:7); kopije u `sources/` nisu menjane i ne ulaze u javni build. PNG izvoz u 1500 × 2100 px ne dodaje izvorne detalje.

| Original | Dizajn | WebP pozadina | Pregled 500 × 700 |
| --- | --- | --- | --- |
| 1 | Anđeoski blagoslov | 189 KB | 36 KB |
| 2 | Golubica mira | 290 KB | 47 KB |
| 3 | Put svetlosti | 358 KB | 68 KB |
| 4 | Svetlost krštenja | 206 KB | 41 KB |

WebP pozadine koriste kvalitet .92, a pregledi .86. Zadržane su originalne dimenzije; pozadine su 86–91% manje. `report.json` beleži tačne veličine. Na stranici kataloga koriste se samo pregledi sa odloženim učitavanjem, dok se pozadina i fontovi učitavaju pri otvaranju editora.

## Tipografija i tekst

Cormorant Garamond 500 služi za svečanu serifnu tipografiju. **Napravi Rukopis** je podskup fonta Marck Script 400, preimenovan u skladu sa njegovim Reserved Font Name uslovom. Oba lokalna WOFF2 fonta imaju srpsku latinicu i ćirilicu, uključujući ČĆŠŽĐ/čćšžđ i ЂЋЉЊЏ/ђћљњџ. Zajedno zauzimaju oko 115 KB; renderer preuzima samo fontove korišćene u slojevima.

Izvori fontova su Google Fonts:

- [Cormorant Garamond](https://github.com/google/fonts/tree/main/ofl/cormorantgaramond), promenljivi `CormorantGaramond[wght].ttf`.
- [Marck Script](https://github.com/google/fonts/tree/main/ofl/marckscript), `MarckScript-Regular.ttf`.

Licence SIL OFL su sačuvane uz lokalne fontove i javne kopije. `prepare-fonts.py` koristi `fonttools[woff]`, pravi statičku težinu 500, podskupove latinice/ćirilice i proverava srpske znakove. Izvorni TTF fajlovi nisu potrebni za običan build.

```sh
python3 content/baptism-batch/prepare-fonts.py /putanja/CormorantGaramond.ttf /putanja/MarckScript-Regular.ttf
node content/baptism-batch/prepare.mjs
npm run build
```

`designs.mjs` definiše izmenjive slojeve bez fotografije. Svaki šablon ima ime, naslov, poruku, datum, vreme obreda, crkvu, mesto i vreme proslave. Prvi i treći počinju na ćirilici, ostali na latinici. Polje `locale` čuva pismo naziva meseca; posetilac ga menja kroz **Stil → Pismo datuma**, a administrator kroz istoimeno podešavanje. Promena pisma datuma ne preslovljava slobodno uneti tekst.

Skripta za pripremu koristi stvarni canvas renderer sajta i stabilne UUID oznake iz `asset-ids.json`. Pravi javne WebP/WOFF2 datoteke sa hashom, katalog i mapu datoteka u `src/baptism-*.js`. PNG/PDF primeri završavaju u `/workspace/artifacts/baptisms/`, izvan repozitorijuma. Tekst ostaje u slojevima, nije deo pozadinske slike.

## Admin i pretraga

**Admin → Gotovi dizajni → Uredi dizajn** kopira pozadinu i fontove u zaštićene admin datoteke. Nacrt ostaje privatan. Objavljivanje zamenjuje original i zadržava isti URL. Ime, lokacije, stil, pismo datuma, SEO naslov, opis i alt tekst ostaju izmenjivi.

Svaki dizajn ima jedinstven naslov, prirodan opis, objašnjenje i alt tekst. Stranice imaju gotov HTML, canonical, Open Graph/Twitter opis slike, JSON-LD ImageObject i breadcrumbs, linkove iz kategorije i unos u sitemap. Kategorija objašnjava pravljenje pozivnice za krštenje deteta i odvajanje obreda od ručka. Nisu dodavane meta keywords oznake; SEO podešavanja ne garantuju poziciju u pretrazi.

Produkcijski test proverava sve četiri SEO stranice bez JavaScript-a, stvarno iscrtavanje meseca u oba pisma, promenu imena/crkve/proslave, nacrt i PNG/PDF izvoz na telefonu. Admin test proverava kopiranje dva fonta, privatnost nacrta, objavu i očuvanje URL-a i SEO podataka.
