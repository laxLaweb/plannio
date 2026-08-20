import {
  ContentPage,
  ContentLead,
  ContentSection,
  ContentSteps,
  ContentFaq,
} from "../ContentPage";

const META = {
  title: "Plan a Discord community event",
  description:
    "Schedule a Discord community event with a free date poll and channel updates — no scheduling bot. Movie nights, AMAs, launches, and one-off hangouts.",
  path: "/guides/discord-event-planning",
  breadcrumbCategory: "Guides",
};

const faqs = [
  {
    q: "Is this the same as a Discord Event?",
    a: "No. Discord Events announce a time you already chose. This guide is for finding that time first with a poll, then creating the native Event after you lock a date.",
  },
  {
    q: "Do I need a scheduling bot?",
    a: "No. Connect a channel webhook when you create the poll. Updates post to that channel without adding a bot to the server.",
  },
  {
    q: "How is this different from game night or raid night?",
    a: "Game night and raid night assume a repeating crew. Community events are often one-off, server-wide, and include people who are not in a fixed roster.",
  },
  {
    q: "Can people outside the server vote?",
    a: "Yes. Share the poll link anywhere. They can vote with a name. Discord still gets the channel updates if you connected a webhook.",
  },
];

const STEPS = [
  {
    title: "Name the event and list real candidate times",
    body: "Create a poll with three to six concrete options — e.g. two weekday evenings and a weekend slot. Vague “sometime next month” options get ignored.",
  },
  {
    title: "Connect the announcements or events channel",
    body: "Use Discord’s connect screen so Plannio receives a webhook. No bot invite. Prefer #events or #announcements over #general if the server is busy.",
  },
  {
    title: "Set expected responses to the people who must show",
    body: "For a speaker AMA that needs the host plus mods, set a small number. For a movie night that needs a quorum of regulars, set that quorum — not the entire member count.",
  },
  {
    title: "Post the poll link once, pinned",
    body: "One canonical message beats three “bump.” Voters mark every time that works. Channel updates show momentum without extra pings from you.",
  },
  {
    title: "Lock the winner and create the Discord Event",
    body: "Lock the date on the poll page so the channel hears the result. Then create the native Discord Event with that datetime for reminders and the interested list.",
  },
];

const RELATED = [
  {
    to: "/discord-scheduling",
    label: "Date polls with Discord channel updates",
    desc: "What the webhook posts, and when to use Events after lock.",
  },
  {
    to: "/use-cases/game-night",
    label: "Schedule game night in your Discord server",
    desc: "Recurring nights with a smaller regulars list.",
  },
  {
    to: "/guides/discord-poll-without-bot",
    label: "Schedule in Discord without adding a bot",
    desc: "Why a webhook is enough for finding a date.",
  },
];

export function DiscordEventPlanningPage() {
  return (
    <ContentPage {...META} faqs={faqs} howToSteps={STEPS} relatedReads={RELATED}>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">How-to</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        How to plan a Discord community event
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: August 2026</p>

      <ContentLead>
        Plan a Discord community event by polling for the time first, then creating a native
        Discord Event after you lock a date. Share one poll link, connect an announcements
        channel via webhook — no scheduling bot — and let vote updates show whether the AMA,
        movie night, or launch hangout actually has a quorum.
      </ContentLead>

      <ContentSection title="Discord Events need a time. Most communities do not have one yet">
        <p>
          Native Discord Events are excellent once the datetime is known: they show on the
          sidebar, send reminders, and collect “interested.” They are a poor first step when the
          question is still “Thursday or Saturday?” Staff who create an Event at a guessed time
          then spend the week moving it, or running a second poll in chat that nobody trusts.
        </p>
        <p>
          Community events also fail for a different reason than game night. Game night has a
          known crew. A server-wide movie night, Q&amp;A, or patch-day watch party includes
          people who are not in a roster. You need a public link, a way for guests to vote
          without joining a bot, and a channel that reports progress without @everyone every
          hour.
        </p>
      </ContentSection>

      <ContentSection title="What counts as a community event here">
        <p>
          One-off or rare server happenings: movie or watch parties, AMAs, launch or patch
          hangouts, charity streams, meetup RSVPs that start in Discord, contest deadlines that
          need a kickoff call. Recurring raid or game-night slots belong on those use-case pages
          instead — they assume a smaller, repeating group.
        </p>
        <p>
          If the event needs role assignment, ticket channels, or stage moderation, keep those
          bots. This workflow only chooses when the thing happens and keeps #events honest about
          who has answered.
        </p>
      </ContentSection>

      <ContentSection title="Steps">
        <ContentSteps steps={STEPS} />
      </ContentSection>

      <ContentSection title="Channel hygiene so the poll does not spam the server">
        <p>
          Connect webhooks to a dedicated events channel. Enable “poll created” and “date locked”
          everywhere; enable per-vote posts only if the channel is small. Reminders should ping
          the people who have not voted, not the whole community. Expected responses should match
          the people whose presence is required (host, mods, speakers), not 4,000 lurking
          members.
        </p>
        <p>
          After you lock, paste the Discord Event link in the same channel. The poll was the
          decision record; the Event is the calendar object. Staff who join later can see both:
          why Saturday won, and where to click Interested.
        </p>
      </ContentSection>

      <ContentSection title="Guests, lurkers, and people not in the server">
        <p>
          Community events often include friends-of-friends, newsletter readers, or members who
          never log into Discord on desktop. The same poll URL works in a browser. They vote with
          a name unless you require Discord login. Requiring login is right when you must know
          that “Alex” is actually @alex in the server. Leaving it off is right when you would
          rather have the count than the identity.
        </p>
      </ContentSection>

      <ContentFaq faqs={faqs} />
    </ContentPage>
  );
}
