import {
  ContentPage,
  ContentLead,
  ContentSection,
  ContentSteps,
  ContentFaq,
} from "../ContentPage";

const META = {
  title: "Schedule game night in your Discord server",
  description:
    "Pick a date for game night with a free poll, post updates in your Discord channel, and see who can make which night — no bot required.",
  path: "/use-cases/game-night",
  breadcrumbCategory: "Use cases",
};

const faqs = [
  {
    q: "Do we need a Discord bot for this?",
    a: "No. Plannio connects via Discord's webhook flow — you pick a channel during setup. Updates post there without adding a bot to your server.",
  },
  {
    q: "Can people vote from their phone?",
    a: "Yes. The poll link works in any browser. Voters tap the dates that work and save — no app install.",
  },
  {
    q: "What if only some people use Discord?",
    a: "Share the same link anywhere. Discord gets automatic updates; others can vote from the link you send them directly.",
  },
  {
    q: "How many nights should we propose?",
    a: "Three to five candidate evenings is enough. Too many options slows people down; two options often miss the night that actually works.",
  },
];

const STEPS = [
  {
    title: "Create a poll with your candidate nights",
    body: "Add each Friday or Saturday as a date, or use ranges for long sessions. All-day or evening time slots both work.",
  },
  {
    title: "Connect your Discord channel",
    body: "During poll creation, click Connect Discord channel and choose #game-night or #events. No bot invite.",
  },
  {
    title: "Set expected responses (optional)",
    body: "If you have a core group of 8 regulars, set expected responses to 8 so you know when the usual crowd has answered — not when the whole 200-person server has.",
  },
  {
    title: "Post the link in server",
    body: "Share the voting URL in your announcement channel. Pin it if the channel is busy. Members mark which nights they can play.",
  },
  {
    title: "Watch votes in Discord and lock a night",
    body: "Plannio posts when someone responds. When enough people have voted, pick the winning night, lock the date, and optionally create a Discord Event for the native reminder.",
  },
];

const RELATED = [
  {
    to: "/discord-scheduling",
    label: "Date polls with Discord channel updates",
    desc: "How channel webhooks post votes and reminders without a bot.",
  },
  {
    to: "/guides/discord-poll-without-bot",
    label: "Schedule without adding a bot",
    desc: "Webhook vs bot vs reaction polls for simple scheduling.",
  },
  {
    to: "/use-cases/raid-night",
    label: "Schedule raid night",
    desc: "Same idea, but with a fixed roster and expected-response count.",
  },
];

export function GameNightPage() {
  return (
    <ContentPage {...META} faqs={faqs} howToSteps={STEPS} relatedReads={RELATED}>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Use case</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Schedule game night in your Discord server
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: August 2026</p>

      <ContentLead>
        To schedule game night in Discord, propose a few Friday or Saturday evenings in one poll,
        share the link in your channel, and let Plannio post when people vote. You see which night
        has the best turnout without counting reactions or inviting a scheduling bot.
      </ContentLead>

      <ContentSection title="Why game night dies in #general">
        <p>
          Someone posts “Jackbox Friday?” at 3pm. Four people react. Two others only see it at 10pm
          and reply “next week?” The people who would actually host never saw the message. Next
          Friday nobody is sure whether it is on.
        </p>
        <p>
          Emoji polls make this worse: one emoji per night, no names unless you click through, no
          way to say “both Fridays work.” A dedicated game-night bot can help after you have a
          repeating slot. It does not help you find the slot when the group’s availability shifts
          every month.
        </p>
      </ContentSection>

      <ContentSection title="What a good game-night poll looks like">
        <p>
          Offer three to five concrete evenings, not an open calendar. “Fri 28, Sat 29, Fri 4, Sat
          5” is easier to answer than “any night in April.” Add a start time on each date so people
          know whether they are voting on 7pm or midnight.
        </p>
        <p>
          If your server has 200 members but only 10 ever play, set expected responses to 10. The
          poll is done when the regulars have answered, not when lurkers have. Channel updates then
          mean something: Alex voted, Maya voted, 7 / 10 in — time to lock Saturday.
        </p>
      </ContentSection>

      <ContentSection title="Set up game night scheduling">
        <ContentSteps steps={STEPS} />
      </ContentSection>

      <ContentSection title="Keep Discord in the loop without spam">
        <p>
          For a dedicated #game-night channel, turn on new-vote posts so the room feels alive. For
          a busy #general, post the link once and only enable “poll created” and “date locked.”
          Reminders belong in the smaller channel, not in general chat.
        </p>
        <p>
          Friends who are not in the server still get the same link. They vote with a name. Discord
          members can optionally sign in with Discord so their votes stay attached to an account.
          You do not need two tools for that split group.
        </p>
      </ContentSection>

      <ContentSection title="After you lock the night">
        <p>
          Locking the date can post to the channel so nobody wonders which option won. Then create
          a Discord Event with that time if you want the native reminder and “interested” list.
          The poll did the hard part — finding overlap. The Event does the broadcast.
        </p>
      </ContentSection>

      <ContentFaq faqs={faqs} />
    </ContentPage>
  );
}
