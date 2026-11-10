// More prospects, shaped by the agency's own preferences ("Who you want").
// POST /api/discover { sectors, size, region, problems, services, exclude: [names] }
//   ->  { companies: [{ name, domain, sector, sub, city, region, size, why }] }
// Claude suggests real UK organisations that fit. Each one's website is then opened to confirm it exists,
// and anything that cannot be confirmed is dropped. No news is invented: these arrive without a news story.
import { json, bad, needUser, limited, claude, claudeText, safeUrl } from './_lib.mjs';
const SECTORS = { retail: 'retail and ecommerce', fmcg: 'food, drink and consumer goods', finance: 'financial services and insurance', travel: 'travel, hospitality and leisure', health: 'health, beauty and wellbeing', tech: 'technology and software', auto: 'automotive and mobility', charity: 'charities and non-profits', b2b: 'B2B and professional services', media: 'media, entertainment and telecoms' };
const SIZE = { L: 'large household names (over 1,000 staff)', M: 'mid-sized brands (roughly 100 to 1,000 staff)', S: 'challenger and scale-up brands (under 100 staff)' };
const REGION = { north: 'the North of England', mide: 'the Midlands', lse: 'London and the South East', swales: 'the South West and Wales', scotni: 'Scotland and Northern Ireland', any: 'anywhere in the UK' };
async function alive(d) { const u = safeUrl(d); if (!u) return false; const c = new AbortController(); const t = setTimeout(() => c.abort(), 3000);
  try { const r = await fetch('https://' + u.hostname, { method: 'GET', signal: c.signal, redirect: 'follow', headers: { 'User-Agent': 'ScopeAndLensPortal/1.0' } }); return r.ok || r.status === 403 || r.status === 401; } catch { return false; } finally { clearTimeout(t); } }
export default async (req) => {
  const u = await needUser(req); if (!u) return bad('Sign in first', 401);
  if (req.method !== 'POST') return bad('Use POST', 405);
  if (!process.env.ANTHROPIC_API_KEY) return bad('Not set up', 501);
  if (await limited('disc:' + u.email, 30, 3600)) return bad('That is a lot of searching. Try again in an hour.', 429);
  const b = await req.json().catch(() => ({}));
  const secs = (b.sectors || []).filter(k => SECTORS[k]); const sizes = (Array.isArray(b.size) ? b.size : [b.size]).filter(k => SIZE[k]);
  const ex = (b.exclude || []).slice(0, 400).map(String);
  const ask = `Suggest 14 real organisations headquartered in the UK that a creative or marketing agency could win as clients.
Sectors: ${secs.length ? secs.map(k => SECTORS[k]).join('; ') : 'any'}.
Size: ${sizes.length ? sizes.map(k => SIZE[k]).join('; ') : 'any size'}.
Based in: ${REGION[b.region] || REGION.any}.
${(b.problems || []).length ? 'The agency solves: ' + b.problems.slice(0, 6).join(', ') + '.' : ''}
Do not include any of these: ${ex.slice(0, 250).join(', ') || 'none'}.
Only include organisations you are confident exist and are UK based. Prefer a mix of well-known and lesser-known names.
Answer with JSON only: an array of objects with name, domain (official website, like example.co.uk), sector (one of ${Object.keys(SECTORS).join(', ')}), sub (what they do, under 6 words), city (UK HQ city), region (one of ${Object.keys(REGION).filter(k => k !== 'any').join(', ')}), size (L, M or S).`;
  let list = [];
  try { const j = await claude({ model: process.env.DIGEST_MODEL || 'claude-haiku-5-5', max_tokens: 1400, messages: [{ role: 'user', content: ask }] }, 8500);
    const t = claudeText(await j.json()); const m = t.match(/\[[\s\S]*\]/); if (m) list = JSON.parse(m[0]); } catch { return bad('Scout could not search just now. Try again in a moment.', 502); }
  const seen = new Set(ex.map(n => n.toLowerCase()));
  list = list.filter(c => c && c.name && c.domain && !seen.has(String(c.name).toLowerCase())).slice(0, 14);
  const ok = await Promise.all(list.map(c => alive(String(c.domain).replace(/^https?:\/\//, '').replace(/\/.*$/, ''))));
  const companies = list.filter((c, i) => ok[i]).map(c => ({ name: String(c.name).slice(0, 80), domain: String(c.domain).replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '').toLowerCase(),
    sector: SECTORS[c.sector] ? c.sector : (secs[0] || 'b2b'), sub: String(c.sub || '').slice(0, 60), city: String(c.city || 'UK').slice(0, 40), region: REGION[c.region] ? c.region : 'any', size: ['L', 'M', 'S'].includes(c.size) ? c.size : 'M' }));
  return json({ companies });
};
export const config = { path: '/api/discover' };
