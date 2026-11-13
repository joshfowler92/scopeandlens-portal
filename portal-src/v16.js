/* ═══════════ v16 FLOW: the journey as a living, branching flow, and a crew with more character ═══════════
   1. Plan the journey gets a Flow view next to the timeline. Your real touchpoints, top to bottom, with the
      waits between them, the moments it branches (accepted? opened?) and where it hands over to you.
   2. The bots get a little more life: a soft sheen, rosy cheeks, a glint in the eye, and the odd glance around.
   3. Empty states get a crew member instead of a blank circle. */

/* ── 1. the flow ────────────────────────────────────────────── */
const FLOW_COL={linkedin:'#0a66c2',email:'var(--brand)',phone:'#0b9f8a',event:'#e8890c',workshop:'#7048e8',mail:'#e03131',social:'#c98a12'};
let JMODE=(function(){try{return localStorage.getItem('sl-jmode')||''}catch(e){return ''}})();
function jMode(){return JMODE||(isApp()?'flow':'timeline')}
function setJMode(m){JMODE=m;try{localStorage.setItem('sl-jmode',m)}catch(e){}buzz();const card=$('.seq-card');if(!card)return;
  card.classList.toggle('jm-flow',m==='flow');$$('.jm-t button',card).forEach(b=>b.classList.toggle('on',b.dataset.m===m));
  if(m==='flow')flowPlay();else{try{ropeInit()}catch(e){}}}
function flowNode(o){const ch=REACH_CH.find(x=>x.k===o.ch);const col=o.col||(ch?FLOW_COL[ch.k]:'var(--brand)');
  return '<button type="button" class="jfn'+(o.cls?' '+o.cls:'')+'"'+(o.id?' onclick="editTouch(\''+o.id+'\')" aria-label="'+esc(o.t)+'. Tap to change it"':' tabindex="-1"')+' style="--fc:'+col+'">'+
    '<span class="jfn-ic">'+ico(o.ic||(ch?ch.ic:'send'))+'</span><span class="jfn-t"><b>'+esc(o.t)+'</b>'+(o.s?'<small>'+esc(o.s)+'</small>':'')+'</span>'+(o.who?'<span class="jfn-w">'+agentFace(o.who,26,{badge:false})+'</span>':'')+'</button>'}
function flowWire(lbl){return '<i class="jfw">'+(lbl?'<em>'+esc(lbl)+'</em>':'')+'</i>'}
function flowSplit(q,yes,no){return '<div class="jfs"><span class="jfs-q">'+ico('layers')+esc(q)+'</span></div><div class="jfb"><div><span class="jfb-t y">Yes</span><i class="jfw sh"></i>'+flowNode(yes)+'</div><div><span class="jfb-t n">Not yet</span><i class="jfw sh"></i>'+flowNode(no)+'</div></div><i class="jfm"></i>'}
function flowHTML(c){const R=c.reach;const st=(R.steps||[]).slice().sort((a,b)=>a.w-b.w);const tg=campTargets(c);const ppl=sum(tg,a=>a.people.length);
  if(!st.length)return '<div class="empty">'+agentFace('reach',44,{badge:false})+'Pick at least one channel above and Priya will draw the flow.</div>';
  const gift=toolById(c.assets[0]);let h=flowNode({t:tg.length+' brand'+(tg.length===1?'':'s')+', '+ppl+' decision maker'+(ppl===1?'':'s'),s:'Scored and ready, from Nora',ic:'target',col:'#0b9f8a',cls:'start',who:'prospects'});
  let prevW=0,splitLI=false,splitEM=false;
  st.forEach((s,i)=>{const gap=s.w-prevW;h+=flowWire(i===0?'Week '+s.w:gap<=0?'Same week':'Wait '+gap+' week'+(gap===1?'':'s'));prevW=s.w;
    const ch=REACH_CH.find(x=>x.k===s.ch);const isGift=gift&&/gift|share|teardown|report|benchmark/i.test(s.t);
    h+=flowNode({id:s.id,ch:s.ch,t:s.t,s:(ch?ch.l:'')+' · week '+s.w+(s.task?' · a light touch':''),who:isGift?'give':'reach'});
    if(!splitLI&&s.ch==='linkedin'&&/connect/i.test(s.t)){splitLI=true;h+=flowWire('A few days');
      h+=flowSplit('Accepted?',{t:'Carry on',s:'The next touch goes as planned',ic:'check',col:'#0b9f8a'},{t:'Like a recent post',s:'Warm up, then try again',ic:'heart',col:'#0a66c2'})}
    else if(!splitEM&&s.ch==='email'&&i>0){splitEM=true;h+=flowWire('A few days');
      h+=flowSplit('Opened it?',{t:'Otis flags them',s:'Warming up: lean in',ic:'bolt',col:'#e03131'},{t:'Try another channel',s:'Priya switches it up next',ic:'loop',col:'#7048e8'})}});
  h+=flowWire('Whenever they reply')+flowNode({t:'Over to you: book the meeting',s:'The flow stops for them. The conversation starts.',ic:'check',col:'#14102e',cls:'goal',who:'launch'});
  return '<div class="jflow" aria-label="The campaign as a flow">'+h+'</div>'}
let FLOW_TOK=0;
function flowPlay(){const tok=++FLOW_TOK;const f=$('.jflow');if(!f)return;const seq=$$('.jfn,.jfw:not(.sh),.jfs,.jfb',f);
  if(V14_RM){seq.forEach(n=>n.classList.add('jlit'));return}
  seq.forEach(n=>n.classList.remove('jlit','jgo'));let t=150;
  seq.forEach(n=>{setTimeout(()=>{if(tok!==FLOW_TOK||!n.isConnected)return;n.classList.add(n.classList.contains('jfw')?'jgo':'jlit');if(n.classList.contains('jfb'))$$('.jfn,.jfw',n).forEach(x=>x.classList.add(x.classList.contains('jfw')?'jgo':'jlit'))},t);t+=n.classList.contains('jfw')?110:70})}
(function(){const _ra16=VIEWS.reach_after;VIEWS.reach_after=function(){const r=_ra16&&_ra16.apply(this,arguments);
  const card=$('.seq-card');const c=curCamp();if(!card||!c||card.dataset.fl)return r;card.dataset.fl=1;
  const hd=card.querySelector('.card-h h3');if(hd)hd.insertAdjacentHTML('afterend','<div class="jm-t" role="tablist" aria-label="How to see the journey"><button type="button" data-m="flow" onclick="setJMode(\'flow\')">'+ico('layers')+'Flow</button><button type="button" data-m="timeline" onclick="setJMode(\'timeline\')">'+ico('calendar')+'Timeline</button></div>');
  const wrap=card.querySelector('.seq-wrap');if(wrap)wrap.insertAdjacentHTML('afterend',flowHTML(c));
  const m=jMode();card.classList.toggle('jm-flow',m==='flow');$$('.jm-t button',card).forEach(b=>b.classList.toggle('on',b.dataset.m===m));
  if(m==='flow')flowPlay();return r}})();

/* ── 2. the crew, with a bit more life ──────────────────────── */
(function(){const _bs16=botSVG;botSVG=function(kind,col,x,crop){let s=_bs16(kind,col,x,crop);
  s=s.replace('<rect width="120" height="120" fill="'+col+'"/>','<rect width="120" height="120" fill="'+col+'"/><ellipse cx="36" cy="22" rx="40" ry="26" fill="#fff" opacity=".13"/><ellipse cx="96" cy="112" rx="50" ry="30" fill="#000" opacity=".1"/>');
  s=s.replace('<g class="eyes">','<ellipse cx="41" cy="72" rx="5" ry="3" fill="'+col+'" opacity=".22"/><ellipse cx="79" cy="72" rx="5" ry="3" fill="'+col+'" opacity=".22"/><g class="pupils"><g class="eyes">');
  s=s.replace(/(<g class="eyes">(?:(?!<\/g>).)*)<\/g>/,'$1<circle cx="49.6" cy="58.6" r="1.6" fill="#fff"/><circle cx="73.6" cy="58.6" r="1.6" fill="#fff"/></g></g>');
  return s}})();

/* ── 3. a crew member in every empty state ──────────────────── */
function emptyBots(){$$('#view .empty>.orb').forEach(o=>{const k=AGENTS[VIEW]&&AGENTS[VIEW].bot?VIEW:['signals','pipeline','team','insights'].includes(VIEW)?'launch':'prospects';
  o.outerHTML='<span class="emb">'+agentFace(k,46,{badge:false})+'</span>'})}
(function(){const _go16=go;go=function(){const r=_go16.apply(this,arguments);setTimeout(emptyBots,40);return r}})();
