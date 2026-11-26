/* ═══════════ v18h CREATE VALUE, AS A STUDIO ═══════════
   A colourful menu of value-led assets in seven categories. Every idea is written for the campaign's sector and
   its problem, never generic. Adding one drops it into the content bank with a little flourish. */

const CV_CATS=[
  {k:'audit',l:'Audits & teardowns',ic:'magnify',c:'#ff6b6b',d:'Hold up a mirror'},
  {k:'bench',l:'Benchmarks & data',ic:'chart',c:'#4c6ef5',d:'Show where they rank'},
  {k:'tool',l:'Tools & scorecards',ic:'grid',c:'#12b886',d:'Something they can use'},
  {k:'pov',l:'Point of view',ic:'bulb',c:'#7950f2',d:'A sharp opinion, on a page'},
  {k:'video',l:'Personal video',ic:'play',c:'#fd7e14',d:'Two minutes, for one person'},
  {k:'event',l:'Events & workshops',ic:'people',c:'#e64980',d:'A room of their peers'},
  {k:'post',l:'In the post',ic:'gift',c:'#f59f00',d:'Something physical on their desk'}];
const CV_LEX={
  retail:{n:'retail',w:'store, site and app',m:'peak trading',a:'shopping journey',r:'three high street rivals',p:'reviews and basket data',ob:'a shopping bag'},
  fmcg:{n:'FMCG',w:'shelf, pack and social',m:'the next range review',a:'pack',r:'the category leaders',p:'shopper reviews',ob:'a mini shelf'},
  finance:{n:'financial services',w:'sign-up journey, app and letters',m:'ISA season',a:'onboarding journey',r:'three challengers',p:'app store reviews and Trustpilot',ob:'a welcome pack'},
  travel:{n:'travel',w:'booking journey and reviews',m:'the January booking peak',a:'booking flow',r:'two rivals',p:'guest reviews',ob:'a luggage tag'},
  health:{n:'health',w:'pack, site and pharmacy shelf',m:'the January health season',a:'claims',r:'three rivals on shelf',p:'customer reviews',ob:'a prescription pad'},
  tech:{n:'tech',w:'homepage and onboarding',m:'the next funding round',a:'homepage',r:'five category rivals',p:'G2 and app reviews',ob:'a boxed product'},
  b2b:{n:'B2B',w:'site, case studies and LinkedIn',m:'next year’s budget planning',a:'case studies',r:'three competitors',p:'buyer reviews',ob:'a board pack'},
  auto:{n:'automotive',w:'site, configurator and showroom',m:'the September plate change',a:'configurator',r:'three marques',p:'owner reviews',ob:'a key fob'},
  charity:{n:'charity',w:'donation journey and welcome emails',m:'Christmas appeal season',a:'donor journey',r:'three similar charities',p:'supporter comments',ob:'a thank-you card'},
  media:{n:'media',w:'channels, social and trailers',m:'the next launch window',a:'launch campaigns',r:'three rival platforms',p:'audience comments',ob:'a ticket'}};
const CV_LENS={standout:['how alike they look and sound','a distinctive idea and identity','distinctiveness'],dated:['where the brand looks its age','a refresh that keeps what people love','freshness'],
  relevant:['where they have drifted from culture','a reason to matter again','relevance'],customer:['what customers actually say about them','a sharper view of the customer','customer understanding'],
  retain:['where customers quietly leave','reasons to stay','retention'],working:['where the budget works least hard','sharper use of the budget','efficiency'],roi:['what the board cannot see','measurement that convinces','proof of return'],
  convert:['where people drop out before buying','fewer leaks','conversion'],search:['where they vanish in search and AI answers','visibility where people ask','visibility'],b2bpipe:['where buyers lose interest','a fuller pipeline','pipeline'],
  slow:['where work gets stuck','speed','speed to market'],joined:['where their channels contradict each other','one joined-up experience','consistency'],story:['the stories they are not telling','a story people repeat','storytelling'],
  reputation:['what people say when they are not in the room','a better reputation','reputation'],talent:['how they look to the people they want to hire','an employer brand people want','employer appeal']};
function cvSec18(c){const n={};campTargets(c).forEach(a=>{if(a.sk)n[a.sk]=(n[a.sk]||0)+1});const top=Object.entries(n).sort((a,b)=>b[1]-a[1])[0];return (c.sec18&&CV_LEX[c.sec18]&&c.sec18)||(top&&top[0])||cvSecs(c)[0]||'retail'}
function cvCtx(c){const sec=cvSec18(c);const L=CV_LEX[sec]||CV_LEX.retail;const P=PROB();const pk=Object.keys(L_PROBLEMS).find(k=>L_PROBLEMS[k]===P)||'standout';
  const lens=CV_LENS[pk]||CV_LENS[probBase(pk)]||['where '+P.short+' shows up','a fix for '+P.short,'impact'];const A=audOf();const D=mainDisc();
  return{sec,secL:secLabel(sec),L,P,pk,lens,role:A.role,roleP:A.roleP,cap:D.cap,short:P.short}}

function cvGen(cat,x){const L=x.L,lk=x.lens[0],fix=x.lens[1],met=x.lens[2],R=x.role,S=L.n;
  return({
    audit:[[cap1(L.a)+' teardown','We put their '+L.w+' next to '+L.r+' and mark exactly '+lk+'.','A '+R+' feels this every day but rarely sees it on one page.','1 day'],
      ['The '+met+' audit','Twelve moments across their '+L.w+', each scored for '+met+', with the three that cost them most.','Specific, visual and about them, not you.','1 day'],
      ['A '+L.n+' mystery shop','We go through their '+L.w+' as a customer and show '+lk+'.','Hard to ignore when it is their own experience.','2 days']],
    bench:[['The '+S+' '+met+' index','Twenty '+L.n+' brands ranked on '+met+', with theirs highlighted and the top three moves.','Everyone wants to know where they rank.','2 days'],
      ['What '+L.p+' say about '+met,'Thousands of '+L.p+' sorted into themes, theirs against '+L.r+'.','Customers tell them '+lk+' in their own words.','1 to 2 days'],
      [cap1(L.m)+' benchmark','How '+L.n+' brands showed up last '+L.m+', and what the winners did differently on '+met+'.','Lands right in their planning cycle.','1 day']],
    tool:[['The '+met+' self-check','Ten yes or no questions a '+R+' can answer in ten minutes, with a score and what to do next.','Useful whether or not they ever hire you.','Half a day'],
      [cap1(met)+' calculator','Put in three numbers and see what '+x.short+' is costing them, in pounds.','A number they can take to the board.','Half a day'],
      ['A '+L.n+' '+met+' scorecard','A one-page scorecard to rate their own '+L.w+', with a worked example from their category.','Gets passed around the team.','1 day']],
    pov:[['What '+L.m+' will reward','One page on how '+L.n+' brands should tackle '+x.short+' before '+L.m+'.','A sharp opinion earns more attention than credentials.','Half a day'],
      ['Three myths about '+met+' in '+L.n,'The beliefs that keep '+L.n+' brands stuck with '+x.short+', and what to do instead.','Easy to share, easy to agree with.','Half a day'],
      ['If we ran your '+L.a,'A short, concrete plan for the first 90 days of fixing '+x.short+' at their brand.','Shows how you think before they brief anyone.','1 day']],
    video:[['A two-minute walk through their '+L.a,'Record over their own '+L.w+': '+lk+', and the first move you would make.','Personal, fast and impossible to ignore.','20 minutes a brand'],
      ['Their brand against '+L.r,'Three screens side by side, narrated in two minutes, on '+met+'.','Lets them see the gap without a meeting.','30 minutes a brand'],
      ['A new leader’s first look','For a new marketing lead: what you would look at first on '+met+', on screen.','Lands in their first hundred days.','20 minutes a brand']],
    event:[['A '+S+' '+met+' breakfast','Eight '+L.n+' marketers, one topic: '+x.short+'. No slides, good coffee.','A room of peers is the warmest way to meet.','A morning'],
      ['A '+L.n+' roundtable on '+met,'Five brands share what worked on '+x.short+'. You host and write it up.','They get value from each other, you get the room.','A morning'],
      ['A '+met+' workshop for their team','Ninety minutes on their own '+L.a+', ending with three moves they can make.','The natural last step before a brief.','Half a day']],
    post:[[cap1(L.ob)+' with a twist','A physical piece that shows '+lk+', with a short note and a link to the full read.','Post gets opened. Few agencies send it.','A few days'],
      ['The printed '+met+' report','Your hero piece, beautifully printed, with their brand on the cover.','Sits on the desk for weeks.','A few days'],
      ['A '+S+' '+met+' kit','A small box: the scorecard, three examples from their category and a card inviting them to the breakfast.','Memorable, useful and on brand.','1 week']]})[cat]||[]}
function cvIdeas(cat,c){const x=cvCtx(c);const secs=cvSecs(c);const map={audit:['audit'],bench:['benchmark','report'],tool:['scorecard','calculator','map'],pov:['kit','concepts','plan'],video:['video'],event:['event'],post:[]};
  const curated=TOOLS.filter(t=>(map[cat]||[]).includes(t.f)&&t.sec&&t.sec.includes(x.sec)&&(t.p||[]).some(p=>p===probBase(x.pk)||p===x.pk)).slice(0,2)
    .map(t=>({id:t.id,n:t.n,t:t.t,why:t.why,e:t.effort,tool:1}));
  const gen=cvGen(cat,x).map((g,i)=>({id:'g18_'+cat+'_'+i,n:g[0],t:g[1],why:g[2],e:g[3]}));
  return curated.concat(gen).slice(0,4)}
const CV_SLOT={audit:'hero',bench:'hero',tool:'hero',pov:'blog',video:'video',event:'blog',post:'blog'};
function cvAdd18(e,cat,id){const c=curCamp();const it=cvIdeas(cat,c).find(i=>i.id===id);if(!it)return;const B=bankOf(c);const C=CV_CATS.find(x=>x.k===cat);
  if(B.items.some(x=>x.idea18===id)){toast('Already in your content bank');return}
  let slot=CV_SLOT[cat];if(slot==='hero'&&it.tool&&!c.assets[0]){c.assets.unshift(it.id);slot=null}else if(slot==='hero'&&(c.assets[0]||B.items.some(x=>x.slot==='hero')))slot='blog';
  if(slot)B.items.push({id:uid(),slot,t:it.n,body:it.t+'\n\nWhy it lands: '+it.why+'\n\n[What you will make, and how]',status:'draft',src:'maker',at:today(),val:it.t,idea18:id,cat18:cat});
  save();award&&award('bank');cvFly(e,C.c);setTimeout(()=>go('give',null,true),520);toast(it.n+' added to your content bank')}
function cvFly(e,col){try{const r=(e.currentTarget||e.target).getBoundingClientRect();const t=($('.cv2-bank')||document.body).getBoundingClientRect();const d=document.createElement('i');d.className='cv2-fly';d.style.cssText='left:'+(r.left+r.width/2)+'px;top:'+(r.top+r.height/2)+'px;background:'+col;document.body.appendChild(d);
  requestAnimationFrame(()=>{d.style.transform='translate('+(t.left+40-r.left-r.width/2)+'px,'+(t.top+40-r.top-r.height/2)+'px) scale(.4)';d.style.opacity='.2'});setTimeout(()=>d.remove(),600)}catch(x){}}
let CV_CAT='audit';
function cvStudio(c){const x=cvCtx(c);const C=CV_CATS.find(k=>k.k===CV_CAT)||CV_CATS[0];const ideas=cvIdeas(C.k,c);const B=bankOf(c);const inBank=new Set(B.items.map(i=>i.idea18).filter(Boolean).concat(c.assets||[]));
  return '<section class="cv2-studio"><div class="cv2-sh"><h2>Pick the <span class="serif">value.</span></h2><span>Every idea is for <b style="--c:'+C.c+'">'+esc(x.secL)+'</b> brands facing <b style="--c:'+C.c+'">'+esc(x.short)+'</b>.</span></div>'+
    '<div class="cv2-cats">'+CV_CATS.map((k,i)=>'<button class="cv2-cat'+(k.k===C.k?' on':'')+'" style="--c:'+k.c+';--i:'+i+'" onclick="CV_CAT=\''+k.k+'\';go(\'give\',null,true)"><span class="cv2-ci">'+ico(k.ic)+'</span><b>'+k.l+'</b><small>'+k.d+'</small></button>').join('')+'</div>'+
    '<div class="cv2-ideas" style="--c:'+C.c+'">'+ideas.map((it,i)=>{const on=inBank.has(it.id);const q="'"+C.k+"','"+it.id+"'";
      return '<article class="cv2-idea'+(on?' on':'')+'" style="--i:'+i+'"><div class="cv2-top"><span class="cv2-big">'+ico(C.ic)+'</span><em>'+(it.tool?'Proven idea':'Made for this campaign')+'</em></div><h3>'+esc(it.n)+'</h3><p>'+esc(it.t)+'</p><div class="cv2-why">'+ico('check')+esc(it.why)+'</div>'+
        '<div class="cv2-f"><span class="cv2-e">'+ico('clock')+esc(it.e||'')+'</span>'+(on?'<span class="cv2-in">'+ico('check')+'In your bank</span>':'<button class="btn btn-sm cv2-add" onclick="cvAdd18(event,'+q+')">'+ico('plus')+'Add to bank</button>')+'</div></article>'}).join('')+'</div></section>'}
const CV_SLOT_C={hero:'#ff6b6b',case:'#4c6ef5',lipost:'#0a66c2',blog:'#7950f2',video:'#fd7e14',screen:'#12b886'};
function cvShelf(c){const sl=bankSlots(c);const p=bankPct(c);const ok=bankReady(c);
  return '<aside class="cv2-bank"><div class="cv2-bh"><div class="cv2-ring" style="--p:'+p+'"><b>'+p+'%</b></div><div><small>Content bank</small><b>'+(ok?'Ready to launch':'Fill it up')+'</b></div></div>'+
    '<div class="cv2-slots">'+sl.filter(s=>s.core||s.items.length).map((s,i)=>{const n=s.core?Math.min(s.ready,s.need)+'/'+s.need:(s.ready?s.ready+' ready':'Bonus');return '<div class="cv2-slot'+(s.ok?' ok':'')+(s.items.length?' has':'')+'" style="--c:'+(CV_SLOT_C[s.k]||'#868e96')+';--i:'+i+'"><span>'+ico(s.ic)+'</span><b>'+esc(s.l)+'</b><em>'+n+'</em><i style="width:'+Math.round(Math.min(1,(s.ready+s.drafts*.4)/Math.max(1,s.need))*100)+'%"></i></div>'}).join('')+'</div>'+
    '<p>'+(ok?'Enough to share something new every couple of weeks.':'Launch needs a hero piece, a case study and a blog post or report, marked ready.')+'</p>'+
    '<button class="btn btn-ghost btn-sm" onclick="bankAdd(\'case\')">'+ico('upload')+'Add something you have</button>'+(ok?'<button class="btn btn-primary btn-sm" onclick="go(\'reach\')">Next: plan the journey'+ico('arrow','a')+'</button>':'')+'</aside>'}
function cvRow2(it,c){const s=BANK_SLOTS.find(x=>x.k===it.slot)||{l:'',ic:'doc'};const st=it.status==='ready'?'ready':(it.body&&/\[[^\]]+\]/.test(it.body))?'you':'draft';const col=it.cat18?(CV_CATS.find(k=>k.k===it.cat18)||{}).c:CV_SLOT_C[it.slot]||'#868e96';
  return '<button class="cv2-row '+st+'" style="--c:'+col+'" onclick="bankOpen(\''+it.id+'\')"><span class="cv2-ri">'+ico(it.cat18?(CV_CATS.find(k=>k.k===it.cat18)||{}).ic:s.ic)+'</span><span class="grow"><small>'+esc(({hero:'Hero piece',case:'Case study',lipost:'LinkedIn post',blog:'Blog post or report',video:'Personalised video',screen:'Screen recording'})[it.slot]||s.l)+'</small><b>'+esc(it.t)+'</b><span>'+esc(it.val||'')+'</span></span><span class="cv2-st">'+(st==='ready'?ico('check')+'Ready':st==='you'?'Make it yours':it.id==='hero'?'Being made':'Draft')+'</span></button>'}
VIEWS.give=function(){const c=campPrep();campTab='value';const P=S.setup.profile;const mine=(P.problems||[]).filter(k=>L_PROBLEMS[k]);const cur=c.problem||mine[0]||'';const x=cvCtx(c);
  const I=cvItems(c);const gen=!!(c.gen18||I.filter(i=>i.src==='maker').length>=3);
  const brief='<div class="cv2-brief"><label class="cv2-chip s">'+ico('layers')+'<select aria-label="Sector" onchange="curCamp().sec18=this.value;save();go(\'give\',null,true)">'+[...new Set([x.sec].concat(cvSecs(c)))].filter(k=>L_SECTORS[k]).map(k=>'<option value="'+k+'"'+(k===x.sec?' selected':'')+'>'+esc(secLabel(k))+'</option>').join('')+'</select></label><span class="cv2-op">+</span><label class="cv2-chip p">'+ico('target')+'<select onchange="setCampProb(this.value)" aria-label="The problem this campaign solves">'+Object.entries(L_PROBLEMS).sort((a,b)=>(mine.includes(b[0])?1:0)-(mine.includes(a[0])?1:0)).map(([k,v])=>'<option value="'+k+'"'+(k===cur?' selected':'')+'>'+esc(v.label)+'</option>').join('')+'</select></label><span class="cv2-op">+</span><span class="cv2-chip r">'+ico('user')+esc(cap1(x.roleP))+'</span><span class="cv2-op">=</span><span class="cv2-chip v">'+ico('gift')+'Value they will open</span></div>';
  const feed='<section class="cv2-gus">'+agentFace('give',gen?40:54,{badge:false})+'<div class="grow">'+(CV_BUSY?'<b>Gus is building your campaign</b><ul id="cvFeedList" class="cv-fl"></ul>':
    '<label for="cvFeed"><b>'+(gen?'Tell Gus more and he will rebuild':'Or let Gus build the lot')+'</b><span>'+(gen?'':'Tell him what you have: a report, a result, a point of view. One click and every asset is drafted, each tied to '+esc(x.short)+'.')+'</span></label><div class="cv2-gi"><textarea id="cvFeed" class="inp" rows="2" placeholder="e.g. a 2026 report on why '+esc(x.L.n)+' brands look alike, and a case study where we lifted awareness 9 points">'+esc(c.feed18||'')+'</textarea><div class="cv2-ga"><button class="btn btn-ghost btn-sm" onclick="bankAdd(\'hero\')">'+ico('upload')+'Upload</button><button class="btn btn-primary" onclick="cvGenerate()">'+ico('sparkle')+(gen?'Rebuild':'Build it all')+'</button></div></div>')+'</div></section>';
  let plan='';if(I.length){plan='<section class="cv2-plan"><div class="cv2-sh"><h2>Your campaign <span class="serif">assets.</span></h2><span>Tap any one to read, edit and mark it ready.</span></div><div class="cv2-rows">'+I.map(it=>cvRow2(it,c)).join('')+'</div></section>'}
  return secHead('give','Create <span class="serif">value.</span>')+noTargets(c)+brief+'<div class="cv2"><div class="cv2-main">'+cvStudio(c)+feed+plan+'</div>'+cvShelf(c)+'</div>'};
/* the tour and the guided build point at the new studio */
(function(){const g=PT_DEMO.findIndex(s=>s.sel==='.cv-feed');if(g>-1){PT_DEMO[g]=Object.assign({},PT_DEMO[g],{sel:'.cv2-studio',t:'Pick the value',b:'Seven kinds of value, each idea written for this sector and its problem: audits, benchmarks, tools, a point of view, personal video, events and something in the post. Add the ones you like to the content bank.',act:null});
  PT_DEMO.splice(g+1,0,{ch:1,view:'give',sel:'.cv2-gus',t:'Or let Gus build the lot',b:'Tell Gus what you already have. One click and every asset is drafted, each tied to the problem and how you fix it.',act:['Build it all',()=>cvGenerate(),4600]})}
  const b=PT_DEMO.find(s=>s.sel==='.cv-bank');if(b)b.sel='.cv2-bank';
  const k=COACH.find(s=>s.hint==='.cv-feed');if(k)k.hint='.cv2-studio'})();
