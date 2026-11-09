// The picture each event shares when you post its link (its og:image), so event tiles can show it. Cached for two weeks.
// GET /api/og?urls=https://a|https://b
import { json, bad, needUser, store, safeUrl, fetchText } from './_lib.mjs';
const pick = (h) => { const m = h.match(/<meta[^>]+(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image(?::src)?)["'][^>]*>/i); if (!m) return ''; const c = m[0].match(/content=["']([^"']+)["']/i); return c ? c[1] : ''; };
export default async (req) => {
  if (!(await needUser(req))) return bad('Sign in first', 401);
  const urls = (new URL(req.url).searchParams.get('urls') || '').split('|').map(s => s.trim()).filter(Boolean).slice(0, 12);
  const s = await store(); const images = {};
  await Promise.all(urls.map(async (raw) => {
    const u = safeUrl(raw); if (!u) return; const key = 'og:' + Buffer.from(u.href).toString('base64url').slice(0, 120);
    const hit = await s.get(key); if (hit && Date.now() - Date.parse(hit.ts) < 14 * 864e5) { images[raw] = hit.img; return; }
    const r = await fetchText(u.href, 7000, 400000); let img = r ? pick(r.html) : '';
    if (img) { try { const abs = new URL(img.replace(/&amp;/g, '&'), r.url || u.href); img = /^https:$/.test(abs.protocol) ? abs.href : ''; } catch { img = ''; } }
    await s.set(key, { img, ts: new Date().toISOString() }); images[raw] = img;
  }));
  return json({ images });
};
export const config = { path: '/api/og' };
