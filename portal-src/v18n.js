/* ═══════════ v18n: delete any campaign, name exactly what is left, and a fuller sales context ═══════════ */

/* ── 1. Delete any campaign, including the only one ── */
campDel=function(id){const c=S.campaigns.find(x=>x.id===id);if(!c)return;const only=realCamps().filter(x=>x.id!==id).length===0;
  confirmBox('Delete '+esc(c.name)+'?',only?'This is your only campaign. Its plan, drafts and sending history go. The brands stay in your workspace and you can start a fresh campaign straight away. You can undo straight after.':'Its plan and drafts go. The brands stay in your workspace. You can undo straight after.','Delete',()=>{
    act('Deleted '+c.name,()=>{S.campaigns=S.campaigns.filter(x=>x.id!==id);if(S.cur===id)S.cur=(realCamps()[0]||S.campaigns[0]||{}).id||null},{refresh:false});closeOverlays();renderShell();go('camps')},true)};
campMenu18=function(e,id){e.stopPropagation();$$('.pop18').forEach(n=>n.remove());const d=document.createElement('div');d.className='pop18';
  d.innerHTML='<button onclick="campRename(\''+id+'\')">'+ico('edit')+'Rename</button><button onclick="campCopy(\''+id+'\')">'+ico('copy')+'Duplicate</button><button onclick="REP18.camp=\''+id+'\';go(\'reports\')">'+ico('doc')+'Make a report</button><button class="bad" onclick="campDel(\''+id+'\')">'+ico('trash')+'Delete</button>';
  document.body.appendChild(d);const r=e.currentTarget.getBoundingClientRect();d.style.top=(r.bottom+6)+'px';d.style.left=Math.max(12,r.right-d.offsetWidth)+'px';
  setTimeout(()=>document.addEventListener('click',function off(){d.remove();document.removeEventListener('click',off)}),0)};
(function(){const f=VIEWS.camps;VIEWS.camps=function(){if(realCamps().length)return f.apply(this,arguments);
  return secHead('camps','Your <span class="serif">campaigns.</span>','')+'<div class="nc18-empty card">'+agentFace('prospects',72,{badge:false})+'<h2>No campaigns <span class="serif">yet.</span></h2><p>A campaign is one group of brands, one problem you solve for them, and a short journey of useful touches. Nora, Gus, Priya and Otis build it with you.</p><button class="btn btn-primary btn-lg" onclick="newCampaignFlow()">'+ico('plus')+'Start a campaign</button></div>'}})();

/* ── 2. Exactly what is left, by name, with a way straight to it ── */
const AG18_WHERE={'Agency name':['who','agN'],'Website':['who','agW'],'Where you are based':['who','agL'],'Team size':['who','agZ'],'What you do best':['value','agU'],'The work you do':['who','agS'],'Who sends the outreach':['who','agSn'],
  'Why you, and not another agency':['value','agD'],'Proof that it works':['value','agP'],'The first piece of work you would offer':['value','agO'],'Clients you are proud of':['value','agC'],
  'What you do best, up to three':['want'],'Sectors you want':['want'],'Size of client':['want'],'The people you want to talk to':['want'],'Problems you solve':['want'],'At least one asset in your library':['read','ag18Dz']};
function agLeft18(){return agReq().filter(x=>!x[2]).map(x=>({l:x[1],w:AG18_WHERE[x[1]]||[x[0]==='assets'?'read':x[0]]}))}
function agGoTo18(i){const L=agLeft18();const x=L[i];if(!x)return;go('agency',x.w[0]);setTimeout(()=>{const el=x.w[1]&&$('#'+x.w[1]);if(el){el.scrollIntoView({block:'center',behavior:'smooth'});if(el.focus)el.focus();el.classList.add('pulse18');setTimeout(()=>el.classList.remove('pulse18'),1600)}},120)}
const andList=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];
saveAgency=function(){save();try{syncNow&&syncNow()}catch(e){}const L=agLeft18();AG_SAVED=Date.now();
  if(L.length){const names=L.slice(0,3).map(x=>x.l.charAt(0).toLowerCase()+x.l.slice(1));toast('Saved. Still needed before your first campaign: '+esc(andList(names))+(L.length>3?' and '+(L.length-3)+' more':'')+'.',{l:'Take me there',f:()=>agGoTo18(0)},6500)}
  else{toast('Saved. Your agency profile is complete.');try{award&&award('profile','Agency profile complete')}catch(e){}}refreshNav()};
function agLeftBar18(){const L=agLeft18();if(!L.length)return '<div class="al18 ok">'+ico('check')+'<b>Everything you need for your first campaign is in.</b><span>The more of “How you sell” you fill in, the sharper every message gets.</span></div>';
  return '<div class="al18"><div class="al18-h">'+ico('target')+'<b>'+L.length+' thing'+(L.length===1?'':'s')+' left before your first campaign</b></div><div class="al18-l">'+
    L.map((x,i)=>'<button onclick="agGoTo18('+i+')"><span>'+esc(x.l)+'</span><small>'+esc((AG18.find(t=>t[0]===x.w[0])||[0,''])[1])+'</small>'+ico('arrow','a')+'</button>').join('')+'</div></div>'}

/* ── 3. How you sell: the context that makes outreach accurate ── */
AG18.splice(AG18.findIndex(t=>t[0]==='voice'),0,['sell','How you sell','megaphone']);
function cx18(){const O=S.setup.offer;O.ctx=O.ctx||{};const X=O.ctx;X.cases=X.cases||[];X.objs=X.objs||[];return X}
function cxSet(k,v){const X=cx18();if(X[k]===v)return;X[k]=v;save();try{syncSoon&&syncSoon()}catch(e){}agRefresh()}
function cxRow(list,i,k,v){const X=cx18();X[list][i]=X[list][i]||{};X[list][i][k]=v;save();try{syncSoon&&syncSoon()}catch(e){}agRefresh()}
function cxAdd(list,max){const X=cx18();if(X[list].length>=max){toast('That is plenty. Keep the best '+max+'.');return}X[list].push({});save();go('agency',VIEW_ARG,true)}
function cxDel(list,i){const X=cx18();X[list].splice(i,1);save();go('agency',VIEW_ARG,true)}
const CX_CTA=[['call','A 20 minute call'],['coffee','A coffee'],['session','A free session or audit'],['send','Send something over first']];
const CX_BUDGET=['Under £10k','£10k to £25k','£25k to £50k','£50k to £100k','£100k to £250k','£250k plus'];
const CX_LEN=['A few weeks','One to three months','Three to six months','Ongoing retainer'];
/* what counts towards a sharp context */
function cxChecks(){const I=agInfo(),X=cx18(),O=S.setup.offer;const fullCase=X.cases.filter(c=>c.client&&c.result).length;return[
  ['The sender’s role',!!I.senderRole,'who','agSr'],['A line about the sender',!!I.senderBio,'who','agSb'],
  ['What goes wrong before they call you',!!(X.pains||'').trim(),'sell','cxP'],['Moments that make them need you',!!(X.triggers||'').trim(),'sell','cxT'],
  ['At least one case study',fullCase>0,'sell','cxC0'],['Numbers you can quote',!!(X.numbers||'').trim(),'sell','cxN'],
  ['A pushback and your answer',X.objs.some(o=>o.q&&o.a),'sell','cxQ0'],['Who you come up against',!!(X.rivals||'').trim(),'sell','cxR'],
  ['What you ask for',!!X.cta,'sell','cxA'],['A typical first project',!!X.budget,'sell','cxB'],
  ['Words to avoid',!!(X.avoid||'').trim(),'voice','cxV'],['How you sign off',!!(X.signoff||'').trim(),'voice','cxS']]}
function cxMeter(){const C=cxChecks();const got=C.filter(c=>c[1]).length;const pct=Math.round(got/C.length*100);const miss=C.filter(c=>!c[1]);
  return '<div class="cx18-m"><div class="cx18-mh"><b>Outreach context</b><span>'+got+' of '+C.length+'</span></div><div class="cx18-bar"><i style="width:'+pct+'%"></i></div>'+
    (miss.length?'<p>Still to add: '+miss.slice(0,4).map(c=>'<button class="link" onclick="go(\'agency\',\''+c[2]+'\');setTimeout(()=>{const e=$(\'#'+c[3]+'\');if(e){e.scrollIntoView({block:\'center\'});e.focus()}},120)">'+esc(c[0].charAt(0).toLowerCase()+c[0].slice(1))+'</button>').join(', ')+(miss.length>4?' and '+(miss.length-4)+' more':'')+'.</p>':'<p>Plato, Gus and Otis have everything they need to write like you.</p>')+'</div>'}
const _agDone18n=ag18Done;ag18Done=function(k){if(k==='sell'){const X=cx18();return !!((X.pains||'').trim()&&X.cases.some(c=>c.client&&c.result)&&X.cta)}return _agDone18n(k)};

function cxBody(){const X=cx18();const ta=(id,k,l,ph,rows,hint)=>'<div class="field"><label for="'+id+'">'+l+'</label>'+(hint?'<small class="cx18-hint">'+hint+'</small>':'')+'<textarea class="inp" id="'+id+'" rows="'+(rows||2)+'" placeholder="'+esc(ph)+'" onchange="cxSet(\''+k+'\',this.value)">'+esc(X[k]||'')+'</textarea></div>';
  const inp=(id,k,l,ph)=>'<div class="field"><label for="'+id+'">'+l+'</label><input class="inp" id="'+id+'" value="'+esc(X[k]||'')+'" placeholder="'+esc(ph)+'" onchange="cxSet(\''+k+'\',this.value.trim())"></div>';
  const sec=(ic,t,s,inner)=>'<section class="cx18-s"><header><span class="cx18-i">'+ico(ic)+'</span><div><b>'+t+'</b><small>'+s+'</small></div></header>'+inner+'</section>';
  const cases=(X.cases.length?X.cases:[{}]).map((c,i)=>'<div class="cx18-case"><div class="cx18-ch"><b>Case study '+(i+1)+'</b>'+(X.cases.length>1?'<button class="link small" onclick="cxDel(\'cases\','+i+')">Remove</button>':'')+'</div><div class="ag18-g">'+
    ['client|Client|e.g. Harbour and Vale Building Society','problem|The problem they had|e.g. Members thought they were old fashioned','did|What you did|e.g. A new brand platform and a member campaign','result|What changed, with a number|e.g. 31% more under 35s joined in a year']
      .map((f,j)=>{const [k,l,ph]=f.split('|');return '<div class="field'+(j>1?' span2':'')+'"><label for="'+(j===0?'cxC'+i:'cxC'+i+k)+'">'+l+'</label><input class="inp" id="'+(j===0?'cxC'+i:'cxC'+i+k)+'" value="'+esc(c[k]||'')+'" placeholder="'+esc(ph)+'" onchange="'+(X.cases.length?'':'cx18().cases.push({});')+'cxRow(\'cases\','+i+',\''+k+'\',this.value.trim())"></div>'}).join('')+'</div></div>').join('')+
    (X.cases.length<3?'<button class="btn btn-line btn-sm" onclick="cxAdd(\'cases\',3)">'+ico('plus')+'Add another case study</button>':'');
  const objs=(X.objs.length?X.objs:[{}]).map((o,i)=>'<div class="cx18-obj"><div class="field"><label for="cxQ'+i+'">They say</label><input class="inp" id="cxQ'+i+'" value="'+esc(o.q||'')+'" placeholder="e.g. We already have an agency" onchange="'+(X.objs.length?'':'cx18().objs.push({});')+'cxRow(\'objs\','+i+',\'q\',this.value.trim())"></div><div class="field"><label for="cxQa'+i+'">You say</label><input class="inp" id="cxQa'+i+'" value="'+esc(o.a||'')+'" placeholder="e.g. Good. We are not asking you to switch, just to see one idea" onchange="'+(X.objs.length?'':'cx18().objs.push({});')+'cxRow(\'objs\','+i+',\'a\',this.value.trim())"></div>'+(X.objs.length>1?'<button class="icon-btn" aria-label="Remove" onclick="cxDel(\'objs\','+i+')">'+ico('x')+'</button>':'')+'</div>').join('')+
    (X.objs.length<4?'<button class="btn btn-line btn-sm" onclick="cxAdd(\'objs\',4)">'+ico('plus')+'Add another</button>':'');
  return '<div class="ag18-hd"><h2>How you <span class="serif">sell.</span></h2><p>The detail a good new business director carries in their head. The more you give, the more every message sounds like it came from someone who knows the brand and knows you.</p></div>'+cxMeter()+
    sec('target','The problem you remove','What life looks like for a brand before they find you.',ta('cxP','pains','What is going wrong for a brand before they call you','e.g. They are spending more on media every year and getting less back. Nobody can say what the brand stands for.',3)+ta('cxT','triggers','Moments that make them need you now','e.g. A new CMO, a rebrand, a merger, a drop in market share, a pitch coming up',2,'Plato watches for these in the news and signals.'))+
    sec('trophy','Proof, in detail','Real work, real numbers. Otis only quotes what you put here.',cases+ta('cxN','numbers','Numbers you can quote','e.g. 12 years, 40 brands launched, 3 Effies, average client stays 4 years',2))+
    sec('chat','Pushback, and your answer','What prospects say when they are not sure, and how you reply.',objs)+
    sec('flag','Who you come up against','So messages never sound like everyone else.',inp('cxR','rivals','Agencies or options you usually compete with','e.g. Big network agencies, in house teams, freelancers')+ta('cxW','winBy','How you win against them','e.g. Senior people do the work, and we move in weeks, not quarters',2))+
    sec('send','The ask','What you want a warm prospect to do next, and what working together looks like.',
      '<div class="field"><label id="cxA">What you ask for</label><div class="chips">'+CX_CTA.map(c=>'<button class="chip'+(X.cta===c[0]?' on':'')+'" onclick="cxSet(\'cta\',\''+c[0]+'\');go(\'agency\',\'sell\',true)">'+c[1]+'</button>').join('')+'</div></div>'+
      '<div class="ag18-g">'+inp('cxK','booking','Booking link','e.g. calendly.com/sam-brightside/20min')+
      '<div class="field"><label for="cxB">A typical first project</label><select class="inp" id="cxB" onchange="cxSet(\'budget\',this.value)"><option value="">Choose</option>'+CX_BUDGET.map(o=>'<option'+(X.budget===o?' selected':'')+'>'+o+'</option>').join('')+'</select></div>'+
      '<div class="field span2"><label for="cxL">How long it usually runs</label><select class="inp" id="cxL" onchange="cxSet(\'length\',this.value)"><option value="">Choose</option>'+CX_LEN.map(o=>'<option'+(X.length===o?' selected':'')+'>'+o+'</option>').join('')+'</select></div></div>')}

(function(){const f=VIEWS.agency;VIEWS.agency=function(tab){let h=f.apply(this,arguments);const t=(h.match(/data-step="([a-z]+)"/)||[])[1];const I=agInfo(),X=cx18();
  if(t==='sell')h=h.replace('data-step="sell">','data-step="sell">'+cxBody());
  if(t==='who')h=h.replace('<div class="field"><label for="agSl">','<div class="field"><label for="agSr">Their role</label><input class="inp" id="agSr" value="'+esc(I.senderRole||'')+'" placeholder="e.g. Managing Partner" onchange="setAg(\'senderRole\',this.value.trim());agRefresh()"></div>'+
    '<div class="field span2"><label for="agSb">A line about them <span class="muted">· helps the opener feel personal</span></label><textarea class="inp" id="agSb" rows="2" placeholder="e.g. Ran marketing at two building societies before starting Brightside" onchange="setAg(\'senderBio\',this.value.trim());agRefresh()">'+esc(I.senderBio||'')+'</textarea></div>'+
    '<div class="field"><label for="agSl">');
  if(t==='voice')h=h.replace('<div class="ag18-files">','<div class="ag18-g cx18-voice"><div class="field"><label for="cxU">Words and phrases you use</label><textarea class="inp" id="cxU" rows="2" placeholder="e.g. Brave, useful, properly, honest work" onchange="cxSet(\'love\',this.value)">'+esc(X.love||'')+'</textarea></div>'+
    '<div class="field"><label for="cxV">Words and claims to avoid</label><textarea class="inp" id="cxV" rows="2" placeholder="e.g. Synergy, best in class, guaranteed results, anything about pricing" onchange="cxSet(\'avoid\',this.value)">'+esc(X.avoid||'')+'</textarea></div>'+
    '<div class="field span2"><label for="cxS">How you sign off</label><input class="inp" id="cxS" value="'+esc(X.signoff||'')+'" placeholder="e.g. Speak soon, Sam" onchange="cxSet(\'signoff\',this.value.trim())"></div></div><div class="ag18-files">');
  if(t&&t!=='read')h=h.replace('<section class="ag18-main card"','<section class="ag18-main card" data-left="1"').replace(/(<section class="ag18-main card"[^>]*>)/,'$1'+agLeftBar18());
  return h}})();

/* the character picks up two new features */
(function(){const f=ag18Traits;ag18Traits=function(){const T=f.apply(this,arguments);const X=cx18();const c=X.cases.find(x=>x.client&&x.result);
  T.splice(5,0,['case','trophy','Case study',c?(c.client+': '+c.result).slice(0,80):''],['ask','send','The ask',X.cta?(CX_CTA.find(a=>a[0]===X.cta)||[])[1]:'']);return T}})();

/* everything that writes for you gets the fuller picture */
(function(){const f=platoContext;platoContext=function(){const o=f.apply(this,arguments);const I=agInfo();try{o.agency.sender={name:I.sender,role:I.senderRole,bio:I.senderBio};o.agency.context=cx18()}catch(e){}return o}})();
if(typeof cvPrompt==='function'){const _cvp=cvPrompt;cvPrompt=function(){let p=_cvp.apply(this,arguments);const X=cx18();const c=X.cases.filter(x=>x.client&&x.result);
  const add=[c.length?'Real case studies you may reference (do not invent others): '+c.map(x=>x.client+', '+[x.problem,x.did,x.result].filter(Boolean).join('; ')).join(' | '):'',X.numbers?'Numbers you may quote: '+X.numbers:'',X.avoid?'Never use these words or claims: '+X.avoid:'',X.cta?'The soft next step should be: '+((CX_CTA.find(a=>a[0]===X.cta)||[])[1]||'').toLowerCase()+(X.booking?' ('+X.booking+')':''):''].filter(Boolean);
  return add.length?p+'\n\nAbout the agency, from their own profile:\n- '+add.join('\n- '):p}}
