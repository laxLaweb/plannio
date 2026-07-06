import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatePollButton } from "@/components/polls/CreatePollButton";
import { Logo } from "./Logo";
import { UserAvatar } from "@/components/auth/UserAvatar";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Product", href: "#showcase" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

function UserMenu() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/login">Log in</Link>
        </Button>
        <CreatePollButton variant="hero" size="sm">
          Create poll
        </CreatePollButton>
      </>
    );
  }

  return (
    <>
      <Button variant="ghost" size="sm" asChild>
        <Link to="/polls">My polls</Link>
      </Button>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card/80 py-1 pl-1 pr-3 shadow-soft">
        <UserAvatar user={user} className="h-8 w-8 rounded-lg" />
        <span className="max-w-[120px] truncate text-sm font-semibold text-foreground">
          {user.displayName}
        </span>
      </div>
      <Button variant="ghost" size="sm" onClick={logout} aria-label="Log out">
        <LogOut className="h-4 w-4" />
      </Button>
      <CreatePollButton variant="hero" size="sm">
        Create poll
      </CreatePollButton>
    </>
  );
}

export function Navbar({ showNavLinks = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo />

        {showNavLinks && (
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}

        <div className="hidden items-center gap-2 md:flex">
          <UserMenu />
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {showNavLinks &&
                links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    {l.label}
                  </a>
                ))}
              <div className="mt-2 flex flex-col gap-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5">
                      <UserAvatar user={user} className="h-9 w-9 rounded-lg" />
                      <span className="text-sm font-semibold text-foreground">{user.displayName}</span>
                    </div>
                    <Button variant="outline" asChild>
                      <Link to="/polls" onClick={() => setOpen(false)}>
                        My polls
                      </Link>
                    </Button>
                    <Button variant="outline" onClick={logout}>
                      Log out
                    </Button>
                    <CreatePollButton variant="hero" onClick={() => setOpen(false)}>
                      Create poll
                    </CreatePollButton>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link to="/login" onClick={() => setOpen(false)}>
                        Log in
                      </Link>
                    </Button>
                    <CreatePollButton variant="hero" onClick={() => setOpen(false)}>
                      Create poll
                    </CreatePollButton>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
