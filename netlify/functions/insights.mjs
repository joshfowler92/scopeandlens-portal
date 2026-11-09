import { json, bad, needUser, needAdmin, store, getUsers, note } from './_lib.mjs';

/* Insights: Josh publishes, every user is told.
   GET              the list (signed in)
   GET ?latest=1    just the newest id and time, for the one-minute check online users make
   GET ?img=ID      the image Josh chose for a piece (signed in)
   POST             publish or edit (admin). A new piece leaves an alert for every user, waiting for them if they are offline
   DELETE ?id=ID    remove (admin) */
const ALLOWED = /^(p|h2|h3|b|strong|i|em|u|ul|ol|li|blockquote|a|br)$/i;
function clean(html) {
  return String(html || '')
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1>/gi, '')
    .replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (m, tag, attrs) => {
      if (!ALLOWED.test(tag)) return '';
      const close = m.startsWith('</');
      if (close) return '</' + tag.toLowerCase() + '>';
      if (tag.toLowerCase() === 'a') { const h = (attrs.match(/href\s*=\s*"([^"]*)"/i) || [])[1] || ''; return /^(https?:|mailto:)/i.test(h) ? '<a href="' + h.replace(/"/g, '&quot;') + '" target="_blank" rel="noopener" class="src">' : '<a>'; }
      return '<' + tag.toLowerCase() + '>';
    }).slice(0, 60000);
}
export default async (req) => {
  const s = await store(); const url = new URL(req.url);
  if (req.method === 'GET') {
    if (!(await needUser(req))) return bad('Sign in first', 401);
    const img = url.searchParams.get('img');
    if (img) {
      const d = await s.get('insimg:' + img); if (!d) return new Response('Not found', { status: 404 });
      const m = String(d).match(/^data:(image\/[a-z+.-]+);base64,(.+)$/i); if (!m) return new Response('Not found', { status: 404 });
      return new Response(Buffer.from(m[2], 'base64'), { headers: { 'Content-Type': m[1], 'Cache-Control': 'private, max-age=31536000, immutable' } });
    }
    if (url.searchParams.get('latest')) return json({ latest: (await s.get('insights-latest')) || null });
    return json({ items: (await s.get('insights')) || [] });
  }
  const admin = await needAdmin(req); if (!admin) return bad('Admins only', 401);
  const items = (await s.get('insights')) || [];
  if (req.method === 'POST') {
    const x = await req.json().catch(() => null);
    if (!x || !x.id || !x.title) return bad('An insight needs an id and a title');
    const id = String(x.id).replace(/[^\w-]/g, '').slice(0, 60); const old = items.find((i) => i.id === id);
    let img = '';
    if (typeof x.img === 'string' && x.img.startsWith('data:image/')) {
      if (x.img.length > 4_500_000) return bad('That image is too big. Try one under 3MB.');
      await s.set('insimg:' + id, x.img); img = '/api/insights?img=' + id + '&v=' + Date.now().toString(36);
    } else if (typeof x.img === 'string' && x.img.startsWith('/api/insights?img=')) img = x.img;
    else if (old && old.img && !x.img) await s.del('insimg:' + id).catch(() => {});
    const at = new Date().toISOString();
    const item = { id, cat: x.cat, title: String(x.title).slice(0, 200), summary: String(x.summary || '').slice(0, 600), html: clean(x.html), body: x.html ? '' : String(x.body || '').slice(0, 30000), brands: Array.isArray(x.brands) ? x.brands.slice(0, 40).map(String) : [], pin: x.pin ? 1 : 0, date: (old && old.date) || x.date || at.slice(0, 10), at, by: admin.email, img, alt: String(x.alt || '').slice(0, 200) };
    await s.set('insights', [item].concat(items.filter((i) => i.id !== id)).slice(0, 500));
    let told = null;
    if (!old) {
      await s.set('insights-latest', { id, title: item.title, at });
      const users = (await getUsers()).filter((u) => u.email !== admin.email && u.status !== 'removed');
      await Promise.all(users.map((u) => note(u.email, { kind: 'insight', insightId: id, title: 'New from Josh: ' + item.title, body: item.summary }).catch(() => {})));
      told = users.length;
    }
    return json({ ok: true, item, told });
  }
  if (req.method === 'DELETE') {
    const id = url.searchParams.get('id');
    await s.set('insights', items.filter((i) => i.id !== id));
    await s.del('insimg:' + id).catch(() => {});
    return json({ ok: true });
  }
  return bad('Method not allowed', 405);
};
export const config = { path: '/api/insights' };
