// sensor-grid.js
// Subtle technical grid visualization - system monitoring aesthetic
// Restrained, atmospheric, barely-there
// Inspired by Footnotes' restraint, adapted for AI safety research context

// Seeded RNG for deterministic per-session layout
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate stable session seed from date (changes daily)
function getSessionSeed() {
  const now = new Date();
  const daysSinceEpoch = Math.floor(now / (1000 * 60 * 60 * 24));
  return daysSinceEpoch * 1013;
}

// Hexagonal grid pattern - technical/sensor aesthetic
function drawHexGrid(ctx, w, h, rng) {
  const hexSize = 40;
  const cols = Math.ceil(w / (hexSize * 1.5)) + 2;
  const rows = Math.ceil(h / (hexSize * Math.sqrt(3))) + 2;

  ctx.strokeStyle = 'rgba(0, 210, 255, 0.03)'; // Barely visible
  ctx.lineWidth = 0.5;

  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      const x = col * hexSize * 1.5;
      const y = row * hexSize * Math.sqrt(3) + (col % 2 === 0 ? 0 : hexSize * Math.sqrt(3) / 2);

      // Only draw ~30% of hexagons for sparse, subtle pattern
      if (rng() > 0.7) {
        drawHexagon(ctx, x, y, hexSize);
      }
    }
  }
}

function drawHexagon(ctx, cx, cy, size) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const x = cx + size * Math.cos(angle);
    const y = cy + size * Math.sin(angle);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.stroke();
}

// Subtle scanlines - barely perceptible
function drawScanlines(ctx, w, h) {
  ctx.strokeStyle = 'rgba(0, 210, 255, 0.02)';
  ctx.lineWidth = 1;

  // Horizontal lines every 4px
  for (let y = 0; y < h; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

// Very rare, slow pulsing anomaly markers
class AnomalyPulse {
  constructor(x, y, rng) {
    this.x = x;
    this.y = y;
    this.phase = rng() * Math.PI * 2;
    this.period = 8000 + rng() * 12000; // 8-20 second cycle
    this.maxRadius = 60 + rng() * 40;
    this.color = rng() > 0.7 ? 'rgba(255, 71, 87,' : 'rgba(0, 210, 255,'; // Mostly cyan, occasional red
    this.birthTime = Date.now();
  }

  draw(ctx, time) {
    const age = time - this.birthTime;
    const t = (age % this.period) / this.period;

    // Very gentle sine wave pulse
    const intensity = Math.sin(t * Math.PI * 2) * 0.5 + 0.5;
    const radius = this.maxRadius * intensity;

    // Extremely subtle - max opacity 0.08
    const opacity = intensity * 0.08;

    // Outer ring
    ctx.strokeStyle = `${this.color} ${opacity})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Inner glow (even more subtle)
    ctx.strokeStyle = `${this.color} ${opacity * 0.5})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius * 0.6, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export function initSensorGrid() {
  const canvas = document.getElementById('sensor-grid-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  const seed = getSessionSeed();

  // Cached offscreen canvas for static grid (hex + scanlines)
  let gridCache = null;
  let cachedW = 0;
  let cachedH = 0;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    return { w: rect.width, h: rect.height };
  }

  function rebuildGridCache(w, h) {
    const dpr = window.devicePixelRatio || 1;
    gridCache = document.createElement('canvas');
    gridCache.width = w * dpr;
    gridCache.height = h * dpr;
    const offCtx = gridCache.getContext('2d');
    offCtx.scale(dpr, dpr);

    // Fresh RNG from seed so the grid is always the same
    const gridRng = mulberry32(seed);
    drawHexGrid(offCtx, w, h, gridRng);
    drawScanlines(offCtx, w, h);

    cachedW = w;
    cachedH = h;
  }

  const { w, h } = resize();
  rebuildGridCache(w, h);

  // Consume a separate RNG branch for pulse placement
  const pulseRng = mulberry32(seed + 7919);
  const pulseCount = 3 + Math.floor(pulseRng() * 3);
  const pulses = [];
  for (let i = 0; i < pulseCount; i++) {
    const x = pulseRng() * w;
    const y = pulseRng() * h;
    pulses.push(new AnomalyPulse(x, y, mulberry32(seed + i * 1013)));
  }

  // Respect prefers-reduced-motion
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    // Just draw the static grid once, no animation
    ctx.drawImage(gridCache, 0, 0, cachedW, cachedH);
    return;
  }

  // Animate only the subtle pulses — blit cached grid each frame
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (gridCache) {
      ctx.drawImage(gridCache, 0, 0, cachedW, cachedH);
    }

    const now = Date.now();
    for (const pulse of pulses) {
      pulse.draw(ctx, now);
    }

    requestAnimationFrame(animate);
  }

  animate();

  // Rebuild cache on resize
  window.addEventListener('resize', () => {
    const { w, h } = resize();
    rebuildGridCache(w, h);
  });
}

// Auto-initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSensorGrid);
  } else {
    initSensorGrid();
  }
}
