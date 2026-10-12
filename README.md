# Mack Anthem® Truck Landing Page — Pixel-Perfect Figma Reconstruction

An engineering-grade reconstruction of the **Mack Anthem Truck Landing Page** from Figma source specifications, built with Next.js App Router, strict TypeScript, Tailwind CSS, Next.js font management (`Montserrat`), Next.js image optimization, and Playwright automated geometry validation.

---

## 1. Project Overview & Architecture

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript (strict type checking enabled)
- **Styling**: Tailwind CSS with CSS custom properties design tokens
- **Typography**: Google Fonts `Montserrat` (weights: 400, 500, 600, 700)
- **Image Optimization**: `next/image` with photographic crop and focal-point retention
- **Validation**: Playwright automated bounding box DOM measurement and screenshot comparison suite

### Directory Layout

```text
├── assets/                       # Original high-resolution 1024x1024 photography
├── docs/
│   ├── FIGMA_MEASUREMENT_SPEC.md # Full desktop & section measurement matrix
│   ├── DESIGN_TOKENS.md          # CSS variables & typography tokens
│   ├── ASSET_MANIFEST.md         # Photographic and vector asset mapping
│   ├── RESPONSIVE_SPEC.md        # Viewport adaptation strategy
│   ├── VISUAL_VERIFICATION.md    # Playwright audit protocol
│   └── measured_dom_metrics.json # Automated DOM inspection results
├── public/
│   └── images/
│       ├── mack-anthem-hero.png  # Hero highway truck (584x384 rendered)
│       ├── mack-interior.png     # Gallery cabin cockpit view
│       ├── mack-engine.png       # Gallery MP8 engine compartment
│       └── mack-rear.png         # Gallery rear exterior view
├── scripts/
│   └── measure-and-capture.js    # Playwright automated geometry & screenshot tool
├── src/
│   ├── app/
│   │   ├── globals.css           # Design tokens, custom utilities
│   │   ├── layout.tsx            # Root layout with Montserrat font
│   │   └── page.tsx              # Main landing page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx        # 65px header with brand & navigation
│   │   │   └── Footer.tsx        # 313px footer with 4 columns
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx   # 600px hero with 2 columns
│   │   │   ├── SpecificationsSection.tsx # 452px technical specs section
│   │   │   ├── FeaturesSection.tsx       # 420px key features section
│   │   │   ├── GallerySection.tsx        # 431px 3-column gallery
│   │   │   └── CallToActionSection.tsx   # 290px CTA section
│   │   └── ui/
│   │       ├── Button.tsx        # Typed button with exact Figma dimensions
│   │       ├── Container.tsx     # 1216px grid container
│   │       ├── FeatureItem.tsx   # 384x164px feature item
│   │       └── SpecificationCard.tsx     # 280x196px spec card
│   ├── data/
│   │   └── site-content.ts       # Strongly typed content & metrics
│   └── types/
│       └── index.ts              # Data contracts & interfaces
└── tests/
    ├── pixel-audit.spec.ts       # 11 automated Playwright geometry tests
    └── screenshots/              # Desktop & responsive rendered outputs
```

---

## 2. Figma vs Implementation Geometry Audit (1440px Viewport)

| Element / Section | Expected Figma Target | Actual Rendered | Delta | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Total Canvas Height** | 2571px | 2571px | 0px | **PASS** |
| **Header Height** | 65px | 65px | 0px | **PASS** |
| **Hero Section Height** | 600px | 600px | 0px | **PASS** |
| **Hero Image Width** | 584px | 584px | 0px | **PASS** |
| **Hero Image Height** | 384px | 384px | 0px | **PASS** |
| **Hero Image X Position** | 744px | 744px | 0px | **PASS** |
| **Hero Image Y Position** | 173px (SVG 108px + 65px) | 173px | 0px | **PASS** |
| **Specifications Height** | 452px | 452px | 0px | **PASS** |
| **Specification Card Width** | 280px | 280px | 0px | **PASS** |
| **Specification Card Height**| 196px | 196px | 0px | **PASS** |
| **Specification Cards Gap** | 32px | 32px | 0px | **PASS** |
| **Key Features Height** | 420px | 420px | 0px | **PASS** |
| **Feature Item Dimensions** | 384 × 164 px | 384 × 164 px | 0px | **PASS** |
| **Gallery Section Height** | 431px | 431px | 0px | **PASS** |
| **Gallery Images Height** | 219px | 219px | 0px | **PASS** |
| **Gallery Images Gap** | 24px | 24px | 0px | **PASS** |
| **CTA Section Height** | 290px | 290px | 0px | **PASS** |
| **Footer Section Height** | 313px | 313px | 0px | **PASS** |
| **Content Grid Constraint** | 1216px | 1216px | 0px | **PASS** |

---

## 3. Getting Started

### Prerequisites
- Node.js 18+ (tested with Node.js 24)
- npm 9+

### Installation

```bash
git clone https://github.com/devsajidur/final-fdr2509-project.git
cd final-fdr-2509-project
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

```bash
npm run build
npm start
```

### Running Automated Geometry Tests (Playwright)

```bash
# Run the automated geometry audit
npx playwright test

# Or run the measurement & screenshot capture script
node scripts/measure-and-capture.js
```
