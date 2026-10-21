# SEO kategorija i slika — 21. oktobar 2026.

Primarni izrazi prate zahtev vlasnika, bez izmišljene tvrdnje o obimu pretrage:

| Kategorija | Primarni izraz | Postojeća adresa |
| --- | --- | --- |
| Rođendani | Pozivnice za rođendan | /pozivnice-za-rodjendan/ |
| 18. rođendan | Pozivnice za 18. rođendan | /pozivnice-za-18-rodjendan/ |
| 1. rođendan | Pozivnice za 1. rođendan | /pozivnice-za-prvi-rodjendan/ |
| Venčanje | Pozivnice za venčanje | /pozivnice-za-vencanje/ |
| Krštenje | Pozivnice za krštenje | /pozivnice-za-krstenje/ |
| Rođenje deteta | Pozivnice za rođenje | /pozivnice-za-rodjenje-deteta/ |

Naslov stranice, H1, opis, uvod i relevantni interni linkovi koriste prirodnu srpsku latinicu. Prvi rođendan, punoletstvo, svadba i rođenje bebe ostaju korisne varijante u tekstu. Ne pravimo dodatne stranice za varijante bez kvačica. Adrese već indeksiranih kategorija i postojećih slika ostaju iste.

`alts.json` sadrži pojedinačne opise svih 61 trenutnih šablona. Svaki opis navodi vrstu pozivnice i konkretan motiv; ne nabraja sve ključne reči. `scripts/apply-image-seo.mjs` usklađuje pripremne izvore i generisane kataloge. Admin i dalje čuva ručno uneti opis; kada je prazan, `templateImageAlt` daje opis prema kategoriji i nazivu. Dekorativne ikone ostaju skrivene od čitača ekrana.

Šest starih Canvas pregleda sada ima WebP slike od 500 × 700 px. Ukupno zauzimaju 62.646 bajtova. Priprema: `node scripts/prepare-example-previews.mjs`; rezultat je `src/example-previews.js`, a veličine su u `example-previews.json`. Pregledi koriste postojeći renderer i podatke šablona, uključujući probni datum; nisu novi dizajni. Nova imena fajlova sadrže vrstu pozivnice i hash. Katalog više ne učitava renderer za crtanje pregleda, pa slike postoje i bez JavaScript-a. Editor se i dalje učitava na zahtev.

Svaka kategorija ima `CollectionPage`, `ItemList` sa linkovima i slikama i `ImageObject` za svaki vidljivi pregled. Isti opis se koristi u HTML-u, objavama za deljenje i JSON-LD podacima. Sitemap koristi standardni image namespace i `image:loc` za javne preglede na kategoriji i stranici dizajna. Ne dodaje zastarele image caption/title XML oznake: opisi su u HTML-u i strukturiranim podacima. Privatni nacrti i skriveni dizajni ne ulaze u sitemap.

Datumi kategorija i `IMAGE_METADATA_UPDATED_AT` opisuju stvarnu izmenu sadržaja. Datum objave šablona ostaje odvojen, pa ova SEO izmena ne premešta stare dizajne u „Najnovije pozivnice“. Datumi se ne osvežavaju pri svakom buildu. Google odlučuje o indeksiranju i pozicijama.

Posle builda: `node tests/category-seo.mjs`. Proverava ciljane izraze, postojeće canonical adrese, HTML bez JS-a, sve slike, njihove opise i ImageObject podatke, ispravnost XML-a i odsustvo privatnog/sakrivenog sadržaja. Mobilni prikaz i budžet JS-a proverava `tests/category-landings.mjs`, a stvarne izvoze `tests/production-smoke.mjs`.
