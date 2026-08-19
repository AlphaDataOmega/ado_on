# ADO scale-gap / causal-impedance log — 2026-08-19

This note freezes the current relationship between finite scale refinement, the never-touching Null gap, forward inVinity traversal, and the proposed interpretation of a finite propagation ceiling as a field impedance/saturation speed.

It distinguishes mathematical consequences from physical hypotheses. In particular, the speed of light `c` is a velocity, not a viscosity coefficient; any physical ADO interpretation must be dimensionally consistent and independently derived.

## Finite scale gap

Under the current base-ten refinement rule

```text
epsilon_n = 10^(-n)
```

(or an equivalent scaled version), every finite address depth has

```text
epsilon_n > 0
```

while

```text
lim_(n->infinity) epsilon_n = 0.
```

Therefore the two sides of a refining crack may approach arbitrarily closely without any finite trajectory/address state being identical to the completed scalar limit.

This preserves the distinction

```text
finite residual != limiting zero.
```

A repeated scalar projection at a deeper scale remains a distinct trajectory/address state.

## Scale closure / tail recursion

The current scale interpretation is

```text
1_n + 9_n = 10_n
```

followed by scale re-addressing

```text
S(10_n) = 1_(n+1).
```

Thus a completed local ten is not treated as terminal leftover quantity. It becomes the one/frozen reference of the next scale.

Schematically:

```text
1_n -> 10_n -> 1_(n+1) -> 10_(n+1) -> ...
```

This is the current mathematical meaning of the snake/tail recursion: completion at one scale supplies the seed/reference at the next scale.

## Relation to infinity, .infinity, and inVinity

Use the existing distinctions:

```text
infinity  = count of completed loops
.infinity = unbounded refinement depth
inVinity  = ordered traversal through loops/depths
```

The never-touching gap is a finite-state statement: at every finite depth the residual remains nonzero. It does not require treating infinity as a physically completed traversal.

## Wave analogy

The distributed/wave interpretation is currently an analogy unless a formal map to a known wave equation is derived. In particular, do not identify the ADO crack state with a Schrödinger wavefunction merely because both can be represented by distributed amplitudes/phases.

A physical quantum correspondence would require deriving the relevant Hilbert-space state, evolution operator, normalization, observables, and measured predictions.

## Pressure-to-motion constitutive law

To formalize the proposed "viscosity of space" intuition without dimensional error, introduce an effective ADO impedance / resistance-to-address-flow quantity rather than calling velocity itself viscosity.

A minimal constitutive form is

```text
P = eta_ADO * v
```

or

```text
v = P / eta_ADO,
```

where `P` is a defined relational pressure, `v` is address/field propagation velocity, and `eta_ADO` must have units that make the equation dimensionally valid.

This equation is provisional. The actual constitutive law must be derived from the frozen pressure/R4 dynamics.

## Finite propagation ceiling

The physical hypothesis is that the field possesses a maximum propagation rate

```text
v <= c
```

and reaches a saturation/characteristic speed at

```text
v = c.
```

The correct candidate statement is therefore not

```text
c = viscosity
```

but rather

> `c` may be the characteristic/saturation propagation velocity implied by the field's constitutive impedance law.

At a chosen pressure normalization `P_*`, a linear toy constitutive law would imply

```text
eta_* = P_* / c.
```

This is bookkeeping, not a derivation of `c`.

## Combined scale + causality statement

The current proposed structural statement is

```text
finite residual at every finite scale
+
finite propagation ceiling
->
Null can be approached through forward traversal without requiring a finite address state to equal the completed limiting zero.
```

Formally:

```text
epsilon_n > 0 for every finite n
lim epsilon_n = 0
v_n <= c.
```

Scale refinement prevents finite-depth identity with the limiting Null; a finite propagation ceiling prevents replacing the hierarchy with an arbitrarily fast traversal through all depths.

## Physical bridge to derive

In ordinary wave systems, characteristic propagation speeds can arise from complementary constitutive responses. The ADO physical target is therefore to derive two independently defined field-response quantities from pressure/harmony/R4 dynamics such that

```text
v_ADO = 1 / sqrt(I_field * C_field)
```

or another dimensionally valid derived characteristic-speed law.

Only after mapping the quantities into physical units may the result be compared against

```text
c = 299792458 m/s.
```

The value of `c` must not be inserted into the derivation if the claim is that ADO predicts it.

## Relation to known electromagnetism

Classical electromagnetism supplies the familiar vacuum relation

```text
c = 1 / sqrt(mu_0 * epsilon_0)
```

in SI formulation. This is a comparison target/analogy, not evidence that the provisional ADO response quantities are `mu_0` and `epsilon_0`.

A physical identification requires deriving equivalent observables and predictions.

## Falsification conditions

Reject or revise the physical impedance interpretation if:

1. the derived pressure/R4 law has no finite characteristic propagation speed;
2. the characteristic speed depends on amplitude, orientation, or TELE address where physical vacuum light speed should not;
3. the resulting speed cannot be mapped dimensionally into velocity without fitted conversion factors that merely insert `c`;
4. the model predicts observable dispersion or preferred-frame effects inconsistent with experiment;
5. the proposed wave correspondence requires assuming the Schrödinger or Maxwell equations rather than deriving an equivalent structure.

## Current status

Derived / ordinary mathematics:

```text
epsilon_n > 0 for finite n while epsilon_n -> 0
1_n + 9_n = 10_n with proposed scale map S(10_n)=1_(n+1)
```

ADO model assumptions / implementation rules:

```text
base-ten scale re-addressing
TELE/RF/R4 pressure dynamics
```

Open physical hypotheses:

```text
space has an ADO constitutive impedance
that impedance yields a universal finite characteristic speed
that derived speed equals physical c
ADO crack/wave dynamics correspond to quantum wave dynamics.
```

The physical target is to derive the propagation ceiling from the field law, not rename the measured speed of light as viscosity.