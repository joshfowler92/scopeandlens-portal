/* ═══════════ THE PLAN AS A PDF: drawn to match the dashboard, no outside libraries ═══════════ */
const PW=1188,PH=840,PS=2480/1188;
function pdfCol(){const b=S.brand;return{brand:b.primary,soft:mix(b.primary,'#ffffff',.86),mid:mix(b.primary,'#ffffff',.6),accent:b.accent||'#5eead4',bg:b.mode==='dark'?'#f0ede8':(b.bg||'#f0ede8'),paper:'#f8f6f2',ink:'#080808',ink2:'#2a2926',mute:'#55524d',rule:'rgba(8,8,8,.14)',on:lum(b.primary)>.45?'#080808':'#f0ede8',good:'#0b7a6a'}}
function iconImg(k,col){return new Promise(res=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>res(null);
  i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96" fill="none" stroke="'+col+'" stroke-width="1.9" stroke-linecap="square" stroke-linejoin="miter">'+(IC[k]||'')+'</svg>')})}
function imgFrom(src){return new Promise(res=>{if(!src)return res(null);const i=new Image();i.onload=()=>res(i);i.onerror=()=>res(null);i.src=src})}
async function downloadPlanPDF(){const c=curCamp();if(!c){toast('Build a campaign first');return}
  toast('📄 Drawing your plan…');
  try{await Promise.all(['800 20px "DM Sans"','700 20px "DM Sans"','500 20px "DM Sans"','italic 400 20px "DM Serif Display"'].map(f=>document.fonts.load(f)))}catch(e){}
  const C=pdfCol();const need=new Set(['layers','bolt','pulse','pipeline','target','gift','send','star','check','bulb','people','user','calendar','loop','arrow','doc','megaphone']);REACH_CH.forEach(x=>need.add(x.ic));MODULES.forEach(m=>need.add(m.ic));
  const IM={};await Promise.all([...need].flatMap(k=>[C.brand,'#ffffff',C.ink,C.mute].map(async col=>{IM[k+col]=await iconImg(k,col)})));
  const logo=await imgFrom(S.brand.logo);
  const pages=[pdfCover,pdfWho,pdfGive,pdfReach].concat(campTargets(c).length?[pdfWhyNow]:[]);const jpgs=[];
  for(let i=0;i<pages.length;i++){const cv=document.createElement('canvas');cv.width=Math.round(PW*PS);cv.height=Math.round(PH*PS);const x=cv.getContext('2d');x.scale(PS,PS);
    const D=pdfDraw(x,C,IM);D.R(0,0,PW,PH,C.bg);pages[i](D,c,{logo});if(i)D.footer(c,i+1,pages.length);jpgs.push(cv.toDataURL('image/jpeg',.92))}
  const blob=makePDF(jpgs);const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(c.name||'growth-plan').replace(/\W+/g,'-').toLowerCase()+'-plan.pdf';a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast('📄 Your plan is downloading')}

/* drawing kit */
function pdfDraw(x,C,IM){const D={x,C};
  D.R=(a,b,w,h,f,s,lw)=>{if(f){x.fillStyle=f;x.fillRect(a,b,w,h)}if(s){x.strokeStyle=s;x.lineWidth=lw||1.5;x.strokeRect(a,b,w,h)}};
  D.card=(a,b,w,h,f,shadow)=>{if(shadow!==false)D.R(a+5,b+5,w,h,C.ink);D.R(a,b,w,h,f||C.paper,C.ink,1.5)};
  D.font=(o)=>{o=o||{};x.font=(o.italic?'italic ':'')+(o.w||500)+' '+(o.s||14)+'px '+(o.serif?'"DM Serif Display", Georgia, serif':'"DM Sans", system-ui, sans-serif');try{x.letterSpacing=('ls' in o?o.ls:((o.s||14)>=26?-(o.s||14)*.035:0))+'px'}catch(e){}};
  D.T=(t,a,b,o)=>{o=o||{};D.font(o);x.fillStyle=o.c||C.ink;x.textAlign=o.al||'left';x.textBaseline=o.bl||'alphabetic';
    let s=String(t==null?'':t);if(o.max){while(s.length>1&&x.measureText(s).width>o.max)s=s.slice(0,-2)+'…'}x.fillText(s,a,b);return x.measureText(s).width};
  D.W=(t,o)=>{D.font(o);return x.measureText(String(t)).width};
  D.wrap=(t,a,b,w,lh,o,maxL)=>{o=o||{};D.font(o);const words=String(t||'').split(/\s+/);let line='',n=0,y=b;const out=[];
    words.forEach(wd=>{const tst=line?line+' '+wd:wd;if(x.measureText(tst).width>w&&line){out.push(line);line=wd}else line=tst});if(line)out.push(line);
    const L=maxL?out.slice(0,maxL):out;if(maxL&&out.length>maxL)L[maxL-1]=L[maxL-1].replace(/\s*\S*$/,'')+'…';
    L.forEach(l=>{D.T(l,a,y,o);y+=lh;n++});return y};
  D.circ=(a,b,r,f,s,lw)=>{x.beginPath();x.arc(a,b,r,0,Math.PI*2);if(f){x.fillStyle=f;x.fill()}if(s){x.strokeStyle=s;x.lineWidth=lw||1.5;x.stroke()}};
  D.icon=(k,a,b,sz,col)=>{const im=IM[k+(col||C.brand)];if(im)x.drawImage(im,a-sz/2,b-sz/2,sz,sz)};
  D.iconDot=(k,a,b,r,bg,col)=>{D.circ(a,b,r,bg);D.icon(k,a,b,r*1.05,col)};
  D.line=(a,b,c2,d,col,lw,dash)=>{x.beginPath();x.moveTo(a,b);x.lineTo(c2,d);x.strokeStyle=col;x.lineWidth=lw||1.5;x.setLineDash(dash||[]);x.stroke();x.setLineDash([])};
  D.ring=(a,b,r,pct)=>{D.circ(a,b,r,null,C.rule,5);x.beginPath();x.arc(a,b,r,-Math.PI/2,-Math.PI/2+Math.PI*2*pct/100);x.strokeStyle=C.brand;x.lineWidth=5;x.stroke();D.T(Math.round(pct),a,b+5,{s:14,w:800,al:'center'})};
  D.head=(n,step,title,sub)=>{D.circ(58,66,15,C.brand);D.T(n,58,71,{s:14,w:800,al:'center',c:C.on});D.T(step,82,71,{s:15,w:700,c:C.brand});
    const w=D.T(title,44,128,{s:46,w:800});if(sub)D.wrap(sub,44,158,640,20,{s:15,c:C.mute},2);
    return w};
  D.flowMini=(cur)=>{const M=SYS();const w=112,g=14,tot=M.length*w+(M.length-1)*g;let bx=PW-44-tot;M.forEach((m,i)=>{const on=m.k===cur;D.R(bx,46,w,40,on?C.brand:C.paper,on?C.brand:C.rule,1.5);D.icon(m.ic,bx+18,66,16,on?'#ffffff':C.brand);D.T(m.ls||m.l,bx+32,71,{s:13,w:700,c:on?C.on:C.ink});
    if(i<M.length-1){D.line(bx+w+3,66,bx+w+g-3,66,C.mid,2);x.beginPath();x.moveTo(bx+w+g-3,62);x.lineTo(bx+w+g+1,66);x.lineTo(bx+w+g-3,70);x.fillStyle=C.mid;x.fill()}bx+=w+g})};
  D.chip=(ic,t,a,b)=>{const w=D.W(t,{s:12.5,w:600})+34;D.R(a,b,w,26,C.paper,C.rule,1);D.icon(ic,a+13,b+13,13,C.brand);D.T(t,a+25,b+17.5,{s:12.5,w:600});return w};
  D.footer=(c,n,N)=>{D.line(44,PH-40,PW-44,PH-40,C.rule,1);D.T((S.setup.agency||'Your agency')+'  ·  '+c.name,44,PH-20,{s:12,w:600,c:C.mute,max:700});D.T('Powered by Scope & Lens  ·  '+n+' of '+N,PW-44,PH-20,{s:12,w:600,c:C.mute,al:'right'})};
  return D}

/* page 1: the cover */
function pdfCover(D,c,o){const C=D.C,x=D.x;const tg=campTargets(c);const ppl=sum(tg,a=>a.people.length);const st=c.reach.steps||[];
  D.R(0,0,540,PH,C.brand);x.save();x.globalAlpha=.16;D.circ(470,120,190,'#ffffff');D.circ(80,760,140,'#ffffff');x.restore();x.save();x.globalAlpha=.25;D.circ(420,640,90,null,'#ffffff',2);x.restore();
  if(o.logo){const r=o.logo.width/o.logo.height,h=56,w=Math.min(200,h*r);D.R(52,52,w+20,h+20,'#ffffff');x.drawImage(o.logo,62,62,w,h)}
  else{D.circ(84,84,32,C.on);D.T(initials(S.setup.agency||'GD'),84,91,{s:20,w:800,al:'center',c:C.brand})}
  D.T('Growth plan',56,300,{s:18,w:700,c:C.on});D.wrap(c.name,56,360,430,56,{s:54,w:800,c:C.on},4);
  D.T(new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})+(S.setup.agency?'  ·  '+S.setup.agency:''),56,PH-60,{s:14,w:600,c:C.on});
  /* at a glance */ D.T('At a glance',600,96,{s:15,w:700,c:C.brand});
  const k=[['target',tg.length,'brands'],['people',ppl,'people'],['send',st.filter(s=>!s.task).length*Math.max(1,ppl),'touches'],['calendar',c.reach.weeks,'weeks']];
  k.forEach((v,i)=>{const bx=600+i*137;D.card(bx,116,122,112);D.iconDot(v[0],bx+30,148,17,C.soft,C.brand);D.T(v[1],bx+16,200,{s:36,w:800});D.T(v[2],bx+16,218,{s:13,c:C.mute})});
  D.T('How the system works',600,292,{s:15,w:700,c:C.brand});
  SYS().forEach((m,i)=>{const by=316+i*112;D.card(600,by,530,86);D.circ(632,by+43,15,null,C.ink,1.5);D.T(m.n,632,by+48,{s:13,w:800,al:'center'});D.iconDot(m.ic,684,by+43,24,C.soft,C.brand);
    D.T(m.l,720,by+38,{s:20,w:800});D.wrap(m.why,720,by+60,390,17,{s:13,c:C.mute},2);
    if(i<3){D.line(632,by+86+6,632,by+112-6,C.brand,2,[4,4])}});
  D.T('Powered by Scope & Lens',PW-44,PH-24,{s:12,w:600,c:C.mute,al:'right'})}

/* page 2: who */
function pdfWho(D,c){const C=D.C;const P=S.setup.profile;const tg=campTargets(c);
  D.head('1','Step 1 · who to target','The brands','Chosen because they fit what you do best, and many have a reason to talk right now.');D.flowMini('prospects');
  let cx=44;[['layers',P.sectors.map(k=>(L_SECTORS[k]||{}).label).join(', ')],['grid',P.csize==='auto'?'Sized for you':(L_SIZES[P.csize]||{}).label],['target',P.region==='any'?'Anywhere in the UK':L_REGIONS[P.region]],['user',P.roles.map(r=>L_ROLES[r].label.split(' or ')[0]).join(', ')],['bulb',(L_PROBLEMS[P.problem]||{}).label]].forEach(v=>{if(v[1])cx+=D.chip(v[0],v[1],cx,196)+8});
  if(!tg.length){D.T('No brands chosen yet.',44,280,{s:18,c:C.mute});return}
  const cols=4,w=(PW-88-3*18)/cols,h=160;tg.slice(0,12).forEach((a,i)=>{const bx=44+(i%cols)*(w+18),by=240+Math.floor(i/cols)*(h+14);D.card(bx,by,w,h,null,false);
    const pr=PROSPECTS.find(p=>norm(p.name)===norm(a.name));const f=pr&&fitP(pr);let tx=bx+14;if(f){D.ring(bx+34,by+34,19,f.s);tx=bx+62}
    D.T(a.name,tx,by+30,{s:15.5,w:800,max:w-(tx-bx)-12});D.T([a.sub||a.sector,a.city].filter(Boolean).join(' · '),tx,by+48,{s:11.5,c:C.mute,max:w-(tx-bx)-12});
    if(a.news){D.R(bx+14,by+66,3,58,C.accent);D.T(L_TRIGGER_LABELS[a.news.type]+'  ·  '+fmtYM(a.news.date),bx+24,by+78,{s:11.5,w:700,max:w-40});D.wrap(a.news.text,bx+24,by+95,w-40,14.5,{s:11.5,c:C.ink2},2)}
    else D.T('No headline this quarter',bx+14,by+82,{s:12,c:C.mute});
    D.line(bx,by+h-38,bx+w,by+h-38,C.rule,1);D.icon('people',bx+22,by+h-19,14,C.brand);D.T(a.people.length?a.people.map(p=>p.name).join(', '):'Nobody named yet',bx+36,by+h-14,{s:12,w:600,max:w-50,c:a.people.length?C.ink:C.mute})});
  if(tg.length>12)D.T('Showing 12 of '+tg.length+'. The rest are in the dashboard.',44,776,{s:12.5,w:600,c:C.mute})}

/* page 3: what to give */
function pdfGive(D,c){const C=D.C,x=D.x;const O=S.setup.offer;const A=c.assets.map(toolById).filter(Boolean);const prime=toolsFor()[0];const list=A.length?A.slice(0,2):[prime];
  D.head('2','Step 2 · what to share','What you will give first','Something genuinely useful, made for them, before you ask for anything.');D.flowMini('give');
  /* how it fits together */ D.R(44,196,PW-88,120,C.brand);const nodes=[['target','Their problem','“'+PROB().label+'”'],['star','Your edge',O.uvp||'Add what you do best in the dashboard'],['gift','What you give',list[0].n]];
  const nw=(PW-88-40-2*60)/3;nodes.forEach((n,i)=>{const bx=64+i*(nw+60);x.save();x.globalAlpha=.12;D.R(bx,214,nw,84,'#ffffff');x.restore();D.R(bx,214,nw,84,null,'rgba(255,255,255,.45)',1.5);
    D.iconDot(n[0],bx+30,256,18,C.on,C.brand);D.T(n[1],bx+58,240,{s:12,w:700,c:C.on});D.wrap(n[2],bx+58,260,nw-72,17,{s:14.5,w:700,c:C.on},2);
    if(i<2){D.line(bx+nw+10,256,bx+nw+50,256,C.accent,2.5);x.beginPath();x.moveTo(bx+nw+48,250);x.lineTo(bx+nw+56,256);x.lineTo(bx+nw+48,262);x.fillStyle=C.accent;x.fill()}});
  /* the ideas */ const aw=list.length>1?(760-18)/2:760;list.forEach((a,i)=>{const bx=44+i*(aw+18),by=344,h=420;D.card(bx,by,aw,h);D.T(i?'Also making':'The main idea',bx+20,by+30,{s:12.5,w:700,c:C.brand});
    let y=D.wrap(a.n,bx+20,by+62,aw-40,30,{s:26,w:800},2)+4;y=D.wrap(a.what,bx+20,y,aw-40,19,{s:14,c:C.ink2},4)+10;D.T('How to make it',bx+20,y+6,{s:12.5,w:700,c:C.mute});y+=24;
    a.steps.slice(0,5).forEach((s,j)=>{if(y>by+h-24)return;D.circ(bx+32,y+2,11,C.soft);D.T(j+1,bx+32,y+6.5,{s:11,w:800,al:'center',c:C.brand});y=D.wrap(tidy(s),bx+52,y+7,aw-80,16,{s:12.5},2)+8})});
  /* in your words */ const bx=822,by=344;D.card(bx,by,322,420);D.T('In your words',bx+20,by+30,{s:12.5,w:700,c:C.brand});let y=by+58;
  [['star','What you do best',O.uvp],['bolt','Why you, not them',O.different],['check','Proof it works',O.proof],['bulb','What you would offer',O.solution]].forEach(r=>{D.iconDot(r[0],bx+30,y+4,13,C.soft,C.brand);D.T(r[1],bx+52,y+9,{s:13,w:700});y=D.wrap(r[2]||'Not added yet',bx+52,y+28,250,16,{s:12.5,c:r[2]?C.ink2:C.mute},4)+14})}

/* page 4: the reach plan */
function pdfReach(D,c){const C=D.C,x=D.x;const R=c.reach;const steps=(R.steps||[]).slice().sort((a,b)=>a.w-b.w);const W=R.weeks;
  D.head('3','Step 3 · how to reach them','One person’s journey','Every person in the campaign gets the same journey, at their own pace.');D.flowMini('reach');
  let cx=44;cx+=D.chip('calendar',W+' weeks',cx,196)+8;cx+=D.chip('loop',{light:'Light',steady:'Steady',full:'Full'}[R.pace]+' pace',cx,196)+8;cx+=D.chip('send',steps.length+' touchpoints',cx,196)+8;if(R.ads)cx+=D.chip('megaphone','Plus LinkedIn ads in the background',cx,196)+8;
  const chs=REACH_CH.filter(k=>R.ch.includes(k.k)&&steps.some(s=>s.ch===k.k));if(!chs.length)return;
  const gx=44,gy=240,L=140,gw=PW-88,cw=(gw-L)/W,lh=Math.min(70,300/chs.length),AD=R.ads?40:0;D.card(gx,gy,gw,40+chs.length*lh+16+AD,null,false);if(R.ads){const ay=gy+40+chs.length*lh+8;x.save();x.globalAlpha=.14;D.R(gx+L,ay,gw-L-10,26,C.brand);x.restore();D.icon('megaphone',gx+24,ay+13,16,C.brand);D.T('LinkedIn ads',gx+40,ay+18,{s:13,w:700});D.T('Running in the background the whole time, warming up your list',gx+L+(gw-L)/2,ay+18,{s:12,w:600,c:C.brand,al:'center'})}
  for(let i=0;i<W;i++){D.T('Wk '+(i+1),gx+L+(i+.5)*cw,gy+26,{s:11,w:700,c:C.mute,al:'center'});if(i)D.line(gx+L+i*cw,gy+36,gx+L+i*cw,gy+40+chs.length*lh,C.rule,1,[3,4])}
  chs.forEach((k,i)=>{const ly=gy+40+i*lh;if(i%2)D.R(gx+L,ly,gw-L,lh,'#efece6');D.icon(k.ic,gx+24,ly+lh/2,16,C.brand);D.T(k.l,gx+40,ly+lh/2+5,{s:13,w:700})});
  const seen={};const pts=steps.map(s=>{const key=s.w+':'+s.ch;seen[key]=(seen[key]||0)+1;const li=chs.findIndex(k=>k.k===s.ch);return{s,x:gx+L+(s.w-.5)*cw+(seen[key]-1)*24,y:gy+40+li*lh+lh/2}});
  x.beginPath();pts.forEach((p,i)=>{if(!i){x.moveTo(p.x,p.y);return}const q=pts[i-1];const mx=(q.x+p.x)/2;x.bezierCurveTo(mx,q.y,mx,p.y,p.x,p.y)});x.strokeStyle=C.brand;x.lineWidth=2.5;x.stroke();
  pts.forEach((p,i)=>{const ch=REACH_CH.find(k=>k.k===p.s.ch);if(p.s.task)D.circ(p.x,p.y,15,C.paper,C.brand,2);else D.circ(p.x,p.y,15,C.brand,C.ink,1.5);D.icon(ch.ic,p.x,p.y,15,p.s.task?C.brand:'#ffffff');D.circ(p.x+12,p.y-12,8,C.ink);D.T(i+1,p.x+12,p.y-8.5,{s:9.5,w:800,al:'center',c:'#ffffff'})});
  /* the sequence, in order */ const top=gy+40+chs.length*lh+48+AD;D.T('In order',44,top,{s:13,w:700,c:C.brand});const cols=3,colW=(PW-88-2*18)/cols,rows=Math.ceil(steps.length/cols);
  steps.forEach((s,i)=>{const col=Math.floor(i/rows),row=i%rows;const bx=44+col*(colW+18),by=top+14+row*40;if(by>PH-80)return;const ch=REACH_CH.find(k=>k.k===s.ch);
    D.R(bx,by,colW,32,C.paper,C.rule,1);D.T(i+1,bx+16,by+21,{s:12,w:800,al:'center'});D.iconDot(ch.ic,bx+44,by+16,11,s.task?C.soft:C.brand,s.task?C.brand:'#ffffff');D.T('Wk '+s.w,bx+64,by+21,{s:11.5,w:700,c:C.mute});D.T(s.t,bx+104,by+21,{s:13,w:600,max:colW-116})})}

/* page 5: why now, brand by brand */
function pdfWhyNow(D,c){const C=D.C;const tg=campTargets(c);const asset=toolById(c.assets[0])||toolsFor()[0];
  D.head('1','Step 1 · why now','A reason for each brand','Their latest news, and the move that makes your first message land.');D.flowMini('prospects');
  const top=200;D.R(44,top,PW-88,34,C.ink);D.T('Brand',60,top+22,{s:12.5,w:700,c:'#fff'});D.T('What happened',330,top+22,{s:12.5,w:700,c:'#fff'});D.T('The move',700,top+22,{s:12.5,w:700,c:'#fff'});
  tg.slice(0,8).forEach((a,i)=>{const by=top+34+i*64;D.R(44,by,PW-88,64,i%2?'#efece6':C.paper);const n=a.news;const ang=L_ANGLES[n?n.type:'none'];
    D.T(a.name,60,by+26,{s:14,w:800,max:250});D.T(a.people.length?a.people.length+' '+(a.people.length===1?'person':'people'):'Nobody named yet',60,by+44,{s:11.5,c:C.mute});
    D.T(n?L_TRIGGER_LABELS[n.type]+' · '+fmtYM(n.date):'No headline this quarter',330,by+24,{s:12,w:700,c:n?C.brand:C.mute,max:350});if(n)D.wrap(n.text,330,by+41,350,14,{s:11,c:C.ink2},1);
    D.wrap(angleT(ang.move,a,asset),700,by+24,440,15,{s:12},2)});
  if(tg.length>8)D.T('Showing 8 of '+tg.length+'. The rest are in the dashboard.',PW-44,186,{s:12.5,w:600,c:C.mute,al:'right'})}

/* a tiny PDF writer: one full-page JPEG per page */
function makePDF(jpgs){const enc=new TextEncoder();const parts=[];let len=0;const off=[];const push=d=>{const b=typeof d==='string'?enc.encode(d):d;parts.push(b);len+=b.length};
  const w=841.89,h=595.28;const n=jpgs.length;const obj=(i,body)=>{off[i]=len;push(i+' 0 obj\n');body();push('\nendobj\n')};
  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
  obj(1,()=>push('<< /Type /Catalog /Pages 2 0 R >>'));
  obj(2,()=>push('<< /Type /Pages /Count '+n+' /Kids ['+jpgs.map((_,i)=>(3+i*3)+' 0 R').join(' ')+'] >>'));
  jpgs.forEach((u,i)=>{const pg=3+i*3,ct=pg+1,im=pg+2;const bin=atob(u.split(',')[1]);const bytes=new Uint8Array(bin.length);for(let k=0;k<bin.length;k++)bytes[k]=bin.charCodeAt(k);
    const cs='q '+w+' 0 0 '+h+' 0 0 cm /Im'+i+' Do Q';
    obj(pg,()=>push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '+w+' '+h+'] /Resources << /XObject << /Im'+i+' '+im+' 0 R >> >> /Contents '+ct+' 0 R >>'));
    obj(ct,()=>push('<< /Length '+cs.length+' >>\nstream\n'+cs+'\nendstream'));
    obj(im,()=>{push('<< /Type /XObject /Subtype /Image /Width 2480 /Height 1754 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+bytes.length+' >>\nstream\n');push(bytes);push('\nendstream')})});
  const total=3+n*3;const xref=len;push('xref\n0 '+total+'\n0000000000 65535 f \n');for(let i=1;i<total;i++)push(String(off[i]).padStart(10,'0')+' 00000 n \n');
  push('trailer\n<< /Size '+total+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF');
  return new Blob(parts,{type:'application/pdf'})}
