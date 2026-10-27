# Nova zamenska serija — 27.10.2026.

Na izričit zahtev korisnika prethodnih šest pozivnica je uklonjeno sa sajta kroz commit 27529a436917069a9988f3a6aeb1bfdd3000961a. Cloudflare je potvrdio uklanjanje **27.10.2026. u 16:40:31 Asia/Tokyo**. Lokalno je potvrđeno da starih šest nema u katalogu, kategorijama, sitemap-u, slikama, API-ju i stranicama, uključujući javne admin kopije. Ostalih 36 Robijevih šablona je sačuvano. Produkcijska D1 baza nije fizički menjana; kopije tih izvora skrivaju se pravilom retired ID/builtinSource. Stvarnu javnu proveru blokirao je proxy CONNECT403; javni 404 i čišćenje istorijskog keša nisu potvrđeni.

Ovo je **šest novih originalnih pozadina i šest izmenjivih šablona**, zamena za odbačenu seriju. Muška publika u pet kategorija, venčanje za par; dečji uzrast šest. Izrada je ručno odobrena van jutarnjeg termina. Rok 10:00 je ranije propušten i ova zamena nije isporuka na vreme.

| Kategorija | Nova pozivnica | Pregled | Planirana javna adresa |
| --- | --- | --- | --- |
| Prvi rođendan | Mišji prvi piknik | [Pregled](https://github.com/101bgd/napravipozivnicu/blob/robi-agent/content/robi-batches/2026-10-27/replacement-01/previews/misji-prvi-piknik.webp) | https://napravipozivnicu.com/pozivnice/pozivnica-prvi-rodjendan-mis-sumske-jagode/ |
| 18. rođendan | Kobaltni prelom | [Pregled](https://github.com/101bgd/napravipozivnicu/blob/robi-agent/content/robi-batches/2026-10-27/replacement-01/previews/kobaltni-prelom.webp) | https://napravipozivnicu.com/pozivnice/pozivnica-18-rodjendan-kobaltni-lukovi/ |
| Dečji rođendan, 6 godina | Lemurova džungla | [Pregled](https://github.com/101bgd/napravipozivnicu/blob/robi-agent/content/robi-batches/2026-10-27/replacement-01/previews/lemurova-dzungla.webp) | https://napravipozivnicu.com/pozivnice/pozivnica-deciji-rodjendan-lemur-tropska-dzungla/ |
| Venčanje | Anemonin potpis | [Pregled](https://github.com/101bgd/napravipozivnicu/blob/robi-agent/content/robi-batches/2026-10-27/replacement-01/previews/anemonin-potpis.webp) | https://napravipozivnicu.com/pozivnice/pozivnica-za-vencanje-bele-anemone/ |
| Krštenje | Plava nit blagoslova | [Pregled](https://github.com/101bgd/napravipozivnicu/blob/robi-agent/content/robi-batches/2026-10-27/replacement-01/previews/plava-nit-blagoslova.webp) | https://napravipozivnicu.com/pozivnice/pozivnica-za-krstenje-plava-brojanica-srebrni-krst/ |
| Proslava rođenja | Polarni mali zagrljaj | [Pregled](https://github.com/101bgd/napravipozivnicu/blob/robi-agent/content/robi-batches/2026-10-27/replacement-01/previews/polarni-mali-zagrljaj.webp) | https://napravipozivnicu.com/pozivnice/pozivnica-proslava-rodjenja-decaka-polarni-medvedi/ |

## Dimenzije i obrada

Svih šest izvora ima **1060 × 1484 px**, tačno5:7. Izvoz je **1500 × 2100 px**, uvećan bez kadriranja; izvorne slike su neizmenjene. WebP pregledi su **500 × 700 px**. PNG ima 300 dpi metapodatke; PDF je **127 × 177,8 mm**, odnosno360 × 504pt. Izvozna rezolucija nije predstavljena kao izvorna.

## Stvarna kontrola kompozicija i izvoza

Svaki šablon ima19/19 prošlih preobjavnih provera. Odvojeno su pregledani stvarni izvori, svih šest finalnih pregleda zajedno, šest proširenih390pxmobilnih prikaza i šest personalizovanih PDF rastera. Otvoreno je18PNG i12PDF datoteka. Podrazumevani i duži tekstovi prolaze merenje stvarnih glifova, kontrast, margine i nepreklapanje. Imena, datumi, vremena, adrese i uzrast menjani su u stvarnim editorima; uzrast10je izvezen.

Pozadina i tipografija ocenjene su zajedno, sa konkretnim vizuelnim obrazloženjem u [visual-review.json](visual-review.json). Izabrana su četiri nova izvorna fonta, Bricolage Grotesque, Sora, Bodoni Moda i Lora, kroz šest rezova. Svi izabrani fontovi stvarno sadržeČĆŠŽĐčćšžđ; Italiana iPrataodbačeni su zbog nedostajućih slova. Za spojene Latin/Latin-ext WOFF2 datoteke izmenjeni su interni nazivi radi poštovanja RFN pravila; originalne OFL licence su sačuvane. Sam naziv fonta ili broj testova nije dokaz premium izgleda; korisnik novu seriju još nije ocenio.

Šest ranijih pokušaja pozadina odbačeno je i zamenjeno sasvim drugim motivima i kompozicijama, bez uređivanja odbijenih slika. Primarne ilustracije i tekst pregledani su protiv sigurne margine60px na ciljnom formatu. Sekundarna neprekidna vegetacija, tekstura ili apstraktne bojene površine mogu namerno ići do reza; nije tvrđeno da je svaki pozadinski list u sigurnoj zoni. Kod Kobaltnog preloma praktični podaci pomereni su iznad metalik linija i završne provere su ponovljene.

Poređenje obuhvata99istorijskih pozadina i15novih parova, bez identičnih slika. Najmanje dopunsko pHash rastojanje je14/63prema istoriji i22/63među novim slikama. Stvarni motivi i rasporedi takođe su pregledani; ova mera nije estetska ocena.

Build, šest mobilnih editora i stvarni PNG/PDF tokovi, Worker API/stranice/sitemap, kategorije, SEO naslovi/canonical/strukturirani podaci svih97pozivnica i AdSense integracija na113lokalnih stranica prošli su. Produkcijski smoke obuhvata320–1440px; početni JS je7135gzipbajta. Editor, fontovi i PDF ostaju lenji. Postojeća globalna AdSense podešavanja i identifikatori su nasleđeni, bez duplog SDK-a ili oglasa u izvozima. Testovi koriste lokalne simulacije i ne potvrđuju stvarnu isporuku oglasa.

## Arhiva i objava

Arhiva sadrži **48 binarnih datoteka, 61.225.274 bajta**: šest izvora, šest odbačenih pokušaja, šest fontova, šest finalnih WebP pozadina, šest pregleda, šest mobilnih prikaza, šest PNG i šest PDF primera. Dodatni personalizovani editor PNG/PDF i stres PNG zadržani su lokalno, otvoreni i provereni; rezultati su sačuvani. Manifest je [artifact-manifest.json](artifact-manifest.json), kontrolna lista [quality-checklist.json](quality-checklist.json).

Pripremljena je jedna zajednička objava svih šest kroz31produkcijsku datoteku. Potvrđeno je očuvanje451nepovezane roditeljske datoteke i36prethodnih Robijevih šablona. Odbačenih šest ostaje povučeno i ne vraća se automatski. Konačan deploy i javne provere upisuju se posle izvršenja; Git commit sam nije konačan uspeh.

Poeni ostaju **1/50** — mesečni1, bonus0; nema nove korisnikove estetske ocene ili boda.

