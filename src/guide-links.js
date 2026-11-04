import { GUIDES, guidesForCategory } from './guide-catalog.js';
import { escapeHtml as esc, icon } from './ui.js';

export function renderGuideCards(guides, editorial = false) {
  return guides.map(guide => `<article class="guide-card guide-theme-${esc(guide.theme)}"><a href="${guide.path}"><span class="guide-card-icon" aria-hidden="true">${icon(guide.icon)}</span><h3>${esc(guide.title)}</h3><p>${esc(editorial ? guide.editorialSummary || guide.summary : guide.summary)}</p><span class="guide-card-open">Pročitaj vodič ${icon('arrow')}</span></a></article>`).join('');
}
export function renderGuideSection({ category = null, guides = null, title = 'Mali saveti. Lepši pozivi.', id = 'korisni-vodici', editorial = false } = {}) {
  const selected = guides || (category ? guidesForCategory(category) : GUIDES);
  return `<section class="guide-teasers container" id="${id}" aria-labelledby="${id}-title"><div class="guide-section-heading" data-reveal><div><div class="eyebrow">${editorial ? 'POMOĆ PRI IZRADI' : 'OD DOBRE IDEJE DO GOTOVOG POZIVA'}</div><h2 id="${id}-title">${esc(title)}</h2><p>${editorial ? 'Primeri teksta, slanje gostima i priprema za štampu.' : 'Tekstovi i uputstva koji olakšavaju sledeći korak.'}</p></div><a class="latest-all" href="/vodici/">Svi vodiči ${icon('arrow')}</a></div><div class="guide-card-grid">${renderGuideCards(selected, editorial)}</div></section>`;
}
