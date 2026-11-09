# Permissionless Portal, version 12

The growth portal is now the **Permissionless Portal**. If an agency adds its logo, the top left reads as theirs: their logo tile, their name, and "Permissionless Portal" underneath.

## Plato and the gods

- **Plato is the guide.** He sits bottom right on every page. He can see the whole portal (campaigns, brands, people, signals, pipeline, the agency profile) and answers anything about it: what to do today, who is warming up, which brand to lean into, what a campaign should look like.
- **Plato does things, not just says them.** Ask "find decision makers at Taylors of Harrogate and add them to Standing out in food" and he does it. He can also make campaigns, find and add brands, set the problem, choose the gift, set channels or use the recommended route, move deals, log signals, explain a score, set the digest and go to any page. Anything that sends or launches asks first, and every change can be undone from the toast.
- With `ANTHROPIC_API_KEY` set, Plato is Claude with those tools. Without it, he still follows a set of built-in commands and answers from the portal's own data.
- **The four steps are Greek gods**, drawn in Plato's look, each with their own voice:
  - **Who to target** is Artemis (the hunt)
  - **What to share** is Athena (wisdom)
  - **How to reach** is Hermes (the messenger)
  - **Launch** is Apollo (the sun rising every day)
- The god pictures are 3D renders made in the same colour treatment as Plato. They are placeholders: real statue photographs can be swapped in later.

## First login

- **Onboarding with Plato**, in six short chapters:
  1. Hello, with your name and agency
  2. The old way against the permissionless way
  3. The four principles: relevant, valuable, persistent, human
  4. Who, what, how, launch, and the god for each
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

## Who to target (Artemis)

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

## What to share (Athena)

- Fixed the "undefined" page. Each campaign now gets a wide spread of ideas: from your point of view, your proof, your tasters, your case studies and the news on its brands, as well as the standard library. Each idea is set out as problem, your edge, then the gift.
- New campaigns no longer ask which problem they are about. That is chosen here.

## How to reach (Hermes)

- No channels are switched on until you choose them, or press **Use the Scope & Lens route**. That route now includes content and LinkedIn Ads.
- If content is on, a post appears every two weeks from week 1 in the plan.
- **LinkedIn profile scan** replaces the checklist:
  1. Paste your profile link, and optionally your About text or LinkedIn's Save to PDF.
  2. An eye-tracking scan reads the page the way a prospect would.
  3. You get a score for how ready the profile is for your target people.
  4. You get three to five changes, each with copy to paste, and you tick them off as you make them.

  The profile is read through Amplify, or Apollo, or whatever you paste. LinkedIn does not let other sites read profiles directly.
- **Events** are picture tiles with the date and an "In N days" badge, soonest first. The pictures are each event's own share image, fetched by the server. The list covers November 2026 to June 2027 (dates checked November 2026).

## Launch (Apollo)

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
