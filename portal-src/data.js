/* ═══════════ DATA: files in, files out, safety nets ═══════════ */
function parseCSV(text){const rows=[];let row=[],f='',q=false;text=text.replace(/^\uFEFF/,'');const tab=!text.slice(0,500).includes(',')&&text.slice(0,500).includes('\t');
  for(let i=0;i<text.length;i++){const c=text[i];if(q){if(c==='"'){if(text[i+1]==='"'){f+='"';i++}else q=false}else f+=c}
    else if(c==='"')q=true;else if(c===','&&!tab||c==='\t'&&tab){row.push(f);f=''}else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(f);f='';if(row.some(x=>x.trim()!==''))rows.push(row);row=[]}else f+=c}
  row.push(f);if(row.some(x=>x.trim()!==''))rows.push(row);if(!rows.length)return{headers:[],rows:[]};
  const headers=rows[0].map((h,i)=>h.trim()||'Column '+(i+1));return{headers,rows:rows.slice(1).map(r=>Object.fromEntries(headers.map((h,i)=>[h,(r[i]||'').trim()])))}}
const col=(H,cands)=>{const L=H.map(h=>h.toLowerCase().trim());for(const c of cands){const i=L.indexOf(c);if(i>-1)return H[i]}for(const c of cands){if(c.length<4)continue;const i=L.findIndex(h=>h.includes(c));if(i>-1)return H[i]}return null};
const yes=v=>{const s=String(v==null?'':v).trim();if(!s)return false;if(/^(no|n|false|0|-|none|never|not yet)$/i.test(s))return false;if(/^(yes|y|true|x|✓|✔)$/i.test(s))return true;const n=parseFloat(s.replace(/[^0-9.\-]/g,''));if(/^[0-9.,\s]+$/.test(s))return n>0;return /\d/.test(s)||s.length>0};
const numv=v=>{const n=parseFloat(String(v||'').replace(/[^0-9.\-]/g,''));return isNaN(n)?0:n};
function readFile(file,cb){const name=file.name;const ext=name.split('.').pop().toLowerCase();
  if(ext==='json'){const r=new FileReader();r.onload=()=>cb(null,r.result,'json');r.readAsText(file);return}
  if(ext==='xlsx'||ext==='xls'){const go2=()=>{const r=new FileReader();r.onload=()=>{try{const wb=XLSX.read(r.result,{type:'array'});cb(parseCSV(XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]])))}catch(e){toast('That spreadsheet could not be read. Try saving it as CSV.')}};r.readAsArrayBuffer(file)};
    if(window.XLSX)go2();else{toast('Opening the spreadsheet…');const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';s.onload=go2;s.onerror=()=>toast('Could not load the spreadsheet reader. Save it as CSV and try again.');document.head.appendChild(s)}return}
  const r=new FileReader();r.onload=()=>cb(parseCSV(r.result));r.readAsText(file)}

/* ── general import ────────────────────────────────────────── */
const IMPORT_TYPES={
  outreach:{l:'Email outreach export',d:'Opens, clicks and replies become signals on each person and account',ic:'📧',need:'outreach'},
  li_outreach:{l:'LinkedIn outreach export',d:'Accepted connections and replies become signals',ic:'🔗',need:'linkedin'},
  li_companies:{l:'LinkedIn ads company engagement',d:'Impressions, engagement and clicks become ad signals per organisation',ic:'📣',need:'ads'},
  downloads:{l:'Downloads and form fills',d:'Every named downloader becomes a strong signal',ic:'🎁',need:'downloads'},
  attendees:{l:'Event or webinar list',d:'Attendees and sign-ups become event signals',ic:'🎪',need:'events'},
  deals:{l:'Deals or opportunities',d:'Creates deals on the pipeline board',ic:'📈',need:'deals'},
  contacts:{l:'Contact list',d:'Creates accounts and the people to reach',ic:'👥'},
  companies:{l:'List of organisations',d:'Creates target accounts in Find them',ic:'🏢'}
};
const NEED_TYPE={outreach:'outreach',linkedin:'li_outreach',ads:'li_companies',downloads:'downloads',events:'attendees',deals:'deals',companies:'companies'};
function detectType(H,fname){const h=H.map(x=>x.toLowerCase()).join('|');fname=(fname||'').toLowerCase();
  if(/(abm stage|eng\. score|\|imp\.|^imp\.)/.test(h)||(h.includes('impressions')&&h.includes('clicks')&&!/name/.test(h)))return'li_companies';
  if(/(opened|clicked|email replied|replied\?)/.test(h))return'outreach';
  if(/(accepted|connection|invite)/.test(h)&&/(repl|message)/.test(h))return'li_outreach';
  if(/(deal|opportunit|amount|value)/.test(h)&&/(stage|pipeline)/.test(h))return'deals';
  if(/(download|asset|form name|form submitted|gated|submission)/.test(h)||/download|form/.test(fname))return'downloads';
  if(/(attended|attendee|registered|registration|webinar|checked in)/.test(h)||/attend|webinar|event|registr/.test(fname))return'attendees';
  if(/(first name|last name|full name|^name$|\|name\||contact|email)/.test(h)&&/(company|organisation|organization|account)/.test(h))return'contacts';
  return'companies'}
let IMP=null;
function openImport(campId,needKey){const D=needKey&&DATA_NEEDS.find(d=>d.k===needKey);const B=campId&&S.campaigns.find(c=>c.id===campId);
  modal((D?'<div class="ph-k"><span class="nn">'+D.ic+'</span>'+(D.must?'The one that matters most':'Recommended')+'</div><h2>Upload your '+D.l.replace(/^Your /,'').toLowerCase()+'</h2><p class="sub">'+D.why+'</p>':'<h2>Import a file</h2><p class="sub">Drop a CSV, an Excel file or a dashboard backup. We work out what it is and map the columns, then show you exactly what will change before anything is saved.</p>')+
  '<label class="dropzone" id="impDrop"><div class="orbz">'+ico('upload')+'</div><b style="font-size:16px">Drop a file here, or click to choose</b><div class="small muted" style="margin-top:4px">CSV, Excel'+(D?'':' or a .json backup')+'</div><input type="file" id="impFile" accept=".csv,.tsv,.txt,.xlsx,.xls,.json" hidden></label>'+
  (D?'<div class="card flat" style="margin-top:14px"><div class="lab">Columns we look for</div><div class="cols">'+D.cols.map(c=>'<code>'+c+'</code>').join('')+'</div><div class="prov" style="margin-top:12px">'+D.from.map(p=>'<div><b>'+p[0]+':</b> '+p[1]+'</div>').join('')+'</div><div class="row" style="margin-top:12px"><button class="btn btn-line btn-xs" onclick="downloadTemplate(\''+D.k+'\')">Download a sample file</button><span class="tiny muted">Names do not need to match exactly.</span></div></div>':
  '<div class="lab" style="margin-top:16px">What you can drop in</div><div class="chips">'+Object.values(IMPORT_TYPES).map(t=>'<span class="chip" style="cursor:default">'+t.ic+' '+t.l+'</span>').join('')+'</div><p class="small muted" style="margin-top:12px">Not sure which files you need? <a href="#" class="link" onclick="closeOverlays();go(\'guide\',\'data\');return false">See what you need</a></p>'));
  const d=$('#impDrop'),f=$('#impFile');f.onchange=()=>f.files[0]&&startImport(f.files[0],campId,needKey);
  d.ondragover=e=>{e.preventDefault();d.classList.add('over')};d.ondragleave=()=>d.classList.remove('over');d.ondrop=e=>{e.preventDefault();e.stopPropagation();d.classList.remove('over');e.dataTransfer.files[0]&&startImport(e.dataTransfer.files[0],campId,needKey)}}
function startImport(file,campId,needKey){readFile(file,(P,text,kind)=>{if(kind==='json')return restorePreview(text,file.name);importPreview(P,file.name,campId,needKey)})}
function importPreview(P,name,campId,needKey){if(!P.rows.length){toast('That file looks empty.');return}
  const H=P.headers;IMP={P,name,type:needKey&&NEED_TYPE[needKey]||detectType(H,name),camp:campId||'',H};
  IMP.map={company:col(H,['company','account name','account','organisation','organization','company name','org','employer']),person:col(H,['full name','prospect name','contact name','name','contact']),
    first:col(H,['first name','firstname']),last:col(H,['last name','lastname','surname']),role:col(H,['title','job title','role','position']),email:col(H,['email','email address']),
    value:col(H,['amount','value','deal value','revenue']),stage:col(H,['stage','deal stage','pipeline stage']),next:col(H,['next step','next steps','next action'])};
  if(IMP.map.person&&IMP.map.person===IMP.map.company)IMP.map.person=null;
  IMP.camp='';
  drawImport()}
function drawImport(){const P=IMP.P,T=IMPORT_TYPES[IMP.type];const sel=(k,lab)=>'<div class="field"><label>'+lab+'</label><select class="inp" onchange="IMP.map.'+k+'=this.value||null;drawImport()"><option value="">Not in this file</option>'+IMP.H.map(h=>'<option'+(IMP.map[k]===h?' selected':'')+'>'+esc(h)+'</option>').join('')+'</select></div>';
  const used=Object.values(IMP.map).filter(Boolean);const show=IMP.H.slice(0,7);
  modal('<h2>'+T.ic+' This looks like '+(/^[AEIOU]/i.test(T.l)?'an ':'a ')+T.l.toLowerCase()+'</h2><p class="sub">'+esc(IMP.name)+' · '+P.rows.length+' rows. Check the columns below. Nothing is saved until you click Import.</p>'+
  '<div class="grid2"><div class="field"><label>What kind of file is it?</label><select class="inp" onchange="IMP.type=this.value;drawImport()">'+Object.entries(IMPORT_TYPES).map(([k,v])=>'<option value="'+k+'"'+(k===IMP.type?' selected':'')+'>'+v.l+'</option>').join('')+'</select></div>'+
  '<div></div></div>'+
  '<div class="grid2">'+sel('company','Organisation column')+(IMP.type==='deals'?sel('value','Deal value column'):sel('person','Person column'))+'</div>'+
  (IMP.type==='deals'?'<div class="grid2">'+sel('stage','Stage column')+sel('next','Next step column')+'</div>':'<div class="grid2">'+sel('role','Role column')+sel('email','Email column')+'</div>')+
  '<div class="lab">A peek at the file</div><div class="tbl-wrap" style="margin-bottom:14px;max-height:180px"><table class="tbl" style="font-size:12.5px"><thead><tr>'+show.map(h=>'<th style="'+(used.includes(h)?'color:var(--brand)':'')+'">'+esc(h)+(used.includes(h)?' ✓':'')+'</th>').join('')+'</tr></thead><tbody>'+P.rows.slice(0,4).map(r=>'<tr>'+show.map(h=>'<td>'+esc(String(r[h]).slice(0,40))+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>'+
  effect(impEstimate())+
  '<div class="modal-foot"><button class="btn btn-ghost" onclick="closeOverlays()">Cancel</button><button class="btn btn-primary" onclick="runImport()">Import '+P.rows.length+' rows</button></div>',true)}
function impEstimate(){const t=IMP.type,P=IMP.P,m=IMP.map;if(!m.company)return['Choose the organisation column so rows can be matched to accounts.'];
  const orgs=new Set(P.rows.map(r=>norm(r[m.company])).filter(Boolean));const exist=[...orgs].filter(o=>S.accounts.some(a=>norm(a.name)===o)).length;
  const out=[orgs.size+' organisations: '+exist+' already on your list, '+(orgs.size-exist)+' new ones added to Who.'];
  if(t==='deals')out.push(P.rows.length+' deals added to the pipeline, matched to stages by name.');
  else if(t!=='companies'&&t!=='contacts')out.push('Every engaged row becomes a scored signal'+(IMP.camp?', tagged to '+esc(S.campaigns.find(c=>c.id===IMP.camp).name):'')+'. Anything that crosses your alert line notifies you.');
  if(IMP.camp&&['outreach','li_outreach','downloads','attendees'].includes(t))out.push('The matching block on that campaign is filled with the totals.');
  out.push('You can undo the whole import straight after.');return out}
function rowsToSignals(P,m,t,camp){let n=0,sigs=0;const H=P.headers;const nm=r=>{if(m.person&&r[m.person])return r[m.person];if(m.first||m.last)return((m.first?r[m.first]:'')+' '+(m.last?r[m.last]:'')).trim();return''};
  const opened=col(H,['opened?','opened','email opened','opens']),clicked=col(H,['clicked?','clicked','email clicked','clicks']),replied=col(H,['replied?','replied','email replied','replies']),bounced=col(H,['bounced?','bounced']);
  const accepted=col(H,['accepted','connection accepted','connected','accepted?']);const imp=col(H,['imp.','impressions']),clk=col(H,['clicks']),eng=col(H,['eng.','engagements','engagement']),att=col(H,['attended','attendee','status','attendance','checked in']),dl=col(H,['asset','download','form name','content','form']);
  P.rows.forEach(r=>{const org=(r[m.company]||'').trim();if(!org)return;const a=ensureAccount(org);const person=nm(r);if(person)addPerson(a,{name:person,role:m.role?r[m.role]:'',email:m.email?r[m.email]:''});n++;
    const S2=(type,o)=>{addSignal(a,type,Object.assign({person,campaign:camp,src:'import'},o||{}));sigs++};
    if(t==='outreach'){if(bounced&&yes(r[bounced]))return;if(replied&&yes(r[replied]))S2('reply');else if(clicked&&yes(r[clicked]))S2('email_click');else if(opened&&yes(r[opened]))S2('email_open')}
    else if(t==='li_outreach'){if(replied&&yes(r[replied]))S2('li_reply');else if(accepted&&yes(r[accepted]))S2('li_accept')}
    else if(t==='li_companies'){const ci=numv(r[clk]),ei=numv(r[eng]),ii=numv(r[imp]);if(ci)S2('ad_click',{qty:ci});else if(ei)S2('ad_engage',{qty:ei});else if(ii)S2('ad_view',{qty:ii})}
    else if(t==='downloads'){const what=dl?r[dl]:'';S2(/tool|calculator|calendar|score|check/i.test(what)?'tool':'content',{note:what})}
    else if(t==='attendees'){const st=att?String(r[att]):'yes';const isWeb=/webinar/i.test(IMP.name+' '+H.join(' '));if(att&&!yes(st)||/no.?show|absent|registered only/i.test(st))S2('webinar_signup');else S2(isWeb?'webinar_attend':'event_attend')}
    autoStage(a)});
  return{n,sigs,cnt:k=>k?P.rows.filter(r=>yes(r[k])).length:0,opened,clicked,replied,bounced,accepted}}
function runImport(){const t=IMP.type,P=IMP.P,m=IMP.map,camp=IMP.camp;if(!m.company){toast('Choose the organisation column first');return}
  const before=S.accounts.length;let res={n:0,sigs:0};const T=IMPORT_TYPES[t];
  act('Imported '+IMP.name,()=>{const c=camp?S.campaigns.find(x=>x.id===camp):null;
    const block=type=>{if(!c)return null;let b=c.blocks.find(x=>x.type===type);if(!b){b={id:uid(),type,metrics:{}};c.blocks.push(b)}b.file=IMP.name;b.fileAt=today();b.history=b.history||[];b.history.unshift({at:today(),file:IMP.name,rows:P.rows.length});return b};
    if(t==='deals'){P.rows.forEach(r=>{const org=(r[m.company]||'').trim();if(!org)return;const a=ensureAccount(org);const st=String(m.stage?r[m.stage]:'').toLowerCase();
      const lane=/won|closed won/.test(st)?'won':/lost/.test(st)?'lost':/pitch|proposal/.test(st)?'pitch':/brief/.test(st)?'brief':/hold/.test(st)?'hold':/lead|qualif/.test(st)?'lead':'opportunity';
      S.opps.push({id:uid(),name:a.name,accountId:a.id,value:numv(m.value?r[m.value]:0)||+S.setup.avgDeal||0,lane,weight:null,next:m.next?r[m.next]:'',source:'Imported',created:today(),updated:today(),closed:lane==='won'?today():''});a.stage='opp';res.n++})}
    else if(t==='companies'||t==='contacts'){res=rowsToSignals(P,m,t,'')}
    else{res=rowsToSignals(P,m,t,camp);
      if(c&&t==='outreach'){const b=block('email_seq');b.metrics={'Contacted':P.rows.length,'Delivered':P.rows.length-res.cnt(res.bounced),'Opened':res.cnt(res.opened),'Clicked':res.cnt(res.clicked),'Replied':res.cnt(res.replied)}}
      if(c&&t==='li_outreach'){const b=block('li_out');b.metrics['Connections sent']=P.rows.length;b.metrics['Accepted']=res.cnt(res.accepted);b.metrics['Replies']=res.cnt(res.replied)}
      if(c&&t==='downloads'){const b=block('content');b.metrics['Downloads']=P.rows.length;b.metrics['Named downloaders']=P.rows.filter(r=>m.person&&r[m.person]||m.first&&r[m.first]).length}
      if(c&&t==='attendees'){const web=/webinar/i.test(IMP.name);const b=block(web?'webinar':'events');b.metrics['Attended']=P.rows.length}}
    if(T.need)S.uploads[T.need]=today()},{quiet:true});
  const fired=checkIntent(true);const created=S.accounts.length-before;closeOverlays();
  if(fired)notify({kind:'import',ic:'🔥',title:fired+' account'+(fired===1?'':'s')+' crossed your alert line',body:'From '+IMP.name,noToast:true});
  toast('✅ Imported '+res.n+' rows'+(created?', '+created+' new accounts':'')+(res.sigs?', '+res.sigs+' signals scored':'')+(fired?'. '+fired+' now hot.':''),{l:'Undo',f:undo},9000)}

/* drop a file anywhere */
let dragDepth=0;
window.addEventListener('dragenter',e=>{if(!S||!S.setup.done||!e.dataTransfer||![...e.dataTransfer.types].includes('Files'))return;if($('#modal').classList.contains('on'))return;dragDepth++;document.body.classList.add('dragging-file')});
window.addEventListener('dragleave',()=>{dragDepth=Math.max(0,dragDepth-1);if(!dragDepth)document.body.classList.remove('dragging-file')});
window.addEventListener('dragover',e=>{if(document.body.classList.contains('dragging-file'))e.preventDefault()});
window.addEventListener('drop',e=>{if(!document.body.classList.contains('dragging-file'))return;e.preventDefault();dragDepth=0;document.body.classList.remove('dragging-file');const f=e.dataTransfer.files[0];if(f)startImport(f,'')});

/* ── backups, restore points, exports, starting over ───────── */
function backupNow(){const blob=new Blob([JSON.stringify({kind:'growth-dashboard-backup',savedAt:new Date().toISOString(),data:S},null,1)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(S.setup.agency||'growth').replace(/\W+/g,'-').toLowerCase()+'-dashboard-'+today()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);
  S.lastBackup=new Date().toISOString();save();toast('💾 Backup downloaded. Keep it somewhere safe.')}
function restorePreview(text,name){let p;try{p=JSON.parse(text);if(p.kind==='growth-dashboard-backup')p=p.data}catch(e){toast('That file is not a dashboard backup.');return}
  if(!p||!p.setup||!p.accounts){toast('That file is not a dashboard backup.');return}const c=counts(p),cur=counts();
  modal('<h2>Restore this backup?</h2><p class="sub">'+esc(name)+' · '+esc(p.setup.agency||'Unnamed workspace')+'</p>'+
  '<div class="tbl-wrap"><table class="tbl"><tr><th></th><th>In the file</th><th>Right now</th></tr>'+[['Accounts','accounts'],['Deals','opps'],['Campaigns','campaigns'],['Touchpoints','activity']].map(([l,k])=>'<tr><td>'+l+'</td><td><b>'+c[k]+'</b></td><td class="muted">'+cur[k]+'</td></tr>').join('')+'</table></div>'+
  effect(['Everything in this browser is replaced with the backup.','Your current workspace is kept as a restore point first, so you can always step back.'])+
  '<div class="modal-foot"><button class="btn btn-ghost" onclick="closeOverlays()">Cancel</button><button class="btn btn-primary" id="doRestore">Restore the backup</button></div>');
  $('#doRestore').onclick=()=>{autoRestorePoint(true,'Before restoring '+name);S=migrate(p);S.setup.done=true;applyTheme();save();closeOverlays();renderShell();go('today');mountDot();toast('Workspace restored')}}
function restorePoint(id){const pt=getPoints().find(p=>p.id===id);if(!pt)return;confirmBox('Go back to '+new Date(pt.ts).toLocaleString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})+'?','Your current workspace is saved as a restore point first, so this can be reversed too.','Go back',()=>{autoRestorePoint(true,'Before stepping back');S=migrate(JSON.parse(pt.data));applyTheme();save();renderShell();go('settings','data');toast('Stepped back')})}
function exportCSV(kind){let rows=[];
  if(kind==='accounts')rows=[['Brand','Sector','City','Stage','Heat','Score','Last touch','People','Latest news']].concat(S.accounts.map(a=>{const s=scoreAccount(a);return[a.name,a.sector,a.city||'',(STAGES.find(x=>x.k===a.stage)||STAGES[0]).l,s.heat,s.score,lastTouch(a),a.people.map(p=>p.name+(p.role?' ('+p.role+')':'')).join('; '),a.news?a.news.text:'']}));
  if(kind==='pipeline')rows=[['Opportunity','Value','Stage','Probability','Next step','Updated']].concat(S.opps.map(o=>[o.name,o.value,(LANES.find(l=>l.k===o.lane)||{}).l,laneW(o),o.next,o.updated]));
  if(kind==='activity')rows=[['Date','Type','Brand','Person','Note']].concat(S.activity.map(f=>[f.date,(ACTS.find(a=>a.k===f.type)||{}).l,(accountById(f.accountId)||{}).name||'',f.person,f.note]));
  if(kind==='people'){rows=[['Brand','Name','Role','Email','LinkedIn']];S.accounts.forEach(a=>a.people.forEach(p=>rows.push([a.name,p.name,p.role,p.email,p.li||''])))}
  const csv=rows.map(r=>r.map(v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"').join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download=kind+'-'+today()+'.csv';a.click();toast('📄 '+kind.charAt(0).toUpperCase()+kind.slice(1)+' CSV downloaded')}
function resetWorkspace(mode){if(mode==='data'){confirmBox('Clear the data, keep the setup?','Accounts, pipeline, campaigns and touchpoints go. Your brand, target profile and goals stay. A restore point is saved first.','Clear the data',()=>{autoRestorePoint(true,'Before clearing data');act('Cleared the data',()=>{const keep={setup:S.setup,brand:S.brand};S=blankState();S.setup=keep.setup;S.setup.demo=false;S.brand=keep.brand})},true);return}
  modal('<h2>Start completely fresh?</h2><p class="sub">This removes everything in this browser, including your setup, and takes you back to the start. A restore point is kept in case you change your mind.</p><div class="field"><label>Type RESET to confirm</label><input class="inp" id="rsIn" oninput="$(\'#rsGo\').disabled=this.value.trim().toUpperCase()!==\'RESET\'"></div><div class="modal-foot"><button class="btn btn-ghost" onclick="closeOverlays()">Cancel</button><button class="btn btn-danger" id="rsGo" disabled onclick="autoRestorePoint(true,\'Before full reset\');localStorage.removeItem(KEY);localStorage.removeItem(OLD_KEY);location.reload()">Reset everything</button></div>')}
function loadDemo(){confirmBox('Load the demo workspace?','Fills the dashboard with invented accounts and numbers so you can see it working. Your current workspace is saved as a restore point first.','Load the demo',()=>{autoRestorePoint(true,'Before loading the demo');const brand=S.brand,setup=S.setup;S=demoState();S.brand=brand;S.setup.agency=setup.agency||S.setup.agency;S.setup.you=setup.you||S.setup.you;S.setup.guides=setup.guides||{};save();renderShell();go('today');mountDot();setTimeout(()=>checkIntent(),1200)})}
function leaveDemo(){confirmBox('Start your own workspace?','We clear the invented data and keep your brand and setup. Then you can add your first brands.','Start my own',()=>{const keep={setup:S.setup,brand:S.brand};S=blankState();S.setup=keep.setup;S.setup.demo=false;S.setup.done=true;S.brand=keep.brand;save();renderShell();go('build');mountDot()})}
