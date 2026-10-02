# Project chapter refinement — 2 October 2026

## Scope and evidence

The homepage now separates Active Projects, Ongoing Projects and Collaboration. Existing fonts, colors, hero, Greetly artwork/sequence and architecture walkthrough are retained. This implements the owner's request to make project categories clear without redesigning the portfolio.

Sources inspected: current portfolio source at 997e63c; local CerviScan-AI draft and dashboard source; GayongX project draft and initial website source; public CerviScan-AI and Sistem Aduan Asrama homepages. CerviScan uses mock data; clinical metrics, regulatory labels and completed device integration are not represented as verified achievements. GayongX's full ecosystem remains in development.

The Aduan image is an actual public homepage capture from https://sistem-aduan-asrama-ikm.web.app/ on 2026-10-02, converted to WebP with source/date metadata. No authenticated records or forms were accessed.

## Workflow evidence

1. **Inspect:** Read rules.md, existing components, motion lifecycle, responsive CSS, tests, local Next.js guidance and GSAP skills. The six referenced docs/design files do not exist; actual code and incumbent DESIGN.md supplied the visual baseline.
2. **Plan:** Create an Active Projects chapter; reduce Greetly's title; replace dummy planned entries with two sourced development records; add Aduan proof; place collaboration after all projects.
3. **Implement:** Add ProjectChapter and OngoingProjects, extract unchanged Lab, scope styling in projects.css, update project data, Quick View and Symi's project list. No new dependency.
4. **Static verification:** Types, imports, removed future-project references, image path, semantic headings and external link attributes checked. git diff --check passes.
5. **Run:** Production build and typecheck pass. Targeted ESLint passes. Deployment origin check passes. Full test suite and focused retries recorded below.
6. **Browser verification:** Edge captures at 1440x900, 1280x900 and 390x844 show project boundaries and loaded Aduan screenshot. No horizontal overflow, page errors or non-aborted failed requests in capture pass. Keyboard disclosure/navigation and automated accessibility checks pass at 320, 390, 1280 and 1440px.
7. **Self-critique:** Category heading is larger than project names. One scoped GSAP timeline assembles, holds and exits; it reverses with scroll and cleans up when motion is disabled. No new perpetual animation or WebGL scene. Lazy-image capture initially ran before decoding; corrected the capture timing rather than changing working image behavior.
8. **Repair:** Fixed ambiguous heading selector and awaited lazy image availability in the new test. Independent visual review requested moving development chips below project names; applied with explicit spacing and recaptured all target widths.
9. **Regression:** Existing Greetly sequence/cache/fallback, walkthrough, mobile/touch, navigation, Quick View, project routes, title motion, Symi and accessibility tests passed in the full run. Two intro timing tests passed when rerun sequentially.
10. **Cleanup:** Removed obsolete dummy-project component/styles/types. Unrelated untracked cloudhunt calibration/test images preserved and excluded from commit. No raw Word drafts copied into public assets. GitHub's incoming generated profile-graphics commit fast-forwarded without altering application changes.
11. **Report:** This file records implementation and verification limits; final user response reports delivery and remaining failures explicitly.

## Commands and results

| Command | Result |
| --- | --- |
| npm run build | PASS, all 11 static pages generated |
| npm run typecheck | PASS |
| ESLint on all changed TS/TSX files | PASS |
| npm run check:deploy | PASS, syahmiaof.my origin |
| npm run test | Initial full run: 73 passed, 6 failed out of 79 |
| playwright focused retry: project-chapters + two intro cases, workers=1 | PASS, 8/8 after selector and lazy-image test repairs |
| playwright project-chapters final, workers=1 | PASS, 6/6 |
| npm run lint | FAIL on pre-existing CommonJS require rules in .github/badges/index.js; unrelated unused-variable warnings |

Three existing tests remain inconsistent with current owner changes: contact-symi expects the old NetAcad event name; credentials catalog forbids the now-committed certificate images; credentials verification assumes all links are Coursera and match the previous accessible-label format. Those product changes were preserved. The full suite has not been declared green; intro timing failures under concurrent load remain a test-stability limitation despite passing isolated retries.

No end-to-end cancer diagnosis, clinical validation, GayongX backend workflow or authenticated Aduan submission was tested. Those are external projects, not features implemented by this portfolio change.

## Design documentation check

Checked PRODUCT.md, DESIGN.md, .impeccable/design.json, the six project/section components, homepage composition, project data and projects.css against all 15 supplied Active, Ongoing, GayongX, Aduan and Collaboration captures at 1440, 1280 and 390px. The development chips now sit below project names; the framed Active heading outranks Greetly, the Aduan capture is visible, and Collaboration follows both project groups. This pass inspected source and saved captures, not a new live browser session.

This is an ordinary extension of the incumbent dark green/emerald, Space Grotesk/IBM Plex Mono editorial system. The scoped heading sizes and chapter surface are local composition choices; DESIGN.md and its sidecar remain unchanged. Existing eyebrow labels, small metadata and older scene-specific documentation are not promoted into new reusable rules or repaired by this scoped pass.
