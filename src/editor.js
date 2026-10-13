import { templates, defaultData } from './templates.js';
import { renderInvitation, WIDTH } from './render.js';
import { renderEditor } from './editor-view.js';
import { toast } from './ui.js';

document.body.insertAdjacentHTML('beforeend',renderEditor());
const dialog=document.querySelector('#editor');
const preview=document.querySelector('#editor-canvas');
const controls=document.querySelector('.editor-controls');
let selected=null, data=null, photo=null, focusReturn=null;

function syncFields(){controls.querySelectorAll('[name]').forEach(input=>{input.value=data[input.name];});}
let drawFrame=0;
function draw(){cancelAnimationFrame(drawFrame);drawFrame=requestAnimationFrame(()=>renderInvitation(preview,selected,data,photo,1200));}
export function openEditor(id,button){
  selected=templates.find(t=>t.id===id);data=defaultData(selected);photo=null;focusReturn=button;
  try {const draft=JSON.parse(localStorage.getItem(`invitation-${id}`));if(draft&&typeof draft==='object'){for(const key of Object.keys(data)){if(typeof draft[key]===typeof data[key]){if(key==='bg'&&!/^#[0-9a-f]{6}$/i.test(draft[key]))continue;if(key.startsWith('photo')&&!Number.isFinite(draft[key]))continue;data[key]=draft[key];}}toast('Tvoj sačuvani tekst je vraćen. Fotografiju dodaj ponovo.');}}catch{}
  syncFields();document.querySelector('#photo-upload').value='';document.querySelector('#photo-options').hidden=true;preview.classList.remove('has-photo');document.querySelector('#preview-tip').textContent='Svaka izmena odmah se vidi na pozivnici.';
  document.querySelector('#selected-design').textContent=selected.name;switchPanel('text');draw();dialog.append(document.querySelector('#toast'));dialog.showModal();document.body.classList.add('modal-open');
}
function closeEditor(){dialog.close();}
document.querySelector('.close-editor').addEventListener('click',closeEditor);
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');document.body.append(document.querySelector('#toast'));photo=null;focusReturn?.focus();});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeEditor();}});
function switchPanel(name){controls.querySelectorAll('[role="tab"]').forEach(b=>{const active=b.dataset.panel===name;b.setAttribute('aria-selected',active);b.tabIndex=active?0:-1;});controls.querySelectorAll('.editor-panel').forEach(p=>p.hidden=p.id!==`panel-${name}`);}
controls.querySelector('.editor-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-panel]');if(b)switchPanel(b.dataset.panel);});
controls.querySelector('.editor-tabs').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=[...controls.querySelectorAll('[role="tab"]')];const current=tabs.indexOf(document.activeElement);let next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(current+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;switchPanel(tabs[next].dataset.panel);tabs[next].focus();});
controls.addEventListener('input',e=>{if(!e.target.name)return;data[e.target.name]=e.target.type==='range'?Number(e.target.value):e.target.value;draw();});
document.querySelector('#photo-upload').addEventListener('change',async e=>{
  const file=e.target.files[0];if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>15*1024*1024){toast('Izaberi JPG, PNG ili WebP fotografiju do 15 MB.');e.target.value='';return;}
  const uploadTemplate=selected, url=URL.createObjectURL(file), image=new Image();
  try { image.src=url;await image.decode();if(!dialog.open||selected!==uploadTemplate)return;photo=image;data.photoX=50;data.photoY=50;data.photoZoom=100;syncFields();document.querySelector('#photo-options').hidden=false;preview.classList.add('has-photo');document.querySelector('#preview-tip').textContent='Prevuci fotografiju u krugu da namestiš položaj.';draw();toast('Fotografija je dodata. Namesti je po svojoj želji.'); }catch {toast('Fotografija nije mogla da se učita. Pokušaj drugu datoteku.');}finally {URL.revokeObjectURL(url);}
});
document.querySelector('.remove-photo').addEventListener('click',()=>{photo=null;document.querySelector('#photo-upload').value='';document.querySelector('#photo-options').hidden=true;preview.classList.remove('has-photo');document.querySelector('#preview-tip').textContent='Svaka izmena odmah se vidi na pozivnici.';draw();});
let drag=null;
preview.addEventListener('pointerdown',e=>{if(!photo)return;const r=preview.getBoundingClientRect();const x=(e.clientX-r.left)/r.width*500,y=(e.clientY-r.top)/r.height*700;if(Math.hypot(x-250,y-285)>86)return;drag={x:e.clientX,y:e.clientY,px:data.photoX,py:data.photoY};preview.setPointerCapture(e.pointerId);e.preventDefault();});
preview.addEventListener('pointermove',e=>{if(!drag)return;const r=preview.getBoundingClientRect();const scale=Math.max(172/photo.width,172/photo.height)*data.photoZoom/100;const overflowX=photo.width*scale-172,overflowY=photo.height*scale-172;data.photoX=overflowX>0?Math.max(0,Math.min(100,drag.px-(e.clientX-drag.x)*500/r.width/overflowX*100)):50;data.photoY=overflowY>0?Math.max(0,Math.min(100,drag.py-(e.clientY-drag.y)*700/r.height/overflowY*100)):50;syncFields();draw();});
preview.addEventListener('pointerup',()=>drag=null);preview.addEventListener('pointercancel',()=>drag=null);
document.querySelectorAll('.color-swatch').forEach(b=>b.addEventListener('click',()=>{data.bg=b.dataset.color;syncFields();draw();}));
document.querySelector('.reset-design').addEventListener('click',()=>{data.bg=selected.bg;data.font='serif';syncFields();draw();});
document.querySelector('.save-draft').addEventListener('click',()=>{try{localStorage.setItem(`invitation-${selected.id}`,JSON.stringify(data));toast('Nacrt teksta je sačuvan na ovom uređaju. Fotografija se ne čuva.');}catch{toast('Pregledač ne dozvoljava čuvanje nacrta. I dalje možeš da preuzmeš pozivnicu.');}});
async function exportFile(type){
  const exportTemplate=selected, exportData={...data}, exportPhoto=photo;
  const buttons=[...document.querySelectorAll('.export-png,.export-pdf')];buttons.forEach(b=>b.disabled=true);
  try {
    await new Promise(requestAnimationFrame);
    const canvas=renderInvitation(document.createElement('canvas'),exportTemplate,exportData,exportPhoto,WIDTH);
    const name=`pozivnica-${exportTemplate.id}`;
    if(type==='png') {const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('PNG');const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`${name}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
    else {const { jsPDF }=await import('jspdf');const pdf=new jsPDF({orientation:'portrait',unit:'mm',format:[127,177.8],compress:true});pdf.setProperties({title:`Pozivnica — ${exportData.names}`,creator:'Napravi pozivnicu'});pdf.addImage(canvas.toDataURL('image/png'),'PNG',0,0,127,177.8);pdf.save(`${name}.pdf`);}
    toast(type==='png'?'Slika je spremna! Preuzimanje je pokrenuto.':'PDF je spreman! Štampaj u stvarnoj veličini (100%).');
  }catch(error){console.error('Izvoz pozivnice nije uspeo',error);toast('Preuzimanje nije uspelo. Pokušaj ponovo.');}finally{buttons.forEach(b=>b.disabled=false);}
}
document.querySelector('.export-png').addEventListener('click',()=>exportFile('png'));
document.querySelector('.export-pdf').addEventListener('click',()=>exportFile('pdf'));
