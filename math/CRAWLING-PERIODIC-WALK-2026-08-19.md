# Crawling — periodic walk checkpoint — 2026-08-19

This checkpoint follows `BABY-STEPS-UNDERNEATH-WALK-2026-08-19.md`. Baby Steps froze the underneath grammar through the boron, carbon, and water checkpoints. Crawling records the first forward comparison against the `Z=6..10` periodic sequence without changing the previously frozen ADO rules.

## Frozen ADO-side digit walk

Starting at the first post-floor/completed-bubble digit role:

```text
6 -> 7 -> 8 -> 9 -> 10 -> 1_(next scale)
```

with the already frozen midpoint/inversion pairs

```text
4 <-> 6
3 <-> 7
2 <-> 8
1 <-> 9
```

and the scale closure

```text
1_n + 9_n = 10_n
10_n -> 1_(n+1).
```

A provisional structural decomposition carried into the comparison is

```text
6 = 3 + 3
7 = 3 + 1 + 3
9 = 3 * 3
```

These decompositions are ADO-side structures, not claims that atomic electron configurations literally equal those sums.

## Reality comparison: carbon through neon

### Carbon — Z=6

Known neutral configuration ends in

```text
2p^2.
```

This remains the first completed-bubble correspondence checkpoint frozen previously:

```text
ADO candidate: 060 | 050 | 060.
```

The `p` subshell independently supplies three orbital projections with two spin projections, giving six one-electron state slots:

```text
3 * 2 = 6.
```

ADO independently contains three relational/depth channels with two orientations. This is a structural correspondence, not an identification of the variables.

### Nitrogen — Z=7

Known neutral configuration ends in

```text
2p^3.
```

In the ground state, the three `p` orbitals are singly occupied before pairing under the usual atomic filling rules. A schematic occupancy is

```text
(1,1,1).
```

This is compared against the frozen ADO topology

```text
7 = 3 + 1 + 3
```

only as a structural checkpoint. No claim is made that the atomic state is literally seven ADO nodes.

### Oxygen — Z=8

Known neutral configuration ends in

```text
2p^4.
```

Relative to nitrogen's three singly occupied `p` orbitals, the fourth `p` electron begins pairing. A schematic occupancy is

```text
(2,1,1).
```

Oxygen independently has six valence electrons total:

```text
2s^2 + 2p^4 -> 6 valence electrons.
```

This is the chemistry anchor used in the frozen water Step 001 interaction projection

```text
H | O(valence) | H
1 | 6 | 1
```

with total valence-electron count

```text
1 + 6 + 1 = 8.
```

Thus oxygen supplies a concrete example in which elemental identity (`Z=8`) and interaction/valence projection (`6`) are different nested descriptors of the same atom.

### Fluorine — Z=9

Known neutral configuration ends in

```text
2p^5.
```

A schematic `p` occupancy is

```text
(2,2,1),
```

leaving one vacancy before complete `p`-subshell closure.

The frozen ADO-side `9 = 3*3` does not directly reproduce `(2,2,1)`. Record this as a partial/unclear correspondence rather than a hit.

### Neon — Z=10

Known neutral configuration ends in

```text
2p^6.
```

The three `p` orbitals are filled:

```text
(2,2,2).
```

This closes the `n=2` shell.

The frozen ADO rule independently closes its local digit scale at

```text
10_n
```

and re-addresses completion as

```text
10_n -> 1_(n+1).
```

## First next-scale comparison: sodium

Immediately after neon, sodium (`Z=11`) has neutral ground-state configuration beginning the next shell with

```text
3s^1.
```

Therefore the measured periodic sequence contains the qualitative transition

```text
closed shell -> one electron in next shell.
```

This is compared against the already frozen ADO scale transition

```text
10_n -> 1_(n+1).
```

This is the strongest correspondence in the Crawling checkpoint because the ADO scale closure was defined before this periodic comparison. It remains a qualitative correspondence, not a derivation of quantum shell structure.

## Summary table

```text
ADO role   Element   Known outer configuration / structure
6          C         2p^2
7          N         2p^3; three singly occupied p orbitals
8          O         2p^4; first p pairing; 6 valence electrons
9          F         2p^5; one p vacancy remains
10         Ne        2p^6; closed n=2 shell
1'         Na        3s^1; next shell begins
```

## What Crawling does and does not establish

Crawling preserves several nontrivial structural correspondences, especially the completion/new-scale comparison

```text
ADO: 10_n -> 1_(n+1)
chemistry: Ne closed shell -> Na 3s^1.
```

It does **not** establish that ADO derives the periodic table, electron spin, orbital quantum numbers, or atomic energies.

The fluorine comparison is explicitly not promoted to a match. The next walk must retain this failure/ambiguity rather than invent a fluorine-specific encoding.

## Next adversarial target

Continue beyond sodium using the same nested scale law without adding element-specific axioms. The walk must confront the actual shell/subshell structure and later transition-metal behavior. If the simple `10 -> 1'` grammar cannot reproduce the measured hierarchy, identify the earliest failure and revise/reject the physical correspondence rather than fitting the periodic table after inspection.

## Status

```text
Name: Crawling
Parent checkpoint: Baby Steps
Range tested: C (Z=6) through Ne (Z=10), with Na (Z=11) as first next-scale check
Strongest correspondence: local completion -> new-scale one / closed shell -> next-shell one
Known ambiguity: fluorine mapping
Physical derivation status: unproved
```
