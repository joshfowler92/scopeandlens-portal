/* ═══════════ GAME: XP, levels, streaks, weekly missions and badges ═══════════
   Small rewards for the behaviours that build a pipeline. Nothing here changes the data, it just makes progress visible. */
const LEVELS=[[0,'Warming up'],[100,'Door opener'],[250,'Conversation starter'],[500,'Relationship builder'],[850,'Pipeline maker'],[1300,'Rainmaker'],[1900,'Growth engine'],[2700,'Category magnet'],[3700,'New business legend']];
const XP={brand:10,person:15,gift:20,journey:25,launch:100,touch:20,approve:10,reply:40,meeting:75,deal:60,won:250,profile:30,swipe:2,copy:3,news:5,insight:5,compose:2,liready:40,bank:15,plan:30,scan:10};
const XP_L={brand:'Brand added',person:'Decision maker found',gift:'Gift chosen',journey:'Journey planned',launch:'Campaign launched',touch:'Touch sent',approve:'Message approved',reply:'Reply logged',meeting:'Meeting booked',deal:'Deal opened',won:'Deal won',profile:'Profile done',swipe:'Brand reviewed',copy:'Message copied',news:'News checked',insight:'Insight read',compose:'Message styled',liready:'LinkedIn profile ready',bank:'Content drafted',plan:'Plan agreed',scan:'Prospects found'};
const BADGES=[
  {k:'first_brand',e:'🎯',t:'First target',d:'Added your first brand',f:G=>G.c.brand>=1},
  {k:'list10',e:'📋',t:'Long list',d:'Ten brands on your list',f:()=>campTargets(curCamp()).length>=10},
  {k:'first_person',e:'👤',t:'Name to a face',d:'Found your first decision maker',f:G=>G.c.person>=1},
  {k:'gift',e:'🎁',t:'Generous',d:'Chose something to give',f:G=>G.c.gift>=1},
  {k:'launch',e:'🚀',t:'Lift off',d:'Launched a campaign',f:G=>G.c.launch>=1},
  {k:'touch25',e:'📨',t:'Persistent',d:'Twenty-five touches sent',f:G=>G.c.touch+G.c.approve>=25},
  {k:'reply',e:'💬',t:'They wrote back',d:'Logged your first reply',f:G=>G.c.reply>=1},
  {k:'meeting',e:'☕',t:'In the room',d:'Booked a meeting',f:G=>G.c.meeting>=1},
  {k:'won',e:'🏆',t:'Winner',d:'Won a piece of work',f:G=>G.c.won>=1},
  {k:'streak5',e:'🔥',t:'On a roll',d:'A five day streak',f:()=>streak()>=5},
  {k:'swipe50',e:'👆',t:'Speed reader',d:'Reviewed fifty brands',f:G=>G.c.swipe>=50},
  {k:'news10',e:'📰',t:'News hound',d:'Checked ten news stories',f:G=>G.c.news>=10}
];
let PTR={x:innerWidth/2,y:innerHeight/2};document.addEventListener('pointerdown',e=>{PTR={x:e.clientX,y:e.clientY}},true);
function lvl(xp){let i=0;while(i<LEVELS.length-1&&xp>=LEVELS[i+1][0])i++;const cur=LEVELS[i][0],nx=LEVELS[i+1]?LEVELS[i+1][0]:cur+1500;return{n:i+1,name:LEVELS[i][1],next:LEVELS[i+1]?LEVELS[i+1][1]:'Beyond legend',cur,nx,pct:Math.min(1,(xp-cur)/(nx-cur)),to:nx-xp}}
function weekStart(d){d=d?new Date(d):new Date();const k=(d.getDay()+6)%7;d.setDate(d.getDate()-k);return d.toISOString().slice(0,10)}
function gCounts(since){const c={};Object.keys(XP).forEach(k=>c[k]=0);(S.game.ev||[]).forEach(e=>{if(!since||e.d>=since)c[e.k]=(c[e.k]||0)+(e.q||1)});return c}
function streak(){const D=new Set(S.game.days||[]);let n=0;const d=new Date();for(let i=0;i<60;i++){const k=d.toISOString().slice(0,10);const wd=d.getDay();if(D.has(k))n++;else if(i>0&&wd!==0&&wd!==6)break;d.setDate(d.getDate()-1)}return n}
/* the missions for this week, picked for where you are */
function missions(){const c=curCamp();const tg=campTargets(c);const ppl=sum(tg,a=>a.people.length);const live=c&&(c.status==='live'||Object.keys(c.sent||{}).length||S.launch.done.length);const W=gCounts(weekStart());
  const M={
    brands:{id:'brands',e:'🎯',t:'Add 5 brands to your list',n:W.brand,of:5,x:50,go:"go('prospects','brands')"},
    swipe:{id:'swipe',e:'👆',t:'Swipe through 20 brands',n:W.swipe,of:20,x:30,go:"bMode='swipe';go('prospects','brands')"},
    people:{id:'people',e:'👤',t:'Find 3 decision makers',n:W.person,of:3,x:50,go:"go('prospects','people')"},
    gift:{id:'gift',e:'🎁',t:'Choose what to give',n:W.gift?1:(c&&c.assets.length?1:0),of:1,x:30,go:"go('give')"},
    launch:{id:'launch',e:'🚀',t:'Launch your campaign',n:W.launch,of:1,x:100,go:"go('launch')"},
    touch:{id:'touch',e:'📨',t:'Send 10 touches',n:W.touch+W.approve,of:10,x:100,go:"go('launch')"},
    reply:{id:'reply',e:'💬',t:'Get a reply',n:W.reply,of:1,x:80,go:"go('signals')"},
    meet:{id:'meet',e:'☕',t:'Book a meeting',n:W.meeting,of:1,x:120,go:"go('pipeline')"},
    news:{id:'news',e:'📰',t:'Read 5 news stories',n:W.news,of:5,x:25,go:"go('prospects','news')"}};
  const order=!tg.length?['brands','swipe','people','news']:!ppl?['people','brands','gift','news']:!live?['gift','launch','people','touch']:['touch','reply','meet','brands'];
  return order.map(k=>M[k])}
function award(k,label,q){if(!S||!S.game||!XP[k])return;const G=S.game;q=q||1;
  if(k==='copy'&&gCounts(today()).copy>=10)return;if(k==='compose'&&gCounts(today()).compose>=15)return;
  const pts=XP[k]*q;const before=lvl(G.xp).n;const bBefore=new Set(G.badges);
  G.xp+=pts;G.ev.unshift({k,d:today(),q,x:pts});if(G.ev.length>600)G.ev.length=600;if(!G.days.includes(today()))G.days.unshift(today());G.days=G.days.slice(0,90);
  const wk=weekStart();missions().forEach(m=>{const id=wk+':'+m.id;if(m.n>=m.of&&!G.mDone[id]){G.mDone[id]=1;G.xp+=m.x;setTimeout(()=>toast('✓ Goal done for the week: '+esc(m.t)),600)}});
  const C=gCounts();BADGES.forEach(b=>{if(!bBefore.has(b.k)&&!G.badges.includes(b.k)&&b.f({c:C})){G.badges.push(b.k);setTimeout(()=>celebrate(b.e+' Achievement unlocked',b.t+': '+b.d),900)}});
  const after=lvl(G.xp).n;if(after>before)setTimeout(()=>levelUp(after),1300);
  save();refreshXP(true)}
function refreshXP(bump){const el=$('#xpChip');if(el){el.outerHTML=xpChip();if(bump){const n=$('#xpChip');if(n){n.classList.add('bump');setTimeout(()=>n.classList.remove('bump'),900)}}}}
function xpChip(){if(!S||!S.game)return '';const L=lvl(S.game.xp);return '<button class="xpchip tip-b" id="xpChip" onclick="openGame()" aria-label="Your progress" data-tip="Level '+L.n+': '+esc(L.name)+'"><span class="lv">Lv '+L.n+'</span><span class="xpb"><i style="width:'+Math.round(L.pct*100)+'%"></i></span></button>'}
/* little bursts of joy */
let FLOATS=0;function floatXP(t,sub){const f=document.createElement('div');f.className='xpfloat';f.innerHTML='<b>'+esc(t)+'</b>'+(sub?'<small>'+esc(sub)+'</small>':'');f.style.left=Math.min(innerWidth-180,Math.max(10,PTR.x-40))+'px';f.style.top=Math.max(70,PTR.y-30-FLOATS*46)+'px';FLOATS++;document.body.appendChild(f);setTimeout(()=>{f.remove();FLOATS=Math.max(0,FLOATS-1)},1500)}
function confetti(n){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const cv=document.createElement('canvas');cv.className='confcv';cv.width=innerWidth;cv.height=innerHeight;document.body.appendChild(cv);const x=cv.getContext('2d');
  const cs=getComputedStyle(document.documentElement);const col=[cs.getPropertyValue('--brand').trim()||'#2c56ed',cs.getPropertyValue('--accent').trim()||'#5eead4','#ffb547','#ff7a45','#f0ede8'];
  const P=Array.from({length:n||140},()=>({x:innerWidth/2+(Math.random()-.5)*200,y:innerHeight*.35,vx:(Math.random()-.5)*16,vy:-Math.random()*16-4,s:Math.random()*8+4,r:Math.random()*6,vr:(Math.random()-.5)*.3,c:col[Math.floor(Math.random()*col.length)],o:Math.random()<.4}));
  let t=0;(function f(){t++;x.clearRect(0,0,cv.width,cv.height);P.forEach(p=>{p.vy+=.45;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;if(p.o){x.beginPath();x.arc(0,0,p.s/2,0,7);x.fill()}else x.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);x.restore()});if(t<110)requestAnimationFrame(f);else cv.remove()})()}
/* celebrations queue up so they never pile on top of each other */
const CELE=[];let CELE_ON=false;
function celebrate(t,sub,big){CELE.push({t,sub,big});if(!CELE_ON)nextCele()}
function nextCele(){const c=CELE.shift();if(!c){CELE_ON=false;return}CELE_ON=true;if(c.big)confetti(60);const el=document.createElement('div');el.className='cele'+(c.big?' big':'');
  el.innerHTML=(c.big?art('badge'):'')+'<div><b>'+(c.big?c.t:esc(c.t))+'</b>'+(c.sub?'<small>'+esc(c.sub)+'</small>':'')+'</div>';el.onclick=()=>{el.remove();openGame()};document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add('on'));
  setTimeout(()=>{el.classList.remove('on');setTimeout(()=>{el.remove();nextCele()},380)},c.big?3800:2400)}
function levelUp(n){const L=LEVELS[n-1];const x=lvl(S.game.xp);celebrate('Level '+n+'! You are now a <span class="serif">'+esc(L[1].toLowerCase())+'.</span>',x.to+' XP to '+x.next.toLowerCase()+'. Tap to see your progress.',true)}
/* the progress panel */
function missionsHTML(compact){const M=missions();const wk=weekStart();const ends=new Date(wk);ends.setDate(ends.getDate()+7);const left=Math.max(1,Math.ceil((ends-new Date())/864e5));
  return '<div class="mis'+(compact?' c':'')+'">'+M.map(m=>{const d=m.n>=m.of;return '<button class="ms'+(d?' done':'')+'" onclick="'+m.go+'"><span class="ms-e">'+(d?'✅':m.e)+'</span><span class="ms-b"><b>'+esc(m.t)+'</b><span class="ms-bar"><i style="width:'+Math.min(100,Math.round(m.n/m.of*100))+'%"></i></span><small>'+Math.min(m.n,m.of)+' of '+m.of+'</small></span>'+(compact?'':'<span class="ms-x">+'+m.x+' XP</span>')+'</button>'}).join('')+'</div><p class="tiny muted ms-f">New goals every Monday · '+left+' day'+(left===1?'':'s')+' left this week</p>'}
function badgesHTML(){const G=S.game;return '<div class="bdgs">'+BADGES.map(b=>{const on=G.badges.includes(b.k);return '<div class="bdg'+(on?' on':'')+'" title="'+esc(b.d)+'"><span>'+(on?b.e:'🔒')+'</span><b>'+esc(b.t)+'</b><small>'+esc(b.d)+'</small></div>'}).join('')+'</div>'}
function openGame(){const G=S.game;const L=lvl(G.xp);const st=streak();const recent=G.ev.slice(0,8);
  drawer('<div class="drawer-h"><div class="row between top"><div><div class="ft-k">Your progress</div><h2 class="h-m" style="margin-top:6px">Level '+L.n+': '+esc(L.name)+'</h2></div><button class="icon-btn" onclick="closeOverlays()" aria-label="Close">'+ico('x')+'</button></div></div>'+
  '<div class="drawer-b"><div class="gcard">'+BLOBS+'<div class="g-ring">'+lvRing(L.pct,L.n)+'</div><div><b>'+G.xp.toLocaleString('en-GB')+' XP</b><small>'+L.to+' to '+esc(L.next.toLowerCase())+'</small><div class="g-st">'+(st?'🔥 '+st+' day streak':'Start a streak today')+'</div><small class="tiny">Weekends never break a streak.</small></div></div>'+
  '<div class="lab" style="margin-top:22px">This week’s goals</div>'+missionsHTML()+
  '<div class="lab" style="margin-top:22px">Achievements · '+G.badges.length+' of '+BADGES.length+'</div>'+badgesHTML()+
  '<div class="lab" style="margin-top:22px">How you earn XP</div><div class="xpways">'+[['brand','🎯'],['person','👤'],['gift','🎁'],['launch','🚀'],['touch','📨'],['reply','💬'],['meeting','☕'],['won','🏆']].map(x=>'<span>'+x[1]+' '+XP_L[x[0]]+' <b>+'+XP[x[0]]+'</b></span>').join('')+'</div>'+
  (recent.length?'<div class="lab" style="margin-top:22px">Lately</div><div class="list">'+recent.map(e=>'<div class="li"><div class="li-main"><div class="li-t">'+esc(XP_L[e.k]||e.k)+(e.q>1?' ×'+e.q:'')+'</div><div class="li-s">'+rel(e.d)+'</div></div><span class="pill good">+'+e.x+'</span></div>').join('')+'</div>':'')+'</div>')}
function lvRing(p,n){const r=40,c=2*Math.PI*r;return '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="'+r+'" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="9"/><circle cx="50" cy="50" r="'+r+'" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-dasharray="'+c+'" stroke-dashoffset="'+c*(1-p)+'" transform="rotate(-90 50 50)"/><text x="50" y="47" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">Level</text><text x="50" y="66" text-anchor="middle" font-size="24" fill="currentColor" font-weight="800">'+n+'</text></svg>'}
