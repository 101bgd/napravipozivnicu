import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-ext-400.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-ext-600.css';
import '@fontsource/libre-caslon-display/latin-400.css';
import '@fontsource/libre-caslon-display/latin-ext-400.css';
import './admin.css';
import { categories, templates as builtinTemplates, defaultData } from './templates.js';
import { renderInvitation } from './render.js';
import { escapeHtml as esc } from './ui.js';
import { newDesign, newTextLayer, normalizeDesign, BUILTIN_FONTS, DATE_LOCALES, FIELD_LABELS } from './template-schema.js';
import { renderDesign, prepareDesign, designData, designAssetUrl, layerBounds, loadDesignFont } from './design-renderer.js';
import { roseBowDesign } from './admin-presets.js';
import { curatedTemplates } from './curated-catalog.js';
import { DEFAULT_ADSENSE } from './adsense-config.js';
import { renderAdSenseAdmin, bindAdSenseAdmin } from './admin-adsense.js';
const app = document.querySelector('#admin-app');
const categoryName = id => categories.find(c => c.id === id)?.label || id;
const clone = value => structuredClone(value);
let records = [], fontLibrary = [], email = '', record = null, design = null, selectedId = null;
let dirty = false, busy = false, assets = {}, frame = 0, loadRequest = 0, drag = null;
let undoStack = [], redoStack = [], lastSnapshot = '', messageTimer, search = '', statusFilter = 'all', showExamples = true;
let adsenseSettings = { ...DEFAULT_ADSENSE };
async function api(path, method = 'GET', body) {
  const headers = { 'X-Requested-With': 'template-studio' };
  if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json';
  const response = await fetch(`/api/admin${path}`, { method, headers, body: body ? body instanceof FormData ? body : JSON.stringify(body) : undefined, credentials: 'same-origin', cache: 'no-store' });
  if (!response.headers.get('Content-Type')?.includes('application/json')) throw new Error('Prijavi se ponovo kroz admin panel.');
  const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Zahtev nije uspeo.'); return data;
}
function message(text) {
  document.querySelector('.admin-message')?.remove(); const el = document.createElement('div'); el.className = 'admin-message'; el.setAttribute('role', 'status'); el.textContent = text; document.body.append(el);
  clearTimeout(messageTimer); messageTimer = setTimeout(() => el.remove(), 6000);
}
const header = () => `<header class="admin-header"><div><h1>Tvoji šabloni</h1><p>Napravi pozivnicu · ${esc(email)}</p></div><div class="header-actions"><button data-action="adsense">AdSense reklame</button><a href="/" target="_blank" rel="noopener">Otvori sajt ↗</a><a href="/cdn-cgi/access/logout">Odjavi se</a></div></header>`;
const statusLabel = item => item.published ? item.changed ? 'Objavljeno · novi nacrt' : 'Objavljeno' : 'Nacrt';
function renderList() {
  design = null; record = null; dirty = false;
  app.innerHTML = `${header()}<main class="admin-shell"><div class="catalog-toolbar"><input id="admin-search" type="search" placeholder="Pretraži šablone…" aria-label="Pretraži šablone" value="${esc(search)}"><select id="admin-status" aria-label="Status šablona"><option value="all">Svi šabloni</option><option value="draft">Nacrti</option><option value="published">Objavljeni</option></select><button class="primary" data-action="new">+ Novi šablon</button><button data-action="refresh">Osveži</button></div><div class="admin-grid" id="admin-grid"></div><section class="example-library"><h2>Probni šabloni</h2><label><input id="show-examples" type="checkbox" ${showExamples ? 'checked' : ''}> Prikaži probne šablone na javnom sajtu</label><p class="hint">Klikni „Uredi primer” da ga pretvoriš u svoj šablon. Objavljena verzija zameniće taj primer u katalogu.</p><div class="admin-grid" id="example-grid"></div></section></main>`;
  document.querySelector('.example-library').insertAdjacentHTML('beforebegin', `<section class="prepared-layout" aria-labelledby="prepared-layout-title"><div><span class="status">Pripremljeno za tvoju pozadinu</span><h2 id="prepared-layout-title">Roze mašna · 1. rođendan</h2><p>Gotov raspored teksta za roze pozadinu sa mašnom, balonima, medom i zekom. Bez fotografije. Ime, poruku, datum, vreme i mesto možeš da menjaš.</p><p class="layout-sample">„Mila slavi svoj 1. rođendan“</p></div><div class="layout-upload"><label class="upload-button">Dodaj pozadinu i otvori<input type="file" id="rose-bow-background" accept="image/png,image/jpeg,image/webp"></label><p class="hint">Izaberi svoju sliku, proveri izgled i klikni „Objavi“.<br>PNG, JPG ili WebP do 10 MB.</p></div></section>`);
  document.querySelector('#admin-status').value = statusFilter; renderListCards(); renderExamples();
  document.querySelector('.example-library').insertAdjacentHTML('beforebegin', `<section class="example-library" aria-label="Gotovi dizajni"><h2>Gotovi dizajni</h2><p class="hint">Ovi dizajni su već na sajtu. Otvori dizajn, sačuvaj svoje izmene i klikni „Objavi“ da zameniš javnu verziju.</p><div class="admin-grid">${curatedTemplates.map(t => `<article class="admin-card"><div class="card-preview"><img src="${esc(t.thumbnail)}" alt="${esc(t.name)}" width="500" height="700" loading="lazy"></div><div class="card-content"><h3>${esc(t.name)}</h3><p>${esc(categoryName(t.category))}</p><button data-action="edit-curated" data-id="${t.id}">Uredi dizajn</button></div></article>`).join('')}</div></section>`);
  document.querySelector('.catalog-toolbar').insertAdjacentHTML('beforebegin', renderAdSenseAdmin(adsenseSettings));
  bindAdSenseAdmin({ api, onSaved: settings => { adsenseSettings = settings; } });
  if (location.hash === '#adsense') document.querySelector('#adsense-settings').open = true;
}
function renderExamples() {
  const remaining = builtinTemplates.filter(t => !records.some(r => r.draft.builtinSource === t.id));
  document.querySelector('#example-grid').innerHTML = remaining.map(t => `<article class="admin-card"><div class="card-preview"><canvas width="250" height="350" data-example="${t.id}"></canvas></div><div class="card-content"><h3>${esc(t.name)}</h3><p>${esc(categoryName(t.category))}</p><button data-action="edit-example" data-id="${t.id}">Uredi primer</button></div></article>`).join('');
  document.querySelectorAll('[data-example]').forEach(canvas => { const template = builtinTemplates.find(t => t.id === canvas.dataset.example); renderInvitation(canvas, template, defaultData(template), null, 250); });
}
function renderListCards() {
  const shown = records.filter(r => r.name.toLocaleLowerCase('sr').includes(search.toLocaleLowerCase('sr')) && (statusFilter === 'all' || (statusFilter === 'published' ? r.published : !r.published)));
  document.querySelector('#admin-grid').innerHTML = shown.length ? shown.map(r => `<article class="admin-card"><div class="card-preview">${r.draft.thumbnailId ? `<img src="${designAssetUrl(r.draft.thumbnailId, true)}" alt="${esc(r.name)}" loading="lazy" width="500" height="700">` : '<span>✦</span>'}</div><div class="card-content"><span class="status ${r.published ? 'published' : ''}">${statusLabel(r)}</span><h2>${esc(r.name)}</h2><p>${esc(categoryName(r.category))}</p><div class="button-row"><button class="primary" data-action="open" data-id="${r.id}">Uredi</button><button data-action="duplicate-card" data-id="${r.id}">Dupliraj</button><button class="danger" data-action="delete" data-id="${r.id}">Obriši</button></div></div></article>`).join('') : '<div class="empty-admin"><h2>Ovde počinje tvoja kolekcija.</h2><p>Dodaj pozadinu i rasporedi tekst. Sačuvaj nacrt, pa objavi kada je spreman.</p><button class="primary" data-action="new">Napravi šablon</button></div>';
}
function resetHistory() { undoStack = []; redoStack = []; lastSnapshot = JSON.stringify(design); }
function checkpoint() {
  const current = JSON.stringify(design); if (current !== lastSnapshot) { undoStack.push(lastSnapshot); if (undoStack.length > 40) undoStack.shift(); redoStack = []; lastSnapshot = current; } updateToolbar();
}
function undo(redo = false) {
  checkpoint(); const source = redo ? redoStack : undoStack, target = redo ? undoStack : redoStack; if (!source.length) return;
  target.push(JSON.stringify(design)); design = JSON.parse(source.pop()); lastSnapshot = JSON.stringify(design);
  selectedId = design.layers.some(l => l.id === selectedId) ? selectedId : design.layers[0]?.id; dirty = true; renderStudio();
}
function updateToolbar() {
  const state = document.querySelector('#save-state'); if (state) { state.textContent = dirty ? 'Nesačuvane izmene' : record ? statusLabel(record) : 'Novi šablon'; state.classList.toggle('dirty', dirty); }
  const u = document.querySelector('[data-action="undo"]'), r = document.querySelector('[data-action="redo"]'); if (u) u.disabled = busy || !undoStack.length; if (r) r.disabled = busy || !redoStack.length;
}
function setBusy(value) { busy = value; document.querySelectorAll('#admin-app button,#admin-app input,#admin-app select,#admin-app textarea,#admin-preview button,#admin-preview input').forEach(el => el.disabled = value); updateToolbar(); }
async function runAction(fn) { if (busy) return; setBusy(true); try { await fn(); } catch (error) { console.error(error); message(error.message || 'Pokušaj ponovo.'); } finally { setBusy(false); } }
const currentLayer = () => design?.layers.find(l => l.id === selectedId);
function markDirty() { dirty = true; updateToolbar(); queueDraw(); }
function renderStudio() {
  app.innerHTML = `${header()}<main class="admin-shell"><div class="studio-toolbar"><div class="button-row"><button data-action="back">← Šabloni</button><strong id="save-state"></strong><button data-action="undo" title="Poništi">↶</button><button data-action="redo" title="Ponovi">↷</button></div><div class="button-row"><button data-action="preview">Pregled i preuzimanje</button><button data-action="save">Sačuvaj nacrt</button><button class="primary" data-action="publish">Objavi</button>${record?.published ? '<button data-action="unpublish">Povuci sa sajta</button>' : ''}</div></div><div class="studio-workspace"><aside class="panel metadata"><h2>Podešavanja šablona</h2><label>Naziv<input data-meta="name" maxlength="100" value="${esc(design.name)}"></label><label>Kategorija<select data-meta="category">${categories.filter(c => c.id !== 'all').map(c => `<option value="${c.id}" ${design.category === c.id ? 'selected' : ''}>${c.label}</option>`).join('')}</select></label><label>Opis za posetioce i Google<textarea data-meta="description" rows="3" maxlength="1000">${esc(design.description)}</textarea></label><label>Alt tekst pregleda<textarea data-meta="imageAlt" rows="2" maxlength="300">${esc(design.imageAlt || '')}</textarea></label><label>SEO naslov<input data-meta="seoTitle" maxlength="150" value="${esc(design.seoTitle || '')}"></label><label>Pismo datuma<select data-meta="locale">${DATE_LOCALES.map(locale=>`<option value="${locale.id}" ${(design.locale||'sr-Latn-RS')===locale.id?'selected':''}>${locale.name}</option>`).join('')}</select></label><label>Osnovna boja<input type="color" data-meta="bg" value="${design.bg}"></label><label class="upload-button">${design.backgroundId ? 'Zameni pozadinu' : 'Dodaj pozadinu'}<input type="file" id="background-upload" accept="image/png,image/jpeg,image/webp"></label><p class="hint">Preporuka: 1500 × 2100 px. PNG, JPG ili WebP do 10 MB.</p>${design.backgroundId ? '<button data-action="remove-background">Ukloni pozadinu</button>' : ''}<h3>Elementi</h3><div class="layers" id="layers"></div><div class="button-row"><button data-action="add-text">+ Tekst</button><button data-action="add-photo">+ Fotografija</button></div><h3>Moji fontovi</h3><label class="upload-button">Dodaj font<input type="file" id="font-upload" accept=".woff2,.woff,.ttf,.otf"></label><p class="hint">WOFF2, WOFF, TTF ili OTF do 2 MB.</p><div class="font-list">${fontLibrary.map(f => `<p>${esc(f.name)}</p>`).join('') || '<p>Još nema dodatih fontova.</p>'}</div><div class="mobile-links"><button data-action="duplicate">Dupliraj šablon</button></div>${record?.published ? `<p class="hint"><a href="/pozivnice/${record.slug}/" target="_blank" rel="noopener">Pogledaj objavljenu verziju ↗</a></p>` : ''}</aside><section class="stage-wrap" aria-label="Radna površina"><div class="stage"><canvas id="design-canvas" width="1000" height="1400" aria-label="Pregled šablona, klikni element za uređivanje"></canvas><div class="selection-box" hidden></div></div><p class="stage-note">Klikni element i prevuci ga. Strelice pomeraju izabrani element.</p></section><aside class="panel inspector" id="inspector"></aside></div></main>`;
  renderLayers(); renderInspector(); updateToolbar(); void refreshAssets();
}
function renderLayers() { document.querySelector('#layers').innerHTML = [...design.layers].reverse().map(l => `<button class="layer-button ${l.id === selectedId ? 'selected' : ''}" data-action="select" data-layer="${l.id}"><span>${l.type === 'photo' ? '▧' : 'T'} · ${esc(l.label)}</span></button>`).join(''); }
const num = (label, prop, value, min, max, step = 1) => `<label>${label}<input type="number" data-prop="${prop}" value="${value}" min="${min}" max="${max}" step="${step}"></label>`;
function renderInspector() {
  const l = currentLayer(), inspector = document.querySelector('#inspector');
  if (!l) { inspector.innerHTML = '<h2>Uredi element</h2><p class="inspector-empty">Izaberi tekst ili fotografiju na pozivnici.</p>'; return; }
  inspector.innerHTML = `<h2>${l.type === 'text' ? 'Uredi tekst' : 'Okvir fotografije'}</h2><div class="inspector-fields"><label>Naziv elementa<input data-prop="label" value="${esc(l.label)}" maxlength="80"></label>${l.type === 'text' ? `<label>Početni tekst<textarea data-prop="text" rows="3" maxlength="1500">${esc(l.text)}</textarea></label><label>Podatak koji korisnik menja<select data-prop="field">${Object.entries(FIELD_LABELS).map(([field,label]) => `<option value="${field}" ${field === l.field ? 'selected' : ''}>${label}</option>`).join('')}<option value="${FIELD_LABELS[l.field] ? `custom_${l.id.replaceAll('-', '').slice(0,8)}` : l.field}" ${!FIELD_LABELS[l.field] ? 'selected' : ''}>Poseban tekst</option></select></label><label class="inline"><input type="checkbox" data-prop="editable" ${l.editable ? 'checked' : ''}>Korisnik može da izmeni tekst</label><label>Font<select data-prop="family">${[...BUILTIN_FONTS,...fontLibrary].map(f => `<option value="${f.family}" ${f.family === l.family ? 'selected' : ''}>${esc(f.name)}</option>`).join('')}</select></label>${num('Veličina slova','size',l.size,8,120)}<label>Boja teksta<input type="color" data-prop="color" value="${l.color}"></label><label>Poravnanje<select data-prop="align">${[['left','Levo'],['center','Centar'],['right','Desno']].map(([v,n]) => `<option value="${v}" ${l.align === v ? 'selected' : ''}>${n}</option>`).join('')}</select></label>${['bold','italic','underline','uppercase'].map((p,i) => `<label class="inline"><input type="checkbox" data-prop="${p}" ${l[p] ? 'checked' : ''}>${['Podebljano','Kurziv','Podvučeno','Velika slova'][i]}</label>`).join('')}${num('Razmak između slova','letterSpacing',l.letterSpacing,-2,12,.2)}${num('Razmak između redova','lineHeight',l.lineHeight,.8,2.5,.05)}<label>Efekat<select data-prop="effect">${[['none','Bez efekta'],['shadow','Senka'],['outline','Kontura'],['glow','Sjaj'],['lift','Izdignuto'],['gradient','Gradijent']].map(([v,n]) => `<option value="${v}" ${l.effect === v ? 'selected' : ''}>${n}</option>`).join('')}</select></label><label>Boja efekta<input type="color" data-prop="effectColor" value="${l.effectColor}"></label>${num('Jačina efekta','effectSize',l.effectSize,0,20,.5)}` : `<label>Oblik<select data-prop="shape">${[['circle','Krug'],['rounded','Zaobljen okvir'],['rect','Pravougaonik']].map(([v,n]) => `<option value="${v}" ${l.shape === v ? 'selected' : ''}>${n}</option>`).join('')}</select></label>${num('Visina (%)','height',l.height,5,100)}<label>Boja okvira<input type="color" data-prop="borderColor" value="${l.borderColor}"></label>${num('Debljina okvira','borderWidth',l.borderWidth,0,12,.5)}`}<h3>Položaj i slojevi</h3>${num('Položaj X (%)','x',l.x,0,100,.1)}${num('Položaj Y (%)','y',l.y,0,100,.1)}${num('Širina (%)','width',l.width,5,100,.5)}${num('Rotacija (°)','rotation',l.rotation,-180,180)}${num('Vidljivost','opacity',l.opacity,0,1,.05)}<div class="button-row"><button data-action="layer-up">Ispred</button><button data-action="layer-down">Iza</button><button data-action="center">Centriraj</button><button data-action="copy-layer">Kopiraj</button><button class="danger" data-action="remove-layer">Ukloni</button></div></div>`;
}
async function refreshAssets() {
  const request = ++loadRequest;
  try { const loaded = await prepareDesign(design,true); if (request !== loadRequest || !design) return; assets = loaded; queueDraw(); }
  catch { if (request === loadRequest) message('Pozadina ili font nisu mogli da se učitaju. Osveži prijavu i pokušaj ponovo.'); }
}
function queueDraw() { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { const canvas = document.querySelector('#design-canvas'); if (!canvas || !design) return; renderDesign(canvas,design,designData(design),null,1000,assets); updateSelection(); }); }
function updateSelection() {
  const l = currentLayer(), box = document.querySelector('.selection-box'), canvas = document.querySelector('#design-canvas'); if (!box || !canvas) return; box.hidden = !l; if (!l) return;
  const bounds = layerBounds(l,designData(design),canvas); box.style.left = `${l.x}%`; box.style.top = `${l.y}%`; box.style.width = `${bounds.width/5}%`; box.style.height = `${bounds.height/7}%`; box.style.transform = `translate(-50%,-50%) rotate(${l.rotation}deg)`;
}
function applyRecord(item) { record = item; design = clone(item.draft); dirty = false; selectedId = design.layers[0]?.id; resetHistory(); renderStudio(); }
async function refreshList() { ({ templates: records } = await api('/templates')); }
async function upload(file,role,name) { const body = new FormData(); body.append('file',file); body.append('role',role); if (name) body.append('name',name); return api('/assets','POST',body); }
async function uploadBackground(file) {
  if (!file) return null;
  if (!['image/png','image/jpeg','image/webp'].includes(file.type)) throw new Error('Izaberi PNG, JPG ili WebP sliku.');
  if (file.size > 10*1024*1024) throw new Error('Pozadina može biti do 10 MB.');
  const url = URL.createObjectURL(file), image = new Image();
  try {
    image.src = url; await image.decode();
    if (image.width*image.height > 30_000_000) throw new Error('Smanji sliku na najviše 30 megapiksela.');
    if (Math.abs(image.width/image.height-5/7) > .03) message('Pozadina će se prilagoditi formatu 5:7. Preporuka je 1500 × 2100 px.');
  } finally { URL.revokeObjectURL(url); }
  return upload(file,'background');
}
async function saveDraft() {
  checkpoint(); if (record && !dirty) return record;
  const snapshot = normalizeDesign(design), prepared = await prepareDesign(snapshot,true);
  const canvas = renderDesign(document.createElement('canvas'),snapshot,designData(snapshot),null,500,prepared), blob = await new Promise(resolve => canvas.toBlob(resolve,'image/webp',.86));
  if (!blob) throw new Error('Pregled nije mogao da se napravi.');
  const thumbnail = await upload(new File([blob],'pregled.webp',{type:blob.type}),'thumbnail'); snapshot.thumbnailId = thumbnail.id;
  const result = record ? await api(`/templates/${record.id}`,'PUT',{version:record.version,draft:snapshot}) : await api('/templates','POST',{draft:snapshot});
  record = result; design = clone(result.draft); dirty = false; lastSnapshot = JSON.stringify(design); updateToolbar(); message('Nacrt je sačuvan.'); return result;
}
let previewData = {}, previewPhoto = null, previewAssets = {};
function drawPreview() { const canvas = document.querySelector('#preview-canvas'); if (canvas) renderDesign(canvas,design,previewData,previewPhoto,900,previewAssets); }
async function openPreview() {
  checkpoint(); previewAssets = await prepareDesign(design,true); previewData = designData(design); previewPhoto = null; document.querySelector('#admin-preview')?.remove();
  const dialog = document.createElement('dialog'); dialog.id = 'admin-preview'; dialog.className = 'preview-dialog';
  const editable = [...new Map(design.layers.filter(l => l.type === 'text' && l.editable).map(l => [l.field,l])).values()];
  dialog.innerHTML = `<div class="preview-title"><h2>Proveri pozivnicu</h2><button data-action="close-preview" aria-label="Zatvori pregled">✕</button></div><canvas id="preview-canvas" width="900" height="1260"></canvas>${editable.map(l => `<label>${esc(l.label)}<input data-preview-field="${l.field}" value="${esc(l.text)}" maxlength="1500" ${['date','time'].includes(l.field) ? `type="${l.field}"` : ''}></label>`).join('')}${design.layers.some(l => l.type === 'photo') ? '<label>Probna fotografija<input type="file" id="preview-photo" accept="image/png,image/jpeg,image/webp"></label><label>Uvećanje<input type="range" id="preview-zoom" min="100" max="300" value="100"></label>' : ''}<div class="button-row"><button data-action="preview-png">Preuzmi PNG</button><button data-action="preview-pdf">Preuzmi PDF</button></div>`;
  dialog.addEventListener('close',()=>{previewPhoto=null;}); document.body.append(dialog); dialog.showModal(); drawPreview();
}
async function exportPreview(type) {
  const prepared = await prepareDesign(design,true), canvas = renderDesign(document.createElement('canvas'),design,previewData,previewPhoto,1500,prepared);
  if (type === 'pdf') { const { jsPDF } = await import('jspdf'); const pdf = new jsPDF({orientation:'portrait',unit:'mm',format:[127,177.8],compress:true}); pdf.addImage(canvas.toDataURL('image/png'),'PNG',0,0,127,177.8); pdf.save('probna-pozivnica.pdf'); }
  else { const blob = await new Promise(resolve => canvas.toBlob(resolve,'image/png')); if (!blob) throw new Error('Preuzimanje nije uspelo.'); const url = URL.createObjectURL(blob), link = document.createElement('a'); link.href = url; link.download = 'probna-pozivnica.png'; link.click(); setTimeout(() => URL.revokeObjectURL(url),30_000); }
}
const hasUnsavedChanges = () => dirty || document.querySelector('#adsense-form')?.dataset.dirty === 'true';
const confirmLeave = () => !hasUnsavedChanges() || window.confirm('Imaš nesačuvane izmene. Želiš da ih odbaciš?');
const actions = {
  async 'edit-curated'(button) {
    if (!confirmLeave()) return;
    const existing = records.find(r => r.draft.builtinSource === button.dataset.id);
    if (existing) { applyRecord(await api(`/templates/${existing.id}`)); return; }
    const { curatedDesign } = await import('./curated-designs.js');
    const source = curatedDesign(button.dataset.id);
    if (!source) throw new Error('Dizajn nije pronađen.');
    const copyAsset = async (id, role, name) => {
      const response = await fetch(designAssetUrl(id));
      if (!response.ok) throw new Error('Datoteka dizajna nije mogla da se učita.');
      const blob = await response.blob();
      return upload(new File([blob], name, { type: blob.type }), role, name);
    };
    const background = await copyAsset(source.backgroundId, 'background', `${source.id}.webp`);
    const families = new Map(), fonts = [];
    for (const original of source.fonts) {
      const font = await copyAsset(original.assetId, 'font', original.name);
      families.set(original.family, font.family); fonts.push(font); fontLibrary.unshift(font);
    }
    record = null;
    design = normalizeDesign({ ...source, backgroundId: background.id, thumbnailId: null, fonts, layers: source.layers.map(layer => ({ ...layer, family: families.get(layer.family) || layer.family })) });
    dirty = true; selectedId = design.layers.find(layer => layer.field === 'bride')?.id || design.layers.find(layer => layer.field === 'names')?.id || design.layers[0].id;
    assets = {}; resetHistory(); renderStudio();
  },
  async 'edit-example'(button) {
    if(!confirmLeave())return;
    const template=builtinTemplates.find(t=>t.id===button.dataset.id), canvas=renderInvitation(document.createElement('canvas'),template,defaultData(template),null,1500,{decorationsOnly:true});
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',.95));
    const background=await upload(new File([blob],`${template.id}.webp`,{type:blob.type}),'background');
    const defaults=defaultData(template), positions={title:26.4,names:39.1,note:56.1,date:71.7,time:76.1,location:80.6};
    const layers=Object.entries(positions).map(([field,y])=>({...newTextLayer(field),text:defaults[field],y,size:field==='names'?43:field==='title'?15:14,color:template.ink,effectColor:template.accent}));
    layers.push({...newTextLayer('footer'),text:'Radujemo se vašem dolasku',editable:false,y:90,size:12,italic:true,color:template.ink});
    if(['first','eighteen'].includes(template.category))layers.push({...newTextLayer('occasion'),text:template.category==='first'?'1. rođendan':'18. rođendan',editable:false,y:46,size:23,italic:true,color:template.ink});
    record=null;design={...newDesign(),name:template.name,category:template.category,builtinSource:template.id,bg:template.bg,backgroundId:background.id,layers};dirty=true;selectedId=layers[1].id;assets={};resetHistory();renderStudio();
  },
  new() { if (!confirmLeave()) return; record=null; design=newDesign(); dirty=true; selectedId=design.layers[0].id; assets={}; resetHistory(); renderStudio(); },
  async open(b) { if (!confirmLeave()) return; applyRecord(await api(`/templates/${b.dataset.id}`)); },
  async refresh() { if (!confirmLeave()) return; await refreshList(); adsenseSettings = await api('/adsense'); renderList(); },
  async back() { if (!confirmLeave()) return; await refreshList(); renderList(); },
  async adsense() { if (!confirmLeave()) return; adsenseSettings = await api('/adsense'); renderList(); const panel = document.querySelector('#adsense-settings'); panel.open = true; panel.scrollIntoView({ block: 'start' }); panel.querySelector('textarea').focus({ preventScroll: true }); },
  select(b) { selectedId=b.dataset.layer; renderLayers(); renderInspector(); updateSelection(); },
  'add-text'() { if(design.layers.length>=32)throw new Error('Najviše 32 elementa.'); const l=newTextLayer(`custom_${crypto.randomUUID().slice(0,8)}`); design.layers.push(l); selectedId=l.id; checkpoint(); markDirty(); renderLayers(); renderInspector(); },
  'add-photo'() { if(design.layers.some(l=>l.type==='photo'))throw new Error('Šablon već ima okvir za fotografiju.'); const l={id:crypto.randomUUID(),type:'photo',label:'Fotografija',x:50,y:35,width:34,height:25,shape:'circle',rotation:0,opacity:1,borderColor:'#9ca582',borderWidth:1}; design.layers.push(l); selectedId=l.id; checkpoint(); markDirty(); renderLayers(); renderInspector(); },
  'remove-background'() { design.backgroundId=null; assets={}; checkpoint(); markDirty(); renderStudio(); },
  'remove-layer'() { if(design.layers.length===1)throw new Error('Ostavi bar jedan element.'); design.layers=design.layers.filter(l=>l.id!==selectedId); selectedId=design.layers[0]?.id; checkpoint(); markDirty(); renderLayers(); renderInspector(); },
  'copy-layer'() { if(design.layers.length>=32)throw new Error('Najviše 32 elementa.'); const original=currentLayer(); if(original.type==='photo')throw new Error('Podržan je jedan okvir za fotografiju.'); const l={...clone(original),id:crypto.randomUUID(),field:`custom_${crypto.randomUUID().slice(0,8)}`,label:`${original.label.slice(0,65)} — kopija`,y:Math.min(100,original.y+5)}; design.layers.push(l); selectedId=l.id; checkpoint(); markDirty(); renderLayers(); renderInspector(); },
  'layer-up'(){moveLayer(1);},'layer-down'(){moveLayer(-1);},
  center(){currentLayer().x=50;checkpoint();markDirty();renderInspector();},
  undo(){undo();},redo(){undo(true);},save:saveDraft,
  async publish(){const saved=await saveDraft();applyRecord(await api(`/templates/${saved.id}/publish`,'POST',{version:saved.version}));message('Objavljeno! Šablon je sada dostupan na sajtu.');},
  async unpublish(){if(!window.confirm('Povući ovaj šablon iz javnog kataloga? Nacrt ostaje sačuvan.'))return;applyRecord(await api(`/templates/${record.id}/unpublish`,'POST',{version:record.version}));message('Šablon je povučen sa sajta.');},
  async duplicate(){const saved=await saveDraft();applyRecord(await api(`/templates/${saved.id}/duplicate`,'POST',{version:saved.version}));message('Kopija je napravljena kao nacrt.');},
  async 'duplicate-card'(b){const source=records.find(r=>r.id===b.dataset.id);applyRecord(await api(`/templates/${source.id}/duplicate`,'POST',{version:source.version}));},
  async delete(b){const source=records.find(r=>r.id===b.dataset.id);if(!window.confirm(`Obrisati „${source.name}“? Brišu se nacrt i objavljena verzija.`))return;await api(`/templates/${source.id}`,'DELETE',{version:source.version});await refreshList();renderList();message('Šablon je obrisan.');},
  preview:openPreview,'close-preview'(){document.querySelector('#admin-preview').close();},'preview-png'(){return exportPreview('png');},'preview-pdf'(){return exportPreview('pdf');},
};
function moveLayer(direction){const i=design.layers.findIndex(l=>l.id===selectedId),next=i+direction;if(next<0||next>=design.layers.length)return;[design.layers[i],design.layers[next]]=[design.layers[next],design.layers[i]];checkpoint();markDirty();renderLayers();}
const localActions=new Set(['select','add-text','add-photo','remove-layer','copy-layer','layer-up','layer-down','center','undo','redo']);
document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b||busy)return;const fn=actions[b.dataset.action];if(!fn)return;if(localActions.has(b.dataset.action)){try{fn(b);}catch(error){message(error.message);}}else void runAction(()=>fn(b));});
document.addEventListener('input',e=>{
  const input=e.target;if(input.id==='admin-search'){search=input.value;renderListCards();return;}
  if(input.dataset.previewField){previewData[input.dataset.previewField]=input.value;drawPreview();return;}if(input.id==='preview-zoom'){previewData.photoZoom=Number(input.value);drawPreview();return;}
  if(input.dataset.meta){design[input.dataset.meta]=input.value;markDirty();return;}
  if(input.dataset.prop){const l=currentLayer(),p=input.dataset.prop;l[p]=input.type==='checkbox'?input.checked:input.type==='number'?Number(input.value):input.value;if(input.type==='number')l[p]=Math.max(Number(input.min),Math.min(Number(input.max),Number(input.value)));
    if(p==='family'){const font=fontLibrary.find(f=>f.family===input.value);if(font&&!design.fonts.some(f=>f.assetId===font.assetId))design.fonts.push(clone(font));void refreshAssets();}markDirty();if(p==='label')renderLayers();}
});
document.addEventListener('change',e=>{
  const input=e.target;if(input.id==='show-examples'){void runAction(async()=>{({showExamples}=await api('/settings','PUT',{showExamples:input.checked}));message('Prikaz probnih šablona je ažuriran.');});return;}if(input.id==='admin-status'){statusFilter=input.value;renderListCards();return;}if(input.dataset.meta||input.dataset.prop)checkpoint();
  if(input.id==='rose-bow-background')void runAction(async()=>{const asset=await uploadBackground(input.files[0]);if(!asset)return;record=null;design=roseBowDesign(asset.id);dirty=true;selectedId=design.layers.find(l=>l.field==='names').id;assets={};resetHistory();renderStudio();message('Raspored je spreman. Proveri tekst i klikni „Objavi“.');}).finally(()=>{input.value='';});
  if(input.id==='background-upload')void runAction(async()=>{const asset=await uploadBackground(input.files[0]);if(!asset)return;design.backgroundId=asset.id;checkpoint();markDirty();assets=await prepareDesign(design,true);renderStudio();}).finally(()=>{input.value='';});
  if(input.id==='font-upload')void runAction(async()=>{const file=input.files[0];if(!file)return;const font=await upload(file,'font',file.name.replace(/\.[^.]+$/,''));await loadDesignFont(font,true);fontLibrary.unshift(font);design.fonts.push(clone(font));if(currentLayer()?.type==='text')currentLayer().family=font.family;checkpoint();markDirty();renderStudio();message('Font je dodat i dostupan u svim šablonima.');});
  if(input.id==='preview-photo')void runAction(async()=>{const file=input.files[0];if(!file)return;if(file.size>15*1024*1024)throw new Error('Fotografija može biti do 15 MB.');const url=URL.createObjectURL(file),image=new Image();try{image.src=url;await image.decode();previewPhoto=image;drawPreview();}finally{URL.revokeObjectURL(url);}});
});
document.addEventListener('pointerdown',e=>{
  if(e.target.id!=='design-canvas'||busy)return;const canvas=e.target,r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*500,y=(e.clientY-r.top)/r.height*700;
  const l=[...design.layers].reverse().find(l=>{const b=layerBounds(l,designData(design),canvas),dx=x-l.x*5,dy=y-l.y*7,a=-l.rotation*Math.PI/180;return Math.abs(dx*Math.cos(a)-dy*Math.sin(a))<=b.width/2&&Math.abs(dx*Math.sin(a)+dy*Math.cos(a))<=b.height/2;});
  if(!l){selectedId=null;renderLayers();renderInspector();updateSelection();return;}selectedId=l.id;renderLayers();renderInspector();updateSelection();drag={x:e.clientX,y:e.clientY,left:l.x,top:l.y,width:r.width,height:r.height,moved:false};canvas.setPointerCapture(e.pointerId);e.preventDefault();
});
document.addEventListener('pointermove',e=>{if(!drag)return;const l=currentLayer();l.x=Math.round(Math.max(0,Math.min(100,drag.left+(e.clientX-drag.x)/drag.width*100))*10)/10;l.y=Math.round(Math.max(0,Math.min(100,drag.top+(e.clientY-drag.y)/drag.height*100))*10)/10;drag.moved=true;markDirty();});
function endDrag(){if(!drag)return;if(drag.moved){checkpoint();renderInspector();}drag=null;}document.addEventListener('pointerup',endDrag);document.addEventListener('pointercancel',endDrag);
document.addEventListener('keydown',e=>{
  if(!design||busy||document.querySelector('#admin-preview')?.open)return;
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();void runAction(saveDraft);return;}
  if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();undo(e.shiftKey);return;}
  if(currentLayer()&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();const l=currentLayer(),d=e.shiftKey?2:.2;if(e.key==='ArrowLeft')l.x-=d;if(e.key==='ArrowRight')l.x+=d;if(e.key==='ArrowUp')l.y-=d;if(e.key==='ArrowDown')l.y+=d;l.x=Math.max(0,Math.min(100,l.x));l.y=Math.max(0,Math.min(100,l.y));checkpoint();markDirty();renderInspector();}
});
window.addEventListener('beforeunload',e=>{if(hasUnsavedChanges()){e.preventDefault();e.returnValue='';}});
try{await api('/maintenance/retired-templates','POST');const [session,collection,fonts,settings,adsense]=await Promise.all([api('/session'),api('/templates'),api('/fonts'),api('/settings'),api('/adsense')]);email=session.email;records=collection.templates;fontLibrary=fonts.fonts;showExamples=settings.showExamples;adsenseSettings=adsense;renderList();}
catch(error){app.innerHTML=`<main class="admin-shell"><h1>Pristup šablonima</h1><div class="error-message">${esc(error.message)}</div><p><a href="/admin/sabloni/">Ponovo otvori panel</a> · <a href="/">Vrati se na sajt</a></p></main>`;}
