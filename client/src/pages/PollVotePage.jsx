import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, CalendarRange, Check, Lock, Sun, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";
import { DiscordIcon, startDiscordLogin } from "@/components/auth/LoginOptions";
import { useAuth } from "@/context/AuthContext";
import { getPublicPoll, submitVote } from "@/lib/api";
import { cn } from "@/lib/utils";

function formatDate(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });
}

function formatTime(timeStr) {
  return timeStr ? timeStr.slice(0, 5) : null;
}

function isRange(opt) {
  return opt.end_date && opt.end_date !== opt.option_date;
}

function optionDateLabel(opt) {
  if (isRange(opt)) {
    return `${formatDate(opt.option_date)} – ${formatDate(opt.end_date)}`;
  }
  return formatDate(opt.option_date);
}

function optionTimeLabel(opt) {
  if (opt.all_day) return "All day";
  if (opt.end_time) return `${formatTime(opt.start_time)} – ${formatTime(opt.end_time)}`;
  return formatTime(opt.start_time);
}

function voteNameKey(slug) {
  return `plannio_vote_name_${slug}`;
}

export function PollVotePage() {
  const { slug } = useParams();
  const { user, loading: authLoading } = useAuth();

  const [poll, setPoll] = useState(null);
  const [anonymousVoters, setAnonymousVoters] = useState([]);
  const [voterName, setVoterName] = useState("");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const requiresLogin = poll?.require_login !== false;

  const loadVotesForName = async (name) => {
    const data = await getPublicPoll(slug, name || undefined);
    setPoll(data.poll);
    setAnonymousVoters(data.anonymousVoters || []);
    setSelected(data.myVotes || []);
    setSaved((data.myVotes || []).length > 0);
  };

  useEffect(() => {
    if (authLoading) return;

    const storedName = sessionStorage.getItem(voteNameKey(slug)) || "";
    if (storedName) setVoterName(storedName);

    setLoading(true);
    getPublicPoll(slug, storedName || undefined)
      .then((data) => {
        setPoll(data.poll);
        setAnonymousVoters(data.anonymousVoters || []);
        setSelected(data.myVotes || []);
        setSaved((data.myVotes || []).length > 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug, user, authLoading]);

  const totalVoters = useMemo(() => poll?.response_count ?? 0, [poll]);
  const lockedOption = useMemo(
    () => poll?.options?.find((opt) => opt.id === poll.locked_option_id) || null,
    [poll],
  );

  const toggle = (id) => {
    setSaved(false);
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSelectExistingVoter = async (name) => {
    setVoterName(name);
    setError(null);
    setLoading(true);
    try {
      await loadVotesForName(name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = { optionIds: selected };
      if (!requiresLogin) {
        if (!voterName.trim()) {
          throw new Error("Enter a name");
        }
        payload.voterName = voterName.trim();
        sessionStorage.setItem(voteNameKey(slug), voterName.trim());
      }

      const data = await submitVote(slug, payload);
      setPoll(data.poll);
      setAnonymousVoters(data.anonymousVoters || []);
      setSelected(data.myVotes || []);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const isLocked = Boolean(poll?.locked_option_id);
  const showLoginGate = !isLocked && requiresLogin && !user;
  const canVote = !isLocked && (requiresLogin ? Boolean(user) : true);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showNavLinks={false} />
        <div className="grid min-h-screen place-items-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error && !poll) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showNavLinks={false} />
        <div className="grid min-h-screen place-items-center px-5">
          <div className="max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-card">
            <h1 className="text-xl font-bold text-foreground">Poll not found</h1>
            <p className="mt-2 text-muted-foreground">{error}</p>
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
      <Navbar showNavLinks={false} />
      <div className="mx-auto max-w-2xl px-5 pb-10 pt-24 sm:px-8 sm:pt-28">
        <div className="flex items-center justify-end">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Users className="h-4 w-4" />
            {totalVoters}
            {poll.expected_responses ? ` / ${poll.expected_responses}` : ""} responded
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">{poll.title}</h1>
        {poll.description && <p className="mt-2 text-muted-foreground">{poll.description}</p>}

        {poll.expected_responses && totalVoters >= poll.expected_responses && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-success/15 px-3 py-1 text-sm font-semibold text-success">
            <Check className="h-4 w-4" /> Everyone has responded
          </div>
        )}

        {lockedOption && (
          <div className="mt-4 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm font-semibold text-success">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 shrink-0" />
              Final date: {optionDateLabel(lockedOption)} · {optionTimeLabel(lockedOption)}
            </div>
            <p className="mt-1 text-xs font-normal text-success/80">
              This poll is locked — new responses are no longer accepted.
            </p>
          </div>
        )}

        {showLoginGate ? (
          <div className="mt-8 rounded-3xl border border-border bg-card p-8 text-center shadow-card">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#5865F2]/10 text-[#5865F2]">
              <DiscordIcon />
            </div>
            <h2 className="mt-4 text-lg font-bold text-foreground">Sign in to vote</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              The creator requires login. Sign in with Discord to mark which dates work for you.
            </p>
            <button
              type="button"
              onClick={() => startDiscordLogin(`/p/${slug}`)}
              className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#5865F2] px-5 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-[#4752C4]"
            >
              <DiscordIcon />
              Continue with Discord
            </button>
          </div>
        ) : (
          canVote && (
            <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft">
              {!requiresLogin && (
                <div className="mb-5 space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground">Your name</label>
                    <input
                      type="text"
                      value={voterName}
                      onChange={(e) => {
                        setVoterName(e.target.value);
                        setSaved(false);
                      }}
                      placeholder="e.g. Alex"
                      className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
                    />
                  </div>

                  {anonymousVoters.length > 0 && (
                    <div>
                      <label className="text-sm font-semibold text-foreground">
                        Edit someone else&apos;s response
                      </label>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Pick a person who voted without logging in to update their answer.
                      </p>
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) handleSelectExistingVoter(e.target.value);
                        }}
                        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
                      >
                        <option value="">Select person...</option>
                        {anonymousVoters.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              <h2 className="text-sm font-semibold text-foreground">Which dates work for you?</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Select all the times that work{!requiresLogin ? " for the person above" : " for you"}.
              </p>

              <div className="mt-4 space-y-2.5">
                {poll.options.map((opt) => {
                  const active = selected.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggle(opt.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors",
                        active
                          ? "border-primary bg-primary-soft"
                          : "border-border bg-background hover:border-primary/40",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-6 w-6 shrink-0 place-items-center rounded-md border transition-colors",
                          active ? "border-primary bg-primary text-white" : "border-border",
                        )}
                      >
                        {active && <Check className="h-4 w-4" />}
                      </span>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                        {isRange(opt) ? (
                          <CalendarRange className="h-5 w-5" />
                        ) : opt.all_day ? (
                          <Sun className="h-5 w-5" />
                        ) : (
                          <Calendar className="h-5 w-5" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold capitalize text-foreground">
                          {optionDateLabel(opt)}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {optionTimeLabel(opt)}
                          {opt.vote_count > 0 && ` · ${opt.vote_count} available`}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

              <Button
                type="button"
                variant="hero"
                size="lg"
                className="mt-6 w-full"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Saving..." : saved ? "Update response" : "Save response"}
              </Button>

              {saved && !saving && (
                <p className="mt-3 flex items-center justify-center gap-1.5 text-sm font-medium text-success">
                  <Check className="h-4 w-4" /> Response saved
                </p>
              )}
            </div>
          )
        )}

        <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-sm font-semibold text-foreground">
            {isLocked ? "Final results" : "Results"}
          </h2>
          <div className="mt-4 space-y-3">
            {poll.options.map((opt) => (
              <div key={opt.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium capitalize text-foreground">{optionDateLabel(opt)}</span>
                  <span className="text-muted-foreground">{opt.vote_count}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width: totalVoters ? `${(opt.vote_count / totalVoters) * 100}%` : "0%",
                    }}
                  />
                </div>
                {opt.voters?.length > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">{opt.voters.join(", ")}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Plannio
        </Link>
      </div>
    </div>
  );
}
