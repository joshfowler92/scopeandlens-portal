/* ═══════════ AGENCY PROFILE: who you are, why you, your assets, who you want ═══════════
   One place for everything the platform needs to know. It feeds who we suggest, what you give, and every message. */
let AG_GUIDE=false;
const AG_TABS=[['who','Who you are','user'],['value','Why you','star'],['assets','Your assets','upload'],['want','Who you want','target']];
function agInfo(){S.setup.agencyInfo=S.setup.agencyInfo||{};return S.setup.agencyInfo}
function agChecks(){const I=agInfo(),O=S.setup.offer;return[
  ['Agency name',!!(S.setup.agency&&S.setup.agency!=='Your agency'),'who'],['Website',!!I.website,'who'],['What you do best',!!O.uvp,'who'],
  ['Why you, not them',!!O.different,'value'],['Proof it works',!!O.proof||libProofs().length>0,'value'],['What you would offer first',!!O.solution,'value'],['Clients you are proud of',!!I.clients,'value'],
  ['Credentials, case studies or decks',libState().items.length>0,'assets'],['Who you want to work with',profDone(),'want']]}
function agPct(){const C=agChecks();return Math.round(C.filter(x=>x[1]).length/C.length*100)}
function setAg(k,v){const I=agInfo();if(I[k]===v)return;I[k]=v;save()}
function setAgency(v){v=v.trim();if(!v||v===S.setup.agency)return;act('Renamed your agency',()=>{S.setup.agency=v},{refresh:false,quiet:true});renderShell();go(VIEW,VIEW_ARG,true)}
VIEWS.agency=(tab)=>{tab=AG_TABS.some(t=>t[0]===tab)?tab:'who';const I=agInfo(),O=S.setup.offer;const pct=agPct();const C=agChecks();const ti=AG_TABS.findIndex(t=>t[0]===tab);
  const fld=(id,l,v,ph,on,rows,hint)=>'<div class="field"><label for="'+id+'">'+l+(hint?' <span class="muted">· '+hint+'</span>':'')+'</label>'+(rows?'<textarea class="inp" id="'+id+'" rows="'+rows+'" placeholder="'+esc(ph)+'" onchange="'+on+'">'+esc(v||'')+'</textarea>':'<input class="inp" id="'+id+'" value="'+esc(v||'')+'" placeholder="'+esc(ph)+'" onchange="'+on+'">')+'</div>';
  const guide=AG_GUIDE?'<div class="agguide"><b>Step '+(ti+1)+' of 4</b><span>Set up your agency profile. It takes five minutes and makes everything else smarter.</span><i><em style="width:'+((ti+1)*25)+'%"></em></i></div>':'';
  const nav='<div class="agnext">'+(ti?'<button class="btn btn-ghost" onclick="go(\'agency\',\''+AG_TABS[ti-1][0]+'\')">Back</button>':'<span></span>')+(ti<3?'<button class="btn btn-primary" onclick="go(\'agency\',\''+AG_TABS[ti+1][0]+'\')">Next: '+AG_TABS[ti+1][1].toLowerCase()+ico('arrow','a')+'</button>':'')+'</div>';
  let body='';
  if(tab==='who')body='<div class="agg"><div class="card">'+fld('agN','Agency name',S.setup.agency,'e.g. Brightside Studio',"setAgency(this.value)")+fld('agW','Website',I.website,'e.g. brightside.studio',"setAg('website',this.value.trim())")+
  '<div class="field"><label>Your logo</label><div class="row" style="gap:10px;align-items:center">'+(S.brand.logo?'<img class="aglogo" src="'+S.brand.logo+'" alt="Your logo">':'')+'<label class="btn btn-line btn-sm">'+ico('upload')+(S.brand.logo?'Replace':'Upload your logo')+'<input type="file" accept="image/*" hidden onchange="loadLogo(this.files[0],()=>refresh())"></label>'+(S.brand.logo?'<button class="btn btn-ghost btn-sm" onclick="removeLogo()">'+ico('trash')+'Remove logo</button>':'')+'</div></div>'+
      fld('agL','Where you are based',I.location,'e.g. Manchester, with a team in London',"setAg('location',this.value.trim())")+fld('agF','Founded',I.founded,'e.g. 2014',"setAg('founded',this.value.trim())")+'</div>'+
    '<div class="card">'+fld('agU','What you do best, in a sentence',O.uvp,'e.g. We find the one idea that makes a brand impossible to ignore',"setOffer('uvp',this.value)",3,'used in every message')+
      fld('agS','The work you do',I.services,'e.g. Brand strategy, identity, campaigns and social',"setAg('services',this.value.trim())",2)+
      fld('agT','Who is on the team',I.team,'e.g. 24 people. Two founders who ran agencies at Dentsu and VCCP',"setAg('team',this.value.trim())",2)+'</div></div>';
  if(tab==='value')body='<div class="agg"><div class="card">'+fld('agD','Why you, and not another agency',O.different,'e.g. Half our team have sat in the client chair',"setOffer('different',this.value)",3)+
      fld('agP','Proof that it works',O.proof,'e.g. Grew Brand X online sales 40% in a year',"setOffer('proof',this.value)",3,libProofs().length?libProofs().length+' more from your assets':'the more specific the better')+
      fld('agO','The first piece of work you would offer',O.solution,'e.g. A four week brand sprint with a clear plan at the end',"setOffer('solution',this.value)",2)+'</div>'+
    '<div class="card">'+fld('agC','Clients you are proud of',I.clients,'e.g. Monzo, Gousto, Yorkshire Building Society',"setAg('clients',this.value.trim())",2)+fld('agA','Awards and recognition',I.awards,'e.g. Campaign Agency of the Year, shortlisted 2025',"setAg('awards',this.value.trim())",2)+
      fld('agG','What you would happily send a prospect',I.sendables,'e.g. Our category teardown, a 20 minute workshop, our benchmark report',"setAg('sendables',this.value.trim())",2)+
      '<div class="field"><label>How you like to sound</label><div class="chips">'+CMP.tone.map(t=>'<button class="chip'+(S.compose.tone===t[0]?' on':'')+'" onclick="S.compose.tone=\''+t[0]+'\';setAg(\'voice\',\''+t[0]+'\');go(\'agency\',\'value\',true)">'+t[1]+' '+t[2]+'</button>').join('')+'</div></div>'+
      fld('agX','Anything else a sales conversation should know',I.notes,'e.g. We do not do pitches without a fee. We love challenger brands.',"setAg('notes',this.value.trim())",2)+'</div></div>';
  if(tab==='assets')body='<div class="aglib">'+VIEWS.library()+'</div>';
  if(tab==='want')body='<div class="agwant">'+profileForm()+'</div>';
  return '<div class="sh"><div class="sh-l"><div class="sh-k">Agency profile · the brain behind Plato</div><h1 class="sh-t">Everything that makes <span class="serif">you, you.</span></h1><p class="sh-p">Who you are, why clients choose you, the assets you can share and who you want to win. It feeds the brands we suggest, what you give and every message you send.</p></div>'+
    '<div class="sh-a"><div class="agpct">'+fitRing(pct,1)+'<span><b>'+pct+'% complete</b><small>'+(C.filter(x=>!x[1]).length?'Next: '+esc(C.find(x=>!x[1])[0].toLowerCase()):'Looking great')+'</small></span></div></div></div>'+guide+
   '<div class="agfeeds">'+[['target','Who to target','Your sectors, size and the problems you fix pick the brands'],['gift','What to share','Your assets become gifts, and your proof shapes the ideas'],['chat','Every message','Your words, proof, clients and tone go into every draft']].map(x=>'<div>'+ico(x[0])+'<span><b>'+x[1]+'</b><small>'+x[2]+'</small></span></div>').join('')+'</div>'+
   pills(AG_TABS.map(t=>[t[0],t[1],C.filter(x=>x[2]===t[0]).every(x=>x[1])?'✓':'']),tab,"go('agency',$)")+body+(tab!=='want'?nav:'')};
VIEWS.agency_after=()=>{initSegs()};
