/* ═══════════ v13.1: THE PORTAL AS A MOBILE APP ═══════════
   On a phone (or a narrow window) the sidebar becomes a bottom tab bar: Home, Campaign, Plato in the middle,
   Results and More. Campaign and More open as bottom sheets you can drag down to close. Results pages share a
   switcher at the top. Plato opens full screen. Everything is sized for thumbs and respects the phone's safe areas. */
const MQ=matchMedia('(max-width:900px)');
const isApp=()=>MQ.matches;
const TABS=[['home','Home','home'],['camp','Campaign','layers'],['plato','Plato',''],['res','Results','pulse'],['more','More','grid']];
const TAB_OF={home:'home',prospects:'camp',give:'camp',reach:'camp',launch:'camp',camps:'camp',signals:'res',perf:'res',pipeline:'res',insights:'more',guides:'more',team:'more',agency:'more',settings:'more',admin:'more',dot:'plato'};
function buzz(){try{navigator.vibrate&&navigator.vibrate(6)}catch(e){}}
function tabbarHTML(){const st=sysStats();const cur=TAB_OF[VIEW]||'more';const badge=(st.signals&&st.signals.badge)||'';
  return TABS.map(([k,l,ic])=>k==='plato'?'<button class="tb-pl'+(cur==='plato'||(typeof platoOpen!=='undefined'&&platoOpen)?' on':'')+'" onclick="tabGo(\'plato\')" aria-label="Ask Plato"><span class="tb-plr">'+platoFace(46)+'</span><small>Ask Plato</small></button>':
    '<button class="tb-i'+(cur===k?' on':'')+'" onclick="tabGo(\''+k+'\')" aria-label="'+l+'"'+(cur===k?' aria-current="page"':'')+'>'+ico(ic)+(k==='res'&&badge?'<i class="tb-b">'+badge+'</i>':'')+'<small>'+l+'</small></button>').join('')}
function mountTabbar(){let t=$('#tabbar');if(!t){t=document.createElement('nav');t.id='tabbar';t.className='tabbar';t.setAttribute('aria-label','Main');document.body.appendChild(t)}t.innerHTML=tabbarHTML()}
function tabGo(k){buzz();closeSheet();if(k==='home')go('home');else if(k==='res')go(['signals','perf','pipeline'].includes(VIEW)?VIEW:'signals');else if(k==='plato'){if(platoOpen)closeDot();else openDot();mountTabbar()}else if(k==='camp')campSheet();else if(k==='more')moreSheet()}
/* bottom sheets: a grabber, slide up, drag down (or tap outside) to close */
function sheet(html,cls){closeOverlays(true);closeDot();let s=$('#msheet');if(!s){s=document.createElement('div');s.id='msheet';s.className='msheet';s.setAttribute('role','dialog');s.setAttribute('aria-modal','true');document.body.appendChild(s)}
  s.className='msheet '+(cls||'');s.innerHTML='<div class="ms-grab" aria-hidden="true"><i></i></div><div class="ms-b">'+html+'</div>';$('#scrim').classList.add('on');requestAnimationFrame(()=>s.classList.add('on'));
  let y0=null,dy=0;const g=s.querySelector('.ms-grab');const b=s.querySelector('.ms-b');
  const start=e=>{if(e.target.closest('.ms-b')&&b.scrollTop>0)return;y0=e.touches[0].clientY;dy=0;s.style.transition='none'};
  const move=e=>{if(y0==null)return;dy=Math.max(0,e.touches[0].clientY-y0);if(dy>0){s.style.transform='translateY('+dy+'px)';e.cancelable&&e.preventDefault()}};
  const end=()=>{if(y0==null)return;s.style.transition='';s.style.transform='';if(dy>90)closeSheet();y0=null};
  [g,b].forEach(el=>{el.addEventListener('touchstart',start,{passive:true});el.addEventListener('touchmove',move,{passive:false});el.addEventListener('touchend',end)})}
function closeSheet(){const s=$('#msheet');if(s&&s.classList.contains('on')){s.classList.remove('on');if(!$('#modal.on')&&!$('#drawer.on'))$('#scrim').classList.remove('on')}}
const _closeOverlays131=closeOverlays;closeOverlays=function(k){closeSheet();return _closeOverlays131(k)};
/* the Campaign sheet: the campaign you are on, its four steps, and a way to switch or start another */
function campSheet(){const c=curCamp();const real=c&&!(isBlankCamp(c)&&!c.touched);const L=campStateLabel(c);const C=S.campaigns.filter(x=>!(isBlankCamp(x)&&!x.touched));
  sheet('<div class="ms-h"><small>'+esc(L[0])+'</small><h2>'+(real?esc(c.name):'No campaign yet')+'</h2><span class="ms-st '+L[2]+'">'+(L[2]==='live'?'<i class="sd-live"></i>':'')+esc(L[1])+'</span></div>'+
    '<div class="ms-steps">'+OUT_K.map((k,i)=>{const A=AGENTS[k];const m=MODULES.find(x=>x.k===k);const s=campStepState(c,k);const lock=!profReady()&&!DEMO_MODE;
      return '<button class="ms-step'+(s===2?' dn':'')+(VIEW===k?' on':'')+'" onclick="'+(lock?"go('agency')":"go('"+k+"')")+';closeSheet()">'+agentFace(k,44,{badge:false})+'<span class="grow"><small>Step '+(i+1)+' · '+esc(A.n)+'</small><b>'+esc(m.l)+'</b><em>'+esc(lock?'After your agency profile':campStepSub(c,k))+'</em></span><span class="ms-ck">'+(lock?ico('lock'):s===2?ico('check'):ico('arrow'))+'</span></button>'}).join('')+'</div>'+
    (C.length>1?'<div class="ms-lab">Your campaigns</div><div class="ms-camps">'+C.map(x=>{const st=campStatus(x);return '<button class="ms-camp'+(x.id===S.cur?' on':'')+'" onclick="S.cur=\''+x.id+'\';save();refreshNav();campSheet()"><b>'+esc(x.name)+'</b><small><i class="dot '+st[1]+'"></i>'+st[0]+'</small></button>'}).join('')+'</div>':'')+
    '<div class="ms-row"><button class="btn btn-primary" onclick="closeSheet();newCampaignFlow()">'+ico('plus')+'New campaign</button><button class="btn btn-line" onclick="closeSheet();go(\'camps\')">'+ico('layers')+'All campaigns</button></div>')}
/* the More sheet: everything else, as big tiles */
function moreSheet(){const adm=SESSION&&SESSION.role==='admin';const T=[['insights','bulb','Your Insights'],['perf','chart','Campaign performance'],['pipeline','pound','Pipeline'],['team','people','Team'],['agency','star','Agency profile'],['guides','guide','Guides']].concat(adm?[['admin','lock','Manage access']]:[]).concat([['settings','settings','Settings']]);
  sheet('<div class="ms-h"><small>Menu</small><h2>Everything else</h2></div><div class="ms-grid">'+T.map(([k,ic,l])=>'<button class="ms-t'+(VIEW===k?' on':'')+'" onclick="closeSheet();go(\''+k+'\')"><span>'+ico(ic)+'</span><b>'+l+'</b></button>').join('')+'</div>'+
    '<div class="ms-lab">Help</div><div class="ms-list"><button onclick="closeSheet();startWalk(true)">'+ico('play')+'<span>Replay the walkthrough</span>'+ico('arrow','a')+'</button><button onclick="closeSheet();startTour()">'+ico('eye')+'<span>Show me around Plato</span>'+ico('arrow','a')+'</button><button onclick="toggleMode();moreSheet()">'+ico('moon')+'<span>Light or dark</span>'+ico('arrow','a')+'</button></div>')}
/* results pages share a switcher at the top */
function resSwitch(){if(!isApp())return '';const R=[['signals','Intent'],['perf','Performance'],['pipeline','Pipeline']];return '<div class="rsw" role="tablist">'+R.map(([k,l])=>'<button role="tab" aria-selected="'+(VIEW===k)+'" class="'+(VIEW===k?'on':'')+'" onclick="buzz();go(\''+k+'\')">'+l+'</button>').join('')+'</div>'}
['signals','perf','pipeline'].forEach(k=>{const v=VIEWS[k];VIEWS[k]=function(){return resSwitch()+v.apply(this,arguments)}});
/* the four steps get a compact progress strip at the top on a phone */
function stepStrip(){if(!isApp())return '';const c=curCamp();const real=c&&!(isBlankCamp(c)&&!c.touched);return '<div class="sstrip">'+(real?'<button class="ss-n" onclick="campSheet()">'+esc(c.name)+' · switch</button>':'')+OUT_K.map((k,i)=>{const s=campStepState(c,k);return '<button class="'+(VIEW===k?'on ':'')+(s===2?'dn':'')+'" onclick="buzz();go(\''+k+'\')">'+agentFace(k,26,{badge:false})+'<small>'+(i+1)+'. '+esc(MODULES.find(x=>x.k===k).l.replace('Who to target','Who').replace('What to share','What').replace('How to reach','How'))+'</small></button>'}).join('<i></i>')+'</div>'}
OUT_K.forEach(k=>{const v=VIEWS[k];VIEWS[k]=function(){return stepStrip()+v.apply(this,arguments)}});
/* keep the tab bar in step with the page, Plato and the demo */
const _go131=go;go=function(){const r=_go131.apply(this,arguments);if(isApp())mountTabbar();return r};
const _openDot131=openDot;openDot=function(){closeSheet();_openDot131.apply(this,arguments);document.body.classList.add('pl-on');if(isApp())mountTabbar()};
const _closeDot131=closeDot;closeDot=function(){_closeDot131.apply(this,arguments);document.body.classList.remove('pl-on');if(isApp()&&$('#tabbar'))mountTabbar()};
const _renderShell131=renderShell;renderShell=function(){_renderShell131.apply(this,arguments);if(isApp())mountTabbar()};
const _refreshNav131=refreshNav;refreshNav=function(){_refreshNav131.apply(this,arguments);if(isApp()&&$('#tabbar'))mountTabbar()};
MQ.addEventListener&&MQ.addEventListener('change',()=>{if(isApp())mountTabbar();else{const t=$('#tabbar');if(t)t.remove();closeSheet()}if(typeof VIEW!=='undefined'&&S)go(VIEW,VIEW_ARG,true)});
/* the phone's own chrome: brand colour in the status bar, edge to edge, and add to home screen */
(function(){const set=(n,c,attr)=>{let m=document.querySelector('meta['+(attr||'name')+'="'+n+'"]');if(!m){m=document.createElement('meta');m.setAttribute(attr||'name',n);document.head.appendChild(m)}m.setAttribute('content',c)};
  set('viewport','width=device-width, initial-scale=1, viewport-fit=cover');set('theme-color','#F0EEE9');set('apple-mobile-web-app-capable','yes');set('mobile-web-app-capable','yes');set('apple-mobile-web-app-status-bar-style','default');set('apple-mobile-web-app-title','Portal');
  if(!document.querySelector('link[rel="manifest"]')&&location.protocol!=='file:'){const l=document.createElement('link');l.rel='manifest';l.href='manifest.webmanifest';document.head.appendChild(l)}})();
