import { PenLine, Share2, MessageSquare } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const steps = [
  {
    icon: <PenLine className="h-6 w-6" />,
    step: "01",
    title: "Propose dates",
    body: "Sign in with Discord or Slack, name your poll, and pick dates in calendar or list view. Add ranges, times, or all-day options — and optionally connect a Discord and/or Slack channel.",
  },
  {
    icon: <Share2 className="h-6 w-6" />,
    step: "02",
    title: "Share the link",
    body: "Send the poll link in Discord or Slack. Participants vote with Discord or Slack login or just a name — you choose. Watch who has responded live.",
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    step: "03",
    title: "Stay updated",
    body: "Plannio posts updates in your Discord and/or Slack channel — new votes, selected dates, and a message when everyone expected has responded.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-secondary/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="From idea to answers in three steps"
            subtitle="Create a poll, share the link, and let Plannio keep you updated in Discord and Slack."
          />
        </Reveal>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
          {steps.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.1}>
              <div className="relative flex flex-col items-center text-center">
                <div className="relative grid h-[72px] w-[72px] place-items-center rounded-2xl border border-border bg-card text-primary shadow-card">
                  {s.icon}
                  <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold text-primary-foreground shadow-soft [background:var(--gradient-primary)]">
                    {s.step}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold tracking-tight text-foreground">{s.title}</h3>
                <p className="mt-2 max-w-xs text-muted-foreground">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
