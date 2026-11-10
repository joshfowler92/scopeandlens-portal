// Reads a piece of the agency's content (hero piece, case study, report) and says what it is and why it matters to prospects.
// POST /api/piece { title, url, text, kind, agency, sectors, roles, problem }
//   ->  { what, why, who, blurb, hooks: [..], read: 'file' | 'link' | 'title' }
// Only what the piece itself says is used. If nothing can be read, it says so instead of guessing.
import { json, bad, needUser, limited, claude, claudeText, safeUrl, fetchText } from './_lib.mjs';
const strip = (h) => String(h || '').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<nav[\s\S]*?<\/nav>|<footer[\s\S]*?<\/footer>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
export default async (req) => {
  const u = await needUser(req); if (!u) return bad('Sign in first', 401);
  if (req.method !== 'POST') return bad('Use POST', 405);
  if (await limited('piece:' + u.email, 40, 3600)) return bad('That is a lot of reading. Try again in an hour.', 429);
  const b = await req.json().catch(() => ({}));
  let text = String(b.text || '').slice(0, 16000); let read = text ? 'file' : '';
  if (!text && b.url) { const s = safeUrl(String(b.url)); if (s) { const r = await fetchText(s.href, 5000, 800000); if (r && r.html) { text = strip(r.html).slice(0, 16000); read = text.length > 200 ? 'link' : ''; } } }
  if (!text || text.length < 120) return json({ read: 'title', what: '', why: '', who: '', blurb: '', hooks: [], note: 'We could not read the piece itself. Upload the file, or paste a link to a page with the words on it.' });
  if (!process.env.ANTHROPIC_API_KEY) return json({ read, text: text.slice(0, 4000) });
  const ask = `You are helping a ${b.agency ? 'creative agency called ' + b.agency : 'creative agency'} use one of its own pieces of content to start conversations with prospective clients.
Piece type: ${b.kind || 'hero piece'}. Title: ${b.title || 'untitled'}.
Their prospects: ${(b.sectors || []).join(', ') || 'brands'}; people they want to reach: ${(b.roles || []).join(', ') || 'marketing leaders'}.${b.problem ? ' The campaign is about: ' + b.problem + '.' : ''}
Read the piece below and answer with JSON only:
{"what": "what the piece is, in one sentence", "why": "why it is useful to those prospects, in two sentences, specific to what it actually contains", "who": "which of those people would value it most, in a few words", "blurb": "a 2 to 3 sentence blurb the agency could use when sharing it, written plainly, not salesy, UK English, no em dashes", "hooks": ["three short, specific reasons to open it, each under 12 words"]}
Only use what the piece says. Do not invent numbers or claims.

PIECE:
${text}`;
  try { const r = await claude({ model: process.env.DIGEST_MODEL || 'claude-haiku-5-5', max_tokens: 700, messages: [{ role: 'user', content: ask }] }, 8500);
    const t = claudeText(await r.json()); const m = t.match(/\{[\s\S]*\}/); const j = m ? JSON.parse(m[0]) : null;
    if (!j) return bad('Muse could not read that just now. Try again.', 502);
    const clean = (s) => String(s || '').replace(/\u2014/g, ', ').slice(0, 600);
    return json({ read, what: clean(j.what), why: clean(j.why), who: clean(j.who), blurb: clean(j.blurb), hooks: (j.hooks || []).slice(0, 3).map(clean) });
  } catch { return bad('Muse could not read that just now. Try again.', 502); }
};
export const config = { path: '/api/piece' };
