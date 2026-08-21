// scale.js — the data-agnostic scale codec, the REAL one. Don't store a value,
// store its relationship to a key and descend the scale. The key is the thing
// the scalar toy was missing: each layer rotates into a FRESH FRAME (a new
// `000`) before counting trits, so every d captures new cross-dimensional
// directions instead of re-counting the same axes. That is what broke the
// plateau and reached exact recall in the dive. The rotation is a random-sign
// Walsh–Hadamard transform (orthonormal, O(n log n), self-inverse) — its only
// key is one integer seed per layer, shared on both sides.
//
//   encode(vec, d) -> { n, pad, layers:[{ seed, s, t:Int8Array }] }   (t ∈ {-1,0,+1})
//   decode(enc)    -> Float64Array

const LOG2_3 = Math.log2(3);

// fast Walsh–Hadamard transform, in place, len must be a power of two
function fwht(a) {
  const n = a.length;
  for (let len = 1; len < n; len <<= 1)
    for (let i = 0; i < n; i += len << 1)
      for (let j = i; j < i + len; j++) { const x = a[j], y = a[j + len]; a[j] = x + y; a[j + len] = x - y; }
  const inv = 1 / Math.sqrt(n);
  for (let i = 0; i < n; i++) a[i] *= inv;     // normalize → orthonormal, self-inverse
}
// deterministic ±1 signs from a seed — the layer's fresh frame (its new 000)
function signs(seed, n) {
  const s = new Int8Array(n); let x = (seed * 2654435761) >>> 0 || 1;
  for (let i = 0; i < n; i++) { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; s[i] = (x & 1) ? 1 : -1; }
  return s;
}
const nextPow2 = n => { let p = 1; while (p < n) p <<= 1; return p; };

// rotate a vector into layer k's frame (and back with the same call, it's self-inverse
// up to the sign flip which we apply on the correct side)
function toFrame(v, sg) { const a = Float64Array.from(v); for (let i = 0; i < a.length; i++) a[i] *= sg[i]; fwht(a); return a; }
function fromFrame(v, sg) { const a = Float64Array.from(v); fwht(a); for (let i = 0; i < a.length; i++) a[i] *= sg[i]; return a; }

export function encode(vec, d = 8) {
  const n = vec.length, pad = nextPow2(n);
  let R = new Float64Array(pad); R.set(vec);
  const layers = [];
  for (let k = 0; k < d; k++) {
    const seed = 0x9e37 + k * 0x1000193;
    const sg = signs(seed, pad);
    const rot = toFrame(R, sg);                       // into the fresh frame (new 000)
    let m = 0; for (let i = 0; i < pad; i++) m += Math.abs(rot[i]);
    const s = m / pad + 1e-12;
    const t = new Int8Array(pad);
    for (let i = 0; i < pad; i++) { const q = Math.round(rot[i] / s); t[i] = q > 1 ? 1 : q < -1 ? -1 : q; }
    // subtract this layer's reconstruction, in the original frame
    const contrib = fromFrame(Float64Array.from(t, x => x * s), sg);
    for (let i = 0; i < pad; i++) R[i] -= contrib[i];
    layers.push({ seed, s, t });
    if (s < 1e-9) break;
  }
  return { n, pad, layers };
}

export function decode(enc) {
  const acc = new Float64Array(enc.pad);
  for (const { seed, s, t } of enc.layers) {
    const contrib = fromFrame(Float64Array.from(t, x => x * s), signs(seed, enc.pad));
    for (let i = 0; i < enc.pad; i++) acc[i] += contrib[i];
  }
  return acc.subarray(0, enc.n);
}

export function bitsPerValue(enc) {
  return enc.layers.length * (enc.pad / enc.n) * LOG2_3 + enc.layers.length * 32 / enc.n;
}

// data-agnostic: bytes are just values on the scale, centered on the null.
export function encodeBytes(buf, d = 8) {
  const v = new Float64Array(buf.length);
  for (let i = 0; i < buf.length; i++) v[i] = buf[i] - 128;
  return encode(v, d);
}
export function decodeBytes(enc) {
  const v = decode(enc), out = new Uint8Array(enc.n);
  for (let i = 0; i < enc.n; i++) out[i] = Math.max(0, Math.min(255, Math.round(v[i] + 128)));
  return out;
}

export function rrmse(a, b) {
  let e = 0, s = 0; for (let i = 0; i < a.length; i++) { const d = a[i] - b[i]; e += d * d; s += a[i] * a[i]; }
  return Math.sqrt(e / (s + 1e-12));
}
