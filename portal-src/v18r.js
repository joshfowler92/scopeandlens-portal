/* ═══════════ v18r: replies read for meaning, and a timeline for every person ═══════════ */

/* a reply only warms a brand when it is real interest. "Not now" cools it. Someone selling to you is ignored. */
SIGNALS.reply_no={l:'Replied: not for now',w:0,fam:'outbound',ic:'✋'};
const RK_NO18=/\b(not interested|no thanks|no thank you|not for us|not right now|not at the moment|not a priority|no budget|please remove|unsubscribe|stop (messaging|contacting)|take me off|not the right person|wrong person|we('re| are) (all )?set|happy with our (current )?agency|already have an agency|not looking|pass on this)\b/i;
const RK_PITCH18=/\b(we help (brands|companies|agencies|businesses)|i help (brands|companies|agencies)|book a (quick )?(demo|call) with (me|us)|our (platform|software|solution|tool) (helps|can)|would you be open to a (quick )?(call|chat) (to|about) (see|learn)|i('d| would) love to show you|partnership opportunity|special offer|free trial|grow your (agency|business)|lead generation services|outsourc)/i;
const RK_YES18=/\b(yes|sure|sounds (good|great|interesting)|interested|love to|happy to|let'?s (talk|chat|speak|meet)|keen|tell me more|send (it|it over|me)|when (are|is) (you|good)|free (on|next)|book|calendar|diary|coffee)\b/i;
function replyKind18(t){t=String(t||'');if(!t.trim())return 'unknown';if(RK_PITCH18.test(t))return 'pitch';if(RK_NO18.test(t))return 'no';if(RK_YES18.test(t))return 'yes';return 'neutral'}
ampEvents=async function(){if(!ampOn())return 0;try{const j=await ampCall('events',{since:S.ampSince||isoDaysAgo(30)});let n=0,skip=0,cool=0,pitch=0;
  (j.events||[]).forEach(ev=>{const a=findAccountByName(ev.company||'');let t={accept:'li_accept',open:'email_open',click:'email_click',reply:'reply',li_reply:'li_reply',meeting:'meeting'}[ev.type];if(!t)return;
    if(!a||!inCamp18(a)||(CONV18.includes(t)&&ev.person&&!personOk18(a,ev.person))){skip++;return}
    const text=String(ev.text||ev.message||ev.snippet||ev.body||'').slice(0,600);
    if(t==='reply'||t==='li_reply'){const k=replyKind18(text);if(k==='pitch'){pitch++;return}if(k==='no'){t='reply_no';cool++}}
    if(t==='li_accept'||t==='li_reply'){const p=(a.people||[]).find(x=>sameName18(x.name,ev.person));if(p)p.connected=true}
    const c=campsFor(a).sort((x,y)=>campLive(y)-campLive(x))[0];addSignal(a,t,{person:ev.person||'',date:(ev.at||today()).slice(0,10),src:'amplify',campaign:c?c.id:'',note:text});n++});
  S.ampSince=today();S.ampSkipped18=(S.ampSkipped18||0)+skip;S.ampPitch18=(S.ampPitch18||0)+pitch;save();if(cool||pitch)toast((cool?cool+' repl'+(cool===1?'y says':'ies say')+' not for now, so '+(cool===1?'that brand stays':'those brands stay')+' cool. ':'')+(pitch?pitch+' sales pitch'+(pitch===1?'':'es')+' to you ignored.':''));return n}catch(e){return 0}};

/* everything that has happened with one person, in order */
function personTimeline18(aid,pid){const a=accountById(aid);const p=a&&a.people.find(x=>x.id===pid);if(!p)return;const c=curCamp();
  const ev=[];const nm=p.name;
  (S.activity||[]).filter(x=>x.accountId===aid&&sameName18(x.person,nm)).forEach(x=>ev.push({d:x.date,ic:x.type==='li_connect'?'linkedin':x.type==='email'?'mail':x.type==='li_msg'?'chat':'send',t:({li_connect:'Connection request sent',li_msg:'LinkedIn message sent',email:'Email sent',call:'Call',event:'Event invite',value:'Value sent'}[x.type]||'Touch')+(x.note?': '+x.note:''),who:'you'}));
  S.campaigns.forEach(cc=>(cc.out18||[]).filter(o=>o.pid===pid).forEach(o=>{const e=ev.find(z=>z.who==='you'&&z.d===o.at.slice(0,10)&&!z.msg);if(e){e.msg=o.text;e.st=o.status}}));
  (a.signals||[]).filter(g=>sameName18(g.person,nm)).forEach(g=>{const D=SIGNALS[g.type]||{l:g.type};ev.push({d:g.date,ic:/reply|meeting/.test(g.type)?'chat':g.type==='li_accept'?'check':'pulse',t:D.l,who:'them',msg:g.note,cool:g.type==='reply_no'})});
  ev.sort((x,y)=>String(y.d).localeCompare(String(x.d)));
  const li=liOf18(p,a);const ph=p.photo||photoByName18(p.name,a);
  modal('<div class="tl18"><div class="tl18-h">'+(ph?'<img src="'+esc(ph)+'" alt="">':'<span class="dmp-av">'+esc(initials(p.name))+'</span>')+'<div class="grow"><h2>'+esc(p.name)+'</h2><span>'+esc([p.role,a.name].filter(Boolean).join(' · '))+'</span></div><a class="btn btn-line btn-sm" href="'+esc(li)+'" target="_blank" rel="noopener">'+ico('linkedin')+'LinkedIn</a></div>'+
    '<div class="tl18-note">'+ico('edit')+'<span>'+(p.note18?esc(p.note18):'<em>No note yet. Add what Otis should know about them.</em>')+'</span><button class="link" onclick="closeOverlays();setTimeout(()=>noteFor18(\''+aid+'\',\''+pid+'\'),200)">'+(p.note18?'Edit':'Add a note')+'</button></div>'+
    (ev.length?'<ol class="tl18-l">'+ev.map(e=>'<li class="'+e.who+(e.cool?' cool':'')+'"><span class="tl18-i">'+ico(e.ic)+'</span><div><div class="tl18-t"><b>'+esc(e.t)+'</b><time>'+esc(fmtDate(e.d))+'</time>'+(e.st?'<em class="ob18-s '+e.st+'">'+({queued:'With Amplify',sending:'Sending',failed:'Failed',copied:'Copied'}[e.st]||e.st)+'</em>':'')+'</div>'+(e.msg?'<p>'+esc(e.msg).replace(/\n/g,'<br>')+'</p>':'')+'</div></li>').join('')+'</ol>':'<div class="empty">Nothing yet. Their first touch will show here, and so will anything they send back.</div>')+
    '<p class="tiny muted">Replies come in from Amplify. The full LinkedIn thread will show here once Amplify shares conversation history.</p></div>',true)}

/* reach it from the people cards and from the Launch card */
(function(){const f=pRow;pRow=function(a,p,mine){let h=f(a,p,mine);if(mine)h=h.replace('<button class="btn btn-ghost btn-xs" onclick="noteFor18','<button class="btn btn-ghost btn-xs" onclick="personTimeline18(\''+a.id+'\',\''+p.id+'\')">'+ico('clock')+'History</button><button class="btn btn-ghost btn-xs" onclick="noteFor18');return h}})();
(function(){const f=lnCard18;lnCard18=function(c,q,i){let h=f(c,q,i);if(!i)h=h.replace('<a class="dk18-li"','<button class="dk18-hi" onclick="personTimeline18(\''+q.x.a.id+'\',\''+q.x.p.id+'\')">'+ico('clock')+'History</button><a class="dk18-li"');return h}})();
