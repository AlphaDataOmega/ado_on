# Adding a corpus

Δ holds catalogue entries — `V·001`, `V·002`, … — each one τ written in base 100,
the field's own format. An author keeps their prefix; the number is the entry.

To add one:

## 1. Encode it

    node τ.js path/to/your.txt        # reports size, states, window, round trip
    node -e "const fs=require('fs'),τ=require('./τ.js');
      const r=τ.encode(fs.readFileSync('path/to/your.txt','latin1'));
      fs.writeFileSync('Δ/YOU·001', r.tau, 'latin1')"

Read the source as **latin1**, not utf8 — see ENCODING.md. Ω is byte-oriented, so utf8
decoding silently truncates every multi-byte character and the round trip will not close.

`τ.js` will tell you whether the round trip is lossless. If it is not, do not open the PR.

## 2. Check it holds

    LEDGER=./Δ node ⊕.js

A corpus is worth adding if the poles separate on it. Watch two things:

- **the answered pole must lift off zero.** If it reads `0.0000` the ledger is too small
  for the window to become measurable — a thinning still contains exact matches, and
  `1.000/1.000` there is vacuous, scored in a space with no room to be wrong in.
- **recall and abstention across context lengths.** A corpus that only works at one
  length is calibrated, not coherent.

## 3. Add the entry

`Δ/corpora.json` — id, title, author, file, bytes, sha256, states, window, and one
honest line about what it is.

## 4. The doorway

**A PR passes by exceeding 3 × ½.**

That is the same doorway the field uses: 1.5 sits between 1 and 2, so it can never be
*met*, only exceeded — passage is always strictly two of three. Two approving reviewers
carry it; one does not, however enthusiastic.

The rule is not a governance preference. It is the constant the code already runs on.

## What will get a PR refused

- A corpus that is not yours to redistribute.
- A round trip that does not close.
- An answered pole on the origin.
- Numbers reported at a single context length.
