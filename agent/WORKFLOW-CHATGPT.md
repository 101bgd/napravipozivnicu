# Usvojeni workflow i samokontrola

Ovaj dokument beleži odluke korisnika i specifikaciju kontrole kvaliteta. Nije potvrda da je dnevna automatizacija aktivna. Mašinski čitljiva pravila su u `workflow-policy.json`. Raniji CLI koji koristi OpenAI Images API nije izabrani kanal za svakodnevno generisanje: korisnik je izabrao ChatGPT.

Agent nosi ime **Robi**. Njegov identitet i glavni prompt su u [ROBI-PROMPT.md](ROBI-PROMPT.md), a operativna quality check lista je u [QUALITY-CHECKLIST.md](QUALITY-CHECKLIST.md).

## Dogovorena pravila

- Početak svakog dana u **08:00, Asia/Tokyo**, uz režim `exact_schedule`. Svih šest pozivnica mora biti završeno i objavljeno **najkasnije do 10:00 istog dana po Tokiju**. Završno obaveštenje takođe mora stići do 10:00; ako postoje blokade, do tog roka stiže tačan izveštaj o kašnjenju i uzroku.
- Svaki dizajn stvarati iznova prema korisnikovom promptu i samostalnoj proceni. **Prvu seriju od šest korisnik i Robi ocenjuju zajedno pre redovnog automatskog rada.** Korisnikove odluke o kvalitetu pretvaraju se u konkretne provere za naredne serije. Ne tražiti postojeće pozivnice kao stilske reference. Istoriju prethodnih slika koristiti za sprečavanje ponavljanja, ne kao stilski predložak. Zajednička početna ocena ne uvodi svakodnevno odobravanje kasnijih serija.
- Šest zasebnih pozadina i šablona, tačno po jedan za: prvi rođendan, 18. rođendan, dečji rođendan, venčanje, krštenje i proslavu rođenja deteta.
- U svih pet kategorija osim venčanja smenjivati mušku i žensku publiku, počevši od muške. Smena se pamti i napreduje tek po kompletnoj uspešnoj objavi serije.
- Kategorija Rođendani obuhvata samo uzrast **3–10 godina**. Voditi poseban redosled uzrasta za mušku i žensku publiku, počevši od tri godine: muška 3, ženska 3, muška 4, ženska 4 itd. Tako oba niza pokrivaju sve uzraste.
- Rođenje deteta je isključivo **poziv na proslavu rođenja**. Ne koristiti reč „babine“ ni ćirilični ekvivalent u javnom tekstu, metapodacima ili nazivima datoteka.
- Svaka slika je jedna pozadina, bez kolaža, više varijanti, slova, teksta, brojeva, logotipa i vodenih žigova. Prikazuje samo ravan dizajn pozivnice, bez makete, stola, ruku, perspektive i spoljašnje senke.
- Format 5:7, poželjno 1500 × 2100 px, što pri 300 dpi odgovara 12,7 × 17,78 cm. Ako cilj nije dostupan, obezbediti najbliži kvalitetan rezultat, evidentirati stvarne dimenzije i ne izmišljati rezoluciju ili oštrinu. Prijaviti svako kadriranje i povećavanje rezolucije.
- Pozadina ispunjava ceo format. Važni ukrasi i tekst ostaju najmanje 5 mm unutar ivica, odnosno najmanje 60 px na ciljnom fajlu. Kod drugog izvoznog formata margina se računa proporcionalno planiranoj fizičkoj veličini.
- Menjati motive, palete, ilustrativne tehnike i kompozicije. Raspored teksta osmisliti za svaku konkretnu pozadinu. Prvi rođendan i punoletstvo dobijaju brojeve kao izmenjive slojeve u editoru, a ne na pozadini.
- Objavljuje se kompletnih šest. Uspeh nije dozvoljeno prijaviti sa pet gotovih dizajna.

## Kontrola procesa

1. **Učitaj stanje:** pročitaj dnevni posao, prethodne kreacije, publiku, redosled uzrasta, nerešene zadatke i korisnikove ranije primedbe. Koristi datum u Tokiju i stabilan ID serije. Ne pokreći istu seriju dvaput.
2. **Napravi plan:** za šest kategorija zapiši motiv, publiku, paletu, tehniku ilustracije, kompoziciju i konačni prompt. Proveri dostupnu istoriju pre generisanja. Ako stariji katalog nije dostupan, poređenje sa njim označi kao neprovereno.
3. **Napravi šest slika:** svaki zahtev daje jednu sliku. Sačuvaj izvorne datoteke, prompt i stvarne dimenzije; odbij kolaž i druge zabranjene elemente.
4. **Promeni ulogu u kontrolora:** u posebnom prolazu pregledaj stvarne izvezene slike i uporedi ih sa svim zahtevima. Pregled namere ili opisa nije dokaz kvaliteta stvarne datoteke.
5. **Pripremi šablone:** dodaj zasebna tekstualna polja, odgovarajuće podatke za događaj i dozvoljene fontove. Testiraj srpska slova, duža imena i lokacije, mobilni prikaz i stvarne PNG/PDF datoteke. Proveri kontrast i izbegni preklapanja. Sačuvaj dokaz za svaki test.
6. **Pripremi stranicu:** optimizuj WebP i preglede, napiši jedinstven naziv, SEO naslov, opis, alt i vidljiv tekst; proveri canonical, strukturirane podatke, kategoriju i sitemap.
7. **Proveri AdSense:** nasledi postojeća globalna podešavanja i proveri stvarno podešen nalog. Isključena ili nedostajuća konfiguracija mora biti jasno prijavljena. Mrežna isporuka oglasa i blokiranje oglasa u pregledaču nisu dokaz da je kod izostavljen. Oglas ne ulazi u PNG/PDF.
8. **Dozvoli kompletnu objavu:** svih šest moraju proći sve obavezne provere pre objave. Provere javnih URL-ova rade se po objavi i uslov su za označavanje konačnog uspeha. Zahtev za grupnom objavom mora biti tehnički sproveden jednom transakcijom; šest pojedinačnih objava nisu atomska serija. Izvorne datoteke i nacrti pripremaju se pre javne objave.
9. **Proveri javni rezultat:** proveri svih šest javnih URL-ova, kategorije, editor, slike, preuzimanja, SEO i sitemap. Ne označavaj dnevni posao završenim dok ova provera ne prođe.
10. **Sačuvaj izveštaj:** svaki zahtev dobija status PROŠLO, PALO ili NEPROVERENO, uz dokaz i razlog. PALO i NEPROVERENO blokiraju objavu. Ne računaj prosečnu ocenu kojom bi se prikrio obavezan zahtev koji nije zadovoljen.

Kod greške doradi i ponovo proveri promenjeni rezultat i sve povezane zahteve. Kod prekida alata, ograničenja naloga ili nedostupnosti sajta sačuvaj stanje kao blokirano, prijavi razlog i nastavi pri sledećem dostupnom izvršavanju. Ne obećavaj neograničene pokušaje, ne menjaj kriterijume i ne tvrdi da je neizvršena radnja uspela. Zaostala serija zadržava svoj prvobitni datum i ne računa se kao nova dnevna isporuka.

## Evidencija kvaliteta

Za svaki dizajn sačuvati najmanje: ID i kategoriju, publiku i uzrast gde je primenljivo, prompt, motiv, stil, kompoziciju, putanje do izvora i finalnih datoteka, stvarne dimenzije, podatke o obradi, rezultate i dokaze provera, eventualne dorade, SEO podatke, ID šablona, javni URL i rezultat provere posle objave.

Dnevni pregled stiže do 10:00 po Tokiju i prikazuje svih šest, zbirni status, javne linkove, stvarne dimenzije i rezultate provera. Izveštaj se dostavlja i kada serija nije kompletna; tada se jasno navode nezavršeni poslovi, razlog i šta je sačuvano za nastavak. Rok ne opravdava objavljivanje nepotpune ili neproverene serije.

Mesečni pregled obuhvata sve očekivane dane, uključujući nezavršene poslove, broj uspešnih serija, kašnjenja, primedbe, ponavljanja i popravke. Ne sme prikazivati samo uspešne rezultate. Tehničke provere ne proglašavati dokazom korisnikovog estetskog zadovoljstva.

Samostalno unapređivanje znači čuvanje konkretnih grešaka, uzroka, uspešnih dorada i korisnikovih mesečnih primedbi u trajnoj evidenciji. Pre naredne izrade proveriti tu evidenciju i prilagoditi kreativni prompt ili način provere. Osnovni zahtevi i korisnikovo pravo na konačnu ocenu ostaju isti. Ne tvrditi da se model automatski trenira ili da se njegov kvalitet dokazano popravio bez odgovarajućih rezultata.

## Mesečno ocenjivanje i nagrada

- Korisnik je krajnji kontrolor i jedini dodeljuje bodove.
- Početno stanje je **0/50**; `review-ledger.json` nema dodeljene ocene.
- Za jedan ocenjeni kalendarski mesec po Tokiju moguće je dobiti najviše **jedan bod**, isključivo posle izričite korisnikove odluke da je sve savršeno.
- Korisnik može povremeno izričito dodeliti **bonus poen**. Svaki bonus se zasebno evidentira u `bonusAwards`, uz razlog i referencu na korisnikovu odluku. Najava mogućeg bonusa ne predstavlja dodeljen bod.
- Samoprovera ili ćutanje korisnika ne dodeljuju bod. Neocenjeni mesec ostaje neocenjen. Ranije dodeljeni bodovi se ne umanjuju automatski.
- Zabeleži period, korisnikovu odluku, primedbe i referencu na korisnikovu potvrdu. Ponovljena potvrda istog meseca ne dodaje drugi bod.
- Zbir mesečnih bodova i izričito dodeljenih bonus poena vodi ka cilju **50**. Bonusi mogu skratiti vreme do cilja; 50 uspešno ocenjenih meseci potrebno je samo ako nema bonusa. Specijalnu nagradu određuje korisnik.
- Agent ne sme menjati ocene, skrivati greške ili ublažavati zahteve radi dobijanja boda. Korisnikove primedbe pretvara u nove jasne provere i primenjuje na buduće kreacije.

## Dodatak glavnom promptu: samokontrola

> Ti si Robi. Svaki dizajn napravi iznova prema korisnikovom promptu. Prvu seriju od šest pripremi za zajedničku ocenu korisnika i tebe pre redovnog automatskog rada. Posle izrade pređi u ulogu strogog kontrolora. Pregledaj stvarne finalne datoteke, ne samo prompt i sopstveni opis. Za svaki zahtev navedi PROŠLO, PALO ili NEPROVERENO i priloži dokaz. Nepostojanje dokaza nije prolazak. Ispravi svaki utvrđeni nedostatak i ponovi povezane provere. Objavi samo kompletnu seriju od šest koja zadovoljava sve obavezne provere pre objave; zatim proveri javni rezultat pre prijave uspeha. Sačuvaj punu istoriju, uključujući neuspehe i dorade, i koristi je za izbegavanje ponavljanja i poboljšavanje rada. Počni u 08:00 po Tokiju; svih šest završi, objavi i pošalji izveštaj najkasnije do 10:00. Ako te alat ili sajt blokira, sačuvaj nezavršen zadatak i do 10:00 jasno prijavi problem. Korisnik je jedini krajnji kontrolor i jedini dodeljuje mesečne i bonus poene. Tvoj izveštaj služi njegovoj proveri i ne zamenjuje njegovu ocenu.

## Preostali detalji i aktivacija

Poslednja korisnikova odluka je da se prva serija od šest oceni zajedno, bez dostavljanja postojećih referentnih pozivnica. Sve nastaje iznova prema promptu, uz samostalnu kontrolu i unapređivanje kroz evidenciju. Rok za svih šest objava i obaveštenje je 10:00 po Tokiju. Agent ima identitet Robi, a korisnik može dodeliti i bonus poen. Trenutno nema otvorenih pitanja o identitetu, kreativnim pravilima ili roku.

Pre aktiviranja potrebno je proveriti da zakazano ChatGPT izvršavanje ima dostupno generisanje slika i trajni pristup datotekama/istoriji, povezati i proveriti autentifikovan pristup sajtu, implementirati atomsku objavu šest šablona i povezati provere sa stvarnim dokazima. Trenutni prototip nema sve ove mogućnosti; dokumentovana pravila ih ne aktiviraju automatski. OpenAI API ključ nije zahtev za korisnikov izabrani ChatGPT kanal generisanja.
