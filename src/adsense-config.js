// Only these identifiers are persisted. Pasted HTML/JavaScript is never executed.
export const DEFAULT_ADSENSE = Object.freeze({ scriptEnabled: true, enabled: false, publisherId: 'ca-pub-6151181163851577', slotId: '' });
const publisherPattern = /^ca-pub-\d{16}$/;
const slotPattern = /^\d{10}$/;

export function parseAdSenseCode(code) {
  if (typeof code !== 'string' || code.length > 20_000) throw new Error('AdSense kod može imati najviše 20.000 znakova.');
  if (!code.trim()) return { publisherId: '', slotId: '' };
  const publishers = [...new Set(code.match(/ca-pub-\d{16}(?!\d)/g) || [])];
  const slots = [...new Set([...code.matchAll(/\bdata-ad-slot\s*=\s*["'](\d{10})["']/gi)].map(match => match[1]))];
  if (publishers.length !== 1) throw new Error('Nalepi kod jednog AdSense naloga sa identifikatorom ca-pub- i 16 cifara.');
  if (slots.length > 1) throw new Error('Nalepi kod jedne reklamne jedinice. Isti blok će se koristiti na svim javnim stranicama.');
  if (/\bdata-ad-slot\b/i.test(code) && !slots.length) throw new Error('ID reklamne jedinice (data-ad-slot) treba da ima 10 cifara.');
  return { publisherId: publishers[0], slotId: slots[0] || '' };
}

export function normalizeAdSense(input) {
  if (!input || typeof input.enabled !== 'boolean') throw new Error('Izaberi da li su oglasi uključeni.');
  const scriptEnabled = input.scriptEnabled ?? true;
  if (typeof scriptEnabled !== 'boolean') throw new Error('Izaberi da li je AdSense kod u zaglavlju uključen.');
  const ids = 'code' in input ? parseAdSenseCode(input.code) : { publisherId: input.publisherId, slotId: input.slotId };
  if (typeof ids.publisherId !== 'string' || (ids.publisherId && !publisherPattern.test(ids.publisherId))) throw new Error('Publisher ID treba da počinje sa ca-pub- i ima 16 cifara.');
  if (typeof ids.slotId !== 'string' || (ids.slotId && !slotPattern.test(ids.slotId))) throw new Error('ID reklamne jedinice treba da ima 10 cifara.');
  if (ids.slotId && !ids.publisherId) throw new Error('Nedostaje AdSense publisher ID.');
  if (scriptEnabled && !ids.publisherId) throw new Error('Za kod u zaglavlju dodaj AdSense publisher ID.');
  if (input.enabled && !scriptEnabled) throw new Error('Za prikaz reklamnog bloka uključi i AdSense kod u zaglavlju.');
  if (input.enabled && (!ids.publisherId || !ids.slotId)) throw new Error('Za uključivanje nalepi ceo kod prikaznog oglasa iz AdSense → Oglasi → Po oglasnoj jedinici.');
  return { scriptEnabled, enabled: input.enabled, ...ids };
}

export function storedAdSense(value) {
  try {
    const input = JSON.parse(value);
    // Older installations can contain a saved, empty configuration. Activate
    // the supplied site account on deployment without overwriting configured IDs.
    if (input && !('scriptEnabled' in input) && input.enabled === false && input.publisherId === '' && input.slotId === '') return { ...DEFAULT_ADSENSE };
    return normalizeAdSense(input);
  } catch { return { ...DEFAULT_ADSENSE }; }
}

export function adSenseCode({ publisherId, slotId }) {
  if (!publisherPattern.test(publisherId)) return '';
  const script = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}" crossorigin="anonymous"></script>`;
  return !slotPattern.test(slotId) ? script : `${script}\n<ins class="adsbygoogle"\n     style="display:block"\n     data-ad-client="${publisherId}"\n     data-ad-slot="${slotId}"\n     data-ad-format="auto"\n     data-full-width-responsive="true"></ins>\n<script>\n     (adsbygoogle = window.adsbygoogle || []).push({});\n</script>`;
}

// Keep one inconspicuous, non-interactive placement separate from the editor.
export const AD_PLACEMENT = '<!--adsense-placement--><aside class="ad-placement container" aria-label="Oglas" hidden></aside>';
