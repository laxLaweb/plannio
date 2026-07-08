import { Link } from "react-router-dom";
import {
  ContentPage,
  ContentLead,
  ContentSection,
  ContentSteps,
  ContentFaq,
} from "../ContentPage";

const META = {
  title: "How to propose multiple weekends in one poll",
  description:
    "Use date ranges in a free Plannio poll to offer several weekends at once — friends vote on all options that work for them.",
  path: "/guides/date-ranges",
  breadcrumbCategory: "Guides",
};

const faqs = [
  {
    q: "Can I mix single days and ranges?",
    a: "Yes. Add a Friday-only option and a Fri–Sun range in the same poll. Voters select everything that works.",
  },
  {
    q: "Do ranges work in calendar view?",
    a: "Yes. Select start and end dates in the calendar, or add ranges in list view — whichever is faster for you.",
  },
];

export function DateRangesPage() {
  return (
    <ContentPage {...META} faqs={faqs}>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">How-to</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        How to propose multiple weekends in one poll
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>

      <ContentLead>
        Plannio is a free date-poll tool with built-in Discord and Slack channel updates. Date ranges
        let you offer whole weekends (or multi-day trips) as single options — voters tick every range
        that works instead of negotiating one day at a time.
      </ContentLead>

      <ContentSection title="When to use date ranges">
        <p>
          Weekend trips, conferences, hackathons, and holidays are naturally multi-day. Proposing "Fri
          4 Jul – Sun 6 Jul" as one option is clearer than three separate day votes and shows overlap
          faster.
        </p>
      </ContentSection>

      <ContentSection title="How to add ranges in Plannio">
        <ContentSteps
          steps={[
            {
              title: "Open Create poll",
              body: "Choose calendar or list view — both support ranges.",
            },
            {
              title: "Select start and end dates",
              body: "In calendar view, pick the first and last day of the range. In list view, add a range row directly.",
            },
            {
              title: "Set all-day or specific times",
              body: "Trips often use all-day. Meetings might use one time applied to all dates or per-date times.",
            },
            {
              title: "Repeat for each weekend",
              body: "Add 3–4 range options so voters express preference across weekends, not just one.",
            },
            {
              title: "Share and compare overlap",
              body: "Results show vote counts per range. The highest count is your best candidate.",
            },
          ]}
        />
      </ContentSection>

      <ContentSection title="Related">
        <p>
          <Link to="/use-cases/weekend-trip" className="font-semibold text-primary hover:underline">
            Plan a weekend trip
          </Link>
          {" · "}
          <Link to="/guides/stop-chasing-replies" className="font-semibold text-primary hover:underline">
            Stop chasing replies
          </Link>
        </p>
      </ContentSection>

      <ContentFaq faqs={faqs} />
    </ContentPage>
  );
}
