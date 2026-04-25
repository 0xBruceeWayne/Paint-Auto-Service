# Paint Auto Service — Website Design Spec
**Date:** 2026-04-05
**Type:** Showcase website (single HTML file)
**Language:** Romanian

---

## Overview

A single-page, dark cinematic showcase website for **Paint Auto Service** — a full-service auto body and mechanical shop. The goal is to impress visitors and the owner with a premium, high-energy feel inspired by revizieautoservice.ro. No booking system, no CMS — just a beautiful, standalone `index.html`.

---

## Visual Identity

| Element | Value |
|---|---|
| Background | `#0d0d0d` |
| Primary Red | `#e02020` (from logo) |
| White | `#ffffff` |
| Silver/Chrome | `#c0c0c0` |
| Card background | `rgba(255,255,255,0.04)` with `1px solid rgba(255,255,255,0.08)` border |
| Font | Rajdhani (Google Fonts) — Bold & Regular weights |

Logo: embedded from `/Users/brucewayne/Desktop/Screenshot 2026-04-02 at 20.29.32.png`
Do NOT generate a new logo — use the provided file only.

---

## Page Sections (top to bottom)

### 1. Navbar
- Fixed top, dark background with slight blur backdrop-filter
- Logo on the left
- Navigation links on the right: Acasă, Servicii, Despre, Contact
- Smooth scroll to each section
- Red underline hover effect on links

### 2. Hero
- Full-screen (100vh)
- **Left half:** Animated text entrance (fade + slide up)
  - Headline: `EXPERȚI ÎN ÎNGRIJIREA MAȘINII TALE`
  - Subheadline: `Calitate, precizie și pasiune pentru fiecare mașină`
  - CTA button: `Descoperă Serviciile` (red, pill shape, scrolls to services)
- **Right half:** Three.js 3D rotating wheel
  - Realistic rim with spokes built in Three.js geometry
  - Slow continuous Y-axis rotation
  - Red point light for dramatic metallic shine
  - Deep red radial glow in background behind the wheel
- Mobile: wheel moves below text, stacks vertically

### 3. Stats Strip
- Full-width dark band, 3 columns
- Animated count-up on scroll-into-view (IntersectionObserver)
- Stats (placeholder — owner to update):
  - `15+` Ani de Experiență
  - `2000+` Mașini Reparate
  - `98%` Clienți Mulțumiți

### 4. Services
- Section heading: `SERVICIILE NOASTRE`
- 6 cards in a 3×2 grid (2×3 on tablet, 1 column on mobile)
- Each card:
  - SVG icon (relevant to service)
  - Red top border that expands width on hover
  - Service name (bold, white)
  - One-line Romanian description
  - Lifts on hover with subtle red box-shadow glow
  - Dark glass-morphism background

| Service | Romanian Name | Description |
|---|---|---|
| Paint | Vopsire Auto | Vopsire profesională pentru un finish impecabil |
| Dent repair | Reparații Caroserie | Eliminăm loviturile și zgârieturile rapid și eficient |
| Bodywork | Lucrări Tablă | Intervenții precise asupra structurii caroseriei |
| Polishing | Polish & Lustruire | Redăm strălucirea originală a lacului |
| Detailing | Detailing Complet | Curățare și îngrijire totală, interior și exterior |
| Mechanical | Mecanică Generală | Diagnoza și repararea sistemelor mecanice |

### 5. Contact
- Section heading: `CONTACTEAZĂ-NE`
- 3 icon cards side by side (phone, address, hours)
- All values are placeholder `—` (to be filled by owner)
- No form — static display only

### 6. Footer
- Dark strip
- Logo centered
- Copyright line: `© 2026 Paint Auto Service. Toate drepturile rezervate.`
- Social icon placeholders (Facebook, Instagram) — no links, just icons

---

## Animations & Interactions

| Element | Animation |
|---|---|
| Hero text | Fade + slide up on load (CSS keyframes, staggered) |
| 3D wheel | Continuous slow Y-rotation via Three.js animation loop |
| Stats | Count-up triggered by IntersectionObserver |
| Service cards | Lift + red glow on hover (CSS transition) |
| Red top border on cards | Width expands from 0 to 100% on hover |
| Navbar | Backdrop blur + slight background on scroll |
| Section entrances | Fade-in + slide-up via IntersectionObserver |

---

## Technical Constraints

- **Single file:** All CSS and JS inlined in `index.html` (no separate files)
- **No build tools:** Works by opening directly in a browser
- **Three.js:** Loaded via CDN (`https://cdnjs.cloudflare.com/ajax/libs/three.js/`)
- **Google Fonts:** Rajdhani loaded via `<link>` tag
- **No frameworks:** Vanilla JS + CSS only
- **Logo:** Referenced as a relative path from the provided screenshot file

---

## Out of Scope

- Booking / appointment form
- CMS or backend
- Multi-language support
- SEO optimization
- Hosting / deployment
