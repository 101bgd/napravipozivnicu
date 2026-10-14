import { authenticate, errorResponse, noStoreHeaders } from './auth.js';
import { handleAdminApi } from './admin-api.js';
import { handlePublic } from './public-pages.js';
const adminCsp = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'";
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (url.pathname === '/admin' || url.pathname.startsWith('/admin/') || url.pathname.startsWith('/api/admin')) {
        const identity = await authenticate(request, env);
        if (url.pathname.startsWith('/api/admin')) return await handleAdminApi(request, env, identity);
        if (!['/admin', '/admin/', '/admin/sabloni', '/admin/sabloni/', '/admin/sabloni/index.html'].includes(url.pathname)) return new Response('Nije pronađeno.', { status: 404, headers: noStoreHeaders });
        const response = await env.ASSETS.fetch(new Request(new URL('/admin/sabloni/', request.url), request));
        const headers = new Headers(response.headers);
        for (const [key, value] of Object.entries(noStoreHeaders)) headers.set(key, value);
        headers.set('Content-Security-Policy', adminCsp);
        return new Response(response.body, { status: response.status, headers });
      }
      const response = await handlePublic(request, env, path => env.ASSETS.fetch(new Request(new URL(path, request.url), request)));
      if (response) return response;
      const staticResponse = await env.ASSETS.fetch(request);
      // Pages' SPA fallback must not turn nonexistent invitation URLs into 200 pages.
      if (!url.pathname.includes('.') && staticResponse.status === 200) return new Response('Stranica nije pronađena.', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      return staticResponse;
    } catch (error) {
      if (error.status === 404 && !url.pathname.startsWith('/api/')) return new Response('<!doctype html><html lang="sr-Latn"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Pozivnica nije dostupna</title><body style="font-family:Arial,sans-serif;background:#f8f7f3;color:#304e36;padding:10vh 8vw;line-height:1.7"><h1>Ova stranica trenutno nije dostupna.</h1><p>Pogledaj ostale pozivnice i pronađi dizajn za svoju proslavu.</p><a href="/">Prikaži sve pozivnice →</a></body></html>', { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
      return errorResponse(error);
    }
  },
};
