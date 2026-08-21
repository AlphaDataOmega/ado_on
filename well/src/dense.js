// dense.js — a dense, dependency-free embedding for a chunk, so the field can
// be STORED compressed on the scale (scale.js) with a recall/size dial. The
// sparse hashing field recalls well but can't be scale-compressed (it's already
// sparse). This projects the same lexical features into a fixed DENSE signed
// vector (feature hashing / SimHash-style) whose cosine tracks the sparse one —
// and a dense vector is exactly what the scale codec folds.

const DIM = 512;                     // dense dimension — small enough to compress, rich enough to recall
const NGRAMS = [3, 4, 5];

function h32(str, seed = 2166136261) {
  let h = seed >>> 0;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h >>> 0;
}

// denseEmbed(text) -> Float64Array(DIM), L2-normalized. Each feature hashes to
// one dim with a sign (the null-centered contribution), so cosine ≈ lexical overlap.
export function denseEmbed(text) {
  const s = ' ' + String(text).toLowerCase().replace(/\s+/g, ' ').trim() + ' ';
  const v = new Float64Array(DIM);
  const bump = (tok, w) => { const hh = h32(tok); v[hh % DIM] += (hh & 0x10000 ? w : -w); };  // sign from a spare bit
  for (const wtok of s.split(/[^a-z0-9]+/)) if (wtok.length > 2) bump('w:' + wtok, 2);
  for (const n of NGRAMS) for (let i = 0; i + n <= s.length; i++) bump('g:' + s.slice(i, i + n), 1);
  let nrm = 0; for (let i = 0; i < DIM; i++) nrm += v[i] * v[i]; nrm = Math.sqrt(nrm) || 1;
  for (let i = 0; i < DIM; i++) v[i] /= nrm;
  return v;
}

export function cosineDense(a, b) {
  let d = 0; for (let i = 0; i < a.length; i++) d += a[i] * b[i]; return d;
}

// --- pack a scale-encoded vector compactly for disk (5 trits per byte = base 243) ---
export function packEnc(enc) {
  return { n: enc.n, pad: enc.pad, layers: enc.layers.map(L => ({ seed: L.seed, s: L.s, t: packTrits(L.t) })) };
}
export function unpackEnc(p) {
  return { n: p.n, pad: p.pad, layers: p.layers.map(L => ({ seed: L.seed, s: L.s, t: unpackTrits(L.t, p.pad) })) };
}
function packTrits(t) {
  const out = []; for (let i = 0; i < t.length; i += 5) { let v = 0; for (let k = 0; k < 5; k++) v = v * 3 + ((t[i + k] || 0) + 1); out.push(v); }
  return Buffer.from(out).toString('base64');
}
function unpackTrits(str, n) {
  const b = Buffer.from(str, 'base64'), t = new Int8Array(Math.ceil(n / 5) * 5);
  for (let i = 0; i < b.length; i++) { let v = b[i]; for (let k = 4; k >= 0; k--) { t[i * 5 + k] = (v % 3) - 1; v = (v / 3) | 0; } }
  return t.subarray(0, n);
}

// denseRecall — cosine over the (decompressed) dense field, with the SAME pole
// rule as the sparse field: grounding needs a shared content word, not just a
// high cosine — so abstention stays honest even after compression.
import { contentWords } from './field.js';
export function denseRecall(chunks, query, k = 5, opts = {}) {
  const MIN_TOP = opts.minTop ?? 0.16, MIN_MARGIN = opts.minMargin ?? 1.8;
  const q = denseEmbed(query), qw = contentWords(query);
  const scored = chunks.map(c => ({ score: cosineDense(q, c.vec), chunk: c })).sort((a, b) => b.score - a.score);
  const top = scored[0]?.score || 0;
  const tail = scored.slice(5, 30).map(x => x.score).sort((a, b) => a - b);
  const bg = tail.length ? tail[Math.floor(tail.length / 2)] : 0;
  const margin = bg > 1e-6 ? top / bg : (top > MIN_TOP ? Infinity : 0);
  const anchor = scored[0] ? [...qw].some(w => contentWords(scored[0].chunk.text).has(w)) : false;
  const grounded = anchor && top >= MIN_TOP && margin >= MIN_MARGIN;
  const r = x => Math.round(x * 1000) / 1000;
  return { grounded, anchor, top: r(top), background: r(bg), margin: margin === Infinity ? 'inf' : r(margin),
    hits: scored.slice(0, k).map(h => ({ score: r(h.score), text: h.chunk.text, source: h.chunk.source })) };
}
export { DIM };
