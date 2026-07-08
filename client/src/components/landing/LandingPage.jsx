import { useMemo } from "react";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { LogoCloud } from "./LogoCloud";
import { Features } from "./Features";
import { HowItWorks } from "./HowItWorks";
import { Showcase } from "./Showcase";
import { Testimonials } from "./Testimonials";
import { Pricing } from "./Pricing";
import { FAQ, faqs } from "./FAQ";
import { GuidesStrip } from "./GuidesStrip";
import { FinalCTA } from "./FinalCTA";
import { Footer } from "./Footer";
import { PageMeta } from "@/components/PageMeta";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl } from "@/lib/site";

export function LandingPage() {
  const faqSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a,
        },
      })),
    }),
    [],
  );

  const appSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Plannio",
      applicationCategory: "SchedulingApplication",
      operatingSystem: "Web",
      url: absoluteUrl("/"),
      description: "Free date polls for groups with Discord and Slack channel updates.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    }),
    [],
  );

  const websiteSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Plannio",
      url: absoluteUrl("/"),
      description: "Free date polls for groups with Discord and Slack channel updates.",
      publisher: { "@type": "Organization", name: "Plannio", url: absoluteUrl("/") },
    }),
    [],
  );

  return (
    <div className="min-h-screen bg-background">
      <PageMeta path="/" />
      <JsonLd id="plannio-website-schema" data={websiteSchema} />
      <JsonLd id="plannio-app-schema" data={appSchema} />
      <JsonLd id="plannio-faq-schema" data={faqSchema} />
      <Navbar />
      <main>
        <Hero />
        <LogoCloud />
        <Features />
        <HowItWorks />
        <Showcase />
        <Testimonials />
        <Pricing />
        <FAQ />
        <GuidesStrip />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
