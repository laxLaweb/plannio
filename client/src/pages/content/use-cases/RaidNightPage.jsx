import { Link } from "react-router-dom";
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
];

export function RaidNightPage() {
  return (
    <ContentPage {...META} faqs={faqs}>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Use case</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Schedule raid night in your Discord server
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>

      <ContentLead>
        Plannio is a free date-poll tool with built-in Discord and Slack channel updates. Guild and
        static groups use it to propose a few raid nights, connect #raids or #events, and let
        Plannio announce votes so officers pick the night with the best turnout — without counting
        emoji reactions or running a separate bot.
      </ContentLead>

      <ContentSection title="Why emoji polls break down for raids">
        <p>
          Reaction polls don't show who can make which night, get buried in chat, and don't tell you
          when your roster has fully responded. A shared poll link plus automatic "Alex voted"
          updates keeps attendance visible and makes calling raid night straightforward.
        </p>
      </ContentSection>

      <ContentSection title="Set up raid night scheduling">
        <ContentSteps
          steps={[
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
              body: "Match your core raid team so you know when everyone has weighed in.",
            },
            {
              title: "Post the poll link in server",
              body: "Pin it in your scheduling channel. Members mark every night they can attend.",
            },
            {
              title: "Call the night with best attendance",
              body: "When results are in, lock the winning date. Plannio can post the locked time to Discord.",
            },
          ]}
        />
      </ContentSection>

      <ContentSection title="Related">
        <p>
          <Link to="/use-cases/game-night" className="font-semibold text-primary hover:underline">
            Game night scheduling
          </Link>
          {" · "}
          <Link to="/discord-scheduling" className="font-semibold text-primary hover:underline">
            Discord scheduling guide
          </Link>
          {" · "}
          <Link to="/guides/discord-poll-without-bot" className="font-semibold text-primary hover:underline">
            Discord without a bot
          </Link>
        </p>
      </ContentSection>

      <ContentFaq faqs={faqs} />
    </ContentPage>
  );
}
