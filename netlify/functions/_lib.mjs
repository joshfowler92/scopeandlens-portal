// Shared helpers for the Scope & Lens Permissionless Portal.
import crypto from 'node:crypto';

// 'secure' is the default: only people Josh has approved can sign in. 'open' is for local testing only.
export const MODE = () => (process.env.AUTH_MODE || 'secure').toLowerCase();
const SECRET = () => process.env.SESSION_SECRET || (MODE() === 'open' ? 'local-test-secret' : '');
export const secretReady = () => !!SECRET();
const ADMIN_DOMAIN = /@scopeandlens\.com$/i;
export const isAdminEmail = (e) => ADMIN_DOMAIN.test(e || '') || (process.env.ADMIN_EMAILS || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean).includes(String(e || '').toLowerCase());
export const siteUrl = () => (process.env.URL || process.env.SITE_URL || 'https://www.scopeandlens.com').replace(/\/$/, '');
export const nice = (e) => { const n = String(e).split('@')[0].split(/[._-]/)[0]; return n ? n[0].toUpperCase() + n.slice(1) : ''; };
export const uid = () => crypto.randomBytes(9).toString('base64url');
export const validEmail = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(e || ''));

export const json = (body, status = 200, extra = {}) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extra } });
export const bad = (msg, status = 400) => json({ error: msg }, status);

const b64 = (b) => Buffer.from(b).toString('base64url');
export function sign(payload, days = 14) {
  const body = b64(JSON.stringify({ ...payload, exp: Date.now() + days * 864e5 }));
  const mac = crypto.createHmac('sha256', SECRET()).update(body).digest('base64url');
  return body + '.' + mac;
}
export function readToken(t) {
  if (!t || !t.includes('.') || !SECRET()) return null;
  const [body, mac] = t.split('.');
  const want = crypto.createHmac('sha256', SECRET()).update(body).digest('base64url');
  if (mac.length !== want.length || !crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(want))) return null;
  try { const p = JSON.parse(Buffer.from(body, 'base64url').toString()); return p.exp > Date.now() ? p : null; } catch { return null; }
}
export const COOKIE = 'sl_session';
export function cookieOf(req, name = COOKIE) { const m = (req.headers.get('cookie') || '').match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)')); return m ? decodeURIComponent(m[1]) : ''; }
export function verify(req) {
  const h = req.headers.get('authorization') || '';
  return readToken(h.startsWith('Bearer ') ? h.slice(7) : '') || readToken(cookieOf(req));
}
export const sessionCookie = (token) => `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${14 * 86400}`;
export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

export function hashPassword(pw, salt = crypto.randomBytes(16).toString('hex')) { return salt + ':' + crypto.scryptSync(String(pw), salt, 32).toString('hex'); }
export function checkPassword(pw, stored) {
  const [salt, h] = String(stored || '').split(':'); if (!salt || !h) return false;
  const got = crypto.scryptSync(String(pw), salt, 32); const want = Buffer.from(h, 'hex');
  return got.length === want.length && crypto.timingSafeEqual(got, want);
}

// Storage: Netlify Blobs when deployed, an in-memory map when testing locally.
const mem = new Map();
let MEM = null;
/* A fresh Blobs handle every time: a handle kept across warm invocations carries an access token
   that expires, which made every later call fail with a 502 ("Failed to decode token: Token expired"). */
export async function store() {
  if (MEM) return MEM;
  try {
    if (process.env.LOCAL_STORE) throw new Error('local');
    const { getStore } = await import('@netlify/blobs');
    const open = () => getStore('portal');
    const retry = async (fn) => { try { return await fn(open()); } catch (e) { if (/token|expired|401|403/i.test(String(e && e.message))) return fn(open()); throw e; } };
    return { get: (k) => retry(async (s) => (await s.get(k, { type: 'json' })) || null), set: (k, v) => retry((s) => s.setJSON(k, v)), del: (k) => retry((s) => s.delete(k)), list: (p) => retry(async (s) => (await s.list({ prefix: p })).blobs.map(b => b.key)) };
  } catch {
    MEM = { get: async (k) => (mem.has(k) ? JSON.parse(mem.get(k)) : null), set: async (k, v) => { mem.set(k, JSON.stringify(v)); }, del: async (k) => { mem.delete(k); }, list: async (p) => [...mem.keys()].filter(k => k.startsWith(p)) };
  }
  return MEM;
}
export async function getUsers() { return (await (await store()).get('users')) || []; }
export async function saveUsers(u) { await (await store()).set('users', u); }
export async function getOrgs() { return (await (await store()).get('orgs')) || []; }
export async function saveOrgs(o) { await (await store()).set('orgs', o); }
export const publicUser = ({ hash, invite, reset, ...u }) => u;

// The signed-in person, refreshed from the user list so role and organisation changes apply straight away.
export async function needUser(req) {
  const t = verify(req); if (!t) return null;
  if (t.boot) return t;
  if (MODE() === 'open') return t;
  const u = (await getUsers()).find(x => x.email === t.email);
  if (!u || u.status === 'removed') return null;
  return { email: u.email, name: u.name, role: u.role, orgId: u.orgId, orgName: u.orgName || '' };
}
export async function needAdmin(req) { const u = await needUser(req); return u && u.role === 'admin' ? u : null; }

// Email, through Resend when RESEND_API_KEY is set. Without it, nothing is sent and the portal shows links to copy instead.
export async function sendMail({ to, subject, text, html }) {
  if (!process.env.RESEND_API_KEY || !to) return { sent: false };
  try {
    const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.MAIL_FROM || 'Scope & Lens <portal@scopeandlens.com>', to: Array.isArray(to) ? to : [to], subject, text, html: html || mailHtml(text) }) });
    return { sent: r.ok };
  } catch { return { sent: false }; }
}
export function mailHtml(text) {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const body = esc(text).replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" style="color:#2c56ed">$1</a>').split('\n\n').map(p => '<p style="margin:0 0 14px">' + p.replace(/\n/g, '<br>') + '</p>').join('');
  return `<div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:#080808;max-width:560px;padding:24px"><div style="font-weight:800;font-size:18px;color:#2c56ed;margin-bottom:18px">Scope &amp; Lens</div>${body}<p style="color:#55524d;font-size:13px;margin-top:24px">Permissionless Portal by Scope &amp; Lens</p></div>`;
}
export const founderEmail = () => (process.env.ADMIN_EMAIL || 'josh@scopeandlens.com').toLowerCase();
export async function note(email, n) {
  const s = await store(); const k = 'notes:' + email; const L = (await s.get(k)) || [];
  L.unshift({ id: uid(), ts: new Date().toISOString(), read: false, ...n }); await s.set(k, L.slice(0, 100));
}

// WhatsApp, through Twilio when TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_WHATSAPP_FROM are set.
// Messages a business starts need an approved template: set TWILIO_WHATSAPP_TEMPLATE_SID to a template with one variable, {{1}}.
export const waReady = () => !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM);
export async function sendWhatsApp(to, body) {
  if (!waReady() || !/^\+?[1-9]\d{7,14}$/.test(String(to || ''))) return { sent: false };
  const sid = process.env.TWILIO_ACCOUNT_SID, from = process.env.TWILIO_WHATSAPP_FROM;
  const f = new URLSearchParams({ From: from.startsWith('whatsapp:') ? from : 'whatsapp:' + from, To: 'whatsapp:' + (String(to).startsWith('+') ? to : '+' + to) });
  if (process.env.TWILIO_WHATSAPP_TEMPLATE_SID) { f.set('ContentSid', process.env.TWILIO_WHATSAPP_TEMPLATE_SID); f.set('ContentVariables', JSON.stringify({ 1: String(body).slice(0, 900) })); }
  else f.set('Body', String(body).slice(0, 1500));
  try {
    const r = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + sid + '/Messages.json', { method: 'POST', headers: { Authorization: 'Basic ' + Buffer.from(sid + ':' + process.env.TWILIO_AUTH_TOKEN).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' }, body: f });
    return { sent: r.ok };
  } catch { return { sent: false }; }
}
// A web address that is safe to fetch from the server: http or https, and never a private network.
export function safeUrl(u) {
  try { const x = new URL(/^https?:\/\//i.test(u) ? u : 'https://' + u); if (!/^https?:$/.test(x.protocol)) return null;
    if (/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.|\[)/i.test(x.hostname) || !x.hostname.includes('.')) return null; return x; } catch { return null; }
}
export async function fetchText(u, ms = 8000, max = 600000) {
  const c = new AbortController(); const t = setTimeout(() => c.abort(), ms);
  try { const r = await fetch(u, { signal: c.signal, redirect: 'follow', headers: { 'User-Agent': 'ScopeAndLensPortal/1.0 (+https://www.scopeandlens.com)', Accept: 'text/html,application/xhtml+xml' } });
    if (!r.ok) return null; const h = await r.text(); return { html: h.slice(0, max), headers: r.headers, url: r.url }; } catch { return null; } finally { clearTimeout(t); }
}
// A small per-person rate limit, so nothing can run up a bill.
export async function limited(key, max, windowSec) {
  const s = await store(); const k = 'rl:' + key + ':' + Math.floor(Date.now() / 1000 / windowSec);
  const n = ((await s.get(k)) || 0) + 1; await s.set(k, n); return n > max;
}
// One call to Claude, with a time limit that fits inside a Netlify function (about ten seconds),
// and without long thinking first, so answers come back quickly. Returns the fetch Response.
export async function claude(body, ms = 9000, beta = '') {
  const c = new AbortController(); const t = setTimeout(() => c.abort(), ms);
  const b = Object.assign({ model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5' }, body);
  if (b.thinking === undefined) b.thinking = /haiku/i.test(b.model) ? { type: 'disabled' } : { type: 'between_tools' };
  const go = (x) => fetch(process.env.ANTHROPIC_URL || 'https://api.anthropic.com/v1/messages', { method: 'POST', signal: c.signal,
    headers: Object.assign({ 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' }, beta ? { 'anthropic-beta': beta } : {}), body: JSON.stringify(x) });
  try {
    let r = await go(b);
    if (r.status === 400) { const e = await r.clone().json().catch(() => ({})); const m = (e.error && e.error.message) || '';
      if (/thinking/i.test(m)) { const alt = (m.match(/"type":\s*"([a-z_]+)"\s*\}\s*instead/) || [])[1]; if (alt) b.thinking = { type: alt }; else delete b.thinking; r = await go(b); } }
    return r;
  } finally { clearTimeout(t); }
}
export const claudeText = (j) => (j && j.content || []).filter(c => c.type === 'text').map(c => c.text || '').join('');
