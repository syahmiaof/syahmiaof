# Information Architecture & Recruiter UX — Implementation

Date: 2026-10-09. Local implementation; not committed, pushed or deployed by this task.

## ARCHITECTURE

Homepage now presents Hero → About → philosophy bridge → active projects/Greetly → two ongoing previews → skills preview → experience preview → credential highlights → Contact. Full detail lives in `/projects`, `/experience`, `/skills`, `/credentials` and `/lab`. `/quick` is the recruiter overview. Existing case studies remain available.

## NAVIGATION

Primary labels: About, Projects, Experience, Skills, Credentials, Contact. View CV is a separate action. Logo returns home. Current state follows the route and homepage sections. Mobile menu closes on selection, Escape and outside pointer interaction. Page indexes link directly to relevant content. Legacy homepage anchors redirect to relocated content, including stack, collaboration, awards, ongoing builds and experience chapters.

## POSITIONING

Cloud / DevOps is the primary direction, explicitly framed as a cloud computing student building toward engineering. Agentic AI, automation and edge systems remain differentiators. Hero robot, intro and Greetly scene implementation are retained.

## QUICK VIEW

Name, student status, engineering direction, CV/contact, Greetly, three selected projects, five experience entries, core skills and credential highlights. No WebGL or background canvas on this route.

## PROJECTS

Greetly remains the flagship. Purpose comes before its technical mechanism. Homepage keeps the existing active project presentation and previews CerviScan-AI/GayongX; `/projects` contains all active and ongoing entries. Prototype, mock-data and clinical-validation caveats remain intact.

## EXPERIENCE

Five owner-supplied roles: Takaful advisory, NADI/community IT support, freelance development, Daeng Kuning founder/coach/operator, Ghazwah marketing. No employment dates invented. RM15,000 TUBE grant is owner-supplied. Detailed Ghazwah pilot architecture sits below experience rather than duplicating the role summary on the homepage.

## SKILLS

Original logo inventory preserved. Evidence classification separates Used in projects, Hands-on / labs and Currently learning. Project and training badges link to evidence; unlinked profile tools are conservatively presented as learning, not equal production proficiency. Capability map remains interactive.

## CREDENTIALS

Heading: Certificates & Specializations. Counts derive from current data: six programs, 47 course/lab completions, three competition records. Program components, standalone courses, recognition, entrepreneurship context and future industry exam targets remain distinct. Filtered categories can still be reached by direct anchors.

## CONTACT

The verified domain email, WhatsApp and GitHub remain live links. Copy email provides accessible success/failure feedback. CV endpoint produces an actual PDF with preview/download responses. Missing social profiles are omitted. `hello@syahmiaof.my` is the canonical public address; inbound forwarding and outbound delivery were verified by the owner. LinkedIn URL remains unconfigured.

## LINKEDIN

Suggested headline:

Cloud Computing Student | Building toward Cloud & DevOps Engineering | Agentic AI & Automation | Greetly Builder

Suggested About:

I’m a cloud computing student building toward Cloud and DevOps engineering. I build systems that connect web applications, cloud services and edge devices, including Greetly, an attendance system linking local recognition to a cloud dashboard. My work also covers AI agent workflows and automation. Client advisory, community IT support, freelance development and running a silat academy shape how I communicate, solve problems and take ownership.

External LinkedIn was not modified.

## TECHNICAL LAB

Code experiments and Agent/RAG/MCP workflow concepts now live at `/lab`. They remain labelled exploratory rather than production capabilities. The capability mindmap belongs to `/skills`.

## FILES CHANGED

- Routes: `src/app/page.tsx`, `quick/page.tsx`, `credentials/page.tsx`; new `projects/page.tsx`, `experience/page.tsx`, `skills/page.tsx`, `lab/page.tsx`.
- Navigation: `Navigation.tsx`, new `PageIndex.tsx` and `LegacyAnchors.tsx`.
- Sections: new `HomePreviews.tsx`; existing Hero, About, Greetly, SelectedWork, Collaborations, TechStack, Lab, Capabilities and Credentials integrations. Prior uncommitted Experience component/data retained and integrated.
- Shared content: `profile.ts`, `positioning.ts`, `skill-evidence.ts`, projects/capabilities/lab/experience/resume data, Symi grounded context and local links.
- Presentation/contact: new `architecture.css`, Footer, CopyEmail, LiveBackground, layout metadata and sitemap.
- Tests: new information-architecture tests; migrated relevant existing section, experience, project, contact, credential and animation assertions.
- Design reconciliation: `docs/INFORMATION_ARCHITECTURE_DESIGN_REVIEW.md`.

## VERIFIED

Edge/Chromium browser captures for seven core pages at 1440, 1280 and 390px. No horizontal overflow in final checked routes. Active navigation, mobile dismissal, legacy links, credential filter anchors, skill evidence and complete logo inventory, copy email and real PDF verified. Existing regression suite covers hero robot gaze/intro, Greetly sequence/pins, motion toggles, keyboard, accessibility and Symi mocked-provider behavior.

Production smoke test: nine routes HTTP 200, CV HTTP 200 with `%PDF` signature, no captured page errors. Browser emulation is not physical-device performance evidence. Live Gemini provider was not retested in this IA task.

Visual review inspected 21 viewport captures. A flagship label placement finding was fixed; six recaptures were scored resolved, disposition ship for that fix. Lower-page/full-motion visual review was outside that screenshot review's scope. Existing design tokens were preserved.

## CHECKS

- Typecheck: passed.
- `npx eslint src tests`: zero errors; one existing unused-type warning in CredentialRecords.
- Full `npm run lint`: still fails on two pre-existing CommonJS import errors in `.github/badges/index.js`; also existing warnings.
- Playwright: full suite 92/99 passed initially; seven stale assertions updated and all seven passed on recheck. One added moved-hover cleanup test passed. Total 100 unique checks passed across those runs, not a single fresh all-green 100-test run.
- Production build: passed, including route generation.
- Deployment preflight: configured SEO origin `https://syahmiaof.my` passed; this does not deploy.
- QA evidence: `.impeccable/review/ia-test-results.json`, `ia-test-recheck.json`, `ia-browser.json`, `ia-production-smoke.json` (local ignored evidence).

## REGRESSIONS FIXED

Mobile Lab heading overflow; skipped heading hierarchy in Experience; native category links hidden by credential filters; stale credential counts; old hash destinations; preservation of desktop hover effects on moved sections; stale tests for renamed CTAs and updated owner content.

## REMAINING LIMITATIONS

No publish/push in this task. Domain email and LinkedIn need external setup/details. User-provided dates/employment verification and industry certifications were not invented. Wider profile tools need additional evidence to move out of learning classification. Existing PRODUCT.md context predates current CV/domain and was documented rather than silently rewritten.
