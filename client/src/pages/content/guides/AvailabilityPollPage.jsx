import {
  ContentPage,
  ContentLead,
  ContentSection,
  ContentSteps,
  ContentFaq,
} from "../ContentPage";

const META = {
  title: "How to run a group availability poll",
  description:
    "Run a free availability poll to find when everyone in a group is free. Share one link, collect date votes, and pick the best overlap.",
  path: "/guides/availability-poll",
  breadcrumbCategory: "Guides",
};

const faqs = [
  {
    q: "Is an availability poll the same as a date poll?",
    a: "Yes. In Plannio you propose specific dates or ranges, and each person marks which options work for them. The result shows everyone's combined availability.",
  },
  {
    q: "How many dates should I propose?",
    a: "Start with 3–6 realistic options — e.g. three weekend nights or two meeting slots. Too many choices slows people down; too few limits overlap.",
  },
  {
    q: "Can I see who picked what?",
    a: "Yes. Live results show each person's choices so you can pick the date with the strongest group availability.",
  },
];

const STEPS = [
  {
    title: "List your candidate dates",
    body: "Add each day or date range in calendar or list view. Include times if they matter, or mark options as all-day.",
  },
  {
    title: "Set expected responses (optional)",
    body: "Enter how many people should answer — e.g. 8 for your team. Plannio shows progress like 5 / 8 responded.",
  },
  {
    title: "Share the poll link",
    body: "Post it in Slack, Discord, email, or group chat. Voters open the link and tap every date that works for them.",
  },
  {
    title: "Read the overlap",
    body: "Results update live. Pick the option with the most votes or the best mix of key people.",
  },
  {
    title: "Lock the winning date",
    body: "Finalize on the poll page. If you connected Discord or Slack, Plannio can post the locked date to your channel.",
  },
];

const RELATED = [
  {
    to: "/guides/stop-chasing-replies",
    label: "Stop chasing replies when planning group dates",
    desc: "One link plus a progress count instead of a chat thread.",
  },
  {
    to: "/use-cases/team-meetings",
    label: "Find a meeting time your whole team can make",
    desc: "Availability polls for work groups.",
  },
  {
    to: "/guides/date-ranges",
    label: "Propose multiple weekends in one poll",
    desc: "Use ranges when the option is a whole trip, not a single hour.",
  },
];

export function AvailabilityPollPage() {
  return (
    <ContentPage {...META} faqs={faqs} howToSteps={STEPS} relatedReads={RELATED}>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">How-to</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        How to run a group availability poll
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>

      <ContentLead>
        A group availability poll is a shared list of dates where each person marks every option
        that works. You find the overlap in one place — no back-and-forth messages — then lock the
        winner. Optional Discord or Slack updates tell the channel when people have voted.
      </ContentLead>

      <ContentSection title="When to use an availability poll">
        <p>
          Use one whenever you need a shared answer to "when can everyone make it?" — team meetings,
          friend hangouts, trips, or community events. It beats emoji reactions because you see
          overlap at a glance and can lock a winner when you're ready.
        </p>
      </ContentSection>

      <ContentSection title="Steps to run an availability poll">
        <ContentSteps steps={STEPS} />
      </ContentSection>

      <ContentFaq faqs={faqs} />
    </ContentPage>
  );
}
