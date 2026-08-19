# Crawling addendum — boron-to-hydrogen midpoint walk — 2026-08-19

This checkpoint freezes the current ADO encoding derivation from the candidate boron identity coordinate `05` toward the candidate primitive hydrogen identity `01`. It is an address/relational derivation, not a physical recipe for transmuting boron into hydrogen.

## Endpoints

Candidate elemental identity coordinates:

```text
Boron:    05
Hydrogen: 01
```

The coarse identity displacement is

```text
5 - 1 = 4.
```

The arithmetic midpoint is

```text
(5 + 1) / 2 = 3.
```

Thus the coarse relational path is

```text
05 -> 03 -> 01.
```

The `03` state is treated here as the relational midpoint of the endpoint addresses, not automatically as a physical element identification.

## Symmetric nested-scale approach

Let

```text
epsilon_k = 10^(-k).
```

Define symmetric endpoint trajectories toward the midpoint:

```text
B_k = 3 + 2 epsilon_k
H_k = 3 - 2 epsilon_k.
```

Examples:

```text
k=1:  3.2   | 3 | 2.8
k=2:  3.02  | 3 | 2.98
k=3:  3.002 | 3 | 2.998
```

At every depth,

```text
(B_k + H_k)/2 = 3.
```

The separation is

```text
D_k = B_k - H_k = 4 epsilon_k = 4 * 10^(-k).
```

Therefore the two finite trajectories approach the same limiting midpoint while retaining nonzero separation at every finite scale.

## Irrational trajectory modulation

Irrationals are not inserted as preferred constants. They may be used as nonterminating trajectory ledgers within each unresolved scale.

For an irrational `alpha`, define the fractional scale phase

```text
r_k(alpha) = fractional_part(alpha * 10^k).
```

Then a symmetric irrationally modulated pair is

```text
B_k(alpha) = 3 + 2 epsilon_k r_k(alpha)
H_k(alpha) = 3 - 2 epsilon_k r_k(alpha).
```

The midpoint remains exactly

```text
(B_k(alpha) + H_k(alpha))/2 = 3
```

while instantaneous separation becomes

```text
D_k(alpha) = 4 epsilon_k r_k(alpha).
```

Thus, in this candidate representation:

```text
irrational ledger -> trajectory information
3                  -> relational midpoint invariant.
```

The irrational changes the path without changing the symmetric midpoint.

## Relation to the recurring six

The midpoint value `3` has the already frozen two-orientation factorization

```text
3 * 2 = 6.
```

This is a relational/orientation count in the ADO grammar. It is not evidence by itself that a physical six-state system lies between boron and hydrogen.

The coarse endpoint relation may be written

```text
1 | 3 | 5
```

with total endpoint width `4` and midpoint `3`.

## Candidate hydrogen primitive

If the surviving central ADO identity coordinate is later validated as atomic number `Z`, the backward elemental walk is

```text
5 -> 4 -> 3 -> 2 -> 1
B -> Be -> Li -> He -> H.
```

Hydrogen would then occupy the primitive nonzero elemental identity coordinate

```text
01.
```

This remains a correspondence hypothesis until the same frozen nested rules reproduce independent hydrogen observables.

## Nuclear reality guardrail

Physically converting a boron nucleus into hydrogen nuclei is a nuclear reaction. The ADO address walk above does not specify such a reaction and does not override conservation of charge, baryon number, energy, momentum, or known nuclear dynamics.

The phrase "extract hydrogen from boron" in this checkpoint means extracting/deriving the candidate hydrogen **address relation** from the candidate boron address.

## Next adversarial backward walk

Keep the encoding frozen and compare the successive identity coordinates

```text
5 -> 4 -> 3 -> 2 -> 1
```

against independently measured properties of

```text
B -> Be -> Li -> He -> H.
```

Track separately at each transition:

- elemental identity (`Z`);
- stable/unstable isotope structure;
- contained neutron-count differences;
- electron-shell configuration;
- spectral/harmonic relationships;
- scale-residual/trajectory midpoint structure.

If the same nested address law fails at Be, Li, He, or H, preserve the failure rather than adding element-specific rules.

## Status

```text
Checkpoint: Crawling addendum
Walk: candidate B(05) -> H(01)
Coarse midpoint: 03
Finite separation: 4 * 10^(-k)
Irrational role: nonterminating trajectory modulation
Physical transmutation claim: none
Elemental-address correspondence: unproved
```
