import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Bell, Calendar, CalendarRange, Check, Copy, Lock, Sun, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";
import { PageMeta } from "@/components/PageMeta";
import { SiteLegalNote } from "@/components/SiteLegalNote";
import { useAuth } from "@/context/AuthContext";
import { deletePoll, getPoll, lockPollOption, sendPollReminder } from "@/lib/api";
import { cn } from "@/lib/utils";

function formatDate(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatTime(timeStr) {
  return timeStr ? timeStr.slice(0, 5) : null;
}

function isRange(opt) {
  return opt.end_date && opt.end_date !== opt.option_date;
}

function formatOptionDate(opt) {
  if (isRange(opt)) {
    return `${formatDate(opt.option_date)} – ${formatDate(opt.end_date)}`;
  }
  return formatDate(opt.option_date);
}

export function PollDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [locking, setLocking] = useState(false);
  const [lockError, setLockError] = useState(null);
  const [reminding, setReminding] = useState(false);
  const [reminderMessage, setReminderMessage] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    if (authLoading || !user) return;
    getPoll(id)
      .then(setPoll)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, user, authLoading]);

  const shareUrl = poll ? `${window.location.origin}/p/${poll.slug}` : "";

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLock = async (optionId) => {
    setLocking(true);
    setLockError(null);
    try {
      const updated = await lockPollOption(id, optionId);
      setPoll(updated);
    } catch (err) {
      setLockError(err.message);
    } finally {
      setLocking(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete this poll? All responses will be permanently removed. This cannot be undone.",
    );
    if (!confirmed) return;

    setDeleting(true);
    setDeleteError(null);
    try {
      await deletePoll(id);
      navigate("/polls");
    } catch (err) {
      setDeleteError(err.message);
      setDeleting(false);
    }
  };

  const handleRemind = async () => {
    setReminding(true);
    setReminderMessage(null);
    try {
      await sendPollReminder(id);
      setReminderMessage({ type: "success", text: "Reminder sent." });
    } catch (err) {
      setReminderMessage({ type: "error", text: err.message });
    } finally {
      setReminding(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <PageMeta title="Poll" noindex />
        <Navbar showNavLinks={false} />
        <div className="grid min-h-screen place-items-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <PageMeta title="Poll" noindex />
        <Navbar showNavLinks={false} />
        <div className="grid min-h-screen place-items-center px-5">
          <div className="max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-card">
            <h1 className="text-xl font-bold text-foreground">Login required</h1>
            <Button variant="hero" size="lg" className="mt-6 w-full" asChild>
              <Link to="/login">Go to login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="min-h-screen bg-background">
        <PageMeta title="Poll" noindex />
        <Navbar showNavLinks={false} />
        <div className="grid min-h-screen place-items-center px-5">
          <div className="max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-card">
            <h1 className="text-xl font-bold text-foreground">Poll not found</h1>
            <p className="mt-2 text-muted-foreground">{error || "Try again"}</p>
            <Button variant="hero" size="lg" className="mt-6 w-full" asChild>
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageMeta title={poll.title} noindex />
      <Navbar showNavLinks={false} />
      <div className="mx-auto max-w-3xl px-5 pb-10 pt-24 sm:px-8 sm:pt-28">
        <div className="inline-flex items-center gap-2 rounded-full bg-success/15 px-3 py-1 text-sm font-semibold text-success">
          <Check className="h-4 w-4" /> Poll created
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">{poll.title}</h1>
        {poll.description && <p className="mt-2 text-muted-foreground">{poll.description}</p>}

        {poll.locked_option_id && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-success/15 px-3 py-1 text-sm font-semibold text-success">
            <Lock className="h-4 w-4" /> Final date locked
          </div>
        )}

        {(poll.expected_responses || poll.discord_connected || poll.slack_connected) &&
        !poll.locked_option_id ? (
          <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
            {poll.expected_responses ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">Responses</h2>
                  <span className="text-sm font-semibold text-foreground">
                    {poll.response_count ?? 0} / {poll.expected_responses}
                  </span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        ((poll.response_count ?? 0) / poll.expected_responses) * 100,
                      )}%`,
                    }}
                  />
                </div>
              </>
            ) : (
              <h2 className="text-sm font-semibold text-foreground">Responses</h2>
            )}
            {poll.expected_responses && (poll.response_count ?? 0) >= poll.expected_responses ? (
              <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-success">
                <Check className="h-4 w-4" /> Everyone has responded
              </p>
            ) : (
              (poll.discord_connected || poll.slack_connected) && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={reminding}
                    onClick={handleRemind}
                  >
                    <Bell className="h-4 w-4" />
                    {reminding ? "Sending…" : "Send reminder now"}
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Nudges anyone who hasn&apos;t voted yet, in{" "}
                    {poll.discord_connected && poll.slack_connected
                      ? "Discord and Slack"
                      : poll.discord_connected
                        ? "Discord"
                        : "Slack"}
                    .
                  </span>
                </div>
              )
            )}
            {reminderMessage && (
              <p
                className={cn(
                  "mt-2 text-sm font-medium",
                  reminderMessage.type === "success" ? "text-success" : "text-destructive",
                )}
              >
                {reminderMessage.text}
              </p>
            )}
          </div>
        ) : null}

        <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-sm font-semibold text-foreground">Share link</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Send this link to participants so they can vote.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <code className="flex-1 truncate rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground">
              {shareUrl}
            </code>
            <Button type="button" variant="outline" size="default" onClick={copyLink}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-sm font-semibold text-foreground">Proposed times</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Pick the final date once everyone has responded.
          </p>
          <div className="mt-4 space-y-2.5">
            {poll.options.map((opt) => {
              const isLocked = poll.locked_option_id === opt.id;
              return (
                <div
                  key={opt.id}
                  className={cn(
                    "flex flex-wrap items-center gap-3 rounded-2xl border p-3.5",
                    isLocked ? "border-success bg-success/5" : "border-border bg-background",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                      isLocked ? "bg-success/15 text-success" : "bg-primary-soft text-primary",
                    )}
                  >
                    {isLocked ? (
                      <Lock className="h-5 w-5" />
                    ) : isRange(opt) ? (
                      <CalendarRange className="h-5 w-5" />
                    ) : opt.all_day ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Calendar className="h-5 w-5" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold capitalize text-foreground">
                      {formatOptionDate(opt)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {opt.all_day
                        ? "All day"
                        : opt.end_time
                          ? `${formatTime(opt.start_time)} – ${formatTime(opt.end_time)}`
                          : formatTime(opt.start_time)}
                      {" · "}
                      {opt.vote_count} {opt.vote_count === 1 ? "response" : "responses"}
                    </p>
                    {opt.voters?.length > 0 && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {opt.voters.join(", ")}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant={isLocked ? "outline" : "secondary"}
                    size="sm"
                    disabled={locking}
                    onClick={() => handleLock(isLocked ? null : opt.id)}
                  >
                    {isLocked ? "Unlock" : "Lock this date"}
                  </Button>
                </div>
              );
            })}
          </div>
          {lockError && <p className="mt-3 text-sm text-destructive">{lockError}</p>}
        </div>

        <div className="mt-6 rounded-3xl border border-destructive/30 bg-card p-6 shadow-soft">
          <h2 className="text-sm font-semibold text-destructive">Delete poll</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Permanently removes the poll and every response. This cannot be undone.
          </p>
          {deleteError && <p className="mt-3 text-sm text-destructive">{deleteError}</p>}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
            disabled={deleting}
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" /> {deleting ? "Deleting..." : "Delete poll"}
          </Button>
        </div>
        <SiteLegalNote className="mt-10" />
      </div>
    </div>
  );
}
