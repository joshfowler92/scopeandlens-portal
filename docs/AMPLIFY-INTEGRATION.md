# Amplify: integration guide for the outreach partner

Amplify is the premium layer of Plato, by Scope & Lens. Inside the portal it is presented as a Scope & Lens product. Your platform does the work behind it: finding organisations, finding and enriching decision makers, sending approved messages and reporting what happened.

The portal never calls your platform from the browser. Every call goes through one server function (`netlify/functions/amplify.mjs`), so your keys stay private.

## Connecting

Scope & Lens sets two environment variables on the site:

- `AMPLIFY_API_URL`: your base URL, for example `https://api.example.com/v1/scope-lens`
- `AMPLIFY_API_KEY`: a key you issue for Scope & Lens

Optionally, a third one for pushing events to the portal (see Webhook below):

- `AMPLIFY_WEBHOOK_SECRET`: a shared secret both sides keep

Amplify is then switched on agency by agency from the portal's **Manage access** page.

## Open and Premium

Finding brands and the people inside them is open to every agency once Amplify is connected. Sending, autopilot and tracking are Premium, switched on per agency.

| Action | Who can use it |
| --- | --- |
| `companies`, `people`, `profile` | Every signed-in agency |
| `enrich`, `send`, `campaign`, `pause`, `resume`, `approve`, `status`, `events` | Premium agencies only (and Scope & Lens admins) |

A non-Premium call to a Premium action is stopped by the portal with a 402 and never reaches you. The `account` object on every call also carries `premium: true|false`.

## The contract

Every call is a `POST` to `{AMPLIFY_API_URL}/{action}` with:

```
Authorization: Bearer {AMPLIFY_API_KEY}
Content-Type: application/json
```

Every body includes an `account` object, so you know which agency and which person it is for:

```json
{ "account": { "orgId": "brightwater-studio-WnNE", "orgName": "Brightwater Studio", "user": "amy@brightwater.studio", "premium": true } }
```

Reply with JSON. On an error, reply with a non-2xx status and `{ "error": "A human readable reason" }`. The portal shows that reason to the user.

### `companies`: find more organisations

Request:

```json
{ "sectors": ["fmcg","retail"], "size": "M", "region": "north", "problems": ["standout"], "services": ["brand","creative"], "exclude": ["Greggs","Tesco"], "limit": 25 }
```

- `sectors` use the portal's keys: retail, fmcg, finance, travel, health, tech, auto, charity, b2b, media
- `size`: S (challenger), M (mid-size), L (household name) or auto
- `region`: lse, swales, mide, north, scotni or any (all UK)
- `exclude`: names the agency already has, so you do not return them

Response:

```json
{ "companies": [ { "name": "Harbourline Foods", "domain": "harbourline.co.uk", "industry": "Food and drink", "city": "Leeds", "size": "Mid-size", "signal": "Hired a new marketing director in October.", "signalUrl": "https://..." } ] }
```

`signal` is optional. If you give one, it should be a real, recent event with a link in `signalUrl`.

### `people`: find decision makers at one organisation

Request:

```json
{ "company": "Innocent Drinks", "domain": "innocentdrinks.co.uk", "titles": ["Chief Marketing Officer","Marketing Director","Head of Brand"], "roles": ["cmo","brand"], "limit": 10 }
```

Response:

```json
{ "people": [ { "name": "Rina Patel", "title": "Marketing Director", "linkedin": "https://www.linkedin.com/in/...", "email": "rina@example.com", "verified": true } ] }
```

### `enrich`: fill in contact details for people the agency already has

Request: `{ "people": [ { "name": "Zoe Harris", "company": "Greggs", "linkedin": "" } ] }`

Response: the same list with `email`, `linkedin`, `title` and `verified` filled in where you can.

### `send`: send one message the user has approved

Request:

```json
{ "id": "k3j2h1", "channel": "linkedin", "to": { "name": "Zoe Harris", "company": "Greggs", "linkedin": "https://...", "email": "" }, "text": "Hi Zoe, ...", "subject": "" }
```

- `channel` is `linkedin` or `email`
- `id` is the portal's id for the message. Use it in `status` and `events`
- Send from the sending account linked to `account.user`, at a human pace, in working hours

Response: `{ "ok": true, "ref": "your-message-id" }`

### `profile`: read one LinkedIn profile

Used by the LinkedIn profile scan in How to reach, so the portal can score the agency person's own profile against the people they are targeting. This call comes from the server, not through `/api/amplify`.

Request: `{ "linkedin": "https://www.linkedin.com/in/amy-lee" }`

Response: `{ "profile": { "name": "", "headline": "", "about": "", "experience": ["Founder at Brightwater Studio"], "photo": true, "featured": 2, "activity": 6 } }`

`featured` is how many items are pinned in Featured. `activity` is days since their last post. Leave out anything you do not have.

### `campaign`: hand over a whole campaign at launch

Sent once, when the agency launches a campaign with autopilot on. It carries everything needed to run it.

```json
{ "campaign": { "id": "c8a1", "name": "Standing out in food", "startDate": "2026-11-16", "weeks": 8, "pace": "steady", "problem": "standout", "gift": "Distinctive Asset Audit", "giftUrl": "https://..." },
  "sender": { "name": "Amy Lee", "agency": "Brightwater Studio", "website": "brightwater.studio" },
  "approval": "each",
  "ads": true,
  "steps": [ { "id": "s1", "week": 1, "day": 0, "channel": "linkedin", "title": "Connect, no note", "type": "connect", "template": "" },
             { "id": "s2", "week": 2, "day": 7, "channel": "email", "title": "Share the audit", "type": "message", "template": "Hi {first}, ..." } ],
  "contacts": [ { "id": "p1", "name": "Zoe Harris", "title": "Marketing Director", "company": "Greggs", "domain": "greggs.co.uk", "linkedin": "", "email": "", "brandId": "a1" } ] }
```

- `approval`: `each` (approve every send) or `day` (approve each day's batch). Nothing goes out unapproved either way
- `type`: `connect` (no note), `after_accept`, `warm_only` (only once they have engaged), `message` or `post` (a content post for the sender's own feed)
- `channel`: `linkedin`, `email`, `social`, `event`, `mail` and so on. Send what you can, and report the rest as tasks for the user

Response: `{ "campaignId": "your-id", "status": "queued", "queued": 14 }`

### `pause` and `resume`

Request: `{ "campaignId": "your-id" }`. Response: `{ "ok": true }`. Nothing more goes out while paused.

### `approve`: approve a batch

Reserved for day-by-day approval. Request: `{ "campaignId": "your-id", "ids": ["s2:p1"] }`. Response: `{ "ok": true }`. The portal does not call this yet.

### `status`: where approved messages are

Request: `{ "ids": ["k3j2h1"] }`. Response: `{ "items": [ { "id": "k3j2h1", "status": "queued" } ] }` with status `queued`, `sent` or `failed`.

### `events`: what happened since a date

Request: `{ "since": "2026-11-01" }`

Response:

```json
{ "events": [ { "type": "reply", "company": "Greggs", "person": "Zoe Harris", "at": "2026-11-04T10:12:00Z", "id": "k3j2h1" } ] }
```

`type` is one of `accept`, `open`, `click`, `reply`, `li_reply`, `meeting`. These feed the portal's Signals page and intent scores.

## Webhook: push events as they happen

Instead of waiting for the portal to ask for `events`, you can push them as they happen:

```
POST https://scopeandlens.com/api/amplify-hook
Content-Type: application/json
X-Amplify-Signature: hex(HMAC-SHA256(raw request body, AMPLIFY_WEBHOOK_SECRET))
```

```json
{ "events": [ { "orgId": "brightwater-studio-WnNE", "user": "amy@brightwater.studio", "campaignId": "c8a1", "type": "reply", "company": "Greggs", "person": "Zoe Harris", "at": "2026-11-04T10:12:00Z" } ] }
```

`orgId` is required. Up to 500 events per call. The portal stores them and hands them over the next time that person's portal asks for `events`. A bad signature gets a 401.

## Testing

Point `AMPLIFY_API_URL` at a staging endpoint, switch Amplify on for a test agency in **Manage access**, then in the portal:

1. Who to target: **Find prospects now** calls `companies`
2. Decision makers: **Find decision makers** calls `people`
3. Launch, Amplify it: approving a message calls `send`
4. Launch, Amplify it: **Pull in the latest replies** calls `events`
5. Launch: launching with autopilot on calls `campaign`, and **Pause** and **Resume** call `pause` and `resume`
6. How to reach: **Scan my profile** calls `profile`
