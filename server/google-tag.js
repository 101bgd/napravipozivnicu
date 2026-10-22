export const GOOGLE_TAG_ID = 'G-802HKT7NMR';
export const GOOGLE_TAG_URL = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`;
export const GOOGLE_TAG = `<!-- Google tag (gtag.js) -->
<script async src="${GOOGLE_TAG_URL}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GOOGLE_TAG_ID}');
</script>`;

// Insert into the returned HTML, before any other head content. Keeping this
// server-side also covers templates published through the admin without a build.
export function applyGoogleTag(html, allowed) {
  if (!allowed || html.includes(`src="${GOOGLE_TAG_URL}"`)) return html;
  return html.replace(/<head\b[^>]*>/i, head => `${head}\n${GOOGLE_TAG}\n`);
}
