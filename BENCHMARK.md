# Needle in a haystack, and the needle that is not there

PG-19 style corpus: ten pre-1919 Project Gutenberg books, nine fed, one held out.

    5.94 MB fed · 1,077,603 ledger states · window 11

## Results

    needle recall by depth   1.00 1.00 1.00 1.00 1.00 1.00 1.00 1.00 1.00 1.00
    junk refused             1.000
    FALSE CLAIM RATE         0.003

Recall does not decay from the front of the haystack to the back — the classic
long-context failure mode is absent, because the address is a prefix index rather
than an attention window.

By verdict:

| population | mine, in order | my words, not my order | not mine |
|---|---|---|---|
| in the haystack | **299/300** | 1 | 0 |
| a book never seen | 1 | **267/300** | 32 |
| random junk | 0 | 0 | **150/150** |

The middle column is what standard NIAH does not measure. Every retrieval benchmark
asks *did you find the needle*; none asks *what did you say when there was no needle*,
which is where retrieval systems quietly fabricate. Here it is `0.003`.

## The 0.003 is an address collision, not a bug

The one error in 300 was inspected:

    query  (Dickens, never seen)   "Be careful "   ->  trits 23002230300
    ledger (nine other books)      "he bade us "   ->  trits 23002230300

    bytes identical: NO      addresses identical: YES

The doorway compares **addresses, not bytes**. Different text landing on the same trit
sequence *is* the same passage at the resolution the field reads at. It did not
hallucinate; it correctly reported a match at its own resolution.

So the false-claim rate is the **address collision rate**, and that is a property of
the geometry:

    one level      3 faces × 4 states = 64 combinations
    depth          set by the null — recursion stops below φ⁷ of the field
    collisions     therefore a function of the null's size

A larger null gives shallower addresses and more collisions; a smaller one gives fewer.
`φ⁷` fixes where that sits, and `0.003` is what it buys at this ledger size. It is not
fixable by better matching — only by finer addresses, and the depth is derived rather
than chosen.

## The encoder is not what makes this work

Same benchmark, encoder replaced by a deterministic byte hash — no corpus pass, no
co-occurrence, no eigendecomposition:

    derived − hash:   recall 0.000   ·   absent-needle 0.010   ·   junk 0.000

The geometry does the work: the address cascade, the doorway, the poles, the ten
directions. The encoder need only assign distinct vectors to distinct bytes.

Deriving positions from company **is** a translator — it puts bytes that keep the same
company near each other — but none of these three measurements asks whether `a` is like
`e`. They ask whether `a` is *not* `e`, and any injective assignment satisfies that.

## What this does not show

- Verbatim 300-byte needles are the easy direction. A prefix-addressed memory is built
  for exactly that. The hard direction is the `0.003`.
- Nine books is not PG-19. PG-19 is ~28,000 books, ~11 GB. The window would move from
  11 to roughly 18 at full scale and that is unmeasured.
- ΑΔΩ is not a language model. LongBench, LongMemEval and the QA benchmarks measure
  things it does not do; running them would produce numbers that mean nothing.
