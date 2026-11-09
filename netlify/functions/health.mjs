import { json, MODE, secretReady, waReady } from './_lib.mjs';
export default async () => json({ ok: true, mode: MODE(), ready: secretReady(), news: true, people: !!process.env.APOLLO_API_KEY, insights: true, team: true, plan: true, links: true, intel: true,
  ai: !!process.env.ANTHROPIC_API_KEY, plato: !!process.env.ANTHROPIC_API_KEY, tech: true, builtwith: !!process.env.BUILTWITH_API_KEY, og: true, liscan: true, alerts: true,
  email: !!process.env.RESEND_API_KEY, whatsapp: waReady(), amplify: !!(process.env.AMPLIFY_API_URL && process.env.AMPLIFY_API_KEY) });
export const config = { path: '/api/health' };
