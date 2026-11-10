/* ═══════════ v13.2: PLATO REMINDS YOU, AND TASKS WAIT FOR THEIR WEEK ═══════════
   1. A task can only be ticked off once it is due: in its scheduled week (or later) and after the step
      before it for that person. Ticking off a future task did nothing useful, so it is now blocked
      with a clear note of when it unlocks.
   2. Plato keeps an eye on what is still to do: campaign tasks due or overdue, anything that has become
      incomplete (a profile field, a content bank slot, a campaign step), unanswered replies and stale
      deals. He nudges once per item per day from the bottom right, lists them all when asked, and the
      bell holds them too. */
function weekDate(c,w){if(!c||!c.launched)return '';const d=new Date(c.launched);d.setDate(d.getDate()+(w-1)*7);return d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})}
function stepLock(c,pid,s){const steps=(c.reach.steps||[]).slice().sort((a,b)=>a.w-b.w);const nx=nextFor(c,pid,steps);
  if(c.sent&&c.sent[pid+':'+s.id])return null;
  const wk=campLive(c)?campWeek(c):1;
  if(s.w>wk)return 'Not due yet. This one is scheduled for week '+s.w+(c.launched?' ('+weekDate(c,s.w)+')':'')+', so it unlocks then.';
  if(nx&&nx.id!==s.id&&nx.w<=s.w)return 'Do “'+nx.t+'” first. Steps go out in order, so each one lands at the right moment.';
  return null}
const _markStepSent132=markStepSent;markStepSent=function(force){const c=curCamp();const s=c&&c.reach.steps.find(x=>x.id===ptStep);if(s&&ptPerson){const why=stepLock(c,ptPerson,s);if(why){toast('⏳ '+why);return}}return _markStepSent132.apply(this,arguments)};
/* everything outstanding, oldest and most important first */
function reminders(){const out=[];const add=(id,t,s,btn,f,w)=>out.push({id,t,s,btn,f,w});
  S.campaigns.filter(c=>campLive(c)&&c.reach.steps).forEach(c=>{const steps=c.reach.steps.slice().sort((a,b)=>a.w-b.w);const wk=campWeek(c);let due=0,over=0;
    campTargets(c).forEach(a=>a.people.forEach(p=>{const s=nextFor(c,p.id,steps);if(!s||s.w>wk)return;due++;if(s.w<wk)over++}));
    if(over)add('over:'+c.id,over+' task'+(over===1?' is':'s are')+' overdue in '+c.name,'They were due in an earlier week. Catch up before this week’s go out.',['Catch up',"S.cur='"+c.id+"';save();go('launch')"],0,100);
    else if(due)add('due:'+c.id,due+' task'+(due===1?'':'s')+' due this week in '+c.name,'Week '+wk+' of '+(c.reach.weeks||12)+'. About '+Math.max(5,due*2)+' minutes.',['Open Launch',"S.cur='"+c.id+"';save();go('launch')"],0,90);
    if(!(c.blocks||[]).some(b=>b.file||b.manual)&&!(isPremium()&&S.launch.connected)&&wk>=2)add('data:'+c.id,'No results in for '+c.name+' yet','Upload its outreach export so Signals & Intent can show who is engaging.',['Upload',"openImport('"+c.id+"','outreach')"],0,50)});
  S.campaigns.filter(c=>!campLive(c)&&!(isBlankCamp(c)&&!c.touched)).forEach(c=>{const k=OUT_K.find(x=>campStepState(c,x)<2);if(k)add('step:'+c.id+':'+k,(MODULES.find(m=>m.k===k)||{l:k}).l+' is not finished for '+c.name,AGENTS[k].n+' is waiting on you.',['Continue',"S.cur='"+c.id+"';save();go('"+k+"')"],0,70);
    if(typeof bankReady==='function'&&OUT_K.indexOf(k)>1&&!bankReady(c))add('bank:'+c.id,'The content bank for '+c.name+' is incomplete','Launch needs a hero piece, a case study and a blog post or report.',['Add content',"S.cur='"+c.id+"';save();go('give')"],0,65)});
  if(!profReady()&&!DEMO_MODE)add('prof','Your agency profile is incomplete',agPct()+'% done. Campaigns are built from it.',['Finish it',"go('agency')"],0,95);
  try{unanswered().forEach(x=>add('reply:'+x.a.id,(x.s.person?x.s.person.split(' ')[0]:'Someone')+' at '+x.a.name+' replied '+rel(x.s.date),'No answer has gone back yet.',['Open',"openAccount('"+x.a.id+"')"],0,98))}catch(e){}
  S.opps.filter(o=>!['won','lost'].includes(o.lane)&&daysAgo(o.updated||o.created)>14).forEach(o=>add('opp:'+o.id,o.name+' has not moved for '+daysAgo(o.updated||o.created)+' days','Set a next step so it does not go cold.',['Update',"openOppForm('"+o.id+"')"],0,60));
  return out.sort((a,b)=>b.w-a.w)}
/* Plato nudges about the most important outstanding item, once per item per day, never during the walkthrough or a tour */
function remindTick(){try{if(!S||DEMO_MODE||$('#onb')||$('#tourCard')||$('#modal.on')||(typeof platoOpen!=='undefined'&&platoOpen))return;const R=reminders();if(!R.length)return;
  const d=today();S.reminded=S.reminded||{};Object.keys(S.reminded).forEach(k=>{if(S.reminded[k]!==d)delete S.reminded[k]});
  const r=R.find(x=>!S.reminded[x.id]);if(!r)return;S.reminded[r.id]=d;save();
  platoNudge('A reminder: '+r.t.charAt(0).toLowerCase()+r.t.slice(1)+'. '+r.s+(R.length>1?' ('+(R.length-1)+' more. Ask me what is still to do.)':''),[r.btn[0],r.btn[1]]);
  if(!S.notifications.some(n=>n.rid===r.id&&n.date===d)){S.notifications.unshift({id:uid(),rid:r.id,date:d,read:false,ic:'⏰',title:r.t,body:r.s});S.notifications=S.notifications.slice(0,60);save();try{renderBell()}catch(e){}}}catch(e){}}
setTimeout(()=>{setTimeout(remindTick,9000);setInterval(remindTick,20*60*1000)},0);
/* ask Plato "what have I not done?" and he lists them */
function platoReminders(){const R=reminders();platoSay(R.length?'<b>Still to do, most important first:</b><ol class="pl-rem">'+R.slice(0,8).map(r=>'<li><b>'+esc(r.t)+'</b><br><span class="muted">'+esc(r.s)+'</span><br><button class="btn btn-line btn-xs" onclick="'+r.btn[1]+'">'+esc(r.btn[0])+'</button></li>').join('')+'</ol>'+(R.length>8?'<span class="muted">And '+(R.length-8)+' more.</span>':''):'Nothing outstanding. Everything due is done. A good day to give first.',false)}
const _platoAsk132=platoAsk;platoAsk=function(q){if(/\b(remind|reminders|what (have|haven.t) i (not )?done|still to do|outstanding|overdue|to-?do|todo)\b/i.test(String(q||''))){platoSay(esc(q),true);platoReminders();return}return _platoAsk132.apply(this,arguments)};
const _platoStarters132=platoStarters;platoStarters=function(){const s=_platoStarters132.apply(this,arguments)||[];const n=reminders().length;return n?['What is still to do? ('+n+')'].concat(s).slice(0,4):s};
