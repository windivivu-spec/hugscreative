import { site } from "@/data/site";
import SectionLabel from "@/components/ui/SectionLabel";
const items = [
  [
    "What do you need to get started?",
    "Share your goals, the services you need, your target deadline, and any existing assets or references. We’ll clarify the scope with you.",
  ],
  [
    "Can you work with our existing footage and brand guidelines?",
    "Yes. Share your footage, images, and brand guidelines so we can assess what is usable and identify any gaps.",
  ],
  [
    "How do pricing and revisions work?",
    "We quote based on the project scope. Deliverables, revision rounds, and any additional costs are agreed before work begins.",
  ],
  [
    "Do you support both brands and agencies?",
    "Yes. We work directly with brands on individual projects or ongoing content, and support agencies with specialist creative production. Your dedicated project lead coordinates the scope, team, and feedback.",
  ],
  [
    "How do you coordinate with U.S. clients?",
    "Projects are coordinated remotely through a dedicated contact. We agree on communication channels, meeting times, and feedback milestones at the start.",
  ],
  ["Where is event photography available?", site.photographyCoverage],
];
export default function FAQ() {
  return (
    <section className="faq-section" id="faq" aria-labelledby="faq-heading">
      <div>
        <SectionLabel index="04">A LITTLE CLARITY BEFORE WE START</SectionLabel>
        <h2 id="faq-heading">
          <em>Good</em>
          <br />
          questions.
        </h2>
      </div>
      <div className="faq-list">
        {items.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <span aria-hidden="true" className="faq-toggle" />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
