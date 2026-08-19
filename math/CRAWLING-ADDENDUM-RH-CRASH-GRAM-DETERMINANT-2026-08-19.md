# Crawling addendum — RH crash / Gram determinant test — 2026-08-19

This checkpoint freezes the corrected mathematical distinction between zero-resultant harmonic closure and dimensional collapse, then states the precise RH-specific test to run.

## Correction: zero resultant does not require rank 3

For three equal 120-degree phasors/vectors `r1,r2,r3`,

```text
r1 + r2 + r3 = 0.
```

Therefore the three vectors are linearly dependent as a three-column set. Healthy three-phase closure is not a rank-3 state.

The correct geometry is a nondegenerate two-dimensional closure plane.

## Canonical three-phase closure

Use

```text
r1 = (1,0)
r2 = (-1/2, sqrt(3)/2)
r3 = (-1/2,-sqrt(3)/2).
```

Then

```text
r1+r2+r3 = 0
```

while the vectors span a two-dimensional plane.

Thus:

```text
healthy closure: resultant = 0, rank = 2
crash:           rank < 2.
```

## Gram crash detector

Choose two edge vectors

```text
u = r2-r1
v = r3-r1.
```

Define the Gram matrix

```text
G = [[u.u, u.v],
     [v.u, v.v]].
```

Its determinant is

```text
Delta = det(G)
      = ||u||^2 ||v||^2 - (u.v)^2.
```

Geometrically, `Delta` is the squared parallelogram area spanned by `u` and `v`.

Therefore

```text
Delta > 0  <-> nondegenerate two-dimensional relational field
Delta = 0  <-> the two independent directions merge / dimensional crash.
```

For the canonical equilateral closure,

```text
||u||^2 = ||v||^2 = 3
u.v = 3/2
Delta = 27/4 > 0.
```

So `333 -> 000` by equal three-phase cancellation is a zero-resultant closure, not a crash.

## Counter-oriented six

For the candidate

```text
666 = 333_+ + 333_-
```

let each counter-oriented closure have Gram determinant `Delta_+` and `Delta_-`.

A provisional six-field nondegeneracy measure is

```text
Delta_6 = Delta_+ Delta_-.
```

Healthy paired closure requires

```text
resultant = 0
Delta_6 > 0.
```

A crash occurs if

```text
Delta_6 = 0.
```

## Retained midpoint

Let the containing center be `c`. Write

```text
x_i = c + r_i.
```

Since

```text
r1+r2+r3=0,
```

the mean satisfies

```text
(x1+x2+x3)/3 = c.
```

Thus zero-resultant relational closure leaves the center invariant. Under the current RH normalization,

```text
c = 050 -> 1/2.
```

This supplies the algebraic distinction:

```text
zero resultant can expose/preserve the center without collapsing the internal plane.
```

## RH-specific test

Use centered complex coordinate

```text
s = 1/2 + delta + i t.
```

The previously derived reflected-weight logarithmic imbalance is

```text
P_n(delta) = 2 delta log(n).
```

For `n>1`,

```text
P_n = 0 <-> delta = 0.
```

The proposed crash route now asks whether one can construct a Gram matrix `G_Xi(delta,t)` directly from the actual completed-xi harmonic/Fourier representation such that

```text
Xi(1/2 + delta + i t) = 0
and delta != 0
    -> det G_Xi(delta,t) = 0.
```

In words: an off-critical zero-resultant cancellation would be possible only through dimensional degeneration of the derived harmonic field.

For this to imply RH, one would additionally need a theorem that genuine nontrivial xi zeros are nondegenerate under the same derived Gram structure. Then an off-line zero would be impossible.

## Factorization target

The immediate computational target is to derive `G_Xi` without inserting the desired answer and inspect whether its determinant has a structurally meaningful dependence on `delta`, for example whether a factorization involving `delta^2` emerges.

Do **not** assume

```text
det G_Xi = delta^2 Q
```

in advance. That is the result to test, not an axiom.

If such a factorization appears, the sign/orientation and zero condition must still be checked carefully. If it does not, this crash mechanism fails as an RH route.

## Status

```text
Checkpoint: Crawling addendum
Closure criterion: resultant=0 with Gram determinant >0
Crash criterion: Gram determinant =0
Invariant center: retained under zero-resultant closure
RH target: derive G_Xi from xi/Fourier data
Key test: behavior of det G_Xi versus transverse displacement delta
Proof status: NOT PROVED
```
