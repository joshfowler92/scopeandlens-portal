/* ═══════════ v13.2: TOURS THAT MATCH THE PORTAL ═══════════
   The tours pointed at parts of Home and the sidebar that v13 replaced, so the demo tour skipped
   its first two steps and opened at step 3. Every step now points at what is really there, with a
   phone alternative after the comma (the first visible one is used). */
function tourPick(sel){for(const p of String(sel).split(',')){const e=$(p.trim());if(!e)continue;const r=e.getBoundingClientRect();if(r.width>0&&r.height>0&&r.right>4&&r.left<innerWidth-4)return p.trim()}return null}
tourVis=function(sel){const v=tourPick(sel);if(v&&String(sel).includes(',')){const st=TOUR.find(s=>s.sel===sel);if(st){st.o=st.o||st.sel;st.sel=v}}return !!v};
const _startTour132=startTour;startTour=function(k){(k&&TOURS[k]?TOURS[k]:TOUR_MAIN).forEach(st=>{if(st.o)st.sel=st.o});closeSheet&&closeSheet();return _startTour132(k)};
TOURS.demo.splice(0,TOURS.demo.length,
  {sel:'[data-tour=hero]',view:'home',t:'A superuser’s home',b:'Plato’s brief comes first: what is live, who is engaging, and the one thing to do today.'},
  {sel:'[data-tour=moves]',view:'home',t:'Today’s priorities',b:'Everything that moves their campaigns forward, most important first: messages due, replies to answer, brands to lean into. Tick each one off.'},
  {sel:'[data-tour=numbers]',view:'home',t:'The numbers',b:'Brands engaging, replies, meetings, opportunities and pipeline, with the trend over eight weeks.'},
  {sel:'#sdg-camp,#tabbar',view:'home',t:'The four steps, always in reach',b:'Nora, Gus, Priya and Otis build every campaign with you. Ticks show what is done.'},
  {sel:'.bgrid,.bsw,.fhero2,.profchips',view:'prospects',t:'Who to target',b:'Nora scores every brand out of 100 from the agency profile, and finds the people who decide.'},
  {sel:'[data-tour=assets],.deck',view:'give',t:'What to share',b:'One problem, one great gift, made from the agency’s own content. Gus reads the hero piece and drafts the blurb.'},
  {sel:'[data-tour=timeline]',view:'reach',t:'How to reach',b:'Priya paces it over twelve weeks, one campaign a quarter, with every message written.'},
  {sel:'.htw,.mc,#view h1',view:'launch',t:'Launch, a few minutes a day',b:'Send it yourself, or let Amplify send what you approve. Each step can only be ticked off once it is due and has really gone.'},
  {sel:'.itl-lean,.sgc-wrap,#view h1',view:'signals',t:'Signals & Intent',b:'Every organisation showing high intent across outreach, ads, events and content, with the people engaging.'},
  {sel:'.pfg,#view h1',view:'perf',t:'Campaign performance',b:'Each campaign’s reach, engagement, conversations and opportunities.'},
  {sel:'.ptk,#view h1',view:'pipeline',t:'Pipeline',b:'Won against target, the weighted pipeline, and the gap still to find.'},
  {sel:'#plato,.tb-pl',view:'home',t:'And me',b:'Ask me anything, or tell me what to do. When you are ready, press Build my own at the top.'});
TOUR_MAIN.splice(0,TOUR_MAIN.length,
  {sel:'.sd-nav,#tabbar',view:'home',t:'Everything in one place',b:'Home, your campaigns, the four steps, your results and help. On a phone it is the bar at the bottom.'},
  {sel:'[data-tour=newcamp],.tb-i:nth-child(2)',view:'home',t:'Start a campaign',b:'Once your agency profile is done, every campaign starts here.'},
  {sel:'#sdg-camp,.tb-i:nth-child(2)',view:'home',t:'Your campaign and its four steps',b:'Nora finds who to target, Gus makes what to share, Priya plans how to reach them and Otis launches it.'},
  {sel:'#sdg-res,.tb-i:nth-child(4)',view:'home',t:'Results',b:'Campaign performance, Signals & Intent, and Pipeline.'},
  {sel:'[data-tour=moves],[data-tour=hero]',view:'home',t:'Today’s priorities',b:'What to do next, across every campaign. Plato reminds you about anything still to do.'},
  {sel:'#nav-agency,.tb-i:nth-child(5)',view:'home',t:'Agency profile, team and settings',b:'Your profile feeds everything.'},
  {sel:'#vmode',view:'home',t:'Dashboard or Chat',b:'Prefer a conversation? Press Chat and do everything by talking to Plato.'},
  {sel:'#plato,.tb-pl',t:'Ask Plato anything',b:'What to do next, who is warming up, or tell me what to do and I will do it.'});
