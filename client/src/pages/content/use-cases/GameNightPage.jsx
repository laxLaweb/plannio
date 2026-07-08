import { Link } from "react-router-dom";
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
];

export function GameNightPage() {
  return (
    <ContentPage {...META} faqs={faqs}>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Use case</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Schedule game night in your Discord server
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>

      <ContentLead>
        Plannio is a free date-poll tool with built-in Discord and Slack channel updates. Propose a
        few Friday or Saturday nights, connect your server's channel, and let Plannio announce votes
        so you can pick the night with the best turnout.
      </ContentLead>

      <ContentSection title="Why Discord communities love date polls">
        <p>
          Game nights die in #general when half the server misses the message. A poll link pinned in
          channel plus automatic "Alex voted" updates keeps momentum without you manually counting
          reactions or emoji polls.
        </p>
      </ContentSection>

      <ContentSection title="Set up game night scheduling">
        <ContentSteps
          steps={[
            {
              title: "Create a poll with your candidate nights",
              body: "Add each Friday or Saturday as a date, or use ranges for long sessions. All-day or evening time slots both work.",
            },
            {
              title: "Connect your Discord channel",
              body: "During poll creation, click Connect Discord channel and choose #game-night or #events. No bot invite.",
            },
            {
              title: "Post the link in server",
              body: "Share the voting URL in your announcement channel. Members mark which nights they can play.",
            },
            {
              title: "Watch votes in Discord",
              body: "Plannio posts when someone responds. When enough people have voted, pick the winning night and lock the date.",
            },
          ]}
        />
      </ContentSection>

      <ContentSection title="Related">
        <p>
          <Link to="/discord-scheduling" className="font-semibold text-primary hover:underline">
            Discord scheduling guide
          </Link>
          {" · "}
          <Link to="/guides/discord-poll-without-bot" className="font-semibold text-primary hover:underline">
            Schedule without adding a bot
          </Link>
        </p>
      </ContentSection>

      <ContentFaq faqs={faqs} />
    </ContentPage>
  );
}
