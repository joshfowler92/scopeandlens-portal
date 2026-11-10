/* ═══════════ v13: YOUR INSIGHTS ═══════════
   Personal to the agency: ranked by the sectors it wants, the brands on its campaigns and what it does.
   Three personal sections sit above everything Scope & Lens publishes: news in your sectors (real, sourced
   stories from the research edition), the brands on your campaigns, and playbooks for an agency like yours.
   "Tune your insights" lets each agency choose what it follows. */
const INS_TOPICS={sectors:'Your sectors',brands:'Brands on your campaigns',pitch:'Pitches and reviews',moves:'People moves',growth:'Growing your agency'};
function insPrefs(){S.insPrefs=S.insPrefs||{topics:Object.keys(INS_TOPICS),sectors:null};return S.insPrefs}
function insSecs(){const p=insPrefs();return p.sectors||(S.setup.profile.sectors||[])}
function myBrandSet(){return new Set(S.campaigns.flatMap(c=>campTargets(c).map(a=>norm(a.name))))}
function insScore(x){const mine=myBrandSet();const secs=new Set(insSecs());const P=insPrefs();let s=0;
  const b=(x.brands||[]);s+=Math.min(60,b.filter(n=>mine.has(norm(n))).length*20);
  s+=Math.min(30,b.filter(n=>{const p=PROSPECTS.find(q=>norm(q.name)===norm(n));return p&&secs.has(p.sector)}).length*6);
  if(P.topics.includes('pitch')&&x.cat==='pitch')s+=12;if(P.topics.includes('moves')&&x.cat==='moves')s+=12;if(P.topics.includes('growth')&&x.cat==='playbook')s+=10;
  s+=Math.max(0,20-Math.floor(daysAgo(x.date||today())/7));if(x.pin)s+=8;return s}
const _getInsights13=getInsights;getInsights=function(){return _getInsights13().map(x=>Object.assign(x,{_s:insScore(x)})).sort((a,b)=>b._s-a._s)};
/* playbooks for growing an agency, matched to what the agency does (advice, not data) */
const PLAYBOOKS13=[
  {d:['brand','creative','full'],t:'Lead with a point of view, not a credentials deck',s:'Brands remember the agency that showed them something about their own category. Pick one observation about sameness in their sector and make it the opening.',k:'Point of view'},
  {d:['media','digital','data'],t:'Give them a number they did not have',s:'A short benchmark against two rivals, built from public data, earns a reply far more often than a capabilities email. Keep it to one page.',k:'Benchmarks'},
  {d:['pr','content'],t:'Turn their news into your opening line',s:'A results day, a launch or a new leader is a reason to talk now. Reference it in the first sentence and offer one idea that builds on it.',k:'Why now'},
  {d:['creative','content','brand'],t:'The teardown that gets forwarded',s:'Two minutes on their latest work, recorded for them: what works, what to try next. It is useful whether or not they hire you, which is why it gets passed on.',k:'Teardowns'},
  {d:['full','media','digital','data','pr','brand','creative','content'],t:'Twelve weeks, one problem, a short list',s:'One campaign a quarter, built around one problem you solve, aimed at twelve to twenty brands. Steady and specific beats a big list and a blast.',k:'Rhythm'},
  {d:['full','media','digital','data','pr','brand','creative','content'],t:'95% are not buying today. Be remembered when they are',s:'95% of B2B buyers are not in market at any one time, and 81% of those who are already have a preferred agency. Give before you ask, so you are the preferred one.',k:'Being remembered'}];
function insTune(){const p=insPrefs();const secs=new Set(insSecs());
  modal('<h2>Tune your insights</h2><p class="sub">Choose what Your Insights follows. It starts from your agency profile.</p><div class="lab">Topics</div><div class="chips" style="margin:6px 0 16px">'+Object.entries(INS_TOPICS).map(([k,l])=>'<button class="chip'+(p.topics.includes(k)?' on':'')+'" data-k="'+k+'" onclick="this.classList.toggle(\'on\')">'+l+'</button>').join('')+'</div>'+
    '<div class="lab">Sectors</div><div class="chips" id="itSec" style="margin:6px 0 4px">'+Object.entries(L_SECTORS).map(([k,v])=>'<button class="chip'+(secs.has(k)?' on':'')+'" data-k="'+k+'" onclick="this.classList.toggle(\'on\')">'+esc(v.label)+'</button>').join('')+'</div>'+
    '<div class="modal-foot"><button class="btn btn-ghost" onclick="closeOverlays()">Cancel</button><button class="btn btn-primary" onclick="insTuneSave()">Save</button></div>')}
function insTuneSave(){const p=insPrefs();p.topics=[...$$('.modal .chips:first-of-type .chip.on')].map(b=>b.dataset.k).filter(k=>INS_TOPICS[k]);p.sectors=[...$$('#itSec .chip.on')].map(b=>b.dataset.k);if(!p.topics.length)p.topics=Object.keys(INS_TOPICS);save();closeOverlays();go('insights',null,true);toast('Your insights are tuned')}
function newsCard(p,mine){return '<a class="nwc" href="'+esc(p.src)+'" target="_blank" rel="noopener">'+logo(p,40)+'<div class="grow"><small>'+esc((L_SECTORS[p.sector]||{label:''}).label)+' · '+esc(p.pub||'Source')+' · '+fmtDate((p.nd||'')+(String(p.nd).length===7?'-01':''))+(mine?' · <em>On your campaign</em>':'')+'</small><b>'+esc(p.name)+'</b><p>'+esc(p.news)+'</p></div>'+ico('external','nwc-x')+'</a>'}
const _vIns13=VIEWS.insights;VIEWS.insights=function(cat){const p=insPrefs();const secs=new Set(insSecs());const mine=myBrandSet();const P=S.setup.profile||{};
  const news=PROSPECTS.filter(x=>x.news&&x.src&&x.nt!=='none'&&monthsAgo(x.nd)<=6);
  const inSec=p.topics.includes('sectors')?news.filter(x=>secs.has(x.sector)&&!mine.has(norm(x.name))).sort((a,b)=>String(b.nd).localeCompare(String(a.nd))).slice(0,6):[];
  const onList=p.topics.includes('brands')?news.filter(x=>mine.has(norm(x.name))).slice(0,6):[];
  const ds=new Set(typeof myDiscs==='function'?myDiscs():[]);const plays=p.topics.includes('growth')?PLAYBOOKS13.filter(b=>b.d.some(d=>ds.has(d))||!ds.size).slice(0,4):[];
  const who=[(typeof myDiscs==='function'?myDiscs():[]).map(k=>(L_DISCIPLINES[k]||{label:''}).label.toLowerCase()).filter(Boolean).slice(0,2).join(' and '),[...secs].slice(0,3).map(k=>(L_SECTORS[k]||{label:k}).label).join(', ')];
  let h=String(_vIns13(cat)).replace('News, <span class="serif">spotted early.</span>','Your <span class="serif">insights.</span>');
  const top='<div class="ins13"><div class="ins13-h"><div>'+platoFace(28)+'<p><b>Personalised for '+esc(S.setup.agency&&S.setup.agency!=='Your agency'?S.setup.agency:'you')+'</b>'+(who[0]?': '+esc(who[0]):'')+(who[1]?' for '+esc(who[1]):'')+'. Ranked by your sectors, the brands on your campaigns and what you do.</p></div><div class="row" style="gap:8px"><button class="btn btn-line btn-sm" onclick="insTune()">'+ico('settings')+'Tune your insights</button>'+plBtn('What should I take from this week’s news in my sectors?','What matters this week?')+'</div></div>'+
    (onList.length?'<section class="ins13-s"><div class="sec-h"><h2 class="h-m">About the brands on your <span class="serif">campaigns.</span></h2></div><div class="nwg">'+onList.map(x=>newsCard(x,true)).join('')+'</div></section>':'')+
    (inSec.length?'<section class="ins13-s"><div class="sec-h"><h2 class="h-m">In your <span class="serif">sectors.</span></h2><span class="muted small">Real stories, each with its source</span></div><div class="nwg">'+inSec.map(x=>newsCard(x,false)).join('')+'</div></section>':'')+
    (plays.length?'<section class="ins13-s"><div class="sec-h"><h2 class="h-m">Grow an agency <span class="serif">like yours.</span></h2></div><div class="plg">'+plays.map((b,i)=>'<div class="plc" style="--d:'+i*60+'ms"><span class="ik">'+esc(b.k)+'</span><b>'+esc(b.t)+'</b><p>'+esc(b.s)+'</p>'+plBtn('How could my agency use this idea: '+b.t+'?','Use this')+'</div>').join('')+'</div></section>':'')+
    '<div class="sec-h" style="margin-top:22px"><h2 class="h-m">From <span class="serif">Scope &amp; Lens.</span></h2></div></div>';
  return h.replace(/(<div class="igrid">|<div class="card empty">Nothing here yet\.<\/div>)/,top+'$1')};
