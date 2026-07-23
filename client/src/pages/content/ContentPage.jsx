import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { CreatePollButton } from "@/components/polls/CreatePollButton";
import { PageMeta } from "@/components/PageMeta";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl } from "@/lib/site";

/** Hub path for breadcrumb categories that have no index page of their own. */
function getCategoryPath(category, pagePath) {
  switch (category) {
    case "Guides":
      return pagePath === "/guides" ? null : "/guides";
    case "Use cases":
      return pagePath === "/use-cases" ? null : "/use-cases";
    case "Legal":
      // /privacy is the legal hub; skip the extra crumb on that page itself.
      return pagePath === "/privacy" ? null : "/privacy";
    default:
      // e.g. "Integration guide" — no shared landing page, omit from crumbs.
      return null;
  }
}

function breadcrumbItems(path, title, breadcrumbCategory) {
  const items = [{ label: "Home", path: "/" }];
  const categoryPath = getCategoryPath(breadcrumbCategory, path);
  if (breadcrumbCategory && categoryPath) {
    items.push({ label: breadcrumbCategory, path: categoryPath });
  }
  if (path !== "/") {
    items.push({ label: title, path });
  }
  return items;
}

export function ContentPage({
  title,
  description,
  path,
  breadcrumbCategory,
  faqs,
  children,
}) {
  const crumbs = useMemo(
    () => breadcrumbItems(path, title, breadcrumbCategory),
    [path, title, breadcrumbCategory],
  );

  const faqSchema = useMemo(() => {
    if (!faqs?.length) return null;
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
  }, [faqs]);

  const pageSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: absoluteUrl(path),
      isPartOf: { "@type": "WebSite", name: "Plannio", url: absoluteUrl("/") },
    }),
    [title, description, path],
  );

  const breadcrumbSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        item: absoluteUrl(item.path),
      })),
    }),
    [crumbs],
  );

  const schemaId = path.replace(/\//g, "-");

  return (
    <div className="min-h-screen bg-background">
      <PageMeta title={title} description={description} path={path} ogType="article" />
      <JsonLd id={`page-schema${schemaId}`} data={pageSchema} />
      <JsonLd id={`breadcrumb-schema${schemaId}`} data={breadcrumbSchema} />
      {faqSchema && <JsonLd id={`faq-schema${schemaId}`} data={faqSchema} />}
      <Navbar showNavLinks={false} />
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-28 sm:px-8 sm:pt-36">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1">
            {crumbs.map((item, index) => {
              const isLast = index === crumbs.length - 1;
              return (
                <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
                  {index > 0 && (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden="true" />
                  )}
                  {item.path && !isLast ? (
                    <Link
                      to={item.path}
                      className="font-medium transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={isLast ? "font-medium text-foreground" : undefined}
                      {...(isLast ? { "aria-current": "page" } : {})}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        <article>{children}</article>
        <ContentCta />
      </main>
      <Footer />
    </div>
  );
}

export function ContentLead({ children }) {
  return (
    <p className="text-lg leading-relaxed text-muted-foreground">{children}</p>
  );
}

export function ContentSection({ title, children }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export function ContentSteps({ steps }) {
  return (
    <ol className="mt-4 list-decimal space-y-4 pl-5 text-[15px] leading-relaxed text-muted-foreground">
      {steps.map((step) => (
        <li key={step.title}>
          <strong className="font-semibold text-foreground">{step.title}</strong>
          {step.body && <p className="mt-1">{step.body}</p>}
        </li>
      ))}
    </ol>
  );
}

export function ContentFaq({ faqs }) {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold tracking-tight text-foreground">FAQ</h2>
      <dl className="mt-4 space-y-6">
        {faqs.map((f) => (
          <div key={f.q}>
            <dt className="text-base font-semibold text-foreground">{f.q}</dt>
            <dd className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ContentCta() {
  return (
    <div className="mt-16 rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Try it free</h2>
      <p className="mx-auto mt-2 max-w-md text-muted-foreground">
        Create a date poll in minutes, connect your channel, and share one link with your group.
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
  );
}
