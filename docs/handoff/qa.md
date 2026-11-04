# Verification record

## Executed

- TypeScript and production build passed with `/`, `/privacy`, eight case-study pages and the contact API.
- ESLint passed before the final Host/Origin compatibility adjustment; rerun recorded at final handoff.
- Five meaningful validation tests: personal email accepted, services deduplicated, forged services rejected, consent/length rules, malformed types and invalid calendar dates.
- Browser width checks at 320, 375, 390, 768 and 1440: no document horizontal overflow. Heading reveal wrappers have intentional internal padding.
- Menu at 320px: Escape closes it and restores focus to the menu button.
- Reel: actual playback inspected, duration 15 seconds, readyState 4, currentTime advanced; video has no audio.
- Service action preselects Graphic Design in contact. Empty form focuses the error summary. Valid mock inquiry shows complete-preview state, not sent state.
- Local brief downloaded to the browser’s Downloads folder. No message sent.
- Aura Objects modal links to `/work/aura`. Mobile case study has no document horizontal overflow. Contextual CTA preselects Website Design and fills the project context.
- Native FAQ accordion was verified during the preceding content round.

## Not claimed

- Production email / actual inbox delivery, deployment or live analytics.
- User research or 10-second comprehension testing.
- Full assistive-technology audit, real mobile device matrix, OS-emulated reduced motion, data-saver behavior or field Core Web Vitals. The source includes reduced-motion fallbacks and lazy offscreen media; these are not field-performance measurements.
- Final asset rights, native Figma / Auto Layout deliverable or business/privacy approval.

## Final local HTTP checks

All ten smoke checks passed: availability 200; invalid fields 422; cross-origin request 403; wrong content type 415; valid unconfigured inquiry 503; oversized body 413; malformed JSON 400; `/work/aura` 200; unknown case 404; `/privacy` 200. The script refuses to run against a configured mail endpoint. No external email was sent.

## Optical motion update — 2026-11-03

- Added GSAP blur-to-clear reveals for editorial copy, free-flow sections, cards,
  FAQs and case pages. Services and Process keep their own scrub timelines.
- Desktop blur: 9px; initial small-screen blur: 5px. Completed free-flow reveals
  release the filter. Reduced-motion preference bypasses scroll reveals.
- Pointer-follow masked rims, glass reflection on buttons, focus feedback and
  touch press feedback use the existing HUGs pink palette.
- Browser: captured reel during blur, then confirmed opacity 1/filter none.
  Process step 02 still works. Confirmed active hover rim opacity 1 and actual
  pointer coordinates on a service row. At 390px, filtered projects recalculate
  scroll positions; surviving first card becomes visible and the next reveals
  on entry. No document horizontal overflow in inspected desktop/mobile views.
- Screenshots: motion-glass-desktop.jpg, motion-process-desktop.jpg.
- These are browser viewport checks; physical-phone performance and OS-level
  reduced-motion switching were not measured.
