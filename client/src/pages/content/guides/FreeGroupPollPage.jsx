import {
  ContentPage,
  ContentLead,
  ContentSection,
  ContentSteps,
  ContentFaq,
} from "../ContentPage";

const META = {
  title: "Free group date poll — voters only need a name",
  description:
    "Run a free group date poll where voters answer with a name — no signup. Share one link, see overlap, and optionally post updates to Discord or Slack.",
  path: "/guides/free-group-poll",
  breadcrumbCategory: "Guides",
};

const faqs = [
  {
    q: "Is a free group date poll the same as an availability poll?",
    a: "Yes in practice. You propose dates, everyone marks what works, and you pick the overlap. The difference is friction: voters should not need a new account just to say which weekend they can make.",
  },
  {
    q: "Who needs to sign in?",
    a: "Only the person who creates and manages the poll. Voters can use a name field. You can require Discord or Slack login later if you need votes tied to accounts.",
  },
  {
    q: "Does free mean a trial or a paywall later?",
    a: "No. Creating polls, sharing links, connecting a Discord or Slack channel, and collecting votes are free on the features that are live today.",
  },
  {
    q: "Can the same poll notify Discord or Slack?",
    a: "Yes. Connect a channel during setup via an incoming webhook — no bot invite. The channel can get poll-created, new-vote, reminder, and date-locked messages.",
  },
];

const STEPS = [
  {
    title: "Create the poll",
    body: "Sign in, name the event, and add 3–6 realistic dates or ranges. Too many options slows the group down.",
  },
  {
    title: "Leave login optional for voters",
    body: "Keep “Require login to vote” off so people answer with a name. Turn it on only for formal teams.",
  },
  {
    title: "Set expected responses",
    body: "Match the group size (e.g. 8) so you see 5 / 8 responded instead of guessing whether silence means no.",
  },
  {
    title: "Share one link",
    body: "Post it in chat, email, Discord, or Slack. Everyone opens the same URL and marks every date that works.",
  },
  {
    title: "Lock the overlap",
    body: "When enough people have voted, pick the strongest option and lock it. Optional channel updates tell the group which date won.",
  },
];

const RELATED = [
  {
    to: "/guides/vote-without-account",
    label: "Let people vote without creating an account",
    desc: "The exact setting and when to require Discord or Slack login.",
  },
  {
    to: "/guides/availability-poll",
    label: "How to run a group availability poll",
    desc: "How many dates to propose and how to read overlap.",
  },
  {
    to: "/guides/discord-poll-without-bot",
    label: "Schedule in Discord without adding a bot",
    desc: "Same poll, channel updates via webhook.",
  },
];

export function FreeGroupPollPage() {
  return (
    <ContentPage {...META} faqs={faqs} howToSteps={STEPS} relatedReads={RELATED}>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">How-to</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Free group date poll — voters only need a name
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: August 2026</p>

      <ContentLead>
        A free group date poll is one shared link where each person marks every date that works.
        Voters can answer with a name — they do not create an account. Only you, the organizer,
        sign in. Optional Discord or Slack updates keep the chat thread from becoming a second
        spreadsheet.
      </ContentLead>

      <ContentSection title="What “free group poll” should actually mean">
        <p>
          The phrase gets used for tools that are free until the fifth participant, free until
          you want reminders, or free only if every voter also signs up. For a friend trip or a
          Discord hangout, that extra step is the whole problem: half the group never opens the
          second email.
        </p>
        <p>
          Here, free means you can create the poll, share the link, collect name-based votes,
          see live overlap, send reminders, and connect a channel — without a paywall on those
          live features. It is not a 1:1 booking page and not a recurring calendar.
        </p>
      </ContentSection>

      <ContentSection title="When this is the right tool">
        <p>
          Use it when the job is “which of these dates works for the most people?” Weekend
          trips, game nights, team kickoffs, volunteer shifts, family gatherings. Do not use it
          when you need someone to pick a slot on your personal calendar — that is a different
          product category.
        </p>
        <p>
          If the group already lives in Discord, connect a channel so votes show up there. If
          they live in iMessage, the same link still works; you just skip the webhook.
        </p>
      </ContentSection>

      <ContentSection title="How to run one">
        <ContentSteps steps={STEPS} />
      </ContentSection>

      <ContentSection title="How it compares to a chat thread">
        <p>
          A thread asks an open question and never finishes. A poll asks a closed question:
          these dates, yes or no for each. Expected responses make the poll finite. Reminders
          go to the channel, not your DMs. That is the entire upgrade — not more features, less
          chasing.
        </p>
      </ContentSection>

      <ContentFaq faqs={faqs} />
    </ContentPage>
  );
}
