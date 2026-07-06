import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const pad = (n) => String(n).padStart(2, "0");
const iso = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

export function DatePickerCalendar({ rows, onAddRange, onRemoveRow }) {
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [anchor, setAnchor] = useState(null);

  const firstWeekday = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const todayIso = iso(today.getFullYear(), today.getMonth(), today.getDate());

  const findRow = (dayIso) =>
    rows.find((r) => r.date && dayIso >= r.date && dayIso <= (r.endDate || r.date));

  const handleClick = (dayIso) => {
    const row = findRow(dayIso);
    if (row) {
      onRemoveRow(row.id);
      setAnchor(null);
      return;
    }
    if (!anchor) {
      setAnchor(dayIso);
      return;
    }
    const [a, b] = anchor <= dayIso ? [anchor, dayIso] : [dayIso, anchor];
    onAddRange(a, a === b ? null : b);
    setAnchor(null);
  };

  const changeMonth = (delta) => {
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold capitalize text-foreground">
          {MONTHS[view.m]} {view.y}
        </span>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="text-[11px] font-semibold text-muted-foreground">
            {d}
          </span>
        ))}

        {Array.from({ length: firstWeekday }).map((_, i) => (
          <span key={`blank-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayIso = iso(view.y, view.m, day);
          const selected = Boolean(findRow(dayIso));
          const isAnchor = anchor === dayIso;
          const isToday = dayIso === todayIso;

          return (
            <button
              key={dayIso}
              type="button"
              onClick={() => handleClick(dayIso)}
              className={cn(
                "grid aspect-square place-items-center rounded-lg text-sm font-medium transition-colors",
                selected
                  ? "bg-primary text-primary-foreground"
                  : isAnchor
                    ? "bg-primary-soft text-primary ring-2 ring-primary"
                    : "text-foreground hover:bg-secondary",
                isToday && !selected && !isAnchor && "font-bold text-primary",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {anchor
          ? "Click an end date for a range — or the same day again for a single day."
          : "Click a date. Click two dates for a range (e.g. Friday–Sunday)."}
      </p>
    </div>
  );
}
