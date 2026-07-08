/**
 * Regenerate client/public/llms.txt from scripts/public-routes.mjs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PUBLIC_ROUTES, SITE_URL } from "./public-routes.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "..", "client", "public", "llms.txt");

const pages = PUBLIC_ROUTES.filter((r) => r.path !== "/")
  .map((r) => `- [${r.llmsLabel}](${SITE_URL}${r.path}): ${r.llmsDesc}`)
  .join("\n");

const content = `# Plannio

> Plannio is a free web app for creating date polls: propose dates in a
> calendar or list, share one link, and everyone marks which dates work.
> Its differentiator is native Discord and Slack integration — polls can
> post automatic updates (poll created, new vote, date locked, reminders)
> to a channel via webhooks, with no bot invite required. Sign in with
> Discord or Slack; voters can participate with just a name.

## Key facts
- Price: free, no paywall
- Login: Discord, Slack, or email/password (only the creator needs an account)
- Integrations: Discord and Slack channel updates via incoming webhooks
- Features: date ranges, per-date times, all-day options, expected-response
  tracking, automatic and manual reminders, live results

## Pages
- [Home](${SITE_URL}/): product overview
${pages}
`;

fs.writeFileSync(outPath, content, "utf8");
console.log(`generate-llms: wrote ${path.relative(process.cwd(), outPath)}`);
