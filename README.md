# Napravi pozivnicu

Prva verzija sajta za domen `napravipozivnicu.com`. Sajt je na srpskom (latinica), prilagođen telefonu i računaru, sa neutralnim tonovima i blagim animacijama. Radi kao statička aplikacija: nema servera za korisničke podatke, naloga, plaćanja ili oglasa.

## Pokretanje

Potreban je Node.js 24 (provereno sa 24.19.0) i npm.

```sh
cd /workspace/napravipozivnicu
npm ci --cache /workspace/.npm-cache
npm run dev -- --port 5173
```

Produkcijska verzija:

```sh
npm run build
npm run preview -- --port 4173
```

Objavi sadržaj direktorijuma `dist/` na statičkom hostingu. Domen je kupljen; povezivanje domena i javna objava sajta još nisu urađeni. Fontovi i sve biblioteke se isporučuju sa sajtom; rad aplikacije ne zavisi od spoljašnjeg servisa.

## Funkcije

- Šest kategorija: 1. rođendan, 18. rođendan, ostali rođendani, venčanje, krštenje, rođenje deteta.
- Dvanaest probnih šablona, filtriranje i pretraga.
- Editor naslova, imena, poruke, datuma, vremena i mesta proslave sa pregledom uživo.
- JPG/PNG/WebP fotografija do 15 MB, kružni okvir, pomeranje prevlačenjem ili klizačima i uvećanje.
- Izbor fonta i pozadine; boja teksta se prilagođava kontrastu.
- Besplatan PNG 1500 × 2100 px i PDF 127 × 177,8 mm sa slikom u 300 dpi, bez vodenog žiga.
- Nacrt teksta u lokalnom skladištu pregledača. Fotografija ostaje u memoriji i ne čuva se u nacrtu.
- Podrška za tastaturu, modalni editor i smanjeno kretanje prema podešavanju uređaja.

PDF je za štampu u stvarnoj veličini (100%), bez prepusta i oznaka za sečenje. Za štampariju koja zahteva prepust potrebno je naknadno dodati taj format.

## Dodavanje pravih šablona

Probni dizajni su opisani u `src/templates.js`. Dodaj objekat sa jedinstvenim `id`, nazivom `name`, kategorijom `category`, postojećim stilom `style`, bojama `bg`, `ink`, `accent` i početnim tekstom `title`, `names`, `note`. Kategorije su `first`, `eighteen`, `birthday`, `wedding`, `baptism`, `baby`.

Ilustracije i raspored crtaju se u `src/render.js`; novi raspored ili grafički motiv zahteva novu granu renderera. Uvezeni gotovi dizajni (npr. PNG/SVG iz Canve) zahtevaće definisanje zasebnih mesta za tekst i fotografiju. Trenutni editor podržava postojeće probne rasporede, a ne proizvoljno učitavanje novih šablona kroz administratorski panel.

Broj dizajna u katalogu ažurira se automatski.

## Provere

```sh
npm run build
npm test
```

Test koristi instalirani Chromium iz `/usr/bin/chromium` (drugu lokaciju postavi kroz `CHROMIUM_PATH`). Sam pokreće Vite na portu 5175 i gasi svoj server po završetku. Proverava svih šest kategorija, pretragu, editor, fotografiju, prevlačenje i zumiranje, vraćanje nacrta, stvarne PNG/PDF datoteke i njihove dimenzije, mobilni prikaz i meni, zatvaranje tastaturom i greške pregledača. Testne slike i PDF su u `/tmp/`.

## Pre javnog lansiranja

Povezati kupljeni domen `napravipozivnicu.com`, objaviti sajt i ubaciti konačne šablone. AdSense integracija je ostavljena za kasnije; trenutno nema reklamnih skripti, analitike ni kolačića za praćenje. Ako se uvedu oglasi, dodati odgovarajuće informacije o privatnosti i saglasnost za oglase prema njihovim zahtevima.
