# Četiri pozivnice za dečije rođendane

Originali su iz korisnikovog arhiva `Pozivnice za rodjendan.zip`, poslatog 16. oktobra 2026. Dimenzije svih pozadina su 1060 × 1484 px (5:7); sačuvane su u `sources/` bez promena. Izvoz u 1500 × 2100 px ne dodaje detalje kojih nema u originalu.

| Original | Dizajn | WebP pozadina | Pregled 500 × 700 |
| --- | --- | --- | --- |
| 1 | Dino avantura | 245 KB | 50 KB |
| 2 | Svemirska misija | 220 KB | 48 KB |
| 3 | Mala sirena | 348 KB | 75 KB |
| 4 | Čarobni ringišpil | 146 KB | 42 KB |

Pozadine su kodirane u WebP sa kvalitetom .92; pregledi sa .86. Originalne dimenzije su zadržane. Fontovi Baloo 2 i DynaPuff pripremljeni su u WOFF2, sa težinom 600, latinicom, dijakriticima ČĆŠŽĐ/čćšžđ i tipografskim znakovima. Zajedno zauzimaju oko 51 KB i učitavaju se tek po otvaranju editora. Licence SIL OFL nalaze se uz fontove, kao i uz njihove javne kopije.

`designs.mjs` sadrži izmenjive tekstualne slojeve; nema okvira za fotografiju. Svaki dizajn ima ime, godine, uvodni tekst, poruku, datum, vreme, mesto i završnu poruku. Generisani metapodaci čuvaju poseban SEO naslov, prirodan opis, objašnjenje dizajna i opisni alt tekst. Ne koristi se meta keywords oznaka niti se garantuje Google pozicija.

Za ponovno pravljenje datoteka:

```sh
node content/birthday-batch/prepare.mjs
npm run build
```

Skripta koristi postojeći renderer sajta. Kreira javne datoteke sa hashom, `src/birthday-assets.js`, `src/birthday-catalog.js` i izveštaj `report.json`. `asset-ids.json` održava stabilne oznake. PNG/PDF primeri nastaju u `/workspace/artifacts/birthdays/` i ne ulaze u javni build. Originali se ne isporučuju posetiocima.

## Uklonjene pozivnice

Uklonjeni su ugrađeni primeri Razlog za slavlje, U zelenom vrtu, Maslinova priča, Zauvek zajedno, Malo sunce i Pod malim zvezdama. Njihovi pregledi su zamenjeni i na početnoj strani.

`src/retired-templates.js` uklanja iz javnog kataloga, API-ja i SEO stranica i njihove stare D1 kopije, kao i postojeće zapise nazvane Nova pozivnica. Ograničenje datuma štiti buduće nacrte sa generičkim nazivom. Pri sledećem otvaranju zaštićenog admin panela, CSRF-proveren POST `/api/admin/maintenance/retired-templates` fizički briše odgovarajuće zapise iz baze. Verzija zapisa proverava se pre brisanja, migracija je idempotentna, a deljene datoteke ostaju netaknute. Ostali šabloni se ne brišu.
