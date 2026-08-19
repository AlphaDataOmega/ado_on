'use strict';
// τ — write and read the base-100 cascade. Data files carry the extension .100,
// which is what the base is: one address level is 3 faces x 4 states = 64, a base-100
// pair with 36 spare, and the base is not chosen —
//     Φ⁷ x 100φ⁷  =  29.0344 x 3.4442  =  100.000000
//
// One address level is 3 faces × 4 states = 64 combinations, which fits a base-100 pair
// with 36 spare. And the base is not chosen: Φ⁷ × 100φ⁷ = 29.0344 × 3.4442 = 100.000000.
//
// A cascade is a prefix code, so truncating a τ stream yields a valid coarser field —
// refinement never re-decodes and never discards.
const { Organism } = require('./Ω.js');

const pair = n => String(n).padStart(2, '0');
const level = (a, b, c) => a*16 + b*4 + c;          // three faces, one base-100 pair
const unlevel = v => [Math.floor(v/16)%4, Math.floor(v/4)%4, v%4];

// text -> τ.  ASCII magic: the header identifier must not itself need decoding. Writing
// 'τ' as latin1 truncates U+03C4 to byte 196, which put a mojibake byte in the magic
// number of every file. Harmless only because decode() discards line one.
// Header carries the address table so the stream can be read back without
// the source; the body is one cascade per byte, levels separated by nothing, bytes by '.'
function encode(src) {
  const ω = new Organism().feed(src);
  const live = [...ω.live].sort((x,y) => x-y);
  const head = live.map(b => { const A = ω.addr.get(b);
    const d = Math.min(A[0].length, A[1].length, A[2].length);
    let s = '';
    for (let i = 0; i < d; i++) s += pair(level(A[0][i], A[1][i], A[2][i]));
    return b + ':' + s; }).join(' ');
  const seen = new Map();
  for (const b of live) { const A = ω.addr.get(b);
    const d = Math.min(A[0].length, A[1].length, A[2].length);
    let s = ''; for (let i = 0; i < d; i++) s += pair(level(A[0][i], A[1][i], A[2][i]));
    if (!seen.has(s)) seen.set(s, b); }
  let body = '';
  for (let i = 0; i < ω.buf.length; i++) { const A = ω.addr.get(ω.buf[i]);
    const d = Math.min(A[0].length, A[1].length, A[2].length);
    for (let k = 0; k < d; k++) body += pair(level(A[0][k], A[1][k], A[2][k]));
    body += '.'; }
  return { tau: 'TAU100/1 ' + live.length + '\n' + head + '\n' + body,
           collisions: live.length - seen.size, states: ω.pos.length, window: ω.window };
}
// τ -> text
function decode(tau) {
  const [hdr, head, body] = tau.split('\n');
  const map = new Map();
  for (const e of head.split(' ')) { const i = e.indexOf(':');
    map.set(e.slice(i+1), +e.slice(0, i)); }
  let out = '';
  let n = 0;
  for (const cell of body.split('.')) { n++; if (!cell) continue;
    const b = map.get(cell);
    // A silent null here is worse than a crash. Served from a CDN or a gateway, a
    // truncated or corrupted body decodes to nothing and the page shows an empty field
    // with no reason given. Cells are '.' separated, so a chunk boundary MUST land on a
    // '.': cut at raw.lastIndexOf('.', offset) + 1. Arbitrary cuts fail 161 times in 200.
    if (b === undefined) throw new Error(
      'τ: cell ' + n + ' (' + JSON.stringify(cell) + ') is not in the alphabet — the body is '
      + 'truncated or corrupt. Chunk boundaries must fall on a "." between cells.');
    out += String.fromCharCode(b); }
  return out;
}
// safeCut — the boundary rule, so a caller never has to know the format.
function safeCut(tau, offset) {
  const h = tau.indexOf('\n', tau.indexOf('\n') + 1);
  if (h < 0 || offset <= h) return null;
  const b = tau.lastIndexOf('.', offset);
  return b > h ? tau.slice(0, b + 1) : null;
}
// render — the sunflower. Vogel placement at 2πkφ, radius √k, three layers offset by
// φ⁷ so the bleed is visible as colour separation rather than grey. The parastichy arms
// are not drawn; they are what 2πkφ does when you let it run.
function render(src, N, count) {
  const { Organism } = require('./Ω.js');
  const ω = new Organism().feed(src);
  N = N || 520; count = count || 1600;
  const GOLD = 2*Math.PI*((Math.sqrt(5)-1)/2), NR = Math.pow((Math.sqrt(5)-1)/2, 7);
  const seeds = [];
  for (let k = 0; k < count && k < ω.buf.length; k++) {
    const A = ω.addr.get(ω.buf[k]); if (!A) continue;
    const rad = Math.sqrt(k+1);
    for (let L = 0; L < 3; L++) {
      const th = GOLD*k + 2*Math.PI*L*NR;      // the φ⁷ offset between layers
      seeds.push({ L, x: rad*Math.cos(th), y: rad*Math.sin(th), d: (A[L]||[]).length }); } }
  const R = Math.sqrt(count+1), px = new Uint8Array(N*N*3);
  const c = N/2, sc = (N/2-2)/R, maxd = Math.max(1, ...seeds.map(s2 => s2.d));
  for (const s2 of seeds) {
    const X = Math.round(c+s2.x*sc), Y = Math.round(c+s2.y*sc);
    const v = Math.round(40+215*(s2.d/maxd));
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const x = X+dx, y = Y+dy; if (x < 0 || y < 0 || x >= N || y >= N) continue;
      const o = (y*N+x)*3+s2.L, w = (dx===0&&dy===0) ? 1 : 0.45;
      px[o] = Math.min(255, px[o]+Math.round(v*w)); } }
  const nr = Math.max(2, Math.round(NR*R*sc*8));   // the null, drawn 8x so it is visible
  for (let y = -nr; y <= nr; y++) for (let x = -nr; x <= nr; x++) {
    const d2 = x*x+y*y; if (d2 > nr*nr || d2 < (nr-1)*(nr-1)) continue;
    const X = Math.round(c+x), Y = Math.round(c+y); if (X<0||Y<0||X>=N||Y>=N) continue;
    const o = (Y*N+X)*3; px[o]=255; px[o+1]=255; px[o+2]=255; }
  return { px, N, seeds: seeds.length, trits: Math.min(count, ω.buf.length) };
}
function png(px, N) {
  const zlib = require('zlib');
  const raw = Buffer.alloc((N*3+1)*N);
  for (let y = 0; y < N; y++) { raw[y*(N*3+1)] = 0;
    Buffer.from(px.buffer, px.byteOffset+y*N*3, N*3).copy(raw, y*(N*3+1)+1); }
  const T = []; for (let n = 0; n < 256; n++) { let c = n;
    for (let k = 0; k < 8; k++) c = c&1 ? 0xedb88320^(c>>>1) : c>>>1; T[n] = c>>>0; }
  const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type,'ascii'), data]);
    let c = 0xffffffff; for (const b of td) c = T[(c^b)&255]^(c>>>8);
    const crc = Buffer.alloc(4); crc.writeUInt32BE((c^0xffffffff)>>>0);
    return Buffer.concat([len, td, crc]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(N,0); ihdr.writeUInt32BE(N,4);
  ihdr[8]=8; ihdr[9]=2;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),
    chunk('IHDR',ihdr), chunk('IDAT',zlib.deflateSync(raw)), chunk('IEND',Buffer.alloc(0))]);
}
module.exports = { encode, decode, safeCut, level, unlevel, render, png };

if (require.main === module) {
  const fs = require('fs');
  // LATIN1, not utf8. Ω is byte-oriented -- one char, one byte -- so a corpus must be
  // read as bytes. Reading it as utf8 truncates every multi-byte character (the story's
  // en dashes became 0x13) and the round trip cannot close.
  const src = fs.readFileSync(process.argv[2] || './Δ/V·001', 'latin1');
  const r = encode(src);
  const back = decode(r.tau);
  console.log('source   %d bytes', src.length);
  console.log('τ        %d bytes  (%sx)', r.tau.length, (r.tau.length/src.length).toFixed(2));
  console.log('states   %d · window %d · address collisions %d', r.states, r.window, r.collisions);
  console.log('round trip lossless: %s', back === src ? 'YES' : 'NO — ' + (back ? 'differs' : 'undecodable'));
  if (back !== src && back) { for (let i = 0; i < Math.min(src.length, back.length); i++)
    if (src[i] !== back[i]) { console.log('  first difference at %d: %j vs %j', i, src.slice(i,i+12), back.slice(i,i+12)); break; } }
}
