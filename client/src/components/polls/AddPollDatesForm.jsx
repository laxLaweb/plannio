import { useMemo, useState } from "react";
import {
  CalendarDays,
  CalendarRange,
  Clock,
  List,
  Plus,
  Sun,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePickerCalendar } from "@/components/polls/DatePickerCalendar";
import { cn } from "@/lib/utils";

let rowSeq = 0;
function makeRow(patch = {}) {
  rowSeq += 1;
  return {
    id: rowSeq,
    date: "",
    endDate: "",
    isRange: false,
    startTime: "",
    endTime: "",
    allDay: true,
    ...patch,
  };
}

function formatShort(dateIso) {
  if (!dateIso) return "";
  const date = new Date(`${dateIso}T00:00:00`);
  return date.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
}

function serverOptionKey(opt) {
  return `${opt.option_date}|${opt.end_date || ""}|${opt.all_day}|${opt.start_time || ""}|${opt.end_time || ""}`;
}

function buildOptionKey(opt) {
  return `${opt.date}|${opt.endDate || ""}|${opt.allDay}|${opt.time || ""}|${opt.endTime || ""}`;
}

function ViewTab({ active, onClick, icon: Icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}

function TimeRange({ startTime, endTime, allDay, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="time"
        value={startTime}
        disabled={allDay}
        onChange={(e) => onChange({ startTime: e.target.value })}
        aria-label="From time"
        className={cn(
          "rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30",
          allDay && "opacity-40",
        )}
      />
      <span className={cn("text-xs font-medium text-muted-foreground", allDay && "opacity-40")}>
        to
      </span>
      <input
        type="time"
        value={endTime}
        disabled={allDay}
        onChange={(e) => onChange({ endTime: e.target.value })}
        aria-label="To time"
        className={cn(
          "rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30",
          allDay && "opacity-40",
        )}
      />
      <AllDayToggle active={allDay} onToggle={() => onChange({ allDay: !allDay })} />
    </div>
  );
}

function AllDayToggle({ active, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary-soft text-primary"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {active ? <Sun className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
      All day
    </button>
  );
}

export function AddPollDatesForm({ existingOptions = [], onSubmit, saving }) {
  const existingKeys = useMemo(
    () => new Set(existingOptions.map(serverOptionKey)),
    [existingOptions],
  );

  const [dates, setDates] = useState([]);
  const [view, setView] = useState("calendar");
  const [sameTime, setSameTime] = useState(true);
  const [globalStartTime, setGlobalStartTime] = useState("");
  const [globalEndTime, setGlobalEndTime] = useState("");
  const [globalAllDay, setGlobalAllDay] = useState(true);
  const [error, setError] = useState(null);

  const addEmptyRow = () => setDates((rows) => [...rows, makeRow()]);
  const removeRow = (id) => setDates((rows) => rows.filter((r) => r.id !== id));
  const updateRow = (id, patch) =>
    setDates((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const addRangeFromCalendar = (start, end) =>
    setDates((rows) => [
      ...rows,
      makeRow({ date: start, endDate: end || "", isRange: Boolean(end) }),
    ]);

  const sortedDates = [...dates].sort((a, b) => (a.date || "").localeCompare(b.date || ""));

  const resolveTimeLabel = (row) => {
    const allDay = sameTime ? globalAllDay : row.allDay;
    if (allDay) return "All day";
    const start = sameTime ? globalStartTime : row.startTime;
    const end = sameTime ? globalEndTime : row.endTime;
    if (!start) return "Pick a time";
    return end ? `${start} – ${end}` : `From ${start}`;
  };

  const buildOptions = () =>
    dates
      .filter((r) => r.date)
      .map((r) => {
        const allDay = sameTime ? globalAllDay : r.allDay;
        const time = allDay ? null : sameTime ? globalStartTime : r.startTime;
        const endTime = allDay ? null : sameTime ? globalEndTime : r.endTime;
        const endDate = r.isRange && r.endDate ? r.endDate : null;
        return { date: r.date, endDate, time, endTime: endTime || null, allDay };
      });

  const validate = () => {
    const options = buildOptions();
    if (options.length === 0) return "Add at least one date";
    for (const opt of options) {
      if (existingKeys.has(buildOptionKey(opt))) {
        return "One or more dates are already in this poll";
      }
      if (opt.endDate && opt.endDate <= opt.date) {
        return "End date must be after start date";
      }
      if (!opt.allDay && !opt.time) {
        return 'Pick a start time or "All day" for every date';
      }
      if (!opt.allDay && opt.endTime && opt.endTime <= opt.time) {
        return "End time must be after start time";
      }
    }
    const keys = options.map(buildOptionKey);
    if (new Set(keys).size !== keys.length) {
      return "Remove duplicate dates before saving";
    }
    return null;
  };

  const resetForm = () => {
    setDates([]);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    try {
      await onSubmit(buildOptions());
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4 border-t border-border pt-4">
      <p className="text-xs text-muted-foreground">
        Existing responses are kept. Participants can vote on the new dates when you save.
      </p>

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={sameTime}
          onChange={(e) => setSameTime(e.target.checked)}
          className="mt-0.5 h-5 w-5 rounded-md accent-[oklch(0.557_0.224_277)]"
        />
        <span>
          <span className="text-sm font-semibold text-foreground">All new dates share the same time</span>
          <span className="block text-xs text-muted-foreground">
            Turn off to set the time individually per date
          </span>
        </span>
      </label>

      {sameTime && (
        <TimeRange
          startTime={globalStartTime}
          endTime={globalEndTime}
          allDay={globalAllDay}
          onChange={(patch) => {
            if ("startTime" in patch) setGlobalStartTime(patch.startTime);
            if ("endTime" in patch) setGlobalEndTime(patch.endTime);
            if ("allDay" in patch) setGlobalAllDay(patch.allDay);
          }}
        />
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">New dates</span>
        <div className="flex rounded-xl border border-border p-0.5">
          <ViewTab active={view === "calendar"} onClick={() => setView("calendar")} icon={CalendarDays}>
            Calendar
          </ViewTab>
          <ViewTab active={view === "list"} onClick={() => setView("list")} icon={List}>
            List
          </ViewTab>
        </div>
      </div>

      {view === "calendar" && (
        <>
          <DatePickerCalendar
            rows={dates}
            onAddRange={addRangeFromCalendar}
            onRemoveRow={removeRow}
          />
          {sortedDates.length > 0 && (
            <div className="space-y-2">
              {sortedDates.map((row) => (
                <div key={row.id} className="rounded-2xl border border-border bg-background p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-2 text-sm font-medium capitalize text-foreground">
                      {row.isRange && row.endDate ? (
                        <CalendarRange className="h-4 w-4 text-primary" />
                      ) : (
                        <CalendarDays className="h-4 w-4 text-primary" />
                      )}
                      {formatShort(row.date)}
                      {row.isRange && row.endDate ? ` – ${formatShort(row.endDate)}` : ""}
                    </span>
                    {sameTime && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {resolveTimeLabel(row)}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="ml-auto grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                      aria-label="Remove date"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {!sameTime && (
                    <div className="mt-3">
                      <TimeRange
                        startTime={row.startTime}
                        endTime={row.endTime}
                        allDay={row.allDay}
                        onChange={(patch) => updateRow(row.id, patch)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {view === "list" && (
        <>
          <div className="space-y-3">
            {dates.map((row) => (
              <div key={row.id} className="rounded-2xl border border-border bg-background p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="date"
                    value={row.date}
                    onChange={(e) => updateRow(row.id, { date: e.target.value })}
                    className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
                  />
                  {row.isRange && (
                    <>
                      <span className="text-xs font-medium text-muted-foreground">to</span>
                      <input
                        type="date"
                        value={row.endDate}
                        min={row.date || undefined}
                        onChange={(e) => updateRow(row.id, { endDate: e.target.value })}
                        className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
                      />
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      updateRow(row.id, {
                        isRange: !row.isRange,
                        endDate: row.isRange ? "" : row.endDate,
                      })
                    }
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                      row.isRange
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border bg-card text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <CalendarRange className="h-4 w-4" />
                    Multi-day
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="ml-auto grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                    aria-label="Remove date"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {!sameTime && (
                  <div className="mt-3">
                    <TimeRange
                      startTime={row.startTime}
                      endTime={row.endTime}
                      allDay={row.allDay}
                      onChange={(patch) => updateRow(row.id, patch)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addEmptyRow}
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Plus className="h-4 w-4" /> Add date
          </button>
        </>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" variant="secondary" size="sm" disabled={saving}>
        {saving ? "Adding dates..." : "Add dates to poll"}
      </Button>
    </form>
  );
}
