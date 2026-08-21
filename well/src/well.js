// well.js — the core API. Three verbs, and only three:
//   feed(text|file)  — pour content into the field (unlimited external context)
//   recall(query)    — draw the nearest grounded content back out
//   ask(question)    — recall, and DECIDE: grounded answer, or ABSENT
//
// The well does not generate language. It holds, retrieves, and — the honest
// part — abstains. Generation belongs to the agent that drinks from it; the
// well's job is to make sure the agent drinks only what is really there, and
// to say "dry" when it is not.

import { readFileSync } from 'node:fs';
import { load, save, addChunks } from './store.js';
import { chunk } from './chunk.js';
import { denseRecall } from './dense.js';

export class Well {
  constructor(universe = 'default') { this.store = load(universe); }

  feed(input, { source = null, now = null } = {}) {
    const text = looksLikePath(input) ? readFileSync(input, 'utf8') : String(input);
    const src = source || (looksLikePath(input) ? input : 'inline');
    const pieces = chunk(text);
    const n = addChunks(this.store, pieces, src, now);
    save(this.store);
    return { fed: n, chunks: this.store.chunks.length, source: src, universe: this.store.universe };
  }

  recall(query, k = 5) {
    if (!this.store.chunks.length) return { grounded: false, empty: true, hits: [], universe: this.store.universe };
    return { ...denseRecall(this.store.chunks, query, k), universe: this.store.universe };
  }

  // ask — the well's verdict. It returns the grounded evidence and whether it
  // stands, so the agent can either answer FROM the evidence or ABSTAIN.
  ask(question, k = 5) {
    const r = this.recall(question, k);
    if (r.empty) return { verdict: 'ABSENT', reason: 'the field is empty — nothing has been fed', evidence: [], ...signal(r) };
    if (!r.grounded) return { verdict: 'ABSENT', reason: 'no pole — the top match does not separate from the field background', evidence: r.hits.slice(0, 2), ...signal(r) };
    return { verdict: 'PRESENT', reason: 'grounded — the field holds this above its background', evidence: r.hits, answerFrom: r.hits[0]?.text || '', ...signal(r) };
  }

  stats() { return { universe: this.store.universe, chunks: this.store.chunks.length, ...this.store.meta }; }
}

function signal(r) { return { top: r.top, background: r.background, margin: r.margin }; }
function looksLikePath(s) { return typeof s === 'string' && s.length < 400 && /^(\.?\/|~|[A-Za-z]:\\)/.test(s) && !/\n/.test(s); }
