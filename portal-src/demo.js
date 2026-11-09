/* ── demo workspace: every brand, person and number below is invented ── */
function demoState(base){
  const s=base||blankState();
  Object.assign(s.setup,{done:true,agency:s.setup.agency||'Northgate and Co',you:s.setup.you||'Sam',target:2000000,avgDeal:120000,demo:true});
  s.setup.profile={discipline:'brand',discs:['brand','creative'],discOther:'',asize:'sm',sectors:['finance','retail','travel'],csize:'auto',region:'any',roles:['cmo','brand'],problem:'standout',problems:['standout','story','relevant'],problemOther:''};
  s.setup.offer={uvp:'We find the one idea that makes a brand impossible to ignore.',different:'Half our team have sat in the client chair.',proof:'Lifted spontaneous awareness 9 points in a year for a challenger bank.',solution:'A four-week brand sprint with a clear plan at the end'};
  const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),P=a=>a[Math.floor(Math.random()*a.length)];
  const orgs=[
    ['Harbour and Vale Building Society','finance','Household name'],['Kestrel Outdoor','retail','Mid-size'],['Lumen Travel Group','travel','Household name'],
    ['Copperleaf Insurance','finance','Mid-size'],['Saltmarsh Coffee','retail','Challenger'],['Wick and Tallow','retail','Challenger'],
    ['Tidewater Cruises','travel','Mid-size'],['Marlow Mutual','finance','Mid-size'],['Paddington Pet Co','retail','Mid-size'],
    ['Stonebridge Wealth','finance','Challenger'],['Heron Lake Holidays','travel','Challenger'],['Ivy Lane Cosmetics','retail','Mid-size']];
  const first=['Priya','Tom','Hannah','Marcus','Elena','Jonah','Aisha','Rhys','Grace','Owen','Leila','Callum','Nina','Dev','Freya','Sol'];
  const last=['Hale','Cole','Ward','Okafor','Brennan','Price','Lindqvist','Shah','Morgan','Reyes','Doyle','Harper','Quinn','Ellis'];
  const roles=['CMO','Marketing Director','Head of Brand','Brand Manager','Head of Growth'];
  const news=[['leadership','A new CMO joined from a big retailer this autumn.'],['results','Half-year results flagged a slowdown in new customers.'],['brand','Teased a refreshed look ahead of the spring.'],['expansion','Opening ten new sites across the North next year.']];
  const camp={id:uid(),name:'Standing out in financial services',created:isoDaysAgo(40),status:'live',launched:isoDaysAgo(18),awJ:1,targets:[],assets:['sameness','assets'],reach:{ch:['linkedin','email','event','mail'],weeks:8,pace:'steady',ads:true,steps:null},sent:{}};
  const sigPool=['email_open','email_open','email_click','li_accept','li_engage','content','email_click','li_accept','ad_click','ad_engage'];
  orgs.forEach(([name,sk,size],i)=>{
    const a={id:uid(),name,sk,sector:L_SECTORS[sk].label,size,stage:'find',people:[],signals:[],plays:[],notes:'',nextStep:'',watch:false,created:isoDaysAgo(R(30,60))};
    const np=i<4?3:i<10?2:1;for(let j=0;j<np;j++)a.people.push({id:uid(),name:P(first)+' '+P(last),role:roles[(i+j)%roles.length],email:'',li:''});
    if(i<4){const n=news[i];a.news={type:n[0],date:PROSPECTS_AS_OF,text:n[1]+' (Demo, invented.)',src:'',pub:''}}
    const intensity=i<3?R(7,10):i<7?R(3,6):i<10?R(1,2):0;
    for(let k=0;k<intensity;k++){const t=P(sigPool);a.signals.push({id:uid(),type:t,date:isoDaysAgo(k<2&&i<4?R(0,1):R(0,35)),person:P(a.people).name,campaign:camp.id,note:'',qty:0,src:'demo'})}
    if(i<3)a.signals.push({id:uid(),type:P(['reply','li_reply','meeting']),date:isoDaysAgo(R(0,3)),person:a.people[0].name,campaign:camp.id,note:'',qty:0,src:'demo'});
    if(i<6)a.nextStep=P(['Send the benchmark','Invite to the breakfast','Book the working session','Share the closest case study']);
    camp.targets.push(a.id);s.accounts.push(a)});
  camp.reach.steps=genSteps(camp);s.campaigns=[camp];s.cur=camp.id;
  const lanes=['pitch','opportunity','lead','won','brief'];const vals=[180000,95000,60000,140000,220000];
  s.accounts.slice(0,5).forEach((a,i)=>s.opps.push({id:uid(),name:a.name,accountId:a.id,value:vals[i],lane:lanes[i],weight:null,next:i===2?'':a.nextStep||'Agree scope',source:P(['LinkedIn','Email','Breakfast']),created:isoDaysAgo(R(10,50)),updated:isoDaysAgo(i===1?R(16,25):R(0,8)),closed:lanes[i]==='won'?isoDaysAgo(R(5,40)):''}));
  const types=['li_connect','li_connect','li_msg','email','email','li_accept','reply','call','meeting','value'];
  for(let w=6;w>=0;w--){const n=R(10,20)+(6-w)*2;for(let k=0;k<n;k++){const a=P(s.accounts);s.activity.push({id:uid(),type:P(types),date:isoDaysAgo(w*7+R(0,4)),accountId:a.id,person:'',note:'',qty:1})}}
  s.activity.sort((a,b)=>b.date.localeCompare(a.date));
  s.tasks=[{id:uid(),text:'Finish the Harbour and Vale teardown',done:false,due:isoDaysAgo(0),pri:'high',accountId:s.accounts[0].id},{id:uid(),text:'Send breakfast invites',done:false,due:isoDaysAgo(-3),pri:'medium'}];
  s.launch={mode:'manual',connected:false,demo:true,queue:[],done:[],stats:{approved:0,skipped:0}};s.uploads={outreach:isoDaysAgo(3),ads:isoDaysAgo(6)};s.live={news:{},people:{}};
  s.heatMemo={};s.accounts.forEach(a=>{autoStageDemo(s,a);s.heatMemo[a.id]=Math.max(0,scoreAccount(a).heat-(s.accounts.indexOf(a)<2?1:0))});
  const st=camp.reach.steps.slice().sort((x,y)=>x.w-y.w);s.accounts.slice(0,8).forEach((a,i)=>a.people.forEach((p,j)=>{const n=i<3?3:i<6?2:1;st.slice(0,n).forEach(x=>camp.sent[p.id+':'+x.id]=isoDaysAgo(R(1,16)))}));
  s.game={xp:640,ev:[],badges:['first_brand','list10','first_person','gift','launch','touch25','reply','meeting','won'],days:[0,1,2,3,4,7].map(isoDaysAgo),seenLevel:4,mDone:{}};
  [['touch',6],['approve',1],['reply',0],['brand',2],['person',1]].forEach(([k,q])=>{for(let i=0;i<q;i++)s.game.ev.push({k,d:isoDaysAgo(0),q:1,x:XP[k]})});
  s.library={items:[{id:uid(),name:'Northgate credentials (demo).pdf',size:182000,added:isoDaysAgo(20),cat:'creds',words:96,text:'Northgate and Co is an independent brand and creative agency. We help challenger brands in financial services and retail stand out in categories where everyone looks the same. Unlike most agencies, half our team have sat in the client chair. Our approach starts with a four-week brand sprint, with a clear plan at the end. We lifted spontaneous awareness 9 points in a year for a challenger bank. We grew online sales 38% in twelve months for a homewares retailer.'},
    {id:uid(),name:'Case study, Harbourline Bank (demo).docx',size:64000,added:isoDaysAgo(20),cat:'case',words:52,text:'Case study: Harbourline Bank, an invented demo client. The challenge was a challenger bank that looked like every other bank. The result: spontaneous awareness rose 9 points in a year and app sign ups grew 27% after the relaunch.'}],learned:null};
  {const keep=typeof S!=='undefined'?S:null;S=s;s.library.learned=localDigest();S=keep}
  s.lastSeen=isoDaysAgo(1);s.notifications=[];
  return s;
}
function autoStageDemo(s,a){const keep=typeof S!=='undefined'?S:null;S=s;autoStage(a);S=keep}
