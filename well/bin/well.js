#!/usr/bin/env node
// well — the CLI. feed / recall / ask / stats / list, over a named universe.
import { Well } from '../src/well.js';
import { universes, rawRead, rawWrite, wellHome } from '../src/store.js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { encodeBytes, decodeBytes, bitsPerValue, rrmse } from '../scale.js';
import { closeVec, openVec, top } from '../openclose.js';
import { denseEmbed } from '../src/dense.js';
import { cidv1raw, canonical } from '../src/ipfs.js';

const GATEWAY = process.env.WELL_GATEWAY || 'https://ipfs.ado.earth';   // Cloudflare-cached IPFS reads
const expDir = () => { const d = join(wellHome(), 'exports'); if (!existsSync(d)) mkdirSync(d, { recursive: true }); return d; };
async function fetchArtifact(cid) {                             // local exports → CF cache → local ipfs
  const p = join(expDir(), cid + '.wellpack');
  if (existsSync(p)) return readFileSync(p);
  try { const r = await fetch(GATEWAY + '/' + cid, { signal: AbortSignal.timeout(20000) });   // ipfs.ado.earth edge cache
    if (r.ok) return Buffer.from(await r.arrayBuffer()); } catch (_) {}
  try { return execSync('ipfs cat ' + cid, { maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] }); } catch (_) {}
  return null;
}

const argv = process.argv.slice(2);
const flags = {};
const rest = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '-u' || argv[i] === '--universe') flags.universe = argv[++i];
  else if (argv[i] === '-k') flags.k = parseInt(argv[++i], 10);
  else if (argv[i] === '-d') flags.d = parseInt(argv[++i], 10);
  else if (argv[i] === '-o' || argv[i] === '--out') flags.o = argv[++i];
  else if (argv[i] === '-f' || argv[i] === '--file') flags.file = argv[++i];
  else if (argv[i] === '--json') flags.json = true;
  else rest.push(argv[i]);
}
const cmd = rest.shift();
const U = flags.universe || 'default';
const now = Date.now();

function out(o) { console.log(flags.json ? JSON.stringify(o, null, 2) : o); }

switch (cmd) {
  case 'feed': {
    const w = new Well(U);
    const r = flags.file ? w.feed(flags.file, { now }) : w.feed(rest.join(' '), { now });
    out(flags.json ? r : `fed ${r.fed} chunk(s) from ${r.source} → universe "${r.universe}" (${r.chunks} total)`);
    break;
  }
  case 'recall': {
    const w = new Well(U);
    const r = w.recall(rest.join(' '), flags.k || 5);
    if (flags.json) { out(r); break; }
    out(`grounded=${r.grounded}  top=${r.top} bg=${r.background} margin=${r.margin}`);
    for (const h of r.hits) out(`  [${h.score}] ${h.text.replace(/\s+/g, ' ').slice(0, 140)}${h.source ? '  (' + h.source + ')' : ''}`);
    break;
  }
  case 'ask': {
    const w = new Well(U);
    const r = w.ask(rest.join(' '), flags.k || 5);
    if (flags.json) { out(r); break; }
    out(`${r.verdict} — ${r.reason}   [top=${r.top} bg=${r.background} margin=${r.margin}]`);
    for (const e of r.evidence || []) out(`  [${e.score}] ${e.text.replace(/\s+/g, ' ').slice(0, 160)}`);
    break;
  }
  case 'stats': { out(new Well(U).stats()); break; }
  case 'list': { out(universes().length ? universes() : '(no universes yet — feed one)'); break; }
  case 'scale': {
    // the data-agnostic scale codec: descend `d` layers, report the dial.
    const text = flags.file ? readFileSync(flags.file, 'utf8') : rest.join(' ');
    const bytes = new TextEncoder().encode(text);
    const before = Float64Array.from(bytes, b => b - 128);
    const d = flags.d || flags.k || 12;
    const enc = encodeBytes(bytes, d);
    const back = decodeBytes(enc);
    let exact = true; for (let i = 0; i < bytes.length; i++) if (bytes[i] !== back[i]) { exact = false; break; }
    const r = { n: bytes.length, d: enc.layers.length, bitsPerValue: +bitsPerValue(enc).toFixed(2),
      rmse: +rrmse(before, decodeBytes(enc).length ? Float64Array.from(back, b => b - 128) : before).toFixed(4), exact };
    out(flags.json ? r : `scale: ${r.n} bytes · d=${r.d} · ${r.bitsPerValue} bits/value · rmse ${r.rmse} · round-trip ${exact ? 'EXACT' : 'lossy (raise d)'}`);
    break;
  }
  case 'close': {
    // the ascent: CLOSE a field into one addressable object at the top, reversibly.
    const text = flags.file ? readFileSync(flags.file, 'utf8') : rest.join(' ');
    const vec = denseEmbed(text);
    const enc = closeVec(vec);
    const back = openVec(enc);
    const r = { n: enc.n, levels: enc.T.levels.length, top: +top(enc).toFixed(6),
      roundTrip: +rrmse(vec, back).toExponential(2) };
    out(flags.json ? r : `close: ${r.n}-dim field → 1 object over ${r.levels} levels · top=${r.top} · OPEN round-trip err ${r.roundTrip}`);
    break;
  }
  case 'export': {
    // fold a universe's compressed field into a content-addressed artifact (a real IPFS CID)
    const raw = rawRead(U); if (!raw) { out('no such universe: ' + U); break; }
    const bytes = canonical(raw); const cid = cidv1raw(bytes);
    writeFileSync(join(expDir(), cid + '.wellpack'), bytes);
    out(flags.json ? { cid, universe: U, chunks: raw.chunks.length, bytes: bytes.length }
      : `export: ${U} (${raw.chunks.length} chunks, ${bytes.length}B) → ${cid}\n  pin it:  well pin ${cid}\n  fork it: well fork ${cid} -u <name>`);
    break;
  }
  case 'import': case 'fork': {
    const cid = rest[0]; if (!cid) { out('usage: well ' + cmd + ' <cid> -u <name>'); break; }
    const name = flags.universe || (cmd + '-' + cid.slice(-8));
    const bytes = await fetchArtifact(cid);
    if (!bytes) { out('could not fetch ' + cid + ' (not in local exports, ipfs.ado.earth, or ipfs)'); break; }
    if (cidv1raw(bytes) !== cid) { out('✗ integrity fail: content does not match the CID'); break; }
    const obj = JSON.parse(bytes.toString('utf8')); obj.universe = name;
    rawWrite(name, obj);
    out(flags.json ? { cid, universe: name, chunks: obj.chunks.length, verified: true }
      : `${cmd}: ${cid} → universe "${name}" (${obj.chunks.length} chunks, CID-verified ✓)${cmd === 'fork' ? '\n  now diverge it:  well -u ' + name + ' feed "…"' : ''}`);
    break;
  }
  case 'merge': {
    const [ua, ub] = rest; const out_u = flags.o || flags.out || (ua + '+' + ub);
    const a = rawRead(ua), b = rawRead(ub);
    if (!a || !b) { out('usage: well merge <a> <b> -o <out>   (both universes must exist)'); break; }
    const chunks = [...a.chunks, ...b.chunks].map((c, i) => ({ ...c, id: 'c' + i }));  // superpose = union of fields
    rawWrite(out_u, { universe: out_u, meta: { fed: chunks.length, d: (a.meta.d || b.meta.d || 8), merged: [ua, ub] }, chunks });
    out(flags.json ? { universe: out_u, chunks: chunks.length, from: [ua, ub] }
      : `merge: ${ua} (${a.chunks.length}) + ${ub} (${b.chunks.length}) → "${out_u}" (${chunks.length} chunks)\n  export it: well export -u ${out_u}`);
    break;
  }
  case 'pin': {
    const cid = rest[0]; const p = join(expDir(), cid + '.wellpack');
    if (!cid || !existsSync(p)) { out('usage: well pin <cid>   (export it first)'); break; }
    let ipfsCid = null, pinata = 'no token';
    // add to the local ipfs node — raw CIDv1, so it matches our address exactly
    try { ipfsCid = execSync('ipfs add --raw-leaves --cid-version 1 -Q ' + p, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch (_) {}
    // pin the EXISTING CID on Pinata (pinByHash preserves the raw CIDv1 — no re-wrap)
    const token = process.env.PINATA_JWT || process.env.PINATA_TOKEN;
    if (token) {
      try {
        const r = await fetch('https://api.pinata.cloud/pinning/pinByHash', {
          method: 'POST', headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
          body: JSON.stringify({ hashToPin: cid, pinataMetadata: { name: 'well:' + cid.slice(-8) } }),
          signal: AbortSignal.timeout(25000) });
        pinata = r.ok ? 'pinned ✓' : 'error ' + r.status + ' (' + (await r.text()).slice(0, 80) + ')';
      } catch (e) { pinata = 'unreachable (run from a networked host): ' + String(e.name || e); }
    }
    out(`pin: ${cid}\n  local ipfs: ${ipfsCid === cid ? 'added ✓' : ipfsCid ? 'added as ' + ipfsCid : 'unavailable'}\n  pinata:     ${pinata}\n  served at:  ${GATEWAY}/${cid}  (Cloudflare-cached, immutable)`);
    break;
  }
  default:
    out(`well — the memory organ. unlimited context in, grounded recall out, honest ABSENT when the field is dry.

usage:
  well feed "text…"                 pour text into a universe
  well feed -f ./notes.md            pour a file in
  well recall "query"  [-k 8]        draw the nearest grounded content
  well ask "question"                PRESENT (grounded) or ABSENT (no pole)
  well scale "text…" [-d 16]         descend the data-agnostic scale — the dial
  well close "text…"                 ascend: CLOSE a field into one object (reversible)
  well export -u <u>                 fold a universe → a content-addressed IPFS CID
  well import <cid> [-u name]        pull a field back by CID (integrity-verified)
  well fork <cid> -u <name>          fork a shared field into your own universe
  well merge <a> <b> -o <out>        superpose two fields into one
  well pin <cid>                     make an exported field retrievable (ipfs/pinata)
  well stats                         what the universe holds
  well list                          the universes on disk

flags:  -u <universe>   --json   -k <n>
home:   $WELL_HOME (default ~/.well)
store:  the field is stored COMPRESSED on the scale — $WELL_D is the recall/size
        dial (default 8; lower = smaller on disk, higher = more exact)`);
}
