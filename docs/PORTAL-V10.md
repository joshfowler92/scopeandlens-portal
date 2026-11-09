# Growth portal, version 10

Built from the v7 build prompt, on top of version 9 (live, gated, teams, Amplify). The file is version 10 because versions 7, 8 and 9 have already shipped.

## What is new

**Outreach best practice, built in**
- LinkedIn profile check before any connection request: six checks written for the exact sectors and roles the agency is going after, with a suggested line to copy for each. The first connection request prompts for it if it is not done.
- Connection requests have no note by default. A note is only offered when they have genuinely met or share something real.
- On accept: a relaxed thanks and a light, human line (the season, the week, or their news). No pitch.
- Channels: the user picks, with a one-tap Scope & Lens recommended mix (LinkedIn, email, events, workshop, phone, direct mail). Phone is warm only: it unlocks when the person has engaged and their number has been added. Every campaign ends with the offer of a free workshop. Events come with search links to find where prospects will be. Direct mail comes with creative starting points.
- The content bank is required before launch: the hero piece, a case study, three LinkedIn posts and two blog posts (plus a screen recording when the hero is a tool). Maker drafts posts, outlines and scripts with [brackets] where the agency's own knowledge goes. Nothing counts as ready until the brackets are filled.
- Every email gets its own trackable link to the hero piece. Clicks become signals.

**Publishing (admin only)**: a proper editor (headings, bold, italic, lists, quotes, links, clean paste), the admin chooses the image or no image, and nothing is generated. Publishing is instant on screen. Every user gets an alert on the server, so offline users see it next time; online users get it within a minute.

**The cast**: every section has an agent with a face and a job (Dot, Echo, Scout, Maker, Guide, Pilot, Radar, Tally, Huddle, Scoop). The menu leads with them, each page opens with its agent, and each step hands over to the next.

**Dot's plan**: Dot reads the agency's website (on the server), profile, words and library, and proposes who to go after, the triggers that give the right to reach out, the channels and the angles. The user refines it by talking. Nothing is applied until they say so.

**Pitch intelligence** (the licensed advertiser data, shown in the product as "Pitch intelligence"): uploaded by the admin, stored on the server, sent only to agencies with access, matched to the prospect feed and scored for fit. Advertisers not already in the feed are added as prospects. Switching it off removes it everywhere. The adapter is `INTEL_SRC` in `intel.js`, so the supplier can be swapped without touching anything else.

**Find prospects now**: one big button. Scout travels a map of the UK, reading the brand list, the news and pitch intelligence, dropping pins as matches turn up, and lands on a scored list.

**Build free, pay at launch**: everything is free to build. Launch shows a paywall until the admin ticks "Can launch" for that agency. Pricing and the headline offer are placeholders in `PRICING` (paywall.js).

## New server functions

| Function | Path | What it does |
| --- | --- | --- |
| `plan.mjs` | `/api/plan` | Reads the agency website, and with an AI key writes the plan |
| `intel.mjs` | `/api/intel` | Stores and gates pitch intelligence |
| `links.mjs` | `/api/links`, `/l/*` | Trackable links and clicks |
| `upgrade.mjs` | `/api/upgrade` | "Ready to launch" alert and email to Josh |
| `insights.mjs` | `/api/insights` | Now stores images, tells every user, and has a light "latest" check |

## Still needs live data or a partner

- Sending and tracking on LinkedIn and email for you: Amplify (see `AMPLIFY-INTEGRATION.md`). The free route copies each message for the user to send.
- LinkedIn accepts and replies are logged by the user, or come from Amplify. Email clicks are tracked by the portal's own links.
- Pitch intelligence needs the licence agreed before it is switched on for agencies.
