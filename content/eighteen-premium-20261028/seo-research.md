# Pozivnice za 18. rođendan i punoletstvo — 28. oktobar 2026.

## Pokušani javni izvori i ograničenja

Poređenje je usmereno na izraze `pozivnice za 18. rodjendan` i `pozivnice za punoletstvo` za Srbiju. Za naslove i vidljiv tekst koristi se pravilno srpsko pisanje „rođendan“. Upiti bez dijakritika služe proveri varijante unosa, a ne pravljenju posebnih stranica.

U ovoj sesiji pregledane su važeća mrežna politika i trenutna spremnost okruženja. HTTP politika je aktivna i ograničena, a javni pretraživači nisu među dozvoljenim odredištima. Ipak su standardnim HTTPS zahtevima, kroz nasleđeni proksi i bez promene mrežnih postavki, pokušani sledeći izvori:

| Izvor | Upit ili podešavanje | Dostupan rezultat |
| --- | --- | --- |
| [Google pretraga](https://www.google.com/search?hl=sr&gl=rs&q=pozivnice+za+18.+rodjendan) | `pozivnice za 18. rodjendan`; srpski jezik, Srbija | Proksi je odbio povezivanje: HTTP 403, `CONNECT tunnel failed, response 403`. |
| [Google pretraga](https://www.google.com/search?hl=sr&gl=rs&q=pozivnice+za+punoletstvo) | `pozivnice za punoletstvo`; srpski jezik, Srbija | Isti HTTP 403 pri povezivanju; sadržaj pretrage nije preuzet. |
| [Google Trends](https://trends.google.com/trends/explore?geo=RS&date=today%2012-m&q=pozivnice%20za%2018.%20rodjendan,pozivnice%20za%20punoletstvo) | Oba izraza; Srbija, prethodnih 12 meseci | Isti HTTP 403; podaci o relativnom interesovanju nisu dostupni. |
| [Bing pretraga](https://www.bing.com/search?q=%22pozivnice+za+18.+rodjendan%22+%22pozivnice+za+punoletstvo%22) | Oba izraza pod navodnicima | Isti HTTP 403; rezultati nisu dostupni. |

Pokušaji su obavljeni 28. oktobra 2026. oko 01:15 UTC pomoću `curl --head`, uz vremensko ograničenje od 20 sekundi. Odgovori potiču od proksija pre uspostavljanja HTTPS veze, pa ne predstavljaju sadržaj, status indeksiranja ili ponašanje navedenih sajtova. Nije pokušavano zaobilaženje mrežne politike. U dostupnim alatima nije pronađen zaseban alat za javnu veb pretragu.

Nisu dobijeni javni rezultati, mesečni obimi ni Trends indeksi. Zato nema osnova za tvrdnju da je jedan izraz traženiji, da pojedinačni motiv ima veću potražnju ili da novi šabloni mogu garantovati određenu poziciju u pretrazi. Ranija interna istraživanja u `content/eighteen-batch/seo-research.md` i `content/eighteen-collection/seo-research.md` beleže slično ograničenje; ona nisu nov dokaz o obimu pretrage.

Za odluku zasnovanu na podacima potrebno je naknadno uporediti varijante izraza u Google Ads Keyword Planner-u za Srbiju i proveriti stvarne prikaze, klikove i upite sajta u Search Console-u. Google Trends pokazuje relativno interesovanje, a ne mesečni obim; broj rezultata pretrage i predlozi pretraživača takođe nisu zamena za obim.

## Primena za ova dva šablona

„18. rođendan“ i „punoletstvo“ opisuju isti povod u ovoj kategoriji. Zadržava se postojeća kategorija [Pozivnice za 18. rođendan](https://napravipozivnicu.com/pozivnice-za-18-rodjendan/) i oba izraza se koriste prirodno u opisima. Ne dodaje se druga gotovo ista kategorija za sinonim ili varijantu bez dijakritika.

Naslovi su sastavljeni funkcijom `buildTemplateTitle` iz `src/template-titles.js`, prema pravilu iz `AGENTS.md`: povod, stvarni motiv, zatim kratak jedinstveni naziv. Funkcija za kategoriju `eighteen` koristi „Pozivnica za 18. rođendan“. Ovo je usklađivanje sa postojećim sistemom naslova, a ne zaključak o većoj traženosti tog izraza.

| Naziv | Stvarni razlikovni motivi | Nova adresa |
| --- | --- | --- |
| Bordo gala | Bordo svileni talasi, zlatne čestice, veliki krem broj 18 i uspravni zlatni natpis Punoletstvo | `/pozivnice/pozivnica-za-18-rodjendan-bordo-zlatni-talasi/` |
| Oniks potpis | Krem papir, crna satenska mašna sa brošem, zlatni ornamenti, kaligrafsko ime i veliki tamni broj 18 | `/pozivnice/pozivnica-za-punoletstvo-crna-masna-zlatni-ornamenti/` |

To su dve nove stranice za različite dizajne, a ne duplirane stranice za isti upit. Predviđeni canonical domen je `https://napravipozivnicu.com`; adrese iz tabele su planirane putanje novih šablona, bez tvrdnje da su već objavljene ili indeksirane. Postojeće identifikatore, slugove i datume drugih dizajna ne treba menjati.

Metapodaci su u `metadata.json`. Svaki šablon ima zaseban naziv, motiv, naslov, opis, alt tekst i vidljiv detaljan opis. Opisi prirodno pominju uređivanje podataka punoletstva i PNG/PDF preuzimanje. Alt tekst opisuje boje, motive i planirani raspored pregleda, bez niza ponovljenih ključnih reči. Obe korisnikove PNG pozadine ostaju bez foto okvira; tekst se dodaje kroz postojeći editor.

Pri uvozu treba preneti iste metapodatke u definicije dizajna i javni katalog, a zatim proveriti da generisane stranice imaju usklađene H1/SEO naslove, canonical, opis slike, interne veze i unos u sitemap. Završni pregled mora odgovarati navedenom alt tekstu i opisu rasporeda.
