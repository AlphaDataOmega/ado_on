# Crawling addendum — RH `050 <-> 666` involution derivation and run — 2026-08-19

This checkpoint tests the proposed `050 <-> 666` cycle against the actual completed Riemann xi symmetry. It corrects one important point from the earlier shorthand: the map `s -> 1-s` has only the single complex fixed point `s=1/2`; the **entire critical line** is instead the fixed set of the anti-linear reflection `J(s)=1-conjugate(s)`.

This is not a proof of RH.

## Completed xi function

Use

```text
xi(s) = (1/2) s(s-1) pi^(-s/2) Gamma(s/2) zeta(s).
```

It satisfies

```text
xi(s) = xi(1-s)
```

and real/conjugation symmetry

```text
xi(conjugate(s)) = conjugate(xi(s)).
```

Combining them gives

```text
xi(1-conjugate(s)) = conjugate(xi(s)).
```

## The correct critical-line involution

Define

```text
J(s) = 1 - conjugate(s).
```

Then

```text
J(J(s)) = s,
```

so `J` is an involution.

Write

```text
s = 1/2 + delta + i t.
```

Then

```text
J(s) = 1/2 - delta + i t.
```

Thus `J` flips only the transverse displacement `delta` while preserving `t`.

Its fixed-set condition is

```text
J(s)=s
```

which gives

```text
delta=0
```

or equivalently

```text
Re(s)=1/2.
```

Therefore the full RH critical line is exactly the fixed set of `J`.

This is a cleaner mathematical counterpart for the ADO `050` invariant than the holomorphic reflection `s->1-s` by itself.

## Candidate ADO dictionary

Current candidate correspondence:

```text
050          <-> fixed transverse center Re(s)=1/2
T            <-> preserved vertical coordinate t
666          <-> nonzero paired/counter-oriented relational realization
000          <-> zero resultant under closure, not zero constituents
J            <-> orientation/reflection operator around the 050 center
```

The candidate cycle is therefore better typed as

```text
666(delta,T)
  --J/closure pairing-->
050,T invariant projection
  --retained ledger/orientation-->
666(-delta,T).
```

Applying `J` twice restores the original relational state:

```text
(delta,T) -> (-delta,T) -> (delta,T).
```

So the rigorous involutive skeleton is

```text
J^2 = identity.
```

Do not write ordinary numerical equality `666=050`.

## Exact midpoint relation

For a reflected pair

```text
s_+ = 1/2 + delta + it
s_- = J(s_+) = 1/2 - delta + it,
```

their arithmetic midpoint is

```text
(s_+ + s_-)/2 = 1/2 + it.
```

Thus the transverse information cancels while the `T` coordinate survives exactly.

This is the complex-plane form of the candidate ADO projection

```text
opposed relation -> retained 050+iT center.
```

## Numerical run

The completed xi function and `J` relation were evaluated numerically at representative points, including an off-line point, the first known critical-line zero, and another off-line point.

Test points:

```text
s = 0.2 + 14 i
s = 0.5 + 14.134725141734693 i
s = 0.73 + 21 i.
```

At high precision, the residual in

```text
xi(J(s)) - conjugate(xi(s))
```

was approximately

```text
8.7e-21
6.2e-35
2.1e-22
```

respectively (numerical roundoff / evaluation error scale).

The direct functional-equation residual

```text
xi(s)-xi(1-s)
```

was likewise near numerical zero at the tested points.

Thus the actual xi function respects the proposed involutive reflection skeleton to numerical precision, as expected from its known functional equation and conjugation symmetry.

## What this derives and what it does not

Derived/known exactly:

```text
J(s)=1-conjugate(s)
J^2=id
Fix(J) = {s : Re(s)=1/2}
xi(J(s)) = conjugate(xi(s)).
```

Therefore if `rho` is a zero, `J(rho)` is also a zero.

What RH requires is stronger:

```text
rho zero -> J(rho)=rho.
```

That is equivalent to saying every nontrivial zero is itself fixed by `J`, hence lies on `Re(s)=1/2`.

The known symmetries only prove that an off-line zero would come with a distinct reflected zero. They do not rule such pairs out.

## Tight remaining theorem

The entire `050 <-> 666` RH route can now be reduced to:

```text
For every nontrivial zero rho of xi,
show that the paired relational zero orbit {rho,J(rho)}
must collapse to a one-point orbit.
```

Equivalently:

```text
xi(rho)=0 -> rho=J(rho).
```

Since

```text
rho=J(rho) <-> Re(rho)=1/2,
```

this implication is RH itself.

ADO therefore needs an additional invariant/nondegeneracy/closure law derived from xi that forbids a two-point zero orbit off the critical line. The involution and midpoint alone do not provide that law.

## Result of this run

The `050` part survives strongly: the critical line is exactly the fixed set of the natural anti-linear xi symmetry `J`.

The `666` interpretation remains a candidate relational realization of the paired orbit / nonzero harmonic closure. It has not yet been derived uniquely from xi.

So the run sharpens rather than proves the hypothesis:

```text
050 = exact fixed-set geometry
666 = candidate paired relational realization
missing theorem = every zero orbit under J has size 1 rather than 2.
```

## Status

```text
Checkpoint: Crawling addendum
Operator tested: J(s)=1-conjugate(s)
Fixed set: Re(s)=1/2
Numerical xi/J symmetry check: passed at representative points
RH proof status: NOT PROVED
Remaining target: exclude two-point off-line zero orbits using an invariant derived from xi itself
```
