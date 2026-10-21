import { defineConfig } from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import { renderPage } from './src/page.js';
import { publicTemplates as templates, curatedTemplates } from './src/curated-catalog.js';
import { curatedDesign } from './src/curated-designs.js';
import { CATEGORY_CONTENT, SITE_URL, categoryPath, categoryFromPath } from './src/seo-content.js';
import { pageMeta, renderHead, renderDocument, renderTemplatePage, sitemap } from './src/seo.js';
import { INFO_PAGES, infoPageFromPath } from './src/info-content.js';
import { renderInfoPage } from './src/info-page.js';
import { GUIDE_HUB, GUIDES, guidePageFromPath } from './src/guide-catalog.js';
import { renderGuidePage } from './src/guide-page.js';
function localCuratedApi(server) {
  server.middlewares.use((request, response, next) => {
    const match = new URL(request.url, 'http://localhost').pathname.match(/^\/api\/templates\/([a-z0-9-]+)$/);
    if (!match || !curatedTemplates.some(t => t.id === match[1])) return next();
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
    response.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' });
    response.end(request.method === 'HEAD' ? undefined : JSON.stringify(curatedDesign(match[1])));
  });
}
export default defineConfig({
  plugins: [{
    name: 'static-page-content',
    configureServer: localCuratedApi,
    configurePreviewServer: localCuratedApi,
    transformIndexHtml: { order: 'pre', handler(html, context) {
      if (!html.includes('<!--app-content-->')) return html;
      const requestPath = new URL(context.originalUrl || context.path, 'http://localhost').pathname;
      const category = categoryFromPath(requestPath) || 'all';
      const view = category !== 'all' || /^\/pozivnice\/?$/.test(requestPath) ? 'catalog' : 'landing';
      const template = templates.find(t => requestPath === `/pozivnice/${t.slug || t.id}/`);
      const infoPage = infoPageFromPath(requestPath);
      const guidePage = guidePageFromPath(requestPath);
      return html.replace('<!--app-content-->', () => guidePage ? renderGuidePage(guidePage, templates) : infoPage ? renderInfoPage(infoPage) : template ? renderTemplatePage(template, templates) : renderPage({ category, view })).replace('<!--seo-content-->', () => renderHead(pageMeta({ category, view, template, infoPage, guidePage, catalog: templates })));
    } },
    async closeBundle() {
      if (process.env.VITE_DEV_SERVER) return;
      let base; try { base = await fs.readFile('dist/index.html', 'utf8'); } catch { return; }
      await fs.mkdir('dist/pozivnice', { recursive: true });
      await fs.writeFile('dist/pozivnice/index.html', renderDocument(base, renderPage({ view: 'catalog' }), pageMeta({ view: 'catalog', catalog: templates })));
      for (const infoPage of INFO_PAGES) {
        const file = path.join('dist', infoPage.path, 'index.html');
        await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, renderDocument(base, renderInfoPage(infoPage), pageMeta({ infoPage })));
      }
      for (const guidePage of [GUIDE_HUB, ...GUIDES]) {
        const file = path.join('dist', guidePage.path, 'index.html');
        await fs.mkdir(path.dirname(file), { recursive: true });
        await fs.writeFile(file, renderDocument(base, renderGuidePage(guidePage, templates), pageMeta({ guidePage })));
      }
      for (const category of Object.keys(CATEGORY_CONTENT)) {
        const file = path.join('dist', categoryPath(category), 'index.html');
        await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, renderDocument(base, renderPage({ category }), pageMeta({ category, catalog: templates })));
      }
      for (const template of templates) {
        const file = `dist/pozivnice/${template.slug || template.id}/index.html`;
        await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, renderDocument(base, renderTemplatePage(template, templates), pageMeta({ template, catalog: templates })));
      }
      await fs.writeFile('dist/sitemap.xml', sitemap(templates));
      await fs.writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: ${SITE_URL}/sitemap.xml\n`);
      await fs.writeFile('dist/_routes.json', JSON.stringify({ version: 1, include: ['/*'], exclude: ['/assets/*', '/favicon.svg', '/social-preview.png'] }));
    },
  }],
  build: { rollupOptions: { input: { main: 'index.html', admin: 'admin/sabloni/index.html' } } },
});
