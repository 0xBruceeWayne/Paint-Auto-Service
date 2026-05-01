# AI Booking App — Design Spec
**Date:** 2026-05-01  
**Status:** Approved  
**Project:** VOSSWeb3D Design / AI Booking App

---

## Overview

A single-page, immersive scroll website for an AI-powered travel booking app targeting **Modern Explorers** — mid-range to premium travelers seeking boutique hotels, unique experiences, and flexible trips. The site combines a cinematic marketing landing page with a live, interactive AI booking wizard demo.

---

## Core Decisions

| Decision | Choice |
|----------|--------|
| Booking type | Travel & Hospitality (hotels, flights, car rentals, experiences) |
| Target audience | Modern Explorer — mid to premium, adventurous, experience-driven |
| AI interaction model | AI-First Wizard — step-by-step guided flow, no traditional search |
| Page structure | Immersive Single Scroll — one URL, 7 sections, evolving 3D atmosphere |
| Scope | Landing page + live AI wizard demo embedded in hero |

---

## Visual Identity

### Color Palette
Extracted from the travel illustration (airplane + passport + world landmarks):

| Role | Color | Hex |
|------|-------|-----|
| Base | Deep Indigo | `#0D1B3E` |
| Primary | Sky Blue | `#1A9FE0` |
| Accent | Passport Purple | `#6B21A8` |
| Glow | Cyan | `#00D4FF` |
| Surface | Liquid Glass | `rgba(255,255,255,0.08)` + `backdrop-filter: blur(20px)` |
| Text primary | White | `#FFFFFF` |
| Text secondary | Slate | `#8B97A8` |

### Typography
- **Headlines:** Sora — bold, modern, editorial
- **Body / Labels:** Inter — clean, neutral
- **AI output / prompts:** Monospace — typed feel, tech-native

### Surface Treatment
Every card, panel, navbar, modal, and step box uses **Apple iOS 26 Liquid Glass**:
- `background: rgba(255,255,255,0.08)`
- `backdrop-filter: blur(20px)`
- `border: 1px solid rgba(26,159,224,0.25)`
- Animated shimmer layer on hover
- Inset box-shadow depth
- Specular rim highlight
- Z-split depth on hover (translateZ + scale)

---

## 3D Rendering Stack (All Sections)

Applied globally, no exceptions:
```
renderer.toneMapping = THREE.ACESFilmicToneMapping
UnrealBloomPass(size, 0.4, 0.4, 0.85)
FilmPass(0.15, false)
SSAOPass(scene, camera, w, h)
```
- HDRI via RGBELoader + PMREMGenerator
- MeshPhysicalMaterial on all hero objects
- 16x antialiasing
- Spring-physics cursor: stiffness 0.08, damping 0.85

---

## Page Sections

### 01 — Hero (100vh)
**3D Atmosphere:** Sky-blue volumetric cloudscape · cyan sun bloom · white particle trails (800 points) · cyan PointLight follows cursor  
**Background:** User's travel illustration animates as the 3D scene backdrop — plane orbiting, landmarks floating in parallax  
**Components:**
- Navbar: Logo left · nav links center · "Sign Up" CTA right — all Liquid Glass, `position: fixed`
- Centered Liquid Glass wizard panel with AI prompt: *"Where do you want to go?"*
- Live wizard steps: Destination → Dates → Vibe → Budget → Results
- Spring-physics cursor driving cyan point light across the scene

**AI Wizard Steps:**
1. "Where do you want to go?" — text input with destination autocomplete
2. "When are you traveling?" — date range picker
3. "What's your vibe?" — A/B/C cards (Adventure / Relax / Culture)
4. "Budget per person?" — slider ($500–$10,000+)
5. AI generates: "Your perfect trip:" — 3 result cards (hotel + flight + activities bundle)

---

### 02 — How It Works (100vh)
**3D Atmosphere:** Deep indigo space · purple nebula wisps · slow particle drift  
**Components:**
- Section heading: "AI travel planning, simplified."
- 3 Liquid Glass step cards — GSAP ScrollTrigger stagger reveal (fade + slide up, 0.15s delay each)
  - Step 1: "Tell the AI your dream" — describe your trip in plain language
  - Step 2: "AI builds your trip" — bundles flights, hotels, experiences in seconds
  - Step 3: "Book in one tap" — confirm and pay without leaving the page
- Animated SVG connector line between steps (GSAP drawSVG on scroll)

---

### 03 — Destinations (120vh)
**3D Atmosphere:** Cyan ocean aerial · soft cloud layer · teal shimmer  
**Components:**
- Section heading: "Trending destinations"
- Horizontal scroll card row — 6 destination cards
  - Each card: full-bleed photo · Liquid Glass overlay · destination name · avg price · "Explore →" CTA
  - 3D card tilt on hover (cursor reactive, max 15deg)
  - GSAP stagger reveal on scroll entry
- Destinations: Bali · Santorini · Tokyo · Marrakech · Patagonia · Maldives

---

### 04 — AI Features (100vh)
**3D Atmosphere:** Dark indigo · electric blue data-flow particles · subtle grid shader  
**Components:**
- Split layout (50/50):
  - Left: Large Liquid Glass panel showing live-typed AI chat demo (typewriter animation loop)
  - Right: 4 feature pills stacked vertically, GSAP stagger reveal
    - Smart Bundling — finds the best flight + hotel + activity combo automatically
    - Price Prediction — AI tells you the best time to book
    - Vibe Matching — recommends trips based on your past preferences
    - Instant Rebooking — one-tap rebooking if plans change

---

### 05 — Testimonials (80vh)
**3D Atmosphere:** Purple starfield · warm cyan glow · slow particle drift  
**Components:**
- Section heading: "Travelers love it"
- 3 Liquid Glass quote cards in auto-rotating carousel (GSAP fade, 4s interval)
  - Each: avatar + name + destination + star rating + quote
- Stat row below: 128K trips planned · 4.9★ avg rating · $340 avg saved per booking

---

### 06 — Pricing (100vh)
**3D Atmosphere:** Deep space starfield · white particle drift · galaxy blur  
**Components:**
- Section heading: "Simple, transparent pricing"
- Monthly / Annual toggle (GSAP price-flip animation on switch, 20% annual discount)
- 3 Liquid Glass tier cards:
  - **Explorer** — Free · 5 AI trips/month · basic destinations
  - **Voyager** — $12/mo · unlimited trips · price prediction · priority booking ← "Most Popular" badge + glowing border
  - **Elite** — $29/mo · all features + concierge support + exclusive deals
- CTA button per card: "Get Started" / "Start Free Trial" / "Go Elite"

---

### 07 — Footer CTA (60vh)
**3D Atmosphere:** Loops back to sky-blue hero cloudscape  
**Components:**
- Large centered heading: "Your next trip starts with one question."
- AI wizard prompt re-embedded (same component as hero, minimal version)
- Footer links: About · Pricing · Blog · Careers · Privacy · Terms
- Social icons row (minimal, icon-only)

---

### Sticky Element (always visible after hero)
- Floating wizard bubble — bottom-right corner
- Pulsing cyan glow animation
- On click: opens full AI wizard as an overlay panel
- Dismisses with × or clicking outside

---

## GSAP Animation Plan

| Animation | Trigger | Config |
|-----------|---------|--------|
| Section heading reveal | ScrollTrigger enter | `y: 40 → 0, opacity: 0 → 1, duration: 0.8` |
| Card stagger reveal | ScrollTrigger enter | `y: 60 → 0, opacity: 0 → 1, stagger: 0.15` |
| Connector line draw | ScrollTrigger scrub | `drawSVG: "0% → 100%", scrub: 1` |
| Pricing price flip | Toggle click | `rotateX: 90 → 0, duration: 0.4` |
| Sticky bubble pulse | Always | `scale: 1 → 1.08, repeat: -1, yoyo: true, duration: 1.5` |
| Hero entrance | Page load | Timeline: navbar → heading → wizard panel → stats |
| Carousel transition | Auto / 4s | `opacity: 0 → 1, x: 20 → 0, duration: 0.5` |
| Atmosphere morph | ScrollTrigger progress | Three.js fog color + point light color lerp per section |

---

## File Structure

```
AI Booking App/
├── index.html          — main single-page site
├── assets/
│   ├── images/
│   │   ├── travel-illustration.jpg   — the user's travel image (hero bg source)
│   │   └── destinations/             — 6 destination photos
│   └── hdri/
│       └── sky.hdr                   — HDRI for Three.js scene
├── js/
│   ├── scene.js        — Three.js setup, atmosphere system, post-processing
│   ├── wizard.js       — AI wizard step flow logic
│   ├── animations.js   — GSAP ScrollTrigger setup, all animation configs
│   └── cursor.js       — spring-physics cursor + point light follow
├── css/
│   └── styles.css      — global styles, Liquid Glass system, typography
└── docs/
    └── superpowers/specs/
        └── 2026-05-01-ai-booking-app-design.md
```

---

## Out of Scope

- Real backend / API integration (Claude/GPT API calls)
- Real payment processing
- User authentication / accounts
- Mobile app (website only)
- CMS or dynamic content management
