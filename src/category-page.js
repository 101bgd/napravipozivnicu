import { templateImageAlt } from './image-metadata.js';
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
    <div class="collection-cards">${previews.map((t, index) => `<a class="collection-card collection-card-${index}" href="/pozivnice/${esc(t.slug || t.id)}/" aria-label="Pogledaj pozivnicu ${esc(t.name)}"><span><img src="${esc(t.thumbnail)}" alt="${esc(templateImageAlt(t))}" width="500" height="700" loading="eager" fetchpriority="${index === 0 ? 'high' : 'low'}" decoding="async"></span></a>`).join('')}</div>
    <span class="collection-seal" aria-hidden="true">${icon('check')} Pregled dizajna</span>
    <div class="collection-stage-footer"><span>${esc(content.signature)}</span><button type="button" class="motion-toggle" data-motion-toggle aria-pressed="false" hidden>Pauziraj animacije</button></div>
  </div>`;
}

export function renderCategoryPage({ catalog, category }) {
  const info = CATEGORY_CONTENT[category], content = CATEGORY_EXPERIENCE[category];
  const address = (singular, plural) => ['wedding', 'baptism', 'baby'].includes(category) ? plural : singular;
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
      <div class="collection-section-heading" data-reveal><div class="eyebrow">KAKO RADI</div><h2 id="studio-title">Uređivanje i preuzimanje pozivnice</h2><p>${address('Promene se vide u pregledu dok uređuješ tekst.', 'Promene se vide u pregledu dok uređujete tekst.')}</p></div>
      <div class="studio-steps" data-motion-scene>
        <article class="studio-step" data-reveal><div class="studio-graphic studio-graphic-choose" aria-hidden="true"><i></i><i></i><i>${icon('check')}</i></div><span class="step-number">01 / IZBOR</span><h3>Izbor dizajna</h3><p>${address('Otvori dizajn i proveri koja polja možeš da izmeniš.', 'Otvorite dizajn i proverite koja polja možete da izmenite.')}</p></article>
        <article class="studio-step" data-reveal><div class="studio-graphic studio-graphic-edit" aria-hidden="true"><span>Ime na pozivnici<i></i></span><b>${icon('edit')}</b></div><span class="step-number">02 / PODACI</span><h3>Podaci o proslavi</h3><p>${esc(content.edit)}</p></article>
        <article class="studio-step" data-reveal><div class="studio-graphic studio-graphic-save" aria-hidden="true"><span>${icon('download')}</span><b>PNG</b><b>PDF</b></div><span class="step-number">03 / PREUZIMANJE</span><h3>Preuzimanje</h3><p>${address('Proveri podatke, pa sačuvaj PNG za poruke ili PDF za štampu.', 'Proverite podatke, pa sačuvajte PNG za poruke ili PDF za štampu.')}</p></article>
      </div>
    </section>

    <section class="collection-guide container" aria-labelledby="guide-title">
      <div class="collection-guide-copy" data-reveal><div class="eyebrow">TEKST POZIVNICE</div><h2 id="guide-title">${esc(content.guideTitle)}</h2><p>${esc(content.intro)}</p><p>${esc(content.guide)}</p><h3>Podaci koje treba pripremiti</h3><ul class="collection-checklist">${content.checklist.map(line => `<li>${icon('check')}<span>${esc(line)}</span></li>`).join('')}</ul>${content.advice.map(([title, text]) => `<h3>${esc(title)}</h3><p>${esc(text)}</p>`).join('')}<p class="collection-print-note">${icon('file')} PNG za poruke. PDF za štampu u formatu 12,7 × 17,78 cm, u stvarnoj veličini. Za štampu sa prepustom potrebno je proveriti zahteve štamparije.</p></div>
      <div class="collection-examples" data-reveal><h3>Primeri teksta za pozivnicu</h3><p>${address('Zameni podatke u zagradama i izostavi ono što ne važi za tvoju proslavu. Proveri kako tekst staje u izabrani dizajn.', 'Zamenite podatke u zagradama i izostavite ono što ne važi za vašu proslavu. Proverite kako tekst staje u izabrani dizajn.')}</p>${content.examples.map(([title, text], index) => `<article class="invitation-example"><div class="example-heading"><span>${esc(title)}</span><button type="button" data-copy-text="example-${index}" hidden aria-label="Kopiraj tekst: ${esc(title)}">Kopiraj ${icon('file')}</button></div><blockquote id="example-${index}">${esc(text)}</blockquote></article>`).join('')}</div>
    </section>

    ${renderGuideSection({ category, title: 'Tekst, slanje i štampa', editorial: true })}
    <section class="faq container collection-faq" aria-labelledby="category-faq-title"><div class="faq-intro" data-reveal><div class="eyebrow">PITANJA O IZRADI</div><h2 id="category-faq-title">${address('Pre nego što preuzmeš pozivnicu', 'Pre nego što preuzmete pozivnicu')}</h2><p>Odgovori o poljima, formatima i načinu slanja.</p></div><div class="faq-list" data-reveal>${[...content.faqs, ['Da li su izrada i preuzimanje besplatni?', 'Da. Izbor šablona, uređivanje i preuzimanje PNG slike ili PDF-a su besplatni. Nije potreban nalog i na pozivnici nema vodenog žiga.']].map(([q, a]) => `<details><summary>${esc(q)} ${icon('plus')}</summary><p>${esc(a)}</p></details>`).join('')}</div></section>

    <section class="collection-finale container" data-reveal><div class="eyebrow">IZBOR DIZAJNA</div><h2>${address('Izaberi pozivnicu za svoju proslavu', 'Izaberite pozivnicu za svoju proslavu')}</h2><p>${count ? address('Vrati se na kolekciju i unesi svoje podatke.', 'Vratite se na kolekciju i unesite svoje podatke.') : 'Istraži kolekciju i pronađi inspiraciju za svoj poziv.'}</p>${createLink()}<span>Uređivanje i preuzimanje su besplatni.</span></section>
    <nav class="collection-other container category-tabs" aria-label="Istraži kategorije pozivnica"><div><span class="eyebrow">DRUGE KATEGORIJE</span><a href="/pozivnice/" data-category="all">Sve pozivnice ${icon('arrow')}</a></div><div class="collection-category-links">${categories.filter(c => c.id !== 'all').map(c => `<a class="category-tab ${c.id === category ? 'active' : ''}" href="${categoryPath(c.id)}" data-category="${c.id}" ${c.id === category ? 'aria-current="page"' : ''}>${icon(c.icon)}${esc(c.label)}</a>`).join('')}</div></nav>
  </main><div class="mobile-create-bar category-create-bar" inert aria-hidden="true">${createLink()}<span>Tvoja pozivnica, u nekoliko klikova.</span></div>`;
}
