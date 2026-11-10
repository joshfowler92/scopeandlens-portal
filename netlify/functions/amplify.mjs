// Amplify: the outreach layer, run by our outreach partner behind the scenes and presented as Amplify.
// Finding brands and the people inside them is open to every agency. Sending, autopilot and tracking are Premium,
// switched on per organisation by Scope & Lens. The browser never talks to the partner directly. See docs/AMPLIFY-INTEGRATION.md.
//   GET  /api/amplify                         { connected, enabled, premium }
//   POST /api/amplify { action, payload }     companies | people | profile (open) · enrich | send | campaign | pause | resume | approve | status | events (Premium)
//   POST /api/amplify-hook                    events from the partner, signed with AMPLIFY_WEBHOOK_SECRET
import crypto from 'node:crypto';
import { json, bad, needUser, getOrgs, store, getUsers , isFounder } from './_lib.mjs';
const OPEN = ['companies', 'people', 'profile'];
const PREMIUM = ['enrich', 'send', 'campaign', 'pause', 'resume', 'approve', 'status', 'events'];
export default async (req) => {
  const url = new URL(req.url);
  if (url.pathname === '/api/amplify-hook') return hook(req);
  const u = await needUser(req); if (!u) return bad('Sign in first', 401);
  const o = (await getOrgs()).find(x => x.id === u.orgId) || {};
  const connected = !!(process.env.AMPLIFY_API_URL && process.env.AMPLIFY_API_KEY);
  const enabled = connected && (!!o.premium || isFounder(u));
  if (req.method === 'GET') return json({ connected, enabled, premium: !!o.premium });
  if (!connected) return bad('Amplify is not connected yet', 501);
  let b; try { b = await req.json(); } catch { return bad('Send JSON'); }
  if (![...OPEN, ...PREMIUM].includes(b.action)) return bad('Unknown action');
  if (!enabled) return bad('This is part of Premium. Ask Scope & Lens to switch it on.', 402);
  /* events can also arrive by webhook: if the partner has pushed any, hand them over first */
  if (b.action === 'events') { const s = await store(); const k = 'ampev:' + (u.orgId || u.email); const L = (await s.get(k)) || [];
    if (L.length) { const mine = L.filter(e => !e.user || e.user === u.email); await s.set(k, L.filter(e => e.user && e.user !== u.email)); return json({ events: mine }); } }
  try {
    const r = await fetch(process.env.AMPLIFY_API_URL.replace(/\/$/, '') + '/' + b.action, { method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.AMPLIFY_API_KEY },
      body: JSON.stringify({ ...(b.payload || {}), account: { orgId: u.orgId, orgName: o.name || '', user: u.email, premium: enabled } }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return bad(j.error || 'Amplify could not do that just now', 502);
    return json(j);
  } catch { return bad('Amplify could not be reached', 502); }
};
async function hook(req) {
  const secret = process.env.AMPLIFY_WEBHOOK_SECRET; if (!secret) return bad('Not set up', 501);
  const raw = await req.text(); const sig = req.headers.get('x-amplify-signature') || '';
  const want = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  if (sig.length !== want.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(want))) return bad('Bad signature', 401);
  let b; try { b = JSON.parse(raw); } catch { return bad('Send JSON'); }
  const s = await store(); const evs = Array.isArray(b.events) ? b.events : [b];
  for (const e of evs.slice(0, 500)) { const org = String(e.orgId || ''); if (!org) continue; const k = 'ampev:' + org; const L = (await s.get(k)) || [];
    L.push({ type: String(e.type || ''), company: String(e.company || '').slice(0, 120), person: String(e.person || '').slice(0, 120), at: String(e.at || new Date().toISOString()), user: String(e.user || ''), campaignId: String(e.campaignId || '') }); await s.set(k, L.slice(-2000)); }
  return json({ ok: true });
}
export const config = { path: ['/api/amplify', '/api/amplify-hook'] };
