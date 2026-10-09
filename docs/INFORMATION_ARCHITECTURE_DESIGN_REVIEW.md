# Information architecture: design-system reconciliation

Date: 2026-10-09. Scope: ordinary extension of the existing portfolio.

`DESIGN.md`, `PRODUCT.md`, and `.impeccable/design.json` remain unchanged. The new information routes extend the established visual language; this work does not approve a replacement identity or regenerate the design tokens.

## Sources checked

- System: `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, `src/app/globals.css`, and font declarations/import order in `src/app/layout.tsx`.
- Extension: `src/app/architecture.css`, `src/components/sections/HomePreviews.tsx`, `src/components/navigation/PageIndex.tsx`, and the Projects, Experience, Skills, and Technical Lab route compositions.
- Context: `src/data/profile.ts` and `src/app/api/resume/route.ts`.
- Direct visual sample: `.impeccable/review/ia-fix-projects-1440.png` and `.impeccable/review/ia-fix-quick-390.png`. These confirm the sampled graphite surfaces, editorial project composition, mobile stacking, and placement of the flagship status beneath its project heading.
- Broader visual evidence supplied by the implementation reviewer: 21 screenshots covering Home, Quick View, Projects, Experience, Skills, Credentials, and Lab at 1440, 1280, and 390 widths, plus six Projects/Quick View fix captures. Reviewer disposition was ship at the scored-fix scope. This documentation pass did not independently inspect all 27 images or rerun browser interactions.

## System comparison

| Area | Observed extension | Relationship to incumbent system |
| --- | --- | --- |
| Palette | Background, text, dividers, hover and status colors resolve through existing custom properties. | Graphite `#0b0e0c`, warm white `#e9ece3`, emerald `#63dfb0`; no additional action palette. |
| Typography | Locally loaded Space Grotesk and IBM Plex Mono remain the shared families. Detail headings use `clamp(42px,5.5vw,80px)`; introductory prose uses 19px/1.6. | Component-specific scale extends the existing headline hierarchy without replacing the global ramp. |
| Structure | Open project/image spreads, ruled preview rows, two-column prose and compact wrapping local indexes. | Preserves editorial variety, thin rules and flat surfaces. No new elevated-card language. |
| Navigation | Local index links have 44px minimum height; the expanded header switches to disclosure navigation at 1000px; mobile current links use emerald and underline. | Extends existing native navigation and focus treatment. The 1000px navigation threshold is task-local implementation evidence, not a revised global breakpoint token. |
| Responsive layout | Main new multi-column compositions stack at 760px; Skills section spacing reduces from 100px to 70px. | Uses the incumbent mobile boundary and readable stacked flow. |
| Motion | Homepage previews reuse `AnimatedTitle`; Projects, Experience, Skills and Lab mount the existing `PointerMotion` component to preserve migrated headings' and images' desktop hover behavior. Mounts were checked directly in all four route sources. | Existing motion grammar and tokens are preserved. The implementation agent reports a passing targeted browser test across all four routes and reduced-motion cleanup; this documentation pass did not rerun it or certify robot or Greetly runtime performance. |

## Durable rules retained

1. **Signal Has Meaning:** emerald identifies actions, state, focus or meaningful system markers.
2. **Two Voices:** Space Grotesk carries narrative and headings; IBM Plex Mono carries compact controls and technical metadata.
3. **Native Journey:** evidence must remain accessible through native navigation and DOM content.
4. Keep varied editorial compositions and rectilinear surfaces; do not turn these information pages into a uniform card grid.
5. Keep status and evidence explicit. Moving the flagship label beneath the project heading does not establish decorative eyebrows as a reusable pattern.

## Context drift recorded, not repaired

- `PRODUCT.md` still states that no CV file or confirmed production domain was supplied. Current source contains a generated PDF endpoint at `/api/resume` and `profile.siteUrl` set to `https://syahmiaof.my`. Source availability is distinct from independent production or mailbox verification.
- The sidecar was generated on 2026-09-30 and retains example links to `#work`. It does not describe every later route or the expanded header's 1000px switch. These documentation differences do not justify regenerating the whole design system for an ordinary extension.
- Existing design documentation already declines to canonize very small metadata, repeated eyebrows/section labels and decorative text glyphs. That exclusion remains in force; the documentation pass does not bless existing craft-floor drift.

No implementation changes, tests, processes, deployments, or external account updates were performed by this documentation pass.
