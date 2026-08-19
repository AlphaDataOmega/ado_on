# Six-field null / inversion derivation

This note freezes the derivation reached from the six-field construction. It keeps the proposed ADO rules separate from ordinary arithmetic consequences so the chain can be audited without silently changing a symbol later.

## Terms

- **R4** means **Rational Relational Relationship Ratios**. The phrase is indivisible; it is not the Klein four-group `V4` used elsewhere in the implementation.
- **infinity** is used for unbounded number/count.
- **inVinity** is used for unbounded motion/trajectory.
- `z` is the null scale.
- `V` is the invariant half-state.
- `t` is the directed step through the zero seam.

## Base-100 primitives

The construction uses a base-100 field scale:

```text
z = 010 = 1/10
V = 050 = 1/2
```

Hence

```text
V = 5z
10z = 100
```

`050` is invariant under complement inversion on the 000..100 scale:

```text
I(x) = 100 - x
I(050) = 050
I(I(x)) = x
```

The operative coherence band is proposed as `010..090`, with `090` the highest gravity/coherence and the two endpoints exchanged through `050`:

```text
I(010) = 090
I(090) = 010
```

In the proposed field interpretation, gravity is coherence: novelty returns evenly through the outer membrane and is ordered by coherence with the field rather than by a preassigned neighbor.

## The null between five and six

The null is derived from the interval:

```text
5 | z | 6
6 - 5 = 1
z = (6 - 5) / 10 = 0.1 = 010
```

The half-state is five null steps:

```text
5z = 050 = V
```

and the sixth null step is

```text
050 + 010 = 060.
```

Bifurcation does not occur merely because `050` exists. The proposed dynamics are pressure accumulation at the null; when the six-field plugs/passes zero, the accumulated relation can resolve into inverted pathways.

## Six-field bifurcation

Apply the invariant to six:

```text
6V = 6(1/2) = 3
```

Reflection about six gives the opposed branch:

```text
6 - 3 = 3
6 + 3 = 9
```

so the bifurcation pathway is

```text
3 | 6 | 9
```

or generally

```text
B_V(x) = (x - xV, x, x + xV).
```

At `V = 1/2`, this normalizes to the ordinary ratio `1:2:3`.

The construction proposes ten bifurcation realities in opposite spin. What falls out of the bifurcations returns through the outer membrane into the original field, then is ordered by gravity/coherence. The 3% term is coupling/bleed through the ten-way field, not an independently chosen decimal.

## Deriving the local 3% scale

The six-field half-state is

```text
6V = 3.
```

Distributed across ten bifurcations:

```text
(6V) / 10 = 3 / 10 = 0.3
```

and at the local hundred-scale used in the trajectory bookkeeping this is the `030` quantity whose one-in-ten passage is

```text
030 / 10 = 003
```

or `0.03` on the normalized ordinary scale.

This is the approximate **3%** trajectory/bleed rule used in the geometric description. It must not be silently identified with the exact `φ^7` value below; the exact value comes only after the reciprocal null-closure rule is imposed.

## Directed time seam

The hidden directed step is

```text
t = -01.
```

On a cyclic base-100 coordinate this is the predecessor of zero:

```text
-01 ≡ 099 (mod 100)
099 -> 100 ~ 000
```

The sign records trajectory orientation through the seam even when the displayed coordinate closes.

For the tenfold six-field bifurcation quantity:

```text
10(6V) = 10(3) = 30
30 + t = 30 - 1 = 29.
```

## Null crossing inverts scale

This is the additional proposed ADO rule that closes the derivation:

> Motion is carried by inVinity; when the trajectory crosses the null, scale inverts reciprocally.

Let `ε` be the positive inward remainder after the `30 -> 29` directed passage. The complete forward scale is

```text
X = 29 + ε.
```

Null inversion returns the reciprocal scale as the inward remainder:

```text
ε = 1 / X = 1 / (29 + ε).
```

Everything after this line is conventional algebra.

Multiply through:

```text
ε(29 + ε) = 1
ε² + 29ε - 1 = 0.
```

The positive root is

```text
ε = (sqrt(845) - 29) / 2
  = 0.034441853748633...
```

and therefore

```text
X = 29 + ε
  = 29.034441853748633...
```

Let

```text
φ = (sqrt(5) - 1) / 2
Φ = 1/φ.
```

Then exactly

```text
ε = φ^7
X = Φ^7
Φ^7 - φ^7 = 29
Φ^7 φ^7 = 1.
```

Thus the six-field/null/inVinity construction, **given the reciprocal scale-crossing rule**, reproduces the same exact bleed/beat pair already used by ADO_ON:

```text
bleed = φ^7 = 0.034441853748633...
beat  = Φ^7 = 29.034441853748633...
```

## What is proved, and what is proposed

The arithmetic and algebra above are exact consequences once the stated rules are accepted. In particular,

```text
ε = 1/(29+ε)
```

uniquely fixes the positive `ε` and yields `φ^7`.

What is **not** established by this derivation alone is that the six-field, inVinity, null inversion, gravity=coherence, the ten-reality orbital interpretation, or the physical interpretation of the field are laws of nature. Those are hypotheses of the construction and require independent mathematical comparison and physical tests.

The useful result here is narrower and auditable: a path beginning from `z=010`, `V=050`, the six-field bifurcation, tenfold closure, `t=-01`, and reciprocal scale inversion produces the exact `φ^7 / Φ^7` pair without inserting either golden-ratio value as a numerical target.