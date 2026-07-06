import { CalendarCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Logo({ className }) {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const content = (
    <>
      <span className="grid h-9 w-9 place-items-center rounded-xl text-primary-foreground shadow-soft [background:var(--gradient-primary)]">
        <CalendarCheck className="h-5 w-5" strokeWidth={2.25} />
      </span>
      <span className="text-[19px] font-bold tracking-tight text-foreground">Plannio</span>
    </>
  );

  if (isHome) {
    return (
      <a href="#top" className={cn("flex items-center gap-2.5", className)} aria-label="Plannio home">
        {content}
      </a>
    );
  }

  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)} aria-label="Plannio home">
      {content}
    </Link>
  );
}
