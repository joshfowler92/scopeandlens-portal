/* Permissionless library, from the Scope & Lens site tools (Who should I target, How can I be permissionless) */
const L_DISCIPLINES = {
  creative: { label: 'Creative & advertising', assets: [
    { name: 'The Unasked-For Route',
      what: 'Take one live {SECTOR} campaign {TARGET} is running and build a second route for it. Not a critique, a genuine alternative with a different insight behind it.',
      why: 'It skips the credentials conversation entirely. A {ROLE} cannot judge your showreel against their problem, but they can judge work made for their problem.',
      steps: ['Pick one campaign of theirs currently in market, ideally one that has been running a while.',
              'Write the insight you think they missed in a single sentence, then build three to five frames around it.',
              'Keep it rough on purpose. Finished work looks like a pitch, a route looks like thinking.'],
      line: 'Saw your {SECTOR} work running again this month. We had a different thought about the insight underneath it, so we built it. No agenda, thought you might find it interesting.' },
    { name: 'The Brief They Should Have Written',
      what: 'Write the one-page brief you believe {TARGET} is actually facing, based on {PROBLEM_SHORT}, and send it to them before anyone briefs you.',
      why: 'Most agencies answer briefs. Writing the brief puts you upstream of the decision, where the {ROLE} is still forming their view.',
      steps: ['Pull their last two campaigns, their category context and any public commentary on {PROBLEM_SHORT}.',
              'Write it as they would: the business problem, the audience, the barrier, the measure of success.',
              'End with the one question you would want answered before anyone started work.'],
      line: 'We wrote the brief we think you are wrestling with. We might have it completely wrong, which is half the reason for sending it.' },
    { name: 'The Category Sameness Teardown',
      what: 'Put the last twelve months of {SECTOR} advertising side by side and show how indistinguishable it has become, with {TARGET} in the mix.',
      why: 'Distinctiveness is the one thing a {ROLE} is quietly worried about and nobody will say out loud. Evidence is kinder than opinion.',
      steps: ['Gather eight to ten executions from the category, including theirs and their closest rivals.',
              'Strip the logos. Ask five people to match ad to brand and record how badly they do.',
              'Show the result, then one page on what distinctiveness would look like for them specifically.'],
      line: 'We stripped the logos off a year of {SECTOR} advertising and asked people to match them up. The results were uncomfortable for everyone, including us.' }
  ]},
  media: { label: 'Media & performance', assets: [
    { name: 'The Visible Spend Map',
      what: 'Map what {TARGET} is visibly spending against, where their share of voice sits versus the {SECTOR} field, and where the obvious gaps are.',
      why: 'A {ROLE} is measured on efficiency they cannot always see. Showing them their own shape of spend from the outside is genuinely new information.',
      steps: ['Use public ad libraries, press and whatever category data you already licence.',
              'Build one chart: their spend shape versus the three competitors they care about.',
              'Mark the two channels where the field is crowded and the one where it is not.'],
      line: 'We mapped where {SECTOR} money is going this quarter. There is one channel nobody in your set is using, which felt worth flagging.' },
    { name: 'The Wastage Estimate',
      what: 'Model roughly what {TARGET} is likely losing to frequency, overlap or poor timing, using what you can see from outside.',
      why: 'It converts {PROBLEM_SHORT} into a number. Numbers get forwarded internally. Opinions do not.',
      steps: ['Be transparent about your assumptions and show them on the page.',
              'Give a range, never a single figure, and explain what would narrow it.',
              'Offer to swap your assumptions for their real numbers.'],
      line: 'We built a rough model of where the leakage might be. The assumptions are ours and probably wrong, which is exactly why it is worth twenty minutes.' },
    { name: 'The Moment They Are Missing',
      what: 'Find the seasonal, cultural or category moment in {SECTOR} that {TARGET} is not planning for, and show what showing up there would take.',
      why: 'It proves you understand their calendar, not just their media. That is the difference between a supplier and a partner to a {ROLE}.',
      steps: ['Pull search, social and retail data around the moment to prove it is real.',
              'Show who currently owns it and how thinly.',
              'Sketch the plan on one page with a realistic budget range.'],
      line: 'There is a moment in {SECTOR} that your category keeps underplaying. We pulled the data and sketched what owning it would look like.' }
  ]},
  brand: { label: 'Brand & design', assets: [
    { name: 'The Touchpoint Audit',
      what: 'Walk every public touchpoint {TARGET} owns, from the website to packaging to the recruitment ads, and show where the brand falls apart.',
      why: 'Nobody inside a business sees their brand the way a customer does. For a {ROLE} this is a mirror they cannot get internally.',
      steps: ['Screenshot everything. Fifteen to twenty touchpoints is plenty.',
              'Mark each one consistent, drifting or off-brand, and be fair about it.',
              'End on the three fixes with the highest visibility and the lowest effort.'],
      line: 'We walked your brand the way a customer would, across about twenty touchpoints. Most of it holds up. Three things really do not.' },
    { name: 'The Distinctive Asset Test',
      what: 'Test whether {TARGET} actually owns any distinctive assets in {SECTOR}, or whether the category looks identical without logos.',
      why: 'It gives a {ROLE} ammunition for the internal argument they are already having about consistency and investment.',
      steps: ['Pick five of their assets: colour, shape, character, sound, type.',
              'Run a quick unbranded recognition test with thirty people. It costs very little.',
              'Report what they own, what they are renting and what they have lost.'],
      line: 'We ran a quick unbranded recognition test on {SECTOR}. You own one asset outright. The others are up for grabs.' },
    { name: 'The Five Year Drift',
      what: 'Show how {TARGET} has looked and sounded over five years, side by side, and where the drift has cost them coherence.',
      why: 'It makes {PROBLEM_SHORT} visible in a way a list of principles never could, and it is impossible to argue with.',
      steps: ['Use the Wayback Machine, old campaigns, packaging shots and annual reports.',
              'Lay it out as one horizontal timeline.',
              'Name the moment the drift started and what changed around it.'],
      line: 'We laid out five years of your brand on one page. The drift is clearer than you would expect, and there is a specific moment it starts.' }
  ]},
  data: { label: 'Data & insight', assets: [
    { name: 'The Signal Report',
      what: 'Pull what public data says about {SECTOR} demand right now and show {TARGET} the shift nobody in their category has acted on.',
      why: 'A {ROLE} is paid to see things early. Handing them something they can take into a board meeting is worth more than any credentials deck.',
      steps: ['Use search trends, open category data, reviews and job postings. All free.',
              'Find one shift that is real and under-discussed, not the obvious one.',
              'Write it as a short two-page memo. Memos get read.'],
      line: 'We pulled the {SECTOR} demand data for the last eighteen months. One shift stood out and nobody in your category seems to have moved on it yet.' },
    { name: 'The Customer Gap',
      what: 'Mine public reviews, forums and app store feedback for {TARGET} and surface the thing their customers keep saying that nobody is fixing.',
      why: 'It is their own customers talking. That makes it uncomfortable and unarguable, which is exactly why a {ROLE} will act on it.',
      steps: ['Pull three hundred or more reviews across every platform they appear on.',
              'Code them for theme, not sentiment. Sentiment tells you nothing useful.',
              'Lead with the one theme that is both frequent and fixable.'],
      line: 'We read about four hundred of your reviews and coded them by theme. One thing comes up far more than anything else, and it looks fixable.' },
    { name: 'The Measurement Honesty Check',
      what: 'Show {TARGET} what their current reporting probably cannot tell them about {PROBLEM_SHORT}, and what it would take to answer it properly.',
      why: 'Every {ROLE} suspects their measurement is flattering them. Naming it kindly, with a route out, builds more trust than any case study.',
      steps: ['Map the questions a board would ask against what their likely stack can answer.',
              'Mark each one answerable, partly answerable or guesswork.',
              'Show the smallest change that moves the most questions into the first column.'],
      line: 'We mapped the questions your board probably asks against what most stacks in {SECTOR} can actually answer. The gap is usually bigger than people expect.' }
  ]},
  digital: { label: 'Digital, ecommerce & performance', assets: [
    { name: 'The Journey Teardown',
      what: 'Record yourself going through {TARGET}\\u2019s real buying journey end to end and narrate every point where you nearly gave up.',
      why: 'Nobody internally has done this in months. For a {ROLE} a five minute video of a real person struggling is worth more than a hundred-page audit.',
      steps: ['Do it on a phone, on data, like a customer would. Not on your office wifi on a desktop.',
              'Keep the recording under six minutes and talk through what you are thinking.',
              'Send a one-page list of fixes ranked by effort against impact.'],
      line: 'I recorded myself buying from you on my phone. It took longer than it should have, and I think three of the reasons are quick fixes.' },
    { name: 'The Speed Tax',
      what: 'Measure {TARGET}\\u2019s load times against the {SECTOR} field and convert the difference into an estimate of lost revenue.',
      why: 'It turns a technical problem into a commercial one, which is the only language a {ROLE} can take to finance.',
      steps: ['Run their key pages and three competitors through public testing tools.',
              'Apply a published conversion-per-second figure and show your working.',
              'Name the two heaviest things on the page and what removing them would save.'],
      line: 'We ran your key pages against three competitors. There is a gap, and at your traffic levels it is probably worth a meaningful number.' },
    { name: 'The Search Gap',
      what: 'Show what people in {SECTOR} are searching for that {TARGET} does not currently answer anywhere on their site.',
      why: 'It is demand they are already paying to generate and then losing. For a {ROLE} that is the easiest internal argument there is.',
      steps: ['Pull the question-shaped queries in the category, not just the head terms.',
              'Check which ones they rank for, which a competitor owns and which nobody owns.',
              'Give them the ten pages worth writing, in priority order.'],
      line: 'We pulled the questions people actually ask in {SECTOR}. There are about ten you do not answer anywhere, and a competitor owns four of them.' }
  ]},
  pr: { label: 'PR & communications', assets: [
    { name: 'The Share of Voice Snapshot',
      what: 'Show where {TARGET} sits against the {SECTOR} field on coverage, tone and the specific topics they get quoted on.',
      why: 'A {ROLE} usually only sees their own clippings. Seeing their position in the field is a different and more useful picture.',
      steps: ['Pull twelve months of coverage for them and four competitors.',
              'Split it by volume, quality of title and topic, not just mentions.',
              'Name the one topic they should own and currently do not.'],
      line: 'We mapped twelve months of {SECTOR} coverage. There is one topic the category keeps getting asked about and nobody has claimed it.' },
    { name: 'The Story Nobody Told',
      what: 'Find the genuinely interesting thing inside {TARGET}\\u2019s business that has never been written about, and draft the story.',
      why: 'Every business has one. Finding it proves you looked properly, which is rarer than it should be and lands with any {ROLE}.',
      steps: ['Read their annual report, their job ads and their supplier pages, not their press releases.',
              'Find the detail that would make a journalist lean forward.',
              'Draft the pitch and name the three journalists who would run it.'],
      line: 'We went looking through your reports and job ads and found something nobody seems to have written about. Drafted the story and the three people who would run it.' },
    { name: 'The Risk Nora',
      what: 'Map the three reputational pressures building in {SECTOR} that {TARGET} will probably have to answer for within a year.',
      why: 'It makes you useful before the crisis rather than after it, which is the only time a {ROLE} really remembers who helped.',
      steps: ['Track regulation, campaign groups, journalist beats and competitor incidents.',
              'For each, say what the question will be and who will ask it.',
              'Offer a one-page holding position for each, written and ready.'],
      line: 'Three things are building in {SECTOR} that you will likely get asked about this year. We wrote a holding position for each, just in case.' }
  ]},
  content: { label: 'Content, social & production', assets: [
    { name: 'The Output Audit',
      what: 'Review ninety days of {TARGET}\\u2019s content, show what actually performed and what was made out of habit.',
      why: 'A {ROLE} is usually drowning in output and short on evidence. Separating the two is immediately useful.',
      steps: ['Pull every public post across their channels for the period.',
              'Sort by engagement per post against effort to produce.',
              'Name the format to kill and the format to triple.'],
      line: 'We looked at ninety days of your content and sorted it by what it probably cost to make against what it returned. One format is carrying everything.' },
    { name: 'The Reuse Map',
      what: 'Take one asset {TARGET} already owns and show the twelve things they could have made from it without shooting anything new.',
      why: 'It addresses {PROBLEM_SHORT} with their existing budget, which makes a {ROLE} look good without asking for more money.',
      steps: ['Pick their most expensive recent production.',
              'Storyboard twelve cutdowns, formats and edits from the same material.',
              'Put a realistic cost against the whole set so the saving is obvious.'],
      line: 'We took your last big shoot and mapped twelve more things you could have made from the same footage. Rough costs attached.' },
    { name: 'The Format Test',
      what: 'Make one piece of content for {TARGET} in a format their category does not use, and send it finished.',
      why: 'Nothing explains a new format in a deck. Making it is the whole argument, and it is the most permissionless thing you can do.',
      steps: ['Pick a format that is working elsewhere but absent in {SECTOR}.',
              'Make one real example with their brand on it, properly finished.',
              'Attach what it cost you to make, honestly.'],
      line: 'Nobody in {SECTOR} is using this format yet, so we made you one to see what it would look like. It took half a day.' }
  ]},
  full: { label: 'Full service or integrated', assets: [
    { name: 'The Growth Leak',
      what: 'Build a one-page read on where growth is most likely leaking for {TARGET}, from awareness through to repeat purchase.',
      why: 'It positions you across the whole problem rather than one discipline, which is the conversation a {ROLE} actually wants to have.',
      steps: ['Use public data at every stage: search volume, reviews, pricing, retention signals.',
              'Mark each stage healthy, unclear or leaking, and be honest where you cannot tell.',
              'Lead with the stage where a small fix moves the most revenue.'],
      line: 'We built a one-page read on where growth might be leaking for you. Two stages look fine. One looks like it is costing you real money.' },
    { name: 'The Competitor Move You Missed',
      what: 'Document the quiet thing a {SECTOR} competitor has started doing that {TARGET} has probably not noticed yet.',
      why: 'Competitive intelligence is the easiest thing in the world for a {ROLE} to forward internally, and your name is on it.',
      steps: ['Watch job ads, tech stacks, packaging changes and pricing, not press releases.',
              'Explain what the move tells you about where they are heading.',
              'Say what you would do about it if it were your call.'],
      line: 'One of your competitors has quietly started doing something that showed up in their job ads before anywhere else. Thought you would want to see it.' },
    { name: 'The First Ninety Days',
      what: 'Write the plan you would run in your first ninety days with {TARGET}, as if you already had the business.',
      why: 'It removes every reason to wait for a pitch process. The {ROLE} can see exactly what working with you feels like.',
      steps: ['Be specific about weeks one to four, five to eight and nine to twelve.',
              'Name what you would need from them and what you would deliver.',
              'Include the thing you would stop doing, not just what you would start.'],
      line: 'We wrote the first ninety days as if we already had the business. It is presumptuous, but it beats another credentials deck.' }
  ]}
};

const L_SECTORS = {
  retail:   { label: 'Retail & ecommerce',      signals: ['new store openings and closures', 'trading statements and like-for-like sales', 'a new head of ecommerce appearing on LinkedIn'] },
  fmcg:     { label: 'FMCG, food & drink',      signals: ['new product launches and delistings', 'a listing won or lost with a major grocer', 'packaging changes appearing in store'] },
  finance:  { label: 'Finance & insurance',     signals: ['regulatory changes and FCA consultations', 'app store review spikes after a release', 'a new brand or marketing lead appointed'] },
  travel:   { label: 'Travel & hospitality',    signals: ['route, site or property announcements', 'seasonal booking data and pricing moves', 'a shift in review scores after a refurbishment'] },
  health:   { label: 'Health, pharma & wellbeing', signals: ['approvals, guidance changes and NHS tenders', 'recruitment for commercial or brand roles', 'competitor entry into their category'] },
  tech:     { label: 'Tech & SaaS',             signals: ['funding rounds and headcount changes', 'product releases and changelogs', 'review sentiment on G2 or Capterra'] },
  auto:     { label: 'Automotive & mobility',   signals: ['model launches and registration data', 'dealer network changes', 'shifts in the electric range or pricing ladder'] },
  charity:  { label: 'Charity & public sector', signals: ['annual report income lines', 'tender notices and framework renewals', 'a new director of fundraising or comms'] },
  b2b:      { label: 'B2B & industrial',        signals: ['contract wins announced in trade press', 'hiring in sales or marketing', 'a new site, plant or acquisition'] },
  media:    { label: 'Entertainment & media',   signals: ['commissioning and slate announcements', 'subscriber or audience numbers', 'a platform or distribution change'] }
};

const L_ROLES = {
  cmo:      { label: 'CMO or Marketing Director', cares: 'proving marketing built the business, not just the brand' },
  brand:    { label: 'Brand or Marketing Manager', cares: 'getting something approved internally without a fight' },
  growth:   { label: 'Head of Growth or Performance', cares: 'the number moving this quarter, not next year' },
  ecom:     { label: 'Head of Ecommerce or Digital', cares: 'conversion, basket size and anything that slows the site down' },
  insight:  { label: 'Insight or Data lead',      cares: 'evidence that holds up when the board pushes back' },
  comms:    { label: 'Comms or PR Director',      cares: 'owning the narrative before someone else sets it' },
  founder:  { label: 'Founder or CEO',            cares: 'growth that does not depend on them being in the room' },
  procure:  { label: 'Procurement or marketing ops', cares: 'defensible value and a reason to shortlist you at all' }
};

const L_PROBLEMS = {
  standout:  { g:'brand', label:'They look and sound like everyone else', short:'sameness in the category' },
  dated:     { g:'brand', label:'Their brand feels dated', short:'a brand that has aged badly' },
  relevant:  { g:'brand', label:'They have lost relevance', short:'fading cultural relevance' },
  reposition:{ g:'brand', b:'dated', label:'They need to reposition or rebrand', short:'a positioning that no longer fits' },
  purpose:   { g:'brand', b:'relevant', label:'Their purpose is not felt by customers', short:'a purpose customers do not feel' },
  portfolio: { g:'brand', b:'standout', label:'Their brand portfolio is confusing', short:'a portfolio that confuses people' },
  price:     { g:'brand', b:'standout', label:'They are stuck competing on price', short:'being stuck on price' },
  customer:  { g:'cust', label:'They do not really understand their customer', short:'a thin view of the customer' },
  newaud:    { g:'cust', b:'relevant', label:'They need to win a new audience', short:'winning a new audience' },
  retain:    { g:'cust', label:'They win customers but do not keep them', short:'retention leaking faster than acquisition' },
  loyalty:   { g:'cust', b:'retain', label:'Their loyalty and CRM is underused', short:'loyalty and CRM that underdelivers' },
  launch:    { g:'cust', b:'working', label:'New products are not landing', short:'launches that fade too fast' },
  expand:    { g:'cust', b:'relevant', label:'They are moving into new markets', short:'cracking a new market' },
  working:   { g:'perf', label:'Their marketing is not working hard enough', short:'marketing that underperforms its budget' },
  roi:       { g:'perf', label:'They cannot prove what marketing returns', short:'measurement that does not convince the board' },
  media:     { g:'perf', b:'working', label:'Their media is spread too thin', short:'media spread too thin' },
  cac:       { g:'perf', b:'roi', label:'Acquisition costs keep climbing', short:'rising acquisition costs' },
  convert:   { g:'perf', b:'working', label:'Plenty of traffic, not enough sales', short:'traffic that does not convert' },
  search:    { g:'perf', b:'relevant', label:'They are invisible in search and AI answers', short:'invisibility in search and AI answers' },
  b2bpipe:   { g:'perf', b:'working', label:'Their B2B pipeline is thin', short:'a thin B2B pipeline' },
  slow:      { g:'work', label:'They are too slow to move', short:'speed to market' },
  content:   { g:'work', b:'slow', label:'They cannot keep up with content demand', short:'content demand outrunning the team' },
  stretched: { g:'work', b:'slow', label:'Their in-house team is stretched', short:'an in-house team stretched thin' },
  data:      { g:'work', b:'roi', label:'Their data is messy or siloed', short:'messy, siloed data' },
  joined:    { g:'work', b:'working', label:'Channels and agencies are not joined up', short:'channels that do not join up' },
  story:     { g:'rep', b:'standout', label:'A great story nobody has heard', short:'a great story nobody has heard' },
  reputation:{ g:'rep', b:'relevant', label:'Their reputation needs work', short:'a reputation that needs repair' },
  sustain:   { g:'rep', b:'relevant', label:'Their sustainability story lacks proof', short:'a sustainability story without proof' },
  talent:    { g:'rep', b:'relevant', label:'They struggle to attract talent', short:'a weak employer brand' }
};
const L_PROB_GROUPS={brand:'Brand and positioning',cust:'Customers and growth',perf:'Marketing performance',work:'Ways of working',rep:'Reputation and story'};
const probBase=k=>(L_PROBLEMS[k]&&L_PROBLEMS[k].b)||k;
const L_PICK = {
  creative:{working:0,slow:0,relevant:0,customer:1,roi:1,retain:1,standout:2,dated:2},
  media:{standout:0,slow:0,dated:0,working:1,roi:1,retain:1,relevant:2,customer:2},
  brand:{working:0,customer:0,retain:0,standout:1,roi:1,dated:2,relevant:2,slow:2},
  data:{relevant:0,slow:0,standout:0,dated:0,customer:1,retain:1,roi:2,working:2},
  digital:{customer:0,retain:0,dated:0,working:1,slow:1,standout:2,relevant:2,roi:2},
  pr:{standout:0,roi:0,working:0,relevant:1,dated:1,customer:1,slow:2,retain:2},
  content:{working:0,roi:0,slow:0,retain:1,customer:1,standout:2,relevant:2,dated:2},
  full:{working:0,retain:0,roi:0,customer:0,slow:1,standout:1,relevant:2,dated:2}
};

const L_DISC = {
  creative: { cap:'creative and campaign thinking', asset:'three campaign routes sketched on a single page' },
  media:    { cap:'media planning and buying', asset:'a short media read with three places their money could work harder' },
  brand:    { cap:'brand strategy and identity', asset:'a one page brand read: what the brand says today, and what this moment needs it to say' },
  data:     { cap:'data, insight and measurement', asset:'a quick data cut that answers the question their board will ask next' },
  digital:  { cap:'digital, ecommerce and customer experience', asset:'a teardown of their customer journey with three fixes ranked by likely revenue' },
  pr:       { cap:'PR and communications', asset:'a narrative note: the story they are telling, the story the press is telling, and how to close the gap' },
  content:  { cap:'content and social', asset:'a content sprint with five ideas they could publish this month' },
  full:     { cap:'joined up brand, media and digital work', asset:'a one page plan that joins brand, media and digital around this moment' }
};

const L_ANGLES = {
  pitch: {
    why:'They are formally looking. The shortlist is not settled, and the agencies that show real thinking early are the ones who get in the room.',
    move:'Ask to be considered, then send {ASSET} straight away so they see how you think before the first meeting. Keep it short and specific to their brief.',
    line:'Saw {CO} is looking at agencies. We would love to be considered, and we put together a short piece of thinking so you can see how we work. Want it?' },
  agency: {
    why:'A new agency means a new plan, and the gaps around it are wide open: the disciplines the new agency does not cover, and the people who will need help making it work.',
    move:'Do not compete with the new appointment. Send {ASSET} on the part of the plan they are not covering, using {CAP}, and offer to make the new work go further.',
    line:'Congratulations on the new agency at {CO}. We had a thought about the bit around the edges that usually gets missed. Happy to share, no strings.' },
  leadership: {
    why:'New leaders get roughly 90 days to set a direction, and they rarely feel loyal to the agencies they inherited. The roster is more open now than it will be for years.',
    move:'Send the new team {ASSET}, framed as what you would look at in their first 100 days. No pitch attached. Make it something they could take into their first board meeting.',
    line:'Saw the leadership news at {CO}. We put together a short note on what we would look at in the first 100 days. No pitch, it is yours either way.' },
  results: {
    why:'Results are when the board writes its questions down. Whatever the headline, someone in marketing now owns a number they have to move before the next update.',
    move:'Pick the one line in the statement about growth or pressure and build {ASSET} around it. Show how {CAP} moves that exact number, using their own figures.',
    line:'Read the latest numbers from {CO} and one line jumped out. We sketched how we would attack it. Happy to send it over, no strings.' },
  expansion: {
    why:'Growing into new places means new audiences who have never heard of them, and an in-house team stretched across more openings than it can handle well.',
    move:'Send {ASSET} for the new market or sites: who they need to win there and how {CAP} gets them noticed from day one.',
    line:'Congratulations on the expansion at {CO}. We had a think about how you win the people who do not know you yet there. Want the one pager?' },
  launch: {
    why:'Launches get one burst of noise and then attention moves on. Most brands have a plan for week one and nothing for month three.',
    move:'Send {ASSET} focused on the second wave: how to keep the launch growing after the first push fades, using {CAP}.',
    line:'Loved the new launch from {CO}. We sketched a few ideas for keeping it going once the first wave settles. Yours if useful.' },
  deal: {
    why:'A change of ownership or a big deal resets budgets, priorities and often agency rosters. New owners want early proof that the brand can grow.',
    move:'Send {ASSET} on what the brand should protect and what it should change under the new structure. Position {CAP} as the route to early, visible wins.',
    line:'Big moment for {CO} with the deal. We put down a few thoughts on what to protect and where the early wins are. Happy to share.' },
  restructure: {
    why:'Cost cutting does not stop marketing, it raises the bar. Fewer people have to deliver more, and they want partners who make them look efficient, not expensive.',
    move:'Send {ASSET} that saves them time or money rather than asking for budget. Show how {CAP} does more with less.',
    line:'Know it is a tight year at {CO}. We pulled together a couple of ideas that save rather than spend. Worth a look?' },
  brand: {
    why:'They are actively investing in how they show up, so marketing has budget, attention and an appetite for ideas right now.',
    move:'Send a short, generous response to the work: what is landing, one thing you would build on, and {ASSET}. Respect the incumbent and add to what they started.',
    line:'Really enjoyed the latest work from {CO}. We had one idea for building on it that we could not stop talking about. Want it?' },
  digital: {
    why:'A digital push creates a gap between what the product can now do and what customers actually understand about it.',
    move:'Send {ASSET} showing how customers will discover and adopt what they have built, using {CAP}.',
    line:'Saw what {CO} is building on the digital side. We mapped how customers might find and use it. Happy to send it over.' },
  sustainability: {
    why:'Commitments are easy to announce and hard to make people care about. The proof and the story usually lag behind the pledge.',
    move:'Send {ASSET} on turning the commitment into something customers notice and believe, using {CAP}.',
    line:'Great to see the commitment from {CO}. We had a few thoughts on making it land with customers. Yours if useful.' },
  regulation: {
    why:'Regulatory change forces a rethink of messaging, products or channels, usually on a deadline nobody chose.',
    move:'Send {ASSET} on what the change means for how they talk to customers, and how {CAP} keeps them ahead of it.',
    line:'With the changes hitting {CO}, we put together a short note on what it means for how you talk to customers. Want it?' },
  none: {
    why:'No big headline this quarter, which means nobody else has a reason to get in touch either. Quiet accounts are often the most receptive.',
    move:'Check the live news link for anything in the last few weeks, then send {ASSET} built around {PROB}. Watch for {SIGNAL}.',
    line:'Been looking at {CO} and had an idea about {PROB}. Put it on a page. Happy to send it over, no strings.' }
};

/* ── triggers: the "why now" behind a reach out ─────────────── */
const L_TRIGGER_LABELS={agency:'Agency move',pitch:'Open pitch or review',leadership:'New leadership',results:'Results or trading update',expansion:'Expansion or new sites',launch:'A launch',deal:'A deal or change of ownership',restructure:'Restructure or cost cutting',brand:'New brand or campaign work',digital:'A digital push',sustainability:'A sustainability commitment',regulation:'Regulatory change',none:'No headline, a quiet account'};
const L_TRIGGER_IC={agency:'🤝',pitch:'🎯',leadership:'👤',results:'📊',expansion:'📍',launch:'🚀',deal:'💼',restructure:'✂️',brand:'🎨',digital:'💻',sustainability:'🌱',regulation:'⚖️',none:'🌙'};
const L_AGENCY_SIZES={xs:'1 to 10 people',sm:'11 to 30 people',md:'31 to 100 people',lg:'More than 100'};
const L_CLIENT_SIZES={S:'Challengers and scale ups',M:'Established mid-size brands',L:'Big household names',any:'A mix'};

/* ── what makes the dashboard work: the files it runs on ────── */
const DATA_NEEDS=[
  {k:'outreach',must:true,ic:'📧',l:'Your email outreach export',sum:'Opens, clicks and replies for every person you email',
   why:'Opens, clicks and replies are the earliest sign someone is leaning in. This one file powers most of the intent radar and your open and click-through rates.',
   cols:['Company','Name','Title','Email','Opened','Clicked','Replied'],block:'email_seq',often:'Every Monday',
   from:[['Outreach','Activity, Sequence, choose the sequence, More options, Export prospects. It includes delivered, opened, clicked and replied for each prospect.'],
         ['Apollo','Export the contacts in your sequence as a CSV, with their email status columns switched on.'],
         ['HubSpot','Export the contacts enrolled in your sequence with their email engagement.'],
         ['Lemlist, Instantly, Reply, Woodpecker','Export the campaign leads as a CSV with opened, clicked and replied columns.']]},
  {k:'linkedin',ic:'🔗',l:'LinkedIn outreach activity',sum:'Who accepted your connection and who replied',
   why:'An accepted connection or a reply means the door is open. It lifts the account on the radar and tells you who to follow up.',
   cols:['Company','Name','Title','Accepted','Replied'],block:'li_out',often:'Every Monday',
   from:[['Amplify','Results flow in by themselves once it is switched on.'],['Sales Navigator or an automation tool','Export the campaign or lead list as a CSV.'],['By hand','Log accepts and replies on the How page. Two clicks each.']]},
  {k:'ads',ic:'📣',l:'LinkedIn ads company engagement',sum:'Which organisations see and click your ads',
   why:'Shows the organisations warming to you before anyone fills in a form. Clicks count for more than impressions.',
   cols:['Company','Impressions','Clicks','Engagements'],block:'li_ads',often:'Every two weeks',
   from:[['LinkedIn Campaign Manager','Plan, Companies, choose the dates and campaigns, then export the company engagement report as a CSV.']]},
  {k:'downloads',ic:'🎁',l:'Downloads and form fills',sum:'Everyone who took your report, tool or guide',
   why:'Someone who downloads your thinking is telling you exactly what they care about. It is one of the strongest signals there is.',
   cols:['Company','Name','Title','Email','Asset'],block:'content',often:'When a piece is live',
   from:[['HubSpot, Typeform, Webflow, Formspree','Export the form submissions as a CSV.']]},
  {k:'events',ic:'🎪',l:'Event and webinar lists',sum:'Who registered and who turned up',
   why:'Being in a room with you is the strongest signal of all. Attendees jump straight up the radar.',
   cols:['Company','Name','Title','Attended'],block:'events',often:'After each event',
   from:[['Eventbrite, Luma, Zoom, Hopin','Export attendees or registrants as a CSV.'],['By hand','Add who was there on the How page, Events tab.']]},
  {k:'deals',ic:'📈',l:'Your live deals',sum:'Opportunities you are already working',
   why:'Lets the target tracker, forecast and reports count themselves instead of being typed in.',
   cols:['Organisation','Value','Stage','Next step'],often:'Once, then keep the board updated',
   from:[['HubSpot, Pipedrive, Salesforce','Export deals or opportunities as a CSV.'],['By hand','Add them on the Pipeline board.']]}
];

/* column names each metric is likely to have in a provider export */
const METRIC_SYN={
  'contacted':['contacted','prospects - total','emails sent','sent','total prospects','leads'],'delivered':['delivered','prospects - delivered','deliveries','email delivered'],
  'opened':['opened','opened?','email opened','opens','prospects - opened','open'],'clicked':['clicked','clicked?','email clicked','clicks','prospects - clicked','click'],
  'replied':['replied','replied?','email replied','replies','prospects - replied','reply'],'connections sent':['connections sent','invites sent','requests sent','invitation sent','invited'],
  'accepted':['accepted','connected','connection accepted','accepted?'],'messages':['messages','messages sent','messaged','message sent'],'replies':['replies','replied','reply','replied?'],
  'spend':['total spent','amount spent','spend','cost','total_spend'],'impressions':['impressions','imp.','imp'],'reach':['reach','members reached'],
  'leads':['leads','lead form completions','conversions'],'invited':['invited','invites'],'registered':['registered','registrations','registrants'],'attended':['attended','attendance','checked in','attended?'],
  'conversations':['conversations'],'meetings':['meetings','meetings booked','meeting'],'questions':['questions'],'follow-ups':['follow-ups','follow ups'],
  'page views':['page views','views','sessions'],'downloads':['downloads','submissions'],'named downloaders':['named downloaders'],'packs sent':['packs sent','sent'],
  'responses':['responses','responded'],'pieces live':['pieces live','pieces','articles'],'views':['views','reads'],'inbound enquiries':['inbound enquiries','enquiries'],
  'intros':['intros','introductions'],'briefs':['briefs']
};
/* which signal a row from each block's file turns into */
const BLOCK_ROW_SIGNAL={
  email_seq:[['replied','reply'],['clicked','email_click'],['opened','email_open']],
  li_out:[['replies','li_reply'],['replied','li_reply'],['accepted','li_accept']],
  li_ads:[['clicks','ad_click'],['engagements','ad_engage'],['impressions','ad_view']],
  paid_social:[['clicks','ad_click'],['reach','ad_view']],
  events:[['attended','event_attend'],['*','webinar_signup']],
  webinar:[['attended','webinar_attend'],['*','webinar_signup']],
  content:[['*','content']],
  mail:[['responses','reply']],
  referrals:[['*','referral']]
};

const L_SIZES = {
  S: { label:'Challenger brand', short:'challenger' },
  M: { label:'Mid-size',         short:'mid-size' },
  L: { label:'Household name',   short:'household name' }
};
const L_REGIONS = {
  lse:    'London & the South East',
  swales: 'South West & Wales',
  mide:   'Midlands & East',
  north:  'North of England',
  scotni: 'Scotland & Northern Ireland'
};
const L_ASIZES = {
  xs: { label:'1 to 10 people',  fit:{S:30,M:16,L:2},  n:'a small team' },
  sm: { label:'11 to 30 people', fit:{S:26,M:30,L:8},  n:'a team of your size' },
  md: { label:'31 to 100 people',fit:{S:12,M:30,L:22}, n:'a team of your size' },
  lg: { label:'More than 100',   fit:{S:4, M:24,L:30}, n:'an agency of your scale' }
};
/* Curated prospect list, Scope & Lens Q4 2026 edition. Public information only: every news line links to its source. */
const PROSPECTS_AS_OF='2026-10';
const PROSPECTS=[["Greggs","retail","Bakery and food to go","Newcastle","north","L","results","2026-07","First-half sales rose 7.2% to £1.1bn and pre-tax profit 20% to £76m, with 34 net new shops and 100 to 110 openings planned this year.","https://www.yorkshirepost.co.uk/business/greggs-reveals-sales-grew-to-top-ps11bn-for-first-half-of-2026-8827188","Yorkshire Post"],["JD Sports","retail","Sports fashion","Bury","north","L","restructure","2026-05","JD Sports plans to close about 175 Hibbett stores over three years, favouring larger formats, and expects flat organic sales growth in fiscal 2027 amid muted markets.","https://fashionunited.uk/news/retail/jd-sports-to-close-175-hibbett-stores-as-restructuring-continues/2026050887940","FashionUnited"],["Card Factory","retail","Cards and gifting","Wakefield","north","L","results","2026-09","First-half revenue rose 5.3% to £260.8m but UK like-for-like sales fell 2.3%; it is merging Funky Pigeon and cardfactory.co.uk and pushing into gifts and party.","https://www.marketbeat.com/instant-alerts/transcript-card-factory-h1-earnings-call-highlights-2026-09-29/","MarketBeat"],["Pets at Home","retail","Pet care","Handforth","north","L","leadership","2026-03","James Bailey, formerly managing director of Waitrose, became chief executive on 30 March 2026 as the retailer pursues a turnaround after two profit warnings.","https://uk.marketscreener.com/news/uk-s-pets-at-home-names-james-bailey-as-ceo-ce7d50d3db8cf127","MarketScreener"],["AO.com","retail","Online electricals","Bolton","north","M","results","2026-04","AO World guided to about 11% revenue growth and profit at the top of its £45m to £50m range for the year to March 2026.","https://www.theretailbulletin.com/general-merchandise/ao-expects-11-revenue-growth-with-profits-at-top-end-of-guidance-10-04-2026/","The Retail Bulletin"],["Dunelm","retail","Homewares","Leicester","mide","L","results","2026-09","Dunelm reported FY26 sales of £1.83bn, up 3.1%, and launched a three-year 'Winning Hearts & Homes' strategy including app and AI shopping assistant investment.","https://pulse2.com/dunelm-reports-fy2026-sales-of-1-83-billion-and-launches-winning-hearts-homes-growth-strategy/","Pulse 2.0"],["Gymshark","retail","Activewear","Solihull","mide","M","expansion","","Gymshark is opening its first gym, the Gymshark Lifting Club, in Miami's Wynwood district later in 2026, moving beyond apparel into in-person fitness.","https://athletechnews.com/gymshark-is-making-the-jump-from-retail-to-in-person-fitness/","Athletech News"],["Hobbycraft","retail","Arts and crafts","Burton upon Trent","mide","M","results","2026-07","Hobbycraft exited its CVA 13 months early, with online active users up 13%, three new stores opened and nine underperforming shops closed.","https://retailtimes.co.uk/hobbycraft-exits-cva-ahead-of-schedule-as-screen-free-hobbies-and-new-model-making-culture-fuel-turnaround/","Retail Times"],["The White Company","retail","Home and fashion","London","lse","M","leadership","2026-04","Chief executive Paula Nickolds is leaving at the end of May after two years, and the retailer is searching for an interim and permanent successor.","https://www.retailgazette.co.uk/blog/2026/04/the-white-company-ceo-paula-nickolds-to-step-down/","Retail Gazette"],["Boden","retail","Fashion","London","lse","M","expansion","2026-08","Boden opened its second US store in Nashville and plans a third in Birmingham, Alabama this autumn; US is nearly half of group revenue.","https://www.retailgazette.co.uk/blog/2026/08/boden-us-stores/","Retail Gazette"],["Mountain Warehouse","retail","Outdoor clothing","London","lse","M","leadership","2026-08","Founder Mark Neale steps back to executive chair as Marcus Ward becomes chief executive on 1 September, after turnover passed £500m for the first time.","https://www.theretailbulletin.com/sport-and-leisure/mountain-warehouse-names-marcus-ward-as-new-ceo-as-founder-steps-down-11-08-2026/","The Retail Bulletin"],["Moonpig","retail","Online cards and gifts","London","lse","M","results","2026-06","FY26 revenue rose 6.5% to £373m with 12.3m active customers, under new chief executive Catherine Faiers, who joined in March 2026.","https://www.directorstalkinterviews.com/moonpig-group-reports-higher-fy26-revenue-profit-and-cash-generation/4121254712","DirectorsTalk"],["Bloom & Wild","retail","Online flowers","London","lse","S","launch","2026-07","Bloom & Wild relaunched its seasonal 100% Organic Blooms bouquet from a Soil Association certified Herefordshire farm, with £1 per sale going to Rewilding Britain.","https://retailtimes.co.uk/bloom-wild-relaunches-its-100-organic-blooms/","Retail Times"],["Gousto","retail","Recipe boxes","London","lse","M","leadership","2026-09","Founder and chief executive Timo Boldt is moving to a board role after nearly 15 years, with a successor due in the first half of 2027.","https://www.grocerygazette.co.uk/2026/09/17/gousto-founder-step-down/","Grocery Gazette"],["FatFace","retail","Fashion","Havant","lse","M","launch","2026-04","FatFace is trialling a free in-store personal styling service in six stores through summer 2026 and has added WhatsApp customer service, now 18% of contacts.","https://uk.fashionnetwork.com/news/Fatface-trials-in-store-personal-styling-service,1821974.html","FashionNetwork"],["Seasalt Cornwall","retail","Fashion","Falmouth","swales","M","restructure","2026-06","Seasalt closed all four of its US stores by mid-May, shifting to wholesale partners to lift international sales from 16% to over 20% of revenue.","https://www.retailgazette.co.uk/blog/2026/06/seasalt-closes-us-stores/","Retail Gazette"],["Lush","retail","Cosmetics","Poole","swales","L","digital","2026-04","Lush is expanding experiential retail, launching an app feature to book in-store workshops and consultations from late April, alongside click-and-collect and its Lush Lens scanning tool.","https://www.retailgazette.co.uk/blog/2026/04/lush-kasey-swithenbank/","Retail Gazette"],["Superdry","retail","Fashion","Cheltenham","swales","M","expansion","2026-03","Superdry plans 21 new stores in 2026, 15 in the UK and six in Europe including Berlin and Utrecht, following its Superdry & Co rebrand.","https://fashionunited.uk/news/retail/superdry-plots-21-new-store-openings-amid-european-expansion/2026032787135","FashionUnited"],["Schuh","retail","Footwear","Livingston","scotni","M","leadership","2026-07","Genesco appointed Tomas Petersson, formerly of Foot Locker EMEA, as president of Schuh, replacing Colin Temple who is retiring after 38 years.","https://www.worldfootwear.com/news/genesco-announces-leadership-transition-at-schuh/11671.html","World Footwear"],["Innocent Drinks","fmcg","Smoothies and juices","London","lse","S","leadership","2026-06","Innocent appointed former SodaStream global CMO Sam Grant as Director of Marketing and Innovation, replacing Kirsty Hunter, as it accelerates its Fruiture strategy.","https://www.grocerygazette.co.uk/2026/06/04/innocent-poaches-former-sodastream-cmo-for-top-marketing-role/","Grocery Gazette"],["Fever-Tree","fmcg","Premium mixers","London","lse","S","results","2026-09","H1 revenue rose 7% to £184.2m, with US sales up 11% at constant currency after its first national US marketing campaign.","https://pulse2.com/fever-tree-h1-adjusted-revenue-rises-7-to-184-2-million-as-u-s-growth-accelerates/","Pulse 2.0"],["Pip & Nut","fmcg","Nut butters","London","lse","S","results","2026-09","Posted its first full-year profit for 2025, with revenue up 50% to £26.4m and a post-tax profit of about £733k.","https://www.grocerygazette.co.uk/2026/09/30/pip-nut-reports-first-ever-profit-in-full-year-results/","Grocery Gazette"],["Rude Health","fmcg","Plant based drinks and cereals","London","lse","S","brand","2026-05","Launched a £1m integrated campaign running 18 months, its biggest since the 2024 Oddlygood takeover, targeting shoppers worried about ultra-processed food.","https://www.grocerygazette.co.uk/?p=115522","Grocery Gazette"],["Graze","fmcg","Healthy snacking","London","lse","S","deal","2026-02","Katjes International completed its purchase of Graze from Unilever, keeping about 180 staff and aiming for roughly €100m of UK revenue this year.","https://retail-news.de/katjes-uebernahme-graze-unilever-2026/","Retail News"],["Ella's Kitchen","fmcg","Baby food","Henley-on-Thames","lse","S","launch","2026-05","Launched Ella's Kitchen Kids, non-HFSS Crunchy Stix and Wild Crackers for children over 18 months, with more categories promised later in 2026.","https://www.grocerygazette.co.uk/2026/05/08/ellas-kitchen-expands-beyond-baby-food-with-new-range-for-bigger-kids/","Grocery Gazette"],["Huel","fmcg","Nutrition","Tring","lse","S","deal","2026-03","Danone agreed to buy Huel in a deal worth about €1bn, to expand its complete nutrition portfolio, subject to regulatory approvals.","https://www.nutraingredients.com/Article/2026/03/24/danone-expands-complete-nutrition-portfolio-with-1-billion-huel-deal","NutraIngredients"],["Warburtons","fmcg","Bakery","Bolton","north","L","leadership","2026-06","Executive chairman and two cousins plan to step back from day-to-day running within a year, with sixth-generation family members on the board as it turns 150.","https://www.retailgazette.co.uk/blog/2026/06/warburtons-leadership-trio-prepares-to-step-back-as-bakery-marks-150-years/","Retail Gazette"],["Taylors of Harrogate","fmcg","Tea and coffee","Harrogate","north","M","leadership","2026-09","Appointed Fiona Fox, formerly of Inspired Pet Nutrition, as managing director of Taylors of Harrogate, replacing Andy Brown after 17 years.","https://www.yorkshirepost.co.uk/business/outstanding-leaders-new-bosses-for-bettys-and-yorkshire-tea-maker-taylors-of-harrogate-revealed-8981133","Yorkshire Post"],["Princes","fmcg","Food and drink","Liverpool","north","L","leadership","2026-07","Chief executive Simon Harrison departed and Giuseppe Mastrolia, previously chief commercial officer, became interim CEO of Princes Group.","https://princescareers.com/?p=6560","Princes Group"],["Cranswick","fmcg","Food production","Hull","north","L","results","2026-05","Full-year revenue rose 9.5% to £2.98bn and adjusted operating profit climbed 14.5% to £237m, led by poultry, gourmet and pet products.","https://www.grocerygazette.co.uk/2026/05/19/cranswick-posts-strong-full-year-results/","Grocery Gazette"],["Weetabix","fmcg","Breakfast cereals","Kettering","mide","M","launch","2026-05","Launched an 850g Crispy Minis Chocolate Chip pack, as the range grew 13% and household penetration hit a six-year high, backed by £10m masterbrand spend.","https://retailtimes.co.uk/weetabix-crispy-minis-expands-with-new-850g-format-as-brand-hits-growth-high/","Retail Times"],["Tyrrells","fmcg","Crisps and snacks","Leominster","mide","S","none","","","",""],["Grenade","fmcg","Protein snacks","Solihull","mide","S","expansion","2026-08","Launched in the US from Austin, Texas, with four protein bar flavours including Oreo collaborations, sold via Amazon, GNC and Vitamin Shoppe.","https://www.webull.com/news/15457941460698112","Webull"],["Yeo Valley","fmcg","Organic dairy","Blagdon","swales","M","results","2026-02","Turnover rose to £424.6m but pre-tax profit fell to £4.6m, in year two of a five-year investment plan and after its first acquisition, The Collective.","https://dairynews.today/global/news/yeo-valley-farms-reports-424-6-million-turnover-amid-strategic-growth.html","Dairy News Today"],["Thatchers Cider","fmcg","Cider","Sandford","swales","S","brand","2026-05","Launched its Brighter Days Call for a Better Cider summer campaign with Initials CX, a new agency relationship, using Aardman-designed visuals across on and off trade.","https://www.grocerygazette.co.uk/2026/05/19/thatchers-launches-summer-campaign-with-initials-cx/","Grocery Gazette"],["Clipper Teas","fmcg","Tea","Beaminster","swales","S","brand","2026-06","Ran limited-edition Wilderness Festival packs with a ticket giveaway and three festival activations, aiming to reach about 45,000 younger shoppers.","https://www.grocerygazette.co.uk/2026/06/02/clipper-teas-set-to-launch-wilderness-festival-packs-in-stores/","Grocery Gazette"],["BrewDog","fmcg","Craft beer","Ellon","scotni","M","deal","2026-08","Now owned by Tilray after a discounted March 2026 deal, it ran a Park IPA summer push with 20,000 cans via Deliveroo.","https://drinks-intel.com/beer/tilray-brands-gives-brewdog-summer-themed-uk-push/","Drinks Intel"],["Baxters","fmcg","Soups and preserves","Fochabers","scotni","M","none","","","",""],["Tunnock's","fmcg","Confectionery","Uddingston","scotni","S","brand","2026-07","A giant Tunnock's teacake closed the Glasgow 2026 Commonwealth Games opening ceremony, and the firm has announced a factory expansion for international demand.","https://www.grocerygazette.co.uk/2026/07/24/tunnocks-teacake-commonwealth-games-opening/","Grocery Gazette"],["Aviva","finance","Insurance and savings","London","lse","L","none","","","",""],["Monzo","finance","Digital banking","London","lse","M","results","2026-05","Monzo reported FY2026 revenue up 39% to £1.7bn, adjusted pre-tax profit of £172.6m and 15.2m customers, and launched in Ireland in April with Spain next.","https://paymentexpert.com/2026/05/19/monzo-fy2026-results-revenue-profit/","Payment Expert"],["Starling Bank","finance","Digital banking","London","lse","M","results","2026-05","Starling posted a fifth year of profit, with £217.1m pre-tax profit on £887.4m revenue, and is pushing its Engine software platform and AI banking tools.","https://starlingbank.com/news/starling-delivers-fifth-year-of-profitability-and-accelerates-global-growth-strategy","Starling Bank"],["Zopa","finance","Digital banking","London","lse","M","results","2026-03","Zopa reported a third straight annual profit of £44.9m and said take-up of its Biscuit current account was 40% ahead of plan, with 1.7m customers.","https://tech.eu/2026/03/19/zopa-reports-third-consecutive-year-of-profit-says-take-up-of-new-current-account-topping-expectations/","Tech.eu"],["Moneybox","finance","Savings and investing app","London","lse","S","results","2026-05","Moneybox reported 2025 revenue up 23% to £115.6m, 1.71m customers and £19bn assets, and plans to roll out AI-powered personal financial advice.","https://support.moneyboxapp.com/moneybox-strengthens-market-position-as-profitability-scale-and-product-diversification-drive-record-year/","Moneybox"],["Nationwide","finance","Building society","Swindon","swales","L","expansion","2026-05","Nationwide will overtake Lloyds in June 2026 to run the UK's largest branch network, with 696 branches including Virgin Money sites, ahead of a Virgin rebrand from 2028.","https://www.morningstar.co.uk/uk/news/AN_1779359554936282200/nationwide-to-overtake-lloyds-to-have-uks-biggest-branch-network.aspx","Morningstar"],["Hargreaves Lansdown","finance","Investment platform","Bristol","swales","M","leadership","2026-08","Hargreaves Lansdown hired two Vanguard executives as chief technology officer and chief transformation officer from September 2026, following a record £100m investment commitment in FY26.","https://ground.news/article/hargreaves-lansdown-strengthens-executive-leadership-team","Ground News"],["LV=","finance","Insurance and pensions","Bournemouth","swales","M","results","2026-09","LV= protection sales fell 17.7% to £186m in the first half of 2026, though overall sales held broadly stable at £580m.","https://healthcareandprotection.com/?p=102276","Health & Protection"],["Admiral","finance","Car and home insurance","Cardiff","swales","L","results","2026-08","Admiral's H1 2026 pre-tax profit fell 18% to £429.2m while customers passed 12m and Admiral Money loan balances grew 39% to £1.88bn.","https://admiralgroup.co.uk/news-releases/news-release-details/admiral-group-reports-good-h1-2026-results-and-continued-growth","Admiral Group"],["Principality Building Society","finance","Building society","Cardiff","swales","M","results","2026-08","Principality's half-year results showed underlying profit of £22.2m, net interest margin up to 1.27% and £33m returned to members, under CEO Iain Mansfield.","https://businessnewswales.com/principality-building-society-delivers-member-value-today-while-building-long-term-strength/","Business News Wales"],["Coventry Building Society","finance","Building society","Coventry","mide","M","deal","2026-07","Coventry's H1 2026 results showed underlying profit down to £183m as it integrates the Co-operative Bank, with transfer into the Society planned for early 2027.","https://www.coventrybuildingsociety.co.uk/content/dam/cbs/member/pdfs/financial-results/2026/2026-Interim-Financial-Results-News-Release.pdf","Coventry Building Society"],["Yorkshire Building Society","finance","Building society","Bradford","north","M","results","2026-07","Yorkshire BS reported H1 2026 statutory profit of £181.9m, with 288,000 new savings accounts and over a quarter of new mortgages going to first-time buyers.","https://www.ybs.co.uk/w/2026-half-year-results-show-growth-in-mortgage-and-savings-balances","Yorkshire Building Society"],["Leeds Building Society","finance","Building society","Leeds","north","M","results","2026-07","Leeds BS H1 2026 profit fell to £70.7m from £104.4m and lending dropped to £2.0bn as it invests in a multi-year technology modernisation programme.","https://www.leedsbuildingsociety.co.uk/press/press-releases/2026/07/2026-interim-financial-results/","Leeds Building Society"],["Skipton Building Society","finance","Building society","Skipton","north","M","results","2026-07","Skipton's H1 2026 group profit fell to £110.3m from £135.1m, as estate agency arm Connells' underlying profit dropped from £24.9m to £2.0m.","https://joshthompson.co.uk/investing/skipton-building-society-half-year-results-2026/","Josh Thompson"],["Ecology Building Society","finance","Ethical building society","Silsden","north","S","none","","","",""],["easyJet","travel","Airline","Luton","lse","L","expansion","2026-09","easyJet announced 18 new routes for summer 2027, including two from Bristol Airport.","https://centreforaviation.com/members/direct-news/easyjet-announces-18-new-routes-for-next-summer-including-two-from-bristol-airport-754397","CAPA"],["Whitbread (Premier Inn)","travel","Hotels","Dunstable","lse","L","results","2026-06","Whitbread's Q1 FY27 group sales rose 2% to £727m, with Germany accommodation sales up 16% on new Premier Inn openings and UK up 3%.","https://www.whitbread.co.uk/wp-content/uploads/2026/06/Q1-FY27-Trading-Update.pdf","Whitbread"],["Haven","travel","Holiday parks","Hemel Hempstead","lse","L","none","","","",""],["Travelodge","travel","Hotels","Thame","lse","L","leadership","2026-08","Travelodge chief executive Joanna Boydell left after 13 years and CFO Ray Reidy became interim CEO while the board searches for a permanent successor.","https://www.travelodge.co.uk/our-business/media/press-release/appointment-of-interim-chief-executive-officer-and-q2-results-announcement/","Travelodge"],["Leon","travel","Restaurants","London","lse","M","restructure","2026-05","Leon closed 23 company-owned restaurants through a CVA, leaving 43 open, after co-founder John Vincent bought it back from Asda and injected £2.5m.","https://www.restaurantonline.co.uk/Article/2026/05/07/leon-confirms-the-closure-of-23-sites-as-john-vincent-injects-25-million/","Restaurant Online"],["Jet2","travel","Airline and holidays","Leeds","north","L","results","2026-07","Jet2 reported FY26 revenue of £7.48bn and pre-tax profit of £551m, announced a £250m buyback and plans seven aircraft at Gatwick by summer 2027.","https://global.morningstar.com/en-gb/news/alliance-news/1783502037172090500/jet2-shares-up-as-plans-share-buyback-dividend-hike-amid-revenue-rise","Morningstar"],["Hays Travel","travel","Travel agency","Sunderland","north","M","none","","","",""],["Center Parcs","travel","Holiday villages","Newark","mide","L","none","","","",""],["Mitchells & Butlers","travel","Pubs and restaurants","Birmingham","mide","L","results","2026-09","Q4 like-for-like sales rose 1.4% and drink sales 3.8%, with cost headwinds expected to ease from £120m to about £95m in FY2027.","https://www.hl.co.uk/shares/stock-market-news/company--news/mitchells-and-butlers-returns-to-growth-in-q4-on-strong-drinks-sales","Hargreaves Lansdown"],["YHA","travel","Hostels","Matlock","mide","M","restructure","2026-06","YHA is selling six hostels for £7.9m and ending leases on three more as it streamlines its 73-site network after difficult trading years.","https://www.civilsociety.co.uk/news/yha-offloads-nine-sites-in-effort-to-streamline-business-model.html","Civil Society"],["Merlin Entertainments","travel","Attractions","Poole","swales","L","launch","2026-09","Chessington has revealed a Minecraft World hotel and an Escape the Nether rollercoaster, part of Merlin's wider Minecraft theme park rollout.","https://www.themeparkguide.co.uk/news-page/year/2026?page=4","Theme Park Guide"],["St Austell Brewery","travel","Pubs and brewing","St Austell","swales","M","brand","2026-03","St Austell is marking its 175th anniversary in 2026 with revived classic cask ales and a new anniversary beer called 1851.","https://www.thedrinksbusiness.com/2026/03/st-austell-to-revives-its-classic-beers/","The Drinks Business"],["Hall & Woodhouse","travel","Pubs and brewing","Blandford Forum","swales","M","results","2026-09","Underlying pre-tax profit rose 16% to £9.3m for the year to January 2026, with brewery volumes up 4% and capital spend of £19.1m.","https://catererlicensee.com/hall-woodhouse-announces-record-profits/","Caterer & Licensee"],["Loganair","travel","Regional airline","Glasgow","scotni","S","restructure","2026-08","Loganair will close its Southampton base from late October 2026, after cutting Inverness frequencies, citing sustained losses and rising fuel, repair and airport costs.","https://centreforaviation.com/news/loganair-to-close-base-at-southampton-airport-from-late-oct-2026-1368942","CAPA"],["Bupa","health","Health insurance and care","London","lse","L","none","","","",""],["Superdrug","health","Health and beauty retail","Croydon","lse","L","none","","","",""],["The Gym Group","health","Gyms","Croydon","lse","M","results","2026-09","Half-year revenue rose 10% to £133.1m and adjusted pre-tax profit 31% to £6.4m, with membership at 1 million and 20 or more openings planned.","https://www.hl.co.uk/shares/stock-market-news/company--news/gym-group-sees-fy-earnings-at-top-end-of-forecasts-as-h1-profits-rise","Hargreaves Lansdown"],["Nuffield Health","health","Health and fitness","Epsom","lse","L","none","","","",""],["Simplyhealth","health","Health plans","Andover","lse","M","none","","","",""],["Vitabiotics","health","Vitamins","London","lse","S","deal","2026-07","Bain Capital agreed to buy Vitabiotics and the wider VB Group in a deal reported at around $850m to $900m, with the Lalvani family staying on.","https://medicaldialogues.in/amp/news/industry/pharma/bain-capital-to-acquire-uks-top-vitamin-brand-vitabiotics-in-usd-900-million-deal-175770","Medical Dialogues"],["Bulk","health","Sports nutrition","Colchester","lse","S","none","","","",""],["Boots","health","Pharmacy and beauty","Nottingham","mide","L","deal","2026-09","Sycamore Partners is reportedly close to selling Boots to the Weston family for about $9bn, with a deal possible within weeks.","https://wsau.com/2026/09/30/walgreens-owner-sycamore-nears-9-billion-sale-of-boots-wsj-reports/","WSAU (WSJ report)"],["Holland & Barrett","health","Health and wellness retail","Nuneaton","mide","L","none","","","",""],["Vision Express","health","Opticians","Nottingham","mide","M","none","","","",""],["PureGym","health","Gyms","Leeds","north","M","results","2026-08","Half-year revenue rose 6% to £393m and adjusted EBITDA 23%, with 728 sites, 60 openings planned this year and new CEO Alex Wood targeting Ireland.","https://www.healthclubmanagement.co.uk/health-club-management-news/Cost-controls-and-disciplined-management-sees-PureGym-thrive-in-all-markets/363512","Health Club Management"],["Myprotein","health","Sports nutrition","Manchester","north","M","launch","2026-06","Myprotein unit sales are up 60% year to date, with retail expansion and new energy drink, protein water and breakfast ranges planned for the second half.","https://www.ajbell.co.uk/news/articles/thg-backs-full-year-outlook-despite-unprecedented-whey-inflation","AJ Bell"],["Westfield Health","health","Health cash plans","Sheffield","north","S","launch","2026-04","Launched Evolve, a digital platform for intermediaries to quote and manage health cash plans, with Perci Health cancer screening and neurodiversity support added.","https://healthcareandprotection.com/westfield-health-adds-perci-health-screening-and-launches-adviser-platform/","Healthcare & Protection"],["Wise","tech","Money transfer","London","lse","L","deal","2026-05","Listed on Nasdaq on 11 May while keeping its London listing, after net revenue of $2.5bn and cross-border volume of $243bn for the year to March.","https://www.morningstar.co.uk/uk/news/AN_1778496508356713400/wise-debuts-on-new-yorks-nasdaq%3b-keeps-lse-main-market-listing-.aspx","Morningstar"],["Trainline","tech","Rail and coach booking","London","lse","M","results","2026-03","Full-year net ticket sales rose 7% to £6.32bn, but UK consumer revenue fell 1.9% after commission cuts; profit guidance was confirmed.","https://www.ajbell.co.uk/news/articles/trainline-track-meet-profit-guidance-ticket-sales-climb","AJ Bell"],["Deliveroo","tech","Food delivery","London","lse","M","none","","","",""],["Thought Machine","tech","Banking software","London","lse","S","none","","","",""],["Cleo","tech","Money app","London","lse","S","none","","","",""],["Ocado","tech","Online grocery technology","Hatfield","lse","L","restructure","2026-02","Announced up to 1,000 job cuts and £150m of savings, merging two divisions, after Kroger and Sobeys closed four North American fulfilment centres.","https://www.retail-insight-network.com/newsletters/ocado-cut-1000-jobs","Retail Insight Network"],["Rightmove","tech","Property portal","Milton Keynes","lse","M","digital","2026-07","H1 revenue rose 7% to £225.8m, with agentic AI tools like Ask Rightmove lifting lead conversion, while legal claims over agent fees weigh on shares.","https://thenegotiator.co.uk/news/marketing-news/rightmove-reports-h1-revenue-up-7-with-major-ai-progress/","The Negotiator"],["Arm","tech","Chip design","Cambridge","mide","L","launch","2026-03","Unveiled the AGI CPU on 24 March, its first production silicon in 35 years, with 136 Neoverse cores on a 3nm process aimed at data centres.","https://www.tikr.com/es/blog/arm-holdings-unveiled-its-first-chip-in-35-years-what-a-599-target-means-for-investors","TIKR"],["Darktrace","tech","Cyber security","Cambridge","mide","M","none","","","",""],["Auto Trader","tech","Automotive marketplace","Manchester","north","M","results","2026-05","Full-year revenue rose 4% to £624.3m and operating profit to £392.7m, with about £500m of buybacks planned next year and retailer numbers slightly down.","https://www.stockopedia.com/share-prices/autotrader-LON:AUTO/news/autotrader-grp-full-year-results-for-the-year-ended-31-march-2026-019e6dd5-0ee5-77c4-8a37-bd3d575579bb/","Stockopedia (RNS)"],["Matillion","tech","Data software","Manchester","north","S","none","","","",""],["Sage","tech","Accounting software","Newcastle","north","L","results","2026-05","Half-year underlying revenue rose 11% to £1,363m, with cloud native revenue up 25% and a £600m share buyback announced.","https://www.sage.com/investors/investor-downloads/press-releases/2026/05/trading-update-for-the-six-months-ended-31-march-2026/","Sage"],["MONY Group","tech","Price comparison","Ewloe","swales","M","digital","2026-04","Reiterated full-year guidance after a good start to 2026 and launched version 2 of its MoneySuperMarket ChatGPT app with an AI Price Optimiser.","https://www.marketscreener.com/news/mony-confident-for-year-after-good-growth-in-first-four-months-ce7f58dbdf8aff24","MarketScreener"],["Immersive Labs","tech","Cyber security training","Bristol","swales","S","none","","","",""],["Skyscanner","tech","Travel search","Edinburgh","scotni","M","digital","2026-07","Launched Explore with AI and a Road Trip Planner, and grew its Stays platform from 3.5 million to over 5 million properties.","https://www.traveldailynews.com/technology/skyscanner-expands-ai-travel-planning-tools-and-live-flight-features/","Travel Daily News"],["FreeAgent","tech","Accounting software","Edinburgh","scotni","S","none","","","",""],["Kainos","tech","Digital services","Belfast","scotni","M","results","2026-08","Expects to beat analyst forecasts for the year to March 2027, citing record backlog and double-digit growth in both Workday services and products.","https://www.irishtimes.com/business/2026/08/18/kainos-sees-momentum-as-nusiness-continues-to-grow/","Irish Times"],["McLaren","auto","Supercars","Woking","lse","M","expansion","2026-04","Plans a £450m investment at Woking and up to 1,000 new jobs, under new owner CYVN and chief executive Nick Collins, as it diversifies.","https://www.am-online.com/news/mclaren-plans-450m-uk-investment-and-1-000-new-jobs","AM Online"],["Brompton","auto","Folding bikes","London","lse","S","none","","","",""],["Pod Point","auto","EV charging","London","lse","S","deal","2026-05","Pod Point has acquired UK home charger maker EO Charging, expanding its position in the domestic and commercial EV charging market.","https://www.electrive.com/es/2026/05/19/pod-point-acquires-eo-charging-in-the-uk/","electrive"],["JLR","auto","Premium cars","Coventry","mide","L","results","2026-06","JLR held an investor day at Gaydon on 17 June, with CEO PB Balaji setting out strategy, financial outlook and its House of Brands approach.","https://media.jlr.com/corporate/news/2026/05/jaguar-land-rover-automotive-plc-announces-investor-day-2026-0","JLR media"],["Aston Martin","auto","Luxury cars","Gaydon","mide","M","restructure","2026-07","Aston Martin posted a £154.2m first-half pre-tax loss on revenue up 38% to £628.6m, secured £550m of debt funding and is cutting up to 600 jobs.","https://cardealermagazine.co.uk/aston-martin-posts-154-2m-first-half-loss-but-insists-turnaround-is-on-track/325976","Car Dealer Magazine"],["Halfords","auto","Motoring and cycling retail","Redditch","mide","L","none","","","",""],["Motorpoint","auto","Used car retail","Derby","mide","M","expansion","2026-04","Motorpoint forecast FY26 pre-tax profit up 83% to £7.5m on retail volumes up 8%, and plans a new Leeds store opening in summer 2026.","https://www.investegate.co.uk/announcement/rns/motorpoint-group--motr/full-year-trading-update-and-new-store-opening-/9509122","Investegate (RNS)"],["Morgan Motor Company","auto","Hand built cars","Malvern","mide","S","none","","","",""],["National Express","auto","Coach and bus","Birmingham","mide","L","deal","2026-08","Parent Mobico is selling its West Midlands bus business to the West Midlands Combined Authority for about £24m upfront, with completion expected in November 2026.","https://www.expressandstar.com/news/national-express-bosses-say-bus-sale-was-logical-for-company-8927557","Express & Star"],["Lotus","auto","Sports cars","Hethel","mide","M","none","","","",""],["Bentley","auto","Luxury cars","Crewe","north","M","none","","","",""],["Lookers","auto","Car dealerships","Altrincham","north","L","none","","","",""],["Arnold Clark","auto","Car dealerships","Glasgow","scotni","L","none","","","",""],["FirstGroup","auto","Bus and rail","Aberdeen","scotni","L","none","","","",""],["Stagecoach","auto","Bus and coach","Perth","scotni","L","none","","","",""],["Cancer Research UK","charity","Cancer research","London","lse","M","none","","","",""],["British Heart Foundation","charity","Heart and circulatory research","London","lse","M","none","","","",""],["Macmillan Cancer Support","charity","Cancer support","London","lse","M","none","","","",""],["Marie Curie","charity","End of life care","London","lse","M","none","","","",""],["Shelter","charity","Housing and homelessness","London","lse","M","none","","","",""],["Mind","charity","Mental health","London","lse","S","none","","","",""],["Dogs Trust","charity","Animal welfare","London","lse","M","none","","","",""],["Barnardo's","charity","Children's charity","London","lse","L","none","","","",""],["Teenage Cancer Trust","charity","Young people with cancer","London","lse","S","none","","","",""],["Guide Dogs","charity","Sight loss","Reading","lse","M","brand","2026-09","Its chief fundraising and marketing officer is repositioning the brand to show Guide Dogs does far more than guide dogs, and has launched a new creative platform.","https://www.marketingweek.com/guide-dogs-marketing-priorities/","Marketing Week"],["Oxfam GB","charity","International development","Oxford","lse","M","brand","2026-09","Happy Hour won a three-way pitch to create Oxfam's 2026 Christmas campaign, launching in November across TV, social and radio, plus a new Christmas offering.","https://lbbonline.com/news/Oxfam-Appoints-Happy-Hour-to-Create-2026-Christmas-Campaign","LBB Online"],["RNLI","charity","Lifesaving at sea","Poole","swales","M","none","","","",""],["National Trust","charity","Heritage and nature","Swindon","swales","L","none","","","",""],["Tenovus Cancer Care","charity","Cancer support in Wales","Cardiff","swales","S","results","2026-07","Its 2025/26 annual report puts financial resilience first, prioritising efficiency, partnerships and income growth to meet demand for support across Wales.","https://www.tenovuscancercare.org.uk/news-and-views-listings/tenovus-cancer-care-202526-annual-report-and-accounts","Tenovus Cancer Care"],["RSPB","charity","Nature conservation","Sandy","mide","M","restructure","2026-06","The RSPB is consulting staff on simplifying its structure beyond the reserves, as operating costs rose from about £150m to £185m and wage costs added £2m.","https://www.rspb.org.uk/whats-happening/news/ensuring-the-rspb-remains-resilient-and-ambitious-for-nature","RSPB"],["The Christie Charity","charity","Cancer hospital charity","Manchester","north","S","none","","","",""],["Chest Heart & Stroke Scotland","charity","Health charity","Edinburgh","scotni","S","none","","","",""],["Action Cancer","charity","Cancer charity","Belfast","scotni","S","none","","","",""],["Halma","b2b","Safety and health technology","Amersham","lse","L","results","2026-06","Full-year revenue rose 15% to £2.58bn and adjusted profit 22% to £594.5m, with five acquisitions worth £447m plus two more since year end.","https://www.halma.com/news/press-releases/2026/full-year-results-2025-26","Halma"],["Wates","b2b","Construction and property","Leatherhead","lse","M","results","2026-04","2025 turnover reached £2.56bn with £29.2m pre-tax profit, net cash of £248m and a record £10bn forward order book under CEO Eoghan O'Lionaird.","https://www.construction.co.uk/construction-news/329771/wates-posts-record-10bn-order-book-as-2025-results-show-resilience","Construction.co.uk"],["Brakes","b2b","Foodservice wholesale","Ashford","lse","L","none","","","",""],["Renishaw","b2b","Precision engineering","Wotton-under-Edge","swales","M","results","2026-09","Full-year revenue rose 14% to £816m and adjusted operating profit 36% to £153m, driven by semiconductor encoders and additive manufacturing, with a special dividend.","https://www.marketbeat.com/instant-alerts/transcript-renishaw-h2-earnings-call-highlights-2026-09-23/","MarketBeat"],["Spirax Group","b2b","Industrial engineering","Cheltenham","swales","L","results","2026-08","First-half revenue was £863m with adjusted operating profit up 8% to £171.1m, though shares fell about 10% as full-year guidance was left unchanged.","https://www.punchline-gloucester.com/articles/aanews/spirax-profits-climb-in-first-half-results-2026","Punchline Gloucester"],["Screwfix","b2b","Trade tools and supplies","Yeovil","swales","L","leadership","2026-05","Kingfisher, Screwfix's owner, said CEO Thierry Garnier is leaving to run Ahold Delhaize after a 12-month notice period, and has started recruiting a successor.","https://www.theretailbulletin.com/home-and-diy/kingfisher-ceo-thierry-garnier-to-step-down-06-05-2026/","The Retail Bulletin"],["Toolstation","b2b","Trade tools and supplies","Bridgwater","swales","M","results","2026-08","Toolstation UK sales grew 2.6% in H1 with Toolstation Club at 900,000 members, while Travis Perkins is discussing a sale of loss-making Benelux operations.","https://www.insightdiy.co.uk/news/travis-perkins-h1-group-sales-down-solid-toolstation-performance/16598.htm","Insight DIY"],["JCB","b2b","Construction equipment","Rocester","mide","L","expansion","2026-09","JCB is investing £100m in its Staffordshire HQ and opening a $1bn San Antonio factory in October, expected to create 1,500 US jobs over five years.","https://www.themanufacturer.com/articles/jcb-accelerates-global-manufacturing-investment-with-100m-uk-transformation-and-1bn-us-factory/","The Manufacturer"],["Travis Perkins","b2b","Builders merchant","Northampton","mide","L","results","2026-08","Half-year revenue fell 1.8% to £2,258m on weaker volumes, but net cash improved to £55m and a strategic review is exploring a Toolstation Benelux sale.","https://www.insightdiy.co.uk/news/travis-perkins-h1-group-sales-down-solid-toolstation-performance/16598.htm","Insight DIY"],["Croda","b2b","Speciality chemicals","Snaith","north","M","results","2026-07","Croda's first-half sales reached £880.5m, up 4.6% organically, led by Consumer Care and Beauty Actives, with full-year organic growth guidance held at 3 to 6%.","https://chemxplore.com/news/croda-half-year-results","ChemXplore"],["Victrex","b2b","High performance polymers","Thornton-Cleveleys","north","M","restructure","2026-09","Victrex raised full-year profit guidance to £45m to £47m after completing a 10% workforce reduction that saves at least £10m a year.","https://www.ajbell.co.uk/news/articles/victrex-raises-annual-guidance-strong-momentum-continues","AJ Bell"],["Weir Group","b2b","Mining technology","Glasgow","scotni","L","leadership","2026-04","Weir confirmed Jon Stanton steps down as chief executive on 1 August 2026, with Minerals division president Andrew Neilson taking over.","https://www.ajbell.co.uk/news/articles/weir-reaffirms-full-year-outlook-ceo-steps-down","AJ Bell"],["Aggreko","b2b","Mobile power","Glasgow","scotni","L","sustainability","2026-04","Aggreko is preparing to power the FIFA World Cup and is deploying battery-backed UPS, HVO fuel and Tier 4 Final generators at major sports events.","https://www.sportsvideo.org/2026/04/19/live-from-nab-2026-aggrekos-joe-scionti-on-powering-the-super-bowl-pga-championship-and-the-road-to-the-fifa-world-cup/","SVG"],["Wrightbus","b2b","Bus manufacturing","Ballymena","scotni","M","expansion","2026-07","Wrightbus is marking its 80th anniversary, has launched operations in Australia and put 14 new double-deckers on Wales' TrawsCymru network, with electric buses due in 2027.","https://businessnewswales.com/wrightbus-fleet-now-transporting-passengers-across-wales/","Business News Wales"],["ITV","media","Broadcaster","London","lse","L","deal","2026-07","Sky agreed to buy ITV's Media & Entertainment arm, including ITVX, for up to £1.6bn, with ITV Studios staying listed and completion expected in late 2027.","https://thedesk.net/2026/07/official-comcast-sky-acquiring-itv-britain/","The Desk"],["Channel 4","media","Broadcaster","London","lse","M","leadership","2026-03","Channel 4 appointed Priya Dogra, previously Sky's chief advertising, group data and new revenue officer, as chief executive, succeeding interim chief Jonathan Allan.","https://www.exchange4media.com/people-movement-news/priya-dogra-takes-charge-as-ceo-of-channel-4-152578.html","exchange4media"],["Global","media","Radio and outdoor","London","lse","M","results","2026-08","Global reported 29 million weekly listeners and a 27.5% share in Q2 2026 RAJAR, with Heart at 12.8 million and LBC at a record 3.7 million.","https://lbbonline.com/news/Global-RAJAR-Q2-2026","LBB Online"],["Guardian Media Group","media","News publishing","London","lse","M","results","2026-09","The Guardian reported record revenue of £282m for the year to March 2026, with US revenue up 14% and operating losses cut to £17m from £25m.","https://pressgazette.co.uk/media_business/guardian-grows-revenue-to-record-282m-boosted-by-us-operation/","Press Gazette"],["Everyman Cinemas","media","Cinemas","London","lse","M","results","2026-07","Everyman reported first-half revenue up 23.9% to £70.0m across 49 venues, and flagged a delisting announcement due before the end of August 2026.","https://www.investegate.co.uk/announcement/rns/everyman-media-group--eman/corporate-and-trading-update/9687764","Investegate"],["Ambassador Theatre Group","media","Theatres","London","lse","M","none","","","",""],["Mumsnet","media","Online community","London","lse","S","none","","","",""],["Hollywood Bowl Group","media","Bowling and leisure","Hemel Hempstead","lse","M","results","2026-04","Hollywood Bowl's half-year revenue rose 9.4% to £141.5m, with 77 UK and 16 Canadian centres and three more openings planned in the second half.","https://www.yorkshirepost.co.uk/business/hollywood-bowl-group-sees-investments-pay-off-as-revenues-lift-6575793","Yorkshire Post"],["Future plc","media","Specialist media","Bath","swales","M","results","2026-05","Future's half-year pretax profit fell 67% to £18.4m on weaker programmatic ad and ecommerce affiliate revenue, with a plan to unlock value from weaker assets.","https://www.morningstar.co.uk/uk/news/AN_1778751973562617300/future-holds-guidance-as-interim-earnings-fall-on-hit-to-advertising.aspx","Morningstar"],["Aardman","media","Animation studio","Bristol","swales","S","brand","2026-09","Aardman is marking its 50th anniversary with a Propstore auction of over 220 puppets and props, with proceeds funding Aardman Academy bursaries.","https://www.aardman.com/latest-news/2026/september/iconic-aardman-puppets-head-to-auction-as-studio-celebrates-50th-anniversary/","Aardman"],["S4C","media","Welsh language broadcaster","Carmarthen","swales","S","digital","2026-04","S4C deepened its YouTube partnership as part of a digital-first strategy, launching a Newyddion S4C channel after 1.1 million YouTube viewing hours last year.","https://senalnews.com/en/digital/s4c-deepens-youtube-partnership-to-accelerate-digital-first-strategy/amp","Senal News"],["Frontier Developments","media","Video games","Cambridge","mide","M","none","","","",""],["Team17","media","Video games","Wakefield","north","S","none","","","",""],["DC Thomson","media","Publishing","Dundee","scotni","M","none","","","",""],["STV","media","Broadcaster","Glasgow","scotni","M","restructure","2026-03","STV's 2025 profit fell 44% to £11.6m, with no dividend, an £8m cost-saving programme and news production being consolidated in Glasgow pending an Ofcom decision.","https://www.scotsman.com/business/stv-pushes-ahead-with-changes-as-profits-and-dividend-wiped-out-by-ongoing-uncertainty-6022729","The Scotsman"]].map(r=>({name:r[0],sector:r[1],sub:r[2],city:r[3],region:r[4],size:r[5],nt:r[6],nd:r[7],news:r[8],src:r[9],pub:r[10]}));
/* formats a value-led asset can take */
const FORMATS=[
  {k:'report',l:'Report',ic:'doc',d:'A short, sharp read on their world'},
  {k:'tool',l:'Tool',ic:'grid',d:'A calculator, score or checker they can use'},
  {k:'video',l:'Teardown video',ic:'play',d:'Two minutes on their work, recorded for them'},
  {k:'audit',l:'Audit',ic:'magnify',d:'A no-strings diagnostic, findings shared either way'},
  {k:'event',l:'Roundtable',ic:'people',d:'A room of peers. They talk, you host'},
  {k:'bench',l:'Benchmark',ic:'chart',d:'How they compare with the people they watch'}
];
/* how they will be reached */
const REACH_CH=[
  {k:'linkedin',l:'LinkedIn',ic:'linkedin'},{k:'email',l:'Email',ic:'mail'},{k:'phone',l:'Phone',ic:'phone'},
  {k:'event',l:'Events',ic:'calendar'},{k:'workshop',l:'Workshop',ic:'people'},{k:'mail',l:'Direct mail',ic:'send'},{k:'social',l:'Content',ic:'doc'}
];
/* the Scope & Lens recommended mix, and why each channel earns its place */
const REC_CH=['linkedin','email','event','workshop','phone','mail'];
const CH_WHY={linkedin:'Instant rapport and credibility. Keeps the conversation flowing around whatever you send by email.',email:'Detailed, personalised insight that shows you have done the research, with tracked links so engagement is captured.',
  event:'Find the rooms they are in, or invite them to yours. If you want to meet them, say so.',workshop:'The natural end point. A free workshop with your team is where in-person trust is built.',
  phone:'Warm only, never cold. Unlocks when they have engaged and you have their number.',mail:'Gets you in front of them in the real world. A chance to be inventive with what you send.',social:'Posts that put your thinking in front of the whole buying group.'};
