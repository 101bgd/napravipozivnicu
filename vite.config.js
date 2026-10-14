import { defineConfig } from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import { renderPage } from './src/page.js';
import { templates } from './src/templates.js';
import { CATEGORY_CONTENT, SITE_URL, categoryPath, categoryFromPath } from './src/seo-content.js';
import { pageMeta, renderHead, renderDocument, renderTemplatePage, sitemap } from './src/seo.js';
export default defineConfig({
  plugins: [{
    name: 'static-page-content',
    transformIndexHtml: { order: 'pre', handler(html, context) {
      if (!html.includes('<!--app-content-->')) return html;
      const category = categoryFromPath(context.path) || 'all';
      return html.replace('<!--app-content-->', renderPage({ category })).replace('<!--seo-content-->', renderHead(pageMeta({ category, catalog: templates })));
    } },
    async closeBundle() {
      if (process.env.VITE_DEV_SERVER) return;
      let base; try { base = await fs.readFile('dist/index.html', 'utf8'); } catch { return; }
      for (const category of Object.keys(CATEGORY_CONTENT)) {
        const file = path.join('dist', categoryPath(category), 'index.html');
        await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, renderDocument(base, renderPage({ category }), pageMeta({ category, catalog: templates })));
      }
      for (const template of templates) {
        const file = `dist/pozivnice/${template.id}/index.html`;
        await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, renderDocument(base, renderTemplatePage(template, templates), pageMeta({ template, catalog: templates })));
      }
      await fs.writeFile('dist/sitemap.xml', sitemap(templates));
      await fs.writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: ${SITE_URL}/sitemap.xml\n`);
      await fs.writeFile('dist/_routes.json', JSON.stringify({ version: 1, include: ['/*'], exclude: ['/assets/*', '/favicon.svg', '/social-preview.png'] }));
    },
  }],
  build: { rollupOptions: { input: { main: 'index.html', admin: 'admin/sabloni/index.html' } } },
});
