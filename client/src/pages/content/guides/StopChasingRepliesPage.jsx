import { Link } from "react-router-dom";
import {
  ContentPage,
  ContentLead,
  ContentSection,
  ContentSteps,
  ContentFaq,
} from "../ContentPage";

const META = {
  title: "Stop chasing replies when planning group dates",
  description:
    "Replace endless 'works for me' threads with one date poll link, expected-response tracking, and automatic reminders in Discord or Slack.",
  path: "/guides/stop-chasing-replies",
  breadcrumbCategory: "Guides",
};

const faqs = [
  {
    q: "What if someone still doesn't respond?",
    a: "Use scheduled reminders or \"Send reminder now\" to nudge non-voters. Set expected responses so you know exactly who is missing.",
  },
  {
    q: "Can one person update another's vote?",
    a: "If voters didn't log in, anyone with the link can edit name-based responses. Logged-in votes are tied to the account.",
  },
];

export function StopChasingRepliesPage() {
  return (
    <ContentPage {...META} faqs={faqs}>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">How-to</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Stop chasing replies when planning group dates
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>

      <ContentLead>
        Plannio is a free date-poll tool with built-in Discord and Slack channel updates. Instead
        of asking "who's free Saturday?" in chat and manually following up, you share one poll link,
        track how many people have responded, and let Plannio notify the group when everyone's in.
      </ContentLead>

      <ContentSection title="Why chasing replies fails">
        <p>
          Messages get buried, people forget to answer, and you never know if silence means "no" or
          "didn't see it." A poll gives one place to respond and a visible progress count — e.g. 6 /
          8 responded — so you know when you have enough input to decide.
        </p>
      </ContentSection>

      <ContentSection title="A better workflow">
        <ContentSteps
          steps={[
            {
              title: "Propose dates once",
              body: "Put all options in a Plannio poll instead of asking open-ended questions in chat.",
            },
            {
              title: "Set expected responses",
              body: "Match your group size. The poll shows progress and can message Discord or Slack when the target is hit.",
            },
            {
              title: "Share one link — pin it if you can",
              body: "Every reply goes to the same place. No scrolling to find who said what.",
            },
            {
              title: "Remind without awkward DMs",
              body: "Schedule reminders or hit \"Send reminder now.\" Plannio nudges the channel, not you personally.",
            },
            {
              title: "Decide from live results",
              body: "Pick the date with the strongest overlap and lock it. Done — no second round of messages.",
            },
          ]}
        />
      </ContentSection>

      <ContentSection title="Related">
        <p>
          <Link to="/use-cases/team-meetings" className="font-semibold text-primary hover:underline">
            Team meeting scheduling
          </Link>
          {" · "}
          <Link to="/slack-scheduling" className="font-semibold text-primary hover:underline">
            Slack channel updates
          </Link>
        </p>
      </ContentSection>

      <ContentFaq faqs={faqs} />
    </ContentPage>
  );
}
