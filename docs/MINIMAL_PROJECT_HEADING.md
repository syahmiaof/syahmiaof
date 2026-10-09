# Minimal project heading and CerviScan update — 2 October 2026

## Request and inspection (phases 1–2)

The owner replaced the previous framed chapter direction with a text-only `My active project` header and explicitly requested in/out animation, Greetly title motion and hover effects on large homepage section headings. The original chapter tied entrance to its padded container's scroll progress, so the text could finish entering before reaching a prominent viewport position. Greetly's title was static. Existing section headings already used distinct AnimatedTitle variants, but PointerMotion selected only the hero, quote and journey headings.

Keep the incumbent fonts, palette, other section choreography, hero, quote and Greetly device sequence. Reuse AnimatedTitle for a heading-triggered chapter reveal and Greetly; broaden the existing pointer binding without adding loops or dependencies. Update CerviScan from the owner's new domain, repo and stated responsibility.

## Implementation and static checks (phases 3–4)

- ProjectChapter contains only the requested heading; removes panel graphic, icons, supporting copy and category links.
- New `chapter` SplitText variant uses a masked vertical reveal with restrained rotation, a timed entrance when text reaches 80% of the viewport, a readable hold and a reversible exit. Greetly uses the existing editorial variant.
- PointerMotion targets every AnimatedTitle heading. Existing CSS changes color and GSAP moves the outer heading; scroll animation operates on inner split lines. Reduced motion disables both.
- CerviScan uses https://cerviscan-ai.syahmiaof.my/ and https://github.com/syahmiaof/CerviScan-AI. Copy attributes CMS dashboard, video streaming and YOLOv8 integration to Syahmi within a team project still in development.
- The new WebP is a public dashboard screenshot captured after its chart animations settled, excluding the patient table. Visible caption and EXIF provenance identify prototype/demo content. Metrics and regulatory labels in the pictured UI are not endorsed as verified achievements.
- Removed unused chapter styles. No changed dependency or secret. Existing unrelated certificate experiments remain untouched.

## Verification, critique and repair (phases 5–9)

| Check | Result |
| --- | --- |
| npm run build | PASS |
| npm run typecheck | PASS |
| ESLint on changed TS/TSX files | PASS |
| npm run lint | FAIL: existing .github/badges/index.js require-import errors; unrelated unused-variable warnings |
| npx playwright test tests/project-chapters.spec.ts tests/section-motion.spec.ts tests/motion.spec.ts tests/greetly-sequence.spec.ts tests/live-motion-dock.spec.ts --workers=1 | PASS, 30/30 |
| Browser capture at 1440x900, 1280x900, 390x844 | No horizontal overflow, page errors or non-aborted failed requests |

Tests observe intermediate entrance opacity rather than only a completed title. They cover title hold, exit, reverse scroll, emerald hover color, pointer translation, cleanup, rapid resizing, keyboard disclosures, 320px layout and automated accessibility. Existing hero gaze/greeting, touch behavior, Greetly frame cache/fallback, journey title hold and Symi dock also pass. All thirteen AnimatedTitle section headings retain layout when motion is toggled.

Self-review found capture timing issues: external chart animation needed to settle, and lazy portfolio images needed decoding before screenshots. Capture scripts were corrected. No application fallback was removed to conceal a failure. Independent finish review and documentation check complete the bounded visual pass.

## Cleanup and delivery (phases 10–11)

Source-only changes, optimized screenshot and provenance, focused regression tests and this report form the delivery. Temporary capture scripts/images remain in the ignored review directory. The final response reports the commit and production deployment status separately. This change does not validate clinical performance or the external application's backend/video inference pipeline.
