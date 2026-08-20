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
    a: "No. Plannio uses Discord's incoming webhook flow. When you create a poll, you pick a channel in Discord's own authorization screen — no bot is added to your server.",
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
  {
    q: "What permission do I need to connect a channel?",
    a: "You need permission to create a webhook in the channel you pick. Server admins can restrict this; in most community servers, members who can already post in the channel can authorize the webhook.",
  },
];

const STEPS = [
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
];

const RELATED = [
  {
    to: "/guides/discord-poll-without-bot",
    label: "Schedule in Discord without adding a bot",
    desc: "Why a channel webhook is enough — and what a bot would still be for.",
  },
  {
    to: "/use-cases/game-night",
    label: "Schedule game night in your Discord server",
    desc: "Propose a few Friday nights and let channel updates collect the turnout.",
  },
  {
    to: "/guides/discord-event-planning",
    label: "Plan a Discord community event",
    desc: "Server-wide movie nights, AMAs, and one-off events without a scheduling bot.",
  },
];

export function DiscordSchedulingPage() {
  return (
    <ContentPage {...META} faqs={faqs} howToSteps={STEPS} relatedReads={RELATED}>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Integration guide</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Date polls with Discord channel updates
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: August 2026</p>

      <ContentLead>
        To run a date poll with Discord channel updates, create the poll on the web, connect one
        channel during setup, and share the voting link. Plannio posts when the poll is created,
        when someone votes, when a date is locked, and when reminders go out — using an incoming
        webhook, so you never invite a bot to the server.
      </ContentLead>

      <ContentSection title="Why Discord threads fail at scheduling">
        <p>
          A typical “who’s free Friday?” message in #general gets three replies, two emoji reactions,
          and silence from the people who actually matter. The thread is buried by the next meme.
          Nobody can see who has not answered. Officers and organizers end up DMing people one by one.
        </p>
        <p>
          Discord Events are good for announcing a time you already picked. They are a poor tool for{" "}
          <em>finding</em> that time. Reaction polls hide names behind an emoji, cannot represent
          “Tuesday or Thursday but not both,” and do not tell you when the roster is complete.
        </p>
        <p>
          A shared date poll plus channel updates keeps the conversation in Discord without turning
          the channel into a spreadsheet. Votes live on one page. The channel only gets the facts:
          someone responded, a reminder went out, the date is locked.
        </p>
      </ContentSection>

      <ContentSection title="How a Discord scheduling poll works">
        <p>
          Plannio is the poll. Discord is the notification surface. Voters open a link, mark every
          date that works, and save. You can require Discord login so each vote is tied to an
          account, or let people vote with just a name if the group is casual.
        </p>
        <p>
          The webhook can post to one channel only. It cannot read messages, kick members, or list
          your server. If you disconnect the channel later, posting stops. That is the entire
          permission model: write messages to the channel you picked.
        </p>
      </ContentSection>

      <ContentSection title="How to set up Discord updates (step by step)">
        <ContentSteps steps={STEPS} />
      </ContentSection>

      <ContentSection title="What Plannio posts to Discord">
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Poll created</strong> — proposed dates and the
            share link, so the channel has a canonical starting point.
          </li>
          <li>
            <strong className="text-foreground">New vote</strong> — who responded and which dates
            they picked, without you refreshing a results page.
          </li>
          <li>
            <strong className="text-foreground">Date locked</strong> — when you finalize the winning
            time, the channel hears it once instead of a second “so we’re going with Saturday?” thread.
          </li>
          <li>
            <strong className="text-foreground">Reminders</strong> — nudges for people who have not
            voted yet (scheduled, or sent manually with “Send reminder now”).
          </li>
          <li>
            <strong className="text-foreground">Everyone responded</strong> — when expected
            responses are reached, you get a channel ping that it is time to pick.
          </li>
        </ul>
        <p>
          You choose which of those events fire. A noisy #general might only want “poll created”
          and “date locked.” A raid or events channel usually wants votes and reminders too.
        </p>
      </ContentSection>

      <ContentSection title="Webhook versus bot versus Discord Events">
        <p>
          A bot stays in the member list, needs ongoing permissions, and often requires admin
          approval. For “find a date and tell the channel when people vote,” that is more surface
          area than the job needs. An incoming webhook posts messages to one channel and nothing
          else — no extra member, no slash commands, no message-content intent.
        </p>
        <p>
          Discord Events still help after you lock a date: create the Event with the winning time
          so people get the native reminder. Use the poll to choose the time; use the Event to
          broadcast it. They solve different problems.
        </p>
      </ContentSection>

      <ContentSection title="Expected responses keep the poll finite">
        <p>
          Set expected responses to the size of the group that must answer — 8 for a static raid,
          12 for a game-night regulars list, 5 for a friend trip. The poll shows 3 / 8 responded.
          When the last person votes, Discord can say so. Without a target, silence is ambiguous:
          maybe people are still thinking, maybe they never saw the link.
        </p>
      </ContentSection>

      <ContentSection title="Good fits for Discord scheduling">
        <p>
          Game nights, raid nights, weekend trips planned in a friend server, community movie
          nights, and any group that already lives in Discord. If you are tired of “works for me”
          threads that never converge, a shared poll plus channel updates keeps everyone aligned
          without extra admin work.
        </p>
        <p>
          It is a weaker fit if you need a persistent calendar bot, role-based signup sheets, or
          automatic voice-channel creation. Those are bot jobs. Plannio’s job is finding the date
          and keeping the channel honest about who has answered.
        </p>
      </ContentSection>

      <ContentFaq faqs={faqs} />
    </ContentPage>
  );
}
