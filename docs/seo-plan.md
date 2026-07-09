# Plannio SEO & GEO plan

Goal: rank for searches like "discord scheduling poll", "slack meeting poll",
"group date poll free", "schedule event in Discord" — both in classic search
engines (SEO) and in AI answers from ChatGPT, Perplexity, Claude, and Google
AI Overviews (GEO) — and drive organic signups.

The user has **no existing accounts** (no Google Search Console, no analytics,
nothing). Appendix A at the bottom is a from-scratch setup guide to hand to
the user; the executor model cannot do those steps.

This document is written to be executed step by step by an AI model. Each task
has: exact file paths, code to write, and acceptance criteria. Do the phases in
order — Phase 1 is a prerequisite for everything else.

## Implementation progress (last updated: July 2026)

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1 — Technical SEO | **Done** | Lighthouse SEO 100/100; mobile perf 73 — re-measure after next deploy |
| Phase 2 — On-page landing | **Done** | Guides strip, full a11y audit, breadcrumbs on content pages |
| Phase 3 — Content pages | **Done** | All 8 pages live in codebase |
| Phase 4 — GEO | **Mostly done** | prerender wired to heroku-postbuild; verify after deploy |
| Phase 5 — Off-page | **Not started** | Requires user (Appendix A + directory listings) |
| Phase 6 — Measurement | **Prepared in code** | `Analytics.jsx` wired; waiting on user script URL + Search Console |
| Appendix A | **Not started** | User has not created Google/Bing/analytics accounts yet |

**Legend:** `- [x]` = implemented in repo · `- [ ]` = not done or not verified

---

## Ground rules for the executor

- The canonical production URL is `https://plannio.app`. If the real domain
  differs, ask the user once, then use that value everywhere this document says
  `plannio.app`.
- All user-facing copy is in **English** (the codebase UI is English; only the
  README is Danish). Write all new page content in English.
- Never touch files under `server/auth/`, `server/integrations/`, or
  `server/db/`.
- The frontend is React 19 + Vite + react-router 7 + Tailwind 4, in `client/`.
  React 19 natively hoists `<title>` and `<meta>` tags rendered inside any
  component into `<head>` — **do not install react-helmet or any other
  metadata library.**
- After each phase, run `npm run build` from the repo root and confirm it
  succeeds before moving on.
- Reuse existing UI components (`client/src/components/ui/`, `Navbar`,
  `Footer`, `Reveal`, `SectionHeading`) and the existing Tailwind design tokens
  (`text-foreground`, `bg-card`, `border-border`, etc.) so new pages look like
  the rest of the site.

## Current state (updated after implementation, July 2026)

- [x] `client/public/` exists with `robots.txt`, `sitemap.xml`, `llms.txt`, `og-image.png`
- [x] All title/meta/OG/Twitter tags rendered per-route by `PageMeta.jsx` (removed
      static duplicates from `client/index.html` — React 19 hoists PageMeta tags)
- [x] `PageMeta.jsx` on all routes; `JsonLd` on landing + content pages
- [x] Footer links fixed; **Guides** + **Use cases** groups link to all content pages
- [x] `server/index.js`: www/HTTPS redirects + prerendered HTML fallback
      (`express.static` with `redirect: false` so content URLs serve without
      a trailing-slash 301)
- [x] Self-hosted Inter font; app pages lazy-loaded in `App.jsx`; vendor chunks
      split in `vite.config.js` (react / motion)
- [x] Content routes: 2 integration guides, 3 use cases, 3 how-to guides (see Phase 3)
- [x] Prerender verified in production (Heroku build log + live HTML checked July 2026)
- [x] Node pinned to `24.x` in root `package.json` (Heroku resolved 24.18.0)
- [ ] Google Search Console / Bing / analytics not set up (Appendix A)
- [x] Lighthouse scores recorded July 9, 2026 (see 1.8): SEO 100/100,
      performance 73 mobile / 96 desktop

---

## Phase 1 — Technical SEO foundation

### 1.1 Create `client/public/` with robots.txt — [x]

Vite copies everything in `client/public/` to the root of `client/dist/`, and
Express already serves `client/dist` statically in production, so no server
changes are needed for static files.

Create `client/public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /polls
Disallow: /login

Sitemap: https://plannio.app/sitemap.xml
```

Rationale: `/polls`, `/polls/new`, `/polls/:id` are the creator's private
dashboard; `/login` has no search value. Public voting pages `/p/:slug` stay
crawlable (they can earn links when people share them) but are excluded from
the sitemap because they are user-generated and ephemeral.

Acceptance: after `npm run build`, `client/dist/robots.txt` exists with this
content.

### 1.2 Base metadata in `client/index.html` — [x]

In the `<head>` of `client/index.html`, directly after the `<title>` line,
add:

```html
    <meta
      name="description"
      content="Free date polls for groups. Pick dates in a calendar, share one link, and get updates in Discord and Slack when people respond. No account needed to vote."
    />
    <link rel="canonical" href="https://plannio.app/" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Plannio" />
    <meta property="og:title" content="Plannio – Find the time everyone says yes to" />
    <meta
      property="og:description"
      content="Free date polls for groups. Share one link, vote in seconds, and get updates in Discord and Slack."
    />
    <meta property="og:url" content="https://plannio.app/" />
    <meta property="og:image" content="https://plannio.app/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Plannio – Find the time everyone says yes to" />
    <meta
      name="twitter:description"
      content="Free date polls for groups. Share one link, vote in seconds, and get updates in Discord and Slack."
    />
    <meta name="twitter:image" content="https://plannio.app/og-image.png" />
    <meta name="theme-color" content="#ffffff" />
```

Also generate an OG image `client/public/og-image.png`, 1200×630: Plannio
wordmark + tagline "Find the time everyone says yes to" on a light background
with the brand gradient. If image generation is unavailable, create a simple
one and flag it to the user for replacement.

Acceptance: view-source of the built `dist/index.html` contains description,
canonical, OG and twitter tags; `dist/og-image.png` exists.

### 1.3 Per-route metadata component — [x]

Create `client/src/components/PageMeta.jsx`:

```jsx
const SITE_URL = "https://plannio.app";

export function PageMeta({ title, description, path, noindex = false }) {
  const fullTitle = title ? `${title} | Plannio` : "Plannio – Find the time everyone says yes to";
  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {path != null && <link rel="canonical" href={`${SITE_URL}${path}`} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {path != null && <meta property="og:url" content={`${SITE_URL}${path}`} />}
    </>
  );
}
```

React 19 hoists these into `<head>` automatically and de-duplicates against
the static tags in `index.html` at runtime.

Then add to each page component (top of the returned JSX):

| File | Props |
|---|---|
| `client/src/components/landing/LandingPage.jsx` | `title={null}` `description` = the one from 1.2, `path="/"` |
| `client/src/pages/LoginPage.jsx` | `title="Sign in"`, `noindex` |
| `client/src/pages/MyPollsPage.jsx` | `title="My polls"`, `noindex` |
| `client/src/pages/CreatePollPage.jsx` | `title="Create a poll"`, `noindex` |
| `client/src/pages/PollDetailPage.jsx` | `title={poll?.title ?? "Poll"}`, `noindex` |
| `client/src/pages/PollVotePage.jsx` | `title={poll ? \`Vote: ${poll.title}\` : "Vote"}`, `description="Pick the dates that work for you."`, `path={\`/p/${slug}\`}` |

Acceptance: navigating between routes in dev updates the document title; the
private pages render a `noindex` meta tag (check via browser dev tools).

### 1.4 Structured data (JSON-LD) on the landing page — [x]

Add to `LandingPage.jsx` (inside the component, React 19 hoists `<script>`
tags with other head elements when rendered like this — if hoisting of script
tags proves unreliable, inject via a `useEffect` that appends the script to
`document.head` once):

Two JSON-LD blocks:

1. `SoftwareApplication`:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Plannio",
  "applicationCategory": "SchedulingApplication",
  "operatingSystem": "Web",
  "url": "https://plannio.app",
  "description": "Free date polls for groups with Discord and Slack channel updates.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
```

2. `FAQPage` — build the `mainEntity` array from the exact questions and
   answers in `client/src/components/landing/FAQ.jsx` (import the `faqs` array
   from that file rather than duplicating strings; export it from `FAQ.jsx`
   first).

Acceptance: paste the rendered landing page HTML into
https://validator.schema.org — both blocks parse without errors.

### 1.5 Sitemap — [x]

Create `client/public/sitemap.xml` listing the landing page and (as they are
built in Phase 3) each content page:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://plannio.app/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
</urlset>
```

Every time a Phase-3 page is added, append its `<url>` entry here in the same
commit. Keep it a static file — do not build a dynamic sitemap route.

Acceptance: `https://plannio.app/sitemap.xml` returns valid XML; every URL in
it returns HTTP 200.

### 1.6 Fix dead footer links — [x]

In `client/src/components/landing/Footer.jsx` the `groups` arrays render
`href="#"`. Change the data to `{ label, href }` objects and point them at
real targets:

- Product: Features → `/#features`, How it works → `/#how`, Pricing →
  `/#pricing`, FAQ → `/#faq`
- Account: Log in → `/login`, Create poll → `/polls/new`
- Add a third group "Guides" once Phase 3 content pages exist, linking to
  each use-case and how-to page. **Also added "Use cases" group (4 columns).**

Use react-router `<Link>` for internal routes and plain `<a>` for hash links.
Remove the three placeholder social icon links (Twitter/Github/Linkedin all
point to `#`) unless the user provides real profile URLs. **[x] Social icons removed.**

Acceptance: no `href="#"` remains in `Footer.jsx`.

### 1.7 Canonical host redirect — [x]

In `server/index.js`, inside the `if (isProduction)` block **before**
`express.static`, add a redirect middleware so only one hostname is indexed:

```js
app.use((req, res, next) => {
  const host = req.headers.host;
  if (host && host.startsWith("www.")) {
    return res.redirect(301, `https://${host.slice(4)}${req.originalUrl}`);
  }
  if (req.headers["x-forwarded-proto"] === "http") {
    return res.redirect(301, `https://${host}${req.originalUrl}`);
  }
  next();
});
```

Acceptance: `curl -I http://plannio.app/` and `https://www.plannio.app/` both
301 to `https://plannio.app/` in production. (In local dev nothing changes.)

### 1.8 Performance pass (Core Web Vitals) — [x] measured

1. Self-host the Inter font … **[x]**
2. Code-split the app pages … **[x]** (+ vendor chunks react/motion in vite.config.js)
3. Run Lighthouse … **[x] Run via pagespeed.web.dev July 9, 2026 against the
   Heroku URL (before vendor-chunk split was deployed):**

   | Category | Mobile | Desktop |
   |----------|--------|---------|
   | Performance | 73 | 96 |
   | Accessibility | 96 | 96 |
   | Best Practices | 96 | 96 |
   | SEO | **100** | **100** |

   Acceptance met: SEO score is 100 on both. Re-measure mobile performance
   after the next deploy (vendor-chunk split + duplicate-meta fix included).
4. **`scripts/optimize-og.mjs`** compresses `og-image.png` on each `npm run build`
   (requires Node 20+; skips gracefully on older Node). **[x]** (1325 KB → 373 KB
   confirmed in Heroku build log.)

Acceptance: build succeeds, landing page renders identically, Lighthouse SEO
score is 100. **Met.**

---

## Phase 2 — On-page optimization of the landing page — [ ] partial

### 2.1 Heading audit — [x]

Exactly one `<h1>` per page (the Hero heading). Verify sections use `<h2>` for
section titles and `<h3>` below that — `SectionHeading` in `Reveal.jsx`
controls this; check what tag it renders and fix if it is not `<h2>`.
**Verified: `SectionHeading` renders `<h2>`.**

### 2.2 Keyword alignment — [x]

Primary keyword for `/`: **"date poll"** with modifiers "free", "group",
"Discord", "Slack". Adjust copy only where it reads naturally:

- Hero `<h1>` stays as is (brand voice), but ensure the paragraph under it
  contains "date poll" and "Discord or Slack" (it already does — verify).
- The `<title>` and meta description from Phase 1 already carry the keyword.
- Do NOT keyword-stuff. Never change copy in Testimonials.

### 2.3 Accessible names and alt text — [x] done

All icon-only links/buttons need `aria-label`s; any future images need
descriptive `alt` text mentioning what the screenshot shows ("Plannio date
poll results with vote counts"), not keywords for their own sake.
**Navbar mobile menu, logout, Showcase tabs (tablist/tab/tabpanel),
decorative mockups (PollMockup, BrowserBar), and FeatureCard icons audited.**

---

## Phase 3 — Content pages (the main ranking lever) — [x] done

**Do not write competitor comparison pages** (no `/vs/doodle`, no "Plannio vs
X" content). Focus entirely on Plannio's own product, integrations, and use
cases. This keeps the site on-brand and avoids maintaining competitor facts.

A SPA route is fine for Google (it renders JS), but every content page must be
a real route with unique metadata via `PageMeta`, listed in `sitemap.xml`, and
linked from the footer "Guides" group so crawlers discover it.

### 3.0 Shared template first — [x]

Create `client/src/pages/content/ContentPage.jsx`: a layout component with
`<Navbar showNavLinks={false} />`, a prose-styled `<article>` (max-w-3xl,
same typography classes used on the landing page), a `FinalCTA`-style signup
block at the bottom, and `<Footer />`. All pages below use it. Register each
page in `App.jsx` and the sitemap.

### 3.1 Integration guides (build these first) — [x]

These match Plannio's differentiator and have low competition. 800–1,200
words each. Structure:

1. `<h1>` stating the integration clearly (e.g. "Date polls with Discord
   channel updates").
2. A 2–3 sentence **direct answer** to the target query at the top.
3. Numbered step-by-step: create poll → connect channel → share link → what
   gets posted automatically.
4. Feature detail: no bot invite, webhook events (created / vote / locked /
   reminders), "Send reminder now", expected responses.
5. FAQ section with 3–4 questions, plus matching `FAQPage` JSON-LD.
6. CTA block.

| Path | Target query | Title tag (≤60 chars) |
|---|---|---|
| `/discord-scheduling` | discord scheduling poll / discord date poll | "Date polls with Discord channel updates" | [x] |
| `/slack-scheduling` | slack meeting poll / slack scheduling tool | "Date polls with Slack channel updates" | [x] |

### 3.2 Use-case pages — [x]

Same template, 700–1,000 words each, focused on one scenario with a short
step-by-step (numbered list, can reuse HowItWorks content) and a scenario-
specific FAQ:

| Path | Target query | Title tag |
|---|---|---|
| `/use-cases/weekend-trip` | plan a weekend trip with friends date poll | "Plan a weekend trip everyone can join" | [x] |
| `/use-cases/team-meetings` | find meeting time team poll free | "Find a meeting time your whole team can make" | [x] |
| `/use-cases/game-night` | schedule game night discord | "Schedule game night in your Discord server" | [x] |

### 3.3 How-to guides — [x]

Problem/solution articles that answer common questions without mentioning
competitors. 600–900 words each:

| Path | Target query | Title tag |
|---|---|---|
| `/guides/discord-poll-without-bot` | discord poll without bot / schedule discord without bot | "Schedule in Discord without adding a bot" | [x] |
| `/guides/stop-chasing-replies` | find time everyone can meet / group scheduling | "Stop chasing replies when planning group dates" | [x] |
| `/guides/date-ranges` | multi-day date poll / weekend poll | "How to propose multiple weekends in one poll" | [x] |

Structure for how-to pages:

1. `<h1>` as a question or clear outcome.
2. Direct answer paragraph (GEO-friendly).
3. Numbered steps using Plannio specifically.
4. Short FAQ (2–3 items) + JSON-LD.
5. CTA block.

### 3.4 Publishing cadence and internal linking rules — [x]

- Ship pages one per commit, in this order: integration guides → use cases →
  how-to guides. 2–3 pages per week is plenty; quality over volume.
- Every new page links to: the landing page (via CTA), and at least two
  sibling content pages. The landing page footer links to every content page.
- Each page gets a unique meta description (≤155 chars) containing its target
  query.
- Do not publish two pages targeting the same query.

---

## Phase 4 — GEO (Generative Engine Optimization) — [ ] mostly done

GEO = getting Plannio recommended and cited when people ask ChatGPT,
Perplexity, Claude, Copilot, or Google AI Overviews things like "best free
date poll tool" or "how do I schedule an event in Discord". Most GEO work
builds on the SEO phases (crawlable content, structured data, directory
presence), but the tasks below are GEO-specific.

### 4.1 Prerender content pages to static HTML (critical) — [x] wired, [ ] verify prod

**Why:** most AI crawlers (GPTBot, ClaudeBot, PerplexityBot) do not execute
JavaScript. Prerendering saves static HTML so they see full page content.

1. `puppeteer` (local) + `puppeteer-core` + `@sparticuz/chromium` (Linux/Heroku). **[x]**
2. `scripts/prerender.mjs` — all 9 public routes. **[x]**
3. `heroku-postbuild`: `npm run build && npm run prerender`. **[x]**
   Set `SKIP_PRERENDER=1` to skip. Build already runs `optimize-og` first.
4. Server catch-all serves prerendered HTML. **[x]**
5. **Verify after deploy:** `curl https://plannio.app/discord-scheduling | grep "<h1"`

### 4.2 Welcome AI crawlers in robots.txt — [x]

Extend `client/public/robots.txt` (from 1.1) — the default `Allow: /` already
covers them, but be explicit so a future "block bots" change doesn't
accidentally kill GEO, and keep the private-route disallows:

```
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /
```

### 4.3 llms.txt — [x]

Create `client/public/llms.txt` — a plain-markdown summary AI agents can
fetch. Content:

```
# Plannio
… (see `client/public/llms.txt` — lists all 8 content pages) …
```

Keep it updated whenever Phase-3 pages ship (same commit). **[x] All pages listed.**

### 4.4 Write content so models can quote it — [x]

Apply these rules to every Phase-3 page (add to the page checklist):

- Open each page with a 2–3 sentence **direct answer** to the target query,
  before any storytelling. AI answers lift these verbatim.
- Use one **definition-style sentence** naming the entity exactly:
  "Plannio is a free date-poll tool with built-in Discord and Slack channel
  updates." Reuse this sentence verbatim across pages, the llms.txt, and all
  directory listings — consistent phrasing is how models learn the entity.
- Prefer **tables and numbered steps** over prose walls; include concrete
  numbers ("free", "4 events posted automatically", "no bot invite").
- Add "Last updated: {Month Year}" visibly on integration and how-to pages —
  models favor dated, fresh sources.
- FAQ blocks with `FAQPage` JSON-LD on every page (required in 3.1–3.3)
  — question-formatted headings map directly to how people prompt chatbots.

### 4.5 Third-party corroboration (overlaps Phase 5) — [ ]

Models trust what multiple independent sources say. The Phase-5 checklist
items that matter most for GEO, in priority order: AlternativeTo listing
(as a scheduling/date-poll tool), Reddit answers (Perplexity and Google AI
Overviews cite Reddit constantly), Product Hunt, and the Slack App Directory.
Use the exact definition sentence from 4.4 in every listing.

### 4.6 Measure GEO — [ ]

- In analytics (Phase 6), segment referrers: `chatgpt.com`, `perplexity.ai`,
  `copilot.microsoft.com`, `gemini.google.com`.
- Monthly manual audit: ask ChatGPT, Perplexity, and Gemini "best free date
  poll tool with Discord integration", "how to schedule a meeting in Discord
  without a bot", "how to schedule game night in Discord". Log whether
  Plannio is mentioned/cited and which URL. Track the trend in a simple
  table in this repo (`docs/geo-audit-log.md`). **[x] Template created.**

---

## Phase 5 — Off-page (requires the user, list only) — [ ]

The executor model cannot do these; present this list to the user as a
checklist after Phase 3 starts:

1. [ ] Google Search Console and Bing Webmaster Tools — see Appendix A for the
   full from-scratch setup, since no accounts exist yet.
2. [ ] Directory listings (free, high-value backlinks): AlternativeTo (list as a
   date-poll / scheduling tool — do not frame as a competitor to others),
   Product Hunt launch, Slack App Directory, `awesome-` GitHub lists for
   Discord tools, ToolFinder, SaaSHub.
3. [ ] Community presence: answer relevant questions on r/discordapp, r/Slack,
   r/productivity — link only when genuinely on-topic.
4. [ ] Ask early users for reviews on Capterra/G2 once there is traffic.

---

## Phase 6 — Measurement — [ ] user action

1. [x] Analytics component wired: `client/src/components/Analytics.jsx` reads
   `VITE_ANALYTICS_SCRIPT` and optional `VITE_ANALYTICS_WEBSITE_ID` from
   `.env` (see `.env.example`). **[ ] User must create Plausible/Umami account
   and set env vars** — setup in Appendix A step 4.
2. [ ] Track in Search Console monthly: impressions/clicks per content page,
   average position for "discord scheduling poll", "slack date poll",
   "discord poll without bot".
3. [ ] GEO tracking per 4.6 (referrer segments + monthly audit log).
4. [ ] Success criteria (6 months): landing page indexed and ranking for brand,
   ≥5 content pages with impressions, ≥1 page in top 10 for a non-brand
   query, Plannio mentioned in at least one of the monthly AI-assistant
   audits.

## Execution order summary

1. [x] Phase 1 tasks 1.1–1.7; [ ] 1.8 Lighthouse (after deploy on Node 20)
2. [x] Phase 2 — done (a11y, breadcrumbs, schema on content pages)
3. [x] Phase 4.1–4.3 wired; [ ] verify prerender output in production
4. [x] Phase 3 — all content pages shipped
5. [ ] Hand Appendix A + Phase 5 checklist to the user — **pending user action**
6. [ ] Phase 6 after user completes Appendix A

---

## Appendix A — Account setup guide (for the user, from scratch) — [ ]

You currently have no Google/Bing/analytics accounts set up. Do these once;
each takes 5–15 minutes. The executor model cannot do them for you (they
require logging in as you), but it CAN add verification tags/files to the
codebase — so when a service asks you to "add a meta tag" or "upload a
file", paste the value into the chat and ask the model to add it.

### 1. Google Search Console (free — most important)

What it does: tells you which queries show your site, and lets you submit
the sitemap so Google indexes new pages fast.

1. Go to https://search.google.com/search-console and sign in with any
   Google account (create one at https://accounts.google.com if needed).
2. Click "Add property". Choose **URL prefix** and enter
   `https://plannio.app` (the Domain option requires DNS access — use it
   instead if you can edit DNS records where you bought the domain; it
   covers www/non-www automatically).
3. For URL-prefix verification, pick **HTML tag**. Google shows something
   like `<meta name="google-site-verification" content="ABC123..." />` —
   copy it, give it to the executor model, and have it added to
   `client/index.html`. Deploy, then click "Verify".
4. Once verified: left menu → "Sitemaps" → enter `sitemap.xml` → Submit.
5. Optional but useful: "URL inspection" → paste a new page's URL → "Request
   indexing" whenever you publish a content page.

### 2. Bing Webmaster Tools (free — also feeds DuckDuckGo, and Copilot/ChatGPT search uses Bing's index)

1. Go to https://www.bing.com/webmasters and sign in (Microsoft, Google, or
   Facebook login works).
2. Choose "Import from Google Search Console" — it copies the verified site
   and sitemap in one click. Done.

### 3. Domain & DNS sanity check

Wherever you bought your domain: make sure both `plannio.app` and
`www.plannio.app` point at the Heroku app (Heroku dashboard → Settings →
Domains shows the DNS targets). The code from task 1.7 then redirects www →
non-www so only one version gets indexed.

### 4. Analytics — Plausible (paid ~9 €/md) or Umami (free self-host/cloud free tier)

Recommendation: start with **Umami Cloud free tier** (free up to 100k
events/month) since the site is new:

1. Go to https://umami.is → Sign up (free) → "Add website" → enter
   `plannio.app`.
2. It shows a script tag like
   `<script defer src="https://cloud.umami.is/script.js" data-website-id="xxxx"></script>`
   — paste it to the executor model to add to `client/index.html`, deploy.
3. Dashboard at https://cloud.umami.is shows visitors, referrers (including
   chatgpt.com / perplexity.ai for GEO tracking), and top pages.

If you prefer Plausible instead: https://plausible.io → 30-day free trial →
same flow, script tag from Phase 6.

### 5. Accounts for the Phase 5 checklist (do when content pages exist)

- AlternativeTo: https://alternativeto.net → register → "Add application" →
  list Plannio under Scheduling / Productivity with tags like "date poll",
  "Discord", "Slack". Describe the product on its own merits — do not list
  it as an alternative to a named competitor unless the platform requires
  picking a category app.
- Product Hunt: https://www.producthunt.com → create maker account. Plan the
  launch for when integration guide pages + OG image are live.
- Slack App Directory: requires the Slack app to be publicly distributed —
  in https://api.slack.com/apps → your app → "Manage distribution". Do this
  only when you're comfortable with public installs.
- Reddit: use an existing personal account with some history; brand-new
  accounts that only post links get flagged as spam.

### Order

- [ ] 1–3 now (Search Console, Bing, DNS) — **recommended before or right after deploy**
- [ ] 4 whenever convenient (Umami/Plausible analytics)
- [ ] 5 after content pages are live on production (directory listings)
