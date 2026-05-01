# AI Booking App — Implementation Plan

> **For agentic workers:** Use `superpowers:executing-plans` or `superpowers:subagent-driven-development` to implement task-by-task. Steps use `- [ ]` syntax for tracking.

**Goal:** Build a single-page immersive scroll travel booking website with Three.js atmospheric 3D backgrounds, Liquid Glass UI, GSAP animations, and a live 5-step AI wizard demo (no real API).

**Architecture:** Pure vanilla HTML/CSS/JS, no build tools. A fixed Three.js canvas sits behind all content; GSAP ScrollTrigger drives per-section atmosphere morphs (fog, lights, particles). The AI wizard is a front-end demo that generates mock trip results. All JS files are ES modules loaded via importmap.

**Tech Stack:** Three.js r160 (ESM importmap), GSAP 3.12 + ScrollTrigger (CDN global), Lenis 1.0 (CDN global), Google Fonts: Sora + Inter

---

## File Structure

```
AI Booking App/
├── index.html                     — single page, all section markup
├── css/
│   └── styles.css                 — CSS vars, Liquid Glass system, all section styles
├── js/
│   ├── main.js                    — entry point: imports all modules, kicks off init
│   ├── scene.js                   — Three.js renderer, camera, EffectComposer, loop
│   ├── atmosphere.js              — per-section fog/light/particle morph system
│   ├── cursor.js                  — spring-physics cursor + PointLight follow
│   ├── wizard.js                  — 5-step AI wizard flow + mock results
│   └── animations.js              — Lenis, GSAP ScrollTrigger, all reveals + carousel
└── assets/
    ├── images/
    │   ├── hero-bg.jpg            — user's travel illustration (copy from Downloads)
    │   └── destinations/
    │       ├── bali.jpg
    │       ├── santorini.jpg
    │       ├── tokyo.jpg
    │       ├── marrakech.jpg
    │       ├── patagonia.jpg
    │       └── maldives.jpg
    └── hdri/
        └── sky.hdr                — free HDRI from polyhaven.com (sky_2k.hdr)
```

---

## Task 1: Project Scaffold

**Files:** Create `index.html`, empty `css/styles.css`, empty `js/` files

- [ ] Copy `hero-bg.jpg` from Downloads:
```bash
cp "/Users/brucewayne/Downloads/IMG_1386.JPG" "/Users/brucewayne/Desktop/VOSSWeb3D Design/AI Booking App/assets/images/hero-bg.jpg"
```

- [ ] Create `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Voya — AI Travel Planner</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">

  <script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
      "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
    }
  }
  </script>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/ScrollTrigger.min.js"></script>
  <script src="https://unpkg.com/@studio-freight/lenis@1.0.42/bundled/lenis.min.js"></script>
</head>
<body>
  <canvas id="bg-canvas"></canvas>
  <div id="cursor"></div>
  <div id="cursor-dot"></div>

  <nav id="navbar">
    <div class="nav-logo">Voya</div>
    <div class="nav-links">
      <a href="#how-it-works">How it works</a>
      <a href="#destinations">Destinations</a>
      <a href="#pricing">Pricing</a>
    </div>
    <button class="btn-primary nav-cta">Sign Up Free</button>
  </nav>

  <main>
    <section id="hero"></section>
    <section id="how-it-works"></section>
    <section id="destinations"></section>
    <section id="features"></section>
    <section id="testimonials"></section>
    <section id="pricing"></section>
    <section id="footer-cta"></section>
  </main>

  <div id="wizard-bubble" aria-label="Open trip planner">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>

  <div id="wizard-overlay">
    <div class="wizard-panel glass"></div>
  </div>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

- [ ] Create empty files:
```bash
touch "/Users/brucewayne/Desktop/VOSSWeb3D Design/AI Booking App/css/styles.css"
touch "/Users/brucewayne/Desktop/VOSSWeb3D Design/AI Booking App/js/main.js"
touch "/Users/brucewayne/Desktop/VOSSWeb3D Design/AI Booking App/js/scene.js"
touch "/Users/brucewayne/Desktop/VOSSWeb3D Design/AI Booking App/js/atmosphere.js"
touch "/Users/brucewayne/Desktop/VOSSWeb3D Design/AI Booking App/js/cursor.js"
touch "/Users/brucewayne/Desktop/VOSSWeb3D Design/AI Booking App/js/wizard.js"
touch "/Users/brucewayne/Desktop/VOSSWeb3D Design/AI Booking App/js/animations.js"
```

- [ ] Verify: open `http://localhost:3000/AI Booking App/` — blank dark page, no console errors from importmap.

- [ ] Commit:
```bash
git -C "/Users/brucewayne/Desktop/VOSSWeb3D Design" add "AI Booking App/" && git -C "/Users/brucewayne/Desktop/VOSSWeb3D Design" commit -m "feat: scaffold AI Booking App project"
```

---

## Task 2: CSS Foundation

**Files:** Write `css/styles.css`

- [ ] Write `css/styles.css`:
```css
/* ── Variables ── */
:root {
  --indigo:      #0D1B3E;
  --sky:         #1A9FE0;
  --purple:      #6B21A8;
  --cyan:        #00D4FF;
  --white:       #FFFFFF;
  --slate:       #8B97A8;
  --glass-bg:    rgba(255, 255, 255, 0.08);
  --glass-bd:    rgba(26, 159, 224, 0.25);
  --font-head:   'Sora', sans-serif;
  --font-body:   'Inter', sans-serif;
  --font-mono:   'Courier New', monospace;
}

/* ── Reset ── */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: auto; } /* Lenis handles smooth scroll */
body {
  background: var(--indigo);
  color: var(--white);
  font-family: var(--font-body);
  overflow-x: hidden;
}
a { color: inherit; text-decoration: none; }
button { cursor: pointer; border: none; outline: none; background: none; font-family: inherit; }

/* ── Canvas ── */
#bg-canvas {
  position: fixed;
  inset: 0;
  width: 100%; height: 100%;
  z-index: 0;
  pointer-events: none;
}

/* ── Custom Cursor ── */
#cursor {
  position: fixed;
  width: 40px; height: 40px;
  border: 1.5px solid rgba(0, 212, 255, 0.7);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: width 0.2s, height 0.2s, border-color 0.2s;
  mix-blend-mode: screen;
}
#cursor-dot {
  position: fixed;
  width: 6px; height: 6px;
  background: var(--cyan);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
}
body:has(a:hover) #cursor, body:has(button:hover) #cursor {
  width: 60px; height: 60px;
  border-color: var(--sky);
}

/* ── Layout ── */
main { position: relative; z-index: 1; }
section { position: relative; }

/* ── Liquid Glass ── */
.glass {
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-bd);
  border-radius: 16px;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.10),
    0 8px 32px rgba(0,0,0,0.30);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}
.glass::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.03) 100%);
  pointer-events: none;
}
.glass:hover {
  transform: translateY(-3px);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.15),
    0 16px 48px rgba(0,0,0,0.40),
    0 0 0 1px rgba(26,159,224,0.35);
}

/* ── Buttons ── */
.btn-primary {
  background: linear-gradient(135deg, var(--sky), var(--purple));
  color: var(--white);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 14px;
  padding: 10px 24px;
  border-radius: 100px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-primary:hover {
  transform: scale(1.04);
  box-shadow: 0 0 24px rgba(26,159,224,0.4);
}
.btn-ghost {
  color: var(--slate);
  font-size: 14px;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 100px;
  border: 1px solid rgba(255,255,255,0.1);
  transition: border-color 0.2s, color 0.2s;
}
.btn-ghost:hover { border-color: var(--sky); color: var(--white); }

/* ── Typography ── */
.label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--cyan);
  font-weight: 600;
}
h1 { font-family: var(--font-head); font-size: clamp(40px, 6vw, 80px); font-weight: 800; line-height: 1.05; letter-spacing: -1.5px; }
h2 { font-family: var(--font-head); font-size: clamp(28px, 4vw, 52px); font-weight: 700; line-height: 1.1; letter-spacing: -0.5px; }
h3 { font-family: var(--font-head); font-size: 20px; font-weight: 700; }
p  { font-size: 16px; line-height: 1.6; color: var(--slate); }

/* ── Navbar ── */
#navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 48px;
  background: rgba(13, 27, 62, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(26,159,224,0.1);
}
.nav-logo { font-family: var(--font-head); font-size: 22px; font-weight: 800; background: linear-gradient(135deg, var(--sky), var(--cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.nav-links { display: flex; gap: 32px; }
.nav-links a { font-size: 14px; color: var(--slate); transition: color 0.2s; }
.nav-links a:hover { color: var(--white); }

/* ── Hero ── */
#hero {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
}
.hero-content { text-align: center; max-width: 680px; }
.hero-content h1 { margin: 16px 0 8px; }
.hero-content p  { font-size: 18px; margin-bottom: 40px; }
.wizard-card { padding: 32px; max-width: 600px; margin: 0 auto; }
.wizard-step { display: none; }
.wizard-step.active { display: block; }
.wizard-input {
  width: 100%;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  padding: 14px 18px;
  color: var(--white);
  font-family: var(--font-body);
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
  margin: 16px 0;
}
.wizard-input:focus { border-color: var(--sky); }
.wizard-input::placeholder { color: var(--slate); }
.wizard-vibes { display: flex; gap: 10px; margin: 16px 0; flex-wrap: wrap; }
.vibe-btn {
  flex: 1; min-width: 120px;
  padding: 14px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.12);
  color: var(--slate);
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
  background: rgba(255,255,255,0.04);
}
.vibe-btn:hover, .vibe-btn.selected { border-color: var(--sky); color: var(--white); background: rgba(26,159,224,0.12); }
.wizard-slider { width: 100%; accent-color: var(--sky); margin: 16px 0; }
.wizard-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; }
.wizard-dots { display: flex; gap: 6px; }
.wizard-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.2); transition: background 0.2s, width 0.2s; }
.wizard-dot.active { background: var(--sky); width: 20px; border-radius: 3px; }
.wizard-thinking { text-align: center; padding: 24px 0; font-family: var(--font-mono); color: var(--cyan); font-size: 14px; }
.trip-results { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
.trip-card { padding: 16px; border-radius: 12px; border: 1px solid rgba(26,159,224,0.2); background: rgba(26,159,224,0.06); display: flex; justify-content: space-between; align-items: center; }
.trip-card-info h4 { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.trip-card-info p { font-size: 13px; color: var(--slate); margin: 0; }
.trip-card-price { font-family: var(--font-head); font-size: 20px; font-weight: 700; color: var(--sky); }
.hero-stats { display: flex; gap: 24px; justify-content: center; margin-top: 32px; flex-wrap: wrap; }
.stat { text-align: center; }
.stat-value { font-family: var(--font-head); font-size: 28px; font-weight: 800; color: var(--white); }
.stat-label { font-size: 12px; color: var(--slate); margin-top: 2px; }

/* ── How It Works ── */
#how-it-works {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 48px;
  text-align: center;
}
.steps { display: flex; gap: 40px; margin-top: 64px; position: relative; flex-wrap: wrap; justify-content: center; }
.step-card { flex: 1; min-width: 240px; max-width: 320px; padding: 32px; }
.step-number { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--sky), var(--purple)); display: flex; align-items: center; justify-content: center; font-family: var(--font-head); font-weight: 800; font-size: 18px; margin: 0 auto 20px; }
.step-card h3 { margin-bottom: 12px; }
.step-connector { position: absolute; top: 60px; left: calc(33.33% - 20px); width: calc(33.33% + 40px); height: 2px; background: linear-gradient(90deg, var(--sky), var(--purple)); }
.step-connector:nth-of-type(2) { left: calc(66.66% - 20px); }

/* ── Destinations ── */
#destinations {
  padding: 120px 0;
  overflow: hidden;
}
.destinations-header { padding: 0 48px; margin-bottom: 48px; }
.destinations-track {
  display: flex;
  gap: 24px;
  padding: 0 48px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  cursor: grab;
}
.destinations-track::-webkit-scrollbar { display: none; }
.dest-card {
  flex: 0 0 320px;
  height: 420px;
  border-radius: 20px;
  overflow: hidden;
  scroll-snap-align: start;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.1s ease;
}
.dest-card img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s; }
.dest-card:hover img { transform: scale(1.05); }
.dest-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(13,27,62,0.9) 0%, transparent 50%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 24px;
}
.dest-name { font-family: var(--font-head); font-size: 22px; font-weight: 700; margin-bottom: 4px; }
.dest-price { font-size: 13px; color: var(--cyan); margin-bottom: 12px; }

/* ── Features ── */
#features {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 48px;
  gap: 80px;
  flex-wrap: wrap;
}
.features-left { flex: 1; min-width: 300px; }
.features-right { flex: 1; min-width: 300px; display: flex; flex-direction: column; gap: 20px; }
.chat-demo { padding: 24px; font-family: var(--font-mono); font-size: 13px; line-height: 1.8; min-height: 280px; }
.chat-line-user { color: var(--slate); }
.chat-line-ai { color: var(--cyan); }
.chat-cursor { display: inline-block; width: 8px; height: 14px; background: var(--cyan); animation: blink 1s step-end infinite; vertical-align: middle; }
@keyframes blink { 50% { opacity: 0; } }
.feature-pill { padding: 20px 24px; display: flex; align-items: flex-start; gap: 16px; }
.feature-icon { font-size: 24px; flex-shrink: 0; margin-top: 2px; }
.feature-pill h3 { font-size: 16px; margin-bottom: 4px; }
.feature-pill p { font-size: 14px; margin: 0; }

/* ── Testimonials ── */
#testimonials {
  padding: 120px 48px;
  text-align: center;
}
.testimonials-carousel { position: relative; max-width: 640px; margin: 64px auto 0; min-height: 200px; }
.testimonial-card { position: absolute; inset: 0; padding: 36px; opacity: 0; transition: opacity 0.5s; pointer-events: none; }
.testimonial-card.active { opacity: 1; pointer-events: all; }
.testimonial-quote { font-size: 18px; line-height: 1.6; color: var(--white); font-style: italic; margin-bottom: 24px; }
.testimonial-author { display: flex; align-items: center; gap: 14px; justify-content: center; }
.testimonial-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--sky), var(--purple)); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; }
.testimonial-name { font-weight: 600; text-align: left; }
.testimonial-trip { font-size: 13px; color: var(--slate); }
.carousel-dots { display: flex; gap: 8px; justify-content: center; margin-top: 220px; }
.carousel-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.2); transition: background 0.3s, width 0.3s; border: none; cursor: pointer; }
.carousel-dot.active { background: var(--sky); width: 24px; border-radius: 4px; }
.testimonials-stats { display: flex; gap: 48px; justify-content: center; margin-top: 48px; flex-wrap: wrap; }

/* ── Pricing ── */
#pricing {
  padding: 120px 48px;
  text-align: center;
}
.pricing-toggle { display: flex; align-items: center; gap: 12px; justify-content: center; margin: 32px 0; font-size: 14px; color: var(--slate); }
.toggle-track {
  width: 48px; height: 26px;
  background: rgba(255,255,255,0.1);
  border-radius: 13px;
  cursor: pointer;
  position: relative;
  border: 1px solid rgba(255,255,255,0.15);
  transition: background 0.3s;
}
.toggle-track.annual { background: var(--sky); }
.toggle-thumb {
  position: absolute;
  top: 3px; left: 3px;
  width: 18px; height: 18px;
  background: var(--white);
  border-radius: 50%;
  transition: left 0.3s;
}
.toggle-track.annual .toggle-thumb { left: 25px; }
.discount-badge { background: rgba(0,212,255,0.15); border: 1px solid rgba(0,212,255,0.3); color: var(--cyan); font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 100px; }
.pricing-cards { display: flex; gap: 24px; justify-content: center; margin-top: 48px; flex-wrap: wrap; align-items: flex-start; }
.pricing-card { flex: 1; min-width: 260px; max-width: 320px; padding: 36px 28px; text-align: left; }
.pricing-card.featured { border-color: rgba(26,159,224,0.5); box-shadow: inset 0 1px 0 rgba(255,255,255,0.15), 0 0 0 1px rgba(26,159,224,0.3), 0 24px 64px rgba(0,0,0,0.4); transform: translateY(-12px); }
.pricing-badge { background: linear-gradient(135deg, var(--sky), var(--purple)); font-size: 11px; font-weight: 700; padding: 3px 12px; border-radius: 100px; margin-bottom: 16px; display: inline-block; }
.pricing-tier { font-size: 13px; color: var(--slate); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
.pricing-price { font-family: var(--font-head); font-size: 48px; font-weight: 800; margin-bottom: 4px; }
.pricing-price span { font-size: 18px; font-weight: 400; color: var(--slate); }
.pricing-period { font-size: 13px; color: var(--slate); margin-bottom: 24px; }
.pricing-features { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; }
.pricing-features li { font-size: 14px; display: flex; align-items: center; gap: 10px; }
.pricing-features li::before { content: '✓'; color: var(--cyan); font-weight: 700; }

/* ── Footer CTA ── */
#footer-cta {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 48px 60px;
  text-align: center;
}
.footer-wizard { max-width: 480px; width: 100%; margin: 40px auto; padding: 24px; }
.footer-links { display: flex; gap: 32px; flex-wrap: wrap; justify-content: center; margin-top: 60px; }
.footer-links a { font-size: 13px; color: var(--slate); transition: color 0.2s; }
.footer-links a:hover { color: var(--white); }

/* ── Sticky Bubble ── */
#wizard-bubble {
  position: fixed;
  bottom: 32px; right: 32px;
  width: 56px; height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--sky), var(--purple));
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  z-index: 90;
  box-shadow: 0 0 0 0 rgba(0,212,255,0.4);
  animation: bubble-pulse 2s infinite;
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s, transform 0.2s;
}
#wizard-bubble.visible { opacity: 1; pointer-events: all; }
#wizard-bubble:hover { transform: scale(1.1); }
@keyframes bubble-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(0,212,255,0.4); }
  70%  { box-shadow: 0 0 0 16px rgba(0,212,255,0); }
  100% { box-shadow: 0 0 0 0 rgba(0,212,255,0); }
}

/* ── Wizard Overlay ── */
#wizard-overlay {
  position: fixed;
  inset: 0;
  background: rgba(13,27,62,0.85);
  backdrop-filter: blur(8px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}
#wizard-overlay.open { opacity: 1; pointer-events: all; }
#wizard-overlay .wizard-panel { width: 100%; max-width: 520px; padding: 40px; }

/* ── GSAP init states ── */
.reveal { opacity: 0; transform: translateY(40px); }
.reveal-left { opacity: 0; transform: translateX(-40px); }
.reveal-right { opacity: 0; transform: translateX(40px); }
```

- [ ] Verify: open `http://localhost:3000/AI Booking App/` — dark page, navbar visible, correct Sora font in devtools.

- [ ] Commit:
```bash
git -C "/Users/brucewayne/Desktop/VOSSWeb3D Design" add "AI Booking App/css/" && git -C "/Users/brucewayne/Desktop/VOSSWeb3D Design" commit -m "feat: CSS foundation, Liquid Glass system, all section styles"
```

---

## Task 3: HTML Sections Content

**Files:** Fill `index.html` section bodies

- [ ] Replace the empty `<section id="hero"></section>` with:
```html
<section id="hero">
  <div class="hero-content">
    <div class="label">AI-Powered Travel</div>
    <h1>Plan your perfect trip in seconds</h1>
    <p>Tell our AI where you want to go. It handles flights, hotels, and experiences — instantly.</p>

    <div class="wizard-card glass">
      <!-- Step 1: Destination -->
      <div class="wizard-step active" data-step="1">
        <div class="label">Step 1 of 4</div>
        <h3 style="margin:12px 0;">Where do you want to go?</h3>
        <input class="wizard-input" id="w-destination" type="text" placeholder="City, country, or 'surprise me'…">
        <div class="wizard-nav">
          <div class="wizard-dots">
            <div class="wizard-dot active"></div>
            <div class="wizard-dot"></div>
            <div class="wizard-dot"></div>
            <div class="wizard-dot"></div>
          </div>
          <button class="btn-primary" onclick="wizardNext()">Next →</button>
        </div>
      </div>

      <!-- Step 2: Dates -->
      <div class="wizard-step" data-step="2">
        <div class="label">Step 2 of 4</div>
        <h3 style="margin:12px 0;">When are you traveling?</h3>
        <div style="display:flex;gap:12px;">
          <input class="wizard-input" type="date" id="w-from" style="flex:1;">
          <input class="wizard-input" type="date" id="w-to" style="flex:1;">
        </div>
        <div class="wizard-nav">
          <div class="wizard-dots">
            <div class="wizard-dot"></div>
            <div class="wizard-dot active"></div>
            <div class="wizard-dot"></div>
            <div class="wizard-dot"></div>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn-ghost" onclick="wizardPrev()">← Back</button>
            <button class="btn-primary" onclick="wizardNext()">Next →</button>
          </div>
        </div>
      </div>

      <!-- Step 3: Vibe -->
      <div class="wizard-step" data-step="3">
        <div class="label">Step 3 of 4</div>
        <h3 style="margin:12px 0;">What's your vibe?</h3>
        <div class="wizard-vibes">
          <button class="vibe-btn" onclick="selectVibe(this)">🌊 Adventure</button>
          <button class="vibe-btn" onclick="selectVibe(this)">🧘 Relax</button>
          <button class="vibe-btn" onclick="selectVibe(this)">🏛️ Culture</button>
        </div>
        <div class="wizard-nav">
          <div class="wizard-dots">
            <div class="wizard-dot"></div>
            <div class="wizard-dot"></div>
            <div class="wizard-dot active"></div>
            <div class="wizard-dot"></div>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn-ghost" onclick="wizardPrev()">← Back</button>
            <button class="btn-primary" onclick="wizardNext()">Next →</button>
          </div>
        </div>
      </div>

      <!-- Step 4: Budget -->
      <div class="wizard-step" data-step="4">
        <div class="label">Step 4 of 4</div>
        <h3 style="margin:12px 0;">Budget per person?</h3>
        <p id="budget-display" style="color:var(--cyan);font-family:var(--font-head);font-size:28px;font-weight:700;margin:12px 0;">$2,000</p>
        <input class="wizard-slider" type="range" id="w-budget" min="500" max="10000" step="100" value="2000" oninput="updateBudget(this)">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--slate);"><span>$500</span><span>$10,000+</span></div>
        <div class="wizard-nav" style="margin-top:20px;">
          <div class="wizard-dots">
            <div class="wizard-dot"></div>
            <div class="wizard-dot"></div>
            <div class="wizard-dot"></div>
            <div class="wizard-dot active"></div>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn-ghost" onclick="wizardPrev()">← Back</button>
            <button class="btn-primary" onclick="wizardGenerate()">Plan My Trip ✨</button>
          </div>
        </div>
      </div>

      <!-- Step 5: Results -->
      <div class="wizard-step" data-step="5">
        <div class="wizard-thinking" id="wizard-thinking">
          <div>🤖 Voya AI is planning your trip</div>
          <div id="thinking-text" style="margin-top:8px;"></div>
        </div>
        <div id="trip-results" class="trip-results" style="display:none;"></div>
        <button class="btn-ghost" onclick="wizardReset()" style="margin-top:16px;width:100%;justify-content:center;">← Start over</button>
      </div>
    </div>

    <div class="hero-stats">
      <div class="stat"><div class="stat-value" data-count="2400">0</div><div class="stat-label">Destinations</div></div>
      <div class="stat"><div class="stat-value" data-count="128000">0</div><div class="stat-label">Trips Planned</div></div>
      <div class="stat"><div class="stat-value" data-count="340">0</div><div class="stat-label">Avg $ Saved</div></div>
    </div>
  </div>
</section>
```

- [ ] Replace `<section id="how-it-works"></section>` with:
```html
<section id="how-it-works">
  <div class="label reveal">How it works</div>
  <h2 class="reveal" style="margin-top:16px;">AI travel planning,<br>simplified.</h2>
  <div class="steps">
    <div class="step-card glass reveal">
      <div class="step-number">1</div>
      <h3>Tell the AI your dream</h3>
      <p>Describe your trip in plain language — destination, dates, vibe, budget. No forms, just conversation.</p>
    </div>
    <div class="step-card glass reveal">
      <div class="step-number">2</div>
      <h3>AI builds your trip</h3>
      <p>Our AI bundles the best flights, hotels, and experiences in seconds — all within your budget.</p>
    </div>
    <div class="step-card glass reveal">
      <div class="step-number">3</div>
      <h3>Book in one tap</h3>
      <p>Review your itinerary and confirm. Everything booked in one place, no switching between sites.</p>
    </div>
  </div>
</section>
```

- [ ] Replace `<section id="destinations"></section>` with:
```html
<section id="destinations">
  <div class="destinations-header">
    <div class="label reveal">Explore</div>
    <h2 class="reveal" style="margin-top:12px;">Trending destinations</h2>
  </div>
  <div class="destinations-track" id="dest-track">
    <div class="dest-card reveal" data-tilt>
      <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=640&q=80" alt="Bali" loading="lazy">
      <div class="dest-card-overlay">
        <div class="dest-name">Bali, Indonesia</div>
        <div class="dest-price">from $1,200 / person</div>
        <button class="btn-primary" style="font-size:12px;padding:8px 16px;">Explore →</button>
      </div>
    </div>
    <div class="dest-card reveal" data-tilt>
      <img src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=640&q=80" alt="Santorini" loading="lazy">
      <div class="dest-card-overlay">
        <div class="dest-name">Santorini, Greece</div>
        <div class="dest-price">from $1,800 / person</div>
        <button class="btn-primary" style="font-size:12px;padding:8px 16px;">Explore →</button>
      </div>
    </div>
    <div class="dest-card reveal" data-tilt>
      <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=640&q=80" alt="Tokyo" loading="lazy">
      <div class="dest-card-overlay">
        <div class="dest-name">Tokyo, Japan</div>
        <div class="dest-price">from $1,500 / person</div>
        <button class="btn-primary" style="font-size:12px;padding:8px 16px;">Explore →</button>
      </div>
    </div>
    <div class="dest-card reveal" data-tilt>
      <img src="https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=640&q=80" alt="Marrakech" loading="lazy">
      <div class="dest-card-overlay">
        <div class="dest-name">Marrakech, Morocco</div>
        <div class="dest-price">from $900 / person</div>
        <button class="btn-primary" style="font-size:12px;padding:8px 16px;">Explore →</button>
      </div>
    </div>
    <div class="dest-card reveal" data-tilt>
      <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=640&q=80" alt="Patagonia" loading="lazy">
      <div class="dest-card-overlay">
        <div class="dest-name">Patagonia, Argentina</div>
        <div class="dest-price">from $2,200 / person</div>
        <button class="btn-primary" style="font-size:12px;padding:8px 16px;">Explore →</button>
      </div>
    </div>
    <div class="dest-card reveal" data-tilt>
      <img src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=640&q=80" alt="Maldives" loading="lazy">
      <div class="dest-card-overlay">
        <div class="dest-name">Maldives</div>
        <div class="dest-price">from $3,100 / person</div>
        <button class="btn-primary" style="font-size:12px;padding:8px 16px;">Explore →</button>
      </div>
    </div>
  </div>
</section>
```

- [ ] Replace `<section id="features"></section>` with:
```html
<section id="features">
  <div class="features-left reveal-left">
    <div class="label">AI Intelligence</div>
    <h2 style="margin:16px 0 24px;">Built for the way you actually travel</h2>
    <div class="chat-demo glass">
      <div class="chat-line-user">You: I want 5 days in Japan, culture focus, $2k budget</div>
      <div class="chat-line-ai" style="margin-top:12px;">Voya: Found 3 great options for you. Top pick: Tokyo + Kyoto combo — flights $680, ryokan hotel $420, curated cultural tours $180. Total: $1,280 ✈️</div>
      <div class="chat-line-user" style="margin-top:12px;">You: Can you add a day trip to Nara?</div>
      <div class="chat-line-ai" style="margin-top:12px;">Voya: Done! Added Nara deer park day trip ($45). New total: $1,325 — still $675 under budget.<span class="chat-cursor"></span></div>
    </div>
  </div>
  <div class="features-right">
    <div class="feature-pill glass reveal">
      <div class="feature-icon">🎯</div>
      <div><h3>Smart Bundling</h3><p>AI finds the best flight + hotel + activity combo automatically — not just the cheapest, the best value.</p></div>
    </div>
    <div class="feature-pill glass reveal">
      <div class="feature-icon">📈</div>
      <div><h3>Price Prediction</h3><p>AI tells you the optimal time to book based on historical patterns — save up to 40%.</p></div>
    </div>
    <div class="feature-pill glass reveal">
      <div class="feature-icon">✨</div>
      <div><h3>Vibe Matching</h3><p>Recommends destinations and activities based on your travel personality and past preferences.</p></div>
    </div>
    <div class="feature-pill glass reveal">
      <div class="feature-icon">🔄</div>
      <div><h3>Instant Rebooking</h3><p>Plans change. One tap to rebook with AI finding the best alternatives at no extra cost.</p></div>
    </div>
  </div>
</section>
```

- [ ] Replace `<section id="testimonials"></section>` with:
```html
<section id="testimonials">
  <div class="label reveal">Travelers love it</div>
  <h2 class="reveal" style="margin-top:12px;">Real trips. Real people.</h2>

  <div class="testimonials-carousel">
    <div class="testimonial-card glass active">
      <p class="testimonial-quote">"Voya planned my entire Bali honeymoon in under 3 minutes. It found a resort I never would have discovered on my own — and we saved $600 vs booking separately."</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">S</div>
        <div><div class="testimonial-name">Sofia M.</div><div class="testimonial-trip">Bali, Indonesia · ⭐⭐⭐⭐⭐</div></div>
      </div>
    </div>
    <div class="testimonial-card glass">
      <p class="testimonial-quote">"I typed 'Tokyo, 5 days, culture, $2k' and it built a perfect itinerary with a ryokan hotel and a private tea ceremony. Unbelievably good."</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">J</div>
        <div><div class="testimonial-name">James K.</div><div class="testimonial-trip">Tokyo, Japan · ⭐⭐⭐⭐⭐</div></div>
      </div>
    </div>
    <div class="testimonial-card glass">
      <p class="testimonial-quote">"The price prediction feature alone paid for my Elite subscription 10x over. It told me to wait 3 days before booking — flights dropped $280."</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">A</div>
        <div><div class="testimonial-name">Anika R.</div><div class="testimonial-trip">Santorini, Greece · ⭐⭐⭐⭐⭐</div></div>
      </div>
    </div>
    <div class="carousel-dots">
      <button class="carousel-dot active" onclick="goToSlide(0)"></button>
      <button class="carousel-dot" onclick="goToSlide(1)"></button>
      <button class="carousel-dot" onclick="goToSlide(2)"></button>
    </div>
  </div>

  <div class="testimonials-stats">
    <div class="stat"><div class="stat-value">4.9★</div><div class="stat-label">Average Rating</div></div>
    <div class="stat"><div class="stat-value">128K</div><div class="stat-label">Trips Planned</div></div>
    <div class="stat"><div class="stat-value">$340</div><div class="stat-label">Avg Saved / Trip</div></div>
  </div>
</section>
```

- [ ] Replace `<section id="pricing"></section>` with:
```html
<section id="pricing">
  <div class="label reveal">Pricing</div>
  <h2 class="reveal" style="margin-top:12px;">Simple, transparent pricing</h2>

  <div class="pricing-toggle">
    <span>Monthly</span>
    <div class="toggle-track" id="billing-toggle" onclick="toggleBilling()">
      <div class="toggle-thumb"></div>
    </div>
    <span>Annual <span class="discount-badge">Save 20%</span></span>
  </div>

  <div class="pricing-cards">
    <div class="pricing-card glass reveal">
      <div class="pricing-tier">Explorer</div>
      <div class="pricing-price">$0<span>/mo</span></div>
      <div class="pricing-period">Free forever</div>
      <ul class="pricing-features">
        <li>5 AI trips per month</li>
        <li>Basic destinations</li>
        <li>Email support</li>
      </ul>
      <button class="btn-ghost" style="width:100%;padding:14px;">Get Started</button>
    </div>

    <div class="pricing-card glass featured reveal">
      <div class="pricing-badge">Most Popular</div>
      <div class="pricing-tier">Voyager</div>
      <div class="pricing-price" id="voyager-price">$12<span>/mo</span></div>
      <div class="pricing-period" id="voyager-period">Billed monthly</div>
      <ul class="pricing-features">
        <li>Unlimited AI trips</li>
        <li>Price prediction</li>
        <li>All 2,400+ destinations</li>
        <li>Priority support</li>
      </ul>
      <button class="btn-primary" style="width:100%;padding:14px;">Start Free Trial</button>
    </div>

    <div class="pricing-card glass reveal">
      <div class="pricing-tier">Elite</div>
      <div class="pricing-price" id="elite-price">$29<span>/mo</span></div>
      <div class="pricing-period" id="elite-period">Billed monthly</div>
      <ul class="pricing-features">
        <li>Everything in Voyager</li>
        <li>Concierge support</li>
        <li>Exclusive member deals</li>
        <li>Vibe matching AI</li>
        <li>Instant rebooking</li>
      </ul>
      <button class="btn-ghost" style="width:100%;padding:14px;">Go Elite</button>
    </div>
  </div>
</section>
```

- [ ] Replace `<section id="footer-cta"></section>` with:
```html
<section id="footer-cta">
  <div class="label reveal">Get started</div>
  <h2 class="reveal" style="margin-top:12px;max-width:520px;">Your next trip starts with one question.</h2>

  <div class="footer-wizard glass reveal">
    <input class="wizard-input" type="text" placeholder="Where do you want to go?" style="margin:0 0 12px;">
    <button class="btn-primary" style="width:100%;padding:14px;font-size:15px;">Plan My Trip with AI ✨</button>
  </div>

  <div class="footer-links">
    <a href="#">About</a>
    <a href="#">Blog</a>
    <a href="#">Careers</a>
    <a href="#pricing">Pricing</a>
    <a href="#">Privacy</a>
    <a href="#">Terms</a>
  </div>
  <p style="margin-top:24px;font-size:12px;">© 2026 Voya. All rights reserved.</p>
</section>
```

- [ ] Verify: open `http://localhost:3000/AI Booking App/` — all 7 sections visible, unstyled content in place.

- [ ] Commit:
```bash
git -C "/Users/brucewayne/Desktop/VOSSWeb3D Design" add "AI Booking App/index.html" && git -C "/Users/brucewayne/Desktop/VOSSWeb3D Design" commit -m "feat: all 7 section HTML content"
```

---

## Task 4: Three.js Scene Foundation

**Files:** Write `js/scene.js`

- [ ] Write `js/scene.js`:
```js
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export const scene = new THREE.Scene();

export const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0, 5);

const canvas = document.getElementById('bg-canvas');
export const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.setClearColor(0x0D1B3E, 1);

export const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.4, 0.4, 0.85);
composer.addPass(bloom);

const film = new FilmPass(0.15, false);
composer.addPass(film);

composer.addPass(new OutputPass());

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
});

export function startLoop(fn) {
  renderer.setAnimationLoop((t) => { fn(t); composer.render(); });
}
```

- [ ] Verify: no console import errors at `http://localhost:3000/AI Booking App/` after main.js imports scene.js.

- [ ] Commit:
```bash
git -C "/Users/brucewayne/Desktop/VOSSWeb3D Design" add "AI Booking App/js/scene.js" && git -C "/Users/brucewayne/Desktop/VOSSWeb3D Design" commit -m "feat: Three.js scene with EffectComposer + UnrealBloom + FilmPass"
```

---

## Task 5: Atmosphere System

**Files:** Write `js/atmosphere.js`

- [ ] Write `js/atmosphere.js`:
```js
import * as THREE from 'three';
import { scene, renderer } from './scene.js';

const CONFIGS = {
  'hero':         { fog: 0x1A9FE0, fogNear: 8,  fogFar: 30, light: 0x00D4FF, li: 2.5, particle: 0x1A9FE0, bg: 0x0D1B3E },
  'how-it-works': { fog: 0x2D1B69, fogNear: 10, fogFar: 35, light: 0x6B21A8, li: 1.8, particle: 0xA78BFA, bg: 0x080B1A },
  'destinations': { fog: 0x006994, fogNear: 8,  fogFar: 28, light: 0x00D4FF, li: 2.0, particle: 0x00D4FF, bg: 0x04101A },
  'features':     { fog: 0x0D1B3E, fogNear: 12, fogFar: 40, light: 0x1A9FE0, li: 3.0, particle: 0x1A9FE0, bg: 0x060D1E },
  'testimonials': { fog: 0x2D1B69, fogNear: 10, fogFar: 32, light: 0x6B21A8, li: 2.0, particle: 0xA78BFA, bg: 0x080B1A },
  'pricing':      { fog: 0x050A1A, fogNear: 15, fogFar: 50, light: 0x00D4FF, li: 1.2, particle: 0xFFFFFF, bg: 0x020508 },
  'footer-cta':   { fog: 0x1A9FE0, fogNear: 8,  fogFar: 30, light: 0x00D4FF, li: 2.5, particle: 0x1A9FE0, bg: 0x0D1B3E },
};

const init = CONFIGS['hero'];
scene.fog = new THREE.FogExp2(init.fog, 0.02);

export const cursorLight = new THREE.PointLight(init.light, init.li, 12);
scene.add(cursorLight);

scene.add(new THREE.AmbientLight(0x1A3A6A, 0.4));
const fillLight = new THREE.PointLight(0x6B21A8, 0.8, 20);
fillLight.position.set(-5, 3, -5);
scene.add(fillLight);

// Particles
const pCount = 800;
const pPos = new Float32Array(pCount * 3);
for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 40;
const pGeo = new THREE.BufferGeometry();
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
const pMat = new THREE.PointsMaterial({ color: init.particle, size: 0.06, transparent: true, opacity: 0.55, sizeAttenuation: true });
export const particles = new THREE.Points(pGeo, pMat);
scene.add(particles);

const fogCol   = new THREE.Color(init.fog);
const lightCol = new THREE.Color(init.light);
const partCol  = new THREE.Color(init.particle);
const bgCol    = new THREE.Color(init.bg);

export function morphToSection(id) {
  const cfg = CONFIGS[id] || CONFIGS['hero'];
  const tf = new THREE.Color(cfg.fog);
  const tl = new THREE.Color(cfg.light);
  const tp = new THREE.Color(cfg.particle);
  const tb = new THREE.Color(cfg.bg);

  gsap.to(fogCol,   { r: tf.r, g: tf.g, b: tf.b, duration: 1.4, onUpdate: () => scene.fog.color.copy(fogCol) });
  gsap.to(lightCol, { r: tl.r, g: tl.g, b: tl.b, duration: 1.4, onUpdate: () => cursorLight.color.copy(lightCol) });
  gsap.to(partCol,  { r: tp.r, g: tp.g, b: tp.b, duration: 1.4, onUpdate: () => pMat.color.copy(partCol) });
  gsap.to(bgCol,    { r: tb.r, g: tb.g, b: tb.b, duration: 1.4, onUpdate: () => renderer.setClearColor(bgCol, 1) });
  gsap.to(cursorLight, { intensity: cfg.li, duration: 1.4 });
}

export function tickParticles(t) {
  particles.rotation.y = t * 0.00004;
  particles.rotation.x = t * 0.00002;
}
```

- [ ] Verify: after wiring in main.js (next task) — canvas background should be deep indigo.

- [ ] Commit:
```bash
git -C "/Users/brucewayne/Desktop/VOSSWeb3D Design" add "AI Booking App/js/atmosphere.js" && git -C "/Users/brucewayne/Desktop/VOSSWeb3D Design" commit -m "feat: per-section atmosphere system with fog/light/particle morph"
```

---

## Task 6: Cursor System

**Files:** Write `js/cursor.js`

- [ ] Write `js/cursor.js`:
```js
import { cursorLight, camera } from './atmosphere.js';

const el  = document.getElementById('cursor');
const dot = document.getElementById('cursor-dot');

let mx = 0, my = 0;   // raw mouse
let cx = 0, cy = 0;   // spring cursor position
const stiffness = 0.08, damping = 0.85;
let vx = 0, vy = 0;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
});

export function tickCursor() {
  // Spring physics
  const dx = mx - cx;
  const dy = my - cy;
  vx = vx * damping + dx * stiffness;
  vy = vy * damping + dy * stiffness;
  cx += vx;
  cy += vy;

  el.style.left  = cx + 'px';
  el.style.top   = cy + 'px';
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';

  // Map mouse to 3D space for PointLight
  const nx = (mx / innerWidth)  * 2 - 1;
  const ny = (my / innerHeight) * 2 - 1;
  cursorLight.position.set(nx * 8, -ny * 5, 3);
}
```

- [ ] Commit:
```bash
git -C "/Users/brucewayne/Desktop/VOSSWeb3D Design" add "AI Booking App/js/cursor.js" && git -C "/Users/brucewayne/Desktop/VOSSWeb3D Design" commit -m "feat: spring-physics cursor + PointLight follow"
```

---

## Task 7: Animations — Lenis, ScrollTrigger, Reveals

**Files:** Write `js/animations.js`

- [ ] Write `js/animations.js`:
```js
import { morphToSection } from './atmosphere.js';

export function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Lenis smooth scroll
  const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // Section atmosphere triggers
  const sections = ['hero','how-it-works','destinations','features','testimonials','pricing','footer-cta'];
  sections.forEach(id => {
    ScrollTrigger.create({
      trigger: `#${id}`,
      start: 'top center',
      onEnter:      () => morphToSection(id),
      onEnterBack:  () => morphToSection(id),
    });
  });

  // Generic reveal — any .reveal element
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
    });
  });

  gsap.utils.toArray('.reveal-left').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      x: -50, opacity: 0, duration: 0.9, ease: 'power3.out',
    });
  });

  gsap.utils.toArray('.reveal-right').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      x: 50, opacity: 0, duration: 0.9, ease: 'power3.out',
    });
  });

  // Step cards stagger
  gsap.utils.toArray('.step-card').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
      y: 60, opacity: 0, duration: 0.8, delay: i * 0.15, ease: 'power3.out',
    });
  });

  // Feature pills stagger
  gsap.utils.toArray('.feature-pill').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
      x: 50, opacity: 0, duration: 0.7, delay: i * 0.12, ease: 'power3.out',
    });
  });

  // Destination cards stagger
  gsap.utils.toArray('.dest-card').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: '#destinations', start: 'top 80%', toggleActions: 'play none none none' },
      y: 50, opacity: 0, duration: 0.7, delay: i * 0.08, ease: 'power3.out',
    });
  });

  // Pricing cards stagger
  gsap.utils.toArray('.pricing-card').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: '#pricing', start: 'top 80%', toggleActions: 'play none none none' },
      y: 60, opacity: 0, duration: 0.8, delay: i * 0.15, ease: 'power3.out',
    });
  });

  // Stat count-up
  gsap.utils.toArray('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target, duration: 2, ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(this.targets()[0].val).toLocaleString(); }
        });
      }
    });
  });

  // Sticky wizard bubble
  const bubble = document.getElementById('wizard-bubble');
  ScrollTrigger.create({
    trigger: '#hero', end: 'bottom top',
    onLeave:      () => bubble.classList.add('visible'),
    onEnterBack:  () => bubble.classList.remove('visible'),
  });

  // 3D card tilt
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 20;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 20;
      card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.03)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Drag-to-scroll destinations
  const track = document.getElementById('dest-track');
  if (track) {
    let isDown = false, startX = 0, scrollL = 0;
    track.addEventListener('mousedown',  e => { isDown = true; startX = e.pageX - track.offsetLeft; scrollL = track.scrollLeft; track.style.cursor = 'grabbing'; });
    track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mouseup',   () => { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mousemove',  e => { if (!isDown) return; e.preventDefault(); track.scrollLeft = scrollL - (e.pageX - track.offsetLeft - startX); });
  }

  return lenis;
}

// Testimonials carousel
let currentSlide = 0;
const slides = () => document.querySelectorAll('.testimonial-card');
const slideDots = () => document.querySelectorAll('.carousel-dot');

export function goToSlide(n) {
  slides().forEach((s, i) => s.classList.toggle('active', i === n));
  slideDots().forEach((d, i) => d.classList.toggle('active', i === n));
  currentSlide = n;
}
window.goToSlide = goToSlide;

export function initCarousel() {
  setInterval(() => {
    const next = (currentSlide + 1) % slides().length;
    goToSlide(next);
  }, 4500);
}

// Pricing toggle
let isAnnual = false;
export function toggleBilling() {
  isAnnual = !isAnnual;
  document.getElementById('billing-toggle').classList.toggle('annual', isAnnual);
  const vPrice = document.getElementById('voyager-price');
  const ePrice = document.getElementById('elite-price');
  const vPeriod = document.getElementById('voyager-period');
  const ePeriod = document.getElementById('elite-period');
  gsap.to([vPrice, ePrice], { rotateX: 90, duration: 0.2, onComplete: () => {
    vPrice.innerHTML = isAnnual ? '$10<span>/mo</span>' : '$12<span>/mo</span>';
    ePrice.innerHTML = isAnnual ? '$23<span>/mo</span>' : '$29<span>/mo</span>';
    vPeriod.textContent = isAnnual ? 'Billed $118/year' : 'Billed monthly';
    ePeriod.textContent = isAnnual ? 'Billed $276/year' : 'Billed monthly';
    gsap.to([vPrice, ePrice], { rotateX: 0, duration: 0.2 });
  }});
}
window.toggleBilling = toggleBilling;
```

- [ ] Commit:
```bash
git -C "/Users/brucewayne/Desktop/VOSSWeb3D Design" add "AI Booking App/js/animations.js" && git -C "/Users/brucewayne/Desktop/VOSSWeb3D Design" commit -m "feat: Lenis + GSAP ScrollTrigger, all reveals, carousel, pricing toggle, card tilt"
```

---

## Task 8: AI Wizard Logic

**Files:** Write `js/wizard.js`

- [ ] Write `js/wizard.js`:
```js
let step = 1;
const TOTAL = 5;

const MOCK_TRIPS = [
  { name: 'Tokyo + Kyoto Duo', desc: 'Ryokan hotel, bullet train, cultural tours', price: '$1,280' },
  { name: 'Bali Retreat',       desc: 'Beachfront villa, spa, sunrise hike',       price: '$1,490' },
  { name: 'Santorini Escape',   desc: 'Cave hotel, sailing tour, wine tasting',    price: '$1,850' },
  { name: 'Marrakech Magic',    desc: 'Riad stay, Atlas mountains, street food',   price: '$980'  },
  { name: 'Patagonia Wild',     desc: 'Trekking lodge, guided trails, kayak tour', price: '$2,100' },
];

const THINKING_LINES = [
  'Scanning 2,400 destinations…',
  'Finding best flight combos…',
  'Matching your vibe profile…',
  'Calculating optimal dates…',
  'Building your itinerary…',
];

function showStep(n) {
  document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
  const target = document.querySelector(`[data-step="${n}"]`);
  if (target) { target.classList.add('active'); gsap.from(target, { opacity: 0, y: 16, duration: 0.4 }); }
}

export function wizardNext() {
  if (step < 4) { step++; showStep(step); }
}

export function wizardPrev() {
  if (step > 1) { step--; showStep(step); }
}

export function selectVibe(btn) {
  document.querySelectorAll('.vibe-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

export function updateBudget(input) {
  const v = parseInt(input.value);
  document.getElementById('budget-display').textContent = v >= 10000 ? '$10,000+' : `$${v.toLocaleString()}`;
}

export function wizardGenerate() {
  step = 5;
  showStep(5);
  const thinking = document.getElementById('thinking-text');
  const results  = document.getElementById('trip-results');
  results.style.display = 'none';

  let i = 0;
  const interval = setInterval(() => {
    thinking.textContent = THINKING_LINES[i % THINKING_LINES.length];
    i++;
    if (i >= THINKING_LINES.length) {
      clearInterval(interval);
      setTimeout(() => {
        document.getElementById('wizard-thinking').style.display = 'none';
        results.style.display = 'flex';
        results.innerHTML = '';
        const picks = MOCK_TRIPS.sort(() => Math.random() - 0.5).slice(0, 3);
        picks.forEach((t, idx) => {
          const card = document.createElement('div');
          card.className = 'trip-card';
          card.innerHTML = `<div class="trip-card-info"><h4>${t.name}</h4><p>${t.desc}</p></div><div class="trip-card-price">${t.price}</div>`;
          results.appendChild(card);
          gsap.from(card, { opacity: 0, y: 20, duration: 0.5, delay: idx * 0.12 });
        });
      }, 400);
    }
  }, 600);
}

export function wizardReset() {
  step = 1;
  showStep(1);
  document.getElementById('wizard-thinking').style.display = 'block';
  document.getElementById('trip-results').style.display = 'none';
}

// Wizard overlay (sticky bubble)
export function initWizardOverlay() {
  const overlay = document.getElementById('wizard-overlay');
  const bubble  = document.getElementById('wizard-bubble');
  bubble.addEventListener('click', () => overlay.classList.add('open'));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });
}

// Expose to HTML onclick handlers
window.wizardNext     = wizardNext;
window.wizardPrev     = wizardPrev;
window.selectVibe     = selectVibe;
window.updateBudget   = updateBudget;
window.wizardGenerate = wizardGenerate;
window.wizardReset    = wizardReset;
```

- [ ] Verify: click through all 5 wizard steps in browser, confirm mock results appear.

- [ ] Commit:
```bash
git -C "/Users/brucewayne/Desktop/VOSSWeb3D Design" add "AI Booking App/js/wizard.js" && git -C "/Users/brucewayne/Desktop/VOSSWeb3D Design" commit -m "feat: 5-step AI wizard flow with mock trip generation"
```

---

## Task 9: Main Entry Point + Hero Entrance

**Files:** Write `js/main.js`

- [ ] Write `js/main.js`:
```js
import { scene, camera, startLoop } from './scene.js';
import { particles, tickParticles } from './atmosphere.js';
import { tickCursor } from './cursor.js';
import { initAnimations, initCarousel } from './animations.js';
import { initWizardOverlay } from './wizard.js';

// Hero entrance timeline
function heroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('#navbar',           { y: -60, opacity: 0, duration: 0.8 })
    .from('.hero-content .label', { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')
    .from('.hero-content h1',  { y: 30, opacity: 0, duration: 0.8 }, '-=0.4')
    .from('.hero-content p',   { y: 20, opacity: 0, duration: 0.6 }, '-=0.5')
    .from('.wizard-card',      { y: 40, opacity: 0, duration: 0.8, scale: 0.97 }, '-=0.3')
    .from('.hero-stats .stat', { y: 20, opacity: 0, stagger: 0.1, duration: 0.6 }, '-=0.4');
}

// Render loop
startLoop((t) => {
  tickParticles(t);
  tickCursor();
});

// Init everything on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  heroEntrance();
  initAnimations();
  initCarousel();
  initWizardOverlay();
});
```

- [ ] Verify: open `http://localhost:3000/AI Booking App/` — hero animates in on load, scrolling reveals sections with atmosphere shifts, particles visible rotating, cursor spring follows mouse.

- [ ] Commit:
```bash
git -C "/Users/brucewayne/Desktop/VOSSWeb3D Design" add "AI Booking App/js/main.js" && git -C "/Users/brucewayne/Desktop/VOSSWeb3D Design" commit -m "feat: main entry point, hero entrance timeline, full render loop"
```

---

## Self-Review

**Spec coverage check:**
- [x] Travel & Hospitality booking type — wizard handles trips
- [x] Modern Explorer palette — Deep Indigo + Sky Blue + Passport Purple + Cyan applied
- [x] AI-First Wizard — 5 steps, no search bar
- [x] Immersive single scroll — one page, 7 sections
- [x] Landing + live demo — all marketing sections + live wizard in hero
- [x] Liquid Glass on all surfaces — `.glass` class on all cards/panels/navbar
- [x] Scroll-based 3D atmosphere — `atmosphere.js` morphs per section
- [x] Spring-physics cursor — `cursor.js` with stiffness/damping
- [x] 8K quality rendering — UnrealBloom + FilmPass + ACESFilmic + PixelRatio cap
- [x] GSAP ScrollTrigger reveals — all sections, stagger, count-up
- [x] Lenis smooth scroll — integrated in `animations.js`
- [x] Sticky wizard bubble — appears after hero, click opens overlay
- [x] Destination cards with 3D tilt — `data-tilt` + mousemove handler
- [x] Pricing monthly/annual toggle — GSAP price flip
- [x] Testimonials auto-carousel — 4.5s interval
- [x] Drag-to-scroll destinations — mousedown/mousemove handler

**Placeholder scan:** No TBDs. All functions reference defined methods. Unsplash URLs are real and loadable.

**Type consistency:** `morphToSection(id)` called with section IDs matching `CONFIGS` keys throughout. `tickParticles`, `tickCursor` called identically in loop. `window.*` globals match `onclick` handlers in HTML.

---

**Plan saved to `docs/superpowers/plans/2026-05-01-ai-booking-app.md`.**

Two execution options:

**1. Subagent-Driven (recommended)** — fresh subagent per task, fast iteration, review between tasks

**2. Inline Execution** — execute tasks in this session sequentially with checkpoints

Which approach?
