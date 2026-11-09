// Plato: the guide inside the portal. The browser sends the conversation, a compact snapshot of the workspace and
// the tools it can run. Claude decides what to say and which tools to use; the browser runs them and sends back results.
// The key never leaves the server. POST /api/plato { messages, context, tools }
import { json, bad, needUser, limited, claude } from './_lib.mjs';
const SYSTEM = `You are Plato, the guide inside the Permissionless Portal, a new business platform for agencies made by Scope & Lens.
You can see a snapshot of the user's workspace (below) and you can act on it with the tools provided.

How you speak:
- British English. Warm, wise and brief. A little philosophical, never pompous. Short sentences. No em dashes. No hype.
- Lead with the answer. Use short lists when you list things. Use the user's own brand and campaign names.

What you know about the method:
- Permissionless prospecting: give something genuinely useful before asking for anything. Relevant, valuable, persistent, human.
- Every campaign has four steps, each run by a bot: Who to target (Radar), What to share (Spark), How to reach (Ping), Launch (Rocket). They hand the work to each other. You are Plato, the guide over all of them.
- The agency profile must be complete before any campaign. Outreach goes out a few steps a day, sent by the user, or by Amplify with approval on Premium.
- Never more than one email in a week. Content every two weeks. LinkedIn ads in the background.

Rules:
- Only use facts from the snapshot or from tool results. Never invent brands, people, numbers, news or results. If you do not know, say so.
- To change anything, use a tool. Never claim you did something unless a tool result says it worked.
- Before launching a campaign or removing anything, the tool will ask the user to confirm. Do not ask twice.
- When asked to find decision makers and add them, call find_decision_makers, then add_people with the people it returned.
- Keep replies under 140 words unless the user asks for detail.`;
const TYPE = (spec) => {
  const opt = String(spec).endsWith('?'); const t = String(spec).replace(/\?$/, '');
  if (t === 'string') return [{ type: 'string' }, opt];
  if (t === 'number') return [{ type: 'number' }, opt];
  if (t === 'string[]') return [{ type: 'array', items: { type: 'string' } }, opt];
  if (t === '{name,role}[]') return [{ type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, role: { type: 'string' } }, required: ['name'] } }, opt];
  return [{ type: 'string' }, true];
};
function toolDefs(list) {
  return (Array.isArray(list) ? list : []).slice(0, 30).filter(t => /^[a-z_]{3,40}$/.test(t.name)).map(t => {
    const props = {}, req = [];
    Object.entries(t.params || {}).slice(0, 8).forEach(([k, v]) => { if (!/^[a-z_]{1,30}$/.test(k)) return; const [sch, opt] = TYPE(v); props[k] = sch; if (!opt) req.push(k); });
    return { name: t.name, description: String(t.description || '').slice(0, 400), input_schema: { type: 'object', properties: props, required: req } };
  });
}
function cleanMsgs(ms) {
  const out = []; let size = 0;
  for (const m of (Array.isArray(ms) ? ms : []).slice(-24)) {
    if (!['user', 'assistant'].includes(m.role)) continue;
    let c = m.content; if (typeof c === 'string') c = c.slice(0, 4000);
    else if (Array.isArray(c)) c = c.slice(0, 12).map(b => b.type === 'text' ? { type: 'text', text: String(b.text || '').slice(0, 4000) } : b.type === 'tool_use' ? { type: 'tool_use', id: String(b.id), name: String(b.name), input: b.input || {} } : b.type === 'tool_result' ? { type: 'tool_result', tool_use_id: String(b.tool_use_id), content: String(b.content || '').slice(0, 8000) } : null).filter(Boolean);
    else continue;
    size += JSON.stringify(c).length; if (size > 90000) break; out.push({ role: m.role, content: c });
  }
  while (out.length && (out[0].role !== 'user' || Array.isArray(out[0].content) && out[0].content.some(b => b.type === 'tool_result'))) out.shift();
  return out;
}
export default async (req) => {
  const u = await needUser(req); if (!u) return bad('Sign in first', 401);
  if (req.method !== 'POST') return bad('Use POST', 405);
  if (!process.env.ANTHROPIC_API_KEY) return bad('Plato’s AI is not switched on yet', 501);
  if (await limited('plato:' + u.email, 40, 600)) return bad('Plato needs a breather. Try again in a few minutes.', 429);
  const b = await req.json().catch(() => null); if (!b) return bad('Bad request');
  const messages = cleanMsgs(b.messages); if (!messages.length) return bad('Say something first');
  const ctx = JSON.stringify(b.context || {}).slice(0, 40000);
  try {
    const r = await claude({ max_tokens: 1500, system: SYSTEM + '\n\nThe workspace right now, as JSON:\n' + ctx, tools: toolDefs(b.tools), messages }, 9500);
    const j = await r.json(); if (!r.ok) return bad((j.error && j.error.message) || 'Plato could not think just now', 502);
    const content = (j.content || []).map(c => c.type === 'text' ? { type: 'text', text: String(c.text).replace(/—/g, ',') } : c);
    return json({ content, stop_reason: j.stop_reason });
  } catch { return bad('Plato could not be reached', 502); }
};
export const config = { path: '/api/plato' };
