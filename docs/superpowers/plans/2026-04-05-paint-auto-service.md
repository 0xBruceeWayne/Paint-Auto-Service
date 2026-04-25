# Paint Auto Service Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-file, dark cinematic showcase website in Romanian for Paint Auto Service with a Three.js 3D rotating wheel hero.

**Architecture:** Single `index.html` file with all CSS and JS inlined. No build tools, no frameworks, no dependencies except Three.js and Google Fonts via CDN. Opens directly in any browser.

**Tech Stack:** HTML5, CSS3 (custom properties, keyframes, backdrop-filter), Vanilla JS (IntersectionObserver, scroll events), Three.js r128 via CDN, Google Fonts (Rajdhani)

---

## File Structure

- **Create:** `index.html` — entire website (HTML + inlined `<style>` + inlined `<script>`)
- **Use:** `/Users/brucewayne/Desktop/Screenshot 2026-04-02 at 20.29.32.png` — logo (referenced as `file:///Users/brucewayne/Desktop/Screenshot%202026-04-02%20at%2020.29.32.png`)

---

### Task 1: HTML Skeleton + CSS Variables + Google Fonts

**Files:**
- Create: `index.html`

- [ ] **Step 1: Create the base HTML file with head, fonts, and CSS variables**

Create `/Users/brucewayne/Desktop/WORK/index.html` with this exact content:

```html
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Paint Auto Service</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --red: #e02020;
      --red-dark: #a01010;
      --bg: #0d0d0d;
      --bg-card: rgba(255,255,255,0.04);
      --border: rgba(255,255,255,0.08);
      --white: #ffffff;
      --silver: #c0c0c0;
      --gray: #888888;
      --font: 'Rajdhani', sans-serif;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: var(--bg); color: var(--white); font-family: var(--font); overflow-x: hidden; }
  </style>
</head>
<body>
  <!-- Sections will be added in subsequent tasks -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script>
    // JS will be added in subsequent tasks
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify in browser**

Open `index.html` in a browser. Expected: blank dark page (`#0d0d0d` background), no console errors, no 404s for fonts or Three.js CDN.

- [ ] **Step 3: Commit**

```bash
cd /Users/brucewayne/Desktop/WORK
git init
git add index.html
git commit -m "feat: init html skeleton with css variables and cdn imports"
```

---

### Task 2: Navbar

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add navbar HTML inside `<body>` before the script tags**

```html
<nav id="navbar">
  <a href="#hero" class="nav-logo">
    <img src="file:///Users/brucewayne/Desktop/Screenshot%202026-04-02%20at%2020.29.32.png" alt="Paint Auto Service" />
  </a>
  <ul class="nav-links">
    <li><a href="#hero">Acasă</a></li>
    <li><a href="#services">Servicii</a></li>
    <li><a href="#about">Despre</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>
```

- [ ] **Step 2: Add navbar CSS inside `<style>`**

```css
#navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5vw;
  height: 72px;
  background: transparent;
  transition: background 0.3s, backdrop-filter 0.3s;
}
#navbar.scrolled {
  background: rgba(13,13,13,0.92);
  backdrop-filter: blur(12px);
}
.nav-logo img { height: 48px; object-fit: contain; }
.nav-links { list-style: none; display: flex; gap: 2.5rem; }
.nav-links a {
  color: var(--white);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  position: relative;
  padding-bottom: 4px;
}
.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 0; height: 2px;
  background: var(--red);
  transition: width 0.25s ease;
}
.nav-links a:hover::after { width: 100%; }
@media (max-width: 640px) {
  .nav-links { display: none; }
}
```

- [ ] **Step 3: Add navbar scroll JS inside the `<script>` tag**

```js
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});
```

- [ ] **Step 4: Verify in browser**

Open `index.html`. Expected: fixed transparent navbar with logo on left and 4 links on right. Scrolling (once there's content) should add a blurred dark background. Hovering links shows red underline animation.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add fixed navbar with scroll effect and hover underlines"
```

---

### Task 3: Hero Section — Text Side

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add hero HTML after `<nav>` and before `<script>` tags**

```html
<section id="hero">
  <div class="hero-content">
    <div class="hero-text">
      <p class="hero-pre">Servicii Auto Profesionale</p>
      <h1 class="hero-title">EXPERȚI ÎN<br/><span>ÎNGRIJIREA</span><br/>MAȘINII TALE</h1>
      <p class="hero-sub">Calitate, precizie și pasiune pentru fiecare mașină</p>
      <a href="#services" class="btn-red">Descoperă Serviciile</a>
    </div>
    <div class="hero-wheel" id="wheel-canvas-wrap"></div>
  </div>
</section>
```

- [ ] **Step 2: Add hero CSS inside `<style>`**

```css
#hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: radial-gradient(ellipse 60% 60% at 70% 50%, rgba(224,32,32,0.12) 0%, transparent 70%), var(--bg);
}
.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 5vw;
  gap: 2rem;
}
.hero-text {
  flex: 1;
  max-width: 560px;
  opacity: 0;
  transform: translateY(40px);
  animation: fadeUp 0.9s ease 0.3s forwards;
}
.hero-pre {
  color: var(--red);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}
.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}
.hero-title span { color: var(--red); }
.hero-sub {
  font-size: 1.1rem;
  color: var(--silver);
  margin-bottom: 2.5rem;
  font-weight: 400;
  line-height: 1.6;
}
.btn-red {
  display: inline-block;
  padding: 0.85rem 2.4rem;
  background: var(--red);
  color: var(--white);
  text-decoration: none;
  font-family: var(--font);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 50px;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 0 0 rgba(224,32,32,0);
}
.btn-red:hover {
  background: #ff2828;
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(224,32,32,0.45);
}
.hero-wheel {
  flex: 1;
  min-height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  animation: fadeIn 1.2s ease 0.8s forwards;
}
@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  to { opacity: 1; }
}
@media (max-width: 768px) {
  .hero-content { flex-direction: column; padding-top: 100px; text-align: center; }
  .hero-wheel { min-height: 280px; width: 100%; }
}
```

- [ ] **Step 3: Verify in browser**

Expected: full-screen dark hero with text on left (animates in from below), red headline accent, red CTA button. Right side is empty (wheel comes next task). Subtle red radial glow on the right half of background.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add hero text with entrance animations and red cta button"
```

---

### Task 4: Hero Section — Three.js 3D Wheel

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add Three.js wheel code inside the `<script>` tag, after the navbar scroll code**

```js
(function initWheel() {
  const wrap = document.getElementById('wheel-canvas-wrap');
  if (!wrap) return;

  const W = wrap.clientWidth || 500;
  const H = wrap.clientHeight || 420;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(W, H);
  renderer.shadowMap.enabled = true;
  wrap.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
  camera.position.set(0, 0, 5.5);

  // Lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);

  const redPoint = new THREE.PointLight(0xe02020, 3, 12);
  redPoint.position.set(-3, 2, 3);
  scene.add(redPoint);

  const whitePoint = new THREE.PointLight(0xffffff, 2, 15);
  whitePoint.position.set(3, 3, 4);
  scene.add(whitePoint);

  const rimLight = new THREE.PointLight(0xaaaaaa, 1.5, 10);
  rimLight.position.set(0, -3, -2);
  scene.add(rimLight);

  // Materials
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 1.0,
    roughness: 0.15,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.8,
    roughness: 0.3,
  });
  const redMat = new THREE.MeshStandardMaterial({
    color: 0xe02020,
    metalness: 0.5,
    roughness: 0.4,
    emissive: 0xe02020,
    emissiveIntensity: 0.15,
  });

  const wheel = new THREE.Group();
  scene.add(wheel);

  // Outer tire ring
  const tireGeo = new THREE.TorusGeometry(2, 0.55, 24, 80);
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.1, roughness: 0.9 });
  const tire = new THREE.Mesh(tireGeo, tireMat);
  wheel.add(tire);

  // Rim outer ring
  const rimGeo = new THREE.TorusGeometry(1.9, 0.08, 16, 80);
  const rim = new THREE.Mesh(rimGeo, chromeMat);
  wheel.add(rim);

  // Inner rim ring
  const innerRimGeo = new THREE.TorusGeometry(1.3, 0.06, 16, 80);
  const innerRim = new THREE.Mesh(innerRimGeo, chromeMat);
  wheel.add(innerRim);

  // Center hub
  const hubGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.22, 32);
  hubGeo.rotateX(Math.PI / 2);
  const hub = new THREE.Mesh(hubGeo, chromeMat);
  wheel.add(hub);

  // Center cap (red accent)
  const capGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.24, 32);
  capGeo.rotateX(Math.PI / 2);
  const cap = new THREE.Mesh(capGeo, redMat);
  wheel.add(cap);

  // Spokes — 5 spokes
  const spokeCount = 5;
  for (let i = 0; i < spokeCount; i++) {
    const angle = (i / spokeCount) * Math.PI * 2;
    const spoke = new THREE.Group();

    // Main spoke bar
    const spokeGeo = new THREE.BoxGeometry(0.13, 1.55, 0.09);
    const spokeMesh = new THREE.Mesh(spokeGeo, chromeMat);
    spokeMesh.position.y = 0.78;
    spoke.add(spokeMesh);

    // Spoke side fins (Y-shape splits near rim)
    const finGeo = new THREE.BoxGeometry(0.09, 0.5, 0.07);
    [-0.15, 0.15].forEach(offsetX => {
      const fin = new THREE.Mesh(finGeo, darkMat);
      fin.position.set(offsetX, 1.45, 0);
      fin.rotation.z = offsetX > 0 ? -0.3 : 0.3;
      spoke.add(fin);
    });

    spoke.rotation.z = angle;
    wheel.add(spoke);
  }

  // Lug nuts (5)
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 + (Math.PI / 5);
    const nutGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.12, 8);
    nutGeo.rotateX(Math.PI / 2);
    const nut = new THREE.Mesh(nutGeo, darkMat);
    nut.position.set(Math.cos(angle) * 0.55, Math.sin(angle) * 0.55, 0.12);
    wheel.add(nut);
  }

  // Tilt the wheel slightly for drama
  wheel.rotation.x = 0.18;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    wheel.rotation.y += 0.008;
    // Pulse the red light
    redPoint.intensity = 3 + Math.sin(Date.now() * 0.001) * 0.6;
    renderer.render(scene, camera);
  }
  animate();

  // Responsive resize
  window.addEventListener('resize', () => {
    const nW = wrap.clientWidth;
    const nH = wrap.clientHeight;
    camera.aspect = nW / nH;
    camera.updateProjectionMatrix();
    renderer.setSize(nW, nH);
  });
})();
```

- [ ] **Step 2: Verify in browser**

Expected: A detailed 3D wheel with 5 spokes on the right side of the hero, slowly rotating. Chrome/metallic finish with red point light glow. Subtle pulse on the red light. Wheel tilted slightly for depth.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add three.js 3d rotating wheel to hero"
```

---

### Task 5: Stats Strip

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add stats HTML after the `</section>` closing tag of hero**

```html
<section id="about" class="stats-strip">
  <div class="stat">
    <span class="stat-num" data-target="15">0</span><span class="stat-suffix">+</span>
    <p>Ani de Experiență</p>
  </div>
  <div class="stat">
    <span class="stat-num" data-target="2000">0</span><span class="stat-suffix">+</span>
    <p>Mașini Reparate</p>
  </div>
  <div class="stat">
    <span class="stat-num" data-target="98">0</span><span class="stat-suffix">%</span>
    <p>Clienți Mulțumiți</p>
  </div>
</section>
```

- [ ] **Step 2: Add stats CSS inside `<style>`**

```css
.stats-strip {
  display: flex;
  justify-content: center;
  gap: 0;
  background: rgba(224,32,32,0.08);
  border-top: 1px solid rgba(224,32,32,0.2);
  border-bottom: 1px solid rgba(224,32,32,0.2);
}
.stat {
  flex: 1;
  max-width: 280px;
  text-align: center;
  padding: 3rem 2rem;
  border-right: 1px solid rgba(255,255,255,0.06);
}
.stat:last-child { border-right: none; }
.stat-num {
  font-size: clamp(2.8rem, 5vw, 4rem);
  font-weight: 700;
  color: var(--red);
  line-height: 1;
}
.stat-suffix {
  font-size: 2rem;
  font-weight: 700;
  color: var(--red);
}
.stat p {
  color: var(--silver);
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-top: 0.5rem;
}
```

- [ ] **Step 3: Add count-up JS inside `<script>`, after the wheel code**

```js
function countUp(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      countUp(e.target);
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(n => statsObserver.observe(n));
```

- [ ] **Step 4: Verify in browser**

Expected: A full-width dark red-tinted strip with 3 stats. Numbers animate counting up when the strip scrolls into view. Triggered only once.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add stats strip with intersection observer count-up animation"
```

---

### Task 6: Services Section

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add services HTML after the stats strip `</section>`**

```html
<section id="services" class="services-section">
  <div class="section-header reveal">
    <p class="section-pre">Ce Oferim</p>
    <h2 class="section-title">SERVICIILE <span>NOASTRE</span></h2>
  </div>
  <div class="services-grid">

    <div class="service-card reveal">
      <div class="card-icon">
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 36c0 0 4-8 16-8s16 8 16 8"/><circle cx="24" cy="18" r="6"/>
          <path d="M4 40h40"/><path d="M12 40V28"/><path d="M36 40V28"/>
        </svg>
      </div>
      <div class="card-top-border"></div>
      <h3>Vopsire Auto</h3>
      <p>Vopsire profesională pentru un finish impecabil și durabil</p>
    </div>

    <div class="service-card reveal">
      <div class="card-icon">
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="6" y="14" width="36" height="20" rx="4"/>
          <path d="M6 22h36"/><path d="M16 14v-4"/><path d="M32 14v-4"/>
          <circle cx="14" cy="34" r="4"/><circle cx="34" cy="34" r="4"/>
        </svg>
      </div>
      <div class="card-top-border"></div>
      <h3>Reparații Caroserie</h3>
      <p>Eliminăm loviturile și zgârieturile rapid și eficient</p>
    </div>

    <div class="service-card reveal">
      <div class="card-icon">
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 38l4-4 4 4-4 4z"/><path d="M14 34L34 14"/><path d="M34 14l4-4 4 4-4 4z"/>
          <path d="M6 18l8-8"/><path d="M26 38l8-8"/>
        </svg>
      </div>
      <div class="card-top-border"></div>
      <h3>Lucrări Tablă</h3>
      <p>Intervenții precise asupra structurii caroseriei</p>
    </div>

    <div class="service-card reveal">
      <div class="card-icon">
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="24" cy="24" r="16"/><circle cx="24" cy="24" r="8"/>
          <path d="M24 8v4"/><path d="M24 36v4"/><path d="M8 24h4"/><path d="M36 24h4"/>
        </svg>
      </div>
      <div class="card-top-border"></div>
      <h3>Polish & Lustruire</h3>
      <p>Redăm strălucirea originală a lacului mașinii tale</p>
    </div>

    <div class="service-card reveal">
      <div class="card-icon">
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 34c0-8 4-14 10-16"/><path d="M42 34c0-8-4-14-10-16"/>
          <path d="M16 18c0 0 2 6 8 6s8-6 8-6"/><path d="M24 24v10"/><path d="M18 34h12"/>
        </svg>
      </div>
      <div class="card-top-border"></div>
      <h3>Detailing Complet</h3>
      <p>Curățare și îngrijire totală, interior și exterior</p>
    </div>

    <div class="service-card reveal">
      <div class="card-icon">
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 28l4-4 8 8-4 4z"/><path d="M32 8l4 4-14 14-4-4z"/>
          <circle cx="36" cy="12" r="4"/><path d="M18 30l-8 8"/>
        </svg>
      </div>
      <div class="card-top-border"></div>
      <h3>Mecanică Generală</h3>
      <p>Diagnoză și repararea sistemelor mecanice ale vehiculului</p>
    </div>

  </div>
</section>
```

- [ ] **Step 2: Add services CSS inside `<style>`**

```css
.services-section {
  padding: 7rem 5vw;
  background: var(--bg);
}
.section-header {
  text-align: center;
  margin-bottom: 4rem;
}
.section-pre {
  color: var(--red);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}
.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.section-title span { color: var(--red); }

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}
.service-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 2.5rem 2rem 2rem;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: default;
}
.service-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(224,32,32,0.18);
}
.card-top-border {
  position: absolute;
  top: 0; left: 0;
  height: 3px;
  width: 0;
  background: var(--red);
  transition: width 0.4s ease;
}
.service-card:hover .card-top-border { width: 100%; }
.card-icon {
  width: 52px;
  height: 52px;
  color: var(--red);
  margin-bottom: 1.25rem;
}
.card-icon svg { width: 100%; height: 100%; }
.service-card h3 {
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.6rem;
}
.service-card p {
  color: var(--silver);
  font-size: 0.95rem;
  line-height: 1.6;
  font-weight: 400;
}
@media (max-width: 900px) {
  .services-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .services-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Add reveal-on-scroll JS inside `<script>`, after the stats code**

```js
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));
```

- [ ] **Step 4: Add reveal CSS inside `<style>`**

```css
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 5: Verify in browser**

Expected: 6 service cards in a 3×2 grid. Cards fade+slide up as you scroll to them. Hovering a card lifts it, shows red box-shadow glow, and the red top border expands across the full width. Icons are in red.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: add services grid with hover effects and reveal animations"
```

---

### Task 7: Contact Section + Footer

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add contact + footer HTML after the services section `</section>`**

```html
<section id="contact" class="contact-section">
  <div class="section-header reveal">
    <p class="section-pre">Unde Ne Găsești</p>
    <h2 class="section-title">CONTACTEAZĂ<span>-NE</span></h2>
  </div>
  <div class="contact-cards">
    <div class="contact-card reveal">
      <div class="contact-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.31h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      </div>
      <h4>Telefon</h4>
      <p>—</p>
    </div>
    <div class="contact-card reveal">
      <div class="contact-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
      <h4>Adresă</h4>
      <p>—</p>
    </div>
    <div class="contact-card reveal">
      <div class="contact-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      </div>
      <h4>Program</h4>
      <p>—</p>
    </div>
  </div>
</section>

<footer class="site-footer">
  <img src="file:///Users/brucewayne/Desktop/Screenshot%202026-04-02%20at%2020.29.32.png" alt="Paint Auto Service" class="footer-logo" />
  <div class="footer-socials">
    <a href="#" aria-label="Facebook">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
    </a>
    <a href="#" aria-label="Instagram">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
    </a>
  </div>
  <p class="footer-copy">© 2026 Paint Auto Service. Toate drepturile rezervate.</p>
</footer>
```

- [ ] **Step 2: Add contact + footer CSS inside `<style>`**

```css
.contact-section {
  padding: 7rem 5vw;
  background: linear-gradient(180deg, var(--bg) 0%, #0a0a0a 100%);
}
.contact-cards {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  max-width: 900px;
  margin: 0 auto;
  flex-wrap: wrap;
}
.contact-card {
  flex: 1;
  min-width: 220px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 2.5rem 2rem;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}
.contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(224,32,32,0.12);
}
.contact-icon {
  width: 44px;
  height: 44px;
  color: var(--red);
  margin: 0 auto 1rem;
}
.contact-icon svg { width: 100%; height: 100%; }
.contact-card h4 {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--silver);
  margin-bottom: 0.5rem;
}
.contact-card p {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--white);
}

.site-footer {
  background: #080808;
  border-top: 1px solid var(--border);
  padding: 3rem 5vw;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}
.footer-logo { height: 52px; object-fit: contain; }
.footer-socials { display: flex; gap: 1.25rem; }
.footer-socials a {
  width: 38px; height: 38px;
  color: var(--gray);
  transition: color 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.footer-socials a:hover { color: var(--red); }
.footer-socials svg { width: 22px; height: 22px; }
.footer-copy {
  color: var(--gray);
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}
```

- [ ] **Step 3: Verify in browser**

Expected: 3 contact cards (phone, address, hours) with placeholder `—` values and red icons. Footer with centered logo, Facebook + Instagram icon placeholders (turn red on hover), and copyright line.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add contact section and footer"
```

---

### Task 8: Final Polish — Scrollbar + Selection + Mobile QA

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add finishing CSS touches inside `<style>`**

```css
/* Custom scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--red); border-radius: 3px; }

/* Text selection */
::selection { background: var(--red); color: var(--white); }

/* Smooth section spacing on mobile */
@media (max-width: 640px) {
  .services-section, .contact-section { padding: 4rem 1.2rem; }
  .stats-strip { flex-direction: column; }
  .stat { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
}
```

- [ ] **Step 2: Full page QA checklist in browser**

Open `index.html` and verify all of the following:
- [ ] Logo appears in navbar and footer
- [ ] Navbar links smooth-scroll to correct sections
- [ ] Navbar gains blur background after scrolling down
- [ ] 3D wheel renders and rotates in hero
- [ ] Hero text animates in on load
- [ ] CTA button scrolls to services, hovers with lift + glow
- [ ] Stats count up when scrolled into view (exactly once)
- [ ] All 6 service cards visible in 3-column grid
- [ ] Service card hover: lifts, red glow, top border expands
- [ ] Section headings and cards fade in on scroll
- [ ] Contact section has 3 cards with `—` placeholders
- [ ] Footer social icons turn red on hover
- [ ] No console errors
- [ ] Resize to 375px width — layout stacks correctly on mobile

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: final polish - custom scrollbar, selection color, mobile tweaks"
```
