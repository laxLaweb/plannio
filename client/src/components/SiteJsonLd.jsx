import { useMemo } from "react";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, SITE_OWNER } from "@/lib/site";

/** Organization entity on every public page — helps search + AI entity recognition. */
export function SiteJsonLd() {
  const organizationSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Plannio",
      url: absoluteUrl("/"),
      description:
        "Free date polls for groups with built-in Discord and Slack channel updates.",
      founder: { "@type": "Organization", name: SITE_OWNER.name },
    }),
    [],
  );

  return <JsonLd id="plannio-organization-schema" data={organizationSchema} />;
}
