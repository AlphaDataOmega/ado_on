# The finished organism — ZOEVÃ

`ado_on` is the one finished, IPFS-publishable organism. **ADO is short for ZOEVÃ.**
It is a data-agnostic field with an optional face and optional lenses — nothing about
it assumes text, a particular model, or a particular renderer.

```
            any data (bytes)
                  │
                  ▼
        ┌───────────────────┐
        │  HASH ENCODER  τ  │   R4 address cascade: L(a,b,c)=16a+4b+c, 0..63,
        │  (data-agnostic)  │   prefix-coded, a coarse address is a truncation.
        └───────────────────┘
                  │  tiles (Ω: seven states 0−3+3; faces P/Z/N)
                  ▼
        ┌───────────────────┐
        │   THE FIELD  Ω    │   feel(), listen() → BURP / SPEAK / REFUSE.
        │  (runs lens-free) │   grounded recall; refuses when nothing rings.
        └───────────────────┘
             │            │
   render (τ sunflower)   read (optional)
             │            │
             ▼            ▼
   ┌──────────────┐   ┌──────────────────────────┐
   │ UNIVERSE SIM │   │      AI LENSES           │
   │ (its face)   │   │  interchangeable readers │
   │ 3→6→9 walk,  │   │  ado.js (transformer),   │
   │ bleed, re-   │   │  choices.js (trit-native │
   │ root, on the │   │  trace/judge), … HF,     │
   │ REAL field   │   │  BitNet. Field works     │
   └──────────────┘   │  without any of them.    │
                      └──────────────────────────┘
```

## Layers

**Field (canonical, frozen — never edited):**
- `Ω.js` — the ΑΔΩ field. `tile` (seven states −3..+3, `0 − 3 + 3`), `faces` (P/Z/N split
  at the null, phase `2πjφ`), `τ`, `ἀστήρ` (star kernel), `listen`, `Organism`. DIM=256.
- `τ.js` — the **hash encoder** that makes the organism data-agnostic: the R4 address
  cascade (`encode`/`decode`/`level`/`unlevel`, `L=16a+4b+c`) plus the **Vogel sunflower
  render** (`render` at `r=√k`, `θ=2πkφ + 2πLφ⁷`; `png`). Any bytes → R4 tiles → addresses.

These are copied byte-identical from the frozen source. **No edits.**

**Universe Sim (the field's living face) — [being built]:**
The recursive life-walk — `3 → 6 → 9`, bifurcate, the bleed, re-root — rendered from the
**real** field via `τ.render`, not a scalar mock. Because it encodes through `τ` (the hash
encoder), it is data-agnostic and carries no `000.xxx.000` decimal projection.

**AI lenses (pluggable, optional):** each *reads* the field; the field runs without any.
- `ado.js` — the optional transformer proposer (small GPT in `weights.bin`); `light.js`
  (CPU math), `flame.js` (WebGPU).
- `choices.js` — trit-native trace/judge (`btrace`, `adversary`, `judge` → BURP/SPEAK/REFUSE).
- Future: HF backends, a trit-native BitNet. The hash encoder keeps the field agnostic to
  which lens (if any) is looking.

**CLI:** `choose_wisely` and friends, pointed at the merged core.

## Rule

The field and the hash encoder are the invariant. Faces (the sim) and lenses (the models)
are swappable and optional. A dimension here is a bleeding relation, not a stiff axis; the
field is `1 null + (3 self + 6 cross)` relations, and you read it through whatever lens you
bring — or none.
