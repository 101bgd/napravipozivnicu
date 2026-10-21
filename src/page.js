import { templateImageAlt } from './image-metadata.js';
import { categories } from './templates.js';
import { publicTemplates as builtinTemplates } from './curated-catalog.js';
import { escapeHtml as esc } from './ui.js';
import { icon } from './ui.js';
import { categoryPath } from './seo-content.js';
import { catalogData } from './seo.js';
import { siteHeader, siteFooter } from './site-shell.js';
import { renderCatalogPage } from './catalog-page.js';
import { renderCategoryPage } from './category-page.js';
import { renderLatestSection } from './latest-section.js';
import { renderGuideSection } from './guide-links.js';

const cta = (classes = '') => `<a href="/pozivnice/" class="button primary ${classes}"><span>Napravi pozivnicu</span><span class="button-arrow">${icon('arrow')}</span></a>`;
const occasionLinks = () => categories.filter(c=>c.id!=='all').map(c=>`<a href="${categoryPath(c.id)}">${icon(c.icon)}<span>${c.label}</span>${icon('arrow')}</a>`).join('');

function landing(catalog) {
  const preview = id => {
    const template = builtinTemplates.find(item => item.id === id);
    return `<img src="${esc(template.thumbnail)}" width="500" height="700" alt="${esc(templateImageAlt(template))}" decoding="async">`;
  };
  return `<main class="landing" id="main-content">
<section class="hero" aria-labelledby="hero-title">
  <div class="hero-atmosphere" aria-hidden="true"><span></span><span></span><span></span></div>
  <div class="hero-copy container">
    <div class="hero-kicker"><span class="status-dot"></span> Tvoj povod. Tvoj potpis.</div>
    <h1 id="hero-title">Mali poziv.<br><span class="hero-title-soft">Veliki trenutak.</span></h1>
    <p>Pozivnica koja liči na tebe.<br>Za ljude koji ti znače sve.</p>
    <div class="hero-actions"><div class="cta-wrap"><span class="cta-aura" aria-hidden="true"></span>${cta('hero-cta')}</div><span class="free-note">Besplatno. Bez naloga. Bez vodenog žiga.</span></div>
  </div>
  <div class="hero-art" aria-label="Primeri pozivnica za dečiji rođendan i venčanje">
    <div class="stage-ring" aria-hidden="true"></div><div class="stage-glow" aria-hidden="true"></div>
    <div class="hero-card hero-card-back">${preview('dino-avantura')}</div>
    <div class="hero-card hero-card-third">${preview('mala-sirena')}</div>
    <div class="hero-card hero-card-front">${preview('ponocna-elegancija')}</div>
    <span class="floating-chip chip-edit" aria-hidden="true"><span class="chip-icon">${icon('edit')}</span> Tvoje reči. Tvoja priča.</span>
    <span class="floating-chip chip-ready" aria-hidden="true"><span class="chip-icon">${icon('check')}</span> Spremna za tvoje goste.</span>
  </div>
  <div class="hero-trust container"><span>${icon('check')} Napravi na telefonu</span><span>${icon('check')} Preuzmi PNG ili PDF</span><span>${icon('check')} Podeli radost</span></div>
</section>
<section class="occasion-section container" data-reveal><div class="eyebrow">ZA SVE TVOJE VELIKE MALE TRENUTKE</div><div class="occasion-links">${occasionLinks()}</div></section>
${renderLatestSection(catalog)}
<section class="experience-section container" id="how">
  <div class="section-heading centered" data-reveal><div class="eyebrow">OD IDEJE DO „VIDIMO SE“</div><h2>Izgleda posebno.<br><span>A tako je jednostavno.</span></h2><p>Bez komplikovanih alata. Samo ti i tvoja ideja.</p></div>
  <div class="experience-grid">
    <article class="experience-card card-create" data-reveal><div class="experience-visual visual-choose" aria-hidden="true"><span class="mini-invitation mini-one">${icon('leaf')}<small>SLAVIMO LJUBAV</small><strong>Ana<br>& Marko</strong></span><span class="mini-invitation mini-two"><small>MOJ PRVI</small><strong>1.</strong><span>rođendan</span></span><span class="mini-invitation mini-three">${icon('sparkles')}<strong>18</strong><small>VREME JE ZA SLAVLJE</small></span></div><span class="step-number">01 — IZABERI</span><h3>Onaj pravi dizajn.</h3><p>Prva svećica, veliko „da“ ili još jedan razlog za slavlje. Pronađi pozivnicu za svoj trenutak.</p></article>
    <article class="experience-card card-personal" data-reveal><div class="experience-visual visual-personal" aria-hidden="true"><div class="mini-field"><small>IME NA POZIVNICI</small><span>Mila<i class="typing-caret"></i></span></div><div class="mini-palette"><i style="--swatch:#ba7890"></i><i style="--swatch:#8a9b81"></i><i style="--swatch:#9891c8"></i><i style="--swatch:#d5b78c"></i></div><span class="mini-tool-chip">${icon('edit')} Malo tebe u svakom detalju.</span></div><span class="step-number">02 — UREDI</span><h3>Sada je sasvim tvoja.</h3><p>Upiši ime, datum i svoje reči. Izmeni boje i font, a fotografiju dodaj ako šablon ima okvir.</p></article>
    <article class="experience-card card-download" data-reveal><div class="experience-visual visual-download" aria-hidden="true"><div class="download-orb">${icon('download')}</div><div class="download-files"><span>${icon('image')} PNG</span><span>${icon('file')} PDF</span></div><span class="download-check">${icon('check')} Još samo da ih pozoveš.</span></div><span class="step-number">03 — PODELI</span><h3>Neka radost krene.</h3><p>Sačuvaj sliku za poruku ili PDF za štampu. Besplatno, bez vodenog žiga, spremno za goste.</p></article>
  </div>
  <div class="section-action" data-reveal>${cta('')}<p>Veliki planovi počinju malim klikom.</p></div>
</section>
${renderGuideSection({ id: 'vodici' })}
<section class="final-cta container" data-reveal><div class="cta-glow" aria-hidden="true"></div><div class="eyebrow">NAPRAVLJENO ZA TVOJE LJUDE</div><h2>Njihov osmeh.<br><span>Tvoj prvi klik.</span></h2><p>Ne moraš da budeš dizajner da napraviš nešto lepo.</p><div class="cta-wrap">${cta()}</div><span class="cta-note">Tvoja ideja. Tvoja pozivnica. Besplatno.</span></section>
<section class="faq container" id="faq"><div class="faq-intro" data-reveal><div class="eyebrow">JOŠ NEŠTO TE ZANIMA?</div><h2>Mala pitanja.<br>Jasni odgovori.</h2></div><div class="faq-list" data-reveal>
<details><summary>Da li je sve zaista besplatno? ${icon('plus')}</summary><p>Da. Izbor šablona, uređivanje i preuzimanje su besplatni. Nema registracije, plaćanja ni vodenog žiga.</p></details>
<details><summary>Mogu li da dodam svoju fotografiju? ${icon('plus')}</summary><p>Da, na šablonima koji imaju okvir za fotografiju. Dodaj JPG, PNG ili WebP, pomeri sliku i podesi uvećanje. Fotografija se obrađuje samo u tvom pregledaču.</p></details>
<details><summary>Kako da odštampam pozivnicu? ${icon('plus')}</summary><p>Izaberi PDF za štampu. Format je 12,7 × 17,78 cm, u rezoluciji 300 dpi. Štampaj u stvarnoj veličini (100%). Za profesionalnu štampu sa prepustom proveri zahteve štamparije.</p></details>
<details><summary>Mogu li sve da uradim na telefonu? ${icon('plus')}</summary><p>Da. Izaberi šablon, unesi podatke i preuzmi pozivnicu direktno na telefon. Sliku zatim pošalji gostima kroz aplikaciju za poruke koju koristiš.</p></details>
<details><summary>Da li se moji podaci čuvaju? ${icon('plus')}</summary><p>Podaci sa tvoje pozivnice i fotografije obrađuju se na tvom uređaju. Izmene teksta automatski se čuvaju samo u ovom pregledaču. Čuvanje možeš isključiti, a nacrt obrisati u editoru. Fotografija se ne čuva u nacrtu.</p></details>
</div></section>
</main><div class="mobile-create-bar" inert aria-hidden="true">${cta()}<span>Besplatno, od prvog klika.</span></div>`;
}
export function renderPage({catalog = builtinTemplates, category = 'all', view = category === 'all' ? 'landing' : 'catalog'} = {}) {
  const isCategory = category !== 'all';
  const content = isCategory ? renderCategoryPage({ catalog, category }) : view === 'landing' ? landing(catalog) : `<main id="main-content">${renderCatalogPage({catalog,category})}</main>`;
  const pageCatalog = view === 'landing' ? [] : isCategory ? catalog.filter(t => t.category === category) : catalog;
  return siteHeader(view === 'catalog' ? 'catalog' : '', isCategory ? '#designs' : '/pozivnice/') + content + siteFooter('', isCategory ? '#designs' : '/pozivnice/') + '<div class="toast" id="toast" role="status" aria-live="polite"></div>' + catalogData(pageCatalog,category,view);
}
