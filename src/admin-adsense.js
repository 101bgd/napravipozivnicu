import { adSenseCode, parseAdSenseCode } from './adsense-config.js';
import { escapeHtml as esc } from './ui.js';

export function renderAdSenseAdmin(settings) {
  return `<details class="adsense-settings" id="adsense-settings"><summary><span><strong>AdSense reklame</strong><span class="hint">Kod i prikaz oglasa na svim javnim stranicama</span></span><span class="status ${settings.scriptEnabled ? 'published' : ''}">${settings.scriptEnabled ? 'Kod uključen' : 'Kod isključen'}</span></summary><form id="adsense-form"><p>U AdSense nalogu otvori <strong>Oglasi → Po oglasnoj jedinici → Prikazni oglasi</strong>, napravi prilagodljivu jedinicu i ovde nalepi ceo njen kod.</p><label for="adsense-code">AdSense kod</label><textarea id="adsense-code" name="code" rows="10" maxlength="20000" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="Nalepi Google AdSense kod…">${esc(adSenseCode(settings))}</textarea><p class="hint">Kod naloga učitava se asinhrono u &lt;head&gt; svake javne stranice kada je uključen prekidač za zaglavlje. Za prikaz bloka potreban je kod reklamne jedinice sa data-ad-slot. Prepoznajemo samo AdSense identifikatore; dodatne skripte se ne izvršavaju.</p><output id="adsense-identified" aria-live="polite"></output><label class="adsense-toggle"><input type="checkbox" name="scriptEnabled" ${settings.scriptEnabled ? 'checked' : ''}> Učitaj AdSense kod u zaglavlju javnih stranica</label><label class="adsense-toggle"><input type="checkbox" name="enabled" ${settings.enabled ? 'checked' : ''}> Prikaži ručni reklamni blok pre podnožja</label><p class="hint">Auto oglase podešavaš u Google AdSense nalogu; ovaj drugi prekidač kontroliše samo naš ručni blok. Blok je odvojen od dugmadi i ne ulazi u pozivnicu, PNG ili PDF. Oglasi se ne prikazuju u adminu i na pages.dev pregledima. Prazni ili blokirani oglasi se sakrivaju.</p><p class="hint">U AdSense → Privatnost i poruke podesi Googleovu sertifikovanu poruku o saglasnosti za regione gde je potrebna. AdSense odlučuje kada je nalog odobren i koji oglas će se prikazati.</p><div class="button-row"><button class="primary" type="submit">Sačuvaj podešavanja reklama</button><a href="https://adsense.google.com/" target="_blank" rel="noopener noreferrer">Otvori AdSense ↗</a></div><p id="adsense-result" role="status" aria-live="polite"></p></form></details>`;
}

export function bindAdSenseAdmin({ api, onSaved }) {
  const form = document.querySelector('#adsense-form'), code = form.querySelector('[name="code"]');
  const identified = form.querySelector('#adsense-identified'), result = form.querySelector('#adsense-result');
  function identify() {
    try {
      const config = parseAdSenseCode(code.value);
      identified.textContent = config.publisherId ? `Nalog: ${config.publisherId} · Jedinica: ${config.slotId || 'nije dodata'}` : 'Kod naloga nije dodat.';
    } catch (error) { identified.textContent = error.message; }
  }
  const markDirty = () => { form.dataset.dirty = 'true'; result.textContent = 'Nesačuvane izmene.'; };
  code.addEventListener('input', () => { markDirty(); identify(); });
  form.querySelector('[name="enabled"]').addEventListener('change', () => { if(form.elements.enabled.checked)form.elements.scriptEnabled.checked=true;markDirty(); });
  form.querySelector('[name="scriptEnabled"]').addEventListener('change', () => { if(!form.elements.scriptEnabled.checked)form.elements.enabled.checked=false;markDirty(); });
  form.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); form.requestSubmit(); } });
  identify();
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]'); button.disabled = true; result.textContent = 'Čuvanje…';
    try {
      const settings = await api('/adsense', 'PUT', { code: code.value, scriptEnabled: form.elements.scriptEnabled.checked, enabled: form.elements.enabled.checked });
      onSaved(settings); code.value = adSenseCode(settings); identify();
      delete form.dataset.dirty;
      const badge = form.closest('details').querySelector('.status'); badge.textContent = settings.scriptEnabled ? 'Kod uključen' : 'Kod isključen'; badge.classList.toggle('published', settings.scriptEnabled);
      result.textContent = settings.scriptEnabled ? settings.enabled ? 'Sačuvano. AdSense kod i ručni reklamni blok su uključeni.' : 'Sačuvano. AdSense kod je u zaglavlju; ručni reklamni blok je isključen.' : 'Sačuvano. AdSense kod i ručni reklamni blok su isključeni.';
    } catch (error) { result.textContent = error.message; }
    finally { button.disabled = false; }
  });
}
