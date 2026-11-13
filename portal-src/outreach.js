/* ═══════════ OUTREACH, THE PERMISSIONLESS WAY ═══════════
   Act like you would meeting someone in person for the first time. Everything here nudges toward that:
   a LinkedIn profile that does the talking, no note on the request, a content bank to trickle through,
   events and a workshop as the end point, phone only when it is warm, and direct mail done with some imagination. */
Object.assign(IC,{
  lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  monitor:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  pin:'<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-9 8"/>',
  map:'<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
  radar:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12l6-6"/>',
  sparkle:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17l.7 1.8 1.8.7-1.8.7L19 22l-.7-1.8-1.8-.7 1.8-.7z"/>'});

/* ── 1. LinkedIn profile, ready before any connection request ── */
function liState(){if(!S.li)S.li={c:{},skip:0};return S.li}
function liAud(){const P=S.setup.profile;const secs=(P.sectors||[]).slice(0,2).map(k=>secLabel(k).toLowerCase());return{secs:secs.length?secs.join(' and '):'consumer',sec:secs[0]||'consumer',prob:PROB().short,cap:mainDisc().cap,agency:S.setup.agency||'your agency',roles:(P.roles||[]).slice(0,2).map(r=>(L_ROLES[r]||{label:'marketing leaders'}).label.split(' or ')[0].toLowerCase())}}
function liChecks(){const A=liAud();const c=curCamp();const g=c&&toolById(c.assets[0]);const O=S.setup.offer;
  return[
  {k:'headline',t:'Your headline says who you help, not just your job title',why:'It sits next to your name on every request. It is the first thing they read.',sug:'Helping '+A.secs+' brands with '+A.prob+' | '+A.agency},
  {k:'about',t:'Your About section opens with their problem',why:'Two lines in, they should think "that is us".',sug:cap1(A.sec)+' marketing teams usually come to us when '+A.prob+(O.solution?'. '+cap1(lcf(O.solution))+'.':'. We help them fix it properly, and we show our working.')},
  {k:'featured',t:'Something useful is pinned in Featured',why:'Anyone who looks you up gets value before you have said a word.',sug:g?'Pin '+g.n.replace(/^The /,'the ')+' (or a short post about it) to the top of Featured.':'Choose what to give first, then pin it here.'},
  {k:'banner',t:'Your banner talks to them',why:'It is the biggest space on your profile. Use it to say who you are for.',sug:cap1(A.cap)+' for '+A.secs+' brands'},
  {k:'activity',t:'You have posted something useful in the last fortnight',why:'A quiet profile reads as a sales profile. A useful one reads as a peer.',sug:'Post one of the LinkedIn posts from your content bank.',bank:1},
  {k:'proof',t:'Your experience shows work they will recognise',why:'Proof from their world beats a long list of skills.',sug:'Add two or three '+A.sec+' results to your experience.'+(O.proof?' For example: '+O.proof.replace(/\.$/,'')+'.':'')}]}
function cap1(t){t=String(t||'');return t.charAt(0).toUpperCase()+t.slice(1)}
function liPct(){const L=liState();const C=liChecks();return Math.round(C.filter(x=>L.c[x.k]).length/C.length*100)}
function liTick(k){const L=liState();act(L.c[k]?'Unticked a profile check':'Profile check done',()=>{L.c[k]=L.c[k]?0:today()},{refresh:false,quiet:true,ic:'✅'});if(liPct()===100){award('liready');confetti(80);toast('✨ Profile ready. No note needed on your connection requests now.')}if($('.modal .lic'))liModal(true);else go(VIEW,VIEW_ARG,true)}
function liList(){const L=liState();return '<div class="lic">'+liChecks().map(x=>'<div class="lic-i'+(L.c[x.k]?' ok':'')+'"><button class="lic-b" onclick="liTick(\''+x.k+'\')" aria-pressed="'+(L.c[x.k]?'true':'false')+'" aria-label="Done: '+esc(x.t)+'">'+(L.c[x.k]?ico('check'):'')+'</button><div class="grow"><b>'+esc(x.t)+'</b><p>'+esc(x.why)+'</p>'+
  '<div class="lic-s"><span>'+esc(x.sug)+'</span>'+(x.bank?'<button class="btn btn-ghost btn-xs" onclick="closeOverlays();go(\'give\',\'bank\')">Open the content bank</button>':'<button class="btn btn-ghost btn-xs" onclick="copyText(this.previousElementSibling.textContent,this)">'+ico('copy')+'Copy Priya’s line</button>')+'</div></div></div>').join('')+'</div>'}
function liReadyCard(c){if(!c.reach.ch.includes('linkedin'))return '';const p=liPct();const A=liAud();
  if(p===100)return '<div class="lir done">'+agentFace('reach',34,{badge:false})+'<span class="grow"><b>Your LinkedIn profile is ready for '+esc(A.secs)+' brands.</b> No note needed on your connection requests.</span><button class="btn btn-ghost btn-xs" onclick="liModal()">Check it again</button></div>';
  return '<div class="card lir" id="lir"><div class="lir-h">'+agentFace('reach',48,{badge:false})+'<div class="grow"><div class="lab" style="margin:0">Before you connect with anyone</div><h3>Get your LinkedIn profile ready for '+esc(A.secs)+' brands</h3><p class="small">They will look you up before they accept. Dial your profile in for exactly who you are going after, and you will not need a note on your connection requests at all.</p></div>'+ring(p,62)+'</div>'+liList()+'</div>'}
function liModal(again){const p=liPct();modal('<div class="row" style="gap:14px;align-items:center">'+agentFace('reach',52,{badge:false})+'<div class="grow"><h2 style="margin:0">Your LinkedIn profile, for '+esc(liAud().secs)+' brands</h2><p class="sub" style="margin:4px 0 0">'+p+'% ready. Get this right and the no-note request does the work for you.</p></div></div>'+liList()+
  '<div class="modal-foot"><button class="btn btn-primary" onclick="closeOverlays()">'+(p===100?'All set':'Done for now')+'</button></div>',true)}
function ring(p,sz){sz=sz||60;const r=sz/2-5,C=2*Math.PI*r;return '<span class="mring" style="width:'+sz+'px;height:'+sz+'px"><svg viewBox="0 0 '+sz+' '+sz+'"><circle cx="'+sz/2+'" cy="'+sz/2+'" r="'+r+'" class="t"/><circle cx="'+sz/2+'" cy="'+sz/2+'" r="'+r+'" class="v" stroke-dasharray="'+(C*p/100)+' '+C+'" transform="rotate(-90 '+sz/2+' '+sz/2+')"/></svg><b>'+p+'%</b></span>'}

/* ── 2. The content bank: the engine of every campaign ── */
const BANK_SLOTS=[
  {k:'hero',l:'The hero piece',ic:'gift',need:1,core:1,d:'A downloadable report or a free tool. Everything else points back to it.'},
  {k:'case',l:'Case studies',ic:'chart',need:1,core:1,d:'Proof you have fixed this before. Real ones only.'},
  {k:'lipost',l:'LinkedIn posts',ic:'linkedin',need:3,core:1,d:'Short, useful posts that keep you visible between messages.'},
  {k:'blog',l:'Blog posts',ic:'doc',need:2,core:1,d:'Somewhere to send people, and something new to share every few weeks.'},
  {k:'video',l:'Personalised videos',ic:'play',need:1,core:0,d:'Two minutes, recorded for one person. Save these for the warmest brands.'},
  {k:'screen',l:'Screen recordings',ic:'monitor',need:1,core:0,d:'A walk through the tool, so they can use it without you.'}];
const TOOLISH=['scorecard','calculator','benchmark','audit','map'];
function heroIsTool(c){const g=toolById(c.assets[0]);return !!(g&&TOOLISH.includes(g.f))}
function bankOf(c){if(!c.bank)c.bank={items:[],hero:0};return c.bank}
function bankItems(c){const B=bankOf(c);const out=[];const g=toolById(c.assets[0]);
  if(g)out.push({id:'hero',slot:'hero',t:g.n,status:B.hero?'ready':'draft',src:'gift',note:B.hero?'Made and ready to send':'Chosen. Tick it when it is made.'});
  libState().items.filter(x=>x.cat==='case').forEach(x=>out.push({id:'lib:'+x.id,slot:'case',t:libName(x.name),status:'ready',src:'lib',note:'From your library'}));
  return out.concat(B.items)}
function bankSlots(c){const I=bankItems(c);const tool=heroIsTool(c);return BANK_SLOTS.map(s=>{const it=I.filter(x=>x.slot===s.k);const ready=it.filter(x=>x.status==='ready').length;const core=s.core||(s.k==='screen'&&tool);
  return Object.assign({},s,{core,items:it,ready,drafts:it.length-ready,ok:ready>=s.need})})}
function bankPct(c){const S2=bankSlots(c);const want=S2.filter(s=>s.core);return Math.round(sum(want,s=>Math.min(s.need,s.ready))/Math.max(1,sum(want,s=>s.need))*100)}
function bankReady(c){return bankSlots(c).filter(s=>s.core).every(s=>s.ok)}
function bankGaps(c){return bankSlots(c).filter(s=>s.core&&!s.ok)}
/* Gus drafts from what you have told us. Placeholders in [brackets] are where your own knowledge goes. Nothing is invented. */
function makerDraft(k,c){const A=liAud();const g=toolById(c.assets[0]);const asset=g?g.n.replace(/^The /,'the '):'[your hero piece]';const proof=(S.setup.offer.proof||'').replace(/\.$/,'');const n=bankOf(c).items.filter(x=>x.slot===k).length;
  const D={
  lipost:[
    {t:'The problem, said plainly',body:'Most '+A.sec+' brands we talk to say the same thing about '+A.prob+': they know it matters, and it keeps slipping down the list.\n\nThe question we always ask first: [the one question you ask].\n\nIf the answer is [the answer that worries you], that is where the work starts.\n\nWe put what we know into '+asset+'. Message me and it is yours. No form, no follow-up ambush.'},
    {t:'The gift',body:'We made something for '+A.sec+' marketing teams: '+asset+'.\n\nIt is built around '+A.prob+', and it takes about ten minutes.\n\nWhat you get: [the one thing they walk away with].\n\nComment or message me and I will send it over.'},
    {t:'The proof',body:proof?'A result we are proud of: '+lcf(proof)+'.\n\nWhat made the difference: [the one decision that mattered].\n\nIf '+A.prob+' is on your list this year, happy to share how we got there.':'A result we are proud of: [a real result, in one line].\n\nWhat made the difference: [the one decision that mattered].\n\nIf '+A.prob+' is on your list this year, happy to share how we got there.'},
    {t:'A myth worth busting',body:'A myth about '+A.prob+' we hear all the time: [the myth].\n\nWhat we actually see: [what you see instead].\n\nThe fix is rarely bigger budgets. It is usually [your point of view].'}],
  blog:[
    {t:'Why '+A.prob+' keeps happening, and what to check first',body:'Outline\n1. The problem in one paragraph, in their words\n2. Why it happens: [two or three causes you see most]\n3. The ten minute check (point to '+asset+')\n4. What good looks like: [a real example, named only with permission]\n5. One thing to do this week'},
    {t:'A '+A.sec+' guide to '+A.prob,body:'Outline\n1. What is changing in '+A.sec+' right now: [your view]\n2. Three questions every marketing lead should be able to answer\n3. Where most teams go wrong: [your point of view]\n4. How to use '+asset+'\n5. If you want a hand: the free workshop'},
    {t:'What we learned from [a piece of work]',body:'Outline\n1. The brief, in one line\n2. What we expected\n3. What actually happened: [the real result]\n4. What we would tell any '+A.sec+' brand now'}],
  video:[{t:'Personalised video script',body:'Two minutes, one person. Record over their website or latest ad.\n\n0:00  Say their name and the brand. Smile, you are not a robot.\n0:10  Why you are recording this: you spotted [their news, or something on their site].\n0:30  The one thing you noticed about '+A.prob+', shown on screen.\n1:20  What you would do about it, in a sentence.\n1:40  Offer '+asset+'. No ask beyond that.'}],
  screen:[{t:'Screen recording: how to use '+asset,body:'Three minutes, no talking head needed.\n\n0:00  What the tool does, in one line.\n0:15  Fill it in with a real example: [an example from their world].\n1:30  How to read the result.\n2:30  What to do next, and that you are happy to walk them through it.'}]}[k]||[];
  return D.length?D[n%D.length]:null}
function bankAdd(k,how){const c=curCamp();const B=bankOf(c);
  if(how==='maker'){const d=makerDraft(k,c);if(!d)return;const want=k==='lipost'?Math.max(1,3-B.items.filter(x=>x.slot==='lipost').length):1;const made=[];
    for(let i=0;i<want;i++){const x=makerDraft(k,c);if(i&&x.t===made[made.length-1].t)break;const it={id:uid(),slot:k,t:x.t,body:x.body,status:'draft',src:'maker',at:today()};B.items.push(it);made.push(it)}
    save();award('bank');toast('✍️ Gus drafted '+(made.length>1?made.length+' '+BANK_SLOTS.find(s=>s.k===k).l.toLowerCase():'one')+'. Give it a read and make it yours.');go('give','bank',true);return}
  modal('<h2>Add to the content bank</h2><p class="sub">Something you have already made, or are about to. A title and a link is plenty.</p>'+
    '<div class="field"><label>What kind</label><select class="inp" id="bkS">'+BANK_SLOTS.filter(s=>s.k!=='hero').map(s=>'<option value="'+s.k+'"'+(s.k===k?' selected':'')+'>'+s.l+'</option>').join('')+'</select></div>'+
    '<div class="field"><label>Title</label><input class="inp" id="bkT" placeholder="e.g. Our Greggs case study"></div><div class="field"><label>Link (optional)</label><input class="inp" id="bkU" placeholder="https://"></div>'+
    '<div class="modal-foot"><button class="btn btn-ghost" onclick="closeOverlays()">Cancel</button><button class="btn btn-primary" onclick="bankSaveOwn()">Add it as ready</button></div>');setTimeout(()=>$('#bkT')&&$('#bkT').focus(),60)}
function bankSaveOwn(){const t=$('#bkT').value.trim();if(!t){$('#bkT').focus();return}const c=curCamp();const k=$('#bkS').value;act('Added to the content bank',()=>{bankOf(c).items.push({id:uid(),slot:k,t,url:$('#bkU').value.trim(),status:'ready',src:'own',at:today()})},{refresh:false,ic:'📚'});closeOverlays();go('give','bank',true)}
function bankOpen(id){const c=curCamp();const it=bankItems(c).find(x=>x.id===id);if(!it)return;const own=bankOf(c).items.includes(it);
  if(it.slot==='hero'){act(bankOf(c).hero?'Hero piece back to in progress':'Hero piece is made',()=>{bankOf(c).hero=bankOf(c).hero?0:today()},{refresh:false,ic:'🎁'});go('give','bank',true);return}
  if(!own){go('library');return}
  modal('<div class="row" style="gap:12px;align-items:center">'+agentFace('give',44,{badge:false})+'<div class="grow"><div class="lab" style="margin:0">'+esc(BANK_SLOTS.find(s=>s.k===it.slot).l)+(it.src==='maker'?' · drafted by Gus':'')+'</div><input class="inp bk-ti" id="bkT2" value="'+esc(it.t)+'"></div></div>'+
    (it.body!=null?'<textarea class="inp" id="bkB2" rows="12" style="margin-top:12px">'+esc(it.body)+'</textarea><p class="tiny muted">Anything in [brackets] is where your own knowledge goes. Fill those in before you call it ready.</p>':'')+
    '<div class="field"><label>Link (optional)</label><input class="inp" id="bkU2" value="'+esc(it.url||'')+'" placeholder="Where it lives once it is published"></div>'+
    '<div class="modal-foot"><button class="lft btn btn-danger btn-sm" onclick="bankDel(\''+id+'\')">Remove</button>'+(it.body!=null?'<button class="btn btn-ghost" onclick="copyText($(\'#bkB2\').value,this)">'+ico('copy')+'Copy</button>':'')+'<button class="btn btn-line" onclick="bankSave(\''+id+'\',\'draft\')">Save as a draft</button><button class="btn btn-primary" onclick="bankSave(\''+id+'\',\'ready\')">'+ico('check')+'It is ready</button></div>',true)}
function bankSave(id,st){const c=curCamp();const it=bankOf(c).items.find(x=>x.id===id);if(!it)return;const b=$('#bkB2');if(st==='ready'&&b&&/\[[^\]]+\]/.test(b.value)){toast('✏️ There are still [brackets] to fill in. Make it yours first.');return}
  act(st==='ready'?'Ready: '+it.t:'Saved the draft',()=>{it.t=$('#bkT2').value.trim()||it.t;if(b)it.body=b.value;it.url=$('#bkU2').value.trim();it.status=st},{refresh:false,ic:'📚',quiet:st!=='ready'});closeOverlays();if(st==='ready'&&bankReady(c)){confetti(90);toast('📚 Content bank ready. You have enough to trickle through the whole campaign.')}go('give','bank',true)}
function bankDel(id){const c=curCamp();act('Removed from the content bank',()=>{bankOf(c).items=bankOf(c).items.filter(x=>x.id!==id)},{refresh:false});closeOverlays();go('give','bank',true)}
function bankCard(c){const sl=bankSlots(c);const p=bankPct(c);const ok=bankReady(c);const gaps=bankGaps(c);
  return '<section class="card bank" id="bank"><div class="bank-h">'+agentFace('give',54,{badge:false})+'<div class="grow"><div class="lab" style="margin:0">The engine of the campaign</div><h2 class="h-m">Your content bank</h2><p class="small">One gift opens the door. A bank of useful pieces around '+esc(PROB().short)+' keeps it open, so you have something new to share every couple of weeks. '+(ok?'<b>Ready. You will not run dry.</b>':'<b>Outreach needs this ready before launch.</b>')+'</p></div>'+ring(p,72)+'</div>'+
  (gaps.length?'<div class="bank-gaps">'+ico('flag')+'<span><b>Still to sort:</b> '+gaps.map(s=>s.l.toLowerCase()+' ('+s.ready+' of '+s.need+')').join(', ')+'</span></div>':'')+
  '<div class="bank-g">'+sl.map(s=>'<div class="bk'+(s.ok?' ok':'')+(s.core?'':' opt')+'"><div class="bk-h"><span class="bk-ic">'+ico(s.ic)+'</span><div class="grow"><b>'+s.l+'</b><small>'+(s.core?(s.ok?'✓ '+s.ready+' ready':s.ready+' of '+s.need+' ready'):'Nice to have')+'</small></div></div><p class="tiny muted">'+esc(s.d)+'</p>'+
    (s.items.length?'<div class="bk-l">'+s.items.map(it=>'<button class="bki '+it.status+'" onclick="bankOpen(\''+it.id+'\')"><i>'+(it.status==='ready'?ico('check'):'✎')+'</i><span>'+esc(it.t)+'<small>'+esc(it.note||(it.status==='ready'?'Ready':'Draft · needs your eye'))+'</small></span></button>').join('')+'</div>':'')+
    (s.k==='hero'&&s.items.length?heroUrlField(c):'')+'<div class="bk-a">'+(s.k==='hero'?(s.items.length?'':'<button class="btn btn-primary btn-xs" onclick="document.querySelector(\'[data-tour=assets]\').scrollIntoView({behavior:\'smooth\'})">Choose what to give</button>'):s.k==='case'?'<button class="btn btn-line btn-xs" onclick="go(\'library\')">'+ico('upload')+'From your library</button><button class="btn btn-ghost btn-xs" onclick="bankAdd(\'case\')">'+ico('plus')+'Add a link</button>':
      '<button class="btn btn-line btn-xs" onclick="bankAdd(\''+s.k+'\',\'maker\')">'+ico('sparkle')+'Ask Gus to draft '+(s.k==='lipost'?'posts':s.k==='blog'?'an outline':'a script')+'</button><button class="btn btn-ghost btn-xs" onclick="bankAdd(\''+s.k+'\')">'+ico('plus')+'Add your own</button>')+'</div></div>').join('')+'</div>'+
  '<p class="tiny muted" style="margin-top:12px">Gus drafts, you decide. Every draft has [brackets] where your own knowledge goes, and nothing is marked ready until you have filled them in.</p></section>'}
/* a LinkedIn post from the bank, when the journey says "share the thinking publicly" */
function bankPost(c,seed){const L=bankItems(c).filter(x=>x.slot==='lipost'&&x.body);return L.length?L[seed%L.length]:null}

/* ── 3. Events, direct mail and trackable links ── */
const MAIL_IDEAS=[
  ['📘','A printed, bound copy of {asset}','With a handwritten note on the first page. Some things deserve better than an inbox.'],
  ['🖼️','A before and after postcard','Their homepage or latest ad today on the front, one idea for what it could be on the back.'],
  ['🌱','A packet of seeds, “for growing {brand}”','With a card carrying the one idea you think would make them grow.'],
  ['📰','Their own front page','A mock newspaper front page from a year from now, with the headline you would help them earn.'],
  ['🗓️','A desk calendar of ideas','Twelve months, one useful idea about {prob} each month. It stays on the desk all year.'],
  ['📦','One object in a box','Something that sums up {prob}, and a card explaining why. Odd enough to be remembered.']];
function mailIdeas(c,n){const a=campTargets(c)[0];const g=toolById(c.assets[0]);const f=t=>t.replace('{asset}',g?g.n.replace(/^The /,'the '):'your report').replace('{brand}',a?a.name:'them').replace('{prob}',PROB().short);
  return '<div class="mideas">'+MAIL_IDEAS.slice(0,n||6).map(x=>'<div class="mi"><span>'+x[0]+'</span><b>'+esc(f(x[1]))+'</b><p>'+esc(f(x[2]))+'</p></div>').join('')+'</div><p class="tiny muted" style="margin-top:8px">Keep it within the gift limit most companies set, and make it about them, not you.</p>'}
function eventSearch(q){return 'https://www.google.com/search?q='+encodeURIComponent(q)}
/* real, upcoming UK events (checked November 2026). Dates change, so every tile links to the organiser. */
const UK_EVENTS=[
  {n:'B2B Marketing Live',d:'2026-11-18',e:'2026-11-19',v:'ExCeL London',s:['b2b','tech'],u:'https://www.excel.london/whats-on/b2b-marketing-live'},
  {n:'Tech Show London',d:'2027-03-10',e:'2027-03-11',v:'ExCeL London',s:['tech','b2b','finance'],u:'https://www.eventbrite.com/e/tech-show-london-2027-tickets-1986059083181'},
  {n:'LIVE: Retail Week x The Grocer',d:'2027-03-18',v:'155 Bishopsgate, London',s:['retail','fmcg'],u:'https://live.retail-week.com/'},
  {n:'Advertising Week Europe',d:'2027-03-22',e:'2027-03-24',v:'180 Studios, London',s:['retail','fmcg','finance','travel','health','tech','auto','charity','b2b','media'],u:'https://advertisingweek.com/aweurope-2027/home/'},
  {n:'IFE, the International Food & Drink Event',d:'2027-04-05',e:'2027-04-07',v:'ExCeL London',s:['fmcg','retail','travel'],u:'https://www.ife.co.uk/'},
  {n:'Business Travel Show Europe',d:'2027-06-23',e:'2027-06-24',v:'ExCeL London',s:['travel','b2b'],u:'https://www.hospitalitynet.org/event/3007438/business-travel-show-europe-2027'}];
function evDate(e){const f=d=>new Date(d+'T12:00:00');const a=f(e.d);return{day:a.getDate()+(e.e?'–'+f(e.e).getDate():''),mon:a.toLocaleDateString('en-GB',{month:'short'}),yr:a.getFullYear()}}
function eventsCard(c){const tg=campTargets(c).slice(0,4);const A=liAud();const yr=new Date().getFullYear();const secs=S.setup.profile.sectors||[];
  const up=UK_EVENTS.filter(e=>(e.e||e.d)>=today()).map(e=>Object.assign({fit:e.s.filter(x=>secs.includes(x)).length},e)).sort((a,b)=>(b.fit>0)-(a.fit>0)||a.d.localeCompare(b.d)).slice(0,6);
  return '<div class="card evc"><div class="row" style="gap:12px;align-items:flex-start">'+agentFace('reach',40,{badge:false})+'<div class="grow"><div class="lab" style="margin:0">If you want to meet them, say so</div><h3>Find a room to meet them in</h3><p class="small">Upcoming UK events your prospects are likely to be at, and ways to find more.</p></div></div>'+
   '<div class="evg">'+up.map(e=>{const d=evDate(e);return '<a class="evt'+(e.fit?' evok':'')+'" href="'+e.u+'" target="_blank" rel="noopener"><span class="evt-d"><b>'+d.day+'</b><small>'+d.mon+' '+d.yr+'</small></span><b class="evt-n">'+esc(e.n)+'</b><small class="evt-v">'+ico('pin')+esc(e.v)+'</small>'+(e.fit?'<span class="evt-f">Fits your sectors</span>':'')+'</a>'}).join('')+
   tg.map(a=>'<a class="evt srch" target="_blank" rel="noopener" href="'+eventSearch('"'+a.name+'" marketing speaker '+yr)+'">'+logo(a,40)+'<b class="evt-n">Where '+esc(a.name)+' people are speaking</b><small class="evt-v">'+ico('search')+'Search talks and panels</small></a>').join('')+
   '<a class="evt srch" target="_blank" rel="noopener" href="'+eventSearch(A.sec+' marketing conference UK '+yr)+'"><span class="evt-ic">'+ico('search')+'</span><b class="evt-n">More '+esc(A.sec)+' events</b><small class="evt-v">Search conferences, awards and breakfasts</small></a>'+
   '<div class="evt own"><span class="evt-ic">'+ico('people')+'</span><b class="evt-n">Host your own</b><small class="evt-v">Breakfast for eight '+esc(A.sec)+' marketers, one topic: '+esc(A.prob)+'.</small></div></div><p class="tiny muted" style="margin-top:10px">Event dates checked November 2026. Confirm with the organiser before you book.</p></div>'}
function mailCard(c){return '<div class="card evc"><div class="row" style="gap:12px;align-items:flex-start">'+agentFace('give',40,{badge:false})+'<div class="grow"><div class="lab" style="margin:0">Real world, without the meeting</div><h3>Direct mail, done with imagination</h3><p class="small">It lands on a desk, not in an inbox. A few starting points from Gus:</p></div></div>'+mailIdeas(c,4)+'</div>'}
/* a trackable link for every person: hosted links log the click and feed Signals */
function trackUrl(c,a,p,s){const B=bankOf(c);const base=(B.heroUrl||'').trim();if(!base)return '';const code=(hsh(ME()+c.id+(p&&p.id)+(s&&s.id))>>>0).toString(36)+(hsh(c.id+(p&&p.id))%1296).toString(36);
  if(typeof isLive==='function'&&isLive()){LINKQ[code]={url:base,brand:a.name,person:p&&p.name||'',camp:c.id};linkSoon();return location.origin+'/l/'+code}
  return base+(base.includes('?')?'&':'?')+'utm_source=growth-portal&utm_medium='+(s&&s.ch||'email')+'&utm_campaign='+encodeURIComponent(c.name.toLowerCase().replace(/\W+/g,'-'))+'&utm_content='+encodeURIComponent((a.name+'-'+(p&&p.name||'')).toLowerCase().replace(/\W+/g,'-'))}
const LINKQ={};let LINK_T=null;
function linkSoon(){clearTimeout(LINK_T);LINK_T=setTimeout(async()=>{const items=Object.entries(LINKQ).map(([code,v])=>Object.assign({code},v));if(!items.length)return;try{await api('links',{method:'POST',body:{items}});items.forEach(x=>delete LINKQ[x.code])}catch(e){}},1500)}
async function pullClicks(){if(!(typeof isLive==='function'&&isLive()))return;try{const j=await api('links?since='+encodeURIComponent(S.clickSince||''));let n=0;(j.clicks||[]).forEach(k=>{const a=S.accounts.find(x=>norm(x.name)===norm(k.brand));if(a){addSignal(a,'click',{person:k.person,campaign:k.camp,date:String(k.at).slice(0,10)});n++}});if(j.now)S.clickSince=j.now;if(n){save();toast('🔗 '+n+' new click'+(n===1?'':'s')+' on your links')}}catch(e){}}
function heroUrlField(c){const B=bankOf(c);return '<div class="hurl">'+ico('link')+'<input class="inp" placeholder="Where your hero piece lives (a link). We add tracking for every person." value="'+esc(B.heroUrl||'')+'" onchange="setHeroUrl(this.value)"></div>'}
function setHeroUrl(v){const c=curCamp();act('Saved the link to your hero piece',()=>{bankOf(c).heroUrl=v.trim()},{refresh:false,quiet:true,ic:'🔗'});go(VIEW,VIEW_ARG,true)}

/* ── 4. Warm-only phone, and the queues that respect it ── */
function ptLookup(c,pid){for(const a of campTargets(c)){const p=a.people.find(q=>q.id===pid);if(p)return{a,p}}return null}
nextFor=function(c,pid,steps){let x;return steps.find(s=>{if(c.sent&&c.sent[pid+':'+s.id])return false;if(s.warm){x=x||ptLookup(c,pid);if(!x||!warmReady(x.a,x.p))return false}return true})};
function bankStrip(c){const ok=bankReady(c);const g=bankGaps(c);return '<div class="lir bks'+(ok?' done':'')+'">'+agentFace('give',34,{badge:false})+'<span class="grow"><b>'+(ok?'Content bank ready.':'Content bank '+bankPct(c)+'% ready.')+'</b> '+(ok?'Plenty to trickle through over '+c.reach.weeks+' weeks.':'Still to sort: '+g.map(s=>s.l.toLowerCase()).join(', ')+'. Without it, the journey runs dry by week three.')+'</span><button class="btn btn-'+(ok?'ghost':'line')+' btn-xs" onclick="go(\'give\',\'bank\')">'+(ok?'Open it':'Ask Gus to help')+'</button></div>'}
setInterval(()=>{if(S&&document.visibilityState==='visible')pullClicks()},300000);
const _adminAfter=VIEWS.admin_after;VIEWS.admin_after=async()=>{await _adminAfter();const el=$('#adminBody');if(el&&!$('#intelAdm')){el.insertAdjacentHTML('beforeend',intelAdminCard());intelAdminLoad()}};
