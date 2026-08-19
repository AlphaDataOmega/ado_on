# Uploading a corpus — terms, scan, and citation

These are the conditions for adding a corpus. They are short because they are meant to be
read, and they exist because every single corpus sourced for this project so far carried a
rights trap that was invisible from the filename.

Naming throughout this document is provisional and awaits V.

---

## 1. What you are warranting

By uploading you state, and take responsibility for stating, that:

1. You have the right to supply these bytes for this purpose.
2. The rights position you declare is accurate to the best of your knowledge, and you
   have read the material's own rights statement rather than assumed one.
3. You are declaring the correct **layer**. This is the trap that catches most people —
   see §3.
4. You are not laundering a licence. If the material is NonCommercial, ShareAlike or
   NoDerivatives upstream, it remains so downstream, and no badge on a repository changes
   that.

You keep your corpus. Admission grants hosting and pinning, nothing else. No copyright is
transferred, and the software licence (PolyForm Noncommercial 1.0.0) does not extend over
the material in `Δ/` — see `NOTICE`.

If you are wrong, say so and it is removed. There is no penalty for a good-faith error
found later; there is one for a bad-faith declaration.

---

## 2. The scan

`node scan.js <file>` runs before anything else and returns one of four verdicts.

| Verdict | Meaning | What happens |
|---|---|---|
| `STOP` | A restriction is stated in the material itself | Not admitted. No citation clears it |
| `HOLD` | A condition exists that must be resolved in writing | Not admitted until the entry names the layer, licence and attribution |
| `NOTE` | Rights signals present | A reviewer reads them |
| `CLEAR` | No rights signal found in the bytes | **Not a pass.** See below |

**`CLEAR` is not permission.** A bare text file with no header has no signals to find, and
that tells you nothing about whether you may use it. Provenance for a `CLEAR` file has to
come from outside the file, and the citation block is where it comes from.

The scan is deliberately noisy. A false alarm costs a reviewer a minute; a missed
ShareAlike costs the project its licence position.

---

## 3. Which layer are you uploading?

Ancient and historical texts almost always come wrapped in a modern editorial layer, and
the two have different owners. The author died in 1536; the person who transcribed,
edited, annotated or typeset the edition you downloaded may be alive.

A real example, from the Westminster Leningrad Codex's own rights statement:

> Lemma and morphology data are licensed under a Creative Commons Attribution-ShareAlike
> license … The text of the WLC remains in the public domain.

Two layers, two licences, one file. Ingest the text and you are fine. Ingest the
morphology and you have taken on ShareAlike for everything downstream of it.

So `rights.layer` is mandatory whenever the scan detects layering, and `rights.excluded`
must say what you removed and how. "I only took the text" is not an answer;
"stripped all `<lemma>` and `<morph>` elements, see `ingest.steps`" is.

---

## 4. The citation block

Every entry carries one. These fields are always required:

```json
{
  "work":   { "title": "", "creator": "", "year": 0 },
  "source": { "url": "", "retrieved": "", "sha256": "" },
  "ingest": { "read_as": "latin1", "steps": [] },
  "frame":  { "rule": "", "delims": [] }
}
```

- **`work.creator`** — author, translator, or both, and say which. Tyndale translated the
  New Testament; he did not write it. Getting this wrong misattributes a work.
- **`work.year`** — the year of *this edition*. Not of composition. A 1924 translation of
  a third-century text is a 1924 work for rights purposes.
- **`source.sha256`** — of what you fetched, **before** cleaning. This is what makes the
  ingest reproducible; without it nobody can check your steps.
- **`ingest.steps`** — every transformation in order. Anyone re-running them on the source
  must land on your τ hash exactly, or the entry fails its first gate.
- **`ingest.read_as`** — `latin1` or `utf-8`. Getting this wrong silently corrupts
  multi-byte text; see `ENCODING.md`.

The scan adds further required fields depending on what it found:

| If the scan finds | You must also declare |
|---|---|
| Layered rights, or ShareAlike | `rights.layer`, `rights.excluded` |
| Attribution required | `rights.attribution` (verbatim), `rights.licence` |
| A modern critical edition | `editorial.editor`, `editorial.status` |
| A public-domain claim | `rights.basis` |

**`rights.basis` deserves its own note.** "It says public domain" is not a basis. A basis
is one of: *published before 1931* (US, on age), *dedicated by the rights holder* (link
it), or *a government work*. If you cannot name one, the entry is `HOLD`.

`node scan.js <file>` prints the exact list of fields your particular upload must carry.

---

## 5. Attribution is a feature, not a tax

Where a licence requires credit, the attribution string is stored on the entry and
displayed anywhere the corpus is used. It is not buried in a metadata file. Somebody
transcribed, proofread or edited the text you are about to feed to a machine, and often
did it unpaid — the credit line is the whole of what they asked in return.

Entries may also carry optional citation metadata beyond the required set: a DOI, a
bibliography entry, a link to the scanning institution, the shelfmark of the manuscript.
Supply it if you have it.

---

## 6. Takedown

Write to the address in `NOTICE`. Include the entry id and the basis of the claim. A
contested entry is delisted while it is examined, not after. The τ file remains pinned by
content address — pinning cannot be undone by us alone — but the entry stops being served
from the registry and stops appearing in any recipe.

---

## 7. What this does not cover

This document is about rights in the material. It says nothing about whether the material
is *any good*, whether it is framed correctly, or whether the corpus reads itself — those
are separate gates and they are mechanical. See `GOVERNANCE.md` for how a proposal moves
and `CONTRIBUTING.md` for the technical path.

It is also not legal advice, and none of the people reviewing are your lawyers.
