/* ═══════════ TOURS ═══════════ */
const TOUR_MAIN=[
  {sel:'#nav',view:'home',t:'Home, Outreach, Results',b:'Home is your mission control. Outreach is three steps, then launch. Results is Signals, Revenue and Insights. Switch to Plato view, top right, to do it all in one conversation.'},
  {sel:'[data-tour=path]',view:'home',t:'Your growth engine',b:'The three steps and launch for the campaign you are running now, live. The button always shows the next thing to do.'},
  {sel:'[data-tour=moves]',view:'home',t:'Who to contact today',b:'Picked every morning from who is leaning in, and whose news is fresh. Each one has a reason.'},
  {sel:'[data-tour=game]',view:'home',t:'This week’s goals',b:'A few goals every Monday, picked for where you are. They count towards your level and achievements.'},
  {sel:'#vmode',view:'home',t:'Dashboard or Plato',b:'Prefer a conversation? Switch to Plato and it takes you through today one yes or no at a time.'},
  {sel:'[data-tour=rev]',view:'home',t:'Your number',b:'Won against target, plus the pipeline still to land.'},
  {sel:'[data-tour=intent]',view:'home',t:'Where intent sits',b:'Every signal from every channel in one place, hottest first.'},
  {sel:'[data-tour=ins]',view:'home',t:'Spotted by Scope & Lens',b:'Opportunities, pitches and moves we have spotted, shared with you first.'},
  {sel:'#dot',t:'Ask Plato anything',b:'What to do next, who to target, or tell it what just happened.'}];
const TOURS={};
let TOUR=[],tourI=0,tourDir=1;
function startTour(k){closeOverlays();TOUR=k&&TOURS[k]?TOURS[k]:TOUR_MAIN;
  if(TOUR[0].view&&VIEW!==TOUR[0].view)go(TOUR[0].view,TOUR[0].arg);tourI=0;tourDir=1;['tourHole','tourCard','tourBlock'].forEach(id=>{const e=$('#'+id);if(e)e.remove()});
  const b=document.createElement('div');b.id='tourBlock';b.className='tour-block';const h=document.createElement('div');h.id='tourHole';h.className='tour-hole';const c=document.createElement('div');c.id='tourCard';c.className='tour-card';
  document.body.append(b,h,c);setTimeout(tourShow,380)}
function tourVis(sel){const e=$(sel);if(!e)return false;const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&r.right>4&&r.left<innerWidth-4}
function tourShow(){if(tourI<0)tourI=0;
  while(tourI>=0&&tourI<TOUR.length){const st=TOUR[tourI];if(st.view&&(VIEW!==st.view||(st.arg&&VIEW_ARG!==st.arg)))go(st.view,st.arg);if(tourVis(st.sel))break;tourI+=tourDir}
  if(tourI<0){tourI=0;tourDir=1;return tourShow()}if(tourI>=TOUR.length)return endTour(true);tourDir=1;
  const st=TOUR[tourI];const el=$(st.sel);el.scrollIntoView({block:'center',behavior:'smooth'});
  setTimeout(()=>{const r=el.getBoundingClientRect();const pad=8;const h=$('#tourHole');const vh=innerHeight,vw=innerWidth;if(!h)return;
    const top=Math.max(8,r.top-pad),ht=Math.min(vh-16,r.height+pad*2);Object.assign(h.style,{top:top+'px',left:Math.max(4,r.left-pad)+'px',width:Math.min(vw-8,r.width+pad*2)+'px',height:ht+'px'});
    const c=$('#tourCard');c.innerHTML='<div class="ts">'+TOUR.map((x,i)=>'<i class="'+(i<=tourI?'on':'')+'"></i>').join('')+'<span style="margin-left:6px">'+(tourI+1)+' of '+TOUR.length+'</span></div><h4>'+st.t+'</h4><p>'+st.b+'</p><div class="row between"><button class="btn btn-sm btn-ghost" onclick="endTour()">Skip</button><div class="row">'+(tourI?'<button class="btn btn-sm btn-line" onclick="tourI--;tourDir=-1;tourShow()">Back</button>':'')+'<button class="btn btn-sm btn-primary" onclick="tourI++;tourShow()">'+(tourI===TOUR.length-1?'Finish':'Next')+'</button></div></div>';
    const cw=Math.min(340,vw-24),chh=c.offsetHeight||190;c.style.width=cw+'px';let x,y;
    const roomR=vw-r.right>cw+30,roomB=vh-r.bottom>chh+30;
    if(roomR&&r.width<vw*.5){x=r.right+20;y=r.top}else if(roomB){x=r.left+r.width/2-cw/2;y=r.bottom+18}else if(r.top>chh+30){x=r.left+r.width/2-cw/2;y=r.top-chh-18}else{x=vw-cw-24;y=vh-chh-24}
    x=clamp(x,12,vw-cw-12);y=clamp(y,12,vh-chh-12);Object.assign(c.style,{left:x+'px',top:y+'px'})},420)}
function endTour(done){['tourHole','tourCard','tourBlock'].forEach(id=>{const e=$('#'+id);if(e)e.remove()});const v=$('#view');if(v)v.scrollTo({top:0,behavior:'smooth'});if(TOUR===TOUR_MAIN){S.setup.toured=true;save()}
  if(done&&TOUR===TOUR_MAIN){toast('🎉 That’s the tour. Ask Plato if you get stuck.');confetti()}}

function downloadTemplate(k){const d=DATA_NEEDS.find(x=>x.k===k);if(!d)return;
  const ex={Company:['Example Retail Ltd','Sample Foods Co'],Organisation:['Example Retail Ltd','Sample Foods Co'],Name:['Alex Example','Sam Sample'],Title:['Marketing Director','Head of Brand'],Email:['alex@example.com','sam@example.com'],Opened:['Yes','Yes'],Clicked:['Yes','No'],Replied:['No','No'],Accepted:['Yes','No'],
    Impressions:['1200','640'],Clicks:['14','3'],Engagements:['22','6'],Asset:['The state of attention report','Benchmark tool'],Attended:['Yes','No'],Value:['60000','120000'],Stage:['Opportunity','Pitching'],'Next step':['Send proposal','Book the workshop']};
  const rows=[d.cols].concat([0,1].map(i=>d.cols.map(c=>(ex[c]||['',''])[i])));
  const csv=rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='sample-'+k+'.csv';a.click();toast('📄 Sample file downloaded. Your real export can have more columns.')}
