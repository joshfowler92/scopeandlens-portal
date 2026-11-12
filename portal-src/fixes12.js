/* ═══════════ v12.1 ═══════════
   1. The first-login walkthrough is back as a full step-by-step: the method, then each bot's step, then results, then the demo.
   2. Your website is read like any other asset, and feeds What we learned.
   3. Your edge in What to share comes straight from the agency profile, so nothing is asked twice.
   4. The LinkedIn scan reads the real profile, shows exactly what it read, and never scores a blank page.
   5. Your team only chats on Home. */

IC.globe='<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>';
IC.info='<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>';
/* ── 1. onboarding, one step at a time ── */
ONB_CH.splice(0,ONB_CH.length,
 {k:'hello',t:'Hello. I am <span class="serif">Plato.</span>'},
 {k:'old',t:'Most new business is <span class="serif">noise.</span>'},
 {k:'new',t:'Give before <span class="serif">you ask.</span>'},
 {k:'prospects',t:'Step 1. Who to <span class="serif">target.</span>'},
 {k:'give',t:'Step 2. What to <span class="serif">share.</span>'},
 {k:'reach',t:'Step 3. How to <span class="serif">reach them.</span>'},
 {k:'launch',t:'Step 4. <span class="serif">Launch.</span>'},
 {k:'results',t:'Then it <span class="serif">compounds.</span>'},
 {k:'demo',t:'See it done <span class="serif">properly.</span>'});
const ONB_STEP={
  prospects:{say:'I find the few brands worth your time, and the people inside them who actually decide.',
    li:['Set your prospecting preferences: sectors, size, location and the problems you solve.','Press Find prospects now. I sweep for brands that fit your agency profile.','Every brand gets a score out of 100, with the working shown, and a reason to talk now from their news.','Pick your shortlist, and I find the decision makers at each one.'],
    get:'A short list of brands with a reason to talk, and the names of the people who decide.'},
  give:{say:'I come up with something so useful they would pay for it. Then you give it away. That is the whole trick.',
    li:['Pick the one problem this campaign solves for them.','Choose a gift. Ideas come from your agency profile, your assets and the news on each brand.','Fill the content bank around it, so every touch has something worth opening.'],
    get:'One great gift, and useful content about their problem rather than your credentials.'},
  reach:{say:'I plan how you reach them: which road, how often, and when to be quiet and let them come to you.',
    li:['Choose your channels, or take the Scope & Lens route: LinkedIn, email, content, events and LinkedIn ads in the background.','I pace it over twelve weeks, one campaign a quarter. Never two emails in a week, and a content post every fortnight.','Scan your LinkedIn profile first, so it is ready for the people you are about to connect with.'],
    get:'A paced journey that feels like a relationship, not a sequence.'},
  launch:{say:'I line up today’s messages. You check them and send them. Ten minutes a day, until they reply.',
    li:['Nothing goes out until the first three steps are done.','Each morning I set out the steps that are due, every message drafted in your voice for that person and their brand.','You send each one yourself and tick it off. On Premium, Amplify can send them for you once you approve.'],
    get:'A few minutes a day, every day, with nothing left to chance.'}};
const _onbDraw121=onbDraw;onbDraw=function(){_onbDraw121();const C=ONB_CH[ONB];const b=$('#onb .onb-b');if(!b)return;
  if(ONB_STEP[C.k]){const A=AGENTS[C.k];const X=ONB_STEP[C.k];
    b.innerHTML='<div class="onb-step"><div class="os-bot">'+godBust(C.k,150)+'<b>'+esc(A.n)+'</b><small>'+esc(A.role)+'</small><p class="os-say">“'+esc(X.say)+'”</p></div>'+
      '<div class="os-r"><div class="os-k">What happens here</div><ol class="os-li">'+X.li.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ol><div class="os-get">'+ico('check')+'<span><b>What you get</b>'+esc(X.get)+'</span></div>'+
      '<div class="os-rail">'+OUT_K.map((k,i)=>'<span class="'+(k===C.k?'on':OUT_K.indexOf(C.k)>i?'dn':'')+'">'+agentFace(k,26,{badge:false})+'<i>'+esc(MODULES.find(m=>m.k===k).ls||AGENTS[k].n)+'</i></span>').join('<em></em>')+'</div></div></div>'}
  if(C.k==='results')b.innerHTML='<p class="onb-say">Every useful thing you give earns attention a pitch never will. By the time they need an agency, you are already the obvious one to call. Here is how you see it happening.</p>'+
    '<div class="onb-pr onb-res">'+[['pulse','Signals','Who is warming up, hottest first, with the reason why.'],['pound','Pipeline','Conversations become deals, tracked against your target.'],['bell','Alerts and digest','The moments that matter, by email, and a regular summary.']].map(x=>'<div>'+ico(x[0])+'<b>'+x[1]+'</b><span>'+x[2]+'</span></div>').join('')+
    '<div class="onb-plato">'+platoFace(44)+'<b>And me, bottom right</b><span>Ask me anything about Plato, or ask me to do it for you.</span></div></div>'+
    '<div class="onb-proof"><div><b>£2.5m</b><span>added to one agency’s pipeline in nine months</span></div><div><b>£55m+</b><span>new business revenue won for agencies</span></div><div><b>100+</b><span>pitches behind the method</span></div></div>'};
const _onbFinish121=onbFinish;onbFinish=function(demo){if(!ONB_REPLAY){S.onb12=1;save()}return _onbFinish121(demo)};

/* ── 2. your website, read like any other asset ── */
LIB_CATS.site=['🌐','Your website'];
let WEB_BUSY=false;
async function readWebsite(url,auto){url=String(url||agInfo().website||'').trim();if(!url){toast('Add your website in Who you are first');go('agency','who');return}
  if(DEMO_MODE||!(typeof isLive==='function'&&isLive())){toast('Your website is read once you are signed in to the live portal');return}
  if(WEB_BUSY)return;WEB_BUSY=true;if(VIEW==='agency')go(VIEW,VIEW_ARG,true);if(!auto)toast('🌐 Reading your website');
  try{const j=await api('site',{method:'POST',body:{url}});const host=(()=>{try{return new URL(j.url).hostname.replace(/^www\./,'')}catch(e){return url}})();const L=libState();
    L.items=L.items.filter(x=>x.cat!=='site');L.items.unshift({id:uid(),name:'Website: '+host,cat:'site',url:j.url,size:j.text.length,added:today(),text:j.text,words:j.text.split(/\s+/).length,pages:(j.pages||[]).length});
    agInfo().siteRead=today();agInfo().sitePages=(j.pages||[]).length;save();
    await digestLibrary(true);WEB_BUSY=false;agRefresh&&agRefresh();if(VIEW==='agency')go(VIEW,VIEW_ARG,true);toast('Read '+((j.pages||[]).length)+' pages of '+esc(host)+'. It is in What we learned.')}
  catch(e){WEB_BUSY=false;if(VIEW==='agency')go(VIEW,VIEW_ARG,true);toast(esc(e.message||'Could not read the website'))}}
const _setAg121=setAg;setAg=function(k,v){const old=agInfo()[k];_setAg121(k,v);if(k==='website'&&v&&v!==old&&!DEMO_MODE&&typeof isLive==='function'&&isLive())setTimeout(()=>readWebsite(v,true),200)};
function webCard(){const I=agInfo();const it=libState().items.find(x=>x.cat==='site');
  if(WEB_BUSY)return '<div class="card webc busy">'+ico('loop')+'<div class="grow"><b>Reading your website</b><small>Home page, about, work, services and team. This takes a few seconds.</small></div></div>';
  if(!I.website)return '<div class="card webc">'+ico('globe')+'<div class="grow"><b>Add your website</b><small>Put it in Who you are and I will read it, along with anything you upload.</small></div><button class="btn btn-line btn-sm" onclick="go(\'agency\',\'who\')">Add it</button></div>';
  if(it)return '<div class="card webc done">'+ico('globe')+'<div class="grow"><b>Your website is read</b><small>'+esc(I.website)+(it.pages?' · '+it.pages+' pages':'')+' · '+fmtDate(it.added)+'</small></div><button class="btn btn-ghost btn-sm" onclick="readWebsite()">'+ico('loop')+'Read it again</button></div>';
  return '<div class="card webc">'+ico('globe')+'<div class="grow"><b>Read '+esc(I.website)+'</b><small>I will pull out what you do best, proof, clients, awards and how you work.</small></div><button class="btn btn-primary btn-sm" onclick="readWebsite()">Read my website</button></div>'}
const _vLib121=VIEWS.library;VIEWS.library=()=>_vLib121().replace('<div class="libg"><div>','<div class="libg"><div>'+webCard());
/* everything the AI finds, including clients, awards, the team and how they work, plus anything only the browser spotted */
digestLibrary=async function(silent){const L=libState();if(!L.items.some(x=>x.text)){L.learned=null;save();return null}
  const loc=localDigest();let d=null;
  if(await apiCheck()&&API_INFO.ai){try{const j=await api('digest',{method:'POST',body:{agency:S.setup.agency,docs:L.items.filter(x=>x.text).map(x=>({name:x.name,cat:x.cat==='site'?'website':x.cat,text:x.text.slice(0,15000)}))}});
    if(j&&j.learned){const a=j.learned;const arr=v=>(Array.isArray(v)?v:[]).filter(Boolean).map(x=>typeof x==='string'?x.replace(/—/g,','):x);const un=(x,y,n)=>[...new Set(arr(x).concat(y||[]))].slice(0,n);
      d={uvp:arr(a.uvp),different:arr(a.different),offer:arr(a.offer),proofs:arr(a.proofs).map(p=>typeof p==='string'?{text:p,sector:sectorOf(p)}:{text:String(p.text||''),sector:p.sector||sectorOf(String(p.text||''))}).filter(p=>p.text),
        cases:arr(a.cases).filter(c=>c&&c.title),services:arr(a.services).filter(k=>DISC[k]),sectors:arr(a.sectors).filter(k=>L_SECTORS[k]),voice:a.voice||'',by:'ai',ts:new Date().toISOString(),
        clients:un(a.clients,loc.clients,16),awards:un(a.awards,loc.awards,6),team:un(a.team,loc.team,6),method:un(a.method,loc.method,6)};
      ['uvp','different','offer'].forEach(k=>{if(!d[k].length)d[k]=loc[k]||[]});if(!d.proofs.length)d.proofs=loc.proofs||[];if(!d.cases.length)d.cases=loc.cases||[];
      d.pick={uvp:0,diff:0,offer:0,proofs:d.proofs.slice(0,4).map((x,i)=>i),clients:d.clients.slice(0,6).map((x,i)=>i),awards:d.awards.length?[0]:[],team:d.team.length?[0]:[],method:d.method.length?[0]:[],cases:d.cases.map((x,i)=>i)}}}catch(e){}}
  if(!d)d=loc;L.learned=d;save();if(!silent)toast('📚 Read '+L.items.length+' file'+(L.items.length===1?'':'s'));return d};

/* ── 3. your edge: straight from the agency profile ── */
function edgeOf(){const O=S.setup.offer,I=agInfo(),d=libState().learned||{};const pk=(k,arr)=>{const p=d.pick&&d.pick[k];const a=arr||[];return a[typeof p==='number'?p:0]||''};const many=(k,arr,n)=>{const p=(d.pick&&d.pick[k])||[];return (arr||[]).filter((x,i)=>p.includes(i)).slice(0,n)};
  return{best:(O.uvp||'').trim()||pk('uvp',d.uvp),why:(O.different||'').trim()||pk('diff',d.different),proof:(O.proof||'').trim()||((libProofs()[0]||{}).text||''),first:(O.solution||'').trim()||pk('offer',d.offer),
    clients:(I.clients||'').trim()||many('clients',d.clients,6).join(', '),awards:(I.awards||'').trim()||many('awards',d.awards,1).join(''),pov:(I.pov||'').trim(),team:(I.team||'').trim()||many('team',d.team,1).join('')}}
const _thinkCard121=thinkCard;thinkCard=function(c){const E=edgeOf();return _thinkCard121(c).replace(/<div class="cx-n dim"><span class="cx-ic">(<svg[\s\S]*?<\/svg>)<\/span><small>Your edge<\/small><b>[^<]*<\/b>(<button[^>]*>Add it<\/button>)?<\/div>/,'<div class="cx-n'+(E.why||E.best?'':' dim')+'"><span class="cx-ic">$1</span><small>Your edge</small><b>'+esc(E.why||E.best||'From your agency profile')+'</b></div>')};
const _valueView121=valueView;valueView=function(c){const h=_valueView121(c);const E=edgeOf();const i=h.indexOf('<aside class="card sticky offer12"');if(i<0)return h;const j=h.indexOf('</aside>',i);
  const rows=[['star','What you do best',E.best],['bolt','Why you, not them',E.why],['check','Proof',E.proof],['bulb','Your first offer',E.first],['people','Clients',E.clients],['trophy','Recognition',E.awards],['flag','What you believe',E.pov]].filter(x=>x[2]);
  return h.slice(0,i)+'<aside class="card sticky offer12" data-tour="offer"><div class="card-h"><h3>Your edge</h3></div><p class="small muted" style="margin-bottom:12px">Pulled from your agency profile and your assets. Muse uses it in every gift and every message.</p>'+
    rows.map(x=>'<div class="ofl"><span>'+ico(x[0])+'</span><div><small>'+x[1]+'</small><p>'+esc(x[2])+'</p></div></div>').join('')+'<button class="link tiny" style="margin-top:6px" onclick="go(\'agency\',\'value\')">Change it in your agency profile</button></aside>'+h.slice(j+8)};

/* ── 4. the LinkedIn scan: read the real profile, show what was read, then score it ── */
function liLocalText(text){const L=String(text||'').split('\n').map(s=>s.trim()).filter(Boolean);return L.length?{name:'',headline:L[0],about:L.slice(1).join(' ')}:null}
liScan=async function(){const url=(($('#liUrl')||{}).value||'').trim();const text=(($('#liTxt')||{}).value||'').trim();
  if(!/linkedin\.com\/in\//i.test(url)&&!text){toast('Paste your LinkedIn profile link, like linkedin.com/in/your-name');return}
  const btn=$('#liGo');if(btn){btn.disabled=true;btn.innerHTML=ico('loop')+'Reading your profile'}
  let prof=null,src='';const live=typeof isLive==='function'&&isLive()&&!DEMO_MODE;
  if(DEMO_MODE){prof={name:'Sam Patel (demo)',headline:'Managing Partner at Northgate and Co',location:'London',about:'We are an independent brand and creative agency. We work with ambitious brands across financial services, retail and travel. Get in touch to find out more.',experience:['Managing Partner at Northgate and Co','Business Director at a London creative agency'],featured:0,activity:20};src='the demo'}
  else if(live){try{const j=await api('liscan',{method:'POST',body:{step:'read',url,text}});prof=j.profile||null;src=j.source||''}catch(e){toast(esc(e.message||'Could not read that profile'))}}
  else if(text){prof=liLocalText(text);src='what you pasted'}
  if(btn){btn.disabled=false;btn.innerHTML=ico('eye')+'Scan my profile'}
  if(!prof||!(prof.headline||prof.about)){S.liScan={url,text,ts:new Date().toISOString(),score:0,blocked:true};save();go(VIEW,VIEW_ARG,true);return}
  const T=liTarget();const resP=live&&API_INFO&&API_INFO.ai?api('liscan',{method:'POST',body:{step:'score',profile:prof,target:T,agency:S.setup.agency,offer:S.setup.offer,gift:(toolById(curCamp().assets[0])||{}).n||''}}).then(j=>j&&j.result||null).catch(()=>null):Promise.resolve(null);
  liShow(url,text,prof,resP,src)};
liShow=function(url,text,prof,resP,src){const o=document.createElement('div');o.className='liscan-o';o.setAttribute('role','dialog');o.setAttribute('aria-label','Scanning your LinkedIn profile');
  const nm=prof.name||'Your name',hd=prof.headline||'',ab=prof.about||'',ph=prof.photoUrl||myPhoto();
  o.innerHTML='<div class="lso-in"><div class="lso-h">'+agentFace('reach',36,{badge:false})+'<div class="grow"><b>Reading '+(prof.name?esc(prof.name.split(' ')[0])+'’s':'your')+' profile the way they will</b><small id="lsoS">Where their eyes go first</small></div></div>'+
    '<div class="lso-p" id="lsoP"><div class="lp-ban"></div><div class="lp-av">'+(ph?'<img src="'+esc(ph)+'" alt="" referrerpolicy="no-referrer" onerror="this.remove()">':'')+'</div><div class="lp-n">'+esc(nm)+'</div><div class="lp-h">'+esc(hd.slice(0,140))+'</div>'+(prof.location?'<div class="lp-loc">'+esc(prof.location)+'</div>':'')+
      '<div class="lp-sec"><b>About</b>'+(ab?'<p class="lp-t">'+esc(ab.slice(0,330))+(ab.length>330?'…':'')+'</p>':'<p class="lp-t muted">Nothing in your About section that we could see.</p>')+'</div>'+
      '<div class="lp-sec"><b>Experience</b>'+((prof.experience||[]).length?'<ul class="lp-x">'+prof.experience.slice(0,3).map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'<p class="lp-t muted">Not visible to us.</p>')+'</div>'+
      '<canvas id="lsoHeat"></canvas><div class="lso-line"></div><div class="lso-eye" id="lsoEye"></div></div></div>';
  document.body.appendChild(o);requestAnimationFrame(()=>o.classList.add('on'));
  const box=$('#lsoP');const cv=$('#lsoHeat');const r=box.getBoundingClientRect();cv.width=r.width;cv.height=r.height;const ctx=cv.getContext('2d');const eye=$('#lsoEye');
  const P=[[.12,.3],[.45,.31],[.82,.33],[.18,.43],[.5,.45],[.14,.55],[.42,.56],[.7,.57],[.15,.68],[.35,.7],[.6,.71],[.14,.82],[.38,.84],[.16,.93],[.5,.94]].map(([x,y])=>[x*r.width,y*r.height]);
  const msgs=['Where their eyes go first',(hd?'Your headline: “'+hd.slice(0,48)+(hd.length>48?'…':'')+'”':'Your name and headline'),'Reading your About section','Looking for proof','Checking your experience','Scoring it for '+liTarget().sec+' buyers'];let i=0;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dot=(x,y,rad,a)=>{const g=ctx.createRadialGradient(x,y,0,x,y,rad);g.addColorStop(0,'rgba(255,90,40,'+a+')');g.addColorStop(.45,'rgba(255,190,40,'+a*.6+')');g.addColorStop(1,'rgba(255,220,80,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,rad,0,7);ctx.fill()};
  const fin=async()=>{$('#lsoS').textContent='Working out what to change';const res=(await resP)||liScore(url,[hd,ab].join('\n'),prof);
    S.liScan={url,text,ts:new Date().toISOString(),score:res.score,sugg:res.sugg,name:prof.name||'',src,profile:{name:prof.name||'',headline:hd,location:prof.location||'',about:ab.slice(0,600),experience:(prof.experience||[]).slice(0,3)}};save();
    o.classList.remove('on');setTimeout(()=>o.remove(),300);go(VIEW,VIEW_ARG,true);toast('Scored '+res.score+' out of 100. '+res.sugg.length+' things to change.')};
  const tick=()=>{if(i>=P.length){setTimeout(fin,reduce?100:500);return}const[x,y]=P[i];eye.style.transform='translate('+x+'px,'+y+'px)';dot(x,y,i<3?62:44,i<3?.42:.3);$('#lsoS').textContent=msgs[Math.min(msgs.length-1,Math.floor(i/2.6))];i++;setTimeout(tick,reduce?40:330)};
  setTimeout(tick,reduce?0:500)};
const _liScanCard121=liScanCard;liScanCard=function(c){const L=S.liScan;
  if(L&&L.blocked){const h=_liScanCard121(c);
    return h.replace('<div class="lisc-f">','<div class="li-warn">'+ico('info')+'<span><b>LinkedIn would not show us that profile.</b> Some profiles are private to people who are signed in. For an exact read, open your profile on LinkedIn, press More, then Save to PDF, and upload it below.</span></div><div class="lisc-f">').replace('<details class="lisc-more">','<details class="lisc-more" open>').replace(/onclick="liScan\(\)">/,'id="liGo" onclick="liScan()">')}
  let h=_liScanCard121(c).replace(/<button class="btn btn-primary" onclick="liScan\(\)">/,'<button class="btn btn-primary" id="liGo" onclick="liScan()">');
  if(L&&L.score&&L.profile){const P=L.profile;h=h.replace('<div class="lisc-s">','<div class="li-read"><div class="lab">What we read'+(L.src?' <span class="muted">· from '+esc(L.src)+'</span>':'')+'</div><b>'+esc(P.name||'')+'</b>'+(P.headline?'<p>'+esc(P.headline)+'</p>':'')+(P.location?'<small>'+esc(P.location)+'</small>':'')+(P.about?'<p class="small muted">'+esc(P.about.slice(0,220))+(P.about.length>220?'…':'')+'</p>':'')+'<button class="link tiny" onclick="S.liScan.score=0;S.liScan.blocked=false;go(VIEW,VIEW_ARG,true);setTimeout(()=>{const d=$(\'.lisc-more\');if(d)d.open=true},80)">Not right? Upload your LinkedIn PDF for an exact read</button></div><div class="lisc-s">')}
  return h};

/* ── 5. your team chats on Home, quietly ── */
function crewHome(c){if(!c||isBlankCamp(c))return '';const k=OUT_K.find(x=>campStepState(c,x)!==2)||'launch';const L=crewChat(k).slice(0,3);if(!L.length)return '';
  return '<div class="crew home-crew" aria-label="The crew, talking about '+esc(c.name)+'"><span class="hc-k">Overheard on '+esc(c.name)+'</span>'+L.map((x,i)=>'<div class="crw" style="--d:'+(.3+i*.5)+'s">'+agentFace(x[0],20,{badge:false})+'<span><b>'+esc(AGENTS[x[0]].n)+'</b>'+esc(x[1])+'</span></div>').join('')+'</div>'}
const _crewRelay121=crewRelay;crewRelay=function(c){const h=_crewRelay121(c);return h.replace(/<\/section>$/,crewHome(c)+'</section>')};
