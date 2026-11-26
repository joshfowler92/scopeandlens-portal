/* ═══════════ v18s: Plan the journey and the agency character, tidied ═══════════ */

/* the Scope & Lens route includes LinkedIn ads in the background */
(function(){const f=setJMode18;setJMode18=function(m){const c=curCamp();if(m==='rec')c.reach.ads=true;return f(m)}})();

/* events you add are flagged in the sequence, and you are taken to them */
(function(){const f=evAdd;evAdd=function(k){const c=curCamp();const before=new Set((c.reach.steps||[]).map(s=>s.id));f(k);const fresh=(c.reach.steps||[]).filter(s=>!before.has(s.id));
  fresh.forEach(s=>s.new18=Date.now());if(fresh.length){save();const s=fresh[0];setTimeout(()=>toast('Added to week '+s.w+' of your sequence.',{l:'Show me',f:()=>{const n=document.querySelector('.jfn18.new18')||document.querySelector('.pl18');if(n){n.scrollIntoView({behavior:'smooth',block:'center'});n.classList.add('pulse18')}}},6000),250)}}})();
(function(){const f=flowNode;flowNode=function(o){let h=f(o);const c=curCamp();const s=o.id&&c&&(c.reach.steps||[]).find(x=>x.id===o.id);if(s&&s.new18&&Date.now()-s.new18<10*60*1000)h=h.replace('<div class="jfn18">','<div class="jfn18 new18"><span class="new18-b">Just added</span>');return h}})();

/* Get your LinkedIn ready: higher up, shorter, and the PDF is the main way in */
liScanCard=function(c){const L=S.liScan;const T=liTarget();const who=esc((T.roles[0]||'marketing lead').toLowerCase())+' at a '+esc(T.sec)+' brand';
  if(!L||!L.score)return '<div class="card lisc lr18" data-tour="liscan"><div class="lr18-h">'+agentFace('reach',40,{badge:false})+'<div class="grow"><div class="lab" style="margin:0">Before you connect with anyone</div><h3>Get your LinkedIn <span class="serif">ready.</span></h3><p>Every '+who+' looks you up before they accept. Priya reads your profile the way they will, scores it, and tells you exactly what to change.</p></div></div>'+
    '<div class="lr18-g"><label class="lr18-pdf" ondragover="event.preventDefault();this.classList.add(\'over\')" ondragleave="this.classList.remove(\'over\')" ondrop="event.preventDefault();this.classList.remove(\'over\');lrPdf18(event.dataTransfer.files[0])"><input type="file" accept="application/pdf" hidden onchange="lrPdf18(this.files[0])">'+ico('upload')+'<b>Drop your profile PDF</b><small>The most accurate read. On LinkedIn: your profile, More, Save to PDF.</small><span class="lr18-tag">Best</span></label>'+
      '<div class="lr18-url"><b>Or paste your profile link</b><small>Quicker, but private profiles cannot be read this way.</small><div class="lisc-f"><input class="inp" id="liUrl" placeholder="linkedin.com/in/your-name" value="'+esc((L&&L.url)||'')+'" onkeydown="if(event.key===\'Enter\')liScan()"><button class="btn btn-line" onclick="liScan()">'+ico('eye')+'Scan</button></div></div></div>'+
    '<textarea id="liTxt" hidden>'+esc((L&&L.text)||'')+'</textarea></div>';
  const todo=L.sugg.filter(s=>!s.done);const done=L.sugg.length-todo.length;
  const row=(s)=>{const i=L.sugg.indexOf(s);return '<label class="lis'+(s.done?' on':'')+'"><input type="checkbox"'+(s.done?' checked':'')+' onchange="liDone('+i+',this.checked)"><span><b>'+esc(s.t)+'</b>'+(s.copy?'<span class="lis-c">'+esc(s.copy)+'<button class="btn btn-xs btn-line" onclick="event.preventDefault();copyText(\''+esc(s.copy).replace(/'/g,"\\'")+'\',this)">Copy</button></span>':'')+'</span></label>'};
  return '<div class="card lisc res lr18" data-tour="liscan"><div class="lisc-r">'+ringPct(L.score,64)+'<div class="grow"><div class="lab" style="margin:0">Your LinkedIn, through their eyes</div><h3>'+(L.score>=75?'Ready to connect':L.score>=55?'Nearly there':'Worth fixing first')+'</h3><p class="small">'+done+' of '+L.sugg.length+' fixes done.'+(todo.length?' Start with the top one.':' Connect without a note.')+'</p></div><button class="btn btn-ghost btn-sm" onclick="S.liScan.score=0;go(VIEW,VIEW_ARG,true)">'+ico('loop')+'Scan again</button></div>'+
    '<div class="lisc-s">'+todo.slice(0,3).map(row).join('')+(L.sugg.length>3?'<details class="lr18-more"><summary>'+(L.sugg.length-Math.min(3,todo.length))+' more</summary>'+L.sugg.filter(s=>todo.indexOf(s)<0||todo.indexOf(s)>2).map(row).join('')+'</details>':'')+'</div></div>'};
async function lrPdf18(f){if(!f)return;if(!/pdf$/i.test(f.type||f.name)){toast('That needs to be a PDF. On LinkedIn: More, Save to PDF.');return}
  try{toast('Reading your profile…');const t=await readPdfText(f);const clean=t.replace(/Page \d+ of \d+/g,' ').replace(/\s{2,}/g,' ').trim();const ta=$('#liTxt');if(ta)ta.value=clean.slice(0,8000);S.liScan=Object.assign({},S.liScan||{},{text:clean.slice(0,8000),src:'your PDF'});save();await liScan()}catch(e){toast('Could not read that PDF. Try saving it again from LinkedIn.')}}
/* and it sits right under the plan, not at the bottom */
journeyView=(function(f){return function(c){let h=f(c);const li=liScanCard(c);const i=h.indexOf(li);if(i<0)return h;h=h.slice(0,i)+h.slice(i+li.length);h=h.replace('<div style="margin-top:16px"></div>','');
  const anchor=h.indexOf('<section class="pl18"');if(anchor>-1){const end=h.indexOf('</section>',anchor);return h.slice(0,end+10)+'<!--lr18s--><div class="lr18-w">'+li+'</div><!--lr18e-->'+h.slice(end+10)}return '<!--lr18s--><div class="lr18-w">'+li+'</div><!--lr18e-->'+h}})(journeyView);
(function(){const f=VIEWS.reach;VIEWS.reach=function(){let h=String(f.apply(this,arguments));const a=h.indexOf('<!--lr18s-->'),b=h.indexOf('<!--lr18e-->');if(a<0||b<0)return h;const blk=h.slice(a,b+12);h=h.slice(0,a)+h.slice(b+12);
  for(const m of ['<div style="margin-top:16px"><div class="card evc','<div class="card evc','<div class="row wrap" style="margin-top:14px;gap:8px">']){const i=h.indexOf(m);if(i>-1)return h.slice(0,i)+blk+h.slice(i)}return h+blk}})();

/* the agency character wears your colours, and you can change them in a click */
function agColour18(v){if(!/^#[0-9a-f]{6}$/i.test(v))return;S.brand.primary=v;save();applyTheme();go('agency',VIEW_ARG,true)}
(function(){const f=ag18Char;ag18Char=function(){const h=f.apply(this,arguments);const col=(S.brand&&S.brand.primary)||'#2c56ed';
  return h.replace('<div class="ch18-k">Your agency, as Plato sees it</div>','<div class="ch18-k">Your agency, as Plato sees it<label class="ch18-col" data-tip="Your brand colour"><input type="color" value="'+esc(col)+'" onchange="agColour18(this.value)" aria-label="Your brand colour"><i style="background:'+esc(col)+'"></i></label></div>')}})();
/* LinkedIn's PDF has a sidebar (Contact, Top Skills) and a main column. Read them separately, line by line,
   so the server can find Summary and Experience instead of guessing from one long run of text. */
async function liPdfLines18(f){const buf=await f.arrayBuffer();const lib=await loadPdfJs();const pdf=await lib.getDocument({data:buf}).promise;const side=[],main=[];
  for(let i=1;i<=Math.min(pdf.numPages,5);i++){const pg=await pdf.getPage(i);const vw=pg.getViewport({scale:1}).width;const tc=await pg.getTextContent();const rows={};
    tc.items.forEach(it=>{if(!it.str||!it.str.trim())return;const x=it.transform[4],y=Math.round(it.transform[5]);const col=x<vw*0.33?'s':'m';const k=col+':'+y;(rows[k]=rows[k]||{col,y,parts:[]}).parts.push({x,s:it.str})});
    Object.values(rows).sort((a,b)=>b.y-a.y).forEach(r=>{const line=r.parts.sort((a,b)=>a.x-b.x).map(p=>p.s).join(' ').replace(/\s+/g,' ').trim();if(!line||/^Page \d+ of \d+$/i.test(line))return;(r.col==='s'?side:main).push(line)})}
  return main.join('\n')+'\n'+side.join('\n')}
lrPdf18=async function(f){if(!f)return;if(!/pdf$/i.test(f.type||f.name)){toast('That needs to be a PDF. On LinkedIn: More, Save to PDF.');return}
  try{toast('Reading your profile…');const t=(await liPdfLines18(f)).slice(0,10000);const ta=$('#liTxt');if(ta)ta.value=t;S.liScan=Object.assign({},S.liScan||{},{text:t,src:'your PDF'});save();await liScan()}catch(e){toast('Could not read that PDF. Try saving it again from LinkedIn.')}};
liPdf=lrPdf18;
