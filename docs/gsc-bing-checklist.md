# Search Console and Bing checklist

These steps require a logged-in Google/Microsoft account. The HTML verification
files are already in the repo:

- Google: `client/public/google009c10cbef54ea76.html`
- Bing: `client/public/BingSiteAuth.xml`

Do this after the next production deploy so new titles, Discord pages, and
`llms-full.txt` are live.

## 1. Google Search Console

1. Open https://search.google.com/search-console
2. Add property **URL prefix** `https://plannio.eu` (or Domain if DNS is available).
3. Verify:
   - HTML file method should already match `google009c10cbef54ea76.html`
   - If Google instead shows an HTML **meta tag**, paste the token into chat so
     it can be added to `client/index.html`, then deploy and click Verify.
4. Left menu → **Sitemaps** → submit both:
   - `sitemap_new.xml` (canonical urlset — do **not** submit `sitemap.xml`)
   - `sitemap_index.xml`
5. Confirm both show **Success** (not “Couldn’t fetch”).
6. **URL inspection** → Request indexing for these five Discord URLs (one at a
   time, after they return 200 with an `<h1>` in view-source):

   - `https://plannio.eu/`
   - `https://plannio.eu/discord-scheduling`
   - `https://plannio.eu/guides/discord-poll-without-bot`
   - `https://plannio.eu/use-cases/game-night`
   - `https://plannio.eu/use-cases/raid-night`

   After the event-planning guide is deployed, also request:

   - `https://plannio.eu/guides/discord-event-planning`
   - `https://plannio.eu/guides/free-group-poll`

7. Pages → check that all sitemap URLs move to **Indexed** (target: 30 days).
8. Performance → filter Discord paths. Target: impressions > 0 on at least
   three Discord URLs within 30 days.

## 2. Bing Webmaster Tools

Copilot and ChatGPT search use Bing’s index.

1. Open https://www.bing.com/webmasters
2. Prefer **Import from Google Search Console** after GSC is verified.
3. Confirm `sitemap_new.xml` is listed.
4. Submit the same five Discord URLs for indexing if the UI offers it.

## 3. Analytics

- GA4 is wired via `VITE_GA_MEASUREMENT_ID` (loads only after cookie consent).
- Optional cookieless: `VITE_ANALYTICS_SCRIPT` + `VITE_ANALYTICS_WEBSITE_ID`
  (Umami/Plausible) — needed to see `chatgpt.com` / `perplexity.ai` referrers
  without waiting for consent.

After a week with real traffic, add AI-referrer counts to
`docs/geo-audit-log.md`.

## 4. Sanity curl (after deploy)

```bash
curl -sI https://plannio.eu/sitemap_new.xml
curl -sI https://plannio.eu/sitemap.xml
curl -s https://plannio.eu/discord-scheduling | findstr /i "<h1"
curl -sI https://plannio.eu/llms.txt
curl -sI https://plannio.eu/llms-full.txt
```

Expect HTTP 200 and no gzip on `sitemap_new.xml`. `/sitemap.xml` should 301 to
`/sitemap_new.xml`. Discord URLs must include a real page `<h1>` (not the
llms.txt summary).
