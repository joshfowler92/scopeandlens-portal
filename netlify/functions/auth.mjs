// Sign in, sign out, requesting access, invitations and password resets. Only people Josh approves get in.
import crypto from 'node:crypto';
import { json, bad, sign, MODE, secretReady, isAdminEmail, isFounder, checkPassword, hashPassword, getUsers, saveUsers, getOrgs, saveOrgs, publicUser, needUser, needAdmin,
  sessionCookie, clearCookie, sendMail, siteUrl, nice, uid, validEmail, founderEmail, note, store } from './_lib.mjs';

const tok = () => crypto.randomBytes(24).toString('base64url');
const slug = (s) => String(s || 'agency').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'agency';
const loginReply = (user) => { const t = sign(user); return json({ token: t, user }, 200, { 'Set-Cookie': sessionCookie(t) }); };
async function body(req) { try { return await req.json(); } catch { return {}; } }
async function requests() { return (await (await store()).get('requests')) || []; }
async function saveRequests(r) { await (await store()).set('requests', r); }
async function ensureOrg(name, id) {
  const orgs = await getOrgs(); let o = id ? orgs.find(x => x.id === id) : orgs.find(x => x.name.toLowerCase() === String(name || '').toLowerCase());
  if (!o) { o = { id: id || slug(name) + '-' + uid().slice(0, 4), name: name || 'Agency', created: new Date().toISOString(), premium: false }; orgs.push(o); await saveOrgs(orgs); }
  return o;
}
async function invite(user, by) {
  const link = siteUrl() + '/portal/?invite=' + user.invite.token;
  const m = await sendMail({ to: user.email, subject: 'Your Scope & Lens Permissionless Portal login',
    text: `Hi ${user.name || nice(user.email)},\n\n${by ? by + ' has' : 'Scope & Lens has'} given you access to the Permissionless Portal${user.orgName ? ' for ' + user.orgName : ''}.\n\nSet your password here (the link works for seven days):\n${link}\n\nThen sign in any time at ${siteUrl()}/portal\n\nJosh` });
  return { link, emailed: m.sent };
}

export default async (req) => {
  const path = new URL(req.url).pathname.replace(/\/$/, '');
  const now = new Date().toISOString();

  if (path === '/api/me') {
    const u = await needUser(req); if (!u) return bad('Not signed in', 401);
    const orgs = await getOrgs(); const o = orgs.find(x => x.id === u.orgId);
    return json({ user: { ...u, orgName: o ? o.name : u.orgName || '', premium: !!(o && o.premium), paid: !!(o && o.paid), intel: !!(o && o.intel), founder: isFounder(u) } });
  }
  if (path === '/api/logout') return json({ ok: true }, 200, { 'Set-Cookie': clearCookie() });

  if (path === '/api/login') {
    if (req.method !== 'POST') return bad('Use POST', 405);
    if (!secretReady()) return bad('The portal is not set up yet. SESSION_SECRET is missing.', 503);
    const b = await body(req); const email = String(b.email || '').trim().toLowerCase(); const password = String(b.password || '');
    if (!validEmail(email) || !password) return bad('Email and password needed');
    if (MODE() === 'open') return loginReply({ email, name: nice(email), role: isAdminEmail(email) ? 'admin' : 'member', orgId: 'test-org', orgName: 'Test agency' });
    if (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL.toLowerCase() && process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {
      const users = await getUsers(); if (!users.find(x => x.email === email)) { const o = await ensureOrg('Scope & Lens', 'scope-and-lens'); users.push({ email, name: nice(email), role: 'admin', orgId: o.id, orgName: o.name, status: 'active', added: now }); await saveUsers(users); }
      const u = (await getUsers()).find(x => x.email === email);
      return loginReply({ email, name: u.name, role: 'admin', orgId: u.orgId, orgName: u.orgName });
    }
    const users = await getUsers(); const u = users.find(x => x.email === email);
    if (!u || u.status === 'removed' || !u.hash || !checkPassword(password, u.hash)) return bad('Those details did not work', 401);
    u.lastLogin = now; u.status = 'active'; await saveUsers(users);
    return loginReply({ email: u.email, name: u.name, role: u.role, orgId: u.orgId, orgName: u.orgName });
  }

  if (path === '/api/request-access') {
    if (req.method !== 'POST') return bad('Use POST', 405);
    const b = await body(req); if (b.website) return json({ ok: true }); // a honeypot for bots
    const by = await needUser(req);
    const email = String(b.email || '').trim().toLowerCase(); if (!validEmail(email)) return bad('That email does not look right');
    const name = String(b.name || '').slice(0, 80).trim(); const agency = String(by ? by.orgName : b.agency || '').slice(0, 80).trim();
    if (!name || !agency) return bad('Name and agency needed');
    const R = await requests(); if (R.filter(r => r.status === 'pending').length > 300) return bad('Too many requests right now. Email josh@scopeandlens.com', 429);
    if (!R.some(r => r.email === email && r.status === 'pending')) R.unshift({ id: uid(), name, email, agency, orgId: by ? by.orgId : '', role: String(b.role || '').slice(0, 80), team: String(b.team || '').slice(0, 40), message: String(b.message || '').slice(0, 600), from: by ? by.email : '', ts: now, status: 'pending' });
    await saveRequests(R);
    await note(founderEmail(), { kind: 'request', title: 'Access request: ' + name, body: agency + (by ? ' · added by ' + by.name : '') });
    await sendMail({ to: founderEmail(), subject: 'Portal access request: ' + name + ', ' + agency, text: `${name} (${email}) at ${agency} has asked for access to the Permissionless Portal.${by ? '\n\nRequested by their teammate ' + by.name + ' (' + by.email + ').' : ''}${b.role ? '\n\nRole: ' + b.role : ''}${b.message ? '\n\nWhy: ' + b.message : ''}\n\nApprove or decline it here: ${siteUrl()}/portal/app/#admin` });
    return json({ ok: true });
  }

  if (path === '/api/accept-invite') {
    if (req.method !== 'POST') return bad('Use POST', 405);
    const b = await body(req); const t = String(b.token || ''); const pw = String(b.password || '');
    if (pw.length < 10) return bad('Use at least 10 characters');
    const users = await getUsers(); const u = users.find(x => (x.invite && x.invite.token === t) || (x.reset && x.reset.token === t));
    const k = u && (u.invite && u.invite.token === t ? 'invite' : 'reset');
    if (!u || u.status === 'removed' || new Date(u[k].exp) < new Date()) return bad('That link has expired. Ask Josh for a new one.', 400);
    u.hash = hashPassword(pw); delete u.invite; delete u.reset; u.status = 'active'; u.lastLogin = now; await saveUsers(users);
    return loginReply({ email: u.email, name: u.name, role: u.role, orgId: u.orgId, orgName: u.orgName });
  }

  if (path === '/api/forgot') {
    const b = await body(req); const email = String(b.email || '').trim().toLowerCase();
    const users = await getUsers(); const u = users.find(x => x.email === email && x.status !== 'removed');
    if (u) { u.reset = { token: tok(), exp: new Date(Date.now() + 2 * 864e5).toISOString() }; await saveUsers(users);
      await sendMail({ to: email, subject: 'Reset your Permissionless Portal password', text: `Hi ${u.name || nice(email)},\n\nSet a new password here (the link works for two days):\n${siteUrl()}/portal/?invite=${u.reset.token}\n\nIf you did not ask for this, ignore this email.` }); }
    return json({ ok: true, emailConfigured: !!process.env.RESEND_API_KEY });
  }

  /* Josh only, from here */
  const admin = await needAdmin(req); if (!admin) return bad('Admins only', 401);
  if (path === '/api/requests') {
    const R = await requests();
    if (req.method === 'GET') return json({ requests: R.filter(r => r.status === 'pending'), recent: R.filter(r => r.status !== 'pending').slice(0, 20), orgs: await getOrgs() });
    const b = await body(req); const r = R.find(x => x.id === b.id); if (!r) return bad('Request not found', 404);
    if (b.action === 'decline') { r.status = 'declined'; r.done = now; await saveRequests(R); return json({ ok: true }); }
    const o = b.orgId ? (await getOrgs()).find(x => x.id === b.orgId) || await ensureOrg(r.agency) : await ensureOrg(b.orgName || r.agency);
    const users = await getUsers(); let u = users.find(x => x.email === r.email);
    if (!u) { u = { email: r.email, added: now }; users.push(u); }
    Object.assign(u, { name: r.name, role: (b.role === 'admin' && isAdminEmail(r.email)) ? 'admin' : (['lead', 'member'].includes(b.role) ? b.role : 'member'), orgId: o.id, orgName: o.name, status: u.hash ? 'active' : 'invited', invite: { token: tok(), exp: new Date(Date.now() + 7 * 864e5).toISOString() } });
    await saveUsers(users); r.status = 'approved'; r.done = now; r.orgId = o.id; await saveRequests(R);
    if (r.from) await note(r.from, { kind: 'team', title: r.name + ' now has access', body: 'They can join your campaigns once they sign in.' });
    return json({ ok: true, ...(await invite(u, admin.name)) });
  }
  if (path === '/api/users') {
    const users = await getUsers();
    if (req.method === 'GET') { const st = await store(); const list = await Promise.all(users.map(async x => ({ ...publicUser(x), photo: ((await st.get('photo:' + x.email)) || {}).img || '' }))); return json({ users: list, orgs: await getOrgs() }); }
    const b = await body(req);
    if (req.method === 'POST' && b.action === 'org') { if (!isFounder(admin) && ('premium' in b || 'paid' in b || 'intel' in b)) return bad('Only Scope & Lens can switch on paid features', 403); const orgs = await getOrgs(); const o = orgs.find(x => x.id === b.orgId); if (!o) return bad('No such organisation', 404); if ('premium' in b) o.premium = !!b.premium; if ('paid' in b) o.paid = !!b.paid; if ('intel' in b) o.intel = !!b.intel; if (b.name) o.name = String(b.name).slice(0, 80); await saveOrgs(orgs); return json({ ok: true, org: o }); }
    const u = users.find(x => x.email === String(b.email || '').toLowerCase());
    if (req.method === 'POST' && b.action === 'add') {
      const email = String(b.email || '').trim().toLowerCase(); if (!validEmail(email)) return bad('That email does not look right');
      const o = b.orgId ? (await getOrgs()).find(x => x.id === b.orgId) : await ensureOrg(b.orgName || 'Agency'); if (!o) return bad('No such organisation');
      let x = u; if (!x) { x = { email, added: now }; users.push(x); }
      Object.assign(x, { name: b.name || x.name || nice(email), role: (b.role === 'admin' && isAdminEmail(email)) ? 'admin' : (['lead', 'member'].includes(b.role) ? b.role : 'member'), orgId: o.id, orgName: o.name, status: x.hash ? 'active' : 'invited', invite: { token: tok(), exp: new Date(Date.now() + 7 * 864e5).toISOString() } });
      await saveUsers(users); return json({ ok: true, ...(await invite(x, admin.name)) });
    }
    if (!u) return bad('No such person', 404);
    if (req.method === 'POST' && b.action === 'resend') { u.invite = { token: tok(), exp: new Date(Date.now() + 7 * 864e5).toISOString() }; await saveUsers(users); return json({ ok: true, ...(await invite(u, admin.name)) }); }
    if (req.method === 'POST' && b.action === 'role') { if (b.role === 'admin' && !isAdminEmail(u.email)) return bad('Admin is only for Scope & Lens accounts', 403); u.role = ['lead', 'member', 'admin'].includes(b.role) ? b.role : u.role; await saveUsers(users); return json({ ok: true }); }
    if (req.method === 'DELETE' || b.action === 'remove') { u.status = 'removed'; delete u.hash; delete u.invite; await saveUsers(users); return json({ ok: true }); }
  }
  return bad('Not found', 404);
};
export const config = { path: ['/api/me', '/api/logout', '/api/login', '/api/request-access', '/api/accept-invite', '/api/forgot', '/api/requests', '/api/users'] };
