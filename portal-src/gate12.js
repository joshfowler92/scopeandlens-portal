/* ═══════════ v12 LAST WORD: the gates, the new campaign flow, names and routes ═══════════ */
PAGES.push('guides');
const _mPipe=MODULES.find(m=>m.k==='pipeline');if(_mPipe)Object.assign(_mPipe,{l:'Pipeline',t:'Pipeline',d:'Pipeline'});
/* no campaign is created or opened until the agency profile is done */
['prospects','give','reach','launch'].forEach(k=>{const v=VIEWS[k];VIEWS[k]=function(a){if(!profReady())return profGate(k);const c=curCamp();if(S.campaigns.length===1&&isBlankCamp(c)&&!c.touched)return noCampYet();return v(a)}});
['prospects_after','give_after','reach_after','launch_after'].forEach(k=>{const v=VIEWS[k];if(!v)return;VIEWS[k]=function(a){if(!profReady())return;return v(a)}});
/* a new campaign is just a name: the problem is chosen while you build it, in What to share */
newCampaignFlow=function(){closeOverlays();if(!profReady()){toast('Finish your agency profile first. Then you can build campaigns.');go('agency');return}const n=S.campaigns.filter(c=>!isBlankCamp(c)).length;const cur=curCamp();
  modal('<div class="nc"><div class="nc-faces">'+OUT_K.map((k,i)=>agentFace(k,i?40:52,{badge:false,cls:i?'':'big'})).join('<i></i>')+'</div><h2>A new campaign</h2><p class="sub">Name it, then Scout finds the brands. You choose the problem it solves in What to share. Nothing is sent until you launch.</p>'+
    '<div class="field"><label for="ncN">Give it a name</label><input class="inp" id="ncN" placeholder="e.g. Standing out in financial services" onkeydown="if(event.key===\'Enter\')ncGo()"></div>'+
    (n&&cur&&cur.targets.length&&!isBlankCamp(cur)?'<label class="row" style="gap:8px"><input type="checkbox" id="ncCopy"> Start with the brands from '+esc(cur.name)+'</label>':'')+
    '<div class="modal-foot"><button class="btn btn-ghost" onclick="closeOverlays()">Cancel</button><button class="btn btn-primary" onclick="ncGo()">'+agentFace('prospects',22,{badge:false})+'Start with Scout'+ico('arrow','a')+'</button></div></div>');setTimeout(()=>{const i=$('#ncN');i&&i.focus()},200)};
newCampaign=newCampaignFlow;
ncGo=function(){const nm=($('#ncN').value||'').trim()||'Campaign '+(S.campaigns.filter(c=>!isBlankCamp(c)).length+1);const cp=$('#ncCopy')&&$('#ncCopy').checked;const old=curCamp();
  act('Started '+nm,()=>{const c=newCamp(nm);c.touched=1;if(cp&&old)c.targets=old.targets.slice();const blank=S.campaigns.find(x=>isBlankCamp(x)&&!x.touched);if(blank)S.campaigns=S.campaigns.filter(x=>x!==blank);S.campaigns.unshift(c);S.cur=c.id},{refresh:false,ic:'🚀'});
  closeOverlays();renderShell();go('prospects');if(typeof coachTick==='function')coachTick()};
crumb=function(){const el=$('#crumb');if(!el)return;const c=curCamp();const m=MODULES.find(x=>x.k===VIEW);
  const name={camps:'Campaigns',settings:'Settings',admin:'Manage access',plan:'Your growth plan',library:'Agency profile',dot:'Plato',guides:'Guides',pipeline:'Pipeline'}[VIEW]||(m?m.l:'');
  el.innerHTML=isOut(VIEW)&&c&&!isBlankCamp(c)?'<button class="cr-c" onclick="go(\'camps\')">'+esc(c.name)+'</button><span class="cr-s">/</span><b>'+esc(name)+'</b>':'<b>'+esc(name)+'</b>'};
/* home: the empty starter campaign is not shown as a campaign */
const _home12=VIEWS.home;VIEWS.home=function(a){const keep=S.campaigns;const real=S.campaigns.filter(c=>!isBlankCamp(c)||c.touched);let h;if(real.length!==keep.length&&real.length){S.campaigns=real;try{h=_home12(a)}finally{S.campaigns=keep}}else h=_home12(a);
  if(!profReady()&&!DEMO_MODE)h='<div class="gate12 home">'+platoFace(56)+'<div class="grow"><div class="sh-k">Step one</div><h2>Your agency <span class="serif">profile.</span></h2><p>'+agPct()+'% done. Finish it and campaigns open up: every brand, gift and message comes from it.</p></div><button class="btn btn-primary" onclick="go(\'agency\')">'+(agPct()?'Finish it':'Start it')+ico('arrow','a')+'</button></div>'+h;
  return h.replace(/Dot’s help/g,'Plato’s help').replace(/Build it with Dot/g,'Build it with Plato')};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&FR12)findClose()});
/* keep Plato in sync when the shell redraws */
const _renderShell12=renderShell;renderShell=function(){_renderShell12.apply(this,arguments);const d=$('#plato');if(d)d.style.display=S.setup.viewMode==='dot'?'none':''};
