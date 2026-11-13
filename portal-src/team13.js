/* ═══════════ v13: YOUR TEAM ═══════════
   The four bots are now "your team": Nora, Gus, Priya and Otis. Simpler to look at: a flat colour,
   a white face, two eyes and one symbol that says what each one does. */
Object.assign(AGENTS.prospects,{n:'Nora',role:'Finds who to target',bot:'scout',motto:'Fewer, better, sooner.',me:'I find the few brands worth your time and the people who actually decide.'});
Object.assign(AGENTS.give,{n:'Gus',role:'Makes what to share',bot:'muse',motto:'Useful first.',me:'I turn your work into something so useful they would pay for it. Then you give it away.'});
Object.assign(AGENTS.reach,{n:'Priya',role:'Plans how to reach them',bot:'relay',motto:'Steady, never pushy.',me:'I plan which channels, how often, and when to stay quiet.'});
Object.assign(AGENTS.launch,{n:'Otis',role:'Launches it with you',bot:'pilot',motto:'Ten minutes a day.',me:'I line up each day’s messages. You approve them, and they go.'});
botSVG=function(kind,col,x,crop){const ns=x?' xmlns="http://www.w3.org/2000/svg" width="240" height="240"':'';const ink='#15151c';
  const sym={scout:'<circle cx="60" cy="18" r="7" fill="none" stroke="#fff" stroke-width="3"/><circle cx="60" cy="18" r="2.4" fill="#fff"/>',
    muse:'<path d="M60 9l2.6 6.4L69 18l-6.4 2.6L60 27l-2.6-6.4L51 18l6.4-2.6z" fill="#fff"/>',
    relay:'<circle cx="60" cy="21" r="3" fill="#fff"/><path d="M52 15a11 11 0 0 1 16 0M47 10a18 18 0 0 1 26 0" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" class="b-wave"/>',
    pilot:'<path d="M60 8l9 15h-18z" fill="#fff"/>'}[kind]||'';
  const mouth={scout:'<rect class="b-m" x="54" y="74" width="12" height="3.4" rx="1.7" fill="'+ink+'"/>',muse:'<path class="b-m" d="M53 72q7 6 14 0" stroke="'+ink+'" stroke-width="3" stroke-linecap="round" fill="none"/>',
    relay:'<path class="b-m" d="M54 73q6 4 12 0" stroke="'+ink+'" stroke-width="3" stroke-linecap="round" fill="none"/>',pilot:'<rect class="b-m" x="52" y="73" width="16" height="3.4" rx="1.7" fill="'+ink+'"/>'}[kind]||'';
  return '<svg'+ns+' viewBox="'+(crop?'16 10 88 88':'0 0 120 120')+'" class="botsvg b2 b-'+kind+'">'+(x?'<defs><clipPath id="c"><circle cx="60" cy="60" r="60"/></clipPath></defs>':'')+'<g'+(x?' clip-path="url(#c)"':'')+'>'+
    '<rect width="120" height="120" fill="'+col+'"/><path d="M60 36V28" stroke="#fff" stroke-width="3" stroke-linecap="round"/>'+sym+
    '<path d="M24 124c2-18 16-28 36-28s34 10 36 28z" fill="#fff" opacity=".22"/>'+
    '<rect x="30" y="36" width="60" height="54" rx="24" fill="#fff"/>'+
    '<g class="eyes"><ellipse cx="48" cy="61" rx="5" ry="6" fill="'+ink+'"/><ellipse cx="72" cy="61" rx="5" ry="6" fill="'+ink+'"/></g>'+mouth+'</g></svg>'};
/* the walkthrough: one line on what each team member does, three short steps, and what you get */
Object.assign(ONB_STEP,{
  prospects:{say:'I find the few brands worth your time, and the people who decide.',li:['Tell me who you want to win, once, in your agency profile','I score brands out of 100 and you pick the best','I find the two or three people who sign things off'],get:'A short list of brands and decision makers, each with a reason to talk now.'},
  give:{say:'I turn your best work into something worth giving away.',li:['Add your hero piece, a case study and a blog post or report','I suggest gifts made from them, for this problem','You pick one and I draft it'],get:'One great gift and a bank of content to share over the weeks.'},
  reach:{say:'I plan how you reach them, steadily, never pushy.',li:['Pick your channels, or take the Scope & Lens route','I pace it over twelve weeks, one campaign a quarter','I write every message in your voice'],get:'A twelve-week journey with every touch written.'},
  launch:{say:'I line up each day’s messages. You approve them.',li:['Send them yourself, or let Amplify send them for you','Approve or redraft each message in a couple of taps','Replies and intent come straight back into Plato'],get:'Ten minutes a day, and warm conversations coming back.'}});
