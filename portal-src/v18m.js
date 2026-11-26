/* ═══════════ v18m LAUNCH: TODAY, AS A DECK ═══════════
   Every connection and message due today, one card at a time. Swipe right to approve and send, left to have Otis
   redraft it. Arrow keys work too. Prefer a list? One tap. Sending has a quiet, high-end flourish. */

let LN18={mode:'deck',seed:{},skip:{}};
function lnDue18(c){const steps=c.reach.steps.filter(s=>!s.task).slice().sort((a,b)=>a.w-b.w);const ppl=[];campTargets(c).forEach(a=>a.people.forEach(p=>ppl.push({a,p})));
  const wk=Math.max(1,campWk(c).n||1);const up=ppl.map(x=>({x,s:nextFor(c,x.p.id,steps)})).filter(q=>q.s&&!LN18.skip[q.x.p.id+':'+q.s.id]).filter(q=>!(q.s.warm&&!warmReady(q.x.a,q.x.p))).filter(q=>!Object.keys(c.sent||{}).some(k=>k.indexOf(q.x.p.id+':')===0&&c.sent[k]===today())).sort((a,b)=>a.s.w-b.s.w);
  const due=up.filter(q=>q.s.w<=wk);return{due:due.length?due:up.slice(0,12),ahead:!due.length,ppl,steps}}
function lnMsg18(c,q){const k=q.x.p.id+':'+q.s.id;const dr=c.drafts&&c.drafts[k];const g=composeMsg(q.s,q.x.a,q.x.p,c,{seed:(S.compose.seed||0)+(LN18.seed[k]||0)});return dr&&!g.nonote?{subject:dr.s||g.subject,body:dr.b,nonote:g.nonote}:g}
function lnCard18(c,q,i){const a=q.x.a,p=q.x.p,s=q.s;const ch=REACH_CH.find(x=>x.k===s.ch)||REACH_CH[0];const m=lnMsg18(c,q);const asset=assetName(c,s.asset);
  return '<article class="dk18-c'+(i?' back b'+i:' top')+'" '+(i?'aria-hidden="true"':'id="dkTop" data-pid="'+p.id+'" data-sid="'+s.id+'"')+'>'+
    (i?'':'<span class="dk18-st yes">'+ico('send')+'Approve</span><span class="dk18-st no">'+ico('loop')+'Redraft</span>')+
    '<header>'+logo(a,46)+'<div class="grow"><b>'+esc(p.name)+'</b><small>'+esc([p.role,a.name].filter(Boolean).join(' · '))+'</small></div><span class="dk18-ch" style="--cc:'+(ch.c||'var(--brand)')+'">'+ico(ch.ic)+esc(ch.l)+'</span></header>'+
    '<div class="dk18-k"><span>Week '+s.w+'</span><b>'+esc(s.t)+'</b>'+(asset?'<em>'+ico('gift')+esc(asset)+'</em>':'')+'</div>'+
    (m.nonote?'<div class="dk18-nn">'+ico('linkedin')+'<div><b>A connection request, no note.</b><span>Your profile does the talking. Approve and it goes out as a plain request.</span></div></div>':
      (m.subject?'<input class="inp dk18-sj" id="dkSj" value="'+esc(m.subject)+'" aria-label="Subject">':'')+'<textarea class="inp dk18-m" id="dkMsg" rows="6" aria-label="Message">'+esc(m.body)+'</textarea>')+
    '</article>'}
function lnDeck18(c){const D=lnDue18(c);const L=D.due;const done=Object.keys(c.sent||{}).length;const tot=L.length;
  if(!L.length)return '<div class="dk18-empty">'+agentFace('launch',64,{badge:false})+'<h3>All done for today.</h3><p>Otis lines up tomorrow’s messages overnight. Nothing is waiting on you.</p><button class="btn btn-line" onclick="go(\'signals\')">See who is warming up</button></div>';
  return '<div class="dk18"><div class="dk18-top"><span><b id="dkN">'+tot+'</b> '+(D.ahead?'coming up':'to review today')+'</span><span class="dk18-keys"><kbd>←</kbd> redraft <kbd>→</kbd> approve</span></div>'+
    '<div class="dk18-stack" id="dkStack">'+L.slice(0,3).map((q,i)=>lnCard18(c,q,i)).reverse().join('')+'</div>'+
    '<div class="dk18-act"><button class="dk18-b no" onclick="lnAct18(0)" aria-label="Redraft">'+ico('loop')+'<small>Redraft</small></button><button class="dk18-b sk" onclick="lnSkip18()" aria-label="Skip for today">'+ico('clock')+'<small>Later</small></button><button class="dk18-b yes" onclick="lnAct18(1)" aria-label="Approve and send">'+ico('send')+'<small>Approve</small></button></div></div>'}
function lnTop(){return $('#dkTop')}
function lnKeep18(){const t=lnTop();if(!t)return;const c=curCamp();const k=t.dataset.pid+':'+t.dataset.sid;const m=$('#dkMsg');if(m){c.drafts=c.drafts||{};const sj=$('#dkSj');c.drafts[k]={s:sj?sj.value:'',b:m.value}}}
function lnAct18(yes){const t=lnTop();if(!t||t.dataset.busy)return;t.dataset.busy=1;const c=curCamp();const pid=t.dataset.pid,sid=t.dataset.sid;const k=pid+':'+sid;
  if(yes){const m=$('#dkMsg');const dirty=m&&c.drafts&&c.drafts[k]?1:0;if(m&&!dirty){}lnKeep18();t.classList.add('fly-yes');lnSpark18(t);
    setTimeout(()=>{ptPerson=pid;ptStep=sid;const text=(($('#dkMsg')||{}).value||'');if(text&&S.launch.mode!=='amplify')copyText(text);lnSent18(c,pid,sid,text)},380)}
  else{t.classList.add('flip');LN18.seed[k]=(LN18.seed[k]||0)+1;if(c.drafts)delete c.drafts[k];
    setTimeout(()=>{const q=lnDue18(c).due.find(x=>x.x.p.id===pid&&x.s.id===sid);if(!q){go('launch',null,true);return}const tmp=document.createElement('div');tmp.innerHTML=lnCard18(c,q,0);const n=tmp.firstElementChild;n.classList.add('redrafted');t.replaceWith(n);lnSwipe18();
      const ta=$('#dkMsg');if(ta)ta.classList.add('typing')},300)}}
function lnSent18(c,pid,sid,text){const s=c.reach.steps.find(x=>x.id===sid);const x=campTargets(c).flatMap(a=>a.people.map(p=>({a,p}))).find(q=>q.p.id===pid);if(!s||!x){go('launch',null,true);return}
  const type={workshop:'email',linkedin:s.nonote?'li_connect':'li_msg',email:'email',phone:'call',event:'event',mail:'value',social:'value'}[s.ch]||'value';
  c.sent=c.sent||{};c.sent[pid+':'+sid]=today();S.activity.unshift({id:uid(),type,date:today(),accountId:x.a.id,person:x.p.name,note:s.t,qty:1,campaign:c.id});if(s.ch==='email'||s.ch==='mail')addSignal(x.a,'value_sent',{person:x.p.name,campaign:c.id});autoStage(x.a);
  if(S.launch.mode==='amplify'&&ampOn()){ampSend({camp:c.id,sid,acc:x.a.id,pid,person:x.p.name,ch:s.ch,step:s.t,text}).catch(()=>{})}
  save();award('touch',s.t);refreshNav();const n=$('#lnSent');if(n){n.textContent=String(+n.textContent+1);n.parentNode.classList.remove('bump');void n.offsetWidth;n.parentNode.classList.add('bump')}
  toast(S.launch.mode==='amplify'?'Approved. Amplify sends it at a human pace.':!text?'Approved. Send the request from LinkedIn when you are ready.':'Approved and copied. Paste it into '+((REACH_CH.find(z=>z.k===s.ch)||{l:'the channel'}).l)+' when you are ready.');
  const st=$('#dkStack');if(!st){go('launch',null,true);return}const D=lnDue18(c);const L=D.due;const top=lnTop();if(top)top.remove();
  const kids=[...st.children];kids.forEach(k=>{if(k.classList.contains('b1')){k.outerHTML=L[0]?lnCard18(c,L[0],0):''}});
  [...st.children].forEach(k=>{if(k.classList.contains('b2')){k.classList.remove('b2');k.classList.add('b1')}});if(L[2])st.insertAdjacentHTML('afterbegin',lnCard18(c,L[2],2));
  const nn=$('#dkN');if(nn)nn.textContent=L.length;if(!L.length)go('launch',null,true);else lnSwipe18()}
function lnSkip18(){const t=lnTop();if(!t)return;LN18.skip[t.dataset.pid+':'+t.dataset.sid]=1;t.classList.add('fly-down');setTimeout(()=>go('launch',null,true),300)}
function lnSpark18(t){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=t.getBoundingClientRect();const g=document.createElement('div');g.className='dk18-glow';g.style.cssText='left:'+(r.right-40)+'px;top:'+(r.top+r.height/2)+'px';document.body.appendChild(g);
  for(let i=0;i<8;i++){const d=document.createElement('i');d.className='dk18-p';const a=(i/8)*Math.PI*2;d.style.cssText='left:'+(r.right-40)+'px;top:'+(r.top+r.height/2)+'px;--x:'+(Math.cos(a)*70+60).toFixed(0)+'px;--y:'+(Math.sin(a)*60).toFixed(0)+'px;animation-delay:'+(i*12)+'ms';document.body.appendChild(d);setTimeout(()=>d.remove(),900)}
  setTimeout(()=>g.remove(),900)}
function lnSwipe18(){const c=lnTop();if(!c||c.dataset.sw)return;c.dataset.sw=1;let x0=null,dx=0;
  c.addEventListener('pointerdown',e=>{if(e.target.closest('textarea,input,button'))return;x0=e.clientX;dx=0;c.setPointerCapture(e.pointerId);c.style.transition='none'});
  c.addEventListener('pointermove',e=>{if(x0==null)return;dx=e.clientX-x0;c.style.transform='translateX('+dx+'px) rotate('+(dx/22)+'deg)';c.style.setProperty('--lean',Math.max(-1,Math.min(1,dx/140)));c.classList.toggle('lean-yes',dx>50);c.classList.toggle('lean-no',dx<-50)});
  const up=()=>{if(x0==null)return;x0=null;c.style.transition='';if(Math.abs(dx)>120){c.style.transform='';lnAct18(dx>0?1:0);return}c.style.transform='';c.classList.remove('lean-yes','lean-no');c.style.removeProperty('--lean')};
  c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up)}
document.addEventListener('keydown',e=>{if(VIEW!=='launch'||!lnTop()||LN18.mode!=='deck')return;if(/INPUT|TEXTAREA|SELECT/.test((e.target||{}).tagName||''))return;if($('#modal')&&$('#modal').classList.contains('on'))return;
  if(e.key==='ArrowRight'){e.preventDefault();e.stopImmediatePropagation();lnAct18(1)}if(e.key==='ArrowLeft'){e.preventDefault();e.stopImmediatePropagation();lnAct18(0)}},true);

/* the live Launch page: four numbers, one way of working, today's deck */
(function(){const f=VIEWS.launch;VIEWS.launch=function(){const c=curCamp();if(!c||!campLive(c))return f.apply(this,arguments);if(!c.reach.steps)c.reach.steps=genSteps(c);
  const M=S.launch.mode||'manual';const tg=campTargets(c);const sent=Object.keys(c.sent||{}).length;const replies=sum(tg,a=>a.signals.filter(g=>['reply','li_reply','meeting'].includes(g.type)).length);const days=c.launched?Math.max(0,daysAgo(c.launched)):0;
  const ppl=[];tg.forEach(a=>a.people.forEach(p=>ppl.push({a,p})));
  return secHead('launch',esc(c.name)+' is <span class="serif">live.</span>')+
    '<div class="ln19-bar"><div class="ln19-n"><div><b id="lnSent">'+sent+'</b><small>sent</small></div><div><b>'+replies+'</b><small>replies</small></div><div><b>'+days+'</b><small>day'+(days===1?'':'s')+' live</small></div></div>'+
      '<div class="ln19-sw"><span>Review as</span>'+seg([['deck','Cards'],['list','A list']],LN18.mode,"LN18.mode=$;go('launch',null,true)")+'</div>'+
      '<div class="ln19-sw"><span>Sending</span>'+seg([['manual','Myself'],['amplify','Amplify'+(isPremium()?'':' · Premium')]],M,"setMode($)")+'</div></div>'+
    (LN18.mode==='deck'?lnDeck18(c):(M==='amplify'?amplifyView(c):missionControl(c,ppl)))};
  const g=VIEWS.launch_after;VIEWS.launch_after=function(){g&&g.apply(this,arguments);lnSwipe18();const ta=$('#dkMsg');if(ta)ta.addEventListener('input',lnKeep18)}})();
(function(){const i=PT_DEMO.findIndex(s=>s.view==='launch');if(i>-1)Object.assign(PT_DEMO[i],{sel:'.dk18,.ln18-pre,.ln18-main',t:'Launch: swipe through today',b:'Every connection and message due today, one card at a time, written in your voice. Swipe right to approve and send, left for Otis to redraft it. Prefer a list? One tap.'})})();
