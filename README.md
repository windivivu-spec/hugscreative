# HUGs Creative

Runnable creative-agency mockup for the U.S. market. Next.js App Router, React, TypeScript, Tailwind, GSAP and ScrollTrigger. Approved OVSoge + Retroscope Italic pairing, pink #EB2266, near-black and warm white.

## Run

```sh
npm install
npm run dev -- --port 3107
```

Open the Local URL shown in the terminal. `npm run build`, `npm run typecheck`, `npm run lint` and `npm run test` verify the project. Webpack avoids a restricted-environment Turbopack worker-port issue.

## What is included

Creative hero, playable 15-second silent concept reel, 3D portfolio ring, four scroll-driven service chapters, five-service preview/brief selection, marquee, filterable archive, supplied biography, separate animated three-step process, agency/brand collaboration section, five-question FAQ, contextual multi-service project brief and privacy notice. Eight standalone concept case studies use the same data as the gallery.

The mockup’s form reviews and downloads a brief locally. Email delivery code is prepared but remains inactive until configured. Nothing is presented as sent in preview mode. Portfolio and reel use clearly labeled concept/stock content, to be replaced with approved work supplied by the owner.

## Editing

- `data/site.ts`: public contact details and reel.
- `data/projects.ts`: project media, industry, brief, role and deliverables.
- `data/services.ts`: floating media chapters.
- `styles/tokens.css` and `app/globals.css`: brand, responsive layout and typography.
- `components/sections/`: page sections; `components/ui/`: reusable controls and dialogs.
- `lib/brief.ts`: shared form rules and brief formatter.
- `.env.example`: optional email and public contact configuration. Secrets belong only in environment variables.
- `scripts/build-demo-reel.py`: reproducible stock reel.
- `scripts/check-local.py`: ten local HTTP smoke checks, stops if email is configured. Run only on localhost:3107.
- `docs/brief-coverage.md`: current 28-item scope mapping.
- `docs/handoff/`: flow, motion, QA, assets and importable wireframes. No native Figma artifact is claimed.

Append `?debug=1` for the development panel. Native reduced-motion preference switches service/process chapters to normal document flow.

This work is local. No hosting, external publishing, analytics transmission or real email delivery was performed. Publication needs owner-supplied work and contact information, rights/coverage confirmation, final privacy copy and deployment verification.
