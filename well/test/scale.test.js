// scale.test.js — the data-agnostic scale codec. node test/scale.test.js
import assert from 'node:assert';
import { encode, decode, bitsPerValue, encodeBytes, decodeBytes, rrmse } from '../scale.js';

let n = 0; const ok = (s) => { console.log('  ✓ ' + s); n++; };

function gauss() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
const vec = Float64Array.from({ length: 512 }, gauss);

// — the dial descends monotonically (no floor) —
{
  let prev = Infinity;
  for (const d of [1, 2, 4, 8, 16]) {
    const e = rrmse(vec, decode(encode(vec, d)));
    assert.ok(e < prev, `d=${d} should descend (${e} < ${prev})`);
    prev = e;
  }
  ok('the dial descends monotonically with d — no floor, a scale');
}

// — more d costs more bits (a rate, not free) —
{
  assert.ok(bitsPerValue(encode(vec, 8)) > bitsPerValue(encode(vec, 2)));
  ok('descending costs bits — a rate, not a miracle');
}

// — data-agnostic: same codec round-trips raw bytes toward exact —
{
  const bytes = new TextEncoder().encode('the residual is the next scale');
  const near = decodeBytes(encodeBytes(bytes, 48));
  let diff = 0; for (let i = 0; i < bytes.length; i++) diff += Math.abs(bytes[i] - near[i]);
  assert.ok(diff / bytes.length < 2, 'high d recovers bytes closely');
  ok('data-agnostic: the same codec folds raw bytes, not just vectors');
}

// — trits only: every code is in {-1,0,+1} —
{
  for (const { t } of encode(vec, 6).layers) for (const x of t) assert.ok(x === -1 || x === 0 || x === 1);
  ok('pure trits — every step is +/0/-, counted from the null');
}

console.log(`\n${n} groups passed.`);
