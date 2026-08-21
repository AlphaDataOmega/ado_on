// openclose.test.js — the inverse-scale ascent operator. node test/openclose.test.js
import assert from 'node:assert';
import { CLOSE, OPEN, closeLevel, closeVec, openVec, top } from '../openclose.js';

let n = 0; const ok = (s) => { console.log('  ✓ ' + s); n++; };
const rrmse = (a, b) => { let e = 0, s = 0; for (let i = 0; i < a.length; i++) { const d = a[i] - b[i]; e += d * d; s += a[i] * a[i]; } return Math.sqrt(e / (s + 1e-12)); };
const rnd = (m) => Float64Array.from({ length: m }, () => Math.random() * 2 - 1);

// — exact round trip at power-of-three lengths, any depth —
{
  for (const L of [1, 2, 3, 4, 6]) {
    const v = rnd(3 ** L); let e = 0; const back = OPEN(CLOSE(v));
    for (let i = 0; i < v.length; i++) e = Math.max(e, Math.abs(v[i] - back[i]));
    assert.ok(e < 1e-9, `depth ${L} round-trip (${e})`);
  }
  ok('OPEN(CLOSE(v)) = v exactly, any depth (3→1, 9→3→1, …)');
}

// — arbitrary-length vector via padded wrappers —
{
  const v = rnd(500); const enc = closeVec(v);
  assert.ok(rrmse(v, openVec(enc)) < 1e-12, 'padded round-trip');
  assert.ok(typeof top(enc) === 'number', 'the ascent yields one addressable top object');
  ok('closeVec/openVec round-trip any length, and yield one top handle');
}

// — distinct lower walks CAN share one higher object (the mechanical claim) —
{
  const { openLevel } = await import('../openclose.js');
  const S = rnd(9);
  const wA = openLevel(S, rnd(18)), wB = openLevel(S, rnd(18));   // same S, different details
  const SA = closeLevel(wA).S, SB = closeLevel(wB).S;
  let e = 0; for (let i = 0; i < S.length; i++) e = Math.max(e, Math.abs(SA[i] - SB[i]));
  assert.ok(e < 1e-9 && rrmse(wA, wB) > 0.1, 'walks share S but differ');
  ok('distinct lower walks share one higher object (mechanically; emergence null — see OPENCLOSE.md)');
}

console.log(`\n${n} groups passed.`);
