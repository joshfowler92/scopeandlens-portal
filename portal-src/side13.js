/* ═══════════ v13: THE SIDEBAR ═══════════
   Clear areas: Home, Campaigns and Your Insights at the top; your campaign and its four steps; Results; Help.
   Each area folds away. Tactile buttons, a sliding marker on the page you are on, and a live pulse when a
   campaign is running. Tooltips float above everything, so nothing gets cut off when the sidebar is collapsed. */
Object.assign(IC,{chev:'<path d="m6 9 6 6 6-6"/>',inbox:'<path d="M3 13h5l1.5 3h5L16 13h5"/><path d="M5 5h14l2 8v6H3v-6z"/>',draft:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13 7 4 4"/>',
  lock:IC.lock||'<rect x="5" y="11" width="14" height="10" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',sparkle:IC.sparkle||'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>'});
SIDE_IC.insights='bulb';SIDE_IC.guides='guide';SIDE_IC.perf='chart';
function grpOpen(k){try{const v=localStorage.getItem('pp_g_'+k);return v==null?k!=='help':v!=='0'}catch(e){return k!=='help'}}
function grpToggle(k){const el=$('#sdg-'+k);if(!el)return;const open=!el.classList.contains('open');el.classList.toggle('open',open);el.querySelector('.sdg-h').setAttribute('aria-expanded',open);try{localStorage.setItem('pp_g_'+k,open?'1':'0')}catch(e){}}
function sdGroup(k,label,body,extra){const o=grpOpen(k);return '<div class="sdg'+(o?' open':'')+'" id="sdg-'+k+'"><button class="sdg-h" onclick="grpToggle(\''+k+'\')" aria-expanded="'+o+'" aria-controls="sdgb-'+k+'"><span>'+label+'</span>'+(extra||'')+ico('chev','sdg-c')+'</button><div class="sdg-b" id="sdgb-'+k+'"><div>'+body+'</div></div></div>'}
/* what the campaign group says about the campaign: building, live (with the week), paused or finished */
function campStateLabel(c){if(!c||(isBlankCamp(c)&&!c.touched))return['Your campaign','No campaign yet',''];const st=campStatus(c);const w=campWk(c);
  if(st[0]==='Live')return['Live now','Week '+w.n+' of '+w.W,'live'];if(st[0]==='Paused')return['Paused','Week '+w.n+' of '+w.W,'paused'];if(st[0]==='Finished')return['Finished',w.W+' weeks done','done'];
  const done=OUT_K.filter(k=>campStepState(c,k)===2).length;return['Building now',done+' of 4 steps done','build']}
navHTML=function(){const st=sysStats();const c=curCamp();const gate=!profReady();const L=campStateLabel(c);
  const step=k=>{const A=AGENTS[k];const m=MODULES.find(x=>x.k===k);const s=campStepState(c,k);
    return '<button class="sd-a'+(VIEW===k?' on':'')+(s===2?' dn':s===1?' half':'')+(gate?' lock':'')+'" data-nav="'+k+'" id="nav-'+k+'" data-tip="'+esc(m.l+' with '+A.n)+'">'+agentFace(k,28,{badge:false})+'<span class="sd-t"><b>'+esc(m.l)+'</b><small>'+esc(gate?'After your agency profile':A.n+' · '+campStepSub(c,k))+'</small></span><span class="sd-st">'+(gate?ico('lock'):s===2?ico('check'):'<i>'+m.n+'</i>')+'</span></button>'};
  const real=c&&!(isBlankCamp(c)&&!c.touched);
  const campBody='<div class="sd-cc '+L[2]+'">'+(real?'<button class="sd-camp" onclick="pickCamp(event)" data-tip="Switch campaign"><span class="sd-cn">'+esc(c.name)+'</span>'+ico('chev')+'</button>':'<b class="sd-camp">No campaign yet</b>')+'<small class="sd-cs">'+(L[2]==='live'?'<i class="sd-live"></i>':'')+esc(L[1])+'</small></div><div class="sd-steps">'+OUT_K.map(step).join('')+'</div>';
  return '<div class="sd-top3">'+sideItem('home','Home')+sideItem('camps','Campaigns',null,S.campaigns.filter(x=>!(isBlankCamp(x)&&!x.touched)).length||'')+sideItem('insights','Your Insights',null,st.insights&&st.insights.badge)+'</div>'+
    sdGroup('camp',L[0],campBody)+
    sdGroup('res','Results',sideItem('perf','Campaign performance')+sideItem('signals','Signals & Intent',null,st.signals&&st.signals.badge)+sideItem('pipeline','Pipeline'))+
    sdGroup('help','Help',sideItem('guides','Guides')+'<button class="sd-i" onclick="startWalk(true)" data-tip="Replay the walkthrough">'+ico('play')+'<span class="sd-t"><b>Replay the walkthrough</b></span></button><button class="sd-i" onclick="startTour()" data-tip="Show me around this portal">'+ico('eye')+'<span class="sd-t"><b>Show me around this portal</b></span></button>')};
/* a sliding marker behind the page you are on */
let SDM=null;
function sdMarker(){const nav=$('#nav');if(!nav)return;let m=nav.querySelector('.sd-mark');const fresh=!m;if(fresh){m=document.createElement('i');m.className='sd-mark';nav.prepend(m)}
  const on=nav.querySelector('.sd-i.on,.sd-a.on');if(!on||on.offsetParent===null||on.closest('.sdg:not(.open)')){m.style.opacity=0;return}
  const r=on.getBoundingClientRect(),n=nav.getBoundingClientRect();const y=r.top-n.top+nav.scrollTop,h=r.height,x=r.left-n.left,w=r.width;
  if(fresh&&SDM){m.style.transition='none';m.style.transform='translate('+SDM.x+'px,'+SDM.y+'px)';m.style.height=SDM.h+'px';m.style.width=SDM.w+'px';m.offsetWidth;m.style.transition=''}
  m.style.opacity=1;m.style.transform='translate('+x+'px,'+y+'px)';m.style.height=h+'px';m.style.width=w+'px';SDM={x,y,h,w}}
const _refreshNav13=refreshNav;refreshNav=function(){_refreshNav13.apply(this,arguments);requestAnimationFrame(sdMarker)};
document.addEventListener('transitionend',e=>{if(e.target&&e.target.classList&&e.target.classList.contains('sdg-b'))sdMarker()},true);
addEventListener('resize',()=>requestAnimationFrame(sdMarker));
/* floating tooltips: drawn on top of the page, so the collapsed sidebar can never cut them off */
(function(){let tip=null,cur=null;const show=el=>{const t=el.getAttribute('data-tip');if(!t)return;if(!tip){tip=document.createElement('div');tip.className='ftip';tip.setAttribute('role','tooltip');document.body.appendChild(tip)}
  tip.textContent=t;const r=el.getBoundingClientRect();const mini=$('#side')&&$('#side').getBoundingClientRect().width<120;
  if(el.closest('.side')){tip.style.left=(r.right+10)+'px';tip.style.top=(r.top+r.height/2)+'px';tip.className='ftip r on'}else{tip.style.left=(r.left+r.width/2)+'px';tip.style.top=(r.bottom+8)+'px';tip.className='ftip b on'}
  if(el.closest('.side')&&!mini&&!el.classList.contains('sd-camp')&&!el.closest('.sd-a.lock'))tip.className='ftip';cur=el};
  const hide=()=>{if(tip)tip.className='ftip';cur=null};
  document.addEventListener('mouseover',e=>{const el=e.target.closest&&e.target.closest('.side [data-tip]');if(el&&el!==cur)show(el);else if(!el&&cur)hide()});
  document.addEventListener('focusin',e=>{const el=e.target.closest&&e.target.closest('.side [data-tip]');if(el)show(el)});
  document.addEventListener('focusout',hide);document.addEventListener('scroll',hide,true);document.addEventListener('click',hide,true)})();
