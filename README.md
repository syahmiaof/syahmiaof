# SYAHMI AOF — Digital Infrastructure

A Next.js portfolio with an editorial homepage, demand-rendered infrastructure scenes, an interactive Greetly architecture walkthrough, a recruiter overview and a sourced project case study.

## Run

Node.js 22.9+ (tested on Node.js 24).

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000.

## Validate

```sh
npm run typecheck
npm run lint
npm run build
npm test
```

Playwright uses installed Microsoft Edge. On machines without Edge, change `channel: 'msedge'` in the Playwright config to an installed browser, or install Chromium with `npx playwright install chromium` and remove the channel setting. E2E tests run against the production build on port 3100.

## Routes

- `/` — full portfolio narrative and interactive capability / architecture views.
- `/quick` — concise recruiter overview without WebGL or homepage animation dependencies.
- `/projects/greetly` — technical case study with source links.

## Controls

- Fresh homepage load/reload: a ~4.5-second fullscreen network introduction converges into the hero. Skip intro or Escape exits immediately. Deep links, client-side return navigation and reduced motion bypass it. The network is illustrative; typography status reflects actual local font readiness.

- Ctrl/Cmd+K: searchable command palette; arrow keys and Enter select; Escape closes.
- Mobile menu: native links with Escape / outside dismissal.
- Architecture, capability and AI tabs: arrow keys, Home / End, pointer or touch.
- Motion control: persists locally. OS reduced-motion preference takes precedence.
- Desktop hero: the original 3D robot follows your cursor with its head and eyes, blinks, and reacts when approached. Project/portrait surfaces tilt, large titles respond and selected CTAs have magnetic movement. Touch and reduced motion use the static robot and native controls.
- Cinematic desktop: the robot wakes and the camera arrives during the network reveal. In the Greetly walkthrough, scroll separates the device layers and carries the event into an illustrative attendance record. Large screens pin this walkthrough briefly; compact screens and reduced motion keep direct stage selection.
- `~`: diagnostics with actual quality mode and current route; no invented FPS counter.

## Content

Content lives in `src/data/`. Original portrait: `syahmi.jpg`. Production assets: `public/images/`.

- Public repositories and project sources are documented in [docs/SOURCES.md](docs/SOURCES.md).
- Greetly uses the current edge script's OpenCV LBPH implementation as the authority where the README differs.
- The Greetly image is repository concept artwork, clearly labelled, not a photograph of built hardware.
- Nurizma Bridal's linked site currently uses Hanim Henna branding; the copy states this.
- Certification titles on GitHub are self-reported. No issuer verification has been inferred.
- The roadmap is aspirational. No future concept is presented as shipped.
- A resume file and LinkedIn URL were not supplied. Resume links request it via the public email; no fake download or LinkedIn URL is rendered.

## Deployment

Set `NEXT_PUBLIC_SITE_URL` to the real public HTTPS origin before building. Vercel's `VERCEL_PROJECT_PRODUCTION_URL` is also accepted automatically. Local builds omit canonical/sitemap URLs until a public origin is configured; social metadata uses a local origin for preview only.

```sh
npm run check:deploy
npm run build
npm run start
```

Vercel can deploy this as a standard Next.js project. For another Node host, use the production commands above and expose the port through your host's reverse proxy. No API keys, authentication service or database is needed for this portfolio.

No deployment or repository push is performed by the local build task.

## Engineering

- Three.js / React Three Fiber dynamically load only near visible desktop scenes. The canvas renders on demand and pauses offscreen. Mobile, reduced motion and scene failures retain the SVG/DOM experience.
- Shared capability hooks respond to OS preference and viewport changes; GSAP timelines use scoped cleanup.
- All substantive architecture information exists outside the canvas, including a complete text transcript.
- Local preloaded WOFF2 fonts, WebP images, `next/image`, static route generation and explicit dimensions limit loading work and layout shifts.
- Contact uses ordinary mail links; there is no broken or unconnected contact form.
- No analytics collector is installed. Conversion actions to measure later: case-study open, source click, quick-view use and email contact. No invented conversion results.

See `PRODUCT.md`, `DIRECTION.md`, `DESIGN.md` and `docs/QA.md` for design and validation records.
