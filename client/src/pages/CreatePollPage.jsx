import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2, Clock, Sun, CalendarRange, List, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";
import { DatePickerCalendar } from "@/components/polls/DatePickerCalendar";
import { ChannelUpdates } from "@/components/polls/ChannelUpdates";
import { useAuth } from "@/context/AuthContext";
import { createPoll } from "@/lib/api";
import { cn } from "@/lib/utils";

const DRAFT_KEY = "plannio_draft_poll";

function loadDraft() {
  try {
    return JSON.parse(sessionStorage.getItem(DRAFT_KEY)) || {};
  } catch {
    return {};
  }
}

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
    allDay: false,
    ...patch,
  };
}

function formatShort(dateIso) {
  if (!dateIso) return "";
  const date = new Date(`${dateIso}T00:00:00`);
  return date.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
}

export function CreatePollPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const draft = useMemo(() => {
    const stored = loadDraft();
    if (Array.isArray(stored.dates) && stored.dates.length) {
      rowSeq = Math.max(rowSeq, ...stored.dates.map((r) => r.id || 0));
    }
    return stored;
  }, []);

  const [title, setTitle] = useState(draft.title || "");
  const [description, setDescription] = useState(draft.description || "");
  const [sameTime, setSameTime] = useState(draft.sameTime ?? true);
  const [globalStartTime, setGlobalStartTime] = useState(draft.globalStartTime || "");
  const [globalEndTime, setGlobalEndTime] = useState(draft.globalEndTime || "");
  const [globalAllDay, setGlobalAllDay] = useState(draft.globalAllDay ?? false);
  const [dates, setDates] = useState(draft.dates || []);
  const [view, setView] = useState(draft.view || "calendar");
  const [requireLogin, setRequireLogin] = useState(draft.requireLogin ?? false);
  const [channels, setChannels] = useState({
    discord: { enabled: false, events: [] },
    slack: { enabled: false, events: [] },
    expectedResponses: null,
    reminders: [],
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChannelsChange = useCallback((next) => setChannels(next), []);

  useEffect(() => {
    const payload = {
      title,
      description,
      sameTime,
      globalStartTime,
      globalEndTime,
      globalAllDay,
      dates,
      view,
      requireLogin,
    };
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  }, [title, description, sameTime, globalStartTime, globalEndTime, globalAllDay, dates, view, requireLogin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showNavLinks={false} />
        <div className="grid min-h-screen place-items-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showNavLinks={false} />
        <div className="grid min-h-screen place-items-center px-5">
          <div className="max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-card">
            <h1 className="text-xl font-bold text-foreground">Login required</h1>
            <p className="mt-2 text-muted-foreground">You must be signed in to create a poll.</p>
            <Button variant="hero" size="lg" className="mt-6 w-full" asChild>
              <Link to="/login">Go to login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
    if (!title.trim()) return "Give the event a name";
    const options = buildOptions();
    if (options.length === 0) return "Add at least one date";
    for (const opt of options) {
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
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSaving(true);
    try {
      const poll = await createPoll({
        title: title.trim(),
        description: description.trim() || undefined,
        options: buildOptions(),
        discord: channels.discord.enabled
          ? { enabled: true, events: channels.discord.events }
          : undefined,
        slack: channels.slack.enabled
          ? { enabled: true, events: channels.slack.events }
          : undefined,
        reminders: channels.reminders,
        expectedResponses: channels.expectedResponses ?? undefined,
        requireLogin,
      });
      sessionStorage.removeItem(DRAFT_KEY);
      navigate(`/polls/${poll.id}`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar showNavLinks={false} />
      <div className="mx-auto max-w-3xl px-5 pb-10 pt-24 sm:px-8 sm:pt-28">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Create new poll</h1>
        <p className="mt-2 text-muted-foreground">
          Propose some dates so participants can vote on the best time.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <label className="text-sm font-semibold text-foreground">Event name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekend trip or Q2 Product Sync"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
            />

            <label className="mt-5 block text-sm font-semibold text-foreground">
              Description <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Short description of the event"
              className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
            />

            <label className="mt-5 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={requireLogin}
                onChange={(e) => setRequireLogin(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded-md accent-[oklch(0.557_0.224_277)]"
              />
              <span>
                <span className="text-sm font-semibold text-foreground">
                  Require login to vote
                </span>
                <span className="block text-xs text-muted-foreground">
                  Turn off to let participants vote with just a name — and edit responses from people
                  who were not logged in.
                </span>
              </span>
            </label>
          </div>

          <ChannelUpdates onChange={handleChannelsChange} earliestDate={sortedDates[0]?.date || null} />

          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={sameTime}
                onChange={(e) => setSameTime(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded-md accent-[oklch(0.557_0.224_277)]"
              />
              <span>
                <span className="text-sm font-semibold text-foreground">
                  All dates share the same time
                </span>
                <span className="block text-xs text-muted-foreground">
                  Turn off to set the time individually per date
                </span>
              </span>
            </label>

            {sameTime && (
              <div className="mt-4">
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
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Dates</h2>
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
              <div className="mt-4">
                <DatePickerCalendar
                  rows={dates}
                  onAddRange={addRangeFromCalendar}
                  onRemoveRow={removeRow}
                />

                {sortedDates.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {sortedDates.map((row) => (
                      <div
                        key={row.id}
                        className="rounded-2xl border border-border bg-background p-3"
                      >
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
              </div>
            )}

            {view === "list" && (
              <div className="mt-4">
                <div className="space-y-3">
                  {dates.map((row) => (
                    <div
                      key={row.id}
                      className="rounded-2xl border border-border bg-background p-3"
                    >
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
                            updateRow(row.id, { isRange: !row.isRange, endDate: row.isRange ? "" : row.endDate })
                          }
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                            row.isRange
                              ? "border-primary bg-primary-soft text-primary"
                              : "border-border bg-card text-muted-foreground hover:text-foreground",
                          )}
                          title="Select multiple days (range)"
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
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Plus className="h-4 w-4" /> Add date
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" size="lg" asChild>
              <Link to="/">Cancel</Link>
            </Button>
            <Button type="submit" variant="hero" size="lg" disabled={saving}>
              {saving ? "Saving..." : "Save poll"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
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
      <span className={cn("text-xs font-medium text-muted-foreground", allDay && "opacity-40")}>to</span>
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
