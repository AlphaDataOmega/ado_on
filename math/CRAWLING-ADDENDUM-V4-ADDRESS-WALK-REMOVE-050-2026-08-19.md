# Crawling addendum — v4 address walk; remove `050` as primitive — 2026-08-19

This checkpoint freezes the fourth-root-of-two scale walk and removes `050` as a primitive/assumed constant in the reduced construction.

## Operator

Define

```text
v4 = 2^(1/4).
```

Then

```text
v4^4 = 2.
```

For a starting scalar `x0=1/2`, repeated application gives

```text
x_n = (1/2) 2^(n/4).
```

The first twelve positions are approximately:

```text
n=0   0.5000000000
n=1   0.5946035575
n=2   0.7071067812
n=3   0.8408964153
n=4   1.0000000000
n=5   1.1892071150
n=6   1.4142135624
n=7   1.6817928305
n=8   2.0000000000
n=9   2.3784142300
n=10  2.8284271247
n=11  3.3635856610
n=12  4.0000000000
```

Thus every four v4 applications produce an exact doubling:

```text
1/2 -> 1 -> 2 -> 4 -> ...
```

with irrational intermediate trajectory values.

## Address rendering

If values are rendered on the provisional 000..999 address display by multiplication by 100, the initial segment appears as

```text
50
59.46035575...
70.71067812...
84.08964153...
100
118.92071150...
141.42135624...
168.17928305...
200
237.84142300...
282.84271247...
...
400.
```

The irrational values are trajectory positions between exact power-of-two landing states.

## Remove `050` as a primitive

Do not treat the symbol/address `050` as an independently fundamental object in this reduced derivation.

Instead derive the starting half from the four-slot v4 closure relation:

```text
v4^4 = 2
```

and four equal slots:

```text
floor = v4^4 / 4 = 2/4 = 1/2.
```

Thus the invariant is written mathematically as

```text
1/2
```

and `050` is, at most, a base-100/display rendering of that derived value at one chosen address scale.

The reduced static object therefore becomes

```text
1_L | 1/2 | 1_R
```

rather than treating

```text
1_L | 050 | 1_R
```

as primitive notation.

## Consequence

The construction now separates:

```text
fundamental relation: v4^4 = 2
four-slot normalization: 2/4 = 1/2
address rendering: 1/2 may display as 050 at a selected scale
trajectory: repeated v4 multiplication moves the rendered address
```

So the `5` in the display is not frozen. Repeated v4 application moves the represented value while exact four-step boundaries land on powers of two.

## RH caution

This derives `1/2` from the chosen four-slot normalization and v4 closure. It does not prove that nontrivial zeta zeros have real part `1/2`. The RH-specific missing theorem remains separate.

## Status

```text
Checkpoint: Crawling addendum
Operator: v4=2^(1/4)
Exact closure: v4^4=2
Derived four-slot floor: 1/2
050 primitive status: removed
050 remaining role: optional address/display rendering only
RH proof status: NOT PROVED
```
