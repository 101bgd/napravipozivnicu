import { categories } from './templates.js';
import { icon, escapeHtml } from './ui.js';

export function renderCards(shown) {
  return shown.length ? shown.map(t=>`<article class="template-card"><button class="template-preview" data-template="${t.id}" aria-label="Uredi pozivnicu ${escapeHtml(t.name)}"><canvas width="500" height="700" data-canvas="${t.id}" aria-hidden="true"></canvas>${t.badge?`<span class="template-badge">${t.badge==='Popularno'?icon('sparkles'):icon('heart')}${t.badge}</span>`:''}<span class="template-hover">Personalizuj ${icon('arrow')}</span></button><div class="template-meta"><div><span class="template-category">${categories.find(c=>c.id===t.category).label}</span><h3>${t.name}</h3></div><button class="template-open icon-button" data-template="${t.id}" aria-label="Uredi ${escapeHtml(t.name)}">${icon('arrow')}</button></div></article>`).join('') : `<div class="empty-state">${icon('search')}<h3>Nijedan dizajn se ne poklapa.</h3><p>Pokušaj drugi naziv ili izaberi sve pozivnice.</p><button class="button secondary" id="clear-search">Prikaži sve pozivnice</button></div>`;
}
