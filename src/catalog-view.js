import { categories } from './templates.js';
import { icon, escapeHtml as esc } from './ui.js';
export function renderCards(shown = []) {
  if (!shown.length) return `<div class="empty-state"><span class="empty-state-icon">${icon('search')}</span><h3>Još malo do tvog dizajna.</h3><p>Nema pozivnica za ovaj izbor. Probaj drugi naziv ili pogledaj sve dizajne.</p><button class="button secondary" id="clear-search">Pogledaj sve pozivnice ${icon('arrow')}</button></div>`;
  return shown.map(t => `<article class="template-card template-${esc(t.category)}">
    <button class="template-preview" data-template="${esc(t.id)}" aria-label="Uredi pozivnicu ${esc(t.name)}">
      <span class="template-surface">${t.style === 'custom' ? `<img src="${esc(t.thumbnail)}" alt="${esc(t.name)}" width="500" height="700" loading="lazy" decoding="async">` : `<canvas width="500" height="700" data-canvas="${esc(t.id)}" aria-hidden="true"></canvas>`}</span>
      <span class="template-badge">Besplatno</span>
      <span class="template-hover template-preview-action">Napravi svoju ${icon('arrow')}</span>
    </button>
    <div class="template-meta"><div><span class="template-category">${esc(categories.find(c => c.id === t.category)?.label || 'Pozivnica')}</span><h3><a href="/pozivnice/${esc(t.slug || t.id)}/">${esc(t.name)}</a></h3></div><button class="template-open icon-button" data-template="${esc(t.id)}" aria-label="Uredi ${esc(t.name)}">${icon('arrow')}</button></div>
  </article>`).join('');
}
