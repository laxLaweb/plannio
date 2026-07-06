import { Twitter, Github, Linkedin } from "lucide-react";
import { Logo } from "./Logo";

const groups = [
  {
    title: "Product",
    links: ["Features", "How it works", "Pricing", "FAQ"],
  },
  {
    title: "Account",
    links: ["Log in", "Create poll"],
  },
];

export function Footer() {
  return (
    <footer id="enterprise" className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Find times that work for everyone with date polls, share links, and updates straight to
              Discord.
            </p>
            <div className="mt-6 flex gap-2">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {groups.map((g) => (
              <div key={g.title}>
                <p className="text-sm font-semibold text-foreground">{g.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {g.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">© 2026 Plannio. All rights reserved.</p>
          <p className="text-sm text-muted-foreground">Built for people who plan — not chase replies.</p>
        </div>
      </div>
    </footer>
  );
}
