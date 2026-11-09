/* ═══════════ FIRST TIME: a proper welcome, a full tour, and Plato building the first campaign with you ═══════════ */
TOUR_MAIN.length=0;TOUR_MAIN.push(
  {sel:'.sd-nav',alt:'.sd-ham',view:'home',t:'Everything lives on the left',b:'Home, your campaigns, the four steps that build a campaign, your results, your team and the insights we share. On a phone, it is behind the menu button.'},
  {sel:'[data-tour=newcamp]',alt:'.sd-ham',view:'home',t:'Start a campaign from anywhere',b:'Every campaign starts with a problem you solve. Pick it, name it, and the crew gets to work.'},
  {sel:'.sd-grp',alt:'.sd-ham',view:'home',t:'The crew building your campaign',b:'Radar finds who to target, Spark makes what to share, Ping plans how to reach them and Rocket launches it. Ticks show what is done. Tap the campaign name to switch.'},
  {sel:'[data-tour=camps]',view:'home',t:'Your campaigns at a glance',b:'What is live, what is still being built, and the one button that takes you to the next thing to do.'},
  {sel:'[data-tour=crew]',view:'home',t:'How every campaign gets built',b:'Four specialists and one baton. Tap any of them to jump to their step.'},
  {sel:'#nav-signals',alt:'.sd-ham',view:'home',t:'Results',b:'Signals shows who is leaning in, hottest first, with the reason why. Revenue tracks the deals they turn into, against your target.'},
  {sel:'#nav-team',alt:'.sd-ham',view:'home',t:'Your team',b:'Everyone’s outreach in one picture: who is talking to who, and where each journey is up to.'},
  {sel:'#nav-insights',alt:'.sd-ham',view:'home',t:'Insights from Josh',b:'Pitches, people moves and opportunities we spot. You get an alert the moment something new lands.'},
  {sel:'#nav-agency',alt:'.sd-ham',view:'home',t:'Your agency profile',b:'Your answers, your words and your library of credentials and case studies. Everything the crew writes comes from here.'},
  {sel:'#vmode',view:'home',t:'Dashboard or Plato',b:'Prefer a conversation? Switch to Plato and it takes you through today one yes or no at a time.'},
  {sel:'#dot',t:'Ask Plato anything',b:'What to do next, who to target, or tell it what just happened. Plato is always here.'});
const _tourVis=tourVis;tourVis=function(sel){if(_tourVis(sel))return true;const st=TOUR[tourI];if(st&&st.sel===sel&&st.alt&&_tourVis(st.alt)){st.sel=st.alt;return true}return false};
const _endTour=endTour;endTour=function(done){const main=TOUR===TOUR_MAIN;_endTour(done);if(main&&!coachDone()&&!(S.coach&&S.coach.on))setTimeout(()=>coachOffer(),done?900:300)};
/* the welcome */
function dotWelcome(){const n=(S.setup.you||(SESSION&&SESSION.name)||'').split(' ')[0];S.welcomed=1;save();
  modal('<div class="dw"><div class="dw-face">'+agentFace('home',84,{badge:false,cls:'big'})+'</div><h2>Hello'+(n?' '+esc(n):'')+'. I’m Plato.</h2><p class="sub">I’ll be with you the whole way. I can show you around, and I can build your first campaign with you, step by step, alongside Radar, Spark, Ping and Rocket.</p>'+
    '<div class="dw-crew">'+OUT_K.map(k=>'<span>'+agentFace(k,40,{badge:false})+'<b>'+AGENTS[k].n+'</b><small>'+esc(MODULES.find(m=>m.k===k).l)+'</small></span>').join('')+'</div>'+
    '<div class="dw-btns"><button class="btn btn-primary btn-lg" onclick="closeOverlays();coachStart()">'+ico('sparkle')+'Yes, build my first campaign with me</button><button class="btn btn-line" onclick="closeOverlays();startTour()">Show me around first</button><button class="btn btn-ghost" onclick="closeOverlays()">I’ll explore on my own</button></div></div>')}
function coachOffer(force){if(coachDone()&&!force){coachStart();return}
  modal('<div class="dw">'+agentFace('home',64,{badge:false,cls:'big'})+'<h2 style="margin-top:12px">Shall we build your first campaign together?</h2><p class="sub">Eight steps. I’ll tell you exactly what to do on each one, take you there, and tick it off as you go. You can stop whenever you like.</p><div class="dw-btns"><button class="btn btn-primary btn-lg" onclick="closeOverlays();coachStart()">'+ico('sparkle')+'Yes, let’s go</button><button class="btn btn-ghost" onclick="closeOverlays()">Not now</button></div></div>')}
/* the guided build */
const COACH=[
  {k:'home',t:'Tell me about your agency',say:'Seven quick taps: what you do, who you want to win and the problems you solve. Or let me read your website and suggest it.',go:()=>go('prospects'),done:()=>profDone(),alt:['Read my website instead',()=>go('plan')]},
  {k:'home',t:'Start the campaign',say:'Name it and pick the one problem it solves. Everything Spark makes and Rocket writes is built around that problem.',go:()=>{if(!curCamp().problem)newCampaignFlow();else go('prospects')},done:()=>!!curCamp().problem},
  {k:'prospects',t:'Find your brands',say:'Press Find prospects now and watch me scour the UK. Then add at least three brands you like the look of.',go:()=>go('prospects','brands'),hint:'.fbtn',done:()=>campTargets(curCamp()).length>=3},
  {k:'prospects',t:'Find the people',say:'Add a decision maker at each brand. Ask me to find them, or add someone you already know.',go:()=>go('prospects','people'),done:()=>{const t=campTargets(curCamp());return t.length&&t.filter(a=>a.people.length).length>=Math.min(3,t.length)}},
  {k:'give',t:'Choose what to give',say:'Pick one genuinely useful thing to give. My best pick for your problem is at the top. One great gift beats three good ones.',go:()=>go('give'),hint:'[data-tour=assets]',done:()=>curCamp().assets.length>0},
  {k:'give',t:'Fill your content bank',say:'Ask me to draft the LinkedIn posts and blog outlines, fill in the [brackets] with what you know, and mark each one ready. Add a case study from your library.',go:()=>go('give','bank'),hint:'#bank',done:()=>bankReady(curCamp())},
  {k:'reach',t:'Plan the journey',say:'Choose your channels and how often. My recommended mix is one tap. Then tick off the LinkedIn profile checks so you will not need a note when you connect.',go:()=>go('reach'),hint:'[data-tour=rsettings]',done:()=>{const c=curCamp();return !!c.reachSeen&&(!c.reach.ch.includes('linkedin')||liPct()===100)}},
  {k:'launch',t:'Launch it',say:'Everything is ready. Press launch, then I line up each day’s messages for you to check and send. Nothing goes out without you.',go:()=>go('launch'),hint:'.lbtn',done:()=>campLive(curCamp())}];
function coachDone(){return !!(S.coach&&S.coach.fin)}
function coachStart(){S.coach={on:1,i:0,min:0,fin:S.coach&&S.coach.fin||0};save();coachTick(true);const st=COACH[S.coach.i];if(st&&!st.done())st.go()}
function coachStop(){if(S.coach)S.coach.on=0;save();const e=$('#coach');if(e)e.remove();toast('Plato will be here if you need it. Ask any time.')}
function coachTick(quiet){const C=S.coach;if(!C||!C.on)return;let moved=false;while(C.i<COACH.length&&COACH[C.i].done()){C.i++;moved=true}
  if(C.i>=COACH.length){C.on=0;C.fin=today();save();const e=$('#coach');if(e)e.remove();confetti(220);modal('<div class="dw">'+agentFace('launch',72,{badge:false,cls:'big'})+'<h2 style="margin-top:12px">Your first campaign is live.</h2><p class="sub">From here, Launch shows what is due each day, and Signals tells you who is leaning in. I’ll keep an eye on things.</p><div class="dw-btns"><button class="btn btn-primary" onclick="closeOverlays();go(\'launch\')">See today’s messages</button></div></div>');return}
  if(moved){save();if(!quiet){toast('✅ Step done. Next: '+COACH[C.i].t.toLowerCase());award('compose')}}coachRender()}
function coachRender(){const C=S.coach;if(!C||!C.on)return;let el=$('#coach');if(!el){el=document.createElement('aside');el.id='coach';el.setAttribute('aria-live','polite');document.body.appendChild(el)}const st=COACH[C.i];const A=AGENTS[st.k];const here=coachHere(st);
  el.className='coach'+(C.min?' min':'');
  el.innerHTML=C.min?'<button class="co-pill" onclick="S.coach.min=0;save();coachRender()">'+agentFace(st.k,28,{badge:false})+'<span><b>'+esc(st.t)+'</b><small>Step '+(C.i+1)+' of '+COACH.length+'</small></span></button>':
   '<div class="co-h">'+agentFace(st.k,44,{badge:false,cls:'big'})+'<div class="grow"><small>Step '+(C.i+1)+' of '+COACH.length+' · '+esc(A.n)+'</small><b>'+esc(st.t)+'</b></div><button class="icon-btn" onclick="S.coach.min=1;save();coachRender()" aria-label="Minimise">'+ico('arrow','dn')+'</button><button class="icon-btn" onclick="coachStop()" aria-label="Stop guiding">'+ico('x')+'</button></div>'+
   '<div class="co-prog">'+COACH.map((x,i)=>'<i class="'+(i<C.i?'ok':i===C.i?'on':'')+'"></i>').join('')+'</div><p>'+esc(st.say)+'</p>'+
   '<div class="co-b">'+(here?(st.hint?'<button class="btn btn-primary btn-sm" onclick="coachShow()">'+ico('eye')+'Show me where</button>':'<span class="tiny muted">I’ll tick this off as soon as it’s done.</span>'):'<button class="btn btn-primary btn-sm" onclick="COACH[S.coach.i].go();setTimeout(coachShow,500)">Take me there'+ico('arrow','a')+'</button>')+(st.alt?'<button class="btn btn-ghost btn-sm" onclick="COACH[S.coach.i].alt[1]()">'+esc(st.alt[0])+'</button>':'')+'</div>'}
function coachHere(st){const v={home:'prospects',prospects:'prospects',give:'give',reach:'reach',launch:'launch'}[st.k];if(st.t==='Start the campaign')return false;return VIEW===v}
function coachShow(){const st=COACH[S.coach.i];const e=st.hint&&$(st.hint);if(!e)return;e.scrollIntoView({behavior:'smooth',block:'center'});e.classList.remove('coach-hl');void e.offsetWidth;e.classList.add('coach-hl');setTimeout(()=>e.classList.remove('coach-hl'),3600)}
const _go11=go;go=function(k,arg,quiet){_go11(k,arg,quiet);crumb();setTimeout(()=>coachTick(),60)};
setInterval(()=>{if(S&&S.coach&&S.coach.on)coachTick()},2500);
/* first login: the walk, then Plato says hello */
walkDone=function(){const a=$('#wkA').value.trim();if(!a){$('#wkA').focus();$('#wkA').style.borderColor='var(--bad)';toast('What is your agency called?');return}
  S.setup.agency=a;S.setup.you=$('#wkY').value.trim();S.walked=true;save();endWalk(true);launch();setTimeout(dotWelcome,700)};
const _endWalk=endWalk;endWalk=function(silent){const replay=WK_REPLAY;_endWalk(silent);if(!replay&&!silent&&!S.welcomed)setTimeout(dotWelcome,900)};
const _launch11=launch;launch=function(){_launch11();if(S.coach&&S.coach.on)setTimeout(()=>coachTick(true),400)};
/* the walkthrough tells the same story as the crew */
WALK.splice(0,WALK.length,
 {k:'Welcome',t:n=>'Hello'+(n?' '+n:'')+'. Here’s how new business becomes <span class="serif">predictable.</span>',b:'Every campaign starts with a problem you solve. Then a crew of four builds it with you: who to target, what to share, how to reach them, and launch. Free to build. You only pay to launch.',v:'crew'},
 {k:'Step 1 · Radar',t:()=>'Find the brands <span class="serif">worth your time.</span>',b:'Radar scours the UK for brands that fit you, each with a reason to talk now: agency moves, likely pitches, new leaders, campaigns. Then finds the people who decide.',v:'brands'},
 {k:'Step 2 · Spark',t:()=>'Give before <span class="serif">you ask.</span>',b:'Spark picks something genuinely useful to make for them, and drafts a bank of posts and pieces around it, so there is always something new to share.',v:'give'},
 {k:'Step 3 · Ping',t:()=>'A journey, <span class="serif">not a blast.</span>',b:'Ping paces touchpoints across LinkedIn, email, events and post over weeks, ending in the offer of a free workshop. One email a week, never more.',v:'journey'},
 {k:'Step 4 · Rocket',t:()=>'Launch, then <span class="serif">one day at a time.</span>',b:'Rocket writes every message in your voice and shows you only what is due today. You check it, send it and tick it off. Nothing leaves without you.',v:'launch'},
 {k:'Then · Results',t:()=>'See who is <span class="serif">leaning in.</span>',b:'Signals scores every accept, open, click and reply. Revenue tracks the deals against your target. Team shows everyone’s outreach, and Insights brings you what we spot.',v:'signals'});
const _walkVis=walkVis;walkVis=function(v){if(v==='crew')return '<div class="wv-crew">'+OUT_K.map((k,i)=>'<div style="--i:'+i+'">'+agentFace(k,64,{badge:false,cls:'big'})+'<b>'+AGENTS[k].n+'</b><small>'+esc(MODULES.find(m=>m.k===k).l)+'</small></div>').join('<i></i>')+'</div>';return _walkVis(v)};
/* your logo, and taking it away again */
function removeLogo(){act('Removed your logo',()=>{S.brand.logo=null},{refresh:false,ic:'🖼️'});applyTheme();refresh()}
