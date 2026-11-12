/* ═══════════ THE PUBLISHING DESK (admin only) ═══════════
   A proper editor for Josh: headings, bold, lists, quotes and links. He chooses the image, or no image.
   Nothing is ever picked for him. Publishing is instant on screen and reaches every user: live if they are
   online, waiting for them next time they open Plato if they are not. */
const isAdmin=()=>!!(SESSION&&SESSION.role==='admin');
/* only these tags survive, on the way in and on the way out */
const SAFE_TAGS={P:1,H2:1,H3:1,B:1,STRONG:1,I:1,EM:1,U:1,UL:1,OL:1,LI:1,BLOCKQUOTE:1,A:1,BR:1};
function cleanHTML(html){const d=new DOMParser().parseFromString('<div>'+String(html||'')+'</div>','text/html');const root=d.body.firstChild;
  const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3)return;if(c.nodeType!==1){c.remove();return}walk(c);
    if(c.tagName==='DIV'){const p=d.createElement('p');while(c.firstChild)p.appendChild(c.firstChild);c.replaceWith(p);return}
    if(c.tagName==='H1'||c.tagName==='H4'){const h=d.createElement(c.tagName==='H1'?'h2':'h3');while(c.firstChild)h.appendChild(c.firstChild);c.replaceWith(h);return}
    if(!SAFE_TAGS[c.tagName]){c.replaceWith(...c.childNodes);return}
    [...c.attributes].forEach(a=>{if(!(c.tagName==='A'&&a.name==='href'))c.removeAttribute(a.name)});
    if(c.tagName==='A'){const h=c.getAttribute('href')||'';if(!/^(https?:|mailto:)/i.test(h))c.removeAttribute('href');else{c.setAttribute('target','_blank');c.setAttribute('rel','noopener');c.setAttribute('class','src')}}})};
  walk(root);return root.innerHTML.replace(/<p>(\s|<br>)*<\/p>/g,'').trim()}
function insBody(x){return x.html?cleanHTML(x.html):mdLite(x.body||'')}
function insText(x){return x.html?String(x.html).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim():x.body||''}
/* the cover: the image Josh chose, or nothing at all */
insCover=function(x,size){return x&&x.img?'<div class="icov img '+(size||'')+'"><img src="'+esc(x.img)+'" alt="'+esc(x.alt||'')+'" loading="lazy"></div>':''};
let PU_IMG=null;
openPublish=function(id){if(!isAdmin()){toast('Only Scope & Lens can publish here');return}
  const x=id?getInsights().find(i=>i.id===id):{cat:'opportunity',title:'',summary:'',html:'',brands:[],img:''};if(!x)return;PU_IMG=x.img?{src:x.img,alt:x.alt||''}:null;
  const tb=[['bold','<b>B</b>','Bold'],['italic','<i>I</i>','Italic'],['underline','<u>U</u>','Underline'],['h2','H2','Heading'],['h3','H3','Subheading'],['insertUnorderedList','•','Bullet list'],['insertOrderedList','1.','Numbered list'],['blockquote','❝','Quote'],['link',ico('link'),'Link'],['removeFormat','⌫','Clear formatting']];
  modal('<div class="pu"><div class="pu-h">'+'<span class="pu-ic">'+ico('edit')+'</span>'+'<div class="grow"><h2 style="margin:0">'+(id?'Edit this piece':'Publish to every agency')+'</h2><p class="sub" style="margin:2px 0 0">It lands in every user’s Insights straight away, with an alert. Only you can see this desk.</p></div></div>'+
  '<div class="grid2"><div class="field"><label>Category</label><select class="inp" id="puC">'+Object.entries(INS_CATS).map(([k,v])=>'<option value="'+k+'"'+(x.cat===k?' selected':'')+'>'+v+'</option>').join('')+'</select></div>'+
    '<div class="field"><label>Brands mentioned</label><input class="inp" id="puBr" list="puList" value="'+esc((x.brands||[]).join(', '))+'" placeholder="Comma separated"><datalist id="puList">'+PROSPECTS.map(p=>'<option value="'+esc(p.name)+'">').join('')+'</datalist></div></div>'+
  '<input class="inp pu-t" id="puT" value="'+esc(x.title)+'" placeholder="Headline" aria-label="Headline">'+
  '<textarea class="inp pu-s" id="puS" rows="2" placeholder="The summary: one or two sentences people see on the card" aria-label="Summary">'+esc(x.summary)+'</textarea>'+
  '<div class="pu-ed"><div class="pu-tb" role="toolbar" aria-label="Formatting">'+tb.map(b=>'<button type="button" data-cmd="'+b[0]+'" data-tip="'+b[2]+'" aria-label="'+b[2]+'" onmousedown="event.preventDefault()" onclick="puCmd(\''+b[0]+'\')">'+b[1]+'</button>').join('')+'</div>'+
    '<div class="pu-lk" id="puLk"><input class="inp" id="puLkU" placeholder="https://" onkeydown="if(event.key===\'Enter\'){event.preventDefault();puLink()}"><button class="btn btn-primary btn-xs" onmousedown="event.preventDefault()" onclick="puLink()">Add link</button><button class="btn btn-ghost btn-xs" onclick="$(\'#puLk\').classList.remove(\'on\')">Cancel</button></div>'+
    '<div class="pu-body ibody" id="puEd" contenteditable="true" role="textbox" aria-multiline="true" aria-label="The piece" data-ph="Write the piece. Paste from anywhere, the formatting is tidied for you.">'+insBody(x)+'</div></div>'+
  '<div class="field"><label>Image</label><div class="pu-img" id="puImg"></div></div>'+
  '<label class="row" style="gap:8px;margin-top:4px"><input type="checkbox" id="puP" '+(x.pin?'checked':'')+'> Pin as the top story</label>'+
  '<div class="modal-foot">'+(id?'<button class="lft btn btn-danger btn-sm" onclick="delInsight(\''+id+'\')">Remove</button>':'')+'<button class="btn btn-ghost" onclick="closeOverlays()">Cancel</button><button class="btn btn-primary" id="puGo" onclick="savePublish(\''+(id||'')+'\')">'+(id?'Save changes':'Publish now')+ico('arrow','a')+'</button></div></div>',true);
  puImgUI();const ed=$('#puEd');ed.addEventListener('paste',e=>{const h=e.clipboardData.getData('text/html');const t=e.clipboardData.getData('text/plain');e.preventDefault();document.execCommand('insertHTML',false,h?cleanHTML(h):esc(t).replace(/\n\n+/g,'</p><p>').replace(/\n/g,'<br>'))});setTimeout(()=>(id?ed:$('#puT')).focus(),80)};
let PU_RANGE=null;
function puCmd(c){const ed=$('#puEd');ed.focus();
  if(c==='h2'||c==='h3'||c==='blockquote'){const cur=document.queryCommandValue('formatBlock').toLowerCase();document.execCommand('formatBlock',false,cur===c?'p':c);return}
  if(c==='link'){const s=getSelection();PU_RANGE=s.rangeCount?s.getRangeAt(0).cloneRange():null;$('#puLk').classList.add('on');setTimeout(()=>$('#puLkU').focus(),30);return}
  document.execCommand(c,false,null)}
function puLink(){let u=$('#puLkU').value.trim();if(!u)return;if(!/^(https?:|mailto:)/i.test(u))u='https://'+u;const ed=$('#puEd');ed.focus();const s=getSelection();if(PU_RANGE){s.removeAllRanges();s.addRange(PU_RANGE)}
  if(s.isCollapsed)document.execCommand('insertHTML',false,'<a href="'+esc(u)+'">'+esc(u.replace(/^https?:\/\//,''))+'</a>');else document.execCommand('createLink',false,u);$('#puLk').classList.remove('on');$('#puLkU').value=''}
function puImgUI(){const el=$('#puImg');if(!el)return;
  el.innerHTML=PU_IMG?'<div class="pu-pv"><img src="'+esc(PU_IMG.src)+'" alt=""><div class="grow"><input class="inp" id="puAlt" value="'+esc(PU_IMG.alt||'')+'" placeholder="Describe the image for screen readers" oninput="PU_IMG.alt=this.value"><div class="row" style="gap:6px;margin-top:8px"><label class="btn btn-line btn-xs">'+ico('image')+'Change<input type="file" accept="image/*" hidden onchange="puPick(this.files[0])"></label><button class="btn btn-ghost btn-xs" onclick="PU_IMG=null;puImgUI()">'+ico('x')+'No image</button></div></div></div>':
  '<div class="pu-opt"><span class="pill good">'+ico('check')+'No image</span><span class="tiny muted">The card leads with the headline. Or</span><label class="btn btn-line btn-xs">'+ico('image')+'Choose an image<input type="file" accept="image/*" hidden onchange="puPick(this.files[0])"></label></div>'}
async function puPick(f){if(!f)return;if(!/^image\//.test(f.type)){toast('That is not an image');return}try{PU_IMG={src:await shrinkImg(f,1600,.84),alt:''};puImgUI();setTimeout(()=>$('#puAlt')&&$('#puAlt').focus(),50)}catch(e){toast('Could not read that image')}}
function shrinkImg(f,max,q){return new Promise((ok,no)=>{const r=new FileReader();r.onerror=no;r.onload=()=>{const im=new Image();im.onerror=no;im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height));const cv=document.createElement('canvas');cv.width=Math.round(im.width*k);cv.height=Math.round(im.height*k);const x=cv.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,cv.width,cv.height);x.drawImage(im,0,0,cv.width,cv.height);ok(cv.toDataURL('image/jpeg',q))};im.src=r.result};r.readAsDataURL(f)})}
savePublish=async function(id){const t=$('#puT').value.trim();if(!t){$('#puT').focus();toast('Give it a headline');return}const html=cleanHTML($('#puEd').innerHTML);
  const old=id?getInsights().find(i=>i.id===id)||{}:{};
  const x={id:id||('ins-'+uid()),cat:$('#puC').value,title:t,summary:$('#puS').value.trim(),html,body:'',brands:$('#puBr').value.split(',').map(s=>s.trim()).filter(Boolean),pin:$('#puP').checked?1:0,date:old.date||today(),at:new Date().toISOString(),by:SESSION&&SESSION.email,img:PU_IMG?PU_IMG.src:'',alt:PU_IMG?PU_IMG.alt||'':''};
  /* on screen straight away. The server catches up behind it. */
  const live=!!((await apiCheck())&&API_INFO&&API_INFO.insights&&!(SESSION&&SESSION.preview));
  if(live){INS_REMOTE=[x].concat((INS_REMOTE||[]).filter(i=>i.id!==x.id))}else{const L=localIns().filter(i=>i.id!==x.id);L.unshift(x);try{localStorage.setItem('sl-insights-local',JSON.stringify(L))}catch(e){toast('That image is too big to keep in this browser. Try a smaller one.');return}}
  closeOverlays();insSeen(x.id);go('insights','all');
  if(!live){toast('✓ Published here. Once Plato is live, it reaches every user at once.',{l:'Download',f:downloadInsights},6000);return}
  toast('📣 Published. Every user is being told now.');
  try{const j=await api('insights',{method:'POST',body:x});if(j&&j.item){INS_REMOTE=[j.item].concat(INS_REMOTE.filter(i=>i.id!==x.id));if(VIEW==='insights')go('insights',null,true)}if(j&&j.told!=null)toast('📣 '+j.told+' user'+(j.told===1?'':'s')+' told about “'+esc(t)+'”')}
  catch(e){toast('⚠️ Not saved to the server yet: '+esc(e.message),{l:'Try again',f:()=>{api('insights',{method:'POST',body:x}).then(()=>toast('✓ Saved')).catch(er=>toast('Still failing: '+esc(er.message)))}},9000)}};
openInsight=function(id){const x=getInsights().find(i=>i.id===id);if(!x)return;insSeen(id);const c=curCamp();const mine=new Set(c?campTargets(c).map(a=>norm(a.name)):[]);
  modal('<div class="iread">'+insCover(x,'lg')+'<span class="ik" style="--c:'+(INS_COL[x.cat]||'#2c56ed')+'">'+esc(INS_CATS[x.cat]||'')+'</span><h2>'+esc(x.title)+'</h2><small class="muted">By Scope &amp; Lens · '+fmtDate(x.date)+'</small>'+(x.summary?'<p class="lede" style="margin:14px 0">'+esc(x.summary)+'</p>':'')+'<div class="ibody">'+insBody(x)+'</div>'+
    ((x.brands||[]).length?'<div class="lab" style="margin-top:18px">Brands in this piece</div><div class="ibr">'+x.brands.map(n=>'<div>'+logo(n,32)+'<b>'+esc(n)+'</b>'+(PROSPECTS.some(p=>p.name===n)?(mine.has(norm(n))?'<span class="pill good">On your list</span>':'<button class="btn btn-line btn-xs" onclick="toggleTarget(\''+esc(n).replace(/'/g,"\\'")+'\');openInsight(\''+id+'\')">'+ico('plus')+'Add</button>'):'')+'</div>').join('')+'</div>':'')+
    (isAdmin()?'<div class="modal-foot"><button class="lft btn btn-danger btn-sm" onclick="delInsight(\''+id+'\')">Remove</button><button class="btn btn-line" onclick="openPublish(\''+id+'\')">'+ico('edit')+'Edit</button></div>':'')+'</div>',true)};
/* who has seen what: per browser, so the pop only shows once */
function insSeenSet(){try{return new Set(JSON.parse(localStorage.getItem('sl-ins-ids')||'[]'))}catch(e){return new Set()}}
function insSeen(id){const s=insSeenSet();s.add(id);try{localStorage.setItem('sl-ins-ids',JSON.stringify([...s].slice(-400)))}catch(e){}const n=S&&S.notifications.find(z=>z.insightId===id&&!z.read);if(n){n.read=true;save();renderBell()}}
/* Scoop taps you on the shoulder when Josh publishes */
function scoopPop(x){if(!x||document.querySelector('.scoop'))return;const el=document.createElement('div');el.className='scoop';el.setAttribute('role','status');
  el.innerHTML='<span class="pu-ic">'+ico('bulb')+'</span><div class="grow"><small>New from Josh</small><b>'+esc(x.title)+'</b>'+(x.summary?'<p>'+esc(x.summary.slice(0,120))+(x.summary.length>120?'…':'')+'</p>':'')+'<div class="row" style="gap:6px;margin-top:8px"><button class="btn btn-primary btn-xs" id="scGo">Read it'+ico('arrow','a')+'</button><button class="btn btn-ghost btn-xs" id="scNo">Later</button></div></div>';
  document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add('on'));const bye=()=>{el.classList.remove('on');setTimeout(()=>el.remove(),400)};
  el.querySelector('#scGo').onclick=()=>{bye();openInsight(x.id)};el.querySelector('#scNo').onclick=()=>{insSeen(x.id);bye()};refreshNav()}
function scoopCheck(){if(isAdmin()||!S||S.setup.viewMode==='dot'&&false)return;const seen=insSeenSet();const fresh=getInsights().filter(x=>!String(x.id).startsWith('seed')&&x.by&&!seen.has(x.id)&&daysAgo(x.date)<=14);if(fresh.length)scoopPop(fresh[0])}
/* online: a light check every minute. Offline: the alert is waiting on the server for next time. */
let INS_LATEST='';
async function insPoll(){if(document.visibilityState!=='visible'||!(typeof isLive==='function'&&isLive()))return;try{const j=await api('insights?latest=1');const L=j&&j.latest;if(!L||!L.id||L.id+L.at===INS_LATEST)return;const first=!INS_LATEST;INS_LATEST=L.id+L.at;
  if(!(INS_REMOTE||[]).some(i=>i.id===L.id&&i.at===L.at)){await loadInsights()}if(!first||!insSeenSet().has(L.id))scoopCheck()}catch(e){}}
setInterval(insPoll,60000);
const _loadInsights=loadInsights;loadInsights=async function(){await _loadInsights();setTimeout(scoopCheck,1800)};
