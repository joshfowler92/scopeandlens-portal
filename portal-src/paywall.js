/* ═══════════ BUILD FREE, PAY AT LAUNCH ═══════════
   Everything up to launch is free: the plan, the prospect list, the content bank, the journey, every drafted message.
   The commercial step appears only when they press launch. Pricing and the headline offer are Josh's to set:
   fill in PRICING below and the launch step shows them. Until then it shows a clean placeholder. */
const PRICING={
  headline:'',   /* e.g. the opening offer, in one line */
  price:'',      /* e.g. the price, exactly as it should read */
  detail:'',     /* one or two sentences on what is included */
  cta:''         /* the button label, e.g. "Start launching" */
};
function canLaunch(){if(isAdmin())return true;if(SESSION&&SESSION.paid)return true;if(S&&S.setup.paid)return true;return !(typeof isLive==='function'&&isLive())}
function launchPreview(){return !(typeof isLive==='function'&&isLive())}
function pricingBlock(){const set=PRICING.headline||PRICING.price;const show=isAdmin()||launchPreview();
  if(set)return '<div class="pw-price">'+(PRICING.headline?'<b class="pw-hl">'+esc(PRICING.headline)+'</b>':'')+(PRICING.price?'<div class="pw-p">'+esc(PRICING.price)+'</div>':'')+(PRICING.detail?'<p>'+esc(PRICING.detail)+'</p>':'')+'</div>';
  if(show)return '<div class="pw-price ph"><span class="pw-tag">Placeholder</span><b class="pw-hl">Headline offer goes here</b><div class="pw-p">Pricing goes here</div><p class="tiny">Set by Scope &amp; Lens. Fill in PRICING in the portal and it appears here, with nothing else to change.</p></div>';
  return '<div class="pw-price"><b class="pw-hl">Ready when you are</b><p>Scope &amp; Lens will set you up and talk you through the options. No card was needed to get this far, and nothing you have built goes anywhere.</p></div>'}
function paywallModal(){const c=curCamp();const tg=campTargets(c);const ppl=sum(tg,a=>a.people.length);const st=c.reach.steps.filter(s=>!s.task).length;const B=bankItems(c).filter(x=>x.status==='ready').length;const pre=launchPreview()&&!isAdmin();
  modal('<div class="pw"><div class="pw-cast">'+['home','prospects','give','reach','launch'].map((k,i)=>agentFace(k,i===4?62:44,{badge:false,cls:i===4?'big':''})).join('')+'</div>'+
    '<h2>You built all of this <span class="serif">for free.</span></h2><p class="sub">Here is what is ready to go the moment you launch:</p>'+
    '<div class="pw-got">'+[['target',tg.length,'brands on your list'],['user',ppl,'decision makers'],['doc',B,'pieces in your content bank'],['send',ppl*st,'messages drafted in your voice']].map(x=>'<div><span>'+ico(x[0])+'</span><b>'+x[1]+'</b><small>'+x[2]+'</small></div>').join('')+'</div>'+
    pricingBlock()+
    '<p class="tiny muted" style="margin-top:12px">Co-pilot, not autopilot. Launching never sends anything on its own: Rocket lines up each message, and you approve every one.</p>'+
    '<div class="modal-foot">'+(pre?'<span class="lft tiny muted">This is a preview. On the live portal this is where launching is unlocked.</span><button class="btn btn-ghost" onclick="closeOverlays()">Not yet</button><button class="btn btn-primary" onclick="closeOverlays();S.pwSeen=1;save();launchGo()">Carry on with the demo'+ico('arrow','a')+'</button>':
      '<button class="btn btn-ghost" onclick="closeOverlays()">Keep building</button><button class="btn btn-primary" onclick="askToLaunch()">'+esc(PRICING.cta||'I am ready to launch')+ico('rocket','a')+'</button>')+'</div></div>',true)}
async function askToLaunch(){const c=curCamp();try{await api('upgrade',{method:'POST',body:{campaign:c.name,brands:campTargets(c).length}});closeOverlays();modal('<div class="row" style="gap:12px;align-items:center">'+agentFace('launch',52,{badge:false})+'<div class="grow"><h2 style="margin:0">Over to Scope &amp; Lens</h2><p class="sub" style="margin:4px 0 0">Josh has been told you are ready to launch '+esc(c.name)+'. You will hear back shortly. Keep building in the meantime, nothing is lost.</p></div></div><div class="modal-foot"><button class="btn btn-primary" onclick="closeOverlays()">Lovely</button></div>')}
  catch(e){location.href='mailto:josh@scopeandlens.com?subject='+encodeURIComponent('Ready to launch: '+c.name)+'&body='+encodeURIComponent('Hi Josh, we have built '+c.name+' in the Permissionless Portal and are ready to launch.')}}
const launchGo=launchNow;
launchNow=function(){const c=curCamp();const pf=preflight(c);if(pf.some(x=>!x.ok))return launchGo();if(canLaunch()&&!(launchPreview()&&!S.pwSeen&&!isAdmin()))return launchGo();paywallModal()};
