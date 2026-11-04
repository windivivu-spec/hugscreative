# HUGs Creative — mockup handoff

## Routes and content

- `/`: hero → concept reel → selected-work orbit → floating service chapters → five-service scope → marquee → archive → about → scroll process → agency/brand collaboration → FAQ → contact → footer.
- `/work/[slug]`: eight shareable concept case studies. Each has category, year, industry, brief, role, proposed deliverables, three media visuals in total, next exploration and a contextual contact action.
- `/privacy`: the preview’s data notice. The final publication policy requires approved business details.
- `/api/contact`: availability check and optional email handler. No API key is required for the mockup. The UI stays in review/download mode without server configuration.

## Visitor flows

1. Hero → Start a project → fill brief → Review project brief → errors or complete-brief notice → Save a copy.
2. Selected work → project modal → Brief / Role / Deliverables → Discuss a similar project → preselected service and project context.
3. Service scope → preview direction → Discuss this service → preselected service.
4. Shareable case URL → contextual brief; Privacy notice opens in a separate tab without losing entries.

## Source of truth

- Palette/layout: `styles/tokens.css`; original approved typefaces in `font/`, browser copies in `public/fonts/`.
- Site contacts and reel replacement: `data/site.ts` and public variables in `.env.example`.
- Project data: `data/projects.ts`. All samples remain explicitly concept work.
- Floating service media: `data/services.ts`.
- Form rules and email text: `lib/brief.ts`; no marketing opt-in or contact database.

## Motion spec

- Hero: clipped line entry and scroll parallax. No blocking intro.
- Reel: 15 seconds, silent stock montage. Starts only on a user play action; native controls. Poster remains visible without playback. Regenerate with `python3 scripts/build-demo-reel.py`.
- Services: sticky four-chapter scene; position, opacity and scale scrub with scroll, staggered card transitions, reverse scrolling.
- Process: separate three-chapter section, 320svh desktop / 280svh mobile. Copy and document cards transition through scroll with progress and direct step buttons.
- Portfolio: perspective orbit with damped rotation, drag, horizontal wheel, arrows and native dialog. Opening/closing preserves ring selection.
- Scope: user-selected visual direction; all essential descriptions remain visible.
- Collaboration: staggered reveal and two interlocking outlined circles on entry.
- Marquee: pause control, stops offscreen or on focus. Reduced-motion uses a static line.
- Reduced motion: GSAP matchMedia disables scrubbing/parallax; CSS places all service/process chapters in document flow. Source reviewed; not OS-emulated during this round.

## Mockup versus publication

This is a complete runnable design/interaction mockup, not evidence of client work or email delivery. Real portfolio/reel, approved contact details, photography coverage and font/media rights remain owner-supplied replacements. The privacy draft, production endpoint configuration, retention policy, distributed anti-abuse controls and domain settings need review before publishing.

The wireframe SVGs are editable/importable into design tools; they are not a native Figma file and do not contain Figma Auto Layout. The running site is the high-fidelity interactive reference. No native Figma artifact was created.

## Optional email setup

Set `RESEND_API_KEY`, `CONTACT_FROM` (verified sender), `CONTACT_TO` and canonical `SITE_URL` on the server. Public contact links use `NEXT_PUBLIC_*` variables, rebuilt into the app. The handler validates inputs, origin, content type, body size and consent, limits local repeated attempts and uses Resend idempotency keys. No secrets or brief body are logged by the application. Provider acceptance is required before a sent state appears; actual inbox delivery has not been tested.

The in-memory attempt limiter is an additional local safeguard. Production/multiple instances require gateway or shared rate limiting. Verify the deployment’s trusted proxy headers; no deployment was performed.

Provider reference: https://resend.com/docs/api-reference/emails/send-email
