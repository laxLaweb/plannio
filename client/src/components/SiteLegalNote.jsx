import { formatSiteOwner } from "@/lib/site";

export function SiteLegalNote({ className = "" }) {
  return (
    <p className={`text-center text-xs text-muted-foreground ${className}`.trim()}>
      Plannio is operated by {formatSiteOwner()}.
    </p>
  );
}
