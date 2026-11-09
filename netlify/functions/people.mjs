// Decision makers at a brand, from a licensed people-data provider (Apollo). Never scraped from LinkedIn.
import { json, bad, needUser } from './_lib.mjs';
export function shape(data) {
  const list = (data && (data.people || data.contacts)) || [];
  return list.map((p) => {
    if (!p.last_name && p.last_name_obfuscated) return { name: '' };
    const name = (p.name || [p.first_name, p.last_name].filter(Boolean).join(' ')).trim();
    return { name, title: p.title || '', linkedin: p.linkedin_url || '', seniority: p.seniority || '' };
  }).filter((p) => p.name && p.name.includes(' ') && !p.name.includes('*') && p.title);
}
export default async (req) => {
  if (!(await needUser(req))) return bad('Sign in first', 401);
  const key = process.env.APOLLO_API_KEY;
  if (!key) return bad('People data is not switched on yet', 501);
  const u = new URL(req.url);
  const domain = (u.searchParams.get('domain') || '').trim();
  const company = (u.searchParams.get('company') || '').trim();
  const titles = (u.searchParams.get('titles') || '').split('|').map((s) => s.trim()).filter(Boolean).slice(0, 10);
  if (!domain && !company) return bad('Which company?');
  const body = { page: 1, per_page: 12, person_titles: titles, person_seniorities: ['c_suite', 'vp', 'head', 'director', 'owner', 'founder'] };
  if (domain) body.q_organization_domains_list = [domain]; else body.q_organization_name = company;
  try {
    const r = await fetch(process.env.APOLLO_SEARCH_URL || 'https://api.apollo.io/api/v1/mixed_people/search', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', 'X-Api-Key': key }, body: JSON.stringify(body)
    });
    if (!r.ok) return bad('People data returned ' + r.status, 502);
    return json({ people: shape(await r.json()) });
  } catch (e) { return bad('People data unavailable', 502); }
};
export const config = { path: '/api/people' };
