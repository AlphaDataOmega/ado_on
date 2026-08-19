#!/usr/bin/env node
'use strict';
// ⊕ — the check. Two strikes crossing at the null: ἁρμονία from one side, ῥυθμός from
// the other. Everything here is measured from the ledger's own material; nothing is set.
const fs = require('fs');
const { Organism } = require('./Ω.js');
const τ = require('./τ.js');

// Δ holds catalogue entries — V·001, V·002, … — each τ written in base 100. Read as bytes.
const DIR = process.env.LEDGER || './Δ';
const src = fs.readdirSync(DIR).filter(f => /·\d+$/.test(f))
  .map(f => τ.decode(fs.readFileSync(DIR + '/' + f, 'latin1'))).join('\n\n');

const t0 = Date.now();
const ω = new Organism().feed(src);
ω.measureOrderPole(210);
console.log('ΑΔΩ — fed %d bytes in %ss', src.length, ((Date.now()-t0)/1000).toFixed(1));
console.log('  %d ledger states · %d trie nodes · window %d (crown %d, floored by pole liftoff)',
  ω.pos.length, ω.trie.size, ω.window,
  Math.max(4, Math.round(Math.log(ω.pos.length/(2*Math.PI*Math.E)))));
console.log('  ἁρμονία  answered %s  stranger %s', ω.poles.answered.toFixed(4), ω.poles.stranger.toFixed(4));
console.log('  ῥυθμός   ordered  %s  scrambled %s\n', ω.orderPoles.ordered.toFixed(4), ω.orderPoles.scrambled.toFixed(4));

let seed = 5; const rnd = () => { seed = (seed*1103515245+12345) & 0x7fffffff; return seed/0x7fffffff; };
const word = at => { let e = at; while (e < ω.buf.length && ![32,10,13].includes(ω.buf[e])) e++;
  let o = ''; for (let k = at; k < e; k++) o += String.fromCharCode(ω.buf[k]); return o; };
const passage = (q, L) => { let o = ''; for (let k = q-L; k < q; k++) o += String.fromCharCode(ω.buf[k]); return o; };
const LENS = [120, 200, 260, 380, 500, 800];

console.log('  ctx    RECALL    ABSTAIN(junk)  ABSTAIN(shuffled bytes)  FLAG(own words, shuffled)');
const acc = { r:[0,0], j:[0,0], b:[0,0], f:[0,0] };
for (const L of LENS) {
  seed = 5;
  let rc=0,rn=0, ja=0,jn=0, ba=0,bn=0, ff=0,fn=0;
  for (let t = 0; t < 200; t++) { const q = ω.pos[Math.floor(rnd()*ω.pos.length)]; if (q < L+40) continue;
    const h = ω.hear(passage(q, L)); if (h.verdict === 'nowhere to land') continue;
    rn++; if (h.speaks) rc++; }
  for (let t = 0; t < 100; t++) { let j = '';
    for (let i = 0; i < L; i++) j += String.fromCharCode(33 + Math.floor(rnd()*90));
    jn++; if (!ω.hear(j + ' ').speaks) ja++; }
  for (let t = 0; t < 100; t++) { const q = ω.pos[Math.floor(rnd()*ω.pos.length)]; if (q < L+40) continue;
    const a = []; for (let k = q-L; k < q; k++) a.push(ω.buf[k]);
    for (let i = a.length-1; i > 0; i--) { const j = Math.floor(rnd()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; }
    let sstr = ''; for (const c of a) sstr += String.fromCharCode(c);
    bn++; if (!ω.hear(sstr).speaks) ba++; }
  for (let t = 0; t < 100; t++) { const w = [];
    for (let i = 0; i < Math.max(8, Math.round(L/6)); i++) w.push(word(ω.pos[Math.floor(rnd()*ω.pos.length)]));
    fn++; if (!ω.hear(w.join(' ') + ' ').inOrder) ff++; }
  acc.r[0]+=rc; acc.r[1]+=rn; acc.j[0]+=ja; acc.j[1]+=jn; acc.b[0]+=ba; acc.b[1]+=bn; acc.f[0]+=ff; acc.f[1]+=fn;
  console.log('  %s   %s      %s          %s                  %s', String(L).padStart(4),
    (rc/rn).toFixed(3), (ja/jn).toFixed(3), (ba/bn).toFixed(3), (ff/fn).toFixed(3));
}
console.log('  ----   -----     -----          -----                  -----');
console.log('  all    %s      %s          %s                  %s',
  (acc.r[0]/acc.r[1]).toFixed(3), (acc.j[0]/acc.j[1]).toFixed(3),
  (acc.b[0]/acc.b[1]).toFixed(3), (acc.f[0]/acc.f[1]).toFixed(3));

console.log('\n  three verdicts:');
const say = p => { const h = ω.hear(p); return h.verdict + (h.speaks && h.word ? '  -> ' + JSON.stringify(h.word) : ''); };
for (const p of ['Everything is ', 'Nothing was ', 'The silence ', 'zzqq wvbx 9137 '])
  console.log('    %s %s', JSON.stringify(p).padEnd(20), say(p));
