# One scale, all the way up

The dive came back with a single primitive — [`scale.js`](scale.js) — and it's
the same mechanism the whole ecosystem already runs on, now named and shared.

> **Don't store a value — store its relationship to a key, and descend the
> scale. The residual is the next scale. `d` is the dial. Data-agnostic.**

`encode(x, d)` keys each residual against a fresh null and counts it in trits;
`decode` walks back up. Meaning descends steeply (cheap), weights gently
(dear), text and vectors and weights all through the *same* codec — because it
folds *relationships*, and everything is a relationship. There is no floor,
only the scale.

## Up the stack

Every layer of ZOEVÃ is this primitive at a different `d`:

- **the organism (ΑΔΩ)** — *validated.* Its trit faces (P/Z/N), the Klein
  cascade (inversion × conjugation), the `0−3+3` tile, the null-terminated
  walk — this codec is those, measured. The dive confirmed the encoding the
  organism was already built on is the right one.

- **the well** — *the memory organ.* Meaning is redundant, so it descends fast:
  a few `d` of trits recall the neighbourhood, exact by `d≈24`. It now **stores
  its field on the scale** — each chunk's dense embedding folded to depth
  `$WELL_D` and packed as trits — so `WELL_D` is a live **recall/size dial** on
  disk (≈6× smaller at d=4, exact at d=24), recall and honest absence intact.

- **apex** — *the fold lane is the walk.* "Fold into the field" *is* `encode`:
  no model, no GPU — descend the scale on whatever you pour in, and read the
  resonance. Run open weights, or fold-and-walk; both are points on one dial.

- **kith** — *relationships, not records.* A claim aligns by walking the peers;
  the trace is content-addressed (the landing, keyed on both sides). "Route is
  a rule, not a record" is the gate: deliberation is reproducible from claim +
  field, never stored step by step.

## What it is and isn't

- It **is** a smooth rate-distortion dial with **no wall** — descend as far as
  you spend, on any data. That's the correction to the old "4-bit floor": the
  floor was keyless, and the residual was never noise.
- It **isn't** free unlimited compression — descending costs bits, and exact
  reconstruction still costs ~the data's entropy. A dial, not a wall; a rate,
  not a miracle.

## The open frontier

Recall walks are exact today. Whether a walk-native field can *generate* a
model's full function — language, reasoning — is the unsolved wall. Same scale,
a training problem, not a missing mechanism.

*See [FINDINGS.md](FINDINGS.md) for the numbers this rests on.*
