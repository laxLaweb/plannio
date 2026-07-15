import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Link2, CalendarRange, BellRing, Users, CalendarDays, MessageSquare } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

function FeatureCard({ icon, title, body, footer }) {
  return (
    <div className="h-full rounded-3xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <span
        className="inline-grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary"
        aria-hidden="true"
      >
        {icon}
      </span>
      <h3 className="mt-4 text-base font-bold tracking-tight text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
      {footer && <p className="mt-3 text-sm">{footer}</p>}
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Features"
            title={
              <>
                Stop chasing replies.
                <br className="hidden sm:block" /> See who can make which dates.
              </>
            }
            subtitle="Plannio helps groups agree on times — from weekend trips to team meetings — with date ranges, flexible times, and updates straight to Discord and Slack."
          />
        </Reveal>

        <div className="mt-16 grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          <Reveal className="lg:col-span-2 lg:row-span-2">
            <div className="group flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card">
              <div className="max-w-md">
                <span
                  className="inline-grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary"
                  aria-hidden="true"
                >
                  <Link2 className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-xl font-bold tracking-tight text-foreground">
                  One link, live results
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Share the poll link in Discord, Slack, or anywhere else. Participants pick the dates
                  that work for them and you watch results update in real time.
                </p>
              </div>

              <div className="mt-8 rounded-2xl border border-border bg-gradient-to-b from-secondary/40 to-background p-5">
                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span>plannio.eu/p/weekend-trip-a3f2</span>
                  <span className="rounded-full bg-success/15 px-2 py-0.5 text-success">3 / 4 responded</span>
                </div>
                <div className="mt-4 space-y-2">
                  {[
                    { l: "Fri Jul 4 – Sun Jul 6", v: 100 },
                    { l: "Sat Jul 11 – Sun Jul 12", v: 67 },
                    { l: "Fri Jul 18", v: 33 },
                  ].map((r, i) => (
                    <div key={r.l} className="flex items-center gap-3">
                      <span className="w-36 truncate text-xs font-medium text-foreground">{r.l}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${r.v}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, delay: i * 0.1 }}
                          className={`h-full rounded-full ${r.v === 100 ? "bg-primary" : "bg-muted-foreground/40"}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <FeatureCard
              icon={<CalendarRange className="h-5 w-5" />}
              title="Dates and ranges"
              body="Pick single days or multi-day ranges. Set one time for all dates, or choose start and end times per date — or mark all-day."
            />
          </Reveal>

          <Reveal delay={0.1}>
            <FeatureCard
              icon={<CalendarDays className="h-5 w-5" />}
              title="Calendar or list"
              body="Add dates visually in the calendar or as a list. Great for quick meetings and longer planning alike."
            />
          </Reveal>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Reveal>
            <FeatureCard
              icon={<MessageSquare className="h-5 w-5" />}
              title="Discord & Slack updates"
              body="Connect a Discord and/or Slack channel when you create a poll. Plannio posts when the poll is created, when someone votes, and when everyone has responded."
              footer={
                <>
                  <Link to="/discord-scheduling" className="font-semibold text-primary hover:underline">
                    Discord guide
                  </Link>
                  {" · "}
                  <Link to="/slack-scheduling" className="font-semibold text-primary hover:underline">
                    Slack guide
                  </Link>
                </>
              }
            />
          </Reveal>
          <Reveal delay={0.05}>
            <FeatureCard
              icon={<Users className="h-5 w-5" />}
              title="Expected responses"
              body="Set how many people should respond so you can track progress (e.g. 3 / 8) and get notified in Discord or Slack when everyone is done."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <FeatureCard
              icon={<BellRing className="h-5 w-5" />}
              title="Reminders"
              body="Schedule automatic nudges for people who haven't voted yet — or send a manual reminder from the poll page when you need one."
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
