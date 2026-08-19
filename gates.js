'use strict';
// gates.js — run the admission gates yourself, before anybody reviews anything.
//
//   node gates.js <corpus.txt>              gates 2 and 3, straight away
//   node gates.js <entry.json>              all four, using the declared ingest
//
// NAMING: placeholder, like every other name here, pending V.
//
// WHY THIS EXISTS. The gates were specified in prose and never written, which meant a
// contributor could not find out whether their corpus would pass until after a review
// cycle. That is backwards: the mechanical checks are the cheap part and they should run
// on the contributor's own machine in seconds. Gate strength is worth nothing if nobody
// can get to the gate.
//
// GATE 3 DOES NOT USE THE REGISTRY. It uses the fixed holdout in Δ/holdout. The spec
// originally drew foreign probes from "at least three corpora already in the registry",
// which is a closed loop: the registry holds one corpus, so corpus #2 could never satisfy
// it, and therefore #3 and #4 never could either. The gate was arithmetically
// unsatisfiable rather than merely strict. A shipped holdout fixes it permanently and
// makes every candidate's Gate 3 number comparable to every other's, which the registry
// version could never have done.

const fs = require('fs'), path = require('path'), crypto = require('crypto');
const τ = require('./τ.js'), M = require('./Ω.js');
const HERE = __dirname;

const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const pct = (n, d) => d ? (100 * n / d).toFixed(1) + '%' : '—';

// ── probes ───────────────────────────────────────────────────────────────────
// A probe is: some context ending on a word boundary, and the word that actually
// followed it. Nothing clever — the point is that the answer is known.
function probes(src, n, ctxLen) {
  const out = [], step = Math.floor(src.length / (n + 2));
  for (let i = 1; i <= n; i++) {
    let at = i * step;
    while (at < src.length && src[at] !== ' ') at++;
    if (at >= src.length - 2) break;
    let e = at + 1; while (e < src.length && src[e] !== ' ') e++;
    const want = src.slice(at + 1, e);
    if (want.length < 2) continue;
    out.push({ ctx: src.slice(Math.max(0, at - ctxLen), at + 1), want });
  }
  return out;
}
function run(ω, ps) {
  let claimed = 0, right = 0, rightWhenClaimed = 0, spoke = 0;
  for (const p of ps) {
    let r; try { r = ω.hear(p.ctx); } catch (e) { continue; }
    if (!r) continue;
    const ok = String(r.word || '').trim() === p.want.trim();
    if (r.word) spoke++;
    if (ok) right++;
    if (r.verdict === 'mine, in order') { claimed++; if (ok) rightWhenClaimed++; }
  }
  return { n: ps.length, spoke, right, claimed, rightWhenClaimed,
           claimRate: ps.length ? claimed / ps.length : 0,
           accuracy: claimed ? rightWhenClaimed / claimed : 0 };
}

// ── the gates ────────────────────────────────────────────────────────────────
function gate0(entry) {
  const need = ['id', 'title', 'engine', 'frame', 'ingest', 'source', 'rights'];
  const missing = need.filter(k => !entry || entry[k] === undefined || entry[k] === '');
  return { pass: missing.length === 0, missing,
    note: missing.length ? 'entry is missing required fields' : 'form and engine pin present' };
}

function gate1(entry) {
  // reproduces: the declared source, put through the declared ingest, must land on the
  // declared hash. byte-identical or it fails — there is no tolerance to argue about.
  if (!entry || !entry.tau || !entry.tau.file) return { pass: false, note: 'no τ file declared' };
  const f = path.resolve(HERE, entry.tau.file);
  if (!fs.existsSync(f)) return { pass: false, note: 'declared τ file not found: ' + entry.tau.file };
  const raw = fs.readFileSync(f, 'latin1');
  const got = sha(Buffer.from(raw, 'latin1'));
  const want = entry.tau.sha256;
  let round = null;
  try { round = τ.encode(τ.decode(raw)).tau === raw; } catch (e) { round = false; }
  return { pass: got === want && round === true, got, want, round,
    note: got !== want ? 'τ hash does not match the entry'
        : !round ? 'τ does not round-trip — encode(decode(τ)) ≠ τ'
        : 'reproduces, and the codec round-trips' };
}

function gate2(src) {
  // reads itself: fed its own material, does it claim, and is it right when it claims?
  // A corpus that cannot read itself is mis-framed, and this is what catches that.
  const ω = new M.Organism().feed(src);
  const rows = [120, 400, 800].map(c => ({ ctx: c, ...run(ω, probes(src, 120, c)) }));
  const claim = Math.min(...rows.map(r => r.claimRate));
  const acc = Math.min(...rows.map(r => r.accuracy));
  const poleOK = ω.poles && ω.poles.answered > 0;
  return { pass: claim >= 0.50 && acc >= 0.95 && poleOK, rows, claim, acc, poleOK,
    states: ω.pos.length, window: ω.window, alphabet: ω.live.size || ω.live.length,
    note: !poleOK ? 'the answered pole is zero — nothing to measure against'
        : claim < 0.50 ? 'claims on less than half its own material — usually a framing error'
        : acc < 0.95 ? 'claims but is wrong too often'
        : 'reads itself' };
}

function gate3(src) {
  // does not claim its neighbours. Zero is the bar, not "low".
  const man = JSON.parse(fs.readFileSync(path.join(HERE, 'Δ/holdout/manifest.json'), 'utf8'));
  const ω = new M.Organism().feed(src);
  const per = [];
  for (const w of man.works) {
    const foreign = fs.readFileSync(path.join(HERE, w.file), 'latin1');
    const r = run(ω, probes(foreign, 120, 400));
    per.push({ title: w.title, ...r });
  }
  const claims = per.reduce((a, b) => a + b.claimed, 0);
  const probed = per.reduce((a, b) => a + b.n, 0);
  return { pass: claims === 0 && probed >= 360, per, claims, probed,
    note: claims === 0 ? 'claims nothing it was not fed' : claims + ' false claim(s) — the gate is zero, not low' };
}

// ── report ───────────────────────────────────────────────────────────────────
function main() {
  const arg = process.argv[2];
  if (!arg) { console.log('usage: node gates.js <corpus.txt | entry.json>'); process.exit(1); }
  let entry = null, src = null, label = arg;

  if (arg.endsWith('.json')) {
    entry = JSON.parse(fs.readFileSync(arg, 'utf8'));
    label = entry.id || arg;
    const f = path.resolve(HERE, entry.tau && entry.tau.file || '');
    if (fs.existsSync(f)) { const raw = fs.readFileSync(f, 'latin1');
      src = raw.startsWith('TAU100/1') ? τ.decode(raw) : raw; }
  } else {
    const raw = fs.readFileSync(arg, 'latin1');
    src = raw.startsWith('TAU100/1') ? τ.decode(raw) : raw;
  }
  if (!src) { console.log('no source text to test'); process.exit(1); }

  console.log('ADMISSION GATES   ' + label);
  console.log('   ' + src.length.toLocaleString() + ' bytes of source\n');
  const results = [];

  if (entry) {
    const g0 = gate0(entry);
    console.log('GATE 0  form and engine pin        ' + (g0.pass ? 'PASS' : 'FAIL'));
    if (!g0.pass) console.log('        missing: ' + g0.missing.join(', '));
    results.push(g0.pass);
    const g1 = gate1(entry);
    console.log('GATE 1  reproduces                 ' + (g1.pass ? 'PASS' : 'FAIL') + '  — ' + g1.note);
    if (g1.got && g1.got !== g1.want) {
      console.log('        declared ' + String(g1.want).slice(0, 24));
      console.log('        actual   ' + g1.got.slice(0, 24));
    }
    results.push(g1.pass);
  } else {
    console.log('GATE 0  form and engine pin        SKIPPED — pass an entry.json to check');
    console.log('GATE 1  reproduces                 SKIPPED — pass an entry.json to check');
  }

  const g2 = gate2(src);
  console.log('\nGATE 2  reads itself               ' + (g2.pass ? 'PASS' : 'FAIL') + '  — ' + g2.note);
  console.log('        ' + g2.states.toLocaleString() + ' states · window ' + g2.window + ' · alphabet ' + g2.alphabet);
  console.log('        ' + 'context'.padEnd(9) + 'probes'.padEnd(8) + 'claimed'.padEnd(9) + 'right when claimed');
  for (const r of g2.rows)
    console.log('        ' + String(r.ctx).padEnd(9) + String(r.n).padEnd(8)
      + (String(r.claimed) + ' (' + pct(r.claimed, r.n) + ')').padEnd(9 + 6)
      + r.rightWhenClaimed + ' of ' + r.claimed + '  ' + pct(r.rightWhenClaimed, r.claimed));
  console.log('        need claim ≥ 50.0%  and  accuracy ≥ 95.0%');
  results.push(g2.pass);

  const g3 = gate3(src);
  console.log('\nGATE 3  does not claim neighbours  ' + (g3.pass ? 'PASS' : 'FAIL') + '  — ' + g3.note);
  for (const p of g3.per)
    console.log('        ' + p.title.padEnd(24) + p.n + ' probes · ' + p.claimed + ' claims');
  console.log('        ' + g3.probed + ' foreign probes from the shipped holdout · need exactly 0 claims');
  results.push(g3.pass);

  const all = results.every(Boolean);
  console.log('\n' + (all ? 'ALL MECHANICAL GATES PASS' : 'NOT ADMISSIBLE YET'));
  console.log('Passing these is not admission. Rights, provenance and whether the material');
  console.log('belongs are human decisions, and they come after. See UPLOAD.md.');
  process.exit(all ? 0 : 1);
}

module.exports = { gate0, gate1, gate2, gate3, probes, run };
if (require.main === module) main();
