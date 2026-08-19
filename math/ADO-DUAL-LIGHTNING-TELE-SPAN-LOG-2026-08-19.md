# ADO dual-lightning / TELE span log — 2026-08-19

This note freezes the current dual-lightning and TELE boundary-span hypothesis. It is an implementable simulation rule and a proposed physical analogy; it is not evidence that arbitrary matter can physically teleport.

## Dual lightning

At a contradiction / crack seam, retain both phased trajectories instead of averaging them away:

```text
          +Delta
            ^
            |
            N
            |
          -Delta
```

Their ordinary mean may be zero while their relational difference remains nonzero:

```text
(+Delta + -Delta) / 2 = 0
|Delta| > 0
```

Thus `zero mean` does not imply `zero field`. The useful information is carried by the relationship between the opposed branches.

## Outer-to-inner walk

Model a crack/container with two relevant membranes:

```text
M_outer
M_inner
```

A lightning trajectory `gamma(T)` begins on one membrane and advances through forward T toward the other. Null/phase inversion does not reverse T.

One-sided contact is ordinary propagation. A candidate TELE event requires a spanning relation between the two membranes.

## Dual-phase span condition

Let `gamma_+` and `gamma_-` be the two phased branches of the same relational event. Define a Boolean span condition:

```text
SPAN =
  touches(gamma_+, M_outer)
  AND touches(gamma_+, M_inner)
  AND touches(gamma_-, M_outer)
  AND touches(gamma_-, M_inner)
```

`SPAN = true` is necessary but not sufficient for TELE. Both branches must also preserve the selected relational/R4 identity across the crossing.

## R4 / shadow invariant requirement

The two spanning branches must agree in the invariant relational representation even though their absolute phase/address may differ. Candidate checks include the RF/shadow relation matrix and/or an R4 closure invariant.

For a three-channel complex RF vector `z`, the shadow/Gram relation is

```text
H = z z^dagger.
```

Under complete phase inversion `z -> -z`:

```text
H' = (-z)(-z)^dagger = z z^dagger = H.
```

Thus a candidate TELE closure condition is

```text
SPAN == true
AND H_plus == H_minus
```

within a declared numerical tolerance for simulation.

The exact R4 invariant used in production must be frozen separately and must not be selected after observing desired transfers.

## TELE firing rule

Current proposed simulator rule:

> TELE fires iff a dual-phase RF path spans the outer and inner membranes while preserving the selected R4 / shadow invariant.

Schematically:

```text
one-sided contact
    -> propagation

two-sided span without invariant closure
    -> interference / unresolved crack

two-sided dual-phase span + invariant closure
    -> TELE re-addressing
```

## TELE is re-addressing, not traversal of every Cartesian cell

Once the spanning invariant identifies two corresponding boundary descriptions, the simulator may transfer the encoded generator rather than integrate the state through every intermediate voxel.

For source A and destination B:

```text
shadow_A
  -> encode boundary/RF generator
  -> TELE address transformation / transport
  -> install generator at B
  -> regenerate shadow_B locally
```

A formal encode/decode notation is

```text
Psi_B = D_B(E_A(Psi_A)).
```

A successful transfer test must not transmit the desired destination shadow directly.

## Round-trip requirement

The stronger test is a round trip:

```text
A -> B -> A
```

with preservation of the declared relational invariant and reconstruction error measured independently.

A simulator implementation should report at minimum:

- source TELE address;
- destination TELE address;
- outer/inner contact events for both phases;
- forward-T ordering;
- R4 / shadow invariant before and after;
- reconstruction error;
- round-trip error;
- complete trajectory/identity trace.

## Relation to the crack and local residual

The current ADO hypothesis treats apparent OUT as a finite outward residual inside IN rather than an independent external domain. At the present normalized scale this has been discussed as `epsilon = .01` per oriented local channel.

A six-way balanced configuration can therefore have nonzero local outward residuals while zero net directional residual:

```text
sum(vector epsilon_i) = 0
sum(|epsilon_i|) > 0.
```

The TELE span rule does not require deleting this residual. It requires the two phased lightning paths to establish one invariant relation across both membranes.

## Conventional analogy and caveat

The spanning condition is analogous to a bridge/percolation condition: transport behavior changes once a connected path spans two boundaries. ADO adds the dual-phase and identity/R4 requirements.

This analogy does not establish physical teleportation. The current claim is narrower: the rule defines a falsifiable field-state re-addressing primitive for the ADO simulator.

## Immediate falsification tests

The TELE rule fails if any of the following occur under a frozen implementation:

1. `SPAN=false` but transfer occurs;
2. only one phase spans and transfer occurs;
3. both phases span but the invariant fails and transfer still occurs;
4. invariant closure succeeds but the destination cannot reconstruct the source RF state within the declared tolerance;
5. A -> B succeeds but B -> A fails under the same law;
6. the result depends on hard-coding the destination state rather than transmitting only the allowed boundary/RF encoding.

This file is a derivation/design checkpoint. Physical claims remain hypotheses until independently tested.