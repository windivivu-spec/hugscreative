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

`/work` is the Projects page, with five service chapters, four featured projects per chapter, a sticky discipline navigation, and links to the full archive. `/work/archive` contains all projects grouped by year. Service and year filters are shareable URLs, for example `/work/archive?service=website-design&year=2026`. Every card links to its own `/work/[slug]` page. The homepage Projects navigation and each What we do chapter link into this collection.

Project content, galleries, videos, years and internal draft notes are managed in `data/projects.database.json`. See `data/PROJECTS.md` for editing instructions. Confirmed years regroup the archive automatically; unconfirmed years display as Undated. Existing showcases are preserved.

The portfolio uses the reorganized `public/media/Picture /`, `public/media/Video/`, website, event and social showcase folders. Generated lightweight posters and previews live in `public/media/previews/`; originals remain in their owner-supplied folders. ACB and BVBank use the supplied custom thumbnail images. Run `python3 scripts/generate-project-previews.py` to generate missing video previews.

The mockup’s form reviews and downloads a brief locally. Email delivery code is prepared but remains inactive until configured. Nothing is presented as sent in preview mode. Six social media client projects use owner-supplied content and artwork from `public/media/showcase/`. New project introductions without owner-supplied copy have internal draft notes in the database.

## Editing

- `data/site.ts`: public contact details and reel.
- `data/projects.database.json`: editable project database; `data/PROJECTS.md`: editing guide.
- `data/projects.ts`: typed database exports and orbit selection.
- `data/project-selections.ts`: compatibility export; project records live in the JSON database.
- `data/portfolio.ts`: featured selection order, year grouping, labels, and archive URLs.
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
