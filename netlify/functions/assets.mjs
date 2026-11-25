// Gus builds a campaign's assets in one go, each tied to a prospect problem and how the agency fixes it.
// POST /api/assets { feed, agency, uvp, different, proof, offer, services, sectors, roles, problem, hero }
//   -> { items: [{ slot, t, val, body }], ideas: [{ n, t, why }] }
import { json, bad, needUser, limited, claude, claudeText } from './_lib.mjs';
const SLOTS = ['hero', 'case', 'lipost', 'lipost', 'lipost', 'blog', 'video', 'screen'];
export default async (req) => {
  const u = await needUser(req); if (!u) return bad('Sign in first', 401);
  if (req.method !== 'POST') return bad('Use POST', 405);
  if (await limited('assets:' + u.email, 20, 3600)) return bad('Gus needs a breather. Try again in an hour.', 429);
  if (!process.env.ANTHROPIC_API_KEY) return json({ items: [], ideas: [] });
  const b = await req.json().catch(() => ({}));
  const s = (v, n = 600) => String(v || '').replace(/—/g, ', ').slice(0, n);
  const ask = `You are Gus, the creative lead inside Plato, helping a UK agency win new clients by giving value before asking for anything.
Agency: ${s(b.agency, 80)}. What they do best: ${s(b.uvp)}. Why them: ${s(b.different)}. Proof: ${s(b.proof)}. First offer: ${s(b.offer)}. Services: ${s(b.services)}.
Prospects: ${(b.sectors || []).map(x => s(x, 60)).join(', ') || 'UK brands'}. People: ${(b.roles || []).map(x => s(x, 60)).join(', ') || 'marketing leaders'}.
The prospect problem this campaign is about: ${s(b.problem, 200)}.${b.hero ? ' The hero piece is: ' + s(b.hero, 200) + '.' : ''}
What the agency told you about this campaign and the assets they have:
"""${s(b.feed, 4000)}"""

Plan every asset the campaign needs. Be creative and specific to these sectors, never generic. Each asset must name the prospect problem and how this agency fixes it.
Answer with JSON only:
{"items":[{"slot":"hero|case|lipost|blog|video|screen","t":"title","val":"one sentence: the value for the prospect, the problem it speaks to and how the agency fixes it","body":"the draft, under 80 words, ready to edit. Use [square brackets] for anything only the agency knows. Never invent results, clients or numbers."}],
"ideas":[{"n":"short name","t":"one line: what it is","why":"one line: why this sector would value it"}]}
Make exactly these slots in order: ${SLOTS.join(', ')}. Three ideas, each a different format, all specific to the sectors above.
Write in plain, warm, direct British English. No em dashes. No hype words. No "no strings attached" or "no catch".`;
  try {
    const r = await claude({ model: process.env.ASSETS_MODEL || process.env.DIGEST_MODEL || 'claude-haiku-5-5', max_tokens: 1800, messages: [{ role: 'user', content: ask }] }, 9500);
    const t = claudeText(await r.json()); const m = t.match(/\{[\s\S]*\}/); const j = m ? JSON.parse(m[0]) : null;
    if (!j) return bad('Gus could not finish that just now. Try again.', 502);
    const ok = new Set(['hero', 'case', 'lipost', 'blog', 'video', 'screen']);
    return json({ items: (j.items || []).filter(x => ok.has(x.slot)).slice(0, 10).map(x => ({ slot: x.slot, t: s(x.t, 140), val: s(x.val, 300), body: s(x.body, 2500) })),
      ideas: (j.ideas || []).slice(0, 3).map(x => ({ n: s(x.n, 80), t: s(x.t, 200), why: s(x.why, 200) })) });
  } catch { return bad('Gus could not finish that just now. Try again.', 502); }
};
export const config = { path: '/api/assets' };
