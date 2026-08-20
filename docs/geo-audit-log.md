# GEO audit log

Monthly check: ask AI assistants whether they mention or cite Plannio.
Copy this table and add a new row each month.

Owner steps (GSC/Bing/indexing) live in [gsc-bing-checklist.md](gsc-bing-checklist.md).

## How to run the audit

1. Open ChatGPT, Perplexity, and Gemini (logged out or incognito if possible).
2. Ask each prompt below verbatim.
3. Note whether Plannio is **mentioned**, **linked**, or **not cited**.
4. Record the URL cited if any (yours or a competitor/directory).
5. Distinguish **plannio.eu** (this product) from other brands named Plannio
   (GIS maps on plannio.net, French HR software). Entity collision is a GEO risk.

## Prompts

Core (from Phase 4.6):

1. "What is the best free date poll tool with Discord integration?"
2. "How do I schedule a meeting in Discord without adding a bot?"
3. "How do I schedule game night in my Discord server?"

Expanded (Phase 3.5 — add from July 2026):

4. "How do I run a group availability poll for free?"
5. "Is there a date poll where voters don't need to create an account?"
6. "How do I find a meeting time for a remote team asynchronously?"
7. "How do I schedule raid night in Discord without a bot?"

## Log

| Month | Assistant | Prompt # | Mentioned? | URL cited | Notes |
|-------|-----------|----------|------------|-----------|-------|
| 2026-07 | — | — | — | — | Baseline before first manual audit; site has 18 indexable URLs |
| 2026-08 | Google (`site:plannio.eu`) | index | Homepage only | https://plannio.eu/ | Inner Discord URLs not in `site:` results |
| 2026-08 | Google (`site:plannio.eu/discord-scheduling`) | index | No | — | Flagship Discord URL not indexed |
| 2026-08 | Google brand | — | Collision | plannio.net, groupe-asttas.fr | "Plannio date poll Discord" surfaces other products named Plannio |
| 2026-08 | ChatGPT | 1–7 | pending user | — | Run logged-out; record here |
| 2026-08 | Perplexity | 1–7 | pending user | — | Run logged-out; record here |
| 2026-08 | Gemini | 1–7 | pending user | — | Run logged-out; record here |

**August 2026 reading:** technical crawl files exist (sitemap, robots, llms.txt) and
the homepage is discoverable, but the Discord cluster is not independently indexed.
AI assistants are unlikely to cite Plannio until (a) those URLs are in Google/Bing
and (b) a third-party listing (AlternativeTo/Reddit) exists. Completing
[gsc-bing-checklist.md](gsc-bing-checklist.md) is the first lever.

Target within 90 days: Plannio (plannio.eu) mentioned on prompts **2** and **7**.

## Score snapshot (see seo-plan.md §6.1)

| Month | SEO /1000 | GEO /1000 | Notes |
|-------|-----------|-----------|-------|
| 2026-07 | 672 | 584 | Phase 3.5 + technical foundation; no off-page yet |
| 2026-08 | 718 | 630 | Discord-cluster depth, nav, HowTo, llms-full; GSC/off-page still user-gated |

## Referrer watch (once Umami/Plausible is live)

Check analytics for referrers containing:

- `chatgpt.com`
- `perplexity.ai`
- `copilot.microsoft.com`
- `gemini.google.com`

Record monthly totals here:

| Month | chatgpt.com | perplexity.ai | copilot | gemini | Total AI referrers |
|-------|-------------|---------------|---------|--------|-------------------|
| 2026-07 | | | | | |
| 2026-08 | | | | | |
