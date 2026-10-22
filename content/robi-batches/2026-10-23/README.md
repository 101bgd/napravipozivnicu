# Robi — 23.10.2026.: BLOKIRANO

Generator slika kroz ChatGPT vratio je HTTP 400: `Unknown parameter: 'reasoning'.` I pojedinačni ponovni poziv sa samo promptom vratio je istu grešku. Nije dobijena nijedna izvorna slika. Ova serija nije objavljena i ne računa se kao uspešna isporuka.

Pripremljeno je šest stvarnih nacrta rasporeda prema postojećim `src/template-schema.js` i `src/design-renderer.js`, sa krupnijim tekstom, povezanim uzrastom/povodom i novim raznovrsnim paletama. Dečji uzrast je četiri, publika muška gde je primenljivo; venčanje je za par. Izbor je kreativni plan iz trajnog stanja; potvrđeni redosled nije pomeren dok se čeka javna verifikacija ranijih objava.

**Sve u `diagnostics/` je isključivo probni tekst na ravnoj planiranoj boji, BEZ originalne ilustracije. Nije finalna pozivnica, ne sme u katalog i nije dokaz da su provere originalne pozadine/palete prošle.** PNG dijagnostika je 1500×2100px, WebP pregled 500×700px, PDF 127×177,8mm. Izvorne i konačne dimenzije novih ilustracija: NEPROVERENO / nema datoteka.

## Datoteke

- `plan.json` / `image-prompts.json`: šest novih motiva, promptovi i planirane palete.
- `metadata.json`: nacrt naziva/motiva/SEO/alt/opisa; nakon generisanja obavezno uskladiti sa stvarnim slikama.
- `designs.mjs` / `designs.json`: izmenjivi rasporedi; `asset-ids.json`: stabilni budući ID-jevi. Njihovo postojanje nije dokaz učitanih novih slika.
- `prepare.mjs`: ponovljiva priprema koristeći postojeći renderer i fontove. Normalni režim odbija rad bez svih šest `sources/<id>.png`.
- `diagnostics/report.json`, `font-checks.json`, `draft-schema-checks.json`: stvarni ograničeni tehnički rezultati.
- `quality-checklist.json`: sve stavke PROŠLO/PALO/NEPROVERENO, dokazi i ograničenja.
- `generation-error.json`, `report.json`, `REPORT.md`: stvarna blokada, statusi i nastavak.

## Nastavak

Pripremi projekat sa aktuelnog main (osnova ovog nacrta `feffa51c14184258ab1573468b75eb56cd6ac352`) i kopiraj ovu radnu fasciklu sa kontrolne grane. Sačuvaj sve novije korisnikove izmene. Instaliraj projektne zavisnosti ako nedostaju; koristi sistemski Chromium.

Za proveru samo nacrta: `node content/robi-batches/2026-10-23/prepare.mjs --diagnostic-layouts`.

Tek kada svih šest novih originala postoji: `node content/robi-batches/2026-10-23/prepare.mjs`. Posle stvarnog vizuelnog pregleda prilagodi raspored svakom originalu; ne prihvataj sadašnju ravnu dijagnostičku podlogu kao finalnu. Zatim uradi sve obavezne provere i grupnu objavu po RUNBOOK-u. Otkazanu kalibraciju i ranije objavljene dizajne ne koristi kao nove pozadine.
