/**
 * Optional privacy-friendly analytics. Renders nothing until VITE_ANALYTICS_SCRIPT is set.
 * Add your script URL and website ID in .env (see .env.example) after creating an account.
 */
export function Analytics() {
  const scriptSrc = import.meta.env.VITE_ANALYTICS_SCRIPT;
  const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;

  if (!scriptSrc) return null;

  return (
    <>
      <script async defer data-website-id={websiteId || undefined} src={scriptSrc} />
    </>
  );
}
