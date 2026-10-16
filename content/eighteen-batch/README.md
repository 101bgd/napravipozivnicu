# Tri pozivnice za 18. rođendan i punoletstvo

Originali su iz korisnikovog arhiva `Pozivnice za punoletstvo.zip`, poslatog 16. oktobra 2026. Sačuvani su bez izmena u `sources/`, imaju 1060 × 1484 px (5:7) i ne isporučuju se posetiocima. Izvoz od 1500 × 2100 px ne dodaje detalje kojih nema u originalu.

| Original | Dizajn | WebP pozadina | Pregled 500 × 700 |
| --- | --- | --- | --- |
| 1 | Disko sjaj | 139 KB | 41 KB |
| 2 | Saten i biseri | 211 KB | 40 KB |
| 3 | Zlatni trenutak | 95 KB | 23 KB |

WebP kodiranje je .92 za pozadinu i .86 za pregled. Dimenzije originala su zadržane; pozadine su 90–95% manje. Tačne veličine i putanje su u `report.json`. Nazivi javnih datoteka imaju hash za dugotrajno keširanje. Na katalogu se učitavaju mali pregledi, a pune pozadine tek pri otvaranju editora.

## Raspored i fontovi

Sva tri dizajna su bez sloja fotografije. Odvojeni tekstualni slojevi omogućavaju izmenu imena, velikog broja 18, naslova, poruke, datuma, vremena, lokacije i potvrde dolaska. Primeri počinju na latinici, sa podrškom za ČĆŠŽĐ/čćšžđ. Zlatni dizajn ima asimetričan raspored; tekstovi su postavljeni van najjačih odsjaja. Roze pozivnica prati slobodan prostor desno od leptira i bisera.

Ponovo se koriste postojeći lokalni fontovi i njihove postojeće javne datoteke:

- Cormorant Garamond 500 iz paketa za krštenje, za svečani serif i velike brojeve.
- Great Vibes iz paketa „Ponoćna elegancija“, za kaligrafska imena i detalje.
- DM Sans iz editora, za jasan sitniji tekst i krupan broj u disko dizajnu.

Nema novih kopija fontova u ovom paketu ni dodatnih spoljnih font zahteva. Licence ostaju uz [fontove za krštenje](../baptism-batch/fonts/) i [font za venčanje](../wedding-batch/fonts/). Generator čeka odgovarajuću veličinu i debljinu svakog fonta, da pregled i editor koriste istu tipografiju.

Za ponovno pravljenje datoteka:

```sh
node content/eighteen-batch/prepare.mjs
npm run build
```

`designs.mjs` definiše rasporede i metapodatke. `prepare.mjs` koristi stvarni renderer sajta, stabilne UUID oznake iz `asset-ids.json` i postojeće fontove. Pravi javne WebP datoteke, `src/eighteen-assets.js`, `src/eighteen-catalog.js` i izveštaj. PNG/PDF primeri završavaju u `/workspace/artifacts/eighteenths/`, van repozitorijuma. Tekst ostaje izmenjiv, nije deo pozadinske slike.

## Admin i pretraga

Šabloni su u **Admin → Gotovi dizajni → Uredi dizajn**. Pozadina i dva fonta kopiraju se u privatne admin datoteke; nacrt ne menja javnu verziju. „Objavi“ zamenjuje original na istom URL-u. SEO naslov, opis i alt tekst ostaju izmenjivi u panelu.

Postojeća kategorija `/pozivnice-za-18-rodjendan/` pokriva i punoletstvo i 18. rođendan. Zasebna druga kategorija nije dodata. Svaki dizajn ima sopstveni SEO naslov, prirodan opis, tekst o dizajnu, alt tekst, canonical, podatke o slici, interne linkove i unos u sitemap. HTML je dostupan bez JavaScript-a.

[Beleška o istraživanju](seo-research.md) navodi pokušane izvore i mrežno ograničenje. Nije potvrđen veći obim nijednog izraza, pa se ne navode brojke ni tvrdnja o tome koji je popularniji.

Produkcijski test proverava tri stranice bez JavaScript-a, odloženo učitavanje pozadina, oba dodatna fonta, izmene i lokalni nacrt, odsustvo foto polja i stvarne PNG/PDF datoteke na ekranu širine 320 px. Admin test proverava prikaz sva tri dizajna, privatnost kopiranih fontova i objavljivanje na originalnom URL-u.
