// Luminary — Scroll-Reactive 3D Background
// Morphing nebula sphere + layered star field + per-section GSAP atmosphere
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }     from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const IS_MOBILE = window.innerWidth <= 768 || navigator.maxTouchPoints > 0;

// ─── RENDERER ────────────────────────────────────────────────────────────────
const canvas = document.getElementById('cosmos');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !IS_MOBILE, alpha: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, IS_MOBILE ? 1 : 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// ─── SCENE ───────────────────────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07071a);
scene.fog = new THREE.FogExp2(0x07071a, 0.0);  // starts transparent, thickens per section

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 300);
camera.position.set(0, 0, 28);

// ─── POST PROCESSING ─────────────────────────────────────────────────────────
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.22, 0.38, 0.92);
composer.addPass(bloom);

// ─── HASH NOISE (no library needed) ──────────────────────────────────────────
function h(n) { return (Math.sin(n * 127.1 + 311.7) * 43758.5453123) % 1; }
function noise3(x, y, z) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const fx = x-ix, fy = y-iy, fz = z-iz;
  const ux = fx*fx*(3-2*fx), uy = fy*fy*(3-2*fy), uz = fz*fz*(3-2*fz);
  const n000=h(ix+h(iy+h(iz))),   n100=h(ix+1+h(iy+h(iz)));
  const n010=h(ix+h(iy+1+h(iz))), n110=h(ix+1+h(iy+1+h(iz)));
  const n001=h(ix+h(iy+h(iz+1))), n101=h(ix+1+h(iy+h(iz+1)));
  const n011=h(ix+h(iy+1+h(iz+1))), n111=h(ix+1+h(iy+1+h(iz+1)));
  return (n000*(1-ux)+n100*ux)*(1-uy)*(1-uz)
       + (n010*(1-ux)+n110*ux)*uy*(1-uz)
       + (n001*(1-ux)+n101*ux)*(1-uy)*uz
       + (n011*(1-ux)+n111*ux)*uy*uz;
}

// ─── STAR FIELD ──────────────────────────────────────────────────────────────
const STAR_COUNT = IS_MOBILE ? 1400 : 2400;
const starPos   = new Float32Array(STAR_COUNT * 3);
const starColor = new Float32Array(STAR_COUNT * 3);
const starSize  = new Float32Array(STAR_COUNT);

const palettes = [
  new THREE.Color(0xffffff),  // pure white      45%
  new THREE.Color(0xdde8ff),  // ice white       18%
  new THREE.Color(0x8b5cf6),  // purple          15%
  new THREE.Color(0xa78bfa),  // soft purple     15%
  new THREE.Color(0xe8b84b),  // gold             7%
];

for (let i = 0; i < STAR_COUNT; i++) {
  const r = 35 + Math.random() * 80;
  const theta = Math.random() * Math.PI * 2;
  const phi   = Math.acos(2 * Math.random() - 1);
  starPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
  starPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
  starPos[i*3+2] = r * Math.cos(phi);

  const rnd = Math.random();
  const col = rnd < .45 ? palettes[0] : rnd < .63 ? palettes[1]
            : rnd < .78 ? palettes[2] : rnd < .93 ? palettes[3] : palettes[4];
  starColor[i*3]=col.r; starColor[i*3+1]=col.g; starColor[i*3+2]=col.b;
  starSize[i] = 0.28 + Math.random() * 2.4;
}

const starsGeo = new THREE.BufferGeometry();
starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
starsGeo.setAttribute('color',    new THREE.BufferAttribute(starColor, 3));
starsGeo.setAttribute('size',     new THREE.BufferAttribute(starSize, 1));

const starsMat = new THREE.ShaderMaterial({
  uniforms: { uTime: { value: 0 }, uBrightness: { value: 1.0 } },
  vertexShader: `
    attribute float size;
    attribute vec3 color;
    varying vec3 vColor;
    uniform float uTime;
    uniform float uBrightness;
    void main() {
      vColor = color * uBrightness;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      float twinkle = 0.68 + 0.32 * sin(uTime * 1.7 + position.x * 0.5 + position.y * 0.3);
      gl_PointSize = size * twinkle * (320.0 / -mv.z);
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: `
    varying vec3 vColor;
    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float d = length(uv);
      if (d > 0.5) discard;
      float alpha = 1.0 - smoothstep(0.08, 0.5, d);
      gl_FragColor = vec4(vColor, alpha);
    }`,
  transparent: true, depthWrite: false,
  blending: THREE.AdditiveBlending, vertexColors: true
});

const starsMesh = new THREE.Points(starsGeo, starsMat);
scene.add(starsMesh);

// ─── MORPHING NEBULA SPHERE ───────────────────────────────────────────────────
const SUBDIV = IS_MOBILE ? 16 : 42;
const nebulaGeo  = new THREE.IcosahedronGeometry(6.2, SUBDIV);
const origNebPos = nebulaGeo.attributes.position.clone();

const nebulaMat = new THREE.MeshPhysicalMaterial({
  color:              new THREE.Color(0x5b21b6),
  emissive:           new THREE.Color(0x3b0764),
  emissiveIntensity:  0.18,
  metalness:          0.0,
  roughness:          0.32,
  transmission:       0.78,
  ior:                1.55,
  thickness:          4.2,
  clearcoat:          0.7,
  clearcoatRoughness: 0.18,
  transparent:        true,
  opacity:            0.72,
  side:               THREE.FrontSide,
});

const nebulaSphere = new THREE.Mesh(nebulaGeo, nebulaMat);
scene.add(nebulaSphere);

// Inner radial glow (fixed sphere, no morph needed)
const innerGlow = new THREE.Mesh(
  new THREE.SphereGeometry(4.2, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0x7c3aed, emissive: 0x6d28d9, emissiveIntensity: 0.45,
    transparent: true, opacity: 0.28,
  })
);
scene.add(innerGlow);

// Wireframe shell for cosmic grid look
const wireShell = new THREE.Mesh(
  new THREE.IcosahedronGeometry(6.45, 2),
  new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.045 })
);
scene.add(wireShell);

// ─── SATELLITE ORBS ───────────────────────────────────────────────────────────
const satellites = [
  { dist: 13, speed: 0.22, phase: 0,   color: 0xe8b84b, size: 0.55, yOff:  4, yAmp: 1.2 },
  { dist: 11, speed: 0.35, phase: 2.1, color: 0xa78bfa, size: 0.45, yOff: -3, yAmp: 1.8 },
  { dist: 15, speed: 0.16, phase: 4.2, color: 0x06b6d4, size: 0.38, yOff:  2, yAmp: 0.9 },
].map(d => {
  const m = new THREE.Mesh(
    new THREE.SphereGeometry(d.size, IS_MOBILE ? 12 : 20, IS_MOBILE ? 12 : 20),
    new THREE.MeshPhysicalMaterial({
      color: d.color, emissive: d.color, emissiveIntensity: 0.25,
      metalness: 0.1, roughness: 0.18, transmission: 0.55, ior: 1.45,
    })
  );
  scene.add(m);
  return { ...d, mesh: m };
});

// ─── NEBULA CLOUD LAYERS ──────────────────────────────────────────────────────
// Three layered planes at different depths — each with subtle noise glow
const nebCloudVert = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`;
const nebCloudFrag = `
  uniform float uTime; uniform float uAlpha; uniform vec3 uCol;
  varying vec2 vUv;
  float h2(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
  float n2(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
    return mix(mix(h2(i),h2(i+vec2(1,0)),f.x),mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x),f.y); }
  void main(){
    vec2 uv = vUv*2.-1.;
    float dist = length(uv);
    // tight radial fade — zero at edges, peaks at center
    float fade = 1.-smoothstep(0.0, 0.55, dist);
    fade = fade * fade;
    float n = n2(uv*1.4 + uTime*0.018) * 0.6 + n2(uv*2.8 - uTime*0.011) * 0.4;
    n = smoothstep(0.52, 0.78, n);
    gl_FragColor = vec4(uCol, n * uAlpha * fade);
  }`;

const cloudPlanes = [
  { z: -22, scale: 70, alpha: 0.028, col: new THREE.Color(0x06021a) },
  { z: -14, scale: 50, alpha: 0.018, col: new THREE.Color(0x0c0536) },
  { z: -30, scale: 90, alpha: 0.012, col: new THREE.Color(0x020114) },
].map(d => {
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uAlpha: { value: d.alpha }, uCol: { value: d.col } },
    vertexShader: nebCloudVert, fragmentShader: nebCloudFrag,
    transparent: true, depthWrite: false, side: THREE.DoubleSide
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(d.scale, d.scale), mat);
  m.position.z = d.z;
  scene.add(m);
  return mat;
});

// ─── LIGHTS ───────────────────────────────────────────────────────────────────
const ptLight = new THREE.PointLight(0x8b5cf6, 6, 50);
ptLight.position.set(0, 0, 12);
scene.add(ptLight);

const ptGold = new THREE.PointLight(0xe8b84b, 3, 35);
ptGold.position.set(12, 8, 5);
scene.add(ptGold);

const fillLight = new THREE.DirectionalLight(0x1a0840, 0.8);
fillLight.position.set(-5, 4, -6);
scene.add(fillLight);

scene.add(new THREE.AmbientLight(0x080412, 0.8));

// ─── SCROLL ATMOSPHERE — GSAP ScrollTrigger ───────────────────────────────────
// Each section drives the atmosphere via scrub tweens on shared state object
const atmo = {
  // live-lerped values (read in RAF)
  fogDensity:    0.0,
  fogR: 0.027, fogG: 0.027, fogB: 0.102,   // #07071a
  bloomStr:      0.22,
  ptR: 0.545, ptG: 0.361, ptB: 0.965,       // #8b5cf6
  nebulaEmissR: 0.231, nebulaEmissG: 0.027, nebulaEmissB: 0.392, // #3b0764
  nebulaOpacity: 0.78,
  starBrightness: 1.0,
  cameraZ:       28,
};

function setupScrollAtmo() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  // ── Hero → Advisors: purple shifts deep ──
  ScrollTrigger.create({
    trigger: '.advisors',
    start: 'top 80%', end: 'top 10%',
    scrub: 2.5,
    onUpdate(self) {
      const p = self.progress;
      atmo.fogDensity    = p * 0.006;
      atmo.fogR = lerp(0.027, 0.018, p);
      atmo.fogG = lerp(0.027, 0.010, p);
      atmo.fogB = lerp(0.102, 0.078, p);
      atmo.bloomStr      = lerp(0.22, 0.18, p);
      atmo.ptR = lerp(0.545, 0.427, p);
      atmo.ptG = lerp(0.361, 0.106, p);
      atmo.ptB = lerp(0.965, 0.863, p);
      atmo.starBrightness = lerp(1.0, 0.82, p);
      atmo.nebulaOpacity  = lerp(0.78, 0.60, p);
    }
  });

  // ── Advisors → Categories: indigo → teal cosmic ──
  ScrollTrigger.create({
    trigger: '.categories',
    start: 'top 80%', end: 'top 10%',
    scrub: 2.5,
    onUpdate(self) {
      const p = self.progress;
      atmo.fogDensity    = lerp(0.006, 0.009, p);
      atmo.fogR = lerp(0.018, 0.008, p);
      atmo.fogG = lerp(0.010, 0.024, p);
      atmo.fogB = lerp(0.078, 0.090, p);
      atmo.bloomStr      = lerp(0.18, 0.22, p);
      // Shift point light toward teal-violet
      atmo.ptR = lerp(0.427, 0.102, p);
      atmo.ptG = lerp(0.106, 0.388, p);
      atmo.ptB = lerp(0.863, 0.820, p);
      atmo.nebulaEmissR  = lerp(0.231, 0.020, p);
      atmo.nebulaEmissG  = lerp(0.027, 0.220, p);
      atmo.nebulaEmissB  = lerp(0.392, 0.400, p);
      atmo.starBrightness = lerp(0.82, 0.75, p);
    }
  });

  // ── Categories → How It Works: teal → warm gold ──
  ScrollTrigger.create({
    trigger: '.how',
    start: 'top 80%', end: 'top 10%',
    scrub: 2.5,
    onUpdate(self) {
      const p = self.progress;
      atmo.fogDensity    = lerp(0.009, 0.012, p);
      atmo.fogR = lerp(0.008, 0.055, p);
      atmo.fogG = lerp(0.024, 0.036, p);
      atmo.fogB = lerp(0.090, 0.018, p);
      atmo.bloomStr      = lerp(0.22, 0.28, p);
      // Gold warmth
      atmo.ptR = lerp(0.102, 0.910, p);
      atmo.ptG = lerp(0.388, 0.722, p);
      atmo.ptB = lerp(0.820, 0.294, p);
      atmo.nebulaEmissR  = lerp(0.020, 0.550, p);
      atmo.nebulaEmissG  = lerp(0.220, 0.275, p);
      atmo.nebulaEmissB  = lerp(0.400, 0.020, p);
      atmo.starBrightness = lerp(0.75, 0.90, p);
    }
  });

  // ── How → Testimonials: warm → deep cosmic purple ──
  ScrollTrigger.create({
    trigger: '.testimonials',
    start: 'top 80%', end: 'top 10%',
    scrub: 2.5,
    onUpdate(self) {
      const p = self.progress;
      atmo.fogDensity    = lerp(0.012, 0.018, p);
      atmo.fogR = lerp(0.055, 0.035, p);
      atmo.fogG = lerp(0.036, 0.008, p);
      atmo.fogB = lerp(0.018, 0.110, p);
      atmo.bloomStr      = lerp(0.28, 0.32, p);
      atmo.ptR = lerp(0.910, 0.545, p);
      atmo.ptG = lerp(0.722, 0.200, p);
      atmo.ptB = lerp(0.294, 1.000, p);
      atmo.nebulaEmissR  = lerp(0.550, 0.350, p);
      atmo.nebulaEmissG  = lerp(0.275, 0.020, p);
      atmo.nebulaEmissB  = lerp(0.020, 0.550, p);
      atmo.starBrightness = lerp(0.90, 1.10, p);
    }
  });

  // ── Testimonials → Quiz CTA: peak cosmic ──
  ScrollTrigger.create({
    trigger: '.quiz-cta',
    start: 'top 80%', end: 'top 20%',
    scrub: 2.5,
    onUpdate(self) {
      const p = self.progress;
      atmo.fogDensity    = lerp(0.018, 0.022, p);
      atmo.bloomStr      = lerp(0.32, 0.35, p);
      atmo.starBrightness = lerp(1.10, 1.20, p);
      atmo.nebulaOpacity  = lerp(0.60, 0.85, p);
    }
  });
}

function lerp(a, b, t) { return a + (b - a) * t; }

// ─── MORPH NEBULA SPHERE ──────────────────────────────────────────────────────
const MORPH_FREQ = 0.32, MORPH_AMP = 0.11;
function morphSphere(t) {
  const pos = nebulaGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const ox = origNebPos.getX(i), oy = origNebPos.getY(i), oz = origNebPos.getZ(i);
    const n = (noise3(ox*MORPH_FREQ + t*0.15, oy*MORPH_FREQ + t*0.11, oz*MORPH_FREQ + t*0.09) - 0.5) * 2;
    const s = 1 + n * MORPH_AMP;
    pos.setXYZ(i, ox*s, oy*s, oz*s);
  }
  pos.needsUpdate = true;
  nebulaGeo.computeVertexNormals();
}

// ─── MOUSE ───────────────────────────────────────────────────────────────────
let mouse = { x: 0, y: 0 }, targetMouse = { x: 0, y: 0 };
window.addEventListener('mousemove', e => {
  targetMouse.x = (e.clientX / innerWidth  - 0.5) * 2;
  targetMouse.y = -(e.clientY / innerHeight - 0.5) * 2;
}, { passive: true });

// ─── RAF ─────────────────────────────────────────────────────────────────────
let alive = true;
let frameCount = 0;
document.addEventListener('visibilitychange', () => { alive = !document.hidden; });
const clock = new THREE.Clock();

// Apply scroll atmosphere tweens AFTER DOM is ready
window.addEventListener('DOMContentLoaded', setupScrollAtmo);
if (document.readyState !== 'loading') setupScrollAtmo();

(function tick() {
  requestAnimationFrame(tick);
  if (!alive) return;
  const t = clock.getElapsedTime();

  // Smooth mouse
  mouse.x += (targetMouse.x - mouse.x) * 0.055;
  mouse.y += (targetMouse.y - mouse.y) * 0.055;

  // Apply atmosphere state
  scene.fog.density = atmo.fogDensity;
  scene.fog.color.setRGB(atmo.fogR, atmo.fogG, atmo.fogB);
  bloom.strength = atmo.bloomStr;
  ptLight.color.setRGB(atmo.ptR, atmo.ptG, atmo.ptB);
  nebulaMat.emissive.setRGB(atmo.nebulaEmissR, atmo.nebulaEmissG, atmo.nebulaEmissB);
  nebulaMat.opacity = atmo.nebulaOpacity;
  starsMat.uniforms.uBrightness.value = atmo.starBrightness;

  // Morph sphere (desktop only, every 3rd frame to reduce CPU load)
  frameCount++;
  if (!IS_MOBILE && frameCount % 3 === 0) morphSphere(t);

  // Nebula sphere rotation
  nebulaSphere.rotation.y  = t * 0.10 + mouse.x * 0.25;
  nebulaSphere.rotation.x  = mouse.y * 0.22 + Math.sin(t * 0.18) * 0.04;
  innerGlow.rotation.y    = -t * 0.07;
  wireShell.rotation.y     =  t * 0.06;
  wireShell.rotation.x     = Math.sin(t * 0.12) * 0.03;

  // Satellite orbits
  satellites.forEach(s => {
    const angle = t * s.speed + s.phase;
    s.mesh.position.x = Math.cos(angle) * s.dist;
    s.mesh.position.z = Math.sin(angle) * s.dist;
    s.mesh.position.y = s.yOff + Math.sin(t * 0.55 + s.phase) * s.yAmp;
  });

  // Camera parallax + cursor
  camera.position.x += (mouse.x * 2.2 - camera.position.x) * 0.032;
  camera.position.y += (mouse.y * 1.8 - camera.position.y) * 0.032;
  const scrollFrac = window.scrollY / Math.max(document.documentElement.scrollHeight - innerHeight, 1);
  camera.position.z = 28 - scrollFrac * 7;
  camera.lookAt(0, 0, 0);

  // Cursor-reactive point light
  ptLight.position.x = mouse.x * 13;
  ptLight.position.y = mouse.y * 9;

  // Star field slow drift
  starsMesh.rotation.y  = t * 0.014;
  starsMesh.rotation.x  = Math.sin(t * 0.05) * 0.008;
  starsMat.uniforms.uTime.value = t;

  // Cloud nebula planes
  cloudPlanes.forEach((mat, i) => {
    mat.uniforms.uTime.value = t + i * 4.0;
  });

  composer.render();
})();

// ─── RESIZE ──────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  bloom.setSize(innerWidth, innerHeight);
}, { passive: true });
