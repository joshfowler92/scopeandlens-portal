/* ═══════════ v12 AGENCY PROFILE: three areas, finished before any campaign starts ═══════════
   Who you are, Why you, Your assets. Each is a tile that turns dark blue when it is done.
   Who you want to win lives in Who to target only. */
const AG12=[['who','Who you are','user','Your agency in your own words: what you do, where, who sends the outreach.'],['value','Why you','star','Why clients pick you, the proof, and the first piece of work you would offer.'],['assets','Your assets','upload','Credentials, case studies, decks. We read them and use them in every message.']];
const TEAM_SIZES=['1 to 10','11 to 25','26 to 50','51 to 100','101 to 250','More than 250'];
const ENGAGE=[['project','Projects'],['retainer','Retainers'],['both','Both']];
const FIRST_SIZE=['Under £10k','£10k to £25k','£25k to £50k','£50k to £100k','£100k to £250k','More than £250k'];
function agReq(){const I=agInfo(),O=S.setup.offer;return[
  ['who','Agency name',!!(S.setup.agency&&S.setup.agency!=='Your agency')],['who','Website',!!I.website],['who','Where you are based',!!I.location],['who','Team size',!!I.size],
  ['who','What you do best',!!(O.uvp||'').trim()],['who','The work you do',!!I.services],['who','Who sends the outreach',!!I.sender],
  ['value','Why you, and not another agency',!!(O.different||'').trim()],['value','Proof that it works',!!(O.proof||'').trim()||libProofs().length>0],['value','The first piece of work you would offer',!!(O.solution||'').trim()],['value','Clients you are proud of',!!I.clients],
  ['assets','At least one asset in your library',libState().items.length>0]]}
agChecks=function(){return agReq().map(x=>[x[1],x[2],x[0]])};
agPct=function(){const C=agReq();return Math.round(C.filter(x=>x[2]).length/C.length*100)};
function areaDone(k){return agReq().filter(x=>x[0]===k).every(x=>x[2])}
function profReady(){if(DEMO_MODE)return true;return agReq().every(x=>x[2])}
function ringPct(p,sz){sz=sz||64;const r=sz/2-5,c=2*Math.PI*r;return '<span class="ring12" style="width:'+sz+'px;height:'+sz+'px"><svg viewBox="0 0 '+sz+' '+sz+'" aria-hidden="true"><circle cx="'+sz/2+'" cy="'+sz/2+'" r="'+r+'" class="rg-t"/><circle cx="'+sz/2+'" cy="'+sz/2+'" r="'+r+'" class="rg-v" stroke-dasharray="'+(c*p/100).toFixed(1)+' '+c.toFixed(1)+'" transform="rotate(-90 '+sz/2+' '+sz/2+')"/></svg><b>'+p+'<small>%</small></b></span>'}
let AG_SAVED=0;
VIEWS.agency=(tab)=>{tab=AG12.some(t=>t[0]===tab)?tab:(AG12.find(t=>!areaDone(t[0]))||AG12[0])[0];const I=agInfo(),O=S.setup.offer;const pct=agPct();const R=agReq();const left=R.filter(x=>!x[2]);const ready=!left.length;
  const fld=(id,l,v,ph,on,rows,req)=>'<div class="field"><label for="'+id+'">'+l+(req?'':' <span class="muted">· optional</span>')+'</label>'+(rows?'<textarea class="inp" id="'+id+'" rows="'+rows+'" placeholder="'+esc(ph)+'" onchange="'+on+'">'+esc(v||'')+'</textarea>':'<input class="inp" id="'+id+'" value="'+esc(v||'')+'" placeholder="'+esc(ph)+'" onchange="'+on+'">')+'</div>';
  const sel=(id,l,v,opts,key,req)=>'<div class="field"><label for="'+id+'">'+l+(req?'':' <span class="muted">· optional</span>')+'</label><select class="inp" id="'+id+'" onchange="setAg(\''+key+'\',this.value);agRefresh()"><option value="">Choose</option>'+opts.map(o=>{const k=Array.isArray(o)?o[0]:o,lb=Array.isArray(o)?o[1]:o;return '<option value="'+esc(k)+'"'+(v===k?' selected':'')+'>'+esc(lb)+'</option>'}).join('')+'</select></div>';
  const tiles='<div class="agtiles" role="tablist">'+AG12.map(t=>{const done=areaDone(t[0]);const n=R.filter(x=>x[0]===t[0]);const got=n.filter(x=>x[2]).length;
    return '<button class="agt'+(done?' done':'')+(t[0]===tab?' on':'')+'" role="tab" aria-selected="'+(t[0]===tab)+'" onclick="go(\'agency\',\''+t[0]+'\')">'+ico(done?'check':t[2])+'<span><b>'+t[1]+'</b><small>'+(done?'Done. Tap to edit.':esc(t[3]))+'</small><em>'+(done?'Complete':got+' of '+n.length+' done')+'</em></span></button>'}).join('')+'</div>';
  let body='';
  if(tab==='who')body='<div class="agg"><div class="card">'+fld('agN','Agency name',S.setup.agency==='Your agency'?'':S.setup.agency,'e.g. Brightside Studio',"setAgency(this.value);agRefresh()",0,1)+fld('agW','Website',I.website,'e.g. brightside.studio',"setAg('website',this.value.trim());agRefresh()",0,1)+
      '<div class="grid2">'+fld('agL','Where you are based',I.location,'e.g. Manchester',"setAg('location',this.value.trim());agRefresh()",0,1)+fld('agF','Founded',I.founded,'e.g. 2014',"setAg('founded',this.value.trim())")+'</div>'+
      '<div class="grid2">'+sel('agZ','Team size',I.size,TEAM_SIZES,'size',1)+sel('agE','How you like to work',I.engage,ENGAGE,'engage')+'</div>'+
      fld('agSn','Who sends the outreach',I.sender,'e.g. Sam Lee, Managing Partner',"setAg('sender',this.value.trim());agRefresh()",0,1)+
      '<div class="field"><label>How you like to sound</label><div class="chips">'+CMP.tone.map(t=>'<button class="chip'+(S.compose.tone===t[0]?' on':'')+'" onclick="S.compose.tone=\''+t[0]+'\';setAg(\'voice\',\''+t[0]+'\');go(\'agency\',\'who\',true)">'+t[1]+' '+t[2]+'</button>').join('')+'</div></div></div>'+
    '<div class="card">'+fld('agU','What you do best, in a sentence',O.uvp,'e.g. We find the one idea that makes a brand impossible to ignore',"setOffer('uvp',this.value);agRefresh()",3,1)+
      fld('agS','The work you do',I.services,'e.g. Brand strategy, identity, campaigns and social',"setAg('services',this.value.trim());agRefresh()",2,1)+
      fld('agX2','Sectors you know best',I.knowSectors,'e.g. Financial services, retail and travel',"setAg('knowSectors',this.value.trim())",2)+
      fld('agT','Who is on the team',I.team,'e.g. Two founders who ran agencies at Dentsu and VCCP',"setAg('team',this.value.trim())",2)+
      sel('agFs','A typical first project',I.firstSize,FIRST_SIZE,'firstSize')+
      fld('agPv','A belief about your industry you would stand behind',I.pov,'e.g. Most brands are invisible because they play it safe',"setAg('pov',this.value.trim())",2)+'</div></div>';
  if(tab==='value')body='<div class="agg"><div class="card">'+fld('agD','Why you, and not another agency',O.different,'e.g. Half our team have sat in the client chair',"setOffer('different',this.value);agRefresh()",3,1)+
      fld('agP','Proof that it works',O.proof,'e.g. Grew Brand X online sales 40% in a year',"setOffer('proof',this.value);agRefresh()",3,1)+(libProofs().length?'<p class="tiny muted" style="margin:-6px 0 12px">Plus '+libProofs().length+' proof point'+(libProofs().length===1?'':'s')+' from your assets.</p>':'')+
      fld('agO','The first piece of work you would offer',O.solution,'e.g. A four week brand sprint with a clear plan at the end',"setOffer('solution',this.value);agRefresh()",2,1)+'</div>'+
    '<div class="card">'+fld('agC','Clients you are proud of',I.clients,'e.g. Monzo, Gousto, Yorkshire Building Society',"setAg('clients',this.value.trim());agRefresh()",2,1)+fld('agA','Awards and recognition',I.awards,'e.g. Shortlisted, Campaign Agency of the Year 2025',"setAg('awards',this.value.trim())",2)+
      fld('agG','What you would happily send a prospect',I.sendables,'e.g. Our category teardown, a 20 minute workshop, our benchmark report',"setAg('sendables',this.value.trim())",2)+
      fld('agX','Anything else a sales conversation should know',I.notes,'e.g. We love challenger brands. We do not pitch without a fee.',"setAg('notes',this.value.trim())",2)+'</div></div>';
  if(tab==='assets')body='<div class="aglib">'+VIEWS.library()+'</div>';
  const nextArea=AG12.find(t=>!areaDone(t[0])&&t[0]!==tab);
  const foot='<div class="agsave"><div class="grow">'+(ready?'<b>Your agency profile is complete.</b><span class="muted small">Change anything, any time. Every campaign picks it up.</span>':'<b>'+left.length+' thing'+(left.length===1?'':'s')+' left</b><span class="muted small">'+esc(left.slice(0,3).map(x=>x[1]).join(', '))+(left.length>3?' and more':'')+'</span>')+'</div>'+
    '<button class="btn btn-line" onclick="saveAgency()">'+ico('check')+'Save agency profile</button>'+
    (ready?'<button class="btn btn-primary" onclick="showFits()">Show me brands that fit'+ico('arrow','a')+'</button>':nextArea?'<button class="btn btn-primary" onclick="go(\'agency\',\''+nextArea[0]+'\')">Next: '+nextArea[1].toLowerCase()+ico('arrow','a')+'</button>':'<button class="btn btn-primary" disabled title="Finish your agency profile first">Show me brands that fit'+ico('arrow','a')+'</button>')+'</div>';
  return '<div class="sh"><div class="sh-l"><div class="sh-k">Agency profile</div><h1 class="sh-t">Everything that makes <span class="serif">you, you.</span></h1><p class="sh-p">Finish these three before your first campaign. They shape the brands we suggest, what you give and every message you send.</p></div>'+
    '<div class="sh-a"><div class="agpct">'+ringPct(pct,64)+'<span><b>'+(ready?'Complete':pct+'% complete')+'</b><small>'+(ready?'Ready to build campaigns':'Next: '+esc(left[0][1].toLowerCase()))+'</small></span></div></div></div>'+
   '<div class="agfeeds">'+[['target','Who to target','Your sectors, size and the problems you fix pick the brands'],['gift','What to share','Your assets become gifts, and your proof shapes the ideas'],['chat','Every message','Your words, proof, clients and tone go into every draft']].map(x=>'<div>'+ico(x[0])+'<span><b>'+x[1]+'</b><small>'+x[2]+'</small></span></div>').join('')+'</div>'+
   tiles+body+foot};
VIEWS.agency_after=()=>{initSegs()};
function agRefresh(){clearTimeout(agRefresh.t);agRefresh.t=setTimeout(()=>{if(VIEW!=='agency')return;const y=$('#view').scrollTop;const f=document.activeElement&&document.activeElement.id;go('agency',VIEW_ARG,true);$('#view').scrollTop=y;if(f&&$('#'+f))$('#'+f).focus();refreshNav()},60)}
function saveAgency(){save();syncNow&&syncNow();const left=agReq().filter(x=>!x[2]);AG_SAVED=Date.now();toast(left.length?'Saved. '+left.length+' thing'+(left.length===1?'':'s')+' left before your first campaign.':'Saved. Your agency profile is complete.');refreshNav();if(!left.length)award&&award('profile','Agency profile complete')}
function showFits(){if(!profReady()){toast('Finish your agency profile first');return}if(!S.campaigns.some(c=>!isBlankCamp(c)||c.touched)){newCampaignFlow();return}go('prospects')}
const syncNow=typeof window.syncPush==='function'?()=>window.syncPush():()=>{};

/* the gate: no campaign is created or opened until the profile is done */
function profGate(where){return '<div class="gate12">'+platoFace(64)+'<div class="grow"><div class="sh-k">Before you build</div><h2>First, tell me about <span class="serif">your agency.</span></h2><p>Every brand I suggest, every gift and every message comes from your agency profile. It takes about ten minutes, and you only do it once.</p>'+
  '<div class="gate-r">'+AG12.map(t=>'<span class="'+(areaDone(t[0])?'ok':'')+'">'+ico(areaDone(t[0])?'check':t[2])+t[1]+'</span>').join('')+'</div>'+
  '<button class="btn btn-primary" onclick="go(\'agency\')">'+(agPct()?'Finish my agency profile':'Start my agency profile')+ico('arrow','a')+'</button></div></div>'}
function noCampYet(){return '<div class="gate12">'+platoFace(64)+'<div class="grow"><div class="sh-k">Your agency profile is done</div><h2>Now, your <span class="serif">first campaign.</span></h2><p>A campaign is one problem you solve, for a short list of brands, with something useful to give them. Name it and I will walk you through the four steps.</p><button class="btn btn-primary" onclick="newCampaignFlow()">'+ico('plus')+'Start a campaign</button></div></div>'}
