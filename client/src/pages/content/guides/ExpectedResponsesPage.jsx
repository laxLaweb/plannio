import {
  ContentPage,
  ContentLead,
  ContentSection,
  ContentSteps,
  ContentFaq,
} from "../ContentPage";

const META = {
  title: "Track expected responses on a date poll",
  description:
    "Set how many people should respond, see progress like 6 / 8 voted, send reminders, and get notified when everyone has answered.",
  path: "/guides/expected-responses",
  breadcrumbCategory: "Guides",
};

const faqs = [
  {
    q: "Does the poll creator count toward expected responses?",
    a: "Yes. When you create the poll, your participation counts as one response toward the total you set.",
  },
  {
    q: "What happens when everyone has responded?",
    a: "Plannio can post to your connected Discord or Slack channel that all expected participants have voted — so you know it's time to pick a date.",
  },
  {
    q: "Can I remind people who haven't voted?",
    a: "Yes. Schedule automatic reminders or click \"Send reminder now\" from the poll page. Reminders can post to your connected channel.",
  },
];

const STEPS = [
  {
    title: "Set the number when you create the poll",
    body: "Match your group size — team of 8, Discord raid of 12, trip with 6 friends. The creator counts as one response.",
  },
  {
    title: "Watch the progress bar",
    body: "The poll page and your dashboard show how many people have responded out of the target.",
  },
  {
    title: "Connect Discord or Slack (optional)",
    body: "When the target is reached, Plannio can announce in channel that everyone expected has voted.",
  },
  {
    title: "Nudge non-voters",
    body: 'Use scheduled reminders or "Send reminder now" — Plannio posts to the channel instead of you chasing individuals.',
  },
  {
    title: "Lock the best date",
    body: "Once you have full input, pick the strongest option and lock it on the poll page.",
  },
];

const RELATED = [
  {
    to: "/guides/stop-chasing-replies",
    label: "Stop chasing replies when planning group dates",
    desc: "Expected responses are what make the poll feel finished.",
  },
  {
    to: "/discord-scheduling",
    label: "Date polls with Discord channel updates",
    desc: "Get a channel ping when 8 / 8 have voted.",
  },
  {
    to: "/use-cases/raid-night",
    label: "Schedule raid night in your Discord server",
    desc: "Roster-sized targets in practice.",
  },
];

export function ExpectedResponsesPage() {
  return (
    <ContentPage {...META} faqs={faqs} howToSteps={STEPS} relatedReads={RELATED}>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">How-to</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Track expected responses on a date poll
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>

      <ContentLead>
        Expected responses tell the poll how many people should answer — for example 8 for a
        squad — so you see progress like 6 / 8 responded. Remind the stragglers, and get a Discord
        or Slack message when everyone who needed to vote has voted.
      </ContentLead>

      <ContentSection title="Why expected responses help">
        <p>
          Without a target, you never know if silence means "still thinking" or "done answering."
          A progress count makes the poll feel finite: once 8 / 8 is hit, you can confidently choose
          the best overlapping date instead of waiting one more day.
        </p>
      </ContentSection>

      <ContentSection title="How to use expected responses">
        <ContentSteps steps={STEPS} />
      </ContentSection>

      <ContentFaq faqs={faqs} />
    </ContentPage>
  );
}
