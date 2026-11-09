# scopeandlens.com, with the Permissionless Portal

This folder is the whole of scopeandlens.com (version 23, unchanged apart from the new client login links) plus the gated Permissionless Portal at `/portal`.

| Path | What it is | Who can see it |
| --- | --- | --- |
| `site/` | The public website, plus the portal pages | Everyone, except `/portal/app` |
| `site/portal/index.html` | Sign in, request access, set or reset a password | Everyone |
| `site/portal/app/` | The Permissionless Portal itself | Only signed-in people Josh has approved |
| `netlify/edge-functions/gate.js` | Checks the session before anything under `/portal/app` is served | Runs on Netlify |
| `netlify/functions/` | Sign in, access requests, teams, live news, AI reading, Amplify | Runs on Netlify |
| `docs/AMPLIFY-INTEGRATION.md` | The spec for connecting the outreach partner | Not published |
| `docs/PORTAL-V12.md` | What is new in version 12 (Plato and the crew, alerts and digest, pipeline tracker) | Not published |
| `docs/PORTAL-V10.md`, `docs/PORTAL-V11.md` | Earlier release notes | Not published |

## How access works

1. Someone clicks **Client login** on the website and chooses **Request access**. They give their name, agency, email and role.
2. Josh gets an email and a notification in the portal. In **Manage access** (avatar menu) he approves or declines, picks the agency (or makes a new one) and the role: team lead or team member.
3. On approval they get an email with a link to set their own password. The link works for seven days.
4. From then on they sign in at `/portal`. Sessions last 14 days in a secure, HttpOnly cookie.
5. Team members can ask for a login for a colleague from inside the portal. It still comes to Josh to approve.

Nobody can create their own login. Passwords are hashed (scrypt), sessions are signed (HMAC), and the portal page itself is never sent to anyone without a valid session.

## Deploying it

Functions and edge functions do not run from a drag-and-drop deploy, so deploy this folder through Git or the Netlify CLI, onto the existing scopeandlens.com site.

**With the Netlify CLI (quickest):**

```
npm install
npx netlify-cli login
npx netlify-cli link          # choose the scopeandlens.com site
npx netlify-cli deploy --prod
```

**With Git:** push this folder to a GitHub repo and, in Netlify, link the site to it (Site configuration, Build and deploy). There is no build command. `netlify.toml` already sets the publish folder (`site`) and the functions.

## Settings (Netlify, Site configuration, Environment variables)

| Variable | Needed? | What it does |
| --- | --- | --- |
| `SESSION_SECRET` | Yes | A long random string (40+ characters). Signs every session. Changing it signs everyone out |
| `ADMIN_EMAIL` | Yes | `josh@scopeandlens.com`. Your own login, and where access requests are emailed |
| `ADMIN_PASSWORD` | Yes | A strong password for your login |
| `RESEND_API_KEY` | Strongly recommended | Sends the emails: access requests to you, set-your-password links, campaign invitations. Without it, the portal shows each link for you to send yourself |
| `MAIL_FROM` | With Resend | For example `Scope & Lens <portal@scopeandlens.com>`. Verify the domain in Resend first |
| `ANTHROPIC_API_KEY` | Strongly recommended | Plato's brain: answers any question about the portal and carries out what people ask. Also the deeper read of each agency's assets and the LinkedIn profile scan. Without it, Plato still works from a set of built-in commands |
| `ANTHROPIC_MODEL` | Optional | Defaults to `claude-sonnet-5-5` |
| `AMPLIFY_API_URL`, `AMPLIFY_API_KEY` | When connected | The outreach partner connection. See `docs/AMPLIFY-INTEGRATION.md` |
| `APOLLO_API_KEY` | Optional | A fallback for finding decision makers, and for reading a LinkedIn profile, while Amplify is not connected |
| `AMPLIFY_WEBHOOK_SECRET` | When connected | Checks that replies, opens and bounces posted to `/api/amplify-hook` really come from Amplify |
| `BUILTWITH_API_KEY` | Optional | Which website platforms each brand runs on (Shopify, Salesforce Commerce Cloud and so on). Without it, the portal reads the brand's home page and spots the common ones itself |
| `BUILTWITH_URL` | No | Only if BuiltWith gives you a different API address. Defaults to the v21 API |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` | For WhatsApp | WhatsApp alerts and digests, sent through Twilio |
| `TWILIO_WHATSAPP_FROM` | For WhatsApp | Your approved WhatsApp sender, for example `whatsapp:+447700900123` |
| `TWILIO_WHATSAPP_TEMPLATE_SID` | For WhatsApp | An approved message template, so alerts can start a conversation outside WhatsApp's 24 hour window |
| `AUTH_MODE` | No | Leave unset. `secure` is the default. `open` lets anyone in and is only for local testing |

Data (people, agencies, profiles, workspaces, shared campaigns, notifications, insights and their images, pitch intelligence, trackable links and clicks) is kept in Netlify Blobs on the same site. Nothing else needs setting up.

`ANTHROPIC_API_KEY` also powers Plato's growth plan: with it, Plato reads the agency's website and library and writes the plan. Without it, Plato still reads the website and builds the plan from the portal's own rules.

## Alerts and the email digest

Each person sets their own alerts in **Settings, Alerts**: instant email and WhatsApp alerts when a brand warms up, and a regular digest at the frequency, day and hour they choose (daily, weekly, fortnightly or monthly). A scheduled function (`digest-cron`) runs every hour and sends any digest that is due, covering everything since the last one: who is warming up, who to lean into, new prospects, replies, meetings and pipeline. Email needs `RESEND_API_KEY` and `MAIL_FROM`. WhatsApp needs the Twilio settings above. Scheduled functions only run on the live site, not in a deploy preview.

## After the first deploy

1. Go to `/portal`, sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
2. Open the avatar menu, then **Manage access**.
3. Add your first agency with **Add someone directly**, or wait for a request to come in.
4. Next to each agency in **Manage access** there are three switches:
   - **Amplify switched on**: the premium outreach layer.
   - **Can launch**: everything up to launch is free to build. Tick this once you have agreed terms, and their launch button works. When someone presses launch without it, you get an email and an alert.
   - **Pitch intelligence**: the licensed data layer on their prospect feed.
5. To load pitch intelligence, scroll to **Pitch intelligence data** at the bottom of Manage access, upload the export (CSV or Excel) and tick **Switched on**. The data is stored on the server and is never in the portal page. Untick it, or remove the data, and it disappears for everyone straight away.
6. To set the price and the opening offer shown at launch, fill in `PRICING` at the top of `paywall.js` in the portal source (or search for `const PRICING=` in `site/portal/app/index.html`).

## What each person gets

- **Their own workspace.** Their brands, campaigns, messages and progress, saved to their account so it follows them between devices.
- **A shared agency profile.** Everyone at the same agency shares one profile: who they are, why clients choose them and their assets. Who they want to win lives in each campaign's prospecting preferences. It feeds the brands suggested, the gifts and every drafted message.
- **Shared campaigns.** Add teammates to a campaign and choose who reaches out to which brand. They are told in the portal and by email, and the campaign appears in their own Launch.
- **The team view.** Everyone's outreach in one picture: totals, each person's activity, the journey map person by person, who is reaching out to who, and the team's comms as they happen. One click downloads a performance snapshot PDF with the next five moves.

## A quick test before you share it

1. Open `/portal/app` in a private window. You should land on the sign in page.
2. Request access as a test person. You should get the email.
3. Approve them, open the set-your-password link, and sign in as them.
4. Sign out. `/portal/app` should send you back to sign in.
