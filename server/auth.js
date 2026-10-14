import { createRemoteJWKSet, jwtVerify } from 'jose';
const keySets = new Map();
export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export function accessConfig(env) {
  const domain = String(env.ACCESS_TEAM_DOMAIN || '').trim().replace(/^https:\/\//, '').replace(/\/$/, '');
  const audience = String(env.ACCESS_AUD || '').trim();
  const emails = String(env.ADMIN_EMAILS || '').split(',').map(email => email.trim().toLowerCase()).filter(Boolean);
  if (!/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(domain) || !audience || !emails.length) {
    throw new HttpError(503, 'Admin još nije aktiviran. Podesi Cloudflare Access, ACCESS_TEAM_DOMAIN, ACCESS_AUD i ADMIN_EMAILS prema ADMIN-SETUP.md.');
  }
  return { issuer: `https://${domain}`, audience, emails };
}
export async function verifyAccessToken(token, config, keys) {
  if (!token) throw new HttpError(401, 'Potrebna je prijava preko Cloudflare Access-a.');
  let payload;
  try {
    if (!keys) {
      if (!keySets.has(config.issuer)) keySets.set(config.issuer, createRemoteJWKSet(new URL('/cdn-cgi/access/certs', config.issuer), { timeoutDuration: 5000 }));
      keys = keySets.get(config.issuer);
    }
    ({ payload } = await jwtVerify(token, keys, { issuer: config.issuer, audience: config.audience, algorithms: ['RS256'], requiredClaims: ['exp', 'iat', 'email'] }));
  } catch { throw new HttpError(401, 'Prijava je istekla ili nije važeća. Otvori admin panel i prijavi se ponovo.'); }
  if (typeof payload.email !== 'string' || !config.emails.includes(payload.email.toLowerCase())) throw new HttpError(403, 'Ovaj nalog nema pristup šablonima.');
  return { email: payload.email.toLowerCase() };
}
export async function authenticate(request, env) {
  return verifyAccessToken(request.headers.get('Cf-Access-Jwt-Assertion'), accessConfig(env));
}
export function checkMutation(request) {
  if (['GET', 'HEAD'].includes(request.method)) return;
  if (request.headers.get('Origin') !== new URL(request.url).origin || request.headers.get('X-Requested-With') !== 'template-studio') {
    throw new HttpError(403, 'Zahtev mora da potekne iz admin panela na ovom domenu.');
  }
}
export const noStoreHeaders = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff' };
export function json(data, status = 200, headers = {}) {
  return Response.json(data, { status, headers: { ...noStoreHeaders, ...headers } });
}
export function errorResponse(error) {
  if (!(error instanceof HttpError)) console.error('Request failed', error);
  if (String(error.message).includes('no such table')) return json({ error: 'Baza nije pripremljena. Pokreni SQL iz migrations/0001_templates.sql prema ADMIN-SETUP.md.' }, 503);
  return json({ error: error instanceof HttpError ? error.message : 'Došlo je do greške. Pokušaj ponovo.' }, error.status || 500);
}
