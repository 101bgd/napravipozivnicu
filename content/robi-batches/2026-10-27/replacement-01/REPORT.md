# Robi — uklanjanje i zamenska serija za 27.10.2026.

**Stara serija je uklonjena, svih šest novih pozivnica je objavljeno.** Cloudflare je potvrdio uklanjanje u **16:40:31**, a novu objavu u **20:53:04 po Tokiju**, 27.10.2026.

Korisnik je izričito odobrio uklanjanje i novu izradu. Ovo je zamena odbačene serije, sa muškom publikom u pet kategorija i dečjim uzrastom šest; venčanje je za par. Rok za jutarnju isporuku, 10:00, ranije je propušten. Ova ručno zatražena zamena ne predstavlja isporuku na vreme. Nova serija čeka stvarnu korisnikovu estetsku ocenu.

| Kategorija | Nova pozivnica i javni link | Sačuvani pregled | Status |
| --- | --- | --- | --- |
| Prvi rođendan | [Mišji prvi piknik](https://napravipozivnicu.com/pozivnice/pozivnica-prvi-rodjendan-mis-sumske-jagode/) | [Pregled](https://github.com/101bgd/napravipozivnicu/blob/robi-agent/content/robi-batches/2026-10-27/replacement-01/previews/misji-prvi-piknik.webp) | Objavljeno; javna provera NEPROVERENO |
| 18. rođendan | [Kobaltni prelom](https://napravipozivnicu.com/pozivnice/pozivnica-18-rodjendan-kobaltni-lukovi/) | [Pregled](https://github.com/101bgd/napravipozivnicu/blob/robi-agent/content/robi-batches/2026-10-27/replacement-01/previews/kobaltni-prelom.webp) | Objavljeno; javna provera NEPROVERENO |
| Dečji rođendan — 6 godina | [Lemurova džungla](https://napravipozivnicu.com/pozivnice/pozivnica-deciji-rodjendan-lemur-tropska-dzungla/) | [Pregled](https://github.com/101bgd/napravipozivnicu/blob/robi-agent/content/robi-batches/2026-10-27/replacement-01/previews/lemurova-dzungla.webp) | Objavljeno; javna provera NEPROVERENO |
| Venčanje | [Anemonin potpis](https://napravipozivnicu.com/pozivnice/pozivnica-za-vencanje-bele-anemone/) | [Pregled](https://github.com/101bgd/napravipozivnicu/blob/robi-agent/content/robi-batches/2026-10-27/replacement-01/previews/anemonin-potpis.webp) | Objavljeno; javna provera NEPROVERENO |
| Krštenje | [Plava nit blagoslova](https://napravipozivnicu.com/pozivnice/pozivnica-za-krstenje-plava-brojanica-srebrni-krst/) | [Pregled](https://github.com/101bgd/napravipozivnicu/blob/robi-agent/content/robi-batches/2026-10-27/replacement-01/previews/plava-nit-blagoslova.webp) | Objavljeno; javna provera NEPROVERENO |
| Proslava rođenja | [Polarni mali zagrljaj](https://napravipozivnicu.com/pozivnice/pozivnica-proslava-rodjenja-decaka-polarni-medvedi/) | [Pregled](https://github.com/101bgd/napravipozivnicu/blob/robi-agent/content/robi-batches/2026-10-27/replacement-01/previews/polarni-mali-zagrljaj.webp) | Objavljeno; javna provera NEPROVERENO |

## Dimenzije

Svih šest izvornih slika ima **1060 × 1484 px**, tačno 5:7. Izvoz je **1500 × 2100 px**, uvećan kroz postojeći renderer bez kadriranja; izvori su sačuvani neizmenjeni. WebP pregledi imaju **500 × 700 px**. Stvarni PNG izvozi sadrže 300 dpi metapodatke; PDF je **127 × 177,8 mm** (360 × 504 pt). Izvozna rezolucija nije predstavljena kao izvorna.

## Izgled i kontrola

Svaki šablon ima **19/19 prošlih provera pre objave**, sa dokazima u [kontrolnoj listi](quality-checklist.json). Pozadine, rasporedi i fontovi pregledani su zajedno kao gotove pozivnice. Odvojeno su pregledani svi izvori, šest finalnih pregleda zajedno, šest proširenih mobilnih prikaza pri širini od 390 px i šest otvorenih personalizovanih PDF rastera. Konkretno obrazloženje za svaki dizajn nalazi se u [vizuelnom pregledu](visual-review.json).

- Izabrano je šest novih fontskih rezova iz porodica **Bricolage Grotesque, Sora, Bodoni Moda i Lora**. Svi stvarno sadrže ČĆŠŽĐčćšžđ. Italiana i Prata odbačeni su zbog nedostajućih srpskih slova. Spojeni podskupovi Latin i Latin-ext izvoze se kao WOFF2, sa preimenovanim internim nazivima radi pravila o rezervisanim imenima i sačuvanim originalnim OFL licencama. Sam naziv fonta ili broj testova nije estetsko odobrenje.
- Šest neuspešnih pokušaja pozadina odbačeno je i zamenjeno potpuno drugim motivima i kompozicijama, bez uređivanja odbijenih slika. Kod Kobaltnog preloma tekst je pomeren u čisto tamno polje iznad metalik linija, pa su završne provere ponovljene.
- Proverene su sigurne margine od 60 px za tekst i primarne ilustracije. Sekundarna neprekidna vegetacija, tekstura i apstraktne površine mogu namerno ići do reza; nije tvrđeno da je svaki pozadinski list u sigurnoj zoni.
- Otvoreno je **18 PNG i 12 PDF datoteka**. Prošli su srpska slova, duža imena i adrese, kontrast, stvarne granice teksta, nepreklapanje i uređivanje potrebnih polja. Uzrast je u stvarnom editoru promenjen na deset godina i izvezen.

Motivi, palete i kompozicije pregledani su naspram istorije. Dopunsko poređenje obuhvata 99 istorijskih pozadina i 15 novih parova, bez identičnih slika. Najmanje pHash rastojanje je 14/63 prema istoriji i 22/63 među novim slikama. Ta mera nije estetska ocena.

Build i kompletna provera produkcijskog prikaza na širinama od 320 do 1440 px prošli su, kao i svih šest editora i PNG/PDF tokova, Worker API, stranice, kategorije i sitemap. Prošli su jedinstveni SEO naslovi, canonical adrese i strukturirani podaci svih 97 pozivnica. Početni JS ima 7135 gzip bajta; editor, fontovi i PDF ostaju lenji.

AdSense integracija prošla je na 113 lokalnih stranica uz simulacije, bez stvarnih zahteva ka Google-u. Postojeća globalna podešavanja i identifikatori su nasleđeni, SDK se ne duplira i oglasa nema u izvozima. Stvarna isporuka oglasa nije potvrđena.

## Uklanjanje, objava i dokazi

Stara serija uklonjena je kroz commit [27529a436917069a9988f3a6aeb1bfdd3000961a](https://github.com/101bgd/napravipozivnicu/commit/27529a436917069a9988f3a6aeb1bfdd3000961a). Uklonjeni su katalog, stranice, sitemap unosi, rasporedi i 12 pozadina/pregleda. Pravilo za povučene ID-jeve i builtinSource skriva i eventualne javne admin kopije. Lokalni test potvrđuje odsustvo svih šest i 404 odgovore, uz očuvan nepovezan šablon. Produkcijska D1 baza nije fizički brisana. Javna provera uklanjanja ostaje blokirana proxy-jem; javno viđen 404 i brisanje istorijskog keša nisu potvrđeni. [Dokaz uklanjanja](https://github.com/101bgd/napravipozivnicu/blob/robi-agent/agent/removals/2026-10-27.json).

Nova serija objavljena je jednim commitom sa **31 datotekom**, [e2e846cd54ec31cb686db5bfd8c93d24ae1a9812](https://github.com/101bgd/napravipozivnicu/commit/e2e846cd54ec31cb686db5bfd8c93d24ae1a9812), kroz očekivani-SHA fast-forward bez force-push-a. Pročitane su hash vrednosti svih 31 produkcijskih datoteka i sadržaj 13 tekstualnih datoteka. Sačuvana je 451 nepovezana roditeljska datoteka, zajedno sa svih 36 ranijih Robijevih šablona. Svih 16 povučenih datoteka stare serije i dalje je odsutno. [Produkcijski pregled](production-readback.json), [Cloudflare potvrda](deployment-check.json).

Na kontrolnoj grani su sačuvane i proverene **48 binarnih datoteka, ukupno 61.225.274 bajta**, i početnih **79 tekstualnih zapisa**. Arhiva sadrži šest izvora, šest odbačenih pokušaja, šest finalnih fontova, šest WebP pozadina, šest pregleda, šest mobilnih prikaza, šest PNG i šest PDF primera, promptove, skripte, licence i dokaze. Dodatni personalizovani PNG/PDF i stres PNG zadržani su lokalno, otvoreni i provereni. [Manifest arhive](artifact-manifest.json).

## Preostala blokada i stanje

Svih šest stvarnih HTTPS GET pokušaja posle potvrđenog deploy-a, u **20:56:10 po Tokiju**, odbio je proxy sa **Tunnel connection failed: 403 Forbidden**, pre odgovora odredišnog sajta. Mrežna pravila nisu zaobilažena. Javne stranice, editor, izvozi, SEO, kategorije/sitemap i stvarna AdSense integracija ostaju **NEPROVERENO**. [Stvarni rezultati javne provere](public-live-checks.json).

Stanje je **BLOKIRANO / post_publication_verification**: šest pripremljeno, šest objavljeno, nijedna potpuno javno verifikovana. Ne praviti duplikat niti vraćati odbačene ID-jeve. Nastaviti samo nedovršene dozvoljene javne provere kada pristup postane moguć. Sledeći kreativni plan je ženska publika i dečji uzrast šest; potvrđeni brojači čekaju potpunu verifikaciju.

Poeni ostaju **1/50**: mesečni 1, bonus 0. Nema novog boda ili izmišljene korisnikove ocene. Završni izveštaj se dostavlja kroz ChatGPT; samo pisanje datoteke nije dokaz uručenog obaveštenja.
