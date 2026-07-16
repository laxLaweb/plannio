import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useConsent } from "@/context/ConsentContext";

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function CookieBanner() {
  const { consent, acceptAll, rejectAll } = useConsent();

  if (!GA_ID) return null;
  if (consent) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-border bg-card/95 p-5 shadow-float backdrop-blur-xl sm:flex-row sm:items-center sm:gap-6">
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          We use a strictly necessary cookie to keep you signed in. With your consent we also
          use Google Analytics cookies to understand how the site is used. See our{" "}
          <Link to="/privacy" className="font-medium text-primary hover:underline">
            privacy policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={rejectAll}>
            Decline
          </Button>
          <Button variant="hero" size="sm" onClick={acceptAll}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
