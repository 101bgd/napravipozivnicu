# Naslovi pozivnica

Obrazac za postojeće i buduće šablone: **povod + stvarni motiv ili stil — unikatni naziv**.

Primer: **Pozivnica za dečiji rođendan sa dinosaurusima — Dino avantura**.

- `name`: kratak unikatni naziv za karticu, pretragu i editor, npr. „Dino avantura“.
- `category`: postojeća kategorija. `INVITATION_LABELS` u `src/template-titles.js` daje odgovarajući naziv povoda u jednini.
- `motif`: sažet, gramatički uklopljen opis stvarne pozadine/stila, npr. „sa dinosaurusima“. Ne izmišljati motive, uzrast ili osobine kojih nema na dizajnu.
- `seoTitle`: može biti prazan za automatski naslov ili posebno napisan. Za pripremljene kolekcije koristiti `buildTemplateTitle(metadata)` i sačuvati rezultat u katalogu i izvornim metapodacima.
- `imageAlt`: zaseban stvaran opis slike, bez ponavljanja svih ključnih reči.

Ne imenovati šablone samo „Pozivnica za rođendan 1, 2, 3“. Broj povoda (1. ili 18. rođendan) ostaje deo smislenog naslova.

Admin ima polje **Motiv ili stil**, automatski predlog i pregled konačnog naslova. Prazan SEO naslov ostaje prazan u nacrtu; javna verzija ga sastavlja iz aktuelne kategorije, motiva i naziva. Posebno napisan naslov ima prednost. Kada je naslov jednak automatskom predlogu, izmena naziva, kategorije ili motiva ažurira i naslov. Brisanje posebnog naslova ponovo uključuje automatski način.

Isti konačan naslov koriste H1, HTML title, Open Graph/Twitter i naziv ImageObject-a. Kartice i breadcrumbs zadržavaju kratke nazive. Promena naslova ne menja slug, identifikator, datum objave ili tekst na samoj pozivnici.

`motifs.json` beleži motive 61 šablona obuhvaćenog ovom izmenom. Metapodaci su usklađeni i u izvorima kolekcija i Robi registru, pa ponovna priprema ne vraća stare naslove. Novi uvozi treba da prate isti obrazac i upišu odgovarajući `motif`.

`src/legacy-template-titles.js` čuva stare ugrađene SEO naslove. Starija objavljena admin kopija dobija novi naslov samo ako njen naslov tačno odgovara starom naslovu izvornog dizajna. Ručno promenjen naslov ostaje sačuvan. Usklađivanje se radi pri čitanju; ne menja D1 objavljene snimke, datume ni redosled najnovijih pozivnica. Pri sledećem čuvanju admin upisuje nova polja.

Posle builda: `node tests/template-titles.mjs`. Test obuhvata HTML bez JS-a svih šablona, usklađenost naslova i canonical adresa, stare objave i posebne naslove, objavljene datume, automatski naslov novog šablona i prikaz dugih naslova na telefonu. `tests/admin-integration.mjs` proverava unos motiva, pregled automatskog/posebnog naslova, čuvanje, objavljivanje i javni prikaz.
