import { formatWeekNumbersLabel } from "@/lib/weekNumbers";
import { cn } from "@/lib/utils";

export function OptionWeekNumbers({ startDate, endDate, className }) {
  const label = formatWeekNumbersLabel(startDate, endDate);
  if (!label) return null;

  return (
    <p className={cn("text-xs text-muted-foreground", className)}>{label}</p>
  );
}
