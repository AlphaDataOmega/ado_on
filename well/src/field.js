// field.js — the well's field. Text goes in as content; recall pulls the
// nearest content back out; and — the part that matters — the field knows
// when it does NOT hold something, and says so.
//
// Encoding is a vocabulary-free hashing field: every chunk is projected into
// a fixed-dimension field by hashing its character n-grams and word tokens,
// then L2-normalized. Recall is cosine nearness in that field. This is a
// light, dependency-free substrate (the ΑΔΩ field at small scale) — honest
// lexical recall, not a claim of semantic understanding.
//
// ABSTENTION IS BY CONSTRUCTION. A query only counts as PRESENT if its top
// match rises above the field's own background — if the field has a POLE
// there. When the top match does not separate from the noise, the field is
// a flat plateau, and a flat plateau means ABSENT. That is the honest
// reading of our own result: absence is a lack of signal/background
// separation, not a low absolute score. (see: r4-needs-a-pole)

const DIM = 1 << 14;            // 16384 — the field's dimension
const NGRAMS = [3, 4, 5];       // character n-gram widths

// stopwords are not poles — they are the field's background hum. Excluding
// them from the content channel is what stops "the … of an …" from grounding
// a question the field never held.
const STOP = new Set(('a an the of to in on and or but for with without is are was were be been being this that these those ' +
  'it its as at by from into out over under up down off no not do does did has have had you your i we they he she them him her ' +
  'what when where who why how which whose there here then than so if else about above below can could will would may might must ' +
  'one two three their our my me us your yours also very just each any all some more most other such only own same').split(' '));

// deterministic 32-bit hash (FNV-1a-ish), stable across runs
function h32(str, seed = 2166136261) {
  let h = seed >>> 0;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h >>> 0;
}

// contentWords(text) -> the set of distinctive tokens (the potential poles)
export function contentWords(text) {
  const out = new Set();
  for (const w of String(text).toLowerCase().split(/[^a-z0-9]+/))
    if (w.length > 2 && !STOP.has(w)) out.add(w);
  return out;
}

// encode(text) -> a sparse, L2-normalized field vector as Map(index -> weight)
export function encode(text) {
  const s = ' ' + String(text).toLowerCase().replace(/\s+/g, ' ').trim() + ' ';
  const v = new Map();
  const bump = (token, w = 1) => { const i = h32(token) % DIM; v.set(i, (v.get(i) || 0) + w); };
  // word tokens are the poles — stopwords excluded so background stays quiet
  for (const w of s.split(/[^a-z0-9]+/)) if (w.length > 2 && !STOP.has(w)) bump('w:' + w, 3);
  // character n-grams carry texture (morphology, typos) but never ground alone
  for (const n of NGRAMS) for (let i = 0; i + n <= s.length; i++) bump('g:' + s.slice(i, i + n), 1);
  // L2 normalize
  let norm = 0; for (const w of v.values()) norm += w * w; norm = Math.sqrt(norm) || 1;
  for (const [i, w] of v) v.set(i, w / norm);
  return v;
}

export function cosine(a, b) {
  // iterate the smaller map
  const [s, l] = a.size < b.size ? [a, b] : [b, a];
  let dot = 0; for (const [i, w] of s) { const o = l.get(i); if (o) dot += w * o; }
  return dot;   // both are unit vectors, so dot == cosine
}

// recall(store, query, k) -> ranked hits + the field's own read of whether
// it actually holds this (grounded) or is flat here (absent).
export function recall(chunks, query, k = 5, opts = {}) {
  const MIN_TOP = opts.minTop ?? 0.16;      // a pole must clear this floor
  const MIN_MARGIN = opts.minMargin ?? 1.8; // and stand this many x over background
  const q = encode(query);
  const qWords = contentWords(query);
  const scored = chunks.map((c, idx) => ({ idx, score: cosine(q, c.vec), chunk: c }))
    .sort((a, b) => b.score - a.score);
  const top = scored[0]?.score || 0;
  // background = typical score away from the peak (median of ranks 5..30)
  const tail = scored.slice(5, 30).map(x => x.score).sort((a, b) => a - b);
  const bg = tail.length ? tail[Math.floor(tail.length / 2)] : 0;
  const margin = bg > 1e-6 ? top / bg : (top > MIN_TOP ? Infinity : 0);
  // THE POLE: grounding requires the top hit to share at least one content
  // word with the query. Gram texture alone is background — it never grounds.
  const anchor = scored[0] ? [...qWords].some(w => contentWords(scored[0].chunk.text).has(w)) : false;
  const grounded = anchor && top >= MIN_TOP && margin >= MIN_MARGIN;
  return {
    grounded, anchor,
    top: round(top),
    background: round(bg),
    margin: margin === Infinity ? 'inf' : round(margin),
    hits: scored.slice(0, k).map(h => ({ score: round(h.score), text: h.chunk.text, source: h.chunk.source })),
  };
}

const round = x => Math.round(x * 1000) / 1000;
export { DIM };
