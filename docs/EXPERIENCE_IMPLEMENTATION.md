# Experience implementation evidence

Date: 8 October 2026. Scope: ordinary homepage extension in Experience/read mode. Local implementation and validation only; no publication or deployment performed.

## Changed

| File | Responsibility |
| --- | --- |
| `src/data/experience.ts` | Typed, owner-supplied roles and the shared section narrative. |
| `src/components/sections/Experience.tsx` | Semantic chapter articles, native anchor index, active chapter tracking, shared title motion and restrained rule reveals. |
| `src/components/sections/experience.css` | Asymmetric desktop composition, mobile chapter stack, readable role hierarchy and motion-aware states. |
| `src/app/page.tsx` | Places Experience after About and before Philosophy and project work. |
| `src/components/sections/About.tsx` | Adds “Explore my experience” beside the existing quick-view link. |
| `src/components/navigation/Navigation.tsx` | Adds “Explore experience” to command search without expanding primary navigation. |
| `tests/experience.spec.ts` | Content, accessibility, navigation, responsive and no-JavaScript checks. |
| `docs/EXPERIENCE_IMPLEMENTATION.md` | Implementation, verification and design-alignment record. |

## Content and source boundaries

The owner's attached brief (`Pasted text.txt`, attachment `3d2a2425-4bb2-4b81-997c-4c8e344e3182`) is the source for five curated roles: Takaful advisor; part-time administrator at NADI / Pusat Internet; freelance web developer; founder, coach and operator of Akademi Persilatan Daeng Kuning; and current digital marketer at Ghazwah. Chapters express People → Operations → Building → Leadership → Growth systems, not a dated employment chronology.

The RM15,000 TUBE SME Corp grant is an owner-supplied fact, not an independently verified credential or a campaign-performance claim. The implementation invents no dates, clients, revenue, campaign results or employment. “Working toward Cloud / DevOps engineering” remains explicitly aspirational. Entrepreneurship runs through freelance delivery and academy operations rather than adding a redundant sixth entry. Each role has three transferable capabilities supported by its responsibilities. Security-guard experience is omitted as requested.

## Design and motion

The desktop composition uses a sticky left chapter index and open editorial chapters on the right. It inherits graphite backgrounds, warm text, emerald state indicators, Space Grotesk narrative and IBM Plex Mono metadata. Thin rules, role headings and generous spacing supply structure without cards, timelines, logos or new assets. The conclusion links into `#work`; related chapters link to existing selected work and collaboration evidence.

At widths of 760px or less, the index becomes wrapping native links above a single readable chapter stack. Role titles are 34px; supporting prose is 16px; skills remain 14px. The grant stacks its value and explanation. Index links retain a 48px minimum height. At viewport heights of 640px or less, the index becomes static even on desktop. These are surface choices, not new global design tokens.

The heading reuses `AnimatedTitle` with its editorial entrance/read/exit treatment. Each chapter rule reveals from the left; there is no new pin, scroll lock, dependency, WebGL scene or animation framework. Scoped `useGSAP` cleanup reverts animation when the reduced-motion preference changes. Native scrolling updates `aria-current="step"` and chapter capability emphasis in both directions. Current chapters also have an arrow on desktop and an underline on mobile, so state is not expressed only by color. All text and anchors remain server-rendered and usable with JavaScript disabled; dynamic active-state tracking requires JavaScript.

## Eleven-phase record

| Phase | Work and evidence |
| --- | --- |
| 1. Inspect | Existing page order, About, navigation, shared motion, design guidance, owner brief and adjacent project behavior inspected before implementation. |
| 2. Plan | Chose a typed content module plus one scoped section and stylesheet, with small About/command-search entry points. |
| 3. Implement | Added the five factual chapters, sticky/native index, responsive layout, shared motion and engineering transition. |
| 4. Static verification | Typecheck and scoped ESLint passed; source checked for semantic structure, imports and lifecycle cleanup. |
| 5. Run | Production build, typecheck, selected Playwright suites and deployment preflight passed. Full-repository lint exposed unrelated existing failures described below. |
| 6. Runtime / visual | Captured entry, leadership and exit at desktop, laptop, mobile and reduced motion. Checked native navigation, keyboard activation, reverse scrolling, short viewport behavior, no-JavaScript content and motion toggle cleanup. |
| 7. Self-critique | Independent five-section finish review returned `ship` with no material fixes. Font-size detector advisories were assessed against the incumbent prose and rendered hierarchy. |
| 8. Auto-repair | Corrected two initial test selector errors: decorative chapter numbers are `aria-hidden` and are not part of a link's accessible name. No feature behavior was changed to satisfy these selectors. |
| 9. Regression | Experience, project-chapters and portfolio suites completed together: 35 passing tests. Existing major sections were not redesigned. |
| 10. Cleanup | No feature debug code, generated asset or dependency added. Unrelated untracked files preserved. Local review captures remain evidence rather than shipping website assets. |
| 11. Report | This record captures behavior, evidence, alignment and remaining limitations; the task's final response provides the concise user report. |

## Checks

Results below record the completed implementation run; this documentation pass inspected the source and saved evidence rather than rerunning the application.

| Command / check | Recorded result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
| Scoped ESLint on changed implementation/test files | PASS |
| `npm run lint` | FAIL: existing CommonJS `require` errors in `.github/badges/index.js` lines 1–2; existing unused-function warning there and unused-import warning in `CredentialRecords`. |
| `npx playwright test tests/experience.spec.ts tests/project-chapters.spec.ts tests/portfolio.spec.ts` | PASS: 35 tests. |
| `npm run check:deploy` | PASS: preflight only, not a deployment. |
| Local production-build smoke on port 3101 | PASS: five chapters, Leadership anchor updates the active chapter, and the conclusion CTA reaches `#work` with its heading in view; no runtime errors recorded. |

## Browser evidence

Saved evidence is under `.impeccable/review/experience/`:

- `runtime.json`: desktop 1440×900, laptop 1280×800, mobile 390×844 and reduced-motion desktop observations. Every recorded scenario has no uncaught page error, no HTTP response of 400 or higher, and no horizontal overflow. Leadership is the active chapter in each sampled state.
- `{desktop,laptop,mobile,reduced}-{entry,leadership,exit}.png`: section arrival, chapter reading and transition out; `mobile-full-chapter.png` preserves the complete leadership entry.
- `toggle-off.png`: manual title read/exit/re-entry and motion-off verification; the implementation run observed removal of split lines and inline rule transforms when motion was disabled.
- `tests/experience.spec.ts`: zero axe violations within Experience, keyboard anchor activation, reverse chapter state, About and command-search access, readable 390×844 and 1280×600 layouts, and native anchors with JavaScript disabled.
- `detector.json`: advisory font-size findings; no token rewrite was made simply to silence the detector.
- `before-about.png` and `capture.cjs`: inspection baseline and repeatable capture script kept in the ignored review directory rather than among shipping assets.

These are browser/emulation observations, not physical mobile-device performance measurements. The saved runtime capture checks uncaught page errors and HTTP error responses; it is not a complete production network or console audit.

## Incumbent design alignment and drift

Experience follows the existing `DESIGN.md` rules: **Signal Has Meaning**, **Two Voices**, **Native Journey**, and **Flat Surface**. It reuses existing palette/spacing variables, inherited typefaces, focus styling and text links. Its variation in editorial scale is consistent with the document's component-specific headings and 15–16px long-form / 20–25px lead prose. The detector's frontmatter-only type-ramp comparison is narrower than the existing prose; the section's literal sizes are documented here as local choices rather than promoted into global tokens.

Pre-existing documentation drift remains: `DESIGN.md` describes Greetly as a procedural device model with a 1900px pinned sequence and older viewport gates, while current `Greetly.tsx` uses `GreetlySequence`, a JPG frame/canvas sequence with its own motion behavior. The incumbent homepage surface brief also predates the current page order. Neither mismatch was caused or repaired by Experience. Previously recorded small metadata and decorative-glyph concerns elsewhere remain uncanonized; this extension is not authority to reuse them.

`DESIGN.md` and `.impeccable/design.json` remain unchanged because this is an ordinary extension of a coherent existing system. No new raster assets require provenance entries. Remaining limitations are the unrelated full-lint failures, owner-supplied facts without independent verification, local/emulated QA scope and absence of a production deployment check.
