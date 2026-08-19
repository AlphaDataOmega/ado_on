# Crawling addendum — thorium decay walk back to T — 2026-08-19

This checkpoint freezes the observation that the `090` chemistry comparison supplies a real measured decay trajectory that can be used as a walk back toward the ADO trajectory/time variable `T`.

## Address-side checkpoint

Under the current candidate identity-coordinate correspondence:

```text
090 -> atomic number Z=90 -> thorium (Th)
```

if the central/coarse identity coordinate is interpreted as atomic number.

A symmetric `090|090|090` tuple would additionally imply equal proton/neutron/electron counts only under the provisional `p|n|e` bookkeeping convention. That is not the naturally dominant thorium isotope and must not be conflated with ordinary thorium-232.

## Reality-side decay anchor

Naturally dominant thorium is `232Th`, with measured half-life approximately

```text
T_1/2 ~= 1.402e10 years.
```

Its exponential decay constant is

```text
lambda = ln(2) / T_1/2
       ~= 4.94e-11 per year.
```

Therefore the ADO `.01` scale step is **not** numerically the observed annual decay probability.

## Scale versus rate distinction

Freeze the distinction:

```text
.01 -> candidate address/scale residual
lambda -> measured physical decay hazard per unit time.
```

If ADO relates the two, the measured hazard must be derived through nested scale/R4/T dynamics rather than by identifying `.01` directly with a decay rate.

A candidate family to test, not assume, is

```text
lambda_ADO ~ (.01)^n * R4_correction / T_unit
```

or another independently derived scale-depth law.

The exponent/depth and physical time normalization must come from the frozen address dynamics, not be selected to fit thorium's known half-life.

## Walk back to T

Thorium gives a measured clock-like trajectory:

```text
state at T_0
  -> stochastic nuclear decay events
  -> daughter states
  -> further decays
  -> stable endpoint(s).
```

For the `232Th` decay series, the long chain ultimately reaches stable `208Pb`.

This provides a reality-side path with measured state identities, decay modes, energies, branching behavior, and half-lives. It can therefore be compared against the ADO forward trajectory variable `T`.

The key hypothesis is:

> Nested address residuals may encode a depth/pressure relation whose forward traversal produces a physical decay hazard. The observed decay series can then be used to test whether ADO's ordered `T` maps onto measured physical time without inserting the measured half-lives.

## Proposed comparison chain

```text
ADO side:
090-class identity/address
  -> nested .1/.01/.001/... ledger
  -> R4 pressure / instability
  -> forward T transition
  -> next stable/metastable address

Reality side:
232Th
  -> measured radioactive decay chain
  -> ...
  -> 208Pb stable.
```

The two paths should be generated independently and compared afterward.

## Why this is useful

Earlier ADO work treated `T` primarily as ordered forward trajectory. Radioactive decay supplies an independent physical process in which:

- the ordering of state transitions is measurable;
- transition rates are measurable;
- identities change through a constrained chain;
- a long-lived unstable state eventually reaches a stable endpoint.

Thus the thorium series can serve as an adversarial bridge between abstract forward `T` and physical time/rate.

## Guardrails

Do not freeze any of the following as facts:

```text
090 itself causes radioactivity;
.01 is the thorium decay probability;
ADO already predicts the 232Th half-life;
all Z=90 address projections represent 232Th;
radioactive decay proves the ADO time model.
```

Instead require the frozen ADO scale/R4 law to predict a dimensionless decay relationship first, establish a physical time normalization independently, and only then compare against measured half-lives.

## Status

```text
Checkpoint: Crawling addendum
Reality anchor: 232Th decay -> stable 208Pb endpoint
Measured half-life anchor: ~1.402e10 years
Measured decay constant: ~4.94e-11 yr^-1
ADO .01 role: scale/address residual, not decay rate
New target: derive a walk from nested address depth back to forward T / physical time
Physical derivation status: open
```
