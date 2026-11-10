// Finds the official website of each organisation so every tile can show its real logo.
// POST /api/domain { names: [..] }  ->  { domains: { name: 'example.co.uk' | '' } }
// 1. Cached answers first (shared by everyone, so a brand is only looked up once).
// 2. Claude suggests the official domain for the rest, in one short call.
// 3. Every suggestion is checked by opening the site and looking for the name on the page. Only checked domains are kept.
import { json, bad, needUser, limited, store, claude, claudeText, safeUrl } from './_lib.mjs';
const norm = (s) => String(s || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim();
const key = (n) => 'dom:' + norm(n).replace(/ /g, '-').slice(0, 80);
async function check(name, d) {
  const u = safeUrl(d); if (!u) return false;
  const c = new AbortController(); const t = setTimeout(() => c.abort(), 3500);
  try {
    const r = await fetch('https://' + u.hostname, { signal: c.signal, redirect: 'follow', headers: { 'User-Agent': 'ScopeAndLensPortal/1.0 (+https://www.scopeandlens.com)', Accept: 'text/html' } });
    if (!r.ok && r.status !== 403) return false; if (r.status === 403) return true; /* some big sites refuse robots but are real */
    const h = (await r.text()).slice(0, 200000).toLowerCase().replace(/&amp;/g, '&');
    const words = norm(name).split(' ').filter(w => w.length > 2 && !['the', 'and', 'plc', 'ltd', 'group', 'limited', 'company', 'holdings', 'uk'].includes(w));
    return !words.length || words.some(w => h.includes(w));
  } catch { return false; } finally { clearTimeout(t); }
}
export default async (req) => {
  const u = await needUser(req); if (!u) return bad('Sign in first', 401);
  if (req.method !== 'POST') return bad('Use POST', 405);
  if (await limited('dom:' + u.email, 60, 3600)) return bad('Too many lookups. Try again later.', 429);
  const b = await req.json().catch(() => ({}));
  const names = [...new Set((b.names || []).map(n => String(n || '').trim().slice(0, 80)).filter(Boolean))].slice(0, 30);
  if (!names.length) return json({ domains: {} });
  const s = await store(); const out = {}; const todo = [];
  await Promise.all(names.map(async n => { const c = await s.get(key(n)); if (c && 'd' in c) out[n] = c.d; else todo.push(n); }));
  if (todo.length && process.env.ANTHROPIC_API_KEY) {
    let guess = {};
    try {
      const j = await claude({ model: process.env.DIGEST_MODEL || 'claude-haiku-5-5', max_tokens: 900,
        messages: [{ role: 'user', content: 'For each UK organisation below, give the official website domain only (for example tesco.com). If you are not sure an organisation is real or you do not know its site, give an empty string. Answer with JSON only, an object of name to domain.\n\n' + todo.join('\n') }] }, 6000);
      const t = claudeText(await j.json()); const m = t.match(/\{[\s\S]*\}/); if (m) guess = JSON.parse(m[0]);
    } catch {}
    await Promise.all(todo.map(async n => {
      let d = String(guess[n] || '').toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '').trim();
      if (d && !(await check(n, d))) d = '';
      out[n] = d; await s.set(key(n), { d, at: new Date().toISOString() });
    }));
  }
  return json({ domains: out });
};
export const config = { path: '/api/domain' };
