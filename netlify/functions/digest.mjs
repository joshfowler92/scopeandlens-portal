// Reads an agency's own materials (credentials, case studies, propositions, pitches) and pulls out what makes them distinctive.
// Uses Claude when ANTHROPIC_API_KEY is set. Only facts present in the documents are returned: nothing is invented.
import { json, bad, needUser, claude, claudeText } from './_lib.mjs';
const KEYS = ['brand','creative','design','packaging','media','performance','seo','social','influencer','content','video','pr','experiential','sponsorship','web','ux','crm','data','research','effectiveness','martech','ai','b2b','employer','health','purpose','full'];
const SECTORS = ['retail','fmcg','finance','travel','health','tech','auto','charity','b2b','media'];
export function prompt(agency, docs) {
  return `You are reading the marketing materials of a UK agency${agency ? ' called ' + agency : ''}. Pull out what makes them distinctive, in their own words.

Rules:
- Only use facts that appear in the documents. Never invent results, clients, numbers or claims.
- Quote or lightly tidy their own sentences. British English. No em dashes.
- Each item is one sentence.

Return only JSON, with this shape:
{"uvp":[up to 4 sentences on what they do best],
 "different":[up to 4 sentences on why them and not another agency],
 "offer":[up to 3 sentences describing a first piece of work they offer, such as a sprint, audit or workshop],
 "proofs":[up to 10 objects {"text": a result with a number, "sector": one of ${JSON.stringify(SECTORS)} or ""}],
 "cases":[up to 6 objects {"title": short case study name, "result": the headline result in one sentence, "sector": one of the sectors or ""}],
 "clients":[up to 12 client or brand names they say they have worked with],
 "awards":[up to 6 awards, shortlists or recognition, one short line each],
 "team":[up to 4 sentences about the people, founders or team],
 "method":[up to 4 sentences on how they work, their process or approach],
 "services":[up to 3 of ${JSON.stringify(KEYS)}],
 "sectors":[up to 3 of the sectors],
 "voice":"one sentence describing how they write"}

Documents:
${docs.map((d, i) => `--- Document ${i + 1}: ${d.name} (${d.cat}) ---\n${String(d.text).slice(0, 15000)}`).join('\n\n')}`;
}
export function pick(text) { const m = String(text).match(/\{[\s\S]*\}/); if (!m) return null; try { return JSON.parse(m[0]); } catch { return null; } }
export default async (req) => {
  if (!(await needUser(req))) return bad('Sign in first', 401);
  if (req.method !== 'POST') return bad('Use POST', 405);
  if (!process.env.ANTHROPIC_API_KEY) return bad('AI reading is not switched on', 501);
  let body; try { body = await req.json(); } catch { return bad('Bad request'); }
  const docs = (body.docs || []).filter(d => d && d.text).slice(0, 12);
  if (!docs.length) return bad('Nothing to read');
  let total = 0; const trimmed = docs.map(d => { const t = String(d.text).slice(0, Math.max(0, 60000 - total)); total += t.length; return { name: String(d.name || 'Document').slice(0, 120), cat: String(d.cat || 'other'), text: t }; }).filter(d => d.text);
  try {
    const r = await claude({ model: process.env.DIGEST_MODEL || 'claude-haiku-5-5', max_tokens: 1800, messages: [{ role: 'user', content: prompt(String(body.agency || ''), trimmed) }] }, 9200);
    if (!r.ok) return bad('AI reading failed (' + r.status + ')', 502);
    const j = await r.json();
    const learned = pick(claudeText(j));
    if (!learned) return bad('Could not read the result', 502);
    return json({ learned });
  } catch (e) { return bad('AI reading failed', 502); }
};
export const config = { path: '/api/digest' };
