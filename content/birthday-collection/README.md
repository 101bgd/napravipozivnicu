# Četiri nova oblikovanja dečijih pozivnica

Dodato 20. oktobra 2026. iz korisnikovog ZIP-a „Pozivnice za rodjendan.zip“. Provereni originali, nazivi i SHA-256 vrednosti su u `sources.json`. Sve četiri slike se potpuno poklapaju sa originalima iz `content/birthday-batch/sources/`, pa nema dodatnih kopija pozadina ili fontova u javnim datotekama.

- **Dino ekspedicija**: nagnuto DynaPuff ime, narandžaste godine levo, poruka i događaj desno.
- **Galaktička posada**: veliko belo DM Sans ime, broj i poruka u dva bloka, posebno vreme poletanja.
- **Biserna bajka**: rukopisno ime, obli naslov, uspravan natpis uz godine, tamnoljubičasti i plavi tekst.
- **Krug sreće**: veliko Baloo 2 ime, izdvojene godine uz poruku, datum i vreme u dve kolone, rukopisni završetak.

Svi šabloni su bez mesta za fotografiju, imaju izmenjivo ime, godine, poruku, datum, vreme, lokaciju i potvrdu dolaska. Datumi, imena i lokacije su ilustrativni podaci koje posetilac menja.

`designs.mjs` sadrži rasporede i SEO metapodatke. `prepare.mjs` koristi postojeće WebP pozadine da napravi preglede od 500 × 700 px i probne izvoze PNG 1500 × 2100 / PDF 127 × 177,8 mm. Originalna slika ima 1060 × 1484 px; veći izlaz ne dodaje detalje pozadini. PDF nema prepust ili CMYK pripremu.

Fontovi Baloo 2 i DynaPuff koriste postojeće datoteke/licence u birthday-batch, a Marck Script postojeći font u baptism-batch. Učitavaju se samo fontovi korišćeni u konkretnom dizajnu. Metadata kataloga je odvojena od rasporeda koji se učitava tek pri otvaranju editora.

Priprema: `node content/birthday-collection/prepare.mjs`. Rezultati i veličine su u `report.json`; slike i PDF za vizuelnu proveru idu u `/workspace/artifacts/birthday-collection/`. Prep skripta ne objavljuje sajt. Uobičajeni GitHub main / Cloudflare deploy objavljuje proverene promene.

Nove stranice koriste postojeći globalni AdSense blok, bez dodavanja drugog oglasa. Prikaz zavisi od sačuvanih admin podešavanja. Ograničenja istraživanja i odabrani izrazi su u `seo-research.md`.
