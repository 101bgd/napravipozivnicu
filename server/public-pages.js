import { templates as builtins } from '../src/templates.js';
import { curatedTemplates, publicTemplates } from '../src/curated-catalog.js';
import { curatedDesign } from '../src/curated-designs.js';
import { renderPage } from '../src/page.js';
import { CATEGORY_CONTENT, SITE_URL, categoryFromPath } from '../src/seo-content.js';
import { renderDocument, pageMeta, renderTemplatePage, sitemap } from '../src/seo.js';
import { publicTemplate } from '../src/template-schema.js';
import { serveAsset } from './admin-api.js';
import { HttpError } from './auth.js';
import { isRetiredRecord } from '../src/retired-templates.js';
import { infoPageFromPath } from '../src/info-content.js';
import { renderInfoPage } from '../src/info-page.js';
import { readAdSense, applyAdSense, adSenseHost } from './adsense.js';
export async function publishedCatalog(env) {
  if (!env.DB) return publicTemplates;
  try {
  const { results } = await env.DB.prepare('SELECT id, slug, name, draft_json, published_json, published_at, created_at, updated_at FROM templates WHERE published_json IS NOT NULL ORDER BY published_at DESC LIMIT 500').all();
  const settings = (await env.DB.prepare('SELECT key, value FROM settings').all()).results;
  const visibleBuiltins = settings.some(s => s.key === 'show_examples' && s.value === 'false') ? [] : builtins.filter(t => !settings.some(s => s.key === `example_hidden:${t.id}` && s.value === 'true'));
  const visibleCurated = curatedTemplates.filter(t => !settings.some(s => s.key === `example_hidden:${t.id}` && s.value === 'true'));
  return [...results.filter(row => !isRetiredRecord(row)).map(row => { const full = publicTemplate(row); return { id: full.id, slug: full.slug, name: full.name, category: full.category, style: full.style, description: full.description, imageAlt: full.imageAlt, seoTitle: full.seoTitle, details: full.details, thumbnail: full.thumbnail, hasPhoto: full.layers.some(layer => layer.type === 'photo'), updatedAt: full.updatedAt }; }), ...visibleCurated, ...visibleBuiltins];
  } catch (error) { if (String(error.message).includes('no such table')) return publicTemplates; throw error; }
}
export async function handlePublic(request, env, staticFetch) {
  const url = new URL(request.url), path = url.pathname, siteUrl = new URL(env.SITE_URL || SITE_URL).origin;
  if (!['GET', 'HEAD'].includes(request.method)) throw new HttpError(405, 'Metoda nije podržana.');
  if (path === '/ads.txt') {
    const adsense = await readAdSense(env);
    const body = adsense.publisherId ? `google.com, ${adsense.publisherId.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n` : '# AdSense publisher nije podešen.\n';
    return new Response(request.method === 'HEAD' ? null : body, { status: adsense.publisherId ? 200 : 404, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=0, must-revalidate', 'X-Content-Type-Options': 'nosniff' } });
  }
  const media = path.match(/^\/media\/([a-f0-9-]+)$/);
  if (media) return serveAsset(request, env, media[1]);
  const templateApi = path.match(/^\/api\/templates\/([a-z0-9-]+)$/);
  if (templateApi) {
    if (curatedTemplates.some(t => t.id === templateApi[1])) {
      if (!(await publishedCatalog(env)).some(t => t.id === templateApi[1])) throw new HttpError(404, 'Ova pozivnica trenutno nije dostupna.');
      return Response.json(curatedDesign(templateApi[1]), { headers: { 'Cache-Control': 'no-cache', 'X-Robots-Tag': 'noindex' } });
    }
    const builtin = builtins.some(t => t.id === templateApi[1]) ? (await publishedCatalog(env)).find(t => t.style !== 'custom' && t.id === templateApi[1]) : null;
    if (builtin) return Response.json(builtin, { headers: { 'Cache-Control': 'no-cache', 'X-Robots-Tag': 'noindex' } });
    const row = env.DB ? await env.DB.prepare('SELECT * FROM templates WHERE id = ? AND published_json IS NOT NULL').bind(templateApi[1]).first() : null;
    if (!row || isRetiredRecord(row)) throw new HttpError(404, 'Ova pozivnica trenutno nije dostupna.');
    return Response.json(publicTemplate(row), { headers: { 'Cache-Control': 'no-cache', 'X-Robots-Tag': 'noindex' } });
  }
  if (path === '/robots.txt') {
    const publicHost = new URL(siteUrl).hostname;
    const content = url.hostname === publicHost || url.hostname === `www.${publicHost}` || ['localhost', '127.0.0.1'].includes(url.hostname) ? `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: ${siteUrl}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n';
    return new Response(request.method === 'HEAD' ? null : content, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
  }
  const infoPage = infoPageFromPath(path), category = categoryFromPath(path), detail = path.match(/^\/pozivnice\/([a-z0-9-]+)\/?$/), collection = /^\/pozivnice\/?$/.test(path);
  if (path !== '/' && !infoPage && !category && !detail && !collection && path !== '/sitemap.xml' && path !== '/api/catalog') return null;
  if ((infoPage || category || detail || collection) && !path.endsWith('/')) return Response.redirect(`${url.origin}${path}/${url.search}`, 301);
  const catalog = path === '/' || infoPage ? [] : await publishedCatalog(env);
  if (path === '/api/catalog') return Response.json({ templates: catalog }, { headers: { 'Cache-Control': 'no-cache', 'X-Robots-Tag': 'noindex' } });
  if (path === '/sitemap.xml') return new Response(request.method === 'HEAD' ? null : sitemap(catalog, siteUrl), { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=60' } });
  const template = detail ? catalog.find(t => (t.slug || t.id) === detail[1]) : null;
  if (detail && !template) throw new HttpError(404, 'Ova pozivnica trenutno nije dostupna.');
  const baseResponse = await staticFetch('/');
  if (!baseResponse.ok) throw new HttpError(503, 'Stranica trenutno nije dostupna.');
  const view = category || collection ? 'catalog' : 'landing';
  const content = infoPage ? renderInfoPage(infoPage) : template ? renderTemplatePage(template, catalog) : renderPage({ category: category || 'all', catalog, view });
  const adsense = await readAdSense(env);
  const html = applyAdSense(renderDocument(await baseResponse.text(), content, pageMeta({ category: category || 'all', infoPage, template, catalog, siteUrl, view })), adsense, adSenseHost(url, siteUrl));
  const headers = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=0, must-revalidate', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin' };
  if (url.hostname.endsWith('.pages.dev')) headers['X-Robots-Tag'] = 'noindex';
  return new Response(request.method === 'HEAD' ? null : html, { headers });
}
