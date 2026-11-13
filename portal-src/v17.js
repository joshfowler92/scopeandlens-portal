/* ═══════════ v17 THE CREW, AS PEOPLE ═══════════
   The four bots become four characters with real names and real personalities, drawn as cartoons in our colours:
   Nora finds who to target, Gus makes what to share, Priya plans how to reach them, Otis launches it.
   Drawn in SVG so they stay sharp at any size, and they still blink, glance around and talk. */

const CREW17={
  prospects:{n:'Nora',bot:'nora',role:'Finds who to target',motto:'Fewer, better, sooner.',
    me:'I find the few brands worth your time and the people who actually sign things off.',
    bio:'Reads annual reports for fun. Knows who really signs things off before they do. Quietly, relentlessly nosy.',
    loves:'A fresh trigger event',hates:'Lists of 5,000 “leads”',quirk:'Has never once said “just circling back”'},
  give:{n:'Gus',bot:'gus',role:'Makes what to share',motto:'Useful first.',
    me:'I turn your best work into something so useful they would pay for it. Then you give it away.',
    bio:'Would give you the jumper off his back, then knit you a better one. Believes nobody ever ignored a genuinely good gift.',
    loves:'Making something they keep',hates:'Brochures dressed up as gifts',quirk:'Wraps everything, even PDFs'},
  reach:{n:'Priya',bot:'priya',role:'Plans how to reach them',motto:'Steady, never pushy.',
    me:'I plan which channels, how often, and when to stay quiet and let them come to you.',
    bio:'Remembers everyone’s name, and their dog’s. Has a plan for the plan. Would rather vanish than double-text.',
    loves:'Perfect timing',hates:'Two emails before lunch',quirk:'Colour-codes her calendar by mood'},
  launch:{n:'Otis',bot:'otis',role:'Launches it with you',motto:'Ten minutes a day.',
    me:'I line up each day’s messages in your voice. You approve them, and they go.',
    bio:'Lives for a countdown. Calm when it matters, giddy when someone replies. Checks the dials so you do not have to.',
    loves:'The first reply of the week',hates:'Anything sent without your say-so',quirk:'Says “wheels up” far too often'}};
Object.keys(CREW17).forEach(k=>Object.assign(AGENTS[k],CREW17[k]));

/* ── the drawings ─────────────────────────────────────────── */
const CI='#15151c';
function crewArt(kind){const O='stroke="'+CI+'" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"';
  const sk={nora:'#f6caa6',gus:'#b47448',priya:'#c58660',otis:'#f8d7bd'}[kind]||'#f6caa6';
  const ear=(x)=>'<ellipse cx="'+x+'" cy="63" rx="5" ry="6.5" fill="'+sk+'" '+O+'/>';
  const head='<path d="M37 60c0-15 10-26 23-26s23 11 23 26c0 15-9 27-23 27S37 75 37 60z" fill="'+sk+'" '+O+'/>';
  const neck='<path d="M53 82v12h14V82" fill="'+sk+'" '+O+'/>';
  const cheeks='<ellipse cx="45" cy="70" rx="4.4" ry="2.6" fill="#ff7a7a" opacity=".42"/><ellipse cx="75" cy="70" rx="4.4" ry="2.6" fill="#ff7a7a" opacity=".42"/>';
  const eyes=(ry)=>'<g class="pupils"><g class="eyes"><ellipse cx="51" cy="61" rx="3.1" ry="'+(ry||3.9)+'" fill="'+CI+'"/><ellipse cx="69" cy="61" rx="3.1" ry="'+(ry||3.9)+'" fill="'+CI+'"/><circle cx="52.2" cy="59.4" r="1.15" fill="#fff"/><circle cx="70.2" cy="59.4" r="1.15" fill="#fff"/></g></g>';
  const body=(fill)=>'<path d="M18 124c2-20 18-31 42-31s40 11 42 31z" fill="'+fill+'" '+O+'/>';
  let s='';
  if(kind==='nora'){const hair='#7b3a1e';
    s=body('#2c56ed')+'<path d="M48 94l12 13 12-13" fill="#f6f1e7" '+O+'/>'+'<path d="M60 107v17" '+O+'/>'+
      neck+
      '<circle cx="60" cy="27" r="10.5" fill="'+hair+'" '+O+'/>'+'<path d="M47 20l27 12" stroke="#ffd43b" stroke-width="4" stroke-linecap="round"/><path d="M74 32l4 1.8" stroke="#ff8fa3" stroke-width="4" stroke-linecap="round"/><path d="M45.5 19.3l-2-.9" stroke="'+CI+'" stroke-width="3" stroke-linecap="round"/>'+
      ear(37)+ear(83)+head+
      '<path d="M36 62c-2-18 9-29 24-29s27 10 24 29c-4-9-9-13-14-14-3 5-11 7-20 6-6 1-11 3-14 8z" fill="'+hair+'" '+O+'/>'+
      
      eyes()+
      '<g fill="#fff" fill-opacity=".28" stroke="'+CI+'" stroke-width="2.6"><circle cx="51" cy="61" r="8.2"/><circle cx="69" cy="61" r="8.2"/></g><path d="M59.2 60.5q.8-1.4 1.6 0" '+O+' fill="none"/>'+
      '<path d="M43 49.5q5-3.4 11-1.2" '+O+' fill="none"/><path d="M64 47.6q6-3.6 12 .4" '+O+' fill="none"/>'+
      cheeks+'<path class="b-m" d="M55 74.5q5 3 10-1.2" '+O+' fill="none"/>'}
  if(kind==='gus'){const beard='#3a2417';
    s=body('#14102e')+'<path d="M30 112q30 6 60 0M26 120q34 6 68 0" stroke="#f6f1e7" stroke-opacity=".35" stroke-width="2" fill="none"/>'+
      neck+ear(37)+ear(83)+head+
      '<path d="M37.5 62c1 21 10 31 22.5 31s21.5-10 22.5-31c-4 7-11 10-22.5 10S41.5 69 37.5 62z" fill="'+beard+'" '+O+'/>'+
      '<path d="M50 72q5-5 10-1.6q5-3.4 10 1.6q-5 3-10 .8q-5 2.2-10-.8z" fill="'+beard+'" '+O+'/>'+
      '<path class="b-m" d="M53 77q7 7 14 0z" fill="#fff" '+O+'/>'+
      '<path d="M34 54c0-17 11-26 26-26s26 9 26 26z" fill="#2c56ed" '+O+'/><rect x="31" y="47" width="58" height="11" rx="5.5" fill="#1d3fc4" '+O+'/>'+
      '<path d="M40 50v5M46 50v5M52 50v5M58 50v5M64 50v5M70 50v5M76 50v5M82 50v5" stroke="#fff" stroke-opacity=".3" stroke-width="1.6"/>'+
      '<circle cx="60" cy="24" r="7" fill="#f6f1e7" '+O+'/>'+
      
      '<g class="pupils"><g class="eyes"><path d="M47 63.5q4-5.4 8 0M65 63.5q4-5.4 8 0" stroke="'+CI+'" stroke-width="3.2" stroke-linecap="round" fill="none"/></g></g>'+
      '<ellipse cx="44" cy="68" rx="4.4" ry="2.6" fill="#ff7a7a" opacity=".38"/><ellipse cx="76" cy="68" rx="4.4" ry="2.6" fill="#ff7a7a" opacity=".38"/>'+
      '<g transform="rotate(-8 82 108)"><rect x="70" y="97" width="25" height="21" rx="3" fill="#f6f1e7" '+O+'/><path d="M82.5 97v21M70 106h25" stroke="#2c56ed" stroke-width="4"/><path d="M82.5 97q-7-8-9-2 0 3 9 2zM82.5 97q7-8 9-2 0 3-9 2z" fill="#2c56ed" '+O.replace('2.4','1.8')+'/></g>'}
  if(kind==='priya'){const hair='#1d1520';
    s='<path d="M33 62c-4-22 10-32 27-32s31 10 27 32c3 12 4 24-1 34H35c-5-10-4-22-2-34z" fill="'+hair+'" '+O+'/>'+
      body('#5eead4')+'<path d="M50 94q10 9 20 0" stroke="'+CI+'" stroke-width="2.4" fill="none"/>'+
      neck+ear(37)+ear(83)+head+
      '<path d="M37 58c0-15 10-24 24-24 13 0 23 9 22 24-6-8-14-12-22-11-4 4-13 9-24 11z" fill="'+hair+'" '+O+'/>'+
      [74,83,92,101].map((y,i)=>'<ellipse cx="'+(86+i*.6)+'" cy="'+y+'" rx="5.6" ry="5.2" fill="'+hair+'" '+O+'/>').join('')+'<rect x="82" y="105" width="9" height="4" rx="2" fill="#ffd43b" '+O.replace('2.4','1.6')+'/>'+
      '<path d="M33 60c0-30 54-30 54 0" stroke="'+CI+'" stroke-width="6" fill="none"/><path d="M33 60c0-30 54-30 54 0" stroke="#f6f1e7" stroke-width="2.6" fill="none"/><rect x="28" y="54" width="10" height="16" rx="4.5" fill="#f6f1e7" stroke="'+CI+'" stroke-width="2.4"/><path d="M33 68c0 9 7 14 15 12" stroke="'+CI+'" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="49" cy="79.6" r="2.8" fill="#ff8fa3" stroke="'+CI+'" stroke-width="1.6"/>'+
      '<circle cx="83.5" cy="70.5" r="2" fill="#ffd43b" stroke="'+CI+'" stroke-width="1.2"/>'+
      eyes()+'<path d="M45 52.5q5-3 10-.6M65 51.9q5-2.4 10 .6" '+O+' fill="none"/>'+
      cheeks+'<path class="b-m" d="M54 73q6 6.5 12 0z" fill="#fff" '+O+'/>'+
      '<circle cx="60" cy="74" r="0" />'}
  if(kind==='otis'){const cap='#6b3f22';
    s=body('#2c56ed')+'<path d="M40 97l20 10 20-10" fill="none" '+O+'/>'+
      neck+'<path d="M43 92c10 6 24 6 34 0l3 8c-12 7-28 7-40 0z" fill="#f6f1e7" '+O+'/><path d="M78 96c7 2 13 8 16 15-6-1-11-4-14-8z" fill="#f6f1e7" '+O+'/>'+
      '<path d="M35 58v14c0 4 6 4 6 0V60z M85 58v14c0 4-6 4-6 0V60z" fill="'+cap+'" '+O+'/>'+
      head+
      '<path d="M41 62c-1-6 0-10 3-13M79 62c1-6 0-10-3-13" stroke="#e8590c" stroke-width="4" stroke-linecap="round" fill="none"/>'+
      '<path d="M35 60c-2-20 9-31 25-31s27 11 25 31c-6-9-14-13-25-13s-19 4-25 13z" fill="'+cap+'" '+O+'/>'+
      '<path d="M36 47q24-10 48 0" stroke="'+CI+'" stroke-width="5" fill="none"/>'+
      '<g fill="#5eead4" stroke="'+CI+'" stroke-width="2.4"><circle cx="49.5" cy="44" r="7"/><circle cx="70.5" cy="44" r="7"/></g><path d="M47 41.5l3-2.5M68 41.5l3-2.5" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M56.5 44h7" '+O+'/>'+
      eyes()+'<path d="M45 54q5-2 10 0M65 54q5-2 10 0" '+O+' fill="none"/>'+
      '<g fill="#c2592a" opacity=".55"><circle cx="44" cy="67" r=".9"/><circle cx="46.5" cy="69.5" r=".9"/><circle cx="42.5" cy="70" r=".9"/><circle cx="76" cy="67" r=".9"/><circle cx="73.5" cy="69.5" r=".9"/><circle cx="77.5" cy="70" r=".9"/></g>'+
      cheeks+'<path class="b-m" d="M52.5 72.5q7.5 8 15 0z" fill="#fff" '+O+'/>'}
  return s}
const CREW_KINDS=['nora','gus','priya','otis'];
botSVG=function(kind,col,x,crop){const map={scout:'nora',radar:'nora',muse:'gus',spark:'gus',relay:'priya',ping:'priya',pilot:'otis',rocket:'otis'};kind=map[kind]||kind;
  if(!CREW_KINDS.includes(kind))kind='nora';
  const ns=x?' xmlns="http://www.w3.org/2000/svg" width="240" height="240"':'';
  const id='cc'+kind+(x?'x':'');
  return '<svg'+ns+' viewBox="'+(crop?'24 18 72 72':'0 0 120 120')+'" class="botsvg b2 c17 b-'+kind+'">'+(x?'<defs><clipPath id="c"><circle cx="60" cy="60" r="60"/></clipPath></defs>':'')+
    '<g'+(x?' clip-path="url(#c)"':'')+'><rect width="120" height="120" fill="'+col+'"/><circle cx="96" cy="24" r="30" fill="#fff" opacity=".1"/><circle cx="16" cy="104" r="22" fill="#000" opacity=".07"/>'+crewArt(kind)+'</g></svg>'};

/* ── meet the crew: a proper profile for each one ──────────── */
function crewMeet(k){k=k||'prospects';const A=AGENTS[k];if(!A)return;buzz();
  const tabs=OUT_K.map(x=>'<button type="button" class="cm-tab'+(x===k?' on':'')+'" style="--ac:'+AGENTS[x].col+'" onclick="crewMeet(\''+x+'\')" aria-label="Meet '+esc(AGENTS[x].n)+'">'+agentFace(x,40,{badge:false})+'<small>'+esc(AGENTS[x].n)+'</small></button>').join('');
  const m=MODULES.find(z=>z.k===k)||{l:''};const i=OUT_K.indexOf(k);
  const html='<div class="cm" style="--ac:'+A.col+'"><div class="cm-tabs" role="tablist" aria-label="The crew">'+tabs+'</div>'+
    '<div class="cm-card"><div class="cm-art">'+botSVG(A.bot,A.col)+'</div><div class="cm-txt"><span class="cm-step">Step '+(i+1)+' · '+esc(m.l)+'</span><h2>'+esc(A.n)+'</h2><p class="cm-role">'+esc(A.role)+'</p>'+
    '<p class="cm-bio">'+esc(A.bio||A.me)+'</p><p class="cm-motto">“'+esc(A.motto)+'”</p></div></div>'+
    '<div class="cm-facts"><div><small>Loves</small><b>'+esc(A.loves||'')+'</b></div><div><small>Can’t stand</small><b>'+esc(A.hates||'')+'</b></div><div><small>Quirk</small><b>'+esc(A.quirk||'')+'</b></div></div>'+
    '<div class="cm-foot"><button class="btn btn-ghost" onclick="closeOverlays()">Close</button><button class="btn btn-primary" onclick="closeOverlays();go(\''+k+'\')">Go to '+esc(m.l)+ico('arrow')+'</button></div></div>';
  if(isApp())sheet(html,'cm-sheet');else modal(html)}
/* a "Meet the crew" button sits with the crew on every stage */
(function(){const _cd17=crewDeck;crewDeck=function(k){const h=_cd17(k);if(!h)return h;
  const b='<button type="button" class="dk-meet" onclick="crewMeet(\''+k+'\')">'+ico('people')+'<span class="dm-l">Meet the crew</span><span class="dm-s">Crew</span></button>';
  return /class="dk-camp"[\s\S]*?<\/button>/.test(h)?h.replace(/(class="dk-camp"[\s\S]*?<\/button>)/,'$1'+b):h.replace('<div class="dk-team"',b+'<div class="dk-team"')}})();
