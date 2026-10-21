import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-ext-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-ext-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-ext-600.css';
import '@fontsource/libre-caslon-display/latin-400.css';
import '@fontsource/libre-caslon-display/latin-ext-400.css';
import './editor.css';
import { templates } from './catalog-state.js';
import { defaultData } from './templates.js';
import { renderInvitation, invitationTextWarnings, WIDTH } from './render.js';
import { renderDesign, prepareDesign, photoFrame, designTextWarnings } from './design-renderer.js';
import { BUILTIN_FONTS, DATE_LOCALES, normalizeDesign } from './template-schema.js';
import { createEditorState } from './editor-state.js';
import { recordUsage } from './usage.js';
import { renderEditor } from './editor-view.js';
import { toast, escapeHtml as esc } from './ui.js';
document.body.insertAdjacentHTML('beforeend',renderEditor());
const dialog=document.querySelector('#editor'),preview=document.querySelector('#editor-canvas'),controls=document.querySelector('.editor-controls');
const textPanel=controls.querySelector('#panel-text'),stylePanel=controls.querySelector('#panel-style'),legacyText=textPanel.innerHTML,legacyStyle=stylePanel.innerHTML;
const styleProperties=['family','size','color','bold','italic','underline','align','effect','effectColor','effectSize','letterSpacing','lineHeight'];
let selected=null,data=null,photo=null,focusReturn=null,assets={},styleLayer=null,drawFrame=0,opening=0;
const loadedTemplates=new Map();
const undoButton=dialog.querySelector('.undo-edit'),redoButton=dialog.querySelector('.redo-edit'),autosave=dialog.querySelector('#autosave-draft');
const state=createEditorState({read:key=>localStorage.getItem(key),write:(key,value)=>localStorage.setItem(key,value),remove:key=>localStorage.removeItem(key),status:message=>{dialog.querySelector('#draft-status').textContent=message;},historyChanged:(undo,redo)=>{undoButton.disabled=!undo;redoButton.disabled=!redo;}});
function changed(group=''){state.change(data,group);draw();}
function restore(forward){const values=state.restore(forward);if(!values)return;data=values;syncFields();if(isCustom())customStyles();draw();}
undoButton.addEventListener('click',()=>restore(false));redoButton.addEventListener('click',()=>restore(true));
autosave.addEventListener('change',()=>state.automatic(autosave.checked));
dialog.querySelector('.clear-draft').addEventListener('click',()=>{if(state.clear())autosave.checked=false;});
window.addEventListener('pagehide',()=>state.save());
document.addEventListener('visibilitychange',()=>{if(document.hidden)state.save();});
function syncKeyboardViewport(){
  const viewport=window.visualViewport;if(!viewport||!dialog.open||viewport.scale!==1)return;
  const editing=dialog.contains(document.activeElement)&&document.activeElement.matches('input:not([type=checkbox]):not([type=range]):not([type=color]),textarea');
  const keyboard=editing&&viewport.height<window.innerHeight*.78;
  dialog.style.setProperty('--editor-viewport-height',`${Math.round(viewport.height)}px`);
  dialog.classList.toggle('editor-keyboard',keyboard);
  if(keyboard)requestAnimationFrame(()=>document.activeElement?.scrollIntoView({block:'nearest',behavior:'instant'}));
}
window.visualViewport?.addEventListener('resize',syncKeyboardViewport);
dialog.querySelector('.preview-toggle').addEventListener('click',event=>{
  const expanded=dialog.classList.toggle('preview-expanded');event.currentTarget.setAttribute('aria-expanded',String(expanded));event.currentTarget.textContent=expanded?'Smanji pregled':'Uvećaj pregled';
  dialog.querySelector('.editor-body').scrollTo({top:0,behavior:'instant'});draw();
});
dialog.querySelector('.jump-export').addEventListener('click',()=>{const area=dialog.querySelector('.export-area');area.scrollIntoView({block:'end',behavior:'instant'});dialog.querySelector('.export-png').focus({preventScroll:true});});
function checkText(){
  const fields=isCustom()?designTextWarnings(effectiveDesign(),data,selected,preview):invitationTextWarnings(preview,data,Boolean(photo));
  const labels=[];textPanel.querySelectorAll('[name]').forEach(input=>{const warning=fields.includes(input.name);input.closest('label').classList.toggle('field-warning',warning);if(warning){input.setAttribute('aria-describedby','text-warning');labels.push(input.closest('label').firstChild.textContent.trim());}else input.removeAttribute('aria-describedby');});
  const note=dialog.querySelector('#text-warning');note.hidden=!fields.length;note.textContent=fields.length?`Proveri tekst: ${labels.join(', ')}. Može da pređe predviđeni prostor ili da preklopi druge elemente. Skrati tekst ili smanji font u kartici Napredno, pa uvećaj pregled.`:'';
}
function isCustom(){return selected?.style==='custom';}
function effectiveDesign(template=selected,values=data){return {...template,layers:template.layers.map(l=>({...l,...Object.fromEntries(styleProperties.filter(p=>values.layerStyles?.[l.id]?.[p]!==undefined).map(p=>[p,values.layerStyles[l.id][p]]))}))};}
function paint(canvas,template,values,image,width,prepared){return template.style==='custom'?renderDesign(canvas,effectiveDesign(template,values),values,image,width,prepared):renderInvitation(canvas,template,values,image,width);}
function syncFields(){controls.querySelectorAll('[name]').forEach(input=>{input.value=data[input.name]??'';});}
function draw(){cancelAnimationFrame(drawFrame);drawFrame=requestAnimationFrame(()=>{if(dialog.open){paint(preview,selected,data,photo,1200,assets);checkText();}});}
function customStyles(){
  const layers=selected.layers.filter(l=>l.type==='text'&&l.editable),l=effectiveDesign().layers.find(l=>l.id===styleLayer)||layers[0];
  if(!l){stylePanel.innerHTML='<p>Ovaj dizajn koristi fiksni tekst.</p>';return;}styleLayer=l.id;
  stylePanel.innerHTML=`<div class="custom-style-controls"><label>Pismo datuma<select name="locale">${DATE_LOCALES.map(locale=>`<option value="${locale.id}" ${data.locale===locale.id?'selected':''}>${locale.name}</option>`).join('')}</select></label><label>Tekst koji uređuješ<select id="style-layer">${layers.map(layer=>`<option value="${layer.id}" ${layer.id===styleLayer?'selected':''}>${esc(layer.label)}</option>`).join('')}</select></label><label>Font<select data-style="family">${[...BUILTIN_FONTS,...(selected.fonts||[])].map(f=>`<option value="${f.family}" ${f.family===l.family?'selected':''}>${esc(f.name)}</option>`).join('')}</select></label><div class="field-row"><label>Veličina<input type="number" data-style="size" min="8" max="120" value="${l.size}"></label><label>Boja<input type="color" data-style="color" value="${l.color}"></label></div><label>Poravnanje<select data-style="align">${[['left','Levo'],['center','Centar'],['right','Desno']].map(([v,n])=>`<option value="${v}" ${l.align===v?'selected':''}>${n}</option>`).join('')}</select></label><div class="field-row">${[['bold','Podebljano'],['italic','Kurziv'],['underline','Podvučeno']].map(([p,n])=>`<label>${n}<input type="checkbox" data-style="${p}" ${l[p]?'checked':''}></label>`).join('')}</div><label>Efekat<select data-style="effect">${[['none','Bez efekta'],['shadow','Senka'],['outline','Kontura'],['glow','Sjaj'],['lift','Izdignuto'],['gradient','Gradijent']].map(([v,n])=>`<option value="${v}" ${l.effect===v?'selected':''}>${n}</option>`).join('')}</select></label><div class="field-row"><label>Boja efekta<input type="color" data-style="effectColor" value="${l.effectColor}"></label><label>Jačina<input type="number" data-style="effectSize" min="0" max="20" step=".5" value="${l.effectSize}"></label></div><div class="field-row"><label>Razmak slova<input type="number" data-style="letterSpacing" min="-2" max="12" step=".2" value="${l.letterSpacing}"></label><label>Razmak redova<input type="number" data-style="lineHeight" min=".8" max="2.5" step=".05" value="${l.lineHeight}"></label></div><button class="button secondary reset-design">Vrati originalni dizajn</button></div>`;
}
const fieldPriority=field=>/^(names?|bride|groom|child)/i.test(field)?0:field==='date'?1:field==='time'?2:/location|venue|address|church|restaurant/i.test(field)?3:4;
export async function openEditor(id,button){
  state.save();const request=++opening;recordUsage(id,'template_select');let template=loadedTemplates.get(id)||templates.find(t=>t.id===id);if(!template)throw Error('Šablon nije dostupan.');
  if(template.style==='custom'&&!template.layers){const response=await fetch(`/api/templates/${id}`,{cache:'no-cache'});if(!response.ok)throw Error('Šablon više nije dostupan. Osveži stranicu.');template=await response.json();loadedTemplates.set(id,template);if(loadedTemplates.size>24)loadedTemplates.delete(loadedTemplates.keys().next().value);}
  const prepared=template.style==='custom'?await prepareDesign(template):{};await document.fonts.ready;if(request!==opening)return;
  selected=template;assets=prepared;data=defaultData(selected);photo=null;focusReturn=button;
  if(isCustom())data.layerStyles={};
  try{const draft=JSON.parse(localStorage.getItem(`invitation-${id}`));if(draft&&typeof draft==='object'){
    for(const key of Object.keys(data)){if(key==='layerStyles')continue;if(typeof draft[key]===typeof data[key]){if(key==='locale'&&!DATE_LOCALES.some(locale=>locale.id===draft[key]))continue;if(key==='bg'&&!/^#[0-9a-f]{6}$/i.test(draft[key]))continue;if(key.startsWith('photo')&&!Number.isFinite(draft[key]))continue;if(typeof draft[key]==='string'&&draft[key].length>1500)continue;data[key]=draft[key];}}
    data.photoZoom=Math.max(100,Math.min(300,data.photoZoom));data.photoX=Math.max(0,Math.min(100,data.photoX));data.photoY=Math.max(0,Math.min(100,data.photoY));
    if(isCustom()&&draft.layerStyles&&typeof draft.layerStyles==='object'){data.layerStyles=draft.layerStyles;const normalized=normalizeDesign(effectiveDesign());data.layerStyles=Object.fromEntries(normalized.layers.filter(l=>l.type==='text').map(l=>[l.id,Object.fromEntries(styleProperties.map(p=>[p,l[p]]))]));}
    toast('Sačuvani tekst je vraćen sa ovog uređaja.');
  }}catch{if(isCustom())data.layerStyles={};}
  if(isCustom()){
    const fields=[...new Map(selected.layers.filter(l=>l.type==='text'&&l.editable).map(l=>[l.field,l])).values()].sort((a,b)=>fieldPriority(a.field)-fieldPriority(b.field));
    textPanel.innerHTML=fields.map(l=>`<label>${esc(l.label)}${(l.field==='note'||l.text.includes('\n'))?`<textarea name="${l.field}" rows="3" maxlength="1500"></textarea>`:`<input name="${l.field}" maxlength="1500" ${['date','time'].includes(l.field)?`type="${l.field}"`:''}>`}</label>`).join('')||'<p>Ovaj šablon ima fiksni tekst.</p>';
    styleLayer=selected.layers.find(l=>l.type==='text'&&l.editable)?.id;customStyles();
  }else{textPanel.innerHTML=legacyText;stylePanel.innerHTML=legacyStyle;}
  const hasFrame=!isCustom()||Boolean(photoFrame(selected));document.querySelector('#tab-photo').hidden=!hasFrame;
  syncFields();document.querySelector('#photo-upload').value='';document.querySelector('#photo-options').hidden=true;preview.classList.remove('has-photo');document.querySelector('#preview-tip').textContent='Svaka izmena odmah se vidi na pozivnici.';
  autosave.checked=state.start(selected.id,data);dialog.classList.remove('preview-expanded','editor-keyboard');dialog.querySelector('.preview-toggle').setAttribute('aria-expanded','false');dialog.querySelector('.preview-toggle').textContent='Uvećaj pregled';document.querySelector('#selected-design').textContent=selected.name;switchPanel('text');dialog.append(document.querySelector('#toast'));dialog.showModal();document.body.classList.add('modal-open');dialog.querySelector('.editor-body').scrollTop=0;syncKeyboardViewport();draw();recordUsage(id,'editor_open');
}
function closeEditor(){state.finish();opening++;dialog.close();}
document.querySelector('.close-editor').addEventListener('click',closeEditor);
dialog.addEventListener('cancel',()=>state.finish());
dialog.addEventListener('close',()=>{state.finish();opening++;cancelAnimationFrame(drawFrame);document.body.classList.remove('modal-open');document.body.append(document.querySelector('#toast'));photo=null;focusReturn?.focus();});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeEditor();}});
function switchPanel(name){controls.querySelectorAll('[role="tab"]').forEach(b=>{const active=b.dataset.panel===name;b.setAttribute('aria-selected',active);b.tabIndex=active?0:-1;});controls.querySelectorAll('.editor-panel').forEach(p=>p.hidden=p.id!==`panel-${name}`);}
controls.querySelector('.editor-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-panel]');if(b)switchPanel(b.dataset.panel);});
controls.querySelector('.editor-tabs').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=[...controls.querySelectorAll('[role="tab"]')].filter(b=>!b.hidden),current=tabs.indexOf(document.activeElement),next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(current+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;switchPanel(tabs[next].dataset.panel);tabs[next].focus();});
controls.addEventListener('input',e=>{
  const input=e.target;if(input.id==='style-layer'){styleLayer=input.value;customStyles();return;}
  if(input.dataset.style){const p=input.dataset.style;if(!styleProperties.includes(p))return;data.layerStyles[styleLayer]??={};data.layerStyles[styleLayer][p]=input.type==='checkbox'?input.checked:input.type==='number'?Math.max(Number(input.min),Math.min(Number(input.max),Number(input.value))):input.value;changed(`style:${styleLayer}:${p}`);return;}
  if(!input.name)return;data[input.name]=input.type==='range'?Number(input.value):input.value;changed(input.name);
});
controls.addEventListener('click',e=>{
  const color=e.target.closest('.color-swatch');if(color){data.bg=color.dataset.color;syncFields();changed();}
  if(e.target.closest('.reset-design')){data.bg=selected.bg;if(isCustom()){data.locale=selected.locale||'sr-Latn-RS';data.layerStyles={};customStyles();}else data.font='serif';syncFields();changed();}
});
document.querySelector('#photo-upload').addEventListener('change',async e=>{
  const file=e.target.files[0];if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>15*1024*1024){toast('Izaberi JPG, PNG ili WebP fotografiju do 15 MB.');e.target.value='';return;}
  const uploadTemplate=selected,uploadRequest=opening,url=URL.createObjectURL(file),image=new Image();
  try{image.src=url;await image.decode();if(!dialog.open||selected!==uploadTemplate||uploadRequest!==opening)return;photo=image;data.photoX=50;data.photoY=50;data.photoZoom=100;syncFields();document.querySelector('#photo-options').hidden=false;preview.classList.add('has-photo');document.querySelector('#preview-tip').textContent='Prevuci fotografiju u okviru da namestiš položaj.';changed();toast('Fotografija je dodata. Namesti je po svojoj želji.');}catch{toast('Fotografija nije mogla da se učita. Pokušaj drugu datoteku.');}finally{URL.revokeObjectURL(url);}
});
document.querySelector('.remove-photo').addEventListener('click',()=>{photo=null;document.querySelector('#photo-upload').value='';document.querySelector('#photo-options').hidden=true;preview.classList.remove('has-photo');document.querySelector('#preview-tip').textContent='Svaka izmena odmah se vidi na pozivnici.';draw();});
let photoDrag=null;
preview.addEventListener('pointerdown',e=>{
  if(!photo)return;const r=preview.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*500,y=(e.clientY-r.top)/r.height*700,frame=isCustom()?photoFrame(selected):{x:250,y:285,width:172,height:172,layer:{shape:'circle',rotation:0}};
  if(!frame)return;const angle=-frame.layer.rotation*Math.PI/180,dx=x-frame.x,dy=y-frame.y,lx=dx*Math.cos(angle)-dy*Math.sin(angle),ly=dx*Math.sin(angle)+dy*Math.cos(angle);
  if(frame.layer.shape==='circle'?Math.hypot(lx,ly)>frame.width/2:Math.abs(lx)>frame.width/2||Math.abs(ly)>frame.height/2)return;
  photoDrag={x:e.clientX,y:e.clientY,px:data.photoX,py:data.photoY,frame};preview.setPointerCapture(e.pointerId);e.preventDefault();
});
preview.addEventListener('pointermove',e=>{
  if(!photoDrag)return;const r=preview.getBoundingClientRect(),f=photoDrag.frame,scale=Math.max(f.width/photo.width,f.height/photo.height)*data.photoZoom/100,ox=photo.width*scale-f.width,oy=photo.height*scale-f.height,a=-f.layer.rotation*Math.PI/180,dx=(e.clientX-photoDrag.x)*500/r.width,dy=(e.clientY-photoDrag.y)*700/r.height;
  data.photoX=ox>0?Math.max(0,Math.min(100,photoDrag.px-(dx*Math.cos(a)-dy*Math.sin(a))/ox*100)):50;data.photoY=oy>0?Math.max(0,Math.min(100,photoDrag.py-(dx*Math.sin(a)+dy*Math.cos(a))/oy*100)):50;syncFields();draw();
});
function endDrag(){if(photoDrag){photoDrag=null;changed();}}preview.addEventListener('pointerup',endDrag);preview.addEventListener('pointercancel',endDrag);
document.querySelector('.save-draft').addEventListener('click',()=>state.save(true));
let exporting=false;
async function exportFile(type){
  if(exporting)return;exporting=true;
  const template=selected,values=structuredClone(data),image=photo,prepared=assets,buttons=[...document.querySelectorAll('.export-png,.export-pdf')];buttons.forEach(b=>b.disabled=true);
  try{await new Promise(requestAnimationFrame);const canvas=paint(document.createElement('canvas'),template,values,image,WIDTH,prepared),name=`pozivnica-${template.slug||template.id}`;
    let blob;if(type==='png'){blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('PNG');}
    else{const {jsPDF}=await import('jspdf');const pdf=new jsPDF({orientation:'portrait',unit:'mm',format:[127,177.8],compress:true});pdf.setProperties({title:`Pozivnica — ${values.names||template.name}`,creator:'Napravi pozivnicu'});pdf.addImage(canvas.toDataURL('image/png'),'PNG',0,0,127,177.8);blob=pdf.output('blob');}
    if(!blob?.size)throw Error('Empty export');const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${name}.${type}`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);recordUsage(template.id,`download_${type}`);
    toast(type==='png'?'Slika je spremna! Preuzimanje je pokrenuto.':'PDF je spreman! Štampaj u stvarnoj veličini (100%).');
  }catch(error){recordUsage(template.id,'export_error');console.error('Izvoz pozivnice nije uspeo',error);toast('Preuzimanje nije uspelo. Pokušaj ponovo.');}finally{exporting=false;buttons.forEach(b=>b.disabled=false);}
}
document.querySelector('.export-png').addEventListener('click',()=>exportFile('png'));
document.querySelector('.export-pdf').addEventListener('click',()=>exportFile('pdf'));
