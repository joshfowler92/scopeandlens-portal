// Every hour, send the digests that are due, in each person's own time zone.
// Daily goes on weekdays. Weekly on their chosen day. Fortnightly on that day, every other week. Monthly on the first of that weekday.
import { store } from './_lib.mjs';
import { sendDigest } from './_alertsend.mjs';
function local(tz, d) {
  const f = new Intl.DateTimeFormat('en-GB', { timeZone: tz || 'Europe/London', hour: 'numeric', hour12: false, weekday: 'short', day: 'numeric' });
  const parts = Object.fromEntries(f.formatToParts(d).map(p => [p.type, p.value]));
  return { hour: +parts.hour % 24, dow: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday), date: +parts.day };
}
export function due(p, now) {
  if (!p || !p.dg || !p.dg.on || !p.dg.email) return false;
  let L; try { L = local(p.tz, now); } catch { L = local('Europe/London', now); }
  if (L.hour !== p.dg.hour) return false;
  const since = p.dg.last ? (now - Date.parse(p.dg.last)) / 864e5 : 99;
  if (since < 0.8) return false;
  if (p.dg.freq === 'daily') return L.dow >= 1 && L.dow <= 5;
  if (L.dow !== p.dg.day) return false;
  if (p.dg.freq === 'weekly') return true;
  if (p.dg.freq === 'fortnightly') return since >= 13;
  if (p.dg.freq === 'monthly') return L.date <= 7;
  return false;
}
export default async () => {
  const s = await store(); const keys = await s.list('alerts:'); const now = new Date(); let sent = 0;
  for (const k of keys) {
    const p = await s.get(k); if (!due(p, now)) continue;
    try { const r = await sendDigest(p, s, now.toISOString()); if (r.sent) { p.dg.last = now.toISOString(); await s.set(k, p); sent++; } } catch { }
  }
  return new Response(JSON.stringify({ checked: keys.length, sent }), { headers: { 'Content-Type': 'application/json' } });
};
export const config = { schedule: '@hourly' };
