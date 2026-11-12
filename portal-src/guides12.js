/* ═══════════ v12 GUIDES: how to use Plato well, to read here or download as a PDF ═══════════ */
const GUIDES=[
 {k:'start',g:'home',t:'Your first campaign, start to finish',s:'The whole permissionless process in one sitting: profile, preferences, brands, people, a gift, a journey and a launch.',m:12,
  sec:[['Before you build',['Open Agency profile and complete the three tiles: Who you are, Why you and Your assets. Each tile turns dark blue when it is done.','Upload at least one asset: a credentials deck, a case study or a pitch. Paste text if you have no files to hand.','Press Save agency profile. Show me brands that fit appears once everything is complete.']],
   ['Build the campaign',['Press New campaign and give it a name. You choose the problem it solves later, in What to share.','In Who to target, set your prospecting preferences, then press Find prospects now.','Add the brands you like, then open Decision makers and add the people who decide.','In What to share, pick the problem, choose one gift and fill the content bank.','In How to reach, choose your channels or take the Scope & Lens route, and scan your LinkedIn profile.']],
   ['Launch and keep going',['Open Launch and press Launch. Pilot sets out the steps due each day.','Copy or open each message, send it from your own LinkedIn or email, then press I have sent it.','Check Signals for who is warming up, and move real conversations into Pipeline.']]],
  tip:'Ask Plato at any point: what should I do next?'},
 {k:'who',g:'prospects',t:'Who to target: brands worth your time',s:'How Scout finds brands, what the score means, and how to build a short list you can actually work.',m:6,
  sec:[['Set who you want',['Open your agency profile, then Who you want: what you do best, sectors, client size, where, the people you sell to and the problems you solve.','Set it once. Every campaign and every brand score uses it. Change it there any time.']],
   ['Find and choose',['Press Find prospects now. Scout scans for brands that match your agency profile and brings back the best fits.','Every brand has a score out of 100: sector (40), size (25), problems you solve (15), location (10) and timing (10). Tap a score to see the working.','Swipe right to add a brand, left to pass. Twelve to twenty brands is plenty for one campaign.']],
   ['People and timing',['Open Your list and add the two or three people who decide at each brand.','Open Why now. It follows only the brands on your list, newest stories first. Use a fresh story as your reason to get in touch.']]],
  tip:'Fewer, better brands beat a long list every time.'},
 {k:'give',g:'give',t:'What to share: give before you ask',s:'Choosing the problem, picking one gift, and filling the content bank that every message draws on.',m:6,
  sec:[['Start with their problem',['Pick the problem this campaign solves at the top of What to share. Everything Muse suggests is built around it.','Your edge comes from your agency profile. Edit it there and every gift and message updates.']],
   ['Choose one gift',['Picked for you shows the three best fits, with the reason each one suits you.','Made from what you have turns your point of view, proof, sendables and the news on your brands into ideas.','Lead with one gift. Extra gifts are saved for later in the journey.']],
   ['Fill the content bank',['Add the hero piece, a case study, three LinkedIn posts and the rest of the bank. Messages pull from it automatically.','Add a link to the gift so every message carries a trackable link.']]],
  tip:'Useful first, clever second.'},
 {k:'reach',g:'reach',t:'How to reach: a journey, not a blast',s:'Channels, pace and timing, plus getting your LinkedIn profile ready before you connect.',m:5,
  sec:[['Pick the route',['Nothing is selected until you choose. Tap channels, or press Use the Scope & Lens route.','The route covers LinkedIn, email, content every two weeks from week one, events, a workshop, something in the post, a warm call when they engage, and LinkedIn ads in the background.','Choose Light, Steady or Full. There is never more than one email in a week.']],
   ['Scan your LinkedIn profile',['Paste your profile link and press Scan my profile. Relay reads it the way your buyers will and scores it out of 100.','Work through the three to five suggestions and tick each one off. Then you can connect without a note.']],
   ['Meet them in person',['Events lists upcoming events your prospects are likely to attend, soonest first.','Search for where their people are speaking, or host your own breakfast for eight.']]],
  tip:'Never two emails in one week. Always something useful.'},
 {k:'launch',g:'launch',t:'Launch: a few minutes a day',s:'How the daily steps work, why nothing can be marked as sent until it is, and how autopilot works with Premium.',m:4,
  sec:[['Every day',['Open Launch. Due today shows only the steps that are due, in order.','Copy the message or open the channel. Send it from your own account, then press I have sent it.','If a step is not right for someone, skip it. The journey carries on.']],
   ['With Premium',['Amplify sends the steps for you at a human pace, after you approve them, each send or each day.','Accepts, opens, clicks and replies come straight back into Signals.','Pause or resume the whole campaign from the Autopilot card.']]],
  tip:'What is done daily is done well.'},
 {k:'results',g:'home',t:'Signals and pipeline: from interest to revenue',s:'Reading who is warming up, when to call, and tracking deals against your target.',m:4,
  sec:[['Signals',['Signals ranks brands by heat, from the accepts, opens, clicks, replies and meetings that come in.','A warm call unlocks only when someone has engaged and you have their number.']],
   ['Pipeline',['Add a deal when a real conversation starts. Drag it across the stages as it moves.','The tracker shows what you have won against your target, what the pipeline should bring in, and the gap still to find.','Set your target and typical deal size in Settings.']]],
  tip:'Move every real conversation into Pipeline on the day it starts.'},
 {k:'plato',g:'home',t:'Plato: ask anything, or ask him to do it',s:'Plato can see everything in your workspace. Ask questions, get advice, or tell him what to do.',m:3,
  sec:[['Ask',['Who is warming up this week?','What should I do today?','Which brands are the best fit for this campaign, and why?','Suggest an outreach plan for retail brands.']],
   ['Tell him',['Find decision makers at a brand and add them to a campaign.','Start a new campaign called Standing out in travel.','Use the Scope & Lens route for this campaign.','Take me to the pipeline.']],
   ['Good to know',['Plato asks before anything that cannot be undone.','Every change he makes can be undone from the toast that appears.','Switch to Plato view at the top of the page to do everything by talking.']]],
  tip:'If you are not sure where something is, ask Plato.'},
 {k:'method',g:'home',t:'Permissionless prospecting: the principles',s:'Why giving value before you ask works, and the habits that make it work for you.',m:4,
  sec:[['The lessons',['Nobody cares what you can do. Everybody cares about what you can do for them.','We are wired for stories, not facts and figures.','Your ability to deliver is your greatest asset. Their belief in it is your biggest risk.']],
   ['The habits',['Relevant: one problem, a short list of brands, a reason to talk now.','Valuable: something useful they would happily pay for, given freely.','Persistent: a steady rhythm over weeks, never a blast.','Human: you send it, in your own words, from your own accounts.']]],
  tip:'Show up with value before anyone asks for it.'}];
SIDE_IC.guides='book';
VIEWS.guides=()=>secHead('guides','Guides and <span class="serif">how-tos.</span>')+'<p class="sh-p" style="margin:-8px 0 20px">Short guides to using Plato well. Read them here, or download a PDF to keep or share with your team.</p>'+
  '<div class="gdg">'+GUIDES.map(G=>'<article class="gdc">'+agentFace(G.g,52,{badge:false})+'<div class="grow"><small>'+G.m+' minute read</small><h3>'+esc(G.t)+'</h3><p>'+esc(G.s)+'</p><div class="row" style="gap:8px;margin-top:12px"><button class="btn btn-line btn-sm" onclick="openGuide(\''+G.k+'\')">'+ico('doc')+'Read it</button><button class="btn btn-ghost btn-sm" onclick="guidePDF(\''+G.k+'\')">'+ico('download')+'Download PDF</button></div></div></article>').join('')+'</div>';
function openGuide(k){const G=GUIDES.find(x=>x.k===k);let n=0;drawer('<div class="drawer-h"><div class="row between top"><div class="row" style="gap:12px">'+agentFace(G.g,44,{badge:false})+'<div><small class="muted">'+G.m+' minute read</small><h2 class="h-m" style="margin-top:4px">'+esc(G.t)+'</h2></div></div><button class="icon-btn" onclick="closeOverlays()" aria-label="Close">'+ico('x')+'</button></div></div>'+
  '<div class="drawer-b"><p class="lede">'+esc(G.s)+'</p>'+G.sec.map(s=>'<div class="lab" style="margin-top:18px">'+esc(s[0])+'</div><ol class="steps" start="'+(n+1)+'">'+s[1].map(t=>(n++,'<li><span>'+esc(t)+'</span></li>')).join('')+'</ol>').join('')+'<div class="gtip">'+platoFace(28)+'<span>'+esc(G.tip)+'</span></div>'+
  '<button class="btn btn-primary" style="margin-top:18px" onclick="guidePDF(\''+k+'\')">'+ico('download')+'Download as PDF</button></div>')}
async function guidePDF(k){const G=GUIDES.find(x=>x.k===k);toast('Making your PDF');try{await Promise.all(['800 20px "DM Sans"','700 20px "DM Sans"','500 20px "DM Sans"','italic 400 20px "DM Serif Display"'].map(f=>document.fonts.load(f)))}catch(e){}
  const C=pdfCol();const IM={};await Promise.all(['check','arrow','book'].flatMap(i=>[C.brand,'#ffffff',C.ink].map(async col=>{IM[i+col]=await iconImg(i,col)})));
  const face=await imgFrom((AGENTS[G.g]||{}).bot?botURI(G.g):IMG12.plato_bust);const plato=await imgFrom(IMG12.plato_face);const logo=await imgFrom(S.brand.logo);
  /* pack sections into pages of at most two */
  const pages=[];for(let i=0;i<G.sec.length;i+=2)pages.push(G.sec.slice(i,i+2));const jpgs=[];const total=pages.length+1;
  const draw=(fn,idx)=>{const cv=document.createElement('canvas');cv.width=Math.round(PW*PS);cv.height=Math.round(PH*PS);const x=cv.getContext('2d');x.scale(PS,PS);const D=pdfDraw(x,C,IM);D.R(0,0,PW,PH,C.bg);fn(D,x);
    D.T(portalName()+' · '+G.t,44,PH-28,{s:11,c:C.mute,max:700});D.T(idx+' of '+total,PW-44,PH-28,{s:11,c:C.mute,al:'right'});jpgs.push(cv.toDataURL('image/jpeg',.9))};
  draw((D,x)=>{D.R(PW-470,0,470,PH,'#2c54eb');if(face){x.save();x.beginPath();x.arc(PW-235,PH/2-20,190,0,7);x.clip();x.drawImage(face,PW-425,PH/2-210,380,380);x.restore()}
    if(logo){x.drawImage(logo,44,44,Math.min(160,logo.width*(48/logo.height)),48)}else D.T(S.setup.agency||'',44,78,{s:18,w:800});
    D.T('Guide',44,200,{s:16,w:700,c:C.brand});D.wrap(G.t,44,262,640,62,{s:54,w:800},3);const y=D.wrap(G.s,44,470,600,26,{s:19,c:C.ink2},4);
    D.T(G.m+' minute read',44,y+30,{s:14,w:700,c:C.mute});D.T(portalName(),44,PH-80,{s:14,w:700});D.T('Scope & Lens · josh@scopeandlens.com',44,PH-58,{s:12,c:C.mute})},1);
  let n=0;pages.forEach((pg,pi)=>draw((D,x)=>{D.T(G.t,44,70,{s:22,w:800,max:900});const colW=(PW-88-30)/2;
    pg.forEach((s,si)=>{const X=44+si*(colW+30);let y=130;D.card(X,y,colW,PH-210,C.paper);D.T(s[0],X+24,y+44,{s:22,w:800,c:C.brand,max:colW-48});y+=80;
      s[1].forEach(t=>{n++;D.circ(X+38,y-6,15,C.brand);D.T(n,X+38,y-1,{s:13,w:800,al:'center',c:C.on});y=D.wrap(t,X+64,y,colW-96,22,{s:15,c:C.ink},5)+16})});
    if(pi===pages.length-1){if(plato){x.save();x.beginPath();x.arc(70,PH-62,20,0,7);x.clip();x.drawImage(plato,50,PH-82,40,40);x.restore()}D.T(G.tip,100,PH-56,{s:14,w:700,c:C.ink,max:900})}},pi+2));
  const blob=makePDF(jpgs);const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(G.t.replace(/[^a-z0-9]+/gi,'-').replace(/-+$/,'').toLowerCase())+'.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast('Your guide is downloading')}
