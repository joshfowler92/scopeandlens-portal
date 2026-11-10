/* ═══════════ v12.2 UX SWEEP ═══════════
   One clear next step on every page, nothing said twice, nothing on screen that does not help.
   Home leads with what to do today. Each step page leads with its main job. Long lists are trimmed, with a way to see the rest. */
let TEAMALL=false,MOREIDEAS=false,MOREMINE=false;

/* ── Home: the one thing to do next, then today, then campaigns ── */
VIEWS.home=function(){const first=(S.setup.you||'').split(' ')[0];const p=pipe();const pl=todaysPlan();const ready=profReady()||DEMO_MODE;
  const C=S.campaigns.filter(c=>!isBlankCamp(c)||c.touched).sort((a,b)=>(campLive(b)-campLive(a))||String(b.created).localeCompare(String(a.created)));
  const live=C.filter(campLive).length;const now=perfWindow(0,30);const ins=getInsights().slice(0,3);const pct=p.target?Math.min(1,p.wonVal/p.target):0;
  const building=C.find(c=>!campLive(c));const nextK=building?(OUT_K.find(k=>campStepState(building,k)!==2)||'launch'):null;
  let head,lede,cta;
  if(!ready){head='First, your agency <span class="serif">profile.</span>';lede=agPct()+'% done. Every brand, gift and message comes from it. It takes about ten minutes and you only do it once.';
    cta='<button class="btn btn-primary btn-lg" onclick="go(\'agency\')">'+(agPct()?'Finish my agency profile':'Start my agency profile')+ico('arrow','a')+'</button><button class="btn btn-line btn-lg" onclick="enterDemo()">'+ico('play')+'See the demo</button>'}
  else if(!C.length){head='Let’s build your first <span class="serif">campaign.</span>';lede='Pick a problem you solve, and your team finds the brands, makes something worth giving, plans the journey and writes every message. Free to build. You only pay to launch.';
    cta='<button class="btn btn-primary btn-lg" onclick="coachOffer(true)">'+ico('sparkle')+'Build it with Plato’s help</button><button class="btn btn-line btn-lg" onclick="newCampaignFlow()">'+ico('plus')+'Start on my own</button>'}
  else if(live){head=pl.length?(NUMW[Math.min(pl.length,5)]||pl.length)+' thing'+(pl.length===1?'':'s')+' worth <span class="serif">doing today.</span>':'All clear. A good day to <span class="serif">give first.</span>';
    lede=live+' campaign'+(live===1?' is':'s are')+' live. '+(now.reply?now.reply+' repl'+(now.reply===1?'y':'ies')+' in the last 30 days.':'Replies will show up here as they land.');
    cta='<button class="btn btn-primary btn-lg" onclick="go(\'launch\')">Today’s messages'+ico('arrow','a')+'</button>'}
  else{head=esc(building.name)+' is <span class="serif">taking shape.</span>';lede='Next: '+MODULES.find(m=>m.k===nextK).l.toLowerCase()+', with '+AGENTS[nextK].n+'.';
    cta='<button class="btn btn-primary btn-lg" onclick="S.cur=\''+building.id+'\';save();go(\''+nextK+'\')">'+agentFace(nextK,22,{badge:false})+'Continue with '+AGENTS[nextK].n+ico('arrow','a')+'</button>'}
  const num=(p.wonVal||p.val)?'<div class="hh-num" onclick="go(\'pipeline\')" role="button" tabindex="0"><div class="hn-ring">'+ringSVG(pct,p.target?Math.min(1,(p.wonVal+p.weighted)/p.target):0)+'<div class="c"><b>'+Math.round(pct*100)+'%</b><span>of target</span></div></div><div class="hn-r"><small>Won this year</small><b>'+money(p.wonVal,true)+'</b><small>Live pipeline</small><b>'+money(p.val,true)+'</b></div></div>':'';
  const today=live?'<section class="today11"><div class="t11 card" data-tour="moves"><div class="card-h"><h3>Who to contact today</h3><button class="link small" onclick="go(\'signals\')">All signals</button></div>'+(pl.length?'<div class="who">'+pl.slice(0,5).map(x=>{const a=x.acc&&accountById(x.acc);return '<div class="wrow">'+(a?logo(a,36):'<span class="lg ic">'+ico(x.ic)+'</span>')+'<div class="grow"><b>'+esc(x.t)+'</b><small>'+esc(x.s)+'</small></div>'+(x.heat?heatDots(x.heat):'')+'<button class="btn btn-line btn-xs" onclick="'+x.btn[1]+'">'+x.btn[0]+'</button></div>'}).join('')+'</div>':'<div class="empty">Nothing urgent. Send something useful to a brand on your list.</div>')+'</div>'+
    '<div class="t11 card" data-tour="ins"><div class="card-h"><h3>Spotted by Scope &amp; Lens</h3><button class="link small" onclick="go(\'insights\')">All insights</button></div>'+(ins.length?'<div class="ins11">'+ins.map(x=>'<button onclick="openInsight(\''+x.id+'\')"><span class="ik">'+esc(INS_CATS[x.cat]||'')+'</span><b>'+esc(x.title)+'</b><small>'+fmtDate(x.date)+'</small></button>').join('')+'</div>':'<div class="empty">Nothing new yet.</div>')+'</div></section>':'';
  const camps=C.length?'<section class="camps11" data-tour="camps"><div class="sec-h"><h2 class="h-m">Your campaigns</h2>'+(C.length>3?'<button class="link" onclick="go(\'camps\')">See all '+C.length+'</button>':'')+'</div><div class="cc-grid">'+C.slice(0,3).map(c=>campCard(c,1)).join('')+(C.length<3?newCard():'')+'</div></section>':'';
  return '<section class="hh11'+(num?'':' solo')+'"><div class="hh-l"><div class="hh-k">'+greet()+(first?', '+esc(first):'')+' · '+new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})+'</div><h1>'+head+'</h1><p class="hh-p">'+lede+'</p><div class="row wrap" style="gap:10px;margin-top:18px">'+cta+'</div></div>'+num+'</section>'+
    today+camps+crewRelay(building||C[0]||null)};

/* ── step pages: the campaign bar keeps to the campaign, without a second New campaign button ── */
const _campHead122=campHead;campHead=function(c,k){return _campHead122(c,k).replace(/<button class="btn btn-line btn-xs" onclick="newCampaignFlow\(\)">[\s\S]*?<\/button>/,'')};

/* ── the account menu: only what is not already in the sidebar ── */
const _toggleUserMenu122=toggleUserMenu;toggleUserMenu=function(e){_toggleUserMenu122(e);const m=$('#umenu');if(!m||!m.classList.contains('on'))return;
  $$('#umenu > button').forEach(b=>{const t=b.textContent.trim();if(['Agency profile','Settings','Manage access'].includes(t))b.remove();if(t==='How it works')b.lastChild.textContent='Replay the walkthrough';if(t==='Show me around')b.lastChild.textContent='Show me around this portal'})};

/* ── Who to target: Find more lives in the header, the score key stays, nothing else above the brands ── */
const _findHero122=findHero;findHero=function(scanned){return scanned?scoreKey():_findHero122(scanned)};
const _vProspects122=VIEWS.prospects;VIEWS.prospects=function(tab){const h=_vProspects122(tab);const c=curCamp();
  if(!profDone()||PF||!campScanned(c))return h;
  return h.replace(ico('plus')+'Add your own brand</button>',ico('plus')+'Add your own brand</button><button class="btn btn-primary btn-sm" onclick="findNow()">'+ico('radar')+'Find more prospects</button>')};

/* ── What to share: the gift first, then the content bank, everything else on request ── */
valueView=function(c){const T=toolsFor();const best=T.slice(0,3);const rest=T.slice(3).filter(t=>toolF==='all'||t.f===toolF);const pick=toolById(c.assets[0]);const tg=campTargets(c);const many=c.assets.length>1;const mine=myIdeas(c).filter(t=>t.src!=='bank');const E=edgeOf();
  const edgeRows=[['star','What you do best',E.best],['bolt','Why you, not them',E.why],['check','Proof',E.proof],['bulb','Your first offer',E.first],['people','Clients',E.clients],['trophy','Recognition',E.awards],['flag','What you believe',E.pov]].filter(x=>x[2]);
  const mineShown=MOREMINE?mine:mine.slice(0,6);
  return thinkCard(c)+
  (many&&pick?'<div class="advice">'+art('gift','xs')+'<div class="grow"><b>You are giving '+c.assets.length+' things. Lead with one.</b><p>One gift lands as a gift. Three lands as a sales pack. <b>'+esc(pick.n)+'</b> goes first, and the others are saved for later touchpoints.</p></div><button class="btn btn-line btn-sm" onclick="keepOne()">Just give '+esc(pick.n.replace(/^The /,'the '))+'</button></div>':'')+
  '<div class="vgrid"><div>'+
    (bankSuggest(c))+'<div class="sec-h"><h2 class="h-m">Picked for you</h2><span class="muted small">Matched to what you do, who you sell to and '+(campProb()?L_PROBLEMS[campProb()].short:'the problem you fix')+'</span></div>'+
    '<div class="feat" data-tour="assets">'+best.map((t,i)=>featTool(t,c,i).replace('<p class="ft-t">','<p class="ft-why">'+esc(whyFits(t))+'</p><p class="ft-t">')).join('')+'</div>'+
    (mine.length?'<div class="sec-h" style="margin-top:28px"><h2 class="h-m">Made from your profile and their news</h2><span class="muted small">From your agency profile, your assets and the news on your brands</span></div><div class="tgrid">'+mineShown.map(t=>myCard(t,c)).join('')+'</div>'+(mine.length>6&&!MOREMINE?'<button class="btn btn-line btn-sm" style="margin-top:12px" onclick="MOREMINE=true;go(\'give\',null,true)">Show '+(mine.length-6)+' more</button>':''):'')+
    (libGifts().length?'<div class="sec-h" style="margin-top:28px"><h2 class="h-m">From your library</h2><span class="muted small">Things you already have. Proof beats promise.</span></div><div class="tgrid">'+libGifts().map(t=>miniTool(t,c)).join('')+'</div>':'')+
    (MOREIDEAS?'<div class="sec-h" style="margin-top:28px"><h2 class="h-m">More ideas to give</h2>'+seg([['all','All']].concat(Object.entries(TOOL_FORMATS).filter(([k])=>T.slice(3).some(t=>t.f===k))),toolF,"toolF=$;go('give',null,true)")+'</div><div class="tgrid">'+rest.map(t=>miniTool(t,c)).join('')+'</div>'
      :'<button class="morebar" onclick="MOREIDEAS=true;go(\'give\',null,true)">'+ico('plus')+'Browse '+(T.length-3)+' more ideas to give</button>')+
  '</div><aside class="card sticky offer12" data-tour="offer"><div class="card-h"><h3>Your edge</h3></div><p class="small muted" style="margin-bottom:12px">From your agency profile and assets. Muse uses it in every gift and message.</p>'+
    edgeRows.map(x=>'<div class="ofl"><span>'+ico(x[0])+'</span><div><small>'+x[1]+'</small><p>'+esc(x[2])+'</p></div></div>').join('')+'<button class="link tiny" style="margin-top:6px" onclick="go(\'agency\',\'value\')">Change it in your agency profile</button></aside></div>'+
  (tg.length?'<details class="hooksd"><summary><b>How to open with each brand</b><span class="muted small">'+Math.min(tg.length,6)+' brands, using their news and your gift</span></summary><div class="hooks">'+tg.slice(0,6).map(a=>{const n=a.news;const ang=L_ANGLES[n?n.type:'none'];return '<div class="hook"><div class="hk-h">'+logo(a,36)+'<div class="grow" style="min-width:0"><b>'+esc(a.name)+'</b><div class="tiny muted">'+(n?esc(L_TRIGGER_LABELS[n.type])+' · '+fmtYM(n.date):'No headline this quarter')+'</div></div></div><p class="small" style="margin-top:10px"><b style="color:var(--brand)">The move:</b> '+esc(angleT(ang.move,a,pick||best[0]))+'</p></div>'}).join('')+'</div></details>':'')+
  '<div class="listbar"><div class="grow muted small">'+(pick?'Giving <b style="color:var(--ink)">'+esc(pick.n)+'</b>'+(many?' first, then '+(c.assets.length-1)+' more later':''):'Choose one thing to give. You can pick more, but one works best.')+'</div><button class="btn btn-primary" onclick="'+(c.assets.length?"go('reach')":"toast('Tap Use this on an idea you like')")+'">Next: how to reach them'+ico('arrow','a')+'</button></div>'};

/* ── How to reach: choose the channels first, then get your LinkedIn ready ── */
const _journeyView122=journeyView;journeyView=function(c){const h=_journeyView122(c);const li=liScanCard(c);const body=h.startsWith(li)?h.slice(li.length):h.replace(li,'');
  for(const m of ['<div style="margin-top:16px"><div class="card evc','<div class="card evc','<div class="row wrap" style="margin-top:14px;gap:8px"><button class="btn btn-line btn-sm" onclick="downloadPlanPDF()">']){const i=body.indexOf(m);if(i>=0)return body.slice(0,i)+'<div style="margin-top:16px">'+li+'</div>'+body.slice(i)}
  return body+'<div style="margin-top:16px">'+li+'</div>'};

/* ── Signals: the warm brands first, where the data comes from underneath ── */
const _vSignals122=VIEWS.signals;VIEWS.signals=function(){const src=sourcesStrip();let h=_vSignals122();if(!h.includes(src))return h;h=h.replace(src,'');
  const at=h.lastIndexOf('<div class="handoff');const block='<div class="sec-h" style="margin-top:26px"><h2 class="h-m">Where your signals come from</h2></div>'+src;
  return at>=0?h.slice(0,at)+block+h.slice(at):h+block};

/* ── LinkedIn readiness everywhere follows the new profile scan ── */
const _liPct122=liPct;liPct=function(){const L=S.liScan;if(L&&L.score&&!L.blocked){const all=(L.sugg||[]).length&&L.sugg.every(s=>s.done);return all?100:Math.min(99,L.score)}return _liPct122()};

/* ── Campaigns: the empty starter campaign is never shown as if it were real ── */
const _vCamps122=VIEWS.camps;VIEWS.camps=function(a){const keep=S.campaigns;S.campaigns=keep.filter(c=>!isBlankCamp(c)||c.touched);try{return _vCamps122(a)}finally{S.campaigns=keep}};
