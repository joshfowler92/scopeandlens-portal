/* ═══════════ v18e RESULTS ═══════════
   Campaigns carry their own performance. Signals keeps the closing-in orbit and puts who to act on beside it.
   Pipeline fills itself from live LinkedIn conversations through Amplify. Insights is visual. Reports in two clicks. */

/* ── Campaigns, with performance inside ── */
let CAMP18_OPEN=null;
function campRow18(c){const x=campPerf(c);const live=campLive(c);const st=campStatus(c);const w=campWk(c);const nx=campNext(c);const open=CAMP18_OPEN===c.id;const cur=c.id===S.cur;
  const fun=[['Brands',x.brands],['People',x.people],['Engaging',x.eng],['Talking',x.talks+x.meet],['Deals',x.opps.length]];const fmax=Math.max(1,x.people,x.brands);
  return '<article class="cr18'+(open?' open':'')+(cur?' cur':'')+'"><div class="cr18-r">'+
    '<div class="cr18-n"><span class="cr18-st '+(live?'live':'')+'">'+(live?'<i></i>Live · week '+(w.n||1)+' of '+w.W:esc(st[0]))+'</span><b>'+esc(c.name)+'</b><small>'+(c.problem&&L_PROBLEMS[c.problem]?'Solving '+esc(L_PROBLEMS[c.problem].short):'No problem chosen yet')+'</small></div>'+
    '<div class="cr18-steps">'+OUT_K.map(k=>{const s=campStepState(c,k);return '<span class="s'+s+'" data-tip="'+esc(STAGE_L(k)+': '+campStepSub(c,k))+'">'+agentFace(k,26,{badge:false})+(s===2?'<i>'+ico('check')+'</i>':'')+'</span>'}).join('')+'</div>'+
    '<div class="cr18-f">'+fun.map(f=>'<div><b>'+f[1]+'</b><small>'+f[0]+'</small><i><em style="width:'+Math.round(Math.min(1,f[1]/fmax)*100)+'%"></em></i></div>').join('')+'</div>'+
    '<div class="cr18-v"><b>'+money(x.oppVal,true)+'</b><small>pipeline'+(x.wonVal?' · '+money(x.wonVal,true)+' won':'')+'</small></div>'+
    '<div class="cr18-a"><button class="btn '+(live?'btn-ink':'btn-primary')+' btn-sm" onclick="openCamp(\''+c.id+'\',\''+(live?'launch':nx)+'\')">'+(live?'Today’s messages':'Continue')+'</button>'+
      '<button class="btn btn-line btn-sm" onclick="CAMP18_OPEN=CAMP18_OPEN===\''+c.id+'\'?null:\''+c.id+'\';go(\'camps\',null,true)" aria-expanded="'+open+'">'+ico('chart')+(open?'Hide':'Performance')+'</button>'+
      '<button class="icon-btn" onclick="campMenu18(event,\''+c.id+'\')" aria-label="More for '+esc(c.name)+'">'+ico('dots')+'</button></div></div>'+
    (open?'<div class="cr18-perf">'+perfBody18(c)+'</div>':'')+'</article>'}
function perfBody18(c){let h=perfDetail(c);h=h.replace(/^<button class="pf-back"[\s\S]*?<\/button>/,'').replace(/<div class="sh plain">[\s\S]*?<\/div><\/div>/,'');return h}
IC.dots=IC.dots||'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>';
function campMenu18(e,id){e.stopPropagation();$$('.pop18').forEach(n=>n.remove());const d=document.createElement('div');d.className='pop18';
  d.innerHTML='<button onclick="campRename(\''+id+'\')">'+ico('edit')+'Rename</button><button onclick="campCopy(\''+id+'\')">'+ico('copy')+'Duplicate</button><button onclick="REP18.camp=\''+id+'\';go(\'reports\')">'+ico('doc')+'Make a report</button>'+(S.campaigns.length>1?'<button class="bad" onclick="campDel(\''+id+'\')">'+ico('trash')+'Delete</button>':'');
  document.body.appendChild(d);const r=e.currentTarget.getBoundingClientRect();d.style.top=(r.bottom+6)+'px';d.style.left=Math.max(12,r.right-d.offsetWidth)+'px';
  setTimeout(()=>document.addEventListener('click',function off(){d.remove();document.removeEventListener('click',off)}),0)}
VIEWS.camps=function(id){if(id&&S.campaigns.some(c=>c.id===id))CAMP18_OPEN=id;const all=realCamps().length?realCamps():S.campaigns;const C=all.filter(c=>campsF==='all'||(campsF==='live'?campLive(c):!campLive(c)));const St=all.map(c=>({c,x:campPerf(c)}));
  const T=[['Live',all.filter(campLive).length],['People reached',sum(St,y=>y.x.people)],['Engaging',sum(St,y=>y.x.eng)],['Conversations',sum(St,y=>y.x.talks+y.x.meet)],['Deals',sum(St,y=>y.x.opps.length)],['Pipeline',money(sum(St,y=>y.x.oppVal),true)],['Won',money(sum(St,y=>y.x.wonVal),true)]];
  return secHead('camps','Your <span class="serif">campaigns.</span>','<button class="btn btn-line btn-sm" onclick="go(\'reports\')">'+ico('doc')+'Make a report</button><button class="btn btn-primary btn-sm" onclick="newCampaignFlow()">'+ico('plus')+'New campaign</button>')+
    '<div class="kp18">'+T.map(t=>'<div><b>'+t[1]+'</b><small>'+t[0]+'</small></div>').join('')+'</div>'+
    '<div class="row between wrap" style="gap:10px;margin:18px 0 10px">'+seg([['all','All '+all.length],['live','Live '+all.filter(campLive).length],['build','Building '+all.filter(c=>!campLive(c)).length]],campsF,"campsF=$;go('camps',null,true)")+'<span class="muted small">Tap Performance on any campaign to see what it is producing.</span></div>'+
    '<div class="cr18-l">'+C.map(campRow18).join('')+'<button class="cr18-new" onclick="newCampaignFlow()">'+ico('plus')+'<b>New campaign</b><span>Nora, Gus, Priya and Otis build it with you.</span></button></div>'};
VIEWS.perf=function(id){return VIEWS.camps(id||(S.campaigns.find(campLive)||S.campaigns[0]||{}).id)};
VIEWS.perf_after=function(){initSegs&&initSegs()};VIEWS.camps_after=function(){initSegs&&initSegs()};

/* ── Signals and intent ── */
function sgRow18(r){const a=r.a;const H=HEAT.find(x=>x.n===r.s.heat)||HEAT[5];
  return '<tr onclick="openAccount(\''+a.id+'\')"><td><span class="sg18-o">'+logo(a,30)+'<span><b>'+esc(a.name)+'</b><small>'+esc(intentWhy(r))+'</small></span></span></td>'+
    '<td><span class="sg18-h" style="--c:'+H.c+'"><i style="width:'+Math.min(100,Math.round(r.rank))+'%"></i></span><small>'+H.l+'</small></td>'+
    '<td class="sg18-p">'+r.ppl.slice(0,3).map(p=>'<span data-tip="'+esc(p.name+(p.role?', '+p.role:''))+'">'+esc(initials(p.name))+'</span>').join('')+(r.ppl.length>3?'<em>+'+(r.ppl.length-3)+'</em>':'')+'</td>'+
    '<td class="muted small">'+(r.last?rel(String(r.last).slice(0,10)):'')+'</td>'+
    '<td onclick="event.stopPropagation()">'+(r.opp?'<button class="pill good" onclick="go(\'pipeline\')">'+money(r.opp.value,true)+'</button>':'<button class="btn btn-line btn-xs" onclick="addToPipe(\''+a.id+'\')">'+ico('plus')+'Pipeline</button>')+'</td></tr>'}
const _sig18=VIEWS.signals;VIEWS.signals=function(){const all=S.accounts.flatMap(a=>a.signals||[]);const hasData=!!(S.uploads.outreach||S.uploads.linkedin||S.uploads.ads||S.launch.connected||all.some(s=>INBOUND(s.type)));if(!hasData)return _sig18();
  sgDefault();const rows=intentRows();const R=rows.filter(r=>!SGB||(SGB===4?r.s.heat>=4:SGB===3?r.s.heat>=3:r.s.heat>=2));const d30=s=>daysAgo(s.date)<=30;
  const k=[['Engaging',rows.length],['People',sum(rows,r=>r.ppl.length)],['Replies · 30 days',all.filter(s=>['reply','li_reply'].includes(s.type)&&d30(s)).length],['Meetings · 30 days',all.filter(s=>s.type==='meeting'&&d30(s)).length],['Hot now',rows.filter(r=>r.s.heat>=4).length]];
  const lean=rows.filter(r=>r.s.heat>=3).slice(0,4);
  return secHead('signals','Signals and <span class="serif">intent.</span>','<select class="inp sm" aria-label="Campaign" onchange="SGC=this.value;go(\'signals\',null,true)"><option value="all">All campaigns</option>'+S.campaigns.map(c=>'<option value="'+c.id+'"'+(SGC===c.id?' selected':'')+'>'+esc(c.name)+'</option>').join('')+'</select><button class="btn btn-ghost btn-sm" onclick="copySignals()">'+ico('copy')+'Copy a summary</button>')+
    '<div class="kp18">'+k.map(t=>'<div><b>'+t[1]+'</b><small>'+t[0]+'</small></div>').join('')+'</div>'+
    '<div class="sg18">'+orbitHTML()+'</div>'+
    (lean.length?'<section class="sg18-lean"><div class="cv-ph"><h2>Lean in <span class="serif">now.</span></h2><span class="muted small">The warmest organisations, and the move that fits.</span></div><div class="sg18-lg">'+lean.map(r=>{const H=HEAT.find(x=>x.n===r.s.heat)||HEAT[5];return '<div class="sg18-c" style="--c:'+H.c+'">'+logo(r.a,38)+'<div class="grow"><b>'+esc(r.a.name)+'</b><small>'+esc(intentWhy(r))+'</small></div>'+heatDots(r.s.heat)+'<div class="sg18-ca"><button class="btn btn-primary btn-xs" onclick="askPlatoOrg(\''+r.a.id+'\')">What should I say?</button>'+(r.opp?'':'<button class="btn btn-line btn-xs" onclick="addToPipe(\''+r.a.id+'\')">'+ico('plus')+'Pipeline</button>')+'</div></div>'}).join('')+'</div></section>':'')+
    '<section class="sg18-all"><div class="row between wrap" style="gap:10px;margin-bottom:8px"><h2 class="sg18-t">Everyone engaging</h2>'+seg([['0','Everyone'],['4','Hot'],['3','Warm and up'],['2','Aware and up']],String(SGB||0),"SGB=+$;go('signals',null,true)")+'</div>'+
    '<div class="sg18-tw"><table class="sg18-tb"><thead><tr><th>Organisation</th><th>Intent</th><th>People</th><th>Last</th><th></th></tr></thead><tbody>'+R.map(sgRow18).join('')+'</tbody></table></div></section>'};

/* ── Pipeline: deals from live LinkedIn conversations, through Amplify ── */
function autoPipeSugs(){const have=new Set(S.opps.filter(o=>o.lane!=='lost').map(o=>o.accountId));const dis=new Set(S.autoNo18||[]);const out=[];
  S.accounts.forEach(a=>{if(have.has(a.id)||dis.has(a.id))return;const sig=(a.signals||[]).filter(s=>['li_reply','reply','meeting'].includes(s.type)&&daysAgo(s.date)<=45).sort((x,y)=>String(y.date).localeCompare(String(x.date)));if(!sig.length)return;
    const m=sig.find(s=>s.type==='meeting');const g=m||sig[0];const li=sig.some(s=>s.type==='li_reply');out.push({a,lane:m?'opportunity':'lead',sig:g,li,n:sig.length})});
  return out.sort((x,y)=>(y.lane==='opportunity')-(x.lane==='opportunity')||y.n-x.n).slice(0,6)}
function autoPipeAdd(aid,quiet){const x=autoPipeSugs().find(s=>s.a.id===aid);if(!x)return;const a=x.a;const v=+S.setup.avgDeal||0;
  const f=()=>{S.opps.push({id:uid(),created:today(),updated:today(),name:a.name,accountId:a.id,value:v,lane:x.lane,weight:null,source:(x.li?'LinkedIn conversation':'Email reply')+' via Amplify',next:x.lane==='opportunity'?'Send the follow up from the meeting':'Reply and suggest a call',campaign:(x.sig.campaign||'')});a.stage='opp'};
  if(quiet){f();return}act('Added '+a.name+' as '+laneName(x.lane).toLowerCase(),f,{ic:'📈'});go('pipeline',null,true)}
function autoPipeAll(){const L=autoPipeSugs();L.forEach(x=>autoPipeAdd(x.a.id,true));save();toast('Added '+L.length+' from live conversations');go('pipeline',null,true)}
function autoPipeNo(aid){S.autoNo18=(S.autoNo18||[]).concat(aid);save();go('pipeline',null,true)}
function autoPipeToggle(){S.autoPipe18=!S.autoPipe18;save();if(S.autoPipe18&&autoPipeSugs().length)autoPipeAll();else go('pipeline',null,true)}
function autoPipe18(){const L=autoPipeSugs();const on=!!S.autoPipe18;const amp=typeof ampOn==='function'&&ampOn();
  return '<section class="ap18"><div class="ap18-h"><span class="ap18-i">'+ico('bolt')+'</span><div class="grow"><b>Deals from live conversations</b><span>'+(amp?'Amplify watches your LinkedIn and email conversations':'Plato watches replies and meetings')+'. When a conversation turns real, it becomes an engaged lead or a meeting held, with the conversation as its source.</span></div>'+
    '<label class="ap18-t"><span>Add them automatically</span><button class="tgl'+(on?' on':'')+'" onclick="autoPipeToggle()" aria-pressed="'+on+'"><i></i></button></label></div>'+
    (L.length?'<div class="ap18-l">'+L.map(x=>'<div class="ap18-r">'+logo(x.a,30)+'<div class="grow"><b>'+esc(x.a.name)+'</b><small>'+(x.sig.person?esc(x.sig.person)+' · ':'')+esc((SIGNALS[x.sig.type]||{l:''}).l)+' '+rel(String(x.sig.date).slice(0,10))+(x.n>1?' · '+x.n+' messages':'')+'</small></div><span class="pill">'+esc(laneName(x.lane))+'</span><button class="btn btn-primary btn-xs" onclick="autoPipeAdd(\''+x.a.id+'\')">'+ico('plus')+'Add</button><button class="icon-btn" onclick="autoPipeNo(\''+x.a.id+'\')" aria-label="Not a deal">'+ico('x')+'</button></div>').join('')+'</div>'+(L.length>1?'<button class="link" onclick="autoPipeAll()">Add all '+L.length+'</button>':''):'<p class="ap18-ok">'+ico('check')+'Every live conversation is already in your pipeline.</p>')+'</section>'}
const _pipe18=VIEWS.pipeline;VIEWS.pipeline=function(){const h=String(_pipe18());const i=h.indexOf('</div>',h.indexOf('class="sh'))>-1?h.search(/<div class="(card trk|trk|ptrack|card ptrack|kanban|kb)/):-1;
  if(S.autoPipe18){const L=autoPipeSugs();if(L.length){L.forEach(x=>autoPipeAdd(x.a.id,true));save()}}
  let H=h.replace('<div class="ptk-two">','<button class="link ptk18" onclick="S.trend18=!S.trend18;save();go(\'pipeline\',null,true)">'+(S.trend18?'Hide the trends':'Show month by month, and where the pipeline sits')+'</button><div class="ptk-two'+(S.trend18?'':' hid18')+'">');const ap=autoPipe18();const j=H.indexOf('</h1>');const k=j>-1?H.indexOf('</div></div>',j):-1;return k>-1?H.slice(0,k+12)+ap+H.slice(k+12):ap+H};

/* ── Insights: visual first ── */
const _ins18=VIEWS.insights;VIEWS.insights=function(cat){const h=String(_ins18(cat));const A=getInsights();const by={};A.forEach(x=>{by[x.cat]=(by[x.cat]||0)+1});
  const ic={opportunity:'flag',pitch:'trophy',moves:'user',intel:'chart',playbook:'bulb'};
  const strip='<div class="in18">'+Object.entries(INS_CATS).filter(([k])=>by[k]).map(([k,l])=>'<button onclick="go(\'insights\',\''+k+'\')"><span>'+ico(ic[k]||'star')+'</span><b>'+by[k]+'</b><small>'+esc(l)+'</small></button>').join('')+'</div>';
  const j=h.indexOf('</h1>');const k=j>-1?h.indexOf('</div></div>',j):-1;return '<div class="ins18">'+(k>-1?h.slice(0,k+12)+strip+h.slice(k+12):strip+h)+'</div>'};

/* ── Reports: pick, preview, download ── */
const REP18={camp:'all',period:'30',secs:{head:1,funnel:1,brands:1,pipe:1,next:1}};
function repData(){const C=REP18.camp==='all'?realCamps():S.campaigns.filter(c=>c.id===REP18.camp);const St=C.map(c=>({c,x:campPerf(c)}));const days=+REP18.period||9999;
  const sig=S.accounts.flatMap(a=>(a.signals||[]).filter(s=>INBOUND(s.type)&&daysAgo(s.date)<=days&&(REP18.camp==='all'||s.campaign===REP18.camp||(campSigs(C[0],a).includes(s)))));
  return{C,St,sig,brands:sum(St,y=>y.x.brands),people:sum(St,y=>y.x.people),touches:sum(St,y=>y.x.touches),eng:sum(St,y=>y.x.eng),talks:sum(St,y=>y.x.talks+y.x.meet),opps:sum(St,y=>y.x.opps.length),val:sum(St,y=>y.x.oppVal),won:sum(St,y=>y.x.wonVal),
    replies:sig.filter(s=>['reply','li_reply'].includes(s.type)).length,meet:sig.filter(s=>s.type==='meeting').length,hot:intentRows().slice(0,5)}}
function repDoc(){const D=repData();const per={'30':'Last 30 days','90':'Last 90 days','all':'Campaign to date'}[REP18.period];const nm=REP18.camp==='all'?'All campaigns':(D.C[0]||{name:''}).name;const s=REP18.secs;
  const fun=[['Brands targeted',D.brands],['People reached',D.people],['Touches sent',D.touches],['Brands engaging',D.eng],['Conversations',D.talks],['Opportunities',D.opps]];const fm=Math.max(1,...fun.map(f=>f[1]));
  return '<article class="rp18-doc" id="rp18Doc"><header><small>'+esc(S.setup.agency||'')+' · New business report</small><h1>'+esc(nm)+'</h1><p>'+per+' · '+new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})+'</p></header>'+
    (s.head?'<section class="rp-k">'+[['Replies',D.replies],['Meetings',D.meet],['Opportunities',D.opps],['Pipeline',money(D.val,true)],['Won',money(D.won,true)]].map(k=>'<div><b>'+k[1]+'</b><small>'+k[0]+'</small></div>').join('')+'</section>':'')+
    (s.funnel?'<section><h2>From reach to revenue</h2><div class="rp-f">'+fun.map(f=>'<div><span>'+f[0]+'</span><i><em style="width:'+Math.max(f[1]?3:0,f[1]/fm*100)+'%"></em></i><b>'+f[1]+'</b></div>').join('')+'</div></section>':'')+
    (s.brands&&D.hot.length?'<section><h2>Who is leaning in</h2><ol class="rp-b">'+D.hot.map(r=>'<li><b>'+esc(r.a.name)+'</b><span>'+esc(intentWhy(r))+'</span></li>').join('')+'</ol></section>':'')+
    (s.pipe?'<section><h2>Pipeline</h2><ul class="rp-p">'+D.St.flatMap(y=>y.x.opps).sort((a,b)=>(+b.value||0)-(+a.value||0)).slice(0,8).map(o=>'<li><b>'+esc(o.name)+'</b><span>'+esc(laneName(o.lane))+'</span><em>'+money(o.value,true)+'</em></li>').join('')+'</ul></section>':'')+
    (s.next?'<section><h2>Next</h2><ul class="rp-n">'+(D.hot.slice(0,3).map(r=>'<li>Follow up with '+esc(r.a.name)+': '+esc(intentWhy(r))+'.</li>').join('')||'<li>Keep the sequence running and watch for replies.</li>')+'</ul></section>':'')+
    '<footer>Made with Plato by Scope &amp; Lens</footer></article>'}
function repText(){const D=repData();return (REP18.camp==='all'?'All campaigns':(D.C[0]||{}).name)+'\n'+D.replies+' replies, '+D.meet+' meetings, '+D.opps+' opportunities, '+money(D.val,true)+' pipeline, '+money(D.won,true)+' won.\nLeaning in: '+D.hot.slice(0,3).map(r=>r.a.name).join(', ')}
function repPrint(){const d=$('#rp18Doc');if(!d)return;const w=window.open('','_blank');if(!w){toast('Allow pop-ups to download the PDF');return}
  w.document.write('<!doctype html><html><head><title>Report</title><style>'+REP18_CSS+'</style></head><body>'+d.outerHTML+'<script>setTimeout(()=>print(),300)<\/script></body></html>');w.document.close()}
const REP18_CSS='body{font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#15151c;margin:40px}.rp18-doc header small{color:#666;font-size:12px}.rp18-doc h1{font-size:30px;margin:6px 0 2px}.rp18-doc header p{color:#666;margin:0 0 20px}.rp18-doc h2{font-size:16px;margin:24px 0 8px}.rp-k{display:flex;gap:24px;border:1px solid #ddd;border-radius:12px;padding:14px}.rp-k b{display:block;font-size:24px}.rp-k small{color:#666}.rp-f div{display:grid;grid-template-columns:150px 1fr 50px;gap:10px;align-items:center;margin:5px 0;font-size:13px}.rp-f i{height:8px;background:#eee;border-radius:4px;overflow:hidden}.rp-f em{display:block;height:100%;background:#2c56ed}.rp-b,.rp-p,.rp-n{padding-left:18px;font-size:13.5px}.rp-b li,.rp-p li{margin:5px 0}.rp-b span,.rp-p span{color:#666;margin-left:8px}.rp-p em{font-style:normal;font-weight:700;margin-left:8px}footer{margin-top:30px;color:#999;font-size:11px}';
VIEWS.reports=function(){const opts=[['head','Headline numbers'],['funnel','Reach to revenue'],['brands','Who is leaning in'],['pipe','Pipeline'],['next','Next steps']];
  return '<div class="sh plain"><div class="sh-l"><h1 class="sh-t">Make a <span class="serif">report.</span></h1><p class="sh-p">Pick a campaign and a period. Download it, or copy the summary.</p></div></div>'+
    '<div class="rp18"><aside class="rp18-c"><label>Campaign<select class="inp" onchange="REP18.camp=this.value;go(\'reports\',null,true)"><option value="all">All campaigns</option>'+S.campaigns.map(c=>'<option value="'+c.id+'"'+(REP18.camp===c.id?' selected':'')+'>'+esc(c.name)+'</option>').join('')+'</select></label>'+
      '<label>Period</label>'+seg([['30','30 days'],['90','90 days'],['all','To date']],REP18.period,"REP18.period=$;go('reports',null,true)")+
      '<label style="margin-top:6px">Include</label><div class="rp18-o">'+opts.map(o=>'<button class="'+(REP18.secs[o[0]]?'on':'')+'" onclick="REP18.secs.'+o[0]+'=REP18.secs.'+o[0]+'?0:1;go(\'reports\',null,true)"><i>'+(REP18.secs[o[0]]?ico('check'):'')+'</i>'+o[1]+'</button>').join('')+'</div>'+
      '<button class="btn btn-primary" onclick="repPrint()">'+ico('download')+'Download as PDF</button><button class="btn btn-line" onclick="copyText(repText(),this)">'+ico('copy')+'Copy the summary</button></aside>'+
    '<div class="rp18-pv">'+repDoc()+'</div></div>'};
VIEWS.reports_after=function(){initSegs&&initSegs()};
if(typeof PAGES!=='undefined'&&!PAGES.includes('reports'))PAGES.push('reports');
