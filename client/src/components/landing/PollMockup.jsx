import { motion } from "motion/react";
import { Check, Users } from "lucide-react";

const options = [
  { label: "Fri Jul 4 – Sun Jul 6", sub: "All day", votes: 3, total: 4 },
  { label: "Sat Jul 11 – Sun Jul 12", sub: "All day", votes: 2, total: 4 },
  { label: "Fri Jul 18", sub: "6:00 PM – 10:00 PM", votes: 1, total: 4 },
];

export function PollMockup() {
  return (
    <div className="relative" aria-hidden="true">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] [background:var(--gradient-hero)] blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: 24, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-3xl border border-border bg-card p-5 shadow-float sm:p-6"
      >
        <div className="mb-5 flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[oklch(0.8_0.12_25)]" />
          <span className="h-3 w-3 rounded-full bg-[oklch(0.85_0.12_85)]" />
          <span className="h-3 w-3 rounded-full bg-[oklch(0.8_0.12_150)]" />
          <span className="ml-3 text-xs font-medium text-muted-foreground">plannio.eu/p/weekend-trip-a3f2</span>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Date poll</p>
          <h3 className="mt-1 text-xl font-bold tracking-tight text-foreground">Weekend trip</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Which dates work for you?</p>
        </div>

        <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Users className="h-3.5 w-3.5" /> 3 / 4 responded
        </div>

        <div className="mt-3 space-y-2.5">
          {options.map((o, i) => (
            <motion.div
              key={o.label}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.12, duration: 0.5 }}
              className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-border bg-background p-3"
            >
              <div className="relative z-10 flex-1">
                <p className="text-sm font-semibold text-foreground">{o.label}</p>
                <p className="text-xs text-muted-foreground">{o.sub}</p>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(o.votes / o.total) * 100}%` }}
                    transition={{ delay: 0.6 + i * 0.12, duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>
              <div className="relative z-10 text-sm font-bold text-foreground">{o.votes}</div>
            </motion.div>
          ))}
        </div>

        <button
          type="button"
          disabled
          aria-hidden="true"
          tabIndex={-1}
          className="mt-4 w-full rounded-2xl bg-foreground py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          Save my response
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="animate-float absolute -bottom-6 -left-6 hidden items-center gap-3 rounded-2xl border border-border bg-card p-3 pr-4 shadow-card sm:flex"
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#5865F2]/15 text-[#5865F2]">
          <Check className="h-5 w-5" strokeWidth={2.5} />
        </span>
        <div>
          <p className="text-xs font-semibold text-foreground">New vote in Discord &amp; Slack</p>
          <p className="text-[11px] text-muted-foreground">Alex can do Fri Jul 4 – Sun Jul 6</p>
        </div>
      </motion.div>
    </div>
  );
}
