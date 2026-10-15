# Kolekcija pozivnica za svadbu — priprema

**Status: objava prve pozivnice je odobrena.** Posle pripreme prvog dizajna korisnik je zatražio „ažuriraj sajt da vidim“, čime je promenio prethodni dogovor da se sačekaju još dve pozadine. Ponoćna elegancija uključena je u `src/curated-catalog.js`; optimizovane datoteke su u `public/assets/pozivnice/ponocna-elegancija/`.

## 1. Ponoćna elegancija

- Originalna pozadina: preuzeta iz `Pozivnica za svadbu 3.zip`, 1060 × 1484 px, format 5:7. Sačuvana je bez promena u `sources/ponocna-elegancija-original.png`.
- Tema: tamnoplavi akvarel, beli i puder cvetovi, zlatne grančice.
- Raspored: kaligrafska imena na dijagonali, veliko zlatno „&“, datum i vreme u dva bloka, detalji proslave niže desno, van glavnih cvetnih motiva.
- Fontovi: Great Vibes za imena, postojeći Libre Caslon Display za datum i mesto, DM Sans za male natpise. Sloj za fotografiju ne postoji.
- `ponocna-elegancija.mjs` proizvodi normalizovan dizajn za postojeći admin/API. Objavljena verzija koristi eksplicitno mapirane javne datoteke iz `src/curated-assets.js`. Admin opcija „Gotovi dizajni → Uredi dizajn“ pravi nezavisan nacrt i kopira njegove pozadine i fontove u R2. Objavljivanje prerade zamenjuje izvorni dizajn uz očuvan URL.
- `fonts/great-vibes-sr-latin.woff2` sadrži latinicu i slova ČĆŠŽĐ/čćšžđ, uključujući tipografske ligature. Izvor je Google Fonts, licenca SIL OFL 1.1 je priložena.
- `ponocna-elegancija-pozadina.webp`: 389.488 bajtova umesto 2.641.958 bajtova, 85,3% manje; originalne dimenzije su zadržane. `ponocna-elegancija-pregled.webp` je 500 × 700 px i oko 75 KB. Poređenje sa originalom daje PSNR 39,5 dB; kompozicija je pregledana i vizuelno.
- `prepare-ponocna-elegancija.mjs` ponovo pravi WebP, pregled i PNG/PDF kroz stvarni renderer sajta. Pokretanje: `node content/wedding-batch/prepare-ponocna-elegancija.mjs`. Koristi samo lokalni server i ne objavljuje sadržaj. Gotovi primeri su u `/workspace/artifacts/ponocna-elegancija.png` i `.pdf`; srpski dijakritici provereni su i imenima Anđela i Đorđe.
- Provera u stvarnom produkcijskom editoru sa lokalno posluženim podacima je prošla: 11 izmenjivih polja, učitan Great Vibes, skrivena kartica za fotografiju, mobilni prikaz bez horizontalnog preliva, PNG 1500 × 2100 px i PDF 127 × 177,8 mm. Generisani HTML ima opis, canonical, Open Graph i breadcrumbs, a generator sitemap-a uključuje dizajn. Produkcijski sajt nije kontaktiran niti izmenjen.

## Dodavanje sledećih pozadina

1. Preuzeti preostale dve pozadine. Prva je spremna. Sačuvati originalne dimenzije; ne obećavati dodatnu oštrinu od uvećavanja.
2. Za preostale pozadine napraviti optimizovane WebP datoteke i vizuelno uporediti sitne detalje sa originalima. Zadržati originale za arhivu.
3. Učitati pozadinu i WOFF2 kroz autentifikovani admin API, povezati njihove ID vrednosti sa dizajnom i sačuvati nacrt.
4. Proveriti tekst na originalnoj pozadini, dijakritike, druga imena, PNG/PDF izvoz i odsustvo opcije za fotografiju. Pregled od 500 × 700 px napraviti kroz postojeći renderer u WebP formatu.
5. Za svaki dizajn upisati jedinstven naziv i prirodan opis. Postojeći server nakon objave automatski uključuje detaljnu HTML stranicu, canonical, Open Graph, strukturirane podatke i sitemap. Kategorija je `wedding` (`/pozivnice-za-vencanje/`).
6. Preostale pozadine dodati nakon što ih korisnik pošalje. Prva pozivnica može da se objavi odmah prema poslednjoj instrukciji.
