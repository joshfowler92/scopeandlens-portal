/* ═══════════ OPENING, LOGIN, SESSION AND THE API ═══════════ */
let SESSION=null,API_OK=null,API_INFO={};const HOSTED=/^\/portal\/app/.test(location.pathname);
/* the Scope & Lens opening animation, exactly as on scopeandlens.com: the mark draws itself, then the top dot becomes the page */
function playLoader(cb){let L=$('#slLoader');if(L)L.remove();L=document.createElement('div');L.id='slLoader';L.setAttribute('aria-hidden','true');
  L.innerHTML='<div class="ldr-logo"><svg viewBox="0 0 84 84"><circle class="ldr-dot" id="ldrDot" cx="42" cy="42" r="41"/></svg><svg viewBox="0 0 84 84"><circle class="ldr-ring" cx="42" cy="42" r="40"/></svg><svg class="half" viewBox="0 0 84 42"><path class="ldr-arc" d="M2 42 A40 40 0 0 1 82 42"/></svg><span class="ldr-wave ldr-w1"></span><span class="ldr-wave ldr-w2"></span><span class="ldr-wave ldr-w3"></span></div><button class="ldr-skip" type="button">Skip</button>';
  document.body.appendChild(L);document.documentElement.classList.add('sl-loading');let done=false;
  function finish(fast){if(done)return;done=true;const d=$('#ldrDot').getBoundingClientRect();const cx=d.left+d.width/2,cy=d.top+d.height/2;
    const far=Math.max(Math.hypot(cx,cy),Math.hypot(innerWidth-cx,cy),Math.hypot(cx,innerHeight-cy),Math.hypot(innerWidth-cx,innerHeight-cy));
    L.style.setProperty('--burst',(far*2/Math.max(d.width,1)+1).toFixed(1));L.classList.add('burst');
    setTimeout(()=>{document.documentElement.classList.remove('sl-loading');L.classList.add('fade');cb&&cb()},fast?250:760);setTimeout(()=>L.remove(),fast?800:1300)}
  L.querySelector('.ldr-skip').onclick=()=>finish(true);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;requestAnimationFrame(()=>L.classList.add('go'));setTimeout(()=>finish(false),reduce?700:2500)}

/* talking to the backend, when the portal is deployed with it */
async function apiCheck(){if(API_OK!==null)return API_OK;if(location.protocol==='file:'){API_OK=false;return false}
  try{const r=await fetch('/api/health',{cache:'no-store'});const j=r.ok?await r.json():null;API_OK=!!(j&&j.ok);API_INFO=j||{}}catch(e){API_OK=false}return API_OK}
async function api(path,opts){opts=opts||{};const h={'Content-Type':'application/json'};if(SESSION&&SESSION.token)h.Authorization='Bearer '+SESSION.token;
  const r=await fetch('/api/'+path,{method:opts.method||'GET',headers:h,body:opts.body?JSON.stringify(opts.body):undefined,credentials:'same-origin'});
  if(r.status===401&&SESSION&&!opts.noAuthRetry&&!/^(requests|users|amplify)/.test(path)){toast('Your session has ended. Please sign in again.');setTimeout(()=>HOSTED?location.replace('/portal/'):logout(),1200)}
  const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||('Request failed ('+r.status+')'));return j}
const isAdminEmail=e=>/@scopeandlens\.com$/i.test(String(e||''));
function nameFromEmail(e){const n=String(e||'').split('@')[0].split(/[._-]/)[0];return n?n.charAt(0).toUpperCase()+n.slice(1):''}

/* the sign in screen */
function showLogin(msg){const el=document.createElement('div');el.id='login';el.className='login';
  el.innerHTML='<div class="lg-l">'+BLOBS+'<div class="lg-mark">'+SL_MARK('#f0ede8',2.4)+'</div><div><div class="lg-k">Scope &amp; Lens</div><h1>Your permissionless <span class="serif">portal.</span></h1><p>Find the brands worth your time, give them something useful first, and see who leans in. All in one place.</p></div>'+
    '<ul class="lg-sys">'+SYS().map(m=>'<li><span>'+(m.k==='launch'?'🚀':m.n)+'</span><b>'+m.l+'</b>'+esc(m.q)+'</li>').join('')+'</ul></div>'+
    '<form class="lg-r" onsubmit="event.preventDefault();doLogin()"><div class="lg-box"><h2>Sign in</h2><p class="muted">Welcome back. Use the details Scope &amp; Lens sent you.</p>'+
      '<div class="field"><label for="liE">Email</label><input class="inp" id="liE" type="email" autocomplete="username" placeholder="you@youragency.com" required></div>'+
      '<div class="field"><label for="liP">Password</label><input class="inp" id="liP" type="password" autocomplete="current-password" placeholder="Your password" required></div>'+
      '<div class="lg-err" id="liErr">'+(msg?esc(msg):'')+'</div>'+
      '<button class="btn btn-primary btn-lg" style="width:100%" type="submit" id="liBtn">Sign in'+ico('arrow','a')+'</button>'+
      '<p class="lg-test" id="liTest"></p>'+
      '<button class="btn btn-ghost" type="button" style="width:100%;margin-top:10px" onclick="startDemo()">'+ico('play')+'Explore the demo first</button>'+
      '<p class="tiny muted" style="margin-top:18px">Need access or forgotten your password? <a class="link" href="mailto:josh@scopeandlens.com?subject=Growth%20portal%20access">Email Josh</a></p></div></form>';
  document.body.appendChild(el);setTimeout(()=>{const i=$('#liE');if(i)i.focus()},300);
  apiCheck().then(ok=>{const t=$('#liTest');if(t&&(!ok||API_INFO.mode==='open'))t.innerHTML=ico('check')+'Test mode: any email and password will let you in.'})}
async function doLogin(){const e=$('#liE').value.trim(),p=$('#liP').value;const err=$('#liErr');err.textContent='';
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)){err.textContent='That email does not look right.';return}if(!p){err.textContent='Add your password.';return}
  const b=$('#liBtn');b.disabled=true;b.innerHTML='Signing in…';
  try{if(await apiCheck()){const j=await api('login',{method:'POST',body:{email:e,password:p},noAuthRetry:true});SESSION=Object.assign({},j.user,{token:j.token})}
    else SESSION={email:e,name:nameFromEmail(e),role:isAdminEmail(e)?'admin':'member',token:null,preview:true}}
  catch(x){err.textContent='Those details did not work. Check them, or email Josh for access.';b.disabled=false;b.innerHTML='Sign in'+ico('arrow','a');return}
  try{localStorage.setItem('sl-session',JSON.stringify(SESSION))}catch(x){}
  const el=$('#login');el.classList.add('out');setTimeout(()=>el.remove(),500);enterApp()}
function restoreSession(){try{const s=JSON.parse(localStorage.getItem('sl-session')||'null');if(s&&s.email){SESSION=s;return true}}catch(e){}return false}
function enterApp(){setUserKeys(SESSION.email);S=load();if(!S){S=blankState();S.setup.done=true;S.setup.you=SESSION.name||'';S.setup.agency=SESSION.orgName||SESSION.agency||'';save()}
  if(SESSION.orgName)S.setup.orgName=SESSION.orgName;if('premium' in SESSION)S.setup.premium=!!SESSION.premium;
  applyTheme();const go2=()=>{if(!S.walked||!S.onb12)startWalk();else launch()};if(HOSTED&&SESSION.hosted)syncPull().then(go2,go2);else go2()}
/* on the live site, the session lives in a secure cookie set by the sign in page */
async function hostedBoot(){try{const r=await fetch('/api/me',{credentials:'same-origin',cache:'no-store'});if(!r.ok)throw 0;const j=await r.json();API_OK=null;await apiCheck();
    SESSION=Object.assign({},j.user,{token:null,hosted:true});try{localStorage.setItem('sl-session',JSON.stringify(SESSION))}catch(e){}enterApp()}
  catch(e){location.replace('/portal/?next='+encodeURIComponent(location.pathname+location.hash))}}
function logout(){confirmBox('Log out?',HOSTED?'Your work is saved to your account and will be here when you sign back in.':'Your work is saved to this browser and will be here when you sign back in.','Log out',async()=>{if(HOSTED){try{await syncPush()}catch(e){}try{await fetch('/api/logout',{method:'POST',credentials:'same-origin'})}catch(e){}}try{localStorage.removeItem('sl-session')}catch(e){}SESSION=null;if(HOSTED){location.replace('/portal/');return}location.hash='';location.reload()})}
