/* ═══════════ v13: CHAT WITH PLATO ═══════════
   "Chat" in the top bar, the full view lives at #plato, and conversations are kept as separate chats:
   start a new one or carry on, and only the latest few messages show until you ask for more. */
PAGES.push('plato');ALIAS.plato=['dot'];
const _go13=go;go=function(k,arg,quiet){_go13(k,arg,quiet);if(VIEW==='dot'){try{history.replaceState(null,'','#plato')}catch(e){}}};
vmodeHTML=function(){const d=S&&S.setup.viewMode==='dot';return '<button class="'+(d?'':'on')+'" onclick="setViewMode(\'dash\')" data-tip="Dashboard view">'+ico('grid')+'<span>Dashboard</span></button><button class="'+(d?'on':'')+'" onclick="setViewMode(\'dot\')" data-tip="Chat with Plato, full screen"><img class="vm-pl" src="'+IMG12.plato_face+'" alt=""><span>Chat</span></button>'};
const PL_SHOW=6;
function platoMsgEl(x){const m=document.createElement('div');m.className='pmsg '+(x.me?'me':'bot');m.innerHTML=(x.me?'':'<span class="pm-av"><img src="'+IMG12.plato_face+'" alt=""></span>')+'<div class="pm-t">'+x.h+'</div>';return m}
/* draw the current chat into a log: the last few messages, with the rest behind a button */
function platoDraw(l,all){if(!l)return;l.innerHTML='';const L=S.platoLog||[];const from=all?0:Math.max(0,L.length-PL_SHOW);
  if(from>0){const b=document.createElement('button');b.className='pl-more';b.textContent='Show '+from+' earlier message'+(from===1?'':'s');b.onclick=()=>{platoDraw(l,true)};l.appendChild(b)}
  L.slice(from).forEach(x=>l.appendChild(platoMsgEl(x)));l.scrollTop=all?0:l.scrollHeight}
platoRestore=function(){const l=$('#plLog');if(!l)return;platoDraw(l);if((S.platoLog||[]).length)platoSugg(platoStarters())};
function platoChatTitle(L){const m=(L||[]).find(x=>x.me);return m?m.h.replace(/<[^>]+>/g,'').slice(0,60):'Chat'}
/* start a fresh chat; the old one is kept under Earlier chats */
function platoNew(){const L=S.platoLog||[];if(L.some(x=>x.me)){S.platoHist=[{id:uid(),title:platoChatTitle(L),at:new Date().toISOString(),log:L}].concat(S.platoHist||[]).slice(0,20)}
  S.platoLog=[];if(!DEMO_MODE)save();[$('#plLog'),$('#plFull')].forEach(l=>{if(l)l.innerHTML=''});platoGreet();platoHistClose();platoHistRender()}
function platoResume(id){const H=S.platoHist||[];const i=H.findIndex(h=>h.id===id);if(i<0)return;const L=S.platoLog||[];const rest=H.filter(h=>h.id!==id);
  if(L.some(x=>x.me))rest.unshift({id:uid(),title:platoChatTitle(L),at:new Date().toISOString(),log:L});S.platoHist=rest.slice(0,20);S.platoLog=H[i].log;if(!DEMO_MODE)save();
  [$('#plLog'),$('#plFull')].forEach(l=>platoDraw(l));platoHistClose();platoHistRender();platoSugg(platoStarters())}
function platoDelHist(id,e){if(e)e.stopPropagation();S.platoHist=(S.platoHist||[]).filter(h=>h.id!==id);if(!DEMO_MODE)save();platoHistRender()}
function platoHistHTML(){const H=S.platoHist||[];const cur=(S.platoLog||[]).some(x=>x.me);
  return '<div class="plh-h"><b>Your chats</b><button class="btn btn-primary btn-xs" onclick="platoNew()">'+ico('plus')+'New chat</button></div>'+
    (cur?'<div class="plh-i on"><span class="grow"><b>'+esc(platoChatTitle(S.platoLog))+'</b><small>Current chat</small></span></div>':'')+
    (H.length?H.map(h=>'<div class="plh-i" role="button" tabindex="0" onclick="platoResume(\''+h.id+'\')"><span class="grow"><b>'+esc(h.title)+'</b><small>'+rel(h.at)+' · '+h.log.length+' messages</small></span><button class="icon-btn" aria-label="Delete this chat" onclick="platoDelHist(\''+h.id+'\',event)">'+ico('x')+'</button></div>').join(''):'<p class="tiny muted" style="padding:8px 4px">Earlier chats appear here when you start a new one.</p>')}
function platoHistRender(){$$('.plh').forEach(el=>el.innerHTML=platoHistHTML())}
function platoHistToggle(){const p=$('#platoPanel .plh');if(!p)return;p.classList.toggle('on');platoHistRender()}
function platoHistClose(){const p=$('#platoPanel .plh');if(p)p.classList.remove('on')}
const _mountDot13=mountDot;mountDot=function(){_mountDot13();const h=$('#platoPanel .pl-h');if(!h)return;
  const x=h.querySelector('[aria-label="Open Plato view"]');
  const tools=document.createElement('span');tools.className='pl-tools';tools.innerHTML='<button class="icon-btn" onclick="platoNew()" aria-label="New chat" data-tip="New chat">'+ico('plus')+'</button><button class="icon-btn" onclick="platoHistToggle()" aria-label="Your chats" data-tip="Your chats">'+ico('clock')+'</button>';
  h.insertBefore(tools,x);const pnl=$('#platoPanel');const hist=document.createElement('div');hist.className='plh';pnl.insertBefore(hist,$('#plLog'));
  const d=$('#plato');if(d){d.setAttribute('aria-label','Chat with Plato');d.setAttribute('data-tip','Chat with Plato')}};
/* the full Plato view: chats on the left, the current chat on the right */
const _vDot13=VIEWS.dot;VIEWS.dot=function(){return String(_vDot13()).replace('<div class="plv-r">','<div class="plv-r"><div class="plv-bar"><b>'+esc((S.platoLog||[]).some(x=>x.me)?platoChatTitle(S.platoLog):'New chat')+'</b><span class="row" style="gap:6px"><button class="btn btn-line btn-xs" onclick="platoFullHist()">'+ico('clock')+'Your chats'+((S.platoHist||[]).length?' ('+S.platoHist.length+')':'')+'</button><button class="btn btn-primary btn-xs" onclick="platoNew();go(\'dot\',null,true)">'+ico('plus')+'New chat</button></span></div><div class="plh plh-full"></div>')};
function platoFullHist(){const p=$('.plh-full');if(!p)return;p.classList.toggle('on');platoHistRender()}
const _dotAfter13=VIEWS.dot_after;VIEWS.dot_after=function(){if(_dotAfter13)_dotAfter13.apply(this,arguments);const l=$('#plFull');if(l){platoDraw(l);if(!l.querySelector('.pmsg'))platoGreet()}};
