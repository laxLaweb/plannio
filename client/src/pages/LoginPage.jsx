import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";
import { LoginOptions } from "@/components/auth/LoginOptions";
import { UserAvatar } from "@/components/auth/UserAvatar";
import { useAuth } from "@/context/AuthContext";

export function LoginPage() {
  const { user } = useAuth();
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");

  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar showNavLinks={false} />
        <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5 py-16">
          <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-card">
            <UserAvatar
              user={user}
              className="mx-auto h-16 w-16 rounded-full border-2 border-background text-xl shadow-soft"
            />
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
              Welcome, {user.displayName}
            </h1>
            <p className="mt-2 text-muted-foreground">You are already signed in.</p>
            <Button variant="hero" size="lg" className="mt-6 w-full" asChild>
              <Link to="/">Go to home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar showNavLinks={false} />
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] [background:var(--gradient-hero)]" />

      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Sign in to Plannio
        </h1>
        <p className="mt-3 text-muted-foreground">
          Create and manage date polls. Sign in with Discord, or with your email and password.
        </p>

        {error && (
          <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mt-8">
          <LoginOptions redirectTo="/polls/new" />
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
          By signing in you accept our terms. We only use your name and profile picture to identify
          you in Plannio.
        </p>
      </div>
    </div>
  );
}
