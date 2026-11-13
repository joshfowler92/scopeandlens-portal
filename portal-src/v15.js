/* ═══════════ v15 CALM: title first, one crew, and a phone that feels like a paid app ═══════════
   1. Every stage starts with its title. The crew lives in one place under it: the four bots, what they are
      saying, your campaign, and your move. No second strip of bots above the title, no extra speech bubble.
   2. Launch follows the same order: the hero title, the crew, then how you send.
   3. On a phone, less is shown at once. Long lists show the best few with a "Show more", explanations that
      only matter the first time are folded away, and side-by-side rows stack instead of squeezing. */

/* ── 1. one crew, under the title ───────────────────────────── */
stepStrip=function(){return ''};
(function(){const _sh15=secHead;
  secHead=function(k,title,actions,tabs){if(!OUT_K.includes(k))return _sh15(k,title,actions,tabs);
    return '<div class="sh st15"><div class="sh-l"><h1 class="sh-t">'+title+'</h1></div>'+(actions?'<div class="sh-a">'+actions+'</div>':'')+'</div>'+crewDeck(k)+(tabs||'')}})();
/* the campaign you are working on sits at the top of the crew, with a way to switch */
(function(){const _cd15=crewDeck;crewDeck=function(k){const h=_cd15(k);const c=curCamp();if(!h||!c)return h;
  const many=S.campaigns.filter(x=>!(isBlankCamp(x)&&!x.touched)).length>1;
  const top='<div class="dk-top"><button class="dk-camp" onclick="'+(isApp()?'campSheet()':"go('camps')")+'" aria-label="Campaign: '+esc(c.name)+(many?'. Switch campaign':'')+'"><small>Campaign</small><b>'+esc(c.name)+'</b>'+(many?'<em>Switch</em>':'')+'</button>'+(isApp()?'':campTeamBar(c))+'</div>';
  return h.replace(/(<div class="deck"[^>]*>)/,'$1'+top)}})();
/* on a phone the chat shows one line at a time, each replacing the last, so it stays short but alive */
(function(){const _cp15=crewPlay;crewPlay=function(){_cp15();const deck=$('.deck');if(!deck||V14_RM)return;
  const ms=$$('.dk-m',deck);const tok=CREW_TOK;
  const obs=new MutationObserver(()=>{if(tok!==CREW_TOK||!deck.isConnected){obs.disconnect();return}
    /* only touch an element that still needs it: classList.add always rewrites the attribute, which would wake this observer again */
    const on=ms.filter(m=>m.classList.contains('on'));on.slice(0,-1).forEach(m=>{if(!m.classList.contains('past'))m.classList.add('past')});
    if(ms.every(m=>m.classList.contains('said')))obs.disconnect()});
  ms.forEach(m=>obs.observe(m,{attributes:true,attributeFilter:['class']}))}})();

/* ── 2. Launch: title, crew, then how you send ─────────────── */
(function(){const _la15=VIEWS.launch_after;VIEWS.launch_after=function(){
  const lh=$('.lhero');if(lh&&!$('.deck')){lh.insertAdjacentHTML('afterend',crewDeck('launch'));const d=$('.deck'),ht=$('.htw');if(d&&ht)d.after(ht)}
  return _la15&&_la15.apply(this,arguments)}})();

/* ── 3. the phone ───────────────────────────────────────────── */
/* the current page name on <body>, so the phone styles can be specific per page */
(function(){const _go15=go;go=function(k){const r=_go15.apply(this,arguments);try{document.body.dataset.view=VIEW}catch(e){}return r}})();
/* show the first n items of a list, with a quiet button for the rest */
function mClamp(box,n,label,also){if(!box||box.dataset.mc)return;const items=[...box.children].filter(x=>!x.classList.contains('m15-more')&&x.offsetParent!==null||x.classList.contains('m15-x'));
  if(items.length<=n+1)return;box.dataset.mc=1;const extra=items.slice(n);extra.forEach(x=>x.classList.add('m15-x'));
  const b=document.createElement('button');b.type='button';b.className='m15-more';b.innerHTML=(label||'Show {n} more').replace('{n}',extra.length)+ico('arrow','a');
  (also||[]).forEach(x=>x&&x.classList.add('m15-x'));
  b.onclick=()=>{buzz();extra.concat(also||[]).forEach(x=>x&&x.classList.remove('m15-x'));b.remove()};(box.tagName==='TBODY'?box.closest('table'):box).after(b)}
/* people lists inside each intent tile: two people, then "+n more" */
function mPeople(){$$('.itl-p').forEach(ul=>{if(ul.dataset.mc)return;ul.dataset.mc=1;const li=[...ul.children];const more=li.find(x=>x.classList.contains('more'));
  const ppl=li.filter(x=>x!==more);if(ppl.length<=2)return;const extra=ppl.slice(2);extra.forEach(x=>x.classList.add('m15-x'));
  const already=more?(parseInt((more.textContent.match(/\d+/)||[0])[0],10)||0):0;const n=extra.length+already;
  if(more)more.textContent='+'+n+' more';else{const m=document.createElement('li');m.className='more';m.textContent='+'+n+' more';const id=(ul.closest('[data-id]')||{}).dataset;m.onclick=()=>{extra.forEach(x=>x.classList.remove('m15-x'));m.remove()};ul.appendChild(m)}})}
function phoneTidy(){if(!isApp())return;const v=VIEW;
  if(v==='home'){mClamp($('.hp-l'),3,'Show {n} more');}
  if(v==='prospects'){}
  if(v==='give'){mClamp($('.feat'),2,'Show {n} more ideas');mClamp($('.bank-g'),3,'Show {n} more for the bank')}
  if(v==='reach'){const eg=$('.evg');if(eg){const after=[];let x=eg.nextElementSibling;while(x){if(/more events/i.test(x.textContent||''))after.push(x);x=x.nextElementSibling}mClamp(eg,3,'Show {n} more events',after)}mClamp($('.mideas'),2,'Show {n} more ideas')}
  if(v==='signals'){mClamp($('.itg.top3'),3,'Show {n} more hot brands');mClamp($('.itg:not(.top3)'),2,'Show {n} more');mClamp($('.gcl'),2,'Show {n} more deals');mPeople()}
  if(v==='team'){const tb=$('.two table tbody');if(tb){const card=tb.closest('.card')||tb.parentElement;const all=[...card.querySelectorAll('button')].filter(b=>/show all/i.test(b.textContent));mClamp(tb,5,'Show {n} more people',all)}}
  if(v==='insights'){mClamp($('.ins13-s .ins13-g, .ins13-s>div:last-child'),2)}
}
(function(){const _go15b=go;go=function(){const r=_go15b.apply(this,arguments);setTimeout(phoneTidy,60);return r}})();

/* the home screen app name is Plato, not the old portal name */
(function(){const m=document.querySelector('meta[name="apple-mobile-web-app-title"]');if(m)m.setAttribute('content','Plato')})();
