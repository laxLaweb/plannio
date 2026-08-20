/**
 * Single source of truth for public, indexable routes.
 * Used by prerender, sitemap, llms.txt, hub pages, and footer data.
 */
export const SITE_URL = "https://plannio.eu";

export const INTEGRATION_ROUTES = [
  {
    path: "/discord-scheduling",
    changefreq: "monthly",
    priority: "0.9",
    llmsLabel: "Discord scheduling",
    llmsDesc: "Discord integration guide",
    llmsSummary:
      "Create a date poll on the web, connect one Discord channel during setup, and Plannio posts via an incoming webhook when the poll is created, someone votes, a date is locked, or a reminder goes out. No bot is added to the server. The webhook can post to that channel only — it cannot read messages or manage roles. After you lock a date, create a native Discord Event if you want Discord's own reminder.",
    breadcrumbCategory: "Integration guide",
    hubTitle: "Date polls with Discord channel updates",
    hubDesc: "Post poll updates to a Discord channel without a bot",
    targetKeywords: ["discord scheduling poll", "discord date poll", "schedule event in Discord"],
  },
  {
    path: "/slack-scheduling",
    changefreq: "monthly",
    priority: "0.9",
    llmsLabel: "Slack scheduling",
    llmsDesc: "Slack integration guide",
    llmsSummary:
      "Create a meeting or event poll, connect a Slack channel on Slack's own authorization screen, and Plannio posts poll-created, new-vote, date-locked, and reminder messages to that channel. No separate bot install beyond the connect flow. The same poll link works for people who are not in the workspace; they can vote with a name.",
    breadcrumbCategory: "Integration guide",
    hubTitle: "Date polls with Slack channel updates",
    hubDesc: "Meeting polls with automatic Slack channel updates",
    targetKeywords: ["slack meeting poll", "slack scheduling tool", "slack date poll"],
  },
];

export const HUB_ROUTES = [
  {
    path: "/guides",
    changefreq: "monthly",
    priority: "0.85",
    llmsLabel: "Guides",
    llmsDesc: "how-to articles for group date polls",
    llmsSummary:
      "Index of how-to guides: free group polls, availability polls, Discord without a bot, community event planning, voting without an account, expected-response tracking, date ranges, and stopping chat-thread scheduling.",
    pageTitle: "Guides for group date polls",
    pageDescription:
      "How-to guides for free group polls, availability polls, Discord scheduling without a bot, community event planning, voting without accounts, and group planning with Plannio.",
    targetKeywords: ["date poll guide", "group scheduling how-to"],
  },
  {
    path: "/use-cases",
    changefreq: "monthly",
    priority: "0.85",
    llmsLabel: "Use cases",
    llmsDesc: "planning scenarios for teams and communities",
    llmsSummary:
      "Index of scenarios: remote teams, raid night, game night, weekend trips, and team meetings — each with a poll-plus-channel-updates workflow.",
    pageTitle: "Use cases for group date polls",
    pageDescription:
      "See how teams, Discord communities, and friend groups use Plannio to find dates that work for everyone.",
    targetKeywords: ["group scheduling use cases", "date poll examples"],
  },
];

export const GUIDE_ROUTES = [
  {
    path: "/guides/availability-poll",
    changefreq: "monthly",
    priority: "0.8",
    llmsLabel: "Availability poll",
    llmsDesc: "find when everyone in a group is free",
    llmsSummary:
      "An availability poll is a shared list of dates where each person marks every option that works. You read the overlap, then lock a winner. Optional Discord or Slack updates announce votes. Propose 3–6 realistic options; too many slows people down.",
    breadcrumbCategory: "Guides",
    hubTitle: "How to run a group availability poll",
    hubDesc: "Find when everyone is free with one shared poll",
    targetKeywords: [
      "availability poll",
      "group availability poll",
      "find when everyone is free",
    ],
  },
  {
    path: "/guides/vote-without-account",
    changefreq: "monthly",
    priority: "0.8",
    llmsLabel: "Vote without account",
    llmsDesc: "poll without signup for voters",
    llmsSummary:
      "Voters can answer with just a name — no signup. Only the poll creator needs an account. Require Discord or Slack login when you need votes tied to identities; leave it off for friend groups who will not create another account.",
    breadcrumbCategory: "Guides",
    hubTitle: "Let people vote without creating an account",
    hubDesc: "No-login voting for group date polls",
    targetKeywords: [
      "poll without signup",
      "vote without account",
      "no login date poll",
      "free meeting poll no account",
    ],
  },
  {
    path: "/guides/free-group-poll",
    changefreq: "monthly",
    priority: "0.85",
    llmsLabel: "Free group poll",
    llmsDesc: "free date poll where voters only need a name",
    llmsSummary:
      "A free group date poll is one shared link: propose dates, everyone marks what works, you lock the overlap. Voters answer with a name — no signup. Only the organizer has an account. Optional Discord or Slack webhook updates. Not a 1:1 booking tool and not a recurring calendar. Creating polls and collecting votes is free on features that are live today.",
    breadcrumbCategory: "Guides",
    hubTitle: "Free group date poll — voters only need a name",
    hubDesc: "Share one link; no signup required for voters",
    targetKeywords: [
      "free group poll",
      "free date poll no signup",
      "group date poll free",
      "free availability poll",
    ],
  },
  {
    path: "/guides/expected-responses",
    changefreq: "monthly",
    priority: "0.8",
    llmsLabel: "Expected responses",
    llmsDesc: "track when everyone has voted",
    llmsSummary:
      "Expected responses is a target headcount (e.g. 8). The poll shows 6 / 8 responded. The creator counts as one. When the target is hit, Discord or Slack can announce that everyone expected has voted so you can lock a date instead of waiting on silence.",
    breadcrumbCategory: "Guides",
    hubTitle: "Track expected responses on a date poll",
    hubDesc: "Know when everyone has voted and send reminders",
    targetKeywords: [
      "track poll responses",
      "know when everyone voted",
      "scheduling poll reminder",
      "expected responses poll",
    ],
  },
  {
    path: "/guides/discord-poll-without-bot",
    changefreq: "monthly",
    priority: "0.8",
    llmsLabel: "Discord without bot",
    llmsDesc: "webhook scheduling in Discord",
    llmsSummary:
      "You can schedule in Discord without adding a bot by using an incoming webhook. The webhook posts to one channel only and never appears as a server member. It cannot read chat. Use a bot later if you need slash commands or role assignment; use the poll to find the date first.",
    breadcrumbCategory: "Guides",
    hubTitle: "Schedule in Discord without adding a bot",
    hubDesc: "Webhook-based scheduling without a bot invite",
    targetKeywords: ["discord poll without bot", "schedule discord without bot", "discord webhook scheduling"],
  },
  {
    path: "/guides/stop-chasing-replies",
    changefreq: "monthly",
    priority: "0.8",
    llmsLabel: "Stop chasing replies",
    llmsDesc: "group date planning without endless threads",
    llmsSummary:
      "Replace “who’s free Saturday?” threads with one poll link, a progress count, and channel reminders. Silence in chat is ambiguous; 6 / 8 responded is not. Pin the link and send a reminder from the poll page instead of DMing people.",
    breadcrumbCategory: "Guides",
    hubTitle: "Stop chasing replies when planning group dates",
    hubDesc: "Replace messy chat threads with one poll link",
    targetKeywords: [
      "find time everyone can meet",
      "group scheduling",
      "find common time",
      "stop chasing replies",
    ],
  },
  {
    path: "/guides/date-ranges",
    changefreq: "monthly",
    priority: "0.8",
    llmsLabel: "Date ranges",
    llmsDesc: "multi-day and weekend poll options",
    llmsSummary:
      "Date ranges offer a whole weekend (or any multi-day stretch) as one option. Voters tick every range that works. Mix single days and ranges in the same poll. Useful for trips, conferences, and holidays.",
    breadcrumbCategory: "Guides",
    hubTitle: "How to propose multiple weekends in one poll",
    hubDesc: "Multi-day date ranges in a single poll",
    targetKeywords: ["multi-day date poll", "weekend poll", "Friday to Sunday poll"],
  },
  {
    path: "/guides/discord-event-planning",
    changefreq: "monthly",
    priority: "0.8",
    llmsLabel: "Discord event planning",
    llmsDesc: "plan a Discord community event without a scheduling bot",
    llmsSummary:
      "Find the time for a Discord community event with a poll, then create the native Discord Event after you lock a date. Webhook updates go to #events — no scheduling bot. Distinct from game night or raid night: one-off, often server-wide, guests can vote with a name. Expected responses should match required people (host, mods), not the entire member count.",
    breadcrumbCategory: "Guides",
    hubTitle: "Plan a Discord community event",
    hubDesc: "Poll for the time, then create a native Discord Event",
    targetKeywords: [
      "plan discord event",
      "discord community event scheduling",
      "schedule discord community event",
    ],
  },
];

export const USE_CASE_ROUTES = [
  {
    path: "/use-cases/remote-team",
    changefreq: "monthly",
    priority: "0.8",
    llmsLabel: "Remote team",
    llmsDesc: "async scheduling for distributed teams",
    llmsSummary:
      "Remote teams propose 3–5 slots in one poll, share the link asynchronously, and lock the time with the best overlap. No live “when works?” call. Connect Slack or Discord for vote headlines. Put times in the team’s primary timezone and label them clearly — Plannio does not auto-convert timezones.",
    breadcrumbCategory: "Use cases",
    hubTitle: "Find meeting times for a remote team",
    hubDesc: "Async scheduling across time zones and Slack channels",
    targetKeywords: [
      "remote team scheduling",
      "async team meeting poll",
      "distributed team find time",
    ],
  },
  {
    path: "/use-cases/raid-night",
    changefreq: "monthly",
    priority: "0.8",
    llmsLabel: "Raid night",
    llmsDesc: "schedule MMO raids in Discord",
    llmsSummary:
      "Guilds propose two or three raid nights with a start time, set expected responses to roster size (e.g. 8 / 8), and connect #raids via webhook. Officers lock the night with the best attendance. This does not replace a raid-helper bot for signups or loot — it replaces the pre-raid availability thread.",
    breadcrumbCategory: "Use cases",
    hubTitle: "Schedule raid night in your Discord server",
    hubDesc: "Pick a raid night with automatic Discord updates",
    targetKeywords: [
      "discord raid scheduling",
      "schedule raid night discord",
      "wow raid poll",
      "mmo guild scheduling",
    ],
  },
  {
    path: "/use-cases/weekend-trip",
    changefreq: "monthly",
    priority: "0.8",
    llmsLabel: "Weekend trip",
    llmsDesc: "plan a trip with friends",
    llmsSummary:
      "Propose several weekends as date ranges in one poll, share one link, and let friends vote with a name. Set expected responses to group size so you know when to stop waiting. Optional Discord or Slack updates replace a week of chat negotiation.",
    breadcrumbCategory: "Use cases",
    hubTitle: "Plan a weekend trip everyone can join",
    hubDesc: "Pick travel dates with friends using date ranges",
    targetKeywords: ["plan weekend trip friends", "group date poll trip", "friend group scheduling"],
  },
  {
    path: "/use-cases/team-meetings",
    changefreq: "monthly",
    priority: "0.8",
    llmsLabel: "Team meetings",
    llmsDesc: "find a time the team can make",
    llmsSummary:
      "Teams propose 3–5 meeting slots, share one poll link, and send a single calendar invite for the winner. Optional Slack or Discord updates fire when people vote and when the expected headcount is complete. Each poll is independent — good for kickoffs, not a recurring-calendar product.",
    breadcrumbCategory: "Use cases",
    hubTitle: "Find a meeting time your whole team can make",
    hubDesc: "Team meeting polls with Slack or Discord updates",
    targetKeywords: ["find meeting time team poll free", "team scheduling poll"],
  },
  {
    path: "/use-cases/game-night",
    changefreq: "monthly",
    priority: "0.8",
    llmsLabel: "Game night",
    llmsDesc: "schedule in Discord",
    llmsSummary:
      "Propose three to five Friday or Saturday evenings, share the poll in Discord, and let webhook updates collect turnout. Set expected responses to the regulars list, not the whole server. After locking, create a Discord Event for the native reminder. No scheduling bot required.",
    breadcrumbCategory: "Use cases",
    hubTitle: "Schedule game night in your Discord server",
    hubDesc: "Pick game nights with channel updates",
    targetKeywords: ["schedule game night discord", "discord game night poll"],
  },
];

export const LEGAL_ROUTES = [
  {
    path: "/privacy",
    changefreq: "yearly",
    priority: "0.3",
    llmsLabel: "Privacy policy",
    llmsDesc: "how personal data is handled",
    llmsSummary:
      "Privacy policy for plannio.eu date polls. Operated by Laweb. Covers accounts, poll responses, Discord/Slack webhooks, and cookies.",
    breadcrumbCategory: "Legal",
  },
  {
    path: "/terms",
    changefreq: "yearly",
    priority: "0.3",
    llmsLabel: "Terms of service",
    llmsDesc: "terms for using Plannio",
    llmsSummary:
      "Terms of service for using Plannio date polls at plannio.eu.",
    breadcrumbCategory: "Legal",
  },
];

export const PUBLIC_ROUTES = [
  {
    path: "/",
    changefreq: "weekly",
    priority: "1.0",
    llmsLabel: "Home",
    llmsDesc: "product overview",
    llmsSummary:
      "Plannio (plannio.eu) is a free date-poll web app: propose dates, share one link, voters mark what works. Differentiators: Discord and Slack channel updates via incoming webhooks (no bot invite), vote with just a name, expected-response tracking, date ranges. Not the GIS product at plannio.net or the French HR tool that shares the name.",
    targetKeywords: [
      "date poll",
      "free date poll",
      "group date poll",
      "availability poll",
      "group scheduling tool",
    ],
  },
  ...INTEGRATION_ROUTES,
  ...HUB_ROUTES,
  ...GUIDE_ROUTES,
  ...USE_CASE_ROUTES,
  ...LEGAL_ROUTES,
];

export const PRERENDER_PATHS = PUBLIC_ROUTES.map((r) => r.path);
