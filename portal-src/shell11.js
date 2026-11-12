/* ═══════════ v11 SHELL: a calm left-hand sidebar, agents only where the work is built ═══════════
   Home, Campaigns, then the four outreach steps (each with its agent), Results, Team, Insights.
   Agency profile and settings sit at the foot. The top bar keeps search, alerts, view and account. */
['agency','signals','pipeline','team','insights'].forEach(k=>delete AGENTS[k]);
const OUT_K=['prospects','give','reach','launch'];
const isOut=k=>OUT_K.includes(k);
PAGES.push('camps');
const SIDE_IC={home:'home',camps:'layers',signals:'pulse',pipeline:'pound',team:'people',insights:'bulb',agency:'star',settings:'settings',admin:'crown'};
function campStepState(c,k){if(!c)return 0;const tg=campTargets(c);if(k==='prospects')return tg.length&&sum(tg,a=>a.people.length)?2:tg.length?1:0;if(k==='give')return c.assets.length&&bankReady(c)?2:c.assets.length?1:0;
  if(k==='reach')return c.status!=='draft'&&(c.reach.steps||[]).length?2:(c.reach.steps||[]).length&&c.reachSeen?1:0;return campLive(c)?2:0}
function campStepSub(c,k){const tg=campTargets(c);if(k==='prospects')return tg.length?tg.length+' brand'+(tg.length===1?'':'s')+' · '+sum(tg,a=>a.people.length)+' people':'No brands yet';
  if(k==='give'){const g=toolById(c.assets[0]);return g?(bankReady(c)?'Gift and content ready':'Content bank '+bankPct(c)+'%'):'Nothing chosen'}
  if(k==='reach')return (c.reach.steps||[]).length?c.reach.steps.filter(s=>!s.task).length+' touches · '+c.reach.weeks+' weeks':'Not planned';
  return campLive(c)?'Live · week '+campWeek(c):'Not launched'}
function campWeek(c){return c&&c.launched?Math.floor(daysAgo(c.launched)/7)+1:0}
function sideItem(k,label,sub,badge){const ic=SIDE_IC[k]||'home';return '<button class="sd-i'+(VIEW===k?' on':'')+'" data-nav="'+k+'" id="nav-'+k+'" data-tip="'+esc(label)+'">'+ico(ic)+'<span class="sd-t"><b>'+esc(label)+'</b>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</span>'+(badge?'<i class="sd-c">'+badge+'</i>':'')+'</button>'}
function navHTML(){const st=sysStats();const c=curCamp();const live=S.campaigns.filter(campLive).length;
  const step=k=>{const A=AGENTS[k];const m=MODULES.find(x=>x.k===k);const s=campStepState(c,k);
    return '<button class="sd-a'+(VIEW===k?' on':'')+(s===2?' dn':s===1?' half':'')+'" data-nav="'+k+'" id="nav-'+k+'" data-tip="'+esc(m.l+' with '+A.n)+'">'+agentFace(k,30,{badge:false})+'<span class="sd-t"><b>'+esc(m.l)+'</b><small>'+esc(A.n+' · '+campStepSub(c,k))+'</small></span><span class="sd-st">'+(s===2?ico('check'):k==='launch'?'🚀':'<i>'+m.n+'</i>')+'</span></button>'};
  return sideItem('home','Home')+sideItem('camps','Campaigns',null,S.campaigns.length>1?S.campaigns.length:'')+
    '<div class="sd-grp"><div class="sd-gh"><small>Building now</small><button class="sd-camp" onclick="pickCamp(event)" data-tip="Switch campaign">'+esc(c?c.name:'')+ico('arrow','dn')+'</button></div><div class="sd-steps">'+OUT_K.map(step).join('')+'</div><div class="sd-free">Free to build. You only pay to launch.</div></div>'+
    '<div class="sd-cap">Results</div>'+sideItem('signals','Signals',null,st.signals&&st.signals.badge)+sideItem('pipeline','Pipeline')+
    '<div class="sd-div"></div>'+sideItem('team','Team')+sideItem('insights','Insights',null,st.insights&&st.insights.badge)}
function sideFoot(){const adm=SESSION&&SESSION.role==='admin';return '<div class="sd-foot">'+sideItem('agency','Agency profile')+(adm?sideItem('admin','Manage access'):'')+'<button class="sd-i" onclick="go(\'settings\')" data-tip="Settings">'+ico('settings')+'<span class="sd-t"><b>Settings</b></span></button></div>'}
function renderShell(){const unread=S.notifications.filter(n=>!n.read).length;const u=SESSION||{};
  $('#app').innerHTML=
  '<aside class="side" id="side" aria-label="Sections"><div class="sd-top"><button class="sd-brand" onclick="go(\'home\')" aria-label="Home"><span class="sd-mark">'+SL_MARK('currentColor',3)+'</span><span class="sd-word">'+(S.brand.logo?'<img src="'+S.brand.logo+'" alt="'+esc(S.setup.agency||'')+'">':'<b>'+esc(S.setup.agency||'Your agency')+'</b>')+'<small>Plato</small></span></button><button class="icon-btn sd-x" onclick="sideToggle(false)" aria-label="Close menu">'+ico('x')+'</button></div>'+
    '<button class="sd-new" onclick="newCampaignFlow()" data-tour="newcamp">'+ico('plus')+'<span>New campaign</span></button>'+
    '<nav class="sd-nav" id="nav">'+navHTML()+'</nav>'+sideFoot()+'</aside>'+
  '<div class="mainw"><header class="topb"><button class="icon-btn sd-ham" onclick="sideToggle(true)" aria-label="Open menu">'+ico('menu')+'</button><div class="tb-crumb" id="crumb"></div>'+
    '<div class="tn-r"><div class="vmode" id="vmode" role="tablist" aria-label="View">'+vmodeHTML()+'</div>'+
      '<button class="icon-btn tip-b" onclick="openCmdk()" data-tip="Search">'+ico('search')+'</button>'+
      '<button class="icon-btn tip-b hide-m" onclick="toggleMode()" data-tip="Light or dark">'+ico('moon')+'</button>'+
      '<button class="icon-btn tip-b tip-l" id="bellBtn" onclick="toggleBell()" data-tip="Alerts">'+ico('bell')+(unread?'<span class="badge-dot">'+unread+'</span>':'')+'</button>'+
      '<button class="avatar" id="avBtn" onclick="toggleUserMenu(event)" aria-label="Your account">'+esc(initials(S.setup.you||u.name||S.setup.agency||'You'))+'</button></div></header>'+
  (S.setup.demo?'<div class="demo-rib">You are looking at the demo. Every brand, name and number here is invented. <button onclick="leaveDemo()">Start my own workspace</button></div>':'')+
  '<main class="main"><section class="view" id="view"></section>'+
    '<footer class="pfoot2"><span class="mk">'+SL_MARK('currentColor',3)+'</span><span>Plato by <b>Scope &amp; Lens</b></span><a href="mailto:josh@scopeandlens.com">Get in touch</a></footer></main></div>'+
  '<div class="side-scrim" onclick="sideToggle(false)"></div><div class="umenu" id="umenu"></div>';
  bindNav();renderUndo()}
function sideToggle(on){document.body.classList.toggle('side-open',!!on)}
function refreshNav(){const n=$('#nav');if(!n)return;const y=n.scrollTop;n.innerHTML=navHTML();n.scrollTop=y;bindNav();crumb()}
function crumb(){const el=$('#crumb');if(!el)return;const c=curCamp();const m=MODULES.find(x=>x.k===VIEW);
  const name={camps:'Campaigns',settings:'Settings',admin:'Manage access',plan:'Your growth plan',library:'Agency profile',dot:'Plato'}[VIEW]||(m?m.l:'');
  el.innerHTML=isOut(VIEW)?'<button class="cr-c" onclick="go(\'camps\')">'+esc(c.name)+'</button><span class="cr-s">/</span><b>'+esc(name)+'</b>':'<b>'+esc(name)+'</b>'}
const _bindNav=bindNav;bindNav=function(){_bindNav();$$('[data-nav]').forEach(b=>{const f=b.onclick;b.onclick=e=>{sideToggle(false);f&&f(e)}})};
/* switching campaign from anywhere */
function pickCamp(e){if(e)e.stopPropagation();const m=$('#umenu');const c=curCamp();
  m.innerHTML='<div class="um-h"><b>Your campaigns</b><small>Switch, or start a new one</small></div>'+S.campaigns.map(x=>'<button onclick="$(\'#umenu\').classList.remove(\'on\');switchCamp(\''+x.id+'\')">'+(x.id===c.id?ico('check'):'<span class="um-dot '+(campLive(x)?'live':'')+'"></span>')+esc(x.name)+'<small class="um-s">'+(campLive(x)?'Live':'Draft')+'</small></button>').join('')+'<button onclick="$(\'#umenu\').classList.remove(\'on\');newCampaignFlow()">'+ico('plus')+'New campaign</button>';
  const r=(e&&e.currentTarget||$('.sd-camp')).getBoundingClientRect();Object.assign(m.style,{top:(r.bottom+6)+'px',left:Math.max(8,r.left)+'px',right:'auto'});m.classList.add('on','at')}
function switchCamp(id){S.cur=id;save();toast('Now working on '+esc(curCamp().name));go(isOut(VIEW)?VIEW:'camps')}
const _toggleUserMenu=toggleUserMenu;toggleUserMenu=function(e){const m=$('#umenu');m.classList.remove('at');m.style.left='';m.style.top='';m.style.right='';_toggleUserMenu(e)};
/* page heads: the four outreach steps get their agent, everything else is a clean, quiet head */
secHead=function(k,title,actions,tabs){const m=MODULES.find(x=>x.k===k)||{};
  if(!isOut(k))return '<div class="sh plain"><div class="sh-l"><h1 class="sh-t">'+title+'</h1>'+(m.d&&!['home'].includes(k)?'<p class="sh-p">'+esc(m.why||'')+'</p>':'')+'</div>'+(actions?'<div class="sh-a">'+actions+'</div>':'')+'</div>'+(tabs||'');
  const A=AGENTS[k];const c=curCamp();
  return campHead(c,k)+'<div class="sh ag-sh"><div class="sh-l"><div class="agline">'+agentFace(k,54,{badge:false,cls:'big'})+'<div class="bub"><div class="bub-h"><b>'+A.n+'</b><span>'+esc(A.role)+'</span></div><p>'+esc(agentSays(k))+'</p></div></div><h1 class="sh-t">'+title+'</h1></div>'+(actions?'<div class="sh-a">'+actions+'</div>':'')+'</div>'+(tabs||'')};
/* the campaign you are building, always visible at the top of the four steps */
function campHead(c,k){const i=OUT_K.indexOf(k);
  return '<div class="ch"><div class="ch-l"><span class="ch-k">Campaign</span><input class="camp-name" value="'+esc(c.name)+'" onchange="renameCamp(this.value)" aria-label="Campaign name">'+(c.problem&&L_PROBLEMS[c.problem]?'<span class="ch-p">'+ico('target')+'Solving '+esc(L_PROBLEMS[c.problem].short)+'</span>':'')+'</div>'+
    '<div class="ch-steps">'+OUT_K.map((x,j)=>{const s=campStepState(c,x);return '<button class="chs'+(x===k?' on':'')+(s===2?' dn':'')+'" onclick="go(\''+x+'\')">'+agentFace(x,22,{badge:false})+'<span>'+MODULES.find(m=>m.k===x).ls+'</span>'+(s===2?ico('check'):'')+'</button>'+(j<3?'<i class="chs-ar"></i>':'')}).join('')+'</div>'+
    '<div class="ch-r">'+campTeamBar(c)+'<button class="btn btn-line btn-xs" onclick="newCampaignFlow()">'+ico('plus')+'New campaign</button></div></div>'}
campBar=function(){return ''};procRail=function(){return ''};
/* handing over: agent to agent inside the build, plain once it reaches results */
const _handoffAg=handoff;handoff=function(k,label,f,line){if(k==='launch'||!isOut(k))return '<div class="handoff plain"><div class="grow"><b>'+esc(line||'Next')+'</b></div><button class="btn btn-primary" onclick="'+(f||"go('signals')")+'">'+(label||'See who is responding')+ico('arrow','a')+'</button></div>';return _handoffAg(k,label,f,line)};
agentSays=(function(prev){return function(k){if(!isOut(k))return '';return prev(k)}})(agentSays);
castStrip=function(){return ''};
