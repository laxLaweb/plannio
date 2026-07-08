import { absoluteUrl, SITE_URL } from "@/lib/site";

const DEFAULT_DESCRIPTION =
  "Free date polls for groups. Pick dates in a calendar, share one link, and get updates in Discord and Slack when people respond. No account needed to vote.";

export function PageMeta({
  title,
  description,
  path,
  noindex = false,
  ogType = "website",
}) {
  const fullTitle = title
    ? `${title} | Plannio`
    : "Plannio – Find the time everyone says yes to";
  const metaDescription = description ?? (path === "/" ? DEFAULT_DESCRIPTION : undefined);
  const canonicalUrl = path != null ? absoluteUrl(path) : undefined;
  const ogImage = `${SITE_URL}/og-image.png`;

  return (
    <>
      <title>{fullTitle}</title>
      {metaDescription && <meta name="description" content={metaDescription} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        path != null && <meta name="robots" content="index, follow" />
      )}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Plannio" />
      <meta property="og:title" content={fullTitle} />
      {metaDescription && <meta property="og:description" content={metaDescription} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {metaDescription && <meta name="twitter:description" content={metaDescription} />}
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}
