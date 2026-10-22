# Aktivacija admin panela na Cloudflare-u

Panel je na `https://napravipozivnicu.com/admin/sabloni/`. Kod je spreman, ali za produkcijski pristup treba jednom povezati D1, R2 i Cloudflare Access. Bez važeće Access prijave admin stranica i API vraćaju 401/403; bez konfiguracije vraćaju 503. Javna stranica radi i pre aktivacije.

Repozitorijum grana `main` ostaje povezan sa postojećim **Cloudflare Pages** projektom. Build command ostaje `npm run build`, output directory `dist`. Build sada pravi i `dist/_worker.js`, koji Pages automatski objavljuje kao funkcije. Ne kreiraj drugi hosting projekat.

## 1. Baza šablona

1. Na https://dash.cloudflare.com otvori **Storage & databases → D1 SQL database** (u nekim prikazima **Workers & Pages → D1**).
2. Klikni **Create database**, nazovi je `napravipozivnicu`, pa potvrdi.
3. Otvori novu bazu, pa **Console**.
4. Na GitHub-u otvori [`migrations/0001_templates.sql`](https://github.com/101bgd/napravipozivnicu/blob/main/migrations/0001_templates.sql).
5. Kopiraj i pokreni SQL iz tog fajla. Ako Console prima jednu naredbu po izvršavanju, pokreni naredbe redom, svaku do znaka `;`. Prave se tabele `templates`, `assets`, `settings` i indeks. `IF NOT EXISTS` omogućava bezbedno ponovno pokretanje.
6. Tek kada je SQL završen, otvori **Workers & Pages → napravipozivnicu → Settings → Bindings → Add binding**.
7. Izaberi **D1 database**, Variable name postavi tačno `DB`, izaberi bazu `napravipozivnicu` i sačuvaj za **Production**.

## 2. Pozadine i fontovi

1. Otvori **Storage & databases → R2 Object Storage**.
2. Aktiviraj R2 ako već nije aktivan. Cloudflare može tražiti podatke za naplatu pri aktivaciji, iako R2 ima besplatne kvote. Proveri prikazanu cenu i kvote pre aktivacije.
3. Klikni **Create bucket**, naziv `napravipozivnicu-assets`, storage class **Standard**, pa potvrdi.
4. Bucket ostavi privatan; ne uključuj `r2.dev` ni javni custom domain.
5. Vrati se u **Workers & Pages → napravipozivnicu → Settings → Bindings → Add binding**.
6. Izaberi **R2 bucket**, Variable name tačno `MEDIA`, bucket `napravipozivnicu-assets`, pa sačuvaj za **Production**.

Aplikacija javno prikazuje samo datoteke povezane sa objavljenim šablonom. Pozadine i fontovi nacrta dostupni su kroz zaštićen admin API. Povučene pozivnice nestaju iz kataloga i sitemap-a; već objavljene datoteke mogu ostati u kešu. Fotografije posetilaca obrađuju se lokalno i ne šalju se u R2.

## 3. Prijava samo za tebe

1. Iz Cloudflare kontrolne table otvori **Zero Trust**.
2. Ako prvi put ulaziš, izaberi ime tima i odgovarajući plan. Za jednog administratora počni pregledom **Free** plana.
3. Otvori **Integrations → Identity providers**. Pod **Your identity providers** klikni **Add new identity provider**, pa izaberi **One-time PIN**. U novim Zero Trust nalozima ta opcija nije dodata automatski. Dobijaćeš kod na email.
4. Otvori **Access controls → Applications → Create new application → Self-hosted and private**, pa **Add public hostname**. Ako ti je prikazan stariji meni, nazivi su **Access → Applications → Add an application → Self-hosted**.
5. Application name: `Napravi pozivnicu admin`. Session duration: npr. **8 hours**.
6. Dodaj sledeće **Public hostname** stavke u **istu aplikaciju**:

   | Domain | Path |
   |---|---|
   | `napravipozivnicu.com` | `admin/*` |
   | `napravipozivnicu.com` | `api/admin/*` |
   | `www.napravipozivnicu.com` | `admin/*` |
   | `www.napravipozivnicu.com` | `api/admin/*` |

   Ako tvoje polje za Path prikazuje početnu kosu crtu, putanje su `/admin/*` i `/api/admin/*`. Nemoj zaštititi ceo javni domen.

7. Napravi policy: naziv `Samo administrator`, Action **Allow**, Include selector **Emails**, Value **tvoja tačna email adresa**. Dodaj samo adrese administratora; ne biraj Everyone ili Bypass.
8. Izaberi **One-time PIN** kao login method i sačuvaj aplikaciju.
9. Otvori detalje te Access aplikacije i kopiraj **Application Audience (AUD) Tag**. To je niz znakova, a ne Application ID.
10. Pronađi svoj **Team domain**, oblika `ime-tima.cloudflareaccess.com`. Može biti pod Zero Trust Settings ili u adresi login stranice.

Ista aplikacija za panel i API daje isti AUD za oba. Kod proverava potpis tokena, izdavaoca, AUD, rok važenja i dozvoljeni email. Alternativni `pages.dev` URL ne daje pristup adminu bez takvog tokena.

## 4. Vrednosti u Pages projektu

Otvori **Workers & Pages → napravipozivnicu → Settings → Variables and Secrets** i dodaj za **Production**:

| Naziv | Vrednost |
|---|---|
| `ACCESS_TEAM_DOMAIN` | Tvoj `ime-tima.cloudflareaccess.com`, bez `https://` |
| `ACCESS_AUD` | AUD Tag kopiran iz Access aplikacije |
| `ADMIN_EMAILS` | Ista email adresa kao u Allow policy-ju; više adresa razdvoji zarezom |
| `SITE_URL` | `https://napravipozivnicu.com` |
| `NODE_VERSION` | `24.19.0` |

Ne šalji pristupne tokene ni kodove za prijavu u chat. U kodu nema lozinke niti ugrađenog administratorskog tokena. Ove vrednosti su serverske; ne koriste `VITE_` prefiks.

U **Settings → Functions → Compatibility date** postavi `2026-08-01` ako postoji to polje. Sa tim datumom su provere izvršene.

Posle dodavanja bindings i promenljivih otvori **Deployments**, meni `…` poslednjeg production deploy-a i izaberi **Retry deployment**. Ako je naziv drugačiji, pokreni novu objavu poslednjeg commita. Samo Save podešavanja ne menja već objavljenu funkciju.

## 5. Prva prijava i rad

1. Otvori `https://napravipozivnicu.com/admin/sabloni/`.
2. Unesi dozvoljeni email, uzmi kod iz poruke i potvrdi ga.
3. Klikni **Novi šablon**, unesi naziv, kategoriju i opis.
4. **Dodaj pozadinu**: PNG/JPG/WebP do 10 MB; preporuka 1500 × 2100 px. Tekst koji korisnik menja treba da bude odvojen od slike.
5. Dodaj i pomeraj tekst, podesi font/efekat i dodaj jedan okvir za fotografiju po potrebi.
6. **Dodaj font**: WOFF2/WOFF/TTF/OTF do 2 MB. Dodati font je dostupan i za sledeće šablone. Koristi fontove sa odgovarajućom licencom za javni sajt.
7. Klikni **Pregled i preuzimanje** i proveri PNG/PDF.
8. Klikni **Sačuvaj nacrt**. Nacrt je u bazi, dostupan i sa drugog uređaja posle prijave.
9. Klikni **Objavi**. Dizajn se pojavljuje u katalogu, kategoriji i sitemap-u, bez ručnog rada na GitHub-u.
10. Kasnije izmene čuvaj kao nacrt; javna verzija se menja tek sledećim **Objavi**. **Povuci sa sajta** uklanja javnu verziju, a zadržava nacrt.

Na listi možeš da dupliraš ili obrišeš šablon. U sekciji **Probni šabloni** možeš da isključiš sve primere ili klikneš **Uredi primer**. Primer se pretvara u šablon sa pozadinom i slojevima; nakon objavljivanja zamenjuje original u katalogu.

### Pripremljeni šablon „Roze mašna“

U panelu je dodat raspored za prvi rođendan, namenjen roze pozadini sa mašnom, balonima, medom i zekom. U sekciji **Pripremljeno za tvoju pozadinu** klikni **Dodaj pozadinu i otvori**, pa izaberi originalnu sliku sa uređaja. Otvara se šablon sa osam izmenjivih tekstualnih polja, bez fotografije. Proveri izgled i klikni **Objavi**. Pozadina i šablon postaju javni tek tom objavom; samo dodavanje rasporeda u kod ne objavljuje pozivnicu.

## Google

- U [Google Search Console](https://search.google.com/search-console/) dodaj i potvrdi domen `napravipozivnicu.com`.
- U sekciji **Sitemaps** pošalji `https://napravipozivnicu.com/sitemap.xml`.
- Kategorije i pozivnice imaju svoje URL-ove, naslove, opise, canonical oznake i strukturirane podatke. Google dobija sadržaj u HTML-u.
- Za svaki pravi šablon napiši konkretan opis i koristi kvalitetan pregled. Tehnički SEO priprema sajt za indeksiranje; pozicija u pretrazi zavisi i od sadržaja, konkurencije i linkova.

## Troškovi i kapacitet

Ova verzija koristi Pages Functions, D1 i R2. Statički CSS/JS/fontovi se služe direktno kao Pages assets; HTML i admin zahtevaju funkcije. Objavljene slike i dodati fontovi imaju browser/edge keš, a nacrti nisu keširani.

Ograničenja sada uključuju kvote funkcija, baze i R2, uz Pages hosting. To nije isti kapacitet kao prethodna potpuno statička verzija. Proveri trenutne kvote i potrošnju u Cloudflare nalogu; posebno proveri podešavanja naplate R2. Nema dodatog plaćanja niti naloga za posetioce.

Zvanična dokumentacija:
- [Pages advanced mode](https://developers.cloudflare.com/pages/functions/advanced-mode/)
- [Pages bindings](https://developers.cloudflare.com/pages/functions/bindings/)
- [Access applications](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/)
- [D1](https://developers.cloudflare.com/d1/get-started/)
- [R2](https://developers.cloudflare.com/r2/get-started/)

## AdSense kod i prikaz oglasa

Nalog `ca-pub-6151181163851577` je podrazumevano podešen. Posle deployment-a Worker dodaje asinhroni Google kod direktno u `<head>` svake javne produkcione stranice, kao i meta oznaku naloga i odgovarajući `/ads.txt`. Nije potreban novi SQL ili Cloudflare binding. Ako su ranije sačuvani drugi važeći identifikatori, oni ostaju aktivni i mogu se promeniti u adminu.

Otvori **Admin → AdSense reklame**, ili `/admin/sabloni/#adsense`. Prekidač **Učitaj AdSense kod u zaglavlju javnih stranica** kontroliše Google skriptu. Za ručni oglas pre podnožja napravi prilagodljivu jedinicu u **Oglasi → Po oglasnoj jedinici → Prikazni oglasi**, nalepi njen ceo kod i uključi drugi prekidač. Auto oglasi se podešavaju u Google AdSense nalogu; nisu vezani za prekidač ručnog bloka. Isključivanje zaglavlja isključuje i ručni blok. Podešavanja se čuvaju u tabeli `settings` i za kasnije izmene nije potreban deployment.

Skripta se ne učitava u adminu, na `pages.dev` ni lokalnim pregledima. Ručni blok koristi postojeću skriptu i ne duplira je. Oglasi ne ulaze u PNG/PDF pozivnicu.

Za posetioce iz regiona u kojima je saglasnost potrebna, u **AdSense → Privatnost i poruke** podesi Googleovu sertifikovanu poruku o privatnosti/CMP. Odobrenje naloga i prikaz oglasa zavise od Google-a.
