/* ═══════════ v14 ALIVE: clearer steps, the crew talking on every stage, the Signals orbit, and a rope you can drag ═══════════
   Four ideas, one feeling: the portal is a living thing.
   1. Each campaign stage is named for what you DO there, with one plain "your move" line so nobody is ever lost.
   2. The crew talk to each other on the stage pages: typing dots, mouths moving, hand-offs you can watch.
   3. Signals opens with the orbit: your agency in the middle, prospect logos drifting closer as they warm up,
      and a speedometer dial for whoever you tap.
   4. The journey chart is physical: drag any touchpoint to a new week or channel, and the rope between
      touchpoints swings and settles like a real one. */
const V14_RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── 1. Say what you do there ───────────────────────────────── */
(function(){const N={
  prospects:{l:'Pick your brands',q:'Scout finds the few worth your time'},
  give:{l:'Make your gift',q:'Muse builds something they will actually want'},
  reach:{l:'Plan the journey',q:'Relay paces every touchpoint over weeks'},
  launch:{l:'Launch',q:'Pilot lines up each day. You stay in charge'}};
  MODULES.forEach(m=>{if(N[m.k]){m.l=N[m.k].l;m.q=N[m.k].q}})})();
function stageMove(k,c){const tg=campTargets(c);
  if(k==='prospects'){if(!profDone())return 'Answer the five quick questions, so Scout knows exactly who to hunt.';
    if(!campScanned(c))return 'Press <b>Find prospects now</b> and Scout sweeps for brands that fit.';
    if(!tg.length)return 'Tick the brands you like the look of. Each one joins this campaign.';
    if(!sum(tg,a=>a.people.length))return 'Open a brand and add its decision makers, or ask Scout to find the people.';
    return 'Brands and people locked. <button class="link" onclick="go(\'give\')">Next: make your gift →</button>'}
  if(k==='give'){if(!c.assets.length)return 'Tap <b>Use this</b> on one idea. One great gift beats three good ones.';
    if(!bankReady(c))return 'Now fill the content bank, so every touchpoint has something worth opening.';
    return 'Gift wrapped. <button class="link" onclick="go(\'reach\')">Next: plan the journey →</button>'}
  if(k==='reach')return 'Drag any dot to a new week or lane. The rope follows. Tap a dot to reword it, then press <b>Next: launch it</b>.';
  if(k==='launch'){if((S.launch.queue||[]).length)return 'Read each message, tweak if you like, then approve: swipe right, or press the → key.';
    if(!campLive(c))return 'Run the pre-flight checks below, then press launch. Nothing sends without you.';
    return 'Do today’s steps. Ten minutes, then let it breathe. Replies land in Signals.'}
  return ''}

/* ── 2. The crew, talking on every stage ────────────────────── */
let CREW_TOK=0;
function crewDeck(k){const c=curCamp();if(!c)return '';
  let lines=[];try{lines=crewChat(k)||[]}catch(e){}
  const bots=OUT_K.map((x,i)=>{const A=AGENTS[x];const m=MODULES.find(z=>z.k===x);const st=campStepState(c,x);
    return (i?'<i class="dk-ln'+(campStepState(c,OUT_K[i-1])===2?' fed':'')+'" aria-hidden="true"><em></em></i>':'')+
    '<button class="dk-b'+(x===k?' now':'')+(st===2?' dn':'')+'" data-bot="'+x+'" onclick="go(\''+x+'\')" data-tip="'+esc(m.l+' · '+A.n)+'" aria-label="'+esc(m.l+', with '+A.n)+(st===2?', done':x===k?', you are here':'')+'">'+agentFace(x,36,{badge:false})+'<small>'+esc(A.n)+'</small>'+(st===2?'<i class="dk-ok">'+ico('check')+'</i>':x===k?'<i class="dk-here">You are here</i>':'')+'</button>'}).join('');
  const chat=lines.slice(0,3).map(x=>{const A=AGENTS[x[0]];if(!A)return '';
    return '<div class="dk-m" data-say="'+x[0]+'" style="--ac:'+A.col+'">'+agentFace(x[0],24,{badge:false})+'<span class="dk-bb"><b>'+esc(A.n)+'</b><em class="dk-dots"><i></i><i></i><i></i></em><em class="dk-tx">'+esc(x[1])+'</em></span></div>'}).join('');
  const mv=stageMove(k,c);
  return '<div class="deck" data-stage="'+k+'"><div class="dk-team" role="navigation" aria-label="The four steps">'+bots+'</div>'+
    (chat?'<div class="dk-chat" aria-label="Your team, talking">'+chat+'</div>':'')+
    (mv?'<div class="dk-move"><span class="dk-mk">'+ico('bolt')+'Your move</span><span class="dk-mt">'+mv+'</span></div>':'')+'</div>'}
function crewPlay(){const tok=++CREW_TOK;const deck=$('.deck');if(!deck)return;const ms=$$('.dk-m',deck);
  if(V14_RM){ms.forEach(m=>m.classList.add('on','said'));return}
  let t=350;ms.forEach(m=>{const who=m.dataset.say;const txt=(m.querySelector('.dk-tx')||{textContent:''}).textContent;
    const hold=Math.min(1500,420+txt.length*9);
    setTimeout(()=>{if(tok!==CREW_TOK||!m.isConnected)return;m.classList.add('on');const b=deck.querySelector('.dk-b[data-bot="'+who+'"] .ag');if(b)b.classList.add('talk');
      setTimeout(()=>{if(tok!==CREW_TOK||!m.isConnected)return;m.classList.add('said');if(b)b.classList.remove('talk')},hold)},t);
    t+=hold+240})}
/* the deck sits just under each stage header */
(function(){const _sh=secHead;secHead=function(k,title,actions,tabs){const h=_sh(k,title,actions,tabs);
  return OUT_K.includes(k)?h+crewDeck(k):h}})();
['prospects','give','reach','launch'].forEach(k=>{const o=VIEWS[k+'_after'];VIEWS[k+'_after']=function(){o&&o.apply(this,arguments);crewPlay();if(k==='reach')ropeInit()}});

/* ── 3. SIGNALS: the orbit and the dial ─────────────────────── */
let ORB={sel:null,raf:0,chips:[],t0:0};
function orbRows(){return ranked().filter(x=>x.s.score>0&&x.a.signals.some(s=>s.type!=='trigger'))}
function orbMemory(){try{return JSON.parse(localStorage.getItem('sl-orb14')||'{}')}catch(e){return {}}}
function orbRemember(R){try{const m={};R.forEach(x=>m[x.a.id]=Math.round(x.s.score));localStorage.setItem('sl-orb14',JSON.stringify(m))}catch(e){}}
/* score → how far from the centre, as a fraction of the stage radius. Hotter is closer. */
function orbFrac(s){const B=[[0.01,15,.95,.80],[15,35,.78,.62],[35,60,.60,.45],[60,90,.44,.32],[90,150,.30,.20]];
  const b=B.find(x=>s.score<x[1])||B[4];const f=Math.max(0,Math.min(1,(s.score-b[0])/(b[1]-b[0])));return b[2]-(b[2]-b[3])*f}
function orbHash(id){let h=0;for(let i=0;i<id.length;i++)h=(h*31+id.charCodeAt(i))>>>0;return h}
function orbitHTML(){const R=orbRows();if(!R.length)return '';const mem=orbMemory();const show=R.slice(0,22);
  if(!ORB.sel||!R.some(x=>x.a.id===ORB.sel))ORB.sel=R[0].a.id;
  const rings=[['r1','Stirring'],['r2','Aware'],['r3','Warm'],['r4','Hot'],['r5','On fire']];
  const chips=show.map((x,i)=>{const closer=mem[x.a.id]!=null&&Math.round(x.s.score)>mem[x.a.id];
    return '<button class="orb-chip h'+x.s.heat+(x.a.id===ORB.sel?' sel':'')+(closer?' closer':'')+'" id="oc-'+x.a.id+'" data-id="'+x.a.id+'" data-r="'+orbFrac(x.s)+'" data-a0="'+(orbHash(x.a.id)%360)+'" data-i="'+i+'" data-heat="'+x.s.heat+'" style="--hc:'+x.s.colour+'" onclick="orbSel(\''+x.a.id+'\')" aria-label="'+esc(x.a.name)+', '+esc(x.s.label)+'" data-tip="'+esc(x.a.name)+' · '+esc(x.s.label)+'">'+logo(x.a,30)+'<i class="oc-ring"></i>'+(closer?'<em class="oc-in">closing in</em>':'')+'</button>'}).join('');
  orbRemember(R);
  return '<div class="card orbitc" data-tour="orbit"><div class="orb-head"><div><div class="lab" style="margin:0">The approach</div><h3>Watch them <span class="serif">close in.</span></h3></div><span class="orb-hint">'+ico('target')+'Closer to the centre = hotter. Tap any logo.</span></div>'+
  '<div class="orb-flex"><div class="orb-stage" id="orbStage" role="group" aria-label="Your prospects, closest first">'+
    rings.map((r,i)=>'<i class="orb-ring '+r[0]+'" aria-hidden="true"></i>').join('')+
    rings.map((r,i)=>'<b class="orb-rl l'+(i+1)+'" aria-hidden="true">'+r[1]+'</b>').join('')+
    '<span class="orb-core" aria-hidden="true"><i class="orb-pulse"></i><i class="orb-pulse p2"></i><span class="orb-me">'+(S.brand.logo?'<img src="'+S.brand.logo+'" alt="">':SL_MARK('currentColor',3))+'</span><small>You</small></span>'+
    chips+(R.length>show.length?'<small class="orb-more">+'+(R.length-show.length)+' more, further out</small>':'')+'</div>'+
  '<aside class="orb-dial" id="orbDial">'+dialHTML(ORB.sel)+'</aside></div></div>'}
/* the dial: a speedometer for one brand */
function dialArc(cx,cy,r,a0,a1){const P=a=>{a=a*Math.PI/180;return (cx+r*Math.sin(a)).toFixed(1)+' '+(cy-r*Math.cos(a)).toFixed(1)};
  return 'M'+P(a0)+' A'+r+' '+r+' 0 '+(a1-a0>180?1:0)+' 1 '+P(a1)}
function dialAngle(score){const B=[0,15,35,60,90];let i=B.length-1;while(i>0&&score<B[i])i--;
  const hi=i===B.length-1?150:B[i+1];const f=Math.max(0,Math.min(1,(score-B[i])/(hi-B[i])));return -110+(i+f)*44}
function dialHTML(id){const a=accountById(id);if(!a)return '<div class="empty"><div class="orb"></div>Tap a logo.</div>';
  const s=scoreAccount(a);const n=nextAction(a,s);const acts=S.activity.filter(x=>x.accountId===a.id);const touches=sum(acts,x=>x.qty||1);
  const ppl=engagedPeople(a);const last=a.signals.slice().sort((x,y)=>y.date.localeCompare(x.date))[0];
  const cols=['#9aa3bc','var(--brand)','#f2a93b','#ff7a45','#e0443a'];
  const zones=cols.map((c,i)=>'<path d="'+dialArc(110,112,84,-110+i*44,-110+(i+1)*44-3)+'" stroke="'+c+'" stroke-width="13" fill="none" stroke-linecap="round" opacity="'+(s.heat===i+1?1:.28)+'"/>').join('');
  const ticks=[0,1,2,3,4,5].map(i=>{const A=(-110+i*44)*Math.PI/180;const x1=110+70*Math.sin(A),y1=112-70*Math.cos(A),x2=110+78*Math.sin(A),y2=112-78*Math.cos(A);
    return '<line x1="'+x1.toFixed(1)+'" y1="'+y1.toFixed(1)+'" x2="'+x2.toFixed(1)+'" y2="'+y2.toFixed(1)+'" stroke="var(--rule-2)" stroke-width="2"/>'}).join('');
  return '<div class="dl-h">'+logo(a,40)+'<div class="grow" style="min-width:0"><b class="dl-n" onclick="openAccount(\''+a.id+'\')">'+esc(a.name)+'</b><small class="tiny muted">'+esc(whyLine(a,s))+'</small></div></div>'+
  '<div class="dl-g"><svg viewBox="0 0 220 132" aria-hidden="true">'+zones+ticks+
    '<g class="dl-ndl" style="--ang:'+dialAngle(s.score).toFixed(1)+'deg"><path d="M110 112 L104 104 L110 36 L116 104 Z" fill="var(--ink)"/><circle cx="110" cy="112" r="9" fill="var(--ink)"/><circle cx="110" cy="112" r="3.5" fill="var(--bg)"/></g></svg>'+
    '<div class="dl-read"><b class="dl-score" style="color:'+s.colour+'">'+s.score+'</b><span class="heat-e h'+s.heat+'" style="justify-content:center"><em>'+(s.heat===5?'🔥🔥':(HEAT.find(h=>h.n===s.heat)||{}).e||'⚪')+'</em>'+s.label+'</span></div></div>'+
  '<div class="dl-grid"><div><b>'+touches+'</b><small>touchpoints<br>from you</small></div><div><b>'+a.signals.length+'</b><small>signals<br>back</small></div><div><b>'+ppl.length+'</b><small>'+(ppl.length===1?'person':'people')+'<br>engaging</small></div><div><b>'+(last?rel(last.date):'—')+'</b><small>last<br>signal</small></div></div>'+
  chBars(a)+
  '<div class="dl-f"><button class="btn btn-primary btn-sm grow" onclick="'+n.f+'">'+ico(n.ic)+esc(n.l)+'</button><button class="btn btn-line btn-sm" onclick="openAccount(\''+a.id+'\')">Open</button></div>'}
function orbSel(id){ORB.sel=id;const d=$('#orbDial');if(d){d.innerHTML=dialHTML(id);
  setTimeout(()=>$$('#orbDial [data-w]').forEach(m=>m.style.width=m.dataset.w),60)}
  $$('.orb-chip').forEach(c=>c.classList.toggle('sel',c.dataset.id===id))}
function orbInit(){cancelAnimationFrame(ORB.raf);const st=$('#orbStage');if(!st)return;
  const chips=$$('.orb-chip',st);ORB.t0=performance.now();
  setTimeout(()=>$$('#orbDial [data-w]').forEach(m=>m.style.width=m.dataset.w),80);
  /* spread chips that share a band so logos never sit on top of each other.
     The room a chip needs depends on the ring it sits on: small screens and inner rings get less,
     so crowded bands split onto two sub-rings. */
  const sz0=st.clientWidth,R00=sz0/2-30,chipD=sz0<460?34:44;
  const bands={};chips.forEach(el=>{(bands[el.dataset.heat]=bands[el.dataset.heat]||[]).push(el)});
  Object.values(bands).forEach(g=>{if(g.length<2){if(g[0])g[0].dataset.roff=0;return}
    g.sort((a,b)=>(+a.dataset.a0)-(+b.dataset.a0));
    const r=Math.max(20,(+g[0].dataset.r)*R00);let need=Math.min(75,2*Math.asin(Math.min(.95,chipD/(2*r)))*57.3*1.25);
    if(g.length*need>340){g.forEach((el,i)=>el.dataset.roff=(i%2?.065:-.045));need=need*.62}else g.forEach(el=>el.dataset.roff=0);
    const min=Math.min(need,340/g.length);
    for(let pass=0;pass<5;pass++)for(let i=0;i<g.length;i++){const a=+g[i].dataset.a0,b=g[(i+1)%g.length];let d2=(+b.dataset.a0)-a;if(i===g.length-1)d2+=360;
      if(d2<min){const push=(min-d2)/2;g[i].dataset.a0=a-push;b.dataset.a0=(+b.dataset.a0)+push}}});
  const place=(el,ang,fr,now)=>{const sz=st.clientWidth;const R0=sz/2-30;const A=ang*Math.PI/180;const r=fr*R0;
    el.style.transform='translate(-50%,-50%) translate('+(r*Math.sin(A)).toFixed(1)+'px,'+(-r*Math.cos(A)).toFixed(1)+'px)'};
  if(V14_RM){chips.forEach(el=>place(el,+el.dataset.a0,(+el.dataset.r)+(+(el.dataset.roff||0))));return}
  const tick=now=>{if(!st.isConnected){cancelAnimationFrame(ORB.raf);return}
    const t=(now-ORB.t0)/1000;
    chips.forEach(el=>{const i=+el.dataset.i,h=+el.dataset.heat;const a0=+el.dataset.a0,rT=+el.dataset.r;
      const inT=Math.max(0,Math.min(1,(t-i*.09)/1.6));const e=1-Math.pow(1-inT,3);          /* they arrive from the cold */
      const drift=t*(0.9-h*0.14);const wob=Math.sin(t*.6+i*1.7)*.008;const ro=+(el.dataset.roff||0);
      place(el,a0+drift,1.04+((rT+ro)-1.04)*e+wob,now)});
    ORB.raf=requestAnimationFrame(tick)};
  ORB.raf=requestAnimationFrame(tick)}
(function(){const _sg=VIEWS.signals;VIEWS.signals=function(a){let h=String(_sg(a));
    let i=h.indexOf('<div class="card gapc');if(i<0)i=h.indexOf('<div class="tabsbar"');
    if(i>-1)h=h.slice(0,i)+orbitHTML()+h.slice(i);return h};
  const _sga=VIEWS.signals_after;VIEWS.signals_after=function(){_sga&&_sga.apply(this,arguments);orbInit()}})();

/* ── 4. THE JOURNEY: drag the dots, and the rope follows ────── */
/* same chart as before, but every node carries its data, and the connectors are a simulated rope */
seqSVG=function(c){const R=c.reach;const W=R.weeks;const chs=REACH_CH.filter(x=>R.ch.includes(x.k)&&R.steps.some(s=>s.ch===x.k));if(!chs.length)return '';
  const L=150,cw=W<=4?170:W<=8?112:84,lh=104,T=48,AD=R.ads?44:0,Wd=L+W*cw+30,H=T+chs.length*lh+10+AD;
  const st=R.steps.slice().sort((a,b)=>a.w-b.w||chs.findIndex(x=>x.k===a.ch)-chs.findIndex(x=>x.k===b.ch));const seen={};
  const pts=st.map(s=>{const key=s.w+':'+s.ch;seen[key]=(seen[key]||0)+1;const ln=Math.max(0,chs.findIndex(x=>x.k===s.ch));return{s,dup:seen[key]>1,x:L+(s.w-.5)*cw+(seen[key]-1)*30,y:T+ln*lh+lh/2-6}});
  let d='';pts.forEach((p,i)=>{if(!i){d='M'+p.x+' '+p.y;return}const q=pts[i-1];const mx=(q.x+p.x)/2;d+=' C'+mx+' '+q.y+' '+mx+' '+p.y+' '+p.x+' '+p.y});
  const icon=(k,x,y,sc,col)=>'<g transform="translate('+(x-12*sc)+','+(y-12*sc)+') scale('+sc+')" fill="none" stroke="'+col+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+IC[k]+'</g>';
  const ay=T+chs.length*lh;
  return '<svg id="seqSvg" class="seq" viewBox="0 0 '+Wd+' '+H+'" style="min-width:'+Math.min(Wd,760)+'px" data-geo=\''+JSON.stringify({L,cw,lh,T,W,chs:chs.map(x=>x.k)})+'\'>'+
    chs.map((x,i)=>'<rect x="'+L+'" y="'+(T+i*lh)+'" width="'+(W*cw)+'" height="'+(lh-12)+'" class="lane'+(i%2?' alt':'')+'" data-lane="'+i+'"/>'+icon(x.ic,24,T+i*lh+lh/2-6,.8,'var(--brand)')+'<text x="44" y="'+(T+i*lh+lh/2-1)+'" class="ln">'+x.l+'</text>').join('')+
    (R.ads?'<rect x="'+L+'" y="'+(ay+2)+'" width="'+(W*cw)+'" height="30" rx="15" class="adsband"/><rect x="'+L+'" y="'+(ay+2)+'" width="'+(W*cw)+'" height="30" rx="15" class="adsflow"/>'+icon('megaphone',24,ay+17,.8,'var(--brand)')+'<text x="44" y="'+(ay+22)+'" class="ln">LinkedIn ads</text><text x="'+(L+W*cw/2)+'" y="'+(ay+21)+'" text-anchor="middle" class="adtx">Running in the background the whole time, warming up your list</text>':'')+
    Array.from({length:W},(_,i)=>'<text x="'+(L+(i+.5)*cw)+'" y="28" class="wk" text-anchor="middle">Week '+(i+1)+'</text>'+(i?'<line x1="'+(L+i*cw)+'" x2="'+(L+i*cw)+'" y1="'+(T-6)+'" y2="'+(H-10)+'" class="grid"/>':'')).join('')+
    '<rect id="snapCol" class="snapcol" x="0" y="'+(T-6)+'" width="'+cw+'" height="'+(chs.length*lh+4)+'" style="display:none"/>'+
    (pts.length>1?'<path id="seqP" d="'+d+'" class="sq-path rope-hide" pathLength="1"/><path id="ropeSh" class="rope-sh" d=""/><path id="ropeP" class="rope" d="'+d+'"/>':'')+
    '<circle id="snapDot" class="snapdot" r="23" style="display:none"/>'+
    pts.map((p,i)=>{const ch=REACH_CH.find(x=>x.k===p.s.ch)||REACH_CH[0];return '<g class="sq-node'+(p.s.task?' task':'')+'" data-id="'+p.s.id+'" data-x="'+p.x+'" data-y="'+p.y+'" style="animation-delay:'+(0.25+i*0.14)+'s"><title>'+esc(p.s.t)+' · drag to move it</title><circle cx="'+p.x+'" cy="'+p.y+'" r="21" class="nd"/>'+icon(ch.ic,p.x,p.y,.72,p.s.task?'var(--brand)':'#fff')+'<circle cx="'+(p.x+16)+'" cy="'+(p.y-16)+'" r="9" class="bdg"/><text x="'+(p.x+16)+'" y="'+(p.y-12.5)+'" text-anchor="middle" class="bn">'+(i+1)+'</text><text x="'+p.x+'" y="'+(p.dup?p.y-30:p.y+38)+'" text-anchor="middle" class="lb">'+esc(p.s.t.length>17?p.s.t.slice(0,16)+'…':p.s.t)+'</text></g>'}).join('')+
    (pts.length>1?'<g class="trav" id="trav"><circle r="11" class="halo"/><circle r="6" class="core"/><animateMotion dur="'+Math.max(5,pts.length*1.1)+'s" repeatCount="indefinite" begin="1.4s"><mpath href="#seqP"/></animateMotion></g>':'')+'</svg>'};
let RP={raf:0};
function ropeStop(){cancelAnimationFrame(RP.raf);RP={raf:0}}
function ropeInit(){ropeStop();const svg=$('#seqSvg');if(!svg||!$('#ropeP'))return;
  const geo=JSON.parse(svg.dataset.geo||'{}');const nodes=$$('.sq-node',svg);if(nodes.length<1)return;
  const ends=nodes.map(n=>({el:n,id:n.dataset.id,x:+n.dataset.x,y:+n.dataset.y,dx:0,dy:0}));
  /* one rope segment between each pair of neighbours: a verlet chain pinned at both ends */
  const segs=[];for(let i=1;i<ends.length;i++){const a=ends[i-1],b=ends[i];const dist=Math.hypot(b.x-a.x,b.y-a.y);
    const n=Math.max(7,Math.min(16,Math.round(dist/30)));const slack=dist*1.055+14;const seg={a,b,n,rest:slack/n,p:[]};
    for(let j=0;j<=n;j++){const t=j/n;const sag=Math.sin(Math.PI*t)*slack*.07;seg.p.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t+sag,px:0,py:0})}
    seg.p.forEach(q=>{q.px=q.x;q.py=q.y});segs.push(seg)}
  const draw=()=>{let d='',ds='';segs.forEach(seg=>{d+='M'+seg.p[0].x.toFixed(1)+' '+seg.p[0].y.toFixed(1);
      for(let j=1;j<seg.p.length-1;j++){const q=seg.p[j],r=seg.p[j+1];d+=' Q'+q.x.toFixed(1)+' '+q.y.toFixed(1)+' '+((q.x+r.x)/2).toFixed(1)+' '+((q.y+r.y)/2).toFixed(1)}
      const lstA=seg.p[seg.p.length-1];d+=' L'+lstA.x.toFixed(1)+' '+lstA.y.toFixed(1)});
    $('#ropeP')&&$('#ropeP').setAttribute('d',d);const sh=$('#ropeSh');if(sh)sh.setAttribute('d',d)};
  /* let each rope settle before the first frame, so it hangs rather than whips */
  const relax=()=>segs.forEach(seg=>{const P=seg.p;for(let w=0;w<70;w++){for(let j=1;j<P.length-1;j++){P[j].y+=.6}
    for(let k=0;k<3;k++)for(let j=0;j<P.length-1;j++){const q=P[j],r=P[j+1];let ddx=r.x-q.x,ddy=r.y-q.y;const dl=Math.hypot(ddx,ddy)||1;const diff=(dl-seg.rest)/dl*.5;
      if(j===0){r.x-=ddx*diff*2;r.y-=ddy*diff*2}else if(j===P.length-2){q.x+=ddx*diff*2;q.y+=ddy*diff*2}else{q.x+=ddx*diff;q.y+=ddy*diff;r.x-=ddx*diff;r.y-=ddy*diff}}}
    P.forEach(q=>{q.px=q.x;q.py=q.y})});
  relax();
  if(V14_RM){draw()}else{
    let last=performance.now();
    const tick=now=>{if(!svg.isConnected){ropeStop();return}
      const t=now/1000;let dt=Math.min(.05,(now-last)/1000);last=now;
      segs.forEach((seg,si)=>{const P=seg.p;P[0].x=seg.a.x+seg.a.dx;P[0].y=seg.a.y+seg.a.dy;P[P.length-1].x=seg.b.x+seg.b.dx;P[P.length-1].y=seg.b.y+seg.b.dy;
        for(let j=1;j<P.length-1;j++){const q=P[j];const vx=(q.x-q.px)*.982,vy=(q.y-q.py)*.982;q.px=q.x;q.py=q.y;
          q.x+=vx+Math.sin(t*.9+si*2+j*.7)*.35*dt*60;q.y+=vy+900*dt*dt}
        for(let k=0;k<3;k++)for(let j=0;j<P.length-1;j++){const q=P[j],r=P[j+1];let ddx=r.x-q.x,ddy=r.y-q.y;const dl=Math.hypot(ddx,ddy)||1;const diff=(dl-seg.rest)/dl*.5;
          if(j===0){r.x-=ddx*diff*2;r.y-=ddy*diff*2}else if(j===P.length-2){q.x+=ddx*diff*2;q.y+=ddy*diff*2}else{q.x+=ddx*diff;q.y+=ddy*diff;r.x-=ddx*diff;r.y-=ddy*diff}}});
      draw();RP.raf=requestAnimationFrame(tick)};
    RP.raf=requestAnimationFrame(tick)}
  /* drag any node: x snaps to a week, y snaps to a lane. A short press still opens the editor. */
  const toSvg=e=>{const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;return pt.matrixTransform(svg.getScreenCTM().inverse())};
  ends.forEach(en=>{const el=en.el;el.style.touchAction='none';
    el.addEventListener('pointerdown',e=>{e.preventDefault();el.setPointerCapture(e.pointerId);const o=toSvg(e);let moved=false;const trav=$('#trav');
      const mv=ev=>{const p=toSvg(ev);const mx=p.x-o.x,my=p.y-o.y;if(!moved&&Math.hypot(mx,my)<6)return;
        if(!moved){moved=true;el.classList.add('drag');svg.classList.add('dragging');el.style.animation='none';el.style.opacity='1';if(trav)trav.style.display='none'}
        en.dx=mx;en.dy=my;el.style.transform='translate('+mx+'px,'+my+'px)';
        const w=Math.max(1,Math.min(geo.W,Math.round((en.x+mx-geo.L)/geo.cw+.5)));
        const ln=Math.max(0,Math.min(geo.chs.length-1,Math.round((en.y+my-geo.T-geo.lh/2+6)/geo.lh)));
        const sx=geo.L+(w-.5)*geo.cw,sy=geo.T+ln*geo.lh+geo.lh/2-6;
        const sc=$('#snapCol');if(sc){sc.style.display='';sc.setAttribute('x',geo.L+(w-1)*geo.cw)}
        const sd=$('#snapDot');if(sd){sd.style.display='';sd.setAttribute('cx',sx);sd.setAttribute('cy',sy)}
        en.snap={w,ch:geo.chs[ln]}};
      const up=ev=>{el.releasePointerCapture&&el.releasePointerCapture(e.pointerId);el.removeEventListener('pointermove',mv);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);
        svg.classList.remove('dragging');const sc=$('#snapCol'),sd=$('#snapDot');if(sc)sc.style.display='none';if(sd)sd.style.display='none';
        if(!moved){editTouch(en.id);return}
        el.classList.remove('drag');const c2=curCamp();const s=c2.reach.steps.find(x=>x.id===en.id);const sn=en.snap;
        if(s&&sn&&(s.w!==sn.w||s.ch!==sn.ch)){act('Moved “'+s.t+'” to week '+sn.w,()=>{s.w=sn.w;s.ch=sn.ch;if(!c2.reach.ch.includes(sn.ch))c2.reach.ch.push(sn.ch)},{refresh:false,ic:'🪢'});go('campaigns','journey',true)}
        else{en.dx=en.dy=0;el.style.transform='';el.style.animation='';el.style.opacity='';if($('#trav'))$('#trav').style.display=''}};
      el.addEventListener('pointermove',mv);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up)})})}
