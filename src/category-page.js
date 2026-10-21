import { categories } from './templates.js';
import { CATEGORY_CONTENT, categoryPath } from './seo-content.js';
import { CATEGORY_EXPERIENCE, categoryHighlights } from './category-content.js';
import { renderDesigns } from './catalog-page.js';
import { escapeHtml as esc, icon } from './ui.js';
import { renderGuideSection } from './guide-links.js';

const createLink = (classes = '') => `<a class="button primary ${classes}" href="#designs" data-category-cta><span>Napravi pozivnicu</span><span class="button-arrow">${icon('arrow')}</span></a>`;

function categoryArt(catalog, category) {
  const content = CATEGORY_EXPERIENCE[category];
  const previews = categoryHighlights(catalog, category);
  return `<div class="collection-stage" data-motion-scene>
    <div class="collection-aura" aria-hidden="true"></div>
    <svg class="collection-orbit" viewBox="0 0 600 450" fill="none" aria-hidden="true"><ellipse cx="300" cy="230" rx="275" ry="150" transform="rotate(-18 300 230)"/><ellipse cx="300" cy="230" rx="225" ry="197" transform="rotate(24 300 230)"/><circle cx="535" cy="130" r="5"/><circle cx="75" cy="321" r="3"/></svg>
    <span class="collection-symbol" aria-hidden="true">${content.symbol}</span>
    <div class="collection-cards">${previews.map((t, index) => `<a class="collection-card collection-card-${index}" href="/pozivnice/${esc(t.slug || t.id)}/" aria-label="Pogledaj pozivnicu ${esc(t.name)}"><span><img src="${esc(t.thumbnail)}" alt="${esc(t.imageAlt || t.name)}" width="500" height="700" loading="eager" fetchpriority="${index === 0 ? 'high' : 'low'}" decoding="async"></span></a>`).join('')}</div>
    <span class="collection-seal" aria-hidden="true">${icon('check')} Tvoj tekst. Tvoj trenutak.</span>
    <div class="collection-stage-footer"><span>${esc(content.signature)}</span><button type="button" class="motion-toggle" data-motion-toggle aria-pressed="false" hidden>Pauziraj animacije</button></div>
  </div>`;
}

export function renderCategoryPage({ catalog, category }) {
  const info = CATEGORY_CONTENT[category], content = CATEGORY_EXPERIENCE[category];
  const label = categories.find(c => c.id === category).label;
  const count = catalog.filter(t => t.category === category).length;
  return `<main id="main-content" class="category-landing category-${category}">
    <div class="collection-hero" data-motion-scene>
      <div class="collection-wash" aria-hidden="true"></div>
      <nav class="breadcrumbs container collection-breadcrumbs" aria-label="Putanja"><a href="/">Početna</a><span aria-hidden="true">/</span><a href="/pozivnice/">Pozivnice</a><span aria-hidden="true">/</span><span aria-current="page">${esc(label)}</span></nav>
      <section class="collection-intro container" aria-labelledby="collection-title">
        <div class="collection-copy">
          <div class="eyebrow"><span class="eyebrow-dot"></span>${esc(content.kicker)}</div>
          <h1 id="collection-title">Pozivnice za <span>${esc(info.title.replace('Pozivnice za ', ''))}</span></h1>
          <p>${esc(content.lead)}</p>
          <div class="collection-action"><div class="cta-wrap"><span class="cta-aura" aria-hidden="true"></span>${createLink('hero-cta')}</div><span class="collection-benefits">Besplatno <i></i> Bez naloga <i></i> Bez vodenog žiga</span></div>
        </div>
        ${categoryArt(catalog, category)}
      </section>
    </div>

    <section class="collection-catalog container" id="templates" aria-label="Izaberi šablon">
      <div class="collection-route" aria-label="Tri koraka do pozivnice"><span><b>01</b> Izaberi dizajn</span><i aria-hidden="true"></i><span><b>02</b> Dodaj detalje</span><i aria-hidden="true"></i><span><b>03</b> Preuzmi</span></div>
      ${renderDesigns(catalog, category, true)}
    </section>

    <section class="collection-studio container" aria-labelledby="studio-title">
      <div class="collection-section-heading" data-reveal><div class="eyebrow">OD PRVOG KLIKA DO PRVOG OSMEHA</div><h2 id="studio-title">Malo detalja.<br><span>Sasvim tvoja pozivnica.</span></h2><p>Sve što ti treba već je tu. Dodaj ono što je samo tvoje.</p></div>
      <div class="studio-steps" data-motion-scene>
        <article class="studio-step" data-reveal><div class="studio-graphic studio-graphic-choose" aria-hidden="true"><i></i><i></i><i>${icon('check')}</i></div><span class="step-number">01 / TVOJ IZBOR</span><h3>Pronađi svoj stil.</h3><p>Izaberi motiv koji prati proslavu. Svaki šablon je polazna tačka za tvoju priču.</p></article>
        <article class="studio-step" data-reveal><div class="studio-graphic studio-graphic-edit" aria-hidden="true"><span>Ime na pozivnici<i></i></span><b>${icon('edit')}</b></div><span class="step-number">02 / TVOJ POTPIS</span><h3>Dodaj svoje reči.</h3><p>${esc(content.edit)} Menjaj tekst i prati pregled uživo.</p></article>
        <article class="studio-step" data-reveal><div class="studio-graphic studio-graphic-save" aria-hidden="true"><span>${icon('download')}</span><b>PNG</b><b>PDF</b></div><span class="step-number">03 / NJIHOV OSMEH</span><h3>Spremna za goste.</h3><p>Preuzmi sliku za poruku ili PDF za štampu. Besplatno, direktno na svoj uređaj.</p></article>
      </div>
    </section>

    <section class="collection-guide container" aria-labelledby="guide-title">
      <div class="collection-guide-copy" data-reveal><div class="eyebrow">DOBAR POZIV JE U DETALJIMA</div><h2 id="guide-title">${esc(content.guideTitle)}</h2><p>${esc(content.guide)}</p><h3>Šta napisati na pozivnici?</h3><ul class="collection-checklist">${content.checklist.map(line => `<li>${icon('check')}<span>${esc(line)}</span></li>`).join('')}</ul><p class="collection-print-note">${icon('file')} PNG za poruke. PDF za štampu u formatu 12,7 × 17,78 cm, u stvarnoj veličini. Za prepust proveri zahteve štamparije.</p></div>
      <div class="collection-examples" data-reveal><h3>Primeri teksta za pozivnicu</h3><p>Uzmi ideju, dodaj svoje podatke i napiši je svojim rečima.</p>${content.examples.map(([title, text], index) => `<article class="invitation-example"><div class="example-heading"><span>${esc(title)}</span><button type="button" data-copy-text="example-${index}" hidden aria-label="Kopiraj tekst: ${esc(title)}">Kopiraj ${icon('file')}</button></div><blockquote id="example-${index}">${esc(text)}</blockquote></article>`).join('')}</div>
    </section>

    ${renderGuideSection({ category, title: 'Dobre reči. Laki sledeći koraci.' })}
    <section class="faq container collection-faq" aria-labelledby="category-faq-title"><div class="faq-intro" data-reveal><div class="eyebrow">JOŠ SAMO PAR DETALJA</div><h2 id="category-faq-title">Tvoja pitanja.<br>Jasni odgovori.</h2><p>Sve o izradi, tekstu i deljenju pozivnice za ovaj povod.</p></div><div class="faq-list" data-reveal>${[...content.faqs, ['Da li su izrada i preuzimanje besplatni?', 'Da. Izbor šablona, uređivanje i preuzimanje PNG slike ili PDF-a su besplatni. Nije potreban nalog i na pozivnici nema vodenog žiga.']].map(([q, a]) => `<details><summary>${esc(q)} ${icon('plus')}</summary><p>${esc(a)}</p></details>`).join('')}</div></section>

    <section class="collection-finale container" data-reveal><div class="eyebrow">TVOJI LJUDI. TVOJ POZIV.</div><h2>Još samo da ih pozoveš.</h2><p>${count ? 'Tvoj dizajn te čeka. Dodaj mu svoj potpis.' : 'Istraži kolekciju i pronađi inspiraciju za svoj poziv.'}</p>${createLink()}<span>Besplatno, od prve ideje do preuzimanja.</span></section>
    <nav class="collection-other container category-tabs" aria-label="Istraži kategorije pozivnica"><div><span class="eyebrow">NEKI DRUGI LEP POVOD?</span><a href="/pozivnice/" data-category="all">Sve pozivnice ${icon('arrow')}</a></div><div class="collection-category-links">${categories.filter(c => c.id !== 'all').map(c => `<a class="category-tab ${c.id === category ? 'active' : ''}" href="${categoryPath(c.id)}" data-category="${c.id}" ${c.id === category ? 'aria-current="page"' : ''}>${icon(c.icon)}${esc(c.label)}</a>`).join('')}</div></nav>
  </main><div class="mobile-create-bar category-create-bar" inert aria-hidden="true">${createLink()}<span>Tvoja pozivnica, u nekoliko klikova.</span></div>`;
}
