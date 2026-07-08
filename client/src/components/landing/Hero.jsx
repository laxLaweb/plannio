import { motion } from "motion/react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatePollButton } from "@/components/polls/CreatePollButton";
import { PollMockup } from "./PollMockup";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] [background:var(--gradient-hero)]" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.a
            href="#features"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 py-1.5 pl-2 pr-4 text-sm font-medium text-foreground shadow-soft backdrop-blur"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3 w-3" /> Date polls
            </span>
            With Discord &amp; Slack updates
          </motion.a>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 text-[2.7rem] font-extrabold leading-[1.04] tracking-[-0.03em] text-foreground sm:text-6xl"
          >
            Find the time
            <br />
            everyone says <span className="text-gradient">yes</span> to.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Create a date poll with calendar or list view, share the link in Discord or Slack, and get
            channel updates when people respond. Require Discord or Slack login — or let people vote
            with just a name.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <CreatePollButton variant="hero" size="xl">
              Create free poll <ArrowRight className="h-4 w-4" />
            </CreatePollButton>
            <Button variant="outline" size="xl" asChild>
              <a href="#showcase">
                <Play className="h-4 w-4" /> See how it works
              </a>
            </Button>
          </motion.div>
        </div>

        <div className="lg:pl-6">
          <PollMockup />
        </div>
      </div>
    </section>
  );
}
