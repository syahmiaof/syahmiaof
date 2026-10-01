# Validation record

Validated locally through 1 October 2026, using the production Next.js build and installed Microsoft Edge through Playwright.

## Build and behavior

| Check | Result |
| --- | --- |
| TypeScript | Pass — `npm run typecheck` |
| ESLint | Pass — `npm run lint`, no warnings |
| Production build | Pass — static homepage, quick view, case study and metadata routes |
| E2E coverage after network intro | 31 passed — 8 intro tests and 23 portfolio regression tests run separately |
| After final typography and mobile subtitle fixes | Production rebuild passed; all six responsive/navigation checks passed |
| Slower layered intro-to-hero transition | Production rebuild and 10/10 intro tests passed; desktop/mobile transition captures reviewed |
| Robot and pointer effects, 1 October | Production build and lint passed; combined suite: 39/39 passed (10 intro, 6 motion, 23 portfolio) |
| Cinematic robot and Greetly breakdown, 1 October | Production build and full lint passed; combined suite: 43/43 passed, adding 4 cinematic lifecycle, scroll and fallback checks |
| Early-load skip focus regression | Skip and Escape cases passed three repetitions each with two workers after hydration readiness fix |
| Automated accessibility | No axe WCAG 2 A/AA and 2.1 AA violations on `/`, `/quick`, `/projects/greetly` |

Behavior checks cover command search and empty results, focus trapping/restoration, keyboard navigation, mobile menu, architecture and capability tabs, full architecture transcript, motion preference persistence, OS reduced motion, missing image fallback, unavailable WebGL fallback, skip navigation, 404 and metadata endpoints. Automated axe checks supplement, rather than replace, manual accessibility evaluation.

The network intro's production build, lint, desktop/mobile visual confirmation, lifecycle and accessibility evidence are recorded in [INTRO-REVIEW.md](INTRO-REVIEW.md). Its final reveal preserves the original hero composition.

The robot and cursor interaction expansion is recorded in [MOTION-REVIEW.md](MOTION-REVIEW.md), including touch/reduced-motion behavior and a WebGL draw-call check proving the robot stops rendering offscreen.

## Visual inspection

Desktop 1440×1000, laptop 1280×800, tablet 768×1024, mobile 390×844, small mobile 360×800 and the app's 1270×714 viewport were captured. Automated layout tests additionally cover 1920px width. Homepage section captures and both secondary routes were inspected on desktop and mobile.

The finish review identified two bounded fixes: overly tight headline tracking and missing whitespace when the Greetly subtitle's line break disappears on mobile. Both were corrected. Final review disposition and evidence are recorded in [REVIEW.md](REVIEW.md).

Reproduce captures with a running production server on port 3100:

```sh
node scripts/capture-qa.mjs
```

Outputs live in `.impeccable/review/`, excluded from version control. `browser-report.json` records runtime errors, horizontal overflow and load-only paint measurements before scripted scrolling.

## Performance evidence and limits

The subsequently added homepage introduction intentionally takes approximately 4.5 seconds before revealing the hero on a fresh load. The following measurements predate that intro and must not be presented as the current first-visit hero visibility time. Reduced motion and deep links bypass the sequence; all visitors can skip it. The new network uses bounded SVG/CSS animation, not another canvas.

An isolated measurement before the final spacing-only fix used three fresh browser contexts per viewport, no scrolling, no CPU/network throttling and a localhost production server:

| Metric | Desktop 1440px | Mobile viewport 390px |
| --- | --- | --- |
| Initial LCP range | 376–592 ms | 344–412 ms |
| Initial LCP median | 396 ms | 368 ms |
| CLS | 0.0031 | 0.0033 |
| Initial resource transfer | ~616 KB | ~311 KB |

These are local smoke measurements, not deployed Core Web Vitals, real mobile hardware results or a Lighthouse score. The LCP element was the first hero title span. Reproduce with `node scripts/measure-load.mjs`; output is `.impeccable/review/load-report.json`.

Earlier screenshot-run LCP values of 5–9 seconds were invalid as initial-load measurements: observers remained active while automation scrolled through later content. The capture script now snapshots the metric before scrolling; those earlier values are excluded from performance claims.

Desktop 3D loads near visible scenes, renders on demand and stops rendering offscreen. Mobile/coarse pointer and reduced-motion users retain the SVG/DOM content. All essential information is available without the canvas. Field LCP/INP, throttled mobile performance, Safari/Firefox and physical device GPU behavior remain deployment validation work.

## Release configuration

- Configure the real `NEXT_PUBLIC_SITE_URL` (or Vercel production origin), then run `npm run check:deploy` and rebuild. No public domain is invented in this project.
- Resume requests use email because no CV file was supplied. No fabricated LinkedIn link exists.
- Credentials are self-reported; future work and certification targets are explicitly labelled.
- No production deployment, Git push, analytics collection or external contact message was performed.
