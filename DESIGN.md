---
name: SYAHMI AOF — Digital Infrastructure
description: An editorial systems atlas connecting human identity, software, and infrastructure.
colors:
  bg-primary: "#0b0e0c"
  bg-secondary: "#111713"
  fg-primary: "#e9ece3"
  fg-muted: "#9da89e"
  fg-dim: "#798b7e"
  signal-primary: "#63dfb0"
  border-subtle: "#29372d"
  border-strong: "#455b4b"
  button-ink: "#092016"
  button-hover: "#a0f0cf"
  selected-surface: "#173e2b"
typography:
  display:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(96px, 12.2vw, 190px)"
    fontWeight: 550
    lineHeight: 0.84
    letterSpacing: "-.04em"
  headline:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(40px, 4.8vw, 76px)"
    fontWeight: 500
    lineHeight: 1.07
    letterSpacing: "-.04em"
  title:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(26px, 2.7vw, 42px)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-.04em"
  body:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: ".035em"
rounded:
  square: "0"
  control: "3px"
  dialog: "4px"
spacing:
  small: "8px"
  medium: "16px"
  large: "24px"
  broad: "32px"
  section-mobile: "70px"
  section-desktop: "110px"
components:
  button-primary:
    backgroundColor: "{colors.signal-primary}"
    textColor: "{colors.button-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "19px 22px"
  button-primary-hover:
    backgroundColor: "{colors.button-hover}"
    textColor: "{colors.button-ink}"
  text-link:
    textColor: "{colors.fg-primary}"
    typography: "{typography.label}"
    padding: "12px 0"
  text-link-hover:
    textColor: "{colors.signal-primary}"
  capability-tab:
    backgroundColor: "{colors.bg-primary}"
    textColor: "{colors.fg-primary}"
    rounded: "{rounded.control}"
    padding: "14px 16px"
  capability-tab-selected:
    backgroundColor: "{colors.selected-surface}"
    textColor: "{colors.signal-primary}"
  search-field:
    textColor: "{colors.fg-primary}"
    padding: "13px"
  status-chip:
    textColor: "#c3d1c5"
    padding: "6px 9px"
  command-dialog:
    backgroundColor: "{colors.bg-secondary}"
    textColor: "{colors.fg-primary}"
    rounded: "{rounded.dialog}"
    width: "600px"
---

# Design System: SYAHMI AOF

## Overview

**Creative North Star: "The Editorial Systems Atlas"**

Graphite spreads, warm off-white type, and emerald signals connect a human identity to technical architecture. The recurring node, line, and signal motif gives the portfolio a coherent diagram language. Large typography and asymmetric image placement establish hierarchy; flat surfaces and thin rules keep the interface precise.

This record describes the implementation in `src/app/globals.css`, `src/app/responsive.css`, the shared layout, and its navigation, journey, capability, and scene components. The chosen world comes from `DIRECTION.md`; source-backed claims, original portrait use, and accessible alternatives follow `PRODUCT.md`. Spatial media enriches the page without owning its information.

**Key Characteristics:**

- Architectural display type paired with restrained monospace controls.
- Dark tonal surfaces, thin rules, square nodes, and sparse emerald emphasis.
- Editorial asymmetry with readable DOM architecture alongside spatial media.
- Native scrolling and responsive, motion-aware rendering.

## Colors

The palette is green-tinted graphite with warm text and a clear emerald action signal.

### Primary

- **Emerald Signal** (`signal-primary`): primary CTA, active node, current state, focus outline, and small network markers.
- **Pale Signal** (`button-hover`): the primary CTA's hover fill.
- **Deep Signal Surface** (`selected-surface`): selected capability background, paired with emerald text and border.

### Neutral

- **Graphite Ground** (`bg-primary`): body, capability nodes, and fixed experience controls.
- **Graphite Panel** (`bg-secondary`): modal, lab, case-study sections, and image fallback.
- **Warm White** (`fg-primary`): identity, headings, and primary reading content.
- **Sage Gray** (`fg-muted`): secondary prose and control metadata.
- **Dim Sage** (`fg-dim`): tertiary annotations; its presence does not establish a minimum legibility standard.
- **Graphite Rule** (`border-subtle`) and **Strong Rule** (`border-strong`): section divisions and more visible interactive/container boundaries.
- **Dark Button Ink** (`button-ink`): text over bright emerald surfaces.

The scene uses additional material and light colors, including a restrained cyan directional light. These scene-specific shades do not create a second UI action palette. Declared but unused CSS color variables are not promoted into this token set.

**The Signal Has Meaning Rule.** Emerald identifies an action, current state, focus, or a node in the system; preserve that relationship when extending the interface.

## Typography

**Display and Body Font:** Space Grotesk, with sans-serif fallback.  
**Label/Mono Font:** IBM Plex Mono, with monospace fallback.

Both fonts are bundled locally through `next/font/local`, preloaded with swap behavior. Space Grotesk provides variable weights from 300 to 700; IBM Plex Mono is loaded at 400. CSS maps the generated font variables to the display and mono stacks.

### Hierarchy

- **Display:** the large identity uses the frontmatter display role. Its tablet override is 13vw; the mobile override is clamp(85px, 20.7vw, 150px), with .88 line height and -.04em tracking.
- **Headline:** the frontmatter headline role supplies general section headings. Major editorial moments use larger component-specific sizes, including the Greetly title and lab heading.
- **Title:** the general h3 role follows the frontmatter title scale; compact lists use smaller, explicit sizes.
- **Body:** 14px is the recurring project and architecture prose size. Long-form contexts also use 15–16px, and prominent introductory paragraphs use 20–25px. Body paragraphs retain generous 1.7 line height unless explicitly set for a larger lead.
- **Label:** the frontmatter label role is used for controls and links, usually uppercase. Smaller metadata exists in the build but is not a reusable type-floor recommendation.

**The Two Voices Rule.** Use Space Grotesk for human narrative and headings; use IBM Plex Mono for technical controls, state, and compact metadata.

## Layout

The main content has a 1600px maximum width, centered horizontally, with a fluid gutter of clamp(24px, 4.6vw, 88px). General sections use 110px vertical padding. At 1100px and below, gutters become 36px; at 760px and below, gutters become 23px and general section padding becomes 70px.

The desktop hero combines two equal grid columns with an independently positioned compute scene. About uses a 1.15fr/.85fr split; selected work uses a 1.15fr/.8fr split and a staggered second image. Other compositions deliberately vary between wide images, prose columns, tables of rows, and network maps. Preserve that editorial variety rather than converting everything into uniform cards.

At 760px and below, the primary content grids stack, the journey becomes a vertical list, capability nodes become wrapping tabs, and the expanded device inspection is hidden. The header drops from 82px to 68px and replaces desktop links with a disclosure menu. At 380px and below, secondary hero detail is removed and compact quick-view capabilities become a single column. A 1600px minimum-width rule increases hero scene height and breathing room.

Rendering quality has separate thresholds from CSS layout: viewport width below 760px or any coarse pointer selects LITE; widths from 760px through 1199px select BALANCED on fine pointers; 1200px and above select HIGH. HIGH caps device pixel ratio at 1.5 and enables antialiasing; BALANCED uses DPR 1. LITE and reduced motion retain static SVG/DOM content. The inclusive CSS mobile boundary at 760px and exclusive rendering boundary below 760px are recorded as implemented.

Scenes preload near the viewport using a 180px observer margin. A separate observer tracks actual viewport intersection; canvas renders on demand while visible and stops offscreen. Loading, render errors, and WebGL context loss retain the corresponding static robot or topology fallback. The complete architecture remains available as DOM text and native disclosure content.

**The Native Journey Rule.** Keep native scrolling, direct node selection, and the complete text transcript available; spatial rendering must not gate the story.

## Elevation & Depth

Flat colored surfaces, image crops, borders, and the layered compute assembly provide most depth. Ordinary buttons, project images, and content sections do not use card shadows. The modal and mobile navigation use soft overlays for separation.

### Shadow Vocabulary

- **Command modal:** `0 25px 90px #0009`, with a `#000b` backdrop and 5px backdrop blur.
- **Mobile navigation:** `0 20px 35px #0005`.

Motion reinforces state and spatial relationships: common control transitions take .2s; text-link arrows use .3s with the shared ease-out curve; project images scale to 1.025 over .7s; portrait grayscale transitions over .6s. Scroll-linked hero type, portrait reveal, and footer network movement run only outside LITE/reduced mode. System reduced-motion preference takes priority over the stored user toggle, and CSS suppresses animations/transitions in reduced mode.

The user's 1 October motion expansion adds an original procedural robot to the hero: pale metallic rounded shells, a charcoal visor, emerald circular eyes and a small antenna. Head and pupil movement are damped separately from torso/arm response; a 220ms blink occurs every 4.2 seconds while the scene is visible. Rendering wakes for pointer settling and blinks, rather than continuously. The Greetly device model remains separate.

`PointerMotion` applies GSAP quickTo easing (.75s, power3.out) to large surface tilt (maximum ±6° yaw and ±5° pitch), heading displacement and magnetic CTA movement. A pointer-positioned surface reflection and bounded image scale (1.065 over 1.1s for project previews, 1.045 for the Greetly cover) add depth. Roadmap/lab hover accents and capability node scale complement this. All listeners/tweens are scoped and removed when reduced motion, viewport tier or route changes; the original inline styles are restored.

The homepage entry sequence is a user-requested focal moment: fullscreen SVG nodes connect around “Everything connects.” Finite packet strokes travel for 2.7s before a 1.8-second layered crossfade overlaps the receding network with the arriving hero. Mobile uses its own node coordinates to retain a full network composition. Skip/Escape release focus and scrolling immediately; reduced motion, deep links and in-document return navigation bypass the intro. Typography readiness reflects `document.fonts.ready`; the animated network represents the portfolio theme, not live infrastructure. No JavaScript leaves the ordinary page available through a noscript rule.

**The Flat Surface Rule.** Keep content surfaces flat; reserve soft shadows for the existing overlay roles.

## Shapes

The UI is mainly rectilinear: one-pixel rules, square nodes, rectangular imagery, and small signal markers. Native buttons and inputs use a subtle 3px radius; anchor CTAs remain square. The command dialog uses 4px corners. Small circular status dots and diagram circles are native to the node/line/signal world and should not be confused with pill-shaped cards.

The portrait uses a 3:4 desktop crop, grayscale at rest, and color on hover; project images have individual aspect ratios and compositions. Borders carry structure; avoid ornamental glass panels or generalized glow containers.

## Components

### Buttons and text links

The primary action is a flat emerald anchor with dark ink, a minimum height of 54px, uppercase mono text, and an inline SVG arrow. Hover lightens the fill and lifts it by 2px; the mobile hero version uses a 48px minimum height and smaller padding. Text links have a bottom rule, become emerald on hover, and move the arrow diagonally by 2px. Native disabled buttons use .55 opacity and a default cursor; there is no additional pressed-state treatment.

### Chips and capability tabs

Status chips are small rectangular outlined labels rather than rounded pills. Capability controls use a strong border, mono text, and a small square marker; their selected state changes surface, text, marker, and border. They form spatial nodes on desktop and wrapping controls with a 44px minimum height on mobile. Capability and AI tabs use roving focus, arrow keys, Home/End, selected-state attributes, and labelled panels. AI tabs express selection through emerald text and underline.

### Cards / containers

Projects are image-and-caption compositions with open space rather than elevated cards. The credential passport is a bordered ledger with a dark tinted background, 28px desktop padding, and internally divided rows; mobile padding is 22px 18px. It labels self-reported material explicitly. Roadmap rows use native details/summary disclosure; the expansion mark rotates when open.

### Inputs / fields

The command search is the implemented text input: a transparent field inside a one-pixel strong-border wrapper with 13px padding, muted placeholder, and emerald caret. Focus changes the wrapper border to emerald. The input removes its own outline because the wrapper carries its focus state. There is no form-validation, error, or disabled-input design to inherit.

### Navigation and command palette

The header is sticky, nearly opaque graphite, and divided from content by a subtle rule. Desktop links use muted text; hover and current location brighten them, with a small emerald marker identifying the current section. Mobile navigation opens below the header and closes on link activation, outside pointer interaction, or Escape.

The native modal dialog opens through the command button or Ctrl/Cmd+K, provides a labelled search input and close button, supports arrow selection and Enter activation, and shows a written empty state. Selected results use a darker green surface. Native modal behavior supplies focus containment; Escape and backdrop clicks dismiss it. Result selection, hover, and keyboard focus should not be conflated: the source has a selected-result background, not a separate result-hover design.

### Attendance journey

Six connected stage buttons drive a single labelled panel and the optional device scene. Current nodes have an emerald fill; completed nodes and connectors turn emerald. Direct pointer/keyboard selection works in every rendering mode; full-motion scrolling also updates the current stage. The current panel is focusable, and a complete text transcript is available below it. The diagram is labelled as an architecture walkthrough, not a live feed or hardware replica.

### Accessibility and experience controls

Shared focus-visible styling is a 2px emerald outline offset by 6px. A skip link becomes visible when focused. Navigation, main sections, dialogs, tabs, and panels use semantic elements and accessible names; decorative scene content is hidden from assistive technology while meaningful architecture is preserved in text. The fixed motion control exposes its pressed state and stores the user preference when storage is available. No sound, scroll trapping, or drag-only navigation is required.

The implementation also has a cursor annotation for fine-pointer full-motion use and a diagnostics overlay toggled with the tilde key. These are ancillary controls, not required navigation. Small metadata and existing text glyph ornaments remain audit concerns; source inspection alone does not certify every rendered contrast ratio or target size.

## Do's and Don'ts

### Do:

- **Do** use emerald for actions, state, focus, and meaningful network markers.
- **Do** pair Space Grotesk narrative with IBM Plex Mono technical controls.
- **Do** preserve thin rules, rectilinear surfaces, and varied editorial compositions.
- **Do** keep keyboard selection, native scrolling, reduced motion, and DOM architecture available.
- **Do** label conceptual diagrams, future work, and self-reported credentials honestly.

### Don't:

- **Don't** replace the chosen graphite/emerald world with decorative glass or generic glowing cards.
- **Don't** require WebGL, animation, or pointer movement to read project evidence.
- **Don't** invent proof, verification badges, performance metrics, or missing resume downloads.
- **Don't** canonize the existing 6–9px metadata, repeated eyebrow labels, or text glyph ornaments as requirements for new surfaces.

Not canonized: small metadata, repeated eyebrow/section labels, and decorative text glyphs are present in the build; they are recorded as craft-floor drift rather than reusable design rules. They were not repaired during this documentation-only pass.

## Approved cinematic scenes — 1 October 2026

The robot uses clear-coated ceramic shells, dark polished visor panels, metal joints, vents and fasteners. A local Three.js RoomEnvironment produces a one-time 64px reflection map; there is no external HDR asset. Its GSAP entrance overlaps the existing network reveal for 1.8 seconds, with a three-quarter camera arrival, body lift and eye wake. An interrupted intro settles the rig immediately. The established eye tracking remains independent of the entrance rig.

Greetly's six-stage walkthrough uses an original layered device model and an illustrative attendance record. On fine-pointer screens at least 1100px wide and 760px high, a 1900px ScrollTrigger sequence pins the stage 100px below the top and smoothly separates the enclosure, optics, sensor and board before drawing the edge-to-cloud connection. Smaller viewports use selectable stages without pinning; touch presents the record and the full DOM architecture. Existing arrows/Home/End keyboard control remains available. Scene progress uses subscriptions to invalidate demand rendering without pushing frame updates through the React tree.

