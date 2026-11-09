/* ═══════════ PITCH INTELLIGENCE: a premium layer on the prospect feed ═══════════
   Licensed data about advertisers: who is likely to pitch, who holds the account, how long for, and where spend is going.
   It is kept apart from everything else on purpose. One adapter (INTEL_SRC) loads it, one function (intelAttach) joins it
   to the prospect feed, and intelDetach() takes it all back out. Swap the adapter and nothing else needs to change.
   The data itself is never in this page: it comes from the server, and only for agencies with access. */
const INTEL={rows:[],enabled:false,src:'',at:'',access:false,available:false,count:0};
const intelOn=()=>INTEL.enabled&&INTEL.rows.length>0&&isPremium();
const INTEL_NAME='Pitch intelligence';
/* the export's column names, mapped to ours */
const INTEL_COLS={id:'id',probability:'prob',coverage:'cover',country:'country',advertiser:'adv','parent co.':'parent','parent co':'parent','top brands':'brands',category:'cat',holding:'holding',group:'group','network agency':'network',agency:'agency','last announcement date':'last','pitch coverage':'pcover','last move type':'move',assignments:'assign',media:'media',consultants:'consult',
  'total net media spend 2026 $m':'s26','offline 2026':'off26','digital 2026':'dig26','digital share 2026 %':'dshare','total net media spend 2025 $m':'s25'};
const INTEL_CAT=[[/fmcg|food|drink|beverage|alcohol|beer|spirit|confection|snack|grocery|household|personal care|toiletr|cosmetic|beauty|tobacco|pet/i,'fmcg'],[/retail|fashion|apparel|clothing|department|supermarket|e-?commerce|furniture|diy/i,'retail'],
  [/financ|bank|insur|invest|credit|payment|mortgage|pension|gambling|betting|lottery/i,'finance'],[/travel|leisure|hotel|hospitality|airline|tourism|restaurant|quick service|qsr|cruise/i,'travel'],[/pharma|health|medical|wellbeing|otc|optic/i,'health'],
  [/tech|telecom|software|electronic|computer|internet|mobile|gaming hardware/i,'tech'],[/auto|car|vehicle|motor|mobility/i,'auto'],[/government|public|charity|non.?profit|education|council/i,'charity'],[/media|entertain|publish|broadcast|stream|music|film|sport|gaming|toy/i,'media'],[/energy|utilit|industrial|b2b|service|logistic|construct|real estate|property|transport/i,'b2b']];
function intelSector(cat){for(const [re,k] of INTEL_CAT)if(re.test(cat||''))return k;return 'b2b'}
const num=v=>{if(v==null||v==='')return null;const n=parseFloat(String(v).replace(/[$£,%\s]/g,''));return isFinite(n)?n:null};
function xlDate(v){if(v==null||v==='')return '';const n=+v;if(isFinite(n)&&n>20000&&n<80000){const d=new Date(Date.UTC(1899,11,30)+n*864e5);return d.toISOString().slice(0,10)}const s=String(v).trim();
  let m=s.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);if(m)return m[1]+'-'+m[2]+'-'+(m[3]||'01');m=s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})$/);if(m){const y=m[3].length===2?'20'+m[3]:m[3];return y+'-'+String(m[2]).padStart(2,'0')+'-'+String(m[1]).padStart(2,'0')}
  const d=new Date(s);return isNaN(d)?'':d.toISOString().slice(0,10)}
/* one row, cleaned into something the rest of the portal understands */
function intelNorm(r){const prob=String(r.prob||'').toLowerCase();const s26=num(r.s26),s25=num(r.s25);let ds=num(r.dshare);if(ds!=null&&ds<=1)ds=Math.round(ds*100);
  if(ds==null&&num(r.dig26)!=null&&s26)ds=Math.round(num(r.dig26)/s26*100);
  return{id:String(r.id||r.adv),adv:String(r.adv||'').trim(),parent:r.parent||'',brands:String(r.brands||'').split(/[,;|]/).map(x=>x.trim()).filter(Boolean).slice(0,8),cat:r.cat||'',sk:intelSector(r.cat),
    prob:/high/.test(prob)?'high':/moder|medium/.test(prob)?'moderate':/review/.test(prob)?'review':prob?'other':'',holding:r.holding||'',group:r.group||'',network:r.network||'',agency:r.agency||'',last:xlDate(r.last),pcover:r.pcover||'',move:r.move||'',assign:r.assign||'',media:r.media||'',consult:r.consult||'',
    s26,s25,dshare:ds,change:s25&&s26!=null?Math.round((s26-s25)/s25*100):null}}
/* reading the export in the browser: CSV or Excel */
function csvRows(t){const out=[];let row=[],f='',q=false;for(let i=0;i<t.length;i++){const ch=t[i];if(q){if(ch==='"'){if(t[i+1]==='"'){f+='"';i++}else q=false}else f+=ch}else if(ch==='"')q=true;else if(ch===','||ch===';'&&!t.slice(0,200).includes(',')){row.push(f);f=''}else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&t[i+1]==='\n')i++;row.push(f);out.push(row);row=[];f=''}else f+=ch}if(f||row.length){row.push(f);out.push(row)}return out.filter(r=>r.some(x=>String(x).trim()))}
async function xlsxRows(buf){const z=await unzipText(buf,/^xl\/(sharedStrings\.xml|worksheets\/sheet1\.xml)$/);const ss=(z.find(x=>/sharedStrings/.test(x.name))||{txt:''}).txt;const sh=(z.find(x=>/sheet1/.test(x.name))||{txt:''}).txt;
  const dec=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'");
  const S2=[...ss.matchAll(/<si>([\s\S]*?)<\/si>/g)].map(m=>dec([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(x=>x[1]).join('')));
  const col=ref=>{const L=ref.replace(/\d+/g,'');let n=0;for(const ch of L)n=n*26+ch.charCodeAt(0)-64;return n-1};
  return [...sh.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)].map(m=>{const r=[];[...m[1].matchAll(/<c ([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)].forEach(c=>{const ref=(c[1].match(/r="([A-Z]+\d+)"/)||[])[1];const t=(c[1].match(/t="(\w+)"/)||[])[1];const inner=c[2]||'';
    let v=(inner.match(/<v>([\s\S]*?)<\/v>/)||[])[1];if(t==='s')v=S2[+v];else if(t==='inlineStr')v=dec([...inner.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(x=>x[1]).join(''));else if(v!=null)v=dec(v);if(ref)r[col(ref)]=v==null?'':v});return r})}
function rowsToIntel(rows){const hi=rows.findIndex(r=>r.some(x=>/advertiser/i.test(String(x||''))));if(hi<0)throw new Error('I could not find an Advertiser column in that file');
  const H=rows[hi].map(h=>INTEL_COLS[String(h||'').trim().toLowerCase().replace(/\s+/g,' ')]||null);
  return rows.slice(hi+1).map(r=>{const o={};H.forEach((k,i)=>{if(k)o[k]=r[i]});return o}).filter(o=>o.adv&&String(o.adv).trim())}
/* the adapter: where the rows come from. Swap this to change supplier. */
const INTEL_SRC={
  async load(){if(typeof isLive==='function'&&isLive()){try{const j=await api('intel');Object.assign(INTEL,{enabled:!!j.enabled,access:!!j.access||!!j.enabled,available:!!j.available,count:j.count||0,at:j.at||'',src:'server',rows:(j.rows||[]).map(intelNorm)});return}catch(e){}}
    if(S&&(S.setup.demo||(SESSION&&SESSION.preview))){Object.assign(INTEL,{enabled:true,access:true,available:true,src:'demo',rows:INTEL_DEMO.map(intelNorm),count:INTEL_DEMO.length,at:today()});return}
    Object.assign(INTEL,{enabled:false,rows:[],src:''})}};
/* invented sample rows for the demo, so the feature can be seen without the licensed data. Clearly labelled. */
const INTEL_DEMO=[
  {id:'d1',prob:'High',adv:'Harbourline Foods (sample)',parent:'Harbourline Group',brands:'Harbourline, Crofter’s Kitchen',cat:'FMCG',holding:'Sample Holding A',group:'Sample Group',agency:'Northgate Media (sample)',last:'2019-03-01',move:'Retained',s26:42.1,s25:36.4,dshare:58},
  {id:'d2',prob:'High',adv:'Kestrel Home (sample)',parent:'',brands:'Kestrel Home',cat:'Retail',holding:'Sample Holding B',group:'Sample Group',agency:'Ridgeway Partners (sample)',last:'2020-06-01',move:'Agency',s26:18.5,s25:21.0,dshare:71},
  {id:'d3',prob:'Moderate',adv:'Tidewell Bank (sample)',parent:'',brands:'Tidewell',cat:'Financial',holding:'Sample Holding A',group:'Sample Group',agency:'Lumen & Co (sample)',last:'2022-01-01',move:'Agency',s26:55.0,s25:49.2,dshare:64},
  {id:'d4',prob:'High',adv:'Larkspur Travel (sample)',parent:'Larkspur Holdings',brands:'Larkspur, Larkspur Breaks',cat:'Travel & Leisure',holding:'Independent',group:'',agency:'Fieldhouse (sample)',last:'2018-09-01',move:'Retained',s26:12.2,s25:10.1,dshare:77},
  {id:'d5',prob:'In review',adv:'Brambleberry Drinks (sample)',parent:'',brands:'Brambleberry',cat:'Beverages',holding:'Sample Holding C',group:'Sample Group',agency:'Copperline (sample)',last:'2021-04-01',move:'Agency',s26:9.4,s25:8.8,dshare:49},
  {id:'d6',prob:'Moderate',adv:'Moorgate Motors (sample)',parent:'',brands:'Moorgate',cat:'Automotive',holding:'Sample Holding B',group:'Sample Group',agency:'Northgate Media (sample)',last:'2026-02-01',move:'Agency',s26:31.0,s25:33.5,dshare:52},
  {id:'d7',prob:'High',adv:'Glenmore Health (sample)',parent:'',brands:'Glenmore',cat:'Pharma & Health',holding:'Independent',group:'',agency:'In-house',last:'2023-05-01',move:'In-house',s26:7.6,s25:6.1,dshare:68},
  {id:'d8',prob:'Moderate',adv:'Pennant Mobile (sample)',parent:'',brands:'Pennant',cat:'Telecoms & Tech',holding:'Sample Holding C',group:'Sample Group',agency:'Lumen & Co (sample)',last:'2017-11-01',move:'Contract-renewal',s26:24.9,s25:24.0,dshare:81}];
/* what the data says, in words people understand */
function intelSignals(r){const out=[];const yr=r.last?r.last.slice(0,4):'';const yrs=r.last?Math.max(0,Math.floor(daysAgo(r.last)/365)):null;
  if(r.prob==='high')out.push({k:'prob',hot:1,ic:'🎯',t:'High chance of a pitch'});else if(r.prob==='moderate')out.push({k:'prob',ic:'🎯',t:'Moderate chance of a pitch'});else if(r.prob==='review')out.push({k:'prob',hot:1,ic:'🔎',t:'In review'});
  const inc=r.agency&&!/in.?house/i.test(r.agency)?r.agency+(r.group||r.holding?' ('+(r.group||r.holding)+')':''):'';
  if(/in.?house/i.test(r.move+r.agency))out.push({k:'inc',ic:'🏠',t:'Took it in-house'+(yr?' in '+yr:'')});
  else if(inc)out.push({k:'inc',ic:'🤝',t:'With '+inc+(yr?' since '+yr:'')+(r.move&&!/agency/i.test(r.move)?', '+r.move.toLowerCase():'')});
  if(yrs!=null&&!/in.?house/i.test(r.move)){if(yrs>=5)out.push({k:'ten',hot:1,ic:'⏳',t:yrs+' years with the same agency. Long relationships tend to get looked at again.'});else if(yrs<1)out.push({k:'ten',ic:'🆕',t:'A new agency in the last year. There may be gaps around the edges.'})}
  if(r.change!=null&&Math.abs(r.change)>=3)out.push({k:'spend',hot:r.change>=10?1:0,ic:r.change>0?'📈':'📉',t:'Media spend '+(r.change>0?'up ':'down ')+Math.abs(r.change)+'% for 2026'+(r.s26!=null?', to $'+r.s26+'m':'')});
  if(r.dshare!=null)out.push({k:'dig',ic:'💻',t:r.dshare+'% of spend in digital'});return out}
function intelBonus(r){let b=0;const why=[];if(r.prob==='high'){b+=12;why.push(['radar','High chance of a pitch'])}else if(r.prob==='review'){b+=10;why.push(['radar','In review'])}else if(r.prob==='moderate'){b+=6;why.push(['radar','Could pitch'])}
  const yrs=r.last?daysAgo(r.last)/365:0;if(yrs>=5&&!/in.?house/i.test(r.move)){b+=4;why.push(['clock',Math.floor(yrs)+' years with one agency'])}
  if(r.change!=null&&r.change>=10){b+=3;why.push(['chart','Spend rising'])}const D=myDiscs();if(r.dshare!=null){if(r.dshare>=60&&D.some(k=>['performance','seo','digital','social','crm','data','media','ux'].includes(k)))b+=3;if(r.dshare<50&&D.some(k=>['brand','creative','experiential','design','packaging','pr','video'].includes(k)))b+=3}
  return{b,why}}
const L_SIZE_SPEND=s=>s==null?'M':s>=40?'L':s>=10?'M':'S';
/* joining the layer to the feed, and taking it back out */
function intelDetach(){for(let i=PROSPECTS.length-1;i>=0;i--){const p=PROSPECTS[i];if(p.intelOnly)PROSPECTS.splice(i,1);else delete p.intel}}
function intelAttach(){intelDetach();if(!intelOn())return;const byName=new Map(PROSPECTS.map(p=>[norm(p.name),p]));
  INTEL.rows.forEach(r=>{const keys=[r.adv,r.parent].concat(r.brands).map(norm).filter(Boolean);const hit=keys.map(k=>byName.get(k)).find(Boolean);
    if(hit){hit.intel=r;return}const p={name:r.adv,sector:r.sk,sub:(r.cat||'Advertiser')+(r.parent&&r.parent!==r.adv?' · part of '+r.parent:''),city:'UK',region:'any',size:L_SIZE_SPEND(r.s26),nt:'none',nd:'',news:'',src:'',pub:'',all:[],intelOnly:1,intel:r};PROSPECTS.push(p);byName.set(norm(p.name),p)})}
async function intelLoad(){await INTEL_SRC.load();intelAttach();if(VIEW==='prospects'||VIEW==='home')go(VIEW,VIEW_ARG,true)}
/* the feed, with the layer on top */
const _fitP=fitP;fitP=function(p){const x=_fitP(p);if(!x||!p.intel||!intelOn())return x;const k=intelBonus(p.intel);x.s=Math.min(99,x.s+k.b);x.why=k.why.slice(0,2).concat(x.why).slice(0,3);x.intel=1;return x};
function intelStrip(r,big){const sg=intelSignals(r);if(!sg.length)return '';return '<div class="bc-intel'+(big?' big':'')+'"><div class="bci-h">'+ico('radar')+'<b>'+INTEL_NAME+'</b>'+(INTEL.src==='demo'?'<span class="pill">Sample data</span>':'<span class="pill">Premium</span>')+'</div>'+sg.slice(0,big?6:3).map(s=>'<div class="bci'+(s.hot?' hot':'')+'"><span>'+s.ic+'</span>'+esc(s.t)+'</div>').join('')+'</div>'}
const _bCard=bCard;bCard=function(x,on,i){let h=_bCard(x,on,i);const p=x.p;if(p.intel&&intelOn())h=h.replace('<div class="bc-f">',intelStrip(p.intel)+'<div class="bc-f">');return h};
const _bSwipe=bSwipe;bSwipe=function(R,chosen){let h=_bSwipe(R,chosen);const m=h.match(/id="bswTop" data-n="([^"]*)"/);if(m&&intelOn()){const p=PROSPECTS.find(x=>esc(x.name)===m[1]);if(p&&p.intel)h=h.replace('<div class="bsc-why">',intelStrip(p.intel)+'<div class="bsc-why">')}return h};
const _openBrand=openBrand;openBrand=function(name){_openBrand(name);const p=PROSPECTS.find(x=>x.name===name);if(p&&p.intel&&intelOn()){const b=$('#drawer .drawer-b');if(b)b.insertAdjacentHTML('afterbegin',intelStrip(p.intel,1))}};
/* when they do not have it: a clear, honest teaser */
function intelTeaser(){if(intelOn()||!(typeof isLive==='function'&&isLive()))return '';return '<div class="lir">'+ico('radar')+'<span class="grow"><b>'+INTEL_NAME+'</b> is a premium layer: which advertisers are likely to pitch, who holds the account and for how long, and where their spend is heading. '+(INTEL.available?'Ask Scope &amp; Lens to switch it on for your agency.':'Coming soon.')+'</span><a class="btn btn-line btn-xs" href="mailto:josh@scopeandlens.com?subject=Pitch%20intelligence">Ask about it</a></div>'}
/* admin: upload the export, switch the layer on or off */
function intelAdminCard(){return '<div class="card" id="intelAdm" style="margin-top:18px"><div class="card-h"><h3>'+ico('radar')+' '+INTEL_NAME+' data</h3><span class="pill">Licensed</span></div><p class="small muted">The export is read in your browser and stored on the server. It is never part of the portal page, and only agencies you tick below can see it.</p><div id="intelAdmB" class="small" style="margin-top:10px">Loading…</div></div>'}
async function intelAdminLoad(){const el=$('#intelAdmB');if(!el)return;let j={};try{j=await api('intel')}catch(e){}
  el.innerHTML='<div class="row wrap" style="gap:10px;align-items:center"><span><b>'+(j.count||0)+'</b> advertisers loaded'+(j.at?' · '+rel(String(j.at).slice(0,10)):'')+'</span><label class="og-p"><input type="checkbox"'+(j.on?' checked':'')+' onchange="intelSwitch(this.checked)"> Switched on</label></div>'+
    '<div class="row wrap" style="gap:8px;margin-top:10px"><label class="btn btn-primary btn-sm">'+ico('upload')+'Upload the export (CSV or Excel)<input type="file" accept=".csv,.xlsx" hidden onchange="intelUpload(this.files[0])"></label>'+(j.count?'<button class="btn btn-ghost btn-sm" onclick="intelRemove()">Remove the data</button>':'')+'</div>'}
async function intelUpload(f){if(!f)return;try{toast('Reading '+esc(f.name)+'…');const rows=/\.xlsx$/i.test(f.name)?await xlsxRows(await f.arrayBuffer()):csvRows(await f.text());const R=rowsToIntel(rows);if(!R.length)throw new Error('No advertisers found');
  const j=await api('intel',{method:'POST',body:{rows:R,name:f.name}});toast('✓ '+j.count+' advertisers loaded');intelAdminLoad();intelLoad()}catch(e){toast('Could not load that: '+esc(e.message))}}
async function intelSwitch(on){try{await api('intel',{method:'POST',body:{on}});toast(on?INTEL_NAME+' is on for the agencies you have ticked':INTEL_NAME+' is off for everyone');intelLoad()}catch(e){toast('Could not change that')}}
async function intelRemove(){confirmBox('Remove the data?','Every agency loses '+INTEL_NAME+' straight away.','Remove',async()=>{try{await api('intel',{method:'DELETE'});intelAdminLoad();intelLoad()}catch(e){toast('Could not remove it')}},true)}
async function orgFlag(orgId,k,on){try{await api('users',{method:'POST',body:{action:'org',orgId,[k]:on}});toast({paid:on?'🚀 They can launch now':'Back to build only',intel:on?'🎯 '+INTEL_NAME+' on for that agency':INTEL_NAME+' off for that agency'}[k])}catch(e){toast('Could not change that')}}
