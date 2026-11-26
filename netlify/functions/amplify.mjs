// Amplify: the outreach layer, run by our outreach partner behind the scenes and presented as Amplify.
// Finding brands and the people inside them is open to every agency. Sending, autopilot and tracking are Premium,
// switched on per organisation by Scope & Lens. The browser never talks to the partner directly. See docs/AMPLIFY-INTEGRATION.md.
//   GET  /api/amplify                         { connected, enabled, premium }
//   POST /api/amplify { action, payload }     companies | people | profile (open) · enrich | send | campaign | pause | resume | approve | status | events (Premium)
//   POST /api/amplify-hook                    events from the partner, signed with AMPLIFY_WEBHOOK_SECRET
import crypto from 'node:crypto';
import { json, bad, needUser, getOrgs, store, getUsers , isFounder, validEmail, sendMail } from './_lib.mjs';
const OPEN = ['companies', 'people', 'profile', 'find-people', 'link-account'];
const PREMIUM = ['enrich', 'send', 'campaign', 'pause', 'resume', 'approve', 'status', 'events'];
export default async (req) => {
  const url = new URL(req.url);
  if (url.pathname === '/api/amplify-hook') return hook(req);
  if (url.pathname === '/api/amplify-link') return linkConfirm(url);
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
  /* which Amplify account (and so which connected LinkedIn) to act as. By default the signed-in person.
     The agency profile's sending email can point at another mailbox on the same domain; founders can use any,
     and AMPLIFY_ACCOUNT_EMAIL sets a default for them. */
  const me = String(u.email || '').toLowerCase();
  const want = String((b.payload && b.payload.as) || '').toLowerCase().trim();
  const sameDomain = want.split('@')[1] && want.split('@')[1] === me.split('@')[1];
  const st = await store(); const linked = String((await st.get('ampas:' + me)) || '').toLowerCase();
  if (b.action === 'link-account') return linkStart(u, me, want, st);
  /* a different address needs a one-time confirmation from that inbox, unless it is on the same domain */
  if (want && validEmail(want) && want !== me && !sameDomain && !isFounder(u) && want !== linked) return json({ error: 'Confirm ' + want + ' first. We can send it a one-click link.', code: 'confirm_as', want }, 409);
  const actAs = (want && validEmail(want) && (sameDomain || isFounder(u) || want === linked)) ? want : linked ? linked : String(o.ampAccount || (isFounder(u) && process.env.AMPLIFY_ACCOUNT_EMAIL) || me).toLowerCase();
  if (b.payload) delete b.payload.as;
  try {
    const r = await fetch(process.env.AMPLIFY_API_URL.replace(/\/$/, '') + '/' + b.action, { method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.AMPLIFY_API_KEY },
      body: JSON.stringify({ ...(b.payload || {}), account: { orgId: u.orgId, orgName: o.name || '', user: actAs, email: actAs, portalUser: me, premium: enabled } }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { const msg = String(j.error || j.message || '');
      if (/linkedin/i.test(msg) && /(no|not)\b.*(connect|account)/i.test(msg)) return json({ error: 'Amplify has no LinkedIn account connected for ' + actAs + '. Connect LinkedIn in Amplify while signed in as ' + actAs + ', or set the email the outreach comes from in your agency profile to the address LinkedIn is connected under.', code: 'no_linkedin', actAs }, 409);
      return bad(msg || 'Amplify could not do that just now', 502); }
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
async function linkStart(u, me, want, st) {
  if (!validEmail(want) || want === me) return bad('Give the email your LinkedIn is connected under in Amplify');
  const n = Number((await st.get('amplinkn:' + me)) || 0); if (n > 8) return bad('Too many links sent today. Try again tomorrow.', 429); await st.set('amplinkn:' + me, n + 1);
  const t = crypto.randomBytes(24).toString('hex'); await st.set('amplink:' + t, { me, want, exp: Date.now() + 864e5 });
  const link = 'https://scopeandlens.com/api/amplify-link?t=' + t;
  await sendMail({ to: want, subject: 'Confirm Plato can use this address for Amplify',
    text: me + ' asked for Plato to search and send through the Amplify account for ' + want + ' (the one your LinkedIn is connected under).\n\nIf that was you, confirm here: ' + link + '\n\nIf not, ignore this email and nothing changes. The link works for 24 hours.',
    html: '<p>' + me + ' asked for Plato to search and send through the Amplify account for <b>' + want + '</b>, the one your LinkedIn is connected under.</p><p><a href="' + link + '" style="display:inline-block;padding:10px 18px;background:#2c56ed;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Confirm</a></p><p style="color:#666">If that was not you, ignore this email and nothing changes. The link works for 24 hours.</p>' });
  return json({ ok: true, sent: want });
}
async function linkConfirm(url) {
  const page = (h, b) => new Response('<!doctype html><meta name="viewport" content="width=device-width"><title>Plato</title><body style="font-family:system-ui;max-width:460px;margin:80px auto;padding:0 20px;color:#15151c"><h1 style="font-size:26px">' + h + '</h1><p style="font-size:16px;line-height:1.5">' + b + '</p><p><a href="/portal/app/" style="color:#2c56ed;font-weight:600">Back to Plato</a></p>', { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
  const t = String(url.searchParams.get('t') || ''); if (!/^[a-f0-9]{48}$/.test(t)) return page('That link does not work', 'Ask Plato to send a new one.');
  const st = await store(); const L = await st.get('amplink:' + t);
  if (!L || L.exp < Date.now()) return page('That link has expired', 'Ask Plato to send a new one.');
  await st.set('ampas:' + L.me, L.want); await st.del('amplink:' + t);
  return page('Confirmed.', 'Plato will now search and send through the Amplify account for ' + L.want + '. Go back and press Find decision makers again.');
}
export const config = { path: ['/api/amplify', '/api/amplify-hook', '/api/amplify-link'] };
