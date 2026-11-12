# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary Users:** Homeowners, HOA boards, and commercial property managers across San Diego County (Oceanside HQ, Carlsbad, Encinitas, Vista, San Marcos, Escondido, Poway, San Diego Metro, East County) plus adjacent Temecula and Murrieta.
- **Situations & Jobs:**
  1. **Urgent Leak / Storm Triage:** Active ceiling leak, wind-lifted shingles, or slipped clay/concrete tiles needing 60–90 minute emergency dispatch, tarping, and insurance-grade photo/moisture documentation.
  2. **Planned Roof Replacement or Coastal Tile Relay:** Comparing 2–3 licensed contractors for an expensive 25+ year roof investment (Owens Corning architectural shingles, Spanish clay/concrete tile lift-and-reset underlayment relay, standing seam metal, solar detach-and-reset, commercial TPO/silicone coating, or Class B exterior construction/decks/siding/ADUs); seeking transparent ballpark pricing, monthly financing options, and proof of local longevity without high-pressure sales tactics.

## Product Purpose

Public marketing and lead-conversion website (`https://riseuprac.com`) for **Rise Up Roofing & Construction Inc.** Success means converting skeptical, time-pressed property owners into qualified leads (via the 10-second inline ballpark estimator, the closing inspection/quote lead form, or direct tap-to-call `(760) 622-1230`) while ranking organically across San Diego County search and AI answer engines.

## Positioning

Dual-licensed San Diego contractor holding **both** California **C-39 Roofing** and **Class B General Building** licenses (`CSLB #1096492`) plus **Owens Corning Preferred Contractor (`#247226`)** status—allowing in-house structural dry-rot framing, coastal concrete/clay tile underlayment relays (saving ~50% vs. full tile replacement), solar panel detach-and-reset, and 25-year non-prorated manufacturer warranties with a strict zero-subcontractor, 100% itemized pricing protocol.

## Operating Context

- **Headquarters:** `2182 S El Camino Real, Oceanside, CA 92054` (`(760) 622-1230`, `info@riseuprac.com`).
- **Hours:** Mon–Fri 7:00 AM – 6:00 PM, Sat 8:00 AM – 2:00 PM, plus 24/7 Emergency Leak & Storm Dispatch.
- **Regional Building & Climate Codes:** California Residential Code `CRC R908` (full tear-off to bare wood decking), California `Title 24` Part 6 Cool Roof compliance (Climate Zones 7 & 10), coastal marine-layer salt-air corrosion resistance, and East County WUI Class-A wildfire assembly standards.
- **Service Footprint:** 30 San Diego County communities across North County Coastal, North County Inland, San Diego Metro & Coast, and East County Foothills, plus Temecula and Murrieta in South Riverside (32 indexed city pages; no Orange County coverage).

## Capabilities and Constraints

- **Stack:** Next.js 16.3.3 (App Router, SSR by default), React 19, TypeScript, Tailwind CSS v4.
- **Lead & Pricing Integration:** Ballpark estimator reads `/api/estimator/config` (with instant local fallback pricing) and submits leads to `POST /api/estimate` (contact page uses `POST /api/contact`), proxied via `next.config.ts` `beforeFiles` rewrites to `FASTAPI_BACKEND_URL` with Cloudflare Turnstile, dual honeypots (`business_fax`, `company_website`), and `formStartedAt` anti-spam protection.
- **Inferred Autonomous `/goal` Decisions (disclosed per `init.md`):**
  - *[Inferred from user brief + `/goal`]:* `website/` is the canonical target app; the Daylight Coastal Sky + Cutout San Diego Rooftop Skyline + Owens Corning Pink Panther Badge + Horizontal Glass Ballpark Bar Hero concept from `Riseup 3.0/` is preserved without any Three.js/WebGL (`RoofScene`, `AuditScene`), GSAP, or Lenis scroll-hijacking.
  - *[Inferred from user brief + `/goal`]:* `StormPromoModal` auto-interstitial is retired in favor of non-intrusive inline emergency dispatch pathways.

## Brand Commitments

- **Brand Name:** `Rise Up Roofing & Construction` (`Rise Up Roofing & Construction Inc.`).
- **Voice:** Direct, code-literate San Diego master builder (owners Edith & Luis); plain practitioner English—zero hype, zero AI filler, zero fake countdown pressure.
- **Pinned Hero Concept:** Daylight coastal San Diego atmosphere, Owens Corning Preferred Contractor badge with Pink Panther, bold display headline with gold marker highlight, verified 5.0-star Google/Yelp review proof strip, cutout San Diego rooftop skyline, and horizontal 10-second glass ballpark bar (`Service` + `Home Size` + `ZIP` expanding inline to ballpark range + `Name` & `Phone` capture).

## Evidence on Hand

- **Verified Credentials & Assets:** `public/logo.svg`, `public/logo-white.svg`, Owens Corning Preferred Contractor (`#247226`, verified profile URL), CSLB `#1096492` (`$2M+` General Liability & Workers Comp), Tile Roofing Industry Alliance, Escondido Chamber of Commerce (`#9925`), `25+ Years Experience`, `1,000+ Roofs Installed`.
- **Verified Reviews:** 9 real 5.0-star Google reviews (`lib/data/reviews.ts`, Place ID `ChIJ-f_1oGhw3IAR_vK8N8E2i6I`) from named Oceanside, Carlsbad, Vista, and San Diego homeowners with authentic replies from Edith & Luis, plus live backend review sync (`lib/reviews-server.ts`) and Yelp profile.
- **Real Content:** 16 detailed service specs (`lib/data/services.ts`), 32 city guides (`lib/data/serviceAreas.ts`), 11 San Diego case studies (`lib/data/projects.ts`) with optimized local before/after AVIF/WebP imagery, 9 engineering guides (`lib/data/guides.ts`), CRC R908 tear-off protocol (`/about/roof-tear-off-process`), and financing plans (`/roof-financing-san-diego`).
- **Absences (Never Fabricate):** Do not invent fake customer names, unverified review counts, fake street addresses, or Orange County service claims.

## Product Principles

1. **Convert Without Friction:** Every viewport gives both urgent-leak callers and planned-replacement shoppers an immediate, low-friction next step—never hiding contact capture behind a 7-field modal or slow JS animations.
2. **Compositor Speed Over Spectacle:** Zero 3D/WebGL canvases, zero smooth-scroll hijacking, zero fixed-background full-page repaints; instant mobile load and snappy touch response win stressed homeowners.
3. **Server-Rendered Authority:** Every heading, service path, city link, FAQ answer, and structured-data entity ships in initial SSR HTML so search crawlers and AI engines index the full breadth of Rise Up's 81-page footprint.
4. **Practitioner Proof Over Claims:** Show exact license numbers, building codes (`CRC R908`, `Title 24`), real before/after San Diego roofs, and itemized ballpark math rather than generic contractor superlatives.

## Accessibility & Inclusion

WCAG AA contrast minimum (≥4.5:1 body/placeholder, ≥3:1 large text), full keyboard and screen-reader combobox/form support, 44px+ mobile tap targets, and strict `@media (prefers-reduced-motion: reduce)` + `@media (prefers-reduced-transparency: reduce)` compliance.
