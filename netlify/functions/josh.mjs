// "Speak with Josh" from inside Plato: one message, straight to Josh's inbox.
// POST /api/josh { message, name, email, agency, page, demo }
// Works signed in or not (the demo has no account). Rate limited per address so it cannot be used to spam.
import { json, bad, sendMail, validEmail, limited, verify } from './_lib.mjs';
const clip = (v, n) => String(v || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, n);
export default async (req) => {
  if (req.method !== 'POST') return bad('Use POST', 405);
  const b = await req.json().catch(() => ({}));
  const message = clip(b.message, 4000), name = clip(b.name, 120), email = clip(b.email, 200), agency = clip(b.agency, 160), page = clip(b.page, 80);
  if (message.length < 3) return bad('Add a message for Josh');
  if (!validEmail(email)) return bad('Add an email so Josh can reply');
  const ip = (req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for') || '').split(',')[0].trim();
  if (await limited('josh:' + (ip || email), 8, 3600)) return bad('That is a lot of messages. Try again in an hour, or email josh@scopeandlens.com.', 429);
  let who = ''; try { const s = verify(req); if (s && s.email) who = s.email; } catch {}
  const text = [
    'A message from inside Plato.', '',
    message, '',
    '---',
    'From: ' + (name || 'Not given') + ' <' + email + '>',
    'Agency: ' + (agency || 'Not given') + (b.demo ? ' (demo workspace)' : ''),
    'Signed in as: ' + (who || 'not signed in'),
    'Page: ' + (page || 'unknown'),
  ].join('\n');
  const r = await sendMail({ to: 'josh@scopeandlens.com', subject: 'Plato: ' + (name || 'someone') + (agency ? ' at ' + agency : '') + ' wants a word', text });
  if (!r.sent) return bad(r.why || 'Could not send just now', 502);
  return json({ ok: true });
};
export const config = { path: '/api/josh' };
