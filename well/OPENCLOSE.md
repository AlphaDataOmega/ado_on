# OPEN / CLOSE — the inverse-scale ternary operator

The missing experiment: `scale.js` descends forever (fresh null-centered ternary
frames). Does an **ascent** exist — three objects at scale *n* closing into one at
scale *n+1*, reversibly — and does *meaning* make same-instance objects share a
higher object? `scale.js` is untouched; this is the ascent, and the result is a
**qualified null.**

## The operator

```
CLOSE(a,b,c) = (S = a+b+c,  d1 = a-b,  d2 = b-c)      # S: higher object; (d1,d2): lower walk
OPEN(S,d1,d2): b = (S-d1+d2)/3,  a = b+d1,  c = b-d2  # exact inverse
```
Recurse CLOSE on the stream of S's: `3→1, 9→3→1, 27→9→3→1, …`. Every S is itself
a value, so it re-enters the same machinery. Implementation: `openclose.js`.

## Results (real weights/vectors; nothing tuned)

| test | result |
|---|---|
| 1. exact `OPEN(CLOSE)=id` | **max err 1.1e-16** (float precision) |
| 2. arbitrary-depth nesting | exact through depth 9 |
| 3–4. ascent↔descent compose | exact both orders |
| 5. storage decreases? | **NO** — reversible but not compressive; ~9 bits/val either way |
| 6. random/incompressible control | same as structured — it is tree grouping, not coding |
| 7. distinct lower walks share one higher object | **YES, mechanically** (constructed S shared to 7e-16 while walks differ rrmse 1.29) |

So the algebra **mechanically** admits "same higher object, different lower walks"
(test 7) — but only when constructed. The question is whether meaning produces it.

## Semantic probe (same meaning, different instance walks)

`dog₁, dog₂ = v_dog + noise` vs control `v_dog, v_tree`. Higher-object similarity,
per scale, averaged over 200 trials:

```
scale |  cos(same)  cos(ctrl)  separation
  1   |   +0.732    -0.003      +0.735
  3   |   +0.722    +0.005      +0.717
  5   |   +0.638    -0.071      +0.709
  6   |   +0.480    -0.040      +0.520   (degenerate top = 1 scalar)
```

**Separation is flat across scale, then erodes.** Same-meaning higher objects are
more alike than controls — but by the *same margin at every scale*. The hierarchy
**inherits** the similarity already in the vectors; it never **creates** a new
invariant. This is exactly the outcome to not over-read: it is not semantic
convergence, it is carried-forward vector similarity. **Null.**

## Why — and the missing operator

Reversible CLOSE is a bijection. A bijection **cannot** collapse two distinct
instances onto one object — that is precisely what an *invariant* requires. So exact
`OPEN` and an emergent shared invariant are in direct tension on the same axis: you
can have exact reconstruction **or** a meaning-collapsing invariant, not both from
one reversible operator.

The mathematically necessary missing operator is a **non-injective quotient**
`Q: object → canonical representative of its meaning-class`, whose fibers are the
equivalence classes of meaning. `Q` is lossy in the instance dimension (recovers the
meaning, not the exact instance) and therefore lives on a **separate axis** from the
reversible residual: `object → (Q(object), residual)`, with the higher relational
object = `Q` and the lower walk = residual. Test 7 shows this shape is representable;
the scale law does not **supply** `Q`. The coarse sum `S` is a linear inherit, not a
meaning-quotient — its fibers are not meaning classes, which is why separation stays
flat. `Q` must come from structure or learning; it does not fall out of the
reversible ternary hierarchy for free.

## Verdict

The existing Well scale law supports `same higher object, different lower walks`
**as an algebraic possibility, not as an emergent property of meaning.** To make it
emergent, add a quotient `Q` onto meaning-classes — a deliberately irreversible
projection paired with the reversible residual. Reversibility was never the missing
piece; **forgetting the instance in a meaning-aligned way** is.
