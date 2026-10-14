import { SITE_URL, CATEGORY_CONTENT, categoryPath } from './seo-content.js';
import { escapeHtml as esc, brand } from './ui.js';
import { renderCards } from './catalog-view.js';
export const safeJson = value => JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
export function pageMeta({ category = 'all', template = null, catalog = [], siteUrl = SITE_URL } = {}) {
  const info = CATEGORY_CONTENT[category];
  const path = template ? `/pozivnice/${template.slug || template.id}/` : categoryPath(category);
  const title = template ? `${template.name} — ${CATEGORY_CONTENT[template.category].title}` : info ? `${info.title} — besplatno pravljenje online` : 'Besplatne pozivnice online — Napravi pozivnicu';
  const description = template ? template.description || `Personalizuj pozivnicu „${template.name}“. Promeni tekst, dodaj fotografiju i preuzmi besplatnu sliku ili PDF za štampu.` : info?.description || 'Napravi besplatnu pozivnicu za rođendan, venčanje, krštenje ili rođenje deteta. Uredi tekst i fotografiju i preuzmi PNG ili PDF, bez registracije.';
  const url = `${siteUrl}${path}`;
  const graph = [{ '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: `${siteUrl}/`, name: 'Napravi pozivnicu', inLanguage: 'sr-Latn' }, { '@type': 'WebPage', '@id': `${url}#page`, url, name: title, description, inLanguage: 'sr-Latn', isPartOf: { '@id': `${siteUrl}/#website` } }];
  if (info || template) {
    const items = [{ '@type': 'ListItem', position: 1, name: 'Napravi pozivnicu', item: `${siteUrl}/` }, { '@type': 'ListItem', position: 2, name: template ? CATEGORY_CONTENT[template.category].title : info.title, item: `${siteUrl}${categoryPath(template ? template.category : category)}` }];
    if (template) items.push({ '@type': 'ListItem', position: 3, name: template.name, item: url });
    graph.push({ '@type': 'BreadcrumbList', itemListElement: items });
  }
  if (!template) graph.push({ '@type': 'ItemList', itemListElement: catalog.filter(t => category === 'all' || t.category === category).map((t, index) => ({ '@type': 'ListItem', position: index + 1, name: t.name, url: `${siteUrl}/pozivnice/${t.slug || t.id}/` })) });
  return { title, description, url, image: `${siteUrl}${template?.thumbnail || '/social-preview.png'}`, structured: { '@context': 'https://schema.org', '@graph': graph } };
}
export function renderHead(meta) {
  return `<title>${esc(meta.title)}</title><meta name="description" content="${esc(meta.description)}"><link rel="canonical" href="${esc(meta.url)}"><meta property="og:type" content="website"><meta property="og:locale" content="sr_RS"><meta property="og:site_name" content="Napravi pozivnicu"><meta property="og:title" content="${esc(meta.title)}"><meta property="og:description" content="${esc(meta.description)}"><meta property="og:url" content="${esc(meta.url)}"><meta property="og:image" content="${esc(meta.image)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(meta.title)}"><meta name="twitter:description" content="${esc(meta.description)}"><meta name="twitter:image" content="${esc(meta.image)}"><script type="application/ld+json">${safeJson(meta.structured)}</script>`;
}
export function renderDocument(baseHtml, content, meta) {
  const body = baseHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] || '';
  const scripts = [...body.matchAll(/<script\b[^>]*\bsrc=[^>]*>[\s\S]*?<\/script>/gi)].map(match => match[0]).join('');
  return baseHtml.replace(/<!--seo-start-->[\s\S]*?<!--seo-end-->/, `<!--seo-start-->${renderHead(meta)}<!--seo-end-->`).replace(/<body[^>]*>[\s\S]*<\/body>/i, `<body><div id="app">${content}</div>${scripts}</body>`);
}
export function renderCategoryContent(category) {
  const info = CATEGORY_CONTENT[category]; if (!info) return '';
  return `<section class="category-guide container"><h2>Kako napraviti pozivnicu: ${esc(info.title.toLowerCase())}</h2><p>${esc(info.intro)}</p><h3>Primer teksta za pozivnicu</h3><blockquote>${esc(info.sample)}</blockquote><h3>Šta napisati na pozivnici?</h3><p>${esc(info.tip)}</p><p>Izaberite dizajn, unesite podatke i proverite pregled. PNG je namenjen deljenju, a PDF je u formatu 12,7 × 17,78 cm za štampu u stvarnoj veličini.</p></section>`;
}
export function catalogData(catalog, category = 'all', pageType = 'catalog') { return `<script id="catalog-data" type="application/json">${safeJson({ templates: catalog, category, pageType })}</script>`; }
export function renderTemplatePage(template, catalog) {
  const info = CATEGORY_CONTENT[template.category];
  return `<header class="site-header"><div class="container header-inner"><a href="/" class="brand" aria-label="Napravi pozivnicu, početna">${brand}</a><nav class="navigation" aria-label="Glavna navigacija"><a href="/">Sve pozivnice</a><a href="${categoryPath(template.category)}">${esc(info.title)}</a></nav></div></header><main class="container template-detail"><nav class="breadcrumbs" aria-label="Putanja"><a href="/">Početna</a> / <a href="${categoryPath(template.category)}">${esc(info.title)}</a> / <span>${esc(template.name)}</span></nav><div class="detail-layout"><section><h1>${esc(template.name)}</h1><p>${esc(template.description || info.intro)}</p><p>Promeni tekst, unesi datum i mesto proslave i dodaj fotografiju ako dizajn ima okvir. Sve izmene vidiš odmah, a gotovu pozivnicu preuzimaš besplatno.</p><button class="button primary" data-open-template="${template.id}">Uredi ovu pozivnicu</button><p class="detail-benefits">Bez registracije · Bez vodenog žiga · PNG i PDF</p><h2>Preuzimanje i štampa</h2><p>PNG ima 1500 × 2100 piksela. PDF je pripremljen za štampu u formatu 12,7 × 17,78 cm, u 300 dpi. Za štampu sa prepustom proveri zahteve štamparije.</p><p><a href="${categoryPath(template.category)}">Pogledaj još pozivnica za ovaj povod →</a></p></section><div class="detail-preview">${renderCards([template])}</div></div><section class="detail-related"><h2>Još dizajna za tvoju proslavu</h2><div class="template-grid" id="template-grid">${renderCards(catalog.filter(t => t.category === template.category && t.id !== template.id).slice(0, 4))}</div></section></main><footer><div class="container footer-main"><a class="brand" href="/">${brand}</a><p>Pozivnice za vaše najlepše trenutke.</p></div></footer><div class="toast" id="toast" role="status" aria-live="polite"></div>${catalogData(catalog, template.category, 'detail')}`;
}
export function sitemap(catalog, siteUrl = SITE_URL) {
  const entries = [{ path: '/' }, ...Object.keys(CATEGORY_CONTENT).map(id => ({ path: categoryPath(id) })), ...catalog.map(t => ({ path: `/pozivnice/${t.slug || t.id}/`, updatedAt: t.updatedAt }))];
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.map(e => `<url><loc>${esc(`${siteUrl}${e.path}`)}</loc>${e.updatedAt ? `<lastmod>${esc(e.updatedAt.slice(0, 10))}</lastmod>` : ''}</url>`).join('')}</urlset>`;
}
