/* ═══════════ v7 BRAND NEWS: agency moves, hires, pitches and campaigns (researched Nov 2026) ═══════════
   Every line below links to its source. Rows are [type, year-month, what happened, url, publisher]. */
const NEWS7_AS_OF='2026-11';
const _GO_MAR='https://www.thegonetwork.com/articles/march-2026-agency-moves-public-sector-rfps',
      _GO_APR='https://www.thegonetwork.com/articles/april-2026-agency-moves-public-sector-rfps',
      _GO_MAY='https://www.thegonetwork.com/articles/may-2026-agency-moves-public-sector-rfps',
      _CB_OCT='https://www.creativeboom.com/news/booms-shakes-october/',
      _XMAS='https://shopappy.com/brands/marketing-campaigns/christmas-adverts-2026-tesco-sainsburys-argos',
      _MOV_OCT='https://homeofdirectcommerce.com/news/movers-shakers-october-2026-update/';

/* brands new to the list in v7, found through agency, hiring and campaign news */
const NEW_BRANDS7=[
 ["Tesco","retail","Supermarkets","Welwyn Garden City","lse","L","brand","2026-11","Tesco's Christmas ad from BBH London follows a delivery driver who reconnects two old school friends after an order goes to the wrong house, promoting online grocery delivery.",_XMAS,"ShopAppy"],
 ["Sainsbury's","retail","Supermarkets","London","lse","L","brand","2026-11","The BFG returns for a third Christmas, with a real colleague driving dinner into Giant Country, tied to a Comic Relief pledge of 12 million meals.",_XMAS,"ShopAppy"],
 ["Argos","retail","General merchandise","Milton Keynes","lse","L","brand","2026-11","Christmas ad Tales of Argos Past from T&P casts Richard Ayoade as a Scrooge figure, pushing range beyond toys under the There's More to Argos platform.",_XMAS,"ShopAppy"],
 ["John Lewis","retail","Department stores","London","lse","L","brand","2026-11","Unveiled its 2026 Christmas campaign, Don't give up on giving, made with Saatchi & Saatchi and starring Dame Kristin Scott Thomas.","https://www.johnlewispartnership.co.uk/media-centre/latest-news/2026/23969","John Lewis Partnership"],
 ["Debenhams","retail","Online department store","Manchester","north","L","brand","2026-10","Revealed its 2026 Christmas ad, a love story starring Emily Atack and Mathew Horne with a cameo from Gabrielle.","https://www.retailgazette.co.uk/blog/2026/10/watch-debenhams-reveals-2026-christmas-ad/","Retail Gazette"],
 ["Frasers Group","retail","Sports and fashion retail","Shirebrook","mide","L","agency","2026-10","Named M+C Saatchi Talk lead UK agency for consumer PR, SEO and GEO across Sports Direct, FRASERS and FLANNELS, starting October 2026.",_CB_OCT,"Creative Boom"],
 ["The Very Group","retail","Online retail (Very, Littlewoods)","Liverpool","north","L","leadership","2026-09","Hired Beckie Crane-Stanion, formerly marketing lead at Frasers Group, as marketing director to lead brand, creative and marketing strategy.","https://www.theverygroup.com/media/news/2026/the-very-group-appoints-ex-frasers-group-cmo-as-its-new-marketing-director/","The Very Group"],
 ["Co-op","retail","Food retail and services","Manchester","north","L","leadership","2026-10","Appointed Alex Dower, who led Holland & Barrett's international division, as managing director of retail.",_MOV_OCT,"Home of Direct Commerce"],
 ["ASOS","retail","Online fashion","London","lse","L","leadership","2026-10","Hired Nick Goodchild from PVH, where he led Tommy Hilfiger's global AI taskforce, as AI and creative studios director.",_MOV_OCT,"Home of Direct Commerce"],
 ["Kingfisher","retail","Home improvement (B&Q, Screwfix)","London","lse","L","leadership","2026-10","Named Sebastian Gundel as chief executive, succeeding Thierry Garnier from 1 February 2027.",_MOV_OCT,"Home of Direct Commerce"],
 ["Joe Browns","retail","Fashion and homeware","Leeds","north","M","leadership","2026-10","Chief executive Dawn Bannerman is leaving, with no successor named yet.",_MOV_OCT,"Home of Direct Commerce"],
 ["Freemans","retail","Online fashion","Bradford","north","M","agency","2026-04","Appointed Meanwhile as lead creative agency for a brand identity refresh.",_GO_APR,"The Go Network"],
 ["Vax","retail","Home appliances","Droitwich","mide","M","agency","2026-04","Moved UK media planning and buying, about £26m, to the7stars after a seven-way pitch. The new agency took over at the end of May.",_GO_APR,"The Go Network"],
 ["Bisto","fmcg","Gravy and cooking (Premier Foods)","St Albans","lse","L","agency","2026-05","Premier Foods named St Luke's lead creative agency for Bisto after a pitch.",_GO_MAY,"The Go Network"],
 ["Nomad Foods","fmcg","Frozen food (Birds Eye, Goodfella's, Aunt Bessie's)","Feltham","lse","L","agency","2026-04","Appointed The Romans for consumer and corporate communications across Birds Eye, Goodfella's and Aunt Bessie's.",_GO_APR,"The Go Network"],
 ["Mr Porky","fmcg","Pork snacks (Tayto Group)","Corby","mide","M","agency","2026-04","Appointed Bray Leino as lead creative and media agency after a two-way pitch.",_GO_APR,"The Go Network"],
 ["McDonald's UK","travel","Quick service restaurants","London","lse","L","agency","2026-04","McDonald's UK and Ireland named TMW, part of Accenture Song, its customer engagement agency of record.",_GO_APR,"The Go Network"],
 ["Five Guys UK","travel","Burger restaurants","London","lse","M","agency","2026-05","Rehired Spin as its retained social agency for strategy, content and paid social.",_GO_MAY,"The Go Network"],
 ["Wingstop UK","travel","Chicken restaurants","London","lse","S","agency","2026-05","Appointed Smarts, part of MSQ, as integrated PR and media partner for the UK and Ireland after a pitch.",_GO_MAY,"The Go Network"],
 ["ASK Italian","travel","Casual dining","London","lse","M","agency","2026-05","Appointed Fever on a six-figure PR and social retainer after a four-way pitch.",_GO_MAY,"The Go Network"],
 ["lastminute.com","travel","Online travel","London","lse","M","agency","2026-03","Appointed BBH to build a new brand platform for its key European markets, replacing Trouble Maker, with the first campaign due in summer 2026.",_GO_MAR,"The Go Network"],
 ["IG","finance","Online trading","London","lse","L","agency","2026-04","Moved UK media planning and buying to Medialab after a competitive review.",_GO_APR,"The Go Network"],
 ["Staysure","finance","Travel insurance","Market Harborough","mide","M","agency","2026-04","Appointed Goodstuff for UK media planning and buying, reported at about £25.4m in billings.",_GO_APR,"The Go Network"],
 ["Royal Kennel Club","charity","Dog welfare and Crufts","London","lse","M","agency","2026-10","Tommy, part of ZEAL Group, won the pitch for the Crufts 2027 campaign platform across social, digital, email and out of home. Activity starts late October.",_CB_OCT,"Creative Boom"]
];
const NEW_DOMAINS7={"Tesco":"tesco.com","Sainsbury's":"sainsburys.co.uk","Argos":"argos.co.uk","John Lewis":"johnlewis.com","Debenhams":"debenhams.com","Frasers Group":"frasers.group","The Very Group":"theverygroup.com","Co-op":"coop.co.uk","ASOS":"asos.com","Kingfisher":"kingfisher.com","Joe Browns":"joebrowns.co.uk","Freemans":"freemans.com","Vax":"vax.co.uk","Bisto":"bisto.co.uk","Nomad Foods":"nomadfoods.com","Mr Porky":"mrporky.co.uk","McDonald's UK":"mcdonalds.co.uk","Five Guys UK":"fiveguys.co.uk","Wingstop UK":"wingstop.co.uk","ASK Italian":"askitalian.co.uk","lastminute.com":"lastminute.com","IG":"ig.com","Staysure":"staysure.co.uk","Royal Kennel Club":"thekennelclub.org.uk"};

/* fresh lines for brands already on the list */
const MORE_NEWS7={
 "Aviva":[["agency","2026-04","Appointed OMD UK as lead UK media agency, a £95m account, after a competitive review.",_GO_APR,"The Go Network"]],
 "Center Parcs":[["agency","2026-07","Appointed Pink Neon as its retained PR and creator agency, working alongside lead creative agency Neverland. CMO Sara Holt wants culturally connected earned media and a creator strategy.","https://mediashotz.co.uk/center-parcs-appoints-pink-neon-as-retained-pr-and-creator-agency","Mediashotz"]],
 "Bupa":[["agency","2026-03","Bupa UK appointed Ace of Hearts for creative and strategy after a final pitch against The Gate and Joint, as part of a wider brand overhaul.","https://www.pulse.bot/marketing/news/bupa-uk-picks-ace-of-hearts-to-work-on-creative-and-strategy-b0e7be43-0c5a-4e93-8a48-a8b1445b6c5c","Pulse"]],
 "Holland & Barrett":[["leadership","2026-09","Hired Michelle Boothroyd from Grainger as chief people officer as it expands its stores, digital services and wider offer.","https://www.retailgazette.co.uk/blog/2026/09/holland-barrett-appoints-michelle-boothroyd-as-chief-people-officer/","Retail Gazette"]],
 "Halfords":[["results","2026-10","First-half like-for-like sales rose 7.1%, and it is accelerating marketing and technology investment in the second half. Interim results are due on 26 November.","https://uk.marketscreener.com/news/halfords-trading-update-document-ce785cd8da8eff22","MarketScreener"]],
 "RNLI":[["pitch","2026-06","Invited agencies to pitch for its creative advertising account.","https://www.theatdb.com/news/rnli-starts-search-for-creative-advertising-agency","ATDb"]],
 "Guide Dogs":[["agency","2026-03","Appointed Fold7 as lead creative agency after a three-way pitch with Atomic London and VCCP, to refresh its identity and fundraising campaigns.","https://www.pulse.bot/marketing/news/guide-dogs-picks-fold7-as-lead-creative-agency-412be020-6257-4e6d-811d-ed0e9fc2b61a/","Pulse"]],
 "Rude Health":[["agency","2026-04","Appointed Ark Agency as lead strategic and creative partner after a pitch against four other agencies.",_GO_APR,"The Go Network"]],
 "Clipper Teas":[["brand","2026-04","Briefed Who Wot Why on a new global brand platform, backed by a £1.5m UK campaign.",_GO_APR,"The Go Network"]],
 "PureGym":[["agency","2026-05","Appointed PrettyGreen to support the rollout of its Feel PureGym Good campaign.",_GO_MAY,"The Go Network"]],
 "JLR":[["agency","2026-05","Appointed WPP as global growth partner across creative, media, production and customer experience.",_GO_MAY,"The Go Network"]],
 "Superdry":[["leadership","2026-10","Promoted Matt Brewster, formerly chief executive of WIT Fitness, to commercial director.",_MOV_OCT,"Home of Direct Commerce"]],
 "Schuh":[["leadership","2026-10","Hired Nick Scott from Footasylum as chief financial officer.",_MOV_OCT,"Home of Direct Commerce"]],
 "Tesco":[["agency","2026-03","Reappointed EssenceMediacom as media agency for the UK and three central European markets after a closed review.",_GO_MAR,"The Go Network"]]
};

/* merge it all in: every brand gets a newest-first list, and its headline is the freshest item */
(function(){
  NEW_BRANDS7.forEach(r=>{if(!PROSPECTS.some(p=>p.name===r[0]))PROSPECTS.push({name:r[0],sector:r[1],sub:r[2],city:r[3],region:r[4],size:r[5],nt:r[6],nd:r[7],news:r[8],src:r[9],pub:r[10],added:'2026-11'})});
  Object.assign(DOMAINS,NEW_DOMAINS7);
  PROSPECTS.forEach(p=>{const L=[];if(p.news)L.push({type:p.nt,date:p.nd,text:p.news,src:p.src,pub:p.pub});
    (MORE_NEWS7[p.name]||[]).forEach(r=>L.push({type:r[0],date:r[1],text:r[2],src:r[3],pub:r[4]}));
    L.sort((a,b)=>String(b.date).localeCompare(String(a.date)));p.all=L;
    if(L.length){const n=L[0];p.nt=n.type;p.nd=n.date;p.news=n.text;p.src=n.src;p.pub=n.pub}});
})();
/* links that always work, for any brand: live news and the brand's own LinkedIn page */
function gNewsURL(name){return 'https://news.google.com/search?q='+encodeURIComponent('"'+name+'" (agency OR campaign OR appoints OR marketing OR pitch)')+'&hl=en-GB&gl=GB&ceid=GB:en'}
function liCoURL(name){return 'https://www.linkedin.com/search/results/companies/?keywords='+encodeURIComponent(name)}
function liPostsURL(name){return 'https://www.linkedin.com/search/results/content/?keywords='+encodeURIComponent(name)+'&sortBy=%22date_posted%22'}
