/* ═══════════ v12.5: CAMPAIGN PERFORMANCE, SIGNALS & INTENT, AND A ROUND OF FIXES ═══════════
   1. Campaign performance is its own section: a tile per campaign, each opening outreach and ads results.
   2. Signals becomes Signals & Intent: one prioritised grid of organisations and the people engaging,
      with the brands and deals that can close the revenue gap.
   3. Scores are harder to earn and follow real intent: replies, meetings, more people engaging, deals and wins.
   4. Twelve-week campaigns by default, so a year is four quarterly campaigns.
   5. Guides as PDFs in the style of a Scope & Lens proposal document.
   6. Smaller fixes: no scroll jumping, a collapsible sidebar, the targeting button, the Plato page header. */

/* ── 0. small helpers ── */
Object.assign(IC,{sidebar:'<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M9 4v16"/>',flame:'<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.2 1-3.6 2.2-4.8.3 1.6 1.1 2.6 2.3 2.8C11 8.6 11 5.6 12 3z"/>'});
const INBOUND=t=>{const d=SIGNALS[t];return !!d&&!['outbound','intel'].includes(d.fam)&&t!=='ad_view'};
const TALK=['reply','li_reply','meeting','call','referral'];
function pct(a,b){return b?Math.round(a/b*100):0}
function laneName(k){return (LANES.find(l=>l.k===k)||{l:k}).l}

/* ═══ 1. TWELVE WEEKS BY DEFAULT ═══ */
const _newCamp125=newCamp;newCamp=function(name){const c=_newCamp125(name);c.reach.weeks=12;c.blocks=c.blocks||[];return c};
recommendMix=function(){const c=curCamp();act('Using the Scope & Lens route',()=>{c.reach.ch=REC_CH.slice();c.reach.ads=true;c.reach.weeks=Math.max(12,c.reach.weeks||12);c.reach.steps=genSteps(c)},{refresh:false,ic:'✨'});go('reach',null,true)};

/* ═══ 2. SCORES THAT FOLLOW INTENT ═══
   Busywork earns very little. Intent earns most: the more people engaging, the more it is worth,
   and opportunities and wins are worth the most of all. */
LEVELS.splice(0,LEVELS.length,[0,'Warming up'],[250,'Door opener'],[650,'Conversation starter'],[1300,'Relationship builder'],[2300,'Pipeline maker'],[3800,'Rainmaker'],[6000,'Growth engine'],[9000,'Category magnet'],[13000,'New business legend']);
Object.assign(XP,{brand:3,person:5,gift:10,journey:10,launch:60,touch:5,approve:3,reply:60,meeting:120,deal:150,won:500,profile:20,swipe:1,copy:1,news:2,insight:2,compose:1,liready:20,bank:8,plan:10,scan:5,intent:1,engaged:25,hot:80,call:40});
Object.assign(XP_L,{intent:'Prospect engaged',engaged:'Another person engaged',hot:'Brand turned hot',call:'Call logged'});
let GQ=null;
const _addSignal125=addSignal;addSignal=function(a,type,o){
  if(!a||DEMO_MODE||!INBOUND(type))return _addSignal125(a,type,o);
  const n0=a.signals.length;const pre=GQ&&GQ.acc[a.id]?null:{heat:scoreAccount(a).heat,ppl:new Set(engagedPeople(a).map(p=>norm(p.name)))};
  const r=_addSignal125(a,type,o);if(a.signals.length===n0)return r;
  if(!GQ){GQ={acc:{},types:{}};setTimeout(flushIntent,60)}
  if(pre)GQ.acc[a.id]={a,heat:pre.heat,ppl:pre.ppl};GQ.types[type]=(GQ.types[type]||0)+1;return r};
function flushIntent(){const Q=GQ;GQ=null;if(!Q||!S||!S.game)return;let pts=0;
  Object.entries(Q.types).forEach(([t,n])=>{if(t==='reply'||t==='li_reply')award('reply',SIGNALS[t].l,n);else if(t==='meeting')award('meeting','Meeting booked',n);else if(t==='call')award('call','Call',n);
    else{const w=SIGNALS[t].w;pts+=Math.max(1,Math.round(w*(t==='email_open'||t==='li_engage'||t==='ad_engage'?.3:.6)))*n}});
  if(pts)award('intent','Prospects engaging',Math.min(pts,400));
  const moments=[];
  Object.values(Q.acc).forEach(x=>{const a=x.a;const s=scoreAccount(a);const ppl=engagedPeople(a);const fresh=ppl.filter(p=>!x.ppl.has(norm(p.name)));
    if(fresh.length&&ppl.length>1)award('engaged',a.name+': '+ppl.length+' people engaging',Math.min(5,ppl.length-1));
    const last=a.signals[a.signals.length-1];
    if(s.heat>=4&&x.heat<4){award('hot',a.name+' is hot');moments.push({a,s,ppl,big:true,last})}
    else if(s.heat>x.heat&&s.heat>=3||fresh.length&&ppl.length>=2||TALK.includes(last&&last.type))moments.push({a,s,ppl,big:false,last})});
  moments.sort((p,q)=>(q.big-p.big)||(q.s.score-p.s.score));moments.slice(0,2).forEach((m,i)=>setTimeout(()=>intentMoment(m),400+i*2600));
  if(moments.length>2)setTimeout(()=>toast('🔥 '+(moments.length-2)+' more brands warming up. See Signals & Intent.',{l:'Open',f:()=>go('signals')}),5800)}
/* the moment a prospect shows intent: exciting, not a fruit machine */
function intentMoment(m){if(!m||!m.a)return;const a=m.a,s=m.s;const L=m.last&&SIGNALS[m.last.type];
  const what=L?(m.last.person?m.last.person.split(' ')[0]+' · ':'')+L.l.toLowerCase():'new engagement';
  const el=document.createElement('div');el.className='ipop'+(m.big?' big':'');el.setAttribute('role','status');
  el.innerHTML='<span class="ip-pulse" style="--hc:'+s.colour+'"><i></i><i></i>'+logo(a,40)+'</span><div class="grow"><small>'+(m.big?'Intent spike':'Someone is leaning in')+'</small><b>'+esc(a.name)+(m.big?' just turned <span class="serif">hot.</span>':' is warming up.')+'</b><span>'+esc(what)+(m.ppl.length>1?' · '+m.ppl.length+' people engaging':'')+'</span></div>'+
    '<button class="btn btn-primary btn-xs" data-a="'+a.id+'">See who</button><button class="icon-btn ip-x" aria-label="Dismiss">'+ico('x')+'</button>';
  document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add('on'));if(m.big)confetti(36);
  const kill=()=>{el.classList.remove('on');setTimeout(()=>el.remove(),400)};el.querySelector('.ip-x').onclick=kill;el.querySelector('[data-a]').onclick=()=>{kill();go('signals');setTimeout(()=>{const t=$('[data-org="'+a.id+'"]');if(t){t.scrollIntoView({block:'center',behavior:'smooth'});t.classList.add('flash')}},250)};
  setTimeout(kill,m.big?9000:6500)}

/* ═══ 3. CAMPAIGN PERFORMANCE ═══ */
PAGES.push('perf');SIDE_IC.perf='chart';
const sigM=MODULES.find(m=>m.k==='signals');if(sigM){sigM.l='Signals & Intent';sigM.t='Signals & Intent';sigM.d='Where to lean in';sigM.why='Every engagement across all your campaigns, in one prioritised view: which organisations are showing intent, who is engaging, and where the money is.'}
function campAccounts(c){const ids=new Set(c.targets||[]);S.accounts.forEach(a=>{if((a.signals||[]).some(s=>s.campaign===c.id))ids.add(a.id)});return [...ids].map(accountById).filter(Boolean)}
function campSigs(c,a){const inT=(c.targets||[]).includes(a.id);return (a.signals||[]).filter(s=>s.campaign===c.id||(!s.campaign&&inT))}
function campWk(c){const W=c.reach&&c.reach.weeks||12;if(!c.launched)return{n:0,W};return{n:Math.min(W,Math.floor(daysAgo(c.launched)/7)+1),W}}
function campStatus(c){if(c.paused||(c.amp&&c.amp.paused))return['Paused','warn'];if(campLive(c)){const w=campWk(c);return w.n>=w.W&&w.W?['Finished','mute']:['Live','good']}return['Building','mute']}
function campPerf(c){const accs=campAccounts(c);const tg=campTargets(c);let eng=0,engP=0,talks=0,meet=0,touches=Object.keys(c.sent||{}).length;const byType={};const heatAcc=[];
  accs.forEach(a=>{const ss=campSigs(c,a).filter(s=>INBOUND(s.type));if(ss.length)eng++;const pp=new Set(ss.map(s=>s.person).filter(Boolean));engP+=pp.size;ss.forEach(s=>{byType[s.type]=(byType[s.type]||0)+(s.qty||1);if(TALK.includes(s.type)&&s.type!=='meeting')talks++;if(s.type==='meeting')meet++});
    if(ss.length){const sc=scoreAccount(Object.assign({},a,{signals:campSigs(c,a)}));heatAcc.push({a,s:sc,ppl:pp.size})}});
  touches+=S.activity.filter(x=>x.campaign===c.id&&!c.sent).length;
  const opps=S.opps.filter(o=>o.lane!=='lost'&&oppCampId(o)===c.id);
  const open=opps.filter(o=>o.lane!=='won'),won=opps.filter(o=>o.lane==='won');
  return{accs,brands:tg.length,people:sum(tg,a=>a.people.length),touches,eng,engP,talks,meet,byType,opps,open,won,oppVal:sum(open,o=>+o.value||0),wonVal:sum(won,o=>+o.value||0),hot:heatAcc.sort((x,y)=>y.s.score-x.s.score)}}
/* which campaign a deal came from: its own tag, or the most recent live campaign that had the brand before the deal opened */
function oppCampId(o){if(o.campaign)return o.campaign;const at=o.created||today();const C=S.campaigns.filter(c=>c.launched&&c.launched<=at&&(c.targets||[]).includes(o.accountId)).sort((x,y)=>String(y.launched).localeCompare(String(x.launched)));
  if(C.length)return C[0].id;const any=S.campaigns.filter(c=>c.launched&&(c.targets||[]).includes(o.accountId));return any.length===1?any[0].id:null}
function realCamps(){return S.campaigns.filter(c=>!(isBlankCamp(c)&&!c.touched))}
VIEWS.perf=(id)=>{const c=id&&S.campaigns.find(x=>x.id===id);return c?perfDetail(c):perfGrid()};
function perfGrid(){const C=realCamps();const St=C.map(c=>({c,x:campPerf(c)}));
  const T={live:C.filter(c=>campStatus(c)[0]==='Live').length,people:sum(St,y=>y.x.people),eng:sum(St,y=>y.x.eng),talks:sum(St,y=>y.x.talks+y.x.meet),opps:sum(St,y=>y.x.opps.length),val:sum(St,y=>y.x.oppVal),won:sum(St,y=>y.x.wonVal)};
  const head='<div class="sh plain"><div class="sh-l"><h1 class="sh-t">Campaign <span class="serif">performance.</span></h1><p class="sh-p">How each campaign is doing: who you reached, who engaged, and the opportunities it made. Tap a campaign to see its outreach and ads results.</p></div><div class="sh-a"><button class="btn btn-line btn-sm" onclick="go(\'signals\')">'+ico('pulse')+'Signals & Intent</button></div></div>';
  if(!C.length)return head+'<div class="card empty"><div class="orb"></div><b>No campaigns yet</b>Build your first campaign and its results land here.<div style="margin-top:14px"><button class="btn btn-primary" onclick="newCampaignFlow()">'+ico('plus')+'New campaign</button></div></div>';
  const k=[['layers','Live campaigns',T.live],['people','People reached',T.people],['pulse','Brands engaging',T.eng],['chat','Conversations',T.talks],['flag','Opportunities',T.opps],['pound','Pipeline',money(T.val,true)],['trophy','Won',money(T.won,true)]];
  return head+'<div class="kstrip pf-k">'+k.map(x=>'<div class="ks"><span class="gi">'+ico(x[0])+'</span><b class="num">'+x[2]+'</b><span>'+x[1]+'</span></div>').join('')+'</div>'+
    '<div class="pfg">'+St.map(({c,x},i)=>{const st=campStatus(c);const w=campWk(c);
      return '<button class="pft" onclick="go(\'perf\',\''+c.id+'\')" style="animation-delay:'+Math.min(i,10)*40+'ms"><div class="pft-h"><b>'+esc(c.name)+'</b><span class="pill '+st[1]+'">'+st[0]+'</span></div>'+
        '<div class="pft-w"><span>'+(w.n?'Week '+w.n+' of '+w.W:w.W+' weeks planned')+'</span><i><em style="width:'+pct(w.n,w.W)+'%"></em></i></div>'+
        '<div class="pft-m"><div><b>'+x.people+'</b><small>People</small></div><div><b>'+x.eng+'</b><small>Engaging</small></div><div><b>'+(x.talks+x.meet)+'</b><small>Conversations</small></div><div class="hl"><b>'+x.opps.length+'</b><small>Opportunities</small></div></div>'+
        '<div class="pft-f"><span class="ppl">'+x.hot.slice(0,4).map(h=>'<i data-tip="'+esc(h.a.name)+'">'+esc(initials(h.a.name))+'</i>').join('')+'</span><span class="pft-v">'+(x.oppVal||x.wonVal?money(x.oppVal,true)+' pipeline'+(x.wonVal?' · '+money(x.wonVal,true)+' won':''):'No deals yet')+ico('arrow','a')+'</span></div></button>'}).join('')+'</div>'+
    '<p class="tiny muted" style="margin-top:14px">Opportunities count deals with brands from that campaign. Results come from Amplify when it is switched on, from files you upload, or from numbers you enter on each campaign.</p>'}
function blockOf(c,type){return (c.blocks||[]).find(b=>b.type===type)}
function srcTag(b,fallback){if(b&&b.manual)return 'Entered by hand '+rel(b.manual);if(b&&b.file)return 'Uploaded '+rel(b.fileAt);if(S.launch.connected)return 'Live from Amplify';return fallback||'From your logged activity'}
function perfDetail(c){const x=campPerf(c);const st=campStatus(c);const w=campWk(c);const bt=x.byType;
  const persons=t=>{const s=new Set();x.accs.forEach(a=>campSigs(c,a).forEach(g=>{if(g.type===t)s.add(a.id+':'+(g.person||g.id))}));return s.size};
  const em=blockOf(c,'email_seq'),li=blockOf(c,'li_out'),ad=blockOf(c,'li_ads');const M=(b,k,f)=>b&&b.metrics&&b.metrics[k]!=null?+b.metrics[k]:f;
  const emailSent=Object.entries(c.sent||{}).filter(([k])=>{const id=k.split(':')[1];const s=(c.reach.steps||[]).find(z=>z.id===id);return s&&s.ch==='email'}).length;
  const E={sent:M(em,'Contacted',Math.max(emailSent,persons('email_open'),persons('email_click'),persons('reply'))),open:M(em,'Opened',persons('email_open')),click:M(em,'Clicked',persons('email_click')),reply:M(em,'Replied',persons('reply'))};
  const liSent=Object.entries(c.sent||{}).filter(([k])=>{const id=k.split(':')[1];const s=(c.reach.steps||[]).find(z=>z.id===id);return s&&s.ch==='linkedin'}).length;
  const Ln={sent:M(li,'Connections sent',Math.max(liSent,persons('li_accept'))),acc:M(li,'Accepted',persons('li_accept')),rep:M(li,'Replies',persons('li_reply')),eng:persons('li_engage')};
  const adOrgs=x.accs.filter(a=>campSigs(c,a).some(s=>/^ad_/.test(s.type))).length;
  const A={imp:M(ad,'Impressions',null),orgs:M(ad,'Organisations reached',adOrgs),click:M(ad,'Clicks',bt.ad_click||0),eng:M(ad,'Engagements',bt.ad_engage||0)};
  const card=(ic,t,b,rows,src,up)=>'<div class="card pfc"><div class="row between"><div class="row" style="gap:10px"><span class="gi">'+ico(ic)+'</span><h3>'+t+'</h3></div><small class="muted">'+esc(src)+'</small></div><div class="pfc-r">'+rows.map(r=>'<div><b>'+(r[1]==null?'–':r[1])+'</b><small>'+r[0]+'</small>'+(r[2]!=null?'<em>'+r[2]+'%</em>':'')+'</div>').join('')+'</div><div class="row wrap" style="gap:8px;margin-top:12px"><button class="btn btn-line btn-xs" onclick="openImport(\''+c.id+'\',\''+up+'\')">'+ico('upload')+'Upload a CSV</button><button class="btn btn-ghost btn-xs" onclick="perfEdit(\''+c.id+'\',\''+b+'\')">'+ico('edit')+'Enter numbers</button></div></div>';
  const fun=[['Brands targeted',x.brands],['People reached',x.people],['Touches sent',x.touches],['Brands engaging',x.eng],['Conversations',x.talks+x.meet],['Opportunities',x.opps.length],['Won',x.won.length]];const fmax=Math.max(1,...fun.map(f=>f[1]));
  /* engagement by week since launch */
  const wk=[];const W=Math.max(1,w.W);const L0=c.launched||c.created;for(let i=0;i<W;i++)wk.push(0);x.accs.forEach(a=>campSigs(c,a).forEach(s=>{if(!INBOUND(s.type))return;const d=Math.floor((new Date(s.date)-new Date(L0))/(7*DAY));if(d>=0&&d<W)wk[d]+=s.qty||1}));const wmax=Math.max(1,...wk);
  return '<button class="pf-back" onclick="go(\'perf\')">'+ico('arrow','l')+'All campaigns</button>'+
    '<div class="sh plain"><div class="sh-l"><h1 class="sh-t">'+esc(c.name)+'</h1><p class="sh-p"><span class="pill '+st[1]+'">'+st[0]+'</span> '+(w.n?'Week '+w.n+' of '+w.W+(c.launched?' · launched '+rel(c.launched):''):w.W+' weeks planned')+'</p></div><div class="sh-a"><button class="btn btn-line btn-sm" onclick="S.cur=\''+c.id+'\';save();go(\'launch\')">'+ico('rocket')+'Open in Launch</button></div></div>'+
    '<div class="kstrip pf-k">'+[['flag','Opportunities',x.opps.length],['pound','Pipeline',money(x.oppVal,true)],['trophy','Won',money(x.wonVal,true)],['chat','Replies',x.talks],['calendar','Meetings',x.meet],['pulse','Brands engaging',x.eng]].map(k=>'<div class="ks"><span class="gi">'+ico(k[0])+'</span><b class="num">'+k[2]+'</b><span>'+k[1]+'</span></div>').join('')+'</div>'+
    '<div class="pf-two"><div class="card"><div class="lab">From reach to revenue</div><div class="pff">'+fun.map(f=>'<div><span>'+f[0]+'</span><i><em style="width:'+Math.max(f[1]?3:0,f[1]/fmax*100)+'%"></em></i><b>'+f[1]+'</b></div>').join('')+'</div></div>'+
      '<div class="card"><div class="lab">Engagement by week</div><div class="pfw" role="img" aria-label="Engagement each week of the campaign">'+wk.map((v,i)=>'<div data-tip="Week '+(i+1)+': '+v+' engagement'+(v===1?'':'s')+'" class="'+(w.n===i+1?'now':'')+'"><i style="height:'+(v/wmax*100)+'%"></i><small>'+(i+1)+'</small></div>').join('')+'</div><p class="tiny muted" style="margin-top:8px">Opens, clicks, accepts, replies, meetings and ad clicks, by campaign week.</p></div></div>'+
    '<div class="pfcs">'+card('mail','Email','email',[['Contacted',E.sent],['Opened',E.open,E.sent?pct(E.open,E.sent):null],['Clicked',E.click,E.sent?pct(E.click,E.sent):null],['Replied',E.reply,E.sent?pct(E.reply,E.sent):null]],srcTag(em),'outreach')+
      card('link','LinkedIn','li',[['Connections sent',Ln.sent],['Accepted',Ln.acc,Ln.sent?pct(Ln.acc,Ln.sent):null],['Replies',Ln.rep,Ln.acc?pct(Ln.rep,Ln.acc):null],['Engaged with posts',Ln.eng]],srcTag(li),'linkedin')+
      card('megaphone','LinkedIn ads','ads',[['Impressions',A.imp],['Organisations reached',A.orgs],['Clicks',A.click,A.imp?Math.round(A.click/A.imp*1000)/10:null],['Engagements',A.eng]],srcTag(ad,c.reach.ads?'Ads on, awaiting data':'Ads are off for this campaign'),'ads')+'</div>'+
    (S.launch.connected?'':'<div class="pf-amp">'+ico('bolt')+'<span><b>Connect Amplify</b> and email, LinkedIn and ads results flow in by themselves, with no uploads.</span><button class="btn btn-line btn-xs" onclick="go(\'launch\');setTimeout(()=>setMode(\'amplify\'),200)">Find out more</button></div>')+
    '<div class="pf-two"><div class="card"><div class="row between"><div class="lab">Opportunities from this campaign</div><button class="btn btn-ghost btn-xs" onclick="openOppForm(null,\'lead\')">'+ico('plus')+'Add a deal</button></div>'+(x.opps.length?'<div class="pfo">'+x.opps.sort((p,q)=>(+q.value||0)-(+p.value||0)).map(o=>'<button onclick="openOppForm(\''+o.id+'\')">'+logo(o.name,28)+'<span class="grow"><b>'+esc(o.name)+'</b><small>'+esc(laneName(o.lane))+(o.next?' · '+esc(o.next):'')+'</small></span><b>'+money(o.value,true)+'</b></button>').join('')+'</div>':'<p class="muted" style="margin-top:8px">None yet. When a conversation from this campaign turns real, add it as a deal and it counts here.</p>')+'</div>'+
      '<div class="card"><div class="row between"><div class="lab">Highest intent in this campaign</div><button class="btn btn-ghost btn-xs" onclick="SGC=\''+c.id+'\';go(\'signals\')">See all</button></div>'+(x.hot.length?'<div class="pfo">'+x.hot.slice(0,6).map(h=>'<button onclick="openAccount(\''+h.a.id+'\')">'+logo(h.a,28)+'<span class="grow"><b>'+esc(h.a.name)+'</b><small>'+h.ppl+' '+(h.ppl===1?'person':'people')+' engaging · '+esc(whyLine(h.a,h.s))+'</small></span>'+heatDots(h.s.heat)+'</button>').join('')+'</div>':'<p class="muted" style="margin-top:8px">Nobody has engaged yet. Signals arrive as your messages go out.</p>')+'</div></div>'}
function perfEdit(cid,which){const c=S.campaigns.find(x=>x.id===cid);const F={email:['email_seq','Email',['Contacted','Opened','Clicked','Replied']],li:['li_out','LinkedIn',['Connections sent','Accepted','Replies']],ads:['li_ads','LinkedIn ads',['Impressions','Organisations reached','Clicks','Engagements']]}[which];const b=blockOf(c,F[0])||{metrics:{}};
  modal('<h2>'+F[1]+' results for '+esc(c.name)+'</h2><p class="sub">Enter the totals from your email tool, LinkedIn or Campaign Manager. Leave a box empty to use what Plato has logged.</p><div class="grid2">'+F[2].map((k,i)=>'<div class="field"><label for="pfe'+i+'">'+k+'</label><input class="inp" type="number" min="0" id="pfe'+i+'" value="'+(b.metrics&&b.metrics[k]!=null?b.metrics[k]:'')+'"></div>').join('')+'</div>'+
    '<div class="modal-foot"><button class="btn btn-ghost" onclick="closeOverlays()">Cancel</button><button class="btn btn-primary" onclick="perfSave(\''+cid+'\',\''+which+'\')">Save</button></div>')}
function perfSave(cid,which){const c=S.campaigns.find(x=>x.id===cid);const F={email:['email_seq',['Contacted','Opened','Clicked','Replied']],li:['li_out',['Connections sent','Accepted','Replies']],ads:['li_ads',['Impressions','Organisations reached','Clicks','Engagements']]}[which];
  act('Saved campaign results',()=>{c.blocks=c.blocks||[];let b=c.blocks.find(x=>x.type===F[0]);if(!b){b={id:uid(),type:F[0],metrics:{}};c.blocks.push(b)}F[1].forEach((k,i)=>{const v=$('#pfe'+i).value;if(v==='')delete b.metrics[k];else b.metrics[k]=Math.max(0,+v)});b.manual=today()},{refresh:false,ic:'📊'});closeOverlays();go('perf',cid,true)}

/* ═══ 4. SIGNALS & INTENT ═══ */
let SGC='all',SGB=0;
function intentRows(){const camp=SGC!=='all'&&S.campaigns.find(c=>c.id===SGC);
  return S.accounts.map(a=>{const sig=camp?campSigs(camp,a):a.signals||[];const ins=sig.filter(s=>INBOUND(s.type));if(!ins.length)return null;
    const s=scoreAccount(Object.assign({},a,{signals:sig}));const P={};ins.forEach(g=>{const k=g.person||'';if(!k)return;const p=P[k]=P[k]||{name:k,acts:{},last:g.date,n:0};p.acts[g.type]=(p.acts[g.type]||0)+1;p.n+=SIGNALS[g.type].w;if(g.date>p.last)p.last=g.date});
    const ppl=Object.values(P).map(p=>{const pp=a.people.find(x=>norm(x.name)===norm(p.name))||{};return Object.assign(p,{role:pp.role||''})}).sort((x,y)=>y.n-x.n);
    const camps=[...new Set(ins.map(g=>g.campaign).filter(Boolean))].map(id=>S.campaigns.find(c=>c.id===id)).filter(Boolean);
    const talk=ins.some(g=>TALK.includes(g.type));const opp=S.opps.find(o=>o.accountId===a.id&&o.lane!=='lost');
    const rank=s.score*(1+Math.min(.5,.12*Math.max(0,ppl.length-1)))+(talk?15:0);
    const ch=intentChannels(ins);const touches=sum(ins,g=>g.qty||1);
    return{a,s,ppl,camps,talk,opp,rank,ch,touches,last:ins.map(g=>g.date).sort().pop()}}).filter(Boolean).sort((x,y)=>y.rank-x.rank)}
function intentWhy(r){const t=new Set(r.ppl.flatMap(p=>Object.keys(p.acts)));const bits=[];
  if(t.has('meeting'))bits.push('a meeting booked');else if(t.has('reply')||t.has('li_reply'))bits.push('replied');
  if(r.ppl.length>1)bits.push(r.ppl.length+' people engaging');if(r.s.fams.length>1)bits.push('on '+r.s.fams.length+' channels');if(r.camps.length>1)bits.push('across '+r.camps.length+' campaigns');
  if(!bits.length)bits.push(whyLine(r.a,r.s));return bits.join(', ')}
const SIG_IC5={meeting:'🤝',reply:'💬',li_reply:'💬',call:'📞',referral:'🔁',event_attend:'🎪',webinar_attend:'🎧',webinar_signup:'✍️',content:'🎁',tool:'🧮',email_click:'🖱️',email_open:'👀',li_accept:'🔗',li_engage:'❤️',ad_click:'📣',ad_engage:'✨'};
function personRow(p){return '<li><span class="ip-av">'+esc(initials(p.name))+'</span><span class="grow"><b>'+esc(p.name)+'</b><small>'+esc(p.role||'')+(p.role?' · ':'')+rel(p.last)+'</small></span><span class="ip-acts">'+Object.entries(p.acts).sort((x,y)=>SIGNALS[y[0]].w-SIGNALS[x[0]].w).slice(0,4).map(([t,n])=>'<i data-tip="'+esc(SIGNALS[t].l)+(n>1?' ×'+n:'')+'">'+(SIG_IC5[t]||'•')+'</i>').join('')+'</span></li>'}
function orgTile(r,i,top){const a=r.a,s=r.s;const n=nextAction(a,s);const anon=r.ppl.length===0;
  return '<div class="itl'+(top?' top':'')+(s.heat>=4?' hot':'')+'" data-org="'+a.id+'" style="--hc:'+s.colour+';animation-delay:'+Math.min(i,14)*30+'ms">'+
    '<div class="itl-h"><span class="rank" style="background:'+s.colour+'">'+(i+1)+'</span>'+logo(a,38)+'<div class="grow" style="min-width:0"><b class="nm" onclick="openAccount(\''+a.id+'\')">'+esc(a.name)+'</b><small>'+esc(intentWhy(r))+'</small></div>'+heatDots(s.heat,true)+'</div>'+
    '<div class="itl-ch">'+INTENT_CH.map(c=>'<span class="'+(r.ch.has(c[0])?'on':'')+'" data-tip="'+esc(r.ch.has(c[0])?c[2]:'No '+c[1].toLowerCase()+' engagement yet')+'">'+c[3]+c[1]+'</span>').join('')+'<em>'+r.touches+' touchpoint'+(r.touches===1?'':'s')+'</em></div>'+
    '<div class="itl-bar" data-tip="Intent score '+Math.round(r.rank)+'"><i style="width:'+Math.min(100,Math.round(r.rank))+'%"></i></div>'+
    (anon?'<p class="tiny muted" style="margin:10px 0 0">Engagement from the organisation, no named people yet (ads or anonymous opens).</p>':'<ul class="itl-p">'+r.ppl.slice(0,top?5:3).map(personRow).join('')+(r.ppl.length>(top?5:3)?'<li class="more" onclick="openAccount(\''+a.id+'\')">+'+(r.ppl.length-(top?5:3))+' more</li>':'')+'</ul>')+
    '<div class="itl-f">'+(r.camps.length?'<span class="itl-c">'+r.camps.slice(0,2).map(c=>'<em>'+esc(c.name)+'</em>').join('')+(r.camps.length>2?'<em>+'+(r.camps.length-2)+'</em>':'')+'</span>':'<span></span>')+
      '<span class="itl-btns">'+(r.opp?'<button class="pill good" onclick="go(\'pipeline\')">In pipeline · '+money(r.opp.value,true)+'</button>':'<button class="btn btn-primary btn-xs" onclick="addToPipe(\''+a.id+'\')">'+ico('plus')+'Add to pipeline</button>')+'<button class="btn btn-line btn-xs askp" onclick="askPlatoOrg(\''+a.id+'\')">'+platoFace(18)+'Ask Plato</button></span></div></div>'}
/* add an organisation straight to the pipeline as a lead, with what it did as the source */
function addToPipe(aid){const a=accountById(aid);if(!a)return;const r=intentRows().find(x=>x.a.id===aid);const camp=SGC&&SGC!=='all'?SGC:(r&&r.camps[0]&&r.camps[0].id)||'';
  act('Added '+a.name+' to your pipeline',()=>{S.opps.push({id:uid(),created:today(),updated:today(),name:a.name,accountId:a.id,value:+S.setup.avgDeal||0,lane:'lead',weight:null,source:'Signals & Intent'+(r?': '+intentWhy(r):''),next:'',campaign:camp});a.stage='opp'},{ic:'📈'});
  award('deal',a.name);go('signals',null,true)}
/* ask Plato what to do next with this organisation, with its engagement as the context */
function askPlatoOrg(aid){const a=accountById(aid);if(!a)return;const r=intentRows().find(x=>x.a.id===aid);const camp=SGC&&SGC!=='all'&&S.campaigns.find(c=>c.id===SGC);
  const who=r?r.ppl.slice(0,4).map(p=>p.name+(p.role?' ('+p.role+')':'')+': '+Object.keys(p.acts).map(t=>SIGNALS[t].l.toLowerCase()).join(', ')).join('; '):'';
  const q='What should I do next with '+a.name+(camp?' in '+camp.name:'')+'? '+(r?'They are '+((HEAT.find(h=>h.n===r.s.heat)||{l:'engaging'}).l).toLowerCase()+' ('+intentWhy(r)+').':'')+(who?' Who engaged: '+who+'.':'')+' Give me the next two or three steps and draft the first message.';
  openDot();setTimeout(()=>platoAsk(q),250)}
function gapCard(rows){const p=pipe();const T=p.target;const won=p.wonVal,wt=p.weighted;const gap=Math.max(0,T-won-wt);const avg=+S.setup.avgDeal||0;
  if(!T)return '<div class="card gapc nog"><div><b>See what closes your revenue gap</b><p class="muted">Set your yearly new business target and typical deal size, and this shows which deals and warm brands can get you there.</p></div><button class="btn btn-line btn-sm" onclick="go(\'settings\')">'+ico('target')+'Set my target</button></div>';
  const open=p.active.map(o=>({o,w:(+o.value||0)*laneW(o)/100})).sort((x,y)=>(+y.o.value||0)-(+x.o.value||0));
  const warm=rows.filter(r=>!r.opp&&r.s.heat>=3).slice(0,6);const warmVal=warm.length*avg;
  const fill=sum(open,x=>+x.o.value||0)-wt;const could=Math.min(gap,Math.max(0,fill)+warmVal);
  const W=v=>T?Math.min(100,v/T*100):0;
  const items=open.slice(0,4).map(x=>'<button class="gi2" onclick="openOppForm(\''+x.o.id+'\')">'+logo(x.o.name,30)+'<span class="grow"><b>'+esc(x.o.name)+'</b><small>'+esc(laneName(x.o.lane))+' · '+laneW(x.o)+'% likely'+(x.o.next?' · next: '+esc(x.o.next):'')+'</small></span><span class="gv"><b>'+money(x.o.value,true)+'</b><small>Win it to add '+money((+x.o.value||0)-x.w,true)+'</small></span></button>').join('')+
    warm.map(r=>'<button class="gi2 warm" onclick="openOppForm(null,\'lead\',\''+r.a.id+'\')">'+logo(r.a,30)+'<span class="grow"><b>'+esc(r.a.name)+' '+heatDots(r.s.heat)+'</b><small>'+esc(intentWhy(r))+'. Not in your pipeline yet.</small></span><span class="gv"><b>'+(avg?'~'+money(avg,true):'Add a deal')+'</b><small>Turn it into a deal</small></span></button>').join('');
  return '<div class="card gapc"><div class="gc-h"><div><div class="lab">Your revenue gap</div><h2 class="h-m">'+(gap?money(gap,true)+' still to <span class="serif">find.</span>':'On track for <span class="serif">target.</span>')+'</h2><p class="muted">'+money(won,true)+' won and '+money(wt,true)+' weighted pipeline, against a '+money(T,true)+' target.'+(gap&&could?' The deals and warm brands below could cover about '+money(could,true)+' of it.':'')+'</p></div>'+
    '<div class="gc-bar" role="img" aria-label="Won, weighted pipeline and possible from these brands, against target"><i class="w" style="width:'+W(won)+'%" data-tip="Won '+money(won,true)+'"></i><i class="p" style="width:'+W(wt)+'%" data-tip="Weighted pipeline '+money(wt,true)+'"></i><i class="c" style="width:'+W(could)+'%" data-tip="Could close the gap: '+money(could,true)+'"></i></div><div class="gc-lg"><span><i class="w"></i>Won</span><span><i class="p"></i>Weighted pipeline</span><span><i class="c"></i>Could close the gap</span></div></div>'+
    (items?'<div class="lab" style="margin-top:16px">Brands and opportunities that can close it</div><div class="gcl">'+items+'</div>':'<p class="muted" style="margin-top:12px">No open deals or warm brands yet. As brands warm up, the ones that can close the gap appear here.</p>')+'</div>'}
VIEWS.signals=()=>{const all=S.accounts.flatMap(a=>a.signals||[]);const hasData=!!(S.uploads.outreach||S.uploads.linkedin||S.uploads.ads||S.launch.connected||all.some(s=>INBOUND(s.type)));
  const head=secHead('signals','Signals and <span class="serif">intent.</span>',hasData?'<button class="btn btn-ghost btn-sm" onclick="copySignals()">'+ico('copy')+'Copy a summary</button><button class="btn btn-line btn-sm" onclick="go(\'perf\')">'+ico('chart')+'Campaign performance</button>':'');
  if(!hasData)return head+'<div class="card nodata"><div class="orb"></div><h2 class="h-l">No data, <span class="serif">no intent.</span></h2><p class="lede">Intent comes from what people do with your outreach: accepts, opens, clicks and replies. Give Plato that data and this page ranks every organisation and person by how warm they are, across all your campaigns.</p><div class="row wrap" style="justify-content:center;gap:10px;margin-top:18px"><button class="btn btn-primary" onclick="openImport(null,\'outreach\')">'+ico('upload')+'Upload a CSV</button><button class="btn btn-line" onclick="go(\'launch\');setTimeout(()=>setMode(\'amplify\'),200)">'+ico('bolt')+'Switch on Amplify</button></div></div>'+sourcesStrip();
  sgDefault();const rows=intentRows();const R=rows.filter(r=>!SGB||(SGB===4?r.s.heat>=4:SGB===3?r.s.heat>=3:r.s.heat>=2));const top=R.filter(highIntent);const rest=R.filter(r=>!top.includes(r));
  const d30=s=>daysAgo(s.date)<=30;
  const k=[['pulse','Organisations engaging',rows.length],['people','People engaging',sum(rows,r=>r.ppl.length)],['chat','Replies, 30 days',all.filter(s=>['reply','li_reply'].includes(s.type)&&d30(s)).length],['calendar','Meetings, 30 days',all.filter(s=>s.type==='meeting'&&d30(s)).length],['flame','Hot right now',rows.filter(r=>r.s.heat>=4).length]];
  
  return head+'<div class="kstrip" data-tour="kstrip">'+k.map(x=>'<div class="ks"><span class="gi">'+ico(x[0])+'</span><b class="num" data-count="'+x[2]+'">0</b><span>'+x[1]+'</span></div>').join('')+'</div>'+
    gapCard(rows)+
    sgCampPicker()+
    '<div class="tabsbar" style="margin-top:14px"><span></span><div class="chips">'+[[0,'Everyone'],[4,'🔥 Hot'],[3,'🟠 Warm and up'],[2,'👀 Aware and up']].map(([b,l])=>'<button class="chip'+(SGB===b?' on':'')+'" onclick="SGB='+b+';go(\'signals\',null,true)">'+l+'</button>').join('')+'</div></div>'+
    (!R.length?'<div class="card empty" style="margin-top:14px"><div class="orb"></div>Nobody in this band yet.</div>':
      (top.length?'<div class="itl-lean"><div class="itl-lh"><div class="lab">'+ico('flame')+top.length+' organisation'+(top.length===1?' is':'s are')+' showing high intent. Lean in here first.</div><span class="tiny muted">High intent means a conversation, a hot score, or engagement across two or more channels with several touchpoints.</span></div><div class="itg top3">'+top.map((r,i)=>orgTile(r,i,true)).join('')+'</div></div>':'')+
      (rest.length?'<div class="lab" style="margin:20px 0 10px">'+(top.length?'Everyone else engaging, warmest first':'Everyone engaging, warmest first')+'</div><div class="itg" data-tour="sgrid">'+rest.map((r,i)=>orgTile(r,i+top.length,false)).join('')+'</div>':''))+
    '<p class="tiny muted" style="margin-top:14px;max-width:80ch">Ranked by intent: a meeting counts for far more than an open, older signals fade over a month, and organisations rise faster when more people engage, on more channels, across more campaigns.</p>'+
    sourcesStrip()+handoff('signals','Open the pipeline',null,'When a warm brand agrees to talk, add it as a deal and track it to a win.')};
VIEWS.signals_after=()=>{};

/* ── nav: Results is Campaign performance, Signals & Intent, Pipeline ── */
const _navHTML125=navHTML;navHTML=function(){let h=_navHTML125();const st=sysStats();
  return h.replace(/<div class="sd-cap">Results<\/div>[\s\S]*?(?=<div class="sd-div">)/,'<div class="sd-cap">Results</div>'+sideItem('perf','Campaign performance')+sideItem('signals','Signals & Intent',null,st.signals&&st.signals.badge)+sideItem('pipeline','Pipeline'))};
const _crumb125=crumb;crumb=function(){if(VIEW==='perf'){const el=$('#crumb');if(!el)return;const c=VIEW_ARG&&S.campaigns.find(x=>x.id===VIEW_ARG);el.innerHTML=c?'<button class="cr-c" onclick="go(\'perf\')">Campaign performance</button><span class="cr-s">/</span><b>'+esc(c.name)+'</b>':'<b>Campaign performance</b>';return}if(VIEW==='signals'){const el=$('#crumb');if(el)el.innerHTML='<b>Signals & Intent</b>';return}_crumb125()};

/* ═══ 5. SMALLER FIXES ═══ */
/* the problem pill no longer sits in the campaign bar */
const _campHead125=campHead;campHead=function(){return String(_campHead125.apply(this,arguments)).replace(/<span class="ch-p">[\s\S]*?<\/span>/,'')};
/* "Change who you are targeting" sits with the targeting chips, and looks like a button */
const _profChips125=profChips;profChips=function(){return _profChips125()+'<button class="pc-edit" onclick="editProfile()">'+ico('edit')+'Change who you are targeting</button>'};
const _vProspects125=VIEWS.prospects;VIEWS.prospects=function(tab){return String(_vProspects125(tab)).replace(/<button class="btn btn-ghost btn-sm" onclick="editProfile\(\)">[\s\S]*?<\/button>/,'')};
/* Plato page: a clear way back, at the top */
const _vDot125=VIEWS.dot;VIEWS.dot=function(){return '<div class="plv-top"><button class="pf-back" onclick="setViewMode(\'dash\')">'+ico('arrow','l')+'Back to the dashboard</button><span class="muted tiny">Plato view. Everything you can do in the dashboard, by talking.</span></div>'+String(_vDot125()).replace(/<button class="btn btn-ghost btn-sm" onclick="setViewMode\(\\?'dash\\?'\)">[\s\S]*?<\/button>/,'')};
/* the sidebar can be collapsed and expanded */
function sideMini(){try{return localStorage.getItem('pp_sd')}catch(e){return null}}
function sideCollapse(){const compact=$('#side')&&$('#side').getBoundingClientRect().width<120;const v=compact?'full':'mini';try{localStorage.setItem('pp_sd',v)}catch(e){}applySide(v)}
function applySide(v){document.body.classList.toggle('sd-mini',v==='mini');document.body.classList.toggle('sd-full',v==='full');const b=$('#sdTog');if(b){const mini=$('#side')&&$('#side').getBoundingClientRect().width<120;b.setAttribute('aria-label',mini?'Expand the sidebar':'Collapse the sidebar');b.dataset.tip=mini?'Expand the sidebar':'Collapse the sidebar'}}
const _renderShell125=renderShell;renderShell=function(){_renderShell125.apply(this,arguments);const t=$('.topb');if(t&&!$('#sdTog')){const b=document.createElement('button');b.className='icon-btn tip-b sd-tog';b.id='sdTog';b.onclick=sideCollapse;b.innerHTML=ico('sidebar');t.insertBefore(b,t.firstChild)}applySide(sideMini())};
/* no more jumping: only redraw after a sync when something actually changed, and never while typing */
const _syncPull125=syncPull;
syncPull=async function(){const sig=()=>JSON.stringify([S.campaigns,S.accounts,S.opps,S.setup,S.notifications.length]);const before=sig();const R=refresh;
  refresh=function(){const typing=document.activeElement&&/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);const open=$('#modal')&&$('#modal').classList.contains('on');
    if(sig()===before||typing||open){try{refreshNav();renderBell()}catch(e){}return}
    const v=$('#view');const y=v?v.scrollTop:0;R();const v2=$('#view');if(v2){v2.scrollTop=y;requestAnimationFrame(()=>{v2.scrollTop=y})}};
  try{await _syncPull125()}finally{refresh=R}};

/* ═══ 6. GUIDES AS PDFs, IN THE STYLE OF A SCOPE & LENS PROPOSAL ═══
   A4 portrait, white page, a large title and subtitle, a short intro, an "at a glance" table,
   numbered sections with numbered steps, a closing line and a sign-off. */
const GW=794,GH=1123,GS=2480/794;
function makePDFp(jpgs,pxW,pxH){const enc=new TextEncoder();const parts=[];let len=0;const off=[];const push=d=>{const b=typeof d==='string'?enc.encode(d):d;parts.push(b);len+=b.length};
  const w=595.28,h=841.89;const n=jpgs.length;const obj=(i,body)=>{off[i]=len;push(i+' 0 obj\n');body();push('\nendobj\n')};
  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');obj(1,()=>push('<< /Type /Catalog /Pages 2 0 R >>'));
  obj(2,()=>push('<< /Type /Pages /Count '+n+' /Kids ['+jpgs.map((_,i)=>(3+i*3)+' 0 R').join(' ')+'] >>'));
  jpgs.forEach((u,i)=>{const pg=3+i*3,ct=pg+1,im=pg+2;const bin=atob(u.split(',')[1]);const bytes=new Uint8Array(bin.length);for(let k=0;k<bin.length;k++)bytes[k]=bin.charCodeAt(k);
    const cs='q '+w+' 0 0 '+h+' 0 0 cm /Im'+i+' Do Q';
    obj(pg,()=>push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '+w+' '+h+'] /Resources << /XObject << /Im'+i+' '+im+' 0 R >> >> /Contents '+ct+' 0 R >>'));
    obj(ct,()=>push('<< /Length '+cs.length+' >>\nstream\n'+cs+'\nendstream'));
    obj(im,()=>{push('<< /Type /XObject /Subtype /Image /Width '+pxW+' /Height '+pxH+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+bytes.length+' >>\nstream\n');push(bytes);push('\nendstream')})});
  const total=3+n*3;const xref=len;push('xref\n0 '+total+'\n0000000000 65535 f \n');for(let i=1;i<total;i++)push(String(off[i]).padStart(10,'0')+' 00000 n \n');
  push('trailer\n<< /Size '+total+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF');return new Blob(parts,{type:'application/pdf'})}
async function guidePDF(k){const G=GUIDES.find(x=>x.k===k);if(!G)return;toast('Making your PDF');
  try{await Promise.all(['800 20px "DM Sans"','700 20px "DM Sans"','500 20px "DM Sans"','400 20px "DM Sans"'].map(f=>document.fonts.load(f)))}catch(e){}
  const C=pdfCol();const ink='#141414',ink2='#3a3936',mute='#6b6862',rule='#dedbd5',head='#f4f2ee';
  const A=AGENTS[G.g];const agency=(S.setup.agency&&S.setup.agency!=='Your agency')?S.setup.agency:'';
  const M=64,CW=GW-M*2;const pxW=Math.round(GW*GS),pxH=Math.round(GH*GS);const pages=[];let x,D,y;
  const newPage=()=>{const cv=document.createElement('canvas');cv.width=pxW;cv.height=pxH;x=cv.getContext('2d');x.scale(GS,GS);D=pdfDraw(x,C,{});D.R(0,0,GW,GH,'#ffffff');pages.push(cv);y=M+8};
  const room=h=>{if(y+h>GH-70)newPage()};
  const para=(t,o)=>{o=o||{};const s=o.s||13.5,lh=Math.round(s*1.55);D.font({s,w:o.w||400});const lines=Math.ceil(D.W(t,{s,w:o.w||400})/(o.w2||CW))+1;room(lines*lh);y=D.wrap(t,o.x||M,y+s,o.w2||CW,lh,{s,w:o.w||400,c:o.c||ink2,ls:0})-s+(o.after==null?14:o.after)};
  const h2=t=>{room(64);y+=16;D.T(t,M,y+22,{s:22,w:800,c:ink,ls:-.4});y+=40};
  newPage();
  /* title block, as in the proposal */
  D.T((agency?agency+' x ':'')+'Scope & Lens',M,y+14,{s:12.5,w:700,c:C.brand,ls:.2});y+=34;
  y=D.wrap(G.t,M,y+34,CW,42,{s:36,w:800,c:ink,ls:-1})+4;
  D.T('A Plato guide',M,y+14,{s:18,w:700,c:ink2,ls:-.2});y+=36;
  para(G.s,{s:14.5});
  /* at a glance table */
  h2('At a glance');const rows=[['Time',G.m+' minute read'],['Who runs this step',A?A.n+', '+(A.role||'').toLowerCase():'Plato, your guide'],['What it covers',G.sec.map(s=>s[0]).join(', ')],['In one line',G.tip]];
  const c1=170;D.line(M,y,M+CW,y,ink,1.5);
  rows.forEach(r=>{D.font({s:13});const lines=Math.max(1,Math.ceil(D.W(r[1],{s:13})/(CW-c1-24)));const rh=Math.max(38,lines*20+18);room(rh);
    D.T(r[0],M+12,y+24,{s:13,w:700,c:ink});D.wrap(r[1],M+c1,y+24,CW-c1-16,20,{s:13,c:ink2,ls:0});y+=rh;D.line(M,y,M+CW,y,rule,1)});y+=10;
  /* numbered sections, numbered steps */
  G.sec.forEach((s,si)=>{h2((si+1)+'. '+s[0]);let n=0;s[1].forEach(t=>{n++;D.font({s:13.5});const lines=Math.ceil(D.W(t,{s:13.5})/(CW-34))+1;room(lines*21+8);
    D.T(n+'.',M+4,y+14,{s:13.5,w:700,c:C.brand});y=D.wrap(t,M+30,y+14,CW-34,21,{s:13.5,c:ink2,ls:0})-14+10})});
  /* closing */
  room(90);y+=16;D.T('Questions? Ask Plato in the app, or get in touch.',M,y+14,{s:13.5,c:ink2,ls:0});y+=40;
  D.T('Josh',M,y,{s:13.5,w:800,c:ink});D.T('Scope & Lens',M+D.W('Josh ',{s:13.5,w:800}),y,{s:13.5,c:ink2,ls:0});
  /* footers */
  pages.forEach((cv,i)=>{const cx=cv.getContext('2d');const Dp=pdfDraw(cx,C,{});Dp.line(M,GH-54,GW-M,GH-54,rule,1);Dp.T(portalName()+'  ·  '+G.t,M,GH-34,{s:10.5,c:mute,max:CW-80,ls:0});Dp.T((i+1)+' of '+pages.length,GW-M,GH-34,{s:10.5,c:mute,al:'right',ls:0})});
  const blob=makePDFp(pages.map(cv=>cv.toDataURL('image/jpeg',.92)),pxW,pxH);const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(G.t.replace(/[^a-z0-9]+/gi,'-').replace(/-+$/,'').toLowerCase())+'.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast('Your guide is downloading')}
/* the Plato page opens at the top, so the way back is always visible */
const _dotAfter125=VIEWS.dot_after;VIEWS.dot_after=function(){if(_dotAfter125)_dotAfter125.apply(this,arguments);const v=$('#view');setTimeout(()=>{const i=$('#plFullIn');if(i)i.focus({preventScroll:true});if(v)v.scrollTop=0},260)};

/* Signals & Intent is campaign-led: pick a campaign, then see who is showing intent in it */
function sgDefault(){if(SGC&&SGC!=='all'&&S.campaigns.some(c=>c.id===SGC))return;if(SGC==='all'&&SGC_PICKED)return;const C=realCamps();
  const best=C.map(c=>({c,n:S.accounts.filter(a=>campSigs(c,a).some(s=>INBOUND(s.type))).length})).sort((x,y)=>(campLive(y.c)-campLive(x.c))||(y.n-x.n))[0];SGC=best&&best.n?best.c.id:'all'}
let SGC_PICKED=false;
function sgPick(id){SGC=id;SGC_PICKED=true;go('signals',null,true)}
function sgCampPicker(){const C=realCamps();if(!C.length)return '';
  const tile=(id,name,sub,stat,on)=>'<button class="sgc'+(on?' on':'')+'" onclick="sgPick(\''+id+'\')" aria-pressed="'+on+'"><b>'+esc(name)+'</b><small>'+sub+'</small><span>'+stat+'</span></button>';
  const allN=S.accounts.filter(a=>(a.signals||[]).some(s=>INBOUND(s.type))).length;
  const cur=SGC!=='all'&&S.campaigns.find(c=>c.id===SGC);
  const src=cur?(()=>{const am=isPremium()&&S.launch.connected;const up=(cur.blocks||[]).filter(b=>b.file||b.manual);return '<div class="sgc-src"><span>'+ico(am?'bolt':'upload')+(am?'<b>Linked to Amplify.</b> Outreach for this campaign flows in by itself.':up.length?'<b>'+up.length+' upload'+(up.length===1?'':'s')+'</b> for this campaign.':'<b>No data for this campaign yet.</b> Upload its export, or link it to Amplify.')+'</span>'+
    '<button class="btn btn-line btn-xs" onclick="openImport(\''+cur.id+'\',\'outreach\')">'+ico('upload')+'Upload for this campaign</button>'+
    (isPremium()?'<button class="btn btn-ghost btn-xs" onclick="S.cur=\''+cur.id+'\';save();go(\'launch\');setTimeout(()=>setMode(\'amplify\'),200)">'+ico('bolt')+'Amplify</button>':'<button class="btn btn-ghost btn-xs" onclick="premiumLocked(\'amplify\')">'+ico('lock')+'Amplify (Premium)</button>')+
    '<button class="btn btn-ghost btn-xs" onclick="go(\'perf\',\''+cur.id+'\')">'+ico('chart')+'Campaign results</button></div>'})():'';
  return '<div class="sgc-wrap"><div class="lab">Choose a campaign</div><div class="sgc-row">'+C.map(c=>{const st=campStatus(c);const n=S.accounts.filter(a=>campSigs(c,a).some(s=>INBOUND(s.type)));const hot=n.filter(a=>scoreAccount(Object.assign({},a,{signals:campSigs(c,a)})).heat>=4).length;
      return tile(c.id,c.name,'<i class="dot '+st[1]+'"></i>'+st[0]+(campWk(c).n?' · week '+campWk(c).n:''),n.length+' engaging'+(hot?' · <em>'+hot+' hot</em>':''),SGC===c.id)}).join('')+
    tile('all','All campaigns','Everything together',allN+' engaging',SGC==='all')+'</div>'+src+'</div>'}

/* intent across channels: outreach, ads, events, content and conversations */
const INTENT_CH=[['out','Outreach','Engaging with your emails or LinkedIn','✉️ '],['ads','Ads','Clicking or engaging with your ads','📣 '],['events','Events','Came to an event or webinar','🎪 '],['content','Content','Downloaded content or used a tool','🎁 '],['talk','Talking','Replied, called or met you','💬 ']];
function intentChannels(sigs){const c=new Set();sigs.forEach(g=>{const f=(SIGNALS[g.type]||{}).fam;if(f==='email'||f==='linkedin')c.add('out');if(f==='ads'&&g.type!=='ad_view')c.add('ads');if(f==='events')c.add('events');if(f==='content')c.add('content');if(TALK.includes(g.type)||g.type==='li_reply')c.add('talk')});return c}
/* high intent: talking to you, a hot score, or several touchpoints across two or more channels (events count double) */
function highIntent(r){const n=r.ch.size+(r.ch.has('events')?1:0);return r.s.heat>=4||r.ch.has('talk')||(n>=2&&r.touches>=3)||(r.ppl.length>=3&&r.touches>=4)}
