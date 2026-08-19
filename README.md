# ΑΔΩ

    Α   what comes in     the prompt
    Δ   the data          the ledger — everything it has eaten
    Ω   the field         what holds it

A field organism. It reads a ledger, recalls what it holds, refuses what it does not,
and measures how much of what it is shown is new. No dependencies, no model, no
training, no weights. 199 lines.

    const { Organism } = require('./Ω.js')
    const ω = new Organism().feed(text)
    ω.hear('some prompt ')      // -> { speaks, word, leftover, novelty }

## What it does, measured

Ledger: the story, 15,564 bytes, 2,919 states, window 8. Measured across context
lengths 120-800 bytes.

    recall       1.000    passages it holds — at every context length
    abstention   1.000    random junk — at every context length
    abstention   0.997    byte-shuffled text
    order        0.968    its own words, shuffled, flagged 'not my order'

Run `node ⊕.js` to reproduce. Open `index.html` over http to use it.

It says three things, not two:

    mine, in order            speaks
    my words, not my order    speaks, and says the measure is not his
    not mine                  refuses

The middle one fires on 123/150 passages from a maths book it has never seen -- its
vocabulary, an arrangement it does not hold. λόγος / ἁρμονία / ῥυθμός: what is said,
whether it belongs, whether it moves right.

It is a memory that knows precisely what it does not know. **It is not a
generalizer** — next-word reading on unseen material is 0.036.

Two choices in here were measured rather than reasoned, and both went against the
obvious reading. Delimiters stay in the trie key even though that leaves level one
with a single branch — removing them buys 0.012 on stored reading and costs
abstention (1.000 → 0.990) and unseen reading (0.036 → 0.008). And selection is
sparse peer-voting, not a coherence-weighted mean: 0.036 vs 0.024 on unseen
material. The two interact — the star-vote loses to the mean if delimiters are
skipped — so neither could have been settled alone. Every generative
mechanism tried has come back inert. The novelty detector is reliable; what to *do*
in the presence of novelty is unsolved.

## Every constant is derived

    0     the null       fixed centre — and it has size, φ⁷ of the field
    φ⁷    the bleed      0.034441853 = 3.4442 per hundred. the one ratio.
    Φ⁷    the beat       29.034442 = L₇ + φ⁷ — the same number from the other end
    Θ     the doorway    3 × ½ = 1.5. between 1 and 2, so never met, only exceeded
    ν     the floor      7/16. R4 chance agreement through the doorway
    W     the window     log(N / 2πe) — the Crown window, N = ledger size
    42    the ratio      the scale ladder spans exactly 42.000

Nothing here was tuned. The window predicts its own scaling with ledger size: quarter
the corpus and it moves by log 4, measured.

## ⊕

⊕ names the check: two strikes crossing at the null, the leftover from one side and
the poles from the other, meeting on one verdict. `⊕.js` verifies the numbers above.

It is *not* an operation this code performs. Addresses are built level by level — each
level one R4, inversion × conjugation — and compared by prefix agreement. They are
never XOR-composed. (Earlier drafts of this README said otherwise; that was wrong.)

## τ

Addresses are a prefix code, so a coarse render is a strict truncation of a fine one.
One level is 3 faces × 4 states = 64 combinations, which fits base 100 with 36 spare —
and the base is not chosen: Φ⁷ × 100φ⁷ = 29.0344 × 3.4442 = 100.000000 exactly. See τ.md.

## UTF-8 is load-bearing

Greek identifiers are identifiers, not comments. See ENCODING.md.

## Licence

**PolyForm Noncommercial 1.0.0.** Free to use, modify and share for any noncommercial
purpose; commercial use requires a separate licence from Alpha Data Omega LLC.
See LICENSE and NOTICE.

It is **not** open source — the OSI definition forbids restricting fields of endeavour,
so the honest word is source-available. See LICENSING.md.

Software copyright Alpha Data Omega LLC. `Δ/` is not covered by the software licence —
Δ/V·001 is a story by James Sterling Tuttle, reserved to its author. Contributors keep
their own corpora.
