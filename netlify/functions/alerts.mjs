// Alerts: email and WhatsApp the moment something important happens, and a digest on each person's own schedule.
//   GET  /api/alerts                         this person's alert settings
//   POST /api/alerts { action:'save', prefs } save them
//   POST /api/alerts { action:'test' }        send a test to every channel that is switched on
//   POST /api/alerts { action:'event', title, body } an alert from the portal, forwarded to email and WhatsApp
//   POST /api/alerts { action:'digest-now' }  build and send the digest straight away
import { json, bad, needUser, store, waReady, limited } from './_lib.mjs';
import { clean, sendDigest, sendInstant } from './_alertsend.mjs';
export default async (req) => {
  const u = await needUser(req); if (!u) return bad('Sign in first', 401);
  const s = await store(); const k = 'alerts:' + u.email;
  if (req.method === 'GET') return json({ prefs: await s.get(k), whatsapp: waReady(), email: !!process.env.RESEND_API_KEY });
  const b = await req.json().catch(() => ({}));
  const cur = (await s.get(k)) || clean({}, u);
  if (b.action === 'save') { const p = clean(b.prefs || {}, u); p.dg.last = cur.dg && cur.dg.last || p.dg.last; await s.set(k, p); return json({ ok: true }); }
  if (b.action === 'test') { if (await limited('alerttest:' + u.email, 5, 3600)) return bad('That is a lot of tests. Try again in an hour.', 429); return json({ sent: await sendInstant(cur, 'Test alert from your Permissionless Portal', 'This is what an alert looks like.') }); }
  if (b.action === 'event') {
    if (!cur.inst || !(cur.inst.email || cur.inst.wa)) return json({ sent: [] });
    if (await limited('alert:' + u.email, 30, 86400)) return json({ sent: [], limited: true });
    const title = String(b.title || '').slice(0, 160); if (!title) return bad('Nothing to send');
    const dk = 'alertseen:' + u.email; const seen = (await s.get(dk)) || {}; const now = Date.now();
    if (seen[title] && now - seen[title] < 6 * 3600e3) return json({ sent: [], duplicate: true });
    seen[title] = now; Object.keys(seen).forEach(t => { if (now - seen[t] > 86400e3) delete seen[t]; }); await s.set(dk, seen);
    return json({ sent: await sendInstant(cur, title, String(b.body || '').slice(0, 300)) });
  }
  if (b.action === 'digest-now') {
    if (await limited('digestnow:' + u.email, 6, 3600)) return bad('You have sent a few already. Try again in an hour.', 429);
    const r = await sendDigest(cur.dg ? cur : clean({ dg: { on: true } }, u), s);
    if (r.sent) { cur.dg = cur.dg || {}; cur.dg.last = new Date().toISOString(); await s.set(k, cur); return json({ sent: true }); }
    return bad(r.why || (process.env.RESEND_API_KEY ? 'The email did not go. Check the address.' : 'Email is not set up yet: add RESEND_API_KEY.'), 502);
  }
  return bad('Unknown action');
};
export const config = { path: '/api/alerts' };
