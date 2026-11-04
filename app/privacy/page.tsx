import Link from "next/link";
export const metadata = {
  title: "Privacy notice | HUGs Creative",
  robots: { index: false, follow: false },
};
export default function Privacy() {
  return (
    <main className="legal-page">
      <Link className="wordmark" href="/">
        HUGs<small className="wordmark-sub">Creative</small>
      </Link>
      <span className="eyebrow">WEBSITE PREVIEW / PRIVACY NOTICE</span>
      <h1>
        Your ideas.
        <br />
        Your <em>information.</em>
      </h1>
      <p>
        This notice explains the current website preview. Business contact
        details and the final publication policy will be added before launch.
      </p>
      <h2>Saving a brief</h2>
      <p>
        The form keeps your entries in the open page. “Save a copy” creates a
        text file on your device. It does not send the brief, save it to a
        database, or subscribe you to marketing.
      </p>
      <h2>Sending a brief</h2>
      <p>
        When online sending is configured and you choose “Send project brief”,
        your name, email, company, selected services, message, budget and
        deadline are sent to HUGs Creative through its email delivery provider,
        Resend. These details are used to review and respond to the inquiry. The
        website does not add you to a mailing list.
      </p>
      <h2>Data handling</h2>
      <p>
        This preview has no contact database, advertising trackers or marketing
        cookies. A temporary, hashed network identifier may be used to limit
        repeated form requests. Hosting and email providers may maintain their
        own operational logs. Email retention, the business contact responsible
        for requests, and any applicable international data processing terms
        must be confirmed for the published service.
      </p>
      <h2>What to share</h2>
      <p>
        Please send only what is needed to understand the project. Leave
        passwords, confidential account access, and payment information out of
        the brief.
      </p>
      <Link href="/#contact" className="glass-button">
        Back to contact
      </Link>
    </main>
  );
}
