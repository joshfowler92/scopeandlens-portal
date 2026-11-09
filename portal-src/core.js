/* ═══════════════════════════════════════════════════════════════
   GROWTH DASHBOARD · core: utilities, state, storage, theme, scoring
   ═══════════════════════════════════════════════════════════════ */
let KEY='sl-growth-v6', OLD_KEY='sl-growth-v6-none', BK_KEY='sl-growth-points-v6';
function setUserKeys(email){const e=String(email||'guest').toLowerCase();KEY='sl-growth-v6:'+e;BK_KEY='sl-growth-points-v6:'+e}
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const uid=()=>Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-3);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const DAY=864e5;
const today=()=>new Date().toISOString().slice(0,10);
const daysAgo=d=>Math.max(0,Math.floor((Date.now()-new Date(d).getTime())/DAY));
const isoDaysAgo=n=>new Date(Date.now()-n*DAY).toISOString().slice(0,10);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function money(v,short){const c=(S&&S.setup&&S.setup.currency)||'£';v=Math.round(+v||0);
  if(short){if(Math.abs(v)>=999500)return c+(v/1e6).toFixed(v>=1e7?1:2).replace(/\.?0+$/,'')+'m';if(Math.abs(v)>=1e3)return c+Math.round(v/1e3)+'k'}
  return c+v.toLocaleString('en-GB')}
function rel(d){if(!d)return'';const n=daysAgo(d);return n===0?'today':n===1?'yesterday':n<7?n+' days ago':n<30?Math.round(n/7)+' wk ago':Math.round(n/30)+' mo ago'}
function weekKey(d){d=new Date(d||Date.now());const day=d.getDay()||7;d.setDate(d.getDate()-day+1);return d.toISOString().slice(0,10)}
function initials(n){return String(n||'?').split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase()}
function sum(a,f){return a.reduce((n,x)=>n+(f?f(x):x),0)}

/* ── catalogues ─────────────────────────────────────────────── */
const STAGES=[
  {k:'find',l:'Targeted',ic:'target'},{k:'reach',l:'Contacted',ic:'send'},{k:'engaged',l:'Engaged',ic:'pulse'},{k:'talk',l:'Talking',ic:'chat'},{k:'opp',l:'Opportunity',ic:'pound'}
];
const LANES=[
  {k:'lead',l:'Engaged lead',w:10},{k:'opportunity',l:'Meeting held',w:25},{k:'brief',l:'Invited to pitch',w:40},
  {k:'pitch',l:'Pitching',w:65},{k:'won',l:'Won',w:100},{k:'hold',l:'On hold',w:0},{k:'lost',l:'Lost',w:0}
];
const SIGNALS={
  meeting:{l:'Meeting booked',w:40,fam:'conversation',ic:'🤝'},
  reply:{l:'Replied',w:26,fam:'conversation',ic:'💬'},
  call:{l:'Call',w:18,fam:'conversation',ic:'📞'},
  referral:{l:'Referral or intro',w:25,fam:'conversation',ic:'🔁'},
  event_attend:{l:'Came to an event',w:30,fam:'events',ic:'🎪'},
  webinar_attend:{l:'Attended webinar',w:20,fam:'events',ic:'🎧'},
  webinar_signup:{l:'Webinar sign-up',w:12,fam:'events',ic:'✍️'},
  content:{l:'Downloaded content',w:22,fam:'content',ic:'🎁'},
  tool:{l:'Used a tool',w:22,fam:'content',ic:'🧮'},
  email_click:{l:'Email click',w:8,fam:'email',ic:'🖱️'},
  email_open:{l:'Email open',w:3,fam:'email',ic:'👀'},
  li_accept:{l:'Connection accepted',w:9,fam:'linkedin',ic:'🔗'},
  li_reply:{l:'LinkedIn reply',w:22,fam:'linkedin',ic:'💬'},
  li_engage:{l:'Engaged with a post',w:5,fam:'linkedin',ic:'❤️'},
  ad_click:{l:'Ad click',w:8,fam:'ads',ic:'📣'},
  ad_engage:{l:'Ad engagement',w:5,fam:'ads',ic:'✨'},
  ad_view:{l:'Saw the ads',w:1,fam:'ads',ic:'👁️'},
  trigger:{l:'Trigger spotted',w:10,fam:'intel',ic:'⚡'},
  value_sent:{l:'Value sent',w:4,fam:'outbound',ic:'📨'}
};
const ACTS=[
  {k:'li_connect',l:'Connection sent',ic:'🔗',sig:null},
  {k:'li_accept',l:'Accepted',ic:'✅',sig:'li_accept'},
  {k:'li_msg',l:'LinkedIn message',ic:'💬',sig:null},
  {k:'li_reply',l:'LinkedIn reply',ic:'↩️',sig:'li_reply'},
  {k:'email',l:'Email sent',ic:'📧',sig:null},
  {k:'reply',l:'Email reply',ic:'📩',sig:'reply'},
  {k:'call',l:'Call',ic:'📞',sig:'call'},
  {k:'meeting',l:'Meeting',ic:'🤝',sig:'meeting'},
  {k:'event',l:'Event conversation',ic:'🎪',sig:'event_attend'},
  {k:'value',l:'Value sent',ic:'🎁',sig:'value_sent'}
];
const CHANNELS=[
  {k:'linkedin',l:'LinkedIn outreach',ic:'🔗',d:'Connections, messages, posts'},
  {k:'email',l:'Email sequences',ic:'📧',d:'Outreach.io, Apollo, HubSpot'},
  {k:'ads',l:'Paid ads',ic:'📣',d:'LinkedIn, Meta, Google'},
  {k:'events',l:'Events',ic:'🎪',d:'Conferences, dinners, IRL'},
  {k:'webinars',l:'Webinars',ic:'🎧',d:'Live sessions, recordings'},
  {k:'content',l:'Gated content & tools',ic:'🎁',d:'Reports, calculators, audits'},
  {k:'mail',l:'Direct mail',ic:'✉️',d:'Physical sends, gifting'},
  {k:'pr',l:'PR & thought leadership',ic:'📰',d:'Articles, podcasts, awards'},
  {k:'referrals',l:'Referrals & intermediaries',ic:'🔁',d:'Pitch consultants, partners'}
];
const BLOCKS={
  email_seq:{l:'Email sequence',ic:'📧',c:'#2c56ed',m:['Contacted','Delivered','Opened','Clicked','Replied'],src:'Outreach, Apollo, HubSpot, Lemlist',need:'outreach'},
  li_out:{l:'LinkedIn outreach',ic:'🔗',c:'#0A66C2',m:['Connections sent','Accepted','Messages','Replies'],src:'Sales Navigator, Amplify, automation tools',need:'linkedin'},
  li_ads:{l:'LinkedIn ads',ic:'📣',c:'#1f45d6',m:['Spend','Impressions','Reach','Clicks','Leads'],src:'LinkedIn Campaign Manager',need:'ads'},
  paid_social:{l:'Paid social',ic:'📱',c:'#5b6cff',m:['Spend','Reach','Clicks','Leads'],src:'Meta Ads Manager, TikTok, Google Ads'},
  content:{l:'Gated content',ic:'🎁',c:'#0b7a6a',m:['Page views','Downloads','Named downloaders','Meetings'],src:'HubSpot, Typeform, Webflow forms',need:'downloads'},
  events:{l:'Event',ic:'🎪',c:'#e0443a',m:['Invited','Attended','Conversations','Meetings'],src:'Eventbrite, Luma, your guest list',need:'events'},
  webinar:{l:'Webinar',ic:'🎧',c:'#7b5cff',m:['Registered','Attended','Questions','Follow-ups'],src:'Zoom, Livestorm, Hopin',need:'events'},
  mail:{l:'Direct mail',ic:'✉️',c:'#b07b3b',m:['Packs sent','Responses','Meetings'],src:'Your send list, Sendoso, Reachdesk'},
  pr:{l:'PR & thought leadership',ic:'📰',c:'#1f9d62',m:['Pieces live','Views','Inbound enquiries'],src:'Your coverage tracker'},
  referrals:{l:'Referrals',ic:'🔁',c:'#55524d',m:['Intros','Meetings','Briefs'],src:'Your referral log'},
  custom:{l:'Your own block',ic:'🧩',c:'#080808',m:['Metric one','Metric two','Metric three'],src:'Any spreadsheet'}
};
const CAMPAIGN_TEMPLATES=[
  {k:'insight',l:'Insight-led sprint',d:'A report or tool, then outreach and ads around it',blocks:['content','email_seq','li_out','li_ads']},
  {k:'event',l:'Event-led',d:'A dinner, roundtable or conference play',blocks:['events','li_out','email_seq']},
  {k:'always',l:'Always-on outreach',d:'Steady value-led touchpoints',blocks:['li_out','email_seq']},
  {k:'blank',l:'Start blank',d:'Pick your own blocks',blocks:[]}
];
const MODULES=[
  {k:'home',l:'Home',ic:'home',t:'Home',lock:true,d:'Everything at a glance',why:'Your morning view: revenue, performance, intent, who to contact and why, and what is new.'},
  {k:'agency',l:'Agency profile',ls:'Agency',ic:'star',t:'Agency profile',lock:true,d:'Agency profile',why:'Who you are, why clients choose you, the assets you can share and who you want to win.'},
  {k:'prospects',n:1,l:'Who to target',ls:'Who',q:'Real brands that fit, with a reason to talk',ic:'target',t:'Who to target',lock:true,d:'Who to target',why:'Real brands that fit what you sell, the decision makers inside them, and the news that makes now the right time.',out:'Your brands are ready for something useful'},
  {k:'give',n:2,l:'What to share',ls:'What',q:'Something useful, made for them',ic:'gift',t:'What to share',lock:true,d:'What to share',why:'Something genuinely useful, made for them. It earns attention a pitch never will.',out:'Your gift is ready to send'},
  {k:'reach',n:3,l:'How to reach',ls:'How',q:'Touchpoints over weeks, not a blast',ic:'send',t:'How to reach them',lock:true,d:'How to reach them',why:'Value-led, relevant and persistent touchpoints across LinkedIn, email, post and events, over weeks.',out:'Your journey is ready to launch'},
  {k:'launch',n:4,l:'Launch',ls:'Launch',q:'Check it, send it, one day at a time',ic:'rocket',t:'Launch',lock:true,d:'Launch',why:'Where the magic happens. Every message written for you, ready to send yourself or on autopilot.',out:'Every reply lands in Signals'},
  {k:'signals',l:'Signals',ic:'pulse',t:'Signals',lock:true,d:'Who is leaning in',why:'Every accept, open, click and reply, scored and ranked, so you know exactly where to focus.',out:'Warm brands become deals'},
  {k:'pipeline',l:'Pipeline',ic:'pipeline',t:'Pipeline',lock:true,d:'Pipeline',why:'Conversations become deals you track all the way to a win, against your target.',out:'What you learn shapes the next campaign'},
  {k:'team',l:'Team',ic:'people',t:'Team',lock:true,d:'The whole team',why:'Everyone’s outreach in one picture: who is reaching out to who, where each person is in the journey, and how it is turning into revenue.'},
  {k:'insights',l:'Insights',ic:'bulb',t:'Insights',lock:true,d:'Spotted by Scope & Lens',why:'News, opportunities and playbooks from Scope & Lens, so you hear about moves before everyone else.'}
];
const SYS=()=>MODULES.filter(m=>m.n);
const PAGES=['settings','admin'];
const ALIAS={today:['home'],build:['prospects'],find:['prospects'],identify:['prospects'],magnify:['prospects','people'],deploy:['reach'],journey:['reach'],value:['give'],quantify:['signals'],diversify:['signals'],amplify:['launch'],guide:['home'],revenue:['pipeline'],library:['agency','assets'],profile:['agency'],slt:['team']};
const CAMP_ROUTE={value:'give',journey:'reach',launch:'launch'};
const CSTEPS=[{k:'value',t:'What to give',q:'Something genuinely useful',ic:'gift'},{k:'journey',t:'The journey',q:'Touchpoints over weeks',ic:'send'},{k:'launch',t:'Launch',q:'Do it yourself or automate',ic:'bolt'}];
const PRESETS=[
  {k:'scope',l:'Scope & Lens',p:'#2c56ed',a:'#5eead4',bg:'#f0ede8'},
  {k:'ink',l:'Ink',p:'#14151c',a:'#5eead4',bg:'#f0ede8'},
  {k:'forest',l:'Forest',p:'#1e6b4e',a:'#f2c14e',bg:'#eff0ea'},
  {k:'coral',l:'Coral',p:'#e2533b',a:'#ffd166',bg:'#f6efe9'},
  {k:'violet',l:'Violet',p:'#6e46ff',a:'#5eead4',bg:'#f1eff6'},
  {k:'teal',l:'Teal',p:'#0b7a6a',a:'#ffb547',bg:'#edf2f0'}
];
/* ── state ─────────────────────────────────────────────────── */
function blankState(){return{
  v:8,created:new Date().toISOString(),
  setup:{done:false,agency:'',you:'',currency:'£',target:1000000,avgDeal:60000,fyMonth:1,otherRevenue:0,toured:false,guides:{},
    viewMode:'dash',profile:{discipline:'',discs:[],discOther:'',asize:'',sectors:[],csize:'auto',region:'any',roles:['cmo'],problem:'',problems:[],problemOther:''},
    offer:{uvp:'',different:'',proof:'',solution:''},
    alerts:{threshold:4,inapp:true,browser:false,email:'',digest:'daily',webhook:'',signals:['meeting','reply','li_reply','li_accept']},channels:['linkedin','email'],weekly:{}},
  brand:{logo:null,primary:'#2c56ed',accent:'#5eead4',bg:'#f0ede8',preset:'scope',mode:'light'},
  accounts:[],opps:[],campaigns:[],activity:[],tasks:[],events:[],notifications:[],cur:null,
  heatMemo:{},lastSeen:null,launch:{mode:null,connected:false,demo:true,queue:[],done:[],stats:{approved:0,skipped:0}},live:{news:{},people:{}},walked:false,passed:[],game:{xp:0,ev:[],badges:[],days:[],seenLevel:1,mDone:{}},library:{items:[],learned:null},dotDone:{},compose:{tone:'warm',len:'medium',angle:'give',inc:['news','offer','case'],humour:true,cta:'soft',sign:'Cheers',seed:0},
  log:[],uploads:{},reviews:[],reports:{}
}}
let S=null;
function load(){try{const r=localStorage.getItem(KEY)||localStorage.getItem(OLD_KEY);if(r){const p=JSON.parse(r);return migrate(p)}}catch(e){}return null}
function migrate(p){const b=blankState();if(p.v!==6&&p.v!==7&&p.v!==8){const keep={setup:{agency:p.setup.agency,you:p.setup.you,currency:p.setup.currency,target:p.setup.target,avgDeal:p.setup.avgDeal,done:p.setup.done},brand:p.brand};p=b;Object.assign(p.setup,keep.setup);if(keep.brand)p.brand=Object.assign(b.brand,keep.brand)}
  for(const k in b)if(p[k]===undefined)p[k]=b[k];for(const k in b.setup)if(p.setup[k]===undefined)p.setup[k]=b.setup[k];
  for(const k in b.setup.profile)if(p.setup.profile[k]===undefined)p.setup.profile[k]=b.setup.profile[k];for(const k in b.setup.offer)if(p.setup.offer[k]===undefined)p.setup.offer[k]=b.setup.offer[k];
  for(const k in b.brand)if(p.brand[k]===undefined)p.brand[k]=b.brand[k];p.accounts.forEach(a=>{a.people=a.people||[];a.signals=a.signals||[]});if(!p.launch.mode&&p.launch.mode!==null)p.launch.mode=null;if(!p.live)p.live={news:{},people:{}};if(!p.setup.profile.discs.length&&p.setup.profile.discipline)p.setup.profile.discs=[p.setup.profile.discipline];if(!p.setup.profile.problems.length&&p.setup.profile.problem)p.setup.profile.problems=[p.setup.profile.problem];for(const k in b.game)if(p.game[k]===undefined)p.game[k]=b.game[k];for(const k in b.compose)if(p.compose[k]===undefined)p.compose[k]=b.compose[k];if(p.launch&&p.launch.mode==='easier')p.launch.mode='amplify';if(p.v<8){p.campaigns.forEach(c=>{c.reach.steps=null;if(c.reach.ch&&!c.reach.ch.includes('workshop')&&c.reach.ch.includes('email'))c.reach.ch=c.reach.ch.concat('workshop')})}p.v=8;return p}
let saveT=null,storageWarned=false;
function save(){if(!S)return;if(typeof syncSoon==='function')syncSoon();const pill=$('#savePill');if(pill){pill.classList.add('saving');pill.querySelector('span').textContent='Saving'}
  clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(S));autoRestorePoint()}catch(e){if(!storageWarned){storageWarned=true;toast('Browser storage is full. Download a backup from Settings, Data.')}}
    if(pill){pill.classList.remove('saving');pill.querySelector('span').textContent='Saved'}},350)}
function logA(msg){S.log.unshift({ts:new Date().toISOString(),msg});S.log.length=Math.min(S.log.length,300)}
/* ── undo: every change that matters can be stepped back ────── */
const UNDO=[];
function act(label,fn,o){o=o||{};const snap=JSON.stringify(S);let r;
  try{r=fn()}catch(e){console.error(e);S=JSON.parse(snap);toast('That did not work, so nothing changed.');return}
  if(r===false){return false}
  UNDO.unshift({label,snap,ts:Date.now()});UNDO.length=Math.min(UNDO.length,40);logA(label);save();
  if(o.refresh!==false)refresh();renderUndo();
  if(!o.quiet)toast((o.ic||'✓')+' '+esc(label),o.action||{l:'Undo',f:undo},o.ms);return r}
function undo(){const u=UNDO.shift();if(!u){toast('Nothing left to undo');return}const notes=S.notifications;S=JSON.parse(u.snap);S.notifications=notes;
  applyTheme();save();closeOverlays();refresh();renderUndo();toast('↩︎ Undone: '+esc(u.label))}
function renderUndo(){const b=$('#undoBtn');if(!b)return;b.classList.toggle('show',UNDO.length>0);b.title=UNDO.length?'Undo: '+UNDO[0].label:'';b.setAttribute('data-tip',UNDO.length?'Undo: '+UNDO[0].label:'')}

/* restore points: one automatic snapshot per day, last 10 kept */
function getPoints(){try{return JSON.parse(localStorage.getItem(BK_KEY)||'[]')}catch(e){return[]}}
function autoRestorePoint(force,label){const pts=getPoints();const d=today();
  if(!force&&pts.length&&pts[0].day===d)return;
  try{pts.unshift({id:uid(),day:d,ts:new Date().toISOString(),label:label||'Automatic daily point',counts:counts(),data:JSON.stringify(S)});
    localStorage.setItem(BK_KEY,JSON.stringify(pts.slice(0,10)))}catch(e){}}
function counts(s){s=s||S;return{accounts:s.accounts.length,opps:s.opps.length,campaigns:s.campaigns.length,activity:s.activity.length}}

/* ── theme ─────────────────────────────────────────────────── */
function hexToRgb(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return[(n>>16)&255,(n>>8)&255,n&255]}
function lum(h){const[r,g,b]=hexToRgb(h).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*r+.7152*g+.0722*b}
function rgbToHex(r,g,b){return'#'+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,'0')).join('')}
function applyTheme(){if(!S)return;const b=S.brand,r=document.documentElement;
  r.style.setProperty('--brand',b.primary);r.style.setProperty('--accent',b.accent);
  const dk=b.mode==='dark';r.style.setProperty('--brand-deep',shade(b.primary,-.18));r.style.setProperty('--brand-soft',mix(b.primary,dk?'#0d0e13':'#ffffff',dk?.78:.86));r.style.setProperty('--brand-mid',mix(b.primary,dk?'#0d0e13':'#ffffff',dk?.45:.6));
  r.style.setProperty('--on-brand',lum(b.primary)>.45?'#080808':'#f0ede8');r.style.setProperty('--on-accent',lum(b.accent)>.4?'#080808':'#ffffff');
  r.dataset.mode=b.mode==='dark'?'dark':'light';
  if(b.mode!=='dark')r.style.setProperty('--bg',b.bg||'#f0ede8');else r.style.removeProperty('--bg');
  const meta=$('meta[name=theme-color]');if(meta)meta.content=b.primary}
function mix(a,b,t){const x=hexToRgb(a),y=hexToRgb(b);return rgbToHex(x[0]+(y[0]-x[0])*t,x[1]+(y[1]-x[1])*t,x[2]+(y[2]-x[2])*t)}
function shade(a,t){return t<0?mix(a,'#000000',-t):mix(a,'#ffffff',t)}
/* pull a palette out of an uploaded logo */
function extractPalette(src,cb){const img=new Image();img.onload=()=>{try{
  const c=document.createElement('canvas'),W=80,H=Math.max(1,Math.round(80*img.height/img.width));c.width=W;c.height=H;
  const x=c.getContext('2d');x.drawImage(img,0,0,W,H);const d=x.getImageData(0,0,W,H).data;const bins={};
  for(let i=0;i<d.length;i+=4){if(d[i+3]<128)continue;const r=d[i],g=d[i+1],bl=d[i+2];const mx=Math.max(r,g,bl),mn=Math.min(r,g,bl);
    const sat=mx?(mx-mn)/mx:0;if(mx>240&&mn>225)continue;if(mx<25)continue;
    const k=[r>>4,g>>4,bl>>4].join(',');bins[k]=bins[k]||{n:0,r:0,g:0,b:0,sat:0};const o=bins[k];o.n++;o.r+=r;o.g+=g;o.b+=bl;o.sat+=sat}
  const arr=Object.values(bins).map(o=>({hex:rgbToHex(o.r/o.n,o.g/o.n,o.b/o.n),score:o.n*(.35+o.sat/o.n),sat:o.sat/o.n})).sort((a,b)=>b.score-a.score);
  const out=[];arr.forEach(c=>{if(out.length<5&&!out.some(o=>dist(o.hex,c.hex)<60))out.push(c)});
  cb(out.map(o=>o.hex))}catch(e){cb([])}};img.onerror=()=>cb([]);img.src=src}
function dist(a,b){const x=hexToRgb(a),y=hexToRgb(b);return Math.hypot(x[0]-y[0],x[1]-y[1],x[2]-y[2])}

/* ── intent engine ─────────────────────────────────────────── */
const HEAT=[{min:90,n:5,l:'On fire',e:'🔥',c:'#e0443a'},{min:60,n:4,l:'Hot',e:'🔥',c:'#ff7a45'},{min:35,n:3,l:'Warm',e:'🟠',c:'#f2a93b'},{min:15,n:2,l:'Aware',e:'👀',c:'var(--brand)'},{min:0.01,n:1,l:'Stirring',e:'🌱',c:'#9aa3bc'},{min:-1,n:0,l:'Cold',e:'⚪',c:'#cfccc5'}];
function scoreAccount(a){let raw=0;const fams=new Set(),parts=[];
  (a.signals||[]).forEach(s=>{const def=SIGNALS[s.type];if(!def)return;const decay=Math.pow(.5,daysAgo(s.date)/30);
    const v=def.w*(s.qty?Math.min(4,1+Math.log2(s.qty)):1)*decay;raw+=v;if(def.fam!=='outbound')fams.add(def.fam);
    parts.push({l:def.l+(s.person?', '+s.person:''),v,date:s.date})});
  let mult=1;if(fams.size>=3)mult=1.45;else if(fams.size===2)mult=1.25;
  const camps=new Set((a.signals||[]).map(s=>s.campaign).filter(Boolean));if(camps.size>1)mult+=.15;
  const score=Math.round(raw*mult);const h=HEAT.find(x=>score>=x.min)||HEAT[HEAT.length-1];
  return{score,heat:h.n,label:h.l,colour:h.c,fams:[...fams],mult,parts:parts.sort((x,y)=>y.v-x.v),camps:[...camps]}}
function heatDots(n,lg){const h=HEAT.find(x=>x.n===n)||HEAT[5];return '<span class="heat-e h'+h.n+(lg?' lg':'')+'" title="'+h.l+'"><em>'+(h.n===5?'🔥🔥':h.e)+'</em>'+h.l+'</span>'}
function ranked(){return S.accounts.map(a=>({a,s:scoreAccount(a)})).sort((x,y)=>y.s.score-x.s.score)}
function lastTouch(a){const ds=(a.signals||[]).map(s=>s.date).concat(S.activity.filter(x=>x.accountId===a.id).map(x=>x.date));return ds.sort().pop()||a.created}
function accountById(id){return S.accounts.find(a=>a.id===id)}
function findAccountByName(n){if(!n)return null;const k=norm(n);return S.accounts.find(a=>norm(a.name)===k)||S.accounts.find(a=>{const x=norm(a.name);return x.length>4&&(k.startsWith(x)||x.startsWith(k))})}
function norm(s){return String(s||'').toLowerCase().replace(/\(.*?\)/g,' ').replace(/\b(the|ltd|limited|plc|llp|group|inc|co)\b/g,' ').replace(/[^a-z0-9]+/g,' ').trim()}
function ensureAccount(name,extra){if(!name)return null;let a=findAccountByName(name);
  if(!a){a={id:uid(),name:String(name).trim(),sector:'',size:'',stage:'find',people:[],signals:[],plays:[],notes:'',nextStep:'',watch:false,created:today(),...(extra||{})};S.accounts.push(a)}return a}
function addSignal(a,type,o){if(!a)return;o=o||{};const sig={id:uid(),type,date:o.date||today(),person:o.person||'',campaign:o.campaign||'',note:o.note||'',qty:o.qty||0,src:o.src||'manual',trig:o.trig||'',link:o.link||''};
  const dup=a.signals.find(s=>s.type===type&&s.date===sig.date&&s.person===sig.person&&s.campaign===sig.campaign);if(dup)return dup;
  a.signals.push(sig);autoStage(a);return sig}
function addPerson(a,p){if(!a||!p||!p.name)return;const k=norm(p.name);let x=a.people.find(q=>norm(q.name)===k);if(!x){x={id:uid(),name:p.name,role:p.role||'',email:p.email||''};a.people.push(x)}else{if(p.role&&!x.role)x.role=p.role;if(p.email&&!x.email)x.email=p.email}return x}
/* stage automation: the account moves itself forward as evidence arrives */
function autoStage(a){const order=STAGES.map(s=>s.k);const cur=Math.max(0,order.indexOf(a.stage));let tgt=cur;const t=new Set(a.signals.map(s=>s.type));
  const inbound=[...t].some(k=>SIGNALS[k]&&!['outbound','intel'].includes(SIGNALS[k].fam)&&k!=='ad_view');
  if(S.opps.some(o=>o.accountId===a.id&&o.lane!=='lost'))tgt=4;
  else if(['meeting','reply','call','li_reply','referral'].some(k=>t.has(k)))tgt=Math.max(tgt,3);
  else if(inbound)tgt=Math.max(tgt,2);
  else if(t.has('value_sent')||S.activity.some(x=>x.accountId===a.id))tgt=Math.max(tgt,1);
  if(tgt>cur||!a.stage)a.stage=order[tgt]}
const stIdx=a=>Math.max(0,STAGES.findIndex(s=>s.k===a.stage));
function sectorKey(a){if(a&&a.sk&&L_SECTORS[a.sk])return a.sk;const t=String((a&&a.sector)||a||'').toLowerCase();
  const R=[['retail',/retail|ecom|shop|fashion|cosmetic|pet/],['fmcg',/fmcg|food|drink|brew|coffee|grocer/],['finance',/financ|insur|bank|building society|wealth|mutual/],['travel',/travel|hospital|holiday|cruise|hotel|leisure/],['health',/health|pharma|hospice|care/],['tech',/tech|saas|software|telco|broadband/],['auto',/auto|motor|mobility/],['charity',/charit|public|educat|trust|nonprofit|rescue|nursery/],['b2b',/b2b|industr|utilit|energy|property|homes/],['media',/media|entertain|publish|sport/]];
  for(const[k,re]of R)if(re.test(t))return k;return''}
function secLabel(k){return((L_SECTORS[k]||{}).label||'').replace(' & ',' and ')}
const PROB=()=>{const P=S.setup.profile;const c=S.campaigns&&S.campaigns.find(x=>x.id===S.cur);return L_PROBLEMS[(c&&c.problem)||(P.problems&&P.problems[0])||P.problem]||L_PROBLEMS.working};
const campProb=()=>{const c=S.campaigns&&S.campaigns.find(x=>x.id===S.cur);return c&&c.problem||''};
/* engagement per channel family, for the unified view */
const CH_FAM=[
  {k:'email',l:'Email',ic:'mail',sig:['email_open','email_click','reply']},
  {k:'linkedin',l:'LinkedIn',ic:'linkedin',sig:['li_accept','li_reply','li_engage']},
  {k:'ads',l:'Ads',ic:'megaphone',sig:['ad_click','ad_engage','ad_view']},
  {k:'content',l:'Content',ic:'doc',sig:['content','tool']},
  {k:'events',l:'Events',ic:'calendar',sig:['event_attend','webinar_attend','webinar_signup']},
  {k:'convo',l:'Conversations',ic:'chat',sig:['meeting','call','referral']}];
function famOf(type){const f=CH_FAM.find(x=>x.sig.includes(type));return f?f.k:null}
function engagement(a){const out={};CH_FAM.forEach(f=>out[f.k]=0);a.signals.forEach(s=>{const k=famOf(s.type);if(!k)return;const d=SIGNALS[s.type];out[k]+=d.w*Math.pow(.5,daysAgo(s.date)/30)*(s.qty?Math.min(3,1+Math.log2(s.qty)):1)});return out}
function engagedPeople(a){const m={};a.signals.forEach(s=>{if(!s.person)return;const k=famOf(s.type);if(!k)return;(m[s.person]=m[s.person]||{name:s.person,fams:new Set(),last:s.date,n:0});m[s.person].fams.add(k);m[s.person].n++;if(s.date>m[s.person].last)m[s.person].last=s.date});return Object.values(m).sort((x,y)=>y.n-x.n)}
/* the next best step for any account */
function nextAction(a,s){s=s||scoreAccount(a);const last=a.signals.slice().sort((p,q)=>q.date.localeCompare(p.date))[0];
  if(a.stage==='opp'){const o=S.opps.find(x=>x.accountId===a.id&&x.lane!=='lost');return{ic:'pound',l:'Move the deal on',f:"openOppForm('"+(o?o.id:'')+"')"}}
  if(last&&['reply','li_reply','meeting','call'].includes(last.type)&&daysAgo(last.date)<=5)return{ic:'chat',l:'Reply to '+((last.person||a.name).split(' ')[0]),f:"openLogSheet({acc:'"+a.id+"',type:'"+(last.type==='li_reply'?'li_msg':'email')+"',person:'"+esc(last.person||'').replace(/'/g,"\\'")+"'})"};
  if(s.heat>=4)return{ic:'calendar',l:'Book a meeting',f:"openOppForm(null,'lead','"+a.id+"')"};
  if(!a.people.length)return{ic:'user',l:'Find who to speak to',f:"openAccount('"+a.id+"','people')"};
  if(s.heat>=2)return{ic:'send',l:'Follow up while warm',f:"openLogSheet({acc:'"+a.id+"',type:'li_msg'})"};
  return{ic:'send',l:'Reach out',f:"openLogSheet({acc:'"+a.id+"',type:'li_connect'})"}}
function whyLine(a,s){s=s||scoreAccount(a);const top=s.parts.slice(0,3).map(p=>p.l.split(',')[0].toLowerCase());return [...new Set(top)].join(' · ')||'no signals yet'}

/* ── pipeline maths ────────────────────────────────────────── */
function laneW(o){return o.weight!=null?o.weight:(LANES.find(l=>l.k===o.lane)||{w:0}).w}
function pipe(){const active=S.opps.filter(o=>['lead','opportunity','brief','pitch'].includes(o.lane));
  const fy=fyStart();const won=S.opps.filter(o=>o.lane==='won'&&(!o.closed||new Date(o.closed)>=fy));
  return{active,val:sum(active,o=>+o.value||0),weighted:sum(active,o=>(+o.value||0)*laneW(o)/100),won,wonVal:sum(won,o=>+o.value||0)+(+S.setup.otherRevenue||0),
    target:+S.setup.target||0}}
function fyStart(){const n=new Date();const m=(+S.setup.fyMonth||1)-1;let y=n.getFullYear();if(n.getMonth()<m)y--;return new Date(y,m,1)}
function staleOpps(){return S.opps.filter(o=>['lead','opportunity','brief','pitch'].includes(o.lane)&&(daysAgo(o.updated||o.created)>=14||!o.next))}

/* ── activity maths ────────────────────────────────────────── */
function weekActs(offset){const wk=weekKey(Date.now()-offset*7*DAY);return S.activity.filter(a=>weekKey(a.date)===wk)}
function weekCounts(offset){const out={};ACTS.forEach(a=>out[a.k]=0);weekActs(offset||0).forEach(a=>{out[a.type]=(out[a.type]||0)+(a.qty||1)});return out}
function weeklyTotals(n){const r=[];for(let i=n-1;i>=0;i--){r.push(sum(weekActs(i),a=>a.qty||1))}return r}

/* ── alerts engine ─────────────────────────────────────────── */
function notify(o){const n={id:uid(),ts:new Date().toISOString(),read:false,...o};S.notifications.unshift(n);S.notifications=S.notifications.slice(0,80);
  const A=S.setup.alerts;if(A.inapp&&!o.silent&&!o.noToast)toast((o.ic||'🔔')+' '+o.title,o.accountId?{l:'Open',f:()=>openAccount(o.accountId)}:null);
  if(A.browser&&'Notification' in window&&Notification.permission==='granted'&&!o.silent){try{new Notification(o.title,{body:o.body||'',tag:o.accountId||n.id})}catch(e){}}
  if(A.webhook&&!o.silent&&!o.noHook){try{fetch(A.webhook,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:o.title+(o.body?'\n'+o.body:'')})}catch(e){}}
  renderBell();return n}
/* compare current heat with memory, raise alerts for anything that crossed the threshold */
function checkIntent(silent){const th=+S.setup.alerts.threshold||4;const hits=[];
  S.accounts.forEach(a=>{const s=scoreAccount(a);const prev=S.heatMemo[a.id]||0;
    if(s.heat>prev&&s.heat>=th)hits.push([a,s]);
    S.heatMemo[a.id]=s.heat});
  const many=hits.length>2;
  hits.forEach(([a,s])=>notify({kind:'heat',ic:'🔥',accountId:a.id,title:a.name+' is now '+s.label.toLowerCase(),body:'Heat '+s.heat+'/5 · '+whyLine(a,s),silent,noToast:many}));
  if(many&&!silent&&S.setup.alerts.inapp)toast('🔥 '+hits.length+' accounts just crossed your alert line',{l:'See Signals',f:()=>go('signals')});
  return hits.length}
function signalAlert(a,type){const A=S.setup.alerts;if(!A.signals.includes(type))return;const d=SIGNALS[type];
  notify({kind:'signal',ic:d.ic,accountId:a.id,title:d.l+' · '+a.name,body:'Worth a same-day response'})}
