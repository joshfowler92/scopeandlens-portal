// Pitch intelligence: a licensed data layer, kept apart from everything else so it can be gated, switched off or swapped.
// The data never ships in the portal's page. It lives here, and is only sent to people whose agency has it switched on.
//   GET               { enabled, rows, at, count } for people with access, otherwise { enabled:false, available }
//   POST { rows }     admin: replace the data (rows already parsed in the browser from the export)
//   POST { on }       admin: switch the whole layer on or off for everyone
//   DELETE            admin: remove the data
// Each agency is given access in Manage access (org.intel). Admins always see it.
import { json, bad, needUser, store, getOrgs , isFounder } from './_lib.mjs';
const FIELDS = ['id', 'prob', 'cover', 'country', 'adv', 'parent', 'brands', 'cat', 'holding', 'group', 'network', 'agency', 'last', 'pcover', 'move', 'assign', 'media', 'consult', 's26', 'off26', 'dig26', 'dshare', 's25'];
const tidy = (r) => { const o = {}; FIELDS.forEach(k => { const v = r[k]; if (v == null || v === '') return; o[k] = typeof v === 'number' ? v : String(v).slice(0, 300); }); return o; };
export default async (req) => {
  const u = await needUser(req); if (!u) return bad('Sign in first', 401);
  const s = await store(); const cfg = (await s.get('intel:config')) || { on: false };
  if (req.method === 'GET') {
    const meta = (await s.get('intel:meta')) || null;
    const org = (await getOrgs()).find(o => o.id === u.orgId);
    const access = isFounder(u) || !!(org && org.intel);
    if (!cfg.on || !access || !meta) return json({ enabled: false, available: !!meta, on: !!cfg.on, access, count: meta ? meta.count : 0 });
    return json({ enabled: true, rows: (await s.get('intel:rows')) || [], at: meta.at, count: meta.count, on: true });
  }
  if (!isFounder(u)) return bad('Only Scope & Lens can manage this', 401);
  if (req.method === 'POST') {
    const b = await req.json().catch(() => null); if (!b) return bad('Bad request');
    if ('on' in b) { await s.set('intel:config', { on: !!b.on, at: new Date().toISOString() }); return json({ ok: true, on: !!b.on }); }
    if (!Array.isArray(b.rows) || !b.rows.length) return bad('No rows found in that file');
    const rows = b.rows.slice(0, 5000).map(tidy).filter(r => r.adv);
    await s.set('intel:rows', rows); await s.set('intel:meta', { at: new Date().toISOString(), count: rows.length, by: u.email, name: String(b.name || '').slice(0, 120) });
    return json({ ok: true, count: rows.length });
  }
  if (req.method === 'DELETE') { await s.del('intel:rows'); await s.del('intel:meta'); return json({ ok: true }); }
  return bad('Method not allowed', 405);
};
export const config = { path: '/api/intel' };
