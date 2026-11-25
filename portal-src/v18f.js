/* ═══════════ v18f THE PROCESS TOUR ═══════════
   The old demo tour skipped any step whose target had moved, so it jumped from step 3 to step 7.
   This one never skips: every step points at something real, falls back to the page heading if it has to,
   and is grouped into the five stages of the process. Some steps let you watch Plato do the work. */

const PT_CH=[['Set up','Your agency, once'],['Build','A campaign a quarter'],['Intent','Who is leaning in'],['Pipeline','Conversations into deals'],['Repeat','Learn and go again']];
function ptLiveId(){return (S.campaigns.find(campLive)||S.campaigns[0]||{}).id}
const PT_DEMO=[
  {ch:0,view:'home',sel:'',t:'How an agency wins new business with Plato',b:'Five stages, the same loop every quarter. Set your agency up once. Build a campaign around one problem you solve. Watch who leans in. Turn the warm ones into pipeline. Then learn from it and go again. This demo agency, Northgate, is a few weeks into a live campaign.'},
  {ch:0,view:'agency',arg:'read',sel:'.ag18-read',t:'Plato reads your agency',b:'Share your website or drop in your credentials. Plato reads them and fills in your whole profile for you to check: what you do best, your proof, your clients, your voice.',act:['Watch Plato read a website',()=>ag18Read(),5200]},
  {ch:0,view:'agency',arg:'who',sel:'.ch18',t:'Your agency, as Plato sees it',b:'Ten features build up as you go: your craft, superpower, proof, first offer and voice. Every brand score, gift and message draws on this, so the better it is, the better everything else gets.'},
  {ch:0,view:'agency',arg:'want',sel:'.ag18-want,.qgrid',t:'Who you want to win',b:'What you do best, your sectors, the size of client you win and the problems you solve. Set it once and every campaign uses it.'},
  {ch:1,view:'camps',sel:'.cr18-l',t:'One campaign, one problem',b:'Each campaign is built around a single problem you solve, like brands that look and sound like everyone else. One a quarter is the rhythm that works.'},
  {ch:1,view:'prospects',arg:'brands',sel:'.pb-g .pb,.pk-hero,.pk-bar',t:'Nora picks the brands',b:'Every brand is scored on whether they need what you do, their size and your sectors. Each card shows why now, and how likely they are to look at agencies. Tap a score to see the working.',act:['Find more prospects',()=>findNow(),7200]},
  {ch:1,view:'prospects',arg:'people',sel:'.pk-steps .pk-st:last-child',t:'Then the people who decide',b:'The step that makes everything work. Messages and gifts go to a named person, not a logo, so Nora suggests the right roles at every brand.'},
  {ch:1,view:'give',sel:'.cv-feed',t:'Gus creates the value',b:'Tell Gus what you have: a report, a result, a point of view. One click and he builds every asset the campaign needs, each tied to a prospect problem and how you fix it.',act:['Build the assets',()=>cvGenerate(),4600]},
  {ch:1,view:'give',sel:'.cv-bank',t:'The content bank',b:'A hero piece, a case study and a blog post or report are all you need to launch. Posts and videos are a bonus. This is what keeps the campaign fresh for twelve weeks.'},
  {ch:1,view:'reach',sel:'.pl18',t:'Priya plans the journey',b:'She spaces the touchpoints across LinkedIn, email, events and post, leads with value, and puts the right asset on every step. Set a launch date and reminders follow it.',act:['Ask Priya to plan',()=>priyaPlan(),3000]},
  {ch:1,view:'reach',sel:'#seqSvg,[data-tour=timeline],.jgrid',t:'One person’s journey',b:'Twelve weeks, paced like a real relationship, never two emails in a week. Drag any dot to move it, tap it to change it.'},
  {ch:1,view:'launch',sel:'.ln18-today,.ln18-pre,.ln18-main',t:'Launch, a few minutes a day',b:'Otis lines up today’s messages, written in your voice. Send them yourself, or let Amplify send what you approve. Nothing goes out without you.'},
  {ch:2,view:'signals',sel:'#orbStage,.sg18,.orb14',t:'Watch them close in',b:'Every accept, open, click, reply and ad view is scored. The warmer an organisation gets, the closer it moves to the centre. Tap any logo to see why.'},
  {ch:2,view:'signals',sel:'.sg18-lean,.sg18-all',t:'Lean in now',b:'The warmest organisations, the people engaging and what they did. One tap asks Plato what to say next.'},
  {ch:3,view:'pipeline',sel:'.ap18',t:'Deals from live conversations',b:'When a LinkedIn or email conversation turns real, Amplify turns it into an engaged lead or a meeting held, with the conversation as its source. Switch it to automatic and it fills itself.'},
  {ch:3,view:'pipeline',sel:'.ptk,.ptkk,.ptk-two',t:'Against your target',b:'Won this year, what the pipeline should bring in, and the gap still to find. Drag deals between stages as they move.'},
  {ch:4,view:'camps',arg:'@live',sel:'.cr18.open,.cr18-l',t:'What each campaign produced',b:'Reach, engagement, conversations and deals for every campaign, so you know what to keep for the next one.'},
  {ch:4,view:'reports',sel:'.rp18-pv',t:'A report in two clicks',b:'Pick a campaign and a period. Download a clean PDF for the leadership meeting, or copy a summary into Slack.'},
  {ch:4,view:'insights',sel:'.in18,.ins18',t:'What Scope & Lens spots',b:'Pitches, people moves and opportunities in your sectors, so the next campaign starts with a head start.'},
  {ch:4,view:'home',sel:'#plato,.tb-pl',t:'And Plato, the whole way',b:'Ask anything, or tell Plato what to do. When you are ready, build your own. The demo disappears and your workspace starts clean.'}];
const PT_MAIN=[
  {ch:0,view:'home',sel:'',t:'How Plato works',b:'Five stages, the same loop every quarter: set your agency up once, build a campaign, watch who leans in, turn them into pipeline, then learn and go again.'},
  {ch:0,view:'agency',sel:'.ag18-body,.ag18-steps',t:'Start with your agency profile',b:'Share your website or credentials and Plato fills it in for you to check. Everything else draws on it.'},
  {ch:1,view:'home',sel:'.sd18-camp,#tabbar',t:'Build a campaign in four steps',b:'Pick your brands, create value, plan the journey, launch. Ticks show what is done. Tap a step to jump to it.'},
  {ch:2,view:'home',sel:'#nav-signals,#tabbar',t:'Find intent',b:'Signals shows who is leaning in, hottest first, with the reason why and what to say next.'},
  {ch:3,view:'home',sel:'#nav-pipeline,#tabbar',t:'Fill the pipeline',b:'Live conversations become deals, tracked against your target.'},
  {ch:4,view:'home',sel:'#nav-reports,#tabbar',t:'Learn and repeat',b:'Campaign performance, reports in two clicks, and insights for the next round.'},
  {ch:4,view:'home',sel:'#nav-help,#plato,.tb-pl',t:'Help is always here',b:'Speak with Josh, read a guide, replay this tour, or ask Plato anything.'}];
let PT=null;
function ptStart(kind){ptEnd(true);closeOverlays&&closeOverlays();const steps=kind==='demo'?PT_DEMO:PT_MAIN;PT={steps,i:0,kind,busy:0};
  const b=document.createElement('div');b.id='tourBlock';b.className='tour-block';const h=document.createElement('div');h.id='tourHole';h.className='tour-hole pt18-h';const c=document.createElement('div');c.id='tourCard';c.className='tour-card pt18';
  document.body.append(b,h,c);document.addEventListener('keydown',ptKey);ptShow()}
function ptKey(e){if(!PT||PT.busy)return;if(e.key==='ArrowRight')ptGo(1);else if(e.key==='ArrowLeft')ptGo(-1);else if(e.key==='Escape')ptEnd()}
function ptGo(d){if(!PT)return;const n=PT.i+d;if(n<0)return;if(n>=PT.steps.length){ptEnd(false,true);return}PT.i=n;ptShow()}
function ptJump(ch){if(!PT)return;const i=PT.steps.findIndex(s=>s.ch===ch);if(i>-1){PT.i=i;ptShow()}}
function ptFind(sel){if(!sel)return null;for(const p of sel.split(',')){const e=$(p.trim());if(!e)continue;const r=e.getBoundingClientRect();if(r.width>0&&r.height>0)return e}return null}
function ptShow(){if(!PT)return;const st=PT.steps[PT.i];const arg=st.arg==='@live'?ptLiveId():st.arg;
  if(st.view&&(VIEW!==st.view||(arg&&VIEW_ARG!==arg)))go(st.view,arg);
  const c=$('#tourCard'),h=$('#tourHole');if(!c||!h)return;c.classList.add('fade');
  setTimeout(()=>{if(!PT)return;let el=ptFind(st.sel);const view=$('#view');
    if(el){el.scrollIntoView({block:'center',behavior:'instant'})}else if(view)view.scrollTo({top:0});
    setTimeout(()=>{if(!PT)return;ptPlace(st,el)},el?260:60)},st.view&&VIEW===st.view?120:420)}
function ptPlace(st,el){const c=$('#tourCard'),h=$('#tourHole');if(!c||!h)return;const vw=innerWidth,vh=innerHeight;const n=PT.steps.length;
  c.innerHTML='<div class="pt18-ch">'+PT_CH.map((x,i)=>'<button class="'+(i===st.ch?'on':i<st.ch?'dn':'')+'" onclick="ptJump('+i+')"><i>'+(i<st.ch?ico('check'):i+1)+'</i><span>'+x[0]+'</span></button>').join('')+'</div>'+
    '<div class="pt18-k">'+esc(PT_CH[st.ch][1])+' · step '+(PT.i+1)+' of '+n+'</div><h4>'+esc(st.t)+'</h4><p>'+esc(st.b)+'</p>'+
    (st.act?'<button class="pt18-try" onclick="ptTry()">'+ico('play')+esc(st.act[0])+'</button>':'')+
    '<div class="pt18-bar"><i style="width:'+Math.round((PT.i+1)/n*100)+'%"></i></div>'+
    '<div class="pt18-f"><button class="btn btn-sm btn-ghost" onclick="ptEnd()">Skip</button><div class="row" style="gap:6px">'+(PT.i?'<button class="btn btn-sm btn-line" onclick="ptGo(-1)">Back</button>':'')+'<button class="btn btn-sm btn-primary" onclick="ptGo(1)">'+(PT.i===n-1?'Finish':'Next')+ico('arrow','a')+'</button></div></div>';
  const cw=Math.min(380,vw-24);c.style.width=cw+'px';
  if(!el){h.style.opacity='0';h.style.boxShadow='0 0 0 9999px rgba(8,8,8,.55)';Object.assign(h.style,{top:(vh/2)+'px',left:(vw/2)+'px',width:'0px',height:'0px'});const ch=c.offsetHeight||260;Object.assign(c.style,{left:(vw/2-cw/2)+'px',top:Math.max(12,vh/2-ch/2)+'px'});c.classList.remove('fade');return}
  h.style.opacity='1';const r=el.getBoundingClientRect();const pad=8;const top=Math.max(8,r.top-pad),ht=Math.min(vh-16-Math.max(0,top-8),r.height+pad*2);
  Object.assign(h.style,{top:top+'px',left:Math.max(4,r.left-pad)+'px',width:Math.min(vw-8,r.width+pad*2)+'px',height:ht+'px'});
  const chh=c.offsetHeight||260;let x,y;const roomR=vw-r.right>cw+30,roomL=r.left>cw+30,roomB=vh-r.bottom>chh+24,roomT=r.top>chh+24;
  if(roomR){x=r.right+18;y=r.top}else if(roomL){x=r.left-cw-18;y=r.top}else if(roomB){x=r.left+r.width/2-cw/2;y=r.bottom+16}else if(roomT){x=r.left+r.width/2-cw/2;y=r.top-chh-16}else{x=vw-cw-16;y=vh-chh-16}
  x=clamp(x,12,vw-cw-12);y=clamp(y,12,vh-chh-12);Object.assign(c.style,{left:x+'px',top:y+'px'});c.classList.remove('fade')}
async function ptTry(){if(!PT||PT.busy)return;const st=PT.steps[PT.i];if(!st.act)return;PT.busy=1;['tourBlock','tourHole','tourCard'].forEach(id=>{const e=$('#'+id);if(e)e.style.display='none'});
  try{await st.act[1]()}catch(e){}await new Promise(r=>setTimeout(r,st.act[2]||3000));if(!PT)return;PT.busy=0;closeOverlays&&closeOverlays();
  ['tourBlock','tourHole','tourCard'].forEach(id=>{const e=$('#'+id);if(e)e.style.display=''});ptShow()}
function ptEnd(silent,done){const was=PT;PT=null;document.removeEventListener('keydown',ptKey);['tourHole','tourCard','tourBlock'].forEach(id=>{const e=$('#'+id);if(e)e.remove()});if(silent||!was)return;
  const v=$('#view');if(v)v.scrollTo({top:0,behavior:'smooth'});
  const pubDemo=typeof SESSION!=='undefined'&&SESSION&&SESSION.demo&&!DEMO_MODE;if(was.kind==='demo'&&(DEMO_MODE||pubDemo)){setTimeout(()=>modal('<div class="dw">'+platoFace(84,'big')+'<h2 style="margin-top:12px">'+(done?'That is the whole loop.':'Explore at your own pace.')+'</h2><p class="sub">Set up once, build a campaign, watch who leans in, turn them into pipeline, then go again. Keep exploring the demo, or build your own. Your workspace starts clean.</p><div class="dw-btns"><button class="btn btn-primary btn-lg" onclick="closeOverlays();'+(pubDemo?'leaveDemo()':'endDemo()')+'">Build my own</button><button class="btn btn-line" onclick="closeOverlays()">Keep exploring</button><button class="btn btn-ghost" onclick="closeOverlays();ptStart(\'demo\')">Watch it again</button></div></div>'),250)}
  else{S.setup.toured=true;save();if(done){toast('That is the tour. Ask Plato if you get stuck.');if(!coachDone()&&!(S.coach&&S.coach.on))setTimeout(()=>coachOffer(),900)}}}
/* every way in now uses it */
startTour=function(k){if(k&&k!=='demo'&&TOURS[k]&&k!=='main')return _startTourOld18(k);const demo=k==='demo'||(!k&&(DEMO_MODE||(typeof SESSION!=='undefined'&&SESSION&&SESSION.demo)));if(PT&&PT.kind==='demo'&&demo)return;ptStart(demo?'demo':'main')};
const _startTourOld18=(function(){const f=TOURS;return function(k){TOUR=f[k];tourI=0;tourDir=1;['tourHole','tourCard','tourBlock'].forEach(id=>{const e=$('#'+id);if(e)e.remove()});const b=document.createElement('div');b.id='tourBlock';b.className='tour-block';const h=document.createElement('div');h.id='tourHole';h.className='tour-hole';const c=document.createElement('div');c.id='tourCard';c.className='tour-card';document.body.append(b,h,c);setTimeout(tourShow,380)}})();
/* the demo is the tour: no half-finished guided build running alongside it */
const _enterDemo18=enterDemo;enterDemo=function(){_enterDemo18();if(S&&S.coach){S.coach.on=0}const e=$('#coach');if(e)e.remove()};
const _coachRender18=coachRender;coachRender=function(){if(DEMO_MODE){const e=$('#coach');if(e)e.remove();return}return _coachRender18.apply(this,arguments)};

/* ── the guided build for real workspaces, in the new order, with hints that exist ── */
COACH.splice(0,COACH.length,
  {k:'home',t:'Set up your agency profile',say:'Share your website or credentials and I fill it in for you to check. Every brand, gift and message comes from here.',go:()=>go('agency','read'),hint:'.ag18-read',done:()=>profReady()},
  {k:'home',t:'Say who you want to win',say:'What you do best, your sectors, the size of client and the problems you solve. Set once, used by every campaign.',go:()=>go('agency','want'),done:()=>profDone()},
  {k:'home',t:'Start your first campaign',say:'Name it and pick the one problem it solves.',go:()=>newCampaignFlow(),done:()=>S.campaigns.some(c=>!isBlankCamp(c))},
  {k:'prospects',t:'Pick your brands',say:'Press Find prospects. Add at least three brands, or add the top five in one go.',go:()=>go('prospects','brands'),hint:'.pk-bar,.pk-hero',done:()=>campTargets(curCamp()).length>=3},
  {k:'prospects',t:'Find the decision makers',say:'A named person at each brand. Messages can not go out without one.',go:()=>go('prospects','people'),hint:'.pk-dm',done:()=>{const t=campTargets(curCamp());return t.length&&t.filter(a=>a.people.length).length>=Math.min(3,t.length)}},
  {k:'give',t:'Create value',say:'Tell Gus what you have, then build the assets in one click. Make each one yours and mark it ready.',go:()=>go('give'),hint:'.cv-feed',done:()=>bankReady(curCamp())},
  {k:'reach',t:'Plan the journey',say:'Ask Priya to plan it and set your launch date. She puts an asset on every touchpoint.',go:()=>go('reach'),hint:'.pl18',done:()=>{const c=curCamp();return (c.reach.steps||[]).length>0&&!!c.start18}},
  {k:'launch',t:'Launch it',say:'Press launch. Then each day’s messages are lined up for you to check and send. Nothing goes out without you.',go:()=>go('launch'),hint:'.ln18-go',done:()=>campLive(curCamp())});
coachHere=function(st){const v={home:/agency|who you want/i.test(st.t)?'agency':'home',prospects:'prospects',give:'give',reach:'reach',launch:'launch'}[st.k];if(/Start your first/.test(st.t))return false;return VIEW===v};
/* coaching never jumps silently: it moves one step at a time and says what was done */
coachTick=function(quiet){const C=S.coach;if(!C||!C.on)return;let moved=0;while(C.i<COACH.length&&COACH[C.i].done()){C.i++;moved++}
  if(C.i>=COACH.length){C.on=0;C.fin=today();save();const e=$('#coach');if(e)e.remove();confetti&&confetti(220);modal('<div class="dw">'+agentFace('launch',72,{badge:false,cls:'big'})+'<h2 style="margin-top:12px">Your first campaign is live.</h2><p class="sub">Launch shows what is due each day. Signals shows who is leaning in, and Pipeline turns them into deals.</p><div class="dw-btns"><button class="btn btn-primary" onclick="closeOverlays();go(\'launch\')">See today’s messages</button></div></div>');return}
  if(moved){save();if(!quiet)toast(moved>1?moved+' steps already done. Next: '+COACH[C.i].t.toLowerCase():'Done. Next: '+COACH[C.i].t.toLowerCase())}coachRender()};

/* ── the first-time walkthrough, as the same five stages ── */
WALK.splice(0,WALK.length,
 {k:'Welcome',t:n=>'Hello'+(n?' '+n:'')+'. Here’s how new business becomes <span class="serif">predictable.</span>',b:'Five stages, the same loop every quarter. Set your agency up once, build a campaign around a problem you solve, watch who leans in, turn them into pipeline, then go again. Free to build. You only pay to launch.',v:'crew'},
 {k:'1 · Set up',t:()=>'Plato reads <span class="serif">your agency.</span>',b:'Share your website or credentials. Plato fills in your profile for you to check: what you do best, your proof, who you want to win. Everything else draws on it.',v:'loop'},
 {k:'2 · Build',t:()=>'Find the brands <span class="serif">worth your time.</span>',b:'Nora scores brands on whether they need what you do, their size and your sectors, with the news that makes now the right time. Then she finds the person who decides.',v:'brands'},
 {k:'2 · Build',t:()=>'Give before <span class="serif">you ask.</span>',b:'Tell Gus what you have. One click and he builds every asset the campaign needs, each tied to a prospect problem and how you fix it.',v:'give'},
 {k:'2 · Build',t:()=>'A journey, <span class="serif">not a blast.</span>',b:'Priya paces touchpoints across LinkedIn, email, events and post over twelve weeks, with the right asset on each one. Otis lines up each day’s messages for you to send.',v:'journey'},
 {k:'3 · Intent',t:()=>'See who is <span class="serif">leaning in.</span>',b:'Every accept, open, click and reply is scored. The warmest organisations move to the centre, with the people engaging and what to say next.',v:'signals'},
 {k:'4 · Pipeline',t:()=>'Conversations into <span class="serif">pipeline.</span>',b:'When a conversation turns real it becomes a deal, tracked against your target. Then a report in two clicks, and you go again.',v:'pipe'});
const _walkVis18=walkVis;walkVis=function(v){if(v!=='loop')return _walkVis18(v);const T=[['link','Reading your website'],['file','Your credentials'],['star','What you do best'],['trophy','Your proof'],['target','Who you want']];
  return '<div class="wv-ag"><div class="wv-em"><b>YOU</b>'+T.map((t,i)=>{const a=-Math.PI/2+i/T.length*Math.PI*2;return '<i style="--i:'+i+';left:'+(50+Math.cos(a)*46).toFixed(1)+'%;top:'+(50+Math.sin(a)*46).toFixed(1)+'%">'+ico(t[0])+'</i>'}).join('')+'</div><ul>'+T.map((t,i)=>'<li style="--i:'+i+'">'+ico('check')+t[1]+'</li>').join('')+'</ul></div>'};
/* the public demo shows a fully set up agency, so every stage of the loop can be seen working */
startDemo=function(){SESSION={email:'demo@scopeandlens.demo',name:'Sam',role:'member',token:null,preview:true,demo:true};try{localStorage.setItem('sl-session',JSON.stringify(SESSION))}catch(e){}
  setUserKeys(SESSION.email);S=demoSuper();S.setup.demo=true;S.walked=true;S.welcomed=1;S.coach={fin:1};save();const el=$('#login');if(el){el.classList.add('out');setTimeout(()=>el.remove(),500)}launch();setTimeout(()=>startTour('demo'),1200)};

/* ═══ the first-login walkthrough, rebuilt around the whole loop ═══ */
ONB_CH.splice(0,ONB_CH.length,
 {k:'hello',t:'Welcome to <span class="serif">Plato.</span>'},
 {k:'old',t:'Most new business is <span class="serif">noise.</span>'},
 {k:'loop',t:'One loop, every <span class="serif">quarter.</span>'},
 {k:'setup',t:'1. Set up your agency, <span class="serif">once.</span>'},
 {k:'build',t:'2. Build a campaign in <span class="serif">four steps.</span>'},
 {k:'intent',t:'3. Watch who <span class="serif">leans in.</span>'},
 {k:'pipe',t:'4. Turn them into <span class="serif">pipeline.</span>'},
 {k:'demo',t:'See it done <span class="serif">properly.</span>'});
const ONB_STG=[['setup','user','Set up','Your agency profile, read for you'],['build','layers','Build','Brands, value, journey, launch'],['intent','pulse','Intent','Who is leaning in'],['pipe','pound','Pipeline','Conversations into deals'],['repeat','loop','Repeat','Report, learn, go again']];
IC.loop=IC.loop||'<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>';
function onbStages(cur){return '<div class="ob18-st">'+ONB_STG.map((s,i)=>'<div class="'+(s[0]===cur?'on':ONB_STG.findIndex(x=>x[0]===cur)>i?'dn':'')+'" style="--i:'+i+'"><span>'+ico(s[1])+'</span><small>'+(i+1)+'</small><b>'+s[2]+'</b><em>'+s[3]+'</em></div>').join('<i>'+ico('arrow')+'</i>')+'</div>'}
function onbSide(say,li,get){return '<div class="os-r"><div class="os-k">What happens here</div><ol class="os-li">'+li.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ol><div class="os-get">'+ico('check')+'<span><b>What you get</b>'+esc(get)+'</span></div></div>'}
onbDraw=function(){const el=$('#onb');if(!el)return;const C=ONB_CH[ONB];const n=(S.setup.you||(SESSION&&SESSION.name)||'').split(' ')[0];let body='';
  if(C.k==='hello')body='<p class="onb-say">'+(n?'Welcome, '+esc(n)+'. ':'Welcome. ')+'Plato helps agencies build a pipeline that keeps refilling, without cold pitching: find the right brands, give them something genuinely useful first, and keep showing up until they are ready. Six short screens show you how, then you see it running.</p>'+onbStages('')+
    (ONB_REPLAY?'':'<div class="grid2" style="margin-top:18px"><div class="field"><label for="obY">Your first name</label><input class="inp" id="obY" value="'+esc(S.setup.you||(SESSION&&SESSION.name)||'')+'" autocomplete="given-name"></div><div class="field"><label for="obA">Your agency</label><input class="inp" id="obA" value="'+esc(S.setup.agency==='Your agency'?'':S.setup.agency||SESSION&&SESSION.orgName||'')+'" placeholder="e.g. Brightside Studio" autocomplete="organization"></div></div>');
  if(C.k==='old')body='<div class="onb-vs"><div class="vs-old"><small>The old way</small><div class="vs-msg">Hi, we are an award-winning agency. Have you got fifteen minutes next week for a quick chat about how we can help?</div><ul><li>A cold list, a template and a blast</li><li>All about the agency, nothing for them</li><li>One shot, then silence</li></ul></div>'+
    '<div class="vs-new"><small>The permissionless way</small><div class="vs-msg">I put your last five ads next to your rivals’ with the logos covered, and it was harder to tell them apart than I expected. I wrote up what stood out, in case it is useful for your next brief.</div><ul><li>A short list with a reason to talk now</li><li>Something useful, given before you ask</li><li>A steady rhythm over weeks</li></ul></div></div>'+
    '<p class="onb-say">Most brands are not looking for an agency at any one time, and most of those that are already have one in mind. Being remembered before they need anyone is the whole game.</p>';
  if(C.k==='loop')body='<p class="onb-say">Everything in Plato is one loop. Set your agency up once. Then each quarter, build a campaign around one problem you solve, watch who leans in, turn the warm ones into pipeline, and learn from it for the next one.</p>'+onbStages('loop')+
    '<div class="ob18-ret">'+ico('loop')+'<span>Every round starts warmer than the last: the brands who engaged, the assets that worked and the stories that landed carry straight into the next campaign.</span></div>';
  if(C.k==='setup')body='<div class="onb-step"><div class="os-bot">'+walkVis('loop')+'</div>'+onbSide('',['Share your website, or drop in your credentials, case studies and decks.','Plato reads them and fills in your profile: what you do best, why you, your proof, your clients and your voice.','Say who you want to win: sectors, client size, the people you sell to and the problems you solve.','Add the sender’s LinkedIn and email, ready for Amplify.'],'A profile that feeds every brand score, every gift and every message, so they all sound like you.')+'</div>'+onbStages('setup');
  if(C.k==='build')body='<div class="ob18-crew">'+OUT_K.map((k,i)=>{const A=AGENTS[k];const d={prospects:['Pick your brands','Scores every brand on whether they need what you do, then finds the person who decides.'],give:['Create value','Tell Gus what you have. One click builds every asset, each tied to a problem you fix.'],reach:['Plan the journey','Twelve weeks across LinkedIn, email, events and post, with an asset on every touch.'],launch:['Launch','Each day’s messages, written in your voice. You check them and send them.']}[k];
      return '<div class="ogd" style="--d:'+(i*.1)+'s">'+godBust(k,96)+'<small>Step '+(i+1)+' · '+esc(A.n)+'</small><b>'+d[0]+'</b><span>'+d[1]+'</span></div>'}).join('<i class="ogd-a">'+ico('arrow')+'</i>')+'</div>'+
    '<p class="onb-small" style="margin-top:12px">You stay in charge at every step. The crew find, suggest, plan and draft. You choose, edit and send.</p>'+onbStages('build');
  if(C.k==='intent')body='<div class="onb-step"><div class="os-bot"><div class="ob18-orb"><i class="r r1"></i><i class="r r2"></i><i class="r r3"></i><b>YOU</b>'+['HV','KO','LT','CI','WT','SC'].map((x,i)=>'<em style="--i:'+i+'">'+x+'</em>').join('')+'</div></div>'+
    onbSide('',['Every accept, open, click, reply, ad view and event is scored.','The warmer an organisation gets, the closer it moves to the centre.','See who is engaging inside each brand, and what they did.','One tap asks Plato what to say next.'],'You always know who to lean into this week, and why.')+'</div>'+onbStages('intent');
  if(C.k==='pipe')body='<div class="onb-ladder">'+[['pulse','Signals','Who is warming up'],['chat','Conversations','Replies and meetings'],['layers','Pipeline','Deals against your target'],['trophy','Won','New clients']].map((x,i)=>'<div style="--d:'+(i*.1)+'s"><span>'+ico(x[0])+'</span><b>'+x[1]+'</b><small>'+x[2]+'</small></div>').join('<i>'+ico('arrow')+'</i>')+'</div>'+
    '<div class="onb-pr onb-res">'+[['bolt','Deals from live conversations','When a LinkedIn or email conversation turns real, it becomes a deal on its own.'],['chart','Performance by campaign','Reach, engagement, conversations and deals for each one.'],['doc','Reports in two clicks','A clean PDF for the leadership meeting, or a summary to paste.']].map(x=>'<div>'+ico(x[0])+'<b>'+x[1]+'</b><span>'+x[2]+'</span></div>').join('')+'</div>'+
    '<div class="onb-proof"><div><b>£2.5m</b><span>added to one agency’s pipeline in nine months</span></div><div><b>£55m+</b><span>new business revenue won for agencies</span></div><div><b>100+</b><span>pitches behind the method</span></div></div>';
  if(C.k==='demo')body='<p class="onb-say">Before you build your own, watch the whole loop running for a made-up agency, Northgate. A guided tour takes you through each stage in about three minutes, and you can try things as you go.</p><ul class="od-u"><li>A profile Plato has read and filled in</li><li>A live campaign: brands, assets, a planned journey and today’s messages</li><li>Who is leaning in, deals from live conversations, and a report</li></ul>'+onbStages('')+'<p class="onb-small" style="margin-top:14px">When you are ready, press Build my own. The demo disappears and none of it touches your workspace.</p>';
  el.innerHTML='<div class="onb-in"><div class="onb-top"><div class="grow"><small>'+esc(PORTAL_NAME)+' · '+(ONB+1)+' of '+ONB_CH.length+'</small><div class="onb-bar"><i style="width:'+((ONB+1)/ONB_CH.length*100)+'%"></i></div></div>'+(ONB_REPLAY||ONB>0?'<button class="btn btn-ghost btn-sm" onclick="onbSkip()">Skip</button>':'')+'</div>'+
    '<h1 class="onb-t">'+C.t+'</h1><div class="onb-b">'+body+'</div>'+
    '<div class="onb-nav">'+(ONB?'<button class="btn btn-ghost" onclick="ONB--;onbDraw()">Back</button>':'<span></span>')+
      (C.k==='demo'?'<div class="row wrap" style="gap:8px">'+(ONB_REPLAY?'':'<button class="btn btn-line" onclick="onbFinish(false)">Skip the demo, set up my agency</button>')+'<button class="btn btn-primary btn-lg" onclick="onbFinish(true)">'+ico('play')+'Show me the demo</button></div>':'<button class="btn btn-primary btn-lg" onclick="onbNext()">'+(ONB?'Next':'Show me how it works')+ico('arrow','a')+'</button>')+'</div></div>';
  const f=$('#obY');if(f&&!f.value)setTimeout(()=>f.focus(),300)};
