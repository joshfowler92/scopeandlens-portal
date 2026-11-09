/* ═══════════ SHELL: icons, layout, router, overlays, undo ═══════════ */
const IC={
  home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  pipeline:'<rect x="3" y="4" width="5" height="16"/><rect x="10" y="4" width="5" height="11"/><rect x="17" y="4" width="4" height="7"/>',
  reports:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 17v-3M12 17v-6M16 17v-2"/>',
  amp:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3.5 14H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.1-2.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 9.7 3.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
  guide:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  bell:'<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  x:'<path d="M18 6L6 18M6 6l12 12"/>',
  menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
  moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  play:'<path d="M6 4l14 8-14 8z"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
  undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  edit:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  file:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
  check:'<path d="M20 6L9 17l-5-5"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  copy:'<rect x="9" y="9" width="12" height="12"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>',
  magnify:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="M21 21l-5.6-5.6M10.5 7.5v6M7.5 10.5h6"/>',
  send:'<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
  chart:'<path d="M3 21h18M6 17V11M11 17V6M16 17v-4M21 17V8"/>',
  loop:'<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
  pulse:'<path d="M3 12h4l2-6 4 12 2-6h6"/>',
  chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z"/>',
  pound:'<path d="M17 6.5A4 4 0 0 0 9.5 8V12M6 12h9M7 20h11M9.5 12c0 3-1 5.5-3 8"/>',
  mail:'<rect x="3" y="5" width="18" height="14"/><path d="M3 6l9 7 9-7"/>',
  linkedin:'<rect x="3" y="3" width="18" height="18"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>',
  megaphone:'<path d="M3 11v3l12 5V6L3 11zM15 9h3a3 3 0 0 1 0 6h-3M6 14l1.5 6h3L9 15"/>',
  doc:'<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
  calendar:'<rect x="3" y="5" width="18" height="16"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  crown:'<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>',
  star:'<path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.3L12 17.5 6.5 20.4l1-6.3L3 9.7l6.2-.9z"/>',
  people:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a5 5 0 0 1 3.5 6"/>',
  bridge:'<path d="M2 18h20M4 18V10M20 18V10M4 10c3 0 5 3 8 3s5-3 8-3M12 13v5"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  rocket:'<path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.1 2.1 0 0 0-2.9-.1z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 0 1-4 2z"/><path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/>',
  trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
  swipe:'<path d="M9 11V6a2 2 0 0 1 4 0v4"/><path d="M13 10a2 2 0 0 1 4 0v1a2 2 0 0 1 4 0v4a6 6 0 0 1-6 6h-2a6 6 0 0 1-5-2.7L5 15a2 2 0 0 1 3.3-2.3L9 14"/><path d="M3 5h3M3 5l1.5-1.5M3 5l1.5 1.5M21 5h-3M21 5l-1.5-1.5M21 5l-1.5 1.5"/>',
  dice:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.2" fill="currentColor"/><circle cx="16" cy="16" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="16" cy="8" r="1.2" fill="currentColor"/><circle cx="8" cy="16" r="1.2" fill="currentColor"/>',
  phone:'<path d="M5 3h4l2 5-3 2a11 11 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
  layers:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  external:'<path d="M14 3h7v7M21 3l-9 9M19 14v7H3V5h7"/>',
  flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  gift:'<path d="M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z"/>',
  heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>'
};
const ico=(k,cls)=>'<svg class="'+(cls||'')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="square" stroke-linejoin="miter">'+(IC[k]||'')+'</svg>';
/* the Scope & Lens mark: filled circle, open circle, half circle */
const SL_MARK=(c,sw)=>'<svg viewBox="0 0 60 130" aria-hidden="true"><circle cx="30" cy="16" r="14" fill="'+c+'"/><circle cx="30" cy="62" r="14" fill="none" stroke="'+c+'" stroke-width="'+(sw||2.4)+'"/><path d="M16 122a14 14 0 0 1 28 0" fill="none" stroke="'+c+'" stroke-width="'+(sw||2.4)+'"/></svg>';
const BLOBS='<div class="blobs"><i></i><i></i><i></i><b></b><b></b></div>';

let VIEW='today',VIEW_ARG=null;
function on(k){const m=MODULES.find(x=>x.k===k);if(!m)return PAGES.includes(k);return m.lock||S.setup.modules[k]!==false}
function modT(k){const m=MODULES.find(x=>x.k===k);return m?m.t:k==='settings'?'Settings':''}

function renderShell(){
  const unread=S.notifications.filter(n=>!n.read).length;const u=SESSION||{};
  $('#app').innerHTML=
  '<header class="tnav"><div class="tn-in">'+
    '<button class="tn-brand" onclick="go(\'home\')" aria-label="Home"><span class="tn-mark">'+SL_MARK('currentColor',3)+'</span><span class="tn-word">'+(S.brand.logo?'<img src="'+S.brand.logo+'" alt="">':'<b>'+esc(S.setup.agency||'Your agency')+'</b>')+'<small>Growth portal</small></span></button>'+
    '<nav class="tn-links" id="nav" aria-label="Sections">'+navHTML()+'</nav>'+
    '<div class="tn-r"><div class="vmode" id="vmode" role="tablist" aria-label="View">'+vmodeHTML()+'</div>'+
      '<button class="icon-btn tip-b" onclick="openCmdk()" data-tip="Search">'+ico('search')+'</button>'+
      '<button class="icon-btn tip-b hide-m" onclick="toggleMode()" data-tip="Light or dark">'+ico('moon')+'</button>'+
      '<button class="icon-btn tip-b tip-l" id="bellBtn" onclick="toggleBell()" data-tip="Alerts">'+ico('bell')+(unread?'<span class="badge-dot">'+unread+'</span>':'')+'</button>'+
      '<button class="avatar" id="avBtn" onclick="toggleUserMenu(event)" aria-label="Your account">'+esc(initials(S.setup.you||u.name||S.setup.agency||'You'))+'</button>'+
    '</div></div></header>'+
  (S.setup.demo?'<div class="demo-rib">You are looking at the demo. Every brand, name and number here is invented. <button onclick="leaveDemo()">Start my own workspace</button></div>':'')+
  '<main class="main"><section class="view" id="view"></section>'+
    '<footer class="pfoot2"><span class="mk">'+SL_MARK('currentColor',3)+'</span><span>Permissionless Portal by <b>Scope &amp; Lens</b></span><a href="mailto:josh@scopeandlens.com">Get in touch</a></footer></main>'+
  '<div class="umenu" id="umenu"></div>';
  bindNav();renderUndo();
}
function navHTML(){const st=sysStats();const b=m=>{const x=st[m.k]&&st[m.k].badge;const dn=st[m.k]&&st[m.k].done;
    return '<button class="tn-l'+(VIEW===m.k?' on':'')+(m.n?' step':'')+(m.k==='launch'?' rocket':'')+(dn?' dn':'')+'" data-nav="'+m.k+'" id="nav-'+m.k+'"'+(m.n?' data-tip="'+esc(m.q||'')+'"':'')+'>'+(m.k==='launch'?'<span class="tn-n">🚀</span>':m.n?'<span class="tn-n">'+m.n+'</span>':m.k==='home'?ico('home','tn-hi'):'')+'<b class="lf">'+m.l+'</b>'+(m.ls?'<b class="ls">'+m.ls+'</b>':'')+(x?'<i>'+x+'</i>':'')+'</button>'};
  const M=k=>MODULES.find(x=>x.k===k);const grp=VIEW==='home'||VIEW==='dot'?'':['prospects','give','reach','launch'].includes(VIEW)?'out':['signals','pipeline','team','insights'].includes(VIEW)?'res':'';
  return b(M('home'))+b(M('agency'))+
    '<div class="tn-g'+(grp==='out'?' act':'')+'"><span class="tn-gl">Outreach</span>'+['prospects','give','reach'].map(k=>b(M(k))+'<i class="tn-ar"></i>').join('')+b(M('launch'))+'</div>'+
    '<div class="tn-g'+(grp==='res'?' act':'')+'"><span class="tn-gl">Results</span>'+['signals','pipeline','team','insights'].map(k=>b(M(k))).join('')+'</div>'}
function bindNav(){$$('[data-nav]').forEach(b=>b.onclick=()=>{if(S.setup.viewMode==='dot'){S.setup.viewMode='dash';save();refreshMode()}go(b.dataset.nav)})}
function refreshNav(){const n=$('#nav');if(!n)return;const x=n.scrollLeft;n.innerHTML=navHTML();n.scrollLeft=x;bindNav();const on=n.querySelector('.on');if(on&&innerWidth<900)on.scrollIntoView({inline:'center',block:'nearest'})}
function toggleUserMenu(e){if(e)e.stopPropagation();const m=$('#umenu');if(m.classList.contains('on')){m.classList.remove('on');return}const u=SESSION||{};const adm=u.role==='admin';
  m.innerHTML='<div class="um-h"><b>'+esc(S.setup.you||u.name||'You')+'</b><small>'+esc(u.email||'')+'</small>'+(adm?'<span class="pill">Scope &amp; Lens admin</span>':'')+'</div>'+
    [['trophy','Your progress',"openGame()"],['upload','Agency profile',"go('agency')"],['settings','Settings',"go('settings')"],['play','How it works',"startWalk(true)"],['help','Show me around',"startTour()"]].concat(adm?[['edit','Publish an insight',"go('insights');setTimeout(()=>openPublish(),300)"],['people','Manage access',"go('admin')"]]:[]).concat([['arrow','Log out',"logout()"]]).map(x=>'<button onclick="$(\'#umenu\').classList.remove(\'on\');'+x[2]+'">'+ico(x[0])+x[1]+'</button>').join('');
  m.classList.add('on')}
document.addEventListener('click',e=>{const m=$('#umenu');if(m&&m.classList.contains('on')&&!m.contains(e.target))m.classList.remove('on')});
/* logos: the brand's own icon from its website, or a clean monogram */
function hue(n){let h=0;for(const c of String(n||''))h=(h*31+c.charCodeAt(0))%360;return h}
function domainOf(a){if(!a)return '';if(typeof a==='string')return DOMAINS[a]||'';return a.domain||DOMAINS[a.name]||''}
function logo(a,sz){const n=typeof a==='string'?a:a.name;const d=domainOf(a);sz=sz||40;
  return '<span class="lg" style="width:'+sz+'px;height:'+sz+'px;--h:'+hue(n)+'">'+(d?'<img src="https://www.google.com/s2/favicons?domain='+encodeURIComponent(d)+'&sz=128" alt="" loading="lazy" data-n="'+esc(n)+'" onload="lgCheck(this)" onerror="lgFail(this)">':'<b>'+esc(initials(n))+'</b>')+'</span>'}
function lgCheck(i){if(i.naturalWidth&&i.naturalWidth<=16)lgFail(i);else if(i.parentNode)i.parentNode.classList.add('img')}
function lgFail(i){if(!i.dataset.alt){i.dataset.alt=1;const d=new URL(i.src).searchParams.get('domain');if(d){i.src='https://icons.duckduckgo.com/ip3/'+d+'.ico';return}}const b=document.createElement('b');b.textContent=initials(i.dataset.n||'');i.replaceWith(b)}
/* live numbers for each part of the system */
function sysStats(){const c=typeof curCamp==='function'?curCamp():null;const tg=c?campTargets(c):[];const ppl=sum(tg,a=>a.people.length);const R=ranked().filter(x=>x.s.score>0&&x.a.signals.some(g=>g.type!=='trigger'));const warm=R.filter(x=>x.s.heat>=2).length;const p=pipe();const q=S.launch.queue.length;const sent=S.launch.done.length+Object.keys((c&&c.sent)||{}).length;
  const gift=c&&c.assets.length?toolById(c.assets[0]):null;const steps=c&&c.reach.steps?c.reach.steps.length:0;const planned=!!(c&&steps&&c.status!=='draft');const live=!!(c&&(c.status==='live'||sent>0));
  return{prospects:{big:tg.length,lab:tg.length===1?'brand on your list':'brands on your list',mini:tg.length?tg.length+' brands · '+ppl+' people':'Pick your brands',badge:'',live:tg.length>0,done:tg.length>0&&ppl>0},
    give:{mini:gift?gift.n.replace(/^The /,''):'Choose a gift',badge:'',done:!!gift},
    reach:{mini:steps?steps+' touchpoints · '+c.reach.weeks+' weeks':'Plan the journey',badge:'',done:planned},
    launch:{mini:live?sent+' sent'+(q?' · '+q+' to approve':''):'Ready when you are',badge:q||'',done:live},
    campaigns:{big:q||sent,lab:q?'messages to approve':'messages out',sub:gift?'Giving: '+gift.n:'Nothing chosen to give yet',badge:q||'',live:q>0||sent>0,done:sent>0},
    signals:{big:warm,lab:warm===1?'brand warming':'brands warming',sub:R.filter(x=>x.s.heat>=4).length+' hot right now',badge:warm||'',live:warm>0,done:R.length>0},
    pipeline:{big:p.val,fmt:'m',lab:'in play',sub:p.active.length+' live deal'+(p.active.length===1?'':'s')+' · '+money(p.wonVal,true)+' won',badge:'',live:p.active.length>0,done:S.opps.length>0},
    home:{},insights:{badge:typeof unreadInsights==='function'?unreadInsights()||'':''}}}
function renderBell(){const b=$('#bellBtn');if(!b)return;const u=S.notifications.filter(n=>!n.read).length;
  b.innerHTML=ico('bell')+(u?'<span class="badge-dot">'+u+'</span>':'');const d=$('#dot .bdg');if(d){d.textContent=u;d.style.display=u?'grid':'none'}
  if($('#notifPanel').classList.contains('on'))renderNotifs()}
const VIEWS={};
function go(k,arg,quiet){if(VIEW==='dot'&&k!=='dot'&&Date.now()<DOT_HOLD)return;if(k==='campaigns'){k=CAMP_ROUTE[arg]||'give';arg=null}if(ALIAS[k]){const al=ALIAS[k];k=al[0];if(arg==null)arg=al[1]||null}if(!on(k))k='home';VIEW=k;VIEW_ARG=arg||null;
  refreshNav();
  const v=$('#view');if(!quiet)v.scrollTop=0;
  let html='';try{html=VIEWS[k]?VIEWS[k](arg):''}catch(e){console.error(e);html='<div class="card empty"><b>Something went wrong drawing this page</b>Try another section, or reload.</div>'}
  v.innerHTML='<div class="view-inner'+(quiet?' still':'')+'">'+html+'</div>';
  const after=VIEWS[k+'_after'];if(after)try{after(arg)}catch(e){console.error(e)}
  initSegs();countUp(v);
  try{history.replaceState(null,'','#'+k)}catch(e){}}
function refresh(){const v=$('#view');const y=v?v.scrollTop:0;const ns=$('#nav')?$('#nav').scrollTop:0;renderShell();go(VIEW,VIEW_ARG,true);$('#view').scrollTop=y;$('#nav').scrollTop=ns;save()}

/* page head: numbered framework marker, big headline, one line on why */
function pageHead(title,sub,actions){return '<div class="ph"><div style="min-width:0;flex:1"><h1 class="h-xl">'+title+'</h1>'+(sub?'<p class="lede">'+sub+'</p>':'')+'</div><div class="ph-actions">'+(actions||'')+'</div></div>'}
/* the system, drawn: four parts, each feeding the next */
function procRail(k){const L=SYS();const st=sysStats();return '<div class="prail" role="navigation" aria-label="Outreach: three steps, then launch">'+L.map((m,i)=>'<button class="pr'+(m.k===k?' on':'')+(st[m.k]&&st[m.k].done?' dn':'')+(m.k==='launch'?' rk':'')+'" onclick="go(\''+m.k+'\')"><span class="pr-n">'+(m.k==='launch'?'🚀':(st[m.k]&&st[m.k].done&&m.k!==k?'✓':m.n))+'</span><span class="pr-t"><b>'+m.l+'</b><small>'+esc(st[m.k]&&st[m.k].mini||'')+'</small></span></button>'+(i<L.length-1?'<i class="pr-ar"></i>':'')).join('')+'</div>'}
function secHead(k,title,actions,tabs){const m=MODULES.find(x=>x.k===k)||{d:'',why:''};
  return (m.n?procRail(k):'')+'<div class="sh"><div class="sh-l"><div class="sh-k">'+(m.k==='launch'?'<span>🚀</span>Outreach · ready for launch':m.n?'<span>'+m.n+'</span>Outreach · step '+m.n+' of 3 · '+esc(m.d):['signals','pipeline','team','insights'].includes(k)?'Results · '+esc(m.d):esc(m.d))+'</div><h1 class="sh-t">'+title+'</h1><p class="sh-p">'+esc(m.why)+'</p></div>'+(actions?'<div class="sh-a">'+actions+'</div>':'')+'</div>'+(tabs||'')}
function pills(items,active,fn){return '<div class="pills" role="tablist">'+items.map(([k,l,c])=>'<button class="pl'+(k===active?' on':'')+'" onclick="'+fn.replace('$',"'"+k+"'")+'">'+l+(c!=null&&c!==''?'<i>'+c+'</i>':'')+'</button>').join('')+'</div>'}
function handoff(k,label,f,line){const L=SYS();const i=L.findIndex(m=>m.k===k);const m=MODULES.find(x=>x.k===k);const nx=k==='launch'?MODULES.find(x=>x.k==='signals'):k==='signals'?MODULES.find(x=>x.k==='pipeline'):k==='pipeline'?L[0]:L[i+1];
  return '<div class="handoff"><div class="ho-vis"><span class="ho-ic">'+ico(m.ic)+'</span><span class="ho-line"><i></i><i></i></span><span class="ho-ic nx">'+ico(nx.ic)+'</span></div><div class="grow"><b>'+esc(m.out)+'</b><small>'+esc(line||nx.why)+'</small></div><button class="btn btn-primary" onclick="'+(f||"go('"+nx.k+"')")+'">'+(label||'Go to '+nx.l)+ico('arrow','a')+'</button></div>'}
function hideStrip(k){S.setup.guides[k]=true;save();const g=$('#gstrip');if(g){g.style.transition='opacity .3s,transform .3s';g.style.opacity=0;g.style.transform='translateY(-6px)';setTimeout(()=>g.remove(),300)}}

/* segmented control with a sliding indicator */
function seg(items,active,fn){return '<div class="seg" role="tablist">'+items.map(([k,l,c])=>'<button class="'+(k===active?'on':'')+'" onclick="'+fn.replace('$',"'"+k+"'")+'">'+l+(c!=null?'<span class="c">'+c+'</span>':'')+'</button>').join('')+'<span class="ind"></span></div>'}
function initSegs(){$$('.seg').forEach(s=>{const b=s.querySelector('button.on'),i=s.querySelector('.ind');if(!b||!i)return;i.style.transition='none';i.style.left=b.offsetLeft+'px';i.style.width=b.offsetWidth+'px';requestAnimationFrame(()=>i.style.transition='')})}
window.addEventListener('resize',()=>initSegs());

/* ── toast ─────────────────────────────────────────────────── */
function toast(msg,action,ms){const live=$$('#toasts .toast:not(.out)');if(live.length>=2)live.slice(0,live.length-1).forEach(x=>{x.classList.add('out');setTimeout(()=>x.remove(),300)});
  const t=document.createElement('div');t.className='toast';t.innerHTML='<span>'+msg+'</span>'+(action?'<button>'+esc(action.l)+'</button>':'');
  if(action)t.querySelector('button').onclick=()=>{t.remove();action.f()};$('#toasts').appendChild(t);
  setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),320)},ms||(action?5000:3000))}

/* ── modal & drawer ────────────────────────────────────────── */
function modal(html,wide){closeOverlays(true);$$('#toasts .toast').forEach(x=>{x.classList.add('out');setTimeout(()=>x.remove(),300)});const m=$('#modal');m.className='modal'+(wide?' wide':'');
  m.innerHTML='<button class="icon-btn modal-x tip-l" onclick="closeOverlays()" data-tip="Close without saving" aria-label="Close">'+ico('x')+'</button>'+html;
  $('#scrim').classList.add('on');requestAnimationFrame(()=>m.classList.add('on'));const f=m.querySelector('input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea');if(f&&innerWidth>900)setTimeout(()=>f.focus(),220)}
function drawer(html){closeOverlays(true);const d=$('#drawer');d.innerHTML=html;$('#scrim').classList.add('on');requestAnimationFrame(()=>d.classList.add('on'))}
function closeOverlays(keepScrim){$('#modal').classList.remove('on');$('#drawer').classList.remove('on');if(!keepScrim)$('#scrim').classList.remove('on');$('#notifPanel').classList.remove('on');closeCmdk()}
function pickAccountThen(){modal('<h2>Which brand?</h2><div class="field"><select class="inp" id="paA">'+S.accounts.slice().sort((x,y)=>x.name.localeCompare(y.name)).map(a=>'<option value="'+a.id+'">'+esc(a.name)+'</option>').join('')+'</select></div><div class="modal-foot"><button class="btn btn-ghost" onclick="closeOverlays()">Cancel</button><button class="btn btn-primary" onclick="openPersonForm($(\'#paA\').value)">Next</button></div>')}
function confirmBox(title,body,okLabel,fn,danger){modal('<h2>'+title+'</h2><p class="sub">'+body+'</p><div class="modal-foot"><button class="btn btn-ghost" onclick="closeOverlays()">Cancel</button><button class="btn '+(danger?'btn-danger':'btn-primary')+'" id="okBtn">'+okLabel+'</button></div>');
  $('#okBtn').onclick=()=>{closeOverlays();fn()}}
/* the "what will happen" box every action sheet carries */
const effect=(items,title)=>'<div class="effect"><b>'+(title||'What happens when you save')+'</b><ul>'+items.map(i=>'<li>'+i+'</li>').join('')+'</ul></div>';

/* ── notifications ─────────────────────────────────────────── */
function toggleBell(){const p=$('#notifPanel');if(p.classList.contains('on')){p.classList.remove('on');return}renderNotifs();p.classList.add('on')}
function renderNotifs(){const p=$('#notifPanel');const ns=S.notifications;
  p.innerHTML='<div class="notif-h"><b class="h-s">Alerts</b><div class="row"><button class="btn btn-xs btn-line" onclick="markAllRead()">Mark all read</button><button class="btn btn-xs btn-ghost" onclick="closeOverlays();go(\'settings\',\'alerts\')">Alert settings</button></div></div>'+
  '<div class="notif-b">'+(ns.length?ns.slice(0,40).map(n=>'<div class="ni'+(n.read?'':' unread')+'" data-n="'+n.id+'"><div class="ni-ic">'+(n.ic||'🔔')+'</div><div style="flex:1;min-width:0"><div class="ni-t">'+esc(n.title)+'</div>'+(n.body?'<div class="ni-s">'+esc(n.body)+'</div>':'')+'<div class="ni-time">'+rel(n.ts)+(n.accountId?' · Click to open the account':'')+'</div></div></div>').join(''):'<div class="empty"><div class="orb"></div>Quiet for now. You will hear the moment an account warms up.</div>')+'</div>';
  $$('.ni',p).forEach(el=>el.onclick=()=>{const n=S.notifications.find(x=>x.id===el.dataset.n);n.read=true;save();renderBell();if(n.accountId)openAccount(n.accountId);else if(n.insightId){closeOverlays();openInsight(n.insightId)}})}
function markAllRead(){S.notifications.forEach(n=>n.read=true);save();renderBell();renderNotifs()}

/* ── command palette ───────────────────────────────────────── */
let cmdSel=0,cmdItems=[];
function openCmdk(){closeOverlays(true);const c=$('#cmdk');c.classList.add('on');$('#scrim').classList.add('on');const i=$('#cmdkIn');i.value='';cmdRender('');setTimeout(()=>i.focus(),50)}
function closeCmdk(){$('#cmdk').classList.remove('on')}
function cmdRender(q){q=q.toLowerCase().trim();const out=[];
  const acts=[['Find brands that fit','target',()=>go('prospects')],['Find decision makers','user',()=>go('prospects','people')],['Why now: latest news','bolt',()=>go('prospects','news')],['Choose what to give','gift',()=>go('campaigns','value')],['Plan the journey','send',()=>go('campaigns','journey')],['Launch','bolt',()=>go('campaigns','launch')],['Who is warm','pulse',()=>go('signals')],['Pipeline','pound',()=>go('pipeline')],['Insights','bulb',()=>go('insights')],
    ['Start a new campaign','layers',()=>newCampaign()],['Log a touchpoint','plus',()=>openLogSheet()],['Add a deal','pound',()=>openOppForm()],['Upload outreach data','upload',()=>openImport(null,'outreach')],['Download the plan as a PDF','download',()=>downloadPlanPDF()],['How it works','play',()=>startWalk(true)],['Download a backup','download',()=>backupNow()],['Undo the last change','undo',()=>undo()],['Switch light or dark','moon',()=>toggleMode()],['Ask Plato','help',()=>openDot()]];
  MODULES.concat([{k:'settings',t:'Settings',ic:'settings'}]).forEach(m=>{if(!q||m.t.toLowerCase().includes(q)||(m.l||'').toLowerCase().includes(q))out.push({sec:'Go to',l:m.t,ic:m.ic||'arrow',f:()=>go(m.k)})});
  acts.forEach(([l,ic,f])=>{if(!q||l.toLowerCase().includes(q))out.push({sec:'Do something',l,ic,f})});
  if(q){S.accounts.forEach(a=>{const hitP=a.people.find(p=>p.name.toLowerCase().includes(q));if(a.name.toLowerCase().includes(q)||hitP)out.push({sec:'Accounts',l:a.name+(hitP?' · '+hitP.name:''),ic:'target',f:()=>openAccount(a.id),k:(STAGES.find(s=>s.k===a.stage)||STAGES[0]).l})});
    S.campaigns.forEach(c=>{if(c.name.toLowerCase().includes(q))out.push({sec:'Campaigns',l:c.name,ic:'layers',f:()=>{S.cur=c.id;go('campaigns')}})})}
  cmdItems=out.slice(0,30);cmdSel=0;let last='';
  $('#cmdkList').innerHTML=cmdItems.length?cmdItems.map((it,i)=>{const h=it.sec!==last?'<div class="cmdk-sec">'+it.sec+'</div>':'';last=it.sec;
    return h+'<div class="cmdk-i'+(i===0?' sel':'')+'" data-i="'+i+'">'+ico(it.ic)+'<span>'+esc(it.l)+'</span>'+(it.k?'<span class="k">'+esc(it.k)+'</span>':'')+'</div>'}).join(''):'<div class="empty">Nothing matches. Try an account name, or ask Plato.</div>';
  $$('.cmdk-i').forEach(el=>{el.onclick=()=>runCmd(+el.dataset.i);el.onmouseenter=()=>{cmdSel=+el.dataset.i;cmdHi()}})}
function cmdHi(){$$('.cmdk-i').forEach((el,i)=>el.classList.toggle('sel',i===cmdSel));const s=$('.cmdk-i.sel');if(s)s.scrollIntoView({block:'nearest'})}
function runCmd(i){const it=cmdItems[i];if(!it)return;closeOverlays();setTimeout(it.f,80)}

/* ── add or log: one place for every way in ────────────────── */
function openQuickAdd(){modal('<h2>Add</h2><p class="sub">Each opens a short form. Nothing saves until you confirm, and you can undo after.</p>'+
  '<div class="capture" style="margin-bottom:6px"><input id="qaCap" placeholder="Or type it: Call with Priya Hale at Kestrel Outdoor, wants the audit" onkeydown="if(event.key===\'Enter\')previewCapture(this.value)"><button class="btn btn-primary btn-sm" onclick="previewCapture($(\'#qaCap\').value)">Check it</button></div><span class="hint" style="margin-bottom:18px">We show what we understood before saving.</span>'+
  '<div class="picker">'+[['send','A touchpoint','A call, message, email or meeting','openLogSheet()'],['target','A brand','To your list','openAccountForm()'],['user','A person','Someone to speak to','pickAccountThen()'],['pound','A deal','For the pipeline','openOppForm()'],['upload','A file','An outreach export','openImport(null,\'outreach\')']].map(x=>
  '<button class="pick" onclick="'+x[3]+'"><span class="ic" style="color:var(--brand)">'+ico(x[0])+'</span><b>'+x[1]+'</b><span>'+x[2]+'</span></button>').join('')+'</div>',true)}
/* ── mode & misc ───────────────────────────────────────────── */
function toggleMode(){S.brand.mode=S.brand.mode==='dark'?'light':'dark';applyTheme();save();renderShell();go(VIEW,VIEW_ARG,true);mountDot()}
function countUp(root){$$('[data-count]',root).forEach(el=>{const tgt=+el.dataset.count,fmt=el.dataset.fmt||'n',t0=performance.now(),dur=1000;
  const f=v=>fmt==='m'?money(v,true):fmt==='p'?Math.round(v)+'%':Math.round(v).toLocaleString('en-GB');
  if(el.closest('.still')){el.textContent=f(tgt);return}
  const step=t=>{const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=f(tgt*e);if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step)})}
const NUMW=['No','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve'];
function copyText(t,btn){(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>{if(btn){const o=btn.innerHTML;btn.innerHTML='Copied';setTimeout(()=>btn.innerHTML=o,1500)}else toast('📋 Copied')},()=>modal('<h2>Copy this</h2><textarea class="inp" style="min-height:200px">'+esc(t)+'</textarea>'))}

/* global keys */
document.addEventListener('keydown',e=>{
  const typing=/INPUT|TEXTAREA|SELECT/.test((e.target||{}).tagName||'')||(e.target&&e.target.isContentEditable);
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#cmdk').classList.contains('on')?closeOverlays():openCmdk();return}
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='z'&&!typing&&S&&S.setup.done){e.preventDefault();undo();return}
  if($('#cmdk').classList.contains('on')){if(e.key==='ArrowDown'){cmdSel=Math.min(cmdItems.length-1,cmdSel+1);cmdHi();e.preventDefault()}
    else if(e.key==='ArrowUp'){cmdSel=Math.max(0,cmdSel-1);cmdHi();e.preventDefault()}else if(e.key==='Enter'){runCmd(cmdSel)}}
  if(e.key==='Escape'){if($('#tourCard'))return endTour();closeOverlays();closeDot()}
});
/* icons for signals, touchpoints and layers, so visuals carry the meaning */
const ACT_IC={li_connect:'linkedin',li_accept:'check',li_msg:'linkedin',li_reply:'chat',email:'mail',reply:'chat',call:'phone',meeting:'people',event:'calendar',value:'send'};
function sigIco(type){const f=famOf(type);return ico(f?CH_FAM.find(x=>x.k===f).ic:type==='trigger'?'bolt':type==='value_sent'?'send':'pulse')}
function actIco(k){return ico(ACT_IC[k]||'pulse')}
function fitRing(f,big){const r=15,c=2*Math.PI*r;return '<span class="fit'+(big?' big':'')+'" data-tip="Fit '+f+'%"><svg viewBox="0 0 38 38"><circle cx="19" cy="19" r="'+r+'" fill="none" stroke="var(--rule)" stroke-width="4"/><circle cx="19" cy="19" r="'+r+'" fill="none" stroke="'+(f>=80?'var(--brand)':f>=60?'#7b5cff':'#0b9e8a')+'" stroke-width="4" stroke-dasharray="'+c+'" stroke-dashoffset="'+c*(1-f/100)+'"/></svg><b>'+f+'</b></span>'}
