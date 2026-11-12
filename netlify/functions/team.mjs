// The team side of the portal: the shared agency profile, each person's workspace, shared campaigns and notifications.
import { json, bad, needUser, store, getUsers, getOrgs, publicUser, note, sendMail, siteUrl, nice } from './_lib.mjs';

async function body(req) { try { return await req.json(); } catch { return {}; } }
const LIMIT = 4.5 * 1024 * 1024;

export default async (req) => {
  const u = await needUser(req); if (!u) return bad('Sign in first', 401);
  const s = await store(); const url = new URL(req.url); const path = url.pathname.replace(/\/$/, '');
  const org = (u.role === 'admin' && url.searchParams.get('org')) || u.orgId;
  if (!org) return bad('You are not part of an organisation yet', 400);
  const now = new Date().toISOString();

  /* the agency profile, shared by everyone in the organisation */
  if (path === '/api/org') {
    if (req.method === 'GET') { const o = (await getOrgs()).find(x => x.id === org); return json({ org: o || { id: org }, profile: await s.get('org:' + org) }); }
    const b = await body(req); if (JSON.stringify(b).length > LIMIT) return bad('That is too big to save', 413);
    await s.set('org:' + org, { ...b.profile, updated: now, by: u.email }); return json({ ok: true, updated: now });
  }

  /* each person's own workspace, so it follows them between devices, plus the summary the team view reads */
  if (path === '/api/state') {
    if (req.method === 'GET') return json({ state: await s.get('state:' + u.email) });
    const raw = await req.text(); if (raw.length > LIMIT) return bad('Your workspace is too big to sync. Remove some library files.', 413);
    let b; try { b = JSON.parse(raw); } catch { return bad('Send JSON'); }
    if (b.state) await s.set('state:' + u.email, b.state);
    if (b.summary) await s.set('sum:' + org + ':' + u.email, { ...b.summary, email: u.email, name: u.name, updated: now });
    return json({ ok: true, updated: now });
  }

  /* a profile photo, shown top right and to the rest of the team */
  if (path === '/api/photo') {
    if (req.method === 'GET') { const who = url.searchParams.get('email') || u.email; const p = await s.get('photo:' + who); return json({ photo: p ? p.img : '' }); }
    const b = await body(req); const img = String(b.photo || '');
    if (img && (!/^data:image\/(jpeg|png|webp);base64,/.test(img) || img.length > 400000)) return bad('Use a JPG or PNG under 300KB', 413);
    if (img) await s.set('photo:' + u.email, { img, updated: now }); else await s.del('photo:' + u.email);
    return json({ ok: true });
  }
  /* everyone in the organisation, and what they are up to */
  if (path === '/api/team') {
    const users = (await getUsers()).filter(x => x.orgId === org && x.status !== 'removed');
    const members = await Promise.all(users.map(async x => ({ ...publicUser(x), photo: ((await s.get('photo:' + x.email)) || {}).img || '', summary: await s.get('sum:' + org + ':' + x.email) })));
    const out = { org: (await getOrgs()).find(x => x.id === org) || { id: org }, members };
    if (u.role === 'admin') out.orgs = await getOrgs();
    return json(out);
  }

  /* campaigns shared with the team */
  if (path === '/api/campaigns') {
    const keys = await s.list('camp:' + org + ':');
    const all = (await Promise.all(keys.map(k => s.get(k)))).filter(Boolean);
    return json({ campaigns: all.filter(c => c.owner === u.email || (c.members || []).includes(u.email) || u.role === 'admin' || u.role === 'lead') });
  }
  if (path === '/api/campaign') {
    const b = await body(req); const c = b.campaign; if (!c || !c.id) return bad('Which campaign?');
    if (JSON.stringify(c).length > LIMIT) return bad('That campaign is too big to share', 413);
    const k = 'camp:' + org + ':' + c.id; const old = await s.get(k);
    if (old && old.owner !== u.email && !(old.members || []).includes(u.email) && u.role !== 'admin' && u.role !== 'lead') return bad('Not your campaign', 403);
    const team = (await getUsers()).filter(x => x.orgId === org && x.status !== 'removed').map(x => x.email);
    const members = [...new Set((c.members || []).filter(e => team.includes(e)))];
    const before = new Set((old && old.members) || []); const added = members.filter(e => !before.has(e) && e !== u.email);
    const saved = { ...c, owner: (old && old.owner) || u.email, ownerName: (old && old.ownerName) || u.name, members, updated: now, updatedBy: u.email };
    await s.set(k, saved);
    for (const e of added) {
      const mine = Object.entries(c.assign || {}).filter(([, v]) => v === e).length;
      await note(e, { kind: 'campaign', campaignId: c.id, title: u.name + ' added you to ' + c.name, body: mine ? 'You are reaching out to ' + mine + ' brand' + (mine === 1 ? '' : 's') + '.' : 'Open it to see the plan and who is reaching out to who.' });
      await sendMail({ to: e, subject: u.name + ' added you to a campaign: ' + c.name, text: `Hi ${nice(e)},\n\n${u.name} has added you to "${c.name}" in Plato.${mine ? '\n\nYou are reaching out to ' + mine + ' brand' + (mine === 1 ? '' : 's') + '.' : ''}\n\nSee the plan here: ${siteUrl()}/portal/app/#launch` });
    }
    return json({ ok: true, campaign: saved, notified: added });
  }

  /* notifications */
  if (path === '/api/notes') {
    const k = 'notes:' + u.email; const L = (await s.get(k)) || [];
    if (req.method === 'GET') return json({ notes: L });
    L.forEach(n => { n.read = true }); await s.set(k, L); return json({ ok: true });
  }
  return bad('Not found', 404);
};
export const config = { path: ['/api/org', '/api/state', '/api/team', '/api/campaigns', '/api/campaign', '/api/notes', '/api/photo'] };
