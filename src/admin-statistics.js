import { escapeHtml as esc } from './ui.js';

export function mountStatistics({ before, api, templates }) {
  before.insertAdjacentHTML('beforebegin', `<details id="usage-statistics" class="usage-statistics"><summary>Statistika pozivnica</summary><p>Broj radnji na javnom sajtu, bez ličnih podataka i praćenja pojedinačnih posetilaca. Podaci počinju od uključivanja ove statistike.</p><div class="statistics-toolbar"><label>Period <select id="statistics-days"><option value="7">Poslednjih 7 dana</option><option value="30" selected>Poslednjih 30 dana</option><option value="90">Poslednjih 90 dana</option></select></label><button id="statistics-refresh">Osveži statistiku</button></div><div id="statistics-result" role="status" aria-live="polite"></div><p class="hint">Preuzimanje se broji kada je PNG ili PDF napravljen i predat pregledaču. Pregledač ne potvrđuje da je datoteka sačuvana na uređaju. Ponovljene radnje se broje ponovo; ovo nisu jedinstveni posetioci. Ne obuhvata blokirane zahteve, DNT/GPC i probne domene. Dnevni zbirni podaci čuvaju se do 90 dana.</p></details>`);
  const panel = document.querySelector('#usage-statistics'), result = panel.querySelector('#statistics-result'), select = panel.querySelector('select'), refresh = panel.querySelector('button');
  let request = 0, loaded = false;
  async function load() {
    const current = ++request; result.textContent = 'Učitavam statistiku…'; refresh.disabled = true;
    try {
      const data = await api(`/statistics?days=${select.value}`); if (current !== request || !panel.isConnected) return;
      const totals = {}, grouped = new Map();
      for (const row of data.rows) {
        totals[row.event] = (totals[row.event] || 0) + row.total;
        const item = grouped.get(row.templateId) || { id: row.templateId }; item[row.event] = row.total; grouped.set(row.templateId, item);
      }
      const count = value => Number(value || 0).toLocaleString('sr-Latn-RS');
      const cards = [['Izbori šablona',totals.template_select],['Otvaranja editora',totals.editor_open],['Preuzimanja pokrenuta',(totals.download_png||0)+(totals.download_pdf||0)],['Neuspeli izvozi',totals.export_error]];
      result.innerHTML = `<div class="statistics-totals">${cards.map(([label,total])=>`<div><strong>${count(total)}</strong><span>${label}</span></div>`).join('')}</div>${!data.rows.length ? '<p>Još nema zabeleženih radnji u ovom periodu.</p>' : `<div class="statistics-table" role="region" aria-label="Statistika po šablonu" tabindex="0"><table><caption>Radnje po šablonu · ${esc(data.from)} – ${esc(data.to)} (UTC)</caption><thead><tr><th scope="col">Šablon</th><th scope="col">Izbori</th><th scope="col">Editor</th><th scope="col">PNG</th><th scope="col">PDF</th><th scope="col">Greške</th></tr></thead><tbody>${[...grouped.values()].sort((a,b)=>((b.download_png||0)+(b.download_pdf||0))-((a.download_png||0)+(a.download_pdf||0))||(b.editor_open||0)-(a.editor_open||0)).map(item=>`<tr><th scope="row">${esc(templates.find(t=>t.id===item.id)?.name||'Uklonjen šablon')}</th>${['template_select','editor_open','download_png','download_pdf','export_error'].map(event=>`<td>${count(item[event])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}`;
      loaded = true;
    } catch { if (current === request) { loaded = false; result.textContent = 'Statistika trenutno nije dostupna. Pokušaj ponovo dugmetom „Osveži statistiku“. '; } }
    finally { if (current === request) refresh.disabled = false; }
  }
  panel.addEventListener('toggle', () => { if (panel.open && !loaded) void load(); });
  select.addEventListener('change', load); refresh.addEventListener('click', load);
  return panel;
}
