import { Miniflare, createFetchMock, Response as LocalResponse } from 'miniflare';
import { generateKeyPair, exportJWK, SignJWT } from 'jose';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export const root = fileURLToPath(new URL('../', import.meta.url));
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.woff2':'font/woff2', '.woff':'font/woff', '.xml':'application/xml', '.txt':'text/plain' };
export async function createLocalRuntime({ persist = false, configured = true } = {}) {
  const { privateKey, publicKey } = await generateKeyPair('RS256');
  const jwk = await exportJWK(publicKey); jwk.kid = 'local-preview'; jwk.alg = 'RS256';
  const issuer = 'https://local-studio.cloudflareaccess.com', audience = 'local-preview', email = 'owner@local.invalid';
  const fetchMock = createFetchMock(); fetchMock.disableNetConnect();
  fetchMock.get(issuer).intercept({ path:'/cdn-cgi/access/certs', method:'GET' }).reply(200,{keys:[jwk]},{headers:{'Content-Type':'application/json'}}).persist();
  const runtime = new Miniflare({
    name:'napravi-local', modules:true, scriptPath:path.join(root,'dist/_worker.js'), compatibilityDate:'2026-08-01',
    d1Databases:{DB:'templates-local'}, r2Buckets:{MEDIA:'templates-media-local'},
    ...(persist ? { d1Persist:path.join(root,'.dev-data/d1'), r2Persist:path.join(root,'.dev-data/r2') } : {}),
    bindings:configured ? {ACCESS_TEAM_DOMAIN:'local-studio.cloudflareaccess.com',ACCESS_AUD:audience,ADMIN_EMAILS:email} : {},
    fetchMock,
    serviceBindings:{ASSETS:async request=>{
      const relative = decodeURIComponent(new URL(request.url).pathname).replace(/^\/+/, ''), dist = path.join(root,'dist');
      let file = path.resolve(dist,relative || 'index.html');
      if (!file.startsWith(`${dist}${path.sep}`)) return new LocalResponse('Nije pronađeno.',{status:404});
      try { if ((await fs.stat(file)).isDirectory()) file = path.join(file,'index.html'); const bytes = await fs.readFile(file); return new LocalResponse(request.method==='HEAD'?null:bytes,{headers:{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}}); }
      catch { return new LocalResponse('Nije pronađeno.',{status:404}); }
    }},
  });
  await runtime.ready;
  const db = await runtime.getD1Database('DB'); await db.exec((await fs.readFile(path.join(root,'migrations/0001_templates.sql'),'utf8')).replace(/\n/g,' '));
  async function token(overrides = {}, signingKey = privateKey) {
    return new SignJWT({ email, ...overrides }).setProtectedHeader({alg:'RS256',kid:'local-preview'}).setIssuer(issuer).setAudience(audience).setIssuedAt().setExpirationTime('8h').sign(signingKey);
  }
  return { runtime, db, token, privateKey, publicKey, email, issuer, audience };
}
