import { DEFAULT_ADSENSE, storedAdSense, AD_PLACEMENT } from '../src/adsense-config.js';

export async function readAdSense(env, strict = false) {
  if (!env.DB) return { ...DEFAULT_ADSENSE };
  try {
    const row = await env.DB.prepare("SELECT value FROM settings WHERE key = 'adsense'").first();
    return row ? storedAdSense(row.value) : { ...DEFAULT_ADSENSE };
  } catch (error) {
    if (strict) throw error;
    if (!String(error.message).includes('no such table')) console.error('AdSense settings unavailable; advertisements omitted from this response.');
    return { ...DEFAULT_ADSENSE };
  }
}

export function adSenseHost(url, siteUrl) {
  const host = new URL(url).hostname, production = new URL(siteUrl).hostname.replace(/^www\./, '');
  return host === production || host === `www.${production}`;
}

export function applyAdSense(html, config, allowed) {
  if (!allowed || !config.publisherId) return html;
  html = html.replace('</head>', `<meta name="google-adsense-account" content="${config.publisherId}"></head>`);
  if (!config.enabled || !config.slotId) return html;
  const placement = `<aside class="ad-placement container" aria-label="Oglas"><span class="ad-label">Oglas</span><ins class="adsbygoogle ad-unit" style="display:block" data-ad-client="${config.publisherId}" data-ad-slot="${config.slotId}" data-ad-format="auto" data-full-width-responsive="true"></ins></aside><script id="adsense-config" type="application/json">${JSON.stringify({ publisherId: config.publisherId })}</script>`;
  return html.replace(AD_PLACEMENT, placement);
}
