import { Link } from "react-router-dom";
import {
  ContentPage,
  ContentLead,
  ContentSection,
} from "@/pages/content/ContentPage";

const CONTACT_EMAIL = "privacy@plannio.eu";

export function TermsPage() {
  return (
    <ContentPage
      title="Terms of service"
      description="The terms that apply when you use Plannio."
      path="/terms"
      breadcrumbCategory="Legal"
    >
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Terms of service
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: July 9, 2026</p>

      <div className="mt-6">
        <ContentLead>
          These terms apply when you use Plannio — whether you create polls, vote on them, or just
          browse. By creating an account or voting on a poll, you accept these terms.
        </ContentLead>
      </div>

      <ContentSection title="Who we are">
        <p>
          Plannio is operated by Laweb (CVR 29076561). Questions about these terms? Contact{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-primary hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </ContentSection>

      <ContentSection title="The service">
        <p>
          Plannio lets you create date polls, share them with a link, and optionally send updates
          to Discord or Slack channels. The service is provided as-is; we work to keep it available
          and secure but do not guarantee uninterrupted operation.
        </p>
      </ContentSection>

      <ContentSection title="Your account">
        <p>
          You are responsible for the activity on your account and for keeping your sign-in
          credentials safe. You can delete your account at any time from your{" "}
          <Link to="/account" className="font-medium text-primary hover:underline">
            account page
          </Link>
          , which permanently removes your data as described in our{" "}
          <Link to="/privacy" className="font-medium text-primary hover:underline">
            privacy policy
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection title="Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>use Plannio for anything unlawful, harassing, or misleading;</li>
          <li>enter other people’s personal data in polls without a lawful basis for doing so;</li>
          <li>attempt to disrupt the service, probe its security, or access other users’ data.</li>
        </ul>
        <p>
          We may remove content or suspend accounts that violate these terms. If you create a poll,
          you are responsible for the personal data you collect through it — under the GDPR you may
          be a data controller for your participants’ responses.
        </p>
      </ContentSection>

      <ContentSection title="Content and data">
        <p>
          You own the content you put into your polls. You grant us the right to store and display
          it as needed to run the service. Polls are automatically deleted 12 months after their
          last activity.
        </p>
      </ContentSection>

      <ContentSection title="Liability">
        <p>
          Plannio is a free scheduling tool. To the extent permitted by law, we are not liable for
          indirect losses, lost data, or damages arising from the use of — or inability to use —
          the service.
        </p>
      </ContentSection>

      <ContentSection title="Changes and governing law">
        <p>
          We may update these terms; material changes will be announced on this page with a new
          date at the top. The terms are governed by Danish law. Questions? Contact{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-primary hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </ContentSection>
    </ContentPage>
  );
}
