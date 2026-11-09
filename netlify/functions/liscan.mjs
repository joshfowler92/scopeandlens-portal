// LinkedIn profile scan. LinkedIn does not let other sites read profiles directly, so the profile comes from, in order:
//   1. Amplify (the outreach partner), when connected: POST {AMPLIFY_API_URL}/profile { linkedin }
//   2. Apollo people match, when APOLLO_API_KEY is set: name, headline, title and work history
//   3. Whatever the person pasted in, or read from LinkedIn's own Save to PDF
// With ANTHROPIC_API_KEY set, Claude scores it against the people they are targeting and suggests 3 to 5 changes.
// POST /api/liscan { url, text, target:{roles,sectors,problem,sec}, agency, offer, gift }
import { json, bad, needUser, limited } from './_lib.mjs';
async function amplifyProfile(url) {
  if (!(process.env.AMPLIFY_API_URL && process.env.AMPLIFY_API_KEY)) return null;
  try { const r = await fetch(process.env.AMPLIFY_API_URL.replace(/\/$/, '') + '/profile', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.AMPLIFY_API_KEY }, body: JSON.stringify({ linkedin: url }) });
    if (!r.ok) return null; const j = await r.json(); return j && (j.profile || j); } catch { return null; }
}
async function apolloProfile(url) {
  if (!process.env.APOLLO_API_KEY) return null;
  try { const r = await fetch('https://api.apollo.io/api/v1/people/match', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', 'X-Api-Key': process.env.APOLLO_API_KEY }, body: JSON.stringify({ linkedin_url: url }) });
    if (!r.ok) return null; const p = (await r.json()).person; if (!p) return null;
    return { name: p.name || '', headline: p.headline || p.title || '', title: p.title || '', experience: (p.employment_history || []).slice(0, 5).map(e => [e.title, e.organization_name].filter(Boolean).join(' at ')), photo: !!p.photo_url }; } catch { return null; }
}
export default async (req) => {
  const u = await needUser(req); if (!u) return bad('Sign in first', 401);
  if (req.method !== 'POST') return bad('Use POST', 405);
  if (await limited('liscan:' + u.email, 12, 3600)) return bad('That is a lot of scans. Try again in an hour.', 429);
  const b = await req.json().catch(() => ({}));
  const url = /linkedin\.com\/in\//i.test(String(b.url || '')) ? ('https://' + String(b.url).replace(/^https?:\/\//i, '').split('?')[0]).slice(0, 200) : '';
  const text = String(b.text || '').slice(0, 8000);
  let profile = null, source = '';
  if (url) { profile = await amplifyProfile(url); if (profile) source = 'Amplify'; }
  if (url && !profile) { profile = await apolloProfile(url); if (profile) source = 'public professional data'; }
  if (text) { const lines = text.split('\n').map(s => s.trim()).filter(Boolean); profile = Object.assign({ headline: lines[0] || '', about: lines.slice(1).join(' ') }, profile || {}, { about: (profile && profile.about) || lines.slice(1).join(' ') }); source = source ? source + ' and what you pasted' : 'what you pasted'; }
  if (!process.env.ANTHROPIC_API_KEY || !profile) return json({ profile, source });
  const T = b.target || {};
  const prompt = `You review a LinkedIn profile for an agency person who is about to connect with ${(T.roles || []).slice(0, 3).join(', ') || 'marketing leaders'} at ${(T.sectors || []).slice(0, 3).join(', ') || 'their target'} brands, about this problem: ${T.problem || 'growth'}.
Score how ready the profile is for those people to accept a connection request with no note, from 0 to 100. Then give 3 to 5 specific changes, most important first.
Rules: British English, no em dashes, only use what is in the profile and the agency details, never invent results or clients. Where useful, include a ready-to-paste line in "copy".
Return only JSON: {"score": number, "sugg": [{"t": short instruction, "d": one sentence why, "copy": optional line to paste}]}
Agency: ${String(b.agency || '').slice(0, 100)}. What they do best: ${String((b.offer || {}).uvp || '').slice(0, 300)}. Proof: ${String((b.offer || {}).proof || '').slice(0, 300)}. Their gift: ${String(b.gift || '').slice(0, 100)}.
Profile: ${JSON.stringify(profile).slice(0, 6000)}`;
  try {
    const r = await fetch(process.env.ANTHROPIC_URL || 'https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5', max_tokens: 900, messages: [{ role: 'user', content: prompt }] }) });
    const j = await r.json(); const t = (j.content || []).map(c => c.text || '').join(''); const m = t.match(/\{[\s\S]*\}/); const res = m ? JSON.parse(m[0]) : null;
    if (!res || !Array.isArray(res.sugg)) return json({ profile, source });
    const clean = (s) => String(s || '').replace(/—/g, ',').slice(0, 280);
    return json({ profile, source, result: { score: Math.max(0, Math.min(100, Math.round(+res.score || 0))), sugg: res.sugg.slice(0, 5).map(x => ({ k: 'ai', t: clean(x.t), d: clean(x.d), copy: clean(x.copy), done: false })) } });
  } catch { return json({ profile, source }); }
};
export const config = { path: '/api/liscan' };
