/* ═══════════ BOOT ═══════════ */
let SEEN=null;
function launch(){applyTheme();renderShell();const h=(location.hash||'').slice(1);go(S.setup.viewMode==='dot'?'dot':on(h)&&h!=='admin'?h:'home');mountDot();refreshMode();
  requestAnimationFrame(()=>$('#app').classList.add('ready'));SEEN=S.lastSeen||isoDaysAgo(1);loadInsights();intelLoad();setTimeout(pullClicks,2500);ampCheck().then(()=>{if(VIEW==='launch'||VIEW==='prospects')go(VIEW,VIEW_ARG,true)});
  setTimeout(()=>{const fired=checkIntent(true);S.lastSeen=today();save();
    if(!fired&&S.setup.demo&&!S.notifications.length){const top=ranked()[0];if(top&&top.s.score>0)notify({kind:'heat',ic:'🔥',accountId:top.a.id,title:top.a.name+' is '+top.s.label.toLowerCase(),body:whyLine(top.a,top.s),noToast:true})}},1400)}
function startDemo(){SESSION={email:'demo@scopeandlens.demo',name:'Sam',role:'member',token:null,preview:true,demo:true};try{localStorage.setItem('sl-session',JSON.stringify(SESSION))}catch(e){}
  setUserKeys(SESSION.email);S=demoState();S.walked=true;save();const el=$('#login');if(el){el.classList.add('out');setTimeout(()=>el.remove(),500)}launch();setTimeout(()=>startTour(),1200)}
(function boot(){let seen=false;try{seen=sessionStorage.getItem('sl_intro')==='1';sessionStorage.setItem('sl_intro','1')}catch(e){}
  const next=()=>{if(HOSTED){hostedBoot();return}if(restoreSession())enterApp();else showLogin()};
  if(seen)next();else playLoader(next)})();
