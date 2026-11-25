/* ═══════════ v18 CALM: one clear place for everything ═══════════
   Written for someone who needs to know where to look in a second:
   1. The sidebar is flat. Home, Campaigns (with the campaign you are building or running right under it),
      Signals and intent, Pipeline, Insights and Reports. Nothing folds away, nothing gets cut off.
      Agency profile, Team, Settings and Help sit at the bottom. Help has "Speak with Josh".
   2. No crew chat on every stage. A slim campaign bar instead, and the crew show up to hand over
      when you finish a stage.
   3. No footer bar, a quieter coach, warmer words. */

/* ── stage names: what you do there ─────────────────────────── */
(function(){const N={prospects:'Pick your brands',give:'Create value',reach:'Plan the journey',launch:'Launch'};
  MODULES.forEach(m=>{if(N[m.k])m.l=N[m.k]})})();
const STAGE_L=k=>(MODULES.find(m=>m.k===k)||{}).l||k;
if(!MODULES.some(m=>m.k==='reports'))MODULES.push({k:'reports',l:'Reports',ic:'doc',t:'Reports',lock:true,d:'Reports',why:'A clean report on any campaign, your pipeline or your signals, ready to share in a couple of clicks.'});
SIDE_IC.reports='doc';SIDE_IC.signals='pulse';SIDE_IC.pipeline='pound';SIDE_IC.insights='bulb';SIDE_IC.camps='layers';SIDE_IC.help='help';

/* ── 1. the sidebar ─────────────────────────────────────────── */
function realCampList(){return S.campaigns.filter(x=>!(isBlankCamp(x)&&!x.touched))}
navHTML=function(){const st=sysStats();const c=curCamp();const gate=!profReady();const real=c&&!(isBlankCamp(c)&&!c.touched);const L=campStateLabel(c);
  const inCamp=OUT_K.includes(VIEW)||VIEW==='camps'||VIEW==='perf';
  const step=(k,i)=>{const A=AGENTS[k];const s=campStepState(c,k);
    return '<button class="sd18-s'+(VIEW===k?' on':'')+(s===2?' dn':'')+(gate?' lock':'')+'" data-nav="'+k+'" id="nav-'+k+'" data-tip="'+esc(STAGE_L(k)+' with '+A.n)+'">'+
      '<span class="sd18-n">'+(gate?ico('lock'):s===2?ico('check'):(i+1))+'</span><span class="sd18-l">'+esc(STAGE_L(k))+'</span>'+agentFace(k,20,{badge:false})+'</button>'};
  const campBlock=real?'<div class="sd18-camp'+(inCamp?' act':'')+'"><button class="sd18-ch" onclick="pickCamp(event)" data-tip="Switch campaign"><span class="sd18-dot '+L[2]+'"></span><span class="grow"><b>'+esc(c.name)+'</b><small>'+esc(L[0]+' · '+L[1])+'</small></span>'+ico('chev')+'</button>'+
    '<div class="sd18-steps">'+OUT_K.map(step).join('')+'</div></div>':'';
  return '<div class="sd18">'+sideItem('home','Home')+sideItem('camps','Campaigns',null,realCampList().length||'')+campBlock+
    sideItem('signals','Signals & intent',null,st.signals&&st.signals.badge)+sideItem('pipeline','Pipeline')+sideItem('insights','Insights',null,st.insights&&st.insights.badge)+sideItem('reports','Reports')+'</div>'};
sideFoot=function(){const adm=SESSION&&SESSION.role==='admin';
  return '<div class="sd-foot sd18-foot">'+sideItem('agency','Agency profile',null,profReady()?'':'!')+sideItem('team','Team')+(adm?sideItem('admin','Manage access'):'')+
    '<button class="sd-i'+(VIEW==='settings'?' on':'')+'" onclick="go(\'settings\')" id="nav-settings" data-tip="Settings">'+ico('settings')+'<span class="sd-t"><b>Settings</b></span></button>'+
    '<button class="sd-i sd18-help" onclick="helpMenu(event)" id="nav-help" data-tip="Help" aria-haspopup="menu">'+ico('help')+'<span class="sd-t"><b>Help</b></span></button></div>'};
/* the sliding marker follows the new step buttons too */
(function(){const _m=sdMarker;sdMarker=function(){const nav=$('#nav');if(!nav)return _m();const on=nav.querySelector('.sd18-s.on');if(on){const m=nav.querySelector('.sd-slide');if(m)m.style.opacity=0;return}return _m()}})();

/* ── Help: guides, the tour, and Josh ───────────────────────── */
function helpMenu(e){e&&e.stopPropagation();let m=$('#help18');if(m){m.remove();return}
  m=document.createElement('div');m.id='help18';m.className='help18';m.setAttribute('role','menu');
  m.innerHTML='<button role="menuitem" onclick="helpClose();speakJosh()" class="h18-josh"><span class="h18-ph">'+joshFace(34)+'</span><span><b>Speak with Josh</b><small>A real person, straight to his inbox</small></span></button>'+
    '<button role="menuitem" onclick="helpClose();go(\'guides\')">'+ico('book')+'<span><b>Guides</b><small>How to get the most from each step</small></span></button>'+
    '<button role="menuitem" onclick="helpClose();startTour()">'+ico('eye')+'<span><b>Show me around</b><small>A quick tour of this page</small></span></button>'+
    '<button role="menuitem" onclick="helpClose();startWalk(true)">'+ico('play')+'<span><b>Replay the walkthrough</b><small>The method, start to finish</small></span></button>';
  document.body.appendChild(m);const b=$('#nav-help');if(b){const r=b.getBoundingClientRect();m.style.left=Math.min(r.left,innerWidth-300)+'px';m.style.bottom=(innerHeight-r.top+8)+'px'}
  setTimeout(()=>document.addEventListener('click',helpClose,{once:true}),0)}
function helpClose(){const m=$('#help18');if(m)m.remove()}
const JOSH_IMG='data:image/jpeg;base64,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';
function joshFace(sz){return '<span class="jf18" style="width:'+sz+'px;height:'+sz+'px"><img src="'+JOSH_IMG+'" alt="Josh"></span>'}
function speakJosh(pre){const u=SESSION||{};const em=u.email||'';
  modal('<div class="sj18"><div class="sj18-h">'+joshFace(52)+'<div><h2>Speak with <span class="serif">Josh.</span></h2><p class="muted">Your message goes straight to Josh’s inbox. He usually replies the same day.</p></div></div>'+
    '<div class="field"><label for="sjM">What can Josh help with?</label><textarea class="inp" id="sjM" rows="5" placeholder="e.g. Can we talk through which brands to go after first?">'+esc(pre||'')+'</textarea></div>'+
    '<div class="grid2"><div class="field"><label for="sjN">Your name</label><input class="inp" id="sjN" value="'+esc(S.setup.you||u.name||'')+'"></div><div class="field"><label for="sjE">Where should he reply?</label><input class="inp" id="sjE" type="email" value="'+esc(em)+'" placeholder="you@agency.com"></div></div>'+
    '<div class="sj18-f"><button class="btn btn-ghost" onclick="closeOverlays()">Cancel</button><button class="btn btn-primary" id="sjGo" onclick="sendJosh()">'+ico('send')+'Send to Josh</button></div></div>');
  setTimeout(()=>{const t=$('#sjM');t&&t.focus()},120)}
async function sendJosh(){const msg=($('#sjM')||{}).value||'';const name=($('#sjN')||{}).value||'';const email=($('#sjE')||{}).value||'';
  if(msg.trim().length<3){toast('Add a line for Josh first');return}if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())){toast('Add an email so Josh can reply');return}
  const b=$('#sjGo');if(b){b.disabled=true;b.textContent='Sending…'}
  const body={message:msg.trim().slice(0,4000),name:name.trim().slice(0,120),email:email.trim().slice(0,200),agency:S.setup.agency||'',page:STAGE_L(VIEW)||VIEW,demo:!!DEMO_MODE};
  let ok=false;
  try{const r=await fetch('/api/josh',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),credentials:'same-origin'});ok=r.ok}catch(e){}
  if(!ok){try{const r=await fetch('https://formspree.io/f/mbdzjdaw',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(Object.assign({_subject:'Plato: a message for Josh from '+(name||'a user'),_replyto:body.email,_source:'Plato, Speak with Josh'},body))});ok=r.ok}catch(e){}}
  if(ok){closeOverlays();toast('Sent. Josh will reply to '+body.email+'.')}
  else{if(b){b.disabled=false;b.innerHTML=ico('send')+'Send to Josh'}location.href='mailto:josh@scopeandlens.com?subject='+encodeURIComponent('Plato: '+(body.agency||'a question'))+'&body='+encodeURIComponent(body.message)}}

/* ── 2. a slim campaign bar instead of the chat on every stage ── */
crewDeck=function(k){const c=curCamp();if(!c||!OUT_K.includes(k))return '';const many=realCampList().length>1;const L=campStateLabel(c);
  const steps=OUT_K.map((x,i)=>{const s=campStepState(c,x);return '<button class="cb18-s'+(x===k?' on':'')+(s===2?' dn':'')+'" onclick="go(\''+x+'\')" aria-label="'+esc(STAGE_L(x))+(s===2?', done':x===k?', you are here':'')+'">'+agentFace(x,24,{badge:false})+'<span>'+esc(STAGE_L(x))+'</span>'+(s===2?'<i>'+ico('check')+'</i>':'')+'</button>'+(i<3?'<i class="cb18-ln'+(s===2?' fed':'')+'"></i>':'')}).join('');
  return '<div class="cb18"><button class="cb18-c" onclick="'+(isApp()?'campSheet()':"go('camps')")+'" aria-label="Campaign: '+esc(c.name)+(many?'. Switch campaign':'')+'"><small>'+esc(L[0])+'</small><b>'+esc(c.name)+'</b>'+(many?'<em>Switch</em>':'')+'</button><div class="cb18-steps">'+steps+'</div><button class="cb18-m" onclick="crewMeet(\''+k+'\')">'+ico('people')+'<span>Crew</span></button></div>'};
crewPlay=function(){};

/* the crew hand over when you finish a stage: a short moment, then gone */
let HAND18=null;
function handSnap(){const c=curCamp();if(!c)return null;const o={id:c.id};OUT_K.forEach(k=>o[k]=campStepState(c,k));return o}
function handCheck(){const c=curCamp();const now=handSnap();if(!now){HAND18=null;return}
  if(HAND18&&HAND18.id===now.id){const done=OUT_K.find(k=>HAND18[k]!==2&&now[k]===2);if(done)handOver(done)}HAND18=now}
function handOver(k){const i=OUT_K.indexOf(k);const nx=OUT_K[i+1];const A=AGENTS[k],B=nx?AGENTS[nx]:null;
  const lines=nx?[[k,'That is '+STAGE_L(k).toLowerCase()+' done. '+B.n+', over to you.'],[nx,{give:'On it. I will build something worth opening.',reach:'Lovely. I will pace it so nobody feels chased.',launch:'Fuelled up. Every message ready for your say-so.'}[nx]]]:[[k,'We are live. I will tell you the moment someone leans in.']];
  let el=$('#hand18');if(el)el.remove();el=document.createElement('div');el.id='hand18';el.className='hand18';el.setAttribute('role','status');
  el.innerHTML='<div class="h18-faces">'+agentFace(k,44,{badge:false})+(nx?'<i class="h18-arc"></i>'+agentFace(nx,44,{badge:false}):'')+'</div><div class="h18-chat">'+lines.map((l,j)=>'<p style="--d:'+(0.3+j*1.1)+'s"><b>'+esc(AGENTS[l[0]].n)+'</b>'+esc(l[1])+'</p>').join('')+'</div>'+
    (nx?'<button class="btn btn-primary btn-sm" onclick="this.closest(\'.hand18\').remove();go(\''+nx+'\')">Next: '+esc(STAGE_L(nx))+ico('arrow','a')+'</button>':'')+'<button class="icon-btn h18-x" onclick="this.closest(\'.hand18\').remove()" aria-label="Close">'+ico('x')+'</button>';
  document.body.appendChild(el);buzz&&buzz();setTimeout(()=>{if(el.isConnected)el.classList.add('out');setTimeout(()=>el.remove(),500)},9000)}
(function(){const _sv=save;save=function(){const r=_sv.apply(this,arguments);try{clearTimeout(handCheck.t);handCheck.t=setTimeout(handCheck,250)}catch(e){}return r}})();
setTimeout(()=>{try{HAND18=handSnap()}catch(e){}},1500);

/* ── 3. calmer by default ───────────────────────────────────── */
/* the coach starts folded into a small pill; open it when you want it */
(function(){const _cr=coachRender;coachRender=function(){try{if(S&&S.coach&&!S.coach.v18){S.coach.min=1;S.coach.v18=1}}catch(e){}return _cr.apply(this,arguments)}})();
/* toasts without the emoji confetti */
(function(){const _t=toast;toast=function(m){if(typeof m==='string')m=m.replace(/^\s*(?:[☀-➿]|[\uD83C-\uDBFF][\uDC00-\uDFFF])[️‍]*(?:[\uD83C-\uDBFF][\uDC00-\uDFFF][️]?)*\s*/,'');return _t.apply(this,[m].concat([].slice.call(arguments,1)))}})();
/* performance lives inside Campaigns now */
(function(){const _vp=VIEWS.perf;VIEWS.perf=function(id){const c=id&&S.campaigns.find(x=>x.id===id);if(!c){const r=realCampList();const live=r.find(campLive)||r[0];if(live)return _vp(live.id)}return _vp(id)}})();
