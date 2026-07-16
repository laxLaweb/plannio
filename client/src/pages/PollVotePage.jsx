import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, CalendarRange, Check, Lock, Sun, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";
import { PageMeta } from "@/components/PageMeta";
import { DiscordIcon, SlackIcon, startDiscordLogin, startSlackLogin } from "@/components/auth/LoginOptions";
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
  const [responseMode, setResponseMode] = useState("create");
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

  const voteTitle = poll ? `Vote: ${poll.title}` : "Vote";
  const votePath = slug ? `/p/${slug}` : null;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <PageMeta title="Vote" description="Pick the dates that work for you." path={votePath} />
        <Navbar showNavLinks={false} />
        <div className="grid min-h-screen place-items-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error && !poll) {
    return (
      <div className="min-h-screen bg-background">
        <PageMeta title="Vote" description="Pick the dates that work for you." path={votePath} />
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
      <PageMeta
        title={voteTitle}
        description="Pick the dates that work for you."
        path={votePath}
      />
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

        {showLoginGate && (
          <div className="mt-8 rounded-3xl border border-border bg-card p-8 text-center shadow-card">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#5865F2]/10 text-[#5865F2]">
              <DiscordIcon />
            </div>
            <h2 className="mt-4 text-lg font-bold text-foreground">Sign in to vote</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              The creator requires login. Sign in with Discord or Slack to mark which dates work for
              you.
            </p>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => startDiscordLogin(`/p/${slug}`)}
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#5865F2] px-5 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-[#4752C4]"
              >
                <DiscordIcon />
                Continue with Discord
              </button>
              <button
                type="button"
                onClick={() => startSlackLogin(`/p/${slug}`)}
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-5 py-3.5 text-sm font-semibold text-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:bg-secondary"
              >
                <SlackIcon />
                Continue with Slack
              </button>
            </div>
          </div>
        )}

        <div
          className={cn(
            "rounded-3xl border border-border bg-card p-6 shadow-soft",
            showLoginGate ? "mt-6" : "mt-8",
          )}
        >
          {canVote && !requiresLogin && (
                <div className="mb-5">
                  {anonymousVoters.length > 0 ? (
                    <>
                      <label className="text-sm font-semibold text-foreground">Response</label>
                      <select
                        value={responseMode}
                        onChange={(e) => {
                          const mode = e.target.value;
                          setResponseMode(mode);
                          setError(null);
                          setSaved(false);
                          if (mode === "create") {
                            setVoterName("");
                            setSelected([]);
                          }
                        }}
                        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
                      >
                        <option value="create">Create new user response</option>
                        <option value="edit">Edit response</option>
                      </select>

                      {responseMode === "create" ? (
                        <div className="mt-4">
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
                      ) : (
                        <div className="mt-4">
                          <label className="text-sm font-semibold text-foreground">Person</label>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Pick a person who voted without logging in to update their answer.
                          </p>
                          <select
                            value={voterName}
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
                    </>
                  ) : (
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
                  )}
                </div>
              )}

            <h2 className="text-sm font-semibold text-foreground">
              {canVote ? "Which dates work for you?" : isLocked ? "Final results" : "Results"}
            </h2>
            {canVote && (
              <p className="mt-1 text-xs text-muted-foreground">
                Select all the times that work
                {!requiresLogin && responseMode === "edit" ? " for the person above" : " for you"}.
              </p>
            )}

            <div className="mt-4 space-y-2.5">
              {poll.options.map((opt) => {
                const active = selected.includes(opt.id);
                const pct = totalVoters ? Math.round((opt.vote_count / totalVoters) * 100) : 0;
                const isWinner = isLocked && opt.id === poll.locked_option_id;
                const Row = canVote ? "button" : "div";

                return (
                  <Row
                    key={opt.id}
                    type={canVote ? "button" : undefined}
                    onClick={canVote ? () => toggle(opt.id) : undefined}
                    className={cn(
                      "block w-full rounded-2xl border p-3.5 text-left transition-colors",
                      active
                        ? "border-primary bg-primary-soft"
                        : isWinner
                          ? "border-success/40 bg-success/10"
                          : "border-border bg-background",
                      canVote && !active && "cursor-pointer hover:border-primary/40",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {canVote && (
                        <span
                          className={cn(
                            "grid h-6 w-6 shrink-0 place-items-center rounded-md border transition-colors",
                            active ? "border-primary bg-primary text-white" : "border-border",
                          )}
                        >
                          {active && <Check className="h-4 w-4" />}
                        </span>
                      )}
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                        {isRange(opt) ? (
                          <CalendarRange className="h-5 w-5" />
                        ) : opt.all_day ? (
                          <Sun className="h-5 w-5" />
                        ) : (
                          <Calendar className="h-5 w-5" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="block truncate text-sm font-semibold capitalize text-foreground">
                            {optionDateLabel(opt)}
                          </span>
                          <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                            {opt.vote_count}
                            {poll.expected_responses ? ` / ${poll.expected_responses}` : ""}
                          </span>
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {optionTimeLabel(opt)}
                        </span>
                      </span>
                    </div>

                    <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          isWinner ? "bg-success" : "bg-primary",
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    {opt.voters?.length > 0 && (
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {opt.voters.length} voted:
                        </span>{" "}
                        {opt.voters.join(", ")}
                      </p>
                    )}
                  </Row>
                );
              })}
            </div>

            {canVote && (
              <>
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

                <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
                  {poll.hide_voter_names
                    ? "Your response is shared with the poll creator"
                    : "Your name and response are visible to everyone with this link"}
                  {" "}and may be posted to the group&apos;s Discord or Slack channel if the creator
                  connected one. See our{" "}
                  <Link to="/privacy" className="font-medium underline hover:text-foreground">
                    privacy policy
                  </Link>
                  .
                </p>
              </>
            )}
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
