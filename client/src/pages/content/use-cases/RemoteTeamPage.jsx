import {
  ContentPage,
  ContentLead,
  ContentSection,
  ContentSteps,
  ContentFaq,
} from "../ContentPage";

const META = {
  title: "Find meeting times for a remote team",
  description:
    "Schedule async team meetings with a free date poll, expected-response tracking, and Slack or Discord updates — no chasing DMs.",
  path: "/use-cases/remote-team",
  breadcrumbCategory: "Use cases",
};

const faqs = [
  {
    q: "Does Plannio handle time zones automatically?",
    a: "Each date option shows the time you set when creating the poll. Share options in your team's primary time zone and label them clearly in the poll title or message.",
  },
  {
    q: "Can we use this for recurring standups?",
    a: "Plannio is built for picking among specific proposed dates — ideal for kickoffs, workshops, or finding the first slot for a new recurring meeting. Each poll is independent.",
  },
  {
    q: "Slack or Discord for remote teams?",
    a: "Both work. Connect the channel where your team already coordinates. Plannio posts when the poll is created, when someone votes, and when everyone expected has responded.",
  },
];

const STEPS = [
  {
    title: "Propose 3–5 meeting slots",
    body: "Add specific days and times in your team's primary time zone. Morning and afternoon options help cover different regions.",
  },
  {
    title: "Connect Slack or Discord",
    body: "Pick the team channel. Plannio announces new votes and when everyone expected has responded.",
  },
  {
    title: "Set expected responses to team size",
    body: "Match headcount so you know when the poll is complete — e.g. 10 / 10 for a ten-person squad.",
  },
  {
    title: "Share the link in channel",
    body: "Pin the poll URL. Teammates mark every slot they can make from any device.",
  },
  {
    title: "Lock the slot with best overlap",
    body: "Choose the time that works for the most people and send the calendar invite for that slot only.",
  },
];

const RELATED = [
  {
    to: "/use-cases/team-meetings",
    label: "Find a meeting time your whole team can make",
    desc: "Same poll pattern for colocated or hybrid teams.",
  },
  {
    to: "/slack-scheduling",
    label: "Date polls with Slack channel updates",
    desc: "Webhook posts so the team channel carries the follow-up.",
  },
  {
    to: "/guides/expected-responses",
    label: "Track expected responses on a date poll",
    desc: "Know when the async round is actually finished.",
  },
];

export function RemoteTeamPage() {
  return (
    <ContentPage {...META} faqs={faqs} howToSteps={STEPS} relatedReads={RELATED}>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Use case</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Find meeting times for a remote team
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: August 2026</p>

      <ContentLead>
        Remote teams find a meeting time by proposing a few slots in one poll, sharing the link
        asynchronously, and picking the time with the best attendance. Nobody needs to join a
        live “when works?” call. Slack or Discord can announce votes as they come in.
      </ContentLead>

      <ContentSection title="Why async scheduling beats live polls">
        <p>
          Distributed teams rarely share the same free hour for a live "when works?" call. A date
          poll lets everyone respond on their own schedule. Expected responses show when you have
          enough input, and channel updates keep Slack or Discord in sync without manual follow-ups.
        </p>
      </ContentSection>

      <ContentSection title="Workflow for remote teams">
        <ContentSteps steps={STEPS} />
      </ContentSection>

      <ContentFaq faqs={faqs} />
    </ContentPage>
  );
}
