/**
 * neural-canvas.js
 *
 * Extracted neural network animation from HeroSection.astro.
 * Renders to a given <canvas> element. Exports:
 *   init(canvas)              — start the animation loop
 *   setAccentColor([r,g,b])   — smoothly transition to a new accent colour (HSL lerp)
 *   destroy()                 — cancel the animation frame and remove resize listener
 *
 * Colour transitions lerp in HSL space with hue wrap-around (short arc) over ~800ms
 * using ease-out timing, to avoid the muddy mid-tones produced by RGB lerp.
 *
 * prefers-reduced-motion: callers are responsible for skipping init(). If init() is
 * called anyway, the canvas renders but colour changes are instant (no transition).
 */

/* ── 3D Simplex Noise ──────────────────────────────────────────────────────── */
const G3 = [
  [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
  [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
  [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1],
];
const perm = new Uint8Array(512);
{
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
}

function n3(x, y, z) {
  const F = 1 / 3, G = 1 / 6;
  const s = (x + y + z) * F;
  const i = Math.floor(x + s), j = Math.floor(y + s), k = Math.floor(z + s);
  const t = (i + j + k) * G;
  const x0 = x - (i - t), y0 = y - (j - t), z0 = z - (k - t);

  let i1, j1, k1, i2, j2, k2;
  if (x0 >= y0) {
    if (y0 >= z0)      { i1=1;j1=0;k1=0;i2=1;j2=1;k2=0; }
    else if (x0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=0;k2=1; }
    else               { i1=0;j1=0;k1=1;i2=1;j2=0;k2=1; }
  } else {
    if (y0 < z0)       { i1=0;j1=0;k1=1;i2=0;j2=1;k2=1; }
    else if (x0 < z0)  { i1=0;j1=1;k1=0;i2=0;j2=1;k2=1; }
    else               { i1=0;j1=1;k1=0;i2=1;j2=1;k2=0; }
  }

  const x1 = x0-i1+G, y1 = y0-j1+G, z1 = z0-k1+G;
  const x2 = x0-i2+2*G, y2 = y0-j2+2*G, z2 = z0-k2+2*G;
  const x3 = x0-1+0.5, y3 = y0-1+0.5, z3 = z0-1+0.5;
  const ii = i & 255, jj = j & 255, kk = k & 255;

  let n = 0, tt, gi;
  tt = 0.6 - x0*x0 - y0*y0 - z0*z0;
  if (tt > 0) { tt *= tt; gi = G3[perm[ii + perm[jj + perm[kk]]] % 12]; n += tt*tt*(gi[0]*x0 + gi[1]*y0 + gi[2]*z0); }
  tt = 0.6 - x1*x1 - y1*y1 - z1*z1;
  if (tt > 0) { tt *= tt; gi = G3[perm[ii+i1 + perm[jj+j1 + perm[kk+k1]]] % 12]; n += tt*tt*(gi[0]*x1 + gi[1]*y1 + gi[2]*z1); }
  tt = 0.6 - x2*x2 - y2*y2 - z2*z2;
  if (tt > 0) { tt *= tt; gi = G3[perm[ii+i2 + perm[jj+j2 + perm[kk+k2]]] % 12]; n += tt*tt*(gi[0]*x2 + gi[1]*y2 + gi[2]*z2); }
  tt = 0.6 - x3*x3 - y3*y3 - z3*z3;
  if (tt > 0) { tt *= tt; gi = G3[perm[ii+1 + perm[jj+1 + perm[kk+1]]] % 12]; n += tt*tt*(gi[0]*x3 + gi[1]*y3 + gi[2]*z3); }
  return 32 * n;
}

/* ── Colour utilities ─────────────────────────────────────────────────────── */

/** Convert RGB [0-255] to HSL [h:0-360, s:0-100, l:0-100]. */
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
    case g: h = ((b - r) / d + 2) / 6; break;
    default: h = ((r - g) / d + 4) / 6; break;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

/** Convert HSL [h:0-360, s:0-100, l:0-100] to RGB string "r,g,b". */
function hslToRgbStr(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => Math.round((l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))) * 255);
  return `${f(0)},${f(8)},${f(4)}`;
}

/* ── Module state ─────────────────────────────────────────────────────────── */
let _canvas = null;
let _ctx = null;
let _W = 0, _H = 0;
let _time = 0;
let _lastTime = 0;
let _animFrame = null;
let _needsReinit = false;
let _quality = 1;
const _ftBuf = [];

// Current rendered colour (HSL)
let _curH = 186, _curS = 100, _curL = 50; // default cyan #00d2ff

// Target colour (HSL) — lerped toward over ~800ms
let _tgtH = _curH, _tgtS = _curS, _tgtL = _curL;
// Start values captured at lerp start — lerp from these FIXED values, not from moving _cur*
let _startH = _curH, _startS = _curS, _startL = _curL;
let _lerpStart = 0;
const LERP_DURATION = 800; // ms

let _reducedMotion = false;

// Neural network state
let _nodes = [];
let _pulses = [];

/* ── Canvas resize ────────────────────────────────────────────────────────── */
function _resize() {
  if (!_canvas) return;
  const dpr = Math.min(window.devicePixelRatio, 1.5);
  _canvas.width = window.innerWidth * dpr;
  _canvas.height = window.innerHeight * dpr;
  _W = _canvas.width;
  _H = _canvas.height;
  _needsReinit = true;
}

/* ── Adaptive quality ─────────────────────────────────────────────────────── */
function _adaptQuality(dt) {
  _ftBuf.push(dt);
  if (_ftBuf.length > 40) _ftBuf.shift();
  if (_ftBuf.length >= 30) {
    const fps = _ftBuf.length / _ftBuf.reduce((a, b) => a + b, 0);
    if (fps < 38 && _quality > 0.3) _quality = Math.max(0.3, _quality - 0.04);
    else if (fps > 55 && _quality < 1) _quality = Math.min(1, _quality + 0.015);
  }
}

/* ── Neural init ──────────────────────────────────────────────────────────── */
function _initNeural() {
  const count = Math.min(70, Math.floor(_W * _H / 14000));
  _nodes = [];
  for (let i = 0; i < count; i++) {
    _nodes.push({
      x: Math.random() * _W,
      y: Math.random() * _H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      failed: false,
      failT: 0,
    });
  }
  _pulses = [];
}

/* ── Neural draw ──────────────────────────────────────────────────────────── */
function _drawNeural(acRgb) {
  _ctx.clearRect(0, 0, _W, _H);
  const maxDist = 180 * Math.max(0.6, _quality);

  // Update node positions
  for (const nd of _nodes) {
    nd.x += nd.vx;
    nd.y += nd.vy;
    if (nd.x < 0 || nd.x > _W) nd.vx *= -1;
    if (nd.y < 0 || nd.y > _H) nd.vy *= -1;
    if (nd.failed && _time - nd.failT > 2.5) nd.failed = false;
  }

  // Stochastic node failure
  if (Math.random() < 0.003) {
    const nd = _nodes[Math.floor(Math.random() * _nodes.length)];
    if (nd) { nd.failed = true; nd.failT = _time; }
  }

  // Stochastic pulse generation
  if (Math.random() < 0.012 && _pulses.length < 5) {
    const src = Math.floor(Math.random() * _nodes.length);
    const targets = [];
    for (let j = 0; j < _nodes.length; j++) {
      if (j === src) continue;
      const dx = _nodes[src].x - _nodes[j].x;
      const dy = _nodes[src].y - _nodes[j].y;
      if (Math.sqrt(dx * dx + dy * dy) < maxDist) targets.push(j);
    }
    if (targets.length > 0) _pulses.push({ from: src, progress: 0, targets });
  }

  // Draw connections
  for (let i = 0; i < _nodes.length; i++) {
    for (let j = i + 1; j < _nodes.length; j++) {
      const dx = _nodes[i].x - _nodes[j].x;
      const dy = _nodes[i].y - _nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const a = (1 - dist / maxDist) * 0.5;
        const fail = _nodes[i].failed || _nodes[j].failed;
        _ctx.strokeStyle = fail ? `rgba(255,71,87,${a * 0.6})` : `rgba(${acRgb},${a})`;
        _ctx.lineWidth = fail ? 0.5 : 0.8;
        _ctx.beginPath();
        _ctx.moveTo(_nodes[i].x, _nodes[i].y);
        _ctx.lineTo(_nodes[j].x, _nodes[j].y);
        _ctx.stroke();
      }
    }
  }

  // Draw traveling pulses
  for (let p = _pulses.length - 1; p >= 0; p--) {
    const pl = _pulses[p];
    pl.progress += 0.012;
    if (pl.progress > 1) { _pulses.splice(p, 1); continue; }
    const src = _nodes[pl.from];
    const alpha = 1.0 * (1 - pl.progress);
    for (const ti of pl.targets) {
      const tgt = _nodes[ti];
      const px = src.x + (tgt.x - src.x) * pl.progress;
      const py = src.y + (tgt.y - src.y) * pl.progress;
      _ctx.fillStyle = `rgba(${acRgb},${alpha})`;
      _ctx.beginPath();
      _ctx.arc(px, py, 3, 0, 6.283);
      _ctx.fill();
    }
  }

  // Draw nodes
  for (const nd of _nodes) {
    if (nd.failed) {
      const flash = Math.sin((_time - nd.failT) * 6) * 0.3 + 0.7;
      _ctx.fillStyle = `rgba(255,71,87,${flash * 0.9})`;
      _ctx.beginPath(); _ctx.arc(nd.x, nd.y, 4, 0, 6.283); _ctx.fill();
      _ctx.fillStyle = `rgba(255,71,87,${flash * 0.2})`;
      _ctx.beginPath(); _ctx.arc(nd.x, nd.y, 12, 0, 6.283); _ctx.fill();
    } else {
      _ctx.fillStyle = `rgba(${acRgb},0.8)`;
      _ctx.beginPath(); _ctx.arc(nd.x, nd.y, 2.5, 0, 6.283); _ctx.fill();
      _ctx.fillStyle = `rgba(${acRgb},0.12)`;
      _ctx.beginPath(); _ctx.arc(nd.x, nd.y, 7, 0, 6.283); _ctx.fill();
    }
  }
}

/* ── Lerp helpers ─────────────────────────────────────────────────────────── */
function _lerpAngle(a, b, t) {
  // Short-arc hue wrap-around
  let dh = b - a;
  if (dh > 180) dh -= 360;
  if (dh < -180) dh += 360;
  return a + dh * t;
}

function _easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

/* ── Render loop ──────────────────────────────────────────────────────────── */
function _render(now) {
  if (!_canvas || !_ctx) return;

  const dt = Math.min((now - _lastTime) / 1000, 0.1);
  _lastTime = now;
  _time += dt;
  _adaptQuality(dt);

  if (_needsReinit) {
    _needsReinit = false;
    _initNeural();
  }

  // Lerp colour toward target (in HSL space)
  let acRgb;
  if (_reducedMotion) {
    // Instant colour change for reduced-motion
    _curH = _tgtH; _curS = _tgtS; _curL = _tgtL;
    acRgb = hslToRgbStr(_curH, _curS, _curL);
  } else {
    const elapsed = now - _lerpStart;
    const t = _easeOut(Math.min(elapsed / LERP_DURATION, 1));
    // Lerp from FIXED start values — not from already-moved _cur* (avoids exponential decay)
    _curH = _lerpAngle(_startH, _tgtH, t);
    _curS = _startS + (_tgtS - _startS) * t;
    _curL = _startL + (_tgtL - _startL) * t;
    acRgb = hslToRgbStr(_curH, _curS, _curL);
  }

  _drawNeural(acRgb);

  _animFrame = requestAnimationFrame(_render);
}

/* ── Resize listener reference ────────────────────────────────────────────── */
let _onResize = null;

/* ── Public API ───────────────────────────────────────────────────────────── */

/**
 * Initialise and start rendering onto the given canvas element.
 * Safe to call multiple times — destroys the previous instance first.
 */
export function init(canvas) {
  destroy(); // clean up any previous instance

  _canvas = canvas;
  _ctx = canvas.getContext('2d');
  if (!_ctx) return;

  _reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  canvas.style.opacity = '0.7';
  _lastTime = performance.now();
  _lerpStart = _lastTime;

  _resize();

  _onResize = () => _resize();
  window.addEventListener('resize', _onResize);

  _initNeural();
  _animFrame = requestAnimationFrame(_render);
}

/**
 * Smoothly transition the neural canvas accent colour to the given [r, g, b] array.
 * Transitions over ~800ms using HSL interpolation (short-arc hue wrap).
 * If prefers-reduced-motion is set, the change is instant.
 */
export function setAccentColor([r, g, b]) {
  const hsl = rgbToHsl(r, g, b);
  // Capture current rendered position as fixed start values for the new lerp.
  // This prevents exponential decay from lerping into already-moved _cur* values.
  _startH = _curH;
  _startS = _curS;
  _startL = _curL;
  _tgtH = hsl.h;
  _tgtS = hsl.s;
  _tgtL = hsl.l;
  _lerpStart = performance.now();
}

/**
 * Stop the animation and remove all listeners.
 */
export function destroy() {
  if (_animFrame !== null) {
    cancelAnimationFrame(_animFrame);
    _animFrame = null;
  }
  if (_onResize) {
    window.removeEventListener('resize', _onResize);
    _onResize = null;
  }
  _canvas = null;
  _ctx = null;
  _nodes = [];
  _pulses = [];
}
