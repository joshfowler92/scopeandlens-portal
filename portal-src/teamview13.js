/* ═══════════ v13: TEAM, CLEARLY ═══════════
   For the chosen campaign, one row per teammate: how far through the twelve weeks they are, how many of their
   people sit at each stage (not started, in sequence, engaged, hot), and exactly who they are speaking to,
   with plain-English labels instead of unexplained dots. */
const TSTAGE=[['ns','Not started','No touch sent yet'],['seq','In sequence','Touches going out, no response yet'],['eng','Engaged','Opened, clicked, accepted or engaged'],['hot','Hot','Replying, meeting or very active']];
function tStage(x){if((x.heat||0)>=4)return 'hot';if((x.heat||0)>=2)return 'eng';if(x.done)return 'seq';return 'ns'}
jmapSVG=function(c){const W=Math.max(1,c.weeks||12);const wkNow=c.launched?Math.min(W,Math.floor(daysAgo(c.launched)/7)+1):0;
  return '<div class="tb13">'+(wkNow?'<div class="tb-wk"><span>Week '+wkNow+' of '+W+'</span><i><em style="width:'+Math.round(wkNow/W*100)+'%"></em></i></div>':'<div class="tb-wk"><span>Not launched yet</span></div>')+
    c.lanes.map(l=>{const C=l.contacts;const by={};TSTAGE.forEach(s=>by[s[0]]=[]);C.forEach(x=>by[tStage(x)].push(x));const reached=C.length?Math.max(0,...C.map(x=>x.at||0)):0;const n=C.length||1;
      return '<div class="tbr"><div class="tbr-p">'+avOf(l.m)+'<div><b>'+esc(l.m.name||l.m.email)+'</b><small>'+C.length+' '+(C.length===1?'person':'people')+' · furthest at week '+(reached||0)+'</small></div></div>'+
        '<div class="tbr-bar" role="img" aria-label="'+TSTAGE.map(s=>by[s[0]].length+' '+s[1].toLowerCase()).join(', ')+'">'+TSTAGE.map(s=>by[s[0]].length?'<i class="ts-'+s[0]+'" style="flex:'+by[s[0]].length+'" data-tip="'+by[s[0]].length+' '+s[1].toLowerCase()+'">'+by[s[0]].length+'</i>':'').join('')+(C.length?'':'<i class="ts-none">No people yet</i>')+'</div>'+
        '<div class="tbr-who">'+C.slice().sort((a,b)=>(b.heat||0)-(a.heat||0)).slice(0,6).map(x=>{const st=TSTAGE.find(s=>s[0]===tStage(x));return '<span class="tw13 ts-'+st[0]+'">'+logo(x.brand,20)+'<b>'+esc(x.person)+'</b><small>'+esc(x.brand)+' · '+st[1]+(x.done?', week '+x.at:'')+'</small></span>'}).join('')+(C.length>6?'<span class="tw13 more">+'+(C.length-6)+' more</span>':'')+'</div></div>'}).join('')+
    '<div class="tb-lg">'+TSTAGE.map(s=>'<span><i class="ts-'+s[0]+'"></i><b>'+s[1]+'</b> '+s[2]+'</span>').join('')+'</div></div>'};
const _teamHTML13=teamHTML;teamHTML=function(){return String(_teamHTML13()).replace('The journey, person by person','Where everyone is, and who they are speaking to').replace(/<div class="legend" style="margin-top:8px"><span><i class="lg-dot"><\/i>Each dot is a person[\s\S]*?<\/span><\/div>/,'').replace('The whole team, <span class="serif">at a glance.</span>','Your team, <span class="serif">at a glance.</span>')};
