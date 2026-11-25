/* ═══════════ v18 AGENCY PROFILE: Plato reads you, you check it, and your agency comes to life ═══════════
   One page, no scrolling marathons. Five short steps down the left, one at a time in the middle,
   and your agency on the right as a character that gains a feature every time you fill something in.
   Step one does the work: give Plato your website or your credentials and it fills in the rest. */

const AG18=[['read','Start here','sparkle'],['who','About you','user'],['value','Why you','star'],['want','Who you want','target'],['voice','Voice and files','chat']];
const ag18Tab=t=>({assets:'voice',library:'voice'}[t]||t);
function ag18Done(k){const I=agInfo(),O=S.setup.offer,P=wantProf();
  if(k==='read')return !!(libState().items.length||I.siteRead||I.read18);
  if(k==='who')return !!(S.setup.agency&&S.setup.agency!=='Your agency'&&I.website&&I.location&&I.size&&I.services&&I.sender);
  if(k==='value')return !!((O.uvp||'').trim()&&(O.different||'').trim()&&((O.proof||'').trim()||libProofs().length)&&(O.solution||'').trim()&&I.clients);
  if(k==='want')return !!(P.discs.length&&P.sectors.length&&P.csize&&P.roles.length&&P.problems.length);
  if(k==='voice')return !!(I.voice||S.compose.tone);return false}
/* what the outreach partner needs to send for you, beyond the basics */
function ag18Amp(){const I=agInfo();return[['LinkedIn profile of the sender',!!I.senderLi],['Email the outreach comes from',!!I.senderEmail]]}

/* fill empty answers from whatever Plato read: the website, credentials, decks */
function ag18Fill(){const d=libState().learned;if(!d)return 0;const O=S.setup.offer,I=agInfo(),P=wantProf();let n=0;const pk=d.pick||{};
  const set=(o,k,v)=>{v=Array.isArray(v)?v.filter(Boolean).join(', '):v;if(v&&!String(o[k]||'').trim()){o[k]=String(v).replace(/—/g,',');n++}};
  set(O,'uvp',(d.uvp||[])[pk.uvp||0]);set(O,'different',(d.different||[])[pk.diff||0]);set(O,'solution',(d.offer||[])[pk.offer||0]);
  set(O,'proof',(libProofs()[0]||{}).text||((d.proofs||[])[0]||{}).text);set(I,'clients',(d.clients||[]).slice(0,6));set(I,'awards',(d.awards||[]).slice(0,2));
  set(I,'team',(d.team||[])[0]);set(I,'method',(d.method||[])[0]);
  if(!I.services&&(d.services||[]).length){I.services=d.services.map(k=>(DISC[k]||{}).l||k).join(', ');n++}
  if(!P.discs.length&&(d.services||[]).length){P.discs=d.services.filter(k=>DISC[k]).slice(0,3);P.discipline=P.discs[0]||'';n++}
  if(!P.sectors.length&&(d.sectors||[]).length){P.sectors=d.sectors.filter(k=>L_SECTORS[k]).slice(0,3);n++}
  if(!I.voiceNote&&d.voice){I.voiceNote=d.voice;n++}
  I.read18=today();save();return n}

/* reading, with something to watch while it happens */
let AG18_BUSY=null;
async function ag18Read(){const url=(($('#ag18U')||{}).value||agInfo().website||'').trim();if(!url){toast('Add your website address first');const i=$('#ag18U');i&&i.focus();return}
  setAg('website',url.replace(/^https?:\/\//,'').replace(/\/$/,''));AG18_BUSY={what:'site',t0:Date.now()};go('agency','read',true);ag18Tick();
  let filled=0;
  if(DEMO_MODE||!(typeof isLive==='function'&&isLive())){await new Promise(r=>setTimeout(r,4200));agInfo().read18=today();save()}
  else{try{await readWebsite(url,true);filled=ag18Fill()}catch(e){}}
  AG18_BUSY=null;go('agency','read',true);toast(filled?'Plato filled in '+filled+' answer'+(filled===1?'':'s')+' from your website. Check them in the next steps.':(DEMO_MODE?'In your own workspace, Plato reads the site and fills in your answers.':'Website read. Check your answers in the next steps.'))}
function ag18Tick(){const el=$('#ag18Feed');if(!el||!AG18_BUSY)return;const L=['Opening the home page','Reading about you','Looking at your work and case studies','Finding your clients and results','Listening to how you write','Filling in your answers'];
  const i=Math.min(L.length-1,Math.floor((Date.now()-AG18_BUSY.t0)/800));el.innerHTML=L.slice(0,i+1).map((x,j)=>'<li class="'+(j<i?'ok':'now')+'">'+(j<i?ico('check'):'<span class="sp18"></span>')+x+'</li>').join('');setTimeout(ag18Tick,400)}
const _libDrop18=libDrop;libDrop=async function(files,id){await _libDrop18(files,id);if(VIEW==='agency'){const n=ag18Fill();if(n)toast('Plato filled in '+n+' answer'+(n===1?'':'s')+' from your files.');go('agency',VIEW_ARG,true)}};

/* the character: your agency, gaining a feature for every answer */
let AG18_SEEN=null;
function ag18Traits(){const I=agInfo(),O=S.setup.offer,P=wantProf();const short=(t,n)=>{t=String(t||'').trim();return t.length>n?t.slice(0,n-1).replace(/\s+\S*$/,'')+'…':t};
  const tone=(CMP.tone.find(t=>t[0]===(I.voice||S.compose.tone))||[])[2];
  return[
    ['home','pin','Home turf',I.location?short(I.location,40):''],
    ['craft','layers','Craft',I.services?short(I.services,60):''],
    ['power','bolt','Superpower',(O.uvp||'').trim()?short(O.uvp,90):''],
    ['edge','star','Why you',(O.different||'').trim()?short(O.different,80):''],
    ['proof','trophy','Proof',((O.proof||'').trim()||(libProofs()[0]||{}).text)?short(O.proof||(libProofs()[0]||{}).text,80):''],
    ['move','gift','First move',(O.solution||'').trim()?short(O.solution,70):''],
    ['allies','people','Allies',I.clients?short(I.clients,70):''],
    ['quest','target','Quest',P.sectors.length?P.sectors.map(k=>(L_SECTORS[k]||{}).label||k).join(', ')+(P.problems.length?' · '+((L_PROBLEMS[P.problems[0]]||{}).label||''):''):''],
    ['voice','chat','Voice',tone||''],
    ['msg','send','Messenger',I.sender?short(I.sender,40)+(I.senderLi?' · LinkedIn ✓':''):'']]}
function ag18Char(){const T=ag18Traits();const got=T.filter(t=>t[3]).length;const lvl=Math.max(1,Math.ceil(got/2));const name=S.setup.agency&&S.setup.agency!=='Your agency'?S.setup.agency:'Your agency';
  const col=(S.brand&&S.brand.primary)||'#2c56ed';if(!AG18_SEEN)AG18_SEEN=new Set(T.filter(t=>t[3]).map(t=>t[0]));const fresh=T.filter(t=>t[3]&&!AG18_SEEN.has(t[0])).map(t=>t[0]);fresh.forEach(k=>AG18_SEEN.add(k));
  const pct=Math.round(got/T.length*100),r=54,c=2*Math.PI*r;
  const orbit=T.map((t,i)=>{const a=-Math.PI/2+i/T.length*Math.PI*2;return '<span class="ch18-o'+(t[3]?' on':'')+(fresh.includes(t[0])?' new':'')+'" style="left:'+(50+Math.cos(a)*44).toFixed(1)+'%;top:'+(50+Math.sin(a)*44).toFixed(1)+'%" data-tip="'+esc(t[2])+'">'+ico(t[1])+'</span>'}).join('');
  return '<aside class="ch18" aria-label="Your agency, as Plato sees it"><div class="ch18-k">Your agency, as Plato sees it</div>'+
    '<div class="ch18-av" style="--ac:'+col+'"><svg viewBox="0 0 120 120" class="ch18-ring"><circle cx="60" cy="60" r="'+r+'" class="t"/><circle cx="60" cy="60" r="'+r+'" class="v" stroke-dasharray="'+(c*pct/100).toFixed(1)+' '+c.toFixed(1)+'" transform="rotate(-90 60 60)"/></svg>'+
      '<span class="ch18-em">'+esc(initials(name))+'</span>'+orbit+'</div>'+
    '<div class="ch18-n"><b>'+esc(name)+'</b><span>Level '+lvl+' of 5 · '+(got===T.length?'Fully formed':got+' of '+T.length+' features')+'</span></div>'+
    '<ul class="ch18-t">'+T.map(t=>'<li class="'+(t[3]?'on':'')+(fresh.includes(t[0])?' new':'')+'"><span class="ch18-i">'+ico(t[1])+'</span><span class="grow"><small>'+esc(t[2])+'</small><b>'+(t[3]?esc(t[3]):'Not yet')+'</b></span></li>').join('')+'</ul></aside>'}

/* the page */
VIEWS.agency=function(tab){tab=ag18Tab(tab||'');if(!AG18.some(t=>t[0]===tab))tab=(AG18.find(t=>!ag18Done(t[0]))||AG18[1])[0];
  const I=agInfo(),O=S.setup.offer;const idx=AG18.findIndex(t=>t[0]===tab);const ready=profReady();
  const fld=(id,l,v,ph,on,rows,opt,tag)=>'<div class="field"><label for="'+id+'">'+l+(opt?' <span class="muted">· optional</span>':'')+(tag?' <span class="tag18">'+tag+'</span>':'')+'</label>'+(rows?'<textarea class="inp" id="'+id+'" rows="'+rows+'" placeholder="'+esc(ph)+'" onchange="'+on+'">'+esc(v||'')+'</textarea>':'<input class="inp" id="'+id+'" value="'+esc(v||'')+'" placeholder="'+esc(ph)+'" onchange="'+on+'">')+'</div>';
  const sel=(id,l,v,opts,key)=>'<div class="field"><label for="'+id+'">'+l+'</label><select class="inp" id="'+id+'" onchange="setAg(\''+key+'\',this.value);agRefresh()"><option value="">Choose</option>'+opts.map(o=>'<option'+(v===o?' selected':'')+'>'+esc(o)+'</option>').join('')+'</select></div>';
  const steps='<nav class="ag18-steps" aria-label="Agency profile steps">'+AG18.map((t,i)=>{const d=ag18Done(t[0]);return '<button class="ag18-st'+(t[0]===tab?' on':'')+(d?' dn':'')+'" onclick="go(\'agency\',\''+t[0]+'\')"><span class="ag18-n">'+(d?ico('check'):i+1)+'</span><b>'+t[1]+'</b></button>'}).join('')+'</nav>';
  let body='';
  if(tab==='read'){const hasLib=libState().items.length;
    body='<div class="ag18-hd"><h2>Let Plato <span class="serif">read you.</span></h2><p>Share your website or drop in your credentials. Plato reads them and fills in the rest of your profile for you to check.</p></div>'+
      (AG18_BUSY?'<div class="ag18-read busy"><div class="ag18-scan"><i></i></div><ul id="ag18Feed" class="ag18-feed"></ul></div>':
      '<div class="ag18-read"><div class="ag18-web"><label for="ag18U">Your website</label><div class="ag18-row"><input class="inp" id="ag18U" value="'+esc(I.website||'')+'" placeholder="e.g. brightside.studio" onkeydown="if(event.key===\'Enter\')ag18Read()"><button class="btn btn-primary" onclick="ag18Read()">'+ico('sparkle')+'Read my website</button></div>'+(I.siteRead||I.read18?'<small class="ok18">'+ico('check')+'Read '+fmtDate(I.siteRead||I.read18)+'. Read it again any time.</small>':'')+'</div>'+
      '<div class="ag18-or"><span>and, or</span></div>'+dropZone('ag18Dz',true)+
      (hasLib?'<p class="small muted" style="margin:8px 0 0">'+hasLib+' file'+(hasLib===1?'':'s')+' read so far. <button class="link" onclick="go(\'agency\',\'voice\')">See them</button></p>':'')+'</div>')}
  if(tab==='who')body='<div class="ag18-hd"><h2>About <span class="serif">you.</span></h2><p>The basics, and who the outreach comes from.</p></div><div class="ag18-g">'+
    fld('agN','Agency name',S.setup.agency==='Your agency'?'':S.setup.agency,'e.g. Brightside Studio',"setAgency(this.value);agRefresh()")+fld('agW','Website',I.website,'e.g. brightside.studio',"setAg('website',this.value.trim());agRefresh()")+
    fld('agL','Where you are based',I.location,'e.g. Manchester',"setAg('location',this.value.trim());agRefresh()")+sel('agZ','Team size',I.size,TEAM_SIZES,'size')+
    '<div class="span2">'+fld('agS','The work you do',I.services,'e.g. Brand strategy, identity, campaigns and social',"setAg('services',this.value.trim());agRefresh()")+'</div>'+
    fld('agSn','Who sends the outreach',I.sender,'e.g. Sam Lee, Managing Partner',"setAg('sender',this.value.trim());agRefresh()")+fld('agSl','Their LinkedIn profile',I.senderLi,'linkedin.com/in/…',"setAg('senderLi',this.value.trim());agRefresh()",0,0,'For Amplify')+
    '<div class="span2">'+fld('agSe','The email the outreach comes from',I.senderEmail,'sam@brightside.studio',"setAg('senderEmail',this.value.trim());agRefresh()",0,0,'For Amplify')+'</div></div>';
  if(tab==='value')body='<div class="ag18-hd"><h2>Why <span class="serif">you.</span></h2><p>One or two lines each. Plato uses these in every gift and message.</p></div><div class="ag18-g">'+
    '<div class="span2">'+fld('agU','What you do best, in a sentence',O.uvp,'e.g. We find the one idea that makes a brand impossible to ignore',"setOffer('uvp',this.value);agRefresh()",2)+'</div>'+
    fld('agD','Why you, not another agency',O.different,'e.g. Half our team have sat in the client chair',"setOffer('different',this.value);agRefresh()",2)+
    fld('agP','Proof that it works',O.proof,'e.g. Grew Brand X online sales 40% in a year',"setOffer('proof',this.value);agRefresh()",2)+
    fld('agO','The first piece of work you would offer',O.solution,'e.g. A four week brand sprint with a clear plan at the end',"setOffer('solution',this.value);agRefresh()",2)+
    fld('agC','Clients you are proud of',I.clients,'e.g. Monzo, Gousto, Yorkshire Building Society',"setAg('clients',this.value.trim());agRefresh()",2)+'</div>';
  if(tab==='want')body='<div class="ag18-hd"><h2>Who you <span class="serif">want.</span></h2><p>Nora uses this to find and score brands for every campaign.</p></div><div class="ag18-want">'+wantForm().replace(/<p class="small muted"[^>]*>[\s\S]*?<\/p>/,'')+'</div>';
  if(tab==='voice'){const L=libState();body='<div class="ag18-hd"><h2>Your voice and <span class="serif">files.</span></h2><p>How you like to sound, and everything Plato has read about you.</p></div>'+
    '<div class="field"><label>How you like to sound</label><div class="chips">'+CMP.tone.map(t=>'<button class="chip'+((I.voice||S.compose.tone)===t[0]?' on':'')+'" onclick="S.compose.tone=\''+t[0]+'\';setAg(\'voice\',\''+t[0]+'\');go(\'agency\',\'voice\',true)">'+t[1]+' '+t[2]+'</button>').join('')+'</div>'+(I.voiceNote?'<p class="small muted" style="margin-top:8px">From your website: '+esc(I.voiceNote)+'</p>':'')+'</div>'+
    '<div class="ag18-files"><div class="row between"><b>Files Plato has read</b><span class="muted small">'+L.items.length+' in your library</span></div>'+
      (L.items.length?'<ul>'+L.items.slice(0,6).map(x=>'<li>'+ico(x.cat==='site'?'link':'file')+'<span class="grow">'+esc(x.name)+'</span><small>'+(x.words?x.words+' words':'')+'</small></li>').join('')+'</ul>':'<p class="small muted">Nothing yet. Add your credentials, case studies or a deck.</p>')+
      dropZone('ag18Dz2',true)+'</div>'}
  const prev=AG18[idx-1],next=AG18[idx+1];
  const amp=ag18Amp().filter(x=>!x[1]);
  const foot='<div class="ag18-foot">'+(prev?'<button class="btn btn-ghost" onclick="go(\'agency\',\''+prev[0]+'\')">'+ico('arrow','l')+'Back</button>':'<span></span>')+
    '<span class="ag18-saved">'+ico('check')+'Saved as you type</span>'+
    (next?'<button class="btn btn-primary" onclick="saveAgency();go(\'agency\',\''+next[0]+'\')">'+(tab==='read'?'Check my answers':'Next: '+next[1].toLowerCase())+ico('arrow','a')+'</button>':
      (ready?'<button class="btn btn-primary" onclick="saveAgency();showFits()">Show me brands that fit'+ico('arrow','a')+'</button>':'<button class="btn btn-primary" onclick="saveAgency();go(\'agency\',\''+(AG18.find(t=>!ag18Done(t[0]))||AG18[0])[0]+'\')">Finish the gaps'+ico('arrow','a')+'</button>'))+'</div>';
  return '<div class="ag18"><div class="ag18-top"><div><div class="sh-k">Agency profile</div><h1 class="ag18-t">Everything that makes <span class="serif">you, you.</span></h1></div>'+
    (amp.length&&tab!=='read'?'<button class="ag18-amp" onclick="go(\'agency\',\'who\')">'+ico('bolt')+'<span><b>Ready for Amplify?</b><small>Add '+esc(amp.map(x=>x[0]).join(' and '))+'</small></span></button>':'')+'</div>'+
    steps+'<div class="ag18-body"><section class="ag18-main card" data-step="'+tab+'">'+body+foot+'</section>'+ag18Char()+'</div></div>'};
VIEWS.agency_after=function(){try{initSegs()}catch(e){}if(AG18_BUSY)ag18Tick()};
/* every change re-draws in place: the character picks up the new feature */
wantPick=(function(){const _w=wantPick;return function(k,v,max){const P=wantProf();if(max){const a=P[k]||[];P[k]=a.includes(v)?a.filter(x=>x!==v):a.length>=max?a.slice(1).concat(v):a.concat(v)}else P[k]=v;
  P.discipline=(P.discs||[])[0]||'';P.problem=(P.problems||[])[0]||'';S.setup.profAw=1;save();syncSoon&&syncSoon();const y=$('.ag18-main')?$('.ag18-main').scrollTop:0;go('agency','want',true);const m=$('.ag18-main');if(m)m.scrollTop=y;refreshNav&&refreshNav()}})();
const _agRefresh18=agRefresh;agRefresh=function(){clearTimeout(agRefresh.t);agRefresh.t=setTimeout(()=>{if(VIEW!=='agency')return;const m=$('.ag18-main');const y=m?m.scrollTop:0;const f=document.activeElement&&document.activeElement.id;go('agency',VIEW_ARG,true);const m2=$('.ag18-main');if(m2)m2.scrollTop=y;if(f&&$('#'+f))$('#'+f).focus();refreshNav()},60)};
/* initials skip filler words: "Northgate and Co" -> NC */
initials=function(n){const w=String(n||'?').replace(/\(.*?\)/g,'').split(/[\s&]+/).filter(x=>x&&!/^(and|the|of|&)$/i.test(x));return (w.slice(0,2).map(x=>x[0]).join('')||'?').toUpperCase()};
ag18Amp=function(){const I=agInfo();return[['the sender’s LinkedIn',!!I.senderLi],['the email outreach comes from',!!I.senderEmail]]};
