# Crawling addendum — `1 | RH | 1`, no explicit negative state — 2026-08-19

This checkpoint freezes the representation immediately before removing `T` from the reduced RH form.

## Remove explicit `-1`

Do not represent opposed relations as scalar states

```text
-1 | 0 | +1.
```

Instead use one positive relational magnitude with orientation carried separately:

```text
1_L | 0 | 1_R.
```

Thus negative is not treated as a separate place/state in this reduced ADO representation. Opposedness is encoded by orientation/relationship.

At the `.01` scale the analogous form is

```text
.01_L | 0 | .01_R.
```

The bilateral opening remains

```text
.01 + .01 = .02.
```

## RH-centered compression

Normalize the invariant middle as

```text
050 -> 1/2.
```

The reduced candidate grammar is

```text
1_L | RH | 1_R
```

with the RH middle represented, before T removal, as

```text
1_L | (050 + iT) | 1_R.
```

Equivalently in normalized mathematical notation:

```text
1_L | (1/2 + iT) | 1_R.
```

The two outer `1` entries are the same positive relational magnitude in opposite orientations, not arithmetic `+1` and `-1` values.

## Swap property

Before T is removed, the outer orientations may exchange through the trajectory operation while the middle remains invariant:

```text
1_L <-> 1_R
```

with the middle fixed at the normalized `050` real coordinate.

This preserves the distinction:

```text
same magnitude + different orientation != different signed scalar states.
```

## What is being frozen

The compact candidate representation is

```text
1 | RH | 1
```

where:

```text
left 1  = one relational magnitude, left/opposed orientation
RH      = invariant middle / critical-line object
right 1 = same relational magnitude, right/opposed orientation
```

This is an ADO representation of reflection/closure geometry. It is not a conventional statement that the Riemann Hypothesis literally equals the arithmetic tuple `(1,1/2,1)`.

## Next requested reduction

The next operation is to **remove T** from this reduced representation and determine what invariant/static object remains, rather than retaining `iT` by assumption.

Do not silently reintroduce an explicit negative state during that reduction.

## Status

```text
Checkpoint: Crawling addendum
Representation: 1_L | RH | 1_R
Explicit -1 state: removed
Opposition encoding: orientation, not sign
Middle before T removal: 050+iT / 1/2+iT
Next step: remove T and derive the remaining static invariant
RH proof status: NOT PROVED
```
