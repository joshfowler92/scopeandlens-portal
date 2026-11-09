// Live "why now" news for one brand: leadership changes and marketing moves first.
import { json, bad, needUser } from './_lib.mjs';
const TRADE = /campaignlive|marketingweek|thedrum|prweek|retailgazette|retail-week|thegrocer|lbbonline|marketing-beat|mediaweek|creativebrief|fashionunited|travelweekly|decisionmarketing/i;
const TYPES = [
  ['pitch', /\b(pitch|pitching|review of its|reviews? (its )?(creative|media|pr|digital) (account|agenc)|tender|rfp|request for proposal|seeks? (a |an )?(new )?agency|search for (a |an )?(new )?agency|invites agencies|calls? (a )?(\w+ )?review|kicks? off (a |its )?(\w+ )?review|launch(es)? (a |its )?(\w+ )?review|(creative|media|pr|digital|agency|advertising) review)\b/i],
  ['agency', /\b(agency of record|appoints? .{0,40}agency|names? .{0,40}agency|picks? .{0,40}agency|hires? .{0,40}agency|hands? .{0,40}account|wins? .{0,40}account|account win|lead (creative|media|pr|digital) (agency|partner)|retained (pr|social|creative)|creative partner|media partner)\b/i],
  ['leadership', /\b(appoint|appointed|appoints|hires|hired|names|named|joins as|new (chief|ceo|cmo|marketing)|chief executive|chief marketing|marketing director|steps down|to step down|departs|successor)\b/i],
  ['brand', /\b(campaign|rebrand|brand refresh|agency|creative|advert|ad push|sponsorship|pitch|account)\b/i],
  ['deal', /\b(acquire|acquires|acquired|acquisition|takeover|buys|to buy|merger|sale of|sold to|private equity)\b/i],
  ['launch', /\b(launch|launches|unveils|debuts)\b/i],
  ['expansion', /\b(opens|opening|new stores?|new sites?|expands|expansion)\b/i],
  ['results', /\b(results|profit|revenue|sales (rose|fell|up|down)|trading update|half-year|full-year)\b/i],
  ['restructure', /\b(job cuts|redundanc|restructur|closes|closure|administration|cva)\b/i]
];
const RANK = { pitch: 0, agency: 1, leadership: 2, brand: 3, deal: 4, launch: 5, expansion: 6, results: 7, restructure: 8, company: 9 };
const unx = (s) => String(s || '').replace(/<!\[CDATA\[|\]\]>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
const tag = (x, t) => { const m = x.match(new RegExp('<' + t + '[^>]*>([\\s\\S]*?)</' + t + '>')); return m ? unx(m[1]) : ''; };
export function parse(xml, company, max) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => {
    const x = m[1]; const title = tag(x, 'title'); const source = tag(x, 'source'); const link = tag(x, 'link'); const d = new Date(tag(x, 'pubDate'));
    const clean = source && title.endsWith(' - ' + source) ? title.slice(0, -(source.length + 3)) : title;
    const type = (TYPES.find(([, re]) => re.test(clean)) || ['company'])[0];
    return { title: clean, text: clean, link, src: link, source, pub: source, date: isNaN(d) ? '' : d.toISOString(), type, trade: TRADE.test(link + ' ' + source) };
  });
  const key = company ? company.toLowerCase().split(/[\s(]/)[0] : '';
  return items.filter((i) => !key || i.title.toLowerCase().includes(key))
    .sort((a, b) => (RANK[a.type] - RANK[b.type]) || ((b.trade ? 1 : 0) - (a.trade ? 1 : 0)) || b.date.localeCompare(a.date))
    .slice(0, max || 10);
}
export default async (req) => {
  if (!(await needUser(req))) return bad('Sign in first', 401);
  const u = new URL(req.url); const company = (u.searchParams.get('company') || '').trim(); const feed = u.searchParams.get('feed');
  if (!company && feed !== 'moves') return bad('Which company?');
  /* one brand: agency moves, pitches, new marketing leaders and campaigns first. feed=moves: the whole UK market's agency moves this month */
  const q = feed === 'moves'
    ? '("appoints" agency OR "agency of record" OR "account win" OR "wins account" OR "pitch" agency OR "creative account" OR "media account" OR "calls review") (UK OR London OR British) when:30d'
    : '"' + company.replace(/\s*\(.*\)/, '') + '" (agency OR pitch OR review OR account OR appoints OR appointed OR "chief marketing officer" OR CMO OR "marketing director" OR "head of marketing" OR "brand director" OR campaign OR advert OR rebrand OR launch OR "chief executive" OR acquisition OR results) when:180d';
  const url = (process.env.NEWS_RSS_BASE || 'https://news.google.com/rss/search') + '?q=' + encodeURIComponent(q) + '&hl=en-GB&gl=GB&ceid=GB:en';
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ScopeLensPortal/1.0)' } });
    if (!r.ok) return bad('News source unavailable', 502);
    return json({ items: parse(await r.text(), company, feed === 'moves' ? 30 : 10) }, 200, { 'Cache-Control': 'private, max-age=21600' });
  } catch (e) { return bad('News source unavailable', 502); }
};
export const config = { path: '/api/news' };
