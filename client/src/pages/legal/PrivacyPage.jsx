import { Link } from "react-router-dom";
import {
  ContentPage,
  ContentLead,
  ContentSection,
} from "@/pages/content/ContentPage";

const CONTACT_EMAIL = "privacy@plannio.app";

export function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy policy"
      description="How Plannio collects, uses, and protects your personal data."
      path="/privacy"
      breadcrumbCategory="Legal"
    >
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Privacy policy
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: July 9, 2026</p>

      <div className="mt-6">
        <ContentLead>
          Plannio helps groups find dates that work for everyone. To do that we process a small
          amount of personal data. This policy explains what we collect, why, how long we keep it,
          and the rights you have under the EU General Data Protection Regulation (GDPR).
        </ContentLead>
      </div>

      <ContentSection title="Who is responsible">
        <p>
          Plannio is the data controller for the personal data described in this policy. For any
          privacy question or request, contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-primary hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </ContentSection>

      <ContentSection title="What we collect and why">
        <p>We only collect what the service needs to work:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-foreground">Account data</strong> — your email
            address, display name, and profile picture URL. Provided by you at sign-up or by
            Discord/Slack when you sign in with them. Used to identify you in Plannio and in polls
            you take part in. Legal basis: performance of a contract (GDPR art. 6(1)(b)).
          </li>
          <li>
            <strong className="font-semibold text-foreground">Password</strong> — if you sign up
            with email and password, we store a salted cryptographic hash of your password, never
            the password itself. Legal basis: performance of a contract.
          </li>
          <li>
            <strong className="font-semibold text-foreground">Sign-in identities</strong> — the
            Discord or Slack user ID linked to your account, so you can sign in with those
            services. Legal basis: performance of a contract.
          </li>
          <li>
            <strong className="font-semibold text-foreground">Votes</strong> — the dates you pick
            and the name shown with your response. If a poll allows voting without an account, only
            the name you type is stored. Legal basis: performance of a contract, or our legitimate
            interest in running the poll for its participants (art. 6(1)(f)).
          </li>
          <li>
            <strong className="font-semibold text-foreground">Session cookie</strong> — a single
            strictly necessary cookie (<code>plannio.sid</code>) that keeps you signed in for up to
            30 days. It is not used for tracking, so no cookie consent banner is required. We do
            not use advertising or cross-site tracking cookies.
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="Who can see your name">
        <p>
          Poll results, including the names of people who responded, are visible to everyone who
          has the poll link — that is the point of a shared poll. Poll creators can choose to hide
          participant names from other participants when creating a poll.
        </p>
        <p>
          If the poll creator has connected a Discord or Slack channel, your name and your response
          are also posted to that channel when you vote. This is stated on the voting page. Data
          posted to Discord or Slack is thereafter governed by their own privacy policies, with
          Discord and Slack acting as independent controllers.
        </p>
      </ContentSection>

      <ContentSection title="Who we share data with">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-foreground">Heroku (Salesforce)</strong> — hosts
            the application and the database in the EU region, acting as our data processor.
          </li>
          <li>
            <strong className="font-semibold text-foreground">Discord / Slack</strong> — only if
            you sign in with them (they send us your profile) or a poll creator connects a channel
            (we send poll updates including participant names to that channel).
          </li>
        </ul>
        <p>We never sell personal data or share it for advertising.</p>
      </ContentSection>

      <ContentSection title="How long we keep data">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-foreground">Polls and votes</strong> — deleted
            automatically 12 months after the last activity on the poll, or earlier if the creator
            deletes the poll.
          </li>
          <li>
            <strong className="font-semibold text-foreground">Account data</strong> — kept until
            you delete your account. Deleting your account immediately removes your profile,
            sign-in identities, your polls, and all your votes.
          </li>
          <li>
            <strong className="font-semibold text-foreground">Sessions</strong> — expire after 30
            days and are then removed from the database.
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="Your rights">
        <p>Under the GDPR you can at any time:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-foreground">Access and export</strong> your data
            — use “Download my data” on your{" "}
            <Link to="/account" className="font-medium text-primary hover:underline">
              account page
            </Link>{" "}
            to get a JSON copy of everything we store about you (art. 15 and 20).
          </li>
          <li>
            <strong className="font-semibold text-foreground">Delete</strong> your account and all
            associated data from the same page (art. 17). Poll creators can delete individual
            polls, which removes all votes in them.
          </li>
          <li>
            <strong className="font-semibold text-foreground">Rectify</strong> incorrect data —
            your name and picture are refreshed from Discord/Slack on each sign-in; for anything
            else, contact us (art. 16).
          </li>
          <li>
            <strong className="font-semibold text-foreground">Object</strong> to processing based
            on legitimate interest (art. 21).
          </li>
        </ul>
        <p>
          If you voted on a poll without an account and want your response removed, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-primary hover:underline">
            {CONTACT_EMAIL}
          </a>{" "}
          with the poll link and the name you used, or ask the poll creator to delete the poll.
        </p>
        <p>
          You also have the right to lodge a complaint with your supervisory authority. In Denmark
          that is Datatilsynet (
          <a
            href="https://www.datatilsynet.dk"
            className="font-medium text-primary hover:underline"
          >
            datatilsynet.dk
          </a>
          ).
        </p>
      </ContentSection>

      <ContentSection title="Security">
        <p>
          All traffic is encrypted with HTTPS. Passwords are stored as salted scrypt hashes.
          Sessions use secure, http-only cookies. Access to production data is restricted, and
          sign-in endpoints are rate limited to prevent abuse.
        </p>
      </ContentSection>

      <ContentSection title="Changes to this policy">
        <p>
          If we make material changes to this policy, we will update the date at the top and, where
          appropriate, notify signed-in users. See also our{" "}
          <Link to="/terms" className="font-medium text-primary hover:underline">
            terms of service
          </Link>
          .
        </p>
      </ContentSection>
    </ContentPage>
  );
}
