import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";
import { PageMeta } from "@/components/PageMeta";
import { UserAvatar } from "@/components/auth/UserAvatar";
import { useAuth } from "@/context/AuthContext";
import { deleteAccount } from "@/lib/api";

export function AccountPage() {
  const { user, loading, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete your account? This permanently removes your profile, your polls, and all your votes. This cannot be undone.",
    );
    if (!confirmed) return;

    setDeleting(true);
    setError(null);
    try {
      await deleteAccount();
      await refreshUser();
      navigate("/");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <PageMeta title="Account" noindex />
        <Navbar showNavLinks={false} />
        <div className="grid min-h-screen place-items-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <PageMeta title="Account" noindex />
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
      <PageMeta title="Account" noindex />
      <Navbar showNavLinks={false} />
      <div className="mx-auto max-w-2xl px-5 pb-10 pt-24 sm:px-8 sm:pt-28">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Account</h1>
        <p className="mt-2 text-muted-foreground">Your profile and your data.</p>

        <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-4">
            <UserAvatar user={user} className="h-14 w-14 rounded-2xl text-lg" />
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-foreground">{user.displayName}</p>
              {user.email && (
                <p className="truncate text-sm text-muted-foreground">{user.email}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-sm font-semibold text-foreground">Your data</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Download a copy of everything Plannio stores about you — profile, polls, and votes — as
            JSON. See our{" "}
            <Link to="/privacy" className="font-medium text-primary hover:underline">
              privacy policy
            </Link>{" "}
            for details.
          </p>
          <Button type="button" variant="outline" size="default" className="mt-4" asChild>
            <a href="/api/auth/export" download>
              <Download className="h-4 w-4" /> Download my data
            </a>
          </Button>
        </div>

        <div className="mt-6 rounded-3xl border border-destructive/30 bg-card p-6 shadow-soft">
          <h2 className="text-sm font-semibold text-destructive">Delete account</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Permanently deletes your profile, sign-in methods, all polls you created (including
            their votes), and every vote you cast. This cannot be undone.
          </p>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          <Button
            type="button"
            variant="outline"
            size="default"
            className="mt-4 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
            disabled={deleting}
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" /> {deleting ? "Deleting..." : "Delete my account"}
          </Button>
        </div>
      </div>
    </div>
  );
}
