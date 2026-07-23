import { Link } from "react-router-dom";
import {
  ContentPage,
  ContentLead,
  ContentSection,
  ContentSteps,
  ContentFaq,
} from "../ContentPage";

const META = {
  title: "Let people vote without creating an account",
  description:
    "Run a free date poll where voters respond with just a name — no signup required. Optional Discord or Slack login when you need it.",
  path: "/guides/vote-without-account",
  breadcrumbCategory: "Guides",
};

const faqs = [
  {
    q: "Does the poll creator need an account?",
    a: "Yes — you sign in to create and manage polls. Only voters can participate without an account if you turn off \"Require login to vote.\"",
  },
  {
    q: "Can anonymous voters change their answers?",
    a: "Anyone with the poll link can edit name-based responses unless you require login. Logged-in votes stay tied to the account.",
  },
  {
    q: "When should I require login to vote?",
    a: "Use required login for formal teams or when you need to know exactly who responded. Leave it off for casual friend groups and quick polls.",
  },
];

export function VoteWithoutAccountPage() {
  return (
    <ContentPage {...META} faqs={faqs}>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">How-to</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Let people vote without creating an account
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>

      <ContentLead>
        Plannio is a free date-poll tool with built-in Discord and Slack channel updates. By default
        you can let voters answer with just a name — no signup, no app install — which removes
        friction when you're planning with friends, volunteers, or community members who won't create
        another account.
      </ContentLead>

      <ContentSection title="Why no-login voting matters">
        <p>
          Every extra signup step loses responses. For informal groups, a name field is enough: open
          the link, enter "Alex", tap the dates that work, save. You still get live results and can
          connect Discord or Slack for automatic updates.
        </p>
      </ContentSection>

      <ContentSection title="How to set up voting without an account">
        <ContentSteps
          steps={[
            {
              title: "Create your poll as usual",
              body: "Add dates, optional times, and expected responses if you want a progress count.",
            },
            {
              title: "Leave \"Require login to vote\" off",
              body: "Voters see a name field instead of a sign-in screen. They can still use Discord or Slack login if you enable it later.",
            },
            {
              title: "Share one link",
              body: "Send the URL anywhere. Each person submits under the name they enter — great for quick group polls.",
            },
            {
              title: "Switch to required login if needed",
              body: "For a tighter team poll, turn on login so each vote is tied to Discord, Slack, or email.",
            },
          ]}
        />
      </ContentSection>

      <ContentSection title="Related">
        <p>
          <Link to="/guides/availability-poll" className="font-semibold text-primary hover:underline">
            Group availability poll
          </Link>
          {" · "}
          <Link to="/use-cases/weekend-trip" className="font-semibold text-primary hover:underline">
            Plan a weekend trip
          </Link>
        </p>
      </ContentSection>

      <ContentFaq faqs={faqs} />
    </ContentPage>
  );
}
