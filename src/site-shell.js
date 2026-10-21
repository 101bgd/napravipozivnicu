import { brand, icon } from './ui.js';
import { categories } from './templates.js';
import { categoryPath } from './seo-content.js';
import { INFO_PAGES } from './info-content.js';
import { AD_PLACEMENT } from './adsense-config.js';

export function siteHeader(active = '', createHref = '/pozivnice/') {
  return `<a class="skip-link" href="#main-content">Preskoči na sadržaj</a><header class="site-header"><div class="container header-inner"><a href="/" class="brand" aria-label="Napravi pozivnicu, početna">${brand}</a><nav class="navigation" id="navigation" aria-label="Glavna navigacija"><a href="/pozivnice/" ${active === 'catalog' ? 'aria-current="page"' : ''}>Pozivnice</a><a href="/vodici/" ${active === 'guides' ? 'aria-current="page"' : ''}>Vodiči</a><a href="/#how">Kako radi</a><a href="/#faq">Pitanja</a></nav><a class="header-cta" href="${createHref}">Napravi pozivnicu ${icon('arrow')}</a><button class="menu-toggle icon-button" aria-label="Otvori meni" aria-expanded="false" aria-controls="navigation">${icon('menu')}</button></div></header>`;
}
export function siteFooter(activeInfo = '', createHref = '/pozivnice/') {
  return `${AD_PLACEMENT}<footer><div class="container footer-main"><a class="brand" href="/">${brand}</a><p>Za trenutke koje jedva čekaš.</p><a href="${createHref}">Napravi pozivnicu ${icon('arrow')}</a></div><nav class="category-links container" aria-label="Pozivnice po povodu">${categories.filter(c=>c.id!=='all').map(c=>`<a href="${categoryPath(c.id)}">${c.label}</a>`).join('')}</nav><nav class="footer-info-links container" aria-label="Informacije o sajtu"><a href="/vodici/" ${activeInfo==='guides'?'aria-current="page"':''}>Vodiči za pozivnice</a>${INFO_PAGES.map(page=>`<a href="${page.path}" ${activeInfo===page.id?'aria-current="page"':''}>${page.title}</a>`).join('')}</nav><div class="container footer-bottom"><span>© ${new Date().getFullYear()} Napravi pozivnicu</span><span>Osmišljeno za tvoje najlepše trenutke.</span></div></footer>`;
}
