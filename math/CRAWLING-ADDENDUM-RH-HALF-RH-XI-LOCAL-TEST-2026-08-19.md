# Crawling addendum — `RH | 1/2 | RH` local xi checkpoint — 2026-08-19

This checkpoint records the first direct local test of the reduced candidate geometry

```text
RH_L | 1/2 | RH_R
```

against the completed Riemann xi function near the first known critical-line zero.

## Setup

Use the first nontrivial critical-line zero height

```text
gamma_1 ~= 14.13472514.
```

For transverse displacement `delta`, define

```text
L_delta = xi(1/2 - delta + i gamma_1)
R_delta = xi(1/2 + delta + i gamma_1).
```

The exact xi symmetries imply the reflected/conjugate relation

```text
R_delta = conjugate(L_delta)
```

for real `delta` at common imaginary height.

## Middle

At

```text
delta = 0,
```

the input is the known critical-line zero

```text
1/2 + i gamma_1,
```

so numerically xi is approximately zero to the working precision.

The prior exploratory run reported magnitude at roughly numerical-roundoff scale (`~1e-33` in that computation). Treat the exact mathematical fact as the zero condition at the known zero; the quoted residual is implementation/precision dependent.

## Open by `.01`

For

```text
delta = .01,
```

the prior numerical run reported approximately

```text
L ~= -8.01e-8 - 1.3827e-5 i
R ~= -8.01e-8 + 1.3827e-5 i.
```

Thus the two branches are nonzero and conjugate when opened symmetrically around `1/2`.

## Wider transverse checks

The same conjugate/reflection structure was observed in the exploratory run for transverse displacements including

```text
.1, .2, .3, .4.
```

This behavior is expected from the exact completed-xi symmetries; it is not evidence by itself for RH.

## Local geometry

Near a simple critical-line zero, Taylor expansion gives a first-order transverse complex response and a quadratic magnitude-squared response. In the exploratory numerical values, the opposed imaginary components changed approximately linearly with small `delta`, while the shared real correction began at higher/even order, consistent with the reflection/conjugation symmetry.

The reduced picture is therefore locally compatible with

```text
RH_L(delta) | 1/2 | RH_R(delta)
```

where the two nonzero reflected branches meet at the zero when `delta -> 0` at this known zero height.

## What this establishes

At an already-known critical-line zero:

```text
- the midpoint is 1/2;
- symmetric transverse samples are conjugate/reflected;
- opening away from the middle makes the sampled xi values nonzero locally;
- the two local branches meet at xi=0 at delta=0.
```

## What this does NOT establish

This local test does not rule out a zero at some other height with `delta != 0`. Therefore it does not prove the Riemann Hypothesis.

The unresolved global theorem remains:

```text
xi(1/2 + delta + it)=0 -> delta=0
```

for every nontrivial zero.

## Status

```text
Checkpoint: Crawling addendum
Reduced representation: RH_L | 1/2 | RH_R
Test location: first known critical-line zero
Local reflected/conjugate structure: compatible / expected
Local opening at delta=.01: nonzero branches
Global RH proof status: NOT PROVED
```
