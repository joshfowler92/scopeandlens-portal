/* ═══════════ v12 SHELL: Plato, your logo, your colours ═══════════
   The agency's logo replaces the Scope & Lens mark top left, and the name reads "<Agency> · Plato".
   Team sits under the line with the agency profile and settings. Revenue is now Pipeline. */
const PORTAL_NAME='Plato';
function portalName(){const a=(S&&S.setup&&S.setup.agency||'').trim();return (a&&a!=='Your agency'?a+' · ':'')+PORTAL_NAME}
SIDE_IC.guides='book';SIDE_IC.plato='chat';
Object.assign(IC,{book:'<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19"/><path d="M9 7h6M9 10.5h4"/>'});
function brandMark(){return S.brand.logo?'<span class="sd-logo"><img src="'+S.brand.logo+'" alt=""></span>':'<span class="sd-mark">'+SL_MARK('currentColor',3)+'</span>'}
navHTML=function(){const st=sysStats();const c=curCamp();const gate=!profReady();
  const step=k=>{const A=AGENTS[k];const m=MODULES.find(x=>x.k===k);const s=campStepState(c,k);
    return '<button class="sd-a'+(VIEW===k?' on':'')+(s===2?' dn':s===1?' half':'')+(gate?' lock':'')+'" data-nav="'+k+'" id="nav-'+k+'" data-tip="'+esc(m.l+' with '+A.n)+'">'+agentFace(k,30,{badge:false})+'<span class="sd-t"><b>'+esc(m.l)+'</b><small>'+esc(gate?'After your agency profile':A.n+' · '+campStepSub(c,k))+'</small></span><span class="sd-st">'+(gate?ico('lock'):s===2?ico('check'):k==='launch'?'🚀':'<i>'+m.n+'</i>')+'</span></button>'};
  return sideItem('home','Home')+sideItem('camps','Campaigns',null,S.campaigns.length>1?S.campaigns.length:'')+
    '<div class="sd-grp"><div class="sd-gh"><small>Building now</small>'+(c&&!(isBlankCamp(c)&&!c.touched)?'<button class="sd-camp" onclick="pickCamp(event)" data-tip="Switch campaign">'+esc(c.name)+ico('arrow','dn')+'</button>':'<b class="sd-camp">No campaign yet</b>')+'</div><div class="sd-steps">'+OUT_K.map(step).join('')+'</div><div class="sd-free">Free to build. You only pay to launch.</div></div>'+
    '<div class="sd-cap">Results</div>'+sideItem('signals','Signals',null,st.signals&&st.signals.badge)+sideItem('pipeline','Pipeline')+
    '<div class="sd-div"></div>'+sideItem('insights','Insights',null,st.insights&&st.insights.badge)+sideItem('guides','Guides')};
sideFoot=function(){const adm=SESSION&&SESSION.role==='admin';return '<div class="sd-foot">'+sideItem('agency','Agency profile',null,profReady()?'':'!')+sideItem('team','Team')+(adm?sideItem('admin','Manage access'):'')+'<button class="sd-i'+(VIEW==='settings'?' on':'')+'" onclick="go(\'settings\')" id="nav-settings" data-tip="Settings">'+ico('settings')+'<span class="sd-t"><b>Settings</b></span></button></div>'};
function avatarHTML(cls){const u=SESSION||{};const ph=myPhoto();return ph?'<img src="'+ph+'" alt="">':esc(initials(S.setup.you||u.name||S.setup.agency||'You'))}
renderShell=function(){const unread=S.notifications.filter(n=>!n.read).length;
  document.title=portalName();
  $('#app').innerHTML=
  '<aside class="side" id="side" aria-label="Sections"><div class="sd-top"><button class="sd-brand" onclick="go(\'home\')" aria-label="Home">'+brandMark()+'<span class="sd-word"><b>'+esc((S.setup.agency&&S.setup.agency!=='Your agency')?S.setup.agency:'Your agency')+'</b><small>'+PORTAL_NAME+'</small></span></button><button class="icon-btn sd-x" onclick="sideToggle(false)" aria-label="Close menu">'+ico('x')+'</button></div>'+
    '<button class="sd-new" onclick="newCampaignFlow()" data-tour="newcamp">'+ico('plus')+'<span>New campaign</span></button>'+
    '<nav class="sd-nav" id="nav">'+navHTML()+'</nav>'+sideFoot()+'</aside>'+
  '<div class="mainw"><header class="topb"><button class="icon-btn sd-ham" onclick="sideToggle(true)" aria-label="Open menu">'+ico('menu')+'</button><div class="tb-crumb" id="crumb"></div>'+
    '<div class="tn-r"><div class="vmode" id="vmode" role="tablist" aria-label="View">'+vmodeHTML()+'</div>'+
      '<button class="icon-btn tip-b" onclick="openCmdk()" data-tip="Search">'+ico('search')+'</button>'+
      '<button class="icon-btn tip-b hide-m" onclick="toggleMode()" data-tip="Light or dark">'+ico('moon')+'</button>'+
      '<button class="icon-btn tip-b tip-l" id="bellBtn" onclick="toggleBell()" data-tip="Alerts">'+ico('bell')+(unread?'<span class="badge-dot">'+unread+'</span>':'')+'</button>'+
      '<button class="avatar'+(myPhoto()?' ph':'')+'" id="avBtn" onclick="toggleUserMenu(event)" aria-label="Your account">'+avatarHTML()+'</button></div></header>'+
  (DEMO_MODE?'<div class="demo-rib">'+platoFace(22)+'<span>This is a demo agency with invented data, so you can see how a superuser runs Plato.</span><button onclick="endDemo()">Build my own</button></div>':(S.setup.demo?'<div class="demo-rib">You are looking at the demo. Every brand, name and number here is invented. <button onclick="leaveDemo()">Start my own workspace</button></div>':''))+
  '<main class="main"><section class="view" id="view"></section>'+
    '<footer class="pfoot2"><span class="mk">'+SL_MARK('currentColor',3)+'</span><span>'+PORTAL_NAME+' by <b>Scope &amp; Lens</b></span><a href="mailto:josh@scopeandlens.com">Get in touch</a></footer></main></div>'+
  '<div class="side-scrim" onclick="sideToggle(false)"></div><div class="umenu" id="umenu"></div>';
  bindNav();renderUndo()};
/* the view switch: the dashboard, or just talk to Plato */
vmodeHTML=function(){const d=S&&S.setup.viewMode==='dot';return '<button class="'+(d?'':'on')+'" onclick="setViewMode(\'dash\')" data-tip="Dashboard view">'+ico('grid')+'<span>Dashboard</span></button><button class="'+(d?'on':'')+'" onclick="setViewMode(\'dot\')" data-tip="Just talk to Plato"><img class="vm-pl" src="'+IMG12.plato_face+'" alt=""><span>Plato</span></button>'};

/* ── Settings: brand, with hex codes ── */
const HEX=v=>{v=String(v||'').trim();if(!v)return null;if(v[0]!=='#')v='#'+v;if(/^#[0-9a-f]{3}$/i.test(v))v='#'+v.slice(1).split('').map(c=>c+c).join('');return /^#[0-9a-f]{6}$/i.test(v)?v.toLowerCase():null};
function colRow(k,label,sub,val){return '<div class="setting-row col12"><div><b>'+label+'</b><span>'+sub+'</span></div><div class="hexin"><input type="color" value="'+val+'" oninput="this.nextElementSibling.value=this.value" onchange="setBrand(\''+k+'\',this.value)" aria-label="'+label+' colour"><input class="inp hex" value="'+val+'" maxlength="7" spellcheck="false" aria-label="'+label+' hex code" onchange="hexSet(\''+k+'\',this)"></div></div>'}
function hexSet(k,el){const v=HEX(el.value);if(!v){el.classList.add('bad');toast('That is not a hex code. Try something like #3333FF');return}el.classList.remove('bad');setBrand(k,v)}
SET_brand=function(){const b=S.brand;
  return '<div class="two"><div class="card"><div class="card-h"><h3>Your logo</h3></div><label class="drop" id="setLogo"><div class="lp">'+(b.logo?'<img src="'+b.logo+'" alt="Your logo">':ico('upload'))+'</div><div><b>'+(b.logo?'Replace your logo':'Upload your logo')+'</b><div class="small muted">PNG, SVG or JPG. It replaces the Scope &amp; Lens mark top left, and we pull your colours out of it.</div></div><input type="file" accept="image/*" hidden></label>'+(b.logo?'<button class="btn btn-ghost btn-sm" style="margin-top:10px" onclick="removeLogo()">'+ico('trash')+'Remove logo</button>':'')+
    '<div class="lab" style="margin-top:22px">How it looks</div><div class="brandprev"><span class="bp-mark">'+(b.logo?'<img src="'+b.logo+'" alt="">':SL_MARK('currentColor',3))+'</span><span><b>'+esc((S.setup.agency&&S.setup.agency!=='Your agency')?S.setup.agency:'Your agency')+'</b><small>'+PORTAL_NAME+'</small></span></div>'+
    '<div class="card-h" style="margin-top:22px"><h3>Starting points</h3></div><div class="swatches">'+PRESETS.map(p=>'<button class="sw'+(b.preset===p.k?' on':'')+'" data-tip="'+p.l+'" style="background:'+p.p+'" onclick="applyPreset(\''+p.k+'\')" aria-label="'+p.l+'"><i style="background:'+p.a+'"></i></button>').join('')+'</div>'+
    (b.extracted&&b.extracted.length?'<div class="card-h" style="margin-top:22px"><h3>From your logo</h3></div><div class="swatches">'+b.extracted.map(c=>'<button class="sw" style="background:'+c+'" onclick="setBrand(\'primary\',\''+c+'\')" data-tip="Use '+c+' as the main colour" aria-label="Use '+c+'"></button>').join('')+'</div>':'')+'</div>'+
  '<div class="card"><div class="card-h"><h3>Your colours</h3><span class="muted small">Pick, or type a hex code</span></div>'+
    colRow('primary','Main colour','Buttons, highlights, charts and the active menu',b.primary)+colRow('accent','Accent','Numbered markers and small highlights',b.accent)+colRow('bg','Background','The canvas behind everything',b.bg||'#f0ede8')+
    '<div class="setting-row"><div><b>Dark mode</b><span>Easier on the eyes at night</span></div><button class="toggle'+(b.mode==='dark'?' on':'')+'" onclick="toggleMode();go(\'settings\',\'brand\',true)" aria-label="Dark mode"></button></div>'+
    '<button class="btn btn-ghost btn-sm" style="margin-top:12px" onclick="applyPreset(\'scope\')">Back to the Scope &amp; Lens look</button></div></div>'};

/* ── profile photo (#18): stored with your workspace, and on the server for your team ── */
function myPhoto(){return (S&&S.setup&&S.setup.photo)||''}
function pickPhoto(){const i=document.createElement('input');i.type='file';i.accept='image/*';i.onchange=()=>{const f=i.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{squareCrop(r.result,320,img=>{act('Added your photo',()=>{S.setup.photo=img},{refresh:false,ic:'📷'});renderShell();go(VIEW,VIEW_ARG,true);pushPhoto(img)})};r.readAsDataURL(f)};i.click()}
function removePhoto(){act('Removed your photo',()=>{S.setup.photo=''},{refresh:false});renderShell();go(VIEW,VIEW_ARG,true);pushPhoto('')}
function squareCrop(src,size,cb){const img=new Image();img.onload=()=>{const s=Math.min(img.width,img.height);const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');x.drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,size,size);try{cb(c.toDataURL('image/jpeg',0.86))}catch(e){cb(src)}};img.onerror=()=>cb(src);img.src=src}
async function pushPhoto(img){if(!(typeof HOSTED!=='undefined'&&HOSTED)||DEMO_MODE)return;try{await api('photo',{method:'POST',body:{photo:img}})}catch(e){}}
/* the account menu gets the photo controls */
const _toggleUserMenu12=toggleUserMenu;toggleUserMenu=function(e){_toggleUserMenu12(e);const m=$('#umenu');if(!m||!m.classList.contains('on'))return;
  if(m.querySelector('.um-photo'))return;const d=document.createElement('div');d.className='um-photo';
  d.innerHTML='<span class="avatar big'+(myPhoto()?' ph':'')+'">'+avatarHTML()+'</span><div><b>Your photo</b><div class="row" style="gap:6px;margin-top:6px"><button class="btn btn-line btn-xs" onclick="pickPhoto()">'+ico('upload')+(myPhoto()?'Change photo':'Add a photo')+'</button>'+(myPhoto()?'<button class="btn btn-ghost btn-xs" onclick="removePhoto()">Remove</button>':'')+'</div></div>';
  m.insertBefore(d,m.firstChild)};

/* the footer (agency profile, team, settings) refreshes with the rest of the menu */
const _refreshNav12=refreshNav;refreshNav=function(){_refreshNav12.apply(this,arguments);const f=$('.sd-foot');if(f){const t=document.createElement('div');t.innerHTML=sideFoot();f.replaceWith(t.firstChild);bindNav()}};

/* a person's photo where we have one, their initials where we do not */
function avOf(m){const ph=m&&(m.photo||(m.email&&typeof ME==='function'&&m.email===ME()?myPhoto():''));return ph?'<span class="av fill ph"><img src="'+ph+'" alt=""></span>':'<span class="av fill">'+esc(initials((m&&(m.name||m.email))||'?'))+'</span>'}
