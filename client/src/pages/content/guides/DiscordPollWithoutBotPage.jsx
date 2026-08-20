import {
  ContentPage,
  ContentLead,
  ContentSection,
  ContentSteps,
  ContentFaq,
} from "../ContentPage";

const META = {
  title: "Schedule in Discord without adding a bot",
  description:
    "Run a date poll and post updates to a Discord channel using webhooks — no bot invite, no extra permissions. Free with Plannio.",
  path: "/guides/discord-poll-without-bot",
  breadcrumbCategory: "Guides",
};

const faqs = [
  {
    q: "How is this different from a Discord bot?",
    a: "Bots stay in your server and need ongoing permissions. Plannio uses a channel webhook created when you authorize — it can post messages to that channel only, without a persistent bot user.",
  },
  {
    q: "Will this work on any Discord server?",
    a: "You need permission to authorize webhooks in the channel you pick. Most members who can already post in that channel can connect it.",
  },
  {
    q: "Can the webhook read our chat?",
    a: "No. An incoming webhook is write-only for the chosen channel. It cannot list members, read message history, or manage roles.",
  },
  {
    q: "What if my server forbids webhooks?",
    a: "Ask a moderator to allow webhooks on the events channel, or have them connect the channel when creating the poll. The rest of the server stays unchanged.",
  },
];

const STEPS = [
  {
    title: "Create a poll on Plannio",
    body: "Sign in, add your proposed dates, and name the event. You can use single days, ranges, and optional times.",
  },
  {
    title: "Click Connect Discord channel",
    body: "Discord's popup lets you choose the target channel. Authorize once — Plannio receives a webhook URL. No bot user is added to the member list.",
  },
  {
    title: "Share the poll link",
    body: "Post it in the same channel or elsewhere. Votes happen on the web; updates post back to Discord.",
  },
  {
    title: "Choose notification types",
    body: "Enable created, vote, locked, and reminder events as needed. Send a manual reminder anytime from the poll page.",
  },
];

const RELATED = [
  {
    to: "/discord-scheduling",
    label: "Date polls with Discord channel updates",
    desc: "Full setup: what gets posted, expected responses, and when to use Events after you lock a date.",
  },
  {
    to: "/use-cases/raid-night",
    label: "Schedule raid night in Discord",
    desc: "Roster-sized expected responses without a raid-helper bot.",
  },
  {
    to: "/guides/discord-event-planning",
    label: "Plan a Discord community event",
    desc: "One-off server events with a poll link instead of a scheduling bot.",
  },
];

export function DiscordPollWithoutBotPage() {
  return (
    <ContentPage {...META} faqs={faqs} howToSteps={STEPS} relatedReads={RELATED}>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">How-to</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        How to schedule in Discord without adding a bot
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: August 2026</p>

      <ContentLead>
        You can schedule in Discord without adding a bot by posting updates through an incoming
        webhook instead. Create a date poll, pick a channel in Discord’s own connect screen, and
        Plannio writes messages to that channel only — no extra member in the server list, no
        message-content intent, no admin bot approval.
      </ContentLead>

      <ContentSection title="Why people refuse bots for simple scheduling">
        <p>
          Bots are the right tool when you need slash commands, role assignment, or a living
          calendar inside Discord. They are the wrong tool when the job is “ask the group which
          nights work, then tell the channel.” That job does not need to read chat, stay online,
          or hold Manage Roles.
        </p>
        <p>
          Server owners also get tired of unverified bots, unused integrations, and “can we add
          one more?” requests. A webhook never appears as a user. If you disconnect it, posting
          stops. The permission is easy to reason about: this URL may post to #events.
        </p>
      </ContentSection>

      <ContentSection title="What a webhook can and cannot do">
        <p>
          Can: post a message when the poll is created, when someone votes, when you lock a date,
          and when a reminder is sent. Cannot: read the channel, enumerate members, join voice,
          assign the Raider role, or create a Discord Event for you. After you lock a date, you
          still create the native Event by hand if you want Discord’s built-in reminder.
        </p>
        <p>
          That split is deliberate. Scheduling data lives on the poll page (who picked which
          dates, expected-response progress). Discord only gets the headlines so the people who
          never open the link still see momentum.
        </p>
      </ContentSection>

      <ContentSection title="Compared with reaction polls and scheduling bots">
        <p>
          Reaction polls are fast and terrible for anything beyond “thumbs up if you saw this.”
          They do not show who can make which night, they get buried, and they cannot express
          “both Fridays work.” Dedicated scheduling bots add commands and sometimes a calendar
          embed — and they require the bot invite you were trying to avoid.
        </p>
        <p>
          A web poll with webhook updates sits in the middle: rich availability on one page,
          lightweight presence in Discord. Voters who are not even in the server can still open
          the link and answer with a name.
        </p>
      </ContentSection>

      <ContentSection title="Steps">
        <ContentSteps steps={STEPS} />
      </ContentSection>

      <ContentSection title="Permissions you actually need">
        <p>
          The person who clicks Connect Discord channel must be allowed to create webhooks in the
          target channel. Many community servers already allow this for people who can post. If
          your server locked webhooks down, a moderator can connect the channel once during poll
          creation. After that, anyone with the voting link can respond — they do not need webhook
          permission.
        </p>
        <p>
          You do not need Administrator. You do not need to kick existing bots. You do not need to
          open a support ticket with Discord. If the popup lets you pick the channel, you are done.
        </p>
      </ContentSection>

      <ContentSection title="When you still want a bot">
        <p>
          Keep (or add) a bot if you need automated event creation, attendance roles, repeating
          raid signups inside Discord, or moderation. Plannio does not replace those. It replaces
          the “who can make Tuesday” thread that happens before any of those tools have a date to
          work with.
        </p>
      </ContentSection>

      <ContentFaq faqs={faqs} />
    </ContentPage>
  );
}
