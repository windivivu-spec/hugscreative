# HUGs Creative

Runnable creative-agency mockup for the U.S. market. Next.js App Router, React, TypeScript, Tailwind, GSAP and ScrollTrigger. Approved OVSoge + Retroscope Italic pairing, pink #EB2266, near-black and warm white.

## Run

```sh
npm install
npm run dev -- --port 3107
```

Open the Local URL shown in the terminal. `npm run build`, `npm run typecheck`, `npm run lint` and `npm run test` verify the project. Webpack avoids a restricted-environment Turbopack worker-port issue.

## What is included

The homepage has six sections: Hero → Selected Work → Services → About & Process → FAQ → Contact. The 3D portfolio ring highlights client work and labeled visual studies. An animated What we do section presents five services through floating media compositions, staggered entrances, a gentle drift, and scroll transitions. Numbered chapter buttons jump between services; short viewports and reduced-motion preferences show all five in normal document flow. Service names are shared with the project categories and contact form. About includes the brand/agency partnership message and a compact three-step process.

`/work` contains the complete, filterable portfolio, including ACB, BVBank, and CityLand commercial videos. Full videos are VP9/Opus WebM and play with sound only when requested; short, muted previews use separate files. Original source videos and posters in `public/media/showcase/video-comercial/` are retained locally and excluded from Git; optimized assets are in `public/media/commercial/`. `/work/social-media` presents Kyoto Sushi, Verita, ChinHuei, Nam Duong Land, Lifehouse, and Wafaifo Hoi An. Each brand has a shareable `/work/[slug]` page and the same content in the homepage project dialog: brand name, industry and solution, client intro, HUGs scope of work, and uncropped showcase artwork. No dates or performance results are inferred from the artwork. Casamia Balanca uses the spelling on the supplied showcase.

The mockup’s form reviews and downloads a brief locally. Email delivery code is prepared but remains inactive until configured. Nothing is presented as sent in preview mode. Six social media client projects use owner-supplied content and artwork from `public/media/showcase/`. The remaining media-pack projects are labeled visual studies.

## Editing

- `data/site.ts`: public contact details and reel.
- `data/projects.ts`: project media, industry, brief, role and deliverables.
- `data/services.ts`: the five canonical service names, descriptions, previews, and portfolio links.
- `styles/tokens.css` and `app/globals.css`: brand, responsive layout and typography.
- `components/sections/`: page sections; `components/ui/`: reusable controls and dialogs.
- `lib/brief.ts`: shared form rules and brief formatter.
- `.env.example`: optional email and public contact configuration. Secrets belong only in environment variables.
- `scripts/build-demo-reel.py`: reproducible stock reel.
- `scripts/check-local.py`: ten local HTTP smoke checks, stops if email is configured. Run only on localhost:3107.
- `docs/brief-coverage.md`: current 28-item scope mapping.
- `docs/handoff/`: flow, motion, QA, assets and importable wireframes. No native Figma artifact is claimed.

Append `?debug=1` for the development panel. Reduced motion disables the hero scroll effects, preview transitions, and automatic portfolio rotation. The service list and process remain in normal document flow.

Production deployment and live email delivery require separate verification.
