/* ═══════════ v18g ═══════════ */
/* ── 1. the campaign block in the sidebar opens and closes ── */
function sdCampOpen(){return !(S&&S.ui18&&S.ui18.campShut)}
function sdCampToggle(e){if(e){e.stopPropagation();e.preventDefault()}S.ui18=S.ui18||{};S.ui18.campShut=!S.ui18.campShut;save();refreshNav&&refreshNav()}
(function(){const _nav=navHTML;navHTML=function(){let h=String(_nav.apply(this,arguments));const open=sdCampOpen();
  h=h.replace(/(<button class="sd-i[^"]*" data-nav="camps"[^>]*>)([\s\S]*?)(<\/button>)/,(m,a,b,c)=>a+b+'<span class="sd18-tg'+(open?' open':'')+'" role="button" tabindex="0" aria-label="'+(open?'Hide':'Show')+' campaign steps" onclick="sdCampToggle(event)">'+ico('chev')+'</span>'+c);
  if(!open)h=h.replace('<div class="sd18-camp','<div class="sd18-camp shut');return h}})();

/* ── 2. intent only counts people and brands that are part of a campaign ──
   Connecting LinkedIn brings in every reply in the inbox. Those are not campaign leads unless the brand is on a
   campaign list, and conversation signals only count from people named on that brand. Everything else is kept out. */
const CONV18=['reply','li_reply','meeting','li_accept','call'];
function campsFor(a){return S.campaigns.filter(c=>(c.targets||[]).includes(a.id))}
function inCamp18(a){return campsFor(a).length>0}
function personOk18(a,name){if(!name)return true;const k=norm(name);return (a.people||[]).some(p=>norm(p.name)===k||norm(p.name).split(' ')[0]===k.split(' ')[0]&&norm(p.name).split(' ').pop()===k.split(' ').pop())}
function sigOk18(a,g,camp){if(g.type==='trigger')return true;if(camp){if(!(camp.targets||[]).includes(a.id))return false;if(g.campaign&&g.campaign!==camp.id)return false}else if(!inCamp18(a))return false;
  if(CONV18.includes(g.type)&&g.src!=='manual'&&!personOk18(a,g.person))return false;return true}
function sigs18(a,camp){return (a.signals||[]).filter(g=>sigOk18(a,g,camp))}
ranked=function(){return S.accounts.filter(inCamp18).map(a=>({a,s:scoreAccount(Object.assign({},a,{signals:sigs18(a)}))})).sort((x,y)=>y.s.score-x.s.score)};
intentRows=function(){const camp=SGC!=='all'&&S.campaigns.find(c=>c.id===SGC);
  return S.accounts.filter(a=>camp?(camp.targets||[]).includes(a.id):inCamp18(a)).map(a=>{const sig=sigs18(a,camp||null);const ins=sig.filter(s=>INBOUND(s.type));if(!ins.length)return null;
    const s=scoreAccount(Object.assign({},a,{signals:sig}));const P={};ins.forEach(g=>{const k=g.person||'';if(!k)return;const p=P[k]=P[k]||{name:k,acts:{},last:g.date,n:0};p.acts[g.type]=(p.acts[g.type]||0)+1;p.n+=SIGNALS[g.type].w;if(g.date>p.last)p.last=g.date});
    const ppl=Object.values(P).map(p=>{const pp=a.people.find(x=>norm(x.name)===norm(p.name))||{};return Object.assign(p,{role:pp.role||''})}).sort((x,y)=>y.n-x.n);
    const camps=camp?[camp]:campsFor(a);const talk=ins.some(g=>TALK.includes(g.type));const opp=S.opps.find(o=>o.accountId===a.id&&o.lane!=='lost');
    const rank=s.score*(1+Math.min(.5,.12*Math.max(0,ppl.length-1)))+(talk?15:0);const ch=intentChannels(ins);const touches=sum(ins,g=>g.qty||1);
    return{a,s,ppl,camps,talk,opp,rank,ch,touches,last:ins.map(g=>g.date).sort().pop()}}).filter(Boolean).sort((x,y)=>y.rank-x.rank)};
/* Amplify events: only brands on a campaign, only people on that brand. The rest are counted, not tracked. */
ampEvents=async function(){if(!ampOn())return 0;try{const j=await ampCall('events',{since:S.ampSince||isoDaysAgo(30)});let n=0,skip=0;
  (j.events||[]).forEach(ev=>{const a=findAccountByName(ev.company||'');const t={accept:'li_accept',open:'email_open',click:'email_click',reply:'reply',li_reply:'li_reply',meeting:'meeting'}[ev.type];if(!t)return;
    if(!a||!inCamp18(a)||(CONV18.includes(t)&&ev.person&&!personOk18(a,ev.person))){skip++;return}
    const c=campsFor(a).sort((x,y)=>campLive(y)-campLive(x))[0];addSignal(a,t,{person:ev.person||'',date:(ev.at||today()).slice(0,10),src:'amplify',campaign:c?c.id:''});n++});
  S.ampSince=today();S.ampSkipped18=(S.ampSkipped18||0)+skip;save();return n}catch(e){return 0}};
/* imports of outreach and LinkedIn results follow the same rule */
const _rts18=rowsToSignals;rowsToSignals=function(P,m,t,camp){if(!['outreach','li_outreach'].includes(t))return _rts18.apply(this,arguments);
  const keep=P.rows.filter(r=>{const a=findAccountByName((r[m.company]||'').trim());return a&&(camp?((S.campaigns.find(c=>c.id===camp)||{}).targets||[]).includes(a.id):inCamp18(a))});
  const left=P.rows.length-keep.length;if(left){S.ampSkipped18=(S.ampSkipped18||0)+left;setTimeout(()=>toast(left+' row'+(left===1?' was':'s were')+' left out because '+(left===1?'it is':'they are')+' not part of a campaign'),400)}
  return _rts18.call(this,Object.assign({},P,{rows:keep}),m,t,camp)};
/* the pipeline automation only looks at campaign conversations too */
autoPipeSugs=function(){const have=new Set(S.opps.filter(o=>o.lane!=='lost').map(o=>o.accountId));const dis=new Set(S.autoNo18||[]);const out=[];
  S.accounts.filter(inCamp18).forEach(a=>{if(have.has(a.id)||dis.has(a.id))return;const sig=sigs18(a).filter(s=>['li_reply','reply','meeting'].includes(s.type)&&daysAgo(s.date)<=45).sort((x,y)=>String(y.date).localeCompare(String(x.date)));if(!sig.length)return;
    const m=sig.find(s=>s.type==='meeting');const g=m||sig[0];out.push({a,lane:m?'opportunity':'lead',sig:Object.assign({},g,{campaign:g.campaign||(campsFor(a)[0]||{}).id||''}),li:sig.some(s=>s.type==='li_reply'),n:sig.length})});
  return out.sort((x,y)=>(y.lane==='opportunity')-(x.lane==='opportunity')||y.n-x.n).slice(0,6)};
/* say so on Signals, so nobody wonders where their other replies went */
(function(){const _sg=VIEWS.signals;VIEWS.signals=function(){let h=String(_sg.apply(this,arguments));const out=S.accounts.filter(a=>!inCamp18(a)&&(a.signals||[]).some(g=>INBOUND(g.type))).length;
  const note='<div class="sg18-note">'+ico('target')+'<span><b>Only campaign prospects count here.</b> Brands on a campaign list, and the people named at them.'+(out?' '+out+' other organisation'+(out===1?'':'s')+' with activity '+(out===1?'is':'are')+' left out.':'')+'</span></div>';
  const i=h.indexOf('<div class="kp18">');return i>-1?h.slice(0,i)+note+h.slice(i):h}})();

/* ── 3. pitch intelligence on every brand card: who holds the account, and for how long ── */
function incumbent18(p){if(p.intel&&intelOn()){const r=p.intel;const inh=/in.?house/i.test((r.move||'')+(r.agency||''));const yrs=r.last?Math.max(0,Math.floor(daysAgo(r.last)/365)):null;
    return{who:inh?'In-house team':(r.agency||'Not known'),yrs:inh?null:yrs,since:r.last?r.last.slice(0,4):'',grp:r.group||r.holding||'',src:'Pitch intelligence'}}
  const all=(p.all&&p.all.length?p.all:p.nt&&p.nt!=='none'?[{type:p.nt,date:p.nd,text:p.news}]:[]);
  for(const n of all){const t=String(n.text||'');if(!/agency|campaign|\bad\b|advert|creative/i.test(t))continue;
    const m=t.match(/\b(?:ad|advert|campaign|work|spot|film)s?\b[^.]{0,50}?\b(?:from|by|with)\s+((?:[A-Z][A-Za-z0-9&'’+.-]*)(?:\s(?:[A-Z][A-Za-z0-9&'’+.-]*|&)){0,3})/)||t.match(/\bappointed\s+((?:[A-Z][A-Za-z0-9&'’+.-]*)(?:\s[A-Z][A-Za-z0-9&'’+.-]*){0,3})\s+as\s+(?:its\s+)?(?:new\s+)?(?:creative|media|lead|brand)?\s*agency/);
    if(m&&!/^(The|A|Its|Their|Former|Formerly)$/.test(m[1]))return{who:m[1].replace(/[.,]$/,''),yrs:null,since:String(n.date||'').slice(0,4),src:'From their news',recent:1}}
  return null}
function incRow18(p){const x=incumbent18(p);
  if(!x)return '<div class="pb-inc none">'+ico('people')+'<span><small>Incumbent agency</small><b>Not known yet</b></span>'+(intelOn()?'':'<em>'+ico('lock')+'Premium</em>')+'</div>';
  const long=x.yrs!=null&&x.yrs>=5;return '<div class="pb-inc'+(long?' long':'')+'" data-tip="'+esc(x.src+(x.grp?' · '+x.grp:''))+'">'+ico('people')+'<span><small>'+(x.recent?'Latest work by':'Incumbent agency')+'</small><b>'+esc(x.who)+'</b></span>'+
    (x.recent?'<span class="pb-yrs news"><small>from</small><b>news</b></span>':x.yrs!=null?'<span class="pb-yrs"><b>'+x.yrs+'</b><small>yr'+(x.yrs===1?'':'s')+'</small></span>':x.since?'<span class="pb-yrs"><small>since</small><b>'+esc(x.since)+'</b></span>':'')+'</div>'}
const _card18g=card18;card18=function(x,on){return _card18g(x,on).replace('</div><div class="pb-now','</div>'+incRow18(x.p)+'<div class="pb-now').replace(/(<\/div>)(<div class="pb-now)/,(m,a,b)=>m)};
/* make sure brands with pitch intelligence are always in the list */
const _pool18g=pool18;pool18=function(c){const r=_pool18g(c);if(intelOn()){r.all.filter(x=>x.p.intel&&!r.seen.includes(x)).forEach(x=>r.seen.push(x))}return r};

/* ── 5. the journey: an invitation, not a room hunt; direct mail on the chart; no mail essay at the bottom ── */
(function(){const ev=STEP_LIB.find(s=>s.t==='Find a room to meet them in');if(ev)Object.assign(ev,{t:'Invite them to an agency event',why:'Ask them to something you are hosting: a breakfast, a roundtable or a talk on the problem you solve. A room of their peers is the warmest way to meet.',
  m:['{first}, we are hosting a small breakfast for {sector} marketers on [the problem you solve]. Eight people, one topic, no slides. Would you like a seat?','{first}, we are running a short roundtable on [topic] next month with a few {sector} leaders. I think you would add a lot. Shall I save you a place?','{first}, a quick invitation: [your event], [date]. It is built around [the problem], and the room is people like you. Let me know and I will send the details.']})})();
function fixEvent18(){(S&&S.campaigns||[]).forEach(c=>{const R=c.reach||{};(R.steps||[]).forEach(s=>{if(s.t==='Find a room to meet them in')s.t='Invite them to an agency event'});
  if(!c.mail18&&R.steps&&R.steps.length&&(R.ch||[]).includes('mail')&&!R.steps.some(s=>s.ch==='mail')){c.mail18=1;const i=STEP_LIB.findIndex(s=>s.ch==='mail');const L=STEP_LIB[i];R.steps.push({id:uid(),w:Math.max(2,Math.min(R.weeks||12,Math.round(5*(R.weeks||12)/12))),ch:'mail',t:L.t,task:L.task||0,warm:0,nonote:0,accept:0,lib:i})}})}
const _plan18g=planSteps;planSteps=function(ch,W,pace){const out=_plan18g(ch,W,pace);if(ch.includes('mail')&&!out.some(s=>s.ch==='mail')){const i=STEP_LIB.findIndex(s=>s.ch==='mail');const L=STEP_LIB[i];
    let w=Math.max(2,Math.min(W,Math.round(5*W/12)));const busy=k=>out.filter(p=>p.w===k&&!p.task).length;let k=w;while(k<=W&&busy(k)>=3)k++;if(k>W)k=w;
    out.push({w:k,ch:'mail',t:L.t,task:L.task||0,warm:0,nonote:0,accept:0,lib:i});out.sort((a,b)=>a.w-b.w||STEP_ORDER(a)-STEP_ORDER(b))}return out};
mailCard=function(){return ''};
const _go18g=go;go=function(v,a,k){try{fixEvent18()}catch(e){}return _go18g(v,a,k)};
