import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Check, Lock, Users, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";
import { CreatePollButton } from "@/components/polls/CreatePollButton";
import { PageMeta } from "@/components/PageMeta";
import { SiteLegalNote } from "@/components/SiteLegalNote";
import { useAuth } from "@/context/AuthContext";
import { listPolls, listVotedPolls } from "@/lib/api";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function PollStatusBadge({ poll, variant }) {
  if (poll.locked_option_id) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
        <Lock className="h-3.5 w-3.5" /> Locked
      </span>
    );
  }

  if (
    variant === "created" &&
    poll.expected_responses &&
    poll.response_count >= poll.expected_responses
  ) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
        <Check className="h-3.5 w-3.5" /> Ready to lock
      </span>
    );
  }

  if (variant === "voted") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
        <Vote className="h-3.5 w-3.5" /> Voted
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
      Open
    </span>
  );
}

function PollCard({ poll, to, dateLabel, dateValue, variant }) {
  return (
    <Link
      to={to}
      className="block rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-foreground">{poll.title}</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {dateLabel} {formatDate(dateValue)}
            </span>
            <span>
              {poll.option_count} {poll.option_count === 1 ? "date" : "dates"}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {poll.response_count}
              {poll.expected_responses ? ` / ${poll.expected_responses}` : ""} responded
            </span>
          </p>
        </div>
        <PollStatusBadge poll={poll} variant={variant} />
      </div>
    </Link>
  );
}

export function MyPollsPage() {
  const { user, loading: authLoading } = useAuth();
  const [createdPolls, setCreatedPolls] = useState([]);
  const [votedPolls, setVotedPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !user) return;
    Promise.all([listPolls(), listVotedPolls()])
      .then(([created, voted]) => {
        setCreatedPolls(created);
        setVotedPolls(voted);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen bg-background">
        <PageMeta title="My polls" noindex />
        <Navbar showNavLinks={false} />
        <div className="grid min-h-screen place-items-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <PageMeta title="My polls" noindex />
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

  const hasAnyPolls = createdPolls.length > 0 || votedPolls.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <PageMeta title="My polls" noindex />
      <Navbar showNavLinks={false} />
      <div className="mx-auto max-w-3xl px-5 pb-10 pt-24 sm:px-8 sm:pt-28">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">My polls</h1>
          <CreatePollButton variant="hero" size="sm">
            Create poll
          </CreatePollButton>
        </div>
        <p className="mt-2 text-muted-foreground">
          Polls you&apos;ve created and polls you&apos;ve voted on.
        </p>

        {error && <p className="mt-6 text-sm text-destructive">{error}</p>}

        {!error && !hasAnyPolls && (
          <div className="mt-8 rounded-3xl border border-border bg-card p-10 text-center shadow-soft">
            <p className="text-sm text-muted-foreground">
              You haven&apos;t created or voted on any polls yet.
            </p>
            <CreatePollButton variant="hero" size="lg" className="mt-6">
              Create your first poll
            </CreatePollButton>
          </div>
        )}

        {!error && (
          <>
            <section id="created" className="mt-10">
              <h2 className="text-lg font-bold text-foreground">Created by you</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your polls, share links, and lock a final date.
              </p>

              {createdPolls.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-border bg-card/50 px-5 py-8 text-center">
                  <p className="text-sm text-muted-foreground">No polls created yet.</p>
                  <CreatePollButton variant="outline" size="sm" className="mt-4">
                    Create poll
                  </CreatePollButton>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {createdPolls.map((poll) => (
                    <PollCard
                      key={poll.id}
                      poll={poll}
                      to={`/polls/${poll.id}`}
                      dateLabel="Created"
                      dateValue={poll.created_at}
                      variant="created"
                    />
                  ))}
                </div>
              )}
            </section>

            <section id="voted" className="mt-10">
              <h2 className="text-lg font-bold text-foreground">Polls you&apos;ve voted on</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Open a poll to view results or update your response.
              </p>

              {votedPolls.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-border bg-card/50 px-5 py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    When you vote on someone else&apos;s poll while signed in, it appears here.
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {votedPolls.map((poll) => (
                    <PollCard
                      key={poll.id}
                      poll={poll}
                      to={`/p/${poll.slug}`}
                      dateLabel="Voted"
                      dateValue={poll.last_voted_at}
                      variant="voted"
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        <SiteLegalNote className="mt-10" />
      </div>
    </div>
  );
}
