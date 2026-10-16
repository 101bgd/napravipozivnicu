import './fonts.css';
import './style.css';
import { categories, defaultData } from './templates.js';
import { templates, initialCategory } from './catalog-state.js';
import { renderInvitation } from './render.js';
import { renderCards } from './catalog-view.js';
import { toast } from './ui.js';

if (document.querySelector('#adsense-config')) void import('./adsense.js').then(module => module.initializeAds());

let activeCategory=initialCategory, search='';
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const searchable=value=>value.toLocaleLowerCase('sr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replaceAll('đ','dj');
const thumbnailCache=new Map();
const templateById=new Map(templates.map(t=>[t.id,t]));
const thumbnailObserver=new IntersectionObserver(entries=>{
  for(const {target,isIntersecting} of entries) {
    if(!isIntersecting)continue;
    const template=templateById.get(target.dataset.canvas);
    if(!template)continue;
    renderInvitation(target,template,defaultData(template),null,500);
    target.dataset.rendered='true';
    thumbnailCache.set(template.id,target);
    // Bound memory if the catalog grows; visible canvases remain in the DOM.
    if(thumbnailCache.size>24)thumbnailCache.delete(thumbnailCache.keys().next().value);
    thumbnailObserver.unobserve(target);
  }
},{rootMargin:'200px 0px'});
function observeThumbnails() {
  thumbnailObserver.disconnect();
  document.querySelectorAll('[data-canvas]').forEach(canvas=>{
    const cached=thumbnailCache.get(canvas.dataset.canvas);
    if(cached&&cached!==canvas)canvas.replaceWith(cached);
    else if(!cached)thumbnailObserver.observe(canvas);
  });
}
let editorModule;
let openRequest=0;
async function openEditor(id,button) {
  const request=++openRequest;
  button.setAttribute('aria-busy','true');
  try {
    editorModule??=import('./editor.js').catch(error=>{editorModule=null;throw error;});
    const editor=await editorModule;
    if(request===openRequest)await editor.openEditor(id,button);
  }catch(error){console.error('Editor could not load',error);toast('Editor nije mogao da se učita. Pokušaj ponovo.');}
  finally{button.removeAttribute('aria-busy');}
}

function renderGrid(){
  const shown=templates.filter(t=>(activeCategory==='all'||t.category===activeCategory)&&searchable(`${t.name} ${t.description||''} ${categories.find(c=>c.id===t.category)?.label||''}`).includes(search));
  if(document.querySelector('#result-count'))document.querySelector('#result-count').textContent=`Prikazano ${shown.length} pozivnica`;
  const grid=document.querySelector('#template-grid');
  if(!grid)return;
  grid.innerHTML=renderCards(shown);
  observeThumbnails();
  if(!reducedMotion.matches)grid.animate([{opacity:.35,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,easing:'cubic-bezier(.22,1,.36,1)'});
}
observeThumbnails();
document.querySelector('.category-tabs')?.addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;if(initialCategory!=='all'&&b.dataset.category!==initialCategory){location.href=b.dataset.categoryUrl;return;}activeCategory=b.dataset.category;document.querySelectorAll('.category-tab').forEach(el=>{el.classList.toggle('active',el===b);el.setAttribute('aria-pressed',el===b);});renderGrid();document.querySelector('#designs-title')?.focus({preventScroll:true});document.querySelector('#designs')?.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'start'});});
document.querySelector('#search')?.addEventListener('input',e=>{search=searchable(e.target.value.trim());renderGrid();});
document.querySelector('#template-grid')?.addEventListener('click',e=>{const b=e.target.closest('[data-template]');if(b)openEditor(b.dataset.template,b);if(e.target.closest('#clear-search')){if(!document.querySelector('#search')||initialCategory!=='all'){location.href='/pozivnice/';return;}activeCategory='all';search='';if(document.querySelector('#search'))document.querySelector('#search').value='';document.querySelectorAll('.category-tab').forEach(b=>{b.classList.toggle('active',b.dataset.category==='all');b.setAttribute('aria-pressed',b.dataset.category==='all');});renderGrid();document.querySelector('#search')?.focus();}});
const menuButton=document.querySelector('.menu-toggle'),navigation=document.querySelector('.navigation');
function toggleMenu(open){menuButton?.setAttribute('aria-expanded',String(open));menuButton?.setAttribute('aria-label',open?'Zatvori meni':'Otvori meni');navigation?.classList.toggle('open',open);}
menuButton?.addEventListener('click',()=>toggleMenu(menuButton.getAttribute('aria-expanded')!=='true'));
document.querySelectorAll('.navigation a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuButton?.getAttribute('aria-expanded')==='true'){toggleMenu(false);menuButton.focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('.header-inner'))toggleMenu(false);});

document.addEventListener('click',e=>{const b=e.target.closest('[data-open-template],.detail-preview [data-template]');if(b)openEditor(b.dataset.openTemplate||b.dataset.template,b);});

// Native links remain normal navigation; all motion is progressive enhancement.
const revealObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}},{threshold:.08,rootMargin:'0px 0px -20px'});
document.querySelectorAll('[data-reveal]').forEach(el=>revealObserver.observe(el));
document.documentElement.classList.add('motion-ready');
const heroCta=document.querySelector('.hero-cta'),mobileBar=document.querySelector('.mobile-create-bar');
if(heroCta&&mobileBar){new IntersectionObserver(([entry])=>{const show=!entry.isIntersecting&&entry.boundingClientRect.bottom<0;document.body.classList.toggle('show-mobile-cta',show);mobileBar.inert=!show;mobileBar.setAttribute('aria-hidden',String(!show));},{threshold:0}).observe(heroCta);}
const heroArt=document.querySelector('.hero-art');
if(heroArt){
  let pointerFrame=0;
  heroArt.addEventListener('pointermove',e=>{if(reducedMotion.matches||e.pointerType!=='mouse')return;cancelAnimationFrame(pointerFrame);pointerFrame=requestAnimationFrame(()=>{const rect=heroArt.getBoundingClientRect();heroArt.style.setProperty('--pointer-x',`${((e.clientX-rect.left)/rect.width-.5)*12}px`);heroArt.style.setProperty('--pointer-y',`${((e.clientY-rect.top)/rect.height-.5)*12}px`);});});
  heroArt.addEventListener('pointerleave',()=>{cancelAnimationFrame(pointerFrame);heroArt.style.setProperty('--pointer-x','0px');heroArt.style.setProperty('--pointer-y','0px');});
  new IntersectionObserver(([entry])=>heroArt.classList.toggle('is-paused',!entry.isIntersecting)).observe(heroArt);
}

document.querySelector('.catalog-change')?.addEventListener('click',()=>{document.querySelector('.category-tab.active')?.focus({preventScroll:true});document.querySelector('.occasion-picker')?.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'start'});});
