/* ═══════════ v12 THE CREW: Plato plus four bots ═══════════
   Plato is the guide for everything, bottom right. Each outreach step has a bot with one job and a personality to match:
   Scout finds who to target, Muse makes what to share, Relay plans how to reach them, Pilot launches it.
   They hand the work to each other, and talk to each other while they do it. The bots are drawn in SVG, so they are sharp at any size
   and can blink, scan and talk. */
Object.assign(AGENTS.home,{n:'Plato',role:'Your guide',col:'#2c56ed',img:'plato',me:'I can see everything in Plato. Ask me anything, or ask me to do it for you.'});
Object.assign(AGENTS.prospects,{n:'Scout',role:'Finds who to target',col:'#0b9f8a',img:'',bot:'radar',eyes:'scan',motto:'Fewer, better, sooner.',
  me:'I find the few brands worth your time and the people who actually decide. I do not do maybe. I do a score out of 100.'});
Object.assign(AGENTS.give,{n:'Muse',role:'Makes what to share',col:'#e8890c',img:'',bot:'spark',eyes:'spark',motto:'Useful first. Clever second.',
  me:'I come up with the thing so useful they would pay for it. Then you give it away. Yes, really. That is the whole trick.'});
Object.assign(AGENTS.reach,{n:'Relay',role:'Plans how to reach them',col:'#7048e8',img:'',bot:'ping',eyes:'happy',motto:'Never two emails in a week.',
  me:'I plan how you reach them: which road, how often, and when to be quiet and let them come to you.'});
Object.assign(AGENTS.launch,{n:'Pilot',role:'Launches it with you',col:'#e03131',img:'',bot:'rocket',eyes:'visor',motto:'Small burns, every day.',
  me:'I line up today’s messages. You check them and send them. Ten minutes a day, every day, until they reply.'});
const BOT_GLOW={radar:'#c3fae8',spark:'#fff3bf',ping:'#e5dbff',rocket:'#ffe3e3'};
/* one bot, as SVG. Same body for all four (a dark, glossy head with a screen for a face), with its own crest, eyes and colour */
function botSVG(kind,col,x,crop){const g=BOT_GLOW[kind]||'#fff';const ns=x?' xmlns="http://www.w3.org/2000/svg" width="240" height="240"':'';
  const head='<rect x="27" y="40" width="66" height="54" rx="22" fill="#16161f"/><rect x="27" y="40" width="66" height="54" rx="22" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="1.5"/>'+
    '<path d="M38 46c8-4 22-5 34-2" stroke="#fff" stroke-opacity=".22" stroke-width="3" stroke-linecap="round" fill="none"/>'+
    '<rect x="21" y="60" width="9" height="16" rx="4.5" fill="#23232e"/><rect x="90" y="60" width="9" height="16" rx="4.5" fill="#23232e"/>'+
    '<rect x="35" y="53" width="50" height="31" rx="13" fill="#05050a"/>';
  let body='<path d="M30 120c2-16 14-24 30-24s28 8 30 24z" fill="#16161f"/><rect x="52" y="92" width="16" height="8" rx="3" fill="#23232e"/><circle cx="60" cy="108" r="4" fill="'+g+'" opacity=".9"/>';
  let crest='',eyes='',mouth='<rect class="b-m" x="54" y="75" width="12" height="3" rx="1.5" fill="'+g+'" opacity=".8"/>';
  if(kind==='radar'){crest='<g class="b-dish"><path d="M60 41v-11" stroke="#23232e" stroke-width="4" stroke-linecap="round"/><path d="M45 25a16 16 0 0 0 30 0z" fill="#23232e"/><circle cx="60" cy="21" r="3" fill="'+g+'"/><path d="M52 14a11 11 0 0 1 16 0M48 9a17 17 0 0 1 24 0" stroke="'+g+'" stroke-width="2.4" stroke-linecap="round" fill="none" class="b-wave"/></g>';
    eyes='<g class="eyes"><circle cx="48" cy="66" r="5.5" fill="'+g+'"/><circle cx="72" cy="66" r="7.5" fill="none" stroke="'+g+'" stroke-width="2.2"/><circle cx="72" cy="66" r="2.6" fill="'+g+'"/><path d="M72 56.5v4M72 71.5v4M62.5 66h4M77.5 66h4" stroke="'+g+'" stroke-width="1.8" stroke-linecap="round"/></g>'+
      '<rect class="b-scan" x="37" y="55" width="3" height="27" rx="1.5" fill="'+g+'" opacity=".35"/>';}
  if(kind==='spark'){crest='<path class="b-bolt" d="M64 6 47 30h11l-5 13 18-25H59z" fill="'+g+'" stroke="#16161f" stroke-width="2.5" stroke-linejoin="round"/>';
    const st=(cx,cy,r)=>'<path d="M'+cx+' '+(cy-r)+'C'+(cx+1.4)+' '+(cy-2)+' '+(cx+2)+' '+(cy-1.4)+' '+(cx+r)+' '+cy+'C'+(cx+2)+' '+(cy+1.4)+' '+(cx+1.4)+' '+(cy+2)+' '+cx+' '+(cy+r)+'C'+(cx-1.4)+' '+(cy+2)+' '+(cx-2)+' '+(cy+1.4)+' '+(cx-r)+' '+cy+'C'+(cx-2)+' '+(cy-1.4)+' '+(cx-1.4)+' '+(cy-2)+' '+cx+' '+(cy-r)+'z" fill="'+g+'"/>';
    eyes='<g class="eyes">'+st(48,66,8)+st(72,66,8)+'</g>';mouth='<path class="b-m" d="M53 75q7 5 14 0" stroke="'+g+'" stroke-width="2.6" stroke-linecap="round" fill="none"/>';}
  if(kind==='ping'){crest='<path d="M26 58c0-24 15-35 34-35s34 11 34 35" stroke="#23232e" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M60 23v-7" stroke="#23232e" stroke-width="4" stroke-linecap="round"/><circle cx="60" cy="13" r="4.5" fill="'+g+'"/>'+
      '<path class="b-wave" d="M50 9a13 13 0 0 0 0 9M70 9a13 13 0 0 1 0 9M45 5a20 20 0 0 0 0 17M75 5a20 20 0 0 1 0 17" stroke="'+g+'" stroke-width="2.2" stroke-linecap="round" fill="none"/>'+
      '<path d="M95 72c4 6 2 13-9 15" stroke="#23232e" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="84" cy="87.5" r="3.5" fill="'+g+'"/>';
    eyes='<g class="eyes"><path d="M42 69q6-8 12 0M66 69q6-8 12 0" stroke="'+g+'" stroke-width="3.4" stroke-linecap="round" fill="none"/></g>';}
  if(kind==='rocket'){crest='<path d="M60 4c9 8 13 20 12 37H48c-1-17 3-29 12-37z" fill="#23232e"/><circle cx="60" cy="25" r="5" fill="'+g+'"/><circle cx="60" cy="25" r="2.2" fill="#16161f"/><path d="M48 32l-8 9h9zM72 32l8 9h-9z" fill="#23232e"/>';
    eyes='<g class="eyes"><rect x="40" y="61" width="40" height="10" rx="5" fill="'+g+'" opacity=".28"/><circle cx="50" cy="66" r="4.2" fill="'+g+'"/><circle cx="70" cy="66" r="4.2" fill="'+g+'"/></g>';
}
  return '<svg'+ns+' viewBox="'+(crop?'13 14 94 94':'0 0 120 120')+'" class="botsvg b-'+kind+'">'+(x?'<defs><clipPath id="c"><circle cx="60" cy="60" r="60"/></clipPath></defs>':'')+'<g'+(x?' clip-path="url(#c)"':'')+'><rect width="120" height="120" fill="'+col+'"/>'+body+crest+head+eyes+mouth+'</g></svg>'}
function botURI(k){const A=AGENTS[k]||AGENTS.prospects;return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(botSVG(A.bot||'radar',A.col,true))}
agentFace=function(k,sz,o){const A=AGENTS[k]||AGENTS.home;o=o||{};sz=sz||36;
  if(k==='home'||!A.bot){const im=IMG12.plato_face;return '<span class="ag gd plato'+(o.cls?' '+o.cls:'')+'" style="--ac:'+A.col+';width:'+sz+'px;height:'+sz+'px" aria-hidden="true"><img src="'+im+'" alt="" draggable="false">'+(o.badge===false||!o.num?'':'<i class="ag-b">'+o.num+'</i>')+'</span>'}
  return '<span class="ag bt'+(o.cls?' '+o.cls:'')+'" style="--ac:'+A.col+';width:'+sz+'px;height:'+sz+'px" aria-hidden="true">'+botSVG(A.bot,A.col,false,sz<=34)+(o.badge===false||!o.num?'':'<i class="ag-b">'+o.num+'</i>')+'</span>'};
function platoFace(sz,cls){sz=sz||36;return '<span class="ag gd plato'+(cls?' '+cls:'')+'" style="width:'+sz+'px;height:'+sz+'px" aria-hidden="true"><img src="'+IMG12.plato_face+'" alt="" draggable="false"></span>'}
function godBust(k,sz){const A=AGENTS[k]||AGENTS.home;if(k==='home'||!A.bot)return '<span class="gbust" style="width:'+sz+'px;height:'+sz+'px"><img src="'+IMG12.plato_bust+'" alt="Plato" draggable="false"></span>';
  return '<span class="gbust bt" style="width:'+sz+'px;height:'+sz+'px" role="img" aria-label="'+esc(A.n)+'">'+botSVG(A.bot,A.col)+'</span>'}
const botBust=godBust;
/* what each bot says when you arrive: dry, quick, a bit cheeky, always useful */
const _agentSays12=agentSays;agentSays=function(k){try{const c=curCamp();const tg=campTargets(c);const P=PROB();
  if(k==='prospects'){if(!profDone())return 'Tell me who you want to win. Five quick taps and I will go and find them. I am fast, not psychic.';if(!campScanned(c))return 'Press Find prospects now and I will sweep for the few brands worth your time. Spraying and praying is someone else’s department.';const ppl=sum(tg,a=>a.people.length);return tg.length?tg.length+' brand'+(tg.length===1?'':'s')+' locked'+(ppl?', '+ppl+' people who decide. Muse is already twitching.':'. Now let me find who actually signs things off.'):'Pick the brands you like the look of. I have scored them, so you do not have to squint.'}
  if(k==='give'){if(!c.problem)return 'Give me a problem and I will give you ten ideas. Which one does this campaign solve?';if(c.assets.length)return bankReady(c)?'Gift made, content bank full. I may have peaked. Relay, it is yours.':'Good gift. Now fill the content bank around '+P.short+' so every touch has something worth opening.';return 'Ideas below, built from your proof and their news. Pick one great gift. One. I know, I struggle too.'}
  if(k==='reach'){const s=(c.reach.steps||[]).length;if(!(c.reach.ch||[]).length)return 'Pick your channels, or take the Scope & Lens route and I will pace it properly. Nobody likes the person who emails twice before lunch.';return s+' touches over '+c.reach.weeks+' weeks, never two emails in one week. Scan your LinkedIn profile first: they will look you up before they accept.'}
  if(k==='launch'){if(!campLive(c))return 'Everything is fuelled. Press launch and I will line up each day’s messages. Nothing goes out without you.';const due=(typeof dueToday==='function'?dueToday(c):[]).length;return due?due+' step'+(due===1?'':'s')+' for today. Ten minutes, then go and do your actual job.':'Nothing due today. Coasting is part of the flight plan.'}
  return _agentSays12(k)}catch(e){return AGENTS[k]?AGENTS[k].me:''}};
/* your team talking to each other: two or three lines about where this campaign is, so you can see the hand-offs happen */
function crewChat(k){try{const c=curCamp();const tg=campTargets(c);const ppl=sum(tg,a=>a.people.length);const P=PROB();const g=toolById(c.assets[0]);const s=(c.reach.steps||[]).length;
  const H=a=>{try{return scoreAccount(a).heat||0}catch(e){return 0}};const hot=tg.slice().sort((a,b)=>H(b)-H(a))[0];
  if(k==='prospects'){if(!campScanned(c))return [['prospects','Sweeping the UK for brands that fit. Muse, hands off until I am done.'],['give','I was not touching anything. (I was.)']];
    if(!ppl)return [['prospects','Muse, the shortlist is in. People next, then they are all yours.'],['give','Tell me when you have names. I make better gifts for people than for logos.']];
    return [['prospects',tg.length+' brands, '+ppl+' decision maker'+(ppl===1?'':'s')+'. Muse, over to you.'],['give','Lovely. '+(c.problem?'Already thinking about '+P.short+'.':'What is their problem? Pick one and I will build around it.')],['reach','I will plan the road once there is something worth delivering.']]}
  if(k==='give'){if(!c.problem)return [['give','Scout, what keeps these people up at night?'],['prospects',(hot&&hot.news?'Their news says plenty. Start with '+hot.name+'.':'Pick a problem below. I only deal in evidence.')]];
    if(!g)return [['give','Problem set: '+P.short+'. Ideas are below, ranked.'],['reach','Pick the most useful one, not the cleverest. I have to deliver it.']];
    return [['give','Gift ready: '+g.n+'. Relay, make sure they actually see it.'],['reach','On it. Nobody gets two emails in a week on my watch.']]}
  if(k==='reach'){if(!(c.reach.ch||[]).length)return [['reach','Pilot, I need channels before you get excited.'],['launch','I am always excited.'],['reach','Exactly the problem.']];
    return [['reach',s+' touches over '+c.reach.weeks+' weeks, paced. Pilot, do not rush it.'],['launch','Rushing is for cold emailers. Ready when you are.']]}
  if(k==='launch'){if(!campLive(c))return [['launch','Pre-flight check. Scout?'],['prospects',tg.length+' brand'+(tg.length===1?'':'s')+', '+ppl+' '+(ppl===1?'person':'people')+'. Scored.'],['give',g?'Gift wrapped: '+g.n+'.':'No gift yet. Do not look at me like that.'],['reach',s?'Route planned. '+s+' touches.':'No route yet.']];
    const due=(typeof dueToday==='function'?dueToday(c):[]).length;return [['launch',due?due+' step'+(due===1?'':'s')+' due today.':'Nothing due today. Holding altitude.'],['prospects',hot&&H(hot)>=3?hot.name+' is warming up. Lean in there first.':'I am watching for anyone warming up.']]}
  return []}catch(e){return []}}
function crewHTML(k){const L=crewChat(k);if(!L.length)return '';
  return '<div class="crew" aria-label="Your team talking">'+L.map((x,i)=>{const A=AGENTS[x[0]];return '<div class="crw" style="--d:'+(.35+i*.55)+'s;--ac:'+A.col+'">'+agentFace(x[0],22,{badge:false})+'<span><b>'+esc(A.n)+'</b>'+esc(x[1])+'</span></div>'}).join('')+'</div>'}
/* your team chat lives on Home only (see fixes12.js), so the step pages stay clean */
/* handing on: each bot passes the work on in its own words */
const BOT_HAND={prospects:'Brands locked. Over to you, Muse.',give:'Gift wrapped. Your road, Relay.',reach:'Route planned. Light it up, Pilot.',launch:'Launched. Plato, keep an eye on who warms up.'};
const _handoff12=handoff;handoff=function(k,label,f,line){const h=_handoff12(k,label,f,line);const A=AGENTS[k];if(!BOT_HAND[k]||!A)return h;return h.replace(/<b>[^<]*“Over to you, [^”]*”<\/b>/,'<b>'+esc(A.n)+': “'+esc(BOT_HAND[k])+'”</b>')};
