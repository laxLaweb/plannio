import { Link } from "react-router-dom";
import {
  ContentPage,
  ContentLead,
  ContentSection,
  ContentSteps,
  ContentFaq,
} from "./ContentPage";

const META = {
  title: "Date polls with Slack channel updates",
  description:
    "Create a free date poll and post automatic updates to a Slack channel — no app install needed. New votes, reminders, and more.",
  path: "/slack-scheduling",
  breadcrumbCategory: "Integration guide",
};

const faqs = [
  {
    q: "Do I need to install a Slack app in my workspace?",
    a: "Plannio uses Slack's incoming-webhook OAuth flow. You authorize during poll setup and pick a channel — no separate bot installation or admin approval beyond what Slack's connect screen requires.",
  },
  {
    q: "Can I connect both Discord and Slack?",
    a: "Yes. When creating a poll you can connect a Discord channel, a Slack channel, or both. The same events (created, vote, locked, reminders) can post to each.",
  },
  {
    q: "What if not everyone is in Slack?",
    a: "Share the poll link anywhere — email, Slack, or other chat. Voters don't need a Plannio account unless you turn on \"Require login to vote.\"",
  },
  {
    q: "Is Plannio free for Slack teams?",
    a: "Yes. There is no paywall for creating polls or connecting Slack channel updates.",
  },
];

export function SlackSchedulingPage() {
  return (
    <ContentPage {...META} faqs={faqs}>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Integration guide</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Date polls with Slack channel updates
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>

      <ContentLead>
        Plannio is a free date-poll tool with built-in Discord and Slack channel updates. Create a
        meeting or event poll, connect a Slack channel when you set it up, and Plannio posts
        updates as people respond — so your team channel stays in sync without manual follow-ups.
      </ContentLead>

      <ContentSection title="Why use a date poll in Slack?">
        <p>
          Finding a time that works for everyone often turns into a long thread of partial replies.
          A date poll collects availability in one place, while Plannio posts progress to the Slack
          channel your team already watches — including a notification when everyone expected has
          responded.
        </p>
      </ContentSection>

      <ContentSection title="How to set up Slack updates (step by step)">
        <ContentSteps
          steps={[
            {
              title: "Sign in and create a poll",
              body: "Log in with Slack (or Discord / email), add your event name and proposed dates. Use calendar or list view; add date ranges, times, or mark options as all-day.",
            },
            {
              title: "Connect a Slack channel",
              body: 'Click Connect Slack channel in the channel updates section. Slack\'s authorization screen lets you choose where messages should go. Plannio stores the webhook — no extra app configuration on your side.',
            },
            {
              title: "Configure notifications",
              body: "Tick the events you care about: poll created, new vote, date locked, and reminders. Optionally set expected responses so Plannio tracks progress (e.g. 5 / 8 responded).",
            },
            {
              title: "Share the voting link",
              body: "Post the link in your Slack channel or DM it to participants. They select the dates that work; you see live results on the poll page.",
            },
            {
              title: "Follow along in Slack",
              body: 'Updates appear in the connected channel. Use "Send reminder now" on the poll page to nudge anyone who hasn\'t voted yet.',
            },
          ]}
        />
      </ContentSection>

      <ContentSection title="What Plannio posts to Slack">
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Poll created</strong> — title, proposed dates, and
            link to vote
          </li>
          <li>
            <strong className="text-foreground">New vote</strong> — who responded and their
            availability
          </li>
          <li>
            <strong className="text-foreground">Date locked</strong> — final time chosen
          </li>
          <li>
            <strong className="text-foreground">Reminders</strong> — for participants who haven't
            responded
          </li>
          <li>
            <strong className="text-foreground">Everyone responded</strong> — when the expected
            headcount is complete
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="Good fits for Slack scheduling">
        <p>
          Team meetings, sprint planning slots, off-sites, lunch orders, and cross-functional
          syncs. Any workflow where Slack is the hub and you need a clear view of who can make which
          dates benefits from a poll plus automatic channel updates.
        </p>
      </ContentSection>

      <ContentSection title="Related guides">
        <p>
          Also using Discord? Read the{" "}
          <Link to="/discord-scheduling" className="font-semibold text-primary hover:underline">
            Discord scheduling guide
          </Link>
          .
        </p>
      </ContentSection>

      <ContentFaq faqs={faqs} />
    </ContentPage>
  );
}
