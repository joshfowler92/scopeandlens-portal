/* ═══════════ v18j MOTION, IN THE WEBSITE'S STYLE ═══════════
   Soft colour drifting behind the page, sections that rise in as a page opens, springy lifts on hover and
   numbers that count up. Calm, never in the way, and off for anyone who prefers reduced motion. */
const RM18=matchMedia('(prefers-reduced-motion: reduce)').matches;
function bgfx18(){if(RM18||$('#bgfx18'))return;const d=document.createElement('div');d.id='bgfx18';d.setAttribute('aria-hidden','true');
  d.innerHTML='<i class="b1"></i><i class="b2"></i><i class="b3"></i><b class="r1"></b><b class="r2"></b>';document.body.prepend(d)}
let LASTV18='';
function enter18(fresh){const v=$('#view');if(!v)return;if(!fresh||RM18)return;const kids=[...v.children].filter(e=>e.offsetHeight>0).slice(0,10);
  kids.forEach((e,i)=>{e.classList.remove('rv18');void e.offsetWidth;e.style.setProperty('--rv',(i*0.06)+'s');e.classList.add('rv18')});
  setTimeout(()=>kids.forEach(e=>e.classList.remove('rv18')),1400)}
function count18(){if(RM18)return;$$('#view .kp18 b,#view .in18t-c b,#view .ln18-n b').forEach(b=>{if(b.dataset.c18)return;const t=b.textContent.trim();const m=t.match(/^([£$€]?)(\d[\d,.]*)([kmKM%]?)$/);if(!m)return;
  const end=parseFloat(m[2].replace(/,/g,''));if(!isFinite(end)||end===0)return;b.dataset.c18=1;const dec=(m[2].split('.')[1]||'').length;const t0=performance.now();const D=800;
  const step=now=>{const k=Math.min(1,(now-t0)/D);const e=1-Math.pow(1-k,3);b.textContent=m[1]+(end*e).toFixed(dec)+m[3];if(k<1)requestAnimationFrame(step);else b.textContent=t};requestAnimationFrame(step)})}
(function(){const _go=go;go=function(v,a,k){const fresh=!k&&(v!==LASTV18||true);const r=_go.apply(this,arguments);LASTV18=VIEW;try{bgfx18();requestAnimationFrame(()=>{enter18(!k);count18()})}catch(e){}return r}})();

/* ═══ decision makers: act as the right Amplify account, fall back gracefully, and keep their photos ═══ */
ampCall=async function(action,payload){const I=(typeof agInfo==='function'&&agInfo())||{};const p=Object.assign({},payload||{});if(I.senderEmail&&!p.as)p.as=I.senderEmail;return api('amplify',{method:'POST',body:{action,payload:p}})};
const PHOTO_KEYS=['photo','photoUrl','photo_url','profilePicture','profile_picture','picture','avatar','image','imageUrl','profileImage'];
function photoOf18(o){for(const k of PHOTO_KEYS){const v=o&&o[k];if(typeof v==='string'&&/^https:\/\//.test(v))return v}return ''}
ampFindPeople=async function(a){const j=await ampCall('find-people',{company:a.name,domain:domainOf(a),titles:myDiscs().flatMap(k=>DISC[k].titles).slice(0,6),roles:S.setup.profile.roles,limit:10,withPhotos:true});
  const r=(j.people||[]).map(p=>({name:p.name,role:p.title,li:p.linkedin,email:p.email,verified:!!p.verified,photo:photoOf18(p)}));r.note=j.note||'';return r};
async function apolloPeople18(a){const j=await api('people?company='+encodeURIComponent(a.name)+'&domain='+encodeURIComponent(domainOf(a))+'&titles='+encodeURIComponent(myDiscs().flatMap(k=>DISC[k].titles).slice(0,8).join('|')));return (j.people||[]).map(p=>({name:p.name,role:p.title,li:p.linkedin,photo:photoOf18(p)}))}
function noLinkedIn18(msg){const I=agInfo();modal('<h2>Amplify cannot see your LinkedIn</h2><p class="sub">'+esc(msg)+'</p>'+
  '<div class="field"><label for="nlE">The email LinkedIn is connected under in Amplify</label><input class="inp" id="nlE" value="'+esc(I.senderEmail||(SESSION&&SESSION.email)||'')+'" placeholder="you@youragency.com"></div><p class="tiny muted">Plato will act as this account when it searches and sends. It has to be on your agency’s email domain.</p>'+
  '<div class="modal-foot"><button class="btn btn-ghost" onclick="closeOverlays()">Close</button><button class="btn btn-primary" onclick="const v=$(\'#nlE\').value.trim();if(v){setAg(\'senderEmail\',v);save()}closeOverlays();toast(\'Saved. Try finding them again.\')">Save and try again</button></div>')}
findDM=async function(aid){const a=accountById(aid);const b=$('#dmb-'+aid);await ampCheck();const useAmp=ampOn();const canPeople=(await apiCheck())&&API_INFO.people;
  if(!useAmp&&!canPeople){ampUpgrade('Find every decision maker at '+a.name);return}
  if(b){b.disabled=true;b.innerHTML='Searching…'}let items=null,note='';
  try{if(useAmp)items=await ampFindPeople(a)}catch(e){const m=String(e.message||'');if(/linkedin|^Confirm /i.test(m)){note=m}else note=m||'Amplify could not search just now'}
  if(!items&&canPeople){try{items=await apolloPeople18(a)}catch(e){}}
  if(items){S.live.people[a.name]={ts:new Date().toISOString(),items};save();const an=items.note?esc(items.note):'';toast(items.length?'Found '+items.length+' at '+esc(a.name)+(note?' (from people data, not LinkedIn)':'')+(an?'. '+an:''):(an||'Nobody new found at '+esc(a.name)))}
  go(VIEW,VIEW_ARG,true);if(note&&/linkedin|^Confirm /i.test(note))setTimeout(()=>noLinkedIn18(note),300);else if(note&&!items)toast(note)};
/* photos travel with the person and show wherever they do */
addDM=function(aid,name,role,li){const a=accountById(aid);const src=(livePeople(a.name)||[]).find(p=>norm(p.name)===norm(name))||{};act('Added '+name+' at '+a.name,()=>{const p=addPerson(a,{name,role});if(li)p.li=li;if(src.photo)p.photo=src.photo;if(src.email&&!p.email)p.email=src.email},{refresh:false,ic:'👤',ms:2600,quiet:true});award('person',name+' added');refreshNav();go('prospects','people',true)};
function photoByName18(name,a){const k=norm(name);const L=a?[a]:S.accounts;for(const x of L){const p=(x.people||[]).find(q=>norm(q.name)===k);if(p&&p.photo)return p.photo;const s=((S.live.people||{})[x.name]||{items:[]}).items.find(q=>norm(q.name)===k);if(s&&s.photo)return s.photo}return ''}
const _pRow18=pRow;pRow=function(a,p,mine){let h=_pRow18(a,p,mine);const ph=p.photo||photoByName18(p.name,a);if(ph)h=h.replace(/<span class="av([^"]*)">[^<]*<\/span>/,'<span class="av$1 ph"><img src="'+esc(ph)+'" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.classList.remove(\'ph\');this.parentNode.textContent=\''+esc(initials(p.name))+'\'"></span>');return h};
const _personRow18=personRow;personRow=function(p){let h=_personRow18(p);const ph=photoByName18(p.name);if(ph)h=h.replace(/<span class="ip-av">[^<]*<\/span>/,'<span class="ip-av ph"><img src="'+esc(ph)+'" alt="" loading="lazy" referrerpolicy="no-referrer"></span>');return h};
const _sgRow18=sgRow18;sgRow18=function(r){return _sgRow18(r).replace(/<span data-tip="([^"]*)">([A-Z?]{1,3})<\/span>/g,(m,tip,ini)=>{const nm=tip.split(',')[0].replace(/&amp;/g,'&').replace(/&#39;/g,"'");const ph=photoByName18(nm,r.a);return ph?'<span data-tip="'+tip+'" class="ph"><img src="'+esc(ph)+'" alt="" loading="lazy" referrerpolicy="no-referrer"></span>':m})};
/* a sending address on another domain is confirmed once, from that inbox */
async function ampLink18(email){try{await ampCall('link-account',{as:email});modal('<h2>Check '+esc(email)+'</h2><p class="sub">We have sent a one-click confirmation link to that inbox. Click it, then come back and press Find decision makers again. It only needs doing once.</p><div class="modal-foot"><button class="btn btn-primary" onclick="closeOverlays()">Got it</button></div>')}catch(e){toast(e.message||'Could not send the link')}}
noLinkedIn18=function(msg){const I=agInfo();const confirm=/^Confirm /.test(msg);
  if(!confirm){modal('<h2>Amplify cannot see a LinkedIn account</h2><p class="sub">'+esc(msg)+'</p><p class="sub">Your LinkedIn may be connected in Amplify under a different workspace from the one Plato’s connection uses. Scope &amp; Lens can sort that on the Amplify side. Meanwhile Plato finds people from its people data where it can.</p><div class="modal-foot"><button class="btn btn-ghost" onclick="closeOverlays()">Close</button><button class="btn btn-primary" onclick="closeOverlays();speakJosh&&speakJosh()">Tell Scope &amp; Lens</button></div>');return}const want=(msg.match(/[^\s@]+@[^\s@]+\.[a-z]{2,}/i)||[''])[0];
  modal('<h2>'+(confirm?'One quick confirmation':'Amplify cannot see your LinkedIn')+'</h2><p class="sub">'+(confirm?'You are signed in to Plato as '+esc((SESSION&&SESSION.email)||'')+', and your LinkedIn is connected in Amplify under '+esc(want)+'. To keep accounts safe, that inbox confirms once that Plato can use it.':esc(msg))+'</p>'+
  '<div class="field"><label for="nlE">The email LinkedIn is connected under in Amplify</label><input class="inp" id="nlE" value="'+esc(want&&confirm?want:(I.senderEmail||want||''))+'" placeholder="you@youragency.com"></div>'+
  '<div class="modal-foot"><button class="btn btn-ghost" onclick="closeOverlays()">Close</button><button class="btn btn-primary" onclick="const v=$(\'#nlE\').value.trim();if(!v)return;setAg(\'senderEmail\',v);save();closeOverlays();ampLink18(v)">Send the confirmation link</button></div>')};
