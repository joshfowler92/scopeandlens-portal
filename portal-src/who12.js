/* ═══════════ v12 WHO TO TARGET ═══════════
   A clear score out of 100, built from your agency profile. Pitch intelligence is for Premium.
   Find prospects now scours through the Amplify integration when it is connected, and shows nothing until you scan. */
const PROB_FROM_NEWS={leadership:['reposition','relevant','standout','story','dated'],brand:['dated','standout','reposition','relevant'],results:['customer','newaud','cac','convert','retain','roi','working','price'],
  expansion:['expand','launch','newaud'],launch:['launch','newaud','content'],deal:['joined','story','reposition'],restructure:['working','roi','stretched'],digital:['convert','search','data','joined'],sustainability:['purpose','sustain'],regulation:['reputation','story'],agency:[],pitch:[],company:[]};
fitP=function(p){const P=S.setup.profile;const si=P.sectors.indexOf(p.sector);if(si<0)return null;const parts=[];
  parts.push({k:'sector',l:'Sector',pts:si===0?40:32,max:40,t:(si===0?'Your first sector: ':'One of your sectors: ')+secLabel(p.sector)});
  const as=L_ASIZES[P.asize]||L_ASIZES.sm;let fit;if(P.csize==='auto')fit=as.fit[p.size];else{const o=['S','M','L'];const d=Math.abs(o.indexOf(P.csize)-o.indexOf(p.size));fit=d===0?30:d===1?13:2;fit=Math.round((fit*2+as.fit[p.size])/3)}
  const sz=Math.max(0,Math.min(25,Math.round(fit/30*25)));parts.push({k:'size',l:'Size',pts:sz,max:25,t:(L_SIZES[p.size]||{label:'Size unknown'}).label+(sz>=20?', the size you work best with':sz>=12?', a stretch but workable':', not the size you usually win')});
  const mine=(P.problems&&P.problems.length?P.problems:[P.problem]).filter(Boolean).map(probBase);const recent=(p.all&&p.all.length?p.all:p.nt&&p.nt!=='none'?[{type:p.nt,date:p.nd}]:[]).filter(n=>monthsAgo(n.date)<=9);
  const hint=recent.flatMap(n=>PROB_FROM_NEWS[n.type]||[]);const hit=mine.find(k=>hint.includes(k));const myK=hit&&(P.problems||[P.problem]).find(k=>probBase(k)===hit);const hitL=myK&&L_PROBLEMS[myK];
  parts.push({k:'problem',l:'Problems you solve',pts:hit?15:recent.length?6:3,max:15,t:hit?'Their news points to '+(hitL?hitL.short:'a problem')+', which you solve':recent.length?'News, but no clear sign of a problem you solve':'Nothing yet that points to a problem you solve'});
  const loc=P.region==='any'?8:P.region===p.region?10:3;parts.push({k:'place',l:'Location',pts:loc,max:10,t:P.region==='any'?'You work anywhere in the UK':P.region===p.region?'In your patch':'Outside your patch'});
  let tm=0,tt='No news in the last six months';if(p.nt&&p.nt!=='none'){const ago=monthsAgo(p.nd);if(ago<=3){tm=10;tt='Fresh news, '+fmtYM(p.nd)}else if(ago<=6){tm=5;tt='News in the last six months'}}
  parts.push({k:'time',l:'Timing',pts:tm,max:10,t:tt});
  const why=[];if(tm>=10)why.push(['bolt','Fresh news']);if(['leadership','brand','agency','pitch'].includes(p.nt)&&monthsAgo(p.nd)<=6)why.push([p.nt==='leadership'?'user':'megaphone',{leadership:'New leadership',brand:'Marketing news',agency:'Agency move',pitch:'Open pitch'}[p.nt]]);
  if(hit)why.push(['target','Needs what you do']);why.push(['layers',si===0?'Your first sector':'One of your sectors']);if(sz>=20)why.push(['grid','Right size for you']);
  const x={p,s:Math.min(100,parts.reduce((a,q)=>a+q.pts,0)),why:why.slice(0,3),parts};
  if(p.intel&&intelOn()){const k=intelBonus(p.intel);const b=Math.min(10,k.b);x.s=Math.min(100,x.s+b);x.why=k.why.slice(0,2).concat(x.why).slice(0,3);x.intel=1;x.parts.push({k:'intel',l:'Pitch timing',pts:b,max:10,t:((k.why[0]||[])[1])||'From pitch intelligence',bonus:1})}
  return x};
const fitWord=s=>s>=75?'Strong fit':s>=60?'Good fit':s>=45?'Worth a look':'Weak fit';
function fitBadge(x,big){return '<button class="fitb'+(big?' big':'')+'" onclick="fitWhy(event,\''+esc(x.p.name).replace(/'/g,"\\'")+'\')" aria-label="Fit '+x.s+' out of 100. See why">'+fitRing(x.s,big)+'<small>'+fitWord(x.s)+'</small></button>'}
function fitBars(x){return '<div class="fbars">'+x.parts.map(q=>'<div class="fbr'+(q.bonus?' bonus':'')+'"><span class="fb-l">'+esc(q.l)+'</span><span class="fb-b"><i style="width:'+Math.round(q.pts/q.max*100)+'%"></i></span><span class="fb-n">'+(q.bonus?'+':'')+q.pts+'<small>/'+q.max+'</small></span><span class="fb-t">'+esc(q.t)+'</span></div>').join('')+'</div>'}
function fitWhy(e,name){e.stopPropagation();const p=PROSPECTS.find(q=>q.name===name);const x=p&&fitP(p);if(!x)return;$$('.fitpop').forEach(n=>n.remove());
  const d=document.createElement('div');d.className='fitpop';d.innerHTML='<div class="fp-h"><b>'+x.s+'<small>/100</small></b><div><strong>'+fitWord(x.s)+'</strong><span>How well '+esc(name)+' matches your agency profile and prospecting preferences.</span></div><button class="icon-btn" onclick="this.closest(\'.fitpop\').remove()" aria-label="Close">'+ico('x')+'</button></div>'+fitBars(x)+
    '<p class="fp-k">75 or more is a strong fit. 60 to 74 is good. Below 45, probably not worth your time.</p>';
  document.body.appendChild(d);const r=e.currentTarget.getBoundingClientRect();const w=Math.min(380,innerWidth-24);d.style.width=w+'px';d.style.left=Math.max(12,Math.min(innerWidth-w-12,r.left+r.width/2-w/2))+'px';const below=r.bottom+8;d.style.top=(below+d.offsetHeight>innerHeight-12?Math.max(12,r.top-d.offsetHeight-8):below)+'px';
  setTimeout(()=>document.addEventListener('click',function off(ev){if(!d.contains(ev.target)){d.remove();document.removeEventListener('click',off)}}),0)}
function scoreKey(){return '<div class="skey">'+ico('target')+'<span><b>How the score works.</b> Out of 100: sector (40), size (25), problems you solve (15), location (10) and timing (10)'+(intelOn()?', plus up to 10 for pitch timing from pitch intelligence':'')+'. Tap any score to see the working.</span></div>'}

/* ── the page ── */
function campScanned(c){return !!(c&&(c.scanned||campTargets(c).length))}
VIEWS.prospects=(tab)=>{const c=curCamp();
  if(!profDone()||PF)return secHead('prospects','Your prospecting <span class="serif">preferences.</span>')+'<p class="sh-p" style="margin:-6px 0 18px">Who you want to win. Five quick taps, then I can go and find them.</p>'+profileForm();
  tab=['brands','people','news'].includes(tab)?tab:'brands';const tg=campTargets(c);const ppl=sum(tg,a=>a.people.length);const newsN=tg.filter(a=>a.news||(S.live.news[a.name]||{items:[]}).items.length).length;
  return secHead('prospects','Who to <span class="serif">target.</span>','<button class="btn btn-ghost btn-sm" onclick="editProfile()">'+ico('edit')+'Change your prospecting preferences</button><button class="btn btn-line btn-sm" onclick="openAccountForm()">'+ico('plus')+'Add your own brand</button>',
    pills([['brands','Find brands',''],['people','Your list',tg.length||''],['news','Why now',newsN||'']],tab,"go('prospects',$)"))+
  (tab==='people'?peopleView(c):tab==='news'?newsView(c):(campScanned(c)?findHero(true)+brandsView(c):findHero(false)))+
  (tg.length?'<div class="listbar"><div class="grow row" style="gap:10px"><span class="lgs">'+tg.slice(0,7).map(a=>logo(a,30)).join('')+'</span><b>'+tg.length+' brand'+(tg.length===1?'':'s')+' on your list</b><span class="muted small">'+ppl+' decision maker'+(ppl===1?'':'s')+'</span></div>'+
    (ppl?'<button class="btn btn-primary" onclick="go(\'give\')">Next: what to share'+ico('arrow','a')+'</button>':'<button class="btn btn-primary" onclick="go(\'prospects\',\'people\')">Next: find the people'+ico('arrow','a')+'</button>')+'</div>':'')};
const _prospAfter12=VIEWS.prospects_after;VIEWS.prospects_after=(t)=>{_prospAfter12&&_prospAfter12(t);const top=$('#bswTop');if(top&&!top.querySelector('.fbars')){const p=PROSPECTS.find(q=>q.name===top.dataset.n);const x=p&&fitP(p);if(x){const h=top.querySelector('.bsc-h');if(h)h.insertAdjacentHTML('afterend','<div class="bsc-fit"><div class="lab">Why '+x.s+' out of 100</div>'+fitBars(x)+'</div>')}}};
function editProfile(){PF=JSON.parse(JSON.stringify(S.setup.profile));if(!PF.discs||!PF.discs.length)PF.discs=PF.discipline?[PF.discipline]:[];go('prospects')}
/* before the first scan: one clear thing to do, and nothing else on the page */
findHero=function(scanned){const ampLive=ampLiveSearch();
  if(scanned)return '<div class="fhero2 slim"><div class="grow"><b>Want more?</b><span>Scan again for brands that match your agency profile'+(ampLive?', through Amplify':'')+'.</span></div><button class="btn btn-line btn-sm" onclick="findNow()">'+ico('radar')+'Find more prospects</button></div>'+scoreKey();
  return '<div class="fhero2"><div class="fh-map" aria-hidden="true">'+ukDotsSVG(true)+'</div><div class="fh-c"><div class="sh-k">Step one</div><h2>Find brands that are <span class="serif">worth your time.</span></h2>'+
    '<p>I scour the UK for brands that match your agency profile: your sectors, the size you win, the problems you solve and where you work. Then I bring back the ones with a reason to hear from you now.</p>'+
    '<button class="fbtn" onclick="findNow()"><span class="fb-ic">'+ico('radar')+'</span><span><b>Find prospects now</b><small>Takes about twenty seconds</small></span></button>'+
    '<div class="fh-or">Or <button class="link" onclick="openAccountForm()">add a brand you already have in mind</button>.</div></div></div>'};
brandsView=function(c){const html=_brandsView(c);return html.replace(/<button class="btn btn-amp btn-sm"[^]*?<\/button>/,'').replace(/<p class="tiny muted" style="margin-top:14px">Real brands with real, linked news[^]*?<\/p>/,'')};
function ampLiveSearch(){return !!(typeof AMP!=='undefined'&&AMP&&AMP.connected)}

/* ── the scan: a dot map of the UK, a radar sweep, pins as brands come back ── */
let UKDOTS=null;
function ukDots(){if(UKDOTS)return UKDOTS;const P=[UK_GB,UK_NI].map(poly=>poly.map(p=>ukXY(p[0],p[1])));const inside=(x,y,poly)=>{let o=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const[xi,yi]=poly[i],[xj,yj]=poly[j];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))o=!o}return o};
  const W=ukXY(2.2,49.8)[0]+10,H=ukXY(0,49.8)[1]+10;const out=[];const st=7.2;for(let y=st/2;y<H;y+=st)for(let x=st/2;x<W;x+=st)if(P.some(poly=>inside(x,y,poly)))out.push([x,y]);UKDOTS={W,H,dots:out};return UKDOTS}
function ukDotsSVG(still){const D=ukDots();return '<svg viewBox="0 0 '+D.W.toFixed(0)+' '+D.H.toFixed(0)+'" class="ukdots'+(still?' still':'')+'"><g class="dts">'+D.dots.map(([x,y])=>'<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="2.1"/>').join('')+'</g></svg>'}
let FR12=null;
findNow=async function(){if(!profDone()){toast('Set your prospecting preferences first');go('prospects');return}closeOverlays();const c=curCamp();
  const D=ukDots();const P=S.setup.profile;const home=UK_REG[P.region]||UK_REG.any;const[hx,hy]=ukXY(home[0],home[1]);
  const o=document.createElement('div');o.className='finder f12';o.setAttribute('role','dialog');o.setAttribute('aria-label','Finding prospects');
  o.innerHTML='<div class="fd-in"><div class="fd-top">'+agentFace('prospects',44,{badge:false})+'<div class="grow"><b>'+AGENTS.prospects.n+' is scouring the UK</b><small id="fdStat">Matching brands to your agency profile</small></div><button class="btn btn-ghost btn-sm fd-skip" onclick="findFinish()">Skip to results</button><button class="icon-btn" onclick="findClose()" aria-label="Close">'+ico('x')+'</button></div>'+
    '<div class="fd-body"><div class="fd-map"><svg viewBox="0 0 '+D.W.toFixed(0)+' '+D.H.toFixed(0)+'" id="fdSvg"><defs><linearGradient id="swG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="var(--brand)" stop-opacity="0"/><stop offset="1" stop-color="var(--brand)" stop-opacity=".45"/></linearGradient></defs>'+
      '<g class="dts">'+D.dots.map(([x,y])=>'<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="2.1"/>').join('')+'</g>'+
      '<g class="rings"><circle cx="'+hx.toFixed(1)+'" cy="'+hy.toFixed(1)+'" r="60"/><circle cx="'+hx.toFixed(1)+'" cy="'+hy.toFixed(1)+'" r="130"/><circle cx="'+hx.toFixed(1)+'" cy="'+hy.toFixed(1)+'" r="210"/></g>'+
      '<g class="sweep12" style="transform-origin:'+hx.toFixed(1)+'px '+hy.toFixed(1)+'px"><path d="M'+hx.toFixed(1)+' '+hy.toFixed(1)+' L'+(hx+300).toFixed(1)+' '+hy.toFixed(1)+' A300 300 0 0 0 '+(hx+300*Math.cos(-0.6)).toFixed(1)+' '+(hy+300*Math.sin(-0.6)).toFixed(1)+' Z" fill="url(#swG)"/></g>'+
      '<g id="fdPins"></g><circle cx="'+hx.toFixed(1)+'" cy="'+hy.toFixed(1)+'" r="5" class="home"/></svg>'+
      '<div class="fd-legend"><span><i class="pn"></i>A match</span><span><i class="pn hot"></i>Fresh news'+(intelOn()?' or likely to pitch':'')+'</span></div></div>'+
    '<div class="fd-feed"><div class="fd-fh" id="fdWhere">Starting the scan</div><div class="fd-list" id="fdList"></div></div></div><div class="fd-res" id="fdRes"></div></div>';
  document.body.appendChild(o);requestAnimationFrame(()=>o.classList.add('on'));const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  FR12={o,top:[],shown:0,done:false,timers:[]};const chosen=new Set(campTargets(c).map(a=>norm(a.name)));
  /* Amplify first, when it is connected. Otherwise Plato's own researched edition. */
  let src='edition';let R=[];
  if(ampLiveSearch()){$('#fdStat').textContent='Searching through Amplify';try{const j=await ampCompanies(P,[...chosen]);if(j&&j.length){R=j;src='amplify'}}catch(e){}}
  if(!R.length)R=PROSPECTS.map(fitP).filter(Boolean).sort((a,b)=>b.s-a.s).filter(x=>!chosen.has(norm(x.p.name))).slice(0,24);
  if(!R.length){findClose();toast('No new brands fit right now. Try widening your prospecting preferences.');return}
  FR12.top=R;FR12.src=src;const steps=['Matching your sectors','Checking size and fit','Looking for the problems you solve','Reading the latest news'+(intelOn()?' and pitch intelligence':''),'Ranking the best fits'];
  steps.forEach((t,i)=>FR12.timers.push(setTimeout(()=>{const w=$('#fdWhere');if(w)w.textContent=t},i*(reduce?80:1400))));
  R.forEach((x,i)=>FR12.timers.push(setTimeout(()=>findPin(x),(reduce?50:700)+i*(reduce?20:260))));
  FR12.timers.push(setTimeout(findFinish,(reduce?400:900)+R.length*(reduce?20:260)+900));if(c){c.scanned=today();save()}award('scan')};
async function ampCompanies(P,exclude){const j=await api('amplify',{method:'POST',body:{action:'companies',payload:{sectors:P.sectors,size:P.csize||'auto',region:P.region||'any',problems:P.problems||[],services:myDiscs(),exclude,limit:24}}});
  return (j.companies||[]).map(co=>{const p={name:co.name,sector:(P.sectors||[])[0]||'b2b',sub:co.industry||'',city:co.city||'UK',region:P.region||'any',size:co.size==='Household name'?'L':co.size==='Challenger'?'S':'M',nt:co.signal?'company':'none',nd:co.signal?NEWS7_AS_OF:'',news:co.signal||'',src:co.signalUrl||'',pub:co.signalUrl?'Source':'',all:co.signal?[{type:'company',date:NEWS7_AS_OF,text:co.signal,src:co.signalUrl||'',pub:'Source'}]:[],domain:co.domain||'',amp:1};
    if(!PROSPECTS.some(q=>q.name===p.name))PROSPECTS.push(p);if(co.domain)DOMAINS[co.name]=co.domain;return fitP(p)}).filter(Boolean).sort((a,b)=>b.s-a.s)}
findPin=function(x){const F=FR12;if(!F||F.done)return;const p=x.p;const ll=placeOf(p);const jx=((hsh(p.name)%100)/100-.5)*.6,jy=((hsh(p.name+'y')%100)/100-.5)*.4;const[px,py]=ukXY(ll[0]+jx,ll[1]+jy);
  const hot=(x.intel&&p.intel&&['high','review'].includes(p.intel.prob))||(p.nt&&p.nt!=='none'&&monthsAgo(p.nd)<=3);
  const g=$('#fdPins');if(!g)return;g.insertAdjacentHTML('beforeend','<g transform="translate('+px.toFixed(1)+','+py.toFixed(1)+')"><g class="pin'+(hot?' hot':'')+'"><circle r="11" class="pr"/><circle r="4.5" class="pd"/></g></g>');F.shown++;
  const why=(x.why[0]||[])[1]||fitWord(x.s);$('#fdList').insertAdjacentHTML('afterbegin','<div class="fdi'+(hot?' hot':'')+'">'+logo(p.name,34)+'<div class="grow"><b>'+esc(p.name)+'</b><small>'+esc((p.city||'UK').split(',')[0])+' · '+esc(why)+'</small></div><span class="fdi-s">'+x.s+'</span></div>')};
findFinish=function(){const F=FR12;if(!F||F.done)return;F.done=true;F.timers.forEach(clearTimeout);const top=F.top.slice(0,12);const chosen=new Set(campTargets(curCamp()).map(a=>norm(a.name)));F.o.classList.add('done');
  const st=$('#fdStat');if(st)st.textContent=F.src==='amplify'?'Done. Found through Amplify and scored against your agency profile.':'Done. Scored against your agency profile.';
  $('#fdRes').innerHTML='<div class="fr-h"><div><b>Your best prospects right now</b><small>Scored out of 100 on sector, size, the problems you solve, location and timing'+(intelOn()?', plus pitch timing':'')+'. Add the ones you like.</small></div><div class="row" style="gap:8px"><button class="btn btn-line btn-sm" onclick="findClose();bMode=\'swipe\';go(\'prospects\',\'brands\')">Review one by one</button><button class="btn btn-primary btn-sm" onclick="findAddTop(5)">'+ico('plus')+'Add the top five</button></div></div>'+
    '<div class="fr-g">'+top.map(x=>{const p=x.p;const on=chosen.has(norm(p.name));const q="'"+esc(p.name).replace(/'/g,"\\'")+"'";return '<div class="frc'+(on?' on':'')+'">'+logo(p.name,40)+'<div class="grow" style="min-width:0"><b>'+esc(p.name)+'</b><small>'+x.why.map(w=>esc(w[1])).join(' · ')+'</small></div><button class="frs" onclick="fitWhy(event,'+q+')" aria-label="Why '+x.s+'">'+x.s+'<small>/100</small></button><button class="addb'+(on?' on':'')+'" onclick="findToggle(this,'+q+')" aria-label="Add '+esc(p.name)+'">'+ico(on?'check':'plus')+'</button></div>'}).join('')+'</div>'};
const _findClose12=findClose;findClose=function(){FR12&&FR12.timers.forEach(clearTimeout);const o=$('.finder');if(o){o.classList.remove('on');setTimeout(()=>o.remove(),300)}FR12=null;if(VIEW==='prospects')go('prospects',VIEW_ARG,true)};
findAddTop=function(n){const F=FR12;if(!F)return;const chosen=new Set(campTargets(curCamp()).map(a=>norm(a.name)));F.top.filter(x=>!chosen.has(norm(x.p.name))).slice(0,n).forEach(x=>toggleTarget(x.p.name,true));findClose();go('prospects','brands')};

/* ── decision makers: the roles are information, not buttons ── */
const _peopleView12=peopleView;peopleView=function(c){return _peopleView12(c).replace(/<div class="dm-intro">[^]*?<\/div><\/div>/,m=>{const D=mainDisc();const roles=myDiscs().flatMap(k=>DISC[k].titles).filter((v,i,a)=>a.indexOf(v)===i).slice(0,6);
  return '<div class="dm-intro plain">'+ico('user')+'<p><b>Who buys '+esc(D.cap)+'.</b> At each brand on your list we look for the '+esc(roles.slice(0,-1).join(', ').toLowerCase())+(roles.length>1?' or '+esc(roles[roles.length-1].toLowerCase()):'')+'.</p></div>'})};

/* ── why now: only the brands you picked, newest first ── */
newsView=function(c){const tg=campTargets(c);
  if(!tg.length)return '<div class="card empty big">'+art('radar','sm')+'<b>Pick some brands first</b><p>Why now only follows the brands on your list, so every story is one you can act on.</p><button class="btn btn-primary" onclick="go(\'prospects\',\'brands\')">Find brands that fit</button></div>';
  const items=[];tg.forEach(a=>{const p=PROSPECTS.find(x=>norm(x.name)===norm(a.name));const seen=new Set();
    (S.live.news[a.name]||{items:[]}).items.forEach(n=>{const k=(n.title||n.text||'').slice(0,60);if(seen.has(k))return;seen.add(k);items.push({a,n,live:1,d:String(n.date||'')})});
    ((p&&p.all&&p.all.length)?p.all:a.news?[a.news]:[]).forEach(n=>{const k=(n.text||n.title||'').slice(0,60);if(seen.has(k))return;seen.add(k);items.push({a,n,live:0,d:String(n.date||'')})})});
  const fresh=x=>{const d=x.d.length===7?x.d+'-15':x.d;return Date.parse(d)||0};
  items.sort((x,y)=>fresh(y)-fresh(x)||(NEWS_RANK[x.n.type]??9)-(NEWS_RANK[y.n.type]??9));const quiet=tg.filter(a=>!items.some(x=>x.a===a));
  const checked=S.live.newsTs?rel(S.live.newsTs.slice(0,10)):'';
  return '<div class="filters"><span class="small muted">News on the '+tg.length+' brand'+(tg.length===1?'':'s')+' on your list, newest first.'+(checked?' Checked '+checked+'.':'')+'</span>'+(API_INFO.news?'<button class="btn btn-line btn-sm" onclick="checkNews()">'+ico('loop')+'Check again</button>':'')+'</div>'+
    (items.length?'<div class="nfeed">'+items.slice(0,60).map(x=>nItem(x.a,x.n,!!x.live,true)).join('')+'</div>':'<div class="card empty">No stories on your brands yet.'+(API_INFO.news?'':' Live news switches on once Plato is deployed.')+'</div>')+
    (quiet.length?'<div class="lab" style="margin-top:22px">Quiet right now · '+quiet.length+'</div><div class="quietg">'+quiet.map(a=>'<div class="qb">'+logo(a,36)+'<b>'+esc(a.name)+'</b>'+liveLinks(a.name)+'</div>').join('')+'</div>':'')};
/* when you open Why now, the brands on your list are checked for fresh news, at most every six hours */
const _prospAfter12b=VIEWS.prospects_after;VIEWS.prospects_after=(t)=>{_prospAfter12b&&_prospAfter12b(t);if(t==='news'&&API_INFO.news&&campTargets(curCamp()).length){const last=S.live.newsTs?Date.parse(S.live.newsTs):0;if(Date.now()-last>6*36e5){S.live.newsTs=new Date().toISOString();save();checkNews&&checkNews(true)}}};

/* ── website platforms (BuiltWith when connected, otherwise read from the brand's own home page) ── */
function techOf(name){const d=DOMAINS[name]||(findAccountByName(name)||{}).domain||'';const T=(S.live.tech||{})[d];return T&&T.items?T:null}
function techLine(name){const T=techOf(name);if(!T||!T.items.length)return '';const plat=T.items.filter(x=>x.cat==='Ecommerce'||x.cat==='CMS').slice(0,2);const rest=T.items.filter(x=>!plat.includes(x)).slice(0,4);
  return '<div class="tech"><span class="lab" style="margin:0">Website runs on</span><div class="chips">'+plat.map(x=>'<span class="chip sm strong">'+esc(x.name)+'</span>').join('')+rest.map(x=>'<span class="chip sm">'+esc(x.name)+'</span>').join('')+'</div><small class="muted">'+(T.src==='builtwith'?'From BuiltWith':'Read from their home page')+', '+rel(T.ts.slice(0,10))+'</small></div>'}
async function loadTech(names){if(!(typeof isLive==='function'&&isLive())||DEMO_MODE||!API_INFO.tech)return;S.live.tech=S.live.tech||{};const want=names.map(n=>DOMAINS[n]||(findAccountByName(n)||{}).domain||'').filter(d=>d&&!(S.live.tech[d]&&Date.now()-Date.parse(S.live.tech[d].ts)<14*864e5)).slice(0,6);if(!want.length)return;
  try{const j=await api('tech?domains='+encodeURIComponent(want.join(',')));Object.entries(j.sites||{}).forEach(([d,v])=>{S.live.tech[d]={ts:new Date().toISOString(),src:v.src,items:v.items||[]}});save();const top=$('#bswTop');if(top&&!top.querySelector('.tech')){const t=techLine(top.dataset.n);if(t)top.insertAdjacentHTML('beforeend',t)}}catch(e){}}
const _prospAfter12c=VIEWS.prospects_after;VIEWS.prospects_after=(t)=>{_prospAfter12c&&_prospAfter12c(t);const top=$('#bswTop');if(top){const tl=techLine(top.dataset.n);if(tl&&!top.querySelector('.tech'))top.insertAdjacentHTML('beforeend',tl);loadTech([top.dataset.n].concat(campTargets(curCamp()).map(a=>a.name)))}};
const _openBrand12=openBrand;openBrand=function(name){_openBrand12(name);const b=$('#drawer .drawer-b');if(b){const p=PROSPECTS.find(x=>x.name===name);const x=p&&fitP(p);if(x&&!b.querySelector('.fbars'))b.insertAdjacentHTML('afterbegin','<div class="bsc-fit"><div class="lab">Why '+x.s+' out of 100</div>'+fitBars(x)+'</div>');const tl=techLine(name);if(tl)b.insertAdjacentHTML('beforeend',tl);else loadTech([name]).then(()=>{const t2=techLine(name);if(t2&&!b.querySelector('.tech'))b.insertAdjacentHTML('beforeend',t2)})}};
