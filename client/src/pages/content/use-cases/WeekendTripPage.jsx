import { Link } from "react-router-dom";
import {
  ContentPage,
  ContentLead,
  ContentSection,
  ContentSteps,
  ContentFaq,
} from "../ContentPage";

const META = {
  title: "Plan a weekend trip everyone can join",
  description:
    "Propose several weekends in one date poll, share a link with friends, and see who can make which dates — free, with Discord or Slack updates.",
  path: "/use-cases/weekend-trip",
  breadcrumbCategory: "Use cases",
};

const faqs = [
  {
    q: "Can I propose multiple weekends at once?",
    a: "Yes. Add date ranges (e.g. Friday–Sunday) for each possible weekend in calendar or list view. Friends mark every range that works for them.",
  },
  {
    q: "Do my friends need an account?",
    a: "No — unless you turn on \"Require login to vote.\" By default they vote with just a name from the shared link.",
  },
  {
    q: "How do I know when everyone has answered?",
    a: "Set expected responses to your group size. Plannio shows progress (e.g. 4 / 6 responded) and can notify your Discord or Slack channel when everyone has voted.",
  },
];

export function WeekendTripPage() {
  return (
    <ContentPage {...META} faqs={faqs}>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Use case</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Plan a weekend trip everyone can join
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>

      <ContentLead>
        Plannio is a free date-poll tool with built-in Discord and Slack channel updates. Create one
        poll with several possible weekends, share a single link in your group chat, and see which
        dates work for the most people — without a week of back-and-forth messages.
      </ContentLead>

      <ContentSection title="The problem with planning trips in chat">
        <p>
          Someone suggests "how about the 12th?" and three people reply at different times with
          partial availability. Ranges get lost, time zones confuse things, and you never know if
          everyone has actually answered. A date poll turns that into one clear view.
        </p>
      </ContentSection>

      <ContentSection title="How to plan a weekend trip with Plannio">
        <ContentSteps
          steps={[
            {
              title: "List the weekends you're considering",
              body: "Create a poll and add each option as a date range — e.g. Fri 4 Jul – Sun 6 Jul, Fri 11 Jul – Sun 13 Jul. Mark them all-day if you don't have fixed times yet.",
            },
            {
              title: "Share the link in your group",
              body: "Drop the voting link in WhatsApp, iMessage, Discord, or Slack. Everyone opens it once and ticks every weekend that works.",
            },
            {
              title: "Watch results fill in",
              body: "The poll page shows vote counts per weekend. The option with the most overlap is your front-runner.",
            },
            {
              title: "Pick the winner and tell everyone",
              body: "Lock in the final date on the poll page. If you connected Discord or Slack, the group gets an update automatically.",
            },
          ]}
        />
      </ContentSection>

      <ContentSection title="Tips for friend groups">
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>Propose 3–4 weekends upfront so people choose between options, not yes/no on one date.</li>
          <li>Set expected responses to your group size so you know when to stop waiting.</li>
          <li>Connect a Discord or Slack channel if you're coordinating there — votes post as they come in.</li>
        </ul>
      </ContentSection>

      <ContentSection title="Related">
        <p>
          <Link to="/use-cases/game-night" className="font-semibold text-primary hover:underline">
            Schedule a game night
          </Link>
          {" · "}
          <Link to="/guides/date-ranges" className="font-semibold text-primary hover:underline">
            How to propose multiple weekends
          </Link>
        </p>
      </ContentSection>

      <ContentFaq faqs={faqs} />
    </ContentPage>
  );
}
