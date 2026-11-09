// Which website platforms a brand runs on: Shopify, Salesforce Commerce Cloud, WordPress and the rest.
// With BUILTWITH_API_KEY set, it asks BuiltWith. Otherwise it reads the brand's own home page and spots well known fingerprints.
// GET /api/tech?domains=greggs.co.uk,tesco.com   Cached for two weeks per domain.
import { json, bad, needUser, store, safeUrl, fetchText } from './_lib.mjs';
const RULES = [
  ['Shopify', 'Ecommerce', /cdn\.shopify\.com|Shopify\.theme|shopify-section/i], ['Salesforce Commerce Cloud', 'Ecommerce', /demandware\.(static|store)|\/on\/demandware|dwac-/i], ['Magento', 'Ecommerce', /Magento_|mage\/cookies|static\/version\d+\/frontend/i],
  ['WooCommerce', 'Ecommerce', /woocommerce/i], ['BigCommerce', 'Ecommerce', /cdn\d*\.bigcommerce\.com|bigcommerce\.com\/s-/i], ['SAP Commerce', 'Ecommerce', /\/_ui\/responsive\/|hybris/i], ['commercetools', 'Ecommerce', /commercetools/i],
  ['WordPress', 'CMS', /wp-content\/|wp-includes\//i], ['Adobe Experience Manager', 'CMS', /\/etc\.clientlibs\/|\/content\/dam\//i], ['Sitecore', 'CMS', /sitecore|\/-\/media\//i], ['Contentful', 'CMS', /ctfassets\.net/i], ['Drupal', 'CMS', /drupal-settings-json|\/sites\/default\/files\//i],
  ['Webflow', 'CMS', /webflow\.(js|com)|data-wf-page/i], ['Wix', 'CMS', /static\.wixstatic\.com|wix-bolt/i], ['Squarespace', 'CMS', /static1\.squarespace\.com|squarespace-cdn/i], ['Next.js', 'Framework', /__NEXT_DATA__|\/_next\/static\//i], ['Nuxt', 'Framework', /__NUXT__|\/_nuxt\//i], ['Gatsby', 'Framework', /___gatsby/i],
  ['Google Tag Manager', 'Analytics', /googletagmanager\.com\/gtm\.js/i], ['Google Analytics 4', 'Analytics', /gtag\/js\?id=G-/i], ['Adobe Analytics', 'Analytics', /omtrdc\.net|AppMeasurement/i], ['Hotjar', 'Analytics', /static\.hotjar\.com/i], ['Contentsquare', 'Analytics', /contentsquare\.net/i],
  ['Meta Pixel', 'Advertising', /connect\.facebook\.net\/[^"']*\/fbevents\.js/i], ['TikTok Pixel', 'Advertising', /analytics\.tiktok\.com/i], ['LinkedIn Insight', 'Advertising', /snap\.licdn\.com/i], ['Criteo', 'Advertising', /static\.criteo\.net/i],
  ['Klaviyo', 'Email', /static\.klaviyo\.com|klaviyo\.com\/onsite/i], ['Salesforce Marketing Cloud', 'Email', /exacttarget|\.sfmc-content\.com/i], ['Braze', 'Email', /js\.appboycdn\.com|braze\.com\/api/i], ['HubSpot', 'Email', /js\.hs-scripts\.com|js\.hsforms\.net/i], ['Marketo', 'Email', /munchkin\.marketo\.net/i],
  ['Optimizely', 'Testing', /cdn\.optimizely\.com/i], ['Yotpo', 'Reviews', /staticw2\.yotpo\.com/i], ['Trustpilot', 'Reviews', /widget\.trustpilot\.com/i], ['Klarna', 'Payments', /klarna/i], ['Intercom', 'Chat', /widget\.intercom\.io/i], ['Zendesk', 'Chat', /static\.zdassets\.com/i], ['OneTrust', 'Privacy', /cdn\.cookielaw\.org|onetrust/i]];
const TAGS = { ecommerce: 'Ecommerce', 'shop': 'Ecommerce', cms: 'CMS', analytics: 'Analytics', ads: 'Advertising', 'mx': 'Email', email: 'Email', framework: 'Framework', javascript: 'Framework', payment: 'Payments', widgets: 'Widgets', hosting: 'Hosting', cdn: 'Hosting' };
async function builtwith(domain) {
  const k = process.env.BUILTWITH_API_KEY; if (!k) return null;
  try { const r = await fetch((process.env.BUILTWITH_URL || 'https://api.builtwith.com/v21/api.json') + '?KEY=' + encodeURIComponent(k) + '&LOOKUP=' + encodeURIComponent(domain) + '&NOMETA=yes&NOATTR=yes&NOPII=yes&LIVEONLY=yes');
    if (!r.ok) return null; const j = await r.json(); const res = j.Results || j.results || []; const out = []; const seen = new Set();
    res.forEach(x => ((x.Result || x).Paths || (x.Result || x).paths || []).forEach(p => (p.Technologies || p.technologies || []).forEach(t => { const n = t.Name || t.name; if (!n || seen.has(n)) return; seen.add(n); out.push({ name: n, cat: TAGS[String(t.Tag || t.tag || '').toLowerCase()] || cap(t.Tag || t.tag || 'Other') }); })));
    return out.length ? out : null; } catch { return null; }
}
const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);
async function sniff(domain) { const u = safeUrl(domain); if (!u) return []; const r = await fetchText('https://' + u.hostname + '/', 8000, 900000); if (!r) return [];
  const blob = r.html + ' ' + [...r.headers.entries()].map(([k, v]) => k + ':' + v).join(' ');
  const out = RULES.filter(([, , re]) => re.test(blob)).map(([name, cat]) => ({ name, cat }));
  if (/cloudflare/i.test(r.headers.get('server') || '')) out.push({ name: 'Cloudflare', cat: 'Hosting' }); return out; }
const ORDER = ['Ecommerce', 'CMS', 'Framework', 'Email', 'Analytics', 'Advertising', 'Testing', 'Reviews', 'Payments', 'Chat', 'Hosting', 'Privacy', 'Widgets', 'Other'];
export default async (req) => {
  if (!(await needUser(req))) return bad('Sign in first', 401);
  const domains = (new URL(req.url).searchParams.get('domains') || '').split(',').map(s => s.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '')).filter(d => /^[a-z0-9.-]+\.[a-z]{2,}$/.test(d)).slice(0, 6);
  const s = await store(); const sites = {};
  await Promise.all(domains.map(async d => {
    const k = 'tech:' + d; const hit = await s.get(k); if (hit && Date.now() - Date.parse(hit.ts) < 14 * 864e5) { sites[d] = hit; return; }
    let items = await builtwith(d); let src = 'builtwith'; if (!items) { items = await sniff(d); src = 'page'; }
    items.sort((a, b) => ORDER.indexOf(a.cat) - ORDER.indexOf(b.cat)); const v = { ts: new Date().toISOString(), src, items: items.slice(0, 16) }; await s.set(k, v); sites[d] = v;
  }));
  return json({ sites });
};
export const config = { path: '/api/tech' };
