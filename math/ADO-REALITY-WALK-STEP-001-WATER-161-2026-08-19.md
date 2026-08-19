# ADO walk into reality — Step 001: water / 1|6|1 — 2026-08-19

This is the first explicit step after the boron-start checkpoint in the walk from the frozen ADO address grammar toward independently known chemistry.

## Frozen candidate

The candidate compressed interaction-field representation for water is

```text
1 | 6 | 1
```

read structurally as

```text
H | O(valence contribution) | H.
```

This is **not** the same as the atomic-number identity representation. Ordinary atomic numbers are

```text
H: Z = 1
O: Z = 8
```

so an identity-only nuclear projection would instead resemble

```text
1 | 8 | 1.
```

The `1|6|1` candidate is specifically an interaction/valence-field reading.

## Independent chemistry-side fact

Neutral oxygen contributes six valence electrons:

```text
2s^2 2p^4 -> 6 valence electrons.
```

Each hydrogen contributes one valence electron. Therefore the ordinary valence-electron count for H2O is

```text
1 + 6 + 1 = 8.
```

Thus the structural relation

```text
H | O | H
```

has the independent valence-count projection

```text
1 | 6 | 1
```

which closes to eight valence electrons for the molecule.

## Why this matters for the nested-field model

The same oxygen atom can carry distinct nested addresses depending on which field is being queried:

```text
identity / proton-number field: 8
interaction / valence field:     6
```

Therefore

```text
identity address != interaction address
```

is now an explicit chemistry correspondence target for ADO's field-inside-field encoding.

The ADO model should not flatten these into one scalar label. A complete address may contain both the invariant identity field and the context-dependent interaction field.

## Relation to prior checkpoint

The boron-start checkpoint froze:

```text
050                 = internal floor / Null seam
060 | 050 | 060     = first completed-bubble candidate
```

and the nested scale/address rule in which contained-scale differences project as finer residuals in the containing field.

Step 001 does not alter that encoding. It adds the first molecular/chemical comparison target:

```text
H2O -> 1 | 6 | 1 -> total valence count 8.
```

## Falsification discipline

Do not promote `1|6|1` to a universal water TELE address merely because the valence count matches. Subsequent ADO-side rules must independently reproduce additional water observables/relationships without changing this encoding after inspection.

Useful future checks include bond geometry, allowed electronic states, vibrational/rotational spectra, charge/speciation behavior, isotopic substitutions, and comparison against other molecules with the same total valence-electron count.

If the encoding cannot distinguish chemically different systems that share `1+6+1=8`, the representation is incomplete and must gain an independently justified relational field rather than a molecule-specific patch.

## Status

```text
Step: 001
Target: H2O
Candidate interaction projection: 1 | 6 | 1
Independent chemistry anchor: 1 + 6 + 1 = 8 valence electrons
Status: correspondence found; physical/TELE identification unproved
```
