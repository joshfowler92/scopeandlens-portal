# Permissionless Portal, version 12

The growth portal is now the **Permissionless Portal**. If an agency adds its logo, the top left reads as theirs: their logo tile, their name, and "Permissionless Portal" underneath.

## Plato and the crew

- **Plato is the guide.** He sits bottom right on every page. He can see the whole portal (campaigns, brands, people, signals, pipeline, the agency profile) and answers anything about it: what to do today, who is warming up, which brand to lean into, what a campaign should look like.
- **Plato does things, not just says them.** Ask "find decision makers at Taylors of Harrogate and add them to Standing out in food" and he does it. He can also make campaigns, find and add brands, set the problem, choose the gift, set channels or use the recommended route, move deals, log signals, explain a score, set the digest and go to any page. Anything that sends or launches asks first, and every change can be undone from the toast.
- With `ANTHROPIC_API_KEY` set, Plato is Claude with those tools. Without it, he still follows a set of built-in commands and answers from the portal's own data.
- **The four steps are run by a crew of bots**, each with one job and a dry, slightly cheeky personality:
  - **Radar** finds who to target. Deadpan, allergic to guesswork, deals in scores out of 100.
  - **Spark** makes what to share. Full of ideas, has to be stopped from suggesting ten gifts.
  - **Ping** plans how to reach them. Obsessed with pacing: never two emails in a week.
  - **Rocket** launches it. Small burns every day, ten minutes at a time.
- **They talk to each other.** Under each bot's message is a short exchange between the crew about where your campaign is, and each one hands the work on to the next in its own words.
- The bots are drawn in code, so they stay sharp at any size, blink, scan and pulse. Plato keeps his statue portrait.

## First login

- **Onboarding with Plato**, in six short chapters:
  1. Hello, with your name and agency
  2. The old way against the permissionless way
  3. The four principles: relevant, valuable, persistent, human
  4. Who, what, how, launch, the bot for each, and the crew talking
  5. Why it works, with Scope & Lens's real numbers
  6. The demo
- **The demo** is a full superuser workspace with invented data, clearly labelled. It never touches your own workspace and nothing in it saves. A guided tour takes you through it. **Build my own** removes it and starts you clean.
- **Agency profile comes first.** Nobody can start a campaign until it is complete.

## Agency profile

- Three tiles: **Who you are**, **Why you** and **Your assets**. They are styled like the tiles above them, and each turns brand navy when it is done.
- **Who you are** asks more, though only the essentials are required:
  - Required: name, website, location, team size, what you do best, services and who signs messages
  - Optional: founded, how you work, sectors you know, the team, first engagement size, your point of view and your voice
- **Who you want** has moved out of the profile and now lives only in each campaign's prospecting preferences.
- **Your assets** now shows much more of what the portal learned from your files: clients, awards, team, method, proof, numbers and phrases. Each item shows where it is used, and you can switch any of it off.
- There are two buttons: **Save agency profile** and **Show me brands that fit**. The second only appears once everything required is done.
- The percentage now sits inside the ring.
- The logo is uploaded in **Settings, Brand** only.
- **Settings, Brand** also takes exact hex codes for every brand colour, with a live preview.

## Who to target (Radar)

- **Change your prospecting preferences** replaces "Your answers".
- **Find prospects now** searches through Amplify when it is connected, and otherwise uses the portal's own research. The UK scan is now a dot map with a radar sweep, and it never quotes a brand count.
- Before the first scan, the page shows only the map and the button. There is no big icon and no logo.
- Finding brands is open to everyone. The **Find more brands (Premium)** button has gone.
- **Scores explained.** Each score is out of 100:

  | Factor | Points |
  | --- | --- |
  | Sector | 40 |
  | Size | 25 |
  | Problems you solve | 15 |
  | Location | 10 |
  | Timing | 10 |

  Tap any score to see each part and why it scored that way against your agency profile.
- **Pitch intelligence** (agency relationships, likely to pitch) stays Premium, including the Likely to pitch filter.
- **Website platforms** (Shopify, Salesforce Commerce Cloud, WordPress and so on) appear on each brand. They come from BuiltWith when `BUILTWITH_API_KEY` is set, and otherwise from reading the brand's home page.
- **Why now** only covers the brands you have chosen, newest first, and refreshes itself at most every six hours.
- Decision maker roles are plain text, so they no longer look like buttons.
- "Where the brands and news come from" has been removed.

## What to share (Spark)

- Fixed the "undefined" page. Each campaign now gets a wide spread of ideas: from your point of view, your proof, your tasters, your case studies and the news on its brands, as well as the standard library. Each idea is set out as problem, your edge, then the gift.
- New campaigns no longer ask which problem they are about. That is chosen here.

## How to reach (Ping)

- No channels are switched on until you choose them, or press **Use the Scope & Lens route**. That route now includes content and LinkedIn Ads.
- If content is on, a post appears every two weeks from week 1 in the plan.
- **LinkedIn profile scan** replaces the checklist:
  1. Paste your profile link, and optionally your About text or LinkedIn's Save to PDF.
  2. An eye-tracking scan reads the page the way a prospect would.
  3. You get a score for how ready the profile is for your target people.
  4. You get three to five changes, each with copy to paste, and you tick them off as you make them.

  The profile is read through Amplify, or Apollo, or whatever you paste. LinkedIn does not let other sites read profiles directly.
- **Events** are picture tiles with the date and an "In N days" badge, soonest first. The pictures are each event's own share image, fetched by the server. The list covers November 2026 to June 2027 (dates checked November 2026).

## Launch (Rocket)

When Amplify is connected and the agency is Premium:
- Launch hands the whole campaign over in one call: people, steps, words, pace and approval mode.
- You can pause and resume.
- Replies come back by webhook or on request.

See `AMPLIFY-INTEGRATION.md`.

## Results

- **Revenue is now Pipeline**, shown as a tracker:
  - a gauge of won against target, with pipeline on top
  - the road to target (won, weighted pipeline, gap)
  - won month by month
  - deals by stage
  - the deal board
- **Signals** is unchanged.

## Alerts and digest

- **Instant alerts** by email, WhatsApp, desktop or Slack, for the moments you choose.
- **A regular email digest** at the frequency, day and hour you choose. It is a clear, professional summary of everything since the last one:
  - who is warming up
  - who to lean into
  - new prospects
  - replies and meetings
  - pipeline movement

  You can preview it and send one now. A scheduled function sends it every hour it is due.

## Everything else

- **Team** sits in the sidebar footer with Agency profile, Manage access and Settings.
- **Guides and how-tos**: eight short guides, each readable in the portal or downloadable as a PDF.
- **Profile photo**: upload your own. It shows top right, on the team view and in Manage access.
- Buttons and pills that did nothing (such as "Read in your browser") are gone.

## Version 12.1

- **The first-login walkthrough is back, step by step.** Nine short screens with Plato:
  1. Hello
  2. The old way against the permissionless way
  3. The principles
  4. Radar's step
  5. Spark's step
  6. Ping's step
  7. Rocket's step
  8. Results (Signals, Pipeline, alerts and Plato, with the proof)
  9. The demo

  Each bot step shows what happens there and what you get. Everyone sees it once on their next login, including people who saw the old version.
- **Your website is read.** Add it in Who you are, or press Read my website in Your assets. The server reads the home page and up to six of your own pages (about, work, clients, services, approach, team, awards), then adds it to What we learned with your uploads: what you do best, proof, cases, clients, awards, team and how you work.
- **Your edge comes from the agency profile.** What to share shows it read-only, with fallbacks to what was learned from your website and assets, so nothing is asked twice. A sync bug that could blank profile fields has been fixed.
- **The LinkedIn scan reads the real profile**, then shows exactly what it read and where it came from:
  - Sources, in order: the public profile page, then Amplify or Apollo if connected, then a web search for that exact profile (needs `ANTHROPIC_API_KEY`), then LinkedIn's Save to PDF or pasted text.
  - If nothing can be read, it says so and asks for the PDF, instead of scoring a blank.
- **The crew chat is on Home only**, under How every campaign gets built, and quieter. The step pages are clean.
- **Plato's button** no longer has a drop shadow.
- **Faster AI.** Every Claude call now skips long thinking and has a time limit that fits inside Netlify's ten seconds. Reading assets uses a faster model; you can override it with `DIGEST_MODEL`. The LinkedIn search model can be overridden with `LISCAN_MODEL`.

## Version 12.2: UX sweep

- **Home leads with the one next thing.** It depends on where you are:
  - No agency profile yet: finish your agency profile, or see the demo.
  - No campaign yet: build your first campaign.
  - A campaign being built: continue with the right bot.
  - A campaign live: today's messages.

  For a live campaign, Who to contact today comes straight after, then your campaigns, then the crew. The target ring only shows once there are numbers in it. The empty starter campaign is no longer shown as if it were real, on Home or in Campaigns.
- **One New campaign button per screen.** It's gone from the campaign bar on the step pages and from the Home hero.
- **Who to target:**
  - Find more prospects sits in the header; the "Want more?" box has gone.
  - The tabs are now Find brands, Your list (with the count) and Why now, because "Brands that fit 12" was really the list count.
- **What to share is about a third of its old length:**
  - The three picks come first, then six ideas made from what you have (with Show more), then your library.
  - The other ideas sit behind "Browse more ideas to give".
  - The content bank comes next.
  - "How to open with each brand" folds away.
- **How to reach:** choose your channels and see the journey first. The LinkedIn scan comes after, before events.
- **Signals:** the warm brands come first. Where the data comes from has moved underneath.
- **Team:** the people table shows the top ten, with Show all.
- **Account menu:** only what is not in the sidebar. Your photo can now be added there; a bug had been hiding it.
- **Settings:** removed the old "Re-run the setup questions" and the duplicate profile shortcuts. Load demo now opens the separate demo instead of overwriting your data.
- **Launch:** LinkedIn readiness now follows the profile scan score.
- **Smaller fixes:**
  - The sidebar fits a laptop screen without hiding Guides.
  - The campaign name is no longer cut short.
  - "Open now" on campaign cards now says "Selected".
  - Mobile tidy-ups for Home, the campaign bar and the sign-in page.

## Version 12.3

- **What we learned: choose or write your own.** Every section has a "Write your own" button:
  - What you do best, why you, your first offer
  - Proof points, case studies, clients
  - Awards, the team, how you work

  What you write is ticked and used straight away, and it survives a fresh read of your files.
- **Who you want lives in the agency profile.** It's a new fourth area: what you do best, sectors, client size, where, the people you sell to and the problems you solve. Your team size from Who you are sets your agency size, so nobody is asked twice. It's set once and used by every campaign. Radar no longer asks; "Change who you want" opens the agency profile.
- **Events pinpointed to your sectors:**
  - 61 events between November 2026 and October 2027, tagged by sector, with dates checked on organisers' sites.
  - For your sectors: events for those sectors, plus the big events every sector attends. All events shows the full list.
  - **Add an event**, with name, dates, venue, link and sectors.
  - **Add to my plan** puts a LinkedIn nudge in the week before and a "meet them there" touchpoint in the event's week. Events stay in the plan when you change channels.
- **What to share starts with the content bank (Step 1).** Upload or link your own pieces, and Spark reads the words. Step 2 then suggests gifts made from that content, tailored to your sectors, the campaign's problem and your chosen roles.
- **New sector-specific gifts.** There are 18 new gift ideas written for particular sectors (retail, FMCG, finance, travel, health, tech, automotive, charity, B2B and media). The ranking now weighs your sectors and the people you sell to.
- **A realistic minimum to launch.** You need:
  - a hero piece
  - a case study
  - a blog post or report

  LinkedIn posts, personalised videos and screen recordings are now nice to have, not required.

## Version 12.4

- **The first-login walkthrough is about the method, without Plato.** Ten short screens:
  1. Hello
  2. The old way against the permissionless way
  3. The formula: the right brands × real value first × a steady rhythm = predictable pipeline
  4. The four steps and their bots
  5. to 8. One screen per step
  9. Signals, conversations, pipeline and won, with the proof
  10. The demo

  Plato stays bottom right inside the portal.

## Version 12.5

- **Campaign performance is its own section** under Results, with a tile per campaign. Each tile shows the week it is in, people reached, brands engaging, conversations and opportunities. Tap one to see:
  - from reach to revenue, as a funnel
  - engagement week by week
  - email, LinkedIn and LinkedIn ads results, each from Amplify, an uploaded CSV or numbers you enter by hand
  - the opportunities it made and its highest-intent brands

  A deal counts towards the most recent live campaign that had the brand before the deal opened.
- **Signals is now Signals & Intent.** One prioritised view across all campaigns:
  - a grid of organisations, each tile listing the people who engaged and what they did
  - the top three highlighted as "Lean in here first"
  - filters by campaign and by heat

  Organisations rise faster when more people engage, on more channels, across more campaigns.
- **The revenue gap.** Signals & Intent opens with what is still to find against target. It then lists the open deals and warm brands not yet in the pipeline that could close the gap.
- **Scores are harder to earn and follow real intent.** Levels need roughly two and a half times the points they did. Busywork earns very little. Points come mostly from prospects:
  - engaging
  - replying (60)
  - booking meetings (120)
  - more people at the same organisation engaging
  - a brand turning hot (80)
  - deals opened (150) and won (500)

  When a prospect shows intent, a short "Intent spike" moment appears with who did what.
- **Twelve-week campaigns by default**, so a year is four quarterly campaigns. The Scope & Lens route uses twelve weeks too.
- **Guides download as proposal-style documents:** A4 portrait, a title block, an "At a glance" table, numbered sections and steps, and a sign-off.
- **Fixes:**
  - **Scrolling no longer jumps on its own.** Smooth scrolling on the page made every redraw animate. The team sync also redrew the whole page every two and a half minutes even when nothing had changed. Now it only redraws when something has changed, and never while you type.
  - **Manage access no longer fails with a 502.** The server kept its storage connection between requests, and its access token expired. It now opens a fresh one each time and retries once.
  - The sidebar collapses and expands from the button top left. Your choice is remembered.
  - "Change who you are targeting" sits with the targeting chips on Who to target, styled as a button.
  - The campaign bar no longer shows the problem pill.
  - The Plato page has a clear "Back to the dashboard" button at the top.
