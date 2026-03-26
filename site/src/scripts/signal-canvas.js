/**
 * signal-canvas.js
 *
 * Signal waveform animation for the team page background.
 * Same API as neural-canvas.js (init, setAccentColor, destroy)
 * but renders flowing waveform frequency bands instead of constellation dots.
 *
 * Colour transitions lerp in HSL space with hue wrap-around (short arc) over ~800ms
 * using ease-out timing.
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
let _quality = 1;
const _ftBuf = [];

// Current rendered colour (HSL)
let _curH = 186, _curS = 100, _curL = 50; // default cyan #00d2ff
let _tgtH = _curH, _tgtS = _curS, _tgtL = _curL;
let _startH = _curH, _startS = _curS, _startL = _curL;
let _lerpStart = 0;
const LERP_DURATION = 800;

let _reducedMotion = false;

/* ── Canvas resize ────────────────────────────────────────────────────────── */
function _resize() {
  if (!_canvas) return;
  const dpr = Math.min(window.devicePixelRatio, 1.5);
  _canvas.width = window.innerWidth * dpr;
  _canvas.height = window.innerHeight * dpr;
  _W = _canvas.width;
  _H = _canvas.height;
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

/* ── Signal draw ──────────────────────────────────────────────────────────── */
function _drawSignal(acRgb) {
  _ctx.fillStyle = 'rgba(5, 8, 16, 0.05)';
  _ctx.fillRect(0, 0, _W, _H);

  const bands = Math.floor(30 * _quality);
  const bandH = _H / bands;

  for (let i = 0; i < bands; i++) {
    const y = i * bandH + bandH * 0.5;
    const amp = n3(i * 0.15, 0, _time * 0.25) * bandH * 0.9;
    const freq = 0.008 + n3(i * 0.2, 10, _time * 0.08) * 0.012;
    const phase = _time * (1.5 + i * 0.1);

    const intensity = Math.abs(amp) / (bandH * 0.9);
    const warm = n3(i * 0.3, 5, _time * 0.1) > 0.3;

    _ctx.strokeStyle = warm
      ? `rgba(255,99,72,${0.08 + intensity * 0.25})`
      : `rgba(${acRgb},${0.1 + intensity * 0.3})`;
    _ctx.lineWidth = 0.6 + intensity * 0.6;
    _ctx.beginPath();
    for (let x = 0; x <= _W; x += 3) {
      const val = Math.sin(x * freq + phase) * amp
                + Math.sin(x * freq * 2.3 + phase * 0.7) * amp * 0.3;
      if (x === 0) _ctx.moveTo(x, y + val);
      else _ctx.lineTo(x, y + val);
    }
    _ctx.stroke();
  }
}

/* ── Lerp helpers ─────────────────────────────────────────────────────────── */
function _lerpAngle(a, b, t) {
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

  // Lerp colour toward target (in HSL space)
  let acRgb;
  if (_reducedMotion) {
    _curH = _tgtH; _curS = _tgtS; _curL = _tgtL;
    acRgb = hslToRgbStr(_curH, _curS, _curL);
  } else {
    const elapsed = now - _lerpStart;
    const t = _easeOut(Math.min(elapsed / LERP_DURATION, 1));
    _curH = _lerpAngle(_startH, _tgtH, t);
    _curS = _startS + (_tgtS - _startS) * t;
    _curL = _startL + (_tgtL - _startL) * t;
    acRgb = hslToRgbStr(_curH, _curS, _curL);
  }

  _drawSignal(acRgb);

  _animFrame = requestAnimationFrame(_render);
}

/* ── Resize listener reference ────────────────────────────────────────────── */
let _onResize = null;

/* ── Public API ───────────────────────────────────────────────────────────── */

export function init(canvas) {
  destroy();

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

  _animFrame = requestAnimationFrame(_render);
}

export function setAccentColor([r, g, b]) {
  const hsl = rgbToHsl(r, g, b);
  _startH = _curH;
  _startS = _curS;
  _startL = _curL;
  _tgtH = hsl.h;
  _tgtS = hsl.s;
  _tgtL = hsl.l;
  _lerpStart = performance.now();
}

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
}
