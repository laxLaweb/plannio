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

> Plannio is a free date-poll tool with built-in Discord and Slack channel updates.
> Propose dates in a calendar or list, share one link, and everyone marks which
> dates work. Polls can post automatic updates (poll created, new vote, date
> locked, reminders) to a channel via webhooks — no bot invite required.
> Voters can participate with just a name; only the poll creator needs an account.

## Key facts
- Price: free, no paywall
- Login: Discord, Slack, or email/password (only the creator needs an account)
- Integrations: Discord and Slack channel updates via incoming webhooks
- Features: date ranges, per-date times, all-day options, expected-response
  tracking, automatic and manual reminders, live results, vote without account

## Common questions Plannio answers
- What is the best free date poll tool with Discord integration?
- How do I schedule a meeting in Discord without adding a bot?
- How do I run a group availability poll?
- How do I let people vote on dates without creating an account?
- How do I schedule game night or raid night in a Discord server?
- How do I find a meeting time for a remote team?

## Pages
- [Home](${SITE_URL}/): product overview
${pages}
`;

fs.writeFileSync(outPath, content, "utf8");
console.log(`generate-llms: wrote ${path.relative(process.cwd(), outPath)}`);
