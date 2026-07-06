import { Reveal } from "./Reveal";

export function LogoCloud() {
  return (
    <section className="border-y border-border bg-secondary/30 py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-center text-sm font-medium text-muted-foreground">
            For weekend trips, team meetings, and anything that needs a shared time
          </p>
        </Reveal>
      </div>
    </section>
  );
}
