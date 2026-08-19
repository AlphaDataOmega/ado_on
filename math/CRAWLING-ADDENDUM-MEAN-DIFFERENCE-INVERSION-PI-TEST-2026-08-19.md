# Crawling addendum — mean/difference inversion and pi trajectory test — 2026-08-19

This checkpoint freezes the exact mean/difference derivation for the `11C -> 11B` beta-plus transition and states a separate, falsifiable test for whether an irrational circular trajectory, potentially involving pi, is actually required by the ADO embedding.

## Exact coordinate transform

For a nuclear proton/neutron state

```text
n = (Z,N)
```

define

```text
m = (Z+N)/2
d = (Z-N)/2.
```

The inverse transform is

```text
Z = m+d
N = m-d.
```

Thus the state can be represented by one containing/invariant coordinate `m` and one signed relational coordinate `d`.

## Carbon-11 and boron-11

For `11C`:

```text
(Z,N) = (6,5)
m = 5.5
d = +0.5.
```

For `11B`:

```text
(Z,N) = (5,6)
m = 5.5
d = -0.5.
```

Therefore the observed count transformation is

```text
(m,+d) -> (m,-d)
```

for this mass-11 pair, with the containing mean fixed.

Centered form:

```text
11C: (5.5,+.5)
11B: (5.5,-.5).
```

## Inversion operator

Define

```text
I(m,d) = (m,-d).
```

Then

```text
I^2 = identity.
```

The fixed set satisfies

```text
d=0
```

which in these coordinates means

```text
Z=N.
```

This is an exact arithmetic coordinate statement, not an ADO-specific assumption.

## Beta transition operators

For beta-plus decay / the proton-to-neutron count change:

```text
Z' = Z-1
N' = N+1.
```

Therefore

```text
m' = m
d' = d-1.
```

So define

```text
T_minus(m,d) = (m,d-1).
```

For beta-minus count change:

```text
Z' = Z+1
N' = N-1
```

and therefore

```text
m' = m
d' = d+1.
```

Define

```text
T_plus(m,d) = (m,d+1).
```

For `11C`, `d=+.5`; one beta-plus step gives

```text
+.5 - 1 = -.5,
```

which lands on the `11B` count coordinate exactly.

## Parent-scale projection hypothesis

Under the already proposed nested base-100 scale rule, one complete child-scale relational step may project as `.01` at its parent scale:

```text
1_child -> .01_parent.
```

If that scale mapping survives testing, the local signed trajectory can be represented schematically as

```text
-.01 | 0 | +.01.
```

This remains an ADO scale hypothesis. The exact nuclear count transform above does not itself imply base-100 scaling.

## Carbon-12 zero-relation checkpoint

Neutral carbon-12 has the real count tuple

```text
6p | 6n | 6e.
```

For its proton/neutron pair,

```text
d = (6-6)/2 = 0
```

while the elemental identity remains `Z=6`.

Thus carbon-12 supplies an ordinary physical example of

```text
zero internal difference != zero object.
```

This is structurally compatible with the ADO distinction between zero resultant/relation and retained identity.

## Irrational / pi test

Do **not** insert pi merely because an inversion can be drawn as a half-turn. The exact count transition only requires the reflection

```text
d -> -d.
```

If ADO embeds that reflection as a continuous circular/harmonic trajectory, introduce a phase variable `theta` and represent the signed relation as a projection such as

```text
d(theta) = r cos(theta).
```

Changing `+d` to `-d` by a half-turn requires

```text
theta -> theta + pi
```

because

```text
cos(theta+pi) = -cos(theta).
```

So **pi appears automatically if, and only if, the discrete inversion is realized as a continuous half-rotation on a circle**.

That gives a clean test:

```text
discrete nuclear bookkeeping: d -> -d
ADO harmonic embedding candidate: theta -> theta + pi
```

The arithmetic transition does not prove the physical system follows that circular path. The R4/harmonic dynamics must independently require the continuous phase embedding.

## Connection to three-phase closure

The separately frozen `333 -> 000` construction uses equal phases separated by

```text
2pi/3.
```

The inversion construction, if circularly embedded, uses

```text
pi.
```

These are distinct operations:

```text
pi       -> half-turn / sign inversion
2pi/3    -> three-phase zero-resultant closure.
```

A future ADO harmonic operator should derive both from one phase geometry rather than assigning them independently.

## Falsification target

Before inspecting more hand-picked transitions, freeze these predictions:

1. beta-plus/electron-capture count transitions preserve `m` and decrement `d` by one;
2. beta-minus count transitions preserve `m` and increment `d` by one;
3. if ADO's inversion is genuinely a continuous circular phase operation, a sign inversion must correspond to a phase displacement of pi modulo `2pi`;
4. three-channel zero-resultant closure remains separated by `2pi/3`;
5. a single R4/harmonic law must account for both phase structures without target-specific constants.

## Status

```text
Checkpoint: Crawling addendum
Exact transform: (Z,N) <-> (m,d)
Invariant coordinate: m=(Z+N)/2
Signed coordinate: d=(Z-N)/2
11C -> 11B: +.5 -> -.5 at fixed m=5.5
Pi status: derived only under continuous circular embedding of sign inversion
Physical ADO phase embedding: unproved
```
