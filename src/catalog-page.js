import { categories } from './templates.js';
import { publicTemplates as builtinTemplates } from './curated-catalog.js';
import { renderCards } from './catalog-view.js';
import { CATEGORY_CONTENT, categoryPath } from './seo-content.js';
import { icon, escapeHtml as esc } from './ui.js';

const occasionCopy = {
  first: 'Prva svećica. Velika radost.',
  eighteen: 'Jedna noć. Tvoj novi početak.',
  birthday: 'Još jedan razlog za slavlje.',
  wedding: 'Početak vašeg zauvek.',
  baptism: 'Mali korak. Velika ljubav.',
  baby: 'Dobro došla, mala srećo.',
};

const occasionColors = {
  first: ['#ffb997', '#f57e79'],
  eighteen: ['#bbacff', '#8975e8'],
  birthday: ['#93c5ff', '#5b96f2'],
  wedding: ['#f4b6cb', '#df88a6'],
  baptism: ['#b5d9ba', '#80b498'],
  baby: ['#f9da9e', '#e8b65f'],
};

function occasionArt(id) {
  const [light, dark] = occasionColors[id];
  const fill = `url(#occasion-${id}-fill)`;
  const shape = {
    first: `<path d="M26 49a6 6 0 0 1 6-6h24a6 6 0 0 1 6 6v17H26Z" fill="${fill}"/><path d="M23 64h42v5H23Z" fill="${dark}" opacity=".48"/><path d="M27 49c4 9 8-3 12 3s9 3 11-1 8 5 11-2" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><rect x="41" y="28" width="6" height="16" rx="3" fill="${dark}"/><path d="M44 16c-7 8-6 12 0 12s7-4 0-12Z" fill="#f5c76e"/><path d="m24 28 2 4m39 4-4 2m-2-19-2 4" stroke="${dark}" stroke-width="2.5" stroke-linecap="round" opacity=".65"/>`,
    eighteen: `<path d="M25 29 35 23v42" fill="none" stroke="${fill}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><path d="M56 44c-15 0-15-22 0-22s15 22 0 22Zm0 0c-18 0-18 24 0 24s18-24 0-24Z" fill="none" stroke="${fill}" stroke-width="9"/><path d="m19 16 1 4m49 56 3-1m1-57-3 3" stroke="${dark}" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>`,
    birthday: `<rect x="25" y="41" width="38" height="27" rx="5" fill="${fill}"/><rect x="21" y="31" width="46" height="14" rx="4" fill="${light}"/><path d="M44 32c-16 0-20-13-12-13s12 13 12 13Zm0 0c16 0 20-13 12-13S44 32 44 32Z" fill="none" stroke="${dark}" stroke-width="4.5" stroke-linejoin="round"/><path d="M44 33v35" stroke="#fff" stroke-opacity=".85" stroke-width="6"/>`,
    wedding: `<circle cx="34" cy="53" r="16" fill="none" stroke="${fill}" stroke-width="7"/><circle cx="55" cy="53" r="16" fill="none" stroke="${fill}" stroke-width="7"/><path d="M44 32 32 21c-7-8 5-16 12-8 7-8 19 0 12 8Z" fill="${fill}"/><path d="M23 49c1-5 4-8 8-9m13 9c1-5 4-8 8-9" stroke="#fff" stroke-opacity=".75" stroke-width="2" stroke-linecap="round"/>`,
    baptism: `<path d="M41 22h6v15h14v6H47v27h-6V43H27v-6h14Z" fill="${fill}"/><path d="M27 65C13 52 18 35 26 25m35 40c14-13 9-30 1-40" fill="none" stroke="${dark}" stroke-width="2" stroke-linecap="round"/><path d="M21 47c-12-1-11-8-11-8 9-1 12 8 12 8Zm0-9c-9-7-5-12-5-12 8 3 5 12 5 12Zm4 19c-13 3-15-5-15-5 9-4 15 5 15 5Zm42-10c12-1 11-8 11-8-9-1-12 8-12 8Zm0-9c9-7 5-12 5-12-8 3-5 12-5 12Zm-4 19c13 3 15-5 15-5-9-4-15 5-15 5Z" fill="${light}"/>`,
    baby: `<path d="M53 18c-28-4-43 27-24 46 19 19 47 3 44-19-17 14-37-10-20-27Z" fill="${fill}"/><path d="m64 18 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z" fill="${light}"/><path d="m24 17 1 3 3 1-3 1-1 3-1-3-3-1 3-1Zm49 43 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z" fill="${dark}"/><path d="M29 45c0 9 5 15 11 18" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".65"/>`,
  }[id];
  return `<svg class="occasion-illustration" viewBox="0 0 88 88" width="88" height="88" fill="none" aria-hidden="true"><defs><linearGradient id="occasion-${id}-fill" x1="20" y1="15" x2="65" y2="72" gradientUnits="userSpaceOnUse"><stop stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></linearGradient></defs><ellipse cx="44" cy="75" rx="23" ry="3" fill="${dark}" opacity=".1"/>${shape}</svg>`;
}

function designCount(count) {
  const last = count % 10;
  return `${count} ${last === 1 && count % 100 !== 11 ? 'dizajn' : 'dizajna'}`;
}

export function renderCatalogPage({ catalog = builtinTemplates, category = 'all' } = {}) {
  const activeCategory = categories.some(c => c.id === category) ? category : 'all';
  const heading = CATEGORY_CONTENT[activeCategory]?.title || 'Šta slavimo?';
  return `<section class="catalog-page container" id="templates">
    <header class="catalog-intro">
      <a class="catalog-back" href="/">${icon('arrow')} Početna</a>
      <div class="eyebrow"><span class="eyebrow-dot"></span> TVOJ MALI DIZAJN STUDIO</div>
      <h1>${esc(heading)}</h1>
      <p>Izaberi povod, pronađi svoj dizajn i dodaj mu nešto tvoje.</p>
      <ol class="catalog-progress" aria-label="Koraci do tvoje pozivnice">
        <li class="current" aria-current="step"><span>1</span> Izaberi dizajn</li>
        <li><span>2</span> Dodaj detalje</li>
        <li><span>3</span> Preuzmi</li>
      </ol>
    </header>

    <nav class="category-tabs occasion-picker" aria-label="Kategorije pozivnica">
      <div class="occasion-picker-heading"><h2>Jedan lep povod.</h2><a href="/pozivnice/" class="category-tab category-all ${activeCategory === 'all' ? 'active' : ''}" data-category="all" data-category-url="/pozivnice/" ${activeCategory === 'all' ? 'aria-current="page"' : ''}>${icon('grid')} Sve pozivnice <span>${catalog.length}</span></a></div>
      <div class="occasion-grid">${categories.filter(c => c.id !== 'all').map(c => {
        const count = catalog.filter(t => t.category === c.id).length;
        return `<a href="${categoryPath(c.id)}" class="category-tab occasion-card occasion-${c.id} ${activeCategory === c.id ? 'active' : ''}" data-category="${c.id}" data-category-url="${categoryPath(c.id)}" ${activeCategory === c.id ? 'aria-current="page"' : ''}>
          <span class="occasion-art">${occasionArt(c.id)}</span>
          <span class="occasion-copy"><span class="occasion-name">${esc(c.label)}</span><span class="occasion-description">${occasionCopy[c.id]}</span><span class="occasion-count">${designCount(count)}</span></span>
          <span class="occasion-selected">${icon('check')}</span>
        </a>`;
      }).join('')}</div>
    </nav>

    ${renderDesigns(catalog, activeCategory)}
  </section>`;
}

export function renderDesigns(catalog, category, categoryLanding = false) {
  const visible = catalog.filter(t => category === 'all' || t.category === category);
  return `    <section class="catalog-designs" id="designs" tabindex="-1" aria-labelledby="designs-title">
      <div class="catalog-tools">
        <div class="catalog-results"><span class="eyebrow">MALI DETALJI. VELIKI UTISAK.</span><h2 id="designs-title" tabindex="-1">Pronađi svoj dizajn.</h2><span id="result-count" aria-live="polite">Prikazano ${visible.length} pozivnica</span>${categoryLanding ? '<a class="catalog-change" href="/pozivnice/">Drugi povod →</a>' : '<button class="catalog-change" type="button">Promeni povod ↑</button>'}</div>
        <label class="search-box">${icon('search')}<input id="search" type="search" placeholder="Pronađi dizajn…" aria-label="Pretraži dizajne" autocomplete="off"></label>
      </div>
      <div class="template-grid" id="template-grid">${renderCards(visible)}</div>
      <div class="catalog-footnote"><span>${icon('check')} Besplatno preuzimanje</span><span>${icon('check')} Bez registracije</span><span>${icon('check')} PNG i PDF</span></div>
    </section>`;
}
