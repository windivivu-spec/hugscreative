# Managing the project database

Edit `data/projects.database.json`. This is the single local database used by Home, Services, Work, the archive and project detail pages. No external database service is needed. Changes appear during local development; production changes require a rebuild/deployment.

Each object in `projects` is one project:

- `id`: permanent URL slug, e.g. `kem-trang-tien`. Keep it stable when changing the title.
- `name`: public title, using English / unaccented brand names.
- `category`: one of the six exact names in `data/services.ts`.
- `year`: four digits. Use an empty string for unconfirmed years; the archive displays “Undated”. Provisional years are displayed and remain marked in the database for owner confirmation.
- `description`: brand / client introduction.
- `overview`: the project brief and creative direction.
- `direction`: short service subtitle.
- `image`: cover URL. `gallery`: additional images, in display order. Do not repeat the cover here.
- `videos`: full source, lightweight `previewSrc`, poster and landscape/portrait orientation.
- `contentStatus`: `supplied` for approved/supplied copy, `draft` for copy to revise. `editorNotes` are internal and are not shown on the website.
- `references`: optional source links displayed below the introduction. Website links are shown only when `contentStatus` is `supplied`; confirm the links and content before setting that status.

Use `/media/...` paths, without `public`. Spaces and Vietnamese characters must be URL-encoded. The current `Picture ` folder has a trailing space, so its URL starts `/media/Picture%20/`. Original source folders are preserved.

The 2026 years on existing showcases were retained provisionally. Newly added projects without a supplied year are undated. Kem Trang Tien and Vinamilk are confirmed as 2026; Yen Thien Viet is 2024.

`retiredProjects` records old entries whose source media was removed/replaced; these are not displayed. Existing social, website and event showcases remain in `projects`.

To add a project: duplicate a similar record, give it a unique `id`, fill its copy and media, and run `npm test` plus `npm run typecheck` to catch missing media and invalid links.

For videos with poster/preview paths under `/media/previews/`, run `python3 scripts/generate-project-previews.py` after adding the source file. This requires FFmpeg. Existing generated outputs are skipped; remove only the specific generated preview/poster when regenerating a changed source.

`data/service-visuals.ts` chooses homepage service previews, `data/projects.ts` chooses the orbit entries, and `data/portfolio.ts` controls featured ordering. These reference IDs from the JSON database; full project copy lives only in the JSON file.
