import Link from "next/link";
export const metadata = {
  title: "Privacy notice | HUGs Creative",
  robots: { index: false, follow: false },
};
export default function Privacy() {
  return (
    <main className="legal-page">
      <Link className="wordmark" href="/">
        <img src="/hugs%20creative%20logo.png?v=3" alt="HUGs Creative" width="1322" height="490" />
      </Link>
      <span className="eyebrow">PRIVACY NOTICE</span>
      <h1>
        Your ideas.
        <br />
        Your <em>information.</em>
      </h1>
      <p>
        This notice explains how this website handles project inquiries.
      </p>
      <h2>Sending by email</h2>
      <p>
        “Open email draft” passes your brief to your email app. You can review
        the draft before sending it to HUGs Creative.
      </p>
      <h2>Sending a brief</h2>
      <p>
        When online sending is configured and you choose “Send project brief”,
        your contact information, selected services and any optional answers you
        provide, such as your job title or target market, are stored in Google
        Forms. Brevo sends an acknowledgement by email. When the alternative email delivery configuration is in use,
        Resend delivers the inquiry. These details are used to review and respond to the inquiry. The
        website does not add you to a mailing list.
      </p>
      <h2>Data handling</h2>
      <p>
        A temporary, hashed network identifier may be used to limit
        repeated form requests. Hosting and email providers may maintain their
        own operational logs.
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
