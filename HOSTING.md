# Objavljivanje na Cloudflare Pages

Domen: `napravipozivnicu.com`. Preporuka: Cloudflare Pages, besplatan plan, GitHub integracija. Sadašnja aplikacija je statička, bez baze podataka i servera za uređivanje pozivnica.

## Preduslov

Cloudflare Pages poveži sa GitHub repozitorijumom `101bgd/napravipozivnicu`, na grani `main`. Kod mora biti poslat na GitHub pre povezivanja: prazan repozitorijum nema produkcijsku granu za izbor.

## Pages

1. Otvori https://dash.cloudflare.com i napravi nalog/prijavi se.
2. Otvori **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Izaberi GitHub i odobri Cloudflare-u pristup repozitorijumu `101bgd/napravipozivnicu`.
4. Izaberi repozitorijum i **Begin setup**.
5. Postavi:
   - Project name: `napravipozivnicu` (ili drugo slobodno ime).
   - Production branch: `main`.
   - Framework preset: `None`.
   - Build command: `npm run build`.
   - Build output directory: `dist`.
   - Root directory: prazno; kod je u korenu GitHub repozitorijuma.
   - Environment variable: `NODE_VERSION` = `24.19.0`. Ista verzija je pinovana u `.node-version`.
6. Klikni **Save and Deploy**. Cloudflare instalira zavisnosti i pravi produkcijski build.
7. Otvori URL koji Cloudflare stvarno prikaže nakon uspešne objave i proveri editor i preuzimanja.

Cloudflare build ne treba da pokreće `npm test`: taj lokalni test očekuje sistemski Chromium. Produkcijski build je `npm run build`.

## Domen

1. U istom Cloudflare nalogu otvori **Domains** > **Onboard a domain**.
2. Unesi `napravipozivnicu.com`, izaberi skeniranje postojećih DNS zapisa i plan **Free**.
3. Ako na domenu postoji email ili drugi servis, proveri da su potrebni MX/TXT i ostali zapisi preneti. Sačuvaj DNS zapise potrebnih servisa.
4. Kopiraj tačno dva nameservera koja Cloudflare dodeli tvom domenu. Ne koristi nameservere sa tuđeg naloga ili iz primera.
5. Kod prodavca domena otvori podešavanja domena, zatim **Nameservers** / **Name servers**, postavi prilagođene nameservere i unesi oba Cloudflare nameservera umesto prethodnih. Sačuvaj. Ako je DNSSEC već uključen, pre promene ga isključi kod registrara; možeš ga ponovo uključiti kroz Cloudflare nakon aktivacije.
6. Sačekaj da domen u Cloudflare-u bude **Active**. Dokumentacija navodi do 24 sata za promenu nameservera. Ako je domen kupljen kod Cloudflare Registrar-a, njegovi nameserveri su već podešeni.
7. Otvori **Workers & Pages** > svoj Pages projekat > **Custom domains** > **Set up a domain**.
8. Unesi `napravipozivnicu.com`, klikni **Continue** i potvrdi ponuđeno povezivanje. Cloudflare dodaje odgovarajući CNAME i izdaje SSL sertifikat.
9. Na isti način dodaj `www.napravipozivnicu.com`.
10. Kada oba imaju status **Active**, otvori `https://napravipozivnicu.com` i `https://www.napravipozivnicu.com` i proveri sajt, fotografiju, PNG i PDF na telefonu i računaru.

Ne menjaj samo DNS CNAME: domen mora da bude dodat u **Custom domains** Pages projekta.

Kasnije slanje izmena na GitHub granu `main` automatski pokreće novo objavljivanje. Cloudflare Pages objava sajta i objava Codex cloud okruženja su odvojene stvari.

Zvanična uputstva:
- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/configuration/custom-domains/
- https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/
