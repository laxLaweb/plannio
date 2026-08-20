import {
  ContentPage,
  ContentLead,
  ContentSection,
  ContentSteps,
  ContentFaq,
} from "../ContentPage";

const META = {
  title: "Stop chasing replies when planning group dates",
  description:
    "Replace endless 'works for me' threads with one date poll link, expected-response tracking, and automatic reminders in Discord or Slack.",
  path: "/guides/stop-chasing-replies",
  breadcrumbCategory: "Guides",
};

const faqs = [
  {
    q: "What if someone still doesn't respond?",
    a: "Use scheduled reminders or \"Send reminder now\" to nudge non-voters. Set expected responses so you know exactly who is missing.",
  },
  {
    q: "Can one person update another's vote?",
    a: "If voters didn't log in, anyone with the link can edit name-based responses. Logged-in votes are tied to the account.",
  },
];

const STEPS = [
  {
    title: "Propose dates once",
    body: "Put all options in a Plannio poll instead of asking open-ended questions in chat.",
  },
  {
    title: "Set expected responses",
    body: "Match your group size. The poll shows progress and can message Discord or Slack when the target is hit.",
  },
  {
    title: "Share one link — pin it if you can",
    body: "Every reply goes to the same place. No scrolling to find who said what.",
  },
  {
    title: "Remind without awkward DMs",
    body: 'Schedule reminders or hit "Send reminder now." Plannio nudges the channel, not you personally.',
  },
  {
    title: "Decide from live results",
    body: "Pick the date with the strongest overlap and lock it. Done — no second round of messages.",
  },
];

const RELATED = [
  {
    to: "/use-cases/team-meetings",
    label: "Find a meeting time your whole team can make",
    desc: "The same workflow for work groups.",
  },
  {
    to: "/slack-scheduling",
    label: "Date polls with Slack channel updates",
    desc: "Let the team channel carry the reminders.",
  },
  {
    to: "/guides/expected-responses",
    label: "Track expected responses on a date poll",
    desc: "Why 6 / 8 responded is more useful than silence.",
  },
];

export function StopChasingRepliesPage() {
  return (
    <ContentPage {...META} faqs={faqs} howToSteps={STEPS} relatedReads={RELATED}>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">How-to</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Stop chasing replies when planning group dates
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>

      <ContentLead>
        Stop chasing “works for me” replies by sharing one date-poll link instead of an open
        question in chat. Track how many people have responded, send reminders to the channel, and
        decide when the expected headcount is in — not after a week of DMs.
      </ContentLead>

      <ContentSection title="Why chasing replies fails">
        <p>
          Messages get buried, people forget to answer, and you never know if silence means "no" or
          "didn't see it." A poll gives one place to respond and a visible progress count — e.g. 6 /
          8 responded — so you know when you have enough input to decide.
        </p>
      </ContentSection>

      <ContentSection title="A better workflow">
        <ContentSteps steps={STEPS} />
      </ContentSection>

      <ContentFaq faqs={faqs} />
    </ContentPage>
  );
}
