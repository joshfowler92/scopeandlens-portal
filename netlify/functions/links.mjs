// Trackable links. Every email gets its own short link to the hero piece. A click is logged and turns into a signal.
//   POST /api/links { items:[{code,url,brand,person,camp}] }   register links for the signed-in user
//   GET  /api/links?since=ISO                                    the user's clicks since a time
//   GET  /l/:code                                                 public: log the click, then send them to the real page
import { json, bad, needUser, store } from './_lib.mjs';
import { sendInstant } from './_alertsend.mjs';
const okUrl = (u) => { try { const x = new URL(u); return /^https?:$/.test(x.protocol) ? x.href : null; } catch { return null; } };
export default async (req) => {
  const url = new URL(req.url); const s = await store();
  if (url.pathname.startsWith('/l/')) {
    const code = url.pathname.slice(3).replace(/[^a-z0-9]/gi, '').slice(0, 24);
    const L = code ? await s.get('link:' + code) : null;
    if (!L) return new Response('This link has expired.', { status: 404, headers: { 'Content-Type': 'text/plain' } });
    const bot = /bot|crawl|spider|preview|slurp|facebookexternalhit|linkedinbot|outlook|safelinks|proofpoint|mimecast/i.test(req.headers.get('user-agent') || '');
    if (!bot) { const k = 'clicks:' + L.owner; const C = (await s.get(k)) || []; C.unshift({ code, brand: L.brand, person: L.person, camp: L.camp, at: new Date().toISOString() }); await s.set(k, C.slice(0, 1000));
      /* a click is worth knowing about straight away, if they asked for instant alerts (once per person per day) */
      try { const P = await s.get('alerts:' + L.owner); if (P && P.inst && (P.inst.email || P.inst.wa) && (P.signals || []).includes('email_click')) { const dk = 'clickalert:' + L.owner + ':' + code + ':' + new Date().toISOString().slice(0, 10); if (!(await s.get(dk))) { await s.set(dk, 1); await sendInstant(P, (L.person || 'Someone') + ' at ' + (L.brand || 'a brand') + ' opened your link', 'They clicked through to what you sent.'); } } } catch { } }
    return new Response(null, { status: 302, headers: { Location: L.url, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });
  }
  const u = await needUser(req); if (!u) return bad('Sign in first', 401);
  if (req.method === 'POST') {
    const b = await req.json().catch(() => null); if (!b || !Array.isArray(b.items)) return bad('Bad request');
    let n = 0;
    for (const it of b.items.slice(0, 200)) { const code = String(it.code || '').replace(/[^a-z0-9]/gi, '').slice(0, 24); const to = okUrl(it.url); if (!code || !to) continue;
      const ex = await s.get('link:' + code); if (ex && ex.owner !== u.email) continue;
      await s.set('link:' + code, { url: to, owner: u.email, brand: String(it.brand || '').slice(0, 120), person: String(it.person || '').slice(0, 120), camp: String(it.camp || '').slice(0, 60) }); n++; }
    return json({ ok: true, saved: n });
  }
  const since = url.searchParams.get('since') || '';
  const C = (await s.get('clicks:' + u.email)) || [];
  return json({ clicks: C.filter(c => !since || c.at > since).slice(0, 200), now: new Date().toISOString() });
};
export const config = { path: ['/api/links', '/l/*'] };
