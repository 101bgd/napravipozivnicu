import { brand, icon } from './ui.js';
import { categories } from './templates.js';
import { categoryPath } from './seo-content.js';

export function siteHeader(active = '') {
  return `<a class="skip-link" href="#main-content">Preskoči na sadržaj</a><header class="site-header"><div class="container header-inner"><a href="/" class="brand" aria-label="Napravi pozivnicu, početna">${brand}</a><nav class="navigation" id="navigation" aria-label="Glavna navigacija"><a href="/pozivnice/" ${active === 'catalog' ? 'aria-current="page"' : ''}>Pozivnice</a><a href="/#how">Kako radi</a><a href="/#faq">Pitanja</a></nav><a class="header-cta" href="/pozivnice/">Napravi pozivnicu ${icon('arrow')}</a><button class="menu-toggle icon-button" aria-label="Otvori meni" aria-expanded="false" aria-controls="navigation">${icon('menu')}</button></div></header>`;
}
export function siteFooter() {
  return `<footer><div class="container footer-main"><a class="brand" href="/">${brand}</a><p>Za trenutke koje jedva čekaš.</p><a href="/pozivnice/">Napravi pozivnicu ${icon('arrow')}</a></div><nav class="category-links container" aria-label="Pozivnice po povodu">${categories.filter(c=>c.id!=='all').map(c=>`<a href="${categoryPath(c.id)}">${c.label}</a>`).join('')}</nav><div class="container footer-bottom"><span>© ${new Date().getFullYear()} Napravi pozivnicu</span><span>Osmišljeno za tvoje najlepše trenutke.</span></div></footer>`;
}
