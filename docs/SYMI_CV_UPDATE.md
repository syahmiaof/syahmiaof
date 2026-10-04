# Symi, CV and GayongX update - 4 October 2026

## Scope
- Keep the existing graphite/emerald design from DESIGN.md, typography, motion and section order.
- GayongX retains its main website image only. Admin and member portal screenshots removed.
- Footer downloads a CV; Quick View, command palette and Symi open the PDF preview.
- Social links and project case-study pages are unchanged.

## Symi diagnosis and repair
Production logs showed Gemini HTTP 503 UNAVAILABLE (high demand), collapsed by the old handler into generic HTTP 500. The local key successfully called Gemini; no key replacement was required.

The server now uses gemini-3.5-flash-lite with gemini-3.1-flash-lite as a bounded fallback for temporary/model availability errors. Both model IDs were tested with the existing key; listing a model alone was insufficient (2.5 model generation returned 404). A 12-second timeout per attempt and a 32-second browser timeout prevent indefinite waiting. Replies use canonical project and credential data, with up to six history turns. Basic contact/CV answers remain available without a model call. Browser errors preserve the question for retry.

Environment variables are server-only: GOOGLE_GENERATIVE_AI_API_KEY (or GEMINI_API_KEY), optional SYMI_GEMINI_MODEL and SYMI_GEMINI_FALLBACK_MODEL. The configured models must support the MINIMAL thinking level. No raw provider exception or API key is returned to visitors. Error logs contain only model/status metadata.

Input validation, same-host browser origin checking, bounded history and best-effort per-instance throttling limit accidental abuse. This is not a distributed global rate limit; Google project quotas remain the global spending guardrail.

## CV maintenance
Edit src/data/resume.ts for curated CV copy; shared name/contact details come from src/data/profile.ts and course titles from src/data/credentials.ts. After deployment, /api/resume generates the current PDF on request; ?download=1 returns an attachment. No Python, browser renderer or external resume service is needed in production. pdf-lib supplies searchable text in a single-column A4 PDF.

The initial CV omits unconfirmed institution names, study dates, grades and employment dates. Coursera programs are not presented as passed AWS certification exams. No claim is made that every ATS vendor has been tested.

## Verification evidence
- Real local browser chat: CerviScan question and follow-up both returned HTTP 200 with source=gemini.
- Browser download returned Muhammad-Syahmi-CV.pdf.
- Desktop 1440, laptop 1280 and mobile 390: one GayongX website image, no horizontal overflow, no JavaScript page errors during the journey.
- PDF rendered and visually inspected at A4, one page; pypdf extracted all headings, project descriptions and contacts in reading order.
- 18 targeted tests passed: contact, chat recovery, alternate-model handling, invalid input, PDF responses, mobile image width, project headings and keyboard behavior.
- Production build and typecheck passed. Touched-file ESLint passed. Repository-wide lint still reports pre-existing CommonJS errors in .github/badges/index.js and an unused credential type warning.
- npm audit --omit=dev reports zero production vulnerabilities; development dependencies have existing audit findings.

## Limitations
Model availability and quotas are external dependencies; fallback improves resilience but cannot guarantee continuous service. Browser QA uses Chromium/Edge emulation, not physical iOS/Android devices.
