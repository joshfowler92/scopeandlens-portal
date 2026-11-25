/* ═══════════ v18d PLAN THE JOURNEY + LAUNCH ═══════════
   Priya plans the sequence and matches an asset to every touchpoint. A launch date drives reminders.
   Launch is rebuilt around one question: what do I do today? */

/* ── dates ── */
function nextMonday(){const d=new Date();const k=(8-d.getDay())%7||7;d.setDate(d.getDate()+k);return d.toISOString().slice(0,10)}
function start18(c){return c.start18||c.launched||nextMonday()}
function stepDate(c,s){const d=new Date(start18(c)+'T09:00:00');const off={linkedin:0,email:1,phone:3,event:2,workshop:2,mail:1,social:3}[s.ch]||0;d.setDate(d.getDate()+(s.w-1)*7+off);return d}
const fmtD=d=>d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});
function setStart18(v){const c=curCamp();if(!v)return;c.start18=v;save();toast('Launch date set. Reminders follow it.');go(VIEW,VIEW_ARG,true)}

/* ── assets on touchpoints ── */
function assetName(c,id){if(!id)return '';const it=bankItems(c).find(x=>x.id===id);return it?it.t:''}
function assetFor(c,s,used){const I=bankItems(c);const pick=slot=>{const L=I.filter(x=>x.slot===slot);if(!L.length)return '';const n=used[slot]||0;used[slot]=n+1;return L[n%L.length].id};
  const t=(s.t||'').toLowerCase();
  if(s.ch==='social'||s.content)return pick('lipost')||pick('blog');
  if(/gift|give|send the|share the|benchmark|audit|report|piece|test|tool/.test(t))return I.some(x=>x.id==='hero')?'hero':pick('blog');
  if(s.ch==='email'){const k=(used.email=(used.email||0)+1);return k===1?(I.some(x=>x.id==='hero')?'hero':pick('blog')):k===2?pick('case')||pick('blog'):pick('blog')||pick('case')}
  if(s.ch==='phone'||s.warm)return pick('video')||'';
  if(s.ch==='mail')return I.some(x=>x.id==='hero')?'hero':'';
  if(s.ch==='linkedin'&&/value|useful|post|thinking/.test(t))return pick('lipost');
  return ''}
function priyaMatch(c){const used={};let n=0;c.reach.steps.slice().sort((a,b)=>a.w-b.w).forEach(s=>{if(s.assetSet)return;const a=assetFor(c,s,used);s.asset=a||'';if(a)n++});return n}
function priyaPlan(){const c=curCamp();if(!c)return;const R=c.reach;if(!R.ch||!R.ch.length)R.ch=REC_CH.slice();if(!R.weeks)R.weeks=12;
  const o=document.createElement('div');o.className='pp18';o.innerHTML='<div class="pp18-c">'+agentFace('reach',52,{badge:false})+'<b>Priya is planning the sequence</b><ul id="pp18L"></ul></div>';document.body.appendChild(o);requestAnimationFrame(()=>o.classList.add('on'));
  const lines=['Spacing touches so nobody gets two in a week','Leading with value, asking later','Matching an asset to each touchpoint','Setting reminders from your launch date'];const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  lines.forEach((l,i)=>setTimeout(()=>{const L=$('#pp18L');if(L)L.insertAdjacentHTML('beforeend','<li>'+ico('check')+l+'</li>')},reduce?0:300+i*480));
  setTimeout(()=>{R.steps=genSteps(c);const n=priyaMatch(c);c.planned18=today();if(!c.start18)c.start18=nextMonday();save();o.classList.remove('on');setTimeout(()=>o.remove(),250);go('reach',null,true);
    toast(R.steps.length+' touchpoints planned. '+n+' carry an asset from your content bank.')},reduce?300:2400)}

/* the touchpoint editor gets an asset picker */
const _editTouch18=editTouch;editTouch=function(id){_editTouch18(id);const c=curCamp();const st=id?c.reach.steps.find(x=>x.id===id):null;const I=bankItems(c);const w=$('#tpW');if(!w)return;
  const lab={hero:'Hero piece',case:'Case study',lipost:'LinkedIn post',blog:'Blog or report',video:'Video',screen:'Screen recording'};
  w.closest('.field').insertAdjacentHTML('afterend','<div class="field"><label for="tpA">What they get <span class="muted">· from your content bank</span></label><select class="inp" id="tpA"><option value="">Nothing attached</option>'+I.map(x=>'<option value="'+x.id+'"'+(st&&st.asset===x.id?' selected':'')+'>'+esc((lab[x.slot]||'')+': '+x.t)+'</option>').join('')+'</select>'+(st?'<small class="hint">Goes out '+fmtD(stepDate(c,st))+'.</small>':'')+'</div>')};
const _saveTouch18=saveTouch;saveTouch=function(id){const a=($('#tpA')||{}).value;const c=curCamp();const before=c.reach.steps.length;_saveTouch18(id);const s=id?c.reach.steps.find(x=>x.id===id):c.reach.steps.length>before?c.reach.steps[c.reach.steps.length-1]:null;if(s&&a!==undefined){s.asset=a||'';s.assetSet=1;save()}};

/* ── the planner strip on Plan the journey ── */
function planner18(c){const R=c.reach;const st=(R.steps||[]).filter(s=>!s.task).sort((a,b)=>a.w-b.w);const withA=st.filter(s=>s.asset).length;const end=new Date(start18(c)+'T09:00:00');end.setDate(end.getDate()+R.weeks*7-3);
  const open=c.seqOpen18;
  return '<section class="pl18"><div class="pl18-h">'+agentFace('reach',44,{badge:false})+'<div class="grow"><b>'+(c.planned18||st.length?'Priya’s plan: '+st.length+' touchpoints over '+R.weeks+' weeks':'Let Priya plan the sequence')+'</b><span>'+(st.length?withA+' carry an asset from your content bank. Reminders arrive the day before each one.':'She spaces the touches, leads with value and matches an asset to each one.')+'</span></div>'+
    '<label class="pl18-d"><small>Launch date</small><input type="date" class="inp sm" value="'+start18(c)+'" min="'+today()+'" onchange="setStart18(this.value)"></label>'+
    '<div class="pl18-e"><small>Ends</small><b>'+fmtD(end)+'</b></div>'+
    '<button class="btn btn-primary" onclick="priyaPlan()">'+ico('sparkle')+(st.length?'Ask Priya to replan':'Ask Priya to plan')+'</button></div>'+
    (st.length?'<button class="pl18-t" onclick="curCamp().seqOpen18=!curCamp().seqOpen18;save();go(\'reach\',null,true)">'+ico(open?'x':'list')+(open?'Hide the sequence':'See the sequence, with dates and assets')+'</button>':'')+
    (open?'<ol class="pl18-s">'+st.map(s=>{const ch=REACH_CH.find(x=>x.k===s.ch)||REACH_CH[0];const an=assetName(c,s.asset);return '<li onclick="editTouch(\''+s.id+'\')"><span class="pl18-dt">'+fmtD(stepDate(c,s))+'</span><span class="pl18-ch">'+ico(ch.ic)+'</span><span class="grow"><b>'+esc(s.t)+'</b>'+(an?'<em>'+ico('gift')+esc(an)+'</em>':'<em class="no">No asset. Tap to add one</em>')+'</span></li>'}).join('')+'</ol>':'')+'</section>'}
const _reach18=VIEWS.reach;VIEWS.reach=function(){const c=campPrep();if(c.reach.steps&&c.reach.steps.length&&!c.matched18){priyaMatch(c);c.matched18=1;save()}let h=String(_reach18());
  try{h=h.replace(bankStrip(c),'')}catch(e){}
  const i=h.indexOf('<div class="jgrid">');const pl=planner18(c);return i>-1?h.slice(0,i)+pl+h.slice(i):h+pl};
IC.list=IC.list||'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>';

/* ── reminders: what is due soon, and anything time sensitive ── */
function reminders18(c,days){days=days||7;const now=new Date();now.setHours(0,0,0,0);const lim=new Date(now);lim.setDate(lim.getDate()+days);const out=[];
  (c.reach.steps||[]).filter(s=>!s.task).forEach(s=>{const d=stepDate(c,s);if(d>=now&&d<=lim)out.push({d,ic:(REACH_CH.find(x=>x.k===s.ch)||{ic:'mail'}).ic,t:s.t,sub:assetName(c,s.asset)?'With '+assetName(c,s.asset):'Week '+s.w,f:"editTouch('"+s.id+"')"})});
  campTargets(c).forEach(a=>{const n=a.news;if(n&&n.date&&daysAgo(String(n.date).slice(0,7)+'-01')<=21)out.push({d:now,hot:1,ic:'bolt',t:a.name+': '+(L_TRIGGER_LABELS[n.type]||'news'),sub:'A reason to get in touch this week',f:"openAccount&&openAccount('"+a.id+"')"})});
  if(!out.filter(x=>!x.hot).length){(c.reach.steps||[]).filter(s=>!s.task).map(s=>({s,d:stepDate(c,s)})).filter(x=>x.d>lim).sort((a,b)=>a.d-b.d).slice(0,3).forEach(({s,d})=>out.push({d,ic:(REACH_CH.find(x=>x.k===s.ch)||{ic:'mail'}).ic,t:s.t,sub:assetName(c,s.asset)?'With '+assetName(c,s.asset):'Week '+s.w,f:"editTouch('"+s.id+"')"}))}
  return out.sort((a,b)=>a.d-b.d).slice(0,8)}

/* ── Launch, rebuilt ── */
VIEWS.launch=function(){const c=curCamp();if(!c.reach.steps)c.reach.steps=genSteps(c);const pf=preflight(c);const ready=pf.every(x=>x.ok);const live=campLive(c);let M=S.launch.mode;if(live&&!M)M=S.launch.mode='manual';
  const tg=campTargets(c);const ppl=[];tg.forEach(a=>a.people.forEach(p=>ppl.push({a,p})));const steps=c.reach.steps.filter(s=>!s.task);const total=ppl.length*steps.length;const done=Object.keys(c.sent||{}).length+S.launch.done.filter(x=>x.camp===c.id).length;
  const days=c.launched?Math.max(0,daysAgo(c.launched)):0;const replies=sum(tg,a=>a.signals.filter(g=>['reply','li_reply','meeting'].includes(g.type)).length);const pct=total?Math.min(100,Math.round(done/total*100)):0;
  const mode='<div class="ln18-mode"><span>Sending</span>'+seg([['manual','Myself'],['amplify','Through Amplify'+(isPremium()?'':' · Premium')]],M||'manual',"setMode($)")+'</div>';
  const rem=reminders18(c,7);
  const side='<aside class="ln18-side"><div class="ln18-sh"><b>Coming up</b><small>Reminders arrive the day before each one</small></div>'+
    (rem.length?'<ul class="ln18-rem">'+rem.map(r=>'<li class="'+(r.hot?'hot':'')+'" onclick="'+r.f+'"><span class="d">'+(r.hot?'Now':fmtD(r.d).split(' ').slice(0,2).join(' '))+'</span><span class="i">'+ico(r.ic)+'</span><span class="grow"><b>'+esc(r.t)+'</b><small>'+esc(r.sub)+'</small></span></li>').join('')+'</ul>':'<p class="muted small">Nothing planned yet. Ask Priya to plan the journey.</p>')+
    '<button class="link" onclick="go(\'reach\')">See the whole sequence</button></aside>';
  let main='';
  if(!live){main='<section class="ln18-pre"><div class="ln18-ck"><h2>Before you <span class="serif">launch.</span></h2><ul>'+pf.map(x=>'<li class="'+(x.ok?'ok':'')+'"><i>'+(x.ok?ico('check'):'')+'</i><span class="grow">'+esc(x.t)+'</span>'+(x.ok?'':'<button class="btn btn-line btn-xs" onclick="'+x.f+'">Sort it</button>')+'</li>').join('')+'</ul></div>'+
    '<div class="ln18-go">'+agentFace('launch',56,{badge:false})+'<div class="ln18-gd"><small>Launch date</small><input type="date" class="inp sm" value="'+start18(c)+'" min="'+today()+'" onchange="setStart18(this.value)"></div>'+
    '<p><b>'+ppl.length+' people · '+steps.length+' touchpoints · '+total+' messages.</b> Every one is written. The first goes out '+fmtD(new Date(start18(c)+'T09:00:00'))+'.</p>'+mode+
    '<button class="btn btn-primary btn-lg'+(ready?'':' off')+'" onclick="launchNow()">'+ico('rocket')+(ready?'Launch '+esc(c.name):'Sort '+pf.filter(x=>!x.ok).length+' thing'+(pf.filter(x=>!x.ok).length===1?'':'s')+' first')+'</button>'+
    '<small class="muted">Everything up to here is free to build. '+(canLaunch()&&!launchPreview()?'Your agency is set up to launch.':'Launching is the only step you pay for.')+'</small></div></section>'}
  else{main='<section class="ln18-stat"><div class="ln18-n"><div><b>'+done+'</b><small>sent</small></div><div><b>'+Math.max(0,total-done)+'</b><small>to go</small></div><div><b>'+replies+'</b><small>replies</small></div><div><b>'+days+'</b><small>day'+(days===1?'':'s')+' live</small></div></div><div class="ln18-p"><i style="width:'+pct+'%"></i></div>'+mode+'</section>'+
    ampPanel(c)+'<section class="ln18-today"><div class="ln18-th"><h2>Today’s <span class="serif">messages.</span></h2><span class="muted small">A few a day is plenty. Tick each one as you send it.</span></div>'+(M==='amplify'?amplifyView(c):missionControl(c,ppl))+'</section>'}
  return secHead('launch',live?esc(c.name)+' is <span class="serif">live.</span>':'Ready to <span class="serif">launch.</span>')+'<div class="ln18">'+'<div class="ln18-main">'+main+'</div>'+side+'</div>'};
