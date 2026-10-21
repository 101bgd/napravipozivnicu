import { SITE_URL, LANDING_UPDATED_AT, CATEGORY_CONTENT, categoryPath } from './seo-content.js';
import { escapeHtml as esc } from './ui.js';
import { renderCards } from './catalog-view.js';
import { siteHeader, siteFooter } from './site-shell.js';
import { INFO_PAGES } from './info-content.js';
import { categoryHighlights } from './category-content.js';
import { latestTemplates, LATEST_SECTION_ID } from './latest-templates.js';
import { GUIDE_HUB, GUIDES } from './guide-catalog.js';
import { guidePageMeta } from './guide-seo.js';
import { renderGuideSection } from './guide-links.js';
import { templateImageAlt, IMAGE_METADATA_UPDATED_AT } from './image-metadata.js';
export const safeJson = value => JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
export function pageMeta({ category = 'all', template = null, infoPage = null, guidePage = null, catalog = [], siteUrl = SITE_URL, view = 'landing' } = {}) {
  if (guidePage) return guidePageMeta(guidePage, siteUrl);
  const info = CATEGORY_CONTENT[category];
  const path = infoPage?.path || (template ? `/pozivnice/${template.slug || template.id}/` : info ? categoryPath(category) : view === 'catalog' ? '/pozivnice/' : '/');
  const title = infoPage ? `${infoPage.title} — Napravi pozivnicu` : template ? template.seoTitle || `${template.name} — ${CATEGORY_CONTENT[template.category].title}` : info ? info.seoTitle || `${info.title} — besplatno pravljenje online` : view === 'catalog' ? 'Izaberi pozivnicu — besplatni šabloni za svaku proslavu' : 'Besplatne pozivnice online — Napravi pozivnicu';
  const description = infoPage?.description || (template ? template.description || `Personalizuj pozivnicu „${template.name}“. Promeni tekst, dodaj fotografiju i preuzmi besplatnu sliku ili PDF za štampu.` : info?.description || 'Napravi besplatnu pozivnicu za rođendan, venčanje, krštenje ili rođenje deteta. Uredi tekst i fotografiju i preuzmi PNG ili PDF, bez registracije.');
  const url = `${siteUrl}${path}`;
  const featured = template || (info ? categoryHighlights(catalog, category)[0] : null);
  const image = `${siteUrl}${featured?.thumbnail || '/social-preview.png'}`;
  const imageAlt = featured ? templateImageAlt(featured) : 'Napravi pozivnicu — besplatne pozivnice za tvoju proslavu';
  const graph = [{ '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: `${siteUrl}/`, name: 'Napravi pozivnicu', inLanguage: 'sr-Latn' }, { '@type': infoPage?.schemaType || (!template && (info || view === 'catalog') ? 'CollectionPage' : 'WebPage'), '@id': `${url}#page`, url, name: title, description, inLanguage: 'sr-Latn', isPartOf: { '@id': `${siteUrl}/#website` } }];
  if (infoPage) graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Napravi pozivnicu', item: `${siteUrl}/` }, { '@type': 'ListItem', position: 2, name: infoPage.title, item: url }] });
  const images = template ? [template].filter(t => t.thumbnail) : info ? catalog.filter(t => t.category === category && t.thumbnail) : [];
  if (images.length) {
    const imageId = t => `${siteUrl}/pozivnice/${t.slug || t.id}/#image`;
    graph[1].primaryImageOfPage = { '@id': imageId(featured || images[0]) };
    graph[1].image = images.map(t => ({ '@id': imageId(t) }));
    for (const t of images) graph.push({ '@type': 'ImageObject', '@id': imageId(t), name: `${CATEGORY_CONTENT[t.category].imageLabel} — ${t.name}`, contentUrl: `${siteUrl}${t.thumbnail}`, caption: templateImageAlt(t), width: 500, height: 700 });
  }
  if (info) graph[1].about = { '@type': 'Thing', name: info.keyword };
  if (info || template) {
    const items = [{ '@type': 'ListItem', position: 1, name: 'Napravi pozivnicu', item: `${siteUrl}/` }, { '@type': 'ListItem', position: 2, name: template ? CATEGORY_CONTENT[template.category].title : info.title, item: `${siteUrl}${categoryPath(template ? template.category : category)}` }];
    if (template) items.push({ '@type': 'ListItem', position: 3, name: template.name, item: url });
    graph.push({ '@type': 'BreadcrumbList', itemListElement: items });
  }
  if (!template && (info || view === 'catalog')) {
    const items = catalog.filter(t => category === 'all' || t.category === category);
    graph[1].mainEntity = { '@id': `${url}#designs` };
    graph.push({ '@type': 'ItemList', '@id': `${url}#designs`, numberOfItems: items.length, itemListElement: items.map((t, index) => ({ '@type': 'ListItem', position: index + 1, name: t.name, url: `${siteUrl}/pozivnice/${t.slug || t.id}/`, ...(t.thumbnail ? { image: `${siteUrl}${t.thumbnail}` } : {}) })) });
  }
  if (!infoPage && !template && !info && view === 'landing') {
    const latest = latestTemplates(catalog);
    if (latest.length) {
      const listId = `${url}#${LATEST_SECTION_ID}`;
      graph[1].hasPart = { '@id': listId };
      graph.push({ '@type': 'ItemList', '@id': listId, name: 'Najnovije pozivnice', numberOfItems: latest.length, itemListElement: latest.map((t, index) => ({ '@type': 'ListItem', position: index + 1, name: t.name, url: `${siteUrl}/pozivnice/${t.slug || t.id}/`, ...(t.thumbnail ? { image: `${siteUrl}${t.thumbnail}` } : {}) })) });
    }
  }
  return { title, description, url, image, imageAlt, preloadImage: info && !template ? featured?.thumbnail : null, structured: { '@context': 'https://schema.org', '@graph': graph } };
}
export function renderHead(meta) {
  return `${meta.preloadImage ? `<link rel="preload" as="image" href="${esc(meta.preloadImage)}" fetchpriority="high">` : ''}<title>${esc(meta.title)}</title><meta name="description" content="${esc(meta.description)}"><link rel="canonical" href="${esc(meta.url)}"><meta property="og:type" content="${esc(meta.ogType || 'website')}">${meta.publishedAt ? `<meta property="article:published_time" content="${esc(meta.publishedAt)}"><meta property="article:modified_time" content="${esc(meta.updatedAt)}">` : ''}<meta property="og:locale" content="sr_RS"><meta property="og:site_name" content="Napravi pozivnicu"><meta property="og:title" content="${esc(meta.title)}"><meta property="og:description" content="${esc(meta.description)}"><meta property="og:url" content="${esc(meta.url)}"><meta property="og:image" content="${esc(meta.image)}"><meta property="og:image:alt" content="${esc(meta.imageAlt || meta.title)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(meta.title)}"><meta name="twitter:description" content="${esc(meta.description)}"><meta name="twitter:image" content="${esc(meta.image)}"><meta name="twitter:image:alt" content="${esc(meta.imageAlt || meta.title)}"><script type="application/ld+json">${safeJson(meta.structured)}</script>`;
}
export function renderDocument(baseHtml, content, meta) {
  const body = baseHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] || '';
  const scripts = [...body.matchAll(/<script\b[^>]*\bsrc=[^>]*>[\s\S]*?<\/script>/gi)].map(match => match[0]).join('');
  return baseHtml.replace(/<!--seo-start-->[\s\S]*?<!--seo-end-->/, () => `<!--seo-start-->${renderHead(meta)}<!--seo-end-->`).replace(/<body[^>]*>[\s\S]*<\/body>/i, () => `<body><div id="app">${content}</div>${scripts}</body>`);
}
export function catalogData(catalog, category = 'all', pageType = 'catalog') { return `<script id="catalog-data" type="application/json">${safeJson({ templates: catalog, category, pageType })}</script>`; }
export function renderTemplatePage(template, catalog) {
  const info = CATEGORY_CONTENT[template.category];
  return `${siteHeader('catalog')}<main id="main-content" class="container template-detail"><nav class="breadcrumbs" aria-label="Putanja"><a href="/pozivnice/">Sve pozivnice</a> / <a href="${categoryPath(template.category)}">${esc(info.title)}</a> / <span>${esc(template.name)}</span></nav><div class="detail-layout"><section><h1>${esc(template.name)}</h1><p>${esc(template.description || info.intro)}</p>${template.details ? `<p>${esc(template.details)}</p>` : ''}<p>${template.hasPhoto === false ? 'Promeni imena, poruku, datum i mesto proslave. Ovaj dizajn je osmišljen bez fotografije.' : 'Promeni tekst, unesi datum i mesto proslave i dodaj fotografiju ako dizajn ima okvir.'} Sve izmene vidiš odmah, a gotovu pozivnicu preuzimaš besplatno.</p><button class="button primary" data-open-template="${template.id}">Uredi ovu pozivnicu</button><p class="detail-benefits">Bez registracije · Bez vodenog žiga · PNG i PDF</p><h2>Preuzimanje i štampa</h2><p>PNG ima 1500 × 2100 piksela. PDF je pripremljen za štampu u formatu 12,7 × 17,78 cm, u 300 dpi. Za štampu sa prepustom proveri zahteve štamparije.</p><p><a href="${categoryPath(template.category)}">Pogledaj još pozivnica za ovaj povod →</a></p></section><div class="detail-preview">${renderCards([template])}</div></div><section class="detail-related"><h2>Još dizajna za tvoju proslavu</h2><div class="template-grid" id="template-grid">${renderCards(catalog.filter(t => t.category === template.category && t.id !== template.id).slice(0, 4))}</div></section>${renderGuideSection({ category: template.category })}</main>${siteFooter()}<div class="toast" id="toast" role="status" aria-live="polite"></div>${catalogData(catalog, template.category, 'detail')}`;
}
export function sitemap(catalog, siteUrl = SITE_URL) {
  const latestDates = latestTemplates(catalog).map(template => Date.parse(template.updatedAt)).filter(Number.isFinite);
  const landingUpdatedAt = new Date(Math.max(Date.parse(LANDING_UPDATED_AT), ...latestDates)).toISOString();
  const changed = (...dates) => new Date(Math.max(...dates.map(date => Date.parse(date)).filter(Number.isFinite))).toISOString();
  const entries = [{ path: '/', updatedAt: landingUpdatedAt }, { path: '/pozivnice/' }, ...INFO_PAGES.map(page => ({ path: page.path, updatedAt: page.updatedAt })), ...[GUIDE_HUB, ...GUIDES].map(page => ({ path: page.path, updatedAt: page.updatedAt })), ...Object.keys(CATEGORY_CONTENT).map(id => {
    const templates = catalog.filter(t => t.category === id);
    return { path: categoryPath(id), updatedAt: changed(CATEGORY_CONTENT[id].updatedAt, ...templates.map(t => t.updatedAt)), images: templates.map(t => t.thumbnail).filter(Boolean) };
  }), ...catalog.map(t => ({ path: `/pozivnice/${t.slug || t.id}/`, updatedAt: changed(IMAGE_METADATA_UPDATED_AT, t.updatedAt), images: t.thumbnail ? [t.thumbnail] : [] }))];
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${entries.map(e => `<url><loc>${esc(`${siteUrl}${e.path}`)}</loc>${e.updatedAt ? `<lastmod>${esc(e.updatedAt.slice(0, 10))}</lastmod>` : ''}${[...new Set(e.images || [])].map(src => `<image:image><image:loc>${esc(`${siteUrl}${src}`)}</image:loc></image:image>`).join('')}</url>`).join('')}</urlset>`;
}
