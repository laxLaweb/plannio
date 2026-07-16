import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useConsent } from "@/context/ConsentContext";

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let gaScriptLoaded = false;

function ensureGtag() {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
  return window.gtag;
}

/**
 * Loads gtag.js only after consent is granted. Nothing is sent to Google and
 * no analytics cookies are set before the user accepts.
 */
function loadGaScript() {
  if (gaScriptLoaded || !GA_ID) return;
  gaScriptLoaded = true;

  const gtag = ensureGtag();
  gtag("js", new Date());
  gtag("config", GA_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

/**
 * Google Analytics 4 with Consent Mode v2. GA stays fully disabled until the
 * visitor grants consent via the cookie banner.
 *
 * Also keeps optional cookieless Umami/Plausible support via VITE_ANALYTICS_SCRIPT.
 */
export function Analytics() {
  const { consent } = useConsent();
  const scriptSrc = import.meta.env.VITE_ANALYTICS_SCRIPT;
  const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;

  useEffect(() => {
    if (!GA_ID) return;
    const gtag = ensureGtag();
    gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
  }, []);

  useEffect(() => {
    if (!GA_ID || consent !== "granted") return;
    const gtag = ensureGtag();
    gtag("consent", "update", { analytics_storage: "granted" });
    loadGaScript();
  }, [consent]);

  if (!scriptSrc) return null;

  return (
    <script async defer data-website-id={websiteId || undefined} src={scriptSrc} />
  );
}

/** Sends page_view on SPA route changes (GA4 does not track these automatically). */
export function GoogleAnalyticsPageView() {
  const location = useLocation();
  const { consent } = useConsent();

  useEffect(() => {
    if (!GA_ID || consent !== "granted" || typeof window.gtag !== "function") return;

    window.gtag("config", GA_ID, {
      page_path: location.pathname + location.search + location.hash,
    });
  }, [location, consent]);

  return null;
}
