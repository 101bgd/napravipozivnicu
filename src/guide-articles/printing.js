// Format and export statements match the browser renderer and jsPDF configuration.
export default [
  {
    "id": "format-pozivnice",
    "title": "Koja je stvarna veličina pozivnice sa sajta",
    "html": "<p>PDF koji preuzmeš sa sajta Napravi pozivnicu ima stranicu veličine <strong>127 × 177,8 mm</strong>, odnosno <strong>12,7 × 17,78 cm</strong>. To odgovara formatu 5 × 7 inča. Kada se štampa na 100%, papirna pozivnica treba da ima upravo te mere pre bilo kakvog dodatnog isecanja.</p><p>A4 papir ima 210 × 297 mm, pa pozivnica može da se postavi na veći list i potom iseče. A5 ima 148 × 210 mm; ako u dijalogu za štampu izabereš prilagođavanje A5 papiru, veličina pozivnice može da se promeni. Pre štampe proveri i format koverte koju planiraš da koristiš.</p>"
  },
  {
    "id": "preuzmi-pdf",
    "title": "Prvo preuzmi PDF za štampu",
    "html": "<ol><li><a href=\"/pozivnice/\">Izaberi dizajn</a> i unesi konačne podatke.</li><li>Proveri slova, datum, vreme i raspored redova.</li><li>Izaberi <strong>Preuzmi za štampu — PDF</strong>.</li><li>Otvori preuzeti fajl u PDF čitaču i pregledaj celu stranicu.</li></ol><p>Za štampu koristi originalni PDF. Slika preuzeta iz razgovora može biti kompresovana, a snimak ekrana često ima manje piksela od originala. PDF nosi zadatu veličinu stranice, što olakšava pravilno podešavanje štampe.</p>"
  },
  {
    "id": "stvarna-velicina",
    "title": "Podešavanje štampe: 100% ili Actual size",
    "html": "<p>Otvori štampu iz PDF čitača i potraži deo za veličinu ili skaliranje. Izaberi <strong>Actual size / Stvarna veličina</strong> ili postavi <strong>Scale / Razmera na 100%</strong>. Isključi automatsko uklapanje na papir, obično označeno kao Fit, Fit to page ili Prilagodi stranici.</p><ol><li>Izaberi odgovarajući štampač i veličinu papira koji je stvarno u fioci.</li><li>Za jednu pozivnicu na A4 ostavi položaj na sredini lista ako čitač nudi centriranje.</li><li>Uključi štampu u boji kada je želiš i odaberi tip papira prema stvarnom papiru.</li><li>Odštampaj jedan primerak.</li><li>Lenjirom izmeri otisnuti pravougaonik: širina treba da bude 12,7 cm, a visina približno 17,78 cm.</li></ol><p>Na telefonu neke sistemske opcije ne nude precizno skaliranje. Ako nemaš kontrolu nad razmerom, prenesi PDF na računar ili zamoli štampariju da ga odštampa u stvarnoj veličini. Ako odštampana pozivnica ima druge mere, proveri i postavke drajvera štampača, jer i one mogu automatski da smanje stranicu.</p><aside class=\"guide-note\"><strong>Probni otisak štedi papir</strong><p>Tek kada proveriš mere, čitljivost i boje jednog primerka, pokreni štampu celog tiraža. Ne oslanjaj se samo na veličinu prikaza na ekranu.</p></aside>"
  },
  {
    "id": "dve-na-a4",
    "title": "Kako rasporediti dve pozivnice na A4",
    "html": "<p>Dve pozivnice od 127 × 177,8 mm mogu geometrijski da stanu jedna pored druge na A4 postavljen vodoravno. Njihova ukupna širina je 254 mm, a visina 177,8 mm; A4 u tom položaju ima 297 × 210 mm. Ostaje prostor za razmak i margine, ali proveri neštampajuću oblast svog štampača.</p><figure class=\"print-diagram\"><div class=\"print-sheet\" role=\"img\" aria-label=\"Ilustracija dve uspravne pozivnice od 127 puta 177,8 milimetara, postavljene jedna pored druge na vodoravni A4 list\"><div><span>01</span><strong>127 × 177,8 mm</strong></div><div><span>02</span><strong>127 × 177,8 mm</strong></div></div><figcaption>Primer rasporeda: A4 vodoravno, 297 × 210 mm. Prikaz na ekranu služi kao ilustracija.</figcaption></figure><p>Za takav otisak u programu za prelom postavi dve kopije pozivnice na A4 dokument uz očuvanje tačnih mera ili traži raspored od štamparije. Sam izbor „2 kopije“ često štampa dva odvojena lista. Opcija „2 stranice po listu“ takođe ne mora da udvostruči PDF koji ima samo jednu stranicu i može da promeni razmeru. Proveri pregled i izmeri probni otisak.</p>"
  },
  {
    "id": "rezolucija",
    "title": "Rezolucija: šta znači 1500 × 2100 piksela",
    "html": "<p>Izvozni PNG ima 1500 × 2100 piksela. Kada se odštampa u formatu 5 × 7 inča, to daje izlaznu gustinu od 300 piksela po inču. Isti prikaz ugrađuje se u PDF; tekst u tom PDF-u nije zaseban vektorski sloj.</p><p>Stvarna oštrina pozadine i fotografije zavisi i od njihovih izvornih dimenzija. Ako je pozadina manja od izvoza ili je fotografija jako uvećana, veći broj izlaznih piksela ne stvara nove detalje. Zato pogledaj probni otisak, naročito sitan tekst i delove slike sa licima ili tankim linijama.</p><p>Ako pozivnicu uvećavaš na veći format, ista datoteka daje manju gustinu piksela po inču. Za veliki poster ili nestandardnu dimenziju proveri sa štamparijom da li je datoteka dovoljna za željeni rezultat.</p>"
  },
  {
    "id": "papir-i-boje",
    "title": "Izbor papira i provera boja",
    "html": "<p>Za čvršći osećaj pozivnice često se bira papir od oko 200–300 g/m², ali kućni štampač možda ne podržava tu gramažu. Proveri specifikaciju uređaja, preporučeni tip papira i način uvlačenja. Za prvu probu možeš da koristiš običan papir, a zatim jedan list planiranog debljeg papira.</p><p>Mat papir obično daje mirniji izgled, dok sjajniji menja doživljaj boja i površine. Rezultat zavisi od papira, mastila ili tonera i podešavanja štampe. Ekran emituje svetlost, pa otisak ne mora izgledati jednako svetlo ili zasićeno. Ilustrovani zlatni detalji odštampaće se bojom; metalik efekat zahteva poseban postupak u štampariji.</p>"
  },
  {
    "id": "prepust-i-stamparija",
    "title": "Šta proveriti kada šalješ PDF štampariji",
    "html": "<p>Pre slanja navedi završnu meru 127 × 177,8 mm i broj primeraka. Pitaj da li traže prepust, oznake za sečenje, određeni profil boja ili drugi format fajla. PDF sa sajta ne dodaje automatski prepust, oznake sečenja ili CMYK pripremu.</p><p>Ako štamparija traži 3 mm prepusta sa svake strane, ukupna površina sa prepustom za ovaj format iznosi 133 × 183,8 mm. Pozadina treba da se nastavi kroz taj dodatni prostor. Dodavanje belog okvira oko postojeće pozivnice ne pravi obojeni prepust, a rastezanje cele slike može da pomeri tekst preblizu ivici. Dogovori pripremu sa štamparijom pre poručivanja.</p><p>Važne podatke ostavi dovoljno udaljene od ivice reza prema njihovom uputstvu. Ako planiraš zaobljene uglove ili poseban oblik sečenja, proveri i bezbednu zonu za tekst.</p>"
  },
  {
    "id": "kontrolna-lista",
    "title": "Kratka provera pre celog tiraža",
    "html": "<ul><li>Konačni podaci su tačni i preuzet je novi PDF nakon poslednje izmene.</li><li>Štampa je na 100%, bez automatskog uklapanja na papir.</li><li>Probni otisak je izmeren lenjirom.</li><li>Najmanja slova su čitljiva, a važni delovi nisu preblizu rezu.</li><li>Papir odgovara štampaču, a boje su proverene na planiranom papiru.</li><li>Za profesionalnu štampu potvrđeni su prepust, profil boja i završna mera.</li></ul><p>Ako deo gostiju dobija digitalni poziv, originalni PNG možeš da pošalješ prema <a href=\"/vodici/kako-poslati-digitalnu-pozivnicu-viber-whatsapp/\">vodiču za Viber i WhatsApp</a>. Tako za isti dizajn imaš proverenu verziju za papir i jednostavnu verziju za poruku.</p><p>Za objašnjenje opcija štampe u Adobe čitaču pogledaj <a href=\"https://helpx.adobe.com/acrobat/using/printing-pdfs.html\" target=\"_blank\" rel=\"noopener noreferrer\">Adobe uputstvo za štampanje PDF dokumenata</a>.</p>"
  }
];
