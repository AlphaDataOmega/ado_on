<h1 align="center">the well</h1>

<p align="center"><em>Unlimited context in. Grounded recall out. And when the field is dry, it says so.</em></p>

<p align="center">
  <a href="#what-this-is">What this is</a> •
  <a href="#the-honest-part">The honest part</a> •
  <a href="#use-it">Use it</a> •
  <a href="#as-an-mcp-tool">As an MCP tool</a> •
  <a href="#with-kith">With kith</a>
</p>

---

## What this is

An agent's context window is small and its memory is a guess. The **well** is
the organ that fixes both: pour as much content into it as you like (it lives
on disk, not in the prompt), draw the nearest grounded passages back out, and
— the part that matters — get an honest **ABSENT** when the field does not
actually hold what you asked for.

Three verbs, and only three:

```
  feed(text | file)   pour content into a universe (unlimited external context)
  recall(query)       draw the nearest grounded passages back out, with scores
  ask(question)       PRESENT with grounded evidence, or ABSENT — no confabulation
```

The well does **not** generate language. It holds, retrieves, and abstains.
Generation belongs to the agent that drinks from it; the well's job is to
make sure the agent drinks only what is really there.

## The honest part

Abstention is where memory systems quietly lie — they always return *something*,
and something always looks like an answer. The well abstains **by
construction**, and the rule is a faithful reading of the ΑΔΩ research finding
that *absence is a lack of signal, not a low score*:

> A query is **grounded** only if the field has a **pole** for it — the top
> match must share a real content word with the query *and* rise above the
> field's own background. Character-gram texture alone never grounds. When the
> top match does not separate from the noise, the field is a flat plateau, and
> a flat plateau means **ABSENT.**

This is honest about its own ceiling, too: v0.1 is a light, dependency-free
lexical field — real recall, real abstention, but not semantic understanding.
It is the substrate the research pushes toward 1.00 recall and calibrated
abstention, and the harness for measuring how close it gets — not a box that
claims those numbers on day one.

## Use it

```bash
well feed -f ./notes.md                    # pour a file into the default universe
well feed "a fact worth remembering"       # or raw text
well recall "what did I say about X"        # nearest grounded passages + scores
well ask "does the field hold Y"            # PRESENT (grounded) or ABSENT (no pole)
well -u research feed -f paper.txt          # named universes run side by side
well scale "any text" -d 16                 # descend the data-agnostic scale — the dial
well stats                                  # what a universe holds
```

**The scale.** `well scale` (and the `well_scale` MCP tool) run the codec the
whole ecosystem stands on — [`scale.js`](scale.js): don't store a value, store
its relationship to a key and descend the scale in trits. `d` is the dial —
there's no floor, only a rate. See [ECOSYSTEM.md](ECOSYSTEM.md) and
[FINDINGS.md](FINDINGS.md).

**Content-addressed & forkable.** A folded field can leave the machine as a real
**IPFS CID** and come back by it — git-for-fields on decentralized storage:

```bash
well export -u dogs             # fold the field → bafkrei…  (a real IPFS CIDv1)
well pin  <cid>                 # make it retrievable (local ipfs node / pinata)
well fork <cid> -u mine         # pull a shared field into your own, CID-verified
well merge dogs space -o both   # superpose two fields into one → a new CID
```

Import/fork **verify the CID** — a single changed byte moves it, so a shared
field is tamper-evident. The CID is computed locally (dependency-free) and
matches `ipfs add --raw-leaves --cid-version 1` exactly.

**Stored compressed.** The well doesn't just *offer* the codec — it stores its
field on it. Each chunk's dense embedding is folded to depth `$WELL_D` (default
8) and packed as trits, so a universe on disk is a fraction of the float size
and **`WELL_D` is a live recall/size dial**: `WELL_D=4` is ~6× smaller with
recall intact, `WELL_D=24` is exact. Recall keeps the pole rule (a shared
content word), so abstention stays honest after compression.

Each universe is a compact file under `$WELL_HOME` (default `~/.well`). Run as
many as you like — the beginning of spinning up more than one field-system.

## As an MCP tool

The well speaks the Model Context Protocol over stdio (zero dependencies), so
an AI can drink from it mid-thought. Register it with Claude Code:

```bash
claude mcp add well -- node /path/to/well/mcp/server.js
```

It exposes `well_feed`, `well_recall`, `well_ask`, `well_stats`, and `well_scale`. From then
on an agent can feed a universe and then ask it questions, getting grounded
evidence or an honest ABSENT — without ever loading the corpus into its
context window. *This is the point: the agent runs a universe in the
background while people still talk to it normally.*

## With kith

The well is the memory organ; [kith](https://github.com/AlphaDataOmega/kith)
is the table where agents meet. They fit together exactly. A **well-backed
seat** (`adapters/kith-well.js`) COMMITs only when the field grounds a claim,
and casts the gate's **NOTHING** — a real, *measured* abstention — when the
field is dry. kith's "I don't know" stops being a guess and becomes "not in
the field."

```bash
node test/well.test.js   # every primitive, offline
```

---

<p align="center"><sub>
PolyForm Noncommercial 1.0.0 · part of the ZOEVÃ / Alpha Data Omega ecosystem, beside <a href="https://tinyhive.ai">TinyHive</a> (kin) and kith (the table).<br>
Draw from it without limit. What you pull is really there. And a dry well says dry.
</sub></p>
