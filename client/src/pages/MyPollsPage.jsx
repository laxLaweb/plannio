import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Check, Lock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";
import { CreatePollButton } from "@/components/polls/CreatePollButton";
import { PageMeta } from "@/components/PageMeta";
import { SiteLegalNote } from "@/components/SiteLegalNote";
import { useAuth } from "@/context/AuthContext";
import { listPolls } from "@/lib/api";

function formatCreatedAt(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export function MyPollsPage() {
  const { user, loading: authLoading } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !user) return;
    listPolls()
      .then(setPolls)
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
          Every poll you&apos;ve created, in one place.
        </p>

        {error && <p className="mt-6 text-sm text-destructive">{error}</p>}

        {!error && polls.length === 0 && (
          <div className="mt-8 rounded-3xl border border-border bg-card p-10 text-center shadow-soft">
            <p className="text-sm text-muted-foreground">
              You haven&apos;t created any polls yet.
            </p>
            <CreatePollButton variant="hero" size="lg" className="mt-6">
              Create your first poll
            </CreatePollButton>
          </div>
        )}

        {polls.length > 0 && (
          <div className="mt-8 space-y-3">
            {polls.map((poll) => (
              <Link
                key={poll.id}
                to={`/polls/${poll.id}`}
                className="block rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-foreground">{poll.title}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatCreatedAt(poll.created_at)}
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
                  {poll.locked_option_id ? (
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
                      <Lock className="h-3.5 w-3.5" /> Locked
                    </span>
                  ) : poll.expected_responses &&
                    poll.response_count >= poll.expected_responses ? (
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                      <Check className="h-3.5 w-3.5" /> Ready to lock
                    </span>
                  ) : (
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                      Open
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
        <SiteLegalNote className="mt-10" />
      </div>
    </div>
  );
}
