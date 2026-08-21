// well.test.js — offline tests. Isolates its own WELL_HOME.
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
process.env.WELL_HOME = mkdtempSync(join(tmpdir(), 'well-test-'));

import assert from 'node:assert';
import { Well } from '../src/well.js';
import { encode, cosine } from '../src/field.js';

let n = 0; const ok = (name) => { console.log('  ✓ ' + name); n++; };

// — field basics —
{
  const a = encode('the mitochondria is the powerhouse of the cell');
  const b = encode('mitochondria powerhouse cell');
  const c = encode('interest rates and the bond market in 1994');
  assert.ok(cosine(a, a) > 0.99, 'self-similarity ~1');
  assert.ok(cosine(a, b) > cosine(a, c), 'near text scores above unrelated');
  ok('field: encodes, self-similar, ranks near over far');
}

// — feed + recall (grounded) —
{
  const w = new Well('t1');
  w.feed('The Anthea organism seeds from The Story and uses an r4 relational field with no constants. Its Spine is post-quantum.', { now: 1 });
  w.feed('kith runs on the nine laws inherited from TinyHive. The gate answers commit, refuse, or nothing.', { now: 1 });
  const r = w.recall('what does the gate answer', 3);
  assert.equal(r.grounded, true, 'a fed fact is grounded');
  assert.ok(/commit, refuse/.test(r.hits[0].text), 'pulls the right chunk');
  ok('recall: a fed fact comes back grounded, right chunk on top');
}

// — ask: PRESENT vs ABSENT (the honest part) —
{
  const w = new Well('t2');
  w.feed('The well abstains when the field has no pole — when the top match does not separate from the background. Absence is a lack of signal, not a low score.', { now: 1 });
  w.feed('Capability leases are scoped, time-bound, signed, reversible, and audited.', { now: 1 });
  const present = w.ask('when does the well abstain');
  assert.equal(present.verdict, 'PRESENT', 'grounded question is PRESENT');

  const absent = w.ask('what were the quarterly earnings of a company never mentioned here');
  assert.equal(absent.verdict, 'ABSENT', 'a question the field never held is ABSENT, not guessed');
  assert.match(absent.reason, /pole|empty/);
  ok('ask: grounded→PRESENT, unheld→ABSENT (no confabulation)');
}

// — empty universe abstains —
{
  const empty = new Well('t3-empty').ask('anything at all');
  assert.equal(empty.verdict, 'ABSENT');
  ok('empty field abstains rather than answering');
}

// — persistence round-trips —
{
  new Well('t4').feed('a persisted fact about the loom of dimensions', { now: 1 });
  const again = new Well('t4');
  assert.equal(again.stats().chunks, 1, 'reopens from disk');
  assert.equal(again.recall('loom of dimensions').grounded, true);
  ok('persistence: a universe reopens from disk with its field intact');
}

console.log(`\n${n} groups passed.`);
