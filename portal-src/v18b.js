/* ═══════════ v18b PICK YOUR BRANDS ═══════════
IC.radar=IC.radar||'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12l6-6"/><circle cx="12" cy="12" r="1.2"/>';IC.alert=IC.alert||'<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>';
   Two steps, both obvious: pick brands, then find the people. Cards carry the why-now, a cover, the fit and the
   pitch likelihood, each with its working. One "Find more prospects" button that keeps giving. */

/* ── fit: what you do and whether they need it, first ── */
const NEED18={leadership:['brand','creative','design','effectiveness','research','media','pr','full','b2b'],brand:['brand','creative','design','content','video','social','packaging','influencer','full'],
  results:['performance','crm','data','effectiveness','media','seo','digital','martech','research'],expansion:['brand','media','experiential','pr','employer','b2b','sponsorship','full'],
  launch:['creative','pr','social','influencer','content','video','experiential','packaging','sponsorship'],deal:['brand','design','pr','employer','full'],restructure:['effectiveness','data','martech','ai','performance','crm'],
  digital:['digital','ux','seo','performance','crm','martech','ai','data'],sustainability:['purpose','pr','content','brand','packaging'],regulation:['pr','content','health','b2b']};
function need18(p){const D=myDiscs();const recent=(p.all&&p.all.length?p.all:p.nt&&p.nt!=='none'?[{type:p.nt,date:p.nd}]:[]).filter(n=>monthsAgo(n.date)<=9);
  if(!recent.length)return{pts:6,t:'No recent news yet that shows a need for what you do'};
  const open=recent.find(n=>n.type==='agency'||n.type==='pitch');if(open)return{pts:35,t:'Their agency news opens the door for '+mainDisc().cap};
  const hit=recent.find(n=>(NEED18[n.type]||[]).some(k=>D.includes(k)));
  const P=S.setup.profile;const mine=(P.problems&&P.problems.length?P.problems:[P.problem]).filter(Boolean).map(probBase);const pr=recent.flatMap(n=>PROB_FROM_NEWS[n.type]||[]).find(k=>mine.includes(k));
  if(hit){const fresh=monthsAgo(hit.date)<=3;const lab=(L_TRIGGER_LABELS[hit.type]||'Their news').toLowerCase();return{pts:Math.min(35,(fresh?30:24)+(pr?5:0)),t:'Their '+lab+' points to '+mainDisc().cap+', which is what you do'}}
  if(pr)return{pts:20,t:'Their news hints at a problem you solve'};
  return{pts:12,t:'News, but nothing that clearly needs what you do'}}
function spec18(p){const I=agInfo();const hay=((I.services||'')+' '+(S.setup.offer.uvp||'')+' '+(I.clients||'')).toLowerCase();const words=String(p.sub||'').toLowerCase().split(/[^a-z]+/).filter(w=>w.length>4);return words.some(w=>hay.includes(w))}
fitP=function(p){const P=S.setup.profile;const si=P.sectors.indexOf(p.sector);if(si<0)return null;const parts=[];
  const n=need18(p);parts.push({k:'need',l:'Needs what you do',pts:n.pts,max:35,t:n.t});
  const as=L_ASIZES[P.asize]||L_ASIZES.sm;let fit;if(P.csize==='auto')fit=as.fit[p.size];else{const o=['S','M','L'];const d=Math.abs(o.indexOf(P.csize)-o.indexOf(p.size));fit=d===0?30:d===1?13:2;fit=Math.round((fit*2+as.fit[p.size])/3)}
  const sz=Math.max(0,Math.min(25,Math.round(fit/30*25)));parts.push({k:'size',l:'Size',pts:sz,max:25,t:(L_SIZES[p.size]||{label:'Size unknown'}).label+(sz>=20?', the size you win':sz>=12?', a stretch but workable':', not the size you usually win')});
  const sp=spec18(p);parts.push({k:'sector',l:'Sector and speciality',pts:Math.min(25,(si===0?21:17)+(sp?4:0)),max:25,t:(si===0?'Your main sector':'One of your sectors')+(sp?', and close to your speciality':'')});
  let tm=0,tt='No news in the last six months';if(p.nt&&p.nt!=='none'){const ago=monthsAgo(p.nd);if(ago<=3){tm=10;tt='Fresh news, '+fmtYM(p.nd)}else if(ago<=6){tm=5;tt='News in the last six months'}}parts.push({k:'time',l:'Timing',pts:tm,max:10,t:tt});
  const loc=P.region==='any'?4:P.region===p.region?5:1;parts.push({k:'place',l:'Location',pts:loc,max:5,t:P.region==='any'?'You work anywhere in the UK':P.region===p.region?'In your patch':'Outside your patch'});
  const why=[];if(n.pts>=24)why.push(['target','Needs what you do']);if(sz>=20)why.push(['grid','Your size']);if(tm>=10)why.push(['bolt','Fresh news']);why.push(['layers',si===0?'Main sector':'Your sector']);
  return{p,s:Math.min(99,parts.reduce((a,q)=>a+q.pts,0)),why:why.slice(0,3),parts,intel:!!(p.intel&&intelOn())}};
scoreKey=function(){return ''};

/* ── pitch likelihood: separate from fit, and always says what it is based on ── */
function pitch18(p){let s=14;const b=[];const r=p.intel&&intelOn()?p.intel:null;
  if(r){if(r.prob==='review'){s+=55;b.push('The account is in review now')}else if(r.prob==='high'){s+=45;b.push('Our pitch model rates a review as likely')}else if(r.prob==='moderate'){s+=24;b.push('Our pitch model rates a review as possible')}
    const yrs=r.last?Math.floor(daysAgo(r.last)/365):0;if(yrs>=5&&!/in.?house/i.test(r.move)){s+=14;b.push(yrs+' years with the same agency')}else if(/in.?house/i.test(r.move+r.agency)){s-=6;b.push('Work is done in-house')}
    if(r.change!=null&&r.change>=10){s+=8;b.push('Media spend up '+r.change+'% this year')}}
  const all=(p.all&&p.all.length?p.all:p.nt&&p.nt!=='none'?[{type:p.nt,date:p.nd,text:p.news}]:[]);
  const lead=all.find(n=>n.type==='leadership'&&monthsAgo(n.date)<=12);if(lead){s+=26;b.push('New marketing or business leader in '+fmtYM(lead.date)+'. New leaders often review agencies in their first year')}
  const ag=all.find(n=>(n.type==='agency'||n.type==='pitch')&&monthsAgo(n.date)<=9);if(ag){s+=36;b.push(n18(ag.type)+' in '+fmtYM(ag.date))}
  const dl=all.find(n=>(n.type==='deal'||n.type==='restructure')&&monthsAgo(n.date)<=9);if(dl){s+=12;b.push('A change of ownership or structure in '+fmtYM(dl.date))}
  const rs=all.find(n=>(n.type==='results'||n.type==='brand')&&monthsAgo(n.date)<=6);if(rs){s+=6;b.push(rs.type==='results'?'Fresh results, when budgets get set':'New brand work under way')}
  s=Math.max(5,Math.min(95,s));const lvl=s>=62?'high':s>=38?'med':'low';
  if(!b.length)b.push('No sign of a review yet, which makes now a good time to be known before one starts');
  return{s,lvl,l:{high:'High',med:'Medium',low:'Low'}[lvl],b}}
function n18(t){return({agency:'Agency news',pitch:'An open pitch or review'})[t]||L_TRIGGER_LABELS[t]||'News'}
function pitchWhy(e,name){e.stopPropagation();const p=PROSPECTS.find(q=>q.name===name);if(!p)return;const x=pitch18(p);$$('.fitpop').forEach(n=>n.remove());
  const d=document.createElement('div');d.className='fitpop';d.innerHTML='<div class="fp-h"><b class="pl18-'+x.lvl+'">'+x.l+'</b><div><strong>Pitch likelihood</strong><span>How likely '+esc(name)+' is to look at agencies in the next year.</span></div><button class="icon-btn" onclick="this.closest(\'.fitpop\').remove()" aria-label="Close">'+ico('x')+'</button></div>'+
    '<ul class="pw18">'+x.b.map(t=>'<li>'+ico('check')+esc(t)+'</li>').join('')+'</ul><p class="fp-k">Based on how long they have been with their agency, changes in marketing leadership, agency and pitch news, results and media spend. Checked every day.</p>';
  document.body.appendChild(d);const r=e.currentTarget.getBoundingClientRect();const w=Math.min(380,innerWidth-24);d.style.width=w+'px';d.style.left=Math.max(12,Math.min(innerWidth-w-12,r.left+r.width/2-w/2))+'px';const below=r.bottom+8;d.style.top=(below+d.offsetHeight>innerHeight-12?Math.max(12,r.top-d.offsetHeight-8):below)+'px';
  setTimeout(()=>document.addEventListener('click',function off(ev){if(!d.contains(ev.target)){d.remove();document.removeEventListener('click',off)}}),0)}
const _fitWhy18=fitWhy;fitWhy=function(e,name){_fitWhy18(e,name);const k=$('.fitpop .fp-k');if(k)k.textContent='Out of 100: whether they need what you do (35), size (25), sector and speciality (25), timing (10) and location (5). 75 or more is a strong fit.'};

/* ── the card ── */
function ring18(v){const r=15,c=2*Math.PI*r;return '<span class="rg18"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="'+r+'" class="t"/><circle cx="18" cy="18" r="'+r+'" class="v" stroke-dasharray="'+(c*v/100).toFixed(1)+' '+c.toFixed(1)+'" transform="rotate(-90 18 18)"/></svg><b>'+v+'</b></span>'}
function cover18(p){const d=DOMAINS[p.name]||'';const h=hue(p.name);
  const img=d&&typeof isLive==='function'&&isLive()?'<img src="/api/cover?d='+encodeURIComponent(d)+'" alt="" loading="lazy" onload="if(this.naturalWidth<240)this.remove();else this.parentNode.classList.add(\'ph\')" onerror="this.remove()">':'';
  return '<div class="pb-cov" style="--h:'+h+'"><svg viewBox="0 0 320 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><circle cx="'+(40+hsh(p.name)%240)+'" cy="'+(20+hsh(p.name+'y')%80)+'" r="90" class="c1"/><circle cx="'+(260-hsh(p.name+'z')%120)+'" cy="110" r="70" class="c2"/></svg>'+img+'<span class="pb-lg">'+logo(p.name,46)+'</span></div>'}
function news18(p){const L=(S.live.news[p.name]||{items:[]}).items;const n=(L[0]&&{type:L[0].type||p.nt,date:(L[0].date||'').slice(0,7),text:L[0].title||L[0].text,src:L[0].link||L[0].src,pub:L[0].source||L[0].pub})||(p.nt&&p.nt!=='none'&&p.news?{type:p.nt,date:p.nd,text:p.news,src:p.src,pub:p.pub}:null);
  if(!n)return '<div class="pb-now quiet"><b>Why now</b><p>No headline lately. A quiet account is easier to get noticed in.</p></div>';
  return '<div class="pb-now"><b>Why now <span>'+esc(L_TRIGGER_LABELS[n.type]||'News')+' · '+esc(fmtYM(n.date))+'</span></b><p>'+esc(n.text)+'</p>'+(n.src?'<a href="'+esc(n.src)+'" target="_blank" rel="noopener">'+esc(n.pub||'Source')+ico('ext')+'</a>':'')+'</div>'}
function card18(x,on){const p=x.p;const q="'"+esc(p.name).replace(/'/g,"\\'")+"'";const pl=pitch18(p);
  return '<article class="pb'+(on?' on':'')+'">'+cover18(p)+'<div class="pb-b"><h3>'+esc(p.name)+'</h3><small class="pb-m">'+esc(p.sub)+' · '+esc(String(p.city||'UK').split(',')[0])+' · '+esc((L_SIZES[p.size]||{label:''}).label)+'</small>'+
    '<div class="pb-sc"><button class="pb-fit" onclick="fitWhy(event,'+q+')" aria-label="Fit '+x.s+' out of 100. See why">'+ring18(x.s)+'<span><small>Fit</small><b>'+fitWord(x.s)+'</b></span></button>'+
    '<button class="pb-pl pl18-'+pl.lvl+'" onclick="pitchWhy(event,'+q+')" aria-label="Pitch likelihood '+pl.l+'. See why"><span class="bars"><i></i><i></i><i></i></span><span><small>Pitch likelihood</small><b>'+pl.l+'</b></span></button></div>'+
    news18(p)+'</div><div class="pb-f"><button class="btn '+(on?'btn-line on':'btn-primary')+' btn-sm" onclick="toggleTarget('+q+')">'+ico(on?'check':'plus')+(on?'On your list':'Add to list')+'</button><button class="btn btn-ghost btn-sm" onclick="openBrand('+q+')">More info'+ico('arrow','a')+'</button></div></article>'}

/* ── the page ── */
const PK18={sort:'fit',sec:'',n:10,fresh:0};
function pool18(c){const all=PROSPECTS.map(fitP).filter(Boolean).sort((a,b)=>b.s-a.s);const chosen=new Set(campTargets(c).map(a=>norm(a.name)));
  const rev=Math.max(c.reveal||24,0);const seen=all.slice(0,rev);all.filter(x=>chosen.has(norm(x.p.name))&&!seen.includes(x)).forEach(x=>seen.push(x));return{all,seen,chosen}}
function ppl18(c){const tg=campTargets(c);const has=tg.filter(a=>a.people&&a.people.length).length;return{tg,has,need:tg.length-has,ppl:sum(tg,a=>(a.people||[]).length)}}
function steps18(tab,c){const P=ppl18(c);const crit=P.tg.length&&P.need;
  return '<div class="pk-steps"><button class="pk-st'+(tab==='brands'?' on':'')+'" onclick="go(\'prospects\',\'brands\')"><span class="pk-n">'+(P.tg.length?ico('check'):'1')+'</span><span><b>Pick brands</b><small>'+(P.tg.length?P.tg.length+' on your list':'Choose who you want to win')+'</small></span></button>'+
    '<span class="pk-ar">'+ico('arrow')+'</span>'+
    '<button class="pk-st'+(tab==='people'?' on':'')+(crit?' crit':'')+(P.tg.length&&!P.need?' dn':'')+'" onclick="go(\'prospects\',\'people\')"><span class="pk-n">'+(P.tg.length&&!P.need?ico('check'):'2')+'</span><span><b>Find decision makers</b><small>'+(!P.tg.length?'The person you will actually talk to':P.need?P.need+' brand'+(P.need===1?'':'s')+' still need a named person':'Everyone has a named person')+'</small></span>'+(crit?'<em>Needed</em>':'')+'</button></div>'}
function bar18(c){const P=ppl18(c);if(!P.tg.length)return '';
  return '<div class="pk-foot"><span class="lgs">'+P.tg.slice(0,6).map(a=>logo(a,28)).join('')+'</span><span class="grow"><b>'+P.tg.length+' brand'+(P.tg.length===1?'':'s')+'</b> · '+P.ppl+' decision maker'+(P.ppl===1?'':'s')+'</span>'+
    (P.need?'<button class="btn btn-primary" onclick="go(\'prospects\',\'people\')">'+ico('user')+'Find decision makers'+ico('arrow','a')+'</button>':'<button class="btn btn-primary" onclick="go(\'give\')">Next: create value'+ico('arrow','a')+'</button>')+'</div>'}
function brands18(c){const {all,seen,chosen}=pool18(c);let R=seen.slice();if(PK18.sec)R=R.filter(x=>x.p.sector===PK18.sec);
  if(PK18.sort==='pitch')R.sort((a,b)=>pitch18(b.p).s-pitch18(a.p).s||b.s-a.s);else if(PK18.sort==='news')R.sort((a,b)=>String(b.p.nd||'').localeCompare(String(a.p.nd||''))||b.s-a.s);
  const secs=[...new Set(seen.map(x=>x.p.sector))];const left=all.length-seen.length;const unadded=seen.filter(x=>!chosen.has(norm(x.p.name))).length;
  return (PK18.fresh?'<div class="pk-fresh">'+agentFace('prospects',30,{badge:false})+'<span class="grow"><b>Nora found '+PK18.fresh+' brand'+(PK18.fresh===1?'':'s')+' that fit.</b> Sorted by fit. Add the best in one go, or go through them.</span><button class="icon-btn" onclick="PK18.fresh=0;this.parentNode.remove()" aria-label="Dismiss">'+ico('x')+'</button></div>':'')+
    '<div class="pk-bar"><div class="seg18" role="tablist">'+[['fit','Best fit'],['pitch','Likely to pitch'],['news','Latest news']].map(o=>'<button class="'+(PK18.sort===o[0]?'on':'')+'" onclick="PK18.sort=\''+o[0]+'\';go(\'prospects\',\'brands\',true)">'+o[1]+'</button>').join('')+'</div>'+
    (secs.length>1?'<select class="inp sm" aria-label="Sector" onchange="PK18.sec=this.value;go(\'prospects\',\'brands\',true)"><option value="">All sectors</option>'+secs.map(k=>'<option value="'+k+'"'+(PK18.sec===k?' selected':'')+'>'+esc(secLabel(k))+'</option>').join('')+'</select>':'')+
    '<span class="grow muted small">'+R.length+' brand'+(R.length===1?'':'s')+'</span>'+
    (unadded?'<div class="pk-addn"><label for="pkN">Add the top</label><select id="pkN" class="inp sm" onchange="PK18.n=+this.value">'+[5,10,15,20,25,30,50].map(n=>'<option'+(PK18.n===n?' selected':'')+'>'+n+'</option>').join('')+'</select><button class="btn btn-line btn-sm" onclick="addTop18()">'+ico('plus')+'Add</button></div>':'')+
    '<button class="btn btn-primary btn-sm" onclick="findNow()">'+ico('radar')+'Find more prospects</button></div>'+
    '<div class="pb-g">'+R.map(x=>card18(x,chosen.has(norm(x.p.name)))).join('')+'</div>'+
    (left>0?'<div class="pk-more"><span class="muted small">'+left+' more brand'+(left===1?'':'s')+' fit your profile.</span><button class="btn btn-line btn-sm" onclick="findNow()">'+ico('radar')+'Find more prospects</button></div>':'')}
function addTop18(){const c=curCamp();const {seen,chosen}=pool18(c);let R=seen.slice();if(PK18.sec)R=R.filter(x=>x.p.sector===PK18.sec);if(PK18.sort==='pitch')R.sort((a,b)=>pitch18(b.p).s-pitch18(a.p).s);
  const add=R.filter(x=>!chosen.has(norm(x.p.name))).slice(0,PK18.n);if(!add.length)return;
  add.forEach(x=>{const p=x.p;const a=ensureAccount(p.name,{});a.sk=p.sector;a.sector=L_SECTORS[p.sector].label;a.sub=p.sub;a.city=p.city;a.size=L_SIZES[p.size].label;a.domain=DOMAINS[p.name]||a.domain||'';
    if(p.nt!=='none'&&p.news&&!a.news){a.news={type:p.nt,date:p.nd,text:p.news,src:p.src,pub:p.pub};addSignal(a,'trigger',{note:L_TRIGGER_LABELS[p.nt],trig:p.nt,date:p.nd+'-01',link:p.src})}if(!c.targets.includes(a.id))c.targets.push(a.id)});
  save();award('brand',add.length+' added');refreshNav();toast('Added '+add.length+' brand'+(add.length===1?'':'s')+'. Next, the people to talk to.');go('prospects','brands',true)}
function hero18(){return '<div class="pk-hero"><div class="pk-hc">'+agentFace('prospects',64,{badge:false})+'<div class="sh-k">Step one</div><h2>Find brands worth <span class="serif">your time.</span></h2>'+
  '<p>Nora checks every brand against what you do, the size you win and the sectors you know, then reads their news for a reason to talk now.</p><button class="btn btn-primary btn-lg" onclick="findNow()">'+ico('radar')+'Find prospects</button><button class="link" onclick="openAccountForm()">Or add a brand you already have in mind</button></div></div>'}
function people18(c){const P=ppl18(c);if(!P.tg.length)return '<div class="pk-hero"><div class="pk-hc">'+agentFace('prospects',56,{badge:false})+'<h2>Pick a few brands <span class="serif">first.</span></h2><p>Then Nora finds the right person at each one.</p><button class="btn btn-primary" onclick="go(\'prospects\',\'brands\')">Pick brands</button></div></div>';
  return '<div class="pk-dm'+(P.need?' crit':'')+'">'+ico(P.need?'alert':'check')+'<span class="grow"><b>'+(P.need?'This is the step that makes everything work.':'Everyone has a named person.')+'</b> '+(P.need?'Messages, gifts and invitations all go to a person, not a logo. Nora suggests the right roles at each brand. Confirm one or two and you are ready.':'Plato will address every message to them by name.')+'</span></div>'+peopleView(c)}
const _vPros18=VIEWS.prospects;VIEWS.prospects=function(tab){let c=curCamp();if(!c||PF||(!profDone()&&!DEMO_MODE))return _vPros18(tab);
  tab=tab==='people'?'people':'brands';const scanned=campScanned(c);
  return secHead('prospects','Pick your <span class="serif">brands.</span>',scanned?'<button class="btn btn-ghost btn-sm" onclick="openAccountForm()">'+ico('plus')+'Add a brand you know</button>':'')+steps18(tab,c)+
    '<div class="pk18">'+(tab==='people'?people18(c):scanned?brands18(c):hero18())+'</div>'+bar18(c)};

/* ── the scan: calm, typographic, quick ── */
let SC18=null;
findNow=async function(){if(!profDone()&&!DEMO_MODE){toast('Set who you want first');go('agency','want');return}closeOverlays();const c=curCamp();if(!c)return;
  const P=S.setup.profile;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;const before=pool18(c);const start=before.seen.length;const chosenN=before.chosen;
  if(ampLiveSearch()){try{await ampCompanies(P,[...chosenN])}catch(e){}}
  const all=PROSPECTS.map(fitP).filter(Boolean).sort((a,b)=>b.s-a.s);const firstRun=!c.scanned;const next=firstRun?Math.min(all.length,24):Math.min(all.length,Math.max(c.reveal||24,start)+24);
  const fresh=all.slice(firstRun?0:Math.max(c.reveal||24,start),next);
  if(!fresh.length){toast('That is every brand that fits right now. Widen your sectors or sizes to find more.');go('agency','want');return}
  const steps=[['layers','Sectors you work in'],['target','Whether they need what you do'],['grid','The size you win'],['bolt','News that gives you a reason to talk'],['radar','Who is likely to look at agencies']];
  const o=document.createElement('div');o.className='scan18';o.setAttribute('role','dialog');o.setAttribute('aria-label','Finding prospects');
  o.innerHTML='<div class="sc18"><div class="sc18-top">'+agentFace('prospects',40,{badge:false})+'<div class="grow"><b>Nora is finding brands that fit</b><small id="sc18S">Checking UK brands against your agency profile</small></div><button class="btn btn-ghost btn-sm" onclick="scan18Done()">Skip</button></div>'+
    '<div class="sc18-mid"><div class="sc18-n"><b id="sc18N">0</b><small>brands checked</small></div><ol class="sc18-st">'+steps.map((s,i)=>'<li data-i="'+i+'">'+ico(s[0])+'<span>'+s[1]+'</span><i><u></u></i></li>').join('')+'</ol></div>'+
    '<div class="sc18-f"><small>Best fits so far</small><div id="sc18F"></div></div></div>';
  document.body.appendChild(o);requestAnimationFrame(()=>o.classList.add('on'));
  const total=Math.max(all.length*14,620)+Math.round(Math.random()*90);const T=reduce?900:5600;SC18={o,c,next,fresh,timers:[],t0:performance.now(),done:false};
  const tick=()=>{if(!SC18||SC18.done)return;const k=Math.min(1,(performance.now()-SC18.t0)/T);const el=$('#sc18N');if(el)el.textContent=Math.round(total*(1-Math.pow(1-k,3))).toLocaleString('en-GB');if(k<1)requestAnimationFrame(tick)};requestAnimationFrame(tick);
  steps.forEach((s,i)=>SC18.timers.push(setTimeout(()=>{const li=o.querySelector('li[data-i="'+i+'"]');if(li)li.classList.add('go');o.querySelectorAll('li').forEach((l,j)=>{if(j<i)l.classList.add('dn')})},i*T/5.4)));
  fresh.slice(0,8).forEach((x,i)=>SC18.timers.push(setTimeout(()=>{const f=$('#sc18F');if(f)f.insertAdjacentHTML('beforeend','<span class="sc18-b">'+logo(x.p.name,30)+'<b>'+esc(x.p.name)+'</b><em>'+x.s+'</em></span>')},T*.3+i*T*.08)));
  SC18.timers.push(setTimeout(scan18Done,T+500));award('scan')};
function scan18Done(){const F=SC18;if(!F||F.done)return;F.done=true;F.timers.forEach(clearTimeout);F.c.reveal=F.next;F.c.scanned=today();save();PK18.fresh=F.fresh.length;PK18.sort='fit';PK18.sec='';
  F.o.classList.remove('on');setTimeout(()=>F.o.remove(),280);SC18=null;go('prospects','brands')}
findClose=function(){if(SC18){SC18.timers.forEach(clearTimeout);SC18.o.remove();SC18=null}};
const _go18b=go;go=function(v,a,k){if(v==='prospects'&&a==='news')a='brands';return _go18b(v,a,k)};
