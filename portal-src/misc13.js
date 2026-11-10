/* ═══════════ v13: PAID FEATURES, LOGOS, MORE PROSPECTS, THE HERO PIECE, THE DEMO ═══════════ */

/* ── 1. Paid features: only Scope & Lens can switch them on, and only what is switched on works ── */
function isFounderC(){return !!(SESSION&&(SESSION.founder||/@scopeandlens\.com$/i.test(SESSION.email||'')))}
isPremium=function(){try{return !!(DEMO_MODE||(S&&S.setup&&S.setup.premium)||isFounderC())}catch(e){return false}};
const _vAdmin13=VIEWS.admin;VIEWS.admin=function(){if(!isFounderC())return '<div class="card empty">This page is for Scope &amp; Lens.</div>';return _vAdmin13()};
/* the Manage access toggles: only Scope & Lens sees them as switches; everyone else would see a lock (and the server refuses anyway) */
const _adminAfter13=VIEWS.admin_after;VIEWS.admin_after=async function(){await _adminAfter13.apply(this,arguments);if(isFounderC())return;$$('#adminBody .og-p input').forEach(i=>{i.disabled=true;i.title='Only Scope & Lens can change this'})};
/* Pitch intelligence: no data in the browser unless it is switched on for this agency */
const _intelLoad13=INTEL.load;INTEL.load=async function(){await _intelLoad13.apply(this,arguments);if(!(DEMO_MODE||isFounderC()||(SESSION&&SESSION.intel)||INTEL.access)){INTEL.rows=[];INTEL.enabled=false}};

/* ── 2. A real logo on every organisation ── */
let DOM_Q=new Set(),DOM_T=null;const DOM_TRIED=new Set();
const _logo13=logo;logo=function(a,sz){const n=typeof a==='string'?a:(a&&a.name)||'';if(!domainOf(a)){const d=(S&&S.domains||{})[norm(n)];if(d){DOMAINS[n]=d;if(a&&typeof a==='object'&&!a.domain)a.domain=d}else if(n&&!DEMO_MODE&&!DOM_TRIED.has(norm(n))){DOM_Q.add(n);clearTimeout(DOM_T);DOM_T=setTimeout(domFetch,400)}}
  return String(_logo13(a,sz)).replace('<span class="lg"','<span class="lg" data-org="'+esc(n)+'"')};
async function domFetch(){const names=[...DOM_Q].slice(0,30);DOM_Q=new Set([...DOM_Q].slice(30));names.forEach(n=>DOM_TRIED.add(norm(n)));if(!names.length||typeof isLive!=='function'||!isLive())return;
  try{const j=await api('domain',{method:'POST',body:{names}});S.domains=S.domains||{};let got=0;
    Object.entries(j.domains||{}).forEach(([n,d])=>{S.domains[norm(n)]=d||'';if(d){got++;DOMAINS[n]=d;const a=findAccountByName&&findAccountByName(n);if(a&&!a.domain)a.domain=d;
      $$('.lg[data-org="'+CSS.escape(n)+'"]').forEach(el=>{if(el.querySelector('img'))return;const sz=el.style.width;el.outerHTML=_logo13(n,parseInt(sz)||40).replace('<span class="lg"','<span class="lg" data-org="'+esc(n)+'"')})}});
    if(got)save()}catch(e){}if(DOM_Q.size)DOM_T=setTimeout(domFetch,600)}

/* ── 3. More prospects, from the agency's own preferences ── */
async function findMorePros(){if(!isLive()){toast('Finding more prospects works on the live portal');return}const P=S.setup.profile||{};const b=$('#morePros');if(b){b.disabled=true;b.innerHTML='<span class="spin"></span>Scout is searching';}
  try{const j=await api('discover',{method:'POST',body:{sectors:P.sectors||[],size:P.csize||P.size||[],region:P.region||'any',problems:(P.problems||[]).map(k=>(L_PROBLEMS[k]||{label:k}).label),exclude:PROSPECTS.map(p=>p.name).concat(S.accounts.map(a=>a.name))}});
    const add=(j.companies||[]).filter(co=>!PROSPECTS.some(p=>norm(p.name)===norm(co.name)));
    add.forEach(co=>{PROSPECTS.push({name:co.name,sector:co.sector,sub:co.sub,city:co.city,region:co.region,size:co.size,nt:'none',nd:'',news:'',src:'',pub:'',all:[],domain:co.domain,found:today()});DOMAINS[co.name]=co.domain});
    S.foundPros=(S.foundPros||[]).concat(add.map(co=>Object.assign({},co,{found:today()}))).slice(-400);save();
    toast(add.length?'🎯 Scout found '+add.length+' more prospects that fit':'Nothing new fits right now. Try widening Who you want.');go('prospects','brands',true)}
  catch(e){toast(e.message||'Scout could not search just now');if(b){b.disabled=false;b.textContent='Find more prospects'}}}
/* prospects found before come back on every visit */
setTimeout(()=>{try{(S.foundPros||[]).forEach(co=>{if(!PROSPECTS.some(p=>norm(p.name)===norm(co.name))){PROSPECTS.push({name:co.name,sector:co.sector,sub:co.sub,city:co.city,region:co.region,size:co.size,nt:'none',nd:'',news:'',src:'',pub:'',all:[],domain:co.domain,found:co.found});DOMAINS[co.name]=co.domain}})}catch(e){}},0);

/* ── 4. Who to target: the second tab is Find decision makers ── */
const _vPros13=VIEWS.prospects;VIEWS.prospects=function(tab){let h=String(_vPros13(tab)).replace(/>Your list(?=<i>|<\/button>)/g,'>Find decision makers');
  if((tab||'brands')==='brands'&&profDone()&&!DEMO_MODE)h=h.replace(/(<div class="profchips[^"]*">)/,'<div class="morebar"><span>'+ico('target')+'<b>'+PROSPECTS.map(fitP).filter(Boolean).length+' brands fit what you want.</b> Want more? Scout can search for organisations that match your preferences.</span><button class="btn btn-line btn-sm" id="morePros" onclick="findMorePros()">'+ico('plus')+'Find more prospects</button></div>$1');
  return h};

/* ── 5. The demo: leaving it takes you back to your own workspace, where you left it ── */
function hasProgress(s){s=s||S;return !!(s&&((s.setup&&s.setup.agency&&s.setup.agency!=='Your agency')||(s.campaigns||[]).some(c=>!(isBlankCamp(c)&&!c.touched))))}
endDemo=function(){if(!DEMO_MODE)return;['tourHole','tourCard','tourBlock'].forEach(id=>{const e=$('#'+id);if(e)e.remove()});DEMO_MODE=false;S=REAL_S;REAL_S=null;S.walked=true;save();renderShell();mountDot();closeOverlays();
  if(hasProgress()){go('home');toast('Back to your workspace, just as you left it')}
  else{go('agency');setTimeout(()=>platoNudge('Now yours. Start with your agency profile: who you are, why you, and your assets. Then I will build your first campaign with you, step by step.',['Guide me',"coachStart()"]),500)}};
/* nothing syncs while the demo is open, so it can never touch the real workspace */
const _syncPull13=syncPull;syncPull=function(){if(DEMO_MODE)return Promise.resolve();return _syncPull13.apply(this,arguments)};
const _syncPush13=syncPush;syncPush=function(){if(DEMO_MODE)return Promise.resolve();return _syncPush13.apply(this,arguments)};
const _renderShell13=renderShell;renderShell=function(){_renderShell13.apply(this,arguments);if(DEMO_MODE&&REAL_S&&hasProgress(REAL_S)){const b=$('.demo-rib button');if(b)b.textContent='Back to my workspace'}};

/* ── 6. The hero piece: read properly, explained, and a blurb you can edit ── */
function pieceLocal(it){const t=String(it.text||'').replace(/\s+/g,' ').trim();const sents=t.split(/(?<=[.!?])\s+/).filter(s=>s.length>40).slice(0,3);
  return{read:t?'file':'title',what:sents[0]||'',why:sents[1]||'',who:'',blurb:sents.length?sents.slice(0,2).join(' '):'',hooks:[],note:t?'Read in this browser. On the live portal Muse reads it in full.':'We could not read the piece itself. Upload the file, or add a link to a page with the words on it.'}}
async function pieceRead(id){const c=curCamp();const it=bankOf(c).items.find(x=>x.id===id);if(!it)return;pieceModal(it,null);
  let r=null;const P=S.setup.profile||{};
  if(isLive()){try{r=await api('piece',{method:'POST',body:{title:it.t,url:it.url||'',text:(it.text||'').slice(0,16000),kind:(BANK_SLOTS.find(s=>s.k===it.slot)||{l:'hero piece'}).l,agency:S.setup.agency,sectors:(P.sectors||[]).map(k=>(L_SECTORS[k]||{label:k}).label),roles:(P.roles||[]).map(k=>(L_ROLES[k]||{label:k}).label),problem:PROB().short}})}catch(e){r=null}}
  if(!r||(!r.what&&!r.note))r=pieceLocal(it);it.ai=Object.assign({},r,{at:today()});if(!it.blurb&&r.blurb)it.blurb=r.blurb;save();pieceModal(it,r)}
function pieceModal(it,r){const k=(BANK_SLOTS.find(s=>s.k===it.slot)||{l:'Piece'}).l;
  if(!r){modal('<div class="pc-load">'+agentFace('give',56,{badge:false})+'<h2>Muse is reading '+esc(it.t)+'</h2><p class="sub">Working out what it is, why your prospects would value it, and a blurb to share it with.</p><div class="pc-bar"><i></i></div></div>');return}
  modal('<div class="row" style="gap:12px;align-items:flex-start">'+agentFace('give',44,{badge:false})+'<div class="grow"><small class="muted">'+esc(k)+' · '+(r.read==='file'?'read from your file':r.read==='link'?'read from the link':'only the title')+'</small><h2 style="margin-top:2px">'+esc(it.t)+'</h2></div></div>'+
    (r.note&&!r.what?'<p class="pc-note">'+ico('info')+esc(r.note)+'</p>':'')+
    '<div class="field"><label for="pcWhat">What it is</label><textarea class="inp" id="pcWhat" rows="2">'+esc(r.what||'')+'</textarea></div>'+
    '<div class="field"><label for="pcWhy">Why your prospects would value it</label><textarea class="inp" id="pcWhy" rows="3">'+esc(r.why||'')+'</textarea></div>'+
    (r.who?'<p class="small" style="margin:-4px 0 12px"><b>Most useful to:</b> '+esc(r.who)+'</p>':'')+
    '<div class="field"><label for="pcBlurb">The blurb you share it with <span class="muted">· edit it so it sounds like you</span></label><textarea class="inp" id="pcBlurb" rows="4">'+esc(it.blurb||r.blurb||'')+'</textarea></div>'+
    ((r.hooks||[]).length?'<div class="pc-hooks"><b>Reasons to open it</b>'+r.hooks.map(h=>'<span>'+esc(h)+'</span>').join('')+'</div>':'')+
    '<div class="modal-foot"><button class="btn btn-ghost" onclick="pieceRead(\''+it.id+'\')">'+ico('loop')+'Read it again</button><button class="btn btn-primary" onclick="pieceSave(\''+it.id+'\')">Save</button></div>')}
function pieceSave(id){const c=curCamp();const it=bankOf(c).items.find(x=>x.id===id);if(!it)return;act('Saved what Muse understood',()=>{it.ai=Object.assign({},it.ai||{},{what:$('#pcWhat').value.trim(),why:$('#pcWhy').value.trim()});it.blurb=$('#pcBlurb').value.trim();it.edited=today()},{refresh:false,ic:'✍️'});closeOverlays();go('give',null,true)}
/* after adding a piece with a file or link, Muse reads it straight away */
const _bankSaveOwn13=bankSaveOwn;bankSaveOwn=function(){const c=curCamp();const n0=bankOf(c).items.length;const hadText=!!BK_TEXT;const url=($('#bkU')||{}).value;_bankSaveOwn13();const it=bankOf(c).items[n0];
  if(it&&(hadText||url))setTimeout(()=>pieceRead(it.id),250);else if(it&&it.slot==='hero')setTimeout(()=>pieceModal(it,pieceLocal(it)),250)};
/* show what Muse understood under the content bank, with a way to edit it */
const _bankCard13=bankCard;bankCard=function(c){const h=String(_bankCard13(c));const I=bankOf(c).items.filter(x=>x.src==='own');if(!I.length)return h;
  return h+'<div class="pcs"><div class="lab">'+agentFace('give',22,{badge:false})+'What Muse understood from your content</div><div class="pcs-g">'+I.map(it=>{const k=(BANK_SLOTS.find(s=>s.k===it.slot)||{l:''}).l;const ai=it.ai;
    return '<div class="pcc'+(it.slot==='hero'?' hero':'')+'"><small>'+esc(k)+'</small><b>'+esc(it.t)+'</b>'+(ai&&(ai.why||ai.what)?'<p>'+esc(ai.why||ai.what)+'</p>':'<p class="muted">Not read yet.</p>')+(it.blurb?'<blockquote>'+esc(it.blurb)+'</blockquote>':'')+'<div class="row" style="gap:6px"><button class="btn btn-line btn-xs" onclick="'+(ai?'pieceModal(bankOf(curCamp()).items.find(x=>x.id===\''+it.id+'\'),bankOf(curCamp()).items.find(x=>x.id===\''+it.id+'\').ai)':'pieceRead(\''+it.id+'\')')+'">'+ico(ai?'edit':'eye')+(ai?'Edit the blurb':'Read it with Muse')+'</button></div></div>'}).join('')+'</div></div>'};
