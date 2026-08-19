# Encoding

Two rules, and they point in opposite directions. Getting them the wrong way round
produces a `SyntaxError` in one direction and silent corruption in the other.

    CODE is text.       Read Ω.js, τ.js, ⊕.js as UTF-8.
    SOURCE is bytes.    Read anything you feed to τ.encode() as latin1.

---

## Code: UTF-8, and it is load-bearing

`Ω.js` uses Greek for the derived constants — these are **identifiers, not comments**:

    φ    golden ratio
    φ7   the bleed      φ⁷ = 0.034441853, the null : field ratio
    Φ7   the beat       29.034442 = L₇ + φ⁷
    Θ    the doorway    3 × ½ = 1.5
    ν    the floor      7/16, R4 chance agreement
    θ  τ  ἀστήρ         the doorway, the cascade, the star kernel

If anything in the serving path re-encodes or strips non-ASCII, the file stops
parsing. Verified:

    utf8 -> bytes -> utf8      byte-identical, loads, constants correct
    utf8 read as latin1        SyntaxError: Invalid or unexpected token

Requirements for any host, CDN or gateway:

    Content-Type: application/javascript; charset=utf-8
    <script charset="utf-8">   or a UTF-8 <meta> on the page
    no minifier or transform configured with a non-UTF-8 default

**Test after deploying:** fetch the served file and check
`φ7 === 0.034441853748633046`. If the constant is right, the encoding survived.

Filenames are UTF-8 too, and percent-encode in URLs:

    Ω.js  -> %CE%A9.js        τ.js -> %CF%84.js
    ⊕.js  -> %E2%8A%95.js     Δ/V·001 -> %CE%94/V%C2%B7001

All are Basic Multilingual Plane, one UTF-16 unit each. Nothing here is astral —
`𝔽` (U+1D53D) was considered for the four-group and rejected for exactly that reason:
a surrogate pair breaks more tooling than a Greek letter does.

---

## Corpora: latin1, one char one byte

`Ω` is byte-oriented. `bytes()` does `charCodeAt(i) & 255`, so **anything above 255 is
silently truncated**. Feed it utf8-decoded text and every multi-byte character is
mangled — the story's en dashes became `0x13` and the τ round trip could not close.

    node:     fs.readFileSync(f, 'latin1')
    browser:  fetch(f).arrayBuffer(), then String.fromCharCode over the Uint8Array

This bites when you **encode**, not when you read a `.100`. A `.100` is ASCII by
construction — digits, colon, dot, space, newline — and `TAU100/1` is an ASCII magic
for the same reason. An earlier version wrote the magic as `τ1`, which latin1 truncates
to byte 196, putting one mojibake byte in the identifier of every file. It was harmless
only because `decode()` discards line one.

`τ.js` will tell you: if `encode`/`decode` does not round trip, the source was read
as text.
