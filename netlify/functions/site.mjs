// Reads an agency's own website so the portal can learn from it, the same way it learns from uploaded files.
// POST /api/site { url }  ->  { url, title, pages: [{ url, title }], text }
// Fetches the home page, then up to six of the agency's own pages that say the most about them:
// about, work and case studies, clients, services, approach, team, awards. Only their own domain is read.
import { json, bad, needUser, safeUrl, fetchText, limited } from './_lib.mjs';
const strip = (h) => String(h || '').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>|<svg[\s\S]*?<\/svg>|<nav[\s\S]*?<\/nav>|<footer[\s\S]*?<\/footer>/gi, ' ')
  .replace(/<\/(p|div|h\d|li|section|header|article|br|tr)>/gi, '\n').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#0?39;|&rsquo;|&lsquo;/g, "'").replace(/&quot;|&ldquo;|&rdquo;/g, '"').replace(/&ndash;|&mdash;/g, ', ').replace(/&pound;/g, '£').replace(/&#\d+;/g, ' ')
  .replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();
const title = (h) => ((h.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || '').replace(/&amp;/g, '&').replace(/&#0?39;|&rsquo;/g, "'").replace(/\s+/g, ' ').trim();
const meta = (h) => ((h.match(/<meta[^>]+(?:name|property)=["'](?:og:)?description["'][^>]*content=["']([^"']*)/i) || [])[1] || '').trim();
const WANT = [[/about|who-we-are|our-story|agency|studio|company/i, 5], [/work|case|portfolio|projects|clients/i, 5], [/services|what-we-do|capabilit|expertise|offer/i, 4], [/approach|process|how-we-work|method|philosophy/i, 4], [/team|people|leadership|founders/i, 3], [/awards|recognition|press|news/i, 2]];
function links(html, base) {
  const out = new Map();
  for (const m of html.matchAll(/<a[^>]+href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    let u; try { u = new URL(m[1], base); } catch { continue; }
    if (u.hostname.replace(/^www\./, '') !== base.hostname.replace(/^www\./, '') || !/^https?:$/.test(u.protocol)) continue;
    if (/\.(pdf|jpe?g|png|gif|svg|webp|mp4|zip)$/i.test(u.pathname) || /\/(wp-|cdn-cgi|feed|tag|category|author|privacy|cookie|terms|login|cart|account)/i.test(u.pathname)) continue;
    u.search = ''; u.hash = ''; const k = u.href.replace(/\/$/, ''); if (k === base.href.replace(/\/$/, '')) continue;
    const label = strip(m[2]).slice(0, 60); const hay = u.pathname + ' ' + label;
    let score = 0; for (const [re, w] of WANT) if (re.test(hay)) score = Math.max(score, w);
    if (u.pathname.split('/').filter(Boolean).length > 2) score -= 1;
    if (score > 0 && (!out.has(k) || out.get(k) < score)) out.set(k, score);
  }
  return [...out.entries()].sort((a, b) => b[1] - a[1]).map(x => x[0]);
}
export default async (req) => {
  const u = await needUser(req); if (!u) return bad('Sign in first', 401);
  if (req.method !== 'POST') return bad('Use POST', 405);
  if (await limited('site:' + u.email, 20, 3600)) return bad('That is a lot of reading. Try again in an hour.', 429);
  const b = await req.json().catch(() => ({}));
  const base = safeUrl(String(b.url || '').trim()); if (!base) return bad('That does not look like a website address');
  const home = await fetchText(base.href, 6000, 900000);
  if (!home) return bad('We could not open ' + base.hostname + '. Check the address, or upload your credentials instead.', 422);
  const root = new URL(home.url || base.href);
  const pick = links(home.html, root).slice(0, 6);
  const pages = [{ url: root.href, title: title(home.html), desc: meta(home.html), text: strip(home.html) }];
  const more = await Promise.all(pick.map(async (p) => { const r = await fetchText(p, 5000, 700000); return r ? { url: p, title: title(r.html), desc: meta(r.html), text: strip(r.html) } : null; }));
  more.filter(Boolean).forEach(p => pages.push(p));
  /* lines that repeat across pages are menus and footers, so drop them */
  const count = new Map(); pages.forEach(p => new Set(p.text.split('\n').map(s => s.trim())).forEach(l => count.set(l, (count.get(l) || 0) + 1)));
  const clean = (t) => t.split('\n').map(s => s.trim()).filter(l => l.length > 2 && !(count.get(l) > 2 && pages.length > 3) && !/^(menu|close|skip to|accept|cookie|©|copyright)/i.test(l)).join('\n');
  let text = ''; for (const p of pages) { const body = clean(p.text); if (!body) continue; text += '\n\n## ' + (p.title || p.url) + '\n' + (p.desc ? p.desc + '\n' : '') + body; if (text.length > 24000) break; }
  text = text.trim().slice(0, 24000);
  if (text.length < 200) return bad('The site did not have much text we could read. It may be built in a way that hides it. Upload your credentials instead.', 422);
  return json({ url: root.href, title: pages[0].title, pages: pages.map(p => ({ url: p.url, title: p.title })), text });
};
export const config = { path: '/api/site' };
