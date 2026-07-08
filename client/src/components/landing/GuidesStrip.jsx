import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const guides = [
  {
    label: "Discord scheduling",
    href: "/discord-scheduling",
    desc: "Channel updates without a bot",
  },
  {
    label: "Slack scheduling",
    href: "/slack-scheduling",
    desc: "Meeting polls in your workspace",
  },
  {
    label: "Stop chasing replies",
    href: "/guides/stop-chasing-replies",
    desc: "One link instead of endless threads",
  },
];

export function GuidesStrip() {
  return (
    <section className="border-y border-border bg-secondary/20 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Guides"
            title="Learn how groups use Plannio"
            subtitle="Step-by-step guides for Discord, Slack, and common planning scenarios."
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {guides.map((g, i) => (
            <Reveal key={g.href} delay={i * 0.05}>
              <Link
                to={g.href}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card"
              >
                <span className="text-base font-bold tracking-tight text-foreground group-hover:text-primary">
                  {g.label}
                </span>
                <span className="mt-1 flex-1 text-sm text-muted-foreground">{g.desc}</span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Read guide <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
