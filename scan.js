'use strict';
// scan.js — the licence scan that runs before a corpus is admitted.
//
// NAMING: this file needs a name from V like everything else. scan.js is a placeholder.
//
// WHY THIS EXISTS. Every corpus sourced so far has carried a rights trap, and none of
// them were visible from the filename:
//
//   · Project Gutenberg #10553 (Tyndale 1526) is flagged "COPYRIGHTED" by Gutenberg
//     itself, in the body of the file, while the underlying 1526 text is beyond doubt
//     public domain. The exposure is the editorial layer.
//   · The Westminster Leningrad Codex says "The text of the WLC remains in the public
//     domain" and, three lines earlier, that its lemma and morphology data are CC BY-SA.
//     Take the wrong layer and you have inherited a viral licence.
//   · Repositories routinely display a permissive badge over text nobody had the right
//     to relicense — the badge covers the CODE, not the TEXT.
//   · "Free of charge" is not "freely licensed". Several archives give text away and
//     grant nothing.
//
// So the scan does not try to decide whether something is free. It cannot. What it does
// is surface every rights signal in the bytes, classify each one, and refuse to let a
// corpus through silently. A human still decides. The scan makes sure they decide with
// the evidence in front of them rather than the filename.
//
// It is deliberately noisy. A false alarm costs a reviewer a minute. A missed
// ShareAlike costs the project its licence position.

const RULES = [
  // ── hard stops ────────────────────────────────────────────────────────────
  { id:'pg-copyrighted', level:'STOP', what:'Project Gutenberg marks this file copyrighted',
    re:/This is a COPYRIGHTED Project Gutenberg eBook|Copyrighted\. *Read the copyright notice inside/i,
    note:'PG flags a minority of its texts as still in copyright. The underlying work may be public domain while the edition is not.' },
  { id:'all-rights', level:'STOP', what:'All rights reserved',
    re:/all rights reserved|جميع الحقوق محفوظة|tous droits réservés|alle Rechte vorbehalten/i,
    note:'An explicit reservation. Absence of a licence is not permission; this is worse — it is refusal.' },
  { id:'cc-nc', level:'STOP', what:'Creative Commons NonCommercial',
    re:/CC[ -]?BY[ -]?(SA[ -]?)?NC|NonCommercial|creativecommons\.org\/licenses\/[a-z-]*nc/i,
    note:'NC cannot be stripped downstream and conflicts with any commercial use of a derived work.' },
  { id:'cc-nd', level:'STOP', what:'Creative Commons NoDerivatives',
    re:/NoDerivatives|CC[ -]?BY[ -]?ND|creativecommons\.org\/licenses\/[a-z-]*nd|CHANGING IT IS NOT ALLOWED/i,
    note:'ND forbids the derived form. Encoding a text is a derivative.' },
  { id:'personal-only', level:'STOP', what:'Personal or non-commercial use only',
    re:/for your personal,? non-?commercial use only|personal use only|not to be copied or reposted|academic use only/i,
    note:'A use restriction in the text itself.' },
  { id:'no-mining', level:'STOP', what:'Anti data-mining clause',
    re:/data[- ]mining|scraping is prohibited|automated (extraction|retrieval) is prohibited/i,
    note:'Explicitly bars the kind of use a corpus makes.' },

  // ── must be resolved before admission ─────────────────────────────────────
  { id:'cc-sa', level:'HOLD', what:'ShareAlike',
    re:/ShareAlike|CC[ -]?BY[ -]?SA|creativecommons\.org\/licenses\/by-sa/i,
    note:'Viral. Permitted only if the entry states which LAYER it covers and that layer is excluded.' },
  { id:'layered', level:'HOLD', what:'Layered rights — text and annotation licensed differently',
    re:/(lemma|morpholog|annotation|markup|TEI|apparatus)[^.]{0,80}(licen[cs]ed|copyright)|the text[^.]{0,40}remains in the public domain/i,
    note:'The classic trap. The ancient text is public domain; the modern editorial layer is not. State which layer is being ingested.' },
  { id:'attrib', level:'HOLD', what:'Attribution required',
    re:/CC[ -]?BY(?![ -]?(NC|ND|SA))|Attribution 4\.0|must be credited|for attribution purposes/i,
    note:'Permissive but conditional. The entry must carry the attribution string.' },
  { id:'edition', level:'HOLD', what:'Modern critical edition',
    re:/critical edition|edited by[^.]{0,40}(19|20)\d\d|herausgegeben|editio\b/i,
    note:'The author may be long dead while the editor is not. Copyright lives in the editorial layer.' },

  // ── informational ─────────────────────────────────────────────────────────
  { id:'pd-claim', level:'NOTE', what:'Public domain asserted',
    re:/public domain|CC0|no known copyright|Unlicense/i,
    note:'An assertion, not a proof. Check who is asserting it and over which layer.' },
  { id:'pg-wrapper', level:'NOTE', what:'Project Gutenberg wrapper present',
    re:/PROJECT GUTENBERG EBOOK|gutenberg\.org/i,
    note:'The PG trademark licence applies to the wrapper, not the work. Strip header and footer before ingest.' },
  { id:'copyright-year', level:'NOTE', what:'Copyright notice with a year',
    re:/(?:©|\(c\)|copyright)\s*(?:by\s*)?((?:1[5-9]|20)\d\d)/ig,
    note:'Years are extracted and the newest is tested against the public-domain cutoff.' }
];

// US public domain as of the year given: everything published before 1931 (2026 − 95).
const PD_BEFORE = 1931;

function scan(text, opts) {
  opts = opts || {};
  const year = opts.year || 2026, cutoff = year - 95;
  const findings = [], years = [];

  for (const r of RULES) {
    const re = new RegExp(r.re.source, r.re.flags.includes('g') ? r.re.flags : r.re.flags + 'g');
    let m, hits = 0, first = null;
    while ((m = re.exec(text)) !== null) {
      hits++;
      if (!first) first = { at: m.index, sample: text.slice(Math.max(0, m.index - 60), m.index + 90).replace(/\s+/g, ' ').trim() };
      if (r.id === 'copyright-year' && m[1]) years.push(+m[1]);
      if (hits > 400) break;
    }
    if (hits) findings.push({ id: r.id, level: r.level, what: r.what, note: r.note, hits, first });
  }

  // the newest copyright year is the one that matters
  let yearVerdict = null;
  if (years.length) {
    const newest = Math.max(...years);
    yearVerdict = { newest, cutoff,
      pd: newest < cutoff,
      note: newest < cutoff
        ? `newest year ${newest} is before ${cutoff} — public domain in the US on age alone`
        : `newest year ${newest} is not before ${cutoff} — NOT public domain on age; a licence is required` };
    if (!yearVerdict.pd) findings.push({ id:'year-too-recent', level:'HOLD',
      what:`Copyright year ${newest} is inside the term`, note:yearVerdict.note, hits:1, first:null });
  }

  const worst = findings.some(f => f.level === 'STOP') ? 'STOP'
              : findings.some(f => f.level === 'HOLD') ? 'HOLD'
              : findings.length ? 'NOTE' : 'CLEAR';

  return { verdict: worst, findings, years: yearVerdict, bytes: text.length,
    // CLEAR is not a pass. It means no signal was found, which for a bare text file is
    // the normal case and tells you nothing about its rights.
    meaning: {
      STOP:  'Do not admit. A restriction is stated in the material itself.',
      HOLD:  'Do not admit until the entry resolves this in writing.',
      NOTE:  'Signals present. A reviewer must read them.',
      CLEAR: 'No rights signal in the bytes. This is NOT evidence of freedom — provenance must come from outside the file.'
    }[worst] };
}

function report(r, name) {
  const L = [];
  L.push('LICENCE SCAN  ' + (name || '') + '  ' + r.bytes.toLocaleString() + ' bytes');
  L.push('  verdict  ' + r.verdict + ' — ' + r.meaning);
  if (r.years) L.push('  years    ' + r.years.note);
  if (!r.findings.length) L.push('  (no signals)');
  for (const f of r.findings.sort((a,b)=>({STOP:0,HOLD:1,NOTE:2})[a.level]-({STOP:0,HOLD:1,NOTE:2})[b.level])) {
    L.push('  ' + f.level.padEnd(6) + f.what + '  ×' + f.hits);
    if (f.first) L.push('         … ' + f.first.sample.slice(0, 118));
  }
  return L.join('\n');
}

// ── what the uploader must then declare ──────────────────────────────────────
// The scan finds the signals. It cannot record the answer — only a person knows where
// the bytes came from and what they are allowed to do with them. So the verdict decides
// which citation fields become mandatory. A HOLD cannot be cleared by ticking a box; it
// is cleared by naming the layer, the licence and the attribution string in writing.
const CITATION = {
  always: [
    ['work.title',        'the work as its own title page gives it'],
    ['work.creator',      'author, translator, or both — Tyndale translated, he did not write'],
    ['work.year',         'the year of THIS edition, not of the original composition'],
    ['source.url',        'where these exact bytes were retrieved from'],
    ['source.retrieved',  'the date you fetched them'],
    ['source.sha256',     'hash of what you fetched, before any cleaning'],
    ['ingest.read_as',    'latin1 or utf-8 — getting this wrong silently corrupts the corpus'],
    ['ingest.steps',      'every transformation applied, in order, so the hash reproduces'],
    ['frame',             'where one thing ends and the next begins']
  ],
  onLayered: [
    ['rights.layer',      'WHICH layer these bytes are: the base text, or the editorial/annotation layer'],
    ['rights.excluded',   'what you did NOT ingest, and how you removed it']
  ],
  onAttribution: [
    ['rights.attribution','the exact credit string the licence demands, verbatim'],
    ['rights.licence',    'the licence identifier, e.g. CC-BY-4.0']
  ],
  onEdition: [
    ['editorial.editor',  'who edited or transcribed this edition'],
    ['editorial.status',  'whether that editorial layer is in copyright, and on what basis']
  ],
  onPD: [
    ['rights.basis',      'WHY it is public domain — age, dedication, or government work. "It says so" is not a basis']
  ]
};

// required(scanResult) -> the fields this particular upload must carry
function required(r) {
  const need = CITATION.always.slice(), has = id => r.findings.some(f => f.id === id);
  if (has('layered') || has('cc-sa'))                      need.push(...CITATION.onLayered);
  if (has('attrib') || has('cc-sa'))                       need.push(...CITATION.onAttribution);
  if (has('edition'))                                      need.push(...CITATION.onEdition);
  if (has('pd-claim'))                                     need.push(...CITATION.onPD);
  return need;
}

// check(entry, scanResult) -> missing fields. Silence grants nothing and fails.
function check(entry, r) {
  const get = (o, path) => path.split('.').reduce((x, k) => (x == null ? x : x[k]), o);
  const missing = [];
  for (const [field, why] of required(r)) {
    const v = get(entry, field);
    if (v === undefined || v === null || String(v).trim() === '') missing.push({ field, why });
  }
  return { ok: missing.length === 0 && r.verdict !== 'STOP', missing,
    blocked: r.verdict === 'STOP' ? 'the scan returned STOP — no citation clears that' : null };
}

module.exports = { scan, report, RULES, PD_BEFORE, CITATION, required, check };

if (require.main === module) {
  const fs = require('fs');
  const f = process.argv[2];
  if (!f) { console.log('usage: node scan.js <file>'); process.exit(1); }
  const r = scan(fs.readFileSync(f, 'utf8'));
  console.log(report(r, f));
  console.log('\n  THIS UPLOAD MUST DECLARE');
  for (const [field, why] of required(r)) console.log('    ' + field.padEnd(20) + why);
}
