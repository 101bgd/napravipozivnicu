# Uklanjanje i nova zamenska serija — 27.10.2026.

**Prethodnih šest je uklonjeno sa sajta.** Cloudflare je potvrdio uklanjanje27.10.2026. u **16:40:31 Asia/Tokyo**, commit[27529a436917069a9988f3a6aeb1bfdd3000961a](https://github.com/101bgd/napravipozivnicu/commit/27529a436917069a9988f3a6aeb1bfdd3000961a). Uklonjeni su katalog, stranice, sitemap unosi, izvorni rasporedi,12pozadina/pregleda i javni pristup eventualnim admin kopijama preko retired ID/builtinSource pravila. Uklanjanje je lokalno provereno404odgovorima; produkcijski deploy je potvrđen. Javnu proveru uklanjanja blokirao je proxyCONNECT403, pa javno viđen404iličišćenje istorijskogkeša nisu tvrđeni. Produkcijska D1baza nije fizički brisana; kopije ovih izvora skrivene su pravilom pristupa.

**Svih šest novih pozivnica je objavljeno zajedno.** Cloudflare Pages je potvrdio **success27.10.2026. u20:53:04 Asia/Tokyo**, commit[e2e846cd54ec31cb686db5bfd8c93d24ae1a9812](https://github.com/101bgd/napravipozivnicu/commit/e2e846cd54ec31cb686db5bfd8c93d24ae1a9812). Ovo je ručno odobrena zamena odbačene serije, sa šest novih originalnih pozadina, novih rasporeda i novom tipografijom. Nije predstavljena kao jutarnja isporuka u roku10:00. Korisnik nova rešenja još nije estetski ocenio.

| Kategorija | Nova pozivnica i javni link | Sačuvani pregled | Status |
| --- | --- | --- | --- |
| Prvi rođendan | [Mišji prvi piknik](https://napravipozivnicu.com/pozivnice/pozivnica-prvi-rodjendan-mis-sumske-jagode/) | [Pregled](https://github.com/101bgd/napravipozivnicu/blob/robi-agent/content/robi-batches/2026-10-27/replacement-01/previews/misji-prvi-piknik.webp) | Deploy potvrđen; javna provera NEPROVERENO |
| 18. rođendan | [Kobaltni prelom](https://napravipozivnicu.com/pozivnice/pozivnica-18-rodjendan-kobaltni-lukovi/) | [Pregled](https://github.com/101bgd/napravipozivnicu/blob/robi-agent/content/robi-batches/2026-10-27/replacement-01/previews/kobaltni-prelom.webp) | Deploy potvrđen; javna provera NEPROVERENO |
| Dečji rođendan, 6 godina | [Lemurova džungla](https://napravipozivnicu.com/pozivnice/pozivnica-deciji-rodjendan-lemur-tropska-dzungla/) | [Pregled](https://github.com/101bgd/napravipozivnicu/blob/robi-agent/content/robi-batches/2026-10-27/replacement-01/previews/lemurova-dzungla.webp) | Deploy potvrđen; javna provera NEPROVERENO |
| Venčanje | [Anemonin potpis](https://napravipozivnicu.com/pozivnice/pozivnica-za-vencanje-bele-anemone/) | [Pregled](https://github.com/101bgd/napravipozivnicu/blob/robi-agent/content/robi-batches/2026-10-27/replacement-01/previews/anemonin-potpis.webp) | Deploy potvrđen; javna provera NEPROVERENO |
| Krštenje | [Plava nit blagoslova](https://napravipozivnicu.com/pozivnice/pozivnica-za-krstenje-plava-brojanica-srebrni-krst/) | [Pregled](https://github.com/101bgd/napravipozivnicu/blob/robi-agent/content/robi-batches/2026-10-27/replacement-01/previews/plava-nit-blagoslova.webp) | Deploy potvrđen; javna provera NEPROVERENO |
| Proslava rođenja | [Polarni mali zagrljaj](https://napravipozivnicu.com/pozivnice/pozivnica-proslava-rodjenja-decaka-polarni-medvedi/) | [Pregled](https://github.com/101bgd/napravipozivnicu/blob/robi-agent/content/robi-batches/2026-10-27/replacement-01/previews/polarni-mali-zagrljaj.webp) | Deploy potvrđen; javna provera NEPROVERENO |

Publika je muška u pet kategorija, venčanje je za par, dečji primer za šest godina. Stara serija je povučena i ne sme da se vrati automatski.

## Stvarne dimenzije

Svih šest izvora je **1060 × 1484 px**, tačno5:7. Izvoz je **1500 × 2100 px**, uvećan kroz postojeći renderer bez kadriranja, uz neizmenjene izvore. WebP pregledi su500 × 700px. PNG sadrži300dpi metapodatke, PDF je127 × 177,8mm, odnosno360 × 504pt. Izvozna rezolucija nije predstavljena kao izvorna.

## Izgled, tipografija i stvarne provere

Za svaki šablon je popunjeno19/19preobjavnih provera sa dokazima. Odvojeno su vizuelno pregledani svih šest izvornih slika, šest finalnih pregleda zajedno, šest proširenih390pxmobilnih editora i šest otvorenih personalizovanih PDF rastera. Provereno je18PNG i12PDF datoteka. Duga imena, srpska slova, adrese, kontrast, stvarne granice teksta, nepreklapanje, izmenjiva polja i uzrast10prošli su u stvarnim editorima i izvozima.

Pozadine i tipografija pregledane su kao celina, uz konkretno obrazloženje svakog rasporeda u[visual-review.json](visual-review.json). Izabrano je šest fontrezova izBricolageGrotesque, Sora, BodoniModa iLora; nijedan fontpar odbačene serije nije samo prekopiran. Svi izabrani rezovi stvarno imajuČĆŠŽĐčćšžđ. Italiana iPrataodbačeni su zbog nedostajućih srpskih slova. Latin/Latin-extpodskupovi spojeni su uWOFF2, interni nazivi izmenjenih fontova preimenovani su radiRFNpravila, a izvorneOFLlicence sačuvane. Naziv fonta ili tehnički prolazak nije dokaz korisnikovog estetskog odobrenja.

Šest neispravnih pozadinskih pokušaja odbačeno je i zamenjeno drugim motivima/kompozicijama, bez uređivanja odbijenih slika. Kod Kobaltnog preloma tekst je pomeren u čisto tamno polje iznad svetlih metalik linija, pa su završne provere ponovljene. Primarne ilustracije i tekst provereni su protiv60pxsigurne margine; sekundarna kontinuirana vegetacija, tekstura i apstraktne površine namerno mogu ići do reza. Nije tvrđeno da je svaki pozadinski list u sigurnoj zoni.

Raznovrsnost je pregledana kroz stvarne motive, kompozicije i palete, uz99istorijskih pozadina i15novih parova. Nema identičnih slika; dopunsko najmanje pHash rastojanje je14/63prema istoriji i22/63među novim slikama. Ta mera nije estetska ocena. Dečja džungla ima izraženu smaragdnu/narandžastu paletu,18.rođendan kobalt/grafit, a ostale kategorije zasebne tople ili svečane palete.

Build, celokupan produkcijski smoke320–1440px, svih šest editora/PNG/PDFtokova, Worker API/stranice/sitemap, kategorije i SEO naslovi/canonical/strukturirani podaci svih97pozivnica prošli su. Početni JS je7135gzipbajta; editor, fontovi i PDF ostaju lenji. AdSense integracija je proverena na113lokalnih stranica, uz simulacije i bez stvarnihGooglezahteva. Postojeći identifikatori i globalna podešavanja su nasleđeni; SDK se ne duplira i oglasa nema u izvozima. Stvarna isporuka oglasa nije potvrđena.

## Arhiva, očuvanje i blokada

Na kontrolnoj grani su sačuvane i pročitane nazad **48 binarne datoteke,61.225.274bajta**, i početnih **79 tekstualnih zapisa**. Arhiva obuhvata šest izvora, šest odbačenih pokušaja, šest finalnih fontova, šest WebP pozadina, šest pregleda, šest mobilnih prikaza, šest PNG i šest PDF primera, promptove, ponovljive skripte, licence i dokaze. Dodatni personalizovani PNG/PDF i stres PNG ostaju lokalno, otvoreni i provereni. Manifest:[artifact-manifest.json](artifact-manifest.json).

Nova produkcijska objava je jedan31-filecommit i jedan očekivani-SHA fast-forward bez force-push-a. Potvrđeni su31produkcijski hash i13stvarnih tekstova. Sačuvana je451nepovezana roditeljska datoteka i36prethodnih Robijevih šablona; svih16povučenih datoteka stare serije i dalje je odsutno. [production-readback.json](production-readback.json),[deployment-check.json](deployment-check.json).

Svih šest stvarnihHTTPSGETpokušaja posle potvrde deploy-a, u **20:56:10 po Tokiju**, blokirao je proxy sa **Tunnel connection failed:403Forbidden**, pre odgovora odredišnog sajta. Mrežna pravila nisu zaobilažena. Javne stranice, editor, izvozi, SEO, kategorije/sitemap i stvarna AdSenseintegracija ostaju **NEPROVERENO**. Dokaz:[public-live-checks.json](public-live-checks.json).

Konačno stanje je **BLOKIRANO / post_publication_verification**:6pripremljeno,6deploy-ovano,0potpuno javno verifikovano. Ne praviti duplikat ni vraćati odbačenu seriju; nastaviti samo nedovršene dozvoljene javne provere. Sledeći kreativni plan je ženska publika, dečji uzrastšest, dok potvrđeni brojači čekaju kompletnu javnu verifikaciju.

Poeni ostaju **1/50**: mesečni1, bonus0. Nema novog boda niti izmišljene korisnikove ocene. Završni izveštaj se dostavlja krozChatGPT; samo pisanje datoteke nije dokaz uručenog obaveštenja.
