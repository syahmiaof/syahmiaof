# Credentials and competition recognition implementation

## Scope and files

Homepage order remains `TechStack → Credentials → Awards → Footer`. Existing heading animation utilities, fonts, colors and the rest of the homepage are preserved.

- `src/data/credentials.ts`: canonical typed records, derived subsets/counts, separate next targets, date formatting.
- `src/types/portfolio.ts`: credential and competition evidence models.
- `src/data/capabilities.ts`: removes conflicting self-reported credentials; roadmap now lives in the canonical credential source.
- `src/data/awards.ts`: compatibility re-export of canonical competition records.
- `src/components/credentials/CredentialRecords.tsx`: reusable summary, program/completion lists, competition records and next-target disclosure.
- `src/components/credentials/CredentialFilter.tsx`: keyboard-operable wrapping category buttons; server-rendered content stays available without JavaScript.
- `src/components/sections/Credentials.tsx`: four featured programs, metadata counts and full-page CTA.
- `src/components/sections/Awards.tsx`: three competition records, retaining the awards anchor.
- `src/app/credentials/page.tsx`: full catalog, metadata, grouped course disclosures and evidence explanation.
- `src/app/credentials.css`, `src/app/layout.tsx`: scoped editorial styling with responsive layout and reduced-motion support.
- `src/app/quick/page.tsx`: replaces outdated self-reported wording and links to the catalog.
- `src/components/navigation/Navigation.tsx`, `src/app/sitemap.ts`: existing command-palette destination and sitemap entry.
- `src/lib/symi.ts`: competition answer uses the canonical result/event fields.
- `tests/credentials.spec.ts`: data, grouping, privacy, labels, filters, keyboard, touch-target, overflow and accessibility checks.
- `tests/contact-symi.spec.ts`, `tests/portfolio.spec.ts`: updates expectations for populated recognition and separate targets.
- `.gitignore`: excludes the private evidence directory.

## Records

43 credential records: 4 professional programs + 39 course/lab completions. The 39 completions comprise 35 program components and 4 standalone courses; they do not represent 39 additional industry certifications.

| Parent program | Components |
| --- | ---: |
| AWS Security Engineer Advanced | 18 |
| Google AI Professional Certificate | 8 |
| Google IT Support Professional Certificate | 6 |
| Whizlabs Google Cloud Professional Data Engineer learning path | 3 |

Three competition records: NetAcad Riders 2026 (Silver Medal), iCompEx 2026 (Silver Medal, SMART V-LIGHT), and CloudHunt National Competition 2025 (4th Place plus MVP Team Member, Most Crowd’s Favourite and Bootcamp Participant). CloudHunt remains one event, not four awards.

40 records provide certificate-extracted Coursera verification links. AWS Cloud Practitioner Essentials, Linux Unhatched and Introduction to Modern AI use certificate evidence without invented verification URLs. Five existing future targets remain separately labelled aspirational.

## Privacy

All 43 PDFs and 8 images were inspected. SHA-256 comparison confirmed all 51 originals unchanged. No raw evidence was copied to public assets, renamed, moved, deleted or staged. No student/identity numbers, other team member names, QR crops or LinkedIn screenshot contents are published. The Linux Unhatched certificate identifier is included as explicitly requested; it is a credential identifier, not a student identity number.

`docs/CURRENT_STATE_AUDIT.md` and `.json` remain untouched and untracked. Temporary extraction and review outputs stay in the already-ignored `.impeccable/review/` directory.

## Accuracy and ambiguous evidence

- AWS Security Engineer Advanced includes the requested full disclaimer distinguishing its Coursera professional program from AWS Certified Security – Specialty exam certification.
- The Whizlabs specialization includes the requested explicit disclaimer that it is not the Google Cloud Professional Data Engineer exam credential. Its public title includes “learning path” and omits “Certified” to prevent misreading.
- AWS Cloud Practitioner Essentials is a course completion, explicitly not the AWS Certified Cloud Practitioner exam credential.
- All supplied records use certificate-only evidence status. A provider verification URL is available evidence, not a claim that independent online issuer authentication was completed in this task.
- Some AWS, Google AI and Whizlabs component certificates have later completion dates than their parent program certificate. Dates are preserved exactly as printed, with an explanation on the public page; no chronology is invented.
- iCompEx organizer logos were not sufficiently clear to confidently transcribe. The record includes the supplied event title, category and venue, without guessing organizers or exposing other participants.
- Lab-titled course certificates are grouped as Guided Lab completions; they are components, never standalone industry certifications.

## Validation

Production build, TypeScript and deployment-origin preflight passed. Source/test lint passed; full repository lint reports pre-existing CommonJS require-import errors at `.github/badges/index.js:1–2` and an unused-function warning at line 123. That unrelated badge generator was left unchanged.

The initial full browser run had 69 passes and four failures: three new 44px-target checks and one intermittent pre-existing Greetly heading timing check. The return link target was corrected to 44px. All four failed tests passed on rerun without changing Greetly. A final full-suite result is recorded in the completion report.

Desktop and mobile browser captures were inspected at 1440px, 390px and 320px. The credentials tests cover visible focus, native disclosures, safe external links, semantic separation of targets, reduced motion, WCAG automated checks and no horizontal overflow. The one design detector pass reported typography-ramp advisories only, reflecting sizes beyond the short existing DESIGN.md ramp; no primary findings.

## Finish review and documentation

Independent Impeccable finish review disposition: **ship**, scoped to the original brief, source and nine supplied desktop/mobile captures. No material fixes requested. The documenter confirmed the extension preserves existing tokens, typography, layout and heading-animation utilities. Shared heading animations already include clip-path effects; this task does not replace that existing animation system.

Pre-existing documentation drift remains intentionally untouched: PRODUCT.md and the old passport descriptions in DESIGN.md / .impeccable/design.json still refer to self-reported credentials without verification links. The actual implementation and this report describe the new evidence accurately. No design-world or token-system rewrite was authorized or needed.
