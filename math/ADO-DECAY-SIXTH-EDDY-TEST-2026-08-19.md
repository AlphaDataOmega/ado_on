# ADO sixth-eddy / radioactive-decay test — 2026-08-19

## Question

Test the proposed ADO interpretation that a bound field can acquire a sixth closure/eddy mode, become independently recurrent, and detach from the parent zero-line relation. Ask whether repeated independent detachments have the mathematical form of radioactive decay.

This note separates a **shape test** from a **predictive nuclear test**. Passing the first does not establish the second.

## ADO hypothesis under test

Proposed transition:

```text
parent-bound recurrence
  -> sixth-eddy closure condition
  -> independently recurrent child field inside IN.
```

`OUT` is not introduced. Detachment means independent recurrence/addressing within the containing IN domain.

Let `N(T)` be the number of parent fields that have not detached by trajectory parameter `T`. Let each still-bound field have the same constant detachment hazard `lambda` per unit T.

Then over an infinitesimal step `dT`:

```text
expected detachments = lambda N dT
```

and therefore

```text
dN/dT = -lambda N.
```

The solution is

```text
N(T) = N0 exp(-lambda T).
```

Thus a memoryless constant sixth-eddy detachment hazard has exactly the mathematical shape of ordinary exponential radioactive decay.

The corresponding half-life is

```text
T_half = ln(2) / lambda.
```

This is conventional probability/calculus once the constant-hazard assumption is made.

## Tritium benchmark

NIST's critical evaluation recommends a tritium half-life of approximately

```text
4500 +/- 8 days
```

which is about

```text
12.32 years.
```

Using `4500 d` as the benchmark, the implied conventional hazard is

```text
lambda_day = ln(2) / 4500
           ~= 0.0001540327068 per day
```

or, using 365.2425 d/y,

```text
lambda_year ~= 0.0562592909 per year.
```

Substitution gives

```text
ln(2) / lambda_year ~= 12.32058 years.
```

This confirms only that the proposed constant-hazard detachment model can reproduce the **form** of tritium's exponential decay when its hazard is calibrated from the measured half-life.

It is **not a prediction**, because the measured half-life was used to determine `lambda`.

## Parent/child count relation

For a one-parent-to-one-detached-event counting model:

```text
dN_parent/dT = -lambda N_parent
```

while the cumulative number of detachments satisfies

```text
dN_detached/dT = +lambda N_parent.
```

Hence

```text
-dN_parent/dT = dN_detached/dT.
```

Within the ADO interpretation, the same local event can therefore be viewed as loss of parent-bound recurrence and production of a newly independent recurrence. This is bookkeeping inside the model, not evidence that cosmic expansion is radioactive decay.

## What the test passes

The sixth-eddy hypothesis passes the **distribution-shape test** under one explicit condition:

> If every bound field has a time/trajectory-independent probability per unit T of reaching the independent-closure condition, the surviving parent population decays exponentially and has a conventional half-life.

This is compatible with radioactive-decay statistics.

## What remains unproved

The important predictive test has **not** been passed yet. ADO must derive the hazard `lambda` from the isotope's own TELE/RF/identity/closure state without using the measured lifetime.

For hydrogen isotopes, a valid test must use one universal encoding/update law and attempt to obtain:

```text
protium   -> stable / no allowed spontaneous decay in the tested channel
deuterium -> stable / no allowed spontaneous decay in the tested channel
tritium   -> finite beta-decay hazard
```

and then predict tritium's `lambda` or half-life within stated error without fitting it to 12.32 y.

The model must then generalize to held-out isotopes. Per-isotope tuning fails the test.

## Sixth eddy vs six orientations

Keep these concepts distinct until a derivation proves they coincide:

```text
6 orientations = +/- phase/orientation across three axes
sixth eddy      = proposed dynamical closure mode enabling independent recurrence
```

Seeing the integer six in both places is not enough to identify them.

## Falsification criteria

The physical sixth-eddy decay interpretation fails if any of the following hold:

1. no isotope-independent TELE/RF encoding yields a closure variable from which `lambda` can be derived;
2. the same rule cannot distinguish stable H-1/H-2 from unstable H-3;
3. predicted decay rates require isotope-specific fitted constants;
4. the predicted waiting-time distribution is systematically non-exponential where ordinary radioactive decay is exponential;
5. the proposed closure variable has no independently measurable or computationally defined counterpart.

## Status

```text
Mathematical shape: PASS, conditional on constant memoryless hazard.
Tritium curve reproduction after calibration: PASS, tautologically/non-predictively.
Stable-vs-unstable hydrogen prediction: NOT YET RUN; elemental TELE/RF nuclear encoding is not yet sufficiently specified.
Absolute tritium half-life prediction: NOT YET DERIVED.
Physical sixth-eddy interpretation: OPEN HYPOTHESIS.
```

The next non-circular experiment is therefore to freeze one isotope encoding law first, derive its sixth-eddy closure/hazard quantity blind, and only then compare the outputs against known isotope stability and half-lives.