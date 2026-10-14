import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-ext-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-ext-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-ext-600.css';
import '@fontsource/libre-caslon-display/latin-400.css';
import '@fontsource/libre-caslon-display/latin-ext-400.css';
import './style.css';
import { categories, templates as builtins, defaultData } from './templates.js';
import { templates, initialCategory } from './catalog-state.js';
import { renderInvitation } from './render.js';
import { renderCards } from './catalog-view.js';
import { toast } from './ui.js';

let activeCategory=initialCategory, search='';
const thumbnailCache=new Map();
const templateById=new Map(templates.map(t=>[t.id,t]));
const thumbnailObserver=new IntersectionObserver(entries=>{
  for(const {target,isIntersecting} of entries) {
    if(!isIntersecting)continue;
    const template=templateById.get(target.dataset.canvas);
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
  const shown=templates.filter(t=>(activeCategory==='all'||t.category===activeCategory)&&`${t.name} ${categories.find(c=>c.id===t.category).label}`.toLocaleLowerCase('sr').includes(search));
  if(document.querySelector('#result-count'))document.querySelector('#result-count').textContent=`Prikazano ${shown.length} pozivnica`;
  const grid=document.querySelector('#template-grid');
  grid.innerHTML=renderCards(shown);
  observeThumbnails();
}
if(document.querySelector('#hero-wedding'))renderInvitation(document.querySelector('#hero-wedding'),builtins[0],defaultData(builtins[0]),null,700);
if(document.querySelector('#hero-birthday'))renderInvitation(document.querySelector('#hero-birthday'),builtins[1],defaultData(builtins[1]),null,650);
observeThumbnails();
document.querySelector('.category-tabs')?.addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;activeCategory=b.dataset.category;document.querySelectorAll('.category-tab').forEach(el=>{el.classList.toggle('active',el===b);el.setAttribute('aria-pressed',el===b);});renderGrid();});
document.querySelector('#search')?.addEventListener('input',e=>{search=e.target.value.trim().toLocaleLowerCase('sr');renderGrid();});
document.querySelector('#template-grid')?.addEventListener('click',e=>{const b=e.target.closest('[data-template]');if(b)openEditor(b.dataset.template,b);if(e.target.closest('#clear-search')){activeCategory='all';search='';if(document.querySelector('#search'))document.querySelector('#search').value='';document.querySelectorAll('.category-tab').forEach(b=>{b.classList.toggle('active',b.dataset.category==='all');b.setAttribute('aria-pressed',b.dataset.category==='all');});renderGrid();}});
const menuButton=document.querySelector('.menu-toggle');menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',open);document.querySelector('.navigation').classList.toggle('open',open);});
document.querySelectorAll('.navigation a').forEach(a=>a.addEventListener('click',()=>{menuButton?.setAttribute('aria-expanded','false');document.querySelector('.navigation').classList.remove('open');}));

document.addEventListener('click',e=>{const b=e.target.closest('[data-open-template],.detail-preview [data-template]');if(b)openEditor(b.dataset.openTemplate||b.dataset.template,b);});
