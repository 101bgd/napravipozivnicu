# Osam pozivnica za venčanje

Pozadine je dostavio vlasnik sajta u arhivi `Pozivnice za svadbu.zip`. Svih osam PNG datoteka je 1060 × 1484 px. Originali su u `sources/`, a nazivi, veličine i SHA-256 vrednosti u `sources.json`. Arhiva ne sadrži tekstualna uputstva.

| Original | Dizajn | Raspored |
| --- | --- | --- |
| Pozivnica za svadbu.png | Zavet u prirodi | Zelena kaligrafija iznad ilustracije mladenaca; ceremonija i proslava u dve kolone |
| Pozivnica za svadbu 1.png | Maslinov zavet | Klasična velika imena unutar zlatnog luka na pergamentu |
| Pozivnica za svadbu 5.png | Zlatna obala | Dijagonalna kaligrafska imena u nebu; dva bloka iznad pejzaža |
| Pozivnica za svadbu 6.png | Beli cvet i zlato | Tamnozelena dijagonalna imena; podaci levo od donjeg buketa |
| Pozivnica za svadbu 7.png | Veče pod fenjerima | Topla imena u nebu; svetli podaci sa diskretnom senkom preko tamnijeg pejzaža |
| Pozivnica za svadbu 8.png | Smaragdni zavet | Svetla klasična imena, zlatna kaligrafija i podaci unutar smaragdnog luka |
| Pozivnica za svadbu 9.png | Šapat božura | Ružičasta kaligrafija između cvetova; raspored prati slobodan deo pozadine |
| Pozivnica za svadbu 10.png | Pismo ljubavi | Svečana kaligrafija na papiru, uz vidljivu crkvu i čipku |

Nema okvira za fotografiju. Ime mlade i mladoženje, uvod, poruka, datum, najave, vreme i mesto ceremonije i proslave i potvrda dolaska uređuju se odvojeno. Ampersand je dekorativan sloj, dostupan u adminu. Podrazumevani datum je 19. jun 2027; sva imena i lokacije su primeri.

## Slike i fontovi

`prepare.mjs` kodira pozadine u WebP kvaliteta 0,92 uz iste dimenzije, a preglede crta stvarnim rendererom aplikacije u 500 × 700 px (WebP 0,86). Generiše i PNG 1500 × 2100 i PDF 127 × 177,8 mm za vizuelnu proveru, van javne aplikacije, u `../artifacts/wedding-collection/` u odnosu na koren repozitorijuma. Podaci o uštedi i sadržajno verzionisanim adresama su u `report.json`; pozadine su 83,6–87,8% manje.

Šabloni ponovo koriste postojeće lokalne fontove Cormorant Garamond i Great Vibes sa srpskim latiničnim dijakriticima, uz DM Sans za male oznake. Ne dodaju se nove kopije fontova. Izvori i OFL licence ostaju u postojećim kolekcijama `content/baptism-batch/` i `content/wedding-batch/` i pripadajućim javnim direktorijumima.

```sh
node content/wedding-collection/prepare.mjs
npm run build
node tests/browser-smoke.mjs
node tests/production-smoke.mjs
node tests/admin-integration.mjs
```

Priprema koristi lokalni Chromium i postojeće zavisnosti. Ne postavlja ništa na Cloudflare; izmenu objavljuje uobičajeni GitHub/Cloudflare postupak. `src/wedding-assets.js`, `src/wedding-catalog.js`, `asset-ids.json` i `report.json` generišu se iz stabilnih identifikatora i `designs.mjs`. Nakon promene rasporeda ponoviti pripremu i ukloniti stare, nereferencirane preglede iz ovog novog direktorijuma.

## Katalog, admin i SEO

Kategorija ostaje **Venčanje**, na `/pozivnice-za-vencanje/`. Svaki dizajn ima jedinstvenu opisnu adresu, naslov, opis, vidljiv opis dizajna i alt tekst. Postojeći generator dodaje canonical, Open Graph, strukturirane podatke i sitemap. Katalog učitava samo mali pregled; pozadina, raspored i fontovi učitavaju se pri otvaranju editora.

U `/admin/sabloni/` → **Gotovi dizajni → Uredi dizajn** pozadina i oba fonta kopiraju se u zaštićene datoteke. Nacrt zadržava original javnim; objava ga zamenjuje na istoj adresi i čuva SEO podatke. Postojeća pozivnica Ponoćna elegancija ostaje dostupna.

Pokušaj poređenja izraza „pozivnice za svadbu“ i „pozivnice za venčanje“ dokumentovan je u [seo-research.md](seo-research.md). Google Trends i Google pretraga nisu dostupni iz ovog okruženja. Nema potvrđenog podatka koji izraz ima više pretraga. Oba se koriste prirodno na jednoj kategoriji za istu nameru, uz zasebne opise konkretnih stilova, bez obećanja pozicije na Google-u.
