import { Link } from "react-router-dom";
import {
  ContentPage,
  ContentLead,
  ContentSection,
  ContentSteps,
  ContentFaq,
} from "../ContentPage";

const META = {
  title: "Track expected responses on a date poll",
  description:
    "Set how many people should respond, see progress like 6 / 8 voted, send reminders, and get notified when everyone has answered.",
  path: "/guides/expected-responses",
  breadcrumbCategory: "Guides",
};

const faqs = [
  {
    q: "Does the poll creator count toward expected responses?",
    a: "Yes. When you create the poll, your participation counts as one response toward the total you set.",
  },
  {
    q: "What happens when everyone has responded?",
    a: "Plannio can post to your connected Discord or Slack channel that all expected participants have voted — so you know it's time to pick a date.",
  },
  {
    q: "Can I remind people who haven't voted?",
    a: "Yes. Schedule automatic reminders or click \"Send reminder now\" from the poll page. Reminders can post to your connected channel.",
  },
];

export function ExpectedResponsesPage() {
  return (
    <ContentPage {...META} faqs={faqs}>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">How-to</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Track expected responses on a date poll
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>

      <ContentLead>
        Plannio is a free date-poll tool with built-in Discord and Slack channel updates. Expected
        responses tell Plannio how many people should answer — e.g. 8 for your squad — so you see
        progress like 6 / 8 responded, send reminders to stragglers, and get a channel message when
        everyone has voted.
      </ContentLead>

      <ContentSection title="Why expected responses help">
        <p>
          Without a target, you never know if silence means "still thinking" or "done answering."
          A progress count makes the poll feel finite: once 8 / 8 is hit, you can confidently choose
          the best overlapping date instead of waiting one more day.
        </p>
      </ContentSection>

      <ContentSection title="How to use expected responses">
        <ContentSteps
          steps={[
            {
              title: "Set the number when you create the poll",
              body: "Match your group size — team of 8, Discord raid of 12, trip with 6 friends. The creator counts as one response.",
            },
            {
              title: "Watch the progress bar",
              body: "The poll page and your dashboard show how many people have responded out of the target.",
            },
            {
              title: "Connect Discord or Slack (optional)",
              body: "When the target is reached, Plannio can announce in channel that everyone expected has voted.",
            },
            {
              title: "Nudge non-voters",
              body: "Use scheduled reminders or \"Send reminder now\" — Plannio posts to the channel instead of you chasing individuals.",
            },
            {
              title: "Lock the best date",
              body: "Once you have full input, pick the strongest option and lock it on the poll page.",
            },
          ]}
        />
      </ContentSection>

      <ContentSection title="Related">
        <p>
          <Link to="/guides/stop-chasing-replies" className="font-semibold text-primary hover:underline">
            Stop chasing replies
          </Link>
          {" · "}
          <Link to="/discord-scheduling" className="font-semibold text-primary hover:underline">
            Discord channel updates
          </Link>
          {" · "}
          <Link to="/use-cases/team-meetings" className="font-semibold text-primary hover:underline">
            Team meetings
          </Link>
        </p>
      </ContentSection>

      <ContentFaq faqs={faqs} />
    </ContentPage>
  );
}
