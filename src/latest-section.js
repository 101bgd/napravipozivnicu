import { templateImageAlt } from './image-metadata.js';
import { categories } from './templates.js';
import { escapeHtml as esc, icon } from './ui.js';
import { latestTemplates, LATEST_SECTION_ID } from './latest-templates.js';

export function renderLatestSection(catalog) {
  const latest = latestTemplates(catalog);
  if (!latest.length) return '';
  return `<section class="latest-section container" id="${LATEST_SECTION_ID}" aria-labelledby="latest-title">
  <div class="latest-heading" data-reveal><div><div class="eyebrow"><span class="eyebrow-dot"></span>NOVO U KOLEKCIJI</div><h2 id="latest-title">Najnovije pozivnice<span>.</span></h2><p>Po jedan najnoviji dizajn iz svake kategorije. Za ostale motive otvori celu kolekciju.</p></div><a class="latest-all" href="/pozivnice/">Pogledaj sve pozivnice ${icon('arrow')}</a></div>
  <div class="latest-grid">${latest.map(template => `<article class="latest-card latest-${esc(template.category)}" data-reveal>
    <a class="latest-link" href="/pozivnice/${esc(template.slug || template.id)}/">
      <div class="latest-preview">${template.thumbnail ? `<img src="${esc(template.thumbnail)}" alt="${esc(templateImageAlt(template))}" width="500" height="700" loading="lazy" decoding="async">` : `<span class="latest-placeholder" aria-hidden="true">${icon(categories.find(category => category.id === template.category)?.icon || 'sparkles')}</span>`}<span class="latest-preview-label" aria-hidden="true">Napravi svoju ${icon('arrow')}</span></div>
      <div class="latest-copy"><span class="latest-category">${esc(categories.find(category => category.id === template.category)?.label || 'Pozivnica')}</span><h3>${esc(template.name)}</h3>${template.description ? `<p>${esc(template.description)}</p>` : ''}<span class="latest-open">Pogledaj pozivnicu ${icon('arrow')}</span></div>
    </a>
  </article>`).join('')}</div>
</section>`;
}
