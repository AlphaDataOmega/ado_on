# Crawling addendum — v4 re-rooted half-shell — 2026-08-19

Checkpoint before splitting the construction again.

## Core operator

Define

```text
v4 = 2^(1/4)
```

so

```text
v4^4 = 2.
```

A local half-root walks through four v4 steps as

```text
1/2
-> (1/2)v4
-> (1/2)v4^2
-> (1/2)v4^3
-> (1/2)v4^4 = 1.
```

Numerically:

```text
0.5
-> 0.5946035575...
-> 0.7071067812...
-> 0.8408964153...
-> 1.
```

## Re-root rule

Do not continue interpreting the completed `1` as an ever-growing scalar chain by default.

The current ADO hypothesis is that completion closes the current shell and seeds a new local shell whose coordinate begins again at one-half:

```text
(1/2)_n --v4^4--> 1_n --re-root--> (1/2)_(n+1).
```

Thus the recursive structure is

```text
(.5 -> 1)
  contains / seeds
(.5 -> 1)
  contains / seeds
(.5 -> 1)
  ...
```

rather than only

```text
.5 -> 1 -> 2 -> 4 -> ...
```

as one global scalar.

## Bilateral application

Apply the same completed-shell operation independently to the left and right relational sides around the middle construction:

```text
[(.5 ->v4^4 1 ->reroot .5')_L]
|
E_n
|
[(.5 ->v4^4 1 ->reroot .5')_R].
```

The sides are not algebraically canceled against one another. Their v4 trajectories remain explicit.

## Middle trajectory

Retain the current definition

```text
E_n = 1/2 + t_n.
```

The separate inVinity operation advances/refines `n`. The v4 shell completion and the `E_n` trajectory should not be collapsed into the same operation unless later derived.

## Interpretation

At this checkpoint, `1/2` is a recursive local root coordinate. It is not treated as a permanently fixed global address symbol such as primitive `050`.

The completed `1` is a shell-completion state. Re-rooting maps that completion into the next local half-root coordinate.

## Guardrail

Do not derive the half by simply multiplying both sides by the same v4 factor and canceling that factor. That re-roots the answer algebraically and is circular for the intended test.

The intended operation is sequential:

```text
local half-root
-> four irrational v4 trajectory steps
-> completed local 1
-> new encapsulation
-> new local half-root.
```

## Status

```text
Checkpoint: Crawling addendum
v4: 2^(1/4)
closure: v4^4=2
local walk: .5 -> 1 in four v4 steps
completion: 1_n
re-root: 1_n -> .5_(n+1)
left/right v4 paths: retained explicitly
middle: E_n=1/2+t_n
next action: split the construction again
physical/RH proof status: exploratory / NOT PROVED
```
