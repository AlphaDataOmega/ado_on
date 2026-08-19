# Crawling addendum — carbon-11 to boron-11 inversion — 2026-08-19

This checkpoint records a real nuclear transformation that is unusually useful for testing the frozen ADO `5 <-> 6` inversion grammar.

## Measured nuclear transition

Carbon-11 undergoes positron beta decay to boron-11:

```text
11C -> 11B + e+ + nu_e
```

At the proton/neutron bookkeeping level:

```text
11C: 6 protons, 5 neutrons
11B: 5 protons, 6 neutrons
```

so the nuclear count pair changes as

```text
(6,5) -> (5,6)
```

while the mass number remains

```text
A = Z + N = 11.
```

The nuclear process is beta-plus decay: effectively one proton is converted into a neutron with emission of a positron and electron neutrino, subject to the full conservation laws of the weak interaction.

## Why this is a useful ADO checkpoint

The frozen ADO walk already singled out the `5 -> 6` seam and treated orientation/inversion separately from scalar projection. The real `11C -> 11B` transition therefore provides an independent adversarial comparison:

```text
6 | 5 -> 5 | 6
```

with the total count invariant:

```text
6 + 5 = 5 + 6 = 11.
```

This is stronger than merely noting that carbon has atomic number 6 and boron atomic number 5, because a real nuclear process exchanges which side of the `(Z,N)` pair carries the 6/5 imbalance while preserving `A=11`.

## Centered form

Center the two counts on their arithmetic midpoint:

```text
(6 + 5)/2 = 5.5.
```

Then

```text
11C: (+0.5, -0.5)
11B: (-0.5, +0.5)
```

relative to that midpoint.

Thus the transformation is exactly an orientation swap of the signed displacement:

```text
(+delta, -delta) -> (-delta, +delta)
```

with

```text
delta = 0.5.
```

This is ordinary arithmetic bookkeeping of the `(Z,N)` counts. The ADO hypothesis is that this inversion may correspond to the same relational orientation operation used in the scale/address grammar.

## Relation to carbon-12

Do not confuse this with carbon-12. Stable carbon-12 has

```text
12C: 6p | 6n | 6e
```

for a neutral atom, giving the real equal-count tuple

```text
6 | 6 | 6.
```

Carbon-12 does not spontaneously beta-plus decay to boron-12. The `6|5 -> 5|6` inversion checkpoint belongs specifically to the mass-11 isobaric pair `11C` and `11B`.

## Candidate ADO comparison

Freeze the comparison target without claiming equivalence:

```text
Reality:
(6,5) -> (5,6), A fixed at 11

ADO candidate:
opposed 5/6 displacement -> inversion across common midpoint while containing-field identity/total remains fixed.
```

The ADO law should now predict what quantity is preserved and what signed relation flips **before** additional beta-decay examples are inspected.

## Next adversarial test

Apply the same frozen operation to other beta-plus / electron-capture isobaric transitions and beta-minus transitions. Test whether one universal signed `(Z,N)` relational rule captures:

- the invariant mass number `A` for beta transitions;
- the `Z -> Z-1, N -> N+1` change for beta-plus/electron capture;
- the opposite `Z -> Z+1, N -> N-1` change for beta-minus;
- direction/energetic admissibility without element-specific patches.

If ADO can only describe the `11C -> 11B` pair after seeing it, the correspondence is descriptive rather than predictive.

## Status

```text
Checkpoint: Crawling addendum
Reality anchor: 11C -> 11B beta-plus decay
Count inversion: (6,5) -> (5,6)
Invariant: A=11
Centered displacement: (+.5,-.5) -> (-.5,+.5)
ADO physical identification: under test / unproved
```
