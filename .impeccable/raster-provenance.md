# Shipping Asset & Raster Provenance Ledger (`website/public/img/**`)

- **Surface:** Homepage (`app/(marketing)/page.tsx`) & shared brand marks
- **Total Shipping Assets in `public/img/**`:** 109 files (**107 raster AVIF/WebP derivatives including `80w–136w` brand seals, `240w`, `480w`, and `640w` responsive tiers + 2 SVG brand marks**)
- **3D / WebGL / Runtime Canvas Textures:** **0** (all Three.js/WebGL scene textures and runtime shaders intentionally excluded per `PRODUCT.md` Principle #2)
- **Provenance Standard:** First-party Rise Up Roofing & Construction Inc. static asset library (`public/images/**` & `Riseup 3.0` curated cutout/audit/jobsite masters) paired with official CSLB (`#1096492`), Owens Corning Preferred Contractor (`#247226`), and Escondido Chamber (`#9925`) marks; responsive AVIF + WebP pairs (`240w` thumbnails, `480w` mobile/card spreads, `640w` estate card, `960w–1920w` desktop/HiDPI) generated locally via `sharp` for deterministic multi-format `<picture>` delivery (`0` bytes added above the fold).

---

## 1. Hero Skyline & Homeowner Proof Avatars (`public/img/hero/`) — 11 Rasters

| Public Path | Format | Dimensions | Size (Bytes) | Homepage Consumer | Provenance & Delivery Notes |
| --- | --- | --- | --- | --- | --- |
| `/img/hero/skyline-640.avif` | AVIF | `640x302` | `10,794` | `Hero.tsx` (`<picture>` `srcSet` + `react-dom` `preload`) | Curated alpha-matte cutout San Diego clay-tile, architectural shingle, and solar rooftop skyline (`sharp` 640w AVIF derivative). |
| `/img/hero/skyline-640.webp` | WebP | `640x302` | `33,414` | `Hero.tsx` (`<picture>` `srcSet`) | Curated alpha-matte cutout San Diego rooftop skyline (`sharp` 640w WebP fallback derivative). |
| `/img/hero/skyline-960.avif` | AVIF | `960x453` | `33,645` | `Hero.tsx` (`<picture>` `srcSet` + `preload`) | Curated alpha-matte cutout San Diego rooftop skyline (`sharp` 960w AVIF derivative). |
| `/img/hero/skyline-960.webp` | WebP | `960x453` | `68,094` | `Hero.tsx` (`<picture>` `srcSet`) | Curated alpha-matte cutout San Diego rooftop skyline (`sharp` 960w WebP fallback derivative). |
| `/img/hero/skyline-1280.avif` | AVIF | `1280x603` | `78,335` | `Hero.tsx` (`preload` primary LCP candidate, `fetchPriority="high"`) | Curated alpha-matte cutout San Diego rooftop skyline (`sharp` 1280w AVIF primary LCP asset). |
| `/img/hero/skyline-1280.webp` | WebP | `1280x603` | `167,514` | `Hero.tsx` (`<img>` default `src` fallback, `fetchPriority="high"`) | Curated alpha-matte cutout San Diego rooftop skyline (`sharp` 1280w WebP fallback). |
| `/img/hero/skyline-1920.avif` | AVIF | `1920x905` | `172,746` | `Hero.tsx` (`<picture>` `srcSet` + `preload`) | Curated alpha-matte cutout San Diego rooftop skyline (`sharp` 1920w HiDPI AVIF derivative). |
| `/img/hero/skyline-1920.webp` | WebP | `1920x905` | `337,108` | `Hero.tsx` (`<picture>` `srcSet`) | Curated alpha-matte cutout San Diego rooftop skyline (`sharp` 1920w HiDPI WebP derivative). |
| `/img/hero/avatar-1.webp` | WebP | `96x96` | `2,030` | `Hero.tsx` (`.reviews.rchip` avatar dock `JR`) | Curated Rise Up local review chip portrait thumbnail (`96x96` WebP, `decoding="async"`). |
| `/img/hero/avatar-2.webp` | WebP | `96x96` | `1,834` | `Hero.tsx` (`.reviews.rchip` avatar dock `KL`) | Curated Rise Up local review chip portrait thumbnail (`96x96` WebP, `decoding="async"`). |
| `/img/hero/avatar-3.webp` | WebP | `96x96` | `2,150` | `Hero.tsx` (`.reviews.rchip` avatar dock `MT`) | Curated Rise Up local review chip portrait thumbnail (`96x96` WebP, `decoding="async"`). |

---

## 2. Primary Brand Lockups (`public/`) & Official Licensing Marks (`public/img/brand/`) — 6 Rasters + 5 SVGs

| Public Path | Format | Dimensions | Size (Bytes) | Homepage Consumer | Provenance & Delivery Notes |
| --- | --- | --- | --- | --- | --- |
| `/logo.svg` | SVG | `viewBox 0 0 282.39 73.98` | `14,841` | `Header.tsx` & `lib/seo/metadata.ts` (`#organization` logo) | Official Rise Up Roofing & Construction primary daylight vector lockup (sanitized inline hex fills `#FAB01A`, `#D42227`, `#3D9CD6`, `#263C50`). |
| `/logo-white.svg` | SVG | `viewBox 0 0 286.8 76.91` | `14,799` | `MobileNav.tsx` & `Footer.tsx` | Official Rise Up Roofing & Construction dark-surface vector lockup (`#FFFFFF` circular emblem backing + `#FFFFFF` / `#5BB8EE` wordmark). |
| `/favicon.svg` | SVG | `viewBox 0 0 76.91 76.91` | `6,182` | `app/layout.tsx` (`metadata.icons`) | Official Rise Up Roofing & Construction `1:1` circular vector emblem favicon. |
| `/img/brand/owens-corning.svg` | SVG | `viewBox 0 0 117.09 118.54` | `14,605` | `Hero.tsx` (`.ocbadge__crest` linked to verified OC Profile `#247226`) | Official Owens Corning crest vector mark (`Rise Up Roofing & Construction Inc.`, Contractor ID `#247226`). |
| `/img/brand/oc-panther.svg` | SVG | `viewBox 0 0 105.98 129.34` | `17,852` | `Hero.tsx` (`.ocbadge__panther` decorative `aria-hidden="true"` crest accent) | Official Owens Corning Pink Panther partner vector mark paired with Preferred Contractor `#247226` credential. |
| `/img/brand/oc-preferred-seal.webp` | WebP | `280x280` | `25,598` | Subpage credential blocks (`25-Yr Warranty` master) | Official Owens Corning Roofing Preferred Contractor circular seal (`sharp` `280x280` WebP master). |
| `/img/brand/oc-preferred-seal-136.webp` | WebP | `136x136` | `7,152` | `TrustLedger.tsx`, `ReviewsAndFinancing.tsx` & `Footer.tsx` (`25-Yr Warranty`) | 2x retina `136x136` WebP derivative via `sharp` for native `<img>` delivery. |
| `/img/brand/cslb.webp` | WebP | `112x112` | `6,786` | Subpage credential blocks (`CSLB #1096492` master) | Official California Contractors State License Board emblem (`sharp` `112x112` WebP master). |
| `/img/brand/cslb-80.webp` | WebP | `80x80` | `4,092` | `TrustLedger.tsx` & `Footer.tsx` (`CSLB #1096492 · C-39 & Class B`) | 2x retina `80x80` WebP derivative via `sharp` for native `<img>` delivery. |
| `/img/brand/escondido-chamber.webp` | WebP | `140x120` | `9,638` | Subpage credential blocks (`Chamber #9925` master) | Official Greater Escondido Chamber of Commerce member mark (`#9925`, `sharp` `140x120` WebP master). |
| `/img/brand/escondido-chamber-84.webp` | WebP | `84x72` | `3,930` | `TrustLedger.tsx` & `Footer.tsx` (`Chamber #9925 · 1,000+ SD Roofs`) | 2x retina `84x72` WebP derivative via `sharp` for native `<img>` delivery. |

---

## 3. Architectural Service Specification Spreads (`public/img/services/`) — 6 Rasters

| Public Path | Format | Dimensions | Size (Bytes) | Homepage Consumer | Provenance & Delivery Notes |
| --- | --- | --- | --- | --- | --- |
| `/img/services/residential-roofing.avif` | AVIF | `960x630` | `44,474` | `ServicesOverview.tsx` (Flagship Spread 1 primary plate) & `HomepageFaqAndGuides.tsx` (Featured Guide 3 thumbnail, `loading="lazy"`) | First-party Rise Up service photography (`residential-roofing` master converted via `sharp` to `960x630` AVIF). |
| `/img/services/residential-roofing.webp` | WebP | `960x630` | `61,294` | `ServicesOverview.tsx` & `HomepageFaqAndGuides.tsx` (`<picture>` fallback) | First-party Rise Up service photography (`sharp` `960x630` WebP derivative). |
| `/img/services/tile-roofing.avif` | AVIF | `960x536` | `92,583` | `ServicesOverview.tsx` (Flagship Spread 1 secondary relay plate) & `HomepageFaqAndGuides.tsx` (Featured Guide 1 thumbnail, `loading="lazy"`) | First-party Rise Up coastal tile roof photography (`tile-roofing` master converted via `sharp` to `960x536` AVIF). |
| `/img/services/tile-roofing.webp` | WebP | `960x536` | `135,180` | `ServicesOverview.tsx` & `HomepageFaqAndGuides.tsx` (`<picture>` fallback) | First-party Rise Up coastal tile roof photography (`sharp` `960x536` WebP derivative). |
| `/img/services/roof-repair.avif` | AVIF | `960x630` | `40,861` | `ServicesOverview.tsx` (Flagship Spread 2 `24/7 Emergency Roof Leak Repair` plate, `loading="lazy"`) | First-party Rise Up valley flashing & underlayment repair photography (`sharp` `960x630` AVIF derivative). |
| `/img/services/roof-repair.webp` | WebP | `960x630` | `56,330` | `ServicesOverview.tsx` (Flagship Spread 2 `<picture>` fallback) | First-party Rise Up valley flashing & underlayment repair photography (`sharp` `960x630` WebP derivative). |

---

## 4. 21-Point 4K Drone & Thermal Inspection Plates (`public/img/audit/`) — 6 Rasters

| Public Path | Format | Dimensions | Size (Bytes) | Homepage Consumer | Provenance & Delivery Notes |
| --- | --- | --- | --- | --- | --- |
| `/img/audit/1.avif` | AVIF | `1100x1103` | `66,500` | `DroneInspectionBand.tsx` (Plate `01`: `4K Drone Ridge, Tile & Flashing Scan`, `loading="lazy"`) | Curated Rise Up aerial inspection diagnostic plate (`sharp` `1100x1103` AVIF derivative). |
| `/img/audit/1.webp` | WebP | `1100x1103` | `120,686` | `DroneInspectionBand.tsx` (Plate `01` `<picture>` fallback) | Curated Rise Up aerial inspection diagnostic plate (`sharp` `1100x1103` WebP derivative). |
| `/img/audit/2.avif` | AVIF | `1100x1101` | `48,593` | `DroneInspectionBand.tsx` (Plate `02`: `FLIR Attic Moisture & Decking Check`, `loading="lazy"`) | Curated Rise Up attic sheathing & thermal moisture diagnostic plate (`sharp` `1100x1101` AVIF derivative). |
| `/img/audit/2.webp` | WebP | `1100x1101` | `82,690` | `DroneInspectionBand.tsx` (Plate `02` `<picture>` fallback) | Curated Rise Up attic sheathing & thermal moisture diagnostic plate (`sharp` `1100x1101` WebP derivative). |
| `/img/audit/3.avif` | AVIF | `1100x1101` | `87,731` | `DroneInspectionBand.tsx` (Plate `03`: `Itemized 21-Point Photo Scope`, `loading="lazy"`) | Curated Rise Up written diagnostic report & scope specification plate (`sharp` `1100x1101` AVIF derivative). |
| `/img/audit/3.webp` | WebP | `1100x1101` | `209,492` | `DroneInspectionBand.tsx` (Plate `03` `<picture>` fallback) | Curated Rise Up written diagnostic report & scope specification plate (`sharp` `1100x1101` WebP derivative). |

---

## 5. Coastal Bare-Deck Craft & Financing Estate Plates (`public/img/standard/` & `public/img/statement/`) — 4 Rasters

| Public Path | Format | Dimensions | Size (Bytes) | Homepage Consumer | Provenance & Delivery Notes |
| --- | --- | --- | --- | --- | --- |
| `/img/standard/craft.avif` | AVIF | `960x630` | `51,642` | `DroneInspectionBand.tsx` (`Built to Bare Wood—Never Illegal Overlays` split craft banner, `loading="lazy"`) | First-party Rise Up coastal clay tile & synthetic underlayment crew photography (`sharp` `960x630` AVIF derivative). |
| `/img/standard/craft.webp` | WebP | `960x630` | `80,924` | `DroneInspectionBand.tsx` (Craft banner `<picture>` fallback) | First-party Rise Up coastal clay tile & synthetic underlayment crew photography (`sharp` `960x630` WebP derivative). |
| `/img/statement/statement.avif` | AVIF | `1600x1000` | `92,695` | `ReviewsAndFinancing.tsx` (`$0 Down Financing & 25-Year Warranty` coastal Spanish-tile estate header, `loading="lazy"`) | Curated coastal San Diego Spanish barrel-tile aerial photography (`sharp` `1600x1000` AVIF derivative). |
| `/img/statement/statement.webp` | WebP | `1600x1000` | `157,436` | `ReviewsAndFinancing.tsx` (Coastal estate header `<picture>` fallback) | Curated coastal San Diego Spanish barrel-tile aerial photography (`sharp` `1600x1000` WebP derivative). |

---

## 6. San Diego Before/After & Case-Study Project Plates (`public/img/projects/`) — 24 Rasters

| Public Path | Format | Dimensions | Size (Bytes) | Homepage Consumer | Provenance & Delivery Notes |
| --- | --- | --- | --- | --- | --- |
| `/img/projects/carlsbad-tile-relayment-before.avif` | AVIF | `960x600` | `64,437` | `BeforeAfterCompare.tsx` (Case 1 `Tile Relay` before layer, `loading="lazy"`) | First-party Rise Up Aviara/Carlsbad concrete tile relayment jobsite photo (`lib/data/projects.ts`, `sharp` `960x600` AVIF). |
| `/img/projects/carlsbad-tile-relayment-before.webp` | WebP | `960x600` | `100,794` | `BeforeAfterCompare.tsx` (Case 1 before `<picture>` fallback) | First-party Rise Up Carlsbad tile relayment before photo (`sharp` `960x600` WebP derivative). |
| `/img/projects/carlsbad-tile-relayment-after.avif` | AVIF | `960x600` | `64,341` | `BeforeAfterCompare.tsx` (Case 1 `Tile Relay` after layer, `loading="lazy"`) | First-party Rise Up Carlsbad tile relayment completed jobsite photo (`sharp` `960x600` AVIF derivative). |
| `/img/projects/carlsbad-tile-relayment-after.webp` | WebP | `960x600` | `100,852` | `BeforeAfterCompare.tsx` (Case 1 after `<picture>` fallback) | First-party Rise Up Carlsbad tile relayment completed jobsite photo (`sharp` `960x600` WebP derivative). |
| `/img/projects/oceanside-shingle-replacement-before.avif` | AVIF | `960x600` | `52,395` | `BeforeAfterCompare.tsx` (Case 2 `Shingle Tear-Off` before layer, `loading="lazy"`) | First-party Rise Up coastal Oceanside shingle tear-off before photo (`lib/data/projects.ts`, `sharp` `960x600` AVIF). |
| `/img/projects/oceanside-shingle-replacement-before.webp` | WebP | `960x600` | `79,072` | `BeforeAfterCompare.tsx` (Case 2 before `<picture>` fallback) | First-party Rise Up coastal Oceanside shingle tear-off before photo (`sharp` `960x600` WebP derivative). |
| `/img/projects/oceanside-shingle-replacement-after.avif` | AVIF | `960x600` | `54,702` | `BeforeAfterCompare.tsx` (Case 2 `Shingle Tear-Off` after layer, `loading="lazy"`) | First-party Rise Up coastal Oceanside Owens Corning Duration completed photo (`sharp` `960x600` AVIF derivative). |
| `/img/projects/oceanside-shingle-replacement-after.webp` | WebP | `960x600` | `84,002` | `BeforeAfterCompare.tsx` (Case 2 after `<picture>` fallback) | First-party Rise Up coastal Oceanside Owens Corning Duration completed photo (`sharp` `960x600` WebP derivative). |
| `/img/projects/carlsbad-solar-detach-reset-before.avif` | AVIF | `960x600` | `48,072` | `BeforeAfterCompare.tsx` (Case 3 `Solar Detach & Reset` before layer, `loading="lazy"`) | First-party Rise Up Carlsbad 28-module solar detach before photo (`lib/data/projects.ts`, `sharp` `960x600` AVIF). |
| `/img/projects/carlsbad-solar-detach-reset-before.webp` | WebP | `960x600` | `73,728` | `BeforeAfterCompare.tsx` (Case 3 before `<picture>` fallback) | First-party Rise Up Carlsbad solar detach before photo (`sharp` `960x600` WebP derivative). |
| `/img/projects/carlsbad-solar-detach-reset-after.avif` | AVIF | `960x600` | `47,340` | `ServicesOverview.tsx` (`In-House Solar Panel Detach & Reset` card) & `BeforeAfterCompare.tsx` (Case 3 after layer, `loading="lazy"`) | First-party Rise Up Carlsbad reroof & torque-verified solar reset completed photo (`sharp` `960x600` AVIF). |
| `/img/projects/carlsbad-solar-detach-reset-after.webp` | WebP | `960x600` | `74,768` | `ServicesOverview.tsx` & `BeforeAfterCompare.tsx` (`<picture>` fallback) | First-party Rise Up Carlsbad reroof & solar reset completed photo (`sharp` `960x600` WebP derivative). |
| `/img/projects/oceanside-siding-before.avif` | AVIF | `960x600` | `55,508` | `BeforeAfterCompare.tsx` (Case 4 `Hardie Siding` before layer, `loading="lazy"`) | First-party Rise Up coastal Oceanside exterior siding replacement before photo (`sharp` `960x600` AVIF). |
| `/img/projects/oceanside-siding-before.webp` | WebP | `960x600` | `86,988` | `BeforeAfterCompare.tsx` (Case 4 before `<picture>` fallback) | First-party Rise Up coastal Oceanside exterior siding replacement before photo (`sharp` `960x600` WebP). |
| `/img/projects/oceanside-siding-after.avif` | AVIF | `960x600` | `50,942` | `BeforeAfterCompare.tsx` (Case 4 `Hardie Siding` after layer) & `LocalProofSection.tsx` (`88x60` case-study thumbnail, `loading="lazy"`) | First-party Rise Up coastal Oceanside James Hardie fiber-cement siding completed photo (`sharp` `960x600` AVIF). |
| `/img/projects/oceanside-siding-after.webp` | WebP | `960x600` | `78,790` | `BeforeAfterCompare.tsx` & `LocalProofSection.tsx` (`<picture>` fallback) | First-party Rise Up coastal Oceanside James Hardie fiber-cement siding completed photo (`sharp` `960x600` WebP). |
| `/img/projects/sd-commercial-tpo-after.avif` | AVIF | `960x600` | `36,773` | `ServicesOverview.tsx` (`Commercial Flat Roofing, TPO & Coatings` card) & `LocalProofSection.tsx` (`88x60` case-study thumbnail, `loading="lazy"`) | First-party Rise Up Kearny Mesa 60-mil Title 24 TPO commercial flat roof completed photo (`sharp` `960x600` AVIF). |
| `/img/projects/sd-commercial-tpo-after.webp` | WebP | `960x600` | `48,220` | `ServicesOverview.tsx` & `LocalProofSection.tsx` (`<picture>` fallback) | First-party Rise Up Kearny Mesa commercial TPO roof completed photo (`sharp` `960x600` WebP). |
| `/img/projects/sd-patio-cover-after.avif` | AVIF | `960x600` | `48,464` | `ServicesOverview.tsx` (`Class B Exterior Construction, Decks & Siding` split banner) & `LocalProofSection.tsx` (`88x60` case-study thumbnail, `loading="lazy"`) | First-party Rise Up Rancho Bernardo custom patio cover & roof tie-in completed photo (`sharp` `960x600` AVIF). |
| `/img/projects/sd-patio-cover-after.webp` | WebP | `960x600` | `70,034` | `ServicesOverview.tsx` & `LocalProofSection.tsx` (`<picture>` fallback) | First-party Rise Up Rancho Bernardo patio cover & roof tie-in completed photo (`sharp` `960x600` WebP). |
| `/img/projects/escondido-roof-coating-after.avif` | AVIF | `960x600` | `46,677` | `LocalProofSection.tsx` (`Escondido Silicone Commercial Roof Restoration` `88x60` thumbnail, `loading="lazy"`) | First-party Rise Up Escondido high-solids silicone cool-roof restoration completed photo (`sharp` `960x600` AVIF). |
| `/img/projects/escondido-roof-coating-after.webp` | WebP | `960x600` | `66,808` | `LocalProofSection.tsx` (`<picture>` fallback) | First-party Rise Up Escondido silicone cool-roof restoration completed photo (`sharp` `960x600` WebP). |
| `/img/projects/sd-underlayment-repair-after.avif` | AVIF | `960x600` | `45,211` | `LocalProofSection.tsx` (`La Jolla Tile Underlayment & Valley Flashing` `88x60` thumbnail) & `HomepageFaqAndGuides.tsx` (`CRC R908 Bare-Deck` guide thumbnail, `loading="lazy"`) | First-party Rise Up La Jolla synthetic underlayment & valley flashing installation photo (`sharp` `960x600` AVIF). |
| `/img/projects/sd-underlayment-repair-after.webp` | WebP | `960x600` | `67,402` | `LocalProofSection.tsx` & `HomepageFaqAndGuides.tsx` (`<picture>` fallback) | First-party Rise Up La Jolla synthetic underlayment & valley flashing installation photo (`sharp` `960x600` WebP). |
