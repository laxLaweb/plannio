import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { loginWithPassword, registerWithPassword } from "@/lib/api";

export { POST_LOGIN_REDIRECT_KEY } from "./constants";
import { POST_LOGIN_REDIRECT_KEY } from "./constants";

export function DiscordIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 12.3 12.3 0 0 0-.608 1.25 18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export function SlackIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#E01E5A"
        d="M8.9 15.1a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-9.2a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
      />
      <path
        fill="#36C5F0"
        d="M5.9 8.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9.2 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
      />
      <path
        fill="#2EB67D"
        d="M15.1 8.9a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-9.2 9.2a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
      />
      <path
        fill="#ECB22E"
        d="M8.9 15.1a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm0-9.2a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z"
      />
      <rect x="8.4" y="1.5" width="3" height="8" rx="1.5" fill="#36C5F0" />
      <rect x="12.6" y="14.5" width="3" height="8" rx="1.5" fill="#2EB67D" />
      <rect x="14.5" y="8.4" width="8" height="3" rx="1.5" fill="#ECB22E" />
      <rect x="1.5" y="12.6" width="8" height="3" rx="1.5" fill="#E01E5A" />
    </svg>
  );
}

export function startDiscordLogin(redirectTo) {
  if (redirectTo) {
    sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, redirectTo);
  }
  window.location.href = "/api/auth/discord";
}

export function startSlackLogin(redirectTo) {
  if (redirectTo) {
    sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, redirectTo);
  }
  window.location.href = "/api/auth/slack";
}

function ProviderButton({ children, disabled, onClick, className }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} className={className}>
      {children}
    </button>
  );
}

function PasswordAuthForm({ redirectTo }) {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === "register";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isRegister) {
        await registerWithPassword({ email, password, displayName });
      } else {
        await loginWithPassword({ email, password });
      }
      await refreshUser();
      navigate(redirectTo);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {isRegister && (
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display name"
          autoComplete="name"
          required
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
        />
      )}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        autoComplete="email"
        required
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoComplete={isRegister ? "new-password" : "current-password"}
        required
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "Please wait..." : isRegister ? "Create account" : "Log in"}
      </Button>

      <button
        type="button"
        onClick={() => {
          setMode(isRegister ? "login" : "register");
          setError(null);
        }}
        className="w-full text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        {isRegister ? "Already have an account? Log in" : "Don't have an account? Create one"}
      </button>
    </form>
  );
}

export function LoginOptions({ redirectTo = "/polls/new" }) {
  return (
    <div className="space-y-3">
      <ProviderButton
        onClick={() => startDiscordLogin(redirectTo)}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#5865F2] px-5 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-[#4752C4]"
      >
        <DiscordIcon />
        Continue with Discord
      </ProviderButton>

      <ProviderButton
        onClick={() => startSlackLogin(redirectTo)}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-5 py-3.5 text-sm font-semibold text-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:bg-secondary"
      >
        <SlackIcon />
        Continue with Slack
      </ProviderButton>

      {/* Continue with Google — temporarily disabled
      <ProviderButton
        disabled
        className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-border bg-card px-5 py-3.5 text-sm font-semibold text-muted-foreground opacity-60"
      >
        Continue with Google
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium">Soon</span>
      </ProviderButton>
      */}

      {/* Continue with Apple — temporarily disabled
      <ProviderButton
        disabled
        className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-border bg-card px-5 py-3.5 text-sm font-semibold text-muted-foreground opacity-60"
      >
        Continue with Apple
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium">Soon</span>
      </ProviderButton>
      */}

      <div className="flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <PasswordAuthForm redirectTo={redirectTo} />
    </div>
  );
}
