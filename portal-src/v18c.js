/* ═══════════ v18c CREATE VALUE ═══════════
   Tell Gus what you have. One click and he builds every asset the campaign needs, each tied to a prospect problem
   and how you fix it. The content bank sits alongside as the checklist. Ideas are only ever for your sectors. */

const CV_GROUP=[['hero','Lead with','gift'],['case','Prove it','chart'],['lipost','Stay visible','linkedin'],['blog','Go deeper','doc'],['video','For the warmest brands','play'],['screen','For the warmest brands','monitor']];
function cvSecs(c){const P=S.setup.profile;const t=campTargets(c).map(a=>a.sk).filter(Boolean);return [...new Set((P.sectors||[]).concat(t))]}
function cvVal(slot,c){const A=audOf();const D=mainDisc();const O=S.setup.offer;const g=toolById(c.assets[0]);const hero=g?g.n:'your hero piece';const proof=(O.proof||'').replace(/\.$/,'');
  return({hero:'Shows a '+A.role+' at a '+A.sec+' brand exactly where '+A.prob+' is costing them, in ten minutes. It names the gap; your '+D.cap+' is how it closes.',
    case:proof?'Proof you have fixed '+A.prob+' before: '+lcf(proof)+'. It answers "have you done this?" before they ask.':'Proof you have fixed '+A.prob+' before, told for a '+A.sec+' brand. It answers "have you done this?" before they ask.',
    lipost:'Keeps you in their feed between messages with one useful point about '+A.prob+', so your name is familiar when the email lands.',
    blog:'Somewhere to send a '+A.role+' who wants more: the thinking behind '+hero+', and how you would tackle '+A.prob+'.',
    video:'Two minutes for one person: their own brand on screen, the gap you spotted, and the first move you would make.',
    screen:'Lets them use '+hero+' without you, so the value lands even if they never reply.'})[slot]||''}
function cvItems(c){return bankItems(c).map(it=>Object.assign({},it,{val:it.val||(it.id==='hero'?(c.heroVal18||cvVal('hero',c)):cvVal(it.slot,c))}))}
function cvSectorIdeas(c){const secs=cvSecs(c);const lead=c.assets[0];const si=t=>Math.min(...t.sec.map(k=>secs.includes(k)?secs.indexOf(k):99));let T=toolsFor().filter(t=>t.sec&&t.sec.some(k=>secs.includes(k))&&t.id!==lead).sort((a,b)=>si(a)-si(b));if(T.length<3)T=T.concat(toolsFor().filter(t=>!t.sec&&t.id!==lead&&!T.includes(t)).slice(0,3-T.length));return T}

/* ── generating: local templates always work; the AI version is better when it is there ── */
let CV_BUSY=0;
async function cvGenerate(){const c=curCamp();if(!c||CV_BUSY)return;const f=$('#cvFeed');if(f)c.feed18=f.value.trim();save();CV_BUSY=1;go('give',null,true);
  const B=bankOf(c);const secs=cvSecs(c);if(!c.assets[0]){const t=cvSectorIdeas(c)[0]||toolsFor()[0];if(t)c.assets.unshift(t.id)}
  let ai=null;if(typeof isLive==='function'&&isLive()&&!DEMO_MODE){const P=S.setup.profile,O=S.setup.offer,I=agInfo();
    try{ai=await api('assets',{method:'POST',body:{feed:c.feed18||'',agency:S.setup.agency,uvp:O.uvp,different:O.different,proof:O.proof,offer:O.solution,services:I.services,sectors:secs.map(secLabel),roles:(P.roles||[]).map(r=>(L_ROLES[r]||{label:r}).label),problem:PROB().label,hero:(toolById(c.assets[0])||{}).n||''}})}catch(e){ai=null}}
  else await new Promise(r=>setTimeout(r,matchMedia('(prefers-reduced-motion: reduce)').matches?300:3600));
  const have=k=>B.items.filter(x=>x.slot===k).length;const add=(slot,t,body,val)=>B.items.push({id:uid(),slot,t,body,status:'draft',src:'maker',at:today(),val,gen18:1});
  if(ai&&ai.items&&ai.items.length){const before={};BANK_SLOTS.forEach(sl=>before[sl.k]=bankItems(c).filter(x=>x.slot===sl.k).length);
    ai.items.forEach(x=>{if(x.slot==='hero'){c.heroVal18=x.val;if(c.assets[0]||before.hero)return}
      const need=x.slot==='lipost'?3:x.slot==='screen'&&!heroIsTool(c)?0:1;if(x.slot!=='hero'&&before[x.slot]>=need)return;add(x.slot,x.t,x.body,x.val)});
    c.ideas18=(ai.ideas||[]).map(x=>Object.assign({id:uid()},x))}
  else{const libCase=libState().items.some(x=>x.cat==='case');
    if(!libCase&&!have('case')){const O=S.setup.offer;const A=audOf();add('case','How we fixed '+A.prob+' for [a client]','Outline\n1. The brief in one line: [what they asked for]\n2. What was really going on: [the problem behind the brief]\n3. The three moves we made: [move one], [move two], [move three]\n4. The result: '+(O.proof||'[a real result, in one line]')+'\n5. What it would mean for a '+A.sec+' brand now',cvVal('case',c))}
    for(let i=have('lipost');i<3;i++){const d=makerDraft('lipost',c);if(d)add('lipost',d.t,d.body,cvVal('lipost',c))}
    if(!have('blog')){const d=makerDraft('blog',c);if(d)add('blog',d.t,d.body,cvVal('blog',c))}
    if(!have('video')){const d=makerDraft('video',c);if(d)add('video',d.t,d.body,cvVal('video',c))}
    if(heroIsTool(c)&&!have('screen')){const d=makerDraft('screen',c);if(d)add('screen',d.t,d.body,cvVal('screen',c))}
    if(c.feed18){const first=c.feed18.split(/(?<=[.!?])\s+/)[0].slice(0,160);const p=B.items.filter(x=>x.slot==='lipost'&&x.gen18)[0];if(p&&first)p.body='Something we have been working on: '+lcf(first.replace(/\.$/,''))+'.\n\n'+p.body}}
  c.gen18=today();CV_BUSY=0;save();award('bank');go('give',null,true);toast('Gus built your campaign assets. Open each one to make it yours.')}
function cvTick(){const L=$('#cvFeedList');if(!L)return;const steps=['Reading what you told me','Picking the hero piece for '+audOf().sec+' brands','Writing three LinkedIn posts','Outlining the case study','Drafting the blog post','Scripting a personalised video'];let i=0;
  const t=setInterval(()=>{const l=$('#cvFeedList');if(!l||!CV_BUSY){clearInterval(t);return}if(i<steps.length){l.insertAdjacentHTML('beforeend','<li>'+ico('check')+steps[i]+'</li>');i++}},560)}

/* ── the page ── */
function cvRow(it,c){const s=BANK_SLOTS.find(x=>x.k===it.slot)||{l:'',ic:'doc'};const st=it.status==='ready'?'ready':(it.body&&/\[[^\]]+\]/.test(it.body))?'you':'draft';
  return '<button class="cv-it '+st+(it.gen18&&c.gen18===today()?' new':'')+'" onclick="bankOpen(\''+it.id+'\')"><span class="cv-ic">'+ico(s.ic)+'</span><span class="grow"><small>'+esc(({hero:'Hero piece',case:'Case study',lipost:'LinkedIn post',blog:'Blog post or report',video:'Personalised video',screen:'Screen recording'})[it.slot]||s.l)+(it.src==='maker'?' · drafted by Gus':it.src==='lib'?' · from your library':'')+'</small><b>'+esc(it.t)+'</b><span class="cv-val">'+esc(it.val)+'</span></span>'+
    '<span class="cv-st">'+(st==='ready'?ico('check')+'Ready':st==='you'?'Needs your touch':it.id==='hero'?'Being made':'Draft')+'</span></button>'}
function cvIdea(t,c){const q="'"+t.id+"'";return '<div class="cv-idea"><div class="cv-ik">'+esc(TOOL_FORMATS[t.f]||'Idea')+'</div><b>'+esc(t.n)+'</b><p>'+esc(t.t)+'</p><small>'+esc(t.why||'')+'</small><div class="cv-ia"><button class="btn btn-line btn-xs" onclick="cvHero('+q+')">Make it the hero</button><button class="link" onclick="openTool&&openTool('+q+')">How to make it</button></div></div>'}
function cvAiIdea(x){return '<div class="cv-idea ai"><div class="cv-ik">'+ico('sparkle')+'Gus’s idea</div><b>'+esc(x.n)+'</b><p>'+esc(x.t)+'</p><small>'+esc(x.why)+'</small><div class="cv-ia"><button class="btn btn-line btn-xs" onclick="cvAddIdea(\''+x.id+'\')">'+ico('plus')+'Add to the plan</button></div></div>'}
function cvHero(id){const c=curCamp();act('New hero piece: '+(toolById(id)||{n:''}).n,()=>{c.assets=[id].concat(c.assets.filter(x=>x!==id));c.heroVal18='';if(bankOf(c).hero)bankOf(c).hero=0},{refresh:false,ic:'🎁'});go('give',null,true)}
function cvAddIdea(id){const c=curCamp();const x=(c.ideas18||[]).find(i=>i.id===id);if(!x)return;bankOf(c).items.push({id:uid(),slot:'blog',t:x.n,body:x.t+'\n\nWhy it works: '+x.why+'\n\n[How you would make it]',status:'draft',src:'maker',at:today(),val:x.why});c.ideas18=c.ideas18.filter(i=>i.id!==id);save();toast('Added to the plan');go('give',null,true)}
function cvBank(c){const sl=bankSlots(c);const p=bankPct(c);const ok=bankReady(c);
  return '<aside class="cv-bank"><div class="cv-bh">'+ring(p,58)+'<div><small>Content bank</small><b>'+(ok?'Ready to launch':'Getting there')+'</b></div></div>'+
    '<ul>'+sl.filter(s=>s.core||s.items.length).map(s=>'<li class="'+(s.ok?'ok':'')+'"><i>'+(s.ok?ico('check'):'')+'</i><span class="grow">'+esc(s.l)+'</span><em>'+(s.core?Math.min(s.ready,s.need)+'/'+s.need:s.ready?s.ready+' ready':'Bonus')+'</em></li>').join('')+'</ul>'+
    '<p>'+(ok?'Enough to share something new every couple of weeks.':'To launch: a hero piece, a case study and a blog post or report, marked ready.')+'</p>'+
    '<button class="btn btn-ghost btn-sm" onclick="bankAdd(\'case\')">'+ico('upload')+'Add something you have</button>'+
    (ok?'<button class="btn btn-primary btn-sm" onclick="go(\'reach\')">Next: plan the journey'+ico('arrow','a')+'</button>':'')+'</aside>'}
VIEWS.give=function(){const c=campPrep();campTab='value';const A=audOf();const P=S.setup.profile;const mine=(P.problems||[]).filter(k=>L_PROBLEMS[k]);const cur=c.problem||mine[0]||'';
  const I=cvItems(c);const gen=!!(c.gen18||I.filter(x=>x.src==='maker').length>=3);const lib=libState().items.slice(0,4);
  const prob='<div class="cv-prob"><span>For <b>'+esc(cvSecs(c).slice(0,2).map(secLabel).join(' and ')||'your sectors')+'</b> brands facing</span><select class="inp sm" onchange="setCampProb(this.value)">'+Object.entries(L_PROBLEMS).sort((a,b)=>(mine.includes(b[0])?1:0)-(mine.includes(a[0])?1:0)).map(([k,v])=>'<option value="'+k+'"'+(k===cur?' selected':'')+'>'+esc(v.label)+'</option>').join('')+'</select></div>';
  const feed='<section class="cv-feed'+(gen&&!CV_BUSY?' slim':'')+'">'+agentFace('give',gen?36:52,{badge:false})+'<div class="grow">'+
    (CV_BUSY?'<b>Gus is building your campaign</b><ul id="cvFeedList" class="cv-fl"></ul>':
    '<label for="cvFeed"><b>'+(gen?'Tell Gus more, and he will rebuild':'What do you have for this campaign?')+'</b>'+(gen?'':'<span>A report, a result, a point of view, a link. Gus turns it into everything the campaign needs, each piece tied to '+esc(A.prob)+' and how you fix it.</span>')+'</label>'+
    '<textarea id="cvFeed" class="inp" rows="'+(gen?2:4)+'" placeholder="e.g. We have a 2026 report on why '+esc(A.sec)+' brands look alike, a case study where we lifted awareness 9 points, and a strong view that most rebrands play it too safe.">'+esc(c.feed18||'')+'</textarea>'+
    (lib.length?'<div class="cv-uses"><small>Gus will also use</small>'+lib.map(x=>'<span>'+ico(x.cat==='site'?'link':'file')+esc(libName(x.name))+'</span>').join('')+'</div>':'')+
    '<div class="cv-fa"><button class="btn btn-ghost btn-sm" onclick="bankAdd(\'hero\')">'+ico('upload')+'Upload a file</button><button class="btn btn-primary" onclick="cvGenerate()">'+ico('sparkle')+(gen?'Rebuild my assets':'Create my campaign assets')+'</button></div>')+'</div></section>';
  let plan='';if(gen||I.length){plan='<section class="cv-plan"><div class="cv-ph"><h2>Your campaign <span class="serif">assets.</span></h2><span class="muted small">Tap any one to read, edit and mark it ready.</span></div>';
    const seen=new Set();CV_GROUP.forEach(([k,l])=>{const its=I.filter(x=>x.slot===k);if(!its.length)return;plan+=(seen.has(l)?'':'<div class="cv-gl">'+l+'</div>')+its.map(it=>cvRow(it,c)).join('');seen.add(l)});plan+='</section>'}
  const ideas=cvSectorIdeas(c).slice(0,c.more18?6:3);const ai=(c.ideas18||[]);
  const ideasH='<section class="cv-ideas"><div class="cv-ph"><h2>More ideas for your <span class="serif">sectors.</span></h2><span class="muted small">Only for '+esc(cvSecs(c).slice(0,3).map(secLabel).join(', '))+'</span></div><div class="cv-ig">'+ai.map(cvAiIdea).join('')+ideas.map(t=>cvIdea(t,c)).join('')+'</div>'+(c.more18?'':'<button class="link" onclick="curCamp().more18=1;go(\'give\',null,true)">Show three more</button>')+'</section>';
  return secHead('give','Create <span class="serif">value.</span>')+noTargets(c)+prob+'<div class="cv"><div class="cv-main">'+feed+plan+ideasH+'</div>'+cvBank(c)+'</div>'};
VIEWS.give_after=function(){if(CV_BUSY)cvTick()};
