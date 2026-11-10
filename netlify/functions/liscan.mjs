// LinkedIn profile scan, in two quick steps so each fits inside a Netlify function.
//   POST /api/liscan { step:'read', url, text }    -> { profile, source }
//   POST /api/liscan { step:'score', profile, target, agency, offer, gift } -> { result:{ score, sugg } }
// Reading a profile, in order:
//   1. The public profile page itself. LinkedIn often serves a public version with structured data (name, headline, roles, about).
//   2. Amplify (the outreach partner), when connected, then Apollo, when APOLLO_API_KEY is set.
//   3. With ANTHROPIC_API_KEY, a web search for that exact profile, which returns what LinkedIn shows publicly.
//   4. Whatever the person pasted in, or read from LinkedIn's own Save to PDF. This is the most complete.
// Nothing is invented: every field comes from one of these, and the source is shown to the person.
import { json, bad, needUser, limited, claude, claudeText, getOrgs, isFounder } from './_lib.mjs';
const S = (v, n = 400) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, n);
const dec = (s) => String(s || '').replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
function slugOf(url) { return (String(url).match(/linkedin\.com\/in\/([^/?#]+)/i) || [])[1] || ''; }

/* 1. the public page */
async function publicPage(url, signal) {
  try {
    const r = await fetch(url, { signal, redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36', Accept: 'text/html', 'Accept-Language': 'en-GB,en;q=0.9' } });
    if (!r.ok) return null; const h = (await r.text()).slice(0, 1500000);
    if (/authwall|login-wall|uas\/login/i.test(r.url)) return null;
    const p = { name: '', headline: '', location: '', about: '', experience: [], education: [], photoUrl: '', followers: '' };
    for (const m of h.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
      let d; try { d = JSON.parse(m[1]); } catch { continue; }
      const all = [].concat(d['@graph'] || d); const per = all.find(x => x && x['@type'] === 'Person'); if (!per) continue;
      p.name = S(per.name, 120); p.headline = S([].concat(per.jobTitle || [])[0] || '', 220); p.about = S(dec(per.description), 2600);
      p.location = S(per.address && (per.address.addressLocality || per.address.addressRegion) || '', 80);
      p.experience = [].concat(per.worksFor || []).slice(0, 6).map(w => S([w.member && w.member.description || '', w.name].filter(Boolean).join(' at '), 140)).filter(Boolean);
      p.education = [].concat(per.alumniOf || []).slice(0, 3).map(e => S(e.name, 120)).filter(Boolean);
      p.photoUrl = S(per.image && (per.image.contentUrl || per.image) || '', 600);
      const fo = [].concat(per.interactionStatistic || []).find(x => /Follow/i.test(x && x.interactionType || '')); if (fo) p.followers = String(fo.userInteractionCount || '');
    }
    const og = (k) => dec((h.match(new RegExp('<meta[^>]+property=["\']og:' + k + '["\'][^>]*content=["\']([^"\']*)', 'i')) || [])[1] || '');
    if (!p.name) { const t = og('title').replace(/\s*\|\s*LinkedIn.*$/i, ''); const [n, ...rest] = t.split(' - '); p.name = S(n, 120); if (!p.headline) p.headline = S(rest.join(' - '), 220); }
    if (!p.about) p.about = S(og('description').replace(/\s*View .{0,80}profile on LinkedIn.*$/i, ''), 1200);
    if (!p.photoUrl) p.photoUrl = S(og('image'), 600);
    return p.name && (p.headline || p.about) ? p : null;
  } catch { return null; }
}
/* 2. the outreach partner, then Apollo */
async function amplifyProfile(url) {
  if (!(process.env.AMPLIFY_API_URL && process.env.AMPLIFY_API_KEY)) return null;
  try { const r = await fetch(process.env.AMPLIFY_API_URL.replace(/\/$/, '') + '/profile', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.AMPLIFY_API_KEY }, body: JSON.stringify({ linkedin: url }) });
    if (!r.ok) return null; const j = await r.json(); return j && (j.profile || j); } catch { return null; }
}
async function apolloProfile(url) {
  if (!process.env.APOLLO_API_KEY) return null;
  try { const r = await fetch('https://api.apollo.io/api/v1/people/match', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', 'X-Api-Key': process.env.APOLLO_API_KEY }, body: JSON.stringify({ linkedin_url: url }) });
    if (!r.ok) return null; const p = (await r.json()).person; if (!p) return null;
    return { name: p.name || '', headline: p.headline || p.title || '', location: [p.city, p.country].filter(Boolean).join(', '), experience: (p.employment_history || []).slice(0, 5).map(e => [e.title, e.organization_name].filter(Boolean).join(' at ')), photoUrl: p.photo_url || '' }; } catch { return null; }
}
/* 3. a web search for this exact profile */
async function searched(url) {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  const prompt = `Find the public LinkedIn profile at ${url} using web search. Search for the exact URL or the profile slug "${slugOf(url)}".
Return only JSON: {"found":true|false,"name":"","headline":"","location":"","about":"","experience":["title at company"],"education":["school"],"followers":""}
Rules: only include what you actually saw for this exact profile in the search results. Never guess or fill gaps. If the results are about a different person, return {"found":false}. British English, no em dashes.`;
  try {
    const r = await claude({ model: process.env.LISCAN_MODEL || 'claude-haiku-5-5', max_tokens: 700, tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 2 }], messages: [{ role: 'user', content: prompt }] }, 9200);
    if (!r.ok) return null; const t = claudeText(await r.json()); const m = t.match(/\{[\s\S]*\}/); if (!m) return null;
    const p = JSON.parse(m[0]); if (!p.found || !p.name) return null;
    return { name: S(p.name, 120), headline: S(p.headline, 220), location: S(p.location, 80), about: S(p.about, 1500), experience: (p.experience || []).slice(0, 6).map(x => S(x, 140)), education: (p.education || []).slice(0, 3).map(x => S(x, 120)), followers: S(p.followers, 20) };
  } catch { return null; }
}
/* 4. LinkedIn's Save to PDF, or pasted text: headline first, then About, Experience and Education */
function fromText(text) {
  const t = String(text || '').replace(/\r/g, ''); const lines = t.split('\n').map(s => s.trim()).filter(Boolean); if (!lines.length) return null;
  const sec = (name, stop) => { const i = lines.findIndex(l => new RegExp('^' + name + '$', 'i').test(l)); if (i < 0) return []; const out = []; for (let k = i + 1; k < lines.length; k++) { if (stop.test(lines[k])) break; out.push(lines[k]); } return out; };
  const STOP = /^(Summary|About|Experience|Education|Top Skills|Skills|Languages|Certifications|Honors-Awards|Publications|Contact|Page \d+ of \d+)$/i;
  const about = (sec('Summary', STOP).length ? sec('Summary', STOP) : sec('About', STOP)).join(' ');
  const exp = sec('Experience', STOP).filter(l => !/^\w+ \d{4}|^\d{4}|year|month|Present/i.test(l)).slice(0, 8);
  const head = lines.filter(l => !STOP.test(l) && !/@|www\.|linkedin\.com|^Contact|\(LinkedIn\)|^Page \d/i.test(l));
  return { name: S(head[0], 120), headline: S(head[1] || head[0], 220), location: S(head.slice(1, 6).find(l => /United Kingdom|England|Scotland|Wales|Ireland|London|Manchester|Bristol|Leeds|Area$/i.test(l) && l.length < 60) || '', 80), about: S(about || head.slice(2, 8).join(' '), 2600), experience: exp.map(x => S(x, 140)) };
}
export default async (req) => {
  const u = await needUser(req); if (!u) return bad('Sign in first', 401);
  if (req.method !== 'POST') return bad('Use POST', 405);
  const b = await req.json().catch(() => ({}));
  const url = /linkedin\.com\/in\//i.test(String(b.url || '')) ? ('https://www.' + String(b.url).replace(/^https?:\/\//i, '').replace(/^www\./i, '').split(/[?#]/)[0]).replace(/\/$/, '').slice(0, 200) : '';
  if ((b.step || 'read') === 'read') {
    if (await limited('liscan:' + u.email, 15, 3600)) return bad('That is a lot of scans. Try again in an hour.', 429);
    const text = String(b.text || '').slice(0, 12000);
    let profile = null, source = '';
    if (url) {
      const c = new AbortController(); const stop = setTimeout(() => c.abort(), 3500);
      const searching = searched(url); /* runs alongside, in case the page is closed to us */
      profile = await publicPage(url, c.signal); clearTimeout(stop); if (profile) source = 'your public LinkedIn profile';
      if (!profile && (isFounder(u) || ((await getOrgs()).find(o => o.id === u.orgId) || {}).premium)) { profile = await amplifyProfile(url); if (profile) source = 'Amplify'; }
      if (!profile) { profile = await apolloProfile(url); if (profile) source = 'public professional data'; }
      if (!profile) { profile = await searching; if (profile) source = 'what LinkedIn shows publicly'; }
    }
    if (text) { const t = fromText(text); if (t) { profile = Object.assign({}, profile || {}, Object.fromEntries(Object.entries(t).filter(([, v]) => v && (!Array.isArray(v) || v.length)))); source = source ? source + ', plus your PDF or text' : 'your PDF or text'; } }
    if (profile) profile.url = url;
    return json({ profile, source });
  }
  /* score */
  const P = b.profile || null; if (!P) return bad('Read the profile first');
  if (!process.env.ANTHROPIC_API_KEY) return json({});
  const T = b.target || {};
  const prompt = `You review a LinkedIn profile for an agency person who is about to connect with ${(T.roles || []).slice(0, 3).join(', ') || 'marketing leaders'} at ${(T.sectors || []).slice(0, 3).join(', ') || 'their target'} brands, about this problem: ${T.problem || 'growth'}.
Score how ready the profile is for those people to accept a connection request with no note, from 0 to 100. Then give 3 to 5 specific changes, most important first.
Rules: British English, no em dashes. Refer to what is actually in this profile (quote their current headline or About where useful). Never invent results or clients. Where useful, include a ready-to-paste line in "copy" built only from the profile and agency details.
Return only JSON: {"score": number, "sugg": [{"t": short instruction, "d": one sentence why, "copy": optional line to paste}]}
Agency: ${S(b.agency, 100)}. What they do best: ${S((b.offer || {}).uvp, 300)}. Proof: ${S((b.offer || {}).proof, 300)}. Their gift: ${S(b.gift, 100)}.
Profile: ${JSON.stringify(P).slice(0, 6000)}`;
  try {
    const r = await claude({ max_tokens: 900, messages: [{ role: 'user', content: prompt }] }, 9300);
    const t = claudeText(await r.json()); const m = t.match(/\{[\s\S]*\}/); const res = m ? JSON.parse(m[0]) : null;
    if (!res || !Array.isArray(res.sugg)) return json({});
    const clean = (s) => String(s || '').replace(/—/g, ',').slice(0, 280);
    return json({ result: { score: Math.max(0, Math.min(100, Math.round(+res.score || 0))), sugg: res.sugg.slice(0, 5).map(x => ({ k: 'ai', t: clean(x.t), d: clean(x.d), copy: clean(x.copy), done: false })) } });
  } catch { return json({}); }
};
export const config = { path: '/api/liscan' };
