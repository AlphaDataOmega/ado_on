# ADO chemistry walk checkpoint — 2026-08-19

This checkpoint freezes the current nested field/address interpretation before walking it backward and forward against chemistry and physics. It supersedes any earlier wording that treated `060 | 050 | 060` as the Null door itself.

## Critical correction

```text
050 = internal Null / floor / seam at this address level
060 = first post-seam / bifurcated scalar address
060 | 050 | 060 = completed symmetric bubble off the zero line
```

The whole `060 | 050 | 060` object is therefore **not** the Null door. The Null/floor is internal to it.

Orientation is separate from scalar projection. Centering the two outer `060` fields on the middle `050` gives magnitude `010` on each side, with opposite orientations:

```text
scalar projection:   060 | 050 | 060
centered/oriented:  -010 | 000 | +010
normalized:           -1 |  0  | +1
```

Thus the completed bubble can have zero net oriented displacement while retaining nonzero internal relation:

```text
-010 + +010 = 0
|-010| + |+010| = 020 > 0.
```

This is another instance of `net zero != empty field`.

## Nested field hierarchy

The current encoding is recursive:

```text
signed digit field
  -> digit relationship / sound
  -> base-100 field
  -> three-base-100 trajectory field (trit)
  -> tile / larger field
  -> face
  -> shadow / contained RF
  -> next encapsulation.
```

Each level is a field and can become one addressed component of the next level.

## Three-position trajectory field

The three base-100 positions are currently interpreted as an ordered trajectory field rather than a flat Cartesian `(x,y,z)` triple:

```text
[history | NOW | future].
```

The outer states can carry opposite orientation around the current/frozen state. A rolling update advances the window:

```text
[B_(n-1), B_n, B_(n+1)]
  ->
[B_n, B_(n+1), B_(n+2)].
```

The occupied middle is a role/reference, not an additional independently moving object.

## Digit-scale nesting

Successive digit positions operate at successively finer scale. Provisional base-ten scale relation:

```text
s_(k+1) = s_k / 10.
```

A digit therefore carries both value and scale/address depth. A completed quantity at one scale can become the one/reference at the next:

```text
1_n + 9_n = 10_n
10_n -> 1_(n+1).
```

The residual/tail is not erased; it becomes finer address history.

## Three-field scale passage

The current scale-path example is

```text
1 : 10 : 100
  ->
100 : 10 : 100
  ->
100 : 10 : 1.
```

Normalized by the invariant middle `10`:

```text
0.1 : 1 : 10
  ->
10 : 1 : 10
  ->
10 : 1 : 0.1.
```

The center remains the reference while the outer scale relation transfers/inverts through forward T. The reciprocal outer relation satisfies

```text
0.1 * 10 = 1.
```

This is a scale-transfer representation, not literal time reversal.

## Seven / six / center topology

The current split-open seven-field picture is

```text
7 = 3 + 1 + 3.
```

Interpretation:

```text
3 previous/inverted relations
1 occupied/shrinking scale reference
3 future/uninverted relations.
```

The six active oriented relations are

```text
6 = 3 + 3 = 3 * 2
```

around one center/reference.

## Digit 5 and digit 6 seam

At one digit scale, `5` is the midpoint of the `0..10` completion interval and `6` is the first discrete address after that midpoint:

```text
0 -> ... -> 5 -> 6 -> ... -> 10 -> 1_(next scale).
```

The arithmetic inversion pairs around 5 are

```text
1 <-> 9
2 <-> 8
3 <-> 7
4 <-> 6
```

and each pair sums to 10.

The exact midpoint between 5 and 6 is ordinary scalar `5.5`. In the proposed three-field representation, the half-step is provisionally represented as a symmetric three-channel Null relation

```text
050 | 050 | 050.
```

This field representation is an ADO encoding hypothesis and must not be confused with the scalar arithmetic value itself.

## Digit field / sound construction

A digit may generate a local relational field from its endpoint and center. Example for digit 6:

```text
0 -> 3 -> 6
```

because

```text
(0 + 6) / 2 = 3.
```

Thus `3` can arise relationally from the span `0..6`, rather than being separately inserted. The local interval relation is `3 : 3` around the center.

Adjacent digit-fields chain by passing the prior future endpoint into the next field at finer scale. This is the current candidate bridge from numeric address to harmonic/sound trajectory.

## Chemistry-side walk: boron to carbon

The current correspondence hypothesis begins at the ordinary atomic-number seam:

```text
Boron  Z = 5
Carbon Z = 6.
```

Do not treat numerical correspondence as proof of physical identity.

The working ADO hypothesis is:

```text
5 = floor/seam role at the elemental-address level
6 = first post-seam / completed-bubble role
```

with candidate carbon field projection

```text
060 | 050 | 060.
```

Again, this address is a prediction/hypothesis to test against chemistry, not an established carbon encoding.

## Independent chemistry structures to compare

Known atomic structure supplies an independent comparison path. In the `p` subshell there are three orbital projections and two electron-spin projections, giving six one-electron microstate slots:

```text
3 * 2 = 6.
```

The ADO side independently contains

```text
3 relations * 2 orientations = 6.
```

This shared combinatorial structure is a correspondence target, not yet an identification of ADO orientation with electron spin or orbital magnetic quantum number.

The periodic-table walk must be frozen from the ADO side before using later elements as validation targets.

## Floor and door distinction

The Null/floor is a transition seam between descriptions/scales:

```text
floor from the higher-scale description
=
door into the lower/finer-scale description.
```

A higher-scale identity may break while lower-scale conserved/relational invariants survive. This does not imply any physical element is indestructible.

## Boron hypothesis status

Several exploratory statements have associated boron with the `5`/floor relation. These remain hypotheses. In particular, do **not** freeze the claims that:

```text
boron is physically indestructible;
boron is the only physically moving element;
050|050|050 is proven to be boron;
boron is proven to be a physical TELE material.
```

The testable version is narrower: derive the ADO elemental-address walk independently, then determine whether boron occupies a unique floor/invariant role when compared blind against measured atomic/nuclear structure.

## Current checkpoint for the backward walk

Freeze the following distinction before proceeding:

```text
050                 = internal floor / Null seam
050|050|050         = proposed symmetric three-field Null representation
060                 = first post-seam scalar address
060|050|060         = completed symmetric bubble off the zero line
-010|000|+010       = centered/oriented representation of that bubble
```

The next walk should use this tiny structure as a seed and follow the same nested signed-digit, scale, R4, pressure, and harmonic rules backward and forward without changing the encoding to fit chemistry after the fact.

## Falsification rule

If the frozen ADO walk fails to reproduce independently known structural transitions in subsequent elements, revise/reject the elemental correspondence rather than modifying the address law element by element.
