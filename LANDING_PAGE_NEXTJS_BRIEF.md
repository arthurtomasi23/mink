# Mink — Landing page brief for Next.js (TypeScript)

**Use this document as context in a new Cursor project** to build a simple marketing / landing site that matches the real Mink mobile app (Expo / React Native) and communicates its value clearly.

---

## 1. Product snapshot

**Name:** Mink  
**What it is:** A **tattoo discovery** app for people who want inspiration and for **artists** who want to show work and be found.

**Core audiences**

| Audience | What they get |
|----------|----------------|
| **Seekers / enthusiasts** | Browse a visual feed of tattoos, filter by style and area, **search** by text or **reference photo**, save pieces into **collections**, follow artists, see details and studio context. |
| **Artists** | Profile with studio and socials, **upload** tattoo photos with style tags (including AI-suggested tags), appear in discovery and on their public artist page. |

**Differentiators to emphasize on the landing page**

1. **Discovery-first** — Feed and grids designed for scrolling tattoo imagery, not generic social noise.  
2. **Serious search** — Text search across styles, motifs, artist, city; **image-based search** uses vision AI to describe a reference photo and surface similar work in the gallery (semantic / metadata matching, not a generic stock search).  
3. **Collections** — Save tattoos into named collections (mood boards / planning), not only a single “likes” list.  
4. **Artist context** — Artist profiles with city, studio, map-style discovery, and links out to Instagram / web where relevant.  
5. **Trust & access** — Sign in with **Apple** (and email/password where enabled); data layer built for **Supabase** (auth, profiles, tattoos, bookmarks, collections).

**Tone**

- Confident, modern, **design-forward** (gallery / editorial), not aggressive or gimmicky.  
- Respect the craft: tattoos as art and identity, not novelty.  
- Short headlines; let visuals carry weight.

**Suggested hero headline directions** (pick or remix)

- “Discover tattoos. Save the ones you love.”  
- “Your next tattoo starts here.”  
- “Inspiration, artists, and saves — in one place.”

**Suggested subcopy**

- Mention **save to collections**, **search by style or photo**, and **artists publishing work** in one sentence each (bullet or two short lines under hero).

---

## 2. Design system (match the app)

The app uses a **token-based theme** (`Poppins` + purple brand on dark or light surfaces). For the landing page, **default to dark** to align with the app’s primary look; offer a light section or toggle only if you want parity with `lightTokens`.

### 2.1 Brand

| Token | Hex | Usage |
|-------|-----|--------|
| **Brand primary** | `#7B2CBF` | CTAs, links, focus rings, accents |
| **Brand 600** | `#6A21AD` | Hover / pressed states |
| **Brand 700** | `#581A94` | Darker emphasis |

Brand tints (overlays / chips):  
`rgba(123,44,191,0.10)`, `0.18`, `0.28`, `0.60` as needed.

### 2.2 Dark theme (recommended default)

| Role | Hex |
|------|-----|
| **Background canvas** | `#121212` |
| **Surface** | `#1E1E1E` |
| **Elevated / secondary surface** | `#333333` |
| **Text primary** | `#F1F1F1` |
| **Text secondary / muted** | `#B0B0B0` |
| **Text on brand button** | `#121212` (inverse) |
| **Border default** | `#333333` |
| **Border subtle** | `rgba(255,255,255,0.08)` |
| **Border strong** | `rgba(255,255,255,0.18)` |
| **Scrim / overlay** | `rgba(0,0,0,0.4)` |

**State colors (badges / alerts if needed)**  
Success `#2DD4BF` · Warning `#FBBF24` · Danger `#EF4444` · Info `#60A5FA`

**Shadow (soft, dark UI)**  
`shadowColor: #000`, opacity `0.35`, radius `10`, offset `{0, 6}` (map to CSS box-shadow for web).

### 2.3 Light theme (optional)

| Role | Hex |
|------|-----|
| Canvas | `#F5F5F7` |
| Surface | `#FFFFFF` |
| Surface 2 | `#F0F0F2` |
| Text primary | `#1A1A1A` |
| Text secondary | `#6B6B6B` |
| Text muted | `#9A9A9A` |
| Border default | `#E0E0E0` |
| Scrim | `rgba(0,0,0,0.3)` |

Brand purple is the **same** as dark theme.

### 2.4 Typography

- **Family:** [Poppins](https://fonts.google.com/specimen/Poppins) (Google Fonts).  
- **Weights in app:** Regular (400), Medium (500), SemiBold (600), Bold (700).  
- **Sizes (px) — use for scale consistency**

| Name | Size | Line height |
|------|------|-------------|
| xs | 12 | 16 |
| s | 14 | 20 |
| m | 16 | 24 |
| l | 18 | 26 |
| xl | 22 | 30 |
| 2xl | 28 | 36 |

**Landing page mapping suggestion**

- Hero title: 2xl–4xl (clamp for responsive), SemiBold or Bold.  
- Section titles: xl–2xl, Medium or SemiBold.  
- Body: m (16px), Regular, line-height 24.  
- Caption / legal: s or xs, muted color.

### 2.5 Spacing scale (4px base)

Use multiples of **4px**: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`.

### 2.6 Border radii (px)

| Token | Value |
|-------|--------|
| xs | 6 |
| s | 10 |
| m | 14 |
| l | 18 |
| xl | 24 |
| 2xl | 30 |
| pill | 999 (fully rounded pills) |

**UI patterns from the app**

- **Pills** for search bars and primary navigation chips (radius pill).  
- **Cards** for tattoo tiles: rounded corners (8–14px on thumbnails), subtle borders on dark `#333333`.  
- **Primary button:** brand fill `#7B2CBF`, text `#121212` or white if you prefer higher contrast on web — app uses inverse `#121212` on brand in tokens; adjust if WCAG needs a tweak.

---

## 3. CSS variables snippet (drop into `globals.css`)

```css
:root {
  /* Brand */
  --mink-brand: #7b2cbf;
  --mink-brand-600: #6a21ad;
  --mink-brand-700: #581a94;
  --mink-brand-a10: rgba(123, 44, 191, 0.1);
  --mink-brand-a18: rgba(123, 44, 191, 0.18);

  /* Dark (default landing) */
  --mink-bg-canvas: #121212;
  --mink-bg-surface: #1e1e1e;
  --mink-bg-elevated: #333333;
  --mink-text-primary: #f1f1f1;
  --mink-text-muted: #b0b0b0;
  --mink-border: #333333;
  --mink-scrim: rgba(0, 0, 0, 0.4);

  /* Type */
  --mink-font: "Poppins", system-ui, sans-serif;
}

@media (prefers-color-scheme: light) {
  :root.theme-system {
    --mink-bg-canvas: #f5f5f7;
    --mink-bg-surface: #ffffff;
    --mink-bg-elevated: #ffffff;
    --mink-text-primary: #1a1a1a;
    --mink-text-muted: #9a9a9a;
    --mink-border: #e0e0e0;
    --mink-scrim: rgba(0, 0, 0, 0.3);
  }
}
```

Load Poppins in Next.js `layout.tsx`:

```tsx
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});
```

Apply `className={poppins.variable}` on `<html>` and `font-family: var(--font-poppins), sans-serif` in CSS.

---

## 4. Suggested landing page structure (single page)

1. **Nav** — Logo wordmark “Mink”, minimal links (Features, Artists, Download), primary CTA “Get the app”.  
2. **Hero** — Full-bleed or large tattoo imagery (use **licensed** assets or placeholders); headline + subcopy; App Store / Play badges when URLs exist.  
3. **Value props** — 3–4 columns or stacked cards: **Discover**, **Search & image match**, **Collections**, **For artists**.  
4. **Social proof / craft** — One line on community or quality of curation (only if true; otherwise skip).  
5. **Footer** — Privacy, terms (placeholders), contact, ©.

**Do not claim** features that are not shipped (e.g. booking, payments, DMs) unless you add them first.

---

## 5. App store & links (fill in when building the site)

- **iOS bundle ID (reference):** `com.arthi2310.mink`  
- **Expo slug / owner:** `mink` / `arthi2310` (from app config — confirm before printing on site).  
- Add real **App Store** and **Google Play** URLs when available.

---

## 6. Technical notes for Next.js

- **Stack:** Next.js App Router, TypeScript, no requirement for this repo’s Supabase keys on the marketing site unless you add a waitlist API.  
- **SEO:** Set `metadata` title/description; Open Graph image optional.  
- **Performance:** Prefer `next/image` with static imports or remote patterns for hero art; lazy-load below-fold imagery.  
- **Accessibility:** Semantic headings (`h1` once), focus styles using brand purple, sufficient contrast on buttons.

---

## 7. One-line positioning (for meta description)

> **Mink** — Discover tattoo inspiration, search by style or reference photo, save pieces to collections, and explore artists — all in one app.

---

*This brief is derived from the Mink Expo app theme (`src/features/theme/tokens.ts`) and product behavior as of the repo that generated this file. Adjust copy if the product pivots.*
