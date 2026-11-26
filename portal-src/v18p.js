/* ═══════════ v18p: decision makers that are right, clear and noted ═══════════
   Only people who work at the brand now, in a role you sell to. Clear cards with photo, role, company and a real
   LinkedIn button. A daily search meter, because Amplify paces LinkedIn searches to keep accounts safe. Notes on anyone. */

const DM_DAY18=15;
function dmUse18(){const d=S.dmSearch18||{};return d.date===today()?d.n||0:0}
function dmCount18(){S.dmSearch18={date:today(),n:dmUse18()+1};save()}
function dmMeter18(){if(!ampOn())return '';const n=dmUse18();const left=Math.max(0,DM_DAY18-n);const pct=Math.min(100,n/DM_DAY18*100);
  return '<div class="dmm18'+(left?'':' out')+'"><div class="dmm18-t">'+ico('search')+'<b>LinkedIn searches today</b><span>'+n+' of about '+DM_DAY18+'</span></div><div class="dmm18-b"><i style="width:'+pct+'%"></i></div>'+
    '<small>'+(left?'Amplify paces searches so your LinkedIn account stays safe. '+left+' left today, and it resets tomorrow.':'That is today’s allowance used. It resets tomorrow, so pick up the rest then. Your list is saved.')+'</small></div>'}

/* who counts: works there now, in a role that matters */
const DM_BAD18=/\b(volunteer|intern|internship|student|former|ex[- ]|retired|trustee emeritus|apprentice|work experience|placement)\b/i;
function coMatch18(co,a){const n=v=>String(v||'').toLowerCase().replace(/\b(the|ltd|limited|plc|group|uk|inc|llp|co)\b/g,'').replace(/[^a-z0-9]/g,'');const x=n(co),y=n(a.name);if(!x)return true;return x===y||x.includes(y)||y.includes(x)||(!!domainOf(a)&&x.includes(n(domainOf(a).split('.')[0])))}
function roleScore18(t){t=String(t||'').toLowerCase();if(!t)return 0;const W=myDiscs().flatMap(k=>DISC[k].titles).concat(S.setup.profile.roles||[]).map(x=>String(x).toLowerCase());
  let s=W.some(w=>w&&t.includes(w))?3:0;if(/\b(chief|cmo|cbo|cco|ceo|director|head|vp|vice president|founder|partner|lead)\b/.test(t))s+=2;if(/\b(marketing|brand|growth|digital|communications|comms|fundraising|engagement|customer|insight|strategy|creative)\b/.test(t))s+=1;if(/\b(assistant|coordinator|executive|officer)\b/.test(t)&&!/chief/.test(t))s-=1;return s}
ampFindPeople=async function(a){const j=await ampCall('find-people',{company:a.name,domain:domainOf(a),currentCompanyOnly:true,titles:myDiscs().flatMap(k=>DISC[k].titles).slice(0,6),roles:S.setup.profile.roles,limit:15,withPhotos:true});dmCount18();
  const raw=(j.people||[]).map(p=>({name:p.name,role:p.title||p.headline||'',company:p.company||p.currentCompany||p.organization||'',li:p.linkedin||p.linkedinUrl||'',email:p.email,verified:!!p.verified,photo:photoOf18(p)}));
  const keep=raw.filter(p=>coMatch18(p.company,a)&&!DM_BAD18.test(p.role)).map(p=>Object.assign(p,{fit:roleScore18(p.role)})).filter(p=>p.fit>0||!p.role).sort((x,y)=>y.fit-x.fit).slice(0,10);
  keep.note=(j.note||'')+(raw.length>keep.length?(j.note?' ':'')+(raw.length-keep.length)+' left out: not at '+a.name+' now, or not in a role you sell to.':'');return keep};
(function(){const f=findDM;findDM=async function(aid){await ampCheck();if(ampOn()&&dmUse18()>=DM_DAY18){modal('<h2>That is today’s LinkedIn searches used</h2><p class="sub">Amplify paces LinkedIn searches, about '+DM_DAY18+' a day, so your account never looks like a bot. Your list is saved. Pick up the rest tomorrow, or add someone you already know by hand.</p><div class="modal-foot"><button class="btn btn-primary" onclick="closeOverlays()">Got it</button></div>');return}return f(aid)}})();

/* the card for one person: photo, name, role, company, and an obvious LinkedIn button */
pRow=function(a,p,mine){const q="'"+a.id+"'";const li=p.li||p.linkedin;const ph=p.photo||photoByName18(p.name,a);const fit=p.fit!=null?p.fit:roleScore18(p.role||p.title);
  const av=ph?'<span class="dmp-av"><img src="'+esc(ph)+'" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.textContent=\''+esc(initials(p.name))+'\'"></span>':'<span class="dmp-av">'+esc(initials(p.name))+'</span>';
  const nm=li?'<a href="'+esc(li)+'" target="_blank" rel="noopener">'+esc(p.name)+'</a>':esc(p.name);
  return '<div class="dmp'+(mine?' mine':'')+'">'+av+'<div class="dmp-m"><b>'+nm+'</b><span>'+esc(p.role||p.title||'Role not set')+'</span><small>'+ico('home')+esc(p.company||a.name)+(fit>=4&&!mine?' · <em>Strong role match</em>':'')+(p.from==='live'?' · Amplify':'')+'</small>'+
      (mine&&p.note18?'<p class="dmp-n">'+ico('edit')+esc(p.note18)+'</p>':'')+'</div>'+
    '<div class="dmp-a">'+(li?'<a class="btn btn-line btn-xs dmp-li" href="'+esc(li)+'" target="_blank" rel="noopener">'+ico('linkedin')+'Profile</a>':'<a class="btn btn-ghost btn-xs dmp-li" href="'+esc(liOf18(p,a))+'" target="_blank" rel="noopener">'+ico('search')+'Find on LinkedIn</a>')+
      (mine?'<button class="btn btn-ghost btn-xs" onclick="noteFor18('+q+',\''+p.id+'\')">'+ico('edit')+(p.note18?'Note':'Add note')+'</button><button class="mini" onclick="openPersonForm('+q+',\''+p.id+'\')" data-tip="Edit">'+ico('settings')+'</button>':
        '<button class="btn btn-primary btn-xs" onclick="addDM('+q+',\''+esc(p.name).replace(/'/g,"\\'")+'\',\''+esc(p.role||p.title||'').replace(/'/g,"\\'")+'\',\''+esc(li||'')+'\')">'+ico('plus')+'Add</button>')+'</div></div>'};

/* notes on anyone, used wherever that person shows up */
function noteFor18(aid,pid){const a=accountById(aid);const p=a&&a.people.find(x=>x.id===pid);if(!p)return;
  modal('<h2>What should Otis know about '+esc(p.name.split(' ')[0])+'?</h2><p class="sub">How you know them, what you talked about last time, anything that makes a message feel like it came from you. It shows on every card for them, and Plato uses it.</p>'+
    '<textarea class="inp" id="nt18" rows="4" placeholder="e.g. Met at the Third Sector awards last year. We talked about their legacy giving push.">'+esc(p.note18||'')+'</textarea>'+
    '<div class="modal-foot"><button class="btn btn-ghost" onclick="closeOverlays()">Cancel</button><button class="btn btn-primary" onclick="noteSave18(\''+aid+'\',\''+pid+'\')">Save note</button></div>');setTimeout(()=>{const t=$('#nt18');t&&t.focus()},60)}
function noteSave18(aid,pid){const a=accountById(aid);const p=a&&a.people.find(x=>x.id===pid);if(!p)return;const v=$('#nt18').value.trim();act(v?'Saved a note on '+p.name:'Cleared the note',()=>{p.note18=v;if(v&&!p.met)p.met=v.split(/[.!?]/)[0].slice(0,120)},{refresh:false,quiet:true});closeOverlays();go(VIEW,VIEW_ARG,true)}

/* the meter sits above the people step */
(function(){const f=VIEWS.prospects;VIEWS.prospects=function(tab){let h=String(f.apply(this,arguments));const i=h.indexOf('<div class="dm">');if(i>-1&&ampOn())h=h.slice(0,i)+dmMeter18()+h.slice(i);return h}})();

/* the note travels onto the Launch card */
(function(){const f=lnCard18;lnCard18=function(c,q,i){let h=f(c,q,i);if(q.x.p.note18&&!i)h=h.replace('<div class="dk18-k">','<div class="dk18-note">'+ico('edit')+'<span><b>Your note:</b> '+esc(q.x.p.note18)+'</span></div><div class="dk18-k">');return h}})();
(function(){const f=platoContext;platoContext=function(){const o=f.apply(this,arguments);try{o.notes=S.accounts.flatMap(a=>(a.people||[]).filter(p=>p.note18).map(p=>({person:p.name,brand:a.name,note:p.note18}))).slice(0,40)}catch(e){}return o}})();
