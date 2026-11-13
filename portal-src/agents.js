/* ═══════════ THE CAST: one agent for every part of the growth process ═══════════
   Each section has its own character. They each own one job, and hand the work on to the next. */
const AGENTS={
  home:{n:'Dot',role:'Your growth lead',col:'#2c56ed',eyes:'dot',ic:'home',me:'I read your world, plan the week and keep the whole team pointing the same way.'},
  agency:{n:'Echo',role:'Knows your agency',col:'#ae3ec9',eyes:'soft',ic:'star',me:'I learn who you are and how you sound, so every message is unmistakably you.'},
  prospects:{n:'Nora',role:'Finds who to target',col:'#0b9f8a',eyes:'scan',ic:'target',me:'I scour the UK for brands with a real reason to hear from you, right now.'},
  give:{n:'Maker',role:'Makes what to share',col:'#f76707',eyes:'happy',ic:'gift',me:'I dream up something genuinely useful to give before you ask for anything.'},
  reach:{n:'Guide',role:'Plans how to reach them',col:'#2f9e44',eyes:'wink',ic:'send',me:'I map the journey touch by touch, the way you would get to know someone in person.'},
  launch:{n:'Otis',role:'Launches it with you',col:'#14102e',eyes:'visor',ic:'rocket',me:'I line up every message in your voice. Nothing leaves without your say-so.'},
  signals:{n:'Nora',role:'Spots who is leaning in',col:'#e03131',eyes:'wide',ic:'pulse',me:'I watch every accept, open, click and reply, and tell you who is warming up.'},
  pipeline:{n:'Tally',role:'Counts the revenue',col:'#c98a12',eyes:'calm',ic:'pound',me:'I turn conversations into numbers you can plan a year around.'},
  team:{n:'Huddle',role:'Keeps the team in step',col:'#7048e8',eyes:'round',ic:'people',me:'I keep everyone on the same page: who is talking to who, and where it is up to.'},
  insights:{n:'Scoop',role:'Brings you the news',col:'#212529',eyes:'round',ic:'bulb',me:'I bring you what Josh has spotted, before everyone else hears about it.'}
};
function eyesSVG(t){const W='#fff';switch(t){
  case 'scan':return '<circle cx="15" cy="19" r="3.2" fill="'+W+'"/><circle cx="26" cy="19" r="5.2" fill="none" stroke="'+W+'" stroke-width="2"/><circle cx="27" cy="19" r="2.6" fill="'+W+'"/>';
  case 'happy':return '<path d="M11 21q4-6 8 0M22 21q4-6 8 0" fill="none" stroke="'+W+'" stroke-width="2.6" stroke-linecap="round"/>';
  case 'wink':return '<rect x="13" y="15" width="4" height="8" rx="2" fill="'+W+'"/><path d="M23 20h6" stroke="'+W+'" stroke-width="2.6" stroke-linecap="round"/>';
  case 'visor':return '<rect x="10" y="16" width="21" height="7" rx="3.5" fill="#5eead4"/><rect x="13" y="18" width="4" height="3" rx="1.5" fill="#14102e"/><rect x="24" y="18" width="4" height="3" rx="1.5" fill="#14102e"/>';
  case 'wide':return '<circle cx="15" cy="19" r="4.2" fill="'+W+'"/><circle cx="26" cy="19" r="4.2" fill="'+W+'"/><circle cx="16" cy="19" r="1.8" fill="#e03131"/><circle cx="27" cy="19" r="1.8" fill="#e03131"/>';
  case 'calm':return '<path d="M11 20h7M23 20h7" stroke="'+W+'" stroke-width="2.6" stroke-linecap="round"/><path d="M12 23q2.5 2 5 0M24 23q2.5 2 5 0" fill="none" stroke="'+W+'" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>';
  case 'soft':return '<ellipse cx="15" cy="19" rx="3" ry="4" fill="'+W+'"/><ellipse cx="26" cy="19" rx="3" ry="4" fill="'+W+'"/><circle cx="16" cy="17.5" r="1" fill="#ae3ec9"/><circle cx="27" cy="17.5" r="1" fill="#ae3ec9"/>';
  case 'round':return '<circle cx="15" cy="19" r="3.3" fill="'+W+'"/><circle cx="26" cy="19" r="3.3" fill="'+W+'"/>';
  default:return '<rect x="13" y="14" width="4.4" height="10" rx="2.2" fill="'+W+'" class="eye"/><rect x="23.6" y="14" width="4.4" height="10" rx="2.2" fill="'+W+'" class="eye"/>'}}
function agentFace(k,sz,o){const A=AGENTS[k]||AGENTS.home;o=o||{};sz=sz||36;
  return '<span class="ag'+(o.cls?' '+o.cls:'')+'" style="--ac:'+A.col+';width:'+sz+'px;height:'+sz+'px" aria-hidden="true"><svg viewBox="0 0 41 41"><circle cx="20.5" cy="20.5" r="20.5" fill="'+A.col+'"/><g class="eyes">'+eyesSVG(A.eyes)+'</g></svg>'+(o.badge===false?'':'<i class="ag-b">'+(o.num?o.num:ico(A.ic))+'</i>')+'</span>'}
const agName=k=>(AGENTS[k]||AGENTS.home).n;
/* what each agent says when you arrive */
function agentSays(k){try{const c=curCamp();const tg=campTargets(c);const st=sysStats();const P=PROB();
  if(k==='agency'){const p=agPct();return p>=100?'I know you well now. Everyone else uses this in every suggestion they make.':p+'% done. The more I know about you, the smarter the rest of the team gets.'}
  if(k==='prospects'){const hi=(typeof INTEL!=='undefined'&&INTEL.rows)?INTEL.rows.filter(r=>r.prob==='high').length:0;return !profDone()?'Tell me who you want to work with, and the problems you solve. Then I will go and find them.':tg.length?tg.length+' brands on your list. Want more? Ask me to search again'+(hi?', I have '+hi+' with a high chance of a pitch on my radar':'')+'.':'Press the big button and I will scour the UK for brands with a reason to talk.'}
  if(k==='give'){const t=toolById(c.assets[0])||toolsFor()[0];return !c.problem?'First, tell me which problem this campaign solves. Everything I make is built around it.':c.assets.length?(bankReady(c)?'Gift chosen and the content bank is full. Over to Guide.':'Lovely choice. Now let me help you fill the content bank around '+P.short+'.'):'My pick for you: '+t.n+'. It is built around '+P.short+'. One great gift beats three good ones.'}
  if(k==='reach'){const s=(c.reach.steps||[]).length;return s?s+' touches over '+c.reach.weeks+' weeks, paced like a real relationship. Get your LinkedIn profile ready first, then you will not need a note when you connect.':'Tell me which channels you like, or take my recommended mix.'}
  if(k==='launch')return 'I draft every message in your voice. You glance, tweak and send. Nothing leaves without your say-so.';
  if(k==='signals'){const w=st.signals.big||0;return w?w+' brand'+(w===1?' is':'s are')+' warming up. I have put the hottest at the top, with why.':'Quiet so far. The moment someone accepts, opens or replies, I will tell you.'}
  if(k==='pipeline'){const p=pipe();return money(p.val,true)+' in play and '+money(p.wonVal,true)+' won. '+(p.target?Math.round(p.wonVal/p.target*100)+'% of the way to your target.':'Set a target and I will track it.')}
  if(k==='team'){const n=(typeof teamMembers==='function'?teamMembers().length:1)||1;return n>1?n+' of you are on it. Here is who is talking to who, and where everyone has got to.':'It is just you for now. Add a teammate and I will keep you all in step.'}
  if(k==='insights'){const u=unreadInsights();return u?u+' new from Josh since you last looked.':'You are all caught up. I will shout when Josh spots something.'}
  return AGENTS[k]?AGENTS[k].me:''}catch(e){return AGENTS[k]?AGENTS[k].me:''}}
/* the nav: the agents lead, the words appear when you need them */
function navHTML(){const st=sysStats();const grp=['prospects','give','reach','launch'].includes(VIEW)?'out':['signals','pipeline','team','insights'].includes(VIEW)?'res':'';
  const b=k=>{const m=MODULES.find(x=>x.k===k);const A=AGENTS[k];const x=st[k]&&st[k].badge;const n=m.n&&k!=='launch'?m.n:k==='launch'?'🚀':'';
    return '<button class="tn-a'+(VIEW===k?' on':'')+(st[k]&&st[k].done?' dn':'')+'" data-nav="'+k+'" id="nav-'+k+'" aria-label="'+esc(m.l+', with '+A.n)+'" data-tip="'+esc(A.n+' · '+A.role)+'">'+agentFace(k,30,{num:n})+'<span class="tn-t"><b>'+esc(m.ls||m.l)+'</b></span>'+(x?'<i class="tn-c">'+x+'</i>':'')+'</button>'};
  return b('home')+b('agency')+'<div class="tn-g'+(grp==='out'?' act':'')+'"><span class="tn-gl">Outreach · free to build</span>'+['prospects','give','reach','launch'].map(b).join('')+'</div>'+
    '<div class="tn-g'+(grp==='res'?' act':'')+'"><span class="tn-gl">Results</span>'+['signals','pipeline','team','insights'].map(b).join('')+'</div>'}
/* the section header: the agent introduces the page */
const _secHead=secHead;
secHead=function(k,title,actions,tabs){const A=AGENTS[k];if(!A)return _secHead(k,title,actions,tabs);const m=MODULES.find(x=>x.k===k)||{};
  return (m.n?procRail(k):'')+'<div class="sh ag-sh"><div class="sh-l"><div class="agline">'+agentFace(k,54,{badge:false,cls:'big'})+'<div class="bub"><div class="bub-h"><b>'+A.n+'</b><span>'+esc(A.role)+(m.n?' · '+(k==='launch'?'ready for launch':'step '+m.n+' of 3'):'')+(['prospects','give','reach'].includes(k)?'<em class="free">Free to build</em>':'')+'</span></div><p>'+esc(agentSays(k))+'</p></div></div><h1 class="sh-t">'+title+'</h1></div>'+(actions?'<div class="sh-a">'+actions+'</div>':'')+'</div>'+(tabs||'')};
/* handing the work on: one agent passes to the next */
handoff=function(k,label,f,line){const L=SYS();const i=L.findIndex(m=>m.k===k);const m=MODULES.find(x=>x.k===k);const nx=k==='launch'?MODULES.find(x=>x.k==='signals'):k==='signals'?MODULES.find(x=>x.k==='pipeline'):k==='pipeline'?L[0]:L[i+1];const A=AGENTS[k],B=AGENTS[nx.k];
  return '<div class="handoff ag-ho"><div class="ho-vis">'+agentFace(k,44,{badge:false})+'<span class="ho-line"><i></i><i></i></span>'+agentFace(nx.k,44,{badge:false})+'</div><div class="grow"><b>'+esc(A.n)+': “Over to you, '+esc(B.n)+'.”</b><small>'+esc(line||m.out+'. '+B.n+' '+B.role.charAt(0).toLowerCase()+B.role.slice(1)+'.')+'</small></div><button class="btn btn-primary" onclick="'+(f||"go('"+nx.k+"')")+'">'+(label||'Over to '+B.n)+ico('arrow','a')+'</button></div>'};
/* a small "meet the team" strip for Home */
function castStrip(){return '<div class="cast">'+['agency','prospects','give','reach','launch','signals','pipeline','team','insights'].map(k=>'<button class="cast-a" onclick="go(\''+k+'\')" data-tip="'+esc(AGENTS[k].me)+'">'+agentFace(k,40)+'<b>'+AGENTS[k].n+'</b><small>'+esc(AGENTS[k].role)+'</small></button>').join('')+'</div>'}
