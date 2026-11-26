/* ═══════════ v18k ═══════════ */
/* ── 1. every campaign chooses its own sectors. Who you want sets the default; the campaign narrows or changes it ── */
function campSecs(c){c=c||curCamp();const d=(S.setup.profile.sectors||[]);return c&&c.sectors&&c.sectors.length?c.sectors.filter(k=>L_SECTORS[k]):d}
function withCampSecs(fn,c){const P=S.setup.profile;const o=P.sectors;const s=campSecs(c);if(s===o)return fn();P.sectors=s;try{return fn()}finally{P.sectors=o}}
(function(){const f=fitP;fitP=function(p){return withCampSecs(()=>f(p))}})();
(function(){const f=findNow;findNow=async function(){const P=S.setup.profile;const o=P.sectors;P.sectors=campSecs();try{return await f.apply(this,arguments)}finally{P.sectors=o}}})();
cvSecs=function(c){const t=campTargets(c).map(a=>a.sk).filter(Boolean);return [...new Set(campSecs(c).concat(t))]};
let NC18={secs:[],prob:''};
function ncSecChips(){return Object.entries(L_SECTORS).map(([k,v])=>'<button type="button" class="chip'+(NC18.secs.includes(k)?' on':'')+'" onclick="ncSec(\''+k+'\')">'+esc(v.label)+'</button>').join('')}
function ncSec(k){NC18.secs=NC18.secs.includes(k)?NC18.secs.filter(x=>x!==k):NC18.secs.concat(k);const e=$('#ncS');if(e)e.innerHTML=ncSecChips();const n=$('#ncN');if(n)n.placeholder=ncName18()}
function ncName18(){const p=L_PROBLEMS[NC18.prob];const s=NC18.secs[0];return p?cap1(p.short)+(s?' in '+secLabel(s).toLowerCase():''):'New campaign'}
newCampaignFlow=function(){closeOverlays();if(!profReady()){toast('Finish your agency profile first. Then you can build campaigns.');go('agency');return}const P=S.setup.profile;const mine=(P.problems||[]).filter(k=>L_PROBLEMS[k]);
  NC18={secs:(P.sectors||[]).slice(0,2),prob:mine[0]||''};const cur=curCamp();
  modal('<div class="nc"><div class="nc-faces">'+OUT_K.map((k,i)=>agentFace(k,i?40:52,{badge:false,cls:i?'':'big'})).join('<i></i>')+'</div><h2>A new campaign</h2><p class="sub">Three quick choices, then Nora finds the brands. Nothing is sent until you launch.</p>'+
    '<div class="field"><label>1. Which sectors is it going after?</label><div class="chips" id="ncS">'+ncSecChips()+'</div><small class="hint">Starts from Who you want. Pick one or two for a sharper campaign.</small></div>'+
    '<div class="field"><label for="ncPr">2. Which problem does it solve?</label><select class="inp" id="ncPr" onchange="NC18.prob=this.value;$(\'#ncN\').placeholder=ncName18()">'+(mine.length?'<optgroup label="Your problems">'+mine.map(k=>'<option value="'+k+'"'+(k===NC18.prob?' selected':'')+'>'+esc(L_PROBLEMS[k].label)+'</option>').join('')+'</optgroup>':'<option value="">Choose the problem…</option>')+
      Object.entries(L_PROB_GROUPS).map(([g,gl])=>'<optgroup label="'+esc(gl)+'">'+Object.keys(L_PROBLEMS).filter(k=>L_PROBLEMS[k].g===g&&!mine.includes(k)).map(k=>'<option value="'+k+'">'+esc(L_PROBLEMS[k].label)+'</option>').join('')+'</optgroup>').join('')+'</select></div>'+
    '<div class="field"><label for="ncN">3. Give it a name</label><input class="inp" id="ncN" placeholder="'+esc(ncName18())+'" onkeydown="if(event.key===\'Enter\')ncGo()"></div>'+
    (cur&&cur.targets.length&&!isBlankCamp(cur)?'<label class="row" style="gap:8px"><input type="checkbox" id="ncCopy"> Start with the brands from '+esc(cur.name)+'</label>':'')+
    '<div class="modal-foot"><button class="btn btn-ghost" onclick="closeOverlays()">Cancel</button><button class="btn btn-primary" onclick="ncGo()">'+agentFace('prospects',22,{badge:false})+'Start with Nora'+ico('arrow','a')+'</button></div></div>')};
newCampaign=newCampaignFlow;
ncGo=function(){if(!NC18.secs.length){toast('Pick at least one sector');return}const pr=($('#ncPr')||{}).value||NC18.prob;const nm=($('#ncN').value||'').trim()||ncName18();const cp=$('#ncCopy')&&$('#ncCopy').checked;const old=curCamp();
  act('Started '+nm,()=>{const c=newCamp(nm);c.touched=1;c.sectors=NC18.secs.slice();if(pr)c.problem=pr;if(cp&&old)c.targets=old.targets.slice();const blank=S.campaigns.find(x=>isBlankCamp(x)&&!x.touched);if(blank)S.campaigns=S.campaigns.filter(x=>x!==blank);S.campaigns.unshift(c);S.cur=c.id},{refresh:false,ic:'🚀'});
  closeOverlays();renderShell();go('prospects');if(typeof coachTick==='function')coachTick()};
function campSecEdit(){const c=curCamp();NC18={secs:campSecs(c).slice(),prob:c.problem||''};modal('<h2>Sectors for '+esc(c.name)+'</h2><p class="sub">Nora only looks for brands in these. Changing them does not remove brands already on the list.</p><div class="chips" id="ncS">'+ncSecChips()+'</div><div class="modal-foot"><button class="btn btn-ghost" onclick="closeOverlays()">Cancel</button><button class="btn btn-primary" onclick="if(!NC18.secs.length){toast(\'Pick at least one\');return}curCamp().sectors=NC18.secs.slice();save();closeOverlays();go(\'prospects\',\'brands\',true);toast(\'Sectors updated\')">Save</button></div>')}
/* show the campaign's sectors on Pick your brands */
(function(){const f=VIEWS.prospects;VIEWS.prospects=function(tab){const h=String(f.apply(this,arguments));const c=curCamp();if(!c||tab==='people')return h;const chip='<div class="cs18">'+ico('layers')+'<span>Looking in</span>'+campSecs(c).map(k=>'<b>'+esc(secLabel(k))+'</b>').join('')+'<button class="link" onclick="campSecEdit()">Change</button></div>';
  const i=h.indexOf('<div class="pk-steps">');return i>-1?h.slice(0,i)+chip+h.slice(i):h}})();

/* ── 2. a colour for every section, softer than the value studio, carried from the sidebar into the page ── */
const SEC_C={home:'#4c6ef5',camps:'#7950f2',perf:'#7950f2',prospects:'#e8590c',give:'#e67700',reach:'#ae3ec9',launch:'#2f9e44',signals:'#e03131',pipeline:'#0c8599',insights:'#f08c00',reports:'#1971c2',agency:'#5c7cfa',team:'#495057',settings:'#495057'};
(function(){const f=go;go=function(v){const r=f.apply(this,arguments);try{document.documentElement.style.setProperty('--sec',SEC_C[VIEW]||'#4c6ef5');document.body.dataset.v18=VIEW}catch(e){}return r}})();
(function(){const f=navHTML;navHTML=function(){return String(f.apply(this,arguments)).replace(/<button class="(sd-i|sd18-s)([^"]*)" data-nav="([a-z]+)"/g,(m,c,r,k)=>'<button class="'+c+r+'" style="--sc:'+(SEC_C[k]||'#868e96')+'" data-nav="'+k+'"')}})();
(function(){const f=sideFoot;sideFoot=function(){return String(f.apply(this,arguments)).replace(/<button class="(sd-i)([^"]*)" data-nav="([a-z]+)"/g,(m,c,r,k)=>'<button class="'+c+r+'" style="--sc:'+(SEC_C[k]||'#868e96')+'" data-nav="'+k+'"')}})();

/* ── 3. Home: no team section; intent shows the closing-in orbit, small, with a live list of who is warming up ── */
crewRelay=function(){return ''};
function homeIntent18(){const R=intentRows();if(!R.length)return '<div class="card hi18"><div class="card-h"><h3>Who is warming up</h3></div><div class="empty">Nobody yet. As your messages land, the warmest organisations appear here.</div></div>';
  let orb=orbitHTML();orb=orb.replace(/<aside class="orb-dial"[\s\S]*<\/aside>/,'').replace(/<div class="orb-head">[\s\S]*?<\/span><\/div>/,'').replace(/onclick="orbSel\('([^']+)'\)"/g,'onclick="openAccount(\'$1\')"');
  const mem=orbMemory?orbMemory():{};const L=R.slice(0,6);
  return '<div class="card hi18" data-tour="intent"><div class="card-h"><h3>Who is <span class="serif">warming up</span></h3><span class="hi18-live"><i></i>Live</span></div>'+
    '<div class="hi18-orb">'+orb+'</div>'+
    '<ul class="hi18-l">'+L.map((r,i)=>{const H=HEAT.find(x=>x.n===r.s.heat)||HEAT[0];const up=r.s.heat>=3;return '<li style="--c:'+r.s.colour+';--i:'+i+'" onclick="openAccount(\''+r.a.id+'\')">'+logo(r.a,28)+'<span class="grow"><b>'+esc(r.a.name)+'</b><small>'+esc(intentWhy(r))+'</small></span><em class="hi18-h">'+(up?ico('arrow'):'')+esc(H.l)+'</em><small class="hi18-t">'+(r.last?rel(String(r.last).slice(0,10)):'')+'</small></li>'}).join('')+'</ul>'+
    '<div class="hp-f"><button class="link small" onclick="go(\'signals\')">All signals and intent</button>'+plBtn('Which organisations should I lean into this week, and why?','Where should I lean in?')+'</div></div>'}
(function(){const f=VIEWS.home;VIEWS.home=function(){let h=String(f.apply(this,arguments));const a=h.indexOf('<div class="hi card" data-tour="intent">');const b=h.indexOf('<div class="card hins">');
  if(a>-1&&b>a)h=h.slice(0,a)+homeIntent18()+h.slice(b);return h};const g=VIEWS.home_after;VIEWS.home_after=function(){g&&g.apply(this,arguments);if($('#orbStage'))setTimeout(()=>{try{orbInit()}catch(e){}},60)}})();

/* ── 4. Insights, audited: one filter bar, a lead story, picture cards, then plays. Less text, more to look at ── */
const INS18F={type:'',scope:'all',sec:''};
function insPic18(x,big){const p=x.p;return '<div class="ip18-cov">'+(PROSPECTS.includes(p)?cover18(p):'<div class="pb-cov" style="--h:'+hue(p.name)+'"><span class="pb-lg">'+logo(p.name,46)+'</span></div>')+'</div>'}
function insItem18(x,i,big){const T=TRG18[x.n.type];const q="'"+esc(x.p.name).replace(/'/g,"\\'")+"'";
  return '<article class="ip18'+(big?' big':'')+'" style="--c:'+T[2]+';--i:'+i+'">'+insPic18(x,big)+'<div class="ip18-b"><div class="ip18-k"><span>'+ico(T[1])+esc(T[0])+'</span><small>'+esc(fmtYM(x.n.date))+'</small>'+(x.on?'<em>On your campaign</em>':'')+'</div>'+
    '<h3>'+esc(x.p.name)+'</h3><p>'+esc(x.n.text)+'</p>'+
    '<details class="ip18-m"><summary>'+ico('bolt')+'Your move</summary><p>'+esc(T[3])+'</p><div class="row" style="gap:6px">'+plBtn('What should I send '+x.p.name+' after this news: '+x.n.text,'Draft it with Plato')+(x.on?'':'<button class="btn btn-line btn-xs" onclick="openBrand('+q+')">'+ico('plus')+'Look closer</button>')+'</div></details>'+
    (x.n.src?'<a class="ip18-src" href="'+esc(x.n.src)+'" target="_blank" rel="noopener">'+esc(x.n.pub||'Source')+ico('ext')+'</a>':'')+'</div></article>'}
VIEWS.insights=function(){const all=insNews18();let L=all.filter(x=>(!INS18F.type||(INS18F.type==='agency'?['agency','pitch'].includes(x.n.type):INS18F.type==='launch'?['launch','brand','expansion','digital'].includes(x.n.type):x.n.type===INS18F.type))&&(INS18F.scope==='all'||x.on)&&(!INS18F.sec||x.p.sector===INS18F.sec));
  const secs=[...new Set(all.map(x=>x.p.sector).filter(Boolean))];const opt=(v,l,cur)=>'<option value="'+v+'"'+(v===cur?' selected':'')+'>'+esc(l)+'</option>';
  const set="INS18F[this.name]=this.value;go('insights',null,true)";
  const bar='<div class="ib18"><label><small>Show</small><select name="type" onchange="'+set+'">'+opt('','Everything',INS18F.type)+opt('leadership','New leaders',INS18F.type)+opt('results','Results and trading',INS18F.type)+opt('agency','Agency moves and pitches',INS18F.type)+opt('launch','Launches and new work',INS18F.type)+opt('deal','Deals and new owners',INS18F.type)+'</select></label>'+
    '<label><small>Brands</small><select name="scope" onchange="'+set+'">'+opt('all','In my sectors',INS18F.scope)+opt('mine','On my campaigns',INS18F.scope)+'</select></label>'+
    (secs.length>1?'<label><small>Sector</small><select name="sec" onchange="'+set+'">'+opt('','All sectors',INS18F.sec)+secs.map(k=>opt(k,secLabel(k),INS18F.sec)).join('')+'</select></label>':'')+
    '<span class="grow"></span><span class="ib18-n"><b>'+L.length+'</b> stor'+(L.length===1?'y':'ies')+' · '+all.filter(x=>x.on).length+' on your campaigns</span></div>';
  const lead=L[0],side=L.slice(1,3),rest=L.slice(3,12);const A=getInsights().slice(0,4);
  return '<div class="sh plain"><div class="sh-l"><h1 class="sh-t">What is <span class="serif">moving.</span></h1></div><div class="sh-a"><span class="in18-up"><i></i>'+(all.length?'Latest '+esc(fmtYM(all.map(x=>x.n.date).sort().pop())):'Waiting for news')+'</span><button class="btn btn-ghost btn-sm" onclick="insTune()">'+ico('settings')+'Tune</button></div></div>'+bar+
    (lead?'<section class="ih18">'+insItem18(lead,0,true)+'<div class="ih18-s">'+side.map((x,i)=>insItem18(x,i+1)).join('')+'</div></section>'+(rest.length?'<section class="ig18">'+rest.map((x,i)=>insItem18(x,i+3)).join('')+'</section>':''):'<div class="card empty">'+ico('radar')+'<b>Nothing matches</b><p>Try another filter, or add brands to a campaign.</p></div>')+
    '<section class="in18-win"><div class="cv2-sh"><h2>Ways to <span class="serif">win.</span></h2><span>Short plays that work for agencies like yours</span></div><div class="iw18">'+WIN18.map((w,i)=>'<div class="iw18-c" style="--c:'+w[1]+';--i:'+i+'"><span>'+ico(w[0])+'</span><b>'+w[2]+'</b><p>'+w[3]+'</p>'+plBtn(w[4],'Use this')+'</div>').join('')+'</div></section>'+
    (A.length?'<section class="in18-sl"><div class="cv2-sh"><h2>From Scope &amp; <span class="serif">Lens.</span></h2></div><div class="in18s">'+A.map((x,i)=>'<button class="in18s-c" style="--i:'+i+'" onclick="openInsight(\''+x.id+'\')"><em>'+esc(INS_CATS[x.cat]||'')+'</em><b>'+esc(x.title)+'</b><small>'+fmtDate(x.date)+'</small></button>').join('')+'</div></section>':'')};

/* ── 5. Plan the journey: pick Scope & Lens's route or build your own with Priya, and edit the flow directly ── */
function jMode18(c){return (c.reach&&c.reach.mode18)||'own'}
function setJMode18(m){const c=curCamp();c.reach.mode18=m;if(m==='rec'){const R=c.reach;R.ch=REC_CH.slice();R.weeks=Math.max(8,R.weeks||12);R.steps=genSteps(c);priyaMatch(c);toast('Using the Scope & Lens route. Switch back any time.')}else toast('Building your own with Priya');save();go('reach',null,true)}
function jChoice18(c){const m=jMode18(c);const R=c.reach;
  return '<section class="jc18"><button class="jc18-o'+(m==='rec'?' on':'')+'" onclick="setJMode18(\'rec\')"><span class="jc18-i">'+SL_MARK('currentColor',2.4)+'</span><span class="grow"><b>Scope &amp; Lens recommended</b><small>The route that works for most agencies: LinkedIn, email, events, a workshop, a call and something in the post over twelve weeks.</small></span><i>'+(m==='rec'?ico('check'):'')+'</i></button>'+
    '<button class="jc18-o'+(m==='own'?' on':'')+'" onclick="setJMode18(\'own\')"><span class="jc18-i">'+agentFace('reach',34,{badge:false})+'</span><span class="grow"><b>Build your own with Priya</b><small>Choose your channels, length and pace. Priya plans it and you change anything.</small></span><i>'+(m==='own'?ico('check'):'')+'</i></button></section>'+
    (m==='rec'?'<div class="jc18-sum">'+ico('check')+'<span><b>'+R.ch.map(k=>(REACH_CH.find(x=>x.k===k)||{l:k}).l).join(', ')+'</b> over '+R.weeks+' weeks. Want to change channels? <button class="link" onclick="setJMode18(\'own\')">Build your own instead</button></span></div>':'')}
(function(){const f=VIEWS.reach;VIEWS.reach=function(){const c=campPrep();let h=String(f.apply(this,arguments));const i=h.indexOf('<section class="pl18">');if(i>-1)h=h.slice(0,i)+jChoice18(c)+h.slice(i);
  if(jMode18(c)==='rec')h=h.replace('<div class="card" data-tour="rsettings">','<div class="card jc18-hide" data-tour="rsettings">');return h}})();
/* the flow: every touch can be moved, removed, and new ones added between */
function stepShift18(id,d){const c=curCamp();const s=c.reach.steps.find(x=>x.id===id);if(!s)return;s.w=Math.max(1,Math.min(c.reach.weeks,s.w+d));s.assetSet=s.assetSet||0;c.reach.mode18='own';save();go('reach',null,true)}
function stepDel18(id){const c=curCamp();const s=c.reach.steps.find(x=>x.id===id);if(!s)return;act('Removed '+s.t,()=>{c.reach.steps=c.reach.steps.filter(x=>x.id!==id);c.reach.mode18='own'},{refresh:false,ic:'🗑'});go('reach',null,true)}
function addTouchAt18(w){editTouch('');setTimeout(()=>{const s=$('#tpW');if(s){s.value=String(w);s.dispatchEvent(new Event('change'))}},80)}
(function(){const fn=flowNode;flowNode=function(o){let h=fn(o);if(o.id)h='<div class="jfn18">'+h+'<span class="jfn18-c"><button type="button" onclick="stepShift18(\''+o.id+'\',-1)" aria-label="A week earlier" data-tip="A week earlier">'+ico('arrow')+'</button><button type="button" onclick="stepShift18(\''+o.id+'\',1)" aria-label="A week later" data-tip="A week later">'+ico('arrow')+'</button><button type="button" onclick="stepDel18(\''+o.id+'\')" aria-label="Remove" data-tip="Remove">'+ico('x')+'</button></span></div>';return h};
  const fw=flowWire;let W18=1;flowWire=function(lbl){const m=String(lbl||'').match(/Week (\d+)/);return fw(lbl).replace('</i>','<button type="button" class="jfw18" onclick="addTouchAt18('+(W18)+')" aria-label="Add a touch here">'+ico('plus')+'</button></i>')};
  const fh=flowHTML;flowHTML=function(c){const st=(c.reach.steps||[]).slice().sort((a,b)=>a.w-b.w);let k=0;const ws=[1].concat(st.map(s=>s.w));
    W18=1;let h=fh(c);let n=0;h=h.replace(/addTouchAt18\(\d+\)/g,()=>'addTouchAt18('+(ws[Math.min(n++,ws.length-1)])+')');
    return '<p class="jf18-n">'+ico('layers')+'The flow is the order of moves for one person; the timeline is when they happen. Change either and the other follows. Tap a step to edit it, use the arrows to move it a week, or the + to add one.</p>'+h}})();
