import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { useConsent } from "@/context/ConsentContext";
import { formatSiteOwner } from "@/lib/site";

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

const groups = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Guides",
    links: [
      { label: "Discord scheduling", href: "/discord-scheduling", router: true },
      { label: "Slack scheduling", href: "/slack-scheduling", router: true },
      { label: "Without a Discord bot", href: "/guides/discord-poll-without-bot", router: true },
      { label: "Stop chasing replies", href: "/guides/stop-chasing-replies", router: true },
      { label: "Date ranges", href: "/guides/date-ranges", router: true },
    ],
  },
  {
    title: "Use cases",
    links: [
      { label: "Weekend trip", href: "/use-cases/weekend-trip", router: true },
      { label: "Team meetings", href: "/use-cases/team-meetings", router: true },
      { label: "Game night", href: "/use-cases/game-night", router: true },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: "/login", router: true },
      { label: "Create poll", href: "/polls/new", router: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy", router: true },
      { label: "Terms of service", href: "/terms", router: true },
    ],
  },
];

export function Footer() {
  const { resetConsent } = useConsent();

  return (
    <footer id="enterprise" className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1.8fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Find times that work for everyone with date polls, share links, and updates straight to
              Discord and Slack.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Operated by {formatSiteOwner()}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-5">
            {groups.map((g) => (
              <div key={g.title}>
                <p className="text-sm font-semibold text-foreground">{g.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {g.links.map((l) => (
                    <li key={l.label}>
                      {l.router ? (
                        <Link
                          to={l.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {l.label}
                        </Link>
                      ) : (
                        <a
                          href={l.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {l.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 Plannio · {formatSiteOwner()}
          </p>
          <div className="flex items-center gap-4">
            {GA_ID && (
              <button
                type="button"
                onClick={resetConsent}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Cookie settings
              </button>
            )}
            <p className="text-sm text-muted-foreground">Built for people who plan — not chase replies.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
