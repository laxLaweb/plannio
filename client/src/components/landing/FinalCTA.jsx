import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreatePollButton } from "@/components/polls/CreatePollButton";
import { Reveal } from "./Reveal";

export function FinalCTA() {
  return (
    <section id="cta" className="px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] px-6 py-16 text-center shadow-glow [background:var(--gradient-primary)] sm:px-12 sm:py-20">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-20 [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)]" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-primary-foreground sm:text-5xl">
              Ready to find the right time?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-primary-foreground/85">
              Create your first date poll, share it in Discord or Slack, and get notified when people
              respond.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CreatePollButton
                size="xl"
                className="bg-background text-foreground shadow-float hover:-translate-y-0.5 hover:bg-background"
              >
                Create free poll <ArrowRight className="h-4 w-4" />
              </CreatePollButton>
              <Button
                variant="ghost"
                size="xl"
                className="text-primary-foreground hover:bg-white/15 hover:text-primary-foreground"
                asChild
              >
                <Link to="/discord-scheduling">See Discord &amp; Slack guides</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-primary-foreground/70">
              Free · Discord &amp; Slack login · Channel updates
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
