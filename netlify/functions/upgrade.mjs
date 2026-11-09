// "I am ready to launch": tells Josh, in the portal and by email, so the commercial conversation can start.
import { json, bad, needUser, note, sendMail, founderEmail, getOrgs, siteUrl } from './_lib.mjs';
export default async (req) => {
  const u = await needUser(req); if (!u) return bad('Sign in first', 401);
  if (req.method !== 'POST') return bad('Use POST', 405);
  const b = await req.json().catch(() => ({}));
  const org = (await getOrgs()).find(o => o.id === u.orgId);
  const who = (u.name || u.email) + (org ? ' at ' + org.name : '');
  const camp = String(b.campaign || 'their first campaign').slice(0, 120);
  await note(founderEmail(), { kind: 'request', title: who + ' is ready to launch', body: camp + (b.brands ? ' · ' + b.brands + ' brands on the list' : '') + '. Switch on “Can launch” for their agency in Manage access.' });
  await sendMail({ to: founderEmail(), subject: who + ' is ready to launch', text: `${who} has built ${camp} in the Permissionless Portal and pressed launch.\n\n${b.brands ? b.brands + ' brands on their list.\n\n' : ''}When you have agreed terms, tick "Can launch" next to their agency in Manage access:\n${siteUrl()}/portal/app/#admin` }).catch(() => {});
  return json({ ok: true });
};
export const config = { path: '/api/upgrade' };
