/* ═══════════ v18q: Create value, simpler and confirmed ═══════════
   Case studies get their own kind. The content bank is a grid of tiles you can read at a glance. Anything Gus suggests
   waits for your tick before it counts. And when a touch is built around an asset with a link, the link goes in the draft. */

CV_CATS.splice(CV_CATS[0]&&CV_CATS[0].k==='mine'?1:0,0,{k:'case',l:'Case studies',ic:'trophy',c:'#2f9e44',d:'Proof you have done it'});
CV_SLOT.case='case';CV_SLOT_C.case='#2f9e44';
CV_HOW.case=['Pick one client with a problem like theirs','Write it as problem, what you did, what changed, with one number','Keep it to one page or a 60 second read'];
CV_STRUCT.case='a one-page case study: the client and their problem, what the agency did, the result with a number, and one line on why it matters to a brand like the prospect';
(function(){const f=cvGen;cvGen=function(cat,x){if(cat!=='case')return f(cat,x);const c=curCamp();const X=cx18();const real=X.cases.filter(k=>k.client&&k.result);
  const own=bankOf(c).items.filter(i=>i.slot==='case'&&i.src==='own');const out=[];
  real.slice(0,2).forEach(k=>out.push(['One-pager: '+k.client,(k.problem?k.problem+'. ':'')+(k.did?'What we did: '+k.did+'. ':'')+'Result: '+k.result+'.','Proof from a brand with the same problem lands harder than any claim.','2 hours']));
  own.slice(0,1).forEach(o=>out.push(['Tighten “'+o.t+'” into one page','Pull the problem, the work and the number out of your existing case study, and cut the rest.','Busy '+x.role+'s read one page, not twelve.','1 hour']));
  out.push(['Before and after, for '+x.secL,'Two screenshots or numbers side by side from a past client, with one line on what changed.','It shows the fix for '+x.short+' without asking them to read.','1 hour']);
  if(!real.length)out.push(['Add your first case study','Put one real client story in your agency profile under How you sell, and Gus turns it into a one-pager here.','Otis only quotes real work, so this unlocks proof in every message.','10 minutes']);
  return out.slice(0,4)}})();

/* anything Gus adds waits for a tick */
(function(){const f=cvAdd18;cvAdd18=function(e,cat,id){const idea=cvIdeas(cat,curCamp()).find(i=>i.id===id);if(idea&&/^Add your first case study/.test(idea.n)){go('agency','sell');setTimeout(()=>{const el=$('#cxC0');if(el){el.scrollIntoView({block:'center'});el.focus()}},150);return}f(e,cat,id);const c=curCamp();const it=bankOf(c).items.find(i=>i.idea18===id);if(it&&it.ok18==null){it.ok18=false;save()}}})();
(function(){if(typeof cvGenerate!=='function')return;const f=cvGenerate;cvGenerate=function(){const c=curCamp();const before=new Set(bankOf(c).items.map(i=>i.id));const r=f.apply(this,arguments);
  const mark=()=>{bankOf(c).items.forEach(i=>{if(!before.has(i.id)&&i.ok18==null)i.ok18=false});save()};if(r&&r.then)r.then(mark);else mark();return r}})();
function bankOk18(id,v){const c=curCamp();const it=bankOf(c).items.find(i=>i.id===id);if(!it)return;it.ok18=v;save();go('give',null,true)}
function bankOkAll18(){const c=curCamp();bankOf(c).items.forEach(i=>{if(i.ok18===false)i.ok18=true});save();toast('Confirmed. Otis can use them all.');go('give',null,true)}
const okItem18=i=>i.ok18!==false;

function bankTiles18(c){const I=cvItems(c);if(!I.length)return '';const pend=I.filter(i=>i.ok18===false);const live=I.filter(okItem18);
  const SL={hero:'Hero piece',case:'Case study',lipost:'LinkedIn post',blog:'Blog or report',video:'Personal video',screen:'Screen recording'};
  const tile=it=>{const cat=it.cat18&&CV_CATS.find(k=>k.k===it.cat18);const s=BANK_SLOTS.find(x=>x.k===it.slot)||{ic:'doc'};const col=cat?cat.c:CV_SLOT_C[it.slot]||'#868e96';const pending=it.ok18===false;
    const open=it.idea18&&it.cat18?'cvMore(\''+it.cat18+'\',\''+it.idea18+'\')':'bankOpen(\''+it.id+'\')';
    const st=pending?'Suggested':it.status==='ready'?'Ready':it.id==='hero'?'Being made':'Draft';
    return '<article class="bt18'+(pending?' pend':'')+(it.status==='ready'?' ready':'')+'" style="--c:'+col+'"><button class="bt18-o" onclick="'+open+'" aria-label="Open '+esc(it.t)+'"></button>'+
      '<div class="bt18-h"><span class="bt18-i">'+ico(cat?cat.ic:s.ic)+'</span><small>'+esc(SL[it.slot]||'Asset')+'</small><span class="bt18-s">'+(it.status==='ready'&&!pending?ico('check'):'')+st+'</span></div>'+
      '<b>'+esc(it.t)+'</b>'+(it.val?'<p>'+esc(it.val)+'</p>':'')+
      '<div class="bt18-f"><span>'+esc(it.src==='own'?'Yours':it.src==='lib'?'Your library':it.src==='gift'?'Hero':it.idea18?'Gus':'Gus')+'</span>'+(it.url?'<span>'+ico('link')+'Has a link</span>':'')+
      (pending?'<label class="bt18-tk"><input type="checkbox" onchange="bankOk18(\''+it.id+'\',this.checked)"> Use this</label>':'')+'</div></article>'};
  return '<section class="cv2-plan bt18-w"><div class="cv2-sh"><h2>Your content <span class="serif">bank.</span></h2><span>'+live.length+' ready to use'+(pend.length?' · '+pend.length+' waiting for your tick':'')+'. Tap a tile for the detail.</span></div>'+
    (pend.length?'<div class="bt18-pend"><div class="bt18-ph">'+agentFace('give',28,{badge:false})+'<span class="bt18-pt"><b>Gus suggests '+pend.length+' more.</b> Tick the ones you want, and Otis will use them in messages.</span><button class="btn btn-line btn-sm" onclick="bankOkAll18()">'+ico('check')+'Use them all</button></div><div class="bt18-g">'+pend.map(tile).join('')+'</div></div>':'')+
    '<div class="bt18-g">'+live.map(tile).join('')+'</div></section>'}

/* the page, simpler: assets, ideas, the bank. The side rail is gone. */
(function(){const f=VIEWS.give;VIEWS.give=function(){let h=f.apply(this,arguments);const c=curCamp();
  const a=h.indexOf('<section class="cv2-plan">');if(a>-1){const b=h.indexOf('</section>',a)+10;h=h.slice(0,a)+bankTiles18(c)+h.slice(b)}else if(cvItems(c).length)h=h.replace('</div><aside','</div>'+bankTiles18(c)+'<aside');
  h=h.replace(/<aside class="cv2-bank"[\s\S]*<\/aside>(\s*<\/div>)$/,'$1');return h.replace('<div class="cv2">','<div class="cv2 one18">')}})();

/* drafts carry the asset's link */
(function(){const f=composeMsg;composeMsg=function(s,a,p,c,o){const m=f.apply(this,arguments);try{if(!m||m.nonote||!s||!s.asset||!m.body)return m;c=c||curCamp();
  const it=bankItems(c).find(x=>x.id===s.asset);const url=it&&(it.url||(it.src==='gift'&&toolById(c.assets[0])&&c.heroUrl18))||'';if(!url||m.body.includes(url))return m;
  const lines=m.body.split('\n');let k=-1;for(let i=lines.length-1;i>0;i--){if(/^(cheers|thanks|thank you|best|all the best|speak soon|kind regards|regards|warmly|many thanks|talk soon)\b/i.test(lines[i].trim())){k=i;break}}
  if(k<0){k=lines.length;while(k>1&&lines[k-1].trim().length<30&&lines[k-1].trim())k--}
  lines.splice(k,0,url,'');return Object.assign({},m,{body:lines.join('\n').replace(/\n{3,}/g,'\n\n')})}catch(e){return m}}})();
