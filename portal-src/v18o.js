/* ═══════════ v18o: demo-day fixes from the Easier Sales call ═══════════
   Launch: connections are yes or skip, never "redraft"; known connections skip straight to a message; every card links
   to the person on LinkedIn; Amplify sends say what kind of send they are and report back; a pace line, an outbox and
   auto-approve for connection requests. The list view becomes a quick bulk approver, not a second copy of the cards. */

const liOf18=(p,a)=>p.li||('https://www.linkedin.com/search/results/people/?keywords='+encodeURIComponent(p.name+' '+((a&&a.name)||'')));
const isConnStep18=s=>!!s&&s.ch==='linkedin'&&(!!s.nonote||/^connect/i.test(s.t||''));
const sameName18=(x,y)=>{const n=v=>String(v||'').toLowerCase().replace(/[^a-z ]/g,'').trim();return !!x&&!!y&&(n(x)===n(y)||n(x).split(' ')[0]+n(x).split(' ').pop()===n(y).split(' ')[0]+n(y).split(' ').pop())};
function isConn18(c,a,p){if(p.connected||(c.conn18&&c.conn18[p.id]))return true;return (a.signals||[]).some(g=>['li_accept','li_reply','reply','meeting'].includes(g.type)&&sameName18(g.person,p.name))}
function markConn18(pid){const c=curCamp();c.conn18=c.conn18||{};c.conn18[pid]=1;const x=campTargets(c).flatMap(a=>a.people).find(p=>p.id===pid);if(x)x.connected=true;save()}

/* ampSend now says whether it is a connection request or a message, and hands back the partner's reply */
ampSend=async function(it){if(!ampOn())return false;const A=accountById(it.acc)||{people:[]};const P=A.people.find(p=>p.id===it.pid)||{};
  try{const j=await ampCall('send',{id:it.id||uid(),type:it.type||'message',channel:it.ch,campaign:it.camp||'',step:it.step||'',asset:it.asset||null,
    to:{name:it.person,company:A.name||'',linkedin:P.li||'',email:P.email||'',title:P.role||''},text:it.text||'',subject:it.subject||''});
    it.ref=(j&&j.ref)||'';return j||{ok:true}}catch(e){it.err=e.message;toast('Amplify could not send that one: '+esc(e.message));return false}};

/* what is due today, one per person, connections skipped for people you already know */
lnDue18=function(c){const all=c.reach.steps.filter(s=>!s.task).slice().sort((a,b)=>a.w-b.w);const ppl=[];campTargets(c).forEach(a=>a.people.forEach(p=>ppl.push({a,p})));
  const wk=Math.max(1,campWk(c).n||1);const auto=S.launch.autoConn&&S.launch.mode==='amplify'&&ampOn();
  const sentToday=pid=>Object.keys(c.sent||{}).some(k=>k.indexOf(pid+':')===0&&c.sent[k]===today());
  const up=ppl.map(x=>{const conn=isConn18(c,x.a,x.p);const steps=conn?all.filter(s=>!isConnStep18(s)):all;const s=nextFor(c,x.p.id,steps);return{x,s,conn}})
    .filter(q=>q.s&&!LN18.skip[q.x.p.id+':'+q.s.id]&&!(q.s.warm&&!warmReady(q.x.a,q.x.p))&&!sentToday(q.x.p.id)).sort((a,b)=>(b.conn-a.conn)||(a.s.w-b.s.w));
  const isDue=q=>q.s.w<=wk||(q.conn&&!Object.keys(c.sent||{}).some(k=>k.indexOf(q.x.p.id+':')===0&&!isConnStep18(c.reach.steps.find(s=>s.id===k.split(':')[1]))));
  let due=up.filter(isDue);if(auto)due=due.filter(q=>!isConnStep18(q.s));
  return{due:due.length?due:(auto?[]:up.slice(0,12)),ahead:!due.length,ppl,steps:all,autoQ:auto?up.filter(q=>isDue(q)&&isConnStep18(q.s)):[]}};

lnCard18=function(c,q,i){const a=q.x.a,p=q.x.p,s=q.s;const ch=REACH_CH.find(x=>x.k===s.ch)||REACH_CH[0];const m=lnMsg18(c,q);const asset=assetName(c,s.asset);const conn=isConnStep18(s);
  const face=p.photo?'<span class="dk18-av"><img src="'+esc(p.photo)+'" alt="" loading="lazy" onerror="this.parentNode.classList.add(\'nop\');this.remove()"><i>'+logo(a,22)+'</i></span>':'<span class="dk18-av nop">'+logo(a,46)+'</span>';
  return '<article class="dk18-c'+(i?' back b'+i:' top')+(conn?' conn':'')+'" '+(i?'aria-hidden="true"':'id="dkTop" data-pid="'+p.id+'" data-sid="'+s.id+'" data-conn="'+(conn?1:0)+'"')+'>'+
    (i?'':'<span class="dk18-st yes">'+ico('send')+(conn?'Connect':'Approve')+'</span><span class="dk18-st no">'+ico(conn?'x':'loop')+(conn?'Skip':'Redraft')+'</span>')+
    '<header>'+face+'<div class="grow"><a class="dk18-nm" href="'+esc(liOf18(p,a))+'" target="_blank" rel="noopener" title="Open '+esc(p.name)+' on LinkedIn">'+esc(p.name)+'</a><small>'+esc([p.role,a.name].filter(Boolean).join(' · '))+'</small></div>'+
      '<span class="dk18-ch" style="--cc:'+(ch.c||'var(--brand)')+'">'+ico(ch.ic)+esc(conn?'Connection':ch.l)+'</span></header>'+
    '<div class="dk18-k"><span>Week '+s.w+'</span><b>'+esc(s.t)+'</b>'+(q.conn&&!conn?'<em class="ok">'+ico('check')+'Already connected</em>':'')+(asset?'<em>'+ico('gift')+esc(asset)+'</em>':'')+
      '<a class="dk18-li" href="'+esc(liOf18(p,a))+'" target="_blank" rel="noopener">'+ico('linkedin')+'View on LinkedIn</a></div>'+
    (m.nonote?'<div class="dk18-nn">'+ico('linkedin')+'<div><b>A connection request, no note.</b><span>Your profile does the talking. Connect, or skip them for now.'+(i?'':' Already connected? <button class="link" onclick="lnAlready18()">Tell Otis</button> and he moves on to a message.')+'</span></div></div>':
      (m.subject?'<input class="inp dk18-sj" id="dkSj" value="'+esc(m.subject)+'" aria-label="Subject">':'')+'<textarea class="inp dk18-m" id="dkMsg" rows="6" aria-label="Message">'+esc(m.body)+'</textarea>')+
    '</article>'};

function lnAlready18(){const t=lnTop();if(!t)return;markConn18(t.dataset.pid);toast('Noted. Otis will write them a message instead.');go('launch',null,true)}

lnDeck18=function(c){const D=lnDue18(c);const L=D.due;
  if(!L.length)return '<div class="dk18-empty">'+agentFace('launch',64,{badge:false})+'<h3>'+(D.autoQ.length?'Connections are on autopilot.':'All done for today.')+'</h3><p>'+(D.autoQ.length?'Connection requests go straight to Amplify. Otis will put messages here as people accept.':'Otis lines up tomorrow’s messages overnight. Nothing is waiting on you.')+'</p><button class="btn btn-line" onclick="go(\'signals\')">See who is warming up</button></div>';
  const top=L[0];const conn=isConnStep18(top.s);
  return '<div class="dk18"><div class="dk18-top"><span><b id="dkN">'+L.length+'</b> '+(D.ahead?'coming up':'to review today')+'</span><span class="dk18-keys"><kbd>←</kbd> '+(conn?'skip':'redraft')+' <kbd>→</kbd> '+(conn?'connect':'approve')+'</span></div>'+
    '<div class="dk18-stack" id="dkStack">'+L.slice(0,3).map((q,i)=>lnCard18(c,q,i)).reverse().join('')+'</div>'+
    '<div class="dk18-act"><button class="dk18-b no" onclick="lnAct18(0)" aria-label="'+(conn?'Skip':'Redraft')+'">'+ico(conn?'x':'loop')+'<small id="dkNo">'+(conn?'Skip':'Redraft')+'</small></button>'+
      (conn?'':'<button class="dk18-b sk" onclick="lnSkip18()" aria-label="Later">'+ico('clock')+'<small>Later</small></button>')+
      '<button class="dk18-b yes" onclick="lnAct18(1)" aria-label="'+(conn?'Connect':'Approve')+'">'+ico('send')+'<small id="dkYes">'+(conn?'Connect':'Approve')+'</small></button></div></div>'};

/* left on a connection is a skip, not a redraft */
(function(){const f=lnAct18;lnAct18=function(yes){const t=lnTop();if(!t)return;if(!yes&&t.dataset.conn==='1'){if(t.dataset.busy)return;t.dataset.busy=1;LN18.skip[t.dataset.pid+':'+t.dataset.sid]=1;t.classList.add('fly-no');setTimeout(()=>go('launch',null,true),380);return}return f(yes)}})();

/* the send itself: record it, hand it to Amplify with its type, and say what happened */
lnSent18=function(c,pid,sid,text){const s=c.reach.steps.find(x=>x.id===sid);const x=campTargets(c).flatMap(a=>a.people.map(p=>({a,p}))).find(q=>q.p.id===pid);if(!s||!x){go('launch',null,true);return}
  const conn=isConnStep18(s);const type={workshop:'email',linkedin:conn?'li_connect':'li_msg',email:'email',phone:'call',event:'event',mail:'value',social:'value'}[s.ch]||'value';
  c.sent=c.sent||{};c.sent[pid+':'+sid]=today();S.activity.unshift({id:uid(),type,date:today(),accountId:x.a.id,person:x.p.name,note:s.t,qty:1,campaign:c.id});if(s.ch==='email'||s.ch==='mail')addSignal(x.a,'value_sent',{person:x.p.name,campaign:c.id});autoStage(x.a);
  const amp=S.launch.mode==='amplify'&&ampOn();const o={id:uid(),pid,sid,person:x.p.name,brand:x.a.name,ch:s.ch,step:s.t,conn,at:new Date().toISOString(),status:amp?'sending':'copied',text};
  c.out18=(c.out18||[]);c.out18.unshift(o);c.out18=c.out18.slice(0,200);
  if(amp){ampSend({id:o.id,type:conn?'connect':'message',camp:c.id,step:s.t,acc:x.a.id,pid,person:x.p.name,ch:s.ch,text,subject:(($('#dkSj')||{}).value)||'',asset:s.asset?{name:assetName(c,s.asset)||'',url:(bankItems?(bankItems(c).find(b=>b.slot===s.asset||b.id===s.asset)||{}).url:'')||''}:null})
    .then(r=>{o.status=r?'queued':'failed';o.ref=r&&r.ref||'';save();lnOutRefresh18()})}
  save();award('touch',s.t);refreshNav();const n=$('#lnSent');if(n){n.textContent=String(+n.textContent+1);n.parentNode.classList.remove('bump');void n.offsetWidth;n.parentNode.classList.add('bump')}
  toast(amp?(conn?'Handed to Amplify. Connection requests go out at a human pace, roughly one every 15 minutes.':'Handed to Amplify. It goes out at a human pace in working hours.'):!text?'Approved. Send the request from LinkedIn when you are ready.':'Approved and copied. Paste it into '+((REACH_CH.find(z=>z.k===s.ch)||{l:'the channel'}).l)+' when you are ready.');
  lnOutRefresh18();
  const st=$('#dkStack');if(!st){go('launch',null,true);return}const L=lnDue18(c).due;if(!L.length||L[0].x.p.id===pid){go('launch',null,true);return}
  setTimeout(()=>go('launch',null,true),60)};

/* the outbox: what you approved today and what Amplify did with it */
function lnOut18(c){const T=(c.out18||[]).filter(o=>o.at.slice(0,10)===today());const amp=S.launch.mode==='amplify'&&ampOn();
  const q=T.filter(o=>o.status==='queued').length,f=T.filter(o=>o.status==='failed').length,s=T.filter(o=>o.status==='sending').length;
  return '<details class="ob18" id="lnOut"'+(T.length?'':' hidden')+'><summary>'+ico('send')+'<b>Today’s outbox</b><span>'+T.length+' approved'+(amp?' · '+q+' with Amplify'+(s?' · '+s+' sending':'')+(f?' · <em>'+f+' failed</em>':''):'')+'</span>'+ico('arrow','a')+'</summary><div class="ob18-l">'+
    T.slice(0,30).map(o=>'<div class="ob18-r"><span class="ob18-s '+o.status+'">'+({queued:'With Amplify',sending:'Sending…',failed:'Failed',copied:'Copied'}[o.status]||o.status)+'</span><b>'+esc(o.person)+'</b><small>'+esc(o.brand)+' · '+esc(o.conn?'Connection request':o.step)+'</small><time>'+new Date(o.at).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})+'</time></div>').join('')+'</div></details>'}
function lnOutRefresh18(){const el=$('#lnOut');if(!el)return;const open=el.open;el.outerHTML=lnOut18(curCamp());const n=$('#lnOut');if(n&&open)n.open=true}
function lnAuto18(on){if(on&&!(S.launch.mode==='amplify'&&ampOn())){toast('Auto-approve works when Amplify is sending.');return}
  const run=()=>{S.launch.autoConn=on;save();if(on)lnAutoRun18(true);go('launch',null,true)};
  if(on)confirmBox('Auto-approve connection requests?','Otis hands every due connection request (no note) straight to Amplify, which sends them at a human pace, roughly one every 15 minutes. Messages still wait for your yes. You can switch this off any time.','Switch on',run);else run()}
function lnAutoRun18(force){const c=curCamp();if(!c||!campLive(c)||!S.launch.autoConn||!(S.launch.mode==='amplify'&&ampOn()))return;const Q=lnDue18(c).autoQ.slice(0,20);if(!Q.length)return;
  Q.forEach(q=>lnSent18Quiet(c,q));toast('Auto-approved '+Q.length+' connection request'+(Q.length===1?'':'s')+'. Amplify sends them at a human pace.')}
function lnSent18Quiet(c,q){const s=q.s,x=q.x;c.sent=c.sent||{};c.sent[x.p.id+':'+s.id]=today();S.activity.unshift({id:uid(),type:'li_connect',date:today(),accountId:x.a.id,person:x.p.name,note:s.t,qty:1,campaign:c.id});
  const o={id:uid(),pid:x.p.id,sid:s.id,person:x.p.name,brand:x.a.name,ch:'linkedin',step:s.t,conn:true,at:new Date().toISOString(),status:'sending',text:'',auto:1};c.out18=c.out18||[];c.out18.unshift(o);
  ampSend({id:o.id,type:'connect',camp:c.id,step:s.t,acc:x.a.id,pid:x.p.id,person:x.p.name,ch:'linkedin',text:''}).then(r=>{o.status=r?'queued':'failed';save();lnOutRefresh18()});save()}

/* the list: a quick bulk approver */
function lnList18(c){const D=lnDue18(c);const L=D.due;if(!L.length)return lnDeck18(c);
  return '<div class="ll18"><div class="ll18-h"><label class="ll18-all"><input type="checkbox" checked onchange="$$(\'.ll18-r input\').forEach(i=>i.checked=this.checked)"> Select all</label><span>'+L.length+' '+(D.ahead?'coming up':'due today')+'</span><button class="btn btn-primary btn-sm" onclick="lnBulk18()">'+ico('send')+'Approve selected</button></div>'+
    L.map((q,i)=>{const m=lnMsg18(c,q);const conn=isConnStep18(q.s);const ch=REACH_CH.find(x=>x.k===q.s.ch)||REACH_CH[0];
      return '<div class="ll18-r"><input type="checkbox" checked data-i="'+i+'" aria-label="Select '+esc(q.x.p.name)+'">'+(q.x.p.photo?'<img class="ll18-av" src="'+esc(q.x.p.photo)+'" alt="">':logo(q.x.a,32))+
        '<div class="ll18-m"><div><a href="'+esc(liOf18(q.x.p,q.x.a))+'" target="_blank" rel="noopener"><b>'+esc(q.x.p.name)+'</b></a><small>'+esc(q.x.a.name)+'</small><span class="dk18-ch" style="--cc:'+(ch.c||'var(--brand)')+'">'+ico(ch.ic)+esc(conn?'Connection':ch.l)+'</span></div><p>'+esc(m.nonote?'Connection request, no note.':(m.body||'').replace(/\s+/g,' ').slice(0,150)+'…')+'</p></div>'+
        '<button class="btn btn-line btn-xs" onclick="lnOpen18('+i+')">'+(m.nonote?'Review':'Edit')+'</button></div>'}).join('')+'</div>'}
function lnOpen18(i){const c=curCamp();const L=lnDue18(c).due;const q=L[i];if(!q)return;L.slice(0,i).forEach(z=>LN18.skip[z.x.p.id+':'+z.s.id]=2);LN18.mode='deck';go('launch',null,true);setTimeout(()=>{Object.keys(LN18.skip).forEach(k=>{if(LN18.skip[k]===2)delete LN18.skip[k]})},400)}
function lnBulk18(){const c=curCamp();const L=lnDue18(c).due;const pick=$$('.ll18-r input:checked').map(i=>L[+i.dataset.i]).filter(Boolean);if(!pick.length){toast('Tick at least one.');return}
  const amp=S.launch.mode==='amplify'&&ampOn();confirmBox('Approve '+pick.length+' item'+(pick.length===1?'':'s')+'?',amp?'Each one goes to Amplify, which sends at a human pace in working hours.':'They are marked as sent. Copy each message from the cards if you are sending yourself.','Approve',()=>{
    pick.forEach(q=>{const m=lnMsg18(c,q);const conn=isConnStep18(q.s);const s=q.s,x=q.x;c.sent=c.sent||{};c.sent[x.p.id+':'+s.id]=today();S.activity.unshift({id:uid(),type:conn?'li_connect':(s.ch==='linkedin'?'li_msg':s.ch==='email'?'email':'value'),date:today(),accountId:x.a.id,person:x.p.name,note:s.t,qty:1,campaign:c.id});
      const o={id:uid(),pid:x.p.id,sid:s.id,person:x.p.name,brand:x.a.name,ch:s.ch,step:s.t,conn,at:new Date().toISOString(),status:amp?'sending':'copied',text:m.body||''};c.out18=c.out18||[];c.out18.unshift(o);
      if(amp)ampSend({id:o.id,type:conn?'connect':'message',camp:c.id,step:s.t,acc:x.a.id,pid:x.p.id,person:x.p.name,ch:s.ch,text:m.body||'',subject:m.subject||''}).then(r=>{o.status=r?'queued':'failed';save();lnOutRefresh18()})});
    save();refreshNav();toast('Approved '+pick.length+'.');go('launch',null,true)})}

/* the Launch page, with the pace line, the outbox and the auto-approve switch */
(function(){const f=VIEWS.launch;VIEWS.launch=function(){const c=curCamp();if(!c||!campLive(c))return f.apply(this,arguments);if(!c.reach.steps)c.reach.steps=genSteps(c);
  const M=S.launch.mode||'manual';const amp=M==='amplify'&&ampOn();const tg=campTargets(c);const sent=Object.keys(c.sent||{}).length;
  const replies=sum(tg,a=>a.signals.filter(g=>['reply','li_reply','meeting'].includes(g.type)&&!g.cold18).length);const days=c.launched?Math.max(0,daysAgo(c.launched)):0;const ppl=[];tg.forEach(a=>a.people.forEach(p=>ppl.push({a,p})));
  return secHead('launch',esc(c.name)+' is <span class="serif">live.</span>')+
    '<div class="ln19-bar"><div class="ln19-n"><div><b id="lnSent">'+sent+'</b><small>sent</small></div><div><b>'+replies+'</b><small>replies</small></div><div><b>'+days+'</b><small>day'+(days===1?'':'s')+' live</small></div></div>'+
      '<div class="ln19-sw"><span>Review as</span>'+seg([['deck','Cards'],['list','Bulk list']],LN18.mode,"LN18.mode=$;go('launch',null,true)")+'</div>'+
      '<div class="ln19-sw"><span>Sending</span>'+seg([['manual','Myself'],['amplify','Amplify'+(isPremium()?'':' · Premium')]],M,"setMode($)")+'</div></div>'+
    (amp?'<div class="pace18"><span class="pace18-dot"></span><span><b>Amplify is sending at a human pace.</b> Connection requests go out roughly one every 15 minutes in working hours, messages in between.</span><label class="pace18-t"><input type="checkbox"'+(S.launch.autoConn?' checked':'')+' onchange="lnAuto18(this.checked)"> Auto-approve connection requests</label></div>':'')+
    lnOut18(c)+(LN18.mode==='deck'?lnDeck18(c):lnList18(c))};
  const g=VIEWS.launch_after;VIEWS.launch_after=function(){g&&g.apply(this,arguments);if(S.launch.autoConn){lnAutoRun18();lnOutRefresh18()}}})();
