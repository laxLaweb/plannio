import { Link } from "react-router-dom";
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
    a: "You need permission to authorize webhooks in the channel you pick. Most members with standard roles can connect a channel they can post in.",
  },
];

export function DiscordPollWithoutBotPage() {
  return (
    <ContentPage {...META} faqs={faqs}>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">How-to</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        How to schedule in Discord without adding a bot
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>

      <ContentLead>
        Plannio is a free date-poll tool with built-in Discord and Slack channel updates. You can
        post poll updates to a Discord channel without inviting a bot — Plannio uses Discord's
        incoming webhook flow, so you pick a channel once during setup and messages appear there
        automatically.
      </ContentLead>

      <ContentSection title="Why avoid a bot for simple scheduling?">
        <p>
          Bots need to be approved, maintained, and given broad permissions. For "find a date and
          tell the channel when people vote," a webhook is enough — fewer moving parts and no extra
          member in your server list.
        </p>
      </ContentSection>

      <ContentSection title="Steps">
        <ContentSteps
          steps={[
            {
              title: "Create a poll on Plannio",
              body: "Sign in, add your proposed dates, and name the event.",
            },
            {
              title: "Click Connect Discord channel",
              body: "Discord's popup lets you choose the target channel. Authorize once — Plannio receives a webhook URL.",
            },
            {
              title: "Share the poll link",
              body: "Post it in the same channel or elsewhere. Votes happen on the web; updates post back to Discord.",
            },
            {
              title: "Choose notification types",
              body: "Enable created, vote, locked, and reminder events as needed. Send a manual reminder anytime from the poll page.",
            },
          ]}
        />
      </ContentSection>

      <ContentSection title="Related">
        <p>
          <Link to="/discord-scheduling" className="font-semibold text-primary hover:underline">
            Full Discord scheduling guide
          </Link>
          {" · "}
          <Link to="/use-cases/game-night" className="font-semibold text-primary hover:underline">
            Game night use case
          </Link>
        </p>
      </ContentSection>

      <ContentFaq faqs={faqs} />
    </ContentPage>
  );
}
