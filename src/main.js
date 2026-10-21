import './fonts.css';
import './style.css';
import './category.css';
import './latest.css';
import './guides.css';
import { categories } from './templates.js';
import { templates, initialCategory } from './catalog-state.js';
import { renderCards } from './catalog-view.js';
import { toast } from './ui.js';

if (document.querySelector('#adsense-config')) void import('./adsense.js').then(module => module.initializeAds());

let activeCategory=initialCategory, search='';
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const searchable=value=>value.toLocaleLowerCase('sr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replaceAll('đ','dj');
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
  if(!reducedMotion.matches)grid.animate([{opacity:.35,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,easing:'cubic-bezier(.22,1,.36,1)'});
}
document.querySelector('#search')?.addEventListener('input',e=>{search=searchable(e.target.value.trim());renderGrid();});
document.querySelector('#template-grid')?.addEventListener('click',e=>{
  const button=e.target.closest('[data-template]');
  if(button)openEditor(button.dataset.template,button);
  if(e.target.closest('#clear-search')){
    const input=document.querySelector('#search');
    if(!input){location.href='/pozivnice/';return;}
    activeCategory=initialCategory;search='';input.value='';renderGrid();input.focus();
  }
});
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
if(heroCta&&mobileBar){
  let pastHero=false,designsVisible=false;
  const syncBar=()=>{const show=pastHero&&!designsVisible;document.body.classList.toggle('show-mobile-cta',show);mobileBar.inert=!show;mobileBar.setAttribute('aria-hidden',String(!show));};
  new IntersectionObserver(([entry])=>{pastHero=!entry.isIntersecting&&entry.boundingClientRect.bottom<0;syncBar();}).observe(heroCta);
  const designs=document.querySelector('.collection-catalog');
  if(designs)new IntersectionObserver(([entry])=>{designsVisible=entry.isIntersecting;syncBar();}).observe(designs);
}
const heroArt=document.querySelector('.hero-art,.collection-stage');
if(heroArt){
  let pointerFrame=0;
  heroArt.addEventListener('pointermove',e=>{if(reducedMotion.matches||e.pointerType!=='mouse')return;cancelAnimationFrame(pointerFrame);pointerFrame=requestAnimationFrame(()=>{const rect=heroArt.getBoundingClientRect();heroArt.style.setProperty('--pointer-x',`${((e.clientX-rect.left)/rect.width-.5)*12}px`);heroArt.style.setProperty('--pointer-y',`${((e.clientY-rect.top)/rect.height-.5)*12}px`);});});
  heroArt.addEventListener('pointerleave',()=>{cancelAnimationFrame(pointerFrame);heroArt.style.setProperty('--pointer-x','0px');heroArt.style.setProperty('--pointer-y','0px');});
  new IntersectionObserver(([entry])=>heroArt.classList.toggle('is-paused',!entry.isIntersecting)).observe(heroArt);
}

document.querySelector('button.catalog-change')?.addEventListener('click',()=>{document.querySelector('.category-tab.active')?.focus({preventScroll:true});document.querySelector('.occasion-picker')?.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'start'});});

// Category interactions add no framework, scroll loop, or animation dependency.
const collection=document.querySelector('.category-landing');
if(collection){
  const scenes=new IntersectionObserver(entries=>{for(const entry of entries)entry.target.classList.toggle('is-scene-paused',!entry.isIntersecting);});
  collection.querySelectorAll('[data-motion-scene]').forEach(scene=>scenes.observe(scene));
  document.addEventListener('visibilitychange',()=>document.documentElement.classList.toggle('page-motion-paused',document.hidden));
  const toggle=collection.querySelector('[data-motion-toggle]');
  toggle.hidden=false;
  toggle.addEventListener('click',()=>{
    const paused=collection.classList.toggle('is-motion-paused');
    toggle.setAttribute('aria-pressed',String(paused));
    toggle.textContent=paused?'Pokreni animacije':'Pauziraj animacije';
  });
}

// Examples remain readable without JS; copying is available on secure pages.
document.querySelectorAll('[data-copy-text]').forEach(button=>{
    if(!navigator.clipboard)return;
    button.hidden=false;
    button.addEventListener('click',async()=>{
      try{await navigator.clipboard.writeText(document.getElementById(button.dataset.copyText).textContent);toast('Tekst je kopiran. Dodaj svoje podatke i prilagodi ga.');}
      catch{toast('Označi tekst primera i kopiraj ga kroz meni pregledača.');}
    });
});
