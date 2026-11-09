// Shared by /api/alerts and the hourly digest. Alerts: email and WhatsApp the moment something important happens, and a digest on each person's own schedule.
//   GET  /api/alerts                         this person's alert settings
//   POST /api/alerts { action:'save', prefs } save them
//   POST /api/alerts { action:'test' }        send a test to every channel that is switched on
//   POST /api/alerts { action:'event', title, body } an alert from the portal, forwarded to email and WhatsApp
//   POST /api/alerts { action:'digest-now' }  build and send the digest straight away
import { sendMail, sendWhatsApp, siteUrl, validEmail } from './_lib.mjs';
import { digestSummary, digestHTML, digestSubject } from './_digest.mjs';
export const FREQ = ['daily', 'weekly', 'fortnightly', 'monthly'];
export function clean(p, u) {
  const inst = p.inst || {}, dg = p.dg || {};
  return {
    email: u.email, name: u.name || '', orgId: u.orgId || '', tz: String(p.tz || 'Europe/London').slice(0, 60), threshold: Math.max(2, Math.min(5, +p.threshold || 4)),
    signals: Array.isArray(p.signals) ? p.signals.slice(0, 20).map(String) : [],
    inst: { email: !!inst.email, emailTo: validEmail(inst.emailTo) ? String(inst.emailTo).slice(0, 200) : u.email, wa: !!inst.wa, waTo: /^\+?[1-9]\d{7,14}$/.test(String(inst.waTo || '')) ? String(inst.waTo) : '' },
    dg: { on: !!dg.on, freq: FREQ.includes(dg.freq) ? dg.freq : 'weekly', day: Math.max(1, Math.min(5, +dg.day || 1)), hour: [7, 8, 9, 12, 17].includes(+dg.hour) ? +dg.hour : 8, email: validEmail(dg.email) ? String(dg.email).slice(0, 200) : u.email, last: dg.last || '' },
    updated: new Date().toISOString() };
}
export async function sendDigest(prefs, s, now) {
  const state = await s.get('state:' + prefs.email); if (!state) return { sent: false, why: 'No workspace saved yet' };
  const D = digestSummary(state, prefs.dg.last || null, now || new Date().toISOString());
  const html = digestHTML(D, { brand: (state.brand && state.brand.primary) || '#2c56ed', url: siteUrl() + '/portal/app/' });
  const lines = [D.warming.length ? D.warming.length + ' brands warming up' : '', D.conversations.length ? D.conversations.length + ' conversations' : '', D.newProspects.length ? D.newProspects.length + ' new prospects' : ''].filter(Boolean);
  const r = await sendMail({ to: prefs.dg.email, subject: digestSubject(D, prefs.dg.freq), html, text: 'Your new business digest. ' + (lines.join(', ') || 'A quiet spell.') + '\n\n' + siteUrl() + '/portal/app/' });
  return r;
}
export async function sendInstant(prefs, title, body) {
  const out = []; const text = title + (body ? '\n' + body : '') + '\n' + siteUrl() + '/portal/app/';
  if (prefs.inst.email && prefs.inst.emailTo) { const r = await sendMail({ to: prefs.inst.emailTo, subject: title, text }); if (r.sent) out.push('email'); }
  if (prefs.inst.wa && prefs.inst.waTo) { const r = await sendWhatsApp(prefs.inst.waTo, title + (body ? '. ' + body : '')); if (r.sent) out.push('WhatsApp'); }
  return out;
}
