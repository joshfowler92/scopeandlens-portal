/* ═══════════ PERFORMANCE SNAPSHOT: every growth effort on four pages, and where to go next ═══════════ */
function nextMoves(){const out=[];const p=pipe();
  staleOpps().slice(0,2).forEach(o=>out.push({ic:'pound',t:'Move '+o.name+' on',w:money(o.value,true)+' is '+(o.next?'quiet for '+daysAgo(o.updated||o.created)+' days':'without a next step')+'. A two line check-in this week keeps it alive.'}));
  ranked().filter(x=>x.s.heat>=3&&x.a.stage!=='opp').slice(0,2).forEach(x=>{const n=nextAction(x.a,x.s);out.push({ic:'bolt',t:n.l+(n.l.includes(x.a.name)?'':' at '+x.a.name),w:x.s.label+'. '+whyLine(x.a,x.s)+'. Warm brands cool fast.'})});
  const c=curCamp();const tg=campTargets(c);const fresh=tg.filter(a=>a.news&&monthsAgo(a.news.date)<=3&&stIdx(a)<1);if(fresh.length)out.push({ic:'megaphone',t:'Use the news at '+fresh.slice(0,2).map(a=>a.name).join(' and '),w:fresh.length+' of your brands have fresh news and have not heard from you yet. Lead with it.'});
  if(p.target&&p.wonVal+p.weighted<p.target)out.push({ic:'target',t:'Add '+Math.max(3,Math.ceil((p.target-p.wonVal-p.weighted)/Math.max(1,+S.setup.avgDeal||60000)))+' more brands to the list',w:'Won plus weighted pipeline is '+money(p.wonVal+p.weighted,true)+' against a '+money(p.target,true)+' target. The gap needs more brands at the top.'});
  if(!libState().items.length)out.push({ic:'upload',t:'Add your case studies to your agency profile',w:'Every message gets stronger with your own proof in it.'});
  if(tg.length&&!campLive(c))out.push({ic:'rocket',t:'Launch '+c.name,w:'Everything is planned. Nothing moves until the first message goes out.'});
  if(!out.length)out.push({ic:'gift',t:'Give something useful to three new brands',w:'The pipeline is moving. Keep the top of it full.'});
  return out.slice(0,5)}
async function downloadSnapshotPDF(){toast('📄 Drawing your snapshot…');await loadTeam();
  try{await Promise.all(['800 20px "DM Sans"','700 20px "DM Sans"','500 20px "DM Sans"','italic 400 20px "DM Serif Display"'].map(f=>document.fonts.load(f)))}catch(e){}
  const C=pdfCol();const need=new Set(['send','chat','calendar','pipeline','pound','target','bolt','megaphone','upload','rocket','gift','people','pulse','arrow','check','star']);
  const IM={};await Promise.all([...need].flatMap(k=>[C.brand,'#ffffff',C.ink,C.mute].map(async col=>{IM[k+col]=await iconImg(k,col)})));const logo=await imgFrom(S.brand.logo);
  const M=teamMembers();const pages=[snapCover,snapTeam,snapBrands,snapNext];const jpgs=[];const c={name:'Growth snapshot'};
  for(let i=0;i<pages.length;i++){const cv=document.createElement('canvas');cv.width=Math.round(PW*PS);cv.height=Math.round(PH*PS);const x=cv.getContext('2d');x.scale(PS,PS);
    const D=pdfDraw(x,C,IM);D.R(0,0,PW,PH,C.bg);pages[i](D,M,{logo});if(i)D.footer(c,i+1,pages.length);jpgs.push(cv.toDataURL('image/jpeg',.92))}
  const blob=makePDF(jpgs);const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(S.setup.agency||'growth').replace(/\W+/g,'-').toLowerCase()+'-growth-snapshot-'+today()+'.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast('📄 Your snapshot is downloading')}
function snapK(M,k){return sum(M,m=>(m.summary&&m.summary.kpis&&m.summary.kpis[k])||0)}
function snapCover(D,M,o){const C=D.C,x=D.x;const p=pipe();const pct=p.target?Math.min(100,Math.round(p.wonVal/p.target*100)):0;
  D.R(0,0,540,PH,C.brand);x.save();x.globalAlpha=.16;D.circ(470,120,190,'#ffffff');D.circ(80,760,140,'#ffffff');x.restore();
  if(o.logo){const r=o.logo.width/o.logo.height,h=56,w=Math.min(200,h*r);D.R(52,52,w+20,h+20,'#ffffff');x.drawImage(o.logo,62,62,w,h)}else{D.circ(84,84,32,C.on);D.T(initials(S.setup.agency||'GS'),84,91,{s:20,w:800,al:'center',c:C.brand})}
  D.T('Growth snapshot',56,300,{s:18,w:700,c:C.on});D.wrap(S.setup.agency||'Your agency',56,360,430,56,{s:54,w:800,c:C.on},3);
  D.T((M.length>1?M.length+' people · ':'')+'the last 30 days',56,500,{s:17,w:600,c:C.on});
  D.T(new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}),56,PH-60,{s:14,w:600,c:C.on});
  D.T('At a glance',600,96,{s:15,w:700,c:C.brand});
  [['send',snapK(M,'touches'),'touches'],['chat',snapK(M,'replies'),'replies'],['calendar',snapK(M,'meetings'),'meetings']].forEach((v,i)=>{const bx=600+i*180;D.card(bx,116,164,112);D.iconDot(v[0],bx+30,148,17,C.soft,C.brand);D.T(v[1],bx+16,200,{s:36,w:800});D.T(v[2],bx+16,218,{s:13,c:C.mute})});
  D.card(600,262,530,150);D.ring(680,337,46,pct);D.T('Won against target',748,300,{s:15,w:700,c:C.brand});D.T(money(p.wonVal,true)+' won',748,338,{s:30,w:800});D.T(money(p.val,true)+' in live pipeline · '+money(Math.max(0,p.target-p.wonVal),true)+' still to find',748,366,{s:13.5,c:C.mute,max:370});
  D.T('Where to go next',600,452,{s:15,w:700,c:C.brand});
  nextMoves().slice(0,3).forEach((m,i)=>{const by=470+i*100;D.card(600,by,530,84);D.circ(632,by+42,15,C.brand);D.T(i+1,632,by+47,{s:13,w:800,al:'center',c:C.on});D.T(m.t,662,by+34,{s:16,w:800,max:450});D.wrap(m.w,662,by+56,450,16,{s:12.5,c:C.mute},2)});
  D.T('Powered by Scope & Lens',PW-44,PH-24,{s:12,w:600,c:C.mute,al:'right'})}
function snapTeam(D,M){const C=D.C;D.head('1','The team','Who is doing what','Outreach, replies and pipeline for each person over the last 30 days.');
  const cols=[['Person',44],['Touches',420],['Replies',540],['Meetings',660],['Pipeline',790],['Won',950]];let y=210;
  D.R(44,y,PW-88,40,C.brand);cols.forEach(c=>D.T(c[0],c[1]+16,y+26,{s:13,w:700,c:C.on}));y+=40;
  M.slice(0,9).forEach((m,i)=>{const k=(m.summary&&m.summary.kpis)||{};D.R(44,y,PW-88,46,i%2?'#efece6':C.paper,C.rule,1);D.circ(76,y+23,14,C.soft);D.T(initials(m.name||m.email),76,y+28,{s:11,w:800,al:'center',c:C.brand});
    D.T(m.name||m.email,100,y+28,{s:14,w:700,max:300});D.T(k.touches||0,436,y+28,{s:14});D.T(k.replies||0,556,y+28,{s:14});D.T(k.meetings||0,676,y+28,{s:14});D.T(money(k.pipeline||0,true),806,y+28,{s:14});D.T(money(k.won||0,true),966,y+28,{s:14});y+=46});
  y+=30;D.T(M.length>1?'Your pipeline by stage':'Pipeline by stage',44,y,{s:15,w:700,c:C.brand});y+=16;const act=LANES.filter(l=>['lead','opportunity','brief','pitch','won'].includes(l.k));const vals=act.map(l=>sum(S.opps.filter(o=>o.lane===l.k),o=>+o.value||0));const mx=Math.max(1,...vals);
  act.forEach((l,i)=>{const bx=44+i*224;const h=Math.round(vals[i]/mx*150);D.card(bx,y+10,208,220);D.R(bx+20,y+190-h,168,h,l.k==='won'?C.accent:C.brand);D.T(l.l,bx+16,y+212,{s:13,w:700,max:180});D.T(money(vals[i],true),bx+16,y+36,{s:20,w:800})})}
function snapBrands(D){const C=D.C;D.head('2','Who is leaning in','The warmest brands','Ranked by every accept, open, click, reply and meeting, with the reason why.');
  const R=ranked().filter(x=>x.s.score>0).slice(0,10);if(!R.length){D.T('No signals yet. Once messages go out, the warmest brands appear here.',44,240,{s:16,c:C.mute});return}
  R.forEach((x,i)=>{const col=i<5?0:1;const by=206+(i%5)*112;const bx=44+col*560;D.card(bx,by,540,96);D.circ(bx+32,by+48,17,x.s.colour||C.brand);D.T(i+1,bx+32,by+53,{s:13,w:800,al:'center',c:'#ffffff'});
    D.T(x.a.name,bx+64,by+38,{s:18,w:800,max:300});D.T((HEAT.find(h=>h.n===x.s.heat)||{}).l||'',bx+520,by+38,{s:13,w:700,al:'right',c:C.brand});D.wrap(whyLine(x.a,x.s),bx+64,by+62,440,16,{s:12.5,c:C.mute},2)})}
function snapNext(D){const C=D.C;D.head('3','Where to go next','Your next five moves','The quickest routes from here to new business revenue, in order.');
  nextMoves().forEach((m,i)=>{const by=206+i*112;D.card(44,by,PW-88,94);D.circ(84,by+47,20,C.brand);D.T(i+1,84,by+53,{s:16,w:800,al:'center',c:C.on});D.iconDot(m.ic,140,by+47,20,C.soft,C.brand);
    D.T(m.t,180,by+40,{s:20,w:800,max:880});D.wrap(m.w,180,by+66,880,17,{s:14,c:C.mute},2)})}
