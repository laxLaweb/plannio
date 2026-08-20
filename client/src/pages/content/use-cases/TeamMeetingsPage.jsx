import {
  ContentPage,
  ContentLead,
  ContentSection,
  ContentSteps,
  ContentFaq,
} from "../ContentPage";

const META = {
  title: "Find a meeting time your whole team can make",
  description:
    "Free team date poll: propose meeting slots, track who has responded, and get Slack or Discord updates when everyone has voted.",
  path: "/use-cases/team-meetings",
  breadcrumbCategory: "Use cases",
};

const faqs = [
  {
    q: "Can we use this for recurring meetings?",
    a: "Plannio is built for picking among specific proposed dates — great for kickoffs, workshops, or finding the first slot for a new recurring meeting. Each poll is independent.",
  },
  {
    q: "Does it work with Slack?",
    a: "Yes. Connect a Slack channel when you create the poll and updates post there as people vote. Same for Discord.",
  },
  {
    q: "Can we require work email or SSO?",
    a: "You can require login to vote (Discord or Slack). Email/password login is also available for poll creators.",
  },
];

const STEPS = [
  {
    title: "Propose 3–5 time slots",
    body: "Add specific dates with start/end times, or all-day blocks for off-sites. Calendar view makes it fast to pick slots across the next two weeks.",
  },
  {
    title: "Connect Slack or Discord (optional)",
    body: 'If your team coordinates in a channel, connect it so new votes and "everyone responded" messages appear where people already work.',
  },
  {
    title: "Set expected responses",
    body: "Enter your team size (e.g. 8). Plannio tracks 5 / 8 responded and pings the channel when the count is complete.",
  },
  {
    title: "Share internally",
    body: "Post the link in your team channel or add it to a standup doc. Require login to vote if you want names tied to accounts.",
  },
  {
    title: "Lock the best slot",
    body: "Pick the time with the highest attendance and lock it on the poll page. Send the calendar invite for that slot only.",
  },
];

const RELATED = [
  {
    to: "/slack-scheduling",
    label: "Date polls with Slack channel updates",
    desc: "Channel headlines for teams that live in Slack.",
  },
  {
    to: "/guides/stop-chasing-replies",
    label: "Stop chasing replies when planning group dates",
    desc: "Why one link beats five calendar holds.",
  },
  {
    to: "/use-cases/remote-team",
    label: "Find meeting times for a remote team",
    desc: "Async slots when people are not in the same timezone.",
  },
];

export function TeamMeetingsPage() {
  return (
    <ContentPage {...META} faqs={faqs} howToSteps={STEPS} relatedReads={RELATED}>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Use case</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Find a meeting time your whole team can make
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: August 2026</p>

      <ContentLead>
        Propose a handful of meeting slots, share one poll link with the team, and see availability
        at a glance. Optional Slack or Discord updates fire when people vote and when everyone
        expected has responded — then you send a single calendar invite.
      </ContentLead>

      <ContentSection title="Why teams use date polls">
        <p>
          Calendar invites for five options spam everyone's inbox. A single poll link lets each
          person mark what works once, and you see overlap immediately. No more "Tuesday works except
          the 15th" threads in Slack.
        </p>
      </ContentSection>

      <ContentSection title="Steps for a team meeting poll">
        <ContentSteps steps={STEPS} />
      </ContentSection>

      <ContentSection title="What makes Plannio useful for teams">
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>Live results — no exporting spreadsheets</li>
          <li>Manual "Send reminder now" for stragglers</li>
          <li>Free — no per-seat pricing for a simple scheduling poll</li>
        </ul>
      </ContentSection>

      <ContentFaq faqs={faqs} />
    </ContentPage>
  );
}
