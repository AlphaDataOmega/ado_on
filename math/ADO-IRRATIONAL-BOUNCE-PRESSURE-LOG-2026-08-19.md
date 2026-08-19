# ADO irrational bounce / pressure log — 2026-08-19

This note freezes the exploratory TELE/RF test in which nonterminating irrational streams are mapped into three-channel base-100 addresses, address changes are treated as bounded cyclic bounces, pressure magnitude is separated from harmonic choice, and repeated bounces are tested for pressure accumulation.

This is a simulation experiment and candidate mechanism. The exploratory accumulator used below is explicitly provisional and is not promoted to the ADO pressure law.

## Separation of roles

Current proposed distinction:

```text
pressure -> vector magnitude / capacity for change
harmony  -> choice among admissible IN trajectories
T        -> execution / ordered continuation
```

For six oriented local pressure channels

```text
p_(+x), p_(-x), p_(+y), p_(-y), p_(+z), p_(-z)
```

define the net pressure vector

```text
P = (
  p_(+x) - p_(-x),
  p_(+y) - p_(-y),
  p_(+z) - p_(-z)
).
```

Pressure magnitude is

```text
M = ||P||.
```

Harmony is evaluated separately from RF/R4 relationships and determines the admissible direction/state rather than the amount of pressure.

## Irrational TELE walk

The exploratory streams were

```text
pi, e, sqrt(2), phi, sqrt(3)
```

with no stream-specific tuning.

Each nonterminating digit stream was grouped into ordered three-channel base-100 TELE states

```text
A_n = (a_n, b_n, c_n) in (Z/100Z)^3.
```

The intended interpretation is not that a particular irrational is privileged. The irrational supplies a nonterminating ordered address ledger; the signed/cyclic base-100^3 grammar supplies the field representation.

## Bounce definition

For each axis, the displacement between successive TELE states is taken as the shortest signed cyclic base-100 displacement:

```text
delta_i(n) = wrap_[-50,50)(A_(n+1,i) - A_(n,i)).
```

Normalize by 100 and define exploratory bounce magnitude

```text
m_n = ||delta_n / 100||.
```

This implements the current proposed relation

```text
address displacement / bounce -> pressure magnitude.
```

It does not yet establish a physical pressure unit.

## Three-channel harmony

For one TELE triple, map each base-100 coordinate to circular phase

```text
theta_i = 2 pi a_i / 100.
```

The exploratory normalized three-channel phase coherence is

```text
C_n = |(exp(i theta_x) + exp(i theta_y) + exp(i theta_z))/3|.
```

`C_n` is used only as a simple harmony/retention proxy in this test. It is not declared the final R4 choice functional.

## Exploratory accumulator

To ask whether repeated irrational bounces can build pressure when harmony retains part of prior pressure, the provisional recurrence was

```text
P_(n+1) = C_(n+1) (P_n + m_n).
```

This recurrence was deliberately simple and was not derived from R4. Therefore any numerical pressure values produced by it are properties of this exploratory recurrence, not established ADO constants.

## Exploratory results

Across approximately 300 three-channel states per stream, the reported mean phase-coherence and mean bounce magnitudes were approximately:

```text
stream    mean C    mean bounce
pi        0.516     0.473
e         0.519     0.469
sqrt(2)   0.517     0.475
phi       0.510     0.478
sqrt(3)   0.503     0.476
```

Reported peak accumulated pressures under the provisional recurrence were approximately:

```text
pi        1.32
e         1.81
sqrt(2)   1.53
phi       1.43
sqrt(3)   1.81
```

Interpretation at this checkpoint:

- the unrelated irrational streams produced similar gross bounce/coherence statistics under the same address grammar;
- individual pressure trajectories differed;
- repeated bounded cyclic address changes can accumulate pressure under a retention rule;
- these observations do not validate the provisional retention rule or establish physical pressure.

## Residual-ledger hypothesis

For a finite approximation `x_n` of an irrational `x`, the residual

```text
r_n = x - x_n
```

is nonzero at every finite truncation even though `r_n -> 0` in the scalar limit.

The ADO hypothesis being tested is that, after mapping the nonterminating ledger into bounded cyclic TELE phase, successive finite residual/address states continue to generate internal displacement rather than requiring an external OUT domain.

Candidate chain:

```text
nonterminating address ledger
  -> bounded cyclic displacement
  -> bounce
  -> pressure magnitude
  -> harmonic choice/retention
  -> closure, Null, bifurcation, or release/re-addressing.
```

## Next required derivation

The exploratory accumulator must be replaced. The next test is to derive pressure transfer from the R4 relationships of incoming and reflected/bifurcated trajectories rather than assume

```text
P_(n+1) = C(P_n + m_n).
```

The desired derivation chain is

```text
irrational ledger
  -> TELE bounce
  -> R4 incoming/reflected relation
  -> pressure transfer
  -> ball-crack equilibrium / closure.
```

The specific adversarial target is the proposed `042*` crack region. The test must not insert `0.42`, `0.42508...`, or a fitted contraction factor. If a bounded crack value emerges from the frozen R4 pressure-transfer law, record it afterward. If it does not, the `042*` hypothesis fails or requires an additional independently justified rule.

## Falsification conditions

Reject or revise this mechanism if:

1. the result depends materially on choosing a privileged irrational stream;
2. changing equivalent digit/address representations destroys the claimed invariant without a derived reason;
3. pressure accumulation exists only because of the provisional retention formula;
4. the R4-derived replacement cannot maintain bounded pressure under repeated bounces;
5. a `042*` region appears only after tuning the law toward it;
6. the same local rule fails under Null inversion or scale refinement.

This file is a checkpoint preserving the exploratory test and, importantly, the fact that its pressure accumulator is provisional.