#!/usr/bin/env node
// well — the CLI. feed / recall / ask / stats / list, over a named universe.
import { Well } from '../src/well.js';
import { universes } from '../src/store.js';
import { readFileSync } from 'node:fs';
import { encodeBytes, decodeBytes, bitsPerValue, rrmse } from '../scale.js';

const argv = process.argv.slice(2);
const flags = {};
const rest = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '-u' || argv[i] === '--universe') flags.universe = argv[++i];
  else if (argv[i] === '-k') flags.k = parseInt(argv[++i], 10);
  else if (argv[i] === '-d') flags.d = parseInt(argv[++i], 10);
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
  default:
    out(`well — the memory organ. unlimited context in, grounded recall out, honest ABSENT when the field is dry.

usage:
  well feed "text…"                 pour text into a universe
  well feed -f ./notes.md            pour a file in
  well recall "query"  [-k 8]        draw the nearest grounded content
  well ask "question"                PRESENT (grounded) or ABSENT (no pole)
  well scale "text…" [-d 16]         descend the data-agnostic scale — the dial
  well stats                         what the universe holds
  well list                          the universes on disk

flags:  -u <universe>   --json   -k <n>
home:   $WELL_HOME (default ~/.well)
store:  the field is stored COMPRESSED on the scale — $WELL_D is the recall/size
        dial (default 8; lower = smaller on disk, higher = more exact)`);
}
