# Slack integration plan

Goal: give Plannio the same "connect a channel, get automatic updates" experience for
Slack that it already has for Discord — same events (created / vote / locked /
reminder / completed), same manual "Send reminder now" action, same per-poll
opt-in. A poll can have a Discord channel, a Slack channel, both, or neither.

Slack has a near 1:1 equivalent of Discord's `webhook.incoming` OAuth flow: the
**`incoming-webhook`** OAuth scope. The user picks a channel during Slack's own
authorization screen, and the token exchange hands back a ready-to-post webhook
URL — no bot install, no extra Slack app permissions needed.

## 1. Slack app setup (manual, one-time, done by you)

1. Go to https://api.slack.com/apps → **Create New App** → "From scratch".
2. Name it "Plannio", pick your development workspace.
3. Under **OAuth & Permissions**:
   - Add a **Redirect URL**: `http://localhost:5000/api/integrations/slack/callback`
     (and the production URL once deployed, e.g.
     `https://<your-app>.herokuapp.com/api/integrations/slack/callback`).
   - Under "Scopes" → **Bot Token Scopes** is not needed. Instead, under
     "OAuth Tokens" enable **`incoming-webhook`** as a user-requested scope
     (Slack calls this "Add features" → *Incoming Webhooks* → toggle **Activate
     Incoming Webhooks** on). This makes `incoming-webhook` available as an
     OAuth scope for the `oauth.v2.access` flow.
4. Under **Basic Information**, copy:
   - **Client ID**
   - **Client Secret**
5. Add three new environment variables (mirroring the Discord ones already in
   `.env`):

   ```
   SLACK_CLIENT_ID=...
   SLACK_CLIENT_SECRET=...
   SLACK_WEBHOOK_REDIRECT_URI=http://localhost:5000/api/integrations/slack/callback
   ```

   No separate "login" redirect is needed — Slack sign-in as a login method is
   out of scope for v1 (see "Not doing" below).

## 2. Database migration

New file `server/db/migrations/014_poll_slack.sql`, mirroring
`006_poll_discord.sql`:

```sql
ALTER TABLE polls ADD COLUMN IF NOT EXISTS slack_webhook_url TEXT;
ALTER TABLE polls ADD COLUMN IF NOT EXISTS slack_channel_name TEXT;
ALTER TABLE polls ADD COLUMN IF NOT EXISTS slack_team_id TEXT;
ALTER TABLE polls ADD COLUMN IF NOT EXISTS slack_events TEXT[] NOT NULL DEFAULT '{}';
```

`poll_reminders` needs no changes — reminders are just timestamps, provider
agnostic.

## 3. `server/integrations/slack.js` (mirrors `discord.js`)

- `getWebhookConfig()` — reads `SLACK_CLIENT_ID` / `SLACK_CLIENT_SECRET` /
  `SLACK_WEBHOOK_REDIRECT_URI`, returns `null` if unset (same "not configured"
  pattern as Discord).
- `getWebhookAuthUrl(state)` — builds
  `https://slack.com/oauth/v2/authorize?client_id=...&scope=incoming-webhook&redirect_uri=...&state=...`.
- `exchangeWebhookCode(code)` — `POST https://slack.com/api/oauth.v2.access`
  with `client_id`, `client_secret`, `code`, `redirect_uri`. Response shape:

  ```json
  {
    "ok": true,
    "team": { "id": "T0123", "name": "Acme" },
    "incoming_webhook": {
      "url": "https://hooks.slack.com/services/...",
      "channel": "#launches",
      "channel_id": "C0123"
    }
  }
  ```

- `sendSlackMessage(webhookUrl, payload)` — `POST` the webhook URL with a
  Block-Kit body, same fire-and-forget + logged-on-failure pattern as
  `sendDiscordMessage`.
- `buildBlocks(poll, event, data)` — one function per event, translating the
  existing Discord embeds 1:1 into Slack Block Kit:
  - `header` block with the emoji + title (`📅 New poll: …`, `⏰ Reminder: …`, …)
  - `section` block (`mrkdwn`) with the description / progress text
  - `section` block listing proposed times / who can attend
  - `actions` block with a **"Vote here" / "View poll"** button linking to the
    share URL
  - Color-coding maps to Slack `attachments[0].color` (hex) since Block Kit
    itself has no side-bar color — keep the same brand/green/amber colors used
    today.
- Exports mirror `discord.js`: `getWebhookConfig`, `getWebhookAuthUrl`,
  `exchangeWebhookCode`, `sendSlackMessage`, `notifySlackEvent`.

## 4. Routes: `server/routes/integrations.js`

Add a parallel set of routes, reusing the existing popup + `postMessage`
pattern:

- `GET /api/integrations/slack/status` — `{ configured, linked, connected, channelName }`.
- `GET /api/integrations/slack/connect` — stores `state` in
  `req.session.slackWebhookState`, redirects to Slack's authorize URL.
- `GET /api/integrations/slack/callback` — exchanges the code, stores the
  result in `req.session.pendingSlackWebhook`, responds with the same
  `popupResponse()` HTML that `postMessage`s `{ type: "slack-webhook", ok, channelName }`
  back to the opener window and closes itself.
- `POST /api/integrations/slack/disconnect` — clears
  `req.session.pendingSlackWebhook`.

No identity-linking step is needed for Slack (that part of the Discord flow
is specifically for enabling "log in with Discord", which is out of scope
here).

## 5. Shared notify dispatcher (the one structural change)

Today every call site (`routes/polls.js` create/lock/remind,
`routes/public.js` vote/completed, `polls/reminders.js` scheduler) imports
`notifyPollEvent` from `integrations/discord.js` directly. To avoid
duplicating every call site for Slack, introduce:

`server/integrations/notify.js`

```js
const discord = require("./discord");
const slack = require("./slack");

async function notifyPollEvent(poll, event, data = {}, options = {}) {
  await Promise.all([
    poll.discord_webhook_url ? discord.notifyPollEvent(poll, event, data, options) : null,
    poll.slack_webhook_url ? slack.notifySlackEvent(poll, event, data, options) : null,
  ]);
}

module.exports = { notifyPollEvent };
```

Then swap the import in `routes/polls.js`, `routes/public.js`, and
`polls/reminders.js` from `require("../integrations/discord")` to
`require("../integrations/notify")`. Every event (created/vote/locked/
reminder/completed) and the manual "Send reminder now" button then fan out to
both providers automatically, with zero per-call-site duplication.

`polls/model.js` (`getPollForNotify`, `getPollByIdForUser`, `createPoll`,
`normalizeDiscord`) needs a parallel `normalizeSlack` + the new columns
selected/inserted alongside the existing Discord ones.

## 6. Client changes

- Generalize `DiscordUpdates.jsx` → `ChannelUpdates.jsx`: same card, but two
  independent "Connect Discord channel" / "Connect Slack channel" buttons/
  status rows, sharing the single set of event checkboxes, expected-responses
  field, and reminder-date list (those are provider-agnostic).
- `lib/api.js` needs no change (poll payload already carries a generic
  `discord: {...}` shape); extend `CreatePollPage.jsx`'s submit payload with a
  sibling `slack: {...}` object built the same way.
- `MyPollsPage` / `PollDetailPage` "connected" badges: show both providers'
  status where relevant (e.g. the reminder button already just checks "is any
  provider connected").

## 7. Rollout order

1. Migration (`014_poll_slack.sql`).
2. `integrations/slack.js` + routes — testable standalone via `/status`
   returning `configured: false` until env vars are set.
3. `notify.js` dispatcher + swap imports (safe no-op until Slack env vars
   exist, since `poll.slack_webhook_url` will always be null).
4. `model.js` changes to persist Slack config.
5. Client `ChannelUpdates.jsx` + wiring into `CreatePollPage.jsx`.
6. You create the Slack app, set the three env vars, restart, click connect
   on a test poll.

## Not doing (v1)

- **"Log in with Slack"** as an auth method (parity with Discord login) — a
  separate OIDC flow (`openid`, `profile`, `email` scopes), not needed for
  webhook notifications. Can be added later the same way Discord login was.
- **Slack bot / slash commands** (e.g. voting directly from Slack) — would
  need a bot token + `chat:write` scope + Events API, a materially bigger
  scope than "post updates to a channel".
- Editing an existing poll's connected channels after creation — matches
  today's Discord behavior (connect happens once, at creation time).
