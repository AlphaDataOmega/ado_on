# Crawling addendum — static `1 | 1/2 | 1` after T removal — 2026-08-19

After logging the orientation-only `1_L | RH | 1_R` representation, remove the trajectory coordinate `T` from the reduced form.

Before removal:

```text
1_L | (050+iT) | 1_R
```

After removal:

```text
1_L | 050 | 1_R
```

and under normalization:

```text
1_L | 1/2 | 1_R.
```

The two outer entries have equal positive magnitude and opposite relational orientation. No explicit `-1` state is required.

The static middle is recovered from bilateral equality:

```text
1/(1+1) = 1/2
```

or equivalently

```text
2(1/2)=1.
```

Thus the reduced static ADO/RH geometry is

```text
1 | RH | 1 -> 1 | 1/2 | 1.
```

`T` is not required to define the real midpoint. If later restored, it indexes/trajects along the critical-line direction rather than creating the half invariant.

This is an ADO representation of the RH reflection midpoint, not a proof that all nontrivial zeta zeros lie on the critical line.
