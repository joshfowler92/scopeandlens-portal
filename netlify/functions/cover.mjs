// A cover picture for a brand card: the brand's own share image, read from its home page.
// GET /api/cover?d=brand.co.uk  ->  302 to the og:image (or twitter:image), cached for a week. 404 when there is none.
import { safeUrl, fetchText, limited } from './_lib.mjs';
const pick = (h, base) => {
  const m = h.match(/<meta[^>]+(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image(?::src)?)["'][^>]*content=["']([^"']+)/i)
    || h.match(/<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["'](?:og:image|twitter:image)["']/i);
  if (!m) return '';
  try { const u = new URL(m[1].replace(/&amp;/g, '&'), base); return /^https:$/.test(u.protocol) ? u.href : ''; } catch { return ''; }
};
export default async (req) => {
  const url = new URL(req.url);
  const d = String(url.searchParams.get('d') || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(d)) return new Response('', { status: 400 });
  const ip = req.headers.get('x-nf-client-connection-ip') || 'x';
  if (await limited('cover:' + ip, 300, 3600)) return new Response('', { status: 429 });
  const base = safeUrl('https://' + d); if (!base) return new Response('', { status: 400 });
  const r = await fetchText(base.href, 5000, 600000);
  const img = r ? pick(r.html, r.url || base.href) : '';
  if (!img) return new Response('', { status: 404, headers: { 'cache-control': 'public, max-age=86400' } });
  return new Response('', { status: 302, headers: { location: img, 'cache-control': 'public, max-age=604800' } });
};
export const config = { path: '/api/cover' };
