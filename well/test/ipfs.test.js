// ipfs.test.js — content addressing for folded fields. node test/ipfs.test.js
import assert from 'node:assert';
import { cidv1raw, canonical } from '../src/ipfs.js';

let n = 0; const ok = (s) => { console.log('  ✓ ' + s); n++; };

// — CIDv1 is deterministic, real (bafkrei…), and content-addressed —
{
  const c = cidv1raw('the folded field, addressed by what it is');
  assert.equal(c, 'bafkreie7wt7fmiuwa2ch6xvizvjvd2u4jazwhoerf4p4bndi23gohx7v74'); // verified == `ipfs add`
  assert.ok(c.startsWith('bafkrei'), 'CIDv1 raw sha2-256 prefix');
  assert.notEqual(cidv1raw('a'), cidv1raw('b'));
  ok('cidv1raw: real IPFS CIDv1, deterministic, matches the ipfs node');
}

// — canonical form is order-independent (same field → same CID) —
{
  const a = canonical({ x: 1, y: [2, 3], z: { b: 1, a: 2 } });
  const b = canonical({ z: { a: 2, b: 1 }, y: [2, 3], x: 1 });
  assert.equal(a.toString(), b.toString());
  assert.equal(cidv1raw(a), cidv1raw(b), 'same content → same CID regardless of key order');
  ok('canonical: key-order-independent → stable CID');
}

// — content addressing catches tampering —
{
  const bytes = canonical({ field: 'dogs' }); const cid = cidv1raw(bytes);
  const tampered = Buffer.concat([bytes, Buffer.from('x')]);
  assert.notEqual(cidv1raw(tampered), cid, 'any change moves the CID (tamper-evident)');
  ok('integrity: a byte change moves the CID — fork/import is verifiable');
}

console.log(`\n${n} groups passed.`);
