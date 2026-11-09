/* ═══════════ v12 HOW TO REACH ═══════════
   Nothing is chosen until you choose it. The Scope & Lens route now includes content and LinkedIn ads.
   Content shows up every two weeks from week one. A LinkedIn profile scanner replaces the checklist.
   Events are soonest first, with each event's own picture. */
['social'].forEach(k=>{if(!REC_CH.includes(k))REC_CH.push(k)});
const _rcSocial=REACH_CH.find(x=>x.k==='social');if(_rcSocial)_rcSocial.l='Content';
CH_WHY.social='Post your thinking every two weeks, from week one, and share it with the people who engage. It is proof, out in the open.';
const _newCamp12=newCamp;newCamp=function(name){const c=_newCamp12(name);c.reach.ch=[];c.reach.ads=false;c.reach.steps=[];return c};
recommendMix=function(){const c=curCamp();act('Using the Scope & Lens route',()=>{c.reach.ch=REC_CH.slice();c.reach.ads=true;c.reach.weeks=Math.max(8,c.reach.weeks);c.reach.steps=genSteps(c)},{refresh:false,ic:'✨'});go('reach',null,true)};
isRecMix=function(R){return REC_CH.every(k=>R.ch.includes(k))&&!!R.ads};
/* content: a post every other week, from week one */
const _planSteps12=planSteps;planSteps=function(ch,W,pace){const base=_planSteps12(ch.filter(k=>k!=='social'),W,pace);if(!ch.includes('social'))return base;
  const out=base.slice();for(let w=1;w<=W;w+=2)out.push({w,ch:'social',t:w===1?'Post about the problem you solve':'Post again, and share it with anyone who engaged',task:1,warm:0,nonote:0,accept:0,lib:7,content:1});
  return out.sort((a,b)=>a.w-b.w||STEP_ORDER(a)-STEP_ORDER(b))};
const _journeyView12=journeyView;journeyView=function(c){const R=c.reach;let h=_journeyView12(c).replace(liReadyCard(c),'');
  if(!R.ch.length)h='<div class="pickch">'+agentFace('reach',44,{badge:false})+'<div class="grow"><b>Choose how you will show up</b><p>Tap the channels you want below, or take the Scope &amp; Lens route: LinkedIn, email, content every two weeks, events, a workshop, something in the post, a warm call when they engage, and LinkedIn ads running quietly in the background.</p></div><button class="btn btn-primary" onclick="recommendMix()">✨ Use the Scope &amp; Lens route</button></div>'+h;
  return liScanCard(c)+h};

/* ── LinkedIn profile scanner ── */
function liTarget(){const P=S.setup.profile;const A=liAud();return{roles:(P.roles||[]).map(r=>L_ROLES[r]?L_ROLES[r].label:r),sectors:(P.sectors||[]).map(secLabel),problem:PROB().short,sec:A.sec}}
function liScanCard(c){const L=S.liScan;const T=liTarget();
  if(!L||!L.score)return '<div class="card lisc" data-tour="liscan"><div class="lisc-l">'+agentFace('reach',44,{badge:false})+'<div class="grow"><div class="lab" style="margin:0">Before you connect with anyone</div><h3>How ready is your LinkedIn profile?</h3><p class="small">They will look you up before they accept. Paste your profile link and I will read it the way a '+esc((T.roles[0]||'marketing lead').toLowerCase())+' at a '+esc(T.sec)+' brand would, then score it and tell you what to change.</p></div></div>'+
    '<div class="lisc-f"><input class="inp" id="liUrl" placeholder="linkedin.com/in/your-name" value="'+esc((L&&L.url)||'')+'" onkeydown="if(event.key===\'Enter\')liScan()"><button class="btn btn-primary" onclick="liScan()">'+ico('eye')+'Scan my profile</button></div>'+
    '<details class="lisc-more"><summary>Add your headline and About section for a deeper read</summary><p class="tiny muted">LinkedIn does not let other sites read every part of a profile. Paste these in, or upload the PDF from your profile\u2019s More menu, Save to PDF.</p><textarea class="inp" id="liTxt" rows="4" placeholder="Paste your headline and About section">'+esc((L&&L.text)||'')+'</textarea><label class="btn btn-ghost btn-xs" style="margin-top:8px">'+ico('upload')+'Upload the PDF<input type="file" accept="application/pdf" hidden onchange="liPdf(this.files[0])"></label></details></div>';
  const done=L.sugg.filter(s=>s.done).length;
  return '<div class="card lisc res" data-tour="liscan"><div class="lisc-r">'+ringPct(L.score,72)+'<div class="grow"><div class="lab" style="margin:0">Your LinkedIn profile, through their eyes</div><h3>'+(L.score>=75?'Ready to connect':L.score>=55?'Nearly there':'Worth fixing before you connect')+'</h3><p class="small">Scored for '+esc(T.roles.slice(0,2).join(' and ').toLowerCase()||'marketing leaders')+' at '+esc(T.sectors.slice(0,2).join(' and ')||'your')+' brands. '+(L.name?esc(L.name)+', s':'S')+'canned '+rel(L.ts.slice(0,10))+(L.src?' from '+esc(L.src):'')+'.</p></div><button class="btn btn-ghost btn-sm" onclick="S.liScan.score=0;go(VIEW,VIEW_ARG,true)">'+ico('loop')+'Scan again</button></div>'+
    '<div class="lisc-s"><div class="lab">Do these and you will not need a note when you connect <span class="muted">· '+done+' of '+L.sugg.length+' done</span></div>'+L.sugg.map((s,i)=>'<label class="lis'+(s.done?' on':'')+'"><input type="checkbox"'+(s.done?' checked':'')+' onchange="liDone('+i+',this.checked)"><span><b>'+esc(s.t)+'</b><small>'+esc(s.d)+'</small>'+(s.copy?'<span class="lis-c">'+esc(s.copy)+'<button class="btn btn-xs btn-line" onclick="event.preventDefault();copyText(\''+esc(s.copy).replace(/'/g,"\\'")+'\',this)">Copy</button></span>':'')+'</span></label>').join('')+'</div></div>'}
function liDone(i,on){const L=S.liScan;L.sugg[i].done=on;const all=L.sugg.every(s=>s.done);save();if(all){award&&award('li','LinkedIn profile ready');toast('Profile ready. You can connect without a note.')}go(VIEW,VIEW_ARG,true)}
async function liPdf(f){if(!f)return;try{toast('Reading your profile PDF');const t=await readPdfText(f);const ta=$('#liTxt');if(ta){ta.value=t.slice(0,6000);ta.closest('details').open=true}toast('Got it. Now press Scan my profile.')}catch(e){toast('Could not read that PDF')}}
async function readPdfText(f){const buf=await f.arrayBuffer();const lib=await loadPdfJs();const pdf=await lib.getDocument({data:buf}).promise;let out='';for(let i=1;i<=Math.min(pdf.numPages,4);i++){const pg=await pdf.getPage(i);const tc=await pg.getTextContent();out+=tc.items.map(x=>x.str).join(' ')+'\n'}return out}
async function liScan(){const url=($('#liUrl')||{}).value||'';const text=(($('#liTxt')||{}).value||'').trim();
  if(!/linkedin\.com\/in\//i.test(url)&&!text){toast('Paste your LinkedIn profile link, like linkedin.com/in/your-name');return}
  const T=liTarget();let prof=null;let src='';
  if(typeof isLive==='function'&&isLive()&&!DEMO_MODE){try{const j=await api('liscan',{method:'POST',body:{url,text,target:T,agency:S.setup.agency,offer:S.setup.offer,gift:(toolById(curCamp().assets[0])||{}).n||''}});prof=j.profile||null;src=j.source||'';if(j.result){liShow(url,text,prof,j.result,src);return}}catch(e){}}
  if(!prof&&DEMO_MODE)prof={name:'Sam Patel (demo)',headline:'Managing Partner at Northgate and Co',about:'We are an independent brand and creative agency. We work with ambitious brands across financial services, retail and travel. Get in touch to find out more.',custom:true,photo:true,featured:0,activity:20};
  liShow(url,text,prof,liScore(url,text,prof),src||(DEMO_MODE?'the demo':'what you pasted'))}
const acr=t=>String(t||'').replace(/\bfmcg\b/gi,'FMCG').replace(/\bb2b\b/gi,'B2B');
/* the scoring, done in the browser when the server has nothing more to add */
function liScore(url,text,prof){const T=liTarget();const O=S.setup.offer;const A=liAud();const P=PROB();const g=toolById(curCamp().assets[0]);
  const head=((prof&&prof.headline)||text.split('\n')[0]||'').trim();const about=((prof&&prof.about)||text).trim();const low=(head+' '+about).toLowerCase();
  const secW=T.sectors.flatMap(s=>s.toLowerCase().split(/[ ,&]+/)).filter(w=>w.length>3);const roleW=['cmo','marketing','brand','growth','ecommerce','insight','founder'];
  const probW=String(P.short||'').toLowerCase().split(/\s+/).filter(w=>w.length>4);
  const chk=[
    {k:'who',w:20,ok:/help|for |work with/.test(head.toLowerCase())&&(secW.some(w=>head.toLowerCase().includes(w))||roleW.some(w=>head.toLowerCase().includes(w))),t:'Say who you help in your headline',d:'Right now it reads as a job title. It sits next to your name on every request, so make it about them.',copy:'Helping '+acr(A.sec)+' brands fix '+(P.short||'growth that has stalled')+' | '+(S.setup.agency||'')},
    {k:'prob',w:15,ok:probW.some(w=>low.includes(w)),t:'Name the problem you solve',d:'Use their words for it: '+P.short+'. People accept the ones who understand their problem.'},
    {k:'open',w:15,ok:about.length>60&&secW.some(w=>about.slice(0,220).toLowerCase().includes(w)),t:'Open your About section with their problem',d:'Two lines in, they should think: that is us.',copy:cap1(acr(A.sec))+' marketing teams usually come to us when '+(P.label?P.label.charAt(0).toLowerCase()+P.label.slice(1):'growth stalls')+'. '+(O.solution?cap1(O.solution.replace(/\.$/,''))+' is how we start.':'')},
    {k:'proof',w:15,ok:/\d/.test(about)&&/%|£|\bx\b|times|grew|lift|increase|won/i.test(about),t:'Add one result with a number',d:'Proof beats promise. One specific result does more than a list of services.',copy:O.proof||''},
    {k:'gift',w:10,ok:!!(prof&&prof.featured),t:'Pin '+(g?g.n:'your gift')+' in your Featured section',d:'So the first thing they see is something useful, not a sales pitch.'},
    {k:'cta',w:10,ok:/message me|get in touch|book|say hello|drop me|email me|let'?s talk/i.test(about),t:'End with one easy next step',d:'A low-pressure line, like: Happy to share the '+(g?g.n.toLowerCase():'work')+' if useful.'},
    {k:'url',w:5,ok:!url||!/\d{3,}|-[a-f0-9]{6,}/i.test(url.split('/in/')[1]||''),t:'Claim a clean profile link',d:'linkedin.com/in/your-name looks cared for. Random numbers look like a fake account.'},
    {k:'post',w:10,ok:!!(prof&&prof.activity!=null&&prof.activity<=30),t:'Post about '+(P.short||'the problem')+' this week',d:'A recent post shows you think about their world. It is what they read after your name.'}];
  const known=chk.filter(x=>!(x.k==='gift'&&!prof)&&!(x.k==='post'&&!(prof&&prof.activity!=null)));const got=known.filter(x=>x.ok).reduce((a,x)=>a+x.w,0),max=known.reduce((a,x)=>a+x.w,0);
  const score=Math.round(got/max*100);const sugg=chk.filter(x=>!x.ok).slice(0,5);while(sugg.length<3){const extra=chk.find(x=>!sugg.includes(x)&&x.k!=='url');if(!extra)break;sugg.push(Object.assign({},extra,{t:'Keep: '+extra.t.toLowerCase(),d:'Already there. Keep it current.'}))}
  return{score:Math.max(8,score),sugg:sugg.map(x=>({k:x.k,t:x.t,d:x.d,copy:x.copy||'',done:false})),hot:chk.filter(x=>x.ok).map(x=>x.k)}}
function liShow(url,text,prof,res,src){const o=document.createElement('div');o.className='liscan-o';o.setAttribute('role','dialog');o.setAttribute('aria-label','Scanning your LinkedIn profile');
  const nm=(prof&&prof.name)||'Your name',hd=(prof&&prof.headline)||text.split('\n')[0]||'Your headline';
  o.innerHTML='<div class="lso-in"><div class="lso-h">'+agentFace('reach',36,{badge:false})+'<div class="grow"><b>Reading your profile the way they will</b><small id="lsoS">Where their eyes go first</small></div></div>'+
    '<div class="lso-p" id="lsoP"><div class="lp-ban"></div><div class="lp-av">'+(myPhoto()?'<img src="'+myPhoto()+'" alt="">':'')+'</div><div class="lp-n">'+esc(nm)+'</div><div class="lp-h">'+esc(hd.slice(0,110))+'</div><div class="lp-l w60"></div>'+
      '<div class="lp-sec"><b>About</b><div class="lp-l"></div><div class="lp-l"></div><div class="lp-l w80"></div></div><div class="lp-sec"><b>Featured</b><div class="lp-f"><i></i><i></i><i></i></div></div><div class="lp-sec"><b>Experience</b><div class="lp-l w70"></div><div class="lp-l w50"></div></div>'+
      '<canvas id="lsoHeat"></canvas><div class="lso-line"></div><div class="lso-eye" id="lsoEye"></div></div></div>';
  document.body.appendChild(o);requestAnimationFrame(()=>o.classList.add('on'));
  const box=$('#lsoP');const cv=$('#lsoHeat');const r=box.getBoundingClientRect();cv.width=r.width;cv.height=r.height;const ctx=cv.getContext('2d');const eye=$('#lsoEye');
  /* an F-shaped reading pattern: across the top, down the left, a shorter sweep, then down */
  const P=[[.12,.3],[.45,.31],[.82,.33],[.18,.43],[.5,.45],[.14,.55],[.42,.56],[.7,.57],[.15,.68],[.35,.7],[.6,.71],[.14,.82],[.38,.84],[.16,.93],[.5,.94]].map(([x,y])=>[x*r.width,y*r.height]);
  const msgs=['Where their eyes go first','Your name and headline','Reading your About section','Looking for proof','Checking what you have pinned','Scoring it for '+liTarget().sec+' buyers'];let i=0;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dot=(x,y,rad,a)=>{const g=ctx.createRadialGradient(x,y,0,x,y,rad);g.addColorStop(0,'rgba(255,90,40,'+a+')');g.addColorStop(.45,'rgba(255,190,40,'+a*.6+')');g.addColorStop(1,'rgba(255,220,80,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,rad,0,7);ctx.fill()};
  const tick=()=>{if(i>=P.length){setTimeout(fin,reduce?100:600);return}const[x,y]=P[i];eye.style.transform='translate('+x+'px,'+y+'px)';dot(x,y,i<3?62:44,i<3?.42:.3);const m=msgs[Math.min(msgs.length-1,Math.floor(i/2.6))];$('#lsoS').textContent=m;i++;setTimeout(tick,reduce?40:330)};
  const fin=()=>{S.liScan={url,text,ts:new Date().toISOString(),score:res.score,sugg:res.sugg,name:prof&&prof.name||'',src};save();o.classList.remove('on');setTimeout(()=>o.remove(),300);go(VIEW,VIEW_ARG,true);toast('Scored '+res.score+' out of 100. '+res.sugg.length+' things to change.')};
  setTimeout(tick,reduce?0:500)}

/* ── events: soonest first, with pictures ── */
UK_EVENTS.splice(0,UK_EVENTS.length,
  {n:'Inspiration: The Global Conference',by:'The Marketing Society',d:'2026-11-11',v:'QEII Centre, London',s:['retail','fmcg','finance','travel','health','tech','auto','charity','b2b','media'],u:'https://marketingsociety.com/event/inspiration-global-conference-2026-england'},
  {n:'B2B Marketing Live',d:'2026-11-18',e:'2026-11-19',v:'ExCeL London',s:['b2b','tech'],u:'https://www.excel.london/whats-on/b2b-marketing-live'},
  {n:'DMA Awards Night',by:'DMA',d:'2026-12-01',v:'Old Billingsgate, London',s:['retail','finance','charity','travel','tech','media','b2b','fmcg'],u:'https://www.dma.org.uk/learning-and-events/events/events-webinars/dma-awards-night-2026'},
  {n:'Toy Fair',d:'2027-01-19',e:'2027-01-21',v:'Olympia London',s:['retail','fmcg','media'],u:'https://www.toyfair.co.uk/'},
  {n:'Pure London at Spring Fair',d:'2027-02-07',e:'2027-02-10',v:'NEC Birmingham',s:['retail'],u:'https://purelondon.com/opening-times'},
  {n:'Packaging Innovations and Empack',d:'2027-02-24',e:'2027-02-25',v:'NEC Birmingham',s:['fmcg','retail','health'],u:'https://www.dlpmag.com/?p=102297'},
  {n:'Tech Show London',d:'2027-03-10',e:'2027-03-11',v:'ExCeL London',s:['tech','b2b','finance'],u:'https://www.eventbrite.com/e/tech-show-london-2027-tickets-1986059083181'},
  {n:'LIVE: Retail Week x The Grocer',d:'2027-03-18',v:'155 Bishopsgate, London',s:['retail','fmcg'],u:'https://live.retail-week.com/'},
  {n:'Advertising Week Europe',d:'2027-03-22',e:'2027-03-24',v:'180 Studios, London',s:['retail','fmcg','finance','travel','health','tech','auto','charity','b2b','media'],u:'https://advertisingweek.com/aweurope-2027/home/'},
  {n:'IFE, the International Food & Drink Event',d:'2027-04-05',e:'2027-04-07',v:'ExCeL London',s:['fmcg','retail','travel'],u:'https://www.ife.co.uk/'},
  {n:'Business Travel Show Europe',d:'2027-06-23',e:'2027-06-24',v:'ExCeL London',s:['travel','b2b'],u:'https://www.hospitalitynet.org/event/3007438/business-travel-show-europe-2027'});
const EV_IMG={};
function evTone(n){const h=hsh(n)%4;return['#2c56ed','#14102e','#0b7a6a','#c2410c'][h]}
function evInitials(n){return n.replace(/^(The|LIVE:)\s+/i,'').split(/[\s:,&]+/).filter(w=>/^[A-Z]/.test(w)).slice(0,3).map(w=>w[0]).join('')}
eventsCard=function(c){const tg=campTargets(c).slice(0,4);const A=liAud();const yr=new Date().getFullYear();const secs=S.setup.profile.sectors||[];const t=today();
  const up=UK_EVENTS.filter(e=>(e.e||e.d)>=t).map(e=>Object.assign({fit:e.s.filter(x=>secs.includes(x)).length},e)).sort((a,b)=>a.d.localeCompare(b.d)).slice(0,8);
  const soon=e=>{const days=Math.round((Date.parse(e.d)-Date.parse(t))/864e5);return days<=0?'On now':days<=14?'In '+days+' day'+(days===1?'':'s'):days<=45?'Coming up':''};
  return '<div class="card evc"><div class="row" style="gap:12px;align-items:flex-start">'+agentFace('reach',40,{badge:false})+'<div class="grow"><div class="lab" style="margin:0">If you want to meet them, say so</div><h3>Find a room to meet them in</h3><p class="small">Upcoming events your prospects are likely to be at, soonest first, and ways to find more.</p></div></div>'+
   '<div class="evg">'+up.map(e=>{const d=evDate(e);const s=soon(e);const im=EV_IMG[e.u];return '<a class="evt pic'+(e.fit?' evok':'')+'" href="'+e.u+'" target="_blank" rel="noopener" data-ev="'+esc(e.u)+'"><span class="evt-img" style="--tone:'+evTone(e.n)+(im?';background-image:url(\''+esc(im)+'\')':'')+'">'+(im?'':'<em>'+esc(evInitials(e.n))+'</em>')+'<span class="evt-d"><b>'+d.day+'</b><small>'+d.mon+'</small></span>'+(s?'<span class="evt-soon">'+s+'</span>':'')+'</span><span class="evt-body"><b class="evt-n">'+esc(e.n)+'</b><small class="evt-v">'+ico('pin')+esc(e.v)+'</small>'+(e.fit?'<span class="evt-f">Fits your sectors</span>':'')+'</span></a>'}).join('')+
   tg.map(a=>'<a class="evt srch" target="_blank" rel="noopener" href="'+eventSearch('"'+a.name+'" marketing speaker '+yr)+'">'+logo(a,40)+'<b class="evt-n">Where '+esc(a.name)+' people are speaking</b><small class="evt-v">'+ico('search')+'Search talks and panels</small></a>').join('')+
   '<a class="evt srch" target="_blank" rel="noopener" href="'+eventSearch(A.sec+' marketing conference UK '+yr)+'"><span class="evt-ic">'+ico('search')+'</span><b class="evt-n">More '+esc(A.sec)+' events</b><small class="evt-v">Search conferences, awards and breakfasts</small></a>'+
   '<div class="evt own"><span class="evt-ic">'+ico('people')+'</span><b class="evt-n">Host your own</b><small class="evt-v">Breakfast for eight '+esc(A.sec)+' marketers, one topic: '+esc(A.prob)+'.</small></div></div><p class="tiny muted" style="margin-top:10px">Dates checked November 2026. Confirm with the organiser before you book. Pictures come from each event\u2019s own page.</p></div>'};
/* each event's picture is the one it shares when you post its link, fetched by the server and cached */
async function evImages(){if(!(typeof isLive==='function'&&isLive()))return;const need=UK_EVENTS.filter(e=>!(e.u in EV_IMG));if(!need.length)return;
  try{const j=await api('og?urls='+encodeURIComponent(need.map(e=>e.u).join('|')));Object.assign(EV_IMG,j.images||{});need.forEach(e=>{if(!(e.u in EV_IMG))EV_IMG[e.u]=''});
    $$('.evt.pic').forEach(a=>{const im=EV_IMG[a.dataset.ev];if(im){const s=a.querySelector('.evt-img');s.style.backgroundImage="url('"+im+"')";const em=s.querySelector('em');if(em)em.remove()}})}catch(e){}}
const _reachAfter12=VIEWS.reach_after;VIEWS.reach_after=(a)=>{_reachAfter12&&_reachAfter12(a);evImages()};
