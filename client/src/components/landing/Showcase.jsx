import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  PencilRuler,
  Vote,
  BarChart3,
  MessageSquare,
  Plus,
  Check,
  CalendarDays,
  CalendarRange,
  Sun,
} from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "create", label: "Create poll", icon: PencilRuler },
  { id: "vote", label: "Voting", icon: Vote },
  { id: "results", label: "Results", icon: BarChart3 },
  { id: "discord", label: "Discord", icon: MessageSquare },
];

export function Showcase() {
  const [active, setActive] = useState("create");

  return (
    <section id="showcase" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Product"
            title="What it looks like in practice"
            subtitle="Create dates, share the link, and follow along in Discord — all in one flow."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {tabs.map((t) => {
              const Icon = t.icon;
              const on = active === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                    on
                      ? "border-transparent bg-foreground text-background shadow-soft"
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" /> {t.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 rounded-3xl border border-border bg-gradient-to-b from-secondary/50 to-background p-3 shadow-float sm:p-5">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <BrowserBar />
              <div className="min-h-[420px] p-5 sm:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                  >
                    {active === "create" && <CreateScreen />}
                    {active === "vote" && <VoteScreen />}
                    {active === "results" && <ResultsScreen />}
                    {active === "discord" && <DiscordScreen />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function BrowserBar() {
  return (
    <div className="flex items-center gap-2 border-b border-border bg-secondary/40 px-4 py-3">
      <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.8_0.12_25)]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.85_0.12_85)]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.8_0.12_150)]" />
      <div className="ml-3 hidden flex-1 rounded-md bg-background px-3 py-1 text-xs text-muted-foreground sm:block">
        plannio.app/polls/new
      </div>
    </div>
  );
}

function CreateScreen() {
  const dates = [
    { label: "Fri Jul 4 – Sun Jul 6", icon: CalendarRange },
    { label: "Sat Jul 11 – Sun Jul 12", icon: CalendarRange },
    { label: "Fri Jul 18", icon: Sun },
  ];
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <div>
        <h3 className="text-lg font-bold tracking-tight text-foreground">Create new poll</h3>
        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Event name</label>
            <div className="mt-1.5 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground">
              Weekend trip
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Dates · Calendar</label>
            <div className="mt-1.5 space-y-2">
              {dates.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  <span>{label}</span>
                  <span className="ml-auto rounded-lg bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                    All day
                  </span>
                </div>
              ))}
              <span className="inline-flex items-center gap-1 rounded-xl border border-dashed border-border px-3 py-2 text-sm font-medium text-muted-foreground">
                <Plus className="h-3.5 w-3.5" /> Add in calendar
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-secondary/30 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Discord</p>
        <div className="mt-3 rounded-xl border border-success/30 bg-success/10 px-3 py-2.5 text-sm font-medium text-success">
          Channel connected
        </div>
        <div className="mt-3 space-y-2 text-sm text-foreground">
          <p className="text-xs font-semibold text-muted-foreground">Expected responses</p>
          <div className="w-20 rounded-xl border border-border bg-background px-3 py-2 font-medium">8</div>
          <p className="text-xs text-muted-foreground">Notify when poll is created, someone votes, etc.</p>
        </div>
      </div>
    </div>
  );
}

function VoteScreen() {
  const opts = [
    { s: "Fri Jul 4 – Sun Jul 6", sub: "All day", on: true },
    { s: "Sat Jul 11 – Sun Jul 12", sub: "All day", on: false },
    { s: "Fri Jul 18", sub: "6:00 PM – 10:00 PM", on: true },
  ];
  return (
    <div className="mx-auto max-w-md">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
          Your name
        </span>
        <h3 className="mt-3 text-xl font-bold tracking-tight text-foreground">Weekend trip</h3>
        <p className="mt-1 text-sm text-muted-foreground">Which dates work for you?</p>
      </div>
      <div className="mt-6 space-y-2.5">
        {opts.map((o) => (
          <div
            key={o.s}
            className={cn(
              "flex items-center justify-between rounded-2xl border px-4 py-3.5 transition-colors",
              o.on ? "border-primary bg-primary-soft" : "border-border bg-background",
            )}
          >
            <div>
              <span className="block text-sm font-semibold text-foreground">{o.s}</span>
              <span className="text-xs text-muted-foreground">{o.sub}</span>
            </div>
            <span
              className={cn(
                "grid h-6 w-6 place-items-center rounded-md border-2",
                o.on ? "border-primary bg-primary text-white" : "border-border",
              )}
            >
              {o.on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            </span>
          </div>
        ))}
      </div>
      <button className="mt-5 w-full rounded-2xl bg-foreground py-3 text-sm font-semibold text-background">
        Save response
      </button>
    </div>
  );
}

function ResultsScreen() {
  const rows = [
    { s: "Fri Jul 4 – Sun Jul 6", v: 3, t: 4 },
    { s: "Sat Jul 11 – Sun Jul 12", v: 2, t: 4 },
    { s: "Fri Jul 18", v: 1, t: 4 },
  ];
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold tracking-tight text-foreground">Results · Weekend trip</h3>
        <span className="text-sm font-semibold text-muted-foreground">3 / 4 responded</span>
      </div>
      <div className="mt-6 space-y-3">
        {rows.map((r) => (
          <div key={r.s} className="rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">{r.s}</span>
              <span className="text-sm font-bold text-foreground">
                {r.v}/{r.t}
              </span>
            </div>
            <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(r.v / r.t) * 100}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-primary"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiscordScreen() {
  const messages = [
    {
      title: "📅 New poll: Weekend trip",
      body: "Proposed times + share link",
    },
    {
      title: "🗳️ Alex responded",
      body: "Available: Fri Jul 4 – Sun Jul 6",
    },
    {
      title: "🎉 Everyone responded: Weekend trip",
      body: "All 4 expected participants have voted",
    },
  ];
  return (
    <div className="mx-auto max-w-lg">
      <h3 className="text-lg font-bold tracking-tight text-foreground">Updates in Discord</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Connect a channel when you create a poll — Plannio posts automatically.
      </p>
      <div className="mt-6 space-y-3">
        {messages.map((m) => (
          <div key={m.title} className="rounded-2xl border border-border bg-background p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#5865F2]/10 text-[#5865F2]">
                <MessageSquare className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{m.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{m.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
