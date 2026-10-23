# Robi — 23.10.2026., nova serija restart-01

**Svih šest novih pozivnica objavljeno je zajedno kroz potvrđen Cloudflare deploy u 2026-10-23T15:00:26.000+09:00.** Main commit: `6548fb92b4738b05752b40b133201f28aa2a2963`. Direktna javna provera iz ovog okruženja ostaje blokirana; serija nije označena kao published_verified.

| Kategorija | Naziv i javni link | Status | Pregled |
|---|---|---|---|
| Prvi rođendan | [Kornjačina prva radost](https://napravipozivnicu.com/pozivnice/pozivnica-prvi-rodjendan-mala-kornjaca/) | Deploy potvrđen; javna provera NEPROVERENO | [Pregled](previews/kornjacina-prva-radost.webp) |
| 18. rođendan | [Urbani puls](https://napravipozivnicu.com/pozivnice/pozivnica-18-rodjendan-skejtbord-limeta/) | Deploy potvrđen; javna provera NEPROVERENO | [Pregled](previews/urbani-puls.webp) |
| Dečji rođendan — 4 godine | [Robotova žurka](https://napravipozivnicu.com/pozivnice/pozivnica-deciji-rodjendan-veseli-robot/) | Deploy potvrđen; javna provera NEPROVERENO | [Pregled](previews/robotova-zurka.webp) |
| Venčanje | [Ždralov zavet](https://napravipozivnicu.com/pozivnice/pozivnica-za-vencanje-dva-zlatna-zdrala/) | Deploy potvrđen; javna provera NEPROVERENO | [Pregled](previews/zdralov-zavet.webp) |
| Krštenje | [Kap blagoslova](https://napravipozivnicu.com/pozivnice/pozivnica-za-krstenje-zlatna-kapljica-krst/) | Deploy potvrđen; javna provera NEPROVERENO | [Pregled](previews/kap-blagoslova.webp) |
| Proslava rođenja | [Lavlje malo sunce](https://napravipozivnicu.com/pozivnice/pozivnica-proslava-rodjenja-decaka-lavic-sunce/) | Deploy potvrđen; javna provera NEPROVERENO | [Pregled](previews/lavlje-malo-sunce.webp) |

## Izrada i korisnikovo novo pravilo

Na izričit zahtev korisnika ceo nezavršeni dnevni posao počeo je iznova u 2026-10-23T14:19:22.000+09:00. Nisu korišćeni jutarnji nacrti, probni zmaj ili otkazana kalibracija. Napravljeno je 11 novih originalnih slika kroz ChatGPT: pet je odbačeno zbog prebliskih/cropovanih važnih motiva, a za iste kategorije napravljeni su potpuno drugačiji novi motivi. Konačnih šest su kornjača, skejtbord, robot, ždralovi, zlatna kapljica sa krstom i lavić. Novo trajno pravilo je sačuvano u agent/feedback/2026-10-23-redesign-policy.json, promptu, politici, check listi i RUNBOOK-u.

Publika je muška u pet kategorija osim venčanja; dečji primer je za četiri godine, sa izmenjivim uzrastom 3–10. Motivi, kompozicije i palete su upoređeni sa 68 istorijskih/odbačenih slika; najmanja razlika novih parova je 20/63 po pHash-u. Ovo je pomoć pri poređenju, bez izmišljanja korisnikove estetske ocene.

## Stvarne dimenzije i izvozi

Za svih šest: **izvor 1060×1484px, tačno 5:7; finalni WebP/PNG 1500×2100px, uvećano bez kadriranja; pregled 500×700px; PDF 127×177,8mm**. Ne tvrdi se da je model izvorno proizveo 1500×2100.

Izmenjiv tekst je napravljen postojećim rendererom i template-schema projekta. Veće ime i smislenija iskorišćenost prostora, povezan broj uzrasta i naziv događaja i optički centrirane kompozicije provereni su na stvarnim pregledima. Svaka slika ima zaseban raspored. Robotov datum/vreme postavljeni su iznad antene radi kontrasta, a početni rasporedi potvrde dolaska prilagođeni su donjim marginama pre završne kontrole. Odbačene pozadine nisu popravljane.

## PROŠLO pre objave

- Build i postojeći produkcijski smoke test.
- Svih šest stvarnih mobilnih editora, izmena imena/lokacije i preuzimanje stvarnih PNG/PDF fajlova; promena dečjeg uzrasta na 10.
- Podrazumevani i duži tekst: margine, preklapanja i kontrast na stvarnim pozadinama.
- Tri postojeća OFL fonta i sva srpska latinična slova u stvarnim WOFF2 fajlovima.
- 18 stvarnih PNG fajlova provereno na 1500×2100; 12 stvarnih PDF fajlova otvoreno pomoću pdftoppm.
- Worker API, svih šest SEO stranica/kategorija i sitemap; svih 73 naslova pozivnica provereno bez JavaScript-a, uključujući canonical i strukturirane podatke.
- Postojeća AdSense integracija na 89 javnih stranica; jedinstven SDK i odvojen izvoz. Test koristi mock Google SDK, ne potvrđuje stvarnu isporuku oglasa. Postojeći publisher/settings nisu menjani.
- Lenji editor/fontovi i 7133 gzip bajta početnog landing/catalog JS-a.
- 35 arhivskih binarnih datoteka i 12 produkcijskih WebP fajlova provereno po stvarnim Git SHA vrednostima; izvori i šest podrazumevanih PNG/PDF primera čuvaju se na kontrolnoj grani. Dodatni stres/editor izvozi i mobilni snimci su i u lokalnom ZIP-u.

Tokom provera dopunjena je obavezna mapa motiva. Jedan zastareo produkcijski test usklađen je sa već postojećim aktuelnim tekstom o AdSense-u; javna politika i podešavanja oglasa nisu menjani.

## Objava, rok i preostala blokada

Svih šest objavljeno je jednim fast-forward commitom uz očekivani prethodni main SHA, bez force push-a i uklanjanja postojećih dizajna. Cloudflare potvrda je success, check 120267118567, završeno 2026-10-23T15:00:26.000+09:00.

**Rok 10:00 po Tokiju je propušten.** Ručni restart nije retroaktivno blagovremena isporuka. Ranije neuspešne probe i ova serija ne računaju se kao dve dnevne isporuke.

**NEPROVERENO posle objave:** javne stranice, katalog/editor i izvozi preko stvarnog domena, javni SEO/AdSense i stvarna isporuka oglasa. Pokušaj pristupa domenom vratio je `Tunnel connection failed:403Forbidden` kroz mrežnu putanju okruženja. To nije dokaz 403 odgovora samog sajta. Nije zaobiđena mrežna politika i nisu izmišljene provere. Lokalni end-to-end testovi i Cloudflare deploy jesu potvrđeni. Potvrđeni brojači publike/uzrasta se ne pomeraju dok obavezna verifikacija nije završena; kreativni sledeći plan je ženska publika, uzrast četiri.

## Poeni

**1redovni +0bonus =1/50.** Nema novog boda bez izričite korisnikove odluke; korisnik još nije dao estetsku ocenu ove serije.
