import { templateImageAlt } from './image-metadata.js';
import { GUIDES, GUIDE_HUB } from './guide-catalog.js';
import { GUIDE_CONTENT } from './guide-content.js';
import { renderGuideCards, renderGuideSection } from './guide-links.js';
import { escapeHtml as esc, icon } from './ui.js';
import { siteHeader, siteFooter } from './site-shell.js';
import { catalogData } from './seo.js';

const dateText = date => new Intl.DateTimeFormat('sr-Latn-RS', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(date));
function relatedTemplates(guide, catalog) {
  const templates = catalog.filter(t => t.thumbnail && (!guide.categories.length || guide.categories.includes(t.category))).slice(0, 3);
  if (!templates.length) return '';
  return `<section class="guide-designs" aria-labelledby="guide-designs-title"><h2 id="guide-designs-title">${guide.id === 'baptism-text' ? 'Dizajni koje možete da uredite' : 'Dizajni koje možeš da urediš'}</h2><p>${guide.id === 'baptism-text' ? 'Otvorite pozivnicu da proverite raspored i dostupna polja.' : 'Otvori pozivnicu da proveriš raspored i dostupna polja.'}</p><div class="guide-design-grid">${templates.map(t => `<a href="/pozivnice/${esc(t.slug || t.id)}/"><img src="${esc(t.thumbnail)}" alt="${esc(templateImageAlt(t))}" width="500" height="700" loading="lazy" decoding="async"><span>${esc(t.name)} ${icon('arrow')}</span></a>`).join('')}</div></section>`;
}
export function renderGuidePage(guide, catalog = []) {
  if (guide.id === GUIDE_HUB.id) return `${siteHeader('guides')}<main class="guide-index container" id="main-content"><nav class="breadcrumbs" aria-label="Putanja"><a href="/">Početna</a> / <span aria-current="page">Vodiči</span></nav><header class="guide-index-intro"><div class="eyebrow">TEKST, SLANJE I ŠTAMPA</div><h1>${esc(guide.title)}</h1><p>${esc(guide.lead)}</p></header><section aria-labelledby="guide-index-title"><h2 id="guide-index-title" class="guide-index-title">Za šta ti treba pomoć?</h2><div class="guide-card-grid guide-index-grid">${renderGuideCards(GUIDES, true)}</div></section><section class="guide-index-action"><h2>Treba ti i dizajn?</h2><p>Izaberi stil, dodaj svoje podatke i preuzmi PNG ili PDF.</p><a class="button primary" href="/pozivnice/">Napravi pozivnicu ${icon('arrow')}</a></section></main>${siteFooter('guides', undefined, true)}${catalogData([], 'all', 'guides')}`;
  const sections = GUIDE_CONTENT[guide.id];
  const words = sections.map(section => section.html.replace(/<[^>]*>/g, ' ')).join(' ').split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${siteHeader('guides')}<main class="guide-page guide-theme-${esc(guide.theme)}" id="main-content"><article class="container guide-article" aria-labelledby="article-title">
  <nav class="breadcrumbs" aria-label="Putanja"><a href="/">Početna</a> / <a href="/vodici/">Vodiči</a> / <span aria-current="page">${esc(guide.title)}</span></nav>
  <header class="guide-hero"><div class="guide-hero-copy"><div class="eyebrow">${esc(guide.label)}</div><h1 id="article-title">${esc(guide.title)}</h1><p>${esc(guide.lead)}</p><div class="guide-byline"><span>Napravi pozivnicu</span><span>${minutes} min čitanja</span><time datetime="${guide.updatedAt}">${dateText(guide.updatedAt)}</time></div></div><div class="guide-hero-symbol" aria-hidden="true">${icon(guide.icon)}<span></span><i></i></div></header>
  <div class="guide-layout"><aside class="guide-sidebar"><nav class="guide-toc" aria-label="Sadržaj vodiča"><h2>U ovom vodiču</h2><ol>${sections.map(section => `<li><a href="#${section.id}">${esc(section.title)}</a></li>`).join('')}</ol></nav></aside><div class="guide-body">${sections.map(section => `<section id="${section.id}" class="guide-body-section"><h2>${esc(section.title)}</h2>${section.html}</section>`).join('')}
  ${relatedTemplates(guide, catalog)}
  <section class="guide-action"><span class="eyebrow">PRIMENI SAVETE</span><h2>${esc(guide.createLabel)}</h2><p>${guide.id === 'baptism-text' ? 'Podatke možete da menjate uz pregled, pre nego što preuzmete gotovu pozivnicu.' : 'Podatke možeš da menjaš uz pregled, pre nego što preuzmeš gotovu pozivnicu.'}</p><a class="button primary" href="${guide.createHref}">${esc(guide.createLabel)} ${icon('arrow')}</a></section>
  </div></div></article>${renderGuideSection({ guides: GUIDES.filter(item => item.id !== guide.id), title: 'Još korisnih ideja', id: 'jos-vodica', editorial: true })}</main>${siteFooter('guides', undefined, true)}<div class="toast" id="toast" role="status" aria-live="polite"></div>${catalogData([], 'all', 'guide')}`;
}
