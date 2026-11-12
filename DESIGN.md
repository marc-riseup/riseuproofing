---
name: Rise Up Roofing & Construction
description: Coastal Architectural Daylight design system for San Diego roofing, solar, and Class B exterior construction specifications and instant ballpark pricing.
colors:
  signal-red: "#E5392B"
  signal-red-deep: "#CC2E23"
  signal-crimson: "#C92D20"
  solar-gold: "#FFC700"
  solar-amber: "#C99700"
  pacific-cerulean: "#2F9FE3"
  survey-blue: "#0F5C8C"
  verified-emerald: "#10B981"
  coastal-ink: "#0B1B2B"
  deep-coastal-ink: "#071524"
  harbor-slate: "#1E3A52"
  driftwood-slate: "#3D566E"
  daylight-paper: "#F4F9FC"
  architectural-white: "#FFFFFF"
  marine-wash: "#E8F1F8"
  sandstone-linen: "#FCF8F0"
  sandstone-umber: "#4A3F31"
  mist-ice: "#C8DDF0"
  brand-crimson: "#D42227"
typography:
  display:
    fontFamily: "Archivo, Arial Narrow, Arial, sans-serif"
    fontSize: "clamp(2.05rem, 0.9rem + 3.45vw, 4.1rem)"
    fontWeight: 800
    lineHeight: 0.99
    letterSpacing: "-0.032em"
    fontVariation: "wdth 110"
  headline:
    fontFamily: "Archivo, Arial Narrow, Arial, sans-serif"
    fontSize: "2.65rem"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Archivo, Arial Narrow, Arial, sans-serif"
    fontSize: "1.7rem"
    fontWeight: 800
    lineHeight: 1.14
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  label:
    fontFamily: "Archivo, Arial Narrow, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0.05em"
rounded:
  none: "0px"
  xs: "6px"
  sm: "10px"
  md: "14px"
  lg: "16px"
  xl: "24px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section-y: "96px"
  container-max: "1400px"
components:
  button-primary:
    backgroundColor: "{colors.signal-red}"
    textColor: "{colors.architectural-white}"
    typography: "label"
    rounded: "{rounded.md}"
    padding: "0px 24px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.signal-red-deep}"
    textColor: "{colors.architectural-white}"
    rounded: "{rounded.md}"
    padding: "0px 24px"
    height: "52px"
  button-dark-band:
    backgroundColor: "{colors.solar-gold}"
    textColor: "{colors.coastal-ink}"
    typography: "label"
    rounded: "{rounded.xs}"
    padding: "12px 24px"
    height: "48px"
  button-outline:
    backgroundColor: "{colors.architectural-white}"
    textColor: "{colors.coastal-ink}"
    typography: "label"
    rounded: "{rounded.xs}"
    padding: "10px 16px"
    height: "44px"
  chip-verified:
    backgroundColor: "{colors.architectural-white}"
    textColor: "{colors.coastal-ink}"
    typography: "label"
    rounded: "{rounded.pill}"
    padding: "4px 18px"
    height: "48px"
  card-spec-plate:
    backgroundColor: "{colors.architectural-white}"
    textColor: "{colors.coastal-ink}"
    rounded: "{rounded.none}"
    padding: "36px"
  input-field:
    backgroundColor: "{colors.architectural-white}"
    textColor: "{colors.coastal-ink}"
    typography: "body"
    rounded: "{rounded.xs}"
    padding: "10px 14px"
    height: "48px"
  ballpark-bar:
    backgroundColor: "{colors.architectural-white}"
    textColor: "{colors.coastal-ink}"
    rounded: "{rounded.lg}"
    padding: "6px"
    height: "72px"
    width: "1024px"
---

# Design System: Rise Up Roofing & Construction

## Overview

**Creative North Star: "The Coastal Architectural Spec Desk"**

Rise Up Roofing & Construction's visual language pairs the clarity of an architectural specification sheet with the open morning light of coastal North County San Diego. Property owners arrive either under acute storm-leak stress or while comparing multi-decade roof replacement bids; the interface earns trust immediately by putting working ballpark pricing, verified license numbers, California building codes (`CRC R908`, `Title 24`), and real San Diego jobsite photography directly on the table without theatrics.

Below the daylight coastal Hero—where morning sky atmosphere and refractive glass instruments frame the cutout San Diego rooftop skyline—the page settles onto crisp, opaque architectural paper, pure white specification plates, warm sandstone testimony linen, and deep coastal ink inspection bands. Information is organized through asymmetric specification spreads, hairline `1px` rules, and tabular metric strips rather than repetitive card grids. The system explicitly rejects 3D/WebGL scroll canvases, smooth-scroll hijacking, fixed full-page background gradients, modal conversion traps, and generic contractor badge clutter.

**Key Characteristics:**
- Daylight-first coastal tonal architecture grounded on cool sky paper, pure specification white, warm sandstone linen, and deep coastal ink.
- Heavy expanded `Archivo` display typography that speaks without eyebrow kickers, paired with crisp `Inter` body copy and strict `tabular-nums` alignment on every price, phone number, license, and building metric.
- Scoped refractive glass reserved exclusively for floating Hero instruments and fixed navigation chrome; all content sections below the fold use solid opaque surfaces and `1px` structural hairlines.
- Conversion built directly into native working instruments—the 10-Second Horizontal Ballpark Bar and Dual-Intent Closing Lead Desk—backed by persistent direct tap-to-call dispatch.

## Colors

The palette balances bright Southern California coastal daylight against high-contrast maritime ink, reserving saturated signal red-orange strictly for primary conversion triggers and solar gold for editorial highlights and dark-surface calls to action.

### Primary
- **Signal Red-Orange** (`colors.signal-red`): Primary conversion fill on Hero and instrument CTAs (`Get a Free Estimate`, `Get My Ballpark`, `Send My Quote`), text input carets, and active dispatch accents.
- **Deep Signal Red** (`colors.signal-red-deep`): Hover and pressed progression state for primary conversion buttons, maintaining confident depth without darkening into mud.
- **Survey Crimson** (`colors.signal-crimson`): Solid opaque primary button fill on architectural specification spreads, closing lead submissions, and the Oceanside headquarters map pin.

### Secondary
- **Solar Gold** (`colors.solar-gold`): Skewed marker highlight behind key Hero display words, primary action button fill on deep coastal ink bands (`Book My Free 21-Point Inspection`), selected combobox icon chips, and focus-visible rings on dark surfaces.
- **Solar Amber** (`colors.solar-amber`): Crisp stroke reinforcement on five-star rating glyphs and monthly financing pill borders so yellow accents stay legible against white and sandstone grounds.

### Tertiary
- **Pacific Cerulean** (`colors.pacific-cerulean`): Brand sky accent used in custom scrollbars, active mobile dock indicators, and Hero sky horizon transitions.
- **Survey Blue** (`colors.survey-blue`): High-contrast (`>= 4.5:1`) technical link color, engineering specification callouts, and interactive route anchors across white and daylight-paper sections.
- **Verified Emerald** (`colors.verified-emerald`): Live service-area confirmation indicator dot (`Yes, we serve Oceanside`) inside the ballpark estimator and ZIP validation feedback.

### Neutral
- **Coastal Ink** (`colors.coastal-ink`): Primary display and body text across all light surfaces, `2px` focus-visible outlines, and the solid background of deep diagnostic and closing conversion bands.
- **Harbor Slate** (`colors.harbor-slate`): Coastal-tinted secondary body copy on white and daylight-paper sections, preserving oceanic hue harmony instead of lifeless neutral gray.
- **Driftwood Slate** (`colors.driftwood-slate`): Coastal-tinted metadata, uppercase field labels, specification captions, and input placeholders (`>= 4.5:1` contrast).
- **Daylight Paper** (`colors.daylight-paper`): Default document ground and alternating architectural specification section surface.
- **Architectural White** (`colors.architectural-white`): Elevated specification spreads, project comparison frames, inline form drawers, and the 72px ballpark instrument bar.
- **Marine Wash** (`colors.marine-wash`): Recessed media placeholders, segmented intent switcher tracks, and interactive regional map wells.
- **Sandstone Linen** (`colors.sandstone-linen`): Warm editorial surface dedicated to verified homeowner testimonies and transparent financing specifications.
- **Sandstone Umber** (`colors.sandstone-umber`): Warm-tinted secondary text, review metadata, and hairline divider base (`15%–20%` alpha) exclusively on Sandstone Linen surfaces.
- **Mist Ice** (`colors.mist-ice`): High-legibility coastal-tinted secondary copy and technical descriptions on deep Coastal Ink sections.

### Named Rules
**The Signal Rarity Rule.** Signal Red-Orange and Survey Crimson appear strictly on primary conversion actions, live emergency dispatch cues, and text carets—never on decorative badges, section backgrounds, or passive icons.

**The Tinted Secondary Ink Rule.** Secondary and muted text always inherits the temperature of its underlying ground: Harbor Slate and Driftwood Slate on cool daylight surfaces, Sandstone Umber on warm Sandstone Linen, and Mist Ice on deep Coastal Ink—never untinted neutral gray.

**The Scoped Sky Rule.** Atmospheric sky gradients belong exclusively inside the positioned Hero canvas (`position: absolute` within `.hero`); `html` and `body` remain solid Daylight Paper with zero `background-attachment: fixed` layers.

## Typography

**Display Font:** Self-hosted `Archivo` variable font (`weight: 100 900`, `font-stretch: 62% 125%`, fallback `Arial Narrow, Arial, sans-serif`).
**Body Font:** Self-hosted `Inter` variable font (`weight: 100 900`, fallback `ui-sans-serif, system-ui, sans-serif`).

**Character:** Heavy, slightly expanded `Archivo` (`800` weight, `106%–110%` width on Hero display) projects structural authority—like stamped steel truss plates and architectural title blocks—while `Inter` keeps dense building-code explanations, pricing disclaimers, and homeowner reviews effortless to scan.

### Hierarchy
- **Display** (`800`, `clamp(2.05rem, 0.9rem + 3.45vw, 4.1rem)`, line-height `0.99`, tracking `-0.032em`, stretch `110%`): Hero `<h1>` lockup (`max-width: 19ch`, `text-wrap: balance`), immediately visible at `t=0` without entrance fade delays.
- **Headline** (`800`, `1.875rem` to `2.65rem`, line-height `1.08`, tracking `-0.025em`): Primary `<h2>` section anchors across service spreads, project ledgers, drone diagnostics, reviews, and closing forms (`text-wrap: balance`).
- **Title** (`800`, `1.25rem` to `1.7rem`, line-height `1.14`, tracking `-0.02em`): Flagship service spread `<h3>` titles, specialty ledger row headings, financing specification headers, and native FAQ `<summary>` triggers.
- **Body** (`400–500`, `0.9375rem` to `1.125rem`, line-height `1.5`): Technical narratives, homeowner blockquotes, and FAQ answers constrained to `58ch–70ch` for comfortable reading measure.
- **Label** (`700`, `0.75rem` to `0.8125rem`, line-height `1.15`, tracking `0.04em–0.05em`, uppercase): Form field labels (`SERVICE`, `HOME SIZE`, `ZIP CODE`), specification `<dt>` keys, and before/after corner plates.

### Named Rules
**The Heading Speaks Alone Rule.** Section `<h2>` and `<h3>` headings never carry an uppercase eyebrow or kicker label above them; `Archivo` weight and scale establish hierarchy on their own.

**The Tabular Figures Rule.** Every price range, monthly payment, square-footage tier, phone number, ZIP code, rating score, response window (`60–90 minutes`), and license number (`#1096492`) enforces `font-variant-numeric: tabular-nums` so figures align cleanly in ledgers and never jitter during live ballpark interpolation.

## Layout

Marketing specification sections run inside a centered `1400px` container (`px-4` mobile, `px-6` tablet, `px-12` desktop), while the docked Hero Ballpark Instrument Bar centers at `1024px` max-width to focus the eye on its three-step horizontal control strip. Vertical section rhythm alternates `64px` (`py-16`) on mobile, `80px` (`sm:py-20`) on tablet, and `96px` (`lg:py-24`) on desktop, separated by full-bleed `1px` tonal borders (`rgba(11, 27, 43, 0.12)` on light bands, `rgba(255, 255, 255, 0.12)` on dark bands).

Content compositions favor asymmetric 12-column architectural spreads and distinct visual formats per section (`7 / 5` for flagship residential/tile spreads, solar + commercial photo pair, 4-tab before/after spotlight + thumbnail case-study ledger, editorial pull-quote spotlight + coastal estate 25-year financing card, and collapsed `<details>` FAQs + photo-backed guides; `5 / 7` for practitioner emergency dispatch, Class B exterior construction split feature, bare-deck CRC R908 craft banner, and closing lead desk) over uniform three-card rows or repetitive text-only tables. Progressive disclosure via native HTML `<details>` drawers keeps all 16 service scopes and 32 regional service-area routes 100% SSR-crawlable without visually drowning first-time visitors in link walls. On `1440x900` desktop viewports, the Hero grid (`min-height: min(100svh, 888px)`) budgets vertical spacing so the Owens Corning credential badge, `<h1>`, dual CTAs, verified review pill, cutout San Diego skyline, and entire 72px Ballpark Instrument Bar sit completely above the `900px` fold at `scrollY = 0`. On viewports `<= 899px`, the horizontal ballpark bar stacks into a full-width 1-column form with `54px` touch cells and synchronous scroll clearance above the fixed mobile bottom dock (`StickyCTA`).

## Elevation & Depth

The system uses a disciplined hybrid depth model: tactile refractive glass and directional sky shadows lift floating interactive instruments inside the Hero, while every content section below the Hero transitions to flat tonal architecture structured by `1px` hairlines and restrained ambient plate shadows.

### Shadow Vocabulary
- **Hero CTA Projection** (`box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.28), 0 2px 4px rgba(229, 57, 43, 0.32), 0 12px 26px -8px rgba(229, 57, 43, 0.52)`): Applied to primary Signal Red Hero and Ballpark triggers, pairing a crisp top specular rim with a warm directional cast.
- **Coastal Glass Float** (`box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.86), inset 0 -1px 0 rgba(255, 255, 255, 0.18), 0 2px 4px rgba(14, 92, 140, 0.10), 0 12px 30px -8px rgba(14, 92, 140, 0.22)`): Applied to the Owens Corning credential badge, secondary glass call button, and verified reviews chip over the Hero sky.
- **Instrument Dock Shadow** (`box-shadow: 0 2px 6px rgba(14, 92, 140, 0.10), 0 28px 60px -18px rgba(14, 92, 140, 0.32)`): Anchors the 1024px Glass Ballpark Bar across the cutout rooftop horizon.
- **Architectural Plate Rest** (`box-shadow: 0 14px 34px -12px rgba(11, 27, 43, 0.08)`): Subtle structural lift on flagship service spreads and the before/after comparison frame over Daylight Paper.
- **Dark-Band Form Elevation** (`box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.45)`): Grounds the crisp Architectural White Closing Lead Form against the deep Coastal Ink section background.

### Named Rules
**The Scoped Glass Rule.** `backdrop-filter: blur(...)` is restricted to floating Hero instruments (`.hero-glass`, `.est__bg`) and fixed navigation chrome (`Header`, `StickyCTA`), and automatically collapses to solid `colors.architectural-white` with `1px` borders under `@media (prefers-reduced-transparency: reduce)`.

**The Hairline Over Box-Grid Rule.** Related items—trust credentials, specialty service divisions, surveyed case studies, regional city links, homeowner reviews, and FAQs—separate via `1px` dividers (`divide-y` / `divide-x`) inside a shared plane rather than floating as disconnected drop-shadowed cards, and cards never nest inside cards.

## Shapes

Form geometry distinguishes between **interactive instruments** and **architectural plates**:
- **Hero & Form Instruments (`6px`–`24px` + `999px` pills):** Outer Ballpark Instrument Bar container uses `24px` (`rounded.xl`) framing an inner `16px` (`rounded.lg`) white control bar; Hero buttons, credential badges, and combobox listbox menus use `14px` (`rounded.md`); standalone form inputs and section buttons use `6px`–`8px` (`rounded.xs`); verified review strips, monthly financing tags, and ZIP confirmation notes use full `999px` (`rounded.pill`) capsules.
- **Architectural Specification Plates (`0px` square corners):** Flagship service spreads, 3-stage drone inspection plates, before/after comparison frames, regional service map frames, financing specification panels, and the closing lead desk use crisp `0px` (`rounded.none`) corners with `1px` borders (`12%–20%` ink or umber alpha), evoking precision blueprint sheets.
- **Editorial Highlight Silhouette:** The Hero `<mark>` (`Contractor`) places a skewed (`transform: skewX(-8deg)`) Solar Gold bar (`0.42em` tall, `0.08em` radius) behind the baseline—never gradient-clipped text.
- **Stroke Restraint:** Borders on cards, callouts, and error alerts never exceed `1px` (`1.5px–2px` reserved strictly for active focus rings and high-contrast mode).

## Components

### Buttons
Tactile, high-visibility triggers with immediate exponential ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`) state feedback and `44px–52px` minimum touch targets.
- **Shape:** `14px` radius (`rounded.md`) on Hero and Ballpark triggers (`52px–60px` height); `8px` radius on inline specification and form triggers (`44px–52px` height).
- **Primary:** Signal Red-Orange linear top-to-bottom sheen (`colors.signal-red` to `colors.signal-red-deep`) in the Hero/Ballpark bar, or solid Survey Crimson (`colors.signal-crimson`) in specification spreads and the closing lead form, paired with bold white `Archivo` labels and trailing stroke arrows.
- **Hover / Focus:** `-2px` vertical lift on Hero primary triggers with a subtle diagonal specular sweep; `:focus-visible` renders a crisp `2px` solid `colors.coastal-ink` outline (`2px` offset, or `colors.solar-gold` on dark bands) with zero bounce overshoot.
- **Dark-Band & Secondary Variants:** On deep Coastal Ink bands, primary buttons switch to solid `colors.solar-gold` with `colors.coastal-ink` text; secondary actions use Hero refractive glass (`hero-btn--glass`) above the fold or crisp `1px` bordered `colors.architectural-white` buttons below the fold.

### Chips
Compact verification capsules that surface real-time geographic and social proof without clutter.
- **Style:** Full pill radius (`999px`). The Hero Reviews Proof Strip pairs three overlapping homeowner avatars (`40px` circles with `2.5px` white rings) and Google/Yelp badges with a `5.0` star score and review count. The Ballpark ZIP status pill pairs a `6px–7px` `colors.verified-emerald` pulse dot with deep emerald text on a soft mint wash.
- **State:** Interactive review chips lift `-2px` and fan avatar spacing slightly on pointer hover; passive status pills announce updates via `role="status"` and `aria-live="polite"`.

### Cards / Containers
Flat-plane specification sheets and multi-column diagnostic plates built for dense technical scanning.
- **Corner Style:** `0px` (`rounded.none`) on architectural spreads, drone inspection triads, map frames, financing panels, and lead desks.
- **Background:** `colors.architectural-white` over `colors.daylight-paper` or `colors.sandstone-linen`; elevated dark slate over `colors.coastal-ink` on the 3-plate drone inspection band.
- **Shadow Strategy:** Restrained ambient plate shadow (`0 14px 34px -12px rgba(11, 27, 43, 0.08)`) on flagship spreads; zero shadow on hairline-divided ledger rows.
- **Border:** `1px solid` tonal hairline (`rgba(11, 27, 43, 0.12)` on daylight surfaces, `rgba(74, 63, 49, 0.20)` on sandstone, `rgba(255, 255, 255, 0.14)` on dark bands).
- **Internal Padding:** `24px` (`p-6`) on mobile scaling to `32px–40px` (`sm:p-8 lg:p-10`) on desktop, with full-bleed `1px` internal `<dl>` specification strips.

### Inputs / Fields
Accessible, high-contrast form controls and custom WAI-ARIA 1.2 select-only comboboxes (`HeroDropdown`).
- **Style:** `48px–56px` minimum height, `colors.architectural-white` background, `1px solid` emphasis border (`22%–28%` Coastal Ink alpha), `colors.signal-red` text caret, uppercase `Archivo` field labels, and coastal-tinted placeholders (`>= 4.5:1` contrast).
- **Focus:** `2px solid` `colors.coastal-ink` or `colors.survey-blue` outline; inside the Ballpark Bar and field comboboxes, active cells add a `4px` `colors.solar-gold` halo so keyboard position is unmistakable in bright daylight.
- **Error / Disabled:** Invalid fields shift border to `colors.signal-crimson` with a soft rose wash, paired with explicit inline `role="alert"` recovery copy that includes a **Retry** button and clickable `(760) 622-1230` phone fallback. Cloudflare `<Turnstile>` mounts lazily only after contact fields are touched.

### Navigation & Specification Footer
Dual-tier coastal chrome and a 4-row architectural specification footer engineered for instant service discovery, zero-obstruction mobile thumb reach, and copyable Local SEO NAP authority.
- **Desktop Header (`Header.tsx`):** Fixed two-tier top chrome (`<= 92px` un-scrolled height) pairing a `32px` `colors.coastal-ink` utility strip (`24/7 Emergency Leak Dispatch · 60–90 Min`, `CSLB #1096492 (C-39 & Class B) · OC #247226`, live `5.0` review link, `info@riseuprac.com`, collapsing smoothly on scroll) with a crisp daylight `glass-nav-surface` bar (`rgba(255, 255, 255, 0.94)` with `28px` blur and `1px` bottom border). Showcases the `3.82:1` `/logo.svg` lockup, a single-line 7-item primary navigation (`Services`, `Projects`, `Service Areas`, `Financing`, `Reviews`, `Guides`, `About`), `800px` 3-column `Services` and `320px` `Service Areas` specification mega-menus (`16/16` SSR scopes, `0` headings, `aria-hidden` + `inert` when closed), `(760) 622-1230` call capsule, and `colors.signal-crimson` `Free Estimate` CTA.
- **Mobile Drawer (`MobileNav.tsx`) & Bottom Dock (`StickyCTA.tsx`):** Clean `colors.coastal-ink` slide-over drawer (`max-w-[400px]`) displaying `/logo-white.svg`, direct emergency call & `colors.signal-crimson` estimate triggers, and hairline accordions for all 16 services and top city hubs, paired with a floating dark-ink bottom pill dock (`Home`, `Services`, `Reviews`, `Call`, `colors.signal-crimson` `Estimate` pill) pinned above `env(safe-area-inset-bottom)`.
- **Specification Footer (`Footer.tsx`):** Selectable/copyable `colors.deep-coastal-ink` (`#071524`) architectural footer (`0` `<h1>–<h6>` tags) organized into four hairline-divided bands: (1) `/logo-white.svg` + 3-cell official WebP credential bar (`cslb.webp`, `oc-preferred-seal.webp`, `escondido-chamber.webp`), (2) 12-column directory led by copyable Oceanside HQ NAP (`2182 S El Camino Real, Oceanside, CA 92054`, hours, 24/7 dispatch, verified profiles) alongside all `16/16` roofing, solar, and Class B construction routes (collapsing to native `<details>` accordions on `< md`), (3) a shared collapsible `<details>` 32-city regional drawer (`32/32` SSR city routes), and (4) legal/license bar (`pb-24 md:pb-8` clearing `StickyCTA`).

### 10-Second Glass Ballpark Instrument Bar
The signature conversion instrument (`HeroBallparkBar`) docked across the lower Hero skyline at `1024px` max-width.
- **Closed Bar State:** A `24px`-radius refractive glass shell framing a `72px` high-contrast white horizontal control bar divided by `1px` vertical separators into `Service` (`HeroDropdown`), `Home size` (`HeroDropdown`), `ZIP code` (5-digit numeric input with live San Diego / Temecula / Murrieta city verification), and `Get My Ballpark`.
- **Expanded Inline Drawer:** Submitting valid selections smoothly expands a CSS Grid drawer (`grid-template-rows: 0fr -> 1fr` over `400ms cubic-bezier(0.16, 1, 0.3, 1)`), interpolating the low-to-high dollar range and monthly payment pill (`tabular-nums`) above an inline 3-field capture row (`Full name`, `Phone`, `Email optional`, `Send My Quote`)—converting visitors without ever opening a modal.
- **Cross-Page Pre-Selection:** Clicking any `ServiceBallparkButton` inside lower service spreads dispatches `riseup:ballpark`, pre-selecting that exact roof or construction category and scrolling `#hero-estimator` into focus.

### Tabular Specification Ledger & Credential Strip
A recurring architectural data pattern applied across the 5-column official seal credential strip (`CSLB #1096492`, `Owens Corning #247226 · 25-Yr Warranty`, `Escondido Chamber #9925`), flagship service spreads, thumbnail-backed case studies, and the coastal estate `\$0` down / `25-Year Warranty` financing panel.
- **Structure:** Multi-column `<dl>` strips (`border-y`, `divide-x`, or `2x2` hairline grid) pairing an uppercase or tinted key (`WARRANTY`, `CODE`, `UPFRONT`, `DISPATCH`) with a bold Coastal Ink `tabular-nums` specification (`25-Yr System`, `CRC R908 · T24`, `60–90 Minutes`) and direct crawlable Next.js `<Link>` routes.

## Do's and Don'ts

### Do:
- **Do** keep `<h1>` and above-the-fold Hero elements at `opacity: 1` from `t=0` so Largest Contentful Paint renders immediately without JavaScript hydration gates.
- **Do** apply `tabular-nums` (`font-variant-numeric: tabular-nums`) on every dollar estimate, monthly payment, square-footage range, phone number, ZIP code, star rating, and contractor license number.
- **Do** tint secondary and muted text from the active surface hue (`colors.harbor-slate` / `colors.driftwood-slate` on cool daylight paper, `colors.sandstone-umber` on warm sandstone, `colors.mist-ice` on deep navy) while maintaining `>= 4.5:1` contrast.
- **Do** pair every lead submission error state with both an inline **Retry** trigger and a direct clickable `(760) 622-1230` telephone fallback.
- **Do** honor `@media (prefers-reduced-motion: reduce)` and `@media (prefers-reduced-transparency: reduce)` across all sky clouds, button transitions, drawer expansions, and glass surfaces.

### Don't:
- **Don't** place uppercase kicker or eyebrow labels above `<h2>` or `<h3>` section headings; delete the label and let `Archivo` carry the hierarchy.
- **Don't** build uniform same-size 3-card icon-heading-blurb grids or nest cards inside cards; use asymmetric specification spreads and `1px` hairline ledgers instead.
- **Don't** use gradient-clipped text (`background-clip: text`), emoji or Unicode symbols as icons, bounce/overshoot spring easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`), hard zero-blur offset shadows, or `border-left` / `border-right` accents wider than `1px`.
- **Don't** introduce 3D/WebGL canvases, smooth-scroll hijacking, `background-attachment: fixed` body layers, auto-popup promotional modals, or eager third-party map/CAPTCHA scripts on initial fold load.
