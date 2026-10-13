import { defineConfig } from 'vite';
import { renderPage } from './src/page.js';

export default defineConfig({
  plugins: [{
    name: 'static-page-content',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace('<!--app-content-->',renderPage());
      },
    },
  }],
});
