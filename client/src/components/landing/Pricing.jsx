import { Check } from "lucide-react";
import { CreatePollButton } from "@/components/polls/CreatePollButton";
import { Reveal, SectionHeading } from "./Reveal";

const plan = {
  name: "Free",
  price: "$0",
  period: "forever",
  desc: "Everything you need for date polls with Discord.",
  features: [
    "Unlimited date polls",
    "Calendar and list views",
    "Date ranges and time slots",
    "Shareable voting link",
    "Discord login or name-only voting",
    "Discord channel updates",
    "Expected responses and progress tracking",
    "Live results",
  ],
};

export function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Pricing"
            title="Free to use"
            subtitle="Plannio is free right now — create polls, share them, and get Discord updates with no paywall."
          />
        </Reveal>

        <Reveal delay={0.08} className="mx-auto mt-14 max-w-md">
          <div className="relative flex h-full flex-col rounded-3xl border border-primary/30 bg-card p-7 shadow-glow">
            <h3 className="text-lg font-bold tracking-tight text-foreground">{plan.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{plan.desc}</p>
            <div className="mt-5 flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold tracking-tight text-foreground">{plan.price}</span>
              <span className="text-sm text-muted-foreground">{plan.period}</span>
            </div>
            <CreatePollButton variant="hero" size="lg" className="mt-6 w-full">
              Create free poll
            </CreatePollButton>
            <ul className="mt-7 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
