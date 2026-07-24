import { absoluteUrl } from "@/lib/site";

/** Google-compatible BreadcrumbList — every ListItem must include item (@id). */
export function buildBreadcrumbSchema(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: {
        "@type": "WebPage",
        "@id": absoluteUrl(crumb.path),
        name: crumb.label,
      },
    })),
  };
}
