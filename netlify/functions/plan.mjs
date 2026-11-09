// Dot reads the agency's world before they lift a finger.
// POST { url, agency, profile, offer, library: [{name, text}], ai }
//  1. Fetches the agency's own website (home page, plus an about page if there is one) on the server
//  2. With ANTHROPIC_API_KEY set and ai true, asks Claude for a growth plan using the portal's own vocabulary
// Returns { site: { title, text }, plan } where plan is null without AI. The browser builds its own plan from the text either way.
// Only what the agency has said about itself is used. Nothing is invented.
import { json, bad, needUser } from './_lib.mjs';
const SECTORS = ['retail', 'fmcg', 'finance', 'travel', 'health', 'tech', 'auto', 'charity', 'b2b', 'media'];
const ROLES = ['cmo', 'brand', 'growth', 'ecom', 'insight', 'comms', 'founder', 'procure'];
const PROBLEMS = ['standout', 'dated', 'relevant', 'reposition', 'purpose', 'portfolio', 'price', 'customer', 'newaud', 'retain', 'loyalty', 'launch', 'expand', 'working', 'roi', 'media', 'cac', 'convert', 'search', 'b2bpipe', 'slow', 'content', 'stretched', 'data', 'joined', 'story', 'reputation', 'sustain', 'talent'];
const TRIGGERS = ['agency', 'pitch', 'leadership', 'results', 'expansion', 'launch', 'deal', 'restructure', 'brand', 'digital', 'sustainability', 'regulation'];
const CHANNELS = ['linkedin', 'email', 'event', 'workshop', 'phone', 'mail', 'social'];
const text = (h) => String(h || '').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>|<svg[\s\S]*?<\/svg>/gi, ' ')
  .replace(/<\/(p|div|h\d|li|section|header|footer|br)>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"')
  .replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();
async function grab(u) {
  const c = new AbortController(); const t = setTimeout(() => c.abort(), 8000);
  try {
    const r = await fetch(u, { signal: c.signal, redirect: 'follow', headers: { 'User-Agent': 'ScopeAndLensPortal/1.0 (+https://www.scopeandlens.com)', Accept: 'text/html' } });
    if (!r.ok || !/html/i.test(r.headers.get('content-type') || '')) return null;
    const h = (await r.text()).slice(0, 600000);
    const title = (h.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || '';
    const desc = (h.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i) || [])[1] || '';
    const about = (h.match(/href=["']([^"']*(about|who-we-are|our-story|agency)[^"']*)["']/i) || [])[1] || '';
    return { title: title.trim(), desc: desc.trim(), body: text(h).slice(0, 14000), about };
  } catch { return null; } finally { clearTimeout(t); }
}
function safeUrl(u) {
  try { const x = new URL(/^https?:\/\//i.test(u) ? u : 'https://' + u); if (!/^https?:$/.test(x.protocol)) return null;
    if (/^(localhost|127\.|10\.|192\.168\.|169\.254\.|0\.|\[)/i.test(x.hostname) || !x.hostname.includes('.')) return null; return x; } catch { return null; }
}
export default async (req) => {
  if (!(await needUser(req))) return bad('Sign in first', 401);
  if (req.method !== 'POST') return bad('Use POST', 405);
  let b; try { b = await req.json(); } catch { return bad('Bad request'); }
  let site = null;
  const u = b.url ? safeUrl(String(b.url)) : null;
  if (u) {
    const home = await grab(u.href);
    if (home) {
      let more = '';
      if (home.about) { const a = safeUrl(new URL(home.about, u.href).href); if (a && a.hostname === u.hostname) { const p = await grab(a.href); if (p) more = p.body.slice(0, 6000); } }
      site = { title: home.title, desc: home.desc, text: (home.desc + '\n' + home.body + '\n' + more).slice(0, 18000) };
    }
  }
  let plan = null;
  if (b.ai && process.env.ANTHROPIC_API_KEY) {
    const lib = (b.library || []).slice(0, 8).map((d, i) => `--- ${String(d.name || 'Document ' + (i + 1)).slice(0, 80)} ---\n${String(d.text || '').slice(0, 5000)}`).join('\n\n');
    const prompt = `You are Dot, the growth lead inside a new business portal for a UK agency${b.agency ? ' called ' + b.agency : ''}.
Read what they say about themselves and propose a growth plan built on giving something useful before asking for anything.

Rules:
- Only use what is in their materials and profile. Never invent clients, results or numbers.
- British English, relaxed but authoritative, short sentences, no em dashes, no hype.
- Use only the keys listed below.

Return only JSON:
{"sectors":[up to 3 of ${JSON.stringify(SECTORS)}],
 "size":"S" or "M" or "L",
 "roles":[up to 3 of ${JSON.stringify(ROLES)}],
 "problems":[up to 2 of ${JSON.stringify(PROBLEMS)}],
 "triggers":[up to 4 objects {"k": one of ${JSON.stringify(TRIGGERS)}, "why": one sentence on why this gives them the right to reach out}],
 "channels":[subset of ${JSON.stringify(CHANNELS)}],
 "angles":[3 objects {"t": a short name for the angle, "d": one sentence on what they lead with}],
 "why":"two sentences on why this is the right place for them to start, referring to what they actually said"}

Their profile: ${JSON.stringify(b.profile || {}).slice(0, 2000)}
In their words: ${JSON.stringify(b.offer || {}).slice(0, 2000)}
Their website: ${site ? site.text.slice(0, 9000) : '(not available)'}
Their library:
${lib || '(empty)'}`;
    try {
      const r = await fetch(process.env.ANTHROPIC_URL || 'https://api.anthropic.com/v1/messages', {
        method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5', max_tokens: 1600, messages: [{ role: 'user', content: prompt }] })
      });
      const j = await r.json(); const t = (j.content || []).map(c => c.text || '').join('');
      const m = t.match(/\{[\s\S]*\}/); if (m) plan = JSON.parse(m[0]);
      if (plan) {
        const keep = (a, ok, n) => (Array.isArray(a) ? a : []).filter(x => ok.includes(x)).slice(0, n);
        plan = { sectors: keep(plan.sectors, SECTORS, 3), size: ['S', 'M', 'L'].includes(plan.size) ? plan.size : 'M', roles: keep(plan.roles, ROLES, 3), problems: keep(plan.problems, PROBLEMS, 2),
          triggers: (plan.triggers || []).filter(x => x && TRIGGERS.includes(x.k)).slice(0, 4).map(x => ({ k: x.k, why: String(x.why || '').replace(/\u2014/g, ',').slice(0, 220) })),
          channels: keep(plan.channels, CHANNELS, 7), angles: (plan.angles || []).slice(0, 3).map(x => ({ t: String(x.t || '').slice(0, 60), d: String(x.d || '').replace(/\u2014/g, ',').slice(0, 220) })), why: String(plan.why || '').replace(/\u2014/g, ',').slice(0, 400) };
      }
    } catch { plan = null; }
  }
  return json({ site, plan });
};
export const config = { path: '/api/plan' };
