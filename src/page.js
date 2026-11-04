import { templateImageAlt } from './image-metadata.js';
import { categories } from './templates.js';
import { publicTemplates as builtinTemplates } from './curated-catalog.js';
import { escapeHtml as esc } from './ui.js';
import { icon } from './ui.js';
import { categoryHighlights } from './category-content.js';
import { categoryPath } from './seo-content.js';
import { catalogData } from './seo.js';
import { siteHeader, siteFooter } from './site-shell.js';
import { renderCatalogPage } from './catalog-page.js';
import { renderCategoryPage } from './category-page.js';
import { renderLatestSection } from './latest-section.js';
import { renderGuideSection } from './guide-links.js';

const cta = (classes = '') => `<a href="/pozivnice/" class="button primary ${classes}"><span>Napravi pozivnicu</span><span class="button-arrow">${icon('arrow')}</span></a>`;
const occasionDescriptions = {"first": "Za poziv porodici i prijateljima na prvi rođendan.", "eighteen": "Za žurku sa društvom ili svečanu večeru.", "birthday": "Za dečji rođendan u igraonici, parku ili kod kuće.", "wedding": "Za ceremoniju, svadbeno slavlje ili oba dela dana.", "baptism": "Za krštenje deteta i okupljanje posle obreda.", "baby": "Za proslavu rođenja bebe sa najbližima."};
const occasionLinks = (catalog) => categories.filter(c=>c.id!=='all').map(c=>{ const t=categoryHighlights(catalog,c.id)[0]; return `<a href="${categoryPath(c.id)}">${t ? `<img src="${esc(t.thumbnail)}" alt="" width="50" height="70" loading="lazy">` : icon(c.icon)}<span><strong>${c.label}</strong><small>${occasionDescriptions[c.id]}</small></span>${icon('arrow')}</a>`; }).join('');

function landing(catalog) {
  const preview = id => {
    const template = builtinTemplates.find(item => item.id === id);
    return `<img src="${esc(template.thumbnail)}" width="500" height="700" alt="${esc(templateImageAlt(template))}" decoding="async">`;
  };
  return `<main class="landing" id="main-content">
<section class="hero" aria-labelledby="hero-title">
  <div class="hero-atmosphere" aria-hidden="true"><span></span><span></span><span></span></div>
  <div class="hero-copy container">
    <div class="hero-kicker"><span class="status-dot"></span> Mali poziv. Veliki trenutak.</div>
    <h1 id="hero-title">Napravi pozivnicu<br><span class="hero-title-soft">besplatno</span></h1>
    <p>Izaberi dizajn, dodaj ime, datum i mesto proslave i preuzmi gotovu pozivnicu kao sliku ili PDF.</p>
    <div class="hero-actions"><div class="cta-wrap"><span class="cta-aura" aria-hidden="true"></span>${cta('hero-cta')}</div><span class="free-note">Besplatno. Bez naloga. Bez vodenog žiga.</span></div>
  </div>
  <div class="hero-art" aria-label="Primeri pozivnica za dečiji rođendan i venčanje">
    <div class="stage-ring" aria-hidden="true"></div><div class="stage-glow" aria-hidden="true"></div>
    <div class="hero-card hero-card-back">${preview('dino-avantura')}</div>
    <div class="hero-card hero-card-third">${preview('mala-sirena')}</div>
    <div class="hero-card hero-card-front">${preview('ponocna-elegancija')}</div>
    <span class="floating-chip chip-edit" aria-hidden="true"><span class="chip-icon">${icon('edit')}</span> Dodaj svoj tekst</span>
    <span class="floating-chip chip-ready" aria-hidden="true"><span class="chip-icon">${icon('check')}</span> Spremna za tvoje goste.</span>
  </div>
  <div class="hero-trust container"><span>${icon('check')} Napravi na telefonu</span><span>${icon('check')} Preuzmi PNG ili PDF</span><span>${icon('check')} Pošalji gostima</span></div>
</section>
<section class="occasion-section container" data-reveal><div class="eyebrow">ZA KOJI POVOD PRAVIŠ POZIVNICU?</div><div class="occasion-links home-occasions">${occasionLinks(catalog)}</div></section>
${renderLatestSection(catalog)}
<section class="experience-section container" id="how">
  <div class="section-heading centered" data-reveal><div class="eyebrow">TRI KORAKA</div><h2>Kako da napraviš pozivnicu</h2><p>Sve radiš u pregledaču, na telefonu ili računaru.</p></div>
  <div class="experience-grid">
    <article class="experience-card card-create" data-reveal><div class="experience-visual visual-choose" aria-hidden="true"><span class="mini-invitation mini-one">${icon('leaf')}<small>SLAVIMO LJUBAV</small><strong>Ana<br>& Marko</strong></span><span class="mini-invitation mini-two"><small>MOJ PRVI</small><strong>1.</strong><span>rođendan</span></span><span class="mini-invitation mini-three">${icon('sparkles')}<strong>18</strong><small>VREME JE ZA SLAVLJE</small></span></div><span class="step-number">01 — IZABERI</span><h3>Izaberi povod i dizajn.</h3><p>Otvori kategoriju i pogledaj dizajne. Izaberi onaj u koji staju podaci o tvojoj proslavi.</p></article>
    <article class="experience-card card-personal" data-reveal><div class="experience-visual visual-personal" aria-hidden="true"><div class="mini-field"><small>IME NA POZIVNICI</small><span>Mila<i class="typing-caret"></i></span></div><div class="mini-palette"><i style="--swatch:#ba7890"></i><i style="--swatch:#8a9b81"></i><i style="--swatch:#9891c8"></i><i style="--swatch:#d5b78c"></i></div><span class="mini-tool-chip">${icon('edit')} Pregledaj izmene odmah</span></div><span class="step-number">02 — UREDI</span><h3>Unesi svoje podatke.</h3><p>Upiši ime, datum i svoje reči. Izmeni boje i font, a fotografiju dodaj ako šablon ima okvir.</p></article>
    <article class="experience-card card-download" data-reveal><div class="experience-visual visual-download" aria-hidden="true"><div class="download-orb">${icon('download')}</div><div class="download-files"><span>${icon('image')} PNG</span><span>${icon('file')} PDF</span></div><span class="download-check">${icon('check')} Otvori i proveri datoteku</span></div><span class="step-number">03 — PODELI</span><h3>Pregledaj i preuzmi.</h3><p>Proveri ime, datum, adresu i raspored teksta. Preuzmi PNG za poruke ili PDF za štampu, bez vodenog žiga.</p></article>
  </div>
  <p class="section-action">Raspored i ilustracije su već pripremljeni. Menjaš ponuđeni tekst i podešavanja, bez crtanja pozivnice od početka.</p>
</section>
${renderGuideSection({ id: 'vodici', title: 'Pomoć za tekst, slanje i štampu', editorial: true })}

<section class="faq container" id="faq"><div class="faq-intro" data-reveal><div class="eyebrow">JOŠ NEŠTO TE ZANIMA?</div><h2>Šta još treba da znaš</h2></div><div class="faq-list" data-reveal>
<details><summary>Šta treba da pripremim pre uređivanja? ${icon('plus')}</summary><p>Ime, povod, datum, vreme, mesto i adresu, a po potrebi rok i kontakt za potvrdu dolaska. U <a href="/vodici/tekstovi-za-pozivnice-za-deciji-rodjendan/">primerima rođendanskih tekstova</a> vidi kako da ih povežeš u kratak poziv.</p></details>
<details><summary>Šta ako tekst ne staje? ${icon('plus')}</summary><p>Najpre skrati uvod, a dodatna uputstva pošalji uz sliku. Ako i dalje nema mesta, probaj drugi raspored. Ime, vreme i adresa treba da ostanu čitljivi. Za obred i proslavu pogledaj <a href="/vodici/sta-napisati-na-pozivnici-za-krstenje/">kako razdvojiti podatke na pozivnici</a>.</p></details>
<details><summary>Kako da preuzmem i pošaljem pozivnicu? ${icon('plus')}</summary><p>U editoru izaberi preuzimanje slike (PNG) ili fajla za štampu (PDF), pa otvori i proveri datoteku. Gostima je šalješ iz svoje aplikacije za poruke. <a href="/vodici/kako-poslati-digitalnu-pozivnicu-viber-whatsapp/">Vodič za slanje preko Vibera i WhatsApp-a</a> objašnjava kako da je pronađeš i priložiš poruci.</p></details>
<details><summary>Da li je sve zaista besplatno? ${icon('plus')}</summary><p>Da. Izbor šablona, uređivanje i preuzimanje su besplatni. Nema registracije, plaćanja ni vodenog žiga.</p></details>
<details><summary>Mogu li da dodam svoju fotografiju? ${icon('plus')}</summary><p>Da, na šablonima koji imaju okvir za fotografiju. Dodaj JPG, PNG ili WebP, pomeri sliku i podesi uvećanje. Fotografija se obrađuje samo u tvom pregledaču.</p></details>
<details><summary>Kako da odštampam pozivnicu? ${icon('plus')}</summary><p>Izaberi PDF za štampu. Stranica je veličine 12,7 × 17,78 cm i sadrži sliku za štampu na 300 piksela po inču. Štampaj u stvarnoj veličini (100%). Za profesionalnu štampu sa prepustom proveri zahteve štamparije. Pogledaj <a href="/vodici/kako-odstampati-pozivnicu-u-pravoj-velicini/">uputstvo za štampu u pravoj veličini</a>.</p></details>
<details><summary>Mogu li sve da uradim na telefonu? ${icon('plus')}</summary><p>Da. Izaberi šablon, unesi podatke i preuzmi pozivnicu direktno na telefon. Sliku zatim pošalji gostima kroz aplikaciju za poruke koju koristiš.</p></details>
<details><summary>Da li se moji podaci čuvaju? ${icon('plus')}</summary><p>Podaci sa tvoje pozivnice i fotografije obrađuju se na tvom uređaju. Izmene teksta automatski se čuvaju samo u ovom pregledaču. Čuvanje možeš isključiti, a nacrt obrisati u editoru. Fotografija se ne čuva u nacrtu.</p></details>
</div></section>
<section class="final-cta container" data-reveal><div class="cta-glow" aria-hidden="true"></div><div class="eyebrow">KRENI OD DIZAJNA</div><h2>Pronađi pozivnicu za svoju proslavu</h2><p>Otvori kolekciju, izaberi motiv i dodaj svoje podatke.</p><div class="cta-wrap">${cta()}</div><span class="cta-note">Bez registracije i vodenog žiga.</span></section>
</main><div class="mobile-create-bar" inert aria-hidden="true">${cta()}<span>Besplatno, od prvog klika.</span></div>`;
}
export function renderPage({catalog = builtinTemplates, category = 'all', view = category === 'all' ? 'landing' : 'catalog'} = {}) {
  const isCategory = category !== 'all';
  const content = isCategory ? renderCategoryPage({ catalog, category }) : view === 'landing' ? landing(catalog) : `<main id="main-content">${renderCatalogPage({catalog,category})}</main>`;
  const pageCatalog = view === 'landing' ? [] : isCategory ? catalog.filter(t => t.category === category) : catalog;
  return siteHeader(view === 'catalog' ? 'catalog' : '', isCategory ? '#designs' : '/pozivnice/') + content + siteFooter('', isCategory ? '#designs' : '/pozivnice/', true) + '<div class="toast" id="toast" role="status" aria-live="polite"></div>' + catalogData(pageCatalog,category,view);
}
