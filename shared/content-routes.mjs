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
    pageTitle: "Guides for group date polls",
    pageDescription:
      "How-to guides for availability polls, Discord and Slack scheduling, voting without accounts, and group planning with Plannio.",
    targetKeywords: ["date poll guide", "group scheduling how-to"],
  },
  {
    path: "/use-cases",
    changefreq: "monthly",
    priority: "0.85",
    llmsLabel: "Use cases",
    llmsDesc: "planning scenarios for teams and communities",
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
    path: "/guides/expected-responses",
    changefreq: "monthly",
    priority: "0.8",
    llmsLabel: "Expected responses",
    llmsDesc: "track when everyone has voted",
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
    breadcrumbCategory: "Guides",
    hubTitle: "How to propose multiple weekends in one poll",
    hubDesc: "Multi-day date ranges in a single poll",
    targetKeywords: ["multi-day date poll", "weekend poll", "Friday to Sunday poll"],
  },
];

export const USE_CASE_ROUTES = [
  {
    path: "/use-cases/remote-team",
    changefreq: "monthly",
    priority: "0.8",
    llmsLabel: "Remote team",
    llmsDesc: "async scheduling for distributed teams",
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
    breadcrumbCategory: "Use cases",
    hubTitle: "Schedule game night in your Discord server",
    hubDesc: "Pick game nights with channel updates",
    targetKeywords: ["schedule game night discord", "discord game night poll", "discord community event"],
  },
];

export const LEGAL_ROUTES = [
  {
    path: "/privacy",
    changefreq: "yearly",
    priority: "0.3",
    llmsLabel: "Privacy policy",
    llmsDesc: "how personal data is handled",
    breadcrumbCategory: "Legal",
  },
  {
    path: "/terms",
    changefreq: "yearly",
    priority: "0.3",
    llmsLabel: "Terms of service",
    llmsDesc: "terms for using Plannio",
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
