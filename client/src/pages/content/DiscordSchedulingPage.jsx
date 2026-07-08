import { Link } from "react-router-dom";
import {
  ContentPage,
  ContentLead,
  ContentSection,
  ContentSteps,
  ContentFaq,
} from "./ContentPage";

const META = {
  title: "Date polls with Discord channel updates",
  description:
    "Create a free date poll and post automatic updates to a Discord channel — no bot invite needed. New votes, reminders, and more.",
  path: "/discord-scheduling",
  breadcrumbCategory: "Integration guide",
};

const faqs = [
  {
    q: "Do I need to invite a Discord bot?",
    a: "No. Plannio uses Discord's incoming webhook flow. When you create a poll, you pick a channel in Discord's own authorization screen — no bot added to your server.",
  },
  {
    q: "What gets posted to Discord automatically?",
    a: "You choose when setting up the poll: poll created, new vote, date locked, and reminders for people who haven't responded yet. You can also send a manual reminder from the poll page.",
  },
  {
    q: "Can voters use Discord login?",
    a: "Yes — you can require Discord or Slack login to vote, or let people vote with just a name. That's your choice when you create the poll.",
  },
  {
    q: "Is this free?",
    a: "Yes. Plannio is free to use — create polls, share links, and connect a Discord channel at no cost.",
  },
];

export function DiscordSchedulingPage() {
  return (
    <ContentPage {...META} faqs={faqs}>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Integration guide</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Date polls with Discord channel updates
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>

      <ContentLead>
        Plannio is a free date-poll tool with built-in Discord and Slack channel updates. Create a
        poll, connect a Discord channel during setup, and Plannio posts when the poll is created,
        when someone votes, and when everyone expected has responded — without inviting a bot to
        your server.
      </ContentLead>

      <ContentSection title="Why use a date poll in Discord?">
        <p>
          Coordinating dates in a busy Discord channel means scrolling through replies, losing
          track of who said yes, and manually pinging people who haven't answered. A date poll gives
          everyone one link to mark which dates work, while Plannio keeps the channel updated so you
          don't have to chase replies yourself.
        </p>
      </ContentSection>

      <ContentSection title="How to set up Discord updates (step by step)">
        <ContentSteps
          steps={[
            {
              title: "Sign in and create a poll",
              body: "Log in with Discord (or Slack / email), name your event, and add proposed dates in the calendar or list view. Single days, multi-day ranges, times, and all-day options are all supported.",
            },
            {
              title: "Connect a Discord channel",
              body: 'In the "Channel updates" section, click Connect Discord channel. Discord opens a popup where you pick the channel — Plannio receives a webhook and can post there. No bot invite required.',
            },
            {
              title: "Choose what to post",
              body: "Select which events trigger a message: poll created, new vote, date locked, and reminders. Set expected responses (e.g. 8 people) if you want a progress bar and a ping when everyone has voted.",
            },
            {
              title: "Share the poll link",
              body: "Copy the voting link and paste it in your Discord channel (or anywhere else). Participants pick the dates that work for them; results update live on the poll page.",
            },
            {
              title: "Watch updates roll in",
              body: "Plannio posts to your connected channel as people respond. When the expected number of responses is reached, you get a message saying everyone has voted — then you pick the best date.",
            },
          ]}
        />
      </ContentSection>

      <ContentSection title="What Plannio posts to Discord">
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Poll created</strong> — proposed dates and the
            share link
          </li>
          <li>
            <strong className="text-foreground">New vote</strong> — who responded and which dates
            they picked
          </li>
          <li>
            <strong className="text-foreground">Date locked</strong> — when you finalize the winning
            time
          </li>
          <li>
            <strong className="text-foreground">Reminders</strong> — nudges for people who haven't
            voted yet (scheduled or sent manually with "Send reminder now")
          </li>
          <li>
            <strong className="text-foreground">Everyone responded</strong> — when all expected
            participants have voted
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="Good fits for Discord scheduling">
        <p>
          Game nights, weekend trips, team standup times, community events, and any group that
          already lives in Discord. If you're tired of "works for me" threads that never converge,
          a shared poll plus channel updates keeps everyone aligned without extra admin work.
        </p>
      </ContentSection>

      <ContentSection title="Related guides">
        <p>
          Also scheduling in Slack? Read the{" "}
          <Link to="/slack-scheduling" className="font-semibold text-primary hover:underline">
            Slack scheduling guide
          </Link>
          .
        </p>
      </ContentSection>

      <ContentFaq faqs={faqs} />
    </ContentPage>
  );
}
