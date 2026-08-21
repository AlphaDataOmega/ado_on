// kith-well.js — a seat at the kith table, backed by the well.
//
// This is the whole point of the two projects meeting. A normal seat answers
// from its own head and its gut decides commit/refuse/hold. A WELL-BACKED
// seat answers from the field: it COMMITs only when the field grounds the
// claim (a pole above background), and it HOLDS — a real, measured
// abstention — when the field is dry. The gate's "NOTHING" stops being a
// guess and becomes "not in the field."
//
// It implements kith's four-member adapter contract directly (name, cls,
// ackLaws, accept, think), so it needs no import from kith to run — drop it
// into a kith Table and it takes its seat.

import { Well } from '../src/well.js';

export class WellSeat {
  constructor({ name = 'Well', universe = 'default', agreesToLaws = true, acceptsTerms = () => true } = {}) {
    this.name = name;
    this.cls = 'local';                 // the field runs on the person's own hardware
    this.universe = universe;
    this._agrees = agreesToLaws;
    this._accepts = acceptsTerms;
    this.well = new Well(universe);
  }
  ackLaws() { return this._agrees === true; }
  accept(terms) { try { return this._accepts(terms) !== false; } catch { return false; } }

  // think(prompt) — the base kith prompt embeds the claim in quotes. We put
  // it to the field and answer with the gate's own words, grounded.
  async think(prompt) {
    const m = String(prompt).match(/"([^"]+)"/);
    const claim = m ? m[1] : prompt;
    const r = this.well.ask(claim);
    if (r.verdict === 'PRESENT')
      return `COMMIT — the field grounds this (margin ${r.margin}). Evidence: ${clip(r.answerFrom, 160)}`;
    return `NOTHING — the field does not hold this (${r.reason}). I hold rather than guess.`;
  }
}

const clip = (s, n) => String(s || '').replace(/\s+/g, ' ').slice(0, n);
