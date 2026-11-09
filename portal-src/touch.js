/* ═══════════ TOUCHPOINTS AND TASKS ═══════════ */
let LS={};
function openLogSheet(o){o=o||{};const ex=o.edit?S.activity.find(x=>x.id===o.edit):null;LS={type:ex?ex.type:(o.type||'email'),acc:ex?ex.accountId:(o.acc||''),edit:o.edit||''};
  const accs=S.accounts.slice().sort((x,y)=>x.name.localeCompare(y.name));
  modal('<h2>'+(ex?'Edit touchpoint':'Log a touchpoint')+'</h2><p class="sub">Record what happened. Inbound moments, like an accepted connection, a reply or a meeting, also lift the brand in Signals.</p>'+
  '<div class="field"><label>What happened</label><div class="chips" id="lsType">'+ACTS.map(a=>'<button class="chip'+(a.k===LS.type?' on':'')+'" data-k="'+a.k+'">'+a.ic+' '+a.l+'</button>').join('')+'</div></div>'+
  '<div class="grid2"><div class="field"><label>Account</label><select class="inp" id="lsAcc" onchange="LS.acc=this.value;lsDraw()"><option value="">Not linked to an account</option><option value="__new">+ A new organisation</option>'+accs.map(a=>'<option value="'+a.id+'"'+(a.id===LS.acc?' selected':'')+'>'+esc(a.name)+'</option>').join('')+'</select></div>'+
  '<div class="field"><label>With who</label><input class="inp" id="lsPerson" list="lsP" placeholder="Name (optional)" value="'+esc(ex?ex.person:(o.person||''))+'"><datalist id="lsP"></datalist></div></div>'+
  '<div class="field" id="lsNewF" style="display:none"><label>Organisation name</label><input class="inp" id="lsNew" oninput="lsDraw()" value="'+esc(o.newOrg||'')+'"></div>'+
  '<div class="grid2"><div class="field"><label>When</label><input class="inp" type="date" id="lsDate" value="'+(ex?ex.date:today())+'"></div><div class="field"><label>How many</label><input class="inp" type="number" min="1" id="lsQty" value="'+(ex?ex.qty||1:1)+'"><span class="hint">For batches, like 20 connection requests.</span></div></div>'+
  '<div class="field"><label>Note (optional)</label><input class="inp" id="lsNote" value="'+esc(ex?ex.note:(o.note||''))+'" placeholder="Anything worth remembering"></div>'+
  '<div id="lsEffect"></div><div class="modal-foot">'+(ex?'<button class="lft btn btn-danger btn-sm" onclick="closeOverlays();delAct(\''+ex.id+'\')">Remove</button>':'')+'<button class="btn btn-ghost" onclick="closeOverlays()">Cancel</button><button class="btn btn-primary" id="lsGo" onclick="saveLog()">Save</button></div>',true);
  if(o.newOrg){$('#lsAcc').value='__new';LS.acc='__new'}
  $$('#lsType .chip').forEach(b=>b.onclick=()=>{LS.type=b.dataset.k;$$('#lsType .chip').forEach(x=>x.classList.toggle('on',x===b));lsDraw()});setTimeout(lsDraw,20)}
function lsDraw(){const def=ACTS.find(a=>a.k===LS.type);const isNew=LS.acc==='__new';$('#lsNewF').style.display=isNew?'':'none';const a=isNew?null:accountById(LS.acc);const nm=isNew?$('#lsNew').value.trim():a&&a.name;
  if(a)$('#lsP').innerHTML=a.people.map(p=>'<option value="'+esc(p.name)+'">').join('');
  const items=[(LS.edit?'The touchpoint is updated':'A '+def.l.toLowerCase()+' is added to your touchpoints')+' and counts towards your weekly goals.'];
  if(nm&&def.sig)items.push('It also adds a <b>'+SIGNALS[def.sig].l.toLowerCase()+'</b> signal to '+esc(nm)+', which lifts its heat.');
  if(nm&&['meeting','reply','li_reply','call'].includes(LS.type))items.push(esc(nm)+' moves to <b>Conversation</b> if it is earlier than that.');
  if(isNew&&nm)items.unshift('<b>'+esc(nm)+'</b> is added to Who.');if(!nm)items.push('Link it to an account to feed Signals.');items.push('You can undo straight after.');
  $('#lsEffect').innerHTML=effect(items);$('#lsGo').textContent=LS.edit?'Save changes':'Log '+def.l.toLowerCase()}
function saveLog(){const def=ACTS.find(a=>a.k===LS.type);const isNew=LS.acc==='__new';const person=$('#lsPerson').value.trim(),note=$('#lsNote').value.trim(),date=$('#lsDate').value||today(),qty=Math.max(1,+$('#lsQty').value||1);let a=isNew?null:accountById(LS.acc);
  if(isNew&&!$('#lsNew').value.trim()){$('#lsNew').focus();return}
  act(LS.edit?'Updated the touchpoint':'Logged '+def.l.toLowerCase()+(a||isNew?' with '+(person||(a?a.name:$('#lsNew').value.trim())):''),()=>{if(isNew)a=ensureAccount($('#lsNew').value.trim());
    if(LS.edit){const f=S.activity.find(x=>x.id===LS.edit);Object.assign(f,{type:LS.type,accountId:a?a.id:'',person,note,date,qty})}
    else{S.activity.unshift({id:uid(),type:LS.type,date,accountId:a?a.id:'',person,note,qty});if(a&&def.sig)addSignal(a,def.sig,{person,note,date})}
    if(a&&person)addPerson(a,{name:person});if(a)autoStage(a)},{ic:def.ic});
  if(a&&def.sig&&!LS.edit)signalAlert(a,def.sig);if(!LS.edit){const g=def.sig;award(g==='meeting'?'meeting':['reply','li_reply'].includes(g)?'reply':'touch',def.l,['reply','li_reply','meeting'].includes(g)?1:Math.min(qty,10))}checkIntent();closeOverlays()}
function delAct(id){const f=S.activity.find(x=>x.id===id);if(!f)return;const def=ACTS.find(a=>a.k===f.type)||{l:'touchpoint'};act('Removed a '+def.l.toLowerCase(),()=>{S.activity=S.activity.filter(a=>a.id!==id)});if($('#drawer').classList.contains('on')&&f.accountId)openAccount(f.accountId,'timeline')}
/* type it as you would say it, then confirm what we understood */
function previewCapture(txt){txt=(txt||'').trim();if(!txt){toast('Type what happened first');return}const t=txt.toLowerCase();
  const rules=[['meeting',/\b(meeting|met|coffee|lunch|dinner|drinks|workshop|catch.?up)\b/],['call',/\b(call|called|phone|spoke|rang)\b/],['li_reply',/\blinkedin\b.*\brepl/],['reply',/\b(replied|reply|responded|got back)\b/],
    ['li_accept',/\b(accepted|connected)\b/],['value',/\b(sent|shared|teardown|audit|benchmark|report|case study)\b/],['event',/\b(event|breakfast|conference|roundtable|webinar)\b/],['li_msg',/\b(message|messaged|dm|inmail)\b/],['email',/\b(email|emailed)\b/],['li_connect',/\b(connection request|connect)\b/]];
  const type=(rules.find(r=>r[1].test(t))||['call'])[0];let acc=null;S.accounts.slice().sort((a,b)=>b.name.length-a.name.length).forEach(a=>{if(!acc&&t.includes(a.name.toLowerCase()))acc=a});
  let newOrg='';if(!acc){const m=txt.match(/\b(?:at|from|@)\s+([A-Z][\w&'.-]*(?:\s+(?:&\s+)?[A-Z][\w&'.-]*)*)/);if(m)newOrg=m[1].trim()}
  const pm=txt.match(/\b(?:with|to|from)\s+([A-Z][a-z'-]+(?:\s+[A-Z][a-z'-]+)?)/);let person=pm?pm[1]:'';if(acc&&person&&acc.name.startsWith(person))person='';if(newOrg&&person&&newOrg.startsWith(person))person='';
  const note=(txt.split(/,\s*/).slice(1).join(', ')||txt).trim();
  openLogSheet({type,acc:acc?acc.id:'',person,note,newOrg});setTimeout(()=>toast('Here is what we understood. Check it, then save.'),300)}

/* ═══════════ TASKS ═══════════ */
function openTaskForm(){modal('<h2>Add a task</h2><div class="field"><label>What needs doing</label><input class="inp" id="tkIn" placeholder="e.g. Send the breakfast invites"></div><div class="grid2"><div class="field"><label>Due</label><input class="inp" type="date" id="tkDue" value="'+today()+'"></div><div class="field"><label>Priority</label><select class="inp" id="tkPri"><option value="high">High</option><option value="medium" selected>Medium</option><option value="low">Low</option></select></div></div>'+
  '<div class="field"><label>Account (optional)</label><select class="inp" id="tkAcc"><option value="">None</option>'+S.accounts.map(a=>'<option value="'+a.id+'">'+esc(a.name)+'</option>').join('')+'</select></div>'+effect(['It shows in Your list on Today, and in your next moves when it is due.'])+
  '<div class="modal-foot"><button class="btn btn-ghost" onclick="closeOverlays()">Cancel</button><button class="btn btn-primary" onclick="addTask()">Add task</button></div>')}
function addTask(){const v=$('#tkIn').value.trim();if(!v){$('#tkIn').focus();return}act('Added a task',()=>{S.tasks.unshift({id:uid(),text:v,done:false,due:$('#tkDue').value,pri:$('#tkPri').value,accountId:$('#tkAcc').value})});closeOverlays()}
function toggleTask(id){const t=S.tasks.find(x=>x.id===id);act(t.done?'Reopened '+t.text:'Done: '+t.text,()=>{t.done=!t.done},{ic:'✅'})}
