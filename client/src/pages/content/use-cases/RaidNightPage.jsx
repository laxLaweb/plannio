import {
  ContentPage,
  ContentLead,
  ContentSection,
  ContentSteps,
  ContentFaq,
} from "../ContentPage";

const META = {
  title: "Schedule raid night in your Discord server",
  description:
    "Pick a raid night with a free date poll, post vote updates in your Discord channel, and see who can make which night — no bot required.",
  path: "/use-cases/raid-night",
  breadcrumbCategory: "Use cases",
};

const faqs = [
  {
    q: "How many nights should we propose?",
    a: "Two or three candidate raid nights per week is usually enough. Add each as a date with your usual start time so members know what they're voting on.",
  },
  {
    q: "Can we set how many raiders need to respond?",
    a: "Yes. Set expected responses to your roster size — e.g. 8 / 8 for a fixed raid team — and get a Discord message when everyone has voted.",
  },
  {
    q: "Do we need a Discord bot?",
    a: "No. Plannio uses Discord's webhook flow. You pick the channel during setup; updates post there without adding a bot to the server.",
  },
  {
    q: "Can this replace a raid-helper bot?",
    a: "No. Raid-helper bots still handle signups, roles, and loot after you have a time. Use the poll to pick the night; keep the helper for the run itself.",
  },
];

const STEPS = [
  {
    title: "Add your candidate raid nights",
    body: "Create a poll with each night you might run — e.g. Tuesday and Thursday at 8 PM. Use consistent times so the roster knows what they're choosing.",
  },
  {
    title: "Connect your Discord channel",
    body: "During poll setup, connect #raids or your events channel. No bot invite — just Discord's channel picker.",
  },
  {
    title: "Set expected responses to roster size",
    body: "Match your core raid team so you know when everyone has weighed in. Alts and social members can still vote; they do not have to count toward the target.",
  },
  {
    title: "Post the poll link in server",
    body: "Pin it in your scheduling channel. Members mark every night they can attend — not only their favourite.",
  },
  {
    title: "Call the night with best attendance",
    body: "When results are in, lock the winning date. Plannio can post the locked time to Discord. Then create the Discord Event or raid-helper post as usual.",
  },
];

const RELATED = [
  {
    to: "/guides/discord-poll-without-bot",
    label: "Schedule in Discord without adding a bot",
    desc: "Incoming webhook only — no extra member in the guild list.",
  },
  {
    to: "/use-cases/game-night",
    label: "Schedule game night",
    desc: "Casual nights with a smaller expected-response target.",
  },
  {
    to: "/guides/expected-responses",
    label: "Track expected responses",
    desc: "How the 8 / 8 counter and reminder ping work.",
  },
];

export function RaidNightPage() {
  return (
    <ContentPage {...META} faqs={faqs} howToSteps={STEPS} relatedReads={RELATED}>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Use case</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Schedule raid night in your Discord server
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: August 2026</p>

      <ContentLead>
        To schedule raid night in Discord without a bot, propose two or three candidate nights with
        your usual start time, set expected responses to roster size, and connect #raids. Plannio
        posts as raiders vote so officers can lock the night with the best attendance instead of
        counting emoji or chasing DMs.
      </ContentLead>

      <ContentSection title="Why emoji polls break down for raids">
        <p>
          A raid night is not a vibe check. You need names against nights, a clear “has the tank
          answered?”, and a moment when the roster is complete. Reaction polls hide that. They
          also collapse when someone can do Tuesday <em>or</em> Thursday but not both — two
          emojis look like two people.
        </p>
        <p>
          Raid-helper bots are excellent after the time exists: signups, roles, ready checks. They
          are awkward as the first tool, because they assume a locked datetime. Officers still
          spend Sunday night in #scheduling asking who can swap from Wednesday to Thursday.
        </p>
      </ContentSection>

      <ContentSection title="Treat the poll like a roster checkpoint">
        <p>
          Set expected responses to the number of people who must be there — 8 for a Mythic static,
          20 for a larger AotC group, 10 if you include bench. The progress count is the whole
          point: 6 / 8 means you wait; 8 / 8 means you call it. Optional social members can still
          vote; they just should not inflate the target.
        </p>
        <p>
          Require Discord login if you need votes tied to real accounts. Leave login off if alts
          and friends-of-friends need to answer with a name. Officers can still read the results
          page and see the overlap.
        </p>
      </ContentSection>

      <ContentSection title="Set up raid night scheduling">
        <ContentSteps steps={STEPS} />
      </ContentSection>

      <ContentSection title="What officers should post in Discord">
        <p>
          Connect the webhook to #raids or #scheduling, not #memes. Enable new-vote and
          everyone-responded events so the channel shows momentum. Use a manual reminder once —
          not three times a day — for people who have not voted. When you lock the date, the
          channel gets one canonical “we’re going Thursday 8pm” message.
        </p>
        <p>
          After lock, create the Discord Event or your usual raid-helper post. Plannio does not
          replace loot rules, voice-move bots, or attendance spreadsheets. It replaces the
          pre-raid availability thread that never quite finishes.
        </p>
      </ContentSection>

      <ContentSection title="Guilds that already have five bots">
        <p>
          You do not need a sixth. A webhook is not another bot user. If leadership is allergic to
          new integrations, that is the pitch: no member list change, channel-only posting, and
          you can disconnect it when the season ends. The poll link still works even if you never
          connect Discord — you just lose the channel headlines.
        </p>
      </ContentSection>

      <ContentFaq faqs={faqs} />
    </ContentPage>
  );
}
