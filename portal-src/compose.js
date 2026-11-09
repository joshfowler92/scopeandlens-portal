/* ═══════════ COMPOSER: write every message your way ═══════════
   Tone, length, what you lead with, what goes in, a smidge of humour and the sign off. Everything is editable after. */
const CMP={
  tone:[['warm','😊','Warm'],['direct','🎯','Direct'],['playful','😄','Playful'],['formal','🎩','Formal'],['bold','⚡','Bold']],
  len:[['short','Short'],['medium','Medium'],['long','Detailed']],
  angle:[['give','🎁','A gift'],['news','📰','Their news'],['insight','💡','An insight'],['question','❓','A question'],['proof','🏆','Proof'],['peer','👥','What peers do']],
  inc:[['news','Their news'],['proof','Your proof'],['case','A case study'],['offer','Your offer'],['ps','A P.S.']],
  cta:[['soft','🙂','Offer to send'],['chat','☕','A chat'],['call','📞','A call'],['none','🙌','No ask']],
  sign:['Cheers','Best','Thanks','Speak soon','All the best','Warm wishes','none']};
function purposeOf(s){if(!s)return 'give';if(s.task)return 'task';if(s.nonote)return 'connect';if(s.accept)return 'thanks';if(s.ch==='workshop')return 'workshop';if(s.warm)return 'call';const t=(s.t||'').toLowerCase();if(/linkedin style/.test(t))return 'ligive';
  if(s.ch==='phone')return 'call';if(s.ch==='event')return 'invite';if(s.ch==='social')return 'post';if(s.ch==='mail')return 'print';
  if(s.ch==='linkedin'&&s.w<=1)return 'connect';if(/proof/.test(t))return 'proof';if(/check in/.test(t))return 'checkin';if(/next year/.test(t))return 'idea';if(/second|give|value/.test(t))return 'give';return 'follow'}
const PURPOSE_L={thanks:'Thanks for connecting',workshop:'Workshop offer',ligive:'Same value, LinkedIn style',connect:'Connection request',give:'Giving it to them',follow:'Follow up',proof:'Sharing proof',checkin:'Check in',idea:'An idea',invite:'Invitation',print:'Handwritten note',call:'Call notes',post:'Public post',task:'A light action'};
/* something light and human for when they accept: the season, the week, the weather */
function smallTalk(seed){const d=new Date();const m=d.getMonth(),w=d.getDay();const M=[
  ['Hope the new year has started kindly.','Hope January is being gentle with you.'],['Nearly through February, which feels like a win in itself.','Hope February is treating you well.'],
  ['Spring seems to be on its way, slowly. Hope the week is going well.','Hope the week is going well, and the clocks going forward has not stolen too much sleep.'],['Hope you are getting some of the April sunshine between the showers.','Hope the week is being kind.'],
  ['Hope you are making the most of the longer evenings.','Hope May is being good to you.'],['Hope you are getting some of the sunshine, wherever you are.','Hope the summer is shaping up well.'],
  ['Hope you are getting a bit of summer in, between everything else.','Hope the week is being kind, and the sun is out where you are.'],['Hope you are managing a break at some point this summer.','Hope August is a little quieter than the rest of the year.'],
  ['Hope the back-to-school energy is treating you well.','Hope September has not been too much of a sprint.'],['Hope the week is going well, and the clocks going back has not thrown you.','Hope October is being kind.'],
  ['Hope the week is going well, and that you are surviving the dark evenings.','Hope November is not too much of a slog.'],['Hope the run up to Christmas is not too manic.','Hope December is being kind, and the diary is clearing a little.']][m];
  if(w===5)return 'Happy Friday. '+M[seed%2];if(w===1)return M[seed%2]+' And that the Monday is not too Monday-ish.';return M[seed%2]}
function lcf(t){t=String(t||'').replace(/\.$/,'');return /^(We|Our|I|It|This|They|The|A|An)\b/.test(t)?t.charAt(0).toLowerCase()+t.slice(1):t}
function hsh(s){let h=0;for(const c of String(s))h=(h*33+c.charCodeAt(0))>>>0;return h}
function newsHook(n,tone){if(!n)return '';const T={
  pitch:['I saw {brand} is looking at agencies.','Heard {brand} is reviewing its agencies.'],
  agency:['Saw the news about the new agency at {brand}. Exciting time.','Congratulations on the new agency appointment.'],
  leadership:['Congratulations on the new appointment at {brand}.','Saw the leadership news at {brand}.'],
  brand:['Really enjoyed the latest work from {brand}.','Loved the new campaign.'],
  launch:['Loved the new launch.','Great to see the launch land.'],
  results:['Read the latest numbers from {brand}, and one line jumped out.','Saw the latest trading update. One line stood out.'],
  expansion:['Great to see {brand} growing into new places.','Congratulations on the expansion.'],
  deal:['Big moment for {brand} with the deal.','Saw the deal news. Big year.'],
  restructure:['I know it has been a busy year at {brand}.','Sounds like a big year of change at {brand}.'],
  digital:['Interesting to see the digital push at {brand}.','Saw what {brand} is building online.'],
  sustainability:['Great to see the commitment at {brand}.','Good to see the sustainability work.'],
  regulation:['Lots changing in your world right now.','Plenty of change landing on {brand} this year.']}[n.type];
  if(!T)return '';return T[tone==='direct'||tone==='bold'?1:0]}
function composeMsg(s,a,p,c,o){o=Object.assign({},S.compose,o||{});const P=purposeOf(s);const O=S.setup.offer;const D=mainDisc();
  const tool=(s&&s.w>=6&&c.assets[1]?toolById(c.assets[1]):toolById(c.assets[0]))||toolsFor()[0];const n=a.news;
  const first=(p&&p.name||'').split(' ')[0]||'there';const seed=(o.seed||0)+hsh((a.name||'')+(p&&p.name||'')+(s&&s.id||''));const pick=arr=>arr[seed%arr.length];
  const tone=o.tone,funny=o.humour&&tone!=='formal',L=o.len,inc=k=>o.inc.includes(k);
  const V={first,brand:a.name||'[brand]',asset:tool.lib?'our '+tool.n:tool.n.replace(/^The /,'the '),sector:secLabel(a.sk||S.setup.profile.sectors[0]||'retail').toLowerCase(),prob:PROB().short,cap:D.cap,proof:proofFor(a),offer:(O.solution||'').replace(/\.$/,''),uvp:(O.uvp||'').replace(/\.$/,''),me:(S.setup.you||'').split(' ')[0]};
  const fill=t=>String(t).replace(/\{(\w+)\}/g,(m,k)=>V[k]!=null?V[k]:m);
  if(P==='task'){const L2=STEP_LIB[s.lib];return{subject:'',body:fill(L2?L2.m[0]:s.t),task:1}}
  const greet=s&&s.ch==='linkedin'?{warm:'Hi {first},',direct:'{first},',playful:'Hi {first},',formal:'Hello {first},',bold:'{first},'}[tone]:{warm:'Hi {first},',direct:'{first},',playful:'Hi {first},',formal:'Dear {first},',bold:'{first},'}[tone];
  /* the hook: what you lead with */
  const hooks={
    news:n&&inc('news')?newsHook(n,tone):'',
    give:tool.lib?pick(['I have something that might be useful for {brand}.','Something from our files felt very relevant to {brand}.']):pick(['We made something with {brand} in mind.','I put something together for {brand}.','We have been thinking about {brand}, so we made you something.']),
    insight:pick(['One thing keeps coming up with {sector} brands right now: {prob}.','Most {sector} brands we look at have the same blind spot: {prob}.']),
    question:pick(['Quick question: how is {brand} thinking about {prob} this year?','Curious: is {prob} on the list at {brand} this year?']),
    proof:V.proof?'We have just '+V.proof.charAt(0).toLowerCase()+V.proof.slice(1)+'.':'We have been getting good results on {prob} lately.',
    peer:pick(['I have been talking to a lot of {sector} marketing leaders lately, and {prob} comes up every time.','The {sector} marketers we speak to all seem to be wrestling with {prob}.'])};
  let hook=hooks[o.angle]||'';if(!hook)hook=n&&inc('news')?newsHook(n,tone):hooks.insight;
  if(tone==='bold'&&o.angle!=='question')hook=pick(['{brand} could own {prob}. Here is how we would start.','There is a gap at {brand} nobody is talking about: {prob}.']);
  const newsLine=(inc('news')&&n&&o.angle!=='news'&&tone!=='bold')?newsHook(n,tone):'';
  /* the core: what this touchpoint is for */
  const core={
    connect:pick(['I work with {sector} brands on {cap}, and {brand} keeps cropping up in my reading.','I spend my days on {cap} for {sector} brands, and {brand} is one I keep an eye on.']),
    give:tool.lib?pick(['Thought {asset} might be useful. It is close to what {brand} is working on.','I am sharing {asset}, because it is close to where {brand} is right now.']):o.angle==='give'?pick(['We made {asset} with {brand} in mind, built around {prob}.','I put together {asset} for {brand}. It is all about {prob}.']):pick(['So we put together {asset} for {brand}.','Which is why we made {asset} for {brand}.']),
    follow:pick(['One thing in {asset} stood out for {brand}: [add your one line].','The bit of {asset} I would look at first is [add it]. It takes two minutes.']),
    proof:V.proof?pick(['Thought this might be useful: {proof}.','A quick one we are proud of: {proof}. Felt relevant to {brand}.']):'Thought a recent result might be useful. [Add a result you are proud of.]',
    checkin:pick(['How is the quarter shaping up at {brand}?','Hope the quarter has been kind to {brand}.']),
    idea:pick(['I have one idea for next year at {brand} that I think is worth a look.','We have been sketching what a great next year could look like for {brand}.']),
    invite:pick(['We are getting a small group of {sector} marketing leaders round a table for breakfast. No pitches, one useful topic.','Small breakfast, eight {sector} marketers, one proper conversation about {prob}.']),
    print:pick(['A printed copy of {asset}, for your desk.','{asset}, in print.']),
    call:'',post:''}[P]||'';
  const joke={connect:'No pitch, I promise. I left it at home.',give:'No strings, and no follow-up call ambush.',follow:'Or not at all, your call.',proof:'Not a hint. Well, maybe a small one.',checkin:'Here if you need a sounding board, or just a moan.',idea:'I will bring the biscuits.',invite:'Decent coffee guaranteed, wisdom likely.',print:'For your desk, or your bin. No hard feelings.'}[P];
  const playful={connect:'I promise I am more interesting than my connection request.',give:'It is free, it is short, and it does not come with a 47 slide deck.',follow:'Think of this as the director’s cut.',checkin:'No agenda, just nosiness.',idea:'It is a good one. I checked twice.',invite:'There will be pastries. That is a promise, not a pitch.'}[P];
  const ctaT={soft:{give:tool.lib?'Want the full version?':'Shall I send it over?',connect:'Would be good to be connected.',follow:'Happy to talk it through, if useful.',invite:'Fancy it?',idea:'Worth a look?',def:'Happy to share if useful.'},
    chat:{formal:'Would you be open to a short conversation?',def:'Worth a quick chat?'},call:{formal:'Would you have fifteen minutes next week?',def:'Free for fifteen minutes next week?'},none:{def:'No need to reply. It is yours either way.'}}[o.cta]||{};
  let cta=ctaT[P]||ctaT[tone]||ctaT.def||'';if(P==='connect'&&o.cta!=='none')cta=tone==='formal'?'I would be glad to connect.':'Would be good to be connected.';
  const cap=t=>t?t.charAt(0).toUpperCase()+t.slice(1):t;const parts=[];const add=t=>{if(t)parts.push(cap(fill(t)))};
  /* connection request: no note, unless you have genuinely met or share something real */
  if(P==='connect'&&s&&s.nonote){const met=String(p&&p.met||'').trim().replace(/\.$/,'');if(!met)return{subject:'',body:'',nonote:1};
    const lead=/^(at|in|on|through|via|after|over)\b/i.test(met)?pick(['Good to meet you '+met+'.','Lovely to meet you '+met+'.']):cap(met)+', so it felt right to connect.';
    return{subject:'',body:fill(greet+' '+lead+' '+(tone==='formal'?'I would be glad to stay in touch.':'Would be great to stay in touch.')),note:1}}
  /* they accepted: a relaxed thanks and something light and human. No pitch. */
  if(P==='thanks'){const b=[pick(['Thanks for connecting.','Thanks for accepting, good to be connected.','Good to be connected, thanks for accepting.'])];
    b.push(n&&inc('news')?newsHook(n,'warm'):smallTalk(seed));
    if(funny)b.push(pick(['No pitch incoming, I promise.','That is it. No sales pitch hiding at the bottom.','Anyway, I will let you get on.']));
    if(L==='long')b.push(pick(['If {prob} is ever on the radar at {brand}, I have something useful on it. No rush at all.','I spend most of my time on {prob} for {sector} brands, so if that is ever useful, shout.']));
    return{subject:'',body:fill(greet+'\n\n'+b.join(' '))}}
  /* the same gift, restyled for LinkedIn: shorter, chattier, still useful */
  if(P==='ligive'){const b=[pick(['In case LinkedIn is easier than email: we put together {asset}, built around {prob}.','The short version of what I emailed over: {asset}, all about {prob}, with {brand} in mind.'])];
    b.push(pick(['The bit I would read first: [add the one line that matters most to them].','Two minutes, and the second page is the useful one.']));
    if(funny)b.push(pick(['Shorter than the email. I have been practising.','Same value, fewer paragraphs.']));
    b.push(o.cta==='none'?'No need to reply. It is yours either way.':'Happy to send it over here if that is easier.');
    return{subject:'',body:fill(greet+' '+b.join(' '))}}
  /* the end point of every campaign: a free workshop, in person if you can */
  if(P==='workshop'){add(greet);const b=[];b.push(pick(['Over the last few weeks I have shared a few things on {prob}. If any of it struck a chord, we would love to run a free workshop with you and the team at {brand}.','We have been sharing bits on {prob} for a while now. The next step, if useful, is a free workshop for you and the team at {brand}.']));
    b.push(L==='short'?'Your challenges, our people, a whiteboard. You leave with a plan.':'Ninety minutes, in person if we can. Your challenges, our people, a whiteboard and decent coffee. You leave with a plan, whether or not we ever work together.');
    if(V.proof&&L==='long')b.push('For context, we recently '+lcf(V.proof)+'.');if(funny)b.push(pick(['Biscuits are on us.','We bring the pens. You bring the problems.']));
    b.push(o.cta==='none'?'The offer stands whenever it is useful.':'Shall I suggest a couple of dates?');
    let txt=parts[0]+'\n\n'+(s.ch==='linkedin'?b.map(x=>fill(x)).join(' '):b.map(x=>fill(x)).join('\n\n'));if(o.sign!=='none')txt+='\n\n'+o.sign+(V.me?',\n'+V.me:'');
    return{subject:fill(pick(['A free workshop for {brand}?','A free workshop on {prob}?'])).replace(/^./,x=>x.toUpperCase()),body:txt}}
  /* warm only: a check-in from a connection, never a cold pitch */
  if(P==='call'&&s&&s.warm){const g=(a.signals||[]).slice().sort((x,y)=>String(y.date).localeCompare(String(x.date)))[0];const what=g?({open:'opened your email',click:'clicked through to '+V.asset,reply:'replied',li_reply:'replied on LinkedIn',accept:'accepted your request',download:'downloaded '+V.asset,meeting:'met you',value_sent:'had '+V.asset+' from you'}[g.type]||'engaged with you'):'engaged with what you sent';
    const ag=S.setup.agency||'[your agency]';const lines=['Why now: '+first+' '+what+(g&&g.date?' '+rel(g.date):'')+'. This is a warm check-in, not a pitch.',
      'Open: “Hi '+first+', it is '+(V.me?V.me.split(' ')[0]:'[your name]')+' from '+ag+'. We are connected on LinkedIn and I sent over '+V.asset+'. Have you got two minutes?”',
      'Ask: “Was it useful? Do you want a hand with the tool, or anything else?” Then listen.',
      'If it lands: offer the free workshop for the team.','If it does not: thank them and leave it there. Warm stays warm.'];
    return{subject:'',body:fill(lines.map(x=>'• '+x).join('\n'))}}
  if(P==='call'){const lines=['Open: '+(newsLine||'say who you are and why you are calling in one line.'),'The insight: the one thing from '+V.asset+' that matters most to '+V.brand+'.','Ask: what is the team focused on this quarter? Then listen.',o.cta==='none'?'Close: offer to send the summary. No hard sell.':'Close: suggest '+(o.cta==='call'?'a proper call with the team':'a coffee')+' if it lands.'];if(L==='long'&&V.proof)lines.splice(2,0,'Proof, if it fits: '+V.proof+'.');return{subject:'',body:fill(lines.map(x=>'• '+x).join('\n'))}}
  if(P==='post'){const bp=bankPost(c,seed);if(bp)return{subject:'',body:bp.body};add(pick(['What {sector} brands get wrong about {prob}, in three points.','We looked hard at {prob} across {sector}. Here is what we found.']));add('1. [your first point]\n2. [your second point]\n3. [your third point]');if(L!=='short')add('The full version is in '+V.asset+'. Happy to share it with anyone who wants it.');if(funny)add('No tags, no hard sell. Just useful.');return{subject:'',body:parts.join('\n\n')}}
  if(P==='print'){add(pick(['Thought this deserved better than an inbox.','Some things are better on paper.']));add(core);if(funny)add(joke);add(o.sign!=='none'?(o.sign+', '+(V.me||'[your name]')):(V.me||''));return{subject:'',body:parts.join('\n'),note:1}}
  add(greet);
  const body=[];const B=t=>{if(t)body.push(cap(fill(t)))};
  if(P==='connect'){B((hook!==hooks.give?hook:newsLine).replace(/, and one line jumped out\.$|\. One line stood out\.$/,'.'));B(core);if(L!=='short'&&funny)B(joke);B(cta)}
  else{const nl=n&&inc('news')?newsHook(n,tone):'';if(nl&&tone!=='bold')B(nl);if(!(o.angle==='news'&&nl&&tone!=='bold')&&!(o.angle==='give'&&P==='give'&&tone!=='bold'))B(hook);B(core);
    if(L!=='short'){if(funny)B(tone==='playful'&&playful?playful:joke);if(inc('offer')&&V.offer&&P!=='connect')B(pick(['If it helps, ','We could also offer this, if useful: '])+lcf(V.offer)+'.')}
    const cs=inc('case')&&P!=='connect'&&!(tool.lib&&tool.f==='report')?caseFor(a):null;if(cs&&L!=='short')B(pick(['We did something similar recently. ','Something close to this has worked for us before. '])+cs.result.replace(/\.$/,'')+'.');
    if(L==='long'){if(V.uvp)B(pick(['A bit about us: ','For context, '])+lcf(V.uvp)+'.');if(inc('proof')&&V.proof&&P!=='proof'&&o.angle!=='proof')B('Recently, '+V.proof.charAt(0).toLowerCase()+V.proof.slice(1)+'.')}
    B(cta)}
  let txt=parts[0]+'\n\n'+(L==='short'||(s&&s.ch==='linkedin')?body.join(' '):body.join('\n\n'));
  if(inc('ps')&&P!=='connect'&&L!=='short')txt+='\n\n'+fill(n&&o.angle!=='news'?'P.S. '+newsHook(n,'warm'):pick(['P.S. If you are not the right person, a nudge in the right direction would be much appreciated.','P.S. There is a one page version if you are short on time.']));
  if(o.sign!=='none'&&!(s&&s.ch==='linkedin'&&L==='short'))txt+='\n\n'+o.sign+(V.me?',\n'+V.me:'');
  if(tone==='formal')txt=txt.replace(/\bI’m\b|\bI'm\b/g,'I am').replace(/\bit’s\b|\bit's\b/gi,'it is').replace(/\bdon’t\b|\bdon't\b/g,'do not').replace(/Cheers/g,'Kind regards');
  const subj=fill({give:pick(['Something for {brand}','Made this for {brand}','{asset} for {brand}']),follow:'One line from the '+V.asset.replace(/^the /,''),proof:'A result you might like',checkin:tone==='formal'?'Checking in':'Quick one',idea:'An idea for next year',invite:'Breakfast with {sector} marketers?'}[P]||'A thought for {brand}');
  return{subject:subj.charAt(0).toUpperCase()+subj.slice(1),body:txt.replace(/ {2,}/g,' ').replace(/ \./g,'.').trim()}}
/* the controls */
function cmpChips(key,opts,fn){const v=S.compose[key];return '<div class="cmp-r"><span class="cmp-l">'+{tone:'Tone',len:'Length',angle:'Lead with',cta:'The ask'}[key]+'</span><div class="cmp-c">'+opts.map(o=>'<button class="cc'+(v===o[0]?' on':'')+'" onclick="setCmp(\''+key+'\',\''+o[0]+'\')">'+(o.length>2?'<span>'+o[1]+'</span>'+o[2]:o[1])+'</button>').join('')+'</div></div>'}
function composerHTML(ctx){const C=S.compose;const ch=ctx.s&&ctx.s.ch;const P=purposeOf(ctx.s);const msg=ctx.msg;const li=ch==='linkedin';const lim=li&&P==='connect'?300:li?1900:0;
  if(msg.task)return '<div class="cmp task"><div class="pb-task">'+ico('heart')+'<p>'+esc(msg.body)+'</p></div></div>';
  if(P==='connect'&&ctx.s&&ctx.s.nonote)return noNoteHTML(ctx);
  return '<div class="cmp"><div class="cmp-top"><span class="cmp-p">'+esc(PURPOSE_L[P]||'Message')+'</span><button class="btn btn-ghost btn-xs" onclick="shuffleCmp()" data-tip="Another version">'+ico('dice')+'Shuffle</button><button class="btn btn-ghost btn-xs" onclick="toggleCmpOpen()">'+ico('settings')+(CMP_OPEN?'Hide controls':'Style it')+'</button></div>'+
   (CMP_OPEN?'<div class="cmp-ctl">'+cmpChips('tone',CMP.tone)+cmpChips('len',CMP.len)+cmpChips('angle',CMP.angle)+
    '<div class="cmp-r"><span class="cmp-l">Include</span><div class="cmp-c">'+CMP.inc.map(o=>'<button class="cc tg'+(C.inc.includes(o[0])?' on':'')+'" onclick="togCmp(\''+o[0]+'\')">'+(C.inc.includes(o[0])?'✓ ':'')+o[1]+'</button>').join('')+'<button class="cc tg'+(C.humour?' on':'')+'" onclick="setCmp(\'humour\','+(!C.humour)+')">'+(C.humour?'✓ ':'')+'A smidge of humour 😉</button></div></div>'+
    cmpChips('cta',CMP.cta)+'<div class="cmp-r"><span class="cmp-l">Sign off</span><div class="cmp-c"><select class="inp sel-s" onchange="setCmp(\'sign\',this.value)">'+CMP.sign.map(x=>'<option value="'+x+'"'+(C.sign===x?' selected':'')+'>'+(x==='none'?'No sign off':x)+'</option>').join('')+'</select>'+(!S.setup.offer.proof||!S.setup.offer.solution?'<button class="link small" onclick="go(\'give\')">Add your proof and offer</button>':'')+'</div></div></div>':'')+
   (ch==='email'||(ch==='workshop'&&msg.subject)?'<input class="inp cmp-subj" id="pbSubj" value="'+esc(msg.subject)+'" aria-label="Subject line">':'')+
   '<textarea class="inp pb-msg" id="pbMsg" rows="'+(msg.body.split('\n').length>6?10:7)+'" oninput="cmpCount()">'+esc(msg.body)+'</textarea>'+
   (lim?'<div class="cmp-count" id="cmpCount" data-lim="'+lim+'">'+msg.body.length+' / '+lim+'</div>':'')+'</div>'}
/* the connection request: no note is the recommended path */
function curPT(){const c=curCamp();return campTargets(c).flatMap(a=>a.people.map(p=>({a,p}))).find(q=>q.p.id===ptPerson)}
function noNoteHTML(ctx){const x=curPT();const p=x&&x.p;const met=p&&p.met||'';const pct=liPct();const msg=ctx.msg;
  return '<div class="cmp nonote">'+(pct<100?'<div class="warnbar li-warn">'+ico('linkedin')+'<span class="grow"><b>Your LinkedIn profile is '+pct+'% ready.</b> They will look you up before they accept. Sort it first and the request does the work on its own.</span><button class="btn btn-line btn-xs" onclick="liModal()">Get it ready</button></div>':'')+
    '<div class="nn-hero"><span class="nn-ic">'+ico('linkedin')+'</span><div class="grow"><b>'+(met?'A short note, because you have genuinely met':'Connect with no note')+'</b><p>'+(met?'You have something real in common, so a line helps here. Keep it short and human.':'Hit Connect and skip the note. Your profile does the talking, and they hear from you properly once they accept.')+'</p></div><span class="pill '+(met?'':'good')+'">'+(met?'Note added':'✨ Recommended')+'</span></div>'+
    (met?'<textarea class="inp pb-msg" id="pbMsg" rows="4" oninput="cmpCount()">'+esc(msg.body)+'</textarea><div class="cmp-count" id="cmpCount" data-lim="300">'+msg.body.length+' / 300</div>':'')+
    '<details class="nn-met"'+(met?' open':'')+'><summary>Have you actually met, or share something real?</summary><p class="tiny muted">Only if it is true: you met at an event, you were introduced, you worked with the same person. Otherwise, leave it blank.</p><div class="row" style="gap:8px;margin-top:8px"><input class="inp" id="nnMet" value="'+esc(met)+'" placeholder="e.g. at the Retail Week breakfast, or we both know Sam Patel"><button class="btn btn-line btn-sm" onclick="setMet($(\'#nnMet\').value)">'+(met?'Update':'Add a note')+'</button>'+(met?'<button class="btn btn-ghost btn-sm" onclick="setMet(\'\')">No note</button>':'')+'</div></details></div>'}
function setMet(v){const x=curPT();if(!x)return;act(v.trim()?'Added a note for '+x.p.name:'Back to no note',()=>{x.p.met=v.trim()},{refresh:false,quiet:true});clearDraft();go(VIEW,VIEW_ARG,true)}
let CMP_OPEN=true;
function toggleCmpOpen(){CMP_OPEN=!CMP_OPEN;go(VIEW,VIEW_ARG,true)}
function cmpCount(){const el=$('#cmpCount');if(!el)return;const n=$('#pbMsg').value.length,l=+el.dataset.lim;el.textContent=n+' / '+l+(n>l?' · too long for LinkedIn':'');el.classList.toggle('over',n>l)}
function setCmp(k,v){S.compose[k]=v;S.compose.seed=S.compose.seed||0;clearDraft();save();award('compose');go(VIEW,VIEW_ARG,true)}
function togCmp(k){const I=S.compose.inc;S.compose.inc=I.includes(k)?I.filter(x=>x!==k):I.concat(k);clearDraft();save();go(VIEW,VIEW_ARG,true)}
function shuffleCmp(){S.compose.seed=(S.compose.seed||0)+1;clearDraft();save();go(VIEW,VIEW_ARG,true)}
function clearDraft(){const c=curCamp();if(c&&c.drafts&&ptPerson&&ptStep)delete c.drafts[ptPerson+':'+ptStep]}
function saveDraft(){const c=curCamp();const m=$('#pbMsg');if(!c||!m||!ptPerson||!ptStep)return;c.drafts=c.drafts||{};c.drafts[ptPerson+':'+ptStep]={b:m.value,s:($('#pbSubj')||{}).value||''};save()}
document.addEventListener('change',e=>{if(e.target&&(e.target.id==='pbMsg'||e.target.id==='pbSubj'))saveDraft()});
