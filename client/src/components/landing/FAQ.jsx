import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, SectionHeading } from "./Reveal";

export const faqs = [
  {
    q: "Do participants need an account to vote?",
    a: "You decide when creating the poll. With \"Require login to vote\" enabled, participants sign in with Discord or Slack. Turn it off and they can vote with just a name — and anyone can edit responses from people who weren't logged in.",
  },
  {
    q: "How do Discord and Slack updates work?",
    a: "When you create a poll, you can connect a Discord channel, a Slack channel, or both. Plannio posts when the poll is created, when someone votes, and when all expected participants have responded. No bot invite needed — you pick the channel during Discord's or Slack's own connect screen.",
  },
  {
    q: "Can I pick dates across multiple days?",
    a: "Yes. Add single days or ranges (e.g. Friday to Sunday for a weekend trip). Use calendar or list view, and set one time for all dates or configure each date individually.",
  },
  {
    q: "What is \"expected responses\"?",
    a: "It's how many people you expect to respond. Plannio shows progress (e.g. 3 / 8 responded) and sends a Discord or Slack message when everyone has voted. The creator counts automatically as one response.",
  },
  {
    q: "Can I sign in with Google or Apple?",
    a: "Not yet — login is currently via Discord or Slack. Google and Apple are coming soon, and multiple login methods can be linked to the same Plannio account.",
  },
  {
    q: "Is Plannio free?",
    a: "Yes. You can create date polls and share them for free. There's no paywall for the features that are live today.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-secondary/30 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading eyebrow="FAQ" title="Questions, answered" />
        </Reveal>
        <Reveal delay={0.05}>
          <Accordion type="single" collapsible className="mt-10 w-full space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="overflow-hidden rounded-2xl border border-border bg-card px-5 shadow-soft"
              >
                <AccordionTrigger className="py-5 text-left text-base font-semibold text-foreground hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-[15px] leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
