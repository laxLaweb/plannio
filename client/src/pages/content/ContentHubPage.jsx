import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { CreatePollButton } from "@/components/polls/CreatePollButton";
import { PageMeta } from "@/components/PageMeta";
import { JsonLd } from "@/components/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/breadcrumbSchema";

export function ContentHubPage({ title, description, path, links }) {
  const crumbs = useMemo(
    () => [
      { label: "Home", path: "/" },
      { label: title, path },
    ],
    [title, path],
  );
  const breadcrumbSchema = useMemo(() => buildBreadcrumbSchema(crumbs), [crumbs]);
  const schemaId = path.replace(/\//g, "-") || "hub";

  return (
    <div className="min-h-screen bg-background">
      <PageMeta title={title} description={description} path={path} ogType="website" />
      <JsonLd id={`breadcrumb-schema${schemaId}`} data={breadcrumbSchema} />
      <Navbar showNavLinks={false} />
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-28 sm:px-8 sm:pt-36">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1">
            <li className="inline-flex items-center gap-1">
              <Link to="/" className="font-medium transition-colors hover:text-foreground">
                Home
              </Link>
            </li>
            <li className="inline-flex items-center gap-1">
              <span className="font-medium text-foreground" aria-current="page">
                {title}
              </span>
            </li>
          </ol>
        </nav>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Resources</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{description}</p>

        <ul className="mt-10 space-y-4">
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card"
              >
                <span className="text-base font-bold tracking-tight text-foreground group-hover:text-primary">
                  {link.title}
                </span>
                <span className="mt-1 text-sm text-muted-foreground">{link.desc}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Read more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-16 rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Try it free</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Create a date poll in minutes and share one link with your group.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CreatePollButton variant="hero" size="lg">
              Create free poll <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </CreatePollButton>
            <Link
              to="/"
              className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
