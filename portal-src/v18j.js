/* ═══════════ v18j MOTION, IN THE WEBSITE'S STYLE ═══════════
   Soft colour drifting behind the page, sections that rise in as a page opens, springy lifts on hover and
   numbers that count up. Calm, never in the way, and off for anyone who prefers reduced motion. */
const RM18=matchMedia('(prefers-reduced-motion: reduce)').matches;
function bgfx18(){if(RM18||$('#bgfx18'))return;const d=document.createElement('div');d.id='bgfx18';d.setAttribute('aria-hidden','true');
  d.innerHTML='<i class="b1"></i><i class="b2"></i><i class="b3"></i><b class="r1"></b><b class="r2"></b>';document.body.prepend(d)}
let LASTV18='';
function enter18(fresh){const v=$('#view');if(!v)return;if(!fresh||RM18)return;const kids=[...v.children].filter(e=>e.offsetHeight>0).slice(0,10);
  kids.forEach((e,i)=>{e.classList.remove('rv18');void e.offsetWidth;e.style.setProperty('--rv',(i*0.06)+'s');e.classList.add('rv18')});
  setTimeout(()=>kids.forEach(e=>e.classList.remove('rv18')),1400)}
function count18(){if(RM18)return;$$('#view .kp18 b,#view .in18t-c b,#view .ln18-n b').forEach(b=>{if(b.dataset.c18)return;const t=b.textContent.trim();const m=t.match(/^([£$€]?)(\d[\d,.]*)([kmKM%]?)$/);if(!m)return;
  const end=parseFloat(m[2].replace(/,/g,''));if(!isFinite(end)||end===0)return;b.dataset.c18=1;const dec=(m[2].split('.')[1]||'').length;const t0=performance.now();const D=800;
  const step=now=>{const k=Math.min(1,(now-t0)/D);const e=1-Math.pow(1-k,3);b.textContent=m[1]+(end*e).toFixed(dec)+m[3];if(k<1)requestAnimationFrame(step);else b.textContent=t};requestAnimationFrame(step)})}
(function(){const _go=go;go=function(v,a,k){const fresh=!k&&(v!==LASTV18||true);const r=_go.apply(this,arguments);LASTV18=VIEW;try{bgfx18();requestAnimationFrame(()=>{enter18(!k);count18()})}catch(e){}return r}})();
