// ipfs.js — content addressing for folded fields (dependency-free). Computes a
// real IPFS CIDv1 (raw codec, sha2-256) locally, so a folded field is addressed
// by WHAT IT IS before it's ever pinned — the handle for switch/merge/fork/share.
// Single-block (<256KB) raw leaves; matches `ipfs add --raw-leaves --cid-version 1`.

import { createHash } from 'node:crypto';

const B32 = 'abcdefghijklmnopqrstuvwxyz234567';          // RFC4648 base32, lowercase, no pad
function base32(bytes) {
  let bits = 0, val = 0, out = '';
  for (const b of bytes) { val = (val << 8) | b; bits += 8;
    while (bits >= 5) { out += B32[(val >>> (bits - 5)) & 31]; bits -= 5; } }
  if (bits > 0) out += B32[(val << (5 - bits)) & 31];
  return out;
}

// cidv1raw(bytes|string) -> "bafkrei…" — real IPFS CIDv1, raw codec, sha2-256
export function cidv1raw(data) {
  const buf = typeof data === 'string' ? Buffer.from(data, 'utf8') : Buffer.from(data);
  const digest = createHash('sha256').update(buf).digest();
  const cid = Buffer.concat([Buffer.from([0x01, 0x55, 0x12, 0x20]), digest]);  // v1 · raw · sha2-256 · 32
  return 'b' + base32(cid);
}

// canonical(obj) -> deterministic JSON bytes (sorted keys), so the same field
// always yields the same CID regardless of key order.
export function canonical(obj) {
  const enc = (o) => o === null || typeof o !== 'object' ? JSON.stringify(o)
    : Array.isArray(o) ? '[' + o.map(enc).join(',') + ']'
    : '{' + Object.keys(o).sort().map(k => JSON.stringify(k) + ':' + enc(o[k])).join(',') + '}';
  return Buffer.from(enc(obj), 'utf8');
}
