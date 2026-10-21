# Robi — 21.10.2026.

Šest novih originalnih pozadina generisano je kroz ChatGPT. Prva publika je muška u pet kategorija osim venčanja; dečji rođendan je za tri godine.

Izvor: **1060 × 1484 px**, tačno 5:7. WebP i PNG izvoz: **1500 × 2100 px**, povećavanje rezolucije bez kadriranja. PDF: **127 × 177,8 mm**, sa rasterom 1500 × 2100; povećavanje ne dodaje izvorni detalj. Izvorne dimenzije i obrada su u `image-sources.json` i `report.json`.

Zbog nepotvrđenih upisa velikih pojedinačnih PNG fajlova, originalni PNG/PDF fajlovi, dorade i snimci provera čuvaju se **bez gubitka podataka** u delovima `archive/evidence.tar.zst.part-*`. `archive-index.json` sadrži sve putanje, veličine i SHA-256. Optimizovane WebP pozadine i pregledi dostupni su zasebno.

Posle preuzimanja kontrolne grane pokreni:

```sh
node content/robi-batches/2026-10-21/restore-evidence.mjs
```

Rutina vraća izvorne `sources/*.png`, reprezentativne stvarne PNG/PDF primerke, mobilne snimke i PDF preglede u ovaj direktorijum i proverava da svaki bajt odgovara sačuvanom originalu. Ne generiše nove slike.

`prepare.mjs` koristi postojeći renderer i šemu projekta. `register.mjs` ponovljivo priprema stabilne ID-jeve, metapodatke i optimizovane javne fajlove. `verify.mjs` proverava svih šest u izgrađenoj produkcijskoj verziji sa mobilnim editorom, izmenama imena/lokacije, uzrastom 10 i stvarnim preuzimanjima. `quality-checklist.json` i `REPORT.md` beleže prolaze i blokade.

Korisnik ocenjuje prvu seriju na sajtu posle objave. Ocena i bodovi nisu unapred dodeljeni.
