import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function initGtag(measurementId) {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };
  window.gtag("js", new Date());
  window.gtag("config", measurementId);
}

/**
 * Google Analytics 4 — set VITE_GA_MEASUREMENT_ID (e.g. G-XXXXXXXXXX).
 * Umami/Plausible — set VITE_ANALYTICS_SCRIPT + optional VITE_ANALYTICS_WEBSITE_ID.
 */
export function Analytics() {
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const scriptSrc = import.meta.env.VITE_ANALYTICS_SCRIPT;
  const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;

  useEffect(() => {
    if (!gaId) return;

    initGtag(gaId);

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [gaId]);

  if (!scriptSrc) return null;

  return (
    <script async defer data-website-id={websiteId || undefined} src={scriptSrc} />
  );
}

/** Sends page_view on SPA route changes (GA4 does not track these automatically). */
export function GoogleAnalyticsPageView() {
  const location = useLocation();
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!gaId || typeof window.gtag !== "function") return;

    window.gtag("config", gaId, {
      page_path: location.pathname + location.search + location.hash,
    });
  }, [location, gaId]);

  return null;
}
