// Keeps the Permissionless Portal private. Nothing under /portal/app is served unless the visitor has a valid, signed session.
// Everyone else is sent to the sign in page, where they can sign in or ask Josh for access.
const enc = new TextEncoder();
const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
async function valid(token, secret) {
  if (!token || !token.includes('.') || !secret) return false;
  const [body, mac] = token.split('.');
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const want = b64u(await crypto.subtle.sign('HMAC', key, enc.encode(body)));
  if (want.length !== mac.length) return false;
  let diff = 0; for (let i = 0; i < want.length; i++) diff |= want.charCodeAt(i) ^ mac.charCodeAt(i);
  if (diff) return false;
  try { const p = JSON.parse(atob(body.replace(/-/g, '+').replace(/_/g, '/'))); return p.exp > Date.now(); } catch { return false; }
}
export default async (req, context) => {
  const mode = (Netlify.env.get('AUTH_MODE') || 'secure').toLowerCase();
  const secret = Netlify.env.get('SESSION_SECRET') || (mode === 'open' ? 'local-test-secret' : '');
  const m = (req.headers.get('cookie') || '').match(/(?:^|;\s*)sl_session=([^;]+)/);
  if (await valid(m ? decodeURIComponent(m[1]) : '', secret)) {
    const res = await context.next();
    res.headers.set('Cache-Control', 'private, no-store'); res.headers.set('X-Robots-Tag', 'noindex');
    return res;
  }
  const u = new URL(req.url); return Response.redirect(new URL('/portal/?next=' + encodeURIComponent(u.pathname + u.hash), u.origin), 302);
};
export const config = { path: ['/portal/app', '/portal/app/*'] };
