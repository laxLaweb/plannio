import { Star } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const stories = [
  {
    quote:
      "We used to bounce dates back and forth in Discord. Now we create a poll, share the link in the channel, and get notified when people respond.",
    name: "Elena Marsh",
    role: "Team lead",
    initials: "EM",
    accent: "oklch(0.6 0.21 277)",
  },
  {
    quote:
      "We planned a weekend trip in one evening. Date ranges and the all-day option made it easy to propose several weekends at once.",
    name: "Daniel Okafor",
    role: "Event organizer",
    initials: "DO",
    accent: "oklch(0.65 0.18 200)",
  },
  {
    quote:
      "The best part is seeing 3 / 8 responded and getting a Discord ping when everyone has voted. Then we know it's time to pick.",
    name: "Priya Nair",
    role: "Project coordinator",
    initials: "PN",
    accent: "oklch(0.7 0.16 30)",
  },
];

export function Testimonials() {
  return (
    <section id="resources" className="bg-secondary/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Use cases"
            title="How people use Plannio"
            subtitle="Date polls with clarity — especially when you're already coordinating in Discord."
          />
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {stories.map((s, i) => (
            <Reveal key={s.name} delay={(i % 3) * 0.08}>
              <figure className="h-full rounded-3xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-0.5 text-[oklch(0.78_0.16_85)]">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 text-[15px] leading-relaxed text-foreground">
                  &ldquo;{s.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white"
                    style={{ background: s.accent }}
                  >
                    {s.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
