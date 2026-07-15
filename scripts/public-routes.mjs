/**
 * Single source of truth for public, indexable routes.
 * Used by prerender, sitemap generation, and llms.txt generation.
 */
export const SITE_URL = "https://plannio.eu";

export const PUBLIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0", llmsLabel: "Home", llmsDesc: "product overview" },
  {
    path: "/discord-scheduling",
    changefreq: "monthly",
    priority: "0.9",
    llmsLabel: "Discord scheduling",
    llmsDesc: "Discord integration guide",
    breadcrumbCategory: "Integration guide",
  },
  {
    path: "/slack-scheduling",
    changefreq: "monthly",
    priority: "0.9",
    llmsLabel: "Slack scheduling",
    llmsDesc: "Slack integration guide",
    breadcrumbCategory: "Integration guide",
  },
  {
    path: "/use-cases/weekend-trip",
    changefreq: "monthly",
    priority: "0.8",
    llmsLabel: "Weekend trip",
    llmsDesc: "plan a trip with friends",
    breadcrumbCategory: "Use cases",
  },
  {
    path: "/use-cases/team-meetings",
    changefreq: "monthly",
    priority: "0.8",
    llmsLabel: "Team meetings",
    llmsDesc: "find a time the team can make",
    breadcrumbCategory: "Use cases",
  },
  {
    path: "/use-cases/game-night",
    changefreq: "monthly",
    priority: "0.8",
    llmsLabel: "Game night",
    llmsDesc: "schedule in Discord",
    breadcrumbCategory: "Use cases",
  },
  {
    path: "/guides/discord-poll-without-bot",
    changefreq: "monthly",
    priority: "0.8",
    llmsLabel: "Discord without bot",
    llmsDesc: "webhook scheduling",
    breadcrumbCategory: "Guides",
  },
  {
    path: "/guides/stop-chasing-replies",
    changefreq: "monthly",
    priority: "0.8",
    llmsLabel: "Stop chasing replies",
    llmsDesc: "group date planning",
    breadcrumbCategory: "Guides",
  },
  {
    path: "/guides/date-ranges",
    changefreq: "monthly",
    priority: "0.8",
    llmsLabel: "Date ranges",
    llmsDesc: "multi-day poll options",
    breadcrumbCategory: "Guides",
  },
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

export const PRERENDER_PATHS = PUBLIC_ROUTES.map((r) => r.path);
